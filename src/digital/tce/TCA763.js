/* TCA763 IP LCFI (331DM09788 page 191, controller COMM+MD, trigger Trigger-of_LOGIC_2, cycle 60 s). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn (the IP twin of TCA762):
   - THERMAL STRESS (IP SURFACE) (A of TCA758) through FTR 007 and ABS 008; SUB 001 of it minus THRESHOLD SG A005 (K:209.3N/mm2) into
     CMP A002 (HL:0.0N/mm2, LL:-30.0N/mm2), reset by INITIAL (TCA100). Its output through NOT 003 to PDF 004 (also INITIAL) = IP LCFI
     SUMMING TIMING, B out (to TCA766); the same output through TD A006 (TD:60.0s, also INITIAL) switches ASW 009 and ASW 013.
   - ASW 009 (the ABS stress or 0.0) and ASW 013 (HSG 010 back through the crossed circle, or 0.0) into HSG 010; HSG 010 into UNT-FG 011
     (FG-1(LCFI), LMA010); ASW 012, switched by IP LCFI SUMMING TIMING, gives UNT-FG 011 or 0.0 (sys.ref) as IP LCFI, A out (to TCA766).
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
    Y = 597,
    /* block centres */
    xABS = 594,
    xSG = 443,
    xSUB = 743,
    xCMP = 872,
    xNOT = 1342,
    xPDF = 1480,
    xTD = 1043,
    xA9 = 1191,
    xHSG = 1352,
    xFG = 1509.5,
    xA12 = 1640,
    xOut = 2096;
  /* INITIAL to CMP, TD and PDF */
  W('kInit', [491, 224], [xPDF, 224], [xPDF, 372 - 21.5]);
  W('kInit', [xCMP, 224], [xCMP, 372 - 21.5]);
  W('kInit', [xTD, 224], [xTD, 488 - 21.5]);
  /* stress in, ABS, SUB, CMP */
  WT('iA', [267, Y], [xABS - HW, Y]);
  WT('abs008', [xABS + HW, Y], [xA9 - HW, Y]);
  WT('abs008', [658, Y], [658, 361], [xSUB - HW, 361]);
  WT('sgA005', [xSG + HW, 383], [xSUB - HW, 383]);
  WT('sub001', [xSUB + HW, 361], [xCMP - HW, 361]);
  /* the timing: CMP, NOT, PDF; TD */
  W('cmpA002', [xCMP + HW, 361], [xNOT - HW, 361]);
  W('cmpA002', [989, 361], [989, 477], [xTD - HW, 477]);
  W('not003', [xNOT + HW, 361], [xPDF - HW, 361]);
  W('pdf004', [xPDF + HW, 361], [xOut - 27, 361]);
  W('pdf004', [xA12, 361], [xA12, 608 - 21.5]);
  W('tdA006', [xTD + HW, 477], [xA9, 477], [xA9, 608 - 21.5]);
  W('tdA006', [1127, 477], [1127, 723], [xA9, 723], [xA9, 766 - 21.5]);
  /* 0.0 and the switches */
  WT('k0', [499, 958], [1582, 958], [1582, 619], [xA12 - HW, 619]);
  WT('k0', [1094, 958], [1094, 619], [xA9 - HW, 619]);
  WT('k0', [1094, 777], [xA9 - HW, 777]);
  WT('asw009', [xA9 + HW, Y], [xHSG - 29.5, Y]);
  WT('asw013', [xA9 + HW, 755], [1286, 755], [1286, 619], [xHSG - 29.5, 619]);
  WT('asw013', [1286, 641], [xHSG - 29.5, 641]);
  WT('hsg010', [xHSG + 29.5, Y], [xFG - 42.5, Y]);
  WT('hsg010', [1422, Y], [1422, 829], [1126, 829], [1126, 755], [xA9 - HW, 755]);
  WT('fg011', [xFG + 42.5, Y], [xA12 - HW, Y]);
  WT('asw012', [xA12 + HW, Y], [xOut - 27, Y]);
  /* the FG-1(LCFI) table */
  const XA = [1623, 1676, 1783, 1889],
    XB = [1899, 1952, 2061, 2167],
    TY = [830, 862, 894, 926, 958, 990, 1022, 1054, 1086, 1118, 1150, 1182];
  [XA, XB].forEach(X => {
    TY.forEach(y => l.push([[X[0], y], [X[3], y]]));
    X.forEach(x => l.push([[x, TY[0]], [x, TY[11]]]));
    t.push([X[0] + 11, 852, 'No.'], [X[1] + 34, 852, 'Xn'], [X[2] + 34, 852, 'Yn']);
  });
  const XN = [165, 166, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 300, 340, 380, 420, 460, 500],
    YN = ['0.0001', '0.0001', '0.0001', '0.0002', '0.0004', '0.0006', '0.0010', '0.0016', '0.0025', '0.0037', '0.0055', '0.0078', '0.0108',
      '0.0147', '0.0258', '0.0652', '0.1338', '0.2356', '0.3710', '0.5381'];
  XN.forEach((x, i) => {
    const X = i < 10 ? XA : XB,
      y = TY[(i % 10) + 1] + 22;
    t.push([X[0] + (i < 10 ? 22 : 17), y, String(i)], [X[1] + 12, y, String(x)], [X[2] + 12, y, YN[i]]);
  });
  t.push(
    [380, 270, '(TCA100)', 1],
    [393, 362, 'THRESHOLD'],
    [272, 570, 'THERMAL STRESS'],
    [272, 589, '(IP SURFACE)'],
    [705, 359, '+'],
    [705, 381, '-'],
    [826, 355, 'T'],
    [997, 472, 'T'],
    [1434, 354, 'T'],
    [1447, 553, 'FG-1(LCFI)'],
    [1474, 651, '(LMA010)', 1],
    ...['K:275', 'K:215', 'FG:PARA-LIST', 'FG:PARA-LIST', 'FG:PARA-LIST'].map((s, i) => [1441, Math.round(691 + 21.3 * i), s]),
    [1626, 820, 'FG-1(LCFI)'],
    [1801, 357, 'IP LCFI SUMMING TIMING'],
    [1799, 592, 'IP LCFI'],
    [238, 1530, 'CONTROLLER:'],
    [398, 1530, 'COMM+MD'],
    [612, 1512, 'TRIGGER  :Trigger-of_LOGIC_2'],
    [612, 1538, 'CYCLE(s):60']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA763',
    title: 'IP LCFI',
    page: 191,
    ctl: 'COMM+MD',
    cycle: 60000,
    f: [169, 82, 2229, 1549],
    k: [
      ['kInit', 258, 224, 'INITIAL', 'ref'],
      ['k0', 266, 958, '0.0', 'sys.ref']
    ],
    c: [
      ['iA', 'in', 'A', 240, Y, '', ['TCA758'], 0, 1],
      ['oB', 'out', 'B', xOut, 361, '', ['TCA766'], 0, 1],
      ['oA', 'out', 'A', xOut, Y, '', ['TCA766'], 0, 1]
    ],
    b: [
      ['ftr007', 'o:FTR', '007', 463, Y],
      ['abs008', 'ABS', '008', xABS, Y + 11],
      ['sgA005', 'SG', 'A005', xSG, 394, ['K:209.3N/mm2']],
      ['sub001', 'SUB', '001', xSUB, 372],
      ['cmpA002', 'CMP', 'A002', xCMP, 372, ['HL:0.0N/mm2', 'LL:-30.0N/mm2']],
      ['not003', 'NOT', '003', xNOT, 372],
      ['pdf004', 'PDF', '004', xPDF, 372],
      ['tdA006', 'TD', 'A006', xTD, 488, ['TD:60.0s']],
      ['asw009', 'ASW', '009', xA9, 608],
      ['asw013', 'ASW', '013', xA9, 766],
      ['hsg010', 'HSG', '010', xHSG, 619, [], {}, [59, 64]],
      ['fg011', 'UNT-FG', '011', xFG, Y, XN.flatMap((x, i) => ['X' + i + ':' + x, 'Y' + i + ':' + YN[i]]) /* the FG-1(LCFI) table printed on the page, as the block's curve */, { l: ['X'], r: ['Y'] }, [85, 62]],
      ['asw012', 'ASW', '012', xA12, 608],
      ['x', 'X', '', 1306, 829]
    ],
    w,
    j: [
      [xCMP, 224],
      [xTD, 224],
      [658, Y],
      [989, 361],
      [xA12, 361],
      [1127, 477],
      [1094, 958],
      [1094, 777],
      [1286, 641],
      [1422, Y]
    ],
    l,
    t
  });
})();
