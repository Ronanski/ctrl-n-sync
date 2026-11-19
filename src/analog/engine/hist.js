/* ===== FACEPLATE TREND HISTORY (user "go all" 2026-11-19, item 3: the faceplate trend) =====
   AN.fpHist(key, seconds) -> { t: [], pv: [], sp: [], mv: [], unit, lo, hi, now } or null.
   - key = the faceplate's tag: every controller (PID / PIDV of the ABC sheets, the same list as the faceplate, AN.hmiCtrls) and every
     manual station (MAN) with a tag. The same nets the faceplate reads: PV = the PV pin, SP = the SV pin, MV = the A/M station output.
   - One sample a second of SIMULATION time (at x10 the 30 minutes pass in 3 minutes of wall time), 1800 samples kept per tag in
     typed ring buffers (68 controllers about 1.5 MB). Sampled at the end of each plant model step (anUnitStep), the same place for
     the page and the headless engine. Oldest first. A MAN station has no PV / SP: those arrays hold null.
   - History starts when the plant is loaded or the sheet is first stepped; nothing is invented before that. */
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
function anHistStep(dt) {
  const H = AN_HIST;
  H.T += dt;
  if (H.T < H.next || !AN.sheets) return;
  H.next = Math.floor(H.T) + 1;
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
  const r = AN_HIST.ix && AN_HIST.ix[String(key || '').trim().toUpperCase()];
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
