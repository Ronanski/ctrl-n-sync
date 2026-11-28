/* NO PLANT SNAPSHOT, TREND OR SOP IN THE PLANT MODEL (user 2026-11-28 5:18 AM PHT: "Kht pngcheck hnd pwede ... Ano dpt source of truth
   s plant model"). The source of truth of the plant model is first principles and the design geometry / data (FHI, Hitachi HB, vendor
   sheets); set points are the DCS / TCS logic; acceptance is the design-curve sweep 45 ~ 150 MW. A plant HMI screen (*.PNG, the
   operating points list), a plant trend or an operating procedure (PR-OPE-500x) is not a source and not a check of the model.
   This check counts, per file, the lines of the plant model code, its start state, its tests and its judges that name one of them.
   RATCHET: it fails when a file has MORE such lines than its baseline (tools/check/no-snapshot-baseline.json) or a new file has any.
   The baseline only goes down: each part removes its own references (replace the value by a design / logic source) and runs --update.
   Usage: node tools/check/no-snapshot.cjs [--update] [--list] */
const fs = require('fs'),
  path = require('path');
const root = path.resolve(__dirname, '..', '..');
const SCOPE = ['src/analog/engine', 'src/world/ditl150.js', 'src/world/plantsw.js', 'src/world/field', 'tools/accept', 'tools/model', 'tools/steady150', 'tests/lanes/model', 'tests/gate', 'tests/regress'];
const RX = /\b\d{1,3}[A-Za-z]?\.png\b|\bsnapshots?\b|\bplant[- ]trends?\b|\btrend (?:fit|value|replay)s?\b|PR-OPE-?50\d\d|OPERATING_POINTS|operating-points\.json/i;
const walk = p => {
  const q = path.join(root, p);
  if (!fs.existsSync(q)) return [];
  if (fs.statSync(q).isFile()) return [p];
  return fs.readdirSync(q).flatMap(f => walk(path.join(p, f)));
};
const files = SCOPE.flatMap(walk).filter(f => /\.(c?js|json)$/.test(f) && !/no-snapshot/.test(f)).sort();
const cnt = {},
  hits = {};
for (const f of files) {
  const L = fs.readFileSync(path.join(root, f), 'utf8').split('\n');
  hits[f] = [];
  L.forEach((l, i) => RX.test(l) && hits[f].push(i + 1));
  if (hits[f].length) cnt[f] = hits[f].length;
}
const BF = path.join(__dirname, 'no-snapshot-baseline.json'),
  base = fs.existsSync(BF) ? JSON.parse(fs.readFileSync(BF, 'utf8')) : {};
const total = Object.values(cnt).reduce((a, b) => a + b, 0),
  btotal = Object.entries(base).reduce((a, [f, b]) => a + (f === '_rule0' ? 0 : b), 0);
if (process.argv.includes('--list')) for (const f of Object.keys(cnt)) console.log(cnt[f], f, 'lines', hits[f].join(','));
/* KNOWN RULE 0 VIOLATIONS (team decision 2026-11-28: a fit kept as a placeholder until its design source exists, e.g. cfb.js kKL 9.2
   against FHI Fig 9). The line carries the tag "RULE 0 VIOLATION". It is printed as a FAIL row in red and as a GitHub error annotation
   on the line, and counted, every run, so it stays in sight. It does not stop the job (it would block every PR), and it is not a pass */
const RV = /RULE 0 VIOLATION/,
  viol = [];
for (const f of SCOPE.flatMap(walk).filter(f => /\.(c?js|json|md)$/.test(f) && !/no-snapshot/.test(f)).sort())
  fs.readFileSync(path.join(root, f), 'utf8').split('\n').forEach((l, i) => RV.test(l) && viol.push([f, i + 1, l.trim().slice(0, 160)]));
if (process.argv.includes('--update')) {
  const up = Object.keys(cnt).filter(f => cnt[f] > (base[f] || 0));
  if (base._rule0 != null && viol.length > base._rule0) up.push('RULE 0 VIOLATION tags ' + viol.length + ' > ' + base._rule0);
  if (up.length && Object.keys(base).length) {
    console.log('FAIL no-snapshot --update: the baseline only goes down; more lines than the baseline in ' + up.join(', '));
    process.exit(1);
  }
  fs.writeFileSync(BF, JSON.stringify(Object.assign({ _rule0: viol.length }, cnt), null, 1) + '\n');
  console.log('no-snapshot baseline written: ' + total + ' lines in ' + Object.keys(cnt).length + ' files (was ' + btotal + ')');
  process.exit(0);
}
const GH = !!process.env.GITHUB_ACTIONS;
for (const [f, n, l] of viol) {
  console.log('\x1b[31mKNOWN FAIL (RULE 0 VIOLATION) ' + f + ':' + n + '  ' + l + '\x1b[0m');
  if (GH) console.log('::error file=' + f + ',line=' + n + ',title=RULE 0 VIOLATION (known, not a pass)::' + l.replace(/[\r\n%]/g, ' '));
}
if (viol.length) console.log('\x1b[31mKNOWN FAIL: ' + viol.length + ' RULE 0 VIOLATION line(s) still in the plant model\x1b[0m');
const bad = Object.keys(cnt).filter(f => cnt[f] > (base[f] || 0));
/* the RULE 0 VIOLATION tags only go down too (ceiling _rule0 in the baseline): a new fit cannot hide behind the tag */
if (base._rule0 != null && viol.length > base._rule0) {
  console.log('FAIL no-snapshot: ' + viol.length + ' RULE 0 VIOLATION tags, more than the ceiling ' + base._rule0 + ' (they only go down; replace the fit by its design source)');
  process.exit(1);
}
if (bad.length) {
  for (const f of bad) console.log('NEW ' + f + ': ' + cnt[f] + ' lines (baseline ' + (base[f] || 0) + '), lines ' + hits[f].join(','));
  console.log('FAIL no-snapshot: a plant snapshot (*.PNG, operating points), plant trend or SOP (PR-OPE) named in the plant model, its start state, tests or judges (user 2026-11-28). Use a design / logic source.');
  process.exit(1);
}
console.log((viol.length ? 'PASS (with ' + viol.length + ' KNOWN FAIL above) ' : 'PASS ') + 'no-snapshot: ' + total + ' lines left in ' + Object.keys(cnt).length + ' files (baseline ' + btotal + '; it only goes down)');
