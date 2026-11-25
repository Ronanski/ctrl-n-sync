/* TCS motors driven by their own TCE / TCA soft logic sheets (lane 0 YUA, 2026-11-25; user "Interconnected din dapat ang mga logic. DITL ABC
   TCS"). The sheets run in the engine from the typed drawings (src/digital/tce/*.js) with the one reader (src/digital/tce-run.js TCE_RUN):
     TCE300 MOP (A) b007 / (B) b021 STS -> c.mop      TCE305 COP (A) b031 / (B) b021 STS -> c.cop
     TCE310 EOP b006 STS / SPS -> c.eop               TCA655 vapour extractor FFR 015 -> c.vex
     TCA680 gland steam exhauster mtr STS -> c.gse    TCA700 oil purifier FFR 020 -> AN_SRC.field.pur
   Input sheets: TCE040 / 042 / TCA043 / 047 / 048 (PI/O), TCE102 / 104 (discharge pressures), TCE111 (TPC signals).
   The IBD sheets TB-1 / 2 / 12 / 21 / 22, TC-28 only show the state (tcs-trip.js). Inputs (TCS_SH_IN), one source each: RUNNING = the contactor;
   ELECTRICAL TROUBLE = the MCC dead (c.empOff EMP-11, c.copOff the COP bus; EOP is DC 0; exhauster and purifier no dead MCC in the model 0);
   pressures U.loPa / loPb / loCa / loCb / loEop; the signals of the protection controllers (TCPnnnn) = tcs-tpc.js; TCA636 / TCA638 B1 and
   INITIAL = the nets of their own sheets.
   THE WHOLE PROGRAM (TCE / TCA / G sheets) runs here, once, for the engine and the page. The sheets of TCS_SH.ids drive their motor and scan
   at their own cycle; the others run beside tcs.js until their group drives, each at its own cycle, their inputs (every TCS_SH.slow s) from the TCS I/O list
   (src/digital/tce-io.js; a (TCP) connector with no source (tcs-tpc.js), a hardware status or a panel contact of the G sheets keeps its start value).
   The page shows the nets of the engine (AN.tce, engine/sync.js slot tceV).
   Memory: c.sm in the TCS state = { n: steps, pb: port -> seconds left, pur, mot: motor -> memory }; AN_TCE = the nets and the memory of
   the blocks, by name in the keyframe (engine/state.js tce). A state with none of it (new start, old save) starts from the run / AUTO flags. */
const TCS_SH = {
  ids: 'TCE300 TCE305 TCE310 TCA655 TCA680 TCA700 TCE040 TCE042 TCE102 TCE104 TCE111 TCA043 TCA047 TCA048'.split(' '),
  hold: 3 /* s, HOLD 3000 ms of HMI_DO */,
  slice: 0.1 /* s, COMM+MD cycle */,
  slow: 0.25 /* s, the I/O list feed of the sheets that do not drive yet (each scans at its own cycle) */,
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
let tcsShP = null; /* the compiled program; null = no sheets in this build (yet) */
/* sm / n: the c.sm the memory belongs to and its step count (a LOAD puts other values in the same object); ld: the memory of a keyframe */
const AN_TCE = { sm: null, n: -1, ld: null };
function tcsShProg() {
  if (tcsShP) return tcsShP;
  const R = window.TCE_RUN,
    L = (window.TCE_SHEETS || []).filter(s => /^(TC[AE]|G-)/.test(s.id || ''));
  if (!R || TCS_SH.ids.some(id => !L.some(s => s.id === id))) return null;
  const p = R.compile(L),
    io = window.TCE_IO_LIVE,
    ch = n => (/ ERR$/.test(n) ? '' : n.split(' ')[0]);
  p.v0 = p.v.slice();
  p.drv = p.plan.filter(q => TCS_SH.ids.includes(q.id));
  p.rest = p.plan.filter(q => !TCS_SH.ids.includes(q.id) && q.cyc > 0);
  p.tpc = tcsTpcPorts(p);
  p.crt = p.ports.filter(n => /^CRT:/.test(n)).map(n => [p.idx.get(n), n]);
  p.in = p.ports.filter(n => TCS_SH_IN[ch(n)]).map(n => [p.idx.get(n), TCS_SH_IN[ch(n)]]);
  /* the other PI/O inputs: the TCS I/O list. ERR = channel error: the app has no card fault (0) */
  p.io = io ? p.ports.filter(n => /^PIO:/.test(n) && ch(n) && !TCS_SH_IN[ch(n)]).map(n => [p.idx.get(n), ch(n)]) : [];
  p.fed = p.tt = p.t = 0;
  p.keyed = [];
  for (const q of p.plan) for (const x of q.nodes) if (x.st) p.keyed.push([x.t === 'M' ? p.names[Object.values(x.outs)[0]] : p.names[x.out], x]);
  tcsShP = p;
  if (AN_TCE.ld) tcsShPut(p, AN_TCE.ld); /* a save loaded before the program was compiled */
  AN_TCE.ld = null;
  return p;
}
function tcsSm(c) {
  if (c.sm && c.sm.mot) return c.sm;
  tcsOilInit(c);
  tcsDevInit(c);
  if (c.eopAu == null) c.eopAu = !!c.eopArm;
  c.sm = { n: 0, pb: {}, pur: tcsPur(), mot: {} };
  AN_TCE.n = -1;
  for (const k in TCS_SH.mot) {
    const [m, run, au] = TCS_SH.mot[k],
      on = run(c) ? 1 : 0;
    c.sm.mot[m] = { auto: au(c) ? 1 : 0, on, seen: on };
  }
  return c.sm;
}
const tcsShMot = (c, k) => {
  const sm = tcsSm(c),
    m = TCS_SH.mot[k][0];
  return (sm.mot[m] = sm.mot[m] || {});
};
function tcsShFeed(p, U, c) {
  for (const [i, f] of p.in) {
    const x = +f(U, c);
    if (isFinite(x)) p.v[i] = x;
  }
  tcsTpcFeed(p, U, c);
}
/* the value of a net now (tcs.js tcsIO, the page) */
const tcsShNet = n => {
  const p = tcsShProg();
  return p && p.idx.has(n) ? p.v[p.idx.get(n)] : undefined;
};
const tcsShIsMot = x => x.t === 'M' && x.name === 'MOTOR STANDARD';
/* the memory o of a keyframe into the program (the motors: c.sm, at tcsShBind); none = the start values */
function tcsShPut(p, o) {
  for (const [key, x] of p.keyed) x.st = (o && o.st[key]) || {};
  p.v.set(p.v0);
  if (o) for (const n in o.v) if (p.idx.has(n)) p.v[p.idx.get(n)] = o.v[n];
  for (const q of p.plan) q.acc = (o && +o.acc[q.id]) || 0;
  p.tt = (o && +o.tt) || 0;
}
function tcsShBind(p, U, c) {
  const sm = tcsSm(c);
  if (AN_TCE.sm === sm && AN_TCE.n === sm.n) return sm;
  /* the memory that is in the program is the one of this plant (a keyframe, or the mirror of the page): it goes on */
  const own = AN_TCE.n === sm.n;
  if (!own) tcsShPut(p, null);
  AN_TCE.sm = sm;
  AN_TCE.n = sm.n;
  for (const [key, x] of p.keyed)
    if (tcsShIsMot(x)) {
      const k = key.replace(':', '.').replace(/\.[A-Z]+$/, '');
      x.st = sm.mot[k] || (sm.mot[k] = {});
    }
  /* a new memory: the nets take the run states before any command goes to a motor (no time passes) */
  if (!own) {
    tcsHwSeed(p, c); /* the start-up mode the plant holds (tcs-dcs.js) */
    /* the controllers are in service already: INITIAL (TCE050 tp002 / TCA100 tpA001, 10 s) is over */
    for (let i = 0; i < 48; i++) tcsShSlow(p, window.TCE_RUN, U, TCS_SH.slow);
    tcsShFeed(p, U, c);
    for (let i = 0; i < 2; i++) for (const q of p.drv) window.TCE_RUN.scan(p, q, 0);
  }
  return sm;
}
/* a CRT push button of the program ('CRT:TCE300.b007.START', 'CRT:TCA501.TCA501_1_IYS'): '' or the reason */
function tcsShPress(c, port, sec) {
  const p = tcsShProg();
  if (!p || !p.crt.some(x => x[1] === port)) return 'No TCS push button ' + port;
  const m = /^(CRT:[^.]+\.[^.]+)\.(START|STOP|AUTO|MANUAL|RESET)$/.exec(port),
    pb = tcsSm(c).pb,
    other = m && { START: 'STOP', STOP: 'START', AUTO: 'MANUAL', MANUAL: 'AUTO' }[m[2]];
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
    sm = tcsShBind(p, U, c),
    v = p.v,
    s = n => v[p.idx.get(n)] > 0.5;
  /* the local panel started or stopped the purifier since the last step */
  if (tcsPur() !== !!sm.pur) tcsShMot(c, 'pur').on = tcsPur() ? 1 : 0;
  for (let n = Math.max(1, Math.ceil(dt / TCS_SH.slice - 1e-9)), h = dt / n; n > 0; n--) {
    tcsShFeed(p, U, c);
    for (const [i, q] of p.crt) v[i] = sm.pb[q] > 0 ? 1 : 0;
    for (const q of p.drv) for (q.acc += h; q.acc >= q.cyc - 1e-9; q.acc -= q.cyc) R.scan(p, q, q.cyc);
    tcsShSlow(p, R, U, h);
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
  const au = k => !!tcsShMot(c, k).auto;
  c.mopAu = [au('mopA'), au('mopB')];
  c.copAu = [au('copA'), au('copB')];
  c.eopAu = au('eop');
  c.gseAu = au('gse');
  tcsOilSet(c);
  p.t += dt; /* the time the program has run, s (TCE.status) */
  AN_TCE.n = sm.n = (+sm.n || 0) + 1;
}
/* the sheets that do not drive yet: their inputs from the TCS I/O list every TCS_SH.slow s; each sheet scans at its own drawing cycle
   (10 / 30 / 100 ms; a longer cycle at its cycle), as the drive sheets (Phase 3, 2026-11-25: was one scan of 0.25 s) */
function tcsShSlow(p, R, U, h) {
  p.tt += h;
  if (p.tt < TCS_SH.slow - 1e-9) return;
  const d = p.tt,
    io = window.TCE_IO_LIVE;
  p.tt = 0;
  if (io) {
    let n = 0;
    io.batch(U, () => {
      for (const [i, k] of p.io) {
        const x = io.read(U, k);
        if (isFinite(x)) (p.v[i] = x), n++;
      }
    });
    p.fed = n;
  }
  for (const q of p.rest) {
    for (q.acc += d; q.acc >= q.cyc - 1e-9; q.acc -= q.cyc) R.scan(p, q, q.cyc);
  }
}
/* the keyframe (engine/state.js): the nets that left their start value by name and the block memories; the motors are in c.sm */
function tcsShSave() {
  const p = tcsShP;
  if (!p || AN_TCE.n < 0) return null;
  const o = { n: AN_TCE.n, tt: p.tt, v: {}, st: {}, acc: {} };
  for (let i = 0; i < p.names.length; i++) if (!Object.is(p.v[i], p.v0[i])) o.v[p.names[i]] = p.v[i];
  for (const [key, x] of p.keyed) if (!tcsShIsMot(x) && Object.keys(x.st).length) o.st[key] = x.st;
  for (const q of p.plan) if (q.acc) o.acc[q.id] = q.acc;
  return o;
}
function tcsShLoad(o) {
  AN_TCE.n = o ? o.n : -1;
  AN_TCE.sm = null;
  AN_TCE.ld = tcsShP ? null : o || null;
  if (tcsShP) tcsShPut(tcsShP, o);
}
/* the mirror (engine/sync.js): the block memories as text, one entry a block ('' = none or a motor: c.sm), and the run time */
const tcsShNum = (k, v) => (typeof v === 'number' && !isFinite(v) ? { $n: String(v) } : v);
const tcsShMem = () => {
  const p = tcsShProg();
  if (!p || AN_TCE.n < 0) return null;
  return p.keyed.map(([, x]) => {
    if (tcsShIsMot(x)) return '';
    for (const k in x.st) return JSON.stringify(x.st, tcsShNum);
    return '';
  });
};
function tcsShMemPut(L) {
  const p = tcsShProg();
  if (!p) return;
  for (let i = 0; i < L.length; i += 2) {
    const x = p.keyed[L[i]] && p.keyed[L[i]][1];
    if (x && !tcsShIsMot(x)) x.st = L[i + 1] ? JSON.parse(L[i + 1], (k, v) => (v && v.$n ? Number(v.$n) : v)) : {};
  }
}
const tcsShTime = () => {
  const p = tcsShProg();
  return p && AN_TCE.n >= 0 ? { n: AN_TCE.n, tt: p.tt, t: p.t, fed: p.fed, a: p.plan.map(q => q.acc || 0) } : null;
};
function tcsShTimePut(d) {
  const p = tcsShProg();
  if (!p) return;
  if (!d) return void tcsShLoad(null);
  AN_TCE.n = d.n;
  AN_TCE.sm = null;
  p.tt = d.tt;
  p.t = d.t;
  p.fed = d.fed;
  p.plan.forEach((q, i) => (q.acc = d.a[i] || 0));
}
