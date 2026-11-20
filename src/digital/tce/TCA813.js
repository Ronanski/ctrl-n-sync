/* TCA813 ALARM (331DM09788 page 222, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn, three ORs in a chain:
   - OR 002: NO.1 / NO.2 TURBINE JOURNAL BEARING METAL TEMP. ABN., NO.3 / NO.4 BEARING METAL TEMP. ABN. (D1 ... D4 from TCA354),
     two OFF(0), GLAND STEAM SEAL HEADER TEMP. ABN., GLAND STEAM SEAL LP INLET TEMP. ABN. (D3 / D4 from TCA355), through BTR
     001 / 005 / 008 / 011 / 014 / 017 / 020 / 023.
   - OR 003: OR 002, then HOT REHEAT STEAM TEMP. ABN., MSV INLET STEAM TEMP.(D) ABN., REHEAT BOWL OUTER METAL TEMP. ABN., LP
     TURBINE EXTRACTION STEAM TEMP. ABN. (D1 ... D4 from TCA356), three OFF(0), RTD ABN. (D4 from TCA357), through BTR 006 /
     009 / 012 / 015 / 018 / 021 / 024 / 026.
   - OR 004: OR 003, then REHEAT BOWL INNER WALL METAL TEMP.(A) ABN., IP TURBINE AFTER 15 / AFTER 18 STAGE INNER WALL METAL
     TEMP.(UPPER) AB, THRUST BEARING FRONT-END EMBEDDED METAL TEMP.(A) ABN. (D1 ... D4 from TCA358), THRUST BEARING REAR-END
     EMBEDDED METAL TEMP.(A) ABN., MSV (B) INNER WALL METAL TEMP. ABN., CV (B) INNER WALL METAL TEMP.(A), HP TURBINE EXHAUST
     INNER WALL METAL TEMP.(UPPER) ABN. (D1 ... D4 from TCA359), through BTR 007 / 010 / 013 / 016 / 019 / 022 / 025 / 027; its
     output = SIGNAL ERROR(4), A (to TCA816).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    b = [],
    c = [],
    k = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  /* one column into an OR: [in cx, rows, BTR x, BTR nos, OR left x, OR inputs, bends (one per row after a direct first row,
     or one per row), letters, refs, labels, text x, OFF tip x, first row direct] */
  const col = (cx, Y, xB, NB, xOR, YI, XB, L, F, T, xt, xOff, direct) =>
    Y.forEach((y, i) => {
      const off = !L[i],
        key = off ? 'kOff' + NB[i] : 'i' + NB[i];
      if (off) k.push([key, xOff - 233, y, 'OFF(0)', 'sys.ref']);
      else {
        c.push([key, 'in', L[i], cx, y, '', [F[i]], 0, 1]);
        T[i].forEach((x, n) => t.push([xt, y - 8 - 21.5 * (T[i].length - 1 - n), x]));
      }
      b.push(['btr' + NB[i], 'o:BTR', NB[i], xB, y]);
      const x0 = off ? xOff : cx + 27;
      if (direct && i === 0) W(key, [x0, y], [xOR, y]);
      else {
        const n = direct ? i - 1 : i;
        W(key, [x0, y], [XB[n], y], [XB[n], YI[direct ? i : i + 1]], [xOR, YI[direct ? i : i + 1]]);
      }
    });
  const I8 = [210, 230, 250, 271, 292, 313, 334, 355],
    I9 = [210, 230, 250, 271, 292, 313, 334, 355, 377],
    R = [317, 424, 530, 637, 743, 850, 956, 1063];
  col(
    325,
    [210, 317, 423, 530, 636, 743, 849, 955],
    603,
    ['001', '005', '008', '011', '014', '017', '020', '023'],
    725,
    I8,
    [637, 647, 657, 667, 677, 687, 697],
    ['D1', 'D2', 'D3', 'D4', '', '', 'D3', 'D4'],
    ['TCA354', 'TCA354', 'TCA354', 'TCA354', '', '', 'TCA355', 'TCA355'],
    [
      ['NO.1 TURBINE JOURNAL', 'BEARING METAL TEMP.', 'ABN.'],
      ['NO.2 TURBINE JOURNAL', 'BEARING METAL TEMP.', 'ABN.'],
      ['NO.3 BEARING METAL', 'TEMP. ABN.'],
      ['NO.4 BEARING METAL', 'TEMP. ABN.'],
      [],
      [],
      ['GLAND STEAM SEAL', 'HEADER TEMP. ABN.'],
      ['GLAND STEAM SEAL LP', 'INLET TEMP. ABN.']
    ],
    356,
    446,
    true
  );
  col(
    920,
    R,
    1200,
    ['006', '009', '012', '015', '018', '021', '024', '026'],
    1323,
    I9,
    [1226, 1236, 1246, 1256, 1266, 1276, 1286, 1295],
    ['D1', 'D2', 'D3', 'D4', '', '', '', 'D4'],
    ['TCA356', 'TCA356', 'TCA356', 'TCA356', '', '', '', 'TCA357'],
    [
      ['HOT REHEAT STEAM', 'TEMP. ABN.'],
      ['MSV INLET STEAM', 'TEMP.(D) ABN.'],
      ['REHEAT BOWL OUTER', 'METAL TEMP. ABN.'],
      ['LP TURBINE EXTRACTION', 'STEAM TEMP. ABN.'],
      [],
      [],
      [],
      ['RTD ABN.']
    ],
    952,
    1043,
    false
  );
  col(
    1518,
    R,
    1795,
    ['007', '010', '013', '016', '019', '022', '025', '027'],
    1917,
    I9,
    [1820, 1830, 1840, 1850, 1860, 1869, 1878, 1888],
    ['D1', 'D2', 'D3', 'D4', 'D1', 'D2', 'D3', 'D4'],
    ['TCA358', 'TCA358', 'TCA358', 'TCA358', 'TCA359', 'TCA359', 'TCA359', 'TCA359'],
    [
      ['REHEAT BOWL INNER', 'WALL METAL TEMP.(A)', 'ABN.'],
      ['IP TURBINE AFTER 15', 'STAGE INNER WALL METAL', 'TEMP.(UPPER) AB'],
      ['IP TURBINE AFTER', '18 STAGE INNER WALL METAL', 'TEMP.(UPPER) AB'],
      ['THRUST BEARING FRONT-EN.D', 'EMBEDDED METAL TEMP.(A)', 'ABN.'],
      ['THRUST BEARING REAR-EN.D', 'EMBEDDED METAL TEMP.(A)', 'ABN.'],
      ['MSV (B) INNER WALL', 'METAL TEMP. ABN.'],
      ['CV (B) INNER WALL', 'METAL TEMP.(A)'],
      ['HP TURBINE EXHAUST', 'INNER WALL METAL TEMP.', '(UPPER) ABN.']
    ],
    1548,
    1641,
    false
  );
  b.push(
    ['or002', 'OR', '002', 754.5, 282.5, [], {}, [59, 171]],
    ['or003', 'OR', '003', 1352, 294.5, [], {}, [58, 193]],
    ['or004', 'OR', '004', 1946.5, 296, [], {}, [59, 194]]
  );
  W('or002', [784, 210], [1323, 210]);
  W('or003', [1381, 210], [1917, 210]);
  W('or004', [1976, 210], [2161 - 27, 210]);
  c.push(['oA', 'out', 'A', 2161, 210, '', ['TCA816'], 0, 1]);
  t.push(
    [2036, 185, 'SIGNAL'],
    [2036, 206, 'ERROR(4)'],
    [230, 1525, 'CONTROLLER:'],
    [391, 1525, 'COMM+MD'],
    [615, 1504, 'TRIGGER  :'],
    [615, 1531, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA813',
    title: 'ALARM',
    page: 222,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [160, 78, 2226, 1542],
    k,
    c,
    b,
    w,
    t
  });
})();
