/* Lane 7 (HMI TURBINE : MINAMI, lane plan 2026-11-25): every element of the lane 7 HX pages is bound to a real address of the
   one logic. Static, no browser (runs in Checks before Playwright is installed):
   - a controller (HX.C) names a loop that is on an ABC sheet of the app (src/data/apre.txt);
   - a digital state (data-di="TAG|...") names a tag that a DITL sheet reads (src/data/pre.txt) or a row of the DCS I/O list;
   - a value key is an I/O tag, a logic tag on a sheet, or 'an:KEY' = a field the plant model writes (src/analog/engine/unit.js);
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
const PAGES = [['heater-drains', 'heater-drains']];
const abc = unz('src/data/apre.txt'),
  ditl = unz('src/data/pre.txt'),
  unit = rd('src/analog/engine/unit.js');
const io = new Set();
{
  const w = {};
  new Function('window', rd('src/ui/plant/wiring.js'))(w);
  for (const r of w.WIRING) if (r[3]) io.add(String(r[3]));
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
  if (!/K1AU3-PD-0\d\d/.test(src)) fail(id + ': no flow diagram named');
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
    if (!ditl.includes('"' + m[1] + '"') && !io.has(m[1])) fail(id + ': state ' + m[1] + ' is read by no DITL sheet and is not an I/O row');
  }
  for (const k of keys) {
    n++;
    if (/^an:/.test(k)) {
      if (!new RegExp('U\\.' + k.slice(3) + '\\s*=').test(unit)) fail(id + ': plant model key ' + k + ' is written nowhere in unit.js');
    } else if (!io.has(k) && !onAbc(k)) fail(id + ': value ' + k + ' is no I/O tag and on no sheet');
  }
  for (const t of (p.plan.taps || []).filter(t => /^an:/.test(t.key))) if (!t.tag || !io.has(t.tag)) fail(id + ': model value ' + t.key + ' names no I/O tag');
}
console.log('lane 7 pages: ' + PAGES.length + ', bound elements checked ' + n + ', problems ' + bad);
process.exit(bad ? 1 : 0);
