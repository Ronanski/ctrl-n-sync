/* TCA834 COMM DIGITAL OUTPUT(5) (331DM09788 page 238, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. Sixteen digital outputs of the COMM controller (PI/O table TCA982, points 1 to 16): the cold reheat non return valve SV,
   the No.3 and No.2 extraction steam non return valve and the steam seal diverting valve solenoid valve energize commands (TCA690 / 714 / 711 /
   605); the other twelve points are spare (OFF(0)). The words are the ones of the drawing.
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
      y = Math.round((L ? 154 : 153) + 159.7 * i),
      cx = L ? (off ? 331 : 341) : 1382 /* connector */,
      bx = L ? 568 : 1612 /* BTR */,
      gx = L ? 681 : 1726 /* PI/O mark */,
      rx = L ? (off ? 793 : 765) : 1842 /* box */,
      rw = L ? (off ? 288 : 353) : 289,
      two = words.length > 1,
      key = (L ? 'l' : 'r') + (i + 1);
    if (off) k.push([key, cx - 84, y, 'OFF(0)', 'sys.ref']);
    else c.push([key, 'in', src, cx, y, '', [sheet]]);
    b.push(['btr' + btr, 'o:BTR', btr, bx, y]);
    g.push([gx, y, 'r']);
    w.push([key, [[off ? cx + 150 : cx + 27, y], [gx - 7, y]]], [key, [[gx + 7, y], [rx, y]], 1]);
    r.push(['', rx, y - (two ? 28 : 17), rw, two ? 53 : 33, '']);
    l.push([[rx + 21, y - (two ? 28 : 17)], [rx + 21, y + (two ? 25 : 16)]]);
    words.forEach((s, n) => t.push([rx + 27, y + (two ? -3 + 22 * n : 8), s]));
    t.push([rx + rw - 15, y + (two ? 46 : 36), 'DO'], [gx - 69, y - 19, '(TCA982-' + no + ')', 0, 1.7]);
  };
  [
    ['A1', 'TCA690', '001', ['COLD REHEAT  NON RETURN VALVE', 'SV ENERGIZE COMMAND']],
    ['A1', 'TCA714', '003', ['NO.3 EXTRACTION STEAM NON RETU', 'RN VALVE ENERGIZE COMMAND']],
    ['A1', 'TCA711', '005', ['NO.2 EXTRACTION STEAM NON RETU', 'RN VALVE ENERGIZE COMMAND']],
    ['A1', 'TCA605', '007', ['STEAM SEAL DIVERTING VALVE', ' SOLENOID VALVE ENERGIZE COMMAND']],
    ['OFF(0)', '', '009', ['(SPARE)']],
    ['OFF(0)', '', '011', ['(SPARE)']],
    ['OFF(0)', '', '013', ['(SPARE)']],
    ['OFF(0)', '', '015', ['(SPARE)']]
  ].forEach(([src, sheet, btr, words], i) => row(0, i, src, sheet, btr, 1 + i, words));
  ['002', '004', '006', '008', '010', '012', '014', '016'].forEach((btr, i) => row(1, i, 'OFF(0)', '', btr, 9 + i, ['(SPARE)']));
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA834',
    title: 'COMM DIGITAL OUTPUT(5)',
    page: 238,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [172, 76, 2232, 1542],
    k,
    c,
    b,
    r,
    g,
    l,
    w,
    t: [
      ...t,
      [239, 1517, 'CONTROLLER:'],
      [400, 1517, 'COMM+MD'],
      [624, 1495, 'TRIGGER  :'],
      [624, 1522, 'CYCLE(ms):100']
    ]
  });
})();
