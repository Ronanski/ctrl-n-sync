/* SH-G-8A ALARM FOR GENERATOR PROTECTION (1/2) (Generator Protection / Breaker Logic Diagram 310SD03-743 rev 1, sheet 18). Typed from
   the drawing; units = the pixels of the page rendered 2296 wide and turned 0.0072 rad to level the scan. Each relay of protection
   panel A and the same relay of panel B (from SH-G-5A/5B and SH-G-6A/6B) into one OR gate to the annunciator, and where the drawing
   has it into one OR gate to the sequence of events recorder; the volts/hertz 2nd or 3rd step with the generator breaker open goes to
   the automatic transfer as well. The data link: the relay signals also go from the panels to the TCS; each mark: the signal also goes
   to that panel. */
(function () {
  if (typeof window === 'undefined') return;
  const o = [],
    s = [],
    b = [],
    r = [],
    w = [],
    t = [],
    l = [],
    e = [],
    a = [],
    p = [],
    j = [];
  /* a gate: bar x, centre y, the bar from y1 to y2 */
  const gate = (k, ty, bar, y, y1, y2) => {
    b.push([k, 'G:' + ty, '', bar + 9, y, [], {}, [18, ty === 'OR' ? 18 : 20, 0]]);
    l.push([[bar, y1], [bar, y2]]);
  };
  /* a mark that the signal also goes to a panel: x, top / bottom, words, the lines it crosses (none: a dashed line); the top arrow points right */
  const mark = (x, y1, y2, z1, z2, X) => {
    if (X) {
      const P = [y1, ...X.flatMap(y => [y - 6, y + 6]), y2];
      for (let i = 0; i < P.length; i += 2) l.push([[x, P[i]], [x, P[i + 1]]]);
    } else e.push([[x, y1], [x, y2]]);
    a.push([[x, y1], [x + 17, y1]], [[x, y2], [x - 17, y2]]);
    t.push([x + 20, y1 + 1, z1], [x - 20, y2 + 1, z2, 2]);
  };
  /* the two columns: circle x, words x, OR gate bar, data link x, its mark x, SOE gate bar, SOE mark x, box x, words right end */
  const L = { cx: 265, tx: 285, or: 559, cap: 501, mk: 474, soe: 691, sm: 884, box: 1054, tr: 1029 };
  const R = { cx: 1224, tx: 1241, or: 1516, cap: 1459, mk: 1432, soe: 1637, sm: 1847, box: 2030, tr: 2011 };
  /* an input from another sheet: column, key, number, sheet, words, line, the gate bar it runs to */
  const inp = (C, k, n, sh, z, y, x2) => {
    o.push([C.cx, y, 12]);
    t.push([C.cx, y, n, 4], [C.tx, y - 8, z], [C.tx, y + 12, sh]);
    s.push([k, C.cx - 12, y - 12, C.cx + 12, y + 12]);
    w.push([k, [[C.cx + 12, y], [x2, y]]]);
  };
  /* an output box (ANN, SOE, ATS) at line y, with its words */
  const out = (C, k, x1, y, box, z) => {
    w.push([k, [[x1, y], [C.box, y]]]);
    r.push(['', C.box, y - 9, 33, 18, box]);
    if (z) t.push([C.tr, y - 8, z, 2]);
  };
  /* the data link: the panels send the relays to the TCS too */
  const link = (C, y1, y2, m1, m2) => {
    const c = C.cap;
    p.push([[c - 5, y1 + 6], [c, y1], [c + 5, y1 + 6], [c + 5, y2 - 6], [c, y2], [c - 5, y2 - 6]]);
    l.push([[c, y2], [c, m2]], [[c, m2], [c + 14, m2]]);
    t.push([c + 17, m2 + 4, 'DATA LINK']);
    mark(C.mk, m1, m2, '(TCS)', '(GPP)');
  };
  /* a pair (relay of panel A and of panel B) into an OR gate to the annunciator */
  const pair = (C, k, y1, y2, z) => {
    const y = (y1 + y2) / 2;
    gate(k, 'OR', C.or, y, y1 - 10, y2 + 10);
    out(C, k, C.or + 19, y, 'ANN', z);
  };
  /* an OR gate to the sequence of events recorder: key, bar, the inputs [key, dot x, from line, to line], words on the line */
  const soe = (C, k, bar, I, z, m1, m2) => {
    const Y = I.map(i => i[3]);
    const y = (Y[0] + Y[Y.length - 1]) / 2;
    gate(k, 'OR', bar, y, Y[0] - 10, Y[Y.length - 1] + 10);
    I.forEach(([q, x, ya, yb]) => {
      w.push([q, [[x, ya], [x, yb], [bar, yb]]]);
      j.push([x, ya]);
    });
    out(C, k, bar + 19, y, 'SOE');
    if (z) t.push([bar + 78, y - 8, z]);
    mark(C.sm, m1, m2, 'OTHERS', '(GPP)', [y]);
  };

  /* ---- left column ---- */
  /* volts/hertz 2nd / 3rd step, negative-phase sequence 1st / 2nd step, volts/hertz 1st step */
  inp(L, 'o52', '8', 'SH-G-1A', '52G OPENED', 154, 691);
  inp(L, 'v2a', '7', 'SH-G-5A', '24A "2ND STEP"', 200, 559);
  inp(L, 'v2b', '7', 'SH-G-6A', '24B "2ND STEP"', 233, 559);
  inp(L, 'n1a', '8', 'SH-G-5A', '46A "1ST STEP"', 264, 559);
  inp(L, 'n1b', '8', 'SH-G-6A', '46B "1ST STEP"', 297, 559);
  inp(L, 'v1a', '9', 'SH-G-5A', '24A "1ST STEP"', 330, 559);
  inp(L, 'v1b', '9', 'SH-G-6A', '24B "1ST STEP"', 363, 559);
  link(L, 183, 367, 183, 380);
  gate('ov2', 'OR', 559, 216, 190, 243);
  pair(L, 'on1', 264, 297, '1ST NEGATIVE-PHASE SEQ. (46) OPERATED');
  pair(L, 'ov1', 330, 363, '1ST VOLTS/HERTZ (24) OPERATED');
  inp(L, 'n2a', '14', 'SH-G-5A', '46A "2ND STEP"', 473, 559);
  inp(L, 'n2b', '14', 'SH-G-6A', '46B "2ND STEP"', 505, 559);
  inp(L, 'v3a', '15', 'SH-G-5A', '24A "3RD STEP"', 538, 559);
  inp(L, 'v3b', '15', 'SH-G-6A', '24B "3RD STEP"', 571, 559);
  inp(L, 'c52', '2', 'SH-G-1A', '52G CLOSED', 603, 691);
  link(L, 467, 575, 458, 588);
  pair(L, 'on2', 473, 505, '2ND NEGATIVE-PHASE SEQ. (46) OPERATED');
  gate('ov3', 'OR', 559, 555, 528, 581);
  /* 2nd or 3rd step: with 52G open (to the ANN and the ATS), with 52G closed (to the ANN) */
  gate('ox1', 'OR', 634, 231, 206, 256);
  gate('ox2', 'OR', 634, 538, 512, 565);
  gate('ax1', 'A', 691, 193, 146, 240);
  gate('ax2', 'A', 691, 570, 528, 613);
  w.push(
    ['ov2', [[578, 216], [634, 216]]],
    ['ov2', [[609, 216], [609, 522], [634, 522]]],
    ['ov3', [[578, 555], [634, 555]]],
    ['ov3', [[587, 555], [587, 246], [634, 246]]],
    ['ox1', [[653, 231], [691, 231]]],
    ['ox2', [[653, 538], [691, 538]]],
    ['ax1', [[993, 193], [993, 166], [1054, 166]]]
  );
  j.push([609, 216], [587, 555], [993, 193]);
  out(L, 'ax1', 710, 193, 'ANN');
  r.push(['', 1054, 157, 33, 18, 'ATS']);
  t.push([1055, 149, '(V/F (START-UP))'], [979, 176, '2ND or 3RD VOLTS/HERTZ (24) OPERATED', 2], [979, 188, '(DURING 52G OPEN)', 2]);
  out(L, 'ax2', 710, 570, 'ANN', '2ND or 3RD VOLTS/HERTZ (24) OPERATED');
  soe(
    L,
    'sv',
    691,
    [
      ['v2a', 407, 200, 388],
      ['v2b', 381, 233, 402],
      ['v3b', 379, 571, 416],
      ['v3a', 392, 538, 430]
    ],
    '',
    396,
    424
  );
  soe(
    L,
    'sn2',
    691,
    [
      ['n2a', 418, 473, 627],
      ['n2b', 405, 505, 641]
    ],
    '',
    621,
    647
  );
  /* VT fuse failure, reverse power 1st step */
  inp(L, 'f60a', '10', 'SH-G-5B', '60 FLA "ON"', 682, 559);
  inp(L, 'f60b', '10', 'SH-G-6B', '60 FLB "ON"', 716, 559);
  inp(L, 'p1a', '11', 'SH-G-5A', '32A "1ST STEP"', 748, 559);
  inp(L, 'p1b', '11', 'SH-G-6A', '32B "1ST STEP"', 780, 559);
  link(L, 677, 785, 666, 796);
  pair(L, 'of60', 682, 716, 'VT FUSE FAILURE (60FL) OPERATED');
  pair(L, 'op1', 748, 780, '1ST REVERSE POWER (32) OPERATED');
  /* phase differential */
  inp(L, 'd87a', '12', 'SH-G-5A', '87GA "ON"', 838, 559);
  inp(L, 'd87b', '12', 'SH-G-6A', '87GB "ON"', 870, 559);
  link(L, 834, 876, 823, 888);
  pair(L, 'od87', 838, 870, 'PHASE DIFFERENTIAL OF GENERATOR (87G) OPERATED');
  soe(
    L,
    'sd87',
    691,
    [
      ['d87a', 404, 838, 896],
      ['d87b', 377, 870, 910]
    ],
    '',
    888,
    921
  );
  /* earth fault */
  inp(L, 'e59a', '36', 'SH-G-5A', '59GNA "ON"', 1025, 559);
  inp(L, 'e59b', '36', 'SH-G-6A', '59GNB "ON"', 1063, 559);
  link(L, 1015, 1067, 1008, 1081);
  pair(L, 'oe59', 1025, 1063, 'GEN. EARTH FAULT (59GN) OPERATED');
  soe(
    L,
    'se59',
    691,
    [
      ['e59a', 389, 1025, 1103],
      ['e59b', 376, 1063, 1115]
    ],
    '',
    1092,
    1123
  );
  /* pole slip, high set over current, under frequency 1st step */
  inp(L, 'ps78a', '17', 'SH-G-5B', '78A "ON"', 1165, 559);
  inp(L, 'ps78b', '17', 'SH-G-6B', '78B "ON"', 1198, 559);
  inp(L, 'h50a', '43', 'SH-G-5A', '50A "ON"', 1230, 559);
  inp(L, 'h50b', '43', 'SH-G-6A', '50B "ON"', 1263, 559);
  inp(L, 'u1a', '19', 'SH-G-5B', '81LA "1ST STEP"', 1295, 559);
  inp(L, 'u1b', '19', 'SH-G-6B', '81LB "1ST STEP"', 1328, 559);
  link(L, 1159, 1331, 1151, 1344);
  pair(L, 'ops78', 1165, 1198, 'POLE SLIP (78) OPERATED');
  pair(L, 'oh50', 1230, 1263, 'HIGH SET PHASE OVER CURRENT (50) OPERATED');
  pair(L, 'ou1', 1295, 1328, '1ST UNDER FREQUENCY (81L) OPERATED');
  soe(
    L,
    'sps78',
    691,
    [
      ['ps78a', 412, 1165, 1352],
      ['ps78b', 400, 1198, 1366]
    ],
    '',
    1345,
    1375
  );
  soe(
    L,
    'sh50',
    691,
    [
      ['h50a', 387, 1230, 1402],
      ['h50b', 376, 1263, 1417]
    ],
    '',
    1395,
    1425
  );

  /* ---- right column ---- */
  /* under frequency 2nd step */
  inp(R, 'u2a', '20', 'SH-G-5B', '81LA "2ND STEP"', 175, 1516);
  inp(R, 'u2b', '20', 'SH-G-6B', '81LB "2ND STEP"', 208, 1516);
  link(R, 169, 213, 163, 226);
  pair(R, 'ou2', 175, 208, '2ND UNDER FREQUENCY (81L) OPERATED');
  soe(
    R,
    'su2',
    1637,
    [
      ['u2a', 1364, 175, 233],
      ['u2b', 1338, 208, 248]
    ],
    '',
    224,
    255
  );
  /* over frequency 1st step */
  inp(R, 'o1a', '21', 'SH-G-5B', '81HA "1ST STEP"', 294, 1516);
  inp(R, 'o1b', '21', 'SH-G-6B', '81HB "1ST STEP"', 328, 1516);
  link(R, 290, 334, 279, 346);
  pair(R, 'oo1', 294, 328, '1ST OVER FREQUENCY (81H) OPERATED');
  /* over frequency 2nd step */
  inp(R, 'o2a', '22', 'SH-G-5B', '81HA "2ND STEP"', 398, 1516);
  inp(R, 'o2b', '22', 'SH-G-6B', '81HB "2ND STEP"', 431, 1516);
  link(R, 393, 437, 383, 446);
  pair(R, 'oo2', 398, 431, '2ND OVER FREQUENCY (81H) OPERATED');
  soe(
    R,
    'so2',
    1637,
    [
      ['o2a', 1364, 398, 455],
      ['o2b', 1338, 431, 470]
    ],
    '',
    446,
    478
  );
  /* over voltage 1st / 2nd step */
  inp(R, 'ov1a', '23', 'SH-G-5A', '59A "1ST STEP"', 517, 1516);
  inp(R, 'ov1b', '23', 'SH-G-6A', '59B "1ST STEP"', 549, 1516);
  inp(R, 'ov2a', '24', 'SH-G-5A', '59A "2ND STEP"', 582, 1516);
  inp(R, 'ov2b', '24', 'SH-G-6A', '59B "2ND STEP"', 614, 1516);
  link(R, 513, 619, 501, 629);
  pair(R, 'oov1', 517, 549, '1ST OVER VOLTAGE (59G) OPERATED');
  pair(R, 'oov2', 582, 614, '2ND OVER VOLTAGE (59G) OPERATED');
  soe(
    R,
    'sov2',
    1637,
    [
      ['ov2a', 1362, 582, 648],
      ['ov2b', 1338, 614, 661]
    ],
    '',
    638,
    669
  );
  /* voltage restrained over current */
  inp(R, 'r51a', '25', 'SH-G-5A', '51VA "ON"', 709, 1516);
  inp(R, 'r51b', '25', 'SH-G-6A', '51VB "ON"', 741, 1516);
  link(R, 702, 746, 698, 756);
  pair(R, 'or51', 709, 741, 'VOLTAGE RESTRAINED PHASE OVER CURRENT (51V) OPERATED');
  soe(
    R,
    'sr51',
    1637,
    [
      ['r51a', 1362, 709, 766],
      ['r51b', 1338, 741, 780]
    ],
    '',
    758,
    788
  );
  /* loss of excitation zone 1 / zone 2 */
  inp(R, 'x1a', '26', 'SH-G-5A', '40A ZONE 1 "ON"', 829, 1516);
  inp(R, 'x1b', '26', 'SH-G-6A', '40B ZONE 1 "ON"', 861, 1516);
  inp(R, 'x2a', '27', 'SH-G-5A', '40A ZONE 2 "ON"', 894, 1516);
  inp(R, 'x2b', '27', 'SH-G-6A', '40B ZONE 2 "ON"', 926, 1516);
  link(R, 823, 931, 814, 943);
  pair(R, 'ox1z', 829, 861, 'LOSS OF EXCITATION ZONE-1 (40) OPERATED');
  pair(R, 'ox2z', 894, 926, 'LOSS OF EXCITATION ZONE-2 (40) OPERATED');
  soe(
    R,
    'sx',
    1637,
    [
      ['x1a', 1376, 829, 951],
      ['x1b', 1363, 861, 964],
      ['x2a', 1351, 894, 978],
      ['x2b', 1338, 926, 991]
    ],
    '',
    955,
    985
  );
  /* reverse power 2nd step: the reverse power trip */
  inp(R, 'p2a', '28', 'SH-G-5A', '32A "2ND STEP"', 1034, 1516);
  inp(R, 'p2b', '28', 'SH-G-6A', '32B "2ND STEP"', 1066, 1516);
  link(R, 1028, 1071, 1018, 1083);
  pair(R, 'op2', 1034, 1066, '2ND REVERSE POWER (32) OPERATED');
  soe(
    R,
    'sp2',
    1516,
    [
      ['p2a', 1362, 1034, 1101],
      ['p2b', 1338, 1066, 1133]
    ],
    'REVERSE POWER TRIP',
    1101,
    1133
  );
  /* under voltage */
  inp(R, 'uva', '44', 'SH-G-5A', '27A "ON"', 1180, 1516);
  inp(R, 'uvb', '44', 'SH-G-6A', '27B "ON"', 1213, 1516);
  link(R, 1175, 1217, 1166, 1230);
  pair(R, 'ouv', 1180, 1213, 'UNDER VOLTAGE (27) OPERATED');
  soe(
    R,
    'suv',
    1516,
    [
      ['uva', 1362, 1180, 1256],
      ['uvb', 1337, 1213, 1289]
    ],
    '',
    1256,
    1289
  );
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'G-8A',
    title: 'ALARM FOR GENERATOR PROTECTION (1/2)',
    page: 18,
    dwg: '310SD03-743',
    of: 20,
    f: [208, 130, 2177, 1522],
    fs: 1.2,
    ar: 1,
    o,
    s,
    b,
    r,
    w,
    t,
    l,
    e,
    a,
    p,
    j
  });
})();
