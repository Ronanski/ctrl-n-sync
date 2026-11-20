/* TCA625 CRV(A) BEL SEAT SEC DRAIN VALVE(TC-12) (331DM09788 page 153, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the
   pixels of the page rendered 2296 wide. The motor valve nMV-STn-010A (TORQUE (SEAL-IN) C021, LMA594A / B): auto open by 52G OPEN (TW60s),
   auto close by ICV TO CV TRANSFER START, with its electrical trouble, limit and torque switches in; OPEN / CLOSE COMMAND out over
   TW A031 / A032 (3.0 s, cleared by INITIAL), OPENED and CLOSED out. The transfer start also goes out to TCA626 (BTR 029).
   The words are the ones of the drawing (DRSIN as printed); the tag keeps the small n of the drawing (the unit number).
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
    ['iA9', 'A9', 'TCA040', 337, 511, ['CRV(A) BEL SEAT SEC DRAIN VALVE', 'ELECTRICAL TROUBLE'], '018', 1169, 901, 399],
    ['iA7', 'A7', 'TCA040', 334, 639, ['CRV(A) BEL SEAT SEC DRAIN VALVE', 'OPENED'], '019', 1169, 945, 431],
    ['iA14o', 'A14', 'TCA040', 333, 746, ['CRV(A) BEL SEC DRSIN VALVE CLOSED'], '023', 1168, 998, 463],
    ['iA8', 'A8', 'TCA040', 331, 873, ['CRV(A) BEL SEAT SEC DRAIN VALVE', 'CLOSED'], '024', 1167, 1051, 528],
    ['iA14c', 'A14', 'TCA041', 330, 980, ['CRV(A) BEL SEC DRAIN VALVE', 'TORQUE SW CLOSE'], '025', 1166, 1114, 560]
  ].forEach(([key, l, sh, cx, y, names, btr, bx, rx, py]) => {
    c.push([key, 'in', l, cx, y, '', [sh]]);
    names.forEach((s, i) => t.push([cx + 33, y - 10 - 21 * (names.length - 1 - i), s]));
    b.push(['btr' + btr, 'o:BTR', btr, bx, py]);
    W(key, [cx + 27, y], [rx, y], [rx, py], [MX, py]);
  });
  c.push(
    ['iC1', 'in', 'C1', 339, 302, '', ['TCA611']],
    ['iA2', 'in', 'A2', 338, 396, '', ['TCE184'], 1],
    ['oA1', 'out', 'A1', 2085, 302, '', ['TCA830']],
    ['oA2', 'out', 'A2', 2084, 390, '', ['TCA830']],
    ['oB1', 'out', 'B1', 2082, 476, '', ['TCA543', 'TCA610']],
    ['oB2', 'out', 'B2', 2081, 572, '', ['-']],
    ['oC1', 'out', 'C1', 2074, 1092, '', ['TCA626']]
  );
  b.push(
    ['btr014', 'o:BTR', '014', 1170, 302],
    ['btr016', 'o:BTR', '016', 1170, 334],
    ['btr027', 'o:BTR', '027', 1731, 476],
    ['btr028', 'o:BTR', '028', 1730, 572],
    ['btr029', 'o:BTR', '029', 1723, 1092],
    ['btr030', 'o:BTR', '030', 619, 162],
    ['twA031', 'TW', 'A031', 1765, 313, ['TW:3.0s']],
    ['twA032', 'TW', 'A032', 1764, 401, ['TW:3.0s']]
  );
  /* auto open, auto close, the transfer start out */
  W('iC1', [366, 302], [MX, 302]);
  W('iA2', [365, 396], [860, 396]);
  W('iA2', [860, 396], [860, 334], [MX, 334]);
  W('iA2', [860, 396], [860, 1092], [2047, 1092]);
  /* INITIAL clears the two TW */
  W('kInit', [550, 162], [1765, 162], [1765, 292]);
  W('kInit', [1715, 162], [1715, 358], [1764, 358], [1764, 380]);
  /* out */
  W('vlv.OPS', [MR, 302], [1735, 302]);
  W('twA031', [1795, 302], [2058, 302]);
  W('vlv.CLS', [MR, 366], [1704, 366], [1704, 390], [1734, 390]);
  W('twA032', [1794, 390], [2057, 390]);
  W('vlv.LTOP', [MR, 431], [1694, 431], [1694, 476], [2055, 476]);
  W('vlv.LTCL', [MR, 495], [1693, 495], [1693, 572], [2054, 572]);
  [
    [255, 'OPEN COMMAND'],
    [340, 'CLOSE COMMAND'],
    [425, 'OPENED'],
    [521, 'CLOSED']
  ].forEach(([y, s]) => t.push([1822, y, 'CRV(A) BEL SEAT SEC'], [1822, y + 21, 'DRAIN VALVE'], [1822, y + 42, s]));
  t.push(
    [372, 292, '52G OPEN (TW60s)'],
    [371, 386, 'ICV TO CV TRANSFER START'],
    [1815, 1064, 'ICV TO CV TRANSFER START'],
    [1727, 290, 'T', 2],
    [1726, 378, 'T', 2],
    [225, 1521, 'CONTROLLER:'],
    [388, 1521, 'COMM+MD'],
    [611, 1495, 'TRIGGER  :'],
    [611, 1521, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA625',
    title: 'CRV(A) BEL SEAT SEC DRAIN VALVE(TC-12)',
    page: 153,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    k: [['kInit', 316, 162, 'INITIAL', 'ref']],
    c,
    m: [
      [
        'vlv',
        'TORQUE (SEAL-IN)',
        'nMV-STn-010A',
        MX,
        255,
        MR - MX,
        384,
        ['AOP', 'ACL', '', 'EF', 'LTOP', 'TROP', '', 'LTCL', 'TRCL', ''],
        ['OPS', '', 'CLS', '', 'LTOP', '', 'LTCL', '', 'AUTO', 'ABN'],
        'C021',
        [
          [1365, 659, '(LMA594A)'],
          [1482, 659, '(LMA594B)'],
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
          ].map((s, i) => [1267, Math.round(680 + 21.5 * i), s]),
          [1469, 680, 'K:0.0%'],
          [1469, 701, 'K:1.0%'],
          [1469, 723, 'TP:5.0s']
        ]
      ]
    ],
    b,
    w,
    j: [
      [860, 396],
      [1715, 162]
    ],
    t
  });
})();
