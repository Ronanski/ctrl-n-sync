/* TCE133 POSITION DIAGNOSTICS(2) (331DM09784 page 98, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   second sheet of a valve (tce/_lib.js, TCE_LIB.vd3, form rsv); the places are those of TCE121 set straight.
   Position signal (3) of reheat stop valve A, the choice out of the three position signals (TMR LVDT DIAGNOSIS), the full open comparator
   and the abnormal signals. The abnormal signals (1) and (2) come in from TCE132 on connectors D1 and D2; the third is ABN.O of this sheet.
   Connector C3 goes out and comes in again on this sheet; the drawing marks it (*). The INITIAL line runs through the list of parameters of the
   VALVE DIAGNOSIS block, as on the drawing. The title block of this page prints PAGE 96; it is page 98 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.vd3({
      id: 'TCE133',
      /* pr: printed on page 98 beside each block; the drawing above keeps them as text */
      pr: {
        c018: ['HL:98', 'LL:97']
      },
      title: 'POSITION DIAGNOSTICS(2)',
      page: 98,
      v: 'RSV(A)',
      ann: 'ANN ENABLE',
      en: 'TCE053',
      sim: ['E1', 'TCE501'],
      prev: 'TCE132',
      io: ['TCE992-15'],
      tct: 'TCT212',
      r450: 'TCE451',
      r218: '-',
      dev: '200.0',
      rsv: { g: ['TCA533'], p: ['TCE226', 'TCE451'] },
      foot: [
        [233, 1520, 'CONTROLLER:'],
        [392, 1520, 'EHG+MD'],
        [622, 1493, 'TRIGGER  :'],
        [622, 1520, 'CYCLE(ms):30']
      ]
    })
  );
})();
