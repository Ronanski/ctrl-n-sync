/* Phase 11 port file check (src/analog/engine/ports.js, the ONE list of what flows between the 7 model parts).
   - every port has one writer that is a part, readers that are parts, variables from the unit list, a design value only on its own
     variables and with a document named;
   - the design values of ports.js equal the Part 1 targets / design curves where both name the same quantity (one number, one source);
   - no part writes a port it does not own: every anPortSet(U, 'id' ...) call in src/analog/engine is in the file of a part that owns
     that id, by the file -> part map below (a new part file is added to the map with its owner);
   - ports.js is loaded right after engine/steam.js in src/analog/order.list, before every part file.
   Usage: node tests/lanes/model/ports.cjs */
const fs = require('fs'),
  path = require('path');
const root = path.resolve(__dirname, '..', '..', '..');
const { AN_PORTS } = require(path.join(root, 'src/analog/engine/ports.js'));
let bad = 0;
const fail = m => (bad++, console.log('  FAIL ' + m));
const P = Object.keys(AN_PORTS.parts),
  U = Object.keys(AN_PORTS.units).concat(['x']);
for (const [id, p] of Object.entries(AN_PORTS.list)) {
  if (!P.includes(p.by)) fail(id + ': writer ' + p.by + ' is not a part');
  for (const r of p.to || []) if (!P.includes(r)) fail(id + ': reader ' + r + ' is not a part');
  if ((p.to || []).includes(p.by)) fail(id + ': the writer is also a reader');
  for (const v of p.v || []) if (!U.includes(v)) fail(id + ': variable ' + v + ' has no unit');
  const d = p.d150 || {};
  for (const k of Object.keys(d)) {
    if (!(p.v || []).includes(k)) fail(id + ': design value ' + k + ' is not a variable of the port');
    if (d[k] != null && !p.src) fail(id + ': design value ' + k + ' = ' + d[k] + ' has no document (src)');
  }
  if (p.io && !['in', 'out'].includes(p.io)) fail(id + ': io must be in or out');
}
/* the same quantity, the same number: Part 1 targets (150 MW column) */
const PT = JSON.parse(fs.readFileSync(path.join(root, 'docs/accept/part1-targets.json'), 'utf8')),
  t150 = {};
for (const r of PT.rows) if (Array.isArray(r.t)) t150[r.key] = r.t[2];
const same = [
  ['gen', 'W', 150],
  ['coal.feed', 'm', 89.5],
  ['fw.eco_in', 'T', 245.4],
  ['crh.rh_in', 'P', 38.64],
  ['hrh', 'P', 34.77]
];
for (const [id, k, v] of same) {
  const d = (AN_PORTS.list[id].d150 || {})[k];
  if (d !== v) fail(id + '.' + k + ' design ' + d + ' is not the Part 1 / HB value ' + v);
}
/* one writer: anPortSet calls only in a file of the owner */
const OWN = {
  'engine/ports.js': null,
  'engine/cfb.js': 'AOI',
  'engine/fw.js': 'NANA',
  'engine/turbine.js': 'RIN',
  'engine/model/drum-sh.js': 'KANA'
};
const eng = path.join(root, 'src/analog/engine');
const walk = d =>
  fs.readdirSync(d).flatMap(f => {
    const q = path.join(d, f);
    return fs.statSync(q).isDirectory() ? walk(q) : /\.js$/.test(f) ? [q] : [];
  });
let calls = 0;
for (const f of walk(eng)) {
  const rel = path.relative(path.join(root, 'src/analog'), f).split(path.sep).join('/'),
    t = fs.readFileSync(f, 'utf8'),
    re = /anPortSet\(\s*[\w.]+\s*,\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(t))) {
    if (rel === 'engine/ports.js') continue;
    calls++;
    const id = m[1],
      p = AN_PORTS.list[id];
    if (!p && !/^(store|q)\./.test(id)) fail(rel + ' writes ' + id + ', which is not in ports.js');
    const owner = p ? p.by : id.split('.').slice(-1)[0];
    const mine = OWN[rel] !== undefined ? OWN[rel] : rel.startsWith('engine/model/') ? null : 'legacy';
    if (mine !== 'legacy' && mine !== owner) fail(rel + ' writes ' + id + ' but the port belongs to ' + owner + ' (file of ' + mine + ')');
  }
}
/* load order */
const ord = fs.readFileSync(path.join(root, 'src/analog/order.list'), 'utf8').split(/\r?\n/).map(s => s.trim()),
  iS = ord.indexOf('engine/steam.js'),
  iP = ord.indexOf('engine/ports.js');
if (iP !== iS + 1) fail('order.list: engine/ports.js must come right after engine/steam.js');
for (const f of Object.keys(OWN)) if (f !== 'engine/ports.js' && ord.includes(f) && ord.indexOf(f) < iP) fail('order.list: ' + f + ' is loaded before ports.js');
const n = Object.keys(AN_PORTS.list).length;
console.log((bad ? 'FAIL' : 'PASS') + ' model ports: ' + n + ' ports, ' + P.length + ' parts, ' + calls + ' anPortSet calls in the part files');
process.exit(bad ? 1 : 0);
