/* TCA564 CRITERIA MONITOR (331DM09788 page 134, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. Four criteria monitor blocks (CRI MONT.MD A002 / A005 / A008 / A010, lamps TCA564_1 .. _4): the criterion on IN
   (CRI 2.5 gen. load > initial load, CRI 2.6 IP to HP transfer complete, CRI 2.7 V/F (start up), CRI 2.11 turbine shutdown load, each
   through a BTR with INV K:0.0 / K:0.9) and on MODE of block 2 the IP start (TCA106); the K tables IN0 .. IN8 / EX0 .. EX8 give the steps
   in which the criterion is asked (step in) and kept (step execution). STPIN of the four to OR 003 = step in criteria not OK (A), BYPASS to
   OR 006 = criteria bypass in progress (C), EX to OR 011 = step exe criteria not OK (B). */
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
    ['m1', 'A002', '1', 148, '000000100', '000000000'],
    ['m2', 'A005', '2', 447, '000000010', '000000000'],
    ['m3', 'A008', '3', 732, '000010000', '000010000'],
    ['m4', 'A010', '4', 1031, '000000000', '000000000']
  ];
  MON.forEach(([key, foot, crt, y, kin, kex]) => {
    m.push([
      key,
      'CRI MONT.MD',
      'TCA564_' + crt,
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
  /* the criterion of each block on IN: [connector key, letter, sheet, block, connector x, BTR x, BTR no., name lines, name x from the connector] */
  const IN = [
    ['iD', 'D', 'TCA535', 148, 267, 684, '001', ['CRI 2.5 GEN.LOAD', '> INITIAL LOAD'], 43],
    ['iE', 'E', 'TCA535', 447, 266, 683, '004', ['CRI 2.6 IP TO HP', 'TRANSFER COMPLETE'], 43],
    ['iB', 'B', 'TCA544', 732, 254, 682, '007', ['CRI 2.7 V/F', '(START UP)'], 33],
    ['iF', 'F', 'TCA535', 1031, 265, 682, '009', ['CRI 2.11 TURBINE', 'SHUTDOWN LOAD'], 43]
  ];
  IN.forEach(([key, l, sh, y, cx, bx, no, names, nx]) => {
    const py = PY(y, 0);
    c.push([key, 'in', l, cx, py, '', [sh], 0]);
    names.forEach((s, n) => t.push([cx + nx, py - 11 - 21 * (names.length - 1 - n), s]));
    W(key, [
      [cx + 27, py],
      [MX, py]
    ]);
    b.push(['btr' + no, 'o:BTR', no, bx, py]);
    t.push([bx + 47, py + 35, 'INV K:0.0'], [bx + 84, py + 61, 'K:0.9']);
  });
  /* IP start on MODE of block 2 */
  b.push(['btr012', 'o:BTR', '012', 683, 644]);
  W('kIp', [
    [633, 644],
    [843, 644],
    [843, PY(447, 3)],
    [MX, PY(447, 3)]
  ]);
  t.push([524, 677, '(TCA106)']);
  /* STPIN to OR 003 = step in criteria not OK */
  const OR3 = 1765,
    OR6 = 1761,
    OR11 = 1759;
  W('m1.STPIN', [
    [RX, PY(148, 0)],
    [OR3, PY(148, 0)]
  ]);
  W('m2.STPIN', [
    [RX, PY(447, 0)],
    [1369, PY(447, 0)],
    [1369, 216],
    [OR3, 216]
  ]);
  W('m3.STPIN', [
    [RX, PY(732, 0)],
    [1388, PY(732, 0)],
    [1388, 237],
    [OR3, 237]
  ]);
  W('m4.STPIN', [
    [RX, PY(1031, 0)],
    [1410, PY(1031, 0)],
    [1410, 258],
    [OR3, 258]
  ]);
  /* BYPASS to OR 006 = criteria bypass in progress */
  W('m1.BYPASS', [
    [RX, PY(148, 1)],
    [1339, PY(148, 1)],
    [1339, 320],
    [1603, 320],
    [1603, 599],
    [OR6, 599]
  ]);
  W('m2.BYPASS', [
    [RX, PY(447, 1)],
    [1580, PY(447, 1)],
    [1580, 620],
    [OR6, 620]
  ]);
  W('m3.BYPASS', [
    [RX, PY(732, 1)],
    [1577, PY(732, 1)],
    [1577, 641],
    [OR6, 641]
  ]);
  W('m4.BYPASS', [
    [RX, PY(1031, 1)],
    [1600, PY(1031, 1)],
    [1600, 662],
    [OR6, 662]
  ]);
  /* EX to OR 011 = step exe criteria not OK */
  W('m1.EX', [
    [RX, PY(148, 2)],
    [1317, PY(148, 2)],
    [1317, 342],
    [1697, 342],
    [1697, 1080],
    [OR11, 1080]
  ]);
  W('m2.EX', [
    [RX, PY(447, 2)],
    [1675, PY(447, 2)],
    [1675, 1101],
    [OR11, 1101]
  ]);
  W('m3.EX', [
    [RX, PY(732, 2)],
    [1653, PY(732, 2)],
    [1653, 1122],
    [OR11, 1122]
  ]);
  W('m4.EX', [
    [RX, PY(1031, 2)],
    [OR11, PY(1031, 2)]
  ]);
  b.push(
    ['or003', 'OR', '003', OR3 + 30, 227, [], {}, [59, 86]],
    ['or006', 'OR', '006', OR6 + 30, 631, [], {}, [59, 86]],
    ['or011', 'OR', '011', OR11 + 30, 1112, [], {}, [59, 86]]
  );
  W('or003', [
    [OR3 + 60, 195],
    [2120, 195]
  ]);
  W('or006', [
    [OR6 + 60, 599],
    [2116, 599]
  ]);
  W('or011', [
    [OR11 + 60, 1080],
    [2113, 1080]
  ]);
  c.push(
    ['oA', 'out', 'A', 2147, 195, '', ['TCA517'], 0, 1],
    ['oC', 'out', 'C', 2143, 599, '', ['TCA519'], 0, 1],
    ['oB', 'out', 'B', 2140, 1080, '', ['TCA518'], 0, 1]
  );
  t.push(
    [1905, 169, 'STEP IN'],
    [1905, 190, 'CRITERIA NOT OK'],
    [1902, 573, 'CRITERIA BYPASS'],
    [1902, 594, 'IN PROGRESS'],
    [1899, 1054, 'STEP EXE'],
    [1899, 1075, 'CRITERIA NOT OK'],
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
    id: 'TCA564',
    title: 'CRITERIA MONITOR',
    page: 134,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [160, 85, 2208, 1550],
    k: [['kIp', 400, 644, 'IP START', 'ref']],
    c,
    d: [],
    b,
    m,
    w,
    j: [],
    t
  });
})();
