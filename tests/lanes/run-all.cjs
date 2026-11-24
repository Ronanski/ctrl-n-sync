/* PR 0 (lane plan 2026-11-25): runs every tests/tce/*.cjs except run.cjs (its own step) and every tests/lanes/<lane>/*.cjs, one after the
   other; a lane adds a test as a new file only. Exit 1 when any test exits non-zero. */
const fs = require('fs'),
  path = require('path'),
  cp = require('child_process');
const root = path.resolve(__dirname, '..', '..');
const list = [];
const tce = path.join(root, 'tests', 'tce');
if (fs.existsSync(tce)) for (const f of fs.readdirSync(tce).sort()) if (/\.cjs$/.test(f) && f !== 'run.cjs') list.push(path.join(tce, f));
const lanes = path.join(root, 'tests', 'lanes');
for (const d of fs.readdirSync(lanes).sort()) {
  const D = path.join(lanes, d);
  if (!fs.statSync(D).isDirectory()) continue;
  for (const f of fs.readdirSync(D).sort()) if (/\.cjs$/.test(f)) list.push(path.join(D, f));
}
let bad = 0;
for (const f of list) {
  const rel = path.relative(root, f).split(path.sep).join('/');
  const r = cp.spawnSync(process.execPath, [f], { cwd: root, stdio: 'inherit' });
  console.log((r.status === 0 ? 'PASS ' : 'FAIL ') + rel);
  if (r.status !== 0) bad++;
}
console.log(list.length + ' tests, ' + bad + ' failed');
process.exit(bad ? 1 : 0);
