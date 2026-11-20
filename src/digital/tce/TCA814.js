/* TCA814 ALARM (331DM09788 page 223, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn, three ORs in a chain:
   - OR 002: HP TURBINE FIRST STAGE INNER WALL METAL TEMP. ABN. (D1 from TCA360), six OFF(0), RTD ABN. (D4 from TCA361), through
     BTR 001 / 005 / 008 / 011 / 014 / 017 / 020 / 023.
   - OR 003: OR 002, then REHEAT BOWL INNER WALL METAL TEMP.(B) ABN., IP TURBINE AFTER 15 / AFTER 18 STAGE INNER WALL METAL
     TEMP.(LOWER) AB, THRUST BEARING FRONT-END EMBEDDED METAL TEMP.(B) ABN. (D1 ... D4 from TCA362), THRUST BEARING REAR-END
     EMBEDDED METAL TEMP.(B) ABN., MSV (B) OUTER WALL METAL TEMP. ABN., CV (B) INNER WALL METAL TEMP.(B) ABN., HP TURBINE EXHAUST
     INNER WALL METAL TEMP.(LOWER) ABN. (D1 ... D4 from TCA363), through BTR 006 / 009 / 012 / 015 / 018 / 021 / 024 / 026.
   - OR 004: OR 003, then HP TURBINE FIRST STAGE OUTER WALL METAL TEMP. ABN., NO.3 / NO.4 BEARING OUTLET OIL TEMP. ABN. (D1 /
     D2 / D3 from TCA364), four OFF(0), RTD ABN. (D4 from TCA365), through BTR 007 / 010 / 013 / 016 / 019 / 022 / 025 / 027;
     its output = SIGNAL ERROR(5), A (to TCA816).
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
  const I8 = [208, 228, 248, 269, 290, 311, 332, 353],
    I9 = [208, 228, 248, 269, 290, 311, 332, 353, 375],
    R = [314, 421, 527, 634, 740, 847, 953, 1060];
  col(
    315,
    [208, 314, 421, 527, 634, 740, 847, 953],
    592,
    ['001', '005', '008', '011', '014', '017', '020', '023'],
    713,
    I8,
    [626, 636, 646, 656, 666, 676, 686],
    ['D1', '', '', '', '', '', '', 'D4'],
    ['TCA360', '', '', '', '', '', '', 'TCA361'],
    [['HP TURBINE FIRST', 'STAGE INNER WALL', 'METAL TEMP. ABN.'], [], [], [], [], [], [], ['RTD ABN.']],
    346,
    436,
    true
  );
  col(
    911,
    R,
    1188,
    ['006', '009', '012', '015', '018', '021', '024', '026'],
    1312,
    I9,
    [1215, 1225, 1235, 1245, 1255, 1265, 1275, 1284],
    ['D1', 'D2', 'D3', 'D4', 'D1', 'D2', 'D3', 'D4'],
    ['TCA362', 'TCA362', 'TCA362', 'TCA362', 'TCA363', 'TCA363', 'TCA363', 'TCA363'],
    [
      ['REHEAT BOWL INNER', 'WALL METAL TEMP.(B)', 'ABN.'],
      ['IP TURBINE AFTER 15', 'STAGE INNER WALL METAL', 'TEMP.(LOWER) AB'],
      ['IP TURBINE AFTER 18', 'STAGE INNER WALL METAL', 'TEMP.(LOWER) AB'],
      ['THRUST BEARING FRONT-EN.D', 'EMBEDDED METAL TEMP.(B)', 'ABN.'],
      ['THRUST BEARING REAR-EN.D', 'EMBEDDED METAL TEMP.(B)', 'ABN.'],
      ['MSV (B) OUTER WALL', 'METAL TEMP. ABN.'],
      ['CV (B) INNER WALL', 'METAL TEMP.(B) ABN.'],
      ['HP TURBINE EXHAUST', 'INNER WALL METAL TEMP.', '(LOWER) ABN.']
    ],
    943,
    1032,
    false
  );
  col(
    1508,
    R,
    1783,
    ['007', '010', '013', '016', '019', '022', '025', '027'],
    1908,
    I9,
    [1809, 1819, 1829, 1839, 1849, 1858, 1867, 1877],
    ['D1', 'D2', 'D3', '', '', '', '', 'D4'],
    ['TCA364', 'TCA364', 'TCA364', '', '', '', '', 'TCA365'],
    [
      ['HP TURBINE FIRST', 'STAGE OUTER WALL', 'METAL TEMP. ABN.'],
      ['NO.3 BEARING OUTLET', 'OIL TEMP. ABN.'],
      ['NO.4 BEARING OUTLET', 'OIL TEMP. ABN.'],
      [],
      [],
      [],
      [],
      ['RTD ABN.']
    ],
    1540,
    1630,
    false
  );
  b.push(
    ['or002', 'OR', '002', 742.5, 280.5, [], {}, [59, 171]],
    ['or003', 'OR', '003', 1341, 291, [], {}, [58, 192]],
    ['or004', 'OR', '004', 1937, 291.5, [], {}, [58, 193]]
  );
  W('or002', [772, 208], [1312, 208]);
  W('or003', [1370, 208], [1908, 208]);
  W('or004', [1966, 208], [2150 - 27, 208]);
  c.push(['oA', 'out', 'A', 2150, 208, '', ['TCA816'], 0, 1]);
  t.push(
    [2025, 184, 'SIGNAL'],
    [2025, 205, 'ERROR(5)'],
    [225, 1524, 'CONTROLLER:'],
    [385, 1524, 'COMM+MD'],
    [609, 1502, 'TRIGGER  :'],
    [609, 1529, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA814',
    title: 'ALARM',
    page: 223,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [156, 76, 2216, 1540],
    k,
    c,
    b,
    w,
    t
  });
})();
