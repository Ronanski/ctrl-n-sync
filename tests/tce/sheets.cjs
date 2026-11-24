/* The 407 TCE / TCA sheets as ONE running program (src/digital/tce-run.js TCE_RUN.compile / step; plan docs/tcs/SHEETS_AS_LOGIC_PLAN.md
   step 2 and 4). Every sheet is read from its typed drawing, every block is given its macro list meaning, every input is joined to the net
   that drives it (on the sheet, through an off-page connector, a definition, or a PORT for what enters from outside the set), and the set is
   stepped at each sheet's own cycle. Prints the count of sheets that run as their logic (all blocks and macros with a meaning), the ports
   (the I/O binding the lane TCS I/O sets), and fails on:
     - a sheet that does not compile, an input with no net, an order that is not repeatable (two runs from the same start differ);
     - a block meaning that gives a value it should not (a binary block other than 0 / 1);
     - fewer running sheets than the floor below (the count may only go up). */
'use strict';
const fs = require('fs'),
  path = require('path'),
  vm = require('vm');
const root = path.join(__dirname, '..', '..');
const dir = path.join(root, 'src/digital/tce');
const win = {};
vm.runInNewContext(fs.readFileSync(path.join(root, 'src/digital/tce-run.js'), 'utf8'), { window: win });
const R = win.TCE_RUN;
const lib = fs.readFileSync(path.join(dir, '_lib.js'), 'utf8');
const sheets = [];
for (const f of fs.readdirSync(dir).filter(f => /^TC[AE].*\.js$/.test(f)).sort()) {
  const w = {};
  vm.runInNewContext(lib + ';' + fs.readFileSync(path.join(dir, f), 'utf8'), { window: w });
  sheets.push(...(w.TCE_SHEETS || []));
}
/* the count that runs today (beta.381); it may only go up: raise it in the PR that makes more sheets run */
const FLOOR = 204;
let bad = 0;
const fail = m => (bad++, console.log('FAIL', m));
function run(secs) {
  const P = R.compile(sheets);
  for (let i = 0; i < secs * 10; i++) R.step(P, 0.1);
  return P;
}
const t0 = Date.now();
const A = run(30);
const ms = Date.now() - t0;
const B = run(30);
for (let i = 0; i < A.v.length; i++) if (!(A.v[i] === B.v[i] || (Number.isNaN(A.v[i]) && Number.isNaN(B.v[i])))) {
  fail('not repeatable at ' + A.names[i]);
  break;
}
const BIN = /^(A|AND|OR|NOT|EOR|TP|TD|TW|FFR|FFS|CMP|CPL|CNT|FLK|LCK|UCK|TWF|THF|PDF|WCM|MR|G:OR|G:A)$/;
for (const p of A.plan)
  for (const x of p.nodes)
    if (x.t === 'b' && x.f && BIN.test(x.type) && !(A.v[x.out] === 0 || A.v[x.out] === 1)) fail(p.id + ' ' + x.type + ' gives ' + A.v[x.out]);
const S = R.stats(A);
console.log(
  `TCE sheets as logic: ${S.run} of ${S.sheets} sheets run as their logic; blocks ${S.bOk} of ${S.blocks} with a meaning, macros ${S.mOk} of ${S.macros}; ` +
    `30 s of plant time in ${ms} ms`
);
console.log(`ports (the I/O binding): ${S.ports} = ` + Object.entries(S.portKinds).map(([k, n]) => k + ' ' + n).join(', '));
const um = Object.entries(A.unknown).sort((a, b) => b[1] - a[1]);
console.log('without a meaning yet: ' + um.map(([k, n]) => k + ' x' + n).join(', '));
if (process.argv.includes('--list')) {
  console.log('not running: ' + S.notRun.join(' '));
  for (const p of A.ports) console.log('  port ' + p);
}
if (S.run < FLOOR) fail(`running sheets ${S.run} < floor ${FLOOR}`);
if (bad) process.exit(1);
