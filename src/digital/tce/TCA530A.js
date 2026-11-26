/* TCA530A CRITERIA CONDITION (331DM09788 page 100, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. CRI 1.40 GENERATOR TEMPERATURE = NOT 005 of OR 004 of:
   - any generator stator coil temp. (A) .. (F) high (CMP 002, 007, 009, 012, 014, 016, HL 123 / LL 121 degC; OR 003);
   - any generator cooling gas air cooler outlet temp. (A) .. (D) high (CMP 018, 021, 023, 025, HL 50 / LL 48 degC) or the AC exciter
     outlet air temp. high (CMP 027, HL 95 / LL 93 degC) (OR 019);
   - GEN. WATER AND OIL LEAKAGE LEVEL HIGH.
   Each high also lights a lamp of the operator station (CRT TCA530A_1 .. _12). INITIAL clears the first and the last CMP only (002 and
   027), as drawn.
   The words are the ones of the drawing (degc as printed).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    d = [],
    b = [],
    w = [],
    j = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  /* one temperature: [letter, sheet, y of the line, words, CMP, HL, LL, BTR, x of the riser to its OR (0 = straight), y at the OR] */
  [
    ['A4', 'TCA440', 224, ['GEN. STATOR COIL TEMP.(A)'], '002', 123, 121, '001', 0, 224],
    ['A1', 'TCA441', 342, ['GEN. STATOR COIL TEMP.(B)'], '007', 123, 121, '006', 1295, 245],
    ['A2', 'TCA441', 459, ['GEN. STATOR COIL TEMP.(C)'], '009', 123, 121, '008', 1305, 267],
    ['A3', 'TCA441', 566, ['GEN. STATOR COIL TEMP.(D)'], '012', 123, 121, '011', 1315, 288],
    ['A4', 'TCA441', 683, ['GEN. STATOR COIL TEMP.(E)'], '014', 123, 121, '013', 1325, 310],
    ['A2', 'TCA443', 800, ['GEN. STATOR COIL TEMP.(F)'], '016', 123, 121, '015', 1334, 331],
    ['A1', 'TCA442', 949, ['GEN. COOLING GAS AIR', 'COOLER OUTLET TEMP.(A)'], '018', 50, 48, '017', 0, 949],
    ['A2', 'TCA442', 1055, ['GEN. COOLING GAS AIR', 'COOLER OUTLET TEMP.(B)'], '021', 50, 48, '020', 1289, 970],
    ['A3', 'TCA442', 1151, ['GEN. COOLING GAS AIR', 'COOLER OUTLET TEMP.(C)'], '023', 50, 48, '022', 1310, 991],
    ['A4', 'TCA442', 1258, ['GEN. COOLING GAS AIR', 'COOLER OUTLET TEMP.(D)'], '025', 50, 48, '024', 1330, 1012],
    ['A1', 'TCA443', 1375, ['AC EXCITER OUTLET AIR TEMP.'], '027', 95, 93, '026', 1340, 1033]
  ].forEach(([l, sh, y, names, no, hl, ll, btr, rx, oy], i) => {
    const low = i > 5,
      cx = low ? 340 : 341,
      bx = low ? 702 : 705,
      dx = low ? 798 : 802,
      ox = low ? 1354 : 1348,
      key = 'i' + (i + 1),
      cmp = 'cmp' + no;
    c.push([key, 'in', l, cx, y, '', [sh]]);
    names.forEach((s, n) => t.push([cx + 32, y - 10 - 21 * (names.length - 1 - n), s]));
    t.push([bx - 44, y - 12, 'T', 2]);
    b.push(
      [cmp, 'CMP', no, bx, y + 11, ['HL:' + hl + 'degc', 'LL:' + ll + 'degc']],
      ['btr' + btr, 'o:BTR', btr, low ? 853 : 867, y - 33]
    );
    w.push([
      key,
      [
        [cx + 27, y],
        [bx - 30, y]
      ],
      1
    ]);
    /* to the lamp, and to the OR */
    W(cmp, [dx, y], [dx, y - 33], [(low ? 1129 : 1133) - 35, y - 33]);
    d.push(['crt' + (i + 1), low ? 1129 : 1133, y - 33, 'out', 'TCA530A_' + (i + 1), 'S', '#1C']);
    j.push([dx, y]);
    if (rx) W(cmp, [bx + 30, y], [rx, y], [rx, oy], [ox, oy]);
    else if (oy === y) W(cmp, [bx + 30, y], [ox, y]);
    else W(cmp, [bx + 30, y], [dx, y], [dx, oy], [ox, oy]);
  });
  b.push(
    ['or003', 'OR', '003', 1378, 277, [], {}, [60, 128]],
    ['or004', 'OR', '004', 1708, 245, [], {}, [60, 65]],
    ['not005', 'NOT', '005', 1846, 235],
    ['btr010', 'o:BTR', '010', 1695, 468],
    ['or019', 'OR', '019', 1384, 991, [], {}, [60, 106]]
  );
  c.push(['iA7', 'in', 'A7', 1430, 468, '', ['TCA048']], ['oA1', 'out', 'A1', 2091, 224, '', ['TCA559']]);
  d.push(['crt12', 2068, 468, 'out', 'TCA530A_12', 'S', '#1C']);
  /* INITIAL: the first and the last CMP */
  W('kInit', [477, 139], [706, 139], [706, 213]);
  W('kInit', [619, 139], [619, 1343], [702, 1343], [702, 1365]);
  /* CRI 1.40 */
  W('or003', [1408, 224], [1678, 224]);
  W('or019', [1414, 949], [1599, 949], [1599, 245], [1678, 245]);
  W('iA7', [1457, 468], [2033, 468]);
  W('iA7', [1621, 468], [1621, 266], [1678, 266]);
  W('or004', [1738, 224], [1816, 224]);
  W('not005', [1876, 224], [2064, 224]);
  j.push([619, 139], [1621, 468]);
  t.push(
    [1388, 410, 'GEN. WATER AND OIL'],
    [1388, 431, 'LEAKAGE LEVEL HIGH'],
    [1872, 193, 'CRI 1.40 GENERATOR'],
    [1872, 214, 'TEMPERATURE'],
    [363, 177, '(TCA100)'],
    [232, 1522, 'CONTROLLER:'],
    [394, 1522, 'COMM+MD'],
    [656, 1495, 'TRIGGER  :'],
    [656, 1522, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA530A',
    /* swc: the SW of these CMP is not wired on the drawing; the HIACS backup record of each (phase6-tcs-records-2026-11-26.md (YUA, team-files/tcs-decoded), COMM+MD 2017-02-23) has 102_DD00001 = ON(1) on its side input: the comparison with hysteresis (ML 51 SW = 1) */
    swc: { cmp007: 1, cmp009: 1, cmp012: 1, cmp014: 1, cmp016: 1, cmp018: 1, cmp021: 1, cmp023: 1, cmp025: 1 },
    title: 'CRITERIA CONDITION',
    page: 100,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    k: [['kInit', 243, 139, 'INITIAL', 'ref']],
    c,
    d,
    b,
    w,
    j,
    t
  });
})();
