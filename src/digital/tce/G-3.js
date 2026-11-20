/* SH-G-3 AVR, GOVERNOR AND OTHER OPERATION (Generator Protection / Breaker Logic Diagram 310SD03-743 rev 1, sheet 11). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. The switches of the synchronizing panel (SYN) and the push buttons of the DCS HMI: voltage
   and speed raise / lower in 43-25 MANUAL or from the auto synchronizers ASD1 (52G) and ASD2 (52L) to the AVR and the governor (TCS); the manual
   close of 52G and 52L with the 52G / 52L selector, 43-25 MANUAL and the operation location SYN; the open orders 3-52G / 3-52L and the DCS open
   orders; 43-25 AUTO, the auto synchronizer start and the operation location REMOTE out to the breaker sheets (each mark: the signal also goes to
   that panel). */
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
  /* a gate: bar x, centre y, the bar from y1 to y2 */
  const gate = (k, ty, bar, y, y1, y2) => {
    b.push([k, 'G:' + ty, '', bar + 9, y, [], {}, [18, ty === 'OR' ? 18 : 20, 0]]);
    l.push([[bar, y1], [bar, y2]]);
  };
  /* a switch / push button of the panel: [type | name | positions]; each position is a signal [key, word, line] */
  const sw = (x1, x2, d1, d2, y1, y2, ty, nm, hd, P) => {
    l.push([[x1, y1], [x2, y1]], [[x2, y1], [x2, y2]], [[x2, y2], [x1, y2]], [[x1, y2], [x1, y1]], [[d1, y1], [d1, y2]], [[d2, y1], [d2, y2]]);
    t.push([x1, y1 - 9, hd], [(x1 + d1) / 2, (y1 + y2) / 2, ty, 4], [(d1 + d2) / 2, (y1 + y2) / 2, nm, 4]);
    const hh = (y2 - y1) / P.length;
    P.forEach(([k, z], i) => {
      const ya = y1 + hh * i;
      if (i) l.push([[d2, ya], [x2, ya]]);
      t.push([(d2 + x2) / 2, ya + hh / 2, z, 4, z.length > 6 ? 1.75 : 2.05]);
      s.push([k, d2, Math.round(ya), x2, Math.round(ya + hh)]);
    });
  };
  /* a mark that the signal also goes to a panel: x, top / bottom, words, the lines it crosses;
     md 1: the top words over the arrow, md 2: the bottom words under the arrow */
  const mark = (x, y1, y2, z1, z2, X, md) => {
    const P = [y1, ...X.flatMap(y => [y - 6, y + 6]), y2];
    for (let i = 0; i < P.length; i += 2) l.push([[x, P[i]], [x, P[i + 1]]]);
    a.push([[x, y1], [x - 16, y1]], [[x, y2], [x + 16, y2]]);
    t.push(md & 1 ? [x - 12, y1 - 10, z1, 4] : [x - 19, y1 + 4, z1, 2]);
    t.push(md & 2 ? [x + 12, y2 + 14, z2, 4] : [x + 20, y2 + 4, z2]);
  };
  /* the switches of the synchronizing panel and the push buttons of the DCS HMI */
  sw(255, 503, 295, 440, 191, 230, 'CS', 'VOLTAGE CONTROL', '(SYN)', [['vr', 'RAISE'], ['vl', 'LOWER']]);
  sw(254, 502, 293, 438, 413, 453, 'CS', 'SPEED CONTROL', '(SYN)', [['sr', 'RAISE'], ['sl', 'LOWER']]);
  sw(253, 501, 292, 437, 496, 553, 'COS', '52G, 52L SELECTOR', '(SYN)', [['c52g', '52G'], ['c52l', '52L']]);
  sw(252, 500, 291, 437, 589, 648, 'CS', '52G BREAKER', '(SYN)', [['gcl', 'CLOSE'], ['gne', 'NEUTRAL'], ['gop', 'OPEN']]);
  sw(251, 500, 290, 436, 749, 808, 'CS', '52L BREAKER', '(SYN)', [['lcl', 'CLOSE'], ['lne', 'NEUTRAL'], ['lop', 'OPEN']]);
  sw(251, 499, 290, 435, 910, 968, 'COS', '43-25', '(SYN)', [['man', 'MANUAL'], ['off', 'OFF'], ['aut', 'AUTO']]);
  sw(250, 498, 289, 435, 1028, 1059, 'PB', 'AUTO SYN. START', '(SYN)', [['ps', 'ON']]);
  sw(249, 497, 288, 435, 1090, 1129, 'COS', 'OPERATION LOCATION', '(SYN)', [['osy', 'SYN'], ['ore', 'REMOTE']]);
  sw(248, 497, 288, 435, 1181, 1211, 'PB', 'AUTO SYN. START', '(DCS HMI)', [['pd', 'ON']]);
  sw(248, 497, 288, 435, 1243, 1274, 'PB', '52G BREAKER', '(DCS HMI)', [['pg', 'OPEN']]);
  sw(247, 496, 288, 435, 1385, 1416, 'PB', '52L BREAKER', '(DCS HMI)', [['pl', 'OPEN']]);
  /* the DCS HMI field */
  e.push(
    [[232, 1160], [543, 1160]],
    [[543, 1160], [543, 1222]],
    [[543, 1222], [1185, 1222]],
    [[1185, 1222], [1185, 1491]],
    [[1185, 1491], [232, 1491]],
    [[232, 1491], [232, 1160]]
  );
  /* voltage and speed raise / lower in 43-25 MANUAL */
  gate('g1', 'A', 1031, 186, 166, 208);
  gate('g2', 'A', 1030, 295, 274, 315);
  gate('g3', 'A', 1030, 407, 385, 430);
  gate('g4', 'A', 1029, 523, 501, 544);
  w.push(
    ['man', [[499, 920], [1028, 920]]],
    ['man', [[564, 920], [564, 177], [1031, 177]]],
    ['man', [[564, 307], [1030, 307]]],
    ['man', [[564, 390], [1030, 390]]],
    ['man', [[564, 533], [1029, 533]]],
    ['man', [[564, 713], [1029, 713]]],
    ['vr', [[503, 201], [1031, 201]]],
    ['vl', [[503, 220], [849, 220], [849, 280], [1030, 280]]],
    ['sr', [[502, 424], [1030, 424]]],
    ['sl', [[502, 442], [848, 442], [848, 508], [1029, 508]]]
  );
  j.push([564, 307], [564, 390], [564, 533], [564, 713], [564, 920]);
  /* the auto synchronizers into the OR gates */
  [
    [220, 255, '37', '60R'],
    [327, 362, '38', '60L'],
    [440, 477, '39', '15R'],
    [555, 593, '40', '15L']
  ].forEach(([y, y2, n, z]) => {
    [
      [y, '1', '52G', 'SH-G-1B'],
      [y2, '2', '52L', 'SH-G-2B']
    ].forEach(([yy, m, br, sh]) => {
      const k = 'asd' + m + n;
      circ(1352, yy, n);
      s.push([k, 1339, yy - 13, 1365, yy + 13]);
      t.push([1370, yy - 10, 'ASD' + m + '(FOR ' + br + ') "' + z + '"'], [1370, yy + 13, sh]);
      w.push([k, [[1365, yy], [1510, yy]]]);
    });
  });
  gate('or1', 'OR', 1510, 220, 181, 262);
  gate('or2', 'OR', 1510, 327, 289, 368);
  gate('or3', 'OR', 1510, 440, 401, 481);
  gate('or4', 'OR', 1510, 555, 517, 600);
  w.push(
    ['g1', [[1050, 186], [1510, 186]]],
    ['g2', [[1049, 295], [1510, 295]]],
    ['g3', [[1049, 407], [1510, 407]]],
    ['g4', [[1048, 523], [1510, 523]]],
    ['or1', [[1529, 220], [1655, 220]]],
    ['or2', [[1529, 327], [1576, 327], [1576, 261], [1655, 261]]],
    ['or3', [[1529, 440], [1655, 440]]],
    ['or4', [[1529, 555], [1575, 555], [1575, 485], [1655, 485]]]
  );
  /* the AVR and the governor */
  dbox(1632, 170, 1749, 298);
  dbox(1632, 400, 1749, 526);
  t.push([1640, 162, '(AVR)'], [1650, 184, '(AVR)'], [1640, 393, '(TCS)'], [1650, 411, '(GOV)']);
  r.push(['', 1655, 192, 72, 44, ''], ['', 1655, 236, 72, 43, ''], ['', 1655, 419, 72, 45, ''], ['', 1655, 464, 72, 43, '']);
  t.push(
    [1691, 206, 'VOLTAGE', 4],
    [1691, 222, 'RAISE', 4],
    [1691, 250, 'VOLTAGE', 4],
    [1691, 266, 'LOWER', 4],
    [1691, 434, 'SPEED', 4],
    [1691, 450, 'RAISE', 4],
    [1691, 478, 'SPEED', 4],
    [1691, 494, 'LOWER', 4]
  );
  /* the manual close of 52G and 52L */
  gate('g5', 'A', 703, 587, 564, 608);
  gate('g6', 'A', 702, 745, 724, 768);
  gate('g7', 'A', 680, 860, 829, 891);
  gate('g8', 'A', 1029, 730, 692, 776);
  gate('g9', 'A', 1028, 902, 870, 943);
  gate('g10', 'A', 1114, 1003, 982, 1023);
  w.push(
    ['c52g', [[501, 506], [628, 506], [628, 574], [703, 574]]],
    ['gcl', [[500, 599], [703, 599]]],
    ['g5', [[722, 587], [878, 587], [878, 888], [1028, 888]]],
    ['c52l', [[501, 543], [539, 543], [539, 733], [702, 733]]],
    ['lcl', [[500, 759], [702, 759]]],
    ['g6', [[721, 745], [1029, 745]]],
    ['g6', [[761, 745], [761, 818], [609, 818], [609, 843], [680, 843]]],
    ['g7', [[699, 860], [783, 860]]],
    ['osy', [[497, 1100], [599, 1100], [599, 1071], [698, 1071]]],
    ['osy', [[643, 1071], [643, 877], [680, 877]]],
    ['osy', [[643, 1017], [1114, 1017]]],
    ['osy', [[990, 1017], [990, 765], [1029, 765]]],
    ['osy', [[990, 937], [1028, 937]]],
    ['man', [[877, 920], [877, 991], [1114, 991]]],
    ['g10', [[1133, 1003], [1197, 1003]]],
    ['off', [[499, 939], [525, 939], [525, 999], [593, 999]]]
  );
  j.push([761, 745], [643, 1071], [643, 1017], [990, 1017], [990, 937], [877, 920]);
  circ(796, 860, '21', 'SH-G-2B', 813);
  t.push([763, 826, '52L "INITIAL'], [763, 841, 'MANUAL CLOSE"']);
  t.push([1203, 990, 'VT CONNECTION FOR'], [1203, 1004, 'MANUAL SYNCHRO.'], [1203, 1018, '(FOR 52L & 52G)']);
  t.push([603, 988, 'SYN'], [603, 1001, 'FOR'], [603, 1014, 'TEST']);
  /* the auto synchronizer start and the operation location */
  gate('g11', 'A', 698, 1057, 1036, 1079);
  gate('g12', 'A', 697, 1177, 1161, 1197);
  w.push(
    ['ps', [[498, 1045], [698, 1045]]],
    ['ore', [[497, 1119], [934, 1119]]],
    ['ore', [[601, 1119], [601, 1163], [697, 1163]]],
    ['ore', [[781, 1119], [781, 1148], [934, 1148]]],
    ['pd', [[497, 1190], [697, 1190]]],
    ['pg', [[497, 1259], [1077, 1259]]],
    ['pg', [[697, 1259], [697, 1307], [1077, 1307]]],
    ['pl', [[496, 1400], [1077, 1400]]],
    ['pl', [[697, 1400], [697, 1448], [1077, 1448]]]
  );
  j.push([601, 1119], [781, 1119], [697, 1259], [697, 1400]);
  circ(947, 1119, '45', 'SH-G-1B', 965);
  circ(947, 1148, '46', 'SH-G-2B', 965);
  t.push([737, 1108, 'OERATION LOCATION "REMOTE"'], [786, 1131, 'OPERATION LOCATION'], [786, 1143, '"REMOTE"']);
  [
    [1259, '52G', '13', 'SH-G-1A'],
    [1307, '52G', '14', 'SH-G-1A'],
    [1400, '52L', '15', 'SH-G-2A'],
    [1448, '52L', '16', 'SH-G-2A']
  ].forEach(([y, br, n, sh]) => {
    t.push([1062, y - 9, br + ' OPEN ORDER FROM DCS', 2]);
    circ(1090, y, n, sh, 1107);
  });
  /* the outputs to the breaker sheets: [key, line, words, number, sheet] */
  w.push(
    ['gop', [[500, 638], [1955, 638]]],
    ['gop', [[1575, 638], [1575, 671], [1955, 671]]],
    ['g8', [[1048, 730], [1955, 730]]],
    ['lop', [[500, 798], [1955, 798]]],
    ['lop', [[1575, 798], [1575, 827], [1955, 827]]],
    ['g9', [[1047, 902], [1955, 902]]],
    ['aut', [[499, 958], [1955, 958]]],
    ['aut', [[1575, 958], [1575, 988], [1955, 988]]],
    ['g11', [[717, 1057], [1955, 1057]]],
    ['g11', [[1575, 1057], [1575, 1105], [1955, 1105]]],
    ['g12', [[716, 1177], [1955, 1177]]],
    ['g12', [[1575, 1177], [1575, 1225], [1955, 1225]]]
  );
  j.push([1575, 638], [1575, 798], [1575, 958], [1575, 1057], [1575, 1177]);
  [
    [638, '3-52G "OPEN"', '4', 'SH-G-1A'],
    [671, '3-52G "OPEN"', '5', 'SH-G-1A'],
    [730, '52L "MANUAL CLOSE"', '2', 'SH-G-2B'],
    [798, '3-52L "OPEN"', '6', 'SH-G-2A'],
    [827, '3-52L "OPEN"', '7', 'SH-G-2A'],
    [902, '52G "MANUAL CLOSE"', '1', 'SH-G-1B'],
    [958, '43-25 "AUTO" SELECTED', '24', 'SH-G-1B'],
    [988, '43-25 "AUTO" SELECTED', '25', 'SH-G-2B'],
    [1057, 'PB AUTO SYN. "START" FROM SYN', '40', 'SH-G-1B'],
    [1105, 'PB AUTO SYN. "START" FROM SYN', '41', 'SH-G-2B'],
    [1177, 'PB AUTO SYN. "START" FROM DCS', '11', 'SH-G-1B'],
    [1225, 'PB AUTO SYN. "START" FROM DCS', '12', 'SH-G-2B']
  ].forEach(([y, z, n, sh]) => {
    t.push([1936, y - 9, z, 2]);
    circ(1968, y, n, sh, 1986);
  });
  /* the marks: the signal also goes to that panel */
  mark(1159, 162, 546, '(SYN)', '(GCP)', [186, 295, 407, 523], 0);
  mark(1598, 203, 275, '(GCP)', '(AVR)', [220, 261], 3);
  mark(1598, 422, 497, '(GCP)', '(TCS)', [440, 485], 3);
  mark(749, 838, 880, '(SYN)', '(GCP)', [860], 0);
  mark(552, 984, 1010, '(SYN)', '(GCP)', [999], 3);
  mark(1050, 977, 1022, '(SYN)', '(GCP)', [991, 1017], 3);
  mark(561, 1107, 1131, '(SYN)', '(TCS)', [1119], 2);
  mark(583, 1177, 1203, '(DCS)', '(TCS)', [1190], 0);
  mark(802, 1245, 1321, '(DCS)', 'OTHERS', [1259, 1307], 3);
  mark(802, 1388, 1461, '(DCS)', 'OTHERS', [1400, 1448], 3);
  mark(1682, 621, 684, '(SYN)', 'OTHERS', [638, 671], 3);
  mark(1682, 711, 743, '(SYN)', '(GCP)', [730], 0);
  mark(1682, 776, 837, '(SYN)', 'OTHERS', [798, 827], 3);
  mark(1668, 889, 914, '(SYN)', '(GCP)', [902], 0);
  mark(1482, 945, 971, '(SYN)', '(GCP)', [958], 0);
  mark(1682, 1033, 1130, '(SYN)', '(GCP)', [1057, 1105], 3);
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'G-3',
    title: 'AVR, GOVERNOR AND OTHER OPERATION',
    page: 11,
    dwg: '310SD03-743',
    of: 20,
    f: [204, 126, 2177, 1520],
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
