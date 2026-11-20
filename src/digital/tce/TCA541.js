/* TCA541 CRITERIA CONDITION (331DM09788 page 111, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. The turbine rotor position: the middle value of the three transmitters (A, B, C) by HS 001 / 004 / 006 (the higher of
   each pair) and LS 002 (the lowest of the three), out as ROTOR POSITION and to the thrust bearing failure criteria (CMP A003 front HL 0.6 /
   LL 0.5 mm, CPL A005 rear HL -0.88 / LL -0.98 mm, both reset by INITIAL). Below it the CV chest warming time: during the CV warming control
   ASW 015 holds the count, ADD 016 adds SG A019 (K 0.1) every cycle, SUB 017 / SUB 011 give 3600 less the count, ASW 012 / LIM A013 /
   G A014 (K 0.016667) out the time remaining in minutes (C, the CRT value TCA541_A1); CMP A008 (count over 3600) ends it through NOT 009 and
   A 007. */
(function () {
  if (typeof window === 'undefined') return;
  const IX = 282 /* the input connectors */,
    OX = 2060 /* the output connectors */,
    w = [];
  /* a straight wire, thick (an analog value) or thin */
  const W = (key, pts, thick) => w.push(thick ? [key, pts, 1] : [key, pts]);
  /* the rotor position: A, B, C to the three high selects (each pair with one input twice), the low select of the three */
  W(
    'iC1',
    [
      [IX + 27, 277],
      [733, 277]
    ],
    1
  );
  W(
    'iC1',
    [
      [643, 277],
      [643, 392],
      [733, 392]
    ],
    1
  );
  W(
    'iC1',
    [
      [677, 392],
      [677, 413],
      [733, 413]
    ],
    1
  );
  W(
    'iC2',
    [
      [IX + 27, 362],
      [622, 362]
    ],
    1
  );
  W(
    'iC2',
    [
      [622, 297],
      [622, 486],
      [733, 486]
    ],
    1
  );
  W(
    'iC2',
    [
      [622, 297],
      [733, 297]
    ],
    1
  );
  W(
    'iC2',
    [
      [677, 297],
      [677, 318],
      [733, 318]
    ],
    1
  );
  W(
    'iC3',
    [
      [IX + 27, 435],
      [733, 435]
    ],
    1
  );
  W(
    'iC3',
    [
      [600, 435],
      [600, 506],
      [733, 506]
    ],
    1
  );
  W(
    'iC3',
    [
      [675, 506],
      [675, 526],
      [733, 526]
    ],
    1
  );
  W(
    'hs001',
    [
      [790, 277],
      [945, 277]
    ],
    1
  );
  W(
    'hs004',
    [
      [790, 392],
      [889, 392],
      [889, 297],
      [945, 297]
    ],
    1
  );
  W(
    'hs006',
    [
      [790, 486],
      [908, 486],
      [908, 318],
      [945, 318]
    ],
    1
  );
  W(
    'ls002',
    [
      [1003, 277],
      [1159, 277]
    ],
    1
  );
  W(
    'ls002',
    [
      [1070, 277],
      [1070, 563],
      [OX - 27, 563]
    ],
    1
  );
  W(
    'ls002',
    [
      [1070, 435],
      [1159, 435]
    ],
    1
  );
  W('cmpA003', [
    [1217, 277],
    [OX - 27, 277]
  ]);
  W('cplA005', [
    [1217, 435],
    [OX - 27, 435]
  ]);
  /* INITIAL resets the criteria and the time count */
  W('kInit', [
    [476, 171],
    [1462, 171],
    [1462, 650]
  ]);
  W('kInit', [
    [1189, 171],
    [1189, 266]
  ]);
  /* the CV chest warming time */
  W('iZ1', [
    [IX + 27, 640],
    [1729, 640]
  ]);
  W('iZ1', [
    [1323, 640],
    [1323, 757]
  ]);
  W('a007', [
    [1789, 639],
    [1843, 639],
    [1843, 597],
    [566, 597],
    [566, 778]
  ]);
  W(
    'sgA018',
    [
      [467, 862],
      [502, 862],
      [502, 809],
      [537, 809]
    ],
    1
  );
  W(
    'asw015',
    [
      [595, 788],
      [761, 788]
    ],
    1
  );
  W(
    'sgA019',
    [
      [702, 862],
      [918, 862],
      [918, 809],
      [941, 809]
    ],
    1
  );
  W(
    'sgA019',
    [
      [737, 862],
      [737, 809],
      [761, 809]
    ],
    1
  );
  W(
    'add016',
    [
      [820, 788],
      [941, 788]
    ],
    1
  );
  W(
    'add016',
    [
      [865, 788],
      [865, 735],
      [502, 735],
      [502, 788],
      [537, 788]
    ],
    1
  );
  W(
    'sgA010',
    [
      [1001, 681],
      [1045, 681],
      [1045, 769],
      [1123, 769]
    ],
    1
  );
  W(
    'sub017',
    [
      [1000, 788],
      [1123, 788]
    ],
    1
  );
  W(
    'sub017',
    [
      [1079, 788],
      [1079, 660],
      [1433, 660]
    ],
    1
  );
  W(
    'sub011',
    [
      [1181, 767],
      [1293, 767]
    ],
    1
  );
  W(
    'sgA020',
    [
      [1182, 862],
      [1268, 862],
      [1268, 788],
      [1293, 788]
    ],
    1
  );
  W(
    'asw012',
    [
      [1352, 767],
      [1432, 767]
    ],
    1
  );
  W(
    'limA013',
    [
      [1491, 767],
      [1590, 767]
    ],
    1
  );
  W(
    'gA014',
    [
      [1649, 767],
      [OX - 27, 767]
    ],
    1
  );
  W(
    'gA014',
    [
      [1693, 767],
      [1693, 885],
      [1988, 885]
    ],
    1
  );
  W(
    'gA014',
    [
      [1693, 885],
      [1693, 959],
      [1996, 959]
    ],
    1
  );
  W('cmpA008', [
    [1491, 660],
    [1591, 660]
  ]);
  W('not009', [
    [1650, 660],
    [1729, 660]
  ]);
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA541',
    title: 'CRITERIA CONDITION',
    page: 111,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [160, 85, 2208, 1550],
    k: [['kInit', 243, 171, 'INITIAL', 'ref']],
    c: [
      ['iC1', 'in', 'C1', IX, 277, 'TURBINE ROTOR POSITION (A)', ['TCE066'], 1],
      ['iC2', 'in', 'C2', IX, 362, 'TURBINE ROTOR POSITION (B)', ['TCE066'], 1],
      ['iC3', 'in', 'C3', IX, 435, 'TURBINE ROTOR POSITION (C)', ['TCE066'], 1],
      ['iZ1', 'in', 'Z1', IX, 640, 'DURING CV WARMING CONTROL', ['TCE152'], 1],
      ['oA', 'out', 'A', OX, 277, '', ['TCA542'], 0, 1],
      ['oB', 'out', 'B', OX, 435, '', ['TCA542'], 0, 1],
      ['oD', 'out', 'D', OX, 563, '', ['-'], 0, 1],
      ['oC', 'out', 'C', OX, 767, '', ['-'], 0, 1],
      ['oC1', 'out', 'C1', 2023, 959, '', ['-'], 1]
    ],
    d: [['crtA1', 2023, 885, 'out', 'TCA541_A1', 'S', '#1C']],
    b: [
      ['hs001', 'HS', '001', 762, 308, [], {}, [57, 86]],
      ['hs004', 'HS', '004', 762, 401, [], {}, [57, 86]],
      ['hs006', 'HS', '006', 762, 518, [], {}, [57, 86]],
      ['ls002', 'LS', '002', 974, 308, [], {}, [58, 86]],
      ['cmpA003', 'CMP', 'A003', 1188, 288, ['HL:0.6mm', 'LL:0.5mm']],
      ['cplA005', 'CPL', 'A005', 1188, 446, ['HL:-0.88m', 'LL:-0.98mm']],
      ['sgA018', 'SG', 'A018', 438, 873, ['K:0.0']],
      ['sgA019', 'SG', 'A019', 672, 873, ['K:0.1']],
      ['asw015', 'ASW', '015', 566, 799],
      ['add016', 'ADD', '016', 791, 799],
      ['sub017', 'SUB', '017', 971, 799, [], { l: ['+', '-'] }],
      ['sgA010', 'SG', 'A010', 971, 692, ['K:3600']],
      ['sub011', 'SUB', '011', 1152, 778, [], { l: ['+', '-'] }],
      ['sgA020', 'SG', 'A020', 1153, 873, ['K:0.0']],
      ['asw012', 'ASW', '012', 1323, 778],
      ['limA013', 'LIM', 'A013', 1462, 788, ['HL:3600.0', 'LL:0.0'], {}, [59, 64]],
      ['gA014', 'G', 'A014', 1620, 778, ['K:0.016667']],
      ['cmpA008', 'CMP', 'A008', 1462, 671, ['HL:3600.0', 'LL:0.1']],
      ['not009', 'NOT', '009', 1621, 671],
      ['a007', 'A', '007', 1759, 650],
      ['x1', 'X', '', 673, 597],
      ['x2', 'X', '', 673, 735],
      ['ftr021', 'o:FTR', '021', 1737, 885],
      ['ftr022', 'o:FTR', '022', 1737, 959]
    ],
    w,
    j: [
      [643, 277],
      [677, 392],
      [622, 362],
      [622, 297],
      [677, 297],
      [600, 435],
      [675, 506],
      [1070, 277],
      [1070, 435],
      [1189, 171],
      [1323, 640],
      [737, 862],
      [865, 788],
      [1079, 788],
      [1693, 767],
      [1693, 885]
    ],
    t: [
      [1745, 247, 'THRUST BEARING FAILURE'],
      [1745, 268, '(FRONT) ABNORMAL'],
      [1742, 407, 'THRUST BEARING FAILURE'],
      [1742, 428, '(REAR) ABNORMAL'],
      [1742, 553, 'ROTOR POSITION'],
      [1762, 854, 'CV CHEST WARMING'],
      [1762, 875, 'TIME REMAINING'],
      [1762, 928, 'CV CHEST WARMING'],
      [1762, 949, 'TIME REMAINING'],
      [1146, 266, 'T', 2],
      [1146, 424, 'T', 2],
      [1422, 649, 'T', 2],
      [378, 207, '(TCA050)'],
      [228, 1531, 'CONTROLLER:'],
      [391, 1531, 'COMM+MD'],
      [614, 1504, 'TRIGGER  :'],
      [614, 1531, 'CYCLE(ms):100']
    ]
  });
})();
