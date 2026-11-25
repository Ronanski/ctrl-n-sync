/* TCS I/O binding (lane 2 TCS IO, docs/audit/lane-plan-content-first-2026-11-25.md; TCS plan step 3, docs/tcs/SHEETS_AS_LOGIC_PLAN.md).
   The PI/O tables of the TCS soft logic set (TCE9xx EHG, TCA9xx COMM, typed from Hitachi 331DM09784 / 09788) are the only door between
   the TCS sheets and the plant. src/data/tcs-io.json holds one row per card channel (tools/data/tcs_io.mjs); this file gives each used row
   its END: where the signal comes from (DI / AI / THC / RTD / PTI / servo position) or where it goes (DO / AO / servo output).
   Kinds of end:
     model  the plant model value that already exists (read only here: nothing in this file writes the model);
     dcs    a DCS address of the DCS I/O list (hardwired DCS <-> TCS: the XSMM list FROM / TO = DCS and the DCS I/O list STN rows);
     ibd    a net of the IBD trip netlist that already runs (tcs-trip.js, AN.tcsIbd);
     sys    a TCS hardware status (power supply, CPU, PCM, cabinet temperature): the app has no TCS hardware fault, so the healthy state;
     fault  the electrical trouble contact of a motor / MOV: the model has no fault of the device (the same rule as tcsIO in tcs.js: ABN / YEE = 0);
     out    an output of the TCS (DO / AO / servo): what it drives; read() gives the engine's own value of the same thing, for the shadow run;
     needs  no model value exists yet: the text says what is missing (the "needs model" list of the lane plan, worked later, never invented).
   Every row's source is the table row itself (sheet, channel) plus the text of its end. Nothing here is loaded in the app yet: the shadow
   run (plan step 4) reads it beside tcs.js; the tests read it headless (tests/lanes/tcs-io). */
(function (root) {
  'use strict';
  /* the engine values this file reads. In the engine's own scope (the headless engine of tools/engine/node-engine.js) the functions of tcs.js
     and tcs-trip.js are there by name; in the built page they are closed in the analog script, so the public AN API is used
     (src/analog/engine/api.js: AN.tceRead = tcsLiveRead, AN.tcsVt = tcsVtState, AN.tcsIbd; AN.tceSteam / AN.tceCrp asked of the engine
     owner, NaN until they exist). Tests give U._L / U._vt / U._steam / U._crp / U._ibd. */
  const AP = U => (typeof AN !== 'undefined' && AN && AN.unit === U ? AN : null);
  let memo = null; /* one batch of reads (api.batch): the plant values are read once */
  const once = (k, U, f) => (memo && memo.U === U ? (k in memo ? memo[k] : (memo[k] = f(U))) : f(U));
  const L_ = U => once('L', U, L0);
  const L0 = U =>
    (typeof tcsLiveRead === 'function' ? tcsLiveRead(U) : AP(U) && AP(U).tceRead ? AP(U).tceRead() : U && U._L) || {};
  const VT = U => once('VT', U, VT0);
  const VT0 = U => {
    if (typeof tcsVtMsv === 'function' && U && U.tb) {
      const ic = U.tb.icv || 0;
      return {
        msvA: tcsVtMsv(U, 'A') * 100,
        msvB: tcsVtMsv(U, 'B') * 100,
        cvA: tcsVtCv(U, 'A') * 100,
        cvB: tcsVtCv(U, 'B') * 100,
        rsvA: tcsVtRsv(U, 'A') * 100,
        rsvB: tcsVtRsv(U, 'B') * 100,
        icvA: ic * tcsVtIcvS(U, 'A') * 100,
        icvB: ic * tcsVtIcvS(U, 'B') * 100
      };
    }
    return (AP(U) && AP(U).tcsVt ? AP(U).tcsVt() : U && U._vt) || {};
  };
  const STEAM = U => once('ST', U, STEAM0);
  const STEAM0 = U =>
    (typeof tcsSteam === 'function' ? tcsSteam(U) : AP(U) && AP(U).tceSteam ? AP(U).tceSteam() : U && U._steam) || {
      msp: U && isFinite(U.Pmsv) ? U.Pmsv : NaN
    };
  const CRP = U => once('CR', U, CRP0);
  const CRP0 = U => (typeof tcsCrp === 'function' ? tcsCrp(U) : AP(U) && AP(U).tceCrp ? AP(U).tceCrp() : U && U._crp);
  const ibd = (sh, n) => U => {
    try {
      const s = typeof AN !== 'undefined' && AN.tcsIbd ? AN.tcsIbd(sh) : U && U._ibd && U._ibd[sh];
      return s && s.v ? (s.v[n] > 0.5 ? 1 : 0) : NaN;
    } catch (e) {
      return NaN;
    }
  };
  const num = v => (isFinite(v) ? +v : NaN);
  /* the value of an engine label list ([sheet, block] pairs, as unit.js anUnitVal: the first block with a value) */
  const lblVal = list => {
    for (const [S, bk] of list || []) {
      const st = S && S.rt && S.rt.st && S.rt.st[bk.id];
      if (st && isFinite(st.val)) return +st.val;
    }
    return NaN;
  };
  const b = v => (v ? 1 : 0);
  /* [row id, kind, text, read(U, L)] */
  const E = [];
  const M = (id, t, f) => E.push([id, 'model', t, f]);
  const D = (id, t, stn, addr, tag, read) => E.push([id, 'dcs', t, read || null, { stn, addr, tag }]);
  const SY = (id, v, t) =>
    E.push([id, 'sys', t || 'TCS hardware status, healthy: the app has no TCS hardware fault', () => v]);
  const F = (id, t) =>
    E.push([
      id,
      'fault',
      t || 'electrical trouble of the device: the model has no fault of it (tcs.js tcsIO: ABN / YEE = 0)',
      () => 0
    ]);
  const O = (id, t, f) => E.push([id, 'out', t, f || null]);
  const N = (id, t) => E.push([id, 'needs', t, null]);

  /* ---------- EHG DI TABLE(1) TCE900 (unit 4 slot 0) ---------- */
  M('TCE900-1', 'control oil pump (A) running: oil model (tcsOil c.cop[0], tcsLiveRead copA)', (U, L) => L.copA);
  F('TCE900-2');
  M('TCE900-3', 'main oil pump (A) running: oil model (c.mop[0], mopA)', (U, L) => L.mopA);
  F('TCE900-4');
  M('TCE900-5', 'DC emergency oil pump running: oil model (c.eop, eop)', (U, L) => L.eop);
  F('TCE900-6');
  M(
    'TCE900-7',
    'PS-LO1004 bearing oil pressure (for EOP auto start): the contact of the oil model, bearing oil <= TCS_OIL.brgLo (brgLow)',
    (U, L) => L.brgLow
  );
  M('TCE900-8', 'ZS-LO1003 HAND TURNING INTERLOCK: the hand turning bar is stowed, the same 0 the TB-9 sheet reads (tcs-trip.js TCS_IBD_DEV TB-9 net 53)', () => 0);
  M(
    'TCE900-9',
    'ZS-LO1906-1 turning gear engage position: tcs.js c.tg selected and the shaft at turning speed (<= 4 rpm, PR-OPE-5002 7955)',
    U => b(U.tc && U.tc.tg && U.tb && U.tb.rpm <= 4)
  );
  M('TCE900-10', 'ZS-LO1906-2 turning gear disengage position: not engaged (TCE900-9)', U =>
    b(!(U.tc && U.tc.tg && U.tb && U.tb.rpm <= 4))
  );
  M('TCE900-11', 'TURNING GEAR MOTOR ENGAGE PB of the local panel (TB-10): the app has no local panel, so the button is not pressed (0)', () => 0);
  SY('TCE900-16', 1);
  D(
    'TCE900-17',
    'DCS CONTROL MODE ON from the DCS: STN101 O.0178 TCS-DO1002 (XSMM COORDINATION CONTROL ON COMMAND, DCS I/O list sh 7)',
    1,
    'O.0178',
    'TCS-DO1002'
  );
  D(
    'TCE900-18',
    'DCS CONTROL MODE OFF from the DCS: STN101 O.0179 TCS-DO1003 (XSMM COORDINATION CONTROL OFF COMMAND, DCS I/O list sh 7)',
    1,
    'O.0179',
    'TCS-DO1003'
  );
  M('TCE900-19', 'DS CLOSED (GMCB disconnecting switch): the app has no DS operation; the unit line-up is closed (the model closes 52G, which needs the DS closed)', () => 1);
  M('TCE900-20', '52G CLOSED: the generator breaker of the model (tb.st sync / load, g52)', (U, L) => L.g52);
  M('TCE900-21', '52G OPENED: not 52G CLOSED', (U, L) => (L.g52 == null ? NaN : 1 - L.g52));
  M('TCE900-22', 'SPEED RAISE from the synchronizer ASD1 (15R pulse, tcs-gen.js g.pR)', (U, L) => L.p15r);
  M('TCE900-23', 'SPEED LOWER from the synchronizer ASD1 (15L pulse, g.pL)', (U, L) => L.p15l);
  M('TCE900-24', '41 CLOSE: the field breaker of the generator model (tcs-gen.js g.f41)', (U, L) => L.f41);
  M('TCE900-25', '41 OPEN: not 41 CLOSE', (U, L) => (L.f41 == null ? NaN : 1 - L.f41));
  M('TCE900-26', '52L OPEN: the line breaker of elec.js (U.el.l52 false)', (U, L) => L.l52o);
  M('TCE900-27', 'HP BYPASS VALVE FULL CLOSE from the DCS: DITL-115 row 15 ZSC-MS1020 (hpbCl)', (U, L) => L.hpbCl);
  SY('TCE900-32', 1);
  /* ---------- EHG DI TABLE(2) TCE901 ---------- */
  M('TCE901-1', 'control oil pump (B) running (c.cop[1], copB)', (U, L) => L.copB);
  F('TCE901-2');
  M('TCE901-3', 'main oil pump (B) running (c.mop[1], mopB)', (U, L) => L.mopB);
  F('TCE901-4');
  M('TCE901-5', 'TURNING GEAR MOTOR JOG PB of the local panel (TB-9 net 9 (LOCAL) JOG): the app has no local panel, so the button is not pressed (0)', () => 0);
  M(
    'TCE901-6',
    'turning gear motor running: the turning gear of the model turns the shaft (c.tg and 1 <= rpm <= 4, tcs.js TURBINE TURNING)',
    U => b(U.tc && U.tc.tg && U.tb && U.tb.rpm >= 1 && U.tb.rpm <= 4)
  );
  F('TCE901-7');
  D(
    'TCE901-8',
    'AUTO SYN START PB from the DCS: STN102 O.0492 TCS-DO1006 (DITL-115 AUTO SYNCHRONIZE START COMMAND; XSMM AUTO SYN START PB, DCS I/O list sh 15)',
    2,
    'O.0492',
    'TCS-DO1006'
  );
  M(
    'TCE901-9',
    'AUTO SYNC. REMOTE SELECT (synchronizer panel SYP): the 43-25 selector of tcs-gen.js (g.syn not MAN)',
    (U, L) => L.synAuto
  );
  SY('TCE901-16', 1);
  SY('TCE901-27', 1);
  SY('TCE901-28', 1);
  SY('TCE901-29', 0);
  SY('TCE901-30', 0);
  M('TCE901-31', 'PLU OPERATED: the power load unbalance of the turbine model (tb.plu)', U => b(U.tb && U.tb.plu));
  SY('TCE901-32', 1);
  /* ---------- EHG AI TABLE(1) TCE930 ---------- */
  const stm = (U, k) => num(STEAM(U)[k]);
  M(
    'TCE930-1',
    'PT-MS1901-1 MSV inlet steam pressure (A), kg/cm2g: the main steam after MV-MS1391 of the model (tcs.js tcsSteam msp = U.Pmsv)',
    U => stm(U, 'msp')
  );
  M('TCE930-2', 'PT-LO1922-A MOP (A) discharge oil pressure, kg/cm2g (U.loPa)', U => num(U.loPa));
  M('TCE930-3', 'PT-LO1931-A COP (A) discharge oil pressure, kg/cm2g (U.loCa)', U => num(U.loCa));
  M('TCE930-4', 'PT-HR1901 hot reheat steam pressure, kg/cm2g (tcs.js tcsSteam rhp = PICHR1003 PV)', U =>
    stm(U, 'rhp')
  );
  D(
    'TCE930-5',
    'TARGET MW DEMAND from the DCS: STN101 AO0359 TCS-AO1001 (XSMM COORDINATION CONTROL LOAD DEMAND, DCS I/O list sh 18)',
    1,
    'AO0359',
    'TCS-AO1001'
  );
  M('TCE930-9', 'PT-MS1901-2 MSV inlet steam pressure (B) (tcsSteam msp: one main steam line pressure)', U =>
    stm(U, 'msp')
  );
  M('TCE930-10', 'PT-LO1922-B MOP (B) discharge oil pressure (U.loPb)', U => num(U.loPb));
  M('TCE930-11', 'PT-LO1931-B COP (B) discharge oil pressure (U.loCb)', U => num(U.loCb));
  M('TCE930-12', 'PT-LO1923 EOP discharge oil pressure (U.loEop)', U => num(U.loEop));
  /* ---------- EHG DO TABLE(1) TCE960 ---------- */
  O('TCE960-1', 'control oil pump (A) start command -> MCC (oil model c.cop[0])', (U, L) => L.copA);
  O('TCE960-2', 'main oil pump (A) start command -> MCC (c.mop[0])', (U, L) => L.mopA);
  O('TCE960-3', 'DC emergency oil pump start -> DC-MCC (c.eop)', (U, L) => L.eop);
  O('TCE960-4', 'DC emergency oil pump manual stop -> DC-MCC');
  O('TCE960-6', 'turning gear motor start command -> MCC: IBD TB-9 net 12 (OR of the manual start and the auto start memory; its NOT is the stop)', ibd('TB-9', 12));
  O('TCE960-8', 'TURNING GEAR ENGAGED -> DCS STN102 I.0417 TCS-DI1030 (ABC-053)', U =>
    b(U.tc && U.tc.tg && U.tb && U.tb.rpm <= 4)
  );
  O(
    'TCE960-13',
    'RSV ICV FULL CLOSE (1) -> DCS STN102 I.0401 TCS-DI1024 (XSMM RSV&CV FULLY CLOSE 1, IBD TA-6, boiler reheater protection)',
    (U, L) => b(L.rsvAc && L.rsvBc && L.icvAc && L.icvBc)
  );
  O('TCE960-14', 'MSV ICV FULL CLOSE (1) -> boiler reheater protection relay (IBD TA-6, TCE250)', (U, L) =>
    b(L.msvAc && L.msvBc)
  );
  O('TCE960-16', 'EHG SOFT MAJOR TROUBLE or BACKUP OVER SPEED -> TCS MAJOR TROUBLE relay (IBD TA-6 / TA-9)');
  O('TCE960-17', '52L OPEN FOR HOUSE LOAD OPERATION -> DCS (XSMM FOR HOUSE LOAD OPERATION, DCS I/O list sh 14)');
  O('TCE960-18', 'TURBINE SPEED < 2400 RPM -> DCS STN102 I.0406 TCS-DI1029 (DITL-56)', (U, L) =>
    isFinite(L.rpm) ? b(L.rpm < 2400) : NaN
  );
  O('TCE960-19', 'ACCELERATION RELAY OPERATED -> DCS (XSMM, DCS I/O list sh 5, IBD TA-33)');
  /* the engine value: the DCS input ABC-001C I.0082 the engine writes (unit.js U.di.on: set by the DCS MODE ON command O.0178 while the
     permissive holds, reset by O.0179 or the permissive lost; TCE180 FFR011 -> TCE601 007 on the drawing) */
  O('TCE960-20', 'DCS MODE ON FEEDBACK -> DCS STN101 I.0082 TCS-DI1047 (ABC-001C); TCE180 DCS CONTROL MODE ON (FFR011) -> TCE601 007', U => {
    const m = U && U.di && U.di.on;
    return m && m.S && m.S.rt ? b(+m.S.rt.ext[m.n] > 0.5) : NaN;
  });
  O('TCE960-24', 'ASD2 START SIGNAL (52L) -> synchronizer ASD2');
  O('TCE960-25', 'HP-CV FULL CLOSE (BOTH CV(A) & (B)) -> DCS STN102 I.041D TCS-DI1050 (IBD TA-6)', (U, L) =>
    b(L.cvAc && L.cvBc)
  );
  O('TCE960-26', 'TURBINE TRIP (MSV, RSV, ICV CLOSE) -> DCS STN102 I.0416 TCS-DI1055', (U, L) => L.trip);
  O('TCE960-27', 'MSV/CV(A) SEQUENTIAL FULL CLOSE TEST EXECUTING -> DCS STN102 I.041E TCS-DI1051-1', (U, L) =>
    b(/^(msvA|cvA)$/.test(L.vtSel || ''))
  );
  O('TCE960-28', 'MSV/CV(B) SEQUENTIAL FULL CLOSE TEST EXECUTING -> DCS STN102 I.041F TCS-DI1051-2', (U, L) =>
    b(/^(msvB|cvB)$/.test(L.vtSel || ''))
  );
  O('TCE960-29', '41 CLOSE -> DCS STN102 I.0939 TCS-DI1052', (U, L) => L.f41);
  O('TCE960-30', 'GEN. LOCKOUT RELAY (86G) A OPERATED -> DCS STN102 I.093A TCS-DI1053 (gen-panel.js U.lo86.a)', U => (U && U.lo86 ? b(U.lo86.a) : 0));
  O('TCE960-31', 'GEN. LOCKOUT RELAY (86G) B OPERATED -> DCS STN102 I.093B TCS-DI1054 (gen-panel.js U.lo86.b)', U => (U && U.lo86 ? b(U.lo86.b) : 0));
  O('TCE960-32', 'ICV TO CV TRANSFER COMPLETE -> DCS STN102 I.0418 TCS-DI1031 (ABC-050)', (U, L) => L.xfer);
  /* ---------- EHG DO TABLE(2) TCE961 ---------- */
  O('TCE961-1', 'control oil pump (B) start command -> MCC (c.cop[1])', (U, L) => L.copB);
  O('TCE961-2', 'main oil pump (B) start command -> MCC (c.mop[1])', (U, L) => L.mopB);
  O('TCE961-3', 'ASD1 START SIGNAL (52G) -> synchronizer ASD1 (tcs-gen.js g.start)', (U, L) => L.synStart);
  /* the engine value: tb.perm of unit.js (TCE p.127 TCE180: NOT (52G not closed, TURBINE TRIP, HOUSE LOAD forced close, IP start before
     TRANSFER REGION COMPLETE), the same value it writes to ABC-001C I.0081) */
  O('TCE961-5', 'DCS CONTROL MODE PERMISSIVE -> DCS STN101 I.0081 TCS-DI1046 (ABC-001C); TCE180 output B -> TCE602', U =>
    U && U.tb && U.tb.perm != null ? b(U.tb.perm) : NaN);
  O(
    'TCE961-8',
    'POWER LOAD UNBALANCE RY OPERATED -> DCS STN102 I.0405 TCS-DI1028 CV & ICV full closed by PLU activation (XSMM RY, IBD TA-33)',
    U => b(U.tb && U.tb.plu)
  );
  O(
    'TCE961-13',
    'RSV ICV FULL CLOSE (2) -> DCS STN102 I.0402 TCS-DI1025 (XSMM RSV&ICV FULLY CLOSE 2, IBD TA-6)',
    (U, L) => b(L.rsvAc && L.rsvBc && L.icvAc && L.icvBc)
  );
  O('TCE961-14', 'MSV ICV FULL CLOSE (2) -> boiler reheater protection relay (IBD TA-6)', (U, L) =>
    b(L.msvAc && L.msvBc)
  );
  O('TCE961-15', 'EHG SOFT NOT MAJOR TROUBLE -> TCS relay');
  O('TCE961-16', 'EHG SOFT MAJOR TROUBLE or BACKUP OVER SPEED -> TCS MAJOR TROUBLE relay (IBD TA-6 / TA-9)');
  O('TCE961-17', 'SV-LO1906 turning gear engage solenoid valve -> field (TB-10)');
  O('TCE961-18', 'turning gear engage lamp -> local panel (TB-10)');
  O('TCE961-19', 'turning gear motor start lamp -> local panel: IBD TB-9 net 12, the same start net', ibd('TB-9', 12));
  /* ---------- EHG AO TABLE(1) TCE970 ---------- */
  O('TCE970-1', 'TARGET MW SET POINT FEED BACK -> DCS STN101 AI0420 TCS-AI1001', U => num(U.tb && U.tb.tgt));
  O('TCE970-2', 'TURBINE LOAD UP RATE -> DCS STN101 AI0421 TCS-AI1005 (max turbine load up rate set point, 0 ~ 5 %/min): U.rateUp MW/min x 100 / 150', U =>
    U && isFinite(U.rateUp) ? (U.rateUp * 100) / 150 : NaN
  );
  O('TCE970-3', 'HP turbine first stage steam pressure (A) -> DCS SI1122: PT-ST1001-1, the engine first stage pressure (unit.js U.pist[0], ABC-052 AI0883), kg/cm2g', U =>
    lblVal(U && U.pist && U.pist[0])
  );
  O('TCE970-4', 'HP turbine first stage steam pressure (B) -> DCS SI1123: PT-ST1001-2, the engine first stage pressure (unit.js U.pist[1], ABC-052 AI0884), kg/cm2g', U =>
    lblVal(U && U.pist && U.pist[1])
  );
  O('TCE970-5', 'HP turbine first stage steam pressure (C) -> DCS SI1124: PT-ST1001-3, the engine first stage pressure (unit.js U.pist[2], ABC-052 AI0885), kg/cm2g', U =>
    lblVal(U && U.pist && U.pist[2])
  );
  O('TCE970-6', 'TURBINE SPEED -> DCS STN102 AI0534 TCS-AI1004 (ABC-053)', (U, L) => num(L.rpm));
  /* ---------- EHG PTI TABLE(1) TCE980: the three speed pick-ups SE-ST1001-1 / 2 / 3, three channels each, and their low counters ---------- */
  for (const n of [1, 2, 3, 9, 10, 11, 17, 18, 19])
    M(
      'TCE980-' + n,
      'SE-ST100' + (1 + Math.floor((n - 1) / 8)) + ' turbine speed pick-up, rpm: the rotor of the model (tb.rpm)',
      U => num(U.tb && U.tb.rpm)
    );
  for (const n of [5, 6, 7, 13, 14, 15, 21, 22, 23])
    M('TCE980-' + n, 'turbine speed low counter of the same pick-up, rpm (tb.rpm)', U => num(U.tb && U.tb.rpm));
  /* ---------- EHG SERVO TABLES TCE990 / 991 / 992: LVDT positions and servo valve currents of MSV / CV / ICV ---------- */
  const vlv = {
    'MSV(A)': U => num(VT(U).msvA),
    'MSV(B)': U => num(VT(U).msvB),
    'CV(A)': U => num(VT(U).cvA),
    'CV(B)': U => num(VT(U).cvB),
    'RSV(A)': U => num(VT(U).rsvA),
    'RSV(B)': U => num(VT(U).rsvB),
    'ICV(A)': U => num(VT(U).icvA),
    'ICV(B)': U => num(VT(U).icvB)
  };
  /* filled below from the rows: POSITION rows read the valve model, SERVO VALVE rows (AI = coil current, AO = demand) need the servo loop */
  const SERVO = r => {
    const m = /^(MSV|CV|ICV|RSV)\((A|B)\)\s+(POSITION|SERVO VALVE)/.exec(r.name.replace(/\s+/g, ' '));
    if (!m) return null;
    const k = m[1] + '(' + m[2] + ')';
    if (m[3] === 'POSITION')
      return ['model', 'LVDT ' + (r.ins || '') + ' ' + k + ' position, %: the valve model of tcs.js (tcsVt*)', vlv[k]];
    if (r.kind === 'SERVO-AO')
      /* the engine's own command of the same valve (lane 9 compare): tcs.js has no actuator lag, the valve sits at its demand, so the
         command = the valve model position of tcsVtState (msvA ... icvB), % as the coil output range 0 ~ 100 % */
      return [
        'out',
        k + ' servo valve coil drive -> the valve actuator; read = the engine valve demand of tcs.js (tcsVt*, no actuator lag in the model), %',
        vlv[k]
      ];
    return [
      'needs',
      k + ' servo valve coil current feedback: the servo loop of the actuator is not in the model',
      null
    ];
  };

  /* ---------- COMM DI TABLES TCA900 ~ TCA906 ---------- */
  /* secondary drain MOVs of MSV / CV / CRV, the HP turbine warming valve, the steam seal feed inlet valve: open / closed / torque switches */
  const drainNeeds =
    'turbine drain MOV (IBD TC-1 ~ TC-13, TC-20, TC-31): the valve itself is src/analog/engine/tcs-dev.js U.dev.mov, moved by the IBD command nets';
  /* the drain MOVs and their switches: the positions of src/analog/engine/tcs-dev.js (U.dev.mov; travel and K 99 / 1 % from the macros
     TORQUE (SEAL-IN) / (INCHING) / POSITION (SEAL-IN), IBD typical sheets 16 ~ 21), moved by the IBD TC-1 ~ TC-13 / TC-20 / TC-31 commands */
  const dev = (U, g, k, f) => {
    const G = U && U.dev && U.dev[g],
      v = G && (k ? G[k] : G);
    return v && isFinite(v[f]) ? +v[f] : NaN;
  };
  [
    ['TCA900-1', 'msvA', 'o', 'MSV(A) above seat secondary drain valve OPENED'],
    ['TCA900-2', 'msvA', 'c', 'CLOSED'],
    ['TCA900-4', 'cvA', 'o', 'CV(A) above seat OPENED'],
    ['TCA900-5', 'cvA', 'c', 'CLOSED'],
    ['TCA900-7', 'crvA', 'o', 'CRV(A) below seat OPENED'],
    ['TCA900-8', 'crvA', 'c', 'CLOSED'],
    ['TCA900-13', 'msvA', 'tqO', 'MSV(A) torque switch open'],
    ['TCA900-14', 'crvA', 'tqO', 'CRV(A) torque switch open'],
    ['TCA900-15', 'cvA', 'tqO', 'CV(A) torque switch open'],
    ['TCA900-29', 'msvA', 'tqC', 'MSV(A) torque switch close'],
    ['TCA900-30', 'crvA', 'tqC', 'CRV(A) torque switch close'],
    ['TCA900-31', 'cvA', 'tqC', 'CV(A) torque switch close'],
    ['TCA901-1', 'msvB', 'o', 'MSV(B) above seat OPENED'],
    ['TCA901-2', 'msvB', 'c', 'CLOSED'],
    ['TCA901-4', 'cvB', 'o', 'CV(B) above seat OPENED'],
    ['TCA901-5', 'cvB', 'c', 'CLOSED'],
    ['TCA901-7', 'crvB', 'o', 'CRV(B) below seat OPENED'],
    ['TCA901-8', 'crvB', 'c', 'CLOSED'],
    ['TCA901-14', 'cvB', 'tqO', 'CV(B) torque switch open'],
    ['TCA901-15', 'crvB', 'tqO', 'CRV(B) torque switch open'],
    ['TCA901-28', 'msvB', 'tqO', 'MSV(B) torque switch open'],
    ['TCA901-29', 'msvB', 'tqC', 'MSV(B) torque switch close'],
    ['TCA901-30', 'cvB', 'tqC', 'CV(B) torque switch close'],
    ['TCA901-31', 'crvB', 'tqC', 'CRV(B) torque switch close'],
    ['TCA902-1', 'cvBw', 'o', 'CV(B) below seat secondary warming drain valve OPENED'],
    ['TCA902-2', 'cvBw', 'c', 'CLOSED'],
    ['TCA902-4', 'wv', 'c', 'HP turbine warming valve FULL CLOSE'],
    ['TCA902-5', 'wv', 'o', 'HP turbine warming valve FULL OPEN'],
    ['TCA902-12', 'cvBw', 'tqO', 'CV(B) below seat warming drain torque switch open'],
    ['TCA902-13', 'cvBw', 'tqC', 'torque switch close'],
    ['TCA902-14', 'wv', 'tqO', 'HP turbine warming valve torque switch open'],
    ['TCA902-15', 'wv', 'tqC', 'torque switch close'],
    ['TCA904-21', 'ssfi', 'c', 'steam seal feed inlet valve FULL CLOSE'],
    ['TCA904-22', 'ssfi', 'o', 'FULL OPEN'],
    ['TCA904-28', 'ssfi', 'tqO', 'steam seal feed inlet valve torque switch open'],
    ['TCA904-29', 'ssfi', 'tqC', 'torque switch close']
  ].forEach(([id, k, f, t]) => M(id, t + ' (tcs-dev.js U.dev.mov.' + k + '.' + f + ')', U => dev(U, 'mov', k, f)));
  [
    'TCA900-3',
    'TCA900-6',
    'TCA900-9',
    'TCA901-3',
    'TCA901-6',
    'TCA901-9',
    'TCA902-3',
    'TCA903-22',
    'TCA904-23'
  ].forEach(id => F(id));
  /* generator, AVR and protection status contacts: the excitation / protection panels are not in the model beyond tcs-gen.js */
  const avrNeeds =
    'the AVR / generator protection panel has no such state in the model (tcs-gen.js has 41, AUTO / MANUAL, 86G lockout)';
  /* the trouble / fault / protection operated / relay coil open contacts of the AVR and the generator protection panels: the model has
     no fault of these panels (the rule of tcs.js tcsIO: ABN / YEE = 0), so each reads its healthy state; a fault scenario is the
     instructor's (faults.js), not a default */
  [
    'TCA900-10',
    'TCA900-24',
    'TCA900-26',
    'TCA900-27',
    'TCA901-11',
    'TCA901-12',
    'TCA902-21',
    'TCA902-22',
    'TCA902-27',
    'TCA904-19',
    'TCA904-25',
    'TCA904-26',
    'TCA904-27',
    'TCA905-3',
    'TCA905-4',
    'TCA905-19',
    'TCA905-20',
    'TCA905-25'
  ].forEach(id =>
    F(id, 'AVR / generator protection panel trouble or protection contact: the model has no fault of the panel (tcs.js tcsIO rule), healthy = 0')
  );
  SY('TCA903-7', 1, 'AVR VT FUSE NORMAL: the model has no fuse fault, healthy = 1');
  M('TCA900-25', 'AVR IN USE: the AVR excites the field while the field switch 41 is closed (tcs-gen.js g.f41, G-4)', U =>
    U && U.gen ? b(U.gen.f41) : NaN
  );
  /* the AVR selections and limiters with no state in the model (no document read gives the plant line-up): channel 1 / 2, set point at
     max / min, over / under excitation limiter (no limiter in tcs-gen.js yet: lanes/tcs-io/gen-reactive-model.md), local / remote,
     AUTO / MANUAL start ready */
  [
    'TCA900-11',
    'TCA900-12',
    'TCA902-30',
    'TCA902-31',
    'TCA903-1',
    'TCA903-2',
    'TCA903-3',
    'TCA903-4'
  ].forEach(id => N(id, avrNeeds));
  /* the AVR settings of the plant (UNITROL 6080 manual DBE-15-0021): AUTO voltage control is the normal mode (p3); the PF and the Mvar
     control are superimposed modes the operator selects, only with the breaker closed (p24 ~ 26), and the app has no such selection, so
     they read off; the power system stabilizer (IEEE 2B) is off by default (DBE-15-0021 setting list) */
  M('TCA901-13', 'PSS ON: the power system stabilizer IEEE 2B is off by default (DBE-15-0021), the app has no PSS selection', () => 0);
  M('TCA903-5', 'PF CONTROL ON: AUTO voltage control is the normal mode (DBE-15-0021 p3); PF control is a superimposed mode (p24 ~ 26) not selected', () => 0);
  M('TCA903-6', 'REACTIVE POWER ON: as TCA903-5, the Mvar control is a superimposed mode (DBE-15-0021 p24 ~ 26) not selected', () => 0);
  M('TCA902-28', 'AVR IN AUTO: the AVR mode of tcs-gen.js (g.avr not MAN)', (U, L) => L.avrAuto);
  M('TCA902-29', 'AVR IN MANUAL (g.avr MAN)', (U, L) => L.avrMan);
  M('TCA902-23', 'GEN VOLTAGE OK (GCP 84): generator voltage >= TCS_GEN.v84 (tcs-gen.js, v84)', (U, L) => L.v84);
  M('TCA902-24', '52L CLOSE (elec.js U.el.l52)', (U, L) => L.l52c);
  M('TCA902-25', '52L OPEN (elec.js U.el.l52 false)', (U, L) => L.l52o);
  M('TCA902-26', 'ASD1 IN USE: the synchronizer ASD1 working on 52G (tcs-gen.js g.x25)', (U, L) => L.x25);
  /* extraction / cold reheat non return valves, steam seal diverting valve, hood spray valve (AOV limit switches) */
  N('TCA900-17', 'ZSC-GS1017 steam seal diverting valve condenser side: the diverting valve is not in the gland model');
  N('TCA900-18', 'ZSO-GS1018 steam seal diverting valve heater side: as TCA900-17');
  const nrv =
    'extraction steam non return valve (AOV) and its solenoid (IBD TC-41 ~ TC-45): the valve position is tcs-dev.js U.dev.nrv';
  [
    ['TCA900-21', 'ex4', 'c', 'No.4'],
    ['TCA900-22', 'ex4', 'o', 'No.4'],
    ['TCA901-17', 'ex2', 'c', 'No.2'],
    ['TCA901-18', 'ex2', 'o', 'No.2'],
    ['TCA901-20', 'ex5', 'c', 'No.5'],
    ['TCA901-21', 'ex5', 'o', 'No.5'],
    ['TCA902-17', 'ex3p', 'c', 'No.3 primary'],
    ['TCA902-18', 'ex3p', 'o', 'No.3 primary'],
    ['TCA903-17', 'ex3s', 'c', 'No.3 secondary'],
    ['TCA903-18', 'ex3s', 'o', 'No.3 secondary']
  ].forEach(([id, k, f, t]) =>
    M(id, t + ' extraction steam non return valve ' + (f === 'o' ? 'FULL OPEN' : 'FULL CLOSE') + ': tcs-dev.js U.dev.nrv.' + k + ' (open with the steam flow while the TCS solenoid holds, IBD TC-41 ~ TC-45; AOV travel R 20 %/s, K 99 / 1 %)', U =>
      dev(U, 'nrv', k, f)
    )
  );
  M('TCA904-5', 'ZSC-CR1901 cold reheat non return valve FULL CLOSE: tcs-dev.js U.dev.nrv.crv (IBD TC-19)', U => dev(U, 'nrv', 'crv', 'c'));
  M('TCA904-6', 'ZSO-CR1901 cold reheat non return valve FULL OPEN: tcs-dev.js U.dev.nrv.crv (IBD TC-19)', U => dev(U, 'nrv', 'crv', 'o'));
  M('TCA904-3', 'ZSC-CD1904 LP exhaust hood water spray valve FULL CLOSE: tcs-dev.js U.dev.hood (c.hso, IBD TC-35; AOV travel)', U => dev(U, 'hood', '', 'c'));
  M('TCA904-4', 'ZSO-CD1904 LP exhaust hood water spray valve FULL OPEN: tcs-dev.js U.dev.hood', U => dev(U, 'hood', '', 'o'));
  /* heater levels, deaerator, bypass, vacuum break, drains: hardwired from the DCS */
  D(
    'TCA900-19',
    'NO.1 LP HEATER LEVEL VERY HIGH from the DCS (XSMM, DCS I/O list sh 13, IBD TC-36): DCS output not yet named in the DCS I/O list of the app',
    0,
    '',
    ''
  );
  D('TCA900-23', 'NO.3 LP HEATER LEVEL HIGH HIGH from the DCS (XSMM, IBD TC-44)', 0, '', '');
  D('TCA901-19', 'NO.1 HP HEATER LEVEL VERY HIGH from the DCS (XSMM, DCS I/O list sh 13, IBD TC-41)', 0, '', '');
  D('TCA901-22', 'NO.2 LP HEATER LEVEL HIGH HIGH from the DCS (XSMM, IBD TC-45)', 0, '', '');
  D('TCA902-19', 'DEAERATOR STORAGE TANK LEVEL VERY HIGH from the DCS (XSMM, DCS I/O list sh 7)', 0, '', '');
  M('TCA901-24', 'HP/LP BYPASS CONTROL IN AUTO from the DCS (DITL-115 row 16, tcsBypDcs, byp)', (U, L) => L.byp);
  D(
    'TCA901-10',
    'TURBINE GLAND STEAM LINE DRAIN VALVE CLOSED from the DCS (XSMM, DCS I/O list sh 9, IBD TE-6)',
    0,
    '',
    ''
  );
  D(
    'TCA905-23',
    'TURBINE GLAND STEAM LINE DRAIN VALVE FULL OPENED from the DCS (XSMM, DCS I/O list sh 13, IBD TE-6)',
    0,
    '',
    ''
  );
  D(
    'TCA905-24',
    'TURBINE GLAND STEAM LINE DRAIN VALVE AUTO from the DCS: STN102 O.048F TCS-DO1001 (XSMM, DCS I/O list sh 13, IBD TE-8)',
    2,
    'O.048F',
    'TCS-DO1001'
  );
  D(
    'TCA902-6',
    'COLD REHEAT DRAIN VALVE CLOSE FEED BACK from the DCS (XSMM, IBD TE-1; "not in the DCS I/O list" in XSMM)',
    0,
    '',
    ''
  );
  D(
    'TCA902-7',
    'COLD REHEAT DRAIN VALVE FULL OPEN FEED BACK from the DCS (XSMM, IBD TE-2; "not in the DCS I/O list" in XSMM)',
    0,
    '',
    ''
  );
  D('TCA903-19', 'HP TURBINE WARMING LINE DRAIN VALVE AUTO SELECTED from the DCS (XSMM, IBD TE-3)', 0, '', '');
  D(
    'TCA903-20',
    'HP TURBINE WARMING LINE DRAIN VALVE OPEN FEED BACK from the DCS (XSMM, DCS I/O list sh 13, IBD TE-1)',
    0,
    '',
    ''
  );
  D(
    'TCA903-21',
    'HP TURBINE WARMING LINE DRAIN VALVE CLOSE FEED BACK from the DCS (XSMM, DCS I/O list sh 14, IBD TE-1)',
    0,
    '',
    ''
  );
  D('TCA904-10', 'CONDENSER VACUUM BREAK COMPLETE from the DCS (XSMM, DCS I/O list sh 13, IBD TE-6)', 0, '', '');
  /* oil system, gland, generator auxiliaries */
  M('TCA901-25', 'oil purifier pump running: the purifier of the field state (U.loPur > 0, AN_SRC.field.pur)', U =>
    isFinite(U.loPur) ? b(U.loPur > 0) : NaN
  );
  F('TCA901-26');
  M('TCA903-23', 'main oil tank vapour extractor running (c.vex, U.loVex)', U => b(U.loVex));
  F('TCA903-24', 'vapour extractor electrical trouble: MCC-EMP11 dead (tcs.js c.empOff, IBD TB-12 net 10)');
  E[E.length - 1][3] = U => b(U.tco && U.tco.empOff);
  F('TCA902-20', 'DPIS-LO1932 duplex oil filter dP HIGH: the oil model has no filter fouling, clean filter = 0');
  F('TCA904-7', 'LSH-GE1001 generator water and oil leakage level HIGH (778 GD-5 >= 800 ml): the model has no leak of the generator, healthy = 0');
  F('TCA904-8', 'DPIS-LO1942 lube oil conditioner coalescer filter dP HIGH: the oil model has no filter fouling, clean filter = 0');
  M('TCA905-5', 'LSL-LO1920-1 main oil tank level LOW (778 TD-3 <= NOL - 100 mm): the oil model holds the tank at NOL (tcs.js c.tankOk, ATS 1.17)', U =>
    U && U.tc ? (U.tc.tankOk ? 0 : NaN) : NaN
  );
  M('TCA905-21', 'LSH-LO1920-2 main oil tank level HIGH (778 TD-3 >= NOL + 100 mm): as TCA905-5 (c.tankOk)', U =>
    U && U.tc ? (U.tc.tankOk ? 0 : NaN) : NaN
  );
  F('TCA905-6', 'DPIS-LO1933-A control oil line filter (A) dP HIGH (778 TD-1 >= 7.04 kg/cm2): no filter fouling in the model, clean = 0');
  F('TCA905-22', 'DPIS-LO1933-B control oil line filter (B) dP HIGH (778 TD-1 >= 7.04 kg/cm2): no filter fouling in the model, clean = 0');
  M('TCA904-12', 'gland steam exhauster running: the gland model (U.tco.gse, tcs.js)', U => b(U.tco && U.tco.gse));
  F('TCA904-11');
  N(
    'TCA904-20',
    'ZSC-GS1031 steam seal feed valve full close: the valve position is U.gsV31 but the limit switch setting is not in the docs read'
  );
  N('TCA904-24', 'ZSC-GS1032 SSFV bypass valve full close: the bypass valve is not in the gland model');
  E.push(['TCA905-7', 'ibd', 'SPACE HEATER RUNNING (GEN.): IBD GD-1 SPACE HEATER FOR GEN. net 1 (the flip-flop set by 52G OPEN, reset by 52G closed or its electrical trouble; tcs-trip.js)', ibd('GD-1', 1)]);
  E.push(['TCA905-8', 'ibd', 'SPACE HEATER RUNNING (AC EXCITER): IBD GD-2 SPACE HEATER FOR AC EXCITER net 1 (the flip-flop set by 52G OPEN, reset by 52G closed or its electrical trouble; tcs-trip.js)', ibd('GD-2', 1)]);
  F('TCA905-9');
  F('TCA905-10');
  /* TSI contacts */
  /* TSI shaft vibration HIGH contacts: ON >= 0.125 mm (setpoint list 310SC90-778 R0 p 11-12 rows 17-24, ANN / ATS, IBD TA-18; the same
     limit tcs-trip.js TA-18 uses). The vibration of bearing n, X / Y = U.loVx<n> / U.loVy<n> of the oil model (tcs.js), mm */
  [
    ['TCA904-1', 'x', 1],
    ['TCA904-17', 'y', 1],
    ['TCA905-1', 'x', 2],
    ['TCA905-17', 'y', 2],
    ['TCA904-18', 'x', 3],
    ['TCA904-2', 'y', 3],
    ['TCA905-18', 'x', 4],
    ['TCA905-2', 'y', 4]
  ].forEach(([id, a, n]) =>
    M(
      id,
      'NO.' + n + ' shaft vibration (' + a.toUpperCase() + ') HIGH: U.loV' + a + n + ' >= 0.125 mm (setpoint list 778 TA-18, ON >= 0.125 mm)',
      U => (isFinite(U['loV' + a + n]) ? b(U['loV' + a + n] >= 0.125) : NaN)
    )
  );
  SY('TCA904-9', 0, 'turbine supervisory instrument trouble: the app has no TSI hardware fault');
  /* TCS cabinet / Modbus / power supply / PCM / EOS / PLU */
  [
    'TCA900-16',
    'TCA900-32',
    'TCA901-16',
    'TCA901-32',
    'TCA902-16',
    'TCA902-32',
    'TCA903-16',
    'TCA903-32',
    'TCA904-16',
    'TCA904-32',
    'TCA905-16',
    'TCA905-32',
    'TCA906-16',
    'TCA906-32',
    'TCA906-5',
    'TCA906-6',
    'TCA906-7',
    'TCA906-14',
    'TCA906-15'
  ].forEach(id => SY(id, 1));
  [
    'TCA906-11',
    'TCA906-12',
    'TCA906-13',
    'TCA906-18',
    'TCA906-19',
    'TCA906-20',
    'TCA906-21',
    'TCA906-22',
    'TCA906-23',
    'TCA906-24',
    'TCA906-25'
  ].forEach(id => SY(id, 0));
  ['TCA906-26', 'TCA906-27', 'TCA906-28'].forEach(id =>
    N(
      id,
      'electrical overspeed (EOS) relay operated (A / B / C): the EOS channels are in the IBD TA-15 netlist; the relay contact net is not named yet'
    )
  );
  ['TCA906-29', 'TCA906-30', 'TCA906-31'].forEach(id =>
    M(id, 'PLU operated (A / B / C): the power load unbalance of the model (tb.plu), one per channel', U =>
      b(U.tb && U.tb.plu)
    )
  );

  /* ---------- COMM AI TABLES TCA930 ~ TCA932 ---------- */
  M('TCA930-1', 'PT-GS1001-1 gland steam seal header pressure (A), kg/cm2g (U.gsP)', U => num(U.gsP));
  M('TCA930-9', 'PT-GS1001-2 gland steam seal header pressure (B) (U.gsP)', U => num(U.gsP));
  ['TCA930-6', 'TCA930-7', 'TCA930-8'].forEach(id =>
    M(id, 'PT-ST1002 reheat bowl steam pressure, kg/cm2g: the IP turbine inlet of the model (U.Pip)', U => num(U.Pip))
  );
  const genNeeds =
    'generator electrical value: the generator model has MW and the voltage in per unit (tcs-gen.js g.V); current, Mvar, power factor and field values need the generator / AVR model';
  ['TCA930-3', 'TCA930-11', 'TCA930-12', 'TCA930-13', 'TCA930-18', 'TCA931-17', 'TCA931-18'].forEach(id => N(id, genNeeds));
  /* the line voltages: the terminal voltage of the generator model (tcs-gen.js g.V, per unit, balanced) x the rated 13.8 kV
     (K1AU3E1-0003 rev 2 key one line diagram: G1 176.5 MVA 13.8 kV, elec.js); card range 0 ~ 18 kV */
  [
    ['TCA930-2', 'A-B'],
    ['TCA930-10', 'B-C'],
    ['TCA930-17', 'C-A']
  ].forEach(([id, ph]) =>
    M(id, 'GEN. VOLTAGE (' + ph + '), kV: tcs-gen.js g.V x 13.8 kV (K1AU3E1-0003 G1 13.8 kV)', U =>
      U && U.gen && isFinite(U.gen.V) ? U.gen.V * 13.8 : NaN
    )
  );
  M('TCA931-21', 'GEN. FREQUENCY, Hz: the shaft frequency of the generator model (tcs-gen.js g.fg = rpm / 60)', U =>
    num(U.gen && U.gen.fg)
  );
  /* the two DCS AO that the TCS COMM AI TABLE(2) reads (card LYA000A, CH 1 / CH 2). The DCS retransmits its own transmitter: AO0404
     TCS-AS1004 is PT-AS1004 (STN102 AI0514, 0 ~ 15 kg/cm2, the TCS range of CH 1) and AO0471 TT-AS1017-1 is TT-AS1017 (STN102 AI0902,
     0 ~ 300 C, the TCS range of CH 2). Proof: DCS I/O list STN102 AO0404 / AO0471 (tag numbers of the transmitters); WIRING.xls AO0404
     junction TCS-AIO and AO0471 junction "DCS-->TCS" (src/ui/plant/wiring.js); XSMM_IO_List_R1 row 538 (CH 1 FROM DCS, IBD TC-20).
     Value = the aux steam model of the DCS AI (unit.js AN_AS: U.asP = PT-AS1004, U.asT17 = TT-AS1017), as tcs-trip.js TC-20 net 43 */
  D(
    'TCA931-2',
    'AUX STEAM HEADER PRESS. (LOWER) from the DCS: STN102 AO0404 TCS-AS1004 = PT-AS1004 (AI0514) retransmitted, kg/cm2 (U.asP; XSMM, IBD TC-20)',
    2,
    'AO0404',
    'TCS-AS1004',
    U => num(U.asP)
  );
  D(
    'TCA931-3',
    'GLAND STEAM DRAIN SEPARATOR TURBINE SIDE TEMP. from the DCS: STN102 AO0471 TT-AS1017-1 = TT-AS1017 (AI0902) retransmitted, degC (U.asT17)',
    2,
    'AO0471',
    'TT-AS1017-1',
    U => num(U.asT17)
  );
  N('TCA931-9', 'ZE-ST1002 LP turbine differential expansion: not in the model');
  M('TCA931-10', 'ZE-ST1001 turbine shell expansion (HP turbine side), mm (tcs.js c.sexp)', U =>
    num(U.tc && U.tc.sexp)
  );
  N('TCA931-11', 'ZE-ST1004 low speed eccentricity: not in the model');
  M('TCA932-1', 'ZT-GS1031 steam seal feed valve position, % (U.gsV31)', U => num(U.gsV31));
  M('TCA932-2', 'ZT-GS1034 steam packing unloading valve position, % (U.gsV34)', U => num(U.gsV34));
  M('TCA932-3', 'ZT-ST1008 CV(B) below seat secondary warming drain valve position, %: tcs-dev.js U.dev.mov.cvBw (TORQUE (INCHING) TCA618, R 2.5 %/s)', U => dev(U, 'mov', 'cvBw', 'p'));
  M('TCA932-4', 'ZT-AS1011 HP turbine warming valve position, %: the engine U.tt[ZT-AS1011] (unit.js anAsTagStep)', U => dev(U, 'mov', 'wv', 'p'));

  /* ---------- COMM THC / RTD TABLES TCA960, TCA961, TCA970 ---------- */
  const T = {
    'NO.1 TURBINE JOURNAL BEARING METAL TEMP.': ['oil model bearing metal No.1 (U.loM1)', U => num(U.loM1)],
    'NO.2 TURBINE JOURNAL BEARING METAL TEMP.': ['oil model bearing metal No.2 (U.loM2)', U => num(U.loM2)],
    'NO.3 BEARING METAL TEMP.': ['oil model bearing metal No.3 (U.loM3)', U => num(U.loM3)],
    'NO.4 BEARING METAL TEMP.': ['oil model bearing metal No.4 (U.loM4)', U => num(U.loM4)],
    'NO.3 BEARING OUTLET OIL TEMP.': ['oil model No.3 bearing drain (U.loTb3)', U => num(U.loTb3)],
    'NO.4 BEARING OUTLET OIL TEMP.': ['oil model No.4 bearing drain (U.loTb4)', U => num(U.loTb4)],
    'MSV INLET STEAM TEMP.': ['main steam temperature at the stop valve (tcs.js tcsSteam(U).mst)', U => stm(U, 'mst')],
    'HOT REHEAT STEAM TEMP.': [
      'hot reheat steam temperature at the turbine (tcs.js tcsSteam(U).rht)',
      U => stm(U, 'rht')
    ],
    'HP TURBINE FIRST STAGE INNER WALL METAL TEMP.': [
      'HP first stage inner wall metal (tcs.js c.Thp)',
      U => num(U.tc && U.tc.Thp)
    ],
    'REHEAT BOWL INNER WALL METAL TEMP.': ['reheat bowl inner wall metal (tcs.js c.Trh)', U => num(U.tc && U.tc.Trh)],
    'CV (B) INNER WALL METAL TEMP.': ['CV chest inner wall metal (tcs.js c.Tcvi)', U => num(U.tc && U.tc.Tcvi)],
    'CV (B) OUTER WALL METAL TEMP.': ['CV chest outer wall metal (tcs.js c.Tcvo)', U => num(U.tc && U.tc.Tcvo)],
    'LP TURBINE EXHAUST HOOD STEAM TEMP.': ['LP exhaust hood steam (tcs.js c.Tx)', U => num(U.tc && U.tc.Tx)],
    'THRUST BEARING FRONT-END EMBEDDED METAL TEMP.': ['thrust bearing front (U.loThF)', U => num(U.loThF)],
    'THRUST BEARING REAR-END EMBEDDED METAL TEMP.': ['thrust bearing rear (U.loThR)', U => num(U.loThR)],
    'LUBE OIL COOLER INLET OIL TEMP.': ['lube oil cooler inlet (U.loTin)', U => num(U.loTin)],
    'LUBE OIL COOLER OUTLET OIL TEMP.': ['lube oil cooler outlet (U.loTout = TICLO1002 PV)', U => num(U.loTout)]
  };
  /* the generator temperatures of unit.js anGenTemp (U.genT: ts stator coil A ~ F, ta cooling gas A ~ D, ex AC exciter outlet air) and the
     HP exhaust steam temperature (the cold reheat temperature X.T.cr), the same values the app feeds to IBD GD-5 and TA-20 (tcs-trip.js) */
  const LET = x => 'ABCDEF'.indexOf(x);
  const thcBy = r => {
    let m = /^GEN\. STATOR COIL TEMP\.\s*\(([A-F])\s*\)$/.exec(r.name);
    if (m)
      return [
        'model',
        (r.ins || '') + ' generator stator coil (' + m[1] + ') (unit.js U.genT.ts, IBD GD-5), C',
        U => num(U.genT && U.genT.ts[LET(m[1])])
      ];
    m = /^GEN\. COOLING GAS AIR COOLER OUTLET TEMP\.\s*\(([A-D])\)$/.exec(r.name);
    if (m)
      return [
        'model',
        (r.ins || '') + ' generator cooling gas after the air cooler (' + m[1] + ') (U.genT.ta, IBD GD-5), C',
        U => num(U.genT && U.genT.ta[LET(m[1])])
      ];
    if (/^AC EXCITER OUTLET AIR TEMP\.$/.test(r.name))
      return [
        'model',
        (r.ins || '') + ' AC exciter outlet air (U.genT.ex, IBD GD-5), C',
        U => num(U.genT && U.genT.ex)
      ];
    /* the gland steam seal header / LP inlet temperatures of the aux steam model (unit.js anAsTagStep, U.tt TEGS1002 / TEGS1003) */
    if (/^GLAND STEAM SEAL HEADER TEMP\.$/.test(r.name))
      return ['model', (r.ins || '') + ' gland steam seal header temperature (U.tt.TEGS1002, unit.js anAsTagStep), C', U => num(U.tt && U.tt.TEGS1002)];
    if (/^GLAND STEAM SEAL LP INLET TEMP\.$/.test(r.name))
      return ['model', (r.ins || '') + ' gland steam seal LP inlet temperature (U.tt.TEGS1003, unit.js anAsTagStep), C', U => num(U.tt && U.tt.TEGS1003)];
    if (/^HP TURBINE EXHAUST STEAM TEMP\./.test(r.name))
      return [
        'model',
        (r.ins || '') +
          ' HP exhaust steam = the cold reheat temperature of the model (unit.js X.T.cr, IBD TA-20 tcsHpx), C',
        U => num(U.xt && U.xt.T && U.xt.T.cr)
      ];
    return null;
  };
  const thc = r => {
    const by = thcBy(r);
    if (by) return by;
    const k = r.name
      .replace(/\s*\((A|B|C|D)\)\s*$/, '')
      .replace(/\s+/g, ' ')
      .replace(/\.\(/, '. (')
      .trim();
    const k2 = Object.keys(T).find(x => k === x || k.replace(/ /g, '') === x.replace(/ /g, ''));
    if (k2) return ['model', (r.ins || '') + ' ' + T[k2][0] + ', C', T[k2][1]];
    if (/^RTD$/.test(r.name))
      return [
        'needs',
        'cold junction RTD of the THC card: it reads the temperature inside the TCS cabinet, and the app has no TCS cabinet model'
      ];
    return ['needs', (r.ins || '') + ' ' + r.name + ': no such temperature in the turbine model', null];
  };

  /* ---------- COMM DO TABLES TCA980 ~ TCA982 ---------- */
  /* the drain MOV commands to the MCC: the OPEN / CLOSE command nets of their IBD sheets (the same nets that move tcs-dev.js U.dev.mov;
     net names from tcs-ibd-data.js, the sheet inputs "...OPEN" / "CLOSE" at the right edge) */
  const drainCmd = (sh, n, w) => 'drain MOV ' + w + ' command -> MCC: IBD ' + sh + ' net ' + n + ' (the net that moves tcs-dev.js U.dev.mov)';
  [
    ['TCA980-1', 'TC-12', 18, 'CRV(A) below seat close'],
    ['TCA980-2', 'TC-12', 16, 'CRV(A) below seat open'],
    ['TCA980-3', 'TC-7', 30, 'CV(A) above seat open'],
    ['TCA980-4', 'TC-7', 32, 'CV(A) above seat close'],
    ['TCA980-5', 'TC-5', 22, 'CV(B) below seat warming close'],
    ['TCA980-6', 'TC-5', 20, 'CV(B) below seat warming open'],
    ['TCA980-7', 'TC-1', 23, 'MSV(A) above seat open'],
    ['TCA980-8', 'TC-1', 25, 'MSV(A) above seat close'],
    ['TCA981-1', 'TC-13', 16, 'CRV(B) below seat open'],
    ['TCA981-2', 'TC-13', 18, 'CRV(B) below seat close'],
    ['TCA981-6', 'TC-2', 17, 'MSV(B) above seat open'],
    ['TCA981-7', 'TC-2', 19, 'MSV(B) above seat close'],
    ['TCA981-10', 'TC-20', 48, 'HP turbine warming valve close'],
    ['TCA981-11', 'TC-20', 45, 'HP turbine warming valve open'],
    ['TCA981-12', 'TC-8', 22, 'CV(B) above seat open'],
    ['TCA981-13', 'TC-8', 24, 'CV(B) above seat close']
  ].forEach(([id, sh, n, w]) => O(id, drainCmd(sh, n, w), ibd(sh, n)));
  O('TCA980-9', 'steam seal feed inlet valve close command -> MOV: IBD TC-31 net 16 (CLOSE)', ibd('TC-31', 16));
  O('TCA980-10', 'steam seal feed inlet valve open command -> MOV: IBD TC-31 net 14 (INLET VALVE OPEN)', ibd('TC-31', 14));
  O('TCA980-11', 'TURBINE GLAND STEAM LINE DRAIN VALVE OPEN COMMAND -> DCS STN102 I.040B TCS-DI1037 (IBD TE-6)');
  O('TCA980-12', 'TURBINE GLAND STEAM LINE DRAIN VALVE CLOSE COMMAND -> DCS STN102 I.040C TCS-DI1038 (IBD TE-6)');
  O('TCA980-13', 'STEAM SEAL FEED INLET VALVE CLOSED -> DCS STN102 I.0419 TCS-DI1032 (tcs-dev.js U.dev.mov.ssfi CLOSED)', U => dev(U, 'mov', 'ssfi', 'c'));
  O('TCA980-15', 'AMB. COLD MODE TEMP. -> DCS STN102 I.089C TCS-DI1057');
  O('TCA980-16', 'MODE JUDGEMENT INSTRUMENT NORMAL -> DCS STN102 I.089D TCS-DI1058: the metal temperature instruments of TCA500 have no fault in the model, healthy = 1', () => 1);
  O('TCA980-17', 'TURBINE START-UP AMBIENT COLD MODE -> DCS STN102 I.0410 TCS-DI1039', U =>
    U.tc ? b(U.tc.mode === 'amb') : NaN
  );
  O('TCA980-18', 'TURBINE START-UP COLD 1 MODE -> DCS STN102 I.0411 TCS-DI1040', U =>
    U.tc ? b(U.tc.mode === 'c1') : NaN
  );
  O('TCA980-19', 'TURBINE START-UP COLD 2 MODE -> DCS STN102 I.0412 TCS-DI1041', U =>
    U.tc ? b(U.tc.mode === 'c2') : NaN
  );
  O('TCA980-20', 'TURBINE START-UP HOT MODE -> DCS STN102 I.0414 TCS-DI1043 (ABC-050 / 051)', U =>
    U.tc ? b(U.tc.mode === 'hot') : NaN
  );
  O('TCA980-21', 'TURBINE START-UP WARM MODE -> DCS STN102 I.0413 TCS-DI1042 (ABC-050 / 051)', U =>
    U.tc ? b(U.tc.mode === 'warm') : NaN
  );
  O('TCA980-22', 'TURBINE LOAD HOLD -> DCS STN102 I.0415 TCS-DI1044', U => (U.tc ? b(!!U.tc.hold) : NaN));
  O('TCA980-24', '3-41 OPEN COMMAND -> AVR (field breaker 41)');
  O('TCA980-26', '41 OPEN COMMAND FROM ATS -> AVR');
  [
    'TCA980-27',
    'TCA980-28',
    'TCA980-29',
    'TCA980-30',
    'TCA981-14',
    'TCA981-15',
    'TCA981-16',
    'TCA981-22',
    'TCA981-23',
    'TCA981-24'
  ].forEach(id => O(id, 'command to the AVR / excitation panel: ' + avrNeeds));
  O('TCA980-31', 'RATED SPEED -> AVR / GCP (tcs-gen.js g.rated)', (U, L) => L.rated);
  O('TCA980-32', 'ST TRIP -> AVR / GCP', (U, L) => L.trip);
  O(
    'TCA981-8',
    'HP TURBINE WARMING LINE DRAIN VALVE CLOSE COMMAND -> DCS STN102 I.0408 TCS-DI1034 (DITL-75 row 11, IBD TE-1)'
  );
  O(
    'TCA981-9',
    'HP TURBINE WARMING LINE DRAIN VALVE OPEN COMMAND -> DCS STN102 I.0407 TCS-DI1033 (DITL-75 row 8, IBD TE-1)'
  );
  O('TCA981-17', 'oil purifier pump start command -> MCC (TB-15)');
  O('TCA981-18', 'space heater start command (AC exciter) -> MCC: IBD GD-2 net 1, the start memory (set by 52G OPEN)', ibd('GD-2', 1));
  O('TCA981-19', 'space heater start command (generator) -> MCC: IBD GD-1 net 1, the start memory (set by 52G OPEN)', ibd('GD-1', 1));
  O('TCA981-20', 'main oil tank vapour extractor start command -> MCC (TB-12, c.vex)', U => b(U.loVex));
  O('TCA981-21', 'gland steam exhauster start command -> MCC (TC-28, U.tco.gse)', U => b(U.tco && U.tco.gse));
  ['TCA981-27', 'TCA981-28', 'TCA981-29', 'TCA981-30', 'TCA981-31', 'TCA981-32'].forEach(id =>
    O(id, 'PLU / EOS channel test command -> the trip channel (IBD TA-15 / TA-33)')
  );
  ['TCA982-1', 'TCA982-2', 'TCA982-3', 'TCA982-18', 'TCA982-19', 'TCA982-20'].forEach(id =>
    O(id, 'non return valve solenoid energize -> field SV: ' + nrv)
  );
  O('TCA982-4', 'SV-GS1036 steam seal diverting valve solenoid -> field (TC-36)');
  O('TCA982-17', 'SV-CD1904 LP exhaust hood water spray valve solenoid -> field (TC-35, U.tco.hso)', U =>
    b(U.tco && U.tco.hso)
  );

  /* ---------- COMM AO TABLE TCA990 ---------- */
  O('TCA990-1', 'LUBE OIL COOLER OUTLET OIL TEMP.(A) -> DCS (XSMM, DCS I/O list sh 17)', U => num(U.loTout));
  O('TCA990-9', 'LUBE OIL COOLER OUTLET OIL TEMP.(B) -> DCS (XSMM, DCS I/O list sh 17)', U => num(U.loTout));
  O('TCA990-2', 'PV-GS1031 steam seal feed valve position demand -> valve (U.gsV31)', U => num(U.gsV31));
  O('TCA990-4', 'steam seal feed valve manipulation value -> valve (U.gsV31)', U => num(U.gsV31));
  O('TCA990-10', 'PV-GS1034 SPUV position demand -> valve (U.gsV34)', U => num(U.gsV34));
  O('TCA990-3', 'HP turbine warming valve position -> DCS, % (U.tt ZT-AS1011, tcs-dev.js U.dev.mov.wv)', U => dev(U, 'mov', 'wv', 'p'));
  O('TCA990-5', 'GEN. CURRENT(A) -> DCS STN102 AI0791 TCS-AI1006: ' + genNeeds);
  O('TCA990-12', 'GEN. CURRENT(B) -> DCS STN102 AI0855 TCS-AI1007: ' + genNeeds);
  O('TCA990-17', 'GEN. CURRENT(C) -> DCS STN102 AI0887 TCS-AI1011: ' + genNeeds);
  O('TCA990-6', 'GEN. VOLTAGE(A-B) -> DCS STN102 AI0807 GCP-AI1005, kV: tcs-gen.js g.V x 13.8 kV', U =>
    U && U.gen && isFinite(U.gen.V) ? U.gen.V * 13.8 : NaN
  );
  O('TCA990-13', 'GEN. VOLTAGE(B-C) -> DCS STN102 AI0871 TCS-AI1008, kV: tcs-gen.js g.V x 13.8 kV', U =>
    U && U.gen && isFinite(U.gen.V) ? U.gen.V * 13.8 : NaN
  );
  O('TCA990-18', 'GEN. VOLTAGE(C-A) -> DCS STN102 AI0903 TCS-AI1012, kV: tcs-gen.js g.V x 13.8 kV', U =>
    U && U.gen && isFinite(U.gen.V) ? U.gen.V * 13.8 : NaN
  );
  O('TCA990-11', 'GEN. MVAR -> DCS STN102 AI0775 GCP-AI1004: ' + genNeeds);
  O('TCA990-14', 'GEN. POWER FACTOR -> DCS STN102 AI0823 TCS-AI1009: ' + genNeeds);
  O('TCA990-15', 'FREQUENCY -> DCS STN102 AI0839 TCS-AI1010 (tcs-gen.js g.fg)', U => num(U.gen && U.gen.fg));

  /* ---------- TCS -> DCS MODBUS (LMYP-1 #1 MODBUS Communication list between DCS and turbine system.xls, sheets PLC to DCS / DCS to PLC) ----------
     The rows of the list whose signal is a PI/O table row above take that row (src/data/tcs-dcs.json modbus[].to = the row id). The rows
     below are the ones the COMM controller sends from the TPC (protection controller: its inputs are on the IBD, not on a TCE / TCA table),
     from the TSI, from the ATS program or from the generator: the value is the one the app already feeds to the same IBD input (tcs-trip.js
     TCS_IBD_NET) or the ATS / generator state of tcs.js. MB:<Modbus address>. */
  const MB = {};
  const mb = (k, kind, t, f) => (MB['MB:' + k] = [kind, t, f || null]);
  const crp = U => num(CRP(U));
  const vib = (U, k) => num(U['loV' + (k % 2 ? 'y' : 'x') + ((k >> 1) + 1)]);
  [1, 2, 3, 4].forEach((n, i) =>
    mb(
      10011 + n,
      'model',
      'ZS-ST1001-' +
        n +
        ' master trip solenoid (' +
        ['A1', 'A2', 'B1', 'B2'][i] +
        ') trip position (TPC, IBD ' +
        (i < 2 ? 'TA-2' : 'TA-3') +
        ' DE-ENERGIZE): the solenoids drop with the turbine trip of the model (tcsLiveRead trip)',
      (U, L) => L.trip
    )
  );
  /* TC-17 VENTILATOR VALVE: the valve follows its open command (no stroke model); the command is the TC-17 netlist output net 2 (off-page link 3) */
  mb(
    10023,
    'ibd',
    'ZSC-CR1902 ventilator valve full close: not the VENTILATOR VALVE OPEN COMMAND of IBD TC-17 (net 2)',
    U => {
      const v = ibd('TC-17', 2)(U);
      return isFinite(v) ? 1 - v : NaN;
    }
  );
  mb(
    10024,
    'ibd',
    'ZSO-CR1902 ventilator valve full open: the VENTILATOR VALVE OPEN COMMAND of IBD TC-17 (net 2)',
    ibd('TC-17', 2)
  );
  /* TC-18 BLOWDOWN VALVE: ENERGIZE CLOSE while the INTERCEPT VALVE OPEN DEMAND > 0.1 % (net 0, tcs-trip.js: U.tb.icv > 0.001) */
  mb(
    10036,
    'model',
    'ZSO-GS1039 blowdown valve full open: IBD TC-18 de-energize open = ICV open demand <= 0.1 % (U.tb.icv)',
    U => (U.tb && isFinite(U.tb.icv) ? b(U.tb.icv <= 0.001) : NaN)
  );
  mb(
    10037,
    'model',
    'ZSC-GS1039 blowdown valve full close: IBD TC-18 energize close = ICV open demand > 0.1 % (U.tb.icv)',
    U => (U.tb && isFinite(U.tb.icv) ? b(U.tb.icv > 0.001) : NaN)
  );
  mb(
    10038,
    'model',
    'turbine gland seal start group control complete: tcs.js c.gland (steam seal on and header pressure OK, IBD TC-31)',
    U => b(U.tc && U.tc.gland)
  );
  mb(10039, 'model', 'turbine gland seal stop group control complete: tcs.js c.gsOn off', U =>
    U.tc ? b(!U.tc.gsOn) : NaN
  );
  /* ATS (310SC90-775): steps 0 ~ 8 (tcs.js TCS.names + 8 SHUT DOWN). The app starts a step on its push button (tcsStepIn), so SELECTED and
     EXECUTED are both the step being run (c.cur); COMPLETED = the last finished step c.step at or past the step; MODE = the step being run, else
     the last finished one */
  const stp = (U, k, w) => {
    const c = U.tc;
    if (!c) return NaN;
    if (w === 'run') return b(c.cur === k);
    if (w === 'done') return b(k === 8 ? c.step === 8 : c.step >= k && c.step < 8);
    return b((c.cur >= 0 ? c.cur : c.step) === k);
  };
  for (let k = 0; k <= 8; k++) {
    mb(10040 + k, 'model', 'ATS step ' + k + ' selected: the step being run (tcs.js c.cur)', U => stp(U, k, 'run'));
    mb(10049 + k, 'model', 'ATS step ' + k + ' executed: the step being run (tcs.js c.cur)', U => stp(U, k, 'run'));
    mb(10058 + k, 'model', 'ATS step ' + k + ' completed: tcs.js c.step (tcsDone)', U => stp(U, k, 'done'));
    mb(
      10070 + k,
      'model',
      'ATS control mode of step ' + k + ': the step being run, else the last finished one (c.cur / c.step)',
      U => stp(U, k, 'mode')
    );
  }
  mb(10067, 'model', 'ATS criteria unsatisfied: the ATS hold of tcs.js (c.hold not empty, 310SC90-776)', U =>
    U.tc ? b(!!U.tc.hold) : NaN
  );
  mb(10068, 'sys', 'alive signal of the TCS COMM controller: the app has no communication fault, so healthy', () => 1);
  mb(10069, 'model', 'ATS AUTO ON: tcs.js c.auto', U => (U.tc ? b(U.tc.auto) : NaN));
  mb(10079, 'model', 'GOV operation: the GOV SET is the low select of TCE206 (not load limiting, U.tb.lim false)', U =>
    U.tb ? b(!U.tb.lim) : NaN
  );
  mb(10080, 'model', 'LLM operation: LOAD LIMITING of TCE206, the LLM SET is the lower one (U.tb.lim)', U =>
    U.tb ? b(U.tb.lim) : NaN
  );
  [1, 2, 3].forEach(n =>
    mb(
      30000 + n,
      'model',
      'PT-CR1901-' +
        n +
        ' HP turbine exhaust steam pressure (TPC, IBD TA-21): the exhaust pressure the app feeds to TA-21 (tcs-trip.js tcsCrp)',
      crp
    )
  );
  [1, 2, 3].forEach(n =>
    mb(30006 + n, 'model', 'PT-LO1003-' + n + ' bearing oil pressure (TPC, IBD TA-13): oil model U.loBrg', U =>
      num(U.loBrg)
    )
  );
  [1, 2, 3].forEach(n =>
    mb(30009 + n, 'model', 'PT-LO1006-' + n + ' control oil pressure (TPC, IBD TA-13): oil model U.loCtl', U =>
      num(U.loCtl)
    )
  );
  [1, 2, 3].forEach(n =>
    mb(30012 + n, 'model', 'PT-LO1007-' + n + ' turbine trip oil pressure (TPC, IBD TA-14): oil model U.loTrip', U =>
      num(U.loTrip)
    )
  );
  [1, 2, 3].forEach(n =>
    mb(
      30028 + n,
      'model',
      'PT-ST1110-' +
        n +
        ' LP exhaust hood pressure (condenser vacuum) (TPC, IBD TA-10): the condenser pressure the app feeds to TA-10 (U.cdP)',
      U => num(U.cdP)
    )
  );
  [1, 2].forEach(n =>
    mb(
      30085 + n,
      'needs',
      'ZE-ST1002-' +
        n +
        ' HP turbine differential expansion (TSI, IBD TD-4): the rotor / casing differential expansion is not in the turbine model'
    )
  );
  [1, 2, 3].forEach(n =>
    mb(
      30087 + n,
      'needs',
      'ZE-ST1003-' +
        n +
        ' turbine rotor position (TSI, IBD TA-12 thrust bearing failure trip): the axial rotor position is not in the turbine model'
    )
  );
  ['No.1 turbine', 'No.2 turbine', 'No.3 generator', 'No.4 generator'].forEach((s, i) =>
    [0, 1].forEach(j =>
      mb(
        30092 + 2 * i + j,
        'model',
        'VE-' +
          (i < 2 ? 'ST100' + (i + 1) : 'GE100' + (i - 1)) +
          '-' +
          (j + 1) +
          ' ' +
          s +
          ' shaft vibration (' +
          'XY'[j] +
          ') (TSI, IBD TA-17 / TA-18): oil model U.loV' +
          'xy'[j] +
          (i + 1),
        U => vib(U, 2 * i + j)
      )
    )
  );
  mb(30131, 'model', 'generator MW (A): the generator load of the model (tcsLiveRead mw)', (U, L) => num(L.mw));
  mb(30132, 'model', 'generator MW (B): the generator load of the model (tcsLiveRead mw)', (U, L) => num(L.mw));
  mb(30133, 'needs', 'generator Mvar: ' + genNeeds);
  ['A', 'B', 'C'].forEach((p, i) =>
    mb(30134 + i, 'model', 'generator voltage (' + p + '), kV: tcs-gen.js g.V x 13.8 kV (K1AU3E1-0003 G1 13.8 kV)', U =>
      U && U.gen && isFinite(U.gen.V) ? U.gen.V * 13.8 : NaN
    )
  );
  /* the hardwired TCS -> DCS points whose TCS end is not a PI/O table row (src/data/tcs-dcs.json 'to'): read by mbEnd / mbRead too */
  MB['IBD:TA-6#15'] = ['ibd', 'IBD TA-6 net 15: OR (MSV (A) & (B) FULL CLOSE, CV (A) & (B) FULL CLOSE, TCS MAJOR TROUBLE) (tcs-trip.js)', ibd('TA-6', 15)];
  MB['IBD:TA-1#10'] = ['ibd', 'IBD TA-1 input 10 (CENTRAL CONTROL ROOM) PB TURBINE TRIP: the operator console push button (tcs-trip.js)', ibd('TA-1', 10)];
  MB['GPP:86G'] = ['model', 'generator trip of the generator protection panel: a lockout relay 86G-A or 86G-B operated (gen-panel.js U.lo86)', U =>
    U && U.lo86 ? b(U.lo86.a || U.lo86.b) : 0];
  MB['GCP:MWH'] = ['model', 'generator watt-hour, MWh: the integral of the generator MW since the counter started (tcs-dev.js U.dev.mwh)', U =>
    U && U.dev && isFinite(U.dev.mwh) ? U.dev.mwh : NaN];
  /* DCS to PLC: the DCS commands that the COMM controller takes (STN102 WM0210 / WM0211 -> SI1900 / SI1901). In the app the same commands are
     the tcsCmd of tcs.js */
  mb('DO1', 'out', 'turbine gland seal group start command -> TCS (IBD TC-31 START, tcsCmd ibd TC-31)');
  mb('DO2', 'out', 'turbine gland seal group stop command -> TCS (IBD TC-31 STOP, tcsCmd ibd TC-31)');
  mb('DO3', 'out', 'ATS AUTO mode push button -> TCS (tcsCmd auto on)', U => (U.tc ? b(U.tc.auto) : NaN));
  mb('DO4', 'out', 'ATS OFF mode push button -> TCS (tcsCmd auto off)', U => (U.tc ? b(!U.tc.auto) : NaN));
  ['warm', 'prep', 'rub', 'accel', 'excite', 'sync', 'loadup', 'normal', 'shutdown'].forEach((c, k) =>
    mb('DO' + (5 + k), 'out', 'ATS step ' + k + ' select push button -> TCS (tcsCmd ' + c + ', tcsStepIn)', U =>
      stp(U, k, 'run')
    )
  );
  mb('DO25', 'sys', 'alive signal of the DCS to the TCS: the app has no communication fault, so healthy', () => 1);

  const byId = {};
  for (const e of E) byId[e[0]] = e;
  /* the end of a table row (the explicit table above, else the rules for servo and temperature rows) */
  function end(r) {
    if (r.spare) return { kind: 'spare', text: 'spare channel (drawn SPARE / blank)' };
    const e = byId[r.id];
    if (e) return { kind: e[1], text: e[2], read: e[3] || null, dcs: e[4] || null };
    const s = /^SERVO/.test(r.kind) ? SERVO(r) : /^(THC|RTD)$/.test(r.kind) ? thc(r) : null;
    if (s) return { kind: s[0], text: s[1], read: s[2] || null };
    return { kind: 'none', text: 'no end yet' };
  }
  /* the port names of lane 1 (tests/tce/sheets.cjs): PIO:<table>-<n> and PIO:<logic sheet>.<PI/O box> */
  function ports(rows, spare) {
    const P = {};
    for (const q of spare || []) P['PIO:' + q.sheet + '.' + q.box] = 'SPARE';
    for (const r of rows) {
      P['PIO:' + r.id] = r.id;
      for (const p of r.pin || [])
        if (p.box) P['PIO:' + p.sheet + '.' + p.box] = P['PIO:' + p.sheet + '.' + p.box] || r.id;
    }
    return P;
  }
  function make(list) {
    const rows = list.rows,
      idx = {};
    rows.forEach(r => (idx[r.id] = r));
    const P = ports(rows, list.spareBox);
    const api = {
      rows,
      ports: P,
      row: id => idx[id],
      end: id =>
        id === 'SPARE' ? { kind: 'spare', text: 'PI/O box drawn SPARE on the sheet' } : idx[id] ? end(idx[id]) : null,
      /* the value of a port for the sheet program (an input: DI / AI ...; an output: the engine's own value, for the shadow run) */
      read(U, port) {
        const id = P[port] || port,
          r = idx[id];
        if (!r) return NaN;
        const e = end(r);
        if (!e.read) return NaN;
        try {
          const v = e.read(U, L_(U));
          return v === true ? 1 : v === false ? 0 : v == null ? NaN : +v;
        } catch (x) {
          return NaN;
        }
      },
      /* many reads at one moment: the plant values behind them are read once */
      batch(U, f) {
        memo = { U };
        try {
          return f();
        } finally {
          memo = null;
        }
      },
      stats() {
        const s = { rows: rows.length, used: 0, pin: 0, byKind: {} };
        for (const r of rows) {
          const k = end(r).kind;
          s.byKind[k] = (s.byKind[k] || 0) + 1;
          if (!r.spare) {
            s.used++;
            if (r.pin) s.pin++;
          }
        }
        return s;
      },
      needs: () => rows.filter(r => end(r).kind === 'needs').map(r => [r.id, r.name, end(r).text]),
      /* the end of a Modbus row of src/data/tcs-dcs.json: a PI/O table row id, or MB:<address> above */
      mbEnd(to) {
        if (MB[to]) return { kind: MB[to][0], text: MB[to][1], read: MB[to][2] };
        return idx[to] ? end(idx[to]) : null;
      },
      mbRead(U, to) {
        const e = api.mbEnd(to);
        if (!e || !e.read) return NaN;
        try {
          const v = e.read(U, L_(U));
          return v === true ? 1 : v === false ? 0 : v == null ? NaN : +v;
        } catch (x) {
          return NaN;
        }
      }
    };
    return api;
  }
  root.TCE_IO = { make, ends: E, ibd, modbus: MB };
})(typeof window !== 'undefined' ? window : globalThis);
