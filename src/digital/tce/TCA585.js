/* TCA585 HEAT SOAK TIME (331DM09788 page 144, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The HEAT SOAK TIMER block (IP start, LMA578A) runs the 1800 / 2700 / 3600 rpm and the initial load heat soak timers started on
   TCA582 / TCA583. Each time comes out of a function generator of the memorized metal temperature (FG *1..*4, MIN against DEGC, the tables and
   graphs as printed). It gives the heat soak elapsed signals and the remaining hold times to TCA586, and with the rated speed / the generator load
   over the initial load the STEP3 / STEP5 HARF START (as printed) to TCA511. The graphs are drawn as the drawing draws them, not to scale. */
(function () {
  if (typeof window === 'undefined') return;
  const R = Math.round,
    PL = Array.from({ length: 8 }, (_, i) => R(517 + 21.3 * i)) /* MODE1..4, TIME1..4 */,
    PR = Array.from({ length: 10 }, (_, i) =>
      R(517 + 21.3 * i)
    ) /* COMP1, RATED, COMP2, INIT, COMP3, COMP4, TIME1..4 */,
    MX = 1098,
    MR = 1335,
    c = [],
    b = [],
    w = [],
    t = [],
    j = [],
    l = [],
    e = [],
    a = [],
    v = [];
  /* the timer starts into MODE1..4: [key, letter, y, name, sheet, BTR, riser x] */
  [
    ['iB11', 'B11', 517, '1800RPM HEAT SOAK TIMER START', 'TCA582', '007', 0],
    ['iB3', 'B3', 581, '2700RPM HEAT SOAK TIMER START', 'TCA582', '010', 951],
    ['iB4', 'B4', 645, '3600RPM HEAT SOAK TIMER START', 'TCA582', '012', 971],
    ['iA3', 'A3', 709, 'INITIAL LOAD HOLD TIMER START', 'TCA583', '014', 992]
  ].forEach(([key, l2, y, name, sh, btr, xr], i) => {
    c.push([key, 'in', l2, 255, y, name, [sh], 0, 1]);
    b.push(['btr' + btr, 'o:BTR', btr, 631, y]);
    w.push([
      key,
      xr
        ? [
            [282, y],
            [xr, y],
            [xr, PL[i]],
            [MX, PL[i]]
          ]
        : [
            [282, y],
            [MX, y]
          ]
    ]);
  });
  /* the memorized temperature through the four function generators into TIME1..4 */
  c.push(['iJ', 'in', 'J', 253, 772, '', ['TCA500'], 0, 1]);
  b.push(['ftr016', 'o:FTR', '016', 631, 772]);
  w.push(
    [
      'iJ',
      [
        [280, 772],
        [727, 772]
      ],
      1
    ],
    [
      'iJ',
      [
        [681, 772],
        [681, 959],
        [727, 959]
      ],
      1
    ]
  );
  [
    ['A017', 772, 1012, '*1', '(1800RPM HEAT SOAK)'],
    ['A019', 837, 1032, '*2', '(3600RPM HEAT SOAK)'],
    ['A021', 900, 1053, '*3', '(3600RPM HEAT SOAK)'],
    ['A023', 959, 1073, '*4', '(INIT.LOAD HOLD)']
  ].forEach(([no, y, xr, star, txt], i) => {
    const key = 'fg' + no;
    b.push([key, 'FG', no, 756, y + 11]);
    if (i === 1 || i === 2)
      w.push([
        'iJ',
        [
          [681, y],
          [727, y]
        ],
        1
      ]);
    w.push([
      key,
      [
        [785, y],
        [xr, y],
        [xr, PL[4 + i]],
        [MX, PL[4 + i]]
      ],
      1
    ]);
    t.push([793, y - 19, star], [790, y + 15, txt]);
  });
  j.push([681, 772], [681, 837], [681, 900]);
  /* the outputs: [pin, connector, y, name, the x where it turns, mark type, number, analog] */
  [
    [0, 'A1', 517, '1800RPM HEAT SOAK ELAPSED(IP)', 0, 'BTR', '009', 0],
    [2, 'A2', 583, '2700RPM HEAT SOAK ELAPSED(IP)', 1480, 'BTR', '011', 0],
    [4, 'A3', 648, '3600RPM HEAT SOAK ELAPSED(IP)', 1458, 'BTR', '013', 0],
    [5, 'A4', 711, '', 1437, 'BTR', '015', 0],
    [6, 'D1', 785, 'LOW SPD HLD REMAIN(IP)', 1417, 'FTR', '018', 1],
    [7, 'D2', 848, 'MED SPD HLD REMAIN(IP)', 1397, 'FTR', '020', 1],
    [8, 'D3', 912, 'RATED SPD HLD REMAIN(IP)', 1372, 'FTR', '022', 1],
    [9, 'D4', 975, 'INITIAL HLD REMAIN(IP)', 1351, 'FTR', '024', 1]
  ].forEach(([p, l2, y, name, xd, ty, no, thick]) => {
    const pin = ['COMP1', 'RATED', 'COMP2', 'INIT', 'COMP3', 'COMP4', 'TIME1', 'TIME2', 'TIME3', 'TIME4'][p];
    b.push([(ty === 'BTR' ? 'btr' : 'ftr') + no, 'o:' + ty, no, 1545, y]);
    w.push([
      'mt1.' + pin,
      xd
        ? [
            [MR, PR[p]],
            [xd, PR[p]],
            [xd, y],
            [2062, y]
          ]
        : [
            [MR, y],
            [2062, y]
          ],
      thick
    ]);
    c.push(['o' + l2, 'out', l2, 2089, y, '', ['TCA586'], 0, 1]);
    if (name) t.push([1637, y - 9, name]);
  });
  t.push([1637, 680, 'INITIAL LOAD'], [1637, 702, 'HEAT SOAK ELAPSED(IP)']);
  /* STEP3 / STEP5 HARF START: rated timer on (not) with the rated speed, initial timer on (not) with the load over the initial load */
  c.push(
    ['iRated', 'in', 'B', 270, 262, 'CRI 2.4 RATED SPEED', ['TCA547'], 0, 1],
    ['oB', 'out', 'B', 2090, 200, '', ['TCA511'], 0, 1],
    ['oC', 'out', 'C', 2090, 349, '', ['TCA511'], 0, 1]
  );
  b.push(
    ['btr001', 'o:BTR', '001', 1550, 200],
    ['btr004', 'o:BTR', '004', 1548, 349],
    ['not002', 'NOT', '002', 1793, 211],
    ['a003', 'A', '003', 1901, 209],
    ['not005', 'NOT', '005', 1793, 360],
    ['a006', 'A', '006', 1900, 358]
  );
  w.push(
    [
      'mt1.RATED',
      [
        [MR, PR[1]],
        [1443, PR[1]],
        [1443, 200],
        [1763, 200]
      ]
    ],
    [
      'not002',
      [
        [1823, 200],
        [1871, 200]
      ]
    ],
    [
      'iRated',
      [
        [297, 262],
        [1845, 262],
        [1845, 219],
        [1871, 219]
      ]
    ],
    [
      'a003',
      [
        [1931, 200],
        [2063, 200]
      ]
    ],
    [
      'mt1.INIT',
      [
        [MR, PR[3]],
        [1463, PR[3]],
        [1463, 349],
        [1763, 349]
      ]
    ],
    [
      'not005',
      [
        [1823, 349],
        [1870, 349]
      ]
    ],
    [
      'kLoad',
      [
        [583, 433],
        [1845, 433],
        [1845, 368],
        [1870, 368]
      ]
    ],
    [
      'a006',
      [
        [1930, 349],
        [2063, 349]
      ]
    ]
  );
  t.push(
    [1583, 190, 'RATED TIMER ON'],
    [1581, 339, 'INITIAL TIMER ON'],
    [1948, 170, 'STEP3'],
    [1948, 191, 'HARF START'],
    [1948, 319, 'STEP5'],
    [1948, 340, 'HARF START'],
    [497, 466, '(TCA103)'],
    [299, 738, 'MEMORIZED TEMP.'],
    [299, 761, 'FOR HEAT SOAK TIMER(IP START)'],
    [1100, 473, 'IP START']
  );
  /* the four function generators: graph (as drawn) and table */
  const G = [
    {
      o: [317, 1229],
      top: 1083,
      end: 487,
      ys: [
        [88, 1112],
        [58, 1155],
        [30, 1197]
      ],
      xs: [
        [150, 369],
        [170, 390],
        [230, 452]
      ],
      cv: [
        [317, 1112],
        [359, 1112],
        [369, 1155],
        [380, 1155],
        [390, 1197],
        [452, 1197],
        [463, 1229]
      ],
      dh: [
        [1155, 369],
        [1197, 390]
      ],
      dv: [
        [369, 1155],
        [380, 1155],
        [390, 1197],
        [452, 1197]
      ],
      degc: [450, 1260],
      tb: [320, 353, 415, 473, 'FG *1', 333],
      d: [
        ['0.00', '88.00'],
        ['140.00', '88.00'],
        ['150.00', '58.00'],
        ['160.00', '58.00'],
        ['170.00', '30.00'],
        ['230.00', '30.00'],
        ['240.00', '0.00'],
        ['600.00', '0.00']
      ]
    },
    {
      o: [567, 1229],
      top: 1083,
      end: 743,
      ys: [
        [86, 1112],
        [56, 1133],
        [27, 1155],
        [23, 1175],
        [3, 1213]
      ],
      xs: [
        [150, 625],
        [170, 640],
        [230, 668],
        [420, 710]
      ],
      cv: [
        [567, 1112],
        [615, 1112],
        [625, 1133],
        [637, 1133],
        [649, 1155],
        [657, 1155],
        [668, 1175],
        [699, 1175],
        [710, 1213],
        [722, 1213]
      ],
      dh: [
        [1133, 625],
        [1155, 649],
        [1175, 668],
        [1213, 710]
      ],
      dv: [
        [625, 1133],
        [637, 1133],
        [649, 1155],
        [668, 1175],
        [710, 1177]
      ],
      degc: [711, 1265],
      tb: [575, 607, 670, 729, 'FG *2', 588],
      d: [
        ['0.00', '86.00'],
        ['140.00', '86.00'],
        ['150.00', '56.00'],
        ['170.00', '27.00'],
        ['230.00', '23.00'],
        ['410.00', '23.00'],
        ['420.00', '3.00'],
        ['600.00', '3.00']
      ]
    },
    {
      o: [820, 1229],
      top: 1083,
      end: 990,
      ys: [
        [86, 1112],
        [56, 1133],
        [27, 1155],
        [23, 1175],
        [3, 1213]
      ],
      xs: [
        [150, 875],
        [170, 892],
        [230, 918],
        [420, 961]
      ],
      cv: [
        [820, 1112],
        [863, 1112],
        [875, 1133],
        [887, 1133],
        [897, 1155],
        [909, 1155],
        [918, 1175],
        [950, 1175],
        [961, 1213],
        [971, 1213]
      ],
      dh: [
        [1133, 875],
        [1155, 897],
        [1175, 918],
        [1213, 961]
      ],
      dv: [
        [875, 1133],
        [887, 1133],
        [897, 1155],
        [918, 1175],
        [961, 1177]
      ],
      degc: [963, 1265],
      tb: [823, 857, 917, 977, 'FG *3', 840],
      d: [
        ['0.00', '86.00'],
        ['140.00', '86.00'],
        ['150.00', '56.00'],
        ['170.00', '27.00'],
        ['230.00', '23.00'],
        ['410.00', '23.00'],
        ['420.00', '3.00'],
        ['600.00', '3.00']
      ]
    },
    {
      o: [1093, 1229],
      top: 1083,
      end: 1307,
      ys: [
        [40, 1113],
        [15, 1177]
      ],
      xs: [
        [220, 1168],
        [230, 1200],
        [410, 1231],
        [420, 1263]
      ],
      cv: [
        [1093, 1113],
        [1168, 1113],
        [1200, 1177],
        [1231, 1177],
        [1263, 1229]
      ],
      dh: [[1177, 1200]],
      dv: [
        [1168, 1113],
        [1200, 1177],
        [1231, 1177]
      ],
      degc: [1245, 1265],
      tb: [1089, 1121, 1183, 1243, 'FG *4', 1103],
      d: [
        ['0.00', '40.00'],
        ['220.00', '40.00'],
        ['230.00', '15.00'],
        ['410.00', '15.00'],
        ['420.00', '0.00'],
        ['500.00', '0.00'],
        ['550.00', '0.00'],
        ['600.00', '0.00']
      ]
    }
  ];
  G.forEach(g => {
    const [ox, oy] = g.o;
    a.push(
      [
        [ox, oy],
        [ox, g.top]
      ],
      [
        [ox, oy],
        [g.end, oy]
      ]
    );
    t.push([ox + 2, g.top - 16, 'MIN', 1], [ox - 6, oy + 11, '0', 1], [g.degc[0], g.degc[1], 'DEGC', 1]);
    g.ys.forEach(([s, y]) => {
      l.push([
        [ox - 5, y],
        [ox, y]
      ]);
      t.push([ox - 10, y, String(s), 2]);
    });
    /* two labels printed close together (150 170) stand apart from their ticks as on the drawing */
    g.xs.forEach(([s, x], k) => {
      const nx = g.xs[k + 1],
        px = g.xs[k - 1],
        cn = nx && nx[1] - x < 34,
        cp = px && x - px[1] < 34,
        al = cn && !cp ? 2 : cp && !cn ? 0 : 1;
      t.push([al === 2 ? x + 3 : al === 0 ? x - 3 : x, oy + 18, String(s), al]);
    });
    v.push(g.cv);
    g.dh.forEach(([y, x]) =>
      e.push([
        [ox, y],
        [x, y]
      ])
    );
    g.dv.forEach(([x, y]) =>
      e.push([
        [x, y],
        [x, oy]
      ])
    );
    /* the table: NO., Xn(DEGC), Yn(MIN), eight rows */
    const [x0, x1, x2, x3, name, xn] = g.tb,
      y0 = 1292,
      yh = 1313,
      rows = Array.from({ length: 9 }, (_, k) => R(yh + 20.25 * k));
    t.push([xn, 1284, name]);
    [y0, ...rows].forEach(y =>
      l.push([
        [x0, y],
        [x3, y]
      ])
    );
    [x0, x1, x2, x3].forEach(x =>
      l.push([
        [x, y0],
        [x, rows[8]]
      ])
    );
    t.push([(x0 + x1) / 2, 1303, 'NO.', 1], [(x1 + x2) / 2, 1303, 'Xn(DEGC)', 1], [(x2 + x3) / 2, 1303, 'Yn(MIN)', 1]);
    g.d.forEach(([xs, ys], k) => {
      const y = R(yh + 20.25 * k + 10);
      t.push([(x0 + x1) / 2, y, String(k), 1], [(x1 + x2) / 2, y, xs, 1], [(x2 + x3) / 2, y, ys, 1]);
    });
  });
  t.push([230, 1528, 'CONTROLLER:'], [400, 1528, 'COMM+MD'], [620, 1500, 'TRIGGER  :'], [620, 1526, 'CYCLE(ms):100']);
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA585',
    /* pr: printed on page 144 beside each block, FG *1 ~ *4 tables; the drawing above keeps them as text */
    pr: {
      fgA017: ['X1:0', 'Y1:88', 'X2:140', 'Y2:88', 'X3:150', 'Y3:58', 'X4:160', 'Y4:58', 'X5:170', 'Y5:30', 'X6:230', 'Y6:30', 'X7:240', 'Y7:0', 'X8:600', 'Y8:0'],
      fgA019: ['X1:0', 'Y1:86', 'X2:140', 'Y2:86', 'X3:150', 'Y3:56', 'X4:170', 'Y4:27', 'X5:230', 'Y5:23', 'X6:410', 'Y6:23', 'X7:420', 'Y7:3', 'X8:600', 'Y8:3'],
      fgA021: ['X1:0', 'Y1:86', 'X2:140', 'Y2:86', 'X3:150', 'Y3:56', 'X4:170', 'Y4:27', 'X5:230', 'Y5:23', 'X6:410', 'Y6:23', 'X7:420', 'Y7:3', 'X8:600', 'Y8:3'],
      fgA023: ['X1:0', 'Y1:40', 'X2:220', 'Y2:40', 'X3:230', 'Y3:15', 'X4:410', 'Y4:15', 'X5:420', 'Y5:0', 'X6:500', 'Y6:0', 'X7:550', 'Y7:0', 'X8:600', 'Y8:0']
    },
    title: 'HEAT SOAK TIME',
    page: 144,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    /* no live: the engine holds none of the heat soak timers of this sheet */
    k: [['kLoad', 349, 433, 'GEN.LOAD>INIT.LOAD', 'ref']],
    c,
    m: [
      [
        'mt1',
        'HEAT SOAK TIMER MT1',
        '',
        MX,
        487,
        MR - MX,
        253,
        ['MODE1', 'MODE2', 'MODE3', 'MODE4', 'TIME1', 'TIME2', 'TIME3', 'TIME4'],
        ['COMP1', 'RATED', 'COMP2', 'INIT', 'COMP3', 'COMP4', 'TIME1', 'TIME2', 'TIME3', 'TIME4'],
        'A008',
        [
          [1173, 761, '(LMA578A)'],
          [1087, 790, 'DEF TW:1S'],
          [1087, 810, 'DEF K:0.0%'],
          [1087, 830, 'DEF HL:500.0'],
          [1107, 851, 'LL:0.0'],
          [1087, 872, 'DEF TW:1S'],
          [1087, 894, 'DEF K:0.0%'],
          [1087, 916, 'DEF HL:500.0'],
          [1107, 937, 'LL:0.0'],
          [1087, 958, 'DEF TW:1S'],
          [1087, 979, 'DEF K:0.0%'],
          [1213, 790, 'DEF HL:500.0'],
          [1235, 810, 'LL:0.0'],
          [1213, 830, 'DEF TW:1S'],
          [1235, 851, 'DEF K:0.0%'],
          [1235, 872, 'DEF HL:500.0'],
          [1235, 894, 'LL:0.0'],
          [1220, 916, 'HL:500.0'],
          [1220, 937, 'LL:0.0'],
          [1220, 958, 'HL:500.0'],
          [1240, 979, 'LL:0.0']
        ],
        [PL, PR]
      ]
    ],
    b,
    w,
    j,
    l,
    e,
    a,
    v,
    t
  });
})();
