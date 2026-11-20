/* TCE900 EHG DI TABLE(1) (331DM09784 page 182, controller EHG+MD). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The PI/O table of the digital input card unit 4 slot 0 (LYD050A3) of the EHG controller, 32 channels (CH 0 ~ 1F): the
   control, main and DC emergency oil pumps, the bearing oil pressure for the EOP auto start, the hand turning interlock and turning gear
   positions, the DCS control mode, DS, 52G, 41 and 52L positions, speed raise and lower and the HP bypass valve full close; the rest
   spare. Names are typed as drawn. */
(function () {
  const l = [],
    t = [],
    H = (y, x0, x1) =>
      l.push([
        [x0, y],
        [x1, y]
      ]),
    V = (x, y0, y1) =>
      l.push([
        [x, y0],
        [x, y1]
      ]);
  /* the card definition: SDIO/CE, PI/O, RTB */
  const x0 = 272,
    y0 = 149;
  [0, 27, 54].forEach(d => H(y0 + d, x0, x0 + 693));
  [0, 201, 491, 693].forEach(c => V(x0 + c, y0, y0 + 54));
  [43, 84, 126, 244, 288, 330, 374, 416, 533, 576, 618].forEach(c => V(x0 + c, y0 + 27, y0 + 54));
  t.push([x0 + 100, y0 + 21, 'SDIO/CE', 1], [x0 + 346, y0 + 21, 'PI/O', 1], [x0 + 592, y0 + 21, 'RTB', 1]);
  [
    [0, 'SLOT'],
    [87, 'TYPE'],
    [201, 'UNIT'],
    [244, '4'],
    [288, 'SLOT'],
    [330, '0'],
    [374, 'TYPE'],
    [416, 'LYD050A3'],
    [491, 'DVA'],
    [576, 'TYPE']
  ].forEach(([c, z]) => t.push([x0 + c + 3, y0 + 48, z]));
  /* the table: head and 32 rows */
  const X = [267, 309, 352, 847, 927, 1007, 1145, 1321, 1448],
    T = 208,
    Y1 = 262,
    RH = 32;
  X.forEach(x => V(x, T, Y1 + 32 * RH));
  H(T, 267, 1448);
  for (let i = 0; i <= 32; i++) H(Y1 + i * RH, 267, 1448);
  const hc = i => (X[i] + X[i + 1]) / 2;
  t.push(
    [hc(0), T + 22, 'thr.', 1],
    [hc(0), T + 48, 'No.', 1],
    [hc(1), T + 22, 'CH', 1],
    [hc(1), T + 48, 'No.', 1],
    [hc(2), T + 37, 'DI Signal Name', 1],
    [hc(3), T + 22, 'logic', 1],
    [hc(3), T + 48, 'SH No.', 1],
    [hc(4), T + 22, 'seq.', 1],
    [hc(4), T + 48, 'SH No.', 1],
    [hc(5), T + 37, 'connect', 1],
    [hc(6), T + 37, 'instrument No.', 1],
    [hc(7), T + 37, 'EDB idNo.', 1]
  );
  const R = {
    0: ['CONTROL OIL PUMP (A) RUNNING', ''],
    1: ['CONTROL OIL PUMP (A) ELECTRICAL TROUBLE', ''],
    2: ['MAIN OIL PUMP (A) RUNNING', ''],
    3: ['MAIN OIL PUMP (A) MOTOR ELECTRICAL TROUBLE', ''],
    4: ['DC EMERGENCY OIL PUMP RUNNING', ''],
    5: ['DC EMERGENCY OIL PUMP ELECTRICAL TROUBLE', ''],
    6: ['BEARING OIL PRESS. (For EOP Auto Start)', 'PS-LOn004'],
    7: ['HAND TURNING INTERLOCK POSITION', 'ZS-LOn003'],
    8: ['TURNING GEAR ENGAGE POSITION', 'ZS-LOn906-1'],
    9: ['TURNING GEAR DISENGAGE POSITION', 'ZS-LOn906-2'],
    10: ['TURNING GEAR MOTOR ENGAGE PB', ''],
    15: ['P.S.NORMAL', ''],
    16: ['DCS CONTROL MODE ON', ''],
    17: ['DCS CONTROL MODE OFF', ''],
    18: ['DS CLOSED', ''],
    19: ['52G CLOSED', ''],
    20: ['52G OPENED', ''],
    21: ['SPEED RAISE', ''],
    22: ['SPEED LOWER', ''],
    23: ['41 CLOSE', ''],
    24: ['41 OPEN', ''],
    25: ['52L OPEN', ''],
    26: ['HP BYPASS VALVE FULL CLOSE', ''],
    31: ['P.S.NORMAL', '']
  };
  for (let i = 0; i < 32; i++) {
    const y = Y1 + (i + 1) * RH - 9,
      [z, ins] = R[i] || ['(SPARE)', ''];
    t.push([X[0] + 6, y, String(i + 1)], [X[1] + 8, y, i.toString(16).toUpperCase()], [X[2] + 9, y, z]);
    if (ins) t.push([X[6] + 8, y, ins]);
  }
  t.push([225, 1525, 'CONTROLLER:'], [385, 1525, 'EHG+MD']);
  (typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
    id: 'TCE900',
    title: 'EHG DI TABLE(1)',
    page: 182,
    ctl: 'EHG+MD',
    cycle: '-',
    f: [162, 86, 2214, 1544],
    l,
    t
  });
})();
