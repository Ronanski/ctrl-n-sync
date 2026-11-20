/* TCA540 CRITERIA CONDITION (331DM09788 page 110, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. CRI 1.12 LP exhaust hood steam temp. not high: CMP 002 of the LP exhaust hood temp. (HL 80.0 / LL 77.0 degC, reset by
   INITIAL), NOT 001 out as A; the high also a lamp of the operator station (CRT TCA540_1). */
(function () {
  if (typeof window === 'undefined') return;
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA540',
    title: 'CRITERIA CONDITION',
    page: 110,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [160, 85, 2208, 1550],
    k: [['kInit', 249, 164, 'INITIAL', 'ref']],
    c: [
      ['iA1', 'in', 'A1', 285, 238, '', ['TCE069'], 1],
      ['oA', 'out', 'A', 2139, 238, '', ['TCA768', 'TCA553'], 0, 1]
    ],
    d: [['crt1', 2092, 376, 'out', 'TCA540_1', 'S', '#1C']],
    b: [
      ['cmp002', 'CMP', '002', 925, 249, ['HL:80.0degC', 'LL:77.0degC']],
      ['not001', 'NOT', '001', 1160, 249],
      ['btr003', 'o:BTR', '003', 1668, 376]
    ],
    w: [
      [
        'iA1',
        [
          [312, 238],
          [896, 238]
        ],
        1
      ],
      [
        'kInit',
        [
          [483, 164],
          [925, 164],
          [925, 228]
        ]
      ],
      [
        'cmp002',
        [
          [954, 238],
          [1130, 238]
        ]
      ],
      [
        'cmp002',
        [
          [1031, 238],
          [1031, 376],
          [2057, 376]
        ]
      ],
      [
        'not001',
        [
          [1190, 238],
          [2112, 238]
        ]
      ]
    ],
    j: [[1031, 238]],
    t: [
      [337, 227, 'LP EXHAUST HOOD TEMP.'],
      [380, 197, '(TCA050)'],
      [878, 228, 'T', 2],
      [1801, 207, 'CRI 1.12 LP EXHAUST HOOD'],
      [1801, 228, 'STEAM TEMP NOT HIGH'],
      [1803, 345, 'LP EXHAUST HOOD'],
      [1803, 366, 'STEAM TEMP HIGH'],
      [236, 1531, 'CONTROLLER:'],
      [393, 1531, 'COMM+MD'],
      [656, 1504, 'TRIGGER  :'],
      [656, 1530, 'CYCLE(ms):100']
    ]
  });
})();
