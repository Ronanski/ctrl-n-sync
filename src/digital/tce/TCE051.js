/* TCE051 CONTROLLER CONDITION(2) (331DM09784 page 24, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page rendered 2296 wide.
   Six "no receive" alarms of the network, each held by a flip-flop until ANN RESET, drawn the same way: flip-flop, lamp of the operator station (CRT)
   and connector A<n>; then NETWORK IF TROUBLE and the battery error of the controller. */
(function () {
  if (typeof window === 'undefined') return;
  const b = [],
    c = [],
    d = [],
    w = [],
    t = [];
  /* [words of the lamp, y of the flip-flop, x of the flip-flop, x of the branch to the OR, y of that OR input, x of the junction to A<n>, x of the BTR marks,
     x of the lamp, x of A<n>, source of the set input] */
  const ROWS = [
    ['ATS(A)CPU NORECEIVE', 327, 914, 1396, 965, 1523, 1565, 1938, 2075, 'kSt12'],
    ['ATS(B)CPU NORECEIVE', 434, 913, 1373, 986, 1521, 1563, 1937, 2075, 'kSt13'],
    ['GW(A)CPU NORECEIVE', 541, 912, 1350, 1007, 1520, 1562, 1936, 2074, 'iC'],
    ['GW(B)CPU NORECEIVE', 647, 911, 1328, 1028, 1519, 1561, 1935, 2073, 'iD'],
    ['MNT(A)CPU NORECEIVE', 753, 910, 1305, 1049, 1518, 1560, 1934, 2072, 'iF'],
    ['MNT(B)CPU NORECEIVE', 859, 910, 1283, 1070, 1517, 1559, 1933, 2071, 'iG']
  ];
  ROWS.forEach(([name, yc, xc, xb, yo, xj, xm, xl, xa, set], i) => {
    const n = i + 1,
      no = k => String(k).padStart(3, '0'),
      ys = yc - 11 /* the set input and the output */,
      yr = yc + 11 /* the reset input */,
      ya = ys + 53; /* the line to connector A<n> */
    b.push(['ffs' + n, 'FFS', no(6 + 3 * i), xc, yc, [], { l: ['S', 'R'] }, [80, 43]]);
    b.push(['btrL' + n, 'o:BTR', no(7 + 3 * i), xm, ys], ['btrA' + n, 'o:BTR', no(8 + 3 * i), xm, ya]);
    d.push(['crt' + n, xl, ys, 'out', 'TCE051_' + n, 'S', '#1C']);
    c.push(['oA' + n, 'out', 'A' + n, xa, ya, '', ['-'], 1]);
    w.push(
      ['ffs' + n, [[xc + 40, ys], [xl - 35, ys]]],
      ['ffs' + n, [[xj, ys], [xj, ya], [xa - 27, ya]]],
      ['ffs' + n, [[xb, ys], [xb, yo], [1414, yo]]],
      ['kAnn', [[837, yr], [xc - 40, yr]]]
    );
    t.push([xc - 57, ys - 14, 'C'], [xm + 68, ys - 24, name], [xm + 68, ys - 3, '(EHG)'], [xm + 68, ya - 24, name], [xm + 68, ya - 3, '(EHG)']);
    if (i > 1) w.push([set, [[321 - (i > 3 ? 1 : 0), ys], [xc - 40, ys]]]);
  });
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'TCE051',
    title: 'CONTROLLER CONDITION(2)',
    page: 24,
    ctl: 'EHG+MD',
    cycle: 30,
    f: [157, 80, 2217, 1543],
    k: [
      ['kSt12', 277, 147, 'GR1A-ST12_NoReceived', 'sys.ref'],
      ['kSt13', 277, 210, 'GR1A-ST13_NoReceived', 'sys.ref'],
      ['kBat', 274, 1113, 'BATTERYERR', 'sys.ref'],
      ['kAnn', 274, 1177, 'ANN RESET', 'ref'],
      ['kYd', 273, 1241, 'YOURDATA_D_EX9', 'sys.ref'],
      ['kMyB', 273, 1316, 'MYCTL-B', 'sys.ref'],
      ['kYerr', 273, 1380, 'YOURCTL1ERR', 'sys.ref'],
      ['kMyA', 273, 1443, 'MYCTL-A', 'sys.ref'],
      ['dAtsN', 1866, 147, 'ATS IF NORMAL', 'def', 'def'],
      ['dAtsC', 1865, 253, 'ATS AUTO(C)', 'def', 'def'],
      ['dMyd', 1857, 1188, 'MYDATA_D_EX9', 'sys.def', 'def']
    ],
    c: [
      ['iB', 'in', 'B', 295, 273, 'ATS AUTO', ['TCA501'], 1],
      ['iC', 'in', 'C', 294, 530, 'ETHER(A) NORECEIVE', ['TCE050']],
      ['iD', 'in', 'D', 294, 636, 'ETHER(B) NORECEIVE', ['TCE050']],
      ['iF', 'in', 'F', 293, 742, 'MONI(A) NORECEIVE', ['TCE050']],
      ['iG', 'in', 'G', 293, 848, 'MONI(B) NORECEIVE', ['TCE050']],
      ['oA', 'out', 'A', 2071, 965, 'NETWORK IF TROUBLE', ['TCE470']],
      ['oF', 'out', 'F', 2069, 1113, 'EHG BATTERY ERR', ['TCE470']],
      ['oB1', 'out', 'B1', 2067, 1304, '', ['-'], 1],
      ...c
    ],
    d: [...d, ['crt7', 1928, 1251, 'out', 'TCE051_7', 'S', '#1C']],
    b: [
      ['not001', 'NOT', '001', 724, 157],
      ['or002', 'OR', '002', 915, 157],
      ['not003', 'NOT', '003', 723, 221],
      ['a004', 'A', '004', 1449, 264],
      ['btr005', 'o:BTR', '005', 723, 273],
      ...b,
      ['or024', 'OR', '024', 1442, 1018, [], {}, [58, 126]],
      ['ffs025', 'FFS', '025', 909, 1124, [], { l: ['S', 'R'] }, [80, 43]],
      ['or026', 'OR', '026', 1442, 1124],
      ['a027', 'A', '027', 713, 1252],
      ['a028', 'A', '028', 904, 1252],
      ['or029', 'OR', '029', 1103, 1252],
      ['or030', 'OR', '030', 1270, 1252],
      ['a032', 'A', '032', 909, 1305],
      ['a034', 'A', '034', 1101, 1358],
      ['not035', 'NOT', '035', 590, 1391],
      ['not036', 'NOT', '036', 908, 1454],
      ['btr031', 'o:BTR', '031', 1557, 1251],
      ['btr033', 'o:BTR', '033', 1556, 1304]
    ],
    w: [
      /* ATS interface */
      ['kSt12', [[512, 147], [695, 147]]],
      ['kSt12', [[669, 147], [669, 316], [874, 316]]],
      ['kSt13', [[512, 210], [694, 210]]],
      ['kSt13', [[648, 210], [648, 423], [873, 423]]],
      ['not001', [[753, 147], [886, 147]]],
      ['not003', [[752, 210], [864, 210], [864, 168], [886, 168]]],
      ['or002', [[944, 147], [1866, 147]]],
      ['or002', [[1397, 147], [1397, 253], [1420, 253]]],
      ['iB', [[322, 273], [1420, 273]]],
      ['a004', [[1478, 253], [1865, 253]]],
      ...w,
      /* ANN RESET to the reset input of every flip-flop */
      ['kAnn', [[510, 1177], [837, 1177], [837, 338]]],
      ['kAnn', [[837, 1135], [869, 1135]]],
      ['or024', [[1471, 965], [2044, 965]]],
      /* battery error of this controller or of the other one */
      ['kBat', [[510, 1113], [869, 1113]]],
      ['ffs025', [[949, 1113], [1413, 1113]]],
      ['ffs025', [[1027, 1113], [1027, 1347], [1072, 1347]]],
      ['ffs025', [[1027, 1188], [1857, 1188]]],
      ['kYd', [[510, 1241], [684, 1241]]],
      ['kYerr', [[510, 1380], [561, 1380]]],
      ['not035', [[619, 1380], [663, 1380], [663, 1263], [684, 1263]]],
      ['a027', [[742, 1241], [875, 1241]]],
      ['a027', [[825, 1241], [825, 1294], [880, 1294]]],
      ['kMyB', [[510, 1316], [880, 1316]]],
      ['kMyA', [[510, 1443], [879, 1443]]],
      ['kMyA', [[846, 1443], [846, 1263], [875, 1263]]],
      ['a028', [[933, 1241], [1074, 1241]]],
      ['a032', [[938, 1294], [1048, 1294], [1048, 1263], [1074, 1263]]],
      ['not036', [[937, 1443], [1027, 1443], [1027, 1369], [1072, 1369]]],
      ['or029', [[1132, 1241], [1241, 1241]]],
      ['a034', [[1130, 1347], [1218, 1347], [1218, 1263], [1241, 1263]]],
      ['or030', [[1299, 1241], [1388, 1241], [1388, 1135], [1413, 1135]]],
      ['or026', [[1471, 1113], [2042, 1113]]],
      ['or026', [[1516, 1113], [1516, 1304], [2040, 1304]]],
      ['or026', [[1516, 1251], [1893, 1251]]]
    ],
    t: [
      ...t,
      [853, 1100, 'C'],
      [1625, 1247, 'EHG BATTERY ERR'],
      [1625, 1300, 'EHG BATTERY ERR'],
      [225, 1524, 'CONTROLLER:'],
      [388, 1524, 'EHG+MD'],
      [610, 1497, 'TRIGGER  :'],
      [610, 1524, 'CYCLE(ms):30']
    ]
  });
})();
