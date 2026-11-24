// beta.367 (ROSÉ): the Warm and Hot starts of the start screen are the save points of a trip at 150 MW that the physics cooled (RULES Q3),
// not fixed numbers. Real clicks: start screen > Warm (or Hot) > Operator, then RUN for 60 s. Checks: the plant is the bottled-up unit of
// that save (HP turbine metal in the band of the TCS mode band of tcs.js: warm 230 ~ 420 C, hot above 420 C), the unit chip names the
// restart, RUN goes on with no trip of its own and no page error.
// Usage: node tests/regress/warm_hot_start.js [html]
const fs = require('fs');
const { open, startAs, pressRun } = require('./lib');
const html = process.argv.find(a => /\.html$/.test(a)) || 'dist/' + fs.readdirSync('dist').find(x => /^logic-sim-v[\d.]+(?:-beta\.\d+)?\.html$/.test(x));
(async () => {
  let fail = 0;
  const ck = (ok, w) => (console.log((ok ? 'PASS ' : 'FAIL ') + w), ok || fail++);
  for (const [st, lo, hi] of [['Warm', 230, 420], ['Hot', 420, 700]]) {
    const { browser, page, errs } = await open(html);
    await page.setViewportSize({ width: 1600, height: 900 });
    await startAs(page, st);
    await page.waitForTimeout(2000);
    const rd = () =>
      page.evaluate(() => {
        const U = AN.unit || {},
          c = U.tc || U.tco || {};
        const tmPv = () => { for (const sh of AN.sheets) { const S = sh.S; if (!S || !S.blk) continue; const b = S.blk.find(x => x.tag === 'EIC-TM'); if (b) { const n = (b.i || []).find(n => n >= 0 && /EIC-TM.PV/.test(AN.nm(S, n) || '')); return [n != null ? +S.rt.v[n] : NaN, +(S.rt.st[b.id] || {}).val]; } } return [NaN, NaN]; };
        return { Pd: U.Pd, Tb: U.Tb, Thp: c.Thp, Trh: c.Trh, mode: c.mode, MW: +U.MW || 0, tm: tmPv(), mft: !!U.mft, chip: [...document.querySelectorAll('#plchip em, button')].map(b => b.textContent.trim()).find(t => /^Unit · /.test(t)) || '' };
      });
    const a = await rd();
    ck(a.Thp > lo && a.Thp <= hi, st + ': HP turbine metal ' + (a.Thp || 0).toFixed(1) + ' C in the ' + st.toUpperCase() + ' band ' + lo + ' ~ ' + hi + ' C');
    ck(a.Pd > 1 && a.Tb > 100, st + ': bottled-up boiler kept its heat: drum ' + (a.Pd || 0).toFixed(1) + ' kg/cm2, bed ' + (a.Tb || 0).toFixed(0) + ' C');
    ck(new RegExp(st + ' restart').test(a.chip), st + ': unit chip "' + a.chip + '"');
    await pressRun(page);
    await page.waitForTimeout(60000);
    const b = await rd();
    ck([b.Pd, b.Tb, b.Thp].every(Number.isFinite), st + ': after 60 s RUN: drum ' + (b.Pd || 0).toFixed(1) + ', bed ' + (b.Tb || 0).toFixed(0) + ', HP metal ' + (b.Thp || 0).toFixed(1));
    /* beta.370 (JENNIE, Rosé): the ATS mode follows the metal before the preparation (tcs.js), and the turbine master PV is the generator MW */
    ck(b.mode === st.toLowerCase(), st + ': TCS start-up mode ' + b.mode + ' (HP ' + (b.Thp || 0).toFixed(1) + ', RH ' + (b.Trh || 0).toFixed(1) + ' C)');
    ck(Math.abs(b.tm[0] - b.MW) < 2, st + ': turbine master EIC-TM PV ' + b.tm[0] + ' MW = generator ' + b.MW.toFixed(1) + ' MW (station out ' + b.tm[1] + ')');
    ck(errs.length === 0, st + ': no page error' + (errs.length ? ' (' + errs[0] + ')' : ''));
    await browser.close();
  }
  console.log(fail ? fail + ' FAIL' : 'ALL PASS');
  process.exit(fail ? 1 : 0);
})();
