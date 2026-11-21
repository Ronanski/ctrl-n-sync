/* ===== ENGINE STATE: the whole running state of the analog engine as one plain value (a KEYFRAME) and back. No page access.
   3.2.0 Web Worker (user 2026-11-02 "Worker n. Lhat n", stage a): the engine of a worker and the mirror of the page must hold the
   same state; a keyframe carries it from one to the other (start, a starting state, an operator action that the engine runs).
   What is in it: per sheet the run time (rt: values, inputs, forces, block states, plant model), the look, the links (xlk), the plant
   model of each block (b.proc) and the mode nets of a MAN block (b._mn); the unit / source / cycle models (AN_UNIT, AN_SRC, AN_CYC,
   AN_SW, AN_MU, AN_ACW, AN_MT, AN_AIR) and the flags of AN the engine reads. A sheet, a block or a net of a sheet is written as its
   index ({$S}, {$B}, {$N}), not copied: the other side has the same sheets (the same drawings, the same order). A function is not
   copied: the other side keeps its own ===== */
const AN_STATE_OBJ = () => ({ AN_UNIT, AN_SRC, AN_CYC, AN_SW, AN_MU, AN_ACW, AN_MT, AN_AIR });
/* the flags of AN that the engine reads (plain values) */
const AN_STATE_FLAGS = ['i', 'plantOn', 'procDefault', 'startState', 'steady', 'spd', 'run', 'view', 'tierK', '_cold0', 'load150', 'ramp', 'cat', 'restartKind' /* Mina beta.169: the PLANT chip (Warm / Hot restart) reads it on the page in Worker mode */, 'restartPd' /* Mina S179-1: the guide blow-off hold (guide.js holdP) reads it on the page in Worker mode */];
/* the sheets a step takes besides the linked ones (links.js actSet): names, and the second sheet of the page (a sheet) */
const AN_STATE_SETS = ['hmiSheets', 'plantSheets', 'unitSheets', 'checkSheets', 'worldSheets', 'p2'];
const anStateTabs = () => ({ AN_HMI_OP, AN_HMI_AI, AN_HMI_CTL, AN_HMI_MAN, AN_HMI_FF, AN_HMI_DI, AN_HMI_DI_COLD });
function anStateRefs() {
  const ref = new Map();
  ref.set(AN.sheets, { $all: 1 }); /* the list itself (AN_SRC.bitsOf: a cache made for this list) */
  AN.sheets.forEach((sh, i) => {
    ref.set(sh, { $sh: i });
    const S = sh.S;
    if (!S) return;
    ref.set(S, { $S: i });
    S.blk.forEach((b, j) => {
      ref.set(b, { $B: [i, j] });
      /* a cache of a block that the unit model holds too (anPins) */
      if (b._pins && typeof b._pins === 'object') ref.set(b._pins, { $Q: [i, j] });
    });
    S.nets.forEach((n, j) => ref.set(n, { $N: [i, j] }));
  });
  /* a link between sheets by its place in the links of a sheet (links.js linksOf: S.xlk of several sheets hold the same link) */
  AN.sheets.forEach((sh, i) => (sh.lk || []).forEach((l, j) => ref.has(l) || ref.set(l, { $K: [i, j] })));
  /* an entry of a table of the HMI snapshot (a plant model points at its anchor AN_HMI_OP[tag]) and the FROM of a DITL link of the
     one world (world.js fakeFrom): written by their key, the other side has the same tables */
  for (const [n, T] of Object.entries(anStateTabs())) for (const k of Object.keys(T)) if (T[k] && typeof T[k] === 'object' && !ref.has(T[k])) ref.set(T[k], { $H: [n, k] });
  if (typeof window !== 'undefined' && window.WORLD && WORLD.fakeAll) for (const [d, o] of WORLD.fakeAll()) ref.set(o, { $F: d.name });
  /* a DITL sheet by its name (the unit model keeps the sheets it reads, AN_UNIT._dr: copied, it was 1.4 MB of drawings and the copy
     was read instead of the sheet) */
  if (typeof ditlAll === 'function') for (const d of ditlAll()) ref.set(d, { $D: d.name });
  return ref;
}
/* ===== SAVE POINT VERSION (Full Audit 3, ranking 10). A keyframe writes a sheet, a block or a net as its index. A save point kept
   for days (S1 to S107) broke when the order of the sheets changed (a new or imported sheet) or a drawing changed its blocks.
   Format 2 writes a map with the keyframe: the name of each sheet and a signature of its drawing (count and kind of every block,
   count of nets) and the key of each block (kind, tag, n-th of that kind and tag). On load each index is taken to the sheet of the
   same name today. On a sheet whose signature differs a block is taken by its key; its sheet values (rt, kept by net and pin index)
   and its nets are not taken (they keep what they hold now), a block or net with no match keeps the object of today, and the sheet is listed in AN.stWarn. A save without a map (format 1, every save made
   before this) was written with the sheet order of AN_STATE_V1 (state-v1.js, the order of 3.2.5-beta.10). ===== */
const AN_STATE_FMT = 2;
function anSheetSig(S) {
  let h = 2166136261;
  const add = t => {
    for (let i = 0; i < t.length; i++) h = Math.imul(h ^ t.charCodeAt(i), 16777619) >>> 0;
  };
  for (const b of S.blk) add(String(b.k) + ',');
  add('|' + S.blk.length + '|' + S.nets.length);
  return h.toString(36);
}
const anBlkKeys = S => {
  const n = {};
  return S.blk.map(b => {
    const k = b.k + ':' + (b.tag || '');
    n[k] = (n[k] || 0) + 1;
    return k + '#' + n[k];
  });
};
const anStateMap = () => ({
  v: AN_STATE_FMT,
  sh: AN.sheets.map(s => s.name),
  sg: AN.sheets.map(s => (s.S ? anSheetSig(s.S) : null)),
  bk: AN.sheets.map(s => (s.S ? anBlkKeys(s.S).join(' ') : null))
});
let AN_SM = null; /* while a keyframe of another sheet order is decoded: s[old index] = index today (-1 none), ok[old] = same drawing,
   b[old] = for a changed drawing, old block index -> block index today (-1 none; null when the save has no block keys) */
function anStateRemap(m) {
  const by = new Map(AN.sheets.map((s, i) => [s.name, i])),
    s = m.sh.map(n => (by.has(n) ? by.get(n) : -1)),
    ok = s.map((j, i) => j >= 0 && (m.sg[i] == null || anSheetSig(ensure(AN.sheets[j])) === m.sg[i])),
    same = s.length === AN.sheets.length && s.every((j, i) => j === i) && ok.every(Boolean),
    warn = [],
    b = s.map((j, i) => {
      if (j < 0 || ok[i] || !m.bk || !m.bk[i]) return null;
      const now = new Map(anBlkKeys(AN.sheets[j].S).map((k, x) => [k, x]));
      return m.bk[i].split(' ').map(k => (now.has(k) ? now.get(k) : -1));
    });
  m.sh.forEach((n, i) => {
    if (s[i] < 0) warn.push(n + ': sheet not in this version, its state is left out');
    else if (!ok[i]) {
      const lost = b[i] ? b[i].filter(x => x < 0).length : '?';
      warn.push(n + ': drawing changed, blocks taken by tag (' + lost + ' not found), sheet values not taken from the save');
    }
  });
  return same ? null : { s, ok, b, warn };
}
const AN_TA = { Float64Array, Float32Array, Int32Array, Uint8Array, Int8Array, Uint16Array, Int16Array, Uint32Array };
/* a value -> plain JSON (refs by index, cycles by $id / $ref, typed arrays, Map / Set, NaN / Infinity) */
function anStateEnc(x, ref) {
  const seen = new Map();
  let nid = 0;
  const num = v => (Number.isFinite(v) ? v : { $num: String(v) });
  const enc = v => {
    if (v === undefined) return { $u: 1 };
    if (v === null || typeof v === 'boolean' || typeof v === 'string') return v;
    if (typeof v === 'number') return num(v);
    if (typeof v === 'function') return { $fn: 1 };
    if (typeof v !== 'object') return null;
    const r = ref.get(v);
    if (r) return r;
    if (seen.has(v)) return { $ref: seen.get(v) };
    const id = nid++;
    seen.set(v, id);
    if (ArrayBuffer.isView(v)) return { $id: id, $ta: v.constructor.name, a: Array.from(v, num) };
    if (Array.isArray(v)) {
      /* an array may carry named fields too (unit.js: a list of transmitters with its snapshot a0) */
      const o = { $id: id, $arr: Array.from(v, enc) },
        ks = Object.keys(v).filter(k => !/^\d+$/.test(k));
      if (ks.length) {
        o.$p = {};
        for (const k of ks) o.$p[k] = enc(v[k]);
      }
      return o;
    }
    if (v instanceof Map) return { $id: id, $map: [...v].map(([k, w]) => [enc(k), enc(w)]) };
    if (v instanceof Set) return { $id: id, $set: [...v].map(enc) };
    const o = { $id: id, $o: {} };
    for (const k of Object.keys(v)) o.$o[k] = enc(v[k]);
    return o;
  };
  return enc(x);
}
/* plain JSON -> a value with the refs of this side; keep(k, old) for a $fn: the function the old object had */
function anStateDec(x, keep) {
  const ids = new Map();
  const num = v => (v && typeof v === 'object' && '$num' in v ? Number(v.$num) : v);
  const M = AN_SM,
    si = i => (M ? (M.s[i] >= 0 ? M.s[i] : null) : i),
    sh = i => (si(i) == null ? null : AN.sheets[si(i)]),
    SS = i => (sh(i) ? ensure(sh(i)) : null),
    SB = i => (M && !M.ok[i] ? null : SS(i)), /* a net or sheet value of a changed drawing is not taken */
    BJ = (i, j) => (!M || M.ok[i] ? j : M.b[i] && M.b[i][j] >= 0 ? M.b[i][j] : null), /* block index today */
    BK = (i, j) => (SS(i) && BJ(i, j) != null ? SS(i).blk[BJ(i, j)] : null),
    or = (x, old) => (x == null ? (old === undefined ? null : old) : x); /* no match: the object of today stays */
  const dec = (v, old) => {
    if (v === null || typeof v !== 'object') return v;
    if (v.$u) return undefined;
    if (v.$fn) return old;
    if ('$num' in v) return Number(v.$num);
    if (v.$all) return AN.sheets;
    if (v.$sh != null) return or(sh(v.$sh), old);
    if (v.$S != null) return or(SS(v.$S), old);
    if (v.$B) return or(BK(v.$B[0], v.$B[1]), old);
    if (v.$N) return or(SB(v.$N[0]) && SB(v.$N[0]).nets[v.$N[1]], old);
    if (v.$T) return or(SB(v.$T[0]) && SB(v.$T[0]).rt.st[v.$T[1]], old);
    if (v.$Q) {
      const b = BK(v.$Q[0], v.$Q[1]);
      return or(b && (b._pins || anPins(SS(v.$Q[0]), b)), old);
    }
    if (v.$R) return or(BK(v.$R[0], v.$R[1]) && BK(v.$R[0], v.$R[1]).proc.remote, old);
    if (v.$H) return anStateTabs()[v.$H[0]][v.$H[1]];
    if (v.$F) return WORLD.fakeFrom(ditlAll().find(x => x.name === v.$F));
    if (v.$K) return or(sh(v.$K[0]) && linksOf(sh(v.$K[0]))[v.$K[1]], old);
    if (v.$D) return (typeof ditlAll === 'function' && ditlAll().find(x => x.name === v.$D)) || null;
    if (v.$P) return or(BK(v.$P[0], v.$P[1]) && BK(v.$P[0], v.$P[1]).proc, old); /* engine/sync.js: a plant model by its block */
    if (v.$ref != null) return ids.get(v.$ref);
    if (v.$ta) {
      const a = new AN_TA[v.$ta](v.a.length);
      v.a.forEach((w, i) => (a[i] = num(w)));
      ids.set(v.$id, a);
      return a;
    }
    if (v.$arr) {
      const a = [];
      ids.set(v.$id, a);
      v.$arr.forEach((w, i) => (a[i] = dec(w, Array.isArray(old) ? old[i] : undefined)));
      for (const k in v.$p || {}) a[k] = dec(v.$p[k], old && typeof old === 'object' ? old[k] : undefined);
      return a;
    }
    if (v.$map) {
      const m = new Map();
      ids.set(v.$id, m);
      for (const [k, w] of v.$map) m.set(dec(k), dec(w));
      return m;
    }
    if (v.$set) {
      const s = new Set();
      ids.set(v.$id, s);
      for (const w of v.$set) s.add(dec(w));
      return s;
    }
    const o = {};
    ids.set(v.$id, o);
    for (const k of Object.keys(v.$o)) o[k] = dec(v.$o[k], old && typeof old === 'object' ? old[k] : undefined);
    return o;
  };
  return dec(x, keep);
}
/* one object of this side takes the decoded content in place (its identity stays: other objects hold it) */
/* 3.2.3 (CHAEWON, Worker run from a save of beta.125: "Cannot read properties of undefined (reading 'SWP-A')" in anMotorStep, the
   engine stopped). A save made before a version that added a key to a model (beta.126 AN_MT.mot) has no such key, and the key was
   deleted on load. A key the script defines (ini, the models as loaded) now takes its loaded value; only a key the run made goes */
function anStateInto(dst, src, ini) {
  for (const k of Object.keys(dst)) if (!(k in src)) ini && k in ini ? (dst[k] = ini[k]) : delete dst[k];
  for (const k of Object.keys(src)) if (src[k] !== undefined || !(k in dst) || typeof dst[k] !== 'function') dst[k] = src[k];
}
/* the unit / source / cycle models as the script loaded them (Reset takes them again: sheets.js anResetAll) */
const AN_STATE_INIT = anStateEnc(AN_STATE_OBJ(), new Map());
/* in place, down the tree: a key the run made goes, a value goes back; an object that was there at load stays the same object (others
   hold it: a copy in its place broke the CHECK cold start, the fans gave no air) */
function anStateInPlace(live, init) {
  for (const k of Object.keys(live)) if (!(k in init)) delete live[k];
  for (const k of Object.keys(init)) {
    const a = live[k],
      b = init[k];
    if (typeof a === 'function') continue;
    const plain = x => x && typeof x === 'object' && !ArrayBuffer.isView(x) && !(x instanceof Map) && !(x instanceof Set);
    if (plain(a) && plain(b) && Array.isArray(a) === Array.isArray(b)) {
      if (Array.isArray(a)) a.length = b.length;
      anStateInPlace(a, b);
    } else live[k] = b;
  }
}
function anStateReset() {
  const objs = AN_STATE_OBJ(),
    st = anStateDec(AN_STATE_INIT, objs);
  for (const k in objs) anStateInPlace(objs[k], st[k]);
}
/* the last values of the one-address groups (links.js shareExt); null = not built yet */
const anXsGet = () => (AN._xs ? AN._xs.g.map(l => l.map(e => (e.v === undefined ? 'u' : e.v))) : null);
function anXsPut(xs) {
  if (!xs) {
    AN._xs = null;
    return;
  }
  anXs().g.forEach((l, i) => l.forEach((e, j) => (e.v = xs[i] && xs[i][j] !== 'u' ? xs[i][j] : undefined)));
}
function anStateCapture() {
  const ref = anStateRefs(),
    sh = AN.sheets.map(s => {
      const S = s.S;
      if (!S) return null;
      const procs = [],
        mn = [];
      S.blk.forEach((b, j) => {
        if (b.proc) procs.push([j, b.proc]);
        if (b._mn !== undefined) mn.push([j, b._mn]);
      });
      return { rt: S.rt, look: S.look, xlk: S.xlk, plantT: S.plantT, _rem: S._rem, procs, mn };
    }),
    flags = {};
  for (const k of AN_STATE_FLAGS) flags[k] = AN[k];
  const sets = {};
  for (const k of AN_STATE_SETS) sets[k] = AN[k];
  /* AN.unit: the unit model once started (unit.js anUnitStart); AN.hmiDI / hmiComp: set by the first 150 MW load (hmi-op.js) */
  return anStateEnc({ map: anStateMap(), sh, obj: AN_STATE_OBJ(), flags, sets, u: AN.unit === AN_UNIT ? 1 : 0, h: AN.hmiDI === AN_HMI_DI ? 1 : 0, xs: anXsGet() }, ref);
}
function anStateApply(kf) {
  const objs = AN_STATE_OBJ(),
    m0 = kf && kf.$o && kf.$o.map ? anStateDec(kf.$o.map) : AN_STATE_V1.length ? { v: 1, sh: AN_STATE_V1.map(x => x[0]), sg: AN_STATE_V1.map(x => x[1]) } : null;
  AN_SM = m0 ? anStateRemap(m0) : null;
  AN.stWarn = AN_SM ? AN_SM.warn : [];
  AN.stFmt = m0 ? m0.v : 1;
  let st;
  try {
    st = anStateDec(kf, { obj: objs });
  } finally {
    var M = AN_SM;
    AN_SM = null;
  }
  st.sh.forEach((r, i) => {
    if (!r || (M && M.s[i] < 0)) return;
    const S = ensure(AN.sheets[M ? M.s[i] : i]);
    if (M && !M.ok[i]) {
      /* a changed drawing: the plant model and mode nets of each block found by its key, the sheet values are not taken */
      const J = j => (M.b[i] && M.b[i][j] >= 0 ? M.b[i][j] : -1);
      for (const [j, p] of r.procs) if (J(j) >= 0) S.blk[J(j)].proc = p;
      for (const [j, m] of r.mn) if (J(j) >= 0) S.blk[J(j)]._mn = m;
      return;
    }
    S.rt = r.rt;
    S.look = r.look;
    S.xlk = r.xlk;
    S.plantT = r.plantT;
    S._rem = r._rem;
    for (const [j, p] of r.procs) S.blk[j].proc = p;
    for (const [j, m] of r.mn) S.blk[j]._mn = m;
  });
  let ini = null;
  try {
    ini = anStateDec(AN_STATE_INIT, objs);
  } catch (e) {}
  for (const k in objs) if (st.obj[k]) anStateInto(objs[k], st.obj[k], ini && ini[k]);
  for (const k of AN_STATE_FLAGS) AN[k] = st.flags[k];
  for (const k of AN_STATE_SETS) AN[k] = st.sets[k];
  if (st.u) AN.unit = AN_UNIT;
  else delete AN.unit;
  if (st.h) (AN.hmiDI = AN_HMI_DI), (AN.hmiComp = hmiComp);
  else delete AN.hmiDI, delete AN.hmiComp;
  anXsPut(M ? null : st.xs); /* the one-address groups follow the sheet order: rebuilt when it changed */
  AN._asc = null; /* the step sets kept while a starting state loads */
  AN._gen = (AN._gen || 0) + 1; /* new objects (engine/sync.js refs) */
}
