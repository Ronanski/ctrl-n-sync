/* TCE112 TPC SIGNAL DIAGNOSTICS(3) (331DM09784 page 75, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the digital
   input diagnostics sheets (tce/_lib.js, TCE_LIB.did); the places are those of the page set straight, as on TCE075.
   HP turbine exhaust steam temperature very high, HP turbine inlet / exhaust steam differential pressure very high, HP turbine exhaust steam
   pressure very high and boiler MFT. The discrepancy of each also has a lamp of the operator station. The discrepancy of the second is
   named "VERY DISCREPANCY" in the drawing; typed as printed. The title block of this page prints PAGE 73; it is page 75 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  const R = ['TCP1120', 'TCP2120', 'TCP3120'],
    N = (L, E) => ({ in: [L, L, L], out: [L, L, E, E] });
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.did({
      id: 'TCE112',
      title: 'TPC SIGNAL DIAGNOSTICS(3)',
      page: 75,
      f: [180, 75, 2232, 1535],
      tops: [103, 391, 668, 976],
      line2: '',
      orName: 'DISCREPANCY',
      g: [
        [N(['HP TURBINE EXHAUST STEAM', 'TEMP. VERY HIGH TRIP'], ['HP TURBINE EXHAUST STEAM', 'TEMP. VERY HIGH TRIP DISCREPANCY']), 'B9', 'A', ['001', '004', '032'], ['003', '005', '006', '007'], '031', 'TCE112_1', null, R, { el: 'TCE112_2' }],
        [N(['HP TURBINE INLET/EXHAUST', 'STEAM DIFF.PRESS.', 'VERY HIGH TRIP'], ['HP TURBINE INLET/EXHAUST', 'STEAM DIFF.PRESS.', 'VERY DISCREPANCY']), 'B10', 'B', ['008', '011', '033'], ['010', '012', '013', '014'], '009', 'TCE112_3', null, R, { el: 'TCE112_4' }],
        [N(['HP TURBINE EXHAUST', 'STEAM PRESS.', 'VERY HIGH TRIP'], ['HP TURBINE EXHAUST', 'STEAM PRESS.', 'VERY HIGH TRIP DISCREPANCY']), 'B11', 'C', ['015', '018', '034'], ['017', '019', '020', '021'], '016', 'TCE112_5', null, R, { el: 'TCE112_6' }],
        [N(['BOILER MFT'], ['BOILER MFT DISCREPANCY']), 'B12', 'D', ['022', '025', '035'], ['024', '026', '029', '030'], '023', 'TCE112_7', null, R, { el: 'TCE112_8' }]
      ],
      or: ['027', '028'],
      e: ['E', ['TCE471']],
      foot: [[247, 1512, 'CONTROLLER:'], [408, 1512, 'EHG+MD'], [670, 1485, 'TRIGGER  :'], [670, 1512, 'CYCLE(ms):30']]
    })
  );
})();
