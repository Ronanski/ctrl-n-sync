/* TCE060 ANALOG INPUT SIGNAL DIAGNOSTICS(1) (331DM09784 page 28, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. HP turbine exhaust steam pressure (A), (B), (C): each is read by the three protection controllers and checked by one TMR AI
   DIAGNOSTICS block; the three results go to TRIPLE DETECTOR2 (the value) and to 2OO3 (abnormal). The three groups are drawn the same way. */
(function () {
  if (typeof window === 'undefined') return;
  const F = [167, 81, 2228, 1545],
    u = (F[2] - F[0]) / 1000,
    c = [],
    b = [],
    m = [],
    w = [],
    t = [];
  /* [letter, top of the block, left of the block, x of the connectors, sheet number of the inputs, block number, first mark number list] */
  const G = [
    ['A', 123, 885, 307, '070', 'A002', ['001', '005', '007', '009', '010', '011']],
    ['B', 570, 882, 304, '072', 'A020', ['019', '022', '023', '024', '025', '026']],
    ['C', 1017, 880, 302, '074', 'A030', ['029', '031', '032', '033', '034', '035']]
  ];
  const L = ['SIG1', 'ERR1', 'SIG2', 'ERR2', 'SIG3', 'ERR3', 'HL', 'LL', 'DEV', 'SIM'],
    R = ['OUT', '', 'ABN', '', 'DEV E', '', 'ERR', '', '', ''],
    pin = (top, i) => Math.round(top + 15 * u + (i + 0.5) * ((381 - 30 * u) / 10)),
    BEND = [0, 659, 680, 701, 722, 743];
  const P = G.map(([ch, top, bx, cx, sh, no, marks], g) => {
    const k = 'tmr' + (g + 1),
      p = i => pin(top, i);
    m.push([k, 'TMR AI DIAGNOSTICS', 'nPT-CRn901-' + (g + 1), bx, top, 405, 381, L, R, no, [
      [bx + 90, top + 225, 'TP:1.0'],
      [bx + 90, top + 246, 'TP:1.0'],
      [bx + 90, top + 267, 'TP:1.0'],
      [bx + 84, top + 288, 'DELAY TP:3.0s'],
      [bx + 84, top + 310, 'DELAY TP:3.0s'],
      [bx + 84, top + 331, 'DELAY TP:3.0s'],
      [bx + 105, top + 404, '(LME111)'],
      [bx + 217, top + 404, '(LME111A)']
    ]]);
    for (let i = 0; i < 6; i++) {
      const sig = i % 2 === 0,
        key = 'i' + ch + (i + 1),
        y = p(0) + Math.round(i * 53.3),
        n = Math.floor(i / 2) + 1;
      c.push([key, 'in', sig ? 'D1' : 'E1', cx, y, 'STEAM PRESS.(' + ch + ')' + (sig ? '' : ' INPUT ERR'), ['TCP' + n + sh], 1]);
      t.push([cx + 33, y - 32, 'HP TURBINE EXHAUST']);
      b.push(['mk' + ch + (i + 1), sig ? 'o:FTR' : 'o:BTR', marks[i], cx + 321, y]);
      w.push([key, i ? [[cx + 27, y], [BEND[i], y], [BEND[i], p(i)], [bx, p(i)]] : [[cx + 27, y], [bx, y]], sig ? 1 : 0]);
    }
    return { k, p, bx };
  });
  const [g1, g2, g3] = P;
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'TCE060',
    title: 'ANALOG INPUT SIGNAL DIAGNOSTICS(1)',
    page: 28,
    ctl: 'EHG+MD',
    cycle: 30,
    f: F,
    c: [
      ...c,
      ['oA', 'out', 'A', 2077, 170, '', ['-']],
      ['oA1', 'out', 'A1', 2076, 264, '', ['TCA686', 'TCA825'], 1],
      ['oB', 'out', 'B', 2075, 477, '', ['-']],
      ['oB1', 'out', 'B1', 2074, 573, '', ['-'], 1],
      ['oC1', 'out', 'C1', 2083, 796, '', ['TCT200'], 1],
      ['oC2', 'out', 'C2', 2082, 870, '', ['TCT200'], 1],
      ['oC3', 'out', 'C3', 2082, 945, '', ['TCT200'], 1]
    ],
    d: [
      ['crtPv', 2076, 360, 'out', 'nPT-CRn901_PV', 'S', '#1C'],
      ['crtAbn', 2073, 679, 'out', 'nPT-CRn901_PVC', 'S', '#1C']
    ],
    r: [
      ['td2', 1481, 136, 235, 128, ''],
      ['v2o3', 1564, 445, 86, 107, '']
    ],
    m,
    b: [
      ...b,
      ['sg012', 'SG', 'A012', 562, 478, ['K:51.0kg/cm2g']],
      ['sg017', 'SG', 'A017', 563, 552, ['K:-2.5kg/cm2g']],
      ['sg027', 'SG', 'A027', 561, 922, ['K:10.0kg/cm2g']],
      ['sg036', 'SG', 'B036', 558, 1404, ['K:4.0kg/cm2g']],
      ['ftr013', 'o:FTR', '013', 732, 467],
      ['ftr018', 'o:FTR', '018', 731, 541],
      ['ftr028', 'o:FTR', '028', 731, 911],
      ['ftr037', 'o:FTR', '037', 632, 1393],
      ['ftr038', 'o:FTR', '038', 1374, 170],
      ['btr040', 'o:BTR', '040', 1374, g1.p(2)],
      ['ftr042', 'o:FTR', '042', 1371, g2.p(0)],
      ['btr043', 'o:BTR', '043', 1371, g2.p(2)],
      ['ftr044', 'o:FTR', '044', 1370, 988],
      ['ftr045', 'o:FTR', '045', 1369, g3.p(0)],
      ['btr046', 'o:BTR', '046', 1369, g3.p(2)],
      ['ftr039', 'o:FTR', '039', 1746, 170],
      ['ftr004', 'o:FTR', '004', 1821, 170],
      ['ftr006', 'o:FTR', '006', 1820, 264],
      ['ftr008', 'o:FTR', '008', 1819, 360],
      ['btr041', 'o:BTR', '041', 1744, 477],
      ['btr015', 'o:BTR', '015', 1818, 477],
      ['btr016', 'o:BTR', '016', 1817, 573],
      ['btr021', 'o:BTR', '021', 1816, 679]
    ],
    w: [
      ...w,
      /* the limits and the simulation value, the same for the three blocks */
      ['sg012', [[591, 467], [775, 467]], 1],
      ['sg012', [[775, g1.p(6)], [775, g3.p(6)], [g3.bx, g3.p(6)]], 1],
      ['sg012', [[775, g1.p(6)], [g1.bx, g1.p(6)]], 1],
      ['sg012', [[775, g2.p(6)], [g2.bx, g2.p(6)]], 1],
      ['sg017', [[592, 541], [796, 541]], 1],
      ['sg017', [[796, g1.p(7)], [796, g3.p(7)], [g3.bx, g3.p(7)]], 1],
      ['sg017', [[796, g1.p(7)], [g1.bx, g1.p(7)]], 1],
      ['sg017', [[796, g2.p(7)], [g2.bx, g2.p(7)]], 1],
      ['sg027', [[590, 911], [817, 911]], 1],
      ['sg027', [[817, g1.p(8)], [817, g3.p(8)], [g3.bx, g3.p(8)]], 1],
      ['sg027', [[817, g1.p(8)], [g1.bx, g1.p(8)]], 1],
      ['sg027', [[817, g2.p(8)], [g2.bx, g2.p(8)]], 1],
      ['sg027', [[817, 988], [1459, 988], [1459, 233], [1481, 233]], 1],
      ['sg036', [[587, 1393], [838, 1393], [838, g1.p(9)], [g1.bx, g1.p(9)]], 1],
      ['sg036', [[838, g2.p(9)], [g2.bx, g2.p(9)]], 1],
      ['sg036', [[838, g3.p(9)], [g3.bx, g3.p(9)]], 1],
      /* the three values to TRIPLE DETECTOR2 and to the turbine supervisory sheets */
      ['tmr1.OUT', [[1290, 170], [1481, 170]], 1],
      ['tmr1.OUT', [[1321, 170], [1321, 796], [2056, 796]], 1],
      ['tmr2.OUT', [[1287, g2.p(0)], [1414, g2.p(0)], [1414, 191], [1481, 191]], 1],
      ['tmr2.OUT', [[1339, g2.p(0)], [1339, 870], [2055, 870]], 1],
      ['tmr3.OUT', [[1285, g3.p(0)], [1550, g3.p(0)], [1550, 945], [2055, 945]], 1],
      ['tmr3.OUT', [[1436, g3.p(0)], [1436, 212], [1481, 212]], 1],
      /* abnormal: two out of three */
      ['tmr1.ABN', [[1290, g1.p(2)], [1395, g1.p(2)], [1395, 477], [1564, 477]]],
      ['tmr2.ABN', [[1287, g2.p(2)], [1478, g2.p(2)], [1478, 499], [1564, 499]]],
      ['tmr3.ABN', [[1285, g3.p(2)], [1500, g3.p(2)], [1500, 520], [1564, 520]]],
      ['td2', [[1716, 170], [2050, 170]], 1],
      ['td2', [[1778, 170], [1778, 360], [2041, 360]], 1],
      ['td2', [[1778, 264], [2049, 264]], 1],
      ['v2o3', [[1650, 477], [2048, 477]]],
      ['v2o3', [[1775, 477], [1775, 679], [2038, 679]]],
      ['v2o3', [[1775, 573], [2047, 573]]]
    ],
    t: [
      ...t,
      [1487, 157, 'TRIPLE DETECTOR2'],
      [1487, 178, 'IN A'],
      [1487, 199, 'IN B'],
      [1487, 221, 'IN C'],
      [1487, 242, 'DEV'],
      [1678, 178, 'OUT'],
      [1678, 199, 'DEV'],
      [1578, 261, 'A003'],
      [1561, 287, '(LME113)'],
      [1517, 327, 'TP:1.0'],
      [1517, 348, 'TP:1.0'],
      [1517, 370, 'TP:1.0'],
      [1585, 467, '2OO3'],
      [1569, 488, 'IN1'],
      [1612, 488, 'OUT'],
      [1569, 510, 'IN2'],
      [1569, 531, 'IN3'],
      [1595, 550, '014'],
      [1569, 576, '(LME120)'],
      [1848, 143, 'HP TURBINE EXHAUST'],
      [1848, 165, 'STEAM PRESS.'],
      [1847, 239, 'HP TURBINE EXHAUST'],
      [1847, 260, 'STEAM PRESS.'],
      [1846, 335, 'HP TURBINE EXHAUST'],
      [1846, 356, 'STEAM PRESS.'],
      [1846, 452, 'HP TURBINE EXHAUST'],
      [1846, 473, 'STEAM PRESS. ABN.'],
      [1845, 548, 'HP TURBINE EXHAUST'],
      [1845, 569, 'STEAM PRESS. ABN.'],
      [1844, 654, 'HP TURBINE EXHAUST'],
      [1844, 675, 'STEAM PRESS. ABN.'],
      [236, 1525, 'CONTROLLER:'],
      [397, 1525, 'EHG+MD'],
      [658, 1498, 'TRIGGER  :'],
      [658, 1525, 'CYCLE(ms):30']
    ]
  });
})();
