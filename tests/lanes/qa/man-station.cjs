/* Phase 5 BLOCK LIBRARY, MAN (manual station) (2026-11-26): every MAN block of every ABC sheet, each alone in its own sheet (only that
   sheet scans), PLANT MODEL OFF, headless in every Checks run. The textbook: MAN = the operator sets the output; the output stays inside
   the MV limits of the parameter list (FORM 2 MAN: MH / ML, face-defaults.js); interlock tracking (the back-up value of the drawing) wins.
     1. operator value: a value inside MH / ML reaches the output (station on its manual leg, or the station in MANUAL),
     2. above MH the output is MH, below ML it is ML,
     3. AUTO leg (the A / M switch before it on A, station not in MANUAL): the output follows the auto input, inside MH / ML,
     A station the drawing tracks (interlock tracking, the back-up value) is listed, not counted.
   Fails on any FAIL or fewer stations than the floor. Usage: node tests/lanes/qa/man-station.cjs */
'use strict';
const path = require('path');
const root = path.resolve(__dirname, '..', '..', '..');
const { load } = require(path.join(root, 'tools/trace/world.cjs'));
const FLOOR = +(process.env.MAN_FLOOR || 47); /* first run 2026-11-26: 45 MANUAL + 2 AUTO leg, 11 tracked by the drawing */
const E = load(),
  AN = E.AN,
  anStep = E.js('ENGINE.E.anStep'),
  clone = E.js('x => structuredClone(x)');
const t0 = Date.now();
AN.reset();
AN.plantOn = false;
for (const x of AN.sheets) if (x.S) for (const b of x.S.procs || []) b.proc.on = false;
const bad = [],
  n = { man: 0, auto: 0, trk: 0, skip: {} };
const skip = w => (n.skip[w] = (n.skip[w] || 0) + 1);
const near = (a, b, sp) => Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(sp));
/* an output wired to an analog output card (AO, 0 ~ 100 %) is sent inside 0 ~ 100 % (plant.js out(): S.aoN); MH 101 / ML -1 stay
   inside the station */
const ao = (S, o, x) => (S.aoN && S.aoN.has(o) ? Math.max(0, Math.min(100, x)) : x);
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
    if (b.k !== 'MAN') continue;
    const o = (b.o || [])[0],
      P = b.p || {};
    if (o == null || o < 0) {
      skip('no output net');
      continue;
    }
    const lo = P.lo ?? 0,
      hi = P.hi ?? 100,
      sp = hi - lo,
      nm = (b.tag || (b.txt || [])[1] || '#' + b.id) + ' ' + sh.name;
    if (!(sp > 0)) {
      skip('no MV limits');
      continue;
    }
    S.rt = clone(base);
    let tracked = false;
    const run = k => {
      for (let i = 0; i < k; i++) {
        anStep(S, 1);
        if (S.rt.st[b.id] && S.rt.st[b.id].trk != null) tracked = true;
      }
    };
    run(2);
    const st = S.rt.st[b.id];
    const dr = b.svI >= 0 && b.i[b.svI] >= 0 ? (S.drv[b.i[b.svI]] || []).find(x => x.k === 'AMT') : null,
      pkA = dr && S.rt.st[dr.id] && S.rt.st[dr.id].pk === 'A';
    const autoIn = pkA && !(dr.a != null && ((b.o || []).includes(dr.a) || (AN.nm(S, dr.a) || '').toUpperCase() === String(b.tag || '').toUpperCase() + '.MV'));
    if (tracked) {
      skip('tracked at the start');
      continue;
    }
    if (autoIn) {
      const inN = b.i[b.svI];
      S.rt.force[inN] = lo + 0.37 * sp;
      run(3);
      n.auto++;
      if (!near(S.rt.v[o], ao(S, o, lo + 0.37 * sp), sp)) bad.push(nm + ' AUTO: input ' + (lo + 0.37 * sp) + ', output ' + S.rt.v[o]);
      S.rt.force[inN] = hi + 0.2 * sp;
      run(3);
      if (!near(S.rt.v[o], ao(S, o, hi), sp)) bad.push(nm + ' AUTO: input above MH ' + hi + ', output ' + S.rt.v[o]);
      delete S.rt.force[inN];
    } else {
      const want = lo + 0.37 * sp;
      st.val = want;
      st.op = null;
      run(3);
      if (tracked) {
        skip('tracked (interlock tracking of the drawing)');
        continue;
      }
      n.man++;
      if (!near(S.rt.v[o], ao(S, o, want), sp)) bad.push(nm + ' MANUAL: operator ' + want + ', output ' + S.rt.v[o]);
      st.val = hi + 0.2 * sp;
      run(2);
      if (!near(S.rt.v[o], ao(S, o, hi), sp)) bad.push(nm + ' MANUAL: operator above MH ' + hi + ', output ' + S.rt.v[o]);
      st.val = lo - 0.2 * sp;
      run(2);
      if (!near(S.rt.v[o], ao(S, o, lo), sp)) bad.push(nm + ' MANUAL: operator below ML ' + lo + ', output ' + S.rt.v[o]);
    }
  }
  S.rt = base;
}
bad.forEach(x => console.log('FAIL', x));
const tot = n.man + n.auto,
  ok = !bad.length && tot >= FLOOR;
console.log((ok ? 'PASS' : 'FAIL') + ' MAN station headless: MANUAL ' + n.man + ', AUTO leg ' + n.auto + ' (floor ' + FLOOR + '); skipped ' + JSON.stringify(n.skip) + '; ' + ((Date.now() - t0) / 1000).toFixed(0) + ' s');
process.exit(ok ? 0 : 1);
