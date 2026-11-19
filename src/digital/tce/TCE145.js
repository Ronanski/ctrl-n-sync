/* TCE145 BACK UP GOVERNOR (331DM09784 page 106, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The scan of this page is turned a little; every place is typed as it stands on the page set straight.
   The back-up governor (BUG): each of the three turbine speeds, plus the bias of the overspeed test mode (108.0 rpm, else 0.0), is compared
   with 4023.0 rpm; the three results go to a TRIPPLE INPUT DIAGNOSTICS block. Its output sets the flip-flop BUG OPERATED (to the operator
   station, the protection controllers and, inverted, TCE600) and, after 3.0 s, connector A. The flip-flop is reset by ANN RESET when the
   turbine speed is less than about rated speed. The title block of this page prints PAGE 104; it is page 106 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  const u = 2.063,
    BX = 980,
    BR = 1385,
    P = i => Math.round(184 + 15 * u + (i + 0.5) * ((224 - 30 * u) / 5)),
    c = [],
    d = [],
    b = [],
    w = [],
    t = [],
    mark = (no, x, y) => b.push(['m' + no, 'o:BTR', no, x, y]),
    box = (key, type, no, x, y, notes, pins, size) =>
      b.push([key, type, no, x, y, notes || [], pins || {}, size || [59, 43]]),
    two = (x, y, a, b2) => t.push([x, y - 27, a], [x, y - 6, b2]);
  /* the three speeds: [connector, name, y of the speed, numbers of ADD and CMP, y of the pin of the block, where the result turns up to
     the pin, where it goes down to its lamp and connector, y of the lamp, of the connector, their marks, letter] */
  [
    ['G1', '1A', P(0), '002', 'C040', P(0), 0, 852, 604, 657, '032', '033', 'A', '004'],
    ['G2', '2B', 337, '010', 'C041', P(2), 874, 829, 722, 774, '034', '035', 'B', '008'],
    ['G3', '3C', 444, '015', 'C042', P(4), 894, 806, 838, 891, '036', '037', 'C', '012']
  ].forEach(([g, nm, y, na, nc, yp, xe, xd, yl, yc, m1, m2, L, mi], i) => {
    const ka = 'add' + na,
      kc = 'cmp' + nc;
    c.push(
      ['i' + g, 'in', g, 307, y, 'TURBINE SPEED ' + nm, ['TCE143']],
      ['o' + L + '1', 'out', L + '1', 1189 - i, yc, '', ['-'], 1]
    );
    box(ka, 'ADD', na, 639, y + 11);
    box(kc, 'CMP', nc, 724, y + 11, ['HL:4023.0rpm', 'LL:4005.0rpm']);
    d.push(['crt' + L, 1190 - i, yl, 'out', 'TCE145_' + (i + 4), 'S', '#1C']);
    w.push(
      [
        'i' + g,
        [
          [334, y],
          [610, y]
        ],
        1
      ],
      [
        ka,
        [
          [669, y],
          [695, y]
        ],
        1
      ],
      [
        kc,
        xe
          ? [
              [754, y],
              [xe, y],
              [xe, yp],
              [BX, yp]
            ]
          : [
              [754, y],
              [BX, yp]
            ]
      ],
      [
        kc,
        [
          [xd, y],
          [xd, yc],
          [1162 - i, yc]
        ]
      ],
      [
        kc,
        [
          [xd, yl],
          [1155 - i, yl]
        ]
      ],
      /* the bias */
      [
        'asw',
        i
          ? [
              [585, y + 22],
              [610, y + 22]
            ]
          : [
              [558, 657],
              [585, 657],
              [585, y + 22],
              [610, y + 22]
            ],
        1
      ]
    );
    mark(mi, 927, yp);
    mark(m1, 893, yl);
    mark(m2, 892, yc);
    t.push([940 - i, yl - 6, 'BUG OPERATED (' + L + ')'], [940 - i, yc - 6, 'BUG OPERATED (' + L + ')']);
  });
  c.push(
    ['iA', 'in', 'A', 305, 551, '', ['TCE177']],
    ['oC', 'out', 'C', 2087, 158, '', ['-'], 1],
    ['oD1', 'out', 'D1', 2032, 297, '', ['TCP1120', 'TCP2120', 'TCP3120'], 1],
    ['oD2', 'out', 'D2', 2031, 425, '', ['TCE600']],
    ['oB', 'out', 'B', 2083, 489, '', ['TCE471']],
    ['oA', 'out', 'A', 2082, 574, '', ['-']],
    ['oE1', 'out', 'E1', 2027, 744, '', ['-'], 1]
  );
  d.push(
    ['crt1', 2032, P(0), 'out', 'TCE145_1', 'S', '#1C'],
    ['crt2', 2031, P(4), 'out', 'TCE145_2', 'S', '#1C'],
    ['crt3', 2027, 691, 'out', 'TCE145_3', 'S', '#1C']
  );
  box('sg19', 'SG', 'C019', 346, 668, ['K:108.0rpm']);
  box('sg23', 'SG', 'C023', 346, 774, ['K:0.0rpm']);
  box('asw', 'ASW', '020', 528, 668);
  box('ffr', 'FFR', '006', 1608, P(0) + 12, [], { l: ['S', 'R'] }, [80, 43]);
  box('not', 'NOT', '043', 1743, 436);
  box('td', 'TD', 'C017', 1476, 584, ['TD:3.0s']);
  box('lck', 'LCK', 'C025', 803, 977, ['K:3672.0rpm']);
  box('a026', 'A', '026', 1240, 977);
  w.push(
    [
      'sg19',
      [
        [376, 657],
        [498, 657]
      ],
      1
    ],
    [
      'sg23',
      [
        [376, 764],
        [475, 764],
        [475, 679],
        [498, 679]
      ],
      1
    ],
    [
      'iA',
      [
        [332, 551],
        [528, 551],
        [528, 646]
      ]
    ],
    /* BUG operated */
    [
      'tid.OUT',
      [
        [BR, P(0)],
        [1568, P(0)]
      ]
    ],
    [
      'tid.OUT',
      [
        [1416, P(0)],
        [1416, 158],
        [2060, 158]
      ]
    ],
    [
      'tid.OUT',
      [
        [1416, P(0)],
        [1416, 574],
        [1446, 574]
      ]
    ],
    [
      'ffr',
      [
        [1648, P(0)],
        [1997, P(0)]
      ]
    ],
    [
      'ffr',
      [
        [1682, P(0)],
        [1682, 425],
        [1714, 425]
      ]
    ],
    [
      'ffr',
      [
        [1682, 297],
        [2005, 297]
      ]
    ],
    [
      'ffr',
      [
        [1682, P(4)],
        [1996, P(4)]
      ]
    ],
    [
      'not',
      [
        [1773, 425],
        [2004, 425]
      ]
    ],
    [
      'kInit',
      [
        [1344, 510],
        [1477, 510],
        [1477, 562]
      ]
    ],
    [
      'td',
      [
        [1506, 574],
        [2055, 574]
      ]
    ],
    /* the input discrepancy */
    [
      'tid.DEV E',
      [
        [BR, P(4)],
        [1586, P(4)],
        [1586, 744],
        [2000, 744]
      ]
    ],
    [
      'tid.DEV E',
      [
        [1586, 489],
        [2056, 489]
      ]
    ],
    [
      'tid.DEV E',
      [
        [1586, 691],
        [1992, 691]
      ]
    ],
    /* the reset */
    [
      'kTS',
      [
        [518, 966],
        [773, 966]
      ],
      1
    ],
    [
      'lck',
      [
        [833, 966],
        [1210, 966]
      ]
    ],
    [
      'kRst',
      [
        [518, 1051],
        [1186, 1051],
        [1186, 988],
        [1210, 988]
      ]
    ],
    [
      'a026',
      [
        [1270, 966],
        [1540, 966],
        [1540, P(0) + 23],
        [1568, P(0) + 23]
      ]
    ]
  );
  mark('001', 1715, 158);
  mark('007', 1714, P(0));
  mark('009', 1713, 297);
  mark('013', 1712, P(4));
  mark('018', 1710, 574);
  mark('038', 1730, 691);
  mark('039', 1730, 744);
  t.push(
    [337, 524, 'OVER SPEED TEST MODE'],
    [337, 545, '(BK-UP)'],
    [1553, 222, 'T'],
    [1432, 565, 'T'],
    [1763, 152, 'BUG OPERATED'],
    [1762, P(0) - 6, 'BUG OPERATED'],
    [1761, 291, 'BUG OPERATED'],
    [1759, 483, 'INPUT DISCREPANCY'],
    [1759, 568, 'BUG OPERATED'],
    [430, 994, '(TCE143)'],
    [430, 1081, '(TCE050)'],
    [1255, 540, '(TCE050)'],
    [860, 960, '(less than about rated speed)'],
    [233, 1523, 'CONTROLLER:'],
    [394, 1523, 'EHG+MD'],
    [623, 1497, 'TRIGGER  :'],
    [623, 1524, 'CYCLE(ms):30']
  );
  two(1761, P(4), 'TURBINE BACK-UP OVER', 'SPEED TRIP(ANN)');
  two(1778, 425, 'NOT TURBINE BACK-UP OVER', 'SPEED TRIP');
  two(1778, 691, 'BUG OPERATED', 'INPUT ERROR');
  two(1778, 744, 'BUG OPERATED', 'INPUT ERROR');
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'TCE145',
    title: 'BACK UP GOVERNOR',
    page: 106,
    ctl: 'EHG+MD',
    cycle: 30,
    f: [165, 80, 2228, 1543],
    c,
    k: [
      ['kInit', 1110, 510, 'INITIAL', 'ref'],
      ['kTS', 284, 966, 'TURBINE SPEED', 'ref'],
      ['kRst', 284, 1051, 'ANN RESET', 'ref']
    ],
    d,
    m: [
      [
        'tid',
        'TRIPPLE INPUT DIAGNOSTICS',
        '',
        BX,
        184,
        405,
        224,
        ['IN1', '', 'IN2', '', 'IN3'],
        ['OUT', '', '', '', 'DEV E'],
        '005',
        [
          [1086, 430, '(LME105)'],
          [984, 455, 'TP:3.0']
        ]
      ]
    ],
    b,
    w,
    t
  });
})();
