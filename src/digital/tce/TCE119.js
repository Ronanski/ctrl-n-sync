/* TCE119 TPC SIGNAL DIAGNOSTICS(9) (331DM09784 page 83, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the digital
   input diagnostics sheets (tce/_lib.js, TCE_LIB.did); the places are those of the page set straight, as on TCE075.
   The test push button of master trip solenoid valve B2 and CRT OPE. PERM. (out to a lamp and to TCE115), BOILER MFT 1AND 2 NOT SYN. and the
   turbine manual trip push button of the CCR, each read from the three protection controllers. "1AND 2" is typed as the drawing prints it. The title block of this page prints PAGE 81; it is page 83 of the document. */
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
      id: 'TCE119',
      title: 'TPC SIGNAL DIAGNOSTICS(9)',
      page: 83,
      f: [180, 75, 2232, 1535],
      tops: [103, 391, 668, 976],
      line2: '',
      orName: 'DISCREPANCY',
      g: [
        [
          row(M('B2'), null, ME('B2')),
          'C8',
          'A',
          ['001', '004', '032'],
          ['003', '005', '007'],
          '031',
          'TCE119_1',
          T,
          R
        ],
        [
          row(['CRT OPE. PERM.'], null, ['CRT OPE. PERM. DISCREPANCY']),
          'C6',
          'B',
          ['008', '011', '033'],
          ['010', '012', '014'],
          '009',
          'TCE119_3',
          T,
          R
        ],
        [
          row(['BOILER MFT 1AND 2 NOT SYN.'], null, D),
          'B',
          'C',
          ['015', '018', '034'],
          ['017', '019', '021'],
          '016',
          'TCE119_5',
          null,
          ['TCP1503', 'TCP2503', 'TCP3503']
        ],
        [
          row(['TURBINE MANUAL TRIP PB (CCR)'], null, D),
          'E3',
          'D',
          ['022', '025', '035'],
          ['024', '026', '030'],
          '023',
          'TCE119_7',
          null,
          ['TCP1121', 'TCP2121', 'TCP3121']
        ]
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
