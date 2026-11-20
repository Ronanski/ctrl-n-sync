/* TCE470 EHG MINOR TROUBLE ANN(1) (331DM09784 page 169, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels
   of the page rendered 2296 wide, the scan skew taken out. OR 003 of the twelve minor troubles (network, battery, simulation,
   communication, the pressure abnormals of TCE101 to TCE104) is ALARM(1) (A, TCE472); OR 002 of the eight valve abnormals (MSV, CV,
   ICV, RSV of TCE450 / TCE451, the spare inputs tied to OFF(0)) is ALARM(2) (B, TCE472). */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    w = [],
    t = [];
  /* one input: connector, its name (one or two lines), the line to the OR pin by its riser */
  const inp = (k, y, let, nm, ref, xr, pin, or) => {
    const two = Array.isArray(nm);
    c.push([k, 'in', let, 302, y, two ? '' : nm, [ref]]);
    if (two) t.push([333, y - 33, nm[0], 0, 2.05], [333, y - 12, nm[1], 0, 2.05]);
    w.push([k, xr ? [[329, y], [xr, y], [xr, pin], [1126, pin]] : [[329, y], [1126, y]]]);
  };
  [
    ['A', 'NETWORK IF TROUBLE', 'TCE051', 0],
    ['F', 'EHG BATTERY ERR', 'TCE051', 888],
    ['A', 'DURING SIMULATION', 'TCE052', 910],
    ['F', 'COMMUNICATION LOST', 'TCE052', 932],
    ['D1', ['MSV INLET', 'STEAM PRESS. ABN.'], 'TCE101', 954],
    ['D2', ['MOP(A) DISCHARGE', 'OIL PRESS. ABN.'], 'TCE102', 974],
    ['D3', ['COP(A) DISCHARGE', 'OIL PRESS. ABN.'], 'TCE102', 996],
    ['D4', ['HOT REHEAT', 'STEAM PRESS. ABN.'], 'TCE102', 1016],
    ['D1', ['COORDINATE CONTROL', 'LOAD DEMAND ABN.'], 'TCE103', 1038],
    ['D2', ['MOP(B) DISCHARGE', 'OIL PRESS. ABN.'], 'TCE104', 1060],
    ['D3', ['COP(B) DISCHARGE', 'OIL PRESS. ABN.'], 'TCE104', 1080],
    ['D4', ['HOT DISCHARGE', 'OIL PRESS. ABN.'], 'TCE104', 1102]
  ].forEach(([let, nm, ref, xr], i) => inp('i' + i, 162 + 64 * i, let, nm, ref, xr, [162, 183, 204, 225, 246, 268, 289, 310, 331, 353, 374, 395][i]));
  [
    ['A', 'MSV(A) ABN.', 'TCE450', 0],
    ['B', 'MSV(B) ABN.', 'TCE450', 932],
    ['C', 'CV(A) ABN.', 'TCE450', 954],
    ['D', 'CV(B) ABN.', 'TCE450', 975],
    ['A', 'ICV(A) ABN.', 'TCE451', 996],
    ['B', 'ICV(B) ABN.', 'TCE451', 1018],
    ['C', 'RSV(A) ABN.', 'TCE451', 1040],
    ['D', 'RSV(B) ABN.', 'TCE451', 1060]
  ].forEach(([let, nm, ref, xr], i) => inp('j' + i, 928 + 64 * i, let, nm, ref, xr, [928, 949, 970, 991, 1013, 1034, 1055, 1077][i]));
  c.push(['oA', 'out', 'A', 2080, 162, '', ['TCE472']], ['oB', 'out', 'B', 2080, 928, '', ['TCE472']]);
  w.push(
    ['kOff', [[490, 1440], [1102, 1440], [1102, 1119], [1126, 1119]]],
    ['kOff', [[1082, 1440], [1082, 1098], [1126, 1098]]],
    ['or003', [[1184, 162], [2053, 162]]],
    ['or002', [[1184, 928], [2053, 928]]]
  );
  t.push(
    [1795, 152, 'ALARM(1)', 0, 2.05],
    [1795, 918, 'ALARM(2)', 0, 2.05],
    [240, 1523, 'CONTROLLER:'],
    [398, 1523, 'EHG+MD'],
    [624, 1497, 'TRIGGER  :'],
    [624, 1523, 'CYCLE(ms):30']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCE470',
    title: 'EHG MINOR TROUBLE ANN(1)',
    page: 169,
    ctl: 'EHG+MD',
    cycle: 30,
    f: [170, 84, 2219, 1547],
    k: [['kOff', 256, 1440, 'OFF(0)', 'sys.ref']],
    c,
    b: [
      ['or003', 'OR', '003', 1155, 278, [], {}, [58, 256]],
      ['or002', 'OR', '002', 1155, 1023, [], {}, [58, 214]]
    ],
    w,
    t
  });
})();
