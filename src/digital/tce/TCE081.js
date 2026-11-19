/* TCE081 DIGITAL INPUT SIGNAL DIAGNOSTICS(7) (331DM09784 page 48, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   digital input diagnostics sheets (tce/_lib.js, TCE_LIB.did); the places are those of the page set straight, as on TCE075.
   Four spare signals. */
(function () {
  if (typeof window === 'undefined') return;
  const R = ['TCP1051', 'TCP2051', 'TCP3051'],
    S = ['(SPARE)'],
    N = { in: [S, S, S], out: [S, S, ['INPUT ERROR']] };
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.did({
      id: 'TCE081',
      title: 'DIGITAL INPUT SIGNAL DIAGNOSTICS(7)',
      page: 48,
      f: [180, 75, 2232, 1535],
      tops: [103, 391, 668, 976],
      line2: '',
      g: [
        [N, 'B9', 'A', ['001', '004', '032'], ['003', '005', '007'], '031', 'TCE081_1', null, R],
        [N, 'B10', 'B', ['008', '011', '033'], ['010', '012', '014'], '009', 'TCE081_3', null, R],
        [N, 'B11', 'C', ['015', '018', '034'], ['017', '019', '021'], '016', 'TCE081_5', null, R],
        [N, 'B12', 'D', ['022', '025', '035'], ['024', '026', '030'], '023', 'TCE081_7', null, R]
      ],
      or: ['027', '028'],
      e: ['E', ['TCE471']],
      foot: [[247, 1512, 'CONTROLLER:'], [408, 1512, 'EHG+MD'], [670, 1485, 'TRIGGER  :'], [670, 1512, 'CYCLE(ms):30']]
    })
  );
})();
