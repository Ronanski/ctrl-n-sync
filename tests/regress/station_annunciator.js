// beta.375 (ROSÉ): the console annunciator of the LMYP OTS station (ANP drawing set K1AU3-E2-0-113, ANP1PB-03 legend). Builds the station
// page from the built simulator html, starts it at 150 MW, presses Paused (Run), opens the annunciator from the alarm bar and checks:
//  - the 100 windows A1 ~ J10, red lamps on rows A ~ C (30), 20 spares, and how many windows have a DITL output in the app
//  - the sequence: make-up pump A STOP (its drawing DITL-112, the same push button as its faceplate) -> window H1 flashes and the horn
//    sounds; Acknowledge -> H1 steady, horn quiet; START again -> H1 stays lit, "cleared, waiting for Reset"; Reset -> H1 dark
//  - Test lights every window that has a text while it is held
//  - no page error
// Usage: node tests/regress/station_annunciator.js [html] [shot dir]
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/opt/node22/lib/node_modules/playwright');
const fs = require('fs'),
  path = require('path'),
  os = require('os'),
  url = require('url'),
  cp = require('child_process');
const html = process.argv.find(a => /\.html$/.test(a)) || 'dist/' + fs.readdirSync('dist').find(x => /^logic-sim-v[\d.]+(?:-beta\.\d+)?\.html$/.test(x));
const shots = process.argv.slice(2).find(a => !/\.html$/.test(a));
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
  const W = () =>
    p.evaluate(() =>
      [...document.getElementById('station').shadowRoot.querySelectorAll('.st-aw')].map(e => ({
        id: e.firstChild.textContent,
        c: e.className,
        t: e.title
      }))
    );
  const win = async id => (await W()).find(x => x.id === id) || { c: '', t: '' };
  const until = async (f, ms) => {
    for (let t = 0; t < ms; t += 500) {
      if (await f()) return true;
      await p.waitForTimeout(500);
    }
    return false;
  };
  await p.locator('#station .st-frame button', { hasText: /^\s*Paused\s*$/ }).first().click();
  await p.waitForTimeout(2000);
  await p.locator('#station .st-annb').click();
  await p.waitForTimeout(1500);
  let L = await W();
  ck(L.length === 100, 'annunciator shows ' + L.length + ' windows (A1 ~ J10)');
  ck(L.filter(x => / r\b/.test(x.c)).length === 30 && L.slice(0, 30).every(x => / r\b/.test(x.c)), 'red lamps on rows A ~ C (30 windows)');
  ck(L.filter(x => /\bsp\b/.test(x.c)).length === 21, 'spare windows: ' + L.filter(x => /\bsp\b/.test(x.c)).length);
  const ns = L.filter(x => /\bns\b/.test(x.c)).map(x => x.id);
  console.log('INFO windows with a DITL output: ' + (79 - ns.length) + ' of 79; without: ' + (ns.join(' ') || 'none'));
  ck(!L.some(x => /\bfl\b/.test(x.c)), 'no window flashes right after the 150 MW load (standing alarms are taken as acknowledged)');
  if (shots) {
    fs.mkdirSync(shots, { recursive: true });
    await p.screenshot({ path: path.join(shots, 'ann-150.png') });
  }
  const h1 = await win('H1');
  ck(!/\blit\b/.test(h1.c), 'H1 make-up pump A stopped is dark at 150 MW (' + h1.t + ')');
  const stopped = await p.evaluate(() => LS_OP.dmotor('DITL-112', false));
  ck(stopped, 'make-up pump A STOP pressed (DITL-112)');
  ck(await until(async () => /\bfl\b/.test((await win('H1')).c), 10000), 'H1 flashes after the STOP');
  const hz = await p.evaluate(() => {
    const r = document.getElementById('station').shadowRoot;
    return [r.querySelector('.st-horn').textContent, r.querySelector('.st-annb').textContent];
  });
  ck(hz[0] === 'Horn sounding' && /Annunciator · \d/.test(hz[1]), 'horn sounding, alarm bar button "' + hz[1] + '"');
  if (shots) await p.screenshot({ path: path.join(shots, 'ann-new.png') });
  await p.locator('#station .st-afoot button', { hasText: 'Acknowledge' }).click();
  await p.waitForTimeout(800);
  let w = await win('H1');
  ck(/\blit\b/.test(w.c) && !/\bfl\b/.test(w.c), 'Acknowledge: H1 steady (' + w.t + ')');
  ck((await p.evaluate(() => document.getElementById('station').shadowRoot.querySelector('.st-horn').textContent)) === 'Horn quiet', 'Acknowledge: horn quiet');
  const started = await p.evaluate(() => LS_OP.dmotor('DITL-112', true));
  ck(started, 'make-up pump A START pressed');
  ck(await until(async () => /waiting for Reset/.test((await win('H1')).t), 15000), 'H1 stays lit after the pump runs again: ' + (await win('H1')).t);
  ck(/\blit\b/.test((await win('H1')).c), 'H1 still lit before Reset');
  await p.locator('#station .st-afoot button', { hasText: 'Reset' }).click();
  await p.waitForTimeout(800);
  w = await win('H1');
  ck(!/\blit\b/.test(w.c), 'Reset: H1 dark (' + w.t + ')');
  const tb = await p.locator('#station .st-afoot button', { hasText: 'Test' }).boundingBox();
  await p.mouse.move(tb.x + tb.width / 2, tb.y + tb.height / 2);
  await p.mouse.down();
  await p.waitForTimeout(400);
  L = await W();
  ck(L.filter(x => /\blit\b/.test(x.c)).length === 79, 'Test held: ' + L.filter(x => /\blit\b/.test(x.c)).length + ' of 79 windows lit');
  if (shots) await p.screenshot({ path: path.join(shots, 'ann-test.png') });
  await p.mouse.up();
  await p.waitForTimeout(400);
  L = await W();
  ck(L.filter(x => /\blit\b/.test(x.c)).length < 79, 'Test released: lamps back to their state');
  ck(errs.length === 0, 'no page error' + (errs.length ? ' (' + errs[0] + ')' : ''));
  await b.close();
  console.log(fail ? fail + ' FAIL' : 'ALL PASS');
  process.exit(fail ? 1 : 0);
})();
