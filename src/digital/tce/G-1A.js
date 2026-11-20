/* SH-G-1A GENERATOR CIRCUIT BREAKER LOGIC (52G) (1/2) (Generator Protection / Breaker Logic Diagram 310SD03-743 rev 1, sheet 7). Typed from the
   drawing; units = the pixels of the page rendered 2296 wide. The interfaces of the generator breaker 52G (inside the GMCB, supplied by others): the
   close order through the closing interlock to CLOSE, the open orders (protection, DCS, synchronizing 3-52G, transformer protection) through two OR
   gates to the trip coils TC1 and TC2 through the opening interlock to OPEN; the breaker state out to the other sheets, the lamps and the panels
   (each OTHERS mark: the signal goes to that panel). The pen notes written on the print are not part of the drawing. */
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
  /* the inputs from the other sheets: [key, number, sheet, line, words, end of the line] */
  [
    ['i1', '1', 'SH-G-1B', 595, '52G CLOSE ORDER', 1372],
    ['i2', '2', 'SH-G-5B', 717, 'GEN. PROTECTION OPERATED (52G-TC1)', 1310],
    ['i3', '13', 'SH-G-3', 768, '52G OPEN ORDER FROM DCS', 1310],
    ['i4', '4', 'SH-G-3', 820, '3-52G "OPEN"', 1310],
    ['i5', '3', 'SH-G-7', 873, 'GEN. TRANSF. AND UNIT TRANSF. PROTECTION OPERATED (FOR 52G-TC1)', 1310],
    ['i6', '14', 'SH-G-3', 945, '52G OPEN ORDER FROM DCS', 1310],
    ['i7', '5', 'SH-G-3', 998, '3-52G "OPEN"', 1310],
    ['i8', '4', 'SH-G-7', 1050, 'GEN. TRANSF. AND UNIT TRANSF. PROTECTION OPERATED (FOR 52G-TC2)', 1310],
    ['i9', '3', 'SH-G-5B', 1105, 'GEN. PROTECTION OPERATED (52G-TC2)', 1310]
  ].forEach(([k, n, sh, y, z, xe]) => {
    circ(268, y, n);
    s.push([k, 255, y - 13, 281, y + 13]);
    t.push([288, y - 7, z], [288, y + 17, sh]);
    w.push([k, [[281, y], [xe, y]]]);
  });
  /* the field of the breaker (GMCB) and of 52G itself */
  e.push(
    [[1090, 180], [1632, 180]],
    [[1632, 180], [1632, 1298]],
    [[1632, 1298], [1090, 1298]],
    [[1090, 1298], [1090, 1078]],
    [[1090, 1078], [243, 1078]],
    [[243, 1078], [243, 745]],
    [[243, 745], [1090, 745]],
    [[1090, 745], [1090, 180]]
  );
  t.push([1580, 193, '(GMCB)']);
  dbox(1356, 550, 1548, 895);
  t.push([1354, 546, '52G']);
  /* the selector, the earthing switch and the disconnecting switch */
  r.push(['rem', 1145, 212, 97, 39, ''], ['es', 1145, 268, 97, 28, 'ES OPENED'], ['ds', 1145, 371, 97, 18, 'DS CLOSED']);
  l.push([[1145, 231], [1242, 231]]);
  t.push([1145, 207, '(52G)'], [1193, 222, 'REMOTE', 4], [1193, 241, 'LOCAL', 4]);
  /* the closing interlock and CLOSE */
  dbox(1375, 563, 1480, 618);
  t.push([1427, 576, '52G', 4], [1427, 591, 'CLOSING', 4], [1427, 606, 'INTERLOCK', 4]);
  l.push([[1480, 590], [1490, 590]]);
  dbox(1490, 581, 1535, 599);
  s.push(['cl', 1490, 581, 1535, 599]);
  t.push([1512, 590, 'CLOSE', 4]);
  /* the open orders: two OR gates to the trip coils, the opening interlock and OPEN */
  b.push(['or1', 'G:OR', '', 1322, 793, [], {}, [20, 20, 172]], ['or2', 'G:OR', '', 1322, 1023, [], {}, [20, 20, 172]]);
  w.push(['or1', [[1332, 793], [1373, 793]]], ['or2', [[1332, 1023], [1342, 1023], [1342, 820], [1373, 820]]]);
  dbox(1375, 778, 1480, 835);
  l.push([[1405, 778], [1405, 835]], [[1375, 806], [1405, 806]], [[1480, 820], [1488, 820]]);
  t.push([1390, 793, 'TC1', 4], [1390, 820, 'TC2', 4], [1443, 790, '52G', 4], [1443, 806, 'OPENING', 4], [1443, 822, 'INTERLOCK', 4]);
  dbox(1488, 812, 1538, 830);
  s.push(['op', 1488, 812, 1538, 830]);
  t.push([1513, 821, 'OPEN', 4]);
  /* earthing switch opened and 52G open */
  b.push(['a1', 'G:A', '', 1451, 300, [], {}, [18, 20, 46]]);
  w.push(['es', [[1242, 281], [1440, 281]]], ['op', [[1570, 820], [1570, 359], [1390, 359], [1390, 320], [1440, 320]]]);
  /* the outputs: [line, words over the line, circle number, sheet] */
  [
    [222, '52G "REMOTE" SELECTED', '45', 'SH-G-1B'],
    [298, 'ES AND 52G OPEN', '14', 'SH-G-4'],
    [444, '52G CLOSED', '2', 'SH-G-8A'],
    [476, '', '5', 'SH-G-9'],
    [514, '52G CLOSED', '3', 'SH-G-5A'],
    [546, '52G CLOSED', '1', 'SH-G-6A'],
    [590, '', 'R', ''],
    [622, '', 'G', ''],
    [675, '52G CLOSED', '4', 'SH-G-4'],
    [717, '52G CLOSED', '24', 'SH-G-2B'],
    [748, '52G CLOSED', '44', 'SH-G-1B'],
    [930, '52G OPENED', '8', 'SH-G-8A'],
    [982, '52G OPENED', '1', 'SH-G-9']
  ].forEach(([y, z, n, sh]) => {
    if (z) t.push([1945, y - 7, z, 2]);
    circ(1977, y, n, sh, 1994);
  });
  t.push([1945, 460, '52G CLOSED (FOR HOUSE', 2], [1945, 473, 'LOAD OPERATION)', 2]);
  /* the ATS of the turbine and the indications */
  [
    [378, '(DS CLOSED)'],
    [416, '(52G CLOSED)'],
    [890, '(52G OPENED)']
  ].forEach(([y, z]) => {
    r.push(['', 1965, y - 8, 30, 17, 'ATS']);
    t.push([1963, y - 13, z]);
  });
  t.push([1945, 813, '52G CLOSED', 2], [1970, 824, 'INDICATION'], [1945, 838, '52G OPENED', 2], [1970, 849, 'INDICATION']);
  b.push(['nc', 'NC', '', 1818, 820, [], {}, [11]]);
  w.push(
    ['rem', [[1242, 222], [1963, 222]]],
    ['a1', [[1460, 300], [1963, 300]]],
    ['ds', [[1242, 378], [1963, 378]]],
    ['cl', [[1535, 590], [1963, 590]]],
    ['cl', [[1597, 590], [1597, 444], [1963, 444]]],
    ['cl', [[1787, 444], [1787, 416], [1963, 416]]],
    ['cl', [[1787, 444], [1787, 476], [1963, 476]]],
    ['cl', [[1597, 514], [1963, 514]]],
    ['cl', [[1597, 546], [1963, 546]]],
    ['cl', [[1597, 590], [1597, 675], [1963, 675]]],
    ['cl', [[1597, 675], [1597, 717], [1963, 717]]],
    ['cl', [[1787, 717], [1787, 748], [1963, 748]]],
    ['op', [[1538, 820], [1807, 820]], 0, 0],
    ['nc', [[1829, 820], [1963, 820]]],
    ['op', [[1570, 622], [1963, 622]]],
    ['op', [[1787, 820], [1787, 845], [1963, 845]]],
    ['op', [[1787, 845], [1787, 890], [1963, 890]]],
    ['op', [[1787, 890], [1787, 930], [1963, 930]]],
    ['op', [[1787, 930], [1787, 982], [1963, 982]]]
  );
  j.push([1570, 820], [1570, 622], [1597, 590], [1597, 514], [1597, 546], [1597, 675], [1787, 444], [1787, 717], [1787, 820], [1787, 845], [1787, 890], [1787, 930]);
  /* OTHERS marks: the signal leaves the breaker to that panel ([top, bottom, panel, the lines it crosses]) */
  [
    [204, 236, 'GCP', [222]],
    [286, 315, 'AVR', [300]],
    [363, 393, 'TCS', [378]],
    [428, 460, 'TCS', [444]],
    [497, 561, 'GPP', [514, 546]],
    [574, 633, 'SYN', [590, 622]],
    [658, 688, 'AVR', [675]],
    [703, 735, 'GCP', [717]],
    [805, 833, 'TCS', [820]]
  ].forEach(([y1, y2, z, X]) => {
    const P = [y1, ...X.flatMap(y => [y - 6, y + 6]), y2];
    for (let i = 0; i < P.length; i += 2) l.push([[1708, P[i]], [1708, P[i + 1]]]);
    a.push([[1708, y1], [1690, y1]], [[1708, y2], [1727, y2]]);
    t.push([1640, y1 + 4, 'OTHERS'], [1731, y2 + 5, '(' + z + ')']);
  });
  /* the notes */
  [
    'NOTE:',
    '1) ACTUAL INTERNAL LOGICS (INTERLOCKS) OF 52G, DS',
    '    AND ES SUPPLIED BY OTHERS ARE NOT INDICATED',
    '    IN THIS PART.',
    '    HOWEVER, THE SIGNAL INTERFACES BETWEEN "52G, DS',
    '    AND ES"AND "TCS, AVR, GCP, GPP"ARE INDICATED',
    '    IN THIS PART.',
    '',
    '2) TC : TRIP COIL OF 52G.'
  ].forEach((z, i) => z && t.push([1272, 1129 + 15.5 * i, z]));
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'G-1A',
    title: 'GENERATOR CIRCUIT BREAKER LOGIC (52G) (1/2)',
    page: 7,
    dwg: '310SD03-743',
    of: 20,
    f: [205, 120, 2177, 1522],
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
