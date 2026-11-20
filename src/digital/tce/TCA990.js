/* TCA990 COMM AO TABLE(1) (331DM09788 page 257, controller COMM+MD). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The PI/O table of the analog outputs of the COMM controller: three cards (unit 1 slot D, unit 1 slot E, unit 0 slot F,
   type LYA100A), eight channels each, with the bare, engineering and execution range of each output. The rules are plain lines; the
   scan is a little turned, so each card table is placed at its own corner. */
(function () {
  const l = [],
    t = [],
    H = (y, x0, x1) => l.push([[x0, y], [x1, y]]),
    V = (x, y0, y1) => l.push([[x, y0], [x, y1]]);
  /* the columns of a table, from the left rule */
  const X = [0, 43, 85, 582, 648, 712, 776, 855, 919, 983, 1048, 1126, 1207, 1270, 1350, 1429, 1569, 1744, 1873];
  /* one card: left x, top y of the card definition, unit, slot, rows [name, bare low, up, unit, span, eng low, up, unit, exec low, up, unit, instrument] */
  const card = (x0, y0, no, unit, slot, R) => {
    const x = i => x0 + X[i];
    /* the card definition: SDIO/CE, PI/O, RTB */
    const C = [0, 43, 86, 128, 203, 247, 290, 334, 376, 419, 492, 534, 578, 622, 697];
    H(y0, x0, x0 + 697);
    H(y0 + 27, x0, x0 + 697);
    H(y0 + 54, x0, x0 + 697);
    [0, 203, 492, 697].forEach(c => V(x0 + c, y0, y0 + 54));
    C.forEach(c => V(x0 + c, y0 + 27, y0 + 54));
    t.push([x0 + 100, y0 + 21, 'SDIO/CE', 1], [x0 + 347, y0 + 21, 'PI/O', 1], [x0 + 594, y0 + 21, 'RTB', 1]);
    [
      [0, 'SLOT'],
      [86, 'TYPE'],
      [203, 'UNIT'],
      [247, unit],
      [290, 'SLOT'],
      [334, slot],
      [376, 'TYPE'],
      [419, 'LYA100A'],
      [492, 'DVA'],
      [578, 'TYPE']
    ].forEach(([c, z]) => t.push([x0 + c + 3, y0 + 48, z]));
    /* the table head */
    const T = y0 + 59,
      M = T + 26,
      Y1 = T + 53,
      RH = 31.5,
      B = Y1 + 8 * RH;
    H(T, x0, x0 + 1873);
    H(M, x(3), x(6));
    H(M, x(7), x(13));
    H(Y1, x0, x0 + 1873);
    X.forEach((c, i) => {
      const top = [4, 5, 8, 9, 11, 12].includes(i) ? M : T;
      V(x0 + c, top, B);
    });
    for (let i = 1; i <= 8; i++) H(Y1 + i * RH, x0, x0 + 1873);
    const hc = (a, b2) => (x(a) + x(b2)) / 2;
    t.push(
      [hc(0, 1), T + 22, 'thr.', 1],
      [hc(0, 1), T + 48, 'No.', 1],
      [hc(1, 2), T + 22, 'CH', 1],
      [hc(1, 2), T + 48, 'No.', 1],
      [hc(2, 3), T + 37, 'AO Signal Name', 1],
      [hc(3, 6), T + 22, 'bare range', 1],
      [hc(3, 4), T + 48, 'low', 1],
      [hc(4, 5), T + 48, 'up', 1],
      [hc(5, 6), T + 48, 'unit', 1],
      [hc(6, 7), T + 22, 'range', 1],
      [hc(6, 7), T + 48, 'span', 1],
      [hc(7, 10), T + 22, 'eng. range', 1],
      [hc(7, 8), T + 48, 'low', 1],
      [hc(8, 9), T + 48, 'up', 1],
      [hc(9, 10), T + 48, 'unit', 1],
      [hc(10, 13), T + 22, 'exec. range', 1],
      [hc(10, 11), T + 48, 'low', 1],
      [hc(11, 12), T + 48, 'up', 1],
      [hc(12, 13), T + 48, 'unit', 1],
      [hc(13, 14), T + 22, 'logic', 1],
      [hc(13, 14), T + 48, 'SH No.', 1],
      [hc(14, 15), T + 22, 'seq.', 1],
      [hc(14, 15), T + 48, 'SH No.', 1],
      [hc(15, 16), T + 37, 'connect', 1],
      [hc(16, 17), T + 37, 'instrument No.', 1],
      [hc(17, 18), T + 37, 'EDB idNo.', 1]
    );
    /* the rows */
    for (let i = 0; i < 8; i++) {
      const y = Y1 + (i + 1) * RH - 8,
        r = R[i] || [];
      t.push([x(0) + 6, y, String(no + i)], [x(1) + 8, y, String(i)]);
      const at = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16];
      r.forEach((z, k) => {
        if (z !== '') t.push([x(at[k]) + 7, y, z]);
      });
    }
  };
  const range = (bl, bu, en, eu, un, xl, xu) => [bl, bu, 'mA', '20', en, eu, un, xl, xu, un];
  card(271, 101, 1, '1', 'D', [
    ['LUBE OIL COOLER OUTLET OIL TEMP.(A)', ...range('4', '20', '0', '100', 'degC', '0', '100')],
    ['STEAM SEAL FEED VALVE POSITION DEMAND', ...range('20', '4', '0', '100', '%', '0', '100'), 'PV-GSn031'],
    ['HP TURBINE WARMING VALVE POSITION', ...range('4', '20', '0', '100', '%', '0', '100')],
    ['STEAM SEAL FEED VALVE MANIPULATION VALUE', ...range('4', '20', '0', '100', '%', '0', '100')],
    ['GEN. CURRENT(A)', ...range('4', '20', '0', '10', 'kA', '0', '10')],
    ['GEN. VOLTAGE(A-B)', ...range('4', '20', '0', '18', 'kV', '0', '18')],
    ['(SPARE)'],
    ['(SPARE)']
  ]);
  card(269, 496, 9, '1', 'E', [
    ['LUBE OIL COOLER OUTLET OIL TEMP.(B)', ...range('4', '20', '0', '100', 'degC', '0', '100')],
    ['SPUV POSITION DEMAND', ...range('4', '20', '0', '100', '%', '0', '100'), 'PV-GSn034'],
    ['GEN. MVAR', ...range('4', '20', '-240', '240', 'MVar', '-240', '240')],
    ['GEN. CURRENT(B)', ...range('4', '20', '0', '10', 'kA', '0', '10')],
    ['GEN. VOLTAGE(B-C)', ...range('4', '20', '0', '18', 'kV', '0', '18')],
    ['GEN. POWER FACTOR', ...range('4', '20', '0.5', '1.5', '', '0.5', '1.5')],
    ['FREQUENCY', ...range('4', '20', '55', '65', 'Hz', '55', '65')],
    ['(SPARE)']
  ]);
  card(268, 890, 17, '0', 'F', [
    ['GEN. CURRENT(C)', ...range('4', '20', '0', '10', 'kA', '0', '10')],
    ['GEN. VOLTAGE(C-A)', ...range('4', '20', '0', '18', 'kV', '0', '18')],
    ['SPARE', '4', '20', 'mA', '20', '0', '100', '%', '0', '5', '%']
  ]);
  t.push([232, 1520, 'CONTROLLER:'], [392, 1520, 'COMM+MD']);
  (typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
    id: 'TCA990',
    title: 'COMM AO TABLE(1)',
    page: 257,
    ctl: 'COMM+MD',
    cycle: '-',
    f: [168, 73, 2226, 1537],
    l,
    t
  });
})();
