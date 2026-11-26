/* Phase 5 BLOCK LIBRARY, SWITCHES (2026-11-26): the check of tests/regress/switches.js (every SW / AMT block of every ABC sheet, the
   same time line and the same rule) headless and fast enough for every Checks run: each block is tested ALONE in its own sheet (only
   that sheet scans; inputs from other sheets hold; the sheet goes back to the same state before each run), PLANT MODEL OFF.
   For each control signal of the block: a run with no force is the reference; then the signal is forced ON, released, forced OFF,
   released. A plain switch (SW) must be back where the reference is by itself; an A/M station keeps the forced leg after the release
   until the operator's mode press, which brings it back (user rule 2026-10-15, CLAUDE.md HINDI NAGBABAGO 2).
   Fails on any case not back, or fewer cases than the floor. The full-plant version stays tests/regress/switches.js.
   Usage: node tests/lanes/qa/switches.cjs */
'use strict';
const path = require('path');
const root = path.resolve(__dirname, '..', '..', '..');
const { load } = require(path.join(root, 'tools/trace/world.cjs'));
const FLOOR = +(process.env.SW_FLOOR || 438); /* first headless run 2026-11-26: 438 cases, 0 not back, 3 s */
const E = load(),
  AN = E.AN,
  anStep = E.js('ENGINE.E.anStep'),
  clone = E.js('x => structuredClone(x)');
const t0 = Date.now();
AN.reset();
for (const x of AN.sheets) if (x.S) for (const b of x.S.procs || []) b.proc.on = false;
const out = [];
let tot = 0,
  amKept = 0;
const bykind = {};
for (const sh of AN.sheets) {
  if (/ABC-000/.test(sh.name)) continue;
  let S;
  try {
    S = AN.ensure(sh);
  } catch (e) {
    continue;
  }
  for (const b of S.procs || []) b.proc.on = false;
  for (let i = 0; i < 6; i++) anStep(S, 0);
  const base = clone(S.rt);
  for (const b of S.blk) {
    if (b.k !== 'SW' && b.k !== 'AMT') continue;
    const ctl = new Set();
    if (b.sel >= 0) ctl.add(b.sel);
    for (const c of b.cs || []) ctl.add(c.n);
    for (const n of ctl) {
      const pk = () => S.rt.st[b.id].pk;
      const run = (force, ref) => {
        S.rt = clone(base);
        const r = [],
          w = [];
        const st = k => {
          for (let i = 0; i < k; i++) anStep(S, 0.25);
        };
        const amS = S.rt.st[b.id] && S.rt.st[b.id].al != null;
        st(8);
        r.push(pk());
        if (force) S.rt.force[n] = 1;
        st(8);
        r.push(pk());
        if (force) delete S.rt.force[n];
        st(16);
        r.push(pk());
        if (force && amS && r[2] !== ref.r[2]) S.rt.st[b.id].fm = ref.r[2];
        st(8);
        w.push(pk());
        if (force) S.rt.force[n] = 0;
        st(8);
        r.push(pk());
        if (force) delete S.rt.force[n];
        st(16);
        r.push(pk());
        if (force && amS && r[4] !== ref.r[4]) S.rt.st[b.id].fm = ref.r[4];
        st(8);
        w.push(pk());
        return { r, w };
      };
      const R0 = run(false),
        G = run(true, R0),
        ref = R0.r,
        [base0, f1, rel1, f0, rel0] = G.r;
      const am = S.rt.st[b.id].al != null;
      const bad = am ? (rel1 !== ref[2] && (rel1 !== f1 || G.w[0] !== R0.w[0])) || (rel0 !== ref[4] && G.w[1] !== R0.w[1]) : rel1 !== ref[2] || rel0 !== ref[4];
      if (am && rel1 !== ref[2] && !bad) amKept++;
      tot++;
      const key = b.k + (b.latch ? '+latch' : '') + (b.cs && b.cs.length > 1 ? '+cs' : '') + (b.q4 ? '+q4' : '');
      bykind[key] = bykind[key] || [0, 0];
      bykind[key][0]++;
      if (bad) bykind[key][1]++, out.push([sh.name, b.id, key, (b.txt || []).join('/'), 'net' + n, n === b.sel ? 'SEL' : 'cs', 'base', base0, 'f1', f1, 'rel1', rel1, 'f0', f0, 'rel0', rel0, 'op', G.w.join(''), 'ref', ref.join('') + '/' + R0.w.join('')].join(' '));
    }
  }
  S.rt = base;
}
out.forEach(x => console.log('FAIL', x));
const ok = !out.length && tot >= FLOOR;
console.log((ok ? 'PASS' : 'FAIL') + ' switches headless, each alone in its sheet: ' + tot + ' control cases (floor ' + FLOOR + '), ' + out.length + ' not back, ' + amKept + ' A/M stations kept the forced leg until the mode press; ' + JSON.stringify(bykind) + '; ' + ((Date.now() - t0) / 1000).toFixed(0) + ' s');
process.exit(ok ? 0 : 1);
