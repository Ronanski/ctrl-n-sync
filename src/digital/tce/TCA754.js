/* TCA754 THERMAL STRESS(HP) (331DM09788 page 184, controller COMM+MD, trigger Trigger-of_LOGIC_2, cycle 60 s). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn:
   - TURBINE SPEED (TCA104) through DIV 011 by SG A014 (K:3600.0rpm), then MLT 012 of that ratio and FTR 013 of it: SPEED RATIO, D out
     (to TCA758).
   - The THERMAL STRESS block A001 (LMA628): T1-T5 = TH(1)N-TH(5)N (TCA753 / TCA752), SG1-SG5 = SG A002-A006 (DMH1-DMH5), TS = TS_H
     (TCA751). SURF = THERMAL STRESS (HP SURFACE), A out (to TCA760 / TCA762 / TCA767); TB = TB-H, 1 out (to TCA760).
   - BORE plus MLT 008 of the speed ratio and SG A009 (K:68.94N/mm) in ADD 007 = THERMAL STRESS (HP BORE), B out (to TCA760); ABS 010 of
     it = HP BORE STRESS (ABS), C out (to TCA769).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const WT = (key, ...pts) => w.push([key, pts, 1]);
  const F = [162, 86, 2220, 1548],
    u = (F[2] - F[0]) / 1000,
    MX = 888,
    MW = 401,
    MR = MX + MW,
    TOP = 349.3,
    H = 858.7,
    N = 25,
    P = i => TOP + 15 * u + ((i + 0.5) * (H - 30 * u)) / N,
    HW = 28.76;
  /* speed ratio */
  WT('kSpd', [564.7, 173.3], [802.7 - HW, 173.3]);
  WT('sgA014', [417.7 + HW, 302], [748.7, 302], [748.7, 195.3], [802.7 - HW, 195.3]);
  WT('div011', [802.7 + HW, 173.3], [1187.7 - HW, 173.3]);
  WT('div011', [910.7, 173.3], [910.7, 247.3], [1122, 247.3], [1122, 195.3], [1187.7 - HW, 195.3]);
  WT('mlt012', [1187.7 + HW, 173.3], [2102.7 - 27, 173.3]);
  WT('mlt012', [1378.7, 173.3], [1378.7, 577.3], [1546.7 - HW, 577.3]);
  /* the THERMAL STRESS block inputs */
  [1, 2, 3, 4, 5].forEach(n => WT('iT' + n, [304.7, P(2 * n - 2)], [MX, P(2 * n - 2)]));
  WT('iS', [301.7, P(24)], [MX, P(24)]);
  const SG = [
    ['A002', 'DMH1', 'K:886.536'],
    ['A003', 'DMH2', 'K:689.178'],
    ['A004', 'DMH3', 'K:492.27'],
    ['A005', 'DMH4', 'K:295.362'],
    ['A006', 'DMH5', 'K:98.454']
  ];
  const b = [
    ['sgA014', 'SG', 'A014', 417.7, 313, ['K:3600.0rpm']],
    ['div011', 'DIV', '011', 802.7, 184.3],
    ['mlt012', 'MLT', '012', 1187.7, 184.3],
    ['ftr013', 'o:FTR', '013', 1015.3, 247.3],
    ['mlt008', 'MLT', '008', 1546.7, 588.3],
    ['sgA009', 'SG', 'A009', 1354.7, 683.3, ['K:68.94N/mm']],
    ['add007', 'ADD', '007', 1653.3, P(4) + 11],
    ['abs010', 'ABS', '010', 1758.3, 631]
  ];
  SG.forEach(([a, d, k], i) => {
    const y = P(11 + 2 * i);
    b.push(['sg' + a, 'SG', a, 544.7, y + 11]);
    WT('sg' + a, [544.7 + HW, y], [MX, y]);
    t.push([397, Math.round(y + 12), d], [397, Math.round(y + 38), k]);
  });
  /* outputs */
  WT('ts.SURF', [MR, P(0)], [2101 - 27, P(0)]);
  WT('ts.BORE', [MR, P(4)], [1653.3 - HW, P(4)]);
  WT('ts.TB', [MR, P(11)], [2099 - 27, P(11)]);
  WT('sgA009', [1354.7 + HW, 672.3], [1492, 672.3], [1492, 599.3], [1546.7 - HW, 599.3]);
  WT('mlt008', [1546.7 + HW, 577.3], [1600, 577.3], [1600, P(4) + 22], [1653.3 - HW, P(4) + 22]);
  WT('add007', [1653.3 + HW, P(4)], [2101 - 27, P(4)]);
  WT('add007', [1706.7, P(4)], [1706.7, 620], [1758.3 - HW, 620]);
  WT('abs010', [1758.3 + HW, 620], [2099.3 - 27, 620]);
  t.push(
    [484.7, 218, '(TCA104)', 1],
    [1031, 270, '013'],
    ...[1, 2, 3, 4, 5].map(n => [310, P(2 * n - 2) - 2, 'TH(' + n + ')N']),
    [307, P(24) - 2, 'TS_H'],
    [1851, 171, 'SPEED RATIO'],
    [1851, 371, 'THERMAL STRESS'],
    [1851, 393, '(HP SURFACE)'],
    [1848, 499, 'THERMAL STRESS'],
    [1848, 521, '(HP BORE)'],
    [1848, 594, 'HP BORE STRESS'],
    [1848, 617, '(ABS)'],
    [1849, 745, 'TB-H'],
    [1025, 1233, '(LMA628)', 1],
    ...['XO:0.0', 'YO:0.0', 'G :1.0', 'C :0.0', 'XO:0.0', 'YO:0.0', 'G :1.0', 'XC:0.0', 'K:3.989', 'XO:0.0'].map((s, i) => [
      890,
      Math.round(1257 + 21.2 * i),
      s
    ]),
    ...['YO:0.0', 'G :1.0', 'C :0.0', 'K:3.989', 'XO:0.0', 'YO:0.0', 'G :1.0', 'C :0.0', 'XO:0.0', 'YO:0.0'].map((s, i) => [
      1090,
      Math.round(1257 + 21.2 * i),
      s
    ]),
    [231, 1532, 'CONTROLLER:'],
    [391, 1532, 'COMM+MD'],
    [615, 1515, 'TRIGGER  :Trigger-of_LOGIC_2'],
    [615, 1541, 'CYCLE(s):60']
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
    id: 'TCA754',
    /* pr: printed on page 184 beside each block; the drawing above keeps them as text */
    pr: {
      sgA002: ['K:886.536'],
      sgA003: ['K:689.178'],
      sgA004: ['K:492.27'],
      sgA005: ['K:295.362'],
      sgA006: ['K:98.454']
    },
    title: 'THERMAL STRESS(HP)',
    page: 184,
    ctl: 'COMM+MD',
    cycle: 60000,
    f: F,
    k: [['kSpd', 331.7, 173.3, 'TURBINE SPEED', 'ref']],
    c: [
      ['iT1', 'in', '1', 277.7, P(0), '', ['TCA753'], 0, 1],
      ['iT2', 'in', '2', 277.7, P(2), '', ['TCA753'], 0, 1],
      ['iT3', 'in', '3', 277.7, P(4), '', ['TCA752'], 0, 1],
      ['iT4', 'in', '4', 277.7, P(6), '', ['TCA752'], 0, 1],
      ['iT5', 'in', '5', 277.7, P(8), '', ['TCA752'], 0, 1],
      ['iS', 'in', 'S', 274.7, P(24), '', ['TCA751'], 0, 1],
      ['oD', 'out', 'D', 2102.7, 173.3, '', ['TCA758'], 0, 1],
      ['oA', 'out', 'A', 2101, P(0), '', ['TCA760', 'TCA762', 'TCA767'], 0, 1],
      ['oB', 'out', 'B', 2101, P(4), '', ['TCA760'], 0, 1],
      ['oC', 'out', 'C', 2099.3, 620, '', ['TCA769'], 0, 1],
      ['o1', 'out', '1', 2099, P(11), '', ['TCA760'], 0, 1]
    ],
    m: [['ts', 'THERMAL STRESS', '', MX, TOP, MW, H, L, R, 'A001', []]],
    b,
    w,
    j: [
      [910.7, 173.3],
      [1378.7, 173.3],
      [1706.7, P(4)]
    ],
    t
  });
})();
