/* TCA777 SIMULATOR (331DM09788 page 200, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn:
   - INITIAL (TCA100) through TP B014 (TP:0.2s) gives the reset pulse to the AM / BP1 / RL / LG blocks and to CMP B050.
   - 0.0 (sys.ref) feeds FG B041 / B045 and UCK B005 / B013 / B021 / B027; OFF(0) through NOT 001 and A 002 / A 018 with the UCKs gives I of
     AM B003 / B019 (R :0.5degC/s, M :10, HL:700.0degC, LL:50.0degC), TURBINE TRIP (TCA103) through BTR 011 gives D, SG B009 / B026
     (K:25.0degC) gives Z.
   - TURBINE SPEED (TCA104) through FTR 049 into CMP B050 (HL:10.0rpm, LL:0.5rpm), which switches BP1 B042 / B046 / B030 (R:1.0).
   - CV (LOWER) / (UPPER) INNER WALL METAL TEMP SIM: BP1, LMS (HL:700.0degC, LL:0.0degC), LG (T:120.0s), A1 / A2 out.
     CV (LOWER) / (UPPER) OUTER WALL METAL TEMP SIM: HLD 012 / 022 of the BP1 output (held by UCK B013 / B027), RL B006 / B023
     (RI:0.8degC/s, RD:1.0degC/s), SUB 007 / 024 minus SG B010 / B028 (K:10.0degC), LMS, LG, B1 / B2 out.
   - HP-T INNER CASING FIRST STG INNER WALL METAL TEMP(LOWER)SIM: SG 055 (K:200degC) or FG B015 of HP TURBINE WARMING VLV POS. SIM
     (P of TCA685) by BP1 B030, FG B031, RL B038 (RI:0.5%/S, RD:0.01%/S), LMS B017, LG B016 (T:80.0s), C out (to TCA360).
   - GEN. LOAD (TCA104) through FTR 033 into CMP B051 (HL:175.0, LL:0.0), FG B034 and FG B054; ASW 052 picks one; BP1 B035 (R:0.033,
     switched by BOILER LIGHT OFF SIM = OFF(0) through BTR 039, E out) gives it or SG B037 (K:50.0degC); RL B053 (RI:100.0, RD:100.0),
     LG B040 (T:60.0S) = MSV(L) INLET STEAM TEMP. SIM, D out, and through FTR 036 MSV INLET STEAM TEMP. SIM, D1 out.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [],
    b = [],
    c = [],
    j = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const WT = (key, ...pts) => w.push([key, pts, 1]);
  const HW = 28.76,
    TOP = 21.5,
    xL = 615, // the left column of blocks
    xBP = 1118,
    xLMS = 1491,
    xLG = 1637,
    xOut = 2042,
    xAM = 968.5,
    AMH = 32; // half the height of an AM block
  /* the reset pulse of INITIAL through TP B014 */
  W('kInit', [536, 147], [810 - HW, 147]);
  W('kInit', [670, 147], [670, 105], [810, 105], [810, 158 - TOP]);
  j.push([670, 147]);
  W('tpB014', [810 + HW, 147], [xLG, 147], [xLG, 274 - TOP]);
  W('tpB014', [xAM, 147], [xAM, 306 - AMH]);
  W('tpB014', [860, 147], [860, 1052 - TOP]);
  W('tpB014', [860, 616], [xAM, 616], [xAM, 712 - AMH]);
  W('tpB014', [860, 1010], [796, 1010], [796, 1362], [1050, 1362], [1050, 1405 - TOP]);
  W('tpB014', [963, 1362], [963, 1405 - TOP]);
  W('tpB014', [796, 1265], [591, 1265], [591, 1298 - TOP]);
  W('tpB014', [1213, 147], [1213, 842], [1265, 842], [1265, 892 - TOP]);
  W('tpB014', [1213, 433], [1265, 433], [1265, 488 - TOP]);
  W('tpB014', [1585, 147], [1585, 1137]);
  /* the SW of RL B038 and LG B016 (page 200: the wire drops to the top of both); each piece starts at the line so the reader ends it on the SW */
  W('tpB014', [1347, 1137], [1347, 1202 - TOP]);
  W('tpB014', [1347, 1137], [xLG, 1137], [xLG, 1202 - TOP]);
  [443, 637, 838].forEach((y, i) => W('tpB014', [1585, y], [xLG, y], [xLG, [488, 680, 892][i] - TOP]));
  j.push([860, 147], [xAM, 147], [1213, 147], [1585, 147], [860, 616], [860, 1010], [796, 1265], [963, 1362], [1213, 433]);
  j.push([1585, 443], [1585, 637], [1585, 838], [1585, 1137]);
  /* 0.0 and its bus to the FG and UCK blocks */
  WT('k00', [429, 222], [xL - HW, 222]);
  WT('k00', [510, 222], [510, 937], [xL - HW, 937]);
  [382, 586, 660, 788].forEach(y => (WT('k00', [510, y], [xL - HW, y]), j.push([510, y])));
  j.push([510, 222]);
  /* OFF(0), NOT, A and the UCK outputs into I of the AM blocks */
  W('kOff', [448, 285], [xL - HW, 285]);
  W('not001', [xL + HW, 285], [810 - HW, 285]);
  W('not001', [735, 285], [735, 691], [807 - HW, 691]);
  j.push([735, 285]);
  W('uckB005', [xL + HW, 382], [752, 382], [752, 307], [810 - HW, 307]);
  W('uckB021', [xL + HW, 788], [753, 788], [753, 713], [807 - HW, 713]);
  W('a002', [810 + HW, 285], [xAM - 39.5, 285]);
  W('a018', [807 + HW, 691], [xAM - 39.5, 691]);
  /* TURBINE TRIP into D, SG into Z */
  W('kTrip', [448, 467], [882, 467]);
  W('kTrip', [882, 306], [882, 712]);
  W('kTrip', [882, 306], [xAM - 39.5, 306]);
  W('kTrip', [882, 712], [xAM - 39.5, 712]);
  j.push([882, 467]);
  WT('sgB009', [xL + HW, 510], [905, 510], [905, 327], [xAM - 39.5, 327]);
  WT('sgB026', [xL + HW, 862], [905, 862], [905, 733], [xAM - 39.5, 733]);
  /* FG and AM into BP1 */
  WT('fgB041', [xL + HW, 222], [1066, 222], [1066, 263], [xBP - HW, 263]);
  WT('fgB045', [xL + HW, 660], [1062, 660], [1062, 669], [xBP - HW, 669]);
  WT('amB003', [xAM + 39.5, 285], [xBP - HW, 285]);
  WT('amB019', [xAM + 39.5, 691], [xBP - HW, 691]);
  /* TURBINE SPEED, CMP B050 switching the BP1 blocks */
  W('kSpeed', [681, 1041], [860 - HW, 1041]);
  W('cmpB050', [860 + HW, 1041], [1180, 1041], [1180, 1202 - TOP]);
  W('cmpB050', [1041, 1041], [1041, 232], [xBP, 232], [xBP, 274 - TOP]);
  W('cmpB050', [1041, 637], [xBP, 637], [xBP, 680 - TOP]);
  j.push([1041, 1041], [1041, 637]);
  /* the four CV rows: [BP1 key, BP1 out y, HLD, its cy, UCK key, UCK out y, its riser y, the return y, RL, SG, SUB, LMS in, LMS out, LG in, LG out,
     inner out letter, outer out letter, inner words, outer words, x of the return] */
  const CV = [
    ['bp1B042', 263, '012', 488, 'uckB013', 586, 433, 403, 'B006', 'B010', '007', 'B004', 'B008', 'B043', 'B044', 'A1', 'B1', 'CV (LOWER)', 1173, 1076],
    ['bp1B046', 669, '022', 892, 'uckB027', 937, 840, 806, 'B023', 'B028', '024', 'B020', 'B025', 'B047', 'B048', 'A2', 'B2', 'CV (UPPER)', 1170, 1072]
  ];
  CV.forEach(([bp, y, hl, cy, uk, uy, ry, back, rl, sg, sub, lm1, lm2, lg1, lg2, o1, o2, s, xj, xb]) => {
    const yo = cy - 11;
    b.push(['lms' + lm1, 'LMS', lm1, xLMS, y + 11, ['HL:700.0degC', 'LL:0.0degC']], ['lg' + lg1, 'LG', lg1, xLG, y + 11, ['T:120.0s']]);
    WT(bp, [xBP + HW, y], [xLMS - HW, y]);
    WT('lms' + lm1, [xLMS + HW, y], [xLG - HW, y]);
    WT('lg' + lg1, [xLG + HW, y], [xOut - 27, y]);
    WT(bp, [xj, y], [xj, back], [xb, back], [xb, yo], [1138 - HW, yo]);
    j.push([xj, y]);
    W(uk, [xL + HW, uy], [991, uy], [991, ry], [1138, ry], [1138, cy - TOP]);
    b.push(
      ['hld' + hl, 'HLD', hl, 1138, cy],
      ['rl' + rl, 'RL', rl, 1265, cy, ['RI:0.8degC/s', 'RD:1.0degC/s']],
      ['sg' + sg, 'SG', sg, 1265, cy + 96, ['K:10.0degC']],
      ['sub' + sub, 'SUB', sub, 1406, cy],
      ['lms' + lm2, 'LMS', lm2, xLMS, cy, ['HL:700.0degC', 'LL:0.0degC']],
      ['lg' + lg2, 'LG', lg2, xLG, cy, ['T:120.0s']]
    );
    WT('hld' + hl, [1138 + HW, yo], [1265 - HW, yo]);
    WT('rl' + rl, [1265 + HW, yo], [1406 - HW, yo]);
    WT('sg' + sg, [1265 + HW, cy + 85], [1363, cy + 85], [1363, cy + 11], [1406 - HW, cy + 11]);
    WT('sub' + sub, [1406 + HW, yo], [xLMS - HW, yo]);
    WT('lms' + lm2, [xLMS + HW, yo], [xLG - HW, yo]);
    WT('lg' + lg2, [xLG + HW, yo], [xOut - 27, yo]);
    c.push(['o' + o1, 'out', o1, xOut, y, '', ['-'], 0, 0], ['o' + o2, 'out', o2, xOut, yo, '', ['-'], 0, 0]);
    t.push([1368, yo - 9, '+'], [1368, yo + 13, '-']);
    t.push([1672, y - 23, s + ' INNER WALL METAL'], [1672, y - 2, 'TEMP SIM'], [1672, yo - 23, s + ' OUTER WALL METAL'], [1672, yo - 2, 'TEMP SIM']);
    t.push([1096, yo - 7, 'T'], [1223, yo - 7, 'T'], [1595, y - 7, 'T'], [1595, yo - 7, 'T'], [1076, y - 7, 'T']);
  });
  /* the HP-T inner casing row */
  WT('sg055', [965 + HW, 1170], [1071, 1170], [1071, 1191], [1180 - HW, 1191]);
  WT('iP', [267, 1244], [848 - HW, 1244]);
  WT('fgB015', [848 + HW, 1244], [1125, 1244], [1125, 1213], [1180 - HW, 1213]);
  WT('bp1B030', [1180 + HW, 1191], [1261 - HW, 1191]);
  WT('fgB031', [1261 + HW, 1191], [1347 - HW, 1191]);
  WT('rlB038', [1347 + HW, 1191], [xLMS - HW, 1191]);
  WT('lmsB017', [xLMS + HW, 1191], [xLG - HW, 1191]);
  WT('lgB016', [xLG + HW, 1191], [xOut - 27, 1191]);
  /* GEN. LOAD to the MSV inlet steam temp */
  W('kOff2', [437, 1330], [1475 - 27, 1330]);
  W('kOff2', [888, 1330], [888, 1405 - TOP]);
  j.push([888, 1330]);
  WT('kLoad', [437, 1394], [591 - HW, 1394]);
  WT('kLoad', [536, 1287], [536, 1455], [591 - HW, 1455]);
  WT('kLoad', [536, 1287], [591 - HW, 1287]);
  j.push([536, 1394]);
  W('cmpB051', [591 + HW, 1287], [697, 1287], [697, 1405 - TOP]);
  WT('fgB034', [591 + HW, 1394], [697 - HW, 1394]);
  WT('fgB054', [591 + HW, 1455], [648, 1455], [648, 1416], [697 - HW, 1416]);
  WT('asw052', [697 + HW, 1394], [888 - HW, 1394]);
  WT('sgB037', [782 + HW, 1416], [888 - HW, 1416]);
  WT('bp1B035', [888 + HW, 1394], [963 - HW, 1394]);
  WT('rlB053', [963 + HW, 1394], [1050 - HW, 1394]);
  WT('lgB040', [1050 + HW, 1394], [1475 - 27, 1394]);
  WT('lgB040', [1100, 1394], [1100, 1448], [1475 - 27, 1448]);
  j.push([1100, 1394]);
  b.push(
    ['tpB014', 'TP', 'B014', 810, 158, ['TP:0.2s']],
    ['fgB041', 'FG', 'B041', xL, 233],
    ['not001', 'NOT', '001', xL, 296],
    ['uckB005', 'UCK', 'B005', xL, 393, ['K:51.52%']],
    ['btr011', 'o:BTR', '011', 615, 467],
    ['sgB009', 'SG', 'B009', xL, 521, ['K:25.0degC']],
    ['uckB013', 'UCK', 'B013', xL, 597, ['K:1000.0%']],
    ['fgB045', 'FG', 'B045', xL, 671],
    ['uckB021', 'UCK', 'B021', xL, 799, ['K:51.52%']],
    ['sgB026', 'SG', 'B026', xL, 873, ['K:25.0degC']],
    ['uckB027', 'UCK', 'B027', xL, 948, ['K:1000.0%']],
    ['a002', 'A', '002', 810, 296],
    ['a018', 'A', '018', 807, 702],
    ['amB003', 'AM', 'B003', xAM, 306, ['R :0.5degC/s', 'M :10', 'HL:700.0degC', 'LL:50.0degC'], { l: ['I', 'D', 'Z'] }, [79, 64]],
    ['amB019', 'AM', 'B019', xAM, 712, ['R :0.5degC/s', 'M :10', 'HL:700.0degC', 'LL:50.0degC'], { l: ['I', 'D', 'Z'] }, [79, 64]],
    ['bp1B042', 'BP1', 'B042', xBP, 274, ['R:1.0']],
    ['bp1B046', 'BP1', 'B046', xBP, 680, ['R:1.0']],
    ['ftr049', 'o:FTR', '049', 741, 1041],
    ['cmpB050', 'CMP', 'B050', 860, 1052, ['HL:10.0rpm', 'LL:0.5rpm']],
    ['sg055', 'SG', '055', 965, 1181, ['K:200degC']],
    ['fgB015', 'FG', 'B015', 848, 1255],
    ['bp1B030', 'BP1', 'B030', 1180, 1202, ['R:1.0']],
    ['fgB031', 'FG', 'B031', 1261, 1202],
    ['rlB038', 'RL', 'B038', 1347, 1202, ['RI:0.5%/S', 'RD:0.01%/S']],
    ['lmsB017', 'LMS', 'B017', xLMS, 1202, ['HL:700.0degC', 'LL:0.0degC']],
    ['lgB016', 'LG', 'B016', xLG, 1202, ['T:80.0s']],
    ['btr039', 'o:BTR', '039', 485, 1330],
    ['ftr033', 'o:FTR', '033', 485, 1394],
    ['cmpB051', 'CMP', 'B051', 591, 1298, ['HL:175.0', 'LL:0.0']],
    ['fgB034', 'FG', 'B034', 591, 1405],
    ['fgB054', 'FG', 'B054', 591, 1466],
    ['asw052', 'ASW', '052', 697, 1405],
    ['sgB037', 'SG', 'B037', 782, 1427, ['K:50.0degC']],
    ['bp1B035', 'BP1', 'B035', 888, 1405, ['R:0.033']],
    ['rlB053', 'RL', 'B053', 963, 1405, ['RI:100.0', 'RD:100.0']],
    ['lgB040', 'LG', 'B040', 1050, 1405, ['T:60.0S']],
    ['ftr036', 'o:FTR', '036', 1123, 1448]
  );
  c.push(
    ['iP', 'in', 'P', 240, 1244, '', ['TCA685'], 0, 1],
    ['oC', 'out', 'C', xOut, 1191, '', ['TCA360'], 0, 1],
    ['oE', 'out', 'E', 1475, 1330, '', ['-'], 0, 0],
    ['oD', 'out', 'D', 1475, 1394, '', ['-'], 0, 0],
    ['oD1', 'out', 'D1', 1475, 1448, '', ['-'], 1, 0]
  );
  t.push(
    [576, 167, '(TCA100)', 1],
    [381, 499, '(TCA103)', 1],
    [605, 1074, '(TCA104)', 1],
    [357, 1426, '(TCA104)', 1],
    [766, 140, 'T'],
    [915, 271, 'T'],
    [912, 677, 'T'],
    [816, 1035, 'T'],
    [1138, 1184, 'T'],
    [1304, 1184, 'T'],
    [1590, 1184, 'T'],
    [548, 1281, 'T'],
    [849, 1388, 'T'],
    [935, 1388, 'T'],
    [1006, 1388, 'T'],
    [1668, 1167, 'HP-T INNER CASING FIRST STG'],
    [1668, 1189, 'INNER WALL METAL TEMP(LOWER)SIM'],
    [271, 1218, 'HP TURBINE WARMING'],
    [271, 1240, 'VLV POS. SIM'],
    [1214, 1326, 'BOILER LIGHT OFF SIM'],
    [1148, 1390, 'MSV(L) INLET STEAM TEMP. SIM'],
    [1172, 1444, 'MSV INLET STEAM TEMP. SIM'],
    [229, 1530, 'CONTROLLER:'],
    [388, 1530, 'COMM+MD'],
    [648, 1512, 'TRIGGER  :'],
    [648, 1528, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA777',
    title: 'SIMULATOR',
    page: 200,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [162, 80, 2218, 1547],
    k: [
      ['kInit', 300, 147, 'INITIAL', 'ref'],
      ['k00', 196, 222, '0.0', 'sys.ref'],
      ['kOff', 215, 285, 'OFF(0)', 'sys.ref'],
      ['kTrip', 215, 467, 'TURBINE TRIP', 'ref'],
      ['kSpeed', 448, 1041, 'TURBINE SPEED', 'ref'],
      ['kOff2', 204, 1330, 'OFF(0)', 'sys.ref'],
      ['kLoad', 204, 1394, 'GEN. LOAD', 'ref']
    ],
    c,
    b,
    w,
    j,
    t
  });
})();
