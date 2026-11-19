/* TCE123 VALVE CONTROL DIAGNOSTICS(4) (331DM09784 page 88, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   second sheet of a valve (tce/_lib.js, TCE_LIB.vd3); the places are those of TCE121 set straight.
   Position signal (3) of main stop valve B, the choice out of the three position signals (TMR LVDT DIAGNOSIS), the test position, full
   close and full open comparators and the abnormal signals. Connector C3 goes out and comes in again on this sheet; the drawing marks it (*). The title block of this page prints PAGE 86; it is
   page 88 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.vd3({
      id: 'TCE123',
      title: 'VALVE CONTROL DIAGNOSTICS(4)',
      page: 88,
      v: 'MSV(B)',
      ann: 'MSV ANN ENABLE',
      dem: ['A', 'TCE211'],
      sim: ['B1', 'TCE501'],
      prev: 'TCE122',
      io: ['TCE991-2', 'TCE991-6'],
      tct: 'TCT211',
      fo: 'TCE154',
      foot: [
        [233, 1520, 'CONTROLLER:'],
        [392, 1520, 'EHG+MD'],
        [622, 1493, 'TRIGGER  :'],
        [622, 1520, 'CYCLE(ms):30']
      ]
    })
  );
})();
