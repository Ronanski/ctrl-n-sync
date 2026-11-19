/* TCE166 ACCELERATION RELAY (331DM09784 page 116, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page rendered 2296 wide. */
(typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
  id: 'TCE166',
  title: 'ACCELERATION RELAY',
  page: 116,
  ctl: 'EHG+MD',
  cycle: 30,
  f: [165, 85, 2215, 1545],
  k: [
    ['kHp', 285, 256, 'HP START', 'ref'],
    ['kSpd', 285, 330, 'TURBINE SPEED', 'ref'],
    ['kAnn', 278, 821, 'ANN RESET', 'ref']
  ],
  c: [
    ['iB', 'in', 'B', 296, 651, 'FASV OPERATED', ['TCE182']],
    ['oA', 'out', 'A', 2079, 259, 'ACC.RELAY OPERATED', ['TCE053', 'TCE095', 'TCE170', 'TCE601', 'TCE602']],
    ['oB', 'out', 'B', 2078, 387, '', ['TCP1230', 'TCP2230', 'TCP3230'], 1],
    ['oA1', 'out', 'A1', 2072, 879, '', ['-'], 1]
  ],
  d: [['dAcc', 2018, 801, 'out', 'TCE166_1', 'S', '#1C']],
  m: [
    [
      'acc',
      'ACCELERATION RELAY',
      '',
      908,
      209,
      405,
      319,
      ['HPMODE', 'SPEED', 'ACC.S', 'OPE.S', 'BACK.S', 'CLOSE', 'RATEDS', ''],
      ['OPE', '', '', '', '', '', '', ''],
      'C001',
      [
        [1013, 551, '(LME249)'],
        [906, 575, 'DEF K:1.0'],
        [906, 596, 'DEF K:0.0rpm/S'],
        [906, 617, 'DEF K:0.0rpm'],
        [906, 638, 'DEF K:0.0rpm/S'],
        [906, 660, 'DEF K:0.0rpm'],
        [943, 681, 'K:1.005'],
        [906, 702, 'DEF K:0.0rpm'],
        [906, 723, 'DEF TP:10.0S']
      ]
    ]
  ],
  b: [
    ['sgA003', 'SG', 'A003', 502, 415],
    ['sgA004', 'SG', 'A004', 501, 490],
    ['sgA005', 'SG', 'A005', 500, 565],
    ['sgA006', 'SG', 'A006', 498, 724],
    ['ffs008', 'FFS', '008', 1625, 810, [], { l: ['S', 'R'] }, [80, 43]],
    ['btr002', 'o:BTR', '002', 1366, 257],
    ['btr007', 'o:BTR', '007', 1510, 799],
    ['btr010', 'o:BTR', '010', 1360, 821],
    ['btr009', 'o:BTR', '009', 1733, 799],
    ['btr011', 'o:BTR', '011', 1733, 877]
  ],
  w: [
    /* the conditions and the settings of the acceleration relay */
    ['kHp', [[520, 257], [908, 257]]],
    ['kSpd', [[520, 330], [737, 330], [737, 289], [908, 289]], 1],
    ['sgA003', [[532, 405], [757, 405], [757, 321], [908, 321]], 1],
    ['sgA004', [[531, 479], [778, 479], [778, 353], [908, 353]], 1],
    ['sgA005', [[530, 555], [799, 555], [799, 385], [908, 385]], 1],
    ['iB', [[323, 650], [820, 650], [820, 417], [908, 417]]],
    ['sgA006', [[528, 714], [840, 714], [840, 449], [908, 449]], 1],
    /* ACC.RELAY OPERATED: out, and kept for the CRT lamp until ANN RESET */
    ['acc.OPE', [[1313, 257], [2052, 257]]],
    ['acc.OPE', [[1663, 257], [1663, 386], [2052, 386]]],
    ['acc.OPE', [[1472, 257], [1472, 799], [1585, 799]]],
    ['kAnn', [[513, 821], [1585, 821]]],
    ['ffs008', [[1665, 799], [1994, 799]]],
    ['ffs008', [[1700, 799], [1700, 877], [2045, 877]]]
  ],
  t: [
    [462, 286, '(TCE057)'],
    [462, 360, '(TCE143)'],
    [301, 407, 'ACC.RATE SET'],
    [333, 437, 'K:55.7rpm/S'],
    [301, 482, 'OPERATED SPEED'],
    [331, 511, 'K:3672.0rpm'],
    [300, 556, 'BACK UP SPEED'],
    [331, 586, 'K:3780.0rpm'],
    [298, 716, 'RATED SPEED'],
    [329, 745, 'K:3600.0rpm'],
    [455, 850, '(TCE050)'],
    [1573, 790, 'T'],
    [1790, 776, 'ACCELERATION'],
    [1790, 796, 'RELAY OPERATED'],
    [1790, 851, 'ACCELERATION'],
    [1790, 872, 'RELAY OPERATED'],
    [221, 1524, 'CONTROLLER:'],
    [382, 1524, 'EHG+MD'],
    [607, 1499, 'TRIGGER  :'],
    [607, 1526, 'CYCLE(ms):30']
  ]
});
