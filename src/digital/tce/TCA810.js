/* TCA810 ALARM (331DM09788 page 219, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn, three ORs in a chain:
   - OR 002: GLAND STEAM SEAL HEADER PRESS.(A) ABN., GEN. VOLTAGE(A) ABN., GEN. FIELD CURRENT(A) ABN. (D1 / D2 / D3 from
     TCA310), two OFF(0), REHEAT BOWL STEAM PRESS.(A) / (B) / (C) ABN. (D2 / D3 / D4 from TCA311), through BTR 001 / 005 / 008 /
     011 / 014 / 017 / 020 / 023.
   - OR 003: OR 002, then GLAND STEAM SEAL HEADER PRESS.(B) ABN., GEN. VOLTAGE(B) ABN., GEN. FIELD CURRENT(B) ABN. (D1 / D2 / D3
     from TCA312) and five OFF(0), through BTR 006 / 009 / 012 / 015 / 018 / 021 / 024 / 026.
   - OR 004: OR 003, then GEN. FIELD VOLTAGE(A) ABN., GEN. VOLTAGE(C) ABN. (D1 / D2 from TCA314) and six OFF(0), through BTR 007 /
     010 / 013 / 016 / 019 / 022 / 025 / 027; its output = SIGNAL ERROR(1), A (to TCA816).
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
  const I8 = [212, 232, 252, 272, 292, 312, 332, 352],
    I9 = [212, 233, 254, 275, 296, 317, 338, 359, 380];
  col(
    333,
    [212, 318, 425, 532, 638, 745, 851, 957],
    612,
    ['001', '005', '008', '011', '014', '017', '020', '023'],
    733,
    I8,
    [643, 653, 662, 672, 682, 692, 702],
    ['D1', 'D2', 'D3', '', '', 'D2', 'D3', 'D4'],
    ['TCA310', 'TCA310', 'TCA310', '', '', 'TCA311', 'TCA311', 'TCA311'],
    [
      ['GLAND STEAM SEAL', 'HEADER PRESS.(A) ABN.'],
      ['GEN. VOLTAGE(A) ABN.'],
      ['GEN. FIELD', 'CURRENT(A) ABN.'],
      [],
      [],
      ['REHEAT BOWL', 'STEAM PRESS.(A) ABN.'],
      ['REHEAT BOWL', 'STEAM PRESS.(B) ABN.'],
      ['REHEAT BOWL', 'STEAM PRESS.(C) ABN.']
    ],
    362,
    455,
    true
  );
  col(
    933,
    [318, 425, 532, 638, 745, 851, 958, 1064],
    1208,
    ['006', '009', '012', '015', '018', '021', '024', '026'],
    1330,
    I9,
    [1232, 1242, 1252, 1261, 1270, 1280, 1290, 1299],
    ['D1', 'D2', 'D3', '', '', '', '', ''],
    ['TCA312', 'TCA312', 'TCA312'],
    [['GLAND STEAM SEAL', 'HEADER PRESS.(B) ABN.'], ['GEN. VOLTAGE(B) ABN.'], ['GEN. FIELD', 'CURRENT(B) ABN.']],
    962,
    1050,
    false
  );
  col(
    1529,
    [318, 425, 532, 638, 745, 851, 958, 1064],
    1803,
    ['007', '010', '013', '016', '019', '022', '025', '027'],
    1926,
    I9,
    [1828, 1838, 1848, 1857, 1866, 1876, 1885, 1894],
    ['D1', 'D2', '', '', '', '', '', ''],
    ['TCA314', 'TCA314'],
    [['GEN. FIELD', 'VOLTAGE(A) ABN.'], ['GEN. VOLTAGE(C) ABN.']],
    1558,
    1647,
    false
  );
  b.push(
    ['or002', 'OR', '002', 762, 285, [], {}, [58, 170]],
    ['or003', 'OR', '003', 1358.5, 297, [], {}, [57, 192]],
    ['or004', 'OR', '004', 1955, 298, [], {}, [58, 192]]
  );
  W('or002', [791, 212], [1330, 212]);
  W('or003', [1387, 212], [1926, 212]);
  W('or004', [1984, 212], [2170 - 27, 212]);
  c.push(['oA', 'out', 'A', 2170, 212, '', ['TCA816'], 0, 1]);
  t.push(
    [2043, 188, 'SIGNAL'],
    [2043, 209, 'ERROR(1)'],
    [238, 1525, 'CONTROLLER:'],
    [398, 1525, 'COMM+MD'],
    [622, 1503, 'TRIGGER  :'],
    [622, 1530, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA810',
    title: 'ALARM',
    page: 219,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [180, 82, 2234, 1546],
    k,
    c,
    b,
    w,
    t
  });
})();
