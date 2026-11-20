/* TCE502 SIMULATOR(3) (331DM09784 page 175, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. The CV simulators and the oil pump pressure simulators of the EHG controller, as drawn:
   - Two SIMCV blocks (CV(A) A002, CV(B) A007; LME271, K 20.0, B 0.00 %, TI 2.0 s, 0-100 %): X1 = the POSITION DEMAND (A / B of
     TCE212), X2 = the real POSITION (TCE125 / TCE127), each through its FTR; SW = CV FORCED CLOSE (F of TCE053) through NOT 011, or
     OFF(0), = OR 012. Y1 through LMS (-3 to 103 %) = the POSITION SIM. (A1 / A3), Y2 through LMS (-200 to 200 %) = the SERVO AMP
     OUTPUT SIM. (A2 / A4).
   - PRESS.FLOW SIM.MT1 (LME286, TD 5.0 s) A014 of SG C013 (10.0) and LMS C015 (0-10 kg/cm2g) = MOP(B) DISCHARGE OIL PRESS., B (-);
     A017 of SG C016 (250.0) and LMS C018 (0-250 kg/cm2g) = COP(A) DISCHARGE OIL PRESS., C (-); A020 of SG C019 (250.0) and LMS C021
     = COP(B) DISCHARGE OIL PRESS., D (-).
   The words are the ones of the drawing.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const h = 28.76,
    I = cx => cx - h,
    O = cx => cx + h,
    k = [],
    c = [],
    m = [],
    b = [],
    w = [],
    j = [],
    t = [];
  /* one SIMCV row: top y, left x of the block, x of the in connectors, of the FTRs, of the LMS, of the outputs and of their words */
  const row = (r, top, X, xi, xf, cx, cxo, xw, inLetter, outs, nos, words) => {
    const y1 = top + 31,
      y2 = top + 53,
      yp = top + 94,
      sw = top + 76,
      bend = X + 233,
      [f1, f2, blk, l1, l2] = nos,
      key = 'sim' + r;
    c.push(
      ['iD' + r, 'in', inLetter, xi, y1, '', ['TCE212']],
      ['iP' + r, 'in', 'P', xi, yp, '', [outs[1][1]]],
      ['oY1' + r, 'out', outs[0], cxo, y1, '', outs[1]],
      ['oY2' + r, 'out', outs[2], cxo, y1 + 107, '', ['-']]
    );
    m.push([key, 'SIMCV', '', X, top, 86, 106, ['X1', 'X2', 'SW'], ['Y1', 'Y2'], blk,
      [[X + 4, top + 162, 'K :20.0'], [X + 4, top + 183, 'B :0.00%'], [X + 4, top + 204, 'TI:2.0S'], [X + 4, top + 226, 'HL:100.0%'], [X + 4, top + 247, 'LL:0.0%']],
      [[y1, y2, sw], [y1, y2]]]);
    b.push(
      ['ftr' + f1, 'o:FTR', f1, xf, y1],
      ['ftr' + f2, 'o:FTR', f2, xf, yp],
      ['lms' + l1, 'LMS', l1, cx, y1 + 11, ['HL:103.0%', 'LL:-3.0%']],
      ['lms' + l2, 'LMS', l2, cx, y1 + 118, ['HL:200.0%', 'LL:-200.0%']]
    );
    w.push(
      ['iD' + r, [[xi + 27, y1], [X, y1]], 1],
      ['iP' + r, [[xi + 27, yp], [X - 85, yp], [X - 85, y2], [X, y2]], 1],
      [key + '.Y1', [[X + 86, y1], [I(cx), y1]], 1],
      [key + '.Y2', [[X + 86, y2], [bend, y2], [bend, y1 + 107], [I(cx), y1 + 107]], 1],
      ['lms' + l1, [[O(cx), y1], [cxo - 27, y1]], 1],
      ['lms' + l2, [[O(cx), y1 + 107], [cxo - 27, y1 + 107]], 1]
    );
    t.push(
      [xi + 33, y1 - 6, words[0]],
      [xi + 33, yp - 6, words[1]],
      [xw, y1 - 5, words[2]],
      [xw, y1 + 102, words[3]],
      [X + 43, top + 134, '(LME271)', 1]
    );
  };
  row(0, 150, 1082, 304, 900, 1368, 2082, 1689, 'A', ['A1', ['TCE124', 'TCE125'], 'A2'], ['001', '004', 'A002', 'C003', 'C005'],
    ['CV(A) POSITION DEMAND', 'CV(A) POSITION', 'CV(A) POSITION SIM.', 'CV(A) SERVO AMP OUTPUT SIM.']);
  row(1, 439, 1079, 299, 896, 1365, 2079, 1686, 'B', ['A3', ['TCE126', 'TCE127'], 'A4'], ['006', '009', 'A007', 'C008', 'C010'],
    ['CV(B) POSITION DEMAND', 'CV(B) POSITION', 'CV(B) POSITION SIM.', 'CV(B) SERVO AMP OUTPUT SIM.']);
  /* the forced close */
  k.push(['kOff', 280, 702, 'OFF(0)', 'sys.ref']);
  c.push(['iCvFc', 'in', 'F', 298, 619, '', ['TCE053']]);
  b.push(['not011', 'NOT', '011', 799, 630], ['or012', 'OR', '012', 949, 630]);
  w.push(
    ['iCvFc', [[325, 619], [I(799), 619]]],
    ['not011', [[O(799), 619], [I(949), 619]]],
    ['kOff', [[514, 702], [896, 702], [896, 641], [I(949), 641]]],
    ['or012', [[O(949), 619], [1016, 619], [1016, 226], [1082, 226]]],
    ['or012', [[1016, 515], [1079, 515]]]
  );
  j.push([1016, 515]);
  t.push([334, 614, 'CV FORCED CLOSE']);
  /* the oil pump discharge pressure simulators */
  const pf = (n, sg, sgx, K, blk, bx, top, y, lms, lx, hl, out, ox, w1, w2, lw) => {
    b.push(['sg' + sg, 'SG', sg, sgx, y + 11, ['K:' + K]], ['lms' + lms, 'LMS', lms, lx, y + 11, ['HL:' + hl + 'kg/cm2g', 'LL:0.0kg/cm2g']]);
    m.push(['a' + blk, 'PRESS.FLOW SIM.MT1', '', bx, top, 235, 127, ['SET'], ['OUT'], blk, [], [[y], [y]]]);
    c.push(['o' + out, 'out', out, ox, y, '', ['-']]);
    w.push(
      ['sg' + sg, [[O(sgx), y], [bx, y]], 1],
      ['a' + blk + '.OUT', [[bx + 235, y], [I(lx), y]], 1],
      ['lms' + lms, [[O(lx), y], [ox - 27, y]], 1]
    );
    t.push(
      [sgx + 76, y - 24, w1],
      [sgx + 76, y - 3, 'DISCHARGE OIL PRESS.'],
      [bx + 117, top + 155, '(LME286)', 1],
      [bx + 4, top + 180, 'TD:5.0S'],
      [lw, y - 5, w2]
    );
  };
  pf(0, 'C013', 595, '10.0', 'A014', 904, 768, 800, 'C015', 1363, '10.0', 'B', 2075, 'MOP(B)', 'MOP(B) DISCHARGE OIL PRESS.', 1682);
  pf(1, 'C016', 593, '250.0', 'A017', 902, 981, 1011, 'C018', 1360.5, '250.0', 'C', 2073, 'COP(A)', 'COP(A) DISCHARGE OIL PRESS.', 1680);
  pf(2, 'C019', 591, '250.0', 'A020', 900, 1183, 1215, 'C021', 1357.5, '250.0', 'D', 2071, 'COP(B)', 'COP(B) DISCHARGE OIL PRESS.', 1678);
  t.push(
    [222, 1527, 'CONTROLLER:'],
    [387, 1527, 'EHG+MD'],
    [647, 1502, 'TRIGGER  :'],
    [647, 1527, 'CYCLE(ms):30']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({ id: 'TCE502', title: 'SIMULATOR(3)', page: 175, ctl: 'EHG+MD', cycle: 30, f: [172, 85, 2224, 1542], k, c, m, b, w, j, t });
})();
