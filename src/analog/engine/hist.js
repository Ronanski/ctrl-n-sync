/* ===== FACEPLATE TREND HISTORY (user "go all" 2026-11-19, item 3: the faceplate trend) =====
   AN.fpHist(key, seconds) -> { t: [], pv: [], sp: [], mv: [], unit, lo, hi, now } or null.
   - key = the faceplate's tag: every controller (PID / PIDV of the ABC sheets, the same list as the faceplate, AN.hmiCtrls) and every
     manual station (MAN) with a tag. The same nets the faceplate reads: PV = the PV pin, SP = the SV pin, MV = the A/M station output.
   - One sample a second of SIMULATION time (at x10 the 30 minutes pass in 3 minutes of wall time), 1800 samples kept per tag in
     typed ring buffers (68 controllers about 1.5 MB). Sampled at the end of each plant model step (anUnitStep), the same place for
     the page and the headless engine. Oldest first. A MAN station has no PV / SP: those arrays hold null.
   - History starts when the plant is loaded or the sheet is first stepped; nothing is invented before that.
   Machines and valves (the same faceplate trend, user "go all" item 3, fpHist for machines and valves): AN.histReg(keys, kind, read)
   puts a machine ('mach': read.st() -> 'RUN' | 'STOP' | 'TRIP' | null, read.cur() -> A or null) or a valve ('valve': read.pos() -> %)
   in the same 1 s sampling, under each of its keys (the equipment tag and the name). The HMI pages give the readers of their machines
   and valves (hmi-mock.js, fp-pop.js, through the queue window.LS_HISTQ, taken in here), the same reads their faceplates show.
   AN.fpHist(key) of a machine -> { kind: 'mach', t: [], run: [1 RUN | 0 STOP | -1 TRIP | null], cur: [A | null], unit, now };
   of a valve -> { kind: 'valve', t: [], pos: [], unit: '%', now }. A control valve is the MV of its controller (above). */
const AN_HIST_N = 1800;
const AN_HIST = { T: 0, next: 0, ix: null, of: null, scan: 0 };
function anHistIndex() {
  const H = AN_HIST;
  if (H.of !== AN.sheets) ((H.ix = {}), (H.of = AN.sheets), (H.scan = 0));
  if (H.T < H.scan) return;
  H.scan = H.T + 10; /* sheets opened later are added within 10 s */
  for (const sh of AN.sheets || []) {
    if (!sh.S || !/^ABC-/.test(sh.name) || /^ABC-000/.test(sh.name) || H.ix['@' + sh.name]) continue;
    H.ix['@' + sh.name] = 1;
    const S = sh.S;
    let cs = [];
    try {
      cs = AN.hmiCtrls(S) || [];
    } catch (e) {}
    const add = (tag, pv, sv, out, P) => {
      const k = String(tag).trim().toUpperCase();
      if (!k || H.ix[k] || out == null || out < 0) return;
      H.ix[k] = {
        sh,
        pv,
        sv,
        out,
        unit: P.unit || (P.rng && P.rng.u) || '',
        lo: P.rlo != null ? P.rlo : P.lo != null ? P.lo : 0,
        hi: P.rhi != null ? P.rhi : P.hi != null ? P.hi : 100,
        t: new Float64Array(AN_HIST_N),
        p: new Float32Array(AN_HIST_N),
        s: new Float32Array(AN_HIST_N),
        m: new Float32Array(AN_HIST_N),
        i: 0,
        n: 0
      };
    };
    for (const c of cs) add(c.tag, c.q.pv, c.q.sv, c.out, c.b.p || {});
    for (const b of S.blk || [])
      if (b.k === 'MAN' && b.o && b.o[0] != null) {
        const tag = b.tag || (b.txt || []).find(t => t && t !== 'MAN' && !/^S\d-MDL/.test(t));
        if (tag) add(tag, null, null, b.o[0], b.p || {});
      }
  }
}
AN.histReg = (keys, kind, read) => {
  const H = AN_HIST,
    R = (H.reg = H.reg || {}),
    r = { kind, read, unit: (read && read.unit) || '', t: new Float64Array(AN_HIST_N), a: new Float32Array(AN_HIST_N), b: new Float32Array(AN_HIST_N), i: 0, n: 0 };
  for (const k of [].concat(keys)) if (k) R[String(k).trim().toUpperCase()] = R[String(k).trim().toUpperCase()] || r;
};
function anHistRegStep() {
  const H = AN_HIST;
  if (typeof window !== 'undefined' && window.LS_HISTQ && window.LS_HISTQ.length) for (const q of window.LS_HISTQ.splice(0)) AN.histReg(q[0], q[1], q[2]);
  const seen = new Set(),
    num = f => {
      try {
        const v = f ? f() : null;
        return v == null || !isFinite(v) ? NaN : +v;
      } catch (e) {
        return NaN;
      }
    };
  for (const k in H.reg || {}) {
    const r = H.reg[k];
    if (seen.has(r)) continue;
    seen.add(r);
    const j = r.i;
    r.t[j] = H.T;
    if (r.kind === 'mach') {
      let st = null;
      try {
        st = r.read.st();
      } catch (e) {}
      r.a[j] = st === 'RUN' ? 1 : st === 'STOP' ? 0 : st === 'TRIP' ? -1 : NaN;
      r.b[j] = num(r.read.cur);
    } else r.a[j] = num(r.read.pos);
    r.i = (j + 1) % AN_HIST_N;
    if (r.n < AN_HIST_N) r.n++;
  }
}
function anHistStep(dt) {
  const H = AN_HIST;
  H.T += dt;
  if (H.T < H.next || !AN.sheets) return;
  H.next = Math.floor(H.T) + 1;
  anHistRegStep();
  anHistIndex();
  for (const k in H.ix) {
    const r = H.ix[k];
    if (r === 1) continue;
    const S = r.sh.S,
      v = S && S.rt && S.rt.v;
    if (!v) continue;
    const j = r.i;
    r.t[j] = H.T;
    r.p[j] = r.pv != null ? +v[r.pv] : NaN;
    r.s[j] = r.sv != null ? +v[r.sv] : NaN;
    r.m[j] = +v[r.out];
    r.i = (j + 1) % AN_HIST_N;
    if (r.n < AN_HIST_N) r.n++;
  }
}
AN.fpHist = (key, seconds) => {
  const K = String(key || '').trim().toUpperCase(),
    c = AN_HIST.ix && AN_HIST.ix[K],
    g = !(c && c !== 1) && AN_HIST.reg && AN_HIST.reg[K]; /* a controller's own trend first: some machine entries carry the tag of their controller */
  if (g) {
    const from = AN_HIST.T - (seconds > 0 ? seconds : AN_HIST_N),
      o = g.kind === 'mach' ? { kind: 'mach', t: [], run: [], cur: [], unit: g.unit, now: AN_HIST.T } : { kind: 'valve', t: [], pos: [], unit: g.unit, now: AN_HIST.T },
      f = x => (isFinite(x) ? Math.round(x * 1000) / 1000 : null);
    for (let q = 0; q < g.n; q++) {
      const j = (g.i - g.n + q + AN_HIST_N) % AN_HIST_N;
      if (g.t[j] < from) continue;
      o.t.push(g.t[j]);
      if (g.kind === 'mach') (o.run.push(f(g.a[j])), o.cur.push(f(g.b[j])));
      else o.pos.push(f(g.a[j]));
    }
    return o;
  }
  const r = c;
  if (!r || r === 1) return null;
  const from = AN_HIST.T - (seconds > 0 ? seconds : AN_HIST_N),
    o = { t: [], pv: [], sp: [], mv: [], unit: r.unit, lo: r.lo, hi: r.hi, now: AN_HIST.T },
    f = x => (isFinite(x) ? Math.round(x * 1000) / 1000 : null);
  for (let q = 0; q < r.n; q++) {
    const j = (r.i - r.n + q + AN_HIST_N) % AN_HIST_N;
    if (r.t[j] < from) continue;
    o.t.push(r.t[j]);
    o.pv.push(f(r.p[j]));
    o.sp.push(f(r.s[j]));
    o.mv.push(f(r.m[j]));
  }
  return o;
};
AN._hist = AN_HIST; /* the state, for the regression test (tests/regress/fphist_mach.js) */
