/* TCA756 THERMAL STRESS(IP) (331DM09788 page 186, controller COMM+MD, trigger Trigger-of_LOGIC_2, cycle 60 s). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. Three DISTRIBUTION blocks (LMA627) A001 / A004 / A007, as drawn:
   - A001: Q+1 = 0.0 (sys.ref), TP = TI(5), TP-1 = TI(4), SGA / SGB = SG A002 (IA5, K:75.2132) / SG A003 (IB5, K:0.275001). TOUT = TI(5)N.
   - A004: Q+1 = QOUT of A001, TP = TI(4), TP-1 = TI(3), SG A005 (IA4, K:225.64) / SG A006 (IB4, K:0.550002). TOUT = TI(4)N.
   - A007: Q+1 = QOUT of A004, TP = TI(3), TP-1 = TI(2), SG A008 (IA3, K:376.64) / SG A009 (IB3, K:0.825004). TOUT = TI(3)N,
     QOUT = QI(3)N.
   TI(2)-TI(5) come from TCA755; TI(n)N go to TCA755 and TCA758, QI(3)N to TCA757. The three sections are the same drawing moved down
   (dy) and a little left (dx, the skew of the scan).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [],
    m = [],
    b = [],
    c = [],
    j = [];
  const WT = (key, ...pts) => w.push([key, pts, 1]);
  const HW = 28.76;
  /* section 1 geometry (A001); the others are moved by dx / dy */
  const S = [
    { dx: 0, dy: 0, n: 5, a: ['A001', 'A002', 'A003'], k: ['K:75.2132', 'K:0.275001'], cx: 311.7, oc: 2070, ox: 1918 },
    { dx: -4.7, dy: 414.7, n: 4, a: ['A004', 'A005', 'A006'], k: ['K:225.64', 'K:0.550002'], cx: 308, oc: 2067, ox: 1913 },
    { dx: -7.4, dy: 850, n: 3, a: ['A007', 'A008', 'A009'], k: ['K:376.64', 'K:0.825004'], cx: 305, oc: 2063.5, ox: 1910 }
  ];
  const MX = 1016.7,
    MW = 320.6,
    MT = 225.3,
    MH = 149.4,
    LY = [257.3, 278.7, 300, 321.3, 342.7];
  S.forEach((s, i) => {
    const X = x => x + s.dx,
      Y = y => y + s.dy,
      mk = 'dist' + (i + 1),
      ik = 'iT' + s.n;
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
        [X(1173), Y(400), '(LMA627)', 1],
        ...['K:60.0', 'XO:0.0', 'YO:0.0', 'G :1.0', 'C :0.0', 'XO:0.0', 'YO:0.0', 'G :1.0', 'XC:0.0'].map((p, r) => [
          X(1022),
          Math.round(Y(405 + 21.33 * r)),
          p
        ])
      ],
      [LY.map(Y), [Y(LY[0]), Y(LY[4])]]
    ]);
    /* TI(n) in to TP */
    c.push([ik, 'in', String(s.n), s.cx, Y(LY[1]), '', ['TCA755'], 0, 1]);
    WT(ik, [s.cx + 27, Y(LY[1])], [X(MX), Y(LY[1])]);
    t.push([s.cx + 32, Y(LY[1]) - 3, 'TI(' + s.n + ')']);
    /* the SG constants */
    b.push(['sg' + s.a[1], 'SG', s.a[1], X(716.7), Y(364.3), [s.k[0]]]);
    b.push(['sg' + s.a[2], 'SG', s.a[2], X(716.7), Y(438.3), [s.k[1]]]);
    WT('sg' + s.a[1], [X(716.7 + HW), Y(353.3)], [X(900), Y(353.3)], [X(900), Y(LY[3])], [X(MX), Y(LY[3])]);
    WT('sg' + s.a[2], [X(716.7 + HW), Y(427.3)], [X(951.3), Y(427.3)], [X(951.3), Y(LY[4])], [X(MX), Y(LY[4])]);
    t.push([X(826), Y(350), 'IA' + s.n], [X(826), Y(424), 'IB' + s.n]);
    /* TOUT out */
    WT(mk + '.TOUT', [X(MX + MW), Y(LY[0])], [s.oc - 27, Y(LY[0])]);
    c.push(['oT' + s.n, 'out', String(s.n), s.oc, Y(LY[0]), '', ['TCA755', 'TCA758'], 0, 4]);
    t.push([s.ox, Y(LY[0]) - 2, 'TI(' + s.n + ')N']);
  });
  /* Q+1 of A001 and the QOUT loops */
  WT('kZero', [521.3, 171.3], [952.7, 171.3], [952.7, 257.3], [MX, 257.3]);
  WT('dist1.QOUT', [MX + MW, 342.7], [1430, 342.7], [1430, 588], [951.3, 588], [951.3, 672], [MX - 4.7, 672]);
  WT('dist2.QOUT', [MX - 4.7 + MW, 757.4], [1426, 757.4], [1426, 1012.7], [945.3, 1012.7], [945.3, 1107.3], [MX - 7.4, 1107.3]);
  WT('dist3.QOUT', [MX - 7.4 + MW, 1192.7], [2063 - 27, 1192.7]);
  c.push(['oQ', 'out', 'Q', 2063, 1192.7, '', ['TCA757'], 0, 1]);
  t.push([1907, 1190.7, 'QI(3)N']);
  /* TP-1 = the TI of the next section */
  WT('iT4', [578, 694], [578, 300], [MX, 300]);
  WT('iT3', [575, 1128.7], [575, 714.7], [MX - 4.7, 714.7]);
  WT('iT2', [332, 1426.7], [572, 1426.7], [572, 1150], [MX - 7.4, 1150]);
  c.push(['iT2', 'in', '2', 305, 1426.7, '', ['TCA755'], 0, 1]);
  t.push([337, 1423, 'TI(2)']);
  j.push([578, 694], [575, 1128.7]);
  t.push(
    [239, 1528, 'CONTROLLER:'],
    [399, 1528, 'COMM+MD'],
    [624, 1512, 'TRIGGER  :Trigger-of_LOGIC_2'],
    [624, 1538, 'CYCLE(s):60']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA756',
    title: 'THERMAL STRESS(IP)',
    page: 186,
    ctl: 'COMM+MD',
    cycle: 60000,
    f: [178, 87, 2232, 1547],
    k: [['kZero', 288.3, 171.3, '0.0', 'sys.ref']],
    c,
    m,
    b,
    w,
    j,
    t
  });
})();
