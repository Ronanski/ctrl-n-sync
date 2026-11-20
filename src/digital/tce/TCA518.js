/* TCA518 STEP CONTROL CONDITION (331DM09788 page 87, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the
   page rendered 2296 wide. STEP EXE CRITERIA NOT OK of the criteria monitor sheets TCA550 .. TCA562 to OR 003, of TCA563 .. TCA567 through
   OR 010 into the same OR; through NOT 002 = STEP CRITERIA OK (connector A to TCA511 / 516, and a definition). STEP IN CRITERIA OK AND
   STEP CRITERIA OK (A 005), inverted (NOT 006), give a 2 s pulse (TP A007, INITIAL on its top) = UNFULFILLED CRITERIA ALARM, to the lamp TCA518_1
   and to TCT081D. */
(typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
  id: 'TCA518',
  title: 'STEP CONTROL CONDITION',
  page: 87,
  ctl: 'COMM+MD',
  cycle: 100,
  f: [152, 86, 2218, 1548],
  k: [
    ['dOk', 1882, 569, 'STEP CRITERIA OK', 'def', 'def'],
    ['kInit', 250, 140, 'INITIAL', 'ref']
  ],
  c: [
    ['iB0', 'in', 'B', 244, 375, '', ['TCA550']],
    ['iB1', 'in', 'B', 243, 439, '', ['TCA551']],
    ['iB2', 'in', 'B', 242, 503, '', ['TCA552']],
    ['iB3', 'in', 'B', 242, 567, '', ['TCA553']],
    ['iB4', 'in', 'B', 241, 631, '', ['TCA554']],
    ['iB5', 'in', 'B', 240, 695, '', ['TCA555']],
    ['iB6', 'in', 'B', 239, 759, '', ['TCA556']],
    ['iB7', 'in', 'B', 238, 823, '', ['TCA557']],
    ['iB8', 'in', 'B', 238, 887, '', ['TCA558']],
    ['iB9', 'in', 'B', 237, 951, '', ['TCA559']],
    ['iB10', 'in', 'B', 236, 1025, '', ['TCA560']],
    ['iB11', 'in', 'B', 235, 1089, '', ['TCA561']],
    ['iB12', 'in', 'B', 234, 1153, '', ['TCA562']],
    ['iB13', 'in', 'B', 228, 1217, '', ['TCA563']],
    ['iB14', 'in', 'B', 227, 1281, '', ['TCA564']],
    ['iB15', 'in', 'B', 225, 1345, '', ['TCA565']],
    ['iB16', 'in', 'B', 224, 1409, '', ['TCA566']],
    ['iB17', 'in', 'B', 222, 1473, '', ['TCA567']],
    ['oA', 'out', 'A', 1990, 380, '', ['TCA511', 'TCA516'], 0, 1],
    ['iA', 'in', 'A', 256, 216, '', ['TCA517']],
    ['oA1', 'out', 'A1', 2035, 283, '', ['TCT081D'], 1, 1]
  ],
  d: [['crt1', 2037, 219, 'out', 'TCA518_1', 'S', '#1C']],
  b: [
    ['or003', 'OR', '003', 1097, 514, [], {}, [59, 298]],
    ['or010', 'OR', '010', 852, 1258, [], {}, [58, 107]],
    ['not002', 'NOT', '002', 1288, 387],
    ['a005', 'A', '005', 1408, 227],
    ['not006', 'NOT', '006', 1503, 227],
    ['tpA007', 'TP', 'A007', 1587, 227, ['TP:2.0']],
    ['btr008', 'o:BTR', '008', 1695, 219],
    ['btr009', 'o:BTR', '009', 1693, 283]
  ],
  w: [
    [
      'iB0',
      [
        [271, 375],
        [1068, 375]
      ]
    ],
    [
      'iB1',
      [
        [270, 439],
        [788, 439],
        [788, 397],
        [1068, 397]
      ]
    ],
    [
      'iB2',
      [
        [269, 503],
        [809, 503],
        [809, 419],
        [1068, 419]
      ]
    ],
    [
      'iB3',
      [
        [269, 567],
        [829, 567],
        [829, 440],
        [1068, 440]
      ]
    ],
    [
      'iB4',
      [
        [268, 631],
        [850, 631],
        [850, 461],
        [1068, 461]
      ]
    ],
    [
      'iB5',
      [
        [267, 695],
        [871, 695],
        [871, 483],
        [1068, 483]
      ]
    ],
    [
      'iB6',
      [
        [266, 759],
        [891, 759],
        [891, 504],
        [1068, 504]
      ]
    ],
    [
      'iB7',
      [
        [265, 823],
        [913, 823],
        [913, 525],
        [1068, 525]
      ]
    ],
    [
      'iB8',
      [
        [265, 887],
        [933, 887],
        [933, 547],
        [1068, 547]
      ]
    ],
    [
      'iB9',
      [
        [264, 951],
        [955, 951],
        [955, 569],
        [1068, 569]
      ]
    ],
    [
      'iB10',
      [
        [263, 1025],
        [977, 1025],
        [977, 590],
        [1068, 590]
      ]
    ],
    [
      'iB11',
      [
        [262, 1089],
        [998, 1089],
        [998, 611],
        [1068, 611]
      ]
    ],
    [
      'iB12',
      [
        [261, 1153],
        [1019, 1153],
        [1019, 633],
        [1068, 633]
      ]
    ],
    [
      'iB13',
      [
        [255, 1217],
        [823, 1217]
      ]
    ],
    [
      'iB14',
      [
        [254, 1281],
        [781, 1281],
        [781, 1237],
        [823, 1237]
      ]
    ],
    [
      'iB15',
      [
        [252, 1345],
        [791, 1345],
        [791, 1259],
        [823, 1259]
      ]
    ],
    [
      'iB16',
      [
        [251, 1409],
        [802, 1409],
        [802, 1280],
        [823, 1280]
      ]
    ],
    [
      'iB17',
      [
        [249, 1473],
        [809, 1473],
        [809, 1301],
        [823, 1301]
      ]
    ],
    [
      'or010',
      [
        [881, 1217],
        [1049, 1217],
        [1049, 653],
        [1068, 653]
      ]
    ],
    [
      'or003',
      [
        [1126, 377],
        [1259, 377]
      ]
    ],
    [
      'not002',
      [
        [1317, 377],
        [1963, 377]
      ]
    ],
    [
      'not002',
      [
        [1352, 377],
        [1352, 569],
        [1882, 569]
      ]
    ],
    [
      'not002',
      [
        [1352, 377],
        [1352, 238],
        [1379, 238]
      ]
    ],
    [
      'kInit',
      [
        [483, 141],
        [1587, 141],
        [1587, 206]
      ]
    ],
    [
      'iA',
      [
        [283, 216],
        [1379, 216]
      ]
    ],
    [
      'a005',
      [
        [1437, 219],
        [1475, 219]
      ]
    ],
    [
      'not006',
      [
        [1532, 219],
        [1558, 219]
      ]
    ],
    [
      'tpA007',
      [
        [1616, 219],
        [2002, 219]
      ]
    ],
    [
      'tpA007',
      [
        [1652, 219],
        [1652, 283],
        [2008, 283]
      ]
    ]
  ],
  j: [
    [1352, 377],
    [1652, 219]
  ],
  t: [
    [275, 368, 'STEP EXE CRITERIA NOT OK'],
    [274, 432, 'STEP EXE CRITERIA NOT OK'],
    [273, 496, 'STEP EXE CRITERIA NOT OK'],
    [273, 560, 'STEP EXE CRITERIA NOT OK'],
    [272, 624, 'STEP EXE CRITERIA NOT OK'],
    [271, 688, 'STEP EXE CRITERIA NOT OK'],
    [270, 752, 'STEP EXE CRITERIA NOT OK'],
    [269, 816, 'STEP EXE CRITERIA NOT OK'],
    [269, 880, 'STEP EXE CRITERIA NOT OK'],
    [268, 944, 'STEP EXE CRITERIA NOT OK'],
    [267, 1018, 'STEP EXE CRITERIA NOT OK'],
    [266, 1082, 'STEP EXE CRITERIA NOT OK'],
    [265, 1146, 'STEP EXE CRITERIA NOT OK'],
    [262, 1210, 'STEP EXE CRITERIA NOT OK'],
    [261, 1274, 'STEP EXE CRITERIA NOT OK'],
    [259, 1338, 'STEP EXE CRITERIA NOT OK'],
    [258, 1402, 'STEP EXE CRITERIA NOT OK'],
    [256, 1466, 'STEP EXE CRITERIA NOT OK'],
    [1782, 369, 'STEP CRITERIA OK'],
    [395, 172, '(TCA100)'],
    [288, 208, 'STEP IN CRITERIA OK'],
    [1545, 213, 'T', 1],
    [1786, 189, 'UNFULFILLED'],
    [1786, 210, 'CRITERIA ALARM'],
    [1786, 253, 'UNFULFILLED'],
    [1786, 274, 'CRITERIA ALARM'],
    [220, 1527, 'CONTROLLER:'],
    [380, 1527, 'COMM+MD'],
    [604, 1503, 'TRIGGER  :'],
    [604, 1529, 'CYCLE(ms):100']
  ]
});
