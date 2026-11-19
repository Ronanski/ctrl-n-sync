/* TCE071 ANALOG INPUT SIGNAL DIAGNOSTICS(12) (331DM09784 page 39, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the analog
   input diagnostics sheets (tce/_lib.js, TCE_LIB.tmr), in the units of sheet TCE060: the frame of this page stands 4 to the right and 7 higher on
   the rendered page. Shaft vibration of turbine bearing No.1 (X), No.1 (Y) and No.2 (X): the value of each block goes straight out. */
(function () {
  if (typeof window === 'undefined') return;
  const AX = [['NO.1 TURBINE SHAFT', 'VIBRATION(X)'], ['NO.1 TURBINE SHAFT', 'VIBRATION(Y)'], ['NO.2 TURBINE SHAFT', 'VIBRATION(X)']];
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.tmr({
      id: 'TCE071',
      title: 'ANALOG INPUT SIGNAL DIAGNOSTICS(12)',
      page: 39,
      f: [167, 81, 2228, 1545],
      tags: ['nVE-STn001-1', 'nVE-STn001-2', 'nVE-STn002-1'],
      tag: 'nVE-STn',
      let: ['D7', 'E7'],
      sh: ['070', '071', '072'],
      /* the blocks are the three measurements; (A), (B), (C) are the three controllers that read each of them */
      name: (ch, sig, n) => {
        const a = AX['ABC'.indexOf(ch)];
        return [a[0], a[1] + '(' + 'ABC'[n - 1] + ')' + (sig ? '' : ' INPUT ERR')];
      },
      sg: ['K:0.408mm', 'K:-0.02mm', 'K:0.08mm', 'K:0.0mm'],
      out: ['', '', ''],
      refA: ['-'],
      refA1: ['-'],
      direct: [
        ['A', ['-'], ['TCT209'], AX[0], ['038', '039', '004', '006']],
        ['B', ['-'], ['TCT209'], AX[1], ['042', '046', '047', '048']],
        ['C', ['-'], ['TCT209'], AX[2], ['045', '049', '050', '051']]
      ],
      dx: -5,
      dr: -4,
      foot: [[236, 1525, 'CONTROLLER:'], [397, 1525, 'EHG+MD'], [658, 1498, 'TRIGGER  :'], [658, 1525, 'CYCLE(ms):30']]
    })
  );
})();
