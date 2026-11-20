/* TCA819 ALARM (331DM09788 page 228, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn (all inputs from TCT040):
   - TPC(A) / TPC(B) / TPC(C) PS ABNORMAL (A4 / A5 / A6) set FFS 002 / 005 / 008; EHG CPU(A) / CPU(B) NORMAL (A9 / A10) through
     NOT 039 / 040 set FFS 010 / 012; EHG P.S.(A) / P.S.(B) ABNORMAL (A13 / A14) set FFS 014 / 016. ANN RESET (TCA100) resets
     all of them.
   - Each flip-flop through a BTR (025 / 027 / 028 / 029 / 030 / 031 / 032) to CRT TCA819_1 ... TCA819_7.
   - FFS 002 / 005 / 008 into OR 033 = A, FFS 010 / 012 into OR 034 = B, FFS 014 / 016 into OR 035 = C (all to TCA822).
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
  const Y = [208, 325, 432, 539, 645, 752, 858],
    L = ['A4', 'A5', 'A6', 'A9', 'A10', 'A13', 'A14'],
    T = ['TPC(A) PS ABNORMAL', 'TPC(B) PS ABNORMAL', 'TPC(C) PS ABNORMAL', 'EHG CPU(A) NORMAL', 'EHG CPU(B) NORMAL', 'EHG P.S.(A) ABNORMAL', 'EHG P.S.(B) ABNORMAL'],
    T2 = [
      ['TPC(A) PS', 'ABNORMAL'],
      ['TPC(B) PS', 'ABNORMAL'],
      ['TPC(C) PS', 'ABNORMAL'],
      ['EHG CPU(A)', 'ABNORMAL'],
      ['EHG CPU(B)', 'ABNORMAL'],
      ['EHG P.S.(A)', 'ABNORMAL'],
      ['EHG P.S.(B)', 'ABNORMAL']
    ],
    NF = ['002', '005', '008', '010', '012', '014', '016'],
    NB = ['025', '027', '028', '029', '030', '031', '032'],
    NOT = { 3: '039', 4: '040' },
    xBus = 777,
    xJ = 941;
  /* where each flip-flop goes: [OR left x, OR input y, bend x (0 = straight)] */
  const TO = [
    [1585, 208, 0],
    [1585, 229.5, 1369],
    [1585, 251, 1390],
    [1582, 539, 0],
    [1582, 561, 1387],
    [1581, 752, 0],
    [1581, 774, 1385]
  ];
  Y.forEach((y, i) => {
    const key = 'i' + (i + 1),
      f = 'ffs' + NF[i],
      yb = y - 31;
    c.push([key, 'in', L[i], 310, y, '', ['TCT040'], 0, 1]);
    t.push([344, y - 8, T[i]], [800, y - 18, 'T'], [1000, yb - 30, T2[i][0]], [1000, yb - 8, T2[i][1]]);
    b.push(['ffs' + NF[i], 'FFS', NF[i], 853, y + 11, [], { l: ['S', 'R'] }, [80, 43]], ['btr' + NB[i], 'o:BTR', NB[i], 973, yb]);
    d.push(['crt' + (i + 1), 1219, yb, 'out', 'TCA819_' + (i + 1), 'S', '#1C']);
    if (NOT[i]) {
      b.push(['not' + NOT[i], 'NOT', NOT[i], 653, y + 4]);
      W(key, [337, y], [624, y]);
      W('not' + NOT[i], [682, y], [813, y]);
    } else W(key, [337, y], [813, y]);
    W('kAnnR', [xBus, y + 21.5], [813, y + 21.5]);
    if (i) j.push([xBus, y + 21.5]);
    j.push([xJ, y]);
    W(f, [xJ, y], [xJ, yb], [1219 - 35, yb]);
    const [xo, yo, xb] = TO[i];
    if (!xb) W(f, [893, y], [xo, yo]);
    else W(f, [893, y], [xb, y], [xb, yo], [xo, yo]);
  });
  W('kAnnR', [599, 1103], [xBus, 1103], [xBus, 229.5]);
  b.push(['or033', 'OR', '033', 1614, 229.5, [], {}, [58, 65]], ['or034', 'OR', '034', 1582 + 28.76, 550], ['or035', 'OR', '035', 1581 + 28.76, 763]);
  W('or033', [1643, 208], [2104 - 27, 208]);
  W('or034', [1582 + 57.52, 539], [2101 - 27, 539]);
  W('or035', [1581 + 57.52, 752], [2100 - 27, 752]);
  c.push(
    ['oA', 'out', 'A', 2104, 208, '', ['TCA822'], 0, 1],
    ['oB', 'out', 'B', 2101, 539, '', ['TCA822'], 0, 1],
    ['oC', 'out', 'C', 2100, 752, '', ['TCA822'], 0, 1]
  );
  t.push([498, 1140, '(TCA100)'], [228, 1524, 'CONTROLLER:'], [389, 1524, 'COMM+MD'], [614, 1497, 'TRIGGER  :'], [614, 1524, 'CYCLE(ms):100']);
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA819',
    title: 'ALARM',
    page: 228,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [160, 78, 2222, 1542],
    k: [['kAnnR', 366, 1103, 'ANN RESET', 'ref']],
    c,
    d,
    b,
    w,
    j,
    t
  });
})();
