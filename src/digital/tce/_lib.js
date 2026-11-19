/* Helpers for the typed TCS soft logic sheets (src/digital/tce/*.js). Loaded before the sheets (src/digital/order.list).
   TCE_LIB.di(o): the parts of a DIGITAL INPUT sheet. Those sheets draw sixteen inputs of one PI/O table the same way, eight at the left and eight at
   the right: the PI/O box, the connection mark, the BTR mark, connector A (to its logic sheet) and connector B under it, then the PI/O error of the
   card. A sheet gives only what differs: its rows, where its two columns start, and the pieces a row has beside the pattern.
     o.table  'TCE901'         the PI/O table of the inputs
     o.first  1                the order number of the first input in that table
     o.left / o.right [x, y]   left edge and top of the first PI/O box of each column
     o.w      270              width of a PI/O box
     o.rows   [[line 1, line 2], [sheets of A], [sheets of B] | null, dy of B (75 where not given)]  sixteen of them
     o.err    [x, y, w, table order text, x of BTR 017, x of connector F, [sheets of F]]            the PI/O error box (y = its top)
   Returns { r, g, b, c, d, w, t, P }: the lists of the sheet, and P[n] = { y, xj, xo } the line, junction and connector places of input n. */
(function () {
  const di = o => {
    const r = [],
      g = [],
      b = [],
      c = [],
      w = [],
      t = [],
      d = [],
      P = {},
      W = o.w || 270;
    o.rows.forEach(([name, ra, rb, dy], n) => {
      const right = n >= 8,
        i = n % 8,
        [x0, y0] = right ? o.right : o.left,
        top = Math.round(y0 + i * 138.4),
        y = top + 27,
        no = n + 1,
        xe = x0 + W,
        xj = xe + 368,
        xo = xe + 506,
        by = y + (dy == null ? 75 : dy);
      P[no] = { y, xj, xo };
      r.push(['di' + no, x0, top, W, 54, '']);
      t.push([x0 + 6, name[1] ? top + 27 : top + 30, name[0]], [x0 + 6, top + 49, name[1]], [x0, top + 76, 'DI'], [xe + 137, top - 2, '(' + o.table + '-' + (o.first + n) + ')']);
      w.push(['di' + no, [[xe, y], [xe + 118, y]], 1], ['di' + no, [[xe + 134, y], [xo - 30, y]]]);
      if (rb) {
        w.push(['di' + no, [[xj, y], [xj, by], [xo - 30, by]]]);
        c.push(['b' + no, 'out', 'B' + no, xo, by, '', rb, 1]);
      }
      g.push([xe + 126, y, 'l']);
      b.push(['btr' + no, 'o:BTR', String(right ? 2 * i + 2 : 2 * i + 1).padStart(3, '0'), xe + 263, y]);
      c.push(['a' + no, 'out', 'A' + no, xo, y, '', ra]);
    });
    if (o.err) {
      const [x, y, ew, note, xb, xf, rf] = o.err;
      r.push(['pioErr', x, y, ew, 22, 'PI/O error']);
      t.push([x + 16, y - 5, '(' + note + ')']);
      w.push(['pioErr', [[x + ew, y + 11], [xf - 30, y + 11]]]);
      b.push(['btr17', 'o:BTR', '017', xb, y + 11]);
      c.push(['oF', 'out', 'F', xf, y + 11, '', rf]);
    }
    return { r, g, b, c, d, w, t, P };
  };
  if (typeof window !== 'undefined') window.TCE_LIB = { di };
})();
