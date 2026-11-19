/* TCE194 TARGET LOAD (331DM09784 page 134, controller EHG+MD, cycle 30 ms; there are no TCE192 / TCE193 in the drawing set). Typed
   from the drawing; units = the pixels of the page rendered 2296 wide. TARGET LOAD(TCS) = the integrator I 004 (TI 0.03, 0 .. 155.0)
   on the CRT operator INC/DEC macro (TCE194_A1, LME025, DEF HL 1.0 / LL -1.0, K 0.030 s, rate SG 002 1.0 %, INC/DEC/HSS/LSS OFF)
   with Z = the target load itself; the integrator has F = 0.0, Z = GEN. MW and the A005 permissive (transfer region complete (IP) and A015) on top.
   A015 = no GOV / LLM manual operation for 5 s after INITIAL, no IP limiting, no DCS control, no load hold command, no GEN. MW ABN.
   TRACKING = A005 or the DCS control on. */
(typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
  id: 'TCE194',
  title: 'TARGET LOAD',
  page: 134,
  ctl: 'EHG+MD',
  cycle: 30,
  f: [168, 85, 2219, 1547],
  k: [
    ['kZero', 295, 241, '0.0', 'sys.ref'],
    ['kOff', 295, 468, 'OFF(0)', 'sys.ref'],
    ['kInit', 231, 660, 'INITIAL', 'ref']
  ],
  c: [
    ['iTrc', 'in', 'C', 322, 321, 'TRANSFER REGION COMPLETE(IP)', ['TCE184']],
    ['iGm', 'in', 'D', 333, 758, '', ['TCE196']], /* two lines (texts) */
    ['iLm', 'in', 'D', 333, 832, '', ['TCE205']], /* two lines (texts) */
    ['iIpl', 'in', 'C', 334, 906, 'IP LIMITTING', ['TCE201']],
    ['iDcs', 'in', 'A', 334, 980, 'DCS CONTROL ON', ['TCE180']],
    ['iLh', 'in', 'C', 334, 1054, 'LOAD HOLD COMMAND', ['TCE164']],
    ['iAbn', 'in', 'B', 334, 1118, 'GEN. MW ABN.', ['TCE070']],
    ['iGen', 'in', 'A', 323, 1231, 'GEN. MW', ['TCE070']],
    ['oB', 'out', 'B', 2082, 132, 'TRACKING', ['-']],
    ['oA', 'out', 'A', 2070, 243, 'TARGET LOAD(TCS)', ['TCE195']]
  ],
  b: [
    ['a005', 'A', '005', 793, 283],
    ['sg002', 'SG', '002', 333, 552, ['K:1.0%']],
    ['i004', 'I', '004', 1549, 263, ['TI:0.03', 'HL:155.0', 'LL:0.0'], { l: ['X', 'F', 'Z'] }, [79, 64]],
    ['ftr003', 'o:FTR', '003', 1644, 240],
    ['or014', 'OR', '014', 1805, 140],
    ['xm', 'X', '', 1271, 709],
    /* the permissive */
    ['or006', 'OR', '006', 621, 766],
    ['td007', 'TD', '007', 716, 766, ['TD:5.0s']],
    ['not008', 'NOT', '008', 803, 766],
    ['not010', 'NOT', '010', 792, 914],
    ['not011', 'NOT', '011', 792, 988],
    ['not012', 'NOT', '012', 792, 1062],
    ['not016', 'NOT', '016', 792, 1126],
    ['a015', 'A', '015', 1037, 798, [], {}, [59, 107]]
  ],
  m: [
    [
      'crt',
      'CRT OPE INC/DEC',
      'TCE194_A1',
      909,
      193,
      404,
      321,
      ['X', 'PERM', 'Z', 'INC', 'RATE', 'DEC', 'HSS', 'LSS'],
      ['OUT', 'MANU', '', '', '', '', '', ''],
      '001',
      [
        [1017, 530, '(LME025)'],
        [909, 554, 'DEF HL:1.0'],
        [930, 576, 'LL:-1.0'],
        [957, 597, 'K:0.030S']
      ]
    ]
  ],
  w: [
    /* the CRT operator INC/DEC */
    ['kZero', [[530, 240], [909, 240]], 1],
    ['kZero', [[760, 240], [760, 155], [1500, 155], [1500, 263], [1509, 263]], 1],
    ['iTrc', [[349, 318], [695, 318], [695, 272], [764, 272]]],
    ['a005', [[822, 272], [909, 272]]],
    ['a005', [[868, 272], [868, 129], [1776, 129]]],
    ['a005', [[1549, 129], [1549, 231]]],
    ['sg002', [[362, 541], [889, 541], [889, 370], [909, 370]], 1],
    ['kOff', [[530, 467], [909, 467]]],
    ['kOff', [[857, 467], [857, 337], [909, 337]]],
    ['kOff', [[857, 402], [909, 402]]],
    ['kOff', [[857, 435], [909, 435]]],
    ['crt.OUT', [[1313, 240], [1509, 240]], 1],
    /* the target load */
    ['i004', [[1589, 240], [2043, 240]], 1],
    ['i004', [[1707, 240], [1707, 709], [835, 709], [835, 305], [909, 305]], 1],
    ['iGen', [[350, 1228], [1486, 1228], [1486, 285], [1509, 285]], 1],
    /* tracking */
    ['iDcs', [[361, 977], [763, 977]]],
    ['iDcs', [[728, 977], [728, 1030], [1731, 1030], [1731, 151], [1776, 151]]],
    ['or014', [[1834, 129], [2055, 129]]],
    /* the permissive */
    ['kInit', [[466, 659], [716, 659], [716, 745]]],
    ['iGm', [[360, 755], [592, 755]]],
    ['iLm', [[360, 829], [582, 829], [582, 777], [592, 777]]],
    ['or006', [[650, 755], [687, 755]]],
    ['td007', [[745, 755], [774, 755]]],
    ['not008', [[832, 755], [1008, 755]]],
    ['iIpl', [[361, 903], [763, 903]]],
    ['not010', [[821, 903], [965, 903], [965, 776], [1008, 776]]],
    ['not011', [[821, 977], [976, 977], [976, 798], [1008, 798]]],
    ['iLh', [[361, 1051], [763, 1051]]],
    ['not012', [[821, 1051], [986, 1051], [986, 819], [1008, 819]]],
    ['iAbn', [[361, 1115], [763, 1115]]],
    ['not016', [[821, 1115], [997, 1115], [997, 840], [1008, 840]]],
    ['a015', [[1066, 755], [1120, 755], [1120, 630], [751, 630], [751, 294], [764, 294]]]
  ],
  t: [
    [375, 688, '(TCE050)'],
    [365, 723, 'GOV MANUAL'],
    [365, 745, 'OPRATION'],
    [365, 798, 'LLM MANUAL'],
    [365, 819, 'OPRATION'],
    [668, 744, 'T'],
    [238, 1522, 'CONTROLLER:'],
    [398, 1522, 'EHG+MD'],
    [622, 1493, 'TRIGGER  :'],
    [622, 1519, 'CYCLE(ms):30']
  ]
});
