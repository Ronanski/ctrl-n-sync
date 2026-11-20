/* TCA770 THSC SIMULATION (331DM09788 page 198, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn:
   - Integrator I B002 (TI:60.0s, HL:1000.0%, LL:-1000.0%): X = SG B001 (K:1.0%), Z = SG B004 (K:-0.1%), T = THSC SIMULATION (ref)
     through BTR 008.
   - Its output through FG B003 / B005 / B009 / B010 (tables *1-*4, Xn % to Yn DEGC as printed) = SIM HP INNER / HP OUTER / IP INNER /
     IP OUTER WALL MET TEMP, A1 / A2 (to TCA751) and B1 / B2 (to TCA755).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [],
    l = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const WT = (key, ...pts) => w.push([key, pts, 1]);
  const HW = 28.76,
    xI = 676.5,
    yI = 298;
  W('kSim', [500, 147], [677, 147], [677, yI - 32.5]);
  WT('sgB001', [452 + HW, yI - 21], [xI - 40.5, yI - 21]);
  WT('sgB004', [452 + HW, 381], [579, 381], [579, yI + 21], [xI - 40.5, yI + 21]);
  WT('iB002', [xI + 40.5, 276], [1040 - HW, 276]);
  WT('iB002', [953, 276], [953, 608], [1040 - HW, 608]);
  [394, 500].forEach(y => WT('iB002', [953, y], [1040 - HW, y]));
  const ROWS = [
    [276, 'B003', 'oA1', 'SIM HP INNER WALL MET TEMP', '*1'],
    [394, 'B005', 'oA2', 'SIM HP OUTER WALL MET TEMP', '*2'],
    [500, 'B009', 'oB1', 'SIM IP INNER WALL MET TEMP', '*3'],
    [608, 'B010', 'oB2', 'SIM IP OUTER WALL MET TEMP', '*4']
  ];
  const b = [
    ['sgB001', 'SG', 'B001', 452, 288, ['K:1.0%']],
    ['sgB004', 'SG', 'B004', 452, 392, ['K:-0.1%']],
    ['iB002', 'I', 'B002', xI, yI, ['TI:60.0s', 'HL:1000.0%', 'LL:-1000.0%'], { l: ['X', 'F', 'Z'] }, [81, 65]],
    ['btr008', 'o:BTR', '008', 581, 147]
  ];
  ROWS.forEach(([y, n, o, s, star], i) => {
    b.push(['fg' + n, 'FG', n, 1040, y + 11]);
    WT('fg' + n, [1040 + HW, y], [2104 - 27, y]);
    t.push([1148, y - 3, s], [1014, y - 27, star]);
  });
  /* the four FG tables */
  const TAB = [
    ['*1', [264, 319, 427, 534], 532, ['0', '8', '16', '22', '26', '50', '75', '102'], ['466', '454', '410', '406', '390', '446', '482', '502']],
    ['*2', [543, 597, 706, 811.5], 532, ['0', '8', '16', '22', '26', '50', '75', '102'], Array(8).fill('466')],
    ['*3', [262, 316, 424, 529], 957, ['0', '8', '16', '22', '26', '37', '63', '109'], ['503', '497', '460', '458', '450', '462', '512', '563']],
    ['*4', [540, 594, 701, 808], 957, ['0', '8', '16', '22', '26', '37', '63', '109'], Array(8).fill('503')]
  ];
  TAB.forEach(([star, X, y0, XN, YN]) => {
    const Y = Array.from({ length: 10 }, (_, i) => Math.round(y0 + 32 * i));
    Y.forEach(y => l.push([[X[0], y], [X[3], y]]));
    X.forEach(x => l.push([[x, Y[0]], [x, Y[9]]]));
    const c = [(X[0] + X[1]) / 2, (X[1] + X[2]) / 2, (X[2] + X[3]) / 2];
    t.push([X[0] + 7, y0 - 12, star], [c[0], Y[0] + 22, 'No.', 1], [c[1], Y[0] + 22, 'Xn(%)', 1], [c[2], Y[0] + 22, 'Yn(DEGC)', 1]);
    XN.forEach((x, i) => t.push([c[0], Y[i + 1] + 22, String(i), 1], [c[1], Y[i + 1] + 22, x, 1], [c[2], Y[i + 1] + 22, YN[i], 1]));
  });
  t.push([622, 268, 'T'], [238, 1527, 'CONTROLLER:'], [399, 1527, 'COMM+MD'], [623, 1500, 'TRIGGER  :'], [623, 1528, 'CYCLE(ms):100']);
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA770',
    title: 'THSC SIMULATION',
    page: 198,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [180, 82, 2232, 1547],
    k: [['kSim', 267, 147, 'THSC SIMULATION', 'ref']],
    c: [
      ['oA1', 'out', 'A1', 2104, 276, '', ['TCA751'], 0, 1],
      ['oA2', 'out', 'A2', 2104, 394, '', ['TCA751'], 0, 1],
      ['oB1', 'out', 'B1', 2104, 500, '', ['TCA755'], 0, 1],
      ['oB2', 'out', 'B2', 2104, 608, '', ['TCA755'], 0, 1]
    ],
    b,
    w,
    j: [
      [953, 276],
      [953, 394],
      [953, 500]
    ],
    l,
    t
  });
})();
