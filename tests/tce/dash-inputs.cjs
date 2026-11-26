/* Phase 6 TCS (lane 1, 2026-11-26): the "(-)" inputs given a source from the documents (engine/tcs-tpc.js TCS_CON; lane 0 search
   phase6-tcs-dash-inputs-docs-2026-11-26.md). TCA782 Z1 ~ Z3 = the shaft speed; TCE100 PLU / EOS (1) ~ (3) = the PI/O inputs TCA906-29 ~ 31 /
   -26 ~ 28 of the program, each on its own port (they were six signals on one port CON:TCE100.-). Usage: node tests/tce/dash-inputs.cjs */
const path = require('path');
const { load } = require(path.join(__dirname, '../../tools/trace/world.cjs'));
(async () => {
  let bad = 0;
  const ok = (c, m) => (c || bad++, console.log((c ? 'PASS ' : 'FAIL ') + m));
  const E = load();
  await E.start('150');
  E.step(10);
  const AN = E.AN,
    p = AN.tce(),
    v = n => p.v[p.idx.get(n)],
    rpm = AN.unit.tb.rpm;
  ok(!p.idx.has('CON:TCE100.-'), 'TCE100: no shared port CON:TCE100.- any more');
  for (const z of ['Z1', 'Z2', 'Z3']) ok(Math.abs(v('CON:TCA782.' + z) - rpm) < 5 && rpm > 2900, 'TCA782 ' + z + ' EOS TURBINE SPEED = shaft ' + v('CON:TCA782.' + z));
  const PIO = { 'PLU(1)': 29, 'PLU(2)': 30, 'PLU(3)': 31, 'EOS(1)': 26, 'EOS(2)': 27, 'EOS(3)': 28 };
  for (const k in PIO) {
    const n = 'CON:TCE100.-' + k + ' OPERATED';
    ok(p.idx.has(n) && v(n) === v('PIO:TCA906-' + PIO[k]), 'TCE100 ' + k + ' OPERATED = TCA906-' + PIO[k] + ' (' + v(n) + ')');
  }
  /* the PLU of the model reaches PLU(1) ~ (3) and not EOS */
  AN.unit.el.l52 = false; /* 52L1 opened on load: the house load at once (unit.js PLU) */
  let seen = 0;
  for (let i = 0; i < 4 && !seen; i++) {
    E.step(1);
    seen = AN.unit.tb.plu ? 1 : 0;
  }
  ok(seen, 'the model makes a PLU on the load drop');
  E.step(1); /* the TCS reads it the next step */
  ok(['PLU(1)', 'PLU(2)', 'PLU(3)'].every(k => v('CON:TCE100.-' + k + ' OPERATED') === 1), 'PLU of the model: PLU(1) ~ (3) OPERATED = 1');
  ok(['EOS(1)', 'EOS(2)', 'EOS(3)'].every(k => v('CON:TCE100.-' + k + ' OPERATED') === 0), 'EOS(1) ~ (3) stay 0');
  process.exit(bad ? 1 : 0);
})();
