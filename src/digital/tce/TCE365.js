/* TCE365 BLOW DOWN VALVE (331DM09784 page 161, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide, the scan skew taken out (x + 0.0183 (y - 800), y - 0.0072 (x - 1100)). The AIR OPERAT VALVE block (LME593) of the
   blow down valve nFV-GSn039: SVE (energize) = OFF(0) or not the blowdown valve close signal (OR 025), SVD = not SVE (NOT 037), FFP =
   OFF(0), RESET = AVAIRABLE and RESET from the operator station (A 027), LTOP / LTCL = the full open / full close positions. The SVE
   of the block, inverted (NOT 038), is the blow down valve close signal (F); LTOP and LTCL go out as A2 and A3. */
(typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
  id: 'TCE365',
  title: 'BLOW DOWN VALVE',
  page: 161,
  ctl: 'EHG+MD',
  cycle: 30,
  f: [174, 85, 2220, 1549],
  k: [['kOff', 278, 259, 'OFF(0)', 'sys.ref']],
  d: [
    ['crtIir', 348, 164, 'in', 'nFV-GSn039_IIR', 'R', '#1C'],
    ['crtKtr', 340, 526, 'in', 'nFV-GSn039_KTR', 'R', '#1C']
  ],
  c: [
    ['cF', 'in', 'F', 262, 612, 'BLOWDOWN VALVE CLOSE SIGNAL', ['TCE207']],
    ['cB', 'in', 'B', 262, 750, 'BLOW DOWN VALVE FULL OPEN POSITION', ['TCE087']],
    ['cA', 'in', 'A', 262, 834, 'FULL CLOSE POSITION', ['TCE087']],
    ['oF', 'out', 'F', 2083, 302, '', ['TCP1300', 'TCP2300', 'TCP3300'], 1],
    ['oA2', 'out', 'A2', 2084, 462, '', ['-']],
    ['oA3', 'out', 'A3', 2084, 578, '', ['-']]
  ],
  m: [
    [
      'vlv',
      'AIR OPERAT VALVE',
      'nFV-GSn039',
      1308,
      253,
      404,
      384,
      ['FFP', 'SVE', '', 'SVD', '', 'RESET', '', 'LTOP', 'LTCL', ''],
      ['SVE', '', '', '', '', 'LTOP', 'LTCL', '', 'ABN', ''],
      'A021',
      [
        [1415, 657, '(LME593)'],
        [1315, 679, 'R :20.0'],
        [1315, 700, 'M :1'],
        [1315, 722, 'HL:100.0'],
        [1315, 743, 'LL:0.0'],
        [1315, 765, 'K:99.0%'],
        [1315, 786, 'TP:5.0s'],
        [1315, 808, 'K:100.0%'],
        [1315, 829, 'TP:10.0'],
        [1315, 851, 'TP:10.0'],
        [1315, 872, 'K:1.0%'],
        [1517, 679, 'TP:5.0s']
      ]
    ]
  ],
  b: [
    ['or025', 'OR', '025', 1105, 345],
    ['not037', 'NOT', '037', 1202, 408],
    ['a027', 'A', '027', 733, 515],
    ['not039', 'NOT', '039', 818, 622],
    ['not038', 'NOT', '038', 1828, 312],
    ['btr036', 'o:BTR', '036', 1253, 302],
    ['btr029', 'o:BTR', '029', 1265, 334],
    ['btr030', 'o:BTR', '030', 1265, 398],
    ['btr031', 'o:BTR', '031', 1265, 462],
    ['btr034', 'o:BTR', '034', 1265, 526],
    ['btr035', 'o:BTR', '035', 1265, 558],
    ['btr028', 'o:BTR', '028', 1742, 302],
    ['btr032', 'o:BTR', '032', 1742, 462],
    ['btr033', 'o:BTR', '033', 1743, 494]
  ],
  w: [
    ['kOff', [[512, 259], [1031, 259], [1031, 334], [1076, 334]]],
    ['kOff', [[1031, 302], [1308, 302]]],
    ['cF', [[289, 612], [789, 612]]],
    ['not039', [[847, 612], [1001, 612], [1001, 355], [1076, 355]]],
    ['or025', [[1134, 334], [1308, 334]]],
    ['or025', [[1159, 334], [1159, 398], [1173, 398]]],
    ['not037', [[1231, 398], [1308, 398]]],
    ['crtIir', [[383, 164], [648, 164], [648, 505], [704, 505]]],
    ['crtKtr', [[375, 526], [704, 526]]],
    ['a027', [[762, 505], [1170, 505], [1170, 462], [1308, 462]]],
    ['cB', [[289, 750], [1075, 750], [1075, 526], [1308, 526]]],
    ['cA', [[289, 834], [1139, 834], [1139, 558], [1308, 558]]],
    ['vlv.SVE', [[1712, 302], [1799, 302]]],
    ['not038', [[1857, 302], [2056, 302]]],
    ['vlv.LTOP', [[1712, 462], [2057, 462]]],
    ['vlv.LTCL', [[1712, 494], [1809, 494], [1809, 578], [2057, 578]]]
  ],
  t: [
    [392, 155, 'AVAIRABLE', 0, 2.05],
    [383, 517, 'RESET', 0, 2.05],
    [295, 803, 'BLOW DOWN VALVE', 0, 2.05],
    [1875, 271, 'BLOW DOWN VALVE', 0, 2.05],
    [1875, 292, 'CLOSE SIGNAL', 0, 2.05],
    [245, 1525, 'CONTROLLER:'],
    [405, 1525, 'EHG+MD'],
    [630, 1500, 'TRIGGER  :'],
    [630, 1525, 'CYCLE(ms):30']
  ]
});
