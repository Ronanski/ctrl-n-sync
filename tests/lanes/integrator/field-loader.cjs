/* beta.470 (lane 0): the field loader (src/world/field/README.md). The engine functions of unit.js between the marks run here on a small
   stand-in of the engine, so the test needs no browser: the values reach AN.unit.fld on a scan, AN.fieldRead gives them before the first
   scan too (a loaded plant that was not run has no fld: KIRARA 2026-11-25), a forced row is not touched, a bad row does not stop the
   others, and X.av puts the hold memory back. And the field files of the lanes: every row has its source and a reader. */
const fs = require('fs'),
  path = require('path');
const root = path.resolve(__dirname, '..', '..', '..');
const { laneData } = require('../../../tools/build/engine-bundle.js');
const bad = [];
const ok = (c, m) => c || bad.push(m);

const w = {};
new Function('window', laneData())(w);
for (const r of w.FIELD.rows) {
  const id = 'field ' + r.lane + ' ' + (r.tag || r.ai);
  ok(typeof (r.v || r.get) === 'function', id + ': no v(U, X)');
  ok(r.tag && r.src, id + ': no tag or no src');
  ok(r.di ? !r.ai : /^AI\d{4}$/.test(r.ai || '') ? +r.stn >= 1 && +r.stn <= 7 : !r.ai, id + ': address');
}

const s = fs.readFileSync(path.join(root, 'src', 'analog', 'engine', 'unit.js'), 'utf8');
const a = s.indexOf('let AN_FLD = null;'),
  b = s.indexOf('function anUnitStep(dt) {');
ok(a > 0 && b > a, 'unit.js: the field functions not found');
const AN = { sheets: [{ S: 1 }] },
  AN_UNIT = { iaP: 7, on: true },
  written = [];
const win = { FIELD: { rows: [] } };
const run = new Function(
  'window', 'AN', 'AN_UNIT', 'anUnitAIs', 'anUnitVal', 'anUnitWrite', 'anAv', 'anDitlPos', 'anDitlRun', 'AN_FAULT_STUCK',
  s.slice(a, b) + '\nreturn [anFieldStep, AN_FLD_X, anFieldRead];'
);
const [step, fieldX, fieldRead] = run(
  win, AN, AN_UNIT,
  k => (k === '1|AI0001' ? [['S', 'B']] : []),
  l => (l.length ? 5 : NaN),
  (l, v) => written.push(v),
  (t, x) => ((AN_UNIT.avH = AN_UNIT.avH || {}), (AN_UNIT.avH[t] = x), x / 2),
  () => 40,
  () => 1,
  {}
);
AN.fieldX = fieldX;
AN.fieldRead = fieldRead;
step();
ok(!('fld' in AN_UNIT), 'no row: nothing is written on the unit');
win.FIELD.rows.push(
  { lane: 't', stn: 1, ai: 'AI0001', tag: 'PT-A-1', v: U => U.iaP },
  { lane: 't', stn: 4, ai: 'AI0449', tag: 'TT-B', v: () => 601 },
  { lane: 't', tag: 'BAD', v: U => U.no.no },
  { lane: 't', tag: 'ZS-C', di: 1, v: (U, X) => X.ditlPos('D') > 30 },
  { lane: 't', tag: 'AV', v: (U, X) => X.av('FCV', 50) },
  { lane: 't', tag: 'AI', get: (U, X) => X.ai('1|AI0001') + X.ditlRun('D') }
);
ok(AN.fieldRead('4|AI0449') === 601, 'before the first scan: AN.fieldRead reads the rows');
ok(AN.fieldRead('PTA1') === 7, 'before the first scan: by the tag');
ok(!written.length, 'AN.fieldRead writes no block');
step();
const f = AN_UNIT.fld || {};
ok(f['1|AI0001'] === 7 && f.PTA1 === 7 && f['4|AI0449'] === 601 && f.ZSC === 1 && f.AV === 25 && f.AI === 6, 'AN.unit.fld after a scan: ' + JSON.stringify(f));
ok(!('BAD' in f) && AN.fieldRead('BAD') === null, 'a row that fails gives no value');
ok(written.length === 1 && written[0] === 7, 'the AI blocks are written: ' + written);
ok(!('avH' in AN_UNIT), 'X.av puts the hold memory back');
ok(AN.fieldStat.length === 2 && AN.fieldStat[0].blocks === 1 && AN.fieldStat[1].blocks === 0, 'AN.fieldStat');
AN_UNIT.iaP = 6;
delete AN_UNIT.fld; /* as a loaded state does */
ok(AN.fieldRead('4|AI0449') === 601, 'after a load (no fld): AN.fieldRead still gives the value');
console.log('field loader: lane rows ' + w.FIELD.rows.length + ', problems ' + bad.length);
for (const x of bad.slice(0, 40)) console.log('  ' + x);
process.exit(bad.length ? 1 : 0);
