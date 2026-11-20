/* TCA805 COMM ALARM(HARDWARE)(14) (331DM09788 page 217, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn, two groups alike:
   - PI/O error (TCA990-1) through BTR 004, and OFF(0) (sys.ref) through BTR 005 / 006 / 008 / 009 / 010 / 011 / 012, into
     OR 001; its output through BTR 022 = UNIT1 SLOT-D AO ERROR, A1 (to TCA806), and through BTR 023 to CRT TCA805_1.
   - PI/O error (TCA990-9) through BTR 013, and OFF(0) through BTR 015 / 016 / 017 / 018 / 019 / 020 / 021, into OR 014; its
     output through BTR 025 = UNIT1 SLOT-E AO ERROR, A2 (to TCA806), and through BTR 026 to CRT TCA805_2.
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
  const xBus = 594;
  /* [box x, rows, OR left x, OR inputs, bends, BTR x, BTR nos, card no, OR no, OR cx, cy, w, h,
      junction x, branch y, BTR2 x, BTR3 x, out x, CRT x, BTR3 no, BTR4 no, slot, out letter, CRT tag] */
  const G = [
    [234, [240, 293, 347, 400, 454, 508, 561, 614], 1262, [240, 261, 283, 305, 326, 347, 368, 389], [1188, 1198, 1208, 1218, 1228, 1238, 1248],
      792, ['004', '005', '006', '008', '009', '010', '011', '012'], 1, '001', 1291, 314, 58, 172, 1566, 401, 1673, 1669, 2090, 2096, '022', '023', 'D', 'A1', 'TCA805_1'],
    [232, [678, 731, 785, 838, 891, 944, 997, 1050], 1258, [678, 699, 720, 741, 762, 784, 804, 826], [1184, 1194, 1204, 1214, 1224, 1234, 1244],
      788, ['013', '015', '016', '017', '018', '019', '020', '021'], 9, '014', 1288, 751, 60, 170, 1562, 838, 1668, 1667, 2086, 2092, '025', '026', 'E', 'A2', 'TCA805_2']
  ];
  G.forEach(([xb, Y, xOR, YI, XB, xB, NB, n0, nOR, cx, cy, bw, bh, xJ, y3, xB2, xB3, xO, xC, n3, n4, slot, o, tag]) => {
    const kp = 'pe' + n0;
    r.push([kp, xb, Y[0] - 11, 127, 23, 'PI/O error']);
    t.push([xb + 60, Y[0] - 16, '(TCA990-' + n0 + ')', 1]);
    Y.forEach((y, i) => {
      b.push(['btr' + NB[i], 'o:BTR', NB[i], xB, y]);
      if (i === 0) W(kp, [xb + 127, y], [xOR, y]);
      else W('kOff', [xBus, y], [XB[i - 1], y], [XB[i - 1], YI[i]], [xOR, YI[i]]);
    });
    const ko = 'or' + nOR,
      y1 = Y[0];
    b.push([ko, 'OR', nOR, cx, cy, [], {}, [bw, bh]]);
    b.push(['btr' + n3, 'o:BTR', n3, xB2, y1], ['btr' + n4, 'o:BTR', n4, xB3, y3]);
    W(ko, [cx + bw / 2, y1], [xO - 27, y1]);
    W(ko, [xJ, y1], [xJ, y3], [xC - 35, y3]);
    j.push([xJ, y1]);
    c.push(['o' + o, 'out', o, xO, y1, '', ['TCA806'], 0, 1]);
    d.push(['crt' + o, xC, y3, 'out', tag, 'S', '#1C']);
    t.push([xB2 + 27, y1 - 4, 'UNIT1 SLOT-' + slot + ' AO ERROR'], [xB3 + 27, y3 - 4, 'UNIT1 SLOT-' + slot + ' AO ERROR']);
  });
  /* the OFF(0) bus */
  W('kOff', [460, 1050], [xBus, 1050], [xBus, 293]);
  [347, 400, 454, 508, 561, 614, 731, 785, 838, 891, 944, 997, 1050].forEach((y) => j.push([xBus, y]));
  t.push([236, 1522, 'CONTROLLER:'], [398, 1522, 'COMM+MD'], [660, 1495, 'TRIGGER  :'], [660, 1522, 'CYCLE(ms):100']);
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA805',
    title: 'COMM ALARM(HARDWARE)(14)',
    page: 217,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 80, 2230, 1544],
    r,
    k: [['kOff', 227, 1050, 'OFF(0)', 'sys.ref']],
    c,
    d,
    b,
    w,
    j,
    t
  });
})();
