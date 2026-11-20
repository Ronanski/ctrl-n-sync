/* TCA904 COMM DI TABLE(5) (331DM09788 page 245, controller COMM+MD). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The PI/O table of the digital input card unit 0 slot 9 (LYD050A3) of the COMM controller, 32 channels (CH 0 ~ 1F): shaft
   vibration high, LP exhaust hood spray valve and cold reheat non return valve positions, generator water / oil leakage, lube oil
   coalescer filter, supervisory instrument trouble, vacuum break, gland steam exhauster, the steam seal feed valves, 30DF / 64F and
   protection relay trouble and P.S. normal; the rest spare. The rules are plain lines. */
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
    [332, '9'],
    [376, 'TYPE'],
    [419, 'LYD050A3'],
    [495, 'DVA'],
    [579, 'TYPE']
  ].forEach(([c, z]) => t.push([x0 + c + 3, y0 + 48, z]));
  /* the table: head and 32 rows */
  const X = [274, 317, 361, 857, 936, 1017, 1157, 1331, 1462],
    T = 199,
    Y1 = 253,
    RH = 32;
  X.forEach(x => V(x, T, Y1 + 32 * RH));
  H(T, 274, 1462);
  for (let i = 0; i <= 32; i++) H(Y1 + i * RH, 274, 1462);
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
    0: ['NO.1 TURBINE SHAFT VIBRATION(X) HIGH', ''],
    1: ['NO.3 GEN. SHAFT VIBRATION(Y) HIGH', ''],
    2: ['LP EXHAUST HOOD WATER SPRAY VALVE FULL CLOSE POSITION', 'ZSC-CDn904'],
    3: ['LP EXHAUST HOOD WATER SPRAY VALVE FULL OPEN POSITION', 'ZSO-CDn904'],
    4: ['COLD REHEAT NON RETURN VALVE FULL CLOSE POSITION', 'ZSC-CRn901'],
    5: ['COLD REHEAT NON RETURN VALVE FULL OPEN POSITION', 'ZSO-CRn901'],
    6: ['GEN. WATER AND OIL LEAKAGE LEVEL HIGH', 'LSH-GEn001'],
    7: ['LUBE OIL CONDITIONER COALESCER FILTER DIFF. PRESS. HIGH', 'DPIS-LOn942'],
    8: ['TURBINE SUPERVISORY INSTRUMENT TROUBLE', ''],
    9: ['CONDENSER VACUUM BREAK COMPLETE', ''],
    10: ['GLAND STEAM EXHAUSTER ELECTRICAL TROUBLE', ''],
    11: ['GLAND STEAM EXHAUSTER RUNNING', ''],
    15: ['P.S.NORMAL', ''],
    16: ['NO.1 TURBINE SHAFT VIBRATION(Y) HIGH', ''],
    17: ['NO.3 GEN. SHAFT VIBRATION(X) HIGH', ''],
    18: ['RSR DIODE FAULT (30DF OPERATED)', ''],
    19: ['STEAM SEAL FEED VALVE FULL CLOSE POSITION', 'ZSC-GSn931'],
    20: ['STEAM SEAL FEED INLET VALVE FULL CLOSE POSITION', ''],
    21: ['STEAM SEAL FEED INLET VALVE FULL OPEN POSITION', ''],
    22: ['STEAM SEAL FEED INLET VALVE ELECTRICAL TROUBLE', ''],
    23: ['SSFV BYPASS VALVE FULL CLOSE POSITION', ''],
    24: ['BOTH GEN PROTECTION RELAY TROUBLE', ''],
    25: ['30DF/64F RELAY TROUBLE', ''],
    26: ['30DF/64F LOSS OF CONTROL POWER', ''],
    27: ['STEAM SEAL FEED INLET VALVE TORQUE SW OPEN', ''],
    28: ['STEAM SEAL FEED INLET VALVE TORQUE SW CLOSE', ''],
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
    id: 'TCA904',
    title: 'COMM DI TABLE(5)',
    page: 245,
    ctl: 'COMM+MD',
    cycle: '-',
    f: [174, 74, 2216, 1539],
    l,
    t
  });
})();
