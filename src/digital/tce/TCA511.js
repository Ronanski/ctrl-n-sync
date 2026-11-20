/* TCA511 STEP CONTROL CONDITION (331DM09788 page 81, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. The conditions that let the ATS go into a step (STEP n IN CONDITION OK, A1..A8) and out of it (STEP n OUT CONDITION OK,
   B1..B7), each an AND of the criteria of TCA53x / TCA54x with STEP IN CRITERIA OK (in) or STEP CRITERIA OK (out):
   in: step 0 with TURBINE TRIP, step 1 with STEP0 COMPLETED, step 2 with CV WARMING COMPLETE, step 3 with STEP 2 COMPLETED at less than the rub
   check speed (or at it), steps 4 and 5 with the rated speed, step 6 with the generator load over the initial load, step 7 with STEP 6 COMPLETED;
   out: step 0 HP turbine warming complete, step 1 turbine reset / MSV / RSV open / LLM upper / drain valves open / CV chest temperature difference,
   step 2 its complete signal, step 3 its complete signal or the half start with CV(A)&(B) closed, step 4 generator voltage / AVR / field switch /
   disconnector, step 5 the initial load hold or the half start with 52G and 52L closed, step 6 IP TO HP TRANSFER COMPLETE (always ON with the HP
   start, DSW 027). HOUSE LOAD OPERATION stands in for LLM UPPER, DRAIN VALVE OPEN and STEP 2 COMPLETE.
   live: TURBINE TRIP, 52G CLOSE, 52L CLOSE (tcs.js tcsLiveRead); the engine holds no ATS step criteria, so the other lines stay without a state. */
(function () {
  if (typeof window === 'undefined') return;
  const CX = 303 /* the connectors on the left: centre, start of their line */,
    W0 = 330,
    OX = 2090 /* the connectors on the right: centre, end of their line */,
    W1 = 2063,
    CR = 1177 /* STEP CRITERIA OK down the out conditions */,
    /* the right edge of the blocks that give a condition out */
    RX = {
      a005: 1285,
      a008: 1285,
      a010: 1284,
      a011: 1283,
      a012: 1283,
      a013: 1283,
      a015: 1282,
      a016: 1282,
      a018: 1280,
      a031: 1279,
      a021: 1278,
      a032: 1277,
      a024: 1276
    },
    c = [],
    btr = [],
    w = [],
    t = [],
    j = [];
  /* the inputs on the left: [key, letter, y, words, sheet, double line] */
  [
    ['iIn', 'A', 149, 'STEP IN CRITERIA OK', 'TCA517'],
    ['iCvw', 'Z2', 191, 'CV WARMING COMPLETE', 'TCE152', 1],
    ['iS2', 'D', 266, 'STEP 2 COMPLETED', 'TCA522'],
    ['iRub', 'A', 319, '', 'TCA547'],
    ['iRated', 'B', 394, '', 'TCA547'],
    ['iS0', 'D', 448, 'STEP0 COMPLETED', 'TCA520'],
    ['iHouse', 'F1', 490, 'HOUSE LOAD OPERATION', 'TCE250', 1],
    ['iS6', 'D', 544, 'STEP 6 COMPLETED', 'TCA526'],
    ['iWarm', 'A', 598, 'HP TURBINE WARMING COMPLETE', 'TCA634'],
    ['iRst', 'A', 640, 'CRI 1.20 TURBINE RESET', 'TCA533'],
    ['iMsv', 'B', 684, 'CRI 1.21 MSV OPEN', 'TCA533'],
    ['iRsv', 'C', 726, 'CRI 1.22 RSV OPEN', 'TCA533'],
    ['iLlm', 'D', 767, 'CRI 1.23 LLM UPPER', 'TCA533'],
    ['iDrn', 'A', 810, 'CRI 1.25 DRAIN VALVE OPEN', 'TCA543'],
    ['iCrit', 'A', 853, 'STEP CRITERIA OK', 'TCA518'],
    ['iS2c', 'A5', 895, 'STEP 2 COMPLETE(OUT CONDITION)', 'TCA582'],
    ['iS3c', 'B6', 937, 'STEP 3 COMPLETE(OUT CONDITION)', 'TCA582'],
    ['iS3h', 'B', 979, 'STEP3 HARF START', 'TCA585'],
    ['iVolt', 'C', 1023, 'CRI 1.45 GEN.VOLTAGE OK', 'TCA543'],
    ['iAvr', 'F', 1065, 'CRI 1.42 AVR OK', 'TCA542'],
    ['iAuto', 'G', 1107, 'CRI 1.43 AVR IN AUTO', 'TCA533'],
    ['iFld', 'B', 1150, 'CRI 1.44 FIELD SWITCH CLOSED', 'TCA543'],
    ['iHold', 'A4', 1193, 'INITIAL LOAD HOLD ELAPSED', 'TCA586']
  ].forEach(([key, l, y, name, sh, dbl]) => c.push([key, 'in', l, CX, y, name, [sh], dbl ? 1 : 0]));
  /* the outputs on the right: [key of the block, letter, y of the connector, words, sheets, [y the block gives it out at, x of the step down], BTR] */
  [
    ['a002', 'A1', 159, 'STEP 2 IN CONDITION OK', ['TCA522']],
    ['iCvw', 'D', 224, 'CV WARMING COMPLETE', ['TCA580', 'TCA581']],
    ['a005', 'A2', 277, 'STEP 3 IN CONDITION OK', ['TCA523'], [234, 1468]],
    ['a008', 'A7', 331, 'STEP 1 IN CONDITION OK', ['TCA521'], [287, 1446]],
    ['a010', 'A3', 394, 'STEP 4 IN CONDITION OK', ['TCA524'], [341, 1424]],
    ['a011', 'A4', 458, 'STEP 5 IN CONDITION OK', ['TCA525'], [394, 1401]],
    ['a012', 'A5', 522, 'STEP 6 IN CONDITION OK', ['TCA526'], [448, 1380]],
    ['a013', 'A6', 575, 'STEP 7 IN CONDITION OK', ['TCA527'], [501, 1349], ['014', 1454]],
    ['a015', 'B7', 640, 'STEP0 OUT CONDITION OK', ['TCA520'], [555, 1327]],
    ['a016', 'B1', 714, 'STEP 1 OUT CONDITION OK', ['TCA521'], [607, 1305], ['017', 1452]],
    ['a018', 'B2', 853, 'STEP 2 OUT CONDITION OK', ['TCA522'], [853, 0]],
    ['a031', 'B3', 916, '', ['TCA523'], [916, 0]],
    ['a021', 'B4', 1001, 'STEP 4 OUT CONDITION OK', ['TCA524'], [1001, 0]],
    ['a032', 'B5', 1150, 'STEP 5 OUT CONDITION OK', ['TCA525'], [1150, 0]],
    ['a024', 'B6', 1267, 'STEP 6 OUT CONDITION OK', ['TCA526'], [1267, 0], ['025', 1447]]
  ].forEach(([key, l, y, name, sh, out, b0]) => {
    c.push(['o' + l, 'out', l, OX, y, '', sh]);
    if (name) t.push([1745, y - 8, name]);
    if (out)
      w.push([
        key,
        out[1]
          ? [
              [RX[key], out[0]],
              [out[1], out[0]],
              [out[1], y],
              [W1, y]
            ]
          : [
              [RX[key], y],
              [W1, y]
            ]
      ]);
    if (b0) btr.push(['btr' + b0[0], 'o:BTR', b0[0], b0[1], y]);
  });
  /* STEP CRITERIA OK into every out condition, and the shared in condition (A 002) into the in conditions of steps 3 to 7 */
  [
    [651, 1222],
    [916, 1219],
    [1001, 1218],
    [1150, 1217]
  ].forEach(([y, x]) => {
    w.push([
      'iCrit',
      [
        [CR, y],
        [x, y]
      ]
    ]);
    j.push([CR, y]);
  });
  [234, 341, 394, 448].forEach(y => {
    w.push([
      'a002',
      [
        [1192, y],
        [1223, y]
      ]
    ]);
    j.push([1192, y]);
  });
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA511',
    title: 'STEP CONTROL CONDITION',
    page: 81,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    live: { kTrip: 'trip', k52g: 'g52', k52l: 'l52c' },
    k: [
      ['kTrip', 525, 233, 'TURBINE TRIP', 'ref'],
      ['kGen', 821, 491, 'GEN.LOAD>INIT.LOAD', 'ref'],
      ['k52g', 250, 1257, '52G CLOSE', 'ref'],
      ['k52l', 612, 1310, '52L CLOSE', 'ref'],
      ['kIp', 348, 1353, 'IP START', 'ref']
    ],
    c: [
      ...c,
      ['oA8', 'out', 'A8', 1598, 117, '', ['TCA520']],
      ['iCv', 'in', 'C', 910, 810, '', ['TCA530']],
      ['iCvc', 'in', 'D', 908, 1001, 'CRI 1.37 CV(A)&(B) CLOSED', ['TCA539']],
      ['iDis', 'in', 'I', 906, 1150, 'DISCON CLOSED', ['TCA533']],
      ['iS5h', 'in', 'C', 704, 1225, 'STEP5 HARF START', ['TCA585']],
      ['iXfer', 'in', 'E', 298, 1427, '', ['TCA535']],
      ['oC', 'out', 'C', 1074, 1448, '', ['TCA512', 'TCA526'], 0, 1]
    ],
    /* the two ON(1) system references are drawn smaller than the other references */
    p: [
      [
        [860, 1337],
        [941, 1337],
        [957, 1353],
        [941, 1369],
        [860, 1369]
      ],
      [
        [336, 1464],
        [417, 1464],
        [433, 1480],
        [417, 1496],
        [336, 1496]
      ]
    ],
    s: [
      ['kOn1', 860, 1337, 957, 1369],
      ['kOn2', 336, 1464, 433, 1496]
    ],
    b: [
      ['a001', 'A', '001', 1128, 128],
      ['a002', 'A', '002', 936, 159],
      ['btr003', 'o:BTR', '003', 1257, 159],
      ['btr004', 'o:BTR', '004', 1532, 224],
      ['a006', 'A', '006', 935, 276],
      ['or007', 'OR', '007', 1062, 276],
      ['not009', 'NOT', '009', 806, 330],
      ['a005', 'A', '005', 1255, 245],
      ['a008', 'A', '008', 1255, 298],
      ['a010', 'A', '010', 1254, 351],
      ['a011', 'A', '011', 1253, 405],
      ['a012', 'A', '012', 1253, 459],
      ['a013', 'A', '013', 1253, 512],
      ['a015', 'A', '015', 1252, 565],
      ['a016', 'A', '016', 1252, 671, [], {}, [60, 150]],
      ['or028', 'OR', '028', 749, 756],
      ['or029', 'OR', '029', 748, 820],
      ['or030', 'OR', '030', 748, 884],
      ['a018', 'A', '018', 1250, 863],
      ['or020', 'OR', '020', 1025, 948],
      ['a031', 'A', '031', 1249, 938, [], {}, [60, 65]],
      ['a021', 'A', '021', 1248, 1055, [], {}, [60, 128]],
      ['or023', 'OR', '023', 1023, 1203],
      ['a032', 'A', '032', 1247, 1193, [], {}, [60, 106]],
      ['a024', 'A', '024', 1246, 1289, [], {}, [60, 65]],
      ['a026', 'A', '026', 638, 1437],
      ['dsw027', 'DSW', '027', 820, 1395],
      ...btr
    ],
    w: [
      /* STEP IN CRITERIA OK: step 0 (with TURBINE TRIP), step 2 (with CV WARMING COMPLETE), step 1 (with STEP0 COMPLETED) */
      [
        'iIn',
        [
          [W0, 149],
          [906, 149]
        ]
      ],
      [
        'iIn',
        [
          [841, 149],
          [841, 117],
          [1098, 117]
        ]
      ],
      [
        'iIn',
        [
          [841, 149],
          [841, 212],
          [1128, 212],
          [1128, 287],
          [1225, 287]
        ]
      ],
      [
        'kTrip',
        [
          [758, 233],
          [1074, 233],
          [1074, 138],
          [1098, 138]
        ]
      ],
      [
        'a001',
        [
          [1158, 117],
          [1571, 117]
        ]
      ],
      [
        'iCvw',
        [
          [W0, 191],
          [1479, 191],
          [1479, 224],
          [W1, 224]
        ]
      ],
      [
        'iCvw',
        [
          [883, 191],
          [883, 170],
          [906, 170]
        ]
      ],
      [
        'a002',
        [
          [966, 149],
          [1053, 149],
          [1053, 159],
          [W1, 159]
        ]
      ],
      [
        'a002',
        [
          [1192, 159],
          [1192, 501],
          [1223, 501]
        ]
      ],
      /* step 3: STEP 2 COMPLETED and not at the rub check speed, or at the rub check speed */
      [
        'iS2',
        [
          [W0, 266],
          [905, 266]
        ]
      ],
      [
        'iRub',
        [
          [W0, 319],
          [776, 319]
        ]
      ],
      [
        'iRub',
        [
          [752, 319],
          [752, 372],
          [1009, 372],
          [1009, 287],
          [1032, 287]
        ]
      ],
      [
        'not009',
        [
          [836, 319],
          [882, 319],
          [882, 287],
          [905, 287]
        ]
      ],
      [
        'a006',
        [
          [965, 266],
          [1032, 266]
        ]
      ],
      [
        'or007',
        [
          [1092, 266],
          [1181, 266],
          [1181, 255],
          [1225, 255]
        ]
      ],
      /* steps 4 and 5: the rated speed; step 1: STEP0 COMPLETED; step 6: the load over the initial load; step 7: STEP 6 COMPLETED */
      [
        'iRated',
        [
          [W0, 394],
          [1170, 394]
        ]
      ],
      [
        'iRated',
        [
          [1170, 394],
          [1170, 362],
          [1224, 362]
        ]
      ],
      [
        'iRated',
        [
          [1170, 394],
          [1170, 415],
          [1223, 415]
        ]
      ],
      [
        'iS0',
        [
          [W0, 448],
          [1148, 448],
          [1148, 309],
          [1225, 309]
        ]
      ],
      [
        'kGen',
        [
          [1054, 491],
          [1157, 491]
        ]
      ],
      [
        'kGen',
        [
          [1157, 491],
          [1157, 470],
          [1223, 470]
        ]
      ],
      [
        'kGen',
        [
          [1157, 491],
          [1157, 1171],
          [1217, 1171]
        ]
      ],
      [
        'iS6',
        [
          [W0, 544],
          [1192, 544],
          [1192, 522],
          [1223, 522]
        ]
      ],
      /* HOUSE LOAD OPERATION into the three OR */
      [
        'iHouse',
        [
          [W0, 490],
          [685, 490],
          [685, 873],
          [718, 873]
        ]
      ],
      [
        'iHouse',
        [
          [685, 746],
          [719, 746]
        ]
      ],
      [
        'iHouse',
        [
          [685, 831],
          [718, 831]
        ]
      ],
      /* out of step 0 and of step 1 */
      [
        'iWarm',
        [
          [W0, 598],
          [729, 598],
          [729, 555],
          [1222, 555]
        ]
      ],
      [
        'iCrit',
        [
          [W0, 853],
          [1220, 853]
        ]
      ],
      [
        'iCrit',
        [
          [1222, 576],
          [CR, 576],
          [CR, 1267],
          [1216, 1267]
        ]
      ],
      [
        'iRst',
        [
          [W0, 640],
          [750, 640],
          [750, 607],
          [1222, 607]
        ]
      ],
      [
        'iMsv',
        [
          [W0, 684],
          [771, 684],
          [771, 629],
          [1222, 629]
        ]
      ],
      [
        'iRsv',
        [
          [W0, 726],
          [793, 726],
          [793, 672],
          [1222, 672]
        ]
      ],
      [
        'iLlm',
        [
          [W0, 767],
          [719, 767]
        ]
      ],
      [
        'or028',
        [
          [779, 746],
          [814, 746],
          [814, 693],
          [1222, 693]
        ]
      ],
      [
        'iDrn',
        [
          [W0, 810],
          [718, 810]
        ]
      ],
      [
        'or029',
        [
          [778, 810],
          [835, 810],
          [835, 714],
          [1222, 714]
        ]
      ],
      [
        'iCv',
        [
          [937, 810],
          [1198, 810],
          [1198, 735],
          [1222, 735]
        ]
      ],
      /* out of steps 2 and 3 */
      [
        'iS2c',
        [
          [W0, 895],
          [718, 895]
        ]
      ],
      [
        'or030',
        [
          [778, 873],
          [1220, 873]
        ]
      ],
      [
        'iS3c',
        [
          [W0, 937],
          [995, 937]
        ]
      ],
      [
        'iS3h',
        [
          [W0, 979],
          [866, 979],
          [866, 958],
          [995, 958]
        ]
      ],
      [
        'or020',
        [
          [1055, 937],
          [1219, 937]
        ]
      ],
      [
        'iCvc',
        [
          [935, 1001],
          [1121, 1001],
          [1121, 958],
          [1219, 958]
        ]
      ],
      /* out of step 4 */
      [
        'iVolt',
        [
          [W0, 1023],
          [1218, 1023]
        ]
      ],
      [
        'iAvr',
        [
          [W0, 1065],
          [790, 1065],
          [790, 1044],
          [1218, 1044]
        ]
      ],
      [
        'iAuto',
        [
          [W0, 1107],
          [811, 1107],
          [811, 1065],
          [1218, 1065]
        ]
      ],
      [
        'iFld',
        [
          [W0, 1150],
          [832, 1150],
          [832, 1086],
          [1218, 1086]
        ]
      ],
      [
        'iDis',
        [
          [933, 1150],
          [1130, 1150],
          [1130, 1107],
          [1218, 1107]
        ]
      ],
      /* out of step 5 */
      [
        'iHold',
        [
          [W0, 1193],
          [993, 1193]
        ]
      ],
      [
        'iS5h',
        [
          [731, 1225],
          [970, 1225],
          [970, 1214],
          [993, 1214]
        ]
      ],
      [
        'or023',
        [
          [1053, 1193],
          [1217, 1193]
        ]
      ],
      [
        'k52g',
        [
          [483, 1257],
          [1077, 1257],
          [1077, 1214],
          [1217, 1214]
        ]
      ],
      [
        'k52l',
        [
          [845, 1310],
          [1098, 1310],
          [1098, 1235],
          [1217, 1235]
        ]
      ],
      /* out of step 6: IP TO HP TRANSFER COMPLETE, with the HP start always ON */
      [
        'kOn1',
        [
          [957, 1353],
          [1142, 1353],
          [1142, 1289],
          [1216, 1289]
        ]
      ],
      [
        'kIp',
        [
          [581, 1353],
          [820, 1353],
          [820, 1374]
        ]
      ],
      [
        'iXfer',
        [
          [325, 1427],
          [608, 1427]
        ]
      ],
      [
        'kOn2',
        [
          [433, 1480],
          [733, 1480],
          [733, 1406],
          [790, 1406]
        ]
      ],
      [
        'kOn2',
        [
          [586, 1480],
          [586, 1448],
          [608, 1448]
        ]
      ],
      [
        'a026',
        [
          [668, 1427],
          [705, 1427],
          [705, 1385],
          [790, 1385]
        ]
      ],
      [
        'dsw027',
        [
          [850, 1385],
          [1174, 1385],
          [1174, 1310],
          [1216, 1310]
        ]
      ],
      [
        'dsw027',
        [
          [884, 1385],
          [884, 1448],
          [1047, 1448]
        ]
      ],
      ...w
    ],
    j: [
      [841, 149],
      [883, 191],
      [1192, 159],
      [752, 319],
      [1170, 394],
      [1157, 491],
      [685, 746],
      [685, 831],
      [CR, 853],
      [586, 1480],
      [884, 1385],
      ...j
    ],
    t: [
      [1238, 109, 'STEP0 IN CONDITION OK'],
      [764, 255, '(TCA103)'],
      [965, 522, '(TCA103)'],
      [480, 1278, '(TCA103)'],
      [608, 1347, '(TCA103)'],
      [522, 1392, '(TCA106)'],
      [336, 291, 'CRI 2.3 TURBINE RUBCHECK'],
      [336, 312, 'COMPLETE SPEED'],
      [336, 366, 'CRI 2.4 TURBINE'],
      [336, 387, 'RATED SPEED'],
      [941, 784, 'CRI 1.33 CV CHEST'],
      [941, 805, 'TEMP.DIFF.OK'],
      [330, 1400, 'CRI 2.6 IP TO HP'],
      [330, 1421, 'TRANSFER COMPLETE'],
      [897, 1424, 'IP TO HP TRANSFER'],
      [897, 1445, 'COMPLETE'],
      [908, 1359, 'ON(1)', 1],
      [908, 1331, '(sys.ref)', 1, 1.7],
      [384, 1486, 'ON(1)', 1],
      [384, 1458, '(sys.ref)', 1, 1.7],
      ...[
        'STEP 0 : HP TURBINE WARMING',
        'STEP 1 : PREPARATION',
        'STEP 2 : TURBINE RUB CHECK',
        'STEP 3 : ACCELERATION',
        'STEP 4 : EXCITATION',
        'STEP 5 : SYNC INITIAL LOAD',
        'STEP 6 : LOAD UP',
        'STEP 7 : NORMAL OPERATION',
        'STEP 8 : TURBINE SHUT-DOWN'
      ].map((s, i) => [1192, Math.round(1343 + 21.3 * i), s]),
      [230, 1528, 'CONTROLLER:'],
      [400, 1528, 'COMM+MD'],
      [786, 1502, 'TRIGGER  :'],
      [786, 1528, 'CYCLE(ms):100'],
      ...t
    ]
  });
})();
