/* TCE110 TPC SIGNAL DIAGNOSTICS(1) (331DM09784 page 73, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the digital
   input diagnostics sheets (tce/_lib.js, TCE_LIB.did); the places are those of the page set straight, as on TCE075.
   Trip signals of the turbine protection, each read from the three protection controllers: condenser vacuum very low (the drawing prints
   "CNDENSER"; typed as printed), main steam temperature very low, thrust bearing failure front and rear. The discrepancy of each also has a
   lamp of the operator station. The title block of this page prints PAGE 71; it is page 73 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  const R = ['TCP1120', 'TCP2120', 'TCP3120'],
    N = (a, b, e) => ({ in: [[a, b], [a, b], [a, b]], out: [[a, b], [a, b], [a, e], [a, e]] });
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.did({
      id: 'TCE110',
      title: 'TPC SIGNAL DIAGNOSTICS(1)',
      page: 73,
      f: [180, 75, 2232, 1535],
      tops: [103, 391, 668, 976],
      line2: '',
      orName: 'DISCREPANCY',
      g: [
        [N('CNDENSER VACUUM', 'VERY LOW TRIP', 'VERY LOW TRIP DISCREPANCY'), 'B1', 'A', ['001', '004', '032'], ['003', '005', '006', '007'], '031', 'TCE110_1', null, R, { el: 'TCE110_2' }],
        [N('MAIN STEAM TEMP.VERY', 'LOW TRIP', 'LOW TRIP DISCREPANCY'), 'B2', 'B', ['008', '011', '033'], ['010', '012', '013', '014'], '009', 'TCE110_3', null, R, { el: 'TCE110_4' }],
        [N('THRUST BRG. FAILURE', '(FRONT) TRIP', '(FRONT) DISCREPANCY'), 'B3', 'C', ['015', '018', '034'], ['017', '019', '020', '021'], '016', 'TCE110_5', null, R, { el: 'TCE110_6' }],
        [N('THRUST BRG. FAILURE', '(REAR)TRIP', '(REAR) DISCREPANCY'), 'B4', 'D', ['022', '025', '035'], ['024', '026', '029', '030'], '023', 'TCE110_7', null, R, { el: 'TCE110_8' }]
      ],
      or: ['027', '028'],
      e: ['E', ['TCE471']],
      foot: [[247, 1512, 'CONTROLLER:'], [408, 1512, 'EHG+MD'], [670, 1485, 'TRIGGER  :'], [670, 1512, 'CYCLE(ms):30']]
    })
  );
})();
