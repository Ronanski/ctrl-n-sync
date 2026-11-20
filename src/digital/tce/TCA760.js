/* TCA760 IP/HP THSC CHANGE(4) (331DM09788 page 189, controller COMM+MD, trigger Trigger-of_LOGIC_2, cycle 60 s). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn:
   - THERMAL STRESS (HP SURFACE) (A of TCA754) through FTR 001 = HP SURF STRESS to CRT 4-JT-HSS-A310_1, and through FTR 002 to A1;
     THERMAL STRESS (IP SURFACE) (A of TCA758) through FTR 003 / 004 = IP SURF STRESS to CRT 4-JT-ISS-A310_1 and A2.
   - THERMAL STRESS (HP BORE) (B of TCA754) through FTR 005 / 006 = HP BORE STRESS to CRT 4-JT-HBS-A310_1 and B1; B of TCA758 (printed
     THERMAL STRESS(HP BORE)) through FTR 007 / 008 = IP BORE STRESS to CRT 4-JT-IBS-A310_1 and B2.
   - TB-H (1 of TCA754) through FG A009 = HP BORE LIMIT: FTR 010 to CRT 4-JT-HBL-A310_1, FTR 011 to C1, FTR 015 to A (TCA769).
     TB-I (1 of TCA758) through FG A012 = IP BORE LIMIT: FTR 013 to CRT 4-JT-IBL-A310_1, FTR 014 to C2, FTR 016 to B (TCA769).
   - The FG table (BORE to LIMIT) No. 0-7: 0.0/377.0, 20.0/377.0, 60.0/484.0, 550.0/340.0, 600.0/340.0, 610.0/340.0, 620.0/340.0,
     630.0/340.0.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [],
    b = [],
    c = [],
    d = [],
    j = [],
    l = [];
  const WT = (key, ...pts) => w.push([key, pts, 1]);
  const HW = 28.76,
    DW = 35;
  /* stress pairs: in, then a CRT and a double-outline out through two FTR */
  [
    ['iHS', 'A', 'TCA754', 'THERMAL STRESS(HP SURFACE)', 269, 212, 266, 1262, ['001', '002'], 'HP SURF STRESS', '4-JT-HSS-A310_1', 'A1', 1315, 1407, 1937, 1929],
    ['iIS', 'A', 'TCA758', 'THERMAL STRESS(IP SURFACE)', 269, 319, 373, 1262, ['003', '004'], 'IP SURF STRESS', '4-JT-ISS-A310_1', 'A2', 1315, 1406, 1937, 1929],
    ['iHB', 'B', 'TCA754', 'THERMAL STRESS(HP BORE)', 268, 511, 565, 1258, ['005', '006'], 'HP BORE STRESS', '4-JT-HBS-A310_1', 'B1', 1312, 1405, 1934, 1929],
    ['iIB', 'B', 'TCA758', 'THERMAL STRESS(HP BORE)', 268, 640, 693, 1258, ['007', '008'], 'IP BORE STRESS', '4-JT-IBS-A310_1', 'B2', 1312, 1404, 1934, 1929]
  ].forEach(([k, L, ref, lab, cx, y1, y2, jx, f, txt, tag, oL, fx, tx, dx, ox]) => {
    c.push([k, 'in', L, cx, y1, '', [ref], 0, 1]);
    t.push([cx + 33, y1 - 5, lab], [tx, y1 - 4, txt], [tx, y2 - 4, txt]);
    WT(k, [cx + 27, y1], [dx - DW, y1]);
    WT(k, [jx, y1], [jx, y2], [ox - 27, y2]);
    j.push([jx, y1]);
    b.push(['ftr' + f[0], 'o:FTR', f[0], fx, y1], ['ftr' + f[1], 'o:FTR', f[1], fx, y2]);
    d.push(['crt' + oL, dx, y1, 'out', tag, 'S', '#1C']);
    c.push(['o' + oL, 'out', oL, ox, y2, '', ['-'], 1, 0]);
  });
  /* bore limits: TB through FG, then a CRT, a double-outline out and an out to TCA769 */
  [
    ['iTH', 'TB-H', 'TCA754', 831, 'A009', 884, 1118, 1216, ['010', '011', '015'], 'HP BORE LIMIT', '4-JT-HBL-A310_1', 'C1', 'A'],
    ['iTI', 'TB-I', 'TCA758', 958, 'A012', 1012, 1193, 1185, ['013', '014', '016'], 'IP BORE LIMIT', '4-JT-IBL-A310_1', 'C2', 'B']
  ].forEach(([k, lab, ref, y1, fg, y2, y3, jx2, f, txt, tag, oL, oL2]) => {
    c.push([k, 'in', '1', 267, y1, '', [ref], 0, 1]);
    t.push([300, y1 - 5, lab], [1402, y1 - 4, txt], [1402, y2 - 4, txt], [1400, y3 - 4, txt]);
    const fk = 'fg' + fg;
    b.push([fk, 'FG', fg, 918.5, y1 + 11]);
    WT(k, [294, y1], [918.5 - HW, y1]);
    WT(fk, [918.5 + HW, y1], [1926 - DW, y1]);
    WT(fk, [1258, y1], [1258, y2], [1927 - 27, y2]);
    WT(fk, [jx2, y1], [jx2, y3], [1927 - 27, y3]);
    j.push([1258, y1], [jx2, y1]);
    b.push(['ftr' + f[0], 'o:FTR', f[0], 1309, y1], ['ftr' + f[1], 'o:FTR', f[1], 1309, y2], ['ftr' + f[2], 'o:FTR', f[2], 1308, y3]);
    d.push(['crt' + oL, 1926, y1, 'out', tag, 'S', '#1C']);
    c.push(['o' + oL, 'out', oL, 1927, y2, '', ['-'], 1, 0], ['o' + oL2, 'out', oL2, 1927, y3, '', ['TCA769'], 0, 0]);
  });
  /* the FG table */
  const TX = [318, 371, 478, 586],
    TY = [1067, 1100, 1132, 1164, 1196, 1228, 1260, 1292, 1324, 1356];
  TY.forEach(y => l.push([[TX[0], y], [TX[3], y]]));
  TX.forEach(x => l.push([[x, TY[0]], [x, TY[9]]]));
  t.push([320, 1059, 'FG'], [330, 1090, 'No.'], [405, 1090, 'BORE'], [512, 1090, 'LIMIT']);
  [
    ['0.0', '377.0'],
    ['20.0', '377.0'],
    ['60.0', '484.0'],
    ['550.0', '340.0'],
    ['600.0', '340.0'],
    ['610.0', '340.0'],
    ['620.0', '340.0'],
    ['630.0', '340.0']
  ].forEach(([bo, li], i) => t.push([340, TY[i + 1] + 22, String(i)], [383, TY[i + 1] + 22, bo], [490, TY[i + 1] + 22, li]));
  t.push(
    [232, 1532, 'CONTROLLER:'],
    [392, 1532, 'COMM+MD'],
    [617, 1515, 'TRIGGER  :Trigger-of_LOGIC_2'],
    [617, 1541, 'CYCLE(s):60']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA760',
    title: 'IP/HP THSC CHANGE(4)',
    page: 189,
    ctl: 'COMM+MD',
    cycle: 60000,
    f: [168, 84, 2223, 1550],
    c,
    b,
    d,
    w,
    j,
    l,
    t
  });
})();
