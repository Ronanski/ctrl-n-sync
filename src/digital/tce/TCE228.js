/* TCE228 CRV TEST(3) (331DM09784 page 152, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide, the scan skew taken out. The same logic as TCE227 for the B side: ICV(B) TEST SIGNAL = OR002 of A001 (RSV(A)
   FULL OPEN and OR005), the CRV(B) TEST PB ON and the ICV(B) FAST ACTING (TEST). OR005 holds itself through A004 (NOT003 of RSV(B)
   FULL OPEN and NOT of OR005's own output) and is set by the CRV(B) TEST PB ON. ICV(B) FAST ACTING (TEST) = A006 of TD A019 (ICV(B)
   FAST ACTING DURING VALVE TEST, TD 1.0 s, reset by INITIAL) and MONT IF NORMAL. ICV(B) POSITION gives CPL C007 TEST POSITION
   (11.0 / 10.0 %), CMP C013 FULL OPEN (98.0 / 97.0 %) and CPL C016 FULL CLOSE (3.0 / 2.0 %). */
(typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
  id: 'TCE228',
  title: 'CRV TEST(3)',
  page: 152,
  ctl: 'EHG+MD',
  cycle: 30,
  f: [175, 85, 2226, 1549],
  k: [
    ['kInit', 290, 217, 'INITIAL', 'ref'],
    ['kMont', 286, 623.5, 'MONT IF NORMAL', 'ref']
  ],
  c: [
    ['iRsvA', 'in', 'D', 305, 285, 'RSV(A) FULL OPEN', ['TCE226']],
    ['iRsvB', 'in', 'A', 305, 369, 'RSV(B) FULL OPEN', ['TCE226']],
    ['iPb', 'in', 'E', 305, 455, 'CRV(B) TEST PB ON', ['TCE226']],
    ['iFast', 'in', 'B', 305, 540, 'ICV(B) FAST ACTING DURING VALVE TEST', ['TCE116']],
    ['iPos', 'in', 'P', 305, 710, 'ICV(B) POSITION', ['TCE131']],
    ['oA', 'out', 'A', 2082, 285, 'ICV(B) TEST SIGNAL', ['TCE214']],
    ['oD', 'out', 'D', 2082, 540, 'ICV(B) FAST ACTING (TEST)', ['TCE501']],
    ['oB1', 'out', 'B1', 2082, 710, 'ICV(B) TEST POSITION', ['TCP1231', 'TCP2231', 'TCP3231'], 1],
    ['oB2', 'out', 'B2', 2082, 786, 'ICV(B) TEST POSITION', ['-'], 1],
    ['oC1', 'out', 'C1', 2082, 860, 'RSV(B) FULL OPEN', ['TCP1231', 'TCP2231', 'TCP3231'], 1],
    ['oC2', 'out', 'C2', 2082, 935, 'RSV(B) FULL OPEN', ['-'], 1],
    ['oA1', 'out', 'A1', 1154, 1029, '', ['-']] /* name (texts) */,
    ['oA2', 'out', 'A2', 1154, 1135, '', ['TCE250']] /* name (texts) */
  ],
  d: [
    ['crtO', 1153, 974, 'out', 'nSV-STn905-B_ZSO', 'S', '#1C'],
    ['crtC', 1153, 1080, 'out', 'nSV-STn905-B_ZSC', 'S', '#1C']
  ],
  b: [
    ['a001', 'A', '001', 1263, 293],
    ['or002', 'OR', '002', 1423, 303, [], {}, [59, 64]],
    ['not003', 'NOT', '003', 783, 377],
    ['x004', 'X', '', 891, 388],
    ['a004', 'A', '004', 944, 377],
    ['or005', 'OR', '005', 1103, 377],
    ['td019', 'TD', 'A019', 837, 548, ['TD:1.0s']],
    ['a006', 'A', '006', 1103, 548],
    ['cpl007', 'CPL', 'C007', 783, 718, ['HL:11.0%', 'LL:10.0%']],
    ['cmp013', 'CMP', 'C013', 783, 983, ['HL:98.0%', 'LL:97.0%']],
    ['cpl016', 'CPL', 'C016', 783, 1089, ['HL:3.0%', 'LL:2.0%']],
    ['btr008', 'o:BTR', '008', 1421, 707],
    ['btr009', 'o:BTR', '009', 1421, 783],
    ['btr011', 'o:BTR', '011', 1421, 857],
    ['btr012', 'o:BTR', '012', 1421, 932],
    ['btr014', 'o:BTR', '014', 900, 972],
    ['btr015', 'o:BTR', '015', 900, 1026],
    ['btr017', 'o:BTR', '017', 900, 1078],
    ['btr018', 'o:BTR', '018', 900, 1132]
  ],
  w: [
    /* ICV(B) TEST SIGNAL */
    ['iRsvA', [[332, 282], [1234, 282]]],
    ['iRsvB', [[332, 366], [754, 366]]],
    ['iRsvB', [[731, 366], [731, 857], [2055, 857]]],
    ['iRsvB', [[1369, 857], [1369, 932], [2055, 932]]],
    ['not003', [[812, 366], [915, 366]]],
    ['a004', [[973, 366], [1074, 366]]],
    ['or005', [[1132, 366], [1211, 366]]],
    ['or005', [[1211, 304], [1211, 429], [868, 429], [868, 388], [915, 388]]],
    ['or005', [[1211, 304], [1234, 304]]],
    ['iPb', [[332, 452], [1350, 452], [1350, 303], [1393.5, 303]]],
    ['iPb', [[1050.5, 452], [1050.5, 388], [1074, 388]]],
    ['a001', [[1292, 282], [1393.5, 282]]],
    ['or002', [[1452.5, 282], [2055, 282]]],
    /* ICV(B) FAST ACTING (TEST) */
    ['kInit', [[525, 216], [837, 216], [837, 527]]],
    ['iFast', [[332, 537], [808, 537]]],
    ['td019', [[866, 537], [1074, 537]]],
    ['kMont', [[521, 622.5], [1050.5, 622.5], [1050.5, 559], [1074, 559]]],
    ['a006', [[1132, 537], [2055, 537]]],
    ['a006', [[1371, 537], [1371, 324], [1393.5, 324]]],
    /* ICV(B) POSITION */
    ['iPos', [[332, 707], [754, 707]], 1],
    ['iPos', [[707, 707], [707, 1078], [754, 1078]], 1],
    ['iPos', [[707, 972], [754, 972]], 1],
    ['cpl007', [[812, 707], [2055, 707]]],
    ['cpl007', [[1369, 707], [1369, 783], [2055, 783]]],
    ['cmp013', [[812, 972], [1129, 972]]],
    ['cmp013', [[857.5, 972], [857.5, 1026], [1127, 1026]]],
    ['cpl016', [[812, 1078], [1129, 1078]]],
    ['cpl016', [[857.5, 1078], [857.5, 1132], [1127, 1132]]]
  ],
  t: [
    [433, 248, '(TCE050)'],
    [430, 654, '(TCE050)'],
    [794, 529, 'T'],
    [740, 699, 'T'],
    [740, 964, 'T'],
    [740, 1070, 'T'],
    [960, 941, 'ICV(B)'],
    [960, 962, 'FULL OPEN'],
    [960, 995, 'ICV(B)'],
    [960, 1016, 'FULL OPEN'],
    [960, 1047, 'ICV(B)'],
    [960, 1068, 'FULL CLOSE'],
    [960, 1101, 'ICV(B)'],
    [960, 1122, 'FULL CLOSE'],
    [244, 1531, 'CONTROLLER:'],
    [403, 1531, 'EHG+MD'],
    [628, 1510, 'TRIGGER  :'],
    [628, 1537, 'CYCLE(ms):30']
  ]
});
