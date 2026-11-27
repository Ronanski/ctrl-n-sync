// The feedwater, extraction and spray transmitters on the HX pages (HX-feedwater, HX-drum-steam, HX-reheat-steam, data-hv) at
// "Start at 150 MW" with RUN: every box shows a number, and the values are judged against the design only (user rule 0,
// 2026-11-28: design documents and as-built drawings only):
//   HB PPE-14-0725 case 1 (150 MW): No.2 extraction PT-TS1013 = stage 14.87 ata, No.3 PT-TS1017 = 6.369 ata (+- 1.0 kg/cm2, the
//   sweep judge band of a pressure), cold reheat TT-TS1011 370.2 C and BFWP outlet TT-FW1011 160.7 C (+- 5 C, the sweep band);
//   the BFWP suction PT-FW1115 by the as-built head (plantsw.js W.sucP); PT-FW1160 (economizer inlet) has no design value read:
//   a number only. The spray valves follow the F(X) of their controller (ABC-011 LN47 / LN46); both BFWP suction valves closed:
//   no spray flow.
// Usage: node tests/regress/fw_page_values.js [html]
const fs = require('fs');
const { open, startAs, pressRun, openHx } = require('./lib.js');
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
  const K = ['PT-TS1013', 'PT-TS1017', 'TT-TS1011', 'PT-FW1115-A', 'PT-FW1115-B', 'TT-FW1011', 'PT-FW1160', 'FT-FW1109', 'FT-FW1119', 'FT-FW1149', 'FT-FW1059', 'ZT-FW1110-1', 'ZT-FW1110-2', 'ZT-FW1120-1', 'ZT-FW1120-2'];
  /* the app's own start (as hx_values.js): Start at 150 MW, RUN, the plant model live */
  await startAs(page, '150 MW');
  await pressRun(page);
  await page.waitForTimeout(5000);
  /* NANA 2026-11-28: the HX pages (Phase 9) replaced the old page 06 FEEDWATER (MK06 / data-v): the 15 values sit on HX-feedwater,
     HX-drum-steam (the SH sprays) and HX-reheat-steam (the RH and HP bypass sprays), each box a data-hv */
  const read = async () => {
    const o = {};
    for (const pg of ['HX-feedwater', 'HX-drum-steam', 'HX-reheat-steam']) {
      await openHx(page, pg);
      await page.waitForTimeout(2500);
      const r = await page.evaluate(K => Object.fromEntries(K.map(k => [k, (document.querySelector(`#plantws [data-hv="${k}"]`) || {}).textContent || null])), K);
      for (const k of K) if (r[k] != null && o[k] == null) o[k] = r[k];
    }
    return o;
  };
  const tt = () =>
    page.evaluate(() => {
      const T = AN.sheets.find(s => s.name === 'ABC-011').S,
        c = AN.hmiCtrls(T).find(x => x.tag === 'TICBR1130');
      return Object.assign({ ms: Math.round(AN.unit.ms), mv1: Math.round(+T.rt.v[c.out] * 10) / 10, daP: AN.unit.da.P, daRho: AN.unit.da.rho, daRhoL: AN.unit.da.rhoL }, AN.unit.tt);
    });
  const a = await read(),
    m = await tt();
  console.log(JSON.stringify(a));
  console.log(JSON.stringify(m));
  const near = (k, y, d) => isFinite(m[k]) && Math.abs(m[k] - y) <= d;
  ck(K.every(k => a[k] && !/-----/.test(a[k])), 'HX pages: the 15 values show a number' + (K.some(k => !a[k] || /-----/.test(a[k])) ? ': ' + K.filter(k => !a[k] || /-----/.test(a[k])).join(' ') : ''));
  ck(near('PT-TS1013', 14.87 - 1.0332, 1.0) && near('PT-TS1017', 6.369 - 1.0332, 1.0), `main steam ${m.ms} T/H: extraction No.2 ${m['PT-TS1013']}, No.3 ${m['PT-TS1017']} kg/cm2 (HB case 1: 13.84 / 5.34)`);
  ck(near('TT-TS1011', 370.2, 5), `cold reheat to No.2 HPH ${m['TT-TS1011']} C (HB case 1: 370.2)`);
  /* Phase 11 NANA 2026-11-28: the suction at the transmitter by the as-built
     heights (plantsw.js W.sucP): deaerator + the storage water from the normal level GL.+33224 to the tap GL.+12500 + the 1.9 m impulse
     line; the idle pump B reads that, the running pump A that less its strainer DP. The level offset (LT-CD1104, mm) is within 0.02 */
  const sB = m.daP + (m.daRho * (33.224 - 12.5)) / 1e4 + (m.daRhoL * 1.9) / 1e4;
  ck(near('PT-FW1115-B', sB, 0.05) && m['PT-FW1115-A'] <= m['PT-FW1115-B'] && m['PT-FW1115-B'] - m['PT-FW1115-A'] < 0.5, `BFWP suction A ${m['PT-FW1115-A']} / B ${m['PT-FW1115-B']} kg/cm2 (as-built head ${sB.toFixed(2)})`);
  ck(near('TT-FW1011', 160.7, 5), `BFWP discharge ${m['TT-FW1011']} C (HB case 1: 160.7), economizer inlet ${m['PT-FW1160']} kg/cm2 (no design value read)`);
  ck(m['ZT-FW1110-2'] >= 99 && m['ZT-FW1110-1'] > 0, `No.1 SH spray MV ${m.mv1} %: valves ${m['ZT-FW1110-1']} / ${m['ZT-FW1110-2']} % (LN47 / LN46)`);
  ck(m['FT-FW1109'] > 5 && m['FT-FW1109'] <= 60 && m['FT-FW1119'] >= 0 && m['FT-FW1149'] >= 0 && m['FT-FW1059'] >= 0, `spray flows No.1 ${m['FT-FW1109']}, No.2 ${m['FT-FW1119']}, RH ${m['FT-FW1149']}, HP bypass ${m['FT-FW1059']} T/H`);
  /* both BFWP suction valves closed by hand (V-FW1001 / 1002): no pump head, the sprays have no pressure to flow */
  await page.evaluate(() => {
    AN.swValve('V-FW1001', 0);
    AN.swValve('V-FW1002', 0);
  });
  await page.waitForTimeout(25000); /* 20 plant seconds and more at the live speed */
  const b = await tt();
  ck(b['FT-FW1109'] === 0 && b['FT-FW1119'] === 0 && b['FT-FW1149'] === 0, `BFWP suction valves closed: sprays No.1 ${m['FT-FW1109']} -> ${b['FT-FW1109']}, No.2 ${b['FT-FW1119']}, RH ${b['FT-FW1149']} T/H`);
  ck(errs.length === 0, 'no page error' + (errs.length ? ': ' + errs.join(' | ') : ''));
  console.log(fail ? 'FAILED ' + fail : 'ALL PASS');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
