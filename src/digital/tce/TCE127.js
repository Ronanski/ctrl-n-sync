/* TCE127 VALVE CONTROL DIAGNOSTICS(8) (331DM09784 page 92, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   second sheet of a valve (tce/_lib.js, TCE_LIB.vd3); the places are those of TCE121 set straight.
   Position signal (3) of control valve B, the choice out of the three position signals (TMR LVDT DIAGNOSIS), the test position, full close
   and full close (AUX) comparators and the abnormal signals. Connector C3 goes out and comes in again on this sheet; the drawing marks it (*). The title block of this page prints PAGE 90; it is page 92 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.vd3({
      id: 'TCE127',
      /* pr: printed on page 92 beside each block; the drawing above keeps them as text */
      pr: {
        c025: ['HL:11.0', 'LL:10.0'],
        c026: ['HL:7', 'LL:5'],
        c027: ['HL:7', 'LL:5']
      },
      title: 'VALVE CONTROL DIAGNOSTICS(8)',
      page: 92,
      v: 'CV(B)',
      ann: 'CV ANN ENABLE',
      en: 'S',
      dem: ['B', 'TCE212'],
      sim: ['A3', 'TCE502'],
      prev: 'TCE126',
      io: ['TCE991-4', 'TCE991-8'],
      tct: 'TCT211',
      cv: {
        j: ['TCP1220', 'TCP2220', 'TCP3220'],
        j1: 'TCE211',
        m: '028',
        f: ['TCE212'],
        g: ['TCA539', 'TCA690'],
        p: ['TCE212', 'TCE222', 'TCE450', 'TCE500', 'TCE502']
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
