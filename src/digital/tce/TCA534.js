/* TCA534 CRITERIA CONDITION (331DM09788 page 104, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. The bearing metal temp. high of the turbine: the thrust bearing front and rear end embedded metal temp. (A) / (B)
   (CMP A003 / A046 / A008 / A050, HL 85.0 / LL 83.0 degC) to OR 044, NOT 005 = CRI 1.31 thrust metal temp. not high (A); the journal
   bearings No.1 to No.4 (CMP A017 / A022 / A025 / A028, HL 115.0 / LL 113.0 degC) and two spare (CMP A031 / A034 of the system reference
   0.0, HL / LL 107.0 degC) to OR 018, NOT 019 = CRI 1.30 bearing metal temp. not high (B). Each high also a lamp of the operator station
   (CRT TCA534_1 .. _8, _11, _21) and a line out (A1 .. A8, B1, B2); the (A) CMP and the journal CMP reset by INITIAL. */
(function () {
  if (typeof window === 'undefined') return;
  const IV = 590 /* the INITIAL vertical */,
    w = [],
    b = [],
    c = [],
    d = [],
    j = [],
    t = [],
    k = [
      ['kInit', 334, 152, 'INITIAL', 'ref'],
      ['k00', 193, 1228, '0.0', 'sys.ref']
    ];
  const W = (key, pts, thick) => w.push(thick ? [key, pts, 1] : [key, pts]);
  /* the rows: [line y, input centre x (0 = the 0.0 reference), letter, sheet, name lines, CMP no., CMP centre x, HL, LL, INITIAL (the x of
     its drop, the y of its branch) or none, junction x, BTR x, BTR up / down, lamp tip x and tag, connector centre x and letter, the OR input
     (vertical x, y) or none (straight in), the x of the right texts, the text, whether the texts stand on the two branches] */
  const ROWS = [
    [
      236,
      222,
      'A4',
      'TCA358',
      ['T-BRG FR-END EMBEDDED', 'METAL TEMP.(A)'],
      'A003',
      702,
      '85.0',
      '83.0',
      [703, 152],
      787,
      841,
      ['001', '036'],
      [1381, '1'],
      [1408, 'A1'],
      null,
      880,
      'T-BRG FR-END EMBEDDED METAL TEMP.(A) HIGH',
      0
    ],
    [
      354,
      231,
      'A4',
      'TCA362',
      ['T-BRG FR-END EMBEDDED', 'METAL TEMP.(B)'],
      'A046',
      711,
      '85.0',
      '83.0',
      null,
      797,
      851,
      ['045', '047'],
      [1390, '11'],
      [1416, 'B1'],
      [1543, 258],
      889,
      'T-BRG FR-END EMBEDDED METAL TEMP.(B)HIGH',
      0
    ],
    [
      483,
      219,
      'A1',
      'TCA359',
      ['T-BRG RE-END EMBEDDED', 'METAL TEMP.(A)'],
      'A008',
      699,
      '85.0',
      '83.0',
      [700, 451],
      785,
      839,
      ['048', '049'],
      [1378, '2'],
      [1404, 'A2'],
      [1563, 279],
      877,
      'T-BRG RE-END EMBEDDED METAL TEMP.(A)HIGH',
      0
    ],
    [
      600,
      229,
      'A1',
      'TCA363',
      ['T-BRG RE-END EMBEDDED', 'METAL TEMP.(B)'],
      'A050',
      708,
      '85.0',
      '83.0',
      null,
      794,
      849,
      ['006', '037'],
      [1387, '21'],
      [1413, 'B2'],
      [1603, 300],
      887,
      'T-BRG RE-END EMBEDDED METAL TEMP.(B)HIGH',
      0
    ],
    [
      717,
      216,
      'A1',
      'TCA354',
      ['NO.1 TURBINE JUNA', 'BEARING METAL TEMP.'],
      'A017',
      696,
      '115.0',
      '113.0',
      [697, 685],
      782,
      836,
      ['015', '038'],
      [1375, '3'],
      [1400, 'A3'],
      null,
      884,
      'NO.1 BEARING METAL TEMP.HIGH',
      1
    ],
    [
      845,
      214,
      'A2',
      'TCA354',
      ['NO.2 TURBINE JUNA', 'BEARING', 'METAL TEMP.'],
      'A022',
      694,
      '115.0',
      '113.0',
      [699, 813],
      781,
      835,
      ['020', '039'],
      [1372, '4'],
      [1398, 'A4'],
      [1558, 739],
      882,
      'NO.2 BEARING METAL TEMP.HIGH',
      1
    ],
    [
      973,
      213,
      'A3',
      'TCA354',
      ['NO.3 BEARING', 'METAL TEMP.'],
      'A025',
      693,
      '115.0',
      '113.0',
      [694, 941],
      779,
      833,
      ['023', '040'],
      [1371, '5'],
      [1397, 'A5'],
      [1577, 760],
      881,
      'NO.3 BEARING METAL TEMP.HIGH',
      1
    ],
    [
      1100,
      211,
      'A4',
      'TCA354',
      ['NO.4 BEARING', 'METAL TEMP.'],
      'A028',
      691,
      '115.0',
      '113.0',
      [692, 1069],
      778,
      832,
      ['026', '041'],
      [1369, '6'],
      [1395, 'A6'],
      [1597, 781],
      879,
      'NO.4 BEARING METAL TEMP.HIGH',
      1
    ],
    [
      1228,
      0,
      '',
      '',
      [],
      'A031',
      691,
      '107.0',
      '107.0',
      [691, 1196],
      776,
      831,
      ['029', '042'],
      [1367, '7'],
      [1394, 'A7'],
      [1616, 803],
      878,
      '(SPARE)',
      1
    ],
    [
      1355,
      0,
      '',
      '',
      [],
      'A034',
      689,
      '107.0',
      '107.0',
      null,
      775,
      829,
      ['032', '043'],
      [1366, '8'],
      [1392, 'A8'],
      [1635, 824],
      877,
      '(SPARE)',
      1
    ]
  ];
  ROWS.forEach(([y, ix, l, sh, names, no, cx, hl, ll, ini, jx, bx, btr, crt, out, orIn, tx, txt, onBr], i) => {
    const key = 'i' + l + '_' + i,
      cmp = 'cmp' + no,
      orX = i < 4 ? 1675 : 1669;
    if (ix) {
      c.push([key, 'in', l, ix, y, '', [sh], 1]);
      names.forEach((s, n) => t.push([ix + 33, y - 11 - 21 * (names.length - 1 - n), s]));
      W(
        key,
        [
          [ix + 27, y],
          [cx - 30, y]
        ],
        1
      );
    }
    b.push([cmp, 'CMP', no, cx, y + 11, ['HL:' + hl + 'degC', 'LL:' + ll + 'degC']]);
    t.push([cx - 48, y - 10, 'T', 2]);
    /* the reset of this CMP by INITIAL (the first row from the pentagon itself, the others from the vertical) */
    if (ini && i) {
      W('kInit', [
        [IV, ini[1]],
        [ini[0], ini[1]],
        [ini[0], y - 10]
      ]);
      j.push([IV, ini[1]]);
    }
    /* the main line to the OR, the lamp (up) and the line out (down) */
    W(
      cmp,
      orIn
        ? [
            [cx + 30, y],
            [orIn[0], y],
            [orIn[0], orIn[1]],
            [orX, orIn[1]]
          ]
        : [
            [cx + 30, y],
            [orX, y]
          ]
    );
    W(cmp, [
      [jx, y],
      [jx, y - 31],
      [crt[0], y - 31]
    ]);
    W(cmp, [
      [jx, y],
      [jx, y + 33],
      [out[0] - 27, y + 33]
    ]);
    j.push([jx, y]);
    b.push(['btr' + btr[0], 'o:BTR', btr[0], bx, y - 31], ['btr' + btr[1], 'o:BTR', btr[1], bx, y + 33]);
    d.push(['crt' + crt[1], crt[0] + 35, y - 31, 'out', 'TCA534_' + crt[1], 'S', '#1C']);
    c.push(['o' + out[1], 'out', out[1], out[0], y + 33, '', ['-'], 1]);
    if (onBr) t.push([tx, y - 42, txt], [tx, y + 22, txt]);
    else t.push([tx, y - 10, txt]);
  });
  /* INITIAL: the first CMP and the vertical down to the last; the 0.0 reference to the two spare CMP */
  W('kInit', [
    [571, 152],
    [703, 152],
    [703, 226]
  ]);
  W('kInit', [
    [IV, 152],
    [IV, 1324],
    [690, 1324],
    [690, 1345]
  ]);
  j.push([IV, 152]);
  W(
    'k00',
    [
      [426, 1228],
      [661, 1228]
    ],
    1
  );
  W(
    'k00',
    [
      [509, 1228],
      [509, 1355],
      [659, 1355]
    ],
    1
  );
  j.push([509, 1228]);
  /* thrust (OR 044, NOT 005) and journal (OR 018, NOT 019) */
  b.push(
    ['or044', 'OR', '044', 1704, 269, [], {}, [59, 86]],
    ['not005', 'NOT', '005', 1822, 247],
    ['or018', 'OR', '018', 1698, 771, [], {}, [59, 128]],
    ['not019', 'NOT', '019', 1815, 728]
  );
  W('or044', [
    [1734, 236],
    [1792, 236]
  ]);
  W('not005', [
    [1852, 236],
    [2125, 236]
  ]);
  W('or018', [
    [1728, 717],
    [1786, 717]
  ]);
  W('not019', [
    [1845, 717],
    [2119, 717]
  ]);
  c.push(['oA', 'out', 'A', 2152, 236, '', ['TCA557'], 0, 1], ['oB', 'out', 'B', 2146, 717, '', ['TCA557'], 0, 1]);
  t.push(
    [1889, 205, 'CRI 1.31 THRUST METAL'],
    [1889, 226, 'TEMP. NOT HIGH'],
    [1882, 686, 'CRI 1.30 BEARING METAL'],
    [1882, 707, 'TEMP. NOT HIGH'],
    [491, 196, '(TCA100)'],
    [228, 1525, 'CONTROLLER:'],
    [389, 1525, 'COMM+MD'],
    [651, 1499, 'TRIGGER  :'],
    [651, 1526, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA534',
    /* swc: the SW of these CMP is not wired on the drawing; the HIACS backup record of each (phase6-tcs-records-2026-11-26.md (YUA, team-files/tcs-decoded), COMM+MD 2017-02-23) has 102_DD00001 = ON(1) on its side input: the comparison with hysteresis (ML 51 SW = 1) */
    swc: { cmpA046: 1, cmpA050: 1 },
    title: 'CRITERIA CONDITION',
    page: 104,
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
