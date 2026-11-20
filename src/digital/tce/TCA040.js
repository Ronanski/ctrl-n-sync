/* TCA040 COMM DIGITAL INPUT(1) (331DM09788 page 20, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. Sixteen inputs of the PI/O table TCA900, eight at the left and eight at the right, each drawn the same way: the PI/O
   box, the connection mark, the BTR mark, connector B (other controller, double outline) above and connector A (to its logic sheet) at the
   line; some inputs also go to the operator station (CRT). The rows are counted here as the drawing counts them. */
(function () {
  const r = [],
    g = [],
    b = [],
    c = [],
    w = [],
    t = [],
    d = [];
  /* [the two lines of the PI/O box], [sheets of A], [sheets of B], CRT on the line (1) */
  const ROWS = [
    [["MSV (A) ABOVE SEAT SECONDARY","DRAIN VALVE OPENED"],["TCA610"],["-"]],
    [["MSV (A) ABOVE SEAT SECONDARY","DRAIN VALVE CLOSED"],["TCA610"],["-"]],
    [["MSV (A) ABOVE SEAT SECONDARY","DRAIN VALVE ELECTRICAL TROUBLE"],["TCA610"],["-"]],
    [["CV (A) ABOVE SEAT SECONDARY","DRAIN VALVE OPENED"],["TCA615"],["-"]],
    [["CV (A) ABOVE SEAT SECONDARY","DRAIN VALVE CLOSED"],["TCA615"],["-"]],
    [["CV (A) ABOVE SEAT SECONDARY","DRAIN VALVE ELECTRICAL TROUBLE"],["TCA615"],["-"]],
    [["CRV (A) BELOW SEAT SECONDARY","DRAIN VALVE OPENED"],["TCA625"],["-"]],
    [["CRV (A) BELOW SEAT SECONDARY","DRAIN VALVE CLOSED"],["TCA625"],["-"]],
    [["CRV (A) BELOW SEAT SECONDARY","DRAIN VALVE ELECTRICAL TROUBLE"],["TCA625"],["-"]],
    [["AC EXCITER EARTH FAULT",""],["-"],["-"],1],
    [["AUTO MANUAL START READY",""],["-"],["-"],1],
    [["CONTROL LOCAL",""],["-"],["-"],1],
    [["MSV(A) ABV SEC DRAIN VALVE","TORQUE SW OPEN"],["TCA610"],["-"]],
    [["CRV(A) BELOW SEC. DRAIN VALVE","TORQUE SW OPEN"],["TCA625"],["-"]],
    [["CV(A) ABV SEC. DRAIN VALVE","TORQUE SW OPEN"],["TCA615"],["-"]],
    [["P.S.NORMAL",""],["TCA817"],["-"]]
  ];
  ROWS.forEach(([name, ra, rb, crt], k) => {
    const right = k >= 8,
      i = k % 8,
      no = k + 1,
      x0 = right ? 1210 : 220 /* left edge of the PI/O box */,
      y = Math.round((right ? 239 : 230) + i * 127.9) /* the signal line */,
      xe = x0 + 300 /* right edge of the box */,
      xa = right ? 1610 : 607 /* the connection mark */,
      xb = right ? 1781 : 790 /* the BTR mark */,
      xj = right ? 2022 : 1035 /* the junction to connector B */,
      xo = right ? 2088 : 1090; /* centre of the connectors */
    r.push(['di' + no, x0, y - 27, 300, 54, '']);
    t.push([x0 + 6, y - 4, name[0]], [x0 + 6, y + 18, name[1]], [x0, y + 41, 'DI'], [xa - 37, y - 33, '(TCA900-' + no + ')']);
    w.push(['di' + no, [[xe, y], [xa - 8, y]], 1], ['di' + no, [[xa + 8, y], [xo - 30, y]]], ['di' + no, [[xj, y], [xj, y - 53], [xo - 30, y - 53]]]);
    g.push([xa, y, 'l']);
    b.push(['btr' + no, 'o:BTR', String(right ? 2 * i + 2 : 2 * i + 1).padStart(3, '0'), xb, y]);
    c.push(['b' + no, 'out', 'B' + no, xo, y - 53, '', rb, 1], ['a' + no, 'out', 'A' + no, xo, y, '', ra]);
    if (crt) {
      /* to the operator station (CRT) */
      const xc = xj - 168;
      w.push(['di' + no, [[xc, y], [xc, y - 57], [xc + 57, y - 57]]]);
      d.push(['crt' + no, xc + 85, y - 57, 'out', 'TCA040_' + no, 'S', '#1C']);
    }
  });
  /* the PI/O error of the card */
  r.push(['pioErr', 1290, 1301, 128, 23, 'PI/O error']);
  t.push([1308, 1296, '(TCA900-1)']);
  w.push(['pioErr', [[1418, 1312], [2045, 1312]]]);
  b.push(['btr17', 'o:BTR', '017', 1778, 1312]);
  c.push(['oF', 'out', 'F', 2075, 1312, '', ["TCA800"]]);
  t.push([228, 1527, 'CONTROLLER:'], [388, 1527, 'COMM+MD'], [613, 1508, 'TRIGGER  :'], [613, 1535, 'CYCLE(ms):100']);
  (typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
    id: 'TCA040',
    title: 'COMM DIGITAL INPUT(1)',
    page: 20,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [180, 88, 2232, 1552],
    r,
    g,
    b,
    c,
    d,
    w,
    t
  });
})();
