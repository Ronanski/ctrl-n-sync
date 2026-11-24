/* PR 0 (lane plan 2026-11-25): the lane data files parse and keep their row format (src/world/bind, src/world/inst, src/data/alarms),
   and every row names its source (src: the drawing or list row). */
const { laneData } = require('../../../tools/build/engine-bundle.js');
const w = {};
new Function('window', laneData())(w);
const bad = [];
const A = /^[IMO]\.[0-9A-F]{4}$/;
for (const r of w.LANE_BIND) {
  if (!r.src) bad.push('bind ' + r.lane + ': no src ' + JSON.stringify(r));
  if (r.to && r.text ? !(/ #\S/.test(r.to) && (r.tag || r.addr) && (!r.addr || A.test(r.addr) || /^AI\d{4}$/.test(r.addr))) : r.to ? !(+r.row > 0 && (r.from || r.addr)) : !(r.stn && A.test(r.addr || '') && r.tag)) bad.push('bind ' + r.lane + ': row format ' + JSON.stringify(r));
}
for (const e of w.LANE_INST) {
  if (!e.sheet || !Array.isArray(e.units) || !e.units.length) bad.push('inst ' + e.set + ': sheet / units');
  if (e.rows && !(Array.isArray(e.rows) && e.rows.length && e.rows.every(n => +n > 0))) bad.push('inst ' + e.set + ': rows');
  for (const u of e.units || []) {
    if (!u.lbl) bad.push('inst ' + e.set + ': unit without lbl');
    if (!(u.src || e.src)) bad.push('inst ' + e.set + ' ' + u.lbl + ': no src');
    for (const [a, b] of Object.entries(u.addrMap || {})) if (!A.test(a) || !A.test(b)) bad.push('inst ' + e.set + ' ' + u.lbl + ': address ' + a + ' -> ' + b);
  }
}
for (const r of w.LANE_ALARMS) if (!r.tag || !(r.p >= 1 && r.p <= 4) || !r.src) bad.push('alarm ' + r.group + ': ' + JSON.stringify(r));
console.log('lane data: bind ' + w.LANE_BIND.length + ', inst ' + w.LANE_INST.length + ', alarms ' + w.LANE_ALARMS.length + ', problems ' + bad.length);
for (const b of bad.slice(0, 40)) console.log('  ' + b);
process.exit(bad.length ? 1 : 0);
