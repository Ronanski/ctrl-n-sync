/* TCA500 START-UP MODE SELECTION (331DM09788 page 78, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. Two START-UP MODE blocks (LMA531) compare a metal temperature with the mode temperatures (SG: 150 / 170 / 230 / 420 / 999 degC):
   the IP start one takes the lower (LS 005) of the reheat bowl and the HP first stage inner wall metal temperature, the HP start one the HP first
   stage temperature alone. TIMIG is the moment the mode is taken: TURBINE TRIP (TW 1.0 s into the flip-flop FFS 045, reset by a turbine not tripped
   or the HP turbine warming valve not full close), or START UP MODE SELECT CONDITION of TCA103. IP START picks the outputs of the IP block in the
   digital switches (DSW) and its memorized temperature in the analog switch (ASW 041); the modes go to the operator station (CRT TCA500_1_1.._5) and
   to the other sheets. The words on the lines are the ones of the drawing (the HP block has COLD2 at 170 degC and COLD1 at 230 degC printed).
   live: TURBINE TRIP (tcs.js tcsLiveRead 'trip'); the engine holds no start-up mode, so the other lines stay without a state. */
(function () {
  if (typeof window === 'undefined') return;
  const PI = [
      233, 254, 276, 297, 318, 340, 361, 382, 404
    ] /* the pins of the IP block: TEMP./AMB. .. on the left, AMB. .. HEAT on the right */,
    PH = [958, 979, 1001, 1022, 1043, 1064, 1085, 1106, 1127] /* the same of the HP block */,
    LEFT = ['TEMP.', 'AMB.', 'COLD1', 'COLD2', 'WARM', 'HOT', 'TIMIG'],
    RIGHT = ['AMB.', 'COLD1', 'COLD2', 'WARM', 'HOT', 'VERYHOT', 'WARMHOT', 'REQUEST', 'HEAT'],
    IX = 938 /* IP block: left, right */,
    IR = 1172,
    HX = 931,
    HR = 1165,
    SX = 1630 /* the DSW column */,
    SEL = 1575 /* IP START down the DSW column */,
    c = [],
    b = [],
    d = [],
    w = [],
    t = [],
    j = [];
  /* the mode temperatures (SG) into the blocks: [no, y of the block, x of the riser, pin, words] */
  [
    ['A009', 328, 809, PI[1], 'AMB.COLD MODE TEMP.', 150],
    ['A011', 402, 830, PI[2], 'COLD1 MODE TEMP.', 170],
    ['A015', 478, 851, PI[3], 'COLD2 MODE TEMP.', 230],
    ['A017', 552, 872, PI[4], 'WARM MODE TEMP.', 420],
    ['A020', 627, 894, PI[5], 'HOT MODE TEMP.', 999]
  ].forEach(([no, y, x, pin, name, k]) => {
    b.push(['sg' + no, 'SG', no, 340, y, ['K:' + k + '.0degC']]);
    w.push([
      'sg' + no,
      [
        [370, y - 11],
        [x, y - 11],
        [x, pin],
        [IX, pin]
      ],
      1
    ]);
    t.push([449, y - 19, name]);
  });
  [
    ['A031', 1072, 802, PH[1], 'AMB.COLD MODE TEMP.', 150],
    ['A033', 1147, 823, PH[2], 'COLD2 MODE TEMP.', 170],
    ['A035', 1222, 845, PH[3], 'COLD1 MODE TEMP.', 230],
    ['A038', 1297, 866, PH[4], 'WARM MODE TEMP.', 420],
    ['A040', 1372, 887, PH[5], 'HOT MODE TEMP.', 999]
  ].forEach(([no, y, x, pin, name, k]) => {
    b.push(['sg' + no, 'SG', no, 335, y, ['K:' + k + '.0degC']]);
    w.push([
      'sg' + no,
      [
        [365, y - 11],
        [x, y - 11],
        [x, pin],
        [HX, pin]
      ],
      1
    ]);
    t.push([443, y - 19, name]);
  });
  /* the digital switches: [no, y of the upper input (the IP block), y where IP START leaves its riser, x of the IP riser, x of the HP riser] */
  const DSW = [
    ['006', 233, 133, 0, 1512],
    ['012', 415, 373, 1311, 1521],
    ['018', 597, 565, 1300, 1530],
    ['024', 778, 746, 1289, 1539],
    ['029', 969, 938, 1278, 1548],
    ['032', 1043, 1012, 1267, 0],
    ['034', 1118, 1087, 1257, 1228],
    ['036', 1192, 1160, 1246, 1218]
  ];
  DSW.forEach(([no, y, ys, xi, xh], i) => {
    const key = 'dsw' + no;
    b.push([key, 'DSW', no, SX, y + 10]);
    /* the IP block (upper input) */
    if (i === 0)
      w.push([
        'ip.AMB.',
        [
          [IR, PI[0]],
          [SX - 30, y]
        ]
      ]);
    else if (i === 5)
      w.push([
        'ip.' + RIGHT[i],
        [
          [IR, PI[i]],
          [xi, PI[i]],
          [xi, 1054],
          [1558, 1054],
          [1558, y],
          [SX - 30, y]
        ]
      ]);
    else
      w.push([
        'ip.' + RIGHT[i],
        [
          [IR, PI[i]],
          [xi, PI[i]],
          [xi, y],
          [SX - 30, y]
        ]
      ]);
    /* the HP block (lower input) */
    if (i === 5)
      w.push([
        'hp.' + RIGHT[i],
        [
          [HR, PH[i]],
          [SX - 30, y + 21]
        ]
      ]);
    else
      w.push([
        'hp.' + RIGHT[i],
        [
          [HR, PH[i]],
          [xh, PH[i]],
          [xh, y + 21],
          [SX - 30, y + 21]
        ]
      ]);
    /* IP START from the top */
    if (i) {
      w.push([
        'kIp',
        [
          [SEL, ys],
          [SX, ys],
          [SX, y - 11]
        ]
      ]);
      j.push([SEL, ys]);
    }
  });
  /* the modes with an operator station lamp: [DSW, letter, words, BTR of the switch, of the lamp, of the double connector, CRT, x of the CRT, sheets,
     the sheets printed beside the connector, the other sheets where the drawing prints them (x, y under the line)] */
  [
    [
      '006',
      'A',
      'AMB.COLD MODE',
      '007',
      '003',
      '004',
      '1',
      2045,
      ['-'],
      ['TCA547', 'TCA584', 'TCA767', 'TCA831'],
      [
        [1943, 17, 'TCA539'],
        [1943, 38, 'TCA582'],
        [2028, 38, 'TCA583A']
      ]
    ],
    [
      '012',
      'B',
      'COLD1 MODE',
      '013',
      '008',
      '010',
      '2',
      2045,
      ['-'],
      ['TCA547', 'TCA584', 'TCA767', 'TCA768A'],
      [
        [1943, 17, 'TCA539'],
        [1943, 38, 'TCA582'],
        [2024, 38, 'TCA583A'],
        [1848, 42, 'TCA831']
      ]
    ],
    [
      '018',
      'C',
      'COLD2 MODE',
      '019',
      '014',
      '016',
      '3',
      2045,
      ['-'],
      ['TCA582', 'TCA583A', 'TCA768A'],
      [
        [1942, 19, 'TCA539'],
        [1841, 39, 'TCA831'],
        [1937, 39, 'TCA767'],
        [2024, 39, 'TCA584']
      ]
    ],
    [
      '024',
      'D',
      'WARM MODE',
      '025',
      '021',
      '022',
      '4',
      2045,
      ['-'],
      ['TCA536', 'TCA767', 'TCA831'],
      [
        [1930, 39, 'TCA583A'],
        [2023, 39, 'TCA584'],
        [1836, 39, 'TCA768A']
      ]
    ],
    [
      '029',
      'E',
      'HOT MODE',
      '030',
      '026',
      '027',
      '5',
      2029,
      ['TCE190'],
      ['TCA536', 'TCA767', 'TCA831'],
      [
        [1928, 39, 'TCA583A'],
        [2021, 39, 'TCA584'],
        [1834, 39, 'TCA768A']
      ]
    ]
  ].forEach(([no, l, name, b0, b1, b2, n, cx, s1, s, more]) => {
    const key = 'dsw' + no,
      y = DSW.find(q => q[0] === no)[1];
    w.push(
      [
        key,
        [
          [SX + 30, y],
          [2038, y]
        ]
      ],
      [
        key,
        [
          [1735, y],
          [1735, y - 106],
          [cx - 35, y - 106]
        ]
      ],
      [
        key,
        [
          [1735, y - 53],
          [2038, y - 53]
        ]
      ]
    );
    j.push([1735, y], [1735, y - 53]);
    b.push(
      ['btr' + b0, 'o:BTR', b0, 1694, y],
      ['btr' + b1, 'o:BTR', b1, 1768, y - 106],
      ['btr' + b2, 'o:BTR', b2, 1768, y - 53]
    );
    d.push(['crt' + n, cx, y - 106, 'out', 'TCA500_1_' + n, 'S', '#1C']);
    c.push(['o' + l + '1', 'out', l + '1', 2065, y - 53, '', s1, 1], ['o' + l, 'out', l, 2065, y, '', s]);
    t.push([1826, y - 116, name], [1826, y - 63, name], [1826, y - 10, name]);
    /* the sheets the drawing prints left of the column, under the line */
    more.forEach(([x, dy, sh]) => t.push([x, y + dy, '(' + sh + ')', 0, 1.7]));
  });
  [
    ['032', 'F', 'VERY HOT MODE'],
    ['034', 'G', 'WARM OR HOT MODE'],
    ['036', 'H', 'HEAT SOAK REQUEST']
  ].forEach(([no, l, name]) => {
    const y = DSW.find(q => q[0] === no)[1];
    w.push([
      'dsw' + no,
      [
        [SX + 30, y],
        [2038, y]
      ]
    ]);
    c.push(['o' + l, 'out', l, 2065, y, '', ['-']]);
    t.push([1816, y - 10, name]);
  });
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA500',
    /* pr: printed on page 78 beside each block; the drawing above keeps them as text */
    pr: {
      cpl050: ['HL:155.0degC', 'LL:150.0degC']
    },
    title: 'START-UP MODE SELECTION',
    page: 78,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    live: { kTrip: 'trip' },
    k: [
      ['kIp', 251, 133, 'IP START', 'ref'],
      ['kTrip', 258, 713, 'TURBINE TRIP', 'ref'],
      ['kInit', 258, 776, 'INITIAL', 'ref']
    ],
    c: [
      ['iRh', 'in', 'A1', 308, 233, 'REHEAT BOWL INNER WALL METAL TEMP.', ['TCA370']],
      ['iWv', 'in', 'H', 305, 850, '', ['TCA685']],
      ['iSel', 'in', 'C', 305, 937, '', ['TCA103']],
      ['iHp', 'in', 'A1', 303, 1010, '', ['TCA360']],
      ['oL', 'out', 'L', 1477, 169, '', ['TCA830', 'TCA639'], 0, 2],
      ['oJ', 'out', 'J', 2065, 1245, '', ['TCA585']],
      ['oK', 'out', 'K', 2065, 1309, '', ['TCA586']],
      ['oK1', 'out', 'K1', 1554, 1447, '', ['-'], 1],
      ...c
    ],
    d: [['crtA1', 1556, 1375, 'out', 'TCA500_A1', 'S', '#1C'], ...d],
    b: [
      ['ls005', 'LS', '005', 737, 263, [], {}, [60, 84]],
      ['cpl050', 'CPL', '050', 1227, 180],
      ['btr043', 'o:BTR', '043', 593, 713],
      ['tw049', 'TW', '049', 732, 724, ['TW:1.0s']],
      ['not048', 'NOT', '048', 721, 808],
      ['or052', 'OR', '052', 816, 806],
      ['not047', 'NOT', '047', 592, 861],
      ['ffs045', 'FFS', '045', 978, 724, [], { l: ['S', 'R'] }, [80, 43]],
      ['or051', 'OR', '051', 1084, 722],
      ['ftr028', 'o:FTR', '028', 729, 1010],
      ['asw041', 'ASW', '041', 1248, 1386],
      ['ftr037', 'o:FTR', '037', 1685, 1245],
      ['ftr039', 'o:FTR', '039', 1685, 1309],
      ['ftr042', 'o:FTR', '042', 1321, 1447],
      ...b
    ],
    m: [
      [
        'ip',
        'START-UP MODE MT1',
        '',
        IX,
        201,
        IR - IX,
        257,
        LEFT,
        RIGHT,
        'A001',
        [[1018, 476, '(LMA531)']],
        [PI.slice(0, 7), PI]
      ],
      [
        'hp',
        'START-UP MODE MT1',
        '',
        HX,
        926,
        HR - HX,
        255,
        LEFT,
        RIGHT,
        'A002',
        [[1012, 1199, '(LMA531)']],
        [PH.slice(0, 7), PH]
      ]
    ],
    w: [
      /* IP START: over the sheet to the first DSW, down the column, to the analog switch */
      [
        'kIp',
        [
          [484, 133],
          [SX, 133],
          [SX, 222]
        ]
      ],
      [
        'kIp',
        [
          [SEL, 133],
          [SEL, 1160]
        ]
      ],
      [
        'kIp',
        [
          [SEL, 1160],
          [1248, 1160],
          [1248, 1365]
        ]
      ],
      /* the metal temperatures: the lower of the two into the IP block and the AMB. COLD comparator, the HP first stage one into the HP block */
      [
        'iRh',
        [
          [335, 233],
          [707, 233]
        ],
        1
      ],
      [
        'iHp',
        [
          [330, 1010],
          [782, 1010],
          [782, PH[0]],
          [HX, PH[0]]
        ],
        1
      ],
      [
        'iHp',
        [
          [658, 1010],
          [658, 273],
          [707, 273]
        ],
        1
      ],
      [
        'ls005',
        [
          [767, 233],
          [IX, 233]
        ],
        1
      ],
      [
        'ls005',
        [
          [841, 233],
          [841, 169],
          [1197, 169]
        ],
        1
      ],
      [
        'cpl050',
        [
          [1257, 169],
          [1450, 169]
        ]
      ],
      /* TIMIG: turbine trip held in the flip-flop, or the select condition */
      [
        'kTrip',
        [
          [491, 713],
          [702, 713]
        ]
      ],
      [
        'kTrip',
        [
          [636, 713],
          [636, 797],
          [691, 797]
        ]
      ],
      [
        'kInit',
        [
          [491, 776],
          [539, 776],
          [539, 659],
          [732, 659],
          [732, 703]
        ]
      ],
      [
        'tw049',
        [
          [762, 713],
          [938, 713]
        ]
      ],
      [
        'not048',
        [
          [751, 797],
          [786, 797]
        ]
      ],
      [
        'iWv',
        [
          [332, 850],
          [562, 850]
        ]
      ],
      [
        'not047',
        [
          [622, 850],
          [776, 850],
          [776, 816],
          [786, 816]
        ]
      ],
      [
        'or052',
        [
          [846, 797],
          [868, 797],
          [868, 734],
          [938, 734]
        ]
      ],
      [
        'ffs045',
        [
          [1018, 713],
          [1054, 713]
        ]
      ],
      [
        'iSel',
        [
          [332, 937],
          [891, 937],
          [891, 767],
          [1040, 767],
          [1040, 732],
          [1054, 732]
        ]
      ],
      [
        'or051',
        [
          [1114, 713],
          [1147, 713]
        ]
      ],
      [
        'or051',
        [
          [1147, 713],
          [1147, 617],
          [916, 617],
          [916, PI[6]],
          [IX, PI[6]]
        ]
      ],
      [
        'or051',
        [
          [1147, 713],
          [1147, 777],
          [912, 777],
          [912, PH[6]],
          [HX, PH[6]]
        ]
      ],
      /* the memorized temperatures for the heat soak timers */
      [
        'ip.HEAT',
        [
          [IR, PI[8]],
          [1208, PI[8]],
          [1208, 1375],
          [1218, 1375]
        ],
        1
      ],
      [
        'ip.HEAT',
        [
          [1208, 1245],
          [2038, 1245]
        ],
        1
      ],
      [
        'hp.HEAT',
        [
          [HR, PH[8]],
          [1183, PH[8]],
          [1183, 1396],
          [1218, 1396]
        ],
        1
      ],
      [
        'hp.HEAT',
        [
          [1183, 1309],
          [2038, 1309]
        ],
        1
      ],
      [
        'asw041',
        [
          [1278, 1375],
          [1521, 1375]
        ],
        1
      ],
      [
        'asw041',
        [
          [1300, 1375],
          [1300, 1447],
          [1527, 1447]
        ],
        1
      ],
      ...w
    ],
    j: [[SEL, 133], [658, 1010], [841, 233], [636, 713], [1147, 713], [1208, 1245], [1183, 1309], [1300, 1375], ...j],
    t: [
      [395, 167, '(TCA106)'],
      [400, 747, '(TCA103)'],
      [400, 806, '(TCA100)'],
      [942, 195, 'IP START'],
      [934, 920, 'HP START'],
      [1185, 163, 'T', 2],
      [1260, 157, 'AMB. COLD MODE TEMP.'],
      [1198, 226, 'HL:155.0degC'],
      [1310, 226, 'LL:150.0degC'],
      [690, 705, 'T', 2],
      [925, 699, 'T', 2],
      [336, 824, 'HP TURBINE WARMING VALVE'],
      [336, 845, 'FULL CLOSE'],
      [336, 909, 'START UP MODE'],
      [336, 930, 'SELECT CONDITION'],
      [336, 983, 'HP TURBINE FIRST STAGE'],
      [336, 1004, 'INNER WALL METAL TEMP.'],
      ...[505, 526, 547, 568, 590].map(y => [927, y, 'DEF K:0.0degC']),
      ...[1228, 1249, 1270, 1291, 1313].map(y => [920, y, 'DEF K:0.0degC']),
      [1743, 1218, 'MEMORIZED TEMP.FOR'],
      [1743, 1239, 'HEAT SOAK TIMER(IP START)'],
      [1743, 1282, 'MEMORIZED TEMP.FOR'],
      [1743, 1303, 'HEAT SOAK TIMER(HP START)'],
      [1346, 1349, 'MEMORIZED TEMP.FOR'],
      [1346, 1369, 'HEAT SOAK TIMER'],
      [1348, 1423, 'MEMORIZED TEMP.FOR'],
      [1348, 1443, 'HEAT SOAK TIMER'],
      [230, 1528, 'CONTROLLER:'],
      [400, 1528, 'COMM+MD'],
      [620, 1500, 'TRIGGER  :'],
      [620, 1526, 'CYCLE(ms):100'],
      ...t
    ]
  });
})();
