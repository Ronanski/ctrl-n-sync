/* SH-G-8B ALARM FOR GENERATOR PROTECTION (2/2) (Generator Protection / Breaker Logic Diagram 310SD03-743 rev 1, sheet 19). Typed from
   the drawing; units = the pixels of the page rendered 2296 wide. The rotating diode fault and the field earth fault (each with the
   generator voltage OK, held 5 s) or the relay trouble / loss of control power of those relays to the annunciator; the exciter field
   earth fault and the generator control panel trouble to the annunciator; the generator trip and the ready to synchronize of 52G and
   52L to the DCS; protection relay A or B trouble to the annunciator, and both in trouble to the annunciator, the sequence of events
   recorder and SH-G-5A / SH-G-6A. Each mark: the signal also goes to that panel. */
(function () {
  if (typeof window === 'undefined') return;
  const o = [],
    s = [],
    b = [],
    r = [],
    w = [],
    t = [],
    l = [],
    e = [],
    a = [],
    j = [];
  /* a gate: bar x, centre y, the bar from y1 to y2 */
  const gate = (k, ty, bar, y, y1, y2) => {
    b.push([k, 'G:' + ty, '', bar + 9, y, [], {}, [18, ty === 'OR' ? 18 : 20, 0]]);
    l.push([[bar, y1], [bar, y2]]);
  };
  /* a relay of a panel: key, tag, panel, name (one or two lines), top / bottom */
  const relay = (k, tg, pn, nm, y1, y2) => {
    const y = (y1 + y2) / 2;
    l.push([[252, y1], [585, y1]], [[585, y1], [585, y2]], [[585, y2], [252, y2]], [[252, y2], [252, y1]], [[521, y1], [521, y2]]);
    if (tg) t.push([254, y1 - 8, tg]);
    if (pn) t.push([343, y1 - 8, pn]);
    if (Array.isArray(nm)) t.push([264, y - 7, nm[0]], [264, y + 8, nm[1]]);
    else t.push([264, y, nm]);
    t.push([553, y, 'ON', 4]);
    s.push([k, 521, y1, 585, y2]);
  };
  /* an input from another sheet: key, number, sheet, words, line */
  const inp = (k, n, sh, z, y) => {
    o.push([265, y, 12]);
    t.push([265, y, n, 4], [284, y - 8, z], [284, y + 12, sh]);
    s.push([k, 253, y - 12, 277, y + 12]);
  };
  /* an output box (ANN, SOE, DCS) at line y, with its words right-aligned before it */
  const out = (k, x1, y, box, z) => {
    w.push([k, [[x1, y], [1054, y]]]);
    r.push(['', 1054, y - 9, 31, 18, box]);
    if (z) t.push([1043, y - 9, z, 2]);
  };
  /* a mark that the signal also goes to a panel: x, top / bottom, words, the lines it crosses (none: a dashed line), words above / below */
  const mark = (x, y1, y2, z1, z2, X, ab) => {
    if (X) {
      const P = [y1, ...X.flatMap(y => [y - 6, y + 6]), y2];
      for (let i = 0; i < P.length; i += 2) l.push([[x, P[i]], [x, P[i + 1]]]);
    } else e.push([[x, y1], [x, y2]]);
    a.push([[x, y1], [x + 17, y1]], [[x, y2], [x - 17, y2]]);
    if (ab) t.push([x + 14, y1 - 11, z1, 4], [x - 14, y2 + 14, z2, 4]);
    else t.push([x + 20, y1 + 1, z1], [x - 20, y2 + 1, z2, 2]);
  };

  /* ---- rotating diode fault / field earth fault ---- */
  inp('i50', '50', 'SH-G-1B', 'GEN. VOLTAGE OK', 172);
  r.push(['do', 607, 160, 33, 24, '']);
  t.push([623, 166, 'DO', 4], [623, 178, '5s', 4]);
  relay('r30', '(30DF)', '(GPP)', 'RSR DIODE FAULT', 222, 255);
  relay('r64', '(64F)', '(GPP)', 'GEN. FIELD EARTH FAULT', 284, 318);
  relay('rt', '(-)', '(GPP)', '30DF / 64F RELAY TROUBLE', 351, 382);
  relay('rp', '(-)', '(GPP)', '30DF / 64F LOSS OF CONTROL POWER', 413, 445);
  gate('a1', 'A', 716, 205, 162, 249);
  gate('a2', 'A', 716, 290, 270, 309);
  gate('a3', 'A', 716, 356, 337, 375);
  gate('or3', 'OR', 768, 365, 350, 381);
  gate('o30', 'OR', 835, 214, 197, 231);
  gate('o64', 'OR', 835, 300, 281, 319);
  w.push(
    ['i50', [[277, 172], [607, 172]]],
    ['do', [[640, 172], [716, 172]]],
    ['do', [[666, 172], [666, 347], [716, 347]]],
    ['do', [[666, 279], [716, 279]]],
    ['r30', [[585, 239], [716, 239]]],
    ['r64', [[585, 300], [716, 300]]],
    ['rt', [[585, 366], [716, 366]]],
    ['rp', [[585, 429], [743, 429], [743, 374], [768, 374]]],
    ['a3', [[735, 356], [768, 356]]],
    ['or3', [[787, 365], [806, 365], [806, 224], [835, 224]]],
    ['or3', [[806, 309], [835, 309]]],
    ['a1', [[735, 205], [835, 205]]],
    ['a2', [[735, 290], [835, 290]]]
  );
  j.push([666, 172], [666, 279], [806, 309]);
  out('o30', 854, 214, 'ANN');
  t.push([1043, 187, 'RSR DIODE FAULT (30DF)', 2], [1043, 201, 'OPERATED / RELAY TROUBLE', 2]);
  out('o64', 854, 300, 'ANN');
  t.push([1043, 273, 'GEN. FIELD EARTH FAULT (64F)', 2], [1043, 287, 'OPERATED / RELAY TROUBLE', 2]);
  mark(627, 220, 444, '(TCS)', '(GPP)', 0, 1);

  /* ---- exciter field earth fault ---- */
  relay('r64e', '(64E)', '(AVR)', 'AC EXC. FIELD EARTH FAULT', 500, 531);
  out('r64e', 585, 515, 'ANN', 'AC EXC. FIELD EARTH FAULT (64E) OPERATED');
  mark(626, 495, 527, '(TCS)', '(AVR)', [515], 1);

  /* ---- to the DCS, the control panel trouble ---- */
  inp('i15', '15', 'SH-G-5B', 'GENERATOR TRIP', 586);
  out('i15', 277, 586, 'DCS');
  mark(690, 569, 600, 'OTHERS', '(GPP)', [586]);
  inp('i43', '43', 'SH-G-1B', '52G READY TO SYNCHRONIZE', 631);
  out('i43', 277, 631, 'DCS');
  mark(690, 615, 647, 'OTHERS', '(GCP)', [631]);
  relay('rcp', '(GCP)', '', 'GEN. CONTROL PANEL TROUBLE', 675, 707);
  out('rcp', 585, 691, 'ANN', 'GEN. CONTROL PANEL TROUBLE');
  mark(690, 675, 705, '(TCS)', '(GCP)', [691]);
  inp('i41', '41', 'SH-G-2B', '52L READY TO SYNCHRONIZE', 751);
  out('i41', 277, 751, 'DCS');
  mark(690, 736, 769, 'OTHERS', '(GCP)', [751]);

  /* ---- protection relay A / B trouble ---- */
  relay('rra', '(-)', '(GPP)', ['GEN. PROTECTION RELAY (A) TROUBLE', '(INCLUDING "LOSS OF CONTROL POWER")'], 883, 921);
  relay('rrb', '(-)', '(GPP)', ['GEN. PROTECTION RELAY (B) TROUBLE', '(INCLUDING "LOSS OF CONTROL POWER")'], 941, 979);
  gate('ab', 'A', 662, 931, 893, 966);
  w.push(
    ['rra', [[585, 902], [662, 902]]],
    ['rra', [[621, 902], [621, 868], [1054, 868]]],
    ['rrb', [[585, 960], [662, 960]]],
    ['rrb', [[621, 960], [621, 990], [1054, 990]]],
    ['ab', [[691, 931], [691, 1147], [1052, 1147]]],
    ['ab', [[691, 1037], [1054, 1037]]],
    ['ab', [[691, 1087], [1052, 1087]]]
  );
  j.push([621, 902], [621, 960], [691, 931], [691, 1037], [691, 1087]);
  r.push(['', 1054, 859, 31, 18, 'ANN'], ['', 1054, 981, 31, 18, 'ANN']);
  t.push([1043, 859, 'GEN. PROTECTION RELAY (A) TROUBLE', 2], [1043, 981, 'GEN. PROTECTION RELAY (B) TROUBLE', 2]);
  out('ab', 681, 931, 'ANN', 'BOTH GEN. PROTECTION RELAY IN TROUBLE');
  r.push(['', 1054, 1028, 31, 18, 'SOE']);
  mark(752, 845, 1004, '(TCS)', '(GPP)');
  mark(752, 1024, 1054, 'OTHERS', '(GPP)', [1037]);
  [
    [1087, '1', 'SH-G-5A'],
    [1147, '2', 'SH-G-6A']
  ].forEach(([y, n, sh]) => {
    o.push([1066, y, 13]);
    t.push([1066, y, n, 4], [1066, y + 22, sh, 4], [1038, y - 9, 'BOTH GEN. PROTECTION RELAY IN TROUBLE', 2]);
  });
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'G-8B',
    title: 'ALARM FOR GENERATOR PROTECTION (2/2)',
    page: 19,
    dwg: '310SD03-743',
    of: 20,
    f: [203, 116, 2176, 1513],
    fs: 1.2,
    ar: 1,
    o,
    s,
    b,
    r,
    w,
    t,
    l,
    e,
    a,
    j
  });
})();
