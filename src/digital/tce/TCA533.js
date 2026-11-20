/* TCA533 CRITERIA CONDITION (331DM09788 page 103, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. The ATS criteria CRI 1.20 .. 1.49 as the other TCA sheets read them: turbine reset, MSV open (A and B full open,
   A003), RSV open (A006), load limiter upper, eccentricity not high (CMP 010 against the limit of PA2 010 = SG 025 K 0.05 x G 013 K 1.1,
   reset by INITIAL, also a lamp of the operator station CRT TCA533_1 and the UPPER LIMIT value TCA533_A1), turbine trip demand due to an
   electrical trouble not present (NOT 014), AVR in auto (also lamp CRT TCA533_2), ASD in use, generator DS closed, 52G closed and 52G opened. */
(function () {
  if (typeof window === 'undefined') return;
  const IX = 285 /* the input connectors */,
    OX = 2063 /* the output connectors */,
    BX = 1735 /* the BTR of the output lines */,
    c = [],
    b = [],
    w = [],
    t = [];
  /* the input connectors: [key, letter, y, sheet, name, double line] */
  [
    ['iB', 'B', 143, 'TCA103', 'TURBINE RESET', 0],
    ['iHa', 'H', 220, 'TCE121', 'MSV(A) FULL OPEN', 1],
    ['iHb', 'H', 302, 'TCE123', 'MSV(B) FULL OPEN', 1],
    ['iGa', 'G', 379, 'TCE133', 'RSV(A) FULL OPEN', 1],
    ['iGb', 'G', 452, 'TCE135', 'RSV(B) FULL OPEN', 1],
    ['iC', 'C', 516, 'TCE205', 'LOAD LIMITER UPPER', 1],
    ['iA3', 'A3', 643, 'TCA318', 'LOW SPEED ECCENTRICITY', 0],
    ['iA', 'A', 868, 'TCE113', 'TURBINE TRIP COMMAND FROM ELECTRICAL', 0],
    ['iA12', 'A12', 973, 'TCA045', 'AVR IN AUTO', 0],
    ['iA10', 'A10', 1080, 'TCA045', 'ASD IN USE', 0],
    ['iB3', 'B3', 1155, 'TCE041', 'GEN. DS CLOSED', 1],
    ['iB5', 'B5', 1302, 'TCE041', 'GEN. CB OPENED', 1]
  ].forEach(([key, l, y, sh, name, dbl]) => c.push([key, 'in', l, IX, y, name, [sh], dbl]));
  /* the output lines: [source key, x where the line starts, y, BTR, letter, sheets, how the sheets stand, CRI lines] */
  [
    ['iB', IX + 27, 143, '001', 'A', ['TCA768', 'TCA511', 'TCA555'], 3, ['CRI 1.20 TURBINE RESET']],
    ['a003', 1554, 218, '004', 'B', ['TCA768', 'TCA511', 'TCA555', 'TCA580', 'TCA581'], 3, ['CRI 1.21 MSV OPEN']],
    ['a006', 1554, 377, '007', 'C', ['TCA511', 'TCA555'], 2, ['CRI 1.22 RSV OPEN']],
    ['iC', IX + 27, 516, '008', 'D', ['TCA582', 'TCA511', 'TCA512', 'TCA555'], 3, ['CRI 1.23 LOAD LIMITER', 'UPPER']],
    ['not011', 1551, 643, '', 'E', ['TCA556'], 0, ['CRI 1.27 ECCENTRICITY', 'NOT HIGH']],
    ['not014', 1550, 868, '015', 'F', ['TCA560'], 0, ['CRI 1.41 TURB.TRIP DEMAND', 'DUE ELECTRICAL', 'TROUBLE NOT']],
    ['iA12', IX + 27, 973, '016', 'G', ['TCA511', 'TCA560'], 2, ['CRI 1.43 AVR IN AUTO']],
    ['iA10', IX + 27, 1080, '017', 'H', ['TCA561', 'TCA583'], 2, ['CRI 1.46 ASD IN USE']],
    ['iB3', IX + 27, 1155, '018', 'I', ['TCA511', 'TCA561'], 2, ['CRI 1.47 GEN. DISCON CLOSED']],
    ['k52', 486, 1228, '019', 'J', ['TCA561'], 0, ['CRI 1.48 52G CLOSED']],
    ['iB5', IX + 27, 1302, '020', 'K', ['TCA544', 'TCA562', 'TCA587', 'TCA611'], 3, ['CRI 1.49 52G OPENED']]
  ].forEach(([key, x0, y, btr, ol, refs, under, cri]) => {
    w.push([
      key,
      [
        [x0, y],
        [OX - 27, y]
      ]
    ]);
    if (btr) b.push(['btr' + btr, 'o:BTR', btr, BX, y]);
    c.push(['o' + ol, 'out', ol, OX, y, '', refs, 0, under]);
    cri.forEach((s, i) => t.push([1790, y - 10 - 21 * (cri.length - 1 - i), s]));
  });
  /* MSV open = MSV(A) and MSV(B) full open, RSV open = RSV(A) and RSV(B) full open; the full open of each MSV also goes on alone (B1, B2) */
  b.push(
    ['a003', 'A', '003', 1524, 229],
    ['a006', 'A', '006', 1524, 388],
    ['btr002', 'o:BTR', '002', 672, 185],
    ['btr005', 'o:BTR', '005', 672, 270]
  );
  c.push(['oB1', 'out', 'B1', 1043, 185, '', ['TCA615']], ['oB2', 'out', 'B2', 1043, 270, '', ['TCA615']]);
  w.push(
    [
      'iHa',
      [
        [IX + 27, 220],
        [1494, 220]
      ]
    ],
    [
      'iHa',
      [
        [619, 220],
        [619, 185],
        [1016, 185]
      ]
    ],
    [
      'iHb',
      [
        [IX + 27, 302],
        [1470, 302],
        [1470, 239],
        [1494, 239]
      ]
    ],
    [
      'iHb',
      [
        [619, 302],
        [619, 270],
        [1016, 270]
      ]
    ],
    [
      'iGa',
      [
        [IX + 27, 379],
        [1494, 379]
      ]
    ],
    [
      'iGb',
      [
        [IX + 27, 452],
        [1470, 452],
        [1470, 398],
        [1494, 398]
      ]
    ]
  );
  /* eccentricity: CMP 010 of the low speed eccentricity (reset by INITIAL) against the limit PA2 010 = SG 025 x G 013 */
  b.push(
    ['cmp010', 'CMP', '010', 882, 654],
    ['sg025', 'SG', '025', 390, 740, ['K:0.05']],
    ['g013', 'G', '013', 668, 740, ['K:1.1']],
    ['pa2010', 'PA2', '010', 881, 739, [], {}, [59, 85]],
    ['not011', 'NOT', '011', 1521, 654],
    ['btr009', 'o:BTR', '009', 1093, 590],
    ['btr012', 'o:BTR', '012', 1093, 697],
    ['ftr021', 'o:FTR', '021', 1093, 772],
    ['ftr022', 'o:FTR', '022', 1093, 825]
  );
  c.push(['oE1', 'out', 'E1', 1370, 697, '', ['-'], 1, 1], ['oF1', 'out', 'F1', 1370, 825, '', ['-'], 1, 1]);
  w.push(
    [
      'iA3',
      [
        [IX + 27, 643],
        [852, 643]
      ],
      1
    ],
    [
      'kInit',
      [
        [714, 579],
        [882, 579],
        [882, 633]
      ]
    ],
    [
      'cmp010',
      [
        [912, 643],
        [1491, 643]
      ]
    ],
    [
      'cmp010',
      [
        [1040, 643],
        [1040, 590],
        [1336, 590]
      ]
    ],
    [
      'cmp010',
      [
        [1040, 643],
        [1040, 697],
        [1343, 697]
      ]
    ],
    [
      'sg025',
      [
        [420, 729],
        [638, 729]
      ],
      1
    ],
    [
      'g013',
      [
        [698, 729],
        [851, 729]
      ],
      1
    ],
    [
      'g013',
      [
        [785, 729],
        [785, 750],
        [851, 750]
      ],
      1
    ],
    [
      'g013',
      [
        [785, 750],
        [785, 825],
        [1343, 825]
      ],
      1
    ],
    [
      'g013',
      [
        [1040, 825],
        [1040, 772],
        [1336, 772]
      ],
      1
    ]
  );
  /* turbine trip demand due to an electrical trouble NOT, AVR in auto (also lamp TCA533_2 and G1) */
  b.push(
    ['not014', 'NOT', '014', 1520, 879],
    ['btr023', 'o:BTR', '023', 1091, 918],
    ['btr024', 'o:BTR', '024', 1091, 1025]
  );
  c.push(['oG1', 'out', 'G1', 1368, 1025, '', ['-'], 1, 1]);
  w.push(
    [
      'iA',
      [
        [IX + 27, 868],
        [1490, 868]
      ]
    ],
    [
      'iA12',
      [
        [1038, 973],
        [1038, 918],
        [1334, 918]
      ]
    ],
    [
      'iA12',
      [
        [1038, 973],
        [1038, 1025],
        [1341, 1025]
      ]
    ]
  );
  t.push(
    [762, 175, 'MSV (A) FULL OPEN'],
    [762, 260, 'MSV (B) FULL OPEN'],
    [1133, 559, 'LOW SPEED'],
    [1133, 580, 'ECCENTRICITY HIGH'],
    [1133, 666, 'LOW SPEED'],
    [1133, 687, 'ECCENTRICITY HIGH'],
    [1131, 762, 'UPPER LIMIT'],
    [1131, 815, 'UPPER LIMIT'],
    [1129, 908, 'AVR IN AUTO'],
    [1129, 1015, 'AVR IN AUTO'],
    [870, 632, 'T', 2],
    [847, 721, 'HL', 2],
    [847, 744, 'LL', 2],
    [606, 618, '(TCA100)'],
    [383, 1268, '(TCA103)'],
    [225, 1527, 'CONTROLLER:'],
    [385, 1527, 'COMM+MD'],
    [647, 1500, 'TRIGGER  :'],
    [647, 1526, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA533',
    title: 'CRITERIA CONDITION',
    page: 103,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [160, 85, 2208, 1550],
    /* live: the engine state of the signals named on this sheet (tcs.js tcsLiveRead): TURBINE RESET, 52G CLOSE, GEN. CB OPENED */
    live: { iB: 'rst', k52: 'g52', iB5: '!g52' },
    k: [
      ['kInit', 481, 579, 'INITIAL', 'ref'],
      ['k52', 253, 1228, '52G CLOSE', 'ref']
    ],
    c,
    d: [
      ['crt1', 1371, 590, 'out', 'TCA533_1', 'S', '#1C'],
      ['crtA1', 1371, 772, 'out', 'TCA533_A1', 'S', '#1C'],
      ['crt2', 1369, 918, 'out', 'TCA533_2', 'S', '#1C']
    ],
    b,
    w,
    j: [
      [619, 220],
      [619, 302],
      [1040, 643],
      [785, 729],
      [785, 750],
      [1040, 825],
      [1038, 973]
    ],
    t
  });
})();
