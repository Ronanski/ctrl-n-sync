/* TCE476 TPC ALARM (331DM09784 page 172, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide, the scan skew taken out. For each TPC (A, B, C): the PCM no-received status (a 0.5 s pulse, TP, reset by
   INITIAL) is held in a flip-flop (FFS) until ANN RESET and goes out as TPC PCM NORECEIVE (B1 to B3); OR of it with the DI
   interrogation power lost, the I/O hard error and the input error of the TPC (TCP1500 / 1501 / 1503 and the 2nnn, 3nnn ones) is
   TPC ABNORMAL (A1 to A3, and C1 to C3 to TCA822). */
(function () {
  if (typeof window === 'undefined') return;
  const k = [],
    c = [],
    b = [],
    w = [],
    t = [];
  [
    ['A', 0, '1', 'PCM090NoReceived', ['001', 'A002', '003']],
    ['B', 426, '2', 'PCM0A0NoReceived', ['004', 'A005', '006']],
    ['C', 851, '3', 'PCM0B0NoReceived', ['007', 'A008', '009']]
  ].forEach(([tpc, o, n, pcm, [or, tp, ffs]]) => {
    const Y = (y) => y + o,
      p = 'g' + n,
      orK = 'or' + or,
      tpK = 'tp' + tp,
      fK = 'ffs' + ffs,
      pins = [160, 182, 204, 225].map(Y);
    /* the three errors of the TPC */
    [
      ['TCP' + n + '500', ['TPC DI', 'INTERROGATION POWER LOST'], 0],
      ['TCP' + n + '501', 'TPC I/O HARD ERROR', 1038],
      ['TCP' + n + '503', 'TPC INPUT ERROR', 1060]
    ].forEach(([ref, nm, xr], i) => {
      const y = Y([160, 236, 310][i]),
        key = p + 'e' + i,
        two = Array.isArray(nm);
      c.push([key, 'in', 'A', 334, y, two ? '' : nm, [ref], 1]);
      if (two) t.push([366, y - 33, nm[0], 0, 2.05], [366, y - 12, nm[1], 0, 2.05]);
      w.push([key, xr ? [[361, y], [xr, y], [xr, pins[i]], [1105, pins[i]]] : [[361, y], [1105, y]]]);
    });
    /* the PCM no-received pulse and its flip-flop */
    k.push([p + 'Init', 254, Y(374), 'INITIAL', 'ref'], [p + 'Pcm', 254, Y(460), pcm, 'sys.ref']);
    b.push([tpK, 'TP', tp, 634, Y(471), ['TP:0.5s']], [fK, 'FFS', ffs, 826, Y(471), [], { l: ['S', 'R'] }, [80, 43]], [orK, 'OR', or, 1135, Y(192), [], {}, [59, 86]]);
    w.push(
      [p + 'Init', [[488, Y(374)], [634, Y(374)], [634, Y(450)]]],
      [p + 'Pcm', [[488, Y(460)], [605, Y(460)]]],
      [tpK, [[663, Y(460)], [786, Y(460)]]],
      [fK, [[866, Y(460)], [2077, Y(460)]]],
      [fK, [[1082, Y(460)], [1082, pins[3]], [1105, pins[3]]]],
      [orK, [[1164, Y(160)], [2076, Y(160)]]],
      [orK, [[1762, Y(160)], [1762, Y(288)], [2065, Y(288)]]],
      ['kAnn', [[764, Y(482)], [786, Y(482)]]]
    );
    t.push(
      [404, Y(400), '(TCE050)', 0, 1.7],
      [593, Y(452), 'C', 0, 1.9],
      [773, Y(442), 'T', 0, 1.9],
      [1860, Y(151), 'TPC(' + tpc + ') ABNORMAL', 0, 2.05],
      [1859, Y(450), 'TPC(' + tpc + ') PCM NORECEIVE', 0, 2.05]
    );
    c.push(
      ['oA' + n, 'out', 'A' + n, 2103, Y(160), '', ['-']],
      ['oC' + n, 'out', 'C' + n, 2092, Y(288), '', ['TCA822'], 1],
      ['oB' + n, 'out', 'B' + n, 2104, Y(460), '', ['-']]
    );
  });
  k.push(['kAnn', 256, 1438, 'ANN RESET', 'ref']);
  w.push(['kAnn', [[490, 1438], [764, 1438], [764, 482]]]);
  t.push([406, 1465, '(TCE050)', 0, 1.7], [240, 1522, 'CONTROLLER:'], [401, 1522, 'EHG+MD'], [663, 1496, 'TRIGGER  :'], [663, 1522, 'CYCLE(ms):30']);
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({ id: 'TCE476', title: 'TPC ALARM', page: 172, ctl: 'EHG+MD', cycle: 30, f: [170, 84, 2221, 1546], k, c, b, w, t });
})();
