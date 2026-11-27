// 3.2.1 (IRENE, coordinator 2026-11-04): page 05 CONDENSATE (hmi-mock-cd.js) showed '-----' for six transmitters no sheet reads. They now
// come from the plant model (unit.js anCdTagStep, sources there). At "Start at 150 MW" (one world, plant model ON) the page shows a
// value for each, checked against design data and first principles only (Phase 11 rule 0, 2026-11-28: no plant screen);
// the deaerator storage water is at the saturation of PT-CD1104; with the deaerator level valve LCV-CD1104 closed by hand FT-CD1122
// goes to 0.
// Usage: node tests/regress/cd_page_values.js [html]
const fs = require('fs');
const { open } = require('./lib.js');
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
  const K = ['TTCD11104', 'TTCD1119', 'FTCD1115', 'FTCD1122', 'PTCD1122', 'TTCD1104'];
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
  /* 1.0.0-beta.328 (JENNIE): the start the operator uses, "At 150 MW" (AN.loadStart + the DITL + the steady state st150); the bare
     AN.plantLoad150 + DITL150.apply has no steady state and drifts */
  await page.evaluate(async () => {
    await AN.ades();
    WORLD.set(true);
    document.getElementById('load150').click();
    await AN._startP;
  });
  await run(300);
  /* 1.0.0-beta.328 (JENNIE): the old page 05 (hmi-mock-cd.js) is gone (Audit 3 #6); the six values are on the HX pages now:
     Condensate (flash chamber, ejector condenser, deaerator inlet), Reheat steam (LP bypass spray FT-CD1115) and Feedwater
     (deaerator storage water TT-CD1104). read() opens each page as the operator does and reads the value it shows */
  const PG = {
    'HX-condensate': ['TTCD11104', 'TTCD1119', 'FTCD1122', 'PTCD1122'],
    'HX-reheat-steam': ['FTCD1115'],
    'HX-feedwater': ['TTCD1104']
  };
  await page.evaluate(() => lsPlant(true));
  await page.waitForTimeout(1000);
  const read = async () => {
    const o = {};
    for (const p in PG) {
      await page.evaluate(p => document.querySelector(`#pllist button[data-id="${p}"]`).click(), p);
      await page.waitForTimeout(2500);
      Object.assign(
        o,
        await page.evaluate(K => Object.fromEntries(K.map(k => [k, HX.data.value(k) == null ? null : String(HX.data.value(k))])), PG[p])
      );
    }
    return o;
  };
  const a = await read();
  const m = await page.evaluate(() => ({ tt: Object.assign({ hw: Math.round(AN.unit.cdT * 10) / 10 }, AN.unit.tt) }));
  console.log(JSON.stringify(a));
  console.log(JSON.stringify(m.tt));
  const num = s => (s == null ? NaN : parseFloat(s));
  ck(K.every(k => a[k] && !/-----/.test(a[k])), 'page 05: the six values show a number: ' + K.map(k => k + ' ' + a[k]).join(', '));
  const hw = m.tt.hw;
  /* flash chamber = the saturation of the condenser (it vents to the shell); ejector condenser outlet between the hotwell and the
     No.1 LPH inlet (568 kW GSC / ejector duty); LP bypass spray 0 with the bypass shut; condensate to the deaerator: design 362.59 T/H
     (L15-2) inside the CEP curve (min flow 100 to 480 m3/h of one pump); deaerator inlet above its LOW-LOW 7.5 kg/cm2 (alarm list) */
  ck(Math.abs(m.tt['TT-CD1110-4'] - hw) <= 0.1 && m.tt['TT-CD1119'] > hw && m.tt['TT-CD1119'] < m.tt['TT-CD1101'], `flash chamber ${a.TTCD11104}, ejector condenser outlet ${a.TTCD1119}, hotwell ${hw} C`);
  ck(num(a.FTCD1115) === 0, `LP bypass spray ${a.FTCD1115} (LP bypass shut, XV-CD1114 closed)`);
  ck(num(a.FTCD1122) > 300 && num(a.FTCD1122) < 480, `condensate to the deaerator ${a.FTCD1122} (design 362.59 T/H, L15-2)`);
  ck(num(a.PTCD1122) > 7.5 && num(a.TTCD1104) > 140, `deaerator inlet ${a.PTCD1122} (> LOW-LOW 7.5), storage water ${a.TTCD1104} (saturation of PT-CD1104)`);
  /* the deaerator level valve closed by hand: no condensate to the deaerator */
  await page.evaluate(() => {
    const T = AN.sheets.find(s => s.name === 'ABC-031').S,
      c = AN.hmiCtrls(T).find(x => x.tag === 'LICCD1104'),
      st = T.rt.st[c.amt.id];
    st.al = c.autoLeg;
    st.fm = c.autoLeg === 'A' ? 'B' : 'A';
    if (c.manBlk && T.rt.st[c.manBlk.id]) T.rt.st[c.manBlk.id].val = 0;
    else T.rt.ext[c.manNet] = 0;
    for (const [S3, n] of AN.modeNets('LICCD1104')) S3.rt.ext[n] = 1;
  });
  await run(60);
  await page.waitForTimeout(1500);
  const b = await read();
  ck(num(b.FTCD1122) < 5, `LCV-CD1104 MANUAL 0 %: condensate to the deaerator ${a.FTCD1122} -> ${b.FTCD1122}`);
  ck(errs.length === 0, 'no page error' + (errs.length ? ': ' + errs.join(' | ') : ''));
  console.log(fail ? 'FAILED ' + fail : 'ALL PASS');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
