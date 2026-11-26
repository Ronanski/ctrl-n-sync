/* Phase 5 BLOCK LIBRARY, PID / PIDV in AUTO (2026-11-26): the check of tests/regress/pid_auto.js (the same four checks, the same
   amounts) for every PID / PIDV of every ABC sheet, headless, fast enough for every Checks run. The browser test steps the whole plant
   for every controller (about 30 s each); here the plant is put at 150 MW once and each PID is tested ALONE in its real sheet wiring:
   only its own sheet scans (the selectors after it are on the same sheet), the inputs from other sheets hold their 150 MW values, and
   the sheet goes back to the same 150 MW state before the next PID. PLANT MODEL OFF as in the browser test.
     1. PV = SV: the output holds (no drift),
     2. PV 10 % of the range ABOVE SV: the output moves the way the drawing says (ACT:R reverse = down, ACT:N direct = up),
     3. PV 10 % BELOW SV: it moves the other way,
     4. the output stays inside the MV limits of the parameter list (lo ~ hi).
   A station in MANUAL at 150 MW (the PID tracks) and a PID whose PV / SV pin is not found are listed, not counted as PASS. Fails on any
   FAIL or when fewer PID pass than the floor. The full-plant version stays tests/regress/pid_auto.js (sim-tests.yml).
   Usage: node tests/lanes/qa/pid-auto.cjs [ABC-010,ABC-007] */
'use strict';
const path = require('path');
const root = path.resolve(__dirname, '..', '..', '..');
const { load } = require(path.join(root, 'tools/trace/world.cjs'));
const FLOOR = +(process.env.PID_AUTO_FLOOR || 36); /* first run 2026-11-26: 68 PID, 36 PASS, 30 MAN at 150 MW, 2 LIMIT (AICFG10571 MV 35 = hi, PICFG108A MV 100 = hi) */
const ONLY = (process.argv[2] || '').split(',').filter(Boolean);
(async () => {
  const E = load();
  await E.start('150');
  const AN = E.AN,
    anStep = E.js('ENGINE.E.anStep'),
    clone = E.js('x => structuredClone(x)');
  const t0 = Date.now(),
    res = [];
  for (const x of AN.sheets) if (x.S) for (const b of x.S.procs || []) b.proc.on = false;
  for (const sh of AN.sheets) {
    if (/ABC-000/.test(sh.name) || (ONLY.length && !ONLY.includes(sh.name))) continue;
    let S;
    try {
      S = AN.ensure(sh);
    } catch (e) {
      continue;
    }
    for (const b of S.procs || []) b.proc.on = false;
    const base = clone(S.rt);
    for (const b of S.blk) {
      if (b.k !== 'PID' && b.k !== 'PIDV') continue;
      const tag = (b.txt || [])[1] || '';
      let q = null;
      try {
        q = AN.anPins(S, b);
      } catch (e) {}
      const po = (b.o || []).find(n => n != null && S.nets[n] && !S.nets[n].dig);
      if (!q || q.pv == null || q.pv < 0 || q.sv == null || q.sv < 0 || po == null) {
        res.push({ sh: sh.name, tag, k: b.k, status: 'NOT TESTED: PV / SV pin not found' });
        continue;
      }
      S.rt = clone(base);
      const P = b.p,
        rlo = P.rlo ?? 0,
        rhi = P.rhi ?? 100,
        span = rhi - rlo,
        lo = P.lo ?? 0,
        hi = P.hi ?? 100;
      const run = sec => {
        for (let i = 0; i < sec * 4; i++) anStep(S, 0.25);
      };
      const outv = () => +S.rt.st[b.id].out;
      const sv0 = +S.rt.v[q.sv];
      S.rt.force[q.pv] = sv0;
      S.rt.force[q.sv] = sv0;
      run(5 + Math.ceil(6 * (P.tf || 0))); /* the PV filter (TF of the parameter list) settles first */
      const vel = !!b.vel;
      const o0 = outv();
      run(10);
      const o1 = outv();
      const man = S.rt.st[b.id].trk != null;
      S.rt.force[q.pv] = sv0 + 0.1 * span;
      run(10);
      const oUp = outv(),
        mvUp = vel && b.velNet != null ? +S.rt.v[b.velNet] : NaN;
      S.rt.force[q.pv] = sv0 - 0.1 * span;
      run(20);
      const oDn = outv(),
        mvDn = vel && b.velNet != null ? +S.rt.v[b.velNet] : NaN;
      if (man) {
        res.push({ sh: sh.name, tag, k: b.k, status: 'MAN: the station is MANUAL at 150 MW (the PID tracks the manual output)' });
        continue;
      }
      const act = P.act < 0 ? 'R' : 'N';
      /* velocity PID: the output is the change per scan, its sign is the direction */
      const dirUp = vel ? Math.sign(oUp) : Math.sign(oUp - o1),
        dirDn = vel ? Math.sign(oDn) : Math.sign(oDn - oUp);
      const want = act === 'R' ? -1 : 1;
      const okHold = vel ? Math.abs(o1) < 1e-6 : Math.abs(o1 - o0) <= Math.max(0.05, (hi - lo) * 0.001);
      const atLim = v => v <= lo + 1e-6 || v >= hi - 1e-6;
      const okUp = dirUp === want || (dirUp === 0 && !vel && atLim(o1) && (want > 0 ? o1 >= hi - 1e-6 : o1 <= lo + 1e-6));
      const okDn = dirDn === -want || (dirDn === 0 && !vel && atLim(oUp));
      const okLim = vel || [o0, o1, oUp, oDn].every(v => v >= lo - 1e-6 && v <= hi + 1e-6);
      /* a velocity PID whose station MV is already at its limit in the asked direction gives a step of 0 (plant.js 3.2.5-beta.1: the
         step is cut so MV + step stays inside ML / MH): listed as LIMIT, neither PASS nor FAIL (the position form at its limit is
         accepted by the same rule of pid_auto.js) */
      const stuck = (mv, d) => isFinite(mv) && (d > 0 ? mv >= hi - 1e-6 : mv <= lo + 1e-6);
      if (vel && okHold && okLim && ((!okUp && dirUp === 0 && stuck(mvUp, want)) || (!okDn && dirDn === 0 && stuck(mvDn, -want))) && (okUp || stuck(mvUp, want)) && (okDn || stuck(mvDn, -want))) {
        res.push({ sh: sh.name, tag, k: b.k, status: 'LIMIT: the MV is at its limit ' + (stuck(mvUp, want) ? mvUp : mvDn) + ' (lo ' + lo + ', hi ' + hi + '), the velocity step toward it is 0' });
        continue;
      }
      res.push({ sh: sh.name, tag, k: b.k, act, status: okHold && okUp && okDn && okLim ? 'PASS' : 'FAIL', okHold, okUp, okDn, okLim, o0: +o0.toFixed(2), o1: +o1.toFixed(2), oUp: +oUp.toFixed(2), oDn: +oDn.toFixed(2), lo, hi });
    }
    S.rt = base;
  }
  const c = {};
  for (const x of res) {
    const k = x.status.startsWith('NOT') ? 'NOT TESTED' : x.status.startsWith('MAN') ? 'MAN' : x.status.startsWith('LIMIT') ? 'LIMIT' : x.status;
    c[k] = (c[k] || 0) + 1;
    if (x.status !== 'PASS') console.log(x.status === 'FAIL' ? 'FAIL' : '----', x.sh, x.tag, x.k, x.status === 'FAIL' ? JSON.stringify(x) : x.status);
  }
  const ok = !c.FAIL && (c.PASS || 0) >= FLOOR;
  console.log((ok ? 'PASS' : 'FAIL') + ' PID AUTO headless, each PID alone in its sheet: ' + res.length + ' PID, ' + JSON.stringify(c) + ' (floor ' + FLOOR + ' PASS), ' + ((Date.now() - t0) / 1000).toFixed(0) + ' s');
  process.exit(ok ? 0 : 1);
})();
