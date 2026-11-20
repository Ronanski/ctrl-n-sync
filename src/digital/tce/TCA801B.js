/* TCA801B COMM ALARM(HARDWARE)(5) (331DM09788 page 208, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn, two groups alike:
   - PI/O error (TCA931-1 ... TCA931-8) through BTR 004 / 005 / 006 / 008 / 009 / 010 / 011 / 012 into OR 001; its output through
     BTR 003 = UNIT1 SLOT-9 AI ERROR, A (to TCA806), and through BTR 007 to CRT TCA801B_1.
   - PI/O error (TCA931-9 ... TCA931-16) through BTR 013 / 015 / 016 / 017 / 018 / 019 / 020 / 021 into OR 014; its output through
     BTR 022 = UNIT1 SLOT-A AI ERROR, B (to TCA806), and through BTR 023 to CRT TCA801B_2.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    b = [],
    c = [],
    d = [],
    r = [],
    t = [],
    j = [];
  const W = (key, ...pts) => w.push([key, pts]);
  /* [box x, rows, OR left x, OR inputs, bends, BTR x, BTR nos, first card no, OR no, OR cx, cy, w, h,
      junction x, branch y, BTR2 x, out x, CRT x, BTR3 no, BTR4 no, slot, out letter, CRT tag] */
  const G = [
    [230, [236, 289, 343, 396, 450, 503, 557, 610], 1256, [236, 258, 278, 301, 323, 345, 365, 387], [1181, 1191, 1203, 1213, 1223, 1233, 1244],
      784, ['004', '005', '006', '008', '009', '010', '011', '012'], 1, '001', 1285, 311.5, 58, 171, 1636, 397, 1692, 2064, 2069, '003', '007', '9', 'A', 'TCA801B_1'],
    [226, [674, 727, 780, 833, 887, 940, 993, 1047], 1253, [674, 695, 716, 737, 759, 780, 800, 822], [1178, 1189, 1199, 1210, 1219, 1230, 1240],
      781, ['013', '015', '016', '017', '018', '019', '020', '021'], 9, '014', 1282, 749, 58, 170, 1632, 834, 1697, 2070, 2075, '022', '023', 'A', 'B', 'TCA801B_2']
  ];
  G.forEach(([xb, Y, xOR, YI, XB, xB, NB, n0, nOR, cx, cy, bw, bh, xJ, y3, xB2, xO, xC, n3, n4, slot, o, tag]) => {
    Y.forEach((y, i) => {
      const k = 'pe' + (n0 + i);
      r.push([k, xb, y - 11, 130, 23, 'PI/O error']);
      t.push([xb + 60, y - 16, '(TCA931-' + (n0 + i) + ')', 1]);
      b.push(['btr' + NB[i], 'o:BTR', NB[i], xB, y]);
      if (i === 0) W(k, [xb + 130, y], [xOR, y]);
      else W(k, [xb + 130, y], [XB[i - 1], y], [XB[i - 1], YI[i]], [xOR, YI[i]]);
    });
    const ko = 'or' + nOR,
      y1 = Y[0];
    b.push([ko, 'OR', nOR, cx, cy, [], {}, [bw, bh]]);
    b.push(['btr' + n3, 'o:BTR', n3, xB2, y1], ['btr' + n4, 'o:BTR', n4, xB2, y3]);
    W(ko, [cx + bw / 2, y1], [xO - 27, y1]);
    W(ko, [xJ, y1], [xJ, y3], [xC - 35, y3]);
    j.push([xJ, y1]);
    c.push(['o' + o, 'out', o, xO, y1, '', ['TCA806'], 0, 1]);
    d.push(['crt' + o, xC, y3, 'out', tag, 'S', '#1C']);
    t.push([xB2 + 27, y1 - 4, 'UNIT1 SLOT-' + slot + ' AI ERROR'], [xB2 + 27, y3 - 4, 'UNIT1 SLOT-' + slot + ' AI ERROR']);
  });
  t.push([230, 1517, 'CONTROLLER:'], [391, 1517, 'COMM+MD'], [653, 1490, 'TRIGGER  :'], [653, 1517, 'CYCLE(ms):100']);
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA801B',
    title: 'COMM ALARM(HARDWARE)(5)',
    page: 208,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [163, 75, 2224, 1538],
    r,
    c,
    d,
    b,
    w,
    j,
    t
  });
})();
