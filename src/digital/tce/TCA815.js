/* TCA815 ALARM (331DM09788 page 224, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn, three ORs in a chain:
   - OR 002: LUBE OIL COOLER INLET IOL TEMP. ABN., LUBE OIL COOLER OUTLET OIL TEMP.(A) / (B) ABN., GEN. STATOR COIL TEMP.(A) ABN.
     (D1 ... D4 from TCA440), GEN. STATOR COIL TEMP.(B) / (C) / (D) / (E) ABN. (D1 ... D4 from TCA441), through BTR 001 / 005 /
     008 / 011 / 014 / 017 / 020 / 023.
   - OR 003: OR 002, then GEN. COOLING GAS AIR COOLER OUTLET TEMP.(A) / (B) / (C) / (D) ABN. (D1 ... D4 from TCA442), AC EXCITER
     OUTLET AIR TEMP. ABN., GEN. STATOR COIL TEMP.(F) ABN. (D1 / D2 from TCA443) and two OFF(0), through BTR 006 / 009 / 012 /
     015 / 018 / 021 / 024 / 026.
   - OR 004: OR 003, then eight OFF(0) (spare), through BTR 007 / 010 / 013 / 016 / 019 / 022 / 025 / 027; its output = SIGNAL
     ERROR(2) (as printed on this sheet), A (to TCA816).
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
  const I8 = [212, 232, 252, 273, 294, 315, 336, 357],
    I9 = [212, 232, 252, 273, 294, 315, 336, 357, 379],
    R = [318, 425, 531, 638, 744, 851, 957, 1064];
  const C = (n) => ['GEN. STATOR COIL', 'TEMP.(' + n + ') ABN.'],
    G = (n) => ['GEN. COOLING GAS', 'AIR COOLER OUTLET', 'TEMP.(' + n + ') ABN.'];
  col(
    326,
    [212, 318, 425, 531, 638, 744, 851, 957],
    605,
    ['001', '005', '008', '011', '014', '017', '020', '023'],
    726,
    I8,
    [638, 648, 658, 668, 678, 688, 697],
    ['D1', 'D2', 'D3', 'D4', 'D1', 'D2', 'D3', 'D4'],
    ['TCA440', 'TCA440', 'TCA440', 'TCA440', 'TCA441', 'TCA441', 'TCA441', 'TCA441'],
    [
      ['LUBE OIL COOLER', 'INLET IOL TEMP. ABN.'],
      ['LUBE OIL COOLER', 'OUTLET OIL TEMP.(A)', 'ABN.'],
      ['LUBE OIL COOLER', 'OUTLET OIL TEMP.(B)', 'ABN.'],
      C('A'),
      C('B'),
      C('C'),
      C('D'),
      C('E')
    ],
    357,
    1,
    true
  );
  col(
    922,
    R,
    1201,
    ['006', '009', '012', '015', '018', '021', '024', '026'],
    1323,
    I9,
    [1226, 1236, 1246, 1256, 1266, 1276, 1286, 1295],
    ['D1', 'D2', 'D3', 'D4', 'D1', 'D2', '', ''],
    ['TCA442', 'TCA442', 'TCA442', 'TCA442', 'TCA443', 'TCA443'],
    [G('A'), G('B'), G('C'), G('D'), ['AC EXCITER OUTLET', 'AIR TEMP. ABN.'], C('F')],
    954,
    1041,
    false
  );
  col(
    0,
    R,
    1795,
    ['007', '010', '013', '016', '019', '022', '025', '027'],
    1918,
    I9,
    [1821, 1831, 1841, 1851, 1861, 1870, 1879, 1888],
    ['', '', '', '', '', '', '', ''],
    [],
    [],
    0,
    1640,
    false
  );
  b.push(
    ['or002', 'OR', '002', 756, 284.5, [], {}, [60, 171]],
    ['or003', 'OR', '003', 1352.5, 295.5, [], {}, [59, 193]],
    ['or004', 'OR', '004', 1947.5, 296.5, [], {}, [59, 193]]
  );
  W('or002', [786, 212], [1323, 212]);
  W('or003', [1382, 212], [1918, 212]);
  W('or004', [1977, 212], [2163 - 27, 212]);
  c.push(['oA', 'out', 'A', 2163, 212, '', ['TCA816'], 0, 1]);
  t.push(
    [2037, 188, 'SIGNAL'],
    [2037, 209, 'ERROR(2)'],
    [231, 1525, 'CONTROLLER:'],
    [392, 1525, 'COMM+MD'],
    [616, 1504, 'TRIGGER  :'],
    [616, 1531, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA815',
    title: 'ALARM',
    page: 224,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [162, 80, 2228, 1544],
    k,
    c,
    b,
    w,
    t
  });
})();
