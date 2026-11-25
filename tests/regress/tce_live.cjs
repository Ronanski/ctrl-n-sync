// Lane 9 (AUDIT FIX : SORA, beta.449): the compiled TCE / TCA program runs live in the page, side by side (src/digital/tce-live.js):
// it starts by itself, its PI/O inputs are fed from the TCS I/O list, it follows the plant time, TCE.press holds a CRT port and lets it
// go, TCE.read answers { on: false } while it is stopped (it writes nothing to the plant: read the file, there is no write).
// Headless, station page at 150 MW. Usage: node tests/regress/tce_live.cjs [html]
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
  await p.waitForTimeout(8000);
  const s1 = await p.evaluate(() => window.TCE && TCE.status());
  ck(s1 && s1.on, 'program on at load: ' + JSON.stringify(s1));
  ck(s1 && s1.t > 2 && s1.drive.length >= 14, 'program in the engine: plant time ' + (s1 && s1.t.toFixed(1)) + ' s, ' + (s1 && s1.drive.length) + ' sheets drive');
  ck(s1 && s1.inputs >= 470, 'PI/O inputs ' + (s1 && s1.inputs));
  ck(s1 && !s1.err, 'no program error ' + (s1 && s1.err));
  const hold = await p.evaluate(async () => {
    const c = TCE.crt && TCE.crt();
    const port = c && c.buttons && c.buttons.length ? c.buttons[0].port : TCE.ports().find(x => /^CRT:/.test(x));
    const ok = TCE.press(port, 600),
      v1 = TCE.port(port);
    await new Promise(r => setTimeout(r, 2500));
    return { port, ok, v1, v2: TCE.port(port), n: TCE.ports().filter(x => /^CRT:/.test(x)).length };
  });
  ck(hold.ok && hold.v1 === 1 && hold.v2 === 0, 'TCE.press(' + hold.port + ', 600 ms): ' + hold.v1 + ' then ' + hold.v2 + ' (CRT ports ' + hold.n + ')');
  const r0 = await p.evaluate(() => TCE.read('TCE114', '__no_such_key__'));
  ck(r0 === undefined, 'TCE.read of an unknown key: undefined (no new port)');
  await p.evaluate(() => TCE.stop());
  const r1 = await p.evaluate(() => TCE.read('TCE114', 'x'));
  ck(r1 && r1.on === false, 'TCE.read while stopped: ' + JSON.stringify(r1));
  await p.evaluate(() => TCE.start());
  const s2 = await p.evaluate(() => TCE.status());
  ck(s2.on, 'start again');
  const cmp = await p.evaluate(() => {
    const c = TCE.compare();
    return { ready: c.ready, pio: (c.kinds || {}).pio, n: (c.rows || []).length, count: c.count, o: (TCE.outs() || []).length };
  });
  ck(cmp.ready && cmp.pio > 0 && cmp.n === cmp.pio && Object.values(cmp.count).reduce((a, b) => a + b, 0) === cmp.pio, 'TCE.compare: every PI/O output has one state ' + JSON.stringify(cmp.count));
  ck(cmp.o > cmp.pio, 'TCE.outs: ' + cmp.o + ' outputs of the program');
  ck(errs.length === 0, 'no page error' + (errs.length ? ' (' + errs[0] + ')' : ''));
  await b.close();
  console.log(fail ? fail + ' FAIL' : 'ALL PASS');
  process.exit(fail ? 1 : 0);
})();
