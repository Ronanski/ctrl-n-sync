/* TCA584 LOAD/ACC.RATE SELECTION (331DM09788 page 143, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. The macro block ACC.RATE SELECT (LMA575) takes the rub check rate (100 rpm/min from TCA582), the ATS step 3, the speed
   hold and the start mode (AMB.C, COLD = COLD1 or COLD2, WARM, HOT from TCA500); the inputs the drawing ties to OFF(0) or to SPEED HOLD are typed
   as drawn. It gives the 0 / 120 / 180 / 360 rpm/min selections of the ATS (to TCE160), the speed hold, the load hold and the reset. */
(function () {
  if (typeof window === 'undefined') return;
  const R = Math.round,
    PL = Array.from({ length: 16 }, (_, i) => R(280 + 21.4 * i)) /* RATE1..6, EXECUT, VACUUM, LPEXH., VIB., EXPAN., BEARING, AMB.C, COLD, WARM, HOT */,
    PR = PL.slice(0, 7) /* RATE1..4, SPEED, LOAD, RESET */,
    RX = i => R(767 + 21.4 * (i - 1)) /* where the line to pin i turns up */,
    MX = 1087,
    c = [],
    b = [],
    w = [],
    t = [],
    j = [];
  /* the left side: [source, its y, the pin, the BTR number] (pin 0 runs straight) */
  const L = [
    ['kOff', 280, 0, '001'],
    ['iRub', 333, 1, '004'],
    ['kOff', 385, 2, '006'],
    ['kOff', 439, 3, '009'],
    ['kOff', 493, 4, '011'],
    ['kOff', 547, 5, '013'],
    ['kStep', 611, 6, '015'],
    ['iHold', 675, 7, '017'],
    ['iHold', 728, 8, '018'],
    ['iHold', 781, 9, '019'],
    ['iHold', 834, 10, '020'],
    ['iHold', 897, 11, '021'],
    ['iAmb', 1015, 12, '022'],
    ['or025', 1110, 13, ''],
    ['iWarm', 1280, 14, '028'],
    ['iHot', 1365, 15, '029']
  ];
  L.forEach(([src, y, p, btr]) => {
    if (btr) b.push(['btr' + btr, 'o:BTR', btr, 672, y]);
    const x0 = { kOff: 565, iHold: 563, or025: 698, iRub: 272, kStep: 450, iAmb: 269, iWarm: 269, iHot: 269 }[src];
    w.push([src, p === 0 ? [[x0, y], [MX, y]] : [[x0, y], [RX(p), y], [RX(p), PL[p]], [MX, PL[p]]]]);
  });
  /* OFF(0) and SPEED HOLD run down a line to each of their rows */
  w.push(
    ['kOff', [[452, 280], [565, 280], [565, 547]]],
    ['iHold', [[270, 675], [563, 675], [563, 897]]],
    ['iCold1', [[269, 1110], [638, 1110]]],
    ['iCold2', [[269, 1185], [615, 1185], [615, 1129], [638, 1129]]]
  );
  [385, 439, 493].forEach(y => j.push([565, y]));
  j.push([565, 280]);
  [728, 781, 834].forEach(y => j.push([563, y]));
  j.push([563, 675]);
  b.push(['or025', 'OR', '025', 668, 1119]);
  c.push(
    ['iRub', 'in', 'A2', 245, 333, '100RPM/M(RUB CHECK)', ['TCA582']],
    ['iHold', 'in', 'D', 243, 675, 'SPEED HOLD', ['TCA768']],
    ['iAmb', 'in', 'A', 242, 1015, 'AMB.COLD MODE', ['TCA500']],
    ['iCold1', 'in', 'B', 242, 1110, 'COLD1 MODE', ['TCA500']],
    ['iCold2', 'in', 'C', 242, 1185, 'COLD2 MODE', ['TCA500']],
    ['iWarm', 'in', 'D', 242, 1280, 'WARM MODE', ['TCA500']],
    ['iHot', 'in', 'E', 242, 1365, 'HOT MODE', ['TCA500']]
  );
  /* the right side: [pin, its output, where it turns down (0 = straight), the BTR, connector, y, name, sheets, double] */
  const O = [
    ['RATE1', 0, 0, '003', 'B1', 280, '0RPM/M(ATS)', ['-'], 1],
    ['RATE2', 1, 1599, '005', 'B2', 345, '120RPM/M(ATS)', ['TCE160'], 1],
    ['RATE3', 2, 1589, '008', 'B3', 409, '180RPM/M(ATS)', ['TCE160'], 1],
    ['RATE4', 3, 1578, '010', 'B4', 472, '360RPM/M(ATS)', ['TCE160'], 1],
    ['SPEED', 4, 1565, '012', 'B5', 537, 'SPEED HOLD(ATS)', ['-'], 1],
    ['LOAD', 5, 1449, '014', 'B6', 600, 'LOAD HOLD', ['TCA831'], 0],
    ['RESET', 6, 1415, '016', 'B7', 663, 'RESET(ATS)', ['-'], 1]
  ];
  O.forEach(([pin, p, xd, btr, l, y, name, refs, dbl]) => {
    const s = 'mt1.' + pin;
    b.push(['btr' + btr, 'o:BTR', btr, 1630, y]);
    w.push([s, xd ? [[1322, PR[p]], [xd, PR[p]], [xd, y], [2050, y]] : [[1322, y], [2050, y]]]);
    c.push(['o' + l, 'out', l, 2077, y, '', refs, dbl]);
    t.push([1795, y - 9, name]);
  });
  b.push(['btr007', 'o:BTR', '007', 1385, PR[5]]);
  t.push(
    [350, 641, '(TCA523)'],
    [230, 1528, 'CONTROLLER:'],
    [400, 1528, 'COMM+MD'],
    [620, 1500, 'TRIGGER  :'],
    [620, 1526, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA584',
    title: 'LOAD/ACC.RATE SELECTION',
    page: 143,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    k: [
      ['kOff', 219, 280, 'OFF(0)', 'sys.ref'],
      ['kStep', 217, 611, 'STEP 3 EXECUTING', 'ref']
    ],
    c,
    m: [
      [
        'mt1',
        'ACC.RATE SELECT MT1',
        '',
        MX,
        247,
        235,
        384,
        ['RATE1', 'RATE2', 'RATE3', 'RATE4', 'RATE5', 'RATE6', 'EXECUT', 'VACUUM', 'LPEXH.', 'VIB.', 'EXPAN.', 'BEARING', 'AMB.C', 'COLD', 'WARM', 'HOT'],
        ['RATE1', 'RATE2', 'RATE3', 'RATE4', 'SPEED', 'LOAD', 'RESET'],
        '002',
        [[1168, 655, '(LMA575)']],
        [PL, PR]
      ]
    ],
    b,
    w,
    j,
    t
  });
})();
