/* SH-G-2B 230kV CIRCUIT BREAKER LOGIC (52L) (2/2) (Generator Protection / Breaker Logic Diagram 310SD03-743 rev 1, sheet 10). Typed from the
   drawing; units = the pixels of the page rendered 2296 wide. The close order of the 230 kV breaker 52L: the permissives (protections not
   operated, 52G closed, 52L not closed for 3 s, voltage established) build "52L READY TO SYNCHRONIZE", the VT connections and, with the auto
   synchronizer start (SYN or DCS, or the TCS/ATS close order in REMOTE), the 25X2 relay of the GCP; the auto synchronizer ASD2 (GCP) gives the
   25A close pulse (AUTO with 43-25 in AUTO) and the raise / lower pulses (60R / 60L voltage, 15R / 15L speed). A manual close or the auto close
   with the permits, or the initial manual close with the permit for the first power receive while 52G is open, in 52L REMOTE with the close
   permit condition, is the 52L CLOSE ORDER to SH-G-2A; 52G or 52L ready to synchronize selects the synchronizer (W). */
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
    circ(1965, y, n, sh, 1983);
    if (z) t.push([1935, y - 9, z, 2]);
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
    r.push([k, x, y - 12, 33, 24, '']);
    t.push([x + 16, y - 5, 'DI', 4], [x + 16, y + 6, tm, 4]);
  };
  /* a mark that the signal also goes to a panel: x, top (left arrow), bottom (right arrow), words, the line it crosses; st: words over / under */
  const mark = (x, y1, y2, z1, z2, yc, st) => {
    l.push([[x, y1], [x, yc - 6]], [[x, yc + 6], [x, y2]]);
    a.push([[x, y1], [x - 16, y1]], [[x, y2], [x + 16, y2]]);
    if (st) t.push([x - 12, y1 - 10, z1, 4], [x + 12, y2 + 14, z2, 4]) /* the words over the top arrow and under the bottom one */;
    else t.push([x - 18, y1 + 4, z1, 2], [x + 19, y2 + 4, z2]);
  };
  /* the inputs from the other sheets: [key, number, sheet, line, [words], end of the line] */
  [
    ['i45', '45', 'SH-G-2A', 175, ['52L "REMOTE" SELECTED'], 1578],
    ['i44', '44', 'SH-G-2A', 211, ['52L CLOSE PERMIT CONDITION'], 1578],
    ['i25', '25', 'SH-G-3', 312, ['43-25 "AUTO" SELECTED'], 1317],
    ['i26', '26', 'SH-G-1B', 352, ['25 "ON"'], 902],
    ['i16a', '16', 'SH-G-5B', 394, ['GEN. PROTECTION "A" NOT OPERATED'], 583],
    ['i16b', '16', 'SH-G-6B', 431, ['GEN. PROTECTION "B" NOT OPERATED'], 583],
    ['i11', '11', 'SH-G-7', 489, ['230kV SWYD., GEN. TRANSF. AND UNIT TRANSF.', 'PROTECTION RELAY NOT OPERATED (BY OTHERS)'], 902],
    ['i43', '43', 'SH-G-2A', 903, ['52L CLOSED'], 661],
    ['i24', '24', 'SH-G-1A', 940, ['52G CLOSED'], 902],
    ['i41', '41', 'SH-G-3', 1039, ['PB AUTO SYN. "START" FROM SYN'], 580],
    ['i12', '12', 'SH-G-3', 1079, ['PB AUTO SYN. "START" FROM DCS'], 491],
    ['i13', '13', 'SH-G-9', 1123, ['52L CLOSED ORDER', '(TCS/ATS)'], 410],
    ['i46', '46', 'SH-G-3', 1175, ['OPERATION LOCATION', '"REMOTE"'], 410],
    ['i35', '35', 'SH-G-*', 1244, ['25X2 "ON"'], 711],
    ['i28', '28', 'SH-G-1B', 1290, ['84R "ON"'], 711]
  ].forEach(([k, n, sh, y, z, xe]) => {
    circ(258, y, n);
    s.push([k, 245, y - 13, 271, y + 13]);
    z.forEach((q, i) => t.push([274, y - 7 - 13 * (z.length - 1 - i), q]));
    t.push([274, y + 13, sh]);
    w.push([k, [[271, y], [xe, y]]]);
  });
  /* the gates */
  gate('ap', 'A', 583, 412, 382, 442);
  gate('aT', 'A', 902, 453, 331, 538);
  gate('aM', 'A', 902, 659, 607, 708);
  gate('aV', 'A', 970, 741, 716, 770);
  gate('aB', 'A', 902, 940, 822, 1108);
  gate('aI1', 'A', 970, 572, 555, 585);
  gate('aI', 'A', 1410, 581, 545, 620);
  gate('aA', 'A', 1317, 350, 305, 390);
  gate('orA', 'OR', 1410, 383, 344, 422);
  gate('aP', 'A', 1458, 401, 375, 427);
  gate('or4', 'OR', 1517, 492, 395, 585);
  gate('aC', 'A', 1578, 307, 165, 500);
  gate('orW', 'OR', 1825, 567, 540, 592);
  gate('a2', 'A', 410, 1148, 1115, 1187);
  gate('or1', 'OR', 491, 1117, 1065, 1162);
  gate('or2', 'OR', 580, 1099, 1025, 1152);
  gate('aR', 'A', 711, 1267, 1237, 1295);
  /* the protections A and B not operated, the switchyard protection, 52G closed, 52L not closed for 3 s, 84LI */
  w.push(
    ['i44', [[774, 211], [774, 846], [902, 846]]],
    ['i25', [[794, 312], [794, 831], [902, 831]]],
    ['ap', [[601, 412], [902, 412]]],
    ['ap', [[867, 412], [867, 618], [902, 618]]],
    ['ap', [[867, 561], [970, 561]]],
    ['i11', [[847, 489], [847, 638], [902, 638]]],
    ['i11', [[847, 581], [970, 581]]],
    ['i24', [[827, 940], [827, 529], [902, 529]]],
    ['i24', [[827, 591], [1297, 591]]],
    ['i24', [[827, 659], [902, 659]]],
    ['i24', [[827, 724], [970, 724]]]
  );
  mark(665, 392, 432, '(GPP)', '(GCP)', 412);
  di('di1', 661, 903, '3s');
  b.push(['n1', 'NC', '', 727, 903, [], {}, [10]], ['n2', 'NC', '', 722, 1099, [], {}, [10]], ['n3', 'NC', '', 1307, 591, [], {}, [10]]);
  box('k84', 244, 982, 248, 430, 'VOLTAGE ESTABLISHED (84LI)', 'ON');
  t.push([244, 969, '(84LI)   (GCP)']);
  w.push(
    ['di1', [[694, 903], [717, 903]], 0, 0],
    ['n1', [[737, 903], [902, 903]]],
    ['n1', [[847, 903], [847, 678], [902, 678]]],
    ['n1', [[847, 756], [970, 756]]],
    ['k84', [[492, 982], [902, 982]]],
    ['k84', [[867, 982], [867, 698], [902, 698]]]
  );
  /* ready to synchronize, the synchronizer selection W and the VT connection of the 52L synchronizing circuit */
  w.push(
    ['aM', [[920, 659], [1952, 659]]],
    ['aM', [[1725, 659], [1725, 586], [1825, 586]]],
    ['i42', [[1625, 547], [1825, 547]]],
    ['orW', [[1843, 567], [1952, 567]]],
    ['aV', [[988, 741], [1030, 741]]]
  );
  out(659, '41', 'SH-G-8B', '52L READY TO SYNCHRONIZE');
  circ(1612, 548, '42');
  s.push(['i42', 1599, 535, 1625, 561]);
  t.push([1628, 540, '52G READY TO SYNCHRONIZE'], [1628, 560, 'SH-G-1B']);
  circ(1965, 567, 'W');
  mark(1877, 547, 583, '(GCP)', '(SYN)', 567, 1);
  t.push([1037, 737, 'VT CONNECTION'], [1037, 750, 'FOR 52L SYNCHRO. CIRCUIT']);
  /* the close: AUTO (25A and 43-25 AUTO) or manual, with the top permissives; or the initial manual close; then REMOTE and the permit */
  w.push(
    ['aA', [[1335, 350], [1410, 350]]],
    ['i2', [[1287, 417], [1410, 417]]],
    ['orA', [[1428, 383], [1458, 383]]],
    ['aT', [[920, 453], [1432, 453], [1432, 420], [1458, 420]]],
    ['aP', [[1476, 401], [1517, 401]]],
    ['aI1', [[988, 572], [1410, 572]]],
    ['n3', [[1317, 591], [1410, 591]]],
    ['i21', [[1287, 552], [1410, 552]]],
    ['fp', [[428, 787], [1360, 787], [1360, 610], [1410, 610]]],
    ['aI', [[1428, 581], [1517, 581]]],
    ['or4', [[1535, 492], [1578, 492]]],
    ['aC', [[1596, 307], [1952, 307]]]
  );
  circ(1274, 417, '2');
  circ(1274, 552, '21');
  s.push(['i2', 1261, 404, 1287, 430], ['i21', 1261, 539, 1287, 565]);
  t.push(
    [1345, 341, 'AUTO'],
    [1297, 397, '52L "MANUAL'],
    [1297, 410, 'CLOSE"'],
    [1297, 430, 'SH-G-3'],
    [1297, 532, '52L "INITIAL'],
    [1297, 545, 'MANUAL CLOSE"'],
    [1297, 565, 'SH-G-3']
  );
  r.push(['fp', 244, 758, 185, 58, '']);
  t.push([336, 772, '52L CLOSE', 4], [336, 787, 'PERMIT CONDITION', 4], [336, 802, 'FOR FIRST POWER RECEIVE', 4, 1.75]);
  mark(523, 768, 804, 'OTHERS', '(GCP)', 787, 1);
  out(307, '1', 'SH-G-2A', '52L CLOSE ORDER');
  mark(1636, 289, 325, '(GCP)', 'OTHERS', 307, 1);
  /* the auto synchronizer start: SYN, DCS, or the TCS/ATS close order in REMOTE; held by 52L ready (the line from below) */
  w.push(
    ['a2', [[428, 1147], [491, 1147]]],
    ['or1', [[509, 1117], [522, 1117], [522, 1084], [580, 1084]]],
    ['aB', [[968, 940], [968, 1180], [538, 1180], [538, 1139], [580, 1139]]],
    ['or2', [[598, 1099], [617, 1099], [617, 1057], [902, 1057]]]
  );
  mark(537, 1065, 1102, '(TCS)', '(GCP)', 1084, 1);
  /* 25X2 of the GCP, its VT connection and 25X2 ON out */
  w.push(['aB', [[920, 940], [1421, 940]]]);
  box('x2', 1421, 939, 106, 1491, '25X2', 'ON');
  t.push([1421, 926, '(GCP)']);
  di('di3', 1589, 939, '3s');
  w.push(['x2', [[1527, 939], [1589, 939]], 0, 0], ['x2', [[1557, 939], [1557, 895], [1598, 895]]], ['di3', [[1622, 939], [1952, 939]]]);
  t.push([1606, 886, 'VT CONNECTION'], [1606, 899, 'FOR AUTO SYNCHRO.'], [1606, 912, '(FOR 52L)']);
  out(939, '35', 'SH-G-*', '25X2 "ON"');
  /* 25X2 ON and 84R ON: 25Y2 of the GCP; it starts the ASD2 and, not back for 5 min, holds the start */
  w.push(['aR', [[729, 1267], [795, 1267]]]);
  box('y2', 795, 1267, 104, 865, '25Y2', 'ON');
  t.push([795, 1254, '(GCP)']);
  di('di2', 661, 1099, '5min');
  w.push(
    ['y2', [[899, 1267], [993, 1267], [993, 1139], [1087, 1139]]],
    ['y2', [[993, 1139], [631, 1139], [631, 1099], [661, 1099]]],
    ['di2', [[694, 1099], [712, 1099]], 0, 0],
    ['n2', [[732, 1099], [902, 1099]]]
  );
  /* the auto synchronizer ASD2 of the GCP and its pulses */
  r.push(['', 1087, 1091, 124, 95, '']);
  l.push([[1175, 1091], [1175, 1186]]);
  [1109, 1128, 1147, 1166].forEach(y => l.push([[1175, y], [1211, y]]));
  t.push([1087, 1085, '(GCP)'], [1131, 1132, 'ASD2', 4], [1131, 1146, '(FOR 52L)', 4]);
  [
    ['a25', 1100, '25A'],
    ['a60r', 1118, '60R'],
    ['a60l', 1138, '60L'],
    ['a15r', 1157, '15R'],
    ['a15l', 1176, '15L']
  ].forEach(([k, y, z]) => {
    s.push([k, 1175, y - 9, 1211, y + 9]);
    t.push([1193, y, z, 4]);
  });
  w.push(
    ['a25', [[1211, 1100], [1244, 1100], [1244, 382], [1317, 382]]],
    ['a60r', [[1211, 1118], [1268, 1118], [1268, 1058], [1952, 1058]]],
    ['a60l', [[1211, 1138], [1293, 1138], [1293, 1096], [1952, 1096]]],
    ['a15r', [[1211, 1157], [1319, 1157], [1319, 1137], [1952, 1137]]],
    ['a15l', [[1211, 1176], [1952, 1176]]]
  );
  out(1058, '37', 'SH-G-3', 'ASD2(FOR 52L) "60R"');
  out(1096, '38', 'SH-G-3', 'ASD2(FOR 52L) "60L"');
  out(1137, '39', 'SH-G-3', 'ASD2(FOR 52L) "15R"');
  out(1176, '40', 'SH-G-3', 'ASD2(FOR 52L) "15L"');
  j.push(
    [774, 211],
    [794, 312],
    [867, 412],
    [867, 561],
    [847, 489],
    [847, 581],
    [827, 940],
    [827, 591],
    [827, 659],
    [827, 724],
    [847, 903],
    [847, 756],
    [867, 982],
    [1725, 659],
    [968, 940],
    [1557, 939],
    [993, 1139]
  );
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'G-2B', live: { i43: 'l52c', i24: 'g52' },
    title: '230kV CIRCUIT BREAKER LOGIC (52L) (2/2)',
    page: 10,
    dwg: '310SD03-743',
    of: 20,
    f: [190, 120, 2168, 1515],
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
