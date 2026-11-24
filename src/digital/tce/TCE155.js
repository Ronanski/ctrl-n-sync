/* TCE155 CV WARMING CONTROL(5) (331DM09784 page 112, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The scan of this page is turned a little; every place is typed as it stands on the page set straight (one x for each upright
   line, one y for each level line).
   The CV warming set of the upper and of the lower CV: each CV WARMING SET block opens on the full open signal (or the manual full open),
   closes on the full close signal, the manual full close or the warming reset, at the opening / closing speed 6.67 %, between the full
   open position 100.0 % and the full close position -5.0 %. Under it the CV(B) crack open sequence: start (from the ATS or the operator,
   when the crack open is detected), complete, the CRT permission and the lamps. The title block of this page prints PAGE 110; it is page
   112 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    d = [],
    b = [],
    w = [],
    t = [],
    mark = (type, no, x, y) => b.push(['m' + no, 'o:' + type, no, x, y]),
    box = (key, type, no, x, y, h, pins, w2, notes) =>
      b.push([key, type, no, x, y, notes || [], pins || {}, [w2 || 59, h || 43]]),
    ffr = (key, no, x, y) => box(key, 'FFR', no, x, y, 43, { l: ['S', 'R'] }, 80),
    inn = (key, l, x, y, name, refs, dbl) => c.push([key, 'in', l, x, y, name, refs, dbl || 0]),
    out = (key, l, x, y, refs, dbl) => c.push([key, 'out', l, x, y, '', refs, dbl || 0]),
    lamp = (key, x, y, tag) => d.push([key, x, y, 'out', tag, 'S', '#1C']),
    two = (x, y, a, b2) => t.push([x, y - 27, a], [x, y - 6, b2]),
    W = (k, pts, thick) => w.push(thick ? [k, pts, 1] : [k, pts]),
    PINS = ['FOPN', 'FCLS', 'RATE', 'OP.POS', 'CL.POS'],
    /* the parameter lines under a CV WARMING SET block: x of the two columns, y of the first line */
    notes = (x, y, xl) => [
      [xl, y - 24, '(LME131)'],
      [x, y, 'DEF TD:0.03S'],
      [x, y + 22, 'DEF K:-0.1%'],
      [x, y + 43, 'DEF R :1.0'],
      [x + 20, y + 64, 'M :10'],
      [x + 20, y + 86, 'HL:1.0'],
      [x + 20, y + 107, 'LL:0.0'],
      [x + 182, y, 'RATE RI:1.0'],
      [x + 208, y + 22, 'RD:1.0'],
      [x + 192, y + 43, 'DEF K:1'],
      [x + 192, y + 64, 'DEF K:-0.01%'],
      [x + 192, y + 86, 'DEF K:0.01%']
    ];
  inn('iA', 'A', 298, 199, 'FULL OPEN (UPPER) SIGNAL', ['TCE154']);
  inn('iD', 'D', 298, 252, 'CV WARMING FULL OPEN(MANUAL)', ['TCE151']);
  inn('iC', 'C', 297, 306, 'FULL CLOSE (UPPER) SIGNAL', ['TCE154']);
  inn('iE', 'E', 297, 359, '', ['TCE151']);
  inn('iZ3', 'Z3', 296, 412, 'CV WARMING RESET', ['TCE150']);
  inn('iF1', 'F1', 291, 987, '', ['TCE360']);
  inn('iB', 'B', 290, 1146, '', ['TCE152']);
  inn('iF', 'F', 290, 1242, '', ['*']);
  inn('iDr', 'D', 256, 1402, 'RSV(A) FULL OPEN', ['TCE226']);
  inn('iAr', 'A', 256, 1466, 'RSV(B) FULL OPEN', ['TCE226']);
  inn('iH', 'H', 1006, 1052, '', ['TCA580'], 1);
  inn('iEc', 'E', 1003, 1297, '', ['TCE212']);
  inn('iB3', 'B3', 971, 1371, 'MSV(B) FULL CLOSE', ['TCE220']);
  out('oA1', 'A1', 2078, 126, ['-'], 1);
  out('oC', 'C', 2078, 199, ['TCE210']);
  out('oA', 'A', 2077, 307, ['TCE153']);
  out('oA2', 'A2', 2075, 563, ['-'], 1);
  out('oD', 'D', 2073, 636, ['TCE211', 'TCE503']);
  out('oB', 'B', 2072, 745, ['TCE154']);
  out('oF2', 'F2', 1560, 828, ['TCE152']);
  out('oE2', 'E2', 1560, 871, ['TCA566'], 1);
  out('oE', 'E', 2070, 987, ['TCE053', 'TCE212']);
  out('oF1', 'F1', 2067, 1245, ['TCA566'], 1);
  out('oF', 'F', 2066, 1297, ['*', 'TCE152']);
  lamp('dIyk', 1558, 935, 'TCE155_1_IYK');
  lamp('dIyl', 2015, 1064, 'TCE155_1_IYL');
  lamp('dIpc', 2014, 1191, 'TCE155_1_IPC');
  lamp('dIyp', 886, 1338, 'TCE155_1_IYP');
  d.push(['dIcs', 1005, 1147, 'in', 'TCE155_1_ICS', 'R'], ['dIys', 1005, 1222, 'in', 'TCE155_1_IYS', 'R']);
  /* the CV warming set of the upper CV (A002) and of the lower CV (A011) */
  box('or1', 'OR', '001', 779, 210);
  box('or17', 'OR', '017', 778, 327, 64);
  box('sg5', 'SG', 'C005', 489, 466);
  box('sg6', 'SG', 'C006', 489, 530);
  box('sg7', 'SG', 'C007', 488, 594);
  box('g3', 'G', 'C003', 1525, 210, 43, {}, 59, ['K:0.037']);
  box('or10', 'OR', '010', 775, 647);
  box('or38', 'OR', '038', 775, 721, 64);
  box('sg14', 'SG', 'C014', 486, 766);
  box('sg15', 'SG', 'C015', 486, 828);
  box('sg16', 'SG', 'C016', 485, 892);
  box('g12', 'G', 'C012', 1520, 647, 43, {}, 59, ['K:0.0366']);
  mark('FTR', '008', 1524, 126);
  mark('FTR', '009', 1520, 563);
  W('iA', [
    [325, 199],
    [749, 199]
  ]);
  W('iA', [
    [640, 199],
    [640, 636],
    [745, 636]
  ]);
  W('iD', [
    [325, 252],
    [693, 252]
  ]);
  W('iD', [
    [749, 221],
    [693, 221],
    [693, 658],
    [745, 658]
  ]);
  W('iC', [
    [324, 306],
    [748, 306]
  ]);
  W('iC', [
    [620, 306],
    [620, 700],
    [745, 700]
  ]);
  W('iE', [
    [324, 359],
    [671, 359]
  ]);
  W('iE', [
    [748, 327],
    [671, 327],
    [671, 721],
    [745, 721]
  ]);
  W('iZ3', [
    [323, 412],
    [712, 412]
  ]);
  W('iZ3', [
    [748, 348],
    [712, 348],
    [712, 742],
    [745, 742]
  ]);
  W('or1', [
    [809, 199],
    [992, 199]
  ]);
  W('or17', [
    [808, 306],
    [906, 306],
    [906, 232],
    [992, 232]
  ]);
  W(
    'sg5',
    [
      [519, 455],
      [927, 455],
      [927, 264],
      [992, 264]
    ],
    1
  );
  W(
    'sg6',
    [
      [519, 519],
      [948, 519],
      [948, 296],
      [992, 296]
    ],
    1
  );
  W(
    'sg7',
    [
      [518, 583],
      [969, 583],
      [969, 329],
      [992, 329]
    ],
    1
  );
  W(
    'wsU.SET',
    [
      [1398, 199],
      [1440, 199]
    ],
    1
  );
  W(
    'wsU.SET',
    [
      [1440, 199],
      [1496, 199]
    ],
    1
  );
  W(
    'wsU.SET',
    [
      [2051, 126],
      [1440, 126],
      [1440, 307],
      [2050, 307]
    ],
    1
  );
  W(
    'g3',
    [
      [1555, 199],
      [2051, 199]
    ],
    1
  );
  W('or10', [
    [805, 636],
    [988, 636]
  ]);
  W('or38', [
    [805, 700],
    [946, 700],
    [946, 669],
    [988, 669]
  ]);
  W(
    'sg14',
    [
      [516, 755],
      [924, 755],
      [924, 701],
      [988, 701]
    ],
    1
  );
  W(
    'sg15',
    [
      [516, 817],
      [945, 817],
      [945, 733],
      [988, 733]
    ],
    1
  );
  W(
    'sg16',
    [
      [515, 881],
      [965, 881],
      [965, 766],
      [988, 766]
    ],
    1
  );
  W(
    'wsL.SET',
    [
      [1393, 636],
      [1436, 636]
    ],
    1
  );
  W(
    'wsL.SET',
    [
      [1436, 636],
      [1491, 636]
    ],
    1
  );
  W(
    'wsL.SET',
    [
      [2048, 563],
      [1436, 563],
      [1436, 745],
      [2045, 745]
    ],
    1
  );
  W(
    'g12',
    [
      [1550, 636],
      [2046, 636]
    ],
    1
  );
  /* the CV(B) crack open sequence */
  box('not18', 'NOT', '018', 538, 998);
  box('a19', 'A', '019', 675, 998);
  ffr('ffr20', '020', 921, 998);
  ffr('ffr22', '022', 1601, 998);
  box('or23', 'OR', '023', 1378, 1063);
  box('tw24', 'TW', '024', 674, 1157, 43, {}, 59, ['TW:3.0s']);
  box('or25', 'OR', '025', 793, 1157);
  box('a26', 'A', '026', 1250, 1158);
  box('tw27', 'TW', '027', 674, 1253, 43, {}, 59, ['TW:3.0s']);
  box('or28', 'OR', '028', 1598, 1308);
  ffr('ffr29', '029', 1716, 1308);
  box('not31', 'NOT', '031', 1216, 1382);
  box('or33', 'OR', '033', 1505, 1137, 64);
  box('tw34', 'TW', '034', 1323, 1212, 43, {}, 59, ['TW:3.0s']);
  box('a35', 'A', '035', 1495, 1009, 64);
  box('a36', 'A', '036', 502, 1455);
  box('tp37', 'TP', '037', 621, 1455, 43, {}, 59, ['TP:5.0S']);
  mark('BTR', '030', 672, 1338);
  mark('BTR', '032', 1824, 1191);
  W('iF1', [
    [318, 987],
    [509, 987]
  ]);
  W('not18', [
    [568, 987],
    [646, 987]
  ]);
  W('a19', [
    [705, 987],
    [881, 987]
  ]);
  /* turbine trip */
  W('kTrip', [
    [453, 1306],
    [589, 1306]
  ]);
  W('kTrip', [
    [646, 1009],
    [589, 1009],
    [589, 1413],
    [1665, 1413],
    [1665, 1319],
    [1676, 1319]
  ]);
  W('kTrip', [
    [1258, 1413],
    [1258, 1201],
    [1294, 1201]
  ]);
  /* INITIAL: to the top of the timers, and the CRT permission */
  W('kInit', [
    [476, 1061],
    [674, 1061],
    [674, 1136]
  ]);
  W('kInit', [
    [674, 1104],
    [1324, 1104],
    [1324, 1190]
  ]);
  W('kInit', [
    [621, 1061],
    [621, 1433]
  ]);
  W('kInit', [
    [621, 1210],
    [674, 1210],
    [674, 1231]
  ]);
  W('kInit', [
    [621, 1338],
    [851, 1338]
  ]);
  W('iB', [
    [317, 1146],
    [645, 1146]
  ]);
  W('tw24', [
    [704, 1146],
    [763, 1146]
  ]);
  W('iF', [
    [317, 1242],
    [644, 1242]
  ]);
  W('tw27', [
    [704, 1242],
    [737, 1242],
    [737, 1168],
    [763, 1168]
  ]);
  W('or25', [
    [823, 1146],
    [857, 1146],
    [857, 1009],
    [881, 1009]
  ]);
  /* crack open detect */
  W('ffr20', [
    [961, 987],
    [1467, 987]
  ]);
  W('ffr20', [
    [1315, 987],
    [1315, 828],
    [1533, 828]
  ]);
  W('ffr20', [
    [1315, 871],
    [1533, 871]
  ]);
  W('ffr20', [
    [1315, 935],
    [1523, 935]
  ]);
  /* sequence start */
  W('iH', [
    [1033, 1052],
    [1349, 1052]
  ]);
  W('dIcs', [
    [1040, 1147],
    [1221, 1147]
  ]);
  W('dIys', [
    [1040, 1222],
    [1210, 1222],
    [1210, 1169],
    [1221, 1169]
  ]);
  W('a26', [
    [1280, 1147],
    [1338, 1147],
    [1338, 1074],
    [1349, 1074]
  ]);
  W('or23', [
    [1408, 1052],
    [1435, 1052],
    [1435, 1009],
    [1466, 1009]
  ]);
  W('iDr', [
    [283, 1402],
    [462, 1402],
    [462, 1444],
    [472, 1444]
  ]);
  W('iAr', [
    [283, 1466],
    [472, 1466]
  ]);
  W('a36', [
    [532, 1444],
    [591, 1444]
  ]);
  W('tp37', [
    [651, 1444],
    [1410, 1444],
    [1410, 1094],
    [1448, 1094],
    [1448, 1030],
    [1466, 1030]
  ]);
  W('a35', [
    [1525, 987],
    [1561, 987]
  ]);
  W('ffr22', [
    [1641, 987],
    [2043, 987]
  ]);
  W('ffr22', [
    [1729, 987],
    [1729, 1064],
    [1980, 1064]
  ]);
  /* the reset of the start, and sequence complete */
  W('tw34', [
    [1353, 1201],
    [1445, 1201],
    [1445, 1137],
    [1476, 1137]
  ]);
  W('iB3', [
    [998, 1371],
    [1186, 1371]
  ]);
  W('not31', [
    [1246, 1371],
    [1431, 1371],
    [1431, 1116],
    [1476, 1116]
  ]);
  W('not31', [
    [1431, 1319],
    [1568, 1319]
  ]);
  W('or33', [
    [1535, 1116],
    [1551, 1116],
    [1551, 1009],
    [1561, 1009]
  ]);
  W('iEc', [
    [1030, 1297],
    [1568, 1297]
  ]);
  W('or28', [
    [1628, 1297],
    [1676, 1297]
  ]);
  W('ffr29', [
    [1756, 1297],
    [2039, 1297]
  ]);
  W('ffr29', [
    [1780, 1297],
    [1780, 1191]
  ]);
  W('ffr29', [
    [1979, 1191],
    [1463, 1191],
    [1463, 1158],
    [1476, 1158]
  ]);
  W('ffr29', [
    [1780, 1245],
    [2040, 1245]
  ]);
  t.push(
    [214, 456, 'OPENING/CLOSING SPEED'],
    [363, 486, 'K:6.67%'],
    [213, 520, 'FULL OPEN POSITION'],
    [363, 549, 'K:100.0%'],
    [212, 584, 'FULL CLOSE POSITION'],
    [362, 613, 'K:-5.0%'],
    [211, 755, 'OPENING/CLOSING SPEED'],
    [371, 784, 'K:6.67%'],
    [211, 818, 'FULL OPEN POSITION'],
    [360, 847, 'K:100.0%'],
    [210, 882, 'FULL CLOSE POSITION'],
    [370, 911, 'K:-5.0%'],
    [1798, 120, 'CV WARMING (UPPER) SET'],
    [1795, 193, 'CV WARMING (UPPER) SET'],
    [1796, 301, 'WARMING (UPPER) SET'],
    [1793, 557, 'CV WARMING (LOWER) SET'],
    [1790, 630, 'CV WARMING (LOWER) SET'],
    [1791, 739, 'WARMING (LOWER) SET'],
    [387, 1091, '(TCE050)'],
    [365, 1335, '(TCE053)'],
    [721, 1332, 'CRT PERM'],
    [1036, 1216, 'CRT AVAILABLE'],
    [985, 1126, '(#1C)', 0, 1.7],
    [985, 1200, '(#1C)', 0, 1.7],
    [867, 978, 'T'],
    [1547, 978, 'T'],
    [631, 1138, 'T'],
    [631, 1234, 'T'],
    [1280, 1192, 'T'],
    [1661, 1288, 'T'],
    [575, 1437, 'T'],
    [224, 1522, 'CONTROLLER:'],
    [385, 1522, 'EHG+MD'],
    [682, 1496, 'TRIGGER  :'],
    [682, 1523, 'CYCLE(ms):30']
  );
  two(329, 353, 'CV WARMING', 'FULL CLOSE(MANUAL)');
  two(324, 981, 'HP TURBINE WARMING', 'VALVE FULL CLOSE');
  two(322, 1141, 'CV CHEST WARMING', 'COMPLETE');
  two(322, 1237, 'CV(B) CRACK OPEN', 'SEQUENCE COMPLETE');
  two(1038, 1046, 'CV(B) CRACK OPEN', 'SEQUENCE START');
  two(1038, 1144, 'CV(B) CRACK OPEN', 'SEQUENCE START');
  two(1036, 1291, 'CV(B) FULL CLOSE', 'AFTER CRACK OPEN');
  two(1340, 932, 'CRACK OPEN', 'DETECT');
  two(1786, 986, 'CV(B) CRACK OPEN', 'SEQUENCE START');
  two(1786, 1061, 'CV(B) CRACK OPEN', 'SEQUENCE START');
  two(1840, 1157, 'CV(B) CRACK OPEN', 'SEQUENCE COMPLETE');
  two(1784, 1296, 'CV(B) CRACK OPEN', 'SEQUENCE COMPLETE');
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'TCE155',
    /* pr: printed on page 112 beside each block; the drawing above keeps them as text */
    pr: {
      sg5: ['K:6.67%'],
      sg6: ['K:100.0%'],
      sg7: ['K:-5.0%'],
      sg14: ['K:6.67%'],
      sg15: ['K:100.0%'],
      sg16: ['K:-5.0%']
    },
    title: 'CV WARMING CONTROL(5)',
    page: 112,
    ctl: 'EHG+MD',
    cycle: 30,
    f: [156, 80, 2218, 1542],
    /* live: the engine's state of the signals named on this sheet (tcs.js tcsLiveRead) */
    live: { kTrip: 'trip' },
    c,
    k: [
      ['kInit', 242, 1061, 'INITIAL', 'ref'],
      ['kTrip', 219, 1306, 'TURBINE TRIP', 'ref']
    ],
    d,
    m: [
      [
        'wsU',
        'CV WARMING SET',
        '',
        992,
        152,
        406,
        224,
        PINS,
        ['SET', 'UPPER', 'LOWER', '', ''],
        'A002',
        notes(1022, 434, 1100)
      ],
      [
        'wsL',
        'CV WARMING SET',
        '',
        988,
        589,
        405,
        224,
        PINS,
        ['SET', 'UPPER', 'LOWER', '', ''],
        'A011',
        notes(986, 860, 1096)
      ]
    ],
    b,
    w,
    t
  });
})();
