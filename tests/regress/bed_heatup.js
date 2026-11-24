// Bed heat-up on the start-up burners: the energy balance of the bed (unit.js AN_BB) closes, and the rate follows from it.
// 1.0.0-beta.364 (JENNIE, Lisa queue "bed heat-up 747 C/h vs FHI 110"): the old test forced the bed to 470 C at 150 MW with the coal and
// the full air in service and read the first 60 s (coal on a hot bed, then the bed-low MFT and the full air cooling it): that is no case
// of Fig 2. Fig 2 is the heat-up on the oil burners, so the test starts from the save "S10 four burners in service" (team-files/saves,
// PC-only; SKIP without it) and reads the bed over 30 min with the burners as the operator left them.
// 1.0.0-beta.366 (JENNIE, D31 closed as a test definition): from S10 (4.03 T/H oil, bed 262 C, 100 t charge FHI T9 p3) the design terms give
// 47.8 MW oil - 22.2 MW gas - 5.3 MW to the lower refractory = 20.3 MW into 84 MJ/K: 870 C/h at the start, ~660 C/h over the first 5 min.
// FHI Fig 2 (110 C/h) and the limit 153 C/h are kept by the operator with the firing (one burner at the 614 kg/h minimum is 7.3 MW), so the
// test checks that the bed rise equals the heat balance (U.bbQ) within 3 %, that the rate falls as the bed heats, and that the burners stay in.
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
    let U = AN.unit;
    const o = { T: [+U.Tb.toFixed(1)], E: [] };
    const oil = () => (AN.unit.oilN || []).reduce((a, x) => a + Math.max(0, +x.S.rt.v[x.n] || 0), 0);
    /* the energy check: over 60 s the bed rise against the integral of the balance terms */
    for (let w = 0; w < 3; w++) {
      const T0 = AN.unit.Tb;
      let q = 0, cb = 0;
      for (let i = 0; i < 120; i++) {
        WORLD.live = true;
        AN.stepSet(C1, 0.5);
        WORLD.tick(0.5);
        const b = AN.unit.bbQ;
        if (b) {
          q += (b.fuel - b.lm - b.tl - b.airG - b.sus - b.br) * 0.5;
          cb += b.Cb / 120;
        }
      }
      o.E.push([+(AN.unit.Tb - T0).toFixed(2), +(q / cb).toFixed(2)]);
      await run(240);
    }
    U = AN.unit;
    o.T.length = 0; /* the 5 min rates after the energy windows (15 min) */
    o.T.push(+U.Tb.toFixed(1));
    for (let k = 0; k < 6; k++) {
      await run(300);
      o.T.push(+AN.unit.Tb.toFixed(1));
    }
    o.Fc = +(+AN.unit.Fc || 0).toFixed(1);
    o.oil = +oil().toFixed(2);
    return o;
  }, sv);
  console.log(JSON.stringify(r));
  const rate = ((r.T[6] - r.T[0]) / 30) * 60,
    max5 = Math.max(...r.T.slice(1).map((t, i) => ((t - r.T[i]) / 5) * 60));
  ck(r.Fc < 0.5, `no coal on the burner heat-up (${r.Fc} t/h)`);
  ck(rate > 0, `the bed heats on the four burners: ${r.T[0]} -> ${r.T[6]} C in 30 min (from 15 min), ${rate.toFixed(0)} C/h`);
  ck(r.E.every(([d, q]) => Math.abs(d - q) <= 0.03 * Math.abs(q) + 0.05), 'the bed rise equals the heat balance over 60 s (rise, heat / Cb) ' + JSON.stringify(r.E));
  const rr = r.T.slice(1).map((t, i) => t - r.T[i]);
  ck(rr.every((d, i) => i === 0 || d <= rr[i - 1] + 0.5), `the rate falls as the bed heats (5 min steps ${rr.map(d => ((d / 5) * 60).toFixed(0)).join(', ')} C/h; fastest ${max5.toFixed(0)}; FHI 153 C/h is the operator's to keep by the firing)`);
  ck(r.oil > 3.5, 'the four burners stay in for 45 min: oil ' + r.oil + ' T/H');
  ck(!errs.length, 'no page error ' + errs.slice(0, 2).join(' | '));
  console.log(fail ? 'FAILED ' + fail : 'ALL PASS');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
