/* TCA626 CRV(B) BEL SEAT SEC DRAIN VALVE(TC-13) (331DM09788 page 154, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the
   pixels of the page rendered 2296 wide. The motor valve nMV-STn-010B (TORQUE (SEAL-IN) C021, LMA594A / B): auto open by the line C1 of
   TCA611, auto close by ICV TO CV TRANSFER START (C1 of TCA625), with its electrical trouble, limit and torque switches in; OPEN / CLOSE
   COMMAND out over TW A030 / A031 (3.0 s, cleared by INITIAL), OPENED and CLOSED out.
   The words are the ones of the drawing. Two of them differ from the sister sheet TCA625 and are typed as printed: the line C1 of TCA611
   is named 52G CLOSE here (TCA611 names its C1 52G OPEN (TW60s)), and the close command is named CRV(A).
   The tag keeps the small n of the drawing (the unit number).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    b = [],
    w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const MX = 1265,
    MR = 1670;
  /* the switches of the valve: [key, letter, sheet, x of the connector, y, words, BTR, x of the BTR, x of the riser, y of the pin] */
  [
    ['iA9', 'A9', 'TCA042', 337, 512, ['CRV(B) BEL SEAT SEC DRAIN VALVE', 'ELECTRICAL TROUBLE'], '018', 1170, 903, 397],
    ['iA7', 'A7', 'TCA042', 335, 640, ['CRV(B)  BEL SEAT SEC DRAIN VALVE', 'OPENED'], '019', 1170, 945, 429],
    ['iA15o', 'A15', 'TCA042', 334, 746, ['CRV(B) BEL SEC DRAIN VALVE', 'TORQUE SW OPEN'], '023', 1169, 999, 461],
    ['iA8', 'A8', 'TCA042', 333, 874, ['CRV(B) BEL SEAT SEC DRAIN VALVE', 'CLOSED'], '024', 1168, 1052, 526],
    ['iA15c', 'A15', 'TCA043', 332, 980, ['CRV(B) BEL SEC DRAIN VALVE', 'TORQUE SW CLOSE'], '025', 1168, 1115, 558]
  ].forEach(([key, l, sh, cx, y, names, btr, bx, rx, py]) => {
    c.push([key, 'in', l, cx, y, '', [sh]]);
    names.forEach((s, i) => t.push([cx + 33, y - 10 - 21 * (names.length - 1 - i), s]));
    b.push(['btr' + btr, 'o:BTR', btr, bx, py]);
    W(key, [cx + 27, y], [rx, y], [rx, py], [MX, py]);
  });
  c.push(
    ['iC1g', 'in', 'C1', 339, 300, '', ['TCA611']],
    ['iC1t', 'in', 'C1', 338, 395, '', ['TCA625']],
    ['oA1', 'out', 'A1', 2086, 300, '', ['TCA832']],
    ['oA2', 'out', 'A2', 2085, 387, '', ['TCA832']],
    ['oB1', 'out', 'B1', 2084, 472, '', ['TCA543', 'TCA610']],
    ['oB2', 'out', 'B2', 2083, 568, '', ['-']]
  );
  b.push(
    ['btr014', 'o:BTR', '014', 1171, 300],
    ['btr016', 'o:BTR', '016', 1171, 332],
    ['btr027', 'o:BTR', '027', 1733, 472],
    ['btr028', 'o:BTR', '028', 1732, 568],
    ['btr029', 'o:BTR', '029', 607, 161],
    ['twA030', 'TW', 'A030', 1767, 311, ['TW:3.0s']],
    ['twA031', 'TW', 'A031', 1766, 398, ['TW:3.0s']]
  );
  /* auto open, auto close */
  W('iC1g', [366, 300], [MX, 300]);
  W('iC1t', [365, 395], [861, 395], [861, 332], [MX, 332]);
  /* INITIAL clears the two TW */
  W('kInit', [538, 161], [1767, 161], [1767, 290]);
  W('kInit', [1716, 161], [1716, 355], [1766, 355], [1766, 377]);
  /* out */
  W('vlv.OPS', [MR, 300], [1737, 300]);
  W('twA030', [1797, 300], [2059, 300]);
  W('vlv.CLS', [MR, 364], [1706, 364], [1706, 387], [1736, 387]);
  W('twA031', [1796, 387], [2058, 387]);
  W('vlv.LTOP', [MR, 429], [1696, 429], [1696, 472], [2057, 472]);
  W('vlv.LTCL', [MR, 493], [1695, 493], [1695, 568], [2056, 568]);
  [
    [251, 'CRV(B) BEL SEAT SEC', 'OPEN COMMAND'],
    [336, 'CRV(A) BEL SEAT SEC', 'CLOSE COMMAND'],
    [421, 'CRV(B) BEL SEAT SEC', 'OPENED'],
    [517, 'CRV(B) BEL SEAT SEC', 'CLOSED']
  ].forEach(([y, a, s]) => t.push([1823, y, a], [1823, y + 21, 'DRAIN VALVE'], [1823, y + 42, s]));
  t.push(
    [372, 290, '52G CLOSE'],
    [371, 385, 'ICV TO CV TRANSFER START'],
    [1729, 288, 'T', 2],
    [1728, 375, 'T', 2],
    [232, 1521, 'CONTROLLER:'],
    [392, 1521, 'COMM+MD'],
    [617, 1495, 'TRIGGER  :'],
    [617, 1521, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA626',
    title: 'CRV(B) BEL SEAT SEC DRAIN VALVE(TC-13)',
    page: 154,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    k: [['kInit', 304, 161, 'INITIAL', 'ref']],
    c,
    m: [
      [
        'vlv',
        'TORQUE (SEAL-IN)',
        'nMV-STn-010B',
        MX,
        253,
        MR - MX,
        384,
        ['AOP', 'ACL', '', 'EF', 'LTOP', 'TROP', '', 'LTCL', 'TRCL', ''],
        ['OPS', '', 'CLS', '', 'LTOP', '', 'LTCL', '', 'AUTO', 'ABN'],
        'C021',
        [
          [1367, 656, '(LMA594A)'],
          [1484, 656, '(LMA594B)'],
          ...[
            'TD:5.0s',
            'TD:5.0s',
            'TP:35.0s',
            'TP:35.0s',
            'R :20.0',
            'M :1',
            'HL:100.0',
            'LL:0.0',
            'K:99.0%',
            'TP:5.0s'
          ].map((s, i) => [1268, Math.round(678 + 21.5 * i), s]),
          [1471, 678, 'K:0.0%'],
          [1471, 699, 'K:1.0%'],
          [1471, 721, 'TP:5.0s']
        ]
      ]
    ],
    b,
    w,
    j: [[1716, 161]],
    t
  });
})();
