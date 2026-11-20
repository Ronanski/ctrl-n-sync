/* TCA100 CONTROLLER CONDITION(1) (331DM09788 page 34, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. The same logic as TCE050 for the COMM+MD controller: INITIAL (the 10 s start pulse of ON(1), TP A001) and CRT OPE PERM,
   CPUCHANGE (this CPU becoming the master, or an isolation / slot hardware / PI/O error, held 2 s, and the other CPU not in error and not
   changing), ANN RESET from TCE050 (delayed 1 s), CRT NORMAL (GR1A-ST02 received), HMI2 NORECEIVE (ST02 not received for 5 s, held in the
   flip-flop FFS 019 until ANN RESET; to TCA822 and the operator station lamp TCA100_1), and the EWS route A / B selection (GR1A-ST20).
   INITIAL clears every timer (C from the top).
   live: none; the engine holds no state of the controller hardware, so the sheet is shown without states. */
(typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
  id: 'TCA100',
  title: 'CONTROLLER CONDITION(1)',
  page: 34,
  ctl: 'COMM+MD',
  cycle: 100,
  f: [170, 82, 2218, 1546],
  k: [
    ['kOn', 315, 212, 'ON(1)', 'sys.ref'],
    ['kMy', 314, 362, 'MYCTLMST', 'sys.ref'],
    ['kIso', 313, 469, 'GR1A_ISOLATION', 'sys.ref'],
    ['kS0', 311, 543, 'SLOT0HARD_ERR', 'sys.ref'],
    ['kS1', 311, 618, 'SLOT1HARD_ERR', 'sys.ref'],
    ['kPio', 310, 692, 'SLOT1PIO_ERR', 'sys.ref'],
    ['kYerr', 309, 767, 'YOURCTL1ERR', 'sys.ref'],
    ['kYch', 309, 853, 'YOURCHANGE', 'sys.ref'],
    ['kSt02', 307, 1065, 'GR1A-ST02_NoReceived', 'sys.ref'],
    ['kSt20', 305, 1332, 'GR1A-ST20_NoReceived', 'sys.ref'],
    ['dInit', 1853, 212, 'INITIAL', 'def', 'def'],
    ['dCrt', 1853, 289, 'CRT OPE PERM', 'def', 'def'],
    ['dCpu', 1850, 469, 'CPUCHANGE', 'sys.def', 'def'],
    ['dAnn', 1187, 980, 'ANN RESET', 'def', 'def'],
    ['dCrtN', 1187, 1065, 'CRT NORMAL', 'def', 'def'],
    ['dEwsA', 1097, 1332, 'EWSROUTE1A_SELECT', 'sys.def', 'def'],
    ['dEwsB', 1097, 1406, 'EWSROUTE1B_SELECT', 'sys.def', 'def']
  ],
  c: [
    ['iAnn', 'in', 'A', 333, 980, 'ANN RESET', ['TCE050'], 1],
    ['oB', 'out', 'B', 2077, 1161, '', ['TCA822']],
    ['oA1', 'out', 'A1', 1968, 1290, '', ['-'], 1]
  ],
  d: [['crt1', 1970, 1226, 'out', 'TCA100_1', 'S', '#1C']],
  b: [
    ['tpA001', 'TP', 'A001', 681, 223, ['TP:10.0S']],
    ['btr002', 'o:BTR', '002', 1480, 289],
    ['not003', 'NOT', '003', 841, 373],
    ['tdA004', 'TD', 'A004', 1117, 373, ['TD:1.0S']],
    ['a005', 'A', '005', 840, 479],
    ['tpA006', 'TP', 'A006', 946, 480, ['TP:0.2S']],
    ['or007', 'OR', '007', 1117, 501, [], {}, [60, 86]],
    ['tpA008', 'TP', 'A008', 1319, 480, ['TP:2.0S']],
    ['dsw009', 'DSW', '009', 1479, 480],
    ['a010', 'A', '010', 1691, 480],
    ['not011', 'NOT', '011', 837, 778],
    ['a012', 'A', '012', 1475, 778],
    ['tdA013', 'TD', 'A013', 1049, 864, ['TD:2.0S']],
    ['dsw014', 'DSW', '014', 1188, 864],
    ['not015', 'NOT', '015', 1315, 864],
    ['tdA016', 'TD', 'A016', 835, 991, ['TD:1.0S']],
    ['not017', 'NOT', '017', 834, 1076],
    ['tpA018', 'TP', 'A018', 833, 1172, ['TP:5.0S']],
    ['ffs019', 'FFS', '019', 1035, 1172, [], { l: ['S', 'R'] }, [80, 43]],
    ['btr020', 'o:BTR', '020', 1471, 1161],
    ['btr021', 'o:BTR', '021', 1471, 1226],
    ['btr022', 'o:BTR', '022', 1470, 1290],
    ['not023', 'NOT', '023', 714, 1343],
    ['btr024', 'o:BTR', '024', 906, 1332],
    ['btr025', 'o:BTR', '025', 906, 1406]
  ],
  w: [
    /* the start pulse: INITIAL, CRT OPE PERM, and the clear of every timer */
    [
      'kOn',
      [
        [549, 212],
        [651, 212]
      ]
    ],
    [
      'kOn',
      [
        [607, 212],
        [607, 169],
        [681, 169],
        [681, 202]
      ]
    ],
    [
      'tpA001',
      [
        [711, 212],
        [1853, 212]
      ]
    ],
    [
      'tpA001',
      [
        [763, 212],
        [763, 1129],
        [833, 1129],
        [833, 1151]
      ]
    ],
    [
      'tpA001',
      [
        [763, 489],
        [810, 489]
      ]
    ],
    [
      'tpA001',
      [
        [763, 820],
        [1049, 820],
        [1049, 843]
      ]
    ],
    [
      'tpA001',
      [
        [763, 937],
        [835, 937],
        [835, 970]
      ]
    ],
    [
      'tpA001',
      [
        [946, 212],
        [946, 459]
      ]
    ],
    [
      'tpA001',
      [
        [1117, 212],
        [1117, 352]
      ]
    ],
    [
      'tpA001',
      [
        [1319, 212],
        [1319, 459]
      ]
    ],
    [
      'tpA001',
      [
        [1319, 289],
        [1853, 289]
      ]
    ],
    /* the change of the controlling CPU */
    [
      'kMy',
      [
        [548, 362],
        [811, 362]
      ]
    ],
    [
      'kMy',
      [
        [787, 362],
        [787, 436],
        [1189, 436],
        [1189, 843]
      ]
    ],
    [
      'not003',
      [
        [871, 362],
        [1087, 362]
      ]
    ],
    [
      'tdA004',
      [
        [1147, 362],
        [1479, 362],
        [1479, 459]
      ]
    ],
    [
      'kIso',
      [
        [547, 469],
        [810, 469]
      ]
    ],
    [
      'a005',
      [
        [870, 469],
        [916, 469]
      ]
    ],
    [
      'tpA006',
      [
        [976, 469],
        [1087, 469]
      ]
    ],
    [
      'kS0',
      [
        [545, 543],
        [1020, 543],
        [1020, 490],
        [1087, 490]
      ]
    ],
    [
      'kS1',
      [
        [545, 618],
        [1041, 618],
        [1041, 512],
        [1087, 512]
      ]
    ],
    [
      'kPio',
      [
        [544, 692],
        [1062, 692],
        [1062, 533],
        [1087, 533]
      ]
    ],
    [
      'or007',
      [
        [1147, 469],
        [1289, 469]
      ]
    ],
    [
      'or007',
      [
        [1255, 469],
        [1255, 544],
        [1424, 544],
        [1424, 490],
        [1449, 490]
      ]
    ],
    [
      'tpA008',
      [
        [1349, 469],
        [1449, 469]
      ]
    ],
    [
      'dsw009',
      [
        [1509, 469],
        [1661, 469]
      ]
    ],
    [
      'a010',
      [
        [1721, 469],
        [1850, 469]
      ]
    ],
    [
      'kYerr',
      [
        [543, 767],
        [807, 767]
      ]
    ],
    [
      'not011',
      [
        [867, 767],
        [1445, 767]
      ]
    ],
    [
      'kYch',
      [
        [543, 853],
        [1019, 853]
      ]
    ],
    [
      'kYch',
      [
        [974, 853],
        [974, 927],
        [1134, 927],
        [1134, 874],
        [1158, 874]
      ]
    ],
    [
      'tdA013',
      [
        [1079, 853],
        [1158, 853]
      ]
    ],
    [
      'dsw014',
      [
        [1218, 853],
        [1285, 853]
      ]
    ],
    [
      'not015',
      [
        [1345, 853],
        [1421, 853],
        [1421, 789],
        [1445, 789]
      ]
    ],
    [
      'a012',
      [
        [1505, 767],
        [1637, 767],
        [1637, 490],
        [1661, 490]
      ]
    ],
    /* ANN RESET, CRT NORMAL, HMI2 NORECEIVE */
    [
      'iAnn',
      [
        [360, 980],
        [805, 980]
      ]
    ],
    [
      'tdA016',
      [
        [865, 980],
        [1187, 980]
      ]
    ],
    [
      'tdA016',
      [
        [973, 980],
        [973, 1183],
        [995, 1183]
      ]
    ],
    [
      'kSt02',
      [
        [541, 1065],
        [804, 1065]
      ]
    ],
    [
      'kSt02',
      [
        [737, 1065],
        [737, 1161],
        [803, 1161]
      ]
    ],
    [
      'not017',
      [
        [864, 1065],
        [1187, 1065]
      ]
    ],
    [
      'tpA018',
      [
        [863, 1161],
        [995, 1161]
      ]
    ],
    [
      'ffs019',
      [
        [1075, 1161],
        [2050, 1161]
      ]
    ],
    [
      'ffs019',
      [
        [1418, 1161],
        [1418, 1290],
        [1941, 1290]
      ]
    ],
    [
      'ffs019',
      [
        [1418, 1226],
        [1935, 1226]
      ]
    ],
    /* the EWS route */
    [
      'kSt20',
      [
        [539, 1332],
        [684, 1332]
      ]
    ],
    [
      'kSt20',
      [
        [639, 1332],
        [639, 1406],
        [1097, 1406]
      ]
    ],
    [
      'not023',
      [
        [744, 1332],
        [1097, 1332]
      ]
    ]
  ],
  j: [
    [607, 212],
    [763, 212],
    [946, 212],
    [1117, 212],
    [1319, 212],
    [1319, 289],
    [763, 489],
    [763, 820],
    [763, 937],
    [787, 362],
    [1255, 469],
    [974, 853],
    [973, 980],
    [737, 1065],
    [1418, 1161],
    [1418, 1226],
    [639, 1332]
  ],
  t: [
    [634, 210, 'C'],
    [1070, 360, 'C'],
    [899, 467, 'C'],
    [1272, 467, 'C'],
    [1002, 851, 'C'],
    [788, 978, 'C'],
    [786, 1159, 'C'],
    [977, 1149, 'C'],
    [573, 383, '(MYCTL:1)'],
    [572, 565, '(NCP-E)'],
    [571, 640, '(DIF)'],
    [1635, 1153, 'HMI2 NORECEIVE'],
    [1635, 1218, 'HMI2 NORECEIVE(ATS)'],
    [1635, 1282, 'HMI2 NORECEIVE(ATS)'],
    [230, 1528, 'CONTROLLER:'],
    [400, 1528, 'COMM+MD'],
    [617, 1502, 'TRIGGER  :'],
    [617, 1528, 'CYCLE(ms):100']
  ]
});
