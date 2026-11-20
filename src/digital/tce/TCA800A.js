/* TCA800A COMM ALARM(HARDWARE)(2) (331DM09788 page 205, controller COMM+MD, cycle not printed). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn, six groups alike:
   - Group 1: F (from TCA052) through BTR 003 (TCA906-1) and F (from TCA053) through BTR 006 (TCA906-17) into OR 004; its output
     = A1 (to TCA806) and through BTR 020 = UNIT 0 SLOT-B DI ERROR to CRT TCA800A_1.
   - Groups 2 to 6 are spare: both OR inputs (BTR 009 / 012, 015 / 018, 019 / 022, 023 / 026, 027 / 030) come from OFF(0);
     OR 010 / 016 / 005 / 011 / 017 = A2 ... A6 and, through BTR 024 / 028 / 021 / 025 / 029, SPARE to CRT TCA800A_2 ... _6.
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
  const HW = 28.76,
    xL = 282,
    xR = 1392;
  /* [top y, bottom y, branch y, BTR x, bend x, OR x, OR no, junction x, BTR2 x, CRT x, out x, BTR1 no, BTR2 no, BTR3 no, out, CRT tag] */
  const G = [
    [367, 475, 452, 360, 477, 532, '004', 840, 873, 1062, 1055, '003', '006', '020', 'A1', 'TCA800A_1'],
    [635, 742, 730, 357, 477, 530, '010', 840, 870, 1058, 1051, '009', '012', '024', 'A2', 'TCA800A_2'],
    [900, 1007, 997, 355, 475, 529, '016', 838, 867, 1058, 1051, '015', '018', '028', 'A3', 'TCA800A_3'],
    [367, 475, 465, 1447, 1577, 1617.5, '005', 1853, 1883, 2073, 2066, '019', '022', '021', 'A4', 'TCA800A_4'],
    [635, 740, 730, 1445, 1575, 1616.5, '011', 1850, 1870, 2070, 2069, '023', '026', '025', 'A5', 'TCA800A_5'],
    [900, 1007, 997, 1445, 1573, 1614, '017', 1847, 1878, 2070, 2069, '027', '030', '029', 'A6', 'TCA800A_6']
  ];
  G.forEach(([y1, y2, y3, xB, xBend, xOR, nOR, xJ, xB2, xC, xO, n1, n2, n3, o, tag], i) => {
    const ko = 'or' + nOR,
      k1 = i ? 'kOff' : 'iTCA052',
      k2 = i ? 'kOff' : 'iTCA053',
      x0 = i === 0 ? 264 + 27 : i < 3 ? xL : xR;
    W(k1, [x0, y1], [xOR - HW, y1]);
    W(k2, [x0, y2], [xBend, y2], [xBend, y1 + 22], [xOR - HW, y1 + 22]);
    b.push(['btr' + n1, 'o:BTR', n1, xB, y1], ['btr' + n2, 'o:BTR', n2, xB, y2], [ko, 'OR', nOR, xOR, y1 + 11]);
    b.push(['btr' + n3, 'o:BTR', n3, xB2, y3]);
    W(ko, [xOR + HW, y1], [xO - 27, y1]);
    W(ko, [xJ, y1], [xJ, y3], [xC - 35, y3]);
    j.push([xJ, y1]);
    c.push(['o' + o, 'out', o, xO, y1, '', [i ? '-' : 'TCA806'], 0, 1]);
    d.push(['crt' + o, xC, y3, 'out', tag, 'S', '#1C']);
    if (i) t.push([xB2 + 28, y3 - 5, 'SPARE']);
  });
  /* the OFF(0) buses */
  W('kOff', [448, 1166], [xR, 1166], [xR, 367]);
  W('kOff', [675, 1166], [675, 1058], [xL, 1058], [xL, 635]);
  j.push([675, 1166], [xL, 742], [xL, 900], [xL, 1007], [xR, 475], [xR, 635], [xR, 742], [xR, 900], [xR, 1007]);
  c.push(['iTCA052', 'in', 'F', 264, 367, '', ['TCA052'], 0, 1], ['iTCA053', 'in', 'F', 264, 475, '', ['TCA053'], 0, 1]);
  t.push(
    [381, 354, 'TCA906-1'],
    [381, 462, 'TCA906-17'],
    [866, 398, 'UNIT 0 SLOT-B'],
    [866, 419, 'DI ERROR'],
    [233, 1522, 'CONTROLLER:'],
    [394, 1522, 'COMM+MD'],
    [618, 1495, 'TRIGGER  :'],
    [618, 1522, 'CYCLE(ms):']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA800A',
    title: 'COMM ALARM(HARDWARE)(2)',
    page: 205,
    ctl: 'COMM+MD',
    cycle: '-',
    f: [168, 80, 2224, 1541],
    k: [['kOff', 215, 1166, 'OFF(0)', 'sys.ref']],
    c,
    d,
    b,
    w,
    j,
    t
  });
})();
