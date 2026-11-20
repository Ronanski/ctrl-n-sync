/* TCA900 COMM DI TABLE(1) (331DM09788 page 241, controller COMM+MD). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The PI/O table of the digital input card unit 0 slot 5 (LYD050A3) of the COMM controller, 32 channels (CH 0 ~ 1F): the MSV(A),
   CV(A) and CRV(A) secondary drain valves, the AC exciter and generator field earth faults, the AVR status, the steam seal diverting valve,
   the No.4 extraction non return valve and the LP heater levels; the rest spare. Names are typed as drawn (SPARE on CH 13). */
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
  const x0 = 275,
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
    [332, '5'],
    [376, 'TYPE'],
    [419, 'LYD050A3'],
    [495, 'DVA'],
    [579, 'TYPE']
  ].forEach(([c, z]) => t.push([x0 + c + 3, y0 + 48, z]));
  /* the table: head and 32 rows */
  const X = [272, 315, 359, 855, 934, 1015, 1155, 1329, 1460],
    T = 200,
    Y1 = 254,
    RH = 32;
  X.forEach(x => V(x, T, Y1 + 32 * RH));
  H(T, 272, 1460);
  for (let i = 0; i <= 32; i++) H(Y1 + i * RH, 272, 1460);
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
    0: ['MSV(A) ABOVE SEAT SECONDARY DRAIN VALVE OPENED', ''],
    1: ['MSV(A) ABOVE SEAT SECONDARY DRAIN VALVE CLOSED', ''],
    2: ['MSV(A) ABOVE SEAT SECONDARY DRAIN VALVE ELECTRICAL TROUBLE', ''],
    3: ['CV(A) ABOVE SEAT SECONDARY DRAIN VALVE OPENED', ''],
    4: ['CV(A) ABOVE SEAT SECONDARY DRAIN VALVE CLOSED', ''],
    5: ['CV(A) ABOVE SEAT SECONDARY DRAIN VALVE ELECTRICAL TROUBLE', ''],
    6: ['CRV(A) BELOW SEAT SECONDARY DRAIN VALVE OPENED', ''],
    7: ['CRV(A) BELOW SEAT SECONDARY DRAIN VALVE CLOSED', ''],
    8: ['CRV(A) BELOW SEAT SECONDARY DRAIN VALVE ELECTRICAL TROUBLE', ''],
    9: ['AC EXCITER EARTH FAULT', ''],
    10: ['AUTO MANUAL START READY', ''],
    11: ['CONTROL LOCAL', ''],
    12: ['MSV(A) ABV SEAT SEC DRAIN VALVE TORQUE SW OPEN', ''],
    13: ['CRV(A) BELOW SEAT SEC DRAIN VALVE TORQUE SW OPEN', ''],
    14: ['CV(A) ABV SEAT SEC DRAIN VALVE TORQUE SW OPEN', ''],
    15: ['P.S.NORMAL', ''],
    16: ['STEAM SEAL DIVERTING VALVE CONDENSER SIDE', 'ZSC-GSn017'],
    17: ['STEAM SEAL DIVERTING VALVE HEATER SIDE', 'ZSO-GSn017'],
    18: ['NO.1 LP HEATER LEVEL VERY HIGH', ''],
    19: ['SPARE', ''],
    20: ['NO.4 EXTRACTION STEAM NON RETURN VALVE FULL CLOSE POSITION', 'ZSC-TSn720'],
    21: ['NO.4 EXTRACTION STEAM NON RETURN VALVE FULL OPEN POSITION', 'ZSO-TSn720'],
    22: ['NO.3 LP HEATER LEVEL HIGH HIGH', ''],
    23: ['GEN FIELD EARTH FAULT (64F OPERATED)', ''],
    24: ['AVR IN USE', ''],
    25: ['AVR MAJOR TROUBLE', ''],
    26: ['AVR MINOR TROUBLE', ''],
    28: ['MSV(A) ABV SEAT SEC DRAIN VALVE TORQUE SW CLOSE', ''],
    29: ['CRV(A) BELOW SEAT SEC DRAIN VALVE TORQUE SW CLOSE', ''],
    30: ['CV(A) ABV SEAT SEC DRAIN VALVE TORQUE SW CLOSE', ''],
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
    id: 'TCA900',
    title: 'COMM DI TABLE(1)',
    page: 241,
    ctl: 'COMM+MD',
    cycle: '-',
    f: [171, 75, 2212, 1539],
    l,
    t
  });
})();
