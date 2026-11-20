/* TCA801D COMM ALARM(HARDWARE)(7) (331DM09788 page 210, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn:
   - PI/O error (TCA932-1 ... TCA932-8) through BTR 004 / 005 / 006 / 008 / 009 / 010 / 011 / 012 into OR 001.
   - Eight OFF(0) (sys.ref) through BTR 013 / 015 / 016 / 017 / 018 / 019 / 020 / 021 into OR 014 (spare inputs).
   - OR 001 and OR 014 into OR 022; its output through BTR 003 = UNIT1 SLOT-C AI ERROR, A (to TCA806), and through BTR 007
     to CRT TCA801D_1.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    b = [],
    r = [],
    k = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const HW = 28.76;
  /* [rows, OR left x, OR inputs, bends, BTR x, BTR nos] */
  const Y1 = [240, 294, 347, 400, 453, 507, 560, 613],
    I1 = [241, 262, 283, 306, 327, 348, 368, 389],
    B1 = [1185, 1197, 1207, 1217, 1227, 1237, 1248],
    N1 = ['004', '005', '006', '008', '009', '010', '011', '012'],
    Y2 = [679, 732, 785, 837, 890, 942, 997, 1050],
    I2 = [679, 700, 721, 742, 763, 785, 805, 827],
    B2 = [1181, 1192, 1202, 1213, 1223, 1235, 1245],
    N2 = ['013', '015', '016', '017', '018', '019', '020', '021'];
  const row = (key, x0, y, i, xOR, I, B) =>
    i === 0 ? W(key, [x0, I[0]], [xOR, I[0]]) : W(key, [x0, y], [B[i - 1], y], [B[i - 1], I[i]], [xOR, I[i]]);
  Y1.forEach((y, i) => {
    const key = 'pe' + (17 + i);
    r.push([key, 237, y - 11, 126, 23, 'PI/O error']);
    t.push([297, y - 16, '(TCA932-' + (1 + i) + ')', 1]);
    b.push(['btr' + N1[i], 'o:BTR', N1[i], 789, i ? y : I1[0]]);
    row(key, 363, y, i, 1258, I1, B1);
  });
  Y2.forEach((y, i) => {
    const key = 'kOff' + (i + 1);
    k.push([key, 222, y, 'OFF(0)', 'sys.ref']);
    b.push(['btr' + N2[i], 'o:BTR', N2[i], 782, y]);
    row(key, 455, y, i, 1256.5, I2, B2);
  });
  b.push(
    ['or001', 'OR', '001', 1287, 315.5, [], {}, [58, 173]],
    ['or014', 'OR', '014', 1285, 753.5, [], {}, [57, 171]],
    ['or022', 'OR', '022', 1416, 252],
    ['btr003', 'o:BTR', '003', 1702, 241],
    ['btr007', 'o:BTR', '007', 1702, 401]
  );
  W('or001', [1316, 241], [1416 - HW, 241]);
  W('or014', [1314, 679], [1373, 679], [1373, 263], [1416 - HW, 263]);
  W('or022', [1416 + HW, 241], [2068 - 27, 241]);
  W('or022', [1660, 241], [1660, 401], [2074 - 35, 401]);
  t.push(
    [1729, 237, 'UNIT1 SLOT-C AI ERROR'],
    [1729, 397, 'UNIT1 SLOT-C AI ERROR'],
    [233, 1522, 'CONTROLLER:'],
    [394, 1522, 'COMM+MD'],
    [656, 1495, 'TRIGGER  :'],
    [656, 1522, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA801D',
    title: 'COMM ALARM(HARDWARE)(7)',
    page: 210,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [168, 80, 2228, 1542],
    r,
    k,
    c: [['oA', 'out', 'A', 2068, 241, '', ['TCA806'], 0, 1]],
    d: [['crtA', 2074, 401, 'out', 'TCA801D_1', 'S', '#1C']],
    b,
    w,
    j: [[1660, 241]],
    t
  });
})();
