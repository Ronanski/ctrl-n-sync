// beta.369 (ROSÉ): the LMYP OTS station start screen offers Cold, Warm, Hot and 150 MW (RULES.md 7). Builds the station page from the
// built simulator html, opens it with ?state=Warm / ?state=Hot (the start-screen shortcut of the station) and checks the unit is the
// bottled-up plant of that save point (HP turbine metal in its TCS band), the start screen lists the four states, and no page error.
// Usage: node tests/regress/station_warm_hot.js [html]
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path'), os = require('os'), url = require('url'), cp = require('child_process');
const html = process.argv.find(a => /\.html$/.test(a)) || 'dist/' + fs.readdirSync('dist').find(x => /^logic-sim-v[\d.]+(?:-beta\.\d+)?\.html$/.test(x));
const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'st-')), 'index.html');
cp.execFileSync(process.execPath, ['tools/station/build.js', html, out]);
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });
  let fail = 0;
  const ck = (ok, w) => (console.log((ok ? 'PASS ' : 'FAIL ') + w), ok || fail++);
  {
    const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
    await p.goto(url.pathToFileURL(out).href);
    await p.waitForFunction(() => { const w = document.getElementById('stationwait'); return w && w.shadowRoot && w.shadowRoot.querySelectorAll('button').length; }, null, { timeout: 120000 });
    const L = await p.evaluate(() => [...document.getElementById('stationwait').shadowRoot.querySelectorAll('button b')].map(x => x.textContent));
    ck(['150 MW', 'Cold', 'Warm', 'Hot'].every(s => L.includes(s)), 'start screen states: ' + L.join(', '));
    await p.close();
  }
  for (const [st, lo, hi] of [['Warm', 230, 420], ['Hot', 420, 700]]) {
    const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
    const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    await p.goto(url.pathToFileURL(out).href + '?state=' + st);
    await p.waitForFunction(() => document.body.classList.contains('st'), null, { timeout: 240000 });
    await p.waitForTimeout(3000);
    const r = await p.evaluate(() => { const U = AN.unit || {}, c = U.tc || U.tco || {}; return { rk: window.lsRestartKind, Pd: U.Pd, Thp: c.Thp }; });
    ck(r.rk === st.toLowerCase() && r.Thp > lo && r.Thp <= hi && r.Pd > 1, st + ': station loaded the ' + st + ' save: drum ' + (r.Pd || 0).toFixed(1) + ' kg/cm2, HP metal ' + (r.Thp || 0).toFixed(1) + ' C (band ' + lo + ' ~ ' + hi + ')');
    ck(errs.length === 0, st + ': no page error' + (errs.length ? ' (' + errs[0] + ')' : ''));
    await p.close();
  }
  await b.close();
  console.log(fail ? fail + ' FAIL' : 'ALL PASS');
  process.exit(fail ? 1 : 0);
})();
