/* TCA833 COMM DIGITAL OUTPUT(4) (331DM09788 page 237, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. Sixteen digital outputs of the COMM controller (PI/O table TCA981, points 17 to 32): the start commands of the oil
   purifier pump, the space heaters (AC exciter, generator), the main oil tank vapour extractor and the gland steam exhauster, REACTIVE POWER
   ON / OFF, EXCITATION START 41CLOSE, and the PLU1..3 / EOS1..3 tests; two points are spare (OFF(0)).
   The words are the ones of the drawing, broken where it breaks them (START COMMA / ND).
   live: none; the engine holds no state of these commands, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    k = [],
    b = [],
    r = [],
    g = [],
    l = [],
    w = [],
    t = [];
  /* one output: [letter of the connector ('' = OFF(0)), sheet, x of the connector (of the tip of the reference), words at the connector as
     [words, y from the line], BTR, 1 = a box two lines high, words in the box]; col 0 = the left half of the sheet, 1 = the right half */
  const row = (col, i, [letter, sheet, cx, names, btr, tall, words]) => {
    const y = (col ? 159 : 156) + 160 * i,
      bx = col ? 1606 : 563,
      gx = col ? 1722 : 678,
      rx = col ? 1833 : 791,
      key = (col ? 'r' : 'l') + (i + 1),
      top = y - (tall ? 27 : 16);
    if (letter) c.push([key, 'in', letter, cx, y, '', [sheet]]);
    else k.push([key, cx - 234, y, 'OFF(0)', 'sys.ref']);
    w.push(
      [
        key,
        [
          [letter ? cx + 27 : cx, y],
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
    b.push(['btr' + btr, 'o:BTR', btr, bx, y]);
    g.push([gx, y, 'r']);
    r.push(['', rx, top, 288, tall ? 54 : 32, '']);
    l.push([
      [rx + 21, top],
      [rx + 21, top + (tall ? 54 : 32)]
    ]);
    names.forEach(([s, dy]) => t.push([cx + 32, y + dy, s]));
    words.forEach((s, n) => t.push([rx + 27, y + (words.length > 1 ? -3 + 22 * n : tall ? -3 : 8), s]));
    t.push(
      [rx + 273, top + (tall ? 75 : 53), 'DO'],
      [gx - 69, y - 19, '(TCA981-' + (col ? 25 + i : 17 + i) + ')', 0, 1.7]
    );
  };
  [
    ['A1', 'TCA700', 343, [], '001', 1, ['OIL PURIFIER PUMP START', 'COMMAND']],
    ['A2', 'TCA729', 341, [], '003', 1, ['SPACE HEATER START COMMA', 'ND (AC EXCITER)']],
    ['A1', 'TCA729', 339, [], '005', 1, ['SPACE HEATER START COMMA', 'ND (GEN)']],
    [
      'A1',
      'TCA655',
      337,
      [
        ['MAIN OIL TANK', -54],
        ['VAPOUR EXTRACTOR', -33],
        ['START COMMAND', -11]
      ],
      '007',
      1,
      ['MAIN OIL TANK VAPOUR', ' EXTRACTOR START COMMAND']
    ],
    ['A1', 'TCA680', 335, [], '009', 1, ['GLAND STEAM EXHAUSTER', 'START COMMAND']],
    ['D5', 'TCA745', 335, [['REACTIVE POWER ON', -32]], '011', 1, ['REACTIVE POWER ON']],
    ['D6', 'TCA745', 323, [['REACTIVE POWER OFF', -33]], '013', 0, ['REACTIVE POWER OFF']],
    ['D2', 'TCA587', 310, [['41 CLOSE COMMAND', -8]], '015', 0, ['EXCITATION START 41CLOSE']]
  ].forEach((q, i) => row(0, i, q));
  [
    ['', '', 1532, [], '002', 0, ['(SPARE)']],
    ['', '', 1530, [], '004', 0, ['(SPARE)']],
    ['A1', 'TCA780', 1362, [], '006', 0, ['PLU1 TEST']],
    ['A2', 'TCA780', 1360, [], '008', 0, ['PLU2 TEST']],
    ['A3', 'TCA780', 1358, [], '010', 0, ['PLU3 TEST']],
    ['A1', 'TCA781', 1356, [], '012', 0, ['EOS1 TEST']],
    ['A2', 'TCA781', 1355, [], '014', 0, ['EOS2 TEST']],
    ['A3', 'TCA781', 1353, [], '016', 0, ['EOS3 TEST']]
  ].forEach((q, i) => row(1, i, q));
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA833',
    title: 'COMM DIGITAL OUTPUT(4)',
    page: 237,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    k,
    c,
    b,
    r,
    g,
    l,
    w,
    t: [
      ...t,
      [232, 1528, 'CONTROLLER:'],
      [392, 1528, 'COMM+MD'],
      [617, 1504, 'TRIGGER  :'],
      [617, 1530, 'CYCLE(ms):100']
    ]
  });
})();
