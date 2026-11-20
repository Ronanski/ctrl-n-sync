/* TCE113A TPC SIGNAL DIAGNOSTICS(5) (331DM09784 page 77, controller EHG+MD, cycle 30 ms). Typed from the drawing; the places are those of the sheets of
   the digital input diagnostics (tce/_lib.js, TCE_LIB.did, as on TCE075), with the page set straight.
   Only the first block reads a signal: TURBINE TRIP from the three protection controllers, out to a lamp and to connectors A and A2; its
   discrepancy has a lamp ("TRIP COMMAND DICREPANCY", typed as the drawing prints it) and no connector. The other three blocks read the constant
   OFF(0); their OUT is left open and their discrepancy goes only to the OR. The title block of this page prints PAGE 75; it is page 77 of the
   document. */
(function () {
  if (typeof window === 'undefined') return;
  const F = [180, 75, 2232, 1535],
    u = (F[2] - F[0]) / 1000,
    BX = 866,
    BW = 407,
    BH = 226,
    XR = BX + BW,
    TOPS = [103, 391, 668, 976],
    NO = ['031', '009', '016', '023'],
    IM = [['001', '004', '032'], ['008', '011', '033'], ['015', '018', '034'], ['022', '025', '035']],
    pin = (top, i) => Math.round(top + 15 * u + (i + 0.5) * ((BH - 30 * u) / 5)),
    /* the OR of the four discrepancies: its inputs, top to bottom, and where each line comes down */
    OY = [1141, 1161, 1182, 1204],
    OX = [1485, 1432, 1379, 1303],
    c = [],
    k = [],
    b = [],
    m = [],
    w = [];
  TOPS.forEach((top, g) => {
    const key = 'tid' + (g + 1),
      p = i => pin(top, i);
    m.push([key, 'TRIPPLE INPUT DIAGNOSTICS', '', BX, top, BW, BH, ['IN1', '', 'IN2', '', 'IN3'], ['OUT', '', '', '', 'DEV E'], NO[g], [
      [BX + 90, top + 172, 'TP:3.0'],
      [BX + 105, top + 246, '(LME105)']
    ]]);
    [0, 1, 2].forEach(i => {
      const y = p(2 * i),
        s = 'i' + (g + 1) + (i + 1);
      if (g === 0) {
        c.push([s, 'in', 'A1', 280, y, 'TURBINE TRIP', ['TCP' + (i + 1) + '121'], 1]);
        w.push([s, [[307, y], [BX, y]]]);
      } else {
        k.push([s, 216, y, 'OFF(0)', 'sys.ref']);
        w.push([s, [[450, y], [BX, y]]]);
      }
      b.push(['mi' + (g + 1) + (i + 1), 'o:BTR', IM[g][i], 709, y]);
    });
    /* the discrepancy: down to the OR */
    w.push([key + '.DEV E', [[XR, p(4)], [OX[g], p(4)], [OX[g], OY[g]], [1540, OY[g]]]]);
  });
  const y0 = pin(TOPS[0], 0);
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'TCE113A',
    title: 'TPC SIGNAL DIAGNOSTICS(5)',
    page: 77,
    ctl: 'EHG+MD',
    cycle: 30,
    f: F,
    /* live: the engine's state of the signals named on this sheet (tcs.js tcsLiveRead) */
    live: { i11: 'trip', i12: 'trip', i13: 'trip' },
    k,
    c: [
      ...c,
      ['oA', 'out', 'A', 2103, y0 + 64, '', ['TCA825'], 1],
      ['oA2', 'out', 'A2', 2092, y0 + 162, '', ['TCE053'], 0, 1],
      ['oE', 'out', 'E', 2102, OY[0], '', ['-']]
    ],
    d: [
      ['crt1', 2105, y0, 'out', 'TCE113A_1', 'S', '#1C'],
      ['crt2', 2105, 416, 'out', 'TCE113A_2', 'S', '#1C']
    ],
    m,
    b: [
      ...b,
      ['mo1', 'o:BTR', '003', 1657, y0],
      ['mo2', 'o:BTR', '005', 1657, y0 + 64],
      ['mo3', 'o:BTR', '036', 1647, y0 + 162],
      ['mo4', 'o:BTR', '037', 1647, 416],
      ['or', 'OR', '027', 1569, 1172, [], {}, [58, 85]],
      ['mor', 'o:BTR', '028', 1656, OY[0]]
    ],
    w: [
      ...w,
      ['tid1.OUT', [[XR, y0], [2070, y0]]],
      ['tid1.OUT', [[1539, y0], [1539, y0 + 162], [2065, y0 + 162]]],
      ['tid1.OUT', [[1539, y0 + 64], [2076, y0 + 64]]],
      ['tid1.DEV E', [[OX[0], 416], [2070, 416]]],
      ['or', [[1598, OY[0]], [2075, OY[0]]]]
    ],
    t: [
      [1716, y0 - 6, 'TURBINE TRIP'],
      [1716, y0 + 58, 'TURBINE TRIP'],
      [1736, y0 + 156, 'TURBINE TRIP'],
      [1736, 410, 'TRIP COMMAND DICREPANCY'],
      [1714, OY[0] - 6, 'DISCREPANCY'],
      [247, 1512, 'CONTROLLER:'],
      [408, 1512, 'EHG+MD'],
      [670, 1485, 'TRIGGER  :'],
      [670, 1512, 'CYCLE(ms):30']
    ]
  });
})();
