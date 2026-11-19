/* TCE079 DIGITAL INPUT SIGNAL DIAGNOSTICS(5) (331DM09784 page 46, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   digital input diagnostics sheets (tce/_lib.js, TCE_LIB.did); the places are those of the page set straight, as on TCE075.
   Ventilator valve full close and full open position, and two spare signals. The two positions have no lamp here: each goes out by two connectors. */
(function () {
  if (typeof window === 'undefined') return;
  const R = ['TCP1051', 'TCP2051', 'TCP3051'],
    S = ['(SPARE)'],
    N = { in: [S, S, S], out: [S, S, ['INPUT ERROR']] },
    V = p => {
      const L = ['VENTILATOR VALVE', 'FULL ' + p + ' POSITION'];
      return { in: [L, L, L], out: [L, L, [...L, 'INPUT ERROR']] };
    };
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.did({
      id: 'TCE079',
      title: 'DIGITAL INPUT SIGNAL DIAGNOSTICS(5)',
      page: 46,
      f: [180, 75, 2232, 1535],
      tops: [103, 391, 668, 976],
      line2: '',
      g: [
        [V('CLOSE'), 'B1', 'A', ['001', '004', '032'], ['005', '', '007'], '031', '', ['TCE360'], R, { two: ['A2', ['TCT081A']] }],
        [V('OPEN'), 'B2', 'B', ['008', '011', '033'], ['012', '', '014'], '009', '', ['TCE360'], R, { two: ['B2', ['TCT081A']] }],
        [N, 'B3', 'C', ['015', '018', '034'], ['017', '019', '021'], '016', 'TCE079_5', null, R, { ey: 64 }],
        [N, 'B4', 'D', ['022', '025', '035'], ['024', '026', '030'], '023', 'TCE079_7', null, R]
      ],
      or: ['027', '028'],
      e: ['E', ['TCE471']],
      foot: [[247, 1512, 'CONTROLLER:'], [408, 1512, 'EHG+MD'], [670, 1485, 'TRIGGER  :'], [670, 1512, 'CYCLE(ms):30']]
    })
  );
})();
