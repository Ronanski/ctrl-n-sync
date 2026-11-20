/* TCA638 TURBINE GLAND SEAL GROUP CONTROL (TE-6,7) (331DM09788 page 162, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide.
   TURBINE GLAND SEAL STOP GROUP CONTROL IN PROGRESS = FFR 007:
   - set by A 006: the stop (OR 001 of the TURBINE GLAND SEAL GROUP STOP COMMAND or STOP of the operator station with CRT AVAILABLE,
     A 005) with the condenser vacuum breaker complete and condenser vacuum > atmosphere (A 009), the steam seal aux feed valve in auto
     and the steam packing unloading valve in auto;
   - reset by OR 016: RESET with CRT AVAILABLE (A 015), both MSV not full close (NOT 017), stop GC complete (A 013, through the loop
     mark), start group control in progress, or the stop GC related aux not in auto (NOT 022).
   STOP GROUP CONTROL PERMISSIVE (A 025) = the same three conditions without a reset (NOT 026).
   Steps: TP 012 (300.0 s from the feed inlet valve full close, cleared by INITIAL) with in progress = STOP COMMAND to TCA680 (A 010);
   with the exhauster not running (NOT 024) = STOP GC COMPLETE (A 013); TP 018 (400.0 s from in progress) without complete = TROUBLE.
   The words are the ones of the drawing (STEEM, EXHAUSTERRUNNING, ATOMOSPHERE, CLSE, GRAND as printed).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  /* INITIAL clears the timers */
  W('kInit', [433, 163], [1400, 163], [1400, 1097]);
  W('kInit', [1400, 726], [992, 726], [992, 822]);
  /* the stop: OR 001, A 005; CRT AVAILABLE */
  W('i2', [327, 258], [720, 258]);
  W('crtJyp', [367, 334], [592, 334]);
  W('a005', [651, 334], [689, 334], [689, 280], [720, 280]);
  W('iD', [328, 401], [545, 401]);
  W('iD', [545, 355], [592, 355]);
  W('iD', [545, 355], [545, 1034], [578, 1034]);
  W('or001', [780, 258], [976, 258]);
  /* the conditions to A 006 and A 025 */
  W('iA10', [327, 483], [730, 483]);
  W('iF', [326, 579], [720, 579], [720, 504], [730, 504]);
  W('a009', [790, 483], [870, 483], [870, 279.5], [976, 279.5]);
  W('a009', [870, 483], [870, 588.5], [1623, 588.5]);
  W('iC1', [326, 665], [929, 665], [929, 301], [976, 301]);
  W('iC1', [929, 610], [1623, 610]);
  W('iC2', [326, 750], [950, 750], [950, 322.5], [976, 322.5]);
  W('iC2', [950, 631.5], [1623, 631.5]);
  /* FFR 007 and its reset OR 016 */
  W('a006', [1035, 258], [1159, 258]);
  W('or016', [1010, 1013], [1081, 1013], [1081, 279.5], [1159, 279.5]);
  W('or016', [1081, 653], [1145, 653]);
  W('not026', [1205, 653], [1623, 653]);
  W('crtPikr', [355, 1013], [578, 1013]);
  W('a015', [637, 1013], [951, 1013]);
  W('iP', [325, 1109], [705, 1109]);
  W('not017', [765, 1109], [790, 1109], [790, 1034], [951, 1034]);
  W('iA', [325, 1301], [863, 1301], [863, 1077], [951, 1077]);
  W('iA2', [325, 1396], [705, 1396]);
  W('not022', [764, 1396], [895, 1396], [895, 1098.5], [951, 1098.5]);
  /* in progress and the steps */
  W('ffr007', [1239, 258], [2044, 258]);
  W('ffr007', [1291, 258], [1291, 1108], [1365, 1108]);
  W('ffr007', [1291, 811.5], [1314, 811.5]);
  W('ffr007', [1487, 258], [1487, 514], [2042, 514]);
  W('ffr007', [1592, 258], [1592, 407], [2043, 407]);
  W('ffr007', [1592, 333], [2035, 333]);
  W('a025', [1682, 588.5], [2023, 588.5]);
  W('a025', [1770, 588.5], [1770, 673], [2030, 673]);
  W('iB2', [326, 833], [962, 833]);
  W('tp012', [1021, 833], [1314, 833]);
  W('tp012', [1132, 833], [1132, 896], [1155, 896]);
  W('a010', [1373, 811.5], [2039, 811.5]);
  W('iB1', [325, 917], [717, 917]);
  W('not024', [776, 917], [1155, 917]);
  W('a013', [1214, 896], [2039, 896]);
  W('a013', [1248, 896], [1248, 1204], [1365, 1204]);
  W('a013', [1248, 1204], [821, 1204], [821, 1055.5], [951, 1055.5]);
  W('a013', [1629, 896], [1629, 1033], [2037, 1033]);
  W('a013', [1629, 960], [2030, 960]);
  W('tp018', [1425, 1108], [1472, 1108]);
  W('not021', [1424, 1204], [1461, 1204], [1461, 1129], [1472, 1129]);
  W('a019', [1530, 1108], [2038, 1108]);
  W('a019', [1669, 1108], [1669, 1247], [2037, 1247]);
  W('a019', [1669, 1172], [2029, 1172]);
  t.push(
    [333, 229, 'TURBINE GLAND SEAL'],
    [333, 250, 'GROUP STOP COMMAND'],
    [384, 329, 'STOP'],
    [333, 388, 'CRT AVAILABLE'],
    [333, 453, 'CONDENSER VACUUM'],
    [333, 474, 'BREAKER COMPLETE'],
    [333, 569, 'CONDENSER VACUUM > ATOMOSPHERE'],
    [332, 634, 'STEAM SEAL AUX'],
    [332, 655, 'FEED VALVE IN AUTO'],
    [332, 719, 'STEAM PACKING UNLOADING'],
    [332, 740, 'VALVE IN AUTO'],
    [332, 804, 'STEEM SEAL FEED'],
    [332, 825, 'INLET VALVE FULL CLOSE'],
    [332, 888, 'GLAND STEAM'],
    [332, 910, 'EXHAUSTERRUNNING'],
    [372, 1008, 'RESET'],
    [332, 1101, 'BOTH MSV FULL CLSE'],
    [331, 1271, 'TURBINE GLAND SEAL START'],
    [331, 1292, 'GROUP CONTROL IN PROGRESS'],
    [331, 1367, 'TURBINE GLAND SEAL STOP'],
    [331, 1388, 'GC RELATED AUX IN AUTO'],
    [1671, 230, 'TURBINE GLAND SEAL STOP'],
    [1671, 251, 'GROUP CONTROL IN PROGRESS'],
    [1709, 560, 'TURBINE GLAND SEAL STOP'],
    [1709, 581, 'GROUP CONTROL PERMISSIVE'],
    [1666, 783, 'STOP COMMAND FROM TURBINE GRAND'],
    [1666, 804, 'SEAL STOP GROUP CONTROL'],
    [1666, 868, 'TURBINE GLAND SEAL'],
    [1666, 889, 'STOP GC COMPLETE'],
    [1707, 1080, 'TURBINE GLAND SEAL'],
    [1707, 1101, 'STOP GC TROUBLE'],
    [1151, 246, 'T', 2],
    [954, 821, 'T', 2],
    [1357, 1096, 'T', 2],
    [333, 204, '(TCA100)'],
    [232, 1526, 'CONTROLLER:'],
    [393, 1526, 'COMM+MD'],
    [617, 1499, 'TRIGGER  :'],
    [617, 1526, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA638',
    title: 'TURBINE GLAND SEAL GROUP CONTROL (TE-6,7)',
    page: 162,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [167, 86, 2212, 1548],
    k: [['kInit', 200, 163, 'INITIAL', 'ref']],
    c: [
      ['i2', 'in', '2', 300, 258, '', ['TCT090'], 1],
      ['iD', 'in', 'D', 301, 401, '', ['TCA636']],
      ['iA10', 'in', 'A10', 300, 483, '', ['TCA048']],
      ['iF', 'in', 'F', 299, 579, '', ['TCA536']],
      ['iC1', 'in', 'C1', 299, 665, '', ['TCA636']],
      ['iC2', 'in', 'C2', 299, 750, '', ['TCA636']],
      ['iB2', 'in', 'B2', 299, 833, '', ['TCA650']],
      ['iB1', 'in', 'B1', 298, 917, '', ['TCA680']],
      ['iP', 'in', 'P', 298, 1109, '', ['TCE350'], 1],
      ['iA', 'in', 'A', 298, 1301, '', ['TCA636']],
      ['iA2', 'in', 'A2', 298, 1396, '', ['TCA639']],
      ['oA1', 'out', 'A1', 2071, 258, '', ['TCA636']],
      ['oA2', 'out', 'A2', 2070, 407, '', ['-'], 1],
      ['oA3', 'out', 'A3', 2069, 514, '', ['TCA650']],
      ['oE', 'out', 'E', 2057, 673, '', ['TCT081E'], 1],
      ['oB1', 'out', 'B1', 2066, 811.5, '', ['TCA680']],
      ['oC1', 'out', 'C1', 2066, 896, '', ['-']],
      ['oC2', 'out', 'C2', 2064, 1033, '', ['TCT081B'], 1],
      ['oD1', 'out', 'D1', 2065, 1108, '', ['-']],
      ['oD2', 'out', 'D2', 2064, 1247, '', ['-'], 1]
    ],
    d: [
      ['crtJyp', 332, 334, 'in', 'TCA636_1_JYP', 'R', '#1C'],
      ['crtPikr', 320, 1013, 'in', 'TCA636_1_PIKR', 'R', '#1C'],
      ['crtYirp', 2070, 333, 'out', 'TCA636_1_YIRP', 'S', '#1C'],
      ['crtPerm', 2058, 588.5, 'out', 'TCA636_2', 'S', '#1C'],
      ['crtPipc', 2065, 960, 'out', 'TCA636_1_PIPC', 'S', '#1C'],
      ['crtAbn', 2064, 1172, 'out', 'TCA638_1_ABN', 'S', '#1C']
    ],
    b: [
      ['or001', 'OR', '001', 750, 269.5],
      ['a005', 'A', '005', 621, 344.5],
      ['a006', 'A', '006', 1005, 289.5, [], {}, [60, 85]],
      ['ffr007', 'FFR', '007', 1199, 268.5, [], { l: ['S', 'R'] }, [80, 43]],
      ['btr008', 'o:BTR', '008', 1529, 258],
      ['a009', 'A', '009', 760, 493.5],
      ['a010', 'A', '010', 1343, 822],
      ['btr011', 'o:BTR', '011', 1577, 811.5],
      ['tp012', 'TP', '012', 991, 843.5, ['TP:300.0s']],
      ['a013', 'A', '013', 1184, 906.5],
      ['btr014', 'o:BTR', '014', 1576, 896],
      ['a015', 'A', '015', 607, 1023.5],
      ['or016', 'OR', '016', 980, 1055, [], {}, [60, 106]],
      ['not017', 'NOT', '017', 735, 1119.5],
      ['tp018', 'TP', '018', 1395, 1118.5, ['TP:400.0s']],
      ['a019', 'A', '019', 1501, 1118.5],
      ['btr020', 'o:BTR', '020', 1575, 1108],
      ['not021', 'NOT', '021', 1394, 1214.5],
      ['not022', 'NOT', '022', 734, 1406.5],
      ['btr023', 'o:BTR', '023', 1516, 514],
      ['not024', 'NOT', '024', 746, 927.5],
      ['a025', 'A', '025', 1652, 620, [], {}, [60, 85]],
      ['not026', 'NOT', '026', 1175, 663.5],
      ['x1', 'X', '', 1064, 1204]
    ],
    w,
    j: [
      [545, 401],
      [870, 483],
      [929, 610],
      [950, 631.5],
      [1081, 653],
      [1291, 258],
      [1487, 258],
      [1592, 258],
      [1592, 333],
      [1770, 588.5],
      [1400, 726],
      [1132, 833],
      [1291, 811.5],
      [1248, 896],
      [1629, 896],
      [1629, 960],
      [1248, 1204],
      [1669, 1108],
      [1669, 1172]
    ],
    t
  });
})();
