/* TCE141 TURBINE SPEED DIAGNOSTICS(2) (331DM09784 page 102, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   sheets of a pulse input card (tce/_lib.js, TCE_LIB.pti); units = the pixels of the page rendered 2296 wide, the places those of TCE140 set
   straight (the scans are turned a little), the three signals at one distance.
   The second pulse input card: the three speed signals come in from TCE140 on connectors 1, 3 and 5. The title block of this page prints PAGE 100; it is page 102 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  const N = ['-'],
    T = ['TCE143'],
    NN = [N, N, N, N];
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.pti({
      id: 'TCE141',
      title: 'TURBINE SPEED DIAGNOSTICS(2)',
      page: 102,
      n: 2,
      io: [9, 13],
      src: [
        ['1', 'TCE140'],
        ['3', 'TCE140'],
        ['5', 'TCE140']
      ],
      refs: [NN, [T, T, T, ['TCE143', 'TCE144']], NN],
      foot: [
        [233, 1522, 'CONTROLLER:'],
        [392, 1522, 'EHG+MD'],
        [591, 1495, 'TRIGGER  :'],
        [591, 1522, 'CYCLE(ms):30']
      ]
    })
  );
})();
