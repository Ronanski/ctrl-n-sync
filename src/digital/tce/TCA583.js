/* TCA583 EXCI./SYNC./LOAD UP CONTROL (331DM09788 page 141, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. The macro block (EXCI./SYNC./LOADUP, LMA566) takes the ATS steps 4 to 6, the 41 / 52G close, the ASD in use and the initial
   load; it gives the excitation start, the ASD2 (52L) / ASD1 (52G) start, the initial load hold timer, the ICV to CV transfer and the initial load set.
   The reheat bowl steam pressure (MR 8.5 / 7.0 kg/cm2g) has to be up before the load up starts. The TW blocks hold 3 s and are cleared by INITIAL. */
(typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
  id: 'TCA583',
  title: 'EXCI./SYNC./LOAD UP CONTROL',
  page: 141,
  ctl: 'COMM+MD',
  cycle: 100,
  f: [170, 82, 2218, 1546],
  /* live: the engine state of the signals named on this sheet (tcs.js tcsLiveRead): 52G CLOSE */
  live: { k52: 'g52' },
  k: [
    ['kInit', 343, 186, 'INITIAL', 'ref'],
    ['k41', 343, 497, '41 CLOSE', 'ref'],
    ['k52', 343, 666, '52G CLOSE', 'ref'],
    ['kLoad', 343, 751, 'GEN.LOAD>INIT.LOAD', 'ref']
  ],
  c: [
    ['iS4', 'in', 'C', 328, 259, 'STEP 4 EXECUTING', ['TCA524']],
    ['iS5', 'in', 'C', 328, 340, 'STEP 5 EXECUTING', ['TCA525']],
    ['iS6', 'in', 'C', 328, 414, 'STEP 6 EXECUTING', ['TCA526']],
    ['iAsd', 'in', 'H', 328, 585, 'CRI 1.46 ASD IN USE', ['TCA533']],
    ['iHouse', 'in', 'C', 328, 866, 'HOUSE LOAD OPEARATION', ['TCA544']],
    ['iRh', 'in', 'B2', 320, 1005, 'HOT REHEAT STEAM PRESS.', ['TCA532']],
    ['oA1', 'out', 'A1', 2067, 259, '', ['TCA832']],
    ['oA2', 'out', 'A2', 2067, 354, '', ['TCE178'], 1],
    ['oA3', 'out', 'A3', 2067, 450, '', ['TCA585', 'TCA586']],
    ['oA4', 'out', 'A4', 2067, 547, '', ['TCE184'], 1],
    ['oA5', 'out', 'A5', 2067, 641, '', ['-'], 1],
    ['oB2', 'out', 'B2', 2067, 748, '', ['TCE178'], 1],
    ['oC', 'out', 'C', 2067, 1005, '', ['TCE184'], 1]
  ],
  b: [
    ['btr001', 'o:BTR', '001', 778, 259],
    ['btr005', 'o:BTR', '005', 778, 340],
    ['btr008', 'o:BTR', '008', 778, 414],
    ['btr010', 'o:BTR', '010', 778, 497],
    ['btr013', 'o:BTR', '013', 778, 585],
    ['btr015', 'o:BTR', '015', 778, 666],
    ['btr016', 'o:BTR', '016', 778, 751],
    ['btr003', 'o:BTR', '003', 1525, 259],
    ['btr006', 'o:BTR', '006', 1525, 354],
    ['btr009', 'o:BTR', '009', 1525, 450],
    ['btr014', 'o:BTR', '014', 1525, 641],
    ['btr018', 'o:BTR', '018', 1525, 748],
    ['btr021', 'o:BTR', '021', 1513, 866],
    ['twA004', 'TW', 'A004', 1685, 268, ['TW:3.0S']],
    ['a017', 'A', '017', 1685, 363],
    ['a022', 'A', '022', 1546, 556],
    ['twA012', 'TW', 'A012', 1685, 556, ['TW:3.0S']],
    ['not020', 'NOT', '020', 1662, 778],
    ['a019', 'A', '019', 1749, 757],
    ['mrA023', 'MR', 'A023', 1110, 1014, ['HL:8.5kg/cm2g', 'LL:7.0kg/cm2g']],
    ['sgA025', 'SG', 'A025', 927, 1091, ['K:0.0']],
    ['not024', 'NOT', '024', 1259, 1016]
  ],
  m: [
    [
      'mt1',
      'EXCI./SYNC./LOADUPMT1',
      '',
      1142,
      227,
      235,
      192,
      ['EXECUT1', 'EXECUT2', 'EXECUT3', 'FIELD', 'ASS', 'GCB', 'LOAD'],
      ['START1', 'START2', 'START3', 'LOADUP', 'INIT'],
      '002',
      [[1223, 445, '(LMA566)']],
      [
        [259, 280, 302, 323, 345, 366, 388],
        [259, 280, 302, 323, 345]
      ]
    ]
  ],
  w: [
    /* the macro inputs: the ATS steps 4 to 6, 41 close, ASD in use, 52G close, generator load over the initial load */
    ['iS4', [[355, 259], [1142, 259]]],
    ['iS5', [[355, 340], [992, 340], [992, 280], [1142, 280]]],
    ['iS6', [[355, 414], [1013, 414], [1013, 302], [1142, 302]]],
    ['k41', [[576, 497], [1035, 497], [1035, 323], [1142, 323]]],
    ['iAsd', [[355, 585], [1056, 585], [1056, 345], [1142, 345]]],
    ['k52', [[576, 666], [1077, 666], [1077, 366], [1142, 366]]],
    ['kLoad', [[576, 751], [1099, 751], [1099, 388], [1142, 388]]],
    /* INITIAL clears the two TW */
    ['kInit', [[576, 186], [1685, 186], [1685, 247]]],
    ['kInit', [[1620, 186], [1620, 513], [1685, 513], [1685, 535]]],
    /* the macro outputs */
    ['mt1.START1', [[1377, 259], [1655, 259]]],
    ['twA004', [[1715, 259], [2040, 259]]],
    ['mt1.START2', [[1377, 280], [1483, 280], [1483, 748], [1719, 748]]],
    ['mt1.START2', [[1483, 354], [1655, 354]]],
    ['a017', [[1715, 354], [2040, 354]]],
    ['mt1.START3', [[1377, 302], [1462, 302], [1462, 450], [2040, 450]]],
    ['mt1.LOADUP', [[1377, 323], [1441, 323], [1441, 547], [1516, 547]]],
    ['a022', [[1576, 547], [1655, 547]]],
    ['twA012', [[1715, 547], [2040, 547]]],
    ['mt1.INIT', [[1377, 345], [1419, 345], [1419, 641], [2040, 641]]],
    /* house load operation blocks the ASD2 start and lets the ASD1 start through */
    ['iHouse', [[355, 866], [1588, 866], [1588, 373], [1655, 373]]],
    ['iHouse', [[1588, 767], [1632, 767]]],
    ['not020', [[1691, 767], [1719, 767]]],
    ['a019', [[1779, 748], [2040, 748]]],
    /* reheat bowl steam pressure OK: the hot reheat pressure over the MR set (SG K 0.0) */
    ['iRh', [[347, 1005], [1080, 1005]], 1],
    ['sgA025', [[957, 1080], [992, 1080], [992, 1024], [1080, 1024]], 1],
    ['mrA023', [[1140, 1005], [1229, 1005]]],
    ['not024', [[1289, 1005], [2040, 1005]]],
    ['not024', [[1343, 1005], [1343, 566], [1516, 566]]]
  ],
  j: [
    [1620, 186],
    [1483, 354],
    [1588, 767],
    [1343, 1005]
  ],
  t: [
    [476, 224, '(TCA100)'],
    [476, 535, '(TCA103)'],
    [476, 704, '(TCA103)'],
    [476, 789, '(TCA103)'],
    [1645, 242, 'C', 2],
    [1645, 530, 'C', 2],
    [1752, 247, 'EXCITATION START'],
    [1783, 322, 'ASD2 START'],
    [1783, 343, '(52L)'],
    [1753, 418, 'INITIAL LOAD HOLD TIMER'],
    [1753, 439, 'START'],
    [1751, 514, 'LOAD UP START'],
    [1751, 535, '(ICV TO CV TRANSFER)'],
    [1753, 631, 'SET INITIAL LOAD'],
    [1858, 715, 'ASD1 START'],
    [1858, 737, '(52G)'],
    [1643, 989, 'REHEAT BOWL STEAM PRESS OK'],
    [230, 1528, 'CONTROLLER:'],
    [400, 1528, 'COMM+MD'],
    [620, 1500, 'TRIGGER  :'],
    [620, 1526, 'CYCLE(ms):100']
  ]
});
