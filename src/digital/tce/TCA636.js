/* TCA636 TURBINE GLAND SEAL GROUP CONTROL (TE-6,7) (331DM09788 page 160, controller COMM+MD, cycle 100 ms). Typed from the drawing; units =
   the pixels of the page rendered 2296 wide (this page is scanned a little turned: every line is typed straight at its mean place).
   TURBINE GLAND SEAL START GROUP CONTROL IN PROGRESS = FFR 016:
   - set by A 027: the start (OR 003 of the TURBINE GRAND SEAL GROUP START COMMAND or START of the operator station with CRT AVAILABLE,
     A 006) with the steam seal aux feed valve in auto, the steam packing unloading valve in auto, the condenser vacuum break complete and
     the aux. steam temp. condition OK;
   - reset by OR 020: RESET of the operator station with CRT AVAILABLE (A 014), no turbine turning (NOT 021), the start GC related aux not
     in auto (NOT 022), the stop GC related aux in progress, or B2 (TCA637).
   PERMISSIVE (A 028) = the same four conditions without a reset (NOT 019), out to the operator station and to TCT081E.
   The words are the ones of the drawing (GRAND and SART as printed).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  /* CRT OPE PERM to the operator station */
  W('kPerm', [1084, 168], [1426, 168]);
  /* the start: OR 003, A 006; CRT AVAILABLE */
  W('i1', [335, 263], [801, 263]);
  W('crtJys', [385, 346], [661, 346]);
  W('crtIys', [385, 410], [792, 410]);
  W('crtIys', [624, 410], [624, 368], [661, 368]);
  W('crtIys', [624, 410], [624, 985], [644, 985]);
  W('a006', [720, 346], [790, 346], [790, 283], [801, 283]);
  W('or003', [860, 262], [1111, 262]);
  /* the four conditions to A 027 and A 028 */
  W('iC740', [363, 497], [1635, 497], [1635, 650], [2044, 650]);
  W('iC740', [945, 497], [945, 284], [1111, 284]);
  W('iC740', [945, 497], [945, 880], [1105, 880]);
  W('iC741', [363, 581], [1592, 581], [1592, 735], [2044, 735]);
  W('iC741', [988, 581], [988, 305], [1111, 305]);
  W('iC741', [988, 581], [988, 858], [1105, 858]);
  W('iA10', [362, 656], [1031, 656], [1031, 327], [1111, 327]);
  W('iA10', [1031, 656], [1031, 837], [1105, 837]);
  W('iA3', [361, 816], [1105, 816]);
  W('iA3', [1062, 816], [1062, 348], [1111, 348]);
  /* FFR 016 and its reset OR 020 */
  W('a027', [1170, 263], [1237, 263]);
  W('crtSikr', [367, 963], [644, 963]);
  W('a014', [703, 963], [858, 963]);
  W('not021', [702, 1059], [815, 1059], [815, 985], [858, 985]);
  W('not022', [702, 1144], [825, 1144], [825, 1006], [858, 1006]);
  W('iA1b', [347, 1229], [835, 1229], [835, 1028], [858, 1028]);
  W('iB2', [345, 1324], [846, 1324], [846, 1049], [858, 1049]);
  W('iB', [347, 1059], [643, 1059]);
  W('iA1a', [347, 1144], [643, 1144]);
  W('or020', [917, 963], [1220, 963], [1220, 285], [1237, 285]);
  W('or020', [962, 963], [962, 900], [997, 900]);
  W('not019', [1056, 900], [1105, 900]);
  /* the outs */
  W('ffr016', [1318, 263], [2059, 263]);
  W('ffr016', [1714, 263], [1714, 553], [2046, 553]);
  W('ffr016', [1768, 263], [1768, 404], [2058, 404]);
  W('ffr016', [1768, 341], [2050, 341]);
  W('a028', [1164, 816], [2045, 816]);
  W('a028', [1643, 816], [1643, 893], [2053, 893]);
  t.push(
    [340, 232, 'TURBINE GRAND SEAL'],
    [340, 253, 'GROUP START COMMAND'],
    [394, 336, 'START'],
    [394, 400, 'CRT AVAILABLE'],
    [648, 400, 'CRT AVAILABLE'],
    [370, 466, 'STEAM SEAL AUX'],
    [370, 487, 'FEED VALVE IN AUTO'],
    [369, 550, 'STEAM PACKING UNLOADING'],
    [369, 571, 'VALVE IN AUTO'],
    [368, 625, 'CONDENSER VACUUM'],
    [368, 646, 'BREAK COMPLETE'],
    [366, 785, 'AUX. STEAM TEMP.'],
    [366, 806, 'CONDITION OK'],
    [377, 953, 'RESET'],
    [353, 1049, 'TURBINE TURNING'],
    [352, 1113, 'TURBINE GLAND SEAL START'],
    [352, 1134, 'GC RELATED AUX IN AUTO'],
    [352, 1198, 'TURBINE GLAND SEAL STOP'],
    [352, 1219, 'GC RELATED AUX IN PROGRESS'],
    [1274, 158, 'CRT OPE PERM'],
    [1740, 232, 'TURBINE GLAND SEAL START'],
    [1740, 253, 'GROUP CONTROL IN PROGRESS'],
    [1760, 499, 'START COMMAND FROM TURBINE GRAND'],
    [1760, 521, 'SEAL SART GROUP CONTROL'],
    [1760, 597, 'STEAM SEAL AUX'],
    [1760, 618, 'FEED VALVE IN AUTO'],
    [1758, 681, 'STEAM PACKING UNLOADING'],
    [1758, 702, 'VALVE IN AUTO'],
    [1788, 808, 'PERMISSIVE'],
    [1229, 251, 'T', 2],
    [980, 210, '(TCA100)'],
    [230, 1531, 'CONTROLLER:'],
    [391, 1531, 'COMM+MD'],
    [616, 1531, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA636',
    title: 'TURBINE GLAND SEAL GROUP CONTROL (TE-6,7)',
    page: 160,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 93, 2220, 1550],
    k: [['kPerm', 850, 168, 'CRT OPE PERM', 'ref']],
    c: [
      ['i1', 'in', '1', 307, 263, '', ['TCT090'], 1],
      ['iC740', 'in', 'C1', 336, 497, '', ['TCA740']],
      ['iC741', 'in', 'C1', 336, 581, '', ['TCA741']],
      ['iA10', 'in', 'A10', 335, 656, '', ['TCA048']],
      ['iA3', 'in', 'A3', 334, 816, '', ['TCA639']],
      ['iB', 'in', 'B', 320, 1059, '', ['TCA539']],
      ['iA1a', 'in', 'A1', 320, 1144, '', ['TCA639']],
      ['iA1b', 'in', 'A1', 320, 1229, '', ['TCA638']],
      ['iB2', 'in', 'B2', 318, 1324, '', ['TCA637']],
      ['oD', 'out', 'D', 819, 410, '', ['TCA638']],
      ['oA', 'out', 'A', 2086, 263, '', ['TCA637', 'TCA638'], 0, 3],
      ['oA1', 'out', 'A1', 2085, 404, '', ['-'], 1],
      ['oB1', 'out', 'B1', 2073, 553, '', ['TCA680']],
      ['oC1', 'out', 'C1', 2071, 650, '', ['TCA638']],
      ['oC2', 'out', 'C2', 2071, 735, '', ['TCA638']],
      ['oA2', 'out', 'A2', 2080, 893, '', ['TCT081E'], 1]
    ],
    d: [
      ['crtJys', 350, 346, 'in', 'TCA636_1_JYS', 'R', '#1C'],
      ['crtIys', 350, 410, 'in', 'TCA636_1_IYS', 'R', '#1C'],
      ['crtSikr', 332, 963, 'in', 'TCA636_1_SIKR', 'R', '#1C'],
      ['crtIyp', 1461, 168, 'out', 'TCA636_1_IYP', 'S', '#1C'],
      ['crtYirs', 2085, 341, 'out', 'TCA636_1_YIRS', 'S', '#1C'],
      ['crtAbn', 2080, 816, 'out', 'TCA636_1_ABN', 'S', '#1C']
    ],
    b: [
      ['btr001', 'o:BTR', '001', 1226, 168],
      ['or003', 'OR', '003', 831, 273],
      ['btr005', 'o:BTR', '005', 1820, 341],
      ['a006', 'A', '006', 691, 357],
      ['btr009', 'o:BTR', '009', 1820, 404],
      ['btr010', 'o:BTR', '010', 584, 410],
      ['btr013', 'o:BTR', '013', 1707, 893],
      ['a014', 'A', '014', 673, 974],
      ['ffr016', 'FFR', '016', 1277, 274, [], { l: ['S', 'R'] }, [80, 43]],
      ['not019', 'NOT', '019', 1026, 911],
      ['or020', 'OR', '020', 887, 1006, [], {}, [60, 106]],
      ['not021', 'NOT', '021', 672, 1070],
      ['not022', 'NOT', '022', 672, 1155],
      ['btr023', 'o:BTR', '023', 1817, 553],
      ['btr024', 'o:BTR', '024', 1816, 650],
      ['btr025', 'o:BTR', '025', 1815, 735],
      ['btr026', 'o:BTR', '026', 1697, 816],
      ['a027', 'A', '027', 1140, 305, [], {}, [60, 107]],
      ['a028', 'A', '028', 1134, 858, [], {}, [60, 106]]
    ],
    w,
    j: [
      [624, 410],
      [945, 497],
      [988, 581],
      [1031, 656],
      [1062, 816],
      [962, 963],
      [1714, 263],
      [1768, 263],
      [1768, 341],
      [1643, 816]
    ],
    t
  });
})();
