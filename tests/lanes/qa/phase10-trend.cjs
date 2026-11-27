/* Phase 10 item 3, trend part (docs/PHASES.md row 10; plant DCS textbook INC-TN5A2098/2099: trend panel of up to 8 pens, collected at
   its cycle whatever screen is shown). Headless: loads hx-core.js and every hx-page-*.js in a vm and checks
   - no trend group of a page has more than 8 pens, and there are 8 pen colours;
   - the trend recorder (HX.rec) samples every pen of every page from its own timer while NO page is open (no HX.mount), and starts again when the time goes back (a save loaded). */
'use strict';
const fs = require('fs'),
  path = require('path'),
  vm = require('vm');
const root = path.resolve(__dirname, '..', '..', '..');
const rd = f => fs.readFileSync(path.join(root, f), 'utf8');
let bad = 0;
const fail = m => (bad++, console.log('FAIL', m));
const timers = [];
const ctx = {
  window: {},
  document: { addEventListener() {}, body: null, documentElement: { style: {} } },
  console,
  setInterval: (f, ms) => (timers.push([f, ms]), timers.length)
};
ctx.window.window = ctx.window;
vm.createContext(ctx);
vm.runInContext('var window=this.window;var document=this.document;' + rd('src/ui/plant/hx/hx-core.js'), ctx);
const HX = ctx.window.HX;
for (const f of fs.readdirSync(path.join(root, 'src/ui/plant/hx')).sort())
  if (/^hx-page-.*\.js$/.test(f)) vm.runInContext('var HX=window.HX;' + rd('src/ui/plant/hx/' + f), ctx);
const css = rd('src/ui/plant/hx/hx.css');
for (let i = 1; i <= 8; i++) if ((css.match(new RegExp('--hx-pen' + i + ':', 'g')) || []).length < 3) fail('--hx-pen' + i + ' not in the 3 theme blocks');
if (HX.rec.pens !== 8) fail('pen colours ' + HX.rec.pens + ', not 8');
const keys = new Set();
let groups = 0;
for (const d of HX.pages)
  for (const g of d.trends || []) {
    groups++;
    if (g.pens.length > 8) fail(d.id + ' trend "' + g.title + '" has ' + g.pens.length + ' pens (max 8)');
    for (const p of g.pens) keys.add(p[1]);
  }
const rec = timers.find(t => t[1] === 500);
if (!rec) fail('no 500 ms recorder timer');
else {
  let t = 1000;
  HX.data = { time: () => t, value: () => 42, loop: () => ({ pv: 1, sv: 2, mv: 3 }), valve: () => ({ pct: 50 }) };
  for (let i = 0; i < 10; i++, t += 1) rec[0]();
  for (const k of keys) {
    const b = HX.rec.buf[k] || [];
    if (b.length !== 5) fail('pen ' + k + ': ' + b.length + ' samples in 10 s with no page open (expected 5 at the 2 s cycle)');
  }
  /* a save loaded: the time goes back to 500 s; the samples after it go and the recorder goes on from there */
  t = 500;
  for (let i = 0; i < 4; i++, t += 1) rec[0]();
  for (const k of keys) {
    const b = HX.rec.buf[k] || [];
    if (b.length !== 2 || b[0][0] !== 500) fail('pen ' + k + ' after the time went back: ' + JSON.stringify(b));
  }
}
console.log('phase10-trend: ' + HX.pages.length + ' pages, ' + groups + ' trend groups, ' + keys.size + ' pens recorded with no page open' + (bad ? ', ' + bad + ' failed' : ', ok'));
process.exit(bad ? 1 : 0);
