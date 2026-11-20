/* TCA529 SCOPE OF MONITOR (331DM09788 page 98, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. Which ATS steps are being executed or are in order, as the other TCA sheets read them:
   - STEP n-7 EXECUTING (n = 0 .. 6): a chain of OR from STEP 7 EXECUTING up to STEP 0 (OR 014, 012, 010, 008, 006, 004, 002);
   - TURBINE PREPARATION SELECTED TO NORMAL OPERATION EXECUTING = STEP 1-7 EXECUTING or (any of STEP 1 .. 7 IN ORDER (OR 017) or STEP 1-6
     COMPLETED (OR 018)) (OR 016);
   - EXCITATION SELECTED TO NORMAL OPERATION EXECUTING = STEP 4-7 EXECUTING, any of STEP 4 .. 7 IN ORDER (OR 020) or STEP 4-6 COMPLETED
     (OR 019);
   - SYNC INITIAL LOAD STEP EXECUTED = STEP 5-7 EXECUTING, any of STEP 5 .. 7 IN ORDER (OR 023) or STEP 5-6 COMPLETED (OR 021); with
     STEP 8 IN ORDER (OR 022) = SYNC INITIAL LOAD SELECTED TO TURBINE SHUT-DOWN SELECTED;
   - TURBINE SHUT-DOWN SELECTED OR EXECUTING = STEP 8 IN ORDER or STEP 8 EXECUTING (OR 025).
   The words are the ones of the drawing, with its list of the steps (STEP 0 : HP TURBINE WARMING .. STEP 8 : TURBINE SHUT-DOWN).
   live: none; the engine holds no ATS step state in tcsLiveRead, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    b = [],
    w = [],
    j = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const cx = y => Math.round(290 - (y - 138) / 206); /* the input connectors lean 6 px to the left down the page */
  /* STEP n EXECUTING: [n, sheet, BTR, OR of the chain (0 = none), x of the OR, letter of the output, x of its connector, its sheet] */
  [
    [0, 'TCA520', '001', '002', 1540, 'J', 2105, 'TCA510'],
    [1, 'TCA521', '003', '004', 1433, 'A', 2105, 'TCA520'],
    [2, 'TCA522', '005', '006', 1326, 'B', 2104, 'TCA521'],
    [3, 'TCA523', '007', '008', 1219, 'C', 2103, 'TCA522'],
    [4, 'TCA524', '009', '010', 1112, 'D', 2102, 'TCA523'],
    [5, 'TCA525', '011', '012', 1004, 'E', 2102, 'TCA524'],
    [6, 'TCA526', '013', '014', 897, 'F', 2100, 'TCA525'],
    [7, 'TCA527', '015', 0, 0, 'G', 2101, 'TCA526']
  ].forEach(([n, sh, btr, or, ox, ol, oc, osh]) => {
    const y = 138 + 64 * n,
      x = cx(y),
      key = 'iC' + n;
    c.push([key, 'in', 'C', x, y, '', [sh]], ['o' + ol, 'out', ol, oc, y, '', [osh]]);
    b.push(['btr' + btr, 'o:BTR', btr, x + 310, y]);
    t.push(
      [x + 31, y - 10, 'STEP ' + n + ' EXECUTING'],
      [1648 - Math.round(n / 3), y - 10, n < 7 ? 'STEP ' + n + '-7 EXECUTING' : 'STEP 7 EXECUTING']
    );
    if (or) {
      b.push(['or' + or, 'OR', or, ox, y + 11]);
      W(key, [x + 27, y], [ox - 30, y]);
      W('or' + or, [ox + 30, y], [oc - 27, y]);
    } else W(key, [x + 27, y], [oc - 27, y]);
  });
  /* the chain: the output of each OR also goes up to the OR of the step before; [key, x of the riser, y of its line] */
  W('iC7', [844, 586], [844, 544], [867, 544]);
  [
    ['or014', 950, 522, 974],
    ['or012', 1058, 458, 1082],
    ['or010', 1166, 394, 1189],
    ['or008', 1272, 330, 1296],
    ['or006', 1379, 266, 1403],
    ['or004', 1487, 202, 1510]
  ].forEach(([key, x, y, ix]) => {
    W(key, [x, y], [x, y - 42], [ix, y - 42]);
    j.push([x, y]);
  });
  j.push([844, 586]);
  /* STEP n IN ORDER: [n, sheet, x of the riser to OR 017, y at OR 017] */
  [
    [1, 'TCA521', 0, 661],
    [2, 'TCA522', 555, 682],
    [3, 'TCA523', 575, 704],
    [4, 'TCA524', 596, 725],
    [5, 'TCA525', 617, 745],
    [6, 'TCA526', 638, 767],
    [7, 'TCA527', 659, 788]
  ].forEach(([n, sh, rx, oy]) => {
    const y = n < 4 ? 597 + 64 * n : n === 4 ? 852 : 596 + 64 * n,
      x = cx(y),
      key = 'iB' + n;
    c.push([key, 'in', 'B', x, y, '', [sh]]);
    t.push([x + 31, y - 10, 'STEP ' + n + ' IN ORDER']);
    if (!rx) W(key, [x + 27, y], [685, oy]);
    else if (n < 4) W(key, [x + 27, y], [rx, y], [rx, oy], [685, oy]);
    else {
      /* STEP 4 .. 7 also go to OR 020, STEP 5 .. 7 to OR 023 */
      W(key, [x + 27, y], n === 4 ? [791, y] : n === 7 ? [790, y] : [rx, y]);
      W(key, [rx, y], [rx, oy], [685, oy]);
      j.push([rx, y]);
      if (n > 4) {
        const y20 = 852 + 21 * (n - 4) + (n === 7 ? 1 : 0);
        W(key, [rx, y20], [791, y20]);
        j.push([rx, y20]);
      }
      if (n === 5 || n === 6) W(key, [rx, y], [rx, n === 5 ? 1000 : 1022], [790, n === 5 ? 1000 : 1022]);
    }
  });
  /* the completed steps, STEP 8 */
  [
    ['iF', 'F', 'TCA510', 1108, 'STEP 1-6 COMPLETED'],
    ['iC46', 'C', 'TCA510', 1183, 'STEP 4-6 COMPLETED'],
    ['iD', 'D', 'TCA510', 1246, 'STEP 5-6 COMPLETED'],
    ['iB8', 'B', 'TCA528', 1310, 'STEP 8 IN ORDER'],
    ['iC8', 'C', 'TCA528', 1374, 'STEP 8 EXECUTING']
  ].forEach(([key, l, sh, y, s]) => {
    c.push([key, 'in', l, cx(y), y, '', [sh]]);
    t.push([cx(y) + 31, y - 10, s]);
  });
  b.push(
    ['or016', 'OR', '016', 1535, 650],
    ['or017', 'OR', '017', 715, 725, [], {}, [60, 150]],
    ['or018', 'OR', '018', 970, 672],
    ['or019', 'OR', '019', 1215, 852, [], {}, [60, 65]],
    ['or020', 'OR', '020', 821, 884, [], {}, [60, 86]],
    ['or021', 'OR', '021', 1140, 1000, [], {}, [60, 65]],
    ['or022', 'OR', '022', 1532, 990],
    ['or023', 'OR', '023', 820, 1022, [], {}, [60, 65]],
    ['or025', 'OR', '025', 818, 1321]
  );
  c.push(
    ['oH', 'out', 'H', 2100, 640, '', ['TCA501']],
    ['oI', 'out', 'I', 2096, 831, '', ['TCA501']],
    ['oK', 'out', 'K', 2096, 979, '', ['-']],
    ['oM', 'out', 'M', 2095, 1118, '', ['TCA103', 'TCA501']],
    ['oL', 'out', 'L', 2093, 1310, '', ['TCA501', 'TCA767']]
  );
  /* TURBINE PREPARATION SELECTED TO NORMAL OPERATION EXECUTING */
  W('or017', [745, 661], [940, 661]);
  W('iF', [cx(1108) + 27, 1108], [917, 1108], [917, 683], [940, 683]);
  W('or018', [1000, 661], [1505, 661]);
  W('or004', [1487, 202], [1487, 640], [1505, 640]);
  W('or016', [1565, 640], [2073, 640]);
  /* EXCITATION SELECTED TO NORMAL OPERATION EXECUTING */
  W('or010', [1166, 394], [1166, 831], [1185, 831]);
  W('or020', [851, 852], [1185, 852]);
  W('iC46', [cx(1183) + 27, 1183], [936, 1183], [936, 873], [1185, 873]);
  W('or019', [1245, 831], [2069, 831]);
  /* SYNC INITIAL LOAD */
  W('or012', [1058, 458], [1058, 979], [1110, 979]);
  W('or023', [850, 1000], [1110, 1000]);
  W('iD', [cx(1246) + 27, 1246], [1053, 1246], [1053, 1022], [1110, 1022]);
  W('or021', [1170, 979], [1502, 979]);
  W('or021', [1266, 979], [1266, 1118], [2068, 1118]);
  W('iB8', [cx(1310) + 27, 1310], [788, 1310]);
  W('iB8', [732, 1310], [732, 1267], [1480, 1267], [1480, 1001], [1502, 1001]);
  W('or022', [1562, 979], [2069, 979]);
  /* TURBINE SHUT-DOWN SELECTED OR EXECUTING */
  W('iC8', [cx(1374) + 27, 1374], [764, 1374], [764, 1332], [788, 1332]);
  W('or025', [848, 1310], [2066, 1310]);
  j.push([1266, 979], [732, 1310]);
  t.push(
    [1643, 609, 'TURBINE PREPARATION SELECTED TO'],
    [1643, 630, 'NORMAL OPERATION EXECUTING'],
    [1526, 821, 'EXCITATION SELECTED TO NORMAL OPERATION EXECUTING'],
    [1640, 948, 'SYNC INITIAL LOAD SELECTED TO'],
    [1640, 969, 'TURBINE SHUT-DOWN SELECTED'],
    [1639, 1108, 'SYNC INITIAL LOAD STEP EXECUTED'],
    [1637, 1300, 'TURBINE SHUT-DOWN SELECTED OR EXECUTING'],
    ...[
      'STEP 0 : HP TURBINE WARMING',
      'STEP 1 : PREPARATION',
      'STEP 2 : TURBINE RUB CHECK',
      'STEP 3 : ACCELERATION',
      'STEP 4 : EXCITATION',
      'STEP 5 : SYNC INITIAL LOAD',
      'STEP 6 : LOAD UP',
      'STEP 7 : NORMAL OPERATION',
      'STEP 8 : TURBINE SHUT-DOWN'
    ].map((s, i) => [1148, Math.round(1365 + 21.4 * i), s]),
    [238, 1522, 'CONTROLLER:'],
    [399, 1522, 'COMM+MD'],
    [622, 1495, 'TRIGGER  :'],
    [622, 1522, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA529',
    title: 'SCOPE OF MONITOR',
    page: 98,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    c,
    b,
    w,
    j,
    t
  });
})();
