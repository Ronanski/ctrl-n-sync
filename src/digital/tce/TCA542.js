/* TCA542 CRITERIA CONDITION (331DM09788 page 112, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. CRI 1.17 main oil tank level OK (not high, not low: OR 003, NOT 004), CRI 1.29 rotor position OK (no thrust bearing
   failure front / rear: OR 009, NOT 010), CRI 1.10 gland steam seal header press. not low (the lower of the headers (A) / (B) by LS 048, CPL
   A035 HL / LL 0.1 kg/cm2g, NOT 015), CRI 1.1 TSI OK (NOT 018 of the supervisory instrument trouble), CRI 1.39 H2 system OK (NOT 038 of the
   system reference OFF(0)) and CRI 1.42 AVR OK (NOT 027 of the excitation system minor trouble). Each fault also a lamp of the operator
   station (CRT TCA542_1 .. _7, _10) and a line out (A1, A2, B1, B2, C1, D1, B3, F1). */
(function () {
  if (typeof window === 'undefined') return;
  const OX = 2152 /* the output connectors */,
    TIP = 1321 /* the lamps and the line outs of the six rows */,
    w = [],
    b = [],
    c = [],
    d = [],
    t = [];
  const W = (key, pts, thick) => w.push(thick ? [key, pts, 1] : [key, pts]);
  /* a branch from the junction (x, y0) to y: the BTR at xb, the line to a CRT lamp (tip xe) or to a double connector (centre xe + 27) */
  const BR = (key, x, y0, y, no, xb, xe, out, label, tx) => {
    W(key, [
      [x, y0],
      [x, y],
      [xe, y]
    ]);
    b.push(['btr' + no, 'o:BTR', no, xb, y]);
    if (out.crt) d.push(['crt' + out.crt, xe + 35, y, 'out', 'TCA542_' + out.crt, 'S', '#1C']);
    else c.push(['o' + out.l, 'out', out.l, xe + 27, y, '', ['-'], 1]);
    label.forEach((s, i) => t.push([tx, y - 10 - 21 * (label.length - 1 - i), s]));
  };
  /* an input connector with its name above the line */
  const IN = (key, l, x, y, sh, names) => {
    c.push([key, 'in', l, x, y, '', [sh], 0]);
    names.forEach((s, n) => t.push([x + 33, y - 11 - 21 * (names.length - 1 - n), s]));
  };
  /* the six fault rows: [key, junction x, line y, up y, down y, BTR x, BTR up / down, lamp no., line out, the text, its x] */
  const ROWS = [
    ['iA5h', 731, 166, 134, 198, 785, ['001', '032'], '1', 'A1', 'MAIN OIL TANK LEVEL HIGH', 873],
    ['iA5l', 730, 294, 262, 326, 784, ['005', '033'], '2', 'A2', 'MAIN OIL TANK LEVEL LOW', 872],
    ['iA', 728, 422, 390, 454, 782, ['007', '044'], '3', 'B1', 'THRUST BEARING FAILURE (FRONT) ABNORMAL', 829],
    ['iB', 727, 550, 518, 582, 781, ['011', '034'], '4', 'B2', 'THRUST BEARING FAILURE (REAR) ABNORMAL', 828],
    ['cplA035', 726, 676, 646, 710, 780, ['013', '036'], '5', 'C1', 'GLAND STEAM SEAL HEADER PRESS. LOW', 870],
    ['iA9', 725, 794, 764, 826, 777, ['016', '037'], '6', 'D1', 'TURBINE SUPERVISORY INSTRUMENT TROUBLE', 869]
  ];
  ROWS.forEach(([key, jx, y, yu, yd, bx, btr, crt, out, txt, tx]) => {
    BR(key, jx, y, yu, btr[0], bx, TIP, { crt }, [txt], tx);
    BR(key, jx, y, yd, btr[1], bx, TIP, { l: out }, [txt], tx);
  });
  /* main oil tank level: high or low to OR 003, NOT 004 = level OK */
  IN('iA5h', 'A5', 229, 166, 'TCA051', ['MAIN OIL TANK', 'LEVEL HIGH']);
  IN('iA5l', 'A5', 227, 294, 'TCA050', ['MAIN OIL TANK LEVEL LOW']);
  W('iA5h', [
    [256, 166],
    [1553, 166]
  ]);
  W('iA5l', [
    [254, 294],
    [1528, 294],
    [1528, 185],
    [1553, 185]
  ]);
  b.push(['or003', 'OR', '003', 1582, 175], ['not004', 'NOT', '004', 1689, 175]);
  W('or003', [
    [1611, 164],
    [1659, 164]
  ]);
  W('not004', [
    [1719, 164],
    [OX - 27, 164]
  ]);
  /* thrust bearing failure front / rear: OR 009, NOT 010 = rotor position OK */
  IN('iA', 'A', 225, 422, 'TCA541', ['THRUST BEARING FAILURE', '(FRONT) ABNORMAL']);
  IN('iB', 'B', 225, 517, 'TCA541', ['THRUST BEARING FAILURE', '(REAR) ABNORMAL']);
  W('iA', [
    [252, 422],
    [1553, 422]
  ]);
  W('iB', [
    [252, 517],
    [715, 517],
    [715, 550],
    [1525, 550],
    [1525, 441],
    [1553, 441]
  ]);
  b.push(['or009', 'OR', '009', 1580, 431], ['not010', 'NOT', '010', 1686, 431]);
  W('or009', [
    [1609, 420],
    [1656, 420]
  ]);
  W('not010', [
    [1716, 420],
    [OX - 27, 420]
  ]);
  BR('not010', 1760, 420, 498, '046', 1791, 2000, { crt: '10' }, ['ROTOR', 'POSITION OK'], 1839);
  BR('not010', 1760, 420, 562, '047', 1791, 1998, { l: 'B3' }, ['ROTOR', 'POSITION OK'], 1839);
  /* gland steam seal header press.: the lower of (A) and (B) (B on two inputs), CPL A035, NOT 015 = not low */
  IN('iA1a', 'A1', 223, 602, 'TCA310', ['GLAND SEAL STEAM', 'HEADER PRESS.(A)']);
  IN('iA1b', 'A1', 223, 697, 'TCA312', ['GLAND SEAL STEAM', 'HEADER PRESS.(B)']);
  W(
    'iA1a',
    [
      [250, 602],
      [515, 602]
    ],
    1
  );
  W(
    'iA1b',
    [
      [250, 697],
      [479, 697],
      [479, 624],
      [515, 624]
    ],
    1
  );
  W(
    'iA1b',
    [
      [479, 645],
      [515, 645]
    ],
    1
  );
  b.push(
    ['ls048', 'LS', '048', 545, 635, [], {}, [59, 85]],
    ['cplA035', 'CPL', 'A035', 662, 687, ['HL:0.1kg/cm2g', 'LL:0.1kg/cm2g']],
    ['not015', 'NOT', '015', 1683, 687]
  );
  W(
    'ls048',
    [
      [574, 602],
      [599, 602],
      [599, 676],
      [632, 676]
    ],
    1
  );
  W('cplA035', [
    [692, 676],
    [1653, 676]
  ]);
  W('not015', [
    [1713, 676],
    [OX - 27, 676]
  ]);
  /* TSI: NOT 018 = TSI OK */
  IN('iA9', 'A9', 222, 794, 'TCA048', ['TURBINE SUPERVISORY', 'INSTRUMENT TROUBLE']);
  b.push(['not018', 'NOT', '018', 1683, 805]);
  W('iA9', [
    [249, 794],
    [1653, 794]
  ]);
  W('not018', [
    [1713, 794],
    [OX - 27, 794]
  ]);
  /* H2 system: OFF(0) inverted = OK */
  b.push(['not038', 'NOT', '038', 1521, 975], ['btr021', 'o:BTR', '021', 1681, 964]);
  W('kOff', [
    [426, 964],
    [1491, 964]
  ]);
  W('not038', [
    [1551, 964],
    [OX - 27, 964]
  ]);
  /* excitation system minor trouble: lamp, line out, NOT 027 = AVR OK */
  IN('iA11', 'A11', 219, 1156, 'TCA041', ['EXCITATION SYSTEM', 'MINOR TROUBLE']);
  b.push(['not027', 'NOT', '027', 1679, 1167]);
  W('iA11', [
    [246, 1156],
    [1649, 1156]
  ]);
  W('not027', [
    [1709, 1156],
    [OX - 27, 1156]
  ]);
  BR('iA11', 1626, 1156, 1041, '039', 1681, 1994, { crt: '7' }, ['EXCITATION SYSTEM', 'MINOR TROUBLE'], 1791);
  BR('iA11', 1626, 1156, 1105, '040', 1681, 1993, { l: 'F1' }, ['EXCITATION SYSTEM', 'MINOR TROUBLE'], 1791);
  c.push(
    ['oA', 'out', 'A', OX, 164, '', ['TCA554'], 0, 1],
    ['oB', 'out', 'B', OX, 420, '', ['TCA557'], 0, 1],
    ['oC', 'out', 'C', OX, 676, '', ['TCA552'], 0, 1],
    ['oD', 'out', 'D', OX, 794, '', ['TCA550'], 0, 1],
    ['oE', 'out', 'E', OX, 964, '', ['-'], 0, 0],
    ['oF', 'out', 'F', OX, 1156, '', ['TCA511', 'TCA560'], 0, 1]
  );
  t.push(
    [1798, 133, 'CRI 1.17 MAIN'],
    [1798, 154, 'OIL TANK LEVEL OK'],
    [1795, 389, 'CRI 1.29 ROTOR'],
    [1795, 410, 'POSITION OK'],
    [1793, 645, 'CRI 1.10 GLAND STEAM SEAL'],
    [1793, 666, 'HEADER PRESS. NOT LOW'],
    [1791, 784, 'CRI 1.1 TSI OK'],
    [1792, 954, 'CRI 1.39 H2 SYSTEM OK'],
    [1788, 1146, 'CRI 1.42 AVR OK'],
    [615, 666, 'T', 2],
    [228, 1527, 'CONTROLLER:'],
    [388, 1527, 'COMM+MD'],
    [613, 1501, 'TRIGGER  :'],
    [613, 1527, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA542',
    title: 'CRITERIA CONDITION',
    page: 112,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [160, 85, 2208, 1550],
    k: [['kOff', 193, 964, 'OFF(0)', 'sys.ref']],
    c,
    d,
    b,
    w,
    j: [
      [731, 166],
      [730, 294],
      [728, 422],
      [727, 550],
      [726, 676],
      [725, 794],
      [479, 645],
      [1760, 420],
      [1760, 498],
      [1626, 1105],
      [1626, 1156]
    ],
    t
  });
})();
