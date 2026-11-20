/* TCA755 THERMAL STRESS(IP) (331DM09788 page 185, controller COMM+MD, trigger Trigger-of_LOGIC_2, cycle 60 s). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn:
   - The THSC INITIAL block A015 (LMA626 / LMA626A): INT1-INT3 = INIT1(LOADING), INIT2(HALF SPEED), INIT3(OTHERS) (D1-D3 of TCA751);
     T1IN-T5IN = the IP stage temperatures TI(1)N-TI(5)N (TCA757 / TCA756, the second one printed TH(2)N); out T1-T5 as TI(1)-TI(5)
     and TS as TS_I.
   - MTIN / MTOUT: reheat bowl inner wall metal temp (A1 of TCA370) and A3 of TCA356, through ASW 013 / 014 switched by THSC SIMULATION
     to SIM IP INNER / OUTER WALL MET TEMP (B1 / B2 of TCA770).
   The words are the ones of the drawing.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const WT = (key, ...pts) => w.push([key, pts, 1]);
  const F = [174, 85, 2229, 1549],
    u = (F[2] - F[0]) / 1000,
    MX = 1089.3,
    MW = 404,
    MR = MX + MW,
    TOP = 400,
    H = 701.7,
    P = i => TOP + 15 * u + ((i + 0.5) * (H - 30 * u)) / 20,
    HW = 28.76,
    AX = 818;
  /* INIT1-3 */
  W('iD1', [302, 183], [948, 183], [948, P(0)], [MX, P(0)]);
  W('iD2', [302, 258.7], [895.3, 258.7], [895.3, P(1)], [MX, P(1)]);
  W('iD3', [302, 333.3], [841.3, 333.3], [841.3, P(2)], [MX, P(2)]);
  /* stage temperatures in and out */
  [1, 2, 3, 4, 5].forEach(n => WT('iT' + n, [311.7, P(2 + 2 * n)], [MX, P(2 + 2 * n)]));
  [
    [4, 'T1'],
    [6, 'T2'],
    [8, 'T3'],
    [10, 'T4'],
    [12, 'T5'],
    [15, 'TS']
  ].forEach(([i, n]) => WT('thsc.' + n, [MR, P(i)], [2065.3 - 27, P(i)]));
  /* metal temperatures, real or simulated */
  W('kSim', [633, 878.7], [AX, 878.7], [AX, P(15) + 11 - 21.5]);
  W('kSim', [680, 878.7], [680, 990.7], [AX, 990.7], [AX, P(18) + 11 - 21.5]);
  WT('iA1', [311.7, P(15) + 22], [AX - HW, P(15) + 22]);
  WT('iB1', [311.7, 1118.7], [733.3, 1118.7], [733.3, P(15)], [AX - HW, P(15)]);
  WT('iA3', [311.7, P(18) + 22], [AX - HW, P(18) + 22]);
  WT('iB2', [311.7, 1202.7], [753.3, 1202.7], [753.3, P(18)], [AX - HW, P(18)]);
  WT('asw013', [AX + HW, P(15)], [MX, P(15)]);
  WT('asw014', [AX + HW, P(18)], [MX, P(18)]);
  t.push(
    [308, 181, 'INIT1(LOADING)'],
    [308, 257, 'INIT2(HALF SPEED)'],
    [308, 331, 'INIT3(OTHERS)'],
    ...['TI(1)N', 'TH(2)N', 'TI(3)N', 'TI(4)N', 'TI(5)N'].map((s, i) => [318, P(4 + 2 * i) - 2, s]),
    ...[1, 2, 3, 4, 5].map(n => [1687, P(2 + 2 * n) - 2, 'TI(' + n + ')']),
    [1685, P(15) - 2, 'TS_I'],
    [565, 913, '(TCA102)', 1],
    [318, 924, 'REHEAT BOWL INNER'],
    [318, 945, 'WALL METAL TEMP.'],
    [318, 1115, 'SIM IP INNER WALL MET TEMP'],
    [318, 1200, 'SIM IP OUTER WALL MET TEMP'],
    [1225, 1126, '(LMA626)', 1],
    [1345, 1126, '(LMA626A)', 1],
    ...['T:60.0s', 'K:0.5', 'T:60.0s', 'T:60.0s', 'K:0.9', 'T:60.0s', 'K:0.7', 'T:60.0s', 'K:0.5', 'T:60.0s'].map((s, i) => [
      1091,
      Math.round(1149 + 21.33 * i),
      s
    ]),
    ...['K:0.3', 'T:60.0s', 'K:0.1'].map((s, i) => [1291, Math.round(1149 + 21.33 * i), s]),
    [242, 1530, 'CONTROLLER:'],
    [403, 1530, 'COMM+MD'],
    [627, 1512, 'TRIGGER  :Trigger-of_LOGIC_2'],
    [627, 1538, 'CYCLE(s):60']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA755',
    title: 'THERMAL STRESS(IP)',
    page: 185,
    ctl: 'COMM+MD',
    cycle: 60000,
    f: F,
    k: [['kSim', 400, 878.7, 'THSC SIMULATION', 'ref']],
    c: [
      ['iD1', 'in', 'D1', 275, 183, '', ['TCA751'], 0, 1],
      ['iD2', 'in', 'D2', 275, 258.7, '', ['TCA751'], 0, 1],
      ['iD3', 'in', 'D3', 275, 333.3, '', ['TCA751'], 0, 1],
      ['iT1', 'in', '1', 284.7, P(4), '', ['TCA757'], 0, 1],
      ['iT2', 'in', '2', 284.7, P(6), '', ['TCA757'], 0, 1],
      ['iT3', 'in', '3', 284.7, P(8), '', ['TCA756'], 0, 1],
      ['iT4', 'in', '4', 284.7, P(10), '', ['TCA756'], 0, 1],
      ['iT5', 'in', '5', 284.7, P(12), '', ['TCA756'], 0, 1],
      ['iA1', 'in', 'A1', 284.7, P(15) + 22, '', ['TCA370'], 0, 1],
      ['iA3', 'in', 'A3', 284.7, P(18) + 22, '', ['TCA356'], 0, 1],
      ['iB1', 'in', 'B1', 284.7, 1118.7, '', ['TCA770'], 0, 1],
      ['iB2', 'in', 'B2', 284.7, 1202.7, '', ['TCA770'], 0, 1],
      ['o1', 'out', '1', 2065.3, P(4), '', ['TCA757'], 0, 1],
      ['o2', 'out', '2', 2065.3, P(6), '', ['TCA756', 'TCA757'], 0, 4],
      ['o3', 'out', '3', 2065.3, P(8), '', ['TCA756'], 0, 1],
      ['o4', 'out', '4', 2065.3, P(10), '', ['TCA756'], 0, 1],
      ['o5', 'out', '5', 2065.3, P(12), '', ['TCA756'], 0, 1],
      ['oS', 'out', 'S', 2065.3, P(15), '', ['TCA757', 'TCA758'], 0, 4]
    ],
    m: [
      [
        'thsc',
        'THSC INITIAL',
        '',
        MX,
        TOP,
        MW,
        H,
        ['INT1', 'INT2', 'INT3', '', 'T1IN', '', 'T2IN', '', 'T3IN', '', 'T4IN', '', 'T5IN', '', '', 'MTIN', '', '', 'MTOUT', ''],
        ['', '', '', '', 'T1', '', 'T2', '', 'T3', '', 'T4', '', 'T5', '', '', 'TS', '', '', '', ''],
        'A015',
        []
      ]
    ],
    b: [
      ['asw013', 'ASW', '013', AX, P(15) + 11],
      ['asw014', 'ASW', '014', AX, P(18) + 11]
    ],
    w,
    j: [[680, 878.7]],
    t
  });
})();
