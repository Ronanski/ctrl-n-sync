/* TCA758 THERMAL STRESS(IP) (331DM09788 page 188, controller COMM+MD, trigger Trigger-of_LOGIC_2, cycle 60 s). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn:
   - The THERMAL STRESS block A001 (LMA628): T1-T5 = TI(1)N-TI(5)N (TCA757 / TCA756), SG1-SG5 = SG A002-A006 (DMI1-DMI5), TS = TS_I
     (TCA755). SURF = THERMAL STRESS (IP SURFACE), A out (to TCA760 / TCA763 / TCA767); TB = TB-I, 1 out (to TCA760).
   - BORE plus MLT 008 of SPEED RATIO (D of TCA754) and SG A009 (K:76.2N/mm) in ADD 007 = THERMAL STRESS (IP BORE), B out (to TCA760);
     ABS 010 of it = IP BORE STRESS (ABS), C out (to TCA769).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const WT = (key, ...pts) => w.push([key, pts, 1]);
  const F = [168, 81, 2223, 1550],
    u = (F[2] - F[0]) / 1000,
    MX = 889,
    MW = 408,
    MR = MX + MW,
    TOP = 221,
    H = 859,
    N = 25,
    P = i => TOP + 15 * u + ((i + 0.5) * (H - 30 * u)) / N,
    HW = 28.76;
  /* the THERMAL STRESS block inputs */
  [1, 2, 3, 4, 5].forEach(n => WT('iT' + n, [307, P(2 * n - 2)], [MX, P(2 * n - 2)]));
  WT('iS', [295, P(24)], [MX, P(24)]);
  const SG = [
    ['A002', 'DMI1', 'K:940.164'],
    ['A003', 'DMI2', 'K:731.239'],
    ['A004', 'DMI3', 'K:522.314'],
    ['A005', 'DMI4', 'K:313.388'],
    ['A006', 'DMI5', 'K:104.463']
  ];
  const yA = P(4),
    b = [
      ['mlt008', 'MLT', '008', 1549, 459],
      ['sgA009', 'SG', 'A009', 1360, 551, ['K:76.2N/mm']],
      ['add007', 'ADD', '007', 1659, yA + 11],
      ['abs010', 'ABS', '010', 1765, 499]
    ];
  SG.forEach(([a, d, k], i) => {
    const y = P(11 + 2 * i);
    b.push(['sg' + a, 'SG', a, 547.5, y + 11]);
    WT('sg' + a, [547.5 + HW, y], [MX, y]);
    t.push([380, Math.round(y + 1), d], [380, Math.round(y + 27), k]);
  });
  /* speed ratio part and outputs */
  WT('iD', [1386, 448], [1549 - HW, 448]);
  WT('sgA009', [1360 + HW, 540], [1497, 540], [1497, 470], [1549 - HW, 470]);
  WT('mlt008', [1549 + HW, 448], [1602, 448], [1602, yA + 22], [1659 - HW, yA + 22]);
  WT('ts.SURF', [MR, P(0)], [2107 - 27, P(0)]);
  WT('ts.BORE', [MR, yA], [1659 - HW, yA]);
  WT('add007', [1659 + HW, yA], [2107 - 27, yA]);
  WT('add007', [1710, yA], [1710, 488], [1765 - HW, 488]);
  WT('abs010', [1765 + HW, 488], [2107 - 27, 488]);
  WT('ts.TB', [MR, P(11)], [2105 - 27, P(11)]);
  t.push(
    ...[1, 2, 3, 4, 5].map(n => [314, P(2 * n - 2) - 2, 'TI(' + n + ')N']),
    [300, P(24) - 2, 'TS_I'],
    [1392, 446, 'SPEED RATIO'],
    [1855, 237, 'THERMAL STRESS'],
    [1855, 259, '(IP SURFACE)'],
    [1852, 365, 'THERMAL STRESS'],
    [1852, 387, '(IP BORE)'],
    [1852, 461, 'IP BORE STRESS'],
    [1852, 483, '(ABS)'],
    [1852, 614, 'TB-I'],
    [997, 1105, '(LMA628)', 1],
    ...['XO:0.0', 'YO:0.0', 'G :1.0', 'C :0.0', 'XO:0.0', 'YO:0.0', 'G :1.0', 'XC:0.0', 'K:3.989', 'XO:0.0'].map((s, i) => [
      892,
      Math.round(1129 + 21 * i),
      s
    ]),
    ...['YO:0.0', 'G :1.0', 'C :0.0', 'K:3.989', 'XO:0.0', 'YO:0.0', 'G :1.0', 'C :0.0', 'XO:0.0', 'YO:0.0'].map((s, i) => [
      1095,
      Math.round(1129 + 21 * i),
      s
    ]),
    [235, 1532, 'CONTROLLER:'],
    [397, 1532, 'COMM+MD'],
    [620, 1515, 'TRIGGER  :Trigger-of_LOGIC_2'],
    [620, 1541, 'CYCLE(s):60']
  );
  const L = Array(N).fill(''),
    R = Array(N).fill('');
  [
    [0, 'T1'],
    [2, 'T2'],
    [4, 'T3'],
    [6, 'T4'],
    [8, 'T5'],
    [11, 'SG1'],
    [13, 'SG2'],
    [15, 'SG3'],
    [17, 'SG4'],
    [19, 'SG5'],
    [24, 'TS']
  ].forEach(([i, s]) => (L[i] = s));
  [
    [0, 'SURF'],
    [4, 'BORE'],
    [11, 'TB']
  ].forEach(([i, s]) => (R[i] = s));
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA758',
    title: 'THERMAL STRESS(IP)',
    page: 188,
    ctl: 'COMM+MD',
    cycle: 60000,
    f: F,
    c: [
      ['iT1', 'in', '1', 280, P(0), '', ['TCA757'], 0, 1],
      ['iT2', 'in', '2', 280, P(2), '', ['TCA757'], 0, 1],
      ['iT3', 'in', '3', 280, P(4), '', ['TCA756'], 0, 1],
      ['iT4', 'in', '4', 280, P(6), '', ['TCA756'], 0, 1],
      ['iT5', 'in', '5', 280, P(8), '', ['TCA756'], 0, 1],
      ['iS', 'in', 'S', 268, P(24), '', ['TCA755'], 0, 1],
      ['iD', 'in', 'D', 1359, 448, '', ['TCA754'], 0, 1],
      ['oA', 'out', 'A', 2107, P(0), '', ['TCA760', 'TCA763', 'TCA767'], 0, 1],
      ['oB', 'out', 'B', 2107, yA, '', ['TCA760'], 0, 1],
      ['oC', 'out', 'C', 2107, 488, '', ['TCA769'], 0, 1],
      ['o1', 'out', '1', 2105, P(11), '', ['TCA760'], 0, 1]
    ],
    m: [['ts', 'THERMAL STRESS', '', MX, TOP, MW, H, L, R, 'A001', []]],
    b,
    w,
    j: [[1710, yA]],
    t
  });
})();
