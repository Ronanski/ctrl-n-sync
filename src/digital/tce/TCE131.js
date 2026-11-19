/* TCE131 VALVE CONTROL DIAGNOSTICS(12) (331DM09784 page 96, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   second sheet of a valve (tce/_lib.js, TCE_LIB.vd3); the places are those of TCE121 set straight.
   Position signal (3) of intercept valve B, the choice out of the three position signals (TMR LVDT DIAGNOSIS), the full close comparator
   and the abnormal signals. Connector C3 goes out and comes in again on this sheet; the drawing marks it (*). The SG block is
   numbered 014 on this sheet (A014 on TCE129); typed as printed. The title block of this page prints PAGE 94; it is page 96 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.vd3({
      id: 'TCE131',
      title: 'VALVE CONTROL DIAGNOSTICS(12)',
      page: 96,
      v: 'ICV(B)',
      ann: 'ICV ANN ENABLE',
      en: 'T',
      dem: ['B', 'TCE214'],
      sim: ['D1', 'TCE501'],
      prev: 'TCE130',
      io: ['TCE992-14', 'TCE992-18'],
      tct: 'TCT212',
      r450: 'TCE451',
      r218: 'TCE219',
      dev: '105.0',
      icv: { g: ['TCE350'], p: ['TCE228', 'TCE451', 'TCE500', 'TCE501'], sg: '014' },
      foot: [
        [233, 1520, 'CONTROLLER:'],
        [392, 1520, 'EHG+MD'],
        [622, 1493, 'TRIGGER  :'],
        [622, 1520, 'CYCLE(ms):30']
      ]
    })
  );
})();
