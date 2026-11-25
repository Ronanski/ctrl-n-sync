/* Phase 6 slice 4 (2026-11-26): the inlet valve XV-BH1060-x of each bottom ash screw cooler goes to the end of its last command and stays
   there (engine boiler.js anBaStep U.ba.gi; field rows ZSO / ZSC-BH1060-x, src/world/field/boiler.js). At 150 MW all four are closed
   (the coolers stand stopped, HMI snapshot 16.PNG). On DITL-117 #C the CRT OPEN P.B. (row 4) gives the 2 s OPEN COMMAND (output row 7,
   O.0618), the valve opens and stays open after the pulse; the CLOSE P.B. (row 11) gives the CLOSE COMMAND (row 12, O.0619) and it
   closes. The other three valves do not move. Headless world, no browser. */
const { load } = require('../../../tools/trace/world.cjs');
const bad = [];
const ok = (c, m) => c || bad.push(m);
(async () => {
  const E = load();
  await new Promise(r => setTimeout(r, 300));
  await E.start('150');
  E.step(4);
  const W = E.WORLD,
    U = E.AN.unit,
    s = E.DITL.S.sheets.concat(W.inst || []).find(x => x.name.endsWith('DITL-117 #C')),
    cmd = r => (W.out[s.name] && W.out[s.name].has(r) ? 1 : 0),
    g = () => JSON.stringify(U.ba.gi);
  ok(g() === '{"A":0,"B":0,"C":0,"D":0}', '150 MW: all four inlet valves closed ' + g());
  W.dpress('DITL-117 #C', 4);
  let seen = 0;
  for (let i = 0; i < 4; i++) E.step(1), (seen |= cmd(7));
  ok(seen === 1, 'OPEN P.B.: OPEN COMMAND row 7 given');
  E.step(10);
  ok(cmd(7) === 0 && U.ba.gi.C === 1, 'after the 2 s pulse: valve C stays open ' + g());
  ok(U.ba.gi.A === 0 && U.ba.gi.B === 0 && U.ba.gi.D === 0, 'the other valves stay closed ' + g());
  W.dpress('DITL-117 #C', 11);
  seen = 0;
  for (let i = 0; i < 4; i++) E.step(1), (seen |= cmd(12));
  E.step(10);
  ok(seen === 1 && U.ba.gi.C === 0, 'CLOSE P.B.: CLOSE COMMAND row 12, valve C closed ' + g());
  console.log((bad.length ? 'FAIL' : 'PASS') + ' ash cooler inlet valves: problems ' + bad.length);
  for (const b of bad) console.log('  ' + b);
  process.exit(bad.length ? 1 : 0);
})();
