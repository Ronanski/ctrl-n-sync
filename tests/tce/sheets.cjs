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
const FLOOR = 208; /* 2026-11-25: every parameter of every block on the sheet (QA : SAORI); the 2 explanation sheets TCE022 / TCE023 are not logic */
/* sheets that run with a macro meaning from the manual text (inside not drawn: TRIPPLE INPUT / AI DIAG.MD / TMR AI DIAGNOSTICS), counted
   apart from FLOOR (QA column "from manual text, not drawing-complete") until the user decides */
const FLOOR_TEXT = 99;
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
/* the macros from the manual text (lane 2 specs 01 / 02 / 04): 2 out of 3, the range / rate check with SIM on abnormal, the TMR middle */
{
  const M = R.MACRO,
    tri = M['TRIPPLE INPUT DIAGNOSTICS'],
    st = {},
    nt = [[0, 0, 'TP:3.0']];
  if (tri.src !== R.TEXT) fail('TRIPPLE INPUT DIAGNOSTICS is not marked ' + R.TEXT);
  let o;
  for (let i = 0; i < 29; i++) o = tri({ IN1: 1, IN2: 1, IN3: 0 }, nt, st, 0.1);
  if (o.OUT !== 1 || o['DEV E'] !== 0) fail('TRIPPLE 1 1 0 for 2.9 s gives ' + JSON.stringify(o));
  o = tri({ IN1: 1, IN2: 1, IN3: 0 }, nt, st, 0.1);
  if (o['DEV E'] !== 1) fail('TRIPPLE 1 1 0 for 3 s gives no DEV E');
  if (tri.need([]).join() !== 'TP') fail('TRIPPLE with no TP printed must be open');
  const ai = M['AI DIAG.MD'],
    an = [[1019, 414, 'H/L HL:65.2'], [1041, 435, 'LL:54.5'], [1019, 456, 'DEF TP:0.18S'], [1020, 371, 'DEF N:3'], [1180, 371, 'DEV HL:10.0'], [1200, 392, 'LL:-10.0'], [1180, 414, 'DEF TP:0.03S'], [1180, 435, 'DEF N:3']],
    as = {};
  for (let i = 0; i < 10; i++) o = ai({ IN: 60, ERR: 0, SIM: 59 }, an, as, 0.1);
  if (o.OUT !== 60 || o.ABN !== 0) fail('AI DIAG 60 Hz in 54.5 ~ 65.2 gives ' + JSON.stringify(o));
  for (let i = 0; i < 10; i++) o = ai({ IN: 0, ERR: 0, SIM: 59 }, an, as, 0.1);
  if (o.OUT !== 59 || o.ABN !== 1) fail('AI DIAG 0 Hz under LL 54.5 gives ' + JSON.stringify(o) + ', want SIM 59 and ABN');
  if (ai({ IN: 60, ERR: 1, SIM: 59 }, an, {}, 0.1).ABN !== 1) fail('AI DIAG with its PI/O error is not abnormal');
  if (!ai.need(an.slice(0, 7)).includes('DEV N')) fail('AI DIAG with no DEV group DEF N must be open');
  const tmr = M['TMR AI DIAGNOSTICS'],
    tn = [[0, 0, 'TP:1.0'], [0, 0, 'DELAY TP:3.0s']],
    ts = {},
    lim = { HL: 51, LL: -2.5, DEV: 10, SIM: -10 };
  for (let i = 0; i < 40; i++) o = tmr({ SIG1: 20, SIG2: 22, SIG3: 40, ERR1: 0, ERR2: 0, ERR3: 0, ...lim }, tn, ts, 0.1);
  if (o.OUT !== 22 || o['DEV E'] !== 1 || o.ABN !== 0 || o.ERR !== 0) fail('TMR AI 20 / 22 / 40 gives ' + JSON.stringify(o));
  for (let i = 0; i < 11; i++) o = tmr({ SIG1: 20, SIG2: 22, SIG3: 40, ERR1: 0, ERR2: 1, ERR3: 1, ...lim }, tn, ts, 0.1);
  if (o.OUT !== -10 || o.ABN !== 1 || o.ERR !== 1) fail('TMR AI with two channels in error gives ' + JSON.stringify(o) + ', want SIM -10');
  /* DUAL INPUT: one value bad = the other; DEV E after DELAY TP; TMR LVDT: the stray channel is in error and left out; VALVE DIAGNOSIS:
     position out of the H/L band = ABN.O, position away from the demand 5 s = ABN.M */
  const du = M['DUAL INPUT DIAGNOSTICS'],
    dn = [[0, 0, 'TP:3.0'], [0, 0, 'DELAY TP:3.0s']],
    ds = {},
    dl = { HL: 100, LL: 0, DEV: 5, SIM: -1, 'I-ERR2': 0 };
  for (let i = 0; i < 31; i++) o = du({ SIG1: 50, SIG2: 60, 'I-ERR1': 1, ...dl }, dn, ds, 0.1);
  if (o.OUT !== 60 || o.ABN !== 0 || o['DEV E'] !== 1 || o['I-ERR'] !== 1) fail('DUAL INPUT 50 (abnormal) / 60 gives ' + JSON.stringify(o));
  const lv = M['TMR LVDT DIAGNOSIS'],
    ln = [1, 2, 3].flatMap(k => [[0, k * 100, 'HL:1.0'], [0, k * 100 + 1, 'LL:-1.0'], [0, k * 100 + 2, 'DELAY TP:3.0s']]),
    ls = {};
  for (let i = 0; i < 31; i++) o = lv({ SIG1: 50, SIG2: 50.5, SIG3: 60, DEV: 0, 'ANN SW': 1 }, ln, ls, 0.1);
  if (o.ERR3 !== 1 || o.ERR1 !== 0 || o.OUT !== 50.25) fail('TMR LVDT 50 / 50.5 / 60 gives ' + JSON.stringify(o));
  const vd = M['VALVE DIAGNOSIS'],
    vn = A.plan.find(p => p.id === 'TCE121').nodes.find(x => x.t === 'M' && x.name === 'VALVE DIAGNOSIS').notes,
    vs = {};
  for (let i = 0; i < 51; i++) o = vd({ 'POS.': 40, AMP: 0, DEMAND: 70, 'ANN.EN': 1 }, vn, vs, 0.1);
  if (o['ABN.M'] !== 1 || o['ABN.O'] !== 0) fail('VALVE DIAGNOSIS 40 % against a demand of 70 % for 5 s gives ' + JSON.stringify(o));
  if (vd({ 'POS.': 110, AMP: 0, DEMAND: 110, 'ANN.EN': 1 }, vn, {}, 0.1)['ABN.O'] !== 1) fail('VALVE DIAGNOSIS 110 % is not ABN.O');
  /* TRIPLE DETECTOR2 = the middle of three, DEV after TP; 2OO3 = two of three (TCE060 ~ TCE069, typed as macro blocks) */
  const td = M['TRIPLE DETECTOR2'],
    tdn = [[0, 0, 'TP:1.0'], [0, 1, 'TP:1.0'], [0, 2, 'TP:1.0']],
    tds = {};
  for (let i = 0; i < 11; i++) o = td({ 'IN A': 10, 'IN B': 30, 'IN C': 11, DEV: 5 }, tdn, tds, 0.1);
  if (o.OUT !== 11 || o.DEV !== 1) fail('TRIPLE DETECTOR2 10 / 30 / 11 gives ' + JSON.stringify(o));
  if (M['2OO3']({ IN1: 1, IN2: 0, IN3: 1 }).OUT !== 1 || M['2OO3']({ IN1: 1, IN2: 0, IN3: 0 }).OUT !== 0) fail('2OO3 is not two out of three');
  const t60 = A.plan.find(p => p.id === 'TCE060').nodes.find(x => x.t === 'M' && x.name === 'TRIPLE DETECTOR2');
  if (!t60 || A.names[t60.ins['IN C']] !== 'TCE060:tmr3.OUT') fail('TCE060 TRIPLE DETECTOR2 IN C is not the third TMR AI DIAGNOSTICS');
  /* MOTOR STANDARD from IBD 310SC90-794 sheet 14: START PB in MANUAL starts; no MCC answer for 3 s = START FAULT (stop, ANN) until RESET;
     AUTO START works only in AUTO */
  const mo = M['MOTOR STANDARD'],
    mn = [[0, 0, 'TD:1.0s'], [0, 0, 'TP:3.0s'], [0, 0, 'TP:3.0s'], [0, 0, 'TP:0.5s']],
    ms = {},
    base = { ASRT: 0, ASTP: 0, TRP: 0, EF: 0, RUN: 0, 'PB START': 0, 'PB STOP': 0, 'PB AUTO': 0, 'PB MANUAL': 0, 'PB RESET': 0 },
    m = (q, n = 1) => {
      for (let i = 0; i < n; i++) o = mo({ ...base, ...q }, mn, ms, 0.1);
      return o;
    };
  if (m({ 'PB START': 1 }).STS !== 1) fail('MOTOR STANDARD: START PB in MANUAL gives no start');
  m({}, 28);
  if (o.ABN !== 0 || o.STS !== 1) fail('MOTOR STANDARD: start fault before 3 s ' + JSON.stringify(o));
  m({}, 2);
  if (o.ABN !== 1 || o.STS !== 0 || o.OUT !== 1) fail('MOTOR STANDARD: no answer 3 s is not a start fault ' + JSON.stringify(o));
  if (m({ 'PB RESET': 1 }).ABN !== 0) fail('MOTOR STANDARD: RESET does not clear the start fault');
  if (m({ ASRT: 1 }).STS !== 0) fail('MOTOR STANDARD: AUTO START works in MANUAL');
  m({ 'PB AUTO': 1 });
  if (m({ ASRT: 1, RUN: 1 }, 20).STS !== 1 || o.AUTO !== 1 || o.ABN !== 0) fail('MOTOR STANDARD: AUTO START in AUTO ' + JSON.stringify(o));
  if (m({ RUN: 0 }).ABN !== 1) fail('MOTOR STANDARD: answer lost while running is not TRIPPED');
  if (mo.need([]).length !== 2) fail('MOTOR STANDARD with no TD / TP printed must be open');
  /* TORQUE (SEAL-IN) from IBD 310SC90-794 sheet 16: PB OPEN in MANUAL seals in the open command until LIMIT FULL OPEN; no full open
     in t1 (TP 35 s) = OPEN FAULT (ANN 2) until RESET; AUTO CLOSE works only in AUTO and stops on the close torque switch */
  const tq = M['TORQUE (SEAL-IN)'],
    tqn = [[0, 0, 'TD:5.0s'], [0, 0, 'TP:35.0s'], [0, 0, 'TP:35.0s'], [0, 0, 'TP:5.0s']],
    tqs = {},
    tqb = { AOP: 0, ACL: 0, EF: 0, LTOP: 0, TROP: 0, LTCL: 1, TRCL: 0, 'PB OPEN': 0, 'PB CLOSE': 0, 'PB AUTO': 0, 'PB MANUAL': 0, 'PB RESET': 0 },
    tqr = (x, n = 1) => {
      for (let i = 0; i < n; i++) o = tq({ ...tqb, ...x }, tqn, ts, 0.5);
      return o;
    };
  if (tqr({ 'PB OPEN': 1 }).OPS !== 1) fail('TORQUE (SEAL-IN): PB OPEN in MANUAL gives no open command');
  if (tqr({ LTCL: 0 }, 10).OPS !== 1) fail('TORQUE (SEAL-IN): the open command does not seal in after the PB is released');
  if (tqr({ LTCL: 0, LTOP: 1 }).OPS !== 0 || o.ABN !== 0) fail('TORQUE (SEAL-IN): LIMIT FULL OPEN does not stop the open command ' + JSON.stringify(o));
  tqr({ LTCL: 0, LTOP: 0, 'PB OPEN': 0 });
  tqr({ LTCL: 0, 'PB OPEN': 1 });
  tqr({ LTCL: 0 }, 68);
  if (o.ABN !== 0 || o.OPS !== 1) fail('TORQUE (SEAL-IN): open fault before t1 ' + JSON.stringify(o));
  tqr({ LTCL: 0 }, 2);
  if (o.ABN !== 1 || o.OPS !== 0) fail('TORQUE (SEAL-IN): no full open in t1 is not an open fault ' + JSON.stringify(o));
  if (tqr({ LTCL: 0, 'PB RESET': 1 }).ABN !== 0) fail('TORQUE (SEAL-IN): RESET does not clear the open fault');
  if (tqr({ LTCL: 0, ACL: 1 }).CLS !== 0) fail('TORQUE (SEAL-IN): AUTO CLOSE works in MANUAL');
  tqr({ LTCL: 0, 'PB AUTO': 1 });
  if (tqr({ LTCL: 0, ACL: 1 }, 4).CLS !== 1 || o.AUTO !== 1) fail('TORQUE (SEAL-IN): AUTO CLOSE in AUTO ' + JSON.stringify(o));
  if (tqr({ LTCL: 0, ACL: 1, TRCL: 1 }).CLS !== 0 || o.ABN !== 1) fail('TORQUE (SEAL-IN): close torque before full close must stop and alarm ' + JSON.stringify(o));
  if (tq.need([]).length !== 1) fail('TORQUE (SEAL-IN) with no t1 / t2 printed must be open');
  /* every PI/O output box names its table row (QA : SORA 2026-11-25: the COMM / EHG output sheets print it over the PI/O mark, left of the
     box): TCA831 = TCA980-17 .. 32, TCE610 holds TCE970-6 (speed AO) */
  {
    const O = R.outs(A).filter(o => o.kind === 'pio');
    const r831 = O.filter(o => o.sheet === 'TCA831').map(o => o.row).sort();
    if (r831.join() !== Array.from({ length: 16 }, (_, i) => 'TCA980-' + (17 + i)).sort().join()) fail('TCA831 outputs do not name TCA980-17 .. 32: ' + r831);
    if (!O.some(o => o.sheet === 'TCE610' && o.row === 'TCE970-6')) fail('TCE610 has no output row TCE970-6');
    const miss = O.filter(o => !o.row && !/^G-/.test(o.sheet));
    if (miss.length) fail('PI/O outputs with no table row: ' + miss.map(o => o.sheet + '.' + o.key).join(' '));
  }
  /* a PI/O error box is its own signal, never the value of the same table row (TCA040 DI 1 and the card error both print "(TCA900-1)") */
  const v = A.plan.find(p => p.id === 'TCA322').nodes.find(x => x.t === 'M' && /TCA932-3 ERR$/.test(A.names[x.ins.ERR]));
  if (!v || v.ins.IN === v.ins.ERR) fail('TCA322 line 3: the AI value and its PI/O error are one net');
}
const G = A.plan.filter(p => /^G-/.test(p.id)),
  gRun = G.filter(p => !S.notRun.includes(p.id)).length;
console.log(
  `drawing-complete: ${S.run - S.runText.length}; with a macro from the manual text (inside not drawn): ${S.runText.length} (macros ${S.mText}). ` +
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
  console.log('running with a manual-text macro: ' + S.runText.join(' '));
  for (const p of A.ports) console.log('  port ' + p);
}
if (S.run - S.runText.length < FLOOR) fail(`drawing-complete sheets ${S.run - S.runText.length} < floor ${FLOOR}`);
if (S.runText.length < FLOOR_TEXT) fail(`sheets with a manual-text macro ${S.runText.length} < floor ${FLOOR_TEXT}`);
if (bad) process.exit(1);
