/* TCE469 EHG ALARM(DI PS ABNORMAL) (331DM09784 page 168, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels
   of the page rendered 2296 wide, the scan skew taken out. Each DI power supply normal signal (AXR1 to AXR4, TCE040 to TCE043),
   inverted (NOT), is held in a flip-flop (FFS) until ANN RESET; OR 004 of the four is the EHG DI P.S. ABNORMAL (A, TCE472). */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    b = [],
    w = [],
    t = [];
  const BUS = 1160,
    pins = [218, 239, 260, 281],
    risers = [0, 1510, 1532, 1554];
  [
    ['TCE040', '001', '002', '003'],
    ['TCE041', '005', '006', '007'],
    ['TCE042', '008', '009', '010'],
    ['TCE043', '011', '012', '013']
  ].forEach(([ref, btr, not, ffs], i) => {
    const y = [218, 292, 368, 442][i],
      k = 'i' + i,
      f = 'ffs' + ffs,
      n = 'not' + not;
    c.push([k, 'in', 'A16', 327, y, 'DI P.S. NORMAL(AXR' + (i + 1) + ')', [ref]]);
    b.push(['btr' + btr, 'o:BTR', btr, 829, y], [n, 'NOT', not, 1053, y + 11], [f, 'FFS', ffs, 1234, y + 11, [], { l: ['S', 'R'] }, [80, 43]]);
    t.push([1180, y - 18, 'T', 0, 1.9]);
    w.push([k, [[354, y], [1024, y]]], [n, [[1082, y], [1194, y]]], ['kAnn', [[BUS, y + 22], [1194, y + 22]]]);
    w.push([f, risers[i] ? [[1274, y], [risers[i], y], [risers[i], pins[i]], [1577, pins[i]]] : [[1274, y], [1577, y]]]);
  });
  b.push(['or004', 'OR', '004', 1606, 249, [], {}, [58, 86]]);
  c.push(['oA', 'out', 'A', 2096, 218, '', ['TCE472']]);
  w.push(['kAnn', [[534, 538], [BUS, 538], [BUS, 240]]], ['or004', [[1635, 218], [2069, 218]]]);
  t.push(
    [435, 564, '(TCE050)', 0, 1.7],
    [1790, 208, 'EHG DI P.S. ABNORMAL', 0, 2.05],
    [232, 1526, 'CONTROLLER:'],
    [395, 1526, 'EHG+MD'],
    [619, 1500, 'TRIGGER  :'],
    [619, 1526, 'CYCLE(ms):30']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCE469',
    title: 'EHG ALARM(DI PS ABNORMAL)',
    page: 168,
    ctl: 'EHG+MD',
    cycle: 30,
    f: [161, 87, 2214, 1550],
    k: [['kAnn', 300, 538, 'ANN RESET', 'ref']],
    c,
    b,
    w,
    t
  });
})();
