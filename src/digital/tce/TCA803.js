/* TCA803 COMM ALARM(HARDWARE)(12) (331DM09788 page 215, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn:
   - PI/O error (TCA970-1 ... TCA970-8) through BTR 004 / 005 / 006 / 008 / 009 / 010 / 011 / 012 into OR 001.
   - PI/O error (TCA970-9 ... TCA970-16) through BTR 013 / 015 / 016 / 017 / 018 / 019 / 020 / 021 into OR 014.
   - OR 001 and OR 014 into OR 022; its output through BTR 003 = UNIT1 SLOT-4 RTD AI ERROR, A (to TCA806), and through BTR 007
     to CRT TCA803_1.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    b = [],
    r = [],
        t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const HW = 28.76;
  /* [rows, OR left x, OR inputs, bends, BTR x, BTR nos] */
  const Y1 = [240, 294, 347, 400, 453, 507, 560, 613],
    I1 = [241, 262, 283, 306, 327, 348, 368, 389],
    B1 = [1185, 1197, 1207, 1217, 1227, 1237, 1248],
    N1 = ['004', '005', '006', '008', '009', '010', '011', '012'],
    Y2 = [677, 730, 783, 836, 889, 942, 995, 1048],
    I2 = [677, 698, 719, 740, 761, 783, 803, 825],
    B2 = [1184, 1194, 1204, 1214, 1224, 1234, 1244],
    N2 = ['013', '015', '016', '017', '018', '019', '020', '021'];
  const row = (key, x0, y, i, xOR, I, B) =>
    i === 0 ? W(key, [x0, I[0]], [xOR, I[0]]) : W(key, [x0, y], [B[i - 1], y], [B[i - 1], I[i]], [xOR, I[i]]);
  Y1.forEach((y, i) => {
    const key = 'pe' + (1 + i);
    r.push([key, 237, y - 11, 126, 23, 'PI/O error']);
    t.push([297, y - 16, '(TCA970-' + (1 + i) + ')', 1]);
    b.push(['btr' + N1[i], 'o:BTR', N1[i], 793, i ? y : I1[0]]);
    row(key, 363, y, i, 1262, I1, B1);
  });
  Y2.forEach((y, i) => {
    const key = 'pe' + (9 + i);
    r.push([key, 233, y - 11, 126, 23, 'PI/O error']);
    t.push([293, y - 16, '(TCA970-' + (9 + i) + ')', 1]);
    b.push(['btr' + N2[i], 'o:BTR', N2[i], 788, y]);
    row(key, 359, y, i, 1258, I2, B2);
  });
  b.push(
    ['or001', 'OR', '001', 1291, 315.5, [], {}, [58, 173]],
    ['or014', 'OR', '014', 1288, 751.5, [], {}, [60, 171]],
    ['or022', 'OR', '022', 1422, 252],
    ['btr003', 'o:BTR', '003', 1697, 241],
    ['btr007', 'o:BTR', '007', 1697, 401]
  );
  W('or001', [1320, 241], [1422 - HW, 241]);
  W('or014', [1318, 677], [1378, 677], [1378, 263], [1422 - HW, 263]);
  W('or022', [1422 + HW, 241], [2103 - 27, 241]);
  W('or022', [1655, 241], [1655, 401], [2108 - 35, 401]);
  t.push(
    [1725, 237, 'UNIT1 SLOT-4 RTD AI ERROR'],
    [1725, 397, 'UNIT1 SLOT-4 RTD AI ERROR'],
    [233, 1522, 'CONTROLLER:'],
    [394, 1522, 'COMM+MD'],
    [656, 1495, 'TRIGGER  :'],
    [656, 1522, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA803',
    title: 'COMM ALARM(HARDWARE)(12)',
    page: 215,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [168, 80, 2228, 1542],
    r,
    c: [['oA', 'out', 'A', 2103, 241, '', ['TCA806'], 0, 1]],
    d: [['crtA', 2108, 401, 'out', 'TCA803_1', 'S', '#1C']],
    b,
    w,
    j: [[1655, 241]],
    t
  });
})();
