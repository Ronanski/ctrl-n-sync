/* TCA812 ALARM (331DM09788 page 221, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn, three ORs in a chain:
   - OR 002: STEAM SEAL FEED VALVE POSITION ABN., STEAM PACKING UNLOADING VALVE POSITION ABN., CV(B) BELOW SEAT SECONDARY
     WARMING DRAIN VALVE POSITION, HP TURBINE WARMING VALVE POSITION (D1 / D2 / D3 / D4 from TCA322) and four OFF(0), through
     BTR 001 / 005 / 008 / 011 / 014 / 017 / 020 / 023.
   - OR 003: OR 002, then eight OFF(0) (spare), through BTR 006 / 009 / 012 / 015 / 018 / 021 / 024 / 026.
   - OR 004: OR 003, then seven OFF(0) and RTD ABN. (D4 from TCA353), through BTR 007 / 010 / 013 / 016 / 019 / 022 / 025 /
     027; its output = SIGNAL ERROR(3), A (to TCA816).
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
  const I8 = [209, 229, 249, 270, 291, 312, 333, 354],
    I9 = [209, 229, 249, 270, 291, 312, 333, 354, 376];
  col(
    326,
    [210, 317, 423, 530, 636, 743, 849, 955],
    604,
    ['001', '005', '008', '011', '014', '017', '020', '023'],
    724,
    I8,
    [637, 647, 657, 667, 677, 687, 697],
    ['D1', 'D2', 'D3', 'D4', '', '', '', ''],
    ['TCA322', 'TCA322', 'TCA322', 'TCA322'],
    [
      ['STEAM SEAL FEED', 'VALVE POSITION ABN.'],
      ['STEAM PACKING UNLOADING', 'VALVE POSITION ABN.'],
      ['CV(B) BELOW SEAT', 'SECONDARY WARMING DRAIN', 'VALVE POSITION'],
      ['HP TURBINE WARMING', 'VALVE POSITION']
    ],
    358,
    447,
    true
  );
  col(
    0,
    [316, 423, 529, 636, 742, 849, 955, 1062],
    1201,
    ['006', '009', '012', '015', '018', '021', '024', '026'],
    1323,
    I9,
    [1226, 1236, 1246, 1256, 1266, 1276, 1286, 1295],
    ['', '', '', '', '', '', '', ''],
    [],
    [],
    0,
    1045,
    false
  );
  col(
    1517,
    [316, 423, 529, 636, 742, 849, 955, 1062],
    1796,
    ['007', '010', '013', '016', '019', '022', '025', '027'],
    1919,
    I9,
    [1821, 1831, 1841, 1851, 1861, 1870, 1879, 1889],
    ['', '', '', '', '', '', '', 'D4'],
    ['', '', '', '', '', '', '', 'TCA353'],
    [[], [], [], [], [], [], [], ['RTD ABN.']],
    1548,
    1641,
    false
  );
  b.push(
    ['or002', 'OR', '002', 753.5, 282.5, [], {}, [59, 171]],
    ['or003', 'OR', '003', 1352.5, 293, [], {}, [59, 192]],
    ['or004', 'OR', '004', 1948, 293, [], {}, [58, 192]]
  );
  W('or002', [783, 209], [1323, 209]);
  W('or003', [1382, 209], [1919, 209]);
  W('or004', [1977, 209], [2162 - 27, 209]);
  c.push(['oA', 'out', 'A', 2162, 209, '', ['TCA816'], 0, 1]);
  t.push(
    [2036, 185, 'SIGNAL'],
    [2036, 206, 'ERROR(3)'],
    [237, 1527, 'CONTROLLER:'],
    [396, 1527, 'COMM+MD'],
    [621, 1505, 'TRIGGER  :'],
    [621, 1532, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA812',
    title: 'ALARM',
    page: 221,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [168, 76, 2228, 1542],
    k,
    c,
    b,
    w,
    t
  });
})();
