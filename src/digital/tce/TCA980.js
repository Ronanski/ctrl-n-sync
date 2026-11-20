/* TCA980 COMM DO TABLE(1) (331DM09788 page 254, controller COMM+MD). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The PI/O table of the digital output card unit 0 slot C (LYD105A) of the COMM controller, 32 channels (CH 0 ~ 1F): the
   secondary drain valves of CRV(A), CV(A), CV(B) and MSV(A), the steam seal feed inlet valve, the gland steam line drain, the start-up
   mode, load hold, 41 open, PSS and PF control on / off, rated speed and ST trip. Words as written on the drawing. */
(function () {
  const l = [],
    t = [],
    H = (y, x0, x1) => l.push([[x0, y], [x1, y]]),
    V = (x, y0, y1) => l.push([[x, y0], [x, y1]]);
  /* the card definition: SDIO/CE, PI/O, RTB */
  const x0 = 278,
    y0 = 135;
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
    [332, 'C'],
    [376, 'TYPE'],
    [419, 'LYD105A'],
    [495, 'DVA'],
    [579, 'TYPE']
  ].forEach(([c, z]) => t.push([x0 + c + 3, y0 + 48, z]));
  /* the table: head and 32 rows */
  const X = [275, 318, 362, 858, 937, 1018, 1158, 1332, 1463],
    T = 194,
    Y1 = 248,
    RH = 32;
  X.forEach(x => V(x, T, Y1 + 32 * RH));
  H(T, 275, 1463);
  for (let i = 0; i <= 32; i++) H(Y1 + i * RH, 275, 1463);
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
    0: ['CRV(A) BELOW SEAT SECONDARY DRAIN VALVE CLOSE COMMAND',''],
    1: ['CRV(A) BELOW SEAT SECONDARY DRAIN VALVE OPEN COMMAND',''],
    2: ['CV(A) ABOVE SEAT SECONDARY DRAIN VALVE OPEN COMMAND',''],
    3: ['CV(A) ABOVE SEAT SECONDARY DRAIN VALVE CLOSE COMMAND',''],
    4: ['CV(B) BELOW SEAT SEC WARMING DRAIN VALVE CLOSE COMMAND',''],
    5: ['CV(B) BELOW SEAT SEC WARMING DRAIN VALVE OPEN COMMAND',''],
    6: ['MSV(A) ABOVE SEAT SECONDARY DRAIN VALVE OPEN COMMAND',''],
    7: ['MSV(A) ABOVE SEAT SECONDARY DRAIN VALVE CLOSE COMMAND',''],
    8: ['STEAM SEAL FEED INLET VALVE CLOSE COMMAND',''],
    9: ['STEAM SEAL FEED INLET VALVE OPEN COMMAND',''],
    10: ['TURBINE GLAND STEAM LINE DRAIN VALVE OPEN COMMAND',''],
    11: ['TURBINE GLAND STEAM LINE DRAIN VALVE CLOSE COMMAND',''],
    12: ['STEAM SEAL FEED INLET VALVE CLOSED',''],
    14: ['AMB. COLD MODE TEMP.',''],
    15: ['MODE JUDGEMENT INSTRUMENT NORMAL',''],
    16: ['TURBINE START-UP AMBIENT COLD MODE',''],
    17: ['TURBINE START-UP COLD 1 MODE',''],
    18: ['TURBINE START-UP COLD 2 MODE',''],
    19: ['TURBINE START-UP HOT MODE',''],
    20: ['TURBINE START-UP WARM MODE',''],
    21: ['TURBINE LOAD HOLD',''],
    23: ['3-41 OPEN COMMAND',''],
    25: ['41 OPEN COMAND FROM ATS',''],
    26: ['PSS ON',''],
    27: ['PSS OFF',''],
    28: ['PF CONTRL ON',''],
    29: ['PF CONTROL OFF',''],
    30: ['RATED SPEED',''],
    31: ['ST TRIP','']
  };
  for (let i = 0; i < 32; i++) {
    const y = Y1 + (i + 1) * RH - 9,
      [z, ins] = R[i] || ['(SPARE)', ''];
    t.push([X[0] + 6, y, String(i + 1)], [X[1] + 8, y, i.toString(16).toUpperCase()], [X[2] + 9, y, z]);
    if (ins) t.push([X[6] + 8, y, ins]);
  }
  t.push([232, 1520, 'CONTROLLER:'], [392, 1520, 'COMM+MD']);
  (typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
    id: 'TCA980',
    title: 'COMM DO TABLE(1)',
    page: 254,
    ctl: 'COMM+MD',
    cycle: '-',
    f: [170, 69, 2233, 1534],
    l,
    t
  });
})();
