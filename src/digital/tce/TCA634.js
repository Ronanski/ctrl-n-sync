/* TCA634 HP TURBINE WARMING GROUP CONTROL (TE-1,2) (331DM09788 page 159, controller COMM+MD, cycle 100 ms). Typed from the drawing; units =
   the pixels of the page rendered 2296 wide. The warming time of the HP turbine from the first stage inner wall metal temp.:
   - HP TURBINE WARMING COMPLETE (OR 003) = the metal temp. over 150 degC (CMP A001 HL 150 / LL 145 degC) for 13800 s (TP A002, 230 min), or the
     warming done by its holding time (FFS 006);
   - the holding time: the temp. held (HLD 014) while the start group control progress (FFR 017, set by the progress, reset by OR 018 of the
     warming not complete or the auto control reset condition) runs under 150 degC (A 019 holds the integrator); FG A007 (table *1) gives the
     time in min, G A008 (K 60.0) in s (PA1 005); the integrator I A023 (SG A022 K 1.0, TI 60.0 s, HL 230.0, LL 0.0) counts it; SUB 020 and
     LMS A021 (HL 228.0 / LL 0.0) give what is left, ASW 025 switches it to 0.0 (SG 024) once FFS 006 is set; out to the operator station
     (CRT TCA634_A1) and C1;
   - FFS 006 is set when the metal temp. was over 150 degC (TP A005) and reset (OR 011) by TURBINE TRIP (TW A010, 2.0 s) or the trip with
     TP A013 (7200 s, 120 min, started while FFS 006 is not set);
   - HP TURBINE WARMING AUTO STOP COMMAND (COMPLETE) = A 009 of the temp. over 150 degC, the auto control progress and the start group
     control complete.
   INITIAL clears CMP A001, TP A002, TP A005, TW A010 and TP A013.
   The words are the ones of the drawing (HP TURBINE\ FIRST STG with its backslash, and the TP over the input of PA1 005, as printed).
   live: TURBINE TRIP from the engine (tcs.js tcsLiveRead); the engine holds no state of the other signals. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    l = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const T = (key, ...pts) => w.push([key, pts, 1]);
  /* INITIAL: CMP A001, TP A005, TP A002, TP A013, TW A010 */
  W('kInit', [445, 149], [1369, 149], [1369, 233]);
  W('kInit', [887, 149], [887, 233]);
  W('kInit', [1250, 149], [1250, 318]);
  W('kInit', [1300, 149], [1300, 659], [1246, 659], [1246, 818]);
  W('kInit', [1300, 659], [1365, 659], [1365, 691]);
  /* the metal temp.: CMP A001, the hold HLD 014 */
  T('iA1', [325, 244], [857, 244]);
  T('iA1', [833, 244], [833, 436], [857, 436]);
  W('cmpA001', [917, 244], [1338, 244]);
  W('cmpA001', [973, 244], [973, 350], [996, 350]);
  W('cmpA001', [1176, 244], [1176, 329], [1220, 329]);
  W('tpA002', [1398, 244], [1722, 244]);
  /* the start group control progress: FFR 017, its reset OR 018, A 019 */
  W('iA631', [325, 372], [729, 372]);
  W('iAc', [325, 447], [643, 447]);
  W('iC631', [325, 521], [629, 521], [629, 468], [643, 468]);
  W('or018', [702, 447], [716, 447], [716, 394], [729, 394]);
  W('ffr017', [809, 372], [996, 372]);
  W('ffr017', [886, 372], [886, 425]);
  W('a019', [1056, 350], [1079, 350], [1079, 542]);
  /* the holding time: FG A007, G A008, the integrator I A023, SUB 020, LMS A021, ASW 025 */
  T('hld014', [917, 436], [996, 436]);
  T('fgA007', [1056, 436], [1124, 436]);
  T('fgA007', [1100, 436], [1100, 532], [1220, 532]);
  T('gA008', [1183, 436], [1220, 436]);
  T('sgA022', [968, 553], [1037, 553]);
  T('kZero', [986, 649], [1013, 649], [1013, 574], [1037, 574]);
  T('kZero', [1013, 595], [1037, 595]);
  T('iA023', [1118, 553], [1220, 553]);
  T('sub020', [1277, 532], [1336, 532]);
  T('lmsA021', [1395, 532], [1569, 532]);
  T('sg024', [1396, 446], [1441, 446], [1441, 511], [1569, 511]);
  T('asw025', [1628, 511], [1948, 511]);
  T('asw025', [1738, 511], [1738, 575], [1954, 575]);
  /* FFS 006: set by TP A005, reset by OR 011 */
  W('tpA005', [1279, 329], [1550, 329]);
  W('tpA005', [1505, 329], [1505, 425], [1720, 425]);
  W('ffs006', [1630, 329], [1654, 329], [1654, 266], [1722, 266]);
  W('ffs006', [1654, 329], [1654, 904], [1182, 904], [1182, 829], [1216, 829]);
  W('ffs006', [1654, 458], [1599, 458], [1599, 500]);
  W('kTrip', [443, 702], [1335, 702]);
  W('kTrip', [1300, 702], [1300, 808], [1334, 808]);
  W('twA010', [1394, 702], [1442, 702]);
  W('tpA013', [1276, 829], [1334, 829]);
  W('a012', [1393, 819], [1418, 819], [1418, 723], [1442, 723]);
  W('or011', [1500, 702], [1537, 702], [1537, 351], [1550, 351]);
  /* the outs: complete, auto stop command (complete) */
  W('or003', [1780, 244], [2054, 244]);
  W('iD630', [325, 957], [1672, 957], [1672, 447], [1720, 447]);
  W('iA7', [325, 1053], [1692, 1053], [1692, 469], [1720, 469]);
  W('a009', [1779, 425], [2053, 425]);
  /* table *1 of FG A007: NO., Xn(degC), Yn(min), eight rows */
  const row = k => Math.round(1255 + 21.4 * k);
  [1233, ...Array.from({ length: 9 }, (_, k) => row(k))].forEach(y =>
    l.push([
      [295, y],
      [487, y]
    ])
  );
  [295, 326, 414, 487].forEach(x =>
    l.push([
      [x, 1233],
      [x, row(8)]
    ])
  );
  t.push([296, 1226, '*1'], [310, 1249, 'NO.', 1], [370, 1249, 'Xn(degC)', 1], [450, 1249, 'Yn(min)', 1]);
  [
    ['0.0', '228.0'],
    ['95.0', '150.0'],
    ['110.0', '132.0'],
    ['125.0', '105.0'],
    ['135.0', '75.0'],
    ['140.0', '57.0'],
    ['145.0', '33.0'],
    ['150.0', '0.1']
  ].forEach(([x, y], k) => t.push([310, row(k) + 16, String(k), 1], [386, row(k) + 16, x, 2], [470, row(k) + 16, y, 2]));
  t.push(
    [331, 213, 'HP TURBINE\\ FIRST STG'],
    [331, 234, 'INNER WALL METAL TEMP.'],
    [331, 341, 'HP TURBINE WARMING START'],
    [331, 362, 'GROUP CONTROL PROGRESS'],
    [331, 416, 'HP TURBINE WARMING'],
    [331, 437, 'COMPLETE'],
    [331, 490, 'HP TURBINE WARMING AUTO'],
    [331, 511, 'CONTROL RESET CONDITION'],
    [329, 926, 'HP TURBINE WARMING AUTO'],
    [329, 947, 'CONTROL PROGRESS'],
    [329, 1022, 'HP TURBINE WARMING START'],
    [329, 1043, 'GROUP CONTROL COMPLETE'],
    [1786, 213, 'HP TURBINE WARMING'],
    [1786, 234, 'COMPLETE'],
    [1785, 394, 'HP TURBINE WARMING AUTO'],
    [1785, 415, 'STOP COMMAND (COMPLETE)'],
    [1808, 501, 'HOLDING TIME'],
    [1808, 565, 'HOLDING TIME'],
    [994, 414, '*1'],
    [1112, 415, '(min-sec)'],
    [849, 232, 'T', 2],
    [721, 360, 'T', 2],
    [1212, 317, 'T', 2],
    [1330, 232, 'T', 2],
    [1542, 317, 'T', 2],
    [1029, 541, 'T', 2],
    [1327, 690, 'T', 2],
    [1208, 817, 'T', 2],
    [1220, 431, 'TP', 2],
    [342, 193, '(TCA100)'],
    [329, 746, '(TCA103)'],
    [230, 1522, 'CONTROLLER:'],
    [391, 1522, 'COMM+MD'],
    [614, 1495, 'TRIGGER  :'],
    [614, 1522, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA634',
    title: 'HP TURBINE WARMING GROUP CONTROL (TE-1,2)',
    page: 159,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    live: { kTrip: 'trip' },
    k: [
      ['kInit', 211, 149, 'INITIAL', 'ref'],
      ['kZero', 751, 649, '0.0', 'sys.ref'],
      ['kTrip', 209, 702, 'TURBINE TRIP', 'ref']
    ],
    c: [
      ['iA1', 'in', 'A1', 298, 244, '', ['TCA360']],
      ['iA631', 'in', 'A', 298, 372, '', ['TCA631']],
      ['iAc', 'in', 'A', 298, 447, '', ['*']],
      ['iC631', 'in', 'C', 298, 521, '', ['TCA631']],
      ['iD630', 'in', 'A', 296, 957, '', ['TCA630']],
      ['iA7', 'in', 'A7', 296, 1053, '', ['TCA632']],
      ['oA', 'out', 'A', 2081, 244, '', ['TCA511', 'TCA512', 'TCA535', '*'], 0, 1],
      ['oB', 'out', 'B', 2080, 425, '', ['TCA633']],
      ['oC1', 'out', 'C1', 1981, 575, '', ['-'], 1]
    ],
    d: [['crtA1', 1983, 511, 'out', 'TCA634_A1', 'S', '#1C']],
    b: [
      ['cmpA001', 'CMP', 'A001', 887, 255, ['HL:150deg.C', 'LL:145deg.C']],
      ['tpA002', 'TP', 'A002', 1368, 255, ['TP:13800s', '(230min)']],
      ['or003', 'OR', '003', 1751, 255],
      ['pa1005', 'PA1', '005', 1249, 436, [], {}, [58, 65]],
      ['tpA005', 'TP', 'A005', 1250, 340],
      ['ffs006', 'FFS', '006', 1590, 340, [], { l: ['S', 'R'] }, [80, 43]],
      ['fgA007', 'FG', 'A007', 1026, 447],
      ['gA008', 'G', 'A008', 1154, 447, ['K:60.0']],
      ['a009', 'A', '009', 1750, 447, [], {}, [60, 64]],
      ['twA010', 'TW', 'A010', 1365, 712, ['TW:2.0s']],
      ['or011', 'OR', '011', 1471, 712],
      ['a012', 'A', '012', 1364, 819],
      ['tpA013', 'TP', 'A013', 1246, 840, ['TP:7200s', '(120min)']],
      ['hld014', 'HLD', '014', 887, 447],
      ['ftr015', 'o:FTR', '015', 1770, 511],
      ['ftr016', 'o:FTR', '016', 1770, 575],
      ['ffr017', 'FFR', '017', 769, 383, [], { l: ['S', 'R'] }, [80, 43]],
      ['or018', 'OR', '018', 673, 458],
      ['a019', 'A', '019', 1026, 361],
      ['sub020', 'SUB', '020', 1248, 542, [], { l: ['+', '-'] }],
      ['lmsA021', 'LMS', 'A021', 1366, 542, ['HL:228.0', 'LL:0.0']],
      ['sgA022', 'SG', 'A022', 938, 564, ['K:1.0']],
      ['iA023', 'I', 'A023', 1077, 574, ['TI:60.0S', 'HL:230.0', 'LL:0.0'], { l: ['X', 'F', 'Z'] }, [81, 64]],
      ['sg024', 'SG', '024', 1366, 457, ['K:0.0']],
      ['asw025', 'ASW', '025', 1599, 521],
      ['x1', 'X', '', 619, 447],
      ['x2', 'X', '', 1182, 861]
    ],
    w,
    l,
    j: [
      [887, 149],
      [1250, 149],
      [1300, 149],
      [1300, 659],
      [833, 244],
      [973, 244],
      [1176, 244],
      [886, 372],
      [1100, 436],
      [1013, 595],
      [1738, 511],
      [1505, 329],
      [1654, 329],
      [1654, 458],
      [1300, 702]
    ],
    t
  });
})();
