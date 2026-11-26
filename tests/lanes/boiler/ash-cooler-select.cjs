/* Phase 6 DCS (2026-11-26): ABC-009A 4-leg switch B32 (out SI0199) "(1) IF A-ASH COOLER AUTO ( M.021A ) SELECT to a" ... "(4) IF
   D-ASH COOLER AUTO ( M.021D )"; memory list 101 M.021A "A-ASH SCREW COOLER CTRL AUTO ONLY (FIRST AUTO)", M.021B ~ D "... AUTO ONLY"
   (audit-fix ABC-009A-4, DERIVED: the speed control SICL1060A ~ D in AUTO, the first of A ~ D wins). From the 150 MW start (all four
   MANUAL, snapshot 16.PNG) the .MAN status of a cooler is forced to 0 (AUTO) and the leg is read after 2 s (ABC-009A scans at 1.0 s).
   With no cooler in AUTO the switch keeps its last leg. */
const W = require('../../../tools/trace/world.cjs');
let bad = 0;
const fail = m => (bad++, console.log('FAIL', m));
(async () => {
  const E = W.load();
  await E.start('150');
  const AN = E.AN,
    S = AN.sheets.find(s => s.name === 'ABC-009A').S,
    b = S.blk.find(x => x.id === 32);
  if (!b || !b.q4 || !b.q4.sig || !b.q4.sig.every(z => z && z.auto)) fail('ABC-009A B32 conditions are not the cooler AUTO signals');
  if (bad) process.exit(1);
  const leg = () => S.rt.st[32].pk;
  const auto = (x, on) => {
    for (const [S2, n] of AN.modeNetsBy('SICL1060' + x, ['MAN', 'MANUAL'], null)) on ? (S2.rt.force[n] = 0) : delete S2.rt.force[n];
  };
  E.step(10, 0.2);
  if (leg() !== 'A') fail('150 MW (all coolers MANUAL): leg ' + leg() + ', want A (the start leg)');
  for (const [set, want] of [['C', 'C'], ['BC', 'B'], ['ABC', 'A'], ['D', 'D'], ['', 'D']]) {
    for (const x of 'ABCD') auto(x, set.includes(x));
    E.step(10, 0.2);
    console.log('AUTO ' + (set || 'none') + ': leg ' + leg());
    if (leg() !== want) fail('coolers in AUTO ' + (set || 'none') + ': leg ' + leg() + ', want ' + want);
  }
  console.log(bad ? 'FAIL ash-cooler-select ' + bad : 'PASS ash-cooler-select: the first cooler in AUTO (A ~ D) picks the leg');
  process.exit(bad ? 1 : 0);
})();
