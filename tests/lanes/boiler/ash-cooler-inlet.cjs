/* Phase 6 slice 4 (2026-11-26): the inlet valve XV-BH1060-x of each bottom ash screw cooler goes to the end of its last command and stays
   there (engine boiler.js anBaStep U.ba.gi; field rows ZSO / ZSC-BH1060-x, src/world/field/boiler.js). Phase 11 2026-11-28 (user rule
   5:18 AM PHT: no plant screen as a premise; the 150 MW start runs the coolers by their logic, DITL-21B ~ 21E line-up): at 150 MW each
   inlet valve stands as its cooler does (open = the cooler the duty rotation runs, closed = the idle ones), and the inlet gate of an
   idle cooler is in INLET GATE AUTO SELECT (DITL-117 #C input row 5 M.2222 = the FF of rows 0 ~ 3): the sequence owns it, and the OPEN
   P.B. is gated by MANUAL (AND of NOT M.2222 and the P.B. pulse, the drawing). The operator line-up the drawing allows first: the
   INLET GATE MANUAL SELECT P.B. (row 2, M.222F; its pulse resets the FF). Then, as before: the CRT OPEN P.B. (row 4) gives the 2 s OPEN
   COMMAND (output row 7, O.0618), the valve opens and stays open after the pulse; the CLOSE P.B. (row 11) gives the CLOSE COMMAND
   (row 12, O.0619) and it closes. The other three valves do not move. Headless world, no browser. */
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
  const run = ['A', 'B', 'C', 'D'].map(x => E.AN.ditlRun(x === 'A' ? 'DITL-21A' : 'DITL-21A #' + x)),
    gi0 = { ...U.ba.gi };
  ok(['A', 'B', 'C', 'D'].every((x, i) => gi0[x] === (run[i] ? 1 : 0)), '150 MW: each inlet valve as its cooler runs ' + g() + ' run ' + run.join(''));
  ok(!run[2] && gi0.C === 0, '150 MW: cooler C idle, its inlet valve closed ' + g());
  const D = E.ctx.DUI,
    rv = r => +D.rowVal(s, r);
  ok(rv(5) === 1, '150 MW: inlet gate C in AUTO SELECT (row 5 M.2222), the sequence owns it');
  /* the MANUAL SELECT P.B.: a fresh press (its row released first, so the press is an edge even if the start holds the row) */
  W.dset('DITL-117 #C', 2, false);
  E.step(2);
  W.dpress('DITL-117 #C', 2);
  E.step(6);
  ok(rv(5) === 0, 'MANUAL SELECT P.B.: inlet gate C in MANUAL (row 5 M.2222 off)');
  W.dpress('DITL-117 #C', 4);
  let seen = 0;
  for (let i = 0; i < 4; i++) E.step(1), (seen |= cmd(7));
  ok(seen === 1, 'OPEN P.B.: OPEN COMMAND row 7 given');
  E.step(10);
  ok(cmd(7) === 0 && U.ba.gi.C === 1, 'after the 2 s pulse: valve C stays open ' + g());
  ok(U.ba.gi.A === gi0.A && U.ba.gi.B === gi0.B && U.ba.gi.D === gi0.D, 'the other valves do not move ' + g());
  W.dpress('DITL-117 #C', 11);
  seen = 0;
  for (let i = 0; i < 4; i++) E.step(1), (seen |= cmd(12));
  E.step(10);
  ok(seen === 1 && U.ba.gi.C === 0, 'CLOSE P.B.: CLOSE COMMAND row 12, valve C closed ' + g());
  console.log((bad.length ? 'FAIL' : 'PASS') + ' ash cooler inlet valves: problems ' + bad.length);
  for (const b of bad) console.log('  ' + b);
  process.exit(bad.length ? 1 : 0);
})();
