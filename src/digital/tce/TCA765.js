/* TCA765 HP LIFE TIME COUNTER (331DM09788 page 192, controller COMM+MD, trigger Trigger-of_LOGIC_2, cycle 60 s). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn:
   - HP LCFI SUMMING TIMING (B of TCA762) through PDF 002 (reset by INITIAL, TCA100) switches ASW 004 between HP LCFI (A of TCA762) and
     0.0 (sys.ref).
   - SUM A005 (HL:999999.9, LL:0.0, reset by INITIAL) adds it up = HP LIFE EXPENDITURE VALUE, A out; through FTR 001 = HP LCFI SUM UP to
     CRT TCA765_A1 and through FTR 003 to A1.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const WT = (key, ...pts) => w.push([key, pts, 1]);
  const HW = 28.76,
    Y = 630;
  W('kInit', [489, 332], [1327, 332], [1327, Y + 11 - 21.5]);
  W('kInit', [924, 332], [924, 459 - 21.5]);
  W('iB', [309, 448], [924 - HW, 448]);
  W('pdf002', [924 + HW, 448], [1029, 448], [1029, Y + 11 - 21.5]);
  WT('iA', [309, Y], [1029 - HW, Y]);
  WT('k0', [488, 1171], [1272, 1171], [1272, Y + 22], [1327 - HW, Y + 22]);
  WT('k0', [975, 1171], [975, Y + 22], [1029 - HW, Y + 22]);
  WT('asw004', [1029 + HW, Y], [1327 - HW, Y]);
  WT('sumA005', [1327 + HW, Y], [2082 - 27, Y]);
  WT('sumA005', [1688, Y], [1688, 426], [2017 - 35, 426]);
  WT('sumA005', [1688, 500], [2014 - 27, 500]);
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA765',
    title: 'HP LIFE TIME COUNTER',
    page: 192,
    ctl: 'COMM+MD',
    cycle: 60000,
    f: [170, 84, 2227, 1550],
    k: [
      ['kInit', 256, 332, 'INITIAL', 'ref'],
      ['k0', 254, 1171, '0.0', 'sys.ref']
    ],
    c: [
      ['iB', 'in', 'B', 282, 448, '', ['TCA762'], 0, 1],
      ['iA', 'in', 'A', 282, Y, '', ['TCA762'], 0, 1],
      ['oA1', 'out', 'A1', 2014, 500, '', ['-'], 1, 0],
      ['oA', 'out', 'A', 2082, Y, '', ['-'], 0, 1]
    ],
    d: [['crtA1', 2017, 426, 'out', 'TCA765_A1', 'S', '#1C']],
    b: [
      ['pdf002', 'PDF', '002', 924, 459],
      ['asw004', 'ASW', '004', 1029, Y + 11],
      ['sumA005', 'SUM', 'A005', 1327, Y + 11, ['HL:999999.9', 'LL:0.0']],
      ['ftr001', 'o:FTR', '001', 1742, 426],
      ['ftr003', 'o:FTR', '003', 1742, 500]
    ],
    w,
    j: [
      [924, 332],
      [975, 1171],
      [1688, Y],
      [1688, 500]
    ],
    t: [
      [390, 370, '(TCA100)', 1],
      [312, 444, 'HP LCFI SUMMING TIMING'],
      [312, 626, 'HP LCFI'],
      [876, 441, 'T'],
      [1283, 624, 'T'],
      [1780, 422, 'HP LCFI SUM UP'],
      [1780, 496, 'HP LCFI SUM UP'],
      [1778, 625, 'HP LIFE EXPENDITURE VALUE'],
      [236, 1531, 'CONTROLLER:'],
      [397, 1531, 'COMM+MD'],
      [620, 1503, 'TRIGGER  :Trigger-of_LOGIC_2'],
      [620, 1529, 'CYCLE(s):60']
    ]
  });
})();
