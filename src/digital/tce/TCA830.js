/* TCA830 COMM DIGITAL OUTPUT(1) (331DM09788 page 234, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. Sixteen digital outputs of the COMM controller (PI/O table TCA980, points 1 to 16): the CRV / CV / MSV secondary drain valve
   open and close commands (TCA610 / 615 / 618 / 625), the steam seal feed inlet valve commands and closed signal (TCA650), the turbine gland steam
   line drain valve commands (TCA637), AMB. COLD MODE TEMP. (TCA500) and MODE JUDGEMENT INSTRUMENT NORMAL; one point is spare.
   MODE JUDGEMENT INSTRUMENT NORMAL = AND 017 of HP TURBINE FIRST STAGE INNER WALL METAL TEMP. ABN (D1, TCA360) through NOT 019 and OR 018 of
   REHEAT BOWL INNER WALL METAL TEMP. (A) ABN. (D1, TCA358) through NOT 020 and (B) ABN. (D1, TCA362) through NOT 021.
   The words are the ones of the drawing.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    k = [],
    b = [],
    r = [],
    g = [],
    l = [],
    w = [],
    t = [],
    j = [];
  /* one output: the connector (or the reference, or a block), BTR, the PI/O mark, the box of the PI/O table with its words and DO under it */
  const row = (col, i, src, name, sheet, btr, no, words, rx, rw, cx0) => {
    const L = col === 0,
      y = Math.round((L ? 156 : 158) + 159.9 * i),
      cx = cx0 || (L ? 338 : 1381) /* connector */,
      bx = L ? 566 : 1606 /* BTR */,
      gx = L ? 676 : 1718 /* PI/O mark */,
      two = words.length > 1,
      key = src === 'and017' ? 'and017' : (L ? 'l' : 'r') + (i + 1);
    let x0 = cx + 27;
    if (src === 'OFF(0)') {
      k.push([key, cx - 84, y, 'OFF(0)', 'sys.ref']);
      x0 = cx + 150;
    } else if (src === 'and017') x0 = 1560;
    else c.push([key, 'in', src, cx, y, name, [sheet]]);
    b.push(['btr' + btr, 'o:BTR', btr, bx, y]);
    g.push([gx, y, 'r']);
    w.push(
      [
        key,
        [
          [x0, y],
          [gx - 7, y]
        ]
      ],
      [
        key,
        [
          [gx + 7, y],
          [rx, y]
        ],
        1
      ]
    );
    r.push(['', rx, y - (two ? 28 : 17), rw, two ? 53 : 33, '']);
    l.push([
      [rx + 21, y - (two ? 28 : 17)],
      [rx + 21, y + (two ? 25 : 16)]
    ]);
    words.forEach((s, n) => t.push([rx + 27, y + (two ? -3 + 22 * n : 8), s]));
    t.push([rx + rw - 15, y + (two ? 46 : 36), 'DO'], [gx - 69, y - 19, '(TCA980-' + no + ')', 0, 1.7]);
  };
  [
    ['A2', 'TCA625', '001', ['CRV (A) BELOW SEAT SECONDAR', 'Y DRAIN VALVE CLOSE COMMAND']],
    ['A1', 'TCA625', '003', ['CRV (A) BELOW SEAT SECONDARY', 'DRAIN VALVE OPEN COMMAND']],
    ['A1', 'TCA615', '005', ['CV (A) ABOVE SEAT SECONDARY', 'DRAIN VALVE OPEN COMMAND']],
    ['A2', 'TCA615', '007', ['CV (A) ABOVE SEAT SECONDARY', 'DRAIN VALVE CLOSE COMMAND']],
    ['A2', 'TCA618', '009', ['CV (B) BEL SEAT SEC WARMING', 'DRAIN VALVE CLOSE COMMAND']],
    ['A1', 'TCA618', '011', ['CV (B) BEL SEAT SEC WARMING', 'DRAIN VALVE OPEN COMMAND']],
    ['A1', 'TCA610', '013', ['MSV (A) ABOVE SEAT SECONDARY', 'DRAIN VALVE OPEN COMMAND']],
    ['A2', 'TCA610', '015', ['MSV (A) ABOVE SEAT SECONDARY', 'DRAIN VALVE CLOSE COMMAND']]
  ].forEach(([src, sheet, btr, words], i) => row(0, i, src, '', sheet, btr, 1 + i, words, 760, 350));
  [
    ['A2', '', 'TCA650', '002', ['STEAM SEAL FEED INLET', 'VALVE CLOSE COMMAND'], 1836, 286],
    ['A1', '', 'TCA650', '004', ['STEAM SEAL FEED INLET', 'VALVE OPEN COMMAND'], 1834, 288],
    ['A1', '', 'TCA637', '006', ['TURBINE GLAND STEAM LINE', 'DRAIN VALVE OPEN COMMAND'], 1800, 352],
    ['A2', '', 'TCA637', '008', ['TURBINE GLAND STEAM LINE', 'DRAIN VALVE CLOSE COMMAND'], 1798, 352],
    ['B2', '', 'TCA650', '010', ['STEAM SEAL FEED INLET', 'VALVE CLOSED'], 1818, 287],
    ['OFF(0)', '', '', '012', ['(SPARE)'], 1827, 288, 1369],
    ['L', 'AMB. COLD MODE TEMP.', 'TCA500', '014', ['AMB. COLD MODE TEMP.'], 1826, 286, 1236],
    ['and017', '', '', '016', ['MODE JUDGEMENT', 'INSTRUMENT NORMAL'], 1834, 352]
  ].forEach(([src, name, sheet, btr, words, rx, rw, cx0], i) => row(1, i, src, name, sheet, btr, 9 + i, words, rx, rw, cx0));
  /* MODE JUDGEMENT INSTRUMENT NORMAL */
  c.push(['iHp', 'in', 'D1', 1193, 1215, '', ['TCA360']], ['iRhA', 'in', 'D1', 1202, 1300, '', ['TCA358']], ['iRhB', 'in', 'D1', 1201, 1417, '', ['TCA362']]);
  b.push(
    ['not019', 'NOT', '019', 1426, 1219],
    ['not020', 'NOT', '020', 1361, 1304],
    ['not021', 'NOT', '021', 1360, 1421],
    ['or018', 'OR', '018', 1446, 1310.5],
    ['and017', 'AND', '017', 1531, 1288.5]
  );
  w.push(
    ['iHp', [[1220, 1215], [1397, 1215]]],
    ['not019', [[1455, 1215], [1492, 1215], [1492, 1277], [1503, 1277]]],
    ['iRhA', [[1229, 1300], [1332, 1300]]],
    ['not020', [[1390, 1300], [1417, 1300]]],
    ['iRhB', [[1228, 1417], [1331, 1417]]],
    ['not021', [[1389, 1417], [1405, 1417], [1405, 1321], [1417, 1321]]],
    ['or018', [[1475, 1300], [1503, 1300]]]
  );
  t.push(
    [1256, 1148, 'HP TURBINE FIRST STAGE'],
    [1256, 1170, 'INNER WALL METAL TEMP. ABN'],
    [1224, 1254, 'REHEAT BOWL INNER WALL'],
    [1224, 1276, 'METAL TEMP. (A) ABN.'],
    [1202, 1361, 'REHEAT BOWL INNER WALL'],
    [1202, 1383, 'METAL TEMP. (B) ABN.']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA830',
    title: 'COMM DIGITAL OUTPUT(1)',
    page: 234,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [158, 80, 2226, 1544],
    k,
    c,
    b,
    r,
    g,
    l,
    w,
    j,
    t: [
      ...t,
      [227, 1520, 'CONTROLLER:'],
      [388, 1520, 'COMM+MD'],
      [613, 1499, 'TRIGGER  :'],
      [613, 1526, 'CYCLE(ms):100']
    ]
  });
})();
