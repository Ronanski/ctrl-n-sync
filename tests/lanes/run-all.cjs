/* PR 0 (lane plan 2026-11-25): runs every tests/tce/*.cjs except run.cjs (its own step) and every tests/lanes/<lane>/*.cjs (in parallel since
   2026-11-27, below); a lane adds a test as a new file only. Exit 1 when any test exits non-zero. */
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
/* Phase 11 speed (user 2026-11-27 "Bat antagal"): the tests run J at a time (LANES_J, default the CPU count; LANES_J=1 = one after
   the other as before). Each test is its own process with its own output, printed whole when it ends, so the log stays readable. A
   test that needs to run alone (it writes a shared file, or measures time) lists its path in tests/lanes/serial.txt: those run
   after the parallel ones, one at a time. */
const serialF = path.join(lanes, 'serial.txt'),
  serial = fs.existsSync(serialF) ? fs.readFileSync(serialF, 'utf8').split(/\r?\n/).map(l => l.trim()).filter(l => l && l[0] !== '#') : [];
const relOf = f => path.relative(root, f).split(path.sep).join('/');
const J = Math.max(1, +process.env.LANES_J || require('os').cpus().length);
let bad = 0;
const runOne = f =>
  new Promise(res => {
    const t0 = Date.now(),
      out = [],
      c = cp.spawn(process.execPath, [f], { cwd: root });
    c.stdout.on('data', d => out.push(d));
    c.stderr.on('data', d => out.push(d));
    c.on('close', code => {
      process.stdout.write(Buffer.concat(out));
      console.log((code === 0 ? 'PASS ' : 'FAIL ') + relOf(f) + ' (' + ((Date.now() - t0) / 1000).toFixed(0) + ' s)');
      if (code !== 0) bad++;
      res();
    });
  });
(async () => {
  const firstF = path.join(lanes, 'first.txt'),
    first = fs.existsSync(firstF) ? fs.readFileSync(firstF, 'utf8').split(/\r?\n/).map(l => l.trim()).filter(l => l && l[0] !== '#') : [],
    rank = f => { const k = first.findIndex(l => l.replace(/^alone /, '') === relOf(f)); return k < 0 ? first.length : k; };
  let par = list.filter(f => !serial.includes(relOf(f))).sort((a, b) => rank(a) - rank(b)),
    ser = list.filter(f => serial.includes(relOf(f)));
  /* Checks speed (2026-11-28, DOUBLE TIME): LANE_SHARD=i/N runs one part of the list, one Checks job per part (checks.yml matrix).
     The ALONE first lines of tests/lanes/first.txt (the slowest tests, marked "alone") get one part each (parts 0, 1, ...); the rest
     go round-robin over the other parts. Every test runs in exactly one part; without LANE_SHARD everything runs here as before */
  const sh = /^(\d+)\/(\d+)$/.exec(process.env.LANE_SHARD || '');
  if (sh) {
    const I = +sh[1], N = +sh[2],
      alone = fs.existsSync(firstF) ? fs.readFileSync(firstF, 'utf8').split(/\r?\n/).map(l => l.trim()).filter(l => /^alone /.test(l)).map(l => l.slice(6).trim()) : [],
      A = alone.slice(0, N - 1),
      rest = [...par, ...ser].filter(f => !A.includes(relOf(f))),
      mine = I < A.length ? list.filter(f => relOf(f) === A[I]) : rest.filter((f, k) => k % (N - A.length) === I - A.length);
    par = par.filter(f => mine.includes(f));
    ser = ser.filter(f => mine.includes(f));
    list.splice(0, list.length, ...par, ...ser);
    console.log('LANE_SHARD ' + I + '/' + N + ': ' + list.length + ' tests');
  }
  if (process.env.LANE_DRY) { for (const f of list) console.log(relOf(f)); process.exit(0); }
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(J, par.length) }, async () => { while (i < par.length) await runOne(par[i++]); }));
  for (const f of ser) await runOne(f);
  console.log(list.length + ' tests (' + par.length + ' at ' + J + ' at a time, ' + ser.length + ' alone), ' + bad + ' failed');
  process.exit(bad ? 1 : 0);
})();
