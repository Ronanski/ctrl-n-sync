/* TCA982 COMM DO TABLE(3) (331DM09788 page 256, controller COMM+MD). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The PI/O table of the digital output card unit 0 slot E (LYD105A) of the COMM controller, 32 channels (CH 0 ~ 1F): the
   solenoid valve commands of the cold reheat and extraction non return valves, the steam seal diverting valve and the LP exhaust hood
   spray; the rest spare. The rules are plain lines. */
(function () {
  const l = [],
    t = [],
    H = (y, x0, x1) => l.push([[x0, y], [x1, y]]),
    V = (x, y0, y1) => l.push([[x, y0], [x, y1]]);
  /* the card definition: SDIO/CE, PI/O, RTB */
  const x0 = 272,
    y0 = 137;
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
    [332, 'E'],
    [376, 'TYPE'],
    [419, 'LYD105A'],
    [495, 'DVA'],
    [579, 'TYPE']
  ].forEach(([c, z]) => t.push([x0 + c + 3, y0 + 48, z]));
  /* the table: head and 32 rows */
  const X = [269, 312, 356, 852, 931, 1012, 1152, 1326, 1457],
    T = 196,
    Y1 = 250,
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
    0: ['COLD REHEAT STEAM NON RETURN VALVE SV ENERGIZE COMMAND', 'SV-CRn901'],
    1: ['NO.3 EXTRACTION STEAM NON RETURN VALVE ENERGIZE COMMAND', 'SV-TSn740'],
    2: ['NO.2 EXTRACTION STEAM NON RETURN VALVE ENERGIZE COMMAND', 'SV-TSn700'],
    3: ['STEAM SEAL DIVERTING VALVE SOLENOID VALVE ENERGIZE COMMAND', 'SV-GSn036'],
    16: ['LP EXHAUST HOOD WATER SPRAY VALVE SOLENOID VALVE ENERGIZE', 'SV-CDn904'],
    17: ['NO.5 EXTRACTION STEAM NON RETURN VALVE ENERGIZE COMMAND', 'SV-TSn730'],
    18: ['NO.3 EXTRACTION STEAM PRIMARY NON RETURN VALVE ENERGIZE', 'SV-TSn710'],
    19: ['NO.4 EXTRACTION STEAM NON RETURN VALVE ENERGIZE COMMAND', 'SV-TSn720']
  };
  for (let i = 0; i < 32; i++) {
    const y = Y1 + (i + 1) * RH - 9,
      [z, ins] = R[i] || ['(SPARE)', ''];
    t.push([X[0] + 6, y, String(i + 1)], [X[1] + 8, y, i.toString(16).toUpperCase()], [X[2] + 9, y, z]);
    if (ins) t.push([X[6] + 8, y, ins]);
  }
  t.push([232, 1520, 'CONTROLLER:'], [392, 1520, 'COMM+MD']);
  (typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
    id: 'TCA982',
    title: 'COMM DO TABLE(3)',
    page: 256,
    ctl: 'COMM+MD',
    cycle: '-',
    f: [168, 71, 2228, 1536],
    l,
    t
  });
})();
