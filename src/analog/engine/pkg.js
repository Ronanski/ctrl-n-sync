/* Phase 8 (2026-11-26): the package PLCs that talk to the DCS over Modbus (src/ui/plant/modbus.js, the lists of the plant:
   LMYP-1 #1-MODBUS Communication list between DCS and fly ash / ESP / CTCS). Each package runs here as its own small program and puts its
   words on the link; the DCS reads them by the Modbus address (AN.pkgRead). Source of the logic: the PC read of the package manuals
   (project file phase8-package-plc-2026-11-26.md, YUA): CTCS control philosophy GI 3862 106 09 014 Rev 0 (CT-CP), fly ash O&M L5-1
   section 4, ESP O&M L19-1. No program backup of a package was opened; a step the documents do not give is NO-SOURCE and not made up.
   THE ADDRESS: the lists write the Modbus address as a number, so 40001.1 is bit 10 and 40001.01 bit 1 (Excel drops the zero). The CTCS
   list numbers its points 1 ~ 18 instead: 16 bits a word, point n = word (n - 1) >> 4, bit (n - 1) & 15 (SI5800 bit 0 ~ 15, SI5801 bit 0).
   THE WATCHDOG (list sheet "Detection of correct communication"): the PLC returns the bit it received, the DCS sends it back inverted, so
   the bit changes every exchange; no change for 10 s = COMMUNICATION ERROR on both sides. The exchange period is not in the lists
   (NO-SOURCE): one exchange per engine scan here. */
const PKG = {
  /* CTCS (CT-CP): drive travel, normal (a drive slower than 16 s valve / 25 s screen is a SEQUENCE FAILURE, CT-CP 8.0) */
  ct: { tv: 12, tsc: 22, water: 300, run: 8 * 3600, coll: 1800, idle: 16 * 3600, dpClean: 30, dpN: 40, dpE: 50 },
  /* ESP: the control block diagram of K1AU3-D1-0-016 R1 (ED, KC Cottrell, p74 ~ 90) and the O&M manual (ESP-OM L19-1, LMYP-1-14).
     CE rapping (ED p75, p76): first delay 3 / 5 / 7 / 9 / 11 min for fields 1 ~ 5, then 2 min on, off 7 / 13 / 19 / 23 / 27 min. The
     manual says 25 / 31 for fields 4 / 5; 31 is outside the screen range 0 ~ 30 min of the drawing, so the drawing values are used (the
     difference is logged, docs/versions/updates/phase8-slice5-esp-fix.md). DE rapping (ED p77 ~ 81): two motors per field together,
     first delay 11 / 13 / 15 / 17 / 19 min, 2 min on, off set on the screen; the manual's "continuous" is off 0 (derived). Heaters off
     1 h after the TRs are energized (manual; the drawing's thermostat 100 / 120 C on TE-BA1730 needs the insulator temperature, which is
     not modelled); after the TRs go off the CE rapping runs continuous for 2 h, then the aux devices stop (manual stop sequence); TR
     current limit 100 % (manual p9 ~ 10) */
  esp: { ceOn: 2, ceOff: [7, 13, 19, 23, 27], ceDly: [3, 5, 7, 9, 11], deOn: 2, deOff: 0, deDly: [11, 13, 15, 17, 19], heatOff: 3600, post: 2 * 3600, iLim: 100 }
};
/* a DCS output of a DITL sheet by its I/O address (the output pin of the netlist): 1 / 0, or null when the sheet or the pin is not found */
function pkgDo(sh, adr) {
  try {
    if (typeof S === 'undefined' || !S.sheets) return null;
    const C = PKG._do || (PKG._do = {}),
      k = sh + '|' + adr;
    let r = C[k];
    if (!r || S.sheets[r.i] !== r.s) {
      const i = S.sheets.findIndex(x => new RegExp('\\)' + sh + '$').test(x.name)),
        s = S.sheets[i];
      if (s && !s.nl && typeof netlist === 'function') s.nl = netlist(s);
      const o = s && s.nl && s.nl.pout ? s.nl.pout.find(q => q.adr === adr) : null;
      r = C[k] = { i, s, n: o ? o.n : -1 };
    }
    if (!r.s || r.n < 0 || !r.s.nl || !r.s.nl._v) return null;
    return r.s.nl._v[r.n] ? 1 : 0;
  } catch (e) {
    return null;
  }
}
/* ---------- CTCS, condenser tube cleaning A / B (CT-CP; DCS side DITL-119) ----------
   Drives: N01 / N02 ball valves, F01 ball pump, T11 / T12 ball screens. Initial: N01, N02 closed, F01 off, screens in OPERATION.
   Cycle: N01 opens, F01 starts as N01 starts opening, watering 5 min (only after an AUTO START press), N02 opens = balls in circulation,
   run 8 h, N02 closes, ball collection 30 min, N01 closes, F01 off after N01 is closed, idle 16 h, then again without watering.
   Ready to start = AUTO mode AND no FAIL AND no normal / emergency backwash AND the start permissive of the DCS (DITL-119 DOP-CTCS100x,
   "any seawater pump running"). REMOTE AUTO: the DCS AUTO START / STOP pulses (DITL-119 MOR / MOS-CTCS100x).
   The HMI snapshot of the plant at 150 MW shows CTCS-A and B STOP (docs/hmi/OPERATING_POINTS.md): the start state is the initial one.
   The selector stands in REMOTE AUTO (the DCS start / stop pulses of DITL-119 act only in that mode); the instructor can turn it.
   AUTO STOP (CT-CP 5.1 ~ 5.4, per phase) is not in the PC summary: here a stop in watering or run closes in the cycle-end order (N02,
   collection, N01, F01), a stop in idle goes to the initial state: INFERRED from the cycle end, marked so.
   Screen DP: no fouling model; the clean screen is 30 mbar (CT-CP values), below the 40 mbar normal backwash, so no backwash runs by
   itself. Failures (overload, breaker, torque, thermal) have no model yet: 0. */
function pkgCtNew() {
  return { ph: 'init', t: 0, n01: 0, n02: 0, f01: 0, rem: 1, first: true, dp: PKG.ct.dpClean, stop: false, sum: 0, seq: 0, mv: 0 };
}
function pkgCtStep(c, dt, perm, start, stop) {
  const K = PKG.ct;
  const nb = c.dp > K.dpN ? 1 : 0,
    eb = c.dp > K.dpE ? 1 : 0,
    fail = c.sum || c.seq;
  c.ready = c.rem && !fail && !nb && !eb && perm ? 1 : 0;
  c.nb = nb;
  c.eb = eb;
  c.fail = fail ? 1 : 0;
  if (fail) {
    /* CT-CP 8.0: all other drives to initial, AUTO START off */
    Object.assign(c, { ph: 'init', t: 0, n01: 0, n02: 0, f01: 0 });
  }
  if (c.rem && start && c.ph === 'init' && c.ready) {
    c.ph = 'open1';
    c.t = 0;
    c.first = true;
    c.stop = false;
  }
  if (c.rem && stop && c.ph !== 'init') c.stop = true;
  c.t += dt;
  /* valve travel: 0 ~ 1 in K.tv s */
  const mv = (k, to) => {
    c[k] = to ? Math.min(1, c[k] + dt / K.tv) : Math.max(0, c[k] - dt / K.tv);
    return to ? c[k] >= 1 : c[k] <= 0;
  };
  const go = ph => {
    c.ph = ph;
    c.t = 0;
  };
  switch (c.ph) {
    case 'open1':
      c.f01 = 1;
      if (mv('n01', 1)) go(c.stop ? 'close1' : c.first ? 'water' : 'open2');
      break;
    case 'water':
      if (c.stop) go('close1');
      else if (c.t >= K.water) go('open2');
      break;
    case 'open2':
      if (mv('n02', 1)) go(c.stop ? 'close2' : 'run');
      break;
    case 'run':
      if (c.stop || c.t >= K.run) go('close2');
      break;
    case 'close2':
      if (mv('n02', 0)) go('coll');
      break;
    case 'coll':
      if (c.t >= K.coll) go('close1');
      break;
    case 'close1':
      if (mv('n01', 0)) {
        c.f01 = 0;
        c.first = false;
        go(c.stop ? 'init' : 'idle');
        if (c.stop) c.stop = false;
      }
      break;
    case 'idle':
      if (c.stop) {
        c.stop = false;
        go('init');
      } else if (c.t >= K.idle) go('open1');
      break;
    default:
      c.ph = 'init';
  }
  c.circ = c.ph === 'run' ? 1 : 0;
}
/* one scan of all packages: called by the unit step (unit.js) */
function pkgStep(U, dt) {
  const P = U.pkg || (U.pkg = { ct: { A: pkgCtNew(), B: pkgCtNew() }, wd: { fa: 0, esp: 0, ctcs: 0 } });
  if (!P.ct) P.ct = { A: pkgCtNew(), B: pkgCtNew() };
  /* DITL-119: A = O.0286 / 0287 / 0288, B = O.0289 / 028A / 028B. The reader has no pin for O.0289; the drawing feeds both permissives
     from the same input M.079C ANY SEAWATER PUMP RUNNING, so B takes the net of A until the reader finds that pin (finding for lane 8) */
  const pA = pkgDo('DITL-119', 'O.0286'),
    pB = pkgDo('DITL-119', 'O.0289');
  pkgCtStep(P.ct.A, dt, pA === 1, pkgDo('DITL-119', 'O.0287') === 1, pkgDo('DITL-119', 'O.0288') === 1);
  pkgCtStep(P.ct.B, dt, (pB == null ? pA : pB) === 1, pkgDo('DITL-119', 'O.028A') === 1, pkgDo('DITL-119', 'O.028B') === 1);
  pkgEspStep(P, U, dt);
  /* the watchdogs: the PLC returns the bit, the DCS inverts it */
  for (const k in P.wd) P.wd[k] = P.wd[k] ? 0 : 1;
}
/* ---------- ESP, electrostatic precipitator (ESP-OM): five fields, each 1 CE hammer, 2 DE hammers, hopper vibrators A / B, 1 TR set,
   2 hopper high level switches; purge fan F-1201 and heater H-1201. In service = the TR sets energized: the field state of the plant
   model (AN_SRC.field.esp, the same one the house load counts, elec.js). The stop sequence: TRs off, CE rapping continuous, 2 h, the aux
   devices stop: the hammers, the purge fan and the heater run on in that window, then stop (the purge fan stops with the ID fan in the
   manual; here at the end of the window: INFERRED; the drawing ED p87 stops the fan 5 ~ 20 min after the heater or 10 ~ 50 min after all
   TRs, screen ranges only). Not in the documents (NO-SOURCE, no value): the fan / heater REMOTE and AUTO, DCS CONTROL, the vibrator
   InterLock bits (30006.06 ~ .15 = the fly ash blocking valve contact, ED p27, FA p558: needs the tank cycle times), the TR kV / mA and
   primary values (nameplates only: U-1201 83 kV 840 mA, U-1202 ~ 1205 72 kV average 1000 mA, ED p103, p107; normal values not in the
   documents), the vibrator on / wait settings (screen ranges 5 ~ 120 s, 1 ~ 5 min only). No fault model yet: faults, TR alarms and TR communication errors 0; hoppers emptied by the ash system:
   level high 0. */
function pkgEspStep(P, U, dt) {
  const E = P.esp || (P.esp = { on: 0, ton: 0, toff: Infinity, seen: 0 }),
    on = typeof AN_SRC !== 'undefined' && AN_SRC.field && AN_SRC.field.esp && U.on ? 1 : 0;
  if (on && !E.on) {
    /* a start state already in service (150 MW): the heaters are long off and the first delays long past */
    E.ton = E.seen ? 0 : PKG.esp.heatOff;
    E.toff = Infinity;
    E.t = E.seen ? 0 : 24 * 3600;
  }
  if (!on && E.on) E.toff = 0;
  E.on = on;
  E.seen = 1;
  if (on) E.ton += dt;
  else if (isFinite(E.toff)) E.toff += dt;
  E.t = (E.t || 0) + dt;
}
/* the group timer of ED p75 ~ 81: first delay, then on / off; off 0 = continuous */
function pkgEspTm(t, dly, on, off) {
  const d = t - dly * 60;
  if (d < 0) return 0;
  return off <= 0 || d % ((on + off) * 60) < on * 60 ? 1 : 0;
}
function pkgEspCe(E, f) {
  const K = PKG.esp;
  if (E.on) return pkgEspTm(E.t, K.ceDly[f], K.ceOn, K.ceOff[f]);
  return E.toff < K.post ? 1 : 0;
}
function pkgEspDe(E, f) {
  const K = PKG.esp;
  if (E.on) return pkgEspTm(E.t, K.deDly[f], K.deOn, K.deOff);
  return E.toff < K.post ? 1 : 0;
}
const pkgEspAux = E => (E.on || E.toff < PKG.esp.post ? 1 : 0);
/* the bit of a Modbus address of the lists: '40001.1' = bit 10, '40001.01' = bit 1, '40001' = bit 0 */
function pkgBit(ma) {
  const m = /^(\d+)(?:\.(\d{1,2}))?$/.exec(String(ma).trim());
  if (!m) return null;
  return { w: +m[1], b: m[2] == null ? 0 : m[2].length === 1 ? +m[2] * 10 : +m[2] };
}
/* ---------- FLY ASH (FA-OM L5-1 section 4): eleven blow tanks AH-A ~ D, EP-1A, 1B, 2A, 2B, 3, 4, 5. The tank cycle (air valve, 2.5 bar,
   discharge, level low and 0.4 bar + t, discharge close 5 s, inlet 3 s, filling until level high or the filling time) needs the filling
   time, the pressurized / transported fail times and the delay t, which are not in the documents read (NO-SOURCE), and the silo level
   needs the silo size and the unloading: the valves, levels, vibrators, purge valves, silo switches and unloaders have no value yet.
   Given: no fault model yet, so the PRESSURIZED / TRANSPORTED FAIL of each tank and the fault / trip bits read 0; the DCS commands (start /
   stop push buttons, alarm reset / ack): no screen sends one yet, 0; the plant air low switch from the plant air model. */
const PKG_FA = {
  zero: new Set(
    [
      // pressurized / transported fail of the 11 tanks
      '40001.05 40001.06 40001.12 40001.13 40002.03 40002.04 40002.1 40002.11 40003.01 40003.02 40003.08 40003.09 40003.15 40004 40004.06',
      '40004.07 40004.15 40005 40005.08 40005.09 40006.01 40006.02',
      // silo pressure H, vent filter purge fault, fluidizing time out, dry unloader fault, unloading E-stop, vent filter trip, purge
      // interrupt, wet unloader motor trips
      '40006.03 40006.07 40006.15 40007.01 40007.02 40007.04 40009.03 40009.05 40009.08',
      // the wet unloader and its rotary valve: CANCELLED by the contract (FA p13 item 10, p33: one dry unloading only), spare points
      '40009.04 40009.06 40009.07 40009.09 40009.1',
      // DCS to PLC: start / stop PB of the 11 tanks, alarm reset, alarm acknowledge
      '40051 40051.01 40051.02 40051.03 40051.04 40051.05 40051.06 40051.07 40051.08 40051.09 40051.1 40051.11 40051.12 40051.13 40051.14',
      '40051.15 40052 40052.01 40052.02 40052.03 40052.04 40052.05 40052.06 40052.07'
    ]
      .join(' ')
      .split(' ')
      .map(x => {
        const b = pkgBit(x);
        return b.w + '.' + b.b;
      })
  )
};
/* the value a package puts on (PLC to DCS) or the DCS sends (DCS to PLC) at one address of its list; NaN = no value (not modelled) */
const PKG_READ = {
  ctcs: (P, ma) => {
    const n = +ma;
    if (!(n >= 1 && n <= 18)) return NaN;
    if (n === 15 || n === 18) return P.wd.ctcs;
    const c = n <= 6 || n === 16 || n === 17 ? P.ct.A : P.ct.B,
      i = n <= 6 ? n : n <= 12 ? n - 6 : n;
    switch (i) {
      case 1:
        return c.circ;
      case 2:
        return c.rem;
      case 3:
        return c.ready;
      case 4:
        return c.nb;
      case 5:
        return c.eb;
      case 6:
        return c.fail;
      case 13:
      case 16:
        return c.seq ? 1 : 0;
      case 14:
      case 17:
        return c.sum ? 1 : 0;
    }
    return NaN;
  },
  fa: (P, ma) => {
    const a = pkgBit(ma);
    if (!a) return NaN;
    const k = a.w + '.' + a.b;
    if (k === '40009.15' || k === '40052.15') return P.wd.fa;
    if (PKG_FA.zero.has(k)) return 0;
    /* PS-PA1700 plant air tank pressure low: below 4 bar (FA-OM 4) = 4.08 kg/cm2g, the unit 1 plant air header of the model (AN_AIR) */
    if (k === '40006.8') {
      const U = AN.unit,
        p = U && isFinite(U.paPU) ? U.paPU : U ? U.paP : NaN;
      return isFinite(p) ? (p < 4 / 0.980665 ? 1 : 0) : NaN;
    }
    return NaN;
  },
  esp: (P, ma) => {
    const a = pkgBit(ma),
      E = P.esp,
      K = PKG.esp;
    if (!a || !E) return NaN;
    const { w, b } = a,
      f = Math.floor(b / 3),
      k = b % 3;
    if ((w === 30018 && b === 15) || (w === 40026 && b === 10)) return P.wd.esp;
    /* 30001 CE, 30002 / 30003 DE, 30004 / 30005 vibrators A / B: field f, bit 3f remote, 3f+1 run, 3f+2 fault. REMOTE: the per motor
       LOCAL / REMOTE switch of LOP-1201 ~ 1205 (ED p10 ~ 14, p22 ~ 27); the PLC AUTO timers run a motor only in REMOTE (ED p89, p90),
       and these motors stand in AUTO (30016 / 30017), so REMOTE (derived). The vibrators run while the fly ash blocking valve of their
       hopper is open (ED p82 ~ 86, the interlock contact ED p27): the tank cycle has no times (NO-SOURCE), so no run value */
    if (w >= 30001 && w <= 30005 && b < 15) {
      if (k === 0) return 1;
      if (k === 2) return 0;
      if (w === 30001) return pkgEspCe(E, f);
      if (w <= 30003) return pkgEspDe(E, f);
      return NaN;
    }
    if (w === 30006) {
      if (b === 1) return pkgEspAux(E);
      if (b === 4) return E.on && E.ton < K.heatOff ? 1 : E.on ? 0 : NaN;
      if (b === 2 || b === 5) return 0;
      return NaN;
    }
    if (w === 30008 && b >= 3 && b <= 12) return 0;
    /* AUTO of the hammers (30016.00 ~ .14) and vibrators (30016.15 ~ 30017.08): the timer program runs them; fan / heater AUTO no source */
    if (w === 30016) return 1;
    if (w === 30017) return b <= 8 ? 1 : NaN;
    /* TR01 ~ 05: REMOTE = the LOCAL / REMOTE switch of the TR panel in REMOTE; the remote ON works only in REMOTE (ED p110, p111), and
       the TRs are put on from the PLC, so REMOTE (derived) */
    if (w === 30018 && b < 15) return k === 0 ? 1 : k === 1 ? E.on : 0;
    if (w === 30019) return b <= 4 ? 0 : NaN;
    /* CE timers: 30081 ~ 30090 (and the DCS set 40161 ~ 40170): run / stopped per field */
    const ce = (w0, x) => (x % 2 === 0 ? K.ceOn : K.ceOff[x >> 1]);
    if (w >= 30081 && w <= 30090) return ce(30081, w - 30081);
    if (w >= 40161 && w <= 40170) return ce(40161, w - 40161);
    /* DE timers (ED p77 ~ 81): running 2 min (30117 ~ 30126, DCS set 40197 ~ 40206); stopped 0 = continuous (30071 ~ 30080, 40151 ~ 40160) */
    if ((w >= 30117 && w <= 30126) || (w >= 40197 && w <= 40206)) return K.deOn;
    if ((w >= 30071 && w <= 30080) || (w >= 40151 && w <= 40160)) return K.deOff;
    if ((w >= 30112 && w <= 30116) || (w >= 40192 && w <= 40196)) return K.iLim;
    /* the DCS commands (start / stop pulses, system auto start / stop, fan & heater): no screen sends one yet, 0 */
    if (w >= 40020 && w <= 40025 && b < 15) return k === 2 ? NaN : 0;
    if (w === 40026 && b <= 9) return 0;
    if (w === 40027 && b <= 5) return b === 2 || b === 3 ? NaN : 0;
    return NaN;
  }
};
AN.pkgRead = (sys, ma) => {
  const U = AN.unit;
  if (!U || !U.pkg || !PKG_READ[sys]) return NaN;
  try {
    const v = PKG_READ[sys](U.pkg, ma);
    return v === true ? 1 : v === false ? 0 : v;
  } catch (e) {
    return NaN;
  }
};
AN.pkgBit = pkgBit;
/* for the tests: the CTCS program alone (tests/lanes/pkg/pkg-modbus.cjs) */
AN._pkg = { ctNew: pkgCtNew, ctStep: pkgCtStep, espCe: pkgEspCe, espDe: pkgEspDe, espAux: pkgEspAux, read: PKG_READ, K: PKG };
