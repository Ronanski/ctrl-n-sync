/* beta.566 (EIMI): the system alarm of every control cabinet and panel on HX-control-system, one by one: the instructor sets it, only that
   cabinet says ALARM; the relay panel inputs reach rows 6 and 7 of DITL-42; the second faceplate opens. node tests/regress/hx_dcs_alarm.js [html] */
const { open, startAs, pressRun, openHx } = require('./lib.js');
const fs = require('fs');
(async () => {
  const html = process.argv[2] || 'dist/' + fs.readdirSync('dist').find(x => /^logic-sim-v.*[.]html$/.test(x));
  const { browser, page } = await open(html);
  let bad = 0;
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  const ok = (c, t) => {
    console.log((c ? 'PASS ' : 'FAIL ') + t);
    if (!c) bad++;
  };
  await page.setViewportSize({ width: 1920, height: 1080 });
  await startAs(page, '150 MW');
  await pressRun(page);
  await openHx(page, 'HX-control-system');
  await page.waitForTimeout(5000);
  const read = () =>
    page.evaluate(() =>
      [...document.querySelectorAll('[data-hv^="fld:"]')]
        .filter(e => /SYSERR|POWALM|PLOSS/.test(e.dataset.hv) && e.closest('.hx-node'))
        .map(e => [e.dataset.hv.slice(4), e.textContent, e.classList.contains('hx-wrn')])
    );
  const row = k => page.evaluate(k => HX.data.value('dl:DITL-42|i|' + k), k);
  let r = await read();
  ok(r.length === 18, '18 alarms on the page: ' + r.length);
  ok(r.every(x => x[1] === 'NORMAL' && !x[2]), 'all NORMAL at 150 MW');
  for (const [tag] of r) {
    await page.evaluate(t => AN.fault('fs.dcs.' + t, true), tag);
    let a = [];
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(250);
      a = (await read()).filter(x => x[1] === 'ALARM');
      if (a.length) break;
    }
    ok(a.length === 1 && a[0][0] === tag && a[0][2], tag + ' ALARM: ' + a.map(x => x[0]).join(' '));
    const k = { 'ARP1-SYSERR': 6, 'IRP1-POWALM': 7 }[tag];
    if (k) {
      await page.waitForTimeout(1500);
      ok((await row(k)) === 1, tag + ' = DITL-42 input row ' + k);
    }
    if (tag === '1021-SYSERR') {
      await page.click('[data-yn="mon:c1021"]');
      await page.waitForTimeout(800);
      ok(await page.evaluate(() => /1021-SYSERR/.test(document.body.innerText) && /PERMISSIVE . TREND . MONITOR/.test(document.body.innerText)), 'second faceplate of FCS1021');
      await page.keyboard.press('Escape');
    }
    await page.evaluate(t => AN.fault('fs.dcs.' + t, false), tag);
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(250);
      if (!(await read()).some(x => x[1] === 'ALARM')) break;
    }
  }
  ok((await read()).every(x => x[1] === 'NORMAL'), 'all NORMAL again');
  ok(!errs.length, 'no page error ' + errs.join(' | '));
  await browser.close();
  console.log(bad ? bad + ' FAILED' : 'ALL PASS');
  process.exit(bad ? 1 : 0);
})();
