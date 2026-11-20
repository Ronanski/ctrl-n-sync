/* TCA738 LP EXHAUST HOOD WATER SPLAY VALVE (TC-35) (331DM09788 page 177, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. The air operated valve nFV-CDn904 (AIR OPERAT VALVE A021, LMA593), gate by gate
   as drawn:
   - FFP = ON(1). A 023 = AVEIRABLE and the AUTO push button, into S of FFR 024. A 026 = AVEIRABLE and MANUAL, into OR 039; A 040 =
     AVEIRABLE and OPEN is the other input of OR 039, into R of FFR 024. The FFR output = the AUTO lamp, NOT 036 of it = the MANUAL lamp.
   - A 037 = the FFR output, TP 041 (3.0 s, INITIAL on its top) of GLAND STEAM EXHAUSTERRUNNING (B1 of TCA680) and CPL 042 (22.5 MW) of
     GEN LOAD (A1 of TCE070). OR 048 of A 040 and A 037 goes to SVE, and through NOT 045, TP 049 (1.0 s, INITIAL on its top) and A 047
     with the FFR output to SVD. A 027 = AVEIRABLE and the RESET push button, to RESET. Valve opened / closed (A4 / A3 of TCA048) to
     LTOP / LTCL.
   - SVE out (A1 to TCA835), LTOP out (A2 to TCA826), LTCL out (A3 to TCA826); ABN = the valve abnormal lamp.
   The words are the ones of the drawing (AVEIRABLE, SPLAY, EXHAUSTERRUNNING, OPERAT as printed). The tag keeps the small n of the
   drawing (the unit number).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const F = [174, 84, 2228, 1545],
    u = (F[2] - F[0]) / 1000,
    MX = 1306,
    MR = 1712,
    TOP = 251,
    H = 383,
    P = i => TOP + 15 * u + ((i + 0.5) * (H - 30 * u)) / 10,
    R1 = P(1),
    R3 = P(3);
  /* the push buttons and AVEIRABLE into the gates */
  W('crtIys', [390, 160], [555, 160], [555, 596], [617.7, 596]);
  W('crtIys', [555, R1], [617.7, R1]);
  W('crtIys', [555, 415], [617.7, 415]);
  W('crtIys', [555, 500.5], [617.7, 500.5]);
  W('crtIka', [383, R1 + 21.5], [617.7, R1 + 21.5]);
  W('crtIkh', [383, 436.5], [617.7, 436.5]);
  W('crtIkr', [383, 522], [617.7, 522]);
  W('crtJyo', [382, 617.5], [617.7, 617.5]);
  /* auto / manual */
  W('a023', [675.3, R1], [832, R1]);
  W('a026', [675.3, 415], [736.2, 415]);
  W('a040', [675.3, 596], [709.4, 596], [709.4, 223.5], [833.2, 223.5]);
  W('a040', [709.4, 436.5], [736.2, 436.5]);
  W('or039', [793.8, 415], [822, 415], [822, R1 + 21.5], [832, R1 + 21.5]);
  W('ffr024', [912, R1], [970, R1]);
  W('ffr024', [937, R1], [937, 162], [1241, 162]);
  W('ffr024', [937, 212.5], [971, 212.5]);
  W('ffr024', [937, R1], [937, 478.8], [1212, 478.8], [1212, R3 + 21.5], [1226.2, R3 + 21.5]);
  W('not036', [1031, 212.5], [1241, 212.5]);
  /* open in auto: gland steam exhauster running and gen load */
  W('kInit', [533, 702], [1042, 702], [1042, 361.7], [1170, 361.7], [1170, R3 - 11]);
  W('kInit', [815, 702], [815, 797.5]);
  W('iB1', [362, 808], [785.6, 808]);
  W('tp041', [843.8, 808], [943.8, 808], [943.8, R1 + 21.5], [970, R1 + 21.5]);
  W('iA1', [361, 903], [785.6, 903]);
  W('cpl042', [843.8, 903], [953, 903], [953, R1 + 43], [970, R1 + 43]);
  W('a037', [1030, R1], [1042, R1], [1042, 276.7], [808.3, 276.7], [808.3, 245], [833.2, 245]);
  /* to the valve */
  W('kOn', [515, 256], [765, 256], [765, P(0)], [MX, P(0)]);
  W('or048', [890.8, 223.5], [916.3, 223.5], [916.3, 254.6], [1054.6, 254.6], [1054.6, R3], [1066.7, R3]);
  W('or048', [1054.6, R1], [MX, R1]);
  W('not045', [1124.3, R3], [1141.2, R3]);
  W('tp049', [1198.8, R3], [1226.2, R3]);
  W('a047', [1283.8, R3], [MX, R3]);
  W('a027', [675.3, 500.5], [1243, 500.5], [1243, P(5)], [MX, P(5)]);
  W('iA4', [361, 999], [1070, 999], [1070, P(7)], [MX, P(7)]);
  W('iA3', [361, 1083], [1133, 1083], [1133, P(8)], [MX, P(8)]);
  /* out */
  W('aov.SVE', [MR, P(0)], [2058, P(0)]);
  W('aov.LTOP', [MR, P(5)], [2057, P(5)]);
  W('aov.LTCL', [MR, P(6)], [1828, P(6)], [1828, 577], [2056, 577]);
  W('aov.ABN', [MR, P(8)], [1806, P(8)], [1806, 690], [2035, 690]);
  t.push(
    [394, 151, 'AVEIRABLE'],
    [389, 342, 'AUTO'],
    [389, 428, 'MANUAL'],
    [389, 513, 'RESET'],
    [388, 609, 'OPEN'],
    [1092, 151, 'AUTO'],
    [1090, 204, 'MANUAL'],
    [465, 729, '(TCA100)', 1],
    [367, 797, 'GLAND STEAM EXHAUSTERRUNNING'],
    [366, 893, 'GEN LOAD'],
    [366, 967, 'LP EXHAUST HOOD WATER'],
    [366, 988, 'SPLAY VALVE OPENED'],
    [366, 1052, 'LP EXHAUST HOOD WATER'],
    [366, 1073, 'SPLAY VALVE CLOSED'],
    [1822, 640, 'LP EXHAUST HOOD'],
    [1822, 661, 'WATER SPLAY VALVE'],
    [1822, 683, 'ABNORMAL'],
    [2145, 672, 'nFV-CDn904_ABN', 1],
    /* the timers: their time and the T of their input */
    [817, 320, 'T', 1],
    [1126, 385, 'T', 1],
    [771, 800, 'T', 1],
    [771, 893, 'T', 1],
    [1140, 443, 'TP:1.0s'],
    [786, 858, 'TP:3.0s'],
    [236, 1519, 'CONTROLLER:'],
    [396, 1519, 'COMM+MD'],
    [620, 1493, 'TRIGGER  :'],
    [620, 1519, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA738',
    title: 'LP EXHAUST HOOD WATER SPLAY VALVE(TC-35)',
    page: 177,
    ctl: 'COMM+MD',
    cycle: 100,
    f: F,
    k: [
      ['kOn', 282, 256, 'ON(1)', 'sys.ref'],
      ['kInit', 300, 702, 'INITIAL', 'ref']
    ],
    c: [
      ['iB1', 'in', 'B1', 335, 808, '', ['TCA680']],
      ['iA1', 'in', 'A1', 334, 903, '', ['TCE070'], 1],
      ['iA4', 'in', 'A4', 334, 999, '', ['TCA048']],
      ['iA3', 'in', 'A3', 334, 1083, '', ['TCA048']],
      ['oA1', 'out', 'A1', 2085, P(0), '', ['TCA835']],
      ['oA2', 'out', 'A2', 2084, P(5), '', ['TCA826']],
      ['oA3', 'out', 'A3', 2083, 577, '', ['TCA826']]
    ],
    d: [
      ['crtIys', 355, 160, 'in', 'nFV-CDn904_IYS', 'R', '#1C'],
      ['crtIka', 348, R1 + 21.5, 'in', 'nFV-CDn904_IKA', 'R', '#1C'],
      ['crtIkh', 348, 436.5, 'in', 'nFV-CDn904_IKH', 'R', '#1C'],
      ['crtIkr', 348, 522, 'in', 'nFV-CDn904_IKR', 'R', '#1C'],
      ['crtJyo', 347, 617.5, 'in', 'nFV-CDn904_JYO', 'R', '#1C'],
      ['crtIia', 1276, 162, 'out', 'nFV-CDn904_IIA', 'S', '#1C'],
      ['crtIih', 1276, 212.5, 'out', 'nFV-CDn904_IIH', 'S', '#1C'],
      ['crtAbn', 2070, 690, 'out', '', 'S', '#1C']
    ],
    m: [
      [
        'aov',
        'AIR OPERAT VALVE',
        'nFV-CDn904',
        MX,
        TOP,
        MR - MX,
        H,
        ['FFP', 'SVE', '', 'SVD', '', 'RESET', '', 'LTOP', 'LTCL', ''],
        ['SVE', '', '', '', '', 'LTOP', 'LTCL', '', 'ABN', ''],
        'A021',
        [
          [1414, 652, '(LMA593)'],
          [1513, 675, 'TP:5.0s'],
          ...['R :20.0', 'M :1', 'HL:100.0', 'LL:0.0', 'K:99.0%', 'TP:5.0s', 'K:0.0%', 'TP:10.0', 'TP:10.0', 'K:1.0%'].map((s, i) => [
            1310,
            Math.round(675 + 21.2 * i),
            s
          ])
        ]
      ]
    ],
    b: [
      ['a023', 'A', '023', 646.5, R1 + 10.5],
      ['a026', 'A', '026', 646.5, 425.5],
      ['a027', 'A', '027', 646.5, 511],
      ['a040', 'A', '040', 646.5, 606.5],
      ['or039', 'OR', '039', 765, 425.5],
      ['ffr024', 'FFR', '024', 872, R1 + 10.5, [], { l: ['S', 'R'] }, [80, 43]],
      ['or048', 'OR', '048', 862, 234],
      ['not036', 'NOT', '036', 1001, 223],
      ['a037', 'A', '037', 1000, R1 + 21, [], {}, [60, 64]],
      ['tp041', 'TP', '041', 814.7, 818.5],
      ['cpl042', 'CPL', '042', 814.7, 913.5, ['HL:22.5MW', 'LL:22.5MW']],
      ['not045', 'NOT', '045', 1095.5, R3 + 10.5],
      ['tp049', 'TP', '049', 1170, R3 + 10.5],
      ['a047', 'A', '047', 1255, R3 + 10.5],
      ['btr022', 'o:BTR', '022', 1002, 162],
      ['btr044', 'o:BTR', '044', 617, 256],
      ['btr043', 'o:BTR', '043', 603, 702],
      ['btr029', 'o:BTR', '029', 1270, R1],
      ['btr031', 'o:BTR', '031', 1268, P(5)],
      ['btr034', 'o:BTR', '034', 1266, P(7)],
      ['btr035', 'o:BTR', '035', 1266, P(8)],
      ['btr028', 'o:BTR', '028', 1800, P(0)],
      ['btr032', 'o:BTR', '032', 1745, P(5)],
      ['btr033', 'o:BTR', '033', 1745, P(6)],
      ['btr050', 'o:BTR', '050', 1743, P(8)]
    ],
    w,
    j: [
      [555, R1],
      [555, 415],
      [555, 500.5],
      [709.4, 436.5],
      [937, R1],
      [937, 212.5],
      [815, 702],
      [1054.6, R1]
    ],
    t
  });
})();
