/* TCE128 VALVE CONTROL DIAGNOSTICS(9) (331DM09784 page 93, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   sheets of two VALVE DIAGNOSIS blocks (tce/_lib.js, TCE_LIB.vd2); the places are those of TCE120 set straight.
   Position signals (1) and (2) of intercept valve A: LVDT A and B and servo amplifier A and B. The drawing prints no marks at POS.OT, ANN.EN
   and the outputs of this sheet; none are typed. The title block of this page prints PAGE 91; it is page 93 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.vd2({
      id: 'TCE128',
      title: 'VALVE CONTROL DIAGNOSTICS(9)',
      page: 93,
      v: 'ICV(A)',
      ann: 'ICV ANN ENABLE',
      dem: ['A', 'TCE214'],
      sim: ['C1', 'TCE501'],
      en: ['T', 'TCE053'],
      io: [
        ['TCE991-13', 'TCE991-17'],
        ['TCE992-1', 'TCE992-5']
      ],
      tct: ['TCT212', 'TCT212'],
      pos: ['TCE129', 'TCE451'],
      abn: ['TCE129', 'TCE451'],
      q: ['TCE451'],
      dev: '105.0',
      mk: {
        i: ['001', '003', '004', '005', '', ''],
        j: ['006', '008', '009', '010', '', ''],
        e: '011',
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
