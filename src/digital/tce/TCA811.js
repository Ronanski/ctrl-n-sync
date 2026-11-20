/* TCA811 ALARM (331DM09788 page 220, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn, three ORs in a chain:
   - OR 002: GEN. FIELD VOLTAGE(B) ABN. (D1, TCA316), AUX SYSTEM HEADER PRESS.(LOWER) ABN. (D2, TCA316), GEN. FIELD
     VOLTAGE(A) ABN. (D4, TCA312), GEN. FIELD CURRENT(A) ABN. (D1, TCA313), GEN. FIELD VOLTAGE(B) ABN. (D3, TCA314), GEN. FIELD
     CURRENT(B) ABN. (D4, TCA314), AUX. STEAM TEMP. ABN (D3, TCA316) and OFF(0), through BTR 001 / 005 / 008 / 011 / 014 / 017 /
     020 / 023.
   - OR 003: OR 002, then HP TURBINE DIFF. EXPANSION ABN., TURBINE SHELL EXPANSION (HP TURBINE SIDE) ABN., LOW SPEED
     ECCENTRICITY DETECTOR ABN. (D1 / D2 / D3 from TCA318) and five OFF(0), through BTR 006 / 009 / 012 / 015 / 018 / 021 / 024 /
     026.
   - OR 004: OR 003, then GEN. VAR ABN., GEN. POWER FACTOR ABN. (D1 / D2 from TCA320), two OFF(0), GEN. FREQUENCY ABN. (D1 from
     TCA321) and three OFF(0), through BTR 007 / 010 / 013 / 016 / 019 / 022 / 025 / 027; its output = SIGNAL ERROR(2), A (to
     TCA816).
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
        if (T[i].length === 2) t.push([xt, y - 30, T[i][0]], [xt, y - 8, T[i][1]]);
        else t.push([xt, y - 8, T[i][0]]);
      }
      b.push(['btr' + NB[i], 'o:BTR', NB[i], xB, y]);
      const x0 = off ? xOff : cx + 27;
      if (direct && i === 0) W(key, [x0, y], [xOR, y]);
      else {
        const n = direct ? i - 1 : i;
        W(key, [x0, y], [XB[n], y], [XB[n], YI[direct ? i : i + 1]], [xOR, YI[direct ? i : i + 1]]);
      }
    });
  const I8 = [207, 227, 247, 268, 289, 310, 331, 352],
    I9 = [207, 227, 247, 268, 289, 310, 331, 352, 374];
  col(
    333,
    [207, 314, 420, 527, 633, 740, 846, 953],
    612,
    ['001', '005', '008', '011', '014', '017', '020', '023'],
    733,
    I8,
    [645, 655, 666, 676, 687, 697, 707],
    ['D1', 'D2', 'D4', 'D1', 'D3', 'D4', 'D3', ''],
    ['TCA316', 'TCA316', 'TCA312', 'TCA313', 'TCA314', 'TCA314', 'TCA316', ''],
    [
      ['GEN. FIELD', 'VOLTAGE(B) ABN.'],
      ['AUX SYSTEM HEADER', 'PRESS.(LOWER) ABN.'],
      ['GEN. FIELD', 'VOLTAGE(A) ABN.'],
      ['GEN. FIELD', 'CURRENT(A) ABN.'],
      ['GEN. FIELD', 'VOLTAGE(B) ABN.'],
      ['GEN. FIELD', 'CURRENT(B) ABN.'],
      ['AUX. STEAM TEMP. ABN'],
      []
    ],
    366,
    455,
    true
  );
  col(
    932,
    [314, 420, 527, 633, 740, 846, 953, 1059],
    1208,
    ['006', '009', '012', '015', '018', '021', '024', '026'],
    1330,
    I9,
    [1232, 1242, 1252, 1262, 1272, 1281, 1291, 1301],
    ['D1', 'D2', 'D3', '', '', '', '', ''],
    ['TCA318', 'TCA318', 'TCA318'],
    [
      ['HP TURBINE DIFF.', 'EXPANSION ABN.'],
      ['TURBINE SHELL EXPANSION', '(HP TURBINE SIDE) ABN.'],
      ['LOW SPEED ECCENTRICITY', 'DETECTOR ABN.']
    ],
    963,
    1052,
    false
  );
  col(
    1528,
    [314, 420, 527, 633, 740, 846, 953, 1059],
    1803,
    ['007', '010', '013', '016', '019', '022', '025', '027'],
    1927,
    I9,
    [1827, 1838, 1848, 1859, 1869, 1880, 1890, 1900],
    ['D1', 'D2', '', '', 'D1', '', '', ''],
    ['TCA320', 'TCA320', '', '', 'TCA321'],
    [['GEN. VAR ABN.'], ['GEN. POWER', 'FACTOR ABN.'], [], [], ['GEN. FREQUENCY ABN.']],
    1560,
    1650,
    false
  );
  b.push(
    ['or002', 'OR', '002', 761.5, 280.5, [], {}, [57, 171]],
    ['or003', 'OR', '003', 1360, 290, [], {}, [60, 190]],
    ['or004', 'OR', '004', 1956, 290, [], {}, [58, 192]]
  );
  W('or002', [790, 207], [1330, 207]);
  W('or003', [1390, 207], [1927, 207]);
  W('or004', [1985, 207], [2170 - 27, 207]);
  c.push(['oA', 'out', 'A', 2170, 207, '', ['TCA816'], 0, 1]);
  t.push(
    [2044, 183, 'SIGNAL'],
    [2044, 204, 'ERROR(2)'],
    [243, 1525, 'CONTROLLER:'],
    [406, 1525, 'COMM+MD'],
    [629, 1503, 'TRIGGER  :'],
    [629, 1530, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA811',
    title: 'ALARM',
    page: 220,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [175, 74, 2234, 1540],
    k,
    c,
    b,
    w,
    t
  });
})();
