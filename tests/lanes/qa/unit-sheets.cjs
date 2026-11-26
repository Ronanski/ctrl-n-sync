/* Phase 6 (user 2026-11-26 "Alam mo nmn pala n dapat hiwalay na sheet eh!"): every unit of a shared drawing (burner A ~ D, BFWP A / B,
   lube oil, the sootblower lances N-1011 ~ N-1038, the DITL-38 MCV table, the unit sets of src/world/inst/*.json) is its OWN sheet of
   the logic viewer, live on its own. One logic source: the units are built from the one drawing, so the logic of every unit must be the
   logic of the drawing. This test fails when a unit differs from its drawing in anything but its addresses, its text and its live state:
   the blocks (type, pins, the wires in and out, set / reset, comparator kind and set point, timer kind and time), the input rows and the
   output rows. A unit of some rows only (inst JSON "rows": DITL-21D row 22, DITL-80M lances) holds only blocks of the drawing.
   It also counts the unit sheets the viewer lists (src/ui/shell/ditl.js unit list = WORLD.instOf). */
const W = require('../../../tools/trace/world.cjs');
let bad = 0;
const fail = m => (bad++, console.log('FAIL', m));
const pick = (o, ks) => {
  const r = {};
  for (const k of ks) if (o && o[k] !== undefined) r[k] = o[k];
  return r;
};
/* the logic of a block; geometry (box, pp), text and live state (st, q, done, ev, Q, A, Bn, rq) are not logic */
const GK = ['t', 'k', 'ins', 'out', 's', 'r', 'bar', 'spri', 'rt', 'cmp', 'eq', 'kind', 'sp', 'unit', 'N', 'ks', 'up', 'pin', 'cin', 'rev'];
const gsig = g =>
  JSON.stringify(
    Object.assign(pick(g, GK), {
      miss: (g.miss || []).length,
      tm: g.tm && typeof g.tm === 'object' ? [g.tm.kind, g.tm.lab, g.tm.nt && g.tm.nt.t, g.tm.ut && g.tm.ut.t] : g.tm
    })
  );
(async () => {
  const E = W.load();
  await E.start('150');
  const I = E.WORLD.instOf;
  if (!I || !I.size) {
    fail('no unit map (WORLD.instOf)');
    process.exit(1);
  }
  let fam = 0,
    units = 0,
    part = 0;
  for (const [s, L] of I) {
    if (L.length < 2) continue;
    fam++;
    if (L[0] !== s) fail(s.name + ': unit A is not the drawing itself');
    const A = s.nl.gates.map(gsig),
      As = new Set(A),
      src = JSON.stringify(s.nl.src),
      outs = JSON.stringify(s.nl.outs);
    const names = new Set();
    for (const x of L.slice(1)) {
      units++;
      if (names.has(x.name)) fail(x.name + ': two units with one name');
      names.add(x.name);
      if (!x.nl) {
        fail(x.name + ': no logic');
        continue;
      }
      if (x.cells !== s.cells || x.rows.length !== s.rows.length) fail(x.name + ': not drawn from ' + s.name);
      const B = x.nl.gates.map(gsig);
      if (x._inst && x._inst.only) {
        part++;
        const extra = B.filter(g => !As.has(g));
        if (extra.length) fail(x.name + ': ' + extra.length + ' block(s) not on the drawing, first ' + extra[0].slice(0, 160));
        continue;
      }
      if (B.length !== A.length) {
        fail(x.name + ': ' + B.length + ' blocks, the drawing ' + A.length);
        continue;
      }
      const i = A.findIndex((g, j) => g !== B[j]);
      if (i >= 0) fail(x.name + ' block ' + i + ' differs from the drawing:\n  drawing ' + A[i].slice(0, 200) + '\n  unit    ' + B[i].slice(0, 200));
      if (JSON.stringify(x.nl.src) !== src) fail(x.name + ': input rows differ from the drawing');
      if (JSON.stringify(x.nl.outs) !== outs) fail(x.name + ': output rows differ from the drawing');
    }
  }
  console.log('drawings with more than one unit ' + fam + ', unit sheets B ~ D / lances / valves ' + units + ' (' + part + ' of some rows only)');
  if (fam < 41 || units < 141) fail('unit sheets fell: ' + fam + ' drawings / ' + units + ' units (2026-11-26: 41 / 141)');
  console.log(bad ? 'FAIL unit-sheets: ' + bad : 'PASS unit-sheets: every unit runs the logic of its drawing; only addresses, text and state differ');
  process.exit(bad ? 1 : 0);
})();
