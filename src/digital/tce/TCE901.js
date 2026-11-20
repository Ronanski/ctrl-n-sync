/* TCE901 EHG DI TABLE(2) (331DM09784 page 183, controller EHG+MD). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The PI/O table of the digital input card unit 4 slot 1 (LYD050A3) of the EHG controller, 32 channels (CH 0 ~ 1F): the
   control and main oil pumps (B), the turning gear motor, the auto synchronizer start and remote select, the COM CPU run and power supply
   states and PLU OPERATED; the rest spare. Names are typed as drawn (TURNINNG on CH 6). */
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
  const x0 = 277,
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
    [330, '1'],
    [374, 'TYPE'],
    [416, 'LYD050A3'],
    [491, 'DVA'],
    [576, 'TYPE']
  ].forEach(([c, z]) => t.push([x0 + c + 3, y0 + 48, z]));
  /* the table: head and 32 rows */
  const X = [272, 314, 357, 852, 932, 1012, 1150, 1326, 1453],
    T = 208,
    Y1 = 262,
    RH = 32;
  X.forEach(x => V(x, T, Y1 + 32 * RH));
  H(T, 272, 1453);
  for (let i = 0; i <= 32; i++) H(Y1 + i * RH, 272, 1453);
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
    0: ['CONTROL OIL PUMP (B) RUNNING', ''],
    1: ['CONTROL OIL PUMP (B) ELECTRICAL TROUBLE', ''],
    2: ['MAIN OIL PUMP (B) RUNNING', ''],
    3: ['MAIN OIL PUMP (B) MOTOR ELECTRICAL TROUBLE', ''],
    4: ['TURNING GEAR MOTOR JOG PB', ''],
    5: ['TURNING GEAR MOTOR RUNNING', ''],
    6: ['TURNINNG GEAR MOTOR ELECTRICAL TROUBLE', ''],
    7: ['AUTO SYN START PB', ''],
    8: ['AUTO SYNC. REMOTE SELECT', ''],
    15: ['P.S.NORMAL', ''],
    26: ['COM CPU(A) RUN', ''],
    27: ['COM CPU(B) RUN', ''],
    28: ['COM P.S.(A) ABNORMAL', ''],
    29: ['COM P.S.(B) ABNORMAL', ''],
    30: ['PLU OPERATED', ''],
    31: ['P.S.NORMAL', '']
  };
  for (let i = 0; i < 32; i++) {
    const y = Y1 + (i + 1) * RH - 9,
      [z, ins] = R[i] || ['(SPARE)', ''];
    t.push([X[0] + 6, y, String(i + 1)], [X[1] + 8, y, i.toString(16).toUpperCase()], [X[2] + 9, y, z]);
    if (ins) t.push([X[6] + 8, y, ins]);
  }
  t.push([229, 1525, 'CONTROLLER:'], [390, 1525, 'EHG+MD']);
  (typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
    id: 'TCE901',
    title: 'EHG DI TABLE(2)',
    page: 183,
    ctl: 'EHG+MD',
    cycle: '-',
    f: [166, 86, 2218, 1546],
    l,
    t
  });
})();
