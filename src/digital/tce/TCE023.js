/* TCE023 PI/O TABLE EXPLANATION SHEET (331DM09784 page 18, controller EHG+MD). Typed from the drawing; units = the pixels of the page rendered 2296 wide.
   The sheet is a table: its rules are plain lines, its 32 rows are counted here as the drawing counts them (thr No. 1 ~ 32, CH No. 0 ~ 1F). */
(function () {
  const l = [],
    t = [],
    H = (y, x0, x1) => l.push([[x0, y], [x1, y]]),
    V = (x, y0, y1) => l.push([[x, y0], [x, y1]]);
  /* the card definition over the table: SDIO/CE, PI/O, RTB */
  [207, 234, 260].forEach(y => H(y, 269, 965));
  [269, 473, 762, 965].forEach(x => V(x, 207, 260));
  [313, 356, 398, 515, 558, 602, 645, 690, 805, 848, 890].forEach(x => V(x, 234, 260));
  t.push([371, 226, 'SDIO/CE', 1], [614, 226, 'PI/O', 1], [864, 226, 'RTB', 1]);
  t.push([272, 253, 'SLOT'], [360, 253, 'TYPE'], [476, 253, 'UNIT'], [536, 253, '1', 1], [561, 253, 'SLOT'], [621, 253, '8', 1], [648, 253, 'TYPE'], [692, 253, 'LYD000A'], [770, 253, 'DVA'], [850, 253, 'TYPE']);
  /* the table: head and 32 rows */
  const X = [269, 313, 356, 851, 932, 1013, 1161, 1328, 1455],
    Y0 = 265,
    Y1 = 319,
    RH = 32;
  X.forEach(x => V(x, Y0, Y1 + 32 * RH));
  H(Y0, 269, 1455);
  for (let i = 0; i <= 32; i++) H(Y1 + i * RH, 269, 1455);
  t.push([291, 290, 'thr', 1], [291, 312, 'No.', 1], [335, 290, 'CH', 1], [335, 312, 'No.', 1], [596, 300, 'DO Signal Name', 1]);
  t.push([892, 289, 'logic', 1], [892, 311, 'SH No.', 1], [973, 289, 'seq', 1], [973, 311, 'SH No.', 1], [1078, 299, 'connect', 1], [1233, 299, 'instrument No.', 1], [1390, 299, 'EDB idNo.', 1]);
  for (let i = 0; i < 32; i++) t.push([296, Y1 + i * RH + 25, String(i + 1), 1], [339, Y1 + i * RH + 25, i.toString(16).toUpperCase(), 1]);
  t.push([363, 344, 'LLM RAISE'], [888, 343, 'TCS050', 1], [963, 343, 'TC230', 1]);
  /* the numbers of the explanation and their arrows */
  t.push([341, 124, '(1)', 1], [282, 1446, '(2)', 1], [325, 1446, '(3)', 1], [596, 1446, '(4)', 1], [880, 1444, '(5)', 1], [961, 1444, '(6)', 1], [1076, 1444, '(7)', 1], [1233, 1444, '(8)', 1]);
  t.push([232, 1536, 'CONTROLLER:'], [394, 1536, 'EHG+MD']);
  [
    [1833, 173, 'PI/O Table Description Explanation', 1],
    [1582, 226, '(1) PI/O Card Table Definition Information'],
    [1647, 258, 'Defines the Card address associated with the'],
    [1647, 290, 'Input/Output of the Signal.'],
    [1582, 333, '(2) Order Number'],
    [1647, 365, 'Shows the Number associated with the PI/O Table'],
    [1647, 397, 'and the logic.'],
    [1581, 440, '(3) CH No.'],
    [1646, 472, 'Shows the channel (terminal) Number.'],
    [1581, 515, '(4) Signal Name'],
    [1646, 547, 'Shows the Signal Name assigned to the channel.'],
    [1581, 590, '(5) Logic Sheet Number'],
    [1645, 622, 'Shows the Sheet Number described the connection'],
    [1645, 654, 'with the Signal and the logic.'],
    [1580, 696, '(6) Schematic Sheet Number'],
    [1644, 728, 'Shows the Sheet Number of the Input/Output part'],
    [1644, 760, 'of the schematic described the signal.'],
    [1580, 803, '(7) Destination of the signal'],
    [1644, 835, 'Shows the location of the source and destination'],
    [1644, 867, 'of the Input/Output Signal.'],
    [1579, 910, '(8) Instrument Number'],
    [1643, 942, 'Shows the Instrument Number of the source and'],
    [1643, 974, 'destination of the Input/Output Signal.']
  ].forEach(x => t.push(x));
  (typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
    id: 'TCE023',
    /* the symbols drawn as examples ("(TCS400-1)" is the example of a PI/O name): not logic, left out of the program */
    legend: 1,
    title: 'PI/O TABLE EXPLANATION SHEET',
    page: 18,
    ctl: 'EHG+MD',
    cycle: '-',
    f: [167, 87, 2222, 1553],
    l,
    a: [
      [[345, 133], [345, 197]],
      [[287, 1420], [287, 1356]],
      [[330, 1420], [330, 1356]],
      [[601, 1420], [601, 1356]],
      [[886, 1420], [886, 1356]],
      [[966, 1420], [966, 1356]],
      [[1081, 1420], [1081, 1356]],
      [[1238, 1420], [1238, 1356]]
    ],
    t
  });
})();
