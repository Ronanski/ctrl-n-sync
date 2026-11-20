/* TCA310 COMM INPUT SIGNAL DIAGNOSTICS(AI)(1) (331DM09788 page 41, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. Up to four analog inputs, each on one of the four lines of the sheet and drawn the same way: the AI box with its range,
   the PI/O connection (filled triangle) and its PI/O error, one AI DIAG.MD block (left or right on the sheet) with its simulation value (SG)
   and settings; the value goes out to connector A and, over it, to connector B (other controller, double outline); the abnormal signal to
   connector D. The marks and block numbers follow the line: line s has FTR 020+4s (B), 021+4s (input), 022+4s (A), BTR 023+4s (D). */
(function () {
  const r = [],
    g = [],
    b = [],
    c = [],
    m = [],
    w = [],
    t = [];
  const Y = [226, 537, 824, 1136] /* the four lines of the sheet */,
    num = v => String(v).padStart(3, '0');
  /* s = line (0-3), lab = [the two lines of the AI box], rng = range, card = PI/O point, tag = block tag, R = block at the right,
     sg = SG note, par = [H/L HL, LL, DEV HL, LL], B / A / D = sheets of the connectors; where the drawing differs: y (the line),
     mk (marks B, input, A, D), foot (block number), sgno (SG number), txt ([x, height over the line, words]), box ([left, width] of the AI box), dtp (DEV DEF TP),
     sim ({l: letter, x, ref: sheet, f: FTR mark}: simulation value from another sheet in place of the SG) */
  const ROWS = [
    {"s":0,"lab":["GLAND STEAM SEAL HEADER","PRESS. (A)"],"rng":"-1 -2kg/cm2g","card":1,"tag":"nPT-GSn001-1","sg":"K:0.5kg/cm2g","par":["2.06","-1.15","0.6","-0.6"],"B":["TCT200"],"A":["TCA371","TCA542"],"D":["TCA371","TCA810"]},
    {"s":1,"lab":["GEN. VOLTAGE (A-B)",""],"rng":"0 -18kV","card":2,"tag":"TCA310_A2","R":1,"sg":"K:13.8kV","par":["18.36","-0.9","3.6","-3.6"],"B":["TCT213"],"A":["TCA850"],"D":["TCA810"]},
    {"s":2,"lab":["GEN. CURRENT (A)",""],"rng":"0 -10kA","card":3,"tag":"TCA310_A3","sg":"K:0.0kA","par":["10.2","-0.5","2.0","-2.0"],"B":["TCT213"],"A":["TCA850"],"D":["TCA810"]}
  ];
  ROWS.forEach(q => {
    const s = q.s,
      k = s + 1,
      y = q.y || Y[s],
      mk = q.mk || [20 + 4 * s, 21 + 4 * s, 22 + 4 * s, 23 + 4 * s].map(num) /* marks: B, input, A, D */,
      mx = q.R ? 1306 : 1043 /* left edge of the block */,
      xr = mx + 235,
      sx = mx - (q.R ? 128 : 170) /* middle of the SG box */,
      M = 'm' + k;
    /* the analog input and its PI/O error */
    const bx = q.box || [215, 270] /* the AI box: left edge, width */,
      rx = q.box ? bx[0] + bx[1] + 11 : 490;
    r.push(['ai' + k, bx[0], y - 27, bx[1], 54, ''], ['pe' + k, 598, y + 30, 127, 23, 'PI/O error']);
    t.push(
      [bx[0] + 6, y - 6, q.lab[0]],
      [bx[0] + 6, y + 16, q.lab[1]],
      [bx[0] + 2, y + 43, 'AI'],
      [rx, y - 6, q.rng],
      [rx, y + 26, '4 -20mA'],
      [606, y - 20, '(TCA930-' + q.card + ')'],
      [614, y + 25, '(TCA930-' + q.card + ')']
    );
    w.push(['ai' + k, [[bx[0] + bx[1], y], [689, y]], 1], ...(q.x ? [] : [['ai' + k, [[705, y], [mx, y]]]]), ['pe' + k, [[725, y + 41], [mx - 32, y + 41], [mx - 32, y + 22], [mx, y + 22]]]);
    g.push([697, y, 'l']);
    b.push(['f' + mk[1], 'o:FTR', mk[1], 915, y]);
    /* the block, its simulation value and its settings */
    m.push([
      M,
      'AI DIAG.MD',
      q.tag,
      mx,
      y - 30,
      235,
      128,
      ['IN', 'ERR', 'SIM'],
      ['OUT', 'ABN'],
      q.foot || 'A' + num(2 + 5 * s),
      [
        [mx + 80, y + 116, '(LMA510)'],
        [mx - 23, y + 145, 'DEF N:3'],
        [mx - 2, y + 166, 'K:1'],
        [mx - 24, y + 188, 'H/L HL:' + q.par[0]],
        [mx - 2, y + 209, 'LL:' + q.par[1]],
        [mx - 24, y + 230, 'DEF TP:0.18S'],
        [mx + 137, y + 145, 'DEV HL:' + q.par[2]],
        [mx + 157, y + 166, 'LL:' + q.par[3]],
        [mx + 137, y + 188, 'DEF TP:' + (q.dtp || '0.03S')],
        [mx + 137, y + 209, 'DEF N:3'],
        [mx + 157, y + 230, 'K:1']
      ],
      [[y + 5, y + 27, y + 49], [y + 5, y + 49]]
    ]);
    if (q.sim) {
      /* the simulation value comes from another sheet: connector, its sheet under it at the left, maybe an FTR mark on the line */
      const p = q.sim;
      c.push(['iS' + k, 'in', p.l, p.x, y + 86, '', []]);
      t.push([p.x - 104, y + 118, '(' + p.ref + ')']);
      if (p.f) b.push(['f' + p.f, 'o:FTR', p.f, p.x + 65, y + 85]);
      w.push(['iS' + k, [[p.x + 27, y + 85], [mx - 22, y + 85], [mx - 22, y + 44], [mx, y + 44]], 1]);
    } else {
      b.push(['sg' + k, 'SG', q.sgno || 'B' + num(4 + 5 * s), sx, y + 97, [q.sg]]);
      w.push(['sg' + k, [[sx + 29, y + 85], [mx - 22, y + 85], [mx - 22, y + 44], [mx, y + 44]], 1]);
    }
    /* the outputs: the value to A and B, the abnormal signal to D */
    c.push(['oD' + k, 'out', 'D' + k, 2013, y + 107, '', q.D]);
    b.push(['b' + mk[3], 'o:BTR', mk[3], 1640, y + 107]);
    w.push([M + '.ABN', [[xr, y + 44], [1597, y + 44], [1597, y + 107], [1986, y + 107]]]);
    if (q.x) {
      /* a line the drawing builds its own way: its parts as typed (absolute places), the value of the block not used */
      for (const [a, L] of Object.entries(q.x)) ({ b, c, w, t })[a].push(...L);
      return;
    }
    c.push(['oB' + k, 'out', 'B' + k, 2013, y - 85, '', q.B, 1], ['oA' + k, 'out', 'A' + k, 2013, y, '', q.A]);
    b.push(
      ['f' + mk[0], 'o:FTR', mk[0], 1640, y - 85],
      ['f' + mk[2], 'o:FTR', mk[2], 1640, y]
    );
    w.push(
      [M + '.OUT', [[xr, y], [1986, y]], 1],
      [M + '.OUT', [[1585, y], [1585, y - 85], [1986, y - 85]], 1]
    );
    /* words the drawing prints on a line */
    if (q.txt) t.push(...q.txt.map(([x, dy, z]) => [x, y + dy, z]));
  });
  t.push([228, 1527, 'CONTROLLER:'], [388, 1527, 'COMM+MD'], [655, 1500, 'TRIGGER  :'], [655, 1527, 'CYCLE(ms):100']);
  (typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
    id: 'TCA310',
    title: 'COMM INPUT SIGNAL DIAGNOSTICS(AI)(1)',
    page: 41,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [180, 88, 2232, 1552],
    r,
    g,
    b,
    c,
    m,
    w,
    t
  });
})();
