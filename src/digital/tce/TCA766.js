/* TCA766 IP LIFE TIME COUNTER (331DM09788 page 193, controller COMM+MD, trigger Trigger-of_LOGIC_2, cycle 60 s). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn:
   - IP LCFI SUMMING TIMING (B of TCA763) through PDF 002 (reset by INITIAL, TCA100) switches ASW 004 between IP LCFI (A of TCA763) and
     0.0 (sys.ref).
   - SUM A005 (HL:999999.9, LL:0.0, reset by INITIAL) adds it up = IP LIFE EXPENDITURE VALUE, A out; through FTR 001 = IP LCFI SUM UP to
     CRT TCA766_A1 and through FTR 003 to A1.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const WT = (key, ...pts) => w.push([key, pts, 1]);
  const HW = 28.76,
    Y = 629;
  W('kInit', [486, 330], [1324, 330], [1324, Y + 11 - 21.5]);
  W('kInit', [919, 330], [919, 461 - 21.5]);
  W('iB', [315, 449], [919 - HW, 449]);
  W('pdf002', [919 + HW, 449], [1026, 449], [1026, Y + 11 - 21.5]);
  WT('iA', [315, Y], [1026 - HW, Y]);
  WT('k0', [484, 1170], [1268, 1170], [1268, Y + 22], [1324 - HW, Y + 22]);
  WT('k0', [970, 1170], [970, Y + 22], [1026 - HW, Y + 22]);
  WT('asw004', [1026 + HW, Y], [1324 - HW, Y]);
  WT('sumA005', [1324 + HW, Y], [2080 - 27, Y]);
  WT('sumA005', [1632, Y], [1632, 424], [1985 - 35, 424]);
  WT('sumA005', [1632, 500], [1984 - 27, 500]);
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA766',
    title: 'IP LIFE TIME COUNTER',
    page: 193,
    ctl: 'COMM+MD',
    cycle: 60000,
    f: [164, 82, 2222, 1548],
    k: [
      ['kInit', 251, 330, 'INITIAL', 'ref'],
      ['k0', 250, 1170, '0.0', 'sys.ref']
    ],
    c: [
      ['iB', 'in', 'B', 288, 449, '', ['TCA763'], 0, 1],
      ['iA', 'in', 'A', 288, Y, '', ['TCA763'], 0, 1],
      ['oA1', 'out', 'A1', 1984, 500, '', ['-'], 1, 0],
      ['oA', 'out', 'A', 2080, Y, '', ['-'], 0, 1]
    ],
    d: [['crtA1', 1985, 424, 'out', 'TCA766_A1', 'S', '#1C']],
    b: [
      ['pdf002', 'PDF', '002', 919, 461],
      ['asw004', 'ASW', '004', 1026, Y + 11],
      ['sumA005', 'SUM', 'A005', 1324, Y + 11, ['HL:999999.9', 'LL:0.0']],
      ['ftr001', 'o:FTR', '001', 1718, 424],
      ['ftr003', 'o:FTR', '003', 1718, 500]
    ],
    w,
    j: [
      [919, 330],
      [970, 1170],
      [1632, Y],
      [1632, 500]
    ],
    t: [
      [386, 368, '(TCA100)', 1],
      [320, 444, 'IP LCFI SUMMING TIMING'],
      [320, 625, 'IP LCFI'],
      [871, 442, 'T'],
      [1277, 623, 'T'],
      [1756, 420, 'IP LCFI SUM UP'],
      [1756, 496, 'IP LCFI SUM UP'],
      [1752, 624, 'IP LIFE EXPENDITURE VALUE'],
      [232, 1530, 'CONTROLLER:'],
      [394, 1530, 'COMM+MD'],
      [617, 1502, 'TRIGGER  :Trigger-of_LOGIC_2'],
      [617, 1528, 'CYCLE(s):60']
    ]
  });
})();
