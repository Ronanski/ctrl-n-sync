// beta.314 (JENNIE): the start "At 150 MW" (src/data/st150.txt) had both debris filter panels of DITL-39 NOT IN OPERATION, so in its
// 30 settling minutes S-1502 / S-1504 never flushed (DP 1,227 mmH2O at the start, above the 1,000 max of O&M L18-4). The vendor says
// the system "must be in operation when main cooling water is running" (L18-4 p40). This puts the two panels IN OPERATION and the
// filters just after a flush (dirt 0, cycle timer 0), the state the filter PLC keeps them in at steady load. Nothing else changes.
// Usage: node tools/steady150/df-on.cjs   (then node tools/build/build.js)
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const f = path.resolve(__dirname, '..', '..', 'src/data/st150.txt');
const o = JSON.parse(zlib.gunzipSync(Buffer.from(fs.readFileSync(f, 'utf8').trim(), 'base64')));
const e = o.kd.sh.find(x => /DITL-39$/.test(x.name));
if (!e) throw new Error('no DITL-39 in st150');
e.s._fd = { 0: { pos: 1, init: 0, acc: 0 }, 1: { pos: 1, init: 0, acc: 0 } };
e.s.usw = { 'FIDIR-DF1001': true, 'FIDIR-DF1002': true };
let n = 0;
const walk = x => {
  if (!x || typeof x !== 'object') return;
  for (const k of Object.keys(x)) {
    if (k === 'swDirt1' || k === 'swDirt2' || k === 'swCyc1' || k === 'swCyc2' || k === 'swHi1' || k === 'swHi2') { x[k] = 0; n++; }
    else walk(x[k]);
  }
};
walk(o.kf);
o.ver = String(o.ver).replace(/( df-on)?$/, ' df-on');
fs.writeFileSync(f, zlib.gzipSync(JSON.stringify(o), { level: 9 }).toString('base64'));
console.log('st150: DITL-39 panels in operation, filter keys set', n, o.ver);
