/* TCA639 TURBINE GLAND SEAL GROUP CONTROL (TE-6,7) (331DM09788 page 163, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide.
   - A 001 = gland steam line drain valve auto, steam seal feed inlet valve auto and gland steam exhauster auto
     = TURBINE GLAND SEAL START GC RELATED AUX IN AUTO (to TCA636).
   - A 002 = the two valves in auto = TURBINE GLAND SEAL STOP GC RELATED AUX IN AUTO (to TCA638).
   - AUX. STEAM TEMP. CONDITION OK (OR 004): ambient cold mode (TCA500) with aux steam temp above CPL 007 (HL 275.0 / LL 270.0 degC),
     or not cold mode (NOT 008) with aux steam temp above CMP 010 (HL 200.0 / LL 195.0 degC, INITIAL on its top). To TCA636 and the
     operator station.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const T = (key, ...pts) => w.push([key, pts, 1]);
  /* auto of the three auxiliaries */
  W('iA8', [360, 261], [1180, 261]);
  W('iC1v', [360, 367], [1047, 367]);
  W('iC1v', [1047, 282.5], [1180, 282.5]);
  W('iC1v', [1047, 282.5], [1047, 602.5], [1186, 602.5]);
  W('iC1e', [359, 463], [1089, 463]);
  W('iC1e', [1089, 304], [1180, 304]);
  W('iC1e', [1089, 304], [1089, 581], [1186, 581]);
  W('a001', [1240, 261], [1990, 261]);
  W('a002', [1246, 581], [1986, 581]);
  /* aux steam temperature condition */
  W('iL', [355, 793], [1163, 793]);
  W('iL', [776, 793], [776, 1090], [840, 1090]);
  T('iA3', [355, 984], [841, 984]);
  T('iA3', [731, 984], [731, 1260], [839, 1260]);
  W('kInit', [435, 1174], [869, 1174], [869, 1249]);
  W('cpl007', [901, 984], [1042, 984], [1042, 814.5], [1163, 814.5]);
  W('not008', [900, 1090], [1160, 1090]);
  W('cmp010', [899, 1260], [1039, 1260], [1039, 1112.5], [1160, 1112.5]);
  W('a003', [1223, 793], [1524, 793]);
  W('a009', [1220, 1090], [1515, 1090], [1515, 816.5], [1524, 816.5]);
  W('or004', [1584, 793], [1984, 793]);
  W('or004', [1637, 793], [1637, 943], [1974, 943]);
  t.push(
    [366, 230, 'TURBINE GLAND STEAM'],
    [366, 251, 'LINE DRAIN VALVE AUTO'],
    [366, 337, 'STEAM SEAL FEED'],
    [366, 358, ' INLET VALVEAUTO'],
    [365, 453, 'GLAND STEAM EXHAUSTER AUTO'],
    [360, 783, 'AMBIENT COLD MODE TEMP'],
    [359, 973, 'AUX. STEAM TEMP'],
    [1626, 233, 'TURBINE GLAND SEAL START'],
    [1626, 254, 'GC RELATED AUX IN AUTO'],
    [1632, 553, 'TURBINE GLAND SEAL STOP'],
    [1632, 574, 'GC RELATED AUX IN AUTO'],
    [1825, 767, 'AUX. STEAM TEMP.'],
    [1825, 788, 'CONDITION OK'],
    [1823, 915, 'AUX. STEAM TEMP.'],
    [1823, 936, 'CONDITION OK'],
    [1915, 300, '(TCA636)', 1],
    [1911, 619, '(TCA638)', 1],
    [1910, 831, '(TCA636)', 1],
    [326, 1214, '(TCA100)', 1],
    [842, 1034, 'HL:275.0degC'],
    [842, 1055, 'LL:270.0degC'],
    [840, 1309, 'HL:200.0degC'],
    [840, 1330, 'LL:195.0degC'],
    [829, 973, 'T', 1],
    [826, 1249, 'T', 1],
    [230, 1526, 'CONTROLLER:'],
    [391, 1526, 'COMM+MD'],
    [614, 1499, 'TRIGGER  :'],
    [614, 1526, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA639',
    /* pr: printed on page 163 beside each block; the drawing above keeps them as text */
    pr: {
      cpl007: ['HL:275.0degC', 'LL:270.0degC'],
      cmp010: ['HL:200.0degC', 'LL:195.0degC']
    },
    title: 'TURBINE GLAND SEAL GROUP CONTROL (TE-6,7)',
    page: 163,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [178, 90, 2232, 1548],
    k: [['kInit', 202, 1174, 'INITIAL', 'ref']],
    c: [
      ['iA8', 'in', 'A8', 333, 261, '', ['TCA051']],
      ['iC1v', 'in', 'C1', 333, 367, '', ['TCA650']],
      ['iC1e', 'in', 'C1', 332, 463, '', ['TCA680']],
      ['iL', 'in', 'L', 328, 793, '', ['TCA500']],
      ['iA3', 'in', 'A3', 328, 984, '', ['TCA316']],
      ['oA1', 'out', 'A1', 2017, 261, '', ['TCA636']],
      ['oA2', 'out', 'A2', 2013, 581, '', ['TCA638']],
      ['oA3', 'out', 'A3', 2011, 793, '', ['TCA636']]
    ],
    d: [['crt1', 2009, 943, 'out', 'TCA639_1', 'S', '#1C']],
    b: [
      ['a001', 'A', '001', 1210, 282.5, [], {}, [60, 64]],
      ['a002', 'A', '002', 1216, 591.5],
      ['a003', 'A', '003', 1193, 803.5],
      ['or004', 'OR', '004', 1554, 803.5],
      ['btr005', 'o:BTR', '005', 1734, 793],
      ['btr006', 'o:BTR', '006', 1732, 943],
      ['cpl007', 'CPL', '007', 871, 994.5],
      ['not008', 'NOT', '008', 870, 1100.5],
      ['a009', 'A', '009', 1190, 1101.5],
      ['cmp010', 'CMP', '010', 869, 1270.5]
    ],
    w,
    j: [
      [1047, 367],
      [1089, 463],
      [776, 793],
      [731, 984],
      [1637, 793]
    ],
    t
  });
})();
