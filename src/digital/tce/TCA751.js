/* TCA751 THERMAL STRESS(HP) (331DM09788 page 181, controller COMM+MD, trigger Trigger-of_LOGIC_2, cycle 60 s). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn:
   - THSC TRIG (A of TCA103) sets FFR 001, THSC INPUT ABNORMAL (B of TCA750) resets it. TW A002 (TW:180.0s, INITIAL on its top) of the
     FFR output goes into A 007, A 009 and A 012.
   - A 007 = 52G CLOSE and the TW output: INIT1(LOADING), D1 out. A 009 = turbine speed over UCK A008 (K:3550.0rpm) and the TW output:
     INIT2(HALF SPEED), D2 out. A 012 = the TW output, NOT 010 of 52G CLOSE and NOT 011 of the UCK: INIT3(OTHERS), D3 out (all to TCA755).
   - OR 005 of INIT1 / INIT2 / INIT3, through NOT 006, and NOT 003 of MYCTLMST into A 004 = LAG_ON (def).
   - The THSC INITIAL block A015 (LMA626 / LMA626A): INT1-INT3, the stage temperatures TH(1)N-TH(5)N (TCA752 / TCA753) into T1IN-T5IN,
     out T1-T5 as TH(1)-TH(5) and TS as TS_H. MTIN / MTOUT are the HP-T inner casing 1st stage inner / outer wall metal temperatures
     (A1 of TCA360 / TCA364), through ASW 013 / 014 switched by THSC SIMULATION to SIM HP INNER / OUTER WALL MET TEMP (A1 / A2 of TCA770).
   The words are the ones of the drawing (IST STG, MET as printed).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const WT = (key, ...pts) => w.push([key, pts, 1]);
  const F = [162, 85, 2219, 1546],
    u = (F[2] - F[0]) / 1000,
    MX = 1191,
    MW = 402,
    MR = MX + MW,
    TOP = 592,
    H = 701,
    P = i => TOP + 15 * u + ((i + 0.5) * (H - 30 * u)) / 20,
    HW = 28.76,
    TWV = 938.7;
  /* THSC trig / abnormal to FFR 001, TW A002 */
  W('iA', [292, 247], [642.7, 247]);
  W('iB', [292, 311.3], [618.7, 311.3], [618.7, 269], [642.7, 269]);
  W('ffr001', [723.3, 247], [876 - HW, 247]);
  W('kInit', [475, 172], [876, 172], [876, 236.5]);
  W('twA002', [876 + HW, 247], [TWV, 247], [TWV, 543.3], [971.8, 543.3]);
  W('twA002', [TWV, 396], [1001.3 - HW, 396]);
  W('twA002', [TWV, 481], [1001.3 - HW, 481]);
  /* 52G CLOSE and turbine speed */
  W('k52g', [473, 374], [1001.3 - HW, 374]);
  W('k52g', [725.3, 374], [725.3, 565.5], [798 - HW, 565.5]);
  WT('kSpd', [473, 459], [595.3 - HW, 459]);
  W('uckA008', [595.3 + HW, 459], [1001.3 - HW, 459]);
  W('uckA008', [702.7, 459], [702.7, 629], [798 - HW, 629]);
  W('not010', [798 + HW, 565.5], [971.8, 565.5]);
  W('not011', [798 + HW, 629], [936.7, 629], [936.7, 587.3], [971.8, 587.3]);
  /* INIT1 / INIT2 / INIT3 out, to OR 005 and to the THSC INITIAL block */
  W('a007', [1001.3 + HW, 374], [2018, 374]);
  W('a007', [1152, 374], [1152, 310], [1176, 310]);
  W('a007', [1152, 374], [1152, P(0)], [MX, P(0)]);
  W('a009', [1001.3 + HW, 459], [2018, 459]);
  W('a009', [1130.5, 459], [1130.5, 288.7], [1176, 288.7]);
  W('a009', [1130.5, 459], [1130.5, P(1)], [MX, P(1)]);
  W('a012', [1030.8, 543.5], [2018, 543.5]);
  W('a012', [1109, 543.5], [1109, 267.3], [1176, 267.3]);
  W('a012', [1109, 543.5], [1109, P(2)], [MX, P(2)]);
  /* LAG_ON */
  W('or005', [1234.7, 267.3], [1344.3 - HW, 267.3]);
  W('not006', [1344.3 + HW, 267.3], [1450.7, 267.3], [1450.7, 193.5], [1504 - HW, 193.5]);
  W('kMyc', [1128, 171.5], [1344.3 - HW, 171.5]);
  W('not003', [1344.3 + HW, 171.5], [1504 - HW, 171.5]);
  W('a004', [1504 + HW, 171.5], [1652, 171.5]);
  /* the stage temperatures in and out */
  ['iT1', 'iT2', 'iT3', 'iT4', 'iT5'].forEach((k, i) => WT(k, [288, P(4 + 2 * i)], [MX, P(4 + 2 * i)]));
  [
    [4, 'T1'],
    [6, 'T2'],
    [8, 'T3'],
    [10, 'T4'],
    [12, 'T5'],
    [15, 'TS']
  ].forEach(([i, n]) => WT('thsc.' + n, [MR, P(i)], [2012, P(i)]));
  /* metal temperatures, real or simulated */
  W('kSim', [460, 1086.7], [964.7, 1086.7], [964.7, P(15) + 11 - 21.5]);
  W('kSim', [826.7, 1086.7], [826.7, 1181.3], [964.7, 1181.3], [964.7, P(18) + 11 - 21.5]);
  WT('iA1a', [287, P(15) + 22], [964.7 - HW, P(15) + 22]);
  WT('iA1c', [287, 1318.7], [878.7, 1318.7], [878.7, P(15)], [964.7 - HW, P(15)]);
  WT('iA1b', [287, P(18) + 22], [964.7 - HW, P(18) + 22]);
  WT('iA2', [287, 1403.3], [900, 1403.3], [900, P(18)], [964.7 - HW, P(18)]);
  WT('asw013', [964.7 + HW, P(15)], [MX, P(15)]);
  WT('asw014', [964.7 + HW, P(18)], [MX, P(18)]);
  t.push(
    [429, 218, '(TCA100)', 1],
    [297, 242, 'THSC TRIG'],
    [297, 306, 'THSC INPUT ABNORMAL'],
    [395, 419, '(TCA103)', 1],
    [395, 504, '(TCA104)', 1],
    [629, 241, 'T', 1],
    [832, 241, 'T', 1],
    [1793, 372, 'INIT1(LOADING)'],
    [1793, 457, 'INIT2(HALF SPEED)'],
    [1791, 542, 'INIT3(OTHERS)'],
    ...[1, 2, 3, 4, 5].map(n => [293, P(2 + 2 * n) - 2, 'TH(' + n + ')N']),
    ...[1, 2, 3, 4, 5].map(n => [1791, P(2 + 2 * n) - 2, 'TH(' + n + ')']),
    [1789, P(15) - 2, 'TS_H'],
    [392, 1131, '(TCA102)', 1],
    [475, 1114, 'HP-T INNER CASING IST STG'],
    [475, 1135, 'INNER WALL MET TEMP(LOWER)'],
    [292, 1209, 'HP-T INNER CASING IST STG'],
    [292, 1231, 'OUTER WALL MET TEMP(LOWER)'],
    [292, 1295, 'SIM HP INNER WALL'],
    [292, 1316, 'MET TEMP'],
    [292, 1379, 'SIM HP OUTER WALL'],
    [292, 1400, 'MET TEMP'],
    [1329, 1319, '(LMA626)', 1],
    [1447, 1319, '(LMA626A)', 1],
    ...['T:60.0s', 'K:0.5', 'T:60.0s', 'T:60.0s', 'K:0.9', 'T:60.0s', 'K:0.7', 'T:60.0s', 'K:0.5', 'T:60.0s'].map((s, i) => [
      1192,
      Math.round(1342 + 21.33 * i),
      s
    ]),
    ...['K:0.3', 'T:60.0s', 'K:0.1'].map((s, i) => [1395, Math.round(1342 + 21.33 * i), s]),
    [226, 1529, 'CONTROLLER:'],
    [388, 1529, 'COMM+MD'],
    [633, 1502, 'TRIGGER  :Trigger-of_LOGIC_2'],
    [633, 1529, 'CYCLE(s):60']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA751',
    title: 'THERMAL STRESS(HP)',
    page: 181,
    ctl: 'COMM+MD',
    cycle: 60000,
    f: F,
    k: [
      ['kInit', 242, 172, 'INITIAL', 'ref'],
      ['k52g', 240, 374, '52G CLOSE', 'ref'],
      ['kSpd', 240, 459, 'TURBINE SPEED', 'ref'],
      ['kMyc', 895, 171.5, 'MYCTLMST', 'sys.ref'],
      ['kSim', 227, 1086.7, 'THSC SIMULATION', 'ref'],
      ['dLag', 1652, 171.5, 'LAG_ON', 'def', 'def']
    ],
    c: [
      ['iA', 'in', 'A', 265, 247, '', ['TCA103'], 0, 1],
      ['iB', 'in', 'B', 265, 311.3, '', ['TCA750'], 0, 1],
      ['iT1', 'in', '1', 261, P(4), '', ['TCA753'], 0, 1],
      ['iT2', 'in', '2', 261, P(6), '', ['TCA753'], 0, 1],
      ['iT3', 'in', '3', 261, P(8), '', ['TCA752'], 0, 1],
      ['iT4', 'in', '4', 261, P(10), '', ['TCA752'], 0, 1],
      ['iT5', 'in', '5', 261, P(12), '', ['TCA752'], 0, 1],
      ['iA1a', 'in', 'A1', 260, P(15) + 22, '', ['TCA360'], 0, 1],
      ['iA1b', 'in', 'A1', 260, P(18) + 22, '', ['TCA364'], 0, 1],
      ['iA1c', 'in', 'A1', 260, 1318.7, '', ['TCA770'], 0, 1],
      ['iA2', 'in', 'A2', 260, 1403.3, '', ['TCA770'], 0, 1],
      ['oD1', 'out', 'D1', 2045, 374, '', ['TCA755'], 0, 1],
      ['oD2', 'out', 'D2', 2045, 459, '', ['TCA755'], 0, 1],
      ['oD3', 'out', 'D3', 2045, 543.5, '', ['TCA755'], 0, 1],
      ['o1', 'out', '1', 2039, P(4), '', ['TCA753'], 0, 1],
      ['o2', 'out', '2', 2039, P(6), '', ['TCA752', 'TCA753'], 0, 4],
      ['o3', 'out', '3', 2039, P(8), '', ['TCA752'], 0, 1],
      ['o4', 'out', '4', 2039, P(10), '', ['TCA752'], 0, 1],
      ['o5', 'out', '5', 2039, P(12), '', ['TCA752'], 0, 1],
      ['oS', 'out', 'S', 2039, P(15), '', ['TCA753', 'TCA754'], 0, 1]
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
      ['ffr001', 'FFR', '001', 683, 258, [], { l: ['S', 'R'] }, [80, 43]],
      ['twA002', 'TW', 'A002', 876, 258, ['TW:180.0s']],
      ['uckA008', 'UCK', 'A008', 595.3, 470, ['K:3550.0rpm']],
      ['a007', 'A', '007', 1001.3, 385],
      ['a009', 'A', '009', 1001.3, 470],
      ['a012', 'A', '012', 1001.3, 566.5, [], {}, [59, 64]],
      ['not010', 'NOT', '010', 798, 576.5],
      ['not011', 'NOT', '011', 798, 640],
      ['or005', 'OR', '005', 1205.3, 288.3, [], {}, [58.7, 64.7]],
      ['not003', 'NOT', '003', 1344.3, 182.5],
      ['not006', 'NOT', '006', 1344.3, 278.3],
      ['a004', 'A', '004', 1504, 182.5],
      ['asw013', 'ASW', '013', 964.7, P(15) + 11],
      ['asw014', 'ASW', '014', 964.7, P(18) + 11]
    ],
    w,
    j: [
      [TWV, 396],
      [TWV, 481],
      [725.3, 374],
      [702.7, 459],
      [1152, 374],
      [1130.5, 459],
      [1109, 543.5],
      [826.7, 1086.7]
    ],
    t
  });
})();
