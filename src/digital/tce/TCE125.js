/* TCE125 VALVE CONTROL DIAGNOSTICS(6) (331DM09784 page 90, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   second sheet of a valve (tce/_lib.js, TCE_LIB.vd3); the places are those of TCE121 set straight.
   Position signal (3) of control valve A, the choice out of the three position signals (TMR LVDT DIAGNOSIS), the test position, full close
   and full close (AUX) comparators and the abnormal signals. Connector C3 goes out and comes in again on this sheet; the drawing marks it (*). The title block of this page prints PAGE 88; it is page 90 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.vd3({
      id: 'TCE125',
      title: 'VALVE CONTROL DIAGNOSTICS(6)',
      page: 90,
      v: 'CV(A)',
      ann: 'CV ANN ENABLE',
      en: 'S',
      dem: ['A', 'TCE212'],
      sim: ['A1', 'TCE502'],
      prev: 'TCE124',
      io: ['TCE991-3', 'TCE991-7'],
      tct: 'TCT211',
      cv: {
        j: ['TCP1220', 'TCP2220', 'TCP3220'],
        j1: 'TCE210',
        j1u: 1,
        g: ['TCA539', 'TCA690'],
        p: ['TCE222', 'TCE450', 'TCE500', 'TCE502']
      },
      foot: [
        [233, 1520, 'CONTROLLER:'],
        [392, 1520, 'EHG+MD'],
        [622, 1493, 'TRIGGER  :'],
        [622, 1520, 'CYCLE(ms):30']
      ]
    })
  );
})();
