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
     out [line 1, line 2, line 2 of abnormal, line 1 of abnormal when it differs], over (a line over those words), refA, refA1, refC (sheets of C1, C2, C3), cl (their letter when it is not C), c1via ([y, x] of the step the line of C1 makes on its way down), refB1, dy2 (the 2OO3 and its outputs stand that much lower); without cs the sheet has no C1, C2, C3 at the right, sh (the numbers of the input sheets), cs [[x of the branch, y] of C1, C2, C3], cx (x of C1), dx / dr (the left part and the right
     part stand that far from where sheet TCE060 has them), foot (the words of the foot line). Returns the sheet. */
  const tmr = o => {
  const F = o.f,
    dx = o.dx || 0,
    dr = o.dr || 0,
    [C1, C2, C3] = o.cs || [[0, 0], [0, 0], [1436 + (o.dr || 0), null]],
    RC = o.refC || ['TCT200', 'TCT200', 'TCT200'],
    SH = o.sh || ['070', '072', '074'],
    CL = o.cl || 'C',
    u = (F[2] - F[0]) / 1000,
    c = [],
    b = [],
    m = [],
    w = [],
    t = [];
  /* [letter, top of the block, left of the block, x of the connectors, sheet number of the inputs, block number, first mark number list] */
  const G = [
    ['A', 123, 885 + dx, 307 + dx, SH[0], 'A002', ['001', '005', '007', '009', '010', '011']],
    ['B', 570, 882 + dx, 304 + dx, SH[1], 'A020', ['019', '022', '023', '024', '025', '026']],
    ['C', 1017, 880 + dx, 302 + dx, SH[2], 'A030', ['029', '031', '032', '033', '034', '035']]
  ];
  const L = ['SIG1', 'ERR1', 'SIG2', 'ERR2', 'SIG3', 'ERR3', 'HL', 'LL', 'DEV', 'SIM'],
    R = ['OUT', '', 'ABN', '', 'DEV E', '', 'ERR', '', '', ''],
    pin = (top, i) => Math.round(top + 15 * u + (i + 0.5) * ((381 - 30 * u) / 10)),
    BEND = [0, 659, 680, 701, 722, 743].map(x => x + dx);
  /* A sheet where each block reads one signal for its three inputs (and one error for its three error inputs), and the signal also leaves by
     C1, C2, C3 at the left: o.single = [[x of the branch to C, x of C, how far C stands under the signal] for each block], o.inref = the sheet of
     the inputs of each block, o.cref = the sheets of C1, C2, C3. */
  const single = (ch, g, p, bx, cx, marks) => {
    const [xj, xc, dyc] = o.single[g],
      ks = 'i' + ch + 'S',
      ke = 'i' + ch + 'E',
      y = p(0),
      ye = y + 53,
      xs = bx - 55,
      xe = bx - 32,
      [over, name] = o.name(ch, true),
      [overE, nameE] = o.name(ch, false);
    c.push(
      [ks, 'in', o.let[0], cx, y, name, [o.inref[g]], 1],
      [ke, 'in', o.let[1], cx, ye, nameE, [o.inref[g]], 1],
      ['oC' + (g + 1), 'out', 'C' + (g + 1), xc, y + dyc, '', [], 1]
    );
    /* the sheets of C stand under it, each a little more to the right, as the drawing has them (beside it they would lie on the lines) */
    o.cref.forEach((r, i) => t.push([xc - 52 + 5 * i, y + dyc + 33 + 21 * i, '(' + r + ')']));
    if (over) t.push([cx + 33, y - 32, over]);
    if (overE) t.push([cx + 33, ye - 32, overE]);
    b.push(['mk' + ch + 'S', 'o:FTR', marks[0], cx + 321, y], ['mk' + ch + 'E', 'o:BTR', marks[1], cx + 321, ye]);
    w.push(
      [ks, [[cx + 27, y], [bx, y]], 1],
      [ks, [[xj, y], [xj, y + dyc], [xc - 27, y + dyc]], 1],
      [ks, [[xs, y], [xs, p(4)], [bx, p(4)]], 1],
      [ks, [[xs, p(2)], [bx, p(2)]], 1],
      [ke, [[cx + 27, ye], [BEND[1], ye], [BEND[1], p(1)], [bx, p(1)]]],
      [ke, [[xe, p(1)], [xe, p(5)], [bx, p(5)]]],
      [ke, [[xe, p(3)], [bx, p(3)]]]
    );
  };
  const P = G.map(([ch, top, bx, cx, sh, no, marks], g) => {
    const k = 'tmr' + (g + 1),
      p = i => pin(top, i);
    m.push([k, 'TMR AI DIAGNOSTICS', o.tags ? o.tags[g] : o.tag + '-' + (g + 1), bx, top, 405, 381, L, R, no, [
      [bx + 90, top + 225, 'TP:1.0'],
      [bx + 90, top + 246, 'TP:1.0'],
      [bx + 90, top + 267, 'TP:1.0'],
      [bx + 84, top + 288, 'DELAY TP:3.0s'],
      [bx + 84, top + 310, 'DELAY TP:3.0s'],
      [bx + 84, top + 331, 'DELAY TP:3.0s'],
      [bx + 105, top + 404, '(LME111)'],
      [bx + 217, top + 404, '(LME111A)']
    ]]);
    if (o.single) single(ch, g, p, bx, cx, marks);
    else for (let i = 0; i < 6; i++) {
      const sig = i % 2 === 0,
        key = 'i' + ch + (i + 1),
        y = p(0) + Math.round(i * 53.3),
        n = Math.floor(i / 2) + 1;
      const [over, name] = o.name(ch, sig, n);
      c.push([key, 'in', (o.lets ? o.lets[g] : o.let)[sig ? 0 : 1], cx, y, name, [sh ? 'TCP' + n + sh : '-'], 1]);
      if (over) t.push([cx + 33, y - 32, over]);
      b.push(['mk' + ch + (i + 1), sig ? 'o:FTR' : 'o:BTR', marks[i], cx + 321, y]);
      w.push([key, i ? [[cx + 27, y], [BEND[i], y], [BEND[i], p(i)], [bx, p(i)]] : [[cx + 27, y], [bx, y]], sig ? 1 : 0]);
    }
    return { k, p, bx };
  });
  const [g1, g2, g3] = P;
  const X = x => x + dx,
    Z = x => x + dr,
    Y2 = y => y + (o.dy2 || 0);
  /* the lines of C1, C2, C3: a y of null = level with the output of the third block. A sheet can send them to D1, D2, D3 too
     (o.ds: [x of the branch, [y of D1, D2, D3], [x of D1, D2, D3], sheet]) and write their name over them (o.cname(ch) => [line 1, line 2], at x o.cnx). */
  const CY = [C1[1], C2[1], C3[1] == null ? g3.p(0) : C3[1]],
    cd = o.cdbl === 0 ? 0 : 1,
    xc = [],
    xw = [],
    xt = [];
  if (o.ds)
    o.ds[1].forEach((y, i) => {
      xc.push(['oD' + (i + 1), 'out', 'D' + (i + 1), o.ds[2][i], y, '', [o.ds[3]], 1]);
      xw.push(['tmr' + (i + 1) + '.OUT', [[o.ds[0], CY[i]], [o.ds[0], y], [o.ds[2][i] - 27, y]], 1]);
    });
  if (o.cname)
    ['A', 'B', 'C'].forEach((ch, i) => {
      const n = o.cname(ch);
      xt.push([o.cnx, CY[i] - 27, n[0]], [o.cnx, CY[i] - 6, n[1]]);
    });
  /* a third line over the words of the six outputs (o.over) */
  if (o.over)
    [[1848, 122], [1847, 218], [1846, 314], [1846, 431], [1845, 527], [1844, 633]].forEach((q, i) => xt.push([Z(q[0]), i > 2 ? Y2(q[1]) : q[1], o.over]));
  /* what one sheet has beside the pattern: o.extra = { k, c, d, b, w, t } in the format of a sheet */
  const EX = o.extra || {};
  const straight = P => P.filter((q, i) => !i || q[0] !== P[i - 1][0] || q[1] !== P[i - 1][1]);
  const S = {
    id: o.id,
    title: o.title,
    page: o.page,
    ctl: 'EHG+MD',
    cycle: 30,
    f: F,
    k: EX.k || [],
    c: [
      ...c,
      ...(EX.c || []),
      ['oA', 'out', 'A', Z(2077), 170, '', o.refA],
      ['oA1', 'out', 'A1', Z(2076), 264, '', o.refA1, 1],
      ['oB', 'out', 'B', Z(2075), Y2(477), '', ['-']],
      ['oB1', 'out', 'B1', Z(2074), Y2(573), '', o.refB1 || ['-'], 1],
      ...(o.cs
        ? [
            ['oC1', 'out', CL + '1', o.cx, CY[0], '', [].concat(RC[0]), cd],
            ['oC2', 'out', CL + '2', o.cx - 1, CY[1], '', [].concat(RC[1]), cd],
            ['oC3', 'out', CL + '3', o.cx - 1, CY[2], '', [].concat(RC[2]), cd]
          ]
        : []),
      ...xc
    ],
    d: [
      ...(EX.d || []),
      ['crtPv', Z(2076), 360, 'out', o.tag + '_PV', 'S', '#1C'],
      ['crtAbn', Z(2073), Y2(679), 'out', o.tagAbn || o.tag + '_PVQ', 'S', '#1C']
    ],
    r: [
      ['td2', Z(1481), 136, 235, 128, ''],
      ['v2o3', Z(1564), Y2(445), 86, 107, '']
    ],
    m,
    b: [
      ...b,
      ...(EX.b || []),
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
      ['btr041', 'o:BTR', '041', Z(1744), Y2(477)],
      ['btr015', 'o:BTR', '015', Z(1818), Y2(477)],
      ['btr016', 'o:BTR', '016', Z(1817), Y2(573)],
      ['btr021', 'o:BTR', '021', Z(1816), Y2(679)]
    ],
    w: [
      ...w,
      ...(EX.w || []),
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
      ...(o.cs ? [['tmr2.OUT', [[C2[0], g2.p(0)], [C2[0], CY[1]], [o.cx - 28, CY[1]]], 1]] : []),
      ...(!o.cs ? [] : [[
      'tmr1.OUT', o.c1via ? [[C1[0], 170], [C1[0], o.c1via[0]], [o.c1via[1], o.c1via[0]], [o.c1via[1], CY[0]], [o.cx - 27, CY[0]]] : [[C1[0], 170], [C1[0], CY[0]], [o.cx - 27, CY[0]]], 1]]),
      ['tmr2.OUT', [[g2.bx + 405, g2.p(0)], [Z(1414), g2.p(0)], [Z(1414), 191], [Z(1481), 191]], 1],
      ['tmr3.OUT', o.cs ? straight([[g3.bx + 405, g3.p(0)], [C3[0], g3.p(0)], [C3[0], CY[2]], [o.cx - 28, CY[2]]]) : [[g3.bx + 405, g3.p(0)], [Z(1436), g3.p(0)]], 1],
      ...xw,
      ['tmr3.OUT', [[Z(1436), g3.p(0)], [Z(1436), 212], [Z(1481), 212]], 1],
      /* abnormal: two out of three */
      ['tmr1.ABN', [[g1.bx + 405, g1.p(2)], [Z(1395), g1.p(2)], [Z(1395), Y2(477)], [Z(1564), Y2(477)]]],
      ['tmr2.ABN', [[g2.bx + 405, g2.p(2)], [Z(1478), g2.p(2)], [Z(1478), Y2(499)], [Z(1564), Y2(499)]]],
      ['tmr3.ABN', [[g3.bx + 405, g3.p(2)], [Z(1500), g3.p(2)], [Z(1500), Y2(520)], [Z(1564), Y2(520)]]],
      ['td2', [[Z(1716), 170], [Z(2050), 170]], 1],
      ['td2', [[Z(1778), 170], [Z(1778), 360], [Z(2041), 360]], 1],
      ['td2', [[Z(1778), 264], [Z(2049), 264]], 1],
      ['v2o3', [[Z(1650), Y2(477)], [Z(2048), Y2(477)]]],
      ['v2o3', [[Z(1775), Y2(477)], [Z(1775), Y2(679)], [Z(2038), Y2(679)]]],
      ['v2o3', [[Z(1775), Y2(573)], [Z(2047), Y2(573)]]]
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
      [Z(1585), Y2(467), '2OO3'],
      [Z(1569), Y2(488), 'IN1'],
      [Z(1612), Y2(488), 'OUT'],
      [Z(1569), Y2(510), 'IN2'],
      [Z(1569), Y2(531), 'IN3'],
      [Z(1595), Y2(550), '014'],
      [Z(1569), Y2(576), '(LME120)'],
      [Z(1848), 143, o.out[0]],
      [Z(1848), 165, o.out[1]],
      [Z(1847), 239, o.out[0]],
      [Z(1847), 260, o.out[1]],
      [Z(1846), 335, o.out[0]],
      [Z(1846), 356, o.out[1]],
      [Z(1846), Y2(452), o.out[3] || o.out[0]],
      [Z(1846), Y2(473), o.out[2]],
      [Z(1845), Y2(548), o.out[3] || o.out[0]],
      [Z(1845), Y2(569), o.out[2]],
      [Z(1844), Y2(654), o.out[3] || o.out[0]],
      [Z(1844), Y2(675), o.out[2]],
      ...xt,
      ...(EX.t || []),
      ...o.foot
    ]
  };
  /* A sheet where the value of each block goes straight out, with no TRIPLE DETECTOR2 and no 2OO3 (the shaft vibrations):
     o.direct = [[letter, sheets of the first output, sheets of the second, [line 1, line 2] of their name, [four mark numbers]] for each block]; lets = the letters of the inputs for each block when they differ, a sheet number of null in sh = a spare block.
     The right part of the pattern is taken away and each block gets its two outputs. */
  if (o.direct) {
    S.c = S.c.filter(x => !/^o[AB]1?$/.test(x[0]));
    S.d = [];
    S.r = [];
    S.b = S.b.filter(x => !/^(ftr03[89]|btr04[0136]|ftr04[245]|ftr00[468]|btr01[56]|btr021)$/.test(x[0]));
    S.w = S.w.filter(x => !/^(td2|v2o3|tmr\d\.(OUT|ABN))$/.test(x[0]) && !(x[0] === 'sg027' && x[1].length === 4));
    S.t = S.t.filter(x => x[0] < Z(1480));
    o.direct.forEach(([ch, r1, r2, nm, mk], g) => {
      const G = [g1, g2, g3][g],
        y = G.p(0),
        y2 = y + 96;
      S.c.push(['o' + ch, 'out', ch, Z(2079), y, '', r1], ['o' + ch + '1', 'out', ch + '1', Z(2078), y2, '', r2, 1]);
      S.b.push(
        ['mk' + g + 'a', 'o:FTR', mk[0], Z(1377), y],
        ['mk' + g + 'b', 'o:FTR', mk[1], Z(1750), y],
        ['mk' + g + 'c', 'o:FTR', mk[2], Z(1824), y],
        ['mk' + g + 'd', 'o:FTR', mk[3], Z(1823), y2]
      );
      S.w.push(['tmr' + (g + 1) + '.OUT', [[G.bx + 405, y], [Z(2052), y]], 1], ['tmr' + (g + 1) + '.OUT', [[Z(1781), y], [Z(1781), y2], [Z(2051), y2]], 1]);
      /* the name of the two outputs: one pair of lines for both, or [lines of the first, lines of the second]; the last line stands on the wire */
      const two = Array.isArray(nm[0]) ? nm : [nm, nm];
      two[0].forEach((s, i) => S.t.push([Z(1850), y - 6 - 21 * (two[0].length - 1 - i), s]));
      two[1].forEach((s, i) => S.t.push([Z(1849), y2 - 6 - 21 * (two[1].length - 1 - i), s]));
    });
  }
  return S;
  };
  /* TCE_LIB.did(o): a sheet DIGITAL INPUT SIGNAL DIAGNOSTICS. Four signals, each read by the three protection controllers and checked by one
     TRIPPLE INPUT DIAGNOSTICS block (the drawing spells it so); OUT goes to a lamp of the operator station and to a connector, DEV E (input
     error) to a connector and to one OR for the four (INPUT DISCREPANCY). A sheet gives what differs:
     o.id, title, page, f, tops [top of each block], g [[name, input letter, output letter, [three input marks], [three output marks], block number,
     lamp tag] for each block], line2 (second line of every name), or [block number, mark number], e [letter, [sheets]], last (mark number of the
     input error of the fourth block), foot. Returns the sheet. */
  const did = o => {
    const u = (o.f[2] - o.f[0]) / 1000,
      BX = 866,
      BW = 407,
      BH = 226,
      pin = (top, i) => Math.round(top + 15 * u + (i + 0.5) * ((BH - 30 * u) / 5)),
      c = [],
      d = [],
      b = [],
      m = [],
      w = [],
      t = [],
      /* the OR of the four input errors: its four inputs, top to bottom, and where each line comes down */
      OY = [1141, 1161, 1182, 1204],
      OX = [1485, 1432, 1379, 1303],
      OL = 1540;
    o.g.forEach(([name, il, ol, im, om, no, tag], g) => {
      const top = o.tops[g],
        k = 'tid' + (g + 1),
        p = i => pin(top, i),
        last = g === 3,
        ye = last ? 1237 : p(4);
      m.push([k, 'TRIPPLE INPUT DIAGNOSTICS', '', BX, top, BW, BH, ['IN1', '', 'IN2', '', 'IN3'], ['OUT', '', '', '', 'DEV E'], no, [
        [BX + 90, top + 172, 'TP:3.0'],
        [BX + 105, top + 246, '(LME105)']
      ]]);
      ['TCP1050', 'TCP2050', 'TCP3050'].forEach((r, i) => {
        const key = 'i' + (g + 1) + (i + 1),
          y = p(2 * i);
        c.push([key, 'in', il, 280, y, o.line2, [r], 1]);
        t.push([313, y - 32, name]);
        b.push(['mi' + (g + 1) + (i + 1), 'o:BTR', im[i], 709, y]);
        w.push([key, [[307, y], [BX, y]]]);
      });
      /* OUT: the lamp and the connector */
      d.push(['crt' + (g + 1), 2105, p(0), 'out', tag, 'S', '#1C']);
      c.push(['o' + ol, 'out', ol, 2103, p(0) + 64, '', ['-']], ['o' + ol + '1', 'out', ol + '1', 2092, ye, '', ['-']]);
      b.push(['mo' + (g + 1) + 'a', 'o:BTR', om[0], 1657, p(0)], ['mo' + (g + 1) + 'b', 'o:BTR', om[1], 1657, p(0) + 64], ['mo' + (g + 1) + 'c', 'o:BTR', om[2], last ? 1655 : 1647, ye]);
      w.push([k + '.OUT', [[BX + BW, p(0)], [2070, p(0)]]], [k + '.OUT', [[1539, p(0)], [1539, p(0) + 64], [2076, p(0) + 64]]]);
      t.push([1716, p(0) - 27, name], [1716, p(0) - 6, o.line2], [1716, p(0) + 37, name], [1716, p(0) + 58, o.line2], [last ? 1713 : 1704, ye - 27, name], [last ? 1713 : 1704, ye - 6, o.line2 + ' INPUT ERROR']);
      /* DEV E: the connector and the OR */
      if (last) w.push([k + '.DEV E', [[BX + BW, p(4)], [OX[3], p(4)], [OX[3], ye], [2065, ye]]], [k + '.DEV E', [[OX[3], OY[3]], [OL, OY[3]]]]);
      else w.push([k + '.DEV E', [[BX + BW, ye], [2065, ye]]], [k + '.DEV E', [[OX[g], ye], [OX[g], OY[g]], [OL, OY[g]]]]);
    });
    b.push(['or', 'OR', o.or[0], 1569, 1172, [], {}, [58, 85]], ['mor', 'o:BTR', o.or[1], 1656, OY[0]]);
    c.push(['oE', 'out', o.e[0], 2102, OY[0], '', o.e[1]]);
    w.push(['or', [[1598, OY[0]], [2075, OY[0]]]]);
    t.push([1714, OY[0] - 6, 'INPUT DISCREPANCY'], ...o.foot);
    return { id: o.id, title: o.title, page: o.page, ctl: 'EHG+MD', cycle: 30, f: o.f, c, d, b, m, w, t };
  };
  if (typeof window !== 'undefined') window.TCE_LIB = { di, tmr, did };
})();
