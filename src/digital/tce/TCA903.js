/* TCA903 COMM DI TABLE(4) (331DM09788 page 244, controller COMM+MD). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The PI/O table of the digital input card unit 0 slot 8 (LYD050A3) of the COMM controller, 32 channels (CH 0 ~ 1F): the AVR
   setpoint limits, excitation limiters, PF / reactive power control and VT fuse, the No.3 extraction secondary non return valve, the HP
   turbine warming line drain valve and the main oil tank vapour extractor; the rest spare. Names are typed as drawn (PSNORMAL on CH F). */
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
    y0 = 140;
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
    [332, '8'],
    [376, 'TYPE'],
    [419, 'LYD050A3'],
    [495, 'DVA'],
    [579, 'TYPE']
  ].forEach(([c, z]) => t.push([x0 + c + 3, y0 + 48, z]));
  /* the table: head and 32 rows */
  const X = [269, 312, 356, 852, 931, 1012, 1152, 1326, 1457],
    T = 199,
    Y1 = 253,
    RH = 32;
  X.forEach(x => V(x, T, Y1 + 32 * RH));
  H(T, 269, 1457);
  for (let i = 0; i <= 32; i++) H(Y1 + i * RH, 269, 1457);
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
    0: ['SETPOINT MAX', ''],
    1: ['SETPOINT MIN', ''],
    2: ['OVER EXCITATION LIMITTER', ''],
    3: ['UNDER EXCITATION LIMITTER', ''],
    4: ['PF CONTROL ON', ''],
    5: ['REACTIVE POWER ON', ''],
    6: ['AVR VT FUSE NORMAL', ''],
    15: ['PSNORMAL', ''],
    16: ['NO.3 EXTRACTION STEAM SECONDARY NON RETURN VALVE FULL CLOSE', 'ZSC-TSn740'],
    17: ['NO.3 EXTRACTION STEAM SECONDARY NON RETURN VALVE FULL OPEN', 'ZSO-TSn740'],
    18: ['HP TURBINE WARMING LINE DRAIN VALVE AUTO SELECTED', ''],
    19: ['HP TURBINE WARMING LINE DRAIN VALVE OPEN FEED BACK', ''],
    20: ['HP TURBINE WARMING LINE DRAIN VALVE CLOSE FEED BACK', ''],
    21: ['HP TURBINE WARMING VALVE ELECTRICAL TROUBLE', ''],
    22: ['MAIN OIL TANK VAPOUR EXTRACTOR RUNNING', ''],
    23: ['MAIN OIL TANK VAPOUR EXTRACTOR ELECTRICAL TROUBLE', ''],
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
    id: 'TCA903',
    title: 'COMM DI TABLE(4)',
    page: 244,
    ctl: 'COMM+MD',
    cycle: '-',
    f: [168, 73, 2212, 1539],
    l,
    t
  });
})();
