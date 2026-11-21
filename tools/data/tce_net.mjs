// The TCS soft logic sheets (src/digital/tce/*.js, format: src/digital/parts/02d-tce.js) as a netlist, from the drawing itself.
// Full Audit 3 item #4, step 1 (docs/tcs/SHEETS_AS_LOGIC_PLAN.md). Read only: it changes nothing in the app.
// usage: node tools/data/tce_net.mjs [--json out.json] [--sheet TCA520] [--list]
//
// How a net is found. The key of a wire piece is the part that gives its signal (a connector, constant, PI/O box, block, CRT push button or
// macro pin of the same sheet), so the key IS the net. What the net feeds is read from the last point of each piece, as on the drawing:
//   - on the left edge of a small block: an input of that block (ordered by height, top first); on its top or bottom edge: the side input
//     the drawing gives there (the time of a timer, the select of a switch);
//   - on a mark on the wire (BTR / FTR transfer, X crossed circle = inverted, NC circle of a NOT): the input of that mark; the pieces after the
//     mark carry the key of the mark;
//   - on the left edge of a macro block: the input pin at that height (the pin heights the sheet gives, or the drawing's even spacing);
//   - on an output connector, a CRT lamp, a definition (constant of kind 'def') or a PI/O box: an output of the sheet;
//   - at the start of, or on, another piece of the same key: the same net goes on (a gap for a mark of the drawing, or a junction).
// Anything else is "not named": it is printed with its sheet, key and point, so the drawing can be read again at that place.
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const dir = path.join(root, 'src/digital/tce');
const arg = k => {
  const i = process.argv.indexOf(k);
  return i > 0 ? process.argv[i + 1] : null;
};
const lib = fs.readFileSync(path.join(dir, '_lib.js'), 'utf8');
const sheets = [];
for (const f of fs
  .readdirSync(dir)
  .filter(f => /^TC[AE].*\.js$/.test(f))
  .sort()) {
  const win = {};
  vm.runInNewContext(lib + ';' + fs.readFileSync(path.join(dir, f), 'utf8'), { window: win });
  sheets.push(...(win.TCE_SHEETS || []));
}
const MARK = /^(o:BTR|o:FTR|X|NC)$/;
const near = (a, b, d) => Math.abs(a - b) <= d;
function netOf(s) {
  const u = (s.f[2] - s.f[0]) / 1000,
    tol = 2.2 * u;
  const blocks = [],
    marks = [];
  for (const b of s.b || []) {
    const [key, type, no, x, y, notes, pins, size] = b;
    if (MARK.test(type)) marks.push({ key, type, x, y, r: size ? size[0] : 5.25 * u });
    else {
      const w = size ? size[0] / 2 : 14 * u,
        h = size ? size[1] / 2 : 10.5 * u;
      blocks.push({ key, type, no, notes: notes || [], pins: pins || {}, x0: x - w, x1: x + w, y0: y - h, y1: y + h, ins: [] });
    }
  }
  const macros = (s.m || []).map(([key, name, tag, x, y, w, h, L, R, foot, notes, plain]) => ({
    key,
    type: 'M:' + name,
    tag,
    notes: notes || [],
    L: L || [],
    R: R || [],
    ly: plain ? plain[0] : null,
    x0: x,
    x1: x + w,
    y0: y,
    y1: y + h,
    ins: []
  }));
  const outs = [
    ...(s.c || []).filter(c => c[1] === 'out').map(c => ({ key: c[0], letter: c[2], sheets: c[6] || [], what: 'connector ' + c[2] + ' to ' + (c[6] || []).join(' '), x: c[3], y: c[4], d: 40 * u })),
    ...(s.d || []).filter(d => d[3] === 'out').map(d => ({ key: d[0], what: 'CRT lamp ' + (d[4] || ''), x: d[1], y: d[2], d: 40 * u })),
    ...(s.k || []).filter(k => k[5] === 'def').map(k => ({ key: k[0], what: 'definition ' + k[3], x: k[1], y: k[2], d: 12 * u }))
  ];
  const pio = (s.r || []).map(r => ({ key: r[0], x0: r[1], x1: r[1] + r[3], y0: r[2], y1: r[2] + r[4] }));
  const W = s.w || [];
  const inputs = (s.c || []).filter(c => c[1] === 'in').map(c => ({ key: c[0], letter: c[2], name: c[5], from: c[6] || [] }));
  const outc = (s.c || []).filter(c => c[1] === 'out').map(c => ({ key: c[0], letter: c[2], sheets: c[6] || [] }));
  const res = { id: s.id, inputs, outc, blocks, macros, marks: marks.map(m => ({ key: m.key, type: m.type, in: null })), outputs: [], open: [] };
  const mk = Object.fromEntries(res.marks.map(m => [m.key, m]));
  const onSeg = (p, v) =>
    v[1].some((a, i) => {
      if (!i) return false;
      const b = v[1][i - 1];
      return (
        (a[0] === b[0] && near(a[0], p[0], 0.6) && p[1] >= Math.min(a[1], b[1]) - 0.6 && p[1] <= Math.max(a[1], b[1]) + 0.6) ||
        (a[1] === b[1] && near(a[1], p[1], 0.6) && p[0] >= Math.min(a[0], b[0]) - 0.6 && p[0] <= Math.max(a[0], b[0]) + 0.6)
      );
    });
  for (const w of W) {
    const net = w[0],
      p = w[1][w[1].length - 1],
      q = w[1][w[1].length - 2];
    const left = q[0] < p[0],
      down = q[1] < p[1];
    let b = blocks.find(b => near(p[0], b.x0, tol) && p[1] >= b.y0 - tol && p[1] <= b.y1 + tol && left);
    if (b) {
      b.ins.push({ net, y: p[1], side: 'l' });
      continue;
    }
    b = blocks.find(b => p[0] >= b.x0 - tol && p[0] <= b.x1 + tol && ((down && near(p[1], b.y0, tol)) || (!down && near(p[1], b.y1, tol))));
    if (b) {
      b.ins.push({ net, x: p[0], side: down ? 't' : 'b' });
      continue;
    }
    const m = marks.find(m => Math.hypot(m.x - p[0], m.y - p[1]) <= m.r + tol);
    if (m) {
      mk[m.key].in = net;
      continue;
    }
    const M = macros.find(M => near(p[0], M.x0, tol) && p[1] >= M.y0 - tol && p[1] <= M.y1 + tol);
    if (M) {
      let pin = null;
      if (M.ly) {
        let best = 1e9;
        M.ly.forEach((y, i) => {
          if (Math.abs(y - p[1]) < best) (best = Math.abs(y - p[1])), (pin = i);
        });
      } else if (M.L.length) {
        const n = M.L.length,
          i = Math.floor(((p[1] - M.y0 - 15 * u) / (M.y1 - M.y0 - 30 * u)) * n);
        pin = Math.max(0, Math.min(n - 1, i));
      }
      M.ins.push({ net, y: p[1], pin, name: pin != null ? M.L[pin] : null });
      continue;
    }
    const o = outs.find(o => Math.hypot(o.x - p[0], o.y - p[1]) <= o.d);
    if (o) {
      res.outputs.push({ net, to: o.what, letter: o.letter, sheets: o.sheets });
      continue;
    }
    const r = pio.find(r => p[0] >= r.x0 - tol && p[0] <= r.x1 + tol && p[1] >= r.y0 - tol && p[1] <= r.y1 + tol);
    if (r) {
      res.outputs.push({ net, to: 'PI/O ' + r.key });
      continue;
    }
    if (W.some(v => v !== w && v[0] === net && (Math.hypot(v[1][0][0] - p[0], v[1][0][1] - p[1]) <= 20 * u || onSeg(p, v)))) continue;
    res.open.push({ net, at: p });
  }
  /* an X (crossed circle) on the last piece of a wire into a block: that input is taken inverted */
  for (const w of W) {
    const p = w[1][w[1].length - 1];
    for (const m of marks)
      if (m.type === 'X' && onSeg([m.x, m.y], w))
        for (const b of blocks) for (const i of b.ins) if (i.net === w[0] && i.y === p[1] && near(p[0], b.x0, tol)) i.inv = true;
  }
  for (const b of blocks) {
    b.ins.sort((a, c) => (a.side === c.side ? (a.y ?? a.x) - (c.y ?? c.x) : a.side < c.side ? -1 : 1));
    delete b.x0, delete b.x1, delete b.y0, delete b.y1;
  }
  for (const M of macros) {
    M.ins.sort((a, c) => a.y - c.y);
    delete M.x0, delete M.x1, delete M.y0, delete M.y1, delete M.ly;
  }
  return res;
}
const only = arg('--sheet');
/* an input connector [letter, from sheets] is fed by the output connector of the same letter on the sheet it names: the in-connector names both
   the sheet and the letter, so that is the link. The sheet list printed at the output connector is the drawing's cross reference only; where it
   is empty (not typed) or leaves this sheet out, the link still holds and the gap is listed as "list" so the drawing can be read again there.
   No output of that letter on the named sheet, or two of them, is "bad": the link cannot be made. */
function join(all) {
  const by = Object.fromEntries(all.map(n => [n.id, n]));
  let ok = 0, ext = 0;
  const bad = [], list = [];
  for (const n of all)
    for (const c of n.inputs) {
      const src = c.from.filter(f => by[f]);
      if (!src.length) { ext++; continue; }
      const hit = src.flatMap(f => by[f].outc.filter(o => o.letter === c.letter).map(o => [f, o]));
      const back = hit.filter(h => h[1].sheets.includes(n.id));
      const use = back.length ? back : hit;
      if (use.length !== 1) { bad.push(n.id + ' ' + c.letter + ' <- ' + src.join(' ') + (hit.length ? ' (' + hit.length + ' outputs of that letter)' : ' (no output of that letter)')); continue; }
      c.src = use[0][0] + ':' + use[0][1].key;
      ok++;
      if (!back.length) list.push(n.id + ' ' + c.letter + ' <- ' + use[0][0] + (use[0][1].sheets.length ? ' (its list: ' + use[0][1].sheets.join(' ') + ')' : ' (its list is not typed)'));
    }
  return { ok, ext, bad, list };
}
const nets = sheets.filter(s => !only || s.id === only).map(netOf);
const J = join(nets);
let ends = 0,
  open = 0,
  noIn = 0;
for (const n of nets) {
  open += n.open.length;
  noIn += n.blocks.filter(b => !b.ins.length && !/^SGW?$/.test(b.type)).length + n.macros.filter(m => !m.ins.length && m.L.length).length;
}
for (const s of sheets) ends += (s.w || []).length;
console.log(
  `TCS sheets ${nets.length}, wire pieces ${ends}: not named ${open}; blocks / macros with no input found ${noIn}` +
    ' (BTR / FTR / X marks sit on a wire and pass its signal; an SG signal generator has no input)'
);
console.log(`input connectors: ${J.ok} joined to the output of their sheet (${J.list.length} of them not in that output's sheet list), ${J.ext} from a part that is not a TCE / TCA sheet (IBD, DCS, G), ${J.bad.length} with no output to join`);
if (process.argv.includes('--list')) for (const b of J.bad) console.log('  join ' + b);
if (process.argv.includes('--list')) for (const b of J.list) console.log('  list ' + b);
if (process.argv.includes('--list'))
  for (const n of nets) for (const o of n.open) console.log('  ' + n.id + ' ' + o.net + ' at ' + o.at.join(','));
const out = arg('--json');
if (out) fs.writeFileSync(out, JSON.stringify(nets));
if (only) console.log(JSON.stringify(nets[0], null, 1).slice(0, 4000));
