/* TCA757 THERMAL STRESS(IP) (331DM09788 page 187, controller COMM+MD, trigger Trigger-of_LOGIC_2, cycle 60 s). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. Two DISTRIBUTION blocks (LMA627) A004 / A007, as drawn:
   - A004: Q+1 = QI(3)N (from TCA756), TP = TI(2), TP-1 = TI(1), SGA / SGB = SG A005 (IA2, K:526.492) / SG A006 (IB2, K:1.10001).
     TOUT = TI(2)N.
   - A007: Q+1 = QOUT of A004, TP = TI(1), TP-1 = TS_I, SG A008 (IA1, K:676.918) / SG A009 (IB1, K:1.37501). TOUT = TI(1)N; its QOUT
     is not connected.
   TI(1), TI(2) and TS_I come from TCA755; TI(n)N go to TCA755 and TCA758. The second section is the first one moved down (dy) and a
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
  /* section geometry (base = the A004 section with no move) */
  const S = [
    { dx: 0.7, dy: 14.5, n: 2, a: ['A004', 'A005', 'A006'], k: ['K:526.492', 'K:1.10001'], oc: 2038, ox: 1902 },
    { dx: -2.3, dy: 450.8, n: 1, a: ['A007', 'A008', 'A009'], k: ['K:676.918', 'K:1.37501'], oc: 2034.5, ox: 1900 }
  ];
  const MX = 1059.3,
    MW = 320.7,
    MT = 264,
    MH = 149.3,
    LY = [296.7, 318, 338.7, 360, 381.3];
  const P = (s, i) => LY[i] + s.dy,
    XM = s => MX + s.dx;
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
    b.push(['sg' + s.a[1], 'SG', s.a[1], X(761.5), Y(403.7), [s.k[0]]]);
    b.push(['sg' + s.a[2], 'SG', s.a[2], X(761.5), Y(478.7), [s.k[1]]]);
    WT('sg' + s.a[1], [X(761.5 + HW), Y(392.7)], [X(942), Y(392.7)], [X(942), Y(LY[3])], [X(MX), Y(LY[3])]);
    WT('sg' + s.a[2], [X(761.5 + HW), Y(467.7)], [X(995.3), Y(467.7)], [X(995.3), Y(LY[4])], [X(MX), Y(LY[4])]);
    t.push([X(866), Y(390), 'IA' + s.n], [X(866), Y(465), 'IB' + s.n]);
    WT(mk + '.TOUT', [X(MX + MW), Y(LY[0])], [s.oc - 27, Y(LY[0])]);
    c.push(['oT' + s.n, 'out', String(s.n), s.oc, Y(LY[0]), '', ['TCA755', 'TCA758'], 0, 4]);
    t.push([s.ox, Y(LY[0]) - 2, 'TI(' + s.n + ')N']);
  });
  const [A, B] = S;
  /* inputs */
  c.push(
    ['iQ', 'in', 'Q', 348, 193, '', ['TCA756'], 0, 1],
    ['iT2', 'in', '2', 348, P(A, 1), '', ['TCA755'], 0, 1],
    ['iT1', 'in', '1', 352, P(B, 1), '', ['TCA755'], 0, 1],
    ['iS', 'in', 'S', 360, P(B, 2) + 275.3, '', ['TCA755'], 0, 1]
  );
  WT('iQ', [375, 193], [996, 193], [996, P(A, 0)], [XM(A), P(A, 0)]);
  WT('iT2', [375, P(A, 1)], [XM(A), P(A, 1)]);
  WT('iT1', [379, P(B, 1)], [XM(B), P(B, 1)]);
  WT('iT1', [621, P(B, 1)], [621, P(A, 2)], [XM(A), P(A, 2)]);
  WT('iS', [387, P(B, 2) + 275.3], [619, P(B, 2) + 275.3], [619, P(B, 2)], [XM(B), P(B, 2)]);
  t.push([378, 191, 'QI(3)N'], [378, P(A, 1) - 2, 'TI(2)'], [385, P(B, 1) - 2, 'TI(1)'], [395, P(B, 2) + 273, 'TS_I']);
  /* QOUT of A004 to Q+1 of A007 */
  WT('dist1.QOUT', [XM(A) + MW, P(A, 4)], [1477, P(A, 4)], [1477, 651.5], [993.3, 651.5], [993.3, P(B, 0)], [XM(B), P(B, 0)]);
  t.push(
    [233, 1540, 'CONTROLLER:'],
    [393, 1540, 'COMM+MD'],
    [617, 1513, 'TRIGGER  :Trigger-of_LOGIC_2'],
    [617, 1540, 'CYCLE(s):60']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA757',
    title: 'THERMAL STRESS(IP)',
    page: 187,
    ctl: 'COMM+MD',
    cycle: 60000,
    f: [168, 96, 2213, 1557],
    c,
    m,
    b,
    w,
    j: [[621, P(B, 1)]],
    t
  });
})();
