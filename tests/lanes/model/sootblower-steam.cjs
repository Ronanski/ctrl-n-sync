// 3.2.3 (SOHEE): the steam the sootblowers take (unit.js AN_SB; Diamond Power N11639-SC1 "Sootblower steam data", IK4M manual o&m L10-2
// page 93) and the sootblower header from the shut-off MOV MV-SB1001 (source.js PICSB1052; 18.PNG: MV-SB1001 0 %, header 0.4 kg/cm2,
// every lance retracted at 150 MW). Checks:
//   - Cold and "Start at 150 MW": no sootblower blows by itself (no steam taken, every lance retracted), MV-SB1001 shut;
//   - 150 MW with MV-SB1001 shut: PCV-SB1053 opened by hand (MANUAL 60 %) gives no header pressure;
//   - MV-SB1001 held open in the field and PCV-SB1053 at 60 %: the header has steam; one blower is started (its lance is sent out as
//     the EXTEND COMMAND of DITL-80G does: this test does not run the sequence of DITL-80): N-1011 (IK4M above the RH upper) takes
//     1.2 kg/s = 4.32 T/H for about 230 s, 276 kg in one operation (the table); N-1035 (common economizer, IK4M-PT) 0.9 kg/s for
//     about 98 s, 88 kg; the water that leaves the drum (AN_CYC.dl) grows by that steam; nothing after the lance is back.
//   - the air heater blowers (L20 Gas air heater O&M manual: 3900 kg/hour per lance, 19 min 40 s per lance, hot & cold end sequential):
//     the start command of DITL-80F row 25 runs N-1040 (hot end, PT-SB1040 = header, off its reset position) then N-1042, 2 x 1209 kg (steam while the poppet is open, Mk VX-AB manual).
// Usage: node tests/lanes/model/sootblower-steam.cjs [html] (Phase 11 SUZU: moved from tests/regress so Checks runs it, run-all.cjs)
const { open } = require('../../regress/lib.js');
const fs = require('fs');
const html =
  process.argv.find(a => /\.html$/.test(a)) ||
  'dist/' + fs.readdirSync('dist').find(x => /^logic-sim-v[\d.]+(?:-beta\.\d+)?\.html$/.test(x));
(async () => {
  const { browser, page, errs } = await open(html);
  let fail = 0;
  const ck = (ok, w) => {
    console.log((ok ? 'PASS ' : 'FAIL ') + w);
    if (!ok) fail++;
  };
  await page.waitForFunction(() => AN.sheets && AN.sheets.length >= 54 && window.WORLD && WORLD.idx && window.DITL150, null, {
    timeout: 120000
  });
  await page.waitForTimeout(2000);
  const r = await page.evaluate(async () => {
    const C1 = AN.sheets.find(s => s.name === 'ABC-001C');
    const r1 = x => Math.round(x * 100) / 100;
    let hold = null;
    const run = async (sec, f) => {
      for (let i = 0; i < sec * 2; i++) {
        WORLD.live = true;
        if (hold) hold();
        AN.stepSet(C1, 0.5);
        WORLD.tick(0.5);
        if (f) f();
        if (i % 100 === 99) await new Promise(r => setTimeout(r, 0));
      }
    };
    const T = k => AN.sheets.find(s => s.name === k).S;
    const ctl = (k, t) => AN.hmiCtrls(T(k)).find(c => c.tag === t);
    const man = (k, t, x) => {
      const c = ctl(k, t),
        S2 = T(k),
        st = S2.rt.st[c.amt.id];
      st.al = c.autoLeg;
      st.fm = c.autoLeg === 'A' ? 'B' : 'A';
      if (c.manBlk && S2.rt.st[c.manBlk.id]) S2.rt.st[c.manBlk.id].val = x;
      else S2.rt.ext[c.manNet] = x;
      for (const [S3, n] of AN.modeNets(t)) S3.rt.ext[n] = 1;
    };
    const hdr = () => {
      const S2 = T('ABC-017'),
        b = S2.procs.find(z => (z.txt || [])[1] === 'PICSB1052');
      return +S2.rt.v[b.proc.pv];
    };
    const lances = () => WORLD.sbLances();
    const pos = () => ((WORLD.live = true), AN.ditlPos('DITL-80S', 0));
    const out = () => lances().filter(s => s._lance.x > 0).length;
    const o = {};
    /* 5. the drain temperatures TT-SB1056 / 1057 (unit.js AN_SB.dr), the value DITL-80P reads and the BLOWING PERMISSIVE (DITL-80A out 21) */
    const dr = () => {
      const p = S.sheets.find(x => /\)DITL-80P$/.test(x.name));
      return { a: r1(AN.unit.sbTa), b: r1(AN.unit.sbTb), src: r1(AN.unit.sbT), hdrT: r1(AN.unit.sbTh), avw: p && p.avw ? Object.values(p.avw).map(r1) : [], bp: ((WORLD.live = true), AN.ditlRun('DITL-80A@20')) };
    };
    /* 1. Cold */
    AN.run = false;
    AN.reset();
    ditlStates();
    AN.plantCold();
    await run(300);
    const U = AN.unit;
    o.cold = { msb: U.msb, n: U.sbN, out: out(), mv: pos(), P: r1(hdr()), L: lances().length, dr: dr() };
    /* 2. Start at 150 MW */
    /* beta.346 (JENNIE, T1): the one start path "At 150 MW" (the st150 steady save, PR 480), as unit_load and cd_page_values. The bare
       AN.plantLoad150 starts the heat chain at its design metal (MST 459 C at t = 0), and the turbine MW now follows the steam temperature */
    await AN.ades();
    WORLD.set(true);
    document.getElementById('load150').click();
    await AN._startP;
    await run(300);
    o.l150 = { msb: U.msb, n: U.sbN, out: out(), mv: pos(), P: r1(hdr()), L: lances().length, dr: dr() };
    man('ABC-017', 'PICSB1052', 60);
    await run(120);
    o.shut = { P: r1(hdr()), mv: pos() };
    /* 3. MV-SB1001 held open in the field */
    const v = S.sheets.find(x => /\)DITL-80S$/.test(x.name));
    hold = () => {
      MST[v.name][0].pos = 100;
    };
    await run(120);
    o.open = { P: r1(hdr()), mv: pos(), msb: U.msb, dr: dr() };
    const blow = async n => {
      const s = lances().find(x => x._lance.n === n);
      const dl0 = AN.cyc ? AN.cyc.dl : AN_CYC.dl;
      let kg = 0,
        tOn = 0,
        pk = 0,
        dlPk = 0;
      s._lance.dir = 1;
      await run(270, () => {
        kg += (U.msb / 3.6) * 0.5;
        if (U.msb > 0) tOn += 0.5;
        if (U.msb > pk) {
          pk = U.msb;
          dlPk = AN_CYC.dl - dl0;
        }
      });
      return { n, kg: r1(kg), tOn, pk: r1(pk), dl: r1(dlPk), back: s._lance.x, after: U.msb, P: r1(hdr()) };
    };
    o.b1011 = await blow(1011);
    o.b1035 = await blow(1035);
    /* 4. the air heater blowers: the start command of the program (DITL-80F row 25 input, from DITL-80 out 87) */
    const opRow = v => ((WORLD.live = true), WORLD.dset('DITL-80F', 25, v));
    const A = () => Object.assign({}, U.sbA);
    /* the reset positions of N-1040 / N-1042: since Phase 6 DCS (4076f568, plantsw.js sbZs) they are the DITL-80L limit switch rows
       ZSR-N1040 / ZSR-N1042, drawn "NOT ON" (made while the lance is off its park position). At reset = the row is not made. Before:
       DITL-80K rows 22 / 24, which no longer carry the switch (the test read null) */
    const rsp = re => {
      const tag = 'ZSR-N' + (re.source.indexOf('1040') >= 0 ? '1040' : '1042'),
        m = WORLD.plantSw().find(x => /\)DITL-80L( #.*)?$/.test(x.sheet) && x.tag === tag);
      return m ? !m.on : null;
    };
    /* beta.322: the drum outflow AN_CYC.dl is the drum steam (main steam + blowdown + sootblower + vents less the two SH sprays,
       unit.js mDr) plus the losses; in the 10 s after the start the steam loops move it too (the sprays, 0 - 9 T/H). The check is that
       the blower steam is taken from the drum: the outflow grows by the sootblower steam plus the move of the rest of the drum steam.
       The band is 1 T/H as for N-1011 above: plant.js reads the drum steam as U.ms + U.mb, and U.ms follows the drum pressure, so the
       blower steam shows through the pressure it takes, not one to one in 10 s (150 MW: +3.55 for 3.9) */
    const rest = () => (U.ms || 0) + (U.mb || 0) + (U.msv || 0) - (U.w1s || 0) - (U.w2s || 0),
      dl1 = AN_CYC.dl,
      re1 = rest();
    /* the steam is counted from the start command: the poppet opens only when the lance is 50 mm out (VX-AB manual) */
    let kgA = 0, tA = 0;
    const cnt = () => {
      kgA += (U.msb / 3.6) * 0.5;
      if (U.msb > 0) tA += 0.5;
    };
    opRow(true);
    await run(10, cnt);
    o.a0 = { A: A(), op: AN.ditlRun('DITL-80F@25'), msb: r1(U.msb), dl: r1(AN_CYC.dl - dl1 - (rest() - re1)), r40: rsp(/N-1040.*RESET/), r42: rsp(/N-1042.*RESET/) };
    opRow(false);
    await run(2400, cnt);
    o.a1 = { A: A(), kg: r1(kgA), t: tA, msb: U.msb, r40: rsp(/N-1040.*RESET/), r42: rsp(/N-1042.*RESET/) };
    o.drHot = dr();
    /* MV-SB1001 shut again: the drains cool back */
    hold = () => {
      MST[v.name][0].pos = 0;
    };
    await run(1800);
    o.drCool = dr();
    hold = null;
    return o;
  });
  console.log(JSON.stringify(r));
  for (const k of ['cold', 'l150']) {
    const x = r[k];
    ck(x.L === 28 && x.msb === 0 && x.n === 0 && x.out === 0, `${k}: no sootblower blows (${x.out} lances out of 28, steam ${x.msb} T/H)`);
    ck(x.mv === 0 && x.P < 0.5, `${k}: MV-SB1001 ${x.mv} %, header ${x.P} kg/cm2`);
  }
  ck(r.shut.mv === 0 && r.shut.P < 0.5, `150 MW, MV-SB1001 shut, PCV-SB1053 at 60 %: header ${r.shut.P} kg/cm2 (no steam)`);
  ck(r.open.mv === 100 && r.open.P > 12.9 && r.open.msb === 0, `MV-SB1001 open: header ${r.open.P} kg/cm2, no blower yet (${r.open.msb} T/H)`);
  const b = r.b1011;
  ck(Math.abs(b.pk - 4.32) < 0.01, `N-1011 blows 1.2 kg/s: ${b.pk} T/H`);
  ck(Math.abs(b.tOn - 230) <= 2 && Math.abs(b.kg - 276) < 6, `N-1011 one operation: ${b.tOn} s, ${b.kg} kg (table 230 s, 276 kg)`);
  ck(Math.abs(b.dl - b.pk) < 1, `N-1011: the water leaving the drum grows by ${b.dl} T/H (steam ${b.pk})`);
  ck(b.back === 0 && b.after === 0, `N-1011 back on its retract limit, steam ${b.after}`);
  const c = r.b1035;
  ck(Math.abs(c.pk - 3.24) < 0.01 && Math.abs(c.tOn - 98) <= 2 && Math.abs(c.kg - 88) < 3, `N-1035 0.9 kg/s: ${c.pk} T/H, ${c.tOn} s, ${c.kg} kg (table 98 s, 88 kg)`);
  ck(c.back === 0 && c.after === 0, `N-1035 back, steam ${c.after}`);
  const a0 = r.a0, a1 = r.a1;
  /* beta.322 (JENNIE): the program starts the air heater blowers in two steps of its counter (unit.js anSbAph, 3.2.4-beta.8): count 29 =
     DITL-80F row 25 OPERATING runs the COLD end N-1042 first, count 30 = DITL-80 output row 19 the HOT end N-1040 (L20 OMM: sequential,
     19 min 40 s each). The test gives only the row 25 step, so the cold end blows once; the hot end needs the DITL-80 program step */
  ck(a0.A.ph === 2 && a0.A.p42 > 10 && a0.A.p40 === 0 && Math.abs(a0.msb - 3.9) < 0.01 && Math.abs(a0.dl - 3.9) < 1 && a0.r42 === false && a0.r40 === true,
    `air heater blowers started (step 29): cold end N-1042 blows 3900 kg/h (${a0.msb} T/H, drum outflow +${a0.dl} beside the rest of the drum steam), PT-SB1042 ${a0.A.p42} kg/cm2, N-1042 off its reset position (reset 1040 / 1042 = ${a0.r40} / ${a0.r42}, ph ${a0.A.ph}, op ${a0.op})`);
  /* Phase 11 (SUZU, after Phase 6 DCS 4076f568): the cycle is 19 min 40 s (L20 OMM) but the steam flows only while the poppet is open,
     the lance more than 50 mm out (Mk VX-AB manual). The travel from the documents: stroke L 750 mm in steps of 38 mm (n = 20 steps,
     19 dwells of 55 s), speed v = 2 L / (1180 - 19 x 55) = 11.1 mm/s. Out: 50 / v = 4.5 s before the poppet opens; back: the last
     dwell is at 750 - 19 x 38 = 28 mm, below the poppet, so the steam stops 50 / v + 55 s before the end. Steam time = 1180 - 100 / v
     - 55 = 1116 s, at 3900 kg/h = 1209 kg. Was 1180 s, 1278 kg (steam over the whole cycle, before the poppet) */
  const L20 = 1180, vX = (2 * 750) / (L20 - 19 * 55), tSt = L20 - 100 / vX - 55, kgSt = (3900 / 3600) * tSt;
  ck(a1.A.ph === 0 && a1.msb === 0 && a1.r40 === true && a1.r42 === true && Math.abs(a1.t - tSt) <= 2 && Math.abs(a1.kg - kgSt) < 6,
    `cold end cycle 19 min 40 s (L20 manual), steam while the poppet is open: ${a1.t} s, ${a1.kg} kg (${tSt.toFixed(1)} s, ${kgSt.toFixed(0)} kg), both back to their reset position (${a1.r40} / ${a1.r42}, ph ${a1.A.ph}, steam ${a1.msb})`);
  /* 5. drain temperatures */
  const d0 = r.cold.dr, d1 = r.l150.dr, d2 = r.open.dr, d3 = r.drHot, d4 = r.drCool;
  ck(Math.abs(d0.a - 30) < 1 && Math.abs(d0.b - 30) < 1 && d0.bp !== 1, `Cold: drain temperatures ${d0.a} / ${d0.b} C (ambient), no blowing permissive`);
  ck(Math.abs(d1.a - 107) < 3 && Math.abs(d1.b - 105) < 3 && d1.bp !== 1, `150 MW, MV-SB1001 shut: drains ${d1.a} / ${d1.b} C (18.PNG 107 / 105), no blowing permissive`);
  /* 1.0.0-beta.346 (JENNIE, GO DESIGN): no design value of the panel #1 outlet in the documents; the design CALC of the panels (hx.js uaP,
     62.5 MW at 150 MW with the FHI Fig 10 spray) puts the panel #1 metal at 412.7 C, the steam a little below it: 395 ~ 425 C. The
     03.png TT-BR1120 458 / 454 C is a plant snapshot, sanity only */
  ck(d1.src > 395 && d1.src < 425, `150 MW: S/H panel #1 outlet steam ${d1.src} C (design CALC of the panels: metal 412.7 C)`);
  ck(d1.avw.length >= 2 && d1.avw.includes(d1.a) && d1.avw.includes(d1.b), `DITL-80P reads the drain temperatures of the plant model (${d1.avw.join(' / ')})`);
  /* the header steam is the panel #1 steam throttled (isenthalpic) to the header: it must stay above the 250 C the drains need for the
     blowing permissive (DITL-80P, check below), not a fixed number from the plant source temperature */
  ck(d2.hdrT > 250 && d2.hdrT < d1.src && d2.a > d1.a && d2.a < d2.hdrT, `MV-SB1001 open 120 s: header steam ${d2.hdrT} C (throttled), drains warming ${d2.a} / ${d2.b} C`);
  ck(d3.a > 250 && d3.b > 250 && d3.bp === 1, `after the warm-up: drains ${d3.a} / ${d3.b} C (> 220 and > 250), BLOWING PERMISSIVE on`);
  ck(d4.a < d3.a - 50 && d4.bp !== 1, `MV-SB1001 shut 30 min: drains cool to ${d4.a} / ${d4.b} C, no blowing permissive`);
  ck(errs.length === 0, 'no page error' + (errs.length ? ': ' + errs.join(' | ') : ''));
  console.log(fail ? 'FAILED ' + fail : 'ALL PASS');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
