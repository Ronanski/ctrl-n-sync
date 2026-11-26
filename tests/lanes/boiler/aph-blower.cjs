/* Phase 6 DCS (2026-11-26): the air heater blowers N-1040 / N-1042 (Clyde Bergemann Mk VX-AB), from the YUA PC read
   /mnt/project-files/phase6-dcs-5-signals-2026-11-26.md (L20 OMM p.15 / p.17 / p.35, SCM VX-AB manual p.11, drawing 110460/29/1 'F',
   control panel manual p.7 / p.9 / p.12). One cold end cycle from the 150 MW start, headless, 0.2 s steps:
   - MOF-N1042 (forward) made from park to full stroke, one continuous run (DERIVED about 68 s), then off;
   - MOR-N1042 (reverse) made only while a 38 mm step moves: 20 steps, 55 s apart (the dwell), MOF and MOR never both;
   - the lance is back at park and the cycle ends at 19 min 40 s (OMM p.15);
   - ZSR "NOT ON" is 1 while the lance is off park;
   - the hot end rows MOF / MOR-N1040 stay 0 while the cold end runs. */
const W = require('../../../tools/trace/world.cjs');
let bad = 0;
const fail = m => (bad++, console.log('FAIL', m));
(async () => {
  const E = W.load();
  await E.start('150');
  const U = E.AN.unit,
    R = E.ctx.FIELD.rows,
    f = t => R.find(r => r.tag === t);
  for (const t of ['MOF-N1040', 'MOR-N1040', 'MOF-N1042', 'MOR-N1042']) if (!f(t)) fail('no field row ' + t);
  if (bad) process.exit(1);
  if (U.sbA && U.sbA.ph) fail('a blower runs at the 150 MW start (18.PNG: all at rest)');
  U.sbA = U.sbA || { op: 0, ph: 0, t: 0, p40: 0, p42: 0 };
  Object.assign(U.sbA, { ph: 2, t: 0 });
  let t = 0,
    fw = 0,
    fwEnd = null,
    steps = 0,
    prevR = 0,
    both = 0,
    hot = 0,
    maxX = 0,
    zsr = 0;
  const starts = [];
  while (t < 1300) {
    E.step(1, 0.2);
    t += 0.2;
    const a = f('MOF-N1042').v(U),
      b = f('MOR-N1042').v(U);
    if (a && b) both++;
    if (f('MOF-N1040').v(U) || f('MOR-N1040').v(U)) hot++;
    if (a) fw += 0.2;
    if (!a && fwEnd === null && fw > 0) fwEnd = t;
    if (b && !prevR) steps++, starts.push(t);
    prevR = b;
    maxX = Math.max(maxX, +U.sbA.x || 0);
    if (U.sbA.ph && U.sbA.x > 0) zsr++;
    if (!U.sbA.ph) break;
  }
  console.log('forward ' + fw.toFixed(1) + ' s, reverse steps ' + steps + ', cycle ' + t.toFixed(1) + ' s, max ' + maxX.toFixed(0) + ' mm');
  if (fw < 66 || fw > 70) fail('forward run ' + fw.toFixed(1) + ' s, want about 68 s');
  if (steps !== 20) fail('reverse steps ' + steps + ', want 20 (750 / 38 mm)');
  const gaps = starts.slice(1).map((x, i) => x - starts[i]);
  if (gaps.some(g => g < 57.5 || g > 59.5)) fail('step to step ' + gaps.map(g => g.toFixed(1)).join(' ') + ' s, want 55 s dwell + 3.4 s move');
  if (Math.abs(t - 1180) > 0.5) fail('cycle ' + t.toFixed(1) + ' s, want 19 min 40 s = 1180 s');
  if (maxX < 745 || maxX > 750) fail('full stroke ' + maxX.toFixed(0) + ' mm, want 750');
  if (U.sbA.x !== 0) fail('lance not back at park: ' + U.sbA.x);
  if (both) fail('MOF and MOR both made ' + both + ' scans');
  if (hot) fail('hot end rows made while the cold end runs: ' + hot + ' scans');
  if (zsr < 5800) fail('ZSR NOT ON (off park) only ' + zsr + ' scans');
  console.log(bad ? 'FAIL aph-blower ' + bad : 'PASS aph-blower: MOF / MOR-N1042 one cycle, 20 steps, 19 min 40 s');
  process.exit(bad ? 1 : 0);
})();
