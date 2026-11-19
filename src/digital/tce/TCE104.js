/* TCE104 INPUT SIGNAL DIAGNOSTICS(4) (331DM09784 page 72, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the sheets of
   single pressure inputs (tce/_lib.js, TCE_LIB.aid); units = the pixels of the page rendered 2296 wide. The scan of this page is turned a little;
   every place is typed as it stands on the page set straight, and what stands on one line of the drawing has one height here.
   MOP(B) discharge oil pressure, COP(B) discharge oil pressure and EOP discharge oil pressure, as TCE102 has the (A) pumps. The abnormal signal
   of the third line is named "HOT DISCHARGE OIL PRESS. ABN." in the drawing; typed as printed. The title block of this page prints PAGE 70;
   it is page 72 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.aid({
      id: 'TCE104',
      title: 'INPUT SIGNAL DIAGNOSTICS(4)',
      page: 72,
      f: [178, 82, 2228, 1546],
      foot: [[247, 1523, 'CONTROLLER:'], [406, 1523, 'EHG+MD'], [668, 1497, 'TRIGGER  :'], [668, 1524, 'CYCLE(ms):30']],
      rows: [
        { y: 214, lab: ['MOP(B) DISCHARGE', 'OIL PRESS.'], pt: 'PT-LOn922-B', rng: '0- 10kg/cm2g', card: 'TCE930-10', xf: 1217, mf: '001', mx: 1374, tag: 'nPT-LOn922-B', foot: 'A002', sg: ['B004', 1216, 87, 76, 1353, 'K:7.0kg/cm2g'], xe: 1343, par: ['10.2', '-0.5', '2.0', '-2.0'], xj: 1683, dyB: -82, B: ['B2', ['TCT201']], A: ['A2', ['TCE300']], mo: '003', D: ['D2', ['TCE470']], mb: '005', dyD: 108 },
        { y: 502, lab: ['COP(B) DISCHARGE', 'OIL PRESS.'], pt: 'PT-LOn931-B', rng: '0- 250kg/cm2g', card: 'TCE930-11', xf: 897, mf: '006', mx: 1045, tag: 'nPT-LOn931-B', foot: 'A007', sg: ['B009', 897, 97, 86, 1024, 'K:150.0kg/cm2g'], xe: 1014, par: ['255.0', '-12.5', '50.0', '-50.0'], xj: 1672, dyB: -85, bx: 2004, B: ['B3', ['TCT201']], A: ['A3', ['TCE305']], mo: '008', D: ['D3', ['TCE470']], mb: '010', dyD: 104 },
        { y: 821, lab: ['EOP DISCHARGE', 'OIL PRESS.'], pt: 'PT-LOn923', rng: '0- 5kg/cm2g', card: 'TCE930-12', xf: 1218, mf: '011', mx: 1375, tag: 'nPT-LOn923', foot: 'A012', sg: ['B014', 1216, 97, 87, 1354, 'K:0.5kg/cm2g'], xe: 1344, par: ['5.1', '-0.25', '1.0', '-1.0'], xj: 1695, dyB: -104, B: ['B4', ['TCT201']], A: ['A4', ['TCE310']], mo: '013', D: ['D4', ['TCE470']], mb: '015', dyD: 106, abn: ['HOT DISCHARGE', 'OIL PRESS. ABN.'] }
      ]
    })
  );
})();
