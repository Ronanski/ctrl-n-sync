/* TCE103 INPUT SIGNAL DIAGNOSTICS(3) (331DM09784 page 71, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The scan of this page is turned a little; every place is typed as it stands on the page set straight, and what stands on one line of
   the drawing has one height here.
   TARGET MW DEMAND from the DCS (analog input 0 - 200 MW / 4 - 20 mA, card TCE930-5) into one AI DIAG.MD block; its simulation value is the
   generator load of TCE500 through a limiter (LIM B004, 0.0 to 200.0 MW). The title block of this page prints PAGE 69; it is page 71 of the
   document. */
(function () {
  if (typeof window === 'undefined') return;
  const y = 213 /* the line of the signal */,
    mx = 1042 /* the left edge of the block */,
    xr = mx + 234,
    yd = y + 109; /* the line of the abnormal signal */
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'TCE103',
    title: 'INPUT SIGNAL DIAGNOSTICS(3)',
    page: 71,
    ctl: 'EHG+MD',
    cycle: 30,
    f: [172, 82, 2224, 1546],
    r: [
      ['ai', 237, y - 27, 268, 54, ''],
      ['mv', 579, y - 12, 53, 24, 'mA/V'],
      ['pe', 629, y + 30, 126, 23, 'PI/O error']
    ],
    l: [[[505, y], [579, y]]],
    tri: [[727, y, 9]],
    c: [
      ['iD', 'in', 'D', 721, y + 97, '', ['TCE500']],
      ['oA1', 'out', 'A1', 2008, y, '', ['TCE195']],
      ['oD1', 'out', 'D1', 2010, yd, '', ['TCE180', 'TCE470']]
    ],
    m: [
      [
        'm',
        'AI DIAG.MD',
        'TCE103_A1',
        mx,
        y - 30,
        234,
        128,
        ['IN', 'ERR', 'SIM'],
        ['OUT', 'ABN'],
        'A002',
        [
          [mx + 80, y + 116, '(LME510)'],
          [mx - 23, y + 145, 'DEF N:3'],
          [mx - 2, y + 166, 'K:1'],
          [mx - 24, y + 188, 'H/L HL:204.0MW'],
          [mx - 2, y + 209, 'LL:-10.0MW'],
          [mx - 24, y + 230, 'DEF TP:0.18S'],
          [mx + 136, y + 145, 'DEV HL:40.0MW'],
          [mx + 156, y + 166, 'LL:-40.0MW'],
          [mx + 136, y + 188, 'DEF TP:0.03S'],
          [mx + 136, y + 209, 'DEF N:3'],
          [mx + 156, y + 230, 'K:1']
        ],
        [[y + 5, y + 27, y + 49], [y + 5, y + 49]]
      ]
    ],
    b: [
      ['lim004', 'LIM', 'B004', 891, y + 118, ['HL:200.0MW', 'LL:0.0MW'], {}, [58, 66]],
      ['f001', 'o:FTR', '001', 892, y],
      ['f003', 'o:FTR', '003', 1722, y],
      ['b005', 'o:BTR', '005', 1722, yd]
    ],
    w: [
      ['mv', [[632, y], [mx, y]], 1],
      ['pe', [[755, y + 41], [1010, y + 41], [1010, y + 22], [mx, y + 22]]],
      ['iD', [[748, y + 97], [862, y + 97]], 1],
      ['lim004', [[920, y + 97], [1019, y + 97], [1019, y + 44], [mx, y + 44]], 1],
      ['m.OUT', [[xr, y], [1981, y]], 1],
      ['m.ABN', [[xr, y + 44], [1668, y + 44], [1668, yd], [1983, yd]]]
    ],
    t: [
      [237, y - 36, '(DCS)'],
      [243, y, 'TARGET MW DEMAND'],
      [237, y + 49, 'AI'],
      [322, y + 49, '0- 200MW / 4- 20mA'],
      [642, y - 20, '(TCE930-5)'],
      [648, y + 25, '(TCE930-5)'],
      [1771, y - 6, 'TARGET MW DEMAND'],
      [1769, yd - 6, 'TARGET MW DEMAND ABN.'],
      [239, 1521, 'CONTROLLER:'],
      [400, 1521, 'EHG+MD'],
      [662, 1497, 'TRIGGER  :'],
      [662, 1524, 'CYCLE(ms):30']
    ]
  });
})();
