/* Lane 5 (2026-11-25): the alarm list rows raise an alarm line only for a point with a REGISTERED SOURCE (src/analog/engine/alarm-pri.js
   AN.laneAlm, called by the alarm scan; src/world/field/README.md "one signal, one source"). Node engine, the real ABC sheets:
     1. PT-MS1002 (STN101 AI0131) at 141, over its list HIGH-HIGH 134, but no source (no field row, no model write): no line;
     2. the same with the model write mark on its AI state (s.src): one line, HIGH-HIGH (not HIGH too);
     3. a 150 MW snapshot seed (s.snap) is not a source: PT-DO1043-A2 (AI0293) at 0 under its LOW 0.8 stays silent;
     4. a field row for "1|AI0293" (AN.fieldRead) makes it a source: one LOW line;
     5. the same level already in the scan with the tag in its name (the drawing's comparator alarm "PIMS1002 ... (PT-MS1002 ...)"):
        no second line;
     6. a switch row (LSLL-CH1103, STN101 I.0133): a line while its plant-switched DITL row is 1 (WORLD.plantSw), none at 0 or when the
        row has no plant source;
     7. a switch whose made state is the normal one (PS-LO1115-B2 "> 2.0 kg/cm2", on while the oil pressure is established; row on: 0):
        a line when it is off, none when it is on;
     8. a row on the plant's own DITL alarm output (SS-BH1060-B: DITL-21A #B "SPEED LOW", CRT ANN): a line while the output is 1, none at
        0; the bare speed switch is not read (a stopped cooler gives no line). */
const { loadEngine } = require('../../../tools/engine/node-engine.js');
const { laneData } = require('../../../tools/build/engine-bundle.js');
(async () => {
  const { AN, win } = await loadEngine();
  new Function('window', laneData())(win);
  for (const sh of AN.sheets) if (/^ABC-00(1C|3A)$/.test(sh.name)) AN.ensure(sh);
  const blk = (shn, ai) => {
    const sh = AN.sheets.find(s => s.name === shn),
      S = sh && sh.S,
      b = S && S.blk.find(z => z.k === 'AI' && z.o && z.o.length && String(AN.nm(S, z.o[0]) || '').replace(/^S\d\s*/, '').trim() === ai);
    return b ? { S, n: b.o[0], st: S.rt.st[b.id] || (S.rt.st[b.id] = {}) } : null;
  };
  const ms = blk('ABC-001C', 'AI0131'),
    oil = blk('ABC-003A', 'AI0293');
  const bad = [];
  const fr0 = AN.fieldRead;
  let fld = {},
    sw = [];
  AN.fieldRead = k => (k in fld ? fld[k] : null);
  win.WORLD = { plantSw: () => sw };
  /* only the points under test: other points of the loaded plant have their own sources (model writes, field rows) and may stand in alarm */
  const OWN = /^L\|(PT-MS1002|PT-DO1043-A2|LSLL-CH1103|PS-LO1115-B2|SS-BH1060-B)\|/;
  const run = now => AN.laneAlm(now || new Map()).map(x => x[0]).filter(k => OWN.test(k));
  if (!ms || !oil) bad.push('AI0131 / AI0293 not found on ABC-001C / ABC-003A');
  else {
    ms.S.rt.v[ms.n] = 141;
    oil.S.rt.v[oil.n] = 0;
    delete ms.st.src;
    delete oil.st.src;
    let r = run();
    if (r.length) bad.push('1. no source: ' + r.join(', '));
    ms.st.src = 1;
    r = run();
    if (r.join() !== 'L|PT-MS1002|HIGH-HIGH') bad.push('2. model source: ' + (r.join(', ') || 'no line'));
    oil.st.snap = 1;
    r = run().filter(k => /PT-DO1043-A2/.test(k));
    if (r.length) bad.push('3. snapshot seed: ' + r.join(', '));
    fld = { '1|AI0293': 0 };
    r = run().filter(k => /PT-DO1043-A2/.test(k));
    if (r.join() !== 'L|PT-DO1043-A2|LOW') bad.push('4. field row: ' + (r.join(', ') || 'no line'));
    fld = {};
    r = run(new Map([['X|PIMS1002', { nm: 'PIMS1002 main steam pressure (PT-MS1002, finishing superheater outlet header)', lv: 'HIGH-HIGH' }]]));
    if (r.length) bad.push('5. second line: ' + r.join(', '));
    delete ms.st.src;
  }
  sw = [{ sheet: 'x', row: 1, tag: 'LSLL-CH1103', on: true }];
  let r = run();
  if (r.join() !== 'L|LSLL-CH1103|LOW-LOW') bad.push('6. switch at 1: ' + (r.join(', ') || 'no line'));
  sw = [{ sheet: 'x', row: 1, tag: 'LSLL-CH1103', on: false }];
  if (run().length) bad.push('6. switch at 0: ' + run().join(', '));
  sw = [];
  if (run().length) bad.push('6. switch without source: ' + run().join(', '));
  sw = [{ sheet: 'x', row: 2, tag: 'PS-LO1115-B2', on: false }];
  r = run();
  if (r.join() !== 'L|PS-LO1115-B2|ALARM') bad.push('7. normal-made switch off: ' + (r.join(', ') || 'no line'));
  sw = [{ sheet: 'x', row: 2, tag: 'PS-LO1115-B2', on: true }];
  if (run().length) bad.push('7. normal-made switch on: ' + run().join(', '));
  /* 8: the DITL world of the page, reduced to the one drawing (the engine reads S.sheets / WORLD.inst / DUI) */
  /* S is the DITL script's own lexical S inside the engine context, DUI is on its window: both are set there */
  const vm = require('vm'),
    keepS = vm.runInContext('S', win),
    keepD = win.DUI;
  let out = 0;
  vm.runInContext('S = { sheets: [] }', win);
  win.WORLD.inst = [{ name: '(35)DITL-21A #B' }];
  win.DUI = { outs: () => [{ row: 18, name: 'Output row 19 · BOTTOM ASH SCREW COOLER B STOPPED' }, { row: 21, name: 'Output row 22 · BOTTOM ASH SCREW COOLER B SPEED LOW' }], outVal: (s, row) => (row === 21 ? out : 0) };
  sw = [{ sheet: 'x', row: 20, tag: 'SS-BH1060-B', on: false }];
  r = run();
  if (r.length) bad.push('8. output 0 (switch off): ' + r.join(', '));
  out = 1;
  r = run();
  if (r.join() !== 'L|SS-BH1060-B|ALARM') bad.push('8. output 1: ' + (r.join(', ') || 'no line'));
  win.__keepS = keepS;
  vm.runInContext('S = __keepS; delete window.__keepS', win);
  win.DUI = keepD;
  sw = [];
  AN.fieldRead = fr0;
  console.log('alarm rows from a registered source: ' + (bad.length ? 'FAIL ' + bad.join(' | ') : 'ok'));
  process.exit(bad.length ? 1 : 0);
})().catch(e => {
  console.log('FAIL ' + e.message);
  process.exit(1);
});
