/* TCE960 EHG DO TABLE(1) (331DM09784 page 185, controller EHG+MD). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The PI/O table of the digital output card unit 4 slot 2 (LYD105A) of the EHG controller, 32 channels (CH 0 ~ 1F), filled
   by TCE600 (points 1 to 16) and TCE601 (points 17 to 32): the oil pump and turning gear commands, the valve full close, trip and test
   states, 41 close, the generator lockout relays and the ICV to CV transfer; the rest spare. Names are typed as drawn (EXCUTING on CH 1A
   and 1B, printed on two lines). */
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
    y0 = 146;
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
    [330, '2'],
    [374, 'TYPE'],
    [416, 'LYD105A'],
    [491, 'DVA'],
    [576, 'TYPE']
  ].forEach(([c, z]) => t.push([x0 + c + 3, y0 + 48, z]));
  /* the table: head and 32 rows */
  const X = [265, 307, 351, 845, 925, 1005, 1144, 1319, 1447],
    T = 210,
    Y1 = 263,
    RH = 32;
  X.forEach(x => V(x, T, Y1 + 32 * RH));
  H(T, 265, 1447);
  for (let i = 0; i <= 32; i++) H(Y1 + i * RH, 265, 1447);
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
    0: ['CONTROL OIL PUMP(A) START COMMAND', ''],
    1: ['MAIN OIL PUMP(A) START COMMAND', ''],
    2: ['DC EMERGENCY OIL PUMP START', ''],
    3: ['DC EMERGENCY OIL PUMP MANUAL STOP', ''],
    5: ['TURNING GEAR MOTOR START COMMAND', ''],
    7: ['TURNING GEAR ENGAGED', ''],
    12: ['RSV ICV FULL CLOSE', ''],
    13: ['MSV ICV FULL CLOSE', ''],
    15: ['EHG SOFT MAJOR TROUBLE or BACKUP OVER SPEED', ''],
    16: ['52L OPEN FOR HOUSE LOAD OPERATION', ''],
    17: ['TURBINE SPEED < 2400RPM', ''],
    18: ['ACCELERATION RELAY OPERATED', ''],
    19: ['DCS MODE ON FEEDBACK', ''],
    23: ['ASD2 START SIGNAL (52L)', ''],
    24: ['HP-CV FULL CLOSE(BOTH CV(A) & (B))', ''],
    25: ['TURBINE TRIP(MSV,RSV,ICV CLOSE)', ''],
    26: ['MSV/CV(A) SEQUENTIAL', ''],
    27: ['MSV/CV(B) SEQUENTIAL', ''],
    28: ['41 CLOSE', ''],
    29: ['GEN. LOCKOUT RELAY(86G)A OPERATED', ''],
    30: ['GEN. LOCKOUT RELAY(86G)B OPERATED', ''],
    31: ['ICV TO CV TRANSFER COMPLETE', '']
  };
  for (let i = 0; i < 32; i++) {
    const y = Y1 + (i + 1) * RH - 9,
      [z, ins] = R[i] || ['(SPARE)', ''];
    t.push([X[0] + 6, y, String(i + 1)], [X[1] + 8, y, i.toString(16).toUpperCase()], [X[2] + 9, y, z]);
    if (ins) t.push([X[6] + 8, y, ins]);
  }
  /* CH 1A and 1B: the name runs onto a second line, over the rule below */
  [26, 27].forEach(i => t.push([X[2] + 9, Y1 + (i + 1) * RH + 7, 'FULL CLOSE TEST EXCUTING']));
  t.push([222, 1522, 'CONTROLLER:'], [381, 1522, 'EHG+MD']);
  (typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
    id: 'TCE960',
    title: 'EHG DO TABLE(1)',
    page: 185,
    ctl: 'EHG+MD',
    cycle: '-',
    f: [162, 86, 2214, 1544],
    l,
    t
  });
})();
