/* TCA714 NO.3 EXTRUCTION STEAM SECONDARY NON RETURN VALVE (TC-43) (331DM09788 page 174, controller COMM+MD, cycle 100 ms). Typed from
   the drawing; units = the pixels of the page rendered 2296 wide. The air operated valve nXV-TSn740 (AIR OPERAT VALVE A021, LMA593),
   gate by gate as drawn:
   - FFP = OFF(0). A 023 = AVEIRABLE and the TEST push button, into S of FFR 024. A 026 = AVEIRABLE and TEST CANCEL, into OR 039;
     TP 040 (10.0, INITIAL on its top) of the FFR output taken inverted is the other input of OR 039, into R of FFR 024.
   - The FFR output = the TEST FB lamp, and OR 025 with DEAERATOR STRAGE TANK LEVEL VERY HIGH (A3 of TCA045): NOT 037 of it to SVE,
     OR 025 itself to SVD. A 027 = AVEIRABLE and the RESET push button, to RESET. Valve opened / closed (A2 / A1 of TCA047) to LTOP /
     LTCL.
   - SVE out (A1 to TCA834), LTOP out (A2), LTCL out (A3); ABN = the valve trouble lamp.
   The words are the ones of the drawing (EXTRUCTION, AVEIRABLE, STRAGE, SDECONDARY, OPERAT as printed). The tag keeps the small n of
   the drawing (the unit number).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const F = [170, 84, 2226, 1546],
    u = (F[2] - F[0]) / 1000,
    MX = 1319,
    MR = 1722,
    TOP = 346,
    H = 383,
    P = i => TOP + 15 * u + ((i + 0.5) * (H - 30 * u)) / 10,
    R1 = P(1),
    R2 = R1 + 21.5;
  /* the push buttons and AVEIRABLE into the gates */
  W('crtIys', [395, 162], [542, 162], [542, 618], [574.7, 618]);
  W('crtIys', [542, R1], [574.7, R1]);
  W('crtIys', [542, 511], [574.7, 511]);
  W('crtKta', [394, R2], [574.7, R2]);
  W('crtKtac', [395, 532.5], [574.7, 532.5]);
  W('crtIkr', [392, 639.5], [574.7, 639.5]);
  /* test: set / reset */
  W('a023', [632.3, R1], [873, R1]);
  W('a026', [632.3, 511], [768.2, 511]);
  W('or039', [825.8, 511], [861, 511], [861, R2], [873, R2]);
  W('tp040', [739.8, 532.5], [768.2, 532.5]);
  W('ffr024', [953, R1], [1088.2, R1]);
  W('ffr024', [1010, R1], [1010, 162], [1306, 162]);
  W('ffr024', [977, R1], [977, 597], [657, 597], [657, 532.5], [682.2, 532.5]);
  W('kInit', [525, 256], [712, 256], [712, 521.5]);
  /* to the valve */
  W('kOff', [525, 352], [1043, 352], [1043, P(0)], [MX, P(0)]);
  W('iA3', [287, 756], [1020, 756], [1020, R2], [1088.2, R2]);
  W('or025', [1145.8, R1], [1183.7, R1]);
  W('or025', [1159, R1], [1159, P(3)], [MX, P(3)]);
  W('not037', [1241.3, R1], [MX, R1]);
  W('a027', [632.3, 618], [1062, 618], [1062, P(5)], [MX, P(5)]);
  W('iA2', [287, 894], [1102, 894], [1102, P(7)], [MX, P(7)]);
  W('iA1', [287, 978], [1133, 978], [1133, P(8)], [MX, P(8)]);
  /* out */
  W('aov.SVE', [MR, P(0)], [2067, P(0)]);
  W('aov.LTOP', [MR, P(5)], [2066, P(5)]);
  W('aov.LTCL', [MR, P(6)], [1815, P(6)], [1815, 673], [2065, 673]);
  W('aov.ABN', [MR, P(8)], [1762, P(8)], [1762, 788], [2059, 788]);
  t.push(
    [401, 153, 'AVEIRABLE'],
    [457, 294, '(TCA100)', 1],
    [397, 439, 'TEST'],
    [397, 524, 'TEST CANCEL'],
    [397, 631, 'RESET'],
    [1156, 151, 'TEST FB'],
    [293, 745, 'DEAERATOR STRAGE TANK LEVEL VERY HIGH'],
    [293, 861, 'NO.3 EXTRUCTION STEAM SECONDARY'],
    [293, 883, 'NON RETURN VALVE OPENED'],
    [293, 946, 'NO.3 EXTRUCTION STEAM SDECONDARY'],
    [293, 968, 'NON RETURN VALVE CLOSED'],
    [1799, 716, 'NO.3 EXTRUCTION STM SEC.NON RETURN'],
    [1799, 737, 'VALVE TROUBLE'],
    [2160, 760, 'nXV-TSn740_ABN', 1],
    /* the timer: its time and the T of its input */
    [858, 415, 'T', 1],
    [667, 524, 'T', 1],
    [681, 582, 'TP:10.0'],
    [234, 1520, 'CONTROLLER:'],
    [396, 1520, 'COMM+MD'],
    [620, 1494, 'TRIGGER  :'],
    [620, 1520, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA714',
    /* pr: printed on page 174 beside each block; the drawing above keeps them as text */
    pr: {
      tp040: ['TP:10.0']
    },
    title: 'NO.3 EXTRUCTION STEAM SECONDARY NON RETURN VALVE(TC-43)',
    page: 174,
    ctl: 'COMM+MD',
    cycle: 100,
    f: F,
    k: [
      ['kInit', 292, 256, 'INITIAL', 'ref'],
      ['kOff', 292, 352, 'OFF(0)', 'sys.ref']
    ],
    c: [
      ['iA3', 'in', 'A3', 260, 756, '', ['TCA045']],
      ['iA2', 'in', 'A2', 260, 894, '', ['TCA047']],
      ['iA1', 'in', 'A1', 260, 978, '', ['TCA047']],
      ['oA1', 'out', 'A1', 2094, P(0), '', ['TCA834']],
      ['oA2', 'out', 'A2', 2093, P(5), '', ['-']],
      ['oA3', 'out', 'A3', 2092, 673, '', ['-']]
    ],
    d: [
      ['crtIys', 360, 162, 'in', 'nXV-TSn740_IYS', 'R', '#1C'],
      ['crtKta', 359, R2, 'in', 'nXV-TSn740_KTA', 'R', '#1C'],
      ['crtKtac', 360, 532.5, 'in', 'nXV-TSn740_KTAC', 'R', '#1C'],
      ['crtIkr', 357, 639.5, 'in', 'nXV-TSn740_IKR', 'R', '#1C'],
      ['crtIta', 1341, 162, 'out', 'nXV-TSn740_ITA', 'S', '#1C'],
      ['crtAbn', 2094, 788, 'out', '', 'S', '#1C']
    ],
    m: [
      [
        'aov',
        'AIR OPERAT VALVE',
        'nXV-TSn740',
        MX,
        TOP,
        MR - MX,
        H,
        ['FFP', 'SVE', '', 'SVD', '', 'RESET', '', 'LTOP', 'LTCL', ''],
        ['SVE', '', '', '', '', 'LTOP', 'LTCL', '', 'ABN', ''],
        'A021',
        [
          [1423, 748, '(LMA593)'],
          [1522, 771, 'TP:5.0s'],
          ...['R :20.0', 'M :1', 'HL:100.0', 'LL:0.0', 'K:99.0%', 'TP:5.0s', 'K:0.0%', 'TP:10.0', 'TP:20.0', 'K:1.0%'].map((s, i) => [
            1321,
            Math.round(771 + 21.2 * i),
            s
          ])
        ]
      ]
    ],
    b: [
      ['a023', 'A', '023', 603.5, R1 + 10.5],
      ['ffr024', 'FFR', '024', 913, R1 + 10.5, [], { l: ['S', 'R'] }, [80, 43]],
      ['or025', 'OR', '025', 1117, R1 + 10.5],
      ['a026', 'A', '026', 603.5, 521.5],
      ['a027', 'A', '027', 603.5, 628.5],
      ['or039', 'OR', '039', 797, 521.5],
      ['tp040', 'TP', '040', 711, 543],
      ['x1', 'X', '', 805, 597],
      ['not037', 'NOT', '037', 1212.5, R1 + 10.5],
      ['btr022', 'o:BTR', '022', 1066, 162],
      ['btr036', 'o:BTR', '036', 1274, P(0)],
      ['btr029', 'o:BTR', '029', 1275, R1],
      ['btr030', 'o:BTR', '030', 1275, P(3)],
      ['btr031', 'o:BTR', '031', 1275, P(5)],
      ['btr034', 'o:BTR', '034', 1275, P(7)],
      ['btr035', 'o:BTR', '035', 1273, P(8)],
      ['btr028', 'o:BTR', '028', 1807, P(0)],
      ['btr032', 'o:BTR', '032', 1752, P(5)],
      ['btr033', 'o:BTR', '033', 1752, P(6)],
      ['btr038', 'o:BTR', '038', 1822, 788]
    ],
    w,
    j: [
      [542, R1],
      [542, 511],
      [977, R1],
      [1010, R1],
      [1159, R1]
    ],
    t
  });
})();
