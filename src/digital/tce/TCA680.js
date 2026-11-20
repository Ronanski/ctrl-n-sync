/* TCA680 GLAND STEAM EXHAUSTER (TC-28) (331DM09788 page 166, controller COMM+MD, cycle 30 ms). Typed from the drawing; units = the
   pixels of the page rendered 2296 wide. The motor (MOTOR STANDARD B013, LMA580A / B; the drawing prints TCA680 over it): auto start by
   the gland seal start group (B1 of TCA636), auto stop by the stop group (B1 of TCA638), trip held at OFF(0), electrical trouble and
   running in; START COMMAND (TCA833), RUNNING (TCA637, TCA638, TCA738) and AUTO (TCA639) out.
   The words are the ones of the drawing (GRAND, SART as printed).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const MX = 1238,
    MR = 1645,
    P = [290.1, 322.3, 354.5, 386.7, 418.9];
  /* in */
  W('iB1s', [337, P[0]], [MX, P[0]]);
  W('iB1p', [337, 401], [865, 401], [865, P[1]], [MX, P[1]]);
  W('kOff', [483, 516], [908, 516], [908, P[2]], [MX, P[2]]);
  W('iA11', [325.5, 678], [961, 678], [961, P[3]], [MX, P[3]]);
  W('iA12', [325.5, 826], [1004, 826], [1004, P[4]], [MX, P[4]]);
  /* out */
  W('mtr.STS', [MR, P[0]], [2075.5, P[0]]);
  W('mtr.RUN', [MR, P[1]], [1771, P[1]], [1771, 470.5], [2084, 470.5]);
  W('mtr.AUTO', [MR, P[3]], [1675, P[3]], [1675, 513], [1755, 513], [1755, 629.5], [2082.5, 629.5]);
  t.push(
    [343, 263, 'START COMMAND FROM TURBINE GRAND'],
    [343, 284, 'SEAL SART GROUP CONTROL'],
    [343, 370, 'STOP COMMAND FROM TURBINE GRAND'],
    [343, 391, 'SEAL STOP GROUP CONTROL'],
    [331, 647, 'GLAND STEAM EXHAUSTER'],
    [331, 668, 'MOTOR ELECTRICAL TROUBLE'],
    [331, 795, 'GLAND STEAM EXHAUSTER'],
    [331, 817, 'RUNNING'],
    [1799, 261, 'GLAND STEAM EXHAUSTER'],
    [1799, 282, 'START COMMAND'],
    [1799, 432, 'GLAND STEAM EXHAUSTER'],
    [1799, 452, 'RUNNING'],
    [1786, 591, 'GLAND STEAM EXHAUSTER'],
    [1786, 612, 'AUTO'],
    [236, 1529, 'CONTROLLER:'],
    [396, 1529, 'COMM+MD'],
    [619, 1507, 'TRIGGER  :'],
    [619, 1529, 'CYCLE(ms):30']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA680',
    title: 'GLAND STEAM EXHAUSTER(TC-28)',
    page: 166,
    ctl: 'COMM+MD',
    cycle: 30,
    f: [166, 84, 2220, 1552],
    k: [['kOff', 250, 516, 'OFF(0)', 'sys.ref']],
    c: [
      ['iB1s', 'in', 'B1', 310, P[0], '', ['TCA636']],
      ['iB1p', 'in', 'B1', 310, 401, '', ['TCA638']],
      ['iA11', 'in', 'A11', 298.5, 678, '', ['TCA048']],
      ['iA12', 'in', 'A12', 298.5, 826, '', ['TCA048']],
      ['oA1', 'out', 'A1', 2102.5, P[0], '', ['TCA833']],
      ['oB1', 'out', 'B1', 2111, 470.5, '', ['TCA637', 'TCA638', 'TCA738']],
      ['oC1', 'out', 'C1', 2109.5, 629.5, '', ['TCA639']]
    ],
    m: [
      [
        'mtr',
        'MOTOR STANDARD',
        'TCA680',
        MX,
        243,
        MR - MX,
        223,
        ['ASRT', 'ASTP', 'TRP', 'EF', 'RUN'],
        ['STS', 'RUN', 'STP', 'AUTO', 'ABN'],
        'B013',
        [
          [1343, 487, '(LMA580A)'],
          [1460, 487, '(LMA580B)'],
          ...['TD:1.0s', 'TP:3.0s', 'TP:3.0s', 'TP:0.5s'].map((s, i) => [1243, Math.round(511 + 21.5 * i), s])
        ]
      ]
    ],
    b: [
      ['btr014', 'o:BTR', '014', 1143, P[0]],
      ['btr016', 'o:BTR', '016', 1143, P[1]],
      ['btr017', 'o:BTR', '017', 1143, P[2]],
      ['btr018', 'o:BTR', '018', 1143, P[3]],
      ['btr019', 'o:BTR', '019', 1143, P[4]],
      ['btr020', 'o:BTR', '020', 1707, P[0]],
      ['btr021', 'o:BTR', '021', 1707, P[1]],
      ['btr022', 'o:BTR', '022', 1707, 513]
    ],
    w,
    j: [],
    t
  });
})();
