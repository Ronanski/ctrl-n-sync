/* TCE085 DIGITAL INPUT SIGNAL DIAGNOSTICS(11) (331DM09784 page 52, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   digital input diagnostics sheets (tce/_lib.js, TCE_LIB.did); the places are those of the page set straight, as on TCE075.
   Four spare signals. The first is read from sheets TCP1055, TCP2055 and TCP3055, the others from TCP1052, TCP2052 and TCP3052. */
(function () {
  if (typeof window === 'undefined') return;
  const R = ['TCP1052', 'TCP2052', 'TCP3052'],
    S = ['(SPARE)'],
    N = { in: [S, S, S], out: [S, S, ['INPUT ERROR']] };
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.did({
      id: 'TCE085',
      title: 'DIGITAL INPUT SIGNAL DIAGNOSTICS(11)',
      page: 52,
      f: [180, 75, 2232, 1535],
      tops: [103, 391, 668, 976],
      line2: '',
      g: [
        [N, 'B4', 'A', ['001', '004', '032'], ['003', '005', '007'], '031', 'TCE085_1', null, ['TCP1055', 'TCP2055', 'TCP3055']],
        [N, 'B10', 'B', ['008', '011', '033'], ['010', '012', '014'], '009', 'TCE085_3', null, R],
        [N, 'B11', 'C', ['015', '018', '034'], ['017', '019', '021'], '016', 'TCE085_5', null, R],
        [N, 'B12', 'D', ['022', '025', '035'], ['024', '026', '030'], '023', 'TCE085_7', null, R]
      ],
      or: ['027', '028'],
      e: ['E', ['TCE471']],
      foot: [[247, 1512, 'CONTROLLER:'], [408, 1512, 'EHG+MD'], [670, 1485, 'TRIGGER  :'], [670, 1512, 'CYCLE(ms):30']]
    })
  );
})();
