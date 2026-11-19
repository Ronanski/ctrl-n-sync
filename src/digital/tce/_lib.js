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
  /* TCE_LIB.tmr(o): a sheet ANALOG INPUT SIGNAL DIAGNOSTICS. One signal (A), (B), (C), each read by the three protection controllers and checked by one
     TMR AI DIAGNOSTICS block; the three results go to TRIPLE DETECTOR2 (the value) and to 2OO3 (abnormal). Those sheets are drawn the same way; a sheet
     gives what differs: o.id, title, page, f, tag, let [signal letter, error letter], name(ch, sig) => [words over the line, name], sg [four constants],
     out [line 1, line 2, line 2 of abnormal], refA, refA1, refC (sheets of C1, C2, C3), cs [[x of the branch, y] of C1, C2, C3], cx (x of C1), dx / dr (the left part and the right
     part stand that far from where sheet TCE060 has them), foot (the words of the foot line). Returns the sheet. */
  const tmr = o => {
  const F = o.f,
    dx = o.dx || 0,
    dr = o.dr || 0,
    [C1, C2, C3] = o.cs,
    RC = o.refC || ['TCT200', 'TCT200', 'TCT200'],
    u = (F[2] - F[0]) / 1000,
    c = [],
    b = [],
    m = [],
    w = [],
    t = [];
  /* [letter, top of the block, left of the block, x of the connectors, sheet number of the inputs, block number, first mark number list] */
  const G = [
    ['A', 123, 885 + dx, 307 + dx, '070', 'A002', ['001', '005', '007', '009', '010', '011']],
    ['B', 570, 882 + dx, 304 + dx, '072', 'A020', ['019', '022', '023', '024', '025', '026']],
    ['C', 1017, 880 + dx, 302 + dx, '074', 'A030', ['029', '031', '032', '033', '034', '035']]
  ];
  const L = ['SIG1', 'ERR1', 'SIG2', 'ERR2', 'SIG3', 'ERR3', 'HL', 'LL', 'DEV', 'SIM'],
    R = ['OUT', '', 'ABN', '', 'DEV E', '', 'ERR', '', '', ''],
    pin = (top, i) => Math.round(top + 15 * u + (i + 0.5) * ((381 - 30 * u) / 10)),
    BEND = [0, 659, 680, 701, 722, 743].map(x => x + dx);
  const P = G.map(([ch, top, bx, cx, sh, no, marks], g) => {
    const k = 'tmr' + (g + 1),
      p = i => pin(top, i);
    m.push([k, 'TMR AI DIAGNOSTICS', o.tag + '-' + (g + 1), bx, top, 405, 381, L, R, no, [
      [bx + 90, top + 225, 'TP:1.0'],
      [bx + 90, top + 246, 'TP:1.0'],
      [bx + 90, top + 267, 'TP:1.0'],
      [bx + 84, top + 288, 'DELAY TP:3.0s'],
      [bx + 84, top + 310, 'DELAY TP:3.0s'],
      [bx + 84, top + 331, 'DELAY TP:3.0s'],
      [bx + 105, top + 404, '(LME111)'],
      [bx + 217, top + 404, '(LME111A)']
    ]]);
    for (let i = 0; i < 6; i++) {
      const sig = i % 2 === 0,
        key = 'i' + ch + (i + 1),
        y = p(0) + Math.round(i * 53.3),
        n = Math.floor(i / 2) + 1;
      const [over, name] = o.name(ch, sig);
      c.push([key, 'in', o.let[sig ? 0 : 1], cx, y, name, ['TCP' + n + sh], 1]);
      if (over) t.push([cx + 33, y - 32, over]);
      b.push(['mk' + ch + (i + 1), sig ? 'o:FTR' : 'o:BTR', marks[i], cx + 321, y]);
      w.push([key, i ? [[cx + 27, y], [BEND[i], y], [BEND[i], p(i)], [bx, p(i)]] : [[cx + 27, y], [bx, y]], sig ? 1 : 0]);
    }
    return { k, p, bx };
  });
  const [g1, g2, g3] = P;
  const X = x => x + dx,
    Z = x => x + dr;
  return {
    id: o.id,
    title: o.title,
    page: o.page,
    ctl: 'EHG+MD',
    cycle: 30,
    f: F,
    c: [
      ...c,
      ['oA', 'out', 'A', Z(2077), 170, '', o.refA],
      ['oA1', 'out', 'A1', Z(2076), 264, '', o.refA1, 1],
      ['oB', 'out', 'B', Z(2075), 477, '', ['-']],
      ['oB1', 'out', 'B1', Z(2074), 573, '', ['-'], 1],
      ['oC1', 'out', 'C1', o.cx, C1[1], '', [RC[0]], 1],
      ['oC2', 'out', 'C2', o.cx - 1, C2[1], '', [RC[1]], 1],
      ['oC3', 'out', 'C3', o.cx - 1, C3[1], '', [RC[2]], 1]
    ],
    d: [
      ['crtPv', Z(2076), 360, 'out', o.tag + '_PV', 'S', '#1C'],
      ['crtAbn', Z(2073), 679, 'out', o.tag + '_PVC', 'S', '#1C']
    ],
    r: [
      ['td2', Z(1481), 136, 235, 128, ''],
      ['v2o3', Z(1564), 445, 86, 107, '']
    ],
    m,
    b: [
      ...b,
      ['sg012', 'SG', 'A012', X(562), 478, [o.sg[0]]],
      ['sg017', 'SG', 'A017', X(563), 552, [o.sg[1]]],
      ['sg027', 'SG', 'A027', X(561), 922, [o.sg[2]]],
      ['sg036', 'SG', 'B036', X(558), 1404, [o.sg[3]]],
      ['ftr013', 'o:FTR', '013', X(732), 467],
      ['ftr018', 'o:FTR', '018', X(731), 541],
      ['ftr028', 'o:FTR', '028', X(731), 911],
      ['ftr037', 'o:FTR', '037', X(632), 1393],
      ['ftr038', 'o:FTR', '038', Z(1374), 170],
      ['btr040', 'o:BTR', '040', Z(1374), g1.p(2)],
      ['ftr042', 'o:FTR', '042', Z(1371), g2.p(0)],
      ['btr043', 'o:BTR', '043', Z(1371), g2.p(2)],
      ['ftr044', 'o:FTR', '044', Z(1370), 988],
      ['ftr045', 'o:FTR', '045', Z(1369), g3.p(0)],
      ['btr046', 'o:BTR', '046', Z(1369), g3.p(2)],
      ['ftr039', 'o:FTR', '039', Z(1746), 170],
      ['ftr004', 'o:FTR', '004', Z(1821), 170],
      ['ftr006', 'o:FTR', '006', Z(1820), 264],
      ['ftr008', 'o:FTR', '008', Z(1819), 360],
      ['btr041', 'o:BTR', '041', Z(1744), 477],
      ['btr015', 'o:BTR', '015', Z(1818), 477],
      ['btr016', 'o:BTR', '016', Z(1817), 573],
      ['btr021', 'o:BTR', '021', Z(1816), 679]
    ],
    w: [
      ...w,
      /* the limits and the simulation value, the same for the three blocks */
      ['sg012', [[X(591), 467], [X(775), 467]], 1],
      ['sg012', [[X(775), g1.p(6)], [X(775), g3.p(6)], [g3.bx, g3.p(6)]], 1],
      ['sg012', [[X(775), g1.p(6)], [g1.bx, g1.p(6)]], 1],
      ['sg012', [[X(775), g2.p(6)], [g2.bx, g2.p(6)]], 1],
      ['sg017', [[X(592), 541], [X(796), 541]], 1],
      ['sg017', [[X(796), g1.p(7)], [X(796), g3.p(7)], [g3.bx, g3.p(7)]], 1],
      ['sg017', [[X(796), g1.p(7)], [g1.bx, g1.p(7)]], 1],
      ['sg017', [[X(796), g2.p(7)], [g2.bx, g2.p(7)]], 1],
      ['sg027', [[X(590), 911], [X(817), 911]], 1],
      ['sg027', [[X(817), g1.p(8)], [X(817), g3.p(8)], [g3.bx, g3.p(8)]], 1],
      ['sg027', [[X(817), g1.p(8)], [g1.bx, g1.p(8)]], 1],
      ['sg027', [[X(817), g2.p(8)], [g2.bx, g2.p(8)]], 1],
      ['sg027', [[X(817), 988], [Z(1459), 988], [Z(1459), 233], [Z(1481), 233]], 1],
      ['sg036', [[X(587), 1393], [X(838), 1393], [X(838), g1.p(9)], [g1.bx, g1.p(9)]], 1],
      ['sg036', [[X(838), g2.p(9)], [g2.bx, g2.p(9)]], 1],
      ['sg036', [[X(838), g3.p(9)], [g3.bx, g3.p(9)]], 1],
      /* the three values to TRIPLE DETECTOR2 and to the turbine supervisory sheets */
      ['tmr1.OUT', [[g1.bx + 405, 170], [Z(1481), 170]], 1],
      ['tmr1.OUT', [[C1[0], 170], [C1[0], C1[1]], [o.cx - 27, C1[1]]], 1],
      ['tmr2.OUT', [[g2.bx + 405, g2.p(0)], [Z(1414), g2.p(0)], [Z(1414), 191], [Z(1481), 191]], 1],
      ['tmr2.OUT', [[C2[0], g2.p(0)], [C2[0], C2[1]], [o.cx - 28, C2[1]]], 1],
      ['tmr3.OUT', [[g3.bx + 405, g3.p(0)], [C3[0], g3.p(0)], [C3[0], C3[1]], [o.cx - 28, C3[1]]], 1],
      ['tmr3.OUT', [[Z(1436), g3.p(0)], [Z(1436), 212], [Z(1481), 212]], 1],
      /* abnormal: two out of three */
      ['tmr1.ABN', [[g1.bx + 405, g1.p(2)], [Z(1395), g1.p(2)], [Z(1395), 477], [Z(1564), 477]]],
      ['tmr2.ABN', [[g2.bx + 405, g2.p(2)], [Z(1478), g2.p(2)], [Z(1478), 499], [Z(1564), 499]]],
      ['tmr3.ABN', [[g3.bx + 405, g3.p(2)], [Z(1500), g3.p(2)], [Z(1500), 520], [Z(1564), 520]]],
      ['td2', [[Z(1716), 170], [Z(2050), 170]], 1],
      ['td2', [[Z(1778), 170], [Z(1778), 360], [Z(2041), 360]], 1],
      ['td2', [[Z(1778), 264], [Z(2049), 264]], 1],
      ['v2o3', [[Z(1650), 477], [Z(2048), 477]]],
      ['v2o3', [[Z(1775), 477], [Z(1775), 679], [Z(2038), 679]]],
      ['v2o3', [[Z(1775), 573], [Z(2047), 573]]]
    ],
    t: [
      ...t,
      [Z(1487), 157, 'TRIPLE DETECTOR2'],
      [Z(1487), 178, 'IN A'],
      [Z(1487), 199, 'IN B'],
      [Z(1487), 221, 'IN C'],
      [Z(1487), 242, 'DEV'],
      [Z(1678), 178, 'OUT'],
      [Z(1678), 199, 'DEV'],
      [Z(1578), 261, 'A003'],
      [Z(1561), 287, '(LME113)'],
      [Z(1517), 327, 'TP:1.0'],
      [Z(1517), 348, 'TP:1.0'],
      [Z(1517), 370, 'TP:1.0'],
      [Z(1585), 467, '2OO3'],
      [Z(1569), 488, 'IN1'],
      [Z(1612), 488, 'OUT'],
      [Z(1569), 510, 'IN2'],
      [Z(1569), 531, 'IN3'],
      [Z(1595), 550, '014'],
      [Z(1569), 576, '(LME120)'],
      [Z(1848), 143, o.out[0]],
      [Z(1848), 165, o.out[1]],
      [Z(1847), 239, o.out[0]],
      [Z(1847), 260, o.out[1]],
      [Z(1846), 335, o.out[0]],
      [Z(1846), 356, o.out[1]],
      [Z(1846), 452, o.out[0]],
      [Z(1846), 473, o.out[2]],
      [Z(1845), 548, o.out[0]],
      [Z(1845), 569, o.out[2]],
      [Z(1844), 654, o.out[0]],
      [Z(1844), 675, o.out[2]],
      ...o.foot
    ]
  };
  };
  if (typeof window !== 'undefined') window.TCE_LIB = { di, tmr };
})();
