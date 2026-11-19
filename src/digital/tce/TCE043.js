/* TCE043 DIGITAL INPUT(4) (331DM09784 page 22, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page rendered 2296 wide.
   Inputs 17 ~ 32 of the PI/O table TCE901, drawn in the pattern of the digital input sheets (tce/_lib.js). */
(function () {
  if (typeof window === 'undefined') return;
  const s = window.TCE_LIB.di({
    table: 'TCE901',
    first: 17,
    left: [197, 155],
    right: [1213, 154],
    rows: [
      [['SPARE', ''], ['-'], ['-']],
      [['SPARE', ''], ['-'], ['-']],
      [['SPARE', ''], ['-'], ['-']],
      [['SPARE', ''], ['-'], ['-']],
      [['SPARE', ''], ['-'], ['-']],
      [['SPARE', ''], ['-'], ['-']],
      [['SPARE', ''], ['-'], ['-']],
      [['SPARE', ''], ['-'], ['-']],
      [['SPARE', ''], ['-'], ['-']],
      [['SPARE', ''], ['-'], ['-']],
      [['COM CPU(A) RUN', ''], ['TCE465'], ['-']],
      [['COM CPU(B) RUN', ''], ['TCE465'], ['-']],
      [['COM P.S.(A) ABNORMAL', ''], ['TCE465'], ['-']],
      [['COM P.S.(B) ABNORMAL', ''], ['TCE465'], ['-']],
      [['PLU OPERATED', ''], ['TCE053', 'TCE095', 'TCE170', 'TCE172', 'TCE182'], ['TCP1220', 'TCP1230', 'TCP2220', 'TCP2230', 'TCP3220', 'TCP3230']],
      [['DI P.S. NORMAL (AXR4)', ''], ['TCE469'], ['-']]
    ],
    err: [1341, 1287, 125, 'TCE901-1', 1731, 1976, ['TCE465']]
  });
  s.t.push([226, 1522, 'CONTROLLER:'], [388, 1522, 'EHG+MD'], [613, 1496, 'TRIGGER  :'], [613, 1522, 'CYCLE(ms):30']);
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'TCE043',
    title: 'DIGITAL INPUT(4)',
    page: 22,
    ctl: 'EHG+MD',
    cycle: 30,
    f: [158, 83, 2220, 1546],
    r: s.r,
    g: s.g,
    b: s.b,
    c: s.c,
    d: s.d,
    w: s.w,
    t: s.t
  });
})();
