// Bed heat-up on the start-up burners against FHI Fig 2 (bed 110 C in the first hour) and the FHI limit 153 C/h.
// 1.0.0-beta.364 (JENNIE, Lisa queue "bed heat-up 747 C/h vs FHI 110"): the old test forced the bed to 470 C at 150 MW with the coal and
// the full air in service and read the first 60 s (coal on a hot bed, then the bed-low MFT and the full air cooling it): that is no case
// of Fig 2. Fig 2 is the heat-up on the oil burners, so the test starts from the save "S10 four burners in service" (team-files/saves,
// PC-only; SKIP without it) and reads the bed over 30 min with the burners as the operator left them.
// Usage: node tests/regress/bed_heatup.js [html] [save json]
const { open } = require('./lib.js');
const fs = require('fs');
const html = process.argv.find(a => /\.html$/.test(a)) || 'dist/' + fs.readdirSync('dist').find(x => /^logic-sim-v[\d.]+(?:-beta\.\d+)?\.html$/.test(x));
const dir = process.env.TF ? process.env.TF + '/saves' : '../team-files/saves';
const svp = process.argv.find(a => /\.json$/.test(a)) || (fs.existsSync(dir) ? dir + '/' + (fs.readdirSync(dir).find(f => /S10_four_burners_in_service/.test(f)) || '') : '');
if (!svp || !fs.existsSync(svp) || !/\.json$/.test(svp)) {
  console.log('SKIP: no save S10_four_burners_in_service');
  process.exit(0);
}
const sv = JSON.parse(fs.readFileSync(svp, 'utf8'));
(async () => {
  const { browser, page, errs } = await open(html);
  let fail = 0;
  const ck = (ok, w) => {
    console.log((ok ? 'PASS ' : 'FAIL ') + w);
    if (!ok) fail++;
  };
  await page.waitForFunction(() => AN.sheets && AN.sheets.length >= 54 && window.WORLD && WORLD.idx && window.DITL150, null, { timeout: 120000 });
  await page.waitForTimeout(1500);
  const r = await page.evaluate(async sv => {
    const C1 = AN.sheets.find(s => s.name === 'ABC-001C');
    const run = async sec => {
      for (let i = 0; i < sec * 2; i++) {
        WORLD.live = true;
        AN.stepSet(C1, 0.5);
        WORLD.tick(0.5);
        if (i % 200 === 199) await new Promise(r => setTimeout(r, 0));
      }
    };
    AN.run = false;
    DITL150.savePut({ kf: sv.kf, kd: sv.kd, ver: sv.ver });
    await run(10);
    const U = AN.unit,
      o = { T: [+U.Tb.toFixed(1)], mft: [] };
    for (let k = 0; k < 6; k++) {
      await run(300);
      o.T.push(+U.Tb.toFixed(1));
    }
    o.Fc = +(+U.Fc || 0).toFixed(1);
    return o;
  }, sv);
  console.log(JSON.stringify(r));
  const rate = ((r.T[6] - r.T[0]) / 30) * 60,
    max5 = Math.max(...r.T.slice(1).map((t, i) => ((t - r.T[i]) / 5) * 60));
  ck(r.Fc < 0.5, `no coal on the burner heat-up (${r.Fc} t/h)`);
  ck(rate > 0, `the bed heats on the four burners: ${r.T[0]} -> ${r.T[6]} C in 30 min, ${rate.toFixed(0)} C/h (FHI Fig 2: 110 C in the first hour)`);
  ck(max5 < 153, `the fastest 5 min of the heat-up ${max5.toFixed(0)} C/h, under the FHI limit 153 C/h`);
  ck(!errs.length, 'no page error ' + errs.slice(0, 2).join(' | '));
  console.log(fail ? 'FAILED ' + fail : 'ALL PASS');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
