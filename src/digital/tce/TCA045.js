/* TCA045 COMM DIGITAL INPUT(6) (331DM09788 page 25, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
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
  /* [the two lines of the PI/O box], [sheets of A], [sheets of B], CRT on the line (1, or the distance of its branch from the junction), the NOT on the line */
  const ROWS = [
    [["NO.3 EXTRACTION STEAM PRIMARY","NON RETURN VLV FULL CLOSE POS"],["TCA712"],["TCT081A"]],
    [["NO.3 EXTRACTION STEAM PRIMARY","NON RETURN VLV FULL OPEN POS"],["TCA712"],["TCT081B"]],
    [["DEAERATOR STORAGE TANK","LEVEL VERY HIGH"],["TCA712","TCA714"],["-"]],
    [["DUPLEX OIL FILTER","DIFF. PRESS."],["-"],["TCT081"],1],
    [["GEN CONTROL PANEL TROUBL","E"],["-"],["-"],1],
    [["GEN TRANSF. PROTECTION","OPERATED"],["-"],["-"],1],
    [["GEN VOLTAGE OK",""],["TCA543","TCA826"],["-"]],
    [["52L CLOSE",""],["TCA562"],["-"]],
    [["52L OPEN",""],["-"],["-"]],
    [["ASD1 IN USE",""],["TCA533"],["-"]],
    [["AVR FAILURE TO BACKUP","STATUS"],["-"],["-"],1],
    [["AVR IN AUTO",""],["TCA533","TCA587"],["-"],1],
    [["AVR IN MANUAL",""],["TCA587"],["-"],1],
    [["AVR CHANNEL1 SELECT",""],["-"],["-"],1],
    [["AVR CHANNEL2 SELECT",""],["-"],["-"],1],
    [["P.S.NORMAL",""],["TCA817"],["-"]]
  ];
  ROWS.forEach(([name, ra, rb, crt, not, pn], k) => {
    const right = k >= 8,
      i = k % 8,
      no = k + 1,
      x0 = right ? 1210 : 220 /* left edge of the PI/O box */,
      y = Math.round((right ? 234 : 229) + i * 127.9) /* the signal line */,
      xe = x0 + 300 /* right edge of the box */,
      xa = right ? 1610 : 607 /* the connection mark */,
      xb = right ? 1781 : 790 /* the BTR mark */,
      xj = right ? 2022 : 1035 /* the junction to connector B */,
      xo = right ? 2088 : 1090; /* centre of the connectors */
    r.push(['di' + no, x0, y - 27, 300, 54, '']);
    t.push([x0 + 6, y - 4, name[0]], [x0 + 6, y + 18, name[1]], [x0, y + 41, 'DI'], [xa - 37, y - 33, '(TCA902-' + (pn || no + 16) + ')']);
    w.push(['di' + no, [[xe, y], [xa - 8, y]], 1], ...(not
        ? [['di' + no, [[xa + 8, y], [xa + 51, y]]], ['not' + not, [[xa + 109, y], [xo - 30, y]]]]
        : [['di' + no, [[xa + 8, y], [xo - 30, y]]]]), crt === 'b' ? ['di' + no, [[xj, y], [xj, y - 53], [xj + 30, y - 53]]] : ['di' + no, [[xj, y], [xj, y - 53], [xo - 30, y - 53]]]);
    g.push([xa, y, 'l']);
    /* a NOT between the connection mark and the BTR */
    if (not) b.push(['not' + not, 'NOT', not, xa + 80, y + 4]);
    b.push(['btr' + no, 'o:BTR', String(right ? 2 * i + 2 : 2 * i + 1).padStart(3, '0'), xb, y]);
    if (crt === "b") {
      /* only connector B, on the signal line; CRT above it from the junction (TCA050 row 6) */
      c.push(['b' + no, 'out', 'B' + no, xo, y, '', rb, 1]);
      d.push(["crt" + no, xj + 58, y - 53, "out", "TCA045_" + no, "S", "#1C"]);
    } else c.push(['b' + no, 'out', 'B' + no, xo, y - 53, '', rb, 1], ['a' + no, 'out', 'A' + no, xo, y, '', ra]);
    if (crt === "top") {
      /* CRT taken above connector B, from the B junction (TCA049 row 9) */
      w.push(["di" + no, [[xj, y - 53], [xj, y - 105], [xj + 40, y - 105]]]);
      d.push(["crt" + no, xj + 68, y - 105, "out", "TCA045_" + no, "S", "#1C"]);
    } else if (crt && crt !== "b") {
      /* to the operator station (CRT) */
      const xc = xj - (crt === 1 ? 168 : crt);
      w.push(['di' + no, [[xc, y], [xc, y - 57], [xc + 57, y - 57]]]);
      d.push(['crt' + no, xc + 85, y - 57, 'out', 'TCA045_' + no, 'S', '#1C']);
    }
  });
  /* the PI/O error of the card */
  r.push(['pioErr', 1290, 1301, 128, 23, 'PI/O error']);
  t.push([1308, 1296, '(TCA902-17)']);
  w.push(['pioErr', [[1418, 1312], [2045, 1312]]]);
  b.push(['btr17', 'o:BTR', '017', 1778, 1312]);
  c.push(['oF', 'out', 'F', 2075, 1312, '', ["TCA800"]]);
  t.push([228, 1527, 'CONTROLLER:'], [388, 1527, 'COMM+MD'], [613, 1508, 'TRIGGER  :'], [613, 1535, 'CYCLE(ms):100']);
  (typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
    id: 'TCA045',
    title: 'COMM DIGITAL INPUT(6)',
    page: 25,
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
