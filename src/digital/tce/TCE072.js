/* TCE072 ANALOG INPUT SIGNAL DIAGNOSTICS(13) (331DM09784 page 40, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the analog
   input diagnostics sheets (tce/_lib.js, TCE_LIB.tmr), in the units of sheet TCE060: the frame of this page stands 4 to the left and 6 higher on the
   rendered page. Shaft vibration of turbine bearing No.2 (Y) and of generator bearing No.3 (X) and (Y): the value of each block goes straight out, as
   on TCE071. The drawing breaks the word SHAFT over two lines on the generator names ("SHA" / "FTVIBRATION"); they are typed as printed. */
(function () {
  if (typeof window === 'undefined') return;
  const IN = [['NO.2 TURBINE SHAFT', 'VIBRATION(Y)'], ['NO.3 GENERATOR SHA', 'FTVIBRATION(X)'], ['NO.3 GENERATOR SHA', 'FTVIBRATION(Y)']];
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.tmr({
      id: 'TCE072',
      title: 'ANALOG INPUT SIGNAL DIAGNOSTICS(13)',
      page: 40,
      f: [167, 81, 2228, 1545],
      tags: ['nVE-STn002-2', 'nVE-GEn001-1', 'nVE-GEn001-2'],
      tag: 'nVE',
      let: ['D7', 'E7'],
      sh: ['073', '074', '075'],
      /* the blocks are the three measurements; (A), (B), (C) are the three controllers that read each of them */
      name: (ch, sig, n) => {
        const a = IN['ABC'.indexOf(ch)];
        return [a[0], a[1] + '(' + 'ABC'[n - 1] + ')' + (sig ? '' : ' INPUT ERR')];
      },
      sg: ['K:0.408mm', 'K:-0.02mm', 'K:0.08mm', 'K:0.0mm'],
      out: ['', '', ''],
      refA: ['-'],
      refA1: ['-'],
      direct: [
        ['A', ['-'], ['TCT209'], IN[0], ['038', '039', '004', '006']],
        ['B', ['-'], ['TCT209'], ['NO.3 GENERATOR SHAFT', 'VIBRATION(X)'], ['042', '046', '047', '048']],
        ['C', ['-'], ['TCT209'], IN[2], ['045', '049', '050', '051']]
      ],
      dx: -8,
      dr: -6,
      foot: [[236, 1525, 'CONTROLLER:'], [397, 1525, 'EHG+MD'], [658, 1498, 'TRIGGER  :'], [658, 1525, 'CYCLE(ms):30']]
    })
  );
})();
