/* TCA780 PLU TEST (331DM09788 page 201, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn:
   - PLU/BUG TEST MT1 A033 (TCA780_1, LMA290): PERM = NOT 001 of the AB output of A004 (back through BTR 016, the crossed circle),
     SIG = GEN.LOAD (TCA104), SET = SG A034 (K:-1.0MW). TEST1 / TEST2 / TEST3 through BTR 009 / 010 / 011 = PLU TEST (1) / (2) / (3),
     A1 / A2 / A3 (to TCA833); TEST through BTR 012 into TEST of A004.
   - PLU/BUG DIAGNOSIS MT1 A004 (TCA780_2, LMA291): OP1 / OP2 / OP3 = PLU OPERATED(1) / (2) / (3) (A13 / A14 / A15 of TCA053) through
     BTR 013 / 015 / 018. AB1 / AB2 / AB3 through BTR 014 / 017 / 019 = PLU(1) / (2) / (3) DETECTOR ABNORMAL, B1 / B2 / B3.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    b = [],
    c = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const WT = (key, ...pts) => w.push([key, pts, 1]);
  const HW = 28.76,
    X1 = 658,
    X2 = 1143,
    xA = 2085,
    xB = 2080;
  /* A033 inputs */
  W('mA004.AB', [1379, 942], [1419, 942], [1419, 617], [475, 617], [475, 268], [541 - HW, 268]);
  W('not001', [541 + HW, 268], [X1, 268]);
  WT('kLoad', [447, 331], [595, 331], [595, 290], [X1, 290]);
  WT('sgA034', [380 + HW, 394], [623, 394], [623, 312], [X1, 312]);
  /* A033 outputs */
  W('mA033.TEST1', [893, 268], [xA - 27, 268]);
  W('mA033.TEST2', [893, 290], [1478, 290], [1478, 374], [xA - 27, 374]);
  W('mA033.TEST3', [893, 312], [1424, 312], [1424, 481], [xA - 27, 481]);
  W('mA033.TEST', [893, 334], [1091, 334], [1091, 963], [X2, 963]);
  /* A004 inputs and outputs */
  W('iA13', [541, 878], [X2, 878]);
  W('iA14', [541, 940], [1038, 940], [1038, 899], [X2, 899]);
  W('iA15', [541, 1003], [1058, 1003], [1058, 922], [X2, 922]);
  W('mA004.AB1', [1379, 878], [xB - 27, 878]);
  W('mA004.AB2', [1379, 899], [1462, 899], [1462, 940], [xB - 27, 940]);
  W('mA004.AB3', [1379, 922], [1440, 922], [1440, 1003], [xB - 27, 1003]);
  [
    ['009', 1086, 268],
    ['010', 1053, 290],
    ['011', 1010, 312],
    ['012', 967, 334],
    ['013', 952, 878],
    ['015', 952, 940],
    ['018', 952, 1003],
    ['014', 1548, 878],
    ['017', 1548, 940],
    ['019', 1548, 1003],
    ['016', 1398, 942]
  ].forEach(([n, x, y]) => b.push(['btr' + n, 'o:BTR', n, x, y]));
  b.push(['not001', 'NOT', '001', 541, 279], ['sgA034', 'SG', 'A034', 380, 405, ['K:-1.0MW']], ['x', 'X', '', 475, 287]);
  const DEF1 = ['DEF TD:2.0S', 'DEF TD:5.0S', 'DEF TD:2.0S', 'DEF TD:5.0S', 'DEF TD:2.0S', 'DEF TD:5.0S', 'DEF K:0.0'];
  const DEF2 = ['DEF TP:15.0S', 'DEF TP:15.0S', 'DEF TP:15.0S', 'DEF TD:2.0S', 'DEF TD:2.0S'];
  const m = [
    [
      'mA033',
      'PLU/BUG TEST MT1',
      'TCA780_1',
      X1,
      234,
      235,
      171,
      ['PERM', 'SIG', 'SET', 'TEST1', 'TEST2', 'TEST3'],
      ['TEST1', 'TEST2', 'TEST3', 'TEST'],
      'A033',
      DEF1.map((s, i) => [711, Math.round(458 + 21.3 * i), s]),
      [
        [268, 290, 312, 334, 356, 378],
        [268, 290, 312, 334]
      ]
    ],
    [
      'mA004',
      'PLU/BUG DIAGNOSIS MT1',
      'TCA780_2',
      X2,
      842,
      236,
      147,
      ['OP1', 'OP2', 'OP3', 'OP', 'TEST'],
      ['AB1', 'AB2', 'AB3', 'AB'],
      'A004',
      [...DEF2.map((s, i) => [1143, Math.round(1044 + 21.3 * i), s]), [1293, 1044, 'DEF TD:2.0S'], [1293, 1065, 'DEF TD:2.0S']],
      [
        [878, 899, 922, 942, 963],
        [878, 899, 922, 942]
      ]
    ]
  ];
  [
    ['oA1', 'A1', 268],
    ['oA2', 'A2', 374],
    ['oA3', 'A3', 481]
  ].forEach(([k, n, y]) => c.push([k, 'out', n, xA, y, '', ['TCA833'], 0, 0]));
  [
    ['oB1', 'B1', 878],
    ['oB2', 'B2', 940],
    ['oB3', 'B3', 1003]
  ].forEach(([k, n, y]) => c.push([k, 'out', n, xB, y, '', ['-'], 0, 0]));
  [
    ['iA13', 'A13', 878],
    ['iA14', 'A14', 940],
    ['iA15', 'A15', 1003]
  ].forEach(([k, n, y]) => c.push([k, 'in', n, 514, y, '', ['TCA053'], 0, 1]));
  t.push(
    [383, 362, '(TCA104)', 1],
    [773, 428, '(LMA290)', 1],
    [1260, 1015, '(LMA291)', 1],
    [1803, 264, 'PLU TEST (1)'],
    [1803, 370, 'PLU TEST (2)'],
    [1803, 477, 'PLU TEST (3)'],
    [547, 874, 'PLU OPERATED(1)'],
    [547, 936, 'PLU OPERATED(2)'],
    [547, 999, 'PLU OPERATED(3)'],
    [1787, 874, 'PLU(1) DETECTOR ABNORMAL'],
    [1787, 936, 'PLU(2) DETECTOR ABNORMAL'],
    [1787, 999, 'PLU(3) DETECTOR ABNORMAL'],
    [233, 1530, 'CONTROLLER:'],
    [393, 1530, 'COMM+MD'],
    [617, 1503, 'TRIGGER  :'],
    [617, 1530, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA780',
    title: 'PLU TEST',
    page: 201,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [163, 84, 2226, 1547],
    k: [['kLoad', 214, 331, 'GEN.LOAD', 'ref']],
    c,
    b,
    m,
    w,
    t
  });
})();
