/* TCA537 CRITERIA CONDITION (331DM09788 page 107, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. CRI 1.24 vibration not high: the shaft vibration high (> 0.125 mm) of the bearings No.1 to No.4 in X (OR 003) and in
   Y (OR 020), each also a lamp of the operator station (CRT TCA537_2 .. _9) and a line to TCA538 (A1 .. A4, B1 .. B4); the two spare inputs
   of each OR are the system reference OFF(0) (A5, A6, B5, B6). OR 004 of both, NOT 005 = vibration not high (A, lamp TCA537_1, C1). */
(function () {
  if (typeof window === 'undefined') return;
  const OX = 2144 /* the output connector A */,
    w = [],
    b = [],
    c = [],
    d = [],
    k = [],
    j = [],
    t = [];
  const W = (key, pts) => w.push([key, pts]);
  /* the rows: [y, input x (0 = OFF(0) pentagon), letter, sheet, bearing and direction, BTR, junction x, BTR x, out x left, out letter,
     the lamp (vertical x, lamp y, diamond tip x, tag no.) or none, the OR input (vertical x, y) or none (straight in)] */
  const ROWS = [
    [
      190,
      331,
      'A1',
      'TCA048',
      'NO.1 BRG SHAFT VIBRATION',
      'HIGH (X) (>0.125mm)',
      '001',
      705,
      758,
      892,
      'A1',
      [1121, 150, 1180, 2],
      null
    ],
    [
      286,
      331,
      'A1',
      'TCA050',
      'NO.2 BRG SHAFT VIBRATION',
      'HIGH (X) (>0.125mm)',
      '006',
      705,
      758,
      891,
      'A2',
      [1121, 246, 1181, 3],
      [1281, 212]
    ],
    [
      383,
      330,
      'A2',
      'TCA049',
      'NO.3 BRG SHAFT VIBRATION',
      'HIGH (X) (>0.125mm)',
      '010',
      704,
      757,
      891,
      'A3',
      [1099, 342, 1180, 4],
      [1302, 233]
    ],
    [
      479,
      330,
      'A2',
      'TCA051',
      'NO.4 BRG SHAFT VIBRATION',
      'HIGH (X) (>0.125mm)',
      '012',
      704,
      757,
      890,
      'A4',
      [1109, 436, 1178, 5],
      [1323, 254]
    ],
    [575, 0, '', '', '', '', '014', 703, 756, 889, 'A5', null, [1343, 276]],
    [671, 0, '', '', '', '', '016', 703, 756, 889, 'A6', null, [1363, 297]],
    [
      766,
      327,
      'A1',
      'TCA049',
      'NO.1 BRG SHAFT VIBRATION',
      'HIGH (Y) (>0.125mm)',
      '018',
      702,
      755,
      887,
      'B1',
      [1097, 723, 1177, 6],
      null
    ],
    [
      862,
      327,
      'A1',
      'TCA051',
      'NO.2 BRG SHAFT VIBRATION',
      'HIGH (Y) (>0.125mm)',
      '021',
      701,
      754,
      887,
      'B2',
      [1097, 819, 1175, 7],
      [1277, 787]
    ],
    [
      957,
      327,
      'A2',
      'TCA048',
      'NO.3 BRG SHAFT VIBRATION',
      'HIGH (Y) (>0.125mm)',
      '023',
      701,
      754,
      886,
      'B3',
      [1096, 915, 1175, 8],
      [1298, 808]
    ],
    [
      1053,
      327,
      'A2',
      'TCA050',
      'NO.4 BRG SHAFT VIBRATION',
      'HIGH (Y) (>0.125mm)',
      '025',
      700,
      753,
      885,
      'B4',
      [1084, 1011, 1163, 9],
      [1318, 829]
    ],
    [1149, 0, '', '', '', '', '027', 700, 753, 885, 'B5', null, [1339, 850]],
    [1245, 0, '', '', '', '', '029', 699, 752, 885, 'B6', null, [1359, 872]]
  ];
  ROWS.forEach(([y, ix, l, sh, n1, n2, no, jx, bx, ox, ol, crt, orIn], i) => {
    const key = ix ? 'i' + i : 'kOff' + i,
      x0 = ix ? ix + 27 : (y < 700 ? 259 : 267) + 233,
      orX = i < 6 ? 1390 : 1385;
    if (ix) {
      c.push([key, 'in', l, ix, y, '', [sh]]);
      t.push([ix + 33, y - 32, n1], [ix + 33, y - 11, n2]);
    } else k.push([key, y < 700 ? 259 : 267, y, 'OFF(0)', 'sys.ref']);
    /* the main line to the OR (straight in, or up a vertical to its input) */
    W(
      key,
      orIn
        ? [
            [x0, y],
            [orIn[0], y],
            [orIn[0], orIn[1]],
            [orX, orIn[1]]
          ]
        : [
            [x0, y],
            [orX, y]
          ]
    );
    /* the branch to TCA538 */
    W(key, [
      [jx, y],
      [jx, y - 31],
      [ox, y - 31]
    ]);
    b.push(['btr' + no, 'o:BTR', no, bx, y - 31]);
    c.push(['o' + ol, 'out', ol, ox + 27, y - 31, '', ['TCA538']]);
    j.push([jx, y]);
    /* the lamp of the operator station */
    if (crt) {
      W(key, [
        [crt[0], y],
        [crt[0], crt[1]],
        [crt[2], crt[1]]
      ]);
      d.push(['crt' + crt[3], crt[2] + 35, crt[1], 'out', 'TCA537_' + crt[3], 'S', '#1C']);
      j.push([crt[0], y]);
    }
  });
  /* X and Y high to one OR, NOT = vibration not high */
  b.push(
    ['or003', 'OR', '003', 1419, 243, [], {}, [59, 127]],
    ['or020', 'OR', '020', 1415, 818, [], {}, [59, 128]],
    ['or004', 'OR', '004', 1547, 201],
    ['not005', 'NOT', '005', 1663, 201],
    ['btr007', 'o:BTR', '007', 1759, 276],
    ['btr009', 'o:BTR', '009', 1759, 339]
  );
  W('or003', [
    [1449, 190],
    [1517, 190]
  ]);
  W('or020', [
    [1444, 766],
    [1505, 766],
    [1505, 212],
    [1517, 212]
  ]);
  W('or004', [
    [1577, 190],
    [1633, 190]
  ]);
  W('not005', [
    [1693, 190],
    [OX - 27, 190]
  ]);
  W('not005', [
    [1727, 190],
    [1727, 339],
    [2000, 339]
  ]);
  W('not005', [
    [1727, 276],
    [2000, 276]
  ]);
  j.push([1727, 190], [1727, 276]);
  c.push(['oA', 'out', 'A', OX, 190, '', ['TCA556', 'TCA768'], 0, 1], ['oC1', 'out', 'C1', 2027, 339, '', ['-'], 1]);
  d.push(['crt1', 2035, 276, 'out', 'TCA537_1', 'S', '#1C']);
  t.push(
    [1805, 159, 'CRI 1.24 VIBRATION'],
    [1805, 180, 'NOT HIGH'],
    [1807, 245, 'VIBRATION'],
    [1807, 266, 'NOT HIGH'],
    [1807, 309, 'VIBRATION'],
    [1807, 330, 'NOT HIGH'],
    [228, 1532, 'CONTROLLER:'],
    [389, 1532, 'COMM+MD'],
    [651, 1505, 'TRIGGER  :'],
    [651, 1531, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA537',
    title: 'CRITERIA CONDITION',
    page: 107,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [160, 85, 2208, 1550],
    k,
    c,
    d,
    b,
    w,
    j,
    t
  });
})();
