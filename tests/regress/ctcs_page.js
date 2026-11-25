// The condenser tube cleaning page, real clicks at 150 MW: the DCS faceplate (DITL-119 AUTO STOP / AUTO START), the local panel, a drive in
// MANUAL, and every Y / N square. Usage: node tests/regress/ctcs_page.js [html] [screenshot folder]
const { open, startAs, pressRun, openHx } = require('./lib.js');
const fs = require('fs');
const html = process.argv.find(a => /\.html$/.test(a)) || 'dist/' + fs.readdirSync('dist').find(x => /^logic-sim-v[\d.]+(?:-beta\.\d+)?\.html$/.test(x));
const dir = process.argv[2] && !/\.html$/.test(process.argv[2]) ? process.argv[2] : null;
(async () => {
  const { browser, page, errs } = await open(html);
  let fail = 0;
  const ck = (ok, w) => (console.log((ok ? 'PASS ' : 'FAIL ') + w), ok || fail++);
  await page.setViewportSize({ width: 1920, height: 1080 });
  await startAs(page, '150 MW');
  await pressRun(page);
  await openHx(page, 'HX-tube-cleaning');
  await page.waitForTimeout(1500);
  const C = () => page.evaluate(() => JSON.parse(JSON.stringify(AN.unit.pkg.ctcs)));
  const shot = n => (dir ? page.screenshot({ path: dir + '/ctcs-' + n + '.png' }) : null);
  const fp = () => page.evaluate(() => [...document.querySelectorAll('#fpop, #fpop2')].filter(e => e.getClientRects().length).map(e => e.innerText).join('\n'));
  const close = () => page.evaluate(() => [...document.querySelectorAll('.fpo-x, .fpo [aria-label="Close"]')].forEach(b => b.click()));
  /* the symbol of an item by its first words */
  const sym = async (word, nth) => {
    const r = await page.evaluate(
      ([w, n]) => {
        const t = [...document.querySelectorAll('.hx-process text')].filter(e => e.textContent.trim() === w)[n || 0],
          g = t && t.closest('[data-hp],[data-open]');
        if (!g) return null;
        const s = t.getBoundingClientRect();
        return { x: s.x + s.width / 2, y: s.y + s.height / 2 };
      },
      [word, nth]
    );
    if (!r) return false;
    await page.mouse.click(r.x, r.y);
    await page.waitForTimeout(700);
    return true;
  };
  const press = async (label, go) => {
    const r = await page.evaluate(l => {
      const b = [...document.querySelectorAll('button.fpo-cmd')].find(e => e.getClientRects().length && e.textContent.trim() === l && !e.disabled);
      if (!b) return null;
      const s = b.getBoundingClientRect();
      return { x: s.x + s.width / 2, y: s.y + s.height / 2 };
    }, label);
    if (!r) return false;
    await page.mouse.click(r.x, r.y);
    await page.waitForTimeout(300);
    if (go !== false) {
      const e = await page.evaluate(() => {
        const b = [...document.querySelectorAll('button.fpo-go')].find(e => e.getClientRects().length);
        if (!b) return null;
        const s = b.getBoundingClientRect();
        return { x: s.x + s.width / 2, y: s.y + s.height / 2 };
      });
      if (!e) return false;
      await page.mouse.click(e.x, e.y);
    }
    await page.waitForTimeout(2500);
    return true;
  };
  /* 1 DCS */
  ck(await sym('DCS control, train A'), 'DCS faceplate opens');
  let t = await fp();
  ck(/IN OPERATION/.test(t) && /AUTO START/.test(t) && /AUTO STOP/.test(t), 'DCS faceplate: status and the two buttons');
  ck(await press('AUTO STOP'), 'AUTO STOP pressed');
  ck((await C()).A.st === 4, 'DCS AUTO STOP: ball collection');
  await shot('dcs');
  await close();
  /* 2 panel of train B: refused in remote auto, LOCAL AUTO, AUTO STOP, SEQUENCE STOP, MANUAL */
  ck(await sym('Local panel, train B'), 'local panel opens');
  await press('AUTO STOP');
  ck(/Refused/.test(await fp()) && (await C()).B.st === 3, 'panel AUTO STOP refused in REMOTE AUTO, the reason is shown');
  ck(await press('SEQUENCE STOP AND RESET'), 'SEQUENCE STOP AND RESET');
  ck((await C()).B.st === 0, 'sequence stopped');
  ck((await press('MANUAL')) && (await C()).B.mode === 2, 'MANUAL');
  await shot('panel');
  await close();
  await page.evaluate(() => AN.runFixed(20));
  ck((await C()).B.d.N01.p === 0, 'inlet valve closed');
  ck(await sym('Vessel inlet valve', 1), 'inlet valve of train B opens its faceplate');
  ck((await press('OPEN')) && (await C()).B.d.N01.c === 1, 'OPEN by hand in MANUAL');
  await page.evaluate(() => AN.runFixed(20));
  ck((await C()).B.d.N01.p === 1, 'valve open');
  await shot('valve');
  await close();
  /* 3 every Y / N square of the page opens its faceplate with rows */
  const yn = await page.evaluate(() =>
    [...document.querySelectorAll('.hx-process .hx-yn')].map(g => {
      const r = g.getBoundingClientRect();
      return { k: g.dataset.yn, x: r.x + r.width / 2, y: r.y + r.height / 2 };
    })
  );
  ck(yn.length === 18, yn.length + ' Y / N squares');
  let no = [];
  for (const q of yn) {
    await close();
    await page.mouse.click(q.x, q.y);
    await page.waitForTimeout(450);
    const x = await fp();
    if (!/PERMISSIVE · TREND · MONITOR/.test(x) || /undefined|NaN/.test(x)) no.push(q.k);
    if (dir && q === yn[yn.length - 2]) await shot('mon');
  }
  ck(!no.length, 'each opens PERMISSIVE · TREND · MONITOR' + (no.length ? ', not: ' + no.join() : ''));
  ck(!errs.length, 'no page errors ' + errs.slice(0, 2).join(' | '));
  await browser.close();
  console.log(fail ? fail + ' FAIL' : 'ALL PASS');
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.log('FAIL ' + e.stack);
  process.exit(1);
});
