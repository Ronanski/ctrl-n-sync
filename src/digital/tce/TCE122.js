/* TCE122 VALVE CONTROL DIAGNOSTICS(3) (331DM09784 page 87, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   sheets of two VALVE DIAGNOSIS blocks (tce/_lib.js, TCE_LIB.vd2); the places are those of TCE120 set straight.
   Position signals (1) and (2) of main stop valve B: LVDT A and B and servo amplifier A and B. The drawing prints no marks at POS.OT, ANN.EN
   and the outputs of this sheet; none are typed. The title block of this page prints PAGE 85; it is page 87 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.vd2({
      id: 'TCE122',
      title: 'VALVE CONTROL DIAGNOSTICS(3)',
      page: 87,
      v: 'MSV(B)',
      ann: 'MSV ANN ENABLE',
      dem: ['A', 'TCE211'],
      sim: ['B1', 'TCE501'],
      en: ['R', 'TCE053'],
      io: [
        ['TCE990-2', 'TCE990-6'],
        ['TCE990-14', 'TCE990-18']
      ],
      tct: ['TCT210', 'TCT211'],
      pos: ['TCE123', 'TCE450'],
      abn: ['TCE123', 'TCE450'],
      q: ['TCE450'],
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
