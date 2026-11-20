/* TCA775 GEN MONITOR (331DM09788 page 199, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn, three rows alike:
   - PULSE SIM (ref, TCA102) switches DSW 001 / 006 / 011 and drives T of FLK B005 / B010 / B015 (T1:1.0, T2:1.0, fed by ON(1)).
   - Each DSW gives the FLK pulse or OFF(0) (1000kWH/P, 1000kVvarh, 10kWH/P) to PI of the PI CNT A002 / A007 / A012 (LMA710,
     TW:1.0, K:1.0, HL:1000000.0, LL:0.0, K:1.0, K:0.0, K:999999.0).
   - OUT through FTR 003 / 008 / 013 = GEN.WATT HOUR / GEN.VAR HOUR / EX.TR.WATT HOUR to CRT TCA775_A1 / A2 / A3, and through
     FTR 004 / 009 / 014 to A1 / B1 / C1.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [],
    b = [],
    m = [],
    d = [],
    c = [],
    j = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const WT = (key, ...pts) => w.push([key, pts, 1]);
  const HW = 28.76,
    xD = 1080,
    xF = 855,
    xP = 1240,
    PW = 234;
  /* the pulse and ON(1) buses */
  W('kPulse', [553, 181], [xD, 181], [xD, 287 - 21.5]);
  W('kPulse', [998, 181], [998, 746], [xD, 746], [xD, 821 - 21.5]);
  W('kPulse', [998, 480], [xD, 480], [xD, 555 - 21.5]);
  W('kPulse', [794, 181], [794, 885], [xF, 885], [xF, 949 - 21.5]);
  [351, 619].forEach((y, i) => W('kPulse', [794, y], [xF, y], [xF, [415, 683][i] - 21.5]));
  W('kOn', [551, 404], [xF - HW, 404]);
  W('kOn', [761, 404], [761, 938], [xF - HW, 938]);
  W('kOn', [761, 672], [xF - HW, 672]);
  j.push([794, 181], [998, 181], [794, 351], [794, 619], [998, 480], [761, 404], [761, 672]);
  /* the rows: [out y, FLK, DSW, PI CNT, OFF key, OFF left x, unit, FTR crt, FTR out, words, CRT tag, letter] */
  const ROWS = [
    [276, 'B005', '001', 'A002', 'kOff1', 211, '(1000kWH/P)', '003', '004', 'GEN.WATT HOUR', 'TCA775_A1', 'A1'],
    [544, 'B010', '006', 'A007', 'kOff2', 209, '(1000kVvarh)', '008', '009', 'GEN.VAR HOUR', 'TCA775_A2', 'B1'],
    [810, 'B015', '011', 'A012', 'kOff3', 196, '(10kWH/P)', '013', '014', 'EX.TR.WATT HOUR', 'TCA775_A3', 'C1']
  ];
  const K = [];
  ROWS.forEach(([y, fl, ds, pi, off, ox, unit, f1, f2, s, tag, o]) => {
    const yF = y + 128, // the FLK input / output line
      top = y - 32,
      y2 = y + 64;
    b.push(['flk' + fl, 'FLK', fl, xF, yF + 11, ['T1:1.0', 'T2:1.0']], ['dsw' + ds, 'DSW', ds, xD, y + 11]);
    b.push(['ftr' + f1, 'o:FTR', f1, 1613, y], ['ftr' + f2, 'o:FTR', f2, 1613, y2]);
    t.push([807, yF - 7, 'T']);
    K.push([off, ox, y + 22, 'OFF(0)', 'sys.ref']);
    t.push([ox + 147, y + 60, unit, 1]);
    W('flk' + fl, [xF + HW, yF], [942, yF], [942, y], [xD - HW, y]);
    WT(off, [ox + 233, y + 22], [xD - HW, y + 22]);
    WT('dsw' + ds, [xD + HW, y], [xP, y]);
    const pk = 'pi' + pi;
    m.push([
      pk,
      'PI CNT',
      '',
      xP,
      top,
      PW,
      128,
      ['PI', 'IN1'],
      ['OUT'],
      pi,
      ['TW:1.0', 'K:1.0', 'HL:1000000.0', 'LL:0.0', 'K:1.0', 'K:0.0', 'K:999999.0'].map((n, i) => [1160, Math.round(top + 128 + 21.3 * i), n]),
      [
        [y, y + 23],
        [y]
      ]
    ]);
    t.push([xP + PW / 2 + 1, top + 153, '(LMA710)', 1]);
    WT(pk + '.OUT', [xP + PW, y], [1975 - 35, y]);
    WT(pk + '.OUT', [1527, y], [1527, y2], [1966 - 27, y2]);
    j.push([1527, y]);
    d.push(['crt' + o, 1975, y, 'out', tag, 'S', '#1C']);
    c.push(['o' + o, 'out', o, 1966, y2, '', ['-'], 1, 0]);
    t.push([1703, y - 4, s], [1703, y2 - 4, s]);
  });
  t.push(
    [476, 222, '(TCA102)', 1],
    [229, 1530, 'CONTROLLER:'],
    [390, 1530, 'COMM+MD'],
    [615, 1503, 'TRIGGER  :'],
    [615, 1530, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA775',
    title: 'GEN MONITOR',
    page: 199,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [160, 83, 2222, 1547],
    k: [['kPulse', 320, 181, 'PULSE SIM', 'ref'], ['kOn', 318, 404, 'ON(1)', 'sys.ref'], ...K],
    c,
    d,
    b,
    m,
    w,
    j,
    t
  });
})();
