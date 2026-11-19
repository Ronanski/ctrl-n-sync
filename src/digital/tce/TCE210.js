/* TCE210 MSV(A) CONTROL (331DM09784 page 142, controller EHG+MD, cycle 30 ms; there are no TCE208 / TCE209 in the drawing set). Typed
   from the drawing; units = the pixels of the page rendered 2296 wide. VALVE CONTROL MT1 A003 (LME244, DEF RI 1.0 / RD 1.0, HL 0.1 % /
   LL -0.1 %): DEMAND = ASW001 (switched by TD C025, 60 s after CV WARMING NOT COMPLETE, with INITIAL: CV WARMING (A) SET, else OPEN
   POSITION SG A006 105.0 %), CL.POS = SG A007 -5.0 %, OP.SPD = SG C009 10.0 %/s, CL.SPD = MAX, TO.SPD = ASW029 (full close test
   10 %/s SG C014, else partial test 0.56 %/s SG A030), TC.SPD = ASW031 (SG C016 10 %/s, else SG A033 0.56 %/s), TEST = OR036 (TD A035
   2.0 s after MSV/CV(A) FULL CLOSE TEST STATE and CV(A) TEST POSITION (A034), with INITIAL, or MSV(A) PARTIAL TEST), CLOSE = OR026
   (MSV FORCED CLOSE or the MSV(A) fast acting solenoid valve energize command), WARM = OFF(0). ASW029 switches on OR028 (A027:
   DURING MSV(A) TEST taken inverted and OR028 itself taken inverted; or TD A035); ASW031 switches on TD A035. The DEMAND output goes
   to the three servo cards (AEH006A, TCE990-9 / TCE990-21 / TCE991-9) and out as MSV(A) POSITION DEMAND; D.TEST = DURING MSV(A)
   TEST. The servo card: demand minus MSV(A) position into the servo amplifier, its output to the servo valve coils and read back as
   SERVO AMP OUTPUT (AI); drawn as on the drawing, it is no logic of the sheet. */
(typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
  id: 'TCE210',
  title: 'MSV(A) CONTROL',
  page: 142,
  ctl: 'EHG+MD',
  cycle: 30,
  f: [163, 83, 2215, 1550],
  live: { iDur: 'vtSel=msvA' },
  k: [
    ['kInit', 259, 144, 'INITIAL', 'ref'],
    ['kMax', 354, 592, 'MAX', 'sys.ref'],
    ['kOff', 351, 1442, 'OFF(0)', 'sys.ref']
  ],
  c: [
    ['iCvw', 'in', 'F', 306, 220, 'CV WARMING NOT COMPLETE', ['TCE152']],
    ['iSet', 'in', 'C', 306, 285, 'CV WARMING (A) SET', ['TCE155']],
    ['iDur', 'in', 'B', 305, 700, 'DURING MSV(A) TEST', ['*']],
    ['iFct', 'in', 'C', 305, 1115, '', ['TCE220']], /* two lines (texts) */
    ['iCvt', 'in', 'J1', 303, 1181, '', ['TCE125']], /* two lines (texts) */
    ['iPt', 'in', 'A', 305, 1245, 'MSV(A) PARTIAL TEST', ['TCE220']],
    ['iFc', 'in', 'H', 305, 1305, 'MSV FORCED CLOSE', ['TCE053']],
    ['iFas', 'in', 'A', 305, 1370, '', ['TCE099']], /* two lines (texts) */
    ['oA', 'out', 'A', 2083, 726, 'MSV(A) POSITION DEMAND', ['TCE120', 'TCE121', 'TCE501']],
    ['oA1', 'out', 'A1', 2083, 896, '', ['-'], 1], /* two lines (texts) */
    ['oB', 'out', 'B', 2083, 983, 'DURING MSV(A) TEST', ['*', 'TCE211']]
  ],
  d: [['crtPd', 2085, 810, 'out', 'TCE210_A1', 'S', '#1C']],
  b: [
    /* DEMAND */
    ['btr024', 'o:BTR', '024', 607, 143],
    ['tdC025', 'TD', 'C025', 660, 228, ['TD:60.0']],
    ['asw001', 'ASW', '001', 713, 324],
    ['sgA006', 'SG', 'A006', 295, 346, ['K:105.0%']],
    ['ftr002', 'o:FTR', '002', 851, 313],
    /* the positions and the speeds */
    ['sgA007', 'SG', 'A007', 295, 431, ['K:-5.0%']],
    ['ftr008', 'o:FTR', '008', 851, 420],
    ['sgC009', 'SG', 'C009', 295, 516, ['K:10.0%/S']],
    ['ftr010', 'o:FTR', '010', 851, 505],
    ['ftr012', 'o:FTR', '012', 851, 591],
    ['x027', 'X', '', 722, 643],
    ['x027b', 'X', '', 615, 697],
    ['a027', 'A', '027', 721, 686],
    ['or028', 'OR', '028', 851, 686],
    ['sgC014', 'SG', 'C014', 295, 781, ['K:10%/S']],
    ['ftr015', 'o:FTR', '015', 851, 770],
    ['sgA030', 'SG', 'A030', 295, 858, ['K:0.56%/S']],
    ['asw029', 'ASW', '029', 966, 781],
    ['sgC016', 'SG', 'C016', 295, 941, ['K:10%/S']],
    ['ftr017', 'o:FTR', '017', 851, 930],
    ['sgA033', 'SG', 'A033', 295, 1017, ['K:0.56%/S']],
    ['asw031', 'ASW', '031', 966, 941],
    /* TEST, CLOSE, WARM */
    ['a034', 'A', '034', 507, 1123],
    ['tdA035', 'TD', 'A035', 614, 1123, ['TD:2.0s']],
    ['or036', 'OR', '036', 720, 1123],
    ['btr018', 'o:BTR', '018', 849, 1112],
    ['or026', 'OR', '026', 720, 1313],
    ['btr019', 'o:BTR', '019', 849, 1302],
    ['btr020', 'o:BTR', '020', 849, 1441],
    /* VALVE CONTROL MT1 */
    [
      'mt003',
      'VALVE CONTROL MT1',
      'A003',
      1256,
      410,
      [],
      {
        l: ['', 'DEMAND', 'CL.POS.', 'OP.SPD', 'CL.SPD', 'TO.SPD', 'TC.SPD', 'TEST', 'CLOSE', 'WARM', '', ''],
        r: ['', 'DEMAND', 'D.TEST', '', '', '', '', '', '', '', '', '']
      },
      [232, 258]
    ],
    /* the outputs */
    ['ftr004', 'o:FTR', '004', 1576, 313],
    ['ftr005', 'o:FTR', '005', 1670, 313],
    ['ftr011', 'o:FTR', '011', 1670, 532],
    ['ftr013', 'o:FTR', '013', 1670, 617],
    ['ftr023', 'o:FTR', '023', 1670, 808],
    ['ftr022', 'o:FTR', '022', 1670, 893],
    ['btr032', 'o:BTR', '032', 1670, 980]
  ],
  /* the servo cards */
  r: [
    ['svA', 1745, 234, 330, 256, ''],
    ['svT1', 1745, 234, 155, 21, 'SERVO'],
    ['svT2', 1900, 234, 175, 21, 'AEH006A'],
    ['svP', 1804, 383, 10, 21, ''],
    ['svB', 1744, 507, 330, 52, ''],
    ['svC', 1744, 592, 330, 52, '']
  ],
  g: [
    [1752, 313, 'r'],
    [1751, 532, 'r'],
    [1751, 617, 'r']
  ],
  o: [
    [1852, 313, 12],
    [2183, 309, 15, 1],
    [2183, 362, 15, 1]
  ],
  p: [[[1877, 300], [1877, 326], [1903, 313]]],
  a: [
    [[1760, 313], [1840, 313]],
    [[1852, 394], [1852, 325]]
  ],
  l: [
    [[1864, 313], [1877, 313]],
    [[1903, 313], [2168, 313]],
    [[1915, 313], [1915, 393]],
    [[1915, 393], [2000, 393]],
    [[1814, 394], [1852, 394]],
    [[1809, 372], [1809, 383]],
    [[2074, 532], [2108, 532]],
    [[2074, 617], [2108, 617]],
    [[2108, 313], [2108, 617]],
    [[2151, 313], [2151, 362]],
    [[2151, 362], [2168, 362]]
  ],
  e: [
    [[2140, 276], [2212, 276]],
    [[2140, 276], [2140, 393]],
    [[2140, 393], [2212, 393]]
  ],
  w: [
    /* INITIAL */
    ['kInit', [[494, 143], [777, 143], [777, 375], [647, 375], [647, 1080], [614, 1080], [614, 1102]]],
    ['kInit', [[660, 143], [660, 207]]],
    /* DEMAND */
    ['iCvw', [[333, 217], [631, 217]]],
    ['tdC025', [[689, 217], [713, 217], [713, 303]]],
    ['iSet', [[333, 282], [637, 282], [637, 313], [684, 313]], 1],
    ['sgA006', [[324, 335], [684, 335]], 1],
    ['asw001', [[742, 313], [1140, 313]], 1],
    /* the positions and the speeds */
    ['sgA007', [[324, 420], [968, 420], [968, 335], [1140, 335]], 1],
    ['sgC009', [[324, 505], [988, 505], [988, 356], [1140, 356]], 1],
    ['kMax', [[589, 591], [1008, 591], [1008, 378], [1140, 378]], 1],
    ['iDur', [[332, 697], [692, 697]]],
    ['or028', [[880, 675], [966, 675], [966, 760]]],
    ['or028', [[966, 675], [966, 643], [667, 643], [667, 675], [692, 675]]],
    ['a027', [[750, 675], [822, 675]]],
    ['tdA035', [[667, 1112], [667, 739], [796, 739], [796, 697], [822, 697]]],
    ['tdA035', [[667, 899], [966, 899], [966, 920]]],
    ['sgC014', [[324, 770], [937, 770]], 1],
    ['sgA030', [[324, 847], [913, 847], [913, 792], [937, 792]], 1],
    ['asw029', [[995, 770], [1030, 770], [1030, 399], [1140, 399]], 1],
    ['sgC016', [[324, 930], [937, 930]], 1],
    ['sgA033', [[324, 1006], [913, 1006], [913, 952], [937, 952]], 1],
    ['asw031', [[995, 930], [1051, 930], [1051, 421], [1140, 421]], 1],
    /* TEST, CLOSE, WARM */
    ['iFct', [[332, 1112], [478, 1112]]],
    ['iCvt', [[330, 1178], [454, 1178], [454, 1134], [478, 1134]]],
    ['a034', [[536, 1112], [585, 1112]]],
    ['tdA035', [[643, 1112], [691, 1112]]],
    ['iPt', [[332, 1242], [667, 1242], [667, 1134], [691, 1134]]],
    ['or036', [[749, 1112], [1073, 1112], [1073, 442], [1140, 442]]],
    ['iFc', [[332, 1302], [691, 1302]]],
    ['iFas', [[332, 1367], [667, 1367], [667, 1324], [691, 1324]]],
    ['or026', [[749, 1302], [1094, 1302], [1094, 464], [1140, 464]]],
    ['kOff', [[586, 1441], [1115, 1441], [1115, 485], [1140, 485]]],
    /* the outputs */
    ['mt003', [[1372, 313], [1745, 313]], 1],
    ['mt003', [[1636, 313], [1636, 893], [2056, 893]], 1],
    ['mt003', [[1636, 532], [1744, 532]], 1],
    ['mt003', [[1636, 617], [1744, 617]], 1],
    ['mt003', [[1636, 723], [2056, 723]], 1],
    ['mt003', [[1636, 808], [2061, 808]], 1],
    ['mt003', [[1372, 335], [1615, 335], [1615, 980], [2056, 980]]]
  ],
  t: [
    [404, 175, '(TCE050)'],
    [331, 329, 'OPEN POSITION'],
    [331, 414, 'CLOSE POSITION'],
    [331, 499, 'OPENING SPEED'],
    [351, 744, 'OPENING SPEED FOR FULL'],
    [351, 765, 'CLOSE TEST'],
    [351, 818, 'OPENING SPEED FOR PARTIAL'],
    [351, 840, 'TEST'],
    [351, 903, 'CLOSING SPEED FOR FULL'],
    [351, 924, 'CLOSE TEST'],
    [351, 978, 'CLOSING SPEED FOR PARTIAL'],
    [351, 999, 'TEST'],
    [336, 1084, 'MSV/CV(A) FULL CLOSE'],
    [336, 1105, 'TEST STATE'],
    [336, 1148, 'CV(A) TEST'],
    [336, 1169, 'POSITION'],
    [336, 1339, 'MSV(A) FAST ACTING SOLENOID'],
    [336, 1361, 'VALVE ENERGIZE COMMAND'],
    [616, 211, 'T'],
    [567, 1106, 'T'],
    [1128, 586, 'DEF RI:1.0'],
    [1145, 608, 'RD:1.0'],
    [1128, 629, 'DEF HL:0.1%'],
    [1145, 651, 'LL:-0.1%'],
    [1220, 557, '(LME244)'],
    [1770, 290, '(TCE990-9)'],
    [1862, 288, 'MSV(A) DEMAND'],
    [1824, 303, '+'],
    [1834, 342, '-'],
    [1751, 352, 'MSV(A)'],
    [1751, 368, 'POSITION'],
    [1921, 372, 'SERVO AMP'],
    [1921, 388, 'OUTPUT'],
    [2008, 398, 'AI'],
    [1760, 525, '(TCE990-21)'],
    [1910, 543, 'DITTO', 1],
    [1768, 610, '(TCE991-9)'],
    [1910, 628, 'DITTO', 1],
    [1737, 800, 'MSV(A) POSITION DEMAND'],
    [1737, 864, 'MSV(A)'],
    [1737, 886, 'POSITION DEMAND'],
    [228, 1532, 'CONTROLLER:'],
    [389, 1532, 'EHG+MD'],
    [618, 1503, 'TRIGGER  :'],
    [618, 1530, 'CYCLE(ms):30']
  ]
});
