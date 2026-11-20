/* TCE471 EHG MINOR TROUBLE ANN(2) (331DM09784 page 170, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels
   of the page rendered 2296 wide, the scan skew taken out. OR 009 of the input discrepancies of TCE075 to TCE086 (OR 006), TCE087 to
   TCE098 (OR 008) and TCE110 to TCE113, TCE145 (OR 010) is ALARM(3) (A, TCE472); OR 005 of the three turbine speed abnormals
   (TCE143) is ALARM(4) (B, TCE472). */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    w = [];
  /* a column of inputs to an OR: connector x, first row y, row step, the inputs [letter, ref, riser x], the OR pins, the OR left x */
  const col = (p, cx, y0, step, rows, pins, orx, nm) =>
    rows.forEach(([let, ref, xr], i) => {
      const y = Math.round(y0 + step * i),
        k = p + i;
      c.push([k, 'in', let, cx, y, nm || 'INPUT DISCREPANCY', [ref]]);
      w.push([k, xr ? [[cx + 27, y], [xr, y], [xr, pins[i]], [orx, pins[i]]] : [[cx + 27, y], [orx, y]]]);
    });
  const tce = (a, n, x0, dx) => Array.from({ length: n }, (_, i) => ['E', 'TCE0' + (a + i), i ? x0 + dx * (i - 1) : 0]);
  col('a', 306, 162, 64, tce(75, 12, 605, 21.4).map((r) => [r[0], r[1], Math.round(r[2])]), [162, 184, 206, 226, 248, 270, 290, 312, 334, 354, 376, 397], 843);
  col('b', 1053, 216, 63.8, tce(87, 12, 1350, 21.4).map((r) => [r[0], r[1], Math.round(r[2])]), [216, 237, 258, 280, 301, 322, 343, 364, 386, 407, 428, 450], 1588);
  col(
    'e',
    306,
    962,
    63.5,
    [
      ['E', 'TCE110', 0],
      ['E', 'TCE111', 756],
      ['E', 'TCE112', 778],
      ['E', 'TCE113', 798],
      ['B', 'TCE145', 820]
    ],
    [962, 982, 1004, 1026, 1046],
    843
  );
  [
    ['C', 'TURBINE SPEED(A) ABNORMAL', 0, 1290],
    ['D', 'TURBINE SPEED(B) ABNORMAL', 1088, 1312],
    ['E', 'TURBINE SPEED(C) ABNORMAL', 1110, 1334]
  ].forEach(([let, nm, xr, pin], i) => {
    const y = 1290 + 64 * i;
    c.push(['s' + i, 'in', let, 306, y, nm, ['TCE143']]);
    w.push(['s' + i, xr ? [[333, y], [xr, y], [xr, pin], [1132, pin]] : [[333, y], [1132, y]]]);
  });
  c.push(['oA', 'out', 'A', 2085, 162, '', ['TCE472']], ['oB', 'out', 'B', 2087, 1290, '', ['TCE472']]);
  w.push(
    ['or006', [[902, 162], [1746, 162]]],
    ['or008', [[1646, 216], [1702, 216], [1702, 184], [1746, 184]]],
    ['or010', [[903, 962], [1724, 962], [1724, 205], [1746, 205]]],
    ['or009', [[1806, 162], [2058, 162]]],
    ['or005', [[1192, 1290], [2060, 1290]]]
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCE471',
    title: 'EHG MINOR TROUBLE ANN(2)',
    page: 170,
    ctl: 'EHG+MD',
    cycle: 30,
    f: [172, 85, 2225, 1549],
    c,
    b: [
      ['or006', 'OR', '006', 872, 280, [], {}, [59, 256]],
      ['or008', 'OR', '008', 1617, 332, [], {}, [58, 257]],
      ['or009', 'OR', '009', 1776, 183, [], {}, [60, 65]],
      ['or010', 'OR', '010', 873, 1004, [], {}, [60, 108]],
      ['or005', 'OR', '005', 1162, 1312, [], {}, [60, 64]]
    ],
    w,
    t: [
      [1905, 152, 'ALARM(3)', 0, 2.05],
      [1908, 1280, 'ALARM(4)', 0, 2.05],
      [240, 1524, 'CONTROLLER:'],
      [405, 1524, 'EHG+MD'],
      [628, 1524, 'CYCLE(ms):30'],
      [628, 1498, 'TRIGGER  :']
    ]
  });
})();
