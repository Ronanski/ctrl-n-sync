/* Full Audit 3 #4 step 2: the TCS block meanings (src/digital/tce-run.js) against the HIACS macro list (TCA013 ~ TCA020), and the
   kinds the typed sheets use. Every case is the macro list's own rule at a step of dt. Fails on a wrong case, or on a kind used on a
   sheet that is neither a block, an alias, a mark nor in TO_READ (kinds still to read on their sheet, with the reason). */
'use strict';
const fs = require('fs'),
  path = require('path');
const root = path.join(__dirname, '..', '..');
global.window = global;
require(path.join(root, 'src/digital/tce-run.js'));
const R = global.TCE_RUN,
  K = R.K;
let bad = 0,
  n = 0;
const eq = (a, b) => (Number.isNaN(b) ? Number.isNaN(a) : Math.abs(a - b) < 1e-9);
function ok(name, got, want) {
  n++;
  const g = [].concat(got),
    w = [].concat(want);
  if (g.length < w.length || w.some((v, i) => !eq(g[i], v))) {
    bad++;
    console.log('FAIL', name, JSON.stringify(g), '!=', JSON.stringify(w));
  }
}
/* run a block over a list of inputs, return the first output of each step */
function seq(k, notes, xs, dt = 0.1, sws) {
  const st = {};
  return xs.map((x, i) => K[k]([].concat(x), notes, st, dt, sws ? sws[i] : undefined)[0]);
}
ok('ADD', K.ADD([1, 2, 3]), 6);
ok('SUB', K.SUB([10, 2, 3]), 5);
ok('MLT', K.MLT([3, 4]), 12);
ok('DIV', seq('DIV', [], [[6, 3], [6, 0]]), [2, 2]);
ok('I', seq('I', ['TI:1.0', 'HL:0.25'], [[1], [1], [1], [1]], 0.1), [0.1, 0.2, 0.25, 0.25]);
ok('I SW=0 track', seq('I', ['TI:1.0'], [[1, 0, 5], [1, 0, 5]], 0.1, [0, 1]), [5, 5.1]);
ok('LG', (() => { const st = { y: 0 }; return K.LG([1], ['T:1.0'], st, 0.5)[0]; })(), 0.5);
ok('LG SW=0', K.LG([3], ['T:1.0'], { y: 0 }, 0.5, 0), 3);
/* the integral starts at the tie-back Z (bumpless start: Y(0) = Z + the first step) */
ok('PIF', seq('PIF', ['G:2', 'TI:1'], [[1], [1]], 0.1), [0.1, 0.2]);
ok('PIV', seq('PIV', ['G1:1', 'G2:1', 'TI:1'], [[1], [2]], 0.1), [0.1, 1.2]);
ok('HS', K.HS([1, 5, 3]), [5, 0, 1, 0]);
ok('LS', K.LS([1, 5, 3]), [1, 1, 0, 0]);
ok('SG', K.SG([], ['K:3600.0rpm']), 3600);
ok('AM', seq('AM', ['R:2', 'HL:10'], [[0, 0, 4], [1, 0, 4], [1, 0, 4]], 0.5), [4, 5, 6]);
ok('RL', seq('RL', ['RI:1', 'RD:20'], [[0], [10], [10], [-10]], 1), [0, 1, 2, -10]);
ok('LIM', K.LIM([12], ['HL:10', 'LL:0']), [10, 1, 0]);
ok('ASW', [K.ASW([1, 2], [], {}, 0.1, 1)[0], K.ASW([1, 2], [], {}, 0.1, 0)[0]], [1, 2]);
ok('G', K.G([2], ['K:-5.0%']), -10);
ok('MR', K.MR([10, 2], ['HL:5', 'LL:-5']), 1);
ok('ABS', K.ABS([-3]), 3);
ok('BP1', seq('BP1', ['R:1'], [[0, 5], [0, 5], [0, 5]], 1, [1, 0, 0]), [0, 1, 2]);
ok('FLT', seq('FLT', ['N:2'], [[2], [4], [6]]), [2, 3, 5]);
ok('GRD', seq('GRD', ['K:1'], [[0], [1], [2], [3], [4]], 1), [0, 0, 0, 0, 1]);
ok('PD', seq('PD', ['N:2', 'K:1'], [[1], [2], [3], [4]]), [1, 1, 1, 2]);
ok('LIN', K.LIN([2], ['K:3', 'B:1']), 7);
ok('LMS', K.LMS([-1], ['LL:0', 'HL:5']), 0);
ok('HSG', K.HSG([1, 7, 3]), 7);
ok('LSG', K.LSG([4, 7, 3]), 3);
ok('A', [K.A([1, 1])[0], K.A([1, 0])[0]], [1, 0]);
ok('OR', [K.OR([0, 1])[0], K.OR([0, 0])[0]], [1, 0]);
ok('NOT', K.NOT([0]), 1);
ok('EOR', K.EOR([1, 0]), 1);
ok('TP', seq('TP', ['TP:0.3S'], [[1], [1], [1], [0]], 0.1), [0, 0, 1, 0]);
ok('TD', seq('TD', ['TD:0.2S'], [[1], [0], [0], [0]], 0.1), [1, 1, 1, 0]);
ok('TW', seq('TW', ['TW:0.2S'], [[1], [1], [1], [0], [1]], 0.1), [1, 1, 0, 0, 1]);
ok('FFR', seq('FFR', [], [[1, 0], [0, 0], [1, 1], [0, 0]]), [1, 1, 0, 0]);
ok('FFS', seq('FFS', [], [[1, 0], [0, 1], [1, 1], [0, 0]]), [1, 0, 1, 1]);
ok('CMP', seq('CMP', ['HL:10', 'LL:5'], [[9], [10], [6], [5]]), [0, 1, 1, 0]);
ok('CPL', seq('CPL', ['HL:10', 'LL:5'], [[6], [5], [9], [10]]), [0, 1, 1, 0]);
ok('CNT', seq('CNT', ['N:2'], [[1], [0], [1], [1]]), [0, 0, 1, 1]);
ok('FLK', seq('FLK', ['T1:0.2', 'T2:0.2'], [[1], [1], [1], [1]], 0.1), [1, 0, 0, 1]);
ok('FTR', K.FTR([4]), 4);
ok('BTR', K.BTR([1]), 1);
ok('AVE', K.AVE([1, 2, 3, 6]), 3);
ok('HLD', seq('HLD', [], [[1], [2], [3]], 0.1, [0, 1, 1]), [1, 1, 1]);
ok('LCK', K.LCK([1], ['K:2']), 1);
ok('UCK', K.UCK([1], ['K:2']), 0);
ok('TWF', [K.TWF([1, 1, 0, 0])[0], K.TWF([1, 0, 0, 0])[0]], [1, 0]);
ok('THF', [K.THF([1, 1, 1, 0])[0], K.THF([1, 1, 0, 0])[0]], [1, 0]);
ok('PDF', seq('PDF', [], [[0], [1], [1], [0], [1]]), [0, 1, 0, 0, 1]);
ok('WCM', K.WCM([11], ['HL:10', 'LL:0']), 1);
ok('FG', [K.FG([5], ['X1:0', 'Y1:0', 'X2:10', 'Y2:100'])[0], K.FG([20], ['X1:0', 'Y1:0', 'X2:10', 'Y2:100'])[0]], [50, 100]);
ok('FG no points', K.FG([5], []), NaN);
ok('TB', [K.TB([1, 2], [], {}, 0.1, 1)[0], K.TB([1, 2], [], {}, 0.1, 0)[0]], [1, 2]);
ok('PA', seq('PA', [], [[3], [4], [5]], 0.1, [1, 0, 1]), [3, 3, 5]);
ok('SUM', K.SUM([5, 7], ['HL:10', 'LL:0']), 10);
ok('alias G:OR', R.kind('G:OR')([0, 1]), 1);

/* kinds on the sheets that are not read yet, each with where it is and why (RULES: findings are never retracted) */
const TO_READ = {
  'G:': 'generator relay sheets (G-1B, G-2B ...): a symbol typed with no kind (no TCE / TCA meaning)',
  SR: 'a box typed SR, not an item of the macro list: read on its sheet',
  SC: 'not an item of the macro list: read on its sheet',
  MODE: 'not an item of the macro list (a mode box): read on its sheet',
  'UNT-FG': 'a unit function generator macro (not ML 19): read on its sheet',
  'L-RATE': 'a load rate macro: read on its sheet',
  FILTER: 'a filter macro (not ML 33 FLT): read on its sheet',
  'VALVE CONTROL MT1': 'a SIM.MT plant model: it stays in the plant model (plan step 2)',
  'PRESS COMPENSATE MT1': 'a SIM.MT plant model: it stays in the plant model (plan step 2)'
};
const dir = path.join(root, 'src/digital/tce');
global.TCE_SHEETS = [];
/* the order of the app's build: the helpers first, then the sheets */
const order = fs.readFileSync(path.join(root, 'src/digital/order.list'), 'utf8').split('\n').map(l => l.trim()).filter(l => l.startsWith('tce/')).map(l => l.slice(4));
for (const f of order)
  if (f !== '_desc.js')
    try {
      new Function(fs.readFileSync(path.join(dir, f), 'utf8'))();
    } catch (e) {
      console.log('sheet file not read:', f, e.message);
    }
const cnt = {},
  fgNo = [];
for (const s of global.TCE_SHEETS)
  for (const b of s.b || []) {
    const t = b[1];
    cnt[t] = (cnt[t] || 0) + 1;
    if (t === 'FG' && !(b[5] || []).some(v => /^\s*X1\s*:/.test(v))) fgNo.push(s.id);
  }
const unknown = Object.keys(cnt).filter(t => !R.kind(t) && !R.MARK[t] && !TO_READ[t]);
const tot = Object.values(cnt).reduce((a, v) => a + v, 0);
const cov = Object.entries(cnt)
  .filter(([t]) => R.kind(t) || R.MARK[t])
  .reduce((a, [, v]) => a + v, 0);
console.log(`TCE run: ${n - bad}/${n} block cases pass; sheets ${global.TCE_SHEETS.length}, blocks ${tot}, ${cov} with a meaning or a mark (${((100 * cov) / tot).toFixed(1)} %)`);
for (const t of Object.keys(TO_READ)) if (cnt[t]) console.log(`  to read: ${t} x${cnt[t]}: ${TO_READ[t]}`);
console.log(`  FG with no break points typed: ${fgNo.length} on ${[...new Set(fgNo)].join(' ')}`);
if (unknown.length) console.log('UNKNOWN kinds on the sheets:', unknown.map(t => `${t} x${cnt[t]}`).join(', '));
process.exit(bad || unknown.length ? 1 : 0);
