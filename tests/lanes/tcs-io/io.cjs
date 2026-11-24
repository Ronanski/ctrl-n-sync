/* Lane 2 TCS IO: the TCS I/O list in the app and its binding (src/data/tcs-io.json, src/digital/tce-io.js, src/data/tcs-dcs.json).
   Headless, no page. Usage: node tests/lanes/tcs-io/io.cjs
   1. src/data/tcs-io.json is the list the table sheets give (tools/data/tcs_io.mjs --check)
   2. every used PI/O table row has a sheet pin and an end (model / dcs / ibd / sys / fault / out / needs)
   3. every DCS I/O list point of src/data/tcs-dcs.json rows is in src/data/ades.txt with the same tag, and its TCS end exists
   4. the turbine Modbus list: 227 + 25 rows, each with an end; SPARE only for a row with no tag and no description
   5. every PI/O port of the TCS sheet program (tests/tce/sheets.cjs --list) is a table row, except the boxes named in READER below
   6. every read of an end runs on an empty plant without an exception */
'use strict';
const fs = require('fs'),
  path = require('path'),
  zlib = require('zlib'),
  cp = require('child_process');
const R = path.resolve(__dirname, '..', '..', '..'),
  P = f => path.join(R, f);
let bad = 0;
const ok = (c, m) => {
  if (!c) bad++;
  console.log((c ? 'PASS ' : 'FAIL ') + m);
};
const node = a => cp.spawnSync(process.execPath, a, { cwd: R, encoding: 'utf8', maxBuffer: 64 << 20 });

/* 1 */
const chk = node([P('tools/data/tcs_io.mjs'), '--check']);
ok(
  chk.status === 0,
  'tcs-io.json = the PI/O table sheets (' + (chk.stdout || chk.stderr).trim().split('\n').pop() + ')'
);

const io = JSON.parse(fs.readFileSync(P('src/data/tcs-io.json'), 'utf8'));
require(P('src/digital/tce-io.js'));
const X = globalThis.TCE_IO.make(io);
/* 2 */
const used = io.rows.filter(r => !r.spare);
const noPin = used.filter(r => !r.pin || !r.pin.length).map(r => r.id);
const noEnd = used.filter(r => X.end(r.id).kind === 'none').map(r => r.id);
ok(io.rows.length === 784 && used.length === 507, 'table rows ' + io.rows.length + ', used ' + used.length);
ok(
  !noPin.length,
  'used rows without a sheet pin: ' + noPin.length + (noPin.length ? ' ' + noPin.slice(0, 10).join(' ') : '')
);
ok(
  !noEnd.length,
  'used rows without an end: ' + noEnd.length + (noEnd.length ? ' ' + noEnd.slice(0, 10).join(' ') : '')
);
const E = globalThis.TCE_IO.ends,
  ids = new Set(E.map(e => e[0]));
ok(ids.size === E.length, 'no row has two ends in tce-io.js');
const unk = [...ids].filter(id => !X.row(id));
ok(!unk.length, 'every end of tce-io.js is a table row' + (unk.length ? ': ' + unk.join(' ') : ''));

/* 3 */
const ades = JSON.parse(zlib.gunzipSync(Buffer.from(fs.readFileSync(P('src/data/ades.txt'), 'utf8').trim(), 'base64')));
const bind = JSON.parse(fs.readFileSync(P('src/data/tcs-dcs.json'), 'utf8'));
const badRow = bind.rows.filter(q => {
  const a = ades[q.stn] && ades[q.stn][q.addr];
  if (!a || a.tag !== q.tag) return true;
  if (/^TC[AE]9\d\d-\d+$/.test(q.to)) return !X.row(q.to);
  return !/^(IBD:T[A-E]-\d+(#\d+)?|MOD:|GCP:|GPP:)/.test(q.to);
});
ok(
  bind.rows.length === 68 && !badRow.length,
  'DCS points bound ' +
    bind.rows.length +
    ', not in the DCS I/O list or with no TCS end: ' +
    badRow.map(q => q.stn + ' ' + q.addr).join(' ')
);
let tcsTagged = 0;
for (const st in ades)
  for (const a in ades[st]) if (/^(TCS-|GCP-|TBN-TRIP|MIT-GEN)/.test(ades[st][a].tag || '')) tcsTagged++;
ok(
  tcsTagged === bind.rows.length,
  'DCS I/O list points tagged TCS / GCP / TBN-TRIP / MIT-GEN: ' + tcsTagged + ', in the binding ' + bind.rows.length
);

/* 4 */
const mb = bind.modbus || [];
const sh = n => mb.filter(q => q.sh === n).length;
ok(
  sh('PLC to DCS') === 227 && sh('DCS to PLC') === 25,
  'Modbus rows: PLC to DCS ' + sh('PLC to DCS') + ' of 227, DCS to PLC ' + sh('DCS to PLC') + ' of 25'
);
const mbBad = mb.filter(q => (q.to === 'SPARE' ? q.tag || q.d : !X.mbEnd(q.to)));
ok(!mbBad.length, 'Modbus rows with no end (or a named row called spare): ' + mbBad.map(q => q.ma).join(' '));
const named = mb.filter(q => q.to !== 'SPARE').length;
ok(named === 237, 'named Modbus rows with an end: ' + named + ' of 237; blank (spare) rows ' + (mb.length - named));
ok(
  mb.every(q => q.word && (q.ty === 'AI' || (q.bit >= 0 && q.bit <= 15))),
  'every Modbus row has its STN102 word (DI / DO: bit 0 ~ 15)'
);

/* 5: the boxes the sheet reader of tce-run.js names PIO but are not PI/O channels: the delay timers "DI" of the generator sheets
   (G-1B / G-2B / G-5A / G-5B / G-6A / G-6B, tce/_lib.js di()), the TRIPLE DETECTOR / 2OO3 blocks of TCE060 ~ TCE069 and the
   example "(TCS400-1)" of the LOGIC EXPLANATION SHEET TCE022 */
const READER = /^PIO:(G-[0-9][AB]\.d|TCE06\d\.(td2|v2o3)$|TCS400-1$)/;
const lst = node([P('tests/tce/sheets.cjs'), '--list']);
const ports = [
  ...new Set(
    (lst.stdout || '')
      .split('\n')
      .map(l => /^\s*port (PIO:\S+)/.exec(l))
      .filter(Boolean)
      .map(m => m[1])
  )
];
const miss = ports.filter(p => !X.ports[p]);
const realMiss = miss.filter(p => !READER.test(p));
ok(
  ports.length > 400 && !realMiss.length,
  'PIO ports of the sheet program ' +
    ports.length +
    ': on a table row ' +
    (ports.length - miss.length) +
    ', reader boxes (not PI/O) ' +
    (miss.length - realMiss.length) +
    ', missing ' +
    realMiss.length +
    (realMiss.length ? ' ' + realMiss.slice(0, 10).join(' ') : '')
);

/* 6 */
const U0 = { tb: {}, tc: {}, gen: {}, _L: {} };
let thrown = [];
for (const r of used) {
  const e = X.end(r.id);
  if (e.read)
    try {
      e.read(U0, {});
    } catch (x) {
      thrown.push(r.id + ' ' + x.message);
    }
}
for (const q of mb) {
  const e = q.to !== 'SPARE' && X.mbEnd(q.to);
  if (e && e.read)
    try {
      e.read(U0, {});
    } catch (x) {
      thrown.push(q.ma + ' ' + x.message);
    }
}
ok(!thrown.length, 'reads on an empty plant: ' + thrown.length + ' exceptions ' + thrown.slice(0, 5).join(' | '));
const s = X.stats();
console.log('ends of the used rows: ' + JSON.stringify(s.byKind));
process.exit(bad ? 1 : 0);
