/* DITL (digital logic) - TCS sheets: the Interlock Block Diagram 310SC90-794 rev 2 as sheets of the Logic page, in the same viewer, sheet list and panel as DITL.
   The logic of a sheet is the netlist TCS_IBD_SHEETS (src/analog/engine/tcs-ibd-data.js), the one the engine runs (src/analog/engine/tcs-trip.js); its picture
   is the sheet typed from the drawing (src/digital/tce/IBD-*.js). A sheet reads the values of the engine scan (tcsSim). */
const tcsCat = id =>
  /^\d/.test(id)
    ? 'TYPICAL LOGIC'
    : {
        TA: 'TURBINE TRIP AND TESTS',
        TB: 'TURBINE PUMPS AND MOTORS',
        TC: 'TURBINE VALVES',
        TD: 'TURBINE ALARMS',
        TE: 'TURBINE GROUP CONTROL',
        GD: 'GENERATOR'
      }[id.slice(0, 2)] || 'OTHER';
const tcsWrap = (t, n) => {
  const L = [];
  let c = '';
  for (const w of String(t).split(' ')) {
    if (c && (c + ' ' + w).length > n) {
      L.push(c);
      c = w;
    } else c = c ? c + ' ' + w : w;
  }
  if (c) L.push(c);
  return L;
};
/* the logic part of an IBD sheet from the netlist: its gates (selected and traced like DITL gates), its input rows and outputs, the nets. The picture is
   always the typed sheet (src/digital/tce/IBD-*.js, tcsRetype): the app draws no IBD sheet of its own, and a gate or row gets its place from the typed
   block of its net (the place below is only the place of the netlist, used until then) */
function tcsSheet(q) {
  const K = 0.32,
    Y = y => 842 - y,
    PX = x => +(x * K).toFixed(2),
    PY = y => +(-y * K).toFixed(2),
    rows = [],
    cells = {},
    rb = [],
    src = [],
    outs = [],
    an = [],
    gates = [];
  const text = (t, x, y, h, a) => ({
    t,
    ix: PX(x),
    iy: PY(y),
    x: PX(x),
    y: PY(y),
    h: h || 2.05,
    r: 0,
    a: a || 0,
    b: 0,
    l: 'TXT1'
  });
  /* blocks */
  const B = [];
  q.g.forEach((g, gi) => {
    const [t, ins, out, x, gx, gy, gw, gh] = g;
    if (!gx) return; /* a gate the engine adds, not a block of the sheet */
    const not = t === 'NOT',
      w = not ? 16 : Math.max(gw || 28, 26),
      h = not ? 12 : Math.max(gh || 16, 16),
      bx = not ? gx - 8 : gx,
      by = not ? Y(gy) - 6 : Y(gy) - h;
    B.push({ t, gi, g, ins: ins.concat(t === 'FF' || t === 'WO' ? x : []), out, x: bx, y: by, w, h });
  });
  const use = new Map();
  B.forEach(b => b.ins.forEach(n => (use.get(n) || use.set(n, []).get(n)).push(b)));
  const driven = new Set(B.map(b => b.out));
  /* input rows: an input of the sheet, or a link that comes in */
  const lk = new Map(q.x.filter(x => x[3]).map(x => [x[0], x]));
  const rowIn = (net, name, ex, y, left, L) => {
    const i = rows.length,
      isA = (use.get(net) || []).length && use.get(net).every(b => /CMP|MID|FG|LS/.test(b.t)),
      sw = isA ? 46 : 12,
      lines = tcsWrap(name, Math.max(20, Math.floor(((ex - 3 - left) * K) / 1.13))),
      d = (lines.length * 7.5) / 2;
    cells[i + ':S'] = lines.map((l, k) => text(l, ex - 3, y + 2.5 + (k - (lines.length - 1) / 2) * 8, 2.05, 2));
    const vx = { S: [PX(left), PX(ex + sw)] };
    if (L) {
      cells[i + ':F'] = [text(L[2], L[4] + 13, y + 3, 2.05)];
      vx.F = [PX(L[4] - 10), PX(left - 1)];
    }
    rows.push({ n: i + 1, y: +(PY(y) - 1.2).toFixed(2), vx, tn: net });
    rb.push([+(PY(y) - d * K - 1).toFixed(2), +(PY(y) + d * K + 1).toFixed(2)]);
    src.push({ n: net, row: i });
    if (isA) an.push({ row: i, key: 'n' + net, label: name, unit: '', def: 0, net, g: [] });
  };
  q.i.forEach(i => i[2] != null && rowIn(i[0], i[1], i[2], Y(i[3]), i[4] || i[2] - 205, lk.get(i[0])));
  q.x.forEach(x => {
    if (!x[3] || x[4] == null || q.i.some(i => i[0] === x[0] && i[2] != null) || driven.has(x[0])) return;
    rowIn(x[0], 'From ' + x[2] + ' link ' + x[1], x[4] + 90, Y(x[5]), x[4] + 14, null);
  });
  /* outputs: a link that goes out */
  q.x.forEach(o => {
    if (o[3] || o[4] == null) return;
    const y = Y(o[5]),
      i = rows.length;
    cells[i + ':RT'] = [text(o[2], o[4], y + 20, 2.05, 1)];
    rows.push({ n: i + 1, y: +(PY(y) - 1.2).toFixed(2), vx: { RT: [PX(o[4] - 12), PX(o[4] + 30)] }, tn: o[0] });
    rb.push([+PY(y + 26).toFixed(2), +PY(y - 12).toFixed(2)]);
    outs.push({ n: o[0], row: i });
  });
  /* the gates of the netlist */
  B.forEach(b => {
    const { x, y, w, h, t, gi, g } = b,
      box = { x1: PX(x), x2: PX(x + w), y1: PY(y + h), y2: PY(y) },
      ex = g[3];
    const o = { box, miss: [], gi, out: [b.out], ins: g[1], t: t === 'A' ? 'AND' : t };
    if (t === 'FF') Object.assign(o, { s: g[1], r: ex, q: 0, ins: undefined, rt: true });
    else if (t === 'WO') o.r = ex;
    else if (t === 'CMP') {
      const c = Array.isArray(ex) ? ex : null;
      Object.assign(o, {
        cmp: c && !c[0] ? '<' : '>',
        eq: true,
        sp: c ? c[1] : 'the table of the sheet',
        unit: c ? ' ' + c[3] : '',
        c
      });
      const a = an.find(z => z.net === g[1][0]);
      if (a) {
        a.g.push(gates.length);
        if (c) a.unit = c[3];
      }
    } else if (t === 'DI' || t === 'DT' || t === 'PO') {
      const m = /^([0-9.]+) *(s|sec|min)/i.exec(String(ex || '')),
        k = t === 'DI' ? 'on' : t === 'DT' ? 'off' : 'pulse';
      Object.assign(o, {
        t: 'TMR',
        k,
        st: { acc: 0, out: 0, pre: 0, run: 0 },
        tm: {
          lab: k === 'on' ? 'ON DELAY' : k === 'off' ? 'OFF DELAY' : 'PULSE',
          key: 'T' + gi,
          tag: t,
          ax: (box.x1 + box.x2) / 2,
          ay: (box.y1 + box.y2) / 2,
          rr: (box.y2 - box.y1) / 2,
          bx1: box.x1,
          bx2: box.x2,
          nt: null,
          ut: null,
          fv: { v: m ? +m[1] : 0, u: m && /min/i.test(m[2]) ? 'MIN' : 'SEC' }
        }
      });
    }
    gates.push({ gt: o, box });
  });
  const NO = [0, 0];
  return {
    name: 'TCS-' + q.id,
    title: q.t,
    tcs: q.id,
    cat: tcsCat(q.id),
    meta: { dwg: (/^\d/.test(q.id) ? 'Typical ' : '') + q.id, title: q.t, no: q.sh },
    raw: { ln: [], pl: [], ci: [], ar: [], so: [], lamp: [] },
    tx: [],
    rows,
    rng: { F: NO, L: NO, T: NO, S: NO, RS: NO, RL: NO, RT: NO },
    vr: { F: NO, L: NO, T: NO, S: NO, RS: NO, RL: NO, RT: NO },
    rb,
    cells,
    sig: {},
    syms: [],
    lyr: '',
    bv: BV,
    sd: {
      tcs: 1,
      n: q.n,
      seg: [],
      gates,
      src,
      outs,
      term: [],
      dots: [],
      xcon: [],
      an,
      anl: [
        ...new Set(
          B.flatMap(b => (/CMP|MID|FG|LS/.test(b.t) ? b.ins.concat(/MID|FG|LS/.test(b.t) ? [b.out] : []) : []))
        )
      ]
    }
  };
}
/* the picture of an IBD sheet: the sheet typed like the drawing (src/digital/tce/IBD-*.js, format in 02d-tce.js) on the logic of the netlist: the gates, the input rows and the
   nets of the netlist stay (the logic, the trace and the values of the engine), the lines, words and symbols are the typed ones. Every typed source takes its
   IBD net number (q.nets); a gate takes the place of the typed block that gives its output net, an input row the place of the typed source of its net. */
function tcsRetype(s, q) {
  const p = tceSheet(q),
    src = p.sd.tce,
    nets = q.nets || {},
    map = [];
  let free = s.sd.n;
  for (const k in src) map[src[k]] = k in nets ? nets[k] : free++;
  const at = {};
  for (const k in p.sd.box) if (k in nets) at[nets[k]] = at[nets[k]] || p.sd.box[k];
  s.raw = p.raw;
  s.tx = p.tx;
  s.sd.seg = p.sd.seg.map(n => (n === undefined ? undefined : map[n]));
  s.sd.dots = p.sd.dots.map(d => ({ x: d.x, y: d.y, n: map[d.n] }));
  s.sd.n = free;
  for (const g of s.sd.gates) {
    const b = at[g.gt.out[0]];
    if (!b) continue;
    g.box = g.gt.box = b;
    if (g.gt.tm)
      Object.assign(g.gt.tm, {
        ax: (b.x1 + b.x2) / 2,
        ay: (b.y1 + b.y2) / 2,
        rr: (b.y2 - b.y1) / 2,
        bx1: b.x1,
        bx2: b.x2
      });
  }
  s.rows.forEach((r, i) => {
    const b = at[r.tn];
    if (!b) return;
    const c = r.vx && r.vx.RT ? 'RT' : 'S';
    r.y = +(b.y1 + (b.y2 - b.y1) / 2 - 1.2).toFixed(2);
    r.vx = { [c]: [b.x1, b.x2] };
    s.rb[i] = [b.y1, b.y2];
  });
  /* the cells of the built sheet are not drawn (their words are on the typed picture) */
  s.drw = 1;
  s.typed = q.id;
  return s;
}
/* the TCS sheets come after the DITL sheets; they are part of S.sheets, so the search, the viewer and the panel know them */
function tcsSheetsAdd() {
  const L = typeof AN !== 'undefined' && AN.tcsIbdSheets ? AN.tcsIbdSheets() : [];
  if (!L.length) return;
  const nm = S.sheets[S.cur] && S.sheets[S.cur].name,
    T = {};
  for (const q of TCE_SHEETS) if (q.ibd) T[q.ibd] = q;
  /* then the soft logic sheets of the TCS (02d-tce.js) */
  S.sheets = S.sheets
    .filter(x => !x.tcs)
    .concat(
      L.filter(q => T[q.id]).map(q => tcsRetype(tcsSheet(q), T[q.id])),
      TCE_SHEETS.filter(q => !q.ibd).map(tceSheet)
    );
  const i = S.sheets.findIndex(x => x.name === nm);
  if (i >= 0) S.cur = i;
}
/* an input of a TCS sheet is held in the engine: tcsTripFault (on = 1 / 0 / a value, null = back to the plant) */
const tcsHeld = (s, n) => {
  const st = AN.tcsIbd(s.tcs);
  return !!(st && st.fx && s.tcs + ':' + n in st.fx);
};
function tcsInput(s, n, on) {
  const q = AN.turbine('fault', { id: s.tcs, net: n, on });
  if (q) msg(q);
}
function tcsToggle(s, i) {
  const n = s.rows[i].tn;
  tcsInput(s, n, tcsHeld(s, n) ? null : !(s.nl._v && s.nl._v[n]));
}
const shFam = d => !!S.sheets[S.cur + d] && !!S.sheets[S.cur + d].tcs === !!S.sheets[S.cur].tcs;
/* the Logic tabs DITL and TCS: both show the DITL viewer, each comes back to its own last sheet */
if (typeof window !== 'undefined') {
  const last = { dig: null, tcs: 'TCS-TA-9' };
  window.LS_TCSV = {
    on: () => !!(S.sheets[S.cur] && S.sheets[S.cur].tcs),
    tab(c) {
      const s = S.sheets[S.cur],
        was = s && s.tcs ? 'tcs' : 'dig';
      if (!s || was === c) return;
      last[was] = s.name;
      const i = S.sheets.findIndex(x => (last[c] ? x.name === last[c] : !x.tcs));
      if (i >= 0) {
        S.cur = i;
        sel = null;
        render();
      }
    }
  };
}
/* a TCE soft logic sheet (02d-tce.js q.live): the values the engine holds (AN.tceRead), on the wires the sheet names; no gate of the sheet runs
   here (the TCS logic is the engine's, tcs.js: one logic) */
function tceRd(R, e) {
  const neg = e[0] === '!',
    [k, want] = (neg ? e.slice(1) : e).split('=');
  let x = R[k];
  if (want !== undefined) x = x != null && String(x) === want;
  return neg ? !x : x;
}
function tceSim(s) {
  const nl = s.nl,
    R = typeof AN !== 'undefined' && AN.tceRead ? AN.tceRead() : null,
    v = new Array(nl.n).fill(0);
  s.avw = {};
  if (R)
    for (const L of nl.tlv || []) {
      const x = tceRd(R, L.rd);
      if (!L.unit) v[L.n] = x ? 1 : 0;
      else if (x != null && isFinite(x)) s.avw[L.key] = +(+x).toFixed(Math.abs(x) < 100 ? 2 : 1);
    }
  nl._v = v;
  nl.avk = avOf(s);
  return { rowOn: new Set(), v, outOn: new Set() };
}
/* one sheet in RUN: the values of the engine's scan */
function tcsSim(s) {
  if (s.tce) return tceSim(s);
  const st = typeof AN !== 'undefined' && AN.tcsIbd ? AN.tcsIbd(s.tcs) : null,
    nl = s.nl,
    raw = (st && st.v) || [],
    v = new Array(nl.n).fill(0);
  for (let n = 0; n < nl.n; n++) v[n] = raw[n] > 0.5 ? 1 : 0;
  for (const n of nl.anl || []) v[n] = 0;
  nl._v = v;
  s.avw = {};
  for (const a of nl.an)
    if (isFinite(raw[a.net])) s.avw[a.key] = +(+raw[a.net]).toFixed(Math.abs(raw[a.net]) < 100 ? 2 : 1);
  nl.avk = avOf(s);
  const T = (st && st.t) || {};
  for (const g of nl.gates)
    if (g.t === 'TMR') {
      g.st.acc = T[s.tcs + ':' + g.gi] || 0;
      g.st.out = v[g.out[0]];
    }
  const rowOn = new Set(),
    outOn = new Set();
  for (const z of nl.src) if (v[z.n]) rowOn.add(z.row);
  for (const o of nl.outs) if (v[o.n]) outOn.add(o.row);
  return { rowOn, v, outOn };
}
