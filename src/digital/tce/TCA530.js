/* TCA530 CRITERIA CONDITION (331DM09788 page 99, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. The chest temperature difference criteria, the same logic twice:
   - MSV (B): the allowed difference DIFF LIMIT = FG A005 of the inner wall metal temp.; DIFF.TEMP. = the absolute difference of the inner
     and the outer wall metal temp. (SUB 011, ABS 012); over the limit (MR A006, HL 2000.0 / LL 0.0) with neither temperature abnormal
     (OR 015, NOT 016, A 007) = MSV CHEST TEMP.DIFF.HIGH (OR 008 with OFF(0)); its NOT 009 = CRI 1.32 MSV CHEST TEMP. DIFF. OK;
   - CV (B): FG A022, SUB 028, ABS 029, MR A023, OR 032, NOT 033, A 024, OR 025, NOT 026 = CRI 1.33 CV CHEST TEMP. DIFF. OK; also
     CV METAL TEMP ALW = the limit less the difference (SUB 035) limited to +-300 (LIM A036), and CV(B) INNER/OUTER METAL TEMP.ABN.
   Each value and alarm also goes to the operator station (CRT TCA530_1, _2, _A1 .. _A5) and to a line out.
   The words are the ones of the drawing. The lines of the drawing lean a few pixels down to the right; each is typed level at its mean
   height.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    d = [],
    b = [],
    w = [],
    j = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const T = (key, ...pts) => w.push([key, pts, 1]);
  /* one chest: p = the key prefix, numbers of the blocks, the heights of its rows, the x of its blocks (the lower half sits 4 px left) */
  const half = o => {
    const { p, y, yd, ya, dx } = o,
      X = x => x - dx;
    b.push(
      ['fg' + o.fg, 'FG', o.fg, X(761), y + 11],
      ['sub' + o.sub, 'SUB', o.sub, X(760), yd + 11, [], { l: ['+', '-'] }],
      ['abs' + o.abs, 'ABS', o.abs, X(919), yd + 11],
      ['mr' + o.mr, 'MR', o.mr, X(1093) - dx / 2, y + 11, ['HL:2000.0', 'LL:0.0']],
      ['a' + o.a, 'A', o.a, X(1230) - dx / 2, y + 11],
      ['or' + o.orA, 'OR', o.orA, X(759), ya + 11],
      ['not' + o.notA, 'NOT', o.notA, X(918), ya + 11],
      ['or' + o.or, 'OR', o.or, 1369 - dx - dx / 2, y + 11],
      ['not' + o.not, 'NOT', o.not, 1496 - dx - dx / 2, y + 11]
    );
    const fx = X(761),
      sx = X(760),
      ax = X(919),
      mx = X(1093) - dx / 2,
      Ax = X(1230) - dx / 2,
      ox = 1369 - dx - dx / 2,
      nx = 1496 - dx - dx / 2;
    /* the inner wall temperature: FG, and SUB + */
    T(p + 'In', [o.cx + 27, y], [fx - 30, y]);
    T(p + 'In', [X(688) - 2, y], [X(688) - 2, yd], [sx - 30, yd]);
    T(p + 'Out', [o.cx + 25, yd + 21], [sx - 30, yd + 21]);
    j.push([X(688) - 2, y]);
    /* DIFF LIMIT */
    T('fg' + o.fg, [fx + 30, y], [mx - 30, y]);
    T('fg' + o.fg, [o.lx, y], [o.lx, o.l1], [o.lc - 35, o.l1]);
    T('fg' + o.fg, [o.lx, o.l2], [o.lc + 16 - 27, o.l2]);
    j.push([o.lx, y], [o.lx, o.l2]);
    b.push(['ftr' + o.f1, 'o:FTR', o.f1, o.lx + 34, o.l1], ['ftr' + o.f2, 'o:FTR', o.f2, o.lx + 33, o.l2]);
    d.push([p + 'crtL', o.lc, o.l1, 'out', o.tagL, 'S', '#1C']);
    c.push([p + 'oL', 'out', o.lL, o.lc + 16, o.l2, '', ['-'], 1]);
    t.push(
      [o.lx + 61, o.l1 - 32, 'DIFF'],
      [o.lx + 61, o.l1 - 11, 'LIMIT'],
      [o.lx + 60, o.l2 - 32, 'DIFF'],
      [o.lx + 60, o.l2 - 11, 'LIMIT']
    );
    /* DIFF.TEMP. */
    T('sub' + o.sub, [sx + 30, yd], [ax - 30, yd]);
    T('abs' + o.abs, [ax + 30, yd], [o.dc - 27, yd]);
    T('abs' + o.abs, [o.mrx, yd], [o.mrx, y + 21], [mx - 30, y + 21]);
    T('abs' + o.abs, [o.bx, yd], [o.bx, o.d2], [o.d1c + (o.d2c - o.d1c) - 27, o.d2]);
    T('abs' + o.abs, [o.bx, o.d1], [o.d1c - 35, o.d1]);
    j.push([o.mrx, yd], [o.bx, yd], [o.bx, o.d1]);
    b.push(
      ['ftr' + o.f3, 'o:FTR', o.f3, o.fx3, yd],
      ['ftr' + o.f4, 'o:FTR', o.f4, o.bx + 31, o.d1],
      ['ftr' + o.f5, 'o:FTR', o.f5, o.bx + 30, o.d2]
    );
    c.push([p + 'oD', 'out', o.lD, o.dc, yd, '', ['-']], [p + 'oD1', 'out', o.lD + '1', o.d2c, o.d2, '', ['-'], 1]);
    d.push([p + 'crtD', o.d1c, o.d1, 'out', o.tagD, 'S', '#1C']);
    t.push(
      [o.bx + 59, yd - 10, 'DIFF.TEMP.'],
      [o.bx + 59, o.d1 - 10, 'DIFF.TEMP.'],
      [o.bx + 58, o.d2 - 10, 'DIFF.TEMP.']
    );
    /* the alarm and the criterion */
    W('mr' + o.mr, [mx + 30, y], [Ax - 30, y]);
    W(p + 'AbnI', [o.cx + 27 - 2, ya], [X(759) - 30, ya]);
    W(p + 'AbnO', [o.cx + 27 - 4, o.yb], [o.rb, o.yb], [o.rb, ya + 21], [X(759) - 30, ya + 21]);
    W('or' + o.orA, [X(759) + 30, ya], [X(918) - 30, ya]);
    W('not' + o.notA, [X(918) + 30, ya], [o.ra, ya], [o.ra, y + 21], [Ax - 30, y + 21]);
    W('a' + o.a, [Ax + 30, y], [ox - 30, y]);
    W(o.off, [o.offx, o.offy], [o.ro, o.offy], [o.ro, y + 21], [ox - 30, y + 21]);
    W('or' + o.or, [ox + 30, y], [nx - 30, y]);
    W('or' + o.or, [o.hx, y], [o.hx, o.h1], [o.hc - 35, o.h1]);
    W('or' + o.or, [o.hx, o.h2], [o.hc - 1 - 27, o.h2]);
    W('not' + o.not, [nx + 30, y], [o.oc - 27, y]);
    j.push([o.hx, y], [o.hx, o.h2]);
    b.push(
      ['btr' + o.b1, 'o:BTR', o.b1, o.hx + 139, o.h1],
      ['btr' + o.b2, 'o:BTR', o.b2, o.hx + 138, o.h2],
      ['btr' + o.b3, 'o:BTR', o.b3, o.hx + 137, y]
    );
    d.push([p + 'crtH', o.hc, o.h1, 'out', o.tagH, 'S', '#1C']);
    c.push([p + 'oH1', 'out', o.lH, o.hc - 1, o.h2, '', ['-'], 1], [p + 'oC', 'out', o.lC, o.oc, y, '', o.refs]);
    t.push(
      [o.hx + 242, o.h1 - 10, o.name + ' CHEST TEMP.DIFF.HIGH'],
      [o.hx + 241, o.h2 - 10, o.name + ' CHEST TEMP.DIFF.HIGH'],
      [o.hx + 240, y - 31, o.cri + ' ' + o.name + ' CHEST'],
      [o.hx + 240, y - 10, 'TEMP. DIFF. OK']
    );
  };
  half({
    p: 'm',
    dx: 0,
    y: 259,
    yd: 366,
    ya: 471,
    yb: 546,
    cx: 290,
    fg: 'A005',
    sub: '011',
    abs: '012',
    mr: 'A006',
    a: '007',
    orA: '015',
    notA: '016',
    or: '008',
    not: '009',
    lx: 847,
    l1: 152,
    l2: 216,
    lc: 1002,
    tagL: 'TCA530_A1',
    lL: 'F1',
    f1: '002',
    f2: '004',
    mrx: 1016,
    bx: 1770,
    d1: 420,
    d2: 473,
    dc: 2103,
    d1c: 2005,
    d2c: 2003,
    tagD: 'TCA530_A3',
    lD: 'B',
    f3: '013',
    f4: '014',
    f5: '017',
    fx3: 1578,
    rb: 685,
    ra: 1174,
    off: 'kOff1',
    offx: 485,
    offy: 620,
    ro: 1313,
    hx: 1443,
    h1: 144,
    h2: 197,
    hc: 2008,
    tagH: 'TCA530_1',
    lH: 'A1',
    b1: '001',
    b2: '003',
    b3: '010',
    oc: 2114,
    lC: 'A',
    refs: ['TCA558'],
    name: 'MSV',
    cri: 'CRI 1.32'
  });
  half({
    p: 'v',
    dx: 4,
    y: 782,
    yd: 887,
    ya: 994,
    yb: 1067,
    cx: 287,
    fg: 'A022',
    sub: '028',
    abs: '029',
    mr: 'A023',
    a: '024',
    orA: '032',
    notA: '033',
    or: '025',
    not: '026',
    lx: 830,
    l1: 674,
    l2: 739,
    lc: 1014,
    tagL: 'TCA530_A2',
    lL: 'G1',
    f1: '019',
    f2: '021',
    mrx: 1011,
    bx: 1765,
    d1: 944,
    d2: 998,
    dc: 2106,
    d1c: 1999,
    d2c: 1998,
    tagD: 'TCA530_A4',
    lD: 'D',
    f3: '030',
    f4: '031',
    f5: '034',
    fx3: 1574,
    rb: 679,
    ra: 1169,
    off: 'kOff2',
    offx: 447,
    offy: 1142,
    ro: 1306,
    hx: 1437,
    h1: 667,
    h2: 720,
    hc: 2002,
    tagH: 'TCA530_2',
    lH: 'C1',
    b1: '018',
    b2: '020',
    b3: '027',
    oc: 2108,
    lC: 'C',
    refs: ['TCA511', 'TCA558'],
    name: 'CV',
    cri: 'CRI 1.33'
  });
  /* CV METAL TEMP ALW: the limit less the difference, limited; CV(B) INNER/OUTER METAL TEMP.ABN. */
  b.push(
    ['sub035', 'SUB', '035', 1073, 1068, [], { l: ['+', '-'] }],
    ['limA036', 'LIM', 'A036', 1360, 1079, ['HL:300', 'LL:-300'], {}, [60, 64]],
    ['ftr037', 'o:FTR', '037', 1572, 1058],
    ['ftr038', 'o:FTR', '038', 1571, 1112]
  );
  T('fgA022', [989, 782], [989, 1057], [1043, 1057]);
  T('abs029', [967, 887], [967, 1078], [1043, 1078]);
  T('sub035', [1103, 1057], [1330, 1057]);
  T('limA036', [1390, 1058], [1962, 1058]);
  T('limA036', [1517, 1058], [1517, 1112], [1969, 1112]);
  W('or032', [859, 994], [859, 1186], [1969, 1186]);
  j.push([989, 782], [967, 887], [1517, 1058], [859, 994]);
  d.push(['crtAlw', 1997, 1058, 'out', 'TCA530_A5', 'S', '#1C']);
  c.push(['oE1', 'out', 'E1', 1996, 1112, '', ['-'], 1], ['oH1', 'out', 'H1', 1996, 1186, '', ['TCE151'], 1]);
  c.push(
    ['mIn', 'in', 'A2', 290, 259, '', ['TCA359']],
    ['mOut', 'in', 'A2', 288, 387, '', ['TCA363']],
    ['mAbnI', 'in', 'D2', 288, 471, '', ['TCA359']],
    ['mAbnO', 'in', 'D2', 286, 546, '', ['TCA363']],
    ['vIn', 'in', 'A3', 287, 782, '', ['TCA359']],
    ['vOut', 'in', 'A3', 285, 908, '', ['TCA363']],
    ['vAbnI', 'in', 'D3', 285, 994, '', ['TCA359']],
    ['vAbnO', 'in', 'D3', 283, 1067, '', ['TCA363']]
  );
  t.push(
    [325, 228, 'MSV (B) INNER'],
    [325, 249, 'WALL METAL TEMP.'],
    [323, 356, 'MSV (B) OUTER'],
    [323, 377, 'WALL METAL TEMP.'],
    [323, 440, 'MSV (B)'],
    [323, 461, 'INNER WALL METAL TEMP. ABN.'],
    [321, 515, 'MSV (B)'],
    [321, 536, 'OUTER WALL METAL TEMP. ABN.'],
    [320, 751, 'CV (B)'],
    [320, 772, 'INNER WALL METAL TEMP.'],
    [318, 877, 'CV(B) OUTER'],
    [318, 898, 'WALL METAL TEMP.'],
    [317, 963, 'CV (B)'],
    [317, 984, 'INNER WALL METAL TEMP. ABN.'],
    [316, 1036, 'CV (B)'],
    [316, 1057, 'OUTER WALL METAL TEMP. ABN.'],
    [1673, 1048, 'CV METAL TEMP ALW'],
    [1672, 1102, 'CV METAL TEMP ALW'],
    [1670, 1155, 'CV(B) INNER/OUTER METAL'],
    [1670, 1176, 'TEMP.ABN.'],
    [226, 1522, 'CONTROLLER:'],
    [387, 1522, 'COMM+MD'],
    [648, 1495, 'TRIGGER  :'],
    [648, 1522, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA530',
    title: 'CRITERIA CONDITION',
    page: 99,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    k: [
      ['kOff1', 251, 620, 'OFF(0)', 'sys.ref'],
      ['kOff2', 213, 1142, 'OFF(0)', 'sys.ref']
    ],
    c,
    d,
    b,
    w,
    j,
    t
  });
})();
