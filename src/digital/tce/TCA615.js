/* TCA615 CV(A) ABV SEAT SEC DRAIN VALVE(TC-7) (331DM09788 page 150, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the
   pixels of the page rendered 2296 wide. The motor valve nMV-STn-004A (TORQUE (SEAL-IN) C021, LMA594A / B). Auto open (OR 003): CV chest
   warming mode set for 30.0 s (TW A002), turbine reset open command, or 52G OPEN (TW60s). Auto close (OR 016): ICV TO CV TRANSFER
   COMPLETED or turbine reset close command. The turbine reset: both MSV not full open (NOT 006 / 031, A 007) for 5.0 s (TP A008) with
   trip press. not low (NOT 014, A 009); its NOT held 60.0 s (TW A011) = TURBINE RESET OPEN COMMAND, with CV CHEST WARMING COMPLETE
   (A 018) = TURBINE RESET CLOSE COMMAND. OPEN / CLOSE COMMAND out over TW A040 / A039 (3.0 s); INITIAL clears the timers.
   The words are the ones of the drawing (OPEND as printed; this page prints no TRIGGER line); the tag keeps the small n of the drawing (the unit number).
   live: the transfer signal from the engine (tcs.js tcsLiveRead); the engine holds no state of this valve. */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    b = [],
    w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const MX = 1315,
    MR = 1720;
  /* the switches of the valve: [key, letter, sheet, x of the connector, y, second line of words, BTR, x of the BTR, x of the riser, y of the pin] */
  [
    ['iA6', 'A6', 'TCA040', 267, 854, 'ELECTRICAL TROUBLE', '032', 1110, 1174, 407],
    ['iA4', 'A4', 'TCA040', 267, 929, 'OPEND', '033', 1110, 1195, 439],
    ['iA15o', 'A15', 'TCA040', 266, 1002, 'TORQUE SW OPEN', '034', 1110, 1216, 471],
    ['iA5', 'A5', 'TCA040', 266, 1067, 'CLOSED', '035', 1109, 1237, 536],
    ['iA15c', 'A15', 'TCA041', 265, 1141, 'TORQUE SW CLOSE', '036', 1109, 1258, 568]
  ].forEach(([key, l, sh, cx, y, s, btr, bx, rx, py]) => {
    c.push([key, 'in', l, cx, y, '', [sh]]);
    t.push([cx + 34, y - 31, 'CV(A) ABV SEC DRAIN VALVE'], [cx + 34, y - 10, s]);
    b.push(['btr' + btr, 'o:BTR', btr, bx, y]);
    W(key, [cx + 27, y], [rx, y], [rx, py], [MX, py]);
  });
  c.push(
    ['iG', 'in', 'G', 282, 269, '', ['TCA535']],
    ['iB1', 'in', 'B1', 281, 344, '', ['TCA533']],
    ['iB2', 'in', 'B2', 280, 408, '', ['TCA533']],
    ['iC1a', 'in', 'C1', 280, 546, '', ['TCA611']],
    ['iC1b', 'in', 'C1', 279, 600, '', ['TCA610']],
    ['iB1d', 'in', 'B1', 279, 684, '', ['TCE152'], 1],
    ['oA1', 'out', 'A1', 2104, 310, '', ['TCA830']],
    ['oA2', 'out', 'A2', 2103, 396, '', ['TCA830']],
    ['oB1', 'out', 'B1', 2103, 482, '', ['TCA543', 'TCA610']],
    ['oB2', 'out', 'B2', 2102, 578, '', ['-']],
    ['oC1', 'out', 'C1', 2100, 716, '', ['TCA616']],
    ['oC2', 'out', 'C2', 2099, 801, '', ['TCA616']]
  );
  b.push(
    ['twA002', 'TW', 'A002', 624, 280, ['TW:30.0s']],
    ['or003', 'OR', '003', 1179, 290, [], {}, [60, 65]],
    ['not006', 'NOT', '006', 517, 355],
    ['a007', 'A', '007', 623, 354],
    ['tpA008', 'TP', 'A008', 730, 355, ['TP:5.0s']],
    ['a009', 'A', '009', 837, 354],
    ['not010', 'NOT', '010', 943, 355],
    ['twA011', 'TW', 'A011', 1051, 355, ['TW:60.0s']],
    ['not014', 'NOT', '014', 730, 493],
    ['or016', 'OR', '016', 1049, 610],
    ['a018', 'A', '018', 940, 695],
    ['btr028', 'o:BTR', '028', 1783, 578],
    ['not031', 'NOT', '031', 516, 419],
    ['btr037', 'o:BTR', '037', 1782, 716],
    ['btr038', 'o:BTR', '038', 1782, 801],
    ['twA039', 'TW', 'A039', 1816, 407, ['TW:3.0s']],
    ['twA040', 'TW', 'A040', 1816, 321, ['TW:3.0s']],
    ['btr041', 'o:BTR', '041', 1795, 482]
  );
  /* INITIAL clears the timers */
  W('kInit', [459, 162], [1816, 162], [1816, 300]);
  W('kInit', [624, 162], [624, 259]);
  W('kInit', [730, 162], [730, 334]);
  W('kInit', [1051, 162], [1051, 334]);
  W('kInit', [1765, 162], [1765, 364], [1816, 364], [1816, 386]);
  /* auto open: OR 003 */
  W('iG', [309, 269], [594, 269]);
  W('twA002', [654, 269], [1149, 269]);
  W('iC1a', [307, 546], [1125, 546], [1125, 311], [1149, 311]);
  W('or003', [1209, 269], [1284, 269], [1284, 310], [MX, 310]);
  /* the turbine reset */
  W('iB1', [308, 344], [487, 344]);
  W('not006', [547, 344], [593, 344]);
  W('iB2', [307, 408], [486, 408]);
  W('not031', [546, 408], [570, 408], [570, 365], [593, 365]);
  W('a007', [653, 344], [700, 344]);
  W('tpA008', [760, 344], [807, 344]);
  W('kTrip', [458, 482], [700, 482]);
  W('not014', [760, 482], [783, 482], [783, 365], [807, 365]);
  W('a009', [867, 344], [913, 344]);
  W('a009', [889, 344], [889, 706], [910, 706]);
  W('not010', [973, 344], [1021, 344]);
  W('twA011', [1081, 344], [1103, 344], [1103, 290], [1149, 290]);
  W('twA011', [1103, 344], [1103, 716], [2073, 716]);
  /* auto close: OR 016 */
  W('iC1b', [306, 600], [1019, 600]);
  W('iB1d', [306, 684], [910, 684]);
  W('a018', [970, 684], [994, 684], [994, 621], [1019, 621]);
  W('a018', [994, 684], [994, 801], [2072, 801]);
  W('or016', [1079, 600], [1156, 600], [1156, 342], [MX, 342]);
  /* out */
  W('vlv.OPS', [MR, 310], [1786, 310]);
  W('twA040', [1846, 310], [2077, 310]);
  W('vlv.CLS', [MR, 374], [1755, 374], [1755, 396], [1786, 396]);
  W('twA039', [1846, 396], [2076, 396]);
  W('vlv.LTOP', [MR, 439], [1763, 439], [1763, 482], [2076, 482]);
  W('vlv.LTCL', [MR, 503], [1746, 503], [1746, 578], [2075, 578]);
  t.push(
    [314, 238, 'CRI2.81 CV CHEST WARMING'],
    [314, 259, 'MODE SET'],
    [314, 313, 'MSV(A)'],
    [314, 334, 'FULL OPEN'],
    [313, 377, 'MSV(B)'],
    [313, 398, 'FULL OPEN'],
    [312, 536, '52G OPEN (TW60s)'],
    [312, 590, 'ICV TO CV TRANSFER COMPLETED'],
    [312, 674, 'CV CHEST WARMING COMPLETE'],
    [586, 257, 'T', 2],
    [692, 332, 'T', 2],
    [1012, 332, 'T', 2],
    [1778, 298, 'T', 2],
    [1777, 384, 'T', 2],
    [1862, 281, 'CV(A) ABV SEC DRAIN VALVE'],
    [1862, 302, 'OPEN COMMAND'],
    [1862, 367, 'CV(A) ABV SEC DRAIN VALVE'],
    [1862, 388, 'CLOSE COMMAND'],
    [1884, 452, 'CV(A) ABV SEC DRAIN'],
    [1884, 473, 'VALVE OPEND'],
    [1852, 548, 'CV(A) ABV SEC DRAIN'],
    [1852, 569, 'VALVE CLOSED'],
    [1851, 686, 'TURBINE RESET'],
    [1851, 707, 'OPEN COMMAND'],
    [1851, 771, 'TURBINE RESET'],
    [1851, 792, 'CLOSE COMMAND'],
    [328, 198, '(TCA050)'],
    [327, 518, '(TCA053)'],
    [232, 1522, 'CONTROLLER:'],
    [392, 1522, 'COMM+MD'],
    [616, 1522, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA615',
    title: 'CV(A) ABV SEAT SEC DRAIN VALVE(TC-7)',
    page: 150,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    live: { iC1b: 'xfer' },
    k: [
      ['kInit', 225, 162, 'INITIAL', 'ref'],
      ['kTrip', 224, 482, 'TRIP PRESS.LOW', 'ref']
    ],
    c,
    m: [
      [
        'vlv',
        'TORQUE (SEAL-IN)',
        'nMV-STn-004A',
        MX,
        263,
        MR - MX,
        384,
        ['AOP', 'ACL', '', 'EF', 'LTOP', 'TROP', '', 'LTCL', 'TRCL', ''],
        ['OPS', '', 'CLS', '', 'LTOP', '', 'LTCL', '', 'AUTO', 'ABN'],
        'C021',
        [
          [1418, 666, '(LMA594A)'],
          [1533, 666, '(LMA594B)'],
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
          ].map((s, i) => [1319, Math.round(688 + 21.5 * i), s]),
          [1520, 688, 'K:0.0%'],
          [1520, 709, 'K:1.0%'],
          [1520, 731, 'TP:5.0s']
        ]
      ]
    ],
    b,
    w,
    j: [
      [624, 162],
      [730, 162],
      [1051, 162],
      [1765, 162],
      [889, 344],
      [1103, 344],
      [994, 684]
    ],
    t
  });
})();
