/* TCA752 THERMAL STRESS(HP) (331DM09788 page 182, controller COMM+MD, trigger Trigger-of_LOGIC_2, cycle 60 s). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. Three DISTRIBUTION blocks (LMA627) A001 / A004 / A007, as drawn:
   - A001: Q+1 = 0.0 (sys.ref), TP = TH(5), TP-1 = TH(4), SGA / SGB = SG A002 (HA5, K:70.8869) / SG A003 (HB5, K:0.275001). TOUT = TH(5)N.
   - A004: Q+1 = QOUT of A001, TP = TH(4), TP-1 = TH(3), SG A005 (HA4, K:212.667) / SG A006 (HB4, K:0.550002). TOUT = TH(4)N.
   - A007: Q+1 = QOUT of A004, TP = TH(3), TP-1 = TH(2), SG A008 (HA3, K:354.435) / SG A009 (HB3, K:0.825004). TOUT = TH(3)N,
     QOUT = QH(3)N.
   TH(2)-TH(5) come from TCA751; TH(n)N go to TCA751 and TCA754, QH(3)N to TCA753. The three sections are the same drawing moved down
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
    { dx: 0, dy: 0, n: 5, a: ['A001', 'A002', 'A003'], k: ['K:70.8869', 'K:0.275001'], vx: 573 },
    { dx: -4, dy: 416, n: 4, a: ['A004', 'A005', 'A006'], k: ['K:212.667', 'K:0.550002'], vx: 569 },
    { dx: -6.7, dy: 850.7, n: 3, a: ['A007', 'A008', 'A009'], k: ['K:354.435', 'K:0.825004'], vx: 566 }
  ];
  const MX = 1014,
    MW = 319.3,
    MT = 226.7,
    MH = 148.7,
    LY = [257.3, 278.7, 300.7, 322, 343.3];
  S.forEach((s, i) => {
    const X = x => x + s.dx,
      Y = y => y + s.dy,
      mk = 'dist' + (i + 1),
      ik = 'iT' + s.n;
    /* the block */
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
        [X(1170), Y(401), '(LMA627)', 1],
        ...['K:60.0', 'XO:0.0', 'YO:0.0', 'G :1.0', 'C :0.0', 'XO:0.0', 'YO:0.0', 'G :1.0', 'XC:0.0'].map((p, r) => [
          X(1018),
          Math.round(Y(393 + 21.33 * r)),
          p
        ])
      ],
      [LY.map(Y), [Y(257.3), Y(343.3)]]
    ]);
    /* TH(n) in to TP */
    c.push([ik, 'in', String(s.n), X(309), Y(LY[1]), '', ['TCA751'], 0, 1]);
    WT(ik, [X(336), Y(LY[1])], [X(MX), Y(LY[1])]);
    t.push([X(341), Y(275), 'TH(' + s.n + ')']);
    /* the SG constants */
    b.push(['sg' + s.a[1], 'SG', s.a[1], X(714.7), Y(365), [s.k[0]]]);
    b.push(['sg' + s.a[2], 'SG', s.a[2], X(714.7), Y(440), [s.k[1]]]);
    WT('sg' + s.a[1], [X(714.7 + HW), Y(354)], [X(894.7), Y(354)], [X(894.7), Y(LY[3])], [X(MX), Y(LY[3])]);
    WT('sg' + s.a[2], [X(714.7 + HW), Y(429)], [X(948), Y(429)], [X(948), Y(LY[4])], [X(MX), Y(LY[4])]);
    t.push([X(823), Y(351), 'HA' + s.n], [X(823), Y(426), 'HB' + s.n]);
    /* TOUT out */
    const oc = [2068, 2063, 2060][i];
    WT(mk + '.TOUT', [X(MX + MW), Y(257.3)], [oc - 27, Y(257.3)]);
    c.push(['oT' + s.n, 'out', String(s.n), oc, Y(257.3), '', ['TCA751', 'TCA754'], 0, 4]);
    t.push([[1912, 1908, 1904][i], Y(255), 'TH(' + s.n + ')N']);
  });
  /* Q+1 of A001 and the QOUT loops */
  WT('kZero', [518, 173.3], [950, 173.3], [950, 257.3], [MX, 257.3]);
  WT('dist1.QOUT', [MX + MW, 343.3], [1428.7, 343.3], [1428.7, 588.7], [945.3, 588.7], [945.3, 673.3], [MX - 4, 673.3]);
  WT('dist2.QOUT', [MX - 4 + MW, 759.3], [1424.7, 759.3], [1424.7, 1013.3], [943.3, 1013.3], [943.3, 1108], [MX - 6.7, 1108]);
  WT('dist3.QOUT', [MX - 6.7 + MW, 1194], [2033, 1194]);
  c.push(['oQ', 'out', 'Q', 2060, 1194, '', ['TCA753'], 0, 1]);
  t.push([1904, 1192, 'QH(3)N']);
  /* TP-1 = the TH of the next section */
  WT('iT4', [573, 694.7], [573, 300.7], [MX, 300.7]);
  WT('iT3', [569, 1129.4], [569, 716.7], [MX - 4, 716.7]);
  WT('iT2', [328, 1428], [566, 1428], [566, 1151.4], [MX - 6.7, 1151.4]);
  c.push(['iT2', 'in', '2', 301, 1428, '', ['TCA751'], 0, 1]);
  t.push([333, 1424, 'TH(2)']);
  j.push([573, 694.7], [569, 1129.4]);
  t.push(
    [237, 1529, 'CONTROLLER:'],
    [397, 1529, 'COMM+MD'],
    [620, 1513, 'TRIGGER  :Trigger-of_LOGIC_2'],
    [620, 1540, 'CYCLE(s):60']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA752',
    title: 'THERMAL STRESS(HP)',
    page: 182,
    ctl: 'COMM+MD',
    cycle: 60000,
    f: [172, 87, 2226, 1547],
    k: [['kZero', 285, 173.3, '0.0', 'sys.ref']],
    c,
    m,
    b,
    w,
    j,
    t
  });
})();
