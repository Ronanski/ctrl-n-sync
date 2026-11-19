/* TCE126 VALVE CONTROL DIAGNOSTICS(7) (331DM09784 page 91, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   sheets of two VALVE DIAGNOSIS blocks (tce/_lib.js, TCE_LIB.vd2); the places are those of TCE120 set straight.
   Position signals (1) and (2) of control valve B: LVDT A and B and servo amplifier A and B. The drawing prints no marks at POS.OT, ANN.EN and
   the outputs of this sheet; none are typed. The title block of this page prints PAGE 89; it is page 91 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.vd2({
      id: 'TCE126',
      title: 'VALVE CONTROL DIAGNOSTICS(7)',
      page: 91,
      v: 'CV(B)',
      ann: 'CV ANN ENABLE',
      dem: ['B', 'TCE212'],
      sim: ['A3', 'TCE502'],
      en: ['S', 'TCE053'],
      io: [
        ['TCE990-4', 'TCE990-8'],
        ['TCE990-16', 'TCE990-20']
      ],
      tct: ['TCT211', 'TCT211'],
      pos: ['TCE127', 'TCE450'],
      abn: ['TCE127', 'TCE450'],
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
