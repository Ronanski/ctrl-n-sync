/* TCA101 CONTROLLER CONDITION(2) (331DM09788 page 35, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. The network and battery alarms of the controller: GR1A-ST12 / ST13 not received for 5.0 s (TP A007 / A012, cleared by
   INITIAL) set FFS 008 = EHG(A) CPU NORECEIVE and FFS 013 = EHG(B) CPU NORECEIVE; both (A 004), or OFF(0) by SIMULATION USE (DSW 003), give
   NETWORK ABNORMAL (EHG CPU NoReceive). BATTERYERR sets FFS 017 = MYDATA_D_EX9; with the other controller's battery error (YOURDATA_D_EX9,
   MYCTL-A / MYCTL-B, YOURCTL1ERR over A 019 .. A 024, OR 021 / 022) it gives ATS BATTERYERR (OR 018). ANN RESET resets the three FFS.
   Each alarm also goes to the operator station (CRT TCA101_1 .. _4) and to a line out; INITIAL gives TCS HMI SELECTED (BTR 027).
   The words are the ones of the drawing.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    d = [],
    b = [],
    w = [],
    j = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  /* one alarm: [source key, y of its line, x of the riser, x of the BTR, x of the CRT, tag, y of the CRT row, letter + '1', y of its row,
     letter, x of its connector, its sheet, words of the two upper rows, words of the line, x of the words] */
  [
    [
      'dsw003',
      246,
      1454,
      1495,
      1973,
      'TCA101_1',
      140,
      'A1',
      194,
      'A',
      2027,
      '-',
      'EHG CPU NORECEIVE(ATS)',
      'NETWORK ABNORMAL(EHG CPU NoReceive)',
      1586
    ],
    [
      'ffs008',
      406,
      1452,
      1494,
      1972,
      'TCA101_2',
      301,
      'D1',
      354,
      'D',
      2025,
      '-',
      'EHG(A)CPU NORECEIVE(ATS)',
      'EHG(A)CPU NORECEIVE',
      1585
    ],
    [
      'ffs013',
      566,
      1451,
      1493,
      1971,
      'TCA101_3',
      461,
      'E1',
      514,
      'E',
      2024,
      '-',
      'EHG(B)CPU NORECEIVE(ATS)',
      'EHG(B)CPU NORECEIVE',
      1583
    ],
    [
      'or018',
      726,
      1449,
      1492,
      1970,
      'TCA101_4',
      622,
      'F1',
      674,
      'F',
      2022,
      'TCA822',
      'ATS BATTERYERR',
      'ATS BATTERYERR',
      1580
    ]
  ].forEach(([key, y, rx, bx, dx, tag, y1, l1, y2, l, cx, sh, s1, s2, tx], i) => {
    d.push(['crt' + (i + 1), dx, y1, 'out', tag, 'S', '#1C']);
    c.push(['o' + l1, 'out', l1, dx, y2, '', ['-'], 1], ['o' + l, 'out', l, cx, y, '', [sh]]);
    W(key, [rx, y], [rx, y1], [dx - 35, y1]);
    W(key, [rx, y2], [dx - 27, y2]);
    j.push([rx, y], [rx, y2]);
    const n = [1, 5, 10, 15][i];
    b.push(
      ['btr' + n, 'o:BTR', ('00' + n).slice(-3), bx, y1],
      ['btr' + (n + 1), 'o:BTR', ('00' + (n + 1)).slice(-3), bx, y2]
    );
    t.push([tx, y1 - 10, s1], [tx, y2 - 10, s1], [tx - 3, y - 10, s2]);
  });
  b.push(
    ['dsw003', 'DSW', '003', 1240, 257],
    ['a004', 'A', '004', 1102, 278],
    ['tpA007', 'TP', 'A007', 727, 416, ['TP:5.0S']],
    ['ffs008', 'FFS', '008', 929, 416, [], { l: ['S', 'R'] }, [80, 43]],
    ['btr009', 'o:BTR', '009', 1365, 406],
    ['tpA012', 'TP', 'A012', 725, 577, ['TP:5.0S']],
    ['ffs013', 'FFS', '013', 927, 577, [], { l: ['S', 'R'] }, [80, 43]],
    ['btr014', 'o:BTR', '014', 1364, 566],
    ['ffs017', 'FFS', '017', 926, 737, [], { l: ['S', 'R'] }, [80, 43]],
    ['or018', 'OR', '018', 1363, 737],
    ['a019', 'A', '019', 722, 950],
    ['a020', 'A', '020', 881, 950],
    ['or021', 'OR', '021', 1096, 950],
    ['or022', 'OR', '022', 1233, 950],
    ['a023', 'A', '023', 880, 1035],
    ['a024', 'A', '024', 1094, 1088],
    ['not025', 'NOT', '025', 613, 1152],
    ['not026', 'NOT', '026', 878, 1258],
    ['btr027', 'o:BTR', '027', 1605, 908]
  );
  /* SIMULATION USE, OFF(0), INITIAL */
  W('kSim', [522, 149], [1240, 149], [1240, 236]);
  W('kOff', [521, 246], [1210, 246]);
  W('kInit', [520, 320], [727, 320], [727, 395]);
  W('kInit', [662, 320], [662, 908], [1860, 908]);
  W('kInit', [662, 523], [725, 523], [725, 556]);
  /* the two network lines */
  W('kSt12', [519, 406], [697, 406]);
  W('tpA007', [757, 406], [889, 406]);
  W('ffs008', [969, 406], [1998, 406]);
  W('ffs008', [1015, 406], [1015, 268], [1072, 268]);
  W('kSt13', [518, 566], [695, 566]);
  W('tpA012', [755, 566], [887, 566]);
  W('ffs013', [967, 566], [1997, 566]);
  W('ffs013', [1036, 566], [1036, 289], [1072, 289]);
  W('a004', [1132, 268], [1210, 268]);
  W('dsw003', [1270, 246], [2000, 246]);
  /* ANN RESET to the three FFS */
  W('kAnn', [515, 832], [830, 832], [830, 427], [889, 427]);
  W('kAnn', [830, 588], [887, 588]);
  W('kAnn', [830, 748], [886, 748]);
  /* the battery */
  W('kBat', [516, 726], [886, 726]);
  W('ffs017', [966, 726], [1333, 726]);
  W('ffs017', [1022, 726], [1022, 1078], [1064, 1078]);
  W('ffs017', [1022, 822], [1862, 822]);
  W('or018', [1393, 726], [1995, 726]);
  W('kYd', [514, 939], [692, 939]);
  W('kYc', [512, 1141], [583, 1141]);
  W('not025', [643, 1141], [668, 1141], [668, 960], [692, 960]);
  W('a019', [752, 939], [851, 939]);
  W('a019', [808, 939], [808, 1024], [850, 1024]);
  W('kMb', [513, 1045], [850, 1045]);
  W('kMa', [511, 1247], [848, 1247]);
  W('kMa', [826, 1247], [826, 960], [851, 960]);
  W('a020', [911, 939], [1066, 939]);
  W('a023', [910, 1024], [1042, 1024], [1042, 960], [1066, 960]);
  W('or021', [1126, 939], [1203, 939]);
  W('not026', [908, 1247], [1019, 1247], [1019, 1099], [1064, 1099]);
  W('a024', [1124, 1078], [1180, 1078], [1180, 960], [1203, 960]);
  W('or022', [1263, 939], [1308, 939], [1308, 748], [1333, 748]);
  j.push(
    [662, 320],
    [662, 523],
    [1015, 406],
    [1036, 566],
    [830, 588],
    [830, 748],
    [1022, 726],
    [1022, 822],
    [808, 939],
    [826, 1247]
  );
  t.push(
    [689, 394, 'C', 2],
    [687, 554, 'C', 2],
    [881, 394, 'C', 2],
    [879, 554, 'C', 2],
    [878, 714, 'C', 2],
    [391, 185, '(TCA102)'],
    [384, 868, '(TCA100)'],
    [225, 1526, 'CONTROLLER:'],
    [387, 1526, 'COMM+MD'],
    [612, 1500, 'TRIGGER  :'],
    [612, 1527, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA101',
    title: 'CONTROLLER CONDITION(2)',
    page: 35,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    k: [
      ['kSim', 288, 149, 'SIMULATION USE', 'ref'],
      ['kOff', 287, 246, 'OFF(0)', 'sys.ref'],
      ['kInit', 286, 320, 'INITIAL', 'ref'],
      ['kSt12', 285, 406, 'GR1A-ST12_NoReceived', 'sys.ref'],
      ['kSt13', 284, 566, 'GR1A-ST13_NoReceived', 'sys.ref'],
      ['kBat', 282, 726, 'BATTERYERR', 'sys.ref'],
      ['kAnn', 281, 832, 'ANN RESET', 'ref'],
      ['kYd', 280, 939, 'YOURDATA_D_EX9', 'sys.ref'],
      ['kMb', 279, 1045, 'MYCTL-B', 'sys.ref'],
      ['kYc', 278, 1141, 'YOURCTL1ERR', 'sys.ref'],
      ['kMa', 277, 1247, 'MYCTL-A', 'sys.ref'],
      ['dMy', 1862, 822, 'MYDATA_D_EX9', 'sys.def', 'def'],
      ['dHmi', 1860, 908, 'TCS HMI SELECTED', 'def', 'def']
    ],
    c,
    d,
    b,
    w,
    j,
    t
  });
})();
