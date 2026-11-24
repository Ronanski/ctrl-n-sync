/* TCA531 CRITERIA CONDITION (331DM09788 page 101, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. Two temperature difference criteria, the same logic twice:
   - HP first stage (HP-T inner casing first stage, lower): the allowed difference DIFF LIMIT = FG A001 (table FG *1) of the inner wall
     metal temp.; DIFF.TEMP. = the absolute difference of the inner and the outer wall metal temp. (SUB 006, ABS 007); over the limit
     (MR A002, HL 2000.0 / LL 0.0) or one of the two temperatures abnormal (OR 003) = HP FIRST STAGE TEMP. DIFF. HIGH; its NOT 017 =
     CRI 1.34 HP FIRST STAGE TEMP. DIFF. OK;
   - reheat bowl: FG A009 (table FG *2), SUB 014, ABS 015, MR A010, OR 011, NOT 018 = CRI 1.35 REHEAT BOWL TEMP. DIFF. OK.
   Each value and alarm also goes to the operator station (CRT TCA531_1, _2, _A1 .. _A4) and to a line out.
   The words and the two tables are the ones of the drawing. The lines of the drawing lean a few pixels; each is typed level.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    d = [],
    b = [],
    w = [],
    j = [],
    l = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const T = (key, ...pts) => w.push([key, pts, 1]);
  const half = o => {
    const { p, y, yd } = o;
    b.push(
      ['fg' + o.fg, 'FG', o.fg, o.fx, y + 11],
      ['sub' + o.sub, 'SUB', o.sub, o.fx - 1, yd + 10, [], { l: ['+', '-'] }],
      ['abs' + o.abs, 'ABS', o.abs, o.ax, yd + 10],
      ['mr' + o.mr, 'MR', o.mr, o.mx, y + 11, ['HL:2000.0', 'LL:0.0']],
      ['or' + o.or, 'OR', o.or, o.ox, y + 22, [], {}, [60, 65]],
      ['not' + o.not, 'NOT', o.not, o.nx, y + 11]
    );
    c.push(
      [p + 'In', 'in', o.in[0], o.cx, y, '', [o.in[1]]],
      [p + 'Out', 'in', o.out[0], o.cx - 1, yd + 20, '', [o.out[1]]],
      [p + 'AbnI', 'in', o.ai[0], o.cx - 2, o.ya, '', [o.ai[1]]],
      [p + 'AbnO', 'in', o.ao[0], o.cx - 3, o.yb, '', [o.ao[1]]]
    );
    /* the inner wall temperature: FG, and SUB + ; the outer: SUB - */
    T(p + 'In', [o.cx + 27, y], [o.fx - 30, y]);
    T(p + 'In', [o.sx, y], [o.sx, yd], [o.fx - 31, yd]);
    T(p + 'Out', [o.cx + 26, yd + 20], [o.fx - 31, yd + 20]);
    /* DIFF LIMIT */
    T('fg' + o.fg, [o.fx + 30, y], [o.mx - 30, y]);
    T('fg' + o.fg, [o.lx, y], [o.lx, o.l1], [o.lc - 35, o.l1]);
    T('fg' + o.fg, [o.lx, o.l2], [o.lc - 1 - 27, o.l2]);
    b.push(['ftr' + o.f1, 'o:FTR', o.f1, o.lx + 33, o.l1], ['ftr' + o.f2, 'o:FTR', o.f2, o.lx + 32, o.l2]);
    d.push([p + 'crtL', o.lc, o.l1, 'out', o.tagL, 'S', '#1C']);
    c.push([p + 'oL', 'out', o.lL, o.lc - 1, o.l2, '', ['-'], 1]);
    t.push(
      [o.lx + 62, o.l1 - 30, 'DIFF'],
      [o.lx + 62, o.l1 - 9, 'LIMIT'],
      [o.lx + 62, o.l2 - 31, 'DIFF'],
      [o.lx + 62, o.l2 - 10, 'LIMIT']
    );
    t.push([o.fx - 31, y - 27, o.star]);
    /* DIFF.TEMP. */
    T('sub' + o.sub, [o.fx + 29, yd], [o.ax - 30, yd]);
    T('abs' + o.abs, [o.ax + 30, yd], [o.dc - 27, yd]);
    T('abs' + o.abs, [o.rx, yd], [o.rx, y + 22], [o.mx - 30, y + 22]);
    T('abs' + o.abs, [o.bx, yd], [o.bx, o.d2], [o.d1c - 27, o.d2]);
    T('abs' + o.abs, [o.bx, o.d1], [o.d1c - 35, o.d1]);
    b.push(
      ['ftr' + o.f3, 'o:FTR', o.f3, o.f3x, yd],
      ['ftr' + o.f4, 'o:FTR', o.f4, o.bx + 31, o.d1],
      ['ftr' + o.f5, 'o:FTR', o.f5, o.bx + 31, o.d2]
    );
    c.push([p + 'oD', 'out', o.lD, o.dc, yd, '', ['-']], [p + 'oD1', 'out', o.lD + '1', o.d1c, o.d2, '', ['-'], 1]);
    d.push([p + 'crtD', o.d1c, o.d1, 'out', o.tagD, 'S', '#1C']);
    t.push(
      [o.bx + 60, yd - 10, 'DIFF.TEMP.'],
      [o.bx + 60, o.d1 - 10, 'DIFF.TEMP.'],
      [o.bx + 60, o.d2 - 10, 'DIFF.TEMP.']
    );
    /* the alarm and the criterion */
    W('mr' + o.mr, [o.mx + 30, y], [o.ox - 30, y]);
    W(p + 'AbnI', [o.cx + 25, o.ya], [o.r1, o.ya], [o.r1, y + 22], [o.ox - 30, y + 22]);
    W(p + 'AbnO', [o.cx + 24, o.yb], [o.r2, o.yb], [o.r2, y + 43], [o.ox - 30, y + 43]);
    W('or' + o.or, [o.ox + 30, y], [o.nx - 30, y]);
    W('or' + o.or, [o.hx, y], [o.hx, o.h1], [o.hc - 35, o.h1]);
    W('or' + o.or, [o.hx, o.h2], [o.hc - 1 - 27, o.h2]);
    W('not' + o.not, [o.nx + 30, y], [o.oc - 27, y]);
    b.push(
      ['btr' + o.b1, 'o:BTR', o.b1, o.hx + 159, o.h1],
      ['btr' + o.b2, 'o:BTR', o.b2, o.hx + 158, o.h2],
      ['btr' + o.b3, 'o:BTR', o.b3, o.hx + 158, y]
    );
    d.push([p + 'crtH', o.hc, o.h1, 'out', o.tagH, 'S', '#1C']);
    c.push([p + 'oH1', 'out', o.lH, o.hc - 1, o.h2, '', ['-'], 1], [p + 'oC', 'out', o.lC, o.oc, y, '', ['TCA558']]);
    t.push(
      [o.hx + o.tx, o.h1 - 10, o.name + ' TEMP. DIFF. HIGH'],
      [o.hx + o.tx, o.h2 - 10, o.name + ' TEMP. DIFF. HIGH'],
      [o.hx + o.tc, y - 30, o.cri + ' ' + o.name],
      [o.hx + o.tc, y - 9, 'TEMP. DIFF. OK']
    );
    j.push([o.sx, y], [o.lx, y], [o.lx, o.l2], [o.rx, yd], [o.bx, yd], [o.bx, o.d1], [o.hx, y], [o.hx, o.h2]);
  };
  half({
    p: 'h',
    y: 259,
    yd: 367,
    ya: 474,
    yb: 548,
    cx: 294,
    in: ['A1', 'TCA360'],
    out: ['A1', 'TCA364'],
    ai: ['D1', 'TCA360'],
    ao: ['D1', 'TCA364'],
    fg: 'A001',
    fx: 839,
    sx: 755,
    star: '*1',
    sub: '006',
    abs: '007',
    ax: 977,
    mr: 'A002',
    mx: 1149,
    rx: 1074,
    or: '003',
    ox: 1319,
    not: '017',
    nx: 1500,
    r1: 1232,
    r2: 1263,
    lx: 891,
    l1: 154,
    l2: 218,
    lc: 1076,
    tagL: 'TCA531_A1',
    lL: 'E1',
    f1: '020',
    f2: '022',
    f3: '008',
    f3x: 1584,
    f4: '023',
    f5: '024',
    bx: 1775,
    d1: 421,
    d2: 475,
    dc: 2117,
    d1c: 2009,
    tagD: 'TCA531_A3',
    lD: 'B',
    hx: 1427,
    h1: 133,
    h2: 186,
    hc: 2012,
    tagH: 'TCA531_1',
    lH: 'A1',
    b1: '019',
    b2: '021',
    b3: '005',
    oc: 2118,
    lC: 'A',
    name: 'HP FIRST STAGE',
    cri: 'CRI 1.34',
    tx: 186,
    tc: 271
  });
  half({
    p: 'r',
    y: 760,
    yd: 867,
    ya: 974,
    yb: 1050,
    cx: 291,
    in: ['A1', 'TCA370'],
    out: ['A3', 'TCA356'],
    ai: ['A', 'TCA370'],
    ao: ['D3', 'TCA356'],
    fg: 'A009',
    fx: 835,
    sx: 751,
    star: '*2',
    sub: '014',
    abs: '015',
    ax: 973,
    mr: 'A010',
    mx: 1145,
    rx: 1070,
    or: '011',
    ox: 1314,
    not: '018',
    nx: 1495,
    r1: 1228,
    r2: 1260,
    lx: 888,
    l1: 655,
    l2: 719,
    lc: 1072,
    tagL: 'TCA531_A2',
    lL: 'F1',
    f1: '026',
    f2: '028',
    f3: '016',
    f3x: 1579,
    f4: '029',
    f5: '030',
    bx: 1771,
    d1: 922,
    d2: 975,
    dc: 2112,
    d1c: 2005,
    tagD: 'TCA531_A4',
    lD: 'D',
    hx: 1412,
    h1: 655,
    h2: 709,
    hc: 2008,
    tagH: 'TCA531_2',
    lH: 'C1',
    b1: '025',
    b2: '027',
    b3: '013',
    oc: 2114,
    lC: 'C',
    name: 'REHEAT BOWL',
    cri: 'CRI 1.35',
    tx: 228,
    tc: 281
  });
  /* the two tables of the function generators: NO., Xn(DEGC), Yn(DEGC), eight rows */
  const DATA = [
    ['0.00', '184.00'],
    ['100.00', '172.00'],
    ['200.00', '161.00'],
    ['250.00', '155.00'],
    ['300.00', '149.50'],
    ['400.00', '138.50'],
    ['500.00', '127.00'],
    ['600.00', '116.00']
  ];
  [
    [353, 396, 475, 555, 'FG *1'],
    [597, 641, 721, 801, 'FG *2']
  ].forEach(([x0, x1, x2, x3, name]) => {
    const row = k => Math.round(1251 + 21.25 * k);
    [1230, ...Array.from({ length: 9 }, (_, k) => row(k))].forEach(y =>
      l.push([
        [x0, y],
        [x3, y]
      ])
    );
    [x0, x1, x2, x3].forEach(x =>
      l.push([
        [x, 1230],
        [x, row(8)]
      ])
    );
    t.push(
      [x0 + 7, 1221, name],
      [(x0 + x1) / 2, 1243, 'NO.', 1],
      [(x1 + x2) / 2, 1243, 'Xn(DEGC)', 1],
      [(x2 + x3) / 2, 1243, 'Yn(DEGC)', 1]
    );
    DATA.forEach(([xs, ys], k) => {
      const y = row(k) + 13;
      t.push([(x0 + x1) / 2, y, String(k), 1], [(x1 + x2) / 2, y, xs, 1], [(x2 + x3) / 2, y, ys, 1]);
    });
  });
  t.push(
    [327, 227, 'HP-T INNER CASING FIRST STG'],
    [327, 248, 'INNER WALL METAL TEMP. (LOWER)'],
    [326, 355, 'HP-T INNER CASING FIRST STG'],
    [326, 376, 'OUTER WALL METAL TEMP. (LOWER)'],
    [326, 420, 'HP-T INNER CASING'],
    [326, 441, '1ST STG INNER WALL'],
    [325, 462, 'MET TEMP (LOWER) ABN.'],
    [325, 516, 'HP-T INNER CASING FIRST STG'],
    [325, 537, 'OUTER WALL MET TEMP (LOWER) ABN.'],
    [325, 750, 'REHEAT BOWL INNER WALL METAL TEMP.'],
    [324, 856, 'RH BOWL'],
    [324, 877, 'OUTER WALL METAL TEMP.'],
    [323, 941, 'REHEAT BOWL INNER WALL'],
    [323, 962, 'METAL TEMP. INPUT ERROR'],
    [323, 1017, 'RH BOWL'],
    [323, 1038, 'OUTER WALL METAL TEMP.  ABN.'],
    [234, 1522, 'CONTROLLER:'],
    [395, 1522, 'COMM+MD'],
    [656, 1495, 'TRIGGER  :'],
    [656, 1522, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA531',
    /* pr: printed on page 101 beside each block, FG *1 / *2 tables; the drawing above keeps them as text */
    pr: {
      fgA001: ['X1:0.00', 'Y1:184', 'X2:100.00', 'Y2:172', 'X3:200.00', 'Y3:161', 'X4:250.00', 'Y4:155', 'X5:300.00', 'Y5:149.50', 'X6:400.00', 'Y6:138.50', 'X7:500.00', 'Y7:127', 'X8:600.00', 'Y8:116'],
      fgA009: ['X1:0.00', 'Y1:184', 'X2:100.00', 'Y2:172', 'X3:200.00', 'Y3:161', 'X4:250.00', 'Y4:155', 'X5:300.00', 'Y5:149.50', 'X6:400.00', 'Y6:138.50', 'X7:500.00', 'Y7:127', 'X8:600.00', 'Y8:116']
    },
    title: 'CRITERIA CONDITION',
    page: 101,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    c,
    d,
    b,
    w,
    l,
    j,
    t
  });
})();
