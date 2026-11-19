/* TCE310 EMERGENCY OIL PUMP(TB-5) (331DM09784 page 156, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the
   pixels of the page rendered 2296 wide, the scan skew taken out (x + 0.006 (y - 700)). BOTH MAIN OIL PUMP STOPPED = TP A010
   (A009 of MOP(A) STOPPED and MOP(B) STOPPED, TP 1.0 s, reset by INITIAL). EOP auto start (ASRT of motor standard B006) = OR005 of
   BEARING OIL PRESS.LOW, both main oil pumps stopped and A012 (MOP(A) and MOP(B) AC ELECTRICAL TROUBLE). ASTP and TRP from OFF(0),
   EF from EOP MOTOR ELECTRICAL TROUBLE, RUN from EMERGENCY OIL PUMP RUNNING. STS = EOP START COMMAND, SPS = EOP STOP COMMAND, ABN =
   EOP FAULT. EOP PRESS.NORMAL = CMP A020 of EOP DISCHARGE OIL PRESS. (2.04 / 2.04 kg/cm2g, reset by INITIAL). */
(typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
  id: 'TCE310',
  title: 'EMERGENCY OIL PUMP(TB-5)',
  page: 156,
  ctl: 'EHG+MD',
  cycle: 30,
  f: [178, 88, 2230, 1550],
  k: [
    ['kInit', 293.5, 356, 'INITIAL', 'ref'],
    ['kOff', 279, 856, 'OFF(0)', 'sys.ref']
  ],
  c: [
    ['iBrg', 'in', 'A7', 308.5, 283, 'BEARING OIL PRESS.LOW', ['TCE040']],
    ['iStA', 'in', 'D', 307, 528.5, 'MOP(A) STOPPED', ['TCE300']],
    ['iStB', 'in', 'E', 306.5, 603, 'MOP(B) STOPPED', ['TCE300']],
    ['iAcA', 'in', 'A4', 305.5, 677, '', ['TCE040']],
    ['iAcB', 'in', 'A4', 305, 751.5, '', ['TCE042']],
    ['iEtr', 'in', 'A6', 302.5, 1070.5, 'EOP MOTOR ELECTRICAL TROUBLE', ['TCE040']],
    ['iRun', 'in', 'A5', 302.5, 1145.5, 'EMERGENCY OIL PUMP RUNNING', ['TCE040']],
    ['iPr', 'in', 'A4', 301.5, 1220.5, 'EOP DISCHARGE OIL PRESS.', ['TCE104'], 1],
    ['oA1', 'out', 'A1', 2087, 283, '', ['-'], 1],
    ['oA2', 'out', 'A2', 2086, 422, '', ['-'], 1],
    ['oA', 'out', 'A', 2085, 508, 'EOP START COMMAND', ['TCE600']],
    ['oC1', 'out', 'C1', 2062, 572.576, '', ['TCA655'], 1],
    ['oB', 'out', 'B', 2082.5, 795.5, 'EOP STOP COMMAND', ['TCE600']],
    ['oC', 'out', 'C', 2080, 1072, 'EOP FAULT', ['-']],
    ['oD', 'out', 'D', 2079, 1145.5, 'EMERGENCY OIL PUMP RUNNING', ['-'], 1],
    ['oA3', 'out', 'A3', 2077.5, 1284.5, 'EOP PRESS.NORMAL', ['-'], 1]
  ],
  d: [
    ['crtBrg', 2033, 218.5, 'out', 'nPS-LOn004', 'S', '#1C'],
    ['crtBoth', 2031.5, 357, 'out', 'TCE310_1', 'S', '#1C'],
    ['crtPr', 2025, 1219.5, 'out', 'TCE310_2', 'S', '#1C']
  ],
  m: [
    ['b006', 'MOTOR STANDARD', 'nP-n923', 1063, 458.076, 405, 223, ['ASRT', 'ASTP', 'TRP', 'EF', 'RUN'], ['STS', 'SPS', 'RUN', 'STP', 'ABN'], 'B006', []]
  ],
  b: [
    ['a009', 'A', '009', 658.5, 536.5],
    ['tp010', 'TP', 'A010', 786, 536.5, ['TP:1.0S']],
    ['a012', 'A', '012', 657.5, 685],
    ['or005', 'OR', '005', 947, 526, [], {}, [59, 64]],
    ['cmp020', 'CMP', 'A020', 1262, 1228.5, ['HL:2.04kg/cm2g', 'LL:2.04kg/cm2g']],
    ['btr001', 'o:BTR', '001', 1588, 216.5],
    ['btr002', 'o:BTR', '002', 1587.5, 280],
    ['btr003', 'o:BTR', '003', 1587, 355],
    ['btr004', 'o:BTR', '004', 1586.5, 419],
    ['btr008', 'o:BTR', '008', 1691.5, 505],
    ['btr015', 'o:BTR', '015', 1689, 792.5],
    ['btr023', 'o:BTR', '023', 892.5, 855],
    ['btr018', 'o:BTR', '018', 1580, 1069],
    ['btr019', 'o:BTR', '019', 1580, 1142.5],
    ['btr021', 'o:BTR', '021', 1579, 1217.5],
    ['btr022', 'o:BTR', '022', 1578.5, 1281.5]
  ],
  w: [
    /* bearing oil press. low (EOP auto start) */
    ['iBrg', [[335.5, 280], [2060, 280]]],
    ['iBrg', [[1534, 280], [1534, 216.5], [2009, 216.5]]],
    ['iBrg', [[873, 280], [873, 505], [917.5, 505]]],
    /* both main oil pump stopped */
    ['iStA', [[334, 525.5], [629.5, 525.5]]],
    ['iStB', [[333.5, 600], [605.5, 600], [605.5, 547.5], [629.5, 547.5]]],
    ['a009', [[687.5, 525.5], [757, 525.5]]],
    ['kInit', [[528.5, 355], [840.5, 355], [840.5, 1185.5], [1262, 1185.5], [1262, 1207.5]]],
    ['kInit', [[786, 355], [786, 515.5]]],
    ['tp010', [[815, 525.5], [917.5, 525.5]]],
    ['tp010', [[894, 525.5], [894, 355], [2007.5, 355]]],
    ['tp010', [[1533.5, 355], [1533.5, 419], [2059, 419]]],
    /* MOP AC electrical trouble */
    ['iAcA', [[332.5, 674], [628.5, 674]]],
    ['iAcB', [[332, 748.5], [605.5, 748.5], [605.5, 696], [628.5, 696]]],
    ['a012', [[686.5, 674], [871, 674], [871, 547], [917.5, 547]]],
    /* motor standard */
    ['or005', [[976.5, 505], [1063, 505]]],
    ['kOff', [[514, 855], [978.5, 855], [978.5, 569.576], [1063, 569.576]]],
    ['kOff', [[999, 569.576], [999, 537.288], [1063, 537.288]]],
    ['iEtr', [[329.5, 1067.5], [999, 1067.5], [999, 601.864], [1063, 601.864]]],
    ['iRun', [[329.5, 1142.5], [2052, 1142.5]]],
    ['iRun', [[1019, 1142.5], [1019, 634.152], [1063, 634.152]]],
    ['b006', [[1468, 505], [2058, 505]]],
    ['b006', [[1468, 537.288], [1531, 537.288], [1531, 792.5], [2055.5, 792.5]]],
    ['b006', [[1468, 569.576], [2035, 569.576]]],
    ['b006', [[1468, 634.152], [1507, 634.152], [1507, 1069], [2053, 1069]]],
    /* EOP press. normal */
    ['iPr', [[328.5, 1217.5], [1233, 1217.5]], 1],
    ['cmp020', [[1291, 1217.5], [2001, 1217.5]]],
    ['cmp020', [[1525.5, 1217.5], [1525.5, 1281.5], [2050.5, 1281.5]]]
  ],
  t: [
    [470, 388, '(TCE050)'],
    [338.5, 643, 'MOP(A) AC ELECTRICAL'],
    [338.5, 664, 'TROUBLE'],
    [338, 717.5, 'MOP(B) AC ELECTRICAL'],
    [338, 738.5, 'TROUBLE'],
    [744, 517.5, 'T'],
    [1218.5, 1207.5, 'T'],
    [1328.5, 1209, '(NORMAL)'],
    [1700, 187.5, 'BEARING OIL PRESS.LOW'],
    [1700, 208.5, '(EOP AUTO START)'],
    [1700, 251, 'BEARING OIL PRESS.LOW'],
    [1700, 272, '(EOP AUTO START)'],
    [1699, 347.5, 'BOTH MAIN OIL PUMP STOPPED'],
    [1699, 411, 'BOTH MAIN OIL PUMP STOPPED'],
    [1690, 1209.5, 'EOP PRESS.NORMAL'],
    [1166, 699, '(LME580C)'],
    [1283, 699, '(LME580D)'],
    [1067.5, 722.5, 'TD:1.0s'],
    [1067.5, 743.5, 'TP:3.0s'],
    [1067.5, 764.5, 'TP:3.0s'],
    [1067.5, 786, 'TP:0.5s'],
    [247, 1532, 'CONTROLLER:'],
    [406, 1532, 'EHG+MD'],
    [631, 1511, 'TRIGGER  :'],
    [631, 1538, 'CYCLE(ms):30']
  ]
});
