/* TCA528 STEP CONTROL(STEP 8) (331DM09788 page 97, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the
   page rendered 2296 wide; made by scratchpad/tce/mk52x.cjs, the same layout for TCA520 .. TCA528. The STEP CONTROL MD block A002 (LMA540 /
   LMA541, lamp TCA528_1) of step 8 (TURBINE SHUT-DOWN): its in / out conditions, bypass, permissive, the steps around it, the push button and step
   selects and the step up order on the left, each through a BTR; the system OFF(0) on APS A / APS S; STEP 8 SELECT of TCT090 on FORCE. Out:
   select, step in order, executing, completed, start, PB select and step select to the step sheets, ORDER1 / SEL / EXEC1 / FINI1 to TCT081,
   STEP IN 8 ORDER and STEP 8 EXECUTING as definitions. */
(typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
  id: 'TCA528',
  title: 'STEP CONTROL(STEP 8)',
  page: 97,
  ctl: 'COMM+MD',
  cycle: 100,
  f: [180, 88, 2232, 1550],
  k: [
    ['kAts', 215, 216.7, 'ATS OFF', 'ref'],
    ['kOff', 215, 918.5, 'OFF(0)', 'sys.ref'],
    ['dOrd', 1912, 963, 'STEP IN 8 ORDER', 'def', 'def'],
    ['dExe', 1912, 1070, 'STEP 8 EXECUTING', 'def', 'def']
  ],
  c: [
    ['i2', 'in', 'A', 256, 280.5, '', ['TCA517'], 0, 1],
    ['i4', 'in', 'B', 256, 344.3, '', ['TCA535'], 0, 1],
    ['iF', 'in', '13', 252, 1015.3, '', ['TCT090'], 1, 1],
    ['oA', 'out', 'A', 2068, 216.7, '', ['-'], 0, 0],
    ['oB', 'out', 'B', 2068, 312.4, '', ['TCA516', 'TCA529'], 0, 0],
    ['oC', 'out', 'C', 2068, 408.1, '', ['TCA510', 'TCA516', 'TCA526', 'TCA527', 'TCA529', 'TCA587'], 0, 0],
    ['oD', 'out', 'D', 2068, 503.8, '', ['-'], 0, 0],
    ['oE', 'out', 'E', 2068, 599.5, '', ['-'], 0, 0],
    ['oF', 'out', 'F', 2068, 695.2, '', ['TCA527'], 0, 0],
    ['oG', 'out', 'G', 2068, 790.9, '', ['TCA527'], 0, 0],
    ['oA1', 'out', 'A1', 2060, 1122, '', ['TCT081E'], 1, 1],
    ['oB1', 'out', 'B1', 2060, 1175, '', ['TCT081C'], 1, 1],
    ['oC1', 'out', 'C1', 2060, 1228, '', ['TCT081C'], 1, 1],
    ['oD1', 'out', 'D1', 2060, 1281, '', ['TCT081D'], 1, 1]
  ],
  d: [],
  b: [
    ['not001', 'NOT', '001', 948, 220.7],
    ['btr004', 'o:BTR', '004', 950, 280.5],
    ['btr006', 'o:BTR', '006', 950, 344.3],
    ['not008', 'NOT', '008', 838, 475.9],
    ['btr013', 'o:BTR', '013', 893, 918.5],
    ['btr024', 'o:BTR', '024', 943, 982.3],
    ['btr003', 'o:BTR', '003', 1643, 216.7],
    ['btr005', 'o:BTR', '005', 1643, 312.4],
    ['btr007', 'o:BTR', '007', 1643, 408.1],
    ['btr009', 'o:BTR', '009', 1643, 503.8],
    ['btr010', 'o:BTR', '010', 1643, 599.5],
    ['btr011', 'o:BTR', '011', 1643, 695.2],
    ['btr012', 'o:BTR', '012', 1643, 790.9],
    ['btr021', 'o:BTR', '021', 1641, 344.3],
    ['btr022', 'o:BTR', '022', 1641, 440],
    ['btr023', 'o:BTR', '023', 1641, 535.7]
  ],
  m: [
    [
      'md',
      'STEP CONTROL MD',
      'TCA528_1',
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
      'kAts',
      [
        [448, 216.7],
        [919, 216.7]
      ]
    ],
    [
      'not001',
      [
        [977, 216.7],
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
      'i4',
      [
        [283, 344.3],
        [1110, 344.3]
      ]
    ],
    [
      'i4',
      [
        [785, 344.3],
        [785, 471.9],
        [809, 471.9]
      ]
    ],
    [
      'not008',
      [
        [867, 471.9],
        [1110, 471.9]
      ]
    ],
    [
      'kOff',
      [
        [448, 918.5],
        [995, 918.5],
        [995, 408.1],
        [1110, 408.1]
      ]
    ],
    [
      'kOff',
      [
        [995, 535.7],
        [1110, 535.7]
      ]
    ],
    [
      'kOff',
      [
        [995, 599.5],
        [1110, 599.5]
      ]
    ],
    [
      'kOff',
      [
        [995, 663.3],
        [1110, 663.3]
      ]
    ],
    [
      'kOff',
      [
        [995, 727.1],
        [1110, 727.1]
      ]
    ],
    [
      'kOff',
      [
        [995, 790.9],
        [1110, 790.9]
      ]
    ],
    [
      'kOff',
      [
        [995, 854.7],
        [1110, 854.7]
      ]
    ],
    [
      'kOff',
      [
        [995, 918.5],
        [1110, 918.5]
      ]
    ],
    [
      'iF',
      [
        [279, 1015.3],
        [839, 1015.3],
        [839, 982.3],
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
    [785, 344.3],
    [995, 535.7],
    [995, 599.5],
    [995, 663.3],
    [995, 727.1],
    [995, 790.9],
    [995, 854.7],
    [995, 918.5],
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
    [355, 250.7, '(TCA501)'],
    [289, 272.5, 'STEP IN CRITERIA OK'],
    [289, 336.3, 'CRI 1.51 TURBINE TRIPPED'],
    [285, 1007.3, 'STEP 8 SELECT'],
    [1830, 208.7, 'STEP 8 SELECT'],
    [1830, 304.4, 'STEP IN 8 ORDER'],
    [1830, 400.1, 'STEP 8 EXECUTING'],
    [1830, 495.8, 'STEP 8 COMPLETED'],
    [1830, 591.5, 'STEP 8 START'],
    [1830, 687.2, 'STEP 8 PB SELECT'],
    [1830, 782.9, 'STEP 8 STEP SELECT'],
    [1822, 1167, 'STEP 8 SELECTED'],
    [1822, 1220, 'STEP 8 EXECUTED'],
    [1822, 1273, 'STEP 8 COMPLETED'],
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
