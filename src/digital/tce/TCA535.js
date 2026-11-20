/* TCA535 CRITERIA CONDITION (331DM09788 page 105, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. The ATS criteria (CRI 1.50 .. 2.94) as the other TCA sheets read them: 41 opened, turbine tripped, shell expansion OK
   (CMP HL 3.0 / LL 2.5 mm, reset by INITIAL), generator load over the initial load, IP to HP transfer complete (also a lamp of the operator
   station, CRT TCA535_1), turbine shutdown load (CPL HL / LL 30.0 MW = 20 % load), the CV chest warming modes, HP turbine warming complete and
   coordination control auto mode. */
(function () {
  if (typeof window === 'undefined') return;
  const IX = 296 /* the input connectors */,
    OX = 2055 /* the output connectors */,
    c = [],
    b = [],
    w = [],
    t = [];
  /* one criterion: [source key, y, input connector or '' (a pentagon), letter, its sheet, input name, BTR, output letter, output sheets, CRI lines] */
  const ROWS = [
    ['iB9', 163, 'B9', 'TCE041', '41 OPENED', '001', 'A', ['TCA562', 'TCA587'], ['CRI 1.50 41 OPENED']],
    ['kTrip', 259, '', '', '', '002', 'B', ['TCA528', 'TCA562'], ['CRI 1.51', 'TURBINE TRIPPED']],
    ['cmpA003', 355, '', '', '', '', 'C', ['TCA563', 'TCA582'], ['CRI 2.1 SHELL', 'EXPANSION OK']],
    ['kLoad', 451, '', '', '', '004', 'D', ['TCA564'], ['CRI 2.5 GEN. LOAD', '> INITIAL LOAD']],
    [
      'iG',
      558,
      'G',
      'TCE184',
      'TRANSFER REGION COMPLETE(IP)',
      '005',
      'E',
      ['TCA511', 'TCA526', 'TCA610', 'TCA768A', 'TCA564'],
      ['CRI 2.6 IP TO HP', 'TRANSFER COMPLETE']
    ],
    ['cplA006', 644, '', '', '', '007', 'F', ['TCA587', 'TCA501', 'TCA564'], ['CRI 2.11 TURBINE', 'SHUTDOWN LOAD']],
    [
      'iA1a',
      749,
      'A1',
      'TCE150',
      'CV CHEST WARMING MODE SET',
      '008',
      'G',
      ['TCA580', 'TCA565', 'TCA615', 'TCA616'],
      ['CRI 2.81 CV CHEST', 'WARMING MODE SET']
    ],
    [
      'iA1b',
      846,
      'A1',
      'TCE151',
      'CV CHEST WARMING AUTO MODE',
      '009',
      'H',
      ['TCA565', 'TCA580'],
      ['CRI 2.82 CV CHEST', 'WARMING AUTO MODE']
    ],
    [
      'iB1',
      931,
      'B1',
      'TCE150',
      'CV CHEST WARMING VALVE START',
      '010',
      'I',
      ['TCA565', 'TCA580'],
      ['CRI 2.83 CV CHEST', 'WARMING VALVE START']
    ],
    [
      'iB2',
      1016,
      'B2',
      'TCE150',
      'CV CHEST WARMING STOP',
      '011',
      'J',
      ['TCA565', 'TCA580'],
      ['CRI 2.84 CV CHEST', 'WARMING STOP']
    ],
    [
      'iA2b',
      1102,
      'A2',
      'TCE150',
      'CV CHEST WARMING MODE RESET',
      '012',
      'K',
      ['TCA566'],
      ['CRI 2.85 CV CHEST', 'WARMING MODE RESET']
    ],
    [
      'iA',
      1188,
      'A',
      'TCA634',
      'HP TURBINE WARMING COMPLETE',
      '013',
      'L',
      ['TCA566'],
      ['CRI 2.92 HP TURBINE', 'WARMING COMPLETE']
    ],
    [
      'iA2c',
      1272,
      'A2',
      'TCE180',
      'TURBINE MASTER ON',
      '014',
      'M',
      ['-'],
      ['CRI 2.94 COORDINATION', 'CONTROL AUTO MODE']
    ]
  ];
  ROWS.forEach(([key, y, l, sh, name, btr, ol, refs, cri]) => {
    if (l) c.push([key, 'in', l, IX, y, name, [sh]]);
    const x0 = l ? IX + 27 : key[0] === 'k' ? 459 : key === 'cplA006' ? 1127 : 1130;
    w.push([
      key,
      [
        [x0, y],
        [OX - 27, y]
      ]
    ]);
    if (btr) b.push(['btr' + btr, 'o:BTR', btr, 1738, y]);
    c.push(['o' + ol, 'out', ol, OX, y, '', refs, 0, refs.length > 2 ? 3 : refs.length > 1 ? 2 : 0]);
    cri.forEach((s, i) => t.push([1795, y - 10 - 21 * (cri.length - 1 - i), s]));
  });
  /* shell expansion over the CMP (reset by INITIAL), generator load over the CPL */
  c.push(['iA2a', 'in', 'A2', IX, 355, 'SHELL EXPANSION', ['TCA318']]);
  b.push(
    ['cmpA003', 'CMP', 'A003', 1100, 366, ['HL:3.0mm', 'LL:2.5mm']],
    ['cplA006', 'CPL', 'A006', 1097, 655, ['HL:30.0MW', 'LL:30.0MW']]
  );
  w.push(
    [
      'iA2a',
      [
        [IX + 27, 355],
        [1070, 355]
      ],
      1
    ],
    [
      'kInit',
      [
        [900, 300],
        [1100, 300],
        [1100, 345]
      ]
    ],
    [
      'kGen',
      [
        [459, 644],
        [1067, 644]
      ],
      1
    ]
  );
  /* the IP to HP transfer complete also lights the operator station lamp */
  b.push(['btr015', 'o:BTR', '015', 1652, 485]);
  w.push([
    'iG',
    [
      [1598, 558],
      [1598, 485],
      [1870, 485]
    ]
  ]);
  t.push(
    [1062, 343, 'T', 2],
    [1058, 632, 'T', 2],
    [1060, 619, '(20%LOAD)'],
    [329, 295, '(TCA103)'],
    [763, 332, '(TCA100)'],
    [329, 487, '(TCA103)'],
    [329, 679, '(TCA104)'],
    [230, 1528, 'CONTROLLER:'],
    [400, 1528, 'COMM+MD'],
    [650, 1500, 'TRIGGER  :'],
    [650, 1526, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA535',
    title: 'CRITERIA CONDITION',
    page: 105,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [160, 85, 2208, 1550],
    /* live: the engine state of the signals named on this sheet (tcs.js tcsLiveRead): TURBINE TRIP, the ICV to CV transfer, GEN. LOAD */
    live: { kTrip: 'trip', iG: 'xfer', kGen: ['mw', 'MW'] },
    k: [
      ['kTrip', 226, 259, 'TURBINE TRIP', 'ref'],
      ['kInit', 667, 300, 'INITIAL', 'ref'],
      ['kLoad', 226, 451, 'GEN.LOAD>INIT.LOAD', 'ref'],
      ['kGen', 226, 644, 'GEN. LOAD', 'ref']
    ],
    c,
    d: [['crt1', 1905, 485, 'out', 'TCA535_1', 'S', '#1C']],
    b,
    w,
    j: [[1598, 558]],
    t
  });
})();
