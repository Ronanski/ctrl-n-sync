/* TCE113 TPC SIGNAL DIAGNOSTICS(4) (331DM09784 page 76, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the digital
   input diagnostics sheets (tce/_lib.js, TCE_LIB.did); the places are those of the page set straight, as on TCE075.
   Generator / unit transformer protection and generator lockout relay operated, turbine shut-down command, turbine manual trip push button of
   the TCS HMI, and turbine manual trip. The discrepancy of each also has a lamp of the operator station. The names are typed as the drawing
   prints them: the outputs of the third block read "TURBINE MANUALTRIP PB (TCS HMI)" on one line and their discrepancy only "DISCREPANCY";
   the discrepancy lamp of the fourth block reads "DISCREPANCY", its connector "TURBINE MANUAL TRIP DISCREPANCY". The title block of this page
   prints PAGE 74; it is page 76 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  const R0 = ['TCP1120', 'TCP2120', 'TCP3120'],
    R1 = ['TCP1121', 'TCP2121', 'TCP3121'],
    G = ['GEN./UNIT TRANS.PROTECTION', '& GEN.LOCKOUT RELAY', 'OPERATED'],
    GE = ['GEN./UNIT TRANS.PROTECTION', '& GEN.LOCKOUT RELAY DISCREPANCY'],
    S = ['TURBINE SHUT-DOWN', 'COMMAND'],
    SE = ['TURBINE SHUT-DOWN', 'COMMAND DISCREPANCY'],
    P = ['TURBINE MANUAL', 'TRIP PB (TCS HMI)'],
    PO = ['TURBINE MANUALTRIP PB (TCS HMI)'],
    T = ['TURBINE MANUAL TRIP'],
    D = ['DISCREPANCY'];
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.did({
      id: 'TCE113',
      title: 'TPC SIGNAL DIAGNOSTICS(4)',
      page: 76,
      f: [180, 75, 2232, 1535],
      tops: [103, 391, 668, 976],
      line2: '',
      orName: 'DISCREPANCY',
      g: [
        [{ in: [G, G, G], out: [G, G, GE, GE] }, 'B13', 'A', ['001', '004', '032'], ['003', '005', '006', '007'], '031', 'TCE113_1', ['TCA533'], R0, { el: 'TCE113_2', dbl: 2 }],
        [{ in: [S, S, S], out: [S, S, SE, SE] }, 'B14', 'B', ['008', '011', '033'], ['010', '012', '013', '014'], '009', 'TCE113_3', null, R0, { el: 'TCE113_4' }],
        [{ in: [P, P, P], out: [PO, PO, D, D] }, 'F2', 'C', ['015', '018', '034'], ['017', '019', '020', '021'], '016', 'TCE113_5', null, R1, { el: 'TCE113_6' }],
        [{ in: [T, T, T], out: [T, T, D, [...T, 'DISCREPANCY']] }, 'D1', 'D', ['022', '025', '035'], ['024', '026', '029', '030'], '023', 'TCE113_7', null, R1, { el: 'TCE113_8' }]
      ],
      or: ['027', '028'],
      e: ['E', ['TCE471']],
      foot: [[247, 1512, 'CONTROLLER:'], [408, 1512, 'EHG+MD'], [670, 1485, 'TRIGGER  :'], [670, 1512, 'CYCLE(ms):30']]
    })
  );
})();
