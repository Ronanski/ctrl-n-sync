// 3.2.1 (IRENE, user 2026-11-04 "ITULOY PLANT MODEL"): page 08 AUX STEAM AND VACUUM (hmi-mock-as.js) showed '-----' for the values no
// sheet reads. They come from the plant model now (unit.js anAsTagStep; sources there and in docs/versions/v3.2.1/AUX_STEAM_PLANT_MODEL.md).
// At "Start at 150 MW" (one world, plant model ON) each shows a number near 29.PNG (151 MW): PTST11101 ~ 3 0.056 / 0.053 / 0.053 kg/cm2A,
// TEST11101 ~ 3 38 / 38 / 37 C, PCV-AS1020-1 / -2 0.1 / 32.2 %, TT-AS1015 257 C, gland header 0.32 kg/cm2, TEGS1002 / 1003 364 / 362 C,
// PV-GS1034 42.6 %, MV-AS1011 0 %; PIC-AS1005 in MANUAL 50 %: the two valves follow the ABC-030 F(X) (LN17 42.5 %, LN16 100 %).
// Usage: node tests/regress/as_page_values.js [html]
const fs = require('fs');
const { open, startAs } = require('./lib.js');
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
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.waitForFunction(() => AN.sheets && AN.sheets.length >= 54 && window.WORLD && WORLD.idx && window.DITL150 && window.LS_MOCK, null, {
    timeout: 120000
  });
  await page.waitForTimeout(2000);
  const K = ['PTST11101', 'PTST11102', 'PTST11103', 'TEST11101', 'TEST11102', 'TEST11103', 'ZT-AS1020-1', 'ZT-AS1020-2', 'TT-AS1015', 'PTGS10011', 'TEGS1002', 'TEGS1003', 'PV-GS1034', 'ZT-AS1011'];
  const run = sec =>
    page.evaluate(async sec => {
      const C1 = AN.sheets.find(s => s.name === 'ABC-001C');
      for (let i = 0; i < sec * 2; i++) {
        WORLD.live = true;
        AN.stepSet(C1, 0.5);
        WORLD.tick(0.5);
        if (i % 100 === 99) await new Promise(r => setTimeout(r, 0));
      }
      WORLD.live = true;
    }, sec);
  /* beta.359 (ROSÉ, coordinator 2026-11-24): the app's own 150 MW start (start screen 150 MW, Operator), not the old snapshot path
     AN.plantLoad150 + DITL150.apply (it read 39 MW); then 1800 s of scan, 3 times the 600 s lag of the exhaust hood (tcs.js TCS.tauX) */
  await startAs(page, '150 MW');
  await run(1800);
  /* beta.359 (ROSÉ): the old page 08 is gone. The values are on the HX page Auxiliary steam and vacuum, MV-AS1011 on Reheat steam;
     each page is opened the way the app opens it (lsShellC.openPage, the page picker of the Plant view) and read from what it shows */
  const read = async () => {
    const o = {};
    for (const [pg, keys] of [['HX-aux-steam', K.filter(k => k !== 'ZT-AS1011')], ['HX-reheat-steam', ['ZT-AS1011']]]) {
      await page.evaluate(pg => lsShellC.openPage(pg), pg);
      await page.waitForFunction(pg => (document.querySelector('#plantws .plpick') || {}).value === pg, pg, { timeout: 20000 });
      await page.waitForTimeout(2500);
      Object.assign(o, await page.evaluate(keys => Object.fromEntries(keys.map(k => [k, (document.querySelector(`#plantws .hx-val[data-hv="${k}"]`) || {}).textContent || null])), keys));
    }
    return o;
  };
  const a = await read();
  const m = await page.evaluate(() => ({ cdP: AN.unit.cdP, MW: AN.unit.MW, f1: AN.unit.tt['ZT-AS1020-1'], f2: AN.unit.tt['ZT-AS1020-2'], T3: AN.unit.asT3, F: AN.unit.asF }));
  console.log(JSON.stringify(a));
  const num = s => (s == null ? NaN : parseFloat(s));
  /* saturation (C) of a pressure in kg/cm2 A, the water Antoine law the engine uses for the hood (unit.js anTsatA, not on window) */
  m.Ts = 1730.63 / (8.07131 - Math.log10((m.cdP * 980.665) / 1.33322)) - 233.426;
  const near = (k, v, d) => Math.abs(num(a[k]) - v) <= d;
  ck(K.every(k => a[k] && !/-----/.test(a[k])), 'page 08: every value shows a number: ' + K.map(k => k + ' ' + a[k]).join(', '));
  ck(['PTST11101', 'PTST11102', 'PTST11103'].every(k => Math.abs(num(a[k]) - m.cdP) < 0.002), `exhaust hood pressure ${a.PTST11101} / ${a.PTST11102} / ${a.PTST11103} = condenser ${m.cdP.toFixed(3)} kg/cm2A (unit.js: PT-ST1110-1 ~ 3 = PT-CD1110)`);
  /* beta.359 (ROSÉ): a plant snapshot is no target (design is the model). On load the LP exhaust is wet steam: the hood temperature is the
     saturation at the hood (= condenser) pressure (tcs.js tcsAux, 15 % load and up) */
  ck(['TEST11101', 'TEST11102', 'TEST11103'].every(k => Math.abs(num(a[k]) - m.Ts) <= 1.5), `exhaust hood temperature ${a.TEST11101} / ${a.TEST11102} / ${a.TEST11103} C = saturation ${m.Ts.toFixed(1)} C at ${m.cdP.toFixed(3)} kg/cm2A`);
  /* beta.359: the two cold reheat valves are the ABC-030 F(X) of the PIC-AS1005 output (unit.js): the page shows the logic value */
  ck(near('ZT-AS1020-1', m.f1, 0.11) && near('ZT-AS1020-2', m.f2, 0.11), `PCV-AS1020-1 / -2 page ${a['ZT-AS1020-1']} / ${a['ZT-AS1020-2']} % = F(X) of PIC-AS1005 ${m.f1} / ${m.f2} %`);
  /* Phase 11 (SUZU 2026-11-27): the gland header by the Hitachi HB case 1 balance (1,820 kg/h of HP packing leak in, 793 to the seals,
     the rest spilled by PV-GS1034): its steam is the leak mix (767.5 kcal/kg) less the header loss, so near 29.PNG 364 / 362; TT-AS1015
     is the aux header steam that the 5 mm warm-up orifice passes with PV-GS1031 shut (PD-014, 310PK01-852), = TT-AS1003 (29.PNG 257) */
  ck(near('PTGS10011', 0.32, 0.01) && near('TEGS1002', 364, 20) && near('TEGS1003', 362, 20) && near('TT-AS1015', m.T3, 3) && m.F.wWu > 10 && m.F.wGf < 1, `gland header ${a.PTGS10011} kg/cm2, ${a.TEGS1002} / ${a.TEGS1003} C (29.PNG 0.32, 364 / 362), TT-AS1015 ${a['TT-AS1015']} C = the aux header TT-AS1003 ${(+m.T3).toFixed(1)} C through the warm-up orifice ${m.F.wWu} kg/h, feed PV-GS1031 ${m.F.wGf} kg/h (self-sealing; 29.PNG 257)`);
  /* beta.359: no snapshot number (design is the model): the unloading valve throttles (between closed and full open) to hold the gland
     header checked above; the HP warming valve MV-AS1011 is shut on load */
  ck(num(a['PV-GS1034']) > 1 && num(a['PV-GS1034']) < 99 && num(a['ZT-AS1011']) === 0, `unloading valve PV-GS1034 ${a['PV-GS1034']} % throttling, HP warming MV-AS1011 ${a['ZT-AS1011']} % shut`);
  /* PIC-AS1005 MANUAL 50 %: the two cold reheat valves by their F(X) */
  await page.evaluate(() => {
    const T = AN.sheets.find(s => s.name === 'ABC-030').S,
      c = AN.hmiCtrls(T).find(x => x.tag === 'PICAS1005'),
      st = T.rt.st[c.amt.id];
    st.al = c.autoLeg;
    st.fm = c.autoLeg === 'A' ? 'B' : 'A';
    if (c.manBlk && T.rt.st[c.manBlk.id]) T.rt.st[c.manBlk.id].val = 50;
    else T.rt.ext[c.manNet] = 50;
    for (const [S3, n] of AN.modeNets('PICAS1005')) S3.rt.ext[n] = 1;
  });
  await run(30);
  await page.waitForTimeout(1500);
  const b = await read();
  ck(Math.abs(num(b['ZT-AS1020-1']) - 42.5) < 2 && num(b['ZT-AS1020-2']) > 98, `PIC-AS1005 MANUAL 50 %: PCV-AS1020-1 / -2 ${b['ZT-AS1020-1']} / ${b['ZT-AS1020-2']} % (F(X) LN17 42.5, LN16 100)`);
  ck(errs.length === 0, 'no page error' + (errs.length ? ': ' + errs.join(' | ') : ''));
  console.log(fail ? 'FAILED ' + fail : 'ALL PASS');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
