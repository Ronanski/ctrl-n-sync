/* TCA616 CV(B) ABV SEAT SEC DRAIN VALVE(TC-8) (331DM09788 page 151, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the
   pixels of the page rendered 2296 wide. The motor valve nMV-STn-004B (TORQUE (SEAL-IN) C021, LMA594A / B). Auto open (OR 003): CV chest
   warming mode set for 30.0 s (TW A002, cleared by INITIAL), TURBINE RESET OPEN COMMAND, or 52G OPEN (TW60s). Auto close (OR 016): ICV TO
   CV TRANSFER COMPLETED or TURBINE RESET CLOSE COMMAND. With its electrical trouble, limit and torque switches in; OPEN / CLOSE COMMAND
   out over TW A037 / A038 (3.0 s, cleared by INITIAL), OPEND and CLOSED out.
   The words are the ones of the drawing (OPEND as printed; this page prints no TRIGGER line); the tag keeps the small n of the drawing
   (the unit number).
   live: the transfer signal from the engine (tcs.js tcsLiveRead); the engine holds no state of this valve. */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    b = [],
    w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const MX = 1323,
    MR = 1728;
  /* the switches of the valve: [key, letter, sheet, x of the connector, y, second line of words, BTR, x of the BTR, x of the riser, y of the pin] */
  [
    ['iA6', 'A6', 'TCA042', 285, 759, 'ELECTRICAL TROUBLE', '032', 1129, 1182, 400],
    ['iA4', 'A4', 'TCA042', 284, 865, 'OPEND', '033', 1128, 1203, 432],
    ['iA14o', 'A14', 'TCA042', 284, 993, 'TORQUE SW OPEN', '034', 1127, 1224, 464],
    ['iA5', 'A5', 'TCA042', 283, 1099, 'CLOSED', '035', 1126, 1245, 529],
    ['iA14c', 'A14', 'TCA043', 282, 1216, 'TORQUE SW CLOSE', '036', 1125, 1266, 561]
  ].forEach(([key, l, sh, cx, y, s, btr, bx, rx, py]) => {
    c.push([key, 'in', l, cx, y, '', [sh]]);
    t.push([cx + 33, y - 31, 'CV(B) ABV SEC DRAIN VALVE'], [cx + 33, y - 10, s]);
    b.push(['btr' + btr, 'o:BTR', btr, bx, y]);
    W(key, [cx + 27, y], [rx, y], [rx, py], [MX, py]);
  });
  c.push(
    ['iG', 'in', 'G', 291, 259, '', ['TCA535']],
    ['iC1r', 'in', 'C1', 290, 334, '', ['TCA615']],
    ['iC1g', 'in', 'C1', 289, 430, '', ['TCA611']],
    ['iC1t', 'in', 'C1', 287, 590, '', ['TCA610']],
    ['iC2', 'in', 'C2', 286, 674, '', ['TCA615']],
    ['oA1', 'out', 'A1', 2111, 303, '', ['TCA832']],
    ['oA2', 'out', 'A2', 2111, 390, '', ['TCA832']],
    ['oB1', 'out', 'B1', 2110, 475, '', ['TCA543', 'TCA610']],
    ['oB2', 'out', 'B2', 2109, 571, '', ['-']]
  );
  b.push(
    ['twA002', 'TW', 'A002', 633, 270, ['TW:30.0s']],
    ['or003', 'OR', '003', 1187, 281, [], {}, [60, 65]],
    ['or016', 'OR', '016', 1056, 600],
    ['btr027', 'o:BTR', '027', 1790, 475],
    ['btr028', 'o:BTR', '028', 1789, 571],
    ['twA037', 'TW', 'A037', 1824, 314, ['TW:3.0s']],
    ['twA038', 'TW', 'A038', 1824, 401, ['TW:3.0s']]
  );
  /* INITIAL clears the timers */
  W('kInit', [468, 152], [1824, 152], [1824, 293]);
  W('kInit', [633, 152], [633, 249]);
  W('kInit', [1773, 152], [1773, 358], [1824, 358], [1824, 380]);
  /* auto open: OR 003 */
  W('iG', [318, 259], [603, 259]);
  W('twA002', [663, 259], [1157, 259]);
  W('iC1r', [317, 334], [1101, 334], [1101, 281], [1157, 281]);
  W('iC1g', [316, 430], [1132, 430], [1132, 303], [1157, 303]);
  W('or003', [1217, 259], [1292, 259], [1292, 303], [MX, 303]);
  /* auto close: OR 016 */
  W('iC1t', [314, 590], [1026, 590]);
  W('iC2', [313, 674], [980, 674], [980, 611], [1026, 611]);
  W('or016', [1086, 590], [1162, 590], [1162, 335], [MX, 335]);
  /* out */
  W('vlv.OPS', [MR, 303], [1794, 303]);
  W('twA037', [1854, 303], [2084, 303]);
  W('vlv.CLS', [MR, 367], [1763, 367], [1763, 390], [1794, 390]);
  W('twA038', [1854, 390], [2084, 390]);
  W('vlv.LTOP', [MR, 432], [1754, 432], [1754, 475], [2083, 475]);
  W('vlv.LTCL', [MR, 496], [1753, 496], [1753, 571], [2082, 571]);
  t.push(
    [322, 228, 'CRI2.81 CV CHEST WARMING'],
    [322, 249, 'MODE SET'],
    [321, 303, 'TURBINE RESET'],
    [321, 324, 'OPEN COMMAND'],
    [321, 420, '52G OPEN (TW60s)'],
    [319, 580, 'ICV TO CV TRANSFER COMPLETED'],
    [318, 664, 'TURBINE RESET CLOSE COMMAND'],
    [595, 247, 'T', 2],
    [1786, 291, 'T', 2],
    [1786, 378, 'T', 2],
    [1860, 275, 'CV(B) ABV SEC DRAIN VALVE'],
    [1865, 296, 'OPEN COMMAND'],
    [1859, 360, 'CV(B) ABV SEC DRAIN VALVE'],
    [1859, 381, 'CLOSE COMMAND'],
    [1860, 445, 'CV(B) ABV SEC DRAIN'],
    [1864, 466, 'VALVE OPEND'],
    [1859, 541, 'CV(B) ABV SEC DRAIN'],
    [1859, 562, 'VALVE CLOSED'],
    [337, 188, '(TCA050)'],
    [238, 1513, 'CONTROLLER:'],
    [398, 1513, 'COMM+MD'],
    [621, 1513, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA616',
    title: 'CV(B) ABV SEAT SEC DRAIN VALVE(TC-8)',
    page: 151,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    live: { iC1t: 'xfer' },
    k: [['kInit', 234, 152, 'INITIAL', 'ref']],
    c,
    m: [
      [
        'vlv',
        'TORQUE (SEAL-IN)',
        'nMV-STn-004B',
        MX,
        256,
        MR - MX,
        384,
        ['AOP', 'ACL', '', 'EF', 'LTOP', 'TROP', '', 'LTCL', 'TRCL', ''],
        ['OPS', '', 'CLS', '', 'LTOP', '', 'LTCL', '', 'AUTO', 'ABN'],
        'C021',
        [
          [1425, 659, '(LMA594A)'],
          [1540, 659, '(LMA594B)'],
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
          ].map((s, i) => [1325, Math.round(680 + 21.5 * i), s]),
          [1528, 680, 'K:0.0%'],
          [1528, 702, 'K:1.0%'],
          [1528, 723, 'TP:5.0s']
        ]
      ]
    ],
    b,
    w,
    j: [
      [633, 152],
      [1773, 152]
    ],
    t
  });
})();
