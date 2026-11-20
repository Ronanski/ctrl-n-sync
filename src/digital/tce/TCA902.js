/* TCA902 COMM DI TABLE(3) (331DM09788 page 243, controller COMM+MD). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The PI/O table of the digital input card unit 0 slot 7 (LYD050A3) of the COMM controller, 32 channels (CH 0 ~ 1F): the CV(B)
   below seat secondary warming drain valve, the HP turbine warming valve, the cold reheat drain valve, the No.3 extraction primary non
   return valve, the deaerator level, the duplex oil filter, and the generator / 52L / AVR status; the rest spare. Names are typed as drawn. */
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
  const x0 = 274,
    y0 = 142;
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
    [332, '7'],
    [376, 'TYPE'],
    [419, 'LYD050A3'],
    [495, 'DVA'],
    [579, 'TYPE']
  ].forEach(([c, z]) => t.push([x0 + c + 3, y0 + 48, z]));
  /* the table: head and 32 rows */
  const X = [271, 314, 358, 854, 933, 1014, 1154, 1328, 1459],
    T = 201,
    Y1 = 255,
    RH = 32;
  X.forEach(x => V(x, T, Y1 + 32 * RH));
  H(T, 271, 1459);
  for (let i = 0; i <= 32; i++) H(Y1 + i * RH, 271, 1459);
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
    0: ['CV(B) BELOW SEAT SECONDARY WARMING DRAIN VALVE OPENED', ''],
    1: ['CV(B) BELOW SEAT SECONDARY WARMING DRAIN VALVE CLOSED', ''],
    2: ['CV(B) BELOW SEAT SECONDARY WARMING DRAIN VALVE ELE TROUBLE', ''],
    3: ['HP TURBINE WARMING VALVE FULL CLOSE POSITION', ''],
    4: ['HP TURBINE WARMING VALVE FULL OPEN POSITION', ''],
    5: ['COLD REHEAT DRAIN VALVE CLOSE FEED BACK', ''],
    6: ['COLD REHEAT DRAIN VALVE FULL OPEN FEED BACK', ''],
    11: ['CV(B) BEL SEC DRAIN  VALVE TORQUE SW OPEN', ''],
    12: ['CV(B) BEL SEC DRAIN  VALVE TORQUE SW CLOSE', ''],
    13: ['HP TURBINE WARMING VALVE TORQUE SW OPEN', ''],
    14: ['HP TURBINE WARMING VALVE TORQUE SW CLOSE', ''],
    15: ['P.S.NORMAL', ''],
    16: ['NO.3 EXTRACTION STEAM PRIMARY NON RETURN VALVE FULL CLOSE', 'ZSC-TSn710'],
    17: ['NO.3 EXTRACTION STEAM PRIMARY NON RETURN VALVE FULL OPEN', 'ZSO-TSn710'],
    18: ['DEAERATOR STORAGE TANK LEVEL VERY HIGH', ''],
    19: ['DUPLEX OIL FILTER DIFF. PRESS.', 'DPIS-LOn932'],
    20: ['GEN CONTROL PANEL TROUBLE', ''],
    21: ['GEN TRANSF. PROTECTION OPERATED', ''],
    22: ['GEN VOLTAGE OK', ''],
    23: ['52L CLOSE', ''],
    24: ['52L OPEN', ''],
    25: ['ASD1 IN USE', ''],
    26: ['AVR FAILURE TO BACKUP STATUS', ''],
    27: ['AVR IN AUTO', ''],
    28: ['AVR IN MANUAL', ''],
    29: ['AVR CHANNEL1 SELECT', ''],
    30: ['AVR CHANNEL2 SELECT', ''],
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
    id: 'TCA902',
    title: 'COMM DI TABLE(3)',
    page: 243,
    ctl: 'COMM+MD',
    cycle: '-',
    f: [171, 76, 2210, 1540],
    l,
    t
  });
})();
