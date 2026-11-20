/* TCA905 COMM DI TABLE(6) (331DM09788 page 246, controller COMM+MD). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The PI/O table of the digital input card unit 0 slot A (LYD050A3) of the COMM controller, 32 channels (CH 0 ~ 1F): shaft
   vibration high, 86G-A / 86G-B relay coil open, generator protection relay trouble, main oil tank level, control oil filter
   differential pressure, space heaters, gland steam line drain valve, unit transformer protection and P.S. normal; the rest spare.
   The rules are plain lines. */
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
  const x0 = 284,
    y0 = 141;
  [0, 27, 54].forEach(d => H(y0 + d, x0, x0 + 696));
  [0, 205, 495, 696].forEach(c => V(x0 + c, y0, y0 + 54));
  [43, 87, 130, 248, 290, 332, 376, 419, 537, 579, 621].forEach(c => V(x0 + c, y0 + 27, y0 + 54));
  t.push([x0 + 100, y0 + 21, 'SDIO/CE', 1], [x0 + 350, y0 + 21, 'PI/O', 1], [x0 + 595, y0 + 21, 'RTB', 1]);
  [
    [0, 'SLOT'],
    [87, 'TYPE'],
    [205, 'UNIT'],
    [248, '0'],
    [290, 'SLOT'],
    [332, 'A'],
    [376, 'TYPE'],
    [419, 'LYD050A3'],
    [495, 'DVA'],
    [579, 'TYPE']
  ].forEach(([c, z]) => t.push([x0 + c + 3, y0 + 48, z]));
  /* the table: head and 32 rows */
  const X = [281, 324, 368, 864, 943, 1024, 1164, 1338, 1469],
    T = 200,
    Y1 = 254,
    RH = 32;
  X.forEach(x => V(x, T, Y1 + 32 * RH));
  H(T, 281, 1469);
  for (let i = 0; i <= 32; i++) H(Y1 + i * RH, 281, 1469);
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
    0: ['NO.2 TURBINE SHAFT VIBRATION(X) HIGH', ''],
    1: ['NO.4 GEN. SHAFT VIBRATION(Y) HIGH', ''],
    2: ['86G-A RELAY COIL OPEN', ''],
    3: ['GEN PROTECTION RELAY(A) TROUBLE', ''],
    4: ['MAIN OIL TANK LEVEL LOW', 'LSL-LOn920-1'],
    5: ['CONTROL OIL LINE FILTER(A) DIFF. PRESS. HIGH', 'DPIS-LOn933-A'],
    6: ['SPACE HEATER RUNNING (GEN)', ''],
    7: ['SPACE HEATER RUNNING (AC EXCITER)', ''],
    8: ['SPACE HEATER FOR AC EXCITER. ELECTRICAL TROUBLE', ''],
    9: ['SPACE HEATER FOR GEN. ELECTRICAL TROUBLE', ''],
    15: ['P.S.NORMAL', ''],
    16: ['NO.2 TURBINE SHAFT VIBRATION(Y) HIGH', ''],
    17: ['NO.4 GEN. SHAFT VIBRATION(X) HIGH', ''],
    18: ['86G-B RELAY COIL OPEN', ''],
    19: ['GEN PROTECTION RELAY(B) TROUBLE', ''],
    20: ['MAIN OIL TANK LEVEL HIGH', 'LSH-LOn920-1'],
    21: ['CONTROL OIL LINE FILTER(B) DIFF. PRESS. HIGH', 'DPIS-LOn933-B'],
    22: ['TURBINE GLAND STEAM LINE DRAIN VALVE FULL OPENED', ''],
    23: ['TURBINE GLAND STEAM LINE DRAIN VALVE AUTO', ''],
    24: ['UNIT TRANSF. PROTECTION OPERATED', ''],
    31: ['P.S.NORMAL', '']
  };
  for (let i = 0; i < 32; i++) {
    const y = Y1 + (i + 1) * RH - 9,
      [z, ins] = R[i] || ['(SPARE)', ''];
    t.push([X[0] + 6, y, String(i + 1)], [X[1] + 8, y, i.toString(16).toUpperCase()], [X[2] + 9, y, z]);
    if (ins) t.push([X[6] + 8, y, ins]);
  }
  t.push([232, 1520, 'CONTROLLER:'], [392, 1520, 'COMM+MD']);
  (typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
    id: 'TCA905',
    title: 'COMM DI TABLE(6)',
    page: 246,
    ctl: 'COMM+MD',
    cycle: '-',
    f: [181, 75, 2219, 1539],
    l,
    t
  });
})();
