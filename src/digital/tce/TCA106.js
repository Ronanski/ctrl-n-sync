/* TCA106 IP/HP START MODE (331DM09788 page 40, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. HP START SELECT and IP START SELECT of TCE057 given to the start-up sheets as the definitions HP START and IP START.
   live: none; tcs.js tcsLiveRead holds no read of the start selection, so the sheet is shown without states. */
(typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
  id: 'TCA106',
  title: 'IP/HP START MODE',
  page: 40,
  ctl: 'COMM+MD',
  cycle: 100,
  f: [170, 82, 2218, 1546],
  k: [
    ['dHp', 1712, 291, 'HP START', 'def', 'def'],
    ['dIp', 1712, 398, 'IP START', 'def', 'def']
  ],
  c: [
    ['iHp', 'in', 'A', 412, 291, 'HP START SELECT', ['TCE057'], 1],
    ['iIp', 'in', 'B', 412, 398, 'IP START SELECT', ['TCE057'], 1]
  ],
  b: [
    ['btr001', 'o:BTR', '001', 1062, 291],
    ['btr002', 'o:BTR', '002', 1062, 398]
  ],
  w: [
    [
      'iHp',
      [
        [439, 291],
        [1712, 291]
      ]
    ],
    [
      'iIp',
      [
        [439, 398],
        [1712, 398]
      ]
    ]
  ],
  t: [
    [230, 1528, 'CONTROLLER:'],
    [400, 1528, 'COMM+MD'],
    [617, 1502, 'TRIGGER  :'],
    [617, 1528, 'CYCLE(ms):100']
  ]
});
