/* TCA822 ALARM (331DM09788 page 231, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn:
   - COM I/O HARD ERROR (B, TCA806), COM SIGNAL ERROR (A, TCA816), COM BATTERYERR (F, TCA101), DURING SIMULATION (A, TCA102),
     NETWORK ABNORMAL (F, TCA102), DI P.S.ABNORMAL (A, TCA817), HMI NORECIVE (B, TCA100), ATS ALARM (B1, TCE465) and the alarm
     groups A (TCA818), A / B / C (TCA819), A / B (TCA820), A (TCA821) into OR 003: COM MINOR TROUBLE, A (-), and through
     BTR 002 to CRT TCA822_1.
   - COM MINOR TROUBLE, EHG TROUBLE (A, TCE472), TPC(A) / (B) / (C) ABNORMAL (C1 / C2 / C3, TCE476) and Modbus I/F ABNORMAL
     (D1, TCT052) into OR 004: TCS MINOR TROUBLE to CRT TCA822_2 and B (to TCA532).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    b = [],
    c = [],
    d = [],
    t = [],
    j = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const Y = [260, 324, 388, 452, 516, 580, 633, 708, 772, 836, 900, 964, 1028, 1092, 1146],
    L = ['B', 'A', 'F', 'A', 'F', 'A', 'B', 'B1', 'A', 'A', 'B', 'C', 'A', 'B', 'A'],
    F = ['TCA806', 'TCA816', 'TCA101', 'TCA102', 'TCA102', 'TCA817', 'TCA100', 'TCE465', 'TCA818', 'TCA819', 'TCA819', 'TCA819', 'TCA820', 'TCA820', 'TCA821'],
    T = ['COM I/O HARD ERROR', 'COM SIGNAL ERROR', 'COM BATTERYERR', 'DURING SIMULATION', 'NETWORK ABNORMAL', 'DI P.S.ABNORMAL', 'HMI NORECIVE', 'ATS ALARM'],
    XB = [824, 845, 866, 887, 908, 929, 949, 970, 991, 1012, 1033, 1053, 1074, 1095];
  Y.forEach((y, i) => {
    const key = 'i' + (i + 1),
      yo = 260 + 21 * i;
    c.push([key, 'in', L[i], 350, y, '', [F[i]], 0, 1]);
    if (T[i]) t.push([384, y - 8, T[i]]);
    if (i === 0) W(key, [377, y], [1127, y]);
    else W(key, [377, y], [XB[i - 1], y], [XB[i - 1], yo], [1127, yo]);
  });
  b.push(['or003', 'OR', '003', 1156, 408.5, [], {}, [58, 321]]);
  W('or003', [1185, 260], [2081 - 27, 260]);
  W('or003', [1633, 260], [1633, 431], [1666, 431]);
  W('or003', [1633, 324], [2016 - 35, 324]);
  j.push([1633, 260], [1633, 324]);
  b.push(['btr002', 'o:BTR', '002', 1688, 324]);
  d.push(['crt1', 2016, 324, 'out', 'TCA822_1', 'S', '#1C'], ['crt2', 2016, 431, 'out', 'TCA822_2', 'S', '#1C']);
  c.push(['oA', 'out', 'A', 2081, 260, '', ['-'], 0, 1]);
  /* OR 004 */
  const R = [
    ['iEhg', 'A', 868, 'EHG TROUBLE', 'TCE472', 1512, 452],
    ['iTpcA', 'C1', 942, 'TPC(A) ABNORMAL', 'TCE476', 1547, 474],
    ['iTpcB', 'C2', 1006, 'TPC(B) ABNORMAL', 'TCE476', 1578, 495],
    ['iTpcC', 'C3', 1080, 'TPC(C) ABNORMAL', 'TCE476', 1620, 516],
    ['iMod', 'D1', 1155, 'Modbus I/F ABNORMAL', 'TCT052', 1638, 537]
  ];
  R.forEach(([key, l, y, txt, ref, xb, yo]) => {
    c.push([key, 'in', l, 1246, y, '', [ref], 0, 1]);
    t.push([1278, y - 8, txt]);
    W(key, [1273, y], [xb, y], [xb, yo], [1666, yo]);
  });
  b.push(['or004', 'OR', '004', 1695, 484, [], {}, [58, 128]]);
  W('or004', [1724, 431], [2016 - 35, 431]);
  W('or004', [1791, 431], [1791, 549], [2003 - 27, 549]);
  j.push([1791, 431]);
  c.push(['oB', 'out', 'B', 2003, 549, '', ['TCA532'], 0, 1]);
  t.push(
    [1265, 252, 'COM MINOR TROUBLE'],
    [1745, 316, 'COM MINOR TROUBLE'],
    [1806, 423, 'TCS MINOR TROUBLE'],
    [228, 1516, 'CONTROLLER:'],
    [388, 1516, 'COMM+MD'],
    [613, 1495, 'TRIGGER  :'],
    [613, 1522, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA822',
    title: 'ALARM',
    page: 231,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [160, 75, 2224, 1540],
    c,
    d,
    b,
    w,
    j,
    t
  });
})();
