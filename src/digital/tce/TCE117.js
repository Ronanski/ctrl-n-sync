/* TCE117 TPC SIGNAL DIAGNOSTICS(7) (331DM09784 page 81, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the digital
   input diagnostics sheets (tce/_lib.js, TCE_LIB.did); the places are those of the page set straight, as on TCE075.
   The master trip solenoid valve test: OPERATED A1 and A2 and the test push buttons of valves A1 and A2, each read from the three protection
   controllers, out to a lamp and to TCE115. The title block of this page prints PAGE 79; it is page 81 of the document. */
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
      id: 'TCE117',
      title: 'TPC SIGNAL DIAGNOSTICS(7)',
      page: 81,
      f: [180, 75, 2232, 1535],
      tops: [103, 391, 668, 976],
      line2: '',
      orName: 'DISCREPANCY',
      g: [
        [
          row(['OPERATED A1'], null, ['OPERATED A1 DISCREPANCY']),
          'C4',
          'A',
          ['001', '004', '032'],
          ['003', '005', '007'],
          '031',
          'TCE117_1',
          T,
          R
        ],
        [
          row(['OPERATED A2'], null, ['OPERATED A2 DISCREPANCY']),
          'C5',
          'B',
          ['008', '011', '033'],
          ['010', '012', '014'],
          '009',
          'TCE117_3',
          T,
          R
        ],
        [
          row(M('A1'), null, ME('A1')),
          'C2',
          'C',
          ['015', '018', '034'],
          ['017', '019', '021'],
          '016',
          'TCE117_5',
          T,
          R
        ],
        [row(M('A2'), null, ME('A2')), 'C3', 'D', ['022', '025', '035'], ['024', '026', '030'], '023', 'TCE117_7', T, R]
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
