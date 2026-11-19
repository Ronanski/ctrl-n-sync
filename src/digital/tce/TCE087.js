/* TCE087 DIGITAL INPUT SIGNAL DIAGNOSTICS(13) (331DM09784 page 54, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   digital input diagnostics sheets (tce/_lib.js, TCE_LIB.did); the places are those of the page set straight, as on TCE075.
   Blowdown valve full close and full open position, and two spare signals. Each position also goes out by a double-line connector under its input error. */
(function () {
  if (typeof window === 'undefined') return;
  const R = ['TCP1053', 'TCP2053', 'TCP3053'],
    S = ['(SPARE)'],
    N = { in: [S, S, S], out: [S, S, ['INPUT ERROR']] },
    V = p => {
      const L = ['BLOWDOWN VALVE', 'FULL ' + p + ' POSITION'];
      return { in: [L, L, L], out: [L, L, [...L, 'INPUT ERROR']] };
    };
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.did({
      id: 'TCE087',
      title: 'DIGITAL INPUT SIGNAL DIAGNOSTICS(13)',
      page: 54,
      f: [180, 75, 2232, 1535],
      tops: [103, 391, 668, 976],
      line2: '',
      g: [
        [V('CLOSE'), 'B1', 'A', ['001', '004', '032'], ['003', '005', '007'], '031', 'TCE087_1', ['TCE365'], R, { third: ['A2', ['TCT081B']] }],
        [V('OPEN'), 'B2', 'B', ['008', '011', '033'], ['010', '012', '014'], '009', 'TCE087_3', ['TCE365'], R, { third: ['B2', ['TCT081B']] }],
        [N, 'B3', 'C', ['015', '018', '034'], ['017', '019', '021'], '016', 'TCE087_5', null, R],
        [N, 'B4', 'D', ['022', '025', '035'], ['024', '026', '030'], '023', 'TCE087_7', null, R]
      ],
      or: ['027', '028'],
      e: ['E', ['TCE471']],
      foot: [[247, 1512, 'CONTROLLER:'], [408, 1512, 'EHG+MD'], [670, 1485, 'TRIGGER  :'], [670, 1512, 'CYCLE(ms):30']]
    })
  );
})();
