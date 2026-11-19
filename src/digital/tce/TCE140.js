/* TCE140 TURBINE SPEED DIAGNOSTICS(1) (331DM09784 page 101, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. The scan of this page is turned a little; every place is typed as it stands on the page set straight, the three speed
   pickups at one distance.
   The three turbine speed pickups (SE-STn001-1, -2, -3) on the pulse input card (PTI): each pickup goes to the card and, through its buffers,
   to TCE141 and TCE142 (the last buffer is left open). From the card come the speed and the low counter (each through a gain block), the
   H-valid flag and the PI/O error; the first pickup also gives the L-timing, the trigger of the logic. The title block of this page prints
   PAGE 99; it is page 101 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    r = [],
    s = [],
    p = [],
    l = [],
    a = [],
    tri = [],
    b = [],
    w = [],
    t = [],
    XO = 2062,
    E = XO - 27,
    mark = (ty, no, x, y) => b.push(['m' + no, 'o:' + ty, no, x, y]),
    buf = (x, y) =>
      p.push([
        [x, y - 15],
        [x + 21, y],
        [x, y + 15]
      ]),
    rule = (x1, y1, x2, y2) =>
      l.push([
        [x1, y1],
        [x2, y2]
      ]);
  /* [letter, y of the speed line, sheets of the outputs (speed, low counter, H-flag, ABN), numbers: FTR speed, FTR low, G speed, G low,
     BTR H-valid x 2, BTR PI/O error x 2, connectors of the buffers] */
  [
    [
      'A',
      209,
      [['TCE143'], ['TCE143'], ['TCE143'], ['TCE143', 'TCE144']],
      ['002', '004', 'A003', 'A005', '006', '007', '011', '012'],
      ['1', '2']
    ],
    ['B', 624, [['-'], ['-'], ['-'], ['-']], ['013', '015', 'A014', 'A016', '017', '018', '019', '020'], ['3', '4']],
    ['C', 1039, [['-'], ['-'], ['-'], ['-']], ['021', '023', 'A022', 'A024', '025', '026', '027', '028'], ['5', '6']]
  ].forEach(([L, y, refs, n, bc], g) => {
    const pk = 'pk' + L,
      lc = 'lc' + L,
      hv = 'hv' + L,
      pe = 'pe' + L,
      io = '(TCE980-' + (g + 1) + ')',
      yl = y + 74,
      yh = y + 159,
      ye = y + (g ? 234 : 287),
      first = g === 0;
    /* the pickup, its buffers and the two connectors */
    s.push([pk, 207, y - 21, 240, y + 21], [lc, 583, yl - 12, 838, yl + 12]);
    p.push([
      [213, y - 21],
      [240, y - 21],
      [240, y + 21],
      [213, y + 21],
      [213, y + 10],
      [207, y + 10],
      [207, y - 10],
      [213, y - 10]
    ]);
    [0, 54, 107, 160].forEach((dy, i) => {
      buf(357, y + dy);
      if (i)
        w.push([
          pk,
          [
            [325, y + dy],
            [357, y + dy]
          ]
        ]);
      if (i === 1 || i === 2) {
        w.push([
          pk,
          [
            [378, y + dy],
            [408, y + dy]
          ]
        ]);
        c.push(['o' + bc[i - 1], 'out', bc[i - 1], 435, y + dy, '', ['TCE14' + i]]);
      }
      if (i === 3)
        a.push([
          [378, y + dy],
          [408, y + dy]
        ]);
    });
    w.push(
      [
        pk,
        [
          [240, y],
          [357, y]
        ]
      ],
      [
        pk,
        [
          [325, y],
          [325, y + 160]
        ]
      ],
      [
        pk,
        [
          [378, y],
          [583, y]
        ]
      ],
      [
        pk,
        [
          [583, y],
          [1374, y]
        ],
        1
      ],
      [
        lc,
        [
          [583, yl],
          [1374, yl]
        ],
        1
      ]
    );
    tri.push([575, y, 9], [575, yl, 9]);
    t.push(
      [587, y - 6, 'TURBINE SPEED 1' + L],
      [744, y - 9, io],
      [587, yl - 6, 'LOW COUNTER'],
      [743, yl - 9, '(TCE980-' + (g + 5) + ')']
    );
    mark('FTR', n[0], 903, y);
    mark('FTR', n[1], 903, yl);
    b.push(
      ['g' + n[2], 'G', n[2], 1403, y + 10, ['K:1.0'], {}, [58, 43]],
      ['g' + n[3], 'G', n[3], 1403, yl + 10, ['K:1.0'], {}, [58, 43]]
    );
    w.push(
      [
        'g' + n[2],
        [
          [1432, y],
          [E, y]
        ],
        1
      ],
      [
        'g' + n[3],
        [
          [1432, yl],
          [E, yl]
        ],
        1
      ]
    );
    /* the flags of the card */
    r.push([hv, 615, yh - 11, 125, 22, 'PTI H-valid'], [pe, 615, ye - 11, 125, 22, 'PI/O error']);
    t.push([632, yh - 15, io], [632, ye - 15, io]);
    w.push(
      [
        hv,
        [
          [740, yh],
          [E, yh]
        ]
      ],
      [
        pe,
        [
          [740, ye],
          [E, ye]
        ]
      ]
    );
    mark('BTR', n[4], 903, yh);
    mark('BTR', n[5], 1402, yh);
    mark('BTR', n[6], 903, ye);
    mark('BTR', n[7], 1402, ye);
    c.push(
      ['o' + L + '1', 'out', L + '1', XO, y, '', refs[0], 0, 1],
      ['o' + L + '2', 'out', L + '2', XO, yl, '', refs[1], 0, 1],
      ['o' + L + '3', 'out', L + '3', XO, yh, '', refs[2], 0, 1],
      ['o' + L + '5', 'out', L + '5', XO, ye, '', refs[3], 0, first ? 2 : 1]
    );
    t.push(
      [1745, y - 6, 'TURBINE SPEED 1' + L],
      [1745, yl - 6, 'TB SPD 1' + L + ' LOW COUNTER'],
      [1745, yh - 6, 'COUNTER 1' + L + ' H-FLAG'],
      [1745, ye - 6, 'COUNTER 1' + L + ' ABN']
    );
    if (first) {
      const yt = y + 223;
      r.push(['lt', 615, yt - 11, 128, 22, 'PTI L-timing']);
      t.push([632, yt - 15, io], [1745, yt - 6, 'TRIGGER OF LOGIC(1)']);
      w.push([
        'lt',
        [
          [743, yt],
          [E, yt]
        ]
      ]);
      mark('BTR', '008', 903, yt);
      mark('BTR', '009', 1402, yt);
      c.push(['oA4', 'out', 'A4', XO, yt, '', ['TCE144'], 0, 1]);
    }
    /* the table of the pickup */
    const ty = y + 191;
    [0, 1, 2, 3, 4, 5].forEach(i => rule(217, ty + 32 * i, 548, ty + 32 * i));
    rule(217, ty, 217, ty + 160);
    rule(333, ty, 333, ty + 160);
    rule(548, ty, 548, ty + 160);
    [
      ['INSTR UMENT', 'SPEED PICKUP(' + L + ')'],
      ['TAG No.', 'SE-STn001-' + (g + 1)],
      ['MODULE', '3'],
      ['TOOTH', '120'],
      ['RANGE', '0-5000rpm/0-10kHz']
    ].forEach(([k, v], i) => t.push([222, ty + 24 + 32 * i, k], [339, ty + 24 + 32 * i, v]));
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
  w.push([
    'iL',
    [
      [993, 134],
      [1951, 134]
    ]
  ]);
  mark('BTR', '001', 1405, 134);
  r.push(['', 1951, 122, 125, 24, 'PTI SW.input']);
  t.push(
    [625, 145, 'PTI'],
    [1968, 117, '(TCE980-1)'],
    [233, 1522, 'CONTROLLER:'],
    [392, 1522, 'EHG+MD'],
    [591, 1495, 'TRIGGER  :'],
    [591, 1522, 'CYCLE(ms):30']
  );
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'TCE140',
    title: 'TURBINE SPEED DIAGNOSTICS(1)',
    page: 101,
    ctl: 'EHG+MD',
    cycle: 30,
    f: [165, 78, 2224, 1541],
    c,
    r,
    s,
    p,
    l,
    a,
    tri,
    b,
    w,
    t
  });
})();
