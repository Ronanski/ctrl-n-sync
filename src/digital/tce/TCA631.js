/* TCA631 HP TURBINE WARMING GROUP CONTROL (TE-1,2) (331DM09788 page 156, controller COMM+MD, cycle 100 ms). Typed from the drawing; units =
   the pixels of the page rendered 2296 wide. HP TURBINE WARMING START GROUP CONTROL PROGRESS = FFR 004: set (OR 003) by the auto control
   progress held 2.0 s (TW A002) or START of the operator station with CRT AVAILABLE, TURBINE TURNING and the 1st stage inner wall metal
   temp. (A 006, A 035, CPL 036 HL 156.0 / LL 151.0 degC); reset (OR 024) by the auto control reset condition, the start group control
   complete, the stop group control progress, or a valve position abnormal (OR 023). The auto control reset condition (OR 016) = RESET PB
   ON or OR 029: warming not permissive, condenser vacuum not normal, turbine trip, or not all of HP turbine auto, warming line drain
   valve auto, CVB below seat warming drain valve auto and ON(1) (A 034). In progress for 500.0 s (TP A011) without complete (NOT 020,
   A 012) = START GROUP CONTROL TROUBLE. INITIAL clears TW A002 and TP A011.
   The words are the ones of the drawing (DRAINE as printed). The tags of the two lamps at the right edge are printed above their symbols
   and are typed there.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  /* the start: TW A002, A 006, A 035, OR 003, FFR 004 */
  W('kInit', [463, 162], [799, 162], [799, 248]);
  W('kInit', [799, 216], [1639, 216], [1639, 484]);
  W('iA630', [344, 258], [769, 258]);
  W('twA002', [829, 258], [1215, 258]);
  W('crtJys', [394, 397], [671, 397]);
  W('crtIys', [393, 461], [801, 461]);
  W('crtIys', [636, 461], [636, 418], [671, 418]);
  W('a006', [731, 397], [1087, 397]);
  W('iB539', [342, 535], [988, 535], [988, 418], [1087, 418]);
  w.push([
    'iA1',
    [
      [351, 599],
      [744, 599]
    ],
    1
  ]);
  W('cpl036', [804, 599], [1076, 599], [1076, 439], [1087, 439]);
  W('a035', [1147, 397], [1205, 397], [1205, 280], [1215, 280]);
  W('or003', [1275, 258], [1482, 258]);
  W('ffr004', [1562, 258], [2070, 258]);
  W('ffr004', [1586, 258], [1586, 494], [1607, 494]);
  W('ffr004', [1777, 258], [1777, 398], [2069, 398]);
  W('ffr004', [1777, 335], [2061, 335]);
  /* the trouble: TP A011, NOT 020, A 012 */
  W('tpA011', [1667, 494], [1713, 494]);
  W('not020', [1458, 1268], [1686, 1268], [1686, 516], [1713, 516]);
  W('a012', [1773, 494], [2060, 494]);
  W('a012', [1796, 494], [1796, 579], [2067, 579]);
  W('kPerm', [1115, 163], [1488, 163]);
  /* the auto control reset condition: OR 016, OR 029, A 034 */
  W('iB630', [351, 684], [1190, 684]);
  W('iB630', [1125, 684], [1125, 643], [2067, 643]);
  W('or016', [1250, 684], [1372, 684]);
  W('or016', [1283, 684], [1283, 865], [2064, 865]);
  W('iN', [351, 748], [880, 748]);
  W('not025', [940, 748], [1094, 748]);
  W('iC536', [351, 811], [880, 811]);
  W('not027', [940, 811], [1062, 811], [1062, 770], [1094, 770]);
  W('kTrip', [457, 885], [879, 885]);
  W('not028', [939, 885], [1073, 885], [1073, 791], [1094, 791]);
  W('iC685', [350, 960], [752, 960]);
  W('a034', [812, 960], [879, 960]);
  W('not030', [939, 960], [1084, 960], [1084, 812], [1094, 812]);
  W('iA3', [348, 1024], [631, 1024], [631, 981], [752, 981]);
  W('iC1', [348, 1098], [652, 1098], [652, 1003], [752, 1003]);
  W('kOn', [476, 1172], [695, 1172], [695, 1024], [752, 1024]);
  W('or029', [1154, 748], [1180, 748], [1180, 706], [1190, 706]);
  /* the reset of the progress: OR 024 */
  W('iA7', [337, 1268], [1398, 1268]);
  W('iA7', [1303, 1268], [1303, 706], [1372, 706]);
  W('iA633', [337, 1332], [1324, 1332], [1324, 727], [1372, 727]);
  W('iD4', [337, 1396], [1025, 1396]);
  W('iD3', [336, 1449], [1001, 1449], [1001, 1417], [1025, 1417]);
  W('or023', [1085, 1396], [1346, 1396], [1346, 749], [1372, 749]);
  W('or024', [1432, 684], [1458, 684], [1458, 279], [1482, 279]);
  t.push(
    [351, 227, 'HP TURBINE WARMING'],
    [351, 248, 'AUTO CONTROL PROGRESS'],
    [414, 387, 'START'],
    [414, 451, 'CRT AVAILABLE'],
    [658, 451, 'CRT AVAILABLE'],
    [347, 525, 'TURBINE TURNING'],
    [359, 568, 'HP TURBINE 1ST STAGE'],
    [359, 589, 'INNER WALL METAL TEMP.'],
    [358, 674, 'RESET PB ON'],
    [358, 738, 'HP TURBINE WARMING PERMISSIVE'],
    [357, 780, 'CONDENSER VACUUM'],
    [357, 801, 'NORMAL'],
    [356, 950, 'HP TURBINE AUTO SELECTED'],
    [355, 993, 'HP TURBINE WARMING LINE'],
    [355, 1014, 'DRAIN VALVE AUTO SELECTED'],
    [355, 1067, 'CVB BEL SEC WARMING'],
    [355, 1088, 'DRAINE VALVE AUTO'],
    [343, 1237, 'HP TURBINE WARMING START'],
    [343, 1258, 'GROUP CONTROL COMPLETE'],
    [343, 1301, 'HP TURBINE WARMING STOP'],
    [343, 1322, 'GROUP CONTROL PROGRESS'],
    [342, 1386, 'HP TURBINE WARMING VLV POS. ABN.'],
    [342, 1439, 'CV(LOWER) BELOW SEAT SEC DRAIN VLV POS. ABN.'],
    [1349, 153, 'CRT OPE PERM'],
    [1802, 227, 'HP TURBINE WARMING START'],
    [1802, 248, 'GROUP CONTROL PROGRESS'],
    [1920, 325, 'START'],
    [1919, 388, 'START'],
    [2084, 312, 'TCA631_1_YIR'],
    [2096, 291, '(TCA633)', 1, 1.7],
    [2176, 291, '(TCA634)', 1, 1.7],
    [1789, 463, 'HP TURBINE WARMING START'],
    [1789, 484, 'GROUP CONTROL TROUBLE'],
    [2072, 453, 'TCA631_1_ABN'],
    [1845, 528, 'HP TURBINE WARMING'],
    [1845, 549, 'START GROUP'],
    [1845, 570, 'CONTROL TROUBLE'],
    [1785, 834, 'HP TURBINE WARMING AUTO'],
    [1785, 855, 'CONTROL RESET CONDITION'],
    [761, 246, 'T', 2],
    [736, 587, 'T', 2],
    [1474, 246, 'T', 2],
    [1599, 482, 'T', 2],
    [332, 198, '(TCA100)'],
    [984, 199, '(TCA100)'],
    [326, 921, '(TCA103)'],
    [241, 1522, 'CONTROLLER:'],
    [405, 1522, 'COMM+MD'],
    [628, 1495, 'TRIGGER  :'],
    [628, 1522, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA631',
    title: 'HP TURBINE WARMING GROUP CONTROL (TE-1,2)',
    page: 156,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    k: [
      ['kInit', 229, 162, 'INITIAL', 'ref'],
      ['kPerm', 881, 163, 'CRT OPE PERM', 'ref'],
      ['kTrip', 223, 885, 'TURBINE TRIP', 'ref'],
      ['kOn', 242, 1172, 'ON(1)', 'sys.ref']
    ],
    c: [
      ['iA630', 'in', 'A', 317, 258, '', ['TCA630']],
      ['iB539', 'in', 'B', 315, 535, '', ['TCA539']],
      ['iA1', 'in', 'A1', 324, 599, '', ['TCA360']],
      ['iB630', 'in', 'B', 324, 684, '', ['TCA630']],
      ['iN', 'in', 'N', 324, 748, '', ['TCA685']],
      ['iC536', 'in', 'C', 324, 811, '', ['TCA536']],
      ['iC685', 'in', 'C', 323, 960, '', ['TCA685']],
      ['iA3', 'in', 'A3', 321, 1024, '', ['TCA047']],
      ['iC1', 'in', 'C1', 321, 1098, '', ['TCA618']],
      ['iA7', 'in', 'A7', 310, 1268, '', ['TCA632']],
      ['iA633', 'in', 'A', 310, 1332, '', ['TCA633']],
      ['iD4', 'in', 'D4', 310, 1396, '', ['TCA322']],
      ['iD3', 'in', 'D3', 309, 1449, '', ['TCA322']],
      ['oD', 'out', 'D', 828, 461, '', ['TCA633']],
      ['oA', 'out', 'A', 2097, 258, '', ['TCA632']],
      ['oA1', 'out', 'A1', 2096, 398, '', ['-'], 1],
      ['oA2', 'out', 'A2', 2094, 579, '', ['-'], 1],
      ['oB', 'out', 'B', 2094, 643, '', ['TCA633']],
      ['oC', 'out', 'C', 2091, 865, '', ['TCA630', 'TCA634']]
    ],
    d: [
      ['crtJys', 359, 397, 'in', 'TCA631_1_JYS', 'R', '#1C'],
      ['crtIys', 358, 461, 'in', 'TCA631_1_IYS', 'R', '#1C'],
      ['crtIyp', 1523, 163, 'out', 'TCA631_1_IYP', 'S', '#1C'],
      ['crtYir', 2096, 335, 'out', '', 'S', '#1C'],
      ['crtAbn', 2095, 494, 'out', '', 'S', '#1C']
    ],
    b: [
      ['twA002', 'TW', 'A002', 799, 269, ['TW:2.0s']],
      ['or003', 'OR', '003', 1245, 269],
      ['ffr004', 'FFR', '004', 1522, 269, [], { l: ['S', 'R'] }, [80, 43]],
      ['btr005', 'o:BTR', '005', 1829, 335],
      ['a006', 'A', '006', 701, 407],
      ['btr009', 'o:BTR', '009', 1829, 398],
      ['btr010', 'o:BTR', '010', 593, 461],
      ['tpA011', 'TP', 'A011', 1637, 505, ['TP:500.0s']],
      ['a012', 'A', '012', 1743, 505],
      ['btr013', 'o:BTR', '013', 1827, 579],
      ['or016', 'OR', '016', 1220, 695],
      ['not020', 'NOT', '020', 1428, 1279],
      ['or023', 'OR', '023', 1055, 1406],
      ['or024', 'OR', '024', 1402, 717, [], {}, [60, 86]],
      ['not025', 'NOT', '025', 910, 759],
      ['not027', 'NOT', '027', 910, 822],
      ['not028', 'NOT', '028', 909, 896],
      ['or029', 'OR', '029', 1124, 780, [], {}, [60, 86]],
      ['not030', 'NOT', '030', 909, 971],
      ['btr032', 'o:BTR', '032', 1784, 643],
      ['btr033', 'o:BTR', '033', 1290, 163],
      ['a034', 'A', '034', 782, 992, [], {}, [60, 86]],
      ['a035', 'A', '035', 1117, 418, [], {}, [60, 65]],
      ['cpl036', 'CPL', '036', 774, 610, ['HL:156.0degC', 'LL:151.0degC']]
    ],
    w,
    j: [
      [799, 216],
      [636, 461],
      [1586, 258],
      [1777, 258],
      [1777, 335],
      [1796, 494],
      [1125, 684],
      [1283, 684],
      [1303, 1268]
    ],
    t
  });
})();
