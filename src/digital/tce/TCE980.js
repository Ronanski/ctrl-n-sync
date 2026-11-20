/* TCE980 EHG PTI TABLE(1) (331DM09784 page 188, controller EHG+MD). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The PI/O table of the pulse inputs (PTI) of the EHG controller: cards unit 0 slot A, B and C (type LYT000A), one card per
   turbine speed pick-up SE-STn001-1, -2, -3. Each card has 4 inputs: the upper 4 lines are the high speed counters (TURBINE SPEED nA,
   nB, nC; count exchange low speed 0.625, high 4000 (*10000), low/high position 3000 / 3000, read timing 33, R.B.(dual) T), the lower
   4 lines the low speed counters; CH 3 spare. The caution note is typed as drawn (higt). */
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
  /* the columns of a table, from the left rule */
  const X = [0, 42, 86, 584, 694, 808, 920, 1030, 1110, 1190, 1270, 1408, 1584, 1712, 1800];
  /* one card: left x, top y of the card definition, first thread number, slot,
     rows [name, low speed, high, low -> high, high -> low, read timing, instrument, R.B.(dual)] */
  const card = (x0, y0, no, slot, R) => {
    const x = i => x0 + X[i];
    /* the card definition: SDIO/CE, PI/O, RTB */
    const C = [0, 43, 86, 128, 203, 247, 290, 334, 376, 419, 492, 534, 578, 622, 692];
    H(y0, x0, x0 + 692);
    H(y0 + 27, x0, x0 + 692);
    H(y0 + 54, x0, x0 + 692);
    [0, 203, 492, 692].forEach(c => V(x0 + c, y0, y0 + 54));
    C.forEach(c => V(x0 + c, y0 + 27, y0 + 54));
    t.push([x0 + 100, y0 + 21, 'SDIO/CE', 1], [x0 + 347, y0 + 21, 'PI/O', 1], [x0 + 592, y0 + 21, 'RTB', 1]);
    [
      [0, 'SLOT'],
      [86, 'TYPE'],
      [203, 'UNIT'],
      [247, '0'],
      [290, 'SLOT'],
      [334, slot],
      [376, 'TYPE'],
      [419, 'LYT000A'],
      [492, 'DVA'],
      [578, 'TYPE']
    ].forEach(([c, z]) => t.push([x0 + c + 3, y0 + 48, z]));
    /* the table head */
    const T = y0 + 61,
      M = T + 26,
      Y1 = T + 53,
      RH = 32,
      B = Y1 + 8 * RH,
      W = X[14];
    H(T, x0, x0 + W);
    H(M, x(3), x(7));
    H(Y1, x0, x0 + W);
    X.forEach((c, i) => V(x0 + c, [4, 6].includes(i) ? M : T, B));
    for (let i = 1; i <= 8; i++) H(Y1 + i * RH, x0, x0 + W);
    const hc = (a, b2) => (x(a) + x(b2)) / 2;
    t.push(
      [hc(0, 1), T + 22, 'thr.', 1],
      [hc(0, 1), T + 48, 'No.', 1],
      [hc(1, 2), T + 22, 'CH', 1],
      [hc(1, 2), T + 48, 'No.', 1],
      [hc(2, 3), T + 37, 'PULSE DI Signal Name', 1],
      [hc(3, 5), T + 22, 'count exchange', 1],
      [hc(3, 4), T + 48, 'low speed', 1],
      [hc(4, 5), T + 48, 'high(*10000)', 1],
      [hc(5, 7), T + 22, 'low/high position', 1],
      [hc(5, 6), T + 48, 'low -> high', 1],
      [hc(6, 7), T + 48, 'high -> low', 1],
      [hc(7, 8), T + 22, 'read', 1],
      [hc(7, 8), T + 48, 'timing', 1],
      [hc(8, 9), T + 22, 'logic', 1],
      [hc(8, 9), T + 48, 'SH No.', 1],
      [hc(9, 10), T + 22, 'seq.', 1],
      [hc(9, 10), T + 48, 'SH No.', 1],
      [hc(10, 11), T + 37, 'connect', 1],
      [hc(11, 12), T + 37, 'instrument No.', 1],
      [hc(12, 13), T + 37, 'EDB idNo.', 1],
      [hc(13, 14), T + 37, 'R.B.(dual)', 1]
    );
    /* the rows */
    const at = [2, 3, 4, 5, 6, 7, 11];
    for (let i = 0; i < 8; i++) {
      const y = Y1 + (i + 1) * RH - 8;
      t.push([x(0) + 6, y, String(no + i)], [x(1) + 8, y, String(i % 4)]);
      const [z, ...v] = R[i];
      [z, ...v.slice(0, 6)].forEach((q, k) => {
        if (q) t.push([x(at[k]) + 7, y, q]);
      });
      if (v[6]) t.push([hc(13, 14), y, v[6], 1]);
    }
  };
  /* one card of three turbine speed pick-ups: n = 1, 2, 3 */
  const rows = n => {
    const se = 'SE-STn001-' + n;
    return [
      ['TURBINE SPEED ' + n + 'A', '0.625', '4000', '3000', '3000', '33', se, 'T'],
      ['TURBINE SPEED ' + n + 'B', '', '', '', '', '', se],
      ['TURBINE SPEED ' + n + 'C', '', '', '', '', '', se],
      ['(SPARE)'],
      ['TURBINE SPEED LOW COUNTER ' + n + 'A'],
      ['TURBINE SPEED LOW COUNTER ' + n + 'B'],
      ['TURBINE SPEED LOW COUNTER ' + n + 'C'],
      ['(SPARE)']
    ];
  };
  card(280, 107, 1, 'A', rows(1));
  card(275, 523, 9, 'B', rows(2));
  card(270, 948, 17, 'C', rows(3));
  /* the caution */
  t.push(
    [283, 1346, '(Caution)'],
    [363, 1346, '(1) This card has each 4 inputs.'],
    [395, 1367, 'Above 4 lines mean higt speed counter value and set for counter changing.'],
    [395, 1388, 'Below 4 lines mean low speed counter.'],
    [395, 1409, 'This sheet is for max 4 cards.'],
    [363, 1431, '(2) All constants of exchanging depend same value of each card for 4 inputs.']
  );
  t.push([230, 1524, 'CONTROLLER:'], [393, 1524, 'EHG+MD']);
  (typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
    id: 'TCE980',
    title: 'EHG PTI TABLE(1)',
    page: 188,
    ctl: 'EHG+MD',
    cycle: '-',
    f: [164, 90, 2232, 1546],
    l,
    t
  });
})();
