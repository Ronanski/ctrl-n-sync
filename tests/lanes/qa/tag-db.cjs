/* Phase 4 TAG DATABASE (user 2026-11-25 "sunod sunod"): src/data/ades.txt is the one table of every DCS address (I/O list + memory list,
   station by station: ADES[stn][addr] = { k: 'io' | 'mem', tag, d, t, ... }). Every other file that names a station / address / tag must
   agree with it. Fails when:
   - one tag sits at two addresses (a tag is one signal in the whole DCS);
   - an alarm row (src/data/alarms), a bind row with an address (src/world/bind), a TCS-DCS row (src/data/tcs-dcs.json), a field row or a
     field state (src/world/field, as the app loads them), or a loop address (src/ui/plant/dcslists.js) names an address that is not in the
     table, or a tag that is not the tag of that address / not in the table / on another station;
   - a row with io (the I/O list name, where its tag is the drawing's or the alarm list's spelling) is checked by io;
   - unless the difference is in tests/lanes/qa/tag-db-known.json with its reason. A known difference that is gone prints "remove". */
const fs = require('fs'),
  path = require('path');
const root = path.resolve(__dirname, '..', '..', '..');
const { load, gz } = require(path.join(root, 'tools/trace/world.cjs'));
const A = JSON.parse(gz('ades.txt'));
const KNOWN = JSON.parse(fs.readFileSync(path.join(__dirname, 'tag-db-known.json'), 'utf8')).known;
const found = new Map(),
  cnt = {};
const diff = (key, msg) => found.set(key, msg);
const seen = k => (cnt[k] = (cnt[k] || 0) + 1);
const tagAt = new Map();
let io = 0;
for (const st in A)
  for (const ad in A[st]) {
    const o = A[st][ad];
    if (!o || typeof o !== 'object') continue;
    if (o.k === 'io') io++;
    if (!o.tag) continue;
    const t = String(o.tag).trim();
    if (tagAt.has(t)) diff('dup ' + t, 'tag ' + t + ' at ' + tagAt.get(t) + ' and ' + st + '|' + ad);
    else tagAt.set(t, st + '|' + ad);
  }
/* the alarm list names a temperature point by its element (TE-) where the I/O list names the transmitter (TT-) at the same address, and
   adds the sensor number to a winding / bearing point (TE-FA1053-U2 = TT-FA1053-U, TE-FW1115-BU-2 = TT-FW1115-BU): the same signal */
const alarmName = t => String(t).trim().replace(/^TE-/, 'TT-').replace(/(-[A-Z]*\d?[A-Z]+\d?)-?\d$/, '$1');
const sameTag = (src, row, tab) => {
  const a = String(row).trim(), b = String(tab || '').trim();
  if (a === b) return true;
  return src === 'alarm' && (a.replace(/^TE-/, 'TT-') === b || alarmName(a) === b);
};
const stnOf = s => String(+s > 100 ? +s - 100 : +s);
const byAddr = (src, stn, addr, tag) => {
  seen(src);
  const s = stnOf(stn),
    o = (A[s] || {})[addr];
  if (!o) return diff(src + ' ' + s + ' ' + addr, src + ': STN' + s + ' ' + addr + ' is not in the table');
  if (tag && !sameTag(src, tag, o.tag))
    diff(src + ' ' + s + ' ' + addr, src + ': STN' + s + ' ' + addr + ' is ' + o.tag + ' in the table, the row says ' + tag);
};
const byTag = (src, stn, tag) => {
  seen(src);
  const t = String(tag).trim(),
    at = tagAt.get(t);
  if (!at) return diff(src + ' ' + stnOf(stn) + ' ' + t, src + ': tag ' + t + ' is not in the table');
  if (stn != null && at.split('|')[0] !== stnOf(stn)) diff(src + ' ' + stnOf(stn) + ' ' + t, src + ': tag ' + t + ' is on ' + at + ', the row says STN' + stnOf(stn));
};
for (const f of fs.readdirSync(path.join(root, 'src/data/alarms')))
  if (f.endsWith('.json')) for (const r of JSON.parse(fs.readFileSync(path.join(root, 'src/data/alarms', f), 'utf8'))) if (r.addr) byAddr('alarm', r.stn, r.addr, r.io || r.tag);
for (const f of fs.readdirSync(path.join(root, 'src/world/bind')))
  if (f.endsWith('.json')) for (const r of JSON.parse(fs.readFileSync(path.join(root, 'src/world/bind', f), 'utf8'))) if (r.addr) byAddr('bind', r.stn, r.addr, r.tag);
for (const r of JSON.parse(fs.readFileSync(path.join(root, 'src/data/tcs-dcs.json'), 'utf8')).rows) byAddr('tcs-dcs', r.stn, r.addr, r.tag);
const E = load();
const F = E.ctx.FIELD || {};
for (const r of F.rows || []) {
  if (r.ai) byAddr('field', r.stn, r.ai, r.io || r.tag);
  else if (r.io || r.tag) byTag('field', r.stn, r.io || r.tag);
  if (r.adr) byAddr('field', r.stn, r.adr);
}
for (const s of F.states || []) if (s.tag) byTag('state', null, s.tag);
const w = {};
new Function('window', fs.readFileSync(path.join(root, 'src/ui/plant/dcslists.js'), 'utf8'))(w);
for (const r of w.DCS_LOOPS) {
  const o = Object.fromEntries(w.DCS_LOOPS_F.map((k, i) => [k, r[i]]));
  for (const k of ['pv', 'rsv', 'mv'])
    for (const a of String(o[k] || '').split(/[ ,]+/).filter(x => /^(AI|AO|SI|DI|I\.|O\.|M\.|B\.)[0-9A-F]{4}$/.test(x))) byAddr('loop', o.stn, a);
}
let bad = 0;
for (const [k, m] of found) {
  if (KNOWN[k]) console.log('known ' + m + ' (' + KNOWN[k] + ')');
  else (console.log('FAIL ' + m), bad++);
}
for (const k of Object.keys(KNOWN)) if (!found.has(k)) console.log('fixed, remove from tag-db-known.json: ' + k);
console.log(
  (bad ? 'FAIL' : 'PASS') + ' tag-db: table ' + tagAt.size + ' tags, ' + io + ' I/O points; checked ' + Object.entries(cnt).map(([k, v]) => k + ' ' + v).join(', ') +
    '; known ' + [...found.keys()].filter(k => KNOWN[k]).length + ', new ' + bad
);
process.exit(bad ? 1 : 0);
