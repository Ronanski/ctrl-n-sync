/* TCA685 HP TURBINE WARMING VALVE (TC-20) (331DM09788 page 167, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the
   pixels of the page rendered 2296 wide. The motor valve nMV-ASn011 (AUXILIARY TYPE 15 A002, LMA584A / B): trip oil pressure low,
   condenser vacuum low, the program control start and the open command of the HP turbine warming start group, the close command,
   the open / close simulation, ON(1), the full open / full close positions, torque switches, position (analog) and electrical trouble
   in. The permissive = AUX SYSTEM HEADER PRESS. (LOWER) above CMP A033 (HL 7.0 / LL 6.0 kg/cm2g, INITIAL on its top), to PIN06 and
   out. OPEN / CLOSE SIGNAL, AUTO, PROGRAM CONTROL, OPEN, CLOSE, FULL OPEN, FULL CLOSE, ELEC TROUBLE, TORQUE SW OPEN / CLOSE and
   POS.SIM out.
   The words are the ones of the drawing (VALVEOPEN SIM, VALVECLOSE SIM as printed). The tag keeps the small n of the drawing (the unit
   number).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    b = [],
    w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const F = [168, 88, 2222, 1550],
    u = (F[2] - F[0]) / 1000,
    MX = 1295,
    MR = 1697,
    TOP = 223,
    H = 860,
    P = i => TOP + 15 * u + ((i + 0.5) * (H - 30 * u)) / 25,
    BX = 1228;
  /* inputs: [key, letter, sheet, x of the connector, y, words, pin row, BTR, x of the jog] */
  [
    ['iC1', 'C1', 'TCA536', 280.5, P(2), ['CONDENSER VACUUM LOW'], 2, '004'],
    ['iA6', 'A6', 'TCA632', 280.3, P(4), ['PROGRAM CONTROL START COMMAND', 'FROM HP TURBINE WARMING START'], 4, '006'],
    ['iA3', 'A3', 'TCA632', 280, P(6), ['OPEN COMMAND FROM HP TURBINE', 'WARMING START GROUP CONTROL'], 6, '007'],
    ['iC', 'C', 'TCA633', 279.5, P(8), ['HP TURBINE WARMING VALVE CLOSE COMMAND'], 8, '009'],
    ['iB', 'B', 'TCA686', 278.5, P(12), ['HP TURBINE WARMING VALVECLOSE SIM'], 12, '013'],
    ['iA5', 'A5', 'TCA044', 278, P(16), ['HP TURBINE WARMING VALVE', 'FULL OPEN POSITION'], 16, '020'],
    ['iA4', 'A4', 'TCA044', 278, P(18), ['HP TURBINE WARMING VALVE', 'FULL CLOSE POSITION'], 18, '021'],
    ['iA14', 'A14', 'TCA044', 277.5, P(20), ['HP TURBINE WARMING VALVE', 'TORQUE OPEN'], 20, '023'],
    ['iA15', 'A15', 'TCA044', 277.5, 962.3, ['HP TURBINE WARMING VALVE', 'TORQUE CLOSE'], 22, '028', 1192.8],
    ['iA6b', 'A6', 'TCA047', 277, 1058.6, ['HP TURBINE WARMING VALVE', 'ELECTRICAL TROUBLE'], 24, '030', 1192.8]
  ].forEach(([key, l, sh, cx, y, names, row, btr, jx]) => {
    c.push([key, 'in', l, cx, y, '', [sh]]);
    names.forEach((s, i) => t.push([cx + 44, y - 11 - 21 * (names.length - 1 - i), s]));
    b.push(['btr' + btr, 'o:BTR', btr, BX, P(row)]);
    if (jx) W(key, [cx + 27, y], [jx, y], [jx, P(row)], [MX, P(row)]);
    else W(key, [cx + 27, y], [MX, y]);
  });
  /* open simulation: A (TCA686) jogs down to OPEN.S */
  c.push(['iA', 'in', 'A', 279, 590.7, '', ['TCA686']]);
  t.push([323, 579.7, 'HP TURBINE WARMING VALVEOPEN SIM']);
  W('iA', [306, 590.7], [1070.7, 590.7], [1070.7, P(11)], [MX, P(11)]);
  b.push(['btr012', 'o:BTR', '012', 1165, P(11)]);
  /* position (analog, thick) */
  c.push(['iA4p', 'in', 'A4', 277, P(23), '', ['TCA322']]);
  w.push(['iA4p', [[304, P(23)], [MX, P(23)]], 1]);
  b.push(['ftr032', 'o:FTR', '032', BX, P(23)]);
  /* trip oil pressure low and ON(1) */
  W('kTrip', [518.5, P(0)], [MX, P(0)]);
  b.push(['btr001', 'o:BTR', '001', BX, P(0)]);
  W('kOn', [526.6, P(14)], [MX, P(14)]);
  b.push(['btr016', 'o:BTR', '016', BX, P(14)]);
  /* the permissive: aux system header pressure above CMP A033, to PIN06 and out */
  c.push(['iA2', 'in', 'A2', 276.6, 1248.5, '', ['TCA316']]);
  t.push([320, 1237.5, 'AUX SYSTEM HEADER PRESS. (LOWER)']);
  w.push(['iA2', [[303.6, 1248.5], [1206, 1248.5]], 1]);
  W('kInit', [524.4, 1121.4], [1235, 1121.4], [1235, 1237.5]);
  W('cmp033', [1264, 1248.5], [2059, 1248.5]);
  W('cmp033', [1363, 1248.5], [1363, 1100], [1110, 1100], [1110, P(10)], [MX, P(10)]);
  b.push(
    ['btr010', 'o:BTR', '010', BX, P(10)],
    ['cmp033', 'CMP', 'A033', 1235, 1259.2],
    ['btr031', 'o:BTR', '031', 1734, 1248.5]
  );
  t.push([1196, 1240, 'T', 2], [1205, 1301, 'HL:7.0kg/cm2g'], [1205, 1322, 'LL:6.0kg/cm2g']);
  /* out: [pin row, pin, key, letter, sheets, x of the connector, y, BTR, x of the BTR, x of the riser, words, x of the words] */
  [
    [0, 'OPEN', 'oA', 'A', ['TCA686'], 2093.5, P(0), '003', 1774, 0, ['VALVE OPEN SIGNAL'], 1843],
    [3, 'CLOSE', 'oB', 'B', ['TCA686'], 2093, P(3), '005', 1773, 0, ['VALVE CLOSE SIGNAL'], 1843],
    [7, 'OUT1', 'oC', 'C', ['TCA631', 'TCA686'], 2092, P(7), '008', 1772, 0, ['VALVE AUTO'], 1842],
    [10, 'OUT2', 'oD', 'D', ['TCA632', 'TCA686'], 2090, P(10), '011', 1770, 0, ['VALVE PROGRAM CONTROL'], 1841],
    [12, 'PIN61', 'oE', 'E', ['-'], 2089, P(12), '014', 1770, 0, ['VALVE OPEN'], 1840],
    [13, 'PIN62', 'oF', 'F', ['-'], 2089, 718.3, '015', 1739, 1801.7, ['VALVE CLOSE'], 1840],
    [14, 'PIN64', 'oG', 'G', ['-'], 2089, 781.7, '017', 1770, 1791, ['VALVE FULL OPEN'], 1839],
    [15, 'PIN65', 'oH', 'H', ['TCA500', 'TCA633'], 2088.5, 845, '019', 1739, 1779.3, ['VALVE FULL CLOSE'], 1839],
    [19, 'E.TR', 'oK', 'K', ['TCA686'], 2087.5, 982.7, '022', 1739, 1800, ['VALVE ELEC TROUBLE'], 1837],
    [20, 'TSO', 'oL', 'L', ['TCA686'], 2087, 1047.3, '024', 1769, 1789, ['VALVE TORQUE SW OPEN'], 1836],
    [21, 'TSC', 'oM', 'M', ['TCA686'], 2086.5, 1110.7, '027', 1739, 1778.3, ['VALVE TORQUE SW CLOSE'], 1836]
  ].forEach(([row, pin, key, l, sh, cx, y, btr, bx, rx, words, tx0]) => {
    c.push([key, 'out', l, cx, y, '', sh]);
    b.push(['btr' + btr, 'o:BTR', btr, bx, P(row)]);
    if (rx) W('aux.' + pin, [MR, P(row)], [rx, P(row)], [rx, y], [cx - 27, y]);
    else W('aux.' + pin, [MR, P(row)], [cx - 27, y]);
    t.push([tx0, y - 28, 'HP TURBINE WARMING'], [tx0, y - 7, words[0]]);
  });
  /* full close also to the other controller (J, double outline) */
  c.push(['oJ', 'out', 'J', 2088, 909.3, '', ['TCE360'], 1]);
  W('aux.PIN65', [1811, 845], [1811, 909.3], [2061, 909.3]);
  b.push(['btr025', 'o:BTR', '025', 1832, 909.3]);
  t.push([1850, 881.3, 'HP TURBINE WARMING'], [1850, 902.3, 'VALVE FULL CLOSE']);
  /* position simulation (analog, thick) */
  c.push(['oP', 'out', 'P', 2086, 1175, '', ['TCA322', 'TCA777']]);
  w.push(['aux.PIN66', [[MR, P(23)], [1767.7, P(23)], [1767.7, 1175], [2059, 1175]], 1]);
  b.push(['ftr029', 'o:FTR', '029', 1736, P(23)]);
  t.push([1836, 1147, 'HP TURBINE WARMING'], [1836, 1168, 'VALVE POS.SIM']);
  /* permissive out */
  c.push(['oN', 'out', 'N', 2086, 1248.5, '', ['TCA631', 'TCA686']]);
  t.push([1836, 1220.5, 'HP TURBINE WARMING'], [1836, 1241.5, 'PERMISSIVE']);
  t.push(
    [466, 298, '(TCA103)', 1],
    [460, 1161, '(TCA100)', 1],
    [232, 1526, 'CONTROLLER:'],
    [392, 1526, 'COMM+MD'],
    [617, 1499, 'TRIGGER  :'],
    [617, 1526, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA685',
    title: 'HP TURBINE WARMING VALVE (TC-20)',
    page: 167,
    ctl: 'COMM+MD',
    cycle: 100,
    f: F,
    k: [
      ['kTrip', 285.5, P(0), 'TRIP PRESS.LOW', 'ref'],
      ['kOn', 293.6, P(14), 'ON(1)', 'sys.ref'],
      ['kInit', 291.4, 1121.4, 'INITIAL', 'ref']
    ],
    c,
    m: [
      [
        'aux',
        'AUXILIARY TYPE 15',
        'nMV-ASn011',
        MX,
        TOP,
        MR - MX,
        H,
        ['PIN01', '', 'PIN02', '', 'PIN03', '', 'PIN04', '', 'PIN05', '', 'PIN06', 'OPEN.S', 'CLSE.S', '', 'PIN15', '', 'PIN11', '',
          'PIN12', '', 'PIN13', '', 'PIN14', 'POS', 'PIN21'],
        ['OPEN', '', '', 'CLOSE', '', 'ABN', '', 'OUT1', '', '', 'OUT2', '', 'PIN61', 'PIN62', 'PIN64', 'PIN65', '', '', '', 'E.TR',
          'TSO', 'TSC', '', 'PIN66', ''],
        'A002',
        [
          [1393, 1103, '(LMA584A)'],
          [1510, 1103, '(LMA584B)'],
          ...['K:99.0%', 'R :1.0', 'M :10', 'HL:100.0', 'LL:0.0', 'K:1.0%', 'K:0.0%'].map((s, i) => [1414, Math.round(849 + 21.3 * i), s])
        ]
      ]
    ],
    b,
    w,
    j: [
      [1811, 845],
      [1363, 1248.5]
    ],
    t
  });
})();
