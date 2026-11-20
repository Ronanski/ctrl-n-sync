/* TCA515 STEP CONTROL CONDITION (331DM09788 page 84, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the
   page rendered 2296 wide. One STEP UP ORDER MT1 macro block (002, LMA537): STEP 0 .. 7 SELECT (A from TCA520 .. TCA527, each through a
   BTR) give STEP UP ORDER(STEP n) (A0 .. A7), each back to the sheet of its step. */
(typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
  id: 'TCA515',
  title: 'STEP CONTROL CONDITION',
  page: 84,
  ctl: 'COMM+MD',
  cycle: 100,
  f: [165, 88, 2230, 1548],
  k: [],
  c: [
    ['iA0', 'in', 'A', 299, 176, '', ['TCA520']],
    ['oA0', 'out', 'A0', 2112, 176, '', ['TCA520'], 0, 1],
    ['iA1', 'in', 'A', 298, 245, '', ['TCA521']],
    ['oA1', 'out', 'A1', 2111, 250, '', ['TCA521'], 0, 1],
    ['iA2', 'in', 'A', 298, 320, '', ['TCA522']],
    ['oA2', 'out', 'A2', 2110, 325, '', ['TCA522'], 0, 1],
    ['iA3', 'in', 'A', 297, 395, '', ['TCA523']],
    ['oA3', 'out', 'A3', 2109, 399, '', ['TCA523'], 0, 1],
    ['iA4', 'in', 'A', 297, 470, '', ['TCA524']],
    ['oA4', 'out', 'A4', 2108, 474, '', ['TCA524'], 0, 1],
    ['iA5', 'in', 'A', 296, 545, '', ['TCA525']],
    ['oA5', 'out', 'A5', 2107, 548, '', ['TCA525'], 0, 1],
    ['iA6', 'in', 'A', 295, 619, '', ['TCA526']],
    ['oA6', 'out', 'A6', 2106, 622, '', ['TCA526'], 0, 1],
    ['iA7', 'in', 'A', 295, 694, '', ['TCA527']],
    ['oA7', 'out', 'A7', 2105, 697, '', ['TCA527'], 0, 1]
  ],
  d: [],
  b: [
    ['btr001', 'o:BTR', '001', 845, 176],
    ['btr003', 'o:BTR', '003', 1655, 176],
    ['btr004', 'o:BTR', '004', 844, 245],
    ['btr005', 'o:BTR', '005', 1654, 250],
    ['btr006', 'o:BTR', '006', 843, 320],
    ['btr007', 'o:BTR', '007', 1654, 325],
    ['btr008', 'o:BTR', '008', 842, 395],
    ['btr009', 'o:BTR', '009', 1653, 399],
    ['btr010', 'o:BTR', '010', 841, 470],
    ['btr011', 'o:BTR', '011', 1652, 474],
    ['btr012', 'o:BTR', '012', 840, 545],
    ['btr013', 'o:BTR', '013', 1651, 548],
    ['btr014', 'o:BTR', '014', 840, 619],
    ['btr015', 'o:BTR', '015', 1651, 622],
    ['btr016', 'o:BTR', '016', 839, 694],
    ['btr017', 'o:BTR', '017', 1650, 697]
  ],
  m: [
    [
      'mt1',
      'STEP UP ORDER MT1',
      '',
      1122,
      142,
      235,
      212,
      ['SELECT0', 'SELECT1', 'SELECT2', 'SELECT3', 'SELECT4', 'SELECT5', 'SELECT6', 'SELECT7'],
      ['ORDER0', 'ORDER1', 'ORDER2', 'ORDER3', 'ORDER4', 'ORDER5', 'ORDER6', 'ORDER7'],
      '002',
      [[1204, 376, '(LMA537)']],
      [
        [176, 197, 219, 240, 262, 283, 305, 326],
        [176, 197, 219, 240, 262, 283, 305, 326]
      ]
    ]
  ],
  w: [
    [
      'iA0',
      [
        [326, 176],
        [1122, 176]
      ]
    ],
    [
      'mt1.ORDER0',
      [
        [1357, 176],
        [2085, 176]
      ]
    ],
    [
      'iA1',
      [
        [325, 245],
        [975, 245],
        [975, 197],
        [1122, 197]
      ]
    ],
    [
      'mt1.ORDER1',
      [
        [1357, 197],
        [1505, 197],
        [1505, 250],
        [2085, 250]
      ]
    ],
    [
      'iA2',
      [
        [325, 320],
        [995, 320],
        [995, 219],
        [1122, 219]
      ]
    ],
    [
      'mt1.ORDER2',
      [
        [1357, 219],
        [1483, 219],
        [1483, 325],
        [2085, 325]
      ]
    ],
    [
      'iA3',
      [
        [324, 395],
        [1016, 395],
        [1016, 240],
        [1122, 240]
      ]
    ],
    [
      'mt1.ORDER3',
      [
        [1357, 240],
        [1462, 240],
        [1462, 399],
        [2085, 399]
      ]
    ],
    [
      'iA4',
      [
        [324, 470],
        [1036, 470],
        [1036, 262],
        [1122, 262]
      ]
    ],
    [
      'mt1.ORDER4',
      [
        [1357, 262],
        [1440, 262],
        [1440, 474],
        [2085, 474]
      ]
    ],
    [
      'iA5',
      [
        [323, 545],
        [1056, 545],
        [1056, 283],
        [1122, 283]
      ]
    ],
    [
      'mt1.ORDER5',
      [
        [1357, 283],
        [1418, 283],
        [1418, 548],
        [2085, 548]
      ]
    ],
    [
      'iA6',
      [
        [322, 619],
        [1076, 619],
        [1076, 305],
        [1122, 305]
      ]
    ],
    [
      'mt1.ORDER6',
      [
        [1357, 305],
        [1396, 305],
        [1396, 622],
        [2085, 622]
      ]
    ],
    [
      'iA7',
      [
        [322, 694],
        [1097, 694],
        [1097, 326],
        [1122, 326]
      ]
    ],
    [
      'mt1.ORDER7',
      [
        [1357, 326],
        [1374, 326],
        [1374, 697],
        [2085, 697]
      ]
    ]
  ],
  j: [],
  t: [
    [333, 169, 'STEP 0 SELECT'],
    [1850, 169, 'STEP UP ORDER(STEP 0)'],
    [333, 238, 'STEP 1 SELECT'],
    [1850, 243, 'STEP UP ORDER(STEP 1)'],
    [333, 313, 'STEP 2 SELECT'],
    [1850, 318, 'STEP UP ORDER(STEP 2)'],
    [333, 388, 'STEP 3 SELECT'],
    [1850, 392, 'STEP UP ORDER(STEP 3)'],
    [333, 463, 'STEP 4 SELECT'],
    [1850, 467, 'STEP UP ORDER(STEP 4)'],
    [333, 538, 'STEP 5 SELECT'],
    [1850, 541, 'STEP UP ORDER(STEP 5)'],
    [333, 612, 'STEP 6 SELECT'],
    [1850, 615, 'STEP UP ORDER(STEP 6)'],
    [333, 687, 'STEP 7 SELECT'],
    [1850, 690, 'STEP UP ORDER(STEP 7)'],
    [1130, 1281, 'STEP 0 : HP TURBINE WARMING'],
    [1130, 1313, 'STEP 1 : PREPARATION'],
    [1130, 1345, 'STEP 2 : TURBINE RUB CHECK'],
    [1130, 1377, 'STEP 3 : ACCELERATION'],
    [1130, 1409, 'STEP 4 : EXCITATION'],
    [1130, 1441, 'STEP 5 : SYNC INITIAL LOAD'],
    [1130, 1473, 'STEP 6 : LOAD UP'],
    [1130, 1505, 'STEP 7 : NORMAL OPERATION'],
    [1130, 1537, 'STEP 8 : TURBINE SHUT-DOWN'],
    [231, 1527, 'CONTROLLER:'],
    [393, 1527, 'COMM+MD'],
    [617, 1501, 'TRIGGER  :'],
    [617, 1527, 'CYCLE(ms):100']
  ]
});
