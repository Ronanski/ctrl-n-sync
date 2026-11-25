// The start permissives of the push button machines (df.need of the boiler system files) are on both faceplates, and the precipitator of the
// furnace and flue gas page opens its own page. Real clicks at 150 MW: for every Y / N square of purge-trip, oil-burners and limestone-sand whose
// machine has df.need, the PERMISSIVE · TREND · MONITOR faceplate lists every label with Y or N equal to the logic signal, and the square is Y
// only when all are made. Usage: node tests/regress/need_lists.js [html]
const { open, startAs, openHx } = require('./lib.js');
const fs = require('fs');
const html = process.argv.find(a => /\.html$/.test(a)) || 'dist/' + fs.readdirSync('dist').find(x => /^logic-sim-v[\d.]+(?:-beta\.\d+)?\.html$/.test(x));
(async () => {
  const { browser, page, errs } = await open(html);
  let fail = 0;
  const ck = (ok, w) => (console.log((ok ? 'PASS ' : 'FAIL ') + w), ok || fail++);
  await page.setViewportSize({ width: 1920, height: 1080 });
  await startAs(page, '150 MW');
  for (const id of ['purge-trip', 'oil-burners', 'limestone-sand']) {
    await openHx(page, 'HX-' + id);
    await page.waitForTimeout(1200);
    const list = await page.evaluate(id => {
      const d = HX.pages.find(p => p.id === id),
        all = d.plan ? d.plan.items : d.lanes.flatMap(L => L.items.flatMap(c => (Array.isArray(c) ? c : [c])));
      return all
        .filter(it => {
          const M = it && it.k === 'mach' && HXREG.machines[it.mach];
          const df = M && M.bind && M.bind.df;
          return df && df.need && df.need.some(x => x.key);
        })
        .map(it => ({ mach: it.mach, need: HXREG.machines[it.mach].bind.df.need.map(x => [x.l, HX.data.value(x.key)]), name: it.name || it.mach }));
    }, id);
    ck(list.length > 0, id + ': ' + list.length + ' machines with start permissives');
    for (const m of list) {
      const key = await page.evaluate(mc => {
        const g = [...document.querySelectorAll('.hx-process .hx-yn')].find(e => {
          const n = e.closest('[data-open],[data-id]') || e.parentNode;
          return e.dataset.yn.endsWith(':' + mc) || e.dataset.yn.includes(mc) || (n && (n.outerHTML.slice(0, 400).includes('"mach:' + mc + '"') || n.outerHTML.slice(0, 400).includes(mc)));
        });
        if (!g) return null;
        const r = g.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2, yes: /\by\b/i.test(g.lastElementChild ? g.lastElementChild.textContent : '') };
      }, m.mach);
      if (!key) { ck(false, id + ' ' + m.mach + ': no Y / N square'); continue; }
      await page.mouse.click(key.x, key.y);
      await page.waitForTimeout(700);
      const txt = await page.evaluate(() => (document.getElementById('fpop2') || { innerText: '' }).innerText);
      const miss = m.need.filter(x => !txt.includes(x[0])).map(x => x[0]);
      ck(!miss.length, `${id} ${m.mach}: ${m.need.length} permissives (${m.need.filter(x => x[1] === 0).length} N) on the faceplate${miss.length ? ', missing: ' + miss.join('; ') : ''}`);
      const at = x => txt.split('\n').findIndex((l, i, L) => L[i].split(' · ')[0] === x[0] && L[i - 1] === (x[1] ? 'Y' : 'N'));
      const no = m.need.filter(x => at(x) < 0);
      ck(!no.length, `${id} ${m.mach}: Y / N as the logic` + (no.length ? ', wrong: ' + no.map(x => x[0]).join('; ') : ''));
      await page.evaluate(() => window.LS_FPOP && LS_FPOP.close && LS_FPOP.close());
      await page.waitForTimeout(200);
    }
  }
  await openHx(page, 'HX-furnace-gas');
  await page.waitForTimeout(1200);
  const b = await page.evaluate(() => {
    const t = [...document.querySelectorAll('.hx-process text')].find(e => e.textContent.trim() === 'Precipitator'),
      g = t.closest('[data-go]') || t;
    const r = g.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  await page.mouse.click(b.x, b.y);
  await page.waitForTimeout(1000);
  ck(await page.evaluate(() => [...document.querySelectorAll('.hx-process text')].some(e => e.getClientRects().length && /^Plate rapper/.test(e.textContent))), 'furnace-gas: a click on the precipitator opens its page');
  ck(!errs.length, 'no page error ' + errs.slice(0, 3).join(' | '));
  if (process.env.SHOT) await page.screenshot({ path: process.env.SHOT });
  await browser.close();
  console.log(fail ? fail + ' FAIL' : 'ALL PASS');
  process.exit(fail ? 1 : 0);
})();
