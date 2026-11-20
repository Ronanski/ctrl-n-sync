/* TCE503 SIMULATOR (331DM09784 page 176, controller EHG+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. The same metal temperature simulator as TCA777, here in the EHG controller. As drawn:
   - INITIAL (TCA100) through TP B014 (TP:0.2s) gives the reset pulse to the AM / BP1 / RL / LG blocks and to CMP B050 / B051.
   - CV WARMING (LOWER) SET (D of TCE155) feeds FG B041 / B045 and UCK B005 / B013 / B021 / B027; CV WARMING COMP (B of TCE152)
     through NOT 001 and A 002 / A 018 with the UCKs (K:2.8%) gives I of AM B003 / B019 (R :0.4degC/s, M :10, HL:700.0degC,
     LL:50.0degC), TURBINE TRIP (TCA103) through BTR 011 gives D, SG B009 / B026 (K:25.0degC) gives Z.
   - TURBINE SPEED (TCA104) through FTR 049 into CMP B050 (HL:9999.0rpm, LL:0.5rpm), which switches BP1 B042 / B046 (R:1.0).
   - CV (LOWER) / (UPPER) INNER WALL METAL TEMP SIM: BP1, LMS (HL:700.0degC, LL:0.0degC), LG (T:80.0s / 120.0s), A1 (to TCA359) / A2.
     CV (LOWER) / (UPPER) OUTER WALL METAL TEMP SIM: HLD 012 / 022 of the BP1 output (held by UCK B013 / B027), RL B006 / B023
     (RI:0.8degC/s, RD:1.0degC/s), SUB 007 / 024 minus SG B010 / B028 (K:10.0degC), LMS, LG (T:90.0s / 120.0s), B1 (to TCA363) / B2.
   - HP-T INNER CASING FIRST STG INNER WALL METAL TEMP(LOWER)SIM: 0.0 (sys.ref) or 0.0 through FG B015, picked by BP1 B030 (R:1.0,
     switched by OFF(0)), FG B031, RL B038 (RI:0.1%/S, RD:0.01%/S), LMS B017, LG B016 (T:300.0s), C out (-).
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
    xL = 618, // the left column of blocks
    xAM = 973,
    AMH = 32; // half the height of an AM block
  /* the reset pulse of INITIAL through TP B014 */
  W('kInit', [543, 149], [815 - HW, 149]);
  W('kInit', [677, 149], [677, 101], [815, 101], [815, 160 - TOP]);
  j.push([677, 149]);
  W('tpB014', [815 + HW, 149], [1643, 149], [1643, 276 - TOP]);
  W('tpB014', [xAM, 149], [xAM, 308 - AMH]);
  W('tpB014', [862, 149], [862, 1052 - TOP]);
  W('tpB014', [862, 617], [xAM, 617], [xAM, 713 - AMH]);
  W('tpB014', [862, 1010], [795, 1010], [795, 1361], [1047, 1361], [1047, 1403 - TOP]);
  W('tpB014', [962, 1361], [962, 1403 - TOP]);
  W('tpB014', [795, 1265], [589, 1265], [589, 1297 - TOP]);
  W('tpB014', [1215, 149], [1215, 820], [1267, 820], [1267, 894 - TOP]);
  W('tpB014', [1215, 437], [1267, 437], [1267, 490 - TOP]);
  W('tpB014', [1588, 149], [1588, 1139]);
  W('tpB014', [1345, 1201 - TOP], [1345, 1139], [1633, 1139], [1633, 1201 - TOP]);
  [[449, 1641, 490], [641, 1639, 681], [841, 1637, 894]].forEach(([y, x, cy]) => W('tpB014', [1588, y], [x, y], [x, cy - TOP]));
  j.push([862, 149], [xAM, 149], [1215, 149], [1588, 149], [862, 617], [862, 1010], [795, 1265], [962, 1361], [1215, 437]);
  j.push([1588, 449], [1588, 641], [1588, 841], [1588, 1139]);
  /* CV WARMING (LOWER) SET and its bus to the FG and UCK blocks */
  WT('iSet', [288, 222], [xL - HW, 222]);
  WT('iSet', [513, 222], [513, 935], [xL - HW, 935]);
  [381, 584, 659, 786].forEach(y => (WT('iSet', [513, y], [xL - HW, y]), j.push([513, y])));
  j.push([513, 222]);
  /* CV WARMING COMP, NOT, A and the UCK outputs into I of the AM blocks */
  W('iComp', [286, 287], [xL - HW, 287]);
  W('not001', [xL + HW, 287], [813 - HW, 287]);
  W('not001', [737, 287], [737, 692], [808 - HW, 692]);
  j.push([737, 287]);
  W('uckB005', [xL + HW, 381], [759, 381], [759, 309], [813 - HW, 309]);
  W('uckB021', [xL + HW, 786], [755, 786], [755, 714], [808 - HW, 714]);
  W('a002', [813 + HW, 287], [xAM - 39.5, 287]);
  W('a018', [808 + HW, 692], [xAM - 39.5, 692]);
  /* TURBINE TRIP into D, SG into Z */
  W('kTrip', [453, 468], [886, 468]);
  W('kTrip', [886, 308], [886, 713]);
  W('kTrip', [886, 308], [xAM - 39.5, 308]);
  W('kTrip', [886, 713], [xAM - 39.5, 713]);
  j.push([886, 468]);
  WT('sgB009', [xL + HW, 511], [907, 511], [907, 329], [xAM - 39.5, 329]);
  WT('sgB026', [xL + HW, 861], [904, 861], [904, 734], [xAM - 39.5, 734]);
  /* FG and AM into BP1 */
  WT('fgB041', [xL + HW, 222], [1072, 222], [1072, 265], [1123 - HW, 265]);
  WT('fgB045', [xL + HW, 659], [1066, 659], [1066, 670], [1119 - HW, 670]);
  WT('amB003', [xAM + 39.5, 287], [1123 - HW, 287]);
  WT('amB019', [xAM + 39.5, 692], [1119 - HW, 692]);
  /* TURBINE SPEED, CMP B050 switching the BP1 blocks */
  WT('kSpeed', [684, 1041], [862 - HW, 1041]);
  W('cmpB050', [862 + HW, 1041], [1046, 1041], [1046, 232], [1123, 232], [1123, 276 - TOP]);
  W('cmpB050', [1046, 639], [1119, 639], [1119, 681 - TOP]);
  j.push([1046, 639]);
  /* the two CV rows: [BP1 key, x, out y, HLD, its cy, UCK key, UCK out y, riser y, return y, RL, SG, SUB, LMS in, LMS out, LG in,
     LG out, x of LMS 1/2, x of LG 1/2, inner / outer out letter and x, words, junction x, return x, LG T 1/2, inner ref, outer ref] */
  const CV = [
    ['bp1B042', 1123, 265, '012', 490, 'uckB013', 584, 433, 405, 'B006', 'B010', '007', 'B004', 'B008', 'B043', 'B044', [1495, 1492], [1643, 1641], 'A1', 2048, 'B1', 2046, 'CV (LOWER)', 1176, 1078, ['T:80.0s', 'T:90.0s'], ['TCA359'], ['TCA363'], 1],
    ['bp1B046', 1119, 670, '022', 894, 'uckB027', 935, 842, 809, 'B023', 'B028', '024', 'B020', 'B025', 'B047', 'B048', [1492, 1488], [1639, 1637], 'A2', 2043, 'B2', 2041, 'CV (UPPER)', 1172, 1075, ['T:120.0s', 'T:120.0s'], ['-'], ['-'], 0]
  ];
  CV.forEach(([bp, xb, y, hl, cy, uk, uy, ry, back, rl, sg, sub, lm1, lm2, lg1, lg2, xm, xg, o1, x1, o2, x2, s, xj, xr, T, r1, r2, dbl]) => {
    const yo = cy - 11;
    b.push(['lms' + lm1, 'LMS', lm1, xm[0], y + 11, ['HL:700.0degC', 'LL:0.0degC']], ['lg' + lg1, 'LG', lg1, xg[0], y + 11, [T[0]]]);
    b.push(['bp1' + bp.slice(3), 'BP1', bp.slice(3), xb, y + 11, ['R:1.0']]);
    WT(bp, [xb + HW, y], [xm[0] - HW, y]);
    WT('lms' + lm1, [xm[0] + HW, y], [xg[0] - HW, y]);
    WT('lg' + lg1, [xg[0] + HW, y], [x1 - 27, y]);
    WT(bp, [xj, y], [xj, back], [xr, back], [xr, yo], [1140 - HW, yo]);
    j.push([xj, y]);
    W(uk, [xL + HW, uy], [991, uy], [991, ry], [1140, ry], [1140, cy - TOP]);
    b.push(
      ['hld' + hl, 'HLD', hl, 1140, cy],
      ['rl' + rl, 'RL', rl, 1267, cy, ['RI:0.8degC/s', 'RD:1.0degC/s']],
      ['sg' + sg, 'SG', sg, 1266, cy + 99, ['K:10.0degC']],
      ['sub' + sub, 'SUB', sub, 1406, cy],
      ['lms' + lm2, 'LMS', lm2, xm[1], cy, ['HL:700.0degC', 'LL:0.0degC']],
      ['lg' + lg2, 'LG', lg2, xg[1], cy, [T[1]]]
    );
    WT('hld' + hl, [1140 + HW, yo], [1267 - HW, yo]);
    WT('rl' + rl, [1267 + HW, yo], [1406 - HW, yo]);
    WT('sg' + sg, [1266 + HW, cy + 88], [1365, cy + 88], [1365, cy + 11], [1406 - HW, cy + 11]);
    WT('sub' + sub, [1406 + HW, yo], [xm[1] - HW, yo]);
    WT('lms' + lm2, [xm[1] + HW, yo], [xg[1] - HW, yo]);
    WT('lg' + lg2, [xg[1] + HW, yo], [x2 - 27, yo]);
    c.push(['o' + o1, 'out', o1, x1, y, '', r1, dbl, dbl], ['o' + o2, 'out', o2, x2, yo, '', r2, dbl, dbl]);
    t.push([1368, yo - 9, '+'], [1368, yo + 13, '-']);
    t.push([1676, y - 21, s + ' INNER WALL METAL'], [1676, y - 2, 'TEMP SIM'], [1674, yo - 21, s + ' OUTER WALL METAL'], [1674, yo - 2, 'TEMP SIM']);
    t.push([1097, yo - 7, 'T'], [1224, yo - 7, 'T'], [1596, y - 7, 'T'], [1596, yo - 7, 'T'], [1079, y - 7, 'T']);
  });
  /* the HP-T inner casing row */
  WT('k00', [433, 1244], [845 - HW, 1244]);
  WT('k00', [511, 1244], [511, 1190], [1178 - HW, 1190]);
  j.push([511, 1244]);
  W('kOff', [436, 1136], [1178, 1136], [1178, 1201 - TOP]);
  WT('fgB015', [845 + HW, 1244], [1122, 1244], [1122, 1212], [1178 - HW, 1212]);
  WT('bp1B030', [1178 + HW, 1190], [1260 - HW, 1190]);
  WT('fgB031', [1260 + HW, 1190], [1345 - HW, 1190]);
  WT('rlB038', [1345 + HW, 1190], [1485 - HW, 1190]);
  WT('lmsB017', [1485 + HW, 1190], [1633 - HW, 1190]);
  WT('lgB016', [1633 + HW, 1190], [2038 - 27, 1190]);
  /* GEN. LOAD to the MSV inlet steam temp */
  W('kOff2', [433, 1329], [1473 - 27, 1329]);
  W('kOff2', [887, 1329], [887, 1403 - TOP]);
  j.push([887, 1329]);
  WT('kLoad', [432, 1392], [589 - HW, 1392]);
  WT('kLoad', [534, 1286], [534, 1456], [589 - HW, 1456]);
  WT('kLoad', [534, 1286], [589 - HW, 1286]);
  j.push([534, 1392]);
  W('cmpB051', [589 + HW, 1286], [695, 1286], [695, 1403 - TOP]);
  WT('fgB034', [589 + HW, 1392], [695 - HW, 1392]);
  WT('fgB054', [589 + HW, 1456], [641, 1456], [641, 1414], [695 - HW, 1414]);
  WT('asw052', [695 + HW, 1392], [887 - HW, 1392]);
  WT('sgB037', [780 + HW, 1414], [887 - HW, 1414]);
  WT('bp1B035', [887 + HW, 1392], [962 - HW, 1392]);
  WT('rlB053', [962 + HW, 1392], [1047 - HW, 1392]);
  WT('lgB040', [1047 + HW, 1392], [1473 - 27, 1392]);
  WT('lgB040', [1099, 1392], [1099, 1446], [1472 - 27, 1446]);
  j.push([1099, 1392]);
  b.push(
    ['tpB014', 'TP', 'B014', 815, 160, ['TP:0.2s']],
    ['fgB041', 'FG', 'B041', xL, 233],
    ['not001', 'NOT', '001', xL, 298],
    ['uckB005', 'UCK', 'B005', xL, 392, ['K:2.8%']],
    ['btr011', 'o:BTR', '011', 621, 468],
    ['sgB009', 'SG', 'B009', xL, 522, ['K:25.0degC']],
    ['uckB013', 'UCK', 'B013', xL, 595, ['K:1000.0%']],
    ['fgB045', 'FG', 'B045', xL, 670],
    ['uckB021', 'UCK', 'B021', xL, 797, ['K:2.8%']],
    ['sgB026', 'SG', 'B026', xL, 872, ['K:25.0degC']],
    ['uckB027', 'UCK', 'B027', xL, 946, ['K:1000.0%']],
    ['a002', 'A', '002', 813, 298],
    ['a018', 'A', '018', 808, 703],
    ['amB003', 'AM', 'B003', xAM, 308, ['R :0.4degC/s', 'M :10', 'HL:700.0degC', 'LL:50.0degC'], { l: ['I', 'D', 'Z'] }, [79, 64]],
    ['amB019', 'AM', 'B019', xAM, 713, ['R :0.4degC/s', 'M :10', 'HL:700.0degC', 'LL:50.0degC'], { l: ['I', 'D', 'Z'] }, [79, 64]],
    ['ftr049', 'o:FTR', '049', 741, 1041],
    ['cmpB050', 'CMP', 'B050', 862, 1052, ['HL:9999.0rpm', 'LL:0.5rpm']],
    ['fgB015', 'FG', 'B015', 845, 1255],
    ['bp1B030', 'BP1', 'B030', 1178, 1201, ['R:1.0']],
    ['fgB031', 'FG', 'B031', 1260, 1201],
    ['rlB038', 'RL', 'B038', 1345, 1201, ['RI:0.1%/S', 'RD:0.01%/S']],
    ['lmsB017', 'LMS', 'B017', 1485, 1201, ['HL:700.0degC', 'LL:0.0degC']],
    ['lgB016', 'LG', 'B016', 1633, 1201, ['T:300.0s']],
    ['btr039', 'o:BTR', '039', 481, 1329],
    ['ftr033', 'o:FTR', '033', 481, 1392],
    ['cmpB051', 'CMP', 'B051', 589, 1297, ['HL:175.0', 'LL:0.0']],
    ['fgB034', 'FG', 'B034', 589, 1403],
    ['fgB054', 'FG', 'B054', 589, 1467],
    ['asw052', 'ASW', '052', 695, 1403],
    ['sgB037', 'SG', 'B037', 780, 1425, ['K:50.0degC']],
    ['bp1B035', 'BP1', 'B035', 887, 1403, ['R:0.033']],
    ['rlB053', 'RL', 'B053', 962, 1403, ['RI:100.0', 'RD:100.0']],
    ['lgB040', 'LG', 'B040', 1047, 1403, ['T:60.0S']],
    ['ftr036', 'o:FTR', '036', 1120, 1446]
  );
  c.push(
    ['iSet', 'in', 'D', 261, 222, '', ['TCE155'], 0, 1],
    ['iComp', 'in', 'B', 259, 287, '', ['TCE152'], 0, 1],
    ['oC', 'out', 'C', 2038, 1190, '', ['-'], 0, 0],
    ['oE', 'out', 'E', 1473, 1329, '', ['-'], 0, 0],
    ['oD', 'out', 'D', 1473, 1392, '', ['-'], 0, 0],
    ['oD1', 'out', 'D1', 1472, 1446, '', ['-'], 1, 0]
  );
  t.push(
    [292, 217, 'CV WARMING (LOWER) SET'],
    [292, 282, 'CV WARMING COMP'],
    [582, 171, '(TCA100)', 1],
    [353, 502, '(TCA103)', 1],
    [604, 1075, '(TCA104)', 1],
    [354, 1427, '(TCA104)', 1],
    [772, 145, 'T'],
    [920, 282, 'T'],
    [916, 687, 'T'],
    [816, 1036, 'T'],
    [1134, 1184, 'T'],
    [1303, 1184, 'T'],
    [1591, 1184, 'T'],
    [545, 1280, 'T'],
    [848, 1386, 'T'],
    [920, 1386, 'T'],
    [1006, 1386, 'T'],
    [1669, 1168, 'HP-T INNER CASING FIRST STG'],
    [1669, 1188, 'INNER WALL METAL TEMP(LOWER)SIM'],
    [1212, 1324, 'BOILER LIGHT OFF SIM'],
    [1146, 1387, 'MSV(L) INLET STEAM TEMP. SIM'],
    [1169, 1441, 'MSV INLET STEAM TEMP. SIM'],
    [222, 1525, 'CONTROLLER:'],
    [384, 1525, 'EHG+MD'],
    [647, 1511, 'TRIGGER  :'],
    [647, 1527, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCE503',
    title: 'SIMULATOR',
    page: 176,
    ctl: 'EHG+MD',
    cycle: 100,
    f: [168, 84, 2220, 1544],
    k: [
      ['kInit', 309, 149, 'INITIAL', 'ref'],
      ['kTrip', 219, 468, 'TURBINE TRIP', 'ref'],
      ['kSpeed', 450, 1041, 'TURBINE SPEED', 'ref'],
      ['kOff', 202, 1136, 'OFF(0)', 'sys.ref'],
      ['k00', 199, 1244, '0.0', 'sys.ref'],
      ['kOff2', 199, 1329, 'OFF(0)', 'sys.ref'],
      ['kLoad', 198, 1392, 'GEN. LOAD', 'ref']
    ],
    c,
    b,
    w,
    j,
    t
  });
})();
