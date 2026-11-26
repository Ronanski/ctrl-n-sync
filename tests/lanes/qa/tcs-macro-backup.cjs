/* QA (Phase 6 TCS slice B, 2026-11-26): the macro insides from the HIACS backup (tce-run.js BKM, source /mnt/project-files/tcs-macros.json,
   TCE station backup 2018-07-14). Checks each inside against its own backup numbers (not against a value chosen to pass):
   UNT-FG TCE212 003 = the three backup FG curves joined at 52 and 89; TRIPPLE INPUT DIAGNOSTICS = 2 out of 3, DEV E after TP 3 s held
   until ANN RESET; HMI INDI FOR VALVE ABN.O = any abnormal pair; and the count of macros that run from the backup may not fall.
   Usage: node tests/lanes/qa/tcs-macro-backup.cjs */
const fs = require('fs'),
  path = require('path'),
  vm = require('vm');
const root = path.resolve(__dirname, '..', '..', '..');
const win = {};
vm.runInNewContext(fs.readFileSync(root + '/src/digital/tce-run.js', 'utf8'), { window: win });
const R = win.TCE_RUN;
const FLOOR = 41; /* + Phase 5: DUAL INPUT DIAGNOSTICS TCE101, VALVE TEST TCE220 x2 / TCE222 x2 / TCE226 x2 */ /* + slice F: CHANGE OVER TCE172 (LME300 + 301), HEAT SOAK CONTROL TCE207 (LME242 + 243) */ /* + slice D: CV WARMING SET x2, CRT OPE INC/DEC TCE194 / TCE205, L-RATE TCE185 */ /* 8 HMI INDI + HEAT SOAK SELECT + ACCELERATION RELAY + TRIPPLE TCE145 + 2 UNT-FG TCE212 + 7 LME286 on TCE500 / TCE502
   + 6 VALVE CONTROL MT1 (TCE210, TCE211, TCE212 x2, TCE214 x2; slice C) + TURNING GEAR TCE350 */
let fail = 0;
const ck = (ok, w) => (console.log((ok ? 'PASS ' : 'FAIL ') + w), ok || fail++);
const mk = (sheet, no) => {
  const f = R.bkMacro(sheet, no);
  if (f) for (const r of f.refs) f.map[r] = r;
  return f;
};
const run = (f, I, st, n, dt) => {
  let O;
  for (let i = 0; i < n; i++) O = f(I, [], st, dt);
  return O;
};
// UNT-FG TCE212 003: FG 014 (X <= 52), FG 012 (52 < X <= 89), FG 010 (X > 89)
{
  const f = mk('TCE212', '003');
  ck(!!f && f.lme === 'LME010', 'TCE212 003 is the backup UNT-FG (LME010)');
  const y = X => f({ X }, [], {}, 0.1).Y;
  const pts = [[-10, -5], [0, 0], [24, 11.4], [52, 27.88], [72, 37], [89, 46.2], [95, 60.6], [100, 105], [120, 105]];
  for (const [X, Y] of pts) ck(Math.abs(y(X) - Y) < 1e-9, 'UNT-FG 003 X ' + X + ' -> ' + Y + ' (got ' + y(X) + ')');
  ck(Math.abs(y(26) - (12.143 + (13.7 - 12.143) / 4)) < 1e-9, 'UNT-FG 003 straight between points (X 26)');
  const g = mk('TCE212', '036');
  ck(Math.abs(g({ X: 60 }, [], {}, 0.1).Y - 25.3) < 1e-9 && Math.abs(g({ X: 92 }, [], {}, 0.1).Y - 45.3) < 1e-9, 'UNT-FG 036 uses its own backup curve (60 -> 25.3, 92 -> 45.3)');
}
// TRIPPLE INPUT DIAGNOSTICS TCE145 005
{
  const f = mk('TCE145', '005');
  ck(!!f && f.lme === 'LME105', 'TCE145 005 is the backup TRIPPLE INPUT DIAGNOSTICS (LME105)');
  const st = {};
  let O = run(f, { IN1: 1, IN2: 1, IN3: 0, 'DEF INITIAL': 1, 'DEF ANNRESET': 0 }, st, 20, 0.1);
  ck(O.OUT === 1 && O.DEVE === 0, '2 of 3 on: OUT 1, DEV E not yet at 2.0 s');
  O = run(f, { IN1: 1, IN2: 1, IN3: 0, 'DEF INITIAL': 1, 'DEF ANNRESET': 0 }, st, 11, 0.1);
  ck(O.DEVE === 1, 'DEV E after the inputs differ 3 s (TP 3)');
  O = run(f, { IN1: 1, IN2: 1, IN3: 1, 'DEF INITIAL': 1, 'DEF ANNRESET': 0 }, st, 5, 0.1);
  ck(O.DEVE === 1, 'DEV E held when the inputs agree again (FFS)');
  O = run(f, { IN1: 1, IN2: 1, IN3: 1, 'DEF INITIAL': 1, 'DEF ANNRESET': 1 }, st, 1, 0.1);
  ck(O.DEVE === 0 && O.OUT === 1, 'ANN RESET clears DEV E');
  O = run(f, { IN1: 1, IN2: 0, IN3: 0, 'DEF INITIAL': 1, 'DEF ANNRESET': 0 }, st, 1, 0.1);
  ck(O.OUT === 0, '1 of 3 on: OUT 0');
}
// HMI INDI FOR VALVE TCE450 002
{
  const f = mk('TCE450', '002');
  const z = Object.fromEntries(f.pins.map(p => [p, 0]));
  ck(f({ ...z }, [], {}, 0.1)['ABN.O'] === 0, 'HMI INDI: no abnormal input, ABN.O 0');
  ck(f({ ...z, ABNB: 1 }, [], {}, 0.1)['ABN.O'] === 1, 'HMI INDI: ABNB on, ABN.O 1');
}
// VALVE CONTROL MT1 TCE210 003 (LME244): RL 023 rate set on line by PA24 (RI = OP.SPD / TO.SPD, RD = CL.SPD / TC.SPD)
{
  const f = mk('TCE210', '003');
  ck(!!f && f.lme === 'LME244', 'TCE210 003 is the backup VALVE CONTROL MT1 (LME244)');
  const st = {},
    I = { DEMAND: 0, 'CL.POS.': -5, TEST: 0, CLOSE: 0, WARM: 0, 'TO.SPD': 1, 'OP.SPD': 10, 'TC.SPD': 2, 'CL.SPD': 1e300, 'DEF INITIAL': 1, 'DEF FORCEDCLOSE': 0 };
  run(f, I, st, 3, 0.1);
  let O = run(f, { ...I, DEMAND: 50 }, st, 10, 0.1);
  ck(Math.abs(O.DEMAND - 10) < 1e-9, 'opening: DEMAND 0 -> 50 rises at OP.SPD 10 %/s (1 s: ' + O.DEMAND + ')');
  O = run(f, { ...I, DEMAND: 50 }, st, 50, 0.1);
  ck(Math.abs(O.DEMAND - 50) < 1e-9, 'reaches the demand 50');
  O = run(f, { ...I, DEMAND: 20 }, st, 1, 0.1);
  ck(Math.abs(O.DEMAND - 20) < 1e-9, 'closing at CL.SPD (MAX): 50 -> 20 in one scan');
  O = run(f, { ...I, DEMAND: 20, TEST: 1 }, st, 1, 0.1);
  ck(O['D.TEST'] === 1, 'TEST: D.TEST set');
  const y0 = O.DEMAND;
  O = run(f, { ...I, DEMAND: 20, TEST: 1 }, st, 10, 0.1);
  ck(Math.abs(y0 - 19.8) < 1e-9 && Math.abs(O.DEMAND - 17.8) < 1e-9, 'TEST: towards CL.POS. at TC.SPD 2 %/s (' + y0 + ' -> ' + O.DEMAND + ')');
  O = run(f, { ...I, DEMAND: 20, CLOSE: 1 }, st, 1, 0.1);
  ck(O.DEMAND === -5, 'CLOSE: output = CL.POS. at once (RL SW off)');
}
// TURNING GEAR TCE350 010 (LME030): screen buttons AUTO / MANUAL / START / STOP, each only with CRT AVAILABLE
{
  const f = mk('TCE350', '010'),
    st = {},
    I = { EL: 0, 'PB START': 0, 'PB AUTO': 0, 'PB MANUAL': 0, 'PB STOP': 0, 'PB CRT AVAILABLE': 1 },
    r = x => f({ ...I, ...x }, [], st, 0.1);
  ck(!!f && f.lme === 'LME030' && f.pb.length === 5, 'TCE350 010 is the backup TURNING GEAR (LME030) with 5 screen buttons');
  ck(r({}).MANU === 1, 'starts in MANUAL');
  ck(r({ 'PB AUTO': 1 }).AUTO === 1 && r({}).AUTO === 1, 'AUTO pressed: AUTO, held');
  ck(r({ 'PB MANUAL': 1 }).MANU === 1, 'MANUAL pressed: back to MANUAL');
  ck(r({ 'PB START': 1 }).STS === 1 && r({ 'PB STOP': 1 }).STOP === 1, 'START / STOP in MANUAL');
  ck(r({ 'PB AUTO': 1, 'PB CRT AVAILABLE': 0 }).AUTO === 0, 'no button acts without CRT AVAILABLE');
}
// slice D: CRT OPE INC/DEC TCE194 001 (LME025), L-RATE TCE185 003 (LME043), CV WARMING SET TCE155 002 (LME131)
{
  const f = mk('TCE194', '001'),
    I = { PERM: 1, Z: 40, RATE: 10, X: 33, INC: 0, DEC: 0, HSS: 0, LSS: 0, 'PB SYNCHRO': 0, 'PB SV-C': 50 };
  ck(!!f && f.lme === 'LME025', 'TCE194 001 is the backup CRT OPE INC/DEC (LME025)');
  let O = f(I, [], {}, 0.1);
  ck(O.MANU === 0 && O.OUT === 33, 'no SYNCHRO: MANU 0, OUT = X');
  O = f({ ...I, 'PB SYNCHRO': 1 }, [], {}, 0.1);
  ck(O.MANU === 1 && O.OUT === 1, 'SYNCHRO with PERM: MANU 1, OUT = screen set value - Z held to +-1 (50 - 40 -> 1)');
  O = f({ ...I, LSS: 1 }, [], {}, 0.1);
  ck(Math.abs(O.OUT - -0.3) < 1e-12, 'LSS: OUT = SC(RATE x 0.03) = -0.3 (SC = sign change, derived)');
  const g = mk('TCE185', '003'),
    st = {},
    J = { PER: 1, TR: 7, SW: 1, 'PB SYNCH': 1, 'PB SV-C': 3 };
  ck(!!g && g.lme === 'LME043', 'TCE185 003 is the backup L-RATE (LME043)');
  ck(g(J, [], st, 0.1).OUT === 3, 'L-RATE SYNCH: tracks the screen value 3');
  ck(g({ ...J, 'PB SYNCH': 0, 'PB SV-C': 9 }, [], st, 0.1).OUT === 3, 'L-RATE no SYNCH: holds 3 (I / D off)');
  ck(g({ ...J, SW: 0, 'PB SYNCH': 0 }, [], st, 0.1).OUT === 7, 'L-RATE SW off: tracks TR 7');
  const h = mk('TCE155', '002'),
    s2 = {},
    K0 = { FOPN: 0, 'CL.POS': 5, FCLS: 1, RATE: 100, 'OP.POS': 60, 'DEF TURBINETRIP': 0, 'DEF INITIAL': 1 };
  ck(!!h && h.lme === 'LME131', 'TCE155 002 is the backup CV WARMING SET (LME131)');
  let Q;
  for (let i = 0; i < 20; i++) Q = h(K0, [], s2, 0.1);
  ck(Q.SET === 5, 'CV warming FCLS: SET goes to CL.POS (5)');
}
// slice F: CHANGE OVER TCE172 8 (LME300 + LME301), HEAT SOAK CONTROL TCE207 007 (LME242 + LME243): two backup files, one macro
{
  const f = mk('TCE172', '8'),
    st = {},
    I = { PERM: 1, TEST: 0, GS: 0, LS: 0, GM: 0, LM: 0, LIMIT: 0, USE: 1, GOV: 50, LLM: 60, 'DEF 52GCLOSE': 1, 'DEF TURBINETRIP': 0, 'DEF ALLVALVECLOSED': 0, 'DEF INITIAL': 1, 'DEF CRTOPEPERM': 1 };
  ck(!!f && f.lme === 'LME300', 'TCE172 8 is the backup CHANGE OVER (LME300 + LME301)');
  let O = run(f, I, st, 3, 0.1);
  ck(O.GOV === 1 && O.LLM === 0 && O.LC === 0, 'start: governor in control (GOV 1, LLM 0)');
  O = run(f, { ...I, LS: 1 }, st, 3, 0.1);
  ck(O.LC === 1 && O.GOV === 1, 'LS with load limit above governor + 0.1: change to load limit running (LC 1)');
  O = run(f, { ...I, LLM: 49.8 }, st, 3, 0.1);
  ck(O.LC === 0 && O.LLM === 1 && O.GOV === 0, 'load limit comes under governor - 0.1: LC ends, load limit in control (LLM 1, GOV 0)');
  ck(O.FIN === 1, 'USE and the two within 5: FIN 1');
  O = run(f, { ...I, LLM: 49.8, 'DEF TURBINETRIP': 1 }, st, 2, 0.1);
  ck(O.GOV === 1 && O.LLM === 0, 'turbine trip: back to governor');
  const h = mk('TCE207', '007'),
    s2 = {},
    J = { DEMAND: 30, OPEN1: 4, OPEN2: 0, CVHLD: 0, CONT: 0, HOLD: 0, RESET: 0, 'S.SEL1': 0, 'S.SEL2': 0, 'S.TARG': 0, 'DEF HEATSOAKCONTROL': 0, 'DEF ALLVALVECLOSED': 0, 'DEF INITIAL': 1 };
  ck(!!h && h.lme === 'LME242', 'TCE207 007 is the backup HEAT SOAK CONTROL (LME242 + LME243)');
  O = run(h, J, s2, 3, 0.1);
  ck(O.ICV === 30 && O['BIAS.C'] === 1 && O.CV === 0, 'heat soak off: ICV = DEMAND 30, bias cleared (BIAS.C 1), CV 0');
  O = run(h, { ...J, 'DEF HEATSOAKCONTROL': 1 }, s2, 3, 0.1);
  ck(Math.abs(O.CV - 34) < 1e-9, 'heat soak on: CV = DEMAND 30 + CV opening bias OPEN1 4 (got ' + O.CV + ')');
  O = run(h, { ...J, 'DEF ALLVALVECLOSED': 1 }, s2, 3, 0.1);
  ck(O.ICV === 0, 'all valves closed: ICV 0');
}
// Phase 5: DUAL INPUT DIAGNOSTICS TCE101 001 (LME110 + LME110A, MJL / ASWW), VALVE TEST TCE222 005 (LME253), TCE220 002 (LME252), TCE226 036 (LME250)
{
  const f = mk('TCE101', '001'),
    st = {},
    I = { SIG1: 100, SIG2: 102, HL: 153, LL: -7.5, DEV: 30, M: 10000, S: 1, 'I-ERR1': 0, 'I-ERR2': 0, SIM: 0, 'DEF SIMULATIONUSE': 0, 'DEF OUTSIDESIMULATION': 0, 'DEF ANNENABLE': 1, 'DEF INITIAL': 1, 'DEF ANNRESET': 0 };
  ck(!!f && f.lme === 'LME110', 'TCE101 001 is the backup DUAL INPUT DIAGNOSTICS (LME110 + LME110A)');
  let O = run(f, I, st, 5, 0.1);
  ck(O.OUT === 100 && O.ERR === 0 && O.ABN === 0 && O.DEVE === 0, 'two good transmitters: OUT = the lower (100), no alarm');
  O = run(f, { ...I, SIG1: 200 }, st, 5, 0.1);
  ck(O.OUT === 102 && O.ERR1 === 0, 'SIG1 over HL 153: OUT = SIG2 (102) at once, ERR1 not yet (3 s)');
  O = run(f, { ...I, SIG1: 200 }, st, 30, 0.1);
  ck(O.ERR1 === 1 && O.ERR === 1 && O.DEVE === 1 && O.ABN === 0, 'after 3 s: ERR1, ERR and DEV E (98 > 30) latched, ABN 0');
  O = run(f, { ...I, SIG1: 200, SIG2: -20 }, st, 40, 0.1);
  ck(O.OUT === 102 && O.ABN === 1, 'both bad: OUT holds 102, ABN 1');
  O = run(f, { ...I, 'DEF ANNRESET': 1 }, st, 2, 0.1);
  ck(O.ERR === 0 && O.ABN === 0 && O.DEVE === 0 && O.OUT === 100, 'both good again + ANN RESET: alarms clear, OUT 100');
  O = run(f, { ...I, 'DEF SIMULATIONUSE': 1, SIM: 50 }, st, 2, 0.1);
  ck(O.OUT === 50, 'SIMULATION USE: both signals = SIM (50)');
  const v = mk('TCE222', '005'),
    s2 = {},
    J = { PPERM: 1, COMP: 1, PPOS: 0, 'DEF CRTOPEPERM': 1, 'DEF INITIAL': 1, 'PB PARTIAL TEST': 0, 'PB CRT AVAILABLE': 1, 'PB CANCEL': 0 };
  ck(!!v && v.lme === 'LME253', 'TCE222 005 is the backup VALVE TEST(1) (LME253)');
  ck(run(v, { ...J, 'PB PARTIAL TEST': 1 }, s2, 1, 1).PTEST === 1 && run(v, J, s2, 10, 1).PTEST === 1, 'PARTIAL TEST with PPERM: test on, held after the button');
  ck(run(v, J, s2, 195, 1).PTEST === 0, 'stops after 200 s (TP 012, drawing value; backup 60 s)');
  run(v, { ...J, 'PB PARTIAL TEST': 1 }, s2, 1, 1);
  ck(run(v, { ...J, COMP: 0 }, s2, 1, 1).PTEST === 0, 'NOT COMP stops the test');
  ck(run(v, { ...J, 'PB PARTIAL TEST': 1, 'PB CRT AVAILABLE': 0 }, s2, 2, 1).PTEST === 0, 'no CRT AVAILABLE: the button does nothing');
  const w = mk('TCE220', '002'),
    s3 = {},
    K0 = { FPERM: 1, PPERM: 1, COMP: 1, PPOS: 0, CLOSE: 0, 'DEF CRTOPEPERM': 1, 'DEF INITIAL': 1, 'PB FULL TEST': 0, 'PB PARTIAL TEST': 0, 'PB CRT AVAILABLE': 1, 'PB CANCEL': 0 };
  ck(!!w && w.lme === 'LME252', 'TCE220 002 is the backup VALVE TEST (LME252)');
  run(w, { ...K0, 'PB FULL TEST': 1 }, s3, 1, 1);
  ck(run(w, { ...K0, CLOSE: 1 }, s3, 3, 1).FTEST === 1 && run(w, { ...K0, CLOSE: 1 }, s3, 3, 1).FTEST === 0, 'FULL TEST stops when CLOSE has been on 5 s');
  O = run(w, { ...K0, 'PB CANCEL': 1 }, s3, 1, 1);
  ck(O.CNCL === 1 && run(w, K0, s3, 3, 1).CNCL === 0, 'CANCEL: the cancel pulse (TW 3 s)');
  const x = mk('TCE226', '036'),
    s4 = {},
    L0 = { 'TEST.C': 1, PERM: 1, COMP: 1, 'REST.C': 0, OPEN: 0, CLS: 0, 'DEF CRTOPEPERM': 1, 'DEF INITIAL': 1, 'PB TEST': 0, 'PB CRT AVAILABLE': 1, 'PB CANCEL': 0 };
  ck(!!x && x.lme === 'LME250', 'TCE226 036 is the backup VALVE TEST (LME250)');
  ck(run(x, { ...L0, 'PB TEST': 1 }, s4, 1, 1).TEST === 1 && run(x, L0, s4, 58, 1).TEST === 1 && run(x, L0, s4, 3, 1).TEST === 0, 'TEST on, stops after 60 s (TP 024, drawing value; backup 90 s)');
}
// the sheets: count of macros run from the backup
{
  const dir = root + '/src/digital/tce';
  const lib = fs.readFileSync(dir + '/_lib.js', 'utf8');
  const sheets = [];
  for (const f of fs.readdirSync(dir).filter(f => /^(TC[AE]|G-).*\.js$/.test(f)).sort()) {
    const w = {};
    vm.runInNewContext(lib + ';' + fs.readFileSync(path.join(dir, f), 'utf8'), { window: w });
    sheets.push(...(w.TCE_SHEETS || []));
  }
  const P = R.compile(sheets),
    S = R.stats(P);
  const used = P.plan.filter(p => p.nodes.some(x => x.src === R.BK)).map(p => p.id + (S.notRun.includes(p.id) ? ' (not running: other defect)' : ''));
  console.log('sheets with a backup macro inside: ' + used.join(', '));
  ck(S.mBk >= FLOOR, 'macros / UNT-FG run from the backup ' + S.mBk + ' (floor ' + FLOOR + ')');
}
process.exit(fail ? 1 : 0);
