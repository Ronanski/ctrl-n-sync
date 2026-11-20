/* TCA517 STEP CONTROL CONDITION (331DM09788 page 86, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the
   page rendered 2296 wide. STEP IN CRITERIA NOT OK of the criteria monitor sheets TCA550 .. TCA562 to OR 003, of TCA563 .. TCA567 through
   OR 004 into the same OR; through NOT 002 = STEP IN CRITERIA OK, to the connector A (TCA511 / 516 / 518 / 528) and given out as a definition. */
(typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
  id: 'TCA517',
  title: 'STEP CONTROL CONDITION',
  page: 86,
  ctl: 'COMM+MD',
  cycle: 100,
  f: [158, 88, 2226, 1548],
  k: [['dOk', 1945, 355, 'STEP IN CRITERIA OK', 'def', 'def']],
  c: [
    ['iA0', 'in', 'A', 251, 151, '', ['TCA550']],
    ['iA1', 'in', 'A', 250, 214, '', ['TCA551']],
    ['iA2', 'in', 'A', 250, 278, '', ['TCA552']],
    ['iA3', 'in', 'A', 249, 342, '', ['TCA553']],
    ['iA4', 'in', 'A', 248, 405, '', ['TCA554']],
    ['iA5', 'in', 'A', 248, 470, '', ['TCA555']],
    ['iA6', 'in', 'A', 247, 534, '', ['TCA556']],
    ['iA7', 'in', 'A', 246, 598, '', ['TCA557']],
    ['iA8', 'in', 'A', 246, 662, '', ['TCA558']],
    ['iA9', 'in', 'A', 245, 726, '', ['TCA559']],
    ['iA10', 'in', 'A', 244, 790, '', ['TCA560']],
    ['iA11', 'in', 'A', 244, 854, '', ['TCA561']],
    ['iA12', 'in', 'A', 243, 918, '', ['TCA562']],
    ['iA13', 'in', 'A', 242, 1013, '', ['TCA563']],
    ['iA14', 'in', 'A', 241, 1088, '', ['TCA564']],
    ['iA15', 'in', 'A', 241, 1162, '', ['TCA565']],
    ['iA16', 'in', 'A', 240, 1237, '', ['TCA566']],
    ['iA17', 'in', 'A', 240, 1311, '', ['TCA567']],
    ['oA', 'out', 'A', 2095, 151, '', ['TCA511', 'TCA516', 'TCA518', 'TCA528'], 0, 4]
  ],
  d: [],
  b: [
    ['or003', 'OR', '003', 1180, 290, [], {}, [61, 298]],
    ['or004', 'OR', '004', 970, 1056, [], {}, [57, 107]],
    ['not002', 'NOT', '002', 1426, 162]
  ],
  w: [
    [
      'iA0',
      [
        [278, 151],
        [1150, 151]
      ]
    ],
    [
      'iA1',
      [
        [277, 214],
        [863, 214],
        [863, 173],
        [1150, 173]
      ]
    ],
    [
      'iA2',
      [
        [277, 278],
        [883, 278],
        [883, 194],
        [1150, 194]
      ]
    ],
    [
      'iA3',
      [
        [276, 342],
        [903, 342],
        [903, 215],
        [1150, 215]
      ]
    ],
    [
      'iA4',
      [
        [275, 405],
        [937, 405],
        [937, 235],
        [1150, 235]
      ]
    ],
    [
      'iA5',
      [
        [275, 470],
        [957, 470],
        [957, 257],
        [1150, 257]
      ]
    ],
    [
      'iA6',
      [
        [274, 534],
        [977, 534],
        [977, 278],
        [1150, 278]
      ]
    ],
    [
      'iA7',
      [
        [273, 598],
        [998, 598],
        [998, 300],
        [1150, 300]
      ]
    ],
    [
      'iA8',
      [
        [273, 662],
        [1019, 662],
        [1019, 322],
        [1150, 322]
      ]
    ],
    [
      'iA9',
      [
        [272, 726],
        [1040, 726],
        [1040, 343],
        [1150, 343]
      ]
    ],
    [
      'iA10',
      [
        [271, 790],
        [1060, 790],
        [1060, 365],
        [1150, 365]
      ]
    ],
    [
      'iA11',
      [
        [271, 854],
        [1081, 854],
        [1081, 385],
        [1150, 385]
      ]
    ],
    [
      'iA12',
      [
        [270, 918],
        [1103, 918],
        [1103, 405],
        [1150, 405]
      ]
    ],
    [
      'iA13',
      [
        [269, 1013],
        [941, 1013]
      ]
    ],
    [
      'iA14',
      [
        [268, 1088],
        [898, 1088],
        [898, 1035],
        [941, 1035]
      ]
    ],
    [
      'iA15',
      [
        [268, 1162],
        [907, 1162],
        [907, 1056],
        [941, 1056]
      ]
    ],
    [
      'iA16',
      [
        [267, 1237],
        [917, 1237],
        [917, 1077],
        [941, 1077]
      ]
    ],
    [
      'iA17',
      [
        [267, 1311],
        [925, 1311],
        [925, 1098],
        [941, 1098]
      ]
    ],
    [
      'or004',
      [
        [998, 1013],
        [1133, 1013],
        [1133, 423],
        [1150, 423]
      ]
    ],
    [
      'or003',
      [
        [1211, 151],
        [1397, 151]
      ]
    ],
    [
      'not002',
      [
        [1455, 151],
        [2068, 151]
      ]
    ],
    [
      'not002',
      [
        [1585, 151],
        [1585, 355],
        [1945, 355]
      ]
    ]
  ],
  j: [[1585, 151]],
  t: [
    [285, 144, 'STEP IN CRITERIA NOT OK'],
    [284, 207, 'STEP IN CRITERIA NOT OK'],
    [284, 271, 'STEP IN CRITERIA NOT OK'],
    [283, 335, 'STEP IN CRITERIA NOT OK'],
    [282, 398, 'STEP IN CRITERIA NOT OK'],
    [282, 463, 'STEP IN CRITERIA NOT OK'],
    [281, 527, 'STEP IN CRITERIA NOT OK'],
    [280, 591, 'STEP IN CRITERIA NOT OK'],
    [280, 655, 'STEP IN CRITERIA NOT OK'],
    [279, 719, 'STEP IN CRITERIA NOT OK'],
    [278, 783, 'STEP IN CRITERIA NOT OK'],
    [278, 847, 'STEP IN CRITERIA NOT OK'],
    [277, 911, 'STEP IN CRITERIA NOT OK'],
    [276, 1006, 'STEP IN CRITERIA NOT OK'],
    [275, 1081, 'STEP IN CRITERIA NOT OK'],
    [275, 1155, 'STEP IN CRITERIA NOT OK'],
    [274, 1230, 'STEP IN CRITERIA NOT OK'],
    [274, 1304, 'STEP IN CRITERIA NOT OK'],
    [1833, 145, 'STEP IN CRITERIA OK'],
    [226, 1527, 'CONTROLLER:'],
    [388, 1527, 'COMM+MD'],
    [613, 1501, 'TRIGGER  :'],
    [613, 1527, 'CYCLE(ms):100']
  ]
});
