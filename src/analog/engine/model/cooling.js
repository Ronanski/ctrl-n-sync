/* Phase 11 part 7+8 (SUZU, 2026-11-27): the cooling water systems of the plant model, moved out of unit.js with no number change:
   sea water / circulating water (SWP, SWBP, debris filters, condenser water boxes), make-up water (MWP, expansion tank), closed
   (auxiliary) cooling water (ACWP, CCWHE) and the bottom ash screw coolers. Joined before engine/unit.js (src/analog/order.list); the
   shared field valve table (AN_FV0, anFv, AN_SW_V0) stays in unit.js. Every source note below is the one it had in unit.js. */
/* 3.2.1 (IRENE: PLANT MODEL, CIRCULATING WATER; user 2026-11-04 "OK lang nang ok kay irene ... Tapusin muna lahat"): the seawater
   system of flow diagram K1AU3-PD-020 Rev D, from the vendor data of the machines (the earlier model of beta.59 used fixed steps).
   Every number has its source; the ones with none are NO-SOURCE (docs/versions/v3.2.1/CW_PLANT_MODEL.md lists them).
   Network: forebay (LT-SW1501) -> SWP P-1501A / B / C (each: pump -> PG-SW1501x -> check valve -> discharge valve V-SW1002 / 1004 /
   1006) -> 96" header -> debris filter S-1502 -> node N -> condenser path A (inlet V-SW1007, H-1110 tubes, outlet V-SW1009) and path
   B (V-SW1008, V-SW1010) -> siphon pit -> discharge channel; node N -> 24" line -> SWBP P-1503A / B / C (suction PG-SW1503x1, discharge
   PG-SW1503x2, valve V-SW1016 / 1018 / 1020) -> debris filter S-1504 -> CCW heat exchangers H-1107A / B / C -> discharge.
   The flows are solved every step: the head of each running pump on its curve meets the losses of the lines (drop ~ flow^2).
     SWP curve        EBARA 1350VZM, K1AU3-D1-0-064 p6 "Pump characteristic curve" (doc R1306832-8902-0102), read off the graph:
                      head and pump efficiency vs capacity; shaft power p6 bottom; rated 18,900 m3/h x 28 m x 507 rpm, min flow 5,000,
                      max 22,680 m3/h (p4 data sheet R1306832-8902-0101); sp. gr. 1.02 (p4) so 1 m of seawater = 0.102 kg/cm2.
     SWP gauge        PG-SW1501 at the discharge center GL +1.8 m (p4 "DISCHARGE CENTER GL +1800"): P = 0.102 x (H - 1.8 + forebay).
     SWP motor        TECO 2050 kW 6.6 kV, D1-0-064 p26 "Starting & operating performance": load 25 / 50 / 75 / 100 / 125 % =
                      166 / 182 / 216 / 260 / 317 A (load = shaft power / 2050 kW; below 25 % the 25 ~ 50 % line, extrapolated).
                      Start: soft starter (Solcon HRVS-DN, E1-0-131), 500 A while it ramps (SNAPSHOT-TO-REPLACE: an operating
                      procedure number, not a design value; the starter current limit setting is not in the docs read yet).
     SWBP curve       PACO CL12151, K1AU3-D1-0-034 p8 "Pump Performance Datasheet": rated 1,000 m3/h x 15 m, 1,180 rpm, head at
                      shut-off (rated diameter) 19.9 m, efficiency 80.25 % at rated, BEP 1,129.9 m3/h, rated power 50.87 kW;
                      H = 19.9 - 4.9e-6 Q^2 (through the two points), efficiency = e x (2r - r^2), r = Q / 1,129.9, e from 80.25 %.
     SWBP motor       TECO 100 HP 460 V, D1-0-034 p10: 100 % load = 120 A, Y / delta start (LRC 685 % / 3 = 274 A);
                      Current = line through (the shaft power at the design point, 90 A: SNAPSHOT-TO-REPLACE, an operating procedure
                      number, no motor load curve in the docs read yet) and (74.6 kW = 100 HP, 120 A).
     Debris filters   S-1502 DN2400 (O&M L18-4, Technical details): normal flow 37,800 m3/h, clean DP 500 mmH2O, backwash starts at
                      800 mmH2O (L18-4 p36 7.4: DP above 80 mbar for 30 s), flushing period 3 min, max DP 1.0 kg/cm2; S-1504 DN600 (O&M
                      L18-5): normal flow 2,000 m3/h, clean 500, backwash 800 mmH2O. DP = clean x (flow / normal)^2 x (1 + dirt).
     Calibration      the design point = the two vendor documents that agree: 2 SWP at 18,900 m3/h = 37,800 m3/h = the S-1502 normal
     (one point)      flow; SWP discharge valves 100 %, condenser inlet 100 % / outlet 40 % (the valve line-up of the start state),
                      forebay -4 m: PG-SW1501 = 0.102 x (28 - 1.8 - 4) = 2.26 kg/cm2, condenser inlet water box 1.05 kg/cm2,
                      condenser drop 0.4 kg/cm2, 2 SWBP at 2.35 kg/cm2 discharge with suction = node N. The constants of the lines
                      come from this point. SNAPSHOT-TO-REPLACE: the forebay level, the water box pressure, the condenser drop and
                      the SWBP discharge are operating procedure numbers; the design ones (sea water mass balance MB-020 header
                      pressures, condenser D1-0-039 water side drop, the intake civil level) are not read yet.
     Valves           the manual valves are field valves (no DCS signal; AN_SRC.valve, set by the field operator): loss = loss at 100 %
                      / (opening)^4, flow area = opening^2 (NO-SOURCE: no valve data in the repository); closed = no flow.
     Condenser water  in: 30 C (AN_SW_TIN, D1-0-039 R1); out = in + the heat of the condenser port (MEI, ports.js cd) / (water x cp)
                      (Phase 11; the old rise 5.6 C x steam / 316 T/H was a second copy of the condenser duty, deleted).
   The forebay is at -4 m (SNAPSHOT-TO-REPLACE, see the calibration). UNUSUAL (in the report): the alarm list H of LT-SW1501 is -6.0 m. */
/* C, condenser seawater inlet design, K1AU3-D1-0-039 R1 sheet K2MC3A-100 (in / out 30 / 35.6 C). beta.362 D21: was AN_SW.Tin 28.5 / 28.6
   (no source); kept outside AN_SW because a save carries AN_SW (state.js AN_STATE_OBJ) and the starting states of
   the app (Cold / 150 MW) had 28.5 / 28.6 in it */
const AN_SW_TIN = [30, 30];
const AN_SW = {
  swp: ['M.3353', 'M.3354', 'M.3355'],
  swbp: ['DITL-30', 'DITL-30 #B', 'DITL-30 #C'],
  df: ['DITL-39@3', 'DITL-39@14'],
  /* SWP curve D1-0-064 p6 (m3/h, m, %, kW) */
  cQ: [0, 2500, 5000, 7500, 10000, 12500, 15000, 17500, 18900, 20000, 21000, 22000, 22680],
  cH: [47.0, 43.1, 39.9, 37.5, 35.5, 33.6, 31.7, 29.5, 28.0, 26.6, 25.4, 23.9, 22.6],
  pQ: [0, 5000, 10000, 15000, 18900, 22680],
  pP: [1720, 1630, 1620, 1650, 1700, 1690],
  Qr: 18900,
  Qmin: 5000,
  Qmax: 22680,
  zD: 1.8,
  kP: 0.102 /* kg/cm2 per m of seawater, sp. gr. 1.02 */,
  mL: [0, 25, 50, 75, 100, 125],
  mI: [150, 166, 182, 216, 260, 317] /* 0 % = the 25 ~ 50 % line extrapolated */,
  mkW: 2050,
  Ist: 500,
  /* SWBP D1-0-034 p8 / p10 */
  bH0: 19.9,
  bA: 4.9e-6,
  bQr: 1000,
  bBep: 1129.9,
  bEff: 0.8025,
  bkW: 74.6,
  bI100: 120,
  bIsop: 90,
  bIst: 274,
  /* debris filters (L18-4 / L18-5) */
  f1Q: 37800,
  f2Q: 2000,
  dp0: 500,
  dpBw: 800,
  bwT: 180,
  dirtBw: 0.6 /* (800 / 500) - 1 */,
  /* beta.314 (JENNIE, Audit #5): the filter PLC timers, O&M L18-4 (DN2400) p36 section 7.4 "TIMER SETTING" and p47 section 4.3, the
     same in L18-5 (DN600): flushing 3 min, SYSTEM CYCLE TIMER 4 h (a flush every 4 h from the end of the last one), DP HIGH SEQUENCE
     LEAD TIMER 30 s (DP above 80 mbar for 30 s starts a flush and resets the cycle timer). The vendor data (p15, DP at normal flow) gives:
     clean 500, partly (50 %) choked 1,200 mmH2O. The fouling rate of the seawater is not in the docs and no plant DP trend has the
     S-1502 / S-1504 tags: dirtT keeps the clean -> 800 mmH2O time equal to the vendor cycle timer (4 h), so in normal water the
     timer flush comes first and the DP flush is the back-up, as the control philosophy describes. */
  cycT: 4 * 3600,
  hiT: 30,
  dirtT: 4 * 3600 /* = cycT (above): clean -> 800 mmH2O at the normal flow */,
  /* design point (calibration) */
  dQ: 18900,
  dL: -4,
  dPci: 1.05,
  dPdc: 0.4,
  dPbd: 2.35,
  /* beta.312 (JENNIE, Audit #5, the three valve losses were NO-SOURCE): loss = K x v^2 / 2g, K of the open valve from the Crane TP-410
     table (K = n x fT, fT = the fully rough friction factor 1 / (2 log10(3.7 D / e))^2, e = 0.046 mm), v from the line size of the docs.
     hv100: SWP discharge DN1350 (D1-0-064 p4 "DISCHARGE 1350 mm"), 18,900 m3/h -> v 3.67 m/s, v^2/2g 0.686 m, fT 0.0099;
       butterfly 25 fT + swing check 50 fT = 0.74 -> 0.51 m (check valve type not in the docs: swing, the larger Crane K).
     ki100: condenser inlet nozzle 66" (D1-0-039 p7 nozzle chart N1a/b, ID 1628.4 mm), design path flow 17,686 m3/h -> v 2.36 m/s,
       v^2/2g 0.284 m, fT 0.0096; butterfly 25 fT = 0.24 -> 0.068 m = 0.0069 kg/cm2.
     hb100: SWBP discharge 12" (D1-0-034 p5 "Discharge size: 12 inches", ID 304.8 mm), 1,000 m3/h -> v 3.81 m/s, v^2/2g 0.739 m;
       butterfly 10 ~ 14" 35 fT, fT 0.013 (Crane 12") = 0.455 -> 0.34 m. */
  hv100: 0.51 /* m, open SWP check + discharge valve at 18,900 m3/h (above) */,
  ki100: 0.0069 /* kg/cm2, open condenser inlet valve at the design path flow (above) */,
  hb100: 0.34 /* m, open SWBP discharge valve at 1,000 m3/h (above) */,
  oDes: 40 /* condenser outlet opening of the design point (the start state line-up; SNAPSHOT-TO-REPLACE, the head) */,
  /* read by the condenser step (MEI, unit.js anCondStep: its steam estimate) until its duty comes from the turbine port (rank 6); not
     used by the sea water: D1-0-039 R0 p7 shell 316.024 T/H, FHI MCR 460 T/H */
  cSt: 316.024,
  mcr: 460,
  ramp: 10 /* s, SWP soft starter ramp: ACC. TIME of the installed Solcon HRVS-DN, O&M L23-3 manual 7.8 (its set value; the plant setting sheet is not in the docs) */,
  bRamp: 5 /* s, NO-SOURCE: Y / delta change-over of the SWBP */,
  tauP: 2,
  tauT: 60,
  tauI: 1
};
const swInterp = (X, Y, x) => {
  if (x <= X[0]) return Y[0] + ((Y[1] - Y[0]) * (x - X[0])) / (X[1] - X[0]);
  for (let i = 1; i < X.length; i++)
    if (x <= X[i]) return Y[i - 1] + ((Y[i] - Y[i - 1]) * (x - X[i - 1])) / (X[i] - X[i - 1]);
  const n = X.length - 1;
  return Y[n] + ((Y[n] - Y[n - 1]) * (x - X[n])) / (X[n] - X[n - 1]);
};
/* the head of a pump at speed s (affinity: H(Q, s) = s^2 H(Q / s)) */
const swH = (Q, s) => (s > 0 ? s * s * swInterp(AN_SW.cQ, AN_SW.cH, Q / s) : 0);
const swbH = (Q, s) => (s > 0 ? s * s * AN_SW.bH0 - AN_SW.bA * Q * Q : 0);
/* the flow of a pump when the line after it is at head h: pump head - valve loss = h (0 if the pump cannot reach h: check valve) */
function swPumpQ(fH, s, kv, h, qMax) {
  if (!(s > 0) || !(kv < Infinity)) return 0;
  const f = q => fH(q, s) - kv * q * q - h;
  if (f(0) <= 0) return 0;
  let a = 0,
    b = qMax * Math.max(s, 0.05);
  if (f(b) > 0) return b;
  for (let i = 0; i < 40; i++) {
    const m = (a + b) / 2;
    if (f(m) > 0) a = m;
    else b = m;
  }
  return (a + b) / 2;
}
const swBisect = (f, a, b, n) => {
  for (let i = 0; i < (n || 40); i++) {
    const m = (a + b) / 2;
    if (f(m) > 0) a = m;
    else b = m;
  }
  return (a + b) / 2;
};
/* valve: opening 0 ~ 100 % -> multiplier of its loss at 100 % (Infinity = closed); flow area = opening^2 (a butterfly valve opens
   little area at a small opening; NO-SOURCE: no valve curve in the repository) */
const swVk = pct => (pct > 0.5 ? 1 / Math.pow(Math.min(100, pct) / 100, 4) : Infinity);
/* the line constants from the design point (once) */
/* SWBP efficiency: a plain function, a function kept in K.c does not cross the Worker snapshot (Mina beta.103, c.eb is not a function) */
const swEb = (K, r) => (K.bEff / (2 * (K.bQr / K.bBep) - Math.pow(K.bQr / K.bBep, 2))) * Math.max(0, 2 * r - r * r);
function swCal() {
  const K = AN_SW;
  if (K.c) return K.c;
  const c = {};
  c.kv = K.hv100 / (K.dQ * K.dQ); /* m per (m3/h)^2, SWP valve open */
  /* SWBP at the 2.35 discharge with suction = node N (SNAPSHOT-TO-REPLACE, the head) */
  const PN = K.dPci + K.ki100,
    hb = (K.dPbd - PN) / K.kP,
    qb = Math.sqrt((K.bH0 - hb) / K.bA);
  c.kbv = K.hb100 / (K.bQr * K.bQr);
  c.qbD = qb;
  const Pbv = K.dPbd - K.kP * c.kbv * qb * qb;
  c.kb = Pbv / Math.pow(2 * qb, 2); /* kg/cm2 per (m3/h)^2: S-1504, CCW HX and the return of the 2 SWBP */
  const Qt = 2 * K.dQ,
    q = (Qt - 2 * qb) / 2; /* per condenser path */
  c.qcD = q;
  c.ki = K.ki100 / (q * q);
  c.kc = K.dPdc / (q * q);
  c.ko = (K.dPci - K.dPdc) / (q * q) / swVk(K.oDes); /* outlet loss at 100 % open */
  const Ph = K.kP * (K.dQ ? swH(K.dQ, 1) - c.kv * K.dQ * K.dQ - K.zD + K.dL : 0),
    dpF = (K.dp0 * Math.pow(Qt / K.f1Q, 2)) / 1e4;
  c.kup = (Ph - dpF - PN) / (Qt * Qt); /* header -> node N (pipes, NO-SOURCE elevation lumped in) */
  /* SWBP shaft power at the design point (for its current line) */
  const eb = r => swEb(K, r);
  c.bPsop = (1020 * 9.80665 * (qb / 3600) * hb) / 1000 / Math.max(0.25, eb(qb / K.bBep));
  return (K.c = c);
}
/* the SWBP branch: the flows of the running booster pumps with node N at PN */
function swBooster(PN, sb, vb, c) {
  const K = AN_SW;
  const each = Pbv => sb.map((s, i) => swPumpQ(swbH, s, c.kbv * swVk(vb[i]), (Pbv - PN) / K.kP, 2.5 * K.bQr));
  if (!sb.some(s => s > 0) || PN <= 0) return { q: sb.map(() => 0), Q: 0, Pbv: 0 };
  const Q = swBisect(x => each(c.kb * x * x).reduce((a, b) => a + b, 0) - x, 0, 3 * 2.5 * K.bQr, 40);
  return { q: each(c.kb * Q * Q), Q, Pbv: c.kb * Q * Q };
}
/* the whole network for the speeds, the valve openings, the forebay and the dirt of S-1502 */
function swSolve(st) {
  const K = AN_SW,
    c = swCal(),
    kv = st.vd.map(p => c.kv * swVk(p)),
    pathK = [0, 1].map(j => {
      const ki = c.ki * swVk(st.vi[j]),
        ko = c.ko * swVk(st.vo[j]);
      return { ki, ko, k: ki + c.kc + ko };
    });
  const supplyAt = h => st.s.map((s, i) => swPumpQ(swH, s, kv[i], h, 1.6 * K.Qr));
  const dpF = Q => (K.dp0 * Math.pow(Q / K.f1Q, 2) * (1 + st.dirt)) / 1e4;
  const r = { q: [0, 0, 0], H: [0, 0, 0], Qt: 0, Qc: [0, 0], b: { q: [0, 0, 0], Q: 0, Pbv: 0 }, Ph: 0, PN: 0 };
  if (!st.s.some(s => s > 0)) return r;
  const solveAt = Qt => {
    /* the header head that gives this total from the pumps */
    const Hh = swBisect(h => supplyAt(h).reduce((a, b) => a + b, 0) - Qt, -200, 80, 40);
    const Ph = K.kP * (Hh - K.zD + st.L),
      PN = Ph - dpF(Qt) - c.kup * Qt * Qt;
    const qc = pathK.map(p => (PN > 0 && p.k < Infinity ? Math.sqrt(PN / p.k) : 0)),
      b = swBooster(PN, st.sb, st.vb, c);
    return { Hh, Ph, PN, qc, b, dem: qc[0] + qc[1] + b.Q };
  };
  const qMax = supplyAt(-200).reduce((a, b) => a + b, 0);
  const Qt = swBisect(Q => solveAt(Q).dem - Q, 0, qMax, 36),
    z = solveAt(Qt);
  r.Qt = Qt;
  r.q = supplyAt(z.Hh);
  r.H = r.q.map((q, i) => (st.s[i] > 0 ? swH(q, st.s[i]) : 0));
  r.Ph = z.Ph;
  r.PN = z.PN;
  r.Qc = z.qc;
  r.b = z.b;
  r.pin = z.qc.map((q, j) => Math.max(0, z.PN - pathK[j].ki * q * q));
  r.pout = z.qc.map((q, j) => (pathK[j].ko < Infinity ? pathK[j].ko * q * q : Math.max(0, z.PN - pathK[j].ki * q * q)));
  r.dpF = dpF(Qt);
  return r;
}
/* the field valves of the seawater system (no DCS signal): opening in %, set by the field operator; the line-up of the start state
   (discharge valves open, condenser inlet 100 %, outlet 40 %) */
function anSeawaterStep(U, dt) {
  const K = AN_SW,
    c = swCal(),
    V = (AN_SRC.valve = AN_SRC.valve || Object.assign({}, AN_SW_V0)),
    vp = k => (isFinite(V[k]) ? V[k] : AN_SW_V0[k]),
    lag = (k, x, tau) => (U[k] = isFinite(U[k]) ? U[k] + ((x - U[k]) * Math.min(dt, tau)) / tau : x),
    sw = K.swp.map(a => srcBit([a])),
    bp = K.swbp.map(a => anDitlRun(a) || 0),
    df = K.df.map(a => {
      const r = anDitlRun(a, true);
      return r == null ? 1 : r;
    });
  /* the speed of each pump: a start ramps it (soft starter / Y-delta), a stop drops it at once (coast-down not modelled); the first
     step after a starting state takes the running pumps at full speed (no start transient at 150 MW) */
  const first = !U.swSpd;
  U.swSpd = U.swSpd || [0, 0, 0];
  U.swbSpd = U.swbSpd || [0, 0, 0];
  sw.forEach((r, i) => (U.swSpd[i] = r ? (first ? 1 : Math.min(1, U.swSpd[i] + dt / K.ramp)) : 0));
  bp.forEach((r, i) => (U.swbSpd[i] = r ? (first ? 1 : Math.min(1, U.swbSpd[i] + dt / K.bRamp)) : 0));
  U.swN = sw.reduce((a, b) => a + b, 0);
  U.swNb = bp.reduce((a, b) => a + b, 0);
  /* the forebay level K.dL (SNAPSHOT-TO-REPLACE: the head of the file) */
  U.swLvl = K.dL;
  if (!isFinite(U.swDirt1)) U.swDirt1 = 0;
  if (!isFinite(U.swDirt2)) U.swDirt2 = 0;
  const st = {
    s: U.swSpd,
    sb: U.swbSpd,
    vd: ['V-SW1002', 'V-SW1004', 'V-SW1006'].map(vp),
    vi: ['V-SW1007', 'V-SW1008'].map(vp),
    vo: ['V-SW1009', 'V-SW1010'].map(vp),
    vb: ['V-SW1016', 'V-SW1018', 'V-SW1020'].map(vp),
    L: U.swLvl,
    dirt: U.swDirt1
  };
  /* the network is solved again only when a speed, a valve, the forebay or the dirt (0.01) changed */
  const key = [
    st.s.map(x => x.toFixed(3)),
    st.sb.map(x => x.toFixed(3)),
    st.vd,
    st.vi,
    st.vo,
    st.vb,
    st.L,
    st.dirt.toFixed(2)
  ].join('|');
  if (!U._swR || U._swK !== key) {
    U._swR = swSolve(st);
    U._swK = key;
  }
  const r = U._swR;
  U.swRunout = r.q.map(q =>
    q > K.Qmax ? 1 : 0
  ); /* above the max flow of the curve (22,680 m3/h): the curve is extrapolated */
  /* flows (m3/h), for the HMI and the loop check */
  r.q.forEach((q, i) => (U['swQa' + i] = Math.round(q)));
  r.b.q.forEach((q, i) => (U['swQb' + i] = Math.round(q)));
  U.swQt = Math.round(r.Qt);
  U.swQcA = Math.round(r.Qc[0]);
  U.swQcB = Math.round(r.Qc[1]);
  U.swQc = U.swQcA + U.swQcB;
  U.swQbT = Math.round(r.b.Q);
  /* condenser water boxes (PT-SW1110-A1 / B1 in, A2 / B2 out) */
  const pin = r.pin || [0, 0],
    pout = r.pout || [0, 0];
  lag('swPiA', pin[0], K.tauP);
  lag('swPiB', pin[1], K.tauP);
  lag('swPoA', pout[0], K.tauP);
  lag('swPoB', pout[1], K.tauP);
  /* condenser seawater temperatures */
  U.swTiA = AN_SW_TIN[0];
  U.swTiB = AN_SW_TIN[1];
  /* Phase 11 (SUZU 2026-11-27): the outlet of each water box path = in + the heat that path takes from the condensing steam / (its
     water x cp): the condenser port of MEI (ports.js cd, x = {QA, QB} kW, the same water and cp, AN_CD.cp). Was a steam estimate of
     this part (main steam x 316 / 460 + LP bypass, a second copy of the condenser duty): deleted. No port yet (or no water): no rise */
  const cd = typeof anPortGet === 'function' ? anPortGet(U, 'cd') : null;
  [0, 1].forEach(j => {
    const C = ((r.Qc[j] * 1.02) / 3.6) * AN_CD.cp /* kW/K */,
      q = cd && cd.x ? +cd.x[j ? 'QB' : 'QA'] : NaN,
      rise = C > 1 && isFinite(q) ? Math.max(0, q) / C : 0;
    lag(j ? 'swToB' : 'swToA', AN_SW_TIN[j] + rise, K.tauT);
  });
  /* PG-SW1501A / B / C: the pump side of the check valve (a stopped pump: the water column of the pit, below the gauge = 0) */
  r.q.forEach((q, i) => lag('swPd' + i, U.swSpd[i] > 0 ? Math.max(0, K.kP * (r.H[i] - K.zD + U.swLvl)) : 0, K.tauP));
  /* shut-off time of a running SWP below its min flow (EBARA O&M 4.2 / 4.4: open the discharge valve within 2 minutes) */
  U.swLow = U.swLow || [0, 0, 0];
  r.q.forEach((q, i) => (U.swLow[i] = U.swSpd[i] >= 1 && q < K.Qmin ? U.swLow[i] + dt : 0));
  /* debris filters: DP (mmH2O); the dirt grows while water passes; a filter IN OPERATION (DITL-39) backwashes at 800 for 3 min */
  [
    [1, r.Qt / K.f1Q, df[0]],
    [2, r.b.Q / K.f2Q, df[1]]
  ].forEach(([i, q, op]) => {
    const d = 'swDirt' + i,
      b = 'swBw' + i;
    const cy = 'swCyc' + i,
      hi = 'swHi' + i;
    if (U[b] > 0) {
      U[b] = Math.max(0, U[b] - dt);
      U[d] = Math.max(0, U[d] - (K.dirtBw * dt) / K.bwT);
    } else U[d] += (K.dirtBw * q * q * dt) / K.dirtT;
    const dp = K.dp0 * q * q * (1 + U[d]);
    /* the filter PLC (beta.314): DP high for 30 s or the 4 h cycle timer starts a 3 min flush; the cycle timer counts from its end */
    U[hi] = op && dp >= K.dpBw && !(U[b] > 0) ? (U[hi] || 0) + dt : 0;
    U[cy] = op && !(U[b] > 0) ? (U[cy] || 0) + dt : 0;
    if (op && !(U[b] > 0) && (U[hi] >= K.hiT || U[cy] >= K.cycT)) {
      U[b] = K.bwT;
      U[hi] = 0;
      U[cy] = 0;
    }
    lag('swDp' + i, dp, K.tauP);
  });
  /* SWP motor current: 500 A while the soft starter ramps, then the load of the shaft power (motor table) */
  r.q.forEach((q, i) => {
    const s = U.swSpd[i];
    const P = s > 0 ? swInterp(K.pQ, K.pP, q / s) * s * s * s : 0;
    U['swKw' + i] = Math.round(P);
    /* Mina F15: an open breaker carries no current: stopped = 0 at once, the lag is for the start only */
    if (s <= 0) U['swIa' + i] = 0;
    else lag('swIa' + i, s < 1 ? K.Ist : swInterp(K.mL, K.mI, (100 * P) / K.mkW), K.tauI);
  });
  /* SWBP: suction (PG-SW1503x1) = node N, discharge (PG-SW1503x2) before its valve; current from its shaft power */
  r.b.q.forEach((q, i) => {
    const s = U.swbSpd[i],
      PN = Math.max(0, r.PN || 0);
    lag('swBs' + i, PN, K.tauP);
    lag('swBd' + i, s > 0 && PN > 0 ? PN + K.kP * swbH(q, s) : PN, K.tauP);
    const Pw =
      s > 0
        ? Math.max(0.4 * 50.87, (1020 * 9.80665 * (q / 3600) * swbH(q, s)) / 1000 / Math.max(0.25, swEb(K, q / K.bBep)))
        : 0; /* floor 40 % of the rated 50.87 kW at low flow: NO-SOURCE */
    const I = K.bIsop + ((K.bI100 - K.bIsop) * (Pw - c.bPsop)) / (K.bkW - c.bPsop);
    if (s <= 0) U['swIb' + i] = 0;
    else lag('swIb' + i, s < 1 ? K.bIst : Math.max(0, I), K.tauI);
  });
}
/* the field operator sets a manual valve of the seawater system (V-SW1002 ... 0 ~ 100 %); returns false for an unknown tag */
function anSwValve(tag, pct) {
  if (!(tag in AN_SW_V0) && !(tag in AN_FV0)) return false;
  AN_SRC.valve = AN_SRC.valve || Object.assign({}, AN_SW_V0);
  AN_SRC.valve[tag] = Math.max(0, Math.min(100, +pct || 0));
  return true;
}
/* 3.2.1 (IRENE: PLANT MODEL, MAKE-UP WATER; user 2026-11-04 "tama connection, flow, at plant model, at dapat may communication sya sa
   logic na ABC DITL"; replaces the fixed steps of 3.2.0-beta.63). Flow diagram K1AU3-PD-024 Rev D (+ expansion tank of PD-021 Rev D):
   demi water tanks T-0708A / B -> suction header -> MWP P-0709A / B / C (DITL-112, machine instances #B / #C) -> common header
   (PT-MU0709) -> #1 condenser hotwell (LCV-MU1110 ABC-031 / MV-MU1001 DITL-60), expansion tank T-1109 (XV-MU1109 DITL-78 / bypass
   V-MU1033), each pump's recirculation line (V-MU0013 / 15 / 17 open in the start state). Sources (docs/versions/v3.2.1/MU_CCW_PLANT_MODEL.md):
     pump curve   KAO HONG KEW-65/200 performance curve KEW102066C (K1AU3-D1-0-032 p6): rated 80 m3/h (1.34 CMM) x 60 m x 3500 rpm,
                  the head curve through the rated point (shut-off 65 m), MIN.FLOW 0.167 CMM = 10 m3/h; shaft power = the mean of the
                  170 / 192 mm BHP curves (the rated impeller lies between them: shut-off head 65 m between 57.5 and 72.2 m);
     motor        TECO AEHLWA-R 50 HP 2P 460 V (p8: FLC 58.2 A, LRC 775 % = 451 A, direct on line or Y / delta; p11 load characteristic:
                  18.6 / 32.8 / 44.7 / 58.0 / 70.1 A at 26.4 / 51.7 / 76.6 / 101.5 / 126.6 % load);
     header       PT-MU0709 = 0.1 kg/cm2 per m (water, sg 1.0, p6) x (tank level + z + pump head at the flow of each running pump);
                  AN_MU_Z = -0.20 m (Phase 11 SUZU 2026-11-27, Rule 0; was an 11.3 m FIT, NO-FIT-OK: history): the as-built
                  instrument location plan K1AU3-E2-0-102 p11 / 12 (YUA read, project file suzu-mu-elevations-2026-11-27.md) gives
                  the zero of LT-MU0708-A / B at its tap +10.200 and the body of PT-MU0709 at +10.400 (tap +11.740 on the header, the
                  impulse line full of water reads at the body): z = 10.200 - 10.400. Friction of the header at the recirculation flow
                  is left out (NO-SOURCE line loss). This gives about 7.9 kg/cm2 with 2 MWP on recirculation;
     flow         FT-MU1001 = the hotwell make-up of the cycle model (plant.js 0.58 T/H per % of LCV-MU1110 + MV-MU1001) + the expansion tank filling;
                  each running MWP also returns its recirculation 10 m3/h (p6 MIN.FLOW) to the tank;
     strainer DP  0.03 kg/cm2 while its pump runs (SNAPSHOT-TO-REPLACE: read from the plant; no strainer sheet in the docs read yet);
     demi tanks   13.8 / 13.7 m, constant (the water treatment refills them; not modelled; SNAPSHOT-TO-REPLACE: read from the plant,
                  the tank normal level of the P&ID is not read yet); LS-MU0708-A / B (alarm list 0.2 m,
                  DITL-112 rows 19 / 21) follow it (plantsw.js);
     expansion tank (as 3.2.0-beta.63 / live test #50) fills while XV-MU1109 (DITL-78 row 4) or V-MU1033 is open and the header is above
                  6 kg/cm2 (SNAPSHOT-TO-REPLACE: an operating procedure number) at 0.003 m/s (NO-SOURCE), primes the closed loop at the first opening of V-CW1001 (NO-SOURCE volume).
   Logic: DITL-112 START / trip of each MWP drives the pumps here; PT-MU0709 (< 5.5 kg/cm2 = M.2506 L.L. = standby AUTO start),
   LT-MU0708-A / B (< 0.2 m), DPT-MU0709-A / B / C (>= 1.0 kg/cm2) go back into DITL-112, LT-CW1109 into DITL-76 / 77 / 78. */
/* T/H, MV-MU1001 fully open: MB-016 item 20. Kept outside AN_MU: a save carries AN_MU (state.js AN_STATE_OBJ), and a save made
   before this number existed would take it away (NaN) */
const AN_MU_QMV = 70;
/* m, the static head of PT-MU0709 over the demi tank level: K1AU3-E2-0-102 LT-MU0708 zero +10.200 - PT-MU0709 body +10.400 (see the
   head). Kept outside AN_MU for the same reason: the st150 save carries AN_MU and would bring back the old 11.3 m fit */
const AN_MU_Z = -0.2;
const AN_MU = {
  mwp: ['DITL-112', 'DITL-112 #B', 'DITL-112 #C'],
  xv: 'DITL-78@3',
  mv: 'DITL-60',
  lv: [13.8, 13.7],
  cQ: [0, 30, 60, 80.4, 90, 105, 120, 135, 150],
  cH: [65.0, 64.7, 63.2, 60.3, 58.8, 55.5, 52.1, 47.5, 43.5],
  pQ: [0, 30, 60, 80.4, 90, 120, 150],
  pHP: [18.9, 22.7, 27.0, 29.6, 31.6, 35.4, 37.0],
  qRec: 10,
  /* Phase 11 (SUZU 2026-11-27, Rule 0; was a pCal 0.74 FIT, NO-FIT-OK: history): the shaft power is the vendor BHP curve as
     printed (about 26 A at the recirculation flow) */
  mL: [26.4, 51.7, 76.6, 101.5, 126.6],
  mI: [18.6, 32.8, 44.7, 58.0, 70.1],
  mkW: 37.3 /* 50 HP */,
  Ist: 451,
  /* beta.316 (JENNIE, Audit #5, was 2 s NO-SOURCE): direct on line run-up time from the TECO sheet (D1-0-032 p8, 50 HP 2P,
     3555 rpm, GD2 0.905 kg m2, LRT 160 %, BDT 270 %): J = GD2 / 4 = 0.226 kg m2, w = 372.3 rad/s, rated torque 37.3 kW / w = 100 N m;
     mean motor torque (LRT + BDT) / 2 = 215 N m, less the pump on its recirculation (about 30 N m at full speed, square law: mean
     1 / 3 = 10 N m) = 205 N m; t = J w / T = 0.41 s (motor rotor only: the impeller inertia is not in the docs) -> 0.5 s */
  ramp: 0.5,
  kP: 0.1,
  dp: 0.03,
  et0: 0.8,
  etMax: 2.0,
  etRate: 0.003,
  etQ: 20 /* T/H, Mass Balance K1AU3-MB-024 item 17 and MB-021 item 1 (make-up to the unit 1 expansion tank) */,
  etPrime: 0.4 /* m of tank level that the priming of the closed loop takes (NO-SOURCE) */,
  etPrimeT: 120 /* s (NO-SOURCE) */,
  etH: 1.7,
  etL: 0.8,
  etLL: 0.3,
  tauP: 3,
  tauH: 1 /* s, the header pressure: a full water line answers at once (NO-SOURCE number). DITL-112 gives the first pump only TR25 3 s to clear M.2506 before the AUTO pumps start (Mina F21) */,
  tauI: 2
};
function anMakeupStep(U, dt) {
  const K = AN_MU,
    lag = (k, x, tau) => (U[k] = isFinite(U[k]) ? U[k] + ((x - U[k]) * Math.min(dt, tau)) / tau : x),
    run = K.mwp.map(a => anDitlRun(a) || 0),
    n = run.reduce((a, b) => a + b, 0);
  const first = !U.muSpd;
  U.muSpd = U.muSpd || [0, 0, 0];
  run.forEach((r, i) => (U.muSpd[i] = r ? (first ? 1 : Math.min(1, U.muSpd[i] + dt / K.ramp)) : 0));
  U.muN = n;
  U.muLvA = K.lv[0];
  U.muLvB = K.lv[1];
  /* 3.2.1 the valve itself (the DITL-78 machine), not only its command: XV-MU1109 is spring opening (AN_AV), it opens without air */
  const xp = anDitlPos('DITL-78', 0);
  U.muXv = xp != null ? (xp > 0 ? 1 : 0) : anDitlRun(K.xv) === 1 ? 1 : 0;
  const mv = anDitlPos(K.mv);
  U.muMv = mv == null ? null : mv;
  if (!isFinite(U.etLvl)) U.etLvl = K.et0;
  /* live test 2026-10-30 #23: or through the bypass V-MU1033 of XV-MU1109 (manual, field operator) */
  U.muByp = typeof AN_SRC !== 'undefined' && AN_SRC.field && AN_SRC.field.mu1033 ? 1 : 0;
  /* the flow out of the header: the hotwell make-up and the expansion tank filling (the header pressure of the step before decides
     whether the tank fills), plus the recirculation of each running pump */
  U.muLine = anFv('V-MU1031') > 0 && anFv('V-MU1032') > 0 ? 1 : 0;
  const fill = U.muLine && (U.muXv || U.muByp) && U.muP > 6 && U.etLvl < K.etMax;
  U.muFill = fill ? 1 : 0;
  /* 3.2.1 the field valves (AN_FV0): a pump has water when a demi tank outlet (V-MU0001 / 0002) and its suction (V-MU0003 / 4 / 5) are
     open; it feeds the header through its discharge (V-MU0007 / 9 / 11) and returns its recirculation through V-MU0013 / 15 / 17; a
     running pump with no water or with both closed = no flow (shut-off power); no pump feeding = the header at its static pressure */
  const op = t => anFv(t) > 0,
    tk = op('V-MU0001') || op('V-MU0002'),
    wet = [0, 1, 2].map(i => tk && op('V-MU000' + (3 + i))),
    dis = [0, 1, 2].map(i => op('V-MU' + String(7 + 2 * i).padStart(4, '0'))),
    rec = [0, 1, 2].map(i => op('V-MU00' + (13 + 2 * i))),
    feed = U.muSpd.map((s, i) => (s > 0 && wet[i] && dis[i] ? s : 0)),
    ss = feed.reduce((a, b) => a + b, 0);
  /* MV-MU1001 (DITL-60, operator only) on the 8 inch line MU-1-024, parallel to LCV-MU1110 on the 3 inch line MU-1-025 (PD-016 zone A-7):
     70 T/H fully open = MB-016 item 20, the design flow of the line before the two branches (the only figure for it; the branch itself has
     no flow on the drawings); the flow follows the travel (NO-SOURCE: the shape of the MOV) */
  U.muMvQ = ss > 0 && U.muMv > 0 ? (AN_MU_QMV * Math.min(100, U.muMv)) / 100 : 0;
  /* the hotwell make-up is the one flow of the cycle model (FT-MU1001 used 1.8 T/H per % here while the hotwell got 0.58) */
  const hw = typeof AN_CYC !== 'undefined' && AN_CYC.flows ? Math.max(0, AN_CYC.flows('net').mu) : 0,
    qOut = ss > 0 ? hw + (fill ? K.etQ : 0) : 0,
    lv = Math.max(K.lv[0], K.lv[1]);
  /* the feeding pumps share the flow by speed (identical pumps in parallel), each with its recirculation */
  let H = 0;
  U.muQ = [0, 0, 0];
  U.muSpd.forEach((s, i) => {
    if (s > 0 && wet[i]) U.muQ[i] = (ss > 0 && feed[i] ? (qOut * s) / ss : 0) + (rec[i] ? K.qRec * s : 0);
  });
  if (ss > 0) {
    const j = feed.findIndex(s => s > 0),
      s = feed[j];
    H = s * s * swInterp(K.cQ, K.cH, U.muQ[j] / s);
  }
  U.muFeed = feed.filter(s => s > 0).length;
  lag('muP', K.kP * (lv + AN_MU_Z + Math.max(0, H)), K.tauH);
  run.forEach((r, i) => {
    const s = U.muSpd[i],
      P = s > 0 ? 0.7457 * swInterp(K.pQ, K.pHP, U.muQ[i] / s) * s * s * s : 0;
    U['muKw' + i] = Math.round(P * 10) / 10;
    if (s <= 0) U['muI' + i] = 0;
    else lag('muI' + i, s < 1 ? K.Ist : Math.max(0, swInterp(K.mL, K.mI, (100 * P) / K.mkW)), K.tauI);
    lag('muDp' + i, r && wet[i] ? K.dp : 0, K.tauP);
  });
  if (fill) U.etLvl = Math.min(K.etMax, U.etLvl + K.etRate * dt);
  /* live test #50: the expansion tank outlet valve V-CW1001 primes the closed cooling line: the first opening of V-CW1001 after a cold plant fills the closed loop
     from the tank (K.etPrime m of tank level over K.etPrimeT s, NO-SOURCE: the loop volume is not in the repository); then the level stays */
  if (!isFinite(U.cwPrime)) U.cwPrime = AN_SRC.field.cw1001 ? 1 : 0;
  if (AN_SRC.field.cw1001 && U.cwPrime < 1) {
    const d = Math.min(1 - U.cwPrime, dt / K.etPrimeT);
    U.cwPrime += d;
    U.etLvl = Math.max(0, U.etLvl - K.etPrime * d);
  }
  U.etPct = (100 * U.etLvl) / K.etMax;
  /* live test #50: the alarms of LT-CW1109 (alarm list LT: H 1700 mm (DCS), L 800 mm (DCS); LS: LSLL-CW1109 300 mm = DITL-77 row 26
     M.1238 "EXPANSION TANK LEVEL < 0.3 M", the ACWP trip). UNUSUAL: the H alarm is the normal level NL 1.7 m used here (SNAPSHOT-TO-REPLACE, AN_ACW_MB.Lv) */
  U.etAlm = U.etLvl <= K.etLL ? 'LL' : U.etLvl <= K.etL ? 'L' : U.etLvl > K.etH ? 'H' : '';
  lag('muF', qOut, K.tauP);
}
/* 3.2.1 (IRENE: PLANT MODEL, CLOSED COOLING WATER; replaces the fixed steps of 3.2.0-beta.69). Flow diagram K1AU3-PD-021 Rev D: return
   header CW-1-002 20" + expansion tank T-1109 (V-CW1001) -> suction CW-1-003 20" -> ACWP P-1108A / B (DITL-76 / 77; strainers
   DPT-CW1108-A / B) -> common discharge CW-1-007 20" (PT / TT-CW1152) -> CCWHE H-1107A / B / C (seawater of the SWBP, unit.js AN_SW) ->
   supply CW-1-014 20" (PT / TT-CW1153) -> the users (turbine oil coolers TCV-CW1201, generator air coolers, BFP, bottom ash screw
   coolers L-1060A ~ D PT / TT-CW1156 and TT-CW1060, fans, APH, air compressors and dryers, sampling) -> return. Sources
   (docs/versions/v3.2.1/MU_CCW_PLANT_MODEL.md):
     pump curve   PACO KP1415-1/2 "Pump Performance Datasheet" (K1AU3-D1-0-033 p8): rated 1500 m3/h x 50 m x 1750 rpm, impeller
                  377.44 mm curve (shut-off 67.8 m), shaft power curve (250 kW rated), MCSF 932.4 m3/h, water 991 kg/m3;
     motor        TECO AFJH-WR 300 kW 4P 6600 V (p10): FLC 32.1 A, eff 95.0 %, PF 86.0 %, soft start, LRC <= 240 A; current =
                  shaft power / (1.732 x 6.6 kV x eff x PF);
     line         Phase 11 (SUZU 2026-11-27, NO-FIT-OK: history; was one point read from the plant): the design point of
                  mass balance K1AU3-MB-021 rev 0 (A2-0-001 RA p 13, YUA PC read suzu-pc-answers-2026-11-27.md 1a), AN_ACW_MB below:
                  1500 T/H (item 5), suction 3.0 kg/cm2 G (item 5), header to the CCWHE 7.8 (item 7 = PT-CW1152), CCWHE out 7.2
                  (item 8 = PT-CW1153), bottom ash conveyor header 6.5 (item 30 = PT-CW1156); the CCWHE part 0.6 kg/cm2 (of it the
                  CCWHE 0.571 = 0.056 MPa of D1-0-041), the users and the return 4.2 kg/cm2; each a loss = k Q^2; two pumps in parallel
                  share the flow. Check: the pump curve gives 3.0 + 4.955 (50 m at 1500) = 7.96, the sheet prints 8.0 (item 6);
     strainer DP  0.27 kg/cm2 at 1500 m3/h, x (Q / 1500)^2 (SNAPSHOT-TO-REPLACE: read from the plant; no strainer sheet read yet);
     CCWHE        Hisaka (D1-0-041) per unit: ACW 750 m3/h 50 -> 34 C, seawater 1000 m3/h 30 -> 42.12 C, 13,830 kW, counter flow,
                  357.5 m2: clean UA = 13830 / LMTD 5.72 = 2418 kW/K. 2 of the 3 in service (DERIVED: MB-021 header 7 1500 = 2 x 750, MB-020 header 9 2000 = 2 x 1000; the standby is not printed;
                  ). Phase 11 (SUZU 2026-11-27): the UA in service is the sheet's design point (NO-FIT-OK: history; was 7.2 % of it, a plant
                  calibration); the sheet prints no fouling factor (YUA PC read, suzu-pc-answers-2026-11-27.md 2), so the design duty
                  13,830 kW at its LMTD is the service UA;
                  effectiveness-NTU, counter flow, with the seawater of the running SWBP (U.swQbT) shared by the units in service;
     heat load    Phase 11 (SUZU 2026-11-27, NO-FIT-OK: history, was 3,480 kW x (0.4 + 0.6 x MW / 150), a plant fit): the sum of the coolers the loop serves,
                  each from its own physics (acwLoad below, the users of mass balance K1AU3-MB-021 rev 0, A2-0-001 RA p 13);
     temperature  one node for the water of the loop, 180,000 kJ/K (about 43 m3, NO-SOURCE: the loop volume is not in the repository;
                  10 min to settle at full load, ~17 min from 40 to 60 C without seawater); no ACWP: no flow, the water goes to the
                  room temperature 30 C (NO-SOURCE) in 30 min; the bottom ash cooler outlets TT-CW1060 = the supply + 1 C while an
                  ACWP runs (NO-SOURCE, the ash heat is not modelled).
   Logic: DITL-76 / 77 START / trip drive the pumps here; PT-CW1152 (< 3.5 kg/cm2 = standby AUTO start), DPT-CW1108-A / B (> 0.8 trip),
   LT-CW1109 (< 0.3 m trip) go back into DITL-76 / 77; PT-CW1156 (DITL-41 < 3.5 / > 7 kg/cm2 annunciator), TT-CW1060 (DITL-21A) and the
   flow switches FS-CW1060 (DITL-21B, low flow) follow this model (plantsw.js). */
/* kW/K per CCWHE in service. DESIGN-SRC: Hisaka K1AU3-D1-0-041 R0: 13,830 kW counter flow, ACW 50 -> 34 C, sea water 30 -> 42.12 C:
   LMTD (7.88 - 4.00) / ln(7.88 / 4.00) = 5.72 K -> 2,418 kW/K (U 6,760 W/m2K on 357.5 m2); no fouling factor printed. Kept outside AN_ACW:
   a save carries AN_ACW (state.js AN_STATE_OBJ), so the 150 MW start state would bring back the old fitted 174.8 */
const AN_ACW_UA = 13830 / ((50 - 42.12 - (34 - 30)) / Math.log((50 - 42.12) / (34 - 30)));
/* DESIGN-SRC: MB-021 rev 0 (see the head): the design point of the line, kg/cm2 G and T/H. Kept outside AN_ACW: a save carries AN_ACW
   (state.js AN_STATE_OBJ), so a start state would bring back the old numbers. Lv: the expansion tank normal level NL 1.7 m (SNAPSHOT-TO-REPLACE:
   an operating procedure number; the sheet does not print the tank level its suction pressure goes with) */
const AN_ACW_MB = { Q: 1500, Ps: 3.0, P1: 7.8, P2: 7.2, P6: 6.5, Lv: 1.7 };
const AN_ACW = {
  acwp: ['DITL-76', 'DITL-77'],
  cQ: [0, 300, 600, 900, 1200, 1500, 1800, 2100, 2400],
  cH: [67.8, 66.7, 64.3, 60.7, 55.8, 50.0, 42.5, 34.4, 25.6],
  pP: [194, 210, 224, 238, 246, 250, 246, 235, 217],
  rho: 0.0991 /* kg/cm2 per m (991 kg/m3) */,
  kV: 6.6,
  eff: 0.95,
  pf: 0.86,
  Ist: 240,
  ramp: 10 /* s, soft starter: the ACWP starter is a Solcon HRVS-DN 140 A 6.6 kV (E1-0-131 p4, S-1A2 "M-1108A Aux. CW PUMP A 300KW"),
     the same type as the SWP: ACC. TIME 10 s, the vendor set value (O&M L23-3 manual 7.8; the plant setting sheet is not in the docs) */,
  dp: 0.27,
  hxN: 2,
  /* beta.316 (JENNIE, Audit #5, was NO-SOURCE): the open ACWP discharge valve V-CW1007 / 1009 at 1500 m3/h, the Crane TP-410 method
     of AN_SW (beta.312): discharge DN350 (D1-0-033 p6 KP14153 "DISCHARGE FLANGE DN 350"), 14" ID 336.5 mm, v 4.69 m/s, v^2/2g 1.12 m;
     fT 0.0127; throttled at the pump start, a butterfly 10 ~ 14" 35 fT = 0.445 -> 0.50 m x 0.0991 = 0.049 kg/cm2. The check
     valve V-CW1006 / 1008 is not modelled (its type is not in the docs) */
  kd100: 0.05,
  M: 180000,
  Tamb: 30,
  tauP: 3,
  tauI: 2,
  tauA: 1800
};
/* the line constants from the design point (kg/cm2 per (m3/h)^2) */
const acwCal = (() => {
  let c = null;
  return () => {
    if (c) return c;
    const K = AN_ACW,
      D = AN_ACW_MB,
      Q2 = D.Q * D.Q;
    c = { z: D.Ps - K.rho * D.Lv, kA: (D.P1 - D.P2) / Q2, kU: (D.P2 - D.Ps) / Q2, k6: (D.P2 - D.P6) / Q2 };
    return c;
  };
})();
/* the flow of the loop with the pumps at speeds s[] (0 = stopped): sum of the pump flows at the head the line needs */
function acwSolve(s, kv, kA) {
  const K = AN_ACW,
    c = acwCal(),
    k = (kA == null ? c.kA : kA) + c.kU,
    qOf = (si, dp, i) => {
      const v = (kv && kv[i]) || 0;
      if (!(si > 0) || !(v < Infinity) || K.rho * si * si * K.cH[0] <= dp) return 0;
      return swBisect(
        q => K.rho * si * si * swInterp(K.cQ, K.cH, q / si) - v * q * q - dp,
        0,
        1.6 * K.cQ[K.cQ.length - 1] * si,
        40
      );
    };
  if (!s.some(x => x > 0) || !(k < Infinity)) return { Q: 0, q: s.map(() => 0) };
  const Q = swBisect(
    x => s.reduce((a, si, i) => a + qOf(si, k * x * x, i), 0) - x,
    0,
    2 * 1.6 * K.cQ[K.cQ.length - 1],
    40
  );
  return { Q, q: s.map((si, i) => qOf(si, k * Q * Q, i)) };
}
/* Phase 11 (SUZU 2026-11-27): the heat the closed cooling water takes from its users, kW, each from its own cause (no load key).
   DESIGN-SRC: mass balance K1AU3-MB-021 rev 0 (A2-0-001 RA p 13, YUA PC read suzu-pc-answers-2026-11-27.md 1a / 1b): design duty =
   flow T/H x 1.1628 kW per T/H K x (out - in).
     coolers whose loss does not change with the plant load (bearings, a motor at its fixed speed, fan oil): the design duty while
       that machine runs: BFP set (motor cooler + pump + oil cooler) 39.6 T/H 34 -> 43 = 414 kW each (items 22 / 23); ID fan oil
       cooler + bearings 59 T/H 34 -> 43 = 617 kW (items 35 / 41) and the GAH 0.3 T/H 34 -> 43 = 3 kW (items 59 / 60, the air heater
       turns with the ID fan); SA fan bearings 6 T/H 34 -> 37 = 21 kW (34 / 40); PA fan oil cooler 2 T/H 34 -> 37 = 7 kW (34-1 / 40-1);
       air dryers IA 6 T/H 34 -> 40 = 42 kW, PA 18 T/H 34 -> 40 = 126 kW each (48-4 ~ 6 / 52-4 ~ 6);
     air compressors: the heat of compression leaves in the cooling water, so the duty = the shaft power of each running compressor
       (anAirStep U.iaKw / U.paKw). The MB-021 sizing (29 / 80 T/H 34 -> 43 = 304 / 837 kW) is above that shaft power (176 / 600 kW)
       and is not used;
     sampling rack: fixed sample flows (items 24 / 25, 30.5 T/H 34 -> 43 = 319 kW at the design drum, FHI P2S7 design data SH outlet
       129 + SH drop 16 = 145 kg/cm2 G) x (sample saturation - supply) / (Tsat(145) - 34): the heat goes with the sample temperature;
     turbine lube oil cooler: what anLubeCoolStep removes (U.loQ); bottom ash screw coolers: what anBacStep removes (U.bacQ);
     generator air coolers (items 14 ~ 21, 3,041 kW design) and any other part's cooler: the port q.ccw.<part> that part writes
       (YUI: the generator losses, stator 3 I^2 Ra + field I^2 Rf + the rest at speed, 3,041 kW at the rating).
   The values of the step before (the users step after the loop), a one-scan lag. */
const AN_CCWQ = { bfp: 414, idf: 617, gah: 3, saf: 21, paf: 7, iaD: 42, paD: 126, smp: 319, Pd: 145, Td: 34 };
function acwLoad(U) {
  const K = AN_CCWQ,
    bit = a => (typeof srcBit === 'function' && srcBit([a]) > 0.5 ? 1 : 0),
    idf = bit('M.3304'),
    sum = (k, n) => {
      let q = 0;
      for (let i = 0; i < n; i++) q += +U[k + i] || 0;
      return q;
    },
    Tsat = isFinite(U.Pd) && typeof steamTsat === 'function' ? steamTsat(Math.max(0, U.Pd)) : 0,
    Tw = isFinite(U.acT2) ? U.acT2 : K.Td,
    smp = (K.smp * Math.max(0, Tsat - Tw)) / (steamTsat(K.Pd) - K.Td);
  /* the coolers of the other parts: each writes its own duty as the port q.ccw.<part> (ports.js ccw.q); a port not written adds nothing */
  let ports = 0;
  for (const id in U.pt || {}) if (/^q\.ccw\./.test(id)) ports += Math.max(0, +U.pt[id].Q || 0);
  const q = {
    bfp: K.bfp * (U.fwRun || []).reduce((a, r) => a + (r ? 1 : 0), 0),
    fans: (K.idf + K.gah) * idf + K.saf * bit('M.3303') + K.paf * bit('M.3302'),
    air: sum('iaKw', 3) + sum('paKw', 3) + K.iaD * sum('iaD', 3) + K.paD * sum('paD', 3),
    smp,
    lo: Math.max(0, +U.loQ || 0),
    bac: Math.max(0, +U.bacQ || 0),
    ports
  };
  U.acLoad = q;
  const Q = q.bfp + q.fans + q.air + q.smp + q.lo + q.bac + q.ports;
  if (typeof anPortSet === 'function') anPortSet(U, 'ccw.q', { Q });
  return Q;
}
function anAcwStep(U, dt) {
  const K = AN_ACW,
    c = acwCal(),
    lag = (k, x, tau) => (U[k] = isFinite(U[k]) ? U[k] + ((x - U[k]) * Math.min(dt, tau)) / tau : x),
    run = K.acwp.map(a => anDitlRun(a) || 0),
    n = run.reduce((a, b) => a + b, 0),
    lv = isFinite(U.etLvl) ? U.etLvl : AN_ACW_MB.Lv,
    stat = c.z + K.rho * lv;
  const first = !U.acSpd;
  U.acSpd = U.acSpd || [0, 0];
  run.forEach((r, i) => (U.acSpd[i] = r ? (first ? 1 : Math.min(1, U.acSpd[i] + dt / K.ramp)) : 0));
  U.acN = n;
  /* 3.2.1 the field valves (AN_FV0): a closed suction = the pump has no water (no flow); the discharge throttles its pump (loss = loss
     at 100 % / opening^4, as the seawater valves; closed = no flow); the CCWHE in service = inlet and outlet open, the CCWHE part of
     the line (0.571 of the 1.2 kg/cm2 at 1500 m3/h, D1-0-041) shared by them (none = the loop blocked) */
  const op = t => Math.max(0, Math.min(100, anFv(t))) / 100,
    suc = [op('V-CW1002'), op('V-CW1004')],
    dis = [op('V-CW1007'), op('V-CW1009')],
    hxo = [0, 1, 2].map(i => Math.min(op('V-CW' + (1010 + i)), op('V-CW' + (1013 + i)))),
    nHx = hxo.reduce((a, o) => a + (o > 0 ? 1 : 0), 0),
    fx = 0.571 / 1.2,
    sc = hxo.reduce((a, o) => a + o * o, 0) /* parallel paths: flow area ~ opening^2 */,
    kA = nHx ? c.kA * (1 - fx + fx * Math.pow(K.hxN / sc, 2)) : Infinity,
    kv = dis.map(o =>
      o > 0 ? (K.kd100 / (AN_ACW_MB.Q * AN_ACW_MB.Q)) * (1 / Math.pow(o, 4) - 1) : Infinity
    ) /* 100 % = the open valve (kd100) */,
    sp = U.acSpd.map((x, i) => (suc[i] > 0 ? x : 0));
  U.acHxN = nHx;
  const key = sp.map(x => x.toFixed(3)).join(',') + '|' + dis.join(',') + '|' + hxo.join(',');
  if (!U._acR || U._acK !== key) {
    U._acR = acwSolve(sp, kv, kA);
    U._acK = key;
  }
  const r = U._acR,
    Q = r.Q;
  U.acQ = Math.round(Q);
  /* no CCWHE in service: the pumps run against the closed valves (shut-off head at PT-CW1152) */
  const shut = Math.max(0, ...sp.map((x, i) => (x > 0 && dis[i] > 0 ? K.rho * x * x * K.cH[0] : 0)));
  lag('acP1', nHx ? stat + (kA + c.kU) * Q * Q : stat + shut, K.tauP);
  lag('acP2', stat + c.kU * Q * Q, K.tauP);
  U.acP6 = U.acP2 - c.k6 * Q * Q; /* PT-CW1156, the bottom ash conveyor header (MB-021 item 30) */
  r.q.forEach((q, i) => {
    const s = U.acSpd[i],
      P = s > 0 ? swInterp(K.cQ, K.pP, q / s) * s * s * s : 0;
    U['acKw' + i] = Math.round(P);
    lag('acDp' + i, s > 0 ? K.dp * Math.pow(q / AN_ACW_MB.Q, 2) : 0, K.tauP);
    if (s <= 0) U['acI' + i] = 0;
    else lag('acI' + i, s < 1 ? K.Ist : (1000 * P) / (1732.05 * K.kV * K.eff * K.pf), K.tauI);
  });
  /* heat: the users, the CCWHE (effectiveness-NTU, counter flow) with the seawater of the running SWBP */
  const Tsw =
      AN_SW_TIN[0] /* the sea water of the SWBP: the intake, MB-020 items 7 ~ 10 30 C (= the condenser inlet) */,
    Qload = acwLoad(U),
    Ch = (Q * 991 * 4.18) / 3600 /* kW/K */,
    Qsw = Math.max(0, U.swQbT || 0),
    Cc = (Qsw * 1025 * 3.99) / 3600;
  let hx = 0;
  if (Ch > 0 && Cc > 0) {
    const ch = Ch / Math.max(1, nHx),
      cc = Cc / Math.max(1, nHx),
      cmin = Math.min(ch, cc),
      cr = cmin / Math.max(ch, cc),
      ntu = AN_ACW_UA / cmin,
      e = cr < 0.999 ? (1 - Math.exp(-ntu * (1 - cr))) / (1 - cr * Math.exp(-ntu * (1 - cr))) : ntu / (1 + ntu);
    hx = e * cmin * nHx; /* kW per K of (return - seawater) */
  }
  U.acCool = n && hx > 0 ? 1 : 0;
  if (Ch > 0) {
    /* the return (pump discharge, TT-CW1152) is the node; the first step after a starting state starts at its steady value */
    if (first || !isFinite(U.acT1))
      U.acT1 =
        hx > 0 && Q > 0.5 * AN_ACW_MB.Q
          ? Tsw + Qload / hx
          : Math.min(60, K.Tamb + 10); /* 3.2.1: a throttled first step does not start hot */
    U.acT1 += ((Qload - hx * (U.acT1 - Tsw)) * dt) / K.M;
    U.acT1 = Math.max(Tsw, Math.min(99, U.acT1));
    U.acT2 = U.acT1 - (hx * (U.acT1 - Tsw)) / Ch;
    U.acHx = Math.round(hx * (U.acT1 - Tsw));
  } else {
    if (!isFinite(U.acT1)) U.acT1 = K.Tamb;
    if (!isFinite(U.acT2)) U.acT2 = K.Tamb;
    lag('acT1', K.Tamb, K.tauA);
    lag('acT2', K.Tamb, K.tauA);
    U.acHx = 0;
  }
  U.acT6 = U.acT2;
  /* the closed cooling water supply the users of the other parts read (ports.js ccw): T/H and C */
  if (typeof anPortSet === 'function') anPortSet(U, 'ccw', { m: (Q * 991) / 1000, T: U.acT2 });
  U.acTb = n ? U.acT2 + 1 : U.acT2;
  anBacStep(U, dt);
  anSuzuMotorPort(U);
}
/* Phase 11 (SUZU 2026-11-28, YUI house load): the electrical input of the SUZU 6.6 kV motors of BUS 1AM, the port q.motor.SUZU
   {P kW, Q kvar} that YUI's elec.js sums (ports.js aux.power). Each running motor: P = shaft kW / eff, Q = P x tan(acos pf).
     SWP A / B / C   shaft U.swKw (pump curve D1-0-064 p6); TECO 2050 kW motor table D1-0-064 p26 (YUA yui-reads-4.md): eff 95.0 /
                     95.7 / 95.8 %, pf 0.52 / 0.65 / 0.72 at 50 / 75 / 100 % load (check: 2050 / 0.958 / (1.732 x 6.6 x 0.72) = 260 A
                     = the table). Outside 50 ~ 100 % the end value is held (DERIVED: the table prints no eff / pf there).
     ACWP A / B      shaft U.acKw (pump curve D1-0-033 p8); TECO 300 kW motor D1-0-033 p10: eff 95.0 %, pf 0.86 (AN_ACW.eff / pf, the
                     100 % point only: held at every load, DERIVED).
     PA comp. A ~ C  shaft U.paKw (anAirStep); TECO 671 kW motor D1-0-059 p7: eff 95.5 %, pf 0.88 (100 % point only, held; check: 671 /
                     0.955 / (1.732 x 6.6 x 0.88) = 69.8 A = AN_AIR.sys.pa.I100 69.9).
   The instrument air compressors are 460 V (AN_EL.lv), not in this port. Kept outside AN_SW / AN_AIR: a save carries those. */
const AN_MOT_SW = { L: [50, 75, 100], eff: [0.95, 0.957, 0.958], pf: [0.52, 0.65, 0.72] };
const AN_MOT_PA = { eff: 0.955, pf: 0.88 };
function anSuzuMotorPort(U) {
  if (typeof anPortSet !== 'function') return;
  let P = 0,
    Q = 0;
  const add = (kw, e, pf) => {
    if (!(kw > 0)) return;
    const p = kw / e;
    P += p;
    Q += p * Math.tan(Math.acos(pf));
  };
  for (let i = 0; i < 3; i++) {
    const kw = +U['swKw' + i] || 0,
      l = Math.min(100, Math.max(50, (100 * kw) / AN_SW.mkW));
    add(kw, swInterp(AN_MOT_SW.L, AN_MOT_SW.eff, l), swInterp(AN_MOT_SW.L, AN_MOT_SW.pf, l));
  }
  for (let i = 0; i < 2; i++) add(+U['acKw' + i] || 0, AN_ACW.eff, AN_ACW.pf);
  for (let i = 0; i < 3; i++) add(+U['paKw' + i] || 0, AN_MOT_PA.eff, AN_MOT_PA.pf);
  anPortSet(U, 'q.motor.SUZU', { P, Q });
}
/* 3.2.4-beta.71 (JENNIE, for the ESP AND ASH page: TT-BH1060 / TT-CW1060 were '-----', no model). The bottom ash screw coolers
   L-1060A ~ D (DITL-21A / #B / #C / #D): bed drain ash in, cooled ash out to the chain conveyor; closed cooling water (supply TT-CW1156
   = AN_ACW acT6) through the shell and the shaft. Source: Rauma "Technical specification" E130122B (O&M V13 Bottom ash screw cooler,
   01_Technical Specification/3094): ash 2000 kg/h normal, 4000 kg/h max at 0.5 ~ 5 rpm; ash in max 920 C, out < 150 C normal,
   about 250 C at max; cooling water in max 33 C, out about 60 C, 3 kg/s normal, 5.5 kg/s max; K 57 W/m2K.
     UA      from the max case: Q = 4000 / 3600 x 0.84 x (920 - 250) = 625 kW; water 5.5 kg/s 33 -> 60 C; counter flow LMTD
             (860, 217) = 466 K -> UA = 1.34 kW/K per cooler. Check at the normal case (2000 kg/h, 3 kg/s, 33 C): ash out 89 C < 150 OK.
     ash     the flow of the bed drain step (AN_BI.q 0.8 T/H per rpm, the SIC-L1060x speed) while the cooler runs; in = the bed
             temperature, at most the 920 C of the spec; cp 0.84 kJ/kgK (NO-SOURCE, textbook value of ash).
     water   3 kg/s per cooler (spec normal) while an ACWP gives flow (x acQ / the MB-021 design 1500 T/H); in = the supply of the loop (TT-CW1156).
     stopped no ash: no heat; the water outlets go to the supply, the ash thermocouples cool to the water in. tau 120 s running, 1800 s
             stopped (NO-SOURCE: the metal mass is not in the spec).
   TT-BH1060-x1 / x2 = ash in / out (DITL-21A rows 11 / 12 INLET / OUTLET ASH TEMP.); TT-CW1060-x1 / x2 = the SHELL SIDE OUTLET /
   SHAFT COOLING water temperatures (DITL-21A rows 14 / 13, also fed from here by plantsw.js): both outlets, one water outlet
   temperature for both (NO-SOURCE: the shell / shaft split of the 3 kg/s is not in the spec); the inlet is TT-CW1156. LT-BH1750 bottom ash silo T-1090: Phase 11 (SUZU 2026-11-27, was a fixed 15.8 %, NO-FIT-OK: history) a mass balance, AN_BAS. */
const AN_BAC = { UA: 1.34, cpA: 0.84, mw: 3, Tmax: 920, tauR: 120, tauS: 1800 };
/* the bottom ash silo T-1090 (LT-BH1750, IO list STN103 AI0386 0 ~ 100 %). In: the ash of the running screw coolers while the chain
   conveyor L-1090 runs (DITL-BA68, U.baConv) and the two-way L-1094 is to the silo (closed, U.ba.tw 0; open = to the vibrating screens).
   Out: the unloading to the trucks is local (no DCS signal), none here. V 200 m3: JAT layout 130225A-LAYOUT-01 rev 0 equipment table
   item 7 (YUA PC read, project file suzu-leftovers-doc-reads.md 3a: the first digit is a doubtful scan, 200 or 700). rho 1,000 kg/m3:
   NO-SOURCE (no bulk density of the bottom ash in L6 / L13 / the DITL logic). The level of the start state is the state */
const AN_BAS = { V: 200, rho: 1000 };
function anBacStep(U, dt) {
  const K = AN_BAC,
    Tw = isFinite(U.acT6) ? U.acT6 : 30,
    fw = Math.max(0, Math.min(1, (+U.acQ || 0) / AN_ACW_MB.Q)),
    Tb = isFinite(U.Tb) ? U.Tb : 30;
  let bacQ = 0,
    toSilo = 0;
  'ABCD'.split('').forEach((x, i) => {
    const o = (U.bedSc || [])[i],
      run = typeof anDitlRun === 'function' && anDitlRun(i ? 'DITL-21A #' + x : 'DITL-21A') === 1,
      rpm = run && o && o.S ? Math.max(0, Math.min(5, +o.S.rt.v[o.n] || 0)) : 0,
      ma = (AN_BI.q * rpm) / 3.6 /* kg/s */,
      Ch = ma * K.cpA,
      Cc = K.mw * fw * 4.18,
      Ti = Math.min(K.Tmax, Math.max(Tw, Tb));
    let a1 = Tw,
      a2 = Tw,
      w2 = Tw,
      tau = K.tauS;
    if (Ch > 0) {
      a1 = Ti;
      if (Cc > 0) {
        const cmin = Math.min(Ch, Cc),
          cr = cmin / Math.max(Ch, Cc),
          ntu = K.UA / cmin,
          e = cr < 0.999 ? (1 - Math.exp(-ntu * (1 - cr))) / (1 - cr * Math.exp(-ntu * (1 - cr))) : ntu / (1 + ntu),
          q = e * cmin * (Ti - Tw);
        a2 = Ti - q / Ch;
        w2 = Tw + q / Cc;
        bacQ += q;
      } else {
        a2 = Ti; /* no cooling water flow: no heat taken, the ash leaves hot */
      }
      tau = K.tauR;
    }
    /* the water side, screw stopped: while the loop gives flow, the water passes through with no heat put in it (3 kg/s through the
       shell, seconds), so the outlets are the supply; no flow: it stands with the metal (tauS) */
    if (U.baConv && U.ba && !(U.ba.tw > 0)) toSilo += ma; /* kg/s to the silo (AN_BAS) */
    const f = Math.min(1, dt / tau),
      fW = Ch > 0 ? f : fw > 0 ? 1 : f,
      L = (k, v, g) => (U[k] = isFinite(U[k]) ? U[k] + (v - U[k]) * g : v);
    L('bh' + x + '1', a1, f);
    L('bh' + x + '2', a2, f);
    L('bw' + x + '1', w2, fW);
    L('bw' + x + '2', w2, fW);
  });
  U.bacQ = bacQ; /* kW to the closed cooling water (acwLoad) */
  if (!isFinite(U.bhSilo)) U.bhSilo = 0;
  U.bhSilo = Math.max(0, Math.min(100, U.bhSilo + (100 * toSilo * dt) / (AN_BAS.rho * AN_BAS.V)));
}
