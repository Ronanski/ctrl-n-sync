/* TCA961 COMM THC TABLE(2) (331DM09788 page 252, controller COMM+MD). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The PI/O table of the thermocouple inputs of the COMM controller: cards unit 1 slot 2 and unit 1 slot 3 (type LYA210A),
   16 channels each: the turbine casing, valve and bowl metal temperatures, the thrust bearing metal temperatures, the main and
   exhaust steam temperatures and the No.3 / No.4 bearing outlet oil temperatures, with one spare and the RTD channel on each card.
   The rules are plain lines. */
(function () {
  const l = [],
    t = [],
    H = (y, x0, x1) => l.push([[x0, y], [x1, y]]),
    V = (x, y0, y1) => l.push([[x, y0], [x, y1]]);
  /* the columns of a table, from the left rule */
  const X = [0, 42, 85, 581, 624, 705, 769, 832, 897, 977, 1057, 1120, 1199, 1279, 1360, 1439, 1577, 1754, 1882];
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
      RH = 32,
      B = Y1 + 16 * RH;
    H(T, x0, x0 + 1882);
    H(M, x(5), x(13));
    H(Y1, x0, x0 + 1882);
    X.forEach((c, i) => V(x0 + c, [6, 7, 9, 10, 12].includes(i) ? M : T, B));
    for (let i = 1; i <= 16; i++) H(Y1 + i * RH, x0, x0 + 1882);
    const hc = (a, b2) => (x(a) + x(b2)) / 2;
    t.push(
      [hc(0, 1), T + 22, 'thr.', 1],
      [hc(0, 1), T + 48, 'No.', 1],
      [hc(1, 2), T + 22, 'CH', 1],
      [hc(1, 2), T + 48, 'No.', 1],
      [hc(2, 3), T + 37, 'THC AI Signal Name', 1],
      [hc(3, 4), T + 37, 'elm', 1],
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
  const thc = (up, ins) => ['K', '100', '0', up, 'degc', '0', up, 'degc', '-10000', '10000', ins];
  const spare = e => ['(SPARE)', 'K', '100', e, '', '', '', '', '', '-10000', '10000'];
  const rtd = ['RTD', 'RTD', '100', '0', '999', 'degc', '0', '999', 'degc', '-10000', '10000'];
  card(268, 77, 1, '1', '2', 'LYA210A', [
    ['REHEAT BOWL INNER WALL METAL TEMP.(A)', ...thc('700', 'TE-STn004-1')],
    ['IP TURBINE AFTER 15 STAGE INNER WALL METAL TEMP.(UPPER)', ...thc('500', 'TE-STn006-1')],
    ['IP TURBINE AFTER 18 STAGE INNER WALL METAL TEMP.(UPPER)', ...thc('500', 'TE-STn007-1')],
    ['THRUST BEARING FRONT-END EMBEDDED METAL TEMP.(A)', ...thc('150', 'TE-STn011-1')],
    ['THRUST BEARING REAR-END EMBEDDED METAL TEMP.(A)', ...thc('150', 'TE-STn012-1')],
    ['MSV (B) INNER WALL METAL TEMP.', ...thc('700', 'TE-STn903-B1')],
    ['CV (B) INNER WALL METAL TEMP.', ...thc('700', 'TE-STn904-B1')],
    ['HP TURBINE EXHAUST INNER WALL METAL TEMP.(UPPER)', ...thc('500', 'TE-STn002-1')],
    ['HP TURBINE FIRST STAGE INNER WALL METAL TEMP.', ...thc('700', 'TE-STn001-1')],
    ['IP-T AFTER 21 STAGE INNER WALL METALL TEMP.(UPPER)', ...thc('300', 'TE-STn013-1')],
    ['IP-T AFTER 21 STAGE INNER WALL METALL TEMP.(LOWER)', ...thc('300', 'TE-STn013-2')],
    spare(''),
    ['MSV INLET STEAM TEMP.(B)', ...thc('700', 'TE-MSn902-2')],
    ['HP TURBINE EXHAUST STEAM TEMP.(B)', ...thc('500', 'TE-STn003-2')],
    ['LP TURBINE EXHAUST HOOD STEAM TEMP.(B)', ...thc('150', 'TE-STn110-2')],
    rtd
  ]);
  card(263, 707, 17, '1', '3', 'LYA210A', [
    ['REHEAT BOWL INNER WALL METAL TEMP.(B)', ...thc('700', 'TE-STn004-2')],
    ['IP TURBINE AFTER 15 STAGE INNER WALL METAL TEMP.(LOWER)', ...thc('500', 'TE-STn006-2')],
    ['IP TURBINE AFTER 18 STAGE INNER WALL METAL TEMP.(LOWER)', ...thc('500', 'TE-STn007-2')],
    ['THRUST BEARING FRONT-END EMBEDDED METAL TEMP.(B)', ...thc('150', 'TE-STn011-2')],
    ['THRUST BEARING REAR-END EMBEDDED METAL TEMP.(B)', ...thc('150', 'TE-STn012-2')],
    ['MSV (B) OUTER WALL METAL TEMP.', ...thc('700', 'TE-STn903-B2')],
    ['CV (B) OUTER WALL METAL TEMP.', ...thc('700', 'TE-STn904-B2')],
    ['HP TURBINE EXHAUST INNER WALL METAL TEMP. (LOWER)', ...thc('500', 'TE-STn002-2')],
    ['HP TURBINE FIRST STAGE OUTER WALL METAL TEMP.', ...thc('700', 'TE-STn001-2')],
    ['NO.3 BEARING OUTLET OIL TEMP.', ...thc('150', 'TE-GEn007')],
    ['NO.4 BEARING OUTLET OIL TEMP.', ...thc('150', 'TE-GEn008')],
    spare('0'),
    ['MSV INLET STEAM TEMP.(C)', ...thc('700', 'TE-MSn902-3')],
    ['HP TURBINE EXHAUST STEAM TEMP.(C)', ...thc('500', 'TE-STn003-3')],
    ['LP TURBINE EXHAUST HOOD STEAM TEMP.(C)', ...thc('150', 'TE-STn110-3')],
    rtd
  ]);
  t.push([232, 1520, 'CONTROLLER:'], [392, 1520, 'COMM+MD']);
  (typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
    id: 'TCA961',
    title: 'COMM THC TABLE(2)',
    page: 252,
    ctl: 'COMM+MD',
    cycle: '-',
    f: [165, 70, 2219, 1535],
    l,
    t
  });
})();
