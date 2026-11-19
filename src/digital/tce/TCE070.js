/* TCE070 ANALOG INPUT SIGNAL DIAGNOSTICS(11) (331DM09784 page 38, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. Generator MW (A) and (B): each read by the three protection controllers and checked by one TMR AI DIAGNOSTICS block; the two
   results go to DUP AI DIAGNOSTICS, which gives GEN. MW and GEN. MW ABN.
   The deviation limit (SG A027) has the name of connector C printed over it: "K:4?.0MW" is read from the page rendered three times larger. On
   every sheet of this kind the deviation limit is 20 % of the range (TCE060 50: 10.0; TCE061 5: 1.0; TCE062 250: 50.0; TCE064 150: 30.0; TCE067
   700: 140.0; TCE068 500: 100.0; TCE069 150: 30.0), and here the high and low limits 244.8 and -12.0 give the range 0 to 240 MW (range plus 2 %,
   range less 5 %, as on those sheets), so the value is 48.0. */
(function () {
  if (typeof window === 'undefined') return;
  const F = [165, 76, 2228, 1540],
    u = (F[2] - F[0]) / 1000,
    pin = (top, i) => Math.round(top + 15 * u + (i + 0.5) * ((381 - 30 * u) / 10)),
    c = [],
    b = [],
    w = [],
    t = [];
  const TMR = ['SIG1', 'ERR1', 'SIG2', 'ERR2', 'SIG3', 'ERR3', 'HL', 'LL', 'DEV', 'SIM'],
    OUT = ['OUT', '', 'ABN', '', 'DEV E', '', 'ERR', '', '', ''],
    notes = (x, y) => [
      [x + 3, y + 429, 'TP:1.0'],
      [x + 3, y + 450, 'TP:1.0'],
      [x + 3, y + 472, 'TP:1.0'],
      [x - 3, y + 493, 'DELAY TP:3.0s'],
      [x - 3, y + 515, 'DELAY TP:3.0s'],
      [x - 3, y + 536, 'DELAY TP:3.0s'],
      [x + 105, y + 406, '(LME111)'],
      [x + 219, y + 406, '(LME111A)']
    ];
  /* [letter, top of the block, left of the block, x of the connectors, y of the six inputs, x of the corners of inputs 2 ~ 6, sheet number, marks] */
  const G = [
    ['A', 116, 713, 275, [163, 237, 312, 386, 461, 535], [500, 520, 541, 562, 583], '070', ['001', '005', '007', '009', '010', '011']],
    ['B', 680, 709, 270, [727, 801, 876, 950, 1024, 1099], [495, 516, 537, 557, 578], '072', ['019', '022', '023', '024', '025', '026']]
  ];
  const P = G.map(([ch, top, bx, cx, Y, BX, sh, marks]) => {
    const p = i => pin(top, i);
    for (let i = 0; i < 6; i++) {
      const sig = i % 2 === 0,
        key = 'i' + ch + (i + 1),
        y = Y[i];
      c.push([key, 'in', sig ? 'D6' : 'E6', cx, y, sig ? 'GEN. MW(' + ch + ')' : 'INPUT ERR', ['TCP' + (Math.floor(i / 2) + 1) + sh], 1]);
      if (!sig) t.push([cx + 33, y - 32, 'GEN. MW(' + ch + ')']);
      b.push(['mk' + ch + (i + 1), sig ? 'o:FTR' : 'o:BTR', marks[i], cx + 192, y]);
      w.push([key, i ? [[cx + 27, y], [BX[i - 1], y], [BX[i - 1], p(i)], [bx, p(i)]] : [[cx + 27, y], [bx, y]], sig ? 1 : 0]);
    }
    return { p, bx };
  });
  const [A, B] = P,
    D = i => pin(116, i) /* the pins of DUP AI DIAGNOSTICS */,
    DX = 1386;
  /* the limits and the simulation value: one line each, to the two blocks at the left and to the block at the right */
  [
    ['sg012', 6, 600, 1163, 1291],
    ['sg017', 7, 621, 1237, 1312],
    ['sg027', 8, 642, 1322, 1340],
    ['iSim', 9, 662, 1407, 1362]
  ].forEach(([k, i, x, y, xr]) => {
    w.push(
      [k, [[k === 'iSim' ? 295 : 426, y], [xr, y], [xr, D(i)], [DX, D(i)]], 1],
      [k, [[x, y], [x, A.p(i)], [A.bx, A.p(i)]], 1],
      [k, [[x, B.p(i)], [B.bx, B.p(i)]], 1]
    );
  });
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'TCE070',
    title: 'ANALOG INPUT SIGNAL DIAGNOSTICS(11)',
    page: 38,
    ctl: 'EHG+MD',
    cycle: 30,
    f: F,
    c: [
      ...c,
      ['iSim', 'in', 'C', 268, 1407, 'GENERATOR LOAD', ['TCE500']],
      ['oA', 'out', 'A', 2100, 163, '', []],
      ['oA1', 'out', 'A1', 2098, 281, '', ['TCA104', 'TCA738', 'TCA768', 'TCA825'], 1],
      ['oB', 'out', 'B', 2095, 526, '', []],
      ['oB1', 'out', 'B1', 2094, 622, '', ['-'], 1],
      ['oC1', 'out', 'C1', 2094, 674, '', ['TCT213'], 1],
      ['oC2', 'out', 'C2', 2093, 727, '', ['TCT213'], 1]
    ],
    m: [
      ['tmrA', 'TMR AI DIAGNOSTICS', 'TCE070-A1A', 713, 116, 405, 381, TMR, OUT, 'A002', notes(713, 116)],
      ['tmrB', 'TMR AI DIAGNOSTICS', 'TCE070-A1B', 709, 680, 405, 381, TMR, OUT, 'A020', notes(709, 680)],
      [
        'dup',
        'DUP AI DIAGNOSTICS',
        'TCE070-A1',
        DX,
        116,
        404,
        381,
        ['SIG1', 'ERR1', 'SIG2', 'ERR2', 'S', 'M', 'HL', 'LL', 'DEV', 'SIM'],
        ['OUT', '', 'ABN', '', 'DEV E', '', 'ERR', '', 'I-ERR', ''],
        'A044',
        [
          [1389, 546, 'K:-0.01'],
          [1389, 568, 'TP:3.0'],
          [1383, 589, 'DELAY TP:3.0s'],
          [1383, 610, 'DELAY TP:3.0s'],
          [1389, 632, 'K:2'],
          [1490, 523, '(LME114)'],
          [1602, 523, '(LME114A)']
        ]
      ]
    ],
    b: [
      ...b,
      ['sg012', 'SG', 'A012', 397, 1174, ['K:244.8MW']],
      ['sg017', 'SG', 'A017', 397, 1248, ['K:-12.0MW']],
      ['sg027', 'SG', 'A027', 397, 1333, ['K:48.0MW']],
      ['sgw045', 'SGW', 'A045', 1063, 546, ['K:2']],
      ['sg046', 'SG', 'A046', 1062, 622, ['K:24.0MW']],
      ['ftr013', 'o:FTR', '013', 557, 1163],
      ['ftr018', 'o:FTR', '018', 556, 1237],
      ['ftr028', 'o:FTR', '028', 556, 1322],
      ['ftr037', 'o:FTR', '037', 555, 1407],
      ['ftr038', 'o:FTR', '038', 1205, 163],
      ['btr040', 'o:BTR', '040', 1205, A.p(2)],
      ['ftr042', 'o:FTR', '042', 1199, 727],
      ['btr043', 'o:BTR', '043', 1199, B.p(2)],
      ['ftr047', 'o:FTR', '047', 1179, 611],
      ['ftr004', 'o:FTR', '004', 1907, 163],
      ['ftr006', 'o:FTR', '006', 1906, 281],
      ['btr015', 'o:BTR', '015', 1903, 526],
      ['btr016', 'o:BTR', '016', 1902, 622]
    ],
    w: [
      ...w,
      /* the two values to DUP AI DIAGNOSTICS, and out by C1 and C2 */
      ['tmrA.OUT', [[1118, 163], [DX, 163]], 1],
      ['tmrA.OUT', [[1163, 163], [1163, 674], [2067, 674]], 1],
      ['tmrA.ABN', [[1118, A.p(2)], [1236, A.p(2)], [1236, D(1)], [DX, D(1)]]],
      ['tmrB.OUT', [[1114, 727], [2066, 727]], 1],
      ['tmrB.OUT', [[1252, 727], [1252, D(2)], [DX, D(2)]], 1],
      ['tmrB.ABN', [[1114, B.p(2)], [1273, B.p(2)], [1273, D(3)], [DX, D(3)]]],
      ['sgw045', [[1092, 535], [1212, 535], [1212, D(4)], [DX, D(4)]], 1],
      ['sg046', [[1091, 611], [1233, 611], [1233, D(5)], [DX, D(5)]], 1],
      ['dup.OUT', [[1790, 163], [2073, 163]], 1],
      ['dup.OUT', [[1864, 163], [1864, 281], [2071, 281]], 1],
      ['dup.ABN', [[1790, D(2)], [1842, D(2)], [1842, 622], [2067, 622]]],
      ['dup.ABN', [[1842, 526], [2068, 526]]]
    ],
    t: [
      ...t,
      [300, 1380, 'SIMULATOR'],
      [1934, 159, 'GEN. MW'],
      [1933, 277, 'GEN. MW'],
      [1930, 522, 'GEN. MW ABN.'],
      [1929, 618, 'GEN. MW ABN.'],
      [2135, 183, '(TCE179)'],
      [2135, 199, '(TCE194)'],
      [2135, 215, '(TCE195)'],
      [2135, 236, '(TCE360)'],
      [2135, 252, '(TCE500)'],
      [2059, 204, '(TCE220)'],
      [2131, 545, '(TCE180)'],
      [2131, 561, '(TCE184)'],
      [2131, 577, '(TCE194)'],
      [2131, 593, '(TCE360)'],
      [2055, 561, '(TCE183)'],
      [2055, 577, '(TCE191)'],
      [1980, 561, '(TCE220)'],
      [233, 1518, 'CONTROLLER:'],
      [395, 1518, 'EHG+MD'],
      [656, 1491, 'TRIGGER  :'],
      [656, 1518, 'CYCLE(ms):30']
    ]
  });
})();
