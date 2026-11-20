/* TCA832 COMM DIGITAL OUTPUT(3) (331DM09788 page 236, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. Sixteen digital outputs of the COMM controller (PI/O table TCA981, points 1 to 16): the open / close commands of the
   CRV(B) below seat, MSV(B) and CV(B) above seat secondary drain valves, of the HP turbine warming line drain valve and the HP turbine warming
   valve, and EXCITATION START / AUTO / MANUAL; three points are spare (OFF(0)).
   The words are the ones of the drawing, broken where it breaks them (SECDRAIN VALVEO / PEN COMMAND, SECONDAR / Y; the input of point 2 is
   printed CRV(A), its output CRV (B)).
   live: none; the engine holds no state of these commands, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    b = [],
    r = [],
    g = [],
    l = [],
    w = [],
    t = [],
    Y = i => 154 + 160 * i;
  /* one output: [letter of the connector ('' = fed by OFF(0)), sheet, x of the connector, words at the connector, BTR, x and width of the box,
     1 = a box two lines high, words in the box]; col 0 = the left half of the sheet, 1 = the right half */
  const row = (col, i, [letter, sheet, cx, names, btr, rx, rw, tall, words]) => {
    const y = Y(i),
      bx = col ? 1606 : 563,
      gx = col ? 1722 : 680,
      key = (col ? 'r' : 'l') + (i + 1),
      top = y - (tall ? 27 : 16);
    if (letter) {
      c.push([key, 'in', letter, cx, y, '', [sheet]]);
      w.push(
        [
          key,
          [
            [cx + 27, y],
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
    } else
      w.push([
        'kOff',
        [
          [gx + 7, y],
          [rx, y]
        ],
        1
      ]);
    b.push(['btr' + btr, 'o:BTR', btr, bx, y]);
    g.push([gx, y, 'r']);
    r.push(['', rx, top, rw, tall ? 54 : 32, '']);
    l.push([
      [rx + 21, top],
      [rx + 21, top + (tall ? 54 : 32)]
    ]);
    names.forEach((s, n) =>
      t.push([cx + 32, y - 11 - 21.5 * (names.length - 1 - n) - (names.length === 1 ? 31 : 0), s])
    );
    words.forEach((s, n) => t.push([rx + 27, y + (words.length > 1 ? -3 + 22 * n : tall ? -3 : 8), s]));
    t.push(
      [rx + rw - 15, top + (tall ? 75 : 53), 'DO'],
      [gx - 69, y - 19, '(TCA981-' + (col ? 9 + i : 1 + i) + ')', 0, 1.7]
    );
  };
  [
    [
      'A1',
      'TCA626',
      341,
      ['CRV(B) BEL SEAT', 'SECDRAIN VALVEO', 'PEN COMMAND'],
      '001',
      764,
      352,
      1,
      ['CRV (B) BELOW SEAT SECONDAR', 'Y DRAIN VALVE OPEN COMMAND']
    ],
    [
      'A2',
      'TCA626',
      341,
      ['CRV(A) BEL SEAT', 'SECDRAIN VALVE', 'CLOSE COMMAND'],
      '003',
      763,
      352,
      1,
      ['CRV (B) BELOW SEAT SECONDARY', 'DRAIN VALVE CLOSE COMMAND']
    ],
    ['', '', 0, [], '005', 794, 288, 1, ['(SPARE)']],
    ['', '', 0, [], '007', 792, 288, 1, ['(SPARE)']],
    ['', '', 0, [], '009', 760, 352, 1, ['(SPARE)']],
    [
      'A1',
      'TCA611',
      338,
      ['MSV(B) ABV SEAT', 'SECDRAIN VALVE', 'OPEN COMMAND'],
      '011',
      759,
      352,
      1,
      ['MSV (B) ABOVE SEAT SECONDARY', 'DRAIN VALVE OPEN COMMAND']
    ],
    [
      'A2',
      'TCA611',
      337,
      ['MSV(B) ABV SEAT', 'SECDRAIN VALVE', 'CLOSE COMMAND'],
      '013',
      758,
      352,
      1,
      ['MSV (B) ABOVE SEAT SECONDARY', 'DRAIN VALVE CLOSE COMMAND']
    ],
    ['A2', 'TCA632', 336, [], '015', 757, 352, 1, ['HP TURBINE WARMING LINE DRAIN', 'VALVE CLOSE COMMAND']]
  ].forEach((q, i) => row(0, i, q));
  [
    ['A1', 'TCA632', 1400, [], '002', 1840, 289, 1, ['HP TURBINE WARMING LINE', 'DRAIN VALVE OPEN COMMAND']],
    [
      'B',
      'TCA686',
      1399,
      ['HP TURBINE WARMING', 'VALVE CLOSE'],
      '004',
      1838,
      289,
      1,
      ['HP TURBINE WARMING VALVE', 'CLOSE COMMAND']
    ],
    [
      'A',
      'TCA686',
      1398,
      ['HP TURBINE WARMING', 'VALVE OPEN'],
      '006',
      1836,
      289,
      1,
      ['HP TURBINE WARMING VALVE', 'OPEN COMMAND']
    ],
    [
      'A1',
      'TCA616',
      1395,
      ['CV(B) ABV SEC', 'DRAIN VALVE', 'OPEN COMMAND'],
      '008',
      1804,
      352,
      1,
      ['CV (B) ABOVE SEAT SECONDARY', 'DRAIN VALVE OPEN COMMAND']
    ],
    [
      'A2',
      'TCA616',
      1393,
      ['CV(B) ABV SEC', 'DRAIN VALVE', 'CLOSE COMMAND'],
      '010',
      1803,
      352,
      1,
      ['CV (B) ABOVE SEAT SECONDARY', 'DRAIN VALVE CLOSE COMMAND']
    ],
    ['A1', 'TCA583', 1404, ['EXCITATION START'], '012', 1833, 288, 0, ['EXCITATION START']],
    ['D3', 'TCA587', 1413, ['EXCITATION AUTO'], '014', 1831, 288, 0, ['EXCITATION AUTO']],
    ['D4', 'TCA587', 1401, ['EXCITATION MANUAL'], '016', 1830, 288, 0, ['EXCITATION MANUAL']]
  ].forEach((q, i) => row(1, i, q));
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA832',
    title: 'COMM DIGITAL OUTPUT(3)',
    page: 236,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    k: [['kOff', 248, Y(4), 'OFF(0)', 'sys.ref']],
    c,
    b,
    r,
    g,
    l,
    w: [
      /* OFF(0) into the three spare points */
      [
        'kOff',
        [
          [482, Y(4)],
          [673, Y(4)]
        ]
      ],
      [
        'kOff',
        [
          [519, Y(4)],
          [519, Y(2)],
          [673, Y(2)]
        ]
      ],
      [
        'kOff',
        [
          [519, Y(3)],
          [673, Y(3)]
        ]
      ],
      ...w
    ],
    j: [
      [519, Y(4)],
      [519, Y(3)]
    ],
    t: [
      ...t,
      [236, 1528, 'CONTROLLER:'],
      [398, 1528, 'COMM+MD'],
      [622, 1504, 'TRIGGER  :'],
      [622, 1530, 'CYCLE(ms):100']
    ]
  });
})();
