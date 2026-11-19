/* TCE102 INPUT SIGNAL DIAGNOSTICS(2) (331DM09784 page 70, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the sheets of
   single pressure inputs (tce/_lib.js, TCE_LIB.aid); units = the pixels of the page rendered 2296 wide. The scan of this page is turned a little;
   every place is typed as it stands on the page set straight, and what stands on one line of the drawing has one height here.
   Three single pressure inputs, each a transmitter through the analog input card into one AI DIAG.MD block: MOP(A) discharge oil pressure, COP(A)
   discharge oil pressure, hot reheat steam pressure. The block is printed without cells (its pins as words inside it); the settings under each
   block are typed as the drawing lists them. The title block of this page prints PAGE 68; it is page 70 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.aid({
      id: 'TCE102',
      title: 'INPUT SIGNAL DIAGNOSTICS(2)',
      page: 70,
      f: [178, 82, 2228, 1546],
      foot: [[247, 1523, 'CONTROLLER:'], [406, 1523, 'EHG+MD'], [668, 1497, 'TRIGGER  :'], [668, 1524, 'CYCLE(ms):30']],
      rows: [
        { y: 214, lab: ['MOP(A) DISCHARGE', 'OIL PRESS.'], pt: 'PT-LOn922-A', rng: '0- 10kg/cm2g', card: 'TCE930-2', xf: 1217, mf: '001', mx: 1374, tag: 'nPT-LOn922-A', foot: 'A002', sg: ['B004', 1216, 87, 76, 1353, 'K:7.0kg/cm2g'], xe: 1343, par: ['10.2', '-0.5', '2.0', '-2.0'], xj: 1660, dyB: -82, B: ['B2', ['TCT201']], A: ['A2', ['TCE300']], mo: '003', D: ['D2', ['TCE470']], mb: '005', dyD: 108 },
        { y: 502, lab: ['COP(A) DISCHARGE', 'OIL PRESS.'], pt: 'PT-LOn931-A', rng: '0- 250kg/cm2g', card: 'TCE930-3', xf: 897, mf: '006', mx: 1045, tag: 'nPT-LOn931-A', foot: 'A007', sg: ['B009', 897, 97, 86, 1024, 'K:150.0kg/cm2g'], xe: 1014, par: ['255.0', '-12.5', '50.0', '-50.0'], xj: 1662, dyB: -75, B: ['B3', ['TCT201']], A: ['A3', ['TCE305']], mo: '008', D: ['D3', ['TCE470']], mb: '010', dyD: 104 },
        { y: 821, lab: ['HOT REHEAT', 'STEAM PRESS.'], pt: 'PT-HRn901', rng: '0- 50kg/cm2g', card: 'TCE930-4', xf: 1218, mf: '011', mx: 1375, tag: 'nPT-HRn901', foot: 'A012', sg: ['B014', 1216, 97, 87, 1354, 'K:5.0kg/cm2g'], xe: 1344, par: ['51.0', '-2.5', '10.0', '-10.0'], xj: 1672, dyB: -74, B: ['B4', ['TCA532', 'TCT200']], A: ['A4', ['-']], mo: '013', D: ['D4', ['TCE470']], mb: '015', dyD: 106 }
      ]
    })
  );
})();
