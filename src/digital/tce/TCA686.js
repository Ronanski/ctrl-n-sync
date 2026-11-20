/* TCA686 HP TURBINE WARMING VALVE (TC-20) (331DM09788 page 168, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the
   pixels of the page rendered 2296 wide. The open / close of the valve of TCA685, gate by gate as drawn:
   - A 001 = trip press low, the warming permissive and OR 006 (open signal, or FLK A009 of A 008 = exhaust steam press CPL A007
     (HL 5.0 / LL 4.0 barg), valve pos CPL A010 (HL 41.0 / LL 40.0 %) and A 020). A 002 = A 001 and NOT 005 of OR 004 (OR 011 and
     OR 023 = torque sw open). OPEN to TCA685 and TCA832.
   - OR 011 = close signal or FLK A015 of A 014 (exhaust steam press CMP A013 (HL 5.0 / LL 4.0 barg), valve pos CMP A019 (HL 5.0 /
     LL 4.0 %) and A 020). A 012 = OR 011 and NOT 018 of OR 017 (A 001 and OR 022 = torque sw close or elec trouble). CLOSE to
     TCA685 and TCA832.
   - A 020 = valve AUTO and program control; elec trouble also into OR 023. INITIAL on the top of the flickers and the CMPs.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const T = (key, ...pts) => w.push([key, pts, 1]);
  /* inputs: [key, letter, sheets, x of the connector, y, words, double] */
  [
    ['iN', 'N', ['TCA685'], 323.5, 341.8, ['HP TURBINE WARMING PERMISSIVE']],
    ['iA', 'A', ['TCA685'], 322.8, 405, ['HP TURBINE WARMING', 'VALVE OPEN SIGNAL']],
    ['iA1', 'A1', ['TCE060'], 320.8, 490, ['HP TURBINE EXHAUST', 'STEAM PRESS.(MEDIAN)'], 1],
    ['iA4', 'A4', ['TCA322'], 320.2, 596.4, ['HP TURBINE WARMING VALVE', 'POS.']],
    ['iB', 'B', ['TCA685'], 319, 703.5, ['HP TURBINE WARMING VALVE', 'CLOSE SIGNAL']],
    ['iC', 'C', ['TCA685'], 316.8, 1010.5, ['HP TURBINE WARMING VALVE AUTO']],
    ['iD', 'D', ['TCA685'], 316.3, 1074, ['HP TURBINE WARMING VALVE', 'PROGRAM CONTROL']],
    ['iL', 'L', ['TCA685'], 316, 1148.7, ['HP TURBINE WARMING VALVE', 'TORQUE SW OPEN']],
    ['iM', 'M', ['TCA685'], 314.5, 1276, ['HP TURBINE WARMING VALVE', 'TORQUE SW CLOSE']],
    ['iK', 'K', ['TCA685'], 314, 1340, ['HP TURBINE WARMING VALVE', 'ELEC TROUBLE']]
  ].forEach(([key, l, sh, cx, y, names, dbl]) => {
    c.push(dbl ? [key, 'in', l, cx, y, '', sh, 1] : [key, 'in', l, cx, y, '', sh]);
    names.forEach((s, i) => t.push([cx + 33, y - 12 - 21 * (names.length - 1 - i), s]));
  });
  /* INITIAL to the top of the flickers and the comparators */
  W('kInit', [540.7, 160], [716, 160], [716, 851], [789.5, 851], [789.5, 872]);
  W('kInit', [716, 458.2], [1048, 458.2], [1048, 479.5]);
  W('kInit', [716, 723.6], [1045.5, 723.6], [1045.5, 745.5]);
  W('kInit', [789.5, 723.6], [789.5, 745.5]);
  /* open path */
  W('kTrip', [539.4, 278], [1244.5, 278]);
  W('iN', [350.5, 341.8], [1200, 341.8], [1200, 299.5], [1244.5, 299.5]);
  W('iA', [349.8, 405], [1136.4, 405]);
  T('iA1', [347.8, 490], [762.3, 490]);
  T('iA1', [695, 490], [695, 755.5], [759.5, 755.5]);
  T('iA4', [347.2, 596.4], [761, 596.4]);
  T('iA4', [671, 596.4], [671, 883], [758, 883]);
  W('cpl007', [822.3, 490], [910.5, 490]);
  W('cpl010', [821, 596.4], [866, 596.4], [866, 512], [910.5, 512]);
  W('a008', [970.5, 490], [1017, 490]);
  W('flk009', [1077, 490], [1112, 490], [1112, 426.5], [1136.4, 426.5]);
  W('or006', [1196.4, 405], [1220.5, 405], [1220.5, 321], [1244.5, 321]);
  W('a001', [1303.4, 278], [1562.5, 278]);
  W('a001', [1323, 278], [1323, 842.2], [1343.3, 842.2]);
  W('or004', [1408.4, 395.5], [1444.5, 395.5]);
  W('not005', [1504.5, 395.5], [1539, 395.5], [1539, 300], [1562.5, 300]);
  W('a002', [1622.5, 278], [1646, 278], [1646, 386], [2096.7, 386]);
  /* close path */
  W('iB', [346, 703.5], [1132.7, 703.5]);
  W('cmp013', [819.5, 755.5], [908, 755.5]);
  W('cmp019', [818, 883], [862.7, 883], [862.7, 777.8], [908, 777.8]);
  W('a014', [968, 755.5], [1015, 755.5]);
  W('flk015', [1075, 755.5], [1109, 755.5], [1109, 725.2], [1132.7, 725.2]);
  W('or011', [1192.7, 703.5], [1557.2, 703.5]);
  W('or011', [1237, 703.5], [1237, 395.5], [1348.4, 395.5]);
  W('or017', [1403.3, 842.2], [1450.5, 842.2]);
  W('not018', [1510.5, 842.2], [1533.6, 842.2], [1533.6, 725.5], [1557.2, 725.5]);
  W('a012', [1617.2, 703.5], [1640.5, 703.5], [1640.5, 811.5], [2092, 811.5]);
  /* auto and program control; torque switches and electrical trouble */
  W('iC', [343.8, 1010.5], [757.2, 1010.5]);
  W('iD', [343.3, 1074], [733.2, 1074], [733.2, 1032], [757.2, 1032]);
  W('a020', [817.2, 1010.5], [884, 1010.5], [884, 533.5], [910.5, 533.5]);
  W('a020', [884, 799.3], [908, 799.3]);
  W('iL', [343, 1148.7], [756.2, 1148.7]);
  W('iM', [341.5, 1276], [755, 1276]);
  W('iK', [341, 1340], [732.3, 1340], [732.3, 1170.2], [756.2, 1170.2]);
  W('iK', [732.3, 1297.5], [755, 1297.5]);
  W('or023', [816.2, 1148.7], [1257, 1148.7], [1257, 417], [1348.4, 417]);
  W('or022', [815, 1276], [1320, 1276], [1320, 863.7], [1343.3, 863.7]);
  /* out */
  c.push(['oA', 'out', 'A', 2123.7, 386, '', ['TCA685', 'TCA832']], ['oB', 'out', 'B', 2119, 811.5, '', ['TCA685', 'TCA832']]);
  t.push(
    [1800, 359, 'HP TURBINE WARMING VALVE'],
    [1800, 379, 'OPEN'],
    [1795.5, 784.5, 'HP TURBINE WARMING VALVE'],
    [1795.5, 805, 'CLOSE'],
    /* the parameters of the comparators and flickers, the T of their top */
    [752, 542, 'HL:5.0barg'],
    [752, 563, 'LL:4.0barg'],
    [762, 648, 'HL:41.0%'],
    [762, 670, 'LL:40.0%'],
    [750, 808, 'HL:5.0barg'],
    [750, 829, 'LL:4.0barg'],
    [759, 935, 'HL:5.0%'],
    [759, 956, 'LL:4.0%'],
    [1017, 542, 'T1:1.0s'],
    [1017, 563, 'T2:15.0s'],
    [1015, 808, 'T1:1.0s'],
    [1015, 829, 'T2:15.0s'],
    [749, 481, 'T', 1],
    [747.7, 588, 'T', 1],
    [746.4, 746, 'T', 1],
    [744.5, 874, 'T', 1],
    [1003.6, 481, 'T', 1],
    [1001, 746, 'T', 1],
    [476, 199, '(TCA100)', 1],
    [476, 305, '(TCA103)', 1],
    [228, 1521, 'CONTROLLER:'],
    [388, 1521, 'COMM+MD'],
    [613, 1495, 'TRIGGER  :'],
    [613, 1521, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA686',
    title: 'HP TURBINE WARMING VALVE (TC-20)',
    page: 168,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 86, 2222, 1546],
    k: [
      ['kInit', 307.7, 160, 'INITIAL', 'ref'],
      ['kTrip', 306.4, 278, 'TRIP PRESS.LOW', 'ref']
    ],
    c,
    b: [
      ['a001', 'A', '001', 1273.4, 299, [], {}, [60, 64]],
      ['a002', 'A', '002', 1592.5, 288.6],
      ['btr003', 'o:BTR', '003', 1708, 386],
      ['or004', 'OR', '004', 1378.4, 406],
      ['not005', 'NOT', '005', 1474.5, 406],
      ['or006', 'OR', '006', 1166.4, 415.5],
      ['cpl007', 'CPL', 'A007', 792.3, 500.5],
      ['a008', 'A', '008', 940.5, 511.5, [], {}, [60, 64]],
      ['flk009', 'FLK', 'A009', 1047, 501],
      ['cpl010', 'CPL', 'A010', 791, 607],
      ['or011', 'OR', '011', 1162.7, 714.2],
      ['a012', 'A', '012', 1587.2, 714.2],
      ['cmp013', 'CMP', 'A013', 789.5, 766.3],
      ['a014', 'A', '014', 938, 777.3, [], {}, [60, 64]],
      ['flk015', 'FLK', 'A015', 1045, 767],
      ['btr016', 'o:BTR', '016', 1703.6, 811.5],
      ['or017', 'OR', '017', 1373.3, 852.7],
      ['not018', 'NOT', '018', 1480.5, 852.7],
      ['cmp019', 'CMP', 'A019', 788, 893.5],
      ['a020', 'A', '020', 787.2, 1021],
      ['or022', 'OR', '022', 785, 1286.5],
      ['or023', 'OR', '023', 786.2, 1159.2]
    ],
    w,
    j: [
      [716, 458.2],
      [716, 723.6],
      [789.5, 723.6],
      [695, 490],
      [671, 596.4],
      [1323, 278],
      [1237, 703.5],
      [884, 799.3],
      [732.3, 1297.5]
    ],
    t
  });
})();
