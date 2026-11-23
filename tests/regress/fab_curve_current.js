// beta.324 (JENNIE, user finding "FA blower A trips on low current when running with B"): the FA blower current comes from its own
// curve (boiler.js anFabKw / anFabI: Continental 500.04 curve K1AU3-D1-0-004 p.7, inlet damper = thinner inlet air, TECO 480 kW
// motor, anchored to 9.png 37.3 A at 26.3 T/H). Checks from the 150 MW start:
//  1. blower A alone near the snapshot 37.3 A;
//  2. A and B sharing the flow with equal dampers (about 13 T/H each): both run 120 s, both over the L.L. 24.6 A (DITL-28B row 12);
//  3. A damper low while B takes the flow (A under about 11 T/H): A is stopped by its CURRENT L.L., the Event log names it.
// Usage: node tests/regress/fab_curve_current.js [html]
const { open } = require('./lib.js');
const fs = require('fs');
const html =
  process.argv.find(a => /\.html$/.test(a)) ||
  'dist/' + fs.readdirSync('dist').find(x => /^logic-sim-v[\d.]+(?:-beta\.\d+)?\.html$/.test(x));
(async () => {
  const { browser, page, errs } = await open(html);
  let fail = 0;
  const ck = (ok, w) => {
    console.log((ok ? 'PASS ' : 'FAIL ') + w);
    if (!ok) fail++;
  };
  await page.waitForFunction(() => window.AN && AN.sheets && AN.sheets.length >= 54 && window.WORLD && window.LS_OP && window.TOP, null, { timeout: 120000 });
  const r = await page.evaluate(async () => {
    await AN.ades();
    WORLD.set(true);
    document.getElementById('load150').click();
    await AN._startP;
    const C1 = AN.sheets.find(s => s.name === 'ABC-001C'),
      U = AN.unit,
      r1 = x => Math.round(x * 10) / 10,
      o = {};
    const run = async (sec, f) => {
      for (let i = 0; i < sec * 2; i++) {
        WORLD.live = true;
        AN.stepSet(C1, 0.5);
        WORLD.tick(0.5);
        if (f) f();
        if (i % 20 === 0) await new Promise(r => setTimeout(r, 0));
      }
    };
    const st = () => ({ A: AN.ditlRun('DITL-28A'), B: AN.ditlRun('DITL-28A #B'), ia: r1(U.fnIa), ib: r1(U.fnIb), fa: r1(U.fnFaQ) });
    await run(30);
    o.one = st();
    /* B started by its logic: A's damper to 25 % (FA flow L.L. < 20 T/H) with B AUTO */
    TOP.man('FICFA1055A', 25);
    await run(15);
    LS_OP.dsel('DITL-28A #B', 1, 1, 'FAB B AUTO');
    await run(5);
    TOP.man('FICFA1055A', 21.4);
    TOP.man('FICFA1055B', 21.4);
    await run(20);
    o.drop = 0;
    o.min = [1e9, 1e9];
    await run(120, () => {
      if (AN.ditlRun('DITL-28A') !== 1 || AN.ditlRun('DITL-28A #B') !== 1) o.drop++;
      o.min = [Math.min(o.min[0], U.fnIa), Math.min(o.min[1], U.fnIb)];
    });
    o.min = o.min.map(r1);
    o.two = st();
    const n0 = lsEvents.length;
    TOP.man('FICFA1055A', 15);
    TOP.man('FICFA1055B', 27.8);
    await run(60);
    o.low = st();
    o.ev = lsEvents.slice(0, lsEvents.length - n0).map(e => e.text).filter(x => /blower A/i.test(x));
    return o;
  });
  console.log(JSON.stringify(r));
  ck(r.one.A === 1 && r.one.B === 0 && Math.abs(r.one.ia - 37.3) < 1.5, 'A alone ' + r.one.ia + ' A at ' + r.one.fa + ' T/H (9.png 37.3 A at 26.3)');
  ck(r.drop === 0 && r.min[0] > 24.6 && r.min[1] > 24.6, 'A and B sharing ' + r.two.fa + ' T/H run 120 s, lowest ' + r.min.join(' / ') + ' A > L.L. 24.6 A');
  ck(r.low.A === 0 && r.low.B === 1 && r.ev.some(x => /CURRENT L\.L\./.test(x)), 'A at a low damper share stopped by its CURRENT L.L.: ' + JSON.stringify(r.ev));
  ck(errs.length === 0, 'no page error' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
  console.log(fail ? fail + ' FAIL' : 'ALL PASS');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
