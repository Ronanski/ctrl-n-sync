/* TCA712 NO.3 EXTRUCTION STEAM PRIMARY NON RETURN VALVE (TC-42) (331DM09788 page 172, controller COMM+MD, cycle 100 ms). Typed from the
   drawing; units = the pixels of the page rendered 2296 wide. The air operated valve nXV-TSn710 (AIR OPERAT VALVE A021, LMA593), gate
   by gate as drawn:
   - FFP = OFF(0). A 023 = AVEIRABLE and the TEST push button, into S of FFR 024. A 026 = AVEIRABLE and TEST CANCEL, into OR 039;
     TP 040 (10.0, INITIAL on its top) of the FFR output taken inverted is the other input of OR 039, into R of FFR 024.
   - The FFR output = the TEST FB lamp, and OR 025 with DEAERATOR STRAGE TANK LEVEL VERY HIGH (A3 of TCA045): NOT 037 of it to SVE,
     OR 025 itself to SVD. A 027 = AVEIRABLE and the RESET push button, to RESET. Valve opened / closed (A2 / A1 of TCA045) to LTOP /
     LTCL.
   - SVE out (A1 to TCA835), LTOP out (A2), LTCL out (A3); ABN = the valve abnormal lamp.
   The words are the ones of the drawing (EXTRUCTION, AVEIRABLE, STRAGE, OPERAT as printed). The tag keeps the small n of the drawing (the
   unit number).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const F = [168, 86, 2228, 1546],
    u = (F[2] - F[0]) / 1000,
    MX = 1310,
    MR = 1712,
    TOP = 253,
    H = 384,
    P = i => TOP + 15 * u + ((i + 0.5) * (H - 30 * u)) / 10,
    R1 = P(1),
    R2 = R1 + 21.5;
  /* the push buttons and AVEIRABLE into the gates */
  W('crtIys', [376.7, 129.4], [536.7, 129.4], [536.7, 502.5], [567.6, 502.5]);
  W('crtIys', [536.7, R1], [567.6, R1]);
  W('crtIys', [536.7, 417], [567.6, 417]);
  W('crtKta', [387, R2], [567.6, R2]);
  W('crtKtac', [388.3, 438.5], [567.6, 438.5]);
  W('crtIkr', [385.6, 524], [567.6, 524]);
  /* test: set / reset */
  W('a023', [625.2, R1], [865.8, R1]);
  W('a026', [625.2, 417], [768.4, 417]);
  W('or039', [826, 417], [853.9, 417], [853.9, R2], [865.8, R2]);
  W('tp040', [729.8, 438.5], [768.4, 438.5]);
  W('ffr024', [945.8, R1], [1078.7, R1]);
  W('ffr024', [1002.2, R1], [1002.2, 162.2], [1307, 162.2]);
  W('ffr024', [980, R1], [980, 492.2], [649, 492.2], [649, 438.5], [672.2, 438.5]);
  W('kInit', [485, 203.9], [701, 203.9], [701, 427.5]);
  /* to the valve */
  W('kOff', [472.8, 278.3], [1233.3, 278.3], [1233.3, P(0)], [MX, P(0)]);
  W('iA3', [311, 608], [1000, 608], [1000, R2], [1078.7, R2]);
  W('or025', [1136.3, R1], [1175.1, R1]);
  W('or025', [1150, R1], [1150, P(3)], [MX, P(3)]);
  W('not037', [1232.7, R1], [MX, R1]);
  W('a027', [625.2, 502.5], [1244.4, 502.5], [1244.4, P(5)], [MX, P(5)]);
  W('iA2', [289, 746], [1074.4, 746], [1074.4, P(7)], [MX, P(7)]);
  W('iA1', [289, 831], [1137.2, 831], [1137.2, P(8)], [MX, P(8)]);
  /* out */
  W('aov.SVE', [MR, P(0)], [2059, P(0)]);
  W('aov.LTOP', [MR, P(5)], [2058, P(5)]);
  W('aov.LTCL', [MR, P(6)], [1807.8, P(6)], [1807.8, 578.9], [2058, 578.9]);
  W('aov.ABN', [MR, P(8)], [1742.8, P(8)], [1742.8, 684.4], [2055, 684.4]);
  t.push(
    [383, 120.6, 'AVEIRABLE'],
    [416, 231, '(TCA100)', 1],
    [393, 344.4, 'TEST'],
    [394, 430, 'TEST CANCEL'],
    [392, 515, 'RESET'],
    [1158, 153, 'TEST FB'],
    [317, 576, 'DEAERATOR STRAGE TANK'],
    [317, 597, 'LEVEL VERY HIGH'],
    [294, 714, 'NO.3 EXTRUCTION STEAM PRIMARY'],
    [294, 735, 'NON RETURN VALVE OPENED'],
    [294, 799, 'NO.3 EXTRUCTION STEAM PRIMARY'],
    [294, 820, 'NON RETURN VALVE CLOSED'],
    [1791, 623.3, 'NO.3 EXTRUCTION NON RETURN'],
    [1791, 644, 'VALVE ABNORMAL'],
    [2140, 652, 'nXV-TSn710_ABN', 1],
    /* the timer: its time and the T of its input */
    [851, 321.7, 'T', 1],
    [659, 431, 'T', 1],
    [673, 489, 'TP:10.0'],
    [237, 1521, 'CONTROLLER:'],
    [395, 1521, 'COMM+MD'],
    [621, 1495, 'TRIGGER  :'],
    [621, 1521, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA712',
    /* pr: printed on page 172 beside each block; the drawing above keeps them as text */
    pr: {
      tp040: ['TP:10.0']
    },
    title: 'NO.3 EXTRUCTION STEAM PRIMARY NON RETURN VALVE(TC-42)',
    page: 172,
    ctl: 'COMM+MD',
    cycle: 100,
    f: F,
    k: [
      ['kInit', 252, 203.9, 'INITIAL', 'ref'],
      ['kOff', 239.8, 278.3, 'OFF(0)', 'sys.ref']
    ],
    c: [
      ['iA3', 'in', 'A3', 284, 608, '', ['TCA045']],
      ['iA2', 'in', 'A2', 262, 746, '', ['TCA045']],
      ['iA1', 'in', 'A1', 262, 831, '', ['TCA045']],
      ['oA1', 'out', 'A1', 2086, P(0), '', ['TCA835']],
      ['oA2', 'out', 'A2', 2085, P(5), '', ['-']],
      ['oA3', 'out', 'A3', 2085, 578.9, '', ['-']]
    ],
    d: [
      ['crtIys', 341.7, 129.4, 'in', 'nXV-TSn710_IYS', 'R', '#1C'],
      ['crtKta', 352, R2, 'in', 'nXV-TSn710_KTA', 'R', '#1C'],
      ['crtKtac', 353.3, 438.5, 'in', 'nXV-TSn710_KTAC', 'R', '#1C'],
      ['crtIkr', 350.6, 524, 'in', 'nXV-TSn710_IKR', 'R', '#1C'],
      ['crtIta', 1342, 162.2, 'out', 'nXV-TSn710_ITA', 'S', '#1C'],
      ['crtAbn', 2090, 684.4, 'out', '', 'S', '#1C']
    ],
    m: [
      [
        'aov',
        'AIR OPERAT VALVE',
        'nXV-TSn710',
        MX,
        TOP,
        MR - MX,
        H,
        ['FFP', 'SVE', '', 'SVD', '', 'RESET', '', 'LTOP', 'LTCL', ''],
        ['SVE', '', '', '', '', 'LTOP', 'LTCL', '', 'ABN', ''],
        'A021',
        [
          [1415, 655, '(LMA593)'],
          [1514, 678, 'TP:5.0s'],
          ...['R :20.0', 'M :1', 'HL:100.0', 'LL:0.0', 'K:99.0%', 'TP:5.0s', 'K:0.0%', 'TP:10.0', 'TP:20.0', 'K:1.0%'].map((s, i) => [
            1313,
            Math.round(678 + 21.2 * i),
            s
          ])
        ]
      ]
    ],
    b: [
      ['a023', 'A', '023', 596.4, R1 + 10.5],
      ['ffr024', 'FFR', '024', 905.8, R1 + 10.5, [], { l: ['S', 'R'] }, [80, 43]],
      ['or025', 'OR', '025', 1107.5, R1 + 10.5],
      ['a026', 'A', '026', 596.4, 427.5],
      ['a027', 'A', '027', 596.4, 513],
      ['or039', 'OR', '039', 797.2, 427.5],
      ['tp040', 'TP', '040', 701, 449],
      ['x1', 'X', '', 807.2, 492.2],
      ['not037', 'NOT', '037', 1203.9, R1 + 10.5],
      ['btr022', 'o:BTR', '022', 1067, 162.2],
      ['btr036', 'o:BTR', '036', 1256.7, P(0)],
      ['btr029', 'o:BTR', '029', 1267.8, R1],
      ['btr030', 'o:BTR', '030', 1267.8, P(3)],
      ['btr031', 'o:BTR', '031', 1267, P(5)],
      ['btr034', 'o:BTR', '034', 1266, P(7)],
      ['btr035', 'o:BTR', '035', 1266, P(8)],
      ['btr028', 'o:BTR', '028', 1798.9, P(0)],
      ['btr032', 'o:BTR', '032', 1745, P(5)],
      ['btr033', 'o:BTR', '033', 1745, P(6)],
      ['btr038', 'o:BTR', '038', 1816, 684.4]
    ],
    w,
    j: [
      [536.7, R1],
      [536.7, 417],
      [980, R1],
      [1002.2, R1],
      [1150, R1]
    ],
    t
  });
})();
