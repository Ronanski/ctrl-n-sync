/* Lane 7 (HMI TURBINE : MINAMI, lane plan 2026-11-25): every element of the lane 7 HX pages is bound to a real address of the
   one logic. Static, no browser (runs in Checks before Playwright is installed):
   - a controller (HX.C) names a loop that is on an ABC sheet of the app (src/data/apre.txt);
   - a digital state (data-di="TAG|...") names a tag that a DITL sheet reads (src/data/pre.txt) or a row of the DCS I/O list;
   - a value key is an I/O tag, a logic tag on a sheet, a TCS Modbus word (src/data/tcs-dcs.json), or 'an:KEY' = a field the plant
     model writes (src/analog/engine/unit.js);
   - the page names its flow diagram (K1AU3-PD-0xx) in its header. */
const fs = require('fs'),
  path = require('path'),
  vm = require('vm'),
  zlib = require('zlib');
const root = path.resolve(__dirname, '..', '..', '..');
const rd = f => fs.readFileSync(path.join(root, f), 'utf8');
const unz = f => {
  const t = rd(f).trim();
  try {
    return zlib.gunzipSync(Buffer.from(t, 'base64')).toString();
  } catch (e) {
    return t;
  }
};
/* [file name, page id]: the lane 7 pages that pass this check; a page joins the list when its elements are bound */
const PAGES = [
  ['heater-drains', 'heater-drains'],
  ['industrial-water', 'industrial-water'],
  ['turbine-interface', 'turbine-interface'],
  ['turbine-operation', 'turbine-operation'],
  ['turbine-valves', 'turbine-valves'],
  ['turbine-motors', 'turbine-motors'],
  ['turbine-readings', 'turbine-readings'],
  ['turbine-states', 'turbine-states']
];
const abc = unz('src/data/apre.txt'),
  ditl = unz('src/data/pre.txt'),
  unit = rd('src/analog/engine/unit.js');
const io = new Set();
{
  const w = {};
  new Function('window', rd('src/ui/plant/wiring.js'))(w);
  for (const r of w.WIRING) if (r[3]) io.add(String(r[3]));
}
/* a word the TCS sends the DCS over Modbus (src/data/tcs-dcs.json, PLC to DCS): by its instrument tag or its word / bit ('SI1002.7') */
const mbk = new Set();
for (const r of JSON.parse(rd('src/data/tcs-dcs.json')).modbus)
  if (r.sh === 'PLC to DCS' && r.to) {
    if (r.tag && r.tag !== '-') mbk.add(r.tag);
    mbk.add(r.word + (r.bit != null ? '.' + r.bit : ''));
  }
const N = s => String(s).replace(/-/g, '');
const onAbc = t => abc.includes('"' + t) || abc.includes(N(t));
const ctx = { window: {}, document: { addEventListener() {}, body: null, documentElement: { style: {} } }, console };
ctx.window.window = ctx.window;
vm.createContext(ctx);
vm.runInContext('var window=this.window;var document=this.document;' + rd('src/ui/plant/hx/hx-core.js'), ctx);
const HX = ctx.window.HX;
let bad = 0,
  n = 0;
const fail = m => (bad++, console.log('FAIL ' + m));
for (const [file, id] of PAGES) {
  const src = rd('src/ui/plant/hx/hx-page-' + file + '.js');
  vm.runInContext('var HX=window.HX;' + src, ctx);
  const p = HX.byId[id];
  if (!p) {
    fail(id + ': page did not register');
    continue;
  }
  /* a process page names its flow diagram; a page of signals only (no process drawn: the TCS / DCS interface) names the I/O list or
     the TCS drawing (IBD 310SC90-*, logic book 331DM*) */
  const pipes = (p.plan && p.plan.pipes) || [];
  if (pipes.length ? !/K1AU3-PD-0\d\d/.test(src) : !/K1AU3-PD-0\d\d|I\/O list|310SC90-\d+|331DM\d+|MODBUS Communication list/.test(src))
    fail(id + ': no source drawing or list named');
  const it = [];
  const walk = x => {
    if (!x || typeof x !== 'object') return;
    it.push(x);
    for (const k in x) if (Array.isArray(x[k])) x[k].forEach(walk);
  };
  (p.plan.items || []).forEach(walk);
  const keys = [].concat(
    it.filter(x => x.key).map(x => x.key),
    (p.plan.taps || []).map(t => t.key),
    (p.plan.texts || []).filter(t => t.key).map(t => t.key)
  );
  for (const x of it.filter(x => x.k === 'loop')) {
    n++;
    if (!onAbc(x.loop)) fail(id + ': controller ' + x.loop + ' is on no ABC sheet');
    if (x.tag && !io.has(x.tag)) fail(id + ': valve ' + x.tag + ' is not in the I/O list');
  }
  for (const x of it.filter(x => x.k === 'hook')) {
    const m = /data-di="([^|"]+)/.exec(x.hook);
    if (!m) continue;
    n++;
    if (!ditl.includes('"' + m[1] + '"') && !io.has(m[1]) && !mbk.has(m[1]))
      fail(id + ': state ' + m[1] + ' is read by no DITL sheet and is not an I/O row');
  }
  /* TCS operator buttons and lamps: a 'crt:CRT:<sheet>.<tag>' button names a port its TCE / TCA sheet draws; a 'crtl:<sheet>|<key>'
     lamp names a CRT lamp key that sheet draws (src/digital/tce/<sheet>.js) */
  const tce = sid => {
    try {
      return rd('src/digital/tce/' + sid + '.js');
    } catch (e) {
      return '';
    }
  };
  for (const x of it.filter(x => x.k === 'hook' && /^crtl?:/.test(x.hook))) {
    n++;
    const b = /^crt:CRT:([A-Z0-9]+)\.(.+)$/.exec(x.hook),
      l = /^crtl:([A-Z0-9]+)\|(.+)$/.exec(x.hook),
      [sid, key] = b ? [b[1], b[2]] : l ? [l[1], l[2]] : [null, null];
    /* a push button or a lamp of a macro block: '<block>.<BUTTON>' = a push button the macro holds inside (MACRO[..].pb of
       tce-run.js), '<block>.<PIN>' = an output pin the sheet draws on that block (its R list) */
    const mk = /^([a-z][a-z0-9]*)\.([A-Z]+)$/.exec(key || '');
    if (mk) {
      const sh = tce(sid),
        pb = /pb: \[([^\]]*)\]/.exec(rd('src/digital/tce-run.js')),
        blk = new RegExp("\\[\\s*'" + mk[1] + "',\\s*'MOTOR STANDARD'").test(sh.replace(/\s+/g, ' ')),
        ok = b ? pb && pb[1].includes("'" + mk[2] + "'") : sh.includes("'" + mk[2] + "'");
      if (!blk || !ok) fail(id + ': TCS ' + (b ? 'button ' : 'lamp ') + x.hook + ' is no button / pin of a block on its sheet');
      continue;
    }
    if (!sid || !tce(sid).includes("'" + key + "'")) fail(id + ': TCS ' + (b ? 'button ' : 'lamp ') + x.hook + ' is not drawn on its sheet');
  }
  for (const k of keys) {
    n++;
    if (/^an:/.test(k)) {
      if (!new RegExp('U\\.' + k.slice(3) + '\\s*=').test(unit))
        fail(id + ': plant model key ' + k + ' is written nowhere in unit.js');
    } else if (!io.has(k) && !onAbc(k) && !mbk.has(k)) fail(id + ': value ' + k + ' is no I/O tag and on no sheet');
  }
  for (const t of (p.plan.taps || []).filter(t => /^an:/.test(t.key)))
    if (!t.tag || !io.has(t.tag)) fail(id + ': model value ' + t.key + ' names no I/O tag');
}
console.log('lane 7 pages: ' + PAGES.length + ', bound elements checked ' + n + ', problems ' + bad);
process.exit(bad ? 1 : 0);
