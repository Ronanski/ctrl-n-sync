/* TCE129 VALVE CONTROL DIAGNOSTICS(10) (331DM09784 page 94, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   second sheet of a valve (tce/_lib.js, TCE_LIB.vd3); the places are those of TCE121 set straight.
   Position signal (3) of intercept valve A, the choice out of the three position signals (TMR LVDT DIAGNOSIS), the full close comparator
   and the abnormal signals. Connector C3 goes out and comes in again on this sheet; the drawing marks it (*). The title block of this page prints PAGE 92; it is page 94 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.vd3({
      id: 'TCE129',
      /* pr: printed on page 94 beside each block; the drawing above keeps them as text */
      pr: {
        c020: ['HL:3', 'LL:2']
      },
      title: 'VALVE CONTROL DIAGNOSTICS(10)',
      page: 94,
      v: 'ICV(A)',
      ann: 'ICV ANN ENABLE',
      en: 'T',
      dem: ['A', 'TCE214'],
      sim: ['C1', 'TCE501'],
      prev: 'TCE128',
      io: ['TCE992-13', 'TCE992-17'],
      tct: 'TCT212',
      r450: 'TCE451',
      r218: 'TCE219',
      dev: '105.0',
      icv: { g: ['TCE350'], p: ['TCE227', 'TCE451', 'TCE500', 'TCE501'] },
      foot: [
        [233, 1520, 'CONTROLLER:'],
        [392, 1520, 'EHG+MD'],
        [622, 1493, 'TRIGGER  :'],
        [622, 1520, 'CYCLE(ms):30']
      ]
    })
  );
})();
