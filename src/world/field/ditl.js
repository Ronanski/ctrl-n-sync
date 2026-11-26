/* src/world/field/ditl.js: LANE 1 (MARIA), Phase 6 DITL half (phase thread handoff 2026-11-26, /mnt/project-files/phase6/
   phase6-ditl-handoff-2026-11-26.md, B1 DITL inputs with no source). Field signals of DITL input rows that the linker leaves without a source
   (src/world/field/README.md). Each row reads engine state that already exists, or a field state with its documented normal value. */

/* 1. DITL-42 rows 1 ~ 6: PLANT / INSTRUMENT AIR COMPRESSOR A ~ C RUNNING (MIR-C0703A ~ C, MIR-C0704A ~ C, from the HVP soft starter). The same
   running contacts are the input rows of DITL-114 (plant air) / DITL-113 (instrument air) rows 5 / 12 / 19 (IA: I.0015 / I.0095 / I.0335,
   the addresses of DITL-42 rows 4 ~ 6), which the air model writes (unit.js anAirStep, U.paR0..2 / U.iaR0..2 = the RUNNING contact of the
   local panel). One source: the model's run state, here on the alarm sheet DITL-42 too */
FIELD.add(
  lane,
  [
    ['C0703', 'pa', 'PLANT'],
    ['C0704', 'ia', 'INSTRUMENT']
  ].flatMap(([t, k, w]) =>
    ['A', 'B', 'C'].map((x, i) => ({
      stn: 5,
      di: 1,
      tag: 'MIR-' + t + x,
      sheet: 'DITL-42',
      v: U => (Array.isArray(U[k + 'Run']) ? (U[k + 'R' + i] ? 1 : 0) : NaN),
      rel: w.toLowerCase() + ' air compressor ' + x + ' running (the RUNNING contact of the air model)',
      src: 'DITL-42 row ' + (k === 'pa' ? i + 1 : i + 4) + ' MIR-' + t + x + '; the same contact on DITL-11' + (k === 'pa' ? '4' : '3') + ' row ' + [5, 12, 19][i] + ' (unit.js anAirStep)'
    }))
  )
);

/* 2. DITL-45 (A) / #B / #C PLANT / INSTRUMENT AIR DRYER REMOTE and PLANT AIR DRYER ALARM: the FROM column names an output of the same sheet
   (45-55 / 45-56 / 45-66), that is the station channel of the field contact repeated to the CRT, not its source (the same reading as
   field/boiler.js item 10). The source is the dryer local panel:
   - REMOTE (I.0085 / 88 / 8B plant, I.0099 / 9C / 9F instrument): the dryer is started from the DCS (DITL-45 START P.B. from the CRT,
     M.1110 / 1115 / 111A, M.1120 / 1125 / 112A) in service, so its selector stands at REMOTE: normal 1. DERIVED from the drawing
   - ALARM (I.0084 / 87 / 8A): no alarm in service: normal 0 */
{
  const D = [
      ['A', '', '85', '84', '99'],
      ['B', ' #B', '88', '87', '9C'],
      ['C', ' #C', '8B', '8A', '9F']
    ],
    st = [],
    rw = [];
  for (const [x, cp, rp, al, ri] of D) {
    const sh = 'DITL-45' + cp;
    st.push(
      { id: 'PA-DRY-' + x + '.remote', tag: 'MIL-D0703' + x, normal: 1, t: 'Plant air dryer ' + x + ' not in remote', g: 'Other',
        src: 'DITL-45' + cp + ' rows 5 / 9 I.00' + rp + ' PLANT AIR DRYER-' + x + ' REMOTE (DCS start P.B. on the same sheet: in service = REMOTE)' },
      { id: 'PA-DRY-' + x + '.alarm', tag: 'MIT-D0703' + x, normal: 0, t: 'Plant air dryer ' + x + ' alarm', g: 'Other',
        src: 'DITL-45' + cp + ' row 6 I.00' + al + ' PLANT AIR DRYER-' + x + ' ALARM' },
      { id: 'IA-DRY-' + x + '.remote', tag: 'MIL-D0704' + x, normal: 1, t: 'Instrument air dryer ' + x + ' not in remote', g: 'Other',
        src: 'DITL-45' + cp + ' rows 16 / 20 I.00' + ri + ' INSTRUMENT AIR DRYER-' + x + ' REMOTE (DCS start P.B. on the same sheet)' }
    );
    rw.push(
      { stn: 5, di: 1, tag: 'PLANT AIR DRYER-' + x + ' REMOTE', io: 'MIL-D0703' + x, adr: 'I.00' + rp, sheet: sh, v: (U, X) => X.state('PA-DRY-' + x + '.remote'),
        rel: 'plant air dryer ' + x + ' selector at REMOTE', src: sh + ' rows 5 / 9' },
      { stn: 5, di: 1, tag: 'PLANT AIR DRYER-' + x + ' ALARM', io: 'MIT-D0703' + x, adr: 'I.00' + al, sheet: sh, v: (U, X) => X.state('PA-DRY-' + x + '.alarm'),
        rel: 'plant air dryer ' + x + ' alarm contact', src: sh + ' row 6' },
      { stn: 5, di: 1, tag: 'INSTRUMENT AIR DRYER-' + x + ' REMOTE', io: 'MIL-D0704' + x, adr: 'I.00' + ri, sheet: sh, v: (U, X) => X.state('IA-DRY-' + x + '.remote'),
        rel: 'instrument air dryer ' + x + ' selector at REMOTE', src: sh + ' rows 16 / 20' }
    );
  }
  FIELD.state(lane, st);
  FIELD.add(lane, rw);
}

/* 3. The sootblower trips and the air preheater sootblower LOCAL selector (DITL-80K row 10, DITL-80M row 2, DITL-80Q rows 11 / 12 / 38 / 39;
   FROM SB PANEL / LOCAL/MCC). Field contacts of the sootblower panel with no physics in the model: field states with the value of the
   normal service state. TRIP: not tripped, normal 0. LOCAL SELECTED (I.073E): the sootblowing program runs from the DCS (DITL-80M REMOTE
   START P.B. from the CRT, DITL-80K REMOTE START COMMAND), so the APH sootblower system stands at REMOTE: LOCAL normal 0. DERIVED from the
   drawings */
FIELD.state(lane, [
  ...['1011', '1012', '1038'].map(n => ({ id: 'SB-N' + n + '.trip', tag: 'MIT-N' + n, normal: 0, t: 'Sootblower N-' + n + ' trip',
    g: 'Boiler', src: 'DITL-80Q row ' + { 1011: 11, 1012: 12, 1038: 38 }[n] + ' N-' + n + ' SOOTBLOWER TRIP from the SB panel' })),
  { id: 'SB-APH.trip', tag: 'MIT-SB-APH01', normal: 0, t: 'Air preheater sootblower trip', g: 'Boiler',
    src: 'DITL-80K row 10 I.073D (SB-PANEL), DITL-80Q row 39 (LOCAL/MCC) AIR PREHEATER SOOTBLOWER TRIP' },
  { id: 'SB-APH.local', tag: 'MIL-SB-APH01', normal: 0, t: 'Air preheater sootblower system in local',
    g: 'Boiler', src: 'DITL-80M row 2 I.073E AIR PREHEATER SOOTBLOWER SYSTEM LOCAL SELECTED (LOCAL/MCC)' }
]);
/* the rows match by a word of their text (plantsw.js build: the tag is one of the first words): the sootblower number, the I/O address.
   DITL-80Q row 39 AIR PREHEATER SOOTBLOWER TRIP has neither (it is the same contact as DITL-80K row 10 I.073D): left to the linker */
FIELD.add(lane, [
  ...['1011', '1012', '1038'].map(n => ({ stn: 2, di: 1, tag: 'N-' + n, io: 'MIT-N' + n, sheet: 'DITL-80Q', v: (U, X) => X.state('SB-N' + n + '.trip'),
    rel: 'sootblower N-' + n + ' trip contact of the SB panel', src: 'DITL-80Q row ' + { 1011: 11, 1012: 12, 1038: 38 }[n] + ' (SB PANEL)' })),
  { stn: 2, di: 1, tag: 'I.073D', io: 'MIT-SB-APH01', sheet: 'DITL-80K', v: (U, X) => X.state('SB-APH.trip'), rel: 'air preheater sootblower trip contact',
    src: 'DITL-80K row 10 I.073D' },
  { stn: 2, di: 1, tag: 'I.073E', io: 'MIL-SB-APH01', sheet: 'DITL-80M', v: (U, X) => X.state('SB-APH.local'),
    rel: 'air preheater sootblower system selector at LOCAL', src: 'DITL-80M row 2 I.073E' }
]);

/* 4. Phase 6 DITL, PC read of YUA (/mnt/project-files/phase6-ditl-sources-2026-11-26-20261126T113311-0f7f.md, groups A ~ D). The bottom
   ash, limestone and sand logic run inside the DCS (stations 103 / 104). Field contacts with no physics in the model are field states with
   their documented normal value; a contact the model already has (sand silo high, limestone air receiver) reads the model. A row whose
   text has no tag or address word is bound by its drawn row number (`row`, src/world/plantsw.js FIELD rows) */
{
  const st = [],
    rw = [],
    S = (id, tag, normal, t, g, src) => st.push({ id, tag, normal, t, g, src }),
    R = (o) => rw.push(o);
  /* 4a. DITL-21A (A / #B / #C / #D) row 17 SCREW COOLER x TRIP: FROM "21A-57" = row 57 of the same sheet, the field trip contact MIT-L1060x
     of the screw cooler inverter panel (YUA A2: DITL-21A row 57, IO list stn 103). 0 in service (1 = trip) */
  [['A', '', 'I.0252'], ['B', ' #B', 'I.0532'], ['C', ' #C', 'I.0642'], ['D', ' #D', 'I.0682']].forEach(([x, cp, a]) => {
    const id = 'L1060-' + x + '.trip';
    S(id, 'MIT-L1060' + x, 0, 'Bottom ash screw cooler ' + x + ' inverter trip', 'Boiler',
      'IO list stn 103 ' + a + ' MIT-L1060' + x + '; DITL-21A' + cp + ' rows 17 / 57 (YUA A2)');
    R({ stn: 3, di: 1, tag: 'MIT-L1060' + x, adr: a, sheet: 'DITL-21A' + cp, v: (U, X) => X.state(id),
      rel: 'screw cooler ' + x + ' inverter trip contact', src: 'DITL-21A' + cp + ' row 17 ' + a + ' FROM 21A-57' });
  });
  /* 4b. bottom ash (station 103). N.O. switches, 0 in service (YUA B10: IO list stn 103 "1: abnormal"). LS-BH1752 BUFFER TANK LOW LEVEL
     (I.0498, 1 = low): the screw coolers stand stopped at 150 MW (HMI snapshot 16.PNG, field/boiler.js), so no ash reaches the buffer
     tank and it stands low: normal 1, INFERRED from the model state */
  S('BH1752.low', 'LS-BH1752', 1, 'Bottom ash buffer tank not low', 'Boiler', 'IO list stn 103 I.0498 LS-BH1752 (N.O., 1 = low); DITL-BA01 row 12; INFERRED normal 1 (coolers stopped, 16.PNG)');
  R({ stn: 3, di: 1, tag: 'LS-BH1752', sheet: 'DITL-BA01', v: (U, X) => X.state('BH1752.low'), rel: 'buffer tank low level switch', src: 'DITL-BA01 row 12' });
  [
    ['ZS-BH1750', 'I.0243', 2, 'Chain conveyor block switch operated'],
    ['ZS-BH1751', 'I.0244', 4, 'Bucket elevator chain slack limit operated'],
    ['ZS-BH1752', 'I.0245', 5, 'Bucket elevator block switch operated'],
    ['LS-BH1751', 'I.048E', 16, 'Bottom ash buffer tank high level'],
    ['PDS_H-BH1750', 'I.0246', 17, 'Bottom ash bag filter differential pressure high'],
    ['PDS_L-BH1750', 'I.0247', 18, 'Bottom ash bag filter differential pressure low'],
    ['LS-BH1754', 'I.0248', 19, 'Ash silo high level'],
    ['LS-BH1753', 'I.0249', 20, 'Ash silo low level']
  ].forEach(([tag, a, r, t]) => {
    const id = tag.replace(/^[A-Z_]+-/, '') + '.' + tag.split('-')[0].toLowerCase();
    S(id, tag, 0, t, 'Boiler', 'IO list stn 103 ' + a + ' ' + tag + ' (N.O., 0 in service); DITL-BA60 row ' + r + ' (YUA B10)');
    R({ stn: 3, di: 1, tag, sheet: 'DITL-BA60', v: (U, X) => X.state(id), rel: tag + ' field switch', src: 'DITL-BA60 row ' + r + ' ' + a });
  });
  /* DITL-BA02 row 12 LSH-SD1800 SAND SILO HI LEVEL (I.0577): the sand silo high switch of the sand model, the same contact as DITL-774
     "SAND SILO LH" (plantsw.js sdSw siloH, boiler.js AN_SD) */
  R({ stn: 3, di: 1, tag: 'LSH-SD1800', sheet: 'DITL-BA02', v: U => (U.sd && U.sd.sw && isFinite(U.sd.sw.siloH) ? U.sd.sw.siloH : NaN),
    rel: 'sand silo high level of the sand model (U.sd.sw.siloH)', src: 'DITL-BA02 row 12 I.0577; IO list stn 103 r475 (YUA B10)' });
  /* MIT-M1301 SAND VENTING FAN TRIP, I.0571 (DITL-BA03 row 11, BA11 row 2; sand DITL-774 row 12 and DITL-777 row 11 read the same address):
     0 in service (1 = trip) */
  S('M1301.trip', 'MIT-M1301', 0, 'Sand silo venting fan trip', 'Boiler', 'IO list stn 103 r469 I.0571 MIT-M1301; DITL-BA03 r11, BA11 r2, 774 r12, 777 r11 (YUA B10 / D17)');
  R({ stn: 3, di: 1, tag: 'MIT-M1301', v: (U, X) => X.state('M1301.trip'), rel: 'sand venting fan trip contact', src: 'DITL-BA03 row 11 / BA11 row 2' });
  R({ stn: 3, di: 1, tag: 'I.0571', io: 'MIT-M1301', sheet: 'DITL-774', row: 12, v: (U, X) => X.state('M1301.trip'), rel: 'sand venting fan trip contact', src: 'DITL-774 row 12 I.0571' });
  R({ stn: 3, di: 1, tag: 'I.0571', io: 'MIT-M1301', sheet: 'DITL-777', row: 11, v: (U, X) => X.state('M1301.trip'), rel: 'sand venting fan trip contact', src: 'DITL-777 row 11 I.0571' });
  /* DITL-774 row 5 DPS-SD1800 VENT FILTER PURGE FAULT, I.056C: 0 in service (YUA D17, fault contact) */
  S('SD1800.purge', 'DPS-SD1800', 0, 'Sand silo vent filter purge fault', 'Boiler', 'IO list stn 103 r464 I.056C DPS-SD1800; DITL-774 row 5 (YUA D17)');
  R({ stn: 3, di: 1, tag: 'DPS-SD1800', sheet: 'DITL-774', row: 5, v: (U, X) => X.state('SD1800.purge'), rel: 'vent filter purge fault contact', src: 'DITL-774 row 5 I.056C' });
  /* 4c. DCS(HMI) flasher bits (YUA B9): DITL-BA52 row 1 M.133F ON 1 s / OFF 0.5 s (hd600 pdf p.52); DITL-BA69 row 13 M.135F ON 300 ms /
     OFF 6 s (conveyors pdf p.11). A free-running clock of the DCS: the time of the unit model */
  const fl = (on, off) => U => (isFinite(U.t) ? (U.t % (on + off) < on ? 1 : 0) : NaN);
  R({ stn: 3, di: 1, tag: 'FLASHER(ON/OFF)', sheet: 'DITL-BA52', v: fl(1, 0.5), rel: 'flasher ON 1 s / OFF 0.5 s', src: 'DITL-BA52 row 1 M.133F (hd600 pdf p.52)' });
  R({ stn: 3, di: 1, tag: 'M.135F', sheet: 'DITL-BA69', v: fl(0.3, 6), rel: 'flasher ON 300 ms / OFF 6 s', src: 'DITL-BA69 row 13 M.135F (conveyors pdf p.11)' });
  /* 4d. limestone (station 104, limestone_logic.xls; YUA C12 ~ C15) */
  S('M1311.fault', 'MIT-M1311', 0, 'Limestone rotofeeder fault', 'Coal and limestone', 'IO list stn 104 I.0171 MIT-M1311; sheet 230 row 10 "1 = FAULT"');
  [['DITL-LS10', 7], ['DITL-LS110', 10], ['DITL-LS230', 10]].forEach(([sh, r]) =>
    R({ stn: 4, di: 1, tag: 'I.0171', io: 'MIT-M1311', sheet: sh, row: r, v: (U, X) => X.state('M1311.fault'), rel: 'rotofeeder fault contact', src: sh + ' row ' + r + ' I.0171 FROM MIT-M1311' }));
  S('LM1313.trip', 'MIT-LM1313', 0, 'Limestone vent filter trip', 'Coal and limestone', 'IO list stn 104 I.0174; sheet 214 row 17 "1 = TRIP"');
  S('LM1313.remote', 'MIL-LM1313', 1, 'Limestone vent filter not in remote', 'Coal and limestone', 'IO list stn 104 I.0175; sheet 214 row 19 "1 = REMOTE"');
  R({ stn: 4, di: 1, tag: 'MIT-LM1313', adr: 'I.0174', sheet: 'DITL-LS214', v: (U, X) => X.state('LM1313.trip'), rel: 'vent filter trip contact', src: 'DITL-LS214 row 17 I.0174' });
  R({ stn: 4, di: 1, tag: 'MIL-LM1313', adr: 'I.0175', sheet: 'DITL-LS214', v: (U, X) => X.state('LM1313.remote'), rel: 'vent filter REMOTE selector', src: 'DITL-LS214 row 19 I.0175' });
  [
    ['DPS-LM1811', 'I.016F', 10, 'LM1811.purge', 'Limestone vent filter purge fault'],
    ['LSH-LM1811', 'I.0166', 12, 'LM1811.lsh', 'Limestone silo level high'],
    ['LSL-LM1811', 'I.0167', 14, 'LM1811.lsl', 'Limestone silo level low']
  ].forEach(([tag, a, r, id, t]) => {
    S(id, tag, 0, t, 'Coal and limestone', 'IO list stn 104 ' + a + ' ' + tag + '; sheet 240 row ' + r + ' (0 in service, YUA C15)');
    R({ stn: 4, di: 1, tag, sheet: 'DITL-LS240', row: r, v: (U, X) => X.state(id), rel: tag + ' field contact', src: 'DITL-LS240 row ' + r + ' ' + a });
  });
  /* LS240 row 16 PS-PA1811 AIR TANK PRESSURE (I.016A): the sheet prints "1 = P > 4 kg/cm2". The air receiver of the limestone model
     (boiler.js AN_LM, U.lm.sw.tank = 1 below 4) */
  R({ stn: 4, di: 1, tag: 'PS-PA1811', sheet: 'DITL-LS240', row: 16, v: U => (U.lm && U.lm.sw && isFinite(U.lm.sw.tank) ? 1 - U.lm.sw.tank : NaN),
    rel: 'air tank pressure above 4 kg/cm2 (1 - U.lm.sw.tank)', src: 'DITL-LS240 row 16 I.016A "1 = P > 4 Kg/cm2" (YUA C15)' });
  /* 4e. DITL-80Q row 39 AIR PREHEATER SOOTBLOWER TRIP (LOCAL/MCC) = the contact of DITL-80K row 10 I.073D (section 3, the same field state) */
  R({ stn: 2, di: 1, tag: 'I.073D', io: 'MIT-SB-APH01', sheet: 'DITL-80Q', row: 39, v: (U, X) => X.state('SB-APH.trip'), rel: 'air preheater sootblower trip contact', src: 'DITL-80Q row 39 = DITL-80K row 10 I.073D' });
  FIELD.state(lane, st);
  FIELD.add(lane, rw);
}

/* 5. analog rows of the drawings with a value in the plant model (`an: 1`, bound by sheet and drawn row, src/world/plantsw.js):
   - DITL-21A (A / #B / #C / #D) rows 11 / 12 TT-BH1060-x1 / x2 INLET / OUTLET ASH TEMP. (alarms on the sheet: inlet H > 940 C, outlet
     H > 270 C): the screw cooler model of unit.js anBacStep (U.bhx1 / U.bhx2; Rauma E130122B ash in max 920 C, effectiveness of the
     cooler from UA 1.34 kW/K). Check (YUA A4, FHI manual Part 2 Sect 6 p.6): inlet up to 900 C, outlet 200 ~ 250 C while running; at
     150 MW the four coolers stand stopped (16.PNG) and read near the cooling water
   - DITL-80K rows 16 / 17 PT-SB1040 / PT-SB1042 AIR PREHEATER HOT / COLD STEAM PRESSURE (AI0549 / AI0550, 0 ~ 16 kg/cm2; DITL-80K H > 11,
     L < 4 while blowing, YUA A7): the air heater sootblower steam of unit.js AN_SB.aph (U.sbA.p40 / p42, the same value as the AI rows of
     field/alarm.js) */
FIELD.add(lane, [
  ...[['A', ''], ['B', ' #B'], ['C', ' #C'], ['D', ' #D']].flatMap(([x, cp]) => [
    { stn: 3, an: 1, tag: 'TT-BH1060-' + x + '1', sheet: 'DITL-21A' + cp, row: 11, v: U => U['bh' + x + '1'],
      rel: 'ash in of screw cooler ' + x + ' (unit.js anBacStep U.bh' + x + '1)', src: 'DITL-21A' + cp + ' row 11; Rauma E130122B; FHI Part 2 Sect 6 p.6' },
    { stn: 3, an: 1, tag: 'TT-BH1060-' + x + '2', sheet: 'DITL-21A' + cp, row: 12, v: U => U['bh' + x + '2'],
      rel: 'ash out of screw cooler ' + x + ' (unit.js anBacStep U.bh' + x + '2)', src: 'DITL-21A' + cp + ' row 12; Rauma E130122B; FHI Part 2 Sect 6 p.6' }
  ]),
  { stn: 2, an: 1, tag: 'PT-SB1040', sheet: 'DITL-80K', row: 16, v: U => (U.sbA ? U.sbA.p40 : NaN), rel: 'U.sbA.p40 (unit.js AN_SB.aph)', src: 'DITL-80K row 16; IO list stn 2 AI0549' },
  { stn: 2, an: 1, tag: 'PT-SB1042', sheet: 'DITL-80K', row: 17, v: U => (U.sbA ? U.sbA.p42 : NaN), rel: 'U.sbA.p42 (unit.js AN_SB.aph)', src: 'DITL-80K row 17; IO list stn 2 AI0550' }
]);

/* 6. DITL-LS230 rows 6 / 9 INT. REGISTER 2.5 / 0.5 kg/cm2: fixed compare constants of the limestone logic (the Y input of the X / Y compare
   against PT-LM1812: X >= 2.5 = M.1838 CONV. PRESS. HIGH LIMIT, X <= 0.5 = M.1839 CONV. PRESS. LOW LIMIT; sheet 230 rows 4 ~ 9, symbol
   key sheet 250, YUA C14). Plant sheet set points, not a model value */
FIELD.add(lane, [
  { stn: 4, an: 1, tag: 'LS230-SP-HIGH', sheet: 'DITL-LS230', row: 6, v: () => 2.5, rel: 'set point 2.5 kg/cm2 (INT. REGISTER)', src: 'limestone_logic.xls sheet 230 row 6' },
  { stn: 4, an: 1, tag: 'LS230-SP-LOW', sheet: 'DITL-LS230', row: 9, v: () => 0.5, rel: 'set point 0.5 kg/cm2 (INT. REGISTER)', src: 'limestone_logic.xls sheet 230 row 9' }
]);
