/* Phase 6 slice 4 (2026-11-26): the inlet valve XV-BH1060-x of each bottom ash screw cooler goes to the end of its last command and stays
   there (engine boiler.js anBaStep U.ba.gi; field rows ZSO / ZSC-BH1060-x, src/world/field/boiler.js). Phase 11 2026-11-28 (user rule
   5:18 AM PHT: no plant screen as a premise; the 150 MW start runs the coolers by their logic, DITL-21B ~ 21E line-up): at 150 MW each
   inlet valve stands as its cooler does (open = the cooler the duty rotation runs, closed = the idle ones), and the inlet gate of an
   idle cooler (the test takes the first idle one, after the duty rotation is at rest) is in INLET GATE AUTO SELECT (DITL-117 #C input row 5 M.2222 = the FF of rows 0 ~ 3): the sequence owns it, and the OPEN
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
    K = ['A', 'B', 'C', 'D'],
    runs = () => K.map(x => (E.AN.ditlRun(x === 'A' ? 'DITL-21A' : 'DITL-21A #' + x) ? 1 : 0)),
    g = () => JSON.stringify(U.ba.gi),
    steady = () => runs().every((r, i) => U.ba.gi[K[i]] === r);
  /* PR 749 (2026-11-28): the start can be mid duty rotation (one cooler starting or stopping, its valve not yet at the end of its
     sequence). Step the plant until every inlet valve stands as its cooler runs (the sequence at rest), at most 10 plant min */
  for (let i = 0; i < 1200 && !steady(); i++) E.step(1);
  const run = runs(),
    gi0 = { ...U.ba.gi };
  ok(steady(), '150 MW: each inlet valve as its cooler runs (sequence at rest within 10 min) ' + g() + ' run ' + run.join(''));
  /* the cooler under test: the first idle one (not running, inlet valve closed), whichever the duty rotation left idle */
  const X = K.find((x, i) => !run[i] && gi0[x] === 0);
  ok(!!X, '150 MW: an idle cooler with its inlet valve closed ' + g() + ' run ' + run.join(''));
  if (!X) {
    console.log('FAIL ash cooler inlet valves: problems ' + bad.length);
    for (const b of bad) console.log('  ' + b);
    process.exit(1);
  }
  const N = X === 'A' ? 'DITL-117' : 'DITL-117 #' + X,
    s = E.DITL.S.sheets.concat(W.inst || []).find(x => x.name.replace(/^\(\d+\)/, '') === N),
    cmd = r => (W.out[s.name] && W.out[s.name].has(r) ? 1 : 0),
    others = K.filter(x => x !== X);
  const D = E.ctx.DUI,
    rv = r => +D.rowVal(s, r);
  ok(rv(5) === 1, '150 MW: inlet gate ' + X + ' in AUTO SELECT (row 5 M.2222), the sequence owns it');
  /* the MANUAL SELECT P.B.: a fresh press (its row released first, so the press is an edge even if the start holds the row) */
  W.dset(N, 2, false);
  E.step(2);
  W.dpress(N, 2);
  E.step(6);
  ok(rv(5) === 0, 'MANUAL SELECT P.B.: inlet gate ' + X + ' in MANUAL (row 5 M.2222 off)');
  W.dpress(N, 4);
  let seen = 0;
  for (let i = 0; i < 4; i++) E.step(1), (seen |= cmd(7));
  ok(seen === 1, 'OPEN P.B.: OPEN COMMAND row 7 given');
  E.step(10);
  ok(cmd(7) === 0 && U.ba.gi[X] === 1, 'after the 2 s pulse: valve ' + X + ' stays open ' + g());
  ok(others.every(x => U.ba.gi[x] === gi0[x]), 'the other valves do not move ' + g());
  W.dpress(N, 11);
  seen = 0;
  for (let i = 0; i < 4; i++) E.step(1), (seen |= cmd(12));
  E.step(10);
  ok(seen === 1 && U.ba.gi[X] === 0, 'CLOSE P.B.: CLOSE COMMAND row 12, valve ' + X + ' closed ' + g());
  console.log((bad.length ? 'FAIL' : 'PASS') + ' ash cooler inlet valves: problems ' + bad.length);
  for (const b of bad) console.log('  ' + b);
  process.exit(bad.length ? 1 : 0);
})();
