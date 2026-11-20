/* TCE179 RATED SPEED ADJUST (331DM09784 page 126, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the
   page rendered 2296 wide. 10 s after HEAT SOAK BIAS "0" ends (TP C001) and not at the CV hold speed, in governing mode the speed is
   raised while it is under 3595 rpm (INC.SPEED) and lowered while it is over 3600 rpm (DEC.SPEED); each blocks the other. GENERATOR LOAD
   = the simulator generator load in simulation use, else the measured load. */
(typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
  id: 'TCE179',
  title: 'RATED SPEED ADJUST',
  page: 126,
  ctl: 'EHG+MD',
  cycle: 30,
  f: [183, 80, 2235, 1540],
  /* live: the engine's state of the signals named on this sheet (tcs.js tcsLiveRead) */
  live: { kSpd: ['rpm', 'rpm'] },
  k: [
    ['kInit', 298, 165, 'INITIAL', 'ref'],
    ['kSpd', 291, 656, 'TURBINE SPEED', 'ref'],
    ['kGov', 287, 974, 'GOVERNING MODE', 'ref'],
    ['kSim', 286, 1070, 'SIMULATION USE', 'ref']
  ],
  c: [
    ['iHs', 'in', 'B', 313, 276, 'HEAT SOAK BIAS"0"', ['TCE207']],
    ['iCv', 'in', 'E', 311, 489, 'AT CV HOLD SPEED', ['TCE163']],
    ['iSim', 'in', 'C', 300, 1167, 'SIMULATOR GENERATOR LOAD', ['TCE500']],
    ['iGen', 'in', 'A', 298, 1243, 'GENERATOR LOAD', ['TCE070']],
    ['oA', 'out', 'A', 2093, 276, 'INC.SPEED(HEAT SOAK RESET)', ['TCE195']],
    ['oB', 'out', 'B', 2090, 468, 'DEC.SPEED(HEAT SOAK RESET)', ['TCE195']],
    ['oC', 'out', 'C', 2080, 1169, 'GENERATOR LOAD', ['TCE184', 'TCE190', 'TCE191', 'TCE222']]
  ],
  b: [
    ['tpC001', 'TP', 'C001', 688, 284, ['TP:10.0s']],
    ['not002', 'NOT', '002', 901, 284],
    ['not005', 'NOT', '005', 900, 411],
    ['not008', 'NOT', '008', 685, 497],
    ['not009', 'NOT', '009', 898, 519],
    ['a003', 'A', '003', 1221, 295, [], {}, [59, 64]],
    ['a006', 'A', '006', 1218, 487, [], {}, [59, 64]],
    ['a004', 'A', '004', 1540, 295, [], {}, [59, 64]],
    ['a007', 'A', '007', 1537, 487, [], {}, [59, 64]],
    ['x1', 'X', '', 1216, 596],
    ['x2', 'X', '', 1215, 767],
    /* the speed band: under 3595 rpm, over 3600 rpm */
    ['sub010', 'SUB', '010', 683, 667],
    ['lckA011', 'LCK', 'A011', 896, 667, ['K:0.0rpm']],
    ['sgC012', 'SG', 'C012', 394, 772],
    ['sub013', 'SUB', '013', 681, 848],
    ['uckA014', 'UCK', 'A014', 894, 848, ['K:0.0rpm']],
    ['sgC015', 'SG', 'C015', 393, 870],
    /* the generator load */
    ['asw016', 'ASW', '016', 826, 1177]
  ],
  w: [
    /* the heat soak reset */
    ['kInit', [[533, 164], [688, 164], [688, 262]]],
    ['iHs', [[340, 273], [658, 273]]],
    ['tpC001', [[718, 273], [872, 273]]],
    ['not002', [[930, 273], [1191, 273]]],
    ['not002', [[1146, 273], [1146, 465], [1188, 465]]],
    ['iCv', [[338, 486], [656, 486]]],
    ['not008', [[714, 486], [1188, 486]]],
    ['not008', [[1123, 486], [1123, 295], [1191, 295]]],
    ['not005', [[929, 400], [1167, 400], [1167, 316], [1191, 316]]],
    ['not009', [[927, 508], [1188, 508]]],
    ['a003', [[1251, 273], [1510, 273]]],
    ['a006', [[1248, 465], [1507, 465]]],
    ['a004', [[1570, 273], [2066, 273]]],
    ['a004', [[1718, 273], [1718, 767], [800, 767], [800, 508], [869, 508]]],
    ['a007', [[1567, 465], [2063, 465]]],
    ['a007', [[1695, 465], [1695, 596], [823, 596], [823, 400], [871, 400]]],
    /* the speed band */
    ['kSpd', [[526, 655], [654, 655]], 1],
    ['kSpd', [[597, 655], [597, 837], [652, 837]], 1],
    ['sgC012', [[423, 761], [617, 761], [617, 678], [654, 678]], 1],
    ['sgC015', [[422, 859], [652, 859]], 1],
    ['sub010', [[712, 656], [866, 656]], 1],
    ['sub013', [[710, 837], [864, 837]], 1],
    ['lckA011', [[926, 656], [1418, 656], [1418, 295], [1510, 295]]],
    ['uckA014', [[923, 837], [1440, 837], [1440, 487], [1507, 487]]],
    ['kGov', [[522, 973], [1463, 973], [1463, 316], [1510, 316]]],
    ['kGov', [[1463, 508], [1507, 508]]],
    /* the generator load */
    ['kSim', [[521, 1069], [826, 1069], [826, 1156]]],
    ['iSim', [[327, 1166], [796, 1166]], 1],
    ['iGen', [[325, 1240], [750, 1240], [750, 1188], [796, 1188]], 1],
    ['asw016', [[856, 1166], [2053, 1166]], 1]
  ],
  t: [
    [479, 191, '(TCE050)'],
    [471, 682, '(TCE143)'],
    [466, 1000, '(TCE167)'],
    [465, 1096, '(TCE052)'],
    [645, 263, 'T'],
    [645, 648, '+'],
    [645, 669, '-'],
    [643, 828, '+'],
    [643, 849, '-'],
    [322, 759, 'LOWER'],
    [229, 783, 'K:3595.0rpm'],
    [287, 855, 'UPPER'],
    [229, 879, 'K:3600.0rpm'],
    [231, 1514, 'CONTROLLER:'],
    [393, 1514, 'EHG+MD'],
    [617, 1490, 'TRIGGER  :'],
    [617, 1516, 'CYCLE(ms):30']
  ]
});
