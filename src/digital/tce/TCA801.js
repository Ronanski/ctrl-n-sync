/* TCA801 COMM ALARM(HARDWARE)(3) (331DM09788 page 206, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn, two groups alike:
   - PI/O error (TCA930-1 ... TCA930-8) through BTR 004 / 005 / 006 / 008 / 009 / 010 / 011 / 012 into OR 001; its output through
     BTR 003 = UNIT1 SLOT-6 AI ERROR, A (to TCA806), and through BTR 007 to CRT TCA801_1.
   - PI/O error (TCA930-9 ... TCA930-16) through BTR 013 / 015 / 016 / 017 / 018 / 019 / 020 / 021 into OR 014; its output through
     BTR 022 = UNIT1 SLOT-7 AI ERROR, B (to TCA806), and through BTR 023 to CRT TCA801_2.
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
    [233, [238, 292, 346, 399, 452, 506, 559, 612], 1260, [238, 260, 280, 303, 325, 347, 367, 389], [1185, 1195, 1207, 1217, 1227, 1237, 1248],
      786, ['004', '005', '006', '008', '009', '010', '011', '012'], 1, '001', 1289.5, 313.5, 59, 173, 1586, 400, 1705, 2070, 2074, '003', '007', '6', 'A', 'TCA801_1'],
    [228, [677, 730, 783, 835, 888, 942, 995, 1048], 1255, [677, 698, 719, 740, 762, 783, 803, 825], [1181, 1192, 1202, 1213, 1222, 1233, 1243],
      783, ['013', '015', '016', '017', '018', '019', '020', '021'], 9, '014', 1285, 750, 60, 170, 1584, 835, 1700, 2066, 2070, '022', '023', '7', 'B', 'TCA801_2']
  ];
  G.forEach(([xb, Y, xOR, YI, XB, xB, NB, n0, nOR, cx, cy, bw, bh, xJ, y3, xB2, xO, xC, n3, n4, slot, o, tag]) => {
    Y.forEach((y, i) => {
      const k = 'pe' + (n0 + i);
      r.push([k, xb, y - 11, 130, 23, 'PI/O error']);
      t.push([xb + 60, y - 16, '(TCA930-' + (n0 + i) + ')', 1]);
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
  t.push([233, 1520, 'CONTROLLER:'], [394, 1520, 'COMM+MD'], [656, 1493, 'TRIGGER  :'], [656, 1520, 'CYCLE(ms):100']);
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA801',
    title: 'COMM ALARM(HARDWARE)(3)',
    page: 206,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [168, 78, 2226, 1540],
    r,
    c,
    d,
    b,
    w,
    j,
    t
  });
})();
