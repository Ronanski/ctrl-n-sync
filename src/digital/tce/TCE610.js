/* TCE610 EHG ANALOG OUTPUT(1) (331DM09784 page 181, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the
   page rendered 2296 wide. The eight analog outputs of the EHG controller to the PI/O table TCE970 (points 1 to 8): TARGET MW SET POINT
   FEED BACK (B1 of TCE195), TURBINE LOAD UP RATE (C of TCE185), HP TURBINE FIRST STAGE STEAM PRESS (A), (B), (C) (C1 / C2 / C3 of TCE064)
   and TURBINE SPEED (B1 of TCE143); points 7 and 8 are spares fed from SG A013 / A015 (K:0.0). Each line: the connector of the sheet that
   makes the value, its FTR mark, the PI/O mark and the box of the PI/O table with AO under it.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    b = [],
    r = [],
    g = [],
    w = [],
    t = [];
  const Y = i => Math.round(208 + 127.8 * i);
  /* one output: row, its key, the x the wire starts at, FTR number, the words of the box (the drawing leans 2 px a row) */
  const out = (i, key, from, ftr, words) => {
    const y = Y(i),
      fx = 617 - 2 * i /* FTR */,
      gx = 795 - 2 * i /* PI/O mark */,
      rx = 878 - 2 * i; /* box */
    b.push(['f' + ftr, 'o:FTR', ftr, fx, y]);
    g.push([gx, y, 'r']);
    w.push([key, [[from, y], [gx - 7, y]]], [key, [[gx + 7, y], [rx, y]], 1]);
    r.push(['', rx, y - 23, 267, 53, '']);
    words.forEach((s, n) => t.push([rx + 6, y - 4 + 21 * n, s]));
    t.push([rx + 250, y + 48, 'AO'], [gx - 57, y - 22, '(TCE970-' + (i + 1) + ')', 0, 1.7]);
  };
  [
    ['l1', 'B1', 'TCE195', '002', ['TARGET MW SET', 'POINT FEED BACK']],
    ['l2', 'C', 'TCE185', '004', ['TURBINE LOAD UP RATE']],
    ['l3', 'C1', 'TCE064', '006', ['HP TURBINE FIRST', 'STAGE STEAM PRESS(A)']],
    ['l4', 'C2', 'TCE064', '008', ['HP TURBINE FIRST', 'STAGE STEAM PRESS(B)']],
    ['l5', 'C3', 'TCE064', '010', ['HP TURBINE FIRST', 'STAGE STEAM PRESS(C)']],
    ['l6', 'B1', 'TCE143', '012', ['TURBINE SPEED']]
  ].forEach(([k, l, sh, ftr, words], i) => {
    const cx = 285 - 2 * i;
    c.push([k, 'in', l, cx, Y(i), '', [sh]]);
    out(i, k, cx + 27, ftr, words);
  });
  b.push(['sgA013', 'SG', 'A013', 252, Y(6) + 11, ['K:0.0']], ['sgA015', 'SG', 'A015', 250, Y(7) + 11, ['K:0.0']]);
  out(6, 'sgA013', 252 + 28.76, '014', ['(SPARE)']);
  out(7, 'sgA015', 250 + 28.76, '016', ['(SPARE)']);
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCE610',
    title: 'EHG ANALOG OUTPUT(1)',
    page: 181,
    ctl: 'EHG+MD',
    cycle: 30,
    f: [168, 84, 2222, 1544],
    c,
    b,
    r,
    g,
    w,
    t: [...t, [222, 1522, 'CONTROLLER:'], [384, 1522, 'EHG+MD'], [608, 1497, 'TRIGGER  :'], [608, 1524, 'CYCLE(ms):30']]
  });
})();
