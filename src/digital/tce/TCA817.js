/* TCA817 COM ALARM(DI PS ABNORMAL) (331DM09788 page 226, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn:
   - COM DI P.S. NORMAL (GXR1) ... (GXR14) (A16 from TCA040 ... TCA053) and MODBUS IF DI P.S. NORMAL (GXR15) (A16 from TCT040),
     each through a BTR (001 / 005 / 009 / 012 / 015 / 018 / 021 / 025 / 029 / 032 / 035 / 038 / 041 / 044 / 047) and a NOT
     (002 / 006 / 010 / 013 / 016 / 019 / 022 / 027 / 030 / 033 / 036 / 039 / 042 / 045 / 048) that sets a flip-flop (FFS 003 /
     007 / 011 / 014 / 017 / 020 / 023 / 028 / 031 / 034 / 037 / 040 / 043 / 046 / 049); ANN RESET (TCA100) resets all of them.
   - The 15 flip-flops into OR 050 = COM DI P.S. ABNORMAL, A (to TCA822).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    b = [],
    c = [],
    t = [],
    j = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const Y = [209, 283, 358, 433, 507, 582, 657, 731, 806, 881, 955, 1030, 1104, 1179, 1243],
    NB = ['001', '005', '009', '012', '015', '018', '021', '025', '029', '032', '035', '038', '041', '044', '047'],
    NN = ['002', '006', '010', '013', '016', '019', '022', '027', '030', '033', '036', '039', '042', '045', '048'],
    NF = ['003', '007', '011', '014', '017', '020', '023', '028', '031', '034', '037', '040', '043', '046', '049'],
    I = [209, 231, 252, 273, 294, 315, 336, 357, 378, 399, 420, 441, 462, 483, 503],
    XB = [1313, 1335, 1355, 1375, 1396, 1416, 1436, 1457, 1477, 1497, 1518, 1538, 1559, 1580],
    xBus = 1168;
  Y.forEach((y, i) => {
    const key = 'i' + NB[i],
      last = i === 14;
    c.push([key, 'in', 'A16', 318, y, '', [last ? 'TCT040' : 'TCA0' + (40 + i)], 0, 1]);
    t.push([366, y - 8, last ? 'MODBUS IF DI P.S. NORMAL (GXR15)' : 'COM DI P.S. NORMAL (GXR' + (i + 1) + ')'], [1193, y - 18, 'T']);
    b.push(
      ['btr' + NB[i], 'o:BTR', NB[i], 840, y],
      ['not' + NN[i], 'NOT', NN[i], 1066, y + 4],
      ['ffs' + NF[i], 'FFS', NF[i], 1248, y + 11, [], { l: ['S', 'R'] }, [80, 43]]
    );
    W(key, [345, y], [1037, y]);
    W('not' + NN[i], [1095, y], [1208, y]);
    W('kAnnR', [xBus, y + 21.5], [1208, y + 21.5]);
    if (i) j.push([xBus, y + 21.5]);
    if (i === 0) W('ffs' + NF[i], [1288, y], [1603, I[0]]);
    else W('ffs' + NF[i], [1288, y], [XB[i - 1], y], [XB[i - 1], I[i]], [1603, I[i]]);
  });
  W('kAnnR', [593, 1360], [xBus, 1360], [xBus, 230.5]);
  b.push(['or050', 'OR', '050', 1632.5, 359, [], {}, [59, 322]]);
  W('or050', [1662, 209], [2112 - 27, 209]);
  c.push(['oA', 'out', 'A', 2112, 209, '', ['TCA822'], 0, 1]);
  t.push(
    [1742, 202, 'COM DI P.S. ABNORMAL'],
    [492, 1392, '(TCA100)'],
    [234, 1524, 'CONTROLLER:'],
    [396, 1524, 'COMM+MD'],
    [621, 1497, 'TRIGGER  :'],
    [621, 1524, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA817',
    title: 'COM ALARM(DI PS ABNORMAL)',
    page: 226,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [166, 80, 2230, 1544],
    k: [['kAnnR', 360, 1360, 'ANN RESET', 'ref']],
    c,
    b,
    w,
    j,
    t
  });
})();
