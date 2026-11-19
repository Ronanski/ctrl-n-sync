/* TCE090 DIGITAL INPUT SIGNAL DIAGNOSTICS(16) (331DM09784 page 57, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   digital input diagnostics sheets (tce/_lib.js, TCE_LIB.did); the places are those of the page set straight, as on TCE075.
   A spare signal, the trip position of master trip solenoids A2 and B2, and P.S.NORMAL. */
(function () {
  if (typeof window === 'undefined') return;
  const R = ['TCP1053', 'TCP2053', 'TCP3053'],
    S = ['(SPARE)'],
    N = { in: [S, S, S], out: [S, S, ['INPUT ERROR']] },
    T = s => {
      const L = ['MASTER TRIP SOLENOID(' + s + ')', 'TRIP POSITION'];
      return { in: [L, L, L], out: [L, L, [...L, 'INPUT ERROR']] };
    },
    P = ['P.S.NORMAL'];
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.did({
      id: 'TCE090',
      title: 'DIGITAL INPUT SIGNAL DIAGNOSTICS(16)',
      page: 57,
      f: [180, 75, 2232, 1535],
      tops: [103, 391, 668, 976],
      line2: '',
      g: [
        [N, 'B13', 'A', ['001', '004', '032'], ['003', '005', '007'], '031', 'TCE090_1', null, R],
        [T('A2'), 'B14', 'B', ['008', '011', '033'], ['010', '012', '014'], '009', 'TCE090_3', ['TCT081'], R, { dbl: 1 }],
        [T('B2'), 'B15', 'C', ['015', '018', '034'], ['017', '019', '021'], '016', 'TCE090_5', ['TCT081A'], R, { dbl: 1 }],
        [{ in: [P, P, P], out: [P, P, [...P, 'INPUT ERROR']] }, 'B16', 'D', ['022', '025', '035'], ['024', '026', '030'], '023', 'TCE090_7', null, R]
      ],
      or: ['027', '028'],
      e: ['E', ['TCE471']],
      foot: [[247, 1512, 'CONTROLLER:'], [408, 1512, 'EHG+MD'], [670, 1485, 'TRIGGER  :'], [670, 1512, 'CYCLE(ms):30']]
    })
  );
})();
