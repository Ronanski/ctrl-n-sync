/* TCA630 HP TURBINE WARMING GROUP CONTROL (TE-1,2) (331DM09788 page 155, controller COMM+MD, cycle 100 ms). Typed from the drawing; units =
   the pixels of the page rendered 2296 wide. HP TURBINE WARMING AUTO CONTROL PROGRESS = FFR 003: set by (HP TURBINE WARMING START COMMAND
   or AUTO of the operator station with CRT AVAILABLE, OR 001 / A 005) with TURBINE TURNING and the HP turbine 1st stage inner wall metal
   temp. (CPL 018, HL 156.0 / LL 151.0 degC) (A 017); reset (OR 016) by the auto control reset condition, the stop push button, or the stop
   group control complete while the progress has not just started (TP A013 300 s inverted, TD A014 10 s, A 011). RESET of the operator
   station with CRT AVAILABLE (A 008) = RESET PB ON. The progress and CRT OPE PERM also go to the operator station.
   The words are the ones of the drawing.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  /* the start: OR 001, A 005, A 017 */
  W('iB581', [311, 163], [843, 163]);
  W('crtIka', [372, 322], [574, 322]);
  W('crtIys', [371, 386], [551, 386]);
  W('crtIys', [551, 386], [551, 344], [574, 344]);
  W('crtIys', [551, 386], [551, 610], [572, 610]);
  W('a005', [634, 322], [798, 322], [798, 185], [843, 185]);
  W('or001', [903, 163], [1003, 163]);
  W('iB539', [309, 451], [938, 451], [938, 185], [1003, 185]);
  w.push([
    'iA1',
    [
      [307, 515],
      [701, 515]
    ],
    1
  ]);
  W('cpl018', [761, 515], [956, 515], [956, 206], [1003, 206]);
  W('a017', [1063, 163], [1227, 163]);
  /* the reset: A 008 (RESET PB ON), OR 016, A 011, TP A013, TD A014 */
  W('crtIkr', [370, 589], [572, 589]);
  W('a008', [632, 589], [901, 589], [901, 548], [2023, 548]);
  W('iC', [306, 716], [932, 716], [932, 590], [988, 590]);
  W('iBs', [305, 791], [953, 791], [953, 611], [988, 611]);
  W('iD', [305, 865], [827, 865]);
  W('a011', [887, 865], [974, 865], [974, 632], [988, 632]);
  W('or016', [1048, 590], [1200, 590], [1200, 185], [1227, 185]);
  W('kInit', [434, 960], [738, 960], [738, 1057]);
  W('kInit', [620, 960], [620, 1057]);
  W('iA', [303, 1067], [590, 1067]);
  W('tpA013', [650, 1067], [708, 1067]);
  W('tdA014', [768, 1067], [801, 1067], [801, 887], [827, 887]);
  /* the progress out */
  W('ffr003', [1307, 163], [2038, 163]);
  W('ffr003', [1746, 163], [1746, 378], [2036, 378]);
  W('ffr003', [1746, 293], [2028, 293]);
  W('kPerm', [1075, 961], [1447, 961]);
  t.push(
    [317, 153, 'HP TURBINE WARMING START COMMAND'],
    [393, 312, 'AUTO'],
    [392, 376, 'CRT AVAILABLE'],
    [315, 441, 'TURBINE TURNING'],
    [313, 484, 'HP TURBINE 1ST STAGE'],
    [313, 505, 'INNER WALL METAL TEMP.'],
    [391, 579, 'RESET'],
    [312, 706, 'HP TURBINE WARMING AUTO CONTROL RESET CONDITION'],
    [311, 781, 'HP TURBINE WARMING STOP PB ON'],
    [311, 855, 'HP TURBINE WARMING STOP GROUP CONTROL COMPLETE'],
    [309, 1036, 'HP TURBINE WARMING'],
    [309, 1057, 'AUTO CONTROL PROGRESS'],
    [1802, 132, 'HP TURBINE WARMING'],
    [1802, 153, 'AUTO CONTROL PROGRESS'],
    [1877, 283, 'PROGRESS'],
    [1876, 368, 'PROGRESS'],
    [1801, 538, 'RESET PB ON'],
    [1308, 951, 'CRT OPE PERM'],
    [693, 503, 'T', 2],
    [1219, 151, 'T', 2],
    [581, 1055, 'T', 2],
    [699, 1055, 'T', 2],
    [303, 996, '(TCA100)'],
    [230, 1522, 'CONTROLLER:'],
    [392, 1522, 'COMM+MD'],
    [616, 1495, 'TRIGGER  :'],
    [616, 1522, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA630',
    title: 'HP TURBINE WARMING GROUP CONTROL (TE-1,2)',
    page: 155,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    k: [
      ['kInit', 200, 960, 'INITIAL', 'ref'],
      ['kPerm', 841, 961, 'CRT OPE PERM', 'ref']
    ],
    c: [
      ['iB581', 'in', 'B', 284, 163, '', ['TCA581']],
      ['iB539', 'in', 'B', 282, 451, '', ['TCA539']],
      ['iA1', 'in', 'A1', 280, 515, '', ['TCA360']],
      ['iC', 'in', 'C', 279, 716, '', ['TCA631']],
      ['iBs', 'in', 'B', 278, 791, '', ['TCA633']],
      ['iD', 'in', 'D', 278, 865, '', ['TCA633']],
      ['iA', 'in', 'A', 276, 1067, '', ['*']],
      ['oA', 'out', 'A', 2065, 163, '', ['*', 'TCA631', 'TCA634']],
      ['oA1', 'out', 'A1', 2063, 378, '', ['-'], 1],
      ['oB', 'out', 'B', 2050, 548, '', ['TCA631']]
    ],
    d: [
      ['crtIka', 337, 322, 'in', 'TCA630_1_IKA', 'R', '#1C'],
      ['crtIys', 336, 386, 'in', 'TCA630_1_IYS', 'R', '#1C'],
      ['crtIkr', 335, 589, 'in', 'TCA630_1_IKR', 'R', '#1C'],
      ['crtIxp', 2063, 293, 'out', 'TCA630_1_IXP', 'S', '#1C'],
      ['crtIyp', 1482, 961, 'out', 'TCA630_1_IYP', 'S', '#1C']
    ],
    b: [
      ['or001', 'OR', '001', 873, 174],
      ['ffr003', 'FFR', '003', 1267, 174, [], { l: ['S', 'R'] }, [80, 43]],
      ['btr004', 'o:BTR', '004', 1829, 293],
      ['a005', 'A', '005', 604, 333],
      ['btr007', 'o:BTR', '007', 1829, 378],
      ['a008', 'A', '008', 602, 600],
      ['a011', 'A', '011', 857, 876],
      ['btr012', 'o:BTR', '012', 1248, 961],
      ['tpA013', 'TP', 'A013', 620, 1078, ['TP:300s']],
      ['tdA014', 'TD', 'A014', 738, 1078, ['TD:10s']],
      ['btr015', 'o:BTR', '015', 1252, 548],
      ['or016', 'OR', '016', 1018, 611, [], {}, [60, 65]],
      ['a017', 'A', '017', 1033, 185, [], {}, [60, 65]],
      ['cpl018', 'CPL', '018', 731, 526, ['HL:156.0degC', 'LL:151.0degC']],
      ['x1', 'X', '', 556, 1067]
    ],
    w,
    j: [
      [551, 386],
      [620, 960],
      [1746, 163],
      [1746, 293]
    ],
    t
  });
})();
