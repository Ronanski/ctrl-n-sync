/* TCE118 TPC SIGNAL DIAGNOSTICS(8) (331DM09784 page 82, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the digital
   input diagnostics sheets (tce/_lib.js, TCE_LIB.did); the places are those of the page set straight, as on TCE075.
   The master trip solenoid valve test: CRT OPE. PERM., OPERATED B1 and B2 and the test push button of valve B1, each read from the three
   protection controllers, out to a lamp and to TCE115. The title block of this page prints PAGE 80; it is page 82 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  const M = v => ['MASTER TRIP SOLENOID', 'VALVE(' + v + ') TEST PB'],
    ME = v => [...M(v), 'DISCREPANCY'],
    D = ['DISCREPANCY'],
    T = ['TCE115'],
    R = ['TCP1200', 'TCP2200', 'TCP3200'],
    row = (i, o, e) => ({ in: [i, i, i], out: [o || i, o || i, e] });
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.did({
      id: 'TCE118',
      title: 'TPC SIGNAL DIAGNOSTICS(8)',
      page: 82,
      f: [180, 75, 2232, 1535],
      tops: [103, 391, 668, 976],
      line2: '',
      orName: 'DISCREPANCY',
      g: [
        [
          row(['CRT OPE. PERM.'], null, ['CRT OPE. PERM. DISCREPANCY']),
          'C1',
          'A',
          ['001', '004', '032'],
          ['003', '005', '007'],
          '031',
          'TCE118_1',
          T,
          R
        ],
        [
          row(['OPERATED B1'], null, ['OPERATED B1 DISCREPANCY']),
          'C9',
          'B',
          ['008', '011', '033'],
          ['010', '012', '014'],
          '009',
          'TCE118_3',
          T,
          R
        ],
        [
          row(['OPERATED B2'], null, ['OPERATED B2', 'DISCREPANCY']),
          'C10',
          'C',
          ['015', '018', '034'],
          ['017', '019', '021'],
          '016',
          'TCE118_5',
          T,
          R
        ],
        [row(M('B1'), null, ME('B1')), 'C7', 'D', ['022', '025', '035'], ['024', '026', '030'], '023', 'TCE118_7', T, R]
      ],
      or: ['027', '028'],
      e: ['E', ['-']],
      foot: [
        [247, 1512, 'CONTROLLER:'],
        [408, 1512, 'EHG+MD'],
        [670, 1485, 'TRIGGER  :'],
        [670, 1512, 'CYCLE(ms):30']
      ]
    })
  );
})();
