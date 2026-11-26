/* TCE101 INPUT SIGNAL DIAGNOSTICS(1) (331DM09784 page 69, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page rendered
   2296 wide. The scan of this page is turned a little (its frame is 13 lower at the right than at the left and 26 further left at the bottom than
   at the top); every place is typed as it stands on the page set straight.
   MSV inlet steam pressure (A) and (B): two transmitters (0 - 150 kg/cm2g, 4 - 20 mA) through the analog input card (TCE930-1, TCE930-9) into one
   DUAL INPUT DIAGNOSTICS block. The transmitter is drawn as the crossed circle of the drawing, the card as its mA/V box and the filled triangle of
   the PI/O connection. Pins ERR1 and ERR2 of the block are left open in the drawing. The title block of this page prints PAGE 67; it is page 69 of
   the document. */
(function () {
  if (typeof window === 'undefined') return;
  const F = [182, 84, 2232, 1546],
    u = (F[2] - F[0]) / 1000,
    MX = 1190,
    MY = 294,
    MW = 404,
    MH = 860,
    N = 25,
    pin = i => Math.round(MY + 15 * u + (i + 0.5) * ((MH - 30 * u) / N)),
    row = (o, n) => {
      const a = Array(N).fill('');
      for (const k in o) a[o[k]] = k;
      return a;
    },
    LI = { SIG1: 0, 'I-ERR1': 2, SIG2: 4, 'I-ERR2': 6, HL: 12, LL: 14, DEV: 16, S: 18, M: 20, SIM: 23 },
    RI = { OUT: 0, ABN: 4, QT1: 8, QT2: 10, ERR1: 12, ERR2: 13, ERR: 15, 'DEV E': 18, 'I-ERR': 21 },
    L = k => pin(LI[k]),
    R = k => pin(RI[k]),
    XR = MX + MW,
    two = (x, y, a, b) => [[x, y - 27, a], [x, y - 6, b]],
    r = [],
    b = [],
    c = [],
    d = [],
    w = [],
    t = [],
    l = [],
    tri = [];
  /* the two transmitters: [letter, row, card, x of the line up to the lamp, row of the lamp, row of the connector, marks, x of the marks] */
  [
    ['A', L('SIG1'), 'TCE930-1', 1117, 137, 180, ['015', '016'], 1150],
    ['B', L('SIG2'), 'TCE930-9', 1169, 223, 256, ['017', '018'], 1201]
  ].forEach(([ch, y, card, xu, yl, yc, mk, xm], i) => {
    const k = 't' + ch,
      n = i + 1;
    b.push(['x' + ch, 'X', '', 436, y, [], {}, [21]]);
    l.push([[457, y], [611, y]]);
    r.push([k, 611, y - 12, 54, 24, 'mA/V'], ['pe' + n, 1021, y + 53, 125, 22, 'PI/O error']);
    tri.push([777, y, 9]);
    t.push(
      [344, y - 71, 'MSV INLET'],
      [344, y - 49, 'STEAM PRESS.(' + ch + ')'],
      [284, y + 6, '(PT-MSn901-' + n + ')'],
      [461, y - 6, '0- 150kg/cm2g'],
      [461, y + 26, '4- 20mA'],
      [737, y - 20, '(' + card + ')'],
      [1040, y + 48, '(' + card + ')']
    );
    w.push([k, [[665, y], [MX, y]], 1], [k, [[xu, y], [xu, yl], [1265, yl]], 1], [k, [[xu, yc], [1355, yc]], 1], ['pe' + n, [[1146, y + 64], [MX, y + 64]]]);
    b.push(['f' + mk[0], 'o:FTR', mk[0], xm, yl], ['f' + mk[1], 'o:FTR', mk[1], xm, yc]);
    d.push(['crt' + ch, 1300, yl, 'out', 'nPT-MSn901-' + n + '_PV', 'S', '#1C']);
    c.push(['oB' + n, 'out', 'B' + n, 1382, yc, '', ['TCT202'], 1]);
  });
  /* the limits */
  [
    ['sg004', 'SG', 'A004', 745, 'HL', 'K:153.0kg/cm2g'],
    ['sg005', 'SG', 'A005', 904, 'LL', 'K:-7.5kg/cm2g'],
    ['sg007', 'SG', 'A007', 745, 'DEV', 'K:30.0kg/cm2g'],
    ['sgw012', 'SGW', 'A012', 904, 'S', 'K:1'],
    ['sg010', 'SG', 'A010', 745, 'M', 'K:10000.0']
  ].forEach(([k, ty, no, x, pn, note]) => {
    b.push([k, ty, no, x, L(pn) + 10, [note]]);
    w.push([k, [[x + 29, L(pn)], [MX, L(pn)]], 1]);
  });
  /* the simulation value */
  const YS = 1204,
    SIM = L('SIM');
  b.push(
    ['fg024', 'FG', 'B024', 745, YS + 10],
    ['sg028', 'SG', 'B028', 746, YS + 74, ['K:0.0']],
    ['asw025', 'ASW', '025', 873, YS + 10],
    ['rl026', 'RL', 'B026', 958, YS + 10, ['RI:0.5', 'RD:0.01']],
    ['lg027', 'LG', 'B027', 1044, YS + 10, ['T:10.0S']]
  );
  c.push(['iC', 'in', 'C', 414, YS, 'GENERATOR LOAD', ['TCE500']], ['oE', 'out', 'E', 1226, 1332, '', ['-'], 1]);
  w.push(
    ['kInit', [[622, 1074], [1044, 1074], [1044, YS - 12]]],
    ['kInit', [[958, 1074], [958, YS - 12]]],
    ['kSim', [[622, 1138], [873, 1138], [873, YS - 12]]],
    ['iC', [[441, YS], [716, YS]], 1],
    ['fg024', [[774, YS], [844, YS]], 1],
    ['sg028', [[775, YS + 64], [820, YS + 64], [820, YS + 20], [844, YS + 20]], 1],
    ['asw025', [[902, YS], [929, YS]], 1],
    ['rl026', [[987, YS], [1015, YS]], 1],
    /* out of LG: the short piece ends on the middle of the line from SIM down to connector E, where the drawing has its dot */
    ['lg027', [[1073, YS], [1098, YS]], 1],
    /* the line from the dot down to connector E, and from the dot up to the SIM pin of the macro (typed as one line that started at the
       pin; the reader takes a wire's LAST point as its end, so the SIM pin got no signal: two pieces from the dot, same drawing) */
    ['lg027', [[1098, YS], [1098, SIM], [MX, SIM]], 1],
    ['lg027', [[1098, YS], [1098, 1332], [1199, 1332]], 1]
  );
  /* the outputs */
  const XM = 1722,
    out = (pn, y1, x1, thick) => w.push(['m.' + pn, [[XR, R(pn)], [x1, y1]], thick]);
  out('OUT', R('OUT'), 2025, 1);
  w.push(['m.OUT', [[1647, R('OUT')], [1647, R('OUT') + 64], [2024, R('OUT') + 64]], 1]);
  out('ABN', R('ABN'), 2025);
  c.push(
    ['oA1', 'out', 'A1', 2052, R('OUT'), '', ['TCE201'], 0, 1],
    ['oF1', 'out', 'F1', 2051, R('OUT') + 64, '', ['TCA536'], 1],
    ['oD1', 'out', 'D1', 2052, R('ABN'), '', ['TCE201', 'TCE470'], 0, 1],
    ['oA', 'out', 'A', 2053, R('ERR'), '', ['-']],
    ['oBB', 'out', 'B', 2053, R('DEV E'), '', ['-']],
    ['oC', 'out', 'C', 2053, R('I-ERR'), '', ['-']]
  );
  b.push(['f019', 'o:FTR', '019', XM, R('OUT')], ['f029', 'o:FTR', '029', XM, R('OUT') + 64], ['b003', 'o:BTR', '003', XM, R('ABN')]);
  [['QT1', 1, '020', '021'], ['QT2', 2, '022', '023']].forEach(([pn, n, m1, m2]) => {
    const y = R(pn);
    w.push(['m.' + pn, [[XR, y], [1932, y]]], ['m.' + pn, [[1670, y], [1670, y + 32], [2023, y + 32]]]);
    d.push(['crtq' + n, 1967, y, 'out', 'nPT-MSn901-' + n + 'PVQ', 'S', '#1C']);
    c.push(['oE' + n, 'out', 'E' + n, 2050, y + 32, '', ['-'], 1]);
    b.push(['b' + m1, 'o:BTR', m1, XM, y], ['b' + m2, 'o:BTR', m2, XM, y + 32]);
    t.push([1810, y - 6, 'QUALITY'], [1810, y + 26, 'QUALITY']);
  });
  [['ERR', '006', 'INPUT ERROR'], ['DEV E', '009', 'DEVIATION HIGH'], ['I-ERR', '011', 'I/O ERROR']].forEach(([pn, m, name]) => {
    out(pn, R(pn), 2026);
    b.push(['b' + m, 'o:BTR', m, XM, R(pn)]);
    t.push([1806, R(pn) - 6, name]);
  });
  t.push(
    ...two(1812, R('OUT'), 'MSV INLET', 'STEAM PRESS.'),
    ...two(1812, R('OUT') + 64, 'MSV INLET', 'STEAM PRESS.'),
    ...two(1810, R('ABN'), 'MSV INLET', 'STEAM PRESS. ABN.'),
    [530, 1106, '(TCE050)'],
    [530, 1170, '(TCE052)'],
    /* the tag of the block stands over its right part, as drawn (over its middle it would run into connector B2) */
    [1510, 286, 'nPT-MSn901'],
    [447, YS - 32, 'SIMULATOR'],
    [904, YS - 10, 'T'],
    [990, YS - 10, 'T'],
    [247, 1523, 'CONTROLLER:'],
    [410, 1523, 'EHG+MD'],
    [672, 1500, 'TRIGGER  :'],
    [672, 1527, 'CYCLE(ms):30']
  );
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'TCE101',
    title: 'INPUT SIGNAL DIAGNOSTICS(1)',
    page: 69,
    ctl: 'EHG+MD',
    cycle: 30,
    f: F,
    /* live: the engine's state of the signals named on this sheet (tcs.js tcsLiveRead) */
    live: { iC: ['mw', 'MW'] },
    k: [
      ['kInit', 388, 1074, 'INITIAL', 'ref'],
      ['kSim', 388, 1138, 'SIMULATION USE', 'ref']
    ],
    r,
    l,
    tri,
    c,
    d,
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
          [1300, 1171, '(LME110)'],
          [1413, 1171, '(LME110A)'],
          [1198, 1193, 'K:-0.01'],
          [1198, 1214, 'TP:3.0'],
          [1193, 1236, 'DELAY TP:3.0s'],
          [1193, 1257, 'DELAY TP:3.0s'],
          [1198, 1279, 'K:2']
        ]
      ]
    ],
    b,
    w,
    t
  });
})();
