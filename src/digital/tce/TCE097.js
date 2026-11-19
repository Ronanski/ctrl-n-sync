/* TCE097 DIGITAL INPUT SIGNAL DIAGNOSTICS(23) (331DM09784 page 64, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   digital input diagnostics sheets (tce/_lib.js, TCE_LIB.did); the places are those of the page set straight, as on TCE075.
   Four spare signals. As on TCE078, the input error of each block also has a lamp of the operator station. */
(function () {
  if (typeof window === 'undefined') return;
  const R = ['TCP1055', 'TCP2055', 'TCP3055'],
    S = ['(SPARE)'],
    E = ['INPUT ERROR'],
    N = { in: [S, S, S], out: [S, S, E, E] };
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.did({
      id: 'TCE097',
      title: 'DIGITAL INPUT SIGNAL DIAGNOSTICS(23)',
      page: 64,
      f: [180, 75, 2232, 1535],
      tops: [103, 391, 668, 976],
      line2: '',
      g: [
        [N, 'B9', 'A', ['001', '004', '032'], ['003', '005', '006', '007'], '031', 'TCE097_1', null, R, { el: 'TCE097_2' }],
        [N, 'B10', 'B', ['008', '011', '033'], ['010', '012', '013', '014'], '009', 'TCE097_3', null, R, { el: 'TCE097_4' }],
        [N, 'B11', 'C', ['015', '018', '034'], ['017', '019', '020', '021'], '016', 'TCE097_5', null, R, { el: 'TCE097_6' }],
        [N, 'B12', 'D', ['022', '025', '035'], ['024', '026', '029', '030'], '023', 'TCE097_7', null, R, { el: 'TCE097_8' }]
      ],
      or: ['027', '028'],
      e: ['E', ['TCE471']],
      foot: [[247, 1512, 'CONTROLLER:'], [408, 1512, 'EHG+MD'], [670, 1485, 'TRIGGER  :'], [670, 1512, 'CYCLE(ms):30']]
    })
  );
})();
