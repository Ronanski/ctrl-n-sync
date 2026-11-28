/* 3.2.1 plan c1, c2: the TURBINE TRIP runs through the gates of the Interlock Block Diagram 310SC90-794 rev 2. The gates are the sheets of
   tcs-ibd-data.js (read from the PDF by tools/data/ibd_read.mjs); this file gives them their field values and set points, runs them and
   reads the result: TA-1 net TA1_RESET = 1 the turbine is reset; a fall of it is the trip, and the rows of TA-9 standing at that scan are the
   first out. U.tc.trip = the first-out name, read by unit.js (it writes I.0400 TURBINE TRIP).
   Symbols, sheet 13: S / R reset has priority; DI delay pick up; DT delay drop out; PO one shot; (WO) A AND NOT C; MID median; 2/3.
   Fixed set points come with the netlist, read from the words under each comparator; the variable limits of TA-11 and TA-21 are the tables
   below. A comparator with neither stays 0 and is listed by AN.tcsIbdMissing().
   One value per quantity: the model has one transmitter where the plant has three, so A, B and C read the same value. */
const TCS_MFT_ROW = 12; /* DITL-03A out 13 = MFT (guide.js purge step) */
const TA1_RESET = 3; /* TA-1 the A gate: all trip conditions off and reset */
/* TA-21: HP first stage pressure kg/cm2 g -> TRIP limit of inlet / exhaust differential pressure, kg/cm2 */
const TCS_DP = [
  [0, 26.72],
  [31.9, 26.72],
  [51.5, 39.02],
  [72.2, 52.22],
  [104.2, 72.92],
  [107.4, 74.92],
  [111.1, 77.42],
  [150, 77.42]
];
/* TA-11: HP first stage pressure kg/cm2 g -> main steam temperature VERY LOW trip line, C */
const TCS_MST = [
  [0, 395.3],
  [33.4, 395.3],
  [42.8, 417],
  [55.2, 419.6],
  [61.7, 421.6],
  [72.2, 423.4],
  [88, 425.5],
  [104.2, 427.2],
  [150, 432]
];
/* 3.2.1 d3 (LISA): the ANN column of the same tables (IBD TA-21 and TA-11, set point tables beside the charts, columns ANN and TRIP): the HIGH and LOW alarm lines */
const TCS_DP_ANN = [
  [0, 24.72],
  [31.9, 24.72],
  [51.5, 37.02],
  [72.2, 50.22],
  [104.2, 70.92],
  [107.4, 72.92],
  [111.1, 75.42],
  [150, 75.42]
];
const TCS_MST_ANN = [
  [0, 410.3],
  [33.4, 410.3],
  [42.8, 432],
  [55.2, 434.6],
  [61.7, 436.6],
  [72.2, 438.4],
  [88, 440.5],
  [104.2, 442.2],
  [150, 447]
];
const tcsFst = U => (U.pist && U.pist.length ? anUnitVal(U.pist[0]) : NaN); /* PT-ST1001 */
const tcsCrp = U => (U.rhp && U.rhp.length > 2 ? anUnitVal(U.rhp[2]) : NaN); /* PT-CR1006 */
/* the value of a field signal by its tag on the sheet; NaN = no value in the model */
/* stop valve position 1 open, 0 full close: the master trip of TA-1 dumps the trip oil and the valves close (AN_TBV.rsv, the slower stop valve, turbine.js); reset opens them */
const tcsVp = (U, c) => (c.vp == null ? (c.vp = U.tb && U.tb.st !== 'off' ? 1 : 0) : c.vp);
/* the lift of a stop valve (MSV, RSV) of side s, 0 ~ 1: what its LVDT reads = the trip oil position x the position the valve test leaves */
function tcsStop(U, f, s) {
  const c = U.tc || U.tco;
  return (c ? tcsVp(U, c) : U.tb && U.tb.st !== 'off' ? 1 : 0) * f(U, s);
}
function tcsValves(U, c, ib, dt) {
  tcsVp(U, c);
  if (!ib.r1) return;
  c.vp = ib.v['TA-1'] && ib.v['TA-1'][TA1_RESET] > 0.5 ? Math.min(1, c.vp + dt / 10) : Math.max(0, c.vp - dt / AN_TBV.rsv);
}
/* I.0400 TURBINE TRIP to the DCS is TA-6 out 16 (valve position, or TCS MAJOR TROUBLE); before the first reset of a cold plant it stays 0 so the ATS can start */
function tcsI0400(U, ib) {
  const l = U.vtrip,
    x = ib.r1 && ib.v['TA-6'] && ib.v['TA-6'][16] > 0.5 ? 1 : 0;
  if (ib.ext || !l || l.S.rt.force[l.n] !== undefined || !l.S.ext.includes(l.n)) return;
  if (l.S.rt.ext[l.n] !== x) l.S.rt.ext[l.n] = x;
}
const TCS_IBD_PV = [
  [/PT-STn110/, U => U.cdP],
  [/TE-MSn902/, U => tcsSteam(U).mst],
  [/PT-STn001/, U => tcsFst(U)],
  [/PT-LOn922-A/, U => U.loPa],
  [/PT-LOn922-B/, U => U.loPb],
  [/PT-LOn931-A/, U => U.loCa],
  [/PT-LOn931-B/, U => U.loCb],
  [/PT-LOn006/, U => U.loCtl],
  [/PT-LOn003/, U => U.loBrg],
  [/PT-LOn007/, U => U.loTrip],
  [/TE-STn110/, (U, c) => c.Tx],
  /* TCE145 BACK UP GOVERNOR ADD002 / 015 / 018: SE-STn001-1 / 2 / 3 (1A / 1B / 1C) + 108 rpm during OVER SPEED TEST MODE (BK-UP) */
  [/SE-STn001-[123]\b/, U => (U.tb ? U.tb.rpm : 0) + (U.tc && U.tc.ost && U.tc.ost.bk ? TCS_OST.bias : 0)],
  [/SE-STn001/, U => (U.tb ? U.tb.rpm : 0)],
  [/PT-CRn901|HP TURBINE EXHAUST .*STEAM PRESS[.] [(][ABC]/, U => tcsCrp(U)],
  [/GENERATOR LOAD/, U => ((+U.MW || 0) / 150) * 100] /* LOGIC-SRC: the GEN. LOAD % input of the IBD sheets, rated 150 MW (generator data sheet) */,
  /* the valves (IBD TA-6, TA-31 ~ 38) */
  /* LMYP OTS valve tests (tcs.js tcsVtMsv / tcsVtCv): side A and side B apart */
  [/^MSV\(A\) FULL CLOSE/, (U, c) => (tcsVp(U, c) * tcsVtMsv(U, 'A') <= 0 ? 1 : 0)],
  [/^MSV\(B\) FULL CLOSE/, (U, c) => (tcsVp(U, c) * tcsVtMsv(U, 'B') <= 0 ? 1 : 0)],
  [/^CV\(A\) FULL CLOSE/, U => (tcsVtCv(U, 'A') > 0.001 ? 0 : 1)],
  [/^CV\(B\) FULL CLOSE/, U => (tcsVtCv(U, 'B') > 0.001 ? 0 : 1)],
  [/^MSV\(A\) FULL OPEN/, (U, c) => (tcsVp(U, c) * tcsVtMsv(U, 'A') >= 1 ? 1 : 0)],
  [/^MSV\(B\) FULL OPEN/, (U, c) => (tcsVp(U, c) * tcsVtMsv(U, 'B') >= 1 ? 1 : 0)],
  [/^ZT-STn903-A/, (U, c) => tcsVp(U, c) * tcsVtMsv(U, 'A') * 100],
  [/^ZT-STn903-B/, (U, c) => tcsVp(U, c) * tcsVtMsv(U, 'B') * 100],
  [/^ZT-STn904-A/, U => Math.min(100, tcsVtCv(U, 'A') * 100)],
  [/^ZT-STn904-B/, U => Math.min(100, tcsVtCv(U, 'B') * 100)],
  [/^RSV\(A\) FULL CLOSE/, (U, c) => (tcsVp(U, c) * tcsVtRsv(U, 'A') <= 0 ? 1 : 0)],
  [/^RSV\(B\) FULL CLOSE/, (U, c) => (tcsVp(U, c) * tcsVtRsv(U, 'B') <= 0 ? 1 : 0)],
  [/^ICV\(A\) FULL CLOSE/, U => (U.tb && U.tb.icv * tcsVtIcvS(U, 'A') > 0.001 ? 0 : 1)],
  [/^ICV\(B\) FULL CLOSE/, U => (U.tb && U.tb.icv * tcsVtIcvS(U, 'B') > 0.001 ? 0 : 1)],
  [/^ZT-STn905-A[123]/, (U, c) => tcsVp(U, c) * tcsVtRsv(U, 'A') * 100],
  [/^ZT-STn905-B[123]/, (U, c) => tcsVp(U, c) * tcsVtRsv(U, 'B') * 100],
  [/^ZT-STn905-A[456]/, U => (U.tb ? U.tb.icv * tcsVtIcvS(U, 'A') * 100 : 0)],
  [/^ZT-STn905-B[456]/, U => (U.tb ? U.tb.icv * tcsVtIcvS(U, 'B') * 100 : 0)],
  [/^RSV\([AB]\) FULL CLOSE/, (U, c) => (tcsVp(U, c) <= 0 ? 1 : 0)],
  [/^ICV\([AB]\) FULL CLOSE/, U => (U.tb && U.tb.icv > 0.001 ? 0 : 1)],
  [/^CV\([AB]\) FULL CLOSE/, U => (U.gv > 0.001 ? 0 : 1)],
  [/^52G CLOSED/, U => (U.tb && (U.tb.st === 'sync' || U.tb.st === 'load') ? 1 : 0)],
  [/^52G OPEN COMMAND FROM ATS/, (U, c) => (c.sd52 ? 1 : 0)],
  /* positions in % (ZT): MSV, RSV as the stop valves; CV, ICV as the control valves of the model; A4 ~ A6 / B4 ~ B6 of 905 are the ICV (TA-37, TA-38) */
  [/^ZT-STn903|^ZT-STn905-[AB][123]/, (U, c) => tcsVp(U, c) * 100],
  [/^ZT-STn904/, U => Math.min(100, (+U.gv || 0) * 100)],
  [/^ZT-STn905-[AB][456]/, U => (U.tb ? U.tb.icv * 100 : 0)],
  [/^PS-LOn004/, U => U.loBrg],
  [/^PT-LOn923/, U => U.loEop],
  [/^ICV TO CV TRANSFER COMPLETED?$/, U => (U.tb && U.tb.xfer ? 1 : 0)],
  /* plan c4 (TD-10 HOUSE LOAD OPERATION ALARM): the line breaker 52L1 of elec.js */
  [/^52L OPEN/, U => (U.el && U.el.l52 === false ? 1 : 0)],
  [/^52G OPEN$/, U => (U.tb && (U.tb.st === 'sync' || U.tb.st === 'load') ? 0 : 1)],
  [/^TURBINE TRIP$/, (U, c) => (c.trip ? 1 : 0)],
  /* 3.2.3-beta.240: TA-9 row 17, the generator lockout relay 86G-A (gen-panel.js tcsLo86: the OR of SH-G-5A) */
  [/^GEN\.\/UNIT TRANS\. PROTECTION A/, U => (U.lo86 && U.lo86.a ? 1 : 0)],
  /* TA-9 row 19, the generator lockout relay 86G-B (gen-panel.js tcsLo86) */
  [/^GEN\.\/UNIT TRANS\. PROTECTION B/, U => (U.lo86 && U.lo86.b ? 1 : 0)],
  /* 3.2.3 c2 (SAKURA): the parentheses were not escaped, so this matched no input; MSV(B) FULL OPEN of TA-41 and MSV(A) / (B) FULL OPEN
     of TA-42 (page 51 / 52) had no source (their off-page links to TA-31 / TA-32 are not read) */
  [/^MSV\([AB]\) FULL OPEN/, (U, c) => (tcsVp(U, c) >= 1 ? 1 : 0)],
  /* TC-35 (LP EXHAUST HOOD WATER SPRAY VALVE, page 77) GEN. LOAD <15%: 15 % of the 150 MW rating */
  [/^GEN\. LOAD <15%/, U => ((+U.MW || 0) < 22.5 ? 1 : 0)],
  /* 3.2.1 c2 (LISA, 310SC90-773 rev 2 DIGITAL OUTPUT 31 ~ 35, DCS -> TCS): the heater / deaerator levels VERY HIGH close the extraction
     non-return valves (TC-36 / 41 / 42 / 44 / 45). The DCS sends them from DITL-115 TURBINE SYSTEM INTERFACE SIGNALS (location TCS), outputs
     NO.1 LPH / NO.1 HPH / DEAERATOR STORAGE TANK / NO.3 LPH / NO.2 LPH LEVEL H.H. (M.0183 / 0193 / 0161 / 0233 / 0213 of ABC-037 / 035 / 031 /
     039 / 038, the DCS logic with its own voting). The model has one transmitter, so A, B (C) read the same value */
  [/^NO\.1 LP HEATER LEVEL VERY HIGH/, () => tcsDitlOut('DITL-115', /^NO\.1 LPH LEVEL H\.H/)],
  [/^NO\.1 HP HEATER LEVEL VERY HIGH/, () => tcsDitlOut('DITL-115', /^NO\.1 HPH LEVEL H\.H/)],
  [/^NO\.2 LP HEATER LEVEL VERY HIGH/, () => tcsDitlOut('DITL-115', /^NO\.2 LPH LEVEL H\.H/)],
  [/^NO\.3 LP HEATER LEVEL VERY HIGH/, () => tcsDitlOut('DITL-115', /^NO\.3 LPH LEVEL H\.H/)],
  [/^DEAERATOR STORAGE TANK LEVEL VERY HIGH/, () => tcsDitlOut('DITL-115', /^DEAERATOR STORAGE TANK LEVEL H\.H/)],
  /* c2 gap 3 (310SC90-773 rev 2 DO 42 DOZSO-AV1391, DCS -> TCS): CONDENSER VACUUM BREAK COMPLETE = the DITL-115 output of the same name
     (I.0215 ZSO-AV1391, the vacuum breaker position of DITL-56); IBD TE-6 #32 and TE-7 #5. Read only */
  [/CONDENSER VACUUM BREAK COMPLETE$/, () => tcsDitlOut('DITL-115', /^CONDENSER VACUUM BREAK COMPLETE/)]
];
/* c2 gap 2 (310SC90-773 rev 2 DO 36 / 38 / 39 / 43 / 44 / 45, DCS -> TCS): the answer back of the drain valves, sent by DITL-115. By net, as
   the reader did not read every name (TE-6 net 19 is the FULL CLOSE answer back, circle 61 AS01 on the IBD page 94; nets 7 and 26 the FULL
   OPEN answer back, circle 62). MV-ASn393 (IBD TE-1) is the drain valve that the DCS drives as MV-AS1394 (DITL-75, the TCS commands I.0407 /
   I.0408 of the I/O list), MV-ASn397 (TE-6) is MV-AS1397 (DITL-116) */
const TCS_IBD_NET = {
  'TE-1': {
    40: () => tcsDitlOut('DITL-115', /^TURBINE WARMING VALVE INLET DRAIN MOTOR VALVE OP/),
    44: () => tcsDitlOut('DITL-115', /^TURBINE WARMING VALVE INLET DRAIN MOTOR VALVE CL/),
    /* c2 batch 3: TE-ST1001-1 HP TURBINE FIRST STAGE INNER WALL METAL TEMP. (page 90) = c.Thp of the ATS model (tcs.js) */
    12: U => (U.tc ? U.tc.Thp : NaN)
  },
  'TE-3': { 1: () => tcsDitlOut('DITL-115', /^TURBINE WARMING VALVE INLET DRAIN MOTOR VALVE AU/) },
  'TE-6': {
    7: () => tcsDitlOut('DITL-115', /^TURBINE GLAND STEAM LINE DRAIN VALVE OPEN/),
    26: () => tcsDitlOut('DITL-115', /^TURBINE GLAND STEAM LINE DRAIN VALVE OPEN/),
    19: () => tcsDitlOut('DITL-115', /^TURBINE GLAND STEAM LINE DRAIN VALVE CLOSE/),
    /* c2 batch 3 (page 94): TE-ST1004-1 / 2 REHEAT BOWL INNER WALL = c.Trh, TE-ST1001-1 HP TURBINE FIRST STAGE = c.Thp (tcs.js) */
    27: U => (U.tc ? U.tc.Trh : NaN),
    28: U => (U.tc ? U.tc.Thp : NaN)
  },
  'TE-8': { 0: () => tcsDitlOut('DITL-115', /^TURBINE GLAND STEAM LINE DRAIN VALVE AUTO/) },
  /* 3.2.3 c2: TA-42 net 27 (page 52) is GENERATOR LOAD (the name is garbled in the reader), off-page link 10 from TA-41, where it is the
     GENERATOR LOAD >= 75 MW comparator, net 23 (the reader lists TA-41 link 10 to TA-31 ~ 34 only) */
  /* TA-10 (page 30) net 11: the reader took the label "LOW ALARM 0.14 kg/cm2 abs" as the input of that comparator; on the drawing it reads
     the median of PT-STn110-1 / 2 / 3 (the MID, net 10). The model has one condenser pressure (U.cdP), the same value as the three */
  'TA-10': { 11: U => U.cdP },
  /* TA-11 (page 31) net 3: the MAIN STEAM TEMP. LOW comparator (ON <= 290 C, OFF >= 295 C), before 20 % load, to ANN 2 only (not the trip:
     the VERY LOW trip is the 2/3 of the variable comparators, TCS_IBD_SP). The reader took its label as the input; on the drawing it reads the
     MID of TE-MSn902-1 / 2 / 3, one value in the model */
  'TA-11': { 3: U => tcsSteam(U).mst },
  /* TC-20 (page 74) net 43 AUX. STEAM HEADER PRESS. (LOWER), compared ON >= 7 kg/cm2 G on the sheet = c.Pa of the ATS model (PIAS1004, tcs.js) */
  'TC-20': { 43: U => (U.tc ? U.tc.Pa : NaN) },
  /* TC-18 BLOWDOWN VALVE (page 72) net 0 INTERCEPT VALVE OPEN DEMAND >0.1%: the ICV position demand SV-STn905-A2 / B2 (TCS I/O list
     XSMM_IO_List_R1, IO LIST R.1 rows 140 / 316, IBD TA-37 / TA-38). The model has one ICV value, U.tb.icv, that is its demand and its
     position (ZT-STn905 above). */
  'TC-18': { 0: U => (U.tb && U.tb.icv > 0.001 ? 1 : 0) },
  /* 3.2.3-beta.264 (SAKURA): TC-17 VENTILATOR VALVE (IBD page 71) net 6 TURBINE FLOW DEMAND (EL) (CV FULL CLOSE), contact ON <= 20 % on the
     sheet = the TCS flow demand of the model (U.tb.fd, 1 = 100 %, anTbFlow in unit.js) <= 20 %. Its OR with HEAT SOAK EXECUTE, DT 5 s, gives the
     VENTILATOR VALVE OPEN COMMAND that also closes the cold reheat NRV (TC-19 page 73). Before the flow demand runs (tb.fd not set) the label
     itself says CV FULL CLOSE: the CV position of the model (U.gv) */
  /* Phase 6 TCS (lane 1, 2026-11-26): TC-17 net 5 HP TURBINE HEAT SOAK EXECUTE = TCE163 output A1 HEAT SOAK SET (drawing page 114, connector
     A1 to "-": it leaves the TCE / TCA set). A1 is the SELECT pin of the HEAT SOAK SELECT macro (LME133 inside of the HIACS backup, TCE163 001),
     the same signal as HEAT SOAK MODE (C, to TCE207) and the CRT lamp TCE163_1. INFERRED: the backup of the PI/O card that carries A1 to the
     hard-wired logic is not decoded (tcs-tcp-pio.json has card TCP1900 only); the IBD names no other heat soak input. 0 when the program does
     not run */
  'TC-17': {
    5: U => (tcsTceOut(U, 'TCE163', 'oA1') > 0.5 ? 1 : 0),
    6: U => (U.tb && isFinite(U.tb.fd) ? (U.tb.fd <= 0.2 ? 1 : 0) : U.gv > 0.001 ? 0 : 1)
  },
  'TA-42': { 27: (U, c) => (c.ib && c.ib.v['TA-41'] ? c.ib.v['TA-41'][23] || 0 : 0) },
  /* c2 batch 3 (3.2.3): the inputs of the IBD that the model already has a value for. A contact of the TSI with its set point written on the
     sheet is 1 at that set point. TA-18 (IBD page 37): SHAFT VIBRATION HIGH ON >= 0.125 mm; TA-17 (page 36): VERY HIGH ON >= 0.200 mm, X = -1,
     Y = -2; VE-ST1001 No.1 / VE-ST1002 No.2 turbine, VE-GE1001 No.3 / VE-GE1002 No.4 generator = loVx1..4 / loVy1..4 of tcsOil (tags of
     the TSI on the IBD page 36 / 37). TA-17 nets 21 / 22 / 23: the second input of the A gate of No.2 / 3 / 4, drawn with no source: the note of page 36
     says it is "similar to No.1", that is ANY OTHER SHAFT VIBRATION HIGH (the OR of the HIGH of the other shafts) */
  'TA-18': Object.fromEntries([0, 1, 2, 3, 4, 5, 6, 7].map(k => [k, U => tcsVib(U, k) >= 0.125])),
  'TA-17': {
    ...Object.fromEntries(
      [
        [0, 0],
        [1, 1],
        [3, 2],
        [4, 3],
        [6, 4],
        [7, 5],
        [9, 6],
        [10, 7]
      ].map(([n, k]) => [n, U => tcsVib(U, k) >= 0.2])
    ),
    21: U => tcsVibHighBut(U, 1),
    22: U => tcsVibHighBut(U, 2),
    23: U => tcsVibHighBut(U, 3)
  },
  /* TD-2 (page 85): bearing metal temperatures, HIGH ON >= 115 C journal / ON >= 85 C thrust. TE-ST1009 / 1010 No.1 / 2 journal, TE-GE1001 /
     1002 No.3 / 4 = loM1..4; TE-ST1011-1 / -2 thrust front = loThF, TE-ST1012-1 / -2 thrust rear = loThR (tcsOil, tags of the IBD TD-2) */
  'TD-2': {
    0: U => U.loM1,
    24: U => U.loM2,
    7: U => U.loM3,
    9: U => U.loM4,
    11: U => U.loThF,
    18: U => U.loThF,
    20: U => U.loThR,
    22: U => U.loThR
  },
  /* TA-20 (page 39): TE-ST1003-1 / 2 / 3 HP TURBINE EXHAUST STEAM TEMP. The model has one value there: the cold reheat temperature TT-TS1011
     (unit.js anUnitStepX X.T.cr, the HP exhaust mixed with the HP bypass outlet). The windage heating of the HP blades at low flow is not
     modelled */
  'TA-20': { 4: U => tcsHpx(U), 5: U => tcsHpx(U), 6: U => tcsHpx(U) },
  /* TD-1 (page 84): TE-LO1002-1 / -2 LUBE OIL COOLER OUTLET OIL TEMP., MAX = the cooler outlet of tcsOil (U.loTout, TICLO1002) */
  'TD-1': { 8: U => U.loTout },
  /* TD-4 (page 87): ZE-ST1001 TURBINE SHELL EXPANSION (HP side) = c.sexp of the ATS model (NORMAL ON >= 3 mm, ATS criteria 2.1) */
  'TD-4': { 5: U => (U.tc ? U.tc.sexp : NaN) },
  /* TD-3 (page 86): PT-GS1001-2 GLAND STEAM SEAL HEADER PRESS. (A) = the gland header of unit.js (U.gsP), shown on the sheet */
  'TD-3': { 0: U => U.gsP },
  /* GD-5 (page 99): TE-GE1006-1 ~ 6 GEN. STATOR COIL TEMP. (HIGH ON >= 123 C), TE-GE1004-1 ~ 4 GEN. COOLING GAS AIR (ON >= 50 C), TE-GE1005
     AC EXCITER OUTLET AIR (ON >= 95 C) = the generator temperatures of unit.js anGenTemp (U.genT ts / ta / ex, tags of the IBD GD-5) */
  'GD-5': {
    ...Object.fromEntries([0, 2, 4, 6, 8, 10].map((n, i) => [n, U => (U.genT ? U.genT.ts[i] : NaN)])),
    ...Object.fromEntries([12, 14, 16, 18].map((n, i) => [n, U => (U.genT ? U.genT.ta[i] : NaN)])),
    20: U => (U.genT ? U.genT.ex : NaN)
  }
};
/* the shaft vibration of contact k of TA-18 (0 / 1 No.1 X / Y, 2 / 3 No.2, 4 / 5 No.3, 6 / 7 No.4), mm */
const tcsVib = (U, k) => +U['loV' + (k % 2 ? 'y' : 'x') + ((k >> 1) + 1)] || 0;
/* ANY OTHER SHAFT VIBRATION HIGH: a HIGH (TA-18, >= 0.125 mm) of a shaft other than shaft s (0 = No.1 ... 3 = No.4) */
const tcsVibHighBut = (U, s) => [0, 1, 2, 3, 4, 5, 6, 7].some(k => k >> 1 !== s && tcsVib(U, k) >= 0.125);
const tcsHpx = U => (U.xt && U.xt.T && isFinite(U.xt.T.cr) ? U.xt.T.cr : NaN);
/* c2: the value of a DITL input row (by the tag in its TAG column), of a DITL output (by its RS text) and of an ABC net (by its name), as the
   DCS has them now; 0 / NaN when absent */
const TCS_DCS = { row: {}, abc: {}, out: {} };
/* the value now of an output of a TCE / TCA sheet (TCE_RUN.outs key), as the program of engine/tcs-sheets.js runs it; undefined = the program
   does not run (no plant, no TCS state yet, same rule as tcsHw in tcs-dcs.js) or the sheet has no such output */
function tcsTceOut(U, sheet, key) {
  const c = U && (U.tc || U.tco),
    p = c && c.sm && AN_TCE.n === c.sm.n && AN_TCE.n >= 0 ? tcsShProg() : null;
  if (!p) return undefined;
  if (!p.tceOut) p.tceOut = new Map(window.TCE_RUN.outs(p).map(o => [o.sheet + ':' + o.key, o.slot]));
  const k = p.tceOut.get(sheet + ':' + key);
  return k === undefined || Number.isNaN(p.v[k]) ? undefined : p.v[k];
}
function tcsDitlOut(sh, re) {
  try {
    if (typeof S === 'undefined' || !S.sheets) return 0;
    const k = sh + '|' + re.source;
    let r = TCS_DCS.out[k];
    if (!r || S.sheets[r.i] !== r.s) {
      const i = S.sheets.findIndex(x => new RegExp('\\)' + sh + '$').test(x.name)),
        s = S.sheets[i];
      if (s && !s.nl && typeof netlist === 'function') s.nl = netlist(s);
      const o = s && s.nl ? s.nl.outs.find(q => re.test((s.cells[q.row + ':RS'] || []).map(t => t.t).join(' ').trim())) : null;
      r = TCS_DCS.out[k] = { i, s, n: o ? o.n : -1 };
    }
    return r.s && r.n >= 0 && r.s.nl && r.s.nl._v && r.s.nl._v[r.n] ? 1 : 0;
  } catch (e) {
    return 0;
  }
}
function tcsDitlIn(sh, tag) {
  try {
    if (typeof S === 'undefined' || !S.sheets) return 0;
    const k = sh + '|' + tag;
    let r = TCS_DCS.row[k];
    if (!r || S.sheets[r.i] !== r.s) {
      const i = S.sheets.findIndex(x => new RegExp('\\)' + sh + '$').test(x.name)),
        s = S.sheets[i];
      const row = s ? s.rows.findIndex((_, j) => (s.cells[j + ':T'] || []).map(t => t.t).join(' ').trim() === tag) : -1;
      r = TCS_DCS.row[k] = { i, s, row };
    }
    const s = r.s;
    if (!s || r.row < 0) return 0;
    if (!s.nl && typeof netlist === 'function') s.nl = netlist(s);
    const q = s.nl && (s.nl.src || []).find(x => x.row === r.row);
    return q && s.nl._v && s.nl._v[q.n] ? 1 : 0;
  } catch (e) {
    return 0;
  }
}
function tcsAbcV(sh, nm) {
  try {
    if (typeof AN === 'undefined' || !AN.sheets) return NaN;
    const k = sh + '|' + nm;
    let r = TCS_DCS.abc[k];
    if (!r || !r.S || !r.S.rt) {
      const x = AN.sheets.find(p => p.name === sh),
        T = x && x.S;
      const n = T && T.lab ? T.lab.findIndex(z => z && String(z.t).replace(/^S\d\s*/, '').trim() === nm) : -1;
      r = TCS_DCS.abc[k] = { S: T, n };
    }
    return r.S && r.n >= 0 ? +r.S.rt.v[r.n] : NaN;
  } catch (e) {
    return NaN;
  }
}
/* comparators with a variable limit; every fixed set point is read from the words under the block on the sheet (tools/data/ibd_build.mjs) */
const TCS_MST_LOW = U => tcsSteam(U).mst <= tcsLin(TCS_MST, tcsFst(U));
const TCS_DP_HIGH = U => tcsFst(U) - tcsCrp(U) >= tcsLin(TCS_DP, tcsFst(U));
const TCS_IBD_SP = {
  'TA-11@549,560': TCS_MST_LOW,
  'TA-11@549,362': TCS_MST_LOW,
  'TA-11@549,221': TCS_MST_LOW,
  'TA-21@586,581': TCS_DP_HIGH,
  'TA-21@586,440': TCS_DP_HIGH,
  'TA-21@586,295': TCS_DP_HIGH,
  /* d3: the alarm comparators (HIGH / LOW (*2)), the ANN column */
  'TA-11@687,664': U => tcsSteam(U).mst <= tcsLin(TCS_MST_ANN, tcsFst(U)),
  'TA-21@586,732': U => tcsFst(U) - tcsCrp(U) >= tcsLin(TCS_DP_ANN, tcsFst(U)),
  /* TE-6: ON <= 150 C, OFF >= 155 C (words on the sheet with a gap the reader did not join) */
  'TE-6@408,498': [0, 150, 155, 'C'],
  /* the partial close test of the control valves (TA-33, TA-34: ON <= PRESENT POSITION -10 %) and the eccentricity (TD-4: ON >= ACTUAL VALUE x 1.1) are not
     modelled: no test runs and the eccentricity has no value, so these comparators stay 0 */
  'TA-33@465,381': () => false,
  'TA-34@465,381': () => false,
  'TD-4@408,686': () => false
};
/* the oil pumps are driven by their TCE sheets (tcs-sheets.js); TB-1, TB-2, TB-21, TB-22 show the state: auto, run: nets of the AUTO and RUN
   memories, fb: the running contact */
const TCS_IBD_PUMP = {
  'TB-1': { k: 'mop', i: 0, auto: 1, run: 11, fb: 21 },
  'TB-2': { k: 'mop', i: 1, auto: 1, run: 11, fb: 21 },
  'TB-21': { k: 'cop', i: 0, auto: 0, run: 11, fb: 23 },
  'TB-22': { k: 'cop', i: 1, auto: 0, run: 11, fb: 23 }
};
/* TB-22: the A gate after the 15 s timer has no word the reader finds; the sheet is the same as TB-21 */
/* TD-2 (page 85): each A gate to the ATS (criteria 1.30 / 1.31) takes the four HIGH comparators through a NOT circle; the reader found one NOT
   per gate (nets 1 -> 2, 12 -> 13) and took the other three pins for inputs with stray words (nets 3, 4, 5 and 14, 15, 16). The missing NOT
   circles are added here, where the reader saw those words, and the stray inputs are taken off (TCS_IBD_DROP) */
const TCS_IBD_PATCH = {
  'TB-22': [['A', [14, 18], 15, 0, 0, 0]],
  'TD-2': [
    ['NOT', [25], 3, 0, 555, 216, 0, 0],
    ['NOT', [8], 4, 0, 555, 249, 0, 0],
    ['NOT', [10], 5, 0, 555, 227, 0, 0],
    ['NOT', [19], 14, 0, 555, 486, 0, 0],
    ['NOT', [21], 15, 0, 555, 520, 0, 0],
    ['NOT', [23], 16, 0, 555, 498, 0, 0]
  ]
};
/* one logic (user 2026-11-20): where a TCA sheet draws the same signal as an IBD sheet, the TCA logic of the ATS model (tcs.js) gives it and the IBD
   net only shows it: these outputs are set from the model after the sheet's gates, by sheet and net */
const TCS_IBD_OUT = {
  'TD-1': { 14: c => c.brgTok } /* 1.16 bearing oil temp. OK (TCA539) */,
  'TD-3': { 5: c => c.gsOk, 6: c => c.tankOk } /* 1.10 gland seal header press. not low, 1.17 main oil tank level OK (TCA542) */,
  'TD-4': { 6: c => c.sexOk } /* 2.1 shell expansion OK (TCA535) */
};
const TCS_IBD_DROP = { 'TD-2': [3, 4, 5, 14, 15, 16] };
/* 1.0.0-beta.362 D18 (JENNIE, user 2026-11-24 "Go ayos"): the turning gear, the vapour extractor, the gland steam exhauster, the steam seal
   feed inlet valve and the LP exhaust hood spray are run by their own IBD sheets (TCS soft logic 331DM09784, typed from the drawing), as the
   oil pumps TB-1 / 2 / 21 / 22. Before: one screen command each set a flag (tcs.js 'tg', 'vex', 'gland', 'hood') with no sheet behind it.
   TCS_IBD_PBN: the push buttons of the TCS HMI by sheet and net (a 1.5 s pulse, AN.turbine('ibd', { id, pb })):
     TB-9  TURNING GEAR MOTOR (page 58; TCE350 ~ 352): START 20, AUTO 16, MANUAL 18, STOP 22, (LOCAL) JOG 9
     TB-12 MAIN OIL TANK VAPOUR EXTRACTOR (driven by TCA655, tcs-sheets.js): START 7, STOP 11
     TC-28 GLAND STEAM EXHAUSTER (driven by TCA680, tcs-sheets.js): START 7, AUTO 3, MANUAL 5, STOP 9
     TC-31 STEAM SEAL FEED INLET VALVE (TCA650): OPEN 4, AUTO 0, MANUAL 2, CLOSE 6
     TC-35 LP EXHAUST HOOD WATER SPRAY VALVE FV-CD1904: OPEN 10, AUTO 0, MANUAL 9 (the reader found no CLOSE push button: finding D18-2)
   TCS_IBD_DEV: what each sheet reads from the plant before its gates (pre) and what its outputs do to the plant after them (post). The flip-flops
   keep their own memory in ib.v; a new memory (Cold / 150 MW / an old save) starts from the state flags (init). The output names that the
   reader left undriven (TB-9 55, TB-12 13, TC-28 17, TC-31 14 / 16, TC-35 17 / 19) are the outputs of their gates, so the off-page links work.
   The group sheets TE-6 / TE-7 (gland seal start / stop group) are not bound: their netlists have reader errors (finding D18-1) */
const TCS_IBD_PBN = {
  'TB-9': { START: 20, AUTO: 16, MANUAL: 18, STOP: 22, JOG: 9 },
  'TB-12': { START: 7, STOP: 11 },
  'TC-28': { START: 7, AUTO: 3, MANUAL: 5, STOP: 9 },
  'TC-31': { OPEN: 4, AUTO: 0, MANUAL: 2, CLOSE: 6 },
  'TC-35': { OPEN: 10, AUTO: 0, MANUAL: 9 }
};
const tcsRpm = U => (U.tb && U.tb.rpm) || 0;
const TCS_IBD_DEV = {
  'TB-9': {
    init: (v, c) => ((v[11] = c.tg ? 1 : 0), (v[17] = c.tgAu ? 1 : 0)),
    pre: (v, c, U) => {
      v[43] = c.tg ? 1 : 0; /* TURNING GEAR MOTOR RUNNING */
      v[30] = c.tg && tcsRpm(U) <= 4 ? 1 : 0; /* TURNING GEAR ENGAGED (TB-10 solenoid; disengages above 4 rpm = the gear speed
      3 rpm of the TG maintenance manual p.35 + 1, DERIVED: tcs.js TCS_OIL) */
      v[36] = tcsRpm(U) < 1 ? 1 : 0; /* TURBINE ZERO SPEED */
      v[53] = 0; /* ZS-LO1003 HAND TURNING INTERLOCK: the hand turning bar is not modelled (stowed) */
    },
    post: (v, c) => {
      v[55] = v[12];
      c.tg = v[12] > 0.5;
      c.tgAu = v[17] > 0.5;
    }
  },
  'TB-12': {
    /* shown only: TCA655 drives it (tcs-sheets.js) */
    init: () => {},
    pre: (v, c) => {
      v[8] = c.vex ? 1 : 0;
      v[4] = c.vex ? 0 : 1; /* VAPOUR EXTRACTOR STOPPED */
      v[10] = c.empOff ? 1 : 0; /* MOTOR ELECTRICAL TROUBLE: MCC-EMP11 dead (unit black-out, tcs.js) */
    },
    post: (v, c) => {
      v[8] = v[13] = c.vex ? 1 : 0;
    }
  },
  'TC-28': {
    /* shown only: TCA680 drives it (tcs-sheets.js) */
    init: () => {},
    pre: (v, c) => {
      v[1] = c.gse ? 1 : 0;
      v[4] = c.gseAu ? 1 : 0;
    },
    post: (v, c) => {
      v[1] = v[17] = c.gse ? 1 : 0;
      v[4] = c.gseAu ? 1 : 0;
    }
  },
  'TC-31': {
    init: (v, c) => (v[1] = c.ssfvAu ? 1 : 0),
    post: (v, c) => {
      v[14] = v[13];
      v[16] = v[10];
      /* the valve: OPEN / CLOSE command of the sheet (a seal-in MOV); it puts the gland steam controller PV-GS1031 in service (unit.js anAuxStep) */
      if (v[13] > 0.5) c.ssfv = true;
      else if (v[10] > 0.5) c.ssfv = false;
      c.ssfvAu = v[1] > 0.5;
      c.gsOn = !!c.ssfv;
    }
  },
  'TC-35': {
    init: (v, c) => ((v[1] = c.hspAu ? 1 : 0), (v[15] = c.hso ? 1 : 0)),
    post: (v, c) => {
      v[17] = v[15];
      v[19] = v[15] > 0.5 ? 0 : 1;
      c.hso = v[15] > 0.5; /* FV-CD1904 open */
      c.hspAu = v[1] > 0.5;
    }
  }
};
/* the state flags of a model made before these sheets (an old save, the 150 MW oil state) */
function tcsDevInit(c) {
  if (c.ssfv == null) c.ssfv = c.gsOn != null ? !!c.gsOn : !!c.gland || !!c.fromLoad;
  if (c.gse == null) c.gse = !!c.ssfv;
  if (c.hspAu == null) c.hspAu = !!c.hsp || !!c.fromLoad;
  if (c.hso == null) c.hso = false;
}
const TCS_IBD = {
  by: {},
  bind: null
};
/* the MFT of the one world (DITL-03A), read from the engine's last scan; false with no world */
function tcsMft() {
  try {
    const W = window.WORLD;
    if (!W || !W.on || typeof S === 'undefined') return false;
    /* by index: a Reset makes the sheets again */
    if (!(S.sheets[TCS.d3i] && /DITL-03A$/.test(S.sheets[TCS.d3i].name)))
      TCS.d3i = S.sheets.findIndex(x => /DITL-03A$/.test(x.name));
    const s = S.sheets[TCS.d3i];
    const o = s && s.nl && s.nl.outs.find(x => x.row === TCS_MFT_ROW);
    return !!(o && s.nl._v && s.nl._v[o.n]);
  } catch (e) {
    return false;
  }
}
/* once: the sheets by name, the source of each off-page link, the field value of each named input */
function tcsIbdBind() {
  if (TCS_IBD.bind) return TCS_IBD.bind;
  const L = [];
  for (const s of TCS_IBD_SHEETS) TCS_IBD.by[s.id] = s;
  for (const id in TCS_IBD_PATCH) if (TCS_IBD.by[id]) TCS_IBD.by[id].g.push(...TCS_IBD_PATCH[id]);
  for (const id in TCS_IBD_DROP) if (TCS_IBD.by[id]) TCS_IBD.by[id].i = TCS_IBD.by[id].i.filter(i => !TCS_IBD_DROP[id].includes(i[0]));
  for (const s of TCS_IBD_SHEETS) {
    const r = { s, link: [], pv: [], mft: [] },
      driven = new Set(s.g.map(g => g[2]));
    for (const [net, num, to, dep] of s.x) {
      if (!dep) continue;
      const b = TCS_IBD.by[to.split('/')[0]],
        h = b && b.x.find(x => !x[3] && x[1] === num && x[2].includes(s.id));
      if (h) r.link.push([net, b.id, h[0]]);
    }
    for (const [net, name] of s.i) {
      if (/BOILER MFT/.test(name)) r.mft.push(net);
      const p = TCS_IBD_PV.find(q => q[0].test(name));
      if (p && !driven.has(net)) r.pv.push([net, p[1]]);
    }
    /* c2: the inputs given by net (TCS_IBD_NET) */
    const nf = TCS_IBD_NET[s.id];
    if (nf) for (const k in nf) if (!driven.has(+k) && !r.pv.some(q => q[0] === +k)) r.pv.push([+k, nf[k]]);
    L.push(r);
  }
  return (TCS_IBD.bind = L);
}
const tcsIb = c =>
  c.ib ||
  (c.ib = {
    v: {},
    t: {},
    cmp: {},
    fx: {},
    pb: {},
    pbn: {},
    r1: false,
    t0: 0,
    first: '',
    at: 0,
    ext: false,
    mft0: false,
    rst0: false
  });
/* a time written on a timer of the sheet, seconds */
const tcsIbdT = x => {
  const m = /^([0-9.]+) *(s|sec|min)/i.exec(String(x || ''));
  return m ? +m[1] * (m[2].toLowerCase() === 'min' ? 60 : 1) : 0;
};
function tcsIbdStep(U, c, dt) {
  const ib = tcsIb(c),
    B = tcsIbdBind();
  tcsValves(U, c, ib, dt);
  for (const r of B) {
    const s = r.s,
      id = s.id,
      dv = TCS_IBD_DEV[id],
      v = ib.v[id] || (ib.v[id] = new Array(s.n).fill(0));
    /* a memory not bound yet (new, or a save made before beta.362): from the state flags */
    if (dv && !(ib.dv && ib.dv[id])) {
      tcsDevInit(c);
      dv.init(v, c);
      (ib.dv = ib.dv || {})[id] = 1;
    }
    for (const [net, sh, n] of r.link) v[net] = (ib.v[sh] && ib.v[sh][n]) || 0;
    for (const [net, f] of r.pv) v[net] = +f(U, c);
    if (r.mft.length) for (const net of r.mft) v[net] = ib.mft0 && tcsMft() ? 1 : 0;
    if (id === 'TA-1') {
      /* the push buttons of TA-1 and the ATS AUTO RESET COMMAND (the ATS program sets c.rst, tcs.js) */
      /* 3.2.3 (Mina S148-6 / S149-5 / S154-4: no turbine trip after an MFT, the generator stayed on load): the command was sent once, on
         the rise of c.rst. In the cold start-up of b142 a trip input of TA-9 stood at that moment, the A gate kept TA1_RESET at 0 and the
         command was lost; the ATS rolled the turbine all the same (tcs.js step 1), so TA1_RESET stayed 0 up to 150 MW and a trip had no
         fall of it to take (save b142: rst true, TA1_RESET 0, r1 false). The ATS holds its reset command while the turbine is in service
         and the trip block is not reset (not after a trip, not against the trip / shut-down push buttons) */
      if ((c.rst && !ib.rst0) || (c.rst && !c.trip && !(v[TA1_RESET] > 0.5) && !(ib.pb.auto > 0) && !(ib.pb.trip > 0) && !(ib.pb.sd > 0)))
        ib.pb.auto = 2; /* held 2 s: a (WO) of the trip sheets needs the command through its own scan */
      for (const [net, name] of s.i) {
        if (/RESET ON|TURBINE RESET/.test(name)) v[net] = ib.pb.rst > 0 ? 1 : 0;
        else if (/AUTO RESET/.test(name)) v[net] = ib.pb.auto > 0 ? 1 : 0;
        else if (/PB|CONTROL ROOM|TCS HMI/.test(name)) v[net] = ib.pb.trip > 0 ? 1 : 0;
      }
    }
    const pu = TCS_IBD_PUMP[id];
    if (pu && c[pu.k]) {
      v[pu.auto] = c[pu.k + 'Au'][pu.i] ? 1 : 0;
      v[pu.run] = v[pu.fb] = c[pu.k][pu.i] ? 1 : 0;
    }
    if (dv && dv.pre) dv.pre(v, c, U);
    /* the push buttons of the TCS HMI (TCS_IBD_PBN), held 1.5 s */
    for (const k in ib.pbn) if (ib.pbn[k] > 0 && k.startsWith(id + ':')) v[+k.split(':')[1]] = 1;
    for (const k in ib.fx) if (k.startsWith(id + ':')) v[+k.split(':')[1]] = ib.fx[k];
    if (id === 'TA-9' && ib.pb.sd > 0) {
      const r = s.i.find(i => /TURBINE SHUTDOWN COMMAND/.test(i[1]));
      if (r) v[r[0]] = 1;
    }
    const so = U.tc && TCS_IBD_OUT[id];
    /* two passes: a chain of gates settles in one step */
    for (let pass = 0; pass < 2; pass++)
      s.g.forEach((g, i) => {
        const [t, ins, out, x] = g;
        if (out < 0) return;
        const a = ins.map(n => v[n] || 0);
        let o = 0;
        if (t === 'A') o = a.length && a.every(q => q > 0.5) ? 1 : 0;
        else if (t === 'OR') o = a.some(q => q > 0.5) ? 1 : 0;
        else if (t === 'NOT') o = a[0] > 0.5 ? 0 : 1;
        else if (t === '2/3') o = a.filter(q => q > 0.5).length >= 2 ? 1 : 0;
        else if (t === 'WO') o = a[0] > 0.5 && !(v[x[0]] > 0.5) ? 1 : 0;
        else if (t === 'FF') o = x.some(n => v[n] > 0.5) ? 0 : ins.some(n => v[n] > 0.5) ? 1 : v[out];
        else if (t === 'MID') {
          const q = ins
            .map(n => v[n])
            .filter(isFinite)
            .sort((p, w) => p - w);
          o = q.length ? q[(q.length - 1) >> 1] : NaN;
        } else if (t === 'CMP') {
          const sp = TCS_IBD_SP[id + '@' + g[4] + ',' + g[5]];
          let pv = v[ins[0]];
          /* the speed set points of TA-15 are written in % of 3600 rpm */
          if (x && x[3] === '%' && id === 'TA-15') pv = (pv / 3600) * 100;
          const xs = Array.isArray(sp) ? sp : x;
          if (typeof sp === 'function') o = sp(U) ? 1 : 0;
          else if (!xs || !isFinite(pv)) o = 0;
          else if (xs[0]) o = pv >= xs[1] || (v[out] > 0.5 && pv > xs[2]) ? 1 : 0;
          else o = pv <= xs[1] || (v[out] > 0.5 && pv < xs[2]) ? 1 : 0;
        } else if (t === 'DI' || t === 'DT' || t === 'PO') {
          const k = id + ':' + i,
            T = tcsIbdT(x),
            on = a[0] > 0.5;
          if (pass === 0) {
            if (t === 'DI') ib.t[k] = on ? (ib.t[k] || 0) + dt : 0;
            else if (t === 'DT') ib.t[k] = on ? T : Math.max(0, (ib.t[k] || 0) - dt);
            else {
              if (on && !ib.t[k + 'e']) ib.t[k] = T;
              ib.t[k + 'e'] = on ? 1 : 0;
              ib.t[k] = Math.max(0, (ib.t[k] || 0) - dt);
            }
          }
          o =
            t === 'DI' ? (on && ib.t[k] >= T ? 1 : 0) : t === 'DT' ? (on || ib.t[k] > 0 ? 1 : 0) : ib.t[k] > 0 ? 1 : 0;
        } else
          o =
            a[0] ||
            0; /* FG, LS, FLK: the value passes; a sheet that needs them has its comparator as a function above */
        /* a net the model gives (TCS_IBD_OUT): its value, so the gates after it read the same */
        const m = so && so[out] ? so[out](U.tc) : undefined;
        v[out] = m !== undefined ? (m ? 1 : 0) : o;
      });
    if (dv) dv.post(v, c, U);
    /* the oil pumps are driven by TCE300 / TCE305 (tcs-sheets.js): these sheets show the state */
    if (pu && c[pu.k]) {
      v[pu.auto] = c[pu.k + 'Au'][pu.i] ? 1 : 0;
      v[pu.run] = v[pu.fb] = c[pu.k][pu.i] ? 1 : 0;
    }
    for (const k in ib.fx) if (k.startsWith(id + ':')) v[+k.split(':')[1]] = ib.fx[k];
  }
  for (const k in ib.pbn) {
    ib.pbn[k] -= dt;
    if (!(ib.pbn[k] > 0)) {
      /* the end of the pulse: the button net goes back to 0 */
      const [sid, net] = k.split(':');
      if (ib.v[sid]) ib.v[sid][+net] = 0;
      delete ib.pbn[k];
    }
  }
  /* TB-1 and TB-2 note: TCS MAJOR TROUBLE starts the main oil pumps */
  if (c.mop) {
    const a = TCS_IBD.by['TA-9'].i.find(i => /TCS MAJOR TROUBLE/.test(i[1]));
    if (a && ib.v['TA-9'][a[0]] > 0.5) {
      c.mop = [true, true];
      tcsShMot(c, 'mopA').on = tcsShMot(c, 'mopB').on = 1;
    }
    tcsOilSet(c);
  }
  tcsI0400(U, ib);
  ib.rst0 = !!c.rst;
  ib.pb.trip = Math.max(0, (ib.pb.trip || 0) - dt);
  /* Mina T3 / N2, 3.2.3-beta.4: the refused reset was written by the page from its own copy of the sheets (Worker ON: no TA-9 values, held = []).
     The engine writes it now, at the end of the 1.5 s push button, from its own values: the TA-9 trip inputs at 1, else the MFT of DITL-03A
     (TA-9 BOILER MFT 1 / 2 into the TURBINE TRIP COMMAND of TA-1) */
  if (ib.pb.rst > 0 && ib.pb.rst - dt <= 0 && c.trip && window.lsEventAdd && !(window.ENG && ENG.mode === 'mirror')) {
    /* Mina B6-1, beta.6: BOILER MFT 1 and 2 both lit read 'BOILER MFT, BOILER MFT' (the numbers are taken off the names): one name each,
       and the MFT gets its hint whether TA-9 shows it or not */
    const h = [...new Set((tcsTripState(U).held || []).filter(Boolean))].filter(x => x !== 'BOILER MFT');
    if (tcsMft() || (tcsTripState(U).held || []).includes('BOILER MFT')) h.unshift('BOILER MFT (DITL-03A MFT active: reset the MFT first)');
    lsEventAdd('TCS TA-1', 'TCS', 'TURBINE RESET refused: the trip is still held by ' + (h.length ? h.join(', ') : 'the TURBINE TRIP COMMAND of IBD TA-9'));
  }
  ib.pb.rst = Math.max(0, (ib.pb.rst || 0) - dt);
  ib.pb.sd = Math.max(0, (ib.pb.sd || 0) - dt);
  ib.pb.auto = Math.max(0, (ib.pb.auto || 0) - dt);
}
/* a push button of an IBD sheet (TCS_IBD_PBN): '' or the reason it is refused */
function tcsIbdPush(c, a) {
  const id = a && a.id,
    pb = String((a && a.pb) || '').toUpperCase(),
    m = TCS_IBD_PBN[id];
  if (!m) return 'No TCS push button sheet ' + id;
  if (!(pb in m)) return id + ' has no ' + pb + ' push button (' + Object.keys(m).join(' / ') + ')';
  /* the extractor and the exhauster are driven by TCA655 / TCA680 (tcs-sheets.js): the button of their sheet */
  if (id === 'TB-12' || id === 'TC-28') return tcsShOp(c, id === 'TB-12' ? 'vex' : 'gse', { START: 'start', STOP: 'stop', AUTO: 'auto', MANUAL: 'man' }[pb]);
  const ib = tcsIb(c);
  ib.pbn = ib.pbn || {};
  ib.pbn[id + ':' + m[pb]] = 1.5;
  return '';
}
/* the event of the engine only: a mirror page gets it from the worker */
const tcsTripLog = n => {
  if (window.lsEventAdd && !(window.ENG && ENG.mode === 'mirror'))
    lsEventAdd('TCS TA-9', 'TRIP', 'TURBINE TRIP, first out: ' + n);
};
/* Mina N1, 3.2.3-beta.4: a good Turbine reset had no line of its own. The reset of TA-1 is logged by the engine as a TCS event */
const tcsResetLog = () => {
  if (window.lsEventAdd && !(window.ENG && ENG.mode === 'mirror')) lsEventAdd('TCS TA-1', 'TCS', 'TURBINE RESET: trip cleared');
};
/* the name of a row of TA-9 without its off-page number */
const tcsIbdName = n =>
  n
    .replace(/SH-.*$/, '')
    .replace(/\(\*[0-9]\)/g, '')
    .replace(/\b[0-9]+\b/g, '')
    .replace(/ +/g, ' ')
    .trim();
function tcsTripFirst(c) {
  const ib = tcsIb(c),
    s = TCS_IBD.by['TA-9'],
    v = ib.v['TA-9'] || [];
  if (ib.pb.trip > 0) return 'MANUAL TRIP';
  const r = s && s.i.find(i => v[i[0]] > 0.5);
  return r ? tcsIbdName(r[1]) : 'TURBINE TRIP COMMAND';
}
/* every step of the TCS, no trip standing (tcsStep) */
function tcsTripScan(U, dt) {
  const c = tcsOilState(U),
    tb = U.tb,
    ib = tcsIb(c);
  /* Start at 150 MW has no ATS program (U.tc null): the oil state carries the trip, the running turbine is reset */
  if (!U.tc) c.rst = !!(tb && tb.st !== 'off');
  /* the I.0400 of the drawing went back to 0 by itself (a forced test input): the name of that trip goes with it */
  if (ib.ext) {
    ib.ext = false;
    ib.first = '';
  }
  ib.t0 += dt;
  ib.rsd = false;
  if (!tcsMft()) ib.mft0 = true;
  const a = !!(ib.v['TA-1'] && ib.v['TA-1'][TA1_RESET] > 0.5);
  /* a push button held now (Turbine trip, ATS shut-down): plant plan 4B, the Instructor trip at t = 0 after a 150 MW load fell inside the 2 s below */
  const pb = ib.pb.trip > 0 || ib.pb.sd > 0;
  tcsIbdStep(U, c, dt);
  const b = ib.v['TA-1'][TA1_RESET] > 0.5;
  if (b) {
    ib.r1 = true;
    if (c.trip) {
      c.trip = '';
      ib.first = '';
      tcsResetLog();
      const l = U.vtrip;
      if (l && l.S.rt.force[l.n] === undefined && l.S.ext.includes(l.n)) l.S.rt.ext[l.n] = 0;
    }
  }
  /* the first 2 s of a run: the values settle from the starting state; an operator push button in them is kept for the end of the 2 s */
  if (ib.t0 < 2) {
    if (pb) ib.pm = ib.pb.trip > 0 ? 'MANUAL TRIP' : ib.pm || 'pb';
    return;
  }
  const pm = ib.pm;
  ib.pm = '';
  if (((a && !b) || (pm && !b)) && !c.trip && (tb.st !== 'off' || tb.rpm > 4)) {
    ib.first = pm === 'MANUAL TRIP' ? pm : tcsTripFirst(c);
    ib.at = +U.t || 0;
    c.trip = ib.first;
    tcsTripLog(ib.first);
  }
}
/* I.0400 stands: the sheets go on, so a Turbine reset is seen; a trip that did not pass TA-1 still gets its name */
function tcsTripHold(U, dt) {
  const c = tcsOilState(U),
    ib = tcsIb(c);
  tcsIbdStep(U, c, dt);
  if (ib.v['TA-1'][TA1_RESET] > 0.5 && c.trip) {
    c.trip = '';
    ib.first = '';
    /* Mina N1, 3.2.3-beta.4: after a good reset the DCS trip input I.0400 still stood for some scans (the stop valves are still shut,
       TA-6), so the next scan named it a new trip 'TURBINE TRIP (DCS I.0400)'. What is left of the trip just reset is no new trip:
       ib.rsd holds until I.0400 falls (tcsTripScan); a new TA-9 trip input or the trip push button still trips */
    ib.rsd = true;
    tcsResetLog();
    const l = U.vtrip;
    if (l && l.S.rt.force[l.n] === undefined && l.S.ext.includes(l.n)) l.S.rt.ext[l.n] = 0;
    return;
  }
  if (ib.first) return;
  if (ib.rsd && !(ib.pm === 'MANUAL TRIP' || ib.pb.trip > 0) && !(tcsTripState(U).held || []).length) return;
  ib.rsd = false;
  /* Mina T1, 3.2.3-beta.1: a Turbine trip pressed in the first 2 s after a state load set I.0400 before the scan named it, so the log said
     TURBINE TRIP (DCS I.0400) while page 13 said MANUAL TRIP. The push button kept (ib.pm) or still held names the trip */
  const pm = ib.pm === 'MANUAL TRIP' || ib.pb.trip > 0;
  ib.pm = '';
  const v = !pm && isFinite(U.cdP) && U.cdP > AN_CD.Ptrip;
  ib.first = pm ? 'MANUAL TRIP' : v ? 'CONDENSER VACUUM VERY LOW TRIP' : 'TURBINE TRIP (DCS I.0400)';
  if (pm && !c.trip) c.trip = ib.first;
  ib.at = +U.t || 0;
  ib.ext = !v && !pm;
  tcsTripLog(ib.first);
}
/* TA-1 TURBINE TRIP P.B. */
/* the action runs on the mirror page too; only the engine writes the trip state: a write here would mark the whole slot as the page's own,
   the page would skip the engine's answer and keep the old first out (Mina item 14 / 16: TRIPPED after a good reset) */
const tcsMirror = () => !!(window.ENG && ENG.mode === 'mirror');
function tcsTripManual(U) {
  if (tcsMirror()) return '';
  const c = tcsOilState(U),
    ib = tcsIb(c);
  if (c.trip) return 'The turbine is already tripped: ' + c.trip;
  ib.pb.trip = 1.5;
  return '';
}
/* the ATS SHUT-DOWN (step 8, 775 page 29): the TURBINE SHUTDOWN COMMAND input of TA-9 (row 18), held as a push button */
function tcsTripShutdown(U) {
  if (tcsMirror()) return '';
  const c = tcsOilState(U),
    ib = tcsIb(c);
  if (c.trip) return 'The turbine is already tripped: ' + c.trip;
  ib.pb.sd = 1.5;
  return '';
}
/* TA-1 TURBINE RESET P.B.: the gates decide; a held TA-9 keeps the A gate at 0 */
function tcsTripReset(U) {
  if (tcsMirror()) return '';
  const ib = tcsIb(tcsOilState(U));
  ib.pb.rst = 1.5;
  /* beta.240: the 86G-A / 86G-B lockouts are reset with it, 52G open (gen-panel.js tcsLo86Reset) */
  if (U.lo86 && !(U.tb && (U.tb.st === 'sync' || U.tb.st === 'load'))) tcsLo86Reset(U);
  if (U.tc) U.tc.sdDone = false;
  /* LMYP OTS (Rose, Turbine trip page): the press is made, but a trip input of TA-9 that is still at 1 keeps the A gate of the reset at 0
     (IBD TA-1): the answer names what holds the trip, so the page and the Event log say why nothing reset */
  try {
    const t = tcsTripState(U),
      h = t && t.held ? t.held : [];
    if (h.length) return 'Trip still held by: ' + [...new Set(h)].join(', ');
  } catch (e) {}
  return '';
}
/* a signal of a sheet held at a value (a field contact, a test) */
function tcsTripFault(U, a) {
  if (tcsMirror()) return '';
  const ib = tcsIb(tcsOilState(U)),
    k = a.id + ':' + a.net;
  if (a.on == null) delete ib.fx[k];
  else ib.fx[k] = a.on === true ? 1 : a.on === false ? 0 : +a.on;
  return '';
}
/* the first-out name of a standing trip, with or without the ATS program */
const tcsTripNow = U => {
  const c = U.tc || U.tco;
  return c ? c.trip : '';
};
/* what the TCS panel shows */
function tcsTripState(U) {
  const c = U.tc || U.tco;
  if (!c) return null;
  const ib = tcsIb(c);
  /* Mina T3, 3.2.3-beta.1: a Turbine reset refused showed no cause. held = the TA-9 trip inputs at 1 now (a held trip keeps the A gate
     of the reset at 0, IBD TA-1), so the page can say what holds the trip. Redundant channels (BOILER MFT 1 / 2, TA-9 in 21 / 22) give the
     same name once their numbers are cleaned: each name is listed once (live overspeed test 2026-11-19 showed BOILER MFT twice) */
  const s = TCS_IBD.by['TA-9'],
    v = ib.v['TA-9'] || [],
    held = s ? [...new Set(s.i.filter(i => v[i[0]] > 0.5).map(i => tcsIbdName(i[1])))] : [];
  return { first: ib.first, at: ib.at, held };
}
/* the live values of one sheet, for the drawing */
function tcsIbdState(id) {
  const c = AN_UNIT.tc || AN_UNIT.tco,
    ib = c && c.ib;
  return ib ? { v: ib.v[id] || [], fx: ib.fx, t: ib.t } : null;
}
/* the comparators of the sheets with no set point yet (no assumed value: they stay 0) */
function tcsIbdMissing() {
  const L = [];
  for (const s of TCS_IBD_SHEETS)
    for (const g of s.g)
      if (g[0] === 'CMP' && !g[3] && !TCS_IBD_SP[s.id + '@' + g[4] + ',' + g[5]])
        L.push(s.id + '@' + g[4] + ',' + g[5]);
  return L;
}
