/* 3.2.0-beta.38 (CHECKLIST 0.6, user 2026-10-25: "wala ka pang turbine model at TCS"): the TURBINE AUXILIARIES and the ATS (AUTOMATIC
   TURBINE START-UP) of the TCS, from the drawings of the repository:
   - ATS Sequence 310SC90-775 (MHPS 2015-05-29): page 12 START-UP MODE SELECT, 13 HP TURBINE WARMING, 14 ~ 16 TURBINE PREPARATION (CV
     chest warming), 17 ~ 18 RUB CHECK, 19 ~ 22 ACCELERATION (heat soak timers Fig. 1 / 2, critical zone), 23 EXCITATION, 24 ~ 25
     SYNCH. & INITIAL LOAD (Fig. 3 hold timer, initial load 3 % / 5 %), 26 ~ 27 LOAD UP (ICV -> CV transfer), 28 NORMAL OPERATION
   - ATS Criteria 310SC90-776: page 3 criteria table (step-in A, step criteria B, step-out D), page 5 ~ 14 criteria list, page 21 Fig.
     2 / 3 allowable steam - metal temperature (MSV inlet vs HP first stage inner wall, CRV inlet vs reheat bowl inner wall)
   - the TG Operation Manual STIE-14747 (design document of the vendor): rub check 200 r/min (p.40), critical speeds (p.42), LP exhaust
     hood < 80 C before sync (p.43) and < 52 C before load up (p.45); aux steam minimum 7.0 kg/cm2g (p.32)
   Table of the criteria against the app: docs/tcs/ATS_CRITERIA.md. Every number is from the TCS logic (TCE / TCA, IBD, the HIACS
   backup) or a design document (user rule 2026-11-28: design data and TCS logic are the only sources of the model); the HP / IP
   metal time constants are CALC from the TCS thermal stress rotor model (TCA752 ~ 757) and the start-up modes by the time since shutdown
   (FHI SECT_7, STIE-14811 p147), see tauMetal / tauCool.
   The state is AN_UNIT.tc; the operator acts on the TCS panel with AN.turbine(cmd) (unit.js anTurbine). */
const TCS = {
  /* start-up mode judgement on the lower of the reheat bowl and the HP first stage inner wall metal temperatures (page 12). The
     judgement temperatures are in the IBD; taken from the break points of the heat soak timers (310SC90-775 Fig. 1 / 2: 150 / 170 /
     230 / 420 C), the soak minutes per mode below are read from the same figures */
  modes: [
    ['amb', 150, 'AMBIENT COLD'],
    ['c1', 170, 'COLD 1'],
    ['c2', 230, 'COLD 2'],
    ['warm', 420, 'WARM'],
    ['hot', 1e9, 'HOT']
  ],
  rate: { amb: 120, c1: 120, c2: 120, warm: 180, hot: 360 } /* rpm/min, page 19 *2 */,
  soak1800: { amb: 88, c1: 58, c2: 30, warm: 0, hot: 0 } /* min, page 20 Fig. 1 */,
  soak3600: { amb: 86, c1: 56, c2: 27, warm: 23, hot: 3 } /* min, page 22 Fig. 2 */,
  init: { amb: 3, c1: 3, c2: 3, warm: 3, hot: 5 } /* % of 150 MW, page 25 *2 */,
  hold: m =>
    m === 'amb' || m === 'c1' || m === 'c2'
      ? 40
      : m === 'warm'
        ? 15
        : 0 /* min, page 25 Fig. 3 (40 below 230 C, 15 to 420 C) */,
  /* rolling steam of each start-up mode [MS kg/cm2g, MS C, RH kg/cm2g, RH C] = the set points of the ATS criteria 1.3 ~ 1.6 on the TCS
     drawings (TCS.cri below, TCA536 / TCA532): ambient / cold 1 / cold 2 use the COLD set (neither HOT MODE nor WARM MODE, ASW 039 / 040
     / 044 / 045 off). For the Training guide of a restart (ats.steam); the criteria themselves read TCS.cri. */
  steam: {
    amb: [58.12, 304, 7.14, 201],
    c1: [58.12, 304, 7.14, 201],
    c2: [58.12, 304, 7.14, 201],
    warm: [78.01, 323, 7.14, 201],
    hot: [107.38, 345, 7.14, 201]
  },
  /* the set points of the ATS criteria 1.3 ~ 1.6 on the TCS drawings (331DM09788): TCA536 CRI 1.3 MAIN STEAM PRESS. NOT LOW = CPL A003 against SG 037 / 038 / 041
     K 105.3 / 76.5 / 57.0 barg by HOT MODE / WARM MODE (ASW 039 / 040), CRI 1.4 MAIN STEAM TEMP. NOT LOW = CPL A007 against SG 042 / 043 /
     046 K 345 / 323 / 304 C (ASW 044 / 045); TCA532 CRI 1.5 REHEAT STEAM PRESS. NOT LOW = CPL A003 HL / LL 7.0 barg, CRI 1.6 REHEAT STEAM
     TEMP. NOT LOW = CPL A007 HL / LL 201.0 C. barg in kg/cm2 g: x 1.01972 (1 bar = 1.01972 kg/cm2) */
  cri: { cold: [58.12, 304, 7.14, 201], warm: [78.01, 323, 7.14, 201], hot: [107.38, 345, 7.14, 201] },
  /* Fig. 2 / 3 (776 page 21): allowable steam temperature against the metal temperature; the allowable band is upper limit to target (776 page 5) */
  fig2: {
    up: [
      [0, 420],
      [180, 420],
      [314, 538],
      [538, 538]
    ],
    tg: [
      [0, 380],
      [407, 380],
      [538, 471]
    ]
  },
  fig3: {
    up: [
      [0, 425],
      [251, 425],
      [366, 538],
      [538, 538]
    ],
    tg: [
      [0, 395],
      [425, 395],
      [496, 465],
      [538, 465]
    ]
  },
  rub: 200 /* rpm, the rub check target 200 r/min at 120 r/min/min, go on when the coast is below 100 r/min: MHPS Operation Manual STIE-14747 Rev 0 6/12 item 3 (TG 2-1-1 p.40); the ATS sheets 310SC90-775 p.17 / 776 p.18 leave the number blank */,
  crit: [1372, 1723] /* rpm, critical speed zone, no hold: TCS logic TCE164 TARGET SPEED HOLD MR A023 / A025 1372 ~ 1723 rpm (331DM09784 p.115) */,
  /* 1.0.0-beta.238 CALC from the TCS thermal stress logic (TCA752 / TCA753 HP, TCA756 / TCA757 IP, 331DM09788 pages 182 ~ 183 and
     186 ~ 187): the vendor's rotor model is five rings, surface ring 1 to centre ring 5, DISTRIBUTION blocks LMA627 with the heat
     capacities HA1 ~ HA5 (HP 638.306 / 496.208 / 354.435 / 212.667 / 70.8869 = 70.887 x 9 / 7 / 5 / 3 / 1, the ring areas of a
     cylinder) and the conductances HB1 ~ HB5 (HP 2.61251 / 1.1 / 0.825 / 0.55 / 0.275 = 0.275 x the ring radius; HB1 the steam side).
     dT(i)/dt = (HB(i) (T(i-1) - T(i)) - HB(i+1) (T(i) - T(i+1))) / HA(i), T(0) = the steam. HA / HB = 257.8 s = dr^2 / 2 alpha, so with
     the steel diffusivity 7e-6 m2/s a ring is 60 mm and the rotor 0.30 m in radius (a physical HP rotor, so the time unit is the second).
     A step of the steam takes the heat-capacity mean of the five rings to 63 % in 1528 s (HP) and 2332 s (IP, HA 676.918 ... 75.2132,
     HB 1.37501 ... 0.275), integrated at 1 s (scratchpad rotor.cjs). These replace the NO-SOURCE 2400 s of before */
  tauMetal: 1528 /* s, HP first stage inner wall metal toward the main steam while steam flows (TCA752 / TCA753 rotor mean, above) */,
  tauMetalIp: 2332 /* s, reheat bowl inner wall metal toward the reheat steam while steam flows (TCA756 / TCA757 rotor mean, above) */,
  /* 3.2.3-beta.67 CALC: HP prewarming (step 0). STIE-14747 p35 ~ 36: prewarm with the HP shell at 4.0 ~ 5.0 kg/cm2 g; condensing steam,
     so the metal goes toward the saturation (steam table, anTsatA: 157.8 C at 5.0 kg/cm2 g). STIE-14811 p147 Fig. 1.1 prewarming hold
     3.8 h from 0 C, about 2.5 h from 95 C, about 1.75 h from 125 C, 0 h at 150 C (the end, IBD TE-1 comparator 150 C). First order:
     t = tau x ln((Ts - T0) / (Ts - 150)) gives tau 4540 / 4303 / 4372 s at 5.0 kg/cm2 g (mean 4405); at 4.0 kg/cm2 g the three
     disagree (2679 / 2188 / 1883 s), so 5.0 kg/cm2 g is the pressure that fits the chart */
  tauWarm: 4400,
  pWarm: 5.0 /* kg/cm2 g, STIE-14747 p35 ~ 36 upper value, see tauWarm */,
  tauChest: 900 /* s, CV chest inner wall toward the main steam in chest warming */,
  tauChestO: 1500 /* s, CV chest outer wall toward the inner wall */,
  /* 3.2.3-beta.75 CALC (user: reverse engineer, no ASSUMED): turbine metal cooling with no steam. The start-up modes of the plant by
     the time since shutdown, FHI SECT_7 Fig. 3 / 4 (warm start-up after an 8 to 56 hour shutdown, hot under 8 hours), are the turbine
     modes by metal temperature, STIE-14811 p147 Fig. 1.4 (Hot above 420 C, Warm 230 ~ 420 C). First order toward the ambient 30 C:
     (420 - 30) / (230 - 30) = exp((56 - 8) h / tau), tau = 48 h / ln(1.95) = 71.9 h = 258,900 s (the metal at the trip then fits
     30 + 390 x exp(8 / 71.9) = 466 C). Before 72,000 s (20 h, NO-SOURCE): a turbine was Warm after about 3 h */
  tauCool: 258900,
  tauX: 600 /* s, LP exhaust hood */,
  names: [
    'HP TURBINE WARMING',
    'TURBINE PREPARATION',
    'TURBINE RUB CHECK',
    'ACCELERATION',
    'EXCITATION',
    'SYNCH. & INITIAL LOAD',
    'LOAD UP',
    'NORMAL OPERATION'
  ]
};
const tcsLin = (pts, x) => {
  if (x <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++)
    if (x <= pts[i][0]) {
      const [x0, y0] = pts[i - 1],
        [x1, y1] = pts[i];
      return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
    }
  return pts[pts.length - 1][1];
};
/* P2 #13: a push button row of a DITL MOV pressed from the TCS panel (row of the drawing, 1-based; no one world: nothing) */
function tcsDitl(L) {
  try {
    /* the press in the engine (src/world/dock-eng.js; the page dock in a page without it) */
    const P =
      window.WORLD && WORLD.dpress
        ? (nm, r) => WORLD.dpress(nm, r)
        : window.LS_OP && LS_OP.dpress
          ? (nm, r) => LS_OP.dpress(nm, r)
          : null;
    if (P) for (const [nm, r] of L) P(nm, r - 1);
  } catch (e) {}
}
/* the turbine state: cold (Start cold: everything stopped, metal at the ambient) or in service (Start at 150 MW) */
function tcsInit(U, how) {
  const T = U.Tamb || 30;
  const svc = how !== 'cold';
  /* 'cold': all stopped, metal at the ambient; 'load': on the grid */
  const hot = how === 'load' ? 480 : T;
  U.tc = {
    lop: svc /* a main oil pump MOP running (= mop[0] || mop[1], tcsOilSet): lube oil (1.15 / 1.16 with the bearing oil, see brgOk) */,
    eh: svc /* a control oil pump COP running (= cop[0] || cop[1]): control oil pressure (1.14) */,
    /* 3.2.0-beta.66 (036 TURBINE OIL HMI): the pumps one by one, as the TCS I/O list (HMI_DI: 1P1922A / B, 1P1931A / B RUNNING, AUTO,
       MANUAL; 1P1923 EOP; 1F1937 vapour extractor). In service: A running, B standby in AUTO, the standby start of the TCS logic
       (TCE300 / TCE305: the pump in AUTO starts on the low discharge of the running one) */
    mop: [svc, false],
    mopAu: [false, svc],
    cop: [svc, false],
    copAu: [false, svc],
    eop: false,
    eopAu: svc /* the EOP in AUTO (TCE310 MOTOR STANDARD; it starts in MANUAL at a new controller) */,
    brgOk: svc,
    vex: svc /* main oil tank vapour extractor (1.18) */,
    tg: svc && how !== 'load' /* turning gear selected (1.19); the gear engages below 4 rpm */,
    asv: svc /* MV-AS1391 aux steam from the main steam */,
    Pa: svc ? 10 : 0 /* aux steam header, kg/cm2 G (PIAS1004) */,
    gland: svc /* gland steam seal in service (1.10) */,
    vb: !svc /* vacuum breaker MV-AV1391 open */,
    ej: svc /* ejectors (vacuum up) */,
    hspAu: svc /* LP exhaust hood spray FV-CD1904 in AUTO (IBD TC-35 FF 1) */,
    hso: false /* FV-CD1904 open (IBD TC-35 FF 15) */,
    tgAu: false /* turning gear motor AUTO (IBD TB-9 FF 17); MANUAL at a new state */,
    ssfv: svc /* steam seal feed inlet valve open (IBD TC-31): PV-GS1031 in service */,
    ssfvAu: false,
    gse: svc /* gland steam exhauster running (IBD TC-28 FF 1) */,
    gseAu: false,
    Thp: hot /* HP first stage inner wall metal, C */,
    Trh: hot /* reheat bowl inner wall metal, C */,
    Tcvi: hot,
    Tcvo: hot,
    Tx: svc ? 45 : T /* LP exhaust hood steam temperature, C */,
    sexp: Math.max(0, (hot - T) * 0.02) /* HP shell expansion, mm */,
    mode: null,
    step: how === 'load' ? 7 : -1 /* the last finished ATS step (-1 none) */,
    cur: -1 /* the step being executed */,
    ph: '',
    tm: 0 /* timer of the phase, s */,
    soakMin: 0,
    rst: how === 'load' /* turbine reset, MSV / RSV open */,
    exc: how === 'load' /* excitation (41 closed, gen. voltage OK) */,
    hold: '',
    auto: false /* ATS AUTO: the next step starts by itself when its step-in condition is satisfied */,
    last: ''
  };
  /* 3.2.0-beta.66: the oil values start again at the state chosen (tcsOil: the first step jumps to them, no false auto start) */
  for (const k of [
    'loPa',
    'loPb',
    'loEop',
    'loBrg',
    'loCa',
    'loCb',
    'loTrip',
    'loVac',
    'loPur',
    'loTin',
    'loTb3',
    'loTb4',
    'loM1',
    'loM2',
    'loM3',
    'loM4'
  ])
    U[k] = NaN;
  tcsMode(U);
  return U.tc;
}
function tcsMode(U) {
  const c = U.tc,
    t = Math.min(c.Thp, c.Trh);
  /* the mode of TCA500 (its outputs to the DCS I.0410 ~ I.0414, tcs-dcs.js); the metal band only before the program runs */
  c.mode = tcsHwMode(U) || TCS.modes.find(m => t < m[1])[0];
  return c.mode;
}
function tcsPV(tag) {
  const c = TCS.pv || (TCS.pv = {});
  if (!(tag in c)) {
    c[tag] = null;
    for (const sh of AN.sheets) {
      if (!sh.S || /^ABC-000/.test(sh.name) || !AN.hmiCtrls) continue;
      const q = (AN.hmiCtrls(sh.S) || []).find(x => x.tag === tag);
      if (q && q.q && q.q.pv != null) {
        c[tag] = { S: sh.S, n: q.q.pv };
        break;
      }
    }
  }
  const o = c[tag];
  return o ? +o.S.rt.v[o.n] : NaN;
}
/* the steam the ATS sees: MSV inlet (main steam), CRV inlet (hot reheat) */
function tcsSteam(U) {
  const mst = tcsPV('TICMS1004'),
    rht = tcsPV('TICHR1002'),
    /* roadmap 2 batch 3 (checkpoint retest of the 3600 rpm heat soak: ATS HOLD 1.5 at 7.0 while the operator saw 7.6 on PICHR1003): the
       reheat pressure is the corrected one of ABC-052 (PV = AI0421 / AI0513 + 0.6, SEL), the value the LP bypass holds at 7.5 ~ 7.6
       (the LP bypass set point of the DCS logic); the raw AI0421 sat 0.6 lower, under the ATS limit 7 */
    Pv = tcsPV('PICHR1003'),
    Prh = isFinite(Pv) ? Pv : U.rhp && U.rhp.length ? anUnitVal(U.rhp[0]) : NaN;
  /* 3.2.0 P1 #3: the MSV inlet is after the main steam stop MOV MV-MS1391 (unit.js U.Pmsv, while the one world runs) */
  return {
    msp: isFinite(U.Pmsv) ? U.Pmsv : U.Pms,
    mst: isFinite(mst) ? mst : U.Tw,
    rhp: isFinite(Prh) ? Prh : 0,
    rht: isFinite(rht) ? rht : U.Tw
  };
}
/* a limit with its reset band (the ON / OFF of the IBD comparators): the state stays until the value is past the other number */
function tcsBand(c, k, v, bad, ok) {
  const B = c.band || (c.band = {}),
    hi = bad > ok;
  if (!isFinite(v)) return !B[k];
  if (hi ? v >= bad : v <= bad) B[k] = 1;
  else if (hi ? v <= ok : v >= ok) B[k] = 0;
  return !B[k];
}
/* tcsBand with a first state: inside the band at the first scan counts as not OK (the comparator has not come ON yet) */
function tcsBandI(c, k, v, bad, ok) {
  const B = c.band || (c.band = {});
  if (!(k in B) && isFinite(v)) B[k] = (bad > ok ? v > ok : v < ok) ? 1 : 0;
  return tcsBand(c, k, v, bad, ok);
}
/* the criteria (page 3 / 5 ~ 14) that the model has: true = satisfied. txt = the name on the ATS criteria display */
function tcsCrit(U) {
  const c = U.tc,
    s = tcsSteam(U),
    st = TCS.cri[c.mode === 'hot' || c.mode === 'warm' ? c.mode : 'cold'],
    tb = U.tb || {},
    f2u = tcsLin(TCS.fig2.up, c.Thp),
    f2l = tcsLin(TCS.fig2.tg, c.Thp),
    f3u = tcsLin(TCS.fig3.up, c.Trh),
    f3l = tcsLin(TCS.fig3.tg, c.Trh),
    f = (no, txt, ok, val) => ({ no, txt, ok: !!ok, val });
  return {
    1.3: f('1.3', 'MAIN STEAM PRESS. NOT LOW (≥ ' + st[0] + ' kg/cm2)', s.msp >= st[0], s.msp),
    1.4: f('1.4', 'MAIN STEAM TEMP. NOT LOW (≥ ' + st[1] + ' C)', s.mst >= st[1], s.mst),
    1.5: f('1.5', 'REHEAT STEAM PRESS. NOT LOW (≥ ' + st[2] + ' kg/cm2)', s.rhp >= st[2], s.rhp),
    1.6: f('1.6', 'REHEAT STEAM TEMP. NOT LOW (≥ ' + st[3] + ' C)', s.rht >= st[3], s.rht),
    1.71: f(
      '1.71',
      'MAIN STEAM TEMP. MISMATCH OK (' +
        Math.round(f2l) +
        ' ~ ' +
        Math.round(f2u) +
        ' C at HP metal ' +
        Math.round(c.Thp) +
        ' C, Fig. 2)',
      s.mst >= f2l && s.mst <= f2u,
      s.mst
    ),
    1.72: f(
      '1.72',
      'REHEAT STEAM TEMP. MISMATCH OK (' +
        Math.round(f3l) +
        ' ~ ' +
        Math.round(f3u) +
        ' C at RH bowl ' +
        Math.round(c.Trh) +
        ' C, Fig. 3)',
      s.rht >= f3l && s.rht <= f3u,
      s.rht
    ),
    '1.10': f('1.10', 'GLAND STEAM SEAL HEADER PRESS. NOT LOW', c.gsOk !== undefined ? c.gsOk : c.gland && c.Pa > 7, U.gsP),
    1.11: f(
      '1.11',
      'CONDENSER VACUUM OK',
      isFinite(U.cdP) ? tcsBand(c, '1.11', U.cdP, 0.14, 0.12) : U.vac >= 0.9,
      isFinite(U.cdP) ? U.cdP : U.vac
    ),
    1.12: f('1.12', 'LP TURBINE EXHAUST HOOD STEAM TEMP. NOT HIGH (≤ 80 C)', tcsBand(c, '1.12', c.Tx, 80, 77), c.Tx),
    1.14: f('1.14', 'CONTROL OIL PRESS. NOT LOW', tcsBand(c, '1.14', U.loCtl, 133, 138), U.loCtl),
    1.15: f('1.15', 'BEARING OIL PRESS. NOT LOW', tcsBand(c, '1.15', U.loBrg, 1.05, 1.33), U.loBrg),
    /* 1.16: c.brgTok, the logic of TCA539 (tcsStep); the IBD TD-1 sheet shows it. Before the first step: the old reading (oil in service) */
    1.16: f(
      '1.16',
      'BEARING OIL TEMP. OK',
      c.brgTok !== undefined ? c.brgTok : c.brgOk !== undefined ? c.brgOk : c.lop,
      U.loTout
    ),
    1.17: f('1.17', 'MAIN OIL TANK LEVEL OK', c.tankOk),
    1.18: f('1.18', 'MAIN OIL TANK VAPOUR EXTRACTOR RUNNING', c.vex),
    1.19: f(
      '1.19',
      'TURBINE TURNING (turning gear)',
      (c.tg && c.brgOk && U.tb && U.tb.rpm >= 1) || (U.tb && U.tb.rpm >= 4)
    ),
    '1.20': f('1.20', 'TURBINE RESET', !tcsTripNow(U)),
    1.21: f('1.21', 'MSV OPEN', c.rst),
    1.8: f('1.8', 'HP / LP BYPASS CONTROL IN AUTO', tcsBypDcs()),
    /* CRI 1.9 (TCA532 B11 from TCE041, TCE900 ch 26 = DITL-115 row 15 ZSC-MS1020): shown on TCA526 / TCA532, not a step-in or hold criterion */
    1.9: f('1.9', 'HP BYPASS VALVE FULL CLOSED', !!tcsDitlOut('DITL-115', /^HP BYPASS VALVE FULL CLOSE/)),
    1.48: f('1.48', '52G CLOSED', tb.st === 'sync' || tb.st === 'load'),
    2.4: f('2.4', 'TURBINE RATED SPEED (> 3550 rpm)', tb.rpm > 3550, tb.rpm),
    2.6: f('2.6', 'IP TO HP TRANSFER COMPLETE', !!tb.xfer)
  };
}
/* 1.8 HP / LP BYPASS CONTROL IN AUTO: what the TCS gets from the DCS, DITL-115 row 16 (FROM ABC-050 / 052 the manual modes of PICMS1006 /
   PICHR1003) -> TCE900 / TCA043 DI 8 -> TCA532 A8 CRI 1.8. The TCS reads the DCS output, not the controllers: a row the DCS does not
   send (DITL world not scanned yet) is not in AUTO */
function tcsBypDcs() {
  return !!tcsDitlOut('DITL-115', /^HP \/ LP BYPASS CONTROL IN AUTO/);
}
/* the criteria of a step (page 3, IP start mode): A = step-in, B = monitored during the step */
const TCS_A = {
  0: ['1.10', '1.11', '1.15', '1.16', '1.18', '1.19'],
  1: ['1.19'],
  2: [
    '1.3',
    '1.4',
    '1.5',
    '1.6',
    '1.71',
    '1.72',
    '1.8',
    '1.10',
    '1.11',
    '1.12',
    '1.14',
    '1.15',
    '1.16',
    '1.17',
    '1.18',
    '1.19',
    '1.20',
    '1.21'
  ],
  3: [
    '1.3',
    '1.4',
    '1.5',
    '1.6',
    '1.71',
    '1.72',
    '1.8',
    '1.10',
    '1.11',
    '1.12',
    '1.14',
    '1.15',
    '1.16',
    '1.17',
    '1.18',
    '1.20',
    '1.21'
  ],
  4: [
    '1.3',
    '1.4',
    '1.5',
    '1.6',
    '1.8',
    '1.10',
    '1.11',
    '1.12',
    '1.14',
    '1.15',
    '1.16',
    '1.17',
    '1.18',
    '1.20',
    '1.21',
    '2.4'
  ],
  5: [
    '1.3',
    '1.4',
    '1.5',
    '1.6',
    '1.8',
    '1.10',
    '1.11',
    '1.12',
    '1.14',
    '1.15',
    '1.16',
    '1.17',
    '1.18',
    '1.20',
    '1.21',
    '2.4'
  ],
  6: ['1.3', '1.4', '1.8', '1.10', '1.11', '1.12', '1.14', '1.15', '1.16', '1.17', '1.18', '1.20', '1.21', '1.48'],
  7: ['1.3', '1.4', '1.10', '1.11', '1.12', '1.14', '1.15', '1.16', '1.17', '1.18', '1.20', '1.21', '1.48', '2.6']
};
const TCS_B = {
  0: ['1.10', '1.11', '1.15', '1.16', '1.18'],
  1: ['1.3', '1.4', '1.5', '1.6', '1.8', '1.10', '1.11', '1.12', '1.14', '1.15', '1.16', '1.17', '1.18'],
  2: TCS_A[3].filter(x => x !== '1.71' && x !== '1.72'),
  3: TCS_A[3].filter(x => x !== '1.71' && x !== '1.72'),
  4: TCS_A[4].filter(x => x !== '2.4'),
  5: TCS_A[5].filter(x => x !== '2.4'),
  6: TCS_A[6].filter(x => x !== '1.5' && x !== '1.6'),
  7: ['1.3', '1.4', '1.10', '1.11', '1.12', '1.14', '1.15', '1.16', '1.17', '1.18', '1.20', '1.21', '1.48']
};
/* the missing criteria of a list ('' = all satisfied) */
function tcsMiss(U, list) {
  const C = tcsCrit(U);
  return list
    .map(k => C[k])
    .filter(x => x && !x.ok && !(U.tc.byp && U.tc.byp[x.no]))
    .map(
      x =>
        x.no + ' ' + x.txt + (x.val != null && isFinite(x.val) ? ' [' + (+x.val).toFixed(x.val < 2 ? 2 : 1) + ']' : '')
    )
    .join('; ');
}
/* the operator on the TCS panel: auxiliaries and the ATS step push buttons. Returns '' (done) or the reason it is refused */
/* Phase 8 (2026-11-27, the TCS backup read of YUA, /mnt/project-files/phase8-modbus-linkfail-2026-11-27.md): the Modbus link DCS <-> TCS,
   two lines A and B (PLC-A / PLC-B of the Turbine Modbus list = the two TCS COMM ports).
   - the DCS sends its alive bit (Modbus 25, DO25, STN102 WM r2602) on both lines; it must keep changing. The DCS side period is NOT IN DOCS
     (the GCS "Time Interval" is a setting per connection, FCS2000 manual 16 ch 33.4 p33-8, the LMYP value is not in the doc set): the app
     changes it every DCS cycle, like the package watch dogs (pkg.js P.wd).
   - TCS sheet TCT090A: per line two 10.0 s pick-up timers, alive stuck at 1 or stuck at 0 for 10 s = that line is dead (TP 031 / 034 line A,
     TP 035 / 038 line B, OR 032 / 036). The TCS takes the DCS commands from line A while A is healthy, else from line B (DSW 033, 035 ...);
     both lines dead = every DCS command into the TCS forced OFF (0) (DSW 034, 036 ..., DD00002). No trip and no TCS alarm (ETH+MD).
   - TCT081D BTR 008 / 015: the TCS sends the alive bit straight back on DO_0068 of each line = Modbus 10068 "Alive signal".
   - a lost line is an instructor fault (field states fs.tcs.linkA / fs.tcs.linkB, src/world/field/dcs.js): the TCS keeps the last value it
     got on that line, and nothing comes back to the DCS on it (the DCS register holds its last value, FCS2000 manual 06 1.3.6 note 1).
   U.tlk = { alive, A: { v, t, dead, echo }, B: {...}, off } */
const TCS_LINK_DEAD_S = 10.0; /* TCT090A TP 031 / 034 / 035 / 038 */
function tcsLinkStep(U, dt) {
  const L = U.tlk || (U.tlk = { alive: 0, A: { v: 0, t: 0, dead: 0, echo: 0 }, B: { v: 0, t: 0, dead: 0, echo: 0 }, off: 0 });
  L.alive = L.alive ? 0 : 1;
  for (const ln of ['A', 'B']) {
    const s = L[ln],
      cut = typeof anFieldStateVal === 'function' && anFieldStateVal('fs.tcs.link' + ln) === 1,
      v = cut ? s.v : L.alive;
    s.t = v === s.v ? s.t + dt : 0;
    s.v = v;
    s.dead = s.t >= TCS_LINK_DEAD_S ? 1 : 0;
    if (!cut) s.echo = v;
  }
  L.off = L.A.dead && L.B.dead ? 1 : 0;
}
/* the DCS commands of the Turbine Modbus list (DO1 ~ DO13 + spares, 15 in TCT090A) as the app runs them: gland seal group start / stop
   (IBD TC-31), ATS AUTO / OFF, the ATS step push buttons and the start-up buttons that press them (roll, sync) */
const TCS_DCS_CMDS = ['auto', 'roll', 'sync', 'warm', 'prep', 'rub', 'accel', 'excite', 'loadup', 'normal', 'shutdown'];
function tcsLinkRefuse(U, cmd, arg) {
  if (!(U.tlk && U.tlk.off)) return '';
  const dcs = TCS_DCS_CMDS.includes(cmd) || (cmd === 'ibd' && arg && arg.id === 'TC-31');
  return dcs ? 'Both Modbus lines DCS to TCS are dead: the TCS takes every DCS command as OFF (TCS sheet TCT090A)' : '';
}
function tcsCmd(U, cmd, arg) {
  /* CRITERIA BYPASS (310SC90-775 p.3, p.10): the operator takes one unsatisfied criterion out of the step-in and step criteria; a second press puts it back. A hold is not bypassed */
  if (cmd === 'critbypass') {
    const k = String(arg || '').trim(),
      c0 = U.tc;
    if (!tcsCrit(U)[k]) return 'No ATS criterion ' + k;
    c0.byp = c0.byp || {};
    if (c0.byp[k]) delete c0.byp[k];
    else c0.byp[k] = true;
    return '';
  }
  if (cmd === 'ibd') return tcsIbdPush(tcsOilState(U), arg);
  /* a CRT push button of a TCE / TCA sheet that drives its motor (tcs-sheets.js): { port: 'CRT:TCE300.b007.START', ms } */
  if (cmd === 'tce') return tcsShPress(tcsOilState(U), arg && arg.port, arg && arg.ms ? arg.ms / 1000 : 0);
  const c = U.tc || tcsInit(U, 'cold'),
    tb = U.tb;
  const on = arg !== 0 && arg !== false;
  switch (cmd) {
    /* 1.0.0-beta.362 D18 (JENNIE): no 'lop' / 'eh' commands (the Training buttons that started the A pump): each pump has its own
       START / STOP / AUTO / MANUAL ('oil' below, IBD TB-1 / 2 / 21 / 22) */
    /* 3.2.0-beta.66: the TCS CRT operation of one pump (the MOTOR STANDARD of its sheet TCE300 / 305 / 310: MANUAL, then START / STOP;
       AUTO): arg = { p: 'mopA' | 'mopB' | 'copA' | 'copB' | 'eop', op: 'start' | 'stop' | 'auto' | 'man' } */
    case 'oil':
      return tcsOilCmd(c, arg || {});
    /* 1.0.0-beta.362 D18 (JENNIE): no 'vex' / 'tg' / 'gland' / 'hood' commands. The vapour extractor (IBD TB-12), the turning gear motor
       (TB-9), the gland steam exhauster (TC-28), the steam seal feed inlet valve (TC-31, it puts PV-GS1031 in service) and the LP exhaust
       hood spray FV-CD1904 (TC-35) are run by the push buttons of their sheets: arg = { id: 'TB-9', pb: 'START' } (tcs-trip.js
       TCS_IBD_PBN). The sheet gates give the permissives (TB-9: MSV / ICV closed, bearing oil normal) */
    /* 1.0.0-beta.360 (JENNIE): no 'aux' command. The aux steam valve MV-AS1391 is a DCS MOV (DITL-51, OPEN P.B. M.0360): c.asv follows
       its position (tcsStep). The old command set the flag with no TCS sheet behind it */
    /* 1.0.0-beta.360 (JENNIE): no 'vacuum' command. The vacuum breaker MV-AV1391 and the ejector steam MOVs are DCS MOVs (DITL-56 / 55 /
       54): the operator presses their CLOSE / OPEN push buttons; DITL-54 OPEN needs the breaker FULLY CLOSED (row 6 I.0216). The
       state c.vb / c.ej follows the MOV positions (tcsStep). The old command pressed all three in one call with no TCS sheet behind it */
    case 'auto':
      c.auto = on;
      return '';
    /* LMYP OTS (TCS study 2026-11-19): the speed control of the TCS CRT with ATS AUTO OFF, Hitachi TCS soft logic 331DM09784:
       TCE161 / 162 TARGET SPEED: CLOSE VALVES / RUB CHECK 200 / LOW 1800 / MED 2700 / RATED 3600 rpm, one select at a time, CRT only while
       not ATS AUTO(C), refused after 52G CLOSE (TCE053) and with a TURBINE TRIP (reset of the selects). TCE160 TARGET ACCELERATION: SLOW
       120 / MED 180 / FAST 360 rpm/min (SG C034 / C037 / C039). TCE164 TARGET SPEED HOLD: the HOLD of the CRT (c.opHold), not in the
       critical speed zone. arg: rpm (0 = CLOSE VALVES) / 'slow' | 'med' | 'fast' */
    case 'tspeed': {
      if (c.auto) return 'ATS AUTO is ON: the ATS selects the target speed (TCA582). Put ATS AUTO OFF first';
      if (tb.st === 'sync' || tb.st === 'load') return '52G is closed: the governor has the load, not the target speed';
      if (!c.rst) return 'The turbine is not reset (MSV closed): TURBINE PREPARATION first';
      const x = +arg;
      if (![0, 200, 1800, 2700, 3600].includes(x)) return 'Target speed: 0 (CLOSE VALVES), 200, 1800, 2700 or 3600 rpm (TCE161)';
      if (c.cur >= 0 && c.cur !== 2 && c.cur !== 3) return 'Step running: ' + TCS.names[c.cur];
      if (c.cur === 2 || c.cur === 3) {
        c.cur = -1;
        c.ph = '';
      }
      c.spd = Object.assign(c.spd || { acc: 120 }, { sel: x });
      return '';
    }
    /* 'accrate', not 'accel': 'accel' is the ATS step 3 ACCELERATION push button (step map below) */
    case 'accrate': {
      if (c.auto) return 'ATS AUTO is ON: the ATS selects the acceleration rate (TCA584)';
      const r = { slow: 120, med: 180, fast: 360 }[String(arg).toLowerCase()];
      if (!r) return 'Acceleration: slow (120), med (180) or fast (360 rpm/min) (TCE160)';
      c.spd = Object.assign(c.spd || { sel: null }, { acc: r });
      return '';
    }
    /* LMYP OTS overspeed test (TCE176 MAIN / TCE177 BK-UP, CRT PB ON / OFF): arg 1 = ON, 0 = OFF. tcsOstCmd below */
    case 'ostmain':
    case 'ostbk':
      return tcsOstCmd(U, cmd === 'ostmain' ? 'main' : 'bk', on);
    case 'hold':
      c.opHold = on;
      return '';
    case 'holdoff':
      if (c.hold && !/press HOLD OFF/.test(c.hold)) return 'The hold condition stands: ' + c.hold;
      c.holdL = false;
      c.opHold = false;
      return '';
  }
  const k = { warm: 0, prep: 1, rub: 2, accel: 3, excite: 4, sync: 5, loadup: 6, normal: 7, shutdown: 8 }[cmd];
  if (k == null) return null;
  return tcsStepIn(U, k, arg);
}
/* a step push button (or ATS AUTO): the program actuation of the step (page 13 ~ 28): the step before finished (or skipped where the
   drawing allows it), the step-in condition A of the step */
function tcsStepIn(U, k, arg) {
  const c = U.tc,
    tb = U.tb;
  if (c.cur >= 0 && c.cur !== k && c.cur < 6) return 'Step still running: ' + c.cur + ' ' + TCS.names[c.cur];
  if (k === 6 && c.step >= 6) {
    /* LOAD UP again: a new target (the TCS panel target MW) */
    tb.st = 'load';
    tb.aim = c.aim = isFinite(+arg) ? +arg : 45;
    c.cur = 6;
    return '';
  }
  /* the step before: 0 is skipped when the HP first stage metal is above 150 C (page 13 *1); the rub check is bypassed in warm / hot
     (page 14 Fig. 1: complete when not ambient cold / cold 1) */
  /* LMYP OTS: with the speed brought to RATED 3600 rpm by the CRT target speed (ATS AUTO OFF, TCE161) the ACCELERATION step of the ATS is
     not used; EXCITATION then needs the turbine reset and its own criteria A4 (rated speed 2.4 > 3550 rpm, 310SC90-776) */
  const crt = k === 4 && c.spd && c.spd.sel === 3600 && c.step >= 1 && tb.rpm > 3550;
  const need = crt ? 1 : k === 1 ? -1 : k === 3 && !(c.mode === 'amb' || c.mode === 'c1') ? 1 : k - 1;
  if (c.step < need)
    return 'Finish step ' + need + ' ' + TCS.names[need] + ' (ATS page ' + [13, 14, 17, 19, 23, 24, 26, 28][need] + ')';
  if (c.step >= k) return 'Already done: ' + TCS.names[k];
  const miss = k === 8 ? '' : tcsMiss(U, TCS_A[k]);
  if (miss) return 'CRITERIA A' + k + ' (' + TCS.names[k] + ') missing: ' + miss;
  c.cur = k;
  c.ph = 'in';
  c.tm = 0;
  if (k === 6) c.aim = isFinite(+arg) ? +arg : 45;
  return '';
}
function tcsDone(U, k) {
  const c = U.tc;
  c.step = k;
  c.cur = -1;
  c.ph = '';
  c.last = TCS.names[k] + ' done';
}
/* one step of dt s: auxiliaries, metal, ATS program. Called by anUnitStep before the turbine black box; tb.rpm / tb.st / tb.icv are set
   here while the ATS controls the speed */
/* the turbine metal (HP first stage inner wall, RH bowl, valve chests) and the HP shell expansion. Beta.240 (Jennie, HOT / WARM saves by
   real clicks 2026-11-22): it ran only inside tcsStep, which the unit skips while a trip is held (unit.js: MFT M.3200 or I.0400 ->
   tcsTripHold), so after a turbine trip with the boiler bottled up the metal stood still for hours (HP 487 C after 1.7 h; the tauCool law
   gives 476 C). Metal cools by physics whatever the trip latch says: tcsStep and the trip hold both call this. Returns the ambient */
/* steam flows through the turbine: the stop valves not off and an intercept or a governor valve open */
function tcsSteamOn(U) {
  const tb = U.tb || {};
  return tb.st !== 'off' && (tb.icv > 0.001 || U.gv > 0.001);
}
function tcsMetal(U, c, s, dt) {
  const steam = tcsSteamOn(U);
  /* metal: toward the steam while steam flows (TCA rotor model), else cooling to the ambient (FHI SECT_7 / STIE-14811 CALC), see the head */
  const Ta = U.Tamb || 30;
  if (steam) {
    c.Thp += ((s.mst - c.Thp) * dt) / TCS.tauMetal;
    c.Trh += ((s.rht - c.Trh) * dt) / TCS.tauMetalIp;
  } else if (c.cur === 0 && c.ph === 'warm') {
    const Tw = typeof anTsatA === 'function' ? anTsatA(TCS.pWarm + 1.033) : 157.8;
    c.Thp += ((Math.min(s.mst, Tw) - c.Thp) * dt) / TCS.tauWarm;
  } else {
    c.Thp += ((Ta - c.Thp) * dt) / TCS.tauCool;
    c.Trh += ((Ta - c.Trh) * dt) / TCS.tauCool;
  }
  if ((c.cur === 1 && c.ph === 'chest') || c.rst) c.Tcvi += ((s.mst - c.Tcvi) * dt) / TCS.tauChest;
  else c.Tcvi += ((Ta - c.Tcvi) * dt) / TCS.tauCool;
  c.Tcvo += ((c.Tcvi - c.Tcvo) * dt) / TCS.tauChestO;
  /* shell expansion (HP side), mm: 3 mm at about 180 C (page 20 question 2 > 3 mm after the 1800 rpm soak; IBD TD-4 3 mm ON / 2.5 OFF; the linear law is NO-SOURCE) */
  c.sexp = Math.max(0, (c.Thp - Ta) * 0.02);
  return Ta;
}
/* the turbine auxiliaries and the plant values the ATS criteria read (aux steam, gland, metal, shell expansion, bearing oil temperature,
   LP exhaust hood). Beta.243 (Jennie, F4 of the HOT / WARM saves by real clicks 2026-11-22): they ran only inside tcsStep, which the unit
   skips while a trip is held (unit.js tcsTripHold), so after a turbine trip the gland, the bearing oil criterion and the hood temperature
   stood still for hours. The plant goes on whatever the trip latch says: tcsStep and the trip hold both call this; only the ATS program
   (steps, ramps, holds) waits for the reset */
function tcsAux(U, dt) {
  tcsGenStep(U, dt);
  const c = U.tc;
  if (!c) return;
  const tb = U.tb,
    s = tcsSteam(U);
  /* aux steam header: from the main steam through MV-AS1391 (its pressure is the aux steam header mass balance of unit.js AN_AS; the
     vendor minimum is 7.0 kg/cm2g for HP prewarming and the gland seal start, MHPS Operation Manual TG 2-1-1 p.32 / p.87; the PCV set
     itself is not in the docs); audit A3: with the one world
     the valve is its DCS drawing DITL-51 (IO list STN102 O.0160 / O.0161, AI0752 ZT-AS1391) */
  {
    const p51 = typeof anDitlPos === 'function' ? anDitlPos('DITL-51', 0) : null;
    if (p51 != null) c.asv = p51 > 0;
    /* 1.0.0-beta.360: the vacuum breaker MV-AV1391 (DITL-56) and the ejector steam MOVs (DITL-55 SJAE, DITL-54 start-up ejector) */
    const p56 = typeof anDitlPos === 'function' ? anDitlPos('DITL-56', 0) : null,
      p55 = typeof anDitlPos === 'function' ? anDitlPos('DITL-55', 0) : null,
      p54 = typeof anDitlPos === 'function' ? anDitlPos('DITL-54', 0) : null;
    if (p56 != null) c.vb = p56 > 0;
    if (p55 != null || p54 != null) c.ej = (p55 || 0) > 0 || (p54 || 0) > 0;
  }
  /* 3.2.3 live Cold start (user 2026-11-14 "Code ang gawin"): the aux steam header and the gland header are mass balances (unit.js
     AN_AS anAuxStep): Pa = PT-AS1004, the gland seal is in service while its header holds >= 0.10 kg/cm2 G (ATS 1.10, IBD TD-3 LOW).
     Before: a lag toward min(10.5, drum - 1) and a switch */
  if (isFinite(U.asP)) c.Pa = U.asP;
  /* one logic (user 2026-11-20): the ATS criteria are computed here once, as the TCA sheets draw them; the IBD sheets that show the same signal
     take these values (tcs-trip.js TCS_IBD_OUT), they never compute them a second time.
     1.10 TCA542: the lower of PT-GS1001 (A) / (B), CPL A035 HL / LL 0.1 kg/cm2 G, NOT 015 = not low (IBD TD-3 net 5).
     1.17 TCA542: MAIN OIL TANK LEVEL HIGH / LOW switches (TCA051 / 050); the tank level is not modelled, the switches stay off = OK (IBD TD-3 net 6) */
  if (isFinite(U.gsP)) c.gsOk = U.gsP >= 0.1;
  c.tankOk = true;
  if (isFinite(U.gsP)) c.gland = !!c.gsOn && c.gsOk;
  /* 1.0.0-beta.362 D18: the turning gear motor runs as IBD TB-9 says (the bearing oil is a start permissive there, net 3); the shaft turns
     only with the bearing oil (below) */
  /* turning gear: "approx. 2/3 r/min" (MHPS Turbine Maintenance Manual TG 2-1-2 p.35, Rotor Turning Gear), 3 r/min here; the clash gear
     throws the pinion out as soon as steam drives the rotor faster than the gear (same page): DERIVED 4 r/min = the gear speed + 1;
     engages again at zero speed */
  const Ta = tcsMetal(U, c, s, dt);
  const steam = tcsSteamOn(U);
  /* 2.1 SHELL EXPANSION OK, TCA535 CMP A003 HL 3.0 mm / LL 2.5 mm: on at 3.0, off below 2.5 (IBD TD-4 net 6) */
  c.sexOk = tcsBandI(c, '2.1', c.sexp, 2.5, 3);
  /* 1.16 BEARING OIL TEMP. OK, TCA539 OR 003 (IBD TD-1 net 14): T = the higher lube oil cooler outlet (HS 033, U.loTout);
     A 002 turning gear engaged, over 27 C (CMP A007 27 / 25) and under 42 C (CPL A006 42 / 40);
     A 008 not on the turning gear, over 27 C, under 52 C (CPL A010 52 / 50), not at rated speed;
     A 013 over 40 C (CMP A012 40 / 38), under 52 C, rated speed held 60 s (TP A014; IBD TD-1 DI 60 s of speed >= 3550 rpm) */
  {
    const T = U.loTout,
      r = !!(tb && tb.rpm >= 3550),
      eng = !!c.tg && !!tb && tb.rpm <= 4; /* TURNING GEAR ENGAGED: selected and at turning speed (above 4 rpm disengaged, DERIVED above) */
    /* a save made before this timer existed: a turbine already at rated speed counts as held (the IBD DI timer of that save had run) */
    c.ratedT = r ? (c.ratedT === undefined ? 60 : c.ratedT + dt) : 0;
    const held = c.ratedT >= 60,
      lo27 = tcsBandI(c, '1.16a', T, 25, 27),
      hi42 = tcsBandI(c, '1.16b', T, 42, 40),
      hi52 = tcsBandI(c, '1.16c', T, 52, 50),
      lo40 = tcsBandI(c, '1.16d', T, 38, 40);
    if (isFinite(T)) c.brgTok = (eng && lo27 && hi42) || (!eng && lo27 && hi52 && !held) || (lo40 && hi52 && held);
  }
  /* LP exhaust hood: windage of the blades with little steam, the hood spray below 15 % load (TCS logic IBD TC-35: GEN. LOAD < 15 %), the vacuum
     (NO-SOURCE law, limits 80 / 52 C sourced, ambient 30 C: with the spray about 56 C at 3600 rpm with no load, about 49 C at the initial load 4.5 MW, about 58 C on load: under the 80 C of 1.12) */
  /* live Cold start sweep (user 2026-11-13): the 15 C of the windage counts with the speed: a turbine at rest makes no heat, the hood
     sat at 45 C with no steam and 0 rpm (the condenser TEST11101 ~ 3 too). At 3600 rpm the values above are unchanged */
  const sp = Math.min(1, (tb.rpm || 0) / 3600),
    /* 3.2.0-beta.38: the hood spray FVCD1904 in AUTO sprays below 15 % load (22.5 MW, IBD TC-35) and takes 70 % of the windage heat (NO-SOURCE share; the spray itself is sourced: FV-CD1904 full open below 15 % load, IBD TC-28, 5226 kg/h, TG maintenance manual p104 and p2520 ~ 2521). Without it: 82 C at 3600 rpm with no load, over the 80 C of 1.12 (hold) */
    hs = c.hso ? 0.3 : 1 /* c.hso: FV-CD1904 open, IBD TC-35 (AUTO: GSE started 3 s and GEN. LOAD < 15 %; beta.362 D18) */,
    XSS =
      Ta +
      15 * sp +
      37 * hs * sp * sp * Math.max(0.35, 1 - (U.MW || 0) / 7.5) +
      120 * Math.max(0, 0.9 - (U.vac || 0)) * sp,
    /* 3.2.1: on load the steam carries the windage away and the hood is wet steam at the condenser saturation (physics: the exhaust
       is wet steam at the condenser pressure). NO-SOURCE blend: from the windage value at 7.5 MW to the saturation at 22.5 MW (15 % load,
       the hood spray limit of IBD TC-35), linear; below 7.5 MW unchanged */
    Tsc = isFinite(U.cdP) && typeof anTsatA === 'function' ? anTsatA(U.cdP) : NaN,
    fL = Math.max(0, Math.min(1, ((U.MW || 0) - 7.5) / 15)),
    XS = isFinite(Tsc) && fL > 0 ? XSS + (Tsc + 120 * Math.max(0, 0.9 - (U.vac || 0)) * sp - XSS) * fL : XSS;
  c.Tx += ((XS - c.Tx) * dt) / TCS.tauX;
  /* the turning gear holds the shaft at about 3 rpm when no steam turns it (beta.243: also while a trip is held, the
     trip hold calls tcsAux) */
  if (!steam && tb.rpm < 4) {
    const tg = c.tg && c.brgOk;
    tb.rpm = tg ? Math.min(3, tb.rpm + dt) : Math.max(0, tb.rpm - dt);
  }
}
function tcsStep(U, dt) {
  tcsAux(U, dt);
  const c = U.tc;
  if (!c) return;
  const tb = U.tb;
  /* holds (ATS sequence 310SC90-775 page 19 *1): vacuum low, exhaust hood temp. high, bearing oil press. low, thermal stress
     high (the steam outside Fig. 2 / 3); not inside the critical speed zone (TCE164) */
  const C = tcsCrit(U);
  const why = [];
  if (!C['1.11'].ok) why.push('CONDENSER VACUUM LOW');
  if (!C['1.12'].ok) why.push('EXHAUST HOOD TEMP. HIGH');
  if (!C['1.15'].ok) why.push('BEARING OIL PRESS. LOW');
  const inCrit = tb.rpm > TCS.crit[0] && tb.rpm < TCS.crit[1],
    noHold = inCrit || (c.cur === 6 && !tb.xfer),
    cond = why.length > 0;
  if (cond && !noHold) c.holdL = true;
  if (!cond && c.holdL) why.push('Hold cleared: press HOLD OFF');
  if (c.cur >= 0 && TCS_B[c.cur]) {
    const mb = tcsMiss(U, TCS_B[c.cur]);
    if (mb) why.push('CRITERIA B' + c.cur + ': ' + mb);
  }
  if (c.opHold) why.push('HOLD ON (operator)');
  c.hold = noHold ? '' : why.join('; ');
  const run = !c.hold;
  const rate = TCS.rate[c.mode] || 120;
  const ramp = aim => {
    if (!run || tb.rpm >= aim) return;
    tb.rpm = Math.min(aim, tb.rpm + (rate * dt) / 60);
  };
  /* 1.0.0-beta.366 (JENNIE, Rosé: Warm save read HOT at HP 403 C): the start-up mode is the metal band (page 14: taken at TURBINE PREPARATION,
     c.mode = tcsMode there). Before the preparation it follows the metal; before, it kept the band of the trip (tcsTrip) while the turbine cooled */
  if (c.cur < 0 && c.step < 1) tcsMode(U);
  /* ATS AUTO: the next step by itself (the lines H of the sequence) */
  if (c.auto && c.cur < 0 && c.step < 7) {
    let nx = c.step + 1;
    if (nx === 2 && !(c.mode === 'amb' || c.mode === 'c1')) nx = 3;
    if (nx === 0 && c.Thp > 150) nx = 1;
    if (nx <= (c.autoTo == null ? 5 : c.autoTo) && !tcsMiss(U, TCS_A[nx])) tcsStepIn(U, nx);
  }
  c.tm += dt;
  /* LMYP OTS: the CRT target speed (tcsCmd 'tspeed' / 'accel', TCE160 ~ 164) while no ATS step runs and the generator is off the line:
     the speed goes to the selected target at the selected acceleration (held by a HOLD outside the critical zone, as the ATS ramp);
     CLOSE VALVES (0) closes the ICV and the turbine coasts down at the rate of the rub check (100 rpm/min, page 17) */
  tcsOstStep(U, dt);
  if (c.spd && c.spd.sel != null && c.cur < 0 && tb.st === 'roll' && !tb.rej && !tcsOstOn(c)) {
    if (c.spd.sel > 0) {
      tb.icv = Math.min(TCS_ICV, tb.icv + dt / 60);
      if (run && tb.rpm < c.spd.sel) tb.rpm = Math.min(c.spd.sel, tb.rpm + (c.spd.acc * dt) / 60);
      else if (tb.rpm > c.spd.sel) tb.rpm = Math.max(c.spd.sel, tb.rpm - (100 * dt) / 60);
    } else {
      tb.icv = 0;
      tb.rpm = Math.max(0, tb.rpm - (100 * dt) / 60);
    }
  }
  switch (c.cur) {
    case 0 /* HP TURBINE WARMING (page 13): metal <= 150 C -> warming with steam through CV (B), until above 150 C (IBD 310SC90-794
        TE-1 page 90: TE-STn001-1 HP TURBINE FIRST STAGE comparator ON >= 150 C, OFF <= 145 C = HP TURBINE WARMING COMPLETE) */:
      if (c.Thp > 150) tcsDone(U, 0);
      else c.ph = 'warm';
      break;
    case 1 /* TURBINE PREPARATION (page 14 ~ 16): CV chest warming when the chest inner or outer wall is <= 150 C, 60 min or (diff < 50 C
        and outer > 180 C); turbine reset, MSV open, load limiter upper */:
      if (c.ph === 'in') {
        c.mode = tcsMode(U);
        c.rst = true;
        if (c.Tcvi > 150 || c.Tcvo > 150) c.ph = 'reset';
        else {
          c.ph = 'chest';
          c.tm = 0;
        }
      }
      if (c.ph === 'chest' && (c.tm >= 3600 || (Math.abs(c.Tcvi - c.Tcvo) < 50 && c.Tcvo > 180))) c.ph = 'reset';
      if (c.ph === 'reset') {
        c.rst = true;
        tb.st = 'roll';
        tb.rpm = Math.max(tb.rpm, 0);
        tcsDone(U, 1);
      }
      break;
    case 2 /* RUB CHECK (page 17 ~ 18): to 200 rpm, CV / ICV close, coast down below 100 rpm */:
      if (c.ph === 'in') c.ph = 'up';
      if (c.ph === 'up') {
        tb.icv = Math.min(TCS_ICV, tb.icv + dt / 60);
        ramp(TCS.rub);
        if (tb.rpm >= TCS.rub - 0.5) c.ph = 'coast';
      } else if (c.ph === 'coast') {
        tb.icv = 0;
        tb.rpm = Math.max(0, tb.rpm - (100 * dt) / 60);
        if (tb.rpm < 100) tcsDone(U, 2);
      }
      break;
    case 3 /* ACCELERATION (page 19 ~ 22): 1800 rpm heat soak (cold modes), questions HP metal > 170 C and shell expansion > 3 mm,
        3600 rpm heat soak */:
      tb.icv = Math.min(TCS_ICV, tb.icv + dt / 60);
      if (c.ph === 'in') {
        c.soakT = Math.min(c.Thp, c.Trh);
        c.ph = TCS.soak1800[c.mode] > 0 ? 'to1800' : 'to3600';
      }
      if (c.ph === 'to1800') {
        ramp(1800);
        if (tb.rpm >= 1800) {
          c.ph = 'soak1800';
          c.tm = 0;
          c.soakMin = TCS.soak1800[c.mode];
        }
      } else if (c.ph === 'soak1800') {
        if (c.tm >= c.soakMin * 60 && c.Thp > 170 && c.sexOk) c.ph = 'to3600';
      } else if (c.ph === 'to3600') {
        ramp(3600);
        if (tb.rpm > 3550) {
          tb.rpm = Math.min(3600, tb.rpm);
          c.ph = 'soak3600';
          c.tm = 0;
          c.soakMin = TCS.soak3600[c.mode];
        }
      } else if (c.ph === 'soak3600') {
        ramp(3600);
        if (c.tm >= c.soakMin * 60) tcsDone(U, 3);
      }
      break;
    case 4 /* EXCITATION (page 23): AVR start, generator voltage OK */:
      {
        const g = tcsGen(U);
        g.ex = true;
        c.exc = g.f41;
        /* beta.236: the voltage comes from the field physics (tcs-gen.js): GENERATOR VOLTAGE OK = inside the ASD window, 2 % */
        if (g.f41 && Math.abs(g.V - 1) <= TCS_GEN.dV) tcsDone(U, 4);
      }
      break;
    case 5 /* SYNCH. & INITIAL LOAD (page 24 ~ 25): ASD closes 52G, initial load, hold timer (Fig. 3) */:
      if (c.ph === 'in') {
        const g = tcsGen(U);
        g.start = true;
        if (!g.close) break;
        g.start = false;
        tb.st = 'sync';
        tb.tgt = 0;
        tb.aim = (TCS.init[c.mode] * 150) / 100;
        U.MWinit = tb.aim;
        c.ph = 'init';
        c.tm = 0;
        c.holdMin = TCS.hold(c.mode);
        tcsGcb(U, true);
      } else if (c.ph === 'init' && U.MW >= 0.9 * tb.aim && c.tm >= c.holdMin * 60) {
        /* plan c3: the initial load is held also until the LP exhaust hood is below 52 C: "Maintain the initial load until the LP turbine
           exhaust hood cools down below 52 C", MHPS Operation Manual STIE-14747 / 14748 / 14749 (TG 2-1-1 p.45 / 52 / 59); 80 C before
           synchronizing (p.43, criterion 1.12) */
        if (isFinite(c.Tx) && c.Tx >= 52)
          c.hold = 'Waiting: LP exhaust hood ' + c.Tx.toFixed(0) + ' C, below 52 C before load up';
        else {
          if (/LP exhaust hood/.test(c.hold || '')) c.hold = '';
          tcsDone(U, 5);
        }
      }
      break;
    case 8 /* SHUT-DOWN (775 page 29, 776 page 14 criteria 2.11): generator load < 20 %, 52G open command, 41 open, turbine trip */:
      if (c.ph === 'in') {
        c.hold = U.MW < 0.2 * 150 ? '' : 'Waiting: generator load must be below 20 % to shut down';
        if (U.MW < 0.2 * 150) c.ph = '52g';
      } else if (c.ph === '52g') {
        /* TCS soft logic TCA 331DM09788 p.146 (TCA587, read 2026-11-12): GEN.CB OPEN, then on GCB OPENED the FIELD SWITCH OPEN, then
           on FIELD SW OPENED the TURBINE SHUT-DOWN COMMAND, each a pulse of TW 3.0 s: the next command comes 3 s after the one before */
        c.sd52 = true;
        tcsGcb(U, false);
        Object.assign(tb, { st: 'roll', xfer: false, tgt: 0, aim: 0 });
        c.ph = '41';
        c.sdT = 0;
      } else if (c.ph === '41') {
        c.sdT = (c.sdT || 0) + dt;
        if (c.sdT < 3) break;
        c.sd52 = false;
        Object.assign(tcsGen(U), { f41: false, V: 0 });
        c.exc = false;
        c.ph = 'trip';
        c.sdT = 0;
      } else if (c.ph === 'trip') {
        c.sdT = (c.sdT || 0) + dt;
        if (c.sdT < 3) break;
        /* Mina beta.146: the first out read MANUAL TRIP. The ATS trips the turbine by its TURBINE SHUTDOWN COMMAND, IBD TA-9 input 18 */
        c.sdDone = true;
        tcsTripShutdown(U);
      }
      break;
    case 6 /* LOAD UP (page 26 ~ 27): ICV -> CV transfer, load up rate 5 %/min (in the TCS, unit.js) */:
      if (tb.st !== 'load') {
        tb.st = 'load';
        tb.aim = isFinite(c.aim) ? c.aim : 45;
      }
      /* load hold: the load stays where it is while a step criteria B is lost, and goes on to the target after it (before: the hold
         wrote the load of the moment into the target and the step ended there, 18.7 MW of 45 in the hot start-up check) */
      {
        const goal = isFinite(c.aim) ? c.aim : 45;
        tb.aim = !run && isFinite(tb.tgt) ? Math.min(goal, tb.tgt) : goal;
        if (tb.xfer && run && U.MW >= Math.min(44, goal - 1)) tcsDone(U, 6);
      }
      break;
    case 7:
      tcsDone(U, 7);
      break;
  }
  /* the trips of IBD TA-9 (tcs-trip.js), bearing oil among them */
  tcsTripScan(U, dt);
}
/* 3.2.0-beta.66 (036 TURBINE OIL HMI). The pumps and their automatic start as the TCS logic (TCE300 / 305 / 310, IBD TB-1 / 2 / 5) and
   the TCS I/O list (iolist-tcs HMI_AI / HMI_DI) give them:
     MOP P-1922A / B   lube oil; the one in AUTO starts when the running pump discharge (1PTLO1922A / B) is <= 5.6 kg/cm2g;
     COP P-1931A / B   control oil, on the main oil tank and drawing from it (MHPS 310PB64-455 Rev 1 Outline of Turbine Lube Oil Unit); AUTO start at the discharge (1PTLO1931A / B) <= 133 (TCE305);
     EOP P-1923 (DC)   bearing oil; starts at the bearing oil (1PSLO1004) <= 1.05 kg/cm2g (IBD TB-5); stop by hand only (TCE310 MOTOR STANDARD);
     vapour extractor  F-1937 (main oil tank vacuum PGLO1920 -20 ~ -50 mmH2O);
     oil purifier      P-1941, local panel (AN_SRC.field.pur), discharge 3.0 kg/cm2 DERIVED (the purifier manual STIE-14666 is not read:
                       a centrifugal purifier feed pump of vendor practice, 2 ~ 3 kg/cm2; display only).
   Values (user rule 2026-11-28: design document or TCS logic, else DERIVED from physics):
     MOP discharge     6.63 kg/cm2g while running = 0.65 MPa(g), the design MAIN OIL PUMP DISCHARGE OIL of the TG lube oil system
                       drawing 310SD14-354 (TG maintenance manual 2-1-2, legend; bearing oil 0.18 MPa(g) there). The header is held by
                       the LUBE OIL PRESSURE CONTROL VALVE V-LOn004 (valve list), so a set value; no pump curve in the docs (the pump
                       datasheet is a scan). IBD TB-1 / TB-2 resets the LOW of the running pump only ABOVE 6.1 (CMP 5.6 / 6.1);
     bearing oil       1.84 kg/cm2g = 0.18 MPa(g), the design BEARING OIL of the same drawing 310SD14-354, with a
                       MOP; 1.6 with the EOP only (NO-SOURCE, above its 1.05 start); else 0;
     EOP discharge     1.6 while running (NO-SOURCE);
     COP discharge     163 kg/cm2g while running (310PB64-455 specification of equipments: 163 kg/cm2, 60 L/min x 2; master trip valve
                       block rated 163 kgf/cm2, maintenance manual p.861); control oil header = discharge - 0.5 (the clean control oil
                       filter S-n933: DERIVED, not in the docs; vendor practice of a clean high pressure element about 0.5 bar, its
                       clogging indicator at 2.4 bar about 5 x clean); trip oil
                       (PILO10071 ~ 73) = the control oil while the turbine is reset, 0 tripped;
     oil rise          the bearing heat the oil carries = the lube oil cooler duty of unit.js AN_LO (one source): 1,300 kW at rated
                       speed, oil 63 -> 46 C (vendor O&M L2 TG 2-3), so m cp = 1300 / 17 = 76.5 kW/K and the rise is 17 C at rated;
                       below rated the heat goes as (speed / 3600)^2 (journal friction, Petroff: DERIVED, the same law as AN_LO);
     cooler inlet      TILO1001 = the cooler outlet (TICLO1002 PV, ABC-053) + the oil rise (all the oil returns through the cooler);
     bearing outlet    TIGE1007 / 1008 = the cooler outlet + the oil rise (each bearing's loss in proportion to its oil);
     low limits        MOP AUTO start 5.6 = TCS logic TCE300 CPL A030 LL 5.6 (HL 6.1); COP AUTO start 133 = TCE305 CPL A005 LL 133 (HL 138);
                       EOP start 1.05 = IBD TB-5 (also the turning gear start, Operation Manual p.31);
     pressures follow with a lag of 1.5 s (NO-SOURCE), so a stopped running pump lets the header fall and the standby in AUTO start. */
const TCS_OIL = {
  mop: 6.63,
  brg: 1.84 /* kg/cm2g, design bearing oil 0.18 MPa(g), 310SD14-354 */,
  brgEop: 1.6 /* kg/cm2, NO-SOURCE inside sourced bounds: above the EOP LOW OFF 1.33 and below the 5.0 design (V-LOn005) */,
  eop: 1.6 /* same bounds */,
  cop: 163 /* kg/cm2g, 310PB64-455 */,
  filt: 0.5 /* kg/cm2, DERIVED (clean filter, above) */,
  mopLo: 5.6 /* TCE300 CPL A030 LL */,
  copLo: 133 /* TCE305 CPL A005 LL */,
  brgLo: 1.05 /* IBD TB-5 EOP start */,
  pur: 3.0 /* kg/cm2, DERIVED (above) */,
  vac: -35,
  tau: 1.5
};
function tcsOilInit(c) {
  if (c.mop) return;
  c.mop = [!!c.lop, false];
  c.mopAu = [false, false];
  c.cop = [!!c.eh, false];
  c.copAu = [false, false];
  c.eop = false;
  c.eopAu = !!c.lop;
  c.brgOk = !!c.lop;
}
function tcsOilSet(c) {
  c.lop = !!(c.mop[0] || c.mop[1]);
  c.eh = !!(c.cop[0] || c.cop[1]);
  /* a pump started now gives the bearing oil at once (the turning gear may follow in the same action, as before) */
  if (c.lop || c.eop) c.brgOk = true;
}
function tcsOilCmd(c, a) {
  tcsOilInit(c);
  if (!/^((mop|cop)[AB]|eop)$/.test(a.p || '')) return 'Unknown pump: ' + a.p;
  const r = tcsShOp(c, a.p, a.op);
  if (r) return r;
  /* live test #62: the last TCS command output of the pump (HMI_DO JYS START / JYP STOP / IKA AUTO / IKH MANUAL, HOLD 3000 ms) */
  (c.do = c.do || {})[a.p] = { op: a.op, t: +AN_UNIT.t || 0 };
  return '';
}
/* 3.2.0 live test #62: the TCS I/O list points of the control oil pumps P-1931A / B and the oil purifier pump P-1941 (iolist-tcs HMI_DI /
   HMI_DO / HMI_AI, unit 1), as the signals of the oil model, so the 036 page can show the status lamps, the faults, the CRT commands and
   the low pressure alarm the TCS has:
     DI  _IIA AUTO, _IIH MANUAL, _YIP STOPPED, _YIR RUNNING, _ABN FAULT, _IEP STOP FAULT, _IES START FAULT, _IET TRIPPED, _IYP CRT OPE
         PERM, _YEE MOTOR ELECTRICAL TROUBLE (P-1941: no IIA / IIH, its AUTO / MANUAL is at the local panel);
     DO  _IKA AUTO, _IKH MANUAL, _IYS CRT AVAILABLE, _JYP STOP, _JYS START, _IKR RESET (HOLD 3000 ms: 1 for 3 s after the command);
     AI  1PTLO1931A_PV / B_PV COP (A) / (B) DISCHARGE OIL PRESS. (FOR COP (B) / (A) AUTO START);
     alarm 1PTLO1931AA_XA "COP (B) DISCHARGE OIL PRESS. (FOR COP (A) AUTO START) LOW" / 1PTLO1931BA_XA = the other pump's discharge at or
         below the auto start of TCE305 CPL A005 (<= 133 kg/cm2g) while that pump runs (NO-SOURCE: which contact drives the auto start is not in the docs; the LOW contact is taken).
   ABN / IEP / IES / IET are the faults of the MOTOR STANDARD of the pump's sheet (tcs-sheets.js), YEE its dead MCC; IYP / IYS (CRT operation
   permitted / available) 1. */
function tcsIO(U) {
  U = U || AN_UNIT;
  const c = tcsOilState(U);
  if (!c) return null;
  tcsOilInit(c);
  const o = {},
    now = +U.t || 0,
    held = (p, op) => !!(c.do && c.do[p] && c.do[p].op === op && now - c.do[p].t <= 3),
    sh = (n, k) => (tcsShNet(n + '.' + k) > 0.5 ? 1 : 0),
    sf = (n, k) => (c.sm && c.sm.mot && c.sm.mot[n] && c.sm.mot[n][k] ? 1 : 0),
    st = (pfx, run, au, mot) => {
      Object.assign(o, {
        [pfx + '_YIR']: run ? 1 : 0,
        [pfx + '_YIP']: run ? 0 : 1,
        [pfx + '_ABN']: sh(mot.replace('.', ':'), 'ABN'),
        [pfx + '_IEP']: sf(mot, 'stf'),
        [pfx + '_IES']: sf(mot, 'sf'),
        [pfx + '_IET']: sf(mot, 'tr'),
        [pfx + '_IYP']: 1,
        [pfx + '_YEE']: mot !== TCS_SH.mot.pur[0] && c.copOff ? 1 : 0,
        [pfx + '_IYS']: 1
      });
      if (au != null) Object.assign(o, { [pfx + '_IIA']: au ? 1 : 0, [pfx + '_IIH']: au ? 0 : 1 });
    };
  ['A', 'B'].forEach((L, i) => {
    const p = '1P1931' + L,
      k = 'cop' + L;
    st(p, c.cop[i], c.copAu[i], TCS_SH.mot[k][0]);
    Object.assign(o, {
      [p + '_JYS']: held(k, 'start') ? 1 : 0,
      [p + '_JYP']: held(k, 'stop') ? 1 : 0,
      [p + '_IKA']: held(k, 'auto') ? 1 : 0,
      [p + '_IKH']: held(k, 'man') ? 1 : 0,
      [p + '_IKR']: 0
    });
    o['1PTLO1931' + L + '_PV'] = +U['loC' + L.toLowerCase()] || 0;
  });
  o['1PTLO1931AA_XA'] = c.cop[1] && o['1PTLO1931B_PV'] <= TCS_OIL.copLo ? 1 : 0;
  o['1PTLO1931BA_XA'] = c.cop[0] && o['1PTLO1931A_PV'] <= TCS_OIL.copLo ? 1 : 0;
  /* the transmitter ABNORMAL / QUALITY points (1PTLO1931A_XA / _PVQ): no transmitter fault in the model */
  Object.assign(o, { '1PTLO1931A_XA': 0, '1PTLO1931B_XA': 0, '1PTLO1931A_PVQ': 0, '1PTLO1931B_PVQ': 0 });
  const pur = !!AN_SRC.field.pur;
  st('1P1941', pur, null, TCS_SH.mot.pur[0]);
  Object.assign(o, { '1P1941_JYS': 0, '1P1941_JYP': 0, '1P1941_IKR': 0 });
  return o;
}
/* the oil state: the TCS model (U.tc, start-up / shutdown) or, at the "Start at 150 MW" start (no TCS model, U.tc null), an oil-only
   state in service (MOP-A / COP-A running, B in AUTO as the standby of TCE300 / TCE305, vapour extractor running) so the 036 page and
   its pumps work there too */
/* Start at 150 MW keeps no ATS program; a turbine trip needs one to come back: the pumps and the trip logic carry over */
function tcsFromOil(U) {
  const o = U.tco;
  tcsInit(U, 'load');
  if (o) Object.assign(U.tc, o);
  U.tc.fromLoad = true;
  U.tco = null;
}
function tcsOilState(U) {
  if (U.tc) return U.tc;
  if (!U.tco) {
    U.tco = { lop: true, eh: true, vex: true, ssfv: true, gse: true, hspAu: true, hso: false, tgAu: false } /* beta.362 D18: the gland seal and the hood spray AUTO in service on load */;
    tcsOilInit(U.tco);
    U.tco.mopAu = [false, true];
    U.tco.copAu = [false, true];
    for (const k of [
      'loPa',
      'loPb',
      'loEop',
      'loBrg',
      'loCa',
      'loCb',
      'loTrip',
      'loVac',
      'loPur',
      'loTin',
      'loTb3',
      'loTb4',
      'loM1',
      'loM2',
      'loM3',
      'loM4'
    ])
      U[k] = NaN;
  }
  return U.tco;
}
/* every step of the unit model, tripped or not (the oil serves a stopped turbine too) */
function tcsOil(U, dt) {
  const c = tcsOilState(U);
  tcsOilInit(c);
  const K = TCS_OIL,
    lag = (k, x) => (U[k] = isFinite(U[k]) ? U[k] + ((x - U[k]) * Math.min(dt, K.tau)) / K.tau : x),
    lube = () => Math.max(U.loPa || 0, U.loPb || 0),
    ctl = () => Math.max(U.loCa || 0, U.loCb || 0);
  /* 3.2.4 unit black-out (elec.js anElecBoStep): the main oil pumps M-1922A / B and the vapour extractor M-1937 are on MCC-EMP11
     (K1AU3E1-0032): their contactors drop with the voltage and EMP-11 is live again on DG1 after AN_EL_BO.emp; then the MOP in AUTO
     starts on its low discharge (TB sheets), the one in MANUAL stays stopped. The control oil pumps P-1931A / B are not on MCC-EMP11:
     they stay stopped while the bus is dead. The EOP P-1923 is DC (DDP-11 battery) and starts on the bearing oil <= 1.05 as before */
  const bo = typeof anElecBoStep === 'function' ? anElecBoStep(U, dt) : { dead: false, emp: true };
  if (bo.dead) {
    c.cop[0] = c.cop[1] = false;
    if (!bo.emp) {
      c.mop[0] = c.mop[1] = false;
      c.vex = false;
    }
  }
  /* beta.362 D18: MCC-EMP11 dead = MOTOR ELECTRICAL TROUBLE of the vapour extractor (IBD TB-12 net 10) */
  c.empOff = !!(bo.dead && !bo.emp);
  c.copOff = !!bo.dead;
  /* the automatic starts are in the TCE / TCA sheets (tcs-sheets.js, at the end of this step) */
  tcsOilSet(c);
  lag('loPa', c.mop[0] ? K.mop : 0);
  lag('loPb', c.mop[1] ? K.mop : 0);
  U.loLube = lube();
  lag('loEop', c.eop ? K.eop : 0);
  lag('loBrg', c.lop ? K.brg : c.eop ? K.brgEop : 0);
  c.brgOk = U.loBrg > K.brgLo || c.lop || c.eop;
  /* the control oil pumps sit on the main oil tank and draw from it (310PB64-455), not from the lube oil header: a COP gives control
     oil without a MOP */
  const suc = true;
  lag('loCa', c.cop[0] && suc ? K.cop : 0);
  lag('loCb', c.cop[1] && suc ? K.cop : 0);
  U.loCtl = Math.max(0, ctl() - (ctl() > 1 ? K.filt : 0));
  /* Mina B6-2, 3.2.3-beta.6: after a good TURBINE RESET of TA-1 the trip oil stayed dumped (it followed only the ATS reset or a running
     turbine), so TA-9 TURBINE TRIP OIL PRESS. VERY LOW tripped the coasting turbine again a minute later. The reset of the trip block
     (IBD TA-1 net TA1_RESET, latched) puts the control oil on the trip oil header, as the reset of the real emergency trip device does */
  let ta1 = false;
  try {
    const ib = tcsIb(c);
    ta1 = !!(ib.v['TA-1'] && ib.v['TA-1'][TA1_RESET] > 0.5);
  } catch (e) {}
  const rst = (U.tc ? c.rst : !!(U.tb && U.tb.st !== 'off')) || ta1;
  lag('loTrip', rst ? U.loCtl : 0);
  lag('loVac', c.vex ? K.vac : 0);
  lag('loPur', typeof AN_SRC !== 'undefined' && AN_SRC.field && AN_SRC.field.pur ? K.pur : 0);
  const Ta = U.Tamb || 30,
    to = tcsPV('TICLO1002'),
    out = isFinite(to) ? to : Ta,
    sp = Math.max(0, Math.min(1, (U.tb ? U.tb.rpm : 0) / 3600)),
    flow = c.lop || c.eop;
  U.loTout = out;
  /* the oil rise (header above): the AN_LO bearing heat / the AN_LO oil m cp (vendor O&M L2 TG 2-3) */
  const rise = flow && typeof AN_LO !== 'undefined' ? (AN_LO.Qb * sp * sp) / AN_LO.Co : 0;
  lag('loTin', out + rise);
  lag('loTb3', out + rise);
  lag('loTb4', out + rise);
  /* 3.2.0-beta (user 2026-10-30 "OK v3 + bearing temp at vibration", 036 TURBINE OIL tab 1): the bearing metal temperatures and the
     shaft vibrations of the TCS I/O list HMI_AI: 1TEST1009 / 1010 (No.1 / 2 turbine journal), 1TEGE1001 / 1002 (No.3 / 4), 0 ~ 150 C;
     1VEST10011 / 12, 10021 / 22, 1VEGE10011 / 12, 10021 / 22 (X / Y), 0 ~ 0.4 mm. Not in the docs (Operation Manual Section 7
     "Limitation items" is printed "Later"; the maintenance manual lists them only as items to watch, p.747 / 751), so DERIVED, no plant
     number (user rule 2026-11-28): journal bearing metal = the oil drain + 25 C x (speed / 3600) (the babbitt to drain difference of a
     tilting pad journal at full speed, vendor practice 20 ~ 30 C), thrust bearing = the oil drain + 10 C; shaft vibration X / Y = 0.04 mm
     x (speed / 3600)^2 on every bearing (half the zone A / B boundary 4800 / sqrt(n) um p-p = 80 um at 3600 r/min of ISO 7919-2 /
     20816-2, a good machine) plus a bump of 0.03 mm (NO-SOURCE height) at the calculated first critical speeds 1510 / 1550 r/min
     (generator / turbine rotor, Operation Manual STIE-14747 8/12, p.42), bell 250 r/min. Without oil + 60 C (NO-SOURCE) x speed / 3600 (no
     film); a lag of 20 s. */
  const rpm = U.tb ? U.tb.rpm : 0,
    crit = 0.03 * Math.exp(-(((rpm - 1530) / 250) ** 2)),
    lagS = (k, x) => (U[k] = isFinite(U[k]) ? U[k] + ((x - U[k]) * Math.min(dt, 20)) / 20 : x);
  [1, 2, 3, 4].forEach(i => lagS('loM' + i, out + (flow ? rise + 25 * sp : 60 * sp)));
  lagS('loThF', out + (flow ? rise + 10 * sp : 60 * sp));
  lagS('loThR', out + (flow ? rise + 10 * sp : 60 * sp));
  const VX = [0.04, 0.04, 0.04, 0.04],
    VY = [0.04, 0.04, 0.04, 0.04];
  VX.forEach((v, i) => {
    U['loVx' + (i + 1)] = v * sp * sp + (rpm > 4 ? crit : 0);
    U['loVy' + (i + 1)] = VY[i] * sp * sp + (rpm > 4 ? 0.8 * crit : 0);
  });
  /* page 13 ATS criteria 1.24 "vibration high": the highest turbine shaft vibration (VIST1001x / 1002x) */
  U.loVt = Math.max(U.loVx1, U.loVy1, U.loVx2, U.loVy2);
  /* the motors: their own sheets TCE300 / 305 / 310, TCA655 / 680 / 700 (tcs-sheets.js) */
  tcsSheets(U, c, dt);
  /* the run states and modes for the 036 page (with or without the TCS model) */
  U.loMop = c.mop.slice();
  U.loMopAu = c.mopAu.slice();
  U.loCop = c.cop.slice();
  U.loCopAu = c.copAu.slice();
  U.loEopR = !!c.eop;
  U.loVex = !!c.vex;
  U.loRst = rst ? 1 : 0;
}
const TCS_ICV = 0.13;
function tcsGcb(U, on) {
  const l1 = U.di && U.di.gcbOn,
    l2 = U.di && U.di.gcbOff,
    w = (l, x) => {
      if (l && l.S.rt.force[l.n] === undefined && l.S.ext.includes(l.n)) l.S.rt.ext[l.n] = x;
    };
  w(l1, on ? 1 : 0);
  w(l2, on ? 0 : 1);
}
/* a turbine trip: the ATS program is reset, the start-up mode is judged again at the next reset (page 12 *1) */
function tcsTrip(U) {
  const c = U.tc;
  if (!c) return;
  tcsGenTrip(U);
  Object.assign(c, { step: -1, cur: -1, ph: '', rst: false, exc: false, auto: false, byp: {} });
  if (c.spd) c.spd.sel = null; /* TCE161: TURBINE TRIP resets the target speed selects */
  if (c.ost) c.ost.main = c.ost.bk = 0; /* TCE176 / 177 OR008: TURBINE TRIP resets the overspeed test mode */
  tcsMode(U);
}
/* what the TCS panel shows */
function tcsState() {
  const U = AN_UNIT,
    c = U.tc;
  if (!c) return null;
  const C = tcsCrit(U);
  return {
    mode: (TCS.modes.find(m => m[0] === c.mode) || [])[2],
    /* 3.2.0-beta.78: the numbers of the ATS mode in use (pages 19 / 20 / 22 / 25), for the CHECK of a start-up from any mode */
    ats:
      c.mode && TCS.rate[c.mode] != null
        ? {
            rate: TCS.rate[c.mode],
            s1800: TCS.soak1800[c.mode],
            s3600: TCS.soak3600[c.mode],
            init: TCS.init[c.mode],
            /* Sakura (Hot restart review): the rolling steam of the mode (criteria 1.3 ~ 1.6, TCS.steam) and the initial load hold (page 25
               Fig. 3), for the Training guide of a Warm / Hot restart */
            steam: TCS.steam[c.mode].slice(),
            hold: TCS.hold(c.mode),
            key: c.mode
          }
        : null,
    step: c.step,
    /* page 13 step 9 SHUT-DOWN: done once the ATS shut-down has tripped the turbine (the trip resets the ATS steps); a TURBINE RESET clears it */
    st9: c.sdDone || c.step >= 8 ? 1 : 0,
    rst: c.rst ? 1 : 0 /* page 13: MSV / RSV open = the turbine reset (criteria 1.21) */,
    stepName: c.step >= 0 ? TCS.names[c.step] : '',
    cur: c.cur,
    curName: c.cur >= 0 ? TCS.names[c.cur] : '',
    ph: c.ph,
    tmMin: c.tm / 60,
    soakMin: c.soakMin,
    holdMin: c.holdMin,
    gen: U.gen ? { f41: U.gen.f41, volt: Math.abs(U.gen.V - 1) <= 0.02, slip: U.gen.slip, th: U.gen.th, sync: U.gen.x25, on25: U.gen.on25, msg: U.gen.last } : null,
    hold: c.hold,
    /* LMYP OTS: the CRT target speed and acceleration (TCE160 ~ 162); null = none selected */
    tspeed: c.spd && c.spd.sel != null ? c.spd.sel : null,
    /* LMYP OTS overspeed test (TCE176 / 177): mode 'main' | 'bk' | '', pattern = the speed above 3600 rpm */
    ost: { main: c.ost && c.ost.main ? 1 : 0, bk: c.ost && c.ost.bk ? 1 : 0, pattern: c.ost ? Math.round((c.ost.pmain || 0) + (c.ost.pbk || 0)) : 0, patMain: c.ost ? Math.round(c.ost.pmain || 0) : 0, patBk: c.ost ? Math.round(c.ost.pbk || 0) : 0, perm: tcsOstPerm(U, 'main') === '' ? 1 : 0, inhibit: tcsOstGov(U).inhibit ? 1 : 0 },
    accel: c.spd ? c.spd.acc : 120,
    rpm: U.tb ? U.tb.rpm : 0,
    Pa: c.Pa,
    Thp: c.Thp,
    Trh: c.Trh,
    Tcvi: c.Tcvi,
    Tcvo: c.Tcvo,
    Tx: c.Tx,
    sexp: c.sexp,
    /* R9 #77: the oil pressures of the TCS panel = the values of the oil model below (TCS_OIL; the EOP starts at <= 1.05, IBD TB-5).
       Stopped: 0 */
    /* 3.2.0-beta.66: the values of the oil model (tcsOil, AN_UNIT lo*): the same numbers as the 036 TURBINE OIL HMI */
    oil: { lube: U.loLube || 0, brg: U.loBrg || 0, ctl: U.loCtl || 0, vac: U.loVac || 0 },
    aux: {
      lop: c.lop,
      eh: c.eh,
      vex: c.vex,
      mop: (c.mop || []).slice(),
      mopAu: (c.mopAu || []).slice(),
      cop: (c.cop || []).slice(),
      copAu: (c.copAu || []).slice(),
      eop: !!c.eop,
      tg: c.tg,
      asv: c.asv,
      gland: c.gland,
      vb: c.vb,
      ej: c.ej,
      hsp: !!c.hspAu /* FV-CD1904 in AUTO */,
      hso: !!c.hso,
      tgAu: !!c.tgAu,
      ssfv: !!c.ssfv,
      gse: !!c.gse,
      auto: c.auto,
      /* 1.0.0-beta.364 (JENNIE, for ROSÉ D18 faceplates): the permissives as the IBD sheets compute them (c.ib.v, tcs-ibd-data.js gates),
         0 / 1, null while the sheet has not run. TB-9: perm = net 6 (A of net 2 and net 5), msvIcv = net 2 (OR BOTH MSV / BOTH ICV
         FULL CLOSE), oil = net 3 BEARING OIL PRESS. NORMAL, hand = net 4 (NOT ZS-LOn003 HAND TURNING INTERLOCK), et = net 24 MOTOR
         ELECTRICAL TROUBLE, man = net 19 (NOT of the AUTO memory FF net 17). TB-12: et = net 10. TC-28: et = net 15, man = net 6 (NOT
         of the FF net 4). TC-31: man = net 3 (NOT FF net 1). TC-35: man = net 11 (NOT FF net 1), load15 = net 7 GEN. LOAD <15% */
      ibd: (() => {
        const v = c.ib && c.ib.v ? c.ib.v : {},
          g = (id, n) => (v[id] && v[id][n] != null ? (v[id][n] > 0.5 ? 1 : 0) : null);
        return {
          'TB-9': { perm: g('TB-9', 6), msvIcv: g('TB-9', 2), oil: g('TB-9', 3), hand: g('TB-9', 4), et: g('TB-9', 24), man: g('TB-9', 19) },
          'TB-12': { et: g('TB-12', 10) },
          'TC-28': { et: g('TC-28', 15), man: g('TC-28', 6) },
          'TC-31': { man: g('TC-31', 3) },
          'TC-35': { man: g('TC-35', 11), load15: g('TC-35', 7) }
        };
      })()
    },
    crit: C,
    byp: Object.keys(c.byp || {}),
    trip: tcsTripState(U),
    next: c.cur < 0 && c.step < 7 ? tcsMiss(U, TCS_A[Math.min(7, c.step + 1)] || []) : ''
  };
}
/* LMYP OTS (JENNIE, TCS study 2026-11-19, user: "Dalawang magkaibang system at hmi at controllers tlga c tcs at dcs"): the GOVERNOR SET and
   the LOAD LIMITER of the TCS CRT, from the Hitachi TCS soft logic 331DM09784 (TCE, read on the PC 2026-11-19; page = index page):
   - TCE196 GOVERNOR CONTROL(2) p.138: GOV SET integrator. In MW CONTROL it follows the GOV CONTROL SIGNAL (TCE195 PI on TARGET MW - GEN MW,
     the model's anTbFlow tb.fd / tb.fy); GOV RAISE / LOWER of the CRT (CRT OPE INC/DEC, rate 1.0 %) sets GOV. MANUAL OPERATION, limits
     107 % / -67.7 %. TCE195 PIV022: its X input tracks GOV SET, so the return to MW CONTROL is bumpless (here: the MW error integral is set
     from the flow demand while in manual).
   - TCE205 LLM CONTROL p.141: LLM SET integrator (TI 0.03 s, HL 102 %, LL -2 %), CRT INC/DEC (rate 1.0 %), LLM MANUAL OPERATION by the CRT.
     AFR LLM FOLLOW ON: LLM follows FLOW DEMAND (TCE206) + 5.0 % (SG022) at 0.05 % per 30 ms cycle (LMS A032) = 1.67 %/s. TCE206 p.140:
     FLOW DEMAND = low select of GOV SET and LLM SET; LOAD LIMITING when the LLM is the lower one.
   - TCE180 p.129: GOV MANUAL and LLM MANUAL are in the reset group of DCS CONTROL MODE (the permissive I.0081 drops).
   Scale: 100 % = flow demand 1.0. TCE191 p.135 note *1: NORMALIZATION 0 ~ 100 % = 0 ~ 150 MW; measured in the model (headless, Start at
   150 MW, 20 min at x300, 2026-11-19): 151.0 MW at flow demand 0.980, CV lift 0.975, drum 133.4 kg/cm2. So the LLM follow value (flow
   demand + 5 %, TCE205 SG022) is 103 % and the LLM sits at its HL 102 %, 4 % over the demand: no limiting in normal operation, as the
   drawing intends (LLM UPPER, TCA533). The model's flow demand above 1.0 (clamp 1.4) is the PRESS COMPENSATE range of TCE206 (LME237
   HL 40 %), which the drawing adds after the low select; here it is inside the one flow demand, so a low main steam pressure at full
   load reaches the LLM at 102 %.
   The state is on U.tb (the 150 MW plant and a Cold start both have it; U.tc exists only after a start-up) */
const TCS_FD = 1.0;
function tcsGovCmd(U, cmd, arg) {
  const tb = U.tb,
    a = arg && typeof arg === 'object' ? arg : { op: arg },
    op = String(a.op || '').toLowerCase(),
    L = (x, lo, hi) => Math.max(lo, Math.min(hi, x)),
    trip = !!(tcsOilState(U) || {}).trip;
  if (!(tb.st === 'sync' || tb.st === 'load')) return 'The generator is not on the line (52G open): the speed control has the governor';
  if (trip) return 'The turbine is tripped';
  const d = isFinite(+a.d) ? +a.d : 1 /* % per press (CRT INC/DEC rate 1.0 %, TCE196 / TCE205) */;
  if (cmd === 'gov') {
    const fd = isFinite(tb.fd) ? tb.fd : 0;
    if (op === 'auto' || op === 'mw') {
      if (!tb.govMan) return '';
      tb.govMan = false;
      tb.gov = NaN;
      if (isFinite(U.MW)) tb.aim = tb.tgt = U.MW;
      return '';
    }
    if (op === 'raise' || op === 'lower' || op === 'set') {
      if (!tb.govMan) {
        tb.govMan = true;
        tb.gov = fd * (tb.gk || 1);
      }
      const x = op === 'set' ? +a.v / 100 : tb.gov + ((op === 'raise' ? 1 : -1) * d * TCS_FD) / 100;
      if (!isFinite(x)) return 'GOV SET: no value';
      tb.gov = L(x, (-67.7 * TCS_FD) / 100, (107 * TCS_FD) / 100) /* TCE196 SG C010 / C013 K 107.0, SG C015 / C017 K -67.7 */;
      return '';
    }
    if (op === 'man') {
      if (!tb.govMan) (tb.govMan = true), (tb.gov = fd * (tb.gk || 1));
      return '';
    }
    return 'GOV: raise, lower, set, man or auto';
  }
  if (cmd === 'llm') {
    if (!isFinite(tb.llm)) tb.llm = TCS_FD * 1.02;
    if (op === 'auto' || op === 'follow') {
      tb.llmMan = false;
      return '';
    }
    if (op === 'raise' || op === 'lower' || op === 'set') {
      tb.llmMan = true;
      const x = op === 'set' ? (+a.v * TCS_FD) / 100 : tb.llm + ((op === 'raise' ? 1 : -1) * d * TCS_FD) / 100;
      if (!isFinite(x)) return 'LLM SET: no value';
      tb.llm = L(x, (-2 * TCS_FD) / 100, (102 * TCS_FD) / 100);
      return '';
    }
    if (op === 'man') {
      tb.llmMan = true;
      return '';
    }
    return 'LLM: raise, lower, set, man or auto';
  }
  return null;
}
/* one scan of the GOV SET / LLM SET (called by anTbFlow with the flow demand fd before the LLM select); returns the flow demand after the
   low select of TCE206. TCE206 p.140: LSG009 (GOV path, LLM SET) comes BEFORE ADD010 PRESS COMPENSATE (LME237): the GOV SET and the LLM are
   in load (steam flow at the rated pressure), the compensation turns that into valve opening. Steam flow through the CVs is about
   proportional to opening x main steam pressure (choked nozzle; this model solves the CVs in series with the HP blading, turbine.js
   tbMsFlow), so the load-equivalent GOV path = fd x MSP / MSP at the
   150 MW anchor (U.Pms / U.P0), and the flow demand after the select = that over the same ratio. So a low main steam pressure at full
   load opens the valves past 100 % without the LLM cutting it, as on the drawing */
function tcsGovLlm(U, tb, fd, dt) {
  const L = (x, lo, hi) => Math.max(lo, Math.min(hi, x)),
    hi = (102 * TCS_FD) / 100,
    lo = (-2 * TCS_FD) / 100,
    k = U.P0 > 0 && U.Pms > 0 ? L(U.Pms / U.P0, 0.3, 1.5) : 1,
    g = fd * k;
  tb.gk = k;
  if (!isFinite(tb.llm)) tb.llm = hi;
  if (!tb.llmMan) {
    const r = (1.67 * TCS_FD * dt) / 100;
    tb.llm = L(tb.llm + L(L(g + (5 * TCS_FD) / 100, lo, hi) - tb.llm, -r, r), lo, hi);
  }
  tb.lim = g > tb.llm;
  /* TCE196 (GOV follow, ADD041 LLM SET + SG040 K 5.0 %) with TCE172 CHANGE OVER (MW CONTROL (LLM)): while the LLM limits, the GOV SET is
     held at LLM SET + 5 %, so it does not wind up and takes over again as soon as the LLM is raised over the load demand */
  if (tb.lim && !tb.govMan) tb.fd = Math.min(tb.fd, (tb.llm + (5 * TCS_FD) / 100) / k);
  return Math.min(g, Math.max(0, tb.llm)) / k;
}
/* the CRT numbers of the GOV / LLM (TCS station pages) */
function tcsGovState(U) {
  const tb = U && U.tb;
  if (!tb) return null;
  const p = x => (isFinite(x) ? (100 * x) / TCS_FD : null);
  return {
    gov: p(tb.govMan ? tb.gov : tb.fd * (tb.gk || 1)) /* GOV SET, load equivalent (before the press compensation) */,
    fd: p(tb.fd) /* flow demand to the valves */,
    govMan: !!tb.govMan,
    llm: p(isFinite(tb.llm) ? tb.llm : (102 * TCS_FD) / 100),
    llmMan: !!tb.llmMan,
    limiting: !!tb.lim,
    target: isFinite(tb.aim) ? tb.aim : null,
    ramp: isFinite(tb.tgt) ? tb.tgt : null,
    rate: isFinite(U.rateUp) ? (U.rateUp * 100) / 150 : null
  };
}
/* ===== TURBINE VALVE TESTS (LMYP OTS, TCS engine): TCE220 MSV TEST (p.150), TCE222 CV TEST (p.151), TCE224 MSV/CV TEST STATE (p.152),
   TCE250 MAIN STOP VALVE FULL CLOSE (p.156) of 331DM09784 "SOFT LOGIC DIAGRAM OF TCS".
   - Two main stop valves MSV(A) / (B), each in series with its control valve group CV(A) / (B) (T/G Modbus ZT-ST1903-A / B MSV, ZT-ST1904-A / B
     CV positions). Each side passes half of the steam: the model's one CV lift U.gv is split into side A and side B.
   - One test at a time (TCE224: every test permissive = NOT any other test state); any test on = TURBINE VALVE TEST (TCE224_1).
   - MSV PARTIAL CLOSE TEST (TCE220): the MSV strokes to 85 % open (MSV POSITION CPL HL 86 % / LL 85 %) and back; the other MSV must be full
     open (TCE123 / TCE121). Closing and opening speed for the partial test 0.56 %/s (TCE210 / 211
     SG A030 / A033; the IBD note "100 %/180 s OR LESS DURING THE PARTIAL VALVE TEST", _notes/tg-inertia-2026-11-12.txt). TP 200 s (LME252).
   - MSV/CV FULL CLOSE TEST (TCE220 FTEST, TCE224 "MSV/CV(A) FULL CLOSE TEST STATE"): the side's CVs close first at the test rate 0.56 %/s
     (TCE211 SG A031 ~ A035), slow enough for the MW loop (TCE195, flow demand 1 %/s) to open the other side, then 2 s later the MSV closes
     at 10 %/s (TCE210 SG C016, TD A036). Only at
     GENERATOR LOAD <= 75 MW (CPL HL 78 / LL 75 MW): one CV group open alone passes half the steam at a lift of 1.0, so above half load the
     other side cannot carry it (the CV lift is limited to 140 %). FULL OPEN reopens the MSV, then the CVs. Both MSVs closed = TURBINE
     TRIP (TCE250 A002), which the one-test rule prevents.
   - CV PARTIAL CLOSE TEST (TCE222): the CV group closes 10 % from the opening held at the start (CPL HL -9 % / LL -10 %) and reopens;
     <= 75 MW (CPL C007 HL 78 / LL 75 MW), TP 200 s. CV FULL CLOSE / FULL OPEN PBs (nSV-STn904) close the group to 0 and back.
   - Test permissive common to all (TCE220 / 222): TRANSFER REGION COMPLETE(IP) (TCE184; here the ICV -> CV transfer of the model, tb.xfer),
     not GENERATOR LOAD ABNORMAL, turbine not tripped, 52G closed.
   - Series flow of MSV and CV: the flow area of a side = the smaller of the CV lift and the MSV opening; the MSV full open area is taken as
     the CV group's at its 140 % lift (derived: a stop valve passes the full CV flow without throttling, so the 85 % partial stroke of
     TCE220, done at any load, takes no MW; 0.85 x 1.4 = 1.19 > the CV lift of 0.975 at 150 MW) ===== */
/* the valve speeds during a test (TCE210 / TCE211 MSV(A) / (B) CONTROL, TCE212 CV(A), (B) CONTROL): CV opening and closing rate DURING CV TEST
   SG A031 ~ A035 K 0.56 %/s (else 10 %/s); MSV OPENING / CLOSING SPEED FOR PARTIAL TEST SG A030 / A033 K 0.56 %/s (= the IBD "100 %/180 s");
   MSV OPENING / CLOSING SPEED FOR FULL CLOSE TEST SG C014 / C016 K 10 %/s. The MSV of a full close test starts to close 2.0 s (TD A036)
   after its CVs reach the test position (MSV/CV FULL CLOSE TEST STATE AND CV TEST POSITION) */
const TCS_VT_SLOW = 0.0056,
  TCS_VT_FAST = 0.1;
const TCS_VT_ON = { msvA: 'MSV(A)', msvB: 'MSV(B)', cvA: 'CV(A)', cvB: 'CV(B)', crvA: 'CRV(A)', crvB: 'CRV(B)' };
/* CRV (combined reheat valve: RSV + ICV) TEST, TCE226 CRV TEST(1) (p.153), TCE227 CRV TEST(2) (p.154), TCE214 ICV(A), (B) CONTROL (p.147):
   - PERM: CRV(A) FULL CLOSE TEST PERMISSIVE (TCE224, one test at a time), TRANSFER REGION COMPLETE(IP), RSV(B) POSITION >= 98 % (CMP 97 / 98 %).
     No load limit on the sheets (the other side passes the IP steam, below).
   - CRV(A) TEST PB ON -> ICV(A) TEST SIGNAL (TCE227 OR002) -> the ICV closes at the valve test speed 10 %/s (TCE214 SG 016 / 018) to the
     ICV TEST POSITION (CPL 10 / 11 %); then, after TD A019 1.0 s, ICV(A) FAST ACTING (TEST) dumps it shut (the fast-acting speed AN_TBV.icvOpc, turbine.js);
     then the CRV(A) TEST COMMAND closes RSV(A) the same way (LME250 TP 5 s: the RSV must move at once); at RSV(A) FULL CLOSE (CPL 2 / 3 %)
     the test is complete (COMP), the RSV reopens (the reset opening speed of the stop valves of tcs-trip.js tcsValves, 10 s full stroke,
     inside the 10 ~ 40 s of the vendor) and, once RSV(A) is FULL OPEN, the ICV test signal goes off and the ICV reopens at 10 %/s.
     TP 60 s (LME250): an RSV not closed in 60 s cancels the test.
   - Flow: the IP steam (unit.js qip = m0 x reheat pressure x ICV) passes the two ICV / RSV sides in parallel, then the IP nozzles in series.
     The ICV pair loss at rated flow is taken as 2 % of the reheat pressure: heat balance 310SD09-053 (PPE-14-0725 R1, case 2 127.5 MW) gives
     the HP exhaust 32.89 ata and the IP inlet 29.60 ata, a reheat system loss of 10 %; of it the stop / intercept valves are the usual 2 %
     (the reheater and its pipes the rest). With the loss dp = k (q / a)^2 of the valve area a (1 = both sides full open) in series with the
     IP section (flow proportional to its inlet pressure): q (1 + k / a^2) = P, k = 0.02 / 0.98^2 = 0.0208, so the flow at a given reheat
     pressure is (1 + k) / (1 + k / a^2) of the rated one: one side shut (a = 0.5) passes 94 %, the reheat pressure rises about 6 % */
const TCS_VT_K = 0.02 / (0.98 * 0.98);
function tcsVtIcvF(U) {
  const vt = U.tb && U.tb.vt;
  if (!vt || vt.iA == null || (vt.iA >= 1 && vt.iB >= 1 && vt.rA >= 1 && vt.rB >= 1)) return 1;
  const a = 0.5 * (Math.min(vt.iA, vt.rA) + Math.min(vt.iB, vt.rB));
  return a <= 0 ? 0 : (1 + TCS_VT_K) / (1 + TCS_VT_K / (a * a));
}
/* the ICV / RSV of a side as the CRV test leaves it, 0 ~ 1 (times tb.icv / the trip oil position) */
function tcsVtIcvS(U, s) {
  const vt = U.tb && U.tb.vt;
  return vt && vt['i' + s] != null ? vt['i' + s] : 1;
}
function tcsVtRsv(U, s) {
  const vt = U.tb && U.tb.vt;
  return vt && vt['r' + s] != null ? vt['r' + s] : 1;
}
function tcsVt(U) {
  const tb = U.tb || (U.tb = {});
  if (!tb.vt || typeof tb.vt !== 'object') tb.vt = { sel: null, op: null, ph: null, t: 0, mA: 1, mB: 1, dA: 0, dB: 0, lo: false, cv0: null };
  if (tb.vt.iA == null) Object.assign(tb.vt, { iA: 1, iB: 1, rA: 1, rB: 1 }); /* the CRV test (a test state from before it) */
  return tb.vt;
}
/* the flow area of one side: the smaller of its CV group lift and its MSV opening (MSV full open = the CV area at 140 % lift) */
function tcsVtSide(U, s) {
  const g = +U.gv || 0,
    vt = U.tb && U.tb.vt;
  if (!vt) return g;
  return Math.max(0, Math.min(g - vt['d' + s], 1.4 * vt['m' + s]));
}
/* the CV lift of a side (the T/G Modbus CV position, 0 ~ 1.05): the TCS position demand FG 003 / 036 of its flow demand (turbine.js tbCvLift) */
function tcsVtCv(U, s) {
  const vt = U.tb && U.tb.vt;
  return tbCvLift(U, s, Math.max(0, (+U.gv || 0) - (vt ? vt['d' + s] : 0)));
}
/* the MSV opening of a side as the test leaves it, 0 ~ 1 (the trip oil position tcsVp of tcs-trip.js multiplies it) */
function tcsVtMsv(U, s) {
  const vt = U.tb && U.tb.vt;
  return vt ? vt['m' + s] : 1;
}
function tcsVtLog(t) {
  try {
    if (typeof lsEventAdd === 'function') lsEventAdd('TCS', 'TCS', 'VALVE TEST: ' + t);
  } catch (e) {}
}
/* the permissive of a test: '' = allowed, else why not */
function tcsVtPerm(U, v, op) {
  const tb = U.tb || {},
    vt = tcsVt(U),
    o = v.slice(-1) === 'A' ? 'B' : 'A';
  if (tcsOilState(U).trip) return 'the turbine is tripped';
  if (tb.st !== 'load') return '52G is not closed';
  if (!tb.xfer) return 'TRANSFER REGION COMPLETE is not on';
  if (!isFinite(U.MW)) return 'GENERATOR LOAD ABNORMAL';
  if (vt.sel && vt.sel !== v) return TCS_VT_ON[vt.sel] + ' test is on (one test at a time)';
  if (vt.sel === v) return TCS_VT_ON[v] + ' test is already on';
  if (vt.dA || vt.dB || vt.mA < 1 || vt.mB < 1 || vt.iA < 1 || vt.iB < 1 || vt.rA < 1 || vt.rB < 1) return 'a valve is still closed: press its FULL OPEN first';
  if (v.startsWith('crv')) return vt['r' + o] < 0.98 ? 'RSV(' + o + ') is not full open' : op === 'close' ? '' : 'the CRV test has one PB (TEST)';
  if (((v.startsWith('msv') && op === 'close') || v.startsWith('cv')) && !vt.lo) return 'GENERATOR LOAD is over 75 MW';
  if (v.startsWith('msv') && op === 'partial' && vt['m' + o] < 1) return 'MSV(' + o + ') is not full open';
  return '';
}
/* CRT PBs: AN.turbine('vtest', { v: 'msvA' | 'msvB' | 'cvA' | 'cvB', op: 'partial' | 'close' | 'open' | 'cancel' }) */
function tcsVtCmd(U, arg) {
  const a = arg || {},
    v = a.v,
    op = a.op,
    vt = tcsVt(U);
  if (!TCS_VT_ON[v]) return 'Unknown valve: ' + v;
  if (op === 'open' || op === 'cancel') {
    const s = v.slice(-1),
      shut = v.startsWith('crv') ? vt['i' + s] < 1 || vt['r' + s] < 1 : vt['d' + s] > 0 || vt['m' + s] < 1;
    if (vt.sel !== v && !shut) return TCS_VT_ON[v] + ' is not under test';
    if (vt.sel && vt.sel !== v) return TCS_VT_ON[vt.sel] + ' test is on (one test at a time)';
    Object.assign(vt, { sel: v, op: vt.op || 'close', ph: v.startsWith('crv') ? 'rsvo' : 'reopen', t: 0 });
    tcsVtLog(TCS_VT_ON[v] + (op === 'cancel' ? ' TEST CANCEL' : ' FULL OPEN'));
    return '';
  }
  if (op !== 'partial' && op !== 'close') return 'Unknown test: ' + op;
  const r = tcsVtPerm(U, v, op);
  if (r) return r;
  Object.assign(vt, { sel: v, op, t: 0, cv0: null, ph: v.startsWith('crv') ? 'icv' : v.startsWith('msv') && op === 'partial' ? 'msv' : 'cv' });
  tcsVtLog(TCS_VT_ON[v] + (op === 'partial' ? ' PARTIAL CLOSE TEST' : ' FULL CLOSE TEST') + ' start');
  return '';
}
/* one scan of the valve tests (unit.js anUnitStep, every model step) */
function tcsVtStep(U, dt) {
  const tb = U.tb;
  if (!tb) return;
  const vt = tcsVt(U);
  /* GENERATOR LOAD <= 75 MW, back above 78 MW (CPL HL 78 / LL 75 of TCE220 C003 and TCE222 C007) */
  if (isFinite(U.MW)) vt.lo = U.MW <= 75 ? true : U.MW >= 78 ? false : vt.lo;
  /* a trip or a 52G open ends any test: the trip oil closes every valve, the reset opens them full (tcs-trip.js tcsValves) */
  if (tb.st !== 'load' || tcsOilState(U).trip) {
    if (vt.sel || vt.dA || vt.dB || vt.mA < 1 || vt.mB < 1 || vt.iA < 1 || vt.iB < 1 || vt.rA < 1 || vt.rB < 1) {
      if (vt.sel) tcsVtLog(TCS_VT_ON[vt.sel] + ' test ended by the turbine trip / 52G open');
      Object.assign(vt, { sel: null, op: null, ph: null, t: 0, mA: 1, mB: 1, dA: 0, dB: 0, cv0: null, iA: 1, iB: 1, rA: 1, rB: 1 });
    }
    return;
  }
  if (vt.sel && vt.sel.startsWith('crv')) return tcsVtCrv(U, vt, dt);
  if (!vt.sel) return;
  const v = vt.sel,
    s = v.slice(-1),
    d = 'd' + s,
    m = 'm' + s,
    rc = TCS_VT_SLOW * dt,
    rm = (vt.op === 'partial' ? TCS_VT_SLOW : TCS_VT_FAST) * dt,
    msv = v.startsWith('msv');
  vt.t += dt;
  /* the load rose to 78 MW during a full close or CV test: the permissive of LME252 / 253 is lost, TEST CANCEL */
  if (vt.ph !== 'reopen' && (vt.op === 'close' || !msv) && !vt.lo) {
    Object.assign(vt, { ph: 'reopen', t: 0 });
    tcsVtLog(TCS_VT_ON[v] + ' test cancelled: GENERATOR LOAD over 78 MW');
  }
  /* TP 200 s of LME252 / 253: a partial stroke that does not reach its position is cancelled */
  if (vt.op === 'partial' && vt.ph !== 'reopen' && vt.t > 200) {
    Object.assign(vt, { ph: 'reopen', t: 0 });
    tcsVtLog(TCS_VT_ON[v] + ' test cancelled: position not reached in 200 s');
  }
  if (vt.ph === 'msv') {
    /* the MSV strokes to 85 % (partial), or to full close once its CVs are shut */
    const end = vt.op === 'partial' ? 0.85 : 0;
    vt[m] = Math.max(end, vt[m] - rm);
    if (vt[m] <= end) {
      if (vt.op === 'partial') vt.ph = 'reopen';
      else {
        vt.ph = 'held';
        tcsVtLog(TCS_VT_ON[v] + ' FULL CLOSE');
      }
    }
  } else if (vt.ph === 'msvw') {
    /* TD A036 2.0 s after the CV test position */
    vt.tw = (vt.tw || 0) + dt;
    if (vt.tw >= 2) vt.ph = 'msv';
  } else if (vt.ph === 'cv') {
    /* the CV group closes at the test rate 0.56 %/s: 10 % from its opening (partial, CPL -10 %), or to full close (the lift offset 1.4 covers any lift) */
    if (vt.cv0 == null) vt.cv0 = +U.gv || 0;
    const end = vt.op === 'partial' ? 0.1 : 1.4;
    vt[d] = Math.min(end, vt[d] + rc);
    /* full close: the CVs are shut once the lift is 0 (CV(A) FULL CLOSE CPL 2 / 3 %); the offset then goes to 1.4 so a rising demand keeps them shut */
    if (vt.op !== 'partial' && (+U.gv || 0) - vt[d] <= 0) vt[d] = 1.4;
    if (vt[d] >= end) {
      if (vt.op === 'partial') vt.ph = 'reopen';
      else if (msv) {
        vt.ph = 'msvw';
        vt.tw = 0;
      }
      else {
        vt.ph = 'held';
        tcsVtLog(TCS_VT_ON[v] + ' FULL CLOSE');
      }
    }
  } else if (vt.ph === 'reopen') {
    /* the MSV first (10 %/s after a full close, 0.56 %/s in a partial test), then the CV group (0.56 %/s) */
    if (vt[m] < 1) vt[m] = Math.min(1, vt[m] + rm);
    else if (vt[d] > 0) vt[d] = Math.max(0, Math.min(vt[d], +U.gv || 0) - rc); /* from the shut position, not from the 1.4 offset */
    else {
      tcsVtLog(TCS_VT_ON[v] + ' full open, test complete');
      Object.assign(vt, { sel: null, op: null, ph: null, t: 0, cv0: null });
    }
  }
}
/* one scan of the CRV test (TCE226 / 227 sequence, above) */
function tcsVtCrv(U, vt, dt) {
  const v = vt.sel,
    s = v.slice(-1),
    i = 'i' + s,
    r = 'r' + s,
    fast = dt / AN_TBV.icvOpc;
  vt.t += dt;
  if ((vt.ph === 'icv' || vt.ph === 'icvw' || vt.ph === 'rsv') && vt.t > 60) {
    Object.assign(vt, { ph: 'rsvo', t: 0 });
    tcsVtLog(TCS_VT_ON[v] + ' test cancelled: RSV not closed in 60 s');
  }
  if (vt.ph === 'icv') {
    vt[i] = Math.max(0.1, vt[i] - TCS_VT_FAST * dt);
    if (vt[i] <= 0.1) Object.assign(vt, { ph: 'icvw', tw: 0 });
  } else if (vt.ph === 'icvw') {
    /* TD A019 1.0 s, then ICV FAST ACTING (TEST) */
    vt.tw = (vt.tw || 0) + dt;
    if (vt.tw >= 1) vt[i] = Math.max(0, vt[i] - fast);
    if (vt[i] <= 0) vt.ph = 'rsv';
  } else if (vt.ph === 'rsv') {
    vt[r] = Math.max(0, vt[r] - fast);
    if (vt[r] <= 0) {
      tcsVtLog(TCS_VT_ON[v] + ' RSV and ICV FULL CLOSE, test complete');
      Object.assign(vt, { ph: 'rsvo', t: 0 });
    }
  } else if (vt.ph === 'rsvo') {
    if (vt[i] > 0 && vt[r] >= 1) vt.ph = 'icvo';
    else if (vt[r] < 1) vt[r] = Math.min(1, vt[r] + dt / 10);
    else vt.ph = 'icvo';
  } else if (vt.ph === 'icvo') {
    vt[i] = Math.min(1, vt[i] + TCS_VT_FAST * dt);
    if (vt[i] >= 1) {
      tcsVtLog(TCS_VT_ON[v] + ' full open');
      Object.assign(vt, { sel: null, op: null, ph: null, t: 0 });
    }
  }
}
function tcsVtState(U) {
  if (!U || !U.tb) return null;
  const vt = tcsVt(U),
    p = x => Math.round(Math.min(100, 100 * x) * 10) / 10,
    perm = {};
  for (const v of ['msvA', 'msvB', 'cvA', 'cvB']) for (const op of ['partial', 'close']) perm[v + ':' + op] = tcsVtPerm(U, v, op);
  for (const v of ['crvA', 'crvB']) perm[v + ':close'] = tcsVtPerm(U, v, 'close');
  return {
    on: !!vt.sel /* TURBINE VALVE TEST (TCE224_1) */,
    sel: vt.sel,
    op: vt.op,
    ph: vt.ph,
    t: vt.t,
    lowLoad: !!vt.lo,
    msvA: p(tcsStop(U, tcsVtMsv, 'A')),
    msvB: p(tcsStop(U, tcsVtMsv, 'B')),
    cvA: p(tcsVtCv(U, 'A')),
    cvB: p(tcsVtCv(U, 'B')),
    icvA: p((U.tb.icv || 0) * tcsVtIcvS(U, 'A')),
    icvB: p((U.tb.icv || 0) * tcsVtIcvS(U, 'B')),
    rsvA: p(tcsStop(U, tcsVtRsv, 'A')),
    rsvB: p(tcsStop(U, tcsVtRsv, 'B')),
    perm
  };
}

/* ---------------------------------------------------------------------------------------------------------------------------------
   LMYP OTS OVERSPEED TEST (Hitachi TCS soft logic 331DM09784, TCE176 OVERSPEED TEST (MAIN), TCE177 OVERSPEED TEST (SUB = BK-UP),
   TCE178 OVERSPEED / SPEED SWING, TCE145 BACK UP GOVERNOR; the trips are IBD TA-15 TRIP LOGIC (7) of tcs-ibd-data.js).
   Per test (MAIN / BK-UP the same drawing):
   - A001 = CRT ON PB AND CRT AVAILABLE; A003 = A001 AND GOVERNING MODE (TCE167) AND NOT007 (NOT OR008 (TURBINE TRIP, 52G CLOSE))
     -> S of FFR004 (reset dominant). OR009 -> R: OR008, A013 (CRT OFF PB AND CRT AVAILABLE), TD A018 30.0 s of the OTHER test's
     mode (T = INITIAL). So a second test pressed while one is on resets the first after 30 s.
   - OVERSPEED TEST INHIBIT (lamp) = NOT016 (A015 (NOT007 AND GOVERNING MODE)).
   - Pattern (speed above the target): ASW022 = MODE ? SG A020 x G A021 36.0 (rpm per %): MAIN 11.5 % = 414 rpm, BK-UP 12.0 % =
     432 rpm : sys.ref 0.0 -> RL A023 (T = INITIAL). Rates PA2 023: increase = ASW028 (A024 = MODE AND LCK A026 (pattern - SG C027
     <= 0 rpm) ? HIGH : LOW), decrease = HIGH (through FTR 031). HIGH = SG A029 360 rpm/min x G 0.01667 = 6 rpm/s, LOW = SG A032
     120 rpm/min x 0.01667 = 2 rpm/s. RATE CHANGE SPEED SET (OFF-SET) SG C027: MAIN 288 rpm, BK-UP 216 rpm.
   - TCE178 ADD024 = MAIN + BK-UP pattern = OVERSPEED TEST PATTERN -> TCE206: added to the speed reference; off the line the speed
     governor holds the turbine on its reference (dead band 7.2 rpm), so the speed follows the target + pattern.
   - The trips are the drawing's own: MAIN = electrical overspeed 110.5 % (3978 rpm, TA-15 SE-STn001-4/5/6, 2 out of 3); BK-UP =
     back-up governor 111.75 % (4023 rpm, TA-15 SE-STn001-1/2/3) with TCE145 ADD002 / 015 / 018 + SG D019 108.0 rpm while OVER SPEED
     TEST MODE (BK-UP) (ASW020, else SG D023 0.0): the BK-UP test trips at 4023 - 108 = 3915 rpm (tcs-trip.js TCS_IBD_PV).
   - GOVERNING MODE is read here as: the turbine reset and rolling off the line with no ATS step running (TCE167, its own sheet
     still to be typed).
   --------------------------------------------------------------------------------------------------------------------------------- */
const TCS_OST = {
  main: { max: 11.5 * 36, chg: 288, name: 'OVERSPEED TEST (MAIN)' },
  bk: { max: 12.0 * 36, chg: 216, name: 'OVERSPEED TEST (BK-UP)' },
  hi: 360 * 0.01667,
  lo: 120 * 0.01667,
  td: 30,
  bias: 108
};
function tcsOst(c) {
  if (!c.ost || c.ost.main == null) c.ost = { main: 0, bk: 0, pmain: 0, pbk: 0, tmain: 0, tbk: 0 };
  return c.ost;
}
const tcsOstOn = c => !!(c && c.ost && (c.ost.main || c.ost.bk || c.ost.pmain > 0 || c.ost.pbk > 0));
/* the state of OR008 / GOVERNING MODE of the drawing */
function tcsOstGov(U) {
  const c = U.tc,
    tb = U.tb;
  const or008 = !!(c && c.trip) || tb.st === 'sync' || tb.st === 'load';
  const gov = !!(c && c.rst) && tb.st === 'roll' && !(c.cur >= 0);
  return { or008, gov, inhibit: !(!or008 && gov) };
}
/* LMYP OTS (JENNIE, TCE live reads): the engine's own state, flat, for the TCE soft logic sheets of the Logic page (02d-tce.js q.live). Every
   value is the one the engine already holds and uses; nothing is decided here. A sheet shows these on the wires it names and nothing else, so
   the Logic page never runs a second copy of the TCS logic (one plant, one logic) */
function tcsLiveRead(U) {
  const c = U && U.tc,
    tb = U && U.tb;
  if (!c || !tb) return null;
  const g = tcsOstGov(U),
    o = c.ost || {},
    sel = c.spd && c.spd.sel != null ? c.spd.sel : null,
    G = tcsGovState(U),
    gn = U.gen || {};
  return {
    trip: c.trip ? 1 : 0 /* TURBINE TRIP */,
    rst: c.rst ? 1 : 0 /* turbine reset (MSV / RSV open) */,
    g52: tb.st === 'sync' || tb.st === 'load' ? 1 : 0 /* 52G CLOSE */,
    byp: tcsBypDcs() ? 1 : 0 /* HP / LP BYPASS CONTROL IN AUTO from the DCS (DITL-115 row 16, TCA043 DI 8, TCA532 A8) */,
    hpbCl: tcsDitlOut('DITL-115', /^HP BYPASS VALVE FULL CLOSE/) ? 1 : 0 /* HP BYPASS VALVE FULL CLOSE (DITL-115 row 15 ZSC-MS1020, TCA532 B11) */,
    gov: g.gov ? 1 : 0 /* GOVERNING MODE as the overspeed test reads it (TCE176 / 177) */,
    or008: g.or008 ? 1 : 0 /* TURBINE TRIP or 52G CLOSE (TCE176 / 177 OR008) */,
    ostInh: g.inhibit ? 1 : 0 /* OVERSPEED TEST INHIBIT */,
    auto: c.auto ? 1 : 0 /* ATS AUTO(C) */,
    rpm: tb.rpm /* TURBINE SPEED, rpm */,
    accel: c.spd ? c.spd.acc : null /* TARGET ACCELERATION RATE held by the CRT selection (TCE160), rpm/min; null = none */,
    tsel: sel /* the CRT target speed select (TCE161 / 162): 0 CLOSE VALVES, 200, 1800, 2700, 3600; null = none */,
    tspd: sel > 0 ? sel : 0 /* TARGET SPEED out of TCE162 (0 with no speed select) */,
    tselAny: sel > 0 ? 1 : 0 /* a speed select is held */,
    ostMain: o.main ? 1 : 0,
    ostBk: o.bk ? 1 : 0,
    patMain: +o.pmain || 0 /* overspeed test pattern (MAIN), rpm above the target */,
    patBk: +o.pbk || 0,
    /* TCE250 / TCE224: the valve positions (tcsStop: MSV / RSV by the trip oil and the valve test; tcsVtCv, the ICV of side A / B); full close = at 0 */
    msvAc: tcsStop(U, tcsVtMsv, 'A') <= 0 ? 1 : 0,
    msvBc: tcsStop(U, tcsVtMsv, 'B') <= 0 ? 1 : 0,
    cvAc: tcsVtCv(U, 'A') <= 0 ? 1 : 0,
    cvBc: tcsVtCv(U, 'B') <= 0 ? 1 : 0,
    rsvAc: tcsStop(U, tcsVtRsv, 'A') <= 0 ? 1 : 0,
    rsvBc: tcsStop(U, tcsVtRsv, 'B') <= 0 ? 1 : 0,
    icvAc: (tb.icv || 0) * tcsVtIcvS(U, 'A') <= 0 ? 1 : 0,
    icvBc: (tb.icv || 0) * tcsVtIcvS(U, 'B') <= 0 ? 1 : 0,
    l52o: U.el && U.el.l52 === false ? 1 : 0 /* 52L OPEN (elec.js) */,
    l52c: U.el && U.el.l52 === true ? 1 : 0 /* 52L CLOSE (elec.js) */,
    /* TCE185 / 194: TRANSFER REGION COMPLETE = the ICV -> CV transfer of the model (tb.xfer); TCE190 / 191 / 194: GENERATOR LOAD, MW */
    xfer: tb.xfer ? 1 : 0,
    mw: isFinite(U.MW) ? U.MW : null,
    vtOn: tb.vt && tb.vt.sel ? 1 : 0 /* TURBINE VALVE TEST (TCE224_1) */,
    /* TCE210 / 211 / 212: the valve under test (tcsVtCmd: msvA, msvB, cvA, cvB, crvA, crvB; '' = none), read as 'vtSel=msvA' */
    vtSel: (tb.vt && tb.vt.sel) || '',
    /* TCE196 / 205 / 206: the GOV SET and LLM SET integrators and the flow demand of the governor model (tcsGovState), % */
    govSet: G ? G.gov : null,
    llmSet: G ? G.llm : null,
    fd: G ? G.fd : null,
    govMan: G && G.govMan ? 1 : 0 /* GOV. MANUAL OPERATION */,
    llmMan: G && G.llmMan ? 1 : 0 /* LLM MANUAL OPERATION */,
    limiting: G && G.limiting ? 1 : 0 /* LOAD LIMITING */,
    /* TCE300 / 305 / 310: the oil pumps of the oil model (tcsOil): running, and the discharge / bearing oil pressures, kg/cm2g */
    mopA: c.mop && c.mop[0] ? 1 : 0,
    mopB: c.mop && c.mop[1] ? 1 : 0,
    copA: c.cop && c.cop[0] ? 1 : 0,
    copB: c.cop && c.cop[1] ? 1 : 0,
    eop: c.eop ? 1 : 0,
    mopPa: isFinite(U.loPa) ? U.loPa : null,
    mopPb: isFinite(U.loPb) ? U.loPb : null,
    copPa: isFinite(U.loCa) ? U.loCa : null,
    copPb: isFinite(U.loCb) ? U.loCb : null,
    eopP: isFinite(U.loEop) ? U.loEop : null,
    brgLow: isFinite(U.loBrg) && U.loBrg <= TCS_OIL.brgLo ? 1 : 0 /* the bearing oil low of the EOP auto start (tcsOil) */,
    /* the ATS steps (tcsStep): the step being executed (-1 none, read as 'atsCur=n') and done0 .. done7 = STEP n COMPLETED (TCA520 .. TCA527, MD FINISH) */
    atsCur: c.cur,
    done0: c.step >= 0 ? 1 : 0,
    done1: c.step >= 1 ? 1 : 0,
    done2: c.step >= 2 ? 1 : 0,
    done3: c.step >= 3 ? 1 : 0,
    done4: c.step >= 4 ? 1 : 0,
    done5: c.step >= 5 ? 1 : 0,
    done6: c.step >= 6 ? 1 : 0,
    done7: c.step >= 7 ? 1 : 0,
    /* the generator side (tcs-gen.js tcsGenStep), read only: U.gen as it is (none before the first scan = all 0). SH-G-1A / 1B / 4 / 9 */
    f41: gn.f41 ? 1 : 0 /* 41 CLOSED */,
    rated: gn.rated ? 1 : 0 /* TURBINE RATED SPEED (ON >= 3550, OFF <= 3540 rpm) */,
    v84: gn.V >= TCS_GEN.v84 ? 1 : 0 /* VOLTAGE ESTABLISHED (84R) */,
    synAuto: gn.syn !== 'MAN' ? 1 : 0 /* 43-25 AUTO SELECTED */,
    synStart: gn.start ? 1 : 0 /* 52G CLOSE ORDER (TCS/ATS) to the auto synchronizer */,
    x25: gn.x25 ? 1 : 0 /* 25X1 ON */,
    y25: gn.x25 && gn.tx >= TCS_GEN.x3 ? 1 : 0 /* 25Y1 ON */,
    c25: gn.cmd ? 1 : 0 /* ASD1 25A close pulse */,
    p60r: gn.pV > 0 && gn.vs > 0 ? 1 : 0 /* ASD1 60R */,
    p60l: gn.pV > 0 && gn.vs < 0 ? 1 : 0 /* ASD1 60L */,
    p15r: gn.pR > 0 ? 1 : 0 /* ASD1 15R */,
    p15l: gn.pL > 0 ? 1 : 0 /* ASD1 15L */,
    close52g: gn.close ? 1 : 0 /* 52G CLOSE ORDER (SH-G-1B to SH-G-1A) */,
    avrAuto: gn.avr !== 'MAN' ? 1 : 0,
    avrMan: gn.avr === 'MAN' ? 1 : 0
  };
}
function tcsOstPerm(U, m) {
  const c = U.tc;
  if (!c || !U.tb) return 'TCS not ready';
  const g = tcsOstGov(U);
  if (c.trip) return 'TURBINE TRIP';
  if (g.or008) return '52G CLOSE';
  if (!g.gov) return 'not in GOVERNING MODE (TCE167): turbine reset, rolling, no ATS step running';
  return '';
}
function tcsOstLog(t) {
  try {
    if (typeof lsEventAdd === 'function') lsEventAdd('TCS', 'TCS', t);
  } catch (e) {}
}
/* CRT ON / OFF push buttons (CRT AVAILABLE: the CRT of the app is always available) */
function tcsOstCmd(U, m, on) {
  const o = tcsOst(U.tc);
  if (!on) {
    if (o[m]) {
      o[m] = 0;
      tcsOstLog(TCS_OST[m].name + ' OFF');
    }
    return '';
  }
  const p = tcsOstPerm(U, m);
  if (p) return TCS_OST[m].name + ' not permitted: ' + p;
  if (!o[m]) tcsOstLog(TCS_OST[m].name + ' ON');
  o[m] = 1;
  return '';
}
function tcsOstStep(U, dt) {
  const c = U.tc,
    tb = U.tb;
  if (!c || !c.ost) return;
  const o = tcsOst(c),
    g = tcsOstGov(U);
  /* TD A018: 30 s of the other test's mode (T = INITIAL), then OR009 resets this one */
  o.tmain = o.main ? o.tmain + dt : 0;
  o.tbk = o.bk ? o.tbk + dt : 0;
  for (const [m, other] of [['main', 'tbk'], ['bk', 'tmain']]) {
    if (!o[m]) continue;
    const why = c.trip ? 'TURBINE TRIP at ' + Math.round(tb.rpm) + ' rpm' : g.or008 ? '52G CLOSE' : o[other] >= TCS_OST.td ? 'the other overspeed test is ON' : '';
    if (why) {
      o[m] = 0;
      tcsOstLog(TCS_OST[m].name + ' reset (' + why + ')');
    }
  }
  if (tb.st !== 'roll') {
    o.pmain = o.pbk = 0;
    return;
  }
  for (const m of ['main', 'bk']) {
    const k = TCS_OST[m],
      p = 'p' + m,
      goal = o[m] ? k.max : 0;
    /* A024: the high rate while the pattern is at or below the rate change speed; down always at the high rate (PA2 decrease) */
    const ri = (o[m] && o[p] <= k.chg ? TCS_OST.hi : TCS_OST.lo) * dt,
      rd = TCS_OST.hi * dt;
    o[p] = goal > o[p] ? Math.min(goal, o[p] + ri) : Math.max(goal, o[p] - rd);
  }
  /* TCE178 ADD024: the pattern on the speed reference (base = the selected target speed, else rated) */
  const pat = o.pmain + o.pbk,
    base = c.spd && c.spd.sel > 0 ? c.spd.sel : 3600;
  if (pat > 0 && tb.rpm >= base - 7.2) tb.rpm = base + pat;
  o.pat = pat;
}
