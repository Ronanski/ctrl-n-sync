/* TCA103 CONTROLLER CONDITION(4) (331DM09788 page 37, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. The signals of the governor controller (TCE053, TCE041, TCE111, TCE162, TCE190) given to the start-up sheets as definitions:
   RATED SPEED (SG 3600.0 rpm), TRIP PRESS.LOW, TURBINE TRIP (TURBINE RESET inverted), ANN ENABLE / ANN INHIBIT (ANN ENABLE and INITIAL),
   52G CLOSE, ANN ENABLE 52G, 41 CLOSE, GEN.LOAD>INIT.LOAD, ALL VALVE CLOSED, 52L CLOSE (52L OPEN inverted). START UP MODE SELECT CONDITION
   (to TCA500) is 52G CLOSE with SYNC INITIAL LOAD STEP EXECUTED and 52L OPEN, held 3 s. Trigger_of_LOGIC_2 is the 60 s pulse (TP A015 fed back
   through NOT 016) that runs TCA300 to TCA316 and gives THSC TRIG to TCA751.
   live: TURBINE RESET, TURBINE TRIP, 52G CLOSE, 52L OPEN / CLOSE (tcs.js tcsLiveRead); the other lines stay without a state. */
(typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
  id: 'TCA103',
  title: 'CONTROLLER CONDITION(4)',
  page: 37,
  ctl: 'COMM+MD',
  cycle: 100,
  f: [170, 82, 2218, 1546],
  live: { iRst: 'rst', not004: 'trip', i52g: 'g52', i52l: 'l52o', not024: 'l52c' },
  k: [
    ['kInit', 330, 1141, 'INITIAL', 'ref'],
    ['dRated', 1935, 170, 'RATED SPEED', 'def', 'def'],
    ['dTrp', 1935, 281, 'TRIP PRESS.LOW', 'def', 'def'],
    ['dTrip', 1935, 428, 'TURBINE TRIP', 'def', 'def'],
    ['dAnn', 1935, 505, 'ANN ENABLE', 'def', 'def'],
    ['dInh', 1935, 578, 'ANN INHIBIT', 'def', 'def'],
    ['d52g', 1935, 674, '52G CLOSE', 'def', 'def'],
    ['dAnn52', 1935, 739, 'ANN ENABLE 52G', 'def', 'def'],
    ['d41', 1935, 951, '41 CLOSE', 'def', 'def'],
    ['dLoad', 1935, 1015, 'GEN.LOAD>INIT.LOAD', 'def', 'def'],
    ['dAll', 1935, 1079, 'ALL VALVE CLOSED', 'def', 'def'],
    ['dTrig', 1935, 1194, 'Trigger_of_LOGIC_2', 'sys.def', 'def'],
    ['d52l', 1385, 1430, '52L CLOSE', 'def', 'def']
  ],
  c: [
    ['iTrp', 'in', 'D1', 363, 281, 'TURBINE TRIP OIL PRESS. LOW', ['TCE111'], 1],
    ['iRst', 'in', 'C', 362, 428, 'TURBINE RESET', ['TCE053'], 1],
    ['iAnn', 'in', 'L', 360, 578, 'ANN ENABLE', ['TCE053'], 1],
    ['i52g', 'in', 'D', 360, 674, '52G CLOSE', ['TCE053'], 1],
    ['iSync', 'in', 'M', 359, 877, 'SYNC INITIAL LOAD STEP EXECUTED', ['TCA529']],
    ['i41', 'in', 'B8', 357, 951, '41 CLOSED', ['TCE041'], 1],
    ['iLoad', 'in', 'D', 356, 1015, 'GEN.LOAD□>INIT.LOAD', ['TCE190'], 1],
    ['iAll', 'in', 'E', 355, 1079, 'ALL VALVE CLOSED', ['TCE162'], 1],
    ['i52l', 'in', 'B10', 352, 1430, '52L OPEN', ['TCE041'], 1],
    ['oB', 'out', 'B', 2067, 343, '', ['TCA501', 'TCA533', 'TCA580'], 0, 3],
    ['oC', 'out', 'C', 2060, 855, '', ['TCA500'], 0, 1],
    ['oD', 'out', 'D', 1503, 1323, '', ['TCA831'], 0, 1],
    ['oA', 'out', 'A', 2055, 1303, '', ['TCA751'], 0, 1]
  ],
  b: [
    ['sgA001', 'SG', 'A001', 375, 181, ['K:3600.0rpm']],
    ['btr002', 'o:BTR', '002', 854, 281],
    ['btr003', 'o:BTR', '003', 853, 343],
    ['not004', 'NOT', '004', 745, 439],
    ['btr005', 'o:BTR', '005', 853, 428],
    ['btr006', 'o:BTR', '006', 1692, 505],
    ['btr007', 'o:BTR', '007', 852, 578],
    ['a018', 'A', '018', 1457, 588],
    ['not008', 'NOT', '008', 1691, 589],
    ['btr010', 'o:BTR', '010', 850, 674],
    ['a017', 'A', '017', 1689, 749],
    ['a025', 'A', '025', 1454, 877, [], {}, [60, 65]],
    ['twA022', 'TW', 'A022', 1688, 866, ['TW:3.0s']],
    ['btr011', 'o:BTR', '011', 848, 951],
    ['btr012', 'o:BTR', '012', 847, 1015],
    ['btr013', 'o:BTR', '013', 847, 1079],
    ['a014', 'A', '014', 705, 1205],
    ['x1', 'X', '', 620, 1246],
    ['tpA015', 'TP', 'A015', 887, 1205, ['TP:60.0s']],
    ['not016', 'NOT', '016', 1035, 1302],
    ['btr023', 'o:BTR', '023', 865, 1430],
    ['not024', 'NOT', '024', 1332, 1441]
  ],
  w: [
    [
      'sgA001',
      [
        [405, 170],
        [1935, 170]
      ],
      1
    ],
    [
      'iTrp',
      [
        [390, 281],
        [1935, 281]
      ]
    ],
    /* TURBINE RESET: to TCA501 / TCA533 / TCA580, and inverted = TURBINE TRIP */
    [
      'iRst',
      [
        [389, 428],
        [715, 428]
      ]
    ],
    [
      'iRst',
      [
        [681, 428],
        [681, 343],
        [2040, 343]
      ]
    ],
    [
      'not004',
      [
        [775, 428],
        [1935, 428]
      ]
    ],
    /* ANN ENABLE with INITIAL: ANN ENABLE, ANN INHIBIT, and with 52G CLOSE: ANN ENABLE 52G */
    [
      'iAnn',
      [
        [387, 578],
        [1427, 578]
      ]
    ],
    [
      'a018',
      [
        [1487, 578],
        [1661, 578]
      ]
    ],
    [
      'a018',
      [
        [1639, 578],
        [1639, 505],
        [1935, 505]
      ]
    ],
    [
      'a018',
      [
        [1639, 578],
        [1639, 739],
        [1659, 739]
      ]
    ],
    [
      'not008',
      [
        [1721, 578],
        [1935, 578]
      ]
    ],
    [
      'i52g',
      [
        [387, 674],
        [1935, 674]
      ]
    ],
    [
      'i52g',
      [
        [1254, 674],
        [1254, 855],
        [1424, 855]
      ]
    ],
    [
      'i52g',
      [
        [1254, 759],
        [1659, 759]
      ]
    ],
    [
      'a017',
      [
        [1719, 739],
        [1935, 739]
      ]
    ],
    /* START UP MODE SELECT CONDITION */
    [
      'iSync',
      [
        [386, 877],
        [1424, 877]
      ]
    ],
    [
      'i52l',
      [
        [1196, 1430],
        [1196, 898],
        [1424, 898]
      ]
    ],
    [
      'i52l',
      [
        [1196, 1323],
        [1476, 1323]
      ]
    ],
    [
      'a025',
      [
        [1484, 855],
        [1658, 855]
      ]
    ],
    [
      'twA022',
      [
        [1718, 855],
        [2033, 855]
      ]
    ],
    [
      'i41',
      [
        [384, 951],
        [1935, 951]
      ]
    ],
    [
      'iLoad',
      [
        [383, 1015],
        [1935, 1015]
      ]
    ],
    [
      'iAll',
      [
        [382, 1079],
        [1935, 1079]
      ]
    ],
    /* INITIAL: into ANN ENABLE, the clear of the TW, the 60 s trigger */
    [
      'kInit',
      [
        [563, 1141],
        [1370, 1141],
        [1370, 598],
        [1427, 598]
      ]
    ],
    [
      'kInit',
      [
        [1370, 823],
        [1688, 823],
        [1688, 845]
      ]
    ],
    [
      'kInit',
      [
        [888, 1141],
        [888, 1184]
      ]
    ],
    [
      'kInit',
      [
        [620, 1141],
        [620, 1194],
        [675, 1194]
      ]
    ],
    [
      'a014',
      [
        [735, 1194],
        [857, 1194]
      ]
    ],
    [
      'tpA015',
      [
        [917, 1194],
        [1935, 1194]
      ]
    ],
    [
      'tpA015',
      [
        [950, 1194],
        [950, 1291],
        [1005, 1291]
      ]
    ],
    [
      'tpA015',
      [
        [1631, 1194],
        [1631, 1303],
        [2028, 1303]
      ]
    ],
    [
      'not016',
      [
        [1065, 1291],
        [1141, 1291],
        [1141, 1365],
        [620, 1365],
        [620, 1215],
        [675, 1215]
      ]
    ],
    /* 52L OPEN: inverted = 52L CLOSE */
    [
      'i52l',
      [
        [379, 1430],
        [1302, 1430]
      ]
    ],
    [
      'not024',
      [
        [1362, 1430],
        [1385, 1430]
      ]
    ]
  ],
  j: [
    [681, 428],
    [1639, 578],
    [1254, 674],
    [1254, 759],
    [1196, 1430],
    [1196, 1323],
    [620, 1141],
    [888, 1141],
    [1370, 823],
    [950, 1194],
    [1631, 1194]
  ],
  t: [
    [463, 1179, '(TCA100)'],
    [1805, 335, 'TURBINE RESET'],
    [1797, 828, 'START UP MODE'],
    [1797, 849, 'SELECT CONDITION'],
    [1648, 849, 'T', 2],
    [846, 1188, 'T', 2],
    [1791, 1295, 'THSC TRIG'],
    [1918, 1240, '(60s)Trigger :1TCA300--1TCA316', 0, 1.7],
    [230, 1528, 'CONTROLLER:'],
    [400, 1528, 'COMM+MD'],
    [620, 1502, 'TRIGGER  :'],
    [620, 1528, 'CYCLE(ms):100']
  ]
});
