/* TCA690 COLD R/H STM NON-RETURN VLV (TC-19) (331DM09788 page 169, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the
   pixels of the page rendered 2296 wide. The air operated valve nXV-CRn901AF (AIR OPERAT VALVE A021, LMA593A), gate by gate as drawn:
   - FFP = OFF(0). A 023 = AVAIRABLE and the TEST push button, into S of FFR 024. A 026 = AVAIRABLE and TEST CANCEL, into OR 039;
     TP 040 (10.0 s, INITIAL on its top) of the FFR output taken inverted is the other input of OR 039, into R of FFR 024.
   - The FFR output = the TEST FB lamp, and OR 025 with the ventilator valve open signal (D1 of TCE360): NOT 037 of it to SVE, OR 025
     itself to SVD. A 027 = AVAIRABLE and the RESET push button, to RESET. The full open / full close positions (A6 / A5 of TCA048) to
     LTOP / LTCL.
   - SVE out (A1 to TCA834), LTOP out (A2), LTCL out (A3); ABN = the valve trouble lamp. A 011 = NOT 010 of LTCL and CV(A) / CV(B) full
     close (G of TCE125 / TCE127), through TP A012 (30.0 s, INITIAL on its top) to the TCA690_1 lamp.
   The words are the ones of the drawing (AVAIRABLE, OPERAT, RETRN as printed). The tag keeps the small n of the drawing (the unit number).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const F = [166, 82, 2220, 1542],
    u = (F[2] - F[0]) / 1000,
    MX = 1301,
    MR = 1707,
    TOP = 250,
    H = 382,
    P = i => TOP + 15 * u + ((i + 0.5) * (H - 30 * u)) / 10,
    R1 = P(1);
  /* the push buttons and AVAIRABLE into the gates */
  W('crtIir', [392, 157], [529, 157], [529, 497.5], [560.2, 497.5]);
  W('crtIir', [529, R1], [560.2, R1]);
  W('crtIir', [529, 402], [560.2, 402]);
  W('crtKta', [379, 350.4], [560.2, 350.4]);
  W('crtKtac', [389, 423.5], [560.2, 423.5]);
  W('crtKtr', [377.7, 519], [560.2, 519]);
  /* test: set / reset */
  W('a023', [617.8, R1], [879, R1]);
  W('a026', [617.8, 402], [784.2, 402]);
  W('or039', [841.8, 402], [869.5, 402], [869.5, 350.4], [879, 350.4]);
  W('tp040', [746.3, 423.5], [784.2, 423.5]);
  W('ffr024', [959, R1], [1073.2, R1]);
  W('ffr024', [994.5, R1], [994.5, 157], [1297, 157]);
  W('ffr024', [994.5, R1], [994.5, 487], [663.6, 487], [663.6, 423.5], [688.7, 423.5]);
  /* to the valve */
  W('kOff', [510, 252.3], [1027, 252.3], [1027, P(0)], [MX, P(0)]);
  W('iD1', [276, 606], [1046, 606], [1046, 350.4], [1073.2, 350.4]);
  W('or025', [1130.8, R1], [1178.2, R1]);
  W('or025', [1155.5, R1], [1155.5, P(3)], [MX, P(3)]);
  W('not037', [1235.8, R1], [MX, R1]);
  W('a027', [617.8, 497.5], [1237, 497.5], [1237, P(5)], [MX, P(5)]);
  W('iA6', [275, 745.5], [1068, 745.5], [1068, P(7)], [MX, P(7)]);
  W('iA5', [275, 830], [1132, 830], [1132, P(8)], [MX, P(8)]);
  /* INITIAL to the top of the two timers */
  W('kInit', [446.5, 924], [1383, 924], [1383, 986.5]);
  W('kInit', [640, 924], [640, 369.5], [717.5, 369.5], [717.5, 412.5]);
  /* out */
  W('aov.SVE', [MR, P(0)], [2053, P(0)]);
  W('aov.LTOP', [MR, P(5)], [2051, P(5)]);
  W('aov.LTCL', [MR, P(6)], [1800, P(6)], [1800, 862], [1032.7, 862], [1032.7, 997.5], [1088.2, 997.5]);
  W('aov.LTCL', [1800, 576.4], [2051, 576.4]);
  W('aov.ABN', [MR, P(8)], [1737, P(8)], [1737, 704.5], [2048.6, 704.5], [2048.6, 716], [2059, 716]);
  /* valve trouble: LTCL inverted and CV(A) / CV(B) full close */
  W('iGa', [273.5, 1062], [1181.8, 1062], [1181.8, 1019], [1224.5, 1019]);
  W('iGb', [273.5, 1137.7], [1202, 1137.7], [1202, 1040.5], [1224.5, 1040.5]);
  W('not010', [1145.8, 997.5], [1224.5, 997.5]);
  W('a011', [1284.5, 997.5], [1354.2, 997.5]);
  W('tp012', [1411.8, 997.5], [1971, 997.5]);
  t.push(
    [398, 148.6, 'AVAIRABLE'],
    [385, 339.5, 'TEST'],
    [395, 413.6, 'TEST CANCEL'],
    [384, 510, 'RESET'],
    [1152, 148, 'TEST FB'],
    [293, 594, 'VENTILATOR VALVE OPEN SIGNAL'],
    [282, 712.5, 'COLD REHEAT NON RETURN VALVE'],
    [282, 733.5, 'FULL OPEN POSITION'],
    [282, 797, 'COLD REHEAT NON RETURN VALVE'],
    [282, 818, 'FULL CLOSE POSITION'],
    [290.5, 1050, 'CV(A)FULL CLOSE(AUX)'],
    [290.5, 1125.7, 'CV(B)FULL CLOSE(AUX)'],
    [1857, 673.6, 'COLD R/H STM NON RETRN'],
    [1857, 695, 'VLV  TROUBLE'],
    [2074, 672, 'nXV-CRn901AF_ABN', 1],
    [1683, 969.5, 'COLD R/H STM NON RETRN'],
    [1683, 990.5, 'VLV  TROUBLE'],
    /* the timers: their time and the T of their input or top */
    [866, 317, 'T', 1],
    [674, 415, 'T', 1],
    [688, 474, 'TP:10.0s'],
    [1340, 989.5, 'T', 1],
    [1353, 1047, 'TP:30.0s'],
    [369, 962, '(TCA100)', 1],
    [232, 1517, 'CONTROLLER:'],
    [392, 1517, 'COMM+MD'],
    [616, 1491, 'TRIGGER  :'],
    [616, 1517, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA690',
    /* pr: printed on page 169 beside each block; the drawing above keeps them as text */
    pr: {
      tp040: ['TP:10.0s'],
      tp012: ['TP:30.0s']
    },
    title: 'COLD R/H STM NON-RETURN VLV(TC-19)',
    page: 169,
    ctl: 'COMM+MD',
    cycle: 100,
    f: F,
    k: [
      ['kOff', 277, 252.3, 'OFF(0)', 'sys.ref'],
      ['kInit', 213.5, 924, 'INITIAL', 'ref']
    ],
    c: [
      ['iD1', 'in', 'D1', 249, 606, '', ['TCE360'], 1],
      ['iA6', 'in', 'A6', 248, 745.5, '', ['TCA048']],
      ['iA5', 'in', 'A5', 248, 830, '', ['TCA048']],
      ['iGa', 'in', 'G', 246.5, 1062, '', ['TCE125'], 1],
      ['iGb', 'in', 'G', 246.5, 1137.7, '', ['TCE127'], 1],
      ['oA1', 'out', 'A1', 2080, P(0), '', ['TCA834']],
      ['oA2', 'out', 'A2', 2078, P(5), '', ['-']],
      ['oA3', 'out', 'A3', 2078, 576.4, '', ['-']]
    ],
    d: [
      ['crtIir', 357, 157, 'in', 'nXV-CRn901AF_IIR', 'R', '#1C'],
      ['crtKta', 344, 350.4, 'in', 'nXV-CRn901AF_KTA', 'R', '#1C'],
      ['crtKtac', 354, 423.5, 'in', 'nXV-CRn901AF_KTAC', 'R', '#1C'],
      ['crtKtr', 342.7, 519, 'in', 'nXV-CRn901AF_KTR', 'R', '#1C'],
      ['crtIta', 1332, 157, 'out', 'nXV-CRn901AF_ITA', 'S', '#1C'],
      ['crtAbn', 2094, 716, 'out', '', 'S', '#1C'],
      ['crtTca690', 2006, 997.5, 'out', 'TCA690_1', 'S', '#1C']
    ],
    m: [
      [
        'aov',
        'AIR OPERAT VALVE',
        'nXV-CRn901AF',
        MX,
        TOP,
        MR - MX,
        H,
        ['FFP', 'SVE', '', 'SVD', '', 'RESET', '', 'LTOP', 'LTCL', ''],
        ['SVE', '', '', '', '', 'LTOP', 'LTCL', '', 'ABN', ''],
        'A021',
        [
          [1404.5, 653.6, '(LMA593A)'],
          [1507.7, 675.5, 'TP:5.0s'],
          ...['R :20.0', 'M :1', 'HL:100.0', 'LL:0.0', 'K:99.0%', 'TP:5.0s', 'K:0.0%', 'TP:10.0', 'TP:20.0', 'K:1.0%'].map((s, i) => [
            1304.5,
            Math.round(675.5 + 21.2 * i),
            s
          ])
        ]
      ]
    ],
    b: [
      ['a023', 'A', '023', 589, R1 + 10.5],
      ['ffr024', 'FFR', '024', 919, R1 + 10.5, [], { l: ['S', 'R'] }, [80, 43]],
      ['or025', 'OR', '025', 1102, R1 + 10.5],
      ['a026', 'A', '026', 589, 412.5],
      ['a027', 'A', '027', 589, 508],
      ['or039', 'OR', '039', 813, 412.5],
      ['tp040', 'TP', '040', 717.5, 434],
      ['x1', 'X', '', 823.6, 487],
      ['not037', 'NOT', '037', 1207, R1 + 10.5],
      ['btr022', 'o:BTR', '022', 1061, 157],
      ['btr036', 'o:BTR', '036', 1249.5, P(0)],
      ['btr029', 'o:BTR', '029', 1260, R1],
      ['btr030', 'o:BTR', '030', 1259, P(3)],
      ['btr031', 'o:BTR', '031', 1258.6, P(5)],
      ['btr034', 'o:BTR', '034', 1258.6, P(7)],
      ['btr035', 'o:BTR', '035', 1258, P(8)],
      ['btr028', 'o:BTR', '028', 1792, P(0)],
      ['btr032', 'o:BTR', '032', 1738.6, P(5)],
      ['btr033', 'o:BTR', '033', 1737.7, P(6)],
      ['btr038', 'o:BTR', '038', 1768, 704.5],
      ['btr014', 'o:BTR', '014', 642, 1062],
      ['btr015', 'o:BTR', '015', 642, 1137.7],
      ['not010', 'NOT', '010', 1117, 1008],
      ['a011', 'A', '011', 1254.5, 1018.5, [], {}, [60, 64]],
      ['tp012', 'TP', 'A012', 1383, 1008]
    ],
    w,
    j: [
      [529, R1],
      [529, 402],
      [994.5, R1],
      [1155.5, R1],
      [640, 924],
      [1800, 576.4]
    ],
    t
  });
})();
