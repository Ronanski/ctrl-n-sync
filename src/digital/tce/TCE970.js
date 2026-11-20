/* TCE970 EHG AO TABLE(1) (331DM09784 page 187, controller EHG+MD). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The PI/O table of the analog outputs of the EHG controller: card unit 4 slot 7 (type LYA100A), eight channels, all 4-20 mA:
   the target MW set point feed back (0-200 MW), the turbine load up rate (0-5 %/MIN), the HP turbine first stage steam pressures (A),
   (B) and (C) (0-150 kg/cm2g) and the turbine speed (0-4000 rpm); CH 6 and 7 spare (0-100 %). The second and third cards (thread 9 to
   24) are drawn empty. The rules are plain lines; the scan is a little turned, so each card is placed at its own corner. */
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
  const X = [0, 42, 86, 582, 646, 710, 772, 855, 919, 981, 1047, 1125, 1205, 1267, 1349, 1429, 1567, 1743, 1869];
  /* one card: left x, top y of the card definition, first thread number, unit, slot, type,
     rows [name, bare low, up, unit, span, eng low, up, unit, exec low, up, unit] */
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
    const T = y0 + 62,
      M = T + 26,
      Y1 = T + 51,
      RH = 31.5,
      B = Y1 + 8 * RH,
      W = X[18];
    H(T, x0, x0 + W);
    H(M, x(3), x(6));
    H(M, x(7), x(13));
    H(Y1, x0, x0 + W);
    X.forEach((c, i) => V(x0 + c, [4, 5, 8, 9, 11, 12].includes(i) ? M : T, B));
    for (let i = 1; i <= 8; i++) H(Y1 + i * RH, x0, x0 + W);
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
      const y = Y1 + (i + 1) * RH - 8;
      t.push([x(0) + 6, y, String(no + i)], [x(1) + 8, y, String(i)]);
      (R[i] || []).forEach((z, k) => {
        if (z !== '') t.push([x(k + 2) + 7, y, z]);
      });
    }
  };
  const ma = ['4', '20', 'mA', '20'],
    r = (name, lo, up, u) => [name, ...ma, lo, up, u, lo, up, u];
  card(272, 115, 1, '4', '7', 'LYA100A', [
    r('TARGET MW SET POINT FEED BACK', '0', '200', 'MW'),
    r('TURBINE LOAD UP RATE', '0', '5', '%/MIN'),
    r('HP TURBINE FIRST STAGE STEAM PRESS(A)', '0', '150', 'kg/cm2g'),
    r('HP TURBINE FIRST STAGE STEAM PRESS(B)', '0', '150', 'kg/cm2g'),
    r('HP TURBINE FIRST STAGE STEAM PRESS(C)', '0', '150', 'kg/cm2g'),
    r('TURBINE SPEED', '0', '4000', 'rpm'),
    r('(SPARE)', '0', '100', '%'),
    r('(SPARE)', '0', '100', '%')
  ]);
  card(267, 509, 9, '', '', '', []);
  card(262, 902, 17, '', '', '', []);
  t.push([222, 1522, 'CONTROLLER:'], [383, 1522, 'EHG+MD']);
  (typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
    id: 'TCE970',
    title: 'EHG AO TABLE(1)',
    page: 187,
    ctl: 'EHG+MD',
    cycle: '-',
    f: [154, 90, 2224, 1544],
    l,
    t
  });
})();
