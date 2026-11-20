/* TCA769 THSC LIMIT (331DM09788 page 197, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. The thermal stress limit of the load up rate: each stress over its limit (DIV 001 HP surface, DIV 007 HP bore,
   DIV 011 IP surface, DIV 014 IP bore) through the function generator FG *1..*4 (table FG *1-4: ratio to limit factor, 1.0 up to the
   ratio 0.95, 0.0 from the ratio 1.0), the lowest of the four (LSG 003, LSG 013, LSG 004) times LOAD UP RATE (MLT 005 = LOAD UP RATE
   (T/R COMPENSATION), MLT 009 = LOAD UP RATE (DCS)).
   The words are the ones of the drawing.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    b = [],
    w = [],
    l = [],
    t = [];
  const W = (key, pts) => w.push([key, pts, 1]);
  /* one stress over its limit: [stress connector (letter, sheet, x, y, words), limit connector, x of the riser of the limit, DIV (no., x),
     FG (no., x), x of the '*n' mark] */
  [
    [
      ['E', 'TCA767', 277, 266, 'HP SURFACE TH STRESS (ABS)'],
      ['C', 'TCA767', 276, 373, 'HP THSC SURF LIMIT'],
      702,
      ['001', 758],
      ['A002', 918]
    ],
    [
      ['C', 'TCA754', 275, 480, 'HP BORE STRESS (ABS)'],
      ['A', 'TCA760', 274, 587, 'HP BORE LIMIT'],
      701,
      ['007', 756],
      ['A008', 916]
    ],
    [
      ['F', 'TCA767', 274, 692, 'IP SURFACE TH STRESS (ABS)'],
      ['D', 'TCA767', 273, 800, 'IP THSC SURF LIMIT'],
      700,
      ['011', 754],
      ['A012', 915]
    ],
    [
      ['C', 'TCA758', 273, 906, 'IP BORE STRESS (ABS)'],
      ['B', 'TCA760', 272, 1012, 'IP BORE LIMIT'],
      699,
      ['014', 753],
      ['A015', 914]
    ]
  ].forEach(([s, m, rx, [dn, dx], [fn, fx]], i) => {
    const y = s[3],
      ks = 's' + (i + 1),
      km = 'm' + (i + 1);
    c.push([ks, 'in', s[0], s[2], y, '', [s[1]]], [km, 'in', m[0], m[2], m[3], '', [m[1]]]);
    t.push([s[2] + 55, y - 10, s[4]], [m[2] + 55, m[3] - 10, m[4]], [fx - 20, y - 25, '*' + (i + 1)]);
    b.push(['div' + dn, 'DIV', dn, dx, y + 10], ['fg' + fn, 'FG', fn, fx, y + 10]);
    W(ks, [
      [s[2] + 27, y],
      [dx - 30, y]
    ]);
    W(km, [
      [m[2] + 27, m[3]],
      [rx, m[3]],
      [rx, y + 21],
      [dx - 30, y + 21]
    ]);
    W('div' + dn, [
      [dx + 30, y],
      [fx - 30, y]
    ]);
  });
  b.push(
    ['lsg003', 'LSG', '003', 1077, 287, [], {}, [60, 65]],
    ['lsg004', 'LSG', '004', 1238, 287, [], {}, [60, 65]],
    ['mlt005', 'MLT', '005', 1419, 276],
    ['mlt009', 'MLT', '009', 1416, 543],
    ['lsg013', 'LSG', '013', 1074, 714, [], {}, [60, 65]]
  );
  c.push(
    ['iRate', 'in', 'A', 272, 1119, '', ['TCA768A']],
    ['oA', 'out', 'A', 2057, 266, '', ['TCE190', 'TCE185'], 1],
    ['oB', 'out', 'B', 2054, 533, '', ['-']]
  );
  /* the lowest of the HP pair (LSG 003), of the IP pair (LSG 013), of both (LSG 004) */
  W('fgA002', [
    [948, 266],
    [1047, 266]
  ]);
  W('fgA008', [
    [946, 480],
    [1022, 480],
    [1022, 287],
    [1047, 287]
  ]);
  W('fgA008', [
    [1022, 309],
    [1047, 309]
  ]);
  W('lsg003', [
    [1107, 266],
    [1208, 266]
  ]);
  W('fgA012', [
    [945, 692],
    [1044, 692]
  ]);
  W('fgA015', [
    [944, 906],
    [1019, 906],
    [1019, 714],
    [1044, 714]
  ]);
  W('fgA015', [
    [1019, 735],
    [1044, 735]
  ]);
  W('lsg013', [
    [1104, 692],
    [1183, 692],
    [1183, 287],
    [1208, 287]
  ]);
  W('lsg013', [
    [1183, 309],
    [1208, 309]
  ]);
  /* times LOAD UP RATE */
  W('lsg004', [
    [1268, 266],
    [1389, 266]
  ]);
  W('lsg004', [
    [1344, 266],
    [1344, 533],
    [1386, 533]
  ]);
  W('iRate', [
    [299, 1119],
    [1363, 1119],
    [1363, 287],
    [1389, 287]
  ]);
  W('iRate', [
    [1363, 554],
    [1386, 554]
  ]);
  W('mlt005', [
    [1449, 266],
    [2030, 266]
  ]);
  W('mlt009', [
    [1446, 533],
    [2027, 533]
  ]);
  /* the table FG *1-4: n, Xn(ratio), Yn(LMT), eight rows */
  const x0 = 877,
    x1 = 921,
    x2 = 994,
    x3 = 1070,
    y0 = 1256,
    y1 = 1277,
    y2 = 1299,
    row = k => Math.round(y2 + 21.4 * k),
    yb = row(8);
  [y0, y1, y2, ...Array.from({ length: 8 }, (_, k) => row(k + 1))].forEach(y =>
    l.push([
      [x0, y],
      [x3, y]
    ])
  );
  [x0, x1, x3].forEach(x =>
    l.push([
      [x, y0],
      [x, yb]
    ])
  );
  l.push([
    [x2, y1],
    [x2, yb]
  ]);
  t.push(
    [(x1 + x3) / 2, 1267, 'FG *1-4', 1],
    [(x0 + x1) / 2, 1288, 'n', 1],
    [(x1 + x2) / 2, 1288, 'Xn(ratio)', 1],
    [(x2 + x3) / 2, 1288, 'Yn(LMT)', 1]
  );
  [
    ['0.0', '1.0'],
    ['0.5', '1.0'],
    ['0.95', '1.0'],
    ['1.0', '0.0'],
    ['2.0', '0.0'],
    ['3.0', '0.0'],
    ['4.0', '0.0'],
    ['5.0', '0.0']
  ].forEach(([xs, ys], k) => {
    const y = row(k) + 11;
    t.push([(x0 + x1) / 2, y, String(k), 1], [(x1 + x2) / 2, y, xs, 1], [(x2 + x3) / 2, y, ys, 1]);
  });
  t.push(
    [305, 1109, 'LOAD UP RATE'],
    [1634, 256, 'LOAD UP RATE (T/R COMPENSATION)'],
    [1631, 523, 'LOAD UP RATE (DCS)'],
    [225, 1526, 'CONTROLLER:'],
    [387, 1526, 'COMM+MD'],
    [612, 1500, 'TRIGGER  :'],
    [612, 1527, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA769',
    title: 'THSC LIMIT',
    page: 197,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    c,
    b,
    w,
    l,
    v: [
      [
        [877, 1256],
        [921, 1277]
      ]
    ],
    j: [
      [1022, 309],
      [1019, 735],
      [1183, 309],
      [1344, 266],
      [1363, 554]
    ],
    t
  });
})();
