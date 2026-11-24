/* Lane 5 (2026-11-25): the alarm list rows raise an alarm line only from a LIVE transmitter value (src/analog/engine/alarm-pri.js
   AN.laneAlm, called by the alarm scan). Node engine, the real ABC sheets:
     1. paused plant (time stands): no line, whatever the value;
     2. time runs and PT-MS1002 (STN101 AI0131) moves over its list HIGH-HIGH 134: one line, HIGH-HIGH (not HIGH too);
     3. a point nothing writes (its value stands while time runs, e.g. PT-DO1043-A2 at 0 under its LOW 0.8): no line;
     4. the same level already in the scan with the tag in its name (the drawing's comparator alarm "PIMS1002 ... (PT-MS1002 ...)"):
        no second line. */
const { loadEngine } = require('../../../tools/engine/node-engine.js');
const { laneData } = require('../../../tools/build/engine-bundle.js');
(async () => {
  const { AN, win } = await loadEngine();
  new Function('window', laneData())(win);
  for (const sh of AN.sheets) if (/^ABC-00(1C|3A)$/.test(sh.name)) AN.ensure(sh);
  const net = (shn, ai) => {
    const sh = AN.sheets.find(s => s.name === shn),
      S = sh && sh.S,
      b = S && S.blk.find(z => z.k === 'AI' && z.o && z.o.length && String(AN.nm(S, z.o[0]) || '').replace(/^S\d\s*/, '').trim() === ai);
    return b ? [S, b.o[0]] : null;
  };
  const ms = net('ABC-001C', 'AI0131'),
    oil = net('ABC-003A', 'AI0293');
  const bad = [];
  if (!ms || !oil) bad.push('AI0131 / AI0293 not found on ABC-001C / ABC-003A');
  else {
    AN.startState = 'lane5-test';
    ms[0].rt.v[ms[1]] = 122;
    oil[0].rt.v[oil[1]] = 0;
    const run = (t, now) => AN.laneAlm(now || new Map(), t).map(x => x[0]);
    let r = run(0);
    ms[0].rt.v[ms[1]] = 140;
    r = r.concat(run(0));
    if (r.length) bad.push('1. paused: ' + r.join(', '));
    ms[0].rt.v[ms[1]] = 141;
    r = run(5);
    if (r.join() !== 'L|PT-MS1002|HIGH-HIGH') bad.push('2/3. running: ' + (r.join(', ') || 'no line'));
    r = run(10, new Map([['X|PIMS1002', { nm: 'PIMS1002 main steam pressure (PT-MS1002, finishing superheater outlet header)', lv: 'HIGH-HIGH' }]]));
    if (r.length) bad.push('4. second line: ' + r.join(', '));
  }
  console.log('alarm rows live: ' + (bad.length ? 'FAIL ' + bad.join(' | ') : 'ok'));
  process.exit(bad.length ? 1 : 0);
})().catch(e => {
  console.log('FAIL ' + e.message);
  process.exit(1);
});
