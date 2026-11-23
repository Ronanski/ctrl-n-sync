// beta.314 (JENNIE, Audit #5): the debris filter PLC timers, O&M L18-4 p36 7.4 / p47 4.3 (same in L18-5): DP above 80 mbar for
// 30 s (DP HIGH SEQUENCE LEAD TIMER) starts a 3 min flush; the SYSTEM CYCLE TIMER flushes every 4 h from the end of the last flush.
// Checks at the start "At 150 MW" (both filters IN OPERATION) on S-1502: dirty filter -> no flush before 25 s, flush by 35 s, DP back near clean after it; cycle timer at
// 4 h - 10 s on a clean filter -> flush within 15 s; a clean filter with a fresh timer does not flush in 10 min.
// Usage: node tests/regress/df_timers.js [html]
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
  await page.waitForTimeout(1500);
  const r = await page.evaluate(async () => {
    await AN.ades();
    WORLD.set(true);
    document.getElementById('load150').click();
    await AN._startP;
    const C1 = AN.sheets.find(s => s.name === 'ABC-001C'), U = () => AN.unit;
    /* the whole plant, one scan = ABC step + DITL tick of 0.5 s (as the app) */
    const run = async sec => {
      for (let i = 0; i < 2 * sec; i++) {
        WORLD.live = true;
        AN.stepSet(C1, 0.5);
        WORLD.tick(0.5);
        if (i % 200 === 199) await new Promise(r => setTimeout(r, 0));
      }
    };
    const d39 = S.sheets.find(x => /DITL-39$/.test(x.name));
    const f = x => Math.round(x * 10) / 10;
    const o = {};
    await run(60);
    o.clean = { dp: f(U().swDp1), bw: U().swBw1 || 0, cyc: f(U().swCyc1 || 0), op: [3, 14].map(r => (WORLD.out[d39.name].has(r) ? 1 : 0)) };
    U().swCyc1 = 0;
    await run(600);
    o.fresh = { bw: U().swBw1 || 0, dp: f(U().swDp1) };
    U().swDirt1 = 0.7; /* DP above 800 at the normal flow */
    await run(25);
    o.at25 = { bw: U().swBw1 || 0, dp: f(U().swDp1) };
    await run(10);
    o.at35 = { bw: U().swBw1 || 0, dp: f(U().swDp1) };
    await run(240);
    o.after = { bw: U().swBw1 || 0, dp: f(U().swDp1), dirt: f(U().swDirt1) };
    U().swDirt1 = 0;
    U().swCyc1 = 4 * 3600 - 10;
    await run(15);
    o.cyc = { bw: U().swBw1 || 0, cyc: f(U().swCyc1) };
    return o;
  });
  console.log(JSON.stringify(r));
  ck(r.clean.op[0] === 1 && r.clean.op[1] === 1, 'At 150 MW: S-1502 / S-1504 IN OPERATION (DITL-39 rows 3 / 14): ' + r.clean.op.join(' / '));
  ck(r.clean.dp > 300 && r.clean.dp < 800 && !(r.clean.bw > 0), '150 MW clean S-1502: DP ' + r.clean.dp + ' mmH2O, no flush');
  ck(!(r.fresh.bw > 0), 'clean filter, fresh cycle timer: no flush in 10 min (DP ' + r.fresh.dp + ')');
  ck(!(r.at25.bw > 0) && r.at25.dp >= 800, 'DP ' + r.at25.dp + ' above 800 for 25 s: no flush yet (lead timer 30 s)');
  ck(r.at35.bw > 0, 'after 35 s: flush running (' + r.at35.bw + ' s left)');
  ck(!(r.after.bw > 0) && r.after.dp < 800, 'flush done: DP ' + r.after.dp + ' mmH2O, dirt ' + r.after.dirt);
  ck(r.cyc.bw > 0, 'cycle timer 4 h reached on a clean filter: flush started (' + r.cyc.bw + ' s left)');
  ck(errs.length === 0, 'no page error' + (errs.length ? ': ' + errs[0] : ''));
  console.log(fail ? fail + ' FAIL' : 'ALL PASS');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
