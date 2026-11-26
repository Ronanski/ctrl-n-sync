/* Phase 6 (lane 1, 2026-11-26): ABC-050 I.041E / I.041F TCS-DI1051-1 / -2 MSV(A) / (B) TEST (FROM TCS, OR B95 -> M.0705) = the TCS outputs
   TCE960-27 / 28 MSV/CV(A) / (B) SEQUENTIAL FULL CLOSE TEST EXECUTING (src/data/tcs-dcs.json). 0 in service; an MSV(A) partial test sets
   I.041E only. Headless world. Usage: node tests/tce/msv-test-dcs.cjs */
const { load } = require('../../tools/trace/world.cjs');
(async () => {
  let bad = 0;
  const ok = (c, m) => (c || bad++, console.log((c ? 'PASS ' : 'FAIL ') + m));
  const E = load();
  await E.start('150');
  E.step(3);
  const sh = E.AN.sheets.find(x => x.name === 'ABC-050'),
    v = t => {
      const n = sh.S.lab.findIndex(z => z && String(z.t).trim() === t);
      return n >= 0 ? +sh.S.rt.ext[n] : NaN;
    };
  ok(v('I.041E') === 0 && v('I.041F') === 0, 'in service: MSV(A) / (B) TEST = 0 / 0 (' + v('I.041E') + ' / ' + v('I.041F') + ')');
  const r = E.AN.turbine('vtest', { v: 'msvA', op: 'partial' });
  ok(r === '', 'MSV(A) partial test accepted (' + r + ')');
  E.step(2);
  ok(v('I.041E') === 1 && v('I.041F') === 0, 'MSV(A) test on: I.041E = 1, I.041F = 0 (' + v('I.041E') + ' / ' + v('I.041F') + ')');
  process.exit(bad ? 1 : 0);
})();
