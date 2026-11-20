/* TCE451 INDICATION FOR VALVE(2) (331DM09784 page 163, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the
   page rendered 2296 wide, the scan skew taken out (x + 0.012 (y - 800), y - 0.0047 (x - 1100)). Four HMI INDI FOR VALVE blocks (LME125):
   ICV(A) nZT-STn905-AA, ICV(B) nZT-STn905-BA, RSV(A) nZT-STn905-AB, RSV(B) nZT-STn905-BB. Each takes sixteen signals from the valve sheets
   (TCE128 to TCE135): the position and positions (1) to (3) (FTR, heavy lines), the position ABN Q, the ABN_Q of each channel, the ABN.
   (ANN) and the ABN of each channel (BTR). The ABN.O of each block goes to TCE470 (A, B, C, D). */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    b = [],
    m = [],
    w = [],
    t = [];
  const PINS = [
      'POS',
      'POS1',
      'POS2',
      'POS3',
      'QUA1',
      'QUA2',
      'QUA3',
      'QUAA',
      'QUAB',
      'QUAC',
      'ABN1',
      'ABN2',
      'ABN3',
      'ABNA',
      'ABNB',
      'ABNC'
    ],
    LET = ['P', 'A1', 'A2', 'A1', 'K1', 'K2', 'K1', 'M1', 'M2', 'M3', 'C1', 'C2', 'C3', 'L1', 'L2', 'L3'],
    /* the sheet each connector comes from: 0 = the first sheet of the pair, 1 = the second */
    REF = [1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
    /* the x where the line of each row turns to its pin (rows 1 to 15; row 0 runs straight) */
    STAIR = [0, 624, 635, 645, ...Array.from({ length: 12 }, (_, k) => Math.round(655 + 10.75 * k))],
    rowY = i => Math.round(161.5 + 42.6 * i);
  /* one block and its sixteen rows: side (0 left, 1 right), group (0 top, 1 bottom), valve, tag, the two sheets, block no., marks, names */
  const group = (side, gr, valve, tag, sheets, no, marks, names) => {
    const dx = (side ? 894 : 0) + 7,
      top = gr ? 812 : 130,
      bx = 794 + dx,
      pin = p => Math.round((gr ? 843.5 : 162) + 21.3 * p),
      cx = 292 + dx,
      key = 'm' + no;
    m.push([
      key,
      'HMI INDI FOR VALVE',
      '',
      bx,
      top,
      235,
      383,
      PINS,
      ['ABN.O'],
      no,
      [
        [bx, top - 6, '(' + valve + ')'],
        [bx + 138, top - 6, tag],
        [bx + 50, top + 405, '(LME125)']
      ],
      [PINS.map((_, p) => pin(p)), [pin(4)]]
    ]);
    names.forEach((nm, j) => {
      const i = gr * 16 + j,
        y = j ? rowY(i) : pin(0),
        k = (side ? 'r' : 'l') + i,
        two = Array.isArray(nm);
      c.push([k, 'in', LET[j], cx, y, two ? nm[1] : nm, [sheets[REF[j]]]]);
      if (two) t.push([cx + 33, y - 31, nm[0], 0, 2.05]);
      b.push(['f' + marks[j], j < 4 ? 'o:FTR' : 'o:BTR', marks[j], 581.5 + dx, y]);
      const heavy = j < 4 ? 1 : 0;
      if (!j)
        w.push([
          k,
          [
            [cx + 27, y],
            [bx, y]
          ],
          heavy
        ]);
      else
        w.push([
          k,
          [
            [cx + 27, y],
            [STAIR[j] + dx, y],
            [STAIR[j] + dx, pin(j)],
            [bx, pin(j)]
          ],
          heavy
        ]);
    });
    return [key + '.ABN.O', bx + 235, pin(4)];
  };
  const num = n => String(n).padStart(3, '0'),
    marks = (a, b4) =>
      [...a, ...Array.from({ length: 12 }, (_, k) => num(b4 + 2 * k))].map(x => (typeof x === 'number' ? num(x) : x));
  const names = (v, ab1) => [
    v + ' POSITION',
    v + ' POSITION(1)',
    v + ' POSITION(2)',
    v + ' POSITION(3)',
    ab1 ? v + ' POSITION ABN(1) Q' : [v + ' POSITION', 'ABN(1) Q'],
    [v + ' POSITION', 'ABN(2) Q'],
    [v + ' POSITION', 'ABN(3) Q'],
    v + '(A) ABN_Q',
    v + '(B) ABN_Q',
    v + '(C) ABN_Q',
    [v + '(1) ABN.', '(ANN)'],
    [v + '(2) ABN.', '(ANN)'],
    [v + '(3) ABN.', '(ANN)'],
    v + '(A) ABN',
    v + '(B) ABN',
    v + '(C) ABN'
  ];
  const oA = group(
      0,
      0,
      'ICV(A)',
      'nZT-STn905-AA',
      ['TCE128', 'TCE129'],
      '002',
      marks([1, 5, 7, 9], 11),
      names('ICV(A)')
    ),
    oB = group(
      0,
      1,
      'ICV(B)',
      'nZT-STn905-BA',
      ['TCE130', 'TCE131'],
      '036',
      marks([35, 39, 41, 43], 45),
      names('ICV(B)')
    ),
    oC = group(1, 0, 'RSV(A)', 'nZT-STn905-AB', ['TCE132', 'TCE133'], '004', marks([3, 6, 8, 10], 12), names('RSV(A)')),
    oD = group(1, 1, 'RSV(B)', 'nZT-STn905-BB', ['TCE134', 'TCE135'], '038', marks([37, 40, 42, 44], 46), names('RSV(B)'));
  /* the ABN.O of the ICV blocks go round under the block to A / B; those of the RSV blocks straight to C / D */
  c.push(
    ['oA', 'out', 'A', 993, 631, '', ['TCE470'], 0, 2],
    ['oB', 'out', 'B', 994, 1312, '', ['TCE470'], 0, 2],
    ['oC', 'out', 'C', 2067, oC[2], '', ['TCE470'], 0, 2],
    ['oD', 'out', 'D', 2067, oD[2], '', ['TCE470'], 0, 2]
  );
  w.push(
    [
      oA[0],
      [
        [oA[1], oA[2]],
        [1068, oA[2]],
        [1068, 590],
        [866, 590],
        [866, 631],
        [966, 631]
      ]
    ],
    [
      oB[0],
      [
        [oB[1], oB[2]],
        [1068, oB[2]],
        [1068, 1271],
        [866, 1271],
        [866, 1312],
        [967, 1312]
      ]
    ],
    [
      oC[0],
      [
        [oC[1], oC[2]],
        [2040, oC[2]]
      ]
    ],
    [
      oD[0],
      [
        [oD[1], oD[2]],
        [2040, oD[2]]
      ]
    ]
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCE451',
    title: 'INDICATION FOR VALVE(2)',
    page: 163,
    ctl: 'EHG+MD',
    cycle: 30,
    f: [166, 85, 2217, 1549],
    c,
    b,
    m,
    w,
    t: [...t, [235, 1523, 'CONTROLLER:'], [395, 1523, 'EHG+MD'], [675, 1501, 'TRIGGER  :'], [675, 1521, 'CYCLE(ms):30']]
  });
})();
