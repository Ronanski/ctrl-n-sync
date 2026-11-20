/* TCA632 HP TURBINE WARMING GROUP CONTROL (TE-1,2) (331DM09788 page 157, controller COMM+MD, cycle 100 ms). Typed from the drawing; units =
   the pixels of the page rendered 2296 wide. The steps of the HP turbine warming start group control, each with START GROUP CONTROL
   PROGRESS:
   - warming line drain valve: OPEN COMMAND (A 015) until it is opened (OR 016 / A 017 seal in, NOT 018), then for 60.0 s (TP A019)
     CLOSE COMMAND (A 020) until it is closed (A 021, NOT);
   - closed (A 022): a flicker (FLK B023, T1 2.0 s / T2 60.0 s) or 280.0 s (TP B026) (OR 024), while the warming valve position is not
     over 10.0 % (CMP B027 HL 10.0 / LL 9.0 %, NOT 028) (A 025) = the command to the warming start group control (printed PEN COMMAND);
   - valve position over 10 % (A 029) for 30.0 s (TP 030) = COLD REHEAT DRAIN VALVE CLOSE COMMAND, and CV(B) BEL SEAT SEC DRAIN VALVE CLOSE
     COMMAND while the CV (lower) below seat drain valve position is not under its limit (CPL A038 HL 21.0 / LL 20.0 %, NOT 034, A 032);
   - position under the limit: PROGRAM CONTROL START COMMAND (A 035, with ON(1)); with the program control mode: START GROUP CONTROL
     COMPLETE (A 036). INITIAL clears the timers and CMP B027.
   The words are the ones of the drawing. The NOT after A 021 is printed without a number: the numbers of the sheet run 015 to 038, each
   once, and 033 is the only one not printed, so its key is not033 and it is drawn without a number as printed. The tag of the lamp is
   printed above its symbol (TCA631_1_SPIC, as printed on this sheet TCA632) and is typed there.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const T = (key, ...pts) => w.push([key, pts, 1]);
  /* START GROUP CONTROL PROGRESS: to A 015, A 017, A 022, A 029, A 035 */
  W('iA631', [327, 248], [1444, 248]);
  W('iA631', [748, 248], [748, 1162], [1149, 1162]);
  W('iA631', [748, 344], [848, 344]);
  W('iA631', [748, 621], [1005, 621]);
  W('iA631', [748, 939], [959, 939]);
  /* INITIAL: FLK B023, CMP B027, TP A019, TP B026, TP 030 */
  W('kInit', [447, 152], [1175, 152], [1175, 590]);
  W('kInit', [781, 152], [781, 780], [862, 780], [862, 822]);
  W('kInit', [1036, 152], [1036, 419]);
  W('kInit', [781, 695], [1172, 695], [1172, 717]);
  W('kInit', [1066, 695], [1066, 886], [1181, 886], [1181, 908]);
  /* the warming line drain valve: open, then close */
  W('iA4o', [327, 322], [666, 322]);
  W('or016', [726, 322], [848, 322]);
  W('a017', [908, 322], [1231, 322]);
  W('a017', [962, 322], [962, 429], [1006, 429]);
  W('a017', [962, 386], [621, 386], [621, 344], [666, 344]);
  W('not018', [1291, 322], [1434, 322], [1434, 269], [1444, 269]);
  W('a015', [1504, 248], [2033, 248]);
  W('tpA019', [1066, 429], [1443, 429]);
  W('tpA019', [1121, 429], [1121, 493], [822, 493], [822, 524], [856, 524]);
  W('iA5', [325, 503], [856, 503]);
  W('a021', [916, 503], [1229, 503]);
  W('a021', [971, 503], [971, 600], [1005, 600]);
  W('not033', [1289, 503], [1433, 503], [1433, 450], [1443, 450]);
  W('a020', [1503, 429], [2020, 429]);
  /* closed: the command to the warming start group control */
  W('a022', [1065, 600], [1143, 600]);
  W('a022', [1088, 600], [1088, 727], [1142, 727]);
  W('flkB023', [1203, 600], [1313, 600]);
  W('tpB026', [1202, 727], [1302, 727], [1302, 620], [1313, 620]);
  W('or024', [1373, 600], [1431, 600]);
  W('not028', [1211, 832], [1420, 832], [1420, 620], [1431, 620]);
  W('a025', [1491, 600], [2019, 600]);
  /* the warming valve position: the close commands */
  T('iA4p', [323, 832], [832, 832]);
  W('cmpB027', [892, 832], [1151, 832]);
  W('cmpB027', [936, 832], [936, 918], [959, 918]);
  W('a029', [1019, 918], [1151, 918]);
  W('tp030', [1211, 918], [2026, 918]);
  W('tp030', [1319, 918], [1319, 992], [1438, 992]);
  T('iA3', [311, 1013], [831, 1013]);
  W('cplA038', [891, 1013], [1150, 1013]);
  W('cplA038', [999, 1013], [999, 1236], [1148, 1236]);
  W('cplA038', [999, 1120], [1149, 1120]);
  W('not034', [1210, 1013], [1438, 1013]);
  W('a032', [1498, 992], [2026, 992]);
  /* the program control start command, the complete */
  W('kOn', [503, 1141], [1149, 1141]);
  W('kOn', [966, 1141], [966, 1258], [1148, 1258]);
  W('a035', [1209, 1120], [2025, 1120]);
  W('iD', [320, 1279], [1148, 1279]);
  W('a036', [1208, 1236], [2023, 1236]);
  W('a036', [1889, 1236], [1889, 1312], [2014, 1312]);
  t.push(
    [334, 217, 'HP TURBINE WARMING START'],
    [334, 238, 'GROUP CONTROL PROGRESS'],
    [333, 291, 'HP TURBINE WARMING LINE'],
    [333, 312, 'DRAIN VALVE OPENED'],
    [331, 472, 'HP TURBINE WARMING LINE'],
    [331, 493, 'DRAIN VALVE CLOSED'],
    [329, 801, 'HP TURBINE WARMING'],
    [329, 822, 'VALVE POSITION'],
    [318, 982, 'CV (LOWER) BELOW SEAT SECONDARY'],
    [318, 1003, 'DRAIN VALVE POS.'],
    [327, 1248, 'HP TURBINE WARMING VALVE'],
    [327, 1269, 'PROGRAM CONTROL MODE'],
    [1583, 217, 'HP TURBINE WARMING LINE'],
    [1583, 238, 'DRAIN VALVE OPEN COMMAND'],
    [1581, 398, 'HP TURBINE WARMING LINE'],
    [1581, 419, 'DRAIN VALVE CLOSE COMMAND'],
    [1568, 569, 'PEN COMMAND FROM HP TURBINE'],
    [1568, 590, 'WARMING START GROUP CONTROL'],
    [1558, 887, 'COLD REHEAT DRAIN VALVE'],
    [1558, 908, 'CLOSE COMMAND'],
    [1555, 961, 'CV(B) BEL SEAT SEC'],
    [1555, 982, 'DRAIN VALVE CLOSE COMMAND'],
    [1554, 1089, 'PROGRAM CONTROL START COMMAND'],
    [1554, 1110, 'FROM HP TURBINE WARMING START'],
    [1534, 1205, 'HP TURBINE WARMING START'],
    [1534, 1226, 'GROUP CONTROL COMPLETE'],
    [2068, 1291, 'TCA631_1_SPIC'],
    [998, 417, 'T', 2],
    [1135, 588, 'T', 2],
    [1134, 715, 'T', 2],
    [824, 820, 'T', 2],
    [1143, 906, 'T', 2],
    [823, 1001, 'T', 2],
    [334, 190, '(TCA100)'],
    [228, 1522, 'CONTROLLER:'],
    [389, 1522, 'COMM+MD'],
    [611, 1495, 'TRIGGER  :'],
    [611, 1522, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA632',
    title: 'HP TURBINE WARMING GROUP CONTROL (TE-1,2)',
    page: 157,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    k: [
      ['kInit', 213, 152, 'INITIAL', 'ref'],
      ['kOn', 269, 1141, 'ON(1)', 'sys.ref']
    ],
    c: [
      ['iA631', 'in', 'A', 300, 248, '', ['TCA631']],
      ['iA4o', 'in', 'A4', 300, 322, '', ['TCA047']],
      ['iA5', 'in', 'A5', 298, 503, '', ['TCA047']],
      ['iA4p', 'in', 'A4', 296, 832, '', ['TCA322']],
      ['iA3', 'in', 'A3', 284, 1013, '', ['TCA322']],
      ['iD', 'in', 'D', 293, 1279, '', ['TCA685']],
      ['oA1', 'out', 'A1', 2060, 248, '', ['TCA832']],
      ['oA2', 'out', 'A2', 2047, 429, '', ['TCA832']],
      ['oA3', 'out', 'A3', 2046, 600, '', ['TCA685']],
      ['oA4', 'out', 'A4', 2053, 918, '', ['-']],
      ['oA5', 'out', 'A5', 2053, 992, '', ['TCA618']],
      ['oA6', 'out', 'A6', 2052, 1120, '', ['TCA685']],
      ['oA7', 'out', 'A7', 2050, 1236, '', ['TCA631', 'TCA634']]
    ],
    d: [['crtSpic', 2049, 1312, 'out', '', 'S', '#1C']],
    b: [
      ['a015', 'A', '015', 1474, 259],
      ['or016', 'OR', '016', 696, 333],
      ['a017', 'A', '017', 878, 333],
      ['not018', 'NOT', '018', 1261, 333],
      ['tpA019', 'TP', 'A019', 1036, 440, ['TP:60.0s']],
      ['a020', 'A', '020', 1473, 440],
      ['a021', 'A', '021', 886, 514],
      ['a022', 'A', '022', 1035, 610],
      ['flkB023', 'FLK', 'B023', 1173, 611, ['T1:2.0s', 'T2:60.0s']],
      ['or024', 'OR', '024', 1343, 610],
      ['a025', 'A', '025', 1461, 610],
      ['tpB026', 'TP', 'B026', 1172, 738, ['TP:280.0s']],
      ['cmpB027', 'CMP', 'B027', 862, 843, ['HL:10.0%', 'LL:9.0%']],
      ['not028', 'NOT', '028', 1181, 843],
      ['a029', 'A', '029', 989, 929],
      ['tp030', 'TP', '030', 1181, 929, ['TP:30.0s']],
      ['btr031', 'o:BTR', '031', 1458, 918],
      ['a032', 'A', '032', 1468, 1003],
      ['not033', 'NOT', '', 1259, 514],
      ['not034', 'NOT', '034', 1180, 1024],
      ['a035', 'A', '035', 1179, 1141, [], {}, [60, 65]],
      ['a036', 'A', '036', 1178, 1258, [], {}, [60, 65]],
      ['btr037', 'o:BTR', '037', 1445, 1236],
      ['cplA038', 'CPL', 'A038', 861, 1024, ['HL:21.0%', 'LL:20.0%']],
      ['x1', 'X', '', 812, 386]
    ],
    w,
    j: [
      [748, 248],
      [748, 344],
      [748, 621],
      [748, 939],
      [781, 152],
      [1036, 152],
      [781, 695],
      [1066, 695],
      [962, 322],
      [962, 386],
      [1121, 429],
      [971, 503],
      [1088, 600],
      [936, 832],
      [1319, 918],
      [999, 1013],
      [999, 1120],
      [966, 1141],
      [1889, 1236]
    ],
    t
  });
})();
