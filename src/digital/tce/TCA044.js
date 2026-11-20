/* TCA044 COMM DIGITAL INPUT(5) (331DM09788 page 24, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
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
    [["CV (B) BELOW SEAT SECONDARY","WARMING DRAIN VALVE OPENED"],["TCA618"],["-"]],
    [["CV (B) BELOW SEAT SECONDARY","WARMING DRAIN VALVE CLOSED"],["TCA618"],["-"]],
    [["CV (B) BEL SEAT SEC.WARMING","DRAIN VALVE ELEC. TROUBLE"],["TCA618"],["-"]],
    [["HP TURBINE WARMING VALVE","FULL CLOSE POSITION"],["TCA685"],["-"]],
    [["HP TURBINE WARMING VALVE","FULL OPEN POSITION"],["TCA685"],["-"]],
    [["COLD REHEAT DRAIN VALVE","CLOSE FEED BACK"],["-"],["-"],205],
    [["COLD REHEAT DRAIN VALVE","FULL OPEN FEED BACK"],["-"],["-"],205],
    [["(SPARE)",""],["-"],["-"],205],
    [["(SPARE)",""],["-"],["-"]],
    [["(SPARE)",""],["-"],["-"]],
    [["(SPARE)",""],["-"],["-"]],
    [["CV(B) BEL SEC WARMING DRAIN","VALVE TORQUE SW OPEN"],["TCA618"],["-"]],
    [["CV(B) BEL SEC WARMING DRAIN","VALVE TORQUE SW CLOSE"],["TCA618"],["-"]],
    [["HP TURBINE WARMING VALVE","TORQUE SW OPEN"],["TCA685"],["-"]],
    [["HP TURBINE WARMING VALVE","TORQUE SW CLOSE"],["TCA685"],["-"]],
    [["P.S.NORMAL",""],["TCA817"],["-"]]
  ];
  ROWS.forEach(([name, ra, rb, crt, not, pn], k) => {
    const right = k >= 8,
      i = k % 8,
      no = k + 1,
      x0 = right ? 1210 : 220 /* left edge of the PI/O box */,
      y = Math.round((right ? 232 : 227) + i * 127.9) /* the signal line */,
      xe = x0 + 300 /* right edge of the box */,
      xa = right ? 1610 : 607 /* the connection mark */,
      xb = right ? 1781 : 790 /* the BTR mark */,
      xj = right ? 2022 : 1035 /* the junction to connector B */,
      xo = right ? 2088 : 1090; /* centre of the connectors */
    r.push(['di' + no, x0, y - 27, 300, 54, '']);
    t.push([x0 + 6, y - 4, name[0]], [x0 + 6, y + 18, name[1]], [x0, y + 41, 'DI'], [xa - 37, y - 33, '(TCA902-' + (pn || no + 0) + ')']);
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
      d.push(["crt" + no, xj + 58, y - 53, "out", "TCA044_" + no, "S", "#1C"]);
    } else c.push(['b' + no, 'out', 'B' + no, xo, y - 53, '', rb, 1], ['a' + no, 'out', 'A' + no, xo, y, '', ra]);
    if (crt === "top") {
      /* CRT taken above connector B, from the B junction (TCA049 row 9) */
      w.push(["di" + no, [[xj, y - 53], [xj, y - 105], [xj + 40, y - 105]]]);
      d.push(["crt" + no, xj + 68, y - 105, "out", "TCA044_" + no, "S", "#1C"]);
    } else if (crt && crt !== "b") {
      /* to the operator station (CRT) */
      const xc = xj - (crt === 1 ? 168 : crt);
      w.push(['di' + no, [[xc, y], [xc, y - 57], [xc + 57, y - 57]]]);
      d.push(['crt' + no, xc + 85, y - 57, 'out', 'TCA044_' + no, 'S', '#1C']);
    }
  });
  /* the PI/O error of the card */
  r.push(['pioErr', 1290, 1301, 128, 23, 'PI/O error']);
  t.push([1308, 1296, '(TCA902-1)']);
  w.push(['pioErr', [[1418, 1312], [2045, 1312]]]);
  b.push(['btr17', 'o:BTR', '017', 1778, 1312]);
  c.push(['oF', 'out', 'F', 2075, 1312, '', ["TCA800"]]);
  t.push([228, 1527, 'CONTROLLER:'], [388, 1527, 'COMM+MD'], [613, 1508, 'TRIGGER  :'], [613, 1535, 'CYCLE(ms):100']);
  (typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
    id: 'TCA044',
    title: 'COMM DIGITAL INPUT(5)',
    page: 24,
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
