/* TCA370 INPUT SIGNAL DIAGNOSTICS(1) (331DM09788 page 71, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. Reheat bowl inner wall metal temperature (A) and (B): the value and the abnormal signal of input (A) and of input (B), each from its AI DIAG sheet, into one
   DUAL INPUT DIAGNOSTICS block with its limits (SG / SGW); the value out to connector A1 and, over it, to F1 (other controller, double
   line); the abnormal signal to D1; input error, deviation high and I/O error to A, B and C. Pins QT1, QT2, ERR1 and ERR2 are left open
   in the drawing. */
(function () {
  if (typeof window === 'undefined') return;
  const F = [180, 88, 2232, 1552],
    u = (F[2] - F[0]) / 1000,
    MX = 1196,
    MY = 292,
    MW = 402,
    MH = 860,
    N = 25,
    pin = i => Math.round(MY + 15 * u + (i + 0.5) * ((MH - 30 * u) / N)),
    row = o => {
      const a = Array(N).fill('');
      for (const k in o) a[o[k]] = k;
      return a;
    },
    LI = { SIG1: 0, 'I-ERR1': 2, SIG2: 4, 'I-ERR2': 6, HL: 12, LL: 14, DEV: 16, S: 18, M: 20, SIM: 23 },
    RI = { OUT: 0, ABN: 4, QT1: 8, QT2: 10, ERR1: 12, ERR2: 13, ERR: 15, 'DEV E': 18, 'I-ERR': 21 },
    L = k => pin(LI[k]),
    R = k => pin(RI[k]),
    XR = MX + MW,
    b = [],
    c = [],
    w = [],
    t = [];
  /* the two inputs: [letter, pin, thick, name, sheet] (value: thick line; abnormal: thin line) */
  [["A1","SIG1",1,"REHEAT BOWL INNER WALL METAL TEMP. (A)","TCA358"],["D1","I-ERR1",0,"REHEAT BOWL INNER WALL METAL TEMP. (A) ABN.","TCA358"],["A1","SIG2",1,"REHEAT BOWL INNER WALL METAL TEMP. (B)","TCA362"],["D1","I-ERR2",0,"REHEAT BOWL INNER WALL METAL TEMP. (B) ABN.","TCA362"]].forEach(([ch, pn, thick, name, sheet], i) => {
    const y = L(pn),
      k = 'i' + i;
    c.push([k, 'in', ch, 516, y, name, []]);
    t.push([375, y + 31, '(' + sheet + ')']);
    w.push([k, [[543, y], [MX, y]], thick]);
  });
  /* the limits and the simulation value: [key, type, number, x, pin, note] */
  [["sg004","SG","A004",745,"HL","K:714desc"],["sg005","SG","A005",904,"LL","K:-35desc"],["sg007","SG","A007",745,"DEV","K:140desc"],["sgw012","SGW","A012",904,"S","K:1"],["sg010","SG","A010",745,"M","K:10000.0"],["sg028","SG","B028",900,"SIM","K:450.0desc"]].forEach(([k, ty, no, x, pn, note]) => {
    b.push([k, ty, no, x, L(pn) + 10, [note]]);
    w.push([k, [[x + 29, L(pn)], [MX, L(pn)]], 1]);
  });
  /* the outputs */
  const XM = 1726,
    XC = 2046;
  w.push(
    ['m.OUT', [[XR, R('OUT')], [XC - 27, R('OUT')]], 1],
    ['m.OUT', [[1647, R('OUT')], [1647, R('OUT') + 64], [XC - 28, R('OUT') + 64]], 1],
    ['m.ABN', [[XR, R('ABN')], [XC - 27, R('ABN')]]]
  );
  c.push(
    ['oA1', 'out', 'A1', XC, R('OUT'), '', []],
    ['oF1', 'out', 'F1', XC, R('OUT') + 64, '', ["-"], 1],
    ['oD1', 'out', 'D1', XC, R('ABN'), '', []]
  );
  b.push(['f019', 'o:FTR', '019', XM, R('OUT')], ['f029', 'o:FTR', '029', XM, R('OUT') + 64], ['b003', 'o:BTR', '003', XM, R('ABN')]);
  /* sheets of A1 and D1 as the drawing prints them: [x, height over the line, words] */
  [[2081,-4,"(TCA500) (TCA531)","OUT"],[2081,12,"(TCA548) (TCA755)","OUT"],[2052,31,"(-)","ABN"]].forEach(([x, dy, z, pn]) => t.push([x, R(pn) + dy, z]));
  [['ERR', '006', 'INPUT ERROR', 'A'], ['DEV E', '009', 'DEVIATION HIGH', 'B'], ['I-ERR', '011', 'I/O ERROR', 'C']].forEach(([pn, m, name, ch]) => {
    w.push(['m.' + pn, [[XR, R(pn)], [XC - 27, R(pn)]]]);
    b.push(['b' + m, 'o:BTR', m, XM, R(pn)]);
    c.push(['o' + ch, 'out', ch, XC, R(pn), '', {"A":["TCA531","TCA750"],"B":["-"],"C":["-"]}[ch], 0, 1]);
    t.push([1812, R(pn) - 6, name]);
  });
  [[-29,"REHEAT BOWL INNER","OUT"],[-8,"WALL METAL TEMP.","OUT"],[35,"REHEAT BOWL INNER","OUT"],[56,"WALL METAL TEMP.","OUT"],[-29,"REHEAT BOWL INNER","ABN"],[-8,"WALL METAL TEMP. ABN.","ABN"]].forEach(([dy, z, pn]) => t.push([1814, R(pn) + dy, z]));
  t.push(
    [1512, 284, 'nTE-STn004'],
    [228, 1527, 'CONTROLLER:'],
    [388, 1527, 'COMM+MD'],
    [655, 1500, 'TRIGGER  :'],
    [655, 1527, 'CYCLE(ms):100']
  );
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'TCA370',
    title: 'INPUT SIGNAL DIAGNOSTICS(1)',
    page: 71,
    ctl: 'COMM+MD',
    cycle: 100,
    f: F,
    c,
    m: [
      [
        'm',
        'DUAL INPUT DIAGNOSTICS',
        '',
        MX,
        MY,
        MW,
        MH,
        row(LI),
        row(RI),
        'A001',
        [
          [1292, 1171, '(LMA110)'],
          [1404, 1171, '(LMA110A)'],
          [1194, 1193, 'K:-0.01'],
          [1194, 1214, 'TP:3.0'],
          [1189, 1236, 'DELAY TP:3.0s'],
          [1189, 1257, 'DELAY TP:3.0s'],
          [1194, 1279, 'K:2']
        ]
      ]
    ],
    b,
    w,
    t
  });
})();
