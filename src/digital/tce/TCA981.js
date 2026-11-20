/* TCA981 COMM DO TABLE(2) (331DM09788 page 255, controller COMM+MD). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The PI/O table of the digital output card unit 0 slot D (LYD105A) of the COMM controller, 32 channels (CH 0 ~ 1F): the
   secondary drain valves of CRV(B), MSV(B) and CV(B), the HP turbine warming valve and its line drain, excitation start / auto / manual,
   the oil purifier, space heaters, vapour extractor, gland steam exhauster, reactive power regulator, and the PLU / EOS tests. */
(function () {
  const l = [],
    t = [],
    H = (y, x0, x1) => l.push([[x0, y], [x1, y]]),
    V = (x, y0, y1) => l.push([[x, y0], [x, y1]]);
  /* the card definition: SDIO/CE, PI/O, RTB */
  const x0 = 267,
    y0 = 139;
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
    [332, 'D'],
    [376, 'TYPE'],
    [419, 'LYD105A'],
    [495, 'DVA'],
    [579, 'TYPE']
  ].forEach(([c, z]) => t.push([x0 + c + 3, y0 + 48, z]));
  /* the table: head and 32 rows */
  const X = [264, 307, 351, 847, 926, 1007, 1147, 1321, 1452],
    T = 198,
    Y1 = 252,
    RH = 32;
  X.forEach(x => V(x, T, Y1 + 32 * RH));
  H(T, 264, 1452);
  for (let i = 0; i <= 32; i++) H(Y1 + i * RH, 264, 1452);
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
    0: ['CRV(B) BELOW SEAT SECONDARY DRAIN VALVE OPEN COMMAND',''],
    1: ['CRV(B) BELOW SEAT SECONDARY DRAIN VALVE CLOSE COMMAND',''],
    5: ['MSV(B) ABOVE SEAT SECONDARY DRAIN VALVE OPEN COMMAND',''],
    6: ['MSV(B) ABOVE SEAT SECONDARY DRAIN VALVE CLOSE COMMAND',''],
    7: ['HP TURBINE WARMING LINE DRAIN VALVE CLOSE COMMAND',''],
    8: ['HP TURBINE WARMING LINE DRAIN VALVE OPEN COMMAND',''],
    9: ['HP TURBINE WARMING VALVE CLOSE COMMAND',''],
    10: ['HP TURBINE WARMING VALVE OPEN COMMAND',''],
    11: ['CV(B) ABOVE SEAT SECONDARY DRAIN VALVE OPEN COMMAND',''],
    12: ['CV(B) ABOVE SEAT SECONDARY DRAIN VALVE CLOSE COMMAND',''],
    13: ['EXCITATION START',''],
    14: ['EXCITATION AUTO MODE ON',''],
    15: ['EXCITATION MANUAL MODE ON',''],
    16: ['OIL PURIFIER PUMP START COMMAND',''],
    17: ['SPACE HEATER START COMMAND (AC EXCITER)',''],
    18: ['SPACE HEATER START COMMAND (GEN)',''],
    19: ['MAIN OIL TANK VAPOUR EXTRACTOR START COMMAND',''],
    20: ['GLAND STEAM EXHAUSTER START COMMAND',''],
    21: ['REACTIVE POWER REGULATOR ON',''],
    22: ['REACTIVE POWER REGULATOR OFF',''],
    23: ['EXCITATION START 3-41CLOSE',''],
    26: ['PLU1 TEST',''],
    27: ['PLU2 TEST',''],
    28: ['PLU3 TEST',''],
    29: ['EOS1 TEST',''],
    30: ['EOS2 TEST',''],
    31: ['EOS3 TEST','']
  };
  for (let i = 0; i < 32; i++) {
    const y = Y1 + (i + 1) * RH - 9,
      [z, ins] = R[i] || ['(SPARE)', ''];
    t.push([X[0] + 6, y, String(i + 1)], [X[1] + 8, y, i.toString(16).toUpperCase()], [X[2] + 9, y, z]);
    if (ins) t.push([X[6] + 8, y, ins]);
  }
  t.push([232, 1520, 'CONTROLLER:'], [392, 1520, 'COMM+MD']);
  (typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
    id: 'TCA981',
    title: 'COMM DO TABLE(2)',
    page: 255,
    ctl: 'COMM+MD',
    cycle: '-',
    f: [162, 74, 2224, 1538],
    l,
    t
  });
})();
