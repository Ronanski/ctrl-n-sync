/* TCA536 CRITERIA CONDITION (331DM09788 page 106, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. The ATS criteria of the steam and the auxiliaries: CRI 1.3 main steam press. not low (CPL A003 against the limit
   PA2 003 = SG 037 K 105.3 / SG 038 K 76.5 / SG 041 K 57.0 selected by HOT MODE (ASW 039) and WARM MODE (ASW 040)), CRI 1.4 main steam
   temp. not low (CPL A007 against PA2 007 = SG 042 K 345 / SG 043 K 323 / SG 046 K 304 by HOT MODE (ASW 044) and WARM MODE (ASW 045)),
   CRI 1.11 condenser vacuum OK (CMP A034, reset by INITIAL), CRI 1.14 control oil press. not low (CPL A028), CRI 1.15 bearing oil press.
   not low (CPL A031) and condenser vacuum > atmosphere (CMP A035, reset by INITIAL), each low also a lamp of the operator station (CRT). */
(function () {
  if (typeof window === 'undefined') return;
  const IX = 262 /* the input connectors */,
    OX = 2130 /* the output connectors */,
    c = [],
    b = [],
    w = [],
    t = [],
    j = [],
    d = [];
  /* a straight wire, thick (an analog value) or thin */
  const W = (key, pts, thick) => w.push(thick ? [key, pts, 1] : [key, pts]);
  /* a branch from the junction (x, y0) up or down to y: the BTR / FTR at xb and the line to a CRT lamp (crt = its tag) or to a double connector */
  const BR = (key, x, y0, y, tr, no, xb, xe, out, label, thick) => {
    W(
      key,
      [
        [x, y0],
        [x, y],
        [out.crt ? xe - 35 : xe - 27, y]
      ],
      thick
    );
    if (no) b.push([(tr === 'FTR' ? 'ftr' : 'btr') + no, 'o:' + tr, no, xb, y]);
    if (out.crt) d.push(['crt' + out.crt, xe, y, 'out', 'TCA536_' + out.crt, 'S', '#1C']);
    else c.push(['o' + out.l, 'out', out.l, xe, y, '', ['-'], 1]);
    label.forEach((s, i) => t.push([xb + 40, y - 10 - 21 * (label.length - 1 - i), s]));
  };
  /* the input connectors: [key, letter, y, sheet, name, double line] */
  [
    ['iE', 'E', 120, 'TCA500', 'HOT MODE', 0],
    ['iD', 'D', 173, 'TCA500', 'WARM MODE', 0],
    ['iF1', 'F1', 247, 'TCE101', 'MSV INLET STEAM PRESS.', 1],
    ['iA1t', 'A1', 472, 'TCE067', 'MSV INLET STEAM TEMP.', 1],
    ['iA1v', 'A1', 822, 'TCE065', 'CONDENSER VACUUM', 1],
    ['iA1c', 'A1', 981, 'TCE062', 'CONTROL OIL PRESS.', 1],
    ['iA1b', 'A1', 1141, 'TCE061', 'BEARING OIL PRESS. LOW', 1]
  ].forEach(([key, l, y, sh, name, dbl]) => c.push([key, 'in', l, IX, y, name, [sh], dbl]));

  /* main steam press.: the limit of PA2 003 by the start mode (HOT: K 105.3, WARM: K 76.5, else K 57.0) */
  b.push(
    ['sg037', 'SG', '037', 617, 288],
    ['sg038', 'SG', '038', 617, 353],
    ['sg041', 'SG', '041', 617, 419],
    ['asw040', 'ASW', '040', 725, 398],
    ['asw039', 'ASW', '039', 832, 377],
    ['pa2003', 'PA2', '003', 971, 377, [], {}, [60, 80]],
    ['cplA003', 'CPL', 'A003', 972, 258, ['HL:57.0barg', 'LL:57.0barg']],
    ['not004', 'NOT', '004', 1741, 258]
  );
  W('iE', [
    [IX + 27, 120],
    [1229, 120],
    [1229, 580]
  ]);
  W('iE', [
    [832, 120],
    [832, 356]
  ]);
  W('iD', [
    [IX + 27, 173],
    [725, 173],
    [725, 377]
  ]);
  W('iD', [
    [725, 332],
    [1023, 332],
    [1023, 601]
  ]);
  W(
    'sg037',
    [
      [647, 277],
      [791, 277],
      [791, 368],
      [802, 368]
    ],
    1
  );
  W(
    'sg038',
    [
      [647, 342],
      [685, 342],
      [685, 389],
      [695, 389]
    ],
    1
  );
  W(
    'sg041',
    [
      [647, 408],
      [695, 408]
    ],
    1
  );
  W(
    'asw040',
    [
      [755, 387],
      [802, 387]
    ],
    1
  );
  W(
    'asw039',
    [
      [862, 366],
      [941, 366]
    ],
    1
  );
  W(
    'asw039',
    [
      [897, 366],
      [897, 388],
      [941, 388]
    ],
    1
  );
  b.push(['ftr049', 'o:FTR', '049', 915, 388]);
  BR('asw039', 897, 366, 182, 'FTR', '047', 930, 1037, { crt: 'A1' }, [], 1);
  W(
    'iF1',
    [
      [IX + 27, 247],
      [942, 247]
    ],
    1
  );
  W('cplA003', [
    [1002, 247],
    [1711, 247]
  ]);
  BR('cplA003', 1243, 247, 160, 'BTR', '021', 1295, 1647, { crt: '1' }, ['MAIN STEAM PRESS LOW']);
  BR('cplA003', 1243, 247, 215, 'BTR', '001', 1295, 1645, { l: 'A1' }, ['MAIN STEAM PRESS LOW']);
  j.push([725, 332], [832, 120], [897, 366], [1243, 247], [1243, 215]);

  /* main steam temp.: the limit of PA2 007 by the start mode (HOT: K 345, WARM: K 323, else K 304) */
  b.push(
    ['sg042', 'SG', '042', 915, 524],
    ['sg043', 'SG', '043', 905, 588],
    ['sg046', 'SG', '046', 915, 643],
    ['asw045', 'ASW', '045', 1023, 622],
    ['asw044', 'ASW', '044', 1229, 601],
    ['pa2007', 'PA2', '007', 1407, 601, [], {}, [58, 84]],
    ['cplA007', 'CPL', 'A007', 1408, 483, ['HL:304.0degC', 'LL:304.0degC']],
    ['not008', 'NOT', '008', 1728, 483],
    ['ftr025', 'o:FTR', '025', 593, 535],
    ['ftr050', 'o:FTR', '050', 1312, 612]
  );
  c.push(['oB1', 'out', 'B1', 712, 535, '', ['TCA548'], 0, 1]);
  W(
    'iA1t',
    [
      [IX + 27, 472],
      [1378, 472]
    ],
    1
  );
  W(
    'iA1t',
    [
      [540, 472],
      [540, 535],
      [685, 535]
    ],
    1
  );
  W(
    'sg042',
    [
      [945, 513],
      [1187, 513],
      [1187, 592],
      [1199, 592]
    ],
    1
  );
  W(
    'sg043',
    [
      [935, 577],
      [983, 577],
      [983, 613],
      [993, 613]
    ],
    1
  );
  W(
    'sg046',
    [
      [945, 632],
      [993, 632]
    ],
    1
  );
  W(
    'asw045',
    [
      [1053, 611],
      [1199, 611]
    ],
    1
  );
  W(
    'asw044',
    [
      [1259, 590],
      [1377, 590]
    ],
    1
  );
  W(
    'asw044',
    [
      [1291, 590],
      [1291, 612],
      [1377, 612]
    ],
    1
  );
  BR('asw044', 1291, 590, 365, 'FTR', '048', 1315, 1440, { crt: 'A2' }, [], 1);
  W('cplA007', [
    [1438, 472],
    [1698, 472]
  ]);
  BR('cplA007', 1610, 472, 355, 'BTR', '022', 1707, 2057, { crt: '2' }, ['MAIN STEAM TEMP. LOW']);
  BR('cplA007', 1610, 472, 409, 'BTR', '005', 1707, 2057, { l: 'A2' }, ['MAIN STEAM TEMP. LOW']);
  j.push([540, 472], [1291, 590], [1610, 472], [1610, 409]);

  /* condenser vacuum, control oil and bearing oil: the CMP / CPL of each, its NOT out to the criterion, the lows to the lamps */
  b.push(
    ['cmpA034', 'CMP', 'A034', 923, 833, ['HL:0.14kg/cm2abs', 'LL:0.12kg/cm2abs']],
    ['cplA028', 'CPL', 'A028', 922, 992, ['HL:138.0kg/cm2g', 'LL:133.0kg/cm2g']],
    ['cplA031', 'CPL', 'A031', 921, 1152, ['HL:1.33kg/cm2g', 'LL:1.05g/cm2g']],
    ['cmpA035', 'CMP', 'A035', 921, 1301, ['HL:1.0kg/cm2abs', 'LL:0.96kg/cm2abs']],
    ['not012', 'NOT', '012', 1722, 833],
    ['not016', 'NOT', '016', 1719, 992],
    ['not020', 'NOT', '020', 1717, 1152]
  );
  W(
    'iA1v',
    [
      [IX + 27, 822],
      [893, 822]
    ],
    1
  );
  W(
    'iA1v',
    [
      [817, 822],
      [817, 1290],
      [891, 1290]
    ],
    1
  );
  W(
    'iA1c',
    [
      [IX + 27, 981],
      [892, 981]
    ],
    1
  );
  W(
    'iA1b',
    [
      [IX + 27, 1141],
      [891, 1141]
    ],
    1
  );
  W('kInit', [
    [465, 717],
    [923, 717],
    [923, 812]
  ]);
  W('kInit', [
    [850, 717],
    [850, 1248],
    [921, 1248],
    [921, 1280]
  ]);
  W('cmpA034', [
    [953, 822],
    [1692, 822]
  ]);
  W('cplA028', [
    [952, 981],
    [1689, 981]
  ]);
  W('cplA031', [
    [951, 1141],
    [1687, 1141]
  ]);
  BR('cmpA034', 1041, 822, 737, 'BTR', '032', 1093, 1443, { crt: '5' }, ['CONDENSER VACUUM', 'LOW']);
  BR('cmpA034', 1041, 822, 790, 'BTR', '033', 1093, 1445, { l: 'A5' }, ['CONDENSER VACUUM', 'LOW']);
  BR('cplA028', 1040, 981, 898, 'BTR', '026', 1093, 1443, { crt: '3' }, ['CONTROL OIL PRESS.']);
  BR('cplA028', 1040, 981, 950, 'BTR', '027', 1093, 1443, { l: 'A3' }, ['CONTROL OIL PRESS.']);
  BR('cplA031', 1038, 1141, 1057, 'BTR', '029', 1091, 1441, { crt: '4' }, ['BEARING OIL', 'PRESS. LOW']);
  BR('cplA031', 1038, 1141, 1109, 'BTR', '030', 1091, 1441, { l: 'A4' }, ['BEARING OIL', 'PRESS. LOW']);
  /* condenser vacuum low also out alone (C1), ahead of the NOT */
  W('cmpA034', [
    [1563, 822],
    [1563, 739],
    [OX - 27, 739]
  ]);
  b.push(['btr024', 'o:BTR', '024', 1617, 739]);
  c.push(['oC1', 'out', 'C1', OX, 739, '', ['TCA685'], 0, 1]);
  t.push([1708, 729, 'CONDENSER VACUUM LOW']);
  /* condenser vacuum > atmosphere */
  W('cmpA035', [
    [951, 1290],
    [OX - 27, 1290]
  ]);
  b.push(['btr036', 'o:BTR', '036', 1717, 1290]);
  c.push(['oF', 'out', 'F', OX, 1290, '', ['TCA638'], 0, 1]);
  t.push([1785, 1270, 'CONDENSER VACUUM>ATMOSPHERE']);
  BR('cmpA035', 1588, 1290, 1218, 'BTR', '', 0, 1905, { crt: '6' }, []);
  j.push(
    [817, 822],
    [850, 717],
    [1041, 822],
    [1041, 790],
    [1040, 981],
    [1040, 950],
    [1038, 1141],
    [1038, 1109],
    [1563, 822],
    [1588, 1290]
  );

  /* the NOT outputs: the criteria */
  [
    ['not004', 1771, 247, 'A', ['TCA550'], 1, ['CRI 1.3 MAIN STEAM', 'PRESS. NOT LOW']],
    ['not008', 1758, 472, 'B', ['TCA550'], 1, ['CRI 1.4 MAIN STEAM', 'TEMP. NOT LOW']],
    ['not012', 1752, 822, 'C', ['TCA768', 'TCA552', 'TCA631'], 3, ['CRI 1.11 CONDENSER', 'VACUUM OK']],
    ['not016', 1749, 981, 'D', ['TCA553'], 1, ['CRI 1.14 CONTROL', 'OIL PRESS. NOT LOW']],
    ['not020', 1747, 1141, 'E', ['TCA553', 'TCA768'], 1, ['CRI 1.15 BEARING OIL', 'PRESS. NOT LOW']]
  ].forEach(([key, x0, y, ol, refs, under, cri]) => {
    W(key, [
      [x0, y],
      [OX - 27, y]
    ]);
    c.push(['o' + ol, 'out', ol, OX, y, '', refs, 0, under]);
    cri.forEach((s, i) => t.push([1810, y - 10 - 21 * (cri.length - 1 - i), s]));
  });
  t.push(
    [930, 236, 'T', 2],
    [1366, 461, 'T', 2],
    [881, 811, 'T', 2],
    [879, 970, 'T', 2],
    [877, 1130, 'T', 2],
    [877, 1279, 'T', 2],
    [365, 750, '(TCA100)'],
    [500, 297, 'K:105.3'],
    [500, 361, 'K:76.5'],
    [500, 425, 'K:57.0'],
    [803, 531, 'K:345'],
    [790, 595, 'K:323'],
    [800, 648, 'K:304'],
    [225, 1527, 'CONTROLLER:'],
    [388, 1527, 'COMM+MD'],
    [649, 1498, 'TRIGGER  :'],
    [649, 1525, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA536',
    /* pr: printed on page 106 beside each block; the drawing above keeps them as text */
    pr: {
      sg037: ['K:105.3'],
      sg038: ['K:76.5'],
      sg041: ['K:57.0'],
      sg042: ['K:345'],
      sg043: ['K:323'],
      sg046: ['K:304']
    },
    title: 'CRITERIA CONDITION',
    page: 106,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [160, 85, 2208, 1550],
    k: [['kInit', 232, 717, 'INITIAL', 'ref']],
    c,
    d,
    b,
    w,
    j,
    t
  });
})();
