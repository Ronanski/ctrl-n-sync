/* Phase 7 VALIDATOR (user "Go 7" 2026-11-25): the QA trace counts (tools/trace/trace.cjs, the running app headless, 150 MW, 2 plant min)
   run in every Checks run and are held against tools/trace/baseline.json:
     up    a count that may not go down (linked I/O, live values, memory on a sheet, sheets running, ...);
     down  a break that may not go up (unlinked I/O, inputs with no source B1, I/O nowhere B2, faceplate with no controller B3, alarm
           with no set point B4, wrong machine copy B5, ...);
     zero  must stay 0 (a NaN in a source chain, an F(X) table not found, an IBD sheet missing, a trip in the steady run).
   A count that moves the good way passes and prints "move the baseline"; the PR that made it moves the number in baseline.json.
   A count that moves the bad way fails, unless baseline.json "why" holds a reason for that key (then it prints both numbers).
   The run is deterministic (same counts twice, checked 2026-11-25). The counts also go to the GitHub step summary. */
const fs = require('fs'),
  path = require('path'),
  os = require('os'),
  cp = require('child_process');
const root = path.resolve(__dirname, '..', '..', '..');
const B = JSON.parse(fs.readFileSync(path.join(root, 'tools/trace/baseline.json'), 'utf8'));
const out = fs.mkdtempSync(path.join(os.tmpdir(), 'trace-gate-'));
const r = cp.spawnSync(process.execPath, [path.join(root, 'tools/trace/trace.cjs'), '--start', '150', '--mins', '2', '--out', out], {
  cwd: root,
  encoding: 'utf8',
  maxBuffer: 64 << 20
});
const jf = path.join(out, 'trace.json');
if (r.status !== 0 || !fs.existsSync(jf)) {
  console.log((r.stdout || '').slice(-2000), (r.stderr || '').slice(-2000));
  console.log('FAIL trace-gate: the QA trace did not run');
  process.exit(1);
}
const C = JSON.parse(fs.readFileSync(jf, 'utf8')).counts;
const get = k => k.split('.').reduce((o, p) => (o == null ? undefined : o[p]), C);
const why = B.why || {};
let bad = 0;
const lines = [],
  better = [];
const row = (k, was, now, rule, ok) => lines.push((ok ? 'ok   ' : 'FAIL ') + k + ': ' + was + ' -> ' + now + ' (' + rule + ')');
for (const [k, was] of Object.entries(B.up)) {
  const now = get(k);
  const ok = typeof now === 'number' && (now >= was || why[k]);
  if (!ok) bad++;
  if (now > was) better.push(k + ' ' + was + ' -> ' + now);
  row(k, was, now, 'may not go down' + (now < was && why[k] ? '; why: ' + why[k] : ''), ok);
}
for (const [k, was] of Object.entries(B.down)) {
  const now = get(k);
  const ok = typeof now === 'number' && (now <= was || why[k]);
  if (!ok) bad++;
  if (now < was) better.push(k + ' ' + was + ' -> ' + now);
  row(k, was, now, 'may not go up' + (now > was && why[k] ? '; why: ' + why[k] : ''), ok);
}
for (const k of B.zero) {
  const now = get(k);
  const ok = now === 0;
  if (!ok) bad++;
  row(k, 0, now, 'must be 0', ok);
}
console.log(lines.join('\n'));
if (better.length) console.log('better than the baseline, move it in tools/trace/baseline.json in this PR: ' + better.join(', '));
const sum = process.env.GITHUB_STEP_SUMMARY;
if (sum) {
  try {
    fs.appendFileSync(sum, '### QA trace counts (Phase 7)\n\n```\n' + lines.join('\n') + '\n```\n');
  } catch (e) {}
}
fs.rmSync(out, { recursive: true, force: true });
console.log((bad ? 'FAIL' : 'PASS') + ' trace-gate: ' + lines.length + ' counts held, ' + bad + ' worse than the baseline');
process.exit(bad ? 1 : 0);
