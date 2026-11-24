/* Lane 3 (boiler links): every field row of src/world/field/boiler.js has the README row shape, names its source and relation, writes
   a tag of the I/O list at the station and address it gives, and no tag has two rows. */
const fs = require('fs'),
  path = require('path'),
  zlib = require('zlib');
const { laneData } = require('../../../tools/build/engine-bundle.js');
const root = path.resolve(__dirname, '..', '..', '..');
const w = {};
new Function('window', laneData())(w);
const F = w.FIELD;
const rows = F.rows.filter(r => r.lane === 'boiler');
/* the I/O list of the app (src/data/ades.txt: gzip + base64 JSON { station: { address: { tag, d, t } } }) */
const io = new Map();
const D = JSON.parse(zlib.gunzipSync(Buffer.from(fs.readFileSync(path.join(root, 'src', 'data', 'ades.txt'), 'utf8').trim(), 'base64')).toString('utf8'));
for (const [st, m] of Object.entries(D)) for (const [a, e] of Object.entries(m)) if (e && e.tag) io.set(String(e.tag).trim(), [+st, a]);
const bad = [],
  seen = new Set();
for (const r of rows) {
  const id = r.tag || JSON.stringify(r);
  if (!r.tag || !r.src || !r.rel || typeof r.v !== 'function') bad.push(id + ': tag / src / rel / v');
  if (!!r.ai === !!r.di) bad.push(id + ': one of ai or di');
  if (r.ai && !/^AI\d{4}$/.test(r.ai)) bad.push(id + ': ai format');
  if (seen.has(r.tag)) bad.push(id + ': two rows');
  seen.add(r.tag);
  const l = io.get(r.tag);
  if (!l) bad.push(id + ': not in the I/O list');
  else if (l[0] !== +r.stn || (r.ai && l[1] !== r.ai) || r.src.indexOf(l[1]) < 0) bad.push(id + ': I/O list says STN10' + l[0] + ' ' + l[1]);
}
console.log('boiler field rows: ' + rows.length + ', I/O list tags ' + io.size + ', problems ' + bad.length);
for (const b of bad.slice(0, 40)) console.log('  ' + b);
process.exit(bad.length || !rows.length || !io.size ? 1 : 0);
