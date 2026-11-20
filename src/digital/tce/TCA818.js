/* TCA818 ALARM (331DM09788 page 227, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn:
   - TCS-7 TEMP. HIGH, TCS-6 FAN TROUBLE, TCS-6 TEMP. HIGH, TCS-3 FAN TROUBLE, TCS-3 TEMP HIGH, TCS-2 FANTROUBLE, TCS-2 TEMP.HIGH,
     TCS-1 TEMP HIGH (A1 / A2 / A3 / A7 / A8 / A11 / A12 / A15 from TCT040), CUB.8 TEMP HIGH (A11 from TCA052), TCS-4 TEMP HIGH,
     TCS-5 TEMP.HIGH (A8 / A9 from TCA053): each sets its own flip-flop (FFS 002 / 005 / 008 / 010 / 012 / 014 / 016 / 018 /
     020 / 022 / 024); ANN RESET (TCA100) resets all of them.
   - Each flip-flop through a BTR (025 / 027 / 028 / 029 / 030 / 031 / 032 / 033 / 034 / 035 / 036) to CRT TCA818_1 ...
     TCA818_11, and all of them into OR 026, A (to TCA822).
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
  const Y = [210, 327, 434, 541, 648, 754, 860, 967, 1062, 1158, 1265],
    L = ['A1', 'A2', 'A3', 'A7', 'A8', 'A11', 'A12', 'A15', 'A11', 'A8', 'A9'],
    F = ['TCT040', 'TCT040', 'TCT040', 'TCT040', 'TCT040', 'TCT040', 'TCT040', 'TCT040', 'TCA052', 'TCA053', 'TCA053'],
    T = [
      'TCS-7 TEMP. HIGH',
      'TCS-6 FAN TROUBLE',
      'TCS-6 TEMP. HIGH',
      'TCS-3 FAN TROUBLE',
      'TCS-3 TEMP HIGH',
      'TCS-2 FANTROUBLE',
      'TCS-2 TEMP.HIGH',
      'TCS-1 TEMP HIGH',
      'CUB.8 TEMP HIGH',
      'TCS-4 TEMP HIGH',
      'TCS-5 TEMP.HIGH'
    ],
    T2 = [
      ['TCS-7 TEMP.', 'HIGH'],
      ['TCS-6 FAN', 'TROUBLE'],
      ['TCS-6 TEMP.', 'HIGH'],
      ['TCS-3 FAN', 'TROUBLE'],
      ['TCS-3 TEMP', 'HIGH'],
      ['TCS-2 FAN', 'TROUBLE'],
      ['TCS-2 TEMP.', 'HIGH'],
      ['TCS-1 TEMP', 'HIGH'],
      ['CUB.8 TEMP', 'HIGH'],
      ['TCS-4 TEMP', 'HIGH'],
      ['TCS-5 TEMP.', 'HIGH']
    ],
    NF = ['002', '005', '008', '010', '012', '014', '016', '018', '020', '022', '024'],
    NB = ['025', '027', '028', '029', '030', '031', '032', '033', '034', '035', '036'],
    I = [210, 231, 252, 273, 294, 315, 336, 357, 378, 399, 420],
    XB = [1370, 1390, 1410, 1430, 1450, 1470, 1490, 1510, 1530, 1550],
    xBus = 776,
    xJ = 938;
  Y.forEach((y, i) => {
    const key = 'i' + (i + 1),
      f = 'ffs' + NF[i],
      yb = y - 31;
    c.push([key, 'in', L[i], 308, y, '', [F[i]], 0, 1]);
    t.push([341, y - 8, T[i]], [800, y - 18, 'T'], [998, yb - 30, T2[i][0]], [998, yb - 8, T2[i][1]]);
    b.push(['ffs' + NF[i], 'FFS', NF[i], 853, y + 11, [], { l: ['S', 'R'] }, [80, 43]], ['btr' + NB[i], 'o:BTR', NB[i], 966, yb]);
    d.push(['crt' + (i + 1), 1216, yb, 'out', 'TCA818_' + (i + 1), 'S', '#1C']);
    W(key, [335, y], [813, y]);
    W('kAnnR', [xBus, y + 21.5], [813, y + 21.5]);
    if (i) j.push([xBus, y + 21.5]);
    j.push([xJ, y]);
    W(f, [xJ, y], [xJ, yb], [1216 - 35, yb]);
    if (i === 0) W(f, [893, y], [1583, I[0]]);
    else W(f, [893, y], [XB[i - 1], y], [XB[i - 1], I[i]], [1583, I[i]]);
  });
  W('kAnnR', [583, 1424], [xBus, 1424], [xBus, 231.5]);
  b.push(['or026', 'OR', '026', 1612, 317.5, [], {}, [58, 235]]);
  W('or026', [1641, 210], [2105 - 27, 210]);
  c.push(['oA', 'out', 'A', 2105, 210, '', ['TCA822'], 0, 1]);
  t.push(
    [480, 1460, '(TCA100)'],
    [227, 1524, 'CONTROLLER:'],
    [387, 1524, 'COMM+MD'],
    [612, 1497, 'TRIGGER  :'],
    [612, 1524, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA818',
    title: 'ALARM',
    page: 227,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [158, 82, 2222, 1544],
    k: [['kAnnR', 350, 1424, 'ANN RESET', 'ref']],
    c,
    d,
    b,
    w,
    j,
    t
  });
})();
