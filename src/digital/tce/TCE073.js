/* TCE073 ANALOG INPUT SIGNAL DIAGNOSTICS(14) (331DM09784 page 41, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the analog
   input diagnostics sheets (tce/_lib.js, TCE_LIB.tmr), in the units of sheet TCE060: the frame of this page stands 8 to the left and 1 higher on the
   rendered page. Shaft vibration of generator bearing No.4 (X) and (Y); the third block is a spare (its inputs, its name and its outputs are "-" in the
   drawing). The drawing breaks the word SHAFT over two lines ("SHA" / "FTVIBRATION") except on the first input; the names are typed as printed. */
(function () {
  if (typeof window === 'undefined') return;
  const AX = ['X', 'Y'];
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.tmr({
      id: 'TCE073',
      title: 'ANALOG INPUT SIGNAL DIAGNOSTICS(14)',
      page: 41,
      f: [167, 81, 2228, 1545],
      tags: ['nVE-GEn002-1', 'nVE-GEn002-2', 'TCE073'],
      tag: 'nVE',
      let: ['D6', 'E6'],
      lets: [['D6', 'E6'], ['D6', 'E6'], ['-', '-']],
      sh: ['074', '075', null],
      /* the blocks are the measurements; (A), (B), (C) are the three controllers that read each of them */
      name: (ch, sig, n) => {
        const g = 'ABC'.indexOf(ch),
          k = '(' + 'ABC'[n - 1] + ')';
        if (g === 2) return ['', '-'];
        if (g === 0 && n === 1 && sig) return ['NO.4 GENERATOR SHAFT', 'VIBRATION(X)' + k];
        return ['NO.4 GENERATOR SHA', 'FTVIBRATION(' + AX[g] + ')' + k + (sig ? '' : ' INPUT ERR')];
      },
      sg: ['K:0.408mm', 'K:-0.02mm', 'K:0.08mm', 'K:0.0mm'],
      out: ['', '', ''],
      refA: ['-'],
      refA1: ['-'],
      direct: [
        ['A', ['-'], ['TCT209'], [['NO.4 GENERATOR SHA', 'FTVIBRATION(X)'], ['NO.4 GENERATOR SHA', 'FTVIBRATION(', 'X)ABNORMAL']], ['038', '039', '004', '006']],
        ['B', ['-'], ['TCT209'], [['NO.4 GENERATOR SHA', 'FTVIBRATION(Y)'], ['NO.4 GENERATOR SHA', 'FTVIBRATION(', 'Y)ABNORMAL']], ['042', '046', '047', '048']],
        ['C', ['-'], ['-'], [['-'], []], ['045', '049', '050', '051']]
      ],
      dx: -2,
      dr: -2,
      foot: [[236, 1525, 'CONTROLLER:'], [397, 1525, 'EHG+MD'], [658, 1498, 'TRIGGER  :'], [658, 1525, 'CYCLE(ms):30']]
    })
  );
})();
