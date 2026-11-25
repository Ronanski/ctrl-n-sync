/* lane 4 (DCS LINKS BOP): the field rows of src/world/field/bop.js keep the row shape of src/world/field/README.md, every row names its
   source, an I/O address and a tag have one row only, the address and tag match the DCS I/O list (src/ui/plant/wiring.js), and no fixed
   snapshot value of hmi-op.js stays on an address a row now gives (one source per tag). */
const fs = require('fs'),
  path = require('path');
const root = path.resolve(__dirname, '..', '..', '..');
const { laneData } = require(path.join(root, 'tools', 'build', 'engine-bundle.js'));
const w = {};
new Function('window', laneData())(w);
const rows = w.FIELD.rows.filter(r => r.lane === 'bop');
const io = {};
new Function('window', fs.readFileSync(path.join(root, 'src', 'ui', 'plant', 'wiring.js'), 'utf8'))(io);
const IO = new Map(io.WIRING.map(r => [r[1] + '|' + r[2], r[3]]));
const hmi = fs.readFileSync(path.join(root, 'src', 'analog', 'engine', 'hmi-op.js'), 'utf8');
const bad = [],
  seenA = new Set(),
  seenT = new Set();
for (const r of rows) {
  const id = r.tag + ' ' + (r.ai ? r.stn + '|' + r.ai : 'DI');
  if (typeof r.v !== 'function') bad.push(id + ': no v');
  if (!r.src || !r.rel) bad.push(id + ': no src / rel');
  if (!r.tag || !(r.stn >= 1 && r.stn <= 5)) bad.push(id + ': tag / stn');
  if (!!r.ai === !!r.di) bad.push(id + ': one of ai / di');
  if (seenT.has(r.tag)) bad.push(id + ': tag twice');
  seenT.add(r.tag);
  if (r.ai) {
    const k = r.stn + '|' + r.ai;
    if (seenA.has(k)) bad.push(id + ': address twice');
    seenA.add(k);
    if (IO.get(k) !== r.tag) bad.push(id + ': I/O list has ' + JSON.stringify(IO.get(k)));
    if (hmi.includes("'" + k + "':")) bad.push(id + ': fixed value still in hmi-op.js');
  }
}
console.log('lane 4 field rows: ' + rows.length + ', problems ' + bad.length);
for (const b of bad) console.log('  ' + b);
process.exit(bad.length || !rows.length ? 1 : 0);
