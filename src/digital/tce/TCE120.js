/* TCE120 VALVE CONTROL DIAGNOSTICS(1) (331DM09784 page 85, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   sheets of two VALVE DIAGNOSIS blocks (tce/_lib.js, TCE_LIB.vd2); the places are those of TCE120 set straight.
   Position signals (1) and (2) of main stop valve A: LVDT A and B and servo amplifier A and B. The title block of this page prints PAGE 83; it is page 85 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.vd2({
      id: 'TCE120',
      title: 'VALVE CONTROL DIAGNOSTICS(1)',
      page: 85,
      v: 'MSV(A)',
      ann: 'MSV ANN ENABLE',
      dem: ['A', 'TCE210'],
      sim: ['A1', 'TCE501'],
      en: ['R', 'TCE053'],
      io: [
        ['TCE990-1', 'TCE990-5'],
        ['TCE990-13', 'TCE990-17']
      ],
      tct: ['TCT210', 'TCT210'],
      pos: ['TCE121', 'TCE450'],
      abn: ['TCE121', 'TCE450'],
      q: ['TCE450'],
      mk: {
        i: ['001', '003', '004', '005', '014', '015'],
        j: ['006', '008', '009', '010', '019', '020'],
        e: '011',
        o: ['012', '013', '016'],
        p: ['017', '018', '021']
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
