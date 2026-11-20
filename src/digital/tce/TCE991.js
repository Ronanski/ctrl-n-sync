/* TCE991 EHG SERVO TABLE(2) (331DM09784 page 190, controller EHG+MD). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The PI/O table of the servo cards of the EHG controller, unit 0 slot 6 (C side of the MSV and CV) and slot 7 (ICV and
   RSV), type AEH006A. Slot 6: eight analog inputs (MSV(A), MSV(B), CV(A), CV(B) POSITION(C) from ZT-STn903 / ZT-STn904 and the four
   SERVO VALVE(C) feedbacks) and four analog outputs, named SERVO VALVE(B) to SV-STn903 / SV-STn904 -A2 / -B2 as drawn. Slot 7: ICV(A),
   ICV(B) POSITION(A) (-8 to 0 V, ZT-STn905-A4 / -B4), RSV(A), RSV(B) POSITION(A) (-9 to 0 V, ZT-STn905-A1 / -B1), ICV(A), ICV(B)
   SERVO VALVE(A) in and out (SV-STn905-A2 / -B2); the rest spare. The caution note is typed as drawn. */
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
  const X = [0, 42, 84, 581, 645, 709, 773, 853, 917, 982, 1046, 1124, 1204, 1270, 1348, 1427, 1506, 1587, 1725, 1902, 2030],
    RH = 32;
  /* one table: left x, top y, first thread number, AI or AO, rows
     [name, bare low, up, unit, span, eng low, up, unit, exec low, up, unit, diag low, up, instrument] */
  const table = (x0, T, no, io, R) => {
    const x = i => x0 + X[i],
      M = T + 26,
      Y1 = T + 53,
      B = Y1 + R.length * RH,
      W = X[20];
    H(T, x0, x0 + W);
    H(M, x(3), x(6));
    H(M, x(7), x(15));
    H(Y1, x0, x0 + W);
    X.forEach((c, i) => V(x0 + c, [4, 5, 8, 9, 11, 12, 14].includes(i) ? M : T, B));
    for (let i = 1; i <= R.length; i++) H(Y1 + i * RH, x0, x0 + W);
    const hc = (a, b2) => (x(a) + x(b2)) / 2;
    t.push(
      [hc(0, 1), T + 22, 'thr.', 1],
      [hc(0, 1), T + 48, 'No.', 1],
      [hc(1, 2), T + 22, 'CH', 1],
      [hc(1, 2), T + 48, 'No.', 1],
      [hc(2, 3), T + 37, io + ' Signal Name', 1],
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
      [hc(15, 16), T + 22, 'logic', 1],
      [hc(15, 16), T + 48, 'SH No.', 1],
      [hc(16, 17), T + 22, 'seq.', 1],
      [hc(16, 17), T + 48, 'SH No.', 1],
      [hc(17, 18), T + 37, 'connect', 1],
      [hc(18, 19), T + 37, 'instrument No.', 1],
      [hc(19, 20), T + 37, 'EDB idNo.', 1]
    );
    if (io === 'AI') t.push([hc(13, 15), T + 22, 'diagnosis range', 1], [hc(13, 14), T + 48, 'low', 1], [hc(14, 15), T + 48, 'up', 1]);
    const at = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 18];
    R.forEach((r, i) => {
      const y = Y1 + (i + 1) * RH - 8;
      t.push([x(0) + 6, y, String(no + i)], [x(1) + 8, y, String(i)]);
      r.forEach((z, k) => {
        if (z !== '') t.push([x(at[k]) + 7, y, z]);
      });
    });
    return B;
  };
  /* one servo card: left x, top y of the card definition, first thread number, slot, AI rows, AO rows */
  const card = (x0, y0, no, slot, ai, ao) => {
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
      [419, 'AEH006A'],
      [492, 'DVA'],
      [578, 'TYPE']
    ].forEach(([c, z]) => t.push([x0 + c + 3, y0 + 48, z]));
    const B = table(x0, y0 + 59, no, 'AI', ai);
    table(x0, B + 9, no + 8, 'AO', ao);
  };
  const pos = (z, lo, n) => [z, lo, '0', 'V', '20', '0', '100', '%', '0', '100', '%', '-10000', '10000', n],
    sv = z => [z, '-9.56', '9.56', 'V', '20', '-100', '100', '%', '-100', '100', '%', '-10000', '10000', ''],
    out = (z, hi, n) => [z, hi, '0', 'V', '20', '0', '100', '%', '0', '100', '%', '', '', n],
    sp = ['(SPARE)'];
  card(181, 108, 1, '6',
    [pos('MSV(A) POSITION(C)', '-7', 'ZT-STn903-A3'), pos('MSV(B) POSITION(C)', '-7', 'ZT-STn903-B3'), pos('CV(A) POSITION(C)', '-5', 'ZT-STn904-A3'),
      pos('CV(B) POSITION(C)', '-5', 'ZT-STn904-B3'), sv('MSV(A)  SERVO VALVE(C)'), sv('MSV(B)  SERVO VALVE(C)'), sv('CV(A)  SERVO VALVE(C)'), sv('CV(B)  SERVO VALVE(C)')],
    [out('MSV(A)  SERVO VALVE(B)', '7', 'SV-STn903-A2'), out('MSV(B)  SERVO VALVE(B)', '7', 'SV-STn903-B2'), out('CV(A)  SERVO VALVE(B)', '5', 'SV-STn904-A2'),
      out('CV(B)  SERVO VALVE(B)', '5', 'SV-STn904-B2')]);
  card(174, 725, 13, '7',
    [pos('ICV(A) POSITION(A)', '-8', 'ZT-STn905-A4'), pos('ICV(B) POSITION(A)', '-8', 'ZT-STn905-B4'), pos('RSV(A) POSITION(A)', '-9', 'ZT-STn905-A1'),
      pos('RSV(B) POSITION(A)', '-9', 'ZT-STn905-B1'), sv('ICV(A)  SERVO VALVE(A)'), sv('ICV(B)  SERVO VALVE(A)'), sp, sp],
    [out('ICV(A)  SERVO VALVE(A)', '8', 'SV-STn905-A2'), out('ICV(B)  SERVO VALVE(A)', '8', 'SV-STn905-B2'), sp, sp]);
  /* the caution */
  t.push([172, 1312, '(Caution) AI-CH.NO.'], [326, 1312, '-'], [354, 1312, 'and  AO-CH.NO.'], [483, 1312, '-'], [511, 1312, 'are fixed for R.B..'], [413, 1334, 'not use application.']);
  t.push([224, 1525, 'CONTROLLER:'], [387, 1525, 'EHG+MD']);
  (typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
    id: 'TCE991',
    title: 'EHG SERVO TABLE(2)',
    page: 190,
    ctl: 'EHG+MD',
    cycle: '-',
    f: [156, 90, 2226, 1546],
    l,
    t
  });
})();
