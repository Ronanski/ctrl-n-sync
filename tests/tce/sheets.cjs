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
for (const f of fs.readdirSync(dir).filter(f => /^(TC[AE]|G-).*\.js$/.test(f)).sort()) {
  const w = {};
  vm.runInNewContext(lib + ';' + fs.readFileSync(path.join(dir, f), 'utf8'), { window: w });
  sheets.push(...(w.TCE_SHEETS || []));
}
/* the count that runs today (beta.401: 204 TCE / TCA + 12 G); it may only go up: raise it in the PR that makes more sheets run */
const FLOOR = 196; /* 2026-11-25: every parameter of every block on the sheet (QA : SAORI); the 2 explanation sheets TCE022 / TCE023 are not logic */
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
/* the generator sheets: SH-G-1A "52G CLOSED INDICATION" is the NOT (NC) of the breaker's OPEN contact; SH-G-1B reads "52G REMOTE
   SELECTED" through circle 45 from the selector of SH-G-1A (310SD03-743 sheets 7 and 8) */
{
  const P = R.compile(sheets),
    rem = P.ports.find(p => /^PLANT:G-1A\.rem /.test(p)),
    op = P.ports.find(p => /^PLANT:G-1A\.op /.test(p));
  for (const [o, r] of [[0, 1], [1, 0]]) {
    R.set(P, op, o);
    R.set(P, rem, r);
    R.step(P, 0.1);
    if (R.get(P, 'G-1A', 'nc') !== 1 - o) fail('G-1A 52G CLOSED (NC of OPEN) = ' + R.get(P, 'G-1A', 'nc') + ' with OPEN ' + o);
    if (R.get(P, 'G-1B', 'i45') !== r) fail('G-1B circle 45 (52G REMOTE SELECTED) = ' + R.get(P, 'G-1B', 'i45') + ' with the selector at ' + r);
  }
}
/* the relay times of SH-G-5A / 5B / 6A / 6B from LM-GEE-2015-0059 R1: 59GNA 10 s, 59A 2nd step 20 s, 81 2 s; 24 2nd step (inverse) not yet */
for (const [sid, key, tp] of [['G-5A', 'd59g', 10], ['G-5A', 'd59b', 20], ['G-6B', 'd4', 2], ['G-5A', 'd24b', null]]) {
  const x = A.plan.find(p => p.id === sid).nodes.find(x => x.out === A.idx.get(sid + ':' + key));
  const got = x && x.f ? +/TP:([\d.]+)/.exec(x.notes[0])[1] : null;
  if (got !== tp) fail(sid + ' ' + key + ' time ' + got + ', want ' + tp);
}
const S = R.stats(A);
const G = A.plan.filter(p => /^G-/.test(p.id)),
  gRun = G.filter(p => !S.notRun.includes(p.id)).length;
console.log(
  `TCE / TCA sheets as logic: ${S.run - gRun} of ${S.sheets - G.length}; generator G sheets: ${gRun} of ${G.length}. All: ${S.run} of ${S.sheets} sheets run as their logic; blocks ${S.bOk} of ${S.blocks} with a meaning, macros ${S.mOk} of ${S.macros}; ` +
    `30 s of plant time in ${ms} ms`
);
console.log(`ports (the I/O binding): ${S.ports} = ` + Object.entries(S.portKinds).map(([k, n]) => k + ' ' + n).join(', '));
const um = Object.entries(A.unknown).sort((a, b) => b[1] - a[1]);
console.log('without a meaning yet: ' + um.map(([k, n]) => k + ' x' + n).join(', '));
/* sheet-to-sheet links (QA : SAORI 2026-11-25: the first connector within the radius took the wire of its neighbour, 292 links read 0):
   every input joined to an output of another sheet resolves to that output's net, never to an unbound connector port */
{
  let joined = 0;
  const lost = [];
  for (const n of A.nets)
    for (const c of n.inputs)
      if (c.src) {
        joined++;
        const nm = A.names[A.res(n.id, c.key)];
        if (nm === 'CON:' + n.id + '.' + c.letter || /^UNK:/.test(nm)) lost.push(n.id + '.' + c.letter + ' <- ' + c.src);
      }
  if (lost.length) fail(lost.length + ' of ' + joined + ' sheet-to-sheet links lost: ' + lost.slice(0, 5).join(', '));
  /* driven: TCE168 output C (HEAT SOAK MODE) set to 1 is what TCE169 reads at its input C */
  const s = A.res('TCE168', A.nets.find(n => n.id === 'TCE168').outputs.find(o => o.key === 'oC').net),
    old = A.v[s];
  A.v[s] = 1;
  if (R.get(A, 'TCE169', 'iHsm') !== 1) fail('TCE169 HEAT SOAK MODE does not follow TCE168 C');
  A.v[s] = old;
}
/* ML 62 PA gives the parameters of the block of its number, by the names printed at its inputs (TCE196 PA3 005 -> I 005 TI / HL / LL) */
{
  const x = A.plan.find(p => p.id === 'TCE196').nodes.find(x => x.key === 'i005');
  if (!x || !x.pa || ['TI', 'HL', 'LL'].some(k => !(k in x.pa))) fail('TCE196 I 005 does not take TI / HL / LL from PA3 005');
  const y = A.plan.find(p => p.id === 'TCE195').nodes.find(x => x.key === 'lms027');
  if (!y || !y.pa || A.names[y.pa.LL] !== 'TCE195:g029') fail('TCE195 LMS 027 LL is not G 029 (the "(LL)" on its riser)');
}
/* the operator station API (lane 9 HMI): crt lists the buttons and lamps; read has no side effect and gives undefined for an unknown key */
{
  const C = R.crt(A),
    n = A.v.length;
  if (C.buttons.length < 100 || C.lamps.length < 500) fail('crt lists ' + C.buttons.length + ' buttons / ' + C.lamps.length + ' lamps');
  if (R.read(A, 'TCE150', 'no such key') !== undefined || A.v.length !== n) fail('read of an unknown key made a value');
  if (R.read(A, 'TCE150', 'TCE150_1_IIS') === undefined) fail('read of the CRT lamp TCE150_1_IIS by its tag');
  const O = R.outs(A);
  if (!O.some(o => o.kind === 'pio') || !O.some(o => o.kind === 'crt')) fail('outs lists no PI/O or CRT outputs');
}
/* the open-item rule: a missing parameter, a parameter the macro list does not define, or an unwired SW keeps the block open */
if (!R.need('SG', [], true).length) fail('SG with no K must be open');
if (R.need('PIV', ['G1:1', 'G2:1', 'TI:1'], true).length) fail('PIV with G1 G2 TI must not be open');
if (!R.need('PIV', ['G1:1', 'G2:1', 'TI:1', 'HL:100'], true).length) fail('PIV with HL printed must be open');
if (!R.need('TP', ['TP:1'], false).length) fail('TP with no SW wire must be open');
if (!R.need('FG', ['X1:0', 'Y1:0'], true).length) fail('FG with one point must be open');
const nOpen = Object.values(S.open).reduce((a, v) => a + v.length, 0);
console.log('open items (sheet, reason): ' + nOpen + ' in ' + Object.keys(S.open).length + ' reasons');
if (process.argv.includes('--list')) {
  for (const [w, ids] of Object.entries(S.open)) console.log('  open: ' + w + ': ' + ids.join(' '));
  console.log('not running: ' + S.notRun.join(' '));
  for (const p of A.ports) console.log('  port ' + p);
}
if (S.run < FLOOR) fail(`running sheets ${S.run} < floor ${FLOOR}`);
if (bad) process.exit(1);
