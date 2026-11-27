/* Phase 11 gate (plant model; user 2026-11-27 11:05 AM PHT "Gawin nio na", 11:13 AM: repair the existing model, no second model).
   Row 11 of docs/PHASES.md may be TAPOS only when ALL of these hold:
   1. the sweep 150 -> 45 MW (tools/accept/results/sweep-latest.json, written by tools/accept/part1.cjs SWEEP=1) judged every design
      curve and every curve PASSED (FHI Figs 6 ~ 13, L20, HB PPE-14-0725; tools/model/sweep-judge.cjs);
   2. no old fit is left: tools/check/no-fit-baseline.json is empty (RULES.md 3.12);
   3. every port of src/analog/engine/ports.js is written by its part (the sweep run records the ports not written, `missingPorts`)
      and the whole-plant water / steam balance closes (`balance.res` within 1 T/H);
   4. no plant value has two computing functions: tools/check/one-path-baseline.json is empty.
   Until then the row stays BAHAGI and this prints what is left. */
const fs = require('fs'),
  path = require('path');
const root = path.resolve(__dirname, '..', '..', '..');
const rd = f => fs.readFileSync(path.join(root, f), 'utf8');
const left = [];
let S = null;
try {
  S = JSON.parse(rd('tools/accept/results/sweep-latest.json'));
} catch (e) {}
if (!S || !S.J) left.push('no sweep result (tools/accept/results/sweep-latest.json)');
else {
  const nj = S.J.rows.filter(r => r.res === 'NOT JUDGED').length;
  if (S.J.fail || nj) left.push('sweep ' + S.date + ': ' + S.J.pass + ' / ' + S.J.rows.length + ' design curves PASS (' + S.J.fail + ' FAIL, ' + nj + ' not judged)');
  if (!Array.isArray(S.missingPorts)) left.push('the sweep run does not record the ports yet (missingPorts)');
  else if (S.missingPorts.length) left.push(S.missingPorts.length + ' ports or stores not written by their part');
  if (!S.balance || !(Math.abs(S.balance.res) <= 1)) left.push('whole-plant water / steam balance not closed or not measured');
}
const nf = Object.values(JSON.parse(rd('tools/check/no-fit-baseline.json'))).flat().length;
if (nf) left.push(nf + ' old fits left in the physics (no-fit baseline)');
const op = Object.keys(JSON.parse(rd('tools/check/one-path-baseline.json'))).length;
if (op) left.push(op + ' plant values with more than one computing function (one-path baseline)');
const tapos = /^\|\s*11\s*\|[^|]*\|[^|]*\|\s*TAPOS\s*\|/m.test(rd('docs/PHASES.md'));
if (tapos && left.length) {
  for (const m of left) console.log('  FAIL row 11 is TAPOS but ' + m);
  console.log('FAIL phase11-gate');
  process.exit(1);
}
console.log((tapos ? 'PASS phase11-gate: row 11 TAPOS, every condition met' : 'PASS phase11-gate: row 11 not TAPOS; left: ' + (left.join('; ') || 'nothing, it may be marked TAPOS')));
