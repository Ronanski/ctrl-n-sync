/* TCE467 EHG ALARM(DO ERROR) (331DM09784 page 166, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the
   page rendered 2296 wide, the scan skew taken out. The PI/O errors of the DO cards of slot 2 and slot 3, upper and lower (TCE960-1,
   -17, TCE961-1, -17), are each held in a flip-flop (FFS) until ANN RESET; they go to the operator station lamps (CRT) and A1 to A4,
   and OR 013 of the four is the DO ERROR (A, TCE472). */
(function () {
  if (typeof window === 'undefined') return;
  const r = [],
    d = [],
    c = [],
    b = [],
    w = [],
    t = [];
  const BUS = 1152;
  const rows = [
    ['TCE960-1', 'DO SLOT2.U.ABN', '001', ['002', '003'], 1502],
    ['TCE960-17', 'DO SLOT2.L.ABN', '004', ['005', '006'], 1480],
    ['TCE961-1', 'DO SLOT3.U.ABN', '007', ['008', '009'], 1460],
    ['TCE961-17', 'DO SLOT3.L.ABN', '010', ['011', '012'], 1438]
  ];
  rows.forEach(([tab, nm, ffs, btr, xo], i) => {
    const y = 214 + 128 * i,
      k = 'pio' + i,
      f = 'ffs' + ffs,
      pin = 800 + 21 * i;
    r.push([k, 300, y - 12, 126, 24, 'PI/O error']);
    t.push([318, y - 19, '(' + tab + ')'], [1172, y - 16, 'T', 0, 1.9], [1741, y - 10, nm, 0, 2.05], [1741, y + 54, nm, 0, 2.05]);
    b.push([f, 'FFS', ffs, 1226, y + 11, [], { l: ['S', 'R'] }, [80, 43]]);
    b.push(['btr' + btr[0], 'o:BTR', btr[0], 1578, y], ['btr' + btr[1], 'o:BTR', btr[1], 1578, y + 64]);
    d.push(['crt' + (i + 1), 2022, y, 'out', 'TCE467_' + (i + 1), 'S', '#1C']);
    c.push(['oA' + (i + 1), 'out', 'A' + (i + 1), 2012, y + 64, '', ['-'], 1]);
    w.push(
      [k, [[426, y], [1186, y]]],
      ['kAnn', [[BUS, y + 22], [1186, y + 22]]],
      [f, [[1266, y], [1987, y]]],
      [f, [[1522, y], [1522, y + 64], [1985, y + 64]]],
      [f, [[xo, y], [xo, pin], [1548, pin]]]
    );
  });
  b.push(['or013', 'OR', '013', 1578, 832, [], {}, [60, 87]]);
  c.push(['oA', 'out', 'A', 2078, 800, '', ['TCE472']]);
  w.push(['kAnn', [[1071, 780], [BUS, 780]]], ['kAnn', [[BUS, 236], [BUS, 780]]], ['or013', [[1608, 800], [2051, 800]]]);
  t.push(
    [982, 806, '(TCE050)', 0, 1.7],
    [1739, 790, 'DO ERROR', 0, 2.05],
    [235, 1522, 'CONTROLLER:'],
    [398, 1522, 'EHG+MD'],
    [633, 1496, 'TRIGGER  :'],
    [633, 1522, 'CYCLE(ms):30']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCE467',
    title: 'EHG ALARM(DO ERROR)',
    page: 166,
    ctl: 'EHG+MD',
    cycle: 30,
    f: [164, 84, 2215, 1546],
    r,
    k: [['kAnn', 837, 780, 'ANN RESET', 'ref']],
    d,
    c,
    b,
    w,
    t
  });
})();
