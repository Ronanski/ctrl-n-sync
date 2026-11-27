// 3.2.1 (IRENE: MAKE-UP WATER and CLOSED COOLING WATER plant model, unit.js AN_MU / AN_ACW; docs/versions/v3.2.1/MU_CCW_PLANT_MODEL.md).
// The one world ON (ABC + DITL), plant model ON. Checks:
//  150 MW (Start at 150 MW + the DITL in service): ACWP-A runs, ACWP-B standby in AUTO (27.PNG); loop 1500 m3/h, PT-CW1152 7.8,
//    PT-CW1153 7.2 kg/cm2 (Phase 11: MB-021; was 27.PNG 6.4 / 5.2), supply between 30 and 34 C (energy balance; was 27.PNG 40 / 38), ACWP current from the motor data (26.8 A); the logic reads the same numbers
//    (DITL-76 row 28 PT-CW1152, DITL-41 row 14 PT-CW1156, DITL-21A row 13 TT-CW1060, DITL-112 row 28 PT-MU0709); MWP header 9.0 kg/cm2
//    (28.png); no low-flow switch FS-CW1060 made;
//  ACWP-A trip (DITL-76 row 3 I.0087): the logic starts ACWP-B (DITL-77 auto start), the flow and pressure come back;
//  all SWBP tripped (no seawater in the CCWHE): the loop warms (TT-CW1152 > 45 C after 10 min);
//  Cold (every pump stopped): no flow, the header at the static head (PT-CW1152 < 3.5 = the low pressure of DITL-41 / 76), the flow
//    switches FS-CW1060 made (low flow), the make-up header at the static head of the demi tanks (< 5.5 kg/cm2).
// Usage: node tests/regress/mu_ccw_model.js [html]
const fs = require('fs');
const { open } = require('./lib.js');
const html = process.argv.find(a => /\.html$/.test(a)) || 'dist/' + fs.readdirSync('dist').find(x => /^logic-sim-v[\d.]+(?:-beta\.\d+)?\.html$/.test(x));
(async () => {
  const { browser, page, errs } = await open(html);
  let fail = 0;
  const ck = (ok, w) => {
    console.log((ok ? 'PASS ' : 'FAIL ') + w);
    if (!ok) fail++;
  };
  await page.waitForFunction(() => AN.sheets && AN.sheets.length >= 54 && window.WORLD && WORLD.idx && S.sheets.length >= PRE_N, null, { timeout: 120000 });
  await page.waitForTimeout(2000);
  const r = await page.evaluate(async () => {
    const C1 = AN.sheets.find(s => s.name === 'ABC-001C');
    const run = async sec => {
      for (let i = 0; i < sec * 2; i++) {
        AN.stepSet(C1, 0.5);
        WORLD.tick(0.5);
        if (i % 100 === 99) await new Promise(r => setTimeout(r, 0));
      }
    };
    const sh = n => S.sheets.concat(WORLD.inst || []).find(x => x.name.endsWith(n));
    const out = (n, row) => {
      const s = sh(n),
        o = WORLD._o && WORLD._o[s.name];
      return o ? ((o.has ? o.has(row) : o.includes(row)) ? 1 : 0) : null;
    };
    const set = (n, row, v) => {
      WORLD.live = true;
      const ok = WORLD.dset(n, row, v);
      WORLD.live = false;
      return ok;
    };
    const f = x => Math.round(x * 1000) / 1000;
    const snap = () => {
      const U = AN.unit;
      return {
        n: U.acN, Q: U.acQ, P1: f(U.acP1), P2: f(U.acP2), P6: f(U.acP6), load: f(Object.values(U.acLoad || {}).reduce((a, b) => a + b, 0)), T1: f(U.acT1), T2: f(U.acT2), Tb: f(U.bwA2) /* 3.2.4-beta.71: cooler A water outlet of AN_BAC */, I: [f(U.acI0), f(U.acI1)], muP: f(U.muP), muN: U.muN,
        d76: (sh('DITL-76').avw || {}).r28, d41: (sh('DITL-41').avw || {}).r14, d21: (sh('DITL-21A').avw || {}).r13, d112: (sh('DITL-112').avw || {}).r28,
        fs: (WORLD.plantSw() || []).filter(x => /FS-CW1060/.test(x.tag) && x.on).length,
        autoB: out('DITL-77', 0), runB: out('DITL-77', 4)
      };
    };
    const o = {};
    /* Phase 11 (SUZU 2026-11-27): the one start path "At 150 MW" (the st150 steady save), as feedwater.js / unit_load.js. The bare
       AN.plantLoad150 + DITL150.apply no longer holds the load on main (the turbine is off in 60 s), so the old start tested a tripped plant */
    await AN.ades();
    WORLD.set(true);
    document.getElementById('load150').click();
    await AN._startP;
    await run(900); /* Phase 11: the loop settles from the start state to its own energy balance (180,000 kJ/K) */
    o.d = snap();
    set('DITL-76', 2, true); /* I.0087 MIT-P1108A A-AUX. CW PUMP TRIP */
    await run(30);
    o.trip = snap();
    set('DITL-76', 2, false);
    for (const n of ['DITL-30', 'DITL-30 #B', 'DITL-30 #C']) set(n, 2, true); /* SWBP A / B / C TRIP */
    await run(600);
    o.nosw = { ...snap(), sw: AN.unit.swNb };
    AN.run = false;
    AN.reset();
    ditlStates();
    AN.plantCold();
    await run(30);
    o.cold = snap();
    return o;
  });
  const d = r.d,
    near = (x, y, e) => isFinite(x) && Math.abs(x - y) <= e;
  ck(d.n === 1 && d.autoB === 1 && d.runB === 0, '150 MW: ACWP-A runs, ACWP-B standby in AUTO (27.PNG): running ' + d.n + ', B AUTO SELECTED ' + d.autoB + ', B running ' + d.runB);
  ck(near(d.Q, 1500, 30), '150 MW: closed cooling flow ' + d.Q + ' m3/h (MB-021 item 5 1500 = 2 CCWHE x 750; the pump curve meets the MB-021 line)');
  ck(near(d.P1, 7.8, 0.1) && near(d.P2, 7.2, 0.1) && near(d.P6, 6.5, 0.1), '150 MW: PT-CW1152 ' + d.P1 + ', PT-CW1153 ' + d.P2 + ', PT-CW1156 ' + d.P6 + ' kg/cm2 (Phase 11: MB-021 items 7 / 8 / 30 7.8 / 7.2 / 6.5; the plant snapshot 27.PNG reads 6.4 / 5.2)');
  ck(d.T2 >= 30 && d.T2 <= 34 && near((d.T1 - d.T2) * (d.Q * 991 * 4.18) / 3600, d.load, 0.1 * d.load), '150 MW: TT-CW1152 ' + d.T1 + ', TT-CW1153 ' + d.T2 + ' C: supply between the sea water 30 C (MB-020) and the MB-021 design supply 34 C, return - supply = the users ' + d.load + ' kW / (flow x cp) within 10 % (one-node loop, 900 s after the start state) (Phase 11 energy balance; the plant snapshot 27.PNG reads 40 / 38)');
  ck(d.I[0] > 25 && d.I[0] < 29.5 && d.I[1] === 0, '150 MW: ACWP-A current ' + d.I[0] + ' A (motor 300 kW 6.6 kV; 27.PNG 28.2)');
  ck(near(d.d76, d.P1, 0.01) && near(d.d41, d.P6, 0.01) && near(d.d21, d.Tb, 0.05) && near(d.d112, d.muP, 0.01), 'the logic reads the plant: DITL-76 PT-CW1152 ' + d.d76 + ', DITL-41 PT-CW1156 ' + d.d41 + ', DITL-21A TT-CW1060 ' + d.d21 + ', DITL-112 PT-MU0709 ' + d.d112);
  ck(near(d.muP, 7.9, 0.3) && d.muN === 2, '150 MW: make-up header PT-MU0709 ' + d.muP + ' kg/cm2 with ' + d.muN + ' MWP (Phase 11: 0.1 x (tank 13.8 m + LT zero +10.200 - PT body +10.400 (K1AU3-E2-0-102) + KEW-65/200 head 64.9 m at the recirculation flow) = 7.85; the plant snapshot 28.png reads 9.0)');
  ck(d.fs === 0, '150 MW: no low-flow switch FS-CW1060 made (' + d.fs + ')');
  const t = r.trip;
  ck(t.runB === 1 && t.n === 1 && near(t.Q, 1500, 30) && near(t.P1, 7.8, 0.1), 'ACWP-A trip: the logic starts ACWP-B (running ' + t.runB + '), flow ' + t.Q + ' m3/h, PT-CW1152 ' + t.P1);
  const w = r.nosw;
  ck(w.sw === 0 && w.T1 - d.T1 >= 0.8 * (d.load * 600) / 180000, 'all SWBP tripped (' + w.sw + ' running): the CCWHE takes no heat, TT-CW1152 ' + d.T1 + ' -> ' + w.T1 + ' C after 10 min (at least 80 % of users (the sample and oil cooler duties fall as the loop warms) ' + d.load + ' kW x 600 s / the loop 180,000 kJ/K)');
  const c = r.cold;
  ck(c.n === 0 && c.Q === 0 && c.P1 < 3.5 && c.d41 < 3.5, 'Cold: no ACWP, no flow, PT-CW1152 ' + c.P1 + ' / PT-CW1156 ' + c.d41 + ' kg/cm2 (static, < 3.5 low)');
  ck(c.fs === 8, 'Cold: the 8 flow switches FS-CW1060 of the ash coolers made (low flow): ' + c.fs);
  ck(c.muN === 0 && c.muP < 5.5, 'Cold: no MWP, make-up header ' + c.muP + ' kg/cm2 (static, < 5.5 L.L.)');
  ck(!errs.length, 'no page error' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
  await browser.close();
  console.log(fail ? 'FAILED ' + fail : 'ALL PASS');
  process.exit(fail ? 1 : 0);
})();
