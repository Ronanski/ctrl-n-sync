/* TCA548 CRITERIA CONDITION (331DM09788 page 118, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. The steam to metal temperature mismatch criteria, the same logic twice:
   - main steam: from the HP turbine first stage inner wall metal temp. the UPPER LIMIT (FG A005, table FG *1), the HP TARGET TEMP.
     (FG A012, table FG *3) and the LOWER LIMIT (FG A040); the MSV (B) inlet steam temp. over the upper limit (SUB 006, LCK A007 K 0.0)
     or under the lower limit (SUB 015, UCK A016 K 0.0) (OR 008), with neither input abnormal (OR 018, NOT 019, A 009) = MAIN STEAM
     TEMP. MISMATCH; its NOT 010 = CRI 1.71 MAIN STEAM TEMP. MISMATCH OK;
   - reheat steam: from the reheat bowl inner wall metal temp. the UPPER LIMIT (FG A024, table FG *2), the HRH TARGET TEMP. (FG A031,
     table FG *4) and the LOWER LIMIT (FG A042); the CRV inlet steam temp. (A) against them (SUB 025, LCK A026, SUB 046, UCK A043,
     OR 041), with neither input abnormal (OR 039, NOT 038, A 028) = REHEAT STEAM TEMP. MISMATCH; its NOT 029 = CRI 1.72 REHEAT STEAM
     TEMP. MISMATCH OK.
   The limits, the targets and the alarms also go to the operator station (CRT TCA548_1, _2, _A1 .. _A6) and to lines out.
   The words and the four tables are the ones of the drawing; the drawing prints no table for FG A040 and FG A042. The lines of the
   drawing lean a few pixels; each is typed level.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    l = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const T = (key, ...pts) => w.push([key, pts, 1]);
  /* main steam */
  T('hIn', [323, 251], [758, 251]);
  T('hIn', [734, 251], [734, 389], [756, 389]);
  T('hIn', [734, 336], [757, 336]);
  T('fgA005', [818, 251], [917, 251]);
  T('fgA005', [873, 251], [873, 134], [1170, 134]);
  T('fgA005', [873, 188], [1178, 188]);
  T('hSt', [322, 432], [907, 432], [907, 410], [916, 410]);
  T('hSt', [872, 432], [872, 271], [917, 271]);
  T('fgA012', [817, 336], [2091, 336]);
  T('fgA012', [1702, 336], [1702, 475], [2003, 475]);
  T('fgA012', [1702, 422], [1996, 422]);
  T('fgA040', [816, 389], [916, 389]);
  T('fgA040', [851, 389], [851, 475], [1357, 475]);
  T('sub006', [977, 251], [1055, 251]);
  T('sub015', [976, 389], [1054, 389]);
  W('lckA007', [1116, 251], [1185, 251]);
  W('uckA016', [1115, 389], [1174, 389], [1174, 272], [1185, 272]);
  W('or008', [1245, 251], [1311, 251]);
  W('hAbn', [321, 518], [756, 518]);
  W('hStAbn', [321, 593], [745, 593], [745, 539], [756, 539]);
  W('or018', [816, 518], [915, 518]);
  W('not019', [975, 518], [1287, 518], [1287, 272], [1311, 272]);
  W('a009', [1371, 251], [1471, 251]);
  W('a009', [1426, 251], [1426, 134], [1818, 134]);
  W('a009', [1426, 188], [1826, 188]);
  W('not010', [1531, 251], [2091, 251]);
  /* reheat steam */
  T('rIn', [319, 731], [754, 731]);
  T('rIn', [730, 731], [730, 889], [753, 889]);
  T('rIn', [730, 816], [753, 816]);
  T('fgA024', [814, 731], [914, 731]);
  T('fgA024', [870, 731], [870, 614], [1156, 614]);
  T('fgA024', [870, 668], [1163, 668]);
  T('rSt', [318, 953], [903, 953], [903, 752], [914, 752]);
  T('rSt', [903, 911], [997, 911]);
  T('fgA031', [813, 816], [2086, 816]);
  T('fgA031', [1698, 816], [1698, 953], [1999, 953]);
  T('fgA031', [1698, 901], [1992, 901]);
  T('fgA042', [813, 889], [997, 889]);
  T('fgA042', [964, 889], [964, 975], [1343, 975]);
  T('sub025', [974, 731], [1052, 731]);
  T('sub046', [1057, 889], [1083, 889]);
  W('lckA026', [1112, 731], [1192, 731]);
  W('uckA043', [1143, 889], [1180, 889], [1180, 752], [1192, 752]);
  W('or041', [1252, 731], [1307, 731]);
  W('rAbn', [317, 1092], [752, 1092]);
  W('rStAbn', [317, 1166], [742, 1166], [742, 1113], [752, 1113]);
  W('or039', [812, 1092], [911, 1092]);
  W('not038', [971, 1092], [1283, 1092], [1283, 752], [1307, 752]);
  W('a028', [1367, 731], [1467, 731]);
  W('a028', [1422, 731], [1422, 614], [1814, 614]);
  W('a028', [1422, 668], [1822, 668]);
  W('not029', [1527, 731], [2087, 731]);
  /* the four tables of the function generators: NO., Xn(DEGC), Yn(DEGC), eight rows */
  const X = ['0.00', '111.40', '288.10', '538.00', '540.00', '550.00', '560.00', '600.00'];
  [
    [352, 396, 476, 558, 'FG *1', X, ['400.00', '400.00', '538.00', '538.00', '538.00', '538.00', '538.00', '538.00']],
    [
      600,
      642,
      721,
      802,
      'FG *2',
      ['0.00', '150.60', '365.70', '538.00', '540.00', '550.00', '560.00', '600.00'],
      ['330.00', '330.00', '538.00', '538.00', '538.00', '538.00', '538.00', '538.00']
    ],
    [
      845,
      887,
      967,
      1046,
      'FG *3',
      ['0.00', '293.20', '323.20', '355.00', '483.00', '531.90', '538.00', '538.01'],
      ['345.00', '345.00', '345.00', '370.00', '470.00', '508.00', '512.80', '538.00']
    ],
    [
      1088,
      1132,
      1212,
      1291,
      'FG *4',
      ['0.00', '302.60', '352.60', '445.60', '538.00', '588.40', '588.41', '600.00'],
      ['290.00', '290.00', '290.00', '380.00', '469.20', '518.00', '538.00', '538.00']
    ]
  ].forEach(([x0, x1, x2, x3, name, xs, ys]) => {
    const row = k => Math.round(1304.5 + 21.3 * k);
    [1283, ...Array.from({ length: 9 }, (_, k) => row(k))].forEach(y =>
      l.push([
        [x0, y],
        [x3, y]
      ])
    );
    [x0, x1, x2, x3].forEach(x =>
      l.push([
        [x, 1283],
        [x, row(8)]
      ])
    );
    t.push(
      [x0 + 7, 1274, name],
      [(x0 + x1) / 2, 1296, 'NO.', 1],
      [(x1 + x2) / 2, 1296, 'Xn(DEGC)', 1],
      [(x2 + x3) / 2, 1296, 'Yn(DEGC)', 1]
    );
    xs.forEach((s, k) => {
      const y = row(k) + 13;
      t.push([(x0 + x1) / 2, y, String(k), 1], [(x1 + x2) / 2, y, s, 1], [(x2 + x3) / 2, y, ys[k], 1]);
    });
  });
  t.push(
    [329, 220, 'HP TURBINE FIRST STAGE'],
    [329, 241, 'INNER WALL METAL TEMP.'],
    [327, 422, 'MSV (B) INLET STEAM TEMP.'],
    [327, 487, 'HP INNER CASING FIRST STG'],
    [327, 508, 'INNER WALL METAL TEMP.(LOWER) ABN.'],
    [326, 583, 'MSV (LOWER) INLET STEAM TEMP. ABN.'],
    [325, 721, 'REHEAT BOWL INNER WALL METAL TEMP.'],
    [324, 943, 'CRV INLET STEAM TEMP.(A)'],
    [323, 1061, 'REHEAT BOWL INNER WALL'],
    [323, 1082, 'METAL TEMP. (LOWER) ABN.'],
    [323, 1156, 'CRV INLET STEAM TEMP.(A) ABN.'],
    [757, 227, '*1'],
    [757, 311, '*3'],
    [753, 706, '*2'],
    [752, 792, '*4'],
    [1008, 124, 'UPPER LIMIT'],
    [1008, 178, 'UPPER LIMIT'],
    [1015, 465, 'LOWER LIMIT'],
    [1497, 124, 'MAIN STEAM TEMP. MISMATCH'],
    [1497, 178, 'MAIN STEAM TEMP. MISMATCH'],
    [1848, 220, 'CRI 1.71 MAIN STEAM'],
    [1848, 241, 'TEMP. MISMATCH OK'],
    [1826, 326, 'HP TARGET TEMP.'],
    [1824, 412, 'TARGET TEMP.'],
    [1824, 465, 'TARGET TEMP.'],
    [1004, 604, 'UPPER LIMIT'],
    [1004, 658, 'UPPER LIMIT'],
    [1118, 965, 'LOWER LIMIT'],
    [1504, 604, 'REHEAT STEAM TEMP. MISMATCH'],
    [1504, 658, 'REHEAT STEAM TEMP. MISMATCH'],
    [1844, 700, 'CRI 1.72 REHEAT STEAM'],
    [1844, 721, 'TEMP. MISMATCH OK'],
    [1821, 806, 'HRH TARGET TEMP.'],
    [1820, 891, 'TARGET TEMP.'],
    [1820, 943, 'TARGET TEMP.'],
    [232, 1522, 'CONTROLLER:'],
    [394, 1522, 'COMM+MD'],
    [655, 1495, 'TRIGGER  :'],
    [655, 1522, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA548',
    title: 'CRITERIA CONDITION',
    page: 118,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    c: [
      ['hIn', 'in', 'A1', 296, 251, '', ['TCA360']],
      ['hSt', 'in', 'B1', 295, 432, '', ['TCA536']],
      ['hAbn', 'in', 'D1', 294, 518, '', ['TCA360']],
      ['hStAbn', 'in', 'B1', 294, 593, '', ['TCE067'], 1],
      ['rIn', 'in', 'A1', 292, 731, '', ['TCA370']],
      ['rSt', 'in', 'A1', 291, 953, '', ['TCA356']],
      ['rAbn', 'in', 'D3', 290, 1092, '', ['TCA356']],
      ['rStAbn', 'in', 'D1', 290, 1166, '', ['TCA356']],
      ['oA1', 'out', 'A1', 1205, 188, '', ['-'], 1],
      ['oA2', 'out', 'A2', 1853, 188, '', ['-'], 1],
      ['oA', 'out', 'A', 2118, 251, '', ['TCA551']],
      ['oB', 'out', 'B', 2118, 336, '', ['-']],
      ['oA3', 'out', 'A3', 2030, 475, '', ['-'], 1],
      ['oB1', 'out', 'B1', 1190, 668, '', ['-'], 1],
      ['oB2', 'out', 'B2', 1849, 668, '', ['-'], 1],
      ['oC', 'out', 'C', 2114, 731, '', ['TCA551']],
      ['oD', 'out', 'D', 2113, 816, '', ['-']],
      ['oD1', 'out', 'D1', 2026, 953, '', ['-'], 1]
    ],
    d: [
      ['crtA1', 1205, 134, 'out', 'TCA548_A1', 'S', '#1C'],
      ['crt1', 1853, 134, 'out', 'TCA548_1', 'S', '#1C'],
      ['crtA5', 1392, 475, 'out', 'TCA548_A5', 'S', '#1C'],
      ['crtA4', 2031, 422, 'out', 'TCA548_A4', 'S', '#1C'],
      ['crtA2', 1191, 614, 'out', 'TCA548_A2', 'S', '#1C'],
      ['crt2', 1849, 614, 'out', 'TCA548_2', 'S', '#1C'],
      ['crtA6', 1378, 975, 'out', 'TCA548_A6', 'S', '#1C'],
      ['crtA3', 2027, 901, 'out', 'TCA548_A3', 'S', '#1C']
    ],
    b: [
      ['ftr001', 'o:FTR', '001', 949, 134],
      ['btr002', 'o:BTR', '002', 1470, 134],
      ['ftr003', 'o:FTR', '003', 948, 188],
      ['btr004', 'o:BTR', '004', 1470, 188],
      ['fgA005', 'FG', 'A005', 788, 262],
      ['sub006', 'SUB', '006', 947, 262, [], { l: ['+', '-'] }],
      ['lckA007', 'LCK', 'A007', 1086, 262, ['K:0.0degC']],
      ['or008', 'OR', '008', 1215, 262],
      ['a009', 'A', '009', 1341, 262],
      ['not010', 'NOT', '010', 1501, 262],
      ['btr011', 'o:BTR', '011', 1586, 251],
      ['fgA012', 'FG', 'A012', 787, 347],
      ['ftr013', 'o:FTR', '013', 1585, 336],
      ['ftr014', 'o:FTR', '014', 1733, 422],
      ['sub015', 'SUB', '015', 946, 400, [], { l: ['+', '-'] }],
      ['uckA016', 'UCK', 'A016', 1085, 400, ['K:0.0degC']],
      ['ftr017', 'o:FTR', '017', 1733, 475],
      ['or018', 'OR', '018', 786, 528],
      ['not019', 'NOT', '019', 945, 528],
      ['ftr020', 'o:FTR', '020', 945, 614],
      ['btr021', 'o:BTR', '021', 1466, 614],
      ['ftr022', 'o:FTR', '022', 945, 668],
      ['btr023', 'o:BTR', '023', 1466, 668],
      ['fgA024', 'FG', 'A024', 784, 742],
      ['sub025', 'SUB', '025', 944, 742, [], { l: ['+', '-'] }],
      ['lckA026', 'LCK', 'A026', 1082, 742, ['K:0.0degC']],
      ['a028', 'A', '028', 1337, 742],
      ['not029', 'NOT', '029', 1497, 742],
      ['btr030', 'o:BTR', '030', 1582, 731],
      ['fgA031', 'FG', 'A031', 783, 827],
      ['ftr032', 'o:FTR', '032', 1581, 816],
      ['ftr033', 'o:FTR', '033', 1729, 901],
      ['ftr036', 'o:FTR', '036', 1729, 953],
      ['not038', 'NOT', '038', 941, 1103],
      ['or039', 'OR', '039', 782, 1103],
      ['fgA040', 'FG', 'A040', 786, 400],
      ['or041', 'OR', '041', 1222, 742],
      ['fgA042', 'FG', 'A042', 783, 900],
      ['uckA043', 'UCK', 'A043', 1113, 900, ['K:0.0degC']],
      ['ftr044', 'o:FTR', '044', 957, 475],
      ['ftr045', 'o:FTR', '045', 1058, 975],
      ['sub046', 'SUB', '046', 1027, 900, [], { l: ['+', '-'] }]
    ],
    w,
    l,
    j: [
      [734, 251],
      [734, 336],
      [873, 251],
      [873, 188],
      [872, 432],
      [851, 389],
      [1702, 336],
      [1702, 422],
      [1426, 251],
      [1426, 188],
      [730, 731],
      [730, 816],
      [870, 731],
      [870, 668],
      [903, 911],
      [964, 889],
      [1698, 816],
      [1698, 901],
      [1422, 731],
      [1422, 668]
    ],
    t
  });
})();
