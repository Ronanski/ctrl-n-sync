/* TCE152 CV WARMING CONTROL(3) (331DM09784 page 109, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The scan of this page is turned a little; every place is typed as it stands on the page set straight (one x for each upright
   line, one y for each level line).
   DURING CV WARMING CONTROL: set by MAN OPE, or by CV WARMING AUTO with the start order, while the CV warming mode is set; reset by CV
   warming complete (manual), LLM not lower, a turbine trip or the mode reset. CV WARMING COMPLETE: set by the manual complete, by the lower
   limit with LLM lower, or by the ATS, when the crack open sequence allows it; reset by a turbine trip. Also the two conditions of the
   warming complete (CV(B) outer temperature, the outer / inner difference and the 3600.0 s pulse), TURBINE START PERMISSIVE and the
   permission of the close signal. The title block of this page prints PAGE 107; it is page 109 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    b = [],
    w = [],
    t = [],
    mark = (no, x, y) => b.push(['m' + no, 'o:BTR', no, x, y]),
    box = (key, type, no, x, y, h, pins, w2, notes) =>
      b.push([key, type, no, x, y, notes || [], pins || {}, [w2 || 59, h || 43]]),
    ffr = (key, no, x, y) => box(key, 'FFR', no, x, y, 43, { l: ['S', 'R'] }, 80),
    out = (key, l, x, y, refs, dbl, under) => c.push([key, 'out', l, x, y, '', refs, dbl || 0, under || 0]),
    two = (x, y, a, b2) => t.push([x, y - 27, a], [x, y - 6, b2]),
    W = (k, pts, thick) => w.push(thick ? [k, pts, 1] : [k, pts]);
  c.push(
    ['iG', 'in', 'G', 304, 230, 'MAN OPE', ['TCE151']],
    ['iAa', 'in', 'A', 303, 305, 'CV WARMING AUTO', ['TCE151']],
    ['iMode', 'in', 'A', 302, 369, 'CV WARMING MODE SET', ['TCE150']],
    ['iB', 'in', 'B', 301, 434, 'CV CHEST WARMING START', ['TCE150']],
    ['iC', 'in', 'C', 299, 626, 'CV WARMING COMPLETE(MANUAL)', ['TCE151']],
    ['iLLM', 'in', 'F', 297, 776, 'LLM LOWER', ['TCE205']],
    ['iF', 'in', 'F', 296, 828, '', ['TCE155']],
    ['iF2', 'in', 'F2', 296, 881, 'CRACK OPEN DETECT', ['TCE155']],
    ['iT1', 'in', 'B3', 295, 1008, 'CV(B) OUTER TEMP.', ['TCA363'], 1],
    ['iT2', 'in', 'B3', 294, 1093, 'CV(B) INNER TEMP.', ['TCA359'], 1],
    ['iBl', 'in', 'B', 282, 1243, '', ['TCE154']],
    ['iFa', 'in', 'F', 292, 1317, 'CV WARMING COMPLETE(ATS)', ['TCA580'], 1]
  );
  out('oZ1', 'Z1', 2081, 223, ['TCA541'], 1);
  out('oA', 'A', 2080, 305, ['TCE053', 'TCE153', 'TCE154']);
  out('oG', 'G', 2080, 393, ['-']);
  out('oF', 'F', 2078, 542, ['TCE210', 'TCE211']);
  out('oB', 'B', 2077, 627, ['TCE053', 'TCE150', 'TCE151', 'TCE155', 'TCE503'], 0, 3);
  out('oB1', 'B1', 2075, 776, ['TCA615'], 1, 1);
  out('oZ2', 'Z2', 2073, 851, ['TCA511'], 1);
  out('oF1', 'F1', 2073, 905, ['TCE150']);
  out('oE', 'E', 2073, 945, ['TCE153', 'TCE154']);
  out('oC', 'C', 2073, 1008, ['-']);
  out('oD', 'D', 2072, 1180, ['-']);
  box('a2', 'A', '002', 708, 241);
  box('a3', 'A', '003', 708, 337, 85);
  box('not7', 'NOT', '007', 706, 466);
  box('or6', 'OR', '006', 899, 424, 85);
  box('or4', 'OR', '004', 1124, 316);
  ffr('ffr5', '005', 1539, 316);
  box('not29', 'NOT', '029', 1537, 404);
  box('a30', 'A', '030', 1675, 404);
  box('not8', 'NOT', '008', 1673, 553);
  box('or9', 'OR', '009', 704, 637);
  box('td', 'TD', 'A013', 971, 680, 43, {}, 59, ['TD:1.0s']);
  box('a10', 'A', '010', 1121, 637);
  box('not15', 'NOT', '015', 970, 765);
  box('a16', 'A', '016', 1119, 776, 64);
  box('or11', 'OR', '011', 1269, 648, 64);
  box('a34', 'A', '034', 1397, 637);
  ffr('ffr12', '012', 1535, 638);
  box('not18', 'NOT', '018', 703, 786);
  box('not36', 'NOT', '036', 1097, 860);
  box('or35', 'OR', '035', 1257, 839);
  box('uck', 'UCK', 'C021', 701, 1019, 43, {}, 59, ['K:180.0DEGC']);
  box('sub', 'SUB', '024', 700, 1104);
  box('lck', 'LCK', 'C025', 818, 1104, 43, {}, 59, ['K:50.0DEGC']);
  box('a22', 'A', '022', 1117, 1019);
  box('not23', 'NOT', '023', 1668, 1019);
  box('tp', 'TP', 'C026', 1020, 1158, 43, {}, 59, ['TP:3600.0s']);
  box('a28', 'A', '028', 699, 1233);
  box('or27', 'OR', '027', 1667, 1201, 64);
  box('a33', 'A', '033', 698, 1328);
  /* the crossed circles on the two lines that come back from the right */
  b.push(['x1', 'X', '', 1122, 511], ['x2', 'X', '', 651, 648]);
  /* INITIAL: to the top of the delay and of the pulse */
  W('kInit', [
    [521, 156],
    [971, 156],
    [971, 658]
  ]);
  W('kInit', [
    [971, 605],
    [1020, 605],
    [1020, 1136]
  ]);
  /* during CV warming control: the set */
  W('iG', [
    [331, 230],
    [679, 230]
  ]);
  W('a2', [
    [738, 230],
    [1071, 230],
    [1071, 327],
    [1094, 327]
  ]);
  W('iAa', [
    [330, 305],
    [679, 305]
  ]);
  W('iMode', [
    [329, 369],
    [634, 369]
  ]);
  W('iMode', [
    [679, 252],
    [634, 252],
    [634, 456],
    [677, 456]
  ]);
  W('iMode', [
    [634, 348],
    [679, 348]
  ]);
  W('iB', [
    [328, 434],
    [654, 434],
    [654, 370],
    [679, 370]
  ]);
  W('a3', [
    [738, 305],
    [1094, 305]
  ]);
  W('or4', [
    [1154, 305],
    [1499, 305]
  ]);
  /* the reset */
  W('not7', [
    [736, 456],
    [870, 456]
  ]);
  W('or6', [
    [929, 392],
    [1454, 392],
    [1454, 327],
    [1499, 327]
  ]);
  W('iC', [
    [326, 626],
    [675, 626]
  ]);
  W('iC', [
    [609, 626],
    [609, 1222],
    [670, 1222]
  ]);
  W('or9', [
    [734, 626],
    [1091, 626]
  ]);
  W('or9', [
    [801, 626],
    [801, 392],
    [870, 392]
  ]);
  W('or9', [
    [897, 626],
    [897, 806],
    [1044, 806],
    [1044, 776],
    [1090, 776]
  ]);
  W('iLLM', [
    [324, 776],
    [674, 776]
  ]);
  W('iLLM', [
    [650, 776],
    [650, 818],
    [1066, 818],
    [1066, 797],
    [1090, 797]
  ]);
  W('not18', [
    [733, 776],
    [821, 776],
    [821, 413],
    [870, 413]
  ]);
  /* turbine trip: the two resets, and the permission of the close signal */
  W('kTrip', [
    [513, 945],
    [2046, 945]
  ]);
  W('kTrip', [
    [844, 945],
    [844, 435],
    [870, 435]
  ]);
  W('kTrip', [
    [1471, 945],
    [1471, 393],
    [1508, 393]
  ]);
  W('kTrip', [
    [1471, 648],
    [1495, 648]
  ]);
  /* during CV warming control: the outputs, the delay and the pulse */
  W('ffr5', [
    [1579, 305],
    [1601, 305]
  ]);
  W('ffr5', [
    [1601, 305],
    [2053, 305]
  ]);
  W('ffr5', [
    [2054, 223],
    [1601, 223],
    [1601, 542],
    [918, 542],
    [918, 1147],
    [990, 1147]
  ]);
  W('ffr5', [
    [918, 669],
    [941, 669]
  ]);
  W('ffr5', [
    [918, 754],
    [941, 754]
  ]);
  W('not29', [
    [1567, 393],
    [1645, 393]
  ]);
  W('a30', [
    [1705, 393],
    [2053, 393]
  ]);
  /* CV warming complete */
  W('td', [
    [1001, 669],
    [1067, 669],
    [1067, 648],
    [1091, 648]
  ]);
  W('a10', [
    [1151, 626],
    [1240, 626]
  ]);
  W('not15', [
    [1000, 754],
    [1090, 754]
  ]);
  W('a16', [
    [1149, 754],
    [1195, 754],
    [1195, 648],
    [1240, 648]
  ]);
  W('a33', [
    [728, 1317],
    [1212, 1317],
    [1212, 669],
    [1240, 669]
  ]);
  W('or11', [
    [1299, 626],
    [1367, 626]
  ]);
  W('a34', [
    [1427, 626],
    [1495, 626]
  ]);
  W('ffr12', [
    [1575, 627],
    [1620, 627]
  ]);
  W('ffr12', [
    [1645, 415],
    [1620, 415],
    [1620, 851],
    [2046, 851]
  ]);
  W('ffr12', [
    [1620, 542],
    [1644, 542]
  ]);
  W('ffr12', [
    [1620, 627],
    [2050, 627]
  ]);
  W('ffr12', [
    [1620, 712],
    [1987, 712]
  ]);
  W('ffr12', [
    [1620, 776],
    [2048, 776]
  ]);
  W('not8', [
    [1703, 542],
    [2051, 542]
  ]);
  W('not8', [
    [1748, 542],
    [1748, 511],
    [611, 511],
    [611, 327],
    [679, 327]
  ]);
  /* the crack open sequence */
  W('iF', [
    [323, 828],
    [1228, 828]
  ]);
  W('iF2', [
    [323, 881],
    [1057, 881],
    [1057, 850],
    [1067, 850]
  ]);
  W('not36', [
    [1127, 850],
    [1228, 850]
  ]);
  W('or35', [
    [1287, 828],
    [1355, 828]
  ]);
  W('or35', [
    [1367, 648],
    [1355, 648],
    [1355, 905],
    [2046, 905]
  ]);
  /* the conditions of the warming complete */
  W(
    'iT1',
    [
      [322, 1008],
      [671, 1008]
    ],
    1
  );
  W(
    'iT1',
    [
      [627, 1008],
      [627, 1115],
      [671, 1115]
    ],
    1
  );
  W(
    'iT2',
    [
      [321, 1093],
      [671, 1093]
    ],
    1
  );
  W(
    'sub',
    [
      [730, 1093],
      [789, 1093]
    ],
    1
  );
  W('uck', [
    [731, 1008],
    [1087, 1008]
  ]);
  W('lck', [
    [848, 1093],
    [1063, 1093],
    [1063, 1030],
    [1087, 1030]
  ]);
  W('a22', [
    [1147, 1008],
    [1639, 1008]
  ]);
  W('a22', [
    [1615, 1008],
    [1615, 1180],
    [1637, 1180]
  ]);
  W('not23', [
    [1698, 1008],
    [2046, 1008]
  ]);
  W('tp', [
    [1050, 1147],
    [1593, 1147],
    [1593, 1201],
    [1637, 1201]
  ]);
  W('iBl', [
    [309, 1243],
    [670, 1243]
  ]);
  W('a28', [
    [729, 1222],
    [1637, 1222]
  ]);
  W('or27', [
    [1697, 1180],
    [2045, 1180]
  ]);
  W('or27', [
    [1742, 1180],
    [1742, 970],
    [630, 970],
    [630, 648],
    [675, 648]
  ]);
  W('iFa', [
    [319, 1317],
    [669, 1317]
  ]);
  W('kAts', [
    [509, 1391],
    [645, 1391],
    [645, 1338],
    [669, 1338]
  ]);
  [
    ['001', 1676, 223],
    ['031', 1760, 393],
    ['014', 1671, 712],
    ['017', 1670, 776],
    ['019', 1670, 851],
    ['020', 1669, 945]
  ].forEach(([no, x, y]) => mark(no, x, y));
  t.push(
    [432, 187, '(TCE050)'],
    [423, 971, '(TCE053)'],
    [420, 1418, '(TCE051)'],
    [1486, 297, 'T'],
    [1482, 618, 'T'],
    [976, 1140, 'T'],
    [929, 661, 'C'],
    [1790, 217, 'DURING CV WARMING CONTROL'],
    [1786, 299, 'DURING CV WARMING CONTROL'],
    [1788, 387, 'TURBINE START PERMISSIVE'],
    [1783, 536, 'CV WARMING NOT COMPLETE'],
    [1782, 621, 'CV WARMING COMPLETE'],
    [1784, 706, 'CV WARMING COMPLETE'],
    [1783, 770, 'CV WARMING COMPLETE'],
    [1783, 845, 'CV WARMING COMPLETE'],
    [1782, 939, 'PERMISSION OF CLOSE SIGNAL'],
    [227, 1523, 'CONTROLLER:'],
    [387, 1523, 'EHG+MD'],
    [611, 1497, 'TRIGGER  :'],
    [611, 1524, 'CYCLE(ms):30']
  );
  two(329, 822, 'CV(B) CRACK OPEN', 'SEQUENCE COMPLETE');
  two(315, 1237, 'CV WARMING(LOWER)', 'COMPLETE(PATTARN1)');
  two(1779, 1008, 'NOT CV WARM COMP.', 'CONDITION');
  two(1777, 1178, 'CV WARMING COMPLETE5', 'CONDITION');
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'TCE152',
    title: 'CV WARMING CONTROL(3)',
    page: 109,
    ctl: 'EHG+MD',
    cycle: 30,
    f: [160, 82, 2222, 1543],
    /* live: the engine's state of the signals named on this sheet (tcs.js tcsLiveRead) */
    live: { kTrip: 'trip', kAts: 'auto' },
    c,
    k: [
      ['kInit', 287, 156, 'INITIAL', 'ref'],
      ['kTrip', 279, 945, 'TURBINE TRIP', 'ref'],
      ['kAts', 275, 1391, 'ATS AUTO(C)', 'ref']
    ],
    d: [['crt', 2022, 712, 'out', 'TCE150_1_IIC', 'S', '#1C']],
    b,
    w,
    t
  });
})();
