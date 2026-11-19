// Checks the TCS soft logic sheets typed in src/digital/tce/*.js (format: src/digital/parts/02d-tce.js).
// usage: node tools/data/tce_check.mjs        exit 1 when a sheet breaks a rule
// Rules:
//   - id, title, page, ctl, cycle and the frame f are there; the id is unique and equals the file name;
//   - every key of a sheet is unique;
//   - a wire is made of horizontal and vertical pieces only (no slanted line, no curve), and has at least two points;
//   - the source of a wire is a connector, a constant, a PI/O box, a small block or an output pin of a macro block of the sheet;
//   - every sheet is listed in src/digital/order.list before parts/02d-tce.js.
// A connector that names a sheet which is not typed yet is a note, not an error.
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..'),
  dir = path.join(root, 'src/digital/tce'),
  files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.js') && f[0] !== '_').sort() : [],
  /* the helpers of the sheets (tce/_lib.js) run before each sheet, as in the app */
  lib = fs.existsSync(path.join(dir, '_lib.js')) ? fs.readFileSync(path.join(dir, '_lib.js'), 'utf8') : '',
  order = fs.readFileSync(path.join(root, 'src/digital/order.list'), 'utf8').split(/\r?\n/).map(s => s.trim()),
  at = order.indexOf('parts/02d-tce.js');
const errs = [],
  notes = [],
  all = [];
for (const f of files) {
  const win = {};
  try {
    vm.runInNewContext(lib + ';' + fs.readFileSync(path.join(dir, f), 'utf8'), { window: win });
  } catch (e) {
    errs.push(f + ': does not run: ' + e.message);
    continue;
  }
  const L = win.TCE_SHEETS || [];
  if (L.length !== 1) errs.push(f + ': one sheet per file, found ' + L.length);
  const i = order.indexOf('tce/' + f);
  if (i < 0 || i > at) errs.push(f + ': not in src/digital/order.list before parts/02d-tce.js');
  for (const q of L) {
    const E = m => errs.push(q.id + ': ' + m);
    all.push(q.id);
    if (q.id + '.js' !== f) E('the file is named ' + f);
    for (const k of ['id', 'title', 'page', 'ctl', 'cycle']) if (q[k] == null || q[k] === '') E('no ' + k);
    if (!Array.isArray(q.f) || q.f.length !== 4 || !(q.f[2] > q.f[0]) || !(q.f[3] > q.f[1])) E('the frame f is not [x0, y0, x1, y1]');
    const keys = new Set(),
      add = k => (keys.has(k) ? E('key twice: ' + k) : keys.add(k));
    for (const c of q.c || []) {
      add(c[0]);
      if (c[1] !== 'in' && c[1] !== 'out') E('connector ' + c[0] + ': in or out');
    }
    for (const k of q.k || []) add(k[0]);
    for (const b of q.b || []) add(b[0]);
    for (const r of q.r || []) add(r[0]);
    for (const d of q.d || []) {
      add(d[0]);
      if (d[3] !== 'in' && d[3] !== 'out') E('CRT diamond ' + d[0] + ': in or out');
    }
    for (const [a, b] of q.l || []) if (!a || !b || (a[0] !== b[0] && a[1] !== b[1])) E('a plain line is not horizontal or vertical: ' + JSON.stringify([a, b]));
    for (const [a, b] of q.e || []) if (!a || !b || (a[0] !== b[0] && a[1] !== b[1])) E('a dashed line is not horizontal or vertical: ' + JSON.stringify([a, b]));
    for (const [a, b] of q.a || []) if (!a || !b || a.length !== 2 || b.length !== 2) E('a note arrow is not [[x1, y1], [x2, y2]]');
    for (const m of q.m || []) {
      add(m[0]);
      for (const p of m[8] || []) if (p) keys.add(m[0] + '.' + p);
    }
    (q.w || []).forEach((w, n) => {
      const [from, P] = w,
        name = 'wire ' + (n + 1) + ' (' + from + ')';
      if (!keys.has(from)) E(name + ': the source is not a key of the sheet');
      if (!Array.isArray(P) || P.length < 2) return E(name + ': fewer than two points');
      for (let j = 1; j < P.length; j++) {
        const [a, b] = [P[j - 1], P[j]];
        if (a[0] !== b[0] && a[1] !== b[1]) E(name + ': the piece ' + JSON.stringify(a) + ' to ' + JSON.stringify(b) + ' is not horizontal or vertical');
        if (a[0] === b[0] && a[1] === b[1]) E(name + ': the same point twice ' + JSON.stringify(a));
      }
    });
    for (const k in q.live || {}) if (!keys.has(k)) E('live: ' + k + ' is not a key of the sheet');
  }
}
if (new Set(all).size !== all.length) errs.push('a sheet id is typed twice');
for (const f of files) {
  const win = {};
  try {
    vm.runInNewContext(lib + ';' + fs.readFileSync(path.join(dir, f), 'utf8'), { window: win });
  } catch (e) {
    continue;
  }
  for (const q of win.TCE_SHEETS || [])
    for (const c of q.c || []) for (const r of c[6] || []) if (/^TC[AE]\d/.test(r) && !all.includes(r)) notes.push(q.id + ' ' + c[2] + ' -> ' + r);
}
console.log('TCS soft logic sheets: ' + all.length + ' (' + all.join(', ') + ')');
if (notes.length) console.log('links to sheets not typed yet: ' + notes.length);
if (errs.length) {
  console.error(errs.join('\n'));
  process.exit(1);
}
console.log('OK: every wire is straight, every key and source is right');
