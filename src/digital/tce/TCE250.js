/* TCE250 MAIN STOP VALVE FULL CLOSE(TA-6) (331DM09784 page 153, controller EHG+MD, cycle 10 ms). Typed from the drawing; units =
   the pixels of the page rendered 2296 wide, the scan skew taken out. TURBINE TRIP (MSV,RSV,ICV CLOSE) = A003 of A002 (MSV(A) and
   MSV(B) FULL CLOSE) and A006 (OR005 RSV(A) or ICV(A) FULL CLOSE, and OR008 RSV(B) or ICV(B) FULL CLOSE); A006 alone is the BOILER
   REHEATER PROTECTION (B). ELECTRICAL TRIP = OR001 of TCMS MAJOR TROUBLE and the TURBINE TRIP; OR021 adds GEN.CB OPEN for A1.
   HP-CV FULL CLOSE (BOTH(A) & (B)) = A010 of CV(A) and CV(B) FULL CLOSE; OR016 of the MSV FULL CLOSE (A002), TCMS MAJOR TROUBLE and
   A010 is the BOILER REHEATER PROTECTION (C, C1). HOUSE LOAD OPERATION (D) = A019 of TP A018 (A017 of ICV(A), ICV(B), CV(A) and CV(B)
   FULL CLOSE, TP 3.0 s, reset by INITIAL) and 52G CLOSE; HOUSE LOAD OPERATION (F, F1) = A020 of 52G CLOSE and 52L OPEN. */
(typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
  id: 'TCE250',
  title: 'MAIN STOP VALVE FULL CLOSE(TA-6)',
  page: 153,
  ctl: 'EHG+MD',
  cycle: 10,
  f: [166, 80, 2216, 1542],
  k: [
    ['kInit', 228.5, 882, 'INITIAL', 'ref'],
    ['k52g', 230, 1169, '52G CLOSE', 'ref']
  ],
  c: [
    ['iCb', 'in', 'A1', 266, 149, 'GEN.CB OPEN', ['TCA587'], 1],
    ['iTcms', 'in', '-', 266, 212.5, 'TCMS MAJOR TROUBLE', ['-'], 1],
    ['iMa', 'in', 'A3', 266, 287, 'MSV(A) FULL CLOSE', ['TCE220']],
    ['iMb', 'in', 'B3', 266, 361.5, 'MSV(B) FULL CLOSE', ['TCE220']],
    ['iRa', 'in', 'G1', 266, 426, 'RSV(A) FULL CLOSE', ['TCE226']],
    ['iIa', 'in', 'A2', 266, 501, 'ICV(A) FULL CLOSE', ['TCE227']],
    ['iRb', 'in', 'G2', 266, 575, 'RSV(B) FULL CLOSE', ['TCE226']],
    ['iIb', 'in', 'A2', 266, 650.5, 'ICV(B) FULL CLOSE', ['TCE228']],
    ['iCa', 'in', 'A2', 266, 724.5, 'CV(A) FULL CLOSE', ['TCE222']],
    ['iCbv', 'in', 'B2', 266, 798.5, 'CV(B) FULL CLOSE', ['TCE222']],
    ['i52l', 'in', 'A10', 303, 1309.5, '52L OPEN', ['TCE041']],
    ['oA1', 'out', 'A1', 2108, 127, '', ['TCP1601', 'TCP2601', 'TCP3601'], 1],
    ['oA', 'out', 'A', 2108, 212.5, 'ELECTRICAL TRIP', ['-']],
    ['oG', 'out', 'G', 2108, 320, '', ['TCE601']] /* name (texts) */,
    ['oB', 'out', 'B', 2108, 426, 'BOILER REHEATER PROTECTION', ['TCE600', 'TCE602']],
    ['oC1', 'out', 'C1', 2108, 629, '', ['-'], 1],
    ['oC', 'out', 'C', 2108, 682.5, 'BOILER REHEATER PROTECTION', ['TCE600', 'TCE602']],
    ['oH', 'out', 'H', 2108, 788.5, '', ['TCE601']] /* name (texts) */,
    ['oD', 'out', 'D', 2108, 958, 'HOUSE LOAD OPERATION', ['TCE601']],
    ['oE', 'out', 'E', 2108, 1171, 'GEN.CIRCUIT BREAKER CLOSED', ['-']],
    ['oF1', 'out', 'F1', 2108, 1236, '', ['TCA511', 'TCA826'], 1],
    ['oF', 'out', 'F', 2108, 1287.5, '', ['TCE053', 'TCE182', 'TCE170', 'TCE172']] /* name (text) */
  ],
  b: [
    ['or021', 'OR', '021', 1853.5, 135],
    ['or001', 'OR', '001', 1502, 220.5],
    ['a002', 'A', '002', 991, 295],
    ['a003', 'A', '003', 1161, 295],
    ['or005', 'OR', '005', 819, 434],
    ['a006', 'A', '006', 991, 434],
    ['or008', 'OR', '008', 819, 583],
    ['or016', 'OR', '016', 1502, 700.5, [], {}, [59, 64]],
    ['a010', 'A', '010', 819, 732.5],
    ['a017', 'A', '017', 993, 987, [], {}, [59, 86]],
    ['tp018', 'TP', 'A018', 1152, 966, ['TP:3.0s']],
    ['a019', 'A', '019', 1502, 966],
    ['btr015', 'o:BTR', '015', 1163.5, 1168],
    ['a020', 'A', '020', 1142, 1295.5]
  ],
  w: [
    /* trips */
    ['iCb', [[293, 146], [1824.5, 146]]],
    ['iTcms', [[293, 209.5], [1473, 209.5]]],
    ['iTcms', [[1365, 209.5], [1365, 700.5], [1472.5, 700.5]]],
    ['iMa', [[293, 284], [962, 284]]],
    ['iMb', [[293, 358.5], [938, 358.5], [938, 306], [962, 306]]],
    ['a002', [[1020, 284], [1132, 284]]],
    ['a002', [[1066, 284], [1066, 679.5], [1472.5, 679.5]]],
    ['a003', [[1190, 284], [1438.5, 284], [1438.5, 231.5], [1473, 231.5]]],
    ['a003', [[1438.5, 284], [1438.5, 317], [2081, 317]]],
    ['or001', [[1531, 209.5], [2081, 209.5]]],
    ['or001', [[1736, 209.5], [1736, 124], [1824.5, 124]]],
    ['or021', [[1882.5, 124], [2081, 124]]],
    /* reheater protection */
    ['iRa', [[293, 423], [790, 423]]],
    ['iIa', [[293, 498], [755, 498], [755, 445], [790, 445]]],
    ['or005', [[848, 423], [962, 423]]],
    ['iRb', [[293, 572], [790, 572]]],
    ['iIb', [[293, 647.5], [756, 647.5], [756, 594], [790, 594]]],
    ['or008', [[848, 572], [927.5, 572], [927.5, 445], [962, 445]]],
    ['a006', [[1020, 423], [2081, 423]]],
    ['a006', [[1098, 423], [1098, 306], [1132, 306]]],
    ['iCa', [[293, 721.5], [790, 721.5]]],
    ['iCbv', [[293, 795.5], [756.5, 795.5], [756.5, 743.5], [790, 743.5]]],
    ['a010', [[848, 721.5], [1472.5, 721.5]]],
    ['a010', [[1365, 721.5], [1365, 785.5], [2081, 785.5]]],
    ['or016', [[1531.5, 679.5], [2081, 679.5]]],
    ['or016', [[1704, 679.5], [1704, 626], [2081, 626]]],
    /* house load operation */
    ['iIa', [[725, 498], [725, 955], [963.5, 955]]],
    ['iIb', [[705, 647.5], [705, 976.5], [963.5, 976.5]]],
    ['iCa', [[684, 721.5], [684, 998], [963.5, 998]]],
    ['iCbv', [[664, 795.5], [664, 1019.5], [963.5, 1019.5]]],
    ['kInit', [[463.5, 881], [1152, 881], [1152, 945]]],
    ['a017', [[1022.5, 955], [1123, 955]]],
    ['tp018', [[1181, 955], [1473, 955]]],
    ['a019', [[1531, 955], [2081, 955]]],
    ['k52g', [[465, 1168], [2081, 1168]]],
    ['k52g', [[1440, 1168], [1440, 977], [1473, 977]]],
    ['k52g', [[920, 1168], [920, 1284.5], [1113, 1284.5]]],
    ['i52l', [[330, 1306.5], [1113, 1306.5]]],
    ['a020', [[1171, 1284.5], [2081, 1284.5]]],
    ['a020', [[1534, 1284.5], [1534, 1233], [2081, 1233]]]
  ],
  t: [
    [1792, 286, 'TURBINE TRIP'],
    [1792, 307, '(MSV,RSV,ICV CLOSE)'],
    [1792, 754.5, 'HP-CV FULL CLOSE'],
    [1792, 775.5, '(BOTH(A) & (B))'],
    [1252, 1274.5, 'HOUSE LOAD OPERATION'],
    [1108.5, 947.5, 'C'],
    [252, 1526, 'CONTROLLER:'],
    [413, 1526, 'EHG+MD'],
    [659, 1499, 'TRIGGER  :'],
    [659, 1525, 'CYCLE(ms):10']
  ]
});
