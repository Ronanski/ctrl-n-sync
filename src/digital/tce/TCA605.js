/* TCA605 STEAM SEAL DIVERTING VALVE (TC-36) (331DM09788 page 147, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the
   pixels of the page rendered 2296 wide. The steam seal diverting valve nFV-GSn036 (AIR OPERAT VALVE A021, LMA593): AUTO by the operator
   station (A 023, FFR 024; CONDENSER SIDE resets it, A 026), all three with AVAILABLE; in AUTO the solenoid is energized (SVE, A 036) while
   OR 038 is off, and de-energized (SVD, OR 041) when not AUTO or OR 038 is on: LP turbine extraction steam temp. high (CMP 043, HL 149 /
   LL 141 degC, cleared by INITIAL), SSFV bypass valve not full closed (NOT 039) or No.1 LP heater level very high. RESET by the operator
   station (A 027). Out: SOLENOID VALVE ENERGIZE, HEATER SIDE, CONDENSER SIDE.
   The words are the ones of the drawing (ERTRACTION as printed); the tags keep the small n of the drawing (the unit number).
   live: none; the engine holds no state of this valve, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const T = (key, ...pts) => w.push([key, pts, 1]);
  const MX = 1309,
    MR = 1715;
  /* the operator station */
  W('crtIys', [397, 162], [556, 162], [556, 504], [617, 504]);
  W('crtIys', [556, 333], [619, 333]);
  W('crtIys', [556, 419], [618, 419]);
  W('crtIka', [385, 355], [619, 355]);
  W('crtJyc', [385, 440], [618, 440]);
  W('crtIkr', [385, 526], [617, 526]);
  W('a023', [679, 333], [726, 333]);
  W('a026', [678, 419], [716, 419], [716, 355], [726, 355]);
  W('a027', [677, 504], [1244, 504], [1244, 462], [MX, 462]);
  W('kOn', [484, 248], [1108, 248], [1108, 301], [MX, 301]);
  /* AUTO: lamp, energize, de-energize */
  W('ffr024', [806, 333], [1109, 333]);
  W('ffr024', [851, 333], [851, 163], [1233, 163]);
  W('ffr024', [851, 333], [851, 398], [863, 398]);
  W('not040', [923, 398], [1109, 398]);
  W('not037', [1063, 355], [1109, 355]);
  W('a036', [1169, 333], [MX, 333]);
  W('or041', [1169, 398], [MX, 398]);
  /* the conditions of the condenser side */
  W('kInit', [470, 622], [657, 622], [657, 718]);
  T('iA4', [352, 728], [627, 728]);
  W('cmp043', [687, 728], [850, 728]);
  W('iA8', [350, 823], [615, 823]);
  W('not039', [675, 823], [720, 823], [720, 749], [850, 749]);
  W('iA3', [350, 930], [783, 930], [783, 770], [850, 770]);
  W('or038', [910, 728], [979, 728], [979, 355], [1003, 355]);
  W('or038', [979, 419], [1109, 419]);
  /* the limit switches */
  W('iA2', [349, 1089], [1074, 1089], [1074, 527], [MX, 527]);
  W('iA1', [348, 1173], [1136, 1173], [1136, 559], [MX, 559]);
  /* out */
  W('vlv.SVE', [MR, 301], [2060, 301]);
  W('vlv.LTOP', [MR, 462], [2059, 462]);
  W('vlv.LTCL', [MR, 495], [1809, 495], [1809, 579], [2059, 579]);
  t.push(
    [418, 152, 'AVAILABLE'],
    [406, 345, 'AUTO'],
    [406, 430, 'CONDENSER SIDE'],
    [406, 516, 'RESET'],
    [1082, 153, 'AUTO'],
    [718, 321, 'T', 2],
    [619, 716, 'T', 2],
    [359, 696, 'LP TURBINE'],
    [359, 717, 'ERTRACTION STEAM TEMP'],
    [358, 791, 'SSFV BYPASS VALVE'],
    [358, 812, 'FULL CLOSE POSITION'],
    [357, 920, 'NO.1 LP HEATER LEVEL VERY HIGH'],
    [356, 1058, 'STEAM SEAL DIVERTING VALVE'],
    [356, 1079, 'HEATER SIDE'],
    [355, 1142, 'STEAM SEAL DIVERTING VALVE'],
    [355, 1163, 'CONDENSER SIDE'],
    [1827, 251, 'STEAM SEAL DIVERTING VALVE'],
    [1827, 272, 'SOLENOID VALVE ENERGIZE'],
    [1836, 432, 'STEAM SEAL DIVERTING VALVE'],
    [1836, 453, 'HEATER SIDE'],
    [1835, 539, 'STEAM SEAL DIVERTING VALVE'],
    [1835, 560, 'CONDENSER SIDE'],
    [339, 658, '(TCA100)'],
    [235, 1525, 'CONTROLLER:'],
    [397, 1525, 'COMM+MD'],
    [619, 1499, 'TRIGGER  :'],
    [619, 1525, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA605',
    title: 'STEAM SEAL DIVERTING VALVE (TC-36)',
    page: 147,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    k: [
      ['kOn', 250, 248, 'ON(1)', 'sys.ref'],
      ['kInit', 236, 622, 'INITIAL', 'ref']
    ],
    c: [
      ['iA4', 'in', 'A4', 325, 728, '', ['TCA356']],
      ['iA8', 'in', 'A8', 323, 823, '', ['TCA049']],
      ['iA3', 'in', 'A3', 323, 930, '', ['TCA041']],
      ['iA2', 'in', 'A2', 322, 1089, '', ['TCA041']],
      ['iA1', 'in', 'A1', 321, 1173, '', ['TCA041']],
      ['oA1', 'out', 'A1', 2087, 301, '', ['TCA834']],
      ['oA2', 'out', 'A2', 2086, 462, '', ['-']],
      ['oA3', 'out', 'A3', 2086, 579, '', ['-']]
    ],
    d: [
      ['crtIys', 362, 162, 'in', 'nFV-GSn036_IYS', 'R', '#1C'],
      ['crtIka', 350, 355, 'in', 'nFV-GSn036_IKA', 'R', '#1C'],
      ['crtJyc', 350, 440, 'in', 'nFV-GSn036_JYC', 'R', '#1C'],
      ['crtIkr', 350, 526, 'in', 'nFV-GSn036_IKR', 'R', '#1C'],
      ['crtIia', 1268, 163, 'out', 'nFV-GSn036_IIA', 'S', '#1C']
    ],
    m: [
      [
        'vlv',
        'AIR OPERAT VALVE',
        'nFV-GSn036',
        MX,
        254,
        MR - MX,
        384,
        ['FFP', 'SVE', '', 'SVD', '', 'RESET', '', 'LTOP', 'LTCL', ''],
        ['SVE', '', '', '', '', 'LTOP', 'LTCL', '', 'ABN', ''],
        'A021',
        [
          [1415, 657, '(LMA593)'],
          [1312, 679, 'R :20.0'],
          [1312, 700, 'M :1'],
          [1312, 722, 'HL:100.0'],
          [1312, 743, 'LL:0.0'],
          [1312, 765, 'K:99.0%'],
          [1312, 786, 'TP:5.0s'],
          [1312, 808, 'K:0.0%'],
          [1312, 829, 'TP:10.0'],
          [1312, 851, 'TP:10.0'],
          [1312, 872, 'K:1.0%'],
          [1514, 679, 'TP:5.0s']
        ]
      ]
    ],
    b: [
      ['btr022', 'o:BTR', '022', 896, 163],
      ['a023', 'A', '023', 649, 344],
      ['ffr024', 'FFR', '024', 766, 344, [], { l: ['S', 'R'] }, [80, 43]],
      ['a026', 'A', '026', 648, 430],
      ['a027', 'A', '027', 647, 515],
      ['btr028', 'o:BTR', '028', 1800, 301],
      ['btr029', 'o:BTR', '029', 1266, 333],
      ['btr030', 'o:BTR', '030', 1266, 398],
      ['btr031', 'o:BTR', '031', 1265, 462],
      ['btr032', 'o:BTR', '032', 1745, 462],
      ['btr033', 'o:BTR', '033', 1745, 495],
      ['btr034', 'o:BTR', '034', 1265, 527],
      ['btr035', 'o:BTR', '035', 1265, 559],
      ['a036', 'A', '036', 1139, 344],
      ['not037', 'NOT', '037', 1033, 366],
      ['or038', 'OR', '038', 880, 749, [], {}, [60, 65]],
      ['not039', 'NOT', '039', 645, 834],
      ['not040', 'NOT', '040', 893, 409],
      ['or041', 'OR', '041', 1139, 409],
      ['btr042', 'o:BTR', '042', 1266, 301],
      ['cmp043', 'CMP', '043', 657, 739, ['HL:149degC', 'LL:141degC']]
    ],
    w,
    j: [
      [556, 333],
      [556, 419],
      [851, 333],
      [979, 419]
    ],
    t
  });
})();
