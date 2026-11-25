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
  const L_ = U =>
    (typeof tcsLiveRead === 'function' ? tcsLiveRead(U) : AP(U) && AP(U).tceRead ? AP(U).tceRead() : U && U._L) || {};
  const VT = U => {
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
  const STEAM = U =>
    (typeof tcsSteam === 'function' ? tcsSteam(U) : AP(U) && AP(U).tceSteam ? AP(U).tceSteam() : U && U._steam) || {
      msp: U && isFinite(U.Pmsv) ? U.Pmsv : NaN
    };
  const CRP = U => (typeof tcsCrp === 'function' ? tcsCrp(U) : AP(U) && AP(U).tceCrp ? AP(U).tceCrp() : U && U._crp);
  const ibd = (sh, n) => U => {
    try {
      const s = typeof AN !== 'undefined' && AN.tcsIbd ? AN.tcsIbd(sh) : U && U._ibd && U._ibd[sh];
      return s && s.v ? (s.v[n] > 0.5 ? 1 : 0) : NaN;
    } catch (e) {
      return NaN;
    }
  };
  const num = v => (isFinite(v) ? +v : NaN);
  const b = v => (v ? 1 : 0);
  /* [row id, kind, text, read(U, L)] */
  const E = [];
  const M = (id, t, f) => E.push([id, 'model', t, f]);
  const D = (id, t, stn, addr, tag) => E.push([id, 'dcs', t, null, { stn, addr, tag }]);
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
  N('TCE900-8', 'ZS-LO1003 hand turning interlock position: the hand turning device has no state in the model');
  M(
    'TCE900-9',
    'ZS-LO1906-1 turning gear engage position: tcs.js c.tg selected and the shaft at turning speed (<= 4 rpm, PR-OPE-5002 7955)',
    U => b(U.tc && U.tc.tg && U.tb && U.tb.rpm <= 4)
  );
  M('TCE900-10', 'ZS-LO1906-2 turning gear disengage position: not engaged (TCE900-9)', U =>
    b(!(U.tc && U.tc.tg && U.tb && U.tb.rpm <= 4))
  );
  N('TCE900-11', 'turning gear motor engage push button of the local panel (TB-10): no local panel in the app');
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
  N(
    'TCE900-19',
    'DS CLOSED (generator disconnecting switch, GMCB): the switch has no state in the model (elec.js has 52G / 52L only)'
  );
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
  N('TCE901-5', 'turning gear motor jog push button of the local panel (TB-9): no local panel in the app');
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
  O('TCE960-6', 'turning gear motor start command -> MCC (TB-9)');
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
  O('TCE960-20', 'DCS MODE ON FEEDBACK -> DCS STN101 I.0082 TCS-DI1047 (ABC-001C)');
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
  O('TCE960-30', 'GEN. LOCKOUT RELAY (86G) A OPERATED -> DCS STN102 I.093A TCS-DI1053');
  O('TCE960-31', 'GEN. LOCKOUT RELAY (86G) B OPERATED -> DCS STN102 I.093B TCS-DI1054');
  O('TCE960-32', 'ICV TO CV TRANSFER COMPLETE -> DCS STN102 I.0418 TCS-DI1031 (ABC-050)', (U, L) => L.xfer);
  /* ---------- EHG DO TABLE(2) TCE961 ---------- */
  O('TCE961-1', 'control oil pump (B) start command -> MCC (c.cop[1])', (U, L) => L.copB);
  O('TCE961-2', 'main oil pump (B) start command -> MCC (c.mop[1])', (U, L) => L.mopB);
  O('TCE961-3', 'ASD1 START SIGNAL (52G) -> synchronizer ASD1 (tcs-gen.js g.start)', (U, L) => L.synStart);
  O('TCE961-5', 'DCS CONTROL MODE PERMISSIVE -> DCS STN101 I.0081 TCS-DI1046 (ABC-001C)');
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
  O('TCE961-19', 'turning gear motor start lamp -> local panel (TB-9)');
  /* ---------- EHG AO TABLE(1) TCE970 ---------- */
  O('TCE970-1', 'TARGET MW SET POINT FEED BACK -> DCS STN101 AI0420 TCS-AI1001', U => num(U.tb && U.tb.tgt));
  O('TCE970-2', 'TURBINE LOAD UP RATE -> DCS STN101 AI0421 TCS-AI1005 (max turbine load up rate set point)');
  O('TCE970-3', 'HP turbine first stage steam pressure (A) -> DCS');
  O('TCE970-4', 'HP turbine first stage steam pressure (B) -> DCS');
  O('TCE970-5', 'HP turbine first stage steam pressure (C) -> DCS');
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
      return [
        'out',
        k + ' servo valve coil drive -> the valve actuator (the model moves the valve from the flow demand, tcs.js)',
        null
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
    'the MOV is not in the turbine model (no position, no torque switch): turbine drain valves and their MOVs (IBD TC-1 ~ TC-13, TC-20, TC-31)';
  [
    'TCA900-1',
    'TCA900-2',
    'TCA900-4',
    'TCA900-5',
    'TCA900-7',
    'TCA900-8',
    'TCA900-13',
    'TCA900-14',
    'TCA900-15',
    'TCA900-29',
    'TCA900-30',
    'TCA900-31',
    'TCA901-1',
    'TCA901-2',
    'TCA901-4',
    'TCA901-5',
    'TCA901-7',
    'TCA901-8',
    'TCA901-14',
    'TCA901-15',
    'TCA901-28',
    'TCA901-29',
    'TCA901-30',
    'TCA901-31',
    'TCA902-1',
    'TCA902-2',
    'TCA902-4',
    'TCA902-5',
    'TCA902-12',
    'TCA902-13',
    'TCA902-14',
    'TCA902-15',
    'TCA904-21',
    'TCA904-22',
    'TCA904-28',
    'TCA904-29'
  ].forEach(id => N(id, drainNeeds));
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
  [
    'TCA900-10',
    'TCA900-11',
    'TCA900-12',
    'TCA900-24',
    'TCA900-25',
    'TCA900-26',
    'TCA900-27',
    'TCA901-11',
    'TCA901-12',
    'TCA901-13',
    'TCA902-21',
    'TCA902-22',
    'TCA902-27',
    'TCA902-30',
    'TCA902-31',
    'TCA903-1',
    'TCA903-2',
    'TCA903-3',
    'TCA903-4',
    'TCA903-5',
    'TCA903-6',
    'TCA903-7',
    'TCA904-19',
    'TCA904-25',
    'TCA904-26',
    'TCA904-27',
    'TCA905-3',
    'TCA905-4',
    'TCA905-19',
    'TCA905-20',
    'TCA905-25'
  ].forEach(id => N(id, avrNeeds));
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
    'the extraction steam non return valve (AOV) has no position in the model: extraction NRV and its solenoid (IBD TC-41 ~ TC-45)';
  [
    'TCA900-21',
    'TCA900-22',
    'TCA901-17',
    'TCA901-18',
    'TCA901-20',
    'TCA901-21',
    'TCA902-17',
    'TCA902-18',
    'TCA903-17',
    'TCA903-18'
  ].forEach(id => N(id, nrv));
  N('TCA904-5', 'ZSC-CR1901 cold reheat non return valve full close: no position in the model');
  N('TCA904-6', 'ZSO-CR1901 cold reheat non return valve full open: no position in the model');
  N(
    'TCA904-3',
    'ZSC-CD1904 LP exhaust hood water spray valve full close: the hood spray valve of the model has no limit switch yet (U.tco.hso is the spray on)'
  );
  N('TCA904-4', 'ZSO-CD1904 LP exhaust hood water spray valve full open: as TCA904-3');
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
  N('TCA902-20', 'DPIS-LO1932 duplex oil filter differential pressure: the filter is not in the oil model');
  N('TCA904-7', 'LSH-GE1001 generator water and oil leakage level high: not in the model');
  N('TCA904-8', 'DPIS-LO1942 lube oil conditioner coalescer filter dP high: not in the model');
  N('TCA905-5', 'LSL-LO1920-1 main oil tank level low: the tank level is not in the oil model');
  N('TCA905-21', 'LSH-LO1920-2 main oil tank level high: as TCA905-5');
  N('TCA905-6', 'DPIS-LO1933-A control oil line filter (A) dP high: not in the model');
  N('TCA905-22', 'DPIS-LO1933-B control oil line filter (B) dP high: not in the model');
  M('TCA904-12', 'gland steam exhauster running: the gland model (U.tco.gse, tcs.js)', U => b(U.tco && U.tco.gse));
  F('TCA904-11');
  N(
    'TCA904-20',
    'ZSC-GS1031 steam seal feed valve full close: the valve position is U.gsV31 but the limit switch setting is not in the docs read'
  );
  N('TCA904-24', 'ZSC-GS1032 SSFV bypass valve full close: the bypass valve is not in the gland model');
  N('TCA905-7', 'space heater running (generator): not in the model');
  N('TCA905-8', 'space heater running (AC exciter): not in the model');
  F('TCA905-9');
  F('TCA905-10');
  /* TSI contacts */
  const tsi =
    'TSI shaft vibration HIGH contact (IBD TA-18): the vibration exists (U.loVx / loVy) but the TSI HIGH setting is not in the docs read';
  ['TCA904-1', 'TCA904-2', 'TCA904-17', 'TCA904-18', 'TCA905-1', 'TCA905-2', 'TCA905-17', 'TCA905-18'].forEach(id =>
    N(id, tsi)
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
  [
    'TCA930-2',
    'TCA930-3',
    'TCA930-10',
    'TCA930-11',
    'TCA930-12',
    'TCA930-13',
    'TCA930-17',
    'TCA930-18',
    'TCA931-17',
    'TCA931-18'
  ].forEach(id => N(id, genNeeds));
  M('TCA931-21', 'GEN. FREQUENCY, Hz: the shaft frequency of the generator model (tcs-gen.js g.fg = rpm / 60)', U =>
    num(U.gen && U.gen.fg)
  );
  D(
    'TCA931-2',
    'AUX STEAM HEADER PRESS. (LOWER) from the DCS: STN102 AO0404 TCS-AS1004 (XSMM, IBD TC-20)',
    2,
    'AO0404',
    'TCS-AS1004'
  );
  N('TCA931-3', 'gland steam drain separator turbine side temperature: not in the gland model');
  N('TCA931-9', 'ZE-ST1002 LP turbine differential expansion: not in the model');
  M('TCA931-10', 'ZE-ST1001 turbine shell expansion (HP turbine side), mm (tcs.js c.sexp)', U =>
    num(U.tc && U.tc.sexp)
  );
  N('TCA931-11', 'ZE-ST1004 low speed eccentricity: not in the model');
  M('TCA932-1', 'ZT-GS1031 steam seal feed valve position, % (U.gsV31)', U => num(U.gsV31));
  M('TCA932-2', 'ZT-GS1034 steam packing unloading valve position, % (U.gsV34)', U => num(U.gsV34));
  N('TCA932-3', 'ZT-ST1008 CV(B) below seat secondary warming drain valve position: ' + drainNeeds);
  N('TCA932-4', 'ZT-AS1011 HP turbine warming valve position: ' + drainNeeds);

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
  const drainCmd = 'command to the turbine drain MOV -> MCC: ' + drainNeeds;
  [
    'TCA980-1',
    'TCA980-2',
    'TCA980-3',
    'TCA980-4',
    'TCA980-5',
    'TCA980-6',
    'TCA980-7',
    'TCA980-8',
    'TCA981-1',
    'TCA981-2',
    'TCA981-6',
    'TCA981-7',
    'TCA981-10',
    'TCA981-11',
    'TCA981-12',
    'TCA981-13'
  ].forEach(id => O(id, drainCmd));
  O('TCA980-9', 'steam seal feed inlet valve close command -> MOV (TC-31)');
  O('TCA980-10', 'steam seal feed inlet valve open command -> MOV (TC-31)');
  O('TCA980-11', 'TURBINE GLAND STEAM LINE DRAIN VALVE OPEN COMMAND -> DCS STN102 I.040B TCS-DI1037 (IBD TE-6)');
  O('TCA980-12', 'TURBINE GLAND STEAM LINE DRAIN VALVE CLOSE COMMAND -> DCS STN102 I.040C TCS-DI1038 (IBD TE-6)');
  O('TCA980-13', 'STEAM SEAL FEED INLET VALVE CLOSED -> DCS STN102 I.0419 TCS-DI1032');
  O('TCA980-15', 'AMB. COLD MODE TEMP. -> DCS STN102 I.089C TCS-DI1057');
  O('TCA980-16', 'MODE JUDGEMENT INSTRUMENT NORMAL -> DCS STN102 I.089D TCS-DI1058');
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
  O('TCA981-18', 'space heater start command (AC exciter) -> MCC (GD-2)');
  O('TCA981-19', 'space heater start command (generator) -> MCC (GD-1)');
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
  O('TCA990-3', 'HP turbine warming valve position -> DCS: ' + drainNeeds);
  O('TCA990-5', 'GEN. CURRENT(A) -> DCS STN102 AI0791 TCS-AI1006: ' + genNeeds);
  O('TCA990-12', 'GEN. CURRENT(B) -> DCS STN102 AI0855 TCS-AI1007: ' + genNeeds);
  O('TCA990-17', 'GEN. CURRENT(C) -> DCS STN102 AI0887 TCS-AI1011: ' + genNeeds);
  O('TCA990-6', 'GEN. VOLTAGE(A-B) -> DCS STN102 AI0807 GCP-AI1005: ' + genNeeds);
  O('TCA990-13', 'GEN. VOLTAGE(B-C) -> DCS STN102 AI0871 TCS-AI1008: ' + genNeeds);
  O('TCA990-18', 'GEN. VOLTAGE(C-A) -> DCS STN102 AI0903 TCS-AI1012: ' + genNeeds);
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
  ['A', 'B', 'C'].forEach((p, i) => mb(30134 + i, 'needs', 'generator voltage (' + p + '): ' + genNeeds));
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
