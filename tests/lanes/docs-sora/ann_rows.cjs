// Lane 9 (AUDIT FIX : SORA, beta.429): the console annunciator reads the address text of a drawing only for the output rows that send to
// "OPC (ANN)". DITL-28A writes "S4 O.1324/1325" under output row 28 (FAB A STOPPED, 4.92 units) and closer to row 29 (2.35 units, no
// annunciator output): windows A5 / A6 (FA blower A / B stopped) must be fed by DITL-28A / DITL-28A #B output row 28. Every other window
// keeps its source (74 before). Headless, station page at 150 MW. Usage: node tests/lanes/docs-sora/ann_rows.cjs [html]
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
  await p.locator('#station .st-frame button', { hasText: /^\s*Paused\s*$/ }).first().click();
  await p.waitForTimeout(2000);
  await p.locator('#station .st-annb').click();
  await p.waitForTimeout(1500);
  const L = await p.evaluate(() =>
    [...document.getElementById('station').shadowRoot.querySelectorAll('.st-aw')].map(e => ({ id: e.firstChild.textContent, c: e.className, t: e.title }))
  );
  const w = id => L.find(x => x.id === id) || { c: '', t: '' };
  ck(/O\.1324 from DITL-28A output row 28\b/.test(w('A5').t), 'A5 FA blower A stopped: ' + w('A5').t);
  ck(/O\.1325 from DITL-28A #B output row 28\b/.test(w('A6').t), 'A6 FA blower B stopped: ' + w('A6').t);
  const ns = L.filter(x => /\bns\b/.test(x.c)).map(x => x.id);
  ck(ns.length <= 3 && ns.every(x => /^G[234]$/.test(x)), 'windows with no signal: ' + (ns.join(' ') || 'none') + ' (only G2 ~ G4 may be left, DITL-21D row 22)');
  ck(errs.length === 0, 'no page error' + (errs.length ? ' (' + errs[0] + ')' : ''));
  await b.close();
  console.log(fail ? fail + ' FAIL' : 'ALL PASS');
  process.exit(fail ? 1 : 0);
})();
