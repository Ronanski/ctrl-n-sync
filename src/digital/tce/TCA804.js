/* TCA804 COMM ALARM(HARDWARE)(13) (331DM09788 page 216, controller COMM+MD, cycle not printed). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn, six groups alike:
   - Groups 1 to 3: PI/O error (TCA980-1 / TCA981-1 / TCA982-1) through BTR 003 / 009 / 015 and PI/O error (TCA980-17 /
     TCA981-17 / TCA982-17) through BTR 006 / 012 / 018 into OR 004 / 010 / 016; each output = A1 / A2 / A3 (to TCA806) and,
     through BTR 020 / 024 / 028 = UNIT 0 SLOT-C / D / E DO ERROR, to CRT TCA804_1 / _2 / _3.
   - Groups 4 to 6 are spare: both OR inputs (BTR 019 / 022, 023 / 026, 027 / 030) come from OFF(0); OR 005 / 011 / 017 =
     A4 / A5 / A6 and, through BTR 021 / 025 / 029, SPARE to CRT TCA804_4 / _5 / _6.
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
  const HW = 28.76,
    xR = 1388;
  /* [top y, bottom y, branch y, BTR x, bend x, OR x, OR no, junction x, BTR2 x, CRT x, out x, BTR1 no, BTR2 no, BTR3 no,
      out, CRT tag, box x, card, slot] */
  const G = [
    [367, 475, 452, 357, 474, 529, '004', 783, 815, 1060, 1051, '003', '006', '020', 'A1', 'TCA804_1', 188, 'TCA980', 'C'],
    [634, 741, 729, 355, 472, 527, '010', 782, 813, 1058, 1049, '009', '012', '024', 'A2', 'TCA804_2', 186, 'TCA981', 'D'],
    [900, 1007, 995, 353, 471, 527, '016', 780, 812, 1057, 1048, '015', '018', '028', 'A3', 'TCA804_3', 185, 'TCA982', 'E'],
    [367, 474, 463, 1446, 1577, 1617, '005', 1851, 1883, 2103, 2095, '019', '022', '021', 'A4', 'TCA804_4'],
    [634, 740, 729, 1445, 1574, 1615, '011', 1849, 1868, 2101, 2093, '023', '026', '025', 'A5', 'TCA804_5'],
    [900, 1006, 996, 1443, 1572, 1613, '017', 1846, 1880, 2098, 2091, '027', '030', '029', 'A6', 'TCA804_6']
  ];
  G.forEach(([y1, y2, y3, xB, xBend, xOR, nOR, xJ, xB2, xC, xO, n1, n2, n3, o, tag, xb, card, slot], i) => {
    const ko = 'or' + nOR,
      real = i < 3,
      k1 = real ? 'pe' + card + '_1' : 'kOff',
      k2 = real ? 'pe' + card + '_17' : 'kOff',
      x0 = real ? xb + 127 : xR;
    if (real) {
      r.push([k1, xb, y1 - 11, 127, 23, 'PI/O error'], [k2, xb, y2 - 11, 127, 23, 'PI/O error']);
      t.push([xb + 60, y1 - 16, '(' + card + '-1)', 1], [xb + 60, y2 - 16, '(' + card + '-17)', 1]);
      t.push([xJ + 60, y3 - 26, 'UNIT 0 SLOT-' + slot], [xJ + 60, y3 - 5, 'DO ERROR']);
    } else t.push([xB2 + 27, i === 5 ? y3 - 30 : y3 - 5, 'SPARE']);
    W(k1, [x0, y1], [xOR - HW, y1]);
    W(k2, [x0, y2], [xBend, y2], [xBend, y1 + 22], [xOR - HW, y1 + 22]);
    b.push(['btr' + n1, 'o:BTR', n1, xB, y1], ['btr' + n2, 'o:BTR', n2, xB, y2], [ko, 'OR', nOR, xOR, y1 + 11]);
    b.push(['btr' + n3, 'o:BTR', n3, xB2, y3]);
    W(ko, [xOR + HW, y1], [xO - 27, y1]);
    W(ko, [xJ, y1], [xJ, y3], [xC - 35, y3]);
    j.push([xJ, y1]);
    c.push(['o' + o, 'out', o, xO, y1, '', [real ? 'TCA806' : '-'], 0, 1]);
    d.push(['crt' + o, xC, y3, 'out', tag, 'S', '#1C']);
  });
  /* the OFF(0) bus */
  W('kOff', [443, 1166], [xR, 1166], [xR, 367]);
  j.push([xR, 474], [xR, 634], [xR, 740], [xR, 900], [xR, 1006]);
  t.push([233, 1520, 'CONTROLLER:'], [394, 1520, 'COMM+MD'], [618, 1493, 'TRIGGER  :'], [618, 1520, 'CYCLE(ms):']);
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA804',
    title: 'COMM ALARM(HARDWARE)(13)',
    page: 216,
    ctl: 'COMM+MD',
    cycle: '-',
    f: [166, 78, 2228, 1543],
    r,
    k: [['kOff', 210, 1166, 'OFF(0)', 'sys.ref']],
    c,
    d,
    b,
    w,
    j,
    t
  });
})();
