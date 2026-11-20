/* TCA587 SHUT DOWN (331DM09788 page 146, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. ATS step 8 with the turbine shutdown load opens the generator CB (A1 to TCE250); with the GCB opened it opens the field switch
   (B to TCA831); with the field switch opened it gives the turbine shut-down command (C to TCE114), each in ATS AUTO and held 3 s (TW, cleared
   by INITIAL). The operator station 41 open / close commands (CRT TCA587_1_JYP / _IKA, with CRT AVAILABLE and 41 CLOSE) go to TCA831 / TCA833,
   the excitation auto / manual commands (CRT TCA587_2_IKA / _JYP) to TCA832, each held 1 s; the 41 closed / opened, the CRT operation permit and
   the AVR auto / manual states go back to the operator station lamps. */
(typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
  id: 'TCA587',
  title: 'SHUT DOWN',
  page: 146,
  ctl: 'COMM+MD',
  cycle: 100,
  f: [170, 82, 2218, 1546],
  /* live: the engine state of the signals named on this sheet (tcs.js tcsLiveRead): GCB OPENED */
  live: { iK: '!g52' },
  k: [
    ['kInit', 259, 178, 'INITIAL', 'ref'],
    ['kAts', 259, 272, 'ATS AUTO', 'ref'],
    ['k41', 219, 932, '41 CLOSE', 'ref'],
    ['kPerm', 219, 1017, 'CRT OPE PERM', 'ref']
  ],
  c: [
    ['iC', 'in', 'C', 370, 337, 'STEP8 EXECUTING', ['TCA528']],
    ['iF', 'in', 'F', 370, 400, '', ['TCA535']],
    ['iK', 'in', 'K', 370, 464, 'CRI1.49 GCB OPENED', ['TCA533']],
    ['iA', 'in', 'A', 370, 601, 'CRI1.50 FIELD SW OPENED', ['TCA535']],
    ['iA12', 'in', 'A12', 488, 1285, 'AVR AUTO', ['TCA045']],
    ['iA13', 'in', 'A13', 477, 1371, 'AVR MANUAL', ['TCA045']],
    ['oA1', 'out', 'A1', 1892, 337, '', ['TCE250'], 1],
    ['oB', 'out', 'B', 1880, 464, '', ['TCA831']],
    ['oC', 'out', 'C', 1880, 581, '', ['TCE114'], 1],
    ['oD1', 'out', 'D1', 1867, 689, '', ['TCA831']],
    ['oD2', 'out', 'D2', 1867, 785, '', ['TCA833']],
    ['oD3', 'out', 'D3', 1927, 1092, '', ['TCA832']],
    ['oD4', 'out', 'D4', 1927, 1188, '', ['TCA832']]
  ],
  d: [
    ['crtInit', 1905, 178, 'out', 'TCA587_2_IYP', 'S', '#1C'],
    ['crt1Jyp', 277, 689, 'in', 'TCA587_1_JYP', 'R', '#1C'],
    ['crt1Ika', 277, 785, 'in', 'TCA587_1_IKA', 'R', '#1C'],
    ['crt1Iys', 310, 848, 'in', 'TCA587_1_IYS', 'R', '#1C'],
    ['crt1Iia', 1833, 858, 'out', 'TCA587_1_IIA', 'S', '#1C'],
    ['crt1Yip', 1875, 932, 'out', 'TCA587_1_YIP', 'S', '#1C'],
    ['crt1Iyp', 1140, 1017, 'out', 'TCA587_1_IYP', 'S', '#1C'],
    ['crt2Ika', 372, 1092, 'in', 'TCA587_2_IKA', 'R', '#1C'],
    ['crt2Jyp', 372, 1188, 'in', 'TCA587_2_JYP', 'R', '#1C'],
    ['crt2Iys', 372, 1252, 'in', 'TCA587_2_IYS', 'R', '#1C'],
    ['crt2Iia', 1617, 1285, 'out', 'TCA587_2_IIA', 'S', '#1C'],
    ['crt2Yip', 1605, 1371, 'out', 'TCA587_2_YIP', 'S', '#1C']
  ],
  b: [
    ['a049', 'A', '049', 913, 357, [], {}, [60, 65]],
    ['not004', 'NOT', '004', 755, 411],
    ['a005', 'A', '005', 913, 486, [], {}, [60, 65]],
    ['not008', 'NOT', '008', 755, 518],
    ['a009', 'A', '009', 912, 592],
    ['a002', 'A', '002', 1148, 348],
    ['a006', 'A', '006', 1148, 475],
    ['a010', 'A', '010', 1148, 592],
    ['twA003', 'TW', 'A003', 1362, 348, ['TW:3.0s']],
    ['twA007', 'TW', 'A007', 1362, 476, ['TW:3.0s']],
    ['twA011', 'TW', 'A011', 1362, 594, ['TW:3.0s']],
    ['a016', 'A', '016', 719, 698],
    ['a017', 'A', '017', 878, 698],
    ['a019', 'A', '019', 718, 794],
    ['a020', 'A', '020', 878, 794],
    ['not023', 'NOT', '023', 758, 943],
    ['tw018', 'TW', '018', 1348, 700, ['TW:1.0']],
    ['tw021', 'TW', '021', 1348, 796, ['TW:1.0']],
    ['a043', 'A', '043', 778, 1102],
    ['a046', 'A', '046', 778, 1198],
    ['tw045', 'TW', '045', 1406, 1103, ['TW:1.0']],
    ['tw048', 'TW', '048', 1406, 1199, ['TW:1.0']],
    ['btr015', 'o:BTR', '015', 1611, 858],
    ['btr022', 'o:BTR', '022', 1653, 932],
    ['btr024', 'o:BTR', '024', 767, 1017],
    ['btr042', 'o:BTR', '042', 1223, 1285],
    ['btr040', 'o:BTR', '040', 1233, 1371]
  ],
  w: [
    /* INITIAL: the lamp, and the clear (C) / the start (T) from the top of every TW */
    [
      'kInit',
      [
        [492, 178],
        [1870, 178]
      ]
    ],
    [
      'kInit',
      [
        [1362, 178],
        [1362, 327]
      ]
    ],
    [
      'kInit',
      [
        [1267, 178],
        [1267, 753]
      ]
    ],
    [
      'kInit',
      [
        [1267, 433],
        [1362, 433],
        [1362, 455]
      ]
    ],
    [
      'kInit',
      [
        [1267, 540],
        [1362, 540],
        [1362, 573]
      ]
    ],
    [
      'kInit',
      [
        [1267, 625],
        [1348, 625],
        [1348, 679]
      ]
    ],
    [
      'kInit',
      [
        [1250, 753],
        [1348, 753],
        [1348, 775]
      ]
    ],
    [
      'kInit',
      [
        [1250, 753],
        [1250, 1157],
        [1406, 1157],
        [1406, 1178]
      ]
    ],
    [
      'kInit',
      [
        [1250, 965],
        [1406, 965],
        [1406, 1082]
      ]
    ],
    /* step 8 with the shutdown load: open the generator CB */
    [
      'iC',
      [
        [397, 337],
        [883, 337]
      ]
    ],
    [
      'iF',
      [
        [397, 400],
        [640, 400],
        [640, 358],
        [883, 358]
      ]
    ],
    [
      'iK',
      [
        [669, 464],
        [669, 400],
        [725, 400]
      ]
    ],
    [
      'not004',
      [
        [785, 400],
        [873, 400],
        [873, 380],
        [883, 380]
      ]
    ],
    [
      'a049',
      [
        [943, 337],
        [1118, 337]
      ]
    ],
    /* with the GCB opened (and not the field switch): open the field switch */
    [
      'iK',
      [
        [397, 464],
        [883, 464]
      ]
    ],
    [
      'iC',
      [
        [838, 337],
        [838, 581],
        [882, 581]
      ]
    ],
    [
      'iC',
      [
        [838, 486],
        [883, 486]
      ]
    ],
    [
      'iA',
      [
        [669, 601],
        [669, 507],
        [725, 507]
      ]
    ],
    [
      'not008',
      [
        [785, 507],
        [883, 507]
      ]
    ],
    [
      'a005',
      [
        [943, 464],
        [1118, 464]
      ]
    ],
    /* with the field switch opened: the turbine shut-down command */
    [
      'iA',
      [
        [397, 601],
        [882, 601]
      ]
    ],
    [
      'a009',
      [
        [942, 581],
        [1118, 581]
      ]
    ],
    /* in ATS AUTO */
    [
      'kAts',
      [
        [492, 272],
        [1053, 272],
        [1053, 603],
        [1118, 603]
      ]
    ],
    [
      'kAts',
      [
        [1053, 358],
        [1118, 358]
      ]
    ],
    [
      'kAts',
      [
        [1053, 486],
        [1118, 486]
      ]
    ],
    [
      'a002',
      [
        [1178, 337],
        [1332, 337]
      ]
    ],
    [
      'a006',
      [
        [1178, 464],
        [1332, 464]
      ]
    ],
    [
      'a010',
      [
        [1178, 581],
        [1332, 581]
      ]
    ],
    [
      'twA003',
      [
        [1392, 337],
        [1865, 337]
      ]
    ],
    [
      'twA007',
      [
        [1392, 464],
        [1853, 464]
      ]
    ],
    [
      'twA011',
      [
        [1392, 581],
        [1853, 581]
      ]
    ],
    /* 41 open / close from the operator station, with CRT AVAILABLE and the 41 state */
    [
      'crt1Jyp',
      [
        [312, 689],
        [689, 689]
      ]
    ],
    [
      'crt1Ika',
      [
        [312, 785],
        [688, 785]
      ]
    ],
    [
      'crt1Iys',
      [
        [345, 848],
        [653, 848],
        [653, 709],
        [689, 709]
      ]
    ],
    [
      'crt1Iys',
      [
        [653, 805],
        [688, 805]
      ]
    ],
    [
      'a016',
      [
        [749, 689],
        [848, 689]
      ]
    ],
    [
      'a019',
      [
        [748, 785],
        [848, 785]
      ]
    ],
    [
      'k41',
      [
        [452, 932],
        [728, 932]
      ]
    ],
    [
      'k41',
      [
        [695, 932],
        [695, 858],
        [1798, 858]
      ]
    ],
    [
      'k41',
      [
        [781, 858],
        [781, 709],
        [848, 709]
      ]
    ],
    [
      'not023',
      [
        [788, 932],
        [1840, 932]
      ]
    ],
    [
      'not023',
      [
        [812, 932],
        [812, 805],
        [848, 805]
      ]
    ],
    [
      'a017',
      [
        [908, 689],
        [1318, 689]
      ]
    ],
    [
      'a020',
      [
        [908, 785],
        [1318, 785]
      ]
    ],
    [
      'tw018',
      [
        [1378, 689],
        [1840, 689]
      ]
    ],
    [
      'tw021',
      [
        [1378, 785],
        [1840, 785]
      ]
    ],
    [
      'kPerm',
      [
        [452, 1017],
        [1105, 1017]
      ]
    ],
    /* excitation auto / manual from the operator station, with CRT AVAILABLE */
    [
      'crt2Ika',
      [
        [407, 1092],
        [749, 1092]
      ]
    ],
    [
      'crt2Jyp',
      [
        [407, 1188],
        [749, 1188]
      ]
    ],
    [
      'crt2Iys',
      [
        [407, 1252],
        [713, 1252],
        [713, 1113],
        [749, 1113]
      ]
    ],
    [
      'crt2Iys',
      [
        [713, 1209],
        [749, 1209]
      ]
    ],
    [
      'a043',
      [
        [807, 1092],
        [1377, 1092]
      ]
    ],
    [
      'a046',
      [
        [807, 1188],
        [1377, 1188]
      ]
    ],
    [
      'tw045',
      [
        [1435, 1092],
        [1900, 1092]
      ]
    ],
    [
      'tw048',
      [
        [1435, 1188],
        [1900, 1188]
      ]
    ],
    [
      'iA12',
      [
        [515, 1285],
        [1582, 1285]
      ]
    ],
    [
      'iA13',
      [
        [504, 1371],
        [1570, 1371]
      ]
    ]
  ],
  j: [
    [1362, 178],
    [1267, 178],
    [1267, 433],
    [1267, 540],
    [1267, 625],
    [1267, 753],
    [1250, 965],
    [669, 464],
    [838, 337],
    [838, 486],
    [669, 601],
    [1053, 358],
    [1053, 486],
    [653, 805],
    [695, 932],
    [781, 858],
    [812, 932],
    [713, 1209]
  ],
  t: [
    [427, 213, '(TCA100)'],
    [427, 308, '(TCA501)'],
    [397, 958, '(TCA103)'],
    [397, 1043, '(TCA100)'],
    [402, 367, 'CRI 2.11 TURBINE'],
    [402, 389, 'SHUTDOWN LOAD'],
    [323, 678, '41 OPEN COMMAND'],
    [323, 774, '41 CLOSE COMMAND'],
    [355, 837, 'CRT AVAILABLE'],
    [416, 1081, 'EXCITATION AUTO'],
    [416, 1177, 'EXCITATION MANUAL'],
    [414, 1241, 'CRT AVAILABLE'],
    [1320, 327, 'C', 2],
    [1320, 455, 'C', 2],
    [1320, 573, 'C', 2],
    [1308, 679, 'T', 2],
    [1308, 775, 'T', 2],
    [1366, 1082, 'T', 2],
    [1366, 1178, 'T', 2],
    [1705, 322, 'GEN.CB OPEN'],
    [1553, 453, 'FIELD SWITCH OPEN'],
    [1553, 570, 'TURBINE SHUT-DOWN COMMAND'],
    [1456, 678, '41 OPEN COMMAND'],
    [1456, 774, '41 CLOSE COMMAND'],
    [1673, 815, '41 CLOSED'],
    [1700, 921, '41 OPEND'],
    [860, 1006, 'CRT OPE PERM'],
    [1515, 1081, 'EXCITATION AUTO'],
    [1515, 1177, 'EXCITATION MANUAL'],
    [1283, 1274, 'EXCITATION AUTO'],
    [1293, 1360, 'EXCITATION MANUAL'],
    [230, 1528, 'CONTROLLER:'],
    [400, 1528, 'COMM+MD'],
    [620, 1500, 'TRIGGER  :'],
    [620, 1526, 'CYCLE(ms):100']
  ]
});
