/* PHASE 13 GATE: the instructor functions of docs/ACCEPTANCE.md "Gamit ng instructor" (ANSI/ANS-3.5 instructor functions; RULES.md Q1),
   on the Operator Station page in the Worker engine the app ships, headless. The station has no separate instructor console (audit #6,
   user 2026-11-24): the Plant menu of the station and the app's own Run / Pause and speed are the instructor functions.
     1. Plant menu: the four starting points (150 MW, Cold, Warm, Hot), Save points, Backtrack, Trips (turbine trip, line breaker 52L1), Faults.
     2. Freeze: Paused = the plant time stands; Run = it goes on.
     3. Speed: a slow (x0.5) and fast choices; x0.5 runs about half of real time, x5 faster than real time.
     4. Save / load of a starting point: tests/gate/behaviour.cjs (SAVE then LOAD = the same plant); here the Save now control is on the menu.
     5. Backtrack: the app keeps a point by itself while the plant runs; Back to the first point puts the plant time back to it, the fault
        put on after it is off again, the points after it are dropped, the plant is paused.
     6. Malfunction: a fault put on by two presses of its button in the Plant menu is on in the plant; Clear all faults clears it.
     7. Field action: the lower ring header drains (local valves V-BD1005 ~ 1021, AN.field('lhd')) open to 25 % and close again.
     8. Warm and Hot from the Plant menu load the app's restarts (a trip at 150 MW that the physics cooled, RULES.md 3.7).
   Usage: node tests/gate/instructor.cjs <station.html>. Exit 0 = pass. PLAYWRIGHT_MODULE / CHROMIUM env as behaviour.cjs. */
const fs = require('fs'),
  url = require('url');
const pw = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const html = process.argv[2];
if (!html || !fs.existsSync(html)) {
  console.log('LOAD ERROR: no station html', html);
  process.exit(2);
}
let bad = 0;
const ok = (c, w) => (console.log((c ? 'PASS ' : 'FAIL ') + w), c || bad++);
const wait = ms => new Promise(r => setTimeout(r, ms));
const SH = process.env.SHOTS || ''; /* a folder for pictures of the Plant menu (none in Checks) */
(async () => {
  const b = await pw.chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  const errs = [];
  p.on('pageerror', e => errs.push(String(e.message)));
  await p.addInitScript(() => (window.open = () => null));
  await p.goto(url.pathToFileURL(html).href + '?worker=1');
  await p.waitForFunction(() => window.AN && window.lsSaves, null, { timeout: 240000 });
  await p.waitForTimeout(3000);
  await p.getByRole('button', { name: 'Later' }).click({ timeout: 5000 }).catch(() => {});
  await p.getByText('Normal operation at full load').click({ timeout: 120000 });
  await p.waitForFunction(() => AN.sheets && AN.sheets.length >= 54 && AN.unit && AN.unit.MW > 140 && !AN._loading, null, { timeout: 240000 });
  await p.waitForTimeout(15000);
  await p.waitForFunction(() => window.ENG && ENG.mode === 'mirror', null, { timeout: 120000, polling: 1000 });
  const T = () => p.evaluate(() => +AN.unit.t);
  /* the station frame is in an open shadow root: the locators of Playwright reach into it */
  const POP = p.locator('section.st-pop[aria-label="Plant menu"]');
  const shut = async () => {
    if (await POP.isVisible().catch(() => false)) await POP.getByRole('button', { name: 'Close', exact: true }).click();
    await wait(300);
  };  /* the menu is filled when it opens: close it first so the rows show the plant as it is now */
  const menu = async () => {
    await shut();
    if (!(await POP.isVisible().catch(() => false))) await p.getByRole('button', { name: 'Plant menu' }).first().click();
    await POP.waitFor({ state: 'visible', timeout: 10000 });
    await wait(800);
  };

  /* 1. the Plant menu */
  await menu();
  if (SH) await p.screenshot({ path: SH + '/plant-menu.png' });
  const M = { h: await POP.locator('h2').allTextContents(), b: (await POP.locator('button').allTextContents()).map(t => t.trim()) };
  for (const h of ['Starting point', 'Save points', 'Backtrack', 'Trips', 'Faults']) ok(M.h.includes(h), 'Plant menu has the section ' + h);
  for (const t of ['150 MW', 'Cold', 'Warm', 'Hot', 'Save now', 'Turbine trip']) ok(M.b.includes(t), 'Plant menu has the button ' + t);
  ok(M.b.some(t => /line breaker/.test(t)), 'Plant menu has the 230 kV line breaker 52L1 (a breaker of the field)');
  await shut();

  /* 2. freeze */
  await p.evaluate(() => (AN.clockFixed(false), AN.pauseOn ? AN.pauseOn() : (AN.run = false)));
  await wait(1500);
  const f0 = await T();
  await wait(4000);
  const f1 = await T();
  ok(Math.abs(f1 - f0) < 1e-6, 'Paused: the plant time stands (' + f0.toFixed(1) + ' -> ' + f1.toFixed(1) + ' s)');
  /* 3. speed: the station's own select */
  const opts = await p.evaluate(() => [...[...document.querySelectorAll('select')].find(x => x.title === 'Simulation speed').options].map(o => +o.value));
  ok(opts.includes(0.5) && opts.some(v => v > 1), 'speed choices slow and fast: ' + opts.join(', '));
  const rate = async v => {
    await p.evaluate(v => {
      const s = [...document.querySelectorAll('select')].find(x => x.title === 'Simulation speed');
      s.value = String(v);
      s.dispatchEvent(new Event('change', { bubbles: true }));
      AN.run = true;
    }, v);
    await wait(3000);
    const a = await T(),
      r0 = Date.now();
    await wait(10000);
    return ((await T()) - a) / ((Date.now() - r0) / 1000);
  };
  const r1 = await rate(1);
  ok(r1 > 0.5, 'Run: the plant time goes on (x1 = ' + r1.toFixed(2) + ' plant s per s)');
  const rh = await rate(0.5);
  ok(rh > 0.3 && rh < 0.7, 'x0.5: ' + rh.toFixed(2) + ' plant s per s');
  const r5 = await rate(5);
  ok(r5 > 2.5, 'x5: ' + r5.toFixed(2) + ' plant s per s');
  await rate(1);

  /* 5. backtrack: at least two points kept by the app, then a fault, then Back to the first */
  await p.evaluate(() => (AN.clockFixed(true), (AN.run = true)));
  const BTN = () => p.evaluate(() => lsSaves.back.list().length);
  for (let k = 0; k < 2; k++) {
    await p.evaluate(async () => AN.runFixed(lsSaves.back.every + 10, 0.5));
    await wait(23000); /* the app keeps a point at most each 20 s of real time */
  }
  const L = await p.evaluate(() => lsSaves.back.list());
  ok(L.length >= 2, 'backtrack points kept by the app: ' + L.map(e => e.t.toFixed(0)).join(', '));
  const flt = await p.evaluate(() => (AN.fault('ai.msp.lo', true), AN.fault().some(f => f.id === 'ai.msp.lo' && f.on)));
  await p.evaluate(async () => AN.runFixed(30, 0.5));
  ok(flt, 'a fault on after the last point (main steam pressure transmitter signal lost)');
  await menu();
  const backs = POP.locator('.st-svl').nth(1).getByRole('button', { name: 'Back', exact: true });
  const nb = await backs.count();
  if (SH) await p.screenshot({ path: SH + '/plant-menu-backtrack.png' });
  ok(nb === L.length, 'Plant menu lists ' + nb + ' backtrack points');
  if (nb) {
    const h = await backs.last().elementHandle(); /* newest first: the last row is the oldest point; its words change on the first press */
    await h.click();
    await wait(300);
    await h.click();
    await p.waitForFunction(t => Math.abs(AN.unit.t - t) < 1.5, L[0].t, { timeout: 60000 }).catch(() => {});
    await wait(3000);
    const a = await p.evaluate(() => ({ t: +AN.unit.t, run: !!AN.run, n: lsSaves.back.list().length, f: AN.fault().some(f => f.id === 'ai.msp.lo' && f.on) }));
    ok(Math.abs(a.t - L[0].t) < 1.5, 'Back: the plant time is that of the first point (' + a.t.toFixed(1) + ' / ' + L[0].t.toFixed(1) + ')');
    ok(!a.f, 'Back: the fault put on after the point is off');
    ok(a.n === 1, 'Back: the points after it are dropped (' + a.n + ' left)');
    ok(!a.run, 'Back: the plant is paused');
  }
  await p.evaluate(() => AN.fault('ai.msp.lo', false));

  /* 6. a malfunction from the Plant menu */
  await menu();
  const fb = await POP.getByRole('button', { name: 'Main steam pressure transmitter (PT-MS1002) signal lost', exact: true }).first().elementHandle();
  await fb.click();
  await wait(300);
  await fb.click();
  await wait(1500);
  const on = await p.evaluate(() => AN.fault().some(f => f.id === 'ai.msp.lo' && f.on));
  ok(on, 'Plant menu: the fault is put on by two presses of its button');
  await menu();
  await POP.getByRole('button', { name: 'Clear all faults', exact: true }).first().click().catch(() => {});
  await wait(1500);
  ok(!(await p.evaluate(() => AN.fault().some(f => f.on))), 'Clear all faults: no fault on');

  /* 7. a field action: local drain valves */
  const fa = await p.evaluate(async () => {
    AN.field('lhd', 25);
    await new Promise(r => setTimeout(r, 1500));
    const o = !!AN.fieldState().lhd;
    AN.field('lhd', 0);
    await new Promise(r => setTimeout(r, 1500));
    return { o, c: !!AN.fieldState().lhd };
  });
  ok(fa.o && !fa.c, 'field action: ring header drains open 25 % (' + fa.o + '), closed again (' + !fa.c + ')');
  /* 8. the Warm and Hot restarts from the Plant menu (two presses each): the app's own save point of a trip at 150 MW (app.js rst) */
  for (const k of ['Warm', 'Hot']) {
    await menu();
    const sb = await POP.getByRole('button', { name: k, exact: true }).first().elementHandle();
    await sb.click();
    await wait(300);
    await sb.click();
    const got = await p
      .waitForFunction(k => window.lsRestartKind === k && AN.unit && !AN._loading, k.toLowerCase(), { timeout: 240000, polling: 1000 })
      .then(() => true, () => false);
    const st = await p.evaluate(() => ({ kind: window.lsRestartKind, MW: +AN.unit.MW, Pd: +AN.unit.Pd }));
    ok(got, 'Plant menu ' + k + ': the ' + k + ' restart is loaded (' + JSON.stringify(st) + ')');
  }
  ok(!errs.length, 'no page error' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
  await b.close();
  console.log((bad ? 'FAIL' : 'PASS') + ' instructor gate (Phase 13): ' + bad + ' failed');
  process.exit(bad ? 1 : 0);
})().catch(e => {
  console.log('FAIL instructor gate: ' + e.message);
  process.exit(1);
});
