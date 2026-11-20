/* TCA655 MAIN OIL TANK VAPOUR EXTRACTOR (TB-12) (331DM09788 page 165, controller COMM+MD, cycle 100 ms). Typed from the drawing; units =
   the pixels of the page rendered 2296 wide. The motor nF-n937 (MOTOR STANDARD B013, LMA580C / D): auto start, auto stop and trip held
   at OFF(0), its electrical trouble and running in; STS sets and OUT resets FFR 015 = START COMMAND (TCA833); RUN out to TCA532.
   STOPED (as printed): not running (NOT 008) while a main oil pump (A) / (B) or the emergency oil pump runs (OR 011), A 009, for
   TP A010 (5.0 s, cleared by INITIAL), to the operator station.
   The tag keeps the small n of the drawing (the unit number).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const MX = 1272,
    MR = 1677,
    P = [304.1, 336.3, 368.5, 400.7, 432.9];
  /* OFF(0) on auto start, auto stop and trip */
  W('kOff', [538, 219], [1070, 219], [1070, P[2]], [MX, P[2]]);
  W('kOff', [1070, P[0]], [MX, P[0]]);
  W('kOff', [1070, P[1]], [MX, P[1]]);
  W('iA8', [368.5, 464], [1069, 464], [1069, P[3]], [MX, P[3]]);
  W('iA7', [367, 613], [1100, 613], [1100, P[4]], [MX, P[4]]);
  /* out */
  W('mtr.STS', [MR, P[0]], [1795.5, P[0]]);
  W('mtr.OUT', [MR, P[1]], [1740, P[1]], [1740, 325.6], [1795.5, 325.6]);
  W('ffr015', [1875.5, P[0]], [2107.5, P[0]]);
  W('mtr.RUN', [MR, P[2]], [1877, P[2]], [1877, 912], [754, 912], [754, 1059.3], [840.5, 1059.3]);
  W('mtr.RUN', [1877, 412], [2096, 412]);
  /* stopped */
  W('not008', [900.5, 1059.3], [1001.5, 1059.3]);
  W('iA2', [364, 1133.5], [840, 1133.5]);
  W('iB2', [364, 1186], [795, 1186], [795, 1155], [840, 1155]);
  W('iC1', [364, 1240], [816, 1240], [816, 1176.5], [840, 1176.5]);
  W('or011', [900, 1133.5], [946, 1133.5], [946, 1080.8], [1001.5, 1080.8]);
  W('a009', [1061.5, 1059.3], [1139, 1059.3]);
  W('kInit', [533, 985], [1169, 985], [1169, 1048]);
  W('tpA010', [1199, 1059.3], [1517, 1059.3]);
  t.push(
    [374, 434, 'MAIN OIL TANK VAPOUR EXTRACTOR'],
    [374, 455, 'MOTOR ELECTRICAL TROUBLE'],
    [373, 582, 'MAIN OIL TANK VAPOUR EXTRACTOR'],
    [373, 604, 'RUNNING'],
    [369, 1123, 'MAIN OIL PUMP (A) RUNNING'],
    [369, 1177, 'MAIN OIL PUMP (B) RUNNING'],
    [369, 1230, 'EMERGENCY OIL PUMP RUNNING'],
    [1914, 246, 'MAIN OIL TANK'],
    [1914, 268, 'VAPOUR EXTRACTOR'],
    [1914, 289, 'START COMMAND'],
    [1215, 1021, 'MAIN OIL TANK'],
    [1215, 1042, 'VAPOUR EXTRACTOR STOPED'],
    [1787, 292, 'T', 2],
    [1131, 1047, 'T', 2],
    [468, 1024, '(TCA100)', 1],
    [238, 1527, 'CONTROLLER:'],
    [398, 1527, 'COMM+MD'],
    [623, 1500, 'TRIGGER  :'],
    [623, 1527, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA655',
    title: 'MAIN OIL TANK VAPOUR EXTRACTOR (TB-12)',
    page: 165,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [178, 90, 2232, 1548],
    k: [
      ['kOff', 305, 219, 'OFF(0)', 'sys.ref'],
      ['kInit', 300, 985, 'INITIAL', 'ref']
    ],
    c: [
      ['iA8', 'in', 'A8', 341.5, 464, '', ['TCA047']],
      ['iA7', 'in', 'A7', 340, 613, '', ['TCA047']],
      ['iA2', 'in', 'A2', 337, 1133.5, '', ['TCE300'], 1],
      ['iB2', 'in', 'B2', 337, 1186, '', ['TCE300'], 1],
      ['iC1', 'in', 'C1', 337, 1240, '', ['TCE310'], 1],
      ['oA1', 'out', 'A1', 2134.5, P[0], '', ['TCA833']],
      ['oB1', 'out', 'B1', 2123, 412, '', ['TCA532']]
    ],
    d: [['crt1', 1552, 1059.3, 'out', 'TCA610_1', 'S', '#1C']],
    m: [
      [
        'mtr',
        'MOTOR STANDARD',
        'nF-n937',
        MX,
        257,
        MR - MX,
        223,
        ['ASRT', 'ASTP', 'TRP', 'EF', 'RUN'],
        ['STS', 'OUT', 'RUN', 'STP', 'ABN'],
        'B013',
        [
          [1374, 502, '(LMA580C)'],
          [1491, 502, '(LMA580D)'],
          ...['TD:1.0s', 'TP:3.0s', 'TP:3.0s', 'TP:0.5s'].map((s, i) => [1275, Math.round(525 + 21.5 * i), s])
        ]
      ]
    ],
    b: [
      ['btr014', 'o:BTR', '014', 1175, P[0]],
      ['btr016', 'o:BTR', '016', 1175, P[1]],
      ['btr017', 'o:BTR', '017', 1175, P[2]],
      ['btr018', 'o:BTR', '018', 1175, P[3]],
      ['btr019', 'o:BTR', '019', 1175, P[4]],
      ['ffr015', 'FFR', '015', 1835.5, 314.6, [], { l: ['S', 'R'] }, [80, 43]],
      ['not008', 'NOT', '008', 870.5, 1069.8],
      ['a009', 'A', '009', 1031.5, 1069.8],
      ['tpA010', 'TP', 'A010', 1169, 1069.8, ['TP:5.0s']],
      ['or011', 'OR', '011', 870, 1154.5, [], {}, [60, 64]]
    ],
    w,
    j: [
      [1070, P[0]],
      [1070, P[1]],
      [1877, 412]
    ],
    t
  });
})();
