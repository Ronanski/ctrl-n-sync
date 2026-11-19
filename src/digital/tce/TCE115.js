/* TCE115 TPC SIGNAL DIAGNOSTICS(5) (331DM09784 page 79, controller EHG+MD, cycle 30 ms; the drawing gives the number (5) to this sheet too). Typed from
   the drawing; units = the pixels of the page rendered 2296 wide. The scan of this page is turned a little; every place is typed as it stands on
   the page set straight, the ten lines at one distance.
   The lamps of the master trip solenoid valve test (from TCE117, TCE118, TCE119) at the left, and its test push buttons of the operator station
   out to the three protection controllers at the right. The name of the fifth input is printed "CRT OPR. PERM." and its lamp "CRT OPE. PERM.";
   typed as printed. The title block of this page prints PAGE 77; it is page 79 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  const Y = i => Math.round(206 + 106.55 * i),
    M = (v, p) => ['MASTER TRIP SOLENOID', 'VALVE(' + v + ') ' + p],
    c = [],
    d = [],
    b = [],
    w = [],
    t = [],
    lines = (L, x, y) => L.forEach((s, j) => t.push([x, y - 6 - 21 * (L.length - 1 - j), s]));
  /* the lamps: [letter, sheet, name at the input, mark, name at the lamp, lamp tag] */
  [
    ['A', 'TCE117', ['OPERATED A1'], '001', null, 'TCE115_1_X01'],
    ['B', 'TCE117', ['OPERATED A2'], '003', null, 'TCE115_1_X02'],
    ['C', 'TCE117', M('A1', 'TEST PB'), '005', null, 'TCE115_1_IT1'],
    ['D', 'TCE117', M('A2', 'TEST PB'), '007', null, 'TCE115_1_IT2'],
    ['A', 'TCE118', ['CRT OPR. PERM.'], '008', ['CRT OPE. PERM.'], 'TCE115_1_IYP'],
    ['B', 'TCE118', ['OPERATED B1'], '009', null, 'TCE115_2_X01'],
    ['C', 'TCE118', ['OPERATED B2'], '011', null, 'TCE115_2_X02'],
    ['D', 'TCE118', M('B1', 'TEST PB'), '013', null, 'TCE115_2_IT1'],
    ['A', 'TCE119', M('B2', 'TEST PB'), '015', null, 'TCE115_2_IT2'],
    ['B', 'TCE119', ['CRT OPE. PERM.'], '016', null, 'TCE115_2_IYP']
  ].forEach(([l, sh, name, mk, lamp, tag], i) => {
    const y = Y(i),
      k = 'i' + (i + 1);
    c.push([k, 'in', l, 339, y, name[name.length - 1], [sh]]);
    if (name.length > 1) t.push([372, y - 32, name[0]]);
    b.push(['b' + mk, 'o:BTR', mk, 682, y]);
    w.push([k, [[366, y], [1019, y]]]);
    d.push(['crt' + (i + 1), 1054, y, 'out', tag, 'S', '#1C']);
    lines(lamp || name, 770, y);
  });
  /* the push buttons: [line, tag, name, mark, letter of the connector] */
  [
    [0, 'TCE115_1_KT1', 'TEST A1', '002', 'A1'],
    [1, 'TCE115_1_KT2', 'TEST A2', '004', 'A2'],
    [2, 'TCE115_1_IYS', 'CRT AVAILABLE', '006', 'A3'],
    [5, 'TCE115_2_KT1', 'TEST B1', '010', 'B1'],
    [6, 'TCE115_2_KT2', 'TEST B2', '012', 'B2'],
    [7, 'TCE115_2_IYS', 'CRT AVAILABLE', '014', 'B3']
  ].forEach(([i, tag, name, mk, l]) => {
    const y = Y(i),
      k = 'p' + l;
    d.push([k, 1374, y, 'in', tag, 'R', '#1C']);
    b.push(['b' + mk, 'o:BTR', mk, 1743, y]);
    w.push([k, [[1409, y], [2067, y]]]);
    c.push(['o' + l, 'out', l, 2094, y, '', ['TCP1200', 'TCP2200', 'TCP3200'], 1, 2]);
    t.push([1404, y - 6, name], [1834, y - 6, name]);
  });
  t.push([247, 1516, 'CONTROLLER:'], [408, 1516, 'EHG+MD'], [670, 1491, 'TRIGGER  :'], [670, 1518, 'CYCLE(ms):30']);
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({ id: 'TCE115', title: 'TPC SIGNAL DIAGNOSTICS(5)', page: 79, ctl: 'EHG+MD', cycle: 30, f: [172, 78, 2223, 1540], c, d, b, w, t });
})();
