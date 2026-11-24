/* TCA713 NO.4 EXTRUCTION STEAM NON RETURN VALVE (TC-41) (331DM09788 page 173, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. The air operated valve nXV-TSn720 (AIR OPERAT VALVE A021, LMA593), gate by gate
   as drawn:
   - FFP = OFF(0). A 023 = AVEIRABLE and the TEST push button, into S of FFR 024. A 026 = AVEIRABLE and TEST CANCEL, into OR 039;
     TP 040 (10.0, INITIAL on its top) of the FFR output taken inverted is the other input of OR 039, into R of FFR 024.
   - The FFR output = the TEST FB lamp, and OR 025 with NO.3 LP HEATER LEVEL VERY HIGH (A7 of TCA041): NOT 037 of it to SVE, OR 025
     itself to SVD. A 027 = AVEIRABLE and the RESET push button, to RESET. Valve opened / closed (A6 / A5 of TCA041) to LTOP / LTCL.
   - SVE out (A1 to TCA835), LTOP out (A2), LTCL out (A3); ABN = the valve abnormal lamp.
   The words are the ones of the drawing (EXTRUCTION, AVEIRABLE, SDECONDARY, OPERAT as printed). The tag keeps the small n of the
   drawing (the unit number).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const F = [172, 90, 2232, 1550],
    u = (F[2] - F[0]) / 1000,
    MX = 1313,
    MR = 1717,
    TOP = 329,
    H = 383,
    P = i => TOP + 15 * u + ((i + 0.5) * (H - 30 * u)) / 10,
    R1 = P(1),
    R2 = R1 + 21.5;
  /* the push buttons and AVEIRABLE into the gates */
  W('crtIys', [400, 163], [540, 163], [540, 600], [558.7, 600]);
  W('crtIys', [540, R1], [558.7, R1]);
  W('crtIys', [540, 493], [558.7, 493]);
  W('crtKta', [392, R2], [558.7, R2]);
  W('crtKtac', [392, 514.5], [558.7, 514.5]);
  W('crtKtr', [392, 621.5], [558.7, 621.5]);
  /* test: set / reset */
  W('a023', [616.3, R1], [866.5, R1]);
  W('a026', [616.3, 493], [781.7, 493]);
  W('or039', [839.3, 493], [856, 493], [856, R2], [866.5, R2]);
  W('tp040', [743.8, 514.5], [781.7, 514.5]);
  W('ffr024', [946.5, R1], [1081.2, R1]);
  W('ffr024', [1004, R1], [1004, 163], [1312, 163]);
  W('ffr024', [981, R1], [981, 578], [651, 578], [651, 514.5], [686.2, 514.5]);
  W('kInit', [498, 249], [715, 249], [715, 503.5]);
  /* to the valve */
  W('kOff', [498, 345], [1240, 345], [1240, P(0)], [MX, P(0)]);
  W('iA7', [290, 706], [1068, 706], [1068, R2], [1081.2, R2]);
  W('or025', [1138.8, R1], [1177.2, R1]);
  W('or025', [1153, R1], [1153, P(3)], [MX, P(3)]);
  W('not037', [1234.8, R1], [MX, R1]);
  W('a027', [616.3, 600], [1193, 600], [1193, P(5)], [MX, P(5)]);
  W('iA6', [290, 845], [1212, 845], [1212, P(7)], [MX, P(7)]);
  W('iA5', [290, 930], [1243, 930], [1243, P(8)], [MX, P(8)]);
  /* out */
  W('aov.SVE', [MR, P(0)], [2063, P(0)]);
  W('aov.LTOP', [MR, P(5)], [2061, P(5)]);
  W('aov.LTCL', [MR, P(6)], [1810, P(6)], [1810, 657], [2060, 657]);
  W('aov.ABN', [MR, P(8)], [1745, P(8)], [1745, 772], [2047, 772]);
  t.push(
    [406, 154, 'AVEIRABLE'],
    [431, 285, '(TCA100)', 1],
    [398, 419, 'TEST'],
    [398, 505, 'TEST CANCEL'],
    [398, 611, 'RESET'],
    [1162, 156, 'TEST FB'],
    [297, 694, 'NO.3 LP HEATER LEVEL VERY HIGH'],
    [295, 810, 'NO.4 EXTRUCTION STEAM SECONDARY'],
    [295, 831, 'NON RETURN VALVE OPENED'],
    [295, 895, 'NO.4 EXTRUCTION STEAM SDECONDARY'],
    [295, 916, 'NON RETURN VALVE CLOSED'],
    [1803, 713, 'NO.4 EXTRUCTION NON RETURN'],
    [1803, 734, 'VALVE ABNORMAL'],
    [2150, 742, 'nXV-TSn720_ABN', 1],
    /* the timer: its time and the T of its input */
    [853, 398, 'T', 1],
    [672, 507, 'T', 1],
    [685, 564, 'TP:10.0'],
    [233, 1521, 'CONTROLLER:'],
    [393, 1521, 'COMM+MD'],
    [619, 1496, 'TRIGGER  :'],
    [619, 1522, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA713',
    /* pr: printed on page 173 beside each block; the drawing above keeps them as text */
    pr: {
      tp040: ['TP:10.0']
    },
    title: 'NO.4 EXTRUCTION STEAM NON RETURN VALVE(TC-41)',
    page: 173,
    ctl: 'COMM+MD',
    cycle: 100,
    f: F,
    k: [
      ['kInit', 265, 249, 'INITIAL', 'ref'],
      ['kOff', 265, 345, 'OFF(0)', 'sys.ref']
    ],
    c: [
      ['iA7', 'in', 'A7', 263, 706, '', ['TCA041']],
      ['iA6', 'in', 'A6', 263, 845, '', ['TCA041']],
      ['iA5', 'in', 'A5', 263, 930, '', ['TCA041']],
      ['oA1', 'out', 'A1', 2090, P(0), '', ['TCA835']],
      ['oA2', 'out', 'A2', 2088, P(5), '', ['-']],
      ['oA3', 'out', 'A3', 2087, 657, '', ['-']]
    ],
    d: [
      ['crtIys', 365, 163, 'in', 'nXV-TSn720_IYS', 'R', '#1C'],
      ['crtKta', 357, R2, 'in', 'nXV-TSn720_KTA', 'R', '#1C'],
      ['crtKtac', 357, 514.5, 'in', 'nXV-TSn720_KTAC', 'R', '#1C'],
      ['crtKtr', 357, 621.5, 'in', 'nXV-TSn720_KTR', 'R', '#1C'],
      ['crtIta', 1347, 163, 'out', 'nXV-TSn720_ITA', 'S', '#1C'],
      ['crtAbn', 2082, 772, 'out', '', 'S', '#1C']
    ],
    m: [
      [
        'aov',
        'AIR OPERAT VALVE',
        'nXV-TSn720',
        MX,
        TOP,
        MR - MX,
        H,
        ['FFP', 'SVE', '', 'SVD', '', 'RESET', '', 'LTOP', 'LTCL', ''],
        ['SVE', '', '', '', '', 'LTOP', 'LTCL', '', 'ABN', ''],
        'A021',
        [
          [1417, 733, '(LMA593)'],
          [1515, 757, 'TP:5.0s'],
          ...['R :20.0', 'M :1', 'HL:100.0', 'LL:0.0', 'K:99.0%', 'TP:5.0s', 'K:0.0%', 'TP:10.0', 'TP:20.0', 'K:1.0%'].map((s, i) => [
            1314,
            Math.round(757 + 21.2 * i),
            s
          ])
        ]
      ]
    ],
    b: [
      ['a023', 'A', '023', 587.5, R1 + 10.5],
      ['ffr024', 'FFR', '024', 906.5, R1 + 10.5, [], { l: ['S', 'R'] }, [80, 43]],
      ['or025', 'OR', '025', 1110, R1 + 10.5],
      ['a026', 'A', '026', 587.5, 503.5],
      ['a027', 'A', '027', 587.5, 610.5],
      ['or039', 'OR', '039', 810.5, 503.5],
      ['tp040', 'TP', '040', 715, 525],
      ['x1', 'X', '', 852, 578],
      ['not037', 'NOT', '037', 1206, R1 + 10.5],
      ['btr022', 'o:BTR', '022', 1071, 163],
      ['btr036', 'o:BTR', '036', 1268, P(0)],
      ['btr029', 'o:BTR', '029', 1270, R1],
      ['btr030', 'o:BTR', '030', 1271, P(3)],
      ['btr031', 'o:BTR', '031', 1270, P(5)],
      ['btr034', 'o:BTR', '034', 1270, P(7)],
      ['btr035', 'o:BTR', '035', 1268, P(8)],
      ['btr028', 'o:BTR', '028', 1804, P(0)],
      ['btr032', 'o:BTR', '032', 1748, P(5)],
      ['btr033', 'o:BTR', '033', 1748, P(6)],
      ['btr038', 'o:BTR', '038', 1808, 772]
    ],
    w,
    j: [
      [540, R1],
      [540, 493],
      [981, R1],
      [1004, R1],
      [1153, R1]
    ],
    t
  });
})();
