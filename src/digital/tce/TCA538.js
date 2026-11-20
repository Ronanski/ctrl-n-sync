/* TCA538 CRITERIA CONDITION (331DM09788 page 108, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. The bearing shaft vibration high of each bearing: X or Y (OR 001 .. 011) of TCA537, out as a lamp of the operator
   station (CRT TCA538_1 .. _6) and on A1 .. A6; the bearings No.5 and No.6 are spare (their inputs are OFF(0) on TCA537). */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    b = [],
    c = [],
    d = [],
    j = [],
    t = [];
  /* the pairs: [X line y, input right edge, OR no., OR centre x, Y vertical x, junction x, BTR no., BTR x, lamp tip x] */
  [
    [216, 349, '001', 1157, 1103, 1262, '002', 1315, 1969],
    [355, 348, '003', 1156, 1101, 1261, '004', 1313, 1968],
    [494, 347, '005', 1155, 1101, 1260, '006', 1312, 1967],
    [632, 346, '007', 1153, 1100, 1259, '008', 1311, 1966],
    [771, 345, '009', 1152, 1099, 1258, '010', 1310, 1965],
    [909, 345, '011', 1152, 1099, 1257, '012', 1309, 1964]
  ].forEach(([y, xe, orNo, ox, vx, jx, btr, bx, tip], i) => {
    const n = i + 1,
      yy = y + 64,
      or = 'or' + orNo,
      name = n < 5 ? 'NO.' + n + ' BRG SHAFT VIBRATION HIGH' : '(SPARE)';
    c.push(
      ['iA' + n, 'in', 'A' + n, xe - 27, y, 'NO.' + n + ' BRG SHAFT VIBRATION HIGH (X)', ['TCA537']],
      ['iB' + n, 'in', 'B' + n, xe - 27, yy, 'NO.' + n + ' BRG SHAFT VIBRATION HIGH (Y)', ['TCA537']],
      ['oA' + n, 'out', 'A' + n, tip + 27, yy, '', ['-'], 1]
    );
    b.push([or, 'OR', orNo, ox, y + 11], ['btr' + btr, 'o:BTR', btr, bx, yy]);
    d.push(['crt' + n, tip + 35, y, 'out', 'TCA538_' + n, 'S', '#1C']);
    w.push(
      [
        'iA' + n,
        [
          [xe, y],
          [ox - 30, y]
        ]
      ],
      [
        'iB' + n,
        [
          [xe, yy],
          [vx, yy],
          [vx, y + 22],
          [ox - 30, y + 22]
        ]
      ],
      [
        or,
        [
          [ox + 30, y],
          [tip, y]
        ]
      ],
      [
        or,
        [
          [jx, y],
          [jx, yy],
          [tip, yy]
        ]
      ]
    );
    j.push([jx, y]);
    t.push([n < 5 ? 1480 : 1475, y - 11, name], [n < 5 ? 1480 : 1475, yy - 11, name]);
  });
  t.push([231, 1531, 'CONTROLLER:'], [391, 1531, 'COMM+MD'], [653, 1504, 'TRIGGER  :'], [653, 1530, 'CYCLE(ms):100']);
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA538',
    title: 'CRITERIA CONDITION',
    page: 108,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [160, 85, 2208, 1550],
    c,
    d,
    b,
    w,
    j,
    t
  });
})();
