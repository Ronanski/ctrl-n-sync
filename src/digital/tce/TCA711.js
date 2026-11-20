/* TCA711 NO.2 EXTRUCTION STEAM NON RETURN VALVE (TC-41) (331DM09788 page 171, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. The air operated valve nXV-TSn700 (AIR OPERAT VALVE A021, LMA593), gate by gate
   as drawn:
   - FFP = OFF(0). A 023 = AVEIRABLE and the TEST push button, into S of FFR 024. A 026 = AVEIRABLE and TEST CANCEL, into OR 039;
     TP 040 (10.0 s, INITIAL on its top) of the FFR output taken inverted is the other input of OR 039, into R of FFR 024.
   - The FFR output = the TEST FB lamp, and OR 025 with NO.1 HP HEATER LEVEL HIGH (A3 of TCA043): NOT 037 of it to SVE, OR 025 itself
     to SVD. A 027 = AVEIRABLE and the RESET push button, to RESET. Valve opened / closed (A2 / A1 of TCA043) to LTOP / LTCL.
   - SVE = the energize command (A1 to TCA834), LTOP out (A2), LTCL out (A3); ABN = the valve abnormal lamp.
   The words are the ones of the drawing (EXTRUCTION, AVEIRABLE, OPERAT as printed). The tag keeps the small n of the drawing (the unit
   number).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const F = [172, 82, 2230, 1543],
    u = (F[2] - F[0]) / 1000,
    MX = 1321,
    MR = 1724,
    TOP = 291,
    H = 383,
    P = i => TOP + 15 * u + ((i + 0.5) * (H - 30 * u)) / 10,
    R1 = P(1);
  /* the push buttons and AVEIRABLE into the gates */
  W('crtIys', [401, 158], [548, 158], [548, 563], [568.2, 563]);
  W('crtIys', [548, R1], [568.2, R1]);
  W('crtIys', [548, 457], [568.2, 457]);
  W('crtKta', [397.8, R1 + 21.5], [568.2, R1 + 21.5]);
  W('crtTsc', [399.4, 478.5], [568.2, 478.5]);
  W('crtIkr', [398.3, 584.5], [568.2, 584.5]);
  /* test: set / reset */
  W('a023', [625.8, R1], [877, R1]);
  W('a026', [625.8, 457], [780.2, 457]);
  W('or039', [837.8, 457], [856.7, 457], [856.7, R1 + 21.5], [877, R1 + 21.5]);
  W('tp040', [740.3, 478.5], [780.2, 478.5]);
  W('ffr024', [957, R1], [1090.7, R1]);
  W('ffr024', [1014, R1], [1014, 158], [1298, 158]);
  W('ffr024', [991, R1], [991, 541], [650, 541], [650, 478.5], [682.7, 478.5]);
  W('kInit', [464.4, 232.2], [711.5, 232.2], [711.5, 467.5]);
  /* to the valve */
  W('kOff', [452, 307], [1249, 307], [1249, P(0)], [MX, P(0)]);
  W('iA3', [301, 648], [1004, 648], [1004, R1 + 21.5], [1090.7, R1 + 21.5]);
  W('or025', [1148.3, R1], [1186.7, R1]);
  W('or025', [1172.8, R1], [1172.8, P(3)], [MX, P(3)]);
  W('not037', [1244.3, R1], [MX, R1]);
  W('a027', [625.8, 563], [1033, 563], [1033, P(5)], [MX, P(5)]);
  W('iA2', [301, 786], [1085, 786], [1085, P(7)], [MX, P(7)]);
  W('iA1', [301, 871], [1149, 871], [1149, P(8)], [MX, P(8)]);
  /* out */
  W('aov.SVE', [MR, P(0)], [2071.6, P(0)]);
  W('aov.LTOP', [MR, P(5)], [2070, P(5)]);
  W('aov.LTCL', [MR, P(6)], [1819.4, P(6)], [1819.4, 616.7], [2070, 616.7]);
  W('aov.ABN', [MR, P(8)], [1754.4, P(8)], [1754.4, 732], [2035, 732]);
  t.push(
    [407, 150, 'AVEIRABLE'],
    [404, 383, 'TEST'],
    [405.5, 469, 'TEST CANCEL'],
    [404.5, 576, 'RESET'],
    [1160, 150, 'TEST FB'],
    [307, 637, 'NO.1 HP HEATER LEVEL HIGH'],
    [306, 754, 'NO.2 EXTRUCTION'],
    [306, 775, 'NON RETURN VALVE OPENED'],
    [306, 839, 'NO.2 EXTRUCTION'],
    [306, 860, 'NON RETURN VALVE CLOSED'],
    [1849, 300, 'NO.2 EXTRUCTION NON RETURN'],
    [1849, 320, 'VALVE ENERGIZE COMMAND'],
    [1803, 671, 'NO.2 EXTRUCTION NON RETURN'],
    [1803, 693, 'VALVE ABNORMAL'],
    [2140, 700, 'nXV-TSn700_ABN', 1],
    /* the timer: its time and the T of its input */
    [862.8, 361, 'T', 1],
    [669, 471, 'T', 1],
    [684, 528, 'TP:10.0s'],
    [239, 1518, 'CONTROLLER:'],
    [397, 1518, 'COMM+MD'],
    [622, 1492, 'TRIGGER  :'],
    [622, 1518, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA711',
    title: 'NO.2 EXTRUCTION STEAM NON RETURN VALVE(TC-41)',
    page: 171,
    ctl: 'COMM+MD',
    cycle: 100,
    f: F,
    k: [
      ['kInit', 231.4, 232.2, 'INITIAL', 'ref'],
      ['kOff', 219, 307, 'OFF(0)', 'sys.ref']
    ],
    c: [
      ['iA3', 'in', 'A3', 274, 648, '', ['TCA043']],
      ['iA2', 'in', 'A2', 274, 786, '', ['TCA043']],
      ['iA1', 'in', 'A1', 274, 871, '', ['TCA043']],
      ['oA1', 'out', 'A1', 2098.6, P(0), '', ['TCA834']],
      ['oA2', 'out', 'A2', 2097, P(5), '', ['-']],
      ['oA3', 'out', 'A3', 2097, 616.7, '', ['-']]
    ],
    d: [
      ['crtIys', 366, 158, 'in', 'nXV-TSn700_IYS', 'R', '#1C'],
      ['crtKta', 362.8, R1 + 21.5, 'in', 'nXV-TSn700_KTA', 'R', '#1C'],
      ['crtTsc', 364.4, 478.5, 'in', 'nXV-TSn700_TSC', 'R', '#1C'],
      ['crtIkr', 363.3, 584.5, 'in', 'nXV-TSn700_IKR', 'R', '#1C'],
      ['crtIta', 1333, 158, 'out', 'nXV-TSn700_ITA', 'S', '#1C'],
      ['crtAbn', 2070, 732, 'out', '', 'S', '#1C']
    ],
    m: [
      [
        'aov',
        'AIR OPERAT VALVE',
        'nXV-TSn700',
        MX,
        TOP,
        MR - MX,
        H,
        ['FFP', 'SVE', '', 'SVD', '', 'RESET', '', 'LTOP', 'LTCL', ''],
        ['SVE', '', '', '', '', 'LTOP', 'LTCL', '', 'ABN', ''],
        'A021',
        [
          [1427, 693, '(LMA593)'],
          [1527, 716, 'TP:5.0s'],
          ...['R :20.0', 'M :1', 'HL:100.0', 'LL:0.0', 'K:99.0%', 'TP:5.0s', 'K:0.0%', 'TP:10.0', 'TP:20.0', 'K:1.0%'].map((s, i) => [
            1325,
            Math.round(716 + 21.2 * i),
            s
          ])
        ]
      ]
    ],
    b: [
      ['a023', 'A', '023', 597, R1 + 10.5],
      ['ffr024', 'FFR', '024', 917, R1 + 10.5, [], { l: ['S', 'R'] }, [80, 43]],
      ['or025', 'OR', '025', 1119.5, R1 + 10.5],
      ['a026', 'A', '026', 597, 467.5],
      ['a027', 'A', '027', 597, 573.5],
      ['or039', 'OR', '039', 809, 467.5],
      ['tp040', 'TP', '040', 711.5, 489],
      ['x1', 'X', '', 808.3, 541],
      ['not037', 'NOT', '037', 1215.5, R1 + 10.5],
      ['btr022', 'o:BTR', '022', 1067.8, 158],
      ['btr036', 'o:BTR', '036', 1269.4, P(0)],
      ['btr029', 'o:BTR', '029', 1279.4, R1],
      ['btr030', 'o:BTR', '030', 1279.4, P(3)],
      ['btr031', 'o:BTR', '031', 1279, P(5)],
      ['btr034', 'o:BTR', '034', 1278, P(7)],
      ['btr035', 'o:BTR', '035', 1278, P(8)],
      ['btr028', 'o:BTR', '028', 1811, P(0)],
      ['btr032', 'o:BTR', '032', 1757, P(5)],
      ['btr033', 'o:BTR', '033', 1755.6, P(6)],
      ['btr038', 'o:BTR', '038', 1797, 732]
    ],
    w,
    j: [
      [548, R1],
      [548, 457],
      [991, R1],
      [1014, R1],
      [1172.8, R1]
    ],
    t
  });
})();
