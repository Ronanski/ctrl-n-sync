/* TCE151 CV WARMING CONTROL(2) (331DM09784 page 108, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The scan of this page is turned a little; every place is typed as it stands on the page set straight (one x for each upright
   line, one y for each level line).
   CV warming AUTO / MANUAL: AUTO is set by the operator or the ATS while the CV warming mode is set, and reset by CV(B) metal temperature
   abnormal, the operator's MANUAL, all valves not closed, CV warming complete or the mode reset. In MANUAL the operator's FULL OPEN and FULL
   CLOSE each set a flip-flop (FULL CLOSE also for 10.0 s when MANUAL comes); each is reset by the other one, by CV warming complete, all
   valves not closed, the mode reset, AUTO or a turbine trip. Also: MSV(A) and MSV(B) position under 2.5, and the two full close signals of
   the MSV, to the operator station. The title block of this page prints PAGE 106; it is page 108 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    d = [],
    b = [],
    w = [],
    t = [],
    XO = 2082,
    E = XO - 27,
    mark = (no, x, y) => b.push(['m' + no, 'o:BTR', no, x, y]),
    box = (key, type, no, x, y, h, pins, w2, notes) =>
      b.push([key, type, no, x, y, notes || [], pins || {}, [w2 || 59, h || 43]]),
    ffr = (key, no, x, y) => box(key, 'FFR', no, x, y, 43, { l: ['S', 'R'] }, 80),
    btn = (key, y, tag, name) => {
      d.push([key, 357, y, 'in', tag, 'R', '#1C']);
      t.push([390, y - 6, name]);
    },
    lamp = (key, x, y, tag) => d.push([key, x, y, 'out', tag, 'S', '#1C']),
    out = (key, l, y, refs, dbl) => c.push([key, 'out', l, XO, y, '', refs, dbl || 0]),
    two = (x, y, a, b2) => t.push([x, y - 27, a], [x, y - 6, b2]);
  c.push(
    ['iH1', 'in', 'H1', 311, 124, 'CV(B) INNER/OUTER METAL TEMP.ABN.', ['TCA530'], 1],
    ['iBats', 'in', 'B', 310, 176, 'CV WARMING AUTO(ATS)', ['TCA580'], 1],
    ['iC', 'in', 'C', 309, 304, 'CRT AVAILABLE', ['TCE150']],
    ['iA', 'in', 'A', 302, 805, 'CV WARMING MODE SET', ['TCE150']],
    ['iBc', 'in', 'B', 296, 1453, 'CV WARMING COMPLETE', ['TCE152']],
    ['iP1', 'in', 'P', 1356, 137, 'MSV(A) POSITION', ['TCE121'], 0, 1],
    ['iP2', 'in', 'P', 1355, 212, 'MSV(B) POSITION', ['TCE123'], 0, 1],
    ['iG1', 'in', 'G', 1470, 1297, '', ['TCE121'], 0, 1],
    ['iG2', 'in', 'G', 1469, 1371, '', ['TCE123'], 0, 1]
  );
  btn('dIKA', 368, 'TCE150_1_IKA', 'CV WARMING AUTO');
  btn('dIKH', 518, 'TCE150_1_IKH', 'CV WARMING MANUAL');
  btn('dIKC', 667, 'TCE150_1_IKC', 'CRT WARMING COMPLETE');
  btn('dJYO', 880, 'TCE150_1_JYO', 'CV WARMING FULL OPEN');
  btn('dJYC', 1166, 'TCE150_1_JYC', 'CV WARMING FULL CLOSE');
  box('a35', 'A', '035', 673, 187);
  box('a2', 'A', '002', 692, 358);
  box('or45', 'OR', '045', 884, 358);
  box('a4', 'A', '004', 1055, 358);
  ffr('ffr6', '006', 1512, 358);
  box('a8', 'A', '008', 690, 508);
  box('a10', 'A', '010', 1053, 508);
  box('not13', 'NOT', '013', 1052, 573);
  box('or44', 'OR', '044', 1394, 520, 106);
  box('a15', 'A', '015', 689, 657);
  box('a19', 'A', '019', 687, 869);
  box('a21', 'A', '021', 1049, 880, 64);
  ffr('ffr22', '022', 1505, 869);
  box('or23', 'OR', '023', 1388, 1030, 128);
  box('a27', 'A', '027', 683, 1156);
  box('a29', 'A', '029', 1046, 1167, 64);
  box('or36', 'OR', '036', 1152, 1156);
  box('tw', 'TW', 'A037', 1045, 1263, 43, {}, 59, ['TW:10.0S']);
  ffr('ffr30', '030', 1502, 1156);
  box('or31', 'OR', '031', 1386, 1243, 128);
  box('not34', 'NOT', '034', 681, 1390);
  box('uck38', 'UCK', '038', 1589, 148, 43, {}, 59, ['K:2.5']);
  box('uck40', 'UCK', '040', 1587, 223, 43, {}, 59, ['K:2.5']);
  box('a39', 'A', '039', 1790, 148);
  box('not14', 'NOT', '014', 1658, 574);
  box('a42', 'A', '042', 1657, 657);
  box('or26', 'OR', '026', 1653, 1063);
  box('a41', 'A', '041', 1618, 1308);
  w.push(
    /* the inputs at the left */
    [
      'iH1',
      [
        [338, 124],
        [1260, 124],
        [1260, 477],
        [1364, 477]
      ]
    ],
    [
      'iBats',
      [
        [337, 176],
        [644, 176]
      ]
    ],
    [
      'kAts',
      [
        [518, 1017],
        [618, 1017],
        [618, 198],
        [644, 198]
      ]
    ],
    [
      'a35',
      [
        [703, 176],
        [836, 176],
        [836, 369],
        [855, 369]
      ]
    ],
    /* CRT AVAILABLE: to the five gates of the operator buttons */
    [
      'iC',
      [
        [336, 304],
        [636, 304],
        [636, 1145],
        [654, 1145]
      ]
    ],
    [
      'iC',
      [
        [636, 347],
        [663, 347]
      ]
    ],
    [
      'iC',
      [
        [636, 497],
        [661, 497]
      ]
    ],
    [
      'iC',
      [
        [636, 646],
        [660, 646]
      ]
    ],
    [
      'iC',
      [
        [636, 858],
        [657, 858]
      ]
    ],
    [
      'dIKA',
      [
        [392, 368],
        [663, 368]
      ]
    ],
    [
      'dIKH',
      [
        [392, 518],
        [661, 518]
      ]
    ],
    [
      'dIKC',
      [
        [392, 667],
        [660, 667]
      ]
    ],
    [
      'dJYO',
      [
        [392, 880],
        [657, 880]
      ]
    ],
    [
      'dJYC',
      [
        [392, 1166],
        [654, 1166]
      ]
    ],
    /* CV warming AUTO */
    [
      'a2',
      [
        [722, 347],
        [855, 347]
      ]
    ],
    [
      'or45',
      [
        [914, 347],
        [1025, 347]
      ]
    ],
    [
      'a4',
      [
        [1085, 347],
        [1472, 347]
      ]
    ],
    /* the CV warming mode: to the AUTO and MANUAL gates, the NOT and the two FULL OPEN / FULL CLOSE gates */
    [
      'iA',
      [
        [329, 805],
        [976, 805]
      ]
    ],
    [
      'iA',
      [
        [1025, 369],
        [976, 369],
        [976, 1188],
        [1016, 1188]
      ]
    ],
    [
      'iA',
      [
        [976, 519],
        [1024, 519]
      ]
    ],
    [
      'iA',
      [
        [976, 562],
        [1023, 562]
      ]
    ],
    [
      'iA',
      [
        [976, 901],
        [1019, 901]
      ]
    ],
    [
      'a8',
      [
        [720, 497],
        [1024, 497]
      ]
    ],
    [
      'a10',
      [
        [1083, 497],
        [1364, 497]
      ]
    ],
    /* the resets: mode not set, all valves not closed, CV warming complete */
    [
      'not13',
      [
        [1082, 562],
        [1364, 562]
      ]
    ],
    [
      'not13',
      [
        [1230, 562],
        [1230, 1252],
        [1357, 1252]
      ]
    ],
    [
      'not13',
      [
        [1230, 1041],
        [1359, 1041]
      ]
    ],
    [
      'kAvc',
      [
        [514, 1379],
        [651, 1379]
      ]
    ],
    [
      'not34',
      [
        [711, 1379],
        [1252, 1379],
        [1252, 519],
        [1364, 519]
      ]
    ],
    [
      'not34',
      [
        [1252, 1020],
        [1359, 1020]
      ]
    ],
    [
      'not34',
      [
        [1252, 1232],
        [1357, 1232]
      ]
    ],
    [
      'iBc',
      [
        [323, 1453],
        [1273, 1453],
        [1273, 541],
        [1364, 541]
      ]
    ],
    [
      'iBc',
      [
        [1273, 998],
        [1359, 998]
      ]
    ],
    [
      'iBc',
      [
        [1273, 1211],
        [1357, 1211]
      ]
    ],
    [
      'or44',
      [
        [1424, 477],
        [1448, 477],
        [1448, 369],
        [1472, 369]
      ]
    ],
    /* AUTO: out, to MANUAL (the NOT) and to the resets of FULL OPEN / FULL CLOSE */
    [
      'ffr6',
      [
        [1552, 347],
        [E, 347]
      ]
    ],
    [
      'ffr6',
      [
        [1596, 347],
        [1596, 276],
        [E, 276]
      ]
    ],
    [
      'ffr6',
      [
        [1596, 347],
        [1596, 755],
        [1337, 755],
        [1337, 1275],
        [1357, 1275]
      ]
    ],
    [
      'ffr6',
      [
        [1596, 564],
        [1629, 564]
      ]
    ],
    [
      'ffr6',
      [
        [1337, 1062],
        [1359, 1062]
      ]
    ],
    [
      'ffr6',
      [
        [1618, 347],
        [1618, 500],
        [E, 500]
      ]
    ],
    [
      'ffr6',
      [
        [1618, 436],
        [1997, 436]
      ]
    ],
    /* MANUAL */
    [
      'not14',
      [
        [1688, 564],
        [E, 564]
      ]
    ],
    [
      'not14',
      [
        [1711, 564],
        [1711, 776]
      ]
    ],
    [
      'not14',
      [
        [E, 776],
        [996, 776],
        [996, 1252],
        [1016, 1252]
      ]
    ],
    [
      'not14',
      [
        [1711, 617],
        [1615, 617],
        [1615, 668],
        [1627, 668]
      ]
    ],
    [
      'not14',
      [
        [1711, 712],
        [1993, 712]
      ]
    ],
    [
      'not14',
      [
        [996, 880],
        [1019, 880]
      ]
    ],
    [
      'not14',
      [
        [996, 1167],
        [1016, 1167]
      ]
    ],
    [
      'a15',
      [
        [719, 646],
        [1627, 646]
      ]
    ],
    [
      'a42',
      [
        [1687, 646],
        [E, 646]
      ]
    ],
    /* FULL OPEN (MANUAL) */
    [
      'a19',
      [
        [717, 858],
        [1019, 858]
      ]
    ],
    [
      'a21',
      [
        [1079, 858],
        [1465, 858]
      ]
    ],
    [
      'a21',
      [
        [1314, 858],
        [1314, 1190],
        [1357, 1190]
      ]
    ],
    [
      'or23',
      [
        [1418, 977],
        [1442, 977],
        [1442, 880],
        [1465, 880]
      ]
    ],
    [
      'ffr22',
      [
        [1545, 858],
        [E, 858]
      ]
    ],
    [
      'ffr22',
      [
        [1590, 858],
        [1590, 1052],
        [1623, 1052]
      ]
    ],
    [
      'ffr22',
      [
        [1590, 989],
        [E, 989]
      ]
    ],
    /* FULL CLOSE (MANUAL) */
    [
      'a27',
      [
        [713, 1145],
        [1016, 1145]
      ]
    ],
    [
      'a29',
      [
        [1076, 1145],
        [1122, 1145]
      ]
    ],
    [
      'tw',
      [
        [1075, 1252],
        [1099, 1252],
        [1099, 1167],
        [1122, 1167]
      ]
    ],
    [
      'kInit',
      [
        [515, 1305],
        [971, 1305],
        [971, 1221],
        [1045, 1221],
        [1045, 1241]
      ]
    ],
    [
      'or36',
      [
        [1182, 1145],
        [1462, 1145]
      ]
    ],
    [
      'or36',
      [
        [1293, 1145],
        [1293, 977],
        [1359, 977]
      ]
    ],
    [
      'kTrip',
      [
        [517, 1083],
        [1359, 1083]
      ]
    ],
    [
      'kTrip',
      [
        [1206, 1083],
        [1206, 1296],
        [1357, 1296]
      ]
    ],
    [
      'or31',
      [
        [1416, 1190],
        [1439, 1190],
        [1439, 1167],
        [1462, 1167]
      ]
    ],
    [
      'ffr30',
      [
        [1542, 1145],
        [E, 1145]
      ]
    ],
    [
      'ffr30',
      [
        [1590, 1145],
        [1590, 1074],
        [1623, 1074]
      ]
    ],
    [
      'ffr30',
      [
        [1590, 1145],
        [1590, 1201],
        [E, 1201]
      ]
    ],
    [
      'or26',
      [
        [1683, 1052],
        [E, 1052]
      ]
    ],
    /* the MSV positions and full close signals to the operator station */
    [
      'iP1',
      [
        [1383, 137],
        [1559, 137]
      ],
      1
    ],
    [
      'iP2',
      [
        [1382, 212],
        [1557, 212]
      ],
      1
    ],
    [
      'uck38',
      [
        [1619, 137],
        [1760, 137]
      ]
    ],
    [
      'uck40',
      [
        [1617, 212],
        [1695, 212],
        [1695, 159],
        [1760, 159]
      ]
    ],
    [
      'a39',
      [
        [1820, 137],
        [2001, 137]
      ]
    ],
    [
      'iG1',
      [
        [1497, 1297],
        [1588, 1297]
      ]
    ],
    [
      'iG2',
      [
        [1496, 1371],
        [1542, 1371],
        [1542, 1319],
        [1588, 1319]
      ]
    ],
    [
      'a41',
      [
        [1648, 1297],
        [1987, 1297]
      ]
    ]
  );
  out('oZ1', 'Z1', 276, ['-'], 1);
  out('oA', 'A', 347, ['TCE150', 'TCE152', 'TCE153', 'TCE154']);
  lamp('lIIA', 2032, 436, 'TCE150_1_IIA');
  out('oA1', 'A1', 500, ['TCA535'], 1);
  out('oB', 'B', 564, ['-']);
  out('oC', 'C', 646, ['TCE152']);
  lamp('lIIH', 2028, 712, 'TCE150_1_IIH');
  out('oB1', 'B1', 776, ['-'], 1);
  out('oD', 'D', 858, ['TCE155']);
  out('oD1', 'D1', 989, ['-'], 1);
  out('oG', 'G', 1052, ['TCE152']);
  out('oE', 'E', 1145, ['TCE155']);
  out('oE1', 'E1', 1201, ['-'], 1);
  lamp('lZSO', 2036, 137, 'TCE150_1_ZSO');
  lamp('lZSC', 2022, 1297, 'TCE150_1_ZSC');
  [
    ['001', 1661, 276],
    ['007', 1660, 436],
    ['012', 1659, 500],
    ['017', 1751, 712],
    ['018', 1751, 776],
    ['024', 1919, 137],
    ['025', 1654, 989],
    ['033', 1661, 1201],
    ['032', 1713, 1297]
  ].forEach(([no, x, y]) => mark(no, x, y));
  t.push(
    [428, 1045, '(TCE051)'],
    [427, 1110, '(TCE053)'],
    [424, 1332, '(TCE050)'],
    [423, 1406, '(TCE162)'],
    [1458, 338, 'T'],
    [1452, 849, 'T'],
    [1449, 1136, 'T'],
    [1002, 1244, 'T'],
    [1763, 270, 'CV CHEST WARMING AUTO MODE'],
    [1759, 341, 'CV WARMING AUTO'],
    [1761, 430, 'CV WARMING AUTO'],
    [1760, 494, 'CV WARMING AUTO'],
    [1756, 558, 'CV WARMING MANUAL'],
    [1755, 640, 'CV WARMING COMPLETE(MANUAL)'],
    [1778, 706, 'CV WARMING MANUAL'],
    [1777, 770, 'CV WARMING MANUAL'],
    [1772, 1046, 'MAN OPE'],
    [229, 1521, 'CONTROLLER:'],
    [391, 1521, 'EHG+MD'],
    [616, 1495, 'TRIGGER  :'],
    [616, 1522, 'CYCLE(ms):30']
  );
  two(1775, 858, 'CV WARMING FULL OPEN', '(MANUAL)');
  two(1771, 1145, 'CV WARMING FULL CLOSE', '(MANUAL)');
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'TCE151',
    title: 'CV WARMING CONTROL(2)',
    page: 108,
    ctl: 'EHG+MD',
    cycle: 30,
    f: [160, 82, 2228, 1543],
    c,
    k: [
      ['kAts', 284, 1017, 'ATS AUTO(C)', 'ref'],
      ['kTrip', 283, 1083, 'TURBINE TRIP', 'ref'],
      ['kInit', 281, 1305, 'INITIAL', 'ref'],
      ['kAvc', 280, 1379, 'ALL VALVE CLOSED', 'ref']
    ],
    d,
    b,
    w,
    t
  });
})();
