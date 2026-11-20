/* TCA782 EOS TURBINE SPEED (331DM09788 page 203, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn:
   - MJL A002 (S:0, M:30.0): X = EOS(1) / (2) / (3) TURBINE SPEED (Z1 / Z2 / Z3), T = INITIAL (ref, TCA100) through BTR 001;
     1 / 2 / 3 = OFF(0) through BTR 007 / 008 / 009.
   - Y through FTR 003 = A; from it FTR 013 = EOS TURBINE SPEED to CRT TCA782_A1 and FTR 014 to B1.
   - 1 / 2 / 3 through BTR 010 / 011 / 012 = A1 / A2 / A3.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const WT = (key, ...pts) => w.push([key, pts, 1]);
  const xL = 1169,
    xR = 1272,
    xO = 1998,
    P = [304, 325, 346, 368, 389, 411];
  /* inputs */
  W('kInit', [766, 229], [1221, 229], [1221, 292]);
  WT('iZ1', [372, P[0]], [xL, P[0]]);
  WT('iZ2', [372, P[5]], [1117, P[5]], [1117, P[1]], [xL, P[1]]);
  WT('iZ3', [372, 518], [1127, 518], [1127, P[2]], [xL, P[2]]);
  W('kOff', [968, 582], [997, 582], [997, P[3]], [xL, P[3]]);
  W('kOff', [997, P[4]], [xL, P[4]]);
  W('kOff', [997, P[5]], [xL, P[5]]);
  /* outputs */
  WT('mA002.Y', [xR, P[0]], [xO - 27, P[0]]);
  WT('mA002.Y', [1582, P[0]], [1582, 165], [xO - 35, 165]);
  WT('mA002.Y', [1582, 228], [1991 - 27, 228]);
  W('mA002.1', [xR, 325], [1721, 325], [1721, 377], [xO - 27, 377]);
  W('mA002.2', [xR, 346], [1613, 346], [1613, 452], [xO - 27, 452]);
  W('mA002.3', [xR, 368], [1528, 368], [1528, 527], [xO - 27, 527]);
  const b = [
    ['btr001', 'o:BTR', '001', 944, 229],
    ['btr007', 'o:BTR', '007', 1050, P[3]],
    ['btr008', 'o:BTR', '008', 1124, P[4]],
    ['btr009', 'o:BTR', '009', 1050, P[5]],
    ['ftr003', 'o:FTR', '003', 1529, P[0]],
    ['ftr013', 'o:FTR', '013', 1637, 165],
    ['ftr014', 'o:FTR', '014', 1637, 228],
    ['btr010', 'o:BTR', '010', 1434, 325],
    ['btr011', 'o:BTR', '011', 1529, 346],
    ['btr012', 'o:BTR', '012', 1434, 368]
  ];
  const m = [
    [
      'mA002',
      '',
      '',
      xL,
      292,
      xR - xL,
      129,
      ['X', 'X', 'X', '1', '2', '3'],
      ['Y', '1', '2', '3'],
      'A002',
      [
        [1170, 444, 'S:0'],
        [1170, 466, 'M:30.0']
      ],
      [P, P.slice(0, 4)]
    ]
  ];
  const c = [
    ['iZ1', 'in', 'Z1', 345, P[0], '', ['-'], 1, 0],
    ['iZ2', 'in', 'Z2', 345, P[5], '', ['-'], 1, 0],
    ['iZ3', 'in', 'Z3', 345, 518, '', ['-'], 1, 0],
    ['oA', 'out', 'A', xO, P[0], '', ['-'], 0, 0],
    ['oB1', 'out', 'B1', 1991, 228, '', ['-'], 1, 0],
    ['oA1', 'out', 'A1', xO, 377, '', ['-'], 0, 0],
    ['oA2', 'out', 'A2', xO, 452, '', ['-'], 0, 0],
    ['oA3', 'out', 'A3', xO, 527, '', ['-'], 0, 0]
  ];
  const j = [
    [1582, P[0]],
    [1582, 228],
    [997, P[4]],
    [997, P[5]]
  ];
  t.push(
    [700, 268, '(TCA100)', 1],
    [1153, 296, 'T'],
    [1221, 318, 'MJL', 1],
    [378, 296, 'EOS(1) TURBINE SPEED'],
    [378, 403, 'EOS(2) TURBINE SPEED'],
    [378, 510, 'EOS(3) TURBINE SPEED'],
    [1729, 160, 'EOS TURBINE SPEED'],
    [235, 1522, 'CONTROLLER:'],
    [397, 1522, 'COMM+MD'],
    [620, 1495, 'TRIGGER  :'],
    [620, 1520, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA782',
    title: 'EOS TURBINE SPEED',
    page: 203,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [165, 78, 2225, 1545],
    k: [
      ['kInit', 533, 229, 'INITIAL', 'ref'],
      ['kOff', 735, 582, 'OFF(0)', 'sys.ref']
    ],
    c,
    d: [['crt1', xO, 165, 'out', 'TCA782_A1', 'S', '#1C']],
    b,
    m,
    w,
    j,
    t
  });
})();
