/* TCA544 CRITERIA CONDITION (331DM09788 page 114, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. CRI 1.28 diff. expansion OK: the LP turbine diff. expansion high, rotor long (CMP 015 HL / LL 7.5 mm, reset by INITIAL)
   or rotor short (CPL 016 HL / LL -5.6), OR 002, NOT 003; each high also a lamp (CRT TCA544_1 / _2) and a line out (B1 / B2), the OK a lamp
   (TCA544_5) and a line out (A1). V/F start up (B): 52G opened with the 24 (V/Hz) 2nd or 3rd step (A 018, lamp TCA544_3) sets FFR 019, ATS OFF
   or the turbine trip (OR 023) resets it, NOT 020. House load operation (lamp TCA544_7): 52G closed and 52L open (A 025, also C) or 52L opened
   while on the line (FFR 027, reset by the turbine trip or 52G not closed) with 52L open (A 028). */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    b = [],
    c = [],
    d = [],
    t = [];
  const W = (key, pts, thick) => w.push(thick ? [key, pts, 1] : [key, pts]);
  /* a branch from the junction (x, y0) to y: the BTR at xb, the line to a CRT lamp (tip xe) or to a double connector (centre xe + 27) */
  const BR = (key, x, y0, y, no, xb, xe, out, label, tx) => {
    W(key, [
      [x, y0],
      [x, y],
      [xe, y]
    ]);
    b.push(['btr' + no, 'o:BTR', no, xb, y]);
    if (out.crt) d.push(['crt' + out.crt, xe + 35, y, 'out', 'TCA544_' + out.crt, 'S', '#1C']);
    else c.push(['o' + out.l, 'out', out.l, xe + 27, y, '', ['-'], 1]);
    label.forEach((s, i) => t.push([tx, y - 10 - 21 * (label.length - 1 - i), s]));
  };
  /* LP turbine diff. expansion */
  c.push(['iA1', 'in', 'A1', 273, 275, '', ['TCA318'], 0]);
  t.push([307, 243, 'LP TURBINE'], [307, 264, 'DIFF. EXPANSION']);
  W(
    'iA1',
    [
      [300, 275],
      [555, 275]
    ],
    1
  );
  W(
    'iA1',
    [
      [489, 275],
      [489, 434],
      [553, 434]
    ],
    1
  );
  W('kInit', [
    [470, 148],
    [585, 148],
    [585, 264]
  ]);
  b.push(
    ['cmp015', 'CMP', '015', 584, 286, ['HL:7.5mm', 'LL:7.5mm']],
    ['cpl016', 'CPL', '016', 582, 445, ['HL:-5.6', 'LL:-5.6']],
    ['or002', 'OR', '002', 1595, 307, [], {}, [59, 86]],
    ['not003', 'NOT', '003', 1702, 286]
  );
  W('cmp015', [
    [613, 275],
    [1565, 275]
  ]);
  BR(
    'cmp015',
    765,
    275,
    243,
    '001',
    810,
    1281,
    { crt: '1' },
    ['LP TURBINE DIFF. EXPANSION (HIP) HIGH', '(ROTOR LONG)'],
    837
  );
  BR('cmp015', 765, 275, 328, '004', 810, 1280, { l: 'B1' }, ['LP TURBINE DIFF. EXPANSION HIGH', '(ROTOR LONG)'], 837);
  W('cpl016', [
    [611, 434],
    [1499, 434],
    [1499, 296],
    [1565, 296]
  ]);
  W('cpl016', [
    [1499, 317],
    [1565, 317]
  ]);
  W('cpl016', [
    [1499, 338],
    [1565, 338]
  ]);
  BR(
    'cpl016',
    764,
    434,
    403,
    '005',
    809,
    1281,
    { crt: '2' },
    ['LP TURBINE DIFF. EXPANSION HIGH', '(ROTOR SHORT)'],
    836
  );
  BR('cpl016', 764, 434, 488, '006', 809, 1280, { l: 'B2' }, ['LP TURBINE DIFF. EXPANSION HIGH', '(ROTOR SHORT)'], 836);
  W('or002', [
    [1624, 275],
    [1672, 275]
  ]);
  W('not003', [
    [1731, 275],
    [2037, 275]
  ]);
  BR('not003', 1765, 275, 360, '012', 1797, 1993, { crt: '5' }, ['DIFF.', 'EXPANSION OK'], 1835);
  BR('not003', 1765, 275, 424, '013', 1797, 1993, { l: 'A1' }, ['DIFF.', 'EXPANSION OK'], 1835);
  /* V/F start up: 52G opened in the 24 2nd / 3rd step sets FFR 019; ATS OFF or the turbine trip resets it */
  c.push(['iK', 'in', 'K', 315, 616, '', ['TCA533'], 0], ['iA1v', 'in', 'A1', 314, 679, '', ['TCT072'], 1]);
  t.push([348, 606, '52G OPEND'], [347, 669, '24 2nd OR 3rd STEP']);
  b.push(
    ['a018', 'A', '018', 806, 627, [], {}, [59, 42]],
    ['ffr019', 'FFR', '019', 1211, 627, [], { l: ['S', 'R'] }, [79, 42]],
    ['not020', 'NOT', '020', 1497, 627],
    ['btr022', 'o:BTR', '022', 549, 754],
    ['or023', 'OR', '023', 816, 765, [], {}, [59, 42]],
    ['btr024', 'o:BTR', '024', 549, 839]
  );
  W('iK', [
    [342, 616],
    [777, 616]
  ]);
  W('iA1v', [
    [341, 679],
    [731, 679],
    [731, 638],
    [777, 638]
  ]);
  W('a018', [
    [835, 616],
    [1171, 616]
  ]);
  BR('a018', 1019, 616, 542, '017', 1127, 2013, { crt: '3' }, ['2nd 3rd V/H OPERATED'], 1217);
  W('kAtsOff', [
    [476, 754],
    [787, 754]
  ]);
  W('kTrip', [
    [476, 839],
    [730, 839],
    [730, 776],
    [787, 776]
  ]);
  W('or023', [
    [845, 754],
    [1103, 754],
    [1103, 638],
    [1171, 638]
  ]);
  W('ffr019', [
    [1250, 616],
    [1467, 616]
  ]);
  W('not020', [
    [1527, 616],
    [2013, 616]
  ]);
  BR('not020', 1657, 616, 807, '021', 1698, 2011, { crt: '6' }, [], 0);
  /* house load operation */
  c.push(['iB10', 'in', 'B10', 323, 1031, '', ['TCE041'], 1]);
  t.push([357, 1021, '52L OPEN']);
  b.push(
    ['a025', 'A', '025', 814, 946, [], {}, [59, 42]],
    ['not026', 'NOT', '026', 899, 1042],
    ['ffr027', 'FFR', '027', 1134, 1042, [], { l: ['S', 'R'] }, [81, 43]],
    ['a028', 'A', '028', 1355, 1094, [], {}, [60, 64]],
    ['or029', 'OR', '029', 898, 1126, [], {}, [59, 42]],
    ['not030', 'NOT', '030', 739, 1180]
  );
  W('k52g', [
    [475, 935],
    [785, 935]
  ]);
  W('k52g', [
    [611, 935],
    [611, 1169],
    [709, 1169]
  ]);
  W('k52g', [
    [611, 988],
    [1260, 988],
    [1260, 1073],
    [1325, 1073]
  ]);
  W('a025', [
    [844, 935],
    [2011, 935]
  ]);
  W('kTrip', [
    [665, 839],
    [665, 1115],
    [869, 1115]
  ]);
  W('iB10', [
    [350, 1031],
    [869, 1031]
  ]);
  W('iB10', [
    [739, 1031],
    [739, 957],
    [785, 957]
  ]);
  W('iB10', [
    [803, 1031],
    [803, 1232],
    [1239, 1232],
    [1239, 1111],
    [1325, 1111]
  ]);
  W('not026', [
    [929, 1031],
    [1093, 1031]
  ]);
  W('not030', [
    [769, 1169],
    [825, 1169],
    [825, 1137],
    [869, 1137]
  ]);
  W('or029', [
    [928, 1115],
    [1037, 1115],
    [1037, 1053],
    [1093, 1053]
  ]);
  W('ffr027', [
    [1174, 1031],
    [1238, 1031],
    [1238, 1093],
    [1325, 1093]
  ]);
  W('a028', [
    [1385, 1073],
    [2009, 1073]
  ]);
  d.push(['crt7', 2044, 1073, 'out', 'TCA544_7', 'S', '#1C']);
  c.push(
    ['oA', 'out', 'A', 2064, 275, '', ['TCA557', 'TCA768'], 0, 2],
    ['oB', 'out', 'B', 2040, 616, '', ['TCA564'], 0, 1],
    ['oC', 'out', 'C', 2038, 935, '', ['TCA567', 'TCA583'], 0, 2]
  );
  t.push(
    [1832, 245, 'CRI 1.28 DIFF.'],
    [1832, 266, 'EXPANSION OK'],
    [1605, 606, 'V/F START UP'],
    [1466, 1063, 'HOUSE LOAD OPERATION'],
    [541, 265, 'T', 2],
    [540, 424, 'T', 2],
    [1158, 605, 'T', 2],
    [1080, 1020, 'T', 2],
    [373, 185, '(TCA100)'],
    [380, 877, '(TCA103)'],
    [380, 973, '(TCA103)'],
    [380, 791, '(TCA501)'],
    [222, 1530, 'CONTROLLER:'],
    [385, 1530, 'COMM+MD'],
    [647, 1503, 'TRIGGER  :'],
    [647, 1530, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA544',
    title: 'CRITERIA CONDITION',
    page: 114,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [160, 85, 2208, 1550],
    k: [
      ['kInit', 237, 148, 'INITIAL', 'ref'],
      ['kAtsOff', 243, 754, 'ATS OFF', 'ref'],
      ['kTrip', 243, 839, 'TURBINE TRIP', 'ref'],
      ['k52g', 242, 935, '52G CLOSE', 'ref']
    ],
    c,
    d,
    b,
    w,
    j: [
      [489, 275],
      [765, 275],
      [764, 434],
      [1499, 317],
      [1499, 338],
      [1765, 275],
      [1765, 360],
      [1019, 616],
      [1657, 616],
      [665, 839],
      [611, 935],
      [611, 988],
      [739, 1031],
      [803, 1031]
    ],
    t
  });
})();
