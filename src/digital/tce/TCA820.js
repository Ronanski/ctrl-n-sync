/* TCA820 ALARM (331DM09788 page 229, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn (all inputs from TCA052):
   - TRIP PCM(A) / (B) / (C) NORMAL (A5 / A6 / A7) and MODBUS CPU(A) / CPU(B) NORMAL (A12 / A13), each through a NOT
     (042 / 043 / 044 / 040 / 041), set FFS 002 / 005 / 008 / 010 / 012; MODBUS P.S.(A) ABNORMAL(AC) (A14) and the A15 signal,
     printed MODBUS P.S.(A) ABNORMAL(AC) as well, set FFS 014 / 016. ANN RESET (TCA100) resets all of them.
   - Each flip-flop through a BTR (025 / 027 / 028 / 029 / 030 / 031 / 032) to CRT TCA820_1 ... TCA820_7.
   - FFS 002 / 005 / 008 into OR 033 = A, FFS 010 / 012 / 014 / 016 into OR 039 = B (both to TCA822).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    b = [],
    c = [],
    d = [],
    t = [],
    j = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const Y = [210, 327, 433, 541, 647, 753, 859],
    L = ['A5', 'A6', 'A7', 'A12', 'A13', 'A14', 'A15'],
    T = [
      'TRIP PCM(A) NORMAL',
      'TRIP PCM(B) NORMAL',
      'TRIP PCM(C) NORMAL',
      'MODBUS CPU(A) NORMAL',
      'MODBUS CPU(B) NORMAL',
      'MODBUS P.S.(A) ABNORMAL(AC)',
      'MODBUS P.S.(A) ABNORMAL(AC)'
    ],
    T2 = [
      ['TRIP PCM (A)', 'ABNORMAL'],
      ['TRIP PCM (B)', 'ABNORMAL'],
      ['TRIP PCM (C)', 'ABNORMAL'],
      ['MODBS CPU(A)', 'STOP'],
      ['MODBS CPU(B)', 'STOP'],
      ['MODBUS P.S(A)', 'ABNORMAL (DC)'],
      ['MODBUS P.S(B)', 'ABNORMAL (AC)']
    ],
    NF = ['002', '005', '008', '010', '012', '014', '016'],
    NB = ['025', '027', '028', '029', '030', '031', '032'],
    NOT = { 0: '042', 1: '043', 2: '044', 3: '040', 4: '041' },
    xBus = 778,
    xJ = 941;
  /* where each flip-flop goes: [OR left x, OR input y, bend x (0 = straight)] */
  const TO = [
    [1585, 210, 0],
    [1585, 231.5, 1368],
    [1585, 253, 1388],
    [1580, 541, 0],
    [1580, 562, 1366],
    [1580, 583, 1385],
    [1580, 605, 1405]
  ];
  Y.forEach((y, i) => {
    const key = 'i' + (i + 1),
      f = 'ffs' + NF[i],
      yb = y - 31;
    c.push([key, 'in', L[i], 312, y, '', ['TCA052'], 0, 1]);
    t.push([344, y - 8, T[i]], [801, y - 18, 'T'], [1000, yb - 30, T2[i][0]], [1000, yb - 8, T2[i][1]]);
    b.push(['ffs' + NF[i], 'FFS', NF[i], 855, y + 11, [], { l: ['S', 'R'] }, [80, 43]], ['btr' + NB[i], 'o:BTR', NB[i], 971, yb]);
    d.push(['crt' + (i + 1), 1220, yb, 'out', 'TCA820_' + (i + 1), 'S', '#1C']);
    if (NOT[i]) {
      b.push(['not' + NOT[i], 'NOT', NOT[i], 665, y + 4]);
      W(key, [339, y], [636, y]);
      W('not' + NOT[i], [694, y], [815, y]);
    } else W(key, [339, y], [815, y]);
    W('kAnnR', [xBus, y + 21.5], [815, y + 21.5]);
    if (i) j.push([xBus, y + 21.5]);
    j.push([xJ, y]);
    W(f, [xJ, y], [xJ, yb], [1220 - 35, yb]);
    const [xo, yo, xb] = TO[i];
    if (!xb) W(f, [895, y], [xo, yo]);
    else W(f, [895, y], [xb, y], [xb, yo], [xo, yo]);
  });
  W('kAnnR', [596, 1105], [xBus, 1105], [xBus, 231.5]);
  b.push(['or033', 'OR', '033', 1614, 232, [], {}, [58, 64]], ['or039', 'OR', '039', 1609, 573.5, [], {}, [58, 85]]);
  W('or033', [1643, 210], [2104 - 27, 210]);
  W('or039', [1638, 541], [2101 - 27, 541]);
  c.push(['oA', 'out', 'A', 2104, 210, '', ['TCA822'], 0, 1], ['oB', 'out', 'B', 2101, 541, '', ['TCA822'], 0, 1]);
  t.push([495, 1142, '(TCA100)'], [228, 1524, 'CONTROLLER:'], [389, 1524, 'COMM+MD'], [614, 1497, 'TRIGGER  :'], [614, 1524, 'CYCLE(ms):100']);
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA820',
    title: 'ALARM',
    page: 229,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [160, 80, 2222, 1542],
    k: [['kAnnR', 363, 1105, 'ANN RESET', 'ref']],
    c,
    d,
    b,
    w,
    j,
    t
  });
})();
