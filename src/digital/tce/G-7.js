/* SH-G-7 230kV SWITCHYARD AND TRANSFORMER PROTECTION LOGIC (Generator Protection / Breaker Logic Diagram 310SD03-743 rev 1, sheet 17).
   Typed from the drawing; units = the pixels of the page rendered 2296 wide (the scan is turned a little: each line is put at the height
   of its left end). The relays of the switchyard and of the transformers (by others, in the dashed box): the 230kV switchyard lockout
   relay, the generator transformer lockout relay 86T, breaker failure 50BF -> 86BF and the unit transformer / 6.6kV switchgear relays
   (87T, 51N), each gathered by OR gates to the line breaker 52L, the generator breaker trip coils 52G-TC1 / TC2, the 6.6kV incomers,
   the switchyard breaker failure, the generator protection panels, the annunciator and the TCS (each mark: the signal also goes to
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
  /* a continuation circle: the number in it, the sheet beside it */
  const circ = (x, y, n, sh) => {
    o.push([x, y, 13]);
    t.push([x, y, n, 4], [x + 19, y + 5, sh]);
  };
  /* a gate: bar x, centre y, the bar from y1 to y2 */
  const gate = (k, ty, bar, y, y1, y2) => {
    b.push([k, 'G:' + ty, '', bar + 9, y, [], {}, [18, ty === 'OR' ? 18 : 20, 0]]);
    l.push([[bar, y1], [bar, y2]]);
  };
  /* a solid outline */
  const box = (x1, y1, x2, y2) => l.push([[x1, y1], [x2, y1]], [[x2, y1], [x2, y2]], [[x2, y2], [x1, y2]], [[x1, y2], [x1, y1]]);
  /* a dashed outline */
  const dbox = (x1, y1, x2, y2) =>
    e.push([[x1, y1], [x2, y1]], [[x2, y1], [x2, y2]], [[x2, y2], [x1, y2]], [[x1, y2], [x1, y1]]);
  /* a mark that the signal also goes to a panel: x, top / bottom, words, the lines it crosses; the top arrow points right */
  const mark = (x, y1, y2, z1, z2, X) => {
    const P = [y1, ...X.flatMap(y => [y - 6, y + 6]), y2];
    for (let i = 0; i < P.length; i += 2) l.push([[x, P[i]], [x, P[i + 1]]]);
    a.push([[x, y1], [x + 18, y1]], [[x, y2], [x - 18, y2]]);
    t.push([x + 21, y1 + 4, z1], [x - 20, y2 + 4, z2, 2]);
  };
  /* the relays by others */
  dbox(306, 236, 1574, 1286);
  t.push([320, 231, '230kV SWYD., GEN. TRANSF. AND UNIT TRANSF. (BY OTHERS)']);
  box(338, 249, 523, 280);
  t.push([430, 258, '230kV SWYD.', 4], [430, 272, 'LOCKOUT RELAY', 4]);
  s.push(['swy', 338, 249, 523, 280]);
  box(337, 625, 521, 754);
  t.push([429, 673, 'GEN. TRANSF.', 4], [429, 689, 'LOCKOUT RELAY', 4], [429, 705, '(86T)', 4]);
  box(338, 758, 521, 790);
  t.push([429, 774, '50BF -> 86BF', 4]);
  s.push(['bf', 338, 758, 521, 790]);
  box(337, 857, 520, 983);
  t.push([429, 904, 'UNIT TRANSF. /', 4], [429, 920, '6.6kV SWGR.', 4], [429, 936, '(87T, 51N)', 4]);
  /* the outputs of the lockout relay 86T and of the unit transformer relays: [key, line, words] */
  [
    ['ta', 648, 'TRIP GCB (52L)'],
    ['tb', 666, 'TRIP GEN. BKR. (52G) / TRIP AUX. BKR.'],
    ['tc', 687, 'TRIP GEN. BKR. (52G) / TRIP AUX. BKR.'],
    ['td', 709, ''],
    ['te', 730, ''],
    ['ua', 878, 'TRIP GCB (52L)'],
    ['ub', 899, 'TRIP GEN. BKR. (52G) / TRIP AUX. BKR.'],
    ['uc', 920, 'TRIP GEN. BKR. (52G) / TRIP AUX. BKR.'],
    ['ud', 941, ''],
    ['ue', 962, '']
  ].forEach(([k, y, z]) => {
    s.push([k, 505, y - 8, 521, y + 8]);
    if (z) t.push([529, y - 6, z]);
  });
  /* the gates */
  gate('g1', 'OR', 1132, 282, 257, 309);
  gate('g2', 'OR', 1133, 687, 660, 714);
  gate('g3', 'OR', 1134, 919, 890, 946);
  gate('g4', 'OR', 1134, 1240, 1224, 1255);
  gate('g5', 'OR', 1695, 428, 400, 452);
  gate('g6', 'OR', 1695, 516, 486, 541);
  gate('g7', 'OR', 1695, 611, 584, 637);
  gate('g8', 'OR', 1697, 995, 966, 1020);
  gate('g9', 'OR', 1698, 1080, 1050, 1107);
  gate('g10', 'A', 1784, 361, 340, 382);
  b.push(['nc1', 'NC', '', 1733, 349, [], {}, [9]], ['nc2', 'NC', '', 1733, 428, [], {}, [9]]);
  /* the switchyard lockout relay; the line breaker */
  w.push(
    ['swy', [[523, 262], [1132, 262]]],
    ['swy', [[1050, 262], [1050, 349], [1724, 349]], 0, 0],
    ['ta', [[521, 648], [885, 648], [885, 282], [1132, 282]]],
    ['ua', [[520, 878], [907, 878], [907, 301], [1132, 301]]],
    ['g1', [[1151, 282], [1394, 282]]],
    ['g1', [[1194, 282], [1194, 325], [1394, 325]]]
  );
  j.push([1050, 262], [1194, 282]);
  /* breaker failure 50BF -> 86BF (bus 1050) */
  w.push(
    ['bf', [[521, 771], [1050, 771]], 0, 0],
    ['bf', [[1050, 771], [1050, 409], [1695, 409]]],
    ['bf', [[1050, 536], [1695, 536]]],
    ['bf', [[1050, 631], [1695, 631]]],
    ['bf', [[1050, 708], [1133, 708]]],
    ['bf', [[1050, 771], [1050, 1101], [1698, 1101]]],
    ['bf', [[1050, 896], [1134, 896]]],
    ['bf', [[1050, 1016], [1697, 1016]]]
  );
  j.push([1050, 536], [1050, 631], [1050, 708], [1050, 771], [1050, 896], [1050, 1016]);
  /* the lockout relay 86T: the first trip of the generator breaker (bus 1094), the second (bus 1095), the annunciator, the switchyard */
  w.push(
    ['tb', [[521, 666], [1133, 666]]],
    ['tb', [[1094, 666], [1094, 449], [1695, 449]]],
    ['tb', [[1094, 496], [1695, 496]]],
    ['tb', [[1094, 592], [1695, 592]]],
    ['tc', [[521, 687], [844, 687], [844, 940], [1134, 940]]],
    ['tc', [[1095, 940], [1095, 1059], [1698, 1059]]],
    ['tc', [[1095, 975], [1697, 975]]],
    ['td', [[521, 709], [802, 709], [802, 1162], [1966, 1162]]],
    ['te', [[521, 730], [762, 730], [762, 1230], [1134, 1230]]]
  );
  j.push([1094, 666], [1094, 496], [1094, 592], [1095, 940], [1095, 975]);
  /* the unit transformer: the first trip of the generator breaker (bus 1072), the second (bus 1072 below), the annunciator, the switchyard */
  w.push(
    ['ub', [[520, 899], [968, 899], [968, 687], [1133, 687]]],
    ['ub', [[1072, 687], [1072, 428], [1695, 428]]],
    ['ub', [[1072, 516], [1695, 516]]],
    ['ub', [[1072, 611], [1695, 611]]],
    ['uc', [[520, 920], [1134, 920]]],
    ['uc', [[1072, 920], [1072, 1080], [1698, 1080]]],
    ['uc', [[1072, 995], [1697, 995]]],
    ['ud', [[520, 941], [782, 941], [782, 1188], [1966, 1188]]],
    ['ue', [[520, 962], [740, 962], [740, 1250], [1134, 1250]]]
  );
  j.push([1072, 687], [1072, 516], [1072, 611], [1072, 920], [1072, 995]);
  /* the generator breaker trip coils, the 6.6kV incomers, the switchyard breaker failure */
  w.push(
    ['g2', [[1152, 687], [1394, 687]]],
    ['g2', [[1195, 687], [1195, 749], [1393, 749]]],
    ['g3', [[1153, 919], [1394, 919]]],
    ['g3', [[1195, 919], [1195, 855], [1393, 855]]],
    ['g4', [[1153, 1240], [1292, 1240]]]
  );
  j.push([1195, 687], [1195, 919]);
  /* the gates to the other panels */
  w.push(
    ['g5', [[1714, 428], [1724, 428]], 0, 0],
    ['nc2', [[1742, 428], [1962, 428]]],
    ['nc2', [[1760, 428], [1760, 376], [1784, 376]]],
    ['nc1', [[1742, 349], [1784, 349]]],
    ['g10', [[1803, 361], [1962, 361]]],
    ['g6', [[1714, 516], [1962, 516]]],
    ['g7', [[1714, 611], [1962, 611]]],
    ['g8', [[1716, 995], [1964, 995]]],
    ['g9', [[1717, 1080], [1964, 1080]]]
  );
  j.push([1760, 428]);
  /* the outputs */
  circ(1407, 282, '1', 'SH-G-2A');
  circ(1407, 325, '2', 'SH-G-2A');
  circ(1407, 687, '3', 'SH-G-1A');
  circ(1407, 919, '4', 'SH-G-1A');
  circ(1975, 361, '11', 'SH-G-2B');
  circ(1975, 428, '9', 'SH-G-1B');
  circ(1975, 516, '7', 'SH-G-5A');
  circ(1975, 611, '8', 'SH-G-5A');
  circ(1977, 995, '5', 'SH-G-6A');
  circ(1977, 1080, '6', 'SH-G-6A');
  r.push(['', 1966, 1153, 32, 18, 'ANN'], ['', 1966, 1179, 32, 18, 'ANN']);
  [
    [1213, 251, ['230kV SWYD., GEN. TRANSF.', 'AND UNIT TRANSF. PROTECTION', 'OPERATED']],
    [1213, 294, ['230kV SWYD., GEN. TRANSF.', 'AND UNIT TRANSF. PROTECTION', 'OPERATED']],
    [1213, 645, ['GEN. TRANSF. AND UNIT', 'TRANSF. PROTECTION', 'OPERATED (FOR 52G-TC1)']],
    [1400, 744, ['6.6kV SWGR INCOM. CB TRIP', 'AND CLOSE BLOCKING']],
    [1400, 850, ['6.6kV SWGR INCOM. CB TRIP', 'AND CLOSE BLOCKING']],
    [1213, 878, ['GEN. TRANSF. AND UNIT', 'TRANSF. PROTECTION', 'OPERATED (FOR 52G-TC2)']],
    [1298, 1235, ['SWYD. BF AND SWYD. CLOSE', 'BLOCKING']],
    [1807, 312, ['230kV SWYD., GEN. TRANSF.', 'AND UNIT TRANSF.', 'PROTECTION RELAY NOT', 'OPERATED (BY OTHERS)']],
    [1798, 392, ['GEN. TRANSF. AND UNIT TRANSF.', 'PROTECTION NOT', 'OPERATED (BY OTHERS)']],
    [1778, 481, ['GEN. TRANSF. AND UNIT TRANSF.', 'PROTECTION', 'OPERATED (BY OTHERS)']],
    [1778, 577, ['GEN. TRANSF. AND UNIT TRANSF.', 'PROTECTION', 'OPERATED (BY OTHERS)']],
    [1780, 959, ['GEN. TRANSF. AND UNIT TRANSF.', 'PROTECTION', 'OPERATED (BY OTHERS)']],
    [1780, 1044, ['GEN. TRANSF. AND UNIT TRANSF.', 'PROTECTION', 'OPERATED (BY OTHERS)']]
  ].forEach(([x, y, Z]) => Z.forEach((z, i) => t.push([x, y + 13 * i, z])));
  t.push([1945, 1153, 'GEN. TRANSF. PROTECTION OPERATED', 2], [1945, 1179, 'UNIT TRANSF. PROTECTION OPERATED', 2]);
  /* the marks: the signal also goes to that panel */
  mark(1645, 334, 464, '(GCP)', 'OTHERS', [349, 409, 428, 449]);
  mark(1645, 481, 553, '(GPP)', 'OTHERS', [496, 516, 536]);
  mark(1645, 577, 650, '(TCS)', 'OTHERS', [592, 611, 631]);
  mark(1645, 960, 1029, '(GPP)', 'OTHERS', [975, 995, 1016]);
  mark(1645, 1045, 1114, '(TCS)', 'OTHERS', [1059, 1080, 1101]);
  mark(1645, 1146, 1200, '(TCS)', 'OTHERS', [1162, 1188]);
  /* the notes */
  t.push(
    [341, 1170, 'NOTE: 1) LOGICS ENCLOSED WITH'],
    [592, 1170, 'SHOULD BE'],
    [394, 1185, 'REVIEWED AND DETERMINED BY OTHERS.'],
    [378, 1216, '2) THE DRAWING OF LOGIC ENCLOSED WITH'],
    [394, 1231, 'SHOULD BE SUBMITTED TO MHPS BY OTHERS'],
    [394, 1246, 'FOR SIGNAL INTERFACE REVIEW.']
  );
  dbox(542, 1161, 584, 1172);
  dbox(637, 1207, 681, 1218);
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'G-7',
    title: '230kV SWITCHYARD AND TRANSFORMER PROTECTION LOGIC',
    page: 17,
    dwg: '310SD03-743',
    of: 20,
    f: [205, 120, 2178, 1518],
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
