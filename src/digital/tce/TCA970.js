/* TCA970 COMM RTD TABLE(1) (331DM09788 page 253, controller COMM+MD). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The PI/O table of the RTD inputs of the COMM controller: card unit 1 slot 4 (type LYA220A) with the lube oil cooler oil,
   generator stator coil, cooling gas air cooler outlet and AC exciter outlet air temperatures, and a second card with no unit or slot
   entered and all channels empty. The rules are plain lines. */
(function () {
  const l = [],
    t = [],
    H = (y, x0, x1) => l.push([[x0, y], [x1, y]]),
    V = (x, y0, y1) => l.push([[x, y0], [x, y1]]);
  /* the columns of a table, from the left rule */
  const X = [0, 43, 86, 584, 626, 706, 770, 834, 898, 977, 1056, 1122, 1202, 1280, 1359, 1440, 1579, 1753, 1883];
  /* one card: left x, top y of the card definition, first thread number, unit, slot, type, rows [name, elm, span, eng low, up, unit, exec low, up, unit, diag low, up, instrument] */
  const card = (x0, y0, no, unit, slot, type, R) => {
    const x = i => x0 + X[i];
    /* the card definition: SDIO/CE, PI/O, RTB */
    const C = [0, 43, 86, 128, 203, 247, 290, 334, 376, 419, 492, 534, 578, 622, 695];
    H(y0, x0, x0 + 695);
    H(y0 + 27, x0, x0 + 695);
    H(y0 + 54, x0, x0 + 695);
    [0, 203, 492, 695].forEach(c => V(x0 + c, y0, y0 + 54));
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
      B = Y1 + 16 * RH;
    H(T, x0, x0 + 1883);
    H(M, x(5), x(13));
    H(Y1, x0, x0 + 1883);
    X.forEach((c, i) => V(x0 + c, [6, 7, 9, 10, 12].includes(i) ? M : T, B));
    for (let i = 1; i <= 16; i++) H(Y1 + i * RH, x0, x0 + 1883);
    const hc = (a, b2) => (x(a) + x(b2)) / 2;
    t.push(
      [hc(0, 1), T + 22, 'thr.', 1],
      [hc(0, 1), T + 48, 'No.', 1],
      [hc(1, 2), T + 22, 'CH', 1],
      [hc(1, 2), T + 48, 'No.', 1],
      [hc(2, 3), T + 37, 'RTD AI Signal Name', 1],
      [hc(3, 4), T + 37, 'elm.', 1],
      [hc(4, 5), T + 22, 'range', 1],
      [hc(4, 5), T + 48, 'span', 1],
      [hc(5, 8), T + 22, 'eng. range', 1],
      [hc(5, 6), T + 48, 'low', 1],
      [hc(6, 7), T + 48, 'up', 1],
      [hc(7, 8), T + 48, 'unit', 1],
      [hc(8, 11), T + 22, 'exec. range', 1],
      [hc(8, 9), T + 48, 'low', 1],
      [hc(9, 10), T + 48, 'up', 1],
      [hc(10, 11), T + 48, 'unit', 1],
      [hc(11, 13), T + 22, 'diagnosis range', 1],
      [hc(11, 12), T + 48, 'low', 1],
      [hc(12, 13), T + 48, 'up', 1],
      [hc(13, 14), T + 22, 'logic', 1],
      [hc(13, 14), T + 48, 'SH No.', 1],
      [hc(14, 15), T + 22, 'seq.', 1],
      [hc(14, 15), T + 48, 'SH No.', 1],
      [hc(15, 16), T + 37, 'connect', 1],
      [hc(16, 17), T + 37, 'instrument No.', 1],
      [hc(17, 18), T + 37, 'EDB idNo.', 1]
    );
    /* the rows */
    const at = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16];
    for (let i = 0; i < 16; i++) {
      const y = Y1 + (i + 1) * RH - 8;
      t.push([x(0) + 6, y, String(no + i)], [x(1) + 8, y, i.toString(16).toUpperCase()]);
      (R[i] || []).forEach((z, k) => {
        if (z !== '') t.push([x(at[k]) + 7, y, z]);
      });
    }
  };
  const rtd = (up, ins) => ['RTD', '500', '0', up, 'degC', '0', up, 'degC', '-10000', '10000', ins];
  card(276, 90, 1, '1', '4', 'LYA220A', [
    ['LUBE OIL COOLER INLET OIL TEMP.', ...rtd('100', 'TE-LOn001')],
    ['LUBE OIL COOLER OUTLET OIL TEMP.(A)', ...rtd('100', 'TE-LOn002-1')],
    ['LUBE OIL COOLER OUTLET OIL TEMP.(B)', ...rtd('100', 'TE-LOn002-2')],
    ['GEN. STATOR COIL TEMP.(A)', ...rtd('120', 'TE-GEn006-1')],
    ['GEN. STATOR COIL TEMP.(B)', ...rtd('120', 'TE-GEn006-2')],
    ['GEN. STATOR COIL TEMP.(C)', ...rtd('120', 'TE-GEn006-3')],
    ['GEN. STATOR COIL TEMP.(D)', ...rtd('120', 'TE-GEn006-4')],
    ['GEN. STATOR COIL TEMP.(E)', ...rtd('120', 'TE-GEn006-5')],
    ['GEN. COOLING GAS AIR COOLER OUTLET TEMP.(A)', ...rtd('200', 'TE-GEn004-1')],
    ['GEN. COOLING GAS AIR COOLER OUTLET TEMP.(B)', ...rtd('200', 'TE-GEn004-2')],
    ['GEN. COOLING GAS AIR COOLER OUTLET TEMP.(C)', ...rtd('200', 'TE-GEn004-3')],
    ['GEN. COOLING GAS AIR COOLER OUTLET TEMP.(D)', ...rtd('200', 'TE-GEn004-4')],
    ['AC EXCITER OUTLET AIR TEMP.', ...rtd('150', 'TE-GEn005')],
    ['GEN. STATOR COIL TEMP.(F)', ...rtd('120', 'TE-GEn006-6')],
    ['(SPARE)'],
    ['(SPARE)']
  ]);
  card(268, 712, 17, '', '', '', []);
  t.push([232, 1520, 'CONTROLLER:'], [392, 1520, 'COMM+MD']);
  (typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
    id: 'TCA970',
    title: 'COMM RTD TABLE(1)',
    page: 253,
    ctl: 'COMM+MD',
    cycle: '-',
    f: [164, 73, 2227, 1538],
    l,
    t
  });
})();
