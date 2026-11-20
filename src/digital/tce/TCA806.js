/* TCA806 COMM ALARM(HARDWARE)(15) (331DM09788 page 218, controller COMM+MD, cycle 100 ms). Typed from the drawing;
   units = the pixels of the page rendered 2296 wide. As drawn:
   - UNIT 0 SLOT-5 ... SLOT-B DI ERROR (A1 ... A6 from TCA800, A1 from TCA800A) and OFF(0) through BTR 001 / 005 / 008 / 011 /
     014 / 017 / 020 / 023 into OR 002 = DI ERROR.
   - UNIT1 SLOT-6 ... SLOT-C AI ERROR (TCA801, TCA801A ... TCA801D) and UNIT1 SLOT-0 ... SLOT-3 THC / SLOT-4 RTD AI ERROR
     (TCA802 ... TCA802C, TCA803) through BTR 006 / 009 / 012 / 015 / 018 / 021 / 024 / 026 / 038 / 039 / 040 / 041 into
     OR 028 = AI ERROR.
   - UNIT 0 SLOT-C / D / E DO ERROR (A1 / A2 / A3 from TCA804) and OFF(0) through BTR 030 / 032 / 033 / 034 into OR 031 = DO ERROR.
   - UNIT1 SLOT-D / E AO ERROR (A1 / A2 from TCA805) through BTR 035 / 037 into OR 036 = AO ERROR.
   - DI / AI / DO / AO ERROR into OR 027; it sets FFS 042, ANN RESET resets it: COM I/O HARD ERROR = B (to TCA822), and
     through BTR 029 to CRT TCA806_1.
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    b = [],
    c = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const HW = 28.76;
  /* one column of inputs into an OR: [in cx, rows, BTR x, BTR nos, OR left x, OR inputs, bends, letters, refs (or the OFF tip x),
     labels, text x] */
  const col = (cx, Y, xB, NB, xOR, YI, XB, L, F, T, xt) =>
    Y.forEach((y, i) => {
      const off = L[i] === 'OFF',
        key = off ? 'kOff' + NB[i] : 'i' + NB[i];
      if (!off) {
        c.push([key, 'in', L[i], cx, y, '', [F[i]], 0, 1]);
        t.push([xt, y - 30, T[i][0]], [xt, y - 8, T[i][1]]);
      }
      b.push(['btr' + NB[i], 'o:BTR', NB[i], xB, y]);
      const x0 = off ? F[i] : cx + 27;
      if (i === 0) W(key, [x0, y], [xOR, y]);
      else W(key, [x0, y], [XB[i - 1], y], [XB[i - 1], YI[i]], [xOR, YI[i]]);
    });
  /* DI */
  col(
    254,
    [207, 316, 423, 530, 637, 743, 850, 955],
    465,
    ['001', '005', '008', '011', '014', '017', '020', '023'],
    587,
    [207, 227, 247, 267, 287, 307, 327, 347],
    [496, 507, 519, 530, 541, 551, 563],
    ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A1', 'OFF'],
    ['TCA800', 'TCA800', 'TCA800', 'TCA800', 'TCA800', 'TCA800', 'TCA800A', 428],
    ['5', '6', '7', '8', '9', 'A', 'B'].map((s) => ['UNIT 0 SLOT-' + s, 'DI ERROR']),
    286
  );
  /* AI */
  const S1 = ['6', '7', '8', '9', 'A', 'B', 'C'].map((s) => ['UNIT1 SLOT-' + s, 'AI ERROR']);
  ['0', '1', '2', '3'].forEach((s) => S1.push(['UNIT1 SLOT-' + s, 'THC AI ERROR']));
  S1.push(['UNIT1 SLOT-4', 'RTD AI ERROR']);
  col(
    737,
    [303, 411, 518, 624, 731, 837, 944, 1050, 1135, 1242, 1348, 1455],
    928,
    ['006', '009', '012', '015', '018', '021', '024', '026', '038', '039', '040', '041'],
    1101,
    [303, 324, 345, 366, 387, 408, 429, 450, 471, 492, 513, 534],
    [985, 995, 1005, 1015, 1025, 1035, 1045, 1055, 1065, 1075, 1085],
    ['A', 'B', 'A', 'A', 'B', 'A', 'A', 'A', 'A', 'A', 'A', 'A'],
    ['TCA801', 'TCA801', 'TCA801A', 'TCA801B', 'TCA801B', 'TCA801C', 'TCA801D', 'TCA802', 'TCA802A', 'TCA802B', 'TCA802C', 'TCA803'],
    S1,
    765
  );
  /* DO */
  col(
    1227,
    [367, 474, 580, 686],
    1450,
    ['030', '032', '033', '034'],
    1537,
    [367, 384, 401, 418],
    [1505, 1515, 1525],
    ['A1', 'A2', 'A3', 'OFF'],
    ['TCA804', 'TCA804', 'TCA804', 1400],
    ['C', 'D', 'E'].map((s) => ['UNIT 0 SLOT-' + s, 'DO ERROR']),
    1258
  );
  /* AO */
  col(
    1224,
    [813, 909],
    1448,
    ['035', '037'],
    1574.5 - HW,
    [813, 835],
    [1535],
    ['A1', 'A2'],
    ['TCA805', 'TCA805'],
    ['D', 'E'].map((s) => ['UNIT1 SLOT-' + s, 'AO ERROR']),
    1256
  );
  b.push(
    ['or002', 'OR', '002', 617, 281.5, [], {}, [60, 173]],
    ['or028', 'OR', '028', 1130.5, 419, [], {}, [59, 258]],
    ['or031', 'OR', '031', 1567, 397.5, [], {}, [60, 85]],
    ['or036', 'OR', '036', 1574.5, 824],
    ['or027', 'OR', '027', 1749, 238, [], {}, [58, 87]],
    ['ffs042', 'FFS', '042', 1855, 216, [], { l: ['S', 'R'] }, [80, 43]],
    ['btr029', 'o:BTR', '029', 1996, 322]
  );
  W('or002', [647, 207], [1720, 207]);
  W('or028', [1160, 303], [1690, 303], [1690, 227], [1720, 227]);
  W('or031', [1597, 367], [1697, 367], [1697, 245], [1720, 245]);
  W('or036', [1574.5 + HW, 813], [1705, 813], [1705, 262], [1720, 262]);
  W('or027', [1778, 205], [1815, 205]);
  W('kAnnR', [1460, 1121], [1785, 1121], [1785, 226.5], [1815, 226.5]);
  W('ffs042', [1895, 205], [2100 - 27, 205]);
  W('ffs042', [1920, 205], [1920, 322], [2105 - 35, 322]);
  c.push(['oB', 'out', 'B', 2100, 205, '', ['TCA822'], 0, 1]);
  t.push(
    [728, 194, 'DI ERROR'],
    [1240, 290, 'AI ERROR'],
    [1592, 340, 'DO ERROR'],
    [1598, 788, 'AO ERROR'],
    [1802, 192, 'T', 1],
    [1880, 160, 'COM I/O'],
    [1880, 181, 'HARD ERROR'],
    [1990, 267, 'COM I/O'],
    [1990, 288, 'HARD ERROR'],
    [242, 1522, 'CONTROLLER:'],
    [401, 1522, 'COMM+MD'],
    [540, 1490, 'TRIGGER  :'],
    [540, 1517, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA806',
    title: 'COMM ALARM(HARDWARE)(15)',
    page: 218,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [172, 76, 2232, 1542],
    k: [
      ['kOff023', 195, 955, 'OFF(0)', 'sys.ref'],
      ['kOff034', 1167, 686, 'OFF(0)', 'sys.ref'],
      ['kAnnR', 1227, 1121, 'ANN RESET', 'ref']
    ],
    c,
    d: [['crt1', 2105, 322, 'out', 'TCA806_1', 'S', '#1C']],
    b,
    w,
    j: [[1920, 205]],
    t
  });
})();
