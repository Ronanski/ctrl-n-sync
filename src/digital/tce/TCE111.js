/* TCE111 TPC SIGNAL DIAGNOSTICS(2) (331DM09784 page 74, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the digital
   input diagnostics sheets (tce/_lib.js, TCE_LIB.did); the places are those of the page set straight, as on TCE075.
   Control pressure very low, bearing oil pressure very low, LP exhaust hood steam temperature very high and turbine trip oil pressure very low.
   The last also goes out by a double-line connector D1 over its lamp, so its discrepancy goes out by D2. The title block of this page prints
   PAGE 72; it is page 74 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  const R = ['TCP1120', 'TCP2120', 'TCP3120'],
    N = (a, b) => ({ in: [[a, b], [a, b], [a, b]], out: [[a, b], [a, b], [a, b + ' DISCREPANCY']] });
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.did({
      id: 'TCE111',
      title: 'TPC SIGNAL DIAGNOSTICS(2)',
      page: 74,
      f: [180, 75, 2232, 1535],
      tops: [103, 391, 668, 976],
      line2: '',
      orName: 'DISCREPANCY',
      g: [
        [N('CONTROL PRESSURE', 'VERY LOW TRIP'), 'B5', 'A', ['001', '004', '032'], ['003', '005', '007'], '031', 'TCE111_1', null, R],
        [N('BEARING OIL PRESS.', 'VERY LOW TRIP'), 'B6', 'B', ['008', '011', '033'], ['010', '012', '014'], '009', 'TCE111_3', ['TCE305'], R],
        [N('LP EXHAUST HOOD STEAM', 'TEMP. VERY HIGH TRIP'), 'B7', 'C', ['015', '018', '034'], ['017', '019', '021'], '016', 'TCE111_5', null, R],
        [N('TURBINE TRIP OIL PRESS.', 'VERY LOW TRIP'), 'B8', 'D', ['022', '025', '035'], ['024', '026', '030'], '023', 'TCE111_7', ['TCE053', 'TCE212'], R, { up: ['D1', ['TCA103']], en: 'D2' }]
      ],
      or: ['027', '028'],
      e: ['E', ['TCE471']],
      foot: [[247, 1512, 'CONTROLLER:'], [408, 1512, 'EHG+MD'], [670, 1485, 'TRIGGER  :'], [670, 1512, 'CYCLE(ms):30']]
    })
  );
})();
