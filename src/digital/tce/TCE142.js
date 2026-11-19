/* TCE142 TURBINE SPEED DIAGNOSTICS(3) (331DM09784 page 103, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   sheets of a pulse input card (tce/_lib.js, TCE_LIB.pti); units = the pixels of the page rendered 2296 wide, the places those of TCE140 set
   straight (the scans are turned a little), the three signals at one distance.
   The third pulse input card: the three speed signals come in from TCE140 on connectors 2, 4 and 6. The title block of this page prints PAGE 101; it is page 103 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  const N = ['-'],
    T = ['TCE143'],
    NN = [N, N, N, N];
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.pti({
      id: 'TCE142',
      title: 'TURBINE SPEED DIAGNOSTICS(3)',
      page: 103,
      n: 3,
      io: [17, 21],
      src: [
        ['2', 'TCE140'],
        ['4', 'TCE140'],
        ['6', 'TCE140']
      ],
      refs: [NN, NN, [T, T, T, T]],
      foot: [
        [233, 1522, 'CONTROLLER:'],
        [392, 1522, 'EHG+MD'],
        [591, 1495, 'TRIGGER  :'],
        [591, 1522, 'CYCLE(ms):30']
      ]
    })
  );
})();
