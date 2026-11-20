/* TCE603 EHG DIGITAL OUTPUT(4) (331DM09784 page 180, controller EHG+MD, cycle 10 ms). Typed from the drawing; units = the pixels of the
   page rendered 2296 wide (this page sits about 11 px to the right of TCE600). Sixteen digital outputs of the EHG controller (PI/O table
   TCE961, points 17 to 32): TURNING GEAR ENGAGE SOLENOID VALVE (B of TCE352), TURNING GEAR ENGAGE (LAMP) (N of TCE350) and TURNING GEAR
   MOTOR START (LAMP) (M of TCE350); the other thirteen points are spare (OFF(0)). The words are the ones of the drawing.
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
      bx = Math.round((L ? 574 : 1618) + d) /* BTR */,
      gx = Math.round((L ? 688 : 1731) + 1.3 * d) /* PI/O mark */,
      rx = Math.round((L ? 804 : 1846) + 1.6 * d) /* box */,
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
    t.push([rx + rw - 15, y + 48, 'DO'], [gx - 69, y - 19, '(TCE961-' + (L ? i + 17 : i + 25) + ')', 0, 1.7]);
    above.forEach((s, n) => t.push([cx + 35, y + (above.length > 1 ? -30 + 21 * n : -9), s]));
  };
  [
    ['B', 'TCE352', '001', ['TURNING GEAR ENGAGE', 'SOLENOID VALVE'], ['TURNING GEAR ENGAGE', 'SOL VLV ENERGIZE'], 297],
    ['N', 'TCE350', '003', ['TURNING GEAR ENGAGE', '(LAMP)'], ['TURNING GEAR ENGAGE IND'], 295],
    ['M', 'TCE350', '005', ['TURNING GEAR MOTOR START', '(LAMP)'], ['TURNING GEAR', 'MOTOR RUNNING IND'], 293],
    ['OFF(0)', '', '007', ['(SPARE)'], [], 487],
    ['OFF(0)', '', '009', ['(SPARE)'], [], 485],
    ['OFF(0)', '', '011', ['(SPARE)'], [], 483],
    ['OFF(0)', '', '013', ['(SPARE)'], [], 481],
    ['OFF(0)', '', '015', ['(SPARE)'], [], 479],
  ].forEach(([src, sheet, btr, words, above, cx, x0], i) => row(0, i, src, sheet, btr, words, above, cx, x0));
  [
    ['OFF(0)', '', '002', ['(SPARE)'], [], 1537],
    ['OFF(0)', '', '004', ['(SPARE)'], [], 1535],
    ['OFF(0)', '', '006', ['(SPARE)'], [], 1533],
    ['OFF(0)', '', '008', ['(SPARE)'], [], 1531],
    ['OFF(0)', '', '010', ['(SPARE)'], [], 1529],
    ['OFF(0)', '', '012', ['(SPARE)'], [], 1527],
    ['OFF(0)', '', '014', ['(SPARE)'], [], 1525],
    ['OFF(0)', '', '016', ['(SPARE)'], [], 1523],
  ].forEach(([src, sheet, btr, words, above, cx, x0], i) => row(1, i, src, sheet, btr, words, above, cx, x0));
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCE603',
    title: 'EHG DIGITAL OUTPUT(4)',
    page: 180,
    ctl: 'EHG+MD',
    cycle: 10,
    f: [178, 86, 2234, 1546],
    k,
    c,
    b,
    r,
    g,
    l,
    w,
    j,
    t: [...t, [234, 1527, 'CONTROLLER:'], [396, 1527, 'EHG+MD'], [658, 1504, 'TRIGGER  :'], [658, 1529, 'CYCLE(ms):10']]
  });
})();
