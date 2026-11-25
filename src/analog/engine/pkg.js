/* LANE 6 (EIMI): THE PACKAGE PANELS of the boiler (their own PLC, on the DCS by Modbus): electrostatic precipitator, fly ash.
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
     the design ash flow below HH, HH = full, L = empty (CALC). Dry unloader 150 m3/h, vent filter M-1250 starts with the first tank. */
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
  return U.pkg;
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
  return 'no such panel';
}
