/* TCE041 DIGITAL INPUT(2) (331DM09784 page 20, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page rendered 2296 wide.
   Inputs 17 ~ 32 of the PI/O table TCE900, drawn as on TCE040; where an input also goes to the operator station (CRT) or has its B connector at
   another place, the row says so. */
(function () {
  const r = [],
    g = [],
    b = [],
    c = [],
    w = [],
    t = [],
    d = [];
  /* [the two lines of the PI/O box], [sheets of A], [sheets of B] or null (no B), dy of B from the line (75 where not given) */
  const ROWS = [
    [['DCS CONTROL MODE ON', ''], ['TCE180'], ['-']],
    [['DCS CONTROL MODE OFF', ''], ['TCE180'], ['-']],
    [['DS CLOSED', ''], ['-'], ['TCA533'], 56],
    [['52G CLOSED', ''], ['TCE053'], null],
    [['52G OPENED', ''], ['-'], ['TCA533']],
    [['SPEED RAISE', ''], ['TCE178'], ['-']],
    [['SPEED LOWER', ''], ['TCE178'], ['-']],
    [['41 CLOSE', ''], ['TCE601'], ['TCA103', 'TCT214']],
    [['41 OPEN', ''], ['-'], ['TCA535', 'TCT214'], 54],
    [['52L OPEN', ''], ['TCE053', 'TCE250'], ['TCA544', 'TCA103'], -40],
    [['HP BYPASS VALVE', 'FULL CLOSE'], ['TCE184'], ['TCA532']],
    [['SPARE', ''], ['-'], ['-']],
    [['SPARE', ''], ['-'], ['-']],
    [['SPARE', ''], ['-'], ['-']],
    [['SPARE', ''], ['-'], ['-']],
    [['DI P.S. NORMAL (AXR2)', ''], ['TCE469', 'TCE183'], ['-']]
  ];
  const P = {}; /* the places of each row, for the extra pieces below */
  ROWS.forEach(([name, ra, rb, dy], n) => {
    const right = n >= 8,
      i = n % 8,
      x0 = right ? 1214 : 200,
      top = Math.round(157 + i * 138.4),
      y = top + 27,
      no = n + 1,
      xe = x0 + 266,
      xj = x0 + 635,
      xo = x0 + 775,
      by = y + (dy == null ? 75 : dy);
    P[no] = { y, xj, xo };
    r.push(['di' + no, x0, top, 266, 54, '']);
    t.push([x0 + 6, name[1] ? top + 27 : top + 30, name[0]], [x0 + 6, top + 49, name[1]], [x0, top + 76, 'DI'], [x0 + 404, top - 2, '(TCE900-' + (no + 16) + ')']);
    w.push(['di' + no, [[xe, y], [xe + 118, y]], 1], ['di' + no, [[xe + 134, y], [xo - 30, y]]]);
    if (rb) {
      w.push(['di' + no, [[xj, y], [xj, by], [xo - 30, by]]]);
      c.push(['b' + no, 'out', 'B' + no, xo, by, '', rb, 1]);
    }
    g.push([xe + 126, y, 'l']);
    b.push(['btr' + no, 'o:BTR', String(right ? 2 * i + 2 : 2 * i + 1).padStart(3, '0'), x0 + 530, y]);
    c.push(['a' + no, 'out', 'A' + no, xo, y, '', ra]);
  });
  /* input 3 DS CLOSED: also to the CRT, under its B connector */
  w.push(['di3', [[P[3].xj, P[3].y + 56], [P[3].xj, P[3].y + 97], [1018, P[3].y + 97]]]);
  d.push(['crt3', 1035, P[3].y + 97, 'out', 'TCE041_3', 'S', '#1C']);
  /* input 4 52G CLOSED: no B connector; to the CRT through BTR 018 */
  w.push(['di4', [[P[4].xj, P[4].y], [P[4].xj, P[4].y + 73], [953, P[4].y + 73]]]);
  b.push(['btr018', 'o:BTR', '018', 851, P[4].y + 73]);
  d.push(['crt4', 970, P[4].y + 73, 'out', 'TCE041_4', 'S', '#1C']);
  t.push([848, 628, '52G'], [848, 650, 'CLOSED'], [922, 853, '(TCT072)']);
  /* input 9 41 OPEN: also to the CRT, over its line */
  w.push(['di9', [[P[9].xj, P[9].y], [P[9].xj, P[9].y - 62], [1968, P[9].y - 62]]]);
  d.push(['crt9', 1985, P[9].y - 62, 'out', 'TCE041_9', 'S', '#1C']);
  /* input 10 52L OPEN: its B connector is over the line; to the CRT through BTR 019 under it */
  w.push(['di10', [[P[10].xj, P[10].y], [P[10].xj, P[10].y + 76], [1966, P[10].y + 76]]]);
  b.push(['btr019', 'o:BTR', '019', 1866, P[10].y + 76]);
  d.push(['crt10', 1983, P[10].y + 76, 'out', 'TCE041_10', 'S', '#1C']);
  t.push([1872, 353, '52L'], [1872, 374, 'OPEN']);
  /* the PI/O error of the card */
  r.push(['pioErr', 1340, 1290, 125, 22, 'PI/O error']);
  t.push([1353, 1285, '(TCE900-17)']);
  w.push(['pioErr', [[1465, 1301], [1946, 1301]]]);
  b.push(['btr17', 'o:BTR', '017', 1732, 1301]);
  c.push(['oF', 'out', 'F', 1976, 1301, '', ['TCE465']]);
  t.push([227, 1530, 'CONTROLLER:'], [387, 1530, 'EHG+MD'], [612, 1503, 'TRIGGER  :'], [612, 1530, 'CYCLE(ms):30']);
  (typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
    id: 'TCE041',
    title: 'DIGITAL INPUT(2)',
    page: 20,
    ctl: 'EHG+MD',
    cycle: 30,
    f: [168, 87, 2221, 1548],
    r,
    g,
    b,
    c,
    d,
    w,
    t
  });
})();
