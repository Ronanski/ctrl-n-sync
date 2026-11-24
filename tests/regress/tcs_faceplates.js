// 1.0.0-beta.365 D18 (ROSÉ, user "Go ayos"): the TCS machines of an IBD sheet on the HX pages, by real clicks (the start screen, RUN, the
// page picker, a click on the machine, the faceplate buttons, EXECUTE). The faceplate of each is the one of its sheet (LS_FPOP.ibd): only
// the push buttons of the sheet (tcs-trip.js TCS_IBD_PBN), its MODE, and the permissive nets of its gates.
//  - TB-9 turning gear (Turbine oil page): START / STOP / AUTO / MANUAL and the local JOG; START disabled with no bearing oil, the
//    permissive row BEARING OIL PRESS. NORMAL shows 0; after MOP-A START it is enabled, START runs the gear
//  - TB-12 vapour extractor: START then STOP
//  - TC-28 gland steam exhauster (Aux steam page): START runs it
//  - TC-31 steam seal feed inlet valve: OPEN opens it (PV-GS1031 in service)
//  - TC-35 hood spray: OPEN / AUTO / MANUAL and no CLOSE button
// Usage: node tests/regress/tcs_faceplates.js [html] [shot dir]
const { open, startAs, pressRun, openHx } = require('./lib.js');
const fs = require('fs');
const html = process.argv.find(a => /\.html$/.test(a)) || 'dist/' + fs.readdirSync('dist').find(x => /^logic-sim-v[\d.]+(?:-beta\.\d+)?\.html$/.test(x));
const shots = process.argv.slice(2).find(a => !/\.html$/.test(a));
(async () => {
  const { browser, page, errs } = await open(html);
  let fail = 0;
  const ck = (ok, w) => {
    console.log((ok ? 'PASS ' : 'FAIL ') + w);
    if (!ok) fail++;
  };
  const wait = ms => page.waitForTimeout(ms);
  await page.setViewportSize({ width: 1600, height: 900 });
  await startAs(page, 'Cold');
  await pressRun(page);
  await wait(2000);
  const clk = async sel => {
    const b = await page.evaluate(sel => {
      const e = [...document.querySelectorAll(sel)].find(x => x.getBoundingClientRect().width > 0);
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return [r.x + r.width / 2, r.y + r.height / 2];
    }, sel);
    if (b) await page.mouse.click(b[0], b[1]);
    return !!b;
  };
  const fp = () =>
    page.evaluate(() => {
      const p = document.getElementById('fpop');
      if (!p) return null;
      return {
        b: [...p.querySelectorAll('button.fpo-cmd')].map(x => x.textContent.trim() + (x.disabled ? '-' : '+')),
        val: (p.querySelector('.fpo-hv') || {}).textContent,
        perm: [...p.querySelectorAll('.fpo-il li')].map(x => x.innerText.replace(/\s+/g, ' ')),
        tx: p.innerText.replace(/\s+/g, ' ').slice(0, 400)
      };
    });
  const btn = async t => {
    const b = await page.evaluate(t => {
      const p = document.getElementById('fpop');
      const e = p && [...p.querySelectorAll('button')].find(x => x.textContent.trim() === t && x.offsetParent);
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return [r.x + r.width / 2, r.y + r.height / 2, e.disabled];
    }, t);
    if (b && !b[2]) await page.mouse.click(b[0], b[1]);
    return b ? (b[2] ? 'disabled' : 'ok') : 'none';
  };
  const press = async t => {
    const r = await btn(t);
    if (r === 'ok') {
      await wait(300);
      await btn('EXECUTE');
    }
    return r;
  };
  const shut = async () => {
    await btn('✕');
    await wait(300);
  };
  const shot = async n => shots && (await page.screenshot({ path: shots + '/' + n + '.png' }));
  const machOpen = async n => {
    await shut();
    const ok = await clk('#plantws [data-open="mach:' + n + '"]');
    await wait(800);
    return ok;
  };
  /* ---- Turbine oil page ---- */
  await openHx(page, 'HX-turbine-oil');
  ck(await machOpen('TURNING GEAR'), 'TURNING GEAR on the Turbine oil page');
  let f = await fp();
  await shot('tg-no-oil');
  ck(f && ['START', 'STOP', 'AUTO', 'MANUAL', 'JOG'].every(t => f.b.some(x => x.startsWith(t))), 'TB-9 faceplate: START / STOP / AUTO / MANUAL / JOG (' + (f && f.b) + ')');
  ck(f && f.b.includes('START-'), 'no bearing oil: START disabled');
  ck(f && f.perm.some(x => /^N BEARING OIL/.test(x)), 'permissive BEARING OIL PRESS. NORMAL = 0 (' + (f && f.perm.join(' | ')) + ')');
  ck(await machOpen('MOP-A'), 'MOP-A');
  ck((await press('START')) === 'ok', 'MOP-A START');
  await wait(20000);
  await machOpen('TURNING GEAR');
  f = await fp();
  ck(f && f.perm.some(x => /^Y BEARING OIL/.test(x)) && f.b.includes('START+'), 'bearing oil: START enabled (' + (f && f.perm.join(' | ')) + ')');
  ck((await press('START')) === 'ok', 'TB-9 START');
  await wait(8000);
  f = await fp();
  await shot('tg-run');
  ck(f && f.val === 'RUNNING' && (await page.evaluate(() => !!AN.unit.tc.tg)), 'turning gear RUNNING (' + (f && f.val) + ')');
  ck(await machOpen('VAPOUR EXTRACTOR'), 'VAPOUR EXTRACTOR');
  f = await fp();
  ck(f && f.b.join() === 'START+,STOP-', 'TB-12 faceplate: START / STOP only (' + (f && f.b) + ')');
  ck((await press('START')) === 'ok', 'TB-12 START');
  await wait(5000);
  ck(await page.evaluate(() => !!AN.unit.tc.vex), 'vapour extractor running');
  ck((await press('STOP')) === 'ok', 'TB-12 STOP');
  await wait(5000);
  ck(await page.evaluate(() => !AN.unit.tc.vex), 'vapour extractor stopped');
  /* ---- Aux steam page ---- */
  await shut();
  await openHx(page, 'HX-aux-steam');
  await shot('aux-steam');
  ck(await machOpen('GLAND STEAM EXHAUSTER'), 'GLAND STEAM EXHAUSTER on the Aux steam page');
  f = await fp();
  ck(f && /TC-28/.test(f.tx), 'TC-28 faceplate (' + (f && f.b) + ')');
  ck((await press('START')) === 'ok', 'TC-28 START');
  await wait(5000);
  ck(await page.evaluate(() => !!AN.unit.tc.gse), 'gland steam exhauster running');
  ck(await machOpen('GLAND STEAM SEAL'), 'GLAND STEAM SEAL');
  f = await fp();
  ck(f && f.b.join().includes('OPEN') && f.b.join().includes('CLOSE'), 'TC-31 faceplate: OPEN / CLOSE (' + (f && f.b) + ')');
  ck((await press('OPEN')) === 'ok', 'TC-31 OPEN');
  await wait(5000);
  f = await fp();
  await shot('gland-open');
  ck(f && f.val === 'OPEN' && (await page.evaluate(() => !!AN.unit.tc.gsOn)), 'steam seal feed valve OPEN, PV-GS1031 in service (' + (f && f.val) + ')');
  ck(await machOpen('LP EXHAUST HOOD SPRAY'), 'LP EXHAUST HOOD SPRAY');
  f = await fp();
  await shot('hood');
  ck(f && f.b.some(x => x.startsWith('OPEN')) && !f.b.some(x => x.startsWith('CLOSE')), 'TC-35 faceplate: OPEN / AUTO / MANUAL, no CLOSE (' + (f && f.b) + ')');
  ck(errs.length === 0, 'no page errors' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
  await browser.close();
  console.log(fail ? 'FAILED ' + fail : 'ALL PASS');
  process.exit(fail ? 1 : 0);
})();
