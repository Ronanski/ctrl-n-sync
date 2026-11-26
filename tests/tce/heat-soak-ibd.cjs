/* Phase 6 TCS (lane 1, 2026-11-26): IBD TC-17 net 5 HP TURBINE HEAT SOAK EXECUTE reads TCE163 output A1 HEAT SOAK SET (the SELECT of the HEAT
   SOAK SELECT macro, LME133 inside of the HIACS backup), the same net as HEAT SOAK MODE (C) and the CRT lamp TCE163_1 (engine/tcs-trip.js
   TCS_IBD_NET, INFERRED: the PI/O card is not decoded). At 150 MW no heat soak runs: 0; the bound value follows the program net.
   Usage: node tests/tce/heat-soak-ibd.cjs */
const path = require('path');
const { load } = require(path.join(__dirname, '../../tools/trace/world.cjs'));
(async () => {
  let bad = 0;
  const ok = (c, m) => (c || bad++, console.log((c ? 'PASS ' : 'FAIL ') + m));
  const E = load();
  await E.start('150');
  E.step(20);
  const AN = E.AN,
    p = AN.tce(),
    o = E.ctx.TCE_RUN.outs(p).find(q => q.sheet === 'TCE163' && q.key === 'oA1'),
    ibd = () => (AN.tcsIbd('TC-17') || { v: [] }).v[5];
  ok(!!o, 'TCE163 A1 HEAT SOAK SET is an output of the program');
  ok(ibd() === 0 && p.v[o.slot] === 0, 'at 150 MW no heat soak: TCE163 A1 = ' + p.v[o.slot] + ', IBD TC-17 net 5 = ' + ibd());
  ok(E.ctx.TCE_RUN.read(p, 'TCE163', 'TCE163_1') === p.v[o.slot], 'A1 is the net of the CRT lamp HEAT SOAK MODE TCE163_1');
  /* the bound source: the engine text (a value 0 = 0 above could also be an unbound net) */
  const src = require('fs').readFileSync(path.join(__dirname, '../../src/analog/engine/tcs-trip.js'), 'utf8');
  ok(/'TC-17': \{\s*(\/\*[\s\S]*?\*\/\s*)?5: U => \(tcsTceOut\(U, 'TCE163', 'oA1'\)/.test(src), 'TC-17 net 5 reads tcsTceOut TCE163 oA1');
  process.exit(bad ? 1 : 0);
})();
