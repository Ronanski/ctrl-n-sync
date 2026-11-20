/* TCE961 EHG DO TABLE(2) (331DM09784 page 186, controller EHG+MD). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The PI/O table of the digital output card unit 4 slot 3 (LYD105A) of the EHG controller, 32 channels (CH 0 ~ 1F), filled
   by TCE602 and TCE603: the control oil pump (B) and main oil pump (B) start commands, ASD1 start (52G), DCS control mode permissive,
   power load unbalance relay, RSV/MSV ICV full close, the EHG soft trouble states and the turning gear (solenoid valve SV-LOn906 and
   lamps); the rest spare. Names are typed as drawn (OPRATED on CH 7). */
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
  const x0 = 278,
    y0 = 151;
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
    [330, '3'],
    [374, 'TYPE'],
    [416, 'LYD105A'],
    [491, 'DVA'],
    [576, 'TYPE']
  ].forEach(([c, z]) => t.push([x0 + c + 3, y0 + 48, z]));
  /* the table: head and 32 rows */
  const X = [270, 314, 358, 852, 932, 1012, 1151, 1327, 1455],
    T = 212,
    Y1 = 265,
    RH = 32;
  X.forEach(x => V(x, T, Y1 + 32 * RH));
  H(T, X[0], X[8]);
  for (let i = 0; i <= 32; i++) H(Y1 + i * RH, X[0], X[8]);
  const hc = i => (X[i] + X[i + 1]) / 2;
  t.push(
    [hc(0), T + 22, 'thr.', 1],
    [hc(0), T + 48, 'No.', 1],
    [hc(1), T + 22, 'CH', 1],
    [hc(1), T + 48, 'No.', 1],
    [hc(2), T + 37, 'DO Signal Name', 1],
    [hc(3), T + 22, 'logic', 1],
    [hc(3), T + 48, 'SH No.', 1],
    [hc(4), T + 22, 'seq.', 1],
    [hc(4), T + 48, 'SH No.', 1],
    [hc(5), T + 37, 'connect', 1],
    [hc(6), T + 37, 'instrument No.', 1],
    [hc(7), T + 37, 'EDB idNo.', 1]
  );
  const R = {
    0: ['CONTROL OIL PUMP(B) START COMMAND', ''],
    1: ['MAIN OIL PUMP(B) START COMMAND', ''],
    2: ['ASD1 START SIGNAL (52G)', ''],
    4: ['DCS CONTROL MODE PERMISSIVE', ''],
    7: ['POWER LOAD UNBALANCE RY OPRATED', ''],
    12: ['RSV ICV FULL CLOSE', ''],
    13: ['MSV ICV FULL CLOSE', ''],
    14: ['EHG SOFT NOT MAJOR TROUBLE', ''],
    15: ['EHG SOFT MAJOR TROUBLE or BACKUP OVER SPEED', ''],
    16: ['TURNING GEAR ENGAGE SOLENOID VALVE', 'SV-LOn906'],
    17: ['TURNING GEAR ENGAGE (LAMP)', ''],
    18: ['TURNING GEAR MOTOR START (LAMP)', '']
  };
  for (let i = 0; i < 32; i++) {
    const y = Y1 + (i + 1) * RH - 9,
      [z, ins] = R[i] || ['(SPARE)', ''];
    t.push([X[0] + 6, y, String(i + 1)], [X[1] + 8, y, i.toString(16).toUpperCase()], [X[2] + 9, y, z]);
    if (ins) t.push([X[6] + 8, y, ins]);
  }
  t.push([228, 1525, 'CONTROLLER:'], [390, 1525, 'EHG+MD']);
  (typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
    id: 'TCE961',
    title: 'EHG DO TABLE(2)',
    page: 186,
    ctl: 'EHG+MD',
    cycle: '-',
    f: [166, 88, 2224, 1546],
    l,
    t
  });
})();
