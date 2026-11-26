/* Phase 6 TAPOS gate (logic as netlist; user OPLAN TRANSLATED, phases in order). docs/PHASES.md row 6 may say TAPOS only when:
   TCS  - every TCE / TCA / G sheet runs as its logic and is drawing-complete: tests/lanes/qa/tce-complete.cjs FLOOR = all 419 sheets,
          tests/tce/sheets.cjs FLOOR_TEXT = 0 (no macro left on the manual text);
   DCS  - the QA trace baseline (tools/trace/baseline.json, held every run by trace-gate.cjs): no unlinked I/O, no machine copy address
          clash, no NaN source, no unresolved F(X); and every input still with no source (B1 ABC / DITL) is listed in docs/phase6/open.json
          as a finding of type b (correct, evidence) or c (drawing not readable, the part named), with no entry of type open.
   While row 6 is not TAPOS the gate passes and prints what is left. */
const fs = require('fs'),
  path = require('path');
const root = path.resolve(__dirname, '..', '..', '..');
const rd = f => fs.readFileSync(path.join(root, f), 'utf8');
let bad = 0;
const fail = m => (bad++, console.log('FAIL', m));
const num = (f, re) => {
  const m = re.exec(rd(f));
  return m ? +m[1] : NaN;
};
const B = JSON.parse(rd('tools/trace/baseline.json')),
  O = JSON.parse(rd('docs/phase6/open.json'));
const tcsAll = fs.readdirSync(path.join(root, 'src/digital/tce')).filter(f => /^(TC[AE]|G-).*\.js$/.test(f) && !/^TCE02[23]\.js$/.test(f)).length; /* TCE022 / TCE023 are explanation sheets, not logic (sheets.cjs) */
for (const k of ['abc', 'ditl'])
  for (const e of O[k] || []) {
    if (!/^(b|c|open)$/.test(e.type)) fail('open.json ' + k + ' ' + e.sheet + ' ' + e.input + ': type ' + e.type + ' (b, c or open)');
    if (!e.why || e.why.length < 20) fail('open.json ' + k + ' ' + e.sheet + ' ' + e.input + ': no evidence written');
    if (e.type === 'open' && !e.owner) fail('open.json ' + k + ' ' + e.sheet + ' ' + e.input + ': open with no owner');
  }
const checks = [
  ['TCS sheets complete (tce-complete FLOOR)', num('tests/lanes/qa/tce-complete.cjs', /const FLOOR = \+\(process\.env\.TCE_FLOOR \|\| (\d+)\)/), '= ' + tcsAll, x => x === tcsAll],
  ['TCS macros on the manual text (sheets.cjs FLOOR_TEXT)', num('tests/tce/sheets.cjs', /const FLOOR_TEXT = (\d+)/), '= 0', x => x === 0],
  ['DCS I/O unlinked', B.down['io.unlinked'], '= 0', x => x === 0],
  ['DCS machine copy address clash', B.down['io.copyClash'], '= 0', x => x === 0],
  ['DCS NaN source / F(X) unresolved held at 0', ['io.nanSource', 'fx.fxUnresolved'].every(k => (B.zero || []).includes(k)) ? 0 : 1, '= 0', x => x === 0]
];
for (const [k, kk] of [['abc', 'breaks.B1_abcInputNoSource'], ['ditl', 'breaks.B1_ditlInputNoSource']]) {
  const L = O[k] || [],
    bc = L.filter(e => e.type !== 'open').length,
    op = L.filter(e => e.type === 'open').length;
  checks.push(['DCS ' + k.toUpperCase() + ' inputs with no source not explained (trace ' + B.down[kk] + ', b / c ' + bc + ')', B.down[kk] - bc, '= 0', x => x === 0]);
  checks.push(['DCS ' + k.toUpperCase() + ' findings still open', op, '= 0', x => x === 0]);
}
const row = /^\| 6 \| [^|]+\|[^|]+\| (TAPOS|BAHAGI|HINDI PA) \|/m.exec(rd('docs/PHASES.md')),
  tapos = row && row[1] === 'TAPOS';
const left = [];
for (const [what, v, want, ok] of checks) {
  const good = ok(v);
  console.log((good ? 'ok   ' : 'left ') + what + ': ' + v + ' (want ' + want + ')');
  if (!good) left.push(what);
}
if (tapos) for (const w of left) fail('PHASES row 6 is TAPOS but: ' + w);
console.log(
  bad ? 'FAIL phase6-gate ' + bad : 'PASS phase6-gate: row 6 ' + (row ? row[1] : '?') + (left.length ? ', left ' + left.length + ' before TAPOS' : ', every condition met')
);
process.exit(bad ? 1 : 0);
