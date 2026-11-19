/* TCE153 CV WARMING CONTROL(4) (331DM09784 page 110, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The scan of this page is turned a little; every place is typed as it stands on the page set straight (one x for each upright
   line, one y for each level line).
   The upper CV during CV warming control. FULL OPEN SIGNAL: set for 0.5 s when the warming control starts, or when the upper set is under
   -0.1 %, the inner / outer temperature difference under 80.0 degC, pattern 1 not yet complete and CV WARMING AUTO is on; reset when the
   warming control ends, the upper set is over 99.9 %, a turbine trip or the mode reset, or the full close signal comes. CV WARMING(B)
   COMPLETE(PATTARN1) and the FULL CLOSE SIGNAL follow from the 180.0 s, 120.0 s and 60.0 s timers. The title block of this page prints
   PAGE 108; it is page 110 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    b = [],
    w = [],
    t = [],
    box = (key, type, no, x, y, h, pins, w2, notes) =>
      b.push([key, type, no, x, y, notes || [], pins || {}, [w2 || 59, h || 43]]),
    ffr = (key, no, x, y) => box(key, 'FFR', no, x, y, 43, { l: ['S', 'R'] }, 80),
    two = (x, y, a, b2) => t.push([x, y - 27, a], [x, y - 6, b2]),
    W = (k, pts, thick) => w.push(thick ? [k, pts, 1] : [k, pts]),
    /* the upright lines of the bus at the left of the blocks */
    V1 = 776,
    V2 = 795,
    V3 = 816,
    V4 = 836,
    VC = 710,
    VD = 729,
    VE = 752;
  c.push(
    ['iA', 'in', 'A', 309, 254, 'DURING CV WARMING CONTROL', ['TCE152']],
    ['iUp', 'in', 'A', 306, 532, 'WARMING (UPPER) SET', ['TCE155']],
    ['iTi', 'in', 'B3', 304, 638, '', ['-'], 1],
    ['iTo', 'in', 'B3', 303, 745, '', ['-'], 1],
    ['iBc', 'in', 'B', 301, 851, '', ['*']],
    ['iAuto', 'in', 'A', 300, 936, 'CV WARMING AUTO', ['TCE151']],
    ['iE', 'in', 'E', 299, 1032, 'PERMISSION OF CLOSE SIGNAL', ['TCE152']],
    ['iF', 'in', 'F', 297, 1213, 'MSV(A) FULL OPEN', ['TCE121']],
    ['iMode', 'in', 'A', 296, 1276, 'CV WARMING MODE SET', ['TCE150']],
    ['oA', 'out', 'A', 2088, 254, '', ['-']],
    ['oB', 'out', 'B', 2085, 586, '', ['-', '*']],
    ['oC', 'out', 'C', 2082, 874, '', ['-']]
  );
  box('tw', 'TW', 'C001', 896, 265, 43, {}, 59, ['TW:0.5s']);
  box('or2', 'OR', '002', 1205, 265);
  ffr('ffr3', '003', 1779, 265);
  box('tp4', 'TP', 'C004', 1501, 330, 43, {}, 59, ['TP:180.0s']);
  box('a5', 'A', '005', 895, 394, 107);
  box('lck6', 'LCK', 'C006', 628, 382, 43, {}, 59, ['K:-0.1%']);
  box('not8', 'NOT', '008', 894, 490);
  box('or7', 'OR', '007', 1202, 512, 85);
  box('uck9', 'UCK', 'C009', 626, 542, 43, {}, 59, ['K:99.9%']);
  box('a10', 'A', '010', 1647, 607, 64);
  ffr('ffr11', '011', 1776, 597);
  box('a12', 'A', '012', 892, 650, 64);
  box('tp13', 'TP', 'C013', 1201, 639, 43, {}, 59, ['TP:120.0s']);
  ffr('ffr14', '014', 1498, 639);
  box('sub', 'SUB', '015', 518, 649);
  box('lck16', 'LCK', 'C016', 625, 649, 43, {}, 59, ['K:80.0DEGC']);
  box('not17', 'NOT', '017', 1646, 725);
  box('uck18', 'UCK', 'C018', 623, 756, 43, {}, 59, ['K:90.0DEGC']);
  box('or19', 'OR', '019', 1496, 895, 64);
  ffr('ffr20', '020', 1773, 885);
  box('td', 'TD', 'C021', 1198, 905, 43, {}, 59, ['TD:60.0s']);
  box('a22', 'A', '022', 1337, 916, 64);
  box('not23', 'NOT', '023', 1197, 990);
  box('a24', 'A', '024', 887, 1128, 128);
  box('or26', 'OR', '026', 1047, 1224);
  box('or27', 'OR', '027', 1492, 1288, 64);
  box('not28', 'NOT', '028', 618, 1286);
  box('not29', 'NOT', '029', 1046, 1319);
  box('or30', 'OR', '030', 884, 1361);
  /* the crossed circles on the two lines that come back from the right */
  b.push(['x1', 'X', '', 1497, 767], ['x2', 'X', '', 1497, 798]);
  /* INITIAL: to the top of the four timers */
  W('kInit', [
    [527, 170],
    [1501, 170],
    [1501, 308]
  ]);
  W('kInit', [
    [897, 170],
    [897, 243]
  ]);
  W('kInit', [
    [1139, 170],
    [1139, 862],
    [1198, 862],
    [1198, 883]
  ]);
  W('kInit', [
    [1139, 597],
    [1201, 597],
    [1201, 617]
  ]);
  /* during CV warming control and its bus */
  W('iA', [
    [336, 254],
    [866, 254]
  ]);
  W('iA', [
    [V1, 254],
    [V1, 1117],
    [857, 1117]
  ]);
  W('iA', [
    [V1, 319],
    [1472, 319]
  ]);
  W('iA', [
    [V1, 351],
    [865, 351]
  ]);
  W('iA', [
    [V1, 480],
    [864, 480]
  ]);
  W('iA', [
    [V1, 628],
    [862, 628]
  ]);
  W('iA', [
    [V1, 894],
    [1168, 894]
  ]);
  /* full open signal */
  W('tw', [
    [926, 254],
    [1175, 254]
  ]);
  W('a5', [
    [925, 351],
    [1120, 351],
    [1120, 276],
    [1175, 276]
  ]);
  W('or2', [
    [1235, 254],
    [1739, 254]
  ]);
  W('ffr3', [
    [1819, 254],
    [2061, 254]
  ]);
  W('not8', [
    [924, 480],
    [1172, 480]
  ]);
  W('or7', [
    [1232, 480],
    [1716, 480],
    [1716, 276],
    [1739, 276]
  ]);
  /* the upper set and the temperatures */
  W(
    'iUp',
    [
      [333, 532],
      [596, 532]
    ],
    1
  );
  W(
    'iUp',
    [
      [573, 532],
      [573, 372],
      [598, 372]
    ],
    1
  );
  W('lck6', [
    [658, 372],
    [865, 372]
  ]);
  W('lck6', [
    [V3, 372],
    [V3, 1267],
    [1463, 1267]
  ]);
  W('lck6', [
    [V3, 576],
    [1572, 576],
    [1572, 607],
    [1617, 607]
  ]);
  W('lck6', [
    [V3, 979],
    [1167, 979]
  ]);
  W('uck9', [
    [656, 532],
    [979, 532],
    [979, 501],
    [1172, 501]
  ]);
  W('uck9', [
    [VE, 532],
    [VE, 1139],
    [857, 1139]
  ]);
  W('uck9', [
    [VE, 649],
    [862, 649]
  ]);
  W(
    'iTi',
    [
      [331, 638],
      [489, 638]
    ],
    1
  );
  W(
    'iTo',
    [
      [330, 745],
      [466, 745],
      [466, 659],
      [489, 659]
    ],
    1
  );
  W(
    'sub',
    [
      [548, 638],
      [595, 638]
    ],
    1
  );
  W(
    'sub',
    [
      [571, 638],
      [571, 745],
      [593, 745]
    ],
    1
  );
  W('lck16', [
    [655, 638],
    [692, 638],
    [692, 394],
    [865, 394]
  ]);
  W('uck18', [
    [653, 745],
    [VD, 745],
    [VD, 1160],
    [857, 1160]
  ]);
  W('iBc', [
    [328, 851],
    [VC, 851]
  ]);
  W('iBc', [
    [865, 415],
    [VC, 415],
    [VC, 1181],
    [857, 1181]
  ]);
  W('iAuto', [
    [327, 936],
    [V2, 936]
  ]);
  W('iAuto', [
    [865, 436],
    [V2, 436],
    [V2, 1309],
    [1016, 1309]
  ]);
  W('iAuto', [
    [V2, 1075],
    [857, 1075]
  ]);
  /* CV warming (B) complete (pattern 1) */
  W('tp4', [
    [1531, 319],
    [1596, 319],
    [1596, 586],
    [1617, 586]
  ]);
  W('a12', [
    [922, 628],
    [1171, 628]
  ]);
  W('tp13', [
    [1231, 628],
    [1458, 628]
  ]);
  W('tp13', [
    [1403, 628],
    [1403, 874],
    [1467, 874]
  ]);
  W('ffr14', [
    [1538, 628],
    [1617, 628]
  ]);
  W('ffr14', [
    [1571, 628],
    [1571, 798],
    [V4, 798],
    [V4, 1096],
    [857, 1096]
  ]);
  W('ffr14', [
    [1571, 715],
    [1616, 715]
  ]);
  W('not17', [
    [1676, 715],
    [1711, 715],
    [1711, 767],
    [V4, 767],
    [V4, 671],
    [862, 671]
  ]);
  W('a10', [
    [1677, 586],
    [1736, 586]
  ]);
  W('ffr11', [
    [1816, 586],
    [2058, 586]
  ]);
  W('or26', [
    [1077, 1213],
    [1423, 1213],
    [1423, 650],
    [1458, 650]
  ]);
  W('or26', [
    [1423, 682],
    [1712, 682],
    [1712, 608],
    [1736, 608]
  ]);
  /* full close signal */
  W('td', [
    [1228, 894],
    [1307, 894]
  ]);
  W('not23', [
    [1227, 979],
    [1261, 979],
    [1261, 916],
    [1307, 916]
  ]);
  W('iE', [
    [326, 1032],
    [1282, 1032],
    [1282, 937],
    [1307, 937]
  ]);
  W('a22', [
    [1367, 894],
    [1467, 894]
  ]);
  W('a24', [
    [917, 1075],
    [1442, 1075],
    [1442, 916],
    [1467, 916]
  ]);
  W('or19', [
    [1526, 874],
    [1733, 874]
  ]);
  W('ffr20', [
    [1813, 874],
    [2055, 874]
  ]);
  W('or27', [
    [1522, 1267],
    [1708, 1267],
    [1708, 896],
    [1733, 896]
  ]);
  /* the resets */
  W('iF', [
    [324, 1213],
    [1017, 1213]
  ]);
  W('iMode', [
    [323, 1276],
    [588, 1276]
  ]);
  W('not28', [
    [648, 1276],
    [770, 1276],
    [770, 1350],
    [855, 1350]
  ]);
  W('kTrip', [
    [513, 1372],
    [855, 1372]
  ]);
  W('or30', [
    [914, 1350],
    [995, 1350],
    [995, 522],
    [1172, 522]
  ]);
  W('or30', [
    [995, 1235],
    [1017, 1235]
  ]);
  W('or30', [
    [995, 1288],
    [1463, 1288]
  ]);
  W('not29', [
    [1076, 1309],
    [1463, 1309]
  ]);
  W('not29', [
    [1113, 1309],
    [1113, 544],
    [1172, 544]
  ]);
  t.push(
    [440, 197, '(TCE050)'],
    [426, 1398, '(TCE053)'],
    [584, 512, '(UPPER SET)'],
    [1212, 608, '(PATTERN1)'],
    [853, 246, 'C'],
    [1726, 246, 'T'],
    [1459, 311, 'T'],
    [1157, 620, 'T'],
    [1446, 620, 'T'],
    [1722, 578, 'T'],
    [1155, 886, 'T'],
    [1720, 866, 'T'],
    [1853, 537, 'CV WARMING'],
    [1853, 558, '(B)COMPLETE'],
    [1853, 580, '(PATTARN1)'],
    [230, 1525, 'CONTROLLER:'],
    [391, 1525, 'EHG+MD'],
    [615, 1501, 'TRIGGER  :'],
    [615, 1527, 'CYCLE(ms):30']
  );
  two(337, 632, 'CV(UPPER)', 'INNER TEMP');
  two(336, 738, 'CV(UPPER)', 'OUTER TEMP');
  two(335, 845, 'CV WARMING(B)COMPL', 'ETE(PATTARN1)');
  two(1856, 254, 'FULL OPEN', 'SIGNAL');
  two(1850, 873, 'FULL CLOSE', 'SIGNAL');
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'TCE153',
    title: 'CV WARMING CONTROL(4)',
    page: 110,
    ctl: 'EHG+MD',
    cycle: 30,
    f: [160, 80, 2214, 1543],
    c,
    k: [
      ['kInit', 293, 170, 'INITIAL', 'ref'],
      ['kTrip', 279, 1372, 'TURBINE TRIP', 'ref']
    ],
    b,
    w,
    t
  });
})();
