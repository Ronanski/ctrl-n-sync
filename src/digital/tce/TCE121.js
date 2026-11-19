/* TCE121 VALVE CONTROL DIAGNOSTICS(2) (331DM09784 page 86, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   second sheet of a valve (tce/_lib.js, TCE_LIB.vd3); the places are those of TCE121 set straight.
   Position signal (3) of main stop valve A, the choice out of the three position signals (TMR LVDT DIAGNOSIS), the test position, full
   close and full open comparators and the abnormal signals. Connector C3 goes out and comes in again on this sheet; the drawing marks it (*). The title block of this page prints PAGE 84; it is
   page 86 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.vd3({
      id: 'TCE121',
      title: 'VALVE CONTROL DIAGNOSTICS(2)',
      page: 86,
      v: 'MSV(A)',
      ann: 'MSV ANN ENABLE',
      dem: ['A', 'TCE210'],
      sim: ['A1', 'TCE501'],
      prev: 'TCE120',
      io: ['TCE991-1', 'TCE991-5'],
      tct: 'TCT210',
      fo: 'TCE153',
      foot: [
        [233, 1520, 'CONTROLLER:'],
        [392, 1520, 'EHG+MD'],
        [622, 1493, 'TRIGGER  :'],
        [622, 1520, 'CYCLE(ms):30']
      ]
    })
  );
})();
