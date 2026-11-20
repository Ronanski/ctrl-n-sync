/* TCA633 HP TURBINE WARMING GROUP CONTROL (TE-1,2) (331DM09788 page 158, controller COMM+MD, cycle 100 ms). Typed from the drawing; units =
   the pixels of the page rendered 2296 wide. HP TURBINE WARMING STOP GROUP CONTROL PROGRESS = FFR 002: set (OR 001) by the auto stop
   command (complete) or STOP of the operator station with CRT AVAILABLE (A 005, also out as the stop push button); reset (OR 010) by the
   start group control progress, RESET PB ON, or the stop group control complete. In progress: the CV(B) below seat warming drain valve
   and the cold reheat drain valve get FULL OPEN COMMAND; with the CV(B) drain valve full open (A 024, with ON(1)) (A 012) a flicker
   (FLK A013, T1 2.0 s / T2 30.0 s) or 1800.0 s (TP A015), or 5.0 s in progress (TD A016) with the warming valve full close (A 017), give
   HP TURBINE WARMING VALVE CLOSE COMMAND (OR 014). Drain valve full open and warming valve full close (A 018) = STOP GROUP CONTROL
   COMPLETE. In progress for 2400.0 s (TP A007) without complete (NOT 026, A 025) = STOP GROUP CONTROL TROUBLE. INITIAL clears FLK A013,
   TP A015 and TD A016.
   The words are the ones of the drawing (SOP PB and REHEART as printed; the lamp tags TCA631_1_... as printed on this sheet TCA633).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  /* the stop: OR 001, A 005, FFR 002, and its reset OR 010 */
  W('iB634', [329, 258], [967, 258]);
  W('crtJyp', [369, 385], [646, 385]);
  W('iD', [328, 450], [621, 450], [621, 407], [646, 407]);
  W('a005', [706, 385], [2065, 385]);
  W('a005', [942, 385], [942, 280], [967, 280]);
  W('or001', [1027, 258], [1170, 258]);
  W('iA631', [327, 524], [964, 524]);
  W('iB631', [327, 598], [919, 598], [919, 545], [964, 545]);
  W('or010', [1024, 524], [1158, 524], [1158, 280], [1170, 280]);
  /* INITIAL clears FLK A013, TP A015, TD A016 */
  W('kInit', [438, 161], [1492, 161], [1492, 865]);
  W('kInit', [1492, 610], [1578, 610], [1578, 632]);
  W('kInit', [1492, 738], [1576, 738], [1576, 759]);
  /* the progress: out, the full open commands, A 012, TD A016, TP A007 */
  W('ffr002', [1250, 258], [2066, 258]);
  W('ffr002', [1689, 258], [1689, 154], [2056, 154]);
  W('ffr002', [1689, 258], [1689, 323], [2005, 323]);
  W('ffr002', [1294, 258], [1294, 1237], [1351, 1237]);
  W('ffr002', [1294, 471], [2064, 471]);
  W('ffr002', [1294, 546], [2063, 546]);
  W('ffr002', [1294, 642], [1389, 642]);
  W('ffr002', [1294, 875], [1462, 875]);
  /* the drain valve full open, the warming valve full close */
  W('iB1', [326, 683], [643, 683]);
  W('kOn', [485, 757], [632, 757], [632, 705], [643, 705]);
  W('a024', [703, 683], [1379, 683], [1379, 664], [1389, 664]);
  W('a024', [779, 683], [779, 1013], [799, 1013]);
  W('iH', [323, 949], [1652, 949], [1652, 897], [1663, 897]);
  W('iH', [681, 949], [681, 1035], [799, 1035]);
  /* the warming valve close command: A 012, FLK A013, TP A015, A 017, OR 014 */
  W('a012', [1449, 642], [1547, 642]);
  W('a012', [1472, 642], [1472, 770], [1546, 770]);
  W('flkA013', [1607, 642], [1771, 642]);
  W('tpA015', [1606, 770], [1726, 770], [1726, 664], [1771, 664]);
  W('tdA016', [1522, 875], [1663, 875]);
  W('a017', [1723, 875], [1747, 875], [1747, 685], [1771, 685]);
  W('or014', [1831, 642], [2073, 642]);
  /* the complete, the trouble */
  W('a018', [859, 1013], [2036, 1013]);
  W('a018', [938, 1013], [938, 566], [964, 566]);
  W('a018', [938, 1013], [938, 1342], [1351, 1342]);
  W('a018', [1649, 1013], [1649, 1152], [1971, 1152]);
  W('a018', [1649, 1078], [1963, 1078]);
  W('tpA007', [1411, 1237], [1478, 1237]);
  W('not026', [1411, 1342], [1455, 1342], [1455, 1259], [1478, 1259]);
  W('a025', [1538, 1237], [1972, 1237]);
  W('a025', [1614, 1237], [1614, 1300], [1979, 1300]);
  t.push(
    [335, 227, 'HP TURBINE WARMING AUTO'],
    [335, 248, 'STOP COMMAND (COMPLETE)'],
    [390, 375, 'STOP'],
    [334, 440, 'CRT AVAILABLE'],
    [333, 493, 'HP TURBINE WARMING START'],
    [333, 514, 'GROUP CONTROL PROGRESS'],
    [332, 588, 'HP TURBINE WARMING RESET PB ON'],
    [331, 652, 'CV(B) BEL SEAT SEC'],
    [331, 673, 'DRAIN VALVE FULL OPEN'],
    [329, 918, 'HP TURBINE WARMING VALVE'],
    [329, 939, 'FULL CLOSE'],
    [1886, 144, 'STOP'],
    [1787, 227, 'HP TURBINE WARMING STOP'],
    [1787, 248, 'GROUP CONTROL PROGRESS'],
    [1842, 313, 'STOP'],
    [1841, 375, 'SOP PB'],
    [1789, 440, 'CV(B) BEL SEAT SEC WARMING'],
    [1789, 461, 'DRAIN VALVE FULL OPEN COMMAND'],
    [1788, 515, 'COLD REHEART DRAIN VALVE'],
    [1788, 536, 'FULL OPEN COMMAND'],
    [1847, 611, 'HP TURBINE WARMING VALVE'],
    [1847, 632, 'CLOSE COMMAND'],
    [1739, 982, 'HP TURBINE WARMING STOP'],
    [1739, 1003, 'GROUP CONTROL COMPLETE'],
    [1813, 1068, 'STOP COMP'],
    [1812, 1142, 'STOP COMP'],
    [1684, 1269, 'HP TURBINE WARMING STOP'],
    [1684, 1290, 'GROUP CONTROL TROUBLE'],
    [1162, 246, 'T', 2],
    [1539, 630, 'T', 2],
    [1538, 758, 'T', 2],
    [1454, 863, 'T', 2],
    [1343, 1225, 'T', 2],
    [300, 197, '(TCA100)'],
    [228, 1522, 'CONTROLLER:'],
    [389, 1522, 'COMM+MD'],
    [611, 1495, 'TRIGGER  :'],
    [611, 1522, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA633',
    title: 'HP TURBINE WARMING GROUP CONTROL (TE-1,2)',
    page: 158,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    k: [
      ['kInit', 204, 161, 'INITIAL', 'ref'],
      ['kOn', 251, 757, 'ON(1)', 'sys.ref']
    ],
    c: [
      ['iB634', 'in', 'B', 302, 258, '', ['TCA634']],
      ['iD', 'in', 'D', 301, 450, '', ['TCA631']],
      ['iA631', 'in', 'A', 300, 524, '', ['TCA631']],
      ['iB631', 'in', 'B', 300, 598, '', ['TCA631']],
      ['iB1', 'in', 'B1', 299, 683, '', ['TCA618']],
      ['iH', 'in', 'H', 296, 949, '', ['TCA685']],
      ['oA3', 'out', 'A3', 2083, 154, '', ['-'], 1],
      ['oA', 'out', 'A', 2093, 258, '', ['TCA631']],
      ['oB', 'out', 'B', 2092, 385, '', ['TCA630']],
      ['oA1', 'out', 'A1', 2091, 471, '', ['TCA618']],
      ['oA2', 'out', 'A2', 2090, 546, '', ['-']],
      ['oC', 'out', 'C', 2100, 642, '', ['TCA685']],
      ['oD', 'out', 'D', 2063, 1013, '', ['TCA630']],
      ['oD1', 'out', 'D1', 1998, 1152, '', ['-'], 1],
      ['oB1', 'out', 'B1', 2006, 1300, '', ['-'], 1]
    ],
    d: [
      ['crtJyp', 334, 385, 'in', 'TCA631_1_JYP', 'R', '#1C'],
      ['crtYip', 2040, 323, 'out', 'TCA631_1_YIP', 'S', '#1C'],
      ['crtPipc', 1998, 1078, 'out', 'TCA631_1_PIPC', 'S', '#1C'],
      ['crtPabn', 2007, 1237, 'out', 'TCA631_1_PABN', 'S', '#1C']
    ],
    b: [
      ['or001', 'OR', '001', 997, 269],
      ['ffr002', 'FFR', '002', 1210, 269, [], { l: ['S', 'R'] }, [80, 43]],
      ['btr003', 'o:BTR', '003', 1752, 323],
      ['btr004', 'o:BTR', '004', 1796, 154],
      ['a005', 'A', '005', 676, 396],
      ['tpA007', 'TP', 'A007', 1381, 1248, ['TP:2400.0s']],
      ['btr009', 'o:BTR', '009', 1657, 1300],
      ['or010', 'OR', '010', 994, 545, [], {}, [60, 65]],
      ['a012', 'A', '012', 1419, 653],
      ['flkA013', 'FLK', 'A013', 1577, 653, ['T1:2.0s', 'T2:30.0s']],
      ['or014', 'OR', '014', 1801, 664, [], {}, [60, 65]],
      ['tpA015', 'TP', 'A015', 1576, 781, ['TP:1800.0s']],
      ['tdA016', 'TD', 'A016', 1492, 886, ['TD:5.0s']],
      ['a017', 'A', '017', 1693, 886],
      ['a018', 'A', '018', 829, 1024],
      ['btr019', 'o:BTR', '019', 1724, 1078],
      ['btr020', 'o:BTR', '020', 1723, 1152],
      ['btr021', 'o:BTR', '021', 1751, 385],
      ['btr022', 'o:BTR', '022', 1750, 471],
      ['btr023', 'o:BTR', '023', 1750, 546],
      ['a024', 'A', '024', 673, 694],
      ['a025', 'A', '025', 1508, 1248],
      ['not026', 'NOT', '026', 1381, 1353]
    ],
    w,
    j: [
      [942, 385],
      [1492, 610],
      [1492, 738],
      [1689, 258],
      [1294, 258],
      [1294, 471],
      [1294, 546],
      [1294, 642],
      [1294, 875],
      [779, 683],
      [681, 949],
      [1472, 642],
      [938, 1013],
      [1649, 1013],
      [1649, 1078],
      [1614, 1237]
    ],
    t
  });
})();
