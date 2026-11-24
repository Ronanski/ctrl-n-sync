// beta.486 (EIMI): the shared HX core gives a machine of an HX page its own monitor rows and VCB point (lanes 6 and 7: pump bearing,
// winding, vibration, VCB ON / OFF of the I/O list on the faceplate, not on the drawing), and an 'an:' key reads a dotted path of the
// unit model. The test gives the feedwater page's boiler feed pump A (HX.M 'BFWP-A') three monitor rows and a VCB key, as a page would
// (HX.M o.mon / o.vcb), starts at 150 MW like the operator (start screen, Operator card), opens the page and checks:
//  - the PERMISSIVE · TREND · MONITOR faceplate (the Y / N square) shows the rows: label, unit · tag, the value of HX.data.value with
//    its decimals, the word of an on / off row; the CONTROL faceplate does not show them (README section 4 rule 6)
//  - the VCB lamp of the CONTROL faceplate reads the VCB key (ON at 1, OFF at 0), not the motor state
//  - 'an:a.b.c' = AN.unit.a.b.c, 'an:x' = AN.unit.x (as before)
//  - no page error
// Usage: node tests/regress/hx_fp_mon.js [html]
const { open, startAs, openHx } = require('./lib.js');
const fs = require('fs');
const html = process.argv.find(a => /\.html$/.test(a)) || 'dist/' + fs.readdirSync('dist').find(x => /^logic-sim-v[\d.]+(?:-beta\.\d+)?\.html$/.test(x));
(async () => {
  const { browser, page, errs } = await open(html);
  let fail = 0;
  const ck = (ok, w) => (console.log((ok ? 'PASS ' : 'FAIL ') + w), ok || fail++);
  await page.setViewportSize({ width: 1920, height: 1080 });
  await startAs(page, '150 MW');
  /* a nested number of the unit model for the dotted key, and a top-level one */
  const K = await page.evaluate(() => {
    const u = AN.unit;
    let deep = null,
      top = null;
    for (const a in u) {
      const v = u[a];
      if (!top && typeof v === 'number' && isFinite(v) && Math.abs(v) > 1) top = a;
      if (!deep && v && typeof v === 'object' && !Array.isArray(v))
        for (const b in v) {
          const w = v[b];
          if (w && typeof w === 'object' && !Array.isArray(w))
            for (const c in w) if (typeof w[c] === 'number' && isFinite(w[c])) { deep = [a, b, c].join('.'); break; }
          if (deep) break;
        }
    }
    window.__vcb = { on: 1 };
    u.__tvcb = 0;
    return { deep, top };
  });
  ck(!!K.deep && !!K.top, 'unit model keys for the test: an:' + K.deep + ', an:' + K.top);
  await page.evaluate(K => {
    const d = HX.pages.find(p => p.id === 'feedwater');
    const all = d.plan ? d.plan.items : d.lanes.flatMap(L => L.items.flatMap(c => (Array.isArray(c) ? c : [c])));
    const it = all.find(x => x && x.k === 'mach' && x.mach === 'BFWP-A');
    it.mon = [HX.V('Test deep value', 'an:' + K.deep, 'deg C', 2), HX.V('Test top value', 'an:' + K.top, 'MW', 0), HX.V('Test heater', 'an:' + K.top, '', 0, { words: ['ON', 'OFF'] })];
    it.vcb = 'an:__tvcb';
  }, K);
  ck(await page.evaluate(K => {
    const a = HX.data.value('an:' + K.deep),
      b = K.deep.split('.').reduce((o, k) => o[k], AN.unit);
    return a === +b && HX.data.value('an:' + K.top) === +AN.unit[K.top] && HX.data.value('an:no.such.path') === null;
  }, K), "HX.data.value reads 'an:' dotted paths and top-level fields; a missing path is null");
  await openHx(page, 'HX-feedwater');
  const fp = id =>
    page.evaluate(id => {
      const p = document.getElementById(id);
      if (!p) return null;
      const rows = [...p.querySelectorAll('.fpo-row, .fpo-r, div')].filter(r => /^Test /.test((r.firstChild && r.firstChild.textContent) || ''));
      const lp = [...p.querySelectorAll('.fpo-lp')].find(e => /^VCB/.test(e.textContent) || (e.title || '').startsWith('VCB'));
      return { text: p.innerText, rows: rows.map(r => r.innerText.replace(/\s+/g, ' ')), vcb: lp ? lp.textContent + '|' + lp.className + '|' + lp.title : '' };
    }, id);
  /* the PERMISSIVE · TREND · MONITOR faceplate (second = the Y / N square) */
  await page.evaluate(() => HX.data.open('mach', 'BFWP-A', true));
  await page.waitForTimeout(1500);
  let F = await fp('fpop2');
  if (process.env.SHOT) await page.locator('#fpop2').screenshot({ path: process.env.SHOT });
  /* the rows are shown, not folded away under the FIELD block of the compact shell (shellc-compact.css) */
  const vis = await page.evaluate(() => [...document.getElementById('fpop2').querySelectorAll('.fpo-r')].filter(r => /^Test /.test(r.innerText || r.textContent)).map(r => getComputedStyle(r).display !== 'none' && r.getBoundingClientRect().height > 0));
  ck(vis.length === 3 && vis.every(Boolean), 'the three monitor rows are visible (' + vis.join(',') + ')');
  const want = await page.evaluate(K => [K.deep.split('.').reduce((o, k) => o[k], AN.unit), AN.unit[K.top]], K);
  ck(!!F && /Test deep value/.test(F.text) && /Test top value/.test(F.text) && /Test heater/.test(F.text), 'monitor faceplate shows the three rows');
  const line = t => (F.text.split('\n').find(x => x.startsWith(t)) || '') + ' ' + (F.text.split('\n')[F.text.split('\n').findIndex(x => x.startsWith(t)) + 1] || '');
  console.log('INFO ' + line('Test deep value') + ' / ' + line('Test top value') + ' / ' + line('Test heater'));
  ck(F && F.text.includes((+want[0]).toFixed(2)), 'deep value row with 2 decimals: ' + (+want[0]).toFixed(2));
  ck(F && F.text.includes(Math.round(+want[1]) + '') && /\bMW\b/.test(F.text), 'top value row with 0 decimals and its unit: ' + (+want[1]).toFixed(0) + ' MW');
  ck(F && /Test heater\s*\n?\s*(ON|OFF)/.test(F.text) && !/Test heater\s*\n?\s*\d/.test(F.text), 'on / off row shows a word (' + (+want[1] >= 0.5 ? 'ON' : 'OFF') + '), not a number');
  ck(F && /deg C/.test(F.text) && new RegExp('an:' + K.deep.replace(/\./g, '\\.')).test(F.text) === false, "unit shown; an 'an:' key is no I/O tag, so no tag is printed");
  await page.evaluate(() => window.LS_FPOP && LS_FPOP.close && LS_FPOP.close());
  await page.waitForTimeout(500);
  /* the CONTROL faceplate */
  await page.evaluate(() => HX.data.open('mach', 'BFWP-A', false));
  await page.waitForTimeout(1500);
  F = await fp('fpop');
  ck(!!F && !/Test deep value/.test(F.text), 'control faceplate has no monitor rows');
  ck(F && /OFF/.test(F.vcb) && /stop/.test(F.vcb) && /I\/O list/.test(F.vcb), 'VCB lamp reads its key (0 = OFF) though the pump runs: ' + (F && F.vcb.split('|')[0]));
  await page.evaluate(() => (AN.unit.__tvcb = 1));
  await page.waitForTimeout(1500);
  F = await fp('fpop');
  ck(F && /ON/.test(F.vcb) && /run/.test(F.vcb), 'VCB key 1 = ON: ' + (F && F.vcb.split('|')[0]));
  /* the TCS CRT hooks: '-----' and no press while the TCS program API is not there; with it, the lamp reads TCE.read(sheet, key)
     and a press holds the port 3000 ms (a stand-in for the API of lane 9, whose names are set in hx-app.js CRT) */
  const C0 = await page.evaluate(() => {
    const had = window.TCE;
    window.TCE = undefined;
    const r = [HX.data.hook('crtl:TCE114|LAMP-X'), HX.data.hook('crt:CRT:TCE114.PB-X')];
    HX.data.press('crt:CRT:TCE114.PB-X');
    window.TCE = had;
    return r;
  });
  ck(C0[0].text === '-----' && C0[1].text === '-----', 'CRT lamp and button show ----- while the TCS program is not running');
  const C1 = await page.evaluate(() => {
    const had = window.TCE,
      log = [];
    window.TCE = { read: (s, k) => (log.push(['read', s, k]), k === 'LAMP-ON' ? 1 : 0), press: (p, ms) => log.push(['press', p, ms]) };
    const r = [HX.data.hook('crtl:TCE114|LAMP-ON'), HX.data.hook('crtl:TCE114|LAMP-OFF')];
    HX.data.press('crt:CRT:TCE114.PB-X');
    window.TCE = had;
    return { r, log };
  });
  ck(C1.r[0].text === 'ON' && C1.r[0].tone === 'on' && C1.r[1].text === 'OFF', 'CRT lamp reads TCE.read(sheet, key): ' + C1.r.map(x => x.text).join(' / '));
  ck(C1.log.some(x => x[0] === 'press' && x[1] === 'CRT:TCE114.PB-X' && x[2] === 3000), 'CRT button press = TCE.press(port, 3000)');
  ck(errs.length === 0, 'no page error' + (errs.length ? ' (' + errs[0] + ')' : ''));
  await browser.close();
  console.log(fail ? fail + ' FAIL' : 'ALL PASS');
  process.exit(fail ? 1 : 0);
})();
