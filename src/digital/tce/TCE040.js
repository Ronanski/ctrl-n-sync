/* TCE040 DIGITAL INPUT(1) (331DM09784 page 19, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page rendered 2296 wide.
   Sixteen inputs of the PI/O table TCE900, eight at the left and eight at the right, each drawn the same way: the PI/O box, the connection mark, the
   BTR mark, connector A (to its logic sheet) and connector B under it. The rows are counted here as the drawing counts them. */
(function () {
  const r = [],
    g = [],
    b = [],
    c = [],
    w = [],
    t = [],
    d = [];
  /* [the two lines of the PI/O box], [sheets of A], [sheets of B] */
  const ROWS = [
    [['CONTROL OIL PUMP(A)', 'RUNNING'], ['TCE305'], ['-']],
    [['CONTROL OIL PUMP(A)', 'ELECTRICAL TROUBLE'], ['TCE305'], ['-']],
    [['MAIN OIL PUMP(A)', 'RUNNING'], ['TCE300'], ['-']],
    [['MAIN OIL PUMP(A)', 'MOTOR ELECTRICAL TROUBLE'], ['TCE300', 'TCE310'], ['-']],
    [['DC EMERGENCY', 'OIL PUMP RUNNING'], ['TCE310'], ['-']],
    [['DC EMERGENCY OIL', 'PUMP ELECTRICAL TROUBLE'], ['TCE310'], ['-']],
    [['BEARING OIL PRESS.', '(FOR EOP AUTO START)'], ['TCE310'], ['TCT081']],
    [['HAND TURNING', 'INTERLOCK POSITION'], ['TCE350'], ['TCT081']],
    [['TURNING GEAR', 'ENGAGE POSITION'], ['TCE350'], ['TCT081']],
    [['TURNING GEAR', 'DISENGAGE POSITION'], ['TCE350'], ['TCT081']],
    [['TURNING GEAR', 'MOTOR ENGAGE PB'], ['TCE352'], ['-']],
    [['SPARE', ''], ['-'], ['-']],
    [['SPARE', ''], ['-'], ['-']],
    [['SPARE', ''], ['-'], ['-']],
    [['SPARE', ''], ['-'], ['-']],
    [['DI P.S. NORMAL (AXR1)', ''], ['TCE469'], ['-']]
  ];
  ROWS.forEach(([name, ra, rb], n) => {
    const right = n >= 8,
      i = n % 8,
      x0 = right ? 1220 : 204 /* left edge of the PI/O box */,
      top = Math.round((right ? 157 : 158) + i * 138.4),
      y = top + 27,
      no = n + 1,
      xe = x0 + 270 /* right edge of the box */,
      xj = x0 + 638 /* the junction to connector B */,
      xo = x0 + 776; /* centre of the connectors */
    r.push(['di' + no, x0, top, 270, 54, '']);
    t.push([x0 + 6, top + 27, name[0]], [x0 + 6, top + 49, name[1]], [x0, top + 76, 'DI'], [x0 + 407, top - 2, '(TCE900-' + no + ')']);
    w.push(['di' + no, [[xe, y], [xe + 118, y]], 1], ['di' + no, [[xe + 134, y], [xo - 30, y]]], ['di' + no, [[xj, y], [xj, y + 75], [xo - 30, y + 75]]]);
    g.push([xe + 126, y, 'l']);
    b.push(['btr' + no, 'o:BTR', String(right ? 2 * i + 2 : 2 * i + 1).padStart(3, '0'), x0 + 533, y]);
    c.push(['a' + no, 'out', 'A' + no, xo, y, '', ra], ['b' + no, 'out', 'B' + no, xo, y + 75, '', rb, 1]);
  });
  /* input 8 also goes to the operator station (CRT) */
  w.push(['di8', [[842, 1229], [842, 1304], [958, 1304]]]);
  d.push(['crt8', 975, 1304, 'out', 'TCE040_8', 'S', '#1C']);
  /* the PI/O error of the card */
  r.push(['pioErr', 1350, 1289, 125, 22, 'PI/O error']);
  t.push([1368, 1284, '(TCE900-1)']);
  w.push(['pioErr', [[1475, 1300], [1955, 1300]]]);
  b.push(['btr17', 'o:BTR', '017', 1741, 1300]);
  c.push(['oF', 'out', 'F', 1985, 1300, '', ['TCE465']]);
  t.push([236, 1531, 'CONTROLLER:'], [399, 1531, 'EHG+MD'], [621, 1504, 'TRIGGER  :'], [621, 1531, 'CYCLE(ms):30']);
  (typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
    id: 'TCE040',
    title: 'DIGITAL INPUT(1)',
    page: 19,
    ctl: 'EHG+MD',
    cycle: 30,
    f: [175, 86, 2228, 1548],
    r,
    g,
    b,
    c,
    d,
    w,
    t
  });
})();
