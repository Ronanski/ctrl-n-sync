/* TCA372 INPUT SIGNAL DIAGNOSTICS(3) (331DM09788 page 73, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of
   the page rendered 2296 wide. Reheat bowl steam pressure (A), (B) and (C), each with its abnormal signal, from the AI DIAG sheet TCA311,
   into one TMR AI DIAGNOSTICS block with its limits (SG); the value out over FTR 003 and 004 to connector A, and to A1 (other controller,
   double line) as the abnormal word line. Each input line runs to its pin over its own step, as in the drawing. Pins ABN, DEV E and ERR
   are left open in the drawing. */
(function () {
  if (typeof window === 'undefined') return;
  const F = [180, 88, 2232, 1552],
    u = (F[2] - F[0]) / 1000,
    MX = 930,
    MY = 167,
    MW = 407,
    MH = 380,
    N = 10,
    pin = i => Math.round(MY + 15 * u + (i + 0.5) * ((MH - 30 * u) / N)),
    LP = ['SIG1', 'ERR1', 'SIG2', 'ERR2', 'SIG3', 'ERR3', 'HL', 'LL', 'DEV', 'SIM'],
    RP = ['OUT', '', 'ABN', '', 'DEV E', '', 'ERR', '', '', ''],
    L = k => pin(LP.indexOf(k)),
    XR = MX + MW,
    b = [],
    c = [],
    w = [],
    t = [];
  /* the six inputs from TCA311: [letter, pin, mark, number, name, x of the step]; the value lines thick, the abnormal lines thin */
  [
    ['A2', 'SIG1', 'FTR', '001', '(A)', 0],
    ['D2', 'ERR1', 'BTR', '006', '(A)', 740],
    ['A3', 'SIG2', 'FTR', '008', '(B)', 762],
    ['D3', 'ERR2', 'BTR', '009', '(B)', 782],
    ['A4', 'SIG3', 'FTR', '010', '(C)', 802],
    ['D4', 'ERR3', 'BTR', '011', '(C)', 822]
  ].forEach(([ch, pn, mk, no, s, sx], i) => {
    const y = pin(0) + 64 * i,
      k = 'i' + i,
      thick = ch[0] === 'A' ? 1 : 0;
    c.push([k, 'in', ch, 302, y, 'REHEAT BOWL STEAM PRESS. ' + s, []]);
    t.push([198, y + 10, '(TCA311)']);
    b.push(['m' + no, 'o:' + mk, no, 677, y]);
    w.push([k, sx ? [[329, y], [sx, y], [sx, L(pn)], [MX, L(pn)]] : [[329, y], [MX, y]], thick]);
  });
  /* the limits and the simulation value: [key, number, line, pin, note, x of the step, FTR mark] */
  [
    ['sg012', 'A012', 594, 'HL', 'K:51.0kg/cm2g', 843, '013'],
    ['sg014', 'A014', 679, 'LL', 'K:-2.5kg/cm2g', 863, '015'],
    ['sg016', 'A016', 764, 'DEV', 'K:10.0kg/cm2g', 884, '017'],
    ['sg018', 'B018', 849, 'SIM', 'K:-10.0kg/cm2g', 905, '019']
  ].forEach(([k, no, y, pn, note, sx, f]) => {
    b.push([k, 'SG', no, 566, y + 10, [note]], ['f' + f, 'o:FTR', f, 674, y]);
    w.push([k, [[595, y], [sx, y], [sx, L(pn)], [MX, L(pn)]], 1]);
  });
  /* the output: the value over FTR 003 and 004, then to A over FTR 005 and, down a step, to A1 over FTR 007 */
  const yo = pin(0),
    y1 = pin(0) + 96,
    XC = 2062;
  w.push(['m.OUT', [[XR, yo], [XC - 27, yo]], 1], ['m.OUT', [[1699, yo], [1699, y1], [XC - 28, y1]], 1]);
  b.push(['f003', 'o:FTR', '003', 1424, yo], ['f004', 'o:FTR', '004', 1636, yo], ['f005', 'o:FTR', '005', 1743, yo], ['f007', 'o:FTR', '007', 1743, y1]);
  c.push(['oA', 'out', 'A', XC, yo, '', ['-']], ['oA1', 'out', 'A1', XC, y1, '', ['-'], 1]);
  t.push(
    [1770, yo - 8, 'REHEAT BOWL STEAM PRESS.'],
    [1770, y1 - 30, 'REHEAT BOWL STEAM PRESS.'],
    [1770, y1 - 8, 'ABNORMAL'],
    [1240, 151, 'nPT-STn002'],
    [228, 1527, 'CONTROLLER:'],
    [388, 1527, 'COMM+MD'],
    [655, 1500, 'TRIGGER  :'],
    [655, 1527, 'CYCLE(ms):100']
  );
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'TCA372',
    title: 'INPUT SIGNAL DIAGNOSTICS(3)',
    page: 73,
    ctl: 'COMM+MD',
    cycle: 100,
    f: F,
    c,
    m: [
      [
        'm',
        'TMR AI DIAGNOSTICS',
        '',
        MX,
        MY,
        MW,
        MH,
        LP,
        RP,
        'A002',
        [
          [1040, 570, '(LMA111)'],
          [1150, 570, '(LMA111A)'],
          [1020, 390, 'TP:1.0'],
          [1020, 411, 'TP:1.0'],
          [1020, 432, 'TP:1.0'],
          [1018, 454, 'DELAY TP:3.0s'],
          [1018, 475, 'DELAY TP:3.0s'],
          [1018, 496, 'DELAY TP:3.0s']
        ]
      ]
    ],
    b,
    w,
    t
  });
})();
