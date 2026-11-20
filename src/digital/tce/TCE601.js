/* TCE601 EHG DIGITAL OUTPUT(2) (331DM09784 page 178, controller EHG+MD, cycle 10 ms). Typed from the drawing; units = the pixels of the
   page rendered 2296 wide. Sixteen digital outputs of the EHG controller (PI/O table TCE960, points 17 to 32): 52L OPEN FOR HOUSE LOAD
   OPERATION, HP-CV FULL CLOSE and TURBINE TRIP (TCE250), TURBINE SPEED <2400RPM (TCE143), ACCELERATION RELAY OPERATED (TCE166), DCS MODE
   ON FEEDBACK (TCE180), ASD2 START SIGNAL (52L) (TCE178), MSV/CV(A) and (B) SEQUENTIAL FULL CLOSE TEST EXC. (TCE220), 41 CLOSE (TCE041),
   GEN. LOCKOUT RELAY (86G)A / B OPERATED (TCE076 / TCE084) and ICV TO CV TRANSFER COMPLETE (TCE184); three points are spare (OFF(0)).
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
    t.push([rx + rw - 15, y + 48, 'DO'], [gx - 69, y - 19, '(TCE960-' + (L ? i + 17 : i + 25) + ')', 0, 1.7]);
    above.forEach((s, n) => t.push([cx + 35, y + (above.length > 1 ? -30 + 21 * n : -9), s]));
  };
  [
    ['D', 'TCE250', '001', ['52L OPEN FOR HOUSE', 'LOAD OPERATION'], ['FOR HOUSE', 'LOAD OPERATION'], 297],
    ['M', 'TCE143', '003', ['TURBINE SPEED <2400RPM'], ['TURBINE SPEED', '<2400RPM'], 285],
    ['A', 'TCE166', '005', ['ACCELERATION RELAY', 'OPERATED'], ['ACC.RELAY OPERATED'], 282],
    ['A', 'TCE180', '007', ['DCS MODE ON FEEDBACK'], ['DCS CONTROL', 'MODE ON'], 280],
    ['OFF(0)', '', '009', ['SPARE'], [], 474],
    ['OFF(0)', '', '011', ['SPARE'], [], 472],
    ['OFF(0)', '', '013', ['SPARE'], [], 450],
    ['F', 'TCE178', '015', ['ASD2 START SIGNAL (52L)'], ['ASD2 START SIGNAL'], 282]
  ].forEach(([src, sheet, btr, words, above, cx, x0], i) => row(0, i, src, sheet, btr, words, above, cx, x0));
  [
    ['H', 'TCE250', '002', ['HP-CV FULL CLOSE', '(BOTH CV(A) & (B))'], [], 1352],
    ['G', 'TCE250', '004', ['TURBINE TRIP', '(MSV,RSV,ICV CLOSE)'], [], 1350],
    ['C', 'TCE220', '006', ['MSV/CV(A) SEQUENTIAL', 'FULL CLOSE TEST EXC.'], [], 1348],
    ['D', 'TCE220', '008', ['MSV/CV(B) SEQUENTIAL', 'FULL CLOSE TEST EXC.'], [], 1346],
    ['A8', 'TCE041', '010', ['41 CLOSE'], [], 1343],
    ['D', 'TCE076', '012', ['GEN. LOCKOUT RELAY', '(86G)A OPERATED'], [], 1341],
    ['D', 'TCE084', '014', ['GEN. LOCKOUT RELAY', '(86G)B OPERATED'], [], 1340],
    ['C', 'TCE184', '016', ['ICV TO CV TRANSFER', 'COMPLETE'], [], 1328]
  ].forEach(([src, sheet, btr, words, above, cx, x0], i) => row(1, i, src, sheet, btr, words, above, cx, x0));
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCE601',
    title: 'EHG DIGITAL OUTPUT(2)',
    page: 178,
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
