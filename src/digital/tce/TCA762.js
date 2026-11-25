/* TCA762 HP LCFI (331DM09788 page 190, controller COMM+MD, trigger Trigger-of_LOGIC_2, cycle 60 s). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn:
   - THERMAL STRESS (HP SURFACE) (A of TCA754) through FTR 007 and ABS 008; SUB 001 of it minus THRESHOLD SG A005 (K:209.3N/mm2) into
     CMP A002 (HL:0.0N/mm2, LL:-30.0N/mm2), reset by INITIAL (TCA100). Its output through NOT 003 to PDF 004 (also INITIAL) = HP LCFI
     SUMMING TIMING, B out (to TCA765); the same output through TD A006 (TD:60.0s, also INITIAL) switches ASW 009 and ASW 013.
   - ASW 009 (the ABS stress or the line from the 0.0 side) and ASW 013 into HSG 010; HSG 010 into UNT-FG 011 (FG-1(LCFI), LMA010) and,
     through the crossed circle, back to the 0.0 side line; ASW 012, switched by HP LCFI SUMMING TIMING, gives UNT-FG 011 or 0.0 (sys.ref)
     as HP LCFI, A out (to TCA765).
   - The FG-1(LCFI) table Xn / Yn No. 0-19 as printed.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [],
    l = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const WT = (key, ...pts) => w.push([key, pts, 1]);
  const HW = 28.76,
    Y = 597;
  /* INITIAL to CMP, TD and PDF */
  W('kInit', [492, 225], [1482, 225], [1482, 372 - 21.5]);
  W('kInit', [884, 225], [884, 372 - 21.5]);
  W('kInit', [1056, 225], [1056, 488 - 21.5]);
  /* stress in, ABS, SUB, CMP */
  WT('iA', [269, Y], [626.5 - HW, Y]);
  WT('abs008', [626.5 + HW, Y], [1204 - HW, Y]);
  WT('abs008', [690, Y], [690, 361], [755 - HW, 361]);
  WT('sgA005', [444 + HW, 383], [755 - HW, 383]);
  WT('sub001', [755 + HW, 361], [884 - HW, 361]);
  /* the timing: CMP, NOT, PDF; TD */
  W('cmpA002', [884 + HW, 361], [1321 - HW, 361]);
  W('cmpA002', [1001, 361], [1001, 477], [1056 - HW, 477]);
  W('not003', [1321 + HW, 361], [1482 - HW, 361]);
  W('pdf004', [1482 + HW, 361], [2097 - 27, 361]);
  W('pdf004', [1640, 361], [1640, 608 - 21.5]);
  W('tdA006', [1056 + HW, 477], [1204, 477], [1204, 608 - 21.5]);
  W('tdA006', [1140, 477], [1140, 723], [1204, 723], [1204, 766 - 21.5]);
  /* 0.0 side line and the switches */
  WT('k0', [503, 958], [1585, 958], [1585, 619], [1640 - HW, 619]);
  WT('k0', [1108, 958], [1108, 619], [1204 - HW, 619]);
  WT('k0', [1108, 777], [1204 - HW, 777]);
  WT('asw009', [1204 + HW, Y], [1300.5, Y]);
  WT('asw013', [1204 + HW, 755], [1265, 755], [1265, 619], [1300.5, 619]);
  WT('asw013', [1265, 641], [1300.5, 641]);
  WT('hsg010', [1359.5, Y], [1502.5 - 42.5, Y]);
  WT('hsg010', [1405, Y], [1405, 830], [1108, 830], [1108, 755], [1204 - HW, 755]); /* the drawing has no dot where it meets the 0.0 line (TCA763 draws it apart) */
  WT('fg011', [1502.5 + 42.5, Y], [1640 - HW, Y]);
  WT('asw012', [1640 + HW, Y], [2097 - 27, Y]);
  /* the FG-1(LCFI) table */
  const XA = [1637, 1690, 1798, 1903],
    XB = [1913, 1966, 2075, 2181],
    TY = [796, 828, 860, 892, 924, 956, 988, 1020, 1052, 1084, 1116, 1148];
  [XA, XB].forEach(X => {
    TY.forEach(y => l.push([[X[0], y], [X[3], y]]));
    X.forEach(x => l.push([[x, TY[0]], [x, TY[11]]]));
    t.push([X[0] + 11, 818, 'No.'], [X[1] + 30, 818, 'Xn'], [X[2] + 32, 818, 'Yn']);
  });
  const XN = [165, 166, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 300, 340, 380, 420, 460, 500],
    YN = ['0.0001', '0.0001', '0.0001', '0.0002', '0.0004', '0.0006', '0.0010', '0.0016', '0.0025', '0.0037', '0.0055', '0.0078', '0.0108',
      '0.0147', '0.0258', '0.0652', '0.1338', '0.2356', '0.3710', '0.5381'];
  XN.forEach((x, i) => {
    const X = i < 10 ? XA : XB,
      y = TY[(i % 10) + 1] + 22;
    t.push([X[0] + (i < 10 ? 21 : 17), y, String(i)], [X[1] + 12, y, String(x)], [X[2] + 12, y, YN[i]]);
  });
  t.push(
    [380, 272, '(TCA100)', 1],
    [393, 364, 'THRESHOLD'],
    [275, 570, 'THERMAL STRESS'],
    [275, 589, '(HP SURFACE)'],
    [717, 360, '+'],
    [717, 382, '-'],
    [839, 355, 'T'],
    [1009, 472, 'T'],
    [1435, 353, 'T'],
    [1450, 553, 'FG-1(LCFI)'],
    [1467, 651, '(LMA010)', 1],
    ...['K:275', 'K:215', 'FG:PARA-LIST', 'FG:PARA-LIST', 'FG:PARA-LIST'].map((s, i) => [1433, Math.round(680 + 21.3 * i), s]),
    [1637, 788, 'FG-1(LCFI)'],
    [1803, 356, 'HP LCFI SUMMING TIMING'],
    [1802, 591, 'HP LCFI'],
    [243, 1533, 'CONTROLLER:'],
    [403, 1533, 'COMM+MD'],
    [627, 1514, 'TRIGGER  :Trigger-of_LOGIC_2'],
    [627, 1540, 'CYCLE(s):60']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA762',
    title: 'HP LCFI',
    page: 190,
    ctl: 'COMM+MD',
    cycle: 60000,
    f: [173, 84, 2228, 1552],
    k: [
      ['kInit', 259, 225, 'INITIAL', 'ref'],
      ['k0', 270, 958, '0.0', 'sys.ref']
    ],
    c: [
      ['iA', 'in', 'A', 242, Y, '', ['TCA754'], 0, 1],
      ['oB', 'out', 'B', 2097, 361, '', ['TCA765'], 0, 1],
      ['oA', 'out', 'A', 2097, Y, '', ['TCA765'], 0, 1]
    ],
    b: [
      ['ftr007', 'o:FTR', '007', 520, Y],
      ['abs008', 'ABS', '008', 626.5, Y + 11],
      ['sgA005', 'SG', 'A005', 444, 394, ['K:209.3N/mm2']],
      ['sub001', 'SUB', '001', 755, 372],
      ['cmpA002', 'CMP', 'A002', 884, 372, ['HL:0.0N/mm2', 'LL:-30.0N/mm2']],
      ['not003', 'NOT', '003', 1321, 372],
      ['pdf004', 'PDF', '004', 1482, 372],
      ['tdA006', 'TD', 'A006', 1056, 488, ['TD:60.0s']],
      ['asw009', 'ASW', '009', 1204, 608],
      ['asw013', 'ASW', '013', 1204, 766],
      ['hsg010', 'HSG', '010', 1330, 619, [], {}, [59, 64]],
      ['fg011', 'UNT-FG', '011', 1502.5, Y, XN.flatMap((x, i) => ['X' + i + ':' + x, 'Y' + i + ':' + YN[i]]) /* the FG-1(LCFI) table printed on the page, as the block's curve */, { l: ['X'], r: ['Y'] }, [85, 62]],
      ['asw012', 'ASW', '012', 1640, 608],
      ['x', 'X', '', 1288, 830]
    ],
    w,
    j: [
      [884, 225],
      [1056, 225],
      [690, Y],
      [1001, 361],
      [1640, 361],
      [1140, 477],
      [1108, 958],
      [1108, 777],
      [1265, 641],
      [1405, Y]
    ],
    l,
    t
  });
})();
