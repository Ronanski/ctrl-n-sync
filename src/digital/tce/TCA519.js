/* TCA519 STEP CONTROL CONDITION (331DM09788 page 88, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the
   page rendered 2296 wide. CRITERIA BYPASS IN PROGRESS of the criteria monitor sheets TCA550 .. TCA562 to OR 003, of TCA563 .. TCA567
   through OR 007 into the same OR = criteria bypass in progress: to the connector A, through BTR 005 to the lamp TCA519_1 and through
   BTR 006 to the connector A1. */
(typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
  id: 'TCA519',
  title: 'STEP CONTROL CONDITION',
  page: 88,
  ctl: 'COMM+MD',
  cycle: 100,
  f: [158, 84, 2220, 1548],
  k: [],
  c: [
    ['iC0', 'in', 'C', 248, 149, '', ['TCA550']],
    ['iC1', 'in', 'C', 247, 213, '', ['TCA551']],
    ['iC2', 'in', 'C', 247, 277, '', ['TCA552']],
    ['iC3', 'in', 'C', 246, 341, '', ['TCA553']],
    ['iC4', 'in', 'C', 246, 405, '', ['TCA554']],
    ['iC5', 'in', 'C', 245, 469, '', ['TCA555']],
    ['iC6', 'in', 'C', 245, 533, '', ['TCA556']],
    ['iC7', 'in', 'C', 244, 597, '', ['TCA557']],
    ['iC8', 'in', 'C', 244, 661, '', ['TCA558']],
    ['iC9', 'in', 'C', 243, 725, '', ['TCA559']],
    ['iC10', 'in', 'C', 242, 799, '', ['TCA560']],
    ['iC11', 'in', 'C', 242, 863, '', ['TCA561']],
    ['iC12', 'in', 'C', 241, 927, '', ['TCA562']],
    ['iC13', 'in', 'C', 240, 1012, '', ['TCA563']],
    ['iC14', 'in', 'C', 239, 1076, '', ['TCA564']],
    ['iC15', 'in', 'C', 239, 1140, '', ['TCA565']],
    ['iC16', 'in', 'C', 238, 1204, '', ['TCA566']],
    ['iC17', 'in', 'C', 238, 1268, '', ['TCA567']],
    ['oA', 'out', 'A', 2018, 149, '', ['-'], 0, 1],
    ['oA1', 'out', 'A1', 2036, 321, '', ['-'], 1, 3]
  ],
  d: [['crt1', 2037, 267, 'out', 'TCA519_1', 'S', '#1C']],
  b: [
    ['or003', 'OR', '003', 1102, 287, [], {}, [58, 299]],
    ['or007', 'OR', '007', 860, 1054, [], {}, [59, 106]],
    ['btr005', 'o:BTR', '005', 1677, 267],
    ['btr006', 'o:BTR', '006', 1676, 321]
  ],
  w: [
    [
      'iC0',
      [
        [275, 149],
        [1073, 149]
      ]
    ],
    [
      'iC1',
      [
        [274, 213],
        [793, 213],
        [793, 170],
        [1073, 170]
      ]
    ],
    [
      'iC2',
      [
        [274, 277],
        [813, 277],
        [813, 191],
        [1073, 191]
      ]
    ],
    [
      'iC3',
      [
        [273, 341],
        [834, 341],
        [834, 213],
        [1073, 213]
      ]
    ],
    [
      'iC4',
      [
        [273, 405],
        [855, 405],
        [855, 234],
        [1073, 234]
      ]
    ],
    [
      'iC5',
      [
        [272, 469],
        [878, 469],
        [878, 255],
        [1073, 255]
      ]
    ],
    [
      'iC6',
      [
        [272, 533],
        [899, 533],
        [899, 276],
        [1073, 276]
      ]
    ],
    [
      'iC7',
      [
        [271, 597],
        [919, 597],
        [919, 297],
        [1073, 297]
      ]
    ],
    [
      'iC8',
      [
        [271, 661],
        [941, 661],
        [941, 319],
        [1073, 319]
      ]
    ],
    [
      'iC9',
      [
        [270, 725],
        [962, 725],
        [962, 340],
        [1073, 340]
      ]
    ],
    [
      'iC10',
      [
        [269, 799],
        [983, 799],
        [983, 362],
        [1073, 362]
      ]
    ],
    [
      'iC11',
      [
        [269, 863],
        [1005, 863],
        [1005, 383],
        [1073, 383]
      ]
    ],
    [
      'iC12',
      [
        [268, 927],
        [1027, 927],
        [1027, 405],
        [1073, 405]
      ]
    ],
    [
      'iC13',
      [
        [267, 1012],
        [831, 1012]
      ]
    ],
    [
      'iC14',
      [
        [266, 1076],
        [788, 1076],
        [788, 1033],
        [831, 1033]
      ]
    ],
    [
      'iC15',
      [
        [266, 1140],
        [798, 1140],
        [798, 1055],
        [831, 1055]
      ]
    ],
    [
      'iC16',
      [
        [265, 1204],
        [808, 1204],
        [808, 1075],
        [831, 1075]
      ]
    ],
    [
      'iC17',
      [
        [265, 1268],
        [815, 1268],
        [815, 1095],
        [831, 1095]
      ]
    ],
    [
      'or007',
      [
        [889, 1012],
        [1056, 1012],
        [1056, 425],
        [1073, 425]
      ]
    ],
    [
      'or003',
      [
        [1131, 149],
        [1991, 149]
      ]
    ],
    [
      'or003',
      [
        [1634, 149],
        [1634, 267],
        [2002, 267]
      ]
    ],
    [
      'or003',
      [
        [1634, 267],
        [1634, 321],
        [2009, 321]
      ]
    ]
  ],
  j: [
    [1634, 149],
    [1634, 267]
  ],
  t: [
    [279, 142, 'CRITERIA BYPASS IN PROGRESS'],
    [278, 206, 'CRITERIA BYPASS IN PROGRESS'],
    [278, 270, 'CRITERIA BYPASS IN PROGRESS'],
    [277, 334, 'CRITERIA BYPASS IN PROGRESS'],
    [277, 398, 'CRITERIA BYPASS IN PROGRESS'],
    [276, 462, 'CRITERIA BYPASS IN PROGRESS'],
    [276, 526, 'CRITERIA BYPASS IN PROGRESS'],
    [275, 590, 'CRITERIA BYPASS IN PROGRESS'],
    [275, 654, 'CRITERIA BYPASS IN PROGRESS'],
    [274, 718, 'CRITERIA BYPASS IN PROGRESS'],
    [273, 792, 'CRITERIA BYPASS IN PROGRESS'],
    [273, 856, 'CRITERIA BYPASS IN PROGRESS'],
    [272, 920, 'CRITERIA BYPASS IN PROGRESS'],
    [273, 1005, 'CRITERIA BYPASS IN PROGRESS'],
    [272, 1069, 'CRITERIA BYPASS IN PROGRESS'],
    [272, 1133, 'CRITERIA BYPASS IN PROGRESS'],
    [271, 1197, 'CRITERIA BYPASS IN PROGRESS'],
    [271, 1261, 'CRITERIA BYPASS IN PROGRESS'],
    [1670, 142, 'CRITERIA BYPASS IN PROGRESS'],
    [1776, 238, 'CRITERIA BYPASS'],
    [1776, 259, 'IN PROGRESS'],
    [1776, 292, 'CRITERIA BYPASS'],
    [1776, 313, 'IN PROGRESS'],
    [226, 1527, 'CONTROLLER:'],
    [388, 1527, 'COMM+MD'],
    [612, 1501, 'TRIGGER  :'],
    [612, 1527, 'CYCLE(ms):100']
  ]
});
