/* TCE185 LOAD UP RATEE (331DM09784 page 131, controller EHG+MD, cycle 30 ms; the title is spelled so on the drawing). Typed from the
   drawing; units = the pixels of the page rendered 2296 wide. The load up rate (L-RATE A003, LME043: rate 1.0 %/s, M 10, 0 .. 100 %)
   runs on the ATS load up rate (TCA769) while INITIAL with no ATS AUTO(C) or with the transfer region complete; it is switched by
   ATS AUTO(C) off. LOAD UP RATE = its output x 0.025, LOAD DWON RATE = the same through SC007; MAX TURBINE LOAD UP RATE = its output. */
(typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
  id: 'TCE185',
  title: 'LOAD UP RATEE',
  page: 131,
  ctl: 'EHG+MD',
  cycle: 30,
  f: [170, 85, 2222, 1545],
  live: { iTrc: 'xfer' },
  k: [
    ['kInit', 238, 259, 'INITIAL', 'ref'],
    ['kAts', 237, 343, 'ATS AUTO(C)', 'ref']
  ],
  c: [
    ['iTrc', 'in', 'C', 401, 462, 'TRANSFER REGION COMPLETE', ['TCE184']],
    ['iRate', 'in', 'A', 399, 567, 'LOAD UP RATE(ATS)', ['TCA769'], 1],
    ['oA', 'out', 'A', 2097, 261, 'LOAD UP RATE', ['TCE195']],
    ['oB', 'out', 'B', 2096, 371, 'LOAD DWON RATE', ['TCE195']],
    ['oC', 'out', 'C', 2093, 509, 'MAX TURBINE LOAD UP RATE', ['TCE610']]
  ],
  b: [
    ['btr001', 'o:BTR', '001', 659, 258],
    ['btr005', 'o:BTR', '005', 658, 342],
    ['btr008', 'o:BTR', '008', 860, 459],
    ['ftr009', 'o:FTR', '009', 858, 564],
    ['not006', 'NOT', '006', 862, 353],
    ['a002', 'A', '002', 1107, 280, [], {}, [59, 64]],
    ['lrA003', 'L-RATE', 'A003', 1351, 280, ['(LME043)', '^TCE185_1'], { l: ['', 'PER', 'SW', 'TR', ''], r: ['', 'OUT', '', '', ''] }, [88, 106]],
    ['g010', 'G', '010', 1501, 269, ['K:0.025']],
    ['sc007', 'SC', '007', 1732, 379],
    ['ftr004', 'o:FTR', '004', 1736, 258],
    ['ftr011', 'o:FTR', '011', 1736, 506]
  ],
  w: [
    ['kInit', [[473, 258], [1078, 258]]],
    ['kAts', [[472, 342], [833, 342]]],
    ['not006', [[891, 342], [1192, 342], [1192, 280], [1307, 280]]],
    ['not006', [[968, 342], [968, 280], [1078, 280]]],
    ['iTrc', [[428, 459], [1020, 459], [1020, 301], [1078, 301]]],
    ['iRate', [[426, 564], [1244, 564], [1244, 301], [1307, 301]], 1],
    ['a002', [[1136, 258], [1307, 258]]],
    ['lrA003', [[1395, 258], [1472, 258]], 1],
    ['lrA003', [[1437, 258], [1437, 506], [2066, 506]], 1],
    ['g010', [[1530, 258], [2070, 258]], 1],
    ['g010', [[1626, 258], [1626, 368], [1703, 368]], 1],
    ['sc007', [[1761, 368], [2069, 368]], 1]
  ],
  t: [
    [382, 291, '(TCE050)'],
    [380, 366, '(TCE050)'],
    [1155, 380, 'R :1.0%/s'],
    [1155, 401, 'M :10'],
    [1155, 423, 'HL:100.0%'],
    [1155, 444, 'LL:0.0%'],
    [225, 1519, 'CONTROLLER:'],
    [386, 1519, 'EHG+MD'],
    [611, 1495, 'TRIGGER  :'],
    [611, 1522, 'CYCLE(ms):30']
  ]
});
