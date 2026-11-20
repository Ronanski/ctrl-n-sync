/* TCA700 OIL PURIFIER PUMP (TB-15) (331DM09788 page 170, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels
   of the page rendered 2296 wide. The motor nP-n941 (MOTOR STANDARD B013, LMA580C / D): auto start, auto stop and trip held at OFF(0),
   electrical trouble (A10 of TCA043) and running (A9 of TCA043) in; STS sets and OUT resets FFR 020, whose output is the START COMMAND
   out (A1 to TCA833).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const MX = 1268,
    MR = 1671,
    TOP = 249,
    H = 224,
    P = [0, 1, 2, 3, 4].map(i => TOP + 31 + ((i + 0.5) * (H - 62)) / 5);
  /* in */
  W('kOff', [540, 211], [1066, 211], [1066, P[2]], [MX, P[2]]);
  W('kOff', [1066, P[0]], [MX, P[0]]);
  W('kOff', [1066, P[1]], [MX, P[1]]);
  W('iA10', [365, 457], [1064, 457], [1064, P[3]], [MX, P[3]]);
  W('iA9', [364, 605], [1094, 605], [1094, P[4]], [MX, P[4]]);
  /* out: STS sets and OUT resets the FFR */
  W('mtr.STS', [MR, P[0]], [1738, P[0]]);
  W('mtr.OUT', [MR, P[1]], [1705, P[1]], [1705, P[0] + 21.5], [1738, P[0] + 21.5]);
  W('ffr020', [1818, P[0]], [2103, P[0]]);
  t.push(
    [371, 422, 'OIL PURIFIER PUMP'],
    [371, 444, 'MOTOR ELECTRICAL TROUBLE'],
    [370, 571, 'OIL PURIFIER PUMP'],
    [375, 592, 'RUNNING'],
    [1888, 255, 'OIL PURIFIER PUMP'],
    [1888, 277, 'START COMMAND'],
    [1724, 287, 'T', 1],
    [232, 1516, 'CONTROLLER:'],
    [392, 1516, 'COMM+MD'],
    [617, 1490, 'TRIGGER  :'],
    [617, 1516, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA700',
    title: 'OIL PURIFIER PUMP(TB-15)',
    page: 170,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [168, 83, 2228, 1540],
    k: [['kOff', 307, 211, 'OFF(0)', 'sys.ref']],
    c: [
      ['iA10', 'in', 'A10', 338, 457, '', ['TCA043']],
      ['iA9', 'in', 'A9', 337, 605, '', ['TCA043']],
      ['oA1', 'out', 'A1', 2130, P[0], '', ['TCA833']]
    ],
    m: [
      [
        'mtr',
        'MOTOR STANDARD',
        'nP-n941',
        MX,
        TOP,
        MR - MX,
        H,
        ['ASRT', 'ASTP', 'TRP', 'EF', 'RUN'],
        ['STS', 'OUT', 'RUN', 'STP', 'ABN'],
        'B013',
        [
          [1370, 492, '(LMA580C)'],
          [1487, 492, '(LMA580D)'],
          ...['TD:1.0s', 'TP:3.0s', 'TP:3.0s', 'TP:0.5s'].map((s, i) => [1271, Math.round(515 + 21.3 * i), s])
        ]
      ]
    ],
    b: [
      ['btr014', 'o:BTR', '014', 1173, P[0]],
      ['btr016', 'o:BTR', '016', 1173, P[1]],
      ['btr017', 'o:BTR', '017', 1173, P[2]],
      ['btr018', 'o:BTR', '018', 1173, P[3]],
      ['btr019', 'o:BTR', '019', 1173, P[4]],
      ['ffr020', 'FFR', '020', 1778, P[0] + 10.5, [], { l: ['S', 'R'] }, [80, 43]]
    ],
    w,
    j: [
      [1066, P[0]],
      [1066, P[1]]
    ],
    t
  });
})();
