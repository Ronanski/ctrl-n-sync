/* TCE501 SIMULATOR(2) (331DM09784 page 174, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. The valve simulators of the EHG controller, as drawn:
   - Four SIMCV blocks (ICV(A) A002, ICV(B) A007, MSV(A) A014, MSV(B) A022; LME271, K 20.0, B 0.00 %, TI 2.0 s, 0-100 %): X1 = the
     POSITION DEMAND, X2 = the real POSITION (each through its FTR), SW = the forced close. Y1 through LMS (-3 to 103 %) = the POSITION
     SIM., Y2 through LMS (-200 to 200 %) = the SERVO AMP OUTPUT SIM.
   - ICV FORCED CLOSE (G of TCE053) through NOT 011, or OFF(0), = OR 012: SW of the two ICV blocks; MSV FORCED CLOSE (H of TCE053, BTR
     018) through NOT 019, or OFF(0), = OR 020: SW of the two MSV blocks.
   - RSV(A): ICV(A) FA (D of TCE227) and CRV(A) TEST (B of TCE226) through TD B035 (2.0 s) = A 034, or TURBINE TRIP (ref, TCE053) =
     OR 026, which switches ASW 028 from SG B027 (0.0) to SG B030 (100.0); RL B029 (10 %/s, INITIAL on its top) = RSV(A) POSITION
     SIM, E1 to TCE132 / TCE133. RSV(B) the same with ICV(B) FA (D of TCE228), CRV(B) TEST (E of TCE226), TD B036, A 037, OR 031,
     ASW 032 and RL B033: E2 to TCE134 / TCE135. INITIAL (ref, TCE050) is also on the tops (C) of TD B035 / B036.
   The words are the ones of the drawing.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const h = 28.76,
    I = cx => cx - h,
    O = cx => cx + h,
    T = cy => cy - 21.57 /* top of a block */,
    k = [],
    c = [],
    m = [],
    b = [],
    w = [],
    j = [],
    t = [];
  /* one SIMCV row: top y, left x of the block, its row number r (0-3) and its words */
  const row = (r, top, X, d, inLetter, inSheet, posSheet, outs, nos, words) => {
    const y1 = top + 31,
      y2 = top + 53,
      yp = top + 94,
      sw = top + 76,
      cx = X + 287 - 2 * r /* LMS */,
      bend = X + 234 - r,
      cxo = 2085 - 2 * r,
      [f1, f2, blk, l1, l2] = nos,
      key = 'sim' + r;
    c.push(
      ['iD' + r, 'in', inLetter, 308 - 3 * r, y1, '', [inSheet]],
      ['iP' + r, 'in', 'P', 306 - 3 * r, yp, '', [posSheet]],
      ['oY1' + r, 'out', outs[0], cxo, y1, '', outs[1]],
      ['oY2' + r, 'out', outs[2], cxo - 1, y1 + 107, '', ['-']]
    );
    m.push([key, 'SIMCV', '', X, top, 86, 106, ['X1', 'X2', 'SW'], ['Y1', 'Y2'], blk,
      [[X + 4, top + 162, 'K :20.0'], [X + 4, top + 183, 'B :0.00%'], [X + 4, top + 204, 'TI:2.0S'], [X + 4, top + 226, 'HL:100.0%'], [X + 4, top + 247, 'LL:0.0%']],
      [[y1, y2, sw], [y1, y2]]]);
    b.push(
      ['ftr' + f1, 'o:FTR', f1, 906 - 3 * r, y1],
      ['ftr' + f2, 'o:FTR', f2, 906 - 3 * r, yp],
      ['lms' + l1, 'LMS', l1, cx, y1 + 11, ['HL:103.0%', 'LL:-3.0%']],
      ['lms' + l2, 'LMS', l2, cx - 1, y1 + 118, ['HL:200.0%', 'LL:-200.0%']]
    );
    w.push(
      ['iD' + r, [[308 - 3 * r + 27, y1], [X, y1]], 1],
      ['iP' + r, [[306 - 3 * r + 27, yp], [X - 85, yp], [X - 85, y2], [X, y2]], 1],
      [key + '.Y1', [[X + 86, y1], [I(cx), y1]], 1],
      [key + '.Y2', [[X + 86, y2], [bend, y2], [bend, y1 + 107], [I(cx - 1), y1 + 107]], 1],
      ['lms' + l1, [[O(cx), y1], [cxo - 27, y1]], 1],
      ['lms' + l2, [[O(cx - 1), y1 + 107], [cxo - 28, y1 + 107]], 1]
    );
    t.push(
      [308 - 3 * r + 33, y1 - 6, words[0]],
      [306 - 3 * r + 33, yp - 6, words[1]],
      [1693 - 3 * r, y1 - 5, words[2]],
      [1693 - 3 * r, y1 + 102, words[3]],
      [X + 43, top + 134, '(LME271)', 1]
    );
  };
  row(0, 127, 1086, 0, 'A', 'TCE214', 'TCE129', ['C1', ['TCE128', 'TCE129'], 'C2'], ['001', '004', 'A002', 'B003', 'B005'],
    ['ICV(A) POSITION DEMAND', 'ICV(A) POSITION', 'ICV(A) POSITION SIM.', 'ICV(A) SERVO AMP OUTPUT SIM.']);
  row(1, 394, 1083, 0, 'B', 'TCE214', 'TCE131', ['D1', ['TCE130', 'TCE131'], 'D2'], ['006', '009', 'A007', 'B008', 'B010'],
    ['ICV(B) POSITION DEMAND', 'ICV(B) POSITION', 'ICV(B) POSITION SIM.', 'ICV(B) SERVO AMP OUTPUT SIM.']);
  row(2, 660, 1080, 0, 'A', 'TCE210', 'TCE121', ['A1', ['TCE120', 'TCE121'], 'A2'], ['013', '016', 'A014', 'B015', 'B017'],
    ['MSV(A) POSITION DEMAND', 'MSV(A) POSITION', 'MSV(A) POSITION SIM.', 'MSV(A) SERVO AMP OUTPUT SIM.']);
  row(3, 926, 1076, 0, 'A', 'TCE211', 'TCE123', ['B1', ['TCE122', 'TCE123'], 'B2'], ['021', '024', 'A022', 'B023', 'B025'],
    ['MSV(B) POSITION DEMAND', 'MSV(B) POSITION', 'MSV(B) POSITION SIM.', 'MSV(B) SERVO AMP OUTPUT SIM.']);
  /* the forced closes */
  k.push(['kOff', 431, 892, 'OFF(0)', 'sys.ref'], ['kInit', 257, 1082, 'INITIAL', 'ref'], ['kTrip', 257, 1158, 'TURBINE TRIP', 'ref']);
  c.push(
    ['iIcvFc', 'in', 'G', 299, 563, '', ['TCE053']],
    ['iMsvFc', 'in', 'H', 297, 839, '', ['TCE053']],
    ['iFaA', 'in', 'D', 294, 1221, '', ['TCE227']],
    ['iCrvA', 'in', 'B', 292, 1263, '', ['TCE226']],
    ['iCrvB', 'in', 'E', 291, 1348, '', ['TCE226']],
    ['iFaB', 'in', 'D', 291, 1423, '', ['TCE228']],
    ['oE1', 'out', 'E1', 1370, 1254, '', ['TCE132', 'TCE133']],
    ['oE2', 'out', 'E2', 1368, 1435, '', ['TCE134', 'TCE135']]
  );
  b.push(
    ['not011', 'NOT', '011', 781.5, 574],
    ['or012', 'OR', '012', 964, 574],
    ['btr018', 'o:BTR', '018', 673, 839],
    ['not019', 'NOT', '019', 778.5, 850],
    ['or020', 'OR', '020', 961, 850],
    /* RSV simulators */
    ['tdB035', 'TD', 'B035', 615, 1274, ['TD:2.0S']],
    ['and034', 'A', '034', 700, 1232],
    ['or026', 'OR', '026', 796.5, 1169],
    ['sgB027', 'SG', 'B027', 796, 1264.5, ['K:0.0']],
    ['sgB030', 'SG', 'B030', 794.5, 1339, ['K:100.0']],
    ['asw028', 'ASW', '028', 946, 1264.5],
    ['rlB029', 'RL', 'B029', 1062.5, 1265, ['RI:10.0%/S', 'RD:10.0%/S']],
    ['tdB036', 'TD', 'B036', 613.5, 1359, ['TD:2.0S']],
    ['and037', 'A', '037', 698, 1434],
    ['or031', 'OR', '031', 793, 1412],
    ['asw032', 'ASW', '032', 943.5, 1445.5],
    ['rlB033', 'RL', 'B033', 1060.5, 1446, ['RI:10.0%/S', 'RD:10.0%/S']]
  );
  w.push(
    ['iIcvFc', [[326, 563], [I(781.5), 563]]],
    ['not011', [[O(781.5), 563], [I(964), 563]]],
    ['kOff', [[667, 892], [853, 892], [853, 585], [I(964), 585]]],
    ['kOff', [[853, 861], [I(961), 861]]],
    ['or012', [[O(964), 563], [1017, 563], [1017, 203], [1086, 203]]],
    ['or012', [[1017, 470], [1083, 470]]],
    ['iMsvFc', [[324, 839], [I(778.5), 839]]],
    ['not019', [[O(778.5), 839], [I(961), 839]]],
    ['or020', [[O(961), 839], [1013, 839], [1013, 736], [1080, 736]]],
    ['or020', [[1013, 839], [1013, 1002], [1076, 1002]]],
    /* RSV(A) */
    ['iFaA', [[321, 1221], [I(700), 1221]]],
    ['iCrvA', [[319, 1263], [I(615), 1263]]],
    ['tdB035', [[O(615), 1263], [657, 1263], [657, 1243], [I(700), 1243]]],
    ['and034', [[O(700), 1221], [756, 1221], [756, 1180], [I(796.5), 1180]]],
    ['kTrip', [[494, 1158], [I(796.5), 1158]]],
    ['kTrip', [[743, 1158], [743, 1401], [I(793), 1401]]],
    ['or026', [[O(796.5), 1158], [948, 1158], [948, T(1264.5)]]],
    ['sgB027', [[O(796), 1253.5], [I(946), 1253.5]], 1],
    ['sgB027', [[870, 1253.5], [870, 1434.5], [I(943.5), 1434.5]], 1],
    ['sgB030', [[O(794.5), 1328], [892, 1328], [892, 1275.5], [I(946), 1275.5]], 1],
    ['sgB030', [[847.5, 1328], [847.5, 1456.5], [I(943.5), 1456.5]], 1],
    ['asw028', [[O(946), 1253.5], [I(1062.5), 1253.5]], 1],
    ['rlB029', [[O(1062.5), 1253.5], [1343, 1253.5]], 1],
    /* RSV(B) */
    ['iCrvB', [[318, 1348], [I(613.5), 1348]]],
    ['tdB036', [[O(613.5), 1348], [656, 1348], [656, 1445], [I(698), 1445]]],
    ['iFaB', [[318, 1423], [I(698), 1423]]],
    ['and037', [[O(698), 1423], [I(793), 1423]]],
    ['or031', [[O(793), 1401], [945.5, 1401], [945.5, T(1445.5)]]],
    ['asw032', [[O(943.5), 1434.5], [I(1060.5), 1434.5]], 1],
    ['rlB033', [[O(1060.5), 1434.5], [1341, 1434.5]], 1],
    /* INITIAL */
    ['kInit', [[494.5, 1082], [1063, 1082], [1063, T(1265)]]],
    ['kInit', [[1011, 1082], [1011, 1404], [1061, 1404], [1061, T(1446)]]],
    ['kInit', [[564, 1082], [564, 1241], [615, 1241], [615, T(1274)]]],
    ['kInit', [[564, 1241], [564, 1326], [613.5, 1326], [613.5, T(1359)]]]
  );
  j.push([853, 861], [1017, 470], [1013, 839], [743, 1158], [870, 1253.5], [847.5, 1328], [1011, 1082], [564, 1082], [564, 1241]);
  t.push(
    [335, 559, 'ICV FORCED CLOSE'],
    [330, 834, 'MSV FORCED CLOSE'],
    [325, 1215, 'ICV(A) FA'],
    [325, 1258, 'CRV(A) TEST'],
    [324, 1343, 'CRV(B) TEST'],
    [322, 1418, 'ICV(B) FA'],
    [434, 1116, '(TCE050)', 1],
    [434, 1190, '(TCE053)', 1],
    [571, 1259, 'C', 1],
    [571, 1345, 'C', 1],
    [1019, 1250, 'T', 1],
    [1017, 1431, 'T', 1],
    [1129, 1252, 'RSV(A) POSITION SIM'],
    [1127, 1433, 'RSV(B) POSITION SIM'],
    [227, 1524, 'CONTROLLER:'],
    [387, 1524, 'EHG+MD'],
    [650, 1500, 'TRIGGER  :'],
    [650, 1526, 'CYCLE(ms):30']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({ id: 'TCE501', title: 'SIMULATOR(2)', page: 174, ctl: 'EHG+MD', cycle: 30, f: [178, 86, 2226, 1540], k, c, m, b, w, j, t });
})();
