/* TCA102 CONTROLLER CONDITION(3) (331DM09788 page 36, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. The simulation modes: LOCAL / AUX / PULSE / THSC SIMULATION USE, SIMULATION USE and OUTSIDE SIMULATION are six FFR
   (002, 004, 006, 008, 011, 014) set and reset from OFF(0) over their BTR (reset: SIMULATION MODE RESET, BTR 015); any of them (OR 009,
   OR 012) or CPU_SIMU_ON (OR 016) sets FFS 017 = ATS DURING SIMULATION, reset by ANN RESET.
   The communication: GR1A_SELF_LOOPBACK (BTR 034) or GR1A_ISOLATION for 0.2 s (TP A025, cleared by INITIAL) sets FFS 021 = MYDATA_D_EX10 /
   ATS COMMUNICATION LOST (OR 022 with the other controller's YOURDATA_D_EX10 / _EX11 over A 026 .. A 031, OR 028 / 029); the self loopback
   of controller A and B to the operator station (A 035 / A 036, A 037 / A 039, OR 040 / 041, CRT TCA102_3 / _4).
   The words are the ones of the drawing (the tag of the second lamp is printed TCA102-2).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const b = [],
    w = [],
    j = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  /* the six FFR on OFF(0): [BTR, y of the set line, FFR, x of the FFR, x of the BTR, words, x of the words, x of the pentagon it writes
     (0 = none), x of its tap (0 = none), y at the OR, x of the OR input] */
  [
    ['001', 148, '002', 1078, 619, 'LOCAL SIMULATION USE', 690, 1942, 1228, 447],
    ['003', 233, '004', 1077, 619, 'AUX SIMULATION USE', 688, 1941, 1205, 469],
    ['005', 318, '006', 1076, 618, 'PULSE SIMULATION USE', 688, 1940, 1183, 490],
    ['007', 404, '008', 1076, 618, 'THSC SIMULATION USE', 687, 1939, 1161, 511],
    ['010', 564, '011', 1075, 617, 'SIMULATION USE', 686, 0, 0, 0],
    ['013', 650, '014', 1074, 616, 'OUTSIDE SIMULATION', 685, 1938, 0, 0]
  ].forEach(([btr, y, no, fx, bx, s, tx, px, vx, oy]) => {
    b.push(['btr' + btr, 'o:BTR', btr, bx, y], ['ffr' + no, 'FFR', no, fx, y + 11, [], { l: ['S', 'R'] }, [80, 43]]);
    t.push([tx, y - 10, s], [fx - 48, y - 12, 'T', 2]);
    if (y === 148) W('kOff', [521, 318], [521, 148], [fx - 40, 148]);
    else if (y === 318) W('kOff', [441, 318], [fx - 40, 318]);
    else W('kOff', [521, y], [fx - 40, y]);
    if (y !== 148) {
      W('kOff', [980, y + 21], [fx - 40, y + 21]);
      j.push([521, y], [980, y + 21]);
    }
    if (px) W('ffr' + no, [fx + 40, y], [px, y]);
    if (vx) {
      W('ffr' + no, [vx, y], [vx, oy], [1249, oy]);
      j.push([vx, y]);
    }
  });
  /* SIMULATION MODE RESET: the reset of the six FFR */
  b.push(['btr015', 'o:BTR', '015', 616, 724]);
  t.push([685, 714, 'SIMULATION MODE RESET']);
  W('kOff', [521, 318], [521, 724], [980, 724], [980, 169], [1038, 169]);
  b.push(
    ['or009', 'OR', '009', 1279, 479, [], {}, [60, 86]],
    ['or012', 'OR', '012', 1278, 575],
    ['or016', 'OR', '016', 1427, 757, [], {}, [60, 65]],
    ['ffs017', 'FFS', '017', 1563, 746, [], { l: ['S', 'R'] }, [80, 43]],
    ['btr018', 'o:BTR', '018', 1690, 800],
    ['btr019', 'o:BTR', '019', 1690, 864],
    ['or020', 'OR', '020', 699, 969],
    ['ffs021', 'FFS', '021', 870, 969, [], { l: ['S', 'R'] }, [80, 43]],
    ['or022', 'OR', '022', 1424, 969],
    ['btr023', 'o:BTR', '023', 1688, 1023],
    ['btr024', 'o:BTR', '024', 1688, 1087],
    ['tpA025', 'TP', 'A025', 570, 1129, ['TP:0.2S']],
    ['a026', 'A', '026', 698, 1214],
    ['a027', 'A', '027', 868, 1214],
    ['or028', 'OR', '028', 1144, 1214],
    ['or029', 'OR', '029', 1294, 1214],
    ['a030', 'A', '030', 975, 1267],
    ['a031', 'A', '031', 1144, 1299],
    ['not032', 'NOT', '032', 569, 1353],
    ['not033', 'NOT', '033', 868, 1416],
    ['btr034', 'o:BTR', '034', 572, 958],
    ['a035', 'A', '035', 869, 1054],
    ['a036', 'A', '036', 869, 1118],
    ['a037', 'A', '037', 868, 1310],
    ['a038', 'A', '038', 697, 1352],
    ['a039', 'A', '039', 868, 1363],
    ['or040', 'OR', '040', 1143, 1374],
    ['or041', 'OR', '041', 1142, 1449]
  );
  /* ATS DURING SIMULATION */
  W('or009', [1309, 447], [1375, 447], [1375, 735], [1397, 735]);
  W('ffr011', [1115, 564], [1248, 564]);
  W('ffr014', [1114, 650], [1938, 650]);
  W('ffr014', [1224, 650], [1224, 586], [1248, 586]);
  W('or012', [1308, 564], [1939, 564]);
  W('or012', [1353, 564], [1353, 757], [1397, 757]);
  W('kCpu', [439, 777], [1397, 777]);
  W('or016', [1457, 735], [1523, 735]);
  W('kAnn', [439, 862], [1499, 862], [1499, 757], [1523, 757]);
  W('kAnn', [795, 862], [795, 979], [830, 979]);
  W('ffs017', [1603, 735], [2057, 735]);
  W('ffs017', [1649, 735], [1649, 864], [1951, 864]);
  W('ffs017', [1649, 800], [1942, 800]);
  /* ATS COMMUNICATION LOST */
  W('kLoop', [438, 958], [669, 958]);
  W('kLoop', [625, 958], [625, 905], [838, 905]);
  W('kLoop', [625, 958], [625, 1043], [839, 1043]);
  W('kLoop', [773, 1043], [773, 1107], [839, 1107]);
  W('kInit', [438, 1033], [570, 1033], [570, 1108]);
  W('kIso', [438, 1118], [540, 1118]);
  W('tpA025', [600, 1118], [646, 1118], [646, 979], [669, 979]);
  W('or020', [729, 958], [830, 958]);
  W('ffs021', [910, 958], [1394, 958]);
  W('ffs021', [1071, 958], [1071, 1289], [1114, 1289]);
  W('ffs021', [1071, 1171], [1782, 1171]);
  W('or022', [1454, 958], [2055, 958]);
  W('or022', [1647, 958], [1647, 908], [2055, 908]);
  W('or022', [1647, 958], [1647, 1087], [1948, 1087]);
  W('or022', [1647, 1023], [1941, 1023]);
  /* the other controller */
  W('kYd10', [437, 1203], [668, 1203]);
  W('a026', [728, 1203], [838, 1203]);
  W('a026', [793, 1203], [793, 1256], [945, 1256]);
  W('kMb', [436, 1277], [945, 1277]);
  W('kMb', [771, 1277], [771, 1128], [839, 1128]);
  W('kMb', [771, 1277], [771, 1320], [838, 1320]);
  W('kYc', [436, 1342], [539, 1342]);
  W('not032', [599, 1342], [667, 1342]);
  W('not032', [645, 1342], [645, 1224], [668, 1224]);
  W('kYd11', [435, 1469], [645, 1469], [645, 1363], [667, 1363]);
  W('a038', [727, 1342], [749, 1342], [749, 1299], [838, 1299]);
  W('a038', [749, 1342], [749, 1352], [838, 1352]);
  W('kMa', [436, 1405], [838, 1405]);
  W('kMa', [814, 1405], [814, 1064], [839, 1064]);
  W('kMa', [814, 1374], [838, 1374]);
  W('kMa', [814, 1224], [838, 1224]);
  W('a035', [899, 1043], [1049, 1043], [1049, 1363], [1113, 1363]);
  W('a036', [899, 1107], [1038, 1107], [1038, 1438], [1112, 1438]);
  W('a027', [898, 1203], [1114, 1203]);
  W('a030', [1005, 1256], [1091, 1256], [1091, 1224], [1114, 1224]);
  W('or028', [1174, 1203], [1264, 1203]);
  W('or029', [1324, 1203], [1370, 1203], [1370, 979], [1394, 979]);
  W('a037', [898, 1299], [1027, 1299], [1027, 1384], [1113, 1384]);
  W('a039', [898, 1352], [1017, 1352], [1017, 1459], [1112, 1459]);
  W('not033', [898, 1405], [1069, 1405], [1069, 1310], [1114, 1310]);
  W('a031', [1174, 1289], [1241, 1289], [1241, 1224], [1264, 1224]);
  W('or040', [1173, 1363], [1353, 1363]);
  W('or041', [1172, 1438], [1352, 1438]);
  j.push(
    [1224, 650],
    [1353, 564],
    [795, 862],
    [1649, 735],
    [1649, 800],
    [625, 958],
    [773, 1043],
    [1071, 958],
    [1071, 1171],
    [1647, 958],
    [1647, 1023],
    [793, 1203],
    [771, 1277],
    [645, 1342],
    [749, 1342],
    [814, 1405],
    [814, 1374],
    [814, 1224]
  );
  t.push(
    [1515, 723, 'T', 2],
    [822, 946, 'C', 2],
    [532, 1106, 'C', 2],
    [1725, 725, 'ATS DURING SIMULATION'],
    [1727, 770, 'ATS'],
    [1727, 790, 'DURING SIMULATION'],
    [1727, 834, 'ATS'],
    [1727, 854, 'DURING SIMULATION'],
    [1722, 948, 'ATS COMMUNICATION LOST'],
    [1725, 993, 'ATS'],
    [1725, 1013, 'COMMUNICATION LOST'],
    [1725, 1057, 'ATS'],
    [1725, 1077, 'COMMUNICATION LOST'],
    [1188, 1334, 'ATS(A)'],
    [1188, 1353, 'SELF LOOPBACK'],
    [1187, 1409, 'ATS(B)'],
    [1187, 1428, 'SELF LOOPBACK'],
    [308, 898, '(TCA100)'],
    [307, 1069, '(TCA100)'],
    [237, 1524, 'CONTROLLER:'],
    [398, 1524, 'COMM+MD'],
    [623, 1498, 'TRIGGER  :'],
    [623, 1524, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA102',
    title: 'CONTROLLER CONDITION(3)',
    page: 36,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    k: [
      ['kOff', 207, 318, 'OFF(0)', 'sys.ref'],
      ['kCpu', 205, 777, 'CPU_SIMU_ON', 'sys.ref'],
      ['kAnn', 205, 862, 'ANN RESET', 'ref'],
      ['kLoop', 204, 958, 'GR1A_SELF_LOOPBACK', 'sys.ref'],
      ['kInit', 204, 1033, 'INITIAL', 'ref'],
      ['kIso', 204, 1118, 'GR1A_ISOLATION', 'sys.ref'],
      ['kYd10', 203, 1203, 'YOURDATA_D_EX10', 'sys.ref'],
      ['kMb', 202, 1277, 'MYCTL-B', 'sys.ref'],
      ['kYc', 202, 1342, 'YOURCTL1ERR', 'sys.ref'],
      ['kMa', 202, 1405, 'MYCTL-A', 'sys.ref'],
      ['kYd11', 201, 1469, 'YOURDATA_D_EX11', 'sys.ref'],
      ['dLocal', 1942, 148, 'LOCAL SIM', 'def', 'def'],
      ['dAux', 1941, 233, 'AUX SIM', 'def', 'def'],
      ['dPulse', 1940, 318, 'PULSE SIM', 'def', 'def'],
      ['dThsc', 1939, 404, 'THSC SIMULATION', 'def', 'def'],
      ['dSim', 1939, 564, 'SIMULATION USE', 'def', 'def'],
      ['dOut', 1938, 650, 'OUTSIDE SIMULATION', 'def', 'def'],
      ['dEx11', 838, 905, 'MYDATA_D_EX11', 'sys.def', 'def'],
      ['dEx10', 1782, 1171, 'MYDATA_D_EX10', 'sys.def', 'def']
    ],
    c: [
      ['oA', 'out', 'A', 2084, 735, '', ['TCA822']],
      ['oA1', 'out', 'A1', 1978, 864, '', ['-'], 1],
      ['oC', 'out', 'C', 2082, 908, '', ['-'], 1],
      ['oF', 'out', 'F', 2082, 958, '', ['TCA822']],
      ['oF1', 'out', 'F1', 1975, 1087, '', ['-'], 1]
    ],
    d: [
      ['crt1', 1977, 800, 'out', 'TCA102_1', 'S', '#1C'],
      ['crt2', 1976, 1023, 'out', 'TCA102-2', 'S', '#1C'],
      ['crt3', 1388, 1363, 'out', 'TCA102_3', 'S', '#1C'],
      ['crt4', 1387, 1438, 'out', 'TCA102_4', 'S', '#1C']
    ],
    b,
    w,
    j,
    t
  });
})();
