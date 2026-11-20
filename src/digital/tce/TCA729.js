/* TCA729 SPACE HEATER (331DM09788 page 176, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. Gate by gate as drawn:
   - 52G OPEN (C2 of TCA611) sets FFR 001; NOT 002 of 52G OPEN, or the space heater for gen. electrical trouble (A10 of TCA050), through
     OR 003 resets it. The FFR 001 output is A1 out (to TCA833).
   - 52G OPEN sets FFR 006; NOT 007 of 52G OPEN, or the space heater for AC exciter electrical trouble (A9 of TCA050), through OR 008
     resets it. The FFR 006 output is A2 out (to TCA833).
   - The two trouble signals and the two ON signals (A7 / A8 of TCA050) go to the lamps TCA729_1 to TCA729_4.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  /* 52G OPEN to the two FFRs and the two NOTs */
  W('iC2', [365, 238], [1334, 238]);
  W('iC2', [892, 238], [892, 761], [1327, 761]);
  W('iC2', [828, 238], [828, 822], [955.2, 822]);
  W('iC2', [828, 300], [961.2, 300]);
  /* gen. space heater */
  W('not002', [1018.8, 300], [1154.7, 300]);
  W('or003', [1212.3, 300], [1277, 300], [1277, 259.5], [1334, 259.5]);
  W('ffr001', [1414, 238], [1952, 238]);
  W('iA10', [363, 442], [1987, 442]);
  W('iA10', [1098, 442], [1098, 321.5], [1154.7, 321.5]);
  W('iA7', [361, 591], [1987, 591]);
  /* AC exciter space heater */
  W('not007', [1012.8, 822], [1147.2, 822]);
  W('or008', [1204.8, 822], [1271, 822], [1271, 782.5], [1327, 782.5]);
  W('ffr006', [1407, 761], [1946, 761]);
  W('iA9', [357, 963], [1987, 963]);
  W('iA9', [1091, 963], [1091, 843.5], [1147.2, 843.5]);
  W('iA8', [356, 1111], [1987, 1111]);
  t.push(
    [372, 224, '52G OPEN'],
    [370, 406, 'SPACE HEATER FOR GEN.'],
    [370, 427, 'ELECTRICAL TROUBLE'],
    [368, 576, 'SPACE HEATER FOR GEN, ON'],
    [363, 927, 'SPACE HEATER FOR AC EXCITER'],
    [363, 948, 'ELECTRICAL TROUBLE'],
    [362, 1075, 'SPACE HEATER FOR AC EXCITER'],
    [362, 1096, 'ON'],
    [1320, 229, 'T', 1],
    [1313, 750, 'T', 1],
    [230, 1521, 'CONTROLLER:'],
    [390, 1521, 'COMM+MD'],
    [615, 1496, 'TRIGGER  :'],
    [615, 1522, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA729',
    title: 'SPACE HEATER',
    page: 176,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 90, 2228, 1548],
    c: [
      ['iC2', 'in', 'C2', 338, 238, '', ['TCA611']],
      ['iA10', 'in', 'A10', 336, 442, '', ['TCA050']],
      ['iA7', 'in', 'A7', 334, 591, '', ['TCA050']],
      ['iA9', 'in', 'A9', 330, 963, '', ['TCA050']],
      ['iA8', 'in', 'A8', 329, 1111, '', ['TCA050']],
      ['oA1', 'out', 'A1', 1979, 238, '', ['TCA833']],
      ['oA2', 'out', 'A2', 1973, 761, '', ['TCA833']]
    ],
    d: [
      ['crt1', 2022, 442, 'out', 'TCA729_1', 'S', '#1C'],
      ['crt2', 2022, 591, 'out', 'TCA729_2', 'S', '#1C'],
      ['crt3', 2022, 963, 'out', 'TCA729_3', 'S', '#1C'],
      ['crt4', 2022, 1111, 'out', 'TCA729_4', 'S', '#1C']
    ],
    b: [
      ['ffr001', 'FFR', '001', 1374, 248.5, [], { l: ['S', 'R'] }, [80, 43]],
      ['not002', 'NOT', '002', 990, 310.5],
      ['or003', 'OR', '003', 1183.5, 310.5],
      ['ffr006', 'FFR', '006', 1367, 771.5, [], { l: ['S', 'R'] }, [80, 43]],
      ['not007', 'NOT', '007', 984, 832.5],
      ['or008', 'OR', '008', 1176, 832.5],
      ['btr004', 'o:BTR', '004', 1637, 442],
      ['btr005', 'o:BTR', '005', 1636, 591],
      ['btr009', 'o:BTR', '009', 1632, 963],
      ['btr010', 'o:BTR', '010', 1630, 1111]
    ],
    w,
    j: [
      [828, 238],
      [892, 238],
      [828, 300],
      [1098, 442],
      [1091, 963]
    ],
    t
  });
})();
