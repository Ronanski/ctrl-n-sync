/* TCE102 INPUT SIGNAL DIAGNOSTICS(2) (331DM09784 page 70, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The scan of this page is turned a little; every place is typed as it stands on the page set straight, and what stands on one line of
   the drawing has one height here.
   Three single pressure inputs, each a transmitter through the analog input card into one AI DIAG.MD block: MOP(A) discharge oil pressure, COP(A)
   discharge oil pressure, hot reheat steam pressure. The block is printed without cells (its pins as words inside it); the settings under each
   block are typed as the drawing lists them. The title block of this page prints PAGE 68; it is page 70 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  const r = [],
    b = [],
    c = [],
    w = [],
    t = [],
    l = [],
    tri = [],
    m = [],
    two = (x, y, a, bb) => t.push([x, y - 27, a], [x, y - 6, bb]);
  [
    {
      y: 214, lab: ['MOP(A) DISCHARGE', 'OIL PRESS.'], pt: 'PT-LOn922-A', rng: '0- 10kg/cm2g', card: 'TCE930-2', xf: 1217, mf: '001', mx: 1374, tag: 'nPT-LOn922-A',
      foot: 'A002', sg: ['B004', 1216, 87, 76, 1353, 'K:7.0kg/cm2g'], xe: 1343, par: ['10.2', '-0.5', '2.0', '-2.0'], xj: 1660, dyB: -82, B: ['B2', ['TCT201']],
      A: ['A2', ['TCE300']], mo: '003', D: ['D2', ['TCE470']], mb: '005', dyD: 108
    },
    {
      y: 502, lab: ['COP(A) DISCHARGE', 'OIL PRESS.'], pt: 'PT-LOn931-A', rng: '0- 250kg/cm2g', card: 'TCE930-3', xf: 897, mf: '006', mx: 1045, tag: 'nPT-LOn931-A',
      foot: 'A007', sg: ['B009', 897, 97, 86, 1024, 'K:150.0kg/cm2g'], xe: 1014, par: ['255.0', '-12.5', '50.0', '-50.0'], xj: 1662, dyB: -75, B: ['B3', ['TCT201']],
      A: ['A3', ['TCE305']], mo: '008', D: ['D3', ['TCE470']], mb: '010', dyD: 104
    },
    {
      y: 821, lab: ['HOT REHEAT', 'STEAM PRESS.'], pt: 'PT-HRn901', rng: '0- 50kg/cm2g', card: 'TCE930-4', xf: 1218, mf: '011', mx: 1375, tag: 'nPT-HRn901',
      foot: 'A012', sg: ['B014', 1216, 97, 87, 1354, 'K:5.0kg/cm2g'], xe: 1344, par: ['51.0', '-2.5', '10.0', '-10.0'], xj: 1672, dyB: -74, B: ['B4', ['TCA532', 'TCT200']],
      A: ['A4', ['-']], mo: '013', D: ['D4', ['TCE470']], mb: '015', dyD: 106
    }
  ].forEach((o, i) => {
    const n = i + 1,
      y = o.y,
      k = 't' + n,
      M = 'm' + n,
      mx = o.mx,
      xr = mx + 235,
      [sno, sx, sdy, sdo, sxc, snote] = o.sg;
    /* the transmitter, the card and its PI/O error */
    b.push(['x' + n, 'X', '', 393, y, [], {}, [21]], ['f' + o.mf, 'o:FTR', o.mf, o.xf, y]);
    l.push([[414, y], [582, y]]);
    r.push([k, 582, y - 12, 52, 24, 'mA/V'], ['pe' + n, 631, y + 30, 125, 23, 'PI/O error']);
    tri.push([728, y, 9]);
    t.push(
      [293, y - 62, o.lab[0]],
      [293, y - 40, o.lab[1]],
      [245, y + 6, '(' + o.pt + ')'],
      [420, y - 6, o.rng],
      [420, y + 26, '4- 20mA'],
      [634, y - 20, '(' + o.card + ')'],
      [648, y + 25, '(' + o.card + ')']
    );
    w.push([k, [[634, y], [mx, y]], 1], ['pe' + n, [[756, y + 41], [o.xe, y + 41], [o.xe, y + 22], [mx, y + 22]]]);
    /* the block, its simulation value and its settings */
    m.push([
      M, 'AI DIAG.MD', o.tag, mx, y - 30, 235, 128, ['IN', 'ERR', 'SIM'], ['OUT', 'ABN'], o.foot,
      [
        [mx + 80, y + 116, '(LME510)'],
        [mx - 23, y + 145, 'DEF N:3'],
        [mx - 2, y + 166, 'K:1'],
        [mx - 24, y + 188, 'H/L HL:' + o.par[0]],
        [mx - 2, y + 209, 'LL:' + o.par[1]],
        [mx - 24, y + 230, 'DEF TP:0.18S'],
        [mx + 137, y + 145, 'DEV HL:' + o.par[2]],
        [mx + 157, y + 166, 'LL:' + o.par[3]],
        [mx + 137, y + 188, 'DEF TP:0.03S'],
        [mx + 137, y + 209, 'DEF N:3'],
        [mx + 157, y + 230, 'K:1']
      ],
      [[y + 5, y + 27, y + 49], [y + 5, y + 49]]
    ]);
    b.push(['sg' + n, 'SG', sno, sx, y + sdy, [snote]]);
    w.push(['sg' + n, [[sx + 29, y + sdo], [sxc, y + sdo], [sxc, y + 44], [mx, y + 44]], 1]);
    /* the outputs: the value to two connectors, the abnormal signal to one */
    c.push(['o' + o.B[0], 'out', o.B[0], 2013, y + o.dyB, '', o.B[1], 1], ['o' + o.A[0], 'out', o.A[0], 2013, y, '', o.A[1]], ['o' + o.D[0], 'out', o.D[0], 2013, y + o.dyD, '', o.D[1]]);
    b.push(['f' + o.mo, 'o:FTR', o.mo, 1727, y], ['b' + o.mb, 'o:BTR', o.mb, 1727, y + o.dyD]);
    w.push(
      [M + '.OUT', [[xr, y], [1986, y]], 1],
      [M + '.OUT', [[o.xj, y], [o.xj, y + o.dyB], [1986, y + o.dyB]], 1],
      [M + '.ABN', [[xr, y + 44], [1672, y + 44], [1672, y + o.dyD], [1986, y + o.dyD]]]
    );
    two(1775, y, o.lab[0], o.lab[1]);
    two(1773, y + o.dyD, o.lab[0], o.lab[1] + ' ABN.');
  });
  t.push([247, 1523, 'CONTROLLER:'], [406, 1523, 'EHG+MD'], [668, 1497, 'TRIGGER  :'], [668, 1524, 'CYCLE(ms):30']);
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({ id: 'TCE102', title: 'INPUT SIGNAL DIAGNOSTICS(2)', page: 70, ctl: 'EHG+MD', cycle: 30, f: [178, 82, 2228, 1546], r, l, tri, c, m, b, w, t });
})();
