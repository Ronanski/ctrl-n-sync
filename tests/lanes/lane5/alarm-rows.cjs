/* Lane 5 (2026-11-25): the alarm rows of src/data/alarms (Alarm List _20160912-DCS temporary value updating.xls, the points with an
   I/O address in the app and a set point or a switch, not yet alarmed by an ABC alarm block): every row is one level of one point,
   names its list sheet and PD page, and its station and address are the I/O list's (src/data/ades.txt) with the same tag
   (io: the I/O list tag when the alarm list names the element, TE-FA1053-U1 = TT-FA1053-U).
   Analog rows: a number set point, HIGH-HIGH not under HIGH, LOW-LOW not over LOW. Switch rows: a digital input, on = 1. */
const fs = require('fs'),
  path = require('path'),
  zlib = require('zlib');
const D = path.join('src', 'data', 'alarms');
const ades = JSON.parse(zlib.gunzipSync(Buffer.from(fs.readFileSync('src/data/ades.txt', 'utf8').trim(), 'base64')).toString());
const LV = { 'HIGH-HIGH': 2, HIGH: 3, LOW: 3, 'LOW-LOW': 2, ALARM: 4 };
const bad = [],
  seen = new Set(),
  pt = {};
let n = 0;
for (const f of fs.readdirSync(D).filter(x => /\.json$/.test(x)).sort()) {
  const rows = JSON.parse(fs.readFileSync(path.join(D, f), 'utf8'));
  for (const r of rows) {
    n++;
    const id = f + ' ' + r.tag + ' ' + r.lv;
    if (!/^Alarm List _20160912 sheet \w+, (PD-\d+|no PD page in the list)/.test(r.src || '')) bad.push(id + ': src');
    if (!(r.lv in LV) || r.p !== LV[r.lv]) bad.push(id + ': level / priority');
    if (seen.has(r.tag + '|' + r.lv)) bad.push(id + ': twice');
    seen.add(r.tag + '|' + r.lv);
    const io = (ades[String(r.stn - 100)] || {})[r.addr];
    if (!io || io.tag !== (r.io || r.tag)) bad.push(id + ': not ' + r.stn + ' ' + r.addr + ' in the I/O list');
    if (r.on) {
      if (!/^I\.[0-9A-F]{4}$/.test(r.addr)) bad.push(id + ': switch not on a digital input');
    } else {
      if (!/^AI\d{4}$/.test(r.addr) || typeof r.sp !== 'number' || !isFinite(r.sp) || r.lv === 'ALARM') bad.push(id + ': analog row');
      (pt[r.tag] = pt[r.tag] || {})[r.lv] = r.sp;
    }
  }
}
for (const [t, s] of Object.entries(pt)) {
  if ('HIGH-HIGH' in s && 'HIGH' in s && s['HIGH-HIGH'] < s.HIGH) bad.push(t + ': HIGH-HIGH under HIGH');
  if ('LOW-LOW' in s && 'LOW' in s && s['LOW-LOW'] > s.LOW) bad.push(t + ': LOW-LOW over LOW');
}
console.log('alarm rows ' + n + ', points ' + (Object.keys(pt).length + [...seen].filter(k => !(k.split('|')[0] in pt)).length) + ', problems ' + bad.length);
for (const b of bad.slice(0, 30)) console.log('  ' + b);
process.exit(bad.length ? 1 : 0);
