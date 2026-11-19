/* TCE042 DIGITAL INPUT(3) (331DM09784 page 21, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page rendered 2296 wide.
   Inputs 1 ~ 16 of the PI/O table TCE901, drawn in the pattern of the digital input sheets (tce/_lib.js). */
(function () {
  if (typeof window === 'undefined') return;
  const s = window.TCE_LIB.di({
    table: 'TCE901',
    first: 1,
    left: [204, 153],
    right: [1220, 156],
    rows: [
      [['CONTROL OIL PUMP(B)', 'RUNNING'], ['TCE305'], ['-']],
      [['CONTROL OIL PUMP(B)', 'ELECTRICAL TROUBLE'], ['TCE305'], ['-']],
      [['MAIN OIL PUMP(B)', 'RUNNING'], ['TCE300'], ['-']],
      [['MAIN OIL PUMP(B)', 'MOTOR ELECTRICAL TROUBLE'], ['TCE300', 'TCE310'], ['-']],
      [['TURNING GEAR', 'MOTOR JOG PB'], ['TCE350'], ['-']],
      [['TURNING GEAR', 'MOTOR RUNNING'], ['TCE350'], ['-']],
      [['TURNING GEAR MOTOR', 'ELECTRICAL TROUBLE'], ['TCE350'], ['-']],
      [['AUTO SYN', 'START PB'], ['TCE178'], ['-']],
      [['AUTO SYNC', 'REMOTE SELECT'], ['TCE178'], ['-']],
      [['SPARE', ''], ['-'], ['-']],
      [['SPARE', ''], ['-'], ['-']],
      [['SPARE', ''], ['-'], ['-']],
      [['SPARE', ''], ['-'], ['-']],
      [['SPARE', ''], ['-'], ['-']],
      [['SPARE', ''], ['-'], ['-']],
      [['DI P.S. NORMAL (AXR3)', ''], ['TCE469'], ['-']]
    ],
    err: [1344, 1288, 127, 'TCE901-1', 1737, 1978, ['TCE465']]
  });
  s.t.push([230, 1525, 'CONTROLLER:'], [392, 1525, 'EHG+MD'], [615, 1499, 'TRIGGER  :'], [615, 1525, 'CYCLE(ms):30']);
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'TCE042',
    title: 'DIGITAL INPUT(3)',
    page: 21,
    ctl: 'EHG+MD',
    cycle: 30,
    f: [178, 86, 2228, 1543],
    r: s.r,
    g: s.g,
    b: s.b,
    c: s.c,
    d: s.d,
    w: s.w,
    t: s.t
  });
})();
