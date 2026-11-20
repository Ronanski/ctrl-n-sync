/* TCE465 EHG ALARM(DI ERROR) (331DM09784 page 164, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the
   page rendered 2296 wide, the scan skew taken out (x + 0.0136 (y - 800), y - 0.0038 (x - 1100)). Each DI slot abnormal (TCE040 to
   TCE043) and each COM CPU stop / COM P.S. abnormal is held in a flip-flop (FFS) until ANN RESET; the slot alarms go to the operator
   station lamps (CRT) and A1 to A4, OR 013 of them is the DI ERROR (A, TCE472); OR 018 of the COM alarms is the ATS ALARM (B1, TCA822). */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    b = [],
    d = [],
    w = [],
    t = [];
  const BUS = 1157;
  /* one row: input connector, flip-flop, outputs; i = row number (0 to 7), y = the line of the row */
  const row = (i, y, let, name, ref, ffs, not) => {
    const k = 'i' + i,
      f = 'ffs' + ffs;
    c.push([k, 'in', let, 325, y, name, [ref]]);
    b.push([f, 'FFS', ffs, 1230, y + 10, [], { l: ['S', 'R'] }, [80, 43]]);
    t.push([1176, y - 16, 'T', 0, 1.9]);
    if (not) {
      const n = 'not' + not[0];
      b.push([n, 'NOT', not[0], not[1], y + 10]);
      w.push([k, [[352, y], [not[1] - 29, y]]], [n, [[not[1] + 29, y], [1190, y]]]);
    } else w.push([k, [[352, y], [1190, y]]]);
    w.push(['kAnn', [[BUS, y + 21], [1190, y + 21]]]);
    return f;
  };
  /* the four DI slots: lamp and connector A1 to A4, and OR 013 */
  const slots = [
    ['DI SLOT0.U.ABN', 'TCE040', '001', ['002', '003'], 'A1', 1507],
    ['DI SLOT0.L.ABN', 'TCE041', '004', ['005', '006'], 'A2', 1486],
    ['DI SLOT1.U.ABN', 'TCE042', '007', ['008', '009'], 'A3', 1465],
    ['DI SLOT1.L.ABN', 'TCE043', '010', ['011', '012'], 'A4', 1444]
  ];
  slots.forEach(([nm, ref, ffs, btr, oc, xo], i) => {
    const y = 216 + 128 * i,
      f = row(i, y, 'F', nm, ref, ffs),
      pin = 717 + 21 * i;
    d.push(['crt' + (i + 1), 2027, y, 'out', 'TCE465_' + (i + 1), 'S', '#1C']);
    c.push(['o' + oc, 'out', oc, 2017, y + 64, '', ['-'], 1]);
    b.push(['btr' + btr[0], 'o:BTR', btr[0], 1581, y], ['btr' + btr[1], 'o:BTR', btr[1], 1581, y + 64]);
    w.push(
      [f, [[1270, y], [1992, y]]],
      [f, [[1527, y], [1527, y + 64], [1990, y + 64]]],
      [f, [[xo, y], [xo, pin], [1552, pin]]]
    );
    t.push([1746, y - 10, nm, 0, 2.05], [1746, y + 54, nm, 0, 2.05]);
  });
  /* the COM CPU stop and COM P.S. abnormal: lamps and OR 018 */
  const coms = [
    ['A11', 'COM CPU(A) RUN', '014', ['019', 709], 'COM CPU(A) STOP', 1507],
    ['A12', 'COM CPU(B) RUN', '015', ['020', 699], 'COM CPU(B) STOP', 1487],
    ['A13', 'COM P.S.(A) ABNORMAL', '016', 0, 'COM P.S.(A) ABNORMAL', 1466],
    ['A14', 'COM P.S.(B) ABNORMAL', '017', 0, 'COM P.S.(B) ABNORMAL', 1445]
  ];
  coms.forEach(([let, nm, ffs, not, lamp, xo], i) => {
    const y = [856, 983, 1110, 1238][i],
      f = row(4 + i, y, let, nm, 'TCE043', ffs, not),
      pin = 1312 + [0, 21, 43, 64][i];
    d.push(['crt' + (6 + i), 2018, y, 'out', 'TCE465_' + (6 + i), 'S', '#1C']);
    w.push([f, [[1270, y], [1983, y]]], [f, [[xo, y], [xo, pin], [1543, pin]]]);
    t.push([1692, y - 10, lamp, 0, 2.05]);
  });
  b.push(['or013', 'OR', '013', 1582, 749, [], {}, [60, 86]], ['or018', 'OR', '018', 1573, 1345, [], {}, [60, 86]]);
  c.push(['oA', 'out', 'A', 2018, 717, '', ['TCE472']], ['oB1', 'out', 'B1', 2009, 1312, '', ['TCA822'], 1]);
  w.push(['kAnn', [[1076, 782], [BUS, 782]]], ['kAnn', [[BUS, 237], [BUS, 1259]]], ['or013', [[1612, 717], [1991, 717]]], ['or018', [[1603, 1312], [1982, 1312]]]);
  t.push(
    [987, 808, '(TCE050)', 0, 1.7],
    [1744, 707, 'DI ERROR', 0, 2.05],
    [1734, 1302, 'ATS ALARM', 0, 2.05],
    [240, 1525, 'CONTROLLER:'],
    [402, 1525, 'EHG+MD'],
    [637, 1498, 'TRIGGER  :'],
    [637, 1525, 'CYCLE(ms):30']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCE465',
    title: 'EHG ALARM(DI ERROR)',
    page: 164,
    ctl: 'EHG+MD',
    cycle: 30,
    f: [170, 85, 2220, 1549],
    k: [['kAnn', 842, 782, 'ANN RESET', 'ref']],
    d,
    c,
    b,
    w,
    t
  });
})();
