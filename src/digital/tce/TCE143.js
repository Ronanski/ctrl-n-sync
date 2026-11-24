/* TCE143 TURBINE SPEED DIAGNOSTICS(4) (331DM09784 page 104, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. The scan of this page is turned a little; every place is typed as it stands on the page set straight (one x for each
   upright line, one y for each level line).
   The three turbine speed signals (1A, 2B, 3C) with their low counters, each through an analog switch that takes the simulator value when
   SIMULATION USE is on, into the DUP AI DIAGNOSTICSV block. Out of it come the turbine speed (to the operator station, TCA104, TCE610 and the
   definition TURBINE SPEED), the abnormal signal and the quality of each speed and the deviation. Two abnormal speeds out of three give EHG
   SOFT MAJOR TROUBLE. The PTI ERROR DETECT block gives the PTI switch and the high counter mode; the high counter mode comes back inverted to
   TCH. The comparators give TURBINE SPEED <2400RPM, <100RPM and connector G (the drawing prints no name at G). The title block of this page
   prints PAGE 102; it is page 104 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  const u = 2.06,
    P = i =>
      Math.round(206 + 15 * u + (i + 0.5) * ((382 - 30 * u) / 10)) /* the pins of the DUP AI DIAGNOSTICSV block */,
    XS = 564 /* where a simulator value turns down */,
    XC = 585 /* the line of SIMULATION USE */,
    AX = 648 /* the middle of the analog switches */,
    BX = 1003,
    BR = 1408,
    PX = 1038,
    PR = 1357,
    c = [],
    b = [],
    w = [],
    t = [],
    inn = (key, l, y, name, sheet) => c.push([key, 'in', l, 285, y, name, [sheet], 0, 1]),
    out = (key, l, x, y, refs, dbl, under) =>
      c.push([key, 'out', l, x, y, '', refs, dbl || 0, under === undefined ? 1 : under]),
    mark = (ty, no, x, y) => b.push(['m' + no, 'o:' + ty, no, x, y]),
    box = (key, type, no, x, y, w2, h, notes) => b.push([key, type, no, x, y, notes || [], {}, [w2 || 59, h || 43]]),
    two = (x, y, a, b2) => t.push([x, y - 27, a], [x, y - 6, b2]);
  /* the three speeds: [letter, y of the simulator value, of the speed, of the low counter, of the abnormal signal, connector of the speed,
     of the low counter, of the abnormal signal, their sheet, numbers of the two switches, connector of the simulator value] */
  const G = [
    ['A', 209, 275, 358, 444, 'A1', 'A2', 'A5', 'TCE140', '001', '003', 'A1', '1A'],
    ['B', 529, 594, 678, 763, 'B1', 'B2', 'B5', 'TCE141', '006', '008', 'A2', '2B'],
    ['C', 848, 912, 997, 1168, 'C1', 'C2', 'C5', 'TCE142', '011', '014', 'A3', '3C']
  ];
  G.forEach(([L, ys, y1, yl, ye, c1, c2, c5, sh, n1, n2, cs, nm]) => {
    const s1 = 'asw' + n1,
      s2 = 'asw' + n2,
      yu = y1 - 22 /* the upper input of the first switch = its output */,
      yv = yl - 21; /* the same of the second */
    inn('iS' + L, cs, ys, 'TURBINE SPEED(' + L + ') SIM', 'TCE500');
    inn('i1' + L, c1, y1, 'TURBINE SPEED ' + nm, sh);
    inn('iL' + L, c2, yl, 'TB SPD ' + nm + ' LOW COUNTER', sh);
    inn('iE' + L, c5, ye, 'COUNTER ' + nm + ' ABN', sh);
    box(s1, 'ASW', n1, AX, yu + 11);
    box(s2, 'ASW', n2, AX, yv + 11);
    w.push(
      [
        'iS' + L,
        [
          [312, ys],
          [XS, ys],
          [XS, yv],
          [618, yv]
        ],
        1
      ],
      [
        'iS' + L,
        [
          [XS, yu],
          [618, yu]
        ],
        1
      ],
      [
        'i1' + L,
        [
          [312, y1],
          [618, y1]
        ],
        1
      ],
      [
        'iL' + L,
        [
          [312, yl],
          [618, yl]
        ],
        1
      ],
      /* SIMULATION USE to the top of the two switches */
      [
        'kSim',
        [
          [XC, ys],
          [AX, ys],
          [AX, yu - 10]
        ]
      ],
      [
        'kSim',
        [
          [XC, yv - 32],
          [AX, yv - 32],
          [AX, yv - 10]
        ]
      ]
    );
  });
  /* the outputs of the switches: speed A, B, C to SPA, SPB, SPC and to their connectors; low counter A, B, C to LCA, LCB, LCC and to the
     PTI ERROR DETECT block */
  w.push(
    [
      'kSim',
      [
        [455, 1082],
        [XC, 1082],
        [XC, 209]
      ]
    ],
    [
      'asw001',
      [
        [678, 253],
        [BX, P(0)]
      ],
      1
    ],
    [
      'asw001',
      [
        [716, 253],
        [716, 114],
        [1244, 114]
      ],
      1
    ],
    [
      'asw001',
      [
        [716, 134],
        [903, 134]
      ],
      1
    ],
    [
      'asw003',
      [
        [678, 337],
        [716, 337]
      ],
      1
    ],
    [
      'asw003',
      [
        [BX, P(1)],
        [716, P(1)],
        [716, 987],
        [PX, 987]
      ],
      1
    ],
    [
      'asw006',
      [
        [678, 572],
        [757, 572],
        [757, 178],
        [1244, 178]
      ],
      1
    ],
    [
      'asw006',
      [
        [757, 209],
        [903, 209]
      ],
      1
    ],
    [
      'asw006',
      [
        [757, P(3)],
        [BX, P(3)]
      ],
      1
    ],
    [
      'asw008',
      [
        [678, 657],
        [777, 657]
      ],
      1
    ],
    [
      'asw008',
      [
        [BX, P(4)],
        [777, P(4)],
        [777, 1008],
        [PX, 1008]
      ],
      1
    ],
    [
      'asw011',
      [
        [678, 890],
        [818, 890],
        [818, P(6)],
        [BX, P(6)]
      ],
      1
    ],
    [
      'asw011',
      [
        [688, 890],
        [688, 1423],
        [911, 1423]
      ],
      1
    ],
    [
      'asw011',
      [
        [980, P(6)],
        [980, 134],
        [1129, 134]
      ],
      1
    ],
    [
      'asw014',
      [
        [678, 976],
        [840, 976]
      ],
      1
    ],
    [
      'asw014',
      [
        [BX, P(7)],
        [840, P(7)],
        [840, 1030],
        [PX, 1030]
      ],
      1
    ],
    /* the abnormal signals of the counters to IOEA, IOEB, IOEC */
    [
      'iEA',
      [
        [312, 444],
        [736, 444],
        [736, P(2)],
        [BX, P(2)]
      ]
    ],
    [
      'iEB',
      [
        [312, 763],
        [797, 763],
        [797, P(5)],
        [BX, P(5)]
      ]
    ],
    [
      'iEC',
      [
        [312, 1168],
        [860, 1168],
        [860, P(8)],
        [BX, P(8)]
      ]
    ],
    /* the H flags of the counters */
    [
      'iHA',
      [
        [312, 1264],
        [706, 1264],
        [706, 1051],
        [PX, 1051]
      ]
    ],
    [
      'iHB',
      [
        [312, 1349],
        [728, 1349],
        [728, 1094],
        [PX, 1094]
      ]
    ],
    [
      'iHC',
      [
        [312, 1434],
        [748, 1434],
        [748, 1136],
        [PX, 1136]
      ]
    ],
    [
      'sg',
      [
        [822, 1285],
        [964, 1285],
        [964, 1179],
        [PX, 1179]
      ],
      1
    ],
    /* the PTI switch, and the high counter mode: out to F and back, inverted, to TCH */
    [
      'pti.PTI SW',
      [
        [PR, 967],
        [1445, 967],
        [1445, 1138],
        [2073, 1138]
      ]
    ],
    [
      'pti.H-CNT MODE',
      [
        [PR, 988],
        [1410, 988],
        [1410, 1349],
        [881, 1349],
        [881, P(9)],
        [BX, P(9)]
      ]
    ],
    [
      'pti.H-CNT MODE',
      [
        [1410, 1212],
        [2062, 1212]
      ]
    ],
    /* the turbine speed */
    [
      'dup.Y',
      [
        [BR, P(0)],
        [1929, P(0)]
      ],
      1
    ],
    [
      'dup.Y',
      [
        [1734, P(0)],
        [1734, 128],
        [2066, 128]
      ],
      1
    ],
    [
      'dup.Y',
      [
        [1734, 180],
        [2074, 180]
      ],
      1
    ],
    [
      'dup.Y',
      [
        [1734, 212],
        [1849, 212]
      ],
      1
    ],
    [
      'dup.Y',
      [
        [1734, P(0)],
        [1734, 947],
        [1754, 947]
      ],
      1
    ],
    [
      'dup.Y',
      [
        [1734, 755],
        [1756, 755]
      ],
      1
    ],
    [
      'dup.Y',
      [
        [1734, 851],
        [1755, 851]
      ],
      1
    ],
    [
      'dup.Y',
      [
        [1734, 851],
        [901, 851],
        [901, 966],
        [PX, 966]
      ],
      1
    ],
    [
      'cpl',
      [
        [1815, 755],
        [2068, 755]
      ]
    ],
    [
      'lck',
      [
        [1815, 851],
        [2067, 851]
      ]
    ],
    [
      'cmp',
      [
        [1814, 947],
        [2067, 947]
      ]
    ],
    [
      'kInit',
      [
        [1649, 158],
        [1682, 158],
        [1682, 915],
        [1784, 915],
        [1784, 936]
      ]
    ],
    /* the abnormal speeds: out, to the two-out-of-three gates and to the PTI ERROR DETECT block */
    [
      'dup.ERR A',
      [
        [BR, P(2)],
        [2072, P(2)]
      ]
    ],
    [
      'dup.ERR A',
      [
        [1574, P(2)],
        [1574, 1042],
        [1582, 1042]
      ]
    ],
    [
      'dup.ERR A',
      [
        [1574, 978],
        [1582, 978]
      ]
    ],
    [
      'dup.ERR A',
      [
        [1574, 871],
        [922, 871],
        [922, 1072],
        [PX, 1072]
      ]
    ],
    [
      'dup.ERR B',
      [
        [BR, P(3)],
        [1552, P(3)],
        [1552, 1095],
        [1582, 1095]
      ]
    ],
    [
      'dup.ERR B',
      [
        [1552, P(4)],
        [2071, P(4)]
      ]
    ],
    [
      'dup.ERR B',
      [
        [1552, 999],
        [1582, 999]
      ]
    ],
    [
      'dup.ERR B',
      [
        [1552, 893],
        [943, 893],
        [943, 1115],
        [PX, 1115]
      ]
    ],
    [
      'dup.ERR C',
      [
        [BR, P(4)],
        [1532, P(4)],
        [1532, 1116],
        [1582, 1116]
      ]
    ],
    [
      'dup.ERR C',
      [
        [1532, P(6)],
        [2071, P(6)]
      ]
    ],
    [
      'dup.ERR C',
      [
        [1532, 1063],
        [1582, 1063]
      ]
    ],
    [
      'dup.ERR C',
      [
        [1532, 914],
        [964, 914],
        [964, 1158],
        [PX, 1158]
      ]
    ],
    [
      'a030',
      [
        [1642, 978],
        [1708, 978],
        [1708, 1053],
        [1752, 1053]
      ]
    ],
    [
      'a031',
      [
        [1642, 1042],
        [1686, 1042],
        [1686, 1074],
        [1752, 1074]
      ]
    ],
    [
      'a033',
      [
        [1642, 1095],
        [1752, 1095]
      ]
    ],
    [
      'or',
      [
        [1812, 1053],
        [2043, 1053]
      ]
    ],
    [
      'or',
      [
        [1846, 1053],
        [1846, 1288],
        [2052, 1288]
      ]
    ],
    /* the quality of each speed and the deviation */
    [
      'dup.QT1',
      [
        [BR, P(5)],
        [1512, P(5)],
        [1512, 511],
        [2070, 511]
      ]
    ],
    [
      'dup.QT2',
      [
        [BR, P(6)],
        [1491, P(6)],
        [1491, 575],
        [2069, 575]
      ]
    ],
    [
      'dup.QT3',
      [
        [BR, P(7)],
        [1469, P(7)],
        [1469, 639],
        [2069, 639]
      ]
    ],
    [
      'dup.DEV',
      [
        [BR, P(9)],
        [1448, P(9)],
        [1448, 703],
        [2068, 703]
      ]
    ]
  );
  inn('iHA', 'A3', 1264, 'COUNTER 1A H-FLAG', 'TCE140');
  inn('iHB', 'B3', 1349, 'COUNTER 2B H-FLAG', 'TCE141');
  inn('iHC', 'C3', 1434, 'COUNTER 3C H-FLAG', 'TCE142');
  out('oG1', 'G1', 930, 134, [], 0, 0);
  out('oG2', 'G2', 930, 209, [], 0, 0);
  out('oG3', 'G3', 1156, 134, [], 0, 0);
  out('oG4', 'G4', 1271, 114, ['TCT209'], 1, 0);
  out('oG5', 'G5', 1271, 178, ['TCT210'], 1, 0);
  out('oG6', 'G6', 938, 1423, [], 1);
  out('oA1', 'A1', 2101, 180, ['TCA104'], 1);
  out('oB1', 'B1', 1876, 212, ['TCE610'], 0, 0);
  out('oC', 'C', 2099, P(2), ['TCE471']);
  out('oD', 'D', 2098, P(4), ['TCE471']);
  out('oE', 'E', 2098, P(6), ['TCE471']);
  out('oC1', 'C1', 2097, 511, ['-'], 1);
  out('oC2', 'C2', 2096, 575, ['-'], 1);
  out('oC3', 'C3', 2096, 639, ['-'], 1);
  out('oC4', 'C4', 2095, 703, ['-'], 1);
  out('oM', 'M', 2095, 755, ['TCE601']);
  out('oH1', 'H1', 2094, 851, ['TCE100']);
  out('oG', 'G', 2094, 947, ['-']);
  out('oH', 'H', 2070, 1053, ['TCE218', 'TCE219', 'TCE472'], 0, 0);
  out('oL', 'L', 2100, 1138, ['TCE140', 'TCE141', 'TCE142'], 0, 0);
  out('oF', 'F', 2089, 1212, ['TCE168']);
  mark('FTR', '020', 782, 134);
  mark('FTR', '022', 782, 209);
  mark('FTR', '021', 1004, 134);
  mark('BTR', '017', 537, 1082);
  mark('FTR', '034', 1791, 128);
  mark('FTR', '018', 1791, 180);
  mark('BTR', '004', 1790, P(2));
  mark('BTR', '005', 1790, P(4));
  mark('BTR', '007', 1789, P(6));
  mark('BTR', '025', 1788, 511);
  mark('BTR', '026', 1788, 575);
  mark('BTR', '027', 1787, 639);
  mark('BTR', '028', 1786, 703);
  mark('BTR', '035', 1875, 1288);
  box('sg', 'SG', 'A016', 792, 1296, 59, 43, ['K:3000rpm']);
  box('cpl', 'CPL', 'A029', 1785, 766);
  box('lck', 'LCK', 'A023', 1785, 862);
  box('cmp', 'CMP', 'A024', 1784, 958);
  box('a030', 'A', '030', 1612, 989);
  box('a031', 'A', '031', 1612, 1053);
  box('a033', 'A', '033', 1612, 1106);
  box('or', 'OR', '032', 1782, 1074, 60, 64);
  /* the crossed circles of the inverted inputs */
  [
    [1007, 966],
    [1006, 1072],
    [1006, 1115],
    [1006, 1158],
    [897, 1349]
  ].forEach(([x, y], i) => b.push(['x' + i, 'X', '', x, y]));
  t.push(
    [808, 128, 'TBN SPA'],
    [808, 203, 'TBN SPB'],
    [1031, 128, 'TBN SPC'],
    /* the sheets of G1, G2, G3 (and of G6), printed where the drawing has them: left under the connector, clear of the lines */
    [818, 163, '(TCE100)(TCE145)'],
    [836, 238, '(TCE100)(TCE145)'],
    [1071, 163, '(TCE100)'],
    [1163, 163, '(TCE145)'],
    [366, 1112, '(TCE052)'],
    [804, 1466, '(TCT210)'],
    [1557, 190, '(TCE050)'],
    [763, 1236, 'CNT MODE'],
    [763, 1257, 'SW SPEED'],
    [1883, 122, 'TURBINE SPEED'],
    [1880, P(2) - 6, 'TBN SPEED A ABN'],
    [1880, P(4) - 6, 'TBN SPEED B ABN'],
    [1879, P(6) - 6, 'TBN SPEED C ABN'],
    [1878, 505, 'A QTY'],
    [1878, 569, 'B QTY'],
    [1877, 633, 'C QTY'],
    [1876, 697, 'DEVIATION HIGH'],
    [1756, 810, 'HL:2450.0rpm'],
    [1756, 831, 'LL:2400.0rpm'],
    [1755, 906, 'K:100.0rpm'],
    [1740, 940, 'T'],
    [1754, 1002, 'HL:2950.0rpm'],
    [1754, 1023, 'LL:2000.0rpm'],
    [1862, 1132, 'PTI SWITCH'],
    [223, 1522, 'CONTROLLER:'],
    [384, 1522, 'EHG+MD'],
    [607, 1497, 'TRIGGER  :'],
    [607, 1524, 'CYCLE(ms):30']
  );
  two(1893, 755, 'TURBINE SPEED', '<2400RPM');
  two(1893, 851, 'TURBINE SPEED', '<100RPM');
  two(1891, 1032, 'EHG SOFT', 'MAJOR TROUBLE');
  two(1856, 1212, 'HIGH COUNTER', 'EFFECTIVE');
  two(1902, 1288, 'EHG SOFT', 'MAJOR TROUBLE');
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'TCE143', live: { kTS: ['rpm', 'rpm'], i1A: ['rpm', 'rpm'], i1B: ['rpm', 'rpm'], i1C: ['rpm', 'rpm'] },
    /* pr: printed on page 104 beside each block; the drawing above keeps them as text */
    pr: {
      cpl: ['HL:2450.0rpm', 'LL:2400.0rpm'],
      lck: ['K:100.0rpm'],
      cmp: ['HL:2950.0rpm', 'LL:2000.0rpm']
    },
    title: 'TURBINE SPEED DIAGNOSTICS(4)',
    page: 104,
    ctl: 'EHG+MD',
    cycle: 30,
    f: [158, 80, 2218, 1541],
    c,
    k: [
      ['kSim', 221, 1082, 'SIMULATION USE', 'ref'],
      ['kInit', 1415, 158, 'INITIAL', 'ref'],
      ['kTS', 1929, P(0), 'TURBINE SPEED', 'def', 'def']
    ],
    d: [
      ['crtPV', 2101, 128, 'out', 'TCE143_A1_PV', 'S', '#1C'],
      ['crtQ', 2087, 1288, 'out', 'TCE143_A1_PVQ', 'S', '#1C']
    ],
    m: [
      [
        'dup',
        'DUP AI DIAGNOSTICSV',
        'TCE143_A1',
        BX,
        206,
        405,
        382,
        ['SPA', 'LCA', 'IOEA', 'SPB', 'LCB', 'IOEB', 'SPC', 'LCC', 'IOEC', 'TCH'],
        ['Y', 'ABN', 'ERR A', 'ERR B', 'ERR C', 'QT1', 'QT2', 'QT3', 'ERR', 'DEV'],
        'A002',
        [
          [1108, 612, '(LME100)'],
          [1225, 612, '(LME101)'],
          ...[
            [946, 'DELAY TP:5.0s'],
            [946, 'DELAY TP:5.0s'],
            [946, 'DELAY TP:5.0s'],
            [956, 'DEV HL:10.0rpm'],
            [977, 'LL:-10.0rpm'],
            [892, 'H-CNT ABN HL:500.0rpm'],
            [944, 'LL:-500.0rpm'],
            [902, 'L-CNT ABN K:50.0rpm'],
            [955, 'DEV HL:10.0rpm'],
            [976, 'LL:-10.0rpm']
          ].map(([x, s], i) => [x, 636 + 21.3 * i, s]),
          ...[
            [1203, 'H-CNT ABN HL:500.0rpm'],
            [1254, 'LL:-500.0rpm'],
            [1213, 'L-CNT ABN K:50.0rpm'],
            [1265, 'DEV HL:10.0rpm'],
            [1286, 'LL:-10.0rpm'],
            [1202, 'H-CNT ABN HL:500.0rpm'],
            [1253, 'LL:-500.0rpm'],
            [1212, 'L-CNT ABN K:50.0rpm'],
            [1253, 'DELAY-S K:0.15s'],
            [1253, 'DELAY-L K:5.0s']
          ].map(([x, s], i) => [x, 637 + 21.3 * i, s])
        ]
      ],
      [
        'pti',
        'PTI ERROR DETECT',
        '',
        PX,
        935,
        319,
        383,
        [
          'SPEED',
          'L-CNT A',
          'L-CNT B',
          'L-CNT C',
          'H FLAG A',
          'ABN A',
          'H FLAG B',
          'ABN B',
          'H FLAG C',
          'ABN C',
          'H-L CNT SW SPD'
        ],
        ['PTI SW', 'H-CNT MODE'],
        'A013',
        [
          [1160, 1341, '(LME102)'],
          ...[
            [992, 'DEV 1 HL:10.0rpm'],
            [1024, 'LL:-10.0rpm'],
            [992, 'DEV 2 HL:10.0rpm'],
            [1024, 'LL:-10.0rpm'],
            [991, 'DEV 3 HL:10.0rpm'],
            [1023, 'LL:-10.0rpm']
          ].map(([x, s], i) => [x, 1371 + 21.3 * i, s]),
          [1269, 1413, 'LCK K:0.0rpm'],
          [1227, 1435, 'DELAY TP:2.0s'],
          [1227, 1456, 'TD TD:2.0s']
        ],
        [
          [966, 987, 1008, 1030, 1051, 1072, 1094, 1115, 1136, 1158, 1179],
          [967, 988]
        ]
      ]
    ],
    b,
    w,
    t
  });
})();
