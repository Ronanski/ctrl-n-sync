/* TCE132 POSITION DIAGNOSTICS(1) (331DM09784 page 97, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   sheets of two VALVE DIAGNOSIS blocks (tce/_lib.js, TCE_LIB.vd2, form rsv); the places are those of TCE120 set straight.
   Position signals (1) and (2) of reheat stop valve A: LVDT A and B. The valve has no servo amplifier: 0.0 goes to AMP, DEMAND and POS.OT of both
   blocks. The annunciator enable is a reference of TCE053. The title block of this page prints PAGE 95; it is page 97 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.vd2({
      id: 'TCE132',
      title: 'POSITION DIAGNOSTICS(1)',
      page: 97,
      v: 'RSV(A)',
      rsv: 1,
      ann: 'ANN ENABLE',
      en: 'TCE053',
      sim: ['E1', 'TCE501'],
      io: [['TCE991-15'], ['TCE992-3']],
      tct: ['TCT211', 'TCT211'],
      pos: ['TCE133', 'TCE451'],
      abn: ['TCE133', 'TCE451'],
      d: ['TCE133'],
      q: ['TCE451'],
      nos: ['A002', 'A006'],
      dev: '200.0',
      mk: {
        i: ['001', '', '003', '004', '', ''],
        j: ['005', '', '007', '008', '', ''],
        e: '009',
        o: ['', '', ''],
        p: ['', '', '']
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
