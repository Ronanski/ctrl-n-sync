/* TCA781 EOS TEST (331DM09788 page 202, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn (the EOS twin of TCA780):
   - PLU/BUG TEST MT1 A033 (TCA781_1, LMA290): PERM = NOT 001 of the AB output of A004 (back through BTR 016, the crossed circle),
     SIG = TURBINE SPEED (TCA104) through FTR 035, SET = SG A034 (K:3540rpm). TEST1 / TEST2 / TEST3 through BTR 009 / 010 / 011 =
     EOS TEST (1) / (2) / (3), A1 / A2 / A3 (to TCA833); TEST through BTR 012 into TEST of A004.
   - PLU/BUG DIAGNOSIS MT1 A004 (TCA781_2, LMA291): OP1 / OP2 / OP3 = EOS(1) / (2) / (3) OPERATED (A10 / A11 / A12 of TCA053) through
     BTR 013 / 015 / 018. AB1 / AB2 / AB3 through BTR 014 / 017 / 019 = EOS(1) / (2) / (3) DETECTOR ABNORMAL, B1 / B2 / B3.
   - Two of three: A 040 / 042 / 043 of OP1-OP2, OP1-OP3, OP2-OP3 into OR 041 = EOS OPERATED, CRT TCA781_4 and C1 (to TCE114);
     A 036 / 038 / 039 of AB1-AB2, AB1-AB3, AB2-AB3 into OR 037 = EOS DETECTOR ABNORMAL, CRT TCA781_3.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    b = [],
    c = [],
    t = [],
    j = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const WT = (key, ...pts) => w.push([key, pts, 1]);
  const HW = 28.76,
    X1 = 647,
    X2 = 1136,
    xA = 2075,
    xB = 2070,
    xG1 = 1539,
    xG2 = 1537;
  /* A033 inputs */
  W('mA004.AB', [1369, 938], [1413, 938], [1413, 612], [465, 612], [465, 265], [530 - HW, 265]);
  W('not001', [530 + HW, 265], [X1, 265]);
  WT('kSpeed', [418, 327], [595, 327], [595, 287], [X1, 287]);
  WT('sgA034', [315 + HW, 391], [615, 391], [615, 309], [X1, 309]);
  /* A033 outputs */
  W('mA033.TEST1', [883, 265], [xA - 27, 265]);
  W('mA033.TEST2', [883, 287], [1470, 287], [1470, 372], [xA - 27, 372]);
  W('mA033.TEST3', [883, 309], [1414, 309], [1414, 479], [xA - 27, 479]);
  W('mA033.TEST', [883, 331], [1085, 331], [1085, 960], [X2, 960]);
  /* A004 inputs and the two of three of them */
  W('iA10', [533, 872], [X2, 872]);
  W('iA10', [984, 872], [984, 635], [xG1 - HW, 635]);
  W('iA10', [1488, 635], [1488, 710], [xG1 - HW, 710]);
  W('iA11', [533, 935], [1027, 935], [1027, 894], [X2, 894]);
  W('iA11', [1027, 894], [1027, 657], [xG1 - HW, 657]);
  W('iA11', [1466, 657], [1466, 774], [xG1 - HW, 774]);
  W('iA12', [533, 999], [1049, 999], [1049, 916], [X2, 916]);
  W('iA12', [1049, 916], [1049, 732], [xG1 - HW, 732]);
  W('iA12', [1445, 732], [1445, 796], [xG1 - HW, 796]);
  j.push([984, 872], [1027, 894], [1049, 916], [1488, 635], [1466, 657], [1445, 732]);
  W('a040', [xG1 + HW, 635], [1699 - 29.5, 635]);
  W('a042', [xG1 + HW, 710], [1625, 710], [1625, 657], [1699 - 29.5, 657]);
  W('a043', [xG1 + HW, 774], [1646, 774], [1646, 679], [1699 - 29.5, 679]);
  W('or041', [1699 + 29.5, 635], [2037 - 35, 635]);
  W('or041', [1806, 635], [1806, 711], [2028 - 27, 711]);
  j.push([1806, 635]);
  /* A004 outputs and the two of three of them */
  W('mA004.AB1', [1369, 872], [xB - 27, 872]);
  W('mA004.AB1', [1486, 872], [1486, 1125], [xG2 - HW, 1125]);
  W('mA004.AB1', [1486, 1050], [xG2 - HW, 1050]);
  W('mA004.AB2', [1369, 894], [1452, 894], [1452, 1189], [xG2 - HW, 1189]);
  W('mA004.AB2', [1452, 935], [xB - 27, 935]);
  W('mA004.AB2', [1452, 1072], [xG2 - HW, 1072]);
  W('mA004.AB3', [1369, 916], [1431, 916], [1431, 1211], [xG2 - HW, 1211]);
  W('mA004.AB3', [1431, 999], [xB - 27, 999]);
  W('mA004.AB3', [1431, 1147], [xG2 - HW, 1147]);
  j.push([1486, 872], [1486, 1050], [1452, 935], [1452, 1072], [1431, 999], [1431, 1147]);
  W('a036', [xG2 + HW, 1050], [1696 - 29.5, 1050]);
  W('a038', [xG2 + HW, 1125], [1621, 1125], [1621, 1072], [1696 - 29.5, 1072]);
  W('a039', [xG2 + HW, 1189], [1643, 1189], [1643, 1094], [1696 - 29.5, 1094]);
  W('or037', [1696 + 29.5, 1050], [2033 - 35, 1050]);
  [
    ['009', 1075, 265],
    ['010', 1042, 287],
    ['011', 999, 309],
    ['012', 957, 331],
    ['013', 941, 872],
    ['015', 941, 935],
    ['018', 941, 999],
    ['014', 1534, 872],
    ['017', 1534, 935],
    ['019', 1534, 999],
    ['016', 1389, 938]
  ].forEach(([n, x, y]) => b.push(['btr' + n, 'o:BTR', n, x, y]));
  b.push(
    ['ftr035', 'o:FTR', '035', 530, 327],
    ['not001', 'NOT', '001', 530, 276],
    ['sgA034', 'SG', 'A034', 315, 402, ['K:3540rpm']],
    ['x', 'X', '', 465, 284],
    ['a040', 'A', '040', xG1, 646],
    ['a042', 'A', '042', xG1, 721],
    ['a043', 'A', '043', xG1, 785],
    ['or041', 'OR', '041', 1699, 657, [], {}, [59, 64]],
    ['a036', 'A', '036', xG2, 1061],
    ['a038', 'A', '038', xG2, 1136],
    ['a039', 'A', '039', xG2, 1200],
    ['or037', 'OR', '037', 1696, 1072, [], {}, [59, 64]]
  );
  const DEF1 = ['DEF TD:2.0S', 'DEF TD:5.0S', 'DEF TD:2.0S', 'DEF TD:5.0S', 'DEF TD:2.0S', 'DEF TD:5.0S', 'DEF K:0.0'];
  const DEF2 = ['DEF TP:15.0S', 'DEF TP:15.0S', 'DEF TP:15.0S', 'DEF TD:2.0S', 'DEF TD:2.0S'];
  const m = [
    [
      'mA033',
      'PLU/BUG TEST MT1',
      'TCA781_1',
      X1,
      230,
      236,
      171,
      ['PERM', 'SIG', 'SET', 'TEST1', 'TEST2', 'TEST3'],
      ['TEST1', 'TEST2', 'TEST3', 'TEST'],
      'A033',
      DEF1.map((s, i) => [699, Math.round(454 + 21.3 * i), s]),
      [
        [265, 287, 309, 331, 353, 375],
        [265, 287, 309, 331]
      ]
    ],
    [
      'mA004',
      'PLU/BUG DIAGNOSIS MT1',
      'TCA781_2',
      X2,
      838,
      233,
      148,
      ['OP1', 'OP2', 'OP3', 'OP', 'TEST'],
      ['AB1', 'AB2', 'AB3', 'AB'],
      'A004',
      [...DEF2.map((s, i) => [1134, Math.round(1039 + 21.3 * i), s]), [1282, 1039, 'DEF TD:2.0S'], [1282, 1060, 'DEF TD:2.0S']],
      [
        [872, 894, 916, 938, 960],
        [872, 894, 916, 938]
      ]
    ]
  ];
  [
    ['oA1', 'A1', 265],
    ['oA2', 'A2', 372],
    ['oA3', 'A3', 479]
  ].forEach(([k, n, y]) => c.push([k, 'out', n, xA, y, '', ['TCA833'], 0, 0]));
  [
    ['oB1', 'B1', 872],
    ['oB2', 'B2', 935],
    ['oB3', 'B3', 999]
  ].forEach(([k, n, y]) => c.push([k, 'out', n, xB, y, '', ['-'], 0, 0]));
  [
    ['iA10', 'A10', 872],
    ['iA11', 'A11', 935],
    ['iA12', 'A12', 999]
  ].forEach(([k, n, y]) => c.push([k, 'in', n, 506, y, '', ['TCA053'], 0, 1]));
  c.push(['oC1', 'out', 'C1', 2028, 711, '', ['TCE114'], 1, 1]);
  t.push(
    [350, 358, '(TCA104)', 1],
    [762, 424, '(LMA290)', 1],
    [1248, 1009, '(LMA291)', 1],
    [1784, 260, 'EOS TEST (1)'],
    [1783, 367, 'EOS TEST (2)'],
    [1782, 474, 'EOS TEST (3)'],
    [538, 868, 'EOS(1) OPERATED'],
    [538, 931, 'EOS(2) OPERATED'],
    [538, 995, 'EOS(3) OPERATED'],
    [1778, 868, 'EOS(1) DETECTOR ABNORMAL'],
    [1778, 931, 'EOS(2) DETECTOR ABNORMAL'],
    [1777, 995, 'EOS(3) DETECTOR ABNORMAL'],
    [1810, 631, 'EOS OPERATED'],
    [1773, 1046, 'EOS DETECTOR ABNORMAL'],
    [224, 1525, 'CONTROLLER:'],
    [384, 1525, 'COMM+MD'],
    [609, 1498, 'TRIGGER  :'],
    [609, 1525, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA781',
    title: 'EOS TEST',
    page: 202,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [156, 80, 2218, 1543],
    k: [['kSpeed', 183, 327, 'TURBINE SPEED', 'ref']],
    c,
    d: [
      ['crt4', 2037, 635, 'out', 'TCA781_4', 'S', '#1C'],
      ['crt3', 2033, 1050, 'out', 'TCA781_3', 'S', '#1C']
    ],
    b,
    m,
    w,
    j,
    t
  });
})();
