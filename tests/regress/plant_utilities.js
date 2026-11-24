// 3.2.0-beta.15 (plan phase B, user: "Alam ko may tripping mga yan. Di makakastart ng wala yan"): the steam table and the utilities
// of the unit model (src/analog/engine/steam.js, unit.js vacUp):
//  - steam table (IAPWS-IF97 saturation line): 100.0 C at 0, 183.3 at 10, 275.4 at 60, 330.0 at 130 kg/cm2 G
//  - Cold: the turbine cannot be rolled without the condenser vacuum (no seawater / condensate pump); after SWP + CEP start and
//    the vacuum is up (15 min) the roll is accepted
//  - At 150 MW: all seawater pumps stopped -> LOW VACUUM -> TCS turbine trip (ABC-050 I.0400 = 1), the MW goes to 0
//  - 1.0.0-beta.360: both cases start from the app starting points (Cold / Load 150 MW buttons) in the one world, with the real presses
//    (field REMOTE selectors, CRT START / STOP / OPEN push buttons, TCS buttons)
// Usage: node tests/regress/plant_utilities.js [html]
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
  /* helpers in the page: a digital input on every sheet (as CHECK setx), plant time steps */
  await page.evaluate(() => {
    window.__setx = (l, x) => {
      for (const s of AN.sheets) {
        const T = s.S;
        if (!T || !T.ext || /ABC-000/.test(s.name)) continue;
        for (const e of T.ext) {
          const t = T.lab[e] && String(T.lab[e].t).trim();
          if ((t === l || (t && t.replace(/^S\d\s+/, '') === l)) && T.rt.force[e] === undefined) T.rt.ext[e] = x;
        }
      }
    };
    window.__run = async sec => {
      const C1 = AN.sheets.find(s => s.name === 'ABC-001C');
      for (let i = 0; i < sec; i++) {
        AN.stepSet(C1, 1);
        if (i % 200 === 199) await new Promise(r => setTimeout(r, 0));
      }
    };
  });
  const ts = await page.evaluate(() => [0, 10, 60, 130].map(p => +AN.tsat(p).toFixed(1)));
  ck(
    Math.abs(ts[0] - 100) < 0.2 && Math.abs(ts[1] - 183.3) < 0.3 && Math.abs(ts[2] - 275.4) < 0.3 && Math.abs(ts[3] - 330.0) < 0.3,
    'steam table: Tsat at 0 / 10 / 60 / 130 kg/cm2 = ' + ts.join(' / ') + ' C (IF97: 100.0 / 183.3 / 275.4 / 330.0)'
  );
  const a = await page.evaluate(async () => {
    /* 1.0.0-beta.360 (JENNIE, Lisa Part 2 stale tests): the Cold start of the app (the Cold button) in the one world, with the real
       presses of the operator (pump STOP / START push buttons LS_OP.dmotor, MOV OPEN rows WORLD.dpress, the TCS buttons AN.turbine); the
       old direct input writes (__setx) are overwritten by the drawings in the one world */
    await AN.ades();
    WORLD.set(true);
    document.getElementById('loadcold').click();
    await AN._startP;
    const C1 = AN.sheets.find(z => z.name === 'ABC-001C');
    const wrun = async sec => {
      for (let k = 0; k < sec * 2; k++) {
        WORLD.live = true;
        AN.stepSet(C1, 0.5);
        WORLD.tick(0.5);
        if (k % 200 === 199) await new Promise(r => setTimeout(r, 0));
      }
    };
    await wrun(10);
    const r0 = AN.turbine('roll');
    /* the field operator: SWP-B and CEP-A LOCAL / REMOTE selectors to REMOTE (DITL-29A #B, DITL-61A), then START from the CRT */
    const st = [LS_OP.dremote('M.3354'), LS_OP.dremote('M.3350')];
    await wrun(2);
    st.push(LS_OP.dmotor('M.3354', true), LS_OP.dmotor('M.3350', true));
    await wrun(30);
    st.push(LS_OP.mst('M.3354') === 'RUN', LS_OP.mst('M.3350') === 'RUN');
    await wrun(60);
    const r1 = AN.turbine('roll');
    await wrun(1200);
    const vNoAux = AN.unit.vac;
    /* 3.2.0-beta.37 / 38: the vacuum up needs the aux steam (main steam > 12 kg/cm2, PR-OPE-5002 5727); the TCS auxiliaries in the
       PR-OPE-5002 order. The aux steam header is fed from the main steam line through MV-AS1391 (DITL-51) and PCV-AS1010 (PIC-AS1004,
       ABC-030). The boiler is not fired in this test: the drum and main steam pressure are set to 20 kg/cm2 as the start-up steam */
    AN.unit.Pd = 20;
    AN.unit.Pms = 20;
    /* 1.0.0-beta.362 D18: the push buttons of the sheets: MOP-A / COP-A START (IBD TB-1 / TB-21), the vapour extractor START (TB-12), the
       turning gear START (TB-9, after the bearing oil is up: a start permissive of the sheet) */
    const rr = [AN.turbine('oil', { p: 'mopA', op: 'start' }), AN.turbine('oil', { p: 'copA', op: 'start' }), AN.turbine('ibd', { id: 'TB-12', pb: 'START' })];
    await wrun(10);
    rr.push(AN.turbine('ibd', { id: 'TB-9', pb: 'START' }));
    await wrun(10);
    /* MV-AS1391 OPEN from the CRT: REMOTE at the field (DITL-51 row 12 I.0203, LS_OP.fieldRow), then the OPEN P.B. row (row 5, M.0360) */
    const s51 = S.sheets.find(x => x.name.endsWith('DITL-51'));
    let open51 = -1;
    for (let r = 0; r < 30 && s51 && open51 < 0; r++) if (/MOV OPEN PB$/.test(String((DUI.rowInfo(s51, r) || {}).svc || ''))) open51 = r;
    let rem51 = -1;
    for (let r = 0; r < 30 && s51 && rem51 < 0; r++) if (/MOV REMOTE$/.test(String((DUI.rowInfo(s51, r) || {}).svc || ''))) rem51 = r;
    /* the field operator: the LOCAL / REMOTE selector of the MOV to REMOTE (the field panel row) */
    if (!(rem51 >= 0 && LS_OP.fieldRow('DITL-51', rem51, true, 'MV-AS1391 REMOTE'))) rr.push('MV-AS1391 REMOTE refused (row ' + rem51 + ')');
    await wrun(2);
    const p51 = open51 >= 0 && WORLD.dpress(s51.name, open51);
    if (!p51) rr.push('MV-AS1391 OPEN press refused (row ' + open51 + ')');
    const pa = TOP.auto('PIC-AS1004', 10.5);
    if (pa) rr.push('PIC-AS1004 AUTO: ' + pa);
    await wrun(600); /* aux header 10.5 kg/cm2, 2 min time constant: > 10 after about 6 min */
    const as0 = [+AN.unit.asP, +AN.unit.Pms];
    /* the steam seal feed inlet valve OPEN (IBD TC-31: PV-GS1031 in service) and the gland steam exhauster START (TC-28) */
    rr.push(AN.turbine('ibd', { id: 'TC-31', pb: 'OPEN' }), AN.turbine('ibd', { id: 'TC-28', pb: 'START' }));
    await wrun(120); /* the gland seal is in service once its header holds >= 0.10 kg/cm2 G (ATS 1.10, tcs.js) */
    /* the field operator puts the vacuum breaker and ejector steam MOVs (DITL-54 / 55 / 56) in REMOTE before the vacuum up from the CRT */
    for (const d of ['DITL-54', 'DITL-55', 'DITL-56']) {
      const sd = S.sheets.find(x => x.name.endsWith(d));
      let rm = -1;
      for (let r = 0; r < 30 && sd && rm < 0; r++) if (/ REMOTE( SELECTED)?$/.test(String((DUI.rowInfo(sd, r) || {}).svc || ''))) rm = r;
      if (!(rm >= 0 && LS_OP.fieldRow(d, rm, true, d + ' MOV REMOTE'))) rr.push(d + ' REMOTE refused (row ' + rm + ')');
    }
    await wrun(2);
    /* vacuum up from the CRT (1.0.0-beta.360: no TCS macro): vacuum breaker MV-AV1391 CLOSE (DITL-56 CLOSE P.B. M.0379), SJAE steam MOV
       OPEN (DITL-55 OPEN P.B. M.0450); the start-up ejector MOV OPEN (DITL-54 OPEN P.B. M.0440) needs the breaker FULLY CLOSED (DITL-54
       row 6 I.0216), so it is pressed once the breaker has stroked */
    const pb = (d, re) => {
      const sd = S.sheets.find(x => x.name.endsWith(d));
      let r0 = -1;
      for (let r = 0; r < 30 && sd && r0 < 0; r++) if (re.test(String((DUI.rowInfo(sd, r) || {}).svc || ''))) r0 = r;
      if (!(r0 >= 0 && WORLD.dpress(sd.name, r0))) rr.push(d + ' ' + re + ' press refused (row ' + r0 + ')');
    };
    pb('DITL-56', /BREAKER CLOSE PB$/);
    pb('DITL-55', /MOV OPEN PB$/);
    await wrun(60);
    pb('DITL-54', /MOV OPEN PB$/);
    await wrun(1200);
    const r2 = AN.turbine('roll');
    const rv = (d, r) => { const sd = S.sheets.find(x => x.name.endsWith(d)); return sd ? DUI.rowVal(sd, r) : '-'; };
    const dg = 'SWP-B ' + LS_OP.mst('M.3354') + ', CEP-A ' + LS_OP.mst('M.3350') + ', VB closed ' + rv('DITL-54', 5) + ', SU ej open ' + rv('DITL-54', 7) + ', SJAE open ' + rv('DITL-55', 7) + ', cdP ' + (+AN.unit.cdP).toFixed(3) + ' kg/cm2 a';
    return { dg, r0, r1, r2, st, rr: rr.filter(Boolean), cur: AN.tcs().cur, vac: AN.unit.vac, vNoAux, as0 };
  });
  ck(/VACUUM/i.test(a.r0) && /VACUUM/i.test(a.r1) && a.vNoAux < 0.1 && a.st.every(Boolean) && !a.rr.length && a.r2 === '' && a.cur === 0,
    'Cold: roll with no SWP / CEP refused ("' + a.r0.slice(0, 60) + '") {' + a.dg + '}, SWP + CEP with no aux steam: vacuum ' + Math.round(100 * a.vNoAux) + ' % after 20 min (remote / start / running ' + a.st.join(' ') + '); with aux steam (drum 20 kg/cm2), lube oil, turning gear, gland and vacuum up' + (a.rr.length ? ' (REFUSED: ' + a.rr.join(' | ') + ')' : '') + ' [aux header ' + a.as0.map(x => x.toFixed(1)).join(' kg/cm2, main steam ') + ' kg/cm2]: vacuum ' + Math.round(100 * a.vac) + ' %, roll "' + (a.r2 || 'accepted') + '", ATS step ' + a.cur + ' (0 = HP TURBINE WARMING)');
  const b = await page.evaluate(async () => {
    /* 1.0.0-beta.360 (JENNIE, Lisa Part 2 W4 / T1): the 150 MW start of the app (st150, the Load 150 MW button), not the old
       snapshot path AN.plantLoad150 (it read 39 MW after 30 s) */
    await AN.ades();
    WORLD.set(true);
    document.getElementById('load150').click();
    await AN._startP;
    const C1 = AN.sheets.find(z => z.name === 'ABC-001C');
    const wrun = async sec => {
      for (let k = 0; k < sec * 2; k++) {
        WORLD.live = true;
        AN.stepSet(C1, 0.5);
        WORLD.tick(0.5);
        if (k % 200 === 199) await new Promise(r => setTimeout(r, 0));
      }
    };
    await wrun(30);
    const mw0 = +AN.unit.MW;
    /* the real stop: the STOP push button of each pump drawing (DITL-29A A / B / C), the CRT press of the operator (LS_OP.dmotor) */
    const stp = ['M.3353', 'M.3354', 'M.3355'].map(l => LS_OP.dmotor(l, false));
    await wrun(2);
    await wrun(120);
    const S = AN.sheets.find(s => s.name === 'ABC-050').S,
      n = S.lab.findIndex(z => z && String(z.t).trim() === 'I.0400');
    /* the low vacuum trip is a TCS protection (tcs-trip.js CONDENSER VACUUM VERY LOW TRIP); the DCS I.0400 is only the trip input
       from the DCS (ib.ext is false for a vacuum trip), so the first-out is read from the TCS */
    const t = AN.tcs() || {};
    return { mw0, mw: +AN.unit.MW, trip: n >= 0 ? +S.rt.v[n] : NaN, vac: AN.unit.vac, stp, first: typeof t.trip === 'string' ? t.trip : (t.trip && t.trip.first) || (t.ib && t.ib.first) || '' };
  });
  ck(b.mw0 > 140 && /VACUUM/i.test(b.first) && b.mw < 10,
    '150 MW, all seawater pumps stopped: LOW VACUUM (' + Math.round(100 * b.vac) + ' %) -> TCS trip "' + b.first + '" (DCS I.0400 = ' + b.trip + '), stop pressed ' + b.stp.join(' / ') + ', MW ' + b.mw0.toFixed(1) + ' -> ' + b.mw.toFixed(1));
  ck(errs.length === 0, 'no page error' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
  console.log(fail ? 'FAIL ' + fail : 'ALL PASS');
  await browser.close();
})();
