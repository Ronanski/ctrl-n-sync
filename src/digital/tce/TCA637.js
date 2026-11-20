/* TCA637 TURBINE GLAND SEAL GROUP CONTROL (TE-6,7) (331DM09788 page 161, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide.
   The steps of the gland seal start group control (A of TCA636 = start group control in progress):
   - A 001 = in progress and the gland steam line drain valve full opened (OR 021, held by A 001 itself through the loop mark);
     not yet (NOT 004) with in progress gives the DRAIN VALVE FULL OPEN COMMAND (A 002).
   - A 005 = drain valve opened and the gland steam exhauster running; A 006 with in progress starts TP 007 (300.0 s, cleared by
     INITIAL) = DRAIN VALVE FULL CLOSE COMMAND.
   - A 022 = drain valve full close and the opened step; TP 011 (10.0, cleared by INITIAL) with in progress (A 009) = OPEN COMMAND of
     the steam seal feed inlet valve (TCA650).
   - A 012 = exhauster running, drain valve full close and steam seal feed inlet valve opened = START GROUP CONTROL COMPLETE (to TCA636,
     the operator station and TCT081B).
   - TP 016 (480.0 s from in progress, cleared by INITIAL) without complete (NOT 019, A 017) = START GROUP CONTROL TROUBLE.
   The words are the ones of the drawing (GRAND as printed; TP:10.0 without a unit, as printed).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  /* INITIAL clears the three timers */
  W('kInit', [445, 153], [1359, 153], [1359, 538]);
  W('kInit', [741, 153], [741, 441], [866, 441], [866, 655], [907, 655], [907, 675]);
  W('kInit', [866, 632], [1203, 632], [1203, 1099]);
  /* in progress */
  W('iA', [339, 293], [838, 293]);
  W('iA', [686, 293], [686, 557], [746, 557], [746, 1110], [1172, 1110]);
  W('iA', [782, 293], [782, 250], [1135, 250], [1135, 293], [1169, 293]);
  W('iA', [782, 293], [782, 666], [1006, 666]);
  W('iA', [782, 569], [1167, 569]);
  /* drain valve full opened, held by A 001 */
  W('iA7', [338, 399], [570, 399]);
  W('or021', [630, 399], [805, 399], [805, 314], [838, 314]);
  W('a001', [897, 293], [910, 293], [910, 314], [999, 314]);
  W('a001', [920, 314], [920, 485], [1008, 485]);
  W('a001', [920, 485], [536, 485], [536, 420], [570, 420]);
  W('a001', [652, 485], [652, 707], [782, 707]);
  W('not004', [1058, 314], [1169, 314]);
  W('a002', [1228, 293], [2000, 293]);
  /* exhauster running, close step */
  W('iB1x', [338, 506], [1008, 506]);
  W('iB1x', [631, 506], [631, 835], [844, 835]);
  W('a005', [1067, 485], [1125, 485], [1125, 548], [1167, 548]);
  W('a006', [1226, 548], [1325, 548]);
  W('tp007', [1385, 548], [1998, 548]);
  /* full close, open command of the feed inlet valve */
  W('iA10', [336, 686], [782, 686]);
  W('iA10', [715, 686], [715, 856], [844, 856]);
  W('a022', [840, 686], [877, 686]);
  W('tp011', [936, 686], [1006, 686]);
  W('a009', [1065, 666], [1996, 666]);
  /* complete and trouble */
  W('iB1f', [334, 877], [844, 877]);
  W('a012', [903, 835], [2017, 835]);
  W('a012', [958, 835], [958, 1207], [1171, 1207]);
  W('a012', [1637, 835], [1637, 1005], [2015, 1005]);
  W('a012', [1637, 921], [2008, 921]);
  W('tp016', [1230, 1110], [1322, 1110]);
  W('not019', [1230, 1207], [1310, 1207], [1310, 1132], [1322, 1132]);
  W('a017', [1380, 1110], [2014, 1110]);
  W('a017', [1637, 1110], [1637, 1207], [2005, 1207]);
  t.push(
    [345, 262, 'TURBINE GLAND SEAL START'],
    [345, 283, 'GROUP CONTROL IN PROGRESS'],
    [345, 347, 'TURBINE GLAND STEAM LINE'],
    [345, 368, 'DRAIN VALVE FULL OPENED'],
    [280, 453, 'GLAND STEAM EXHAUSTER'],
    [280, 474, 'RUNNING'],
    [341, 655, 'TURBINE GLAND STEAM LINE'],
    [341, 676, 'DRAIN VALVE FULL CLOSE'],
    [340, 846, 'STEAM SEAL FEED INLET'],
    [340, 868, 'VALVE OPENED'],
    [1693, 245, 'TURBINE GLAND STEAM LINE'],
    [1693, 266, 'DRAIN VALVE FULL OPEN COMMAND'],
    [1702, 500, 'TURBINE GLAND STEAM LINE'],
    [1702, 521, 'DRAIN VALVE FULL CLOSE COMMAND'],
    [1700, 628, 'OPEN COMMAND FROM TURBINE GRAND'],
    [1700, 649, 'SEAL START GROUP COMMAND'],
    [1720, 808, 'TURBINE GLAND SEAL START'],
    [1720, 830, 'GROUP CONTROL COMPLETE'],
    [1718, 1084, 'TURBINE GLAND SEAL START'],
    [1718, 1105, 'GROUP CONTROL TROUBLE'],
    [1317, 536, 'T', 2],
    [869, 674, 'T', 2],
    [1164, 1098, 'T', 2],
    [335, 194, '(TCA100)'],
    [230, 1526, 'CONTROLLER:'],
    [391, 1526, 'COMM+MD'],
    [614, 1499, 'TRIGGER  :'],
    [614, 1526, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA637',
    title: 'TURBINE GLAND SEAL GROUP CONTROL (TE-6,7)',
    page: 161,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [165, 88, 2212, 1548],
    k: [['kInit', 212, 153, 'INITIAL', 'ref']],
    c: [
      ['iA', 'in', 'A', 312, 293, '', ['TCA636']],
      ['iA7', 'in', 'A7', 311, 399, '', ['TCA051']],
      ['iB1x', 'in', 'B1', 311, 506, '', ['TCA680']],
      ['iA10', 'in', 'A10', 309, 686, '', ['TCA042']],
      ['iB1f', 'in', 'B1', 307, 877, '', ['TCA650']],
      ['oA1', 'out', 'A1', 2027, 293, '', ['TCA830']],
      ['oA2', 'out', 'A2', 2025, 548, '', ['TCA830']],
      ['oB1', 'out', 'B1', 2023, 666, '', ['TCA650']],
      ['oB2', 'out', 'B2', 2044, 835, '', ['TCA636']],
      ['oC1', 'out', 'C1', 2042, 1005, '', ['TCT081B'], 1],
      ['oB3', 'out', 'B3', 2041, 1110, '', ['-']]
    ],
    d: [
      ['crtIpc', 2043, 921, 'out', 'TCA636_1_IPC', 'S', '#1C'],
      ['crtSabn', 2040, 1207, 'out', 'TCA636_1_SABN', 'S', '#1C']
    ],
    b: [
      ['a001', 'A', '001', 867, 303.5],
      ['a002', 'A', '002', 1198, 303.5],
      ['btr003', 'o:BTR', '003', 1665, 293],
      ['not004', 'NOT', '004', 1028, 324.5],
      ['a005', 'A', '005', 1037, 495.5],
      ['a006', 'A', '006', 1196, 558.5],
      ['tp007', 'TP', '007', 1355, 558.5, ['TP:300.0s']],
      ['btr008', 'o:BTR', '008', 1663, 548],
      ['a009', 'A', '009', 1035, 676.5],
      ['btr010', 'o:BTR', '010', 1673, 666],
      ['tp011', 'TP', '011', 906, 696.5, ['TP:10.0']],
      ['a012', 'A', '012', 873, 856, [], {}, [60, 64]],
      ['btr013', 'o:BTR', '013', 1671, 835],
      ['btr014', 'o:BTR', '014', 1670, 921],
      ['btr015', 'o:BTR', '015', 1670, 1005],
      ['tp016', 'TP', '016', 1201, 1121, ['TP:480.0s']],
      ['a017', 'A', '017', 1351, 1121],
      ['btr018', 'o:BTR', '018', 1668, 1110],
      ['not019', 'NOT', '019', 1200, 1217.5],
      ['btr020', 'o:BTR', '020', 1677, 1207],
      ['or021', 'OR', '021', 600, 409.5],
      ['a022', 'A', '022', 811, 696.5],
      ['x1', 'X', '', 621, 485]
    ],
    w,
    j: [
      [741, 153],
      [686, 293],
      [782, 293],
      [782, 569],
      [920, 314],
      [920, 485],
      [652, 485],
      [631, 506],
      [715, 686],
      [866, 632],
      [958, 835],
      [1637, 835],
      [1637, 921],
      [1637, 1110]
    ],
    t
  });
})();
