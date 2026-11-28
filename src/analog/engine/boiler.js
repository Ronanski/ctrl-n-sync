/* 3.2.1 (SEULGI : PLANT MODEL HELPER, boiler side; user 2026-11-04 "Cge payag" to the split with IRENE: IRENE = turbine side,
   SEULGI = boiler side). One file for the boiler-side systems of the plant model; called by unit.js (anUnitStart / anUnitCold /
   anUnitStep: one line each). Every number has its source here and in docs/versions/v3.2.1/DIESEL_OIL_PLANT_MODEL.md; NO-SOURCE =
   not found in the documents, the value used is written down.

   ===== DIESEL OIL SYSTEM (006 DIESEL OIL SYSTEM) =====
   Connection, flow diagram K1AU3-PD-022 sheet 1/5 Rev D (RB set) and Mass Balance K1AU3-MB-022 Rev 0:
     oil service tank T-0701 (LT-DO0701) -> V-DO0003 -> V-DO0004 -> suction strainer STR-DO0002 (DPT-DO0001) -> diesel oil pumps
     P-0702A / B (screw pumps, M-0702A / B: DITL-31, machine instance #B) -> common discharge (PT-DO0005, ABC-028 PICDO0005)
       -> recirculation PCV-DO0002 back to the tank (the MV of PICDO0005)
       -> unit 2 start-up burners (closed here: unit 2 is not in the plant model)
       -> unit 1 supply FCV-DO1012 (ABC-029 HICDO1012) -> burner ring (PT-DO1008, ABC-029 PICDO1008)
            -> start-up burners A ~ D: FCV-DO1043-x3 (ABC-003x FICDO1043x) -> shut-off valves XV-DO1043-x1 / x2 (DITL-16, #B ~ #D,
               "OIL SUPPLY LINE VALVE (1) / (2) OPENED") -> PT-DO1043-x2 -> oil gun (FT-DO1043-x, PV of FICDO1043x)
            -> return PCV-DO1009 (the MV of PICDO1008: back pressure of the ring) -> tank.
   Sources:
     pump, valves, line: from the design documents (AN_DO notes, Phase 11 2026-11-27).
     burner   M&S load curve 1612 13-4-71 (tip N 90 AG 8, LMYP-1, on the PC): oil pressure linear in the flow, 5.0 bar at 3072 kg/h
              (MAX), 614.4 kg/h MIN (range 1:5, BMS description 1612 13-4-105). Burner supply 10.5 kg/cm2 (MB-022 items 8-1 ~ 8-4): FCV-DO1043-x3 full
              open gives the MAX at that ring pressure (DESIGN-SRC: MB-022 8-x and the M&S curve).
     limits   alarm list "Alarm List _20160912": PT-DO0005 H 19.5 / normal 15 / L 5 / LL 3; LT-DO0701 H 7.5 / L 3, 2 / LL 0.2 m;
              DPT-DO0001 H 0.1 / HH 0.2; PT-DO1043-x2 HH 6.0 / H 5.5 / L 0.8. DITL-31 (drawing): tank < 0.2 m and strainer > 0.8
              kg/cm2 = pump trip, outlet < 5 kg/cm2 = standby AUTO start, < 7 = LOW alarm (world/plantsw.js rows r15 / r17 / r28).
     tank area A from the inventory table (below); oil density 0.87 from the pump data (below); current and pressure lags (1 s),
              the unit 2 branch closed. */
const AN_DO = {
  /* Phase 11 (SUZU 2026-11-27, NO-FIT-OK: history, the valve sizes, the line and the pump current were a plant calibration). From the
     design documents (YUA PC read, /mnt/project-files/suzu-pc-answers-2026-11-27.md 3):
     pump     DESIGN-SRC: ALLWEILER SNH660 ER40E6.9-W2 data K1AU3-D1-0-060 R0 p 6 / 8: 33.9 m3/h at 15.5 bar dP, 1.8 mm2/s, oil 0.87
              kg/dm3 = 29.5 T/H (a screw pump: the flow stays with the pressure). MB-022 items 2-1 / 2-2 print 25 T/H, the system
              design flow, below the machine's own; the machine is used;
     valves   DESIGN-SRC: control valve sheets K1AU3-E2-0-123 R1 (Copes-Vulcan): PCV-DO0002 Cv 17.4 (p 218), FCV-DO1012 Cv 17.1 (p 228),
              PCV-DO1009 Cv 6.1 (p 223). Flow T/H = 0.865 Cv sqrt(dP bar / SG) m3/h x SG (ISA S75 liquid, SG 0.87, 1 kg/cm2 =
              0.980665 bar) = 0.799 Cv sqrt(dP kg/cm2). Opening -> share of Cv through the two sizing points printed on each sheet
              (straight lines between them, 0 and 100 %): PCV-DO0002 modified parabolic 11 % -> 1.1, 70 % -> 11 of 17.4; FCV-DO1012
              modified parabolic 9 % -> 0.78, 59 % -> 8.49 of 17.1; PCV-DO1009 cascade 13 % -> 0.46, 72 % -> 4.56 of 6.1;
     line     DESIGN-SRC: mass balance K1AU3-MB-022 (A2-0-001 RA p 14): pump header item 3 15 kg/cm2, unit 1 supply items 6 / 7
              13 kg/cm2 at 12.5 T/H: the line to FCV-DO1012 takes 2 kg/cm2 at 12.5 T/H (loss with the flow squared). */
  Qp: 33.9 * 0.87 /* T/H per pump */,
  Prv: 16.5 /* kg/cm2, pump relief DT44A set 16.5 bar (D1-0-060) */,
  kCv: 0.865 * Math.sqrt(0.87 * 0.980665),
  cv: {
    a: { max: 17.4, x: [0, 11, 70, 100], c: [0, 1.1, 11, 17.4] },
    f: { max: 17.1, x: [0, 9, 59, 100], c: [0, 0.78, 8.49, 17.1] },
    r: { max: 6.1, x: [0, 13, 72, 100], c: [0, 0.46, 4.56, 6.1] }
  },
  Kl: 12.5 / Math.sqrt(15 - 13) /* T/H per sqrt(kg/cm2), header -> FCV-DO1012 inlet (MB-022 items 3 / 6) */,
  g: 0.6144 * 0.980665 /* T/H per kg/cm2 at the gun: 614.4 kg/h per bar (M&S 1612 13-4-71) */,
  Kb:
    3.072 /
    Math.sqrt(
      10.5 - 5 / 0.980665
    ) /* FCV-DO1043-x3 full open: MAX 3072 kg/h at 5 bar with 10.5 kg/cm2 ring (MB-022 8-x) */,
  dp0: 0.029 /* kg/cm2 strainer at 25 T/H (SNAPSHOT-TO-REPLACE: read from the plant; no strainer sheet read yet) */,
  /* the motor (DESIGN-SRC: TECO 40 HP 4P 460 V, D1-0-060 p 9: FLC 46.0 A, eff 92.5 %, pf 88.0 %) and the pump power (ALLWEILER SNH 660
     p 7 / 8: shaft 2.6 kW at 0 bar + 1.09 kW per bar, 19.5 kW at 15.5 bar). Current = sqrt(Ia^2 + Im^2): active Ia = P / (eff x sqrt3 x
     460 V); the magnetizing current of an induction motor hardly changes from no load to full load, so Im = the reactive current
     at full load 46.0 x sin(acos 0.88) = 21.8 A (the test report with the no-load current is not in D1-0-060) */
  pk0: 2.6,
  pk1: 1.09,
  eff: 0.925,
  Im: 46.0 * Math.sin(Math.acos(0.88)),
  /* beta.292 (JENNIE, Full Audit 3 #5, was 23.8 m2 NO-SOURCE): "Limay Project Diesel Oil Tank Inventory Table" 2016-08-16 (O&M V28,
     PC only): DCS level 0.5 m = 43.0 m3 ... 7.7 m = 300.0 m3, linear in between (7.1 m 279.8, 6.9 m 272.6: 36 m3 per m). The tank
     area is the slope: (300.0 - 43.0) / (7.7 - 0.5) = 35.69 m2 (CALC; inside the bound 300 m3 / 7.5 m = 40 m2 of the Equipment List
     K1AU3-L1-0-002 p 29 and the LT-DO0701 H alarm) */
  A: (300.0 - 43.0) / (7.7 - 0.5),
  /* beta.294 (JENNIE, Full Audit 3 #5, was 0.85 NO-SOURCE): the diesel oil of the pump data, ALLWEILER characteristic curves SN 660 / 40
     (offer XZ-EPPA31 2014-02-21, K1AU3-D1-0-060 R0 Engineering Data of Diesel Oil Pump p 7, PC only): "Liquid pumped Diesel Oil,
     Density 0,87 kg/dm3", 40 C. Used only for the tank level (the volume of the oil burnt) */
  rho: 0.87 /* t/m3 */,
  L0: 4.978 /* m, the tank level of the start state (SNAPSHOT-TO-REPLACE: read from the plant) */,
  /* the field valves of the diesel oil line-up (PD-022 1/5 Rev D): tank outlet V-DO0003, strainer inlet V-DO0004, pump A
     suction V-DO0015 / discharge V-DO0007, pump B suction V-DO0016 / discharge V-DO0009; open in service (the start state) */
  fv0: { 'V-DO0003': 100, 'V-DO0004': 100, 'V-DO0015': 100, 'V-DO0007': 100, 'V-DO0016': 100, 'V-DO0009': 100 },
  pv: [
    ['V-DO0015', 'V-DO0007'],
    ['V-DO0016', 'V-DO0009']
  ],
  pumps: ['DITL-31', 'DITL-31 #B'],
  brn: ['', ' #B', ' #C', ' #D'] /* DITL-16 machine instances: burner A ~ D */,
  svc: ['M.3410', 'M.3411', 'M.3416', 'M.3417'] /* ABC-003x "SUPPLY OIL VALVE CLOSE" (unit.js comment of AN_UNIT ao) */,
  rows: { sv1: 21, sv2: 23 } /* DITL-16 output rows (0-based) "OIL SUPPLY LINE VALVE (1) / (2) OPENED" */
};
/* the opening of a diesel oil field valve (0 ~ 100 %): the field operator's (AN_SRC.valve) or the line-up of the start state */
function anDoFv(tag) {
  const V = (typeof AN_SRC !== 'undefined' && AN_SRC.valve) || {};
  return isFinite(V[tag]) ? V[tag] : AN_DO.fv0[tag];
}
/* the field operator sets a diesel oil manual valve; false for an unknown tag */
function anDoValve(tag, pct) {
  if (!(tag in AN_DO.fv0) && !(typeof AN_LM !== 'undefined' && tag in AN_LM.fv0))
    return false; /* + limestone HV01 / HV11 */
  AN_SRC.valve = AN_SRC.valve || {};
  AN_SRC.valve[tag] = Math.max(0, Math.min(100, +pct || 0));
  return true;
}
/* the oil flow of one burner (T/H) at ring pressure P2 through its control valve x (0 ~ 1) and the gun (Q = g x Pgun):
   Q^2 = Kb^2 x^2 (P2 - Q / g) */
function doBurnerQ(P2, x) {
  const K = AN_DO,
    a = K.Kb * K.Kb * x * x;
  if (!(P2 > 0) || !(a > 0)) return 0;
  const b = a / K.g;
  return (-b + Math.sqrt(b * b + 4 * a * P2)) / 2;
}
/* a diesel oil valve at opening x (0 ~ 1): T/H per sqrt(kg/cm2) from its Cv curve (AN_DO.cv, the two sizing points of the sheet) */
function doK(v, x) {
  const C = AN_DO.cv[v],
    p = Math.max(0, Math.min(100, 100 * (x || 0)));
  let i = 1;
  while (i < C.x.length - 1 && p > C.x[i]) i++;
  const cv = C.c[i - 1] + ((C.c[i] - C.c[i - 1]) * (p - C.x[i - 1])) / (C.x[i] - C.x[i - 1]);
  return AN_DO.kCv * cv;
}
/* the steady pressures of the network for a pump capacity Qc (T/H): P1 (PT-DO0005), P2 (PT-DO1008), flows */
function doSolve(Qc, xa, xf, xr, xb) {
  const K = AN_DO,
    sq = x => Math.sqrt(Math.max(0, x)),
    kr = doK('r', xr),
    kfv = doK('f', xf),
    ring = P2 => kr * sq(P2) + xb.reduce((s, x) => s + doBurnerQ(P2, x), 0),
    kf = kfv > 0 ? 1 / Math.sqrt(1 / kfv ** 2 + 1 / K.Kl ** 2) : 0; /* FCV-DO1012 and the line, in series */
  /* for a header P1: the ring pressure where the flow through FCV-DO1012 = return + burners */
  const p2Of = P1 => {
    if (!(kf > 0) || !(P1 > 0)) return 0;
    let a = 0,
      b = P1;
    for (let i = 0; i < 30; i++) {
      const m = (a + b) / 2;
      if (kf * sq(P1 - m) > ring(m)) a = m;
      else b = m;
    }
    return (a + b) / 2;
  };
  const out = P1 => {
    const P2 = p2Of(P1);
    return { P2, qa: doK('a', xa) * sq(P1), qf: kf * sq(P1 - P2) };
  };
  if (!(Qc > 0)) return { P1: 0, P2: 0, qa: 0, qf: 0, qrv: 0 };
  let r = out(K.Prv);
  if (r.qa + r.qf <= Qc)
    return Object.assign(r, { P1: K.Prv, qrv: Qc - r.qa - r.qf }); /* the relief valve takes the rest */
  let a = 0,
    b = K.Prv;
  for (let i = 0; i < 30; i++) {
    const m = (a + b) / 2;
    r = out(m);
    if (r.qa + r.qf < Qc) a = m;
    else b = m;
  }
  const P1 = (a + b) / 2;
  return Object.assign(out(P1), { P1, qrv: 0 });
}
/* the AI blocks (every sheet) of one I/O address on the station of a sheet */
function doAIs(sheet, ai) {
  const sh = AN.sheets.find(x => x.name === sheet);
  const st = sh && sh.S ? shStn(sh) : null;
  return st != null ? anUnitAIs(st + '|' + ai) : [];
}
/* the opening (0 ~ 1) of a valve driven by a controller / MAN station output (the HMI shows the opening = MV, plant.js) */
function doOut(sheet, tag) {
  const sh = AN.sheets.find(x => x.name === sheet),
    S = sh && sh.S;
  if (!S) return null;
  const c = AN.hmiCtrls ? (AN.hmiCtrls(S) || []).find(q => q.tag === tag) : null;
  if (c && c.out != null) return { S, n: c.out, t: tag };
  const b = S.blk.find(z => z.k === 'MAN' && (z.tag === tag || (z.txt || []).includes(tag)));
  return b && b.o && b.o[0] != null && b.o[0] >= 0 ? { S, n: b.o[0], t: tag } : null;
}
/* 3.2.1: a pneumatic valve with an airlock stays in place below 3.5 kg/cm2 of instrument air (unit.js AN_AV) */
const doX = (o, d) =>
  o && isFinite(o.S.rt.v[o.n])
    ? Math.max(0, Math.min(100, typeof anAv === 'function' ? anAv(o.t, +o.S.rt.v[o.n]) : +o.S.rt.v[o.n])) / 100
    : d;
/* called by anUnitStart after U.own is made: the transmitters this model writes */
function anBoilerStart(U) {
  const D = (U.do = { ai: {}, ctl: {} });
  const A = D.ai;
  A.p1 = doAIs('ABC-028', 'AI0181');
  A.p2 = doAIs('ABC-029', 'AI0514');
  A.lv = doAIs('ABC-028', 'AI0245');
  A.dp = doAIs('ABC-028', 'AI0182');
  A.za = doAIs('ABC-028', 'AI0246');
  A.zr = doAIs('ABC-029', 'AI0182');
  A.zf = doAIs('ABC-029', 'AI0276');
  A.i = [doAIs('ABC-028', 'AI0080'), doAIs('ABC-028', 'AI0096')];
  A.pb = ['AI0293', 'AI0439', 'AI0596', 'AI0771'].map((a, i) => doAIs('ABC-003' + 'ABCD'[i], a));
  A.fb = ['AI0515', 'AI0546', 'AI0517', 'AI0548'].map((a, i) => doAIs('ABC-003' + 'ABCD'[i], a));
  A.zb = ['AI0292', 'AI0438', 'AI0595', 'AI0770'].map((a, i) => doAIs('ABC-003' + 'ABCD'[i], a));
  const C = D.ctl;
  C.a = doOut('ABC-028', 'PICDO0005');
  C.r = doOut('ABC-029', 'PICDO1008');
  C.f = doOut('ABC-029', 'HICDO1012');
  C.b = 'ABCD'.split('').map(x => doOut('ABC-003' + x, 'FICDO1043' + x));
  const lists = [A.p1, A.p2, A.lv, A.dp, A.za, A.zr, A.zf].concat(A.i, A.pb, A.fb, A.zb);
  for (const l of lists) for (const [S2, b] of l) U.own.add(S2.rt.st[b.id]);
  /* the tank: the level of the starting state (6.PNG 4.978 m) */
  const lv = anUnitVal(A.lv);
  U.doLv = isFinite(lv) ? lv : AN_DO.L0;
  U.doP1 = U.doP2 = NaN; /* the first step is at the steady value */
  U.doSp = null;
  U.doZ = {};
  for (const k in AN_DO.fv0) if (AN_SRC.valve) delete AN_SRC.valve[k];
  for (const k in AN_LM.fv0) if (AN_SRC.valve) delete AN_SRC.valve[k];
  anFanStart(U);
  anLmStart(U);
  anSdStart(U, 6.8 /* the plant air header at load, kg/cm2 (AN_BA note), before its first step */);
  anBaStart(U);
}
/* called by anUnitCold: the pumps are the DITL's (stopped in a cold plant); the tank keeps its level */
function anBoilerCold(U) {
  U.fnZ = {};
  U.doP1 = U.doP2 = NaN;
  U.doSp = null;
  U.doZ = {};
  for (const k in AN_DO.fv0) if (AN_SRC.valve) delete AN_SRC.valve[k];
  anLmStart(U); /* limestone: at rest, the vessels keep the start content (NO-SOURCE) */
  anSdStart(U);
  anBaStart(U);
}
/* one step of the diesel oil system */
function anDieselOilStep(U, dt) {
  const K = AN_DO,
    D = U.do;
  if (!D) return;
  const lag = (k, x, tau) => (U[k] = isFinite(U[k]) ? U[k] + ((x - U[k]) * Math.min(dt, tau)) / tau : x);
  /* the pumps: running contact of DITL-31 (A) / #B; the suction line-up (tank outlet, strainer inlet, pump suction) and a tank
     with oil above the suction (alarm list LL 0.2 m) */
  const suc = Math.min(anDoFv('V-DO0003'), anDoFv('V-DO0004')) / 100,
    lvOk = U.doLv > 0.05 ? 1 : 0;
  const run = K.pumps.map(n => ((typeof anDitlRun === 'function' ? anDitlRun(n) === 1 : false) ? 1 : 0));
  const sp = U.doSp || (U.doSp = run.slice());
  run.forEach(
    (r, i) => (sp[i] += ((r - sp[i]) * Math.min(dt, 1)) / 1)
  ); /* screw pump: up to speed in about 1 s (NO-SOURCE) */
  const own = K.pv.map(([a, b]) => Math.min(anDoFv(a), anDoFv(b)) / 100),
    qi = sp.map(
      (s, i) => K.Qp * s * Math.min(1, own[i] * 4) * Math.min(1, suc * 4) * lvOk
    ) /* a valve 25 % open passes the full flow */,
    Qc = qi[0] + qi[1];
  /* the valves: the station outputs (the opening = MV) */
  const xa = doX(D.ctl.a, 0.242),
    xr = doX(D.ctl.r, 0.857),
    xf = doX(D.ctl.f, 1),
    vo = K.brn.map((x, i) => {
      /* the two shut-off valves open: the limit switches of the DITL valve (DITL-16 OPENED (1) and (2)), or the "SUPPLY OIL VALVE
         CLOSE" memory of the ABC sheets at 0 (M.3410 / 3411 / 3416 / 3417, the same switches; the Training opens them there:
         hmi-op.js anOilValve) */
      const s = typeof anDitlSheet === 'function' ? anDitlSheet('DITL-16' + x) : null;
      if (s && typeof DUI !== 'undefined' && DUI.outVal(s, K.rows.sv1) === 1 && DUI.outVal(s, K.rows.sv2) === 1)
        return 1;
      return typeof srcBit === 'function' && srcBit([K.svc[i]]) === 0 ? 1 : 0;
    }),
    xc = D.ctl.b.map(o => doX(o, 0)),
    xb = xc.map((x, i) => x * vo[i]);
  const r = doSolve(Qc, xa, xf, xr, xb);
  lag('doP1', r.P1, 1);
  lag('doP2', r.P2, 1);
  const qb = xb.map(x => doBurnerQ(U.doP2, x));
  U.doQb = qb;
  U.doPb = qb.map(q => q / K.g);
  U.doQ = Qc;
  U.doQa = r.qa;
  U.doQf = r.qf;
  U.doQrv = r.qrv;
  U.doVo = vo;
  /* 3.2.3-beta.90: the oil each gun gets with its two valves open (ring pressure and FCV-DO1043-x3 opening), for the flame scanners
     (03b-sim.js fdStep) */
  U.doQg = xc.map(x => doBurnerQ(U.doP2, x));
  /* audit 2026-11-21 B1: BT-DO1043-A ~ D flame detector (0 ~ 100 %): the oil the gun burns (U.doQb, its valves open) over its MAX 3072 kg/h (MB-022 8-x, AN_DO.Kb);
     no oil at the gun = no flame. The scanner's own curve is not in the docs: taken as linear in the firing */
  ['A', 'B', 'C', 'D'].forEach((n, i) => {
    (U.tt || (U.tt = {}))['BT-DO1043-' + n] = Math.round(10 * Math.min(100, (100 * (qb[i] || 0)) / 3.072)) / 10;
  });
  U.doDp = K.dp0 * (Qc / K.Qp) ** 2;
  /* the tank: the oil burnt leaves it (the recirculation, the ring return and the relief come back) */
  const burn = qb.reduce((s, q) => s + q, 0);
  U.doBurn = burn;
  /* 3.2.3 (live Cold start 2026-11-14: after about 24 h of oil firing T-0701 fell to the LL 0.2 m, both pumps tripped (DITL-31), all
     four flames went out and DITL-03A tripped the boiler): the oil supply to T-0701 (receiving / storage) is outside the model
     boundary, like the coal yard and the demin water (scope 2026-11-07: a level the DCS reads never empties). The receiving side
     puts back what leaves: an unlimited supply (user 2026-11-14 "Unli supply"), the tank never falls below its level of the starting
     state L0 (3.2.3-beta.233; beta.232 refilled at 25 T/H, slow after a low level) */
  U.doLv = Math.max(K.L0, U.doLv - (burn / K.rho / K.A / 3600) * dt);
  /* the motors (AN_DO notes): shaft power from the pump curve at the pump's dP (outlet, suction about 0), current from the motor data;
     a pump with its valves shut makes no flow and runs at the no-load power */
  U.doI = sp.map((s, i) => {
    if (!run[i]) return 0;
    const P = K.pk0 + K.pk1 * (qi[i] > 0 ? Math.max(0, U.doP1) : 0) * 0.980665,
      Ia = (1000 * P) / (K.eff * Math.sqrt(3) * 460);
    return Math.sqrt(Ia * Ia + K.Im * K.Im);
  });
  /* write the transmitters */
  const A = D.ai,
    w = (l, x) => l && l.length && anUnitWrite(l, x);
  w(A.p1, U.doP1);
  w(A.p2, U.doP2);
  w(A.lv, U.doLv);
  w(A.dp, U.doDp);
  A.i.forEach((l, i) => w(l, U.doI[i]));
  A.pb.forEach((l, i) => w(l, U.doPb[i]));
  A.fb.forEach((l, i) => w(l, qb[i]));
  /* valve positions follow the command (P1 #1 of unit.js: actuator lag 3 s) */
  const z = U.doZ || (U.doZ = {}),
    zl = (k, x) => (z[k] = isFinite(z[k]) ? z[k] + ((x - z[k]) * Math.min(dt, 3)) / 3 : x);
  w(A.za, zl('a', xa * 100));
  w(A.zr, zl('r', xr * 100));
  w(A.zf, zl('f', xf * 100));
  A.zb.forEach((l, i) => w(l, zl('b' + i, xc[i] * 100)));
}
/* 3.2.1 SEULGI: FANS, AIR AND FLUE GAS (docs/versions/v3.2.1/FANS_PLANT_MODEL.md). The air and gas FLOWS stay those of the loop model
   (unit.js: FICFA1071 / FICFA1081 with the PAF / SAF running, PICFG108 with the IDF); this part adds what the loop model did not have:
   - FA blowers F-1055A / B (DITL-28A and its machine instance #B, IO STN103 I.0046 / I.0366): the fluidizing air (FICFA1055A, ABC-014,
     PV FIFA1055 = FT-FA1055 AI0545) needs a blower running with its outlet SOV open (XV-FA1055-A3 / B3, DITL-28C rows 9 "OUTLET SOV
     CLOSED" I.0045 / I.008F, or its OPEN COMMAND output 25: the closed limit of instance #B stays 1 after the command, a finding
     of the DITL valve model, FANS_PLANT_MODEL.md). No blower = no FA flow -> ABC-006 M.3114 "FAB OUTLET AIR FLOW L.L. < 20 T/H" -> DITL-28A #B standby start.
     Each blower gives flow by its inlet damper (FCV-FA1055-A1 / B1, ABC-014 FICFA1055A / B MV; linear, NO-SOURCE), 26.3 T/H at 42.8 %.
     PAF / SAF field trip: their air stops (unit.js U.mul with the motor drawings DITL-26A / 27A).
   - motor currents IT-F1053 PAF / IT-F1054 SAF / IT-F1056 IDF / IT-F1055A / B (STN103 AI0454 / 0469 / 0453 / 0452 / 0468): the current
     of the snapshot times (no-load share fI + the rest x air power / air power of the snapshot), air power = flow x pressure rise
     (fan law; no-load share fI per fan: PAF / SAF / IDF from their curves and motor data, beta.308; FA blower from its own curve, beta.324). IT-F1055A / B also feed DITL-28B row 12 "FAB A CURRENT" < 24.6 A (L.L.).
   - pressures: PAF outlet PT-FA1075 (AI0160) and FA header PT-FA1055-A / B (AI0294 / 0417) with the square of their flow (system
     curve); ESP outlet / IDF inlet PT-FG1141-A / B (AI0416 / 0772) and IDF outlet PT-FG1151 (AI0432) with the square of the total air.
   Anchors: 7.PNG (151 MW) PAF 253.6 A, SAF 134.0 A, IDF 199.6 A, PIFA1075 1551 at FIFA1071 354.0, PIFA1085 1427 at FIFA1081 213.0,
   PIFG1141A / B -442 / -450, PIFG1151 -7, TAF 592.1 T/H; 9.png (150 MW) FA BLOWER-A 37.3 A, FIFA1055 26.3 T/H, PIFA1055A 3257 /
   PIFA1055B 3315 mmH2O (B stopped with its outlet SOV closed reads the header: the transmitters are on the common side, from the
   snapshot). */
const AN_FN = {
  I0: { paf: 253.6, saf: 134.0, idf: 199.6, fa: 37.3 },
  /* beta.308 (JENNIE, Audit #5, PAF / SAF / IDF were fI 0.45 NO-SOURCE): the current at no air power, as a share of the snapshot current
     (PC-only vendor data). Motor current = sqrt(magnetizing^2 + active^2); magnetizing = the reactive current of the motor's own
     Eff & PF vs load curve at 10 - 20 % load; active = machine power at no flow / motor efficiency / (sqrt3 x 6.6 kV).
     PAF / SAF / IDF: K1AU3-D1-0-003 R0 (archive, Engineering Data of Boiler Fan): RF2-0580-DOC-1-0 TECO motor data, fan spec sheets.
     PAF: TECO AEZK 3700 kW 4 P (3A057H186-72076: 373 A, eff 95.8 %, PF 0.905). Curve FE14A701B1-E-P-L: 10 % load eff 0.80, PF 0.475
       -> 85.6 A, reactive 75 A. Fan D2118A TLT/1027 DWDI at 1780 rpm: power at no flow 480 on the chart (/2 = BkW) = 960 kW
       (26 % load, eff about 0.92) -> active 91 A. sqrt(75^2 + 91^2) = 118 A = 0.47 x 253.6 A.
     SAF: TECO AECK 1850 kW 4 P (FD14A202B1). Curve E-P-L: 10 % load eff 0.80, PF 0.39 -> reactive 48 A (20 %: 49 A). Fan D2118A
       TLT/935 DWDI at 1780 rpm: no flow 260 (/2) = 520 kW (28 % load, eff about 0.925) -> active 49 A. sqrt(48^2 + 49^2) = 69 A
       = 0.51 x 134.0 A.
     IDF: TECO AEZK 3300 kW 6 P (3A057H186-72068: 350 A, eff 96.0 %, PF 0.86). Curve FE14A702B1-E-P-L: 10 % load eff 0.80, PF 0.31
       -> reactive 112 A (20 %: 109 A). Fan D1902/10600 DWDI with Voith hydraulic coupling, speed 350 ~ 1145 rpm: at no air power it
       runs at the bottom speed; no-flow power 25 x 3 = 75 kW at 456 rpm -> x (350/456)^3 = 34 kW, and a fluid coupling takes the
       same torque at motor speed: 34 x 1193 / 350 = 116 kW, plus about 70 kW motor losses (10 % point) -> active 16 A.
       sqrt(112^2 + 16^2) = 113 A = 0.57 x 199.6 A. Check at the snapshot: 199.6 A -> active 165 A = 1.89 MW in; the fan curves at
       about 13,500 m3/min (151 MW gas) and 443 mmH2O give 1.25 MW fan power at about 755 rpm -> 1.97 MW at the motor (4 % apart).
     PAF / SAF limit: the chart is the inlet-vane fully open line; with the vanes shut the no-flow power is lower (no vane curve in
     the docs), so these two shares are the upper bound.
     FA blower: beta.324 (JENNIE, Audit #5 / user finding "FA blower A trips on low current when running with B"): no share; its
     current comes from its own curve (anFabKw / anFabI below). The 0.45 share and the straight line from 232 kW at 10,000 kg/h were
     both wrong: the power curve bends, and an inlet-throttled blower makes less power at the same mass flow. */
  /* Phase 11 rank 10: I0 / fI are now only the HMI estimate without the plant model (hmi2.js, AN.fanI); the plant model takes the
     PAF / SAF / IDF pressures and currents from the design documents (AN_FD below) */
  fI: { paf: 0.47, saf: 0.51, idf: 0.57 },
  fa: { Q0: 26.3, z0: 42.8, P0: [3257, 3315] } /* RULE 0 VIOLATION, FA flow at the damper and header pressure from a plant screen: no inlet valve Kv curve and no header system curve in the docs */,
  run: {
    paf: 'DITL-26A',
    saf: 'DITL-27A',
    idf: 'DITL-25A',
    fa: ['DITL-28A', 'DITL-28A #B'],
    sov: ['DITL-28C', 'DITL-28C #B']
  }
};
/* beta.324 (JENNIE): FA blower F-1055A / B power and current from the vendor data (PC-only plant documents).
   Blower: Continental 500.04 multistage centrifugal, 3,570 rpm constant speed, inlet damper FCV-FA1055-A1 / B1. Performance curve
   CIC-01-13005 (K1AU3-D1-0-004 R0 Engineering Data of Fluidizing Blower p.7), the middle air case (t1 40 C, 1.097 kg/m3,
   barometer 10,332.3 mmH2O abs), read every 2,500 ~ 5,000 kg/h: outlet gauge pressure H (mmH2O, inlet at the barometer) and
   machine power P (kW) vs mass flow (kg/h). The chart starts at 10,000 kg/h; under it H stays flat (the curve is flat there) and
   P goes on the line of 10,000 ~ 15,000 kg/h to no flow (56 kW, the shaft losses of a closed blower). Past the end (37,700) H falls
   to 0 at 38,400 and P is held.
   Flow element FE-FA1055 (K1AU3-E2-0-007 RA Orifice p.4, sheet 2 of 8): averaging pitot, 20", 0 ~ 35 T/H, normal 23 T/H, max 28 T/H
   at 5,230 mmAq and 91 C: the same 5,230 mmH2O at 27,500 kg/h as the middle curve, so FIFA1055 is the flow of this curve.
   Inlet damper (constant speed): the damper lowers the inlet pressure p1, so the inlet air is thinner (rho1 = rho_c x p1 / pb, same
   temperature). The blower moves the same volume as on the chart and keeps the pressure ratio of the chart at that volume:
   equivalent chart flow mc = m x pb / p1, and (pb + H(mc)) / pb = (pb + p2) / p1, p2 = header gauge pressure; one p1 meets it
   (left side falls and right side rises as p1 falls), found by halving. Power = P(mc) x p1 / pb (fan law for density).
   Check, 9.png (150 MW, blower A alone, B stopped): 26.3 T/H at PIFA1055A 3,257 -> p1 9,269 mmH2O abs, mc 29,317 kg/h, 400 kW.
   Motor TECO AFJH 480 kW 2 P 6.6 kV (O&M V10-5 FC149602B1): FLA 49.4 A, eff 95.5 %, PF 0.89 -> active 44.0 A, reactive 22.5 A at
   full load; magnetizing (reactive at 10 % load) 12.7 A. Active = power / 0.955 / (sqrt3 x 6.6 kV); reactive = 12.7 + (22.5 -
   12.7) x (active / 44.0)^2 (the leakage part grows with the square of the load current); current = sqrt(active^2 + reactive^2).
   At the snapshot this gives 41.5 A against 37.3 A read: the chart read and the motor curve are about 10 % high together, so the
   current is anchored to the snapshot: I = 37.3 x I(m, p2) / I(26.3 T/H, 3,257).
   Results (header 3,257): one blower 26.3 T/H 37.3 A; 20 T/H 33.2 A; 16 T/H 29.5 A; 13.2 T/H (two sharing 26.3) 26.5 A; 10 T/H
   22.5 A; no flow 12.1 A. DITL-28B row 12 L.L. 24.6 A sits at about 11.5 T/H on one blower. */
const AN_FAB = {
  pb: 10332.3,
  H: [[0, 6600], [10000, 6600], [15000, 6560], [20000, 6340], [22700, 6080], [25000, 5740], [27500, 5257], [30000, 4650], [33300, 3340], [35000, 2450], [37600, 800], [38400, 0]],
  P: [[0, 56], [10000, 232], [15000, 320], [20000, 382], [23000, 412], [25000, 432], [27500, 441], [30000, 447], [32000, 447], [33500, 443], [35000, 430], [37700, 405]]
};
const anFabLin = (t, x) => {
  if (x <= t[0][0]) return t[0][1];
  for (let i = 1; i < t.length; i++)
    if (x <= t[i][0]) {
      const [a, b] = t[i - 1],
        [c, d] = t[i];
      return b + ((d - b) * (x - a)) / (c - a);
    }
  return t[t.length - 1][1];
};
/* machine power (kW) of one blower at m kg/h into p2 mmH2O gauge */
const anFabKw = (m, p2) => {
  const pb = AN_FAB.pb,
    po = pb + Math.max(0, p2);
  let lo = 100,
    hi = po;
  for (let k = 0; k < 40; k++) {
    const p1 = (lo + hi) / 2;
    if ((pb + anFabLin(AN_FAB.H, (Math.max(0, m) * pb) / p1)) / pb > po / p1) hi = p1;
    else lo = p1;
  }
  const p1 = (lo + hi) / 2;
  return (anFabLin(AN_FAB.P, (Math.max(0, m) * pb) / p1) * p1) / pb;
};
/* the FA blower motor at machine kW kw: current I (A), electrical input P (kW), Q (kvar), on its TECO curve (Phase 11 AOI 2026-11-28,
   was a fixed 95.5 % / 0.89 with a guessed magnetizing law): M-1007A/B TECO AFJH-WT 480 kW, 6.6 kV (LMYP-2 motor data, the same
   motor on the load list; yui-reads-4.md): table 100 % eff 95.5 / PF 0.89 / 49.4 A, curve p11 75 % 95.2 / 0.87, 50 % 94.2 / 0.83
   (read +-1 %); the same law as the PAF / SAF / IDF motors (anFdEl, AN_FD.mot.fab) */
const anFabEl = kw => anFdEl(AN_FD.mot.fab, AN_FD.mot.fab.kW, kw);
/* current of one FA blower: running, its flow (T/H), the header gauge pressure (mmH2O) */
/* Phase 11 AOI 2026-11-28: the current is the TECO motor at the blower curve's machine kW (DESIGN-SRC, no other scale) */
const anFabI = (on, q, p2) => (on ? anFabEl(anFabKw(q * 1000, p2)).I : 0);
/* motor current: no-load share + the rest x air power over the snapshot one. Same law on the HMI (api.js fanI); the HMI fallback
   passes only the snapshot current, so the share is found by it */
/* beta.324: the FA blower has no share; the HMI fallback passes x = (flow ratio)^3, so it is read back as its flow and the header
   pressure on the square of the flow, and the blower curve gives the current */
const anFanI = (I0, on, x, f = AN_FN.fI[Object.keys(AN_FN.I0).find(k => AN_FN.I0[k] === I0)]) => {
  if (f == null && I0 === AN_FN.I0.fa) {
    const r = Math.cbrt(Math.max(0, x));
    return anFabI(on, AN_FN.fa.Q0 * r, AN_FN.fa.P0[0] * r * r);
  }
  return on ? I0 * (f + (1 - f) * Math.max(0, x)) : 0;
};
/* Phase 11 rank 10 (AOI, 2026-11-27, user "Go fix 11"): PAF / SAF / IDF ON THE DESIGN DOCUMENTS, in place of the 7.PNG snapshot
   anchors (pressures and currents through the 150 MW snapshot point, Rule 0). Sources (YUA PC reads, /mnt/project-files/
   aoi-fan-system-motors-2026-11-27.md and aoi-fan-curves-2026-11-27.md):
   SYSTEM CURVES, DESIGN-SRC K1AU3-D2-0-003 Rev A (Procuring Specification of Boiler Fans, FHI) Ch. 1-3, MCR, per fan (one fan
   each per boiler, D2-003 1-2 and FHI P5S1):
     PA  fan outlet 387,620 kg/h: furnace at the PA entry 1,092 + nozzles 550 + duct 90 + air heater 100 + duct 30 = discharge
         1,862 mmH2O; suction -118.
     SA  fan outlet 236,950 kg/h: furnace at the SA entry 1,016 + burner 250 + duct 140 + air heater 100 + duct / damper 31 =
         discharge 1,537; suction -118.
     ID  fan inlet 732,730 kg/h: furnace top -15, cyclone 205, superheater 50, economizer 60, duct / biasing damper 90 (= air heater
         gas inlet -420), air heater 110 (= air heater gas outlet -530), ESP 30, duct 50 = suction -610; discharge 25.
   The flow transmitters FT-FA1071 / FA1081 are at the fan inlets (alarm list FT sheet, see AN_APK), so the loop flow IS the fan flow.
   Each loss goes with the square of the flow (CALC; D2-003 prints MCR only: part-load NOT IN DOCS). The furnace pressure at the PA /
   SA entry is the weight of the fluidized bed: it goes with the bed model (cfb.js U.bedK = fluidized bed inventory / design). The ID
   gas goes with the total air over the FHI Fig 12 design total air 596 T/H (cfb.js AN_FG0); furnace top held at its design -15.
   FAN CURVES, DESIGN-SRC K1AU3-D1-0-003 R0 p145 (SA) / p151 (PA), inlet vanes full open, 40 C, 1780 rpm: static pressure SP vs the
   axis ACMM; per fan flow = axis / 2 (DERIVED by YUA: the spec SP falls at 2 x the spec ACMM on both curves). ACMM to T/H by the
   spec sheets' own density: PA 465,200 kg/h / 60 / 6,907 ACMM, SA 284,340 / 60 / 4,222 = 1.1225 kg/m3. The most air of a fan = where
   its full open curve (outlet = SP + suction) meets the system curve: 481.5 T/H PA, 294.3 T/H SA with the design bed (CALC).
   FAN POWER (vanes): a straight line in air power through the two vendor points, no flow (curve p151 PA 470 BKW, p145 SA 260 BKW:
   the old beta.308 read) and the spec point (PA 6,907 ACMM x 2,481 mmAq -> 3,341 BKW; SA 4,222 x 2,075 -> 1,698 BKW, D1-003 p147 /
   p141). ID (variable speed hydraulic coupling): the p157 curve (SP and BKW/3 at 1141 rpm, AN_FD.cid / bid) by the fan laws at the
   speed and the gas density (anIdFan); the coupling passes the same torque, so the motor gives fan power x 1193 / fan speed
   (ST-LO1756, unit.js anIdfN). The same curve holds the furnace pressure (anIdPf, unit.js draft).
   MOTORS, DESIGN-SRC TECO spec tables and Eff & PF vs load curves (Fan Instruction Manual p288-330, 6.6 kV): load share -> efficiency,
   power factor at 10 (beta.308 read) / 25 / 50 / 75 / 100 %; I = shaft kW / eff / (sqrt3 x 6.6 x PF); under 10 % the reactive current of
   the 10 % point stays (magnetizing).
   Checks at 150 MW (FIFA1071 354, FIFA1081 213, total air 592, ID fan 872 rpm; the HMI snapshot 7.PNG is a check only, not a target):
   PIFA1075 1,734 (snapshot 1,551), PIFA1085 1,437 (1,427), PIFG1141 -602 (-442 / -450), PIFG1151 25 (-7), PAF 221 A (253.6),
   SAF 117 A (134.0), IDF 259 A (199.6). All inside the alarm list limits (PT-FA1075 LL 1200 / HH 2300, PT-FG1141 H -390). */
const AN_FD = {
  pa: { Q: 387.62, E: 1092, L: 770, Lah: 130, S: -118, kW: 3700, P0: 470, Ps: 3341, As: (6907 / 60) * 2481 * 0.00980665 },
  sa: { Q: 236.95, E: 1016, L: 521, Lah: 131, S: -118, kW: 1850, P0: 260, Ps: 1698, As: (4222 / 60) * 2075 * 0.00980665 },
  ga: { A: 596, G: 732.73, top: -15, Lah: 405, Lao: 515, Li: 595, Lo: 25, rho: 879300 / 60 / 17621, T0: 150, n1: 1141, kW: 3300, n0: 350, nm: 1193, qd: 17.5 },
  /* ID fan D1-003 p157 at 1141 rpm, 150 C (YUA pixel read 2026-11-28, /mnt/project-files/aoi-id-fan-curve-2026-11-27.md): SP mmAq and
     BKW/3 vs ACMM; the other speeds are exact affinity scalings of this curve (Q ~ n, SP ~ n^2, power ~ n^3, checked on all 9 curves) */
  cid: [[0, 935], [1000, 956], [2000, 975], [3000, 988], [4000, 1000], [5000, 1007], [6000, 1011], [7000, 1015], [8000, 1019], [11000, 1019], [12000, 1025], [13000, 1030], [13500, 1033], [14000, 1029], [15000, 993], [16000, 944], [17000, 894], [17621, 862], [18000, 841], [19000, 787], [20000, 733], [21000, 680], [22000, 627], [23000, 570], [24000, 513], [25000, 457], [26000, 400], [26530, 373]],
  bid: [[0, 355], [2000, 462], [4000, 537], [6000, 608], [8000, 684], [10000, 765], [12000, 855], [14000, 951], [16000, 978], [17000, 983], [17621, 985], [20000, 987], [22000, 994], [24000, 975], [26000, 948], [26530, 940]],
  /* inlet damper PCDFG10561 (PICFG108A): butterfly loss coefficient vs closing angle from open (deg), Idelchik Diagram 9-17 (textbook);
     velocity pressure at the damper at the MCR gas qd = 17.5 mmH2O (NO-SOURCE: 20 m/s duct at 0.86 kg/m3; damper and duct size not
     in the docs searched). At 150 MW the damper is 99.1 % open (7.PNG): its loss there is under 1 mmH2O */
  zd: [[0, 0.24], [10, 0.52], [20, 1.54], [30, 3.91], [40, 10.8], [50, 32.6], [60, 118], [70, 751], [80, 5000], [90, 50000]],
  rho: 1.1225,
  /* SP mmAq at axis ACMM 0, 1000, ... (p151 PA to 17,000 then the curve end 17,450; p145 SA to 11,000 then the axis end 11,800) */
  cpa: [[0, 2880], [1000, 2920], [2000, 3020], [3000, 3100], [4000, 3140], [5000, 3190], [6000, 3200], [7000, 3170], [8000, 3140], [9000, 3060], [10000, 3000], [11000, 2940], [12000, 2820], [13000, 2730], [14000, 2510], [15000, 2350], [16000, 2140], [17000, 1910], [17450, 1800]],
  csa: [[0, 2210], [1000, 2290], [2000, 2350], [3000, 2380], [4000, 2390], [5000, 2370], [6000, 2300], [7000, 2200], [8000, 2090], [9000, 1970], [10000, 1700], [11000, 1520], [11800, 1380]],
  /* load share, efficiency, power factor */
  mot: {
    paf: { I: 373, t: [[0.1, 0.8, 0.475], [0.25, 0.929, 0.747], [0.5, 0.949, 0.86], [0.75, 0.955, 0.899], [1, 0.958, 0.905]] },
    saf: { I: 192, t: [[0.1, 0.8, 0.39], [0.25, 0.93, 0.653], [0.5, 0.952, 0.816], [0.75, 0.955, 0.864], [1, 0.956, 0.88]] },
    idf: { I: 350, t: [[0.1, 0.8, 0.31], [0.25, 0.922, 0.586], [0.5, 0.948, 0.771], [0.75, 0.957, 0.84], [1, 0.96, 0.86]] },
    fab: { kW: 480, I: 49.4, t: [[0.5, 0.942, 0.83], [0.75, 0.952, 0.87], [1, 0.955, 0.89]] } /* FA blower, see anFabEl */
  }
};
/* system: fan outlet pressure (mmH2O) at fan flow q (T/H), bed share b */
const anFdSys = (k, q, b) => {
  const s = AN_FD[k],
    r = Math.max(0, q) / s.Q;
  return s.E * Math.max(0, b) + s.L * r * r;
};
/* the full open curve: fan outlet pressure at fan flow q (T/H) */
const anFdCrv = (k, q) => {
  const s = AN_FD[k],
    r = Math.max(0, q) / s.Q;
  return anFabLin(AN_FD['c' + k], (Math.max(0, q) * 2000) / (60 * AN_FD.rho)) + s.S * r * r;
};
/* the most air of the fan (T/H): the curve meets the system */
const anFdCap = (k, b) => {
  const c = AN_FD['c' + k];
  let lo = 0,
    hi = (c[c.length - 1][0] * 60 * AN_FD.rho) / 2000;
  if (anFdCrv(k, hi) >= anFdSys(k, hi, b)) return hi;
  for (let i = 0; i < 30; i++) {
    const m = (lo + hi) / 2;
    if (anFdCrv(k, m) >= anFdSys(k, m, b)) lo = m;
    else hi = m;
  }
  return lo;
};
/* the motor at shaft kW p on its TECO curve (load share, efficiency, power factor): current I (A), electrical input P (kW) and Q (kvar),
   from the same numbers (Phase 11 YUI: P / Q go to the house load, port q.motor.AOI). Under the first point (10 %) the reactive current
   of that point stays (magnetizing) */
const anFdEl = (m, kW, p) => {
  const t = m.t,
    x = Math.max(0, p) / kW,
    V = Math.sqrt(3) * 6.6;
  if (x <= t[0][0]) {
    const ia = Math.max(0, p) / t[0][1] / V,
      ir = ((t[0][0] * kW) / t[0][1] / V) * Math.tan(Math.acos(t[0][2]));
    return { I: Math.hypot(ia, ir), P: V * ia, Q: V * ir };
  }
  let i = 1;
  while (i < t.length - 1 && x > t[i][0]) i++;
  const [a, e1, f1] = t[i - 1],
    [c, e2, f2] = t[i],
    w = (x - a) / (c - a),
    e = e1 + (e2 - e1) * w,
    f = Math.min(0.95, f1 + (f2 - f1) * w),
    P = p / e;
  return { I: P / (V * f), P, Q: P * Math.tan(Math.acos(f)) };
};
/* ID fan at speed n (rpm) and its inlet gas: m T/H, T C. Returns the fan rise sp (mmH2O, the curve by the fan laws and the gas density)
   and the fan shaft kW. Q1141 = the flow of the similar point on the 1141 rpm curve */
const anIdFan = (m, T, n) => {
  const G = AN_FD.ga,
    rho = (G.rho * (G.T0 + 273.15)) / ((isFinite(T) ? T : G.T0) + 273.15),
    q = (Math.max(0, m) * 1000) / 60 / rho,
    r = Math.max(G.n0, n) / G.n1,
    q1 = q / r,
    dr = rho / G.rho,
    end = AN_FD.cid[AN_FD.cid.length - 1];
  /* past the curve end the rise falls on the slope of the last two points to 0 */
  const sp1 = q1 <= end[0] ? anFabLin(AN_FD.cid, q1) : Math.max(0, end[1] - ((q1 - end[0]) * 57) / 1000);
  return { sp: sp1 * r * r * dr, kw: 3 * anFabLin(AN_FD.bid, q1) * r * r * r * dr, q };
};
/* furnace pressure (mmH2O) the ID fan holds at steady state: the stack discharge + the draft losses from the furnace top to the ID inlet
   (D2-003, square of the gas, a plugged air heater adds its DP) less the fan rise less the inlet damper loss. idf = running, n = speed,
   d = damper open % ; with the fan stopped the gas leaves through it with no rise */
const anIdPf = (m, T, idf, n, d, pl) => {
  const G = AN_FD.ga,
    r = Math.max(0, m) / G.G,
    los = (G.Lo + G.Li) * r * r + (pl || 0) * r * r;
  if (!idf) return los;
  const th = 90 * (1 - Math.max(0, Math.min(100, isFinite(d) ? d : 100)) / 100);
  return los - anIdFan(m, T, n).sp + anFabLin(AN_FD.zd, th) * G.qd * r * r;
};
/* PAF / SAF shaft kW: air power = volume x pressure rise (outlet - suction) */
const anFdKw = (k, q, pOut) => {
  const s = AN_FD[k],
    r = Math.max(0, q) / s.Q,
    air = ((Math.max(0, q) * 1000) / 3600 / AN_FD.rho) * Math.max(0, pOut - s.S * r * r) * 0.00980665;
  return s.P0 + ((s.Ps - s.P0) * air) / s.As;
};
/* speed (F37): a DITL sheet by its name, kept: these two run many times a step and made a new list of all sheets each time */
const fnShC = new Map();
let fnShK = -1;
function fnSh(n) {
  const k = S.sheets.length * 1000 + ((WORLD.inst && WORLD.inst.length) || 0);
  if (k !== fnShK) {
    fnShK = k;
    fnShC.clear();
  }
  let s = fnShC.get(n);
  if (s === undefined) {
    s = S.sheets.concat(WORLD.inst || []).find(x => x.name.endsWith(n)) || null;
    fnShC.set(n, s);
  }
  return s;
}
function fnRow(n, r) {
  try {
    const s = fnSh(n);
    return s && typeof DUI !== 'undefined' ? DUI.rowVal(s, r) : null;
  } catch (e) {
    return null;
  }
}
function fnOut(n, r) {
  try {
    const s = fnSh(n);
    if (!s) return null;
    /* F-AN (Jennie live run 2026-11-18): the plant reads the output the one world scanned (WORLD.out = ON output rows), not a new solve
       of the sheet. At x60 a world frame runs many 0.5 s scans between two plant steps: a solve from the plant missed the 774 START
       pulse (TR385) that set the run FF, so the BA21 fan never ran and TR386 (10 s) gave SYSTEM TRIP on DITL-777. */
    const W = typeof WORLD !== 'undefined' ? WORLD : null,
      o = W && W.on && W.out && W.out[s.name];
    if (o && s.nl && s.nl.outs.some(x => x.row === r)) return (o instanceof Set ? o.has(r) : o.includes(r)) ? 1 : 0;
    return typeof DUI !== 'undefined' ? DUI.outVal(s, r) : null;
  } catch (e) {
    return null;
  }
}
const fnRun = n => (typeof anDitlRun === 'function' ? anDitlRun(n) === 1 : false);
function anFanStart(U) {
  const F = (U.fn = { ai: {} }),
    A = F.ai;
  A.pa = doAIs('ABC-007', 'AI0160');
  const T = (AN.sheets.find(x => x.name === 'ABC-014') || {}).S;
  F.fa = T && AN.hmiCtrls ? (AN.hmiCtrls(T) || []).find(q => q.tag === 'FICFA1055A') : null;
  F.mvA = doOut('ABC-014', 'FICFA1055A');
  F.mvB = doOut('ABC-014', 'FICFA1055B');
  F.faAI = doAIs('ABC-006', 'AI0545');
  F.qpa = doAIs('ABC-006', 'AI0484');
  F.qsa = doAIs('ABC-006', 'AI0513');
  for (const l of [A.pa]) for (const [S2, b] of l) U.own.add(S2.rt.st[b.id]);
  /* a field trip of the PAF / SAF (protection relay) stops their air: the running state of the motor drawing too (unit.js U.mul .drw,
     as the BFWP), not only the running bit M.3302 / M.3303 of ABC-007 */
  if (U.mul && U.mul[1] && U.mul[1].run.length === 1) U.mul[1].drw = ['DITL-26A'];
  if (U.mul && U.mul[2] && U.mul[2].run.length === 1) U.mul[2].drw = ['DITL-27A'];
  U.fnZ = {};
}
/* 3.2.4 (JENNIE): air heater plugged on the gas side (trainer fault aph.plug, world.js). FHI T6 p7 / P5S2: fouling shows as a rising
   draft loss; the APH is blown every 4 - 8 h (T9 p11) and washed when plugged. The gas side loss of the APH at MCR is not readable
   (APH s18 table scrambled): dp 113 mmH2O (beta.310, was 110 NO-SOURCE: the air heater gas DP transmitter DPT-FG1052-5,
   DPIFG10525 STN AI0768, reads 113.0 mmH2O at 150 MW on the HMI snapshot, hmi-op.js; the same value the gas path page draws), inside the -442 / -450 mmH2O ID fan suction of the fan manual (AN_FN.ga.Pi).
   The plugging adds to that loss: +1 x dp every 30 min (NO-SOURCE trainer rate), up to +3 x. The same gas then needs a deeper ID
   fan suction (U.fnGi, the fan current follows), and the fan at the same opening moves less gas: the share of the fan command that
   reaches the furnace pressure is the square root of the old over the new system loss (fan law at one speed, unit.js pr.uf).
   U.aphPl = the added loss in units of dp; clearing the fault (water wash) puts it back to 0 */
const AN_APL = { dp: 110 /* D2-003 rotary air heater gas loss at MCR */, t: 1800, max: 3 };
/* 3.2.4 (JENNIE, list item: air heater leak): the radial / axial seals of the tri-sector air heater wear and pass more air to the gas side
   (trainer fault aph.leak, world.js). L20 Howden APH OMM sheet 16, duty 1 (performance coal): PA to gas 33,993 kg/h, SA to gas 19,036
   kg/h, total air to gas 7.82 % of the gas inlet. Check of the mixing rule: the same sheet gives the gas out 132.8 C undiluted and
   126.2 C diluted with the air in at 46 C: (132.8 + 0.0782 x 46) / 1.0782 = 126.5 C (CALC). The fault adds +1 x the design leak every 30 min (NO-SOURCE trainer
   rate) up to +2 x. The air flow transmitters are at the fan inlets (FT-FA1071 / FA1081, alarm list FT sheet), so they read the leak
   too: the furnace gets less air than they read, the O2 at the air heater gas inlet falls, the O2 trim raises the fans, the ID fan
   takes the leak on top of the furnace gas and the gas leaving the air heater is cooled by the cold air (anAphStep).
   Phase 11 AOI 2026-11-28: the DESIGN leak now always flows (it was taken as "inside the fan flows", which left the furnace with all
   the fan air). Each side leaks its design share at its design fan flow, and in proportion to its fan flow (seal gap fixed, orifice
   law: leak ~ sqrt(dp), and the air side dp ~ Q^2 of its system, so leak ~ Q; DERIVED). Design fan flow = FHI P2S7 Fig 12 furnace air
   at 100 % MCR + the OMM leak: PA 351.8 + 34.0 = 385.8 T/H (the FHI mass balance K1AU4-MB-052 prints PAF outlet 388 with the 33 t/h
   APH loss), SA 216.0 + 19.0 = 235.0 T/H. anAphLeak gives [PA, SA] leak in T/H.
   U.aphLk = the added leak in units of the design leak; clearing the fault (seals set again) puts it back to 0 */
const AN_APK = {
  pa: 33.993 /* T/H, DESIGN-SRC: L20 Howden APH OMM sheet 16 */,
  sa: 19.036 /* T/H, DESIGN-SRC: L20 Howden APH OMM sheet 16 */,
  qPa: 351.8 + 33.993 /* T/H PAF at 100 % MCR, DESIGN-SRC: FHI P2S7 Fig 12 + OMM sheet 16 */,
  qSa: 216.0 + 19.036 /* T/H SAF at 100 % MCR, DESIGN-SRC: FHI P2S7 Fig 12 + OMM sheet 16 */,
  t: 1800,
  max: 2
};
/* AN.aphLeakShare (0 ~ 1, default 1): a settle / line-up input, not a model constant. The 150 MW settle (tools/steady150) ramps the
   design leak in over its run while the O2 trim raises the SA; the plant model itself always runs at 1 */
const anAphLeak = (U, v) => {
  const sh = typeof AN !== 'undefined' && isFinite(AN.aphLeakShare) ? Math.max(0, Math.min(1, AN.aphLeakShare)) : 1,
    f = sh + (U.aphLk > 0 ? U.aphLk : 0);
  return [Math.min(v[0], (f * AN_APK.pa * Math.max(0, v[0])) / AN_APK.qPa), Math.min(v[1], (f * AN_APK.sa * Math.max(0, v[1])) / AN_APK.qSa)];
};
/* 3.2.4 (JENNIE, list item: stack dust): THE ELECTROSTATIC PRECIPITATOR. Dust in: the fly ash of the bed balance (unit.js U.flyA, coal ash
   6.82 % + the limestone solids, the 80 % that does not go to the bed drain) in the flue gas, Nm3/h = gas T/H / 1.338 kg/Nm3 (CALC:
   681 T/H of gas, AN_GAS.gm, at 509,000 Nm3/h wet, FHI Tab 3, boiler.js anSOx). Collection: the Deutsch equation (textbook),
   eta = 1 - exp(-wA / Q), wA from the ESP design: inlet 31,000 mg/Nm3 at 602,000 Nm3/h (L19-1 design basis) to 50 mg/Nm3 (FHI P2S4
   p2-4-14 guarantee): wA = 602,000 x ln(31,000 / 50) = 3.87e6 Nm3/h (CALC). Less gas = longer in the fields = cleaner. Check: at 150 MW
   the model gives a few mg/Nm3, the plant read 2.9 mg/m3 (7.PNG). The 6 % O2 dry correction of the guarantee is not applied (the
   transmitter AT-FG1057-5 reads the gas as it is). U.dustIn mg/Nm3 at the ESP inlet, U.espEta the collection share */
const AN_ESP = { wA: 602000 * Math.log(31000 / 50), rhoN: 1.338 };
function anFanStep(U, dt) {
  {
    const W = typeof window !== 'undefined' ? window.WORLD : null,
      on = !!(W && W.ft && W.ft.has('aph.plug'));
    U.aphPl = on ? Math.min(AN_APL.max, (U.aphPl > 0 ? U.aphPl : 0) + (dt > 0 ? dt : 0) / AN_APL.t) : 0;
    const lk = !!(W && W.ft && W.ft.has('aph.leak'));
    U.aphLk = lk ? Math.min(AN_APK.max, (U.aphLk > 0 ? U.aphLk : 0) + (dt > 0 ? dt : 0) / AN_APK.t) : 0;
  }
  const F = U.fn,
    K = AN_FN;
  if (!F) return;
  const z = U.fnZ || (U.fnZ = {}),
    lag = (k, x, tau) => (z[k] = isFinite(z[k]) ? z[k] + ((x - z[k]) * Math.min(dt, tau)) / tau : x),
    lagI = (k, x, tau) => (x > 0 ? lag(k, x, tau) : (z[k] = 0)) /* Mina F15: a stopped motor carries no current */,
    val = l => anUnitVal(l || []);
  /* FA blowers: running, outlet SOV not closed, inlet damper */
  const fr = K.run.fa.map(fnRun),
    sov = K.run.sov.map(n => fnOut(n, 25) === 1 || fnRow(n, 8) === 0),
    /* 3.2.3 SOHEE: the "TO SILENCE" SOV XV-FA1055-A2 / B2 (DITL-28C output row 2 "TO SILENCE SOV OPEN COMMAND", 0-based 1):
       open, the blower blows to the atmosphere through its silencer (PD-054), not into the header. Read by its command: the limits
       of instance #B do not follow the command (FANS_PLANT_MODEL.md finding). Its AUTO logic opens it while the blower is stopped
       (unloaded start; 150 MW: A closed, B stopped with it open). The share of the flow that still reaches the header with both
       SOVs open is NO-SOURCE: the open vent takes it all (the header is at about 3300 mmH2O, the silencer at the atmosphere) */
    silC = K.run.sov.map(n => fnOut(n, 1) === 1),
    /* 3.2.3-beta.180 (SOHEE): the two SOVs are single acting, NORMALLY OPEN (Continental P&ID 500-0ds REV03: XV-FA1055A2/B2 "ON/OFF
       Valve PNEUMATIC DN150 - Single acting" NO, XV-FA1055A3/B3 "18'' - Single acting" NO; the DITL-28C coils are inverted): as the
       instrument air goes they spring OPEN (unit.js AN_AV.sv, anAvSv). The open share of each = its position / 100: the outlet lets
       that share through, the silencer vents that share (linear, NO-SOURCE) */
    avs = (t, c) => {
      const x = typeof anAvSv === 'function' ? anAvSv(t, c, c ? 100 : 0) : null;
      return x == null ? (c ? 1 : 0) : Math.max(0, Math.min(1, x / 100));
    },
    fs = silC.map(c => avs('FA1055-A2', c)),
    fo = sov.map(c => avs('FA1055-A3', c)),
    sil = fs.map(f => f >= 0.5),
    za = doX(F.mvA, 0.428) * 100,
    zb = doX(F.mvB, 0.249) * 100,
    g0 = [fr[0] ? za * fo[0] : 0, fr[1] ? zb * fo[1] : 0],
    g = g0.map((x, i) => x * (1 - fs[i]));
  U.fnSil = sil;
  /* the FA flow is this model's: the target of the loop model of FICFA1055A (plant.js: y = smul * y + (1 - smul) * sbase, its own lag),
     the flow of the snapshot at the damper of the snapshot (9.png 26.3 T/H at 42.8 %), linear in the opening (NO-SOURCE) */
  if (F.fa && F.fa.b && F.fa.b.proc) {
    F.fa.b.proc.smul = 0;
    F.fa.b.proc.sbase = (K.fa.Q0 * (g[0] + g[1])) / K.fa.z0;
  }
  /* 3.2.3 SOHEE: the source rule of the loop (source.js R.FICFA1055A) set smul / sbase again at each scan (mul = a blower running),
     so this target was not used: the outlet and silencer SOVs and the damper of the blower that runs did not reach the FA flow.
     The rule now reads it */
  U.fnFaT = (K.fa.Q0 * (g[0] + g[1])) / K.fa.z0;
  U.fnG = g;
  const qfa = Math.max(0, val(F.faAI)) || 0,
    pfa = K.fa.P0[0] * Math.pow(qfa / K.fa.Q0, 2);
  U.fnFaP = K.fa.P0.map(p => lag('fp' + p, (p / K.fa.P0[0]) * pfa, 2));
  U.fnFaQ = qfa;
  /* a blower blowing through its open silencer: its current as if its damper flow went into the header (the blower curve to the
     atmosphere is NO-SOURCE; a centrifugal blower takes more flow there, not less, so no current drop is made up) */
  /* beta.324 (JENNIE, user finding "FA blower A trips on low current when running with B"): the flow of each blower was the
     FIFA1055 reading split by the damper shares. FIFA1055 follows the loop with its own lag (plant.js, air flow up to 5 s), so in
     the seconds after B started, B already took half of the share while the reading had not risen: blower A was given half of the
     old flow (9 T/H at 25 % / 24.9 %), its current fell to 22 A, under the L.L. 24.6 A, and DITL-28A row 17 stopped it, although
     its damper never moved. A blower's flow is set by its own damper and its own curve: each blower now follows its own target
     (snapshot flow at the snapshot damper, linear as the loop target above) with the 5 s of an air flow; the blower that just
     started rises from 0, the running one keeps its flow */
  const qi = g.map((x, i) =>
    lag('fq' + i, fr[i] ? (K.fa.Q0 * (sil[i] && g0[i] > 0 ? g0[i] : x)) / K.fa.z0 : 0, 5)
  );
  U.fnI = U.fnI || [0, 0, 0, 0, 0];
  /* S160-2 (Mina beta.160: FA blower B STOPPED while it ran on its own at the 25 % line-up damper, then started again): the air power
     was its flow x the HEADER pressure (P ~ Q^2), so one blower at about 14 T/H drew 21.5 A, under the L.L. 24.6 A of DITL-28B row 12,
     and the drawing tripped it (DITL-28A #B row 17 M.2549 FAB B CURRENT L.L.). The FA blower is a constant speed multistage centrifugal
     blower with an inlet damper (equipment list K1AU3-L1-0-002 R0 item 46.1: Continental 500.04, 1 x A211 + 3 x A202, 3,570 rpm,
     BHP 440.4 kW, motor 480 kW 2P; FCV-FA1055-A1 / B1): throttled at its inlet it still makes the head of its curve, the damper takes
     the rest, so its air power follows its own flow at the head of the snapshot (9.png 37.3 A at 26.3 T/H). (beta.324: the blower
     curve was found, K1AU3-D1-0-004 p.7; the current is now anFabI.) The drawing itself bounds it: a running blower at the PR-OPE-5002 line-up damper (23 ~ 27 %,
     ABC-014 M.3115 / M.3116) is not tripped by its own current L.L. (now about 28 A at 14 T/H) */
  /* 3.2.3-beta.183 (SOHEE): the blower on its open silencer follows the same rule (own flow at the head of the snapshot). The cube of
     the flow ratio (fan law) was for a change of speed, not of a damper at constant speed: after instrument air loss the inlet damper
     springs open (100 %, P&ID 500-0ds) and the cube gave 278 A, over the 0 ~ 98 A range of IT-F1055A (I/O list); now about 65 A */
  /* beta.324: each blower on its own curve (anFabI): its flow qi into the header pressure, or into the open silencer (about 0) */
  const p2 = i => (sil[i] ? 0 : pfa);
  U.fnIa = lagI('ia', anFabI(fr[0], qi[0], p2(0)), 2);
  U.fnIb = lagI('ib', anFabI(fr[1], qi[1], p2(1)), 2);
  /* Phase 11 (YUI): the electrical input of the running 6.6 kV motors of this part, for the house load (port q.motor.AOI, kW / kvar).
     The FA blowers from their machine kW without the snapshot scale of anFabI (AOI 2026-11-28) */
  const el = [0, 1].filter(i => fr[i]).map(i => anFabEl(anFabKw(qi[i] * 1000, p2(i))));
  /* PAF / SAF: flow of the loop model (fan inlet transmitters), outlet pressure on the D2-003 system curve (AN_FD), current from the
     shaft power on the TECO motor curve */
  const qpa = Math.max(0, val(F.qpa)) || 0,
    qsa = Math.max(0, val(F.qsa)) || 0,
    bk = isFinite(U.bedK) ? U.bedK : 1,
    paf = fnRun(K.run.paf),
    saf = fnRun(K.run.saf),
    ppa = paf ? anFdSys('pa', qpa, bk) : 0,
    psa = saf ? anFdSys('sa', qsa, bk) : 0;
  U.fnPaP = lag('pp', ppa, 2);
  U.fnSaP = lag('sp', psa, 2);
  if (F.ai.pa.length) anUnitWrite(F.ai.pa, U.fnPaP);
  const ePa = paf ? anFdEl(AN_FD.mot.paf, AN_FD.pa.kW, anFdKw('pa', qpa, ppa)) : null,
    eSa = saf ? anFdEl(AN_FD.mot.saf, AN_FD.sa.kW, anFdKw('sa', qsa, psa)) : null;
  U.fnPafI = lagI('ip', ePa ? ePa.I : 0, 2);
  U.fnSafI = lagI('is', eSa ? eSa.I : 0, 2);
  if (ePa) el.push(ePa);
  if (eSa) el.push(eSa);
  /* IDF: the flue gas goes with the total air (unit.js U.taf) over the design total air; the draft losses with its square (AN_FD.ga) */
  const G = AN_FD.ga,
    taf = U.taf && U.tafS ? U.taf.reduce((a, n) => a + (+U.tafS.rt.v[n] || 0), 0) : 0,
    rg = Math.pow(taf / G.A, 2),
    idf = fnRun(K.run.idf),
    pl = AN_APL.dp * (U.aphPl || 0);
  U.fnGi = [0, 1].map(i => lag('gi' + i, idf ? G.top - G.Li * rg - pl : 0, 2));
  U.fnGo = lag('go', idf ? G.Lo * rg : 0, 2);
  /* audit 2026-11-21 B1 (HX page values with no number): the gas path pressures no sheet reads, now on the D2-003 loss build-up:
     air heater gas inlet PT-FG1121 (-15 - 405), air heater gas outlet PT-FG1134 (-15 - 515), air heater gas DP DPT-FG1052-5 (110), with
     the square of the gas; a plugged air heater (AN_APL) adds its DP across the air heater. PA after the air heater PT-FA1078 = the
     PAF outlet less the duct 30 and air heater 100 (D2-003) */
  Object.assign(U.tt || (U.tt = {}), {
    'PT-FG1121': idf ? Math.round(G.top - G.Lah * rg) : 0,
    'PT-FG1134': idf ? Math.round(G.top - G.Lao * rg - pl) : 0,
    'DPT-FG1052-5': idf ? Math.round((G.Lao - G.Lah) * rg + pl) : 0,
    'PT-FA1078': Math.round(Math.max(0, U.fnPaP - (paf ? AN_FD.pa.Lah * Math.pow(qpa / AN_FD.pa.Q, 2) : 0)))
  });
  /* ID fan: the shaft power of the p157 curve at the speed of the hydraulic coupling and the gas of the ID inlet (anIdFan) */
  const n = idf && U.idfV && typeof anIdfN === 'function' ? anIdfN(+U.idfV.S.rt.v[U.idfV.n] || 0) : G.n0,
    pf = anIdFan((taf * G.G) / G.A, U.aphGo, n).kw;
  /* the ID motor shaft = the fan kW x rated / coupling output speed (the coupling passes the torque, AOI) */
  const eId = idf ? anFdEl(AN_FD.mot.idf, G.kW, (pf * G.nm) / Math.max(G.n0, n)) : null;
  U.fnIdfI = lagI('ii', eId ? eId.I : 0, 2);
  if (eId) el.push(eId);
  U.fnI = [U.fnPafI, U.fnSafI, U.fnIdfI, U.fnIa, U.fnIb];
  if (typeof anPortSet === 'function') anPortSet(U, 'q.motor.AOI', { P: el.reduce((a, x) => a + x.P, 0), Q: el.reduce((a, x) => a + x.Q, 0) });
}
/* AIR PREHEATER AND FLUE GAS (FHI Tab 3, Figures 7, 12, 13; docs/versions/v3.2.1/GAS_PATH.md).
   (afs, the stoichiometric air of the coal, is now computed from Tab 2 in cfb.js AN_FUEL with the flue gas mole balance, Phase 11)
   ePA, eSA  how close each air comes to the gas entering: (285.8 - 45) / (322 - 45), (301.6 - 39) / (322 - 39), Tab 3. Held at
             all loads: the change with flow is NO-SOURCE.
   kCp, gm   gas side of the same heat: 354 x 240.8 + 218 x 262.6 T/H x C of air takes the gas 681 T/H (air 598 + coal less ash) from
             322 to 135 C, so air cp / gas cp 0.894; gm = gas per T of air.
   gi        gas entering at MCR; below it the duties of the air heater manual L20, anAphIn.
   eco       colder feedwater takes more from the gas: the economizer cools the gas 43 C of the 120 C between gas in (365, snapshot
             TIFG1110 / 1113) and feedwater 245.4 (Tab 3), so gas to the air heater falls 0.36 C per C of feedwater. */
const AN_GAS = {
  qPa: 354 /* Tab 3 PA, the flow of dtP */,
  qSa: 218 /* Tab 3 SA, the flow of dtS */,
  gi: 322,
  ePA: 240.8 / 277,
  eSA: 262.6 / 283,
  kCp: 0.894,
  gm: 681 / 598,
  eco: 43 / 120,
  dtP: 10,
  dtS: 4,
  tauG: 60,
  tauR: 120
};
const anAphClamp = (x, a, b) => Math.max(a, Math.min(b, x));
/* gas entering the air preheater: k = bed rise over its MCR rise, g = gas flow over the MCR flow */
/* gas in by furnace rise, L20 air heater duties 322 / 285 / 272 C at 100 / 60 / 40 %, at the furnace rise of Fig 8 (1, 0.895, 0.778); to ambient below */
const anAphIn = (amb, k, g, fwDrop) => {
  const t =
    k >= 0.895
      ? 285 + ((322 - 285) * (k - 0.895)) / 0.105
      : k >= 0.778
        ? 272 + ((285 - 272) * (k - 0.778)) / 0.117
        : amb + ((272 - amb) * Math.max(0, k)) / 0.778;
  return Math.max(amb, t - AN_GAS.eco * Math.max(0, fwDrop || 0));
};
/* air leaving the fans, with the square of the flow: Tab 3 ambient 35, PA 45, SA 39 C. kind 'p' or 's' */
const anAphAir = (amb, q, kind) => amb + (kind === 'p' ? AN_GAS.dtP : AN_GAS.dtS) * anAphClamp(q, 0, 1.3) ** 2;
/* gas leaving: the gas gives what the air took */
function anAphOut(gi, fpa, tpa, tpa2, fsa, tsa, tsa2, ffa) {
  const air = fpa + fsa + ffa,
    q = fpa * Math.max(0, tpa2 - tpa) + fsa * Math.max(0, tsa2 - tsa);
  return air > 1 ? gi - (AN_GAS.kCp * q) / (air * AN_GAS.gm) : gi;
}
function anAphStep(U, dt) {
  if (!U.aphL) return;
  const K = AN_GAS,
    z = U.fnZ,
    amb = U.Tamb,
    v = U.tafS && U.taf.length === 3 ? U.taf.map(n => Math.max(0, +U.tafS.rt.v[n] || 0)) : [0, 0, 0],
    k = anAphClamp((U.Tb - amb) / Math.max(1, U.Tb0 - amb), 0, 1.3),
    g = fnRun(AN_FN.run.idf) ? anAphClamp((v[0] + v[1] + v[2]) / 594, 0, 1.4) : 0,
    /* 3.2.3-beta.258: the gas that leaves the No.1 economizer of the heat transfer chain (hx.js); the curve anAphIn only without it */
    hxG = U.hxO && isFinite(U.hxO.gEo) ? U.hxO.gEo : NaN,
    gi = isFinite(hxG) ? hxG : anAphIn(amb, k, g, U.fwDrop),
    tpa = anAphAir(amb, fnRun(AN_FN.run.paf) ? v[0] / AN_GAS.qPa : 0, 'p'),
    tsa = anAphAir(amb, fnRun(AN_FN.run.saf) ? v[1] / AN_GAS.qSa : 0, 's');
  /* the chain has its own metal lag: no second lag on it */
  z.gi = isFinite(hxG) || !isFinite(z.gi) ? gi : z.gi + ((gi - z.gi) * Math.min(dt, K.tauG)) / K.tauG;
  /* the rotor carries the heat across: stopped, the air stops heating as the metal cools */
  const r = fnRun('DITL-43') ? 1 : 0;
  z.rot = isFinite(z.rot) ? z.rot + ((r - z.rot) * Math.min(dt, K.tauR)) / K.tauR : r;
  const pa = tpa + K.ePA * z.rot * Math.max(0, z.gi - tpa),
    sa = tsa + K.eSA * z.rot * Math.max(0, z.gi - tsa);
  U.aphGi = z.gi;
  /* hot PA / SA into the furnace, read by the bed heat balance of unit.js (anUnitStep0, Cold path) */
  U.aphPa = pa;
  U.aphSa = sa;
  {
    /* the seal leak (AN_APK, design + fault): it bypasses the heating and joins the gas at the air inlet temperature (OMM sheet 16 dilution) */
    const [lp, ls] = anAphLeak(U, v),
      go = anAphOut(z.gi, v[0] - lp, tpa, pa, v[1] - ls, tsa, sa, v[2]),
      gg = (v[0] - lp + v[1] - ls + v[2]) * K.gm;
    U.aphGo = lp + ls > 0.01 && gg > 1 ? (gg * go + lp * tpa + ls * tsa) / (gg + lp + ls) : go;
    /* the ESP (AN_ESP): all the air ends in the flue gas, the leak too */
    const qN = ((v[0] + v[1] + v[2]) * K.gm * 1000) / AN_ESP.rhoN;
    U.dustIn = qN > 1000 ? ((U.flyA || 0) * 1e9) / qN : 0;
    U.espEta = qN > 1000 ? 1 - Math.exp(-AN_ESP.wA / qN) : 1;
    /* audit 2026-11-21 B1: the transmitters of the air and gas path that no sheet reads (AN.unit.tt, the HX pages).
       TT-FA1073 / 1074, TT-FA1083 / 1084  PAF / SAF outlet air = tpa / tsa above (FHI Tab 3: ambient 35, PA 45, SA 39 C at MCR).
       AT-FG1131  O2 after the air heater: the furnace gas (U.o2v) with the seal leak air (lp + ls, 20.9 %) mixed in by mass.
       AT-FG1057-4  stack O2 = the same gas (no air enters after the air heater in the model).
       AT-FG1057-2  NOx (AN_NOX): the FHI guarantee, 180 ppm dry at 6 % O2 on the design coal, times the two correction factors of the
                  same document (FHI Performance Test Procedure K1AU3-R3-0-001 Rev 2, section 3.6, p15-16): Ft for the combustion
                  (bed) temperature U.Tb and Fea for the excess air of the furnace gas, EA = O2 / (20.9 - O2) (the model O2 is
                  21 x (1 - stoichiometric air / total air), AN_SOX note), both 1.00 at the design point 850 C / 20 % EA. The
                  printed curve points are read in AN_NOX.ft / fea; outside the printed span the end value is held. The analyzer reads
                  the stack gas: ppm = NOx at 6 % x (20.9 - stack O2) / (20.9 - 6) (the reference formula of the same section). Only
                  the coal makes NOx in the model: times the coal share of the fuel burnt (as the SOx); no coal burning = 0.
       AT-FG1057-3  CO: the model burns the fuel fully while there is excess air, so 0. Short of air (U.airR = air needed / air
                  given above 1, unit.js) the missing O2 share of the gas is 21 x (airR - 1) %; the carbon that finds no O2 for CO2
                  burns to CO (C + 1/2 O2), half the O2 of CO2: CO = 2 x that share, 2 x 21 x (airR - 1) x 10,000 ppm.
       AT-FG1057-5  dust = ESP inlet x (1 - Deutsch collection), the top of the transmitter 100 mg/m3 (I/O list AI0464).
       AT-FG1057-6  opacity by Beer-Lambert from the dust (the Rule 0 tag is on the code line: b 12.5 % at 2.9 mg/m3 is a plant screen value; the fly
                  ash particle size that gives b is not in the design documents).
       FT-FG1057-7  stack gas velocity: the actual volume flow over the stack area, qN x T / T0 (the Rule 0 tag is on the code line: the 21.5 m/s at
                  509,000 Nm3/h and 148 C is a plant screen value; the stack inner diameter is needed). */
    const o2f = isFinite(U.o2v) ? Math.max(0, Math.min(20.9, U.o2v)) : 20.9,
      lk = lp + ls,
      o2a = gg > 1 ? (gg * o2f + lk * 20.9) / (gg + lk) : 20.9,
      dust = Math.min(100, (U.dustIn || 0) * (1 - (isFinite(U.espEta) ? U.espEta : 1))),
      Tst = isFinite(U.idfGo) ? U.idfGo : U.aphGo,
      r1 = x => (isFinite(x) ? Math.round(10 * x) / 10 : null);
    Object.assign(U.tt || (U.tt = {}), {
      'TT-FA1073': r1(tpa),
      'TT-FA1074': r1(tpa),
      'TT-FA1083': r1(tsa),
      'TT-FA1084': r1(tsa),
      'AT-FG1131': r1(o2a),
      'AT-FG1057-4': r1(o2a),
      'AT-FG1057-2': anNox(U, o2f, o2a, gg),
      'AT-FG1057-3': gg > 1 && U.airR > 1 ? Math.round(2e4 * 21 * (U.airR - 1)) : 0,
      'AT-FG1057-5': r1(dust),
      'AT-FG1057-6': r1(100 * (1 - Math.exp((Math.log(1 - 0.125) / 2.9) * dust))) /* RULE 0 VIOLATION, b from a plant screen: no fly-ash particle size in the docs */,
      'FT-FG1057-7': r1(qN > 1000 ? (21.5 * (qN / 509000) * (Tst + 273.15)) / (148 + 273.15) : 0) /* RULE 0 VIOLATION, stack area from a plant screen: no stack inner diameter in the docs */
    });
  }
  /* 3.2.3-beta.212 (live Cold sweep F16: TT-FG1110 / 1113, TT-FG1124 / 1125, TT-FG1132 / 1133, TT-FG1152 '-----'): no sheet of the logic
     reads these transmitters, the page now reads the gas path here.
     U.ecoGo  gas leaving the No.2 economizer (TT-FG1110 R / 1113 S, ahead of the No.1 economizer): the No.1 economizer takes eco = 43 / 120
              of the gap between this gas and the feedwater it heats (AN_GAS.eco, Tab 3), so the gas ahead of it is
              (gas to the air heater - eco x feedwater) / (1 - eco); the feedwater = the No.2 HP heater outlet U.hpT2 (unit.js anHpStep).
              MCR: (322 - 0.358 x 245.4) / 0.642 = 365 C. Never under the gas leaving.
     U.idfGo  ID fan outlet to the stack (TT-FG1152): the gas leaving the air heater plus the heat of the fan, dT = dp / (rho cp eta),
              dp = the fan pressure rise of the fan model (U.fnGo - U.fnGi, mmH2O), flue gas rho 0.85 kg/m3 at about 140 C and
              cp 1.05 kJ/kg K (Tab 3 gas), eta 0.87 (beta.310, was 0.8 NO-SOURCE: ID fan specification sheet RF2-0582-DOC-6-0 sheet 2,
              K1AU3-D1-0-003 R0 (PC only): design 17,621 m3/min at 150 C, 858 mmH2O, TE / SE 87 / 84 %; the total efficiency, since all
              the shaft work that is not pressure ends up as heat in the gas): about 9 C at
              MCR (the precipitator losses are not modelled). */
  {
    const tf = isFinite(U.hpT2) ? U.hpT2 : amb;
    U.ecoGo =
      U.hxO && isFinite(U.hxO.gRo) && isFinite(U.hxO.gSo)
        ? (U.hxO.gRo + U.hxO.gSo) / 2 /* beta.258: the chain (hx.js), gas leaving the No.2 economizer */
        : Math.max(z.gi, (z.gi - K.eco * tf) / (1 - K.eco));
    const gi = Array.isArray(U.fnGi) ? (U.fnGi[0] + U.fnGi[1]) / 2 : 0,
      dp = Math.max(0, (isFinite(U.fnGo) ? U.fnGo : 0) - (isFinite(gi) ? gi : 0));
    U.idfGo = U.aphGo + (dp * 9.80665) / (0.85 * 1050 * 0.87);
  }
  anUnitWrite(U.aphL.pa, pa);
  anUnitWrite(U.aphL.sa, sa);
}
/* ===== LIMESTONE INJECTION (019 LIMESTONE INJECTION SYSTEM; docs/versions/v3.2.1/LIMESTONE_SAND_PLANT_MODEL.md) =====
   The field devices of the Rotofeed (HWA JANN / Clyde Bergemann, O&M L5-3 "Limestone", on the PC: document-references/
   o&m-package-phase-1/L5 Fly Ash_Sand_Limestone/L5-3 Limestone.pdf) under the DITL logic of the drawing (limestone_logic.xls,
   DITL-LS10 ~ LS240, station 104). The logic is not changed: the model only answers its solenoid commands with the switches of
   the field (IO list "Station 104"):
     dome valves  vent XV-LM1814A (O.0249 -> ZSO / ZSC I.017B / I.017C), lock vessel inlet XV-LM1812 (O.0243 -> I.0177 / I.0178,
                  seal PS-LM1812 I.016D), dispensing vessel inlet XV-LM1815 (O.0244 -> I.0179 / I.017A, seal PS-LM1815 I.016E),
                  balance XV-LM1814B (O.024A -> I.017D / I.017E). O&M 2.10: a dome valve is "closed and sealed" when its seal
                  pressure is > 5 bar (the inflating seal is fed by the control air: the plant air header of the unit model, paPU);
                  open = seal deflated (< 5 bar). Stroke 2 s, seal inflation 1 s: NO-SOURCE (O&M 2.8 only gives the 5 s fault timer:
                  the valve must reach its end within it).
     equalising   XV-LM1814C (O.0248): conveying air into the lock vessel (regulator PCV11 3.5 barg, O&M 3.2.5).
     conveying    XV-LM1814D ~ F (O.0247, IO list "conveying air valve open solenoid"); isolating valves XV-LM1811A ~ H (O.0252 ~
                  O.0259 -> I.0200 ~ I.020F), stroke 3 s NO-SOURCE.
     vessels      lock vessel 0.7 m3, dispensing vessel 1.4 m3 (O&M L5-3 section 1), bulk density 1280 kg/m3 (for volume) ->
                  896 / 1792 kg. LSH-LM1812 (I.0168) covered at 90 % of the lock vessel, LSL-LM1815 (I.0169 = 1 uncovered: DITL-LS20
                  OUT3 = enabled AND I.0169) at 30 % of the dispensing vessel: NO-SOURCE (the probe heights are not in the O&M).
                  3.2.3-beta.58 (user: no ASSUMED): silo to lock vessel 30 s = the SHORT FILL TIMER (O&M L5-3 2.3.2 / 2.3.3 / 2.8, PLC
                  limestone_logic.xls sheet 40 "30s"; the filling ends at the timer or at LSH-LM1812 covered, whichever first), lock to
                  dispensing vessel 30 s = the DISPENSING VESSEL DOME VALVE OPEN TIMER (O&M 2.3.4 / 2.3.6 / 2.8, xls sheet 60 "30s"); was
                  20 / 20 NO-SOURCE. Conflict noted: the VENT TIMER is 3 s in the O&M 2.8 and 6 s in the as-built PLC (xls sheet 30); the
                  DITL-LS logic of the app keeps the PLC 6 s.
     feeder       L-1311 Rotofeed (O.024C start -> I.0170 MIR-M1311 running): volumetric, 0 ~ 14 T/H (O&M section 1 maximum
                  14,000 kg/h; DITL-LS240 OUT3 "ACTURE ROTOFEEDER SPEED 0~14T/H") = the SOx control output (ABC-005 AICFG10571,
                  the speed of INV-M1311) while the dispensing vessel has material.
     pressures    PT-LM1811 lock vessel (AI0434), PT-LM1812 dispensing vessel = conveying pressure (AI0433), 0 ~ 6 kg/cm2.
                  At rest 0.0 / 0.1 (snapshot 19.PNG, limestone feeding STOP, conveying air closed). Conveying air on: 0.8 kg/cm2 +
                  0.05 per T/H of limestone: NO-SOURCE (between the DITL-LS230 LOW 0.5 and the O&M 2.5 blockage 1.5 bar; design
                  back pressure 1020 mmAq at the boiler). Time constants 1 s (vent), 4 s (equalising), 3 s (conveying): NO-SOURCE.
     air tank     PS-PA1811 (I.016A) made below 4 bar (O&M 2.9 "air tank pressure < 4 bar") of the plant air header.
     vent fan     F-1313 (O.024E start command -> I.0173 MIR-LM1313 running, IO list). */
const AN_LM = {
  m: { lock: 0.7 * 1280, disp: 1.4 * 1280 },
  lsh: 0.9,
  lsl: 0.3,
  tFill: 30,
  tXfer: 30,
  qMax: 14,
  stroke: 2,
  seal: 1,
  iso: 3,
  sealBar: 5,
  tankBar: 4,
  pRest: 0.1,
  pAir: 0.8,
  kQ: 0.05,
  pEq: 3.5 / 0.980665,
  /* the manual valves of the Rotofeed pneumatic panel PCB-1311 (O&M L5-3 3.2 / 3.5, the names of the O&M): control air isolation HV01
     (closed = the dome valve seals deflate, 3.5.4) and conveying air isolation HV11 (3.2.4); open in service */
  fv0: { HV01: 100, HV11: 100 }
};
function lmOut(n, r) {
  return fnOut(')' + n, r) === 1;
}
function anLmStart(U) {
  const L = (U.lm = { v: {}, sw: {} });
  L.mDisp =
    AN_LM.m.disp *
    0.6; /* NO-SOURCE: the dispensing vessel above its LSL at the 150 MW start (19.PNG: feeding STOP, no filling) */
  L.mLock = 0;
  L.pl = 0;
  L.pd = AN_LM.pRest;
  L.sp = doOut('ABC-005', 'AICFG10571');
  L.silo = 69.4; /* 19.PNG LILM1800 69.4 % */
  lmPub(U);
}
/* a dome / isolating valve: position 0 (closed) ~ 1 (open) toward its solenoid, the seal inflated after it is closed */
function lmValve(L, k, cmd, dt, stroke, seal) {
  const v = (L.v[k] = L.v[k] || { x: 0, s: seal ? AN_LM.seal : 0 });
  v.x = Math.max(0, Math.min(1, v.x + (cmd ? 1 : -1) * (dt / stroke)));
  if (seal) v.s = v.x <= 0 ? Math.min(AN_LM.seal, v.s + dt) : 0;
  return v;
}
function anLmStep(U, dt) {
  const L = U.lm;
  if (!L) return;
  const K = AN_LM,
    fv = t => {
      const V = (typeof AN_SRC !== 'undefined' && AN_SRC.valve) || {};
      return isFinite(V[t]) ? V[t] : K.fv0[t];
    },
    pa = isFinite(U.paPU) ? U.paPU * 0.980665 : 0 /* the plant air header, bar */,
    air = fv('HV01') > 0 ? pa : 0 /* control air of the panel (seals, solenoids) */,
    v = {};
  v.vent = lmValve(L, 'vent', lmOut('DITL-LS160', 1), dt, K.stroke, 1);
  v.lock = lmValve(L, 'lock', lmOut('DITL-LS170', 1), dt, K.stroke, 1);
  v.disp = lmValve(L, 'disp', lmOut('DITL-LS180', 1), dt, K.stroke, 1);
  v.bal = lmValve(L, 'bal', lmOut('DITL-LS190', 1), dt, K.stroke, 1);
  const eq = lmOut('DITL-LS200', 1),
    conv = lmOut('DITL-LS210', 2) && fv('HV11') > 0 && pa > K.tankBar;
  const iso = 'ABCDEFGH'.split('').map((x, i) => lmValve(L, 'iso' + x, lmOut('DITL-LS212', 11 + i), dt, K.iso, 0));
  const route = iso.some(q => q.x >= 1);
  /* the feeder (the VFD runs on its start command; no trip in the model) */
  L.run = lmOut('DITL-LS110', 6);
  L.fan = lmOut('DITL-LS214', 13);
  const mv = L.sp ? +L.sp.S.rt.v[L.sp.n] : 0;
  L.q = L.run && route && conv && L.mDisp > 0 ? (Math.max(0, Math.min(100, isFinite(mv) ? mv : 0)) / 100) * K.qMax : 0;
  /* material: silo -> lock (lock dome open), lock -> dispensing (dispensing dome open), dispensing -> conveying line (feeder) */
  const sil = L.silo > 0 ? (v.lock.x * K.m.lock * dt) / K.tFill : 0,
    toLock = Math.min(sil, K.m.lock - L.mLock);
  L.mLock += toLock;
  /* the silo level stands: silos are unlimited in this simulator (scope 2026-11-07) */
  const xf = Math.min(L.mLock, (v.disp.x * K.m.lock * dt) / K.tXfer, K.m.disp - L.mDisp);
  L.mLock -= xf;
  L.mDisp = Math.max(0, L.mDisp + xf - (L.q * 1000 * dt) / 3600);
  /* pressures (kg/cm2): the dispensing vessel is the conveying line; the lock vessel vents, is pressed by the equalising air, or
     shares the dispensing vessel through its open dome / balance valve */
  const lag = (x, y, tau) => x + (y - x) * Math.min(1, dt / tau);
  L.pd = lag(L.pd, conv ? (route ? K.pAir + K.kQ * L.q : K.pEq) : K.pRest, 3);
  if (v.disp.x > 0 || v.bal.x > 0) L.pl = lag(L.pl, L.pd, 1);
  else if (v.vent.x > 0) L.pl = lag(L.pl, 0, 1);
  else if (eq && fv('HV11') > 0 && pa > K.tankBar) L.pl = lag(L.pl, K.pEq, 4);
  if (eq && (v.disp.x > 0 || v.bal.x > 0)) L.pd = Math.max(L.pd, L.pl);
  /* the field switches (1 = made) */
  const sealOk = q => q.x <= 0 && q.s >= K.seal && air > K.sealBar;
  const W = L.sw;
  W.ventO = v.vent.x >= 1 ? 1 : 0;
  W.ventC = v.vent.x <= 0 ? 1 : 0;
  W.lockO = v.lock.x >= 1 ? 1 : 0;
  W.lockC = v.lock.x <= 0 ? 1 : 0;
  W.dispO = v.disp.x >= 1 ? 1 : 0;
  W.dispC = v.disp.x <= 0 ? 1 : 0;
  W.balO = v.bal.x >= 1 ? 1 : 0;
  W.balC = v.bal.x <= 0 ? 1 : 0;
  W.lockSeal = sealOk(v.lock) ? 1 : 0;
  W.dispSeal = sealOk(v.disp) ? 1 : 0;
  W.lsh = L.mLock >= K.lsh * K.m.lock ? 1 : 0;
  W.lsl = L.mDisp < K.lsl * K.m.disp ? 1 : 0;
  W.tank = pa < K.tankBar ? 1 : 0; /* the air receiver of the system (PS-PA1811) is fed by the plant air */
  W.run = L.run ? 1 : 0;
  W.fan = L.fan ? 1 : 0;
  /* 3.2.3-beta.257 (F95): the local selectors of the panel stand at REMOTE in normal service (O&M L5-3: the system runs from the DCS):
     SIL-LM1311 SYSTEM LOCAL / REMOTE (I.0176, DITL-LS10 row 6, LS110) and the Rotofeed VFD IN REMOTE (I.0172, DITL-LS110) */
  W.sysRem = 1;
  W.vfdRem = 1;
  iso.forEach((q, i) => {
    W['isoO' + i] = q.x >= 1 ? 1 : 0;
    W['isoC' + i] = q.x <= 0 ? 1 : 0;
  });
  lmPub(U);
}
function lmPub(U) {
  const L = U.lm;
  U.lmPl = Math.max(0, L.pl);
  U.lmPd = Math.max(0, L.pd);
  U.lmQ = L.q || 0;
  U.lmLock = (100 * L.mLock) / AN_LM.m.lock;
  U.lmDisp = (100 * L.mDisp) / AN_LM.m.disp;
  U.lmSilo = L.silo;
}
/* ===== SAND INJECTION (020 SAND INJECTION SYSTEM; docs/versions/v3.2.1/LIMESTONE_SAND_PLANT_MODEL.md) =====
   The field devices of the DensePhase vessel (HWA JANN / HCE, O&M L5-2 "Sand", on the PC) under the DITL logic of the sand drawings
   DITL-771 ~ 777 (E10210-3-771 ~ 777, station 103; the rows carry the terminal text, no address):
     inlet dome valve XV-SD1804 (SV-SD1804A, DITL-771 OUT21 / OUT22) -> DITL-772 rows 7 / 8 FULLY OPEN / CLOSE LS, row 3 SEAL PRESSURE
       SW (PS-SD1804, made = sealed: O&M 5.3 "seal pressure switch is not enable when dome valve closed" = the close fault);
     vent valve XV-AV1803 (SV-AV1803, OUT20), outlet valve XV-SD1801 (SV-SD1801, OUT23 / OUT24), conveying air XV-PA1800
       (SV-PA1800, OUT25) -> DITL-775 rows 1 ~ 6; isolating valves XV-SD1802A / B (DITL-776 OUT11 / OUT13) -> DITL-776 rows 7 ~ 10;
     vessel high level LSH-SD1801 (DITL-771 row 11), vessel pressure low PS-SD1800 (DITL-772 row 4: < 0.3 bar, O&M section 0 e);
     air buffer tank PS-PA1800 (DITL-775 row 7: < 4 bar, O&M 5.6), silo LSH / LSL-SD1800 (DITL-774 rows 3 / 4), vent filter
       M-1301 running (DITL-774 row 10, DITL-777 row 7) on its start command (DITL-774 OUT22 O.060A).
   Numbers: vessel 0.113 m3 x 1440 kg/m3 = 163 kg, silo 100 m3, max 6000 kg/h (O&M L5-2 section 1); conveying of one batch 55 s
   ("Peak Air Duration 55 seconds"); silo 50.1 % at 150 MW (20.PNG). Fill of the vessel 20 s (3.2.3-beta.58, was 15 s NO-SOURCE): the inlet
   dome valve stays open 20 s or until the level high LSH-SD1801, whichever first (O&M L5-2 system start cycle IV; filling timer 20 s,
   4.2.1). NO-SOURCE: valve stroke 2 s, seal 1 s, vessel pressure while conveying 2.0 kg/cm2 (L5-2 gives only the end of conveying,
   120 s AND PT-SD1800 < 0.5 bar, conveying air 5.0 barg, vessel design 7.0 barg), silo LSH / LSL at the LT-SD1800 alarms 85 / 30 %
   (alarm list; the switch heights are not given). */
const AN_SD = {
  m: 0.113 * 1440,
  silo: 100,
  tFill: 20,
  tConv: 55,
  stroke: 2,
  seal: 1,
  sealBar: 5,
  tankBar: 4,
  pLowBar: 0.3,
  pConv: 2.0,
  lsh: 0.9,
  siloH: 85,
  siloL: 30
};
function sdOut(n, ...rows) {
  return rows.some(r => fnOut(')' + n, r) === 1);
}
function anSdStart(U, pa0) {
  U.sd = { v: {}, sw: {}, m: 0, p: 0, silo: 50.1 /* 20.PNG LISD1800 */ };
  /* Mina F7: the field switches stand from the first scan. With no switch yet the DITL read "dome valve not closed, no seal" for one scan at
     the 150 MW load: INLET DV CLOSE FAULT, SYSTEM TRIP on DITL-777, reset 2 s later */
  anSdStep(U, 1e-3, pa0);
}
function anSdStep(U, dt, pa0) {
  const D = U.sd;
  if (!D) return;
  const K = AN_SD,
    pa = (isFinite(U.paPU) ? U.paPU : pa0 || 0) * 0.980665,
    vv = (k, cmd, seal) => lmValve(D, k, cmd, dt, K.stroke, seal);
  const dv = vv('dv', sdOut('DITL-771', 20, 21), 1),
    vent = vv('vent', sdOut('DITL-771', 19), 0),
    out = vv('out', sdOut('DITL-771', 22, 23), 0),
    ca = vv('ca', sdOut('DITL-771', 24) && pa > K.tankBar, 0),
    iso = [vv('isoA', sdOut('DITL-776', 10), 0), vv('isoB', sdOut('DITL-776', 12), 0)];
  D.fan = sdOut('DITL-774', 21);
  /* filling: silo -> vessel through the inlet dome valve (the vent lets the air out) */
  const fill = D.silo > 0 ? Math.min((dv.x * K.m * dt) / K.tFill, K.m - D.m) : 0;
  D.m += fill;
  /* the silo level stands: silos are unlimited in this simulator (scope 2026-11-07) */
  /* conveying: conveying air + outlet + a route to the boiler; the batch leaves in 55 s, the vessel pressure falls when it is empty */
  const route = iso.some(q => q.x >= 1),
    conv = ca.x > 0 && out.x > 0 && route,
    q = conv && D.m > 0 ? Math.min(D.m, (K.m * dt) / K.tConv) : 0;
  D.m -= q;
  D.q = (q / dt) * 3.6; /* T/H */
  const tgt = ca.x > 0 && out.x > 0 && !route ? pa / 0.980665 : conv && D.m > 0 ? K.pConv : 0;
  D.p += (tgt - D.p) * Math.min(1, dt / (vent.x > 0 ? 1 : 3));
  const W = D.sw;
  const sealOk = v => v.x <= 0 && v.s >= AN_LM.seal && pa > K.sealBar;
  W.dvO = dv.x >= 1 ? 1 : 0;
  W.dvC = dv.x <= 0 ? 1 : 0;
  W.seal = sealOk(dv) ? 1 : 0;
  W.ventO = vent.x >= 1 ? 1 : 0;
  W.ventC = vent.x <= 0 ? 1 : 0;
  W.outO = out.x >= 1 ? 1 : 0;
  W.outC = out.x <= 0 ? 1 : 0;
  W.caO = ca.x >= 1 ? 1 : 0;
  W.caC = ca.x <= 0 ? 1 : 0;
  W.isoAO = iso[0].x >= 1 ? 1 : 0;
  W.isoBO = iso[1].x >= 1 ? 1 : 0;
  W.isoAC = iso[0].x <= 0 ? 1 : 0;
  W.isoBC = iso[1].x <= 0 ? 1 : 0;
  W.lsh = D.m >= K.lsh * K.m ? 1 : 0;
  W.plow = D.p * 0.980665 < K.pLowBar ? 1 : 0;
  W.tank = pa < K.tankBar ? 1 : 0;
  W.siloH = D.silo >= K.siloH ? 1 : 0;
  W.siloL = D.silo <= K.siloL ? 1 : 0;
  W.fan = D.fan ? 1 : 0;
  sdPub(U);
}
function sdPub(U) {
  const D = U.sd;
  U.sdP = Math.max(0, D.p);
  U.sdM = (100 * D.m) / AN_SD.m;
  U.sdSilo = D.silo;
  U.sdQ = D.q || 0;
}
/* ===== BOTTOM ASH TRANSMITTER AND CONVEYORS (016 BOTTOM ASH REMOVAL SYSTEM, PICT 16 / 17; docs/versions/v3.2.1/BOTTOM_ASH_PLANT_MODEL.md)
   The field devices of the bottom ash handling system (J.A.T. Engineering 130225, O&M L6 "Bottom ash" on the PC) under the drawings
   DITL-BA01 ~ BA74 (130225C-BA-xx, station 103, IO list "Station 103" B/A Feeding / B/A Handling).
   Ash transmitter (HD600 vessel): inlet knife gate valve SV-BH1759 (DITL-BA53 OUT7), venting valve SV-BH1753 (OUT1), outlet valve
     SV-BH1752 (OUT8), pressing valve SVO / SVC-BH1750 (OUT9 / OUT10, double solenoid: it stays where it is between the commands) ->
     ZSO / ZSC I.0482 ~ I.0489 (DITL-BA03, BA11, BA38, BA39); vessel pressure switches PSH-BH1750 I.048A (1.8 kg/cm2) and PSL-BH1750
     I.048B (0.5 kg/cm2, 1 = low: DITL-BA25 TR358), air tank PS-BH1750 I.048D (1 = low < 7 kg/cm2: DITL-BA03 NOT, BA25 TR359), vessel
     high level LS-BH1750 I.048F. O&M L6 p.7 ~ 10: primary conditions "all valves closed, air source > 7 Kg/cm2, transmitter < 0.5
     Kg/cm2"; pressing at the regulator 3.5 Kg/cm2-G, outlet opens at 1.8, cleaning below 0.5.
   Mechanical conveyors (DITL-BA59 / BA60 rows by tag, no address): remote selectors MIL-x at REMOTE (16.PNG "R"), local emergency stop
     contacts ES-L-1090 ~ 1092 closed (IO list "not emergency stop", N.C. from local; DITL-BA62 NOT), speed switches SS-BH1750 ~ 1752 made
     while the machine turns (IO list "1 : speed OK"), block switches not made.
   NO-SOURCE (O&M L6 JAT 130225-OMM-01 p 4 ~ 10 searched 2026-11-11: charging ends at the high level or the charging time, not printed;
   conveying runs until the low pressure 0.5 kg/cm2 G, then cleaning 10 s and vent 2 s, over-time alarm 900 s; pressing over-time 60 s):
   valve stroke 2 s, charging of the vessel 30 s, conveying of one batch 60 s, vessel pressure while conveying 1.5 kg/cm2,
     the buffer tank (not modelled: the charge assumes ash in the buffer tank). The air tank PS-BH1750 reads the plant air receiver tanks of the
     model (U.paP, 39.PNG 7.0 kg/cm2), ASSUMED: the transmitter's own air tank is charged at rest with no flow, so it stands at the
     supply pressure, not at the unit header under full plant use (U.paPU 6.8, whose 0.2 drop is NO-SOURCE); decided by SEULGI 2026-11-04
     (user: "ikaw lahat magdecide"). Low = below 7 kg/cm2 (O&M L6 p.9). */
const AN_BA = {
  stroke: 2,
  tFill: 30,
  tConv: 60,
  pReg: 3.5,
  pHi: 1.8,
  pLo: 0.5,
  pConv: 1.5,
  airSw: 7,
  lsh: 100
};
/* the transmitter's air tank: the plant air receivers (no flow into it at rest), else the header */
function baTank(U) {
  /* before the first step of the air model (the 150 MW start): the receivers at their set pressure (unit.js AN_AIR_SP) */
  return isFinite(U.paP) ? U.paP : typeof AN_AIR_SP !== 'undefined' ? AN_AIR_SP.pa : 0;
}
function anBaStart(U) {
  U.ba = { v: {}, sw: {}, lv: 0, p: 0, press: 0, tw: 0, gi: { A: 0, B: 0, C: 0, D: 0 } };
  /* at rest (O&M L6 primary conditions): every valve closed, the vessel empty and at atmosphere; the field switches are known before
     the first step, so the start of the DITL (ditl150.js) reads them */
  const W = U.ba.sw;
  for (const k of ['inl', 'vent', 'out', 'prs']) {
    W[k + 'O'] = 0;
    W[k + 'C'] = 1;
  }
  W.twO = 0;
  W.twC = 1;
  W.psh = 0;
  W.psl = 1;
  W.air = baTank(U) >= AN_BA.airSw ? 0 : 1;
  W.lsh = 0;
  W.rem = 1;
  W.es = 1;
  baPub(U);
}
function anBaStep(U, dt) {
  /* chain conveyor L-1090 runs on its ON COMMAND (DITL-BA68 output row 4, counted from 0; the 150 MW start presses its START, ditl150.js) */
  U.baConv = fnOut('DITL-BA68', 4) === 1 ? 1 : 0;
  const B = U.ba;
  if (!B) return;
  /* lane 3 (KIRARA, beta.563): the two-way separator L-1094 (OPEN = to the vibrating screens, CLOSE = to the ash silo: DITL-BA66 lets the
     screw run with VIBRATING SCREEN RUNNING and TWO WAY OPEN, or NOT ASH SILO HIGH LEVEL and TWO WAY CLOSE). Its baffle is turned by one
     double-acting air cylinder (K1AU3-D1-0-010 RA Engineering Data of Bottom Ash Transfer System, pdf p 22, drawing 130225A-TW-01 rev B
     "Assembly for two way": MCQA-11-80-200-TC, bore 80, stroke 200 mm, used stroke 190 mm, 60 deg baffle, two OMRON WLCA2 limit
     switches; P&ID 130225A-PID-01 rev D draws speed regulators on it). The solenoid of each end (DITL-BA71 output rows 5 TWO-WAY(O) =
     O.0210 SVO-BH1754, 6 TWO-WAY(C) = O.0211 SVC-BH1754, counted from 0) drives the cylinder while it is on; with no command the
     cylinder stays where it is (the DITL-BA65 command drops at the limit). Travel time (CALC): the MCQ series runs 50 ~ 500 mm/s, so
     190 mm takes 0.4 ~ 3.8 s; DITL-BA65 TR29 gives TWO-WAY ABNORMAL when the limit is not made 5 s after the command, so a healthy stroke
     is below 5 s. AN_BA.stroke 2 s (the stroke of the transmitter valves) is inside that range. U.ba.tw = position 0 (closed) ~ 1 (open);
     ZSO-BH1754 made only at 1, ZSC-BH1754 only at 0, both open while it travels (DITL-BA60 TWO-WAY LSO / LSC). At rest it is closed
     (anBaStart); a save made before beta.563 has no position: ditl150.js D.baSave puts it closed */
  {
    const op = fnOut('DITL-BA71', 5) === 1,
      cl = fnOut('DITL-BA71', 6) === 1;
    if (!isFinite(B.tw)) B.tw = 0;
    if (op !== cl) B.tw = Math.max(0, Math.min(1, B.tw + ((op ? 1 : -1) * dt) / AN_BA.stroke));
    B.sw.twO = B.tw >= 1 ? 1 : 0;
    B.sw.twC = B.tw <= 0 ? 1 : 0;
  }
  /* Phase 6 slice 4 (2026-11-26): the inlet valves XV-BH1060-A ~ D of the four bottom ash screw coolers. DITL-117 (and its copies #B ~ #D)
     BOTTOM ASH SCREW COOLER INLET VALVE (1) gives the OPEN command on output row 7 (O.0217 / O.0298 / O.0618 / O.029D = SVO-BH1060-x)
     and the CLOSE command on row 12 (O.0218 / O.0299 / O.0619 / O.029E = SVC-BH1060-x), counted from 0. The valve has two solenoids, so
     like the pressing valve below it goes to the end of the last command and stays there; its limit switches ZSO / ZSC-BH1060-x
     (IO list STN103 I.025B / 025C, I.053B / 053C, I.064B / 064C, I.068B / 068C) are made at that end. DITL-117 / 118 read no position
     switch (the I/O list gives these two inputs no Logic column): they go to the CRT only. Travel time NO-SOURCE (no data sheet of the
     valve in the docs), so the switch follows the command at once, as the pressing valve does. At rest closed (anBaStart: every valve
     closed; the four coolers stand stopped at 150 MW, HMI snapshot 16.PNG); a save without U.ba.gi starts closed. */
  if (!B.gi) B.gi = {};
  for (const [x, c] of [['A', ''], ['B', ' #B'], ['C', ' #C'], ['D', ' #D']]) {
    const op = fnOut('DITL-117' + c, 7) === 1,
      cl = fnOut('DITL-117' + c, 12) === 1;
    if (!isFinite(B.gi[x])) B.gi[x] = 0;
    if (op && !cl) B.gi[x] = 1;
    if (cl && !op) B.gi[x] = 0;
  }
  const K = AN_BA,
    o = r => fnOut(')DITL-BA53', r) === 1,
    vv = (k, cmd) => lmValve(B, k, cmd, dt, K.stroke, 0),
    pa = isFinite(U.paPU) ? U.paPU : 0; /* kg/cm2 */
  /* the pressing valve has two solenoids: open on SVO, close on SVC, it stays between them */
  if (o(8)) B.press = 1;
  if (o(9)) B.press = 0;
  const inl = vv('inl', o(6)),
    vent = vv('vent', o(0)),
    out = vv('out', o(7)),
    prs = vv('prs', B.press);
  /* charging: ash falls from the buffer tank while the inlet gate is open (the vent lets the air out) */
  B.lv = Math.min(100, B.lv + (inl.x * 100 * dt) / K.tFill);
  /* conveying: outlet open with pressing air, the batch leaves in tConv */
  const conv = out.x > 0 && prs.x > 0 && B.p > K.pLo;
  if (conv) B.lv = Math.max(0, B.lv - (100 * dt) / K.tConv);
  const air = prs.x > 0 ? Math.min(K.pReg, pa) : 0,
    tgt =
      vent.x > 0 || inl.x > 0
        ? 0
        : out.x > 0
          ? prs.x > 0 && B.lv > 0
            ? Math.min(K.pConv, air)
            : 0
          : prs.x > 0
            ? air
            : B.p;
  B.p += (tgt - B.p) * Math.min(1, dt / (vent.x > 0 || inl.x > 0 ? 1 : out.x > 0 ? 3 : 5));
  const W = B.sw;
  for (const [k, v] of [
    ['inl', inl],
    ['vent', vent],
    ['out', out],
    ['prs', prs]
  ]) {
    W[k + 'O'] = v.x >= 1 ? 1 : 0;
    W[k + 'C'] = v.x <= 0 ? 1 : 0;
  }
  W.psh = B.p >= K.pHi ? 1 : 0;
  W.psl = B.p < K.pLo ? 1 : 0;
  W.air = baTank(U) < K.airSw ? 1 : 0;
  W.lsh = B.lv >= K.lsh ? 1 : 0;
  W.rem = 1;
  W.es = 1;
  baPub(U);
}
function baPub(U) {
  const B = U.ba;
  U.baP = Math.max(0, B.p);
  U.baLv = B.lv;
}
/* the boiler-side systems, once per step of the unit model (after the air compressors: the atomizing air is plant air) */
/* SOx at the stack (3.2.3 b5, user 2026-11-11 "bawal ang ASSUMED": every number from a document or a CALC from documented inputs).
   Raw SO2 (CALC): performance coal, FHI P2S7 Tab 2 page 2-7-TAB_2-1 (C 42.97, H 2.75, O 11.42, N 0.59, S 1.49, ash 6.82, water 33.96 %),
   excess air 20 % (Tab 3 page 2-7-TAB_3-1): per kg of coal O2 needed 0.03949 kmol, air 1.2 / 0.21 x that, wet flue gas 0.2551 kmol
   (CO2 0.03581, H2O 0.03249, SO2 0.000465, N2 0.1787, O2 0.00791), so SO2 = 0.000465 / 0.2551 = 1822 ppm wet, no limestone. At the MCR
   fuel 89,000 kg/h (Tab 3) that is 509,000 Nm3/h of wet gas (no air heater leakage counted). For reference only: the ESP design rate
   with margin is 602,000 Nm3/h (Equipment List K1AU3-L1-0-002 RA, PDF p 8, ESP Z-1010), not the gas of the MCR.
   Ca/S (CALC): limestone CaCO3 93.66 % (Tab 3 page 2 "Performance Limestone"), FHI P2S7 Tab 4 Fig. 13 design sorbent flow 12 T/H at
   100 % MCR with coal 89 T/H (40 % 5 / 38.5, 50 % 6 / 47, 70 % 8 / 64, 85 % 9.6 / 77: about the same ratio at every load):
   (12 x 0.9366 / 100.09) / (89 x 0.0149 / 32.06) = 2.71.
   Capture: SO2 = raw x exp(-k x Ca/S), the form of the model before; k from the design point: at Ca/S 2.71 the stack reads the set point
   of the SOx control, 200 ppm (HMI snapshot 19.PNG ABC-005 AICFG10571 SV 200): k = ln(1822 / 200) / 2.715 = 0.814 (CALC). The bed lime
   starts at the design Ca/S (z0). Was k 11 and z0 0.346, a fit to the snapshot 41 ppm with limestone STOP (not a document).
   3.2.3-beta.91 (SAKURA, user 2026-11-11 "reverse engineer o calibrate, wag lng assumed"):
   Lag of the lime in the bed, tau (CALC): the bed lime is renewed as the bed solids leave. Bed inventory about 100 t (FHI P2S8 Tab 9
   page 2-8-TAB_9-3, bed charge of the furnace and seal pots); solids leaving at MCR = coal ash 89 x 0.0682 = 6.07 T/H (Tab 2) + CaO of
   the limestone 12 x 0.9366 x 56.08 / 100.09 = 6.30 + SO3 taken up 89 x 0.0149 x (1 - 200 / 1822) x 80.06 / 32.06 = 2.95 + limestone
   inerts 12 x 0.0634 = 0.76, total 16.08 T/H (Fig. 13 12 T/H, Tab 3 page 2 CaCO3 93.66 %): tau = 100 / 16.08 h = 6.2 h = 22,400 s
   (was 7200 s NO-SOURCE). Taken at the MCR flows.
   Dilution (CALC, replaces the NO-SOURCE scale min(1.1, coal / coal at start)): SO2 in ppm = the SO2 of the coal that burns over the
   flue gas. The model O2 is 21 x (1 - stoichiometric air / total air) (unit.js), so 21 - O2 is the fuel per air; at the design excess
   air 20 % (Tab 3) O2 = 21 x (1 - 1 / 1.2) = 3.5 %. SO2 = raw x capture x (21 - O2) / 17.5 x (coal burnt / all fuel burnt as coal
   equivalent: U.burn x coal over U.burn x coal + 2.55 x oil, PR-OPE-5002 4.3.x). No coal burning = 0 (the oil sulphur is not counted:
   NO-SOURCE, the diesel analysis is not in the docs). */
/* NOx at the stack analyzer AT-FG1057-2 (see the AN.unit.tt note): FHI guarantee x Ft x Fea, K1AU3-R3-0-001 Rev 2 section 3.6 */
const AN_NOX = {
  g: 180 /* ppm dry at 6 % O2, design coal; DESIGN-SRC: FHI K1AU3-R3-0-001 Rev 2 p15 */,
  o2r: 6,
  ft: [[830, 0.975], [840, 0.97], [850, 1.0], [860, 1.03], [870, 1.06], [880, 1.09], [890, 1.125], [900, 1.155], [910, 1.19], [920, 1.22], [930, 1.25]] /* DESIGN-SRC: K1AU3-R3-0-001 p16 Ft curve */,
  fea: [[15, 0.84], [20, 1.0], [25, 1.16], [30, 1.32], [35, 1.48], [40, 1.645]] /* DESIGN-SRC: K1AU3-R3-0-001 p16 Fea curve */
};
const anNoxLin = (t, x) => {
  if (!(x > t[0][0])) return t[0][1];
  for (let i = 1; i < t.length; i++) if (x <= t[i][0]) return t[i - 1][1] + ((t[i][1] - t[i - 1][1]) * (x - t[i - 1][0])) / (t[i][0] - t[i - 1][0]);
  return t[t.length - 1][1];
};
function anNox(U, o2f, o2s, gg) {
  const K = AN_NOX,
    cb = isFinite(U.cbn) ? U.cbn : 0,
    fe = cb + (U.ao || 0) * (U.oilF || 0);
  if (!(gg > 1) || !(cb > 0.01) || !(fe > 0.01) || !isFinite(U.Tb)) return 0;
  const ea = (100 * o2f) / Math.max(0.1, 20.9 - o2f),
    n6 = K.g * anNoxLin(K.ft, U.Tb) * anNoxLin(K.fea, ea);
  return Math.round((n6 * Math.max(0, 20.9 - o2s)) / (20.9 - K.o2r) * (cb / fe));
}
const AN_SOX = { raw: 1822, k: 0.814, z0: 2.71, tau: 22400, o2d: 21 * (1 - 1 / 1.2) };
function anSoxStep(U, dt) {
  const K = AN_SOX;
  if (!isFinite(U.soxZ)) U.soxZ = K.z0;
  const c = U.Fc || 0;
  if (c > 1)
    U.soxZ += ((((U.lmQ || 0) * 0.9366) / 100.09 / ((c * 0.0149 * (U.coalR || 1)) / 32.06) - U.soxZ) * Math.min(dt, K.tau)) / K.tau;
  U.soxF = Math.exp(-K.k * Math.max(0, U.soxZ));
  const cb = isFinite(U.cbn) ? U.cbn : (isFinite(U.burn) ? U.burn : 1) * c,
    fe = cb + (U.ao || 0) * (U.oilF || 0),
    dil = U.afs > 0 && isFinite(U.o2v) ? Math.max(0, 21 - U.o2v) / (21 - K.o2d) : Math.min(1.1, c / Math.max(1, U.F0));
  U.soxD = fe > 0.01 ? (dil * cb) / fe : 0;
  if (U.soxAI && U.soxAI.length) anUnitWrite(U.soxAI, K.raw * U.soxF * U.soxD);
}
function anBoilerStep(U, dt) {
  anDieselOilStep(U, dt);
  anFanStep(U, dt);
  anAphStep(U, dt);
  anLmStep(U, dt);
  anSoxStep(U, dt);
  anSdStep(U, dt);
  anBaStep(U, dt);
}
