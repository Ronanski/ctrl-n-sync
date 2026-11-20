/* TCA800 COMM ALARM(HARDWARE)(1) (331DM09788 page 204, controller COMM+MD, cycle not printed). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn, six groups alike:
   - F (from TCA040 / 042 / 044 / 046 / 048 / 050) through BTR (TCA900-1 ... TCA905-1) and F (from TCA041 / 043 / 045 / 047 /
     049 / 051) through BTR (TCA900-17 ... TCA905-17) into OR 004 / 010 / 016 / 005 / 011 / 017.
   - Each OR output = A1 ... A6 (to TCA806), and through BTR 020 / 024 / 028 / 021 / 025 / 029 = UNIT 0 SLOT-5 / 6 / 7 / 8 / 9 / A
     DI ERROR to CRT TCA800_1 ... TCA800_6.
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
  const HW = 28.76;
  /* [top y, bottom y, branch y, F x, BTR x, bend x, OR x, OR no, junction x, BTR2 x, CRT x, out x,
      BTR1 no, BTR2 no, BTR3 no, ref1, ref2, card, slot, out letter, CRT tag] */
  const G = [
    [372, 477, 457, 252, 357, 477, 529.5, '004', 838, 869, 1061, 1051, '003', '006', '020', 'TCA040', 'TCA041', 'TCA900', '5', 'A1', 'TCA800_1'],
    [639, 745, 733, 250, 354, 473, 527, '010', 836, 867, 1056, 1051, '009', '012', '024', 'TCA042', 'TCA043', 'TCA901', '6', 'A2', 'TCA800_2'],
    [904, 1010, 1000, 250, 353, 472, 525, '016', 833, 865, 1056, 1048, '015', '018', '028', 'TCA044', 'TCA045', 'TCA902', '7', 'A3', 'TCA800_3'],
    [372, 477, 467, 1361, 1444, 1577, 1617.5, '005', 1850, 1882, 2069, 2064, '019', '022', '021', 'TCA046', 'TCA047', 'TCA903', '8', 'A4', 'TCA800_4'],
    [639, 743, 735, 1358, 1442, 1575, 1612.5, '011', 1847, 1868, 2067, 2059, '023', '026', '025', 'TCA048', 'TCA049', 'TCA904', '9', 'A5', 'TCA800_5'],
    [904, 1008, 1000, 1357, 1442, 1573, 1610, '017', 1846, 1878, 2065, 2059, '027', '030', '029', 'TCA050', 'TCA051', 'TCA905', 'A', 'A6', 'TCA800_6']
  ];
  G.forEach(([y1, y2, y3, xF, xB, xBend, xOR, nOR, xJ, xB2, xC, xO, n1, n2, n3, r1, r2, card, slot, o, tag]) => {
    const k1 = 'i' + r1,
      k2 = 'i' + r2,
      ko = 'or' + nOR;
    c.push([k1, 'in', 'F', xF, y1, '', [r1], 0, 1], [k2, 'in', 'F', xF, y2, '', [r2], 0, 1]);
    W(k1, [xF + 27, y1], [xOR - HW, y1]);
    W(k2, [xF + 27, y2], [xBend, y2], [xBend, y1 + 22], [xOR - HW, y1 + 22]);
    b.push(['btr' + n1, 'o:BTR', n1, xB, y1], ['btr' + n2, 'o:BTR', n2, xB, y2], [ko, 'OR', nOR, xOR, y1 + 11]);
    b.push(['btr' + n3, 'o:BTR', n3, xB2, y3]);
    W(ko, [xOR + HW, y1], [xO - 27, y1]);
    W(ko, [xJ, y1], [xJ, y3], [xC - 35, y3]);
    j.push([xJ, y1]);
    c.push(['o' + o, 'out', o, xO, y1, '', ['TCA806'], 0, 1]);
    d.push(['crt' + o, xC, y3, 'out', tag, 'S', '#1C']);
    t.push(
      [xB + 21, y1 - 13, card + '-1'],
      [xB + 21, y2 - 13, card + '-17'],
      [xJ + 60, y3 - 26, 'UNIT 0 SLOT-' + slot],
      [xJ + 60, y3 - 5, 'DI ERROR']
    );
  });
  t.push([233, 1525, 'CONTROLLER:'], [392, 1525, 'COMM+MD'], [617, 1498, 'TRIGGER  :'], [617, 1525, 'CYCLE(ms):']);
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA800',
    title: 'COMM ALARM(HARDWARE)(1)',
    page: 204,
    ctl: 'COMM+MD',
    cycle: '-',
    f: [168, 82, 2222, 1545],
    c,
    d,
    b,
    w,
    j,
    t
  });
})();
