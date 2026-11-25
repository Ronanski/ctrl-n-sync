// PR 568 (EIMI): the CRT push buttons of the analog sheets that no operator page had, each pressed with a real mouse click in RUN:
// ABC-003A ~ D PRESSURE / FLOW (burner page), ABC-057 AUTO / MANUAL MODE (furnace wall dampers), ABC-020 maintenance (reheat page),
// and the three drain pot valves of the reheat page (DITL-74, 89, 121): the click opens the CONTROL faceplate and OPEN / CLOSE reaches the sheet.
// Usage: node tests/regress/apb_buttons.js [html]
const { open, startAs, pressRun, openHx } = require('./lib.js');
const fs = require('fs');
const html = process.argv.find(a => /\.html$/.test(a)) || 'dist/' + fs.readdirSync('dist').find(x => /^logic-sim-v[\d.]+(?:-beta\.\d+)?\.html$/.test(x));
(async () => {
  const { browser, page, errs } = await open(html);
  let fail = 0;
  const ck = (ok, w) => { console.log((ok ? 'PASS ' : 'FAIL ') + w); if (!ok) fail++; };
  await page.setViewportSize({ width: 1920, height: 1080 });
  await startAs(page, '150 MW');
  await pressRun(page);
  const net = (k, t) => page.evaluate(([k, t]) => { const S = AN.sheets.find(x => x.name === k).S, i = S.lab.findIndex(l => l && String(l.t).trim() === t); return i < 0 ? null : +S.rt.v[i]; }, [k, t]);
  const btn = (k, ad) => page.locator(`#plantws .hx-hook[data-hook*="${k}|${ad}"]`).first();
  const press = async (k, ad, lamp, want) => {
    await btn(k, ad).click();
    await page.waitForTimeout(400);
    if (!lamp) {
      const v = await net(k, ad);
      ck(v === 1, `${k} ${ad}: the press reaches the sheet (${v})`);
      await page.waitForTimeout(3500);
      ck((await net(k, ad)) === 0, `${k} ${ad}: back to 0 after the press`);
      return;
    }
    await page.waitForTimeout(4200);
    const v = await net(k, lamp);
    ck(v === want, `${k} ${ad}: ${lamp} = ${v} (want ${want})`);
    const lit = await btn(k, ad).evaluate(e => e.classList.contains('lit') || /lit|on/.test(e.className.baseVal));
    ck(lit, `${k} ${ad}: the button is lit`);
  };
  await openHx(page, 'HX-oil-burners');
  for (const [i, x] of ['A', 'B', 'C', 'D'].entries()) {
    await press('ABC-003' + x, `M.03${5 + i}7`, `M.03${5 + i}9`, 1);
    await press('ABC-003' + x, `M.03${5 + i}8`, `M.03${5 + i}9`, 0);
  }
  await openHx(page, 'HX-wall-dampers');
  await press('ABC-057', 'S3 M.144A', 'S3 M.144C', 1);
  await press('ABC-057', 'S3 M.144B', 'S3 M.144C', 0);
  await openHx(page, 'HX-reheat-steam');
  await press('ABC-020', 'S2 M.017F');
  for (const tag of ['XV-CR1012', 'XV-MS1023', 'XV-CR1013']) {
    const g = page.locator(`#plantws [data-open="valve:${tag}"]`).first();
    if (!(await g.count())) { console.log(await page.evaluate(t => [...document.querySelectorAll('#plantws svg g')].filter(e => e.outerHTML.includes(t) && e.outerHTML.length < 3000).map(e => e.outerHTML.slice(0, 400)).slice(0, 2).join('\n'), tag)); fail++; continue; }
    await g.click({ force: true });
    await page.waitForTimeout(900);
    const f = page.locator('#fpop');
    ck((await f.count()) > 0, tag + ': faceplate opens: ' + ((await f.count()) ? (await f.innerText()).replace(/\s+/g, ' ').slice(0, 260) : ''));
    for (const b of ['AUTO', 'MANUAL', 'OPEN', 'CLOSE']) {
      const B = f.locator('button', { hasText: new RegExp('^' + b + '$') }).first();
      if (!(await B.count())) { console.log('  no ' + b); continue; }
      if (await B.isDisabled()) { console.log('  ' + b + ' disabled'); continue; }
      await B.click();
      const go = f.locator('.fpo-go');
      if (await go.count()) await go.click();
      await page.waitForTimeout(3500);
      console.log('  ' + b + ' -> ' + (await f.innerText()).replace(/\s+/g, ' ').slice(0, 200));
    }
    await page.evaluate(() => LS_FPOP.close());
  }
  ck(errs.length === 0, 'no page errors' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
  await browser.close();
  console.log(fail ? 'FAILED ' + fail : 'ALL PASS');
  process.exit(fail ? 1 : 0);
})();
