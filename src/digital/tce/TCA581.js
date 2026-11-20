/* TCA581 TURBINE PREPARATION CONTROL(2) (331DM09788 page 139, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. ATS step 1 gives the LLM upper demand once the CV warming is complete with the MSV open; ATS step 0 gives the HP turbine warming
   start command while the HP inner casing metal is below 150 C (CPL 152 / 150 C). Both are held 3 s by a TW and cleared by INITIAL. */
(typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
  id: 'TCA581',
  title: 'TURBINE PREPARATION CONTROL(2)',
  page: 139,
  ctl: 'COMM+MD',
  cycle: 100,
  f: [170, 82, 2218, 1546],
  k: [['kInit', 293, 170, 'INITIAL', 'ref']],
  c: [
    ['iExec', 'in', 'C', 355, 289, 'STEP1 EXCUTING', ['TCA521']],
    ['iDone', 'in', 'D', 355, 372, 'CV WARMING COMPLETE', ['TCA511']],
    ['iMsv', 'in', 'B', 355, 458, 'CRI1.21 MSV OPEN', ['TCA533']],
    ['iExec0', 'in', 'C', 355, 543, 'STEP 0 EXECUTING', ['TCA520']],
    ['iTemp', 'in', 'A1', 355, 628, 'INNER WALL METAL TEMP. (LOWER)', ['TCA360']],
    ['oA1', 'out', 'A1', 2081, 287, 'LLM UPPER DEMAND(ATS)', ['TCE205'], 1],
    ['oB', 'out', 'B', 2081, 543, 'HP TURBINE WARMING START COMMAND', ['TCA630']]
  ],
  b: [
    ['a001', 'A', '001', 890, 308, [], {}, [60, 63]],
    ['cplA005', 'CPL', 'A005', 890, 638, ['HL:152.0degC', 'LL:150.0degC']],
    ['a003', 'A', '003', 1157, 552],
    ['twA002', 'TW', 'A002', 1157, 296, ['TW:3.0S']],
    ['twA004', 'TW', 'A004', 1422, 552, ['TW:3.0S']]
  ],
  w: [
    ['kInit', [[526, 170], [1423, 170], [1423, 531]]],
    ['kInit', [[1157, 170], [1157, 275]]],
    ['iExec', [[382, 289], [860, 289]]],
    ['iDone', [[382, 372], [814, 372], [814, 309], [860, 309]]],
    ['iMsv', [[382, 458], [835, 458], [835, 330], [860, 330]]],
    ['a001', [[920, 287], [1127, 287]]],
    ['twA002', [[1187, 287], [2054, 287]]],
    ['iExec0', [[382, 543], [1127, 543]]],
    ['iTemp', [[382, 628], [860, 628]], 1],
    ['cplA005', [[920, 627], [1102, 627], [1102, 562], [1127, 562]]],
    ['a003', [[1187, 543], [1392, 543]]],
    ['twA004', [[1451, 543], [2054, 543]]]
  ],
  j: [[1157, 170]],
  t: [
    [386, 597, 'HP-T INNER CASING FIRST STAGE'],
    [1127, 270, 'C', 2],
    [1392, 535, 'C', 2],
    [845, 620, 'T', 1],
    [230, 1528, 'CONTROLLER:'],
    [400, 1528, 'COMM+MD'],
    [620, 1500, 'TRIGGER  :'],
    [620, 1526, 'CYCLE(ms):100']
  ]
});
