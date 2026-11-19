/* TCE077 DIGITAL INPUT SIGNAL DIAGNOSTICS(3) (331DM09784 page 44, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   digital input diagnostics sheets (tce/_lib.js, TCE_LIB.did); the places are those of the page set straight, as on TCE075.
   Four spare signals. The first is read from sheets TCP1055, TCP2055 and TCP3055, the others from TCP1050, TCP2050 and TCP3050. */
(function () {
  if (typeof window === 'undefined') return;
  const S = ['(SPARE)'],
    N = { in: [S, S, S], out: [S, S, ['INPUT ERROR']] };
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.did({
      id: 'TCE077',
      title: 'DIGITAL INPUT SIGNAL DIAGNOSTICS(3)',
      page: 44,
      f: [180, 75, 2232, 1535],
      tops: [103, 391, 668, 976],
      line2: '',
      g: [
        [N, 'B3', 'A', ['001', '004', '032'], ['003', '005', '007'], '031', 'TCE077_1', null, ['TCP1055', 'TCP2055', 'TCP3055']],
        [N, 'B10', 'B', ['008', '011', '033'], ['010', '012', '014'], '009', 'TCE077_3'],
        [N, 'B11', 'C', ['015', '018', '034'], ['017', '019', '021'], '016', 'TCE077_5'],
        [N, 'B12', 'D', ['022', '025', '035'], ['024', '026', '030'], '023', 'TCE077_7']
      ],
      or: ['027', '028'],
      e: ['E', ['TCE471']],
      foot: [[247, 1512, 'CONTROLLER:'], [408, 1512, 'EHG+MD'], [670, 1485, 'TRIGGER  :'], [670, 1512, 'CYCLE(ms):30']]
    })
  );
})();
