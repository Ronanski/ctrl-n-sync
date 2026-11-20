/* TCA650 STEAM SEEL FEED INLET VALVE (TC-31) (331DM09788 page 164, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the
   pixels of the page rendered 2296 wide. The motor valve nMV-GSn030 (POSITION (SEAL-IN) C021, LMA594C / D): auto open by the open command
   of the gland seal start group (B1 of TCA637), auto close by the stop group control in progress (A3 of TCA638), with its electrical
   trouble, open / close and torque switches in; OPEN / CLOSE COMMAND, OPENED, CLOSED and AUTO out.
   The words are the ones of the drawing (SEEL in the title, GRAND, as printed). The tag keeps the small n of the drawing (the unit number).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    b = [],
    w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const MX = 1272,
    MR = 1676;
  /* the inputs: [key, letter, sheet, x of the connector, y, words, BTR, x of the riser, y of the pin] */
  [
    ['iB1', 'B1', 'TCA637', 343, 304, ['OPEN COMMAND FROM TURBINE GRAND', 'SEAL START GROUP COMMAND'], '014', 0, 304],
    ['iA3', 'A3', 'TCA638', 342, 399, ['TURBINE GLAND SEAL STOP', 'GROUP CONTROL IN PROGRESS'], '016', 867, 336],
    ['iA7', 'A7', 'TCA049', 341, 516, ['STEAM SEAL FEED VALVE', 'MOTOR ELECTRICAL TROUBLE'], '018', 908, 400],
    ['iA6', 'A6', 'TCA049', 339, 645, ['STEAM SEAL FEED INLET VALVE', 'OPEN'], '019', 950, 432],
    ['iA12', 'A12', 'TCA049', 338, 750, ['STEAM SEAL FEED INLET VALVE', 'TORQUE SW OPEN'], '023', 1003, 464],
    ['iA5', 'A5', 'TCA049', 337, 878, ['STEAM SEAL FEED INLET VALVE', 'CLOSE'], '024', 1055, 528],
    ['iA13', 'A13', 'TCA049', 336, 984, ['STEAM SEAL FEED INLET VALVE', 'TORQUE SW CLOSE'], '025', 1119, 560]
  ].forEach(([key, l, sh, cx, y, names, btr, rx, py]) => {
    c.push([key, 'in', l, cx, y, '', [sh]]);
    names.forEach((s, i) => t.push([cx + 33, y - 12 - 21 * (names.length - 1 - i), s]));
    b.push(['btr' + btr, 'o:BTR', btr, 1175, py]);
    if (rx) W(key, [cx + 27, y], [rx, y], [rx, py], [MX, py]);
    else W(key, [cx + 27, y], [MX, py]);
  });
  /* out: [pin, key, letter, sheets, x of the connector, y, BTR, x of the riser, words] */
  [
    ['OPS', 'oA1', 'A1', ['TCA830'], 2091, 304, '020', 0, 'OPEN COMMAND'],
    ['CLS', 'oA2', 'A2', ['TCA830'], 2090, 391, '026', 1696, 'CLOSE COMMAND'],
    ['LTOP', 'oB1', 'B1', ['TCA637', 'TCA740'], 2088, 477, '027', 1700, 'OPENED'],
    ['LTCL', 'oB2', 'B2', ['TCA638', 'TCA830'], 2087, 574, '028', 1700, 'CLOSED'],
    ['AUTO', 'oC1', 'C1', ['TCA639'], 2086, 690, '029', 1693, 'AUTO']
  ].forEach(([pin, key, l, sh, cx, y, btr, rx, s], i) => {
    const py = { OPS: 304, CLS: 368, LTOP: 432, LTCL: 496, AUTO: 592 }[pin];
    c.push([key, 'out', l, cx, y, '', sh]);
    b.push(['btr' + btr, 'o:BTR', btr, 1737, y]);
    if (rx) W('vlv.' + pin, [MR, py], [rx, py], [rx, y], [cx - 27, y]);
    else W('vlv.' + pin, [MR, py], [cx - 27, py]);
    t.push([1797, y - 29, 'STEAM SEAL FEED INLET VALVE'], [1797, y - 8, s]);
  });
  t.push(
    [232, 1526, 'CONTROLLER:'],
    [392, 1526, 'COMM+MD'],
    [617, 1499, 'TRIGGER  :'],
    [617, 1526, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA650',
    title: 'STEAM SEEL FEED INLET VALVE (TC-31)',
    page: 164,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [178, 90, 2232, 1548],
    k: [],
    c,
    m: [
      [
        'vlv',
        'POSITION (SEAL-IN)',
        'nMV-GSn030',
        MX,
        257,
        MR - MX,
        384,
        ['AOP', 'ACL', '', 'EF', 'LTOP', 'TROP', '', 'LTCL', 'TRCL', ''],
        ['OPS', '', 'CLS', '', 'LTOP', '', 'LTCL', '', 'ABN', 'AUTO'],
        'C021',
        [
          [1371, 660, '(LMA594C)'],
          [1488, 660, '(LMA594D)'],
          ...[
            'TD:5.0s',
            'TD:5.0s',
            'TP:35.0s',
            'TP:35.0s',
            'R :20.0',
            'M :1',
            'HL:100.0',
            'LL:0.0',
            'K:99.0%',
            'TP:5.0s'
          ].map((s, i) => [1273, Math.round(682 + 21.5 * i), s]),
          [1475, 682, 'K:0.0%'],
          [1475, 703, 'K:1.0%'],
          [1475, 725, 'TP:5.0s']
        ]
      ]
    ],
    b,
    w,
    j: [],
    t
  });
})();
