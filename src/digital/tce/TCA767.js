/* TCA767 THSC SPEED/LOAD HOLD (331DM09788 page 194, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn:
   - THERMAL STRESS (HP SURFACE) (A of TCA754) through TB 065 and ABS 001, THERMAL STRESS (IP SURFACE) (A of TCA758) through TB 066 and
     ABS 006; each feeds six CMP blocks (all reset by INITIAL, TCA100) with the HL / LL printed beside them.
   - Each CMP with its mode in an AND: AMB.COLD MODE (A003 / A008), COLD1 (A012 / A018), COLD2 (A021 / A025), WARM (A027 / A031),
     HOT (A035 / A037) of TCA500, and A053 (STEP 7 EXECUTING (TCA527) or TURBINE SHUT-DOWN SELECTED OR EXECUTING (TCA529) in OR 045,
     with TH STRESS LIMITATION CHANGES TO NORMAL/STOP MODE (TCA768)) for A041 / A044. The twelve ANDs in OR 004 = SPEED LOAD HOLD
     (STRESS), A out (to TCA768); through BTR 005 = THERMAL STRESS HIGH to CRT TCA767_1, through BTR 009 to A1.
   - HP THSC SURF LIMIT: SG A015 / A022 / A028 / A032 / A038 picked by the ASW chain 016 / 023 / 029 / 033 (switched by AMB.COLD, COLD1,
     COLD2, WARM), then ASW 013 (switched by A053) between it and SG A010; through FTR 014 to CRT TCA767_A1, FTR 019 to C1, FTR 047 to C
     (TCA769).
   - IP THSC SURF LIMIT: SG A056 / A058 / A060 / A062 / A064 through ASW 057 / 059 / 061 / 063 (AMB.COLD, COLD1, COLD2, WARM), then ASW 049
     (switched by A053) with SG A048; through FTR 050 to CRT TCA767_A2, FTR 051 to D1, FTR 052 to D (TCA769).
   - HSG 046 of the two ABS stresses = THERMAL STRESS, B out; through FTR 039 = PRESENT VALUE to CRT TCA767_A3 and FTR 042 to B1. The ABS
     stresses through FTR 054 / 055 = HP / IP SURFACE TH STRESS (ABS), E / F out (TCA768, TCA769).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [],
    b = [],
    j = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const WT = (key, ...pts) => w.push([key, pts, 1]);
  const HW = 28.76,
    xCMP = 714,
    xAND = 907,
    xHP = 620,
    xIP = 597,
    xIN = 641,
    xM = 853,
    ORL = 1203;
  /* the two stresses in, TB, ABS */
  WT('iHP', [282, 224], [426.5 - HW, 224]);
  WT('tb065', [426.5 + HW, 224], [545 - HW, 224]);
  WT('abs001', [545 + HW, 224], [xCMP - HW, 224]);
  WT('abs001', [xHP, 224], [xHP, 1320], [989.5 - 29.5, 1320]);
  WT('iIP', [282, 309], [426.5 - HW, 309]);
  WT('tb066', [426.5 + HW, 309], [545 - HW, 309]);
  WT('abs006', [545 + HW, 309], [xCMP - HW, 309]);
  WT('abs006', [xIP, 309], [xIP, 1342], [989.5 - 29.5, 1342]);
  WT('abs006', [937, 1342], [937, 1364], [989.5 - 29.5, 1364]);
  j.push([xHP, 224], [xIP, 309], [914, 1320], [893, 1342], [937, 1342]);
  b.push(
    ['tb065', 'TB', '065', 426.5, 235],
    ['abs001', 'ABS', '001', 545, 235],
    ['tb066', 'TB', '066', 426.5, 320],
    ['abs006', 'ABS', '006', 545, 320]
  );
  /* the CMP / AND rows: [CMP no, AND no, row, HP?, INITIAL tap, HL, LL, OR vertical x, OR input y] */
  const R = [
    ['A002', '003', 224, 1, 139, '430.0', '428.0', 0, 224],
    ['A007', '008', 309, 0, 276, '405.0', '403.0', 963, 243],
    ['A011', '012', 500, 1, 470, '430.0', '428.0', 984, 265],
    ['A017', '018', 576, 0, 556, '331.0', '329.0', 1005, 286],
    ['A020', '021', 670, 1, 638, '430.0', '428.0', 1026, 307.5],
    ['A024', '025', 746, 0, 716, '371.6', '369.6', 1047, 329],
    ['A026', '027', 842, 1, 810, '396.0', '394.0', 1067, 350.5],
    ['A030', '031', 916, 0, 885, '423.3', '421.3', 1088, 371.5],
    ['A034', '035', 1011, 1, 980, '208.0', '206.0', 1109, 393],
    ['A036', '037', 1086, 0, 1058, '182.9', '180.9', 1130, 414.5],
    ['A040', '041', 1182, 1, 1150, '209.3', '207.3', 1151, 435.5],
    ['A043', '044', 1256, 0, 1228, '209.3', '207.3', 1173, 457]
  ];
  W('kInit', [530, 139], [xCMP, 139], [xCMP, 224 + 11 - 21.5]);
  W('kInit', [xIN, 139], [xIN, 1228]);
  j.push([xIN, 139]);
  R.forEach(([c, a, y, hp, tap, hl, ll, ox, oy], i) => {
    const kc = 'cmp' + c,
      ka = 'and' + a;
    b.push([kc, 'CMP', c, xCMP, y + 11], [ka, 'A', a, xAND, y + 11]);
    if (i > 0) {
      W('kInit', [xIN, tap], [xCMP, tap], [xCMP, y + 11 - 21.5]);
      if (i < R.length - 1) j.push([xIN, tap]);
    }
    if (i > 1) {
      WT(hp ? 'abs001' : 'abs006', [hp ? xHP : xIP, y], [xCMP - HW, y]);
      j.push([hp ? xHP : xIP, y]);
    }
    W(kc, [xCMP + HW, y], [xAND - HW, y]);
    if (ox) W(ka, [xAND + HW, y], [ox, y], [ox, oy], [ORL, oy]);
    else W(ka, [xAND + HW, y], [ORL, y]);
    t.push([xCMP - 42, y - 8, 'T'], [760, y + 22, 'HL:' + hl], [760, y + 44, 'LL:' + ll]);
  });
  /* the modes into the lower inputs of the ANDs and to the switches */
  const lo = i => R[i][2] + 22;
  W('iAmb', [282, 405], [xM, 405]);
  W('iAmb', [xM, lo(0)], [xAND - HW, lo(0)]);
  W('iAmb', [xM, lo(1)], [xAND - HW, lo(1)]);
  W('iAmb', [xM, lo(0)], [xM, 479], [1657, 479], [1657, 543 - 21.5]);
  W('iAmb', [1591, 479], [1591, 916], [1642, 916], [1642, 957 - 21.5]);
  j.push([xM, lo(1)], [xM, 405], [1591, 479]);
  W('iC1', [282, 628], [1549, 628], [1549, 680 - 21.5]);
  W('iC1', [xM, lo(2)], [xM, 628]);
  W('iC1', [xM, lo(2)], [xAND - HW, lo(2)]);
  W('iC1', [xM, lo(3)], [xAND - HW, lo(3)]);
  W('iC1', [1486, 628], [1486, 1021], [1545, 1021], [1545, 1064 - 21.5]);
  j.push([xM, lo(3)], [xM, 628], [1486, 628]);
  W('iC2', [282, 798], [1442, 798], [1442, 850 - 21.5]);
  W('iC2', [xM, lo(4)], [xM, 798]);
  W('iC2', [xM, lo(4)], [xAND - HW, lo(4)]);
  W('iC2', [xM, lo(5)], [xAND - HW, lo(5)]);
  W('iC2', [1378, 798], [1378, 1137], [1448, 1137], [1448, 1192 - 21.5]);
  j.push([xM, lo(5)], [xM, 798], [1378, 798]);
  W('iWarm', [282, 968], [1334, 968], [1334, 1010 - 21.5]);
  W('iWarm', [xM, lo(6)], [xM, 968]);
  W('iWarm', [xM, lo(6)], [xAND - HW, lo(6)]);
  W('iWarm', [xM, lo(7)], [xAND - HW, lo(7)]);
  W('iWarm', [1291, 968], [1291, 1244], [1343, 1244], [1343, 1277 - 21.5]);
  j.push([xM, lo(7)], [xM, 968], [1291, 968]);
  W('iHot', [282, 1140], [xM, 1140], [xM, lo(8)], [xAND - HW, lo(8)]);
  W('iHot', [xM, lo(9)], [xAND - HW, lo(9)]);
  j.push([xM, lo(9)]);
  /* STEP 7 / SHUT-DOWN, OR 045, A053 to the last two ANDs and to ASW 013 / 049 */
  W('iStep7', [282, 1375], [541.5 - HW, 1375]);
  W('iShut', [282, 1450], [501, 1450], [501, 1397], [541.5 - HW, 1397]);
  W('or045', [541.5 + HW, 1375], [638 - HW, 1375]);
  W('iNorm', [282, 1280], [585, 1280], [585, 1397], [638 - HW, 1397]);
  W('and053', [638 + HW, 1375], [xM, 1375], [xM, 1160], [1695, 1160], [1695, 479], [1784, 479], [1784, 521 - 21.5]);
  W('and053', [xM, lo(10)], [xAND - HW, lo(10)]);
  W('and053', [xM, lo(11)], [xAND - HW, lo(11)]);
  W('and053', [1695, 808], [1769, 808], [1769, 851 - 21.5]);
  j.push([xM, lo(10)], [xM, lo(11)], [1695, 808]);
  b.push(['or045', 'OR', '045', 541.5, 1386], ['and053', 'A', '053', 638, 1386], ['or004', 'OR', '004', 1232.5, 338.5, [], {}, [59, 255]]);
  /* OR 004 out */
  W('or004', [ORL + 59, 224], [2096 - 27, 224]);
  W('or004', [1479, 224], [1479, 360], [2041 - 27, 360]);
  W('or004', [1479, 296], [2049 - 35, 296]);
  j.push([1479, 224], [1479, 296]);
  b.push(['btr005', 'o:BTR', '005', 1521, 296], ['btr009', 'o:BTR', '009', 1521, 360]);
  /* HP THSC SURF LIMIT */
  const SGS = [
    ['A010', 1657.5, 425, 'K:209.3'],
    ['A015', 1230.5, 543, 'K:430'],
    ['A022', 1230, 680, 'K:430'],
    ['A028', 1229, 850, 'K:430'],
    ['A032', 1227, 1010, 'K:396'],
    ['A038', 1227, 1096, 'K:208'],
    ['A048', 1643, 851, 'K:209.3'],
    ['A056', 1546.5, 957, 'K:405.1'],
    ['A058', 1450, 1064, 'K:331.1'],
    ['A060', 1354, 1192, 'K:371.6'],
    ['A062', 1246, 1277, 'K:423.3'],
    ['A064', 1246, 1352, 'K:182.9']
  ];
  SGS.forEach(([n, x, y, k]) => b.push(['sg' + n, 'SG', n, x, y, [k]]));
  const SW = [
    ['013', 1784, 521],
    ['016', 1657, 543],
    ['023', 1549, 680],
    ['029', 1442, 850],
    ['033', 1334, 1010],
    ['049', 1769, 851],
    ['057', 1642, 957],
    ['059', 1545, 1064],
    ['061', 1448, 1192],
    ['063', 1343, 1277]
  ];
  SW.forEach(([n, x, y]) => b.push(['asw' + n, 'ASW', n, x, y]));
  WT('sgA010', [1657.5 + HW, 414], [1731, 414], [1731, 510], [1784 - HW, 510]);
  WT('sgA015', [1230.5 + HW, 532], [1657 - HW, 532]);
  WT('asw016', [1657 + HW, 532], [1784 - HW, 532]);
  WT('sgA022', [1230 + HW, 669], [1549 - HW, 669]);
  WT('asw023', [1549 + HW, 669], [1603, 669], [1603, 554], [1657 - HW, 554]);
  WT('sgA028', [1229 + HW, 839], [1442 - HW, 839]);
  WT('asw029', [1442 + HW, 839], [1494, 839], [1494, 691], [1549 - HW, 691]);
  WT('sgA032', [1227 + HW, 999], [1334 - HW, 999]);
  WT('asw033', [1334 + HW, 999], [1387.5, 999], [1387.5, 861], [1442 - HW, 861]);
  WT('sgA038', [1227 + HW, 1085], [1279, 1085], [1279, 1021], [1334 - HW, 1021]);
  WT('asw013', [1784 + HW, 510], [2049 - 35, 510]);
  WT('asw013', [1837, 510], [1837, 682], [2092 - 27, 682]);
  WT('asw013', [1837, 596], [2041 - 27, 596]);
  j.push([1837, 510], [1837, 596]);
  b.push(['ftr014', 'o:FTR', '014', 1858, 510], ['ftr019', 'o:FTR', '019', 1858, 596], ['ftr047', 'o:FTR', '047', 1857, 682]);
  /* IP THSC SURF LIMIT */
  WT('sgA048', [1643 + HW, 840], [1769 - HW, 840]);
  WT('sgA056', [1546.5 + HW, 946], [1642 - HW, 946]);
  WT('asw057', [1642 + HW, 946], [1727, 946], [1727, 862], [1769 - HW, 862]);
  WT('sgA058', [1450 + HW, 1053], [1545 - HW, 1053]);
  WT('asw059', [1545 + HW, 1053], [1588, 1053], [1588, 968], [1642 - HW, 968]);
  WT('sgA060', [1354 + HW, 1181], [1448 - HW, 1181]);
  WT('asw061', [1448 + HW, 1181], [1501, 1181], [1501, 1075], [1545 - HW, 1075]);
  WT('sgA062', [1246 + HW, 1266], [1343 - HW, 1266]);
  WT('asw063', [1343 + HW, 1266], [1408.5, 1266], [1408.5, 1203], [1448 - HW, 1203]);
  WT('sgA064', [1246 + HW, 1341], [1298.5, 1341], [1298.5, 1288], [1343 - HW, 1288]);
  WT('asw049', [1769 + HW, 840], [2035 - 35, 840]);
  WT('asw049', [1822, 840], [1822, 1011], [2089 - 27, 1011]);
  WT('asw049', [1822, 925], [2027 - 27, 925]);
  j.push([1822, 840], [1822, 925]);
  b.push(['ftr050', 'o:FTR', '050', 1843, 840], ['ftr051', 'o:FTR', '051', 1843, 925], ['ftr052', 'o:FTR', '052', 1852, 1011]);
  /* HSG 046 and the stresses out */
  b.push(['hsg046', 'HSG', '046', 989.5, 1342, [], {}, [59, 64]]);
  WT('hsg046', [989.5 + 29.5, 1320], [2084 - 27, 1320]);
  WT('hsg046', [1648, 1320], [1648, 1191], [2042 - 35, 1191]);
  WT('hsg046', [1648, 1254], [2034 - 27, 1254]);
  j.push([1648, 1320], [1648, 1254]);
  b.push(['ftr039', 'o:FTR', '039', 1712, 1191], ['ftr042', 'o:FTR', '042', 1712, 1254]);
  WT('abs001', [914, 1320], [914, 1416], [1342 - 27, 1416]);
  WT('abs006', [893, 1342], [893, 1469], [1342 - 27, 1469]);
  b.push(['ftr054', 'o:FTR', '054', 983, 1416], ['ftr055', 'o:FTR', '055', 983, 1469]);
  t.push(
    [470, 176, '(TCA100)', 1],
    [300, 200, 'THERMAL STRESS'],
    [300, 220, '(HP SURFACE)'],
    [300, 285, 'THERMAL STRESS'],
    [300, 305, '(IP SURFACE)'],
    [298, 400, 'AMB.COLD MODE'],
    [298, 623, 'COLD1 MODE'],
    [298, 793, 'COLD2 MODE'],
    [298, 963, 'WARM MODE'],
    [297, 1135, 'HOT MODE'],
    [286, 1252, 'TH STRESS LIMITATION CHANGES'],
    [286, 1273, 'TO NORMAL/STOP MODE'],
    [296, 1370, 'STEP 7 EXECUTING'],
    [296, 1400, 'TURBINE SHUT-DOWN'],
    [296, 1422, 'SELECTED OR'],
    [296, 1444, 'EXECUTING'],
    [1758, 219, 'SPEED LOAD HOLD (STRESS)'],
    [1760, 293, 'THERMAL STRESS HIGH'],
    [1760, 357, 'THERMAL STRESS HIGH'],
    [1855, 474, 'HP THSC SURF LIMIT'],
    [1855, 557, 'HP THSC SURF LIMIT'],
    [1905, 657, 'HP THSC'],
    [1905, 679, 'SURF LIMIT'],
    [1840, 805, 'IP THSC SURF LIMIT'],
    [1840, 892, 'IP THSC SURF LIMIT'],
    [1902, 987, 'IP THSC'],
    [1902, 1008, 'SURF LIMIT'],
    [1750, 1188, 'PRESENT VALUE'],
    [1750, 1251, 'PRESENT VALUE'],
    [1746, 1315, 'THERMAL STRESS'],
    [993, 1411, 'HP SURFACE TH STRESS (ABS)'],
    [993, 1465, 'IP SURFACE TH STRESS (ABS)'],
    [1405, 1399, '(TCA769)', 1],
    [1408, 1435, '(TCA768)', 1],
    [1408, 1488, '(TCA768)', 1],
    [1405, 1509, '(TCA769)', 1],
    [242, 1530, 'CONTROLLER:'],
    [401, 1530, 'COMM+MD'],
    [627, 1503, 'TRIGGER  :'],
    [627, 1529, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA767',
    /* swc: TB 065 / 066 (ML 59 TIE-BACK) show no flag wire on the drawing, and their HIACS backup records (phase6-tcs-records-2026-11-26.md (YUA, team-files/tcs-decoded), COMM+MD 2017-02-23)
       carry no side input at all ("TB 065 201_XX00FC5 200_XX00CF0 ..."): the primary / secondary flags of ML 59 are the duplex controller's
       own status, not a wire. DERIVED: the simulator runs one controller, which is the primary, so ML 59 (1) applies: Y = X. */
    swc: { tb065: 1, tb066: 1 },
    /* pr: printed on page 194 beside each block; the drawing above keeps them as text */
    pr: {
      cmpA002: ['HL:430.0', 'LL:428.0'],
      cmpA007: ['HL:405.0', 'LL:403.0'],
      cmpA011: ['HL:430.0', 'LL:428.0'],
      cmpA017: ['HL:331.0', 'LL:329.0'],
      cmpA020: ['HL:430.0', 'LL:428.0'],
      cmpA024: ['HL:371.6', 'LL:369.6'],
      cmpA026: ['HL:396.0', 'LL:394.0'],
      cmpA030: ['HL:423.3', 'LL:421.3'],
      cmpA034: ['HL:208.0', 'LL:206.0'],
      cmpA036: ['HL:182.9', 'LL:180.9'],
      cmpA040: ['HL:209.3', 'LL:207.3'],
      cmpA043: ['HL:209.3', 'LL:207.3']
    },
    title: 'THSC SPEED/LOAD HOLD',
    page: 194,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [176, 82, 2233, 1549],
    k: [['kInit', 297, 139, 'INITIAL', 'ref']],
    c: [
      ['iHP', 'in', 'A', 255, 224, '', ['TCA754'], 0, 1],
      ['iIP', 'in', 'A', 255, 309, '', ['TCA758'], 0, 1],
      ['iAmb', 'in', 'A', 255, 405, '', ['TCA500'], 0, 1],
      ['iC1', 'in', 'B', 255, 628, '', ['TCA500'], 0, 1],
      ['iC2', 'in', 'C', 255, 798, '', ['TCA500'], 0, 1],
      ['iWarm', 'in', 'D', 255, 968, '', ['TCA500'], 0, 1],
      ['iHot', 'in', 'E', 255, 1140, '', ['TCA500'], 0, 1],
      ['iNorm', 'in', 'E', 255, 1280, '', ['TCA768'], 0, 1],
      ['iStep7', 'in', 'C', 255, 1375, '', ['TCA527'], 0, 1],
      ['iShut', 'in', 'L', 255, 1450, '', ['TCA529'], 0, 1],
      ['oA', 'out', 'A', 2096, 224, '', ['TCA768'], 0, 0],
      ['oA1', 'out', 'A1', 2041, 360, '', ['-'], 1, 0],
      ['oC1', 'out', 'C1', 2041, 596, '', ['-'], 1, 0],
      ['oC', 'out', 'C', 2092, 682, '', ['TCA769'], 0, 0],
      ['oD1', 'out', 'D1', 2027, 925, '', ['-'], 1, 0],
      ['oD', 'out', 'D', 2089, 1011, '', ['TCA769'], 0, 0],
      ['oB1', 'out', 'B1', 2034, 1254, '', ['-'], 1, 0],
      ['oB', 'out', 'B', 2084, 1320, '', ['-'], 0, 0],
      ['oE', 'out', 'E', 1342, 1416, '', [], 0, 0],
      ['oF', 'out', 'F', 1342, 1469, '', [], 0, 0]
    ],
    d: [
      ['crt1', 2049, 296, 'out', 'TCA767_1', 'S', '#1C'],
      ['crtA1', 2049, 510, 'out', 'TCA767_A1', 'S', '#1C'],
      ['crtA2', 2035, 840, 'out', 'TCA767_A2', 'S', '#1C'],
      ['crtA3', 2042, 1191, 'out', 'TCA767_A3', 'S', '#1C']
    ],
    b,
    w,
    j,
    t
  });
})();
