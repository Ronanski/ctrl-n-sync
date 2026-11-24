// beta.506 (EIMI, asked by MINAMI for the Industrial and waste water page): three things of the shared HX core.
//  1. a machine or valve of a system file that hx-registry.js does not have yet joins the registry at load: the faceplate of
//     P-0715A / B (DITL-111 and its instance #B), P-0058A / B (DITL-120 and #B), MV-IW0391 (DITL-87) and MV-AS1397 (DITL-116) opens with
//     its own commands, and a command moves its own drawing (A never moves B)
//  2. a node with on:'h:<hook>' is grey (hx-none) while the hook has no value, green (hx-stop) when it says stopped, red (hx-run) on
//  3. a vessel with no level key is grey and full, never a level that looks measured; a vessel with a value is not grey
//  - no page error
// Usage: node tests/regress/hx_unknown.js [html]   (SHOT=<dir> saves pictures)
const { open, startAs, pressRun, openHx } = require('./lib.js');
const fs = require('fs'),
  path = require('path');
const html = process.argv.find(a => /\.html$/.test(a)) || 'dist/' + fs.readdirSync('dist').find(x => /^logic-sim-v[\d.]+(?:-beta\.\d+)?\.html$/.test(x));
(async () => {
  const { browser, page, errs } = await open(html);
  let fail = 0;
  const ck = (ok, w) => (console.log((ok ? 'PASS ' : 'FAIL ') + w), ok || fail++);
  const shot = async n => process.env.SHOT && (await page.screenshot({ path: path.join(process.env.SHOT, n + '.png') }));
  await page.setViewportSize({ width: 1920, height: 1080 });
  await startAs(page, '150 MW');
  const REG = await page.evaluate(() => ['P-0715A', 'P-0715B', 'P-0058A', 'P-0058B', 'MV-IW0391', 'MV-AS1397'].map(n => [n, (HXREG.machines[n] || {}).bind]));
  for (const [n, b] of REG) ck(!!b && !!(b.ad || b.mov), n + ' is in the registry: ' + JSON.stringify(b));
  const bad = await page.evaluate(() => ['DITL-87', 'DITL-111', 'DITL-111 #B', 'DITL-116', 'DITL-120', 'DITL-120 #B'].filter(s => !LS_OP.dOf(s)));
  ck(!bad.length, 'every sheet of these machines is in the app' + (bad.length ? ': ' + bad : ''));
  await openHx(page, 'HX-industrial-water');
  /* 2: the six states of a node, on the classes of the page itself */
  const on = await page.evaluate(async () => {
    const svg = document.querySelector('.hx-node[data-on]').ownerSVGElement;
    const pick = [...document.querySelectorAll('.hx-node[data-on]')].find(e => /^h:/.test(e.dataset.on));
    const k = pick.dataset.on.slice(2).split(/[|&]/)[0],
      h0 = HX.HK[k],
      d0 = HX.data.hook;
    const out = { spec: pick.dataset.on };
    const cls = () => (/hx-run/.test(pick.getAttribute('class')) ? 'run' : /hx-stop/.test(pick.getAttribute('class')) ? 'stop' : /hx-none/.test(pick.getAttribute('class')) ? 'none' : '?');
    const st = async r => ((HX.data.hook = (h, l) => (l === k ? r : d0.call(HX.data, h, l))), await new Promise(f => setTimeout(f, 2500)), cls());
    out.none = await st({ text: '-----', tone: '' });
    out.stop = await st({ text: 'STOPPED', tone: 'stop' });
    out.run = await st({ text: 'RUNNING', tone: 'run' });
    HX.data.hook = d0;
    return out;
  });
  ck(on.none === 'none', 'unknown hook: grey (' + on.none + '), ' + on.spec);
  ck(on.stop === 'stop', 'hook says stopped: green (' + on.stop + ')');
  ck(on.run === 'run', 'hook says running: red (' + on.run + ')');
  /* 3 */
  const lv = await page.evaluate(() =>
    [...document.querySelectorAll('#plantws [data-lv]')].map(r => {
      const [a, b] = r.dataset.lv.split(',').map(Number),
        k = r.closest('[data-level]');
      return { k: k ? k.dataset.level.split('|')[0] : '', na: r.classList.contains('hx-lvna'), h: +r.getAttribute('height'), full: b - a, fill: getComputedStyle(r).fill, o: getComputedStyle(r).opacity };
    })
  );
  const no = lv.filter(x => !x.k);
  ck(lv.length > 0 && no.length > 0, 'vessels on the page: ' + lv.length + ', without a level key: ' + no.length);
  ck(no.every(x => x.na && Math.abs(x.h - x.full) < 1 && +x.o < 0.5), 'a vessel without a level key is grey and full, faint');
  await shot('iw');
  await openHx(page, 'HX-makeup-cooling');
  const l2 = await page.evaluate(() =>
    [...document.querySelectorAll('#plantws [data-level] [data-lv]')].map(r => ({ k: r.closest('[data-level]').dataset.level, na: r.classList.contains('hx-lvna'), v: HX.data.value(r.closest('[data-level]').dataset.level.split('|')[0]) }))
  );
  ck(l2.length > 0 && l2.every(x => x.na === (x.v == null)), 'a vessel with a level value is not grey: ' + JSON.stringify(l2.slice(0, 3)));
  /* 1: the faceplates, pressed as the operator does: the items of the two pages become machines / valves, as a page writes them
     (HX.M / HX.X); the page is the one page the click goes to */
  await page.evaluate(() => {
    const items = d => (d.plan ? d.plan.items : d.lanes.flatMap(L => L.items.flatMap(c => (Array.isArray(c) ? c : [c]))));
    const iw = items(HX.pages.find(p => p.id === 'industrial-water'));
    for (const it of iw) {
      if (it && /^P-(0715|0058)[AB]$/.test(it.tag)) Object.assign(it, { k: 'mach', mach: it.tag, on: undefined });
      if (it && it.tag === 'MV-IW0391') Object.assign(it, { k: 'valve', kind: 'motor', valve: it.tag, on: undefined });
    }
    const as = items(HX.pages.find(p => p.id === 'aux-steam')),
      x = as.find(i => i && i.k === 'valve' && i.valve === 'MV-AS1392');
    x.valve = 'MV-AS1397';
  });
  await pressRun(page);
  const box = () => page.locator('#fpop');
  const act = async (kind, n, label) => {
    await page.evaluate(([k, n]) => HX.data.open(k, n, false), [kind, n]);
    await page.waitForTimeout(1200);
    const txt = async () => (await box().innerText().catch(() => '(no faceplate)')).replace(/\s+/g, ' ').slice(0, 400);
    const b = box().locator('button', { hasText: new RegExp('^\s*' + label + '\s*$') }).first();
    if (!(await b.count())) return { ok: false, why: 'no ' + label + ' button: ' + (await txt()) };
    await shot('fp-' + n);
    if (!(await b.isEnabled())) return { ok: false, off: true, why: label + ' disabled: ' + (await txt()) };
    await b.click();
    await page.waitForTimeout(400);
    const ex = box().locator('button', { hasText: /EXECUTE/ }).first();
    if (await ex.count()) await ex.click();
    await page.waitForTimeout(5000);
    return { ok: true, why: await txt() };
  };
  const PUMPS = ['P-0715A', 'P-0715B', 'P-0058A', 'P-0058B'];
  const st = () => page.evaluate(P => P.map(n => LS_OP.mst(HXREG.machines[n].bind.ad)), PUMPS);
  await openHx(page, 'HX-industrial-water');
  for (const n of PUMPS) {
    const i = PUMPS.indexOf(n),
      a = await st(),
      r = await act('mach', n, 'START'),
      z = await st();
    if (/0058/.test(n)) {
      ck(r.off && /no DCS START or STOP button/.test(r.why), n + ': START closed, the faceplate says DITL-120 has no DCS button: ' + r.why);
      continue;
    }
    ck(r.ok, n + ': faceplate with START opens and takes the press' + (r.ok ? '' : ': ' + r.why));
    if (r.ok) ck(z.every((v, k) => (k === i ? v === 'RUN' : v === a[k])), n + ' START: ' + a + ' -> ' + z + ' (only its own drawing)');
  }
  const mv = async n => page.evaluate(n => HX.data.valve(n), n);
  for (const [pg, n] of [['HX-industrial-water', 'MV-IW0391'], ['HX-aux-steam', 'MV-AS1397']]) {
    await openHx(page, pg);
    const a = JSON.stringify(await mv(n)),
      r = await act('valve', n, 'OPEN');
    ck(r.ok, n + ': faceplate with OPEN opens and takes the press' + (r.ok ? '' : ': ' + r.why));
    const z = await mv(n);
    ck(z && z.pct > JSON.parse(a).pct, n + ' OPEN: position ' + JSON.parse(a).pct + ' % -> ' + (z && z.pct) + ' %');
  }
  ck(errs.length === 0, 'no page error' + (errs.length ? ' (' + errs[0] + ')' : ''));
  await browser.close();
  console.log(fail ? fail + ' FAIL' : 'ALL PASS');
  process.exit(fail ? 1 : 0);
})();
