/* TCA583A LOAD UP CONTROL (331DM09788 page 142, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. Two LOAD SET macro blocks (LMA569): the upper one for an IP start, the lower one for an HP start. Each takes thirteen load
   settings (SG, MW, with their % of the load printed by them) and the start mode (HOT, WARM, COLD1, COLD2, AMB.C from TCA500) and gives the
   initial load and the load up load. IP START picks the upper block in the two analog switches (ASW 005 / 013) to INITIAL LOAD SET(ATS) and
   LOAD UP LOAD SET(ATS) on TCE190. The mode lines are typed as the drawing joins them (COLD2 MODE on the third line, COLD1 MODE on the fourth). */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    b = [],
    w = [],
    t = [],
    j = [],
    R = Math.round,
    pins = y0 => Array.from({ length: 18 }, (_, i) => R(y0 + 21.4 * i)),
    P1 = pins(195) /* LOAD1..13, HOT, WARM, COLD1, COLD2, AMB.C of the upper block */,
    P2 = pins(705) /* the same of the lower block */,
    MODE = [801, 843, 885, 927, 970] /* the mode lines */,
    XL = [798, 809, 819, 830, 840] /* where each mode line turns up and down */,
    XR = [1426, 1436, 1447, 1457, 1467] /* where it turns up to the lower block */,
    YB = [1296, 1305, 1314, 1323, 1332] /* the bottom runs */;
  /* one load setting: [SG number, K, mode, % of load, FTR number] in the order LOAD1..13 (left, right, left, right ...) */
  const S1 = [
    ['A001', '0.0', '', '0.0', '002'],
    ['A006', '7.5', 'HOT', '5.0', '007'],
    ['A009', '4.5', 'WARM', '3.0', '010'],
    ['A011', '4.5', 'COLD1', '3.0', '012'],
    ['A014', '4.5', 'COLD2', '3.0', '015'],
    ['A016', '4.5', 'A.COLD', '3.0', '017'],
    ['A018', '7.5', 'V.HOT', '5.0', '019'],
    ['A020', '30.0', 'HOT', '20.0', '021'],
    ['A022', '30.0', 'WARM', '20.0', '023'],
    ['A024', '30.0', 'COLD1', '20.0', '025'],
    ['A026', '30.0', 'COLD2', '20.0', '027'],
    ['A028', '30.0', 'A.COLD', '20.0', '029'],
    ['A030', '30.0', 'V.HOT', '20.0', '031']
  ];
  const S2 = [
    ['A032', '0.0', '', '0.0', '033'],
    ['A036', '17.5', 'HOT', '5.0', '037'],
    ['A039', '10.5', 'WARM', '3.0', '040'],
    ['A042', '10.5', 'COLD1', '3.0', '043'],
    ['A045', '10.5', 'COLD2', '3.0', '046'],
    ['A048', '10.5', 'A.COLD', '3.0', '049'],
    ['A051', '17.5', 'V.HOT', '5.0', '052'],
    ['A054', '17.5', 'HOT', '5.0', '055'],
    ['A056', '10.5', 'WARM', '3.0', '057'],
    ['A058', '10.5', 'COLD1', '3.0', '059'],
    ['A060', '10.5', 'COLD2', '3.0', '061'],
    ['A062', '10.5', 'A.COLD', '3.0', '063'],
    ['A064', '17.5', 'V.HOT', '5.0', '065']
  ];
  /* g: the settings, P: the pins, x of the left / right SG, of the left / right FTR, the first riser x and its step, the block's left x,
     the y of the first left / right setting */
  const group = (g, P, sxL, sxR, fxL, fxR, rx0, MX, yL, yR) =>
    g.forEach(([no, k, mode, pc, ftr], i) => {
      const right = i % 2 === 1,
        row = right ? (i - 1) / 2 : i / 2,
        y = i < 2 ? P[i] : R((right ? yR : yL) + 85.2 * row),
        sx = right ? sxR : sxL,
        key = 'sg' + no;
      b.push([key, 'SG', no, sx, y + 11, ['K:' + k + 'MW']]);
      b.push(['ftr' + ftr, 'o:FTR', ftr, right ? fxR : fxL, y]);
      if (mode) t.push([sx + 36, y - 8, '(' + mode + ')']);
      t.push([sx + 36, y + 14, '(' + pc + '%L)']);
      const x0 = sx + 30;
      w.push(i < 2 ? [key, [[x0, y], [MX, y]], 1] : [key, [[x0, y], [R(rx0 + 10.6 * (i - 2)), y], [R(rx0 + 10.6 * (i - 2)), P[i]], [MX, P[i]]], 1]);
    });
  group(S1, P1, 262, 488, 401, 647, 679, 860, 195, 216);
  group(S2, P2, 891, 1116, 1030, 1275, 1307, 1488, 705, 726);
  /* the start modes: into the upper block, down and round into the lower block */
  [
    ['iHot', 'E', 'HOT MODE', '041'],
    ['iWarm', 'D', 'WARM MODE', '044'],
    ['iCold2', 'C', 'COLD2 MODE', '047'],
    ['iCold1', 'B', 'COLD1 MODE', '050'],
    ['iAmb', 'A', 'AMB.COLD MODE', '053']
  ].forEach(([key, l, name, btr], i) => {
    const y = MODE[i];
    c.push([key, 'in', l, 304, y, name, ['TCA500']]);
    b.push(['btr' + btr, 'o:BTR', btr, 645, y]);
    w.push([key, [[331, y], [XL[i], y]]]);
    w.push([key, [[XL[i], P1[13 + i]], [XL[i], YB[i]], [XR[i], YB[i]], [XR[i], P2[13 + i]], [1488, P2[13 + i]]]]);
    w.push([key, [[XL[i], P1[13 + i]], [860, P1[13 + i]]]]);
    j.push([XL[i], y]);
  });
  /* the outputs of the two blocks into the analog switches; IP START picks the upper block */
  b.push(
    ['ftr004', 'o:FTR', '004', 1202, 191],
    ['ftr008', 'o:FTR', '008', 1255, 213],
    ['ftr035', 'o:FTR', '035', 1765, 701],
    ['ftr038', 'o:FTR', '038', 1800, 722],
    ['asw005', 'ASW', '005', 1894, 200],
    ['asw013', 'ASW', '013', 1894, 370]
  );
  w.push(
    ['mt1.INITIAL', [[1097, 191], [1864, 191]], 1],
    ['mt1.LOADUP', [[1097, 213], [1562, 213], [1562, 360], [1864, 360]], 1],
    ['mt2.INITIAL', [[1721, 701], [1822, 701], [1822, 210], [1864, 210]], 1],
    ['mt2.LOADUP', [[1721, 722], [1842, 722], [1842, 381], [1864, 381]], 1],
    ['kIp', [[1696, 137], [1894, 137], [1894, 179]]],
    ['kIp', [[1799, 137], [1799, 317], [1894, 317], [1894, 349]]],
    ['asw005', [[1924, 191], [2049, 191]], 1],
    ['asw013', [[1924, 360], [2049, 360]], 1]
  );
  j.push([1799, 137]);
  c.push(['oA1', 'out', 'A1', 2076, 191, '', ['TCE190'], 1], ['oA2', 'out', 'A2', 2076, 360, '', ['TCE190'], 1]);
  t.push(
    [1595, 175, '(TCA106)'],
    [965, 145, '(IP START)', 1],
    [1595, 654, '(HP START)', 1],
    [1932, 155, 'INITIAL LOAD'],
    [1932, 177, 'SET(ATS)'],
    [1932, 325, 'LOAD UP LOAD'],
    [1932, 347, 'SET(ATS)'],
    [230, 1528, 'CONTROLLER:'],
    [400, 1528, 'COMM+MD'],
    [620, 1500, 'TRIGGER  :'],
    [620, 1526, 'CYCLE(ms):100']
  );
  const IN = ['LOAD1', 'LOAD2', 'LOAD3', 'LOAD4', 'LOAD5', 'LOAD6', 'LOAD7', 'LOAD8', 'LOAD9', 'LOAD10', 'LOAD11', 'LOAD12', 'LOAD13', 'HOT', 'WARM', 'COLD1', 'COLD2', 'AMB.C'];
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA583A',
    title: 'LOAD UP CONTROL',
    page: 142,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    k: [['kIp', 1463, 137, 'IP START', 'ref']],
    c,
    m: [
      ['mt1', 'LOAD SET MT1', '', 860, 160, 237, 470, IN, ['INITIAL', 'LOADUP'], '003', [[940, 648, '(LMA569)']], [P1, [191, 213]]],
      ['mt2', 'LOAD SET MT1', '', 1488, 670, 233, 467, IN, ['INITIAL', 'LOADUP'], '034', [[1567, 1156, '(LMA569)']], [P2, [701, 722]]]
    ],
    b,
    w,
    j,
    t
  });
})();
