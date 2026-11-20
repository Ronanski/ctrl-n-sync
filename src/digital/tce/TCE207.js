/* TCE207 FLOW CONTROL(2) (331DM09784 page 141, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the
   page rendered 2296 wide. The HEAT SOAK CONTROL macro A007 (LME242 / LME243): DEMAND = FLOW DEMAND, OPEN1 = CV OPENING BIAS (SG C008
   20.0 %), OPEN2 = ICV MIN OPENING (SG C009 -0.5 %), CV HLD = AT CV HOLD SPEED +TD60S, CONT = SPEED CONTROL MODE, HOLD = SPEED HOLD,
   RESET = not HEAT SOAK MODE, S.SEL1 = 1800 RPM SELECTED, S.SEL2 = 2700 RPM SELECTED, S.TARG = TW C014 (1.0 s) after 2700 or 3600 RPM
   SELECTED (OR013), with INITIAL. CV FLOW DEMAND = ASW006 (switched by not FASV OPERATED, NOT001: ASW005, else 0.0), ASW005 = FLOW
   DEMAND or the macro CV output, switched by A003 (not HEAT SOAK CONTROL (NOT002) and BIAS.C). CV OPEN = CMP C004
   (20.5 / 20.0 %), ICV OPEN = CMP C010 (0.2 / 0.1 %), ICV open demand > 0.1 % = CMP C011 (0.1 / 0.1 %), all three with INITIAL. */
(typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
  id: 'TCE207',
  title: 'FLOW CONTROL(2)',
  page: 141,
  ctl: 'EHG+MD',
  cycle: 30,
  f: [172, 88, 2222, 1552],
  /* live: the engine's state of the signals named on this sheet (tcs.js tcsLiveRead) */
  live: { kFd: ['fd', '%'] },
  k: [
    ['kInit', 287, 146, 'INITIAL', 'ref'],
    ['kHsc', 287, 317, 'HEAT SOAK CONTROL', 'ref'],
    ['kFd', 287, 424, 'FLOW DEMAND', 'ref'],
    ['kZero', 1277, 550, '0.0', 'sys.ref']
  ],
  c: [
    ['iFasv', 'in', 'B', 303, 223, 'FASV OPERATED', ['TCE182']],
    ['iHold', 'in', 'D', 297, 883, '', ['TCE163']], /* two lines (texts) */
    ['iScm', 'in', 'B', 297, 947, 'SPEED CONTROL MODE', ['TCE167']],
    ['iSh', 'in', 'B', 297, 1011, 'SPEED HOLD', ['TCE164']],
    ['iHsm', 'in', 'C', 297, 1075, 'HEAT SOAK MODE', ['TCE163']],
    ['i1800', 'in', 'B', 297, 1139, '1800 RPM SELECTED', ['TCE162']],
    ['i2700', 'in', 'C', 297, 1203, '2700 RPM SELECTED', ['TCE162']],
    ['i3600', 'in', 'D', 297, 1267, '3600 RPM SELECTED', ['TCE162']],
    ['oD', 'out', 'D', 2080, 319, 'CV OPEN', ['-'], 1],
    ['oA', 'out', 'A', 2080, 426, 'CV FLOW DEMAND', ['TCE182', 'TCE212']],
    ['oB', 'out', 'B', 2078, 653, 'HEAT SOAK BIAS"0"', ['TCE179']],
    ['oC', 'out', 'C', 2078, 716, 'ICV FLOW DEMAND', ['TCE214']],
    ['oE', 'out', 'E', 2080, 820, 'ICV OPEN', ['-'], 1],
    ['oF', 'out', 'F', 2078, 936, '', []] /* two lines and the reference below (texts) */
  ],
  b: [
    ['not001', 'NOT', '001', 1306, 231],
    ['not002', 'NOT', '002', 1007, 327],
    ['a003', 'A', '003', 1305, 327],
    ['asw005', 'ASW', '005', 1399, 434],
    ['asw006', 'ASW', '006', 1591, 434],
    ['cmpC004', 'CMP', 'C004', 1719, 327, ['HL:20.5%', 'LL:20.0%']],
    ['sgC008', 'SG', 'C008', 438, 691, ['K:20.0%']],
    ['sgC009', 'SG', 'C009', 438, 775, ['K:-0.5%']],
    ['cmpC010', 'CMP', 'C010', 1715, 828, ['HL:0.2%', 'LL:0.1%']],
    ['cmpC011', 'CMP', 'C011', 1715, 944, ['HL:0.1%', 'LL:0.1%']],
    ['not012', 'NOT', '012', 618, 1083],
    ['or013', 'OR', '013', 595, 1275],
    ['twC014', 'TW', 'C014', 680, 1275, ['TW:1.0S']]
  ],
  m: [
    [
      'hsc',
      'HEAT SOAK CONTROL',
      '',
      779,
      603,
      404,
      537,
      ['DEMAND', 'OPEN1', 'OPEN2', 'CV HLD', 'CONT', 'HOLD', 'RESET', '', '', 'S.SEL1', 'S.SEL2', '', 'S.TARG', '', ''],
      ['BIAS.C', 'CV', 'ICV', 'RESET', '', '', '', '', '', '', '', '', '', '', ''],
      'A007',
      [
        [884, 1164, '(LME242)'],
        [1002, 1164, '(LME243)'],
        [775, 1187, 'DEF TD:0.05S'],
        [775, 1209, 'DEF TP:1.0S'],
        [783, 1230, 'TP:180.0S'],
        [775, 1251, 'DEF TW:0.03S'],
        [775, 1273, 'DEF TD:1.0S'],
        [775, 1294, 'DEF TD:2.0S'],
        [775, 1315, 'DEF RI:0.03%'],
        [795, 1337, 'RD:0.03%'],
        [775, 1358, 'DEF K:0.1%']
      ]
    ]
  ],
  w: [
    /* INITIAL */
    ['kInit', [[522, 145], [1719, 145], [1719, 306]]],
    ['kInit', [[566, 145], [566, 1231], [680, 1231], [680, 1254]]],
    ['kInit', [[1661, 145], [1661, 784], [1715, 784], [1715, 807]]],
    ['kInit', [[1661, 784], [1661, 903], [1715, 903], [1715, 923]]],
    /* CV FLOW DEMAND */
    ['iFasv', [[330, 220], [1277, 220]]],
    ['not001', [[1335, 220], [1591, 220], [1591, 413]]],
    ['kHsc', [[522, 316], [978, 316]]],
    ['not002', [[1036, 316], [1276, 316]]],
    ['a003', [[1334, 316], [1399, 316], [1399, 413]]],
    ['kFd', [[522, 423], [1370, 423]], 1],
    ['kFd', [[749, 423], [749, 650], [779, 650]], 1],
    ['hsc.CV', [[1183, 681], [1248, 681], [1248, 445], [1370, 445]], 1],
    ['asw005', [[1428, 423], [1562, 423]], 1],
    ['kZero', [[1512, 549], [1535, 549], [1535, 445], [1562, 445]], 1],
    ['asw006', [[1620, 423], [2053, 423]], 1],
    ['asw006', [[1645, 423], [1645, 316], [1690, 316]], 1],
    ['cmpC004', [[1748, 316], [2053, 316]]],
    /* HEAT SOAK BIAS and ICV */
    ['hsc.BIAS.C', [[1183, 650], [2051, 650]]],
    ['hsc.BIAS.C', [[1228, 650], [1228, 338], [1276, 338]]],
    ['hsc.ICV', [[1183, 713], [2051, 713]], 1],
    ['hsc.ICV', [[1640, 713], [1640, 933], [1686, 933]], 1],
    ['hsc.ICV', [[1640, 817], [1686, 817]], 1],
    ['cmpC010', [[1744, 817], [2053, 817]]],
    ['cmpC011', [[1744, 933], [2051, 933]]],
    /* the macro inputs */
    ['sgC008', [[467, 680], [779, 680]], 1],
    ['sgC009', [[467, 764], [587, 764], [587, 713], [779, 713]], 1],
    ['iHold', [[324, 880], [608, 880], [608, 745], [779, 745]]],
    ['iScm', [[324, 944], [628, 944], [628, 776], [779, 776]]],
    ['iSh', [[324, 1008], [650, 1008], [650, 808], [779, 808]]],
    ['iHsm', [[324, 1072], [589, 1072]]],
    ['not012', [[647, 1072], [671, 1072], [671, 840], [779, 840]]],
    ['i1800', [[324, 1136], [691, 1136], [691, 935], [779, 935]]],
    ['i2700', [[324, 1200], [712, 1200], [712, 967], [779, 967]]],
    ['i2700', [[541, 1200], [541, 1286], [566, 1286]]],
    ['i3600', [[324, 1264], [566, 1264]]],
    ['or013', [[624, 1264], [651, 1264]]],
    ['twC014', [[709, 1264], [733, 1264], [733, 1030], [779, 1030]]]
  ],
  t: [
    [431, 177, '(TCE050)'],
    [416, 347, '(TCE163)'],
    [431, 454, '(TCE206)'],
    [291, 682, 'CV OPENING'],
    [291, 704, 'BIAS'],
    [291, 767, 'ICV MIN'],
    [291, 789, 'OPENING'],
    [329, 852, 'AT CV HOLD SPEED'],
    [329, 873, '+TD60S'],
    [633, 1257, 'C'],
    [1673, 310, 'T'],
    [1669, 810, 'T'],
    [1669, 926, 'T'],
    [1845, 907, 'INTERCEPT VALVE'],
    [1845, 929, 'OPEN DEMAND>0.1%'],
    [1940, 973, '(TCE365)'],
    [229, 1533, 'CONTROLLER:'],
    [389, 1533, 'EHG+MD'],
    [614, 1506, 'TRIGGER  :'],
    [614, 1532, 'CYCLE(ms):30']
  ]
});
