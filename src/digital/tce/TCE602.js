/* TCE602 EHG DIGITAL OUTPUT(3) (331DM09784 page 179, controller EHG+MD, cycle 10 ms). Typed from the drawing; units = the pixels of the
   page rendered 2296 wide. Sixteen digital outputs of the EHG controller (PI/O table TCE961, points 1 to 16): the control oil pump (B)
   and main oil pump (B) start commands (TCE305 / TCE300), ASD1 START SIGNAL (52G) (TCE178), DCS CONTROL MODE PERMISSIVE (TCE180),
   POWER LOAD UNBALANCE RY OPERATED (TCE095), RSV/ICV and MSV/ICV FULL CLOSE to the boiler reheater protection (TCE250), EHG SOFT NOT
   MAJOR TROUBLE (TCE472) and EHG SOFT MAJOR TROUBLE or BACKUP OVER SPEED (B8 of TCE600); point 7 carries A of TCE166 to a spare box,
   six points are spare (OFF(0)). The words are the ones of the drawing.
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
    t = [],
    j = [];
  /* one output: the source (a connector, OFF(0), or a wire end x), BTR, the PI/O mark, the box of the PI/O table with its words and DO */
  const row = (col, i, src, sheet, btr, words, above, cx, x0) => {
    const L = col === 0,
      y = Math.round((L ? 158 : 162) + 159.3 * i),
      d = (L ? -1.9 : -2.1) * i /* the drawing leans a little */,
      bx = Math.round((L ? 563 : 1607) + d) /* BTR */,
      gx = Math.round((L ? 677 : 1720) + 1.3 * d) /* PI/O mark */,
      rx = Math.round((L ? 792 : 1835) + 1.6 * d) /* box */,
      rw = L ? 290 : 288,
      key = (L ? 'l' : 'r') + (i + 1);
    let xs = x0;
    if (src === 'OFF(0)') {
      k.push([key, cx - 234, y, 'OFF(0)', 'sys.ref']);
      xs = cx;
    } else if (src) {
      c.push([key, 'in', src, cx, y, '', [sheet]]);
      xs = cx + 27;
    }
    b.push(['btr' + btr, 'o:BTR', btr, bx, y]);
    g.push([gx, y, 'r']);
    if (xs) w.push([key, [[xs, y], [gx - 7, y]]]);
    w.push([key, [[gx + 7, y], [rx, y]], 1]);
    r.push(['', rx, y - 28, rw, 55, '']);
    l.push([[rx + 21, y - 28], [rx + 21, y + 27]]);
    words.forEach((s, n) => t.push([rx + 27, y + (words.length > 1 ? 2 + 20 * n : 8), s]));
    t.push([rx + rw - 15, y + 48, 'DO'], [gx - 69, y - 19, '(TCE961-' + (L ? i + 1 : i + 9) + ')', 0, 1.7]);
    above.forEach((s, n) => t.push([cx + 35, y + (above.length > 1 ? -30 + 21 * n : -9), s]));
  };
  [
    ['G', 'TCE305', '001', ['CONTROL OIL PUMP(B)', 'START COMMAND'], ['COTROL OIL PUMP(B)', 'START'], 288],
    ['G', 'TCE300', '003', ['MAIN OIL PUMP(B)', 'START COMMAND'], ['MAIN OIL PUMP(B)', 'START'], 286],
    ['E', 'TCE178', '005', ['ASD1 START SIGNAL (52G)'], ['ASD1 START'], 283],
    ['OFF(0)', '', '007', ['SPARE'], [], 466],
    ['B', 'TCE180', '009', ['DCS CONTROL MODE', 'PERMISSIVE'], ['DCS CONTROL', 'MODE PERMISSIVE'], 277],
    ['OFF(0)', '', '011', ['(SPARE)'], [], 474],
    ['A', 'TCE166', '013', ['(SPARE)'], [], 285],
    ['B', 'TCE095', '015', ['POWER LOAD UNBALANCE', 'RY OPERATED'], [], 284]
  ].forEach(([src, sheet, btr, words, above, cx, x0], i) => row(0, i, src, sheet, btr, words, above, cx, x0));
  [
    ['OFF(0)', '', '002', ['(SPARE)'], [], 1528],
    ['OFF(0)', '', '004', ['(SPARE)'], [], 1526],
    ['OFF(0)', '', '006', ['(SPARE)'], [], 1524],
    ['', '', '008', ['(SPARE)'], [], 0, 1549],
    ['B', 'TCE250', '010', ['RSV/ICV FULL CLOSE'], ['BOILER REHEATER', 'PROTECTION'], 1303],
    ['C', 'TCE250', '012', ['MSV/ICV FULL CLOSE'], ['BOILER REHEATER', 'PROTECTION'], 1301],
    ['D', 'TCE472', '014', ['EHG SOFT NOT', 'MAJOR TROUBLE'], ['EHG NOT SOFT', 'MAJOR TROUBLE'], 1299],
    ['B8', 'TCE600', '016', ['EHG SOFT MAJOR TROUBLE', 'or BACKUP OVER SPEED'], ['NOT EHG SOFT MAJOR TROUBLE', 'or BACKUP OVER SPEED'], 1318]
  ].forEach(([src, sheet, btr, words, above, cx, x0], i) => row(1, i, src, sheet, btr, words, above, cx, x0));
  /* the spare point 12 shares the OFF(0) of point 11 */
  const y11 = Math.round(162 + 159.3 * 2),
    y12 = Math.round(162 + 159.3 * 3);
  w.push(['r3', [[1549, y11], [1549, y12]]]);
  j.push([1549, y11]);
  w.forEach(x => {
    if (x[0] === 'r4') x[0] = 'r3';
  });
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCE602',
    title: 'EHG DIGITAL OUTPUT(3)',
    page: 179,
    ctl: 'EHG+MD',
    cycle: 10,
    f: [168, 84, 2222, 1544],
    k,
    c,
    b,
    r,
    g,
    l,
    w,
    j,
    t: [...t, [222, 1525, 'CONTROLLER:'], [384, 1525, 'EHG+MD'], [647, 1502, 'TRIGGER  :'], [647, 1527, 'CYCLE(ms):10']]
  });
})();
