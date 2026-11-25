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
      t.push(
        [x0 + 6, name[1] ? top + 27 : top + 30, name[0]],
        [x0 + 6, top + 49, name[1]],
        [x0, top + 76, 'DI'],
        [xe + 137, top - 2, '(' + o.table + '-' + (o.first + n) + ')']
      );
      w.push(
        [
          'di' + no,
          [
            [xe, y],
            [xe + 118, y]
          ],
          1
        ],
        [
          'di' + no,
          [
            [xe + 134, y],
            [xo - 30, y]
          ]
        ]
      );
      if (rb) {
        w.push([
          'di' + no,
          [
            [xj, y],
            [xj, by],
            [xo - 30, by]
          ]
        ]);
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
      w.push([
        'pioErr',
        [
          [x + ew, y + 11],
          [xf - 30, y + 11]
        ]
      ]);
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
      [C1, C2, C3] = o.cs || [
        [0, 0],
        [0, 0],
        [1436 + (o.dr || 0), null]
      ],
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
        [
          ks,
          [
            [cx + 27, y],
            [bx, y]
          ],
          1
        ],
        [
          ks,
          [
            [xj, y],
            [xj, y + dyc],
            [xc - 27, y + dyc]
          ],
          1
        ],
        [
          ks,
          [
            [xs, y],
            [xs, p(4)],
            [bx, p(4)]
          ],
          1
        ],
        [
          ks,
          [
            [xs, p(2)],
            [bx, p(2)]
          ],
          1
        ],
        [
          ke,
          [
            [cx + 27, ye],
            [BEND[1], ye],
            [BEND[1], p(1)],
            [bx, p(1)]
          ]
        ],
        [
          ke,
          [
            [xe, p(1)],
            [xe, p(5)],
            [bx, p(5)]
          ]
        ],
        [
          ke,
          [
            [xe, p(3)],
            [bx, p(3)]
          ]
        ]
      );
    };
    const P = G.map(([ch, top, bx, cx, sh, no, marks], g) => {
      const k = 'tmr' + (g + 1),
        p = i => pin(top, i);
      m.push([
        k,
        'TMR AI DIAGNOSTICS',
        o.tags ? o.tags[g] : o.tag + '-' + (g + 1),
        bx,
        top,
        405,
        381,
        L,
        R,
        no,
        [
          [bx + 90, top + 225, 'TP:1.0'],
          [bx + 90, top + 246, 'TP:1.0'],
          [bx + 90, top + 267, 'TP:1.0'],
          [bx + 84, top + 288, 'DELAY TP:3.0s'],
          [bx + 84, top + 310, 'DELAY TP:3.0s'],
          [bx + 84, top + 331, 'DELAY TP:3.0s'],
          [bx + 105, top + 404, '(LME111)'],
          [bx + 217, top + 404, '(LME111A)']
        ]
      ]);
      if (o.single) single(ch, g, p, bx, cx, marks);
      else
        for (let i = 0; i < 6; i++) {
          const sig = i % 2 === 0,
            key = 'i' + ch + (i + 1),
            y = p(0) + Math.round(i * 53.3),
            n = Math.floor(i / 2) + 1;
          const [over, name] = o.name(ch, sig, n);
          c.push([key, 'in', (o.lets ? o.lets[g] : o.let)[sig ? 0 : 1], cx, y, name, [sh ? 'TCP' + n + sh : '-'], 1]);
          if (over) t.push([cx + 33, y - 32, over]);
          b.push(['mk' + ch + (i + 1), sig ? 'o:FTR' : 'o:BTR', marks[i], cx + 321, y]);
          w.push([
            key,
            i
              ? [
                  [cx + 27, y],
                  [BEND[i], y],
                  [BEND[i], p(i)],
                  [bx, p(i)]
                ]
              : [
                  [cx + 27, y],
                  [bx, y]
                ],
            sig ? 1 : 0
          ]);
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
        xw.push([
          'tmr' + (i + 1) + '.OUT',
          [
            [o.ds[0], CY[i]],
            [o.ds[0], y],
            [o.ds[2][i] - 27, y]
          ],
          1
        ]);
      });
    if (o.cname)
      ['A', 'B', 'C'].forEach((ch, i) => {
        const n = o.cname(ch);
        xt.push([o.cnx, CY[i] - 27, n[0]], [o.cnx, CY[i] - 6, n[1]]);
      });
    /* a third line over the words of the six outputs (o.over) */
    if (o.over)
      [
        [1848, 122],
        [1847, 218],
        [1846, 314],
        [1846, 431],
        [1845, 527],
        [1844, 633]
      ].forEach((q, i) => xt.push([Z(q[0]), i > 2 ? Y2(q[1]) : q[1], o.over]));
    /* what one sheet has beside the pattern: o.extra = { k, c, d, b, w, t } in the format of a sheet */
    const EX = o.extra || {};
    const straight = P => P.filter((q, i) => !i || q[0] !== P[i - 1][0] || q[1] !== P[i - 1][1]);
    const S = {
      id: o.id, pr: o.pr,
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
      /* the TRIPLE DETECTOR2 (LME113) of the three values and the 2OO3 (LME120) of the three abnormal signals: macro blocks of the sheet */
      m: [
        ...m,
        [
          'td2',
          'TRIPLE DETECTOR2',
          '',
          Z(1481),
          136,
          235,
          128,
          ['IN A', 'IN B', 'IN C', 'DEV'],
          ['OUT', 'DEV'],
          'A003',
          [
            [Z(1561), 287, '(LME113)'],
            [Z(1517), 327, 'TP:1.0'],
            [Z(1517), 348, 'TP:1.0'],
            [Z(1517), 370, 'TP:1.0']
          ],
          [
            [170, 191, 212, 233],
            [170, 191]
          ]
        ],
        [
          'v2o3',
          '2OO3',
          '',
          Z(1564),
          Y2(445),
          86,
          107,
          ['IN1', 'IN2', 'IN3'],
          ['OUT'],
          '014',
          [[Z(1569), Y2(576), '(LME120)']],
          [
            [Y2(477), Y2(499), Y2(520)],
            [Y2(477)]
          ]
        ]
      ],
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
        [
          'sg012',
          [
            [X(591), 467],
            [X(775), 467]
          ],
          1
        ],
        [
          'sg012',
          [
            [X(775), g1.p(6)],
            [X(775), g3.p(6)],
            [g3.bx, g3.p(6)]
          ],
          1
        ],
        [
          'sg012',
          [
            [X(775), g1.p(6)],
            [g1.bx, g1.p(6)]
          ],
          1
        ],
        [
          'sg012',
          [
            [X(775), g2.p(6)],
            [g2.bx, g2.p(6)]
          ],
          1
        ],
        [
          'sg017',
          [
            [X(592), 541],
            [X(796), 541]
          ],
          1
        ],
        [
          'sg017',
          [
            [X(796), g1.p(7)],
            [X(796), g3.p(7)],
            [g3.bx, g3.p(7)]
          ],
          1
        ],
        [
          'sg017',
          [
            [X(796), g1.p(7)],
            [g1.bx, g1.p(7)]
          ],
          1
        ],
        [
          'sg017',
          [
            [X(796), g2.p(7)],
            [g2.bx, g2.p(7)]
          ],
          1
        ],
        [
          'sg027',
          [
            [X(590), 911],
            [X(817), 911]
          ],
          1
        ],
        [
          'sg027',
          [
            [X(817), g1.p(8)],
            [X(817), g3.p(8)],
            [g3.bx, g3.p(8)]
          ],
          1
        ],
        [
          'sg027',
          [
            [X(817), g1.p(8)],
            [g1.bx, g1.p(8)]
          ],
          1
        ],
        [
          'sg027',
          [
            [X(817), g2.p(8)],
            [g2.bx, g2.p(8)]
          ],
          1
        ],
        [
          'sg027',
          [
            [X(817), 988],
            [Z(1459), 988],
            [Z(1459), 233],
            [Z(1481), 233]
          ],
          1
        ],
        [
          'sg036',
          [
            [X(587), 1393],
            [X(838), 1393],
            [X(838), g1.p(9)],
            [g1.bx, g1.p(9)]
          ],
          1
        ],
        [
          'sg036',
          [
            [X(838), g2.p(9)],
            [g2.bx, g2.p(9)]
          ],
          1
        ],
        [
          'sg036',
          [
            [X(838), g3.p(9)],
            [g3.bx, g3.p(9)]
          ],
          1
        ],
        /* the three values to TRIPLE DETECTOR2 and to the turbine supervisory sheets */
        [
          'tmr1.OUT',
          [
            [g1.bx + 405, 170],
            [Z(1481), 170]
          ],
          1
        ],
        ...(o.cs
          ? [
              [
                'tmr2.OUT',
                [
                  [C2[0], g2.p(0)],
                  [C2[0], CY[1]],
                  [o.cx - 28, CY[1]]
                ],
                1
              ]
            ]
          : []),
        ...(!o.cs
          ? []
          : [
              [
                'tmr1.OUT',
                o.c1via
                  ? [
                      [C1[0], 170],
                      [C1[0], o.c1via[0]],
                      [o.c1via[1], o.c1via[0]],
                      [o.c1via[1], CY[0]],
                      [o.cx - 27, CY[0]]
                    ]
                  : [
                      [C1[0], 170],
                      [C1[0], CY[0]],
                      [o.cx - 27, CY[0]]
                    ],
                1
              ]
            ]),
        [
          'tmr2.OUT',
          [
            [g2.bx + 405, g2.p(0)],
            [Z(1414), g2.p(0)],
            [Z(1414), 191],
            [Z(1481), 191]
          ],
          1
        ],
        [
          'tmr3.OUT',
          o.cs
            ? straight([
                [g3.bx + 405, g3.p(0)],
                [C3[0], g3.p(0)],
                [C3[0], CY[2]],
                [o.cx - 28, CY[2]]
              ])
            : [
                [g3.bx + 405, g3.p(0)],
                [Z(1436), g3.p(0)]
              ],
          1
        ],
        ...xw,
        [
          'tmr3.OUT',
          [
            [Z(1436), g3.p(0)],
            [Z(1436), 212],
            [Z(1481), 212]
          ],
          1
        ],
        /* abnormal: two out of three */
        [
          'tmr1.ABN',
          [
            [g1.bx + 405, g1.p(2)],
            [Z(1395), g1.p(2)],
            [Z(1395), Y2(477)],
            [Z(1564), Y2(477)]
          ]
        ],
        [
          'tmr2.ABN',
          [
            [g2.bx + 405, g2.p(2)],
            [Z(1478), g2.p(2)],
            [Z(1478), Y2(499)],
            [Z(1564), Y2(499)]
          ]
        ],
        [
          'tmr3.ABN',
          [
            [g3.bx + 405, g3.p(2)],
            [Z(1500), g3.p(2)],
            [Z(1500), Y2(520)],
            [Z(1564), Y2(520)]
          ]
        ],
        [
          'td2.OUT',
          [
            [Z(1716), 170],
            [Z(2050), 170]
          ],
          1
        ],
        [
          'td2.OUT',
          [
            [Z(1778), 170],
            [Z(1778), 360],
            [Z(2041), 360]
          ],
          1
        ],
        [
          'td2.OUT',
          [
            [Z(1778), 264],
            [Z(2049), 264]
          ],
          1
        ],
        [
          'v2o3.OUT',
          [
            [Z(1650), Y2(477)],
            [Z(2048), Y2(477)]
          ]
        ],
        [
          'v2o3.OUT',
          [
            [Z(1775), Y2(477)],
            [Z(1775), Y2(679)],
            [Z(2038), Y2(679)]
          ]
        ],
        [
          'v2o3.OUT',
          [
            [Z(1775), Y2(573)],
            [Z(2047), Y2(573)]
          ]
        ]
      ],
      t: [
        ...t,
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
      S.m = S.m.filter(x => !/^(td2|v2o3)$/.test(x[0]));
      S.b = S.b.filter(x => !/^(ftr03[89]|btr04[0136]|ftr04[245]|ftr00[468]|btr01[56]|btr021)$/.test(x[0]));
      S.w = S.w.filter(x => !/^(td2|v2o3)(\.OUT)?$/.test(x[0]) && !/^(tmr\d\.(OUT|ABN))$/.test(x[0]) && !(x[0] === 'sg027' && x[1].length === 4));
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
        S.w.push(
          [
            'tmr' + (g + 1) + '.OUT',
            [
              [G.bx + 405, y],
              [Z(2052), y]
            ],
            1
          ],
          [
            'tmr' + (g + 1) + '.OUT',
            [
              [Z(1781), y],
              [Z(1781), y2],
              [Z(2051), y2]
            ],
            1
          ]
        );
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
     lamp tag, sheets of the output connector, sheets of the three inputs, { el: tag of a lamp for the input error (the connector then stands under it, with the fourth output mark), two: [letter, sheets] of a second connector of OUT in place of the lamp, ey: how much lower than DEV E the input error goes out, dbl: 1 = the connector of OUT has a double line and its sheets under it (2 = a double line, its sheets beside it), third: [letter, sheets] of a double-line connector under the input error, fed from the wire of the connector of OUT, src: [letter, sheets] of a connector from another sheet that feeds the lamp and the connector in place of OUT, ex: where the lower or higher input error turns, conn: 1 = OUT goes to its connector only (no lamp), up: [letter, sheets] of a double-line connector over the lamp, en: the letter of the connector of the input error when it is not the output letter + '1' }] for each block], line2 (second line of every name), or [block number, mark number], e [letter, [sheets]], extra { c, d, b, w, t } (more of each), single 1 = the input connectors have a single line, orName = the name of the output of the OR when it is not INPUT DISCREPANCY, last (mark number of the
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
    o.g.forEach(([name, il, ol, im, om, no, tag, ref, ir, x = {}], g) => {
      const top = o.tops[g],
        k = 'tid' + (g + 1),
        p = i => pin(top, i),
        last = g === 3,
        ye = last ? (x.el ? 1249 : 1237) : p(4) + (x.ey || 0),
        ex = last ? 1655 : 1647,
        /* the names: one name for the whole block (with o.line2 under it), or { in: [lines of each input], out: [lines of the lamp, of the connector,
           of the input error] } as the drawing prints them; the last line of a name stands on its wire */
        nm =
          typeof name === 'string'
            ? {
                in: [0, 1, 2].map(() => [name, o.line2]),
                out: [
                  [name, o.line2],
                  [name, o.line2],
                  [name, o.line2 + ' INPUT ERROR']
                ]
              }
            : name,
        lines = (L, x, y) => L.forEach((s, j) => t.push([x, y - 6 - 21 * (L.length - 1 - j), s]));
      m.push([
        k,
        'TRIPPLE INPUT DIAGNOSTICS',
        '',
        BX,
        top,
        BW,
        BH,
        ['IN1', '', 'IN2', '', 'IN3'],
        ['OUT', '', '', '', 'DEV E'],
        no,
        [
          [BX + 90, top + 172, 'TP:3.0'],
          [BX + 105, top + 246, '(LME105)']
        ]
      ]);
      (ir || ['TCP1050', 'TCP2050', 'TCP3050']).forEach((r, i) => {
        const key = 'i' + (g + 1) + (i + 1),
          y = p(2 * i);
        const N = nm.in[i];
        c.push([key, 'in', il, 280, y, N[N.length - 1], [r], o.single ? 0 : 1]);
        /* the lines of the name over the last one, which the connector prints on the wire */
        for (let j = 0; j < N.length - 1; j++) t.push([313, y - 32 - 21 * (N.length - 2 - j), N[j]]);
        b.push(['mi' + (g + 1) + (i + 1), 'o:BTR', im[i], 709, y]);
        w.push([
          key,
          [
            [307, y],
            [BX, y]
          ]
        ]);
      });
      if (x.two) {
        /* OUT: a connector and, under it, a second one; no lamp */
        c.push(
          ['o' + ol, 'out', ol, 2103, p(0), '', ref || ['-']],
          ['o' + x.two[0], 'out', x.two[0], 2103, p(0) + 56, '', x.two[1], 1, 1]
        );
        b.push(['mo' + (g + 1) + 'a', 'o:BTR', om[0], 1657, p(0)]);
        w.push(
          [
            k + '.OUT',
            [
              [BX + BW, p(0)],
              [2076, p(0)]
            ]
          ],
          [
            k + '.OUT',
            [
              [1963, p(0)],
              [1963, p(0) + 56],
              [2076, p(0) + 56]
            ]
          ]
        );
        lines(nm.out[0], 1722, p(0));
      } else if (x.conn) {
        /* OUT: the connector only, one step lower than OUT */
        c.push(['o' + ol, 'out', ol, 2103, p(0) + 64, '', ref || ['-']]);
        b.push(['mo' + (g + 1) + 'b', 'o:BTR', om[1], 1657, p(0) + 64]);
        w.push([
          k + '.OUT',
          [
            [BX + BW, p(0)],
            [1539, p(0)],
            [1539, p(0) + 64],
            [2076, p(0) + 64]
          ]
        ]);
        lines(nm.out[1], 1716, p(0) + 64);
      } else {
        /* OUT: the lamp and the connector */
        d.push(['crt' + (g + 1), 2105, p(0), 'out', tag, 'S', '#1C']);
        c.push(['o' + ol, 'out', ol, 2103, p(0) + 64, '', ref || ['-'], x.dbl ? 1 : 0, x.dbl === 1 ? 1 : 0]);
        b.push(
          ['mo' + (g + 1) + 'a', 'o:BTR', om[0], 1657, p(0)],
          ['mo' + (g + 1) + 'b', 'o:BTR', om[1], 1657, p(0) + 64]
        );
        /* x.src: the lamp and the connector are fed by a connector from another sheet that stands right of the block; OUT of the block is left open */
        const so = x.src ? 's' + (g + 1) : k + '.OUT';
        if (x.src) c.push([so, 'in', x.src[0], 1340, p(0), '', x.src[1], 0, 1]);
        w.push(
          [
            so,
            [
              [x.src ? 1367 : BX + BW, p(0)],
              [2070, p(0)]
            ]
          ],
          [
            so,
            [
              [1539, p(0)],
              [1539, p(0) + 64],
              [2076, p(0) + 64]
            ]
          ]
        );
        lines(nm.out[0], 1716, p(0));
        lines(nm.out[1], 1716, p(0) + 64);
        /* one more way out, over the lamp: from the dot on OUT up to a double-line connector (x.up = [letter, sheets]) */
        if (x.up) {
          c.push(['o' + x.up[0], 'out', x.up[0], 2103, p(0) - 84, '', x.up[1], 1, 1]);
          w.push([
            so,
            [
              [1539, p(0) + 64],
              [1539, p(0) - 84],
              [2076, p(0) - 84]
            ]
          ]);
        }
        /* a third way out: from the wire of the connector down, past the input error, to a double-line connector */
        if (x.third) {
          c.push(['o' + x.third[0], 'out', x.third[0], 2103, p(0) + 193, '', x.third[1], 1, 1]);
          w.push([
            k + '.OUT',
            [
              [1999, p(0) + 64],
              [1999, p(0) + 193],
              [2076, p(0) + 193]
            ]
          ]);
        }
      }
      /* DEV E: the connector (with x.el a lamp, and the connector under it) and the OR */
      const yc = x.el ? ye + 64 : ye,
        xe = x.el ? 2070 : 2065;
      if (x.el) {
        d.push(['crte' + (g + 1), 2105, ye, 'out', x.el, 'S', '#1C']);
        b.push(['mo' + (g + 1) + 'd', 'o:BTR', om[3], ex, yc]);
        w.push([
          k + '.DEV E',
          [
            [1539, ye],
            [1539, yc],
            [2065, yc]
          ]
        ]);
        lines(nm.out[3] || nm.out[2], last ? 1713 : 1704, yc);
      }
      const en = x.en || ol + '1';
      c.push(['o' + en, 'out', en, 2092, yc, '', ['-']]);
      b.push(['mo' + (g + 1) + 'c', 'o:BTR', om[2], ex, ye]);
      lines(nm.out[2], last ? 1713 : 1704, ye);
      if (last)
        w.push(
          [
            k + '.DEV E',
            [
              [BX + BW, p(4)],
              [OX[3], p(4)],
              [OX[3], ye],
              [xe, ye]
            ]
          ],
          [
            k + '.DEV E',
            [
              [OX[3], OY[3]],
              [OL, OY[3]]
            ]
          ]
        );
      else
        w.push(
          [
            k + '.DEV E',
            x.ey
              ? [
                  [BX + BW, p(4)],
                  [x.ex || 1535, p(4)],
                  [x.ex || 1535, ye],
                  [xe, ye]
                ]
              : [
                  [BX + BW, ye],
                  [xe, ye]
                ]
          ],
          ...(o.noOr
            ? []
            : [
                [
                  k + '.DEV E',
                  [
                    [OX[g], p(4)],
                    [OX[g], OY[g]],
                    [OL, OY[g]]
                  ]
                ]
              ])
        );
    });
    /* a sheet with fewer than four blocks has no OR of the input errors (o.noOr) */
    if (!o.noOr) {
      b.push(['or', 'OR', o.or[0], 1569, 1172, [], {}, [58, 85]], ['mor', 'o:BTR', o.or[1], 1656, OY[0]]);
      c.push(['oE', 'out', o.e[0], 2102, OY[0], '', o.e[1]]);
      w.push([
        'or',
        [
          [1598, OY[0]],
          [2075, OY[0]]
        ]
      ]);
      t.push([1714, OY[0] - 6, o.orName || 'INPUT DISCREPANCY']);
    }
    t.push(...o.foot);
    /* what a sheet has beyond the pattern */
    if (o.extra)
      for (const [A, n] of [
        [c, 'c'],
        [d, 'd'],
        [b, 'b'],
        [w, 'w'],
        [t, 't']
      ])
        A.push(...(o.extra[n] || []));
    return { id: o.id, pr: o.pr, title: o.title, page: o.page, ctl: 'EHG+MD', cycle: 30, f: o.f, c, d, b, m, w, t };
  };
  /* TCE_LIB.aid(o): a sheet INPUT SIGNAL DIAGNOSTICS of single pressure inputs (TCE102, TCE104): on each line a transmitter (the crossed circle),
     the analog input card (the mA/V box, the filled triangle of the PI/O connection, the PI/O error box) and one AI DIAG.MD block with its
     simulation value (SG), its settings and its outputs (the value to connector A.. and, over it, to a double-line connector B..; the abnormal
     signal, lower, to connector D..). o.id, title, page, f, foot, and o.rows = one object for each line:
       y (the line of the signal), lab [two lines of the name], pt (transmitter), rng (range), card, xf / mf (x and number of the mark on the input),
       mx (left edge of the block), tag, foot (number of the block), sg [number, x, how far under the line its middle stands, how far under the
       line its output leaves, x where that turns up, setting], xe (x where the PI/O error turns up), par [HL, LL, DEV HL, DEV LL],
       xj (x of the dot on OUT), dyB (how far over the line connector B stands), bx (its x, 2013 unless given), B / A / D [letter, sheets],
       mo / mb (numbers of the marks on the two outputs), dyD (how far under the line the abnormal signal goes out), abn (the two lines of its
       name when the drawing prints another name than lab + ' ABN.'). Returns the sheet. */
  const aid = o => {
    const r = [],
      b = [],
      c = [],
      w = [],
      t = [],
      l = [],
      tri = [],
      m = [],
      two = (x, y, a, bb) => t.push([x, y - 27, a], [x, y - 6, bb]);
    o.rows.forEach((q, i) => {
      const n = i + 1,
        y = q.y,
        k = 't' + n,
        M = 'm' + n,
        mx = q.mx,
        xr = mx + 235,
        bx = q.bx || 2013,
        [sno, sx, sdy, sdo, sxc, snote] = q.sg;
      /* the transmitter, the card and its PI/O error */
      b.push(['x' + n, 'X', '', 393, y, [], {}, [21]], ['f' + q.mf, 'o:FTR', q.mf, q.xf, y]);
      l.push([
        [414, y],
        [582, y]
      ]);
      r.push([k, 582, y - 12, 52, 24, 'mA/V'], ['pe' + n, 631, y + 30, 125, 23, 'PI/O error']);
      tri.push([728, y, 9]);
      t.push(
        [293, y - 62, q.lab[0]],
        [293, y - 40, q.lab[1]],
        [245, y + 6, '(' + q.pt + ')'],
        [420, y - 6, q.rng],
        [420, y + 26, '4- 20mA'],
        [634, y - 20, '(' + q.card + ')'],
        [648, y + 25, '(' + q.card + ')']
      );
      w.push(
        [
          k,
          [
            [634, y],
            [mx, y]
          ],
          1
        ],
        [
          'pe' + n,
          [
            [756, y + 41],
            [q.xe, y + 41],
            [q.xe, y + 22],
            [mx, y + 22]
          ]
        ]
      );
      /* the block, its simulation value and its settings */
      m.push([
        M,
        'AI DIAG.MD',
        q.tag,
        mx,
        y - 30,
        235,
        128,
        ['IN', 'ERR', 'SIM'],
        ['OUT', 'ABN'],
        q.foot,
        [
          [mx + 80, y + 116, '(LME510)'],
          [mx - 23, y + 145, 'DEF N:3'],
          [mx - 2, y + 166, 'K:1'],
          [mx - 24, y + 188, 'H/L HL:' + q.par[0]],
          [mx - 2, y + 209, 'LL:' + q.par[1]],
          [mx - 24, y + 230, 'DEF TP:0.18S'],
          [mx + 137, y + 145, 'DEV HL:' + q.par[2]],
          [mx + 157, y + 166, 'LL:' + q.par[3]],
          [mx + 137, y + 188, 'DEF TP:0.03S'],
          [mx + 137, y + 209, 'DEF N:3'],
          [mx + 157, y + 230, 'K:1']
        ],
        [
          [y + 5, y + 27, y + 49],
          [y + 5, y + 49]
        ]
      ]);
      b.push(['sg' + n, 'SG', sno, sx, y + sdy, [snote]]);
      w.push([
        'sg' + n,
        [
          [sx + 29, y + sdo],
          [sxc, y + sdo],
          [sxc, y + 44],
          [mx, y + 44]
        ],
        1
      ]);
      /* the outputs: the value to two connectors, the abnormal signal to one */
      c.push(
        ['o' + q.B[0], 'out', q.B[0], bx, y + q.dyB, '', q.B[1], 1],
        ['o' + q.A[0], 'out', q.A[0], 2013, y, '', q.A[1]],
        ['o' + q.D[0], 'out', q.D[0], 2013, y + q.dyD, '', q.D[1]]
      );
      b.push(['f' + q.mo, 'o:FTR', q.mo, 1727, y], ['b' + q.mb, 'o:BTR', q.mb, 1727, y + q.dyD]);
      w.push(
        [
          M + '.OUT',
          [
            [xr, y],
            [1986, y]
          ],
          1
        ],
        [
          M + '.OUT',
          [
            [q.xj, y],
            [q.xj, y + q.dyB],
            [bx - 27, y + q.dyB]
          ],
          1
        ],
        [
          M + '.ABN',
          [
            [xr, y + 44],
            [1672, y + 44],
            [1672, y + q.dyD],
            [1986, y + q.dyD]
          ]
        ]
      );
      two(1775, y, q.lab[0], q.lab[1]);
      const an = q.abn || [q.lab[0], q.lab[1] + ' ABN.'];
      two(1773, y + q.dyD, an[0], an[1]);
    });
    t.push(...o.foot);
    return { id: o.id, pr: o.pr, title: o.title, page: o.page, ctl: 'EHG+MD', cycle: 30, f: o.f, r, l, tri, c, m, b, w, t };
  };
  /* the parameters printed under a VALVE DIAGNOSIS block: [distance from the left edge of the block, words], left and right column;
     vdNotes gives the words of the block (x of the block, its top, the y of its pins, the two distances of (LME123) and of the lists, o.dev =
     the DEV limit when not 20.0, gap = how much lower the last lines stand where a line of the sheet runs through the list, from line o.gi
     of the left column on (6 when not given)) */
  const PAR = [[-2, 'RATE HL:10.0%'], [24, 'LL:-50.0%'], [8, 'DEF N:1'], [29, 'K:1'], [7, 'H/L HL:103.5%'], [28, 'LL:-3.5%'], [7, 'DEF TP:0.1S'], [12, 'HL:100.0%'], [12, 'LL:-5.0%'], [7, 'DEV HL:20.0%'], [27, 'LL:-20.0%']],
    PAR2 = [[200, 'DEF TP:5S'], [200, 'DEF HL:102.4%'], [220, 'LL:-102.4%'], [199, 'DEF HL:200.0%'], [219, 'LL:-200.0%'], [199, 'DEF TP:0.1S'], [199, 'DEF HL:100.0%'], [219, 'LL:-100.0%'], [204, 'K:0.0']],
    vdNotes = (BX, top, y, lme, d1, o, gap) => [
      [BX + 85, y(0) + 6, 'POSITION'],
      [BX + 85, y(1) + 6, 'SERVO AMP OUTPUT'],
      [BX + 85, y(2) + 6, 'POSITION DEMAND'],
      [BX + 85, y(4) + 6, 'SIMULATOR POS.'],
      [BX + 85, y(5) + 6, 'ANN ENABLE'],
      [BX + 106, top + d1 - 24, '(LME122)'],
      [BX + lme, top + d1 - 24, '(LME123)'],
      ...PAR.map(([dx, s], i) => [BX + dx, top + d1 + 21.3 * i + (i >= (o.gi || 6) ? gap || 0 : 0), o.dev ? s.replace('20.0', o.dev) : s]),
      ...PAR2.map(([dx, s], i) => [BX + dx, top + d1 + 21 + 21.3 * i + (i >= (o.gi || 6) - 1 ? gap || 0 : 0), s])
    ],
    VDL = ['POS.', 'AMP', 'DEMAND', '', 'S.POS.', 'ANN SW', 'POS.OT', 'ANN.EN'],
    VDR = ['POS.', '', 'ABN.O', '', '', 'ABN.A', 'ABN.M', 'QUA'];
  /* A sheet of two VALVE DIAGNOSIS blocks (VALVE CONTROL DIAGNOSTICS, TCE120, TCE122 ...; POSITION DIAGNOSTICS, TCE132): the two position
     signals of one valve, each with its LVDT and servo amplifier from the PI/O sheets, the position demand, the simulator position and the
     annunciator enable; out go the position, its abnormal signals and the quality. The places are those of TCE120 set straight (the second
     block stands 650 lower than the first).
     o: id, title, page, v (the valve as printed: 'MSV(A)'), ann (name of the annunciator enable), dem / sim / en: [letter, sheet] of the three
     input connectors, io: [[sheet of the LVDT, sheet of the amplifier] for each block], tct: [sheet of connector B1, of B2], pos / abn: [sheets
     of the position connector, of the abnormal (annunciator) connector] (the same for both blocks), q: sheets of the quality connector,
     mk: { i: [marks of block 1: POS., AMP (its own line), DEMAND, S.POS., POS.OT, ANN.EN], j: the same of block 2, e: mark of the enable,
     o: [marks of ABN.O, ABN.A, QUA of block 1], p: the same of block 2 } ('' = the drawing prints no mark there), dev (the DEV limit when
     not 20.0), foot.
     rsv: 1 = a valve with no servo amplifier (TCE132): only the LVDT; 0.0 goes to AMP, DEMAND and POS.OT of both blocks, the simulator
     position comes in at the height of S.POS., the annunciator enable is a reference (en = its sheet); d = the sheets of the abnormal
     connectors D1 / D2, nos = the numbers of the two blocks. */
  const vd2 = o => {
    const F = [175, 78, 2228, 1541], u = (F[2] - F[0]) / 1000, BX = 1041, BW = 405, BH = 320, XR = BX + BW,
      c = [], k = [], s = [], p = [], l = [], tri = [], b = [], m = [], w = [], t = [],
      V = o.v, RSV = o.rsv,
      mark = (ty, no, x, y) => no && b.push(['m' + no, 'o:' + ty, no, x, y]),
      tops = [173, 823],
      P = tops.map(top => i => Math.round(top + 15 * u + (i + 0.5) * ((BH - 30 * u) / 8))),
      nos = o.nos || ['A002', 'A007'];
    tops.forEach((top, g) => {
      const n = g + 1, K = 'vd' + n, y = P[g], S = 'AB'[g], mi = o.mk[g ? 'j' : 'i'], mo = o.mk[g ? 'p' : 'o'], lv = 'lv' + n, am = 'am' + n;
      m.push([K, 'VALVE DIAGNOSIS', '', BX, top, BW, BH, VDL, VDR, nos[g], vdNotes(BX, top, y, 222, 365, o)]);
      /* the LVDT (a small box on a stem) and the servo amplifier (a triangle), each through its PI/O connection */
      s.push([lv, 235, y(0) - 13, 245, y(0) + 10]);
      p.push([[235, y(0) - 13], [245, y(0) - 13], [245, y(0) + 10], [235, y(0) + 10]]);
      l.push([[240, y(0) - 22], [240, y(0) - 13]]);
      tri.push([370, y(0), 9]);
      t.push([189, y(0) - 42, V + ' POSITION-' + S], [226, y(0) + 27, 'LVDT'], [328, y(0) - 18, '(' + o.io[g][0] + ')']);
      w.push([lv, [[245, y(0)], [BX, y(0)]], 1]);
      if (!RSV) {
        s.push([am, 230, y(2) - 10, 250, y(2) + 10]);
        p.push([[230, y(2) - 10], [250, y(2)], [230, y(2) + 10]]);
        tri.push([370, y(2), 9]);
        t.push([225, y(2) + 26, 'AMP'], [328, y(2) - 18, '(' + o.io[g][1] + ')'], [188, y(2) + 54, V + ' SERVO AMP-' + S]);
        w.push([am, [[250, y(2)], [849, y(2)], [849, y(1)], [BX, y(1)]], 1]);
      }
      mark('FTR', mi[0], 785, y(0));
      mark('FTR', mi[1], 785, y(2));
      mark('FTR', mi[2], 988, y(2));
      mark('FTR', mi[3], 988, y(4));
      mark('FTR', mi[4], 988, y(6));
      mark('BTR', mi[5], 988, y(7));
      /* out */
      c.push(
        ['oB' + n, 'out', 'B' + n, 2083, y(0) - 74, '', [o.tct[g]], 1, 1],
        ['oA' + n, 'out', 'A' + n, 2083, y(0), '', o.pos],
        ['oD' + n, 'out', 'D' + n, 2083, y(2), '', o.d || ['-']],
        ['oK' + n, 'out', 'K' + n, 2083, y(2) + 43, '', o.q],
        ['oC' + n, 'out', 'C' + n, 2083, y(5), '', o.abn]
      );
      w.push(
        [K + '.POS.', [[XR, y(0)], [2056, y(0)]], 1],
        [K + '.POS.', [[1594, y(0)], [1594, y(0) - 74], [2056, y(0) - 74]], 1],
        [K + '.ABN.O', [[XR, y(2)], [2056, y(2)]]],
        [K + '.ABN.A', [[XR, y(5)], [2056, y(5)]]],
        [K + '.QUA', [[XR, y(7)], [1582, y(7)], [1582, y(2) + 43], [2056, y(2) + 43]]]
      );
      mark('BTR', mo[0], 1531, y(2));
      mark('BTR', mo[1], 1531, y(5));
      mark('BTR', mo[2], 1531, y(7));
      t.push([1748, y(0) - 6, V + ' POSITION(' + n + ')'], [1748, y(2) - 6, V + ' POSITION ABN(' + n + ')'], [1748, y(2) + 37, V + ' POSITION ABN(' + n + ') Q'], [1748, y(5) - 6, V + '(' + n + ') ABN.(ANN)']);
    });
    const [a, z] = P, yE = z(5), y0 = z(6) + 43, yF = z(6) + 117, KX = RSV ? 505 : 571, KT = KX + 234;
    k.push(['k0', KX, y0, '0.0', 'sys.ref'], ['kF', KX, yF, 'OFF(0)', 'sys.ref']);
    if (RSV) {
      c.push(['iS', 'in', o.sim[0], 463, a(4), V + ' POSITION SIM', [o.sim[1]]]);
      k.push(['iE', KX, yE, o.ann, 'ref']);
      t.push([KX + 163, yE + 27, '(' + o.en + ')']);
      w.push(
        /* the simulator position */
        ['iS', [[490, a(4)], [BX, a(4)]], 1],
        ['iS', [[893, a(4)], [893, z(4)], [BX, z(4)]], 1],
        /* the annunciator enable */
        ['iE', [[KT, yE], [BX, yE]]],
        ['iE', [[908, yE], [908, a(5)], [BX, a(5)]]],
        /* 0.0 to AMP, DEMAND and POS.OT of both blocks */
        ['k0', [[KT, y0], [930, y0], [930, a(1)], [BX, a(1)]], 1],
        ...[a(2), a(6), z(1), z(2), z(6)].map(y => ['k0', [[930, y], [BX, y]], 1])
      );
    } else {
      const yD = a(2) + 75, yS = a(2) + 150;
      c.push(['iD', 'in', o.dem[0], 463, yD, V + ' POSITION DEMAND', [o.dem[1]]], ['iS', 'in', o.sim[0], 463, yS, V + ' POSITION SIM', [o.sim[1]]], ['iE', 'in', o.en[0], 459, yE, o.ann, [o.en[1]]]);
      w.push(
        /* the position demand: to DEMAND of both blocks */
        ['iD', [[490, yD], [871, yD]], 1],
        ['iD', [[BX, a(2)], [871, a(2)], [871, z(2)], [BX, z(2)]], 1],
        /* the simulator position */
        ['iS', [[490, yS], [893, yS]], 1],
        ['iS', [[BX, a(4)], [893, a(4)], [893, z(4)], [BX, z(4)]], 1],
        /* the annunciator enable */
        ['iE', [[486, yE], [BX, yE]]],
        ['iE', [[908, yE], [908, a(5)], [BX, a(5)]]],
        /* 0.0 to POS.OT */
        ['k0', [[KT, y0], [930, y0], [930, a(6)], [BX, a(6)]], 1],
        ['k0', [[930, z(6)], [BX, z(6)]], 1]
      );
    }
    /* OFF(0) to ANN.EN */
    w.push(['kF', [[KT, yF], [950, yF], [950, a(7)], [BX, a(7)]]], ['kF', [[950, z(7)], [BX, z(7)]]]);
    mark('BTR', o.mk.e, 781, yE);
    t.push(...o.foot);
    return { id: o.id, pr: o.pr, title: o.title, page: o.page, ctl: 'EHG+MD', cycle: 30, f: F, c, k, s, p, l, tri, m, b, w, t };
  };
  /* The second sheet of a valve (VALVE CONTROL DIAGNOSTICS, TCE121, TCE123, TCE125 ...; POSITION DIAGNOSTICS, TCE133): the VALVE DIAGNOSIS
     block of the third position signal, the TMR LVDT DIAGNOSIS block that takes the three position signals, the comparators of the valve
     position and the abnormal signals. The places are those of TCE121 set straight.
     o: id, title, page, v (the valve as printed: 'MSV(A)'), ann, en (letter of the annunciator enable connector), dem / sim: [letter, sheet]
     of the input connectors, prev (the first sheet of the valve), io: [sheet of the LVDT, sheet of the amplifier], tct (sheet of connector
     B1), foot, and one of
       fo: sheet of FULL OPEN for CV warming  - a main stop valve: INITIAL, test position, full close and two full open comparators (TCE121)
       cv: { j: sheets of J, j1: sheet of J1 (j1u 1 = printed under it), m: its mark when not 029, f: sheets of F when not (-), g: sheets of
           G, p: sheets of P }  - a control valve: test position (to the protection controllers and, by a mark, to J1), full close and full
           close (AUX) (TCE125); its blocks carry the numbers of TCE125.
       icv: { g: sheets of G, p: sheets of P, sg: number of the SG block when not A014 }  - an intercept valve: one full close comparator
           (TCE129); its blocks carry the numbers of TCE129.
       rsv: { g: sheets of G, p: sheets of P, iy: the height of the INITIAL line when not 620 (with gi) }  - a valve with no servo amplifier (TCE133): 0.0 goes to AMP, DEMAND and POS.OT, the
           annunciator enable is a reference (en = its sheet), INITIAL goes to the one full open comparator, the abnormal signals (1) and
           (2) come in on connectors D1 and D2 and the third is ABN.O of this sheet; its blocks carry the numbers of TCE133.
     r450 / r218: the sheets of the abnormal signals when not TCE450 / TCE218 (r218 '-' on TCE133); dev: the DEV limit of the VALVE DIAGNOSIS
     block when not 20.0. */
  const vd3 = o => {
    const F = [163, 82, 2222, 1541], u = (F[2] - F[0]) / 1000, BX = 984, XR = BX + 405, TOP = 136, TX = 981, TR = TX + 405,
      a = i => Math.round(TOP + 15 * u + (i + 0.5) * ((320 - 30 * u) / 8)),
      z = i => Math.round(764 + 15 * u + (i + 0.5) * ((318 - 30 * u) / 8)),
      V = o.v, CV = o.cv, ICV = o.icv, RSV = o.rsv,
      N = RSV
        ? { sig: ['007', '009', '010'], en: '015', sg: 'A012', a: '013', or: '016', not: '017', ors: ['008', '011', '014'], tm: 'A006' }
        : ICV
          ? { sig: ['009', '011', '012'], en: '016', sg: ICV.sg || 'A014', a: '017', or: '018', not: '019', ors: ['010', '013', '015'], tm: 'A008' }
          : CV
            ? { sig: ['011', '013', '014'], en: '018', sg: 'A016', a: '019', or: '020', not: '021', ors: ['012', '015', '017'], tm: 'A010' }
            : { sig: ['013', '015', '016'], en: '020', sg: 'A018', a: '021', or: '022', not: '023', ors: ['014', '017', '019'], tm: 'A012' },
      OX = 2080, E = OX - 27, T450 = [o.r450 || 'TCE450'], T218 = [o.r218 || 'TCE218'],
      b = [], t = [], c = [], w = [],
      k = RSV ? [['k0', 463, 417, '0.0', 'sys.ref'], ['kF', 462, 492, 'OFF(0)', 'sys.ref']] : [['k0', 571, 484, '0.0', 'sys.ref'], ['kF', 571, 558, 'OFF(0)', 'sys.ref']],
      mark = (ty, no, x, y) => b.push(['m' + no, 'o:' + ty, no, x, y]),
      out = (l, y, refs, dbl, under) => ['o' + l, 'out', l, OX, y, '', refs, dbl || 0, under || 0],
      box = (key, type, no, x, y, w, h, notes) => b.push([key, type, no, x, y, notes || [], {}, [w, h]]),
      /* the comparators on the line of the valve position: [key, type, number, y of its line, mark] */
      CM = RSV
        ? [['c018', 'CMP', 'C018', 705, '004']]
        : ICV
          ? [['c020', 'CPL', 'C020', 710, '006']]
          : CV
            ? [['c025', 'CPL', 'C025', 472, '024'], ['c026', 'CPL', 'C026', 621, '006'], ['c027', 'CPL', 'C027', 717, '008']]
            : [['c025', 'CPL', 'C025', 461, '024'], ['c026', 'CPL', 'C026', 556, '006'], ['c027', 'CMP', 'C027', 641, '008'], ['c028', 'CMP', 'C028', 726, '010']],
      one = ICV || RSV;
    mark('FTR', '001', 771, a(0));
    if (RSV) mark('FTR', '003', 769, a(4));
    else [['003', 771, a(2)], ['004', 771, 326], ['005', 769, 401]].forEach(([no, x, y]) => mark('FTR', no, x, y));
    [[N.sig[0], 767, z(1)], [N.sig[1], 767, z(3)], [N.sig[2], 927, z(5)]].forEach(([no, x, y]) => mark('FTR', no, x, y));
    mark('BTR', N.en, 767, 1088);
    CM.forEach(([key, type, no, y, mk], i) => {
      const x = i || one ? 1739 : 1750;
      box(key, type, no, x, y + 11, 59, 43);
      mark('FTR', mk, i || one ? 1632 : 1644, y);
      t.push([x - 51, y - 9, 'T']);
      w.push(['tm.OUT', i ? [[1578, y], [x - 30, y]] : [[1578, z(0)], [1578, y], [x - 30, y]], 1], [key, [[x + 30, y], [E, y]]]);
    });
    box('sg', 'SG', N.sg, 715, 1015, 59, 43, ['K:5.0%']);
    box('and', 'A', N.a, 938, 1046, 59, 43);
    box('orA', 'OR', N.or, 757, 1333, 58, 64);
    box('not', 'NOT', N.not, 841, 1323, 59, 43);
    box('or1', 'OR', N.ors[0], 1630, 886, 60, 43);
    box('or2', 'OR', N.ors[1], 1629, 982, 60, 43);
    box('or3', 'OR', N.ors[2], 1628, 1077, 60, 43);
    if (RSV) {
      const yI = RSV.iy || 620;
      k.push(['kI', 450, yI, 'INITIAL', 'ref']);
      c.push(out('G', 705, RSV.g, 1), out('P', z(0), RSV.p));
      w.push(['kI', [[684, yI], [1739, yI], [1739, 694]]]);
      t.push([583, yI + 40, '(TCE050)'], [1846, 696, V + ' FULL OPEN'], [1737, z(0) - 6, V + ' POSITION'], [1709, 755, 'HL:98'], [1709, 776, 'LL:97']);
    } else if (ICV) {
      c.push(out('G', 710, ICV.g), out('P', z(0), ICV.p));
      t.push([1849, 701, V + ' FULL CLOSE'], [1747, z(0) - 6, V + ' POSITION'], [1713, 759, 'HL:3'], [1713, 780, 'LL:2']);
    } else if (CV) {
      c.push(out('J', 472, CV.j, 1), out('J1', 547, [CV.j1], 0, CV.j1u ? 1 : 0), out('F', 621, CV.f || ['-']), out('G', 717, CV.g, 1), out('P', z(0), CV.p));
      w.push(['c025', [[1805, 472], [1805, 547], [E, 547]]]);
      mark('BTR', CV.m || '029', 1848, 547);
      t.push(
        [1848, 464, V + ' TEST POSITION'], [1884, 518, V + ' TEST'], [1884, 539, 'POSITION'], [1846, 613, V + ' FULL CLOSE'], [1846, 709, V + ' FULL CLOSE(AUX)'], [1743, z(0) - 6, V + ' POSITION'],
        [1711, 522, 'HL:11.0'], [1711, 543, 'LL:10.0'], [1709, 671, 'HL:7'], [1709, 692, 'LL:5'], [1709, 767, 'HL:7'], [1709, 788, 'LL:5']
      );
    } else {
      k.unshift(['kI', 454, 131, 'INITIAL', 'ref']);
      c.push(
        out('J', 461, ['TCP1210', 'TCP2210', 'TCP3210'], 1),
        out('G', 556, ['TCE151', 'TCE220']),
        out('F', 641, [o.fo, 'TCE220']),
        out('H', 726, ['TCA533', 'TCP1220', 'TCP2220', 'TCP3220'], 1),
        out('P', z(0), ['TCE151', 'TCE220', 'TCE450', 'TCE501'])
      );
      /* INITIAL to the two full open comparators */
      w.push(['kI', [[688, 131], [1451, 131], [1451, 610], [1738, 610], [1738, 630]]], ['kI', [[1556, 610], [1556, 684], [1738, 684], [1738, 715]]]);
      t.push(
        [588, 175, '(TCE050)'], [1793, 455, V + ' TEST POSITION'], [1845, 550, V + ' FULL CLOSE'], [1846, 614, V + ' FULL OPEN'], [1846, 635, 'for CV warming'], [1845, 720, V + ' FULL OPEN'], [1837, z(0) - 6, V + ' POSITION'],
        [1721, 511, 'HL:11.0'], [1721, 532, 'LL:10.0'], [1773, 575, 'HL:2.0'], [1773, 596, 'LL:1.5'], [1773, 660, 'HL:98'], [1773, 681, 'LL:97'], [1773, 745, 'HL:98'], [1773, 766, 'LL:97']
      );
    }
    t.push([179, a(0) - 38, V + ' POSITION-C'], [217, a(0) + 32, 'LVDT'], [322, a(0) - 15, '(' + o.io[0] + ')']);
    if (!RSV) t.push([217, a(2) + 30, 'AMP'], [322, a(2) - 16, '(' + o.io[1] + ')'], [179, a(2) + 56, V + ' SERVO AMP-C']);
    t.push(
      [1746, a(0) - 6, V + ' POSITION(3)'], [1746, a(2) - 6, V + ' POSITION ABN(3)'], [1746, 284, V + ' POSITION ABN(3) Q'], [1746, a(5) - 6, V + '(3) ABN.(ANN)'],
      [1741, z(2) - 6, V + '(1) ABN'], [1741, 923, V + '(A) ABN'], [1741, 965, V + '(2) ABN'], [1741, 1018, V + '(B) ABN'], [1741, 1060, V + '(3) ABN'], [1741, 1114, V + '(C) ABN'],
      [1741, 1167, V + ' ERR.(ANN)'], [1741, 1210, V + '(A) ABN_Q'], [1741, 1253, V + '(B) ABN_Q'], [1741, 1295, V + '(C) ABN_Q'],
      ...o.foot
    );
    /* the inputs of the VALVE DIAGNOSIS block and the annunciator enable */
    const ci = [], wi = [['lv', [[240, a(0)], [BX, a(0)]], 1]], s = [['lv', 230, a(0) - 13, 240, a(0) + 10]],
      p = [[[230, a(0) - 13], [240, a(0) - 13], [240, a(0) + 10], [230, a(0) + 10]]], tri = [[368, a(0), 9]];
    if (RSV) {
      ci.push(['iS', 'in', o.sim[0], 458, a(4), V + ' POSITION SIM', [o.sim[1]]], ['iD1', 'in', 'D1', 458, 1152, V + ' POSITION ABN(1)', [o.prev]], ['iD2', 'in', 'D2', 458, 1228, V + ' POSITION ABN(2)', [o.prev]]);
      k.push(['iR', 455, 1088, o.ann, 'ref']);
      t.push([598, 1115, '(' + o.en + ')']);
      wi.push(
        ['iS', [[485, a(4)], [BX, a(4)]], 1],
        /* 0.0 to AMP, DEMAND and POS.OT */
        ['k0', [[697, 417], [853, 417], [853, a(1)], [BX, a(1)]], 1],
        ['k0', [[853, a(2)], [BX, a(2)]], 1],
        ['k0', [[853, a(6)], [BX, a(6)]], 1],
        ['kF', [[696, 492], [896, 492], [896, a(7)], [BX, a(7)]]],
        ['iR', [[689, 1088], [874, 1088], [874, a(5)], [BX, a(5)]]],
        /* the abnormal signals (1) and (2) of the first sheet, and those of the annunciator */
        ['iD1', [[485, 1152], [1534, 1152], [1534, 897], [1600, 897]]],
        ['iD2', [[485, 1228], [1574, 1228], [1574, 993], [1599, 993]]],
        ['iC1', [[485, 1312], [728, 1312]]],
        ['iC2', [[485, 1366], [704, 1366], [704, 1334], [728, 1334]]]
      );
    } else {
      ci.push(['iD', 'in', o.dem[0], 458, 326, V + ' POSITION DEMAND', [o.dem[1]]], ['iS', 'in', o.sim[0], 458, 401, V + ' POSITION SIM', [o.sim[1]]], ['iR', 'in', o.en || 'R', 458, 1088, o.ann, ['TCE053']]);
      s.push(['am', 225, a(2) - 10, 245, a(2) + 10]);
      p.push([[225, a(2) - 10], [245, a(2)], [225, a(2) + 10]]);
      tri.push([368, a(2), 9]);
      wi.push(
        ['am', [[245, a(2)], [812, a(2)], [812, a(1)], [BX, a(1)]], 1],
        ['iD', [[485, 326], [833, 326], [833, a(2)], [BX, a(2)]], 1],
        ['iS', [[485, 401], [854, 401], [854, a(4)], [BX, a(4)]], 1],
        ['k0', [[805, 484], [897, 484], [897, a(6)], [BX, a(6)]], 1],
        ['kF', [[805, 558], [919, 558], [919, a(7)], [BX, a(7)]]],
        /* the annunciator enable: to the VALVE DIAGNOSIS block, and with "no abnormal position signal" to the TMR block */
        ['iR', [[485, 1088], [874, 1088], [874, a(5)], [BX, a(5)]]],
        ['iC1', [[485, 1312], [728, 1312]]],
        ['iC1', [[683, 1312], [683, 1152], [1534, 1152], [1534, 897], [1600, 897]]],
        ['iC2', [[485, 1366], [704, 1366], [704, 1228], [1574, 1228], [1574, 993], [1599, 993]]],
        ['iC2', [[704, 1334], [728, 1334]]]
      );
    }
    /* the third abnormal signal: ABN.A of this sheet (ABN.O on the sheet of a valve with no servo amplifier) */
    const TH = RSV ? 2 : 5;
    return {
      id: o.id, pr: o.pr, title: o.title, page: o.page, ctl: 'EHG+MD', cycle: 30, f: F, k, s, p,
      l: [[[235, a(0) - 22], [235, a(0) - 13]]],
      tri,
      c: [
        ...ci,
        ['iP1', 'in', 'A1', 458, z(1), V + ' POSITION(1)', [o.prev]],
        ['iP2', 'in', 'A2', 458, z(3), V + ' POSITION(2)', [o.prev]],
        ['iC1', 'in', 'C1', 458, 1312, V + '(1) ABN.(ANN)', [o.prev]],
        ['iC2', 'in', 'C2', 458, 1366, V + '(2) ABN.(ANN)', [o.prev]],
        ['iC3', 'in', 'C3', 458, 1419, V + '(3) ABN.(ANN)', ['*']],
        out('B1', 121, [o.tct], 1, 1),
        out('A1', a(0), T450),
        out('D1', a(2), ['-']),
        out('K1', 290, T450),
        out('C3', a(5), ['*', T450[0]]),
        ...c,
        out('E1', z(2), T218), out('L1', 929, T450), out('E2', 971, T218), out('L2', 1024, T450), out('E3', 1066, T218), out('L3', 1120, T450),
        out('E4', 1173, ['-']), out('M1', 1216, T450), out('M2', 1259, T450), out('M3', 1301, T450)
      ],
      m: [
        ['vd', 'VALVE DIAGNOSIS', '', BX, TOP, 405, 320, VDL, VDR, 'A002', vdNotes(BX, TOP, a, 225, 367, o, RSV ? 11 : 0)],
        ['tm', 'TMR LVDT DIAGNOSIS', '', TX, 764, 405, 318, ['', 'SIG1', '', 'SIG2', '', 'SIG3', 'DEV', 'ANN SW'], ['OUT', 'ERR', 'ERR1', 'ERR2', 'ERR3', 'QUA1', 'QUA2', 'QUA3'], N.tm, [
          [TX + 85, z(7) + 6, 'ANN ENABLE'],
          [TX + 106, 1107, '(LME124)'],
          ...['HL:1.0', 'LL:-1.0', 'DELAY TP:3.0s', 'HL:1.0', 'LL:-1.0', 'DELAY TP:3.0s', 'HL:1.0', 'LL:-1.0', 'DELAY TP:3.0s'].map((s, i) => [i % 3 === 2 ? 980 : 985, 1280 + 21.3 * i, s])
        ]]
      ],
      b,
      w: [
        ...wi,
        ['iR', [[874, z(7)], [908, z(7)]]],
        ['and', [[968, z(7)], [TX, z(7)]]],
        ['iC3', [[485, 1419], [714, 1419], [714, 1356], [728, 1356]]],
        ['orA', [[786, 1312], [812, 1312]]],
        ['not', [[871, 1312], [895, 1312], [895, 1057], [908, 1057]]],
        /* the three position signals and the deviation setting */
        ['iP1', [[485, z(1)], [TX, z(1)]], 1],
        ['iP2', [[485, z(3)], [TX, z(3)]], 1],
        ['sg', [[745, z(6)], [TX, z(6)]], 1],
        ['vd.POS.', [[XR, a(0)], [E, a(0)]], 1],
        ['vd.POS.', [[1528, a(0)], [1528, 121], [E, 121]], 1],
        ['vd.POS.', [[1497, a(0)], [1497, RSV ? 738 : 727], [895, RSV ? 738 : 727], [895, z(5)], [TX, z(5)]], 1],
        ['vd.ABN.O', [[XR, a(2)], [E, a(2)]]],
        ['vd.ABN.A', [[XR, a(5)], [E, a(5)]]],
        [RSV ? 'vd.ABN.O' : 'vd.ABN.A', [[1515, a(TH)], [1515, 1066], [1598, 1066]]],
        ['vd.QUA', [[XR, a(7)], [1581, a(7)], [1581, 290], [E, 290]]],
        /* the valve position and its comparators */
        ['tm.OUT', [[TR, z(0)], [E, z(0)]], 1],
        ...w,
        /* the abnormal signals */
        ['tm.ERR', [[TR, z(1)], [1471, z(1)], [1471, 1173], [E, 1173]]],
        ['tm.ERR1', [[TR, z(2)], [1600, z(2)]]],
        ['tm.ERR1', [[1576, z(2)], [1576, 929], [E, 929]]],
        ['tm.ERR2', [[TR, z(3)], [1555, z(3)], [1555, 1024], [E, 1024]]],
        ['tm.ERR2', [[1555, 971], [1599, 971]]],
        ['tm.ERR3', [[TR, z(4)], [1491, z(4)], [1491, 1120], [E, 1120]]],
        ['tm.ERR3', [[1491, 1087], [1598, 1087]]],
        ['tm.QUA1', [[TR, z(5)], [1448, z(5)], [1448, 1216], [E, 1216]]],
        ['tm.QUA2', [[TR, z(6)], [1427, z(6)], [1427, 1259], [E, 1259]]],
        ['tm.QUA3', [[TR, z(7)], [1405, z(7)], [1405, 1301], [E, 1301]]],
        ['or1', [[1660, z(2)], [E, z(2)]]],
        ['or2', [[1659, 971], [E, 971]]],
        ['or3', [[1658, 1066], [E, 1066]]]
      ],
      t
    };
  };
  /* A sheet of one pulse input card (PTI) with three turbine speed signals (TURBINE SPEED DIAGNOSTICS, TCE140, TCE141, TCE142). From the card
     come, for each signal, the speed and the low counter (each through a gain block), the H-valid flag and the PI/O error; the first signal
     also gives the L-timing, the trigger of the logic. The places are those of TCE140 set straight, the three signals at one distance.
     o: id, title, page, n (the number of the card in the names: TURBINE SPEED <n>A), io: [number of the PI/O sheet of the first speed, of the
     first low counter] (TCE980-<number>; the next signals count on), refs: for each signal [sheets of the speed, of the low counter, of the
     H-flag, of the ABN connector], foot, and
       src: [[letter, sheet] for each signal]  - the signal comes in on a connector (TCE141, TCE142)
       no src                                  - the three speed pickups themselves (TCE140): each goes to the card and, through its buffers,
                                                 to connectors 1 .. 6 (TCE141 and TCE142; the last buffer is left open), with its table. */
  const pti = o => {
    const c = [], r = [], s = [], p = [], l = [], a = [], tri = [], b = [], w = [], t = [], XO = 2062, E = XO - 27,
      mark = (ty, no, x, y) => b.push(['m' + no, 'o:' + ty, no, x, y]),
      buf = (x, y) => p.push([[x, y - 15], [x + 21, y], [x, y + 15]]),
      rule = (x1, y1, x2, y2) => l.push([[x1, y1], [x2, y2]]),
      /* numbers of each signal: FTR speed, FTR low, G speed, G low, BTR H-valid x 2, BTR PI/O error x 2 */
      NO = [['002', '004', 'A003', 'A005', '006', '007', '011', '012'], ['013', '015', 'A014', 'A016', '017', '018', '019', '020'], ['021', '023', 'A022', 'A024', '025', '026', '027', '028']];
    ['A', 'B', 'C'].forEach((L, g) => {
      const y = [209, 624, 1039][g], n = NO[g], refs = o.refs[g], S = o.n + L,
        pk = 'pk' + L, lc = 'lc' + L, hv = 'hv' + L, pe = 'pe' + L,
        io = '(TCE980-' + (o.io[0] + g) + ')', yl = y + 74, yh = y + 159, ye = y + (g ? 234 : 287), first = g === 0;
      s.push([lc, 583, yl - 12, 838, yl + 12]);
      if (o.src) {
        c.push([pk, 'in', o.src[g][0], 356, y, '', [o.src[g][1]], 0, 1]);
        w.push([pk, [[383, y], [583, y]]]);
      } else {
        /* the pickup, its buffers and the two connectors */
        s.push([pk, 207, y - 21, 240, y + 21]);
        p.push([[213, y - 21], [240, y - 21], [240, y + 21], [213, y + 21], [213, y + 10], [207, y + 10], [207, y - 10], [213, y - 10]]);
        [0, 54, 107, 160].forEach((dy, i) => {
          buf(357, y + dy);
          if (i) w.push([pk, [[325, y + dy], [357, y + dy]]]);
          if (i === 1 || i === 2) {
            w.push([pk, [[378, y + dy], [408, y + dy]]]);
            c.push(['o' + (2 * g + i), 'out', String(2 * g + i), 435, y + dy, '', ['TCE14' + i]]);
          }
          if (i === 3) a.push([[378, y + dy], [408, y + dy]]);
        });
        w.push([pk, [[240, y], [357, y]]], [pk, [[325, y], [325, y + 160]]], [pk, [[378, y], [583, y]]]);
        /* the table of the pickup */
        const ty = y + 191;
        [0, 1, 2, 3, 4, 5].forEach(i => rule(217, ty + 32 * i, 548, ty + 32 * i));
        rule(217, ty, 217, ty + 160);
        rule(333, ty, 333, ty + 160);
        rule(548, ty, 548, ty + 160);
        [['INSTR UMENT', 'SPEED PICKUP(' + L + ')'], ['TAG No.', 'SE-STn001-' + (g + 1)], ['MODULE', '3'], ['TOOTH', '120'], ['RANGE', '0-5000rpm/0-10kHz']].forEach(([k, v], i) =>
          t.push([222, ty + 24 + 32 * i, k], [339, ty + 24 + 32 * i, v])
        );
      }
      w.push([pk, [[583, y], [1374, y]], 1], [lc, [[583, yl], [1374, yl]], 1]);
      tri.push([575, y, 9], [575, yl, 9]);
      t.push([587, y - 6, 'TURBINE SPEED ' + S], [744, y - 9, io], [587, yl - 6, 'LOW COUNTER'], [743, yl - 9, '(TCE980-' + (o.io[1] + g) + ')']);
      mark('FTR', n[0], 903, y);
      mark('FTR', n[1], 903, yl);
      b.push(['g' + n[2], 'G', n[2], 1403, y + 10, ['K:1.0'], {}, [58, 43]], ['g' + n[3], 'G', n[3], 1403, yl + 10, ['K:1.0'], {}, [58, 43]]);
      w.push(['g' + n[2], [[1432, y], [E, y]], 1], ['g' + n[3], [[1432, yl], [E, yl]], 1]);
      /* the flags of the card */
      r.push([hv, 615, yh - 11, 125, 22, 'PTI H-valid'], [pe, 615, ye - 11, 125, 22, 'PI/O error']);
      t.push([632, yh - 15, io], [632, ye - 15, io]);
      w.push([hv, [[740, yh], [E, yh]]], [pe, [[740, ye], [E, ye]]]);
      mark('BTR', n[4], 903, yh);
      mark('BTR', n[5], 1402, yh);
      mark('BTR', n[6], 903, ye);
      mark('BTR', n[7], 1402, ye);
      c.push(
        ['o' + L + '1', 'out', L + '1', XO, y, '', refs[0], 0, 1],
        ['o' + L + '2', 'out', L + '2', XO, yl, '', refs[1], 0, 1],
        ['o' + L + '3', 'out', L + '3', XO, yh, '', refs[2], 0, 1],
        ['o' + L + '5', 'out', L + '5', XO, ye, '', refs[3], 0, refs[3].length > 1 ? 2 : 1]
      );
      t.push([1745, y - 6, 'TURBINE SPEED ' + S], [1745, yl - 6, 'TB SPD ' + S + ' LOW COUNTER'], [1745, yh - 6, 'COUNTER ' + S + ' H-FLAG'], [1745, ye - 6, 'COUNTER ' + S + ' ABN']);
      if (first) {
        const yt = y + 223;
        r.push(['lt', 615, yt - 11, 128, 22, 'PTI L-timing']);
        t.push([632, yt - 15, io], [1745, yt - 6, 'TRIGGER OF LOGIC(' + o.n + ')']);
        w.push(['lt', [[743, yt], [E, yt]]]);
        mark('BTR', '008', 903, yt);
        mark('BTR', '009', 1402, yt);
        c.push(['oA4', 'out', 'A4', XO, yt, '', ['TCE144'], 0, 1]);
      }
    });
    /* the card */
    rule(583, 123, 838, 123);
    rule(838, 123, 838, 1326);
    rule(583, 1326, 838, 1326);
    rule(583, 123, 583, 1326);
    rule(689, 123, 689, 155);
    rule(583, 155, 689, 155);
    /* the PTI switch */
    c.push(['iL', 'in', 'L', 966, 134, 'PTI SWITCH', ['TCE143'], 0, 1]);
    w.push(['iL', [[993, 134], [1951, 134]]]);
    mark('BTR', '001', 1405, 134);
    r.push(['', 1951, 122, 125, 24, 'PTI SW.input']);
    t.push([625, 145, 'PTI'], [1968, 117, '(TCE980-' + o.io[0] + ')'], ...o.foot);
    return { id: o.id, pr: o.pr, title: o.title, page: o.page, ctl: 'EHG+MD', cycle: 30, f: [165, 78, 2224, 1541], c, r, s, p, l, a, tri, b, w, t };
  };
  if (typeof window !== 'undefined') window.TCE_LIB = { di, tmr, did, aid, vd2, vd3, pti };
})();
