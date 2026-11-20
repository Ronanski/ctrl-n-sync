/* SH-G-1B GENERATOR CIRCUIT BREAKER LOGIC (52G) (2/2) (Generator Protection / Breaker Logic Diagram 310SD03-743 rev 1, sheet 8). Typed from the
   drawing; units = the pixels of the page rendered 2296 wide. The close order of the generator breaker 52G: the permissives (protections not
   operated, 41 / 52L closed, 52G not closed for 3 s, voltage established) build "52G READY TO SYNCHRONIZE", the VT connections and, with the
   auto synchronizer start (SYN or DCS, or the TCS/ATS close order in REMOTE), the 25X1 relay of the GCP; the auto synchronizer ASD1 (GCP) gives
   the 25A close pulse (AUTO with 43-25 in AUTO) and the raise / lower pulses (60R / 60L voltage, 15R / 15L speed); a manual close or the auto
   close, in 52G REMOTE, is the 52G CLOSE ORDER to SH-G-1A. The revision cloud of the print is not part of the logic. */
(function () {
  if (typeof window === 'undefined') return;
  const o = [],
    s = [],
    b = [],
    r = [],
    w = [],
    t = [],
    l = [],
    a = [],
    j = [];
  /* a continuation circle: the number in it, the sheet beside it */
  const circ = (x, y, n, sh, sx) => {
    o.push([x, y, 13]);
    t.push([x, y, n, 4]);
    if (sh) t.push([sx, y + 5, sh]);
  };
  /* an output to another sheet: line, circle number, sheet, words over the line */
  const out = (y, n, sh, z) => {
    circ(1972, y, n, sh, 1990);
    if (z) t.push([1940, y - 9, z, 2]);
  };
  /* a gate of the drawing: its box, and its input edge (bar) from y1 to y2 as the drawing has it (not always even about the box) */
  const gate = (k, ty, bar, y, y1, y2) => {
    b.push([k, 'G:' + ty, '', bar + 9, y, [], {}, [18, ty === 'OR' ? 18 : 20, 0]]);
    l.push([[bar, y1], [bar, y2]]);
  };
  /* a box with its words (left part, right part at the divider) */
  const box = (k, x, y, ww, dv, z1, z2) => {
    r.push([k, x, y - 9, ww, 19, '']);
    l.push([[dv, y - 9], [dv, y + 10]]);
    t.push([(x + dv) / 2, y, z1, 4, z1.length > 8 ? 1.75 : 2.05], [(dv + x + ww) / 2, y, z2, 4]);
  };
  /* a delay timer: DI over its time */
  const di = (k, x, y, tm) => {
    r.push([k, x, y - 12, 34, 24, '']);
    t.push([x + 17, y - 5, 'DI', 4], [x + 17, y + 6, tm, 4]);
  };
  /* a mark that the signal also goes to a panel: x, top (left arrow), bottom (right arrow), words, the line it crosses */
  const mark = (x, y1, y2, z1, z2, yc) => {
    l.push([[x, y1], [x, yc - 6]], [[x, yc + 6], [x, y2]]);
    a.push([[x, y1], [x - 16, y1]], [[x, y2], [x + 16, y2]]);
    t.push([x - 18, y1 + 4, z1, 2], [x + 19, y2 + 4, z2]);
  };
  /* the inputs from the other sheets: [key, number, sheet, line, [words], end of the line] */
  [
    ['i45', '45', 'SH-G-1A', 173, ['52G "REMOTE" SELECTED'], 1581],
    ['i46', '46', 'SH-G-2A', 220, ['52L "REMOTE" SELECTED'], 909],
    ['i24', '24', 'SH-G-3', 327, ['43-25 "AUTO" SELECTED'], 1322],
    ['i3a', '3', 'SH-G-5A', 432, ['GEN. PROTECTION "A" NOT OPERATED (86G-A)'], 629],
    ['i3b', '3', 'SH-G-6A', 468, ['GEN. PROTECTION "B" NOT OPERATED (86G-B)'], 629],
    ['i9', '9', 'SH-G-7', 505, ['GEN. TRANSF. AND UNIT TRANSF. PROTECTION NOT OPERATED (BY OTHERS)'], 907],
    ['i1', '1', 'SH-G-4', 869, ['41 CLOSED'], 907],
    ['i25', '25', 'SH-G-2A', 918, ['52L CLOSED'], 907],
    ['i44', '44', 'SH-G-1A', 955, ['52G CLOSED'], 667],
    ['i40', '40', 'SH-G-3', 1057, ['PB AUTO SYN. "START" FROM SYN'], 595],
    ['i11', '11', 'SH-G-3', 1104, ['PB AUTO SYN. "START" FROM DCS'], 498],
    ['i8', '8', 'SH-G-9', 1159, ['52G CLOSE ORDER', '(TCS/ATS)'], 455],
    ['i45b', '45', 'SH-G-3', 1210, ['OPERATION', 'LOCATION "REMOTE"'], 455],
    ['i41', '41', 'SH-G-*', 1253, ['25X1 "ON"'], 719]
  ].forEach(([k, n, sh, y, z, xe]) => {
    circ(264, y, n);
    s.push([k, 251, y - 13, 277, y + 13]);
    z.forEach((q, i) => t.push([280, y - 7 - 13 * (z.length - 1 - i), q]));
    t.push([280, y + 13, sh]);
    w.push([k, [[277, y], [xe, y]]]);
  });
  /* the contacts of the GCP */
  box('k25', 261, 389, 250, 447, '25', 'ON');
  box('k84', 249, 998, 250, 436, 'VOLTAGE ESTABLISHED (84GI)', 'ON');
  box('k84r', 257, 1300, 250, 445, 'VOLTAGE ESTABLISHED (84R)', 'ON');
  t.push([262, 376, '(GCP)'], [251, 985, '(84GI)   (GCP)'], [259, 1287, '(84R)   (GCP)']);
  /* the gates */
  gate('or0', 'OR', 909, 211, 192, 230);
  gate('aU', 'A', 1034, 269, 227, 307);
  gate('ap', 'A', 629, 449, 425, 475);
  gate('aT', 'A', 907, 465, 370, 556);
  gate('aM', 'A', 907, 665, 603, 727);
  gate('aV', 'A', 975, 762, 733, 791);
  gate('aB', 'A', 907, 955, 820, 1128);
  gate('aA', 'A', 1322, 366, 320, 406);
  gate('or3', 'OR', 1416, 398, 357, 437);
  gate('aC', 'A', 1581, 322, 157, 427);
  gate('a2', 'A', 455, 1186, 1144, 1226);
  gate('or1', 'OR', 498, 1146, 1091, 1191);
  gate('or2', 'OR', 595, 1087, 1048, 1130);
  gate('aR', 'A', 719, 1276, 1249, 1306);
  /* 52G or 52L in REMOTE and 43-25 AUTO: ASD1 in use */
  w.push(
    ['i45', [[781, 173], [781, 201], [909, 201]]],
    ['or0', [[927, 211], [955, 211], [955, 240], [1034, 240]]],
    ['i24', [[781, 327], [781, 295], [1034, 295]]],
    ['aU', [[1052, 269], [1126, 269]]]
  );
  r.push(['', 1126, 260, 33, 18, 'ATS']);
  t.push([1128, 250, '(ASD1 IN USE)']);
  mark(1085, 247, 285, '(GCP)', '(TCS)', 269);
  /* 25 ON */
  w.push(['k25', [[511, 389], [907, 389]]], ['k25', [[587, 389], [587, 367], [674, 367]]]);
  circ(687, 367, '26', 'SH-G-2B', 703);
  t.push([668, 359, '25 "ON"', 2]);
  /* the generator protections A and B not operated */
  w.push(['ap', [[647, 449], [907, 449]]], ['ap', [[872, 449], [872, 615], [907, 615]]]);
  mark(704, 430, 470, '(GPP)', '(GCP)', 449);
  w.push(['i9', [[852, 505], [852, 635], [907, 635]]]);
  /* the permissives from below: 41 closed, 52L closed, 52G not closed for 3 s, 84GI */
  w.push(
    ['i1', [[812, 869], [812, 523], [907, 523]]],
    ['i1', [[812, 655], [907, 655]]],
    ['i25', [[832, 918], [832, 543], [907, 543]]],
    ['i25', [[832, 674], [907, 674]]],
    ['i25', [[832, 745], [975, 745]]],
    ['i24', [[781, 327], [781, 834], [907, 834]]]
  );
  di('di1', 667, 955, '3s');
  b.push(['n1', 'NC', '', 735, 955, [], {}, [10]], ['n2', 'NC', '', 730, 1116, [], {}, [10]]);
  w.push(
    ['di1', [[701, 955], [725, 955]], 0, 0],
    ['n1', [[745, 955], [907, 955]]],
    ['n1', [[851, 955], [851, 692], [907, 692]]],
    ['n1', [[851, 778], [975, 778]]],
    ['k84', [[499, 998], [907, 998]]],
    ['k84', [[871, 998], [871, 711], [907, 711]]],
    ['k84', [[529, 998], [529, 1031], [817, 1031]]],
    ['k84', [[674, 1031], [674, 1062], [816, 1062]]]
  );
  r.push(['', 817, 1022, 32, 18, 'ATS']);
  circ(829, 1062, '50', 'SH-G-8B', 846);
  t.push([687, 1023, '(GEN. VOLTAGE OK)'], [687, 1055, '(GEN. VOLTAGE OK)']);
  mark(604, 1009, 1047, '(GCP)', '(TCS)', 1031);
  /* the top permissives together, the auto close (AUTO), the manual close and the close order */
  w.push(
    ['aT', [[925, 465], [1438, 465], [1438, 415], [1581, 415]]],
    ['aA', [[1340, 366], [1416, 366]]],
    ['im', [[1294, 432], [1416, 432]]],
    ['or3', [[1434, 398], [1581, 398]]],
    ['aC', [[1599, 321], [1958, 321]]]
  );
  circ(1281, 432, '1');
  s.push(['im', 1268, 419, 1294, 445]);
  t.push([1302, 412, '52G "MANUAL'], [1302, 425, 'CLOSE"'], [1302, 445, 'SH-G-3'], [1350, 357, 'AUTO']);
  out(321, '1', 'SH-G-1A', '52G CLOSE ORDER');
  mark(1640, 300, 342, '(GCP)', 'OTHERS', 321);
  /* ready to synchronize and the VT connection of the 52G synchronizing circuit */
  w.push(['aM', [[925, 665], [1958, 665]]], ['aM', [[1757, 665], [1757, 700], [1958, 700]]], ['aV', [[993, 762], [1035, 762]]]);
  out(665, '42', 'SH-G-2B', '52G READY TO SYNCHRONIZE');
  out(700, '43', 'SH-G-8B', '52G READY TO SYNCHRONIZE');
  t.push([1044, 757, 'VT CONNECTION'], [1044, 770, 'FOR 52G SYNCHRO. CIRCUIT']);
  /* the auto synchronizer start: SYN, DCS, or the TCS/ATS close order in REMOTE; held by 52G ready (the line from below) */
  w.push(
    ['a2', [[473, 1186], [498, 1186]]],
    ['or1', [[516, 1146], [528, 1146], [528, 1086], [595, 1086]]],
    ['aB', [[975, 955], [975, 1230], [544, 1230], [544, 1116], [595, 1116]]],
    ['or2', [[613, 1087], [907, 1087]]]
  );
  mark(538, 1067, 1105, '(TCS)', '(GCP)', 1086);
  /* 25X1 of the GCP, its VT connection and 25X1 ON out */
  w.push(['aB', [[925, 955], [1365, 955], [1365, 932], [1429, 932]]]);
  box('x1', 1429, 932, 103, 1498, '25X1', 'ON');
  t.push([1429, 919, '(GCP)']);
  di('di3', 1594, 932, '3s');
  w.push(
    ['x1', [[1532, 932], [1594, 932]], 0, 0],
    ['x1', [[1562, 932], [1562, 886], [1601, 886]]],
    ['di3', [[1628, 932], [1757, 932], [1757, 968], [1958, 968]]]
  );
  t.push([1610, 877, 'VT CONNECTION'], [1610, 890, 'FOR AUTO SYNCHRO.'], [1610, 903, '(FOR 52G)']);
  out(968, '41', 'SH-G-*', '25X1 "ON"');
  /* 25X1 ON and 84R: 25Y1 of the GCP; it starts the ASD1 and, not back for 5 min, holds the start */
  w.push(['k84r', [[507, 1300], [719, 1300]]], ['k84r', [[542, 1300], [542, 1276], [623, 1276]]], ['aR', [[737, 1276], [801, 1276]]]);
  circ(635, 1276, '28', 'SH-G-2B', 651);
  t.push([606, 1268, '84R "ON"', 2]);
  box('y1', 801, 1276, 104, 871, '25Y1', 'ON');
  t.push([801, 1263, '(GCP)']);
  di('di2', 667, 1116, '5min');
  w.push(
    ['y1', [[905, 1276], [1000, 1276], [1000, 1156], [1094, 1156]]],
    ['y1', [[1000, 1156], [637, 1156], [637, 1116], [667, 1116]]],
    ['di2', [[701, 1116], [720, 1116]], 0, 0],
    ['n2', [[740, 1116], [907, 1116]]]
  );
  /* the auto synchronizer ASD1 of the GCP and its pulses */
  r.push(['', 1094, 1116, 121, 96, '']);
  l.push([[1179, 1116], [1179, 1212]]);
  [1134, 1153, 1172, 1191].forEach(y => l.push([[1179, y], [1215, y]]));
  t.push([1094, 1110, '(GCP)'], [1136, 1158, 'ASD1', 4], [1136, 1172, '(FOR 52G)', 4]);
  [
    ['a25', 1124, '25A'],
    ['a60r', 1143, '60R'],
    ['a60l', 1163, '60L'],
    ['a15r', 1181, '15R'],
    ['a15l', 1200, '15L']
  ].forEach(([k, y, z]) => {
    s.push([k, 1179, y - 9, 1215, y + 9]);
    t.push([1197, y, z, 4]);
  });
  w.push(
    ['a25', [[1215, 1124], [1249, 1124], [1249, 397], [1322, 397]]],
    ['a60r', [[1215, 1143], [1274, 1143], [1274, 1082], [1958, 1082]]],
    ['a60l', [[1215, 1163], [1301, 1163], [1301, 1121], [1958, 1121]]],
    ['a15r', [[1215, 1181], [1326, 1181], [1326, 1159], [1958, 1159]]],
    ['a15l', [[1215, 1200], [1958, 1200]]]
  );
  out(1082, '37', 'SH-G-3', 'ASD1(FOR 52G) "60R"');
  out(1121, '38', 'SH-G-3', 'ASD1(FOR 52G) "60L"');
  out(1159, '39', 'SH-G-3', 'ASD1(FOR 52G) "15R"');
  out(1200, '40', 'SH-G-3', 'ASD1(FOR 52G) "15L"');
  j.push(
    [781, 173],
    [781, 327],
    [587, 389],
    [872, 449],
    [852, 505],
    [812, 869],
    [812, 655],
    [832, 918],
    [832, 674],
    [832, 745],
    [851, 955],
    [851, 778],
    [871, 998],
    [529, 998],
    [674, 1031],
    [975, 955],
    [1757, 665],
    [1562, 932],
    [542, 1300],
    [1000, 1156]
  );
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'G-1B', live: { i24: 'synAuto', i1: 'f41', i25: 'l52c', i44: 'g52', i8: 'synStart', i41: 'x25', x1: 'x25', k84r: 'v84', y1: 'y25', a25: 'c25', a60r: 'p60r', a60l: 'p60l', a15r: 'p15r', a15l: 'p15l' },
    title: 'GENERATOR CIRCUIT BREAKER LOGIC (52G) (2/2)',
    page: 8,
    dwg: '310SD03-743',
    of: 20,
    f: [200, 118, 2175, 1520],
    fs: 1.2,
    ar: 1,
    o,
    s,
    b,
    r,
    w,
    t,
    l,
    a,
    j
  });
})();
