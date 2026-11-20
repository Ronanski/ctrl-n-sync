/* TCA835 COMM DIGITAL OUTPUT(6) (331DM09788 page 239, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. Sixteen digital outputs of the COMM controller (PI/O table TCA982, points 17 to 32): the LP exhaust hood water spray valve
   solenoid valve, the No.5 extraction steam, No.3 extraction steam primary and No.4 extraction steam non return valve energize commands (TCA738 /
   715 / 712 / 713); the other twelve points are spare (OFF(0)). The A1 line of TCA712 steps down once before its BTR, as drawn. The words are the ones of the drawing.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
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
  const row = (col, i, src, sheet, btr, no, words) => {
    const L = col === 0,
      off = src === 'OFF(0)',
      y = Math.round((L ? 157 : 160) + 159.8 * i),
      cx = L ? (off ? 330 : 346) : 1383 /* connector */,
      bx = L ? 571 : 1614 /* BTR */,
      gx = L ? 685 : 1727 /* PI/O mark */,
      rx = L ? (off ? 792 : 767) : 1842 /* box */,
      rw = L ? (off ? 288 : 352) : 288,
      two = words.length > 1,
      key = (L ? 'l' : 'r') + (i + 1);
    if (off) k.push([key, cx - 84, y, 'OFF(0)', 'sys.ref']);
    else c.push([key, 'in', src, cx, y, '', [sheet]]);
    b.push(['btr' + btr, 'o:BTR', btr, bx, y]);
    g.push([gx, y, 'r']);
    const yc = src === 'A1' && sheet === 'TCA712' ? y - 11 : y /* the connector of TCA712 sits 11 higher */;
    if (yc !== y) c[c.length - 1][4] = yc;
    w.push([key, yc === y ? [[off ? cx + 150 : cx + 27, y], [gx - 7, y]] : [[cx + 27, yc], [545, yc], [545, y], [gx - 7, y]]], [key, [[gx + 7, y], [rx, y]], 1]);
    r.push(['', rx, y - (two ? 28 : 17), rw, two ? 53 : 33, '']);
    l.push([[rx + 21, y - (two ? 28 : 17)], [rx + 21, y + (two ? 25 : 16)]]);
    words.forEach((s, n) => t.push([rx + 27, y + (two ? -3 + 22 * n : 8), s]));
    t.push([rx + rw - 15, y + (two ? 46 : 36), 'DO'], [gx - 69, y - 19, '(TCA982-' + no + ')', 0, 1.7]);
  };
  [
    ['A1', 'TCA738', '001', ['LP EXH HOOD WATER SPRAY VLV SO', 'LENOID VALVE ENERGIZE COMMAND']],
    ['A1', 'TCA715', '003', ['NO.5 EXTRACTION STEAM NON', 'RETURN VALVE ENERGIZE COMMAND']],
    ['A1', 'TCA712', '005', ['NO.3 EXTRACTION STM PRIMARY NO', 'N RETURN VLV ENERGIZE COMMAND']],
    ['A1', 'TCA713', '007', ['NO.4 EXTRACTION STM NON RETURN', ' VALVE ENERGIZE COMMAND']],
    ['OFF(0)', '', '009', ['(SPARE)']],
    ['OFF(0)', '', '011', ['(SPARE)']],
    ['OFF(0)', '', '013', ['(SPARE)']],
    ['OFF(0)', '', '015', ['(SPARE)']]
  ].forEach(([src, sheet, btr, words], i) => row(0, i, src, sheet, btr, 17 + i, words));
  ['002', '004', '006', '008', '010', '012', '014', '016'].forEach((btr, i) => row(1, i, 'OFF(0)', '', btr, 25 + i, ['(SPARE)']));
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA835',
    title: 'COMM DIGITAL OUTPUT(6)',
    page: 239,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [164, 82, 2232, 1544],
    k,
    c,
    b,
    r,
    g,
    l,
    w,
    t: [
      ...t,
      [234, 1518, 'CONTROLLER:'],
      [395, 1518, 'COMM+MD'],
      [620, 1498, 'TRIGGER  :'],
      [620, 1525, 'CYCLE(ms):100']
    ]
  });
})();
