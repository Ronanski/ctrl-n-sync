/* TCA931 COMM AI TABLE(2) (331DM09788 page 249, controller COMM+MD). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The PI/O table of the analog inputs of the COMM controller: cards unit 1 slot 9, slot A and slot B (type LYA000A), eight
   channels each: the aux steam header pressure, the gland steam drain separator temperature, the LP differential and shell expansion,
   the low speed eccentricity, the generator MVAR, power factor and frequency; the rest spare, typed as drawn (some spares carry a
   range). The rules are plain lines; the scan is a little turned, so each card is placed at its own corner. */
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
  const X = [
    0, 42, 84, 581, 645, 709, 773, 853, 917, 982, 1046, 1124, 1204, 1270, 1348, 1427, 1506, 1587, 1725, 1902, 2030
  ];
  /* one card: left x, top y of the card definition, first thread number, unit, slot, type,
     rows [name, bare low, up, unit, span, eng low, up, unit, exec low, up, unit, diag low, up, instrument] */
  const card = (x0, y0, no, unit, slot, type, R) => {
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
      [247, unit],
      [290, 'SLOT'],
      [334, slot],
      [376, 'TYPE'],
      [419, type],
      [492, 'DVA'],
      [578, 'TYPE']
    ].forEach(([c, z]) => {
      if (z) t.push([x0 + c + 3, y0 + 48, z]);
    });
    /* the table head */
    const T = y0 + 59,
      M = T + 26,
      Y1 = T + 53,
      RH = 31.5,
      B = Y1 + 8 * RH,
      W = X[20];
    H(T, x0, x0 + W);
    H(M, x(3), x(6));
    H(M, x(7), x(15));
    H(Y1, x0, x0 + W);
    X.forEach((c, i) => V(x0 + c, [4, 5, 8, 9, 11, 12, 14].includes(i) ? M : T, B));
    for (let i = 1; i <= 8; i++) H(Y1 + i * RH, x0, x0 + W);
    const hc = (a, b2) => (x(a) + x(b2)) / 2;
    t.push(
      [hc(0, 1), T + 22, 'thr.', 1],
      [hc(0, 1), T + 48, 'No.', 1],
      [hc(1, 2), T + 22, 'CH', 1],
      [hc(1, 2), T + 48, 'No.', 1],
      [hc(2, 3), T + 37, 'AI Signal Name', 1],
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
      [hc(13, 15), T + 22, 'diagnosis range', 1],
      [hc(13, 14), T + 48, 'low', 1],
      [hc(14, 15), T + 48, 'up', 1],
      [hc(15, 16), T + 22, 'logic', 1],
      [hc(15, 16), T + 48, 'SH No.', 1],
      [hc(16, 17), T + 22, 'seq.', 1],
      [hc(16, 17), T + 48, 'SH No.', 1],
      [hc(17, 18), T + 37, 'connect', 1],
      [hc(18, 19), T + 37, 'instrument No.', 1],
      [hc(19, 20), T + 37, 'EDB idNo.', 1]
    );
    /* the rows */
    const at = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 18];
    for (let i = 0; i < 8; i++) {
      const y = Y1 + (i + 1) * RH - 8;
      t.push([x(0) + 6, y, String(no + i)], [x(1) + 8, y, String(i)]);
      (R[i] || []).forEach((z, k) => {
        if (z !== '') t.push([x(at[k]) + 7, y, z]);
      });
    }
  };
  const spare = ['(SPARE)', '4', '20', 'mA', '20', '', '', '', '', '', '', '-10000', '10000'];
  card(180, 111, 1, '1', '9', 'LYA000A', [
    ['(SPARE)', '4', '20', 'mA', '20', '0', '120', 'VDC', '0', '120', 'VDC', '-10000', '10000'],
    [
      'AUX STEAM HEADER PRESS.(LOWER)',
      '4',
      '20',
      'mA',
      '20',
      '0',
      '15',
      'kg/cm2',
      '0',
      '15',
      'kg/cm2',
      '-10000',
      '10000'
    ],
    [
      'GLAND STEAM DRAIN SEPARETOR TURBINE SIDE TEMP.',
      '4',
      '20',
      'mA',
      '20',
      '0',
      '300',
      'degC',
      '0',
      '300',
      'degC',
      '-10000',
      '10000'
    ],
    spare,
    spare,
    spare,
    spare,
    spare
  ]);
  card(178, 496, 9, '1', 'A', 'LYA000A', [
    [
      'LP TURBINE DIFF. EXPANSION',
      '4',
      '20',
      'mA',
      '20',
      '-11',
      '14',
      'mm',
      '-11',
      '14',
      'mm',
      '-10000',
      '10000',
      'ZE-STn002'
    ],
    [
      'TURBINE SHELL EXPANSION(HP TURBINE SIDE)',
      '4',
      '20',
      'mA',
      '20',
      '0',
      '50',
      'mm',
      '0',
      '50',
      'mm',
      '-10000',
      '10000',
      'ZE-STn001'
    ],
    [
      'LOW SPEED ECCENTRICITY DETECTOR',
      '4',
      '20',
      'mA',
      '20',
      '0',
      '0.5',
      'mm',
      '0',
      '0.5',
      'mm',
      '-10000',
      '10000',
      'ZE-STn004'
    ],
    spare,
    spare,
    spare,
    spare,
    spare
  ]);
  card(175, 879, 17, '1', 'B', 'LYA000A', [
    ['GEN. MVAR', '4', '20', 'mA', '20', '-240', '240', '', '-240', '240', '', '-10000', '10000'],
    ['GEN. POWER FACTOR', '4', '20', 'mA', '20', '0.5', '1.5', '', '0.5', '1.5', '', '-10000', '10000'],
    ['(SPARE)', '4', '20', 'mA', '20', '0', '100', '', '0', '100', '', '-10000', '10000'],
    ['(SPARE)', '4', '20', 'mA', '20', '0', '100', '', '0', '100', '', '-10000', '10000'],
    ['GEN. FREQUENCY', '4', '20', 'mA', '20', '55', '65', 'Hz', '55', '65', 'Hz', '-10000', '10000'],
    spare,
    spare,
    spare
  ]);
  t.push([232, 1520, 'CONTROLLER:'], [392, 1520, 'COMM+MD']);
  (typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
    id: 'TCA931',
    title: 'COMM AI TABLE(2)',
    page: 249,
    ctl: 'COMM+MD',
    cycle: '-',
    f: [168, 72, 2222, 1538],
    l,
    t
  });
})();
