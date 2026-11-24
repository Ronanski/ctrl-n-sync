/* TCE068 ANALOG INPUT SIGNAL DIAGNOSTICS(9) (331DM09784 page 36, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the analog
   input diagnostics sheets (tce/_lib.js, TCE_LIB.tmr), in the units of sheet TCE060: the frame of this page stands 8 higher on the rendered page, so
   every height read from it has 8 added. HP turbine exhaust steam temperature: one signal per block, as on TCE067. Beside the pattern the value goes
   to a comparator (CMP 047, high at 400.0, back at 395.0) with its own lamp, and the 2OO3 part stands lower for it. */
(function () {
  if (typeof window === 'undefined') return;
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.tmr({
      id: 'TCE068',
      /* pr: printed on page 36 beside each block; the drawing above keeps them as text */
      pr: {
        cmp047: ['HL:400.0degc', 'LL:395.0degc']
      },
      title: 'ANALOG INPUT SIGNAL DIAGNOSTICS(9)',
      page: 36,
      f: [167, 81, 2228, 1545],
      tag: 'nTE-STn003',
      let: ['B2', 'D2'],
      single: [[712, 776, 67], [677, 730, 119], [675, 729, 98]],
      inref: ['TCA357', 'TCA361', 'TCA365'],
      cref: ['TCP1108', 'TCP2108', 'TCP3108'],
      name: (ch, sig) => ['HP TURBINE EXHAUST', 'STEAM TEMP.(' + ch + ')' + (sig ? '' : ' INPUT ERR')],
      sg: ['K:510.0degC', 'K:-25.0degC', 'K:100.0degC', 'K:50.0degC'],
      out: ['HP TURBINE EXHAUST', 'STEAM TEMP.', 'STEAM TEMP. ABN.'],
      refA: ['-'],
      refA1: ['-'],
      dy2: 67,
      extra: {
        k: [['kInit', 1483, 413, 'INITIAL', 'ref']],
        b: [['cmp047', 'CMP', '047', 1850, 457]],
        d: [['crtHigh', 2076, 445, 'out', 'TCE068_1', 'S', '#1C']],
        w: [
          ['td2', [[1778, 360], [1778, 445], [1821, 445]], 1],
          ['kInit', [[1718, 413], [1850, 413], [1850, 436]]],
          ['cmp047', [[1879, 445], [2041, 445]]]
        ],
        t: [
          [1627, 449, '(TCE050)'],
          [1806, 438, 'T'],
          [1864, 393, 'HP TURBINE EXHAUST'],
          [1864, 415, 'STEAM TEMP. HIGH'],
          [1895, 464, 'HL:400.0degc'],
          [1895, 485, 'LL:395.0degc']
        ]
      },
      foot: [[236, 1525, 'CONTROLLER:'], [397, 1525, 'EHG+MD'], [658, 1498, 'TRIGGER  :'], [658, 1525, 'CYCLE(ms):30']]
    })
  );
})();
