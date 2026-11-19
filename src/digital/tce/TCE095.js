/* TCE095 DIGITAL INPUT SIGNAL DIAGNOSTICS(21) (331DM09784 page 62, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   digital input diagnostics sheets (tce/_lib.js, TCE_LIB.did); the places are those of the page set straight, as on TCE075.
   The first two blocks read spare inputs and their OUT is left open: the lamp and the connector of ACCELERATION RY OPERATED (INPUT) are fed by
   connector A from TCE166, those of PLU OPERATED(2/3) by connector A15 from TCE043. The two turbine manual trip push buttons also go to one OR
   (036) for the lamp TURBINE MANUAL TRIP (CCR). The input errors of the first three blocks go out a little higher than DEV E, as drawn. */
(function () {
  if (typeof window === 'undefined') return;
  const S = ['SPARE'],
    A = ['ACCELERATION RY OPERATED', '(INPUT)'],
    P = ['PLU OPERATED(2/3)'],
    T1 = ['TURBINE MANUAL TRIP PB1'],
    T2 = ['TURBINE MANUAL TRIP PB2'],
    E = L => [L[0], 'INPUT ERROR'],
    R5 = ['TCP1055', 'TCP2055', 'TCP3055'],
    UP = { ey: -10, ex: 1624 };
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.did({
      id: 'TCE095',
      title: 'DIGITAL INPUT SIGNAL DIAGNOSTICS(21)',
      page: 62,
      f: [180, 75, 2232, 1535],
      tops: [103, 391, 668, 976],
      line2: '',
      g: [
        [{ in: [S, S, S], out: [A, A, E(A)] }, 'B1', 'A', ['001', '004', '032'], ['003', '005', '007'], '031', 'TCE095_1', null, R5, { src: ['A', ['TCE166']], ...UP }],
        [{ in: [S, S, S], out: [P, P, E(P)] }, 'B2', 'B', ['008', '011', '033'], ['010', '012', '014'], '009', 'TCE095_3', ['TCE602'], R5, { src: ['A15', ['TCE043']], ...UP }],
        [{ in: [T1, T1, T1], out: [T1, T1, E(T1)] }, 'B9', 'C', ['015', '018', '034'], ['017', '019', '021'], '016', 'TCE095_5', null, null, UP],
        [{ in: [T2, T2, T2], out: [T2, T2, E(T2)] }, 'B9', 'D', ['022', '025', '035'], ['024', '026', '030'], '023', 'TCE095_7', null, ['TCP1052', 'TCP2052', 'TCP3052']]
      ],
      or: ['027', '028'],
      e: ['E', ['TCE471']],
      /* the OR of the two push buttons: PB1 comes down past its connector wire (y 779, where the drawing has a dot: the line is typed from the
         dot on OUT, y 715, so that the wire of the connector ends on its middle), PB2 comes up from its OUT (y 1023) */
      extra: {
        b: [['or36', 'OR', '036', 1632, 929, [], {}, [58, 44]]],
        d: [['crt10', 2105, 918, 'out', 'TCE095_10', 'S', '#1C']],
        w: [
          ['tid3.OUT', [[1539, 715], [1539, 918], [1603, 918]]],
          ['tid4.OUT', [[1539, 1023], [1539, 939], [1603, 939]]],
          ['or36', [[1661, 918], [2070, 918]]]
        ],
        t: [[1742, 912, 'TURBINE MANUAL TRIP (CCR)']]
      },
      foot: [[247, 1512, 'CONTROLLER:'], [408, 1512, 'EHG+MD'], [670, 1485, 'TRIGGER  :'], [670, 1512, 'CYCLE(ms):30']]
    })
  );
})();
