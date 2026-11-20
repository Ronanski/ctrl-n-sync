/* TCA532 CRITERIA CONDITION (331DM09788 page 102, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. The ATS criteria CRI 1.2 TCS normal (NOT TCS minor trouble), CRI 1.5 reheat steam press. not low (CPL A003 HL / LL
   7.0 barg), CRI 1.6 reheat steam temp. not low (CPL A007 HL / LL 201.0 degC), each low also a lamp of the operator station (CRT TCA532_1 /
   _2), CRI 1.8 HP/LP bypass control in auto mode, CRI 1.9 HP bypass valve full closed, CRI 1.13 hydraulic fluid tank level OK (the level
   high / low of this unit are not wired: NOT 020 / 021 of the system reference ON(1)) and CRI 1.18 main oil tank vapor extractor running. */
(function () {
  if (typeof window === 'undefined') return;
  const OX = 2080 /* the output connectors */,
    w = [],
    b = [],
    c = [],
    d = [],
    t = [];
  const W = (key, pts, thick) => w.push(thick ? [key, pts, 1] : [key, pts]);
  /* a branch from the junction (x, y0) to y: the BTR at xb, the line to a CRT lamp (crt) or to a double connector (l) */
  const BR = (key, x, y0, y, no, xb, xe, out, label) => {
    W(key, [
      [x, y0],
      [x, y],
      [out.crt ? xe - 35 : xe - 27, y]
    ]);
    b.push(['btr' + no, 'o:BTR', no, xb, y]);
    if (out.crt) d.push(['crt' + out.crt, xe, y, 'out', 'TCA532_' + out.crt, 'S', '#1C']);
    else c.push(['o' + out.l, 'out', out.l, xe, y, '', ['-'], 1]);
    t.push([xb + 27, y - 10, label]);
  };
  /* the criteria out: [source key, x where the line starts, y, BTR (the x, the no.), letter, sheets, how the sheets stand, CRI lines] */
  const OUT = (key, x0, y, btr, ol, refs, under, cri) => {
    W(key, [
      [x0, y],
      [OX - 27, y]
    ]);
    if (btr) b.push(['btr' + btr[1], 'o:BTR', btr[1], btr[0], y]);
    c.push(['o' + ol, 'out', ol, OX, y, '', refs, 0, under]);
    cri.forEach((s, i) => t.push([1745, y - 10 - 21 * (cri.length - 1 - i), s]));
  };
  c.push(
    ['iB', 'in', 'B', 296, 211, 'TCS MINOR TROUBLE', ['TCA822']],
    ['iB4', 'in', 'B4', 295, 315, 'HOT REHEAT STEAM PRESS.', ['TCE102'], 1],
    ['iA1', 'in', 'A1', 293, 433, 'HOT REHEAT STEAM TEMP.', ['TCA356']],
    ['iA8', 'in', 'A8', 291, 657, '', ['TCA043']],
    ['iB11', 'in', 'B11', 289, 774, 'HP BYPASS CONTROL VALVE FULL CLOSED', ['TCE041'], 1],
    ['iB1', 'in', 'B1', 287, 1093, 'VAPOR EXTRACTOR RUNNING', ['TCA655']]
  );
  /* TCS normal */
  b.push(['not001', 'NOT', '001', 1661, 222]);
  W('iB', [
    [323, 211],
    [1631, 211]
  ]);
  OUT('not001', 1691, 211, null, 'A', ['TCA550'], 1, ['CRI 1.2 TCS NORMAL']);
  /* reheat steam press. */
  b.push(
    ['cplA003', 'CPL', 'A003', 722, 326, ['HL:7.0barg', 'LL:7.0barg']],
    ['not004', 'NOT', '004', 1660, 326],
    ['ftr022', 'o:FTR', '022', 722, 241]
  );
  c.push(['oB2', 'out', 'B2', 1277, 241, '', ['TCA583']]);
  W(
    'iB4',
    [
      [322, 315],
      [692, 315]
    ],
    1
  );
  W(
    'iB4',
    [
      [648, 315],
      [648, 241],
      [1250, 241]
    ],
    1
  );
  W('cplA003', [
    [752, 315],
    [1630, 315]
  ]);
  BR('cplA003', 806, 315, 283, '002', 849, 1277, { crt: '1' }, 'REHEAT STEAM PRESS.LOW');
  BR('cplA003', 806, 315, 348, '005', 849, 1276, { l: 'B1' }, 'REHEAT STEAM PRESS.LOW');
  OUT('not004', 1690, 315, null, 'B', ['TCA551'], 1, ['CRI 1.5 REHEAT STEAM', 'PRESS. NOT LOW']);
  /* reheat steam temp. */
  b.push(['cplA007', 'CPL', 'A007', 721, 444, ['HL:201.0degC', 'LL:201.0degC']], ['not008', 'NOT', '008', 1658, 444]);
  W(
    'iA1',
    [
      [320, 433],
      [691, 433]
    ],
    1
  );
  W('cplA007', [
    [751, 433],
    [1628, 433]
  ]);
  BR('cplA007', 805, 433, 401, '006', 849, 1277, { crt: '2' }, 'REHEAT STEAM TEMP.LOW');
  BR('cplA007', 805, 433, 464, '009', 849, 1275, { l: 'C1' }, 'REHEAT STEAM TEMP.LOW');
  OUT('not008', 1688, 433, null, 'C', ['TCA551'], 1, ['CRI 1.6 REHEAT STEAM', 'TEMP. NOT LOW']);
  /* bypass */
  b.push(['btr010', 'o:BTR', '010', 847, 657]);
  OUT('iA8', 318, 657, [1655, '011'], 'D', ['TCA552'], 1, ['CRI 1.8 HP/LP BYPASS', 'CONTROL IN AUTO MODE']);
  OUT('iB11', 316, 774, [1653, '012'], 'E', ['TCA526'], 1, ['CRI 1.9 HP BYPASS', 'VALVE FULL CLOSED']);
  /* hydraulic fluid tank level: high and low of ON(1) inverted, so the level is OK */
  b.push(
    ['not020', 'NOT', '020', 727, 880],
    ['not021', 'NOT', '021', 725, 1008],
    ['or014', 'OR', '014', 1525, 878],
    ['not015', 'NOT', '015', 1653, 880]
  );
  W('kOn', [
    [495, 869],
    [697, 869]
  ]);
  W('kOn', [
    [620, 869],
    [620, 997],
    [695, 997]
  ]);
  W('not020', [
    [757, 869],
    [1495, 869]
  ]);
  W('not021', [
    [755, 997],
    [1470, 997],
    [1470, 888],
    [1495, 888]
  ]);
  W('or014', [
    [1555, 869],
    [1623, 869]
  ]);
  BR('not020', 799, 869, 902, '016', 842, 1269, { l: 'F1' }, 'HYDRAULIC FLUID TANK LEVEL HIGH');
  BR('not021', 799, 997, 1030, '018', 842, 1268, { l: 'F2' }, 'HYDRAULIC FLUID TANK LEVEL LOW');
  OUT('not015', 1683, 869, null, 'F', ['-'], 1, ['CRI 1.13 HYDRAULIC', 'FLUID TANK LEVEL OK']);
  /* vapor extractor */
  OUT('iB1', 314, 1093, [1652, '019'], 'G', ['TCA554'], 1, ['CRI 1.18 MAIN OIL TANK', 'VAPOR EXTRACTOR RUNNING']);
  t.push(
    [679, 305, 'T', 2],
    [678, 423, 'T', 2],
    [323, 623, 'HP/LP BYPASS CONTROL'],
    [323, 645, 'IN AUTO'],
    [229, 1527, 'CONTROLLER:'],
    [390, 1527, 'COMM+MD'],
    [651, 1501, 'TRIGGER  :'],
    [651, 1527, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA532',
    title: 'CRITERIA CONDITION',
    page: 102,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [160, 85, 2208, 1550],
    k: [['kOn', 262, 869, 'ON(1)', 'sys.ref']],
    c,
    d,
    b,
    w,
    j: [
      [648, 315],
      [806, 315],
      [805, 433],
      [620, 869],
      [799, 869],
      [799, 997]
    ],
    t
  });
})();
