/* TCA826 ALARM (331DM09788 page 233, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn:
   - LP EXHAUST HOOD WATER SPRAY VALVE OPEN (A2, TCA738) and HOUSE LOAD OPERATION (F1, TCE250) into AND 001, through TP 002
     (TP:7200s, INITIAL on its top) to set FFR 003. HOUSE LOAD OPERATION through TP 006 (TP:2.0s, INITIAL on its top) and NOT
     007, LP EXHAUST HOOD STEAM VALVE CLOSED (A3, TCA738) and TURBINE TRIP (B1, TCA825) into OR 008, which resets FFR 003.
     FFR 003 = HOUSE LOAD OPERATION OVER 2HOURS: through BTR 004 to A1 (-) and through BTR 005 to CRT TCA826_1.
   - GEN. VOLTAGE OK (A7, TCA045) through TD A009 (TD:5.0s, INITIAL on its top) gates three ANDs: with RSR DIODE FAULT
     (A3, TCA049) AND 010, with GEN. FIELD EARTH FAULT (A8, TCA041) AND 014, with 30DF/64F RELAY TROUBLE (A10, TCA049) AND 017.
     AND 017 or 30DF/64F LOSS OF CONTROL POWER (A11, TCA049) = OR 018.
   - AND 010 or OR 018 = OR 011: RSR DIODE FAULT(30DF) OPERATED/RELAY TROUBLE, BTR 012 to A2 (-), BTR 013 to CRT TCA826_2.
   - AND 014 or OR 018 = OR 015: GEN. FIELD EARTH FAULT(84F) OPERATED/RELAY TROUBLE, BTR 016 to A3 (-), BTR 019 to CRT
     TCA826_3.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    b = [],
    c = [],
    d = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const j = [
    [739, 162],
    [739, 430],
    [675, 474],
    [917, 730],
    [917, 899],
    [1258, 920],
    [1602, 303],
    [1598, 730],
    [1597, 899]
  ];
  c.push(
    ['i1', 'in', 'A2', 355, 303, '', ['TCA738'], 0, 1],
    ['i2', 'in', 'F1', 352, 474, '', ['TCE250'], 0, 1],
    ['i3', 'in', 'A3', 352, 559, '', ['TCA738'], 0, 1],
    ['i4', 'in', 'B1', 352, 644, '', ['TCA825'], 0, 1],
    ['i5', 'in', 'A7', 351, 730, '', ['TCA045'], 0, 1],
    ['i6', 'in', 'A3', 351, 816, '', ['TCA049'], 0, 1],
    ['i7', 'in', 'A8', 350, 921, '', ['TCA041'], 0, 1],
    ['i8', 'in', 'A10', 350, 1006, '', ['TCA049'], 0, 1],
    ['i9', 'in', 'A11', 350, 1091, '', ['TCA049'], 0, 1],
    ['oA1', 'out', 'A1', 2060, 303, '', ['-'], 0, 1],
    ['oA2', 'out', 'A2', 2056, 730, '', ['-'], 0, 1],
    ['oA3', 'out', 'A3', 2055, 899, '', ['-'], 0, 1]
  );
  b.push(
    ['and001', 'AND', '001', 835, 313.5],
    ['tp002', 'TP', '002', 997, 313, ['TP:7200s']],
    ['ffr003', 'FFR', '003', 1465, 314, [], { l: ['S', 'R'] }, [80, 43]],
    ['btr004', 'o:BTR', '004', 1632, 303],
    ['btr005', 'o:BTR', '005', 1632, 388],
    ['tp006', 'TP', '006', 834, 485, ['TP:2.0s']],
    ['not007', 'NOT', '007', 996, 478],
    ['or008', 'OR', '008', 1314.5, 495, [], {}, [57, 64]],
    ['tdA009', 'TD', 'A009', 831, 740, ['TD:5.0s']],
    ['and010', 'AND', '010', 993, 740.5],
    ['or011', 'OR', '011', 1312.5, 740.5],
    ['btr012', 'o:BTR', '012', 1632, 730],
    ['btr013', 'o:BTR', '013', 1632, 815],
    ['and014', 'AND', '014', 992, 909.5],
    ['or015', 'OR', '015', 1311, 909.5],
    ['btr016', 'o:BTR', '016', 1632, 899],
    ['and017', 'AND', '017', 991, 995],
    ['or018', 'OR', '018', 1151, 995],
    ['btr019', 'o:BTR', '019', 1632, 985]
  );
  d.push(
    ['crt1', 2057, 388, 'out', 'TCA826_1', 'S', '#1C'],
    ['crt2', 2057, 815, 'out', 'TCA826_2', 'S', '#1C'],
    ['crt3', 2057, 985, 'out', 'TCA826_3', 'S', '#1C']
  );
  /* INITIAL to the tops of TP 002, TP 006 and TD A009 */
  W('kInit', [496, 162], [998, 162], [998, 291.4]);
  W('kInit', [739, 162], [739, 686], [831, 686], [831, 718.4]);
  W('kInit', [739, 430], [834, 430], [834, 463.4]);
  /* house load over 2 hours */
  W('i1', [382, 303], [806, 303]);
  W('i2', [379, 474], [805, 474]);
  W('i2', [675, 474], [675, 324], [806, 324]);
  W('and001', [864, 303], [968, 303]);
  W('tp002', [1026, 303], [1425, 303]);
  W('tp006', [863, 474], [967, 474]);
  W('not007', [1025, 474], [1286, 474]);
  W('i3', [379, 559], [1240, 559], [1240, 495], [1286, 495]);
  W('i4', [379, 644], [1260, 644], [1260, 516], [1286, 516]);
  W('or008', [1343, 474], [1399, 474], [1399, 324.5], [1425, 324.5]);
  W('ffr003', [1505, 303], [2060 - 27, 303]);
  W('ffr003', [1602, 303], [1602, 388], [2057 - 35, 388]);
  /* generator faults */
  W('i5', [378, 730], [802, 730]);
  W('tdA009', [860, 730], [964, 730]);
  W('tdA009', [917, 730], [917, 984], [962, 984]);
  W('tdA009', [917, 899], [963, 899]);
  W('i6', [378, 816], [940, 816], [940, 751], [964, 751]);
  W('i7', [377, 921], [963, 921]);
  W('i8', [377, 1006], [962, 1006]);
  W('i9', [377, 1091], [1096, 1091], [1096, 1006], [1122, 1006]);
  W('and010', [1022, 730], [1284, 730]);
  W('and014', [1021, 899], [1282, 899]);
  W('and017', [1020, 984], [1122, 984]);
  W('or018', [1180, 984], [1258, 984], [1258, 751], [1284, 751]);
  W('or018', [1258, 920], [1282, 920]);
  W('or011', [1341, 730], [2056 - 27, 730]);
  W('or011', [1598, 730], [1598, 815], [2057 - 35, 815]);
  W('or015', [1340, 899], [2055 - 27, 899]);
  W('or015', [1597, 899], [1597, 985], [2057 - 35, 985]);
  t.push(
    [387, 273, 'LP EXHAUST HOOD WATER'],
    [387, 295, 'SPRAY VALVE OPEN'],
    [385, 466, 'HOUSE LOAD OPERATION'],
    [385, 529, 'LP EXHAUST HOOD'],
    [385, 551, 'STEAM VALVE CLOSED'],
    [384, 636, 'TURBINE TRIP'],
    [384, 722, 'GEN. VOLTAGE OK'],
    [384, 808, 'RSR DIODE FAULT'],
    [383, 913, 'GEN. FIELD EARTH FAULT'],
    [382, 998, '30DF/64F RELAY TROUBLE'],
    [382, 1083, '30DF/64F LOSS OF CONTROL POWER'],
    [953, 295, 'T'],
    [1410, 295, 'T'],
    [790, 466, 'T'],
    [788, 722, 'T'],
    [1693, 273, 'HOUSE LOAD OPERATION'],
    [1693, 295, 'OVER 2HOURS'],
    [1693, 358, 'HOUSE LOAD OPERATION'],
    [1693, 380, 'OVER 2HOURS'],
    [1689, 700, 'RSR DIODE FAULT(30DF)'],
    [1689, 722, 'OPERATED/RELAY TROUBLE'],
    [1689, 785, 'RSR DIODE FAULT(30DF)'],
    [1689, 807, 'OPERATED/RELAY TROUBLE'],
    [1688, 869, 'GEN. FIELD EARTH FAULT(84F)'],
    [1688, 891, 'OPERATED/RELAY TROUBLE'],
    [1688, 955, 'GEN. FIELD EARTH FAULT(84F)'],
    [1688, 977, 'OPERATED/RELAY TROUBLE'],
    [395, 198, '(TCA100)'],
    [230, 1516, 'CONTROLLER:'],
    [389, 1516, 'COMM+MD'],
    [614, 1494, 'TRIGGER  :'],
    [614, 1522, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA826',
    title: 'ALARM',
    page: 233,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [162, 76, 2224, 1540],
    k: [['kInit', 263, 162, 'INITIAL', 'ref']],
    c,
    d,
    b,
    w,
    j,
    t
  });
})();
