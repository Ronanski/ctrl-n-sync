/* TCA768 SPEED LOAD HOLD (331DM09788 page 195, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. LOAD HOLD COMMAND = A 004 of (OR 003 = OR 002 of the five criteria not OK (CRI 1.28 diff. expansion, 1.12 LP exhaust
   hood temp., 1.11 condenser vacuum, 1.15 bearing oil press., 1.24 vibration) or SPEED LOAD HOLD (STRESS)) and ATS AUTO; the same two to
   A 007 = HOLD SET, its NOT over TW A011 (3.0 s, cleared by INITIAL) = HOLD RESET, and SPEED HOLD (BTR 012).
   Below: the HP and the IP surface thermal stress (CPL A013 / A018, HL 209.3 / LL 207.3) with turbine reset or MSV open (OR 019) and the
   load over 30 % (CMP 022, HL 45.0 / LL 43.0 MW) start TP A016 (12000.0 s, cleared by INITIAL), which sets FFR 017 = TH STRESS LIMITATION
   CHANGES TO NORMAL/STOP MODE; NOT 020 (turbine not reset) resets it.
   The words are the ones of the drawing. The load line is printed MW, an empty box, a dagger, 30%: the two signs are the two bytes 81 86 of
   the Shift-JIS sign "greater than or equal" (U+2267) shown in a Latin font (86 = dagger, 81 = no glyph), so the line is MW ≧ 30%. It
   agrees with the sheet: A1 of TCE070 is GEN. MW (range 0 to 240 MW), CMP 022 sets at HL 45.0 MW = 30 % of 150 MW.
   live: ATS AUTO and the load from the engine (tcs.js tcsLiveRead); the engine holds no state of the other signals. */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    b = [],
    w = [],
    t = [];
  /* the criteria: [connector key, letter, sheet, connector x, line y, name lines, NOT, x of the riser to OR 002, y at OR 002] */
  [
    ['iA544', 'A', 'TCA544', 313, 265, ['CRI 1.28 DIFF.', 'EXPANSION OK'], '001', 0, 265],
    ['iA540', 'A', 'TCA540', 312, 361, ['CRI 1.12 LP EXHAUST', 'HOOD TEMP NOT HIGH'], '005', 939, 286],
    ['iC536', 'C', 'TCA536', 312, 457, ['CRI 1.11 CONDENSER', 'VACUUM OK'], '006', 960, 307],
    ['iE536', 'E', 'TCA536', 311, 553, ['CRI 1.15 BEARING OIL', 'PRESS NOT LOW'], '008', 981, 328],
    ['iA537', 'A', 'TCA537', 310, 649, ['CRI 1.24 VIBRATION', 'NOT HIGH'], '009', 1002, 350]
  ].forEach(([key, l, sh, cx, y, names, no, rx, oy], i) => {
    const bx = 721 - i;
    c.push([key, 'in', l, cx, y, '', [sh]]);
    names.forEach((s, n) => t.push([cx + 56, y - 31 + 21 * n, s]));
    b.push(['not' + no, 'NOT', no, bx, y + 11]);
    w.push(
      [
        key,
        [
          [cx + 27, y],
          [bx - 30, y]
        ]
      ],
      [
        'not' + no,
        rx
          ? [
              [bx + 30, y],
              [rx, y],
              [rx, oy],
              [1027, oy]
            ]
          : [
              [bx + 30, y],
              [1027, y]
            ]
      ]
    );
  });
  /* the other inputs with their one line of words */
  [
    ['iA767', 'A', 'TCA767', 310, 745, 'SPEED LOAD HOLD (STRESS)', 55, 0],
    ['iE767', 'E', 'TCA767', 309, 936, 'HP SURFACE TH STRESS (ABS)', 33, 0],
    ['iF767', 'F', 'TCA767', 308, 1032, 'IP SURFACE TH STRESS (ABS)', 33, 0],
    ['iA533', 'A', 'TCA533', 308, 1127, 'CRI 1.20 TURBINE RESET', 33, 0],
    ['iB533', 'B', 'TCA533', 307, 1224, 'CRI 1.21 MSV OPEN', 33, 0],
    ['iA1', 'A1', 'TCE070', 306, 1320, 'MW≧30%', 33, 1]
  ].forEach(([key, l, sh, cx, y, name, dx, dbl]) => {
    c.push([key, 'in', l, cx, y, '', [sh], dbl]);
    t.push([cx + dx, y - 10, name]);
  });
  b.push(
    ['or002', 'OR', '002', 1057, 307, [], {}, [60, 106]],
    ['or003', 'OR', '003', 1216, 275],
    ['a004', 'A', '004', 1520, 275],
    ['a007', 'A', '007', 1518, 436],
    ['not010', 'NOT', '010', 1632, 650],
    ['twA011', 'TW', 'A011', 1761, 650, ['TW:3.0s']],
    ['btr012', 'o:BTR', '012', 1760, 788],
    ['cplA013', 'CPL', 'A013', 716, 947, ['HL:209.3', 'LL:207.3']],
    ['a014', 'A', '014', 896, 947],
    ['tpA016', 'TP', 'A016', 1215, 947, ['TP:12000.0S']],
    ['ffr017', 'FFR', '017', 1535, 947, [], { l: ['S', 'R'] }, [80, 43]],
    ['cplA018', 'CPL', 'A018', 715, 1043, ['HL:209.3', 'LL:207.3']],
    ['or019', 'OR', '019', 714, 1138],
    ['not020', 'NOT', '020', 714, 1235],
    ['a021', 'A', '021', 1057, 958, [], {}, [60, 65]],
    ['cmp022', 'CMP', '022', 894, 1331, ['HL:45.0MW', 'LL:43.0MW']]
  );
  c.push(
    ['oA', 'out', 'A', 2096, 265, '', ['-']],
    ['oB', 'out', 'B', 2094, 425, '', ['TCE164'], 1],
    ['oC', 'out', 'C', 2092, 639, '', ['TCE164'], 1],
    ['oD', 'out', 'D', 2089, 788, '', ['TCA584']],
    ['oE', 'out', 'E', 2088, 936, '', ['TCA767', 'TCA768A']]
  );
  const W = (key, pts, thick) => w.push(thick ? [key, pts, 1] : [key, pts]);
  /* INITIAL: clears TW A011, CMP 022 and TP A016 */
  W('kInit', [
    [501, 158],
    [1763, 158],
    [1763, 629]
  ]);
  W('kInit', [
    [824, 158],
    [824, 1277],
    [894, 1277],
    [894, 1310]
  ]);
  W('kInit', [
    [1763, 532],
    [1215, 532],
    [1215, 926]
  ]);
  /* the hold: OR 002, OR 003, A 004, A 007 */
  W('or002', [
    [1087, 265],
    [1186, 265]
  ]);
  W('iA767', [
    [337, 745],
    [1161, 745],
    [1161, 286],
    [1186, 286]
  ]);
  W('or003', [
    [1246, 265],
    [1490, 265]
  ]);
  W('or003', [
    [1444, 265],
    [1444, 425],
    [1488, 425]
  ]);
  W('kAts', [
    [497, 840],
    [1465, 840],
    [1465, 286],
    [1490, 286]
  ]);
  W('kAts', [
    [1465, 447],
    [1488, 447]
  ]);
  W('a004', [
    [1550, 265],
    [2069, 265]
  ]);
  W('a007', [
    [1548, 425],
    [2067, 425]
  ]);
  W('a007', [
    [1570, 425],
    [1570, 639],
    [1602, 639]
  ]);
  W('a007', [
    [1570, 639],
    [1570, 788],
    [2062, 788]
  ]);
  W('not010', [
    [1662, 639],
    [1731, 639]
  ]);
  W('twA011', [
    [1791, 639],
    [2065, 639]
  ]);
  /* the thermal stress limitation: CPL A013 / A018, A 014, OR 019, NOT 020, CMP 022, A 021, TP A016, FFR 017 */
  W(
    'iE767',
    [
      [336, 936],
      [686, 936]
    ],
    1
  );
  W('cplA013', [
    [746, 936],
    [866, 936]
  ]);
  W(
    'iF767',
    [
      [335, 1032],
      [685, 1032]
    ],
    1
  );
  W('cplA018', [
    [745, 1032],
    [842, 1032],
    [842, 957],
    [866, 957]
  ]);
  W('a014', [
    [926, 936],
    [1027, 936]
  ]);
  W('iA533', [
    [335, 1127],
    [684, 1127]
  ]);
  W('iA533', [
    [661, 1127],
    [661, 1224],
    [684, 1224]
  ]);
  W('iB533', [
    [334, 1224],
    [639, 1224],
    [639, 1149],
    [684, 1149]
  ]);
  W('or019', [
    [744, 1127],
    [982, 1127],
    [982, 957],
    [1027, 957]
  ]);
  W('not020', [
    [744, 1224],
    [1460, 1224],
    [1460, 958],
    [1495, 958]
  ]);
  W(
    'iA1',
    [
      [333, 1320],
      [864, 1320]
    ],
    1
  );
  W('cmp022', [
    [924, 1320],
    [1002, 1320],
    [1002, 979],
    [1027, 979]
  ]);
  W('a021', [
    [1087, 936],
    [1185, 936]
  ]);
  W('tpA016', [
    [1245, 936],
    [1495, 936]
  ]);
  W('ffr017', [
    [1575, 936],
    [2061, 936]
  ]);
  t.push(
    [1864, 255, 'LOAD HOLD COMMAND'],
    [1862, 415, 'HOLD SET'],
    [1860, 629, 'HOLD RESET'],
    [1860, 778, 'SPEED HOLD'],
    [1699, 905, 'TH STRESS LIMITATION CHANGES'],
    [1699, 926, 'TO NORMAL/STOP MODE'],
    [1723, 627, 'C', 2],
    [677, 924, 'C', 2],
    [676, 1020, 'C', 2],
    [854, 1308, 'C', 2],
    [1176, 924, 'T', 2],
    [1485, 924, 'T', 2],
    [370, 194, '(TCA100)'],
    [366, 876, '(TCA501)'],
    [242, 1526, 'CONTROLLER:'],
    [402, 1526, 'COMM+MD'],
    [626, 1502, 'TRIGGER  :'],
    [626, 1528, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA768',
    title: 'SPEED LOAD HOLD',
    page: 195,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    live: { kAts: 'auto', iA1: ['mw', 'MW'] },
    k: [
      ['kInit', 267, 158, 'INITIAL', 'ref'],
      ['kAts', 263, 840, 'ATS AUTO', 'ref']
    ],
    c,
    b,
    w,
    j: [
      [824, 158],
      [1763, 532],
      [1444, 265],
      [1465, 447],
      [1570, 425],
      [1570, 639],
      [661, 1127]
    ],
    t
  });
})();
