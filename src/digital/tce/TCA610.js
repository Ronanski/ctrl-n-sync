/* TCA610 MSV(A) ABV SEAT SEC DRAIN VALVE(TC-1) (331DM09788 page 148, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the
   pixels of the page rendered 2296 wide. The motor valve nMV-STn-002A (TORQUE (SEAL-IN) C021, LMA594A / B): auto open by 52G OPEN (TW60s),
   auto close by IP TO HP TRANSFER COMPLETED, with its electrical trouble, limit and torque switches in; OPEN / CLOSE COMMAND out over
   TW A033 / A034 (3.0 s, cleared by INITIAL), OPENED and CLOSED out. The transfer signal also goes out as ICV TO CV TRANSFER COMPLETED
   (BTR 029); the six drain valves open (A 030) give CRI:1.25 (BTR 031).
   The words are the ones of the drawing (OPEND as printed); the tag keeps the small n of the drawing (the unit number).
   live: the transfer signal from the engine (tcs.js tcsLiveRead); the engine holds no state of this valve. */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const MX = 1276,
    MR = 1681;
  /* the inputs of the valve: [key, letter, sheet, x of the connector, y, words, x of the riser (0 = straight), y of the pin] */
  [
    ['iC1', 'C1', 'TCA611', 349, 262, ['52G OPEN (TW60s)'], 0, 262],
    ['iA3', 'A3', 'TCA040', 347, 476, ['MSV(A) ABV SEAT SEC DRAIN VALVE', 'ELECTRICAL TROUBLE'], 914, 359],
    ['iA1', 'A1', 'TCA040', 346, 561, ['MSV(A) ABV SEAT SEC DRAIN VALVE', 'OPENED'], 955, 391],
    ['iA13o', 'A13', 'TCA040', 345, 635, ['MSV(A) ABV SEC DRAIN VALVE', 'TORQUE SW OPEN'], 1009, 423],
    ['iA2', 'A2', 'TCA040', 344, 709, ['MSV(A) ABV SEAT SEC DRAIN VALVE', 'CLOSED'], 1063, 488],
    ['iA13c', 'A13', 'TCA041', 344, 784, ['MSV(A) ABV SEC DRAIN VALVE', 'TORQUE SW CLOSE'], 1125, 520]
  ].forEach(([key, l, sh, cx, y, names, rx, py]) => {
    c.push([key, 'in', l, cx, y, '', [sh]]);
    names.forEach((s, i) => t.push([cx + 34, y - 10 - 21 * (names.length - 1 - i), s]));
    if (rx) W(key, [cx + 27, y], [rx, y], [rx, py], [MX, py]);
    else W(key, [cx + 27, y], [MX, py]);
  });
  /* IP TO HP TRANSFER COMPLETED: auto close, and out */
  c.push(['iE', 'in', 'E', 348, 359, '', ['TCA535']]);
  t.push([382, 349, 'IP TO HP TRANSFER COMPLETED']);
  W('iE', [375, 359], [871, 359]);
  W('iE', [871, 359], [871, 294], [MX, 294]);
  W('iE', [871, 359], [871, 860], [2031, 860]);
  /* the six drain valves open: CRI:1.25 */
  [
    ['iB1a', '*', 331, 985, 'MSV(A) ABV SEC DRAIN VALVE FULL OPEN', 0, 985],
    ['iB1b', 'TCA611', 330, 1070, 'MSV(B) ABV SEC DRAIN VALVE FULL OPEN', 886, 1008],
    ['iB1c', 'TCA615', 330, 1145, 'CV(A) ABV SEC DRAIN VALVE OPEND', 951, 1029],
    ['iB1d', 'TCA616', 329, 1219, 'CV(B) ABV SEC DRAIN VALVE OPEND', 1003, 1050],
    ['iB1e', 'TCA625', 328, 1294, 'CRV(A) BEL SEC DRAIN VALVE FULL OPEN', 1057, 1071],
    ['iB1f', 'TCA626', 328, 1368, 'CRV(B) BEL SEC DRAIN VALVE FULL OPEN', 1110, 1092]
  ].forEach(([key, sh, cx, y, name, rx, py]) => {
    c.push([key, 'in', 'B1', cx, y, '', [sh]]);
    t.push([cx + 34, y - 10, name]);
    if (rx) W(key, [cx + 27, y], [rx, y], [rx, py], [1165, py]);
    else W(key, [cx + 27, y], [1165, py]);
  });
  W('a030', [1225, 985], [2030, 985]);
  /* INITIAL clears the two TW */
  W('kInit', [558, 166], [1777, 166], [1777, 253]);
  W('kInit', [1725, 166], [1725, 316], [1776, 316], [1776, 338]);
  /* out */
  W('vlv.OPS', [MR, 262], [1746, 262]);
  W('twA033', [1806, 262], [2068, 262]);
  W('vlv.CLS', [MR, 326], [1715, 326], [1715, 348], [1746, 348]);
  W('twA034', [1806, 348], [2068, 348]);
  W('vlv.LTOP', [MR, 391], [1707, 391], [1707, 434], [2067, 434]);
  W('vlv.LTCL', [MR, 455], [1706, 455], [1706, 530], [2067, 530]);
  c.push(
    ['oA1', 'out', 'A1', 2095, 262, '', ['TCA830']],
    ['oA2', 'out', 'A2', 2095, 348, '', ['TCA830']],
    ['oB1', 'out', 'B1', 2094, 434, '', ['*', 'TCA543']],
    ['oB2', 'out', 'B2', 2094, 530, '', ['-']],
    ['oC1', 'out', 'C1', 2058, 860, '', ['TCA615', 'TCA611'], 0, 2],
    ['oC2', 'out', 'C2', 2057, 985, '', ['-']]
  );
  [
    [213, 'OPEN COMMAND'],
    [298, 'CLOSE COMMAND'],
    [383, 'OPENED'],
    [479, 'CLOSED']
  ].forEach(([y, s]) => t.push([1833, y, 'MSV(A) ABV SEAT SEC'], [1833, y + 21, 'DRAIN VALVE'], [1833, y + 42, s]));
  t.push(
    [1738, 250, 'T', 2],
    [1738, 336, 'T', 2],
    [1681, 850, 'ICV TO CV TRANSFER COMPLETED'],
    [1681, 975, 'CRI:1.25'],
    [2013, 910, '(TCA618)', 1, 1.7],
    [2103, 910, '(TCA616)', 1, 1.7],
    [242, 1524, 'CONTROLLER:'],
    [395, 1524, 'COMM+MD'],
    [628, 1498, 'TRIGGER  :'],
    [628, 1524, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA610',
    title: 'MSV(A) ABV SEAT SEC DRAIN VALVE(TC-1)',
    page: 148,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    live: { iE: 'xfer' },
    k: [['kInit', 324, 166, 'INITIAL', 'ref']],
    c,
    m: [
      [
        'vlv',
        'TORQUE (SEAL-IN)',
        'nMV-STn-002A',
        MX,
        215,
        MR - MX,
        384,
        ['AOP', 'ACL', '', 'EF', 'LTOP', 'TROP', '', 'LTCL', 'TRCL', ''],
        ['OPS', '', 'CLS', '', 'LTOP', '', 'LTCL', '', 'AUTO', 'ABN'],
        'C021',
        [
          [1378, 618, '(LMA594A)'],
          [1493, 618, '(LMA594B)'],
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
          ].map((s, i) => [1279, Math.round(640 + 21.5 * i), s]),
          [1481, 640, 'K:0.0%'],
          [1481, 662, 'K:1.0%'],
          [1481, 683, 'TP:5.0s']
        ]
      ]
    ],
    b: [
      ['btr014', 'o:BTR', '014', 1180, 262],
      ['btr016', 'o:BTR', '016', 1180, 294],
      ['btr018', 'o:BTR', '018', 1179, 359],
      ['btr019', 'o:BTR', '019', 1179, 391],
      ['btr023', 'o:BTR', '023', 1179, 423],
      ['btr024', 'o:BTR', '024', 1178, 488],
      ['btr025', 'o:BTR', '025', 1178, 520],
      ['btr027', 'o:BTR', '027', 1743, 434],
      ['btr028', 'o:BTR', '028', 1743, 530],
      ['btr029', 'o:BTR', '029', 1631, 860],
      ['a030', 'A', '030', 1195, 1039, [], {}, [60, 128]],
      ['btr031', 'o:BTR', '031', 1631, 985],
      ['btr032', 'o:BTR', '032', 627, 166],
      ['twA033', 'TW', 'A033', 1776, 274, ['TW:3.0s']],
      ['twA034', 'TW', 'A034', 1776, 359, ['TW:3.0s']]
    ],
    w,
    j: [
      [871, 359],
      [1725, 166]
    ],
    t
  });
})();
