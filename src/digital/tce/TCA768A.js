/* TCA768A SPEED LOAD HOLD (331DM09788 page 196, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn:
   - GEN.LOAD (ref) through FTR 009 into L of five MODE blocks (LMA810) 010 / 013 / 015 / 017 / 019 (HOT, WARM, COLD 1, COLD 2, A-COLD
     MODE); T-R COMP (E of TCA535) through BTR 012 into T of all five. The K tables (MW and %/min) printed beside them.
   - The M outputs picked by ASW 018 (COLD1 MODE), 016 (COLD2 MODE), 014 (WARM MODE) and 011 (HOT MODE) of TCA500; ASW 021, switched by
     NORMAL/STOP MODE (E of TCA768), gives SG 020 (K:2.0%/min) or that rate, A out (to TCA769).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [],
    b = [],
    j = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const WT = (key, ...pts) => w.push([key, pts, 1]);
  const HW = 28.76,
    xM = 588,
    ML = xM - 43.75,
    MR = xM + 43.75,
    xB = 450,
    xT = 515;
  /* the MODE blocks: [no, cy, label, label x, label y] */
  const M = [
    ['010', 704, 'HOT MODE', 645, 654],
    ['013', 868, 'WARM MODE', 646, 813],
    ['015', 1047, 'COLD 1 MODE', 647, 994],
    ['017', 1218, 'COLD 2 MODE', 648, 1175],
    ['019', 1410, 'A-COLD MODE', 606, 1346]
  ];
  /* the K tables printed beside each block (MW break points, then the six %/min rates, top to bottom), as the block's parameters:
     L1 .. L4 = 90.0 / 60.0 / 33.0 / 22.5 MW, R1 .. R6 = the rates of that block */
  const KR = {
    '010': ['0.7', '0.4', '0.4', '1.0', '1.0', '5.0'],
    '013': ['0.6', '0.35', '0.25', '0.25', '0.75', '5.0'],
    '015': ['0.5', '0.3', '0.2', '0.2', '0.5', '5.0'],
    '017': ['0.5', '0.3', '0.2', '0.2', '0.5', '5.0'],
    '019': ['0.5', '0.3', '0.2', '0.2', '0.5', '5.0']
  };
  M.forEach(([n, y, s, lx, ly]) => {
    b.push(['mode' + n, 'MODE', n, xM, y, ['90.0', '60.0', '33.0', '22.5'].map((m, i) => 'L' + (i + 1) + ':' + m).concat(KR[n].map((r, i) => 'R' + (i + 1) + ':' + r)), {}, [87.5, 107]]);
    t.push([ML + 6, y - 14, 'L'], [ML + 6, y + 6, 'T'], [MR - 16, y - 14, 'M'], [xM, y + 80, '(LMA810)', 1], [lx, ly, s]);
  });
  WT('kLoad', [410, 684], [ML, 684]);
  WT('kLoad', [xB, 684], [xB, 1390], [ML, 1390]);
  [848, 1027, 1198].forEach(y => (WT('kLoad', [xB, y], [ML, y]), j.push([xB, y])));
  j.push([xB, 684]);
  W('iTR', [323, 752], [xT, 752]);
  W('iTR', [xT, 704], [xT, 1410], [ML, 1410]);
  W('iTR', [xT, 704], [ML, 704]);
  [868, 1047, 1218].forEach(y => (W('iTR', [xT, y], [ML, y]), j.push([xT, y])));
  j.push([xT, 752]);
  b.push(['ftr009', 'o:FTR', '009', 480, 684], ['btr012', 'o:BTR', '012', 469, 752]);
  /* the switches */
  WT('mode010', [MR, 684], [1089 - HW, 684]);
  WT('mode013', [MR, 848], [993 - HW, 848]);
  WT('mode015', [MR, 1027], [908 - HW, 1027]);
  WT('mode017', [MR, 1198], [813.5 - HW, 1198]);
  WT('mode019', [MR, 1390], [752, 1390], [752, 1220], [813.5 - HW, 1220]);
  WT('asw018', [813.5 + HW, 1198], [869, 1198], [869, 1049], [908 - HW, 1049]);
  WT('asw016', [908 + HW, 1027], [952, 1027], [952, 870], [993 - HW, 870]);
  WT('asw014', [993 + HW, 848], [1049, 848], [1049, 706], [1089 - HW, 706]);
  WT('asw011', [1089 + HW, 684], [1569 - HW, 684]);
  WT('sg020', [1238 + HW, 585], [1355, 585], [1355, 662], [1569 - HW, 662]);
  WT('asw021', [1569 + HW, 662], [2032, 662], [2032, 648], [2068 - 27, 648]);
  W('iNorm', [322, 165], [1569, 165], [1569, 673 - 21.5]);
  W('iHot', [322, 390], [1089, 390], [1089, 695 - 21.5]);
  W('iWarm', [324, 455], [993, 455], [993, 859 - 21.5]);
  W('iC2', [324, 519], [908, 519], [908, 1038 - 21.5]);
  W('iC1', [324, 583], [813.5, 583], [813.5, 1209 - 21.5]);
  b.push(
    ['asw011', 'ASW', '011', 1089, 695],
    ['asw014', 'ASW', '014', 993, 859],
    ['asw016', 'ASW', '016', 908, 1038],
    ['asw018', 'ASW', '018', 813.5, 1209],
    ['asw021', 'ASW', '021', 1569, 673],
    ['sg020', 'SG', '020', 1238, 596, ['K:2.0%/min']]
  );
  /* the K tables */
  const K = [
    [208, 325, 818, ['0.7', '0.4', '0.4', '1.0', '1.0', '5.0']],
    [209, 316, 967, ['0.6', '0.35', '0.25', '0.25', '0.75', '5.0']],
    [211, 305, 1116, ['0.5', '0.3', '0.2', '0.2', '0.5', '5.0']],
    [212, 317, 1255, ['0.5', '0.3', '0.2', '0.2', '0.5', '5.0']],
    [203, 308, 1404, ['0.5', '0.3', '0.2', '0.2', '0.5', '5.0']]
  ];
  K.forEach(([xa, xr, y0, r]) => {
    ['90.0', '60.0', '33.0', '22.5'].forEach((m, i) => t.push([xa, Math.round(y0 + 21.3 * i), 'K:' + m + 'MW']));
    r.forEach((v, i) => t.push([xr, Math.round(y0 + 21.3 * i), 'K:' + v + '%/min']));
  });
  t.push(
    [326, 160, 'NORMAL/STOP MODE'],
    [327, 384, 'HOT MODE'],
    [328, 449, 'WARM MODE'],
    [328, 513, 'COLD2 MODE'],
    [328, 577, 'COLD1 MODE'],
    [330, 747, 'T-R COMP'],
    [238, 1537, 'CONTROLLER:'],
    [399, 1537, 'COMM+MD'],
    [624, 1505, 'TRIGGER  :'],
    [624, 1531, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA768A',
    title: 'SPEED LOAD HOLD',
    page: 196,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [162, 84, 2222, 1552],
    k: [['kLoad', 177, 684, 'GEN.LOAD', 'ref']],
    c: [
      ['iNorm', 'in', 'E', 295, 165, '', ['TCA768'], 0, 1],
      ['iHot', 'in', 'E', 297, 390, '', ['TCA500'], 0, 1],
      ['iWarm', 'in', 'D', 297, 455, '', ['TCA500'], 0, 1],
      ['iC2', 'in', 'C', 297, 519, '', ['TCA500'], 0, 1],
      ['iC1', 'in', 'B', 297, 583, '', ['TCA500'], 0, 1],
      ['iTR', 'in', 'E', 296, 752, '', ['TCA535'], 0, 1],
      ['oA', 'out', 'A', 2068, 648, '', ['TCA769'], 0, 1]
    ],
    b,
    w,
    j,
    t
  });
})();
