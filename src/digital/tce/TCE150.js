/* TCE150 CV WARMING CONTROL(1) (331DM09784 page 107, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The scan of this page is turned a little; every place is typed as it stands on the page set straight (one x for each upright
   line, one y for each level line).
   The CV warming mode: set by the operator (CRT AVAILABLE and CV WARMING SET) or by the ATS, reset by the operator or when the CV warming
   is complete. With the mode set, the CV chest warming is started by the operator or by the ATS (in CV WARMING AUTO) and stopped by the
   operator, the ATS, a turbine trip, the end of the warming, the mode reset, CV WARMING AUTO off or the end of the CV(B) crack operation.
   The title block of this page prints PAGE 105; it is page 107 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    d = [],
    b = [],
    w = [],
    t = [],
    XO = 2072,
    E = XO - 27,
    XL = 2020,
    EL = XL - 35,
    mark = (no, x, y) => b.push(['m' + no, 'o:BTR', no, x, y]),
    box = (key, type, no, x, y, h, pins, w2) => b.push([key, type, no, x, y, [], pins || {}, [w2 || 59, h || 43]]),
    btn = (key, y, tag, name) => {
      d.push([key, 338, y, 'in', tag, 'R', '#1C']);
      t.push([371, y - 6, name]);
    },
    lamp = (key, x, y, tag) => d.push([key, x, y, 'out', tag, 'S', '#1C']),
    inn = (key, l, y, name, sheet, dbl) => c.push([key, 'in', l, 293, y, name, [sheet], dbl || 0]),
    out = (key, l, y, refs, dbl, under) => c.push([key, 'out', l, XO, y, '', refs, dbl || 0, under || 0]);
  btn('dIYS', 222, 'TCE150_1_IYS', 'CRT AVAILABLE');
  btn('dIKS', 297, 'TCE150_1_IKS', 'CV WARMING SET');
  btn('dIKR', 447, 'TCE150_1_IKR', 'CV WARMING RESET');
  btn('dJYS', 787, 'TCE150_1_JYS', 'CV CHEST WARMING START');
  btn('dJYP', 872, 'TCE150_1_JYP', 'CV CHEST WARMING STOP');
  inn('iA', 'A', 596, 'CV WARMING MODE SET(ATS)', 'TCA580', 1);
  inn('iAuto', 'A', 712, 'CV WARMING AUTO', 'TCE151');
  inn('iD', 'D', 1032, 'CV WARMING START(ATS)', 'TCA580', 1);
  inn('iE', 'E', 1106, 'CV WARMING STOP(ATS)', 'TCA580', 1);
  inn('iB', 'B', 1309, 'CV WARMING COMPLETE', 'TCE152');
  inn('iF1', 'F1', 1373, 'CV(B) CRACK OPRN COMPLETE', 'TCE152');
  c.push(['oC', 'out', 'C', 1151, 191, '', ['TCE151']]);
  box('a2', 'A', '002', 947, 287);
  box('or4', 'OR', '004', 1246, 287);
  box('ffr5', 'FFR', '005', 1470, 287, 43, { l: ['S', 'R'] }, 80);
  box('a8', 'A', '008', 946, 436);
  box('or10', 'OR', '010', 1244, 436);
  box('a38', 'A', '038', 944, 607);
  box('a21', 'A', '021', 666, 777);
  box('a28', 'A', '028', 666, 862);
  box('a17', 'A', '017', 943, 766, 64);
  box('a25', 'A', '025', 942, 851, 64);
  box('or18', 'OR', '018', 1093, 756);
  box('or26', 'OR', '026', 1093, 841);
  box('not31', 'NOT', '031', 1092, 926);
  box('not34', 'NOT', '034', 941, 979);
  box('a39', 'A', '039', 941, 1043);
  box('a40', 'A', '040', 940, 1117);
  box('or41', 'OR', '041', 1348, 884, 128);
  box('not42', 'NOT', '042', 1003, 1384);
  box('ffr19', 'FFR', '019', 1465, 756, 43, { l: ['S', 'R'] }, 80);
  box('not12', 'NOT', '012', 1594, 500);
  box('not32', 'NOT', '032', 1589, 1032);
  w.push(
    /* CRT AVAILABLE: to connector C and to the four gates of the operator buttons */
    [
      'dIYS',
      [
        [373, 222],
        [895, 222]
      ]
    ],
    [
      'dIYS',
      [
        [1124, 191],
        [895, 191],
        [895, 425],
        [916, 425]
      ]
    ],
    [
      'dIYS',
      [
        [895, 276],
        [917, 276]
      ]
    ],
    [
      'dIYS',
      [
        [615, 222],
        [615, 851],
        [636, 851]
      ]
    ],
    [
      'dIYS',
      [
        [615, 766],
        [636, 766]
      ]
    ],
    [
      'dIKS',
      [
        [373, 297],
        [917, 297]
      ]
    ],
    [
      'dIKR',
      [
        [373, 447],
        [916, 447]
      ]
    ],
    [
      'dJYS',
      [
        [373, 787],
        [636, 787]
      ]
    ],
    [
      'dJYP',
      [
        [373, 872],
        [636, 872]
      ]
    ],
    /* the CV warming mode */
    [
      'a2',
      [
        [977, 276],
        [1216, 276]
      ]
    ],
    [
      'or4',
      [
        [1276, 276],
        [1430, 276]
      ]
    ],
    [
      'a8',
      [
        [976, 425],
        [1214, 425]
      ]
    ],
    [
      'or10',
      [
        [1274, 425],
        [1406, 425],
        [1406, 297],
        [1430, 297]
      ]
    ],
    [
      'iA',
      [
        [320, 596],
        [914, 596]
      ]
    ],
    [
      'a38',
      [
        [974, 596],
        [1171, 596],
        [1171, 297],
        [1216, 297]
      ]
    ],
    [
      'kAts',
      [
        [507, 1170],
        [846, 1170],
        [846, 618],
        [914, 618]
      ]
    ],
    [
      'kAts',
      [
        [846, 1127],
        [910, 1127]
      ]
    ],
    [
      'kAts',
      [
        [846, 1053],
        [911, 1053]
      ]
    ],
    [
      'ffr5',
      [
        [1510, 276],
        [E, 276]
      ]
    ],
    [
      'ffr5',
      [
        [1540, 276],
        [1540, 681]
      ]
    ],
    [
      'ffr5',
      [
        [E, 681],
        [869, 681],
        [869, 915],
        [1062, 915]
      ]
    ],
    [
      'ffr5',
      [
        [1540, 361],
        [EL, 361]
      ]
    ],
    [
      'ffr5',
      [
        [1540, 425],
        [E, 425]
      ]
    ],
    [
      'ffr5',
      [
        [1540, 490],
        [1564, 490]
      ]
    ],
    [
      'ffr5',
      [
        [869, 787],
        [913, 787]
      ]
    ],
    [
      'ffr5',
      [
        [869, 872],
        [912, 872]
      ]
    ],
    [
      'not12',
      [
        [1624, 490],
        [EL, 490]
      ]
    ],
    [
      'not12',
      [
        [1658, 490],
        [1658, 617],
        [E, 617]
      ]
    ],
    [
      'not12',
      [
        [1658, 554],
        [E, 554]
      ]
    ],
    /* the CV chest warming start */
    [
      'iAuto',
      [
        [320, 712],
        [890, 712],
        [890, 968],
        [911, 968]
      ]
    ],
    [
      'iAuto',
      [
        [890, 745],
        [913, 745]
      ]
    ],
    [
      'iAuto',
      [
        [890, 830],
        [912, 830]
      ]
    ],
    [
      'a21',
      [
        [696, 766],
        [913, 766]
      ]
    ],
    [
      'a28',
      [
        [696, 851],
        [912, 851]
      ]
    ],
    [
      'a17',
      [
        [973, 745],
        [1063, 745]
      ]
    ],
    [
      'or18',
      [
        [1123, 745],
        [1425, 745]
      ]
    ],
    [
      'a25',
      [
        [972, 830],
        [1063, 830]
      ]
    ],
    [
      'or26',
      [
        [1123, 830],
        [1318, 830]
      ]
    ],
    [
      'iD',
      [
        [320, 1032],
        [911, 1032]
      ]
    ],
    [
      'a39',
      [
        [971, 1032],
        [1054, 1032],
        [1054, 766],
        [1063, 766]
      ]
    ],
    [
      'iE',
      [
        [320, 1106],
        [910, 1106]
      ]
    ],
    [
      'a40',
      [
        [970, 1106],
        [1040, 1106],
        [1040, 851],
        [1063, 851]
      ]
    ],
    /* the stop: the six inputs of the OR */
    [
      'kTrip',
      [
        [507, 1244],
        [1211, 1244],
        [1211, 851],
        [1318, 851]
      ]
    ],
    [
      'iB',
      [
        [320, 1309],
        [1190, 1309],
        [1190, 447],
        [1214, 447]
      ]
    ],
    [
      'iB',
      [
        [1190, 872],
        [1318, 872]
      ]
    ],
    [
      'not31',
      [
        [1122, 915],
        [1232, 915],
        [1232, 894],
        [1318, 894]
      ]
    ],
    [
      'not34',
      [
        [971, 968],
        [1254, 968],
        [1254, 915],
        [1318, 915]
      ]
    ],
    [
      'iF1',
      [
        [320, 1373],
        [973, 1373]
      ]
    ],
    [
      'not42',
      [
        [1033, 1373],
        [1274, 1373],
        [1274, 936],
        [1318, 936]
      ]
    ],
    [
      'or41',
      [
        [1378, 830],
        [1415, 830],
        [1415, 767],
        [1425, 767]
      ]
    ],
    [
      'ffr19',
      [
        [1505, 745],
        [E, 745]
      ]
    ],
    [
      'ffr19',
      [
        [1537, 745],
        [1537, 1021],
        [1559, 1021]
      ]
    ],
    [
      'ffr19',
      [
        [1537, 809],
        [EL, 809]
      ]
    ],
    [
      'ffr19',
      [
        [1537, 873],
        [E, 873]
      ]
    ],
    [
      'ffr19',
      [
        [1537, 947],
        [E, 947]
      ]
    ],
    [
      'not32',
      [
        [1619, 1021],
        [EL, 1021]
      ]
    ],
    [
      'not32',
      [
        [1653, 1021],
        [1653, 1160],
        [E, 1160]
      ]
    ],
    [
      'not32',
      [
        [1653, 1086],
        [E, 1086]
      ]
    ],
    [
      'kInit',
      [
        [506, 1436],
        [1436, 1436]
      ]
    ]
  );
  out('oA', 'A', 276, ['TCE151', 'TCE152', 'TCE153', 'TCE154']);
  lamp('lIIS', XL, 361, 'TCE150_1_IIS');
  out('oA1', 'A1', 425, ['TCA535'], 1);
  lamp('lIIR', XL, 490, 'TCE150_1_IIR');
  out('oA2', 'A2', 554, ['TCA535'], 1);
  out('oZ3', 'Z3', 617, ['TCE155'], 0, 1);
  out('oZ1', 'Z1', 681, ['-'], 1);
  out('oB', 'B', 745, ['TCE152']);
  lamp('lYIR', XL, 809, 'TCE150_1_YIR');
  out('oB1', 'B1', 873, ['TCA535'], 1);
  out('oZ2', 'Z2', 947, ['-'], 1);
  lamp('lYIP', XL, 1021, 'TCE150_1_YIP');
  out('oB2', 'B2', 1086, ['TCA535'], 1);
  out('oZ4', 'Z4', 1160, ['-'], 1);
  lamp('lIYP', 1471, 1436, 'TCE150_1_IYP');
  [
    ['001', 948, 191],
    ['006', 1596, 276],
    ['007', 1692, 361],
    ['011', 1692, 425],
    ['013', 1691, 490],
    ['014', 1690, 554],
    ['015', 1690, 617],
    ['016', 1592, 681],
    ['020', 1592, 745],
    ['023', 1591, 809],
    ['024', 1591, 873],
    ['030', 1590, 947],
    ['033', 1686, 1021],
    ['035', 1685, 1086],
    ['036', 1685, 1160],
    ['037', 1067, 1436]
  ].forEach(([no, x, y]) => mark(no, x, y));
  t.push(
    [426, 180, '(TCE050)'],
    [418, 1198, '(TCE051)'],
    [417, 1272, '(TCE053)'],
    [416, 1464, '(TCE050)'],
    [1417, 266, 'T'],
    [1413, 735, 'T'],
    [1731, 270, 'CV WARMING MODE SET'],
    [1720, 355, 'CV WARMING MODE SET'],
    [1720, 419, 'CV WARMING MODE SET'],
    [1718, 484, 'CV WARMING MODE RESET'],
    [1718, 548, 'CV WARMING MODE RESET'],
    [1717, 611, 'CV CHEST WARMING MODE RESET'],
    [1727, 675, 'CV CHEST WARMING MODE SET'],
    [1726, 739, 'CV CHEST WARMING START'],
    [1726, 803, 'CV CHEST WARMING START'],
    [1726, 867, 'CV CHEST WARMING START'],
    [1725, 941, 'CV CHEST WARMING VALVE START'],
    [1713, 1015, 'CV CHEST WARMING STOP'],
    [1713, 1080, 'CV CHEST WARMING STOP'],
    [1713, 1154, 'CV CHEST WARMING STOP'],
    [224, 1525, 'CONTROLLER:'],
    [383, 1525, 'EHG+MD'],
    [607, 1499, 'TRIGGER  :'],
    [607, 1526, 'CYCLE(ms):30']
  );
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'TCE150',
    title: 'CV WARMING CONTROL(1)',
    page: 107,
    ctl: 'EHG+MD',
    cycle: 30,
    f: [158, 82, 2218, 1545],
    /* live: the engine's state of the signals named on this sheet (tcs.js tcsLiveRead) */
    live: { kAts: 'auto', kTrip: 'trip' },
    c,
    k: [
      ['kAts', 273, 1170, 'ATS AUTO(C)', 'ref'],
      ['kTrip', 273, 1244, 'TURBINE TRIP', 'ref'],
      ['kInit', 272, 1436, 'INITIAL', 'ref']
    ],
    d,
    b,
    w,
    t
  });
})();
