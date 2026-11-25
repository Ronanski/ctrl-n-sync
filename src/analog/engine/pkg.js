/* LANE 6 (EIMI): THE PACKAGE PANELS of the boiler (their own PLC, on the DCS by Modbus): electrostatic precipitator, fly ash,
   condenser tube cleaning.
   State = U.pkg (plain data, saved with the plant); one step per plant step (anPkgStep, after the air and gas path); one operator
   action AN.pkgOp(panel, device, op, value): '' = done, else the reason it was refused.
   ---------- THE ELECTROSTATIC PRECIPITATOR (K C Cottrell O&M V19-1; points: Modbus list, node ESP PLC)
   Transformer-rectifiers (power list, V19-1 no. 4): U-1201 83 kV 840 mA (three-phase, 460 V 94 A), U-1202 ~ U-1205 72 kV 1000 mA
     (two-phase, 460 V 224 A). At the current limit 100 % a field stands at its rated voltage and current. For a lower limit the
     corona follows the space charge law I ~ V^2 (textbook, no onset voltage in the docs): kV = rated x sqrt(limit). The primary voltage
     and current are in the turns ratio of the rating: V1 = 460 x kV / rated kV, I1 = rated A x mA / rated mA.
     Under-voltage trip: below 5 kV for 30 s (V19-1 no. 5 and 7). A hopper full up to the electrodes shorts its field: 0 kV.
   Collection: the Deutsch equation of boiler.js (AN_ESP.wA for all five fields in service). The migration velocity is proportional to
     the square of the field voltage (textbook, w ~ E^2), each of the five equal fields has one fifth of the plates:
     U.espK = sum of (kV / rated kV)^2 / 5 = 1 with all five fields at rated voltage, the value of boiler.js as before.
   Rappers (V19-1 no. 7): collecting electrodes M-12n1 ON 2 min, OFF 7 / 13 / 19 / 25 / 31 min; discharge electrodes M-12n2, M-12n3
     continuous (stopped interval 0). Hopper vibrators M-12n4, M-12n5: no interval in the start-up document, so both intervals are 0 until
     the operator sets them; in AUTO a vibrator also runs the 3 s of its fly ash inlet valve (fly ash O&M 4.2.1 note 5).
     AUTO = the intervals, while the system is in AUTO START; MANUAL = START / STOP. The purge air fan and its heater in AUTO follow the
     group buttons FAN & HEATER START / STOP. A device takes no command from the DCS with its selector at LOCAL or with its fault in.
   Ash: each field keeps its share of the Deutsch collection on its plates; one ON period of the rapper drops the layer it finds (the
     layer at the start of the period, evenly over it) into the two hoppers of the field. Hopper: pyramid 6.6 x 3 m, valley angle 55 deg,
     5.18 m (CALC), ash 721 kg/m3 (fly ash O&M), high level LS-FH1730 ~ 1739 at 4800 mm (instrument list). Of the fly ash 575 / 11500 falls
     in the air heater hoppers (fly ash design basis).
   ---------- THE FLY ASH SYSTEM (Hwa Jann O&M L5-1; points: Modbus list, node fly ash PLC)
   14 blow tanks: air heater A ~ D 100 L, fields 1 and 2 1000 L (A, B each), field 3 600 L, field 4 200 L, field 5 100 L (A and B together).
   Cycle (4.2.1 b VI): air open, P >= 2.5 bar, discharge open; tank empty and P <= 0.4 bar: air close, 5 s, discharge close, 3 s, inlet open
     with the hopper vibrator 3 s and the purge of the line; tank at its level probe: inlet close, next batch. The first batch carries no ash.
     STOP, air tank low (< 4 bar) and silo HH stop a tank after its cycle, the batch in the tank is sent; pressurized fail and transported fail
     stop it at once.
   Air: 20 Nm3/min at the design 16,100 kg/h = 0.0745 Nm3 per kg. Each vessel has its orifice (3-1 i) and all are to convey in the same time:
     10 Nm3/min for 1000 L, the others by volume (CALC: the two field 1 tanks carry 72 % of the ash, so they take the whole air between
     them); the sum is held at the 20 Nm3/min of the header. The pressure of a vessel is the air in it; it falls when the last ash is out.
   Fill: through the 8 inch inlet by the Beverloo discharge 0.58 x density x sqrt(g) x D^2.5 = 23 kg/s.
   Fails: the O&M gives "several seconds" and "several minutes": twice the time the step takes at design air (CALC).
   The level + timer mode has no time in the docs: the panel runs in LEVEL mode (LEVEL + TIMER with 0 = the same).
   Silo T-1251 1600 m3 (10 m dia.); LT-FH1700 = % of it. H / HH / L of the silo: the switch heights are not in the docs: H = one hour of
     the design ash flow below HH, HH = full, L = empty (CALC). Dry unloader 150 m3/h, vent filter M-1250 starts with the first tank.
   ---------- THE CONDENSER TUBE CLEANING SYSTEM (GEA O&M V18-3, control philosophy GI 3862 106 09 014; points: Modbus list, node CTCS)
   Two trains, A and B, one per path of the condenser: screens T11 / T12 of the ball separator, ball vessel inlet valve N01 and outlet
   valve N02, ball recirculating pump F01. Times and DP settings of the manual: AN_CTC. Start permissive O.0286 and REMOTE AUTO START /
   STOP O.0287 / O.0288 (A), O.028A / O.028B (B) are the outputs of DITL-119.
   DP of the separator: 30 mbar clean at 15,750 m3/h, with the square of the flow of its path (textbook) and times the dirt on the screens
   (1 = clean; no fouling rate in the docs, so only the instructor makes dirt). A backwash washes it off by three time constants in its
   30 min (CALC). With the screens at BACKWASH they stand out of the flow: no DP across them.
   The balls do not change the cleanness of the tubes in the condenser model (no rate in the docs). */
const AN_PKG = {
  tr: [
    [83, 840, 94],
    [72, 1000, 224],
    [72, 1000, 224],
    [72, 1000, 224],
    [72, 1000, 224]
  ],
  ceOff: [7, 13, 19, 25, 31],
  rho: 721,
  hop: { a: 6.6, b: 3, h: 5.18, hi: 4.8 },
  ah: 575 / 11500,
  bev: 0.58 * 721 * Math.sqrt(9.81) * Math.pow(0.2032, 2.5) /* kg/s through 8 inch */,
  air: 20 / 60 /* Nm3/s of the header */,
  spec: (20 * 60) / 16100 /* Nm3/kg */,
  silo: 1600 * 721 /* kg */,
  unl: (150 * 721) / 3600 /* kg/s */,
  /* [id, litres, the hoppers it takes: 0 ~ 9 = field n A / B, 10 ~ 13 = air heater A ~ D, purge line] */
  tk: [
    ['AHA', 100, [10], 1],
    ['AHB', 100, [11], 1],
    ['AHC', 100, [12], 1],
    ['AHD', 100, [13], 1],
    ['EP1A', 1000, [0], 2],
    ['EP1B', 1000, [1], 3],
    ['EP2A', 1000, [2], 4],
    ['EP2B', 1000, [3], 5],
    ['EP3', 600, [4, 5], 6],
    ['EP4', 200, [6, 7], 7],
    ['EP5', 100, [8, 9], 7]
  ]
};
function anEspNew(on) {
  const d = {},
    dev = (id, o) => (d[id] = Object.assign({ run: 0, rem: 1, auto: 1, flt: 0, ton: 0, toff: 0, t: 0, cmd: 0 }, o));
  for (let f = 0; f < 5; f++) {
    dev('M12' + f + '1', { ton: 2, toff: AN_PKG.ceOff[f] });
    dev('M12' + f + '2', { ton: 1 });
    dev('M12' + f + '3', { ton: 1 });
    dev('M12' + f + '4');
    dev('M12' + f + '5');
  }
  dev('F1201');
  dev('H1201');
  return {
    d,
    tr: AN_PKG.tr.map(() => ({ run: on, rem: 1, alm: 0, lim: 100, kv: 0, ma: 0, pv: 0, pa: 0, uv: 0 })),
    pl: [0, 0, 0, 0, 0],
    pl0: [0, 0, 0, 0, 0],
    h: new Array(14).fill(0),
    lv: new Array(14).fill(0),
    lsh: new Array(14).fill(0),
    sys: on,
    /* the heater is taken out one hour after the fields are on (stop of V19-1 no. 7): in service only the fan */
    fan: on,
    htr: 0,
    last: !!on
  };
}
function anFaNew(on) {
  const t = {};
  for (const [id] of AN_PKG.tk)
    t[id] = { on, st: 0, m: 0, p: 0, air: 0, sv: [0, 0, 0], lsh: 0, t: 0, pf: 0, tf: 0, pur: 0, vib: 0, n: 0 };
  return { t, rem: 1, unlA: 1, silo: AN_PKG.silo * 0, ready: 1, pal: 0, hh: 0, hi: 0, lo: 1, vf: on, vfr: 1, vft: 0, unl: 0, g1: 0, g2: 0, flu: 0, utr: 0, q: 0, ack: 0 };
}
function anPkg(U) {
  const on = AN_SRC.field.esp ? 1 : 0;
  if (!U.pkg) U.pkg = {};
  if (!U.pkg.esp) U.pkg.esp = anEspNew(on);
  if (!U.pkg.fa) U.pkg.fa = anFaNew(on);
  /* in service with the sea water pumps when the plant is loaded */
  if (!U.pkg.ctcs) U.pkg.ctcs = anCtcNew(on && U.swQc > 1000 ? 1 : 0);
  return U.pkg;
}
/* an output of a DITL drawing to a package panel, at its terminal net: 1 / 0, null while the world is not built */
function anDlOut(sheet, adr) {
  try {
    if (typeof S === 'undefined' || !S.sheets || !window.WORLD || !WORLD.on || !WORLD.idx) return null;
    const s = S.sheets.find(x => x.name.endsWith(sheet));
    const q = s && s.nl && s.nl._v && (s.nl.pout || []).find(x => x.adr === adr);
    if (!q) return null;
    return s.nl._v[q.n] === 1 ? 1 : 0;
  } catch (e) {
    return null;
  }
}
const AN_CTC = {
  vlv: 12 /* s, ball valve actuator */,
  scr: 22 /* s, screen actuator */,
  vF: 16 /* s, run time fail */,
  sF: 25,
  wat: 300,
  run: 8 * 3600,
  col: 1800,
  colE: 300,
  idle: 16 * 3600,
  bw: 1800,
  stab: 120,
  lead: 30,
  nb: 40,
  eb: 50,
  dp: 30 /* mbar, clean screens */,
  q: 15750 /* m3/h of one path at that DP */,
  out: { A: ['O.0287', 'O.0288'], B: ['O.028A', 'O.028B'] }
};
/* one train. mode 0 = remote auto, 1 = local auto, 2 = manual. st: 0 stopped, 1 to the initial conditions, 2 watering, 3 cleaning cycle,
   4 ball collection, 5 inlet valve closing, 6 idle, 7 backwash, 8 DP stabilizing, 9 held by a normal backwash, 10 held by an emergency
   backwash, 11 failed. d = drives: p position (1 = open / backwash), c its command, t running time, stk = stuck (instructor) */
function anCtcTrain(on) {
  const dr = p => ({ p, c: p, t: 0, stk: 0, f: 0 });
  return {
    mode: 0,
    st: on ? 3 : 0,
    t: 0,
    tr: 0,
    ti: 0,
    col: AN_CTC.col,
    ret: 0,
    bk: 0,
    stop: 0,
    d: { N01: dr(on), N02: dr(on), T11: dr(0), T12: dr(0) },
    f1: on,
    f1c: on,
    f1t: 0,
    dirt: 1,
    dp: 0,
    tn: 0,
    te: 0,
    nb: 0,
    eb: 0,
    hld: 0,
    hoot: 0,
    ack: 0,
    sf: 0,
    ms: 0,
    rdy: 0,
    op: on,
    pw: 1,
    ps: [0, 0]
  };
}
function anCtcInit(r) {
  r.d.N01.c = r.d.N02.c = r.d.T11.c = r.d.T12.c = 0;
  r.f1c = 0;
}
const anCtcAtInit = r => !r.d.N01.p && !r.d.N02.p && !r.d.T11.p && !r.d.T12.p && !r.f1;
function anCtcGo(r, st) {
  r.st = st;
  r.t = 0;
}
/* AUTO STOP */
function anCtcStop(r) {
  if (r.st === 1 || r.st === 2) {
    r.ret = 0;
    anCtcGo(r, 5);
  } else if (r.st === 3) {
    r.ret = 0;
    r.col = AN_CTC.col;
    anCtcGo(r, 4);
  } else if (r.st === 4 || r.st === 5) {
    /* a waiting backwash is still done, then the train stops */
    if (r.ret >= 7) r.stop = 1;
    else r.ret = 0;
  } else if (r.st === 6) {
    r.ti = 0;
    anCtcGo(r, 0);
  } else if (r.st === 7 || r.st === 8) r.stop = 1;
}
function anCtcFail(r, k) {
  r[k] = 1;
  r.hoot = 1;
  r.ack = 0;
  anCtcInit(r);
  anCtcGo(r, 11);
}
function anCtcStart(r) {
  if (!r.rdy || r.st) return 0;
  r.stop = r.ret = 0;
  r.tr = r.ti = 0;
  anCtcGo(r, 1);
  return 1;
}
function anCtcTrainStep(r, pw, per, q, pulse, dt) {
  const K = AN_CTC,
    d = r.d;
  /* no power: the drives stay where they are, the pump stops; on return everything goes to the initial position and waits for a start */
  if (!pw) {
    r.f1 = r.f1c = 0;
    r.rdy = r.op = 0;
    r.pw = 0;
    return;
  }
  if (!r.pw) {
    r.pw = 1;
    anCtcInit(r);
    anCtcGo(r, 0);
    r.ti = r.tr = r.stop = 0;
  }
  /* screens turned to BACKWASH stand out of the flow */
  r.dp = K.dp * Math.pow(q / K.q, 2) * r.dirt * (1 - Math.max(d.T11.p, d.T12.p));
  const auto = r.mode !== 2,
    seq = auto && r.st >= 2 && r.st <= 6;
  r.tn = r.dp > K.nb ? r.tn + dt : 0;
  r.te = r.dp > K.eb ? r.te + dt : 0;
  if (r.te >= K.lead && !r.eb) {
    r.eb = r.hoot = 1;
    r.ack = 0;
    if (auto && r.st === 2) {
      r.ret = 10;
      anCtcGo(r, 5);
    } else if (auto && r.st === 8) anCtcGo(r, 10);
    else if (seq && r.st === 3) {
      r.ret = 10;
      r.col = K.colE;
      anCtcGo(r, 4);
    } else if (seq && r.st === 4) {
      r.ret = 10;
      r.col = Math.min(r.col, r.t + K.colE);
    } else if (seq && r.st === 5) r.ret = 10;
    else if (seq) {
      r.ti = 0;
      anCtcGo(r, 10);
    }
  } else if (r.tn >= K.lead && !r.nb && !r.eb) {
    r.nb = r.hoot = 1;
    r.ack = 0;
    if (seq) {
      r.bk = r.st === 4 || r.st === 5 ? 6 : r.st;
      if (r.st === 2) {
        r.ret = 7;
        anCtcGo(r, 5);
      } else if (r.st === 3) {
        r.ret = 7;
        r.col = K.col;
        anCtcGo(r, 4);
      } else if (r.st === 4 || r.st === 5) {
        if (r.ret === 0) r.stop = 1;
        r.ret = 7;
      } else anCtcGo(r, 7);
    }
  }
  r.rdy = auto && per && !r.nb && !r.eb && !r.sf && !r.ms ? 1 : 0;
  /* the two pulses of the DCS count in REMOTE AUTO only */
  for (let i = 0; i < 2; i++) {
    if (pulse[i] === 1 && !r.ps[i] && r.mode === 0) {
      if (i) anCtcStop(r);
      else anCtcStart(r);
    }
    r.ps[i] = pulse[i] === 1 ? 1 : 0;
  }
  r.t += dt;
  if (auto) {
    switch (r.st) {
      case 0:
        r.ti = r.tr = 0;
        anCtcInit(r);
        break;
      case 1:
        anCtcInit(r);
        if (anCtcAtInit(r)) anCtcGo(r, 2);
        break;
      case 2:
        d.N01.c = r.f1c = 1;
        if (r.t >= K.wat) anCtcGo(r, 3);
        break;
      case 3:
        d.N01.c = r.f1c = 1;
        d.N02.c = d.N01.p >= 1 ? 1 : 0;
        if (r.op) r.tr += dt;
        if (r.tr >= K.run) {
          r.ret = 6;
          r.col = K.col;
          anCtcGo(r, 4);
        }
        break;
      case 4:
        d.N02.c = 0;
        if (r.t >= r.col) anCtcGo(r, 5);
        break;
      case 5:
        d.N01.c = d.N02.c = 0;
        if (d.N01.p <= 0) {
          r.f1c = 0;
          if (r.ret === 6) r.ti = r.tr = 0;
          if (r.ret === 7 && r.bk === 6) r.ti = r.tr = 0;
          if (!r.ret) r.stop = 0;
          anCtcGo(r, r.ret);
        }
        break;
      case 6:
        r.ti += dt;
        if (r.ti >= K.idle) {
          r.ti = r.tr = 0;
          anCtcGo(r, 3);
        }
        break;
      case 7:
        d.T11.c = d.T12.c = 1;
        if (r.bk === 6) r.ti += dt;
        /* the reversed flow washes the screens */
        if (q > 0) r.dirt = 1 + (r.dirt - 1) * Math.exp((-3 * dt) / K.bw);
        if (r.t >= K.bw) anCtcGo(r, 8);
        break;
      case 8:
        d.T11.c = d.T12.c = 0;
        if (r.bk === 6) r.ti += dt;
        if (d.T11.p > 0 || d.T12.p > 0) r.t = 0;
        else if (r.t >= K.stab) {
          if (r.dp >= K.nb) {
            r.hoot = 1;
            r.ack = 0;
            anCtcGo(r, 9);
          } else {
            r.nb = r.hoot = r.ack = 0;
            if (r.stop) {
              r.stop = 0;
              anCtcGo(r, 0);
            } else if (r.bk === 6) anCtcGo(r, 6);
            else {
              if (r.bk === 2) r.tr = 0;
              anCtcGo(r, 3);
            }
          }
        }
        break;
      case 9:
      case 10:
        d.N01.c = d.N02.c = r.f1c = 0;
        d.T11.c = d.T12.c = 1;
        break;
    }
  }
  r.hld = r.st === 9 || r.st === 10 ? 1 : 0;
  for (const k in d) {
    const x = d[k],
      sc = k[0] === 'T',
      lim = sc ? K.scr : K.vlv;
    if (!x.stk) x.p = x.c ? Math.min(1, x.p + dt / lim) : Math.max(0, x.p - dt / lim);
    x.t = x.p !== x.c ? x.t + dt : 0;
    if (x.t > (sc ? K.sF : K.vF)) x.f = 1;
    if (x.f && !r.sf) anCtcFail(r, 'sf');
  }
  if (r.f1t && !r.ms) anCtcFail(r, 'ms');
  r.f1 = r.f1c && !r.f1t ? 1 : 0;
  r.op = r.f1 && d.N01.p >= 1 && d.N02.p >= 1 ? 1 : 0;
}
function anCtcNew(on) {
  return { A: anCtcTrain(on), B: anCtcTrain(on), per: on };
}
function anCtcStep(U, c, dt) {
  const pw = !(U.el && U.el.bo);
  c.per = anDlOut('DITL-119', 'O.0286') === 1 ? 1 : 0;
  for (const k of ['A', 'B'])
    anCtcTrainStep(
      c[k],
      pw,
      c.per,
      Math.max(0, U['swQc' + k] || 0),
      AN_CTC.out[k].map(a => anDlOut('DITL-119', a)),
      dt
    );
}
/* the local panel of a train: dev 'A' / 'B', or a drive 'A-N01' ... 'A-F01' in MANUAL */
function anCtcOp(c, dev, op, v) {
  const m = /^([AB])(?:-(N01|N02|T11|T12|F01))?$/.exec(dev),
    r = m && c[m[1]];
  if (!r) return 'no such device';
  if (m[2]) {
    if (op === 'fault') {
      if (m[2] === 'F01') r.f1t = v ? 1 : 0;
      else r.d[m[2]].stk = v ? 1 : 0;
      return '';
    }
    if (op !== 'start' && op !== 'stop') return 'no such command';
    if (r.mode !== 2) return 'the train is in AUTO: select MANUAL at the panel first';
    if (m[2] === 'F01') r.f1c = op === 'start' ? 1 : 0;
    else r.d[m[2]].c = op === 'start' ? 1 : 0;
    return '';
  }
  if (op === 'dirt') {
    r.dirt = Math.max(1, +v || 1);
    return '';
  }
  if (op === 'rem' || op === 'loc' || op === 'man') {
    if (r.mode !== 2 && r.st > 0 && r.st < 9) return 'the sequence runs: AUTO STOP first';
    r.mode = { rem: 0, loc: 1, man: 2 }[op];
    return '';
  }
  if (op === 'ack') {
    r.ack = r.sf || r.ms || r.nb || r.eb ? 1 : 0;
    r.hoot = 0;
    return '';
  }
  if (op === 'reset') {
    if (r.f1t || Object.values(r.d).some(x => x.stk)) return 'the fault is still there';
    r.sf = r.ms = r.nb = r.eb = r.hoot = r.ack = r.tn = r.te = 0;
    for (const k in r.d) r.d[k].f = r.d[k].t = 0;
    if (r.st > 8) anCtcGo(r, 0);
    return '';
  }
  if (op === 'seq') {
    if (r.mode === 2) return 'in MANUAL no sequence runs';
    r.stop = r.ret = 0;
    anCtcInit(r);
    if (r.st < 11) anCtcGo(r, 0);
    return '';
  }
  if (op === 'start' || op === 'stop') {
    if (r.mode === 2) return 'in MANUAL: select an AUTO mode first';
    if (r.mode === 0) return 'in REMOTE AUTO: start and stop are in the DCS';
    if (op === 'stop') {
      anCtcStop(r);
      return '';
    }
    if (r.st) return 'the sequence runs';
    return anCtcStart(r) ? '' : 'not READY TO START';
  }
  return 'no such command';
}
/* level of a hopper (m) from its ash */
function anHopLevel(m) {
  const h = AN_PKG.hop,
    v = m / AN_PKG.rho;
  return h.h * Math.cbrt(Math.min(1, v / ((h.a * h.b * h.h) / 3)));
}
function anEspStep(U, e, fa, dt) {
  const pw = !(U.el && U.el.bo),
    F = AN_SRC.field;
  /* the field operator at the EP panel (AN.field('esp'), the Training step): SYSTEM AUTO START / STOP */
  if (!!F.esp !== e.last) anEspSys(e, !!F.esp);
  for (const id in e.d) {
    const d = e.d[id],
      k = id[0] === 'M' ? +id[3] : 0,
      n = id[0] === 'M' ? +id[4] : 0,
      vb = n >= 4 && fa.vib && fa.vib[2 * k + n - 4] > 0;
    if (!pw || d.flt) {
      d.run = d.cmd = 0;
      d.t = 0;
      continue;
    }
    if (!d.auto) d.run = d.cmd;
    else if (id === 'F1201') d.run = e.fan;
    else if (id === 'H1201') d.run = e.htr;
    else if (!e.sys) {
      d.run = vb ? 1 : 0;
      d.t = 0;
    } else {
      const on = d.ton * 60,
        off = d.toff * 60;
      d.t = on > 0 ? (d.t + dt) % (on + off) : 0;
      d.run = (on > 0 && d.t < on) || vb ? 1 : 0;
    }
  }
  let K = 0;
  for (let f = 0; f < 5; f++) {
    const r = e.tr[f],
      [kv, ma, a] = AN_PKG.tr[f],
      full = e.lv[2 * f] >= AN_PKG.hop.h || e.lv[2 * f + 1] >= AN_PKG.hop.h;
    if (!pw || r.alm) r.run = 0;
    const x = r.run && !full ? Math.sqrt(Math.max(0, r.lim) / 100) : 0;
    r.kv = kv * x;
    r.ma = r.run ? (ma * r.lim) / 100 : 0;
    r.pv = 460 * x;
    r.pa = r.run ? (a * r.lim) / 100 : 0;
    r.uv = r.run && r.kv < 5 ? r.uv + dt : 0;
    if (r.uv >= 30) {
      r.run = 0;
      r.alm = 1;
      r.uv = 0;
    }
    K += (x * x) / 5;
  }
  U.espK = K;
  F.esp = e.tr.some(r => r.run);
  e.last = F.esp;
  /* the ash: kg/h to the precipitator, field by field */
  const all = Math.max(0, U.flyA || 0) * 1000;
  let q = (all * (1 - AN_PKG.ah)) / 3600;
  const qN = U.dustIn > 0 ? ((U.flyA || 0) * 1e9) / U.dustIn : 0;
  for (let i = 0; i < 4; i++) e.h[10 + i] += (all * AN_PKG.ah * dt) / 3600 / 4;
  for (let f = 0; f < 5; f++) {
    const w = e.tr[f].kv / AN_PKG.tr[f][0],
      c = qN > 1000 ? q * (1 - Math.exp((-AN_ESP.wA / 5 / qN) * w * w)) : 0,
      d = e.d['M12' + f + '1'],
      on = Math.max(1, (d.auto ? d.ton : 2) * 60);
    q -= c;
    e.pl[f] += c * dt;
    if (d.run && !(e.pl0[f] > 0)) e.pl0[f] = e.pl[f] / on;
    if (!d.run) e.pl0[f] = 0;
    const fall = d.run ? Math.min(e.pl[f], Math.max(e.pl0[f], c) * dt) : 0;
    e.pl[f] -= fall;
    e.h[2 * f] += fall / 2;
    e.h[2 * f + 1] += fall / 2;
  }
  for (let i = 0; i < 14; i++) {
    /* the air heater hoppers: their size is not in the docs, no level */
    e.lv[i] = i < 10 ? anHopLevel(e.h[i]) : 0;
    e.lsh[i] = i < 10 && e.lv[i] >= AN_PKG.hop.hi ? 1 : 0;
  }
}
/* SYSTEM AUTO START / STOP: the rappers on their intervals, the purge fan, the rectifiers that are at REMOTE and healthy */
function anEspSys(e, on) {
  e.sys = on ? 1 : 0;
  if (on) e.fan = 1;
  for (const r of e.tr) if (r.rem && (!on || !r.alm)) r.run = on ? 1 : 0;
  e.last = e.tr.some(r => r.run);
  AN_SRC.field.esp = e.last;
}
function anFaStep(U, a, e, dt) {
  const K = AN_PKG,
    pw = !(U.el && U.el.bo),
    pa = isFinite(U.paPU) ? U.paPU * 0.980665 : 0;
  a.pal = pa < 4 ? 1 : 0;
  a.hh = a.silo >= K.silo ? 1 : 0;
  a.hi = a.silo >= K.silo - 16100 ? 1 : 0;
  a.lo = a.silo <= 0 ? 1 : 0;
  a.ready = pw && !a.pal && !a.hh ? 1 : 0;
  if (!a.vib) a.vib = new Array(10).fill(0);
  for (let i = 0; i < 10; i++) a.vib[i] = Math.max(0, a.vib[i] - dt);
  /* the air of the header to the vessels with their air valve open */
  let sum = 0;
  for (const [id, L] of K.tk) if (a.t[id].sv[2]) sum += (K.air * L) / 2000;
  const sh = pa >= 2.5 ? Math.min(1, K.air / Math.max(1e-9, sum)) : 0;
  let q = 0;
  for (const [id, L, hop] of K.tk) {
    const t = a.t[id],
      V = L / 1000,
      full = V * K.rho,
      nom = (K.air * L) / 2000 /* Nm3/s of its orifice */,
      go = t.on && !t.pf && !t.tf && a.ready;
    t.air = t.sv[2] ? nom * sh : 0;
    t.t += dt;
    if (!pw) {
      /* no power: the solenoids drop, every valve shut (air to open) */
      t.sv = [0, 0, 0];
      t.st = 0;
      t.p = 0;
      continue;
    }
    if (t.st === 0) {
      /* at rest; a tank that is started runs its first batch with no ash */
      t.sv = [0, 0, 0];
      if (go) anFaGo(t, 1);
    } else if (t.st === 1) {
      /* pressurize */
      t.sv = [0, 0, 1];
      t.p = Math.min(pa, t.p + (t.air * dt) / Math.max(0.02, V - t.m / 2200));
      if (t.p >= 2.5) anFaGo(t, 2);
      else if (t.t > 2 * ((2.5 * V) / nom) * (1 / Math.max(0.05, K.air / Math.max(K.air, sum)))) {
        t.pf = 1;
        anFaGo(t, 0);
      }
    } else if (t.st === 2) {
      /* convey: every kg takes its air; the pressure of the empty vessel falls through the open line */
      t.sv = [0, 1, 1];
      const out = t.blk ? 0 : Math.min(t.m, (t.air / K.spec) * dt);
      t.m -= out;
      q += out / dt;
      a.silo = Math.min(K.silo, a.silo + out);
      if (t.m <= 0 && !t.blk) t.p = Math.max(0, t.p - (2.5 * dt) / Math.max(2, (2.5 * V) / Math.max(1e-6, t.air)));
      if (t.m <= 0 && t.p <= 0.4) anFaGo(t, 3);
      else if (t.t > 2 * ((full * K.spec + 2.5 * V) / nom) * Math.max(1, sum / K.air)) {
        t.tf = 1;
        anFaGo(t, 0);
      }
    } else if (t.st === 3) {
      /* air closed 5 s, then the discharge closed 3 s */
      t.sv = [0, t.t < 5 ? 1 : 0, 0];
      t.p = Math.max(0, t.p - dt);
      if (t.t >= 8) {
        t.n++;
        if (t.on && a.ready && !t.pf && !t.tf) {
          anFaGo(t, 4);
          t.pur = 1;
          for (const i of hop) if (i < 10) a.vib[i] = 3;
        } else anFaGo(t, 0);
      }
    } else if (t.st === 4) {
      /* fill to the level probe; a STOP closes the inlet and sends what is in */
      t.sv = [1, 0, 0];
      t.p = 0;
      t.pur = t.t < 2 ? 1 : 0;
      const w = Math.min(K.bev * dt, full - t.m);
      for (const i of hop) {
        const x = Math.min(e.h[i], w / hop.length, full - t.m);
        e.h[i] -= x;
        t.m += x;
      }
      if (t.m >= full - 0.01 || !t.on || !a.ready) anFaGo(t, t.m > 0.01 ? 1 : 0);
    }
    t.lsh = t.m >= full - 0.01 ? 1 : 0;
    t.lv = (100 * t.m) / full;
  }
  a.q = q * 3.6 /* t/h */;
  /* the vent filter of the silo starts with a tank; the dry unloader is at its local box */
  const any = Object.values(a.t).some(t => t.on);
  a.vf = pw && !a.vft && (a.vfr ? (any || a.unl ? 1 : 0) : a.vf) ? 1 : 0;
  if (!pw) a.unl = 0;
  a.ut = a.unl ? (a.ut || 0) + dt : 0;
  a.g2 = a.unl;
  a.g1 = a.flu = a.unl && a.ut > 5 && a.silo > 0 ? 1 : 0;
  if (a.g1) a.silo = Math.max(0, a.silo - K.unl * dt);
  a.lv = (100 * a.silo) / K.silo;
  /* the conveying air has to leave by the vent filter: with its fan stopped the silo pressure rises (O&M 5.7) */
  a.ph = q > 0 && !a.vf ? 1 : 0;
  /* the hard-wired points XA-FH1701 / 1704 of the panel: common alarm, no power */
  a.npw = pw ? 0 : 1;
  a.ca = a.npw || a.pal || a.hh || a.vft || Object.values(a.t).some(t => t.pf || t.tf) ? 1 : 0;
}
function anFaGo(t, st) {
  t.st = st;
  t.t = 0;
  if (!st) {
    t.sv = [0, 0, 0];
    t.p = 0;
  }
}
function anPkgStep(U, dt) {
  if (!(dt > 0)) return;
  const P = anPkg(U);
  for (let x = dt; x > 0; x -= 2) {
    const s = Math.min(2, x);
    anFaStep(U, P.fa, P.esp, s);
    anEspStep(U, P.esp, P.fa, s);
    anCtcStep(U, P.ctcs, s);
  }
}
/* an operator action on a package panel: '' = done, else why not. By 'rem' the field operator turns the selector, by 'flt' the fault clears */
function anPkgOp(panel, dev, op, v) {
  const U = AN_UNIT;
  if (!U || !U.on) return 'no plant running';
  const P = anPkg(U);
  if (U.el && U.el.bo && op === 'start') return 'no power on the panel (black-out)';
  if (panel === 'esp') {
    const e = P.esp;
    if (dev === 'SYS') return op === 'start' || op === 'stop' ? (anEspSys(e, op === 'start'), '') : 'no such command';
    if (dev === 'HAMMER' || dev === 'VIBRATOR') {
      for (const id in e.d) if (id[0] === 'M' && +id[4] >= 4 === (dev === 'VIBRATOR') && e.d[id].rem) e.d[id].auto = 1;
      return '';
    }
    if (dev === 'FANHTR') {
      e.fan = e.htr = op === 'start' ? 1 : 0;
      return '';
    }
    const r = /^TR[1-5]$/.test(dev) ? e.tr[+dev[2] - 1] : e.d[dev];
    if (!r) return 'no such device';
    if (op === 'rem') return (r.rem = v ? 1 : 0), '';
    if (op === 'reset') return (r.alm !== undefined ? (r.alm = 0) : (r.flt = 0)), '';
    if (op === 'lim' || op === 'ton' || op === 'toff') {
      const x = +v;
      if (!(op in r)) return 'no such setting';
      if (!isFinite(x) || x < 0 || x > (op === 'lim' ? 100 : 999)) return 'out of range';
      r[op] = x;
      return '';
    }
    if (!r.rem) return 'selector at LOCAL';
    if (op === 'auto' || op === 'man') {
      if (r.auto === undefined) return 'no AUTO on this device';
      r.auto = op === 'auto' ? 1 : 0;
      if (op === 'man') r.cmd = r.run;
      return '';
    }
    if (op !== 'start' && op !== 'stop') return 'no such command';
    if (op === 'start' && (r.alm || r.flt)) return 'fault not reset';
    if (r.auto) return 'in AUTO: set MANUAL first';
    if (r.alm !== undefined) r.run = op === 'start' ? 1 : 0;
    else r.cmd = op === 'start' ? 1 : 0;
    return '';
  }
  if (panel === 'fa') {
    const a = P.fa;
    if (dev === 'RESET') {
      for (const id in a.t) a.t[id].pf = a.t[id].tf = 0;
      a.vft = a.utr = 0;
      return '';
    }
    if (dev === 'MCP') return op === 'rem' ? ((a.rem = v ? 1 : 0), '') : 'no such command';
    if (dev === 'UNL') {
      if (op === 'start' && a.utr) return 'fault not reset';
      a.unl = op === 'start' ? 1 : 0;
      return '';
    }
    const t = a.t[dev];
    if (!t) return 'no such device';
    if (!a.rem) return 'panel MCP-1250 at LOCAL';
    if (op === 'start') {
      if (t.pf || t.tf) return 'fail not reset';
      if (!a.ready) return 'system not ready (air tank pressure low or silo level HH)';
      t.on = 1;
      return '';
    }
    if (op === 'stop') return (t.on = 0), '';
    return 'no such command';
  }
  if (panel === 'ctcs') return anCtcOp(P.ctcs, dev, op, v);
  return 'no such panel';
}
