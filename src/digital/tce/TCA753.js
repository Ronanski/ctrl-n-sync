/* TCA753 THERMAL STRESS(HP) (331DM09788 page 183, controller COMM+MD, trigger Trigger-of_LOGIC_2, cycle 60 s). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. Two DISTRIBUTION blocks (LMA627) A004 / A007, as drawn:
   - A004: Q+1 = QH(3)N (from TCA752), TP = TH(2), TP-1 = TH(1), SGA / SGB = SG A005 (HA2, K:496.208) / SG A006 (HB2, K:1.1).
     TOUT = TH(2)N.
   - A007: Q+1 = QOUT of A004, TP = TH(1), TP-1 = TS_H, SG A008 (HA1, K:638.306) / SG A009 (HB1, K:2.61251). TOUT = TH(1)N; its QOUT
     is not connected.
   TH(1), TH(2) and TS_H come from TCA751; TH(n)N go to TCA751 and TCA754. The second section is the first one moved down (dy) and a
   little left (dx, the skew of the scan).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [],
    m = [],
    b = [],
    c = [];
  const WT = (key, ...pts) => w.push([key, pts, 1]);
  const HW = 28.76;
  /* section 1 geometry (A004); section 2 is moved by dx / dy */
  const S = [
    { dx: 0, dy: 0, n: 2, a: ['A004', 'A005', 'A006'], k: ['K:496.208', 'K:1.1'], oc: 2039.3, ox: 1907 },
    { dx: -3, dy: 437.3, n: 1, a: ['A007', 'A008', 'A009'], k: ['K:638.306', 'K:2.61251'], oc: 2035, ox: 1902 }
  ];
  const MX = 1059.3,
    MW = 320.7,
    MT = 264,
    MH = 149.3,
    LY = [296.7, 318, 338.7, 360, 381.3];
  S.forEach((s, i) => {
    const X = x => x + s.dx,
      Y = y => y + s.dy,
      mk = 'dist' + (i + 1);
    m.push([
      mk,
      'DISTRIBUTION',
      '',
      X(MX),
      Y(MT),
      MW,
      MH,
      ['Q+1', 'TP', 'TP-1', 'SGA', 'SGB'],
      ['TOUT', 'QOUT'],
      s.a[0],
      [
        [X(1217), Y(438), '(LMA627)', 1],
        ...['K:60.0', 'XO:0.0', 'YO:0.0', 'G :1.0', 'C :0.0', 'XO:0.0', 'YO:0.0', 'G :1.0', 'XC:0.0'].map((p, r) => [
          X(1063),
          Math.round(Y(446 + 21.33 * r)),
          p
        ])
      ],
      [LY.map(Y), [Y(LY[0]), Y(LY[4])]]
    ]);
    /* the SG constants */
    b.push(['sg' + s.a[1], 'SG', s.a[1], X(761.5), Y(403.7), [s.k[0]]]);
    b.push(['sg' + s.a[2], 'SG', s.a[2], X(761.5), Y(478.7), [s.k[1]]]);
    WT('sg' + s.a[1], [X(761.5 + HW), Y(392.7)], [X(942), Y(392.7)], [X(942), Y(LY[3])], [X(MX), Y(LY[3])]);
    WT('sg' + s.a[2], [X(761.5 + HW), Y(467.7)], [X(995.3), Y(467.7)], [X(995.3), Y(LY[4])], [X(MX), Y(LY[4])]);
    t.push([X(866), Y(390), 'HA' + s.n], [X(866), Y(465), 'HB' + s.n]);
    /* TOUT out */
    WT(mk + '.TOUT', [X(MX + MW), Y(LY[0])], [s.oc - 27, Y(LY[0])]);
    c.push(['oT' + s.n, 'out', String(s.n), s.oc, Y(LY[0]), '', ['TCA751', 'TCA754'], 0, 4]);
    t.push([s.ox, Y(294.7), 'TH(' + s.n + ')N']);
  });
  /* inputs */
  c.push(
    ['iQ', 'in', 'Q', 344.5, 180.7, '', ['TCA752'], 0, 1],
    ['iT2', 'in', '2', 344, 318, '', ['TCA751'], 0, 1],
    ['iT1', 'in', '1', 352.7, 754.7, '', ['TCA751'], 0, 1],
    ['iS', 'in', 'S', 362.3, 1051.3, '', ['TCA751'], 0, 1]
  );
  WT('iQ', [371.5, 180.7], [997, 180.7], [997, LY[0]], [MX, LY[0]]);
  WT('iT2', [371, 318], [MX, 318]);
  WT('iT1', [379.7, 754.7], [MX - 3, 754.7]);
  WT('iT1', [621, 754.7], [621, 338.7], [MX, 338.7]);
  WT('iS', [389.3, 1051.3], [618.7, 1051.3], [618.7, 776], [MX - 3, 776]);
  t.push([379, 178.7, 'QH(3)N'], [379, 316, 'TH(2)'], [385, 752.7, 'TH(1)'], [393, 1049.3, 'TS_H']);
  /* QOUT of A004 to Q+1 of A007 */
  WT('dist1.QOUT', [MX + MW, 381.3], [1474.7, 381.3], [1474.7, 637.3], [993.3, 637.3], [993.3, 734], [MX - 3, 734]);
  t.push(
    [231, 1525, 'CONTROLLER:'],
    [391, 1525, 'COMM+MD'],
    [615, 1497, 'TRIGGER  :Trigger-of_LOGIC_2'],
    [615, 1525, 'CYCLE(s):60']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA753',
    title: 'THERMAL STRESS(HP)',
    page: 183,
    ctl: 'COMM+MD',
    cycle: 60000,
    f: [172, 87, 2220, 1545],
    c,
    m,
    b,
    w,
    j: [[621, 754.7]],
    t
  });
})();
