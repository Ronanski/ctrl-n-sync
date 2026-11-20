/* SH-G-4 FIELD SWITCH (41) LOGIC (Generator Protection / Breaker Logic Diagram 310SD03-743 rev 1, sheet 12). Typed from the drawing; units =
   the pixels of the page rendered 2296 wide. The field switch 41 and the AVR (supplied inside the AVR panel): 41 closes with ES and 52G open,
   turbine rated speed, no 41 trip demand and the excitation start (auto or the TCS HMI push button) through the closing interlock; it opens on
   the trip demands of the generator protection A / B and on AVR major trouble through the opening interlock; the AVR ON / OFF through the on /
   off interlocks; the state of 41 and the AVR out to the other sheets, the ATS, the DCS, the annunciator and the SOE (each mark: the signal
   also goes to that panel). */
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
  /* a solid outline */
  const box = (x1, y1, x2, y2) => l.push([[x1, y1], [x2, y1]], [[x2, y1], [x2, y2]], [[x2, y2], [x1, y2]], [[x1, y2], [x1, y1]]);
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
  /* a mark that the signal also goes to a panel: x, top / bottom, words, the lines it crosses; rev: the top arrow points right */
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
  /* a lamp / panel box at the end of a line */
  const tag = (y, z) => r.push(['', 1965, y - 9, 32, 18, z]);
  /* the inputs from the other sheets: [key, number, sheet, line, words (lines over the line), end of the line] */
  [
    ['i1', '14', 'SH-G-1A', 251, ['ES AND 52G OPEN'], 1058],
    ['i2', '2', 'SH-G-9', 318, ['TURBINE RATED SPEED (TCS)'], 1058],
    ['i3', '4', 'SH-G-5A', 381, ['41 TRIP DEMAND FROM GEN. PROTECTION A,', 'GEN. TRANSF. & UNIT PROTECTION'], 927],
    ['i4', '4', 'SH-G-6A', 432, ['41 TRIP DEMAND FROM GEN. PROTECTION B,', 'GEN. TRANSF. & UNIT PROTECTION'], 927],
    ['i5', '3', 'SH-G-9', 479, ['EXCITATION AUTO START SIGNAL (TCS/ATS)'], 849],
    ['i6', '1', 'SH-G-9', 972, ['ST TRIP (41 OPEN)'], 848],
    ['i7', '14', 'SH-G-9', 1040, ['41 OPEN COMMAND FOR TURBINE SHUT-DOWN (ATS)'], 848]
  ].forEach(([k, n, sh, y, Z, xe]) => {
    circ(269, y, n);
    s.push([k, 256, y - 13, 282, y + 13]);
    Z.forEach((z, i) => t.push([288, y - 9 - 13 * (Z.length - 1 - i), z]));
    t.push([288, y + 13, sh]);
    w.push([k, [[282, y], [xe, y]]]);
  });
  circ(269, 835, '4');
  s.push(['i8', 256, 822, 282, 848]);
  t.push([288, 826, '52G CLOSED'], [288, 848, 'SH-G-1A']);
  /* the push button of the TCS HMI */
  box(254, 538, 503, 576);
  l.push([[294, 538], [294, 576]], [[441, 538], [441, 576]], [[441, 557], [503, 557]]);
  t.push([254, 529, '(TCS HMI)'], [274, 557, 'PB', 4], [367, 557, '3-41', 4], [472, 547, 'CLOSE', 4], [472, 566, 'OPEN', 4]);
  s.push(['pcl', 441, 538, 503, 557], ['pop', 441, 557, 503, 576]);
  /* the AVR panel */
  e.push([[797, 161], [1681, 161]], [[1681, 161], [1681, 1121]], [[1681, 1121], [797, 1121]], [[797, 1121], [797, 161]]);
  t.push([1640, 174, '(AVR)']);
  /* the closing of 41: ES and 52G open, rated speed, no trip demand, the excitation start */
  gate('or1', 'OR', 849, 517, 469, 564);
  gate('ora', 'OR', 927, 421, 370, 472);
  gate('a1', 'A', 1058, 374, 240, 526);
  gate('orb', 'OR', 1160, 418, 401, 437);
  b.push(['nc1', 'NC', '', 1018, 421, [], {}, [9]]);
  w.push(
    ['pcl', [[503, 547], [849, 547]]],
    ['or1', [[868, 517], [1058, 517]]],
    ['or1', [[980, 517], [980, 853], [1056, 853]]],
    ['ora', [[946, 421], [1009, 421]], 0, 0],
    ['nc1', [[1027, 421], [1058, 421]]],
    ['ora', [[992, 421], [992, 877], [1056, 877]]],
    ['ora', [[992, 618], [1121, 618], [1121, 408], [1160, 408]]],
    ['a1', [[1077, 374], [1212, 374]]],
    ['a1', [[1108, 374], [1108, 711], [1005, 711], [1005, 842], [1056, 842]]],
    ['orb', [[1178, 418], [1212, 418]]]
  );
  j.push([980, 517], [992, 421], [992, 618], [1108, 374]);
  /* the closing / opening interlock and the field switch 41 */
  dbox(1212, 357, 1296, 434);
  e.push([[1212, 395], [1296, 395]]);
  s.push(['cli', 1212, 357, 1296, 395], ['opi', 1212, 395, 1296, 434]);
  t.push([1254, 368, 'CLOSING', 4], [1254, 384, 'INTERLOCK', 4], [1254, 407, 'OPENING', 4], [1254, 423, 'INTERLOCK', 4]);
  box(1369, 363, 1468, 402);
  l.push([[1369, 383], [1468, 383]]);
  s.push(['k41c', 1369, 363, 1468, 383], ['k41o', 1369, 383, 1468, 402]);
  t.push([1369, 355, '(41)'], [1418, 373, 'CLOSE', 4], [1418, 392, 'OPEN', 4]);
  w.push(['cli', [[1296, 373], [1369, 373]]], ['opi', [[1296, 418], [1330, 418], [1330, 392], [1369, 392]]]);
  /* the AVR ON / OFF: 52G closed, the open commands, the trips and AVR major trouble */
  b.push(['nc2', 'NC', '', 848, 835, [], {}, [9]]);
  gate('a2', 'A', 927, 888, 824, 943);
  gate('or2', 'OR', 848, 972, 887, 1052);
  gate('a3', 'A', 1056, 842, 825, 861);
  gate('orf', 'OR', 1056, 887, 869, 905);
  w.push(
    ['i8', [[282, 835], [839, 835]], 0, 0],
    ['nc2', [[857, 835], [927, 835]]],
    ['pop', [[503, 566], [582, 566], [582, 895], [848, 895]]],
    ['or2', [[866, 972], [886, 972], [886, 934], [927, 934]]],
    ['a2', [[945, 888], [1056, 888]]],
    ['a3', [[1075, 842], [1212, 842]]],
    ['orf', [[1074, 887], [1212, 887]]]
  );
  dbox(1212, 825, 1296, 903);
  e.push([[1212, 864], [1296, 864]]);
  s.push(['oni', 1212, 825, 1296, 864], ['ofi', 1212, 864, 1296, 903]);
  t.push([1254, 836, 'ON', 4], [1254, 852, 'INTERLOCK', 4], [1254, 875, 'OFF', 4], [1254, 891, 'INTERLOCK', 4]);
  box(1369, 857, 1468, 895);
  l.push([[1369, 876], [1468, 876]]);
  s.push(['avon', 1369, 857, 1468, 876], ['avof', 1369, 876, 1468, 895]);
  t.push([1369, 849, 'AVR'], [1418, 866, 'ON', 4], [1418, 886, 'OFF', 4]);
  w.push(['oni', [[1296, 842], [1331, 842], [1331, 866], [1369, 866]]], ['ofi', [[1296, 886], [1369, 886]]]);
  /* the state of 41 back into the logic */
  w.push(
    ['k41c', [[1525, 372], [1525, 549], [1160, 549], [1160, 743], [1019, 743], [1019, 833], [1056, 833]]],
    ['avof', [[1468, 886], [1525, 886], [1525, 805], [1134, 805], [1134, 429], [1160, 429]]]
  );
  j.push([1525, 372]);
  /* the AVR signals: [key, line, words] */
  [
    ['vra', 647, 'VOLTAGE REGULATOR "AUTO"'],
    ['vrm', 693, 'VOLTAGE REGULATOR "MANUAL"'],
    ['amt', 769, 'AVR MAJOR TROUBLE (NOTE(1))'],
    ['amn', 1005, 'AVR MINOR TROUBLE'],
    ['pss', 1077, 'PSS']
  ].forEach(([k, y, z]) => {
    box(1297, y - 16, 1631, y + 16);
    l.push([[1567, y - 16], [1567, y + 16]]);
    t.push([1432, y, z, 4], [1599, y, 'ON', 4]);
    s.push([k, 1567, y - 16, 1631, y + 16]);
  });
  /* AVR major trouble opens 41 and switches the AVR off */
  w.push(
    ['amt', [[1657, 946], [966, 946], [966, 744], [887, 744], [887, 462], [927, 462]]],
    ['amt', [[992, 946], [992, 898], [1056, 898]]]
  );
  j.push([992, 946]);
  /* the outputs */
  b.push(['ncm', 'NC', '', 1891, 1042, [], {}, [9]], ['ncp', 'NC', '', 1891, 1107, [], {}, [9]]);
  o.push([1930, 289, 5], [1930, 447, 5]);
  l.push([[1930, 284], [1930, 272]], [[1930, 272], [1940, 272]], [[1930, 442], [1930, 430]], [[1930, 430], [1940, 430]]);
  w.push(
    ['k41c', [[1468, 372], [1964, 372]]],
    ['k41c', [[1759, 372], [1759, 203], [1959, 203]]],
    ['k41c', [[1837, 372], [1837, 289], [1925, 289]], 0, 0],
    ['k41c', [[1935, 289], [1960, 289]]],
    ['k41o', [[1468, 392], [1657, 392], [1657, 575], [1963, 575]]],
    ['k41o', [[1657, 405], [1964, 405]]],
    ['k41o', [[1837, 405], [1837, 447], [1925, 447]], 0, 0],
    ['k41o', [[1935, 447], [1960, 447]]],
    ['k41o', [[1657, 527], [1963, 527]]],
    ['vra', [[1631, 647], [1964, 647]]],
    ['vrm', [[1631, 693], [1963, 693]]],
    ['amt', [[1631, 769], [1964, 769]]],
    ['amt', [[1657, 769], [1657, 946], [1962, 946]]],
    ['amt', [[1657, 819], [1964, 819]]],
    ['amt', [[1657, 910], [1962, 910]]],
    ['avon', [[1468, 866], [1963, 866]]],
    ['amn', [[1631, 1005], [1964, 1005]]],
    ['amn', [[1839, 1005], [1839, 1042], [1882, 1042]], 0, 0],
    ['ncm', [[1900, 1042], [1964, 1042]]],
    ['pss', [[1631, 1077], [1963, 1077]]],
    ['pss', [[1839, 1077], [1839, 1107], [1882, 1107]], 0, 0],
    ['ncp', [[1900, 1107], [1963, 1107]]]
  );
  j.push([1759, 372], [1837, 372], [1657, 405], [1837, 405], [1657, 527], [1657, 769], [1657, 819], [1657, 910], [1657, 946], [1839, 1005], [1839, 1077]);
  circ(1972, 203, '1', 'SH-G-1B', 1991);
  circ(1975, 910, '3', 'SH-G-5A', 1994);
  circ(1975, 946, '4', 'SH-G-6A', 1994);
  tag(372, 'ATS');
  tag(405, 'ATS');
  tag(647, 'ATS');
  tag(769, 'ANN');
  tag(819, 'SOE');
  tag(1005, 'ANN');
  tag(1042, 'ATS');
  t.push(
    [1941, 194, '41 CLOSED', 2],
    [1944, 273, 'DATA LINK'],
    [1968, 290, 'DCS'],
    [1963, 350, '(41 CLOSED)'],
    [1963, 388, '(41 OPENED)'],
    [1944, 431, 'DATA LINK'],
    [1968, 448, 'DCS'],
    [1969, 520, 'FOR ES INTERLOCK'],
    [1969, 533, '(GMCB)'],
    [1969, 570, 'FOR 52G CLOSE INTERLOCK'],
    [1969, 583, '(AT LOCAL SIDE)'],
    [1963, 628, '(AVR IN AUTO)'],
    [1969, 694, '(TCS)'],
    [1948, 760, 'AVR MAJOR TROUBLE', 2],
    [1969, 867, '(TCS)'],
    [1945, 901, 'AVR MAJOR TROUBLE', 2],
    [1945, 937, 'AVR MAJOR TROUBLE', 2],
    [1949, 996, 'AVR MINOR TROUBLE', 2],
    [1969, 1024, '(AVR OK)'],
    [1969, 1078, '(PSS ON)'],
    [1969, 1108, '(PSS OFF)']
  );
  /* the AVR states to the TCS */
  [
    ['abk', 1449, 1205],
    ['apt', 1422, 1231],
    ['bat', 1395, 1256]
  ].forEach(([k, x, y]) => {
    s.push([k, x - 3, 1115, x + 3, 1121]);
    w.push([k, [[x, 1121], [x, y], [1960, y]]]);
    t.push([1969, y + 1, '(TCS)']);
  });
  t.push([2012, 1200, 'AVR FAILURE TO BACKUP'], [2012, 1213, 'STATUS'], [2012, 1232, 'PRIMARY AVR TROUBLE'], [2012, 1257, 'BACKUP AVR TROUBLE']);
  /* the marks: the signal also goes to that panel */
  mark(695, 306, 331, '(AVR)', '(TCS)', [318], 1);
  mark(695, 368, 447, '(AVR)', '(GPP)', [381, 432], 1);
  mark(695, 457, 502, '(AVR)', '(TCS)', [479], 1);
  mark(695, 532, 562, '(AVR)', '(TCS)', [547], 1);
  mark(695, 882, 911, '(AVR)', '(TCS)', [895], 1);
  mark(695, 958, 987, '(AVR)', '(TCS)', [972], 1);
  mark(695, 1025, 1054, '(AVR)', '(TCS)', [1040], 1);
  mark(1823, 180, 224, '(GCP)', '(AVR)', [203], 1);
  mark(1898, 274, 305, '(TCS)', 'OTHERS', [289]);
  mark(1776, 358, 422, '(TCS)', '(AVR)', [372, 405], 1);
  mark(1898, 432, 462, '(TCS)', 'OTHERS', [447]);
  mark(1760, 513, 590, 'OTHERS', '(AVR)', [527, 575], 1);
  mark(1760, 631, 662, '(TCS)', '(AVR)', [647], 1);
  mark(1760, 677, 708, '(TCS)', '(AVR)', [693], 1);
  mark(1760, 754, 784, '(TCS)', '(AVR)', [769], 1);
  mark(1760, 804, 834, 'OTHERS', '(AVR)', [819], 1);
  mark(1760, 849, 879, '(TCS)', '(AVR)', [866], 1);
  mark(1760, 884, 958, '(GPP)', '(AVR)', [910, 946], 1);
  mark(1760, 987, 1018, '(TCS)', '(AVR)', [1005], 1);
  mark(1760, 1061, 1093, '(TCS)', '(AVR)', [1077], 1);
  mark(1581, 1186, 1271, '(TCS)', '(AVR)', [1205, 1231, 1256], 1);
  /* the note */
  [
    'NOTE',
    '(1) MAIN TRIP ITEMS OF "AVR MAJOR TROUBLE" ARE AS FOLLOWS.',
    '· FIELD CIRCUIT OVERCURRENT PROTECTION (INSTANTANEOUS / INVERSE TIME)',
    '· VOLTS PER HERTZ PROTECTION',
    '· LOSS OF EXCITATION PROTECTION',
    '· TWO CONVERTER FAILURE',
    '· CROWBAR FAILURE',
    '· FIELD FLASH, FAULT'
  ].forEach((z, i) => t.push([i === 0 ? 507 : i === 1 ? 516 : 537, 1364 + 14.6 * i, z]));
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'G-4',
    title: 'FIELD SWITCH (41) LOGIC',
    page: 12,
    dwg: '310SD03-743',
    of: 20,
    f: [205, 128, 2177, 1520],
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
