/* TCA825 ALARM (331DM09788 page 232, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page rendered 2296 wide.
   Three alarms to the operator station (CRT TCA825_1.._3) and the connectors A1 / A2 / A3, and TURBINE TRIP on to TCA826 / TCA831:
   MAIN STEAM TEMP. LOW: turbine not tripped, the MSV inlet steam temperature low (CPL 295.0 / 290.0 degC) and the generator load once over
   30.0 MW (CMP, held in the flip-flop FFS 009 until the turbine trips); or, with that load reached, the MSV inlet steam temperature under the
   one a function generator gives for the HP first stage steam temperature (FG 015 / FG 017 picked by LCK 011, SUB 013, CPL 014).
   HP TURBINE INLET/EXHAUST STEAM DIFF. PRESS HIGH: first stage less exhaust (SUB 018) over the limit of FG 025 (SUB 019, CMP 020), with the
   load over 45.0 MW (CMP 028). HP TURBINE EXHAUST STEAM PRESS HIGH: over 42.7 kg/cm2g (CMP 032), turbine not tripped.
   INITIAL comes to the top of every CMP. The words are the ones of the drawing (MSV INLLET, FIRST STAGE STEAM TEMP. on the pressure input).
   live: TURBINE TRIP and GEN. LOAD (tcs.js tcsLiveRead); the engine runs no gate of the sheet, so the other lines stay without a state. */
(typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
  id: 'TCA825',
  title: 'ALARM',
  page: 232,
  ctl: 'COMM+MD',
  cycle: 100,
  f: [170, 82, 2218, 1546],
  live: { iTrip: 'trip', iLoad: ['mw', 'MW'] },
  k: [['kInit', 269, 167, 'INITIAL', 'ref']],
  c: [
    ['iTrip', 'in', 'A', 358, 275, 'TURBINE TRIP', ['TCE113A'], 1],
    ['iMsv', 'in', 'A1', 346, 392, 'MSV INLLET STEAM TEMP.', ['TCE067'], 1],
    ['iLoad', 'in', 'A1', 345, 531, 'GEN. LOAD', ['TCE070'], 1],
    ['iFs', 'in', 'A1', 343, 680, '', ['TCE064'], 1],
    ['iEx', 'in', 'A1', 351, 936, '', ['TCE060'], 1],
    ['oB1', 'out', 'B1', 2053, 179, '', ['TCA826', 'TCA831'], 0, 3],
    ['oA1', 'out', 'A1', 2063, 275, '', ['-']],
    ['oA2', 'out', 'A2', 2054, 914, '', ['-']],
    ['oA3', 'out', 'A3', 2052, 1224, '', ['-']]
  ],
  d: [
    ['crt1', 2060, 351, 'out', 'TCA825_1', 'S', '#1C'],
    ['crt2', 2052, 990, 'out', 'TCA825_2', 'S', '#1C'],
    ['crt3', 2050, 1299, 'out', 'TCA825_3', 'S', '#1C']
  ],
  b: [
    ['btr001', 'o:BTR', '001', 1723, 179],
    ['not002', 'NOT', '002', 1094, 286],
    ['a003', 'A', '003', 1425, 297, [], {}, [60, 65]],
    ['or004', 'OR', '004', 1582, 286],
    ['btr005', 'o:BTR', '005', 1722, 275],
    ['btr006', 'o:BTR', '006', 1722, 351],
    ['cpl007', 'CPL', '007', 719, 403, ['HL:295.0degC', 'LL:290.0degC']],
    ['cmp008', 'CMP', '008', 718, 542, ['HL:30.0MW', 'LL:25.5MW']],
    ['ffs009', 'FFS', '009', 930, 542, [], { l: ['S', 'R'] }, [80, 43]],
    ['not010', 'NOT', '010', 1092, 542],
    ['lck011', 'LCK', '011', 705, 691, ['K:75.0kg/cm2g']],
    ['a012', 'A', '012', 1409, 734],
    ['sub013', 'SUB', '013', 1079, 755, [], { l: ['+', '-'] }],
    ['cpl014', 'CPL', '014', 1227, 756, ['HL:0.0', 'LL:0.0']],
    ['fg015', 'FG', '015', 704, 776],
    ['asw016', 'ASW', '016', 918, 776],
    ['fg017', 'FG', '017', 704, 851],
    ['sub018', 'SUB', '018', 703, 925, [], { l: ['+', '-'] }],
    ['sub019', 'SUB', '019', 1055, 925, [], { l: ['+', '-'] }],
    ['cmp020', 'CMP', '020', 1225, 925, ['HL:0.0', 'LL:0.0']],
    ['a021', 'A', '021', 1407, 925],
    ['btr022', 'o:BTR', '022', 1715, 914],
    ['btr024', 'o:BTR', '024', 1714, 990],
    ['fg025', 'FG', '025', 702, 1084],
    ['cmp028', 'CMP', '028', 913, 1234, ['HL:45.0MW', 'LL:40.5MW']],
    ['a029', 'A', '029', 1393, 1235],
    ['btr030', 'o:BTR', '030', 1712, 1224],
    ['btr031', 'o:BTR', '031', 1711, 1299],
    ['cmp032', 'CMP', '032', 912, 1362, ['HL:42.7kg/cm2g', 'LL:40.7kg/cm2g']]
  ],
  w: [
    /* INITIAL to the top of the four CMP */
    [
      'kInit',
      [
        [503, 167],
        [824, 167],
        [824, 1308],
        [912, 1308],
        [912, 1341]
      ]
    ],
    [
      'kInit',
      [
        [824, 499],
        [718, 499],
        [718, 521]
      ]
    ],
    [
      'kInit',
      [
        [824, 872],
        [1225, 872],
        [1225, 904]
      ]
    ],
    [
      'kInit',
      [
        [824, 1170],
        [913, 1170],
        [913, 1213]
      ]
    ],
    /* TURBINE TRIP: on to TCA826 / TCA831, the reset of the flip-flop, and inverted into the alarms */
    [
      'iTrip',
      [
        [385, 275],
        [1064, 275]
      ]
    ],
    [
      'iTrip',
      [
        [859, 275],
        [859, 179],
        [2026, 179]
      ]
    ],
    [
      'iTrip',
      [
        [859, 275],
        [859, 552],
        [890, 552]
      ]
    ],
    [
      'not002',
      [
        [1124, 275],
        [1395, 275]
      ]
    ],
    [
      'not002',
      [
        [1347, 275],
        [1347, 1224],
        [1363, 1224]
      ]
    ],
    /* MAIN STEAM TEMP. LOW */
    [
      'iMsv',
      [
        [373, 392],
        [689, 392]
      ],
      1
    ],
    [
      'iMsv',
      [
        [633, 392],
        [633, 627],
        [1004, 627],
        [1004, 745],
        [1049, 745]
      ],
      1
    ],
    [
      'cpl007',
      [
        [749, 392],
        [1220, 392],
        [1220, 297],
        [1395, 297]
      ]
    ],
    [
      'iLoad',
      [
        [372, 531],
        [688, 531]
      ],
      1
    ],
    [
      'iLoad',
      [
        [578, 531],
        [578, 1223],
        [883, 1223]
      ],
      1
    ],
    [
      'cmp008',
      [
        [748, 531],
        [890, 531]
      ]
    ],
    [
      'ffs009',
      [
        [970, 531],
        [1062, 531]
      ]
    ],
    [
      'ffs009',
      [
        [1027, 531],
        [1027, 669],
        [1323, 669],
        [1323, 723],
        [1379, 723]
      ]
    ],
    [
      'not010',
      [
        [1122, 531],
        [1251, 531],
        [1251, 318],
        [1395, 318]
      ]
    ],
    [
      'a003',
      [
        [1455, 275],
        [1552, 275]
      ]
    ],
    [
      'or004',
      [
        [1612, 275],
        [2036, 275]
      ]
    ],
    [
      'or004',
      [
        [1689, 275],
        [1689, 351],
        [2025, 351]
      ]
    ],
    [
      'iFs',
      [
        [370, 680],
        [675, 680]
      ],
      1
    ],
    [
      'iFs',
      [
        [619, 680],
        [619, 1073],
        [672, 1073]
      ],
      1
    ],
    [
      'iFs',
      [
        [619, 765],
        [674, 765]
      ],
      1
    ],
    [
      'iFs',
      [
        [619, 840],
        [674, 840]
      ],
      1
    ],
    [
      'iFs',
      [
        [619, 914],
        [673, 914]
      ],
      1
    ],
    [
      'lck011',
      [
        [735, 680],
        [918, 680],
        [918, 755]
      ]
    ],
    [
      'fg015',
      [
        [734, 765],
        [888, 765]
      ],
      1
    ],
    [
      'fg017',
      [
        [734, 840],
        [854, 840],
        [854, 787],
        [888, 787]
      ],
      1
    ],
    [
      'asw016',
      [
        [948, 765],
        [1049, 765]
      ],
      1
    ],
    [
      'sub013',
      [
        [1109, 745],
        [1197, 745]
      ],
      1
    ],
    [
      'cpl014',
      [
        [1257, 745],
        [1379, 745]
      ]
    ],
    [
      'a012',
      [
        [1439, 723],
        [1503, 723],
        [1503, 297],
        [1552, 297]
      ]
    ],
    /* HP TURBINE INLET/EXHAUST STEAM DIFF. PRESS HIGH */
    [
      'iEx',
      [
        [378, 936],
        [673, 936]
      ],
      1
    ],
    [
      'iEx',
      [
        [542, 936],
        [542, 1351],
        [882, 1351]
      ],
      1
    ],
    [
      'sub018',
      [
        [733, 914],
        [1025, 914]
      ],
      1
    ],
    [
      'fg025',
      [
        [732, 1073],
        [926, 1073],
        [926, 936],
        [1025, 936]
      ],
      1
    ],
    [
      'sub019',
      [
        [1085, 914],
        [1195, 914]
      ],
      1
    ],
    [
      'cmp020',
      [
        [1255, 914],
        [1377, 914]
      ]
    ],
    [
      'cmp028',
      [
        [943, 1223],
        [1275, 1223],
        [1275, 936],
        [1377, 936]
      ]
    ],
    [
      'a021',
      [
        [1437, 914],
        [2027, 914]
      ]
    ],
    [
      'a021',
      [
        [1682, 914],
        [1682, 990],
        [2017, 990]
      ]
    ],
    /* HP TURBINE EXHAUST STEAM PRESS HIGH */
    [
      'cmp032',
      [
        [942, 1351],
        [1224, 1351],
        [1224, 1245],
        [1363, 1245]
      ]
    ],
    [
      'a029',
      [
        [1423, 1224],
        [2025, 1224]
      ]
    ],
    [
      'a029',
      [
        [1679, 1224],
        [1679, 1299],
        [2015, 1299]
      ]
    ]
  ],
  j: [
    [824, 499],
    [824, 872],
    [824, 1170],
    [859, 275],
    [1347, 275],
    [633, 392],
    [578, 531],
    [1027, 531],
    [1689, 275],
    [619, 680],
    [619, 765],
    [619, 840],
    [619, 914],
    [542, 936],
    [1682, 914],
    [1679, 1224]
  ],
  t: [
    [406, 205, '(TCA100)'],
    [375, 652, 'HP TURBINE FIRST STAGE'],
    [375, 673, 'STEAM TEMP.'],
    [384, 908, 'HP TURBINE EXHAUST'],
    [384, 929, 'STEAM PRESS.'],
    [680, 388, 'T', 2],
    [678, 527, 'T', 2],
    [882, 520, 'T', 2],
    [1189, 741, 'T', 2],
    [1187, 910, 'T', 2],
    [875, 1219, 'T', 2],
    [874, 1347, 'T', 2],
    [1813, 171, 'TURBINE TRIP'],
    [1748, 267, 'MAIN STEAM TEMP. LOW'],
    [1748, 343, 'MAIN STEAM TEMP. LOW'],
    [1752, 885, 'HP TURBINE INLET/EXHAUST'],
    [1752, 906, 'STEAM DIFF. PRESS HIGH'],
    [1751, 961, 'HP TURBINE INLET/EXHAUST'],
    [1751, 982, 'STEAM DIFF. PRESS HIGH'],
    [1749, 1195, 'HP TURBINE EXHAUST'],
    [1749, 1216, 'STEAM PRESS HIGH'],
    [1748, 1270, 'HP TURBINE EXHAUST'],
    [1748, 1291, 'STEAM PRESS HIGH'],
    [226, 1528, 'CONTROLLER:'],
    [389, 1528, 'COMM+MD'],
    [612, 1504, 'TRIGGER  :'],
    [612, 1530, 'CYCLE(ms):100']
  ]
});
