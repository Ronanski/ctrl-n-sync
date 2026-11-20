/* TCA586 HEAT SOAK TIME (331DM09788 page 145, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The HEAT SOAK TIMER block of the HP start (LMA578A) runs the 1800 / 2700 / 3600 rpm and the initial load heat soak timers started on
   TCA582 / TCA583, each time out of a function generator of the memorized metal temperature (FG *1..*4, MIN against DEGC, tables and graphs as
   printed). IP START picks the IP start timers of TCA585 instead: in the digital switches (DSW 001..004) for the heat soak elapsed signals to
   TCA582 / TCA511, in the analog switches (ASW 007..020) for the remaining hold times to the operator station (CRT TCA586_A1..A4) and the B outputs.
   The timer starts pick the remaining time of the running hold (ASW 025 / 023 / 026) for HEAT SOAK REMAINING TIME (CRT TCA586_A5, B5).
   The graphs are drawn as the drawing draws them, not to scale. */
(function () {
  if (typeof window === 'undefined') return;
  const R = Math.round,
    PL = Array.from({ length: 8 }, (_, i) => R(495 + 21.1 * i)) /* MODE1..4, TIME1..4 */,
    PR = Array.from({ length: 10 }, (_, i) =>
      R(493 + 21.3 * i)
    ) /* COMP1, RATED, COMP2, INIT, COMP3, COMP4, TIME1..4 */,
    MX = 967,
    MR = 1201,
    SX = 1428 /* the x of the DSW / ASW column */,
    c = [],
    b = [],
    w = [],
    t = [],
    j = [],
    d = [],
    l = [],
    e = [],
    a = [],
    v = [];
  /* the heat soak elapsed (IP) of TCA585 into the upper input of the DSW, the HP one (COMP1..4) into the lower, out to TCA582 / TCA511 */
  [
    ['A1', 207, '1800RPM HEAT SOAK ELAPSED', 'COMP1', 0, 1225, 'TCA582'],
    ['A2', 282, '2700RPM HEAT SOAK ELAPSED', 'COMP2', 2, 1247, 'TCA582'],
    ['A3', 357, '3600RPM HEAT SOAK ELAPSED', 'COMP3', 4, 1267, 'TCA582'],
    ['A4', 432, 'INITIAL LOAD HEAT SOAK ELAPSED', 'COMP4', 5, 1287, 'TCA511']
  ].forEach(([l2, y, name, pin, p, xr, sh], i) => {
    const key = 'dsw00' + (i + 1);
    c.push(['i' + l2, 'in', l2, 240, y, name, ['TCA585'], 0, 1]);
    b.push([key, 'DSW', '00' + (i + 1), SX, y + 9]);
    w.push(
      [
        'i' + l2,
        [
          [267, y],
          [SX - 30, y]
        ]
      ],
      [
        'mt1.' + pin,
        [
          [MR, PR[p]],
          [xr, PR[p]],
          [xr, y + 19],
          [SX - 30, y + 19]
        ]
      ],
      [
        key,
        [
          [SX + 30, y],
          [2114, y]
        ]
      ]
    );
    c.push(['o' + l2, 'out', l2, 2141, y, '', [sh], 0, 1]);
    if (i < 3) t.push([1697, y - 10, name]);
  });
  t.push([1697, 399, 'INITIAL LOAD'], [1697, 421, 'HEAT SOAK ELAPSED']);
  /* IP START down the switch column */
  const SEL = [
    [248, 270],
    [323, 345],
    [397, 420],
    [493, 515],
    [610, 632],
    [717, 739]
  ];
  w.push(
    [
      'kIp',
      [
        [513, 143],
        [SX, 143],
        [SX, 195]
      ]
    ],
    [
      'kIp',
      [
        [1375, 143],
        [1375, 823],
        [SX, 823],
        [SX, 844]
      ]
    ]
  );
  j.push([1375, 143]);
  SEL.forEach(([y, top]) => {
    w.push([
      'kIp',
      [
        [1375, y],
        [SX, y],
        [SX, top]
      ]
    ]);
    j.push([1375, y]);
  });
  t.push([395, 176, '(TCA166)']);
  /* the timer starts into MODE1..4; the 2700 / 3600 rpm and the initial load starts also pick the remaining time switches below */
  [
    ['iB11', 'B11', 495, '1800RPM HEAT SOAK TIMER START', 'TCA582', '005', 0, 0],
    ['iB3', 'B3', 547, '2700RPM HEAT SOAK TIMER START', 'TCA582', '008', 817, [1088, 1547, 1120]],
    ['iB4', 'B4', 600, '3600RPM HEAT SOAK TIMER START', 'TCA582', '010', 837, [1068, 1654, 1101]],
    ['iHold', 'A3', 653, 'INITIAL LOAD HOLD TIMER START', 'TCA583', '012', 858, [1048, 1762, 1082]]
  ].forEach(([key, l2, y, name, sh, btr, xr, sel], i) => {
    c.push([key, 'in', l2, 240, y, name, [sh], 0, 1]);
    b.push(['btr' + btr, 'o:BTR', btr, 520, y]);
    if (!xr) {
      w.push([
        key,
        [
          [267, y],
          [MX, y]
        ]
      ]);
      return;
    }
    const [ys, xs, top] = sel;
    w.push(
      [
        key,
        [
          [267, y],
          [xr, y]
        ]
      ],
      [
        key,
        [
          [MX, PL[i]],
          [xr, PL[i]],
          [xr, ys],
          [xs, ys],
          [xs, top]
        ]
      ]
    );
    j.push([xr, y]);
  });
  /* the memorized temperature through the four function generators into TIME1..4 */
  c.push(['iK', 'in', 'K', 240, 717, '', ['TCA500'], 0, 1]);
  b.push(['ftr014', 'o:FTR', '014', 520, 717]);
  w.push(
    [
      'iK',
      [
        [267, 717],
        [607, 717]
      ],
      1
    ],
    [
      'iK',
      [
        [581, 717],
        [581, 907],
        [607, 907]
      ],
      1
    ]
  );
  t.push([283, 667, 'MEMORIZED TEMP.'], [283, 687, 'FOR HEAT SOAK TIMER'], [283, 707, '(HP START)']);
  [
    ['A015', 717, 880, '*1', '(1800RPM', 'HEAT SOAK)'],
    ['A017', 780, 903, '*2', '(2700RPM', 'HEAT SOAK)'],
    ['A019', 843, 923, '*3', '(3600RPM', 'HEAT SOAK)'],
    ['A021', 907, 947, '*4', '(INIT.', 'LOAD HOLD)']
  ].forEach(([no, y, xr, star, t1, t2], i) => {
    const key = 'fg' + no;
    b.push([key, 'FG', no, 637, y + 11]);
    if (i === 1 || i === 2) {
      w.push([
        'iK',
        [
          [581, y],
          [607, y]
        ],
        1
      ]);
      j.push([581, y]);
    }
    w.push([
      key,
      [
        [667, y],
        [xr, y],
        [xr, PL[4 + i]],
        [MX, PL[4 + i]]
      ],
      1
    ]);
    t.push([678, y - 14, star], [703, y - 32, t1], [703, y - 12, t2]);
  });
  j.push([581, 717]);
  /* the remaining hold times: IP (D1..D4 of TCA585) into the upper input of the ASW, HP (TIME1..4) into the lower */
  [
    ['D1', 801, 'LOW SPD HLD REMAIN(IP)', 560, 960, 1308, 527, 'TIME1', 6, 1330],
    ['D2', 876, 'MED SPD HLD REMAIN(IP)', 539, 981, 1328, 644, 'TIME2', 7, 1287],
    ['D3', 951, 'RATED SPD HLD REMAIN(IP)', 517, 1003, 1350, 751, 'TIME3', 8, 1263],
    ['D4', 1025, 'INITIAL HLD REMAIN(IP)', 0, 1025, 1369, 856, 'TIME4', 9, 1242]
  ].forEach(([l2, y, name, xd, yd, xu, yi, pin, p, xt]) => {
    c.push(['i' + l2, 'in', l2, 240, y, name, ['TCA585'], 0, 1]);
    w.push(
      [
        'i' + l2,
        xd
          ? [
              [267, y],
              [xd, y],
              [xd, yd],
              [xu, yd],
              [xu, yi],
              [SX - 30, yi]
            ]
          : [
              [267, y],
              [xu, y],
              [xu, yi],
              [SX - 30, yi]
            ],
        1
      ],
      [
        'mt1.' + pin,
        [
          [MR, PR[p]],
          [xt, PR[p]],
          [xt, yi + 19],
          [SX - 30, yi + 19]
        ],
        1
      ]
    );
  });
  /* the switch outputs: [ASW, its output y, CRT, line name, FTR, its line y, B, the x of the FTR branch] */
  [
    ['007', 527, 'A1', 'LOW SPD HLD REMAIN', '009', 579, 'B1', 1627, 1693],
    ['011', 644, 'A2', 'MED SPD HLD REMAIN', '013', 695, 'B2', 1627, 1693],
    ['016', 751, 'A3', 'RATED SPD HLD REMAIN', '018', 802, 'B3', 1627, 1693],
    ['020', 856, 'A4', 'INITIAL HLD REMAIN', '022', 910, 'B4', 1710, 1777]
  ].forEach(([no, y, ca, name, ftr, yf, lb, xf, xn]) => {
    const key = 'asw' + no;
    b.push([key, 'ASW', no, SX, y + 9]);
    w.push(
      [
        key,
        [
          [SX + 30, y],
          [2017, y]
        ],
        1
      ],
      [
        key,
        [
          [xf, y],
          [xf, yf],
          [2025, yf]
        ],
        1
      ]
    );
    j.push([xf, y]);
    d.push(['crt' + ca, 2052, y, 'out', 'TCA586_' + ca, 'S', '#1C']);
    b.push(['ftr' + ftr, 'o:FTR', ftr, xf + 31, yf]);
    c.push(['o' + lb, 'out', lb, 2052, yf, '', ['-'], 1, 3]);
    t.push([xn, y - 10, name], [xn + 4, yf - 10, name]);
  });
  /* the remaining time of the running hold: ASW 025 (2700 rpm start), 023 (3600 rpm start), 026 (initial load start) */
  b.push(
    ['asw025', 'ASW', '025', 1547, 1141],
    ['asw023', 'ASW', '023', 1654, 1122],
    ['asw026', 'ASW', '026', 1762, 1103]
  );
  w.push(
    [
      'asw007',
      [
        [1477, 527],
        [1477, 1151],
        [1517, 1151]
      ],
      1
    ],
    [
      'asw011',
      [
        [1497, 644],
        [1497, 1132],
        [1517, 1132]
      ],
      1
    ],
    [
      'asw016',
      [
        [1604, 751],
        [1604, 1113],
        [1624, 1113]
      ],
      1
    ],
    [
      'asw020',
      [
        [1710, 910],
        [1710, 1094],
        [1732, 1094]
      ],
      1
    ],
    [
      'asw025',
      [
        [1577, 1132],
        [1624, 1132]
      ],
      1
    ],
    [
      'asw023',
      [
        [1684, 1113],
        [1732, 1113]
      ],
      1
    ],
    [
      'asw026',
      [
        [1792, 1094],
        [2017, 1094]
      ],
      1
    ],
    [
      'asw026',
      [
        [1815, 1094],
        [1815, 1165],
        [2025, 1165]
      ],
      1
    ]
  );
  j.push([1477, 527], [1497, 644], [1604, 751], [1710, 910], [1815, 1094]);
  d.push(['crtA5', 2052, 1094, 'out', 'TCA586_A5', 'S', '#1C']);
  b.push(['ftr024', 'o:FTR', '024', 1835, 1165]);
  c.push(['oB5', 'out', 'B5', 2052, 1165, '', ['-'], 1, 3]);
  t.push(
    [1859, 1059, 'HEAT SOAK'],
    [1859, 1081, 'REMAINING TIME'],
    [1859, 1133, 'HEAT SOAK'],
    [1859, 1155, 'REMAINING TIME']
  );
  /* the four function generators: graph (as drawn) and table */
  const G = [
    {
      o: [332, 1270],
      end: 503,
      ys: [
        [155, 1152],
        [95, 1195],
        [35, 1237]
      ],
      xs: [
        [150, 389],
        [190, 409],
        [200, 432],
        [280, 473]
      ],
      cv: [
        [332, 1152],
        [389, 1152],
        [399, 1195],
        [409, 1195],
        [432, 1237],
        [473, 1237],
        [483, 1270]
      ],
      dh: [
        [1195, 399],
        [1237, 432]
      ],
      dv: [
        [389, 1152],
        [399, 1195],
        [409, 1195],
        [432, 1237],
        [473, 1237]
      ],
      degc: 470,
      tb: [339, 372, 435, 500, 'FG *1'],
      d: [
        ['0.00', '155.00'],
        ['150.00', '155.00'],
        ['160.00', '95.00'],
        ['190.00', '95.00'],
        ['200.00', '35.00'],
        ['280.00', '35.00'],
        ['290.00', '0.00'],
        ['600.00', '0.00']
      ]
    },
    {
      o: [593, 1270],
      end: 760,
      ys: [
        [50, 1152],
        [30, 1195],
        [10, 1237]
      ],
      xs: [
        [150, 643],
        [190, 663],
        [200, 685],
        [280, 728]
      ],
      cv: [
        [593, 1152],
        [643, 1152],
        [653, 1195],
        [663, 1195],
        [685, 1237],
        [728, 1237],
        [739, 1270]
      ],
      dh: [
        [1195, 653],
        [1237, 685]
      ],
      dv: [
        [643, 1152],
        [653, 1195],
        [663, 1195],
        [685, 1237],
        [728, 1237]
      ],
      degc: 733,
      tb: [595, 629, 687, 747, 'FG *2'],
      d: [
        ['0.00', '50.00'],
        ['150.00', '50.00'],
        ['160.00', '30.00'],
        ['190.00', '30.00'],
        ['200.00', '10.00'],
        ['280.00', '10.00'],
        ['290.00', '0.00'],
        ['600.00', '0.00']
      ]
    },
    {
      o: [859, 1270],
      end: 1027,
      ys: [
        [100, 1152],
        [65, 1195],
        [25, 1237]
      ],
      xs: [
        [150, 910],
        [190, 931],
        [200, 952],
        [280, 995]
      ],
      cv: [
        [859, 1152],
        [910, 1152],
        [920, 1195],
        [931, 1195],
        [952, 1237],
        [995, 1237],
        [1004, 1270]
      ],
      dh: [
        [1195, 920],
        [1237, 952]
      ],
      dv: [
        [910, 1152],
        [920, 1195],
        [931, 1195],
        [952, 1237],
        [995, 1237]
      ],
      degc: 991,
      tb: [857, 890, 950, 1008, 'FG *3'],
      d: [
        ['0.00', '100.00'],
        ['150.00', '100.00'],
        ['160.00', '65.00'],
        ['190.00', '65.00'],
        ['200.00', '25.00'],
        ['280.00', '25.00'],
        ['290.00', '0.00'],
        ['600.00', '0.00']
      ]
    },
    {
      o: [1113, 1270],
      end: 1323,
      ys: [
        [50, 1152],
        [20, 1216]
      ],
      xs: [
        [280, 1187],
        [290, 1219],
        [395, 1250],
        [405, 1280]
      ],
      cv: [
        [1113, 1152],
        [1187, 1152],
        [1219, 1216],
        [1250, 1216],
        [1280, 1270]
      ],
      dh: [[1216, 1219]],
      dv: [
        [1187, 1152],
        [1219, 1216],
        [1250, 1216]
      ],
      degc: 1263,
      tb: [1109, 1142, 1202, 1260, 'FG *4'],
      d: [
        ['0.00', '50.00'],
        ['280.00', '50.00'],
        ['290.00', '20.00'],
        ['395.00', '20.00'],
        ['405.00', '0.00'],
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
        [ox, 1115]
      ],
      [
        [ox, oy],
        [g.end, oy]
      ]
    );
    t.push([ox + 2, 1100, 'MIN', 1], [ox - 6, oy + 12, '0', 1], [g.degc, 1302, 'DEGC', 1]);
    g.ys.forEach(([s, y]) => {
      l.push([
        [ox - 5, y],
        [ox, y]
      ]);
      t.push([ox - 10, y, String(s), 2]);
    });
    /* labels printed close together (150 190 200) stand apart from their ticks as on the drawing */
    g.xs.forEach(([s, x], k) => {
      const nx = g.xs[k + 1],
        px = g.xs[k - 1],
        cn = nx && nx[1] - x < 34,
        cp = px && x - px[1] < 34,
        al = cn && !cp ? 2 : cp && !cn ? 0 : 1;
      t.push([al === 2 ? x + 3 : al === 0 ? x - 3 : x, oy + 16, String(s), al]);
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
    const [x0, x1, x2, x3, name] = g.tb,
      y0 = 1313,
      yh = 1335,
      rows = Array.from({ length: 9 }, (_, k) => yh + 20 * k);
    t.push([x0 + 10, 1305, name]);
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
    t.push([(x0 + x1) / 2, 1324, 'NO.', 1], [(x1 + x2) / 2, 1324, 'Xn(DEGC)', 1], [(x2 + x3) / 2, 1324, 'Yn(MIN)', 1]);
    g.d.forEach(([xs, ys], k) => {
      const y = yh + 20 * k + 10;
      t.push([(x0 + x1) / 2, y, String(k), 1], [(x1 + x2) / 2, y, xs, 1], [(x2 + x3) / 2, y, ys, 1]);
    });
  });
  t.push(
    [967, 452, 'HP START'],
    [230, 1528, 'CONTROLLER:'],
    [400, 1528, 'COMM+MD'],
    [620, 1512, 'TRIGGER  :'],
    [620, 1532, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA586',
    title: 'HEAT SOAK TIME',
    page: 145,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    /* no live: the engine holds none of the heat soak timers of this sheet */
    k: [['kIp', 280, 143, 'IP START', 'ref']],
    c,
    d,
    m: [
      [
        'mt1',
        'HEAT SOAK TIMER MT1',
        '',
        MX,
        462,
        MR - MX,
        255,
        ['MODE1', 'MODE2', 'MODE3', 'MODE4', 'TIME1', 'TIME2', 'TIME3', 'TIME4'],
        ['COMP1', 'RATED', 'COMP2', 'INIT', 'COMP3', 'COMP4', 'TIME1', 'TIME2', 'TIME3', 'TIME4'],
        'A006',
        [
          [1043, 735, '(LMA578A)'],
          [966, 755, 'DEF TW:1S'],
          [966, 775, 'DEF K:0.0%'],
          [966, 795, 'DEF HL:500.0'],
          [987, 816, 'LL:0.0'],
          [966, 837, 'DEF TW:1S'],
          [966, 859, 'DEF K:0.0%'],
          [966, 880, 'DEF HL:500.0'],
          [987, 902, 'LL:0.0'],
          [966, 923, 'DEF TW:1S'],
          [966, 945, 'DEF K:0.0%'],
          [1105, 755, 'DEF HL:500.0'],
          [1126, 775, 'LL:0.0'],
          [1105, 795, 'DEF TW:1S'],
          [1105, 816, 'DEF K:0.0%'],
          [1105, 837, 'DEF HL:500.0'],
          [1126, 859, 'LL:0.0'],
          [1143, 880, 'HL:500.0'],
          [1143, 902, 'LL:0.0'],
          [1143, 923, 'HL:500.0'],
          [1143, 945, 'LL:0.0']
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
