/* TCE140 TURBINE SPEED DIAGNOSTICS(1) (331DM09784 page 101, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   sheets of a pulse input card (tce/_lib.js, TCE_LIB.pti); units = the pixels of the page rendered 2296 wide, the places those of TCE140 set
   straight (the scans are turned a little), the three signals at one distance.
   The three turbine speed pickups (SE-STn001-1, -2, -3) on the first pulse input card (PTI): each pickup goes to the card and, through its
   buffers, to TCE141 and TCE142 (the last buffer is left open). From the card come the speed and the low counter (each through a gain block),
   the H-valid flag and the PI/O error; the first pickup also gives the L-timing, the trigger of the logic. The title block of this page prints PAGE 99; it is page 101 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  const N = ['-'],
    T = ['TCE143'],
    NN = [N, N, N, N];
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.pti({
      id: 'TCE140',
      title: 'TURBINE SPEED DIAGNOSTICS(1)',
      page: 101,
      n: 1,
      io: [1, 5],
      refs: [[T, T, T, ['TCE143', 'TCE144']], NN, NN],
      foot: [
        [233, 1522, 'CONTROLLER:'],
        [392, 1522, 'EHG+MD'],
        [591, 1495, 'TRIGGER  :'],
        [591, 1522, 'CYCLE(ms):30']
      ]
    })
  );
})();
