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
const FLOOR = 27; /* 8 HMI INDI + HEAT SOAK SELECT + ACCELERATION RELAY + TRIPPLE TCE145 + 2 UNT-FG TCE212 + 7 LME286 on TCE500 / TCE502
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
