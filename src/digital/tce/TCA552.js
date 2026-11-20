/* TCA552 CRITERIA MONITOR (331DM09788 page 122, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. Four criteria monitor blocks (CRI MONT.MD A002 / A005 / A008 / A010, lamps TCA552_1 .. _4): the criterion on IN
   (CRI 1.8 HP/LP bypass control in auto mode, the system reference ON(1), CRI 1.10 gland seal steam press. not low, CRI 1.11 condenser
   vacuum OK, each through a BTR with INV K:0.0 / K:0.9) and on MODE the IP start / HP start (TCA106); the K tables IN0 .. IN8 / EX0 .. EX8
   give the steps in which the criterion is asked (step in) and kept (step execution). STPIN of the four to OR 003 = step in criteria not OK (A),
   BYPASS to OR 006 = criteria bypass in progress (C), EX to OR 011 = step exe criteria not OK (B). */
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
    ['m1', 'A002', '1', 153, '001111100', '011111100'],
    ['m2', 'A005', '2', 453, '001111100', '011111100'],
    ['m3', 'A008', '3', 738, '101111100', '111111110'],
    ['m4', 'A010', '4', 1036, '101111100', '111111110']
  ];
  MON.forEach(([key, foot, crt, y, kin, kex]) => {
    m.push([
      key,
      'CRI MONT.MD',
      'TCA552_' + crt,
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
  /* the criterion of each block on IN: [source key, block, BTR x, BTR no.] */
  const IN = [
    ['iD', 153, 678, '001'],
    ['kOn', 453, 675, '004'],
    ['iC1', 738, 674, '007'],
    ['iC2', 1036, 672, '009']
  ];
  IN.forEach(([key, y, bx, no], i) => {
    const py = PY(y, 0),
      x0 = key === 'kOn' ? 273 + 233 : [287, 0, 284, 282][i];
    W(key, [
      [x0, py],
      [MX, py]
    ]);
    b.push(['btr' + no, 'o:BTR', no, bx, py]);
    t.push([bx + 53, py + 29, 'INV K:0.0'], [bx + 89, py + 46, 'K:0.9']);
  });
  c.push(
    ['iD', 'in', 'D', 260, PY(153, 0), '', ['TCA532'], 0],
    ['iC1', 'in', 'C', 257, PY(738, 0), '', ['TCA542'], 0],
    ['iC2', 'in', 'C', 255, PY(1036, 0), '', ['TCA536'], 0]
  );
  /* IP start / HP start on MODE */
  b.push(['btr012', 'o:BTR', '012', 677, 327], ['btr013', 'o:BTR', '013', 675, 647]);
  W('kIp', [
    [626, 327],
    [837, 327],
    [837, PY(153, 3)],
    [MX, PY(153, 3)]
  ]);
  W('kHp', [
    [624, 647],
    [835, 647],
    [835, PY(453, 3)],
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
    [303, 167, 'CRI 1.8 HP/LP BYPASS'],
    [303, 189, 'CONTROL IN AUTO MODE'],
    [300, 753, 'CRI 1.10 GLAND SEAL'],
    [300, 774, 'STEAM PRESS. NOT LOW'],
    [299, 1051, 'CRI 1.11 CONDENSER'],
    [299, 1072, 'VACUUM OK'],
    [517, 360, '(TCA106)'],
    [513, 680, '(TCA106)'],
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
    id: 'TCA552',
    title: 'CRITERIA MONITOR',
    page: 122,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [160, 85, 2208, 1550],
    k: [
      ['kOn', 273, PY(453, 0), 'ON(1)', 'sys.ref'],
      ['kIp', 393, 327, 'IP START', 'ref'],
      ['kHp', 391, 647, 'HP START', 'ref']
    ],
    c,
    d: [],
    b,
    m,
    w,
    j: [],
    t
  });
})();
