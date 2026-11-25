// Lane 9 (AUDIT FIX : SORA, beta.449): the lane 2 TCS I/O list (src/data/tcs-io.json, tcs-dcs.json, src/digital/tce-io.js) is loaded in
// the page, and the TCS steam values reach it through the engine API (AN.tceSteam = tcsSteam, AN.tceCrp = tcsCrp, src/analog/engine/api.js).
// Before: in the built page these ends were NaN (MSV inlet steam temp A ~ D, MSV inlet press, hot reheat temp / press, HP exhaust press).
// Read only: nothing here writes the plant. Headless, station page at 150 MW. Usage: node tests/regress/tce_io_page.cjs [html]
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/opt/node22/lib/node_modules/playwright');
const fs = require('fs'),
  path = require('path'),
  os = require('os'),
  url = require('url'),
  cp = require('child_process');
const html = process.argv.find(a => /\.html$/.test(a)) || 'dist/' + fs.readdirSync('dist').find(x => /^logic-sim-v[\d.]+(?:-beta\.\d+)?\.html$/.test(x));
const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'st-')), 'index.html');
cp.execFileSync(process.execPath, ['tools/station/build.js', html, out]);
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });
  let fail = 0;
  const ck = (ok, w) => (console.log((ok ? 'PASS ' : 'FAIL ') + w), ok || fail++);
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(url.pathToFileURL(out).href + '?state=150mw&worker=0');
  await p.waitForFunction(() => document.body.classList.contains('st'), null, { timeout: 240000 });
  await p.waitForTimeout(3000);
  const r = await p.evaluate(() => {
    const T = window.TCE_IO_LIVE;
    if (!T || !window.AN) return { none: 1 };
    const U = AN.unit;
    const steam = [], model = { n: 0, nan: [] };
    for (const row of T.rows) {
      const e = T.end(row.id);
      if (!e || e.kind !== 'model') continue;
      model.n++;
      const v = T.read(U, row.id);
      if (!isFinite(v)) model.nan.push(row.id);
      if (/tcsSteam|tcsCrp/.test(e.text || '')) steam.push([row.id, row.name, v]);
    }
    const mb = Object.keys(TCE_IO.modbus)
      .filter(k => /tcsCrp|cold reheat|HP exhaust/i.test(TCE_IO.modbus[k][1] || ''))
      .map(k => [k, TCE_IO.modbus[k][1].slice(0, 60), T.mbRead(U, k)]);
    return { steam, mb, model, s: AN.tceSteam && AN.tceSteam(), crp: AN.tceCrp && AN.tceCrp(), dcs: (window.TCS_DCS_LIST || {}).rows ? TCS_DCS_LIST.rows.length : -1 };
  });
  if (r.none) {
    ck(false, 'TCS I/O list in the page (window.TCE_IO_LIVE, AN)');
  } else {
    ck(r.dcs > 0, 'TCS -> DCS Modbus list in the page: ' + r.dcs + ' rows');
    for (const [id, n, v] of r.steam) ck(isFinite(v), id + ' ' + n + ' = ' + (isFinite(v) ? v.toFixed(1) : v));
    for (const [id, n, v] of r.mb) ck(isFinite(v), id + ' ' + n + ' = ' + (isFinite(v) ? v.toFixed(2) : v));
    ck(r.steam.length + r.mb.length >= 9, 'steam / cold reheat ends found: ' + (r.steam.length + r.mb.length) + ' (9 or more)');
    ck(r.s && r.s.mst > 450 && r.s.mst < 560, 'MSV inlet steam temp at 150 MW ' + (r.s && r.s.mst));
    console.log('model ends: ' + r.model.n + ', not a number: ' + r.model.nan.length + (r.model.nan.length ? ' (' + r.model.nan.slice(0, 12).join(' ') + ')' : ''));
  }
  ck(errs.length === 0, 'no page error' + (errs.length ? ' (' + errs[0] + ')' : ''));
  await b.close();
  console.log(fail ? fail + ' FAIL' : 'ALL PASS');
  process.exit(fail ? 1 : 0);
})();
