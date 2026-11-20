/* TCE466 EHG ALARM(AI ERROR) (331DM09784 page 165, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the
   page rendered 2296 wide, the scan skew taken out. The PI/O errors of the AI cards of slot 5 (TCE930-1 to -5) and slot 6 (TCE930-9
   to -12), OR 001 / OR 005 (the spare inputs tied to OFF(0)), are each held in a flip-flop (FFS 002 / 006) until ANN RESET; they go to
   the operator station lamps (CRT) and A1 / A2, and OR 009 of the two is the AI ERROR (A, TCE472). */
(function () {
  if (typeof window === 'undefined') return;
  const r = [],
    t = [],
    w = [];
  /* the PI/O error boxes and their lines to the OR blocks: [table, y, x of the riser, y at the OR] */
  const pio = [
    ['1', 266, 0, 266, 'or1'],
    ['2', 330, 734, 288, 'or1'],
    ['3', 394, 754, 310, 'or1'],
    ['4', 458, 776, 330, 'or1'],
    ['5', 522, 798, 352, 'or1'],
    ['9', 800, 0, 800, 'or5'],
    ['10', 862, 734, 820, 'or5'],
    ['11', 926, 756, 842, 'or5'],
    ['12', 990, 778, 862, 'or5']
  ];
  pio.forEach(([n, y, xr, yo]) => {
    const k = 'pio' + n;
    r.push([k, 276, y - 11, 126, 23, 'PI/O error']);
    t.push([293, y - 16, '(TCE930-' + n + ')']);
    w.push([k, xr ? [[402, y], [xr, y], [xr, yo], [884, yo]] : [[402, y], [884, y]]]);
  });
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCE466',
    title: 'EHG ALARM(AI ERROR)',
    page: 165,
    ctl: 'EHG+MD',
    cycle: 30,
    f: [164, 82, 2213, 1546],
    r,
    k: [
      ['kOff1', 279, 694, 'OFF(0)', 'sys.ref'],
      ['kOff2', 290, 1171, 'OFF(0)', 'sys.ref'],
      ['kAnn', 889, 1139, 'ANN RESET', 'ref']
    ],
    d: [
      ['crt1', 2020, 266, 'out', 'TCE466_1', 'S', '#1C'],
      ['crt2', 2020, 800, 'out', 'TCE466_2', 'S', '#1C']
    ],
    c: [
      ['oA1', 'out', 'A1', 2011, 330, '', ['-'], 1],
      ['oA2', 'out', 'A2', 2011, 862, '', ['-'], 1],
      ['oA', 'out', 'A', 2076, 1160, '', ['TCE472']]
    ],
    b: [
      ['or1', 'OR', '001', 914, 341, [], {}, [60, 172]],
      ['or5', 'OR', '005', 914, 873, [], {}, [60, 170]],
      ['ffs002', 'FFS', '002', 1276, 276, [], { l: ['S', 'R'] }, [80, 43]],
      ['ffs006', 'FFS', '006', 1276, 810, [], { l: ['S', 'R'] }, [80, 43]],
      ['or9', 'OR', '009', 1575, 1170],
      ['btr003', 'o:BTR', '003', 1572, 266],
      ['btr004', 'o:BTR', '004', 1572, 330],
      ['btr007', 'o:BTR', '007', 1573, 800],
      ['btr008', 'o:BTR', '008', 1573, 862]
    ],
    w: w.concat([
      /* the spare inputs of the OR blocks */
      ['kOff1', [[513, 694], [820, 694], [820, 374], [884, 374]]],
      ['kOff1', [[820, 394], [884, 394]]],
      ['kOff1', [[820, 416], [884, 416]]],
      ['kOff2', [[524, 1171], [798, 1171], [798, 884], [884, 884]]],
      ['kOff2', [[798, 906], [884, 906]]],
      ['kOff2', [[798, 926], [884, 926]]],
      ['kOff2', [[798, 948], [884, 948]]],
      /* the flip-flops and ANN RESET */
      ['or1', [[944, 266], [1236, 266]]],
      ['or5', [[944, 800], [1236, 800]]],
      ['kAnn', [[1123, 1139], [1203, 1139], [1203, 287], [1236, 287]]],
      ['kAnn', [[1203, 821], [1236, 821]]],
      /* slot 5 */
      ['ffs002', [[1316, 266], [1985, 266]]],
      ['ffs002', [[1522, 266], [1522, 330], [1984, 330]]],
      ['ffs002', [[1480, 266], [1480, 1160], [1546, 1160]]],
      /* slot 6 */
      ['ffs006', [[1316, 800], [1985, 800]]],
      ['ffs006', [[1522, 800], [1522, 862], [1984, 862]]],
      ['ffs006', [[1460, 800], [1460, 1181], [1546, 1181]]],
      ['or9', [[1604, 1160], [2049, 1160]]]
    ]),
    t: t.concat([
      [1222, 250, 'T', 0, 1.9],
      [1222, 784, 'T', 0, 1.9],
      [1034, 1165, '(TCE050)', 0, 1.7],
      [1631, 256, 'AI SLOT5 ABN', 0, 2.05],
      [1631, 320, 'AI SLOT5 ABN', 0, 2.05],
      [1632, 790, 'AI SLOT6 ABN', 0, 2.05],
      [1632, 852, 'AI SLOT6 ABN', 0, 2.05],
      [1683, 1150, 'AI ERROR', 0, 2.05],
      [233, 1521, 'CONTROLLER:'],
      [393, 1521, 'EHG+MD'],
      [629, 1495, 'TRIGGER  :'],
      [629, 1521, 'CYCLE(ms):30']
    ])
  });
})();
