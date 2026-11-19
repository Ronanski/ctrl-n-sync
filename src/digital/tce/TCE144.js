/* TCE144 TURBINE SPEED DIAGNOSTICS(5) (331DM09784 page 105, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide.
   The trigger of the logic: the L-timing of the first pulse input card; when its counter 1A is abnormal the second switch gives the trigger of
   the second card, and when counter 2B is abnormal too, the trigger of the third. Out goes the system definition Trigger_of_LOGIC_1. The
   title block of this page prints PAGE 103; it is page 105 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  const box = (key, type, no, x, y) => [key, type, no, x, y, [], {}, [59, 43]];
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'TCE144',
    title: 'TURBINE SPEED DIAGNOSTICS(5)',
    page: 105,
    ctl: 'EHG+MD',
    cycle: 30,
    f: [167, 83, 2232, 1545],
    c: [
      ['iA', 'in', 'A5', 301, 212, 'COUNTER 1A ABN', ['TCE140'], 0, 1],
      ['iB', 'in', 'B5', 301, 318, 'COUNTER 2B ABN', ['TCE141'], 0, 1],
      ['i1', 'in', 'A4', 300, 426, 'TRIGGER OF LOGIC(1)', ['TCE140'], 0, 1],
      ['i2', 'in', 'A4', 299, 532, 'TRIGGER OF LOGIC(2)', ['TCE141'], 0, 1],
      ['i3', 'in', 'A4', 298, 638, 'TRIGGER OF LOGIC(3)', ['TCE142'], 0, 1]
    ],
    k: [['kTrg', 1918, 426, 'Trigger_of_LOGIC_1', 'sys.def', 'def']],
    b: [
      box('not1', 'NOT', '001', 1241, 222),
      box('a2', 'A', '002', 1091, 308),
      box('not3', 'NOT', '003', 825, 329),
      box('dsw4', 'DSW', '004', 1463, 437),
      box('dsw5', 'DSW', '005', 1248, 543)
    ],
    w: [
      [
        'iA',
        [
          [328, 212],
          [1212, 212]
        ]
      ],
      [
        'iA',
        [
          [1007, 212],
          [1007, 297],
          [1062, 297]
        ]
      ],
      [
        'iB',
        [
          [328, 318],
          [796, 318]
        ]
      ],
      [
        'not3',
        [
          [854, 318],
          [1062, 318]
        ]
      ],
      /* counter 1A abnormal: the upper switch takes the lower input */
      [
        'not1',
        [
          [1270, 212],
          [1463, 212],
          [1463, 415]
        ]
      ],
      /* counter 1A and not counter 2B abnormal: the lower switch */
      [
        'a2',
        [
          [1120, 297],
          [1248, 297],
          [1248, 522]
        ]
      ],
      [
        'i1',
        [
          [327, 426],
          [1434, 426]
        ]
      ],
      [
        'i2',
        [
          [326, 532],
          [1218, 532]
        ]
      ],
      [
        'i3',
        [
          [325, 638],
          [1194, 638],
          [1194, 553],
          [1218, 553]
        ]
      ],
      [
        'dsw5',
        [
          [1277, 532],
          [1410, 532],
          [1410, 447],
          [1434, 447]
        ]
      ],
      [
        'dsw4',
        [
          [1492, 426],
          [1918, 426]
        ]
      ]
    ],
    t: [
      [235, 1523, 'CONTROLLER:'],
      [396, 1523, 'EHG+MD'],
      [620, 1503, 'TRIGGER  :'],
      [620, 1530, 'CYCLE(ms):30']
    ]
  });
})();
