/* TCE114 TPC SIGNAL DIAGNOSTICS(5) (331DM09784 page 78, controller EHG+MD, cycle 30 ms; the drawing gives the number (5) to this sheet and to TCE113A).
   Typed from the drawing; units = the pixels of the page rendered 2296 wide. The scan of this page is turned a little; every place is typed as it
   stands on the page set straight.
   The turbine trip and reset push buttons of the operator station (with CRT AVAILABLE) out to the three protection controllers, the lamps
   TRIPD and RESET from TURBINE TRIP, and three signals passed on to the protection controllers. The sheets of the output connectors stand in
   one row under them, in the order the drawing prints them. The title block of this page prints PAGE 76; it is page 78 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  const P1 = ['TCP1121', 'TCP2121', 'TCP3121'],
    P0 = ['TCP1120', 'TCP2120', 'TCP3120'],
    out = (k, l, x, y, refs) => [k, 'out', l, x, y, '', refs, 1, 2],
    mk = (no, x, y) => ['b' + no, 'o:BTR', no, x, y];
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'TCE114',
    title: 'TPC SIGNAL DIAGNOSTICS(5)',
    page: 78,
    ctl: 'EHG+MD',
    cycle: 30,
    f: [182, 84, 2230, 1546],
    /* live: the engine's state of the signals named on this sheet (tcs.js tcsLiveRead) */
    live: { kTrip: 'trip' },
    k: [
      ['kInit', 1353, 183, 'INITIAL', 'ref'],
      ['kTrip', 372, 638, 'TURBINE TRIP', 'ref']
    ],
    d: [
      ['dIys', 435, 297, 'in', 'TCE114_1_IYS', 'R', '#1C'],
      ['dTrip', 435, 350, 'in', 'TCE114_1_TRIP', 'R', '#1C'],
      ['dRset', 434, 490, 'in', 'TCE114_1_RSET', 'R', '#1C'],
      ['crtIyp', 2013, 183, 'out', 'TCE114_1_IYP', 'S', '#1C'],
      ['crtTrpd', 1177, 638, 'out', 'TCE114_1_TRPD', 'S', '#1C'],
      ['crtRstd', 1168, 734, 'out', 'TCE114_1_RSTD', 'S', '#1C']
    ],
    c: [
      ['c1', 'in', 'C', 400, 1010, 'TURBINE AUTO RESET COMMAND', ['TCA580'], 1],
      ['c2', 'in', 'C', 399, 1116, 'TURBINE SHUT-DOWN COMMAND', ['TCA587'], 1],
      ['c3', 'in', 'C1', 400, 1222, 'EOS OPERATED', ['TCA781'], 1],
      out('oA3', 'A3', 1157, 297, ['TCP2121', 'TCP3121', 'TCP1121']),
      out('oA1', 'A1', 1157, 436, P1),
      out('oA2', 'A2', 1138, 1010, P1),
      out('oA4', 'A4', 1138, 1116, P0),
      out('oA5', 'A5', 1138, 1222, P0)
    ],
    b: [
      ['a008', 'A', '008', 709, 308],
      ['a010', 'A', '010', 709, 447],
      ['not012', 'NOT', '012', 773, 745],
      mk('011', 1773, 183),
      mk('003', 870, 297),
      mk('001', 870, 436),
      mk('007', 933, 638),
      mk('009', 923, 734),
      mk('002', 849, 1010),
      mk('013', 849, 1116),
      mk('014', 849, 1222)
    ],
    w: [
      ['kInit', [[1587, 183], [1978, 183]]],
      /* CRT AVAILABLE with TRIP, and with RESET */
      ['dIys', [[470, 297], [680, 297]]],
      ['dIys', [[624, 297], [624, 436], [680, 436]]],
      ['dTrip', [[470, 350], [656, 350], [656, 319], [680, 319]]],
      ['a008', [[738, 297], [1130, 297]]],
      ['dRset', [[469, 490], [656, 490], [656, 458], [680, 458]]],
      ['a010', [[738, 436], [1130, 436]]],
      /* the lamps */
      ['kTrip', [[606, 638], [1142, 638]]],
      ['kTrip', [[665, 638], [665, 734], [744, 734]]],
      ['not012', [[802, 734], [1133, 734]]],
      /* passed on */
      ['c1', [[427, 1010], [1111, 1010]]],
      ['c2', [[426, 1116], [1111, 1116]]],
      ['c3', [[427, 1222], [1111, 1222]]]
    ],
    t: [
      [1496, 215, '(TCE050)'],
      [466, 291, 'CRT AVAILABLE'],
      [466, 344, 'TRIP'],
      [464, 484, 'RESET'],
      [959, 291, 'TRIP'],
      [957, 430, 'RESET'],
      [1012, 632, 'TRIPD'],
      [1012, 728, 'RESET'],
      [247, 1523, 'CONTROLLER:'],
      [408, 1523, 'EHG+MD'],
      [670, 1499, 'TRIGGER  :'],
      [670, 1526, 'CYCLE(ms):30']
    ]
  });
})();
