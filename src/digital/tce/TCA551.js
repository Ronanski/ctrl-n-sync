/* TCA551 CRITERIA MONITOR (331DM09788 page 121, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. Four criteria monitor blocks (CRI MONT.MD A002 / A005 / A008 / A010, lamps TCA551_1 .. _4): the criterion on IN
   (CRI 1.5 reheat steam press. not low, CRI 1.6 reheat steam temp. not low, CRI 1.71 main steam temp. mismatch OK, CRI 1.72 reheat steam
   temp. mismatch OK, each through a BTR with INV K:0.0 / K:0.9) and on MODE of the first, second and fourth the IP start (TCA099); the K
   tables IN0 .. IN8 / EX0 .. EX8 give the steps in which the criterion is asked (step in) and kept (step execution). STPIN of the four to
   OR 003 = step in criteria not OK (A), BYPASS to OR 006 = criteria bypass in progress (C), EX to OR 011 = step exe criteria not OK (B). */
(function () {
  if (typeof window === 'undefined') return;
  const U = 2.048 /* one thousandth of the frame width */,
    MX = 855 /* the left of the four blocks */,
    MW = 405,
    MH = 224,
    RX = MX + MW /* their right pins */,
    w = [],
    b = [],
    c = [],
    m = [],
    t = [];
  const W = (key, pts) => w.push([key, pts]);
  /* the middle of pin i of a block at y (the cells of the macro block: title and foot bar 15 U, five rows) */
  const PY = (y, i) => +(y + 15 * U + ((i + 0.5) * (MH - 30 * U)) / 5).toFixed(2);
  /* one block: [key, foot, lamp, top y, IN K, EX K] */
  const MON = [
    ['m1', 'A002', '1', 153, '001111000', '011111000'],
    ['m2', 'A005', '2', 453, '001111000', '011111000'],
    ['m3', 'A008', '3', 738, '001100000', '000000000'],
    ['m4', 'A010', '4', 1036, '001100000', '000000000']
  ];
  MON.forEach(([key, foot, crt, y, kin, kex]) => {
    m.push([
      key,
      'CRI MONT.MD',
      'TCA551_' + crt,
      MX,
      y,
      MW,
      MH,
      ['IN', 'MB', 'MB2', 'MODE', ''],
      ['STPIN', 'BYPASS', 'EX', 'FAIL', 'USE'],
      foot,
      [
        [MX + 110, y + MH + 26, '(LMA550)'],
        [MX + 262, y + MH + 26, '(LMA551)']
      ]
    ]);
    for (let i = 0; i < 9; i++) {
      const ty = +(y + 47 + i * 15.9).toFixed(1);
      t.push(
        [MX + 90, ty, 'IN' + i + ' K:' + kin[i] + '.0', 3, 1.6],
        [MX + 223, ty, 'EX' + i + ' K:' + kex[i] + '.0', 3, 1.6]
      );
    }
  });
  /* the criterion of each block on IN: [connector key, letter, sheet, block, connector x, BTR x, BTR no., name lines] */
  const IN = [
    ['iB', 'B', 'TCA532', 153, 267, 681, '001', ['CRI 1.5 REHEAT STEAM', 'PRESS. NOT LOW']],
    ['iC', 'C', 'TCA532', 453, 263, 680, '004', ['CRI 1.6 REHEAT STEAM', 'TEMP. NOT LOW']],
    ['iA', 'A', 'TCA548', 738, 260, 675, '007', ['CRI 1.71 MAIN STEAM', 'TEMP. MISMATCH OK']],
    ['iC1', 'C', 'TCA548', 1036, 257, 672, '009', ['CRI 1.72 REHEAT STEAM', 'TEMP. MISMATCH OK']]
  ];
  IN.forEach(([key, l, sh, y, cx, bx, no, names]) => {
    const py = PY(y, 0);
    c.push([key, 'in', l, cx, py, '', [sh], 0]);
    names.forEach((s, n) => t.push([cx + 43, py - 11 - 21 * (names.length - 1 - n), s]));
    W(key, [
      [cx + 27, py],
      [MX, py]
    ]);
    b.push(['btr' + no, 'o:BTR', no, bx, py]);
    t.push([bx + 3, py + 48, 'INV K:0.0'], [bx + 41, py + 75, 'K:0.9']);
  });
  /* IP start on MODE of the first, second and fourth block */
  b.push(['btr012', 'o:BTR', '012', 680, 327]);
  W('kIp', [
    [630, 327],
    [841, 327],
    [841, PY(153, 3)],
    [MX, PY(153, 3)]
  ]);
  W('kIp', [
    [785, 327],
    [785, PY(1036, 3)],
    [MX, PY(1036, 3)]
  ]);
  W('kIp', [
    [785, PY(453, 3)],
    [MX, PY(453, 3)]
  ]);
  /* STPIN to OR 003 = step in criteria not OK */
  const OR3 = 1765,
    OR6 = 1761,
    OR11 = 1759;
  W('m1.STPIN', [
    [RX, PY(153, 0)],
    [OR3, PY(153, 0)]
  ]);
  W('m2.STPIN', [
    [RX, PY(453, 0)],
    [1369, PY(453, 0)],
    [1369, 221],
    [OR3, 221]
  ]);
  W('m3.STPIN', [
    [RX, PY(738, 0)],
    [1388, PY(738, 0)],
    [1388, 242],
    [OR3, 242]
  ]);
  W('m4.STPIN', [
    [RX, PY(1036, 0)],
    [1410, PY(1036, 0)],
    [1410, 263],
    [OR3, 263]
  ]);
  /* BYPASS to OR 006 = criteria bypass in progress */
  W('m1.BYPASS', [
    [RX, PY(153, 1)],
    [1339, PY(153, 1)],
    [1339, 325],
    [1603, 325],
    [1603, 604],
    [OR6, 604]
  ]);
  W('m2.BYPASS', [
    [RX, PY(453, 1)],
    [1580, PY(453, 1)],
    [1580, 625],
    [OR6, 625]
  ]);
  W('m3.BYPASS', [
    [RX, PY(738, 1)],
    [1577, PY(738, 1)],
    [1577, 646],
    [OR6, 646]
  ]);
  W('m4.BYPASS', [
    [RX, PY(1036, 1)],
    [1600, PY(1036, 1)],
    [1600, 667],
    [OR6, 667]
  ]);
  /* EX to OR 011 = step exe criteria not OK */
  W('m1.EX', [
    [RX, PY(153, 2)],
    [1317, PY(153, 2)],
    [1317, 347],
    [1697, 347],
    [1697, 1085],
    [OR11, 1085]
  ]);
  W('m2.EX', [
    [RX, PY(453, 2)],
    [1675, PY(453, 2)],
    [1675, 1106],
    [OR11, 1106]
  ]);
  W('m3.EX', [
    [RX, PY(738, 2)],
    [1653, PY(738, 2)],
    [1653, 1127],
    [OR11, 1127]
  ]);
  W('m4.EX', [
    [RX, PY(1036, 2)],
    [OR11, PY(1036, 2)]
  ]);
  b.push(
    ['or003', 'OR', '003', OR3 + 30, 232, [], {}, [59, 86]],
    ['or006', 'OR', '006', OR6 + 30, 636, [], {}, [59, 86]],
    ['or011', 'OR', '011', OR11 + 30, 1117, [], {}, [59, 86]]
  );
  W('or003', [
    [OR3 + 60, 200],
    [2120, 200]
  ]);
  W('or006', [
    [OR6 + 60, 604],
    [2116, 604]
  ]);
  W('or011', [
    [OR11 + 60, 1085],
    [2113, 1085]
  ]);
  c.push(
    ['oA', 'out', 'A', 2147, 200, '', ['TCA517'], 0, 1],
    ['oC', 'out', 'C', 2143, 604, '', ['TCA519'], 0, 1],
    ['oB', 'out', 'B', 2140, 1085, '', ['TCA518'], 0, 1]
  );
  t.push(
    [521, 360, '(TCA099)'],
    [1905, 174, 'STEP IN'],
    [1905, 195, 'CRITERIA NOT OK'],
    [1902, 578, 'CRITERIA BYPASS'],
    [1902, 599, 'IN PROGRESS'],
    [1899, 1059, 'STEP EXE'],
    [1899, 1080, 'CRITERIA NOT OK'],
    [1118, 1370, 'STEP 0 : HP TBN WARMING'],
    [1118, 1391, 'STEP 1 : PREPARATION'],
    [1118, 1413, 'STEP 2 : TURBINE RUB CHECK'],
    [1118, 1434, 'STEP 3 : ACCELERATION'],
    [1118, 1455, 'STEP 4 : EXCITATION'],
    [1118, 1477, 'STEP 5 : SYNC INITIAL LOAD'],
    [1118, 1498, 'STEP 6 : LOAD UP'],
    [1118, 1519, 'STEP 7 : NORMAL OPERATION'],
    [1118, 1541, 'STEP 8 : TURBINE SHUT-DOWN'],
    [231, 1529, 'CONTROLLER:'],
    [393, 1529, 'COMM+MD'],
    [617, 1502, 'TRIGGER  :'],
    [617, 1529, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA551',
    title: 'CRITERIA MONITOR',
    page: 121,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [160, 85, 2208, 1550],
    k: [['kIp', 397, 327, 'IP START', 'ref']],
    c,
    d: [],
    b,
    m,
    w,
    j: [
      [785, 327],
      [785, PY(453, 3)]
    ],
    t
  });
})();
