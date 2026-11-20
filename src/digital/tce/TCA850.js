/* TCA850 COM ANALOG OUTPUT (331DM09788 page 240, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. The sixteen analog outputs of the COMM controller to the PI/O table TCA990 (points 1 to 19): the lube oil cooler
   outlet temperatures, the steam seal feed valve and SPUV demands, the HP turbine warming valve position and the generator current,
   voltage, MVAR, power factor and frequency; point 19 is a spare fed from SG 017 (K:0.0). Each line: the connector of the sheet that
   makes the value, its FTR mark, the PI/O mark and the box of the PI/O table with AO under it. One connector (A1 of TCA740) feeds two
   lines through a branch. The PDF prints this sheet twice (pages 231 and 232); it is drawn once. */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    b = [],
    r = [],
    g = [],
    w = [],
    j = [],
    t = [];
  const Y = i => Math.round(154 + 95.9 * i);
  /* one output: column (0 left, 1 right), row, its key, the PI/O mark x, FTR number, PI/O point, the words of the box */
  const out = (col, i, key, from, ftr, no, words) => {
    const L = col === 0,
      y = Y(i),
      fx = L ? 610 : 1645 /* FTR */,
      gx = L ? 789 : 1822 /* PI/O mark */,
      rx = L ? 872 : 1905; /* box */
    b.push(['f' + ftr, 'o:FTR', ftr, fx, y]);
    g.push([gx, y, 'r']);
    w.push(
      [
        key,
        [
          [from, y],
          [gx - 7, y]
        ]
      ],
      [
        key,
        [
          [gx + 7, y],
          [rx, y]
        ],
        1
      ]
    );
    r.push(['', rx, y - 28, 268, 54, '']);
    words.forEach((s, n) => t.push([rx + 6, y - 4 + 22 * n, s]));
    t.push([rx + 250, y + 48, 'AO'], [gx - 55, y - 18, '(TCA990-' + no + ')', 0, 1.7]);
  };
  /* the connectors: key, letter, row, the sheet that makes the value */
  const con = (col, key, l, i, sh) => c.push([key, 'in', l, col === 0 ? 277 : 1315, Y(i), '', [sh]]);
  [
    ['l1', 'A2', 0, 'TCA440'],
    ['l2', 'A1', 1, 'TCA740'],
    ['l3', 'A4', 2, 'TCA322'],
    ['l5', 'A3', 4, 'TCA440'],
    ['l6', 'A1', 5, 'TCA741'],
    ['l7', 'A1', 6, 'TCA320'],
    ['l8', 'A3', 7, 'TCA312'],
    ['l9', 'A2', 8, 'TCA312'],
    ['l10', 'A2', 9, 'TCA320'],
    ['l11', 'A1', 10, 'TCA321'],
    ['l12', 'A2', 11, 'TCA314'],
    ['l13', 'A1', 12, 'TCA314']
  ].forEach(([k, l, i, sh]) => con(0, k, l, i, sh));
  con(1, 'r1', 'A3', 0, 'TCA310');
  con(1, 'r2', 'A2', 1, 'TCA310');
  /* the left column */
  out(0, 0, 'l1', 304, '001', 1, ['LUBE OIL COOLER', 'OUTLET OIL TEMP.(A)']);
  out(0, 1, 'l2', 304, '003', 2, ['SSFV POSITION DEMAND']);
  out(0, 2, 'l3', 304, '005', 3, ['HP TURBINE WARMING', 'VALVE POSITION']);
  out(0, 3, 'l2', 513, '006', 4, ['STEAM SEAL FEED VALVE', 'MANIPULATION VALUE']);
  w.push([
    'l2',
    [
      [513, Y(1)],
      [513, Y(3)]
    ]
  ]);
  j.push([513, Y(1)]);
  out(0, 4, 'l5', 304, '007', 9, ['LUBE OIL COOLER', 'OUTLET OIL TEMP.(B)']);
  out(0, 5, 'l6', 304, '008', 10, ['SPUV POSITION DEMAND']);
  out(0, 6, 'l7', 304, '009', 11, ['GEN. MVAR']);
  out(0, 7, 'l8', 304, '010', 12, ['GEN. CURRENT(B)']);
  out(0, 8, 'l9', 304, '011', 13, ['GEN. VOLTAGE(B-C)']);
  out(0, 9, 'l10', 304, '012', 14, ['GEN. POWER FACTOR']);
  out(0, 10, 'l11', 304, '013', 15, ['FREQUENCY']);
  out(0, 11, 'l12', 304, '014', 17, ['GEN. CURRENT(C)']);
  out(0, 12, 'l13', 304, '015', 18, ['GEN. VOLTAGE(C-A)']);
  /* the right column */
  out(1, 0, 'r1', 1342, '002', 5, ['GEN. CURRENT(A)']);
  out(1, 1, 'r2', 1342, '004', 6, ['GEN. VOLTAGE(A-B)']);
  b.push(['sg017', 'SG', '017', 1326, Y(2) + 12, ['K:0.0']]);
  out(1, 2, 'sg017', 1355, '016', 19, ['SPARE']);
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA850',
    title: 'COM ANALOG OUTPUT',
    page: 240,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [162, 77, 2221, 1541],
    c,
    b,
    r,
    g,
    w,
    j,
    t: [
      ...t,
      [228, 1527, 'CONTROLLER:'],
      [388, 1527, 'COMM+MD'],
      [617, 1498, 'TRIGGER  :'],
      [617, 1527, 'CYCLE(ms):100']
    ]
  });
})();
