/* TCA549 BYPASS RESET (331DM09788 page 119, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. BYPASS RESET (the signal the criteria bypass sheets read) = OR 010 of: the RESET push button of the operator
   station with CRT AVAILABLE (A 002), TURBINE TRIP for 1.0 (TW 014, cleared by INITIAL), or ATS OFF. It also lights the RESET lamp of the
   operator station and goes to a line out; CRT OPE PERM goes to the operator station.
   The words are the ones of the drawing (TW:1.0 without a unit, as printed).
   live: TURBINE TRIP from the engine (tcs.js tcsLiveRead); the engine holds no state of the other signals. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  W('kInit', [536, 165], [828, 165], [828, 697]);
  W('crtIkr', [435, 388], [657, 388]);
  W('crtIys', [434, 517], [633, 517], [633, 410], [657, 410]);
  W('a002', [717, 388], [946, 388]);
  W('kTrip', [532, 708], [796, 708]);
  W('tw014', [856, 708], [888, 708], [888, 410], [946, 410]);
  W('kOff', [531, 814], [920, 814], [920, 431], [946, 431]);
  W('or010', [1006, 388], [1895, 388]);
  W('or010', [1371, 388], [1371, 634], [1966, 634]);
  W('or010', [1371, 560], [1959, 560]);
  W('kPerm', [1486, 166], [1962, 166]);
  t.push(
    [455, 378, 'RESET'],
    [453, 507, 'CRT AVAILABLE'],
    [1755, 156, 'CRT OPE PERM'],
    [1800, 550, 'RESET'],
    [1800, 624, 'RESET'],
    [786, 696, 'T', 2],
    [444, 195, '(TCA100)'],
    [440, 739, '(TCA103)'],
    [452, 852, '(TCA501)'],
    [233, 1522, 'CONTROLLER:'],
    [394, 1522, 'COMM+MD'],
    [627, 1495, 'TRIGGER  :'],
    [627, 1522, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA549',
    title: 'BYPASS RESET',
    page: 119,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    live: { kTrip: 'trip' },
    k: [
      ['kInit', 302, 165, 'INITIAL', 'ref'],
      ['kTrip', 298, 708, 'TURBINE TRIP', 'ref'],
      ['kOff', 297, 814, 'ATS OFF', 'ref'],
      ['kPerm', 1252, 166, 'CRT OPE PERM', 'ref'],
      ['dReset', 1895, 388, 'BYPASS RESET', 'def', 'def']
    ],
    c: [['oA1', 'out', 'A1', 1993, 634, '', ['-'], 1]],
    d: [
      ['crtIkr', 400, 388, 'in', 'TCA549_1_IKR', 'R', '#1C'],
      ['crtIys', 399, 517, 'in', 'TCA549_1_IYS', 'R', '#1C'],
      ['crtIyp', 1997, 166, 'out', 'TCA549_1_IYP', 'S', '#1C'],
      ['crtIir', 1994, 560, 'out', 'TCA549_1_IIR', 'S', '#1C']
    ],
    b: [
      ['btr001', 'o:BTR', '001', 1531, 166],
      ['a002', 'A', '002', 687, 399],
      ['btr004', 'o:BTR', '004', 1528, 560],
      ['btr006', 'o:BTR', '006', 730, 708],
      ['btr008', 'o:BTR', '008', 1529, 388],
      ['btr009', 'o:BTR', '009', 869, 388],
      ['or010', 'OR', '010', 976, 410, [], {}, [60, 65]],
      ['btr011', 'o:BTR', '011', 729, 814],
      ['btr013', 'o:BTR', '013', 1527, 634],
      ['tw014', 'TW', '014', 826, 719, ['TW:1.0']]
    ],
    w,
    j: [
      [1371, 388],
      [1371, 560]
    ],
    t
  });
})();
