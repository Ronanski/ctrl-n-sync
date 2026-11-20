/* TCA821 ALARM (331DM09788 page 230, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn (all inputs from TCA053):
   - AC CONTROL P.S. ABNORMAL (A2), DC CONTROL P.S. ABNORMAL (A3), LIGHTING & SPACE HEATER P.S. ABNORMAL (A4),
     AC PROTECTION P.S. ABNORMAL (A5), DC PROTECTION P.S.(2) ABNORMAL (A6), DC PROTECTION P.S.(1) ABNORMAL (A7) and OFF(0)
     (spare) set FFS 002 / 005 / 008 / 010 / 012 / 014 / 016; ANN RESET (TCA100) resets all of them.
   - Each flip-flop through a BTR (025 / 027 / 028 / 029 / 030 / 031 / 032) to CRT TCA821_1 ... TCA821_7, and all of them
     into OR 039, A (to TCA822).
   - DC PROTECTION P.S.(2) ABNORMAL and P.S.(1) ABNORMAL into AND 040: PROTECTION P.S. LOST, B (to TCE472).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    b = [],
    c = [],
    d = [],
    t = [],
    j = [],
    k = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const Y = [207, 324, 431, 537, 644, 751, 858],
    L = ['A2', 'A3', 'A4', 'A5', 'A6', 'A7', ''],
    T = [
      'AC CONTROL P.S. ABNORMAL',
      'DC  CONTROL P.S. ABNORMAL',
      'LIGHTING & SPACE HEATER P.S. ABNORMAL',
      'AC PROTECTION P.S. ABNORMAL',
      'DC PROTECTION P.S.(2) ABNORMAL',
      'DC PROTECTION P.S.(1) ABNORMAL',
      ''
    ],
    T2 = [
      ['AC CONTROL', 'P.S. ABNORMAL'],
      ['DC  CONTROL', 'P.S. ABNORMAL'],
      ['LIGHTING &', 'SPACE HEATER P.S', 'ABNORMAL'],
      ['AC PROTECTION P', '.S. ABNORMAL'],
      ['DC PROTECTION', 'P.S.(2)ABNORMAL'],
      ['DC PROTECTION', 'P.S.(1)NORMAL'],
      ['SPARE']
    ],
    NF = ['002', '005', '008', '010', '012', '014', '016'],
    NB = ['025', '027', '028', '029', '030', '031', '032'],
    I = [207, 228, 249, 270, 291, 312, 333],
    XB = [1377, 1397, 1418, 1438, 1458, 1479],
    xBus = 787,
    xJ = 947;
  Y.forEach((y, i) => {
    const off = !L[i],
      key = off ? 'kOff' : 'i' + (i + 1),
      f = 'ffs' + NF[i],
      yb = y - 31;
    if (off) k.push([key, 298, y, 'OFF(0)', 'sys.ref']);
    else {
      c.push([key, 'in', L[i], 316, y, '', ['TCA053'], 0, 1]);
      t.push([349, y - 8, T[i]]);
    }
    T2[i].forEach((x, n) => t.push([1007, yb - 8 - 21.5 * (T2[i].length - 1 - n), x]));
    t.push([807, y - 18, 'T']);
    b.push(['ffs' + NF[i], 'FFS', NF[i], 862, y + 11, [], { l: ['S', 'R'] }, [80, 43]], ['btr' + NB[i], 'o:BTR', NB[i], 980, yb]);
    d.push(['crt' + (i + 1), 1225, yb, 'out', 'TCA821_' + (i + 1), 'S', '#1C']);
    W(key, [off ? 531 : 343, y], [822, y]);
    W('kAnnR', [xBus, y + 21.5], [822, y + 21.5]);
    if (i) j.push([xBus, y + 21.5]);
    j.push([xJ, y]);
    W(f, [xJ, y], [xJ, yb], [1225 - 35, yb]);
    if (i === 0) W(f, [902, y], [1590, I[0]]);
    else W(f, [902, y], [XB[i - 1], y], [XB[i - 1], I[i]], [1590, I[i]]);
  });
  W('kAnnR', [607, 1103], [xBus, 1103], [xBus, 228.5]);
  b.push(['or039', 'OR', '039', 1620, 270, [], {}, [60, 150]], ['and040', 'AND', '040', 988, 984, [], {}, [60, 44]]);
  W('or039', [1650, 207], [2113 - 27, 207]);
  /* AND 040: DC PROTECTION P.S.(2) and P.S.(1) ABNORMAL */
  W('i5', [734, 644], [734, 973], [958, 973]);
  W('i6', [701, 751], [701, 995], [958, 995]);
  j.push([734, 644], [701, 751]);
  W('and040', [1018, 973], [2107 - 27, 973]);
  c.push(['oA', 'out', 'A', 2113, 207, '', ['TCA822'], 0, 1], ['oB', 'out', 'B', 2107, 973, '', ['TCE472'], 0, 1]);
  t.push(
    [1746, 965, 'PROTECTION P.S. LOST'],
    [506, 1140, '(TCA100)'],
    [238, 1518, 'CONTROLLER:'],
    [400, 1518, 'COMM+MD'],
    [624, 1490, 'TRIGGER  :'],
    [624, 1518, 'CYCLE(ms):100']
  );
  k.push(['kAnnR', 374, 1103, 'ANN RESET', 'ref']);
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA821',
    title: 'ALARM',
    page: 230,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [172, 76, 2230, 1542],
    k,
    c,
    d,
    b,
    w,
    j,
    t
  });
})();
