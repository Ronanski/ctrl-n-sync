/* TCE600 EHG DIGITAL OUTPUT(1) (331DM09784 page 177, controller EHG+MD, cycle 10 ms). Typed from the drawing; units = the pixels of the
   page rendered 2296 wide. Sixteen digital outputs of the EHG controller (PI/O table TCE960, points 1 to 16): the control oil pump (A)
   and main oil pump (A) start commands (TCE305 / TCE300), the DC emergency oil pump start and manual stop (TCE310), the turning gear
   motor start command (TCE351) and turning gear engaged (TCE350), RSV/ICV and MSV/ICV FULL CLOSED to the boiler reheater protection
   (TCE250), and EHG SOFT MAJOR TROUBLE or BACKUP OVER SPEED = AND 017 of NOT TURBINE BACK-UP OVER SPEED TRIP(ANN) (D2, TCE145) and
   NOT EHG SOFT MAJOR TROUBLE (D, TCE472), also B8 to TCE602; six points are spare (OFF(0)).
   The words are the ones of the drawing.
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
    t.push([rx + rw - 15, y + 48, 'DO'], [gx - 69, y - 19, '(TCE960-' + (L ? i + 1 : i + 9) + ')', 0, 1.7]);
    above.forEach((s, n) => t.push([cx + 35, y - 30 + 21 * n, s]));
  };
  [
    ['F', 'TCE305', '001', ['CONTROL OIL PUMP(A)', 'START COMMAND'], ['CONTOL OIL PUMP(A)', 'START'], 285],
    ['F', 'TCE300', '003', ['MAIN OIL PUMP(A)', 'START COMMAND'], ['MAIN OIL PUMP(A)', 'START'], 284],
    ['A', 'TCE310', '005', ['DC EMERGENCY OIL', 'PUMP START'], ['EOP START', 'COMMAND'], 282],
    ['B', 'TCE310', '007', ['DC EMERGENCY OIL', 'PUMP MANUAL STOP'], ['EOP STOP', 'COMMAND'], 280],
    ['OFF(0)', '', '009', ['(SPARE)'], [], 474],
    ['E', 'TCE351', '011', ['TURNING GEAR MOTOR', 'START COMMAND'], ['TURNING GEAR', 'MOTOR START DEMAND'], 278],
    ['OFF(0)', '', '018', ['(SPARE)'], [], 450],
    ['', '', '015', ['TURNING GEAR ENGAGED'], [], 0, 535]
  ].forEach(([src, sheet, btr, words, above, cx, x0], i) => row(0, i, src, sheet, btr, words, above, cx, x0));
  [
    ['OFF(0)', '', '002', ['(SPARE)'], [], 1528],
    ['OFF(0)', '', '004', ['(SPARE)'], [], 1528],
    ['OFF(0)', '', '006', ['(SPARE)'], [], 1527],
    ['', '', '008', ['(SPARE)'], [], 0, 1560],
    ['B', 'TCE250', '010', ['RSV/ICV FULL CLOSED'], ['BOILER REHEATER', 'PROTECTION'], 1342],
    ['C', 'TCE250', '012', ['MSV/ICV FULL CLOSED'], ['BOILER REHEATER', 'PROTECTION'], 1342],
    ['OFF(0)', '', '014', ['(SPARE)'], [], 1512],
    ['', '', '016', ['EHG SOFT MAJOR TROUBLE', 'or BACKUP OVER SPEED'], [], 0, 1474]
  ].forEach(([src, sheet, btr, words, above, cx, x0], i) => row(1, i, src, sheet, btr, words, above, cx, x0));
  /* the spare point 12 shares the OFF(0) of point 11 */
  const y11 = Math.round(162 + 159.3 * 2),
    y12 = Math.round(162 + 159.3 * 3);
  w.push(['r3', [[1560, y11], [1560, y12]]]);
  j.push([1560, y11]);
  w.forEach(x => {
    if (x[0] === 'r4') x[0] = 'r3';
  });
  /* TURNING GEAR ENGAGED (A1 of TCE350) */
  const y8 = Math.round(158 + 159.3 * 7);
  c.push(['l8', 'in', 'A1', 289, y8 - 11, '', ['TCE350']]);
  w.push(['l8', [[316, y8 - 11], [535, y8 - 11], [535, y8]]]);
  /* EHG SOFT MAJOR TROUBLE or BACKUP OVER SPEED */
  const y16 = Math.round(162 + 159.3 * 7);
  c.push(['iBk', 'in', 'D2', 1180, y16, '', ['TCE145']], ['iEhg', 'in', 'D', 1177, y16 + 89, '', ['TCE472']], ['oB8', 'out', 'B8', 1598, y16 + 77, '', ['TCE602']]);
  b.push(['and017', 'A', '017', 1444, y16 + 11]);
  w.push(
    ['iBk', [[1207, y16], [1444 - 28.76, y16]]],
    ['iEhg', [[1204, y16 + 89], [1389, y16 + 89], [1389, y16 + 22], [1444 - 28.76, y16 + 22]]],
    ['and017', [[1509, y16], [1509, y16 + 77], [1598 - 27, y16 + 77]]]
  );
  w.forEach(x => {
    if (x[0] === 'r8') x[0] = 'and017';
  });
  j.push([1509, y16]);
  t.push(
    [1212, y16 - 25, 'NOT TURBINE BACK-UP OVER'],
    [1216, y16 - 5, ' SPEED TRIP(ANN)'],
    [1212, y16 + 60, 'NOT EHG SOFT'],
    [1212, y16 + 82, 'MAJOR TROUBLE']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCE600',
    title: 'EHG DIGITAL OUTPUT(1)',
    page: 177,
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
