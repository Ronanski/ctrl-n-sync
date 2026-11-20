/* TCA611 MSV(B) ABV SEAT SEC DRAIN VALVE(TC-2) (331DM09788 page 149, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the
   pixels of the page rendered 2296 wide. The motor valve nMV-STn-002B (TORQUE (SEAL-IN) C021, LMA594A / B): auto open by 52G OPEN held
   60 s (TW 030, cleared by INITIAL), auto close by ICV TO CV TRANSFER COMPLETED, with its electrical trouble, limit and torque switches in;
   OPEN / CLOSE COMMAND out over TW A033 / A034 (3.0 s, cleared by INITIAL), OPENED and CLOSED out. 52G OPEN (TW60s) goes out to the other
   drain valve sheets (BTR 031), 52G OPEN itself to TCA729 (BTR 032).
   The words are the ones of the drawing; the tag keeps the small n of the drawing (the unit number).
   live: the transfer signal from the engine (tcs.js tcsLiveRead); the engine holds no state of this valve. */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const MX = 1264,
    MR = 1669;
  /* the inputs of the valve: [key, letter, sheet, x of the connector, y, words, x of the riser, y of the pin] */
  [
    ['iC1', 'C1', 'TCA610', 337, 399, ['ICV TO CV TRANSFER COMPLETED'], 861, 336],
    ['iA3', 'A3', 'TCA042', 336, 516, ['MSV(B) ABV SEAT SEC DRAIN VALVE', 'ELECTRICAL TROUBLE'], 903, 401],
    ['iA1', 'A1', 'TCA042', 334, 644, ['MSV(B) ABV SEAT SEC DRAIN VALVE', 'OPENED'], 946, 433],
    ['iA12', 'A12', 'TCA043', 333, 750, ['MSV(B) ABV SEC DRAIN VALVE', 'TORQUE SW OPEN'], 999, 465],
    ['iA2', 'A2', 'TCA042', 332, 878, ['MSV(B) ABV SEAT SEC DRAIN VALVE', 'CLOSED'], 1052, 530],
    ['iA13', 'A13', 'TCA043', 331, 984, ['MSV(B) ABV SEC DRAIN VALVE', 'TORQUE SW CLOSE'], 1114, 562]
  ].forEach(([key, l, sh, cx, y, names, rx, py]) => {
    c.push([key, 'in', l, cx, y, '', [sh]]);
    names.forEach((s, i) => t.push([cx + 34, y - 10 - 21 * (names.length - 1 - i), s]));
    W(key, [cx + 27, y], [rx, y], [rx, py], [MX, py]);
  });
  /* 52G OPEN: over TW 030 to auto open and out, and out itself */
  c.push(['iK', 'in', 'K', 339, 304, '', ['TCA533']]);
  t.push([372, 294, '52G OPEN']);
  W('iK', [366, 304], [778, 304]);
  W('iK', [742, 304], [742, 1072], [2049, 1072]);
  W('tw030', [838, 304], [MX, 304]);
  W('tw030', [1033, 304], [1033, 166], [2070, 166]);
  /* INITIAL clears the three TW */
  W('kInit', [536, 218], [1756, 218], [1756, 294]);
  W('kInit', [808, 218], [808, 294]);
  W('kInit', [1703, 218], [1703, 359], [1755, 359], [1755, 381]);
  /* out */
  W('vlv.OPS', [MR, 304], [1726, 304]);
  W('twA033', [1786, 304], [2057, 304]);
  W('vlv.CLS', [MR, 368], [1694, 368], [1694, 391], [1725, 391]);
  W('twA034', [1785, 391], [2057, 391]);
  W('vlv.LTOP', [MR, 433], [1694, 433], [1694, 477], [2056, 477]);
  W('vlv.LTCL', [MR, 497], [1693, 497], [1693, 572], [2055, 572]);
  c.push(
    ['oC1', 'out', 'C1', 2097, 166, '', ['TCA610', 'TCA616'], 0, 2],
    ['oA1', 'out', 'A1', 2084, 304, '', ['TCA832']],
    ['oA2', 'out', 'A2', 2084, 391, '', ['TCA832']],
    ['oB1', 'out', 'B1', 2083, 477, '', ['TCA543', 'TCA610']],
    ['oB2', 'out', 'B2', 2082, 572, '', ['-']],
    ['oC2', 'out', 'C2', 2076, 1072, '', ['TCA729']]
  );
  [
    [255, 'OPEN COMMAND'],
    [341, 'CLOSE COMMAND'],
    [426, 'OPENED'],
    [522, 'CLOSED']
  ].forEach(([y, s]) => t.push([1822, y, 'MSV(B) ABV SEAT SEC'], [1822, y + 21, 'DRAIN VALVE'], [1822, y + 42, s]));
  t.push(
    [770, 292, 'T', 2],
    [1718, 292, 'T', 2],
    [1717, 379, 'T', 2],
    [1869, 156, '52G OPEN (TW60s)'],
    [1816, 1062, '52G OPEN'],
    [1953, 200, '(TCA615)', 1, 1.7],
    [1953, 218, '(TCA618)', 1, 1.7],
    [2049, 218, '(TCA625)', 1, 1.7],
    [2145, 218, '(TCA626)', 1, 1.7],
    [228, 1524, 'CONTROLLER:'],
    [390, 1524, 'COMM+MD'],
    [615, 1498, 'TRIGGER  :'],
    [615, 1524, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA611',
    title: 'MSV(B) ABV SEAT SEC DRAIN VALVE(TC-2)',
    page: 149,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    live: { iC1: 'xfer' },
    k: [['kInit', 302, 218, 'INITIAL', 'ref']],
    c,
    m: [
      [
        'vlv',
        'TORQUE (SEAL-IN)',
        'nMV-STn-002B',
        MX,
        257,
        MR - MX,
        384,
        ['AOP', 'ACL', '', 'EF', 'LTOP', 'TROP', '', 'LTCL', 'TRCL', ''],
        ['OPS', '', 'CLS', '', 'LTOP', '', 'LTCL', '', 'AUTO', 'ABN'],
        'C021',
        [
          [1366, 660, '(LMA594A)'],
          [1483, 660, '(LMA594B)'],
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
          ].map((s, i) => [1267, Math.round(682 + 21.5 * i), s]),
          [1470, 682, 'K:0.0%'],
          [1470, 703, 'K:1.0%'],
          [1470, 725, 'TP:5.0s']
        ]
      ]
    ],
    b: [
      ['btr014', 'o:BTR', '014', 1170, 304],
      ['btr016', 'o:BTR', '016', 1170, 336],
      ['btr018', 'o:BTR', '018', 1169, 401],
      ['btr019', 'o:BTR', '019', 1169, 433],
      ['btr023', 'o:BTR', '023', 1169, 465],
      ['btr024', 'o:BTR', '024', 1168, 530],
      ['btr025', 'o:BTR', '025', 1167, 562],
      ['btr027', 'o:BTR', '027', 1733, 477],
      ['btr028', 'o:BTR', '028', 1732, 572],
      ['btr029', 'o:BTR', '029', 606, 218],
      ['tw030', 'TW', '030', 808, 315, ['TW:60s']],
      ['btr031', 'o:BTR', '031', 1778, 166],
      ['btr032', 'o:BTR', '032', 1726, 1072],
      ['twA033', 'TW', 'A033', 1756, 315, ['TW:3.0s']],
      ['twA034', 'TW', 'A034', 1755, 402, ['TW:3.0s']]
    ],
    w,
    j: [
      [742, 304],
      [1033, 304],
      [808, 218],
      [1703, 218]
    ],
    t
  });
})();
