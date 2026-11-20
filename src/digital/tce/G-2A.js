/* SH-G-2A 230kV CIRCUIT BREAKER LOGIC (52L) (1/2) (Generator Protection / Breaker Logic Diagram 310SD03-743 rev 1, sheet 9). Typed from the
   drawing; units = the pixels of the page rendered 2296 wide. The interfaces of the 230 kV breaker 52L (supplied by others): the close order
   and the close permit condition through an AND gate and the closing interlock to CLOSE, the open orders (protection, DCS, synchronizing 3-52L,
   switchyard and transformer protection) through two OR gates to the trip coils TC1 and TC2 through the opening interlock to OPEN; the breaker
   state out to the other sheets, the lamps, the DCS and the panels (each OTHERS mark: the signal goes to that panel). */
(function () {
  if (typeof window === 'undefined') return;
  const o = [],
    s = [],
    b = [],
    r = [],
    w = [],
    t = [],
    l = [],
    e = [],
    a = [],
    j = [];
  /* a dashed outline */
  const dbox = (x1, y1, x2, y2) =>
    e.push([[x1, y1], [x2, y1]], [[x2, y1], [x2, y2]], [[x2, y2], [x1, y2]], [[x1, y2], [x1, y1]]);
  /* a continuation circle: the number in it, the sheet beside it */
  const circ = (x, y, n, sh, sx) => {
    o.push([x, y, 13]);
    t.push([x, y, n, 4]);
    if (sh) t.push([sx, y + 5, sh]);
  };
  /* a mark that the signal also goes to a panel: x, top / bottom of the mark, words, the lines it crosses; rev: the top arrow points right */
  const mark = (x, y1, y2, z1, z2, X, rev) => {
    const P = [y1, ...X.flatMap(y => [y - 6, y + 6]), y2];
    for (let i = 0; i < P.length; i += 2) l.push([[x, P[i]], [x, P[i + 1]]]);
    if (rev) {
      a.push([[x, y1], [x + 18, y1]], [[x, y2], [x - 18, y2]]);
      t.push([x + 21, y1 + 4, z1], [x - 20, y2 + 4, z2, 2]);
    } else {
      a.push([[x, y1], [x - 18, y1]], [[x, y2], [x + 18, y2]]);
      t.push([x - 20, y1 + 4, z1, 2], [x + 21, y2 + 4, z2]);
    }
  };
  /* the inputs from the other sheets: [key, number, sheet, line, words, end of the line] */
  [
    ['i1', '1', 'SH-G-2B', 609, '52L CLOSE ORDER', 1312],
    ['i2', '2', 'SH-G-6B', 713, 'GEN. PROTECTION OPERATED (52L-TC1)', 1312],
    ['i3', '15', 'SH-G-3', 767, '52L OPEN ORDER FROM DCS', 1312],
    ['i4', '6', 'SH-G-3', 818, '3-52L "OPEN"', 1312],
    ['i5', '1', 'SH-G-7', 871, '230kV SWYD., GEN. TRANSF. AND UNIT TRANSF. PROTECTION OPERATED', 1312],
    ['i6', '16', 'SH-G-3', 943, '52L OPEN ORDER FROM DCS', 1312],
    ['i7', '7', 'SH-G-3', 997, '3-52L "OPEN"', 1312],
    ['i8', '2', 'SH-G-7', 1047, '230kV SWYD., GEN. TRANSF. AND UNIT TRANSF. PROTECTION OPERATED', 1312],
    ['i9', '3', 'SH-G-6B', 1101, 'GEN. PROTECTION OPERATED (52L-TC2)', 1312]
  ].forEach(([k, n, sh, y, z, xe]) => {
    circ(270, y, n);
    s.push([k, 257, y - 13, 283, y + 13]);
    t.push([290, y - 7, z], [290, y + 15, sh]);
    w.push([k, [[283, y], [xe, y]]]);
  });
  /* the field of the breaker (supplied by others) and of 52L itself */
  e.push(
    [[1092, 187], [1633, 187]],
    [[1633, 187], [1633, 1296]],
    [[1633, 1296], [1090, 1296]],
    [[1090, 1296], [1090, 1072]],
    [[1090, 1072], [232, 1072]],
    [[232, 1072], [232, 740]],
    [[232, 740], [1092, 740]],
    [[1092, 740], [1092, 187]]
  );
  dbox(1356, 549, 1550, 893);
  t.push([1355, 544, '52L']);
  /* the selector and the close permit condition */
  r.push(['rem', 1147, 212, 97, 38, ''], ['cp', 1147, 353, 97, 52, '']);
  l.push([[1147, 231], [1244, 231]]);
  t.push([1147, 206, '(52L)'], [1195, 221, 'REMOTE', 4], [1195, 240, 'LOCAL', 4], [1151, 368, '52L CLOSE'], [1151, 382, 'PERMIT'], [1151, 396, 'CONDITION']);
  /* the close order with the permit, the closing interlock and CLOSE */
  b.push(['a1', 'G:A', '', 1323, 590, [], {}, [18, 20, 0]]);
  l.push([[1312, 563], [1312, 617]]);
  w.push(['cp', [[1268, 379], [1268, 571], [1312, 571]]], ['a1', [[1332, 590], [1374, 590]]]);
  dbox(1376, 563, 1483, 618);
  t.push([1429, 576, '52L', 4], [1429, 591, 'CLOSING', 4], [1429, 606, 'INTERLOCK', 4]);
  l.push([[1483, 590], [1490, 590]]);
  dbox(1490, 581, 1538, 599);
  s.push(['cl', 1490, 581, 1538, 599]);
  t.push([1514, 590, 'CLOSE', 4]);
  /* the open orders: two OR gates to the trip coils, the opening interlock and OPEN */
  b.push(['or1', 'G:OR', '', 1323, 791, [], {}, [18, 18, 0]], ['or2', 'G:OR', '', 1323, 1021, [], {}, [18, 18, 0]]);
  l.push([[1312, 705], [1312, 880]], [[1312, 935], [1312, 1108]]);
  w.push(['or1', [[1332, 791], [1374, 791]]], ['or2', [[1332, 1021], [1342, 1021], [1342, 818], [1374, 818]]]);
  dbox(1376, 777, 1482, 833);
  l.push([[1406, 777], [1406, 833]], [[1376, 805], [1406, 805]], [[1482, 820], [1490, 820]]);
  t.push([1391, 791, 'TC1', 4], [1391, 819, 'TC2', 4], [1444, 790, '52L', 4], [1444, 805, 'OPENING', 4], [1444, 820, 'INTERLOCK', 4]);
  dbox(1490, 811, 1538, 829);
  s.push(['op', 1490, 811, 1538, 829]);
  t.push([1514, 820, 'OPEN', 4]);
  /* the outputs: [line, words over the line, circle number, sheet] */
  [
    [221, '52L "REMOTE" SELECTED', '45', 'SH-G-2B'],
    [272, '52L "REMOTE" SELECTED', '46', 'SH-G-1B'],
    [379, '52L CLOSE PERMIT CONDITION', '44', 'SH-G-2B'],
    [442, '52L CLOSED', '25', 'SH-G-1B'],
    [484, '52L CLOSED', '43', 'SH-G-2B'],
    [589, '', 'R', ''],
    [620, '', 'G', ''],
    [1045, '', '32', 'SH-G-9']
  ].forEach(([y, z, n, sh]) => {
    if (z) t.push([1945, y - 8, z, 2]);
    circ(1977, y, n, sh, 1994);
  });
  t.push([1945, 1027, '52L OPENED (FOR HOUSE LOAD', 2], [1945, 1039, 'OPERATION)', 2]);
  [
    [525, '(52L CLOSED)', 'ATS'],
    [792, '', 'DCS'],
    [1084, '(52L OPENED)', 'ATS']
  ].forEach(([y, z, n]) => {
    r.push(['', 1966, y - 8, 30, 17, n]);
    if (z) t.push([1935, y - 14, z]);
  });
  t.push([1971, 820, 'INDICATION'], [1971, 846, 'INDICATION']);
  b.push(['nc', 'NC', '', 1820, 819, [], {}, [10]]);
  w.push(
    ['rem', [[1244, 221], [1963, 221]]],
    ['rem', [[1778, 221], [1778, 272], [1963, 272]]],
    ['cp', [[1244, 379], [1963, 379]]],
    ['cl', [[1538, 589], [1963, 589]]],
    ['cl', [[1599, 589], [1599, 484], [1963, 484]]],
    ['cl', [[1788, 484], [1788, 442], [1963, 442]]],
    ['cl', [[1788, 484], [1788, 525], [1964, 525]]],
    ['op', [[1538, 819], [1810, 819]], 0, 0],
    ['nc', [[1830, 819], [1960, 819]]],
    ['op', [[1788, 819], [1788, 792], [1964, 792]]],
    ['op', [[1788, 819], [1788, 843], [1960, 843]]],
    ['op', [[1573, 819], [1573, 620], [1963, 620]]],
    ['op', [[1573, 819], [1573, 1045], [1963, 1045]]],
    ['op', [[1788, 1045], [1788, 1084], [1964, 1084]]]
  );
  j.push([1778, 221], [1268, 379], [1599, 589], [1788, 484], [1573, 819], [1788, 819], [1788, 1045]);
  /* the marks: the signal leaves to that panel */
  mark(1710, 204, 236, 'OTHERS', '(GCP)', [221]);
  mark(1710, 362, 393, 'OTHERS', '(GCP)', [379]);
  mark(1710, 468, 497, 'OTHERS', '(GCP)', [484]);
  mark(1854, 509, 540, '(GCP)', '(TCS)', [525]);
  mark(1710, 574, 634, 'OTHERS', '(SYN)', [589, 620]);
  mark(1710, 805, 833, 'OTHERS', '(TCS)', [819]);
  mark(1890, 775, 806, '(DCS)', '(TCS)', [792], 1);
  mark(1710, 1032, 1059, 'OTHERS', '(TCS)', [1045]);
  /* the notes */
  [
    'NOTE:',
    '1) ACTUAL INTERNAL LOGICS (INTERLOCKS) OF 52L, DS',
    '    AND ES SUPPLIED BY OTHERS ARE NOT INDICATED',
    '    IN THIS PART.',
    '    HOWEVER, THE SIGNAL INTERFACES BETWEEN "52L, DS',
    '    AND ES"AND "TCS, AVR, GCP, GPP"ARE INDICATED',
    '    IN THIS PART.',
    '',
    '2) TC : TRIP COIL OF 52L.',
    '',
    '3) "52L CLOSE PERMIT CONDITION" WILL BE DETERMINED',
    '    LATER BY OTHERS.'
  ].forEach((z, i) => z && t.push([1272, 1126 + 14.6 * i, z]));
  [
    'NOTE:',
    '(1) OTHERS SHOULD PROVIDE 52L WHICH HAVE SAME',
    'CLOSING TIME OF CIRCUIT BREAKER BECAUSE ONE (1)',
    'ASD FURNISHED BY US APPLIES TO 52L.'
  ].forEach((z, i) => t.push([1818, 1230 + 13.5 * i, z]));
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'G-2A',
    title: '230kV CIRCUIT BREAKER LOGIC (52L) (1/2)',
    page: 9,
    dwg: '310SD03-743',
    of: 20,
    f: [208, 122, 2180, 1520],
    fs: 1.2,
    ar: 1,
    o,
    s,
    b,
    r,
    w,
    t,
    l,
    e,
    a,
    j
  });
})();
