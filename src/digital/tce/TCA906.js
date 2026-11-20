/* TCA906 COMM DI TABLE(7) (331DM09788 page 247, controller COMM+MD). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The PI/O table of the digital input card unit 0 slot B (LYD050A3) of the COMM controller, 32 channels (CH 0 ~ 1F): trip
   PCM (A)/(B)/(C) normal, TCS panel temperatures high, Modbus power supply and CPU status, panel power supply abnormal, and the EOS and
   PLU operated signals; the rest spare. The rules are plain lines. */
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
  const x0 = 273,
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
    [332, 'B'],
    [376, 'TYPE'],
    [419, 'LYD050A3'],
    [495, 'DVA'],
    [579, 'TYPE']
  ].forEach(([c, z]) => t.push([x0 + c + 3, y0 + 48, z]));
  /* the table: head and 32 rows */
  const X = [270, 313, 357, 853, 932, 1013, 1153, 1327, 1458],
    T = 198,
    Y1 = 252,
    RH = 32;
  X.forEach(x => V(x, T, Y1 + 32 * RH));
  H(T, 270, 1458);
  for (let i = 0; i <= 32; i++) H(Y1 + i * RH, 270, 1458);
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
    4: ['TRIP PCM(A) NORMAL', ''],
    5: ['TRIP PCM(B) NORMAL', ''],
    6: ['TRIP PCM(C) NORMAL', ''],
    10: ['TCS-8 TEMP HIGH', ''],
    11: ['MODBUS P.S(A) ABNORMAL (AC)', ''],
    12: ['MODBUS P.S(B) ABNORMAL (DC)', ''],
    13: ['MODBUS CPU(A) NORMAL', ''],
    14: ['MODBUS CPU(B) NORMAL', ''],
    15: ['PS NORMAL', ''],
    17: ['AC CONTROL P.S. ABNORMAL', ''],
    18: ['DC CONTROL P.S. ABNORMAL', ''],
    19: ['LIGHTING&SPACE HEATER P.S.ABNORMAL', ''],
    20: ['AC PROTECTION P.S. ABNORMAL', ''],
    21: ['DC PROTECTION P.S.(2) ABNORMAL', ''],
    22: ['DC PROTECTION P.S.(1) ABNORMAL', ''],
    23: ['TCS-4 TEMP HIGH', ''],
    24: ['TCS-5 TEMP.HIGH', ''],
    25: ['EOS OPERATED(A)', ''],
    26: ['EOS OPERATED(B)', ''],
    27: ['EOS OPERATED(C)', ''],
    28: ['PLU OPERATED(A)', ''],
    29: ['PLU OPERATED(B)', ''],
    30: ['PLU OPERATED(C)', ''],
    31: ['PS NORMAL', '']
  };
  for (let i = 0; i < 32; i++) {
    const y = Y1 + (i + 1) * RH - 9,
      [z, ins] = R[i] || ['(SPARE)', ''];
    t.push([X[0] + 6, y, String(i + 1)], [X[1] + 8, y, i.toString(16).toUpperCase()], [X[2] + 9, y, z]);
    if (ins) t.push([X[6] + 8, y, ins]);
  }
  t.push([232, 1520, 'CONTROLLER:'], [392, 1520, 'COMM+MD']);
  (typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
    id: 'TCA906',
    title: 'COMM DI TABLE(7)',
    page: 247,
    ctl: 'COMM+MD',
    cycle: '-',
    f: [166, 73, 2225, 1538],
    l,
    t
  });
})();
