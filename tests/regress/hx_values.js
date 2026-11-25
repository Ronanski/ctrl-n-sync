// Phase 9 (2026-11-26): every value box of the HX pages has a value at 150 MW (plant model running), except the ones in NOVAL below,
// each with the reason it has none (NO-SOURCE: no model or no document). A box that showed a value may not go back to '-----', and a box
// in NOVAL that gets a value must leave the list (the list only shrinks).
//  - every HX page of the registry opens with no page error
//  - the '-----' boxes of each page are exactly the NOVAL boxes of that page
// Usage: node tests/regress/hx_values.js [html]
const { open, startAs, pressRun, openHx } = require('./lib.js');
const fs = require('fs'),
  path = require('path');
const html = process.argv.find(a => /\.html$/.test(a)) || 'dist/' + fs.readdirSync('dist').find(x => /^logic-sim-v[\d.]+(?:-beta\.\d+)?\.html$/.test(x));
const NOVAL = {
  /* the generator power factor: the TCS sends it in the 0.5 ~ 1.5 transducer form (lag = pf, lead = 2 - pf), which no sheet read
     shows; the DCS out to the generator panel meter repeats it (tcs-gen.js has g.pf, the form is the gap) */
  'turbine-interface': ['TCS-AI1009', 'GCP-AO1007'],
  /* industrial water: no model of the industrial / fire water tanks, pumps and strainers yet (the tanks are filled by the water
     treatment plant, out of scope; field/bop.js) */
  'industrial-water': ['LT-IW0714', 'LT-IW0724', 'ZT-IW0391', 'DPT-IW0715-A', 'DPT-IW0715-B', 'PT-IW0715'],
  /* turbine metal temperatures, expansion and rotor position: no model of the turbine casing and rotor metal yet */
  'turbine-readings': ['TE-ST1008', 'TE-ST1001-2', 'TE-ST1002-1', 'TE-ST1002-2', 'TE-ST1005', 'TE-ST1006-1', 'TE-ST1006-2', 'TE-ST1007-1', 'TE-ST1007-2', 'TE-ST1903-B1', 'TE-ST1903-B2', 'ZE-ST1002-1', 'ZE-ST1002-2', 'ZE-ST1003-1', 'ZE-ST1003-2', 'ZE-ST1003-3', 'ZE-ST1004', 'SI1240']
};
(async () => {
  const { browser, page, errs } = await open(html);
  let fail = 0;
  const ck = (ok, w) => (console.log((ok ? 'PASS ' : 'FAIL ') + w), ok || fail++);
  await page.setViewportSize({ width: 1920, height: 1080 });
  await startAs(page, '150 MW');
  await pressRun(page);
  await page.waitForTimeout(5000);
  const pages = fs
    .readdirSync(path.join(__dirname, '..', '..', 'src', 'ui', 'plant', 'hx'))
    .filter(f => /^hx-page-.*\.js$/.test(f))
    /* the page id is the first id of the file (hx-page-boiler-steam.js = drum-steam) */
    .map(f => (/^\s{2,4}id: '([^']+)'/m.exec(fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'ui', 'plant', 'hx', f), 'utf8')) || [])[1] || f.slice(8, -3));
  let N = 0,
    D = 0;
  for (const p of pages) {
    try {
      await openHx(page, 'HX-' + p);
    } catch (e) {
      ck(false, p + ' opens: ' + e.message);
      continue;
    }
    await page.waitForTimeout(3000);
    const r = await page.evaluate(() => {
      const hv = [...document.querySelector('#plantws').querySelectorAll('[data-hv]')];
      return { n: hv.length, dash: [...new Set(hv.filter(e => /-----/.test(e.textContent)).map(e => e.getAttribute('data-hv')))] };
    });
    N += r.n;
    D += r.dash.length;
    const want = NOVAL[p] || [],
      extra = r.dash.filter(k => !want.includes(k)),
      gone = want.filter(k => !r.dash.includes(k));
    ck(!extra.length, p + ': ' + r.n + ' value boxes, no box without a value outside the list' + (extra.length ? ': ' + extra.join(' ') : ''));
    if (gone.length) ck(false, p + ': now has a value, take it out of NOVAL: ' + gone.join(' '));
  }
  console.log('value boxes ' + N + ', without a value ' + D);
  ck(!errs.length, 'no page error' + (errs.length ? ': ' + errs[0] : ''));
  await browser.close();
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
