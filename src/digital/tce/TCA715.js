/* TCA715 NO.5 EXTRUCTION STEAM NON RETURN VALVE (TC-45) (331DM09788 page 175, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. The air operated valve nXV-TSn730 (AIR OPERAT VALVE A021, LMA593), gate by gate
   as drawn:
   - FFP = OFF(0). A 023 = AVEIRABLE and the TEST push button, into S of FFR 024. A 026 = AVEIRABLE and TEST CANCEL, into OR 039;
     TP 040 (10.0, INITIAL on its top) of the FFR output taken inverted is the other input of OR 039, into R of FFR 024.
   - The FFR output = the TEST FB lamp, and OR 025 with NO.2 LP HEATER LEVEL VERY HIGH (A6 of TCA043): NOT 037 of it to SVE, OR 025
     itself to SVD. A 027 = AVEIRABLE and the RESET push button, to RESET. Valve opened / closed (A5 / A4 of TCA043) to LTOP / LTCL.
   - SVE out (A1 to TCA835), LTOP out (A2), LTCL out (A3); ABN = the lamp worded VALVE ENERGIZE COMMAND on the drawing.
   The words are the ones of the drawing (EXTRUCTION, AVEIRABLE, SDECONDARY, OPERAT as printed). The tag keeps the small n of the
   drawing (the unit number).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const F = [172, 90, 2234, 1550],
    u = (F[2] - F[0]) / 1000,
    MX = 1312,
    MR = 1720,
    TOP = 341,
    H = 383,
    P = i => TOP + 15 * u + ((i + 0.5) * (H - 30 * u)) / 10,
    R1 = P(1),
    R2 = R1 + 21.5;
  /* the push buttons and AVEIRABLE into the gates */
  W('crtIys', [403, 164], [551, 164], [551, 622], [572.2, 622]);
  W('crtIys', [551, R1], [572.2, R1]);
  W('crtIys', [551, 505], [572.2, 505]);
  W('crtKta', [392, R2], [572.2, R2]);
  W('crtKtac', [392, 526.5], [572.2, 526.5]);
  W('crtIkr', [390, 643.5], [572.2, 643.5]);
  /* test: set / reset */
  W('a023', [629.8, R1], [870, R1]);
  W('a026', [629.8, 505], [775.2, 505]);
  W('or039', [832.8, 505], [860, 505], [860, R2], [870, R2]);
  W('tp040', [736.8, 526.5], [775.2, 526.5]);
  W('ffr024', [950, R1], [1085.7, R1]);
  W('ffr024', [1007, R1], [1007, 166], [1311, 166]);
  W('ffr024', [975, R1], [975, 590], [653, 590], [653, 526.5], [679.2, 526.5]);
  W('kInit', [522, 238], [710, 238], [710, 515.5]);
  /* to the valve */
  W('kOff', [522, 344], [1041, 344], [1041, P(0)], [MX, P(0)]);
  W('iA6', [292, 739], [1003, 739], [1003, R2], [1085.7, R2]);
  W('or025', [1143.3, R1], [1181.2, R1]);
  W('or025', [1157, R1], [1157, P(3)], [MX, P(3)]);
  W('not037', [1238.8, R1], [MX, R1]);
  W('a027', [629.8, 622], [1047, 622], [1047, P(5)], [MX, P(5)]);
  W('iA5', [291, 878], [1077, 878], [1077, P(7)], [MX, P(7)]);
  W('iA4', [290, 962], [1141, 962], [1141, P(8)], [MX, P(8)]);
  /* out */
  W('aov.SVE', [MR, P(0)], [2065, P(0)]);
  W('aov.LTOP', [MR, P(5)], [2064, P(5)]);
  W('aov.LTCL', [MR, P(6)], [1813, P(6)], [1813, 668], [2063, 668]);
  W('aov.ABN', [MR, P(8)], [1770, P(8)], [1770, 838], [2070, 838]);
  t.push(
    [409, 155, 'AVEIRABLE'],
    [456, 275, '(TCA100)', 1],
    [399, 431, 'TEST'],
    [399, 516, 'TEST CANCEL'],
    [397, 634, 'RESET'],
    [1165, 156, 'TEST FB'],
    [298, 726, 'NO.2 LP HEATER LEVEL VERY HIGH'],
    [297, 843, 'NO.5 EXTRUCTION STEAM SECONDARY'],
    [297, 864, 'NON RETURN VALVE OPENED'],
    [297, 928, 'NO.5 EXTRUCTION STEAM SDECONDARY'],
    [297, 949, 'NON RETURN VALVE CLOSED'],
    [1806, 765, 'NO.5 EXTRUCTION STM SEC. NON RETURN'],
    [1806, 786, 'VALVE ENERGIZE COMMAND'],
    [2150, 806, 'nXV-TSn730_ABN', 1],
    /* the timer: its time and the T of its input */
    [857, 409, 'T', 1],
    [664, 518, 'T', 1],
    [678, 575, 'TP:10.0'],
    [237, 1522, 'CONTROLLER:'],
    [399, 1522, 'COMM+MD'],
    [622, 1497, 'TRIGGER  :'],
    [622, 1523, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA715',
    title: 'NO.5 EXTRUCTION STEAM NON RETURN VALVE(TC-45)',
    page: 175,
    ctl: 'COMM+MD',
    cycle: 100,
    f: F,
    k: [
      ['kInit', 289, 238, 'INITIAL', 'ref'],
      ['kOff', 289, 344, 'OFF(0)', 'sys.ref']
    ],
    c: [
      ['iA6', 'in', 'A6', 265, 739, '', ['TCA043']],
      ['iA5', 'in', 'A5', 264, 878, '', ['TCA043']],
      ['iA4', 'in', 'A4', 263, 962, '', ['TCA043']],
      ['oA1', 'out', 'A1', 2092, P(0), '', ['TCA835']],
      ['oA2', 'out', 'A2', 2091, P(5), '', ['-']],
      ['oA3', 'out', 'A3', 2090, 668, '', ['-']]
    ],
    d: [
      ['crtIys', 368, 164, 'in', 'nXV-TSn730_IYS', 'R', '#1C'],
      ['crtKta', 357, R2, 'in', 'nXV-TSn730_KTA', 'R', '#1C'],
      ['crtKtac', 357, 526.5, 'in', 'nXV-TSn730_KTAC', 'R', '#1C'],
      ['crtIkr', 355, 643.5, 'in', 'nXV-TSn730_IKR', 'R', '#1C'],
      ['crtIta', 1346, 166, 'out', 'nXV-TSn730_ITA', 'S', '#1C'],
      ['crtAbn', 2105, 838, 'out', '', 'S', '#1C']
    ],
    m: [
      [
        'aov',
        'AIR OPERAT VALVE',
        'nXV-TSn730',
        MX,
        TOP,
        MR - MX,
        H,
        ['FFP', 'SVE', '', 'SVD', '', 'RESET', '', 'LTOP', 'LTCL', ''],
        ['SVE', '', '', '', '', 'LTOP', 'LTCL', '', 'ABN', ''],
        'A021',
        [
          [1420, 743, '(LMA593)'],
          [1518, 766, 'TP:5.0s'],
          ...['R :20.0', 'M :1', 'HL:100.0', 'LL:0.0', 'K:99.0%', 'TP:5.0s', 'K:0.0%', 'TP:10.0', 'TP:20.0', 'K:1.0%'].map((s, i) => [
            1316,
            Math.round(766 + 21.2 * i),
            s
          ])
        ]
      ]
    ],
    b: [
      ['a023', 'A', '023', 601, R1 + 10.5],
      ['ffr024', 'FFR', '024', 910, R1 + 10.5, [], { l: ['S', 'R'] }, [80, 43]],
      ['or025', 'OR', '025', 1114.5, R1 + 10.5],
      ['a026', 'A', '026', 601, 515.5],
      ['a027', 'A', '027', 601, 632.5],
      ['or039', 'OR', '039', 804, 515.5],
      ['tp040', 'TP', '040', 708, 537],
      ['x1', 'X', '', 845, 590],
      ['not037', 'NOT', '037', 1210, R1 + 10.5],
      ['btr022', 'o:BTR', '022', 1074, 166],
      ['btr036', 'o:BTR', '036', 1263, P(0)],
      ['btr029', 'o:BTR', '029', 1272, R1],
      ['btr030', 'o:BTR', '030', 1272, P(3)],
      ['btr031', 'o:BTR', '031', 1272, P(5)],
      ['btr034', 'o:BTR', '034', 1272, P(7)],
      ['btr035', 'o:BTR', '035', 1270, P(8)],
      ['btr028', 'o:BTR', '028', 1805, P(0)],
      ['btr032', 'o:BTR', '032', 1750, P(5)],
      ['btr033', 'o:BTR', '033', 1750, P(6)],
      ['btr038', 'o:BTR', '038', 1832, 838]
    ],
    w,
    j: [
      [551, R1],
      [551, 505],
      [975, R1],
      [1007, R1],
      [1157, R1]
    ],
    t
  });
})();
