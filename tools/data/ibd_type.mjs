// Types one sheet of the TCS Interlock Block Diagram (310SC90-794) into the TCE sheet format (src/digital/tce/IBD-<id>.js), the format of the
// ABC / DITL-standard TCE sheets: lines, gates, words and arrow heads at the positions of the vector drawing (straight lines, the direction of the
// drawing), live values from the one engine. Nets come from the app's own reader (tools/data/ibd_read.mjs) with the numbering of ibd_build.mjs, so
// they equal src/analog/engine/tcs-ibd-data.js; the tool stops with an error when the gates differ. The drawing itself never goes into the app.
// Two inputs, both made outside the repository from the vendor PDF (plant documents stay off the repository):
//   <page json dir>  p<n>.json of tools/data/ibd_extract.mjs        <geo dir>  p-<n>.json of tools/data/ibd_geo.cjs (+ optional fix-<n>.json)
// Usage: node tools/data/ibd_type.mjs <repo> <page json dir> <geo dir> <page | sheet id like TB-5 | group like TB> [--write]
//   prints the sheet, or with --write writes src/digital/tce/IBD-<id>.js and lists it in src/digital/order.list.
import fs from 'fs';
import vm from 'vm';
const [repo, jdir, gdir, want] = process.argv.slice(2),
  WRITE = process.argv.includes('--write');
const ctx0 = {};
vm.runInNewContext(fs.readFileSync(repo + '/src/analog/engine/tcs-ibd-data.js', 'utf8') + ';this.L=TCS_IBD_SHEETS', ctx0);
const pages = /^\d+$/.test(want) ? [+want] : ctx0.L.filter(q => q.id === want || q.id.startsWith(want + '-')).map(q => q.sh);
if (!pages.length) throw new Error('no IBD sheet ' + want);
if (pages.length > 1 || WRITE) {
  /* one child run per page, so each page starts clean */
  const { execFileSync } = await import('child_process');
  for (const p of pages) {
    const r = execFileSync(process.execPath, [process.argv[1], repo, jdir, gdir, String(p)], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });
    const id = /id: 'IBD-([^']+)'/.exec(r)[1];
    if (!WRITE) {
      console.log(r);
      continue;
    }
    fs.writeFileSync(repo + '/src/digital/tce/IBD-' + id + '.js', r);
    const ol = repo + '/src/digital/order.list',
      L = fs.readFileSync(ol, 'utf8').split('\n'),
      me = 'tce/IBD-' + id + '.js';
    if (!L.includes(me)) {
      let at = -1;
      L.forEach((l, i) => /^tce\/IBD-/.test(l) && (at = i));
      L.splice(at + 1, 0, me);
      fs.writeFileSync(ol, L.join('\n'));
    }
    console.log('wrote IBD-' + id + ' (page ' + p + ')');
  }
  process.exit(0);
}
const pg = pages[0];
const { readPage } = await import('file:///' + repo + '/tools/data/ibd_read.mjs');
const J = JSON.parse(fs.readFileSync(jdir + '/p' + pg + '.json', 'utf8')),
  G2 = JSON.parse(fs.readFileSync(gdir + '/p-' + pg + '.json', 'utf8')),
  R = readPage(J);
const ctx = {};
vm.runInNewContext(fs.readFileSync(repo + '/src/analog/engine/tcs-ibd-data.js', 'utf8') + ';this.L=TCS_IBD_SHEETS', ctx);
const Q = ctx.L.find(s => s.sh === pg);
if (!Q) throw new Error('no netlist for page ' + pg);
const S = 2296 / 1190.55,
  PX = x => +(x * S).toFixed(1),
  PY = y => +((842 - y) * S).toFixed(1);
/* the numbering of ibd_build.mjs */
const ids = new Map(),
  nn = n => (n == null ? -1 : ids.has(n) ? ids.get(n) : (ids.set(n, ids.size), ids.size - 1));
const Gs = [];
for (const g of R.gates) {
  if (g.bad) continue;
  if (g.t === 'R' && g.ff) continue;
  if (g.t === 'S' && g.r) {
    Gs.push(['FF', g.ins.map(nn), nn(g.out), g.r.ins.map(nn)]);
    continue;
  }
  if (g.t === 'S' || g.t === 'R') continue;
  Gs.push([g.t, g.ins.map(nn), nn(g.out), g.t === 'WO' ? [nn(g.wipe)] : 0]);
}
R.inputs.forEach(i => nn(i.net));
/* off-page circles (as ibd_build) */
const circ = [];
for (let i = 0; i + 3 < J.curves.length; i++) {
  const q = J.curves.slice(i, i + 4),
    l = Math.hypot(q[0][2] - q[0][0], q[0][3] - q[0][1]);
  if (l < 13 || l > 19 || Math.hypot(q[3][2] - q[0][0], q[3][3] - q[0][1]) > 0.6) continue;
  const xs = q.flatMap(o => [o[0], o[2]]),
    ys = q.flatMap(o => [o[1], o[3]]);
  circ.push({ cx: (Math.min(...xs) + Math.max(...xs)) / 2, cy: (Math.min(...ys) + Math.max(...ys)) / 2, r: (Math.max(...xs) - Math.min(...xs)) / 2 });
  i += 3;
}
const refs = [];
for (const c of circ) {
  const num = J.texts.find(t => Math.hypot(t.x + t.w / 2 - c.cx, t.y + t.h / 3 - c.cy) < c.r);
  const near = J.texts.filter(t => t.y < c.cy - c.r && c.cy - c.r - t.y < 26 && Math.abs(t.x + t.w / 2 - c.cx) < 45);
  const m = near.map(t => t.s.trim()).join(' ').match(/(T[A-E]|GD|G)-[0-9A-Z/\-T]*/g);
  if (!num || !m) continue;
  const ends = R.wireSegs.flatMap((s, i) => [[s[0], s[1], i], [s[2], s[3], i]]);
  const e = ends.filter(([x, y]) => Math.abs(Math.hypot(x - c.cx, y - c.cy) - c.r) < 8).sort((a, b) => Math.hypot(a[0] - c.cx, a[1] - c.cy) - Math.hypot(b[0] - c.cx, b[1] - c.cy))[0];
  if (!e) continue;
  const dep = e[0] > c.cx,
    box = dep ? R.inputs.find(i => Math.abs(i.y - c.cy) < 5 && i.x > c.cx && i.x - c.cx < 330) : null;
  refs.push({ net: box ? box.net : R.netOf[e[2]], x: c.cx, y: c.cy });
}
refs.forEach(r => nn(r.net));
/* the check: the gates of the netlist, net for net */
const same = JSON.stringify(Gs.map(g => g.slice(0, 4).map(v => (v === 0 ? 0 : v)))) === JSON.stringify(Q.g.map(g => [g[0], g[1], g[2], g[0] === 'FF' || g[0] === 'WO' ? g[3] : 0]));
const notes = [];
if (!same) throw new Error('page ' + pg + ': the gates differ from tcs-ibd-data');
if (ids.size !== Q.n) notes.push('net count ' + ids.size + ' vs ' + Q.n);
let free = Q.n;
const netNo = n => (ids.has(n) ? ids.get(n) : (ids.set(n, free++), free - 1));
/* per page: places where the drawing has words drawn as lines (typed here as words instead) */
const FX = fs.existsSync(gdir + '/fix-' + pg + '.json') ? JSON.parse(fs.readFileSync(gdir + '/fix-' + pg + '.json', 'utf8')) : { drop: [], t: [] };
const dropped = (x, y) => FX.drop.some(([a, b, c, d]) => x >= a && x <= c && y >= b && y <= d);
const inFrame = (x, y) => x > 142 && x < 2206 && y > 87.5 && y < 1537 && !(x > 1226 && y > 1276) && !dropped(x, y);
/* the wires */
const W = R.wireSegs.map((s, i) => [s, i]).filter(([s]) => inFrame(PX(s[0]), PY(s[1])) && inFrame(PX(s[2]), PY(s[3]))).map(([s, i]) => {
  const a = [PX(s[0]), PY(s[1])], b = [PX(s[2]), PY(s[3])];
  if (Math.abs(a[1] - b[1]) < 1) b[1] = a[1]; else if (Math.abs(a[0] - b[0]) < 1) b[0] = a[0];
  return { a, b, n: netNo(R.netOf[i]) };
});
/* the drawing of geo2 (page pixels): arrow heads, circles, dots, the other lines */
const segs = [],
  heads = [],
  circles = [],
  polys = [];
for (const p of G2.paths) {
  const s = p.s;
  if (!s.every(q => inFrame(q[0], q[1]) && inFrame(q[2], q[3]))) continue;
  const curve = s.some(q => q[4]),
    diag = q => !q[4] && Math.abs(q[0] - q[2]) > 0.6 && Math.abs(q[1] - q[3]) > 0.6;
  /* the red revision clouds (rows of small arcs) mark the changes of rev 2; they are no part of the logic */
  if (curve && s.length <= 2 && s.every(q => q[4] && Math.hypot(q[2] - q[0], q[3] - q[1]) < 16)) continue;
  if (curve) {
    if (s.length >= 4 && s.every(q => q[4])) {
      const xs = s.flatMap(q => [q[0], q[2]]),
        ys = s.flatMap(q => [q[1], q[3]]);
      const r = (Math.max(...xs) - Math.min(...xs)) / 2,
        ry = (Math.max(...ys) - Math.min(...ys)) / 2;
      if (Math.abs(r - ry) < 1.5 && s.length <= 8) circles.push({ x: +((Math.min(...xs) + Math.max(...xs)) / 2).toFixed(1), y: +((Math.min(...ys) + Math.max(...ys)) / 2).toFixed(1), r: +r.toFixed(2) });
      else notes.push('curve path skipped (' + s.length + ' pieces at ' + s[0][0] + ',' + s[0][1] + ')');
    } else notes.push('curve path skipped (' + s.length + ' pieces at ' + s[0][0] + ',' + s[0][1] + ')');
    continue;
  }
  const len = q => Math.hypot(q[2] - q[0], q[3] - q[1]);
  if (s.length === 2 && diag(s[0]) && diag(s[1]) && s[0][2] === s[1][0] && s[0][3] === s[1][1] && len(s[0]) > 9 && len(s[0]) < 19 && len(s[1]) > 9 && len(s[1]) < 19) {
    heads.push({ s, tip: [s[0][2], s[0][3]], from: [(s[0][0] + s[1][2]) / 2, (s[0][1] + s[1][3]) / 2] });
    continue;
  }
  if (s.some(diag)) {
    polys.push(s);
    continue;
  }
  for (const q of s) segs.push(Object.assign(q.slice(), { d: p.d ? 1 : 0 }));
}
/* a line of the drawing that is a wire (or a piece of one) is not drawn twice */
const onW = q =>
  W.some(w => {
    const h = Math.abs(q[1] - q[3]) < 0.6;
    if (h !== (Math.abs(w.a[1] - w.b[1]) < 0.6)) return false;
    const c = h ? Math.abs(q[1] - w.a[1]) < 1.2 : Math.abs(q[0] - w.a[0]) < 1.2;
    if (!c) return false;
    const [lo, hi] = h ? [Math.min(w.a[0], w.b[0]), Math.max(w.a[0], w.b[0])] : [Math.min(w.a[1], w.b[1]), Math.max(w.a[1], w.b[1])];
    const [a, b] = h ? [Math.min(q[0], q[2]), Math.max(q[0], q[2])] : [Math.min(q[1], q[3]), Math.max(q[1], q[3])];
    return a >= lo - 1.5 && b <= hi + 1.5;
  });
/* gate boxes */
const B = [],
  used = new Set();
const gk = new Map();
R.gates.forEach((g, gi) => {
  if (g.bad || g.t === 'NOT' || g.t === 'WO') return;
  const x0 = PX(g.x0),
    x1 = PX(g.x1),
    by0 = PY(g.by1),
    by1 = PY(g.by0),
    y0 = PY(g.y1),
    y1 = PY(g.y0);
  const out = g.out != null && ids.has(g.out) && !(g.t === 'R' && g.ff) ? ids.get(g.out) : null;
  let key = out != null && !gk.has(out) ? 's' + out : 'g' + gi;
  if (out != null && !gk.has(out)) gk.set(out, key);
  B.push([key, 'G:', '', +((x0 + x1) / 2).toFixed(2), +((by0 + by1) / 2).toFixed(2), [], {}, [+(x1 - x0).toFixed(1), +(by1 - by0).toFixed(1), +(y1 - y0).toFixed(1)]]);
  used.add(key);
});
/* the box lines of the gates are drawn by the gate */
const gateLine = q =>
  B.some(b => {
    const [w, h, bar] = b[7],
      x0 = b[3] - w / 2,
      x1 = b[3] + w / 2,
      y0 = b[4] - h / 2,
      y1 = b[4] + h / 2,
      H = Math.abs(q[1] - q[3]) < 0.6;
    if (H) return (Math.abs(q[1] - y0) < 1.2 || Math.abs(q[1] - y1) < 1.2) && Math.min(q[0], q[2]) > x0 - 1.5 && Math.max(q[0], q[2]) < x1 + 1.5;
    return (Math.abs(q[0] - x0) < 1.2 || Math.abs(q[0] - x1) < 1.2) && Math.min(q[1], q[3]) > b[4] - Math.max(h, bar) / 2 - 1.5 && Math.max(q[1], q[3]) < b[4] + Math.max(h, bar) / 2 + 1.5;
  });
/* NOT circles: keyed by their output net */
const NC = [];
for (const g of R.gates.filter(g => g.t === 'NOT')) {
  const cx = PX(g.x0),
    cy = PY(g.y0),
    c = circles.find(c => Math.hypot(c.x - cx, c.y - cy) < 3);
  const out = ids.has(g.out) ? ids.get(g.out) : null;
  const key = out != null && !gk.has(out) ? 's' + out : 'nc' + NC.length;
  if (out != null && !gk.has(out)) gk.set(out, key);
  NC.push([key, 'NC', '', c ? c.x : cx, c ? c.y : cy, [], {}, [c ? c.r : 10.85]]);
  if (c) c.used = 1;
}
/* junction dots */
const J2 = circles.filter(c => c.r < 5).map(c => ((c.used = 1), [c.x, c.y]));
const O = circles.filter(c => !c.used).map(c => [c.x, c.y, c.r]);
/* sources of the nets nothing on the sheet drives: an invisible area at the start of the line (the input switch of the row) */
const SA = [];
const srcOf = new Map();
for (const w of W) {
  if (gk.has(w.n) || srcOf.has(w.n)) continue;
  const L = W.filter(v => v.n === w.n).flatMap(v => [v.a, v.b]).sort((p, q) => p[0] - q[0])[0];
  const inp = R.inputs.find(i => ids.get(i.net) === w.n);
  const x0 = inp && inp.bx != null ? PX(inp.bx) - 30 : L[0] - 60;
  const key = 's' + w.n;
  srcOf.set(w.n, key);
  SA.push([key, +x0.toFixed(1), +(L[1] - 26).toFixed(1), L[0], +(L[1] + 26).toFixed(1)]);
}
const keyOf = n => gk.get(n) || srcOf.get(n);
/* wires, an arrow head at the end it has one */
const isTip = (p, t) => Math.abs(p[0] - t[0]) < 1.2 && Math.abs(p[1] - t[1]) < 1.2;
const usedHead = new Set();
const wires = W.map(w => {
  let a = w.a,
    b = w.b,
    arw = 0;
  const ha = heads.findIndex(h => isTip(a, h.tip)),
    hb = heads.findIndex(h => isTip(b, h.tip));
  if (hb >= 0) (arw = 1), usedHead.add(hb);
  else if (ha >= 0) ([a, b] = [b, a]), (arw = 1), usedHead.add(ha);
  const h = Math.abs(a[1] - b[1]) < 0.6,
    lo = h ? Math.min(a[0], b[0]) : Math.min(a[1], b[1]),
    hi = h ? Math.max(a[0], b[0]) : Math.max(a[1], b[1]);
  /* a dashed line of the drawing is a row of short pieces with gaps (or a path drawn dashed) */
  let cov = 0,
    n = 0,
    sd = 0;
  for (const q of segs) {
    if ((Math.abs(q[1] - q[3]) < 0.6) !== h) continue;
    if (h ? Math.abs(q[1] - a[1]) > 1.2 : Math.abs(q[0] - a[0]) > 1.2) continue;
    const x0 = Math.max(lo, h ? Math.min(q[0], q[2]) : Math.min(q[1], q[3])),
      x1 = Math.min(hi, h ? Math.max(q[0], q[2]) : Math.max(q[1], q[3]));
    if (x1 > x0) (cov += x1 - x0), n++, q.d && (sd += x1 - x0);
  }
  const dash = hi > lo && (sd > 0.5 * (hi - lo) || (n >= 2 && cov < 0.85 * (hi - lo) && cov / n < 26 && cov > 0.4 * (hi - lo))) ? 1 : 0;
  return dash ? [keyOf(w.n), [a, b], 0, arw, 1] : [keyOf(w.n), [a, b], 0, arw];
});
/* the other lines of the drawing: tables, boxes, marks; a mark with a head is a note arrow */
const L = [],
  E = [],
  A = [];
for (const q of segs) {
  if (onW(q) || gateLine(q)) continue;
  const a = [q[0], q[1]],
    b = [q[2], q[3]];
  const ha = heads.findIndex((h, i) => !usedHead.has(i) && isTip(a, h.tip)),
    hb = heads.findIndex((h, i) => !usedHead.has(i) && isTip(b, h.tip));
  if (hb >= 0) A.push([a, b]), usedHead.add(hb);
  else if (ha >= 0) A.push([b, a]), usedHead.add(ha);
  else {
    if (Math.abs(a[1] - b[1]) < 0.6) b[1] = a[1]; else b[0] = a[0];
    (q.d ? E : L).push([a, b]);
  }
}
const loneHeads = heads.filter((h, i) => !usedHead.has(i));
/* hexagons and other slanted outlines */
const P = [], V = loneHeads.map(h => [[h.s[0][0], h.s[0][1]], [h.s[0][2], h.s[0][3]], [h.s[1][2], h.s[1][3]]]);
for (const s of polys) {
  const pts = s.map(q => [q[0], q[1]]), e = [s[s.length - 1][2], s[s.length - 1][3]];
  if (Math.abs(e[0] - pts[0][0]) < 0.3 && Math.abs(e[1] - pts[0][1]) < 0.3) P.push(pts);
  else V.push(pts.concat([e]));
}
/* the words (not the title block) */
/* a font whose codes are shifted: seen by a control character, or by the shifted codes of the comparison signs (a page whose shifted
   words are only ON / OFF with their sign, as TD-4, has no control character) */
const shifted = new Set(G2.words.filter(w => w[4] && /[\x00-\x1f\u04ca\u04cc\u04cd]/.test(w[0])).map(w => w[4]));
const SP = { 0x20: '(', 0x4ca: '≤', 0x6b9: '△', 0x72: '\u00b0', 0x74: '\u00b2', 0x4cc: '\u2266', 0x4cd: '\u2267', 0x3a5: '\u2103', 0x3e38: ':' };
const unshift = t => {
  let r = [...t].map(c => { const k = c.charCodeAt(0); return SP[k] || (k + 29 < 127 ? String.fromCharCode(k + 29) : c); }).join('');
  if (r.includes('(') && !r.includes(')')) r += ')';
  return r;
};
const STD = (() => {
  const c = {};
  G2.words.forEach(w => w[6] && (c[w[6]] = (c[w[6]] || 0) + w[0].length));
  return +Object.entries(c).sort((a, b) => b[1] - a[1])[0]?.[0] || 0;
})();
const T = G2.words
  .filter(w => inFrame(w[1], w[2]) && !/MITSUBISHI|Engineering Headquarters|^(ADDED|DELETED)$/.test(w[0]))
  .map(w => {
    const t = shifted.has(w[4]) ? unshift(w[0]) : w[0];
    if (shifted.has(w[4])) notes.push('font word: ' + t);
    /* words printed smaller than the common size keep their size */
    const h = w[6] && w[6] < 0.95 * STD ? +((2.05 * w[6]) / STD).toFixed(2) : 0;
    return w[5] ? [w[1], w[2], t, 0, h, -w[5]] : h ? [w[1], w[2], t, 0, h] : [w[1], w[2], t];
  })
  .concat(FX.t);
const nets = {};
for (const [n, k] of gk) if (n < Q.n) nets[k] = n;
for (const [n, k] of srcOf) if (n < Q.n) nets[k] = n;
const J5 = v => JSON.stringify(v).replace(/"/g, "'");
const out = [];
out.push('/* IBD ' + (/^\d/.test(Q.id) ? 'typical ' : '') + Q.id + ' ' + Q.t + ' (Interlock Block Diagram 310SC90-794 rev 2, page ' + pg + '). Typed from the drawing; units = the');
out.push('   pixels of the page rendered 2296 wide. It takes the place of the sheet built from the netlist (02c-tcs.js), the net numbers are the ones of that netlist. */');
out.push("(typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({");
out.push("  id: 'IBD-" + Q.id + "',\n  ibd: '" + Q.id + "',\n  title: " + J5(Q.t) + ',\n  page: ' + pg + ',\n  f: [141.5, 86.8, 2206.6, 1537.9],\n  fs: 1.38,\n  ah: 6.6,');
out.push('  nets: ' + J5(nets) + ',');
const list = (name, a) => out.push('  ' + name + ': [\n' + a.map(x => '    ' + J5(x)).join(',\n') + '\n  ],');
list('s', SA);
list('b', B.concat(NC));
list('o', O);
list('j', J2);
list('p', P);
list('v', V);
list('l', L);
if (E.length) list('e', E);
list('a', A);
list('w', wires);
list('t', T);
out[out.length - 1] = out[out.length - 1].replace(/,$/, '');
out.push('});');
console.log(out.join('\n'));
console.error('page ' + pg + ' IBD-' + Q.id + ':', notes.filter(n => !/^font word/.test(n)).join('; ') || 'ok', '| nets', Q.n, 'gates', Gs.length, 'wires', W.length, 'lines', L.length, 'arrows', A.length, 'polys', P.length, 'circles', O.length, 'dots', J2.length);
