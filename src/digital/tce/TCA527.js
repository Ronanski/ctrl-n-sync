/* TCA527 STEP CONTROL(STEP 7) (331DM09788 page 96, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the
   page rendered 2296 wide; made by scratchpad/tce/mk52x.cjs, the same layout for TCA520 .. TCA528. The STEP CONTROL MD block A002 (LMA540 /
   LMA541, lamp TCA527_1) of step 7 (NORMAL OPERATION): its in / out conditions, bypass, permissive, the steps around it, the push button and step
   selects and the step up order on the left, each through a BTR; the system OFF(0) on APS A / APS S; STEP 7 SELECT of TCT090 on FORCE. Out:
   select, step in order, executing, completed, start, PB select and step select to the step sheets, ORDER1 / SEL / EXEC1 / FINI1 to TCT081,
   STEP IN 7 ORDER and STEP 7 EXECUTING as definitions. */
(typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
  id: 'TCA527', live: { i0: 'done6', 'md.EXEC': 'atsCur=7', 'md.EXEC1': 'atsCur=7', 'md.FINISH': 'done7', 'md.FINI1': 'done7' },
  title: 'STEP CONTROL(STEP 7)',
  page: 96,
  ctl: 'COMM+MD',
  cycle: 100,
  f: [180, 88, 2232, 1550],
  k: [
    ['kOn', 215, 471.9, 'ON(1)', 'sys.ref'],
    ['kOff', 215, 982.3, 'OFF(0)', 'sys.ref'],
    ['dOrd', 1912, 963, 'STEP IN 7 ORDER', 'def', 'def'],
    ['dExe', 1912, 1070, 'STEP 7 EXECUTING', 'def', 'def']
  ],
  c: [
    ['i0', 'in', 'D', 256, 216.7, '', ['TCA526'], 0, 1],
    ['i2', 'in', 'A6', 256, 280.5, '', ['TCA511'], 0, 1],
    ['i10', 'in', 'C', 256, 535.7, '', ['TCA528'], 0, 1],
    ['i14', 'in', 'A7', 256, 663.3, '', ['TCA514'], 0, 1],
    ['i8F', 'in', 'F', 256, 854.7, '', ['TCA528'], 0, 1],
    ['i16', 'in', 'B7', 256, 727.1, '', ['TCA514'], 0, 1],
    ['i8G', 'in', 'G', 256, 905.5, '', ['TCA528'], 0, 1],
    ['i18', 'in', 'A7', 256, 790.9, '', ['TCA515'], 0, 1],
    ['iF', 'in', '12', 252, 1067.3, '', ['TCT090'], 1, 1],
    ['oA', 'out', 'A', 2068, 216.7, '', ['TCA515'], 0, 0],
    ['oB', 'out', 'B', 2068, 312.4, '', ['TCA516', 'TCA529'], 0, 0],
    ['oC', 'out', 'C', 2068, 408.1, '', ['TCA516', 'TCA529', 'TCA767'], 0, 0],
    ['oD', 'out', 'D', 2068, 503.8, '', ['-'], 0, 0],
    ['oE', 'out', 'E', 2068, 599.5, '', ['-'], 0, 0],
    ['oF', 'out', 'F', 2068, 695.2, '', ['TCA514'], 0, 0],
    ['oG', 'out', 'G', 2068, 790.9, '', ['TCA514'], 0, 0],
    ['oA1', 'out', 'A1', 2060, 1122, '', ['TCT081E'], 1, 1],
    ['oB1', 'out', 'B1', 2060, 1175, '', ['TCT081C'], 1, 1],
    ['oC1', 'out', 'C1', 2060, 1228, '', ['TCT081C'], 1, 1],
    ['oD1', 'out', 'D1', 2060, 1281, '', ['TCT081D'], 1, 1]
  ],
  d: [],
  b: [
    ['btr001', 'o:BTR', '001', 950, 216.7],
    ['btr004', 'o:BTR', '004', 950, 280.5],
    ['btr023', 'o:BTR', '023', 950, 471.9],
    ['btr024', 'o:BTR', '024', 950, 535.7],
    ['or025', 'OR', '025', 827, 673.3],
    ['btr014', 'o:BTR', '014', 950, 663.3],
    ['or026', 'OR', '026', 827, 737.1],
    ['btr016', 'o:BTR', '016', 950, 727.1],
    ['btr017', 'o:BTR', '017', 950, 790.9],
    ['btr019', 'o:BTR', '019', 880, 982.3],
    ['btr030', 'o:BTR', '030', 943, 1029.3],
    ['btr003', 'o:BTR', '003', 1643, 216.7],
    ['btr005', 'o:BTR', '005', 1643, 312.4],
    ['btr008', 'o:BTR', '008', 1643, 408.1],
    ['btr010', 'o:BTR', '010', 1643, 503.8],
    ['btr013', 'o:BTR', '013', 1643, 599.5],
    ['btr015', 'o:BTR', '015', 1643, 695.2],
    ['btr018', 'o:BTR', '018', 1643, 790.9],
    ['btr027', 'o:BTR', '027', 1641, 344.3],
    ['btr028', 'o:BTR', '028', 1641, 440],
    ['btr029', 'o:BTR', '029', 1641, 535.7]
  ],
  m: [
    [
      'md',
      'STEP CONTROL MD',
      'TCA527_1',
      1110,
      170,
      405,
      859,
      [
        'TMG',
        '',
        'IN CR',
        '',
        'OUT CR',
        '',
        'BYPS',
        '',
        'PERM',
        '',
        'EXE',
        '',
        'FINISH',
        '',
        'EX1',
        '',
        'EX2',
        '',
        'ORDER',
        '',
        'APS A',
        '',
        'APS S',
        '',
        'FORCE'
      ],
      [
        'SEL',
        '',
        '',
        'ORDER',
        'ORDER1',
        '',
        'EXEC',
        'EXEC1',
        '',
        'FINISH',
        'FINI1',
        '',
        'START',
        '',
        '',
        'PB ON',
        '',
        '',
        'STEP S',
        '',
        '',
        'RESET',
        '',
        '',
        ''
      ],
      'A002',
      [
        [1215, 1052, '(LMA540)'],
        [1330, 1052, '(LMA541)']
      ]
    ]
  ],
  w: [
    [
      'i0',
      [
        [283, 216.7],
        [1110, 216.7]
      ]
    ],
    [
      'i2',
      [
        [283, 280.5],
        [1110, 280.5]
      ]
    ],
    [
      'kOn',
      [
        [448, 471.9],
        [1110, 471.9]
      ]
    ],
    [
      'i10',
      [
        [283, 535.7],
        [1110, 535.7]
      ]
    ],
    [
      'i14',
      [
        [283, 663.3],
        [798, 663.3]
      ]
    ],
    [
      'or025',
      [
        [856, 663.3],
        [1110, 663.3]
      ]
    ],
    [
      'i8F',
      [
        [283, 854.7],
        [752, 854.7],
        [752, 683.3],
        [798, 683.3]
      ]
    ],
    [
      'i16',
      [
        [283, 727.1],
        [798, 727.1]
      ]
    ],
    [
      'or026',
      [
        [856, 727.1],
        [1110, 727.1]
      ]
    ],
    [
      'i8G',
      [
        [283, 905.5],
        [772, 905.5],
        [772, 747.1],
        [798, 747.1]
      ]
    ],
    [
      'i18',
      [
        [283, 790.9],
        [1110, 790.9]
      ]
    ],
    [
      'kOff',
      [
        [448, 982.3],
        [985, 982.3],
        [985, 344.3],
        [1110, 344.3]
      ]
    ],
    [
      'kOff',
      [
        [985, 408.1],
        [1110, 408.1]
      ]
    ],
    [
      'kOff',
      [
        [985, 599.5],
        [1110, 599.5]
      ]
    ],
    [
      'kOff',
      [
        [985, 854.7],
        [1110, 854.7]
      ]
    ],
    [
      'kOff',
      [
        [985, 918.5],
        [1110, 918.5]
      ]
    ],
    [
      'iF',
      [
        [279, 1067.3],
        [825, 1067.3],
        [825, 1029.3],
        [1005, 1029.3],
        [1005, 982.3],
        [1110, 982.3]
      ]
    ],
    [
      'md.SEL',
      [
        [1515, 216.7],
        [2041, 216.7]
      ]
    ],
    [
      'md.ORDER',
      [
        [1515, 312.4],
        [2041, 312.4]
      ]
    ],
    [
      'md.EXEC',
      [
        [1515, 408.1],
        [2041, 408.1]
      ]
    ],
    [
      'md.FINISH',
      [
        [1515, 503.8],
        [2041, 503.8]
      ]
    ],
    [
      'md.START',
      [
        [1515, 599.5],
        [2041, 599.5]
      ]
    ],
    [
      'md.PB ON',
      [
        [1515, 695.2],
        [2041, 695.2]
      ]
    ],
    [
      'md.STEP S',
      [
        [1515, 790.9],
        [2041, 790.9]
      ]
    ],
    [
      'md.ORDER1',
      [
        [1515, 344.3],
        [1758, 344.3],
        [1758, 1122],
        [2033, 1122]
      ]
    ],
    [
      'md.SEL',
      [
        [1695, 216.7],
        [1695, 1175],
        [2033, 1175]
      ]
    ],
    [
      'md.EXEC1',
      [
        [1515, 440],
        [1733, 440],
        [1733, 1228],
        [2033, 1228]
      ]
    ],
    [
      'md.FINI1',
      [
        [1515, 535.7],
        [1713, 535.7],
        [1713, 1281],
        [2033, 1281]
      ]
    ],
    [
      'md.ORDER',
      [
        [1803, 312.4],
        [1803, 963],
        [1912, 963]
      ]
    ],
    [
      'md.EXEC',
      [
        [1780, 408.1],
        [1780, 1070],
        [1912, 1070]
      ]
    ]
  ],
  j: [
    [985, 408.1],
    [985, 599.5],
    [985, 854.7],
    [985, 918.5],
    [1695, 216.7],
    [1803, 312.4],
    [1780, 408.1]
  ],
  t: [
    [1105, 1077, 'DEF TD:3.0S', 0, 2.3],
    [1105, 1098, 'DEF TP:0.2S', 0, 2.3],
    [1105, 1120, 'DEF TD:3.0S', 0, 2.3],
    [1105, 1141, 'DEF TP:1.0S', 0, 2.3],
    [1105, 1162, 'DEF TD:3.0S', 0, 2.3],
    [289, 208.7, 'STEP 6 COMPLETED'],
    [289, 272.5, 'STEP 7 IN CONDITION OK'],
    [289, 527.7, 'STEP 8 EXECUTING'],
    [289, 655.3, 'ANOTHER STEP PB SELECT(STEP 7)'],
    [289, 846.7, 'STEP 8 PB SELECT'],
    [289, 719.1, 'ANOTHER STEP SELECT(STEP 7)'],
    [289, 897.5, 'STEP 8 STEP SELECT'],
    [289, 782.9, 'STEP UP ORDER(STEP 7)'],
    [285, 1059.3, 'STEP 7 SELECT'],
    [1830, 208.7, 'STEP 7 SELECT'],
    [1830, 304.4, 'STEP IN 7 ORDER'],
    [1830, 400.1, 'STEP 7 EXECUTING'],
    [1830, 495.8, 'STEP 7 COMPLETED'],
    [1830, 591.5, 'STEP 7 START'],
    [1830, 687.2, 'STEP 7 PB SELECT'],
    [1830, 782.9, 'STEP 7 STEP SELECT'],
    [1822, 1167, 'STEP 7 SELECTED'],
    [1822, 1220, 'STEP 7 EXECUTED'],
    [1822, 1273, 'STEP 7 COMPLETED'],
    [1082, 1283, 'STEP 0 : HP TURBINE WARMING'],
    [1082, 1315, 'STEP 1 : PREPARATION'],
    [1082, 1347, 'STEP 2 : TURBINE RUB CHECK'],
    [1082, 1379, 'STEP 3 : ACCELERATION'],
    [1082, 1411, 'STEP 4 : EXCITATION'],
    [1082, 1443, 'STEP 5 : SYNC INITIAL LOAD'],
    [1082, 1475, 'STEP 6 : LOAD UP'],
    [1082, 1507, 'STEP 7 : NORMAL OPERATION'],
    [1082, 1539, 'STEP 8 : TURBINE SHUT-DOWN'],
    [238, 1532, 'CONTROLLER:'],
    [397, 1532, 'COMM+MD'],
    [620, 1506, 'TRIGGER  :'],
    [620, 1532, 'CYCLE(ms):100']
  ]
});
