/* TCE468 EHG ALARM(AO ERROR) (331DM09784 page 167, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the
   page rendered 2296 wide, the scan skew taken out. The PI/O errors of the AO card of slot 7 (TCE970-1, -2), OR 001 (the spare inputs
   tied to OFF(0)), are held in a flip-flop (FFS 002) until ANN RESET; it goes to the operator station lamp (CRT), A1 and the AO ERROR
   (A, TCE472). */
(typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
  id: 'TCE468',
  title: 'EHG ALARM(AO ERROR)',
  page: 167,
  ctl: 'EHG+MD',
  cycle: 30,
  f: [170, 84, 2219, 1547],
  r: [
    ['pio1', 334, 256, 127, 24, 'PI/O error'],
    ['pio2', 334, 341, 127, 24, 'PI/O error']
  ],
  k: [
    ['kOff', 305, 642, 'OFF(0)', 'sys.ref'],
    ['kAnn', 892, 642, 'ANN RESET', 'ref']
  ],
  d: [['crt1', 2025, 268, 'out', 'TCE468_1', 'S', '#1C']],
  c: [
    ['oA1', 'out', 'A1', 2014, 332, '', ['-'], 1],
    ['oA', 'out', 'A', 2080, 642, '', ['TCE472']]
  ],
  b: [
    ['or001', 'OR', '001', 951, 343, [], {}, [60, 170]],
    ['ffs002', 'FFS', '002', 1281, 279, [], { l: ['S', 'R'] }, [80, 43]],
    ['btr003', 'o:BTR', '003', 1579, 268],
    ['btr004', 'o:BTR', '004', 1579, 332],
    ['btr005', 'o:BTR', '005', 1580, 642]
  ],
  w: [
    ['pio1', [[461, 268], [921, 268]]],
    ['pio2', [[461, 353], [834, 353], [834, 290], [921, 290]]],
    /* the spare inputs of OR 001 */
    ['kOff', [[539, 642], [856, 642], [856, 312], [921, 312]]],
    ['kOff', [[856, 332], [921, 332]]],
    ['kOff', [[856, 354], [921, 354]]],
    ['kOff', [[856, 374], [921, 374]]],
    ['kOff', [[856, 396], [921, 396]]],
    ['kOff', [[856, 418], [921, 418]]],
    ['or001', [[981, 268], [1241, 268]]],
    ['kAnn', [[1126, 642], [1218, 642], [1218, 290], [1241, 290]]],
    ['ffs002', [[1321, 268], [1990, 268]]],
    ['ffs002', [[1526, 268], [1526, 642], [2053, 642]]],
    ['ffs002', [[1526, 332], [1987, 332]]]
  ],
  t: [
    [352, 249, '(TCE970-1)'],
    [352, 334, '(TCE970-2)'],
    [1227, 252, 'T', 0, 1.9],
    [1037, 668, '(TCE050)', 0, 1.7],
    [1744, 258, 'AO SLOT7 ABN', 0, 2.05],
    [1744, 322, 'AO SLOT7 ABN', 0, 2.05],
    [1670, 632, 'AO ERROR', 0, 2.05],
    [238, 1523, 'CONTROLLER:'],
    [400, 1523, 'EHG+MD'],
    [634, 1497, 'TRIGGER  :'],
    [634, 1523, 'CYCLE(ms):30']
  ]
});
