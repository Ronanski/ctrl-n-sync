/* TCA547 CRITERIA CONDITION (331DM09788 page 117, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. The speed criteria of the rub check, from TURBINE SPEED:
   - CRI 2.3 TURBINE RUBCHECK COMPLETE SPEED (OR 011) = the speed once over 150 rpm (CMP A001 HL 150.0 / LL 145.0, held by FFR 002) and then
     under 100 rpm (CPL A006 HL 105.0 / LL 100.0) with ALL VALVE CLOSED (A 003, held by FFR 004), or the speed over 250 rpm (CMP A008
     HL 250.0 / LL 245.0), or RUB CHECK BYPASS. FFR 002 is reset by over 250 rpm or TURBINE TRIP (OR 009), FFR 004 by TURBINE TRIP;
   - CRI 2.4 TURBINE RATED SPEED = the speed over 3550 rpm (CMP A010 HL 3550.0 / LL 3540.0);
   - RUB CHECK UNAVOIDABLE = AMB. COLD MODE or COLD1 MODE (OR 012);
   - RUB CHECK BYPASS = FFR 015: set by its push button of the operator station with CRT AVAILABLE (A 014); reset (OR 017) by rub check
     unavoidable, TURBINE TRIP (TW 018, 1.0 s) or the RUB CHECK REQUIRED push button (A 020). Its NOT 021 = RUB CHECK REQUIRED.
   INITIAL clears CMP A001, A008, A010 and TW 018.
   The words are the ones of the drawing (the lamp tags TCA754_... as printed on this sheet TCA547).
   live: TURBINE SPEED and TURBINE TRIP from the engine (tcs.js tcsLiveRead); the engine holds no state of the other signals. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const T = (key, ...pts) => w.push([key, pts, 1]);
  /* INITIAL: CMP A001, A008, A010, TW 018 */
  W('kInit', [456, 164], [630, 164], [630, 795], [914, 795], [914, 1206]);
  W('kInit', [630, 227], [738, 227], [738, 259]);
  W('kInit', [630, 579], [735, 579], [735, 611]);
  W('kInit', [733, 795], [733, 813]);
  /* TURBINE SPEED to the four compares */
  T('kSpeed', [455, 270], [708, 270]);
  T('kSpeed', [608, 270], [608, 824], [703, 824]);
  T('kSpeed', [608, 430], [707, 430]);
  T('kSpeed', [608, 622], [705, 622]);
  /* over 150 rpm, then under 100 rpm with all valves closed */
  W('cmpA001', [768, 270], [1019, 270]);
  W('ffr002', [1099, 270], [1240, 270]);
  W('kAvc', [455, 376], [1195, 376], [1195, 292], [1240, 292]);
  W('cplA006', [767, 430], [1216, 430], [1216, 313], [1240, 313]);
  W('a003', [1300, 270], [1453, 270]);
  W('ffr004', [1533, 270], [1666, 270]);
  /* over 250 rpm: resets FFR 002 (OR 009, with TURBINE TRIP) and gives the criterion */
  W('cmpA008', [765, 622], [1621, 622], [1621, 292], [1666, 292]);
  W('cmpA008', [840, 622], [840, 696], [864, 696]);
  W('kTrip', [452, 718], [864, 718]);
  W('or009', [924, 696], [992, 696], [992, 292], [1019, 292]);
  /* TURBINE TRIP: resets FFR 004, and over TW 018 the bypass */
  W('kTrip', [671, 718], [671, 526], [1387, 526], [1387, 292], [1453, 292]);
  W('kTrip', [838, 718], [838, 1217], [881, 1217]);
  /* the criteria out */
  W('or011', [1726, 270], [2042, 270]);
  W('cmpA010', [763, 824], [2037, 824]);
  /* RUB CHECK UNAVOIDABLE */
  W('iA', [312, 951], [991, 951]);
  W('iB', [311, 1058], [774, 1058], [774, 973], [991, 973]);
  W('or012', [1051, 951], [2059, 951]);
  W('or012', [1105, 951], [1105, 1196], [1180, 1196]);
  /* RUB CHECK BYPASS: A 014, FFR 015; its reset OR 017 */
  W('crtIks', [350, 1153], [723, 1153]);
  W('crtIys', [350, 1366], [603, 1366], [603, 1174], [723, 1174]);
  W('crtIys', [603, 1302], [711, 1302]);
  W('crtIkr', [350, 1281], [711, 1281]);
  W('a014', [783, 1153], [1330, 1153]);
  W('tw018', [941, 1217], [1180, 1217]);
  W('a020', [771, 1281], [1169, 1281], [1169, 1238], [1180, 1238]);
  W('or017', [1240, 1196], [1285, 1196], [1285, 1174], [1330, 1174]);
  W('ffr015', [1410, 1153], [2034, 1153]);
  W('ffr015', [1636, 1153], [1636, 313], [1666, 313]);
  W('ffr015', [1636, 1153], [1636, 1281], [1679, 1281]);
  W('ffr015', [1636, 1229], [2025, 1229]);
  W('not021', [1739, 1281], [2025, 1281]);
  W('kPerm', [1045, 174], [1694, 174]);
  t.push(
    [316, 941, 'AMB. COLD MODE'],
    [315, 1048, 'COLD1 MODE'],
    [356, 1143, 'RUB CHECK BYPASS'],
    [356, 1271, 'RUB CHECK REQUIRED'],
    [356, 1356, 'CRT AVAILABLE'],
    [1447, 164, 'CRT OPE PERM'],
    [1760, 239, 'CRI 2.3 TURBINE RUBCHECK'],
    [1760, 260, 'COMPLETE SPEED'],
    [1748, 793, 'CRI 2.4 TURBINE'],
    [1748, 814, 'RATED SPEED'],
    [2073, 902, '(TCA585)', 1, 1.7],
    [1749, 941, 'RUB CHECK UNAVOIDABLE'],
    [1821, 1143, 'RUB CHECK BYPASS'],
    [1801, 1219, 'RUB CHECK BYPASS'],
    [1745, 1271, 'RUB CHECK REQUIRED'],
    [699, 258, 'T', 2],
    [698, 418, 'T', 2],
    [696, 610, 'T', 2],
    [694, 812, 'T', 2],
    [1011, 258, 'T', 2],
    [1445, 258, 'T', 2],
    [872, 1205, 'T', 2],
    [1322, 1141, 'T', 2],
    [325, 201, '(TCA100)'],
    [324, 307, '(TCA104)'],
    [323, 413, '(TCA103)'],
    [321, 754, '(TCA103)'],
    [955, 210, '(TCA100)'],
    [240, 1522, 'CONTROLLER:'],
    [400, 1522, 'COMM+MD'],
    [660, 1495, 'TRIGGER  :'],
    [660, 1522, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA547',
    title: 'CRITERIA CONDITION',
    page: 117,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    live: { kTrip: 'trip', kSpeed: ['rpm', 'rpm'] },
    k: [
      ['kInit', 222, 164, 'INITIAL', 'ref'],
      ['kSpeed', 221, 270, 'TURBINE SPEED', 'ref'],
      ['kAvc', 221, 376, 'ALL VALVE CLOSED', 'ref'],
      ['kTrip', 218, 718, 'TURBINE TRIP', 'ref'],
      ['kPerm', 811, 174, 'CRT OPE PERM', 'ref']
    ],
    c: [
      ['iA', 'in', 'A', 285, 951, '', ['TCA500']],
      ['iB', 'in', 'B', 284, 1058, '', ['TCA500']],
      ['oA', 'out', 'A', 2069, 270, '', ['TCA511', 'TCA563']],
      ['oB', 'out', 'B', 2064, 824, '', ['TCA511', 'TCA512', 'TCA539', 'TCA563']],
      ['oC', 'out', 'C', 2061, 1153, '', ['TCA512']]
    ],
    d: [
      ['crtIks', 315, 1153, 'in', 'TCA754_1_IKS', 'R', '#1C'],
      ['crtIkr', 315, 1281, 'in', 'TCA754_1_IKR', 'R', '#1C'],
      ['crtIys', 315, 1366, 'in', 'TCA754_1_IYS', 'R', '#1C'],
      ['crtIyp', 1729, 174, 'out', 'TCA754_1_IYP', 'S', '#1C'],
      ['crt2', 2094, 951, 'out', 'TCA754_2', 'S', '#1C'],
      ['crtIis', 2060, 1229, 'out', 'TCA754_1_IIS', 'S', '#1C'],
      ['crtIir', 2060, 1281, 'out', 'TCA754_1_IIR', 'S', '#1C']
    ],
    b: [
      ['cmpA001', 'CMP', 'A001', 738, 281, ['HL:150.0rpm', 'LL:145.0rpm']],
      ['ffr002', 'FFR', '002', 1059, 281, [], { l: ['S', 'R'] }, [80, 43]],
      ['a003', 'A', '003', 1270, 291, [], {}, [60, 65]],
      ['ffr004', 'FFR', '004', 1493, 281, [], { l: ['S', 'R'] }, [80, 43]],
      ['cplA006', 'CPL', 'A006', 737, 441, ['HL:105.0rpm', 'LL:100.0rpm']],
      ['cmpA008', 'CMP', 'A008', 735, 633, ['HL:250.0rpm', 'LL:245.0rpm']],
      ['or009', 'OR', '009', 894, 707],
      ['cmpA010', 'CMP', 'A010', 733, 835, ['HL:3550.0rpm', 'LL:3540.0rpm']],
      ['or011', 'OR', '011', 1696, 291, [], {}, [60, 65]],
      ['or012', 'OR', '012', 1021, 962],
      ['btr013', 'o:BTR', '013', 1722, 951],
      ['a014', 'A', '014', 753, 1164],
      ['ffr015', 'FFR', '015', 1370, 1164, [], { l: ['S', 'R'] }, [80, 43]],
      ['btr016', 'o:BTR', '016', 1731, 1153],
      ['or017', 'OR', '017', 1210, 1217, [], {}, [60, 65]],
      ['tw018', 'TW', '018', 911, 1228, ['TW:1.0s']],
      ['btr019', 'o:BTR', '019', 1710, 1229],
      ['a020', 'A', '020', 741, 1292],
      ['not021', 'NOT', '021', 1709, 1292],
      ['btr022', 'o:BTR', '022', 1358, 174]
    ],
    w,
    j: [
      [630, 227],
      [630, 579],
      [733, 795],
      [608, 270],
      [608, 430],
      [608, 622],
      [840, 622],
      [671, 718],
      [838, 718],
      [1105, 951],
      [603, 1302],
      [1636, 1153],
      [1636, 1229]
    ],
    t
  });
})();
