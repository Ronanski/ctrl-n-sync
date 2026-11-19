/* TCE134 POSITION DIAGNOSTICS(3) (331DM09784 page 99, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   sheets of two VALVE DIAGNOSIS blocks (tce/_lib.js, TCE_LIB.vd2, form rsv); the places are those of TCE120 set straight.
   Position signals (1) and (2) of reheat stop valve B: LVDT A and B. The valve has no servo amplifier: 0.0 goes to AMP, DEMAND and POS.OT of both
   blocks. The annunciator enable is a reference of TCE053. The title block of this page prints PAGE 97; it is page 99 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.vd2({
      id: 'TCE134',
      title: 'POSITION DIAGNOSTICS(3)',
      page: 99,
      v: 'RSV(B)',
      rsv: 1,
      ann: 'ANN ENABLE',
      en: 'TCE053',
      sim: ['E2', 'TCE501'],
      io: [['TCE991-16'], ['TCE992-4']],
      tct: ['TCT212', 'TCT212'],
      pos: ['TCE135', 'TCE451'],
      abn: ['TCE135', 'TCE451'],
      d: ['TCE135'],
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
