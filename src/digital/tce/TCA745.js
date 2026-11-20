/* TCA745 AVR INTERFACE (331DM09788 page 179A, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the
   page rendered 2296 wide. Gate by gate as drawn:
   - PSS: A 016 = PSS ON COMMAND (TCA745_1_IKA) and CRT AVAILABLE (TCA745_1_IYS), A 019 = PSS OFF COMMAND (TCA745_1_JYP) and CRT
     AVAILABLE. Each goes through a TW (018 / 021, TW:1.0) to D1 / D2 (to TCA831). PSS ON (A13 of TCA042) goes to the lamp
     TCA745_1_IIA, and through NOT 023 to TCA745_1_YIP.
   - PF control: A 025 / A 028 with CRT AVAILABLE (TCA745_2_IYS), TW 027 / 030 to D3 / D4 (to TCA831). PF CONTRL ON (A5 of TCA046)
     to TCA745_2_IIA, and through NOT 032 to TCA745_2_YIP.
   - Reactive power: A 034 / A 037 with CRT AVAILABLE (TCA745_3_IYS), TW 036 / 039 to D5 / D6 (to TCA833). REACTIVE POWER ON (A6 of
     TCA046) to TCA745_3_IIA, and through NOT 041 to TCA745_3_YIP.
   - INITIAL goes to the top of the six TW blocks. CRT OPE PERM goes to the lamps TCA745_1_IYP, TCA745_2_IYP and TCA745_3_IYP.
   The words are the ones of the drawing (PF CONTRL ON as printed).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const HW = 28.76,
    BUS = 1210,
    PERM = 1070;
  /* gate centres (x) and the rows of their pins */
  const A1 = 732,
    A2 = 718.3,
    A3 = 748.3,
    T1 = 1360,
    T2 = 1346.7,
    T3 = 1375;
  const R = {
    on1: 303.5,
    off1: 399.5,
    av1: 463.3,
    on2: 623.3,
    off2: 718.7,
    av2: 782.7,
    on3: 952,
    off3: 1047.3,
    av3: 1111.3
  };
  /* the command and CRT AVAILABLE into the A gates */
  W('crt1Ika', [353, R.on1], [A1 - HW, R.on1]);
  W('crt1Jyp', [353, R.off1], [A1 - HW, R.off1]);
  W('crt1Iys', [353, R.av1], [666, R.av1], [666, R.on1 + 22], [A1 - HW, R.on1 + 22]);
  W('crt1Iys', [666, R.off1 + 22], [A1 - HW, R.off1 + 22]);
  W('crt2Ika', [338, R.on2], [A2 - HW, R.on2]);
  W('crt2Jyp', [338, R.off2], [A2 - HW, R.off2]);
  W('crt2Iys', [338, R.av2], [652.7, R.av2], [652.7, R.on2 + 22], [A2 - HW, R.on2 + 22]);
  W('crt2Iys', [652.7, R.off2 + 22], [A2 - HW, R.off2 + 22]);
  W('crt3Ika', [369, R.on3], [A3 - HW, R.on3]);
  W('crt3Jyp', [379, R.off3], [A3 - HW, R.off3]);
  W('crt3Iys', [401, R.av3], [682, R.av3], [682, R.on3 + 22], [A3 - HW, R.on3 + 22]);
  W('crt3Iys', [682, R.off3 + 22], [A3 - HW, R.off3 + 22]);
  /* A gates to the TW blocks, TW blocks out */
  W('a016', [A1 + HW, R.on1], [T1 - HW, R.on1]);
  W('a019', [A1 + HW, R.off1], [T1 - HW, R.off1]);
  W('a025', [A2 + HW, R.on2], [T2 - HW, R.on2]);
  W('a028', [A2 + HW, R.off2], [T2 - HW, R.off2]);
  W('a034', [A3 + HW, R.on3], [T3 - HW, R.on3]);
  W('a037', [A3 + HW, R.off3], [T3 - HW, R.off3]);
  W('tw018', [T1 + HW, R.on1], [1853, R.on1]);
  W('tw021', [T1 + HW, R.off1], [1853, R.off1]);
  W('tw027', [T2 + HW, R.on2], [1840, R.on2]);
  W('tw030', [T2 + HW, R.off2], [1840, R.off2]);
  W('tw036', [T3 + HW, R.on3], [1869, R.on3]);
  W('tw039', [T3 + HW, R.off3], [1869, R.off3]);
  /* INITIAL to the top of the TW blocks */
  W('kInit', [495, 165], [T1, 165], [T1, R.on1 - 10.5]);
  W('kInit', [BUS, 165], [BUS, 1016], [T3, 1016], [T3, R.off3 - 10.5]);
  W('kInit', [BUS, 370], [T1, 370], [T1, R.off1 - 10.5]);
  W('kInit', [BUS, 581], [T2, 581], [T2, R.on2 - 10.5]);
  /* as drawn: this branch meets the left side of TW 027 and leaves its bottom to the top of TW 030 */
  W('kInit', [BUS, 646], [T2 - HW, 646]);
  W('kInit', [T2, R.on2 + 32.5], [T2, R.off2 - 10.5]);
  W('kInit', [BUS, 888], [T3, 888], [T3, R.on3 - 10.5]);
  /* CRT OPE PERM to the three lamps */
  W('kPerm', [481, 240], [1760, 240]);
  W('kPerm', [PERM, 240], [PERM, 1121.3], [1902, 1121.3]);
  W('kPerm', [PERM, 909.5], [1797, 909.5]);
  /* the ON feedbacks to the lamps */
  W('iA13', [482, 548.5], [745, 548.5]);
  W('iA13', [708.7, 548.5], [708.7, 485.3], [1843, 485.3]);
  W('not023', [802, 548.5], [1843, 548.5]);
  W('iA5', [458, 867.3], [730.5, 867.3]);
  W('iA5', [695.3, 867.3], [695.3, 804], [1860, 804]);
  W('not032', [788, 867.3], [1870, 867.3]);
  W('iA6', [497, 1270], [770.5, 1270]);
  W('iA6', [735.3, 1270], [735.3, 1196], [1931, 1196]);
  W('not041', [828, 1270], [1660, 1270], [1660, 1260.7], [1951, 1260.7]);
  t.push(
    [425, 210, '(TCA100)', 1],
    [425, 273, '(TCA100)', 1],
    [887, 238, 'CRT OPE PERM'],
    [369, 302, 'PSS ON COMMAND'],
    [368, 397, 'PSS OFF COMMAND'],
    [367, 462, 'CRT AVAILABLE'],
    [485, 544, 'PSS ON'],
    [356, 621, 'PF CONTROL ON'],
    [355, 717, 'PF CONTROL OFF'],
    [354, 781, 'CRT AVAILABLE'],
    [461, 863, 'PF CONTRL ON'],
    [386, 950, 'REACTIVE POWER ON'],
    [396, 1046, 'REACTIVE POWER OFF'],
    [417, 1110, 'CRT AVAILABLE'],
    [500, 1266, 'REACTIVE POWER ON'],
    [1470, 302, 'PSS ON COMMAND'],
    [1469, 398, 'PSS OFF COMMAND'],
    [1456, 621, 'PF CONTROL ON'],
    [1456, 717, 'PF CONTROL OFF'],
    [1485, 950, 'REACTIVE POWER ON'],
    [1484, 1046, 'REACTIVE POWER OFF'],
    /* the T of the TW inputs */
    [1317, 300, 'T', 1],
    [1317, 396, 'T', 1],
    [1303, 619, 'T', 1],
    [1302, 715, 'T', 1],
    [1333, 949, 'T', 1],
    [1332, 1044, 'T', 1],
    [230, 1521, 'CONTROLLER:'],
    [393, 1521, 'COMM+MD'],
    [616, 1494, 'TRIGGER  :'],
    [616, 1520, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA745',
    title: 'AVR INTERFACE',
    page: '179A',
    ctl: 'COMM+MD',
    cycle: 100,
    f: [168, 78, 2224, 1540],
    k: [
      ['kInit', 262, 165, 'INITIAL', 'ref'],
      ['kPerm', 248, 240, 'CRT OPE PERM', 'ref']
    ],
    c: [
      ['iA13', 'in', 'A13', 455, 548.5, '', ['TCA042']],
      ['iA5', 'in', 'A5', 431, 867.3, '', ['TCA046']],
      ['iA6', 'in', 'A6', 470, 1270, '', ['TCA046']],
      ['oD1', 'out', 'D1', 1880, R.on1, '', ['TCA831']],
      ['oD2', 'out', 'D2', 1880, R.off1, '', ['TCA831']],
      ['oD3', 'out', 'D3', 1867, R.on2, '', ['TCA831']],
      ['oD4', 'out', 'D4', 1867, R.off2, '', ['TCA831']],
      ['oD5', 'out', 'D5', 1896, R.on3, '', ['TCA833']],
      ['oD6', 'out', 'D6', 1896, R.off3, '', ['TCA833']]
    ],
    d: [
      ['crt1Ika', 318, R.on1, 'in', 'TCA745_1_IKA', 'R', '#1C'],
      ['crt1Jyp', 318, R.off1, 'in', 'TCA745_1_JYP', 'R', '#1C'],
      ['crt1Iys', 318, R.av1, 'in', 'TCA745_1_IYS', 'R', '#1C'],
      ['crt2Ika', 303, R.on2, 'in', 'TCA745_2_IKA', 'R', '#1C'],
      ['crt2Jyp', 303, R.off2, 'in', 'TCA745_2_JYP', 'R', '#1C'],
      ['crt2Iys', 303, R.av2, 'in', 'TCA745_2_IYS', 'R', '#1C'],
      ['crt3Ika', 334, R.on3, 'in', 'TCA745_3_IKA', 'R', '#1C'],
      ['crt3Jyp', 344, R.off3, 'in', 'TCA745_3_JYP', 'R', '#1C'],
      ['crt3Iys', 366, R.av3, 'in', 'TCA745_3_IYS', 'R', '#1C'],
      ['crt1Iyp', 1795, 240, 'out', 'TCA745_1_IYP', 'S', '#1C'],
      ['crt1Iia', 1878, 485.3, 'out', 'TCA745_1_IIA', 'S', '#1C'],
      ['crt1Yip', 1878, 548.5, 'out', 'TCA745_1_YIP', 'S', '#1C'],
      ['crt2Iia', 1895, 804, 'out', 'TCA745_2_IIA', 'S', '#1C'],
      ['crt2Yip', 1905, 867.3, 'out', 'TCA745_2_YIP', 'S', '#1C'],
      ['crt2Iyp', 1832, 909.5, 'out', 'TCA745_2_IYP', 'S', '#1C'],
      ['crt3Iyp', 1937, 1121.3, 'out', 'TCA745_3_IYP', 'S', '#1C'],
      ['crt3Iia', 1966, 1196, 'out', 'TCA745_3_IIA', 'S', '#1C'],
      ['crt3Yip', 1986, 1260.7, 'out', 'TCA745_3_YIP', 'S', '#1C']
    ],
    b: [
      ['a016', 'A', '016', A1, R.on1 + 11],
      ['a019', 'A', '019', A1, R.off1 + 11],
      ['a025', 'A', '025', A2, R.on2 + 11],
      ['a028', 'A', '028', A2, R.off2 + 11],
      ['a034', 'A', '034', A3, R.on3 + 11],
      ['a037', 'A', '037', A3, R.off3 + 11],
      ['tw018', 'TW', '018', T1, R.on1 + 11, ['TW:1.0']],
      ['tw021', 'TW', '021', T1, R.off1 + 11, ['TW:1.0']],
      ['tw027', 'TW', '027', T2, R.on2 + 11, ['TW:1.0']],
      ['tw030', 'TW', '030', T2, R.off2 + 11, ['TW:1.0']],
      ['tw036', 'TW', '036', T3, R.on3 + 11, ['TW:1.0']],
      ['tw039', 'TW', '039', T3, R.off3 + 11, ['TW:1.0']],
      ['not023', 'NOT', '023', 773.3, 559.5],
      ['not032', 'NOT', '032', 759.3, 878.3],
      ['not041', 'NOT', '041', 799.3, 1281],
      ['btr024', 'o:BTR', '024', 797, 240],
      ['btr022', 'o:BTR', '022', 1677, 485.3],
      ['btr015', 'o:BTR', '015', 1665, 548.5],
      ['btr031', 'o:BTR', '031', 1663, 804],
      ['btr033', 'o:BTR', '033', 1652, 867.3],
      ['btr040', 'o:BTR', '040', 1692, 1196],
      ['btr042', 'o:BTR', '042', 1681, 1260.7]
    ],
    w,
    j: [
      [666, R.off1 + 22],
      [652.7, R.off2 + 22],
      [682, R.off3 + 22],
      [BUS, 165],
      [BUS, 370],
      [BUS, 581],
      [BUS, 646],
      [BUS, 888],
      [PERM, 240],
      [PERM, 909.5],
      [708.7, 548.5],
      [695.3, 867.3],
      [735.3, 1270]
    ],
    t
  });
})();
