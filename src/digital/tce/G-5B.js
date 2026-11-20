/* SH-G-5B GENERATOR PROTECTION LOGIC "A" (2/2) (Generator Protection / Breaker Logic Diagram 310SD03-743 rev 1, sheet 14). Typed from the
   drawing; units = the pixels of the page rendered 2296 wide. Pole slip, VT fuse failure, under and over frequency of the generator
   protection panel A (each with 52G closed and 60FLA not on where the drawing has it) out to SH-G-8A and into one OR gate: generator
   protection "A" operated / not operated. Below: the ST trip of protection A or B to the generator trip and the two breaker trip coils
   (the mark: the signal also goes to that panel). */
(function () {
  if (typeof window === 'undefined') return;
  const o = [],
    s = [],
    b = [],
    r = [],
    w = [],
    t = [],
    l = [],
    a = [],
    j = [];
  /* a continuation circle: the number in it, the sheet beside it */
  const circ = (x, y, n, sh, sx) => {
    o.push([x, y, 13]);
    t.push([x, y, n, 4]);
    if (sh) t.push([sx, y + 5, sh]);
  };
  /* a gate: bar x, centre y, the bar from y1 to y2 */
  const gate = (k, ty, bar, y, y1, y2) => {
    b.push([k, 'G:' + ty, '', bar + 9, y, [], {}, [18, ty === 'OR' ? 18 : 20, 0]]);
    l.push([[bar, y1], [bar, y2]]);
  };
  /* an on delay timer: left x, centre y, the time */
  const di = (k, x, y, tm) => {
    r.push([k, x, y - 12, 31, 24, '']);
    t.push([x + 16, y - 5, 'DI', 4], [x + 16, y + 6, tm, 4]);
  };
  /* a relay of the panel: tag, name, top / bottom, the contacts [key, word] */
  const relay = (tg, nm, y1, y2, P) => {
    l.push([[254, y1], [585, y1]], [[585, y1], [585, y2]], [[585, y2], [254, y2]], [[254, y2], [254, y1]], [[521, y1], [521, y2]]);
    t.push([256, y1 - 8, '(' + tg + ')'], [344, y1 - 8, '(GPP)'], [266, (y1 + y2) / 2, nm]);
    const hh = (y2 - y1) / P.length;
    P.forEach(([k, z], i) => {
      const ya = y1 + hh * i;
      if (i) l.push([[521, ya], [585, ya]]);
      t.push([553, ya + hh / 2, z, 4]);
      s.push([k, 521, Math.round(ya), 585, Math.round(ya + hh)]);
    });
  };
  /* a mark that the signal also goes to a panel: x, top / bottom, words, the lines it crosses; the top arrow points right */
  const mark = (x, y1, y2, z1, z2, X) => {
    const P = [y1, ...X.flatMap(y => [y - 6, y + 6]), y2];
    for (let i = 0; i < P.length; i += 2) l.push([[x, P[i]], [x, P[i + 1]]]);
    a.push([[x, y1], [x + 18, y1]], [[x, y2], [x - 18, y2]]);
    t.push([x + 21, y1 + 4, z1], [x - 20, y2 + 4, z2, 2]);
  };
  /* the relays of the panel */
  relay('78A', 'POLE SLIP', 306, 338, [['r78', 'ON']]);
  relay('60FLA', 'VT FUSE FAILURE', 375, 406, [['r60', 'ON']]);
  relay('81LA', 'UNDER FREQUENCY', 435, 488, [['r81l1', '1ST STEP'], ['r81l2', '2ND STEP']]);
  relay('81HA', 'OVER FREQUENCY', 536, 590, [['r81h1', '1ST STEP'], ['r81h2', '2ND STEP']]);
  /* the inputs from the other sheets: [key, number, sheet, x, line, words] */
  [
    ['i52', '2', 'SH-G-5A', 266, 268, '52G CLOSED'],
    ['ia', '1', 'SH-G-5A', 262, 752, 'ST TRIP/GEN. PROTECTION "A" OPERATED (86G-A)'],
    ['ib', '1', 'SH-G-6A', 262, 843, 'ST TRIP/GEN. PROTECTION "B" OPERATED (86G-B)']
  ].forEach(([k, n, sh, x, y, z]) => {
    circ(x, y, n);
    s.push([k, x - 13, y - 13, x + 13, y + 13]);
    t.push([x + 18, y - 9, z], [x + 18, y + 15, sh]);
  });
  /* the gates */
  gate('g1', 'A', 809, 310, 259, 361);
  gate('g2', 'A', 808, 431, 408, 457);
  gate('g3', 'A', 808, 491, 467, 514);
  gate('g4', 'A', 808, 540, 522, 557);
  gate('g5', 'A', 808, 593, 567, 619);
  gate('gor', 'OR', 1090, 449, 296, 607);
  gate('gt1', 'OR', 721, 705, 682, 725);
  gate('gt2', 'OR', 720, 767, 745, 788);
  gate('gt3', 'OR', 720, 828, 807, 848);
  b.push(['nc1', 'NC', '', 629, 351, [], {}, [8]], ['nc2', 'NC', '', 1642, 405, [], {}, [8]]);
  di('d1', 849, 431, 't');
  di('d2', 849, 491, 't');
  di('d3', 849, 540, 't');
  di('d4', 849, 593, 't');
  /* 52G closed (bus 755) and 60FLA not on (bus 767) */
  w.push(
    ['i52', [[279, 268], [809, 268]]],
    ['i52', [[755, 268], [755, 611], [808, 611]]],
    ['i52', [[755, 431], [808, 431]]],
    ['i52', [[755, 508], [808, 508]]],
    ['i52', [[755, 530], [808, 530]]],
    ['r60', [[585, 391], [669, 391]]],
    ['r60', [[593, 391], [593, 351], [621, 351]], 0, 0],
    ['nc1', [[637, 351], [809, 351]]],
    ['nc1', [[767, 351], [767, 491], [808, 491]]],
    ['nc1', [[767, 381], [1006, 381]]],
    ['nc1', [[767, 414], [808, 414]]]
  );
  j.push([755, 268], [755, 431], [755, 508], [755, 530], [593, 391], [767, 351], [767, 381], [767, 414]);
  /* the relays into the gates, the timers and the OR gate */
  w.push(
    ['r78', [[585, 322], [809, 322]]],
    ['g1', [[828, 310], [1090, 310]]],
    ['g1', [[902, 310], [902, 287], [1006, 287]]],
    ['r81l1', [[585, 448], [808, 448]]],
    ['g2', [[827, 431], [849, 431]]],
    ['d1', [[880, 431], [1006, 431]]],
    ['r81l2', [[585, 475], [808, 475]]],
    ['g3', [[827, 491], [849, 491]]],
    ['d2', [[880, 491], [901, 491], [901, 504], [1090, 504]]],
    ['d2', [[901, 491], [901, 468], [1006, 468]]],
    ['r81h1', [[585, 551], [808, 551]]],
    ['g4', [[827, 540], [849, 540]]],
    ['d3', [[880, 540], [1006, 540]]],
    ['r81h2', [[585, 577], [808, 577]]],
    ['g5', [[827, 593], [849, 593]]],
    ['d4', [[880, 593], [900, 593], [900, 606], [1090, 606]]],
    ['d4', [[900, 593], [900, 570], [1006, 570]]],
    ['gor', [[1109, 449], [1961, 449]]],
    ['gor', [[1603, 449], [1603, 405], [1634, 405]], 0, 0],
    ['nc2', [[1650, 405], [1961, 405]]]
  );
  j.push([902, 310], [901, 491], [900, 593], [1603, 449]);
  /* the outputs: [line, words, number, sheet, x of the circle] */
  [
    [287, '78A "ON"', '17', 'SH-G-8A', 1019],
    [381, '60FLA NOT "ON"', '1', 'SH-G-5A', 1019],
    [431, '81LA "1ST STEP"', '19', 'SH-G-8A', 1019],
    [468, '81LA "2ND STEP"', '20', 'SH-G-8A', 1019],
    [540, '81HA "1ST STEP"', '21', 'SH-G-8A', 1019],
    [570, '81HA "2ND STEP"', '22', 'SH-G-8A', 1019],
    [405, 'GEN. PROTECTION "A" NOT OPERATED', '16', 'SH-G-2B', 1974],
    [449, 'GEN. PROTECTION "A" OPERATED', '4', 'SH-G-6B', 1974],
    [705, 'GENERATOR TRIP', '15', 'SH-G-8B', 1974],
    [767, 'GEN. PROTECTION OPERATED (52G-TC1)', '2', 'SH-G-1A', 1974],
    [828, 'GEN. PROTECTION OPERATED (52G-TC2)', '3', 'SH-G-1A', 1974]
  ].forEach(([y, z, n, sh, x]) => {
    t.push([x - 28, y - 9, z, 2]);
    circ(x, y, n, sh, x + 17);
  });
  circ(682, 391, '10', 'SH-G-8A', 699);
  t.push([596, 382, '60FLA "ON"']);
  /* the ST trip of protection A or B to the generator trip and the breaker trip coils */
  w.push(
    ['ia', [[275, 752], [720, 752]]],
    ['ia', [[587, 752], [587, 688], [721, 688]]],
    ['ia', [[587, 752], [587, 813], [720, 813]]],
    ['ib', [[275, 843], [720, 843]]],
    ['ib', [[637, 843], [637, 719], [721, 719]]],
    ['ib', [[637, 783], [720, 783]]],
    ['gt1', [[740, 705], [1961, 705]]],
    ['gt2', [[739, 767], [1961, 767]]],
    ['gt3', [[739, 828], [1961, 828]]]
  );
  j.push([587, 752], [637, 843], [637, 783]);
  mark(1261, 752, 844, 'OTHERS', '(GPP)', [767, 828]);
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'G-5B',
    title: 'GENERATOR PROTECTION LOGIC "A" (2/2)',
    page: 14,
    dwg: '310SD03-743',
    of: 20,
    f: [205, 118, 2178, 1512],
    fs: 1.2,
    ar: 1,
    o,
    s,
    b,
    r,
    w,
    t,
    l,
    a,
    j
  });
})();
