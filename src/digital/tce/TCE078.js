/* TCE078 DIGITAL INPUT SIGNAL DIAGNOSTICS(4) (331DM09784 page 45, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   digital input diagnostics sheets (tce/_lib.js, TCE_LIB.did); the places are those of the page set straight, as on TCE075.
   Three spare signals and P.S.NORMAL. On this sheet the input error of each block also has a lamp of the operator station. */
(function () {
  if (typeof window === 'undefined') return;
  const S = ['(SPARE)'],
    E = ['INPUT ERROR'],
    N = { in: [S, S, S], out: [S, S, E, E] },
    P = ['P.S.NORMAL'],
    PE = ['P.S.NORMAL', 'INPUT ERROR'];
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.did({
      id: 'TCE078',
      title: 'DIGITAL INPUT SIGNAL DIAGNOSTICS(4)',
      page: 45,
      f: [180, 75, 2232, 1535],
      tops: [103, 391, 668, 976],
      line2: '',
      g: [
        [N, 'B13', 'A', ['001', '004', '032'], ['003', '005', '006', '007'], '031', 'TCE078_1', null, null, { el: 'TCE078_2' }],
        [N, 'B14', 'B', ['008', '011', '033'], ['010', '012', '013', '014'], '009', 'TCE078_3', null, null, { el: 'TCE078_4' }],
        [N, 'B15', 'C', ['015', '018', '034'], ['017', '019', '020', '021'], '016', 'TCE078_5', null, null, { el: 'TCE078_6' }],
        [{ in: [P, P, P], out: [P, P, PE, PE] }, 'B16', 'D', ['022', '025', '035'], ['024', '026', '029', '030'], '023', 'TCE078_7', null, null, { el: 'TCE078_8' }]
      ],
      or: ['027', '028'],
      e: ['E', ['TCE471']],
      foot: [[247, 1512, 'CONTROLLER:'], [408, 1512, 'EHG+MD'], [670, 1485, 'TRIGGER  :'], [670, 1512, 'CYCLE(ms):30']]
    })
  );
})();
