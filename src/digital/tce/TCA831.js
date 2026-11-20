/* TCA831 COMM DIGITAL OUTPUT(2) (331DM09788 page 235, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. Sixteen digital outputs of the COMM controller (PI/O table TCA980, points 17 to 32): the turbine start-up modes of TCA500,
   TURBINE LOAD HOLD, the 41 open commands, PSS and PF control on / off, RATED SPEED and ST TRIP; two points are spare.
   The words are the ones of the drawing (41 OPEN COMAND FROM ATS).
   live: 52L OPEN and ST TRIP = TURBINE TRIP (tcs.js tcsLiveRead); the other lines stay without a state. */
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
  /* one output: the connector (or the reference), BTR, the PI/O mark, the box of the PI/O table with its words and DO under it */
  const row = (col, i, src, name, sheet, btr, no, words) => {
    const L = col === 0,
      y = Math.round((L ? 156 : 158) + 160.6 * i),
      cx = L ? 301 : 1315 /* connector */,
      bx = L ? 557 : 1602 /* BTR */,
      gx = L ? 674 : 1718 /* PI/O mark */,
      rx = L ? 788 : 1831 /* box */,
      two = words.length > 1,
      key = (L ? 'l' : 'r') + (i + 1);
    if (src === 'OFF(0)') k.push([key, cx - 84, y, 'OFF(0)', 'sys.ref']);
    else c.push([key, 'in', src, cx, y, name, [sheet]]);
    b.push(['btr' + btr, 'o:BTR', btr, bx, y]);
    g.push([gx, y, 'r']);
    w.push(
      [
        key,
        [
          [src === 'OFF(0)' ? cx + 150 : cx + 27, y],
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
    r.push(['', rx, y - (two ? 28 : 17), 289, two ? 53 : 33, '']);
    l.push([
      [rx + 21, y - (two ? 28 : 17)],
      [rx + 21, y + (two ? 25 : 16)]
    ]);
    words.forEach((s, n) => t.push([rx + 27, y + (two ? -3 + 22 * n : 8), s]));
    t.push([rx + 274, y + (two ? 46 : 36), 'DO'], [gx - 69, y - 19, '(TCA980-' + no + ')', 0, 1.7]);
  };
  [
    ['A', 'AMB.COLD MODE', 'TCA500', '001', ['TURBINE START-UP', 'AMBIENT COLD MODE']],
    ['B', 'COLD1 MODE', 'TCA500', '003', ['TURBINE START-UP', 'COLD 1 MODE']],
    ['C', 'COLD2 MODE', 'TCA500', '005', ['TURBINE START-UP', 'COLD 2 MODE']],
    ['E', 'HOT MODE', 'TCA500', '007', ['TURBINE START-UP', 'HOT MODE']],
    ['D', 'WARM MODE', 'TCA500', '009', ['TURBINE START-UP', 'WARM MODE']],
    ['B6', 'LOAD HOLD', 'TCA584', '011', ['TURBINE LOAD HOLD']],
    ['OFF(0)', '', '', '013', ['SPARE']],
    ['D1', '41 OPEN COMMAND', 'TCA587', '015', ['3-41 OPEN COMMAND']]
  ].forEach(([src, name, sheet, btr, words], i) => row(0, i, src, name, sheet, btr, 17 + i, words));
  [
    ['D', '52L OPEN', 'TCA103', '002', ['SPARE']],
    ['B', 'FIELD SWITCH OPEN', 'TCA587', '004', ['41 OPEN COMAND FROM ATS']],
    ['D1', 'TCA745', 'TCA745', '006', ['PSS ON']],
    ['D2', '', 'TCA745', '008', ['PSS OFF']],
    ['D3', '', 'TCA745', '010', ['PF CONTROL ON']],
    ['D4', '', 'TCA745', '012', ['PF CONTROL OFF']],
    ['C', '', 'TCA539', '014', ['RATED SPEED']],
    ['B1', '', 'TCA825', '016', ['ST TRIP']]
  ].forEach(([src, name, sheet, btr, words], i) => row(1, i, src, name, sheet, btr, 25 + i, words));
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA831',
    title: 'COMM DIGITAL OUTPUT(2)',
    page: 235,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    live: { r1: 'l52o', r8: 'trip' },
    k,
    c,
    b,
    r,
    g,
    l,
    w,
    t: [
      ...t,
      [226, 1528, 'CONTROLLER:'],
      [387, 1528, 'COMM+MD'],
      [611, 1504, 'TRIGGER  :'],
      [611, 1530, 'CYCLE(ms):100']
    ]
  });
})();
