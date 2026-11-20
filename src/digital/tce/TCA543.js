/* TCA543 CRITERIA CONDITION (331DM09788 page 113, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. CRI 1.25 drain valve open = A 001 of the MSV (A) / (B) and CV (A) / (B) above seat and the CRV (A) / (B) below seat
   secondary drain valves full open (one input of the system reference ON(1)); CRI 1.44 field switch closed (41 CLOSE of TCA103, BTR 002) and
   CRI 1.45 gen voltage OK (TCA045, BTR 003). */
(function () {
  if (typeof window === 'undefined') return;
  const OX = 2099 /* the output connectors */,
    w = [],
    c = [],
    t = [];
  const W = (key, pts) => w.push([key, pts]);
  /* the six drains: [key, connector x, line y, sheet, valve, above / below, the x of the rise, the A input y] */
  const IN = [
    ['iMa', 323, 193, 'TCA610', 'MSV(A) ABV', 0, 193],
    ['iMb', 322, 267, 'TCA611', 'MSV(B) ABV', 868, 215],
    ['iCa', 321, 342, 'TCA615', 'CV(A) ABV', 889, 236],
    ['iCb', 321, 416, 'TCA616', 'CV(B) ABV', 911, 258],
    ['iRa', 319, 566, 'TCA625', 'CRV(A) BEL', 951, 300],
    ['iRb', 318, 640, 'TCA626', 'CRV(B) BEL', 972, 321]
  ];
  IN.forEach(([key, x, y, sh, v, rx, ay]) => {
    c.push([key, 'in', 'B1', x, y, '', [sh], 0]);
    t.push([x + 32, y - 32, v + ' SEAT SEC'], [x + 32, y - 11, 'DRN VLV FULL OPEN']);
    W(
      key,
      rx
        ? [
            [x + 27, y],
            [rx, y],
            [rx, ay],
            [1051, ay]
          ]
        : [
            [x + 27, y],
            [1051, y]
          ]
    );
  });
  W('kOn', [
    [516, 492],
    [931, 492],
    [931, 279],
    [1051, 279]
  ]);
  W('a001', [
    [1110, 193],
    [OX - 27, 193]
  ]);
  /* field switch, gen voltage */
  W('k41', [
    [440, 832],
    [OX - 27, 832]
  ]);
  W('iA7', [
    [354, 960],
    [OX - 27, 960]
  ]);
  c.push(
    ['iA7', 'in', 'A7', 327, 960, '', ['TCA045'], 0],
    ['oA', 'out', 'A', OX, 193, '', ['TCA511', 'TCA556'], 0, 2],
    ['oB', 'out', 'B', OX, 832, '', ['TCA511', 'TCA512', 'TCA560'], 0, 4],
    ['oC', 'out', 'C', OX, 960, '', ['TCA511', 'TCA561'], 0, 2]
  );
  t.push(
    [1797, 162, 'CRI 1.25 DRAIN'],
    [1797, 183, 'VALVE OPEN'],
    [1794, 801, 'CRI 1.44 FIELD'],
    [1794, 822, 'SWITCH CLOSED'],
    [1793, 929, 'CRI 1.45 GEN'],
    [1793, 950, 'VOLTAGE OK'],
    [328, 864, '(TCA103)'],
    [229, 1523, 'CONTROLLER:'],
    [388, 1523, 'COMM+MD'],
    [613, 1497, 'TRIGGER  :'],
    [613, 1523, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA543',
    title: 'CRITERIA CONDITION',
    page: 113,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [160, 85, 2208, 1550],
    k: [
      ['kOn', 283, 492, 'ON(1)', 'sys.ref'],
      ['k41', 207, 832, '41 CLOSE', 'ref']
    ],
    c,
    d: [],
    b: [
      ['a001', 'A', '001', 1081, 258, [], {}, [59, 149]],
      ['btr002', 'o:BTR', '002', 1681, 832],
      ['btr003', 'o:BTR', '003', 1680, 960]
    ],
    w,
    j: [],
    t
  });
})();
