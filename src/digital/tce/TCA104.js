/* TCA104 CONTROLLER CONDITION(5) (331DM09788 page 38, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. TURBINE SPEED (from TCE143) and GEN.LOAD (from TCE070) given to the start-up sheets as definitions, and the no-receive
   alarms of the gateway CPUs (GW(A) / GW(B), stations GR1A-ST20 / ST21) and of the monitor CPUs (MNT(A) / MNT(B), stations ST26 / ST27): a
   station not received for 5 s (TP, cleared by INITIAL) sets a flip-flop that ANN RESET clears. Both monitor CPUs lost = MNT CPU NORECEIVE.
   live: none; the engine holds no state of the controller hardware, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const k = [],
    c = [],
    b = [],
    w = [],
    t = [],
    j = [];
  /* one row for each station: [station, x of its reference, y, y where INITIAL leaves its riser, TP, FFS, BTR of the ATS lamp, BTR, number, words] */
  [
    ['20', 326, 694, 607, 'A006', '007', '005', '008', 1, 'GW(A)'],
    ['21', 325, 853, 810, 'A011', '012', '010', '013', 2, 'GW(B)'],
    ['26', 323, 1013, 970, 'A016', '017', '015', '018', 3, 'MNT(A)'],
    ['27', 322, 1173, 1129, 'A021', '022', '020', '023', 4, 'MNT(B)']
  ].forEach(([st, x, y, yi, tp, ffs, b1, b2, n, name], i) => {
    k.push(['kSt' + st, x, y, 'GR1A-ST' + st + '_NoReceived', 'sys.ref']);
    b.push(
      ['tp' + tp, 'TP', tp, 778, y + 11, ['TP:5.0S']],
      ['ffs' + ffs, 'FFS', ffs, 1034, y + 11, [], { l: ['S', 'R'] }, [80, 43]],
      ['btr' + b1, 'o:BTR', b1, 1522, y - 52],
      ['btr' + b2, 'o:BTR', b2, 1522, y]
    );
    w.push(
      [
        'kSt' + st,
        [
          [x + 234, y],
          [748, y]
        ]
      ],
      [
        'tp' + tp,
        [
          [808, y],
          [994, y]
        ]
      ],
      [
        'ffs' + ffs,
        [
          [1074, y],
          [2049, y]
        ]
      ],
      [
        'ffs' + ffs,
        [
          [1470, y],
          [1470, y - 52],
          [1943, y - 52]
        ]
      ],
      /* INITIAL clears the TP from the top, ANN RESET resets the flip-flop */
      i === 0
        ? [
            'kInit',
            [
              [561, 607],
              [778, 607],
              [778, y - 10]
            ]
          ]
        : [
            'kInit',
            [
              [716, yi],
              [778, yi],
              [778, y - 10]
            ]
          ],
      i === 0
        ? [
            'kAnn',
            [
              [555, 1279],
              [957, 1279],
              [957, y + 21],
              [994, y + 21]
            ]
          ]
        : [
            'kAnn',
            [
              [957, y + 21],
              [994, y + 21]
            ]
          ]
    );
    j.push([1470, y]);
    if (i) j.push([957, y + 21]);
    if (i && i < 3) j.push([716, yi]);
    c.push(['oC' + n, 'out', 'C' + n, 1970, y - 52, '', ['-'], 1], ['oD' + n, 'out', 'D' + n, 2076, y, '', ['-']]);
    t.push(
      [731, y - 2, 'C'],
      [976, y - 18, 'C'],
      [1633, y - 60, name + ' CPU NORECEIVE(ATS)'],
      [1633, y - 8, name + ' CPU NORECEIVE']
    );
  });
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA104',
    title: 'CONTROLLER CONDITION(5)',
    page: 38,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    k: [
      ['kInit', 327, 607, 'INITIAL', 'ref'],
      ...k,
      ['kAnn', 321, 1279, 'ANN RESET', 'ref'],
      ['dSpd', 1925, 150, 'TURBINE SPEED', 'def', 'def'],
      ['dLoad', 1923, 289, 'GEN.LOAD', 'def', 'def']
    ],
    c: [
      ['iSpd', 'in', 'A1', 357, 150, 'TURBINE SPEED', ['TCE143'], 1],
      ['iLoad', 'in', 'A1', 367, 289, 'GENERATOR LOAD', ['TCE070'], 1],
      ...c,
      ['oE', 'out', 'E', 2069, 1259, '', ['-']]
    ],
    b: [
      ['ftr001', 'o:FTR', '001', 1126, 150],
      ['ftr002', 'o:FTR', '002', 1124, 289],
      ...b,
      ['a024', 'A', '024', 1359, 1269]
    ],
    w: [
      [
        'iSpd',
        [
          [384, 150],
          [1925, 150]
        ],
        1
      ],
      [
        'iLoad',
        [
          [394, 289],
          [1923, 289]
        ],
        1
      ],
      [
        'kInit',
        [
          [716, 607],
          [716, 1129]
        ]
      ],
      ...w,
      /* both monitor CPUs not received */
      [
        'ffs017',
        [
          [1286, 1013],
          [1286, 1259],
          [1329, 1259]
        ]
      ],
      [
        'ffs022',
        [
          [1264, 1173],
          [1264, 1280],
          [1329, 1280]
        ]
      ],
      [
        'a024',
        [
          [1389, 1259],
          [2042, 1259]
        ]
      ]
    ],
    j: [[716, 607], [1286, 1013], [1264, 1173], ...j],
    t: [
      [470, 645, '(TCA100)'],
      [464, 1316, '(TCA100)'],
      [1626, 1251, 'MNT CPU NORECEIVE'],
      [230, 1528, 'CONTROLLER:'],
      [400, 1528, 'COMM+MD'],
      [612, 1502, 'TRIGGER  :'],
      [612, 1528, 'CYCLE(ms):100'],
      ...t
    ]
  });
})();
