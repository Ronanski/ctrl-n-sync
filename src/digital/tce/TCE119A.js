/* TCE119A TPC SIGNAL DIAGNOSTICS(10) (331DM09784 page 84, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the digital
   input diagnostics sheets (tce/_lib.js, TCE_LIB.did); the places are those of the page set straight, as on TCE075.
   The shaft vibration very high trips (No.1 and No.2 turbine, No.3 and No.4 generator), each read from the three protection controllers.
   The title block of this page prints PAGE 82; it is page 84 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  const N = (n, m) => ['NO.' + n + ' ' + m + ' SHAFT', 'VIBRATION VERY HIGH TRIP'],
    row = (n, m) => ({ in: [N(n, m), N(n, m), N(n, m)], out: [N(n, m), N(n, m), [...N(n, m), 'DISCREPANCY']] }),
    R = ['TCP1105', 'TCP2105', 'TCP3105'];
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.did({
      id: 'TCE119A',
      title: 'TPC SIGNAL DIAGNOSTICS(10)',
      page: 84,
      f: [180, 75, 2232, 1535],
      tops: [103, 391, 668, 976],
      line2: '',
      orName: 'DISCREPANCY',
      g: [
        [row(1, 'TURBINE'), 'A2', 'A', ['001', '004', '032'], ['003', '005', '007'], '031', 'TCE119A_1', null, R],
        [row(2, 'TURBINE'), 'B2', 'B', ['008', '011', '033'], ['010', '012', '014'], '009', 'TCE119A_3', null, R],
        [row(3, 'GENERATOR'), 'C2', 'C', ['015', '018', '034'], ['017', '019', '021'], '016', 'TCE119A_5', null, R],
        [row(4, 'GENERATOR'), 'D2', 'D', ['022', '025', '035'], ['024', '026', '030'], '023', 'TCE119A_7', null, R]
      ],
      or: ['027', '028'],
      e: ['E', ['-']],
      foot: [
        [247, 1512, 'CONTROLLER:'],
        [408, 1512, 'EHG+MD'],
        [670, 1485, 'TRIGGER  :'],
        [670, 1512, 'CYCLE(ms):30']
      ]
    })
  );
})();
