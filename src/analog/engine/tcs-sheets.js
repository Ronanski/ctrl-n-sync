/* TCS motors driven by their own TCE / TCA soft logic sheets (lane 0 YUA, 2026-11-25; user "Interconnected din dapat ang mga logic. DITL ABC
   TCS"). The sheets run in the engine from the typed drawings (src/digital/tce/*.js) with the one reader (src/digital/tce-run.js TCE_RUN):
     TCE300 MOP (A) b007 / (B) b021 STS -> c.mop      TCE305 COP (A) b031 / (B) b021 STS -> c.cop
     TCE310 EOP b006 STS / SPS -> c.eop               TCA655 vapour extractor FFR 015 -> c.vex
     TCA680 gland steam exhauster mtr STS -> c.gse    TCA700 oil purifier FFR 020 -> AN_SRC.field.pur
   Input sheets: TCE040 / 042 / TCA043 / 047 / 048 (PI/O), TCE102 / 104 (discharge pressures), TCE111 (TPC signals).
   The IBD sheets TB-1 / 2 / 12 / 21 / 22, TC-28 only show the state (tcs-trip.js). Inputs (TCS_SH_IN), one source each: RUNNING = the contactor;
   ELECTRICAL TROUBLE = the MCC dead (c.empOff EMP-11, c.copOff the COP bus; EOP is DC 0; exhauster and purifier no dead MCC in the model 0);
   pressures U.loPa / loPb / loCa / loCb / loEop; TCP1120 ~ 3120 B5 ~ B8 = the trip logic of IBD TA-13 / TA-14; TCA636 / TCA638 B1 = 0 until the
   gland seal group sheets join (ATS work); INITIAL = 1.
   Memory in the TCS state: c.sm = { v: name -> value, st: node -> memory, acc: sheet -> time, pb: port -> seconds left }, plain data, saved.
   A state with no c.sm (new start, old save) starts from the run / AUTO flags. */
const TCS_SH = {
  ids: 'TCE300 TCE305 TCE310 TCA655 TCA680 TCA700 TCE040 TCE042 TCE102 TCE104 TCE111 TCA043 TCA047 TCA048'.split(' '),
  hold: 3 /* s, HOLD 3000 ms of HMI_DO */,
  slice: 0.1 /* s, COMM+MD cycle */,
  mot: {
    mopA: ['TCE300.b007', c => c.mop[0], c => c.mopAu[0], 'TCE300', 'MOP-A'],
    mopB: ['TCE300.b021', c => c.mop[1], c => c.mopAu[1], 'TCE300', 'MOP-B'],
    copA: ['TCE305.b031', c => c.cop[0], c => c.copAu[0], 'TCE305', 'COP-A'],
    copB: ['TCE305.b021', c => c.cop[1], c => c.copAu[1], 'TCE305', 'COP-B'],
    eop: ['TCE310.b006', c => c.eop, c => c.eopAu, 'TCE310', 'EOP'],
    vex: ['TCA655.mtr', c => c.vex, () => 0, 'TCA655', 'VAPOUR EXTRACTOR'],
    gse: ['TCA680.mtr', c => c.gse, c => c.gseAu, 'TCA680', 'GLAND STEAM EXHAUSTER'],
    pur: ['TCA700.mtr', () => tcsPur(), () => 0, 'TCA700', 'OIL PURIFIER']
  }
};
const tcsPur = () => !!(typeof AN_SRC !== 'undefined' && AN_SRC.field && AN_SRC.field.pur);
const tcsIbNet = (c, sh, n) => ((c.ib && c.ib.v && c.ib.v[sh] && c.ib.v[sh][n]) > 0.5 ? 1 : 0);
const TCS_SH_IN = {
  'REF:INITIAL': () => 1,
  'PIO:TCE040.di1': (U, c) => c.cop[0],
  'PIO:TCE040.di2': (U, c) => c.copOff,
  'PIO:TCE040.di3': (U, c) => c.mop[0],
  'PIO:TCE040.di4': (U, c) => c.empOff,
  'PIO:TCE040.di5': (U, c) => c.eop,
  'PIO:TCE040.di7': U => U.loBrg <= TCS_OIL.brgLo,
  'PIO:TCE042.di1': (U, c) => c.cop[1],
  'PIO:TCE042.di2': (U, c) => c.copOff,
  'PIO:TCE042.di3': (U, c) => c.mop[1],
  'PIO:TCE042.di4': (U, c) => c.empOff,
  'PIO:TCE930-2': U => U.loPa,
  'PIO:TCE930-3': U => U.loCa,
  'PIO:TCE930-10': U => U.loPb,
  'PIO:TCE930-11': U => U.loCb,
  'PIO:TCE930-12': U => U.loEop,
  'PIO:TCA901-25': () => tcsPur(),
  'PIO:TCA903-23': (U, c) => c.vex,
  'PIO:TCA903-24': (U, c) => c.empOff,
  'PIO:TCA904-12': (U, c) => c.gse
};
[
  ['B5', 'TA-13', 3],
  ['B6', 'TA-13', 11],
  ['B7', 'TA-14', 17],
  ['B8', 'TA-14', 8]
].forEach(([b, sh, n]) => ['1', '2', '3'].forEach(p => (TCS_SH_IN['CON:TCP' + p + '120.' + b] = (U, c) => tcsIbNet(c, sh, n))));
let tcsShP = null /* compiled program; false = no sheets in this build */,
  tcsShB = null; /* the c.sm it is bound to */
function tcsShProg() {
  if (tcsShP !== null) return tcsShP;
  const R = window.TCE_RUN,
    L = (window.TCE_SHEETS || []).filter(s => TCS_SH.ids.includes(s.id));
  if (!R || L.length < TCS_SH.ids.length) return (tcsShP = false);
  const p = R.compile(L);
  p.in = p.ports.filter(n => !/^CRT:/.test(n)).map(n => [p.idx.get(n), (!/ ERR$/.test(n) && TCS_SH_IN[n.split(' ')[0]]) || (() => 0)]);
  p.keyed = [];
  for (const q of p.plan) for (const x of q.nodes) if (x.st) p.keyed.push([x.t === 'M' ? p.names[Object.values(x.outs)[0]] : p.names[x.out], x]);
  return (tcsShP = p);
}
function tcsSm(c) {
  if (c.sm) return c.sm;
  if (c.eopAu == null) c.eopAu = !!c.eopArm;
  c.sm = { ids: TCS_SH.ids, v: {}, st: {}, acc: {}, pb: {}, pur: tcsPur() };
  for (const k in TCS_SH.mot) {
    const [m, run, au] = TCS_SH.mot[k],
      on = run(c) ? 1 : 0;
    c.sm.st[m] = { auto: au(c) ? 1 : 0, on, seen: on };
  }
  return c.sm;
}
const tcsShMot = (c, k) => {
  const sm = tcsSm(c),
    m = TCS_SH.mot[k][0];
  return (sm.st[m] = sm.st[m] || {});
};
function tcsShBind(p, c) {
  const sm = tcsSm(c);
  if (tcsShB === sm) return sm;
  tcsShB = sm;
  for (const [key, x] of p.keyed) {
    const k = x.t === 'M' && x.name === 'MOTOR STANDARD' ? key.replace(':', '.').replace(/\.[A-Z]+$/, '') : key;
    x.st = sm.st[k] = sm.st[k] || {};
  }
  p.v.fill(0);
  for (const n in sm.v) if (p.idx.has(n)) p.v[p.idx.get(n)] = sm.v[n];
  for (const q of p.plan) q.acc = +sm.acc[q.id] || 0;
  return sm;
}
/* a CRT push button ('CRT:TCE300.b007.START'): '' or the reason */
function tcsShPress(c, port, sec) {
  const m = /^(CRT:[^.]+\.[^.]+)\.(START|STOP|AUTO|MANUAL|RESET)$/.exec(String(port || '')),
    k = m && Object.keys(TCS_SH.mot).find(x => 'CRT:' + TCS_SH.mot[x][0] === m[1]);
  if (!k) return 'No TCS push button ' + port;
  const pb = tcsSm(c).pb,
    other = { START: 'STOP', STOP: 'START', AUTO: 'MANUAL', MANUAL: 'AUTO' }[m[2]];
  if (other) delete pb[m[1] + '.' + other];
  pb[port] = sec > 0 ? +sec : TCS_SH.hold;
  return '';
}
/* START / STOP need MANUAL (MOTOR STANDARD, IBD 310SC90-794 sheet 14) */
function tcsShOp(c, k, op) {
  const t = TCS_SH.mot[k],
    b = { start: 'START', stop: 'STOP', auto: 'AUTO', man: 'MANUAL', reset: 'RESET' }[op];
  if (!t) return 'Unknown pump: ' + k;
  if (!b) return 'Unknown command: ' + op;
  const pb = tcsSm(c).pb,
    P = 'CRT:' + t[0] + '.',
    auto = pb[P + 'MANUAL'] > 0 ? false : pb[P + 'AUTO'] > 0 || !!tcsShMot(c, k).auto;
  if ((op === 'start' || op === 'stop') && auto) return t[4] + ' is in AUTO: set MANUAL first, then ' + b + ' (SOP; ' + t[3] + ')';
  return tcsShPress(c, P + b);
}
/* every step of the oil model, after the pressures (tcs.js tcsOil) */
function tcsSheets(U, c, dt) {
  const p = tcsShProg();
  if (!p || !(dt > 0)) return;
  const R = window.TCE_RUN,
    sm = tcsShBind(p, c),
    v = p.v,
    s = n => v[p.idx.get(n)] > 0.5;
  /* the local panel started or stopped the purifier since the last step */
  if (tcsPur() !== !!sm.pur) tcsShMot(c, 'pur').on = tcsPur() ? 1 : 0;
  for (let n = Math.max(1, Math.ceil(dt / TCS_SH.slice - 1e-9)), h = dt / n; n > 0; n--) {
    for (const [i, f] of p.in) {
      const x = +f(U, c);
      if (isFinite(x)) v[i] = x;
    }
    for (const q of p.ports) if (q.startsWith('CRT:')) v[p.idx.get(q)] = sm.pb[q] > 0 ? 1 : 0;
    R.step(p, h);
    for (const q in sm.pb) if (!((sm.pb[q] -= h) > 1e-9)) delete sm.pb[q];
    c.mop = [s('TCE300:b007.STS'), s('TCE300:b021.STS')];
    c.cop = [s('TCE305:b031.STS'), s('TCE305:b021.STS')];
    if (s('TCE310:b006.STS')) c.eop = true;
    else if (s('TCE310:b006.SPS')) c.eop = false;
    c.vex = s('TCA655:ffr015');
    c.gse = s('TCA680:mtr.STS');
    if (typeof AN_SRC !== 'undefined' && AN_SRC.field) AN_SRC.field.pur = s('TCA700:ffr020');
  }
  sm.pur = tcsPur();
  c.mopAu = [s('TCE300:b007.AUTO'), s('TCE300:b021.AUTO')];
  c.copAu = [s('TCE305:b031.AUTO'), s('TCE305:b021.AUTO')];
  c.eopAu = s('TCE310:b006.AUTO');
  c.gseAu = s('TCA680:mtr.AUTO');
  tcsOilSet(c);
  for (let i = 0; i < p.names.length; i++) {
    const n = p.names[i],
      x = v[i];
    if (isFinite(x) && sm.v[n] !== x && (x || sm.v[n])) sm.v[n] = x;
  }
  for (const q of p.plan) sm.acc[q.id] = q.acc;
}
