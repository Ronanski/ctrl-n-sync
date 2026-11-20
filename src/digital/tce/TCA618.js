/* TCA618 CV(B) BEL SEAT SEC DRAIN VALVE(TC-5) (331DM09788 page 152, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the
   pixels of the page rendered 2296 wide. The inching motor valve nMV-STn-008 (TORQUE (INCHING) A021, LMA589). Auto open (OR 029): CV(B)
   BEL SEAT SEC WARMING DRAIN VALVE FULL OPEN COMMAND or 52G OPEN (TW60s). Auto close (OR 030): ICV TO CV TRANSFER COMPLETED or CV(B)
   BEL SEAT SEC DRAIN VALVE CLOSE COMMAND. With its electrical trouble, limit and torque switches and its position (analog) in; OPEN /
   CLOSE COMMAND, OPENED, CLOSED, POSITION SIM (analog, FTR 033) and AUTO out; the position itself also goes out (FTR 032).
   The words are the ones of the drawing; the tag keeps the small n of the drawing (the unit number).
   live: the transfer signal from the engine (tcs.js tcsLiveRead); the engine holds no state of this valve. */
(function () {
  if (typeof window === 'undefined') return;
  const c = [],
    b = [],
    w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const T = (key, ...pts) => w.push([key, pts, 1]);
  const MX = 1260,
    MR = 1665;
  /* the switches of the valve: [key, letter, x of the connector, y, the two lines of words, BTR, x of the BTR, x of the riser, y of the pin] */
  [
    ['iA3', 'A3', 321, 619, ['CV(B) BEL SEAT SEC DRAIN VALVE', 'ELECTRICAL TROUBLE'], '018', 1166, 941, 397],
    ['iA1o', 'A1', 320, 746, ['CV(B) BEL SEAT SEC DRAIN VALVE', 'OPENED'], '019', 1166, 983, 429],
    ['iA12', 'A12', 319, 852, ['CV(B) BEL SEC WARMING DRAIN', 'VALVE TORQUE SW OPEN'], '023', 1165, 1025, 461],
    ['iA2', 'A2', 318, 980, ['CV(B) BEL SEAT SEC DRAIN VALVE', 'CLOSED'], '024', 1165, 1067, 526],
    ['iA13', 'A13', 317, 1086, ['CV(B) BEL SEC WARMING DRAIN', 'VALVE TORQUE SW CLOSE'], '025', 1164, 1109, 558]
  ].forEach(([key, l, cx, y, names, btr, bx, rx, py]) => {
    c.push([key, 'in', l, cx, y, '', ['TCA044']]);
    t.push([cx + 34, y - 31, names[0]], [cx + 34, y - 10, names[1]]);
    b.push(['btr' + btr, 'o:BTR', btr, bx, py]);
    W(key, [cx + 27, y], [rx, y], [rx, py], [MX, py]);
  });
  c.push(
    ['iA1w', 'in', 'A1', 325, 214, '', ['TCA633']],
    ['iC1g', 'in', 'C1', 324, 300, '', ['TCA611']],
    ['iC1t', 'in', 'C1', 323, 396, '', ['TCA610']],
    ['iA5', 'in', 'A5', 322, 502, '', ['TCA632']],
    ['iA3p', 'in', 'A3', 316, 1181, '', ['TCA322']],
    ['oA1', 'out', 'A1', 2082, 300, '', ['TCA830']],
    ['oA2', 'out', 'A2', 2081, 387, '', ['TCA830']],
    ['oB1', 'out', 'B1', 2080, 473, '', ['TCA633']],
    ['oB2', 'out', 'B2', 2078, 569, '', ['-']],
    ['oD1', 'out', 'D1', 2078, 633, '', ['TCA322']],
    ['oC1', 'out', 'C1', 2077, 686, '', ['TCA631']],
    ['oC2', 'out', 'C2', 2081, 1181, '', ['-']]
  );
  b.push(
    ['btr014', 'o:BTR', '014', 1167, 300],
    ['btr016', 'o:BTR', '016', 1167, 332],
    ['btr020', 'o:BTR', '020', 1731, 300],
    ['btr026', 'o:BTR', '026', 1730, 387],
    ['btr027', 'o:BTR', '027', 1729, 473],
    ['btr028', 'o:BTR', '028', 1780, 558],
    ['or029', 'OR', '029', 986, 290],
    ['or030', 'OR', '030', 986, 353],
    ['btr031', 'o:BTR', '031', 1727, 686],
    ['ftr032', 'o:FTR', '032', 1712, 1181],
    ['ftr033', 'o:FTR', '033', 1759, 633]
  );
  /* auto open: OR 029; auto close: OR 030 */
  W('iA1w', [352, 214], [912, 214], [912, 279], [956, 279]);
  W('iC1g', [351, 300], [956, 300]);
  W('or029', [1016, 279], [1136, 279], [1136, 300], [MX, 300]);
  W('iC1t', [350, 396], [850, 396], [850, 343], [956, 343]);
  W('iA5', [349, 502], [889, 502], [889, 364], [956, 364]);
  W('or030', [1016, 343], [1136, 343], [1136, 332], [MX, 332]);
  /* the position: to the valve block and out */
  T('iA3p', [343, 1181], [2054, 1181]);
  T('iA3p', [1162, 1181], [1162, 590], [MX, 590]);
  /* out */
  W('vlv.OPS', [MR, 300], [2055, 300]);
  W('vlv.CLS', [MR, 364], [1688, 364], [1688, 387], [2054, 387]);
  W('vlv.LTOP', [MR, 429], [1692, 429], [1692, 473], [2053, 473]);
  W('vlv.LTCL', [MR, 493], [1745, 493], [1745, 558], [2041, 558], [2041, 569], [2051, 569]);
  T('vlv.POS.S', [MR, 526], [1728, 526], [1728, 633], [2051, 633]);
  W('vlv.AUTO', [MR, 590], [1684, 590], [1684, 686], [2050, 686]);
  [
    [251, 'OPEN COMMAND', 1823],
    [337, 'CLOSE COMMAND', 1822],
    [422, 'OPENED', 1821],
    [507, 'CLOSED', 1873],
    [581, 'POSITION SIM', 1851]
  ].forEach(([y, s, x]) => t.push([x, y, 'CV(B) BEL SEAT SEC'], [x, y + 21, 'DRAIN VALVE'], [x, y + 42, s]));
  t.push(
    [359, 183, 'CV(B) BEL SEAT SEC WARMING'],
    [359, 204, 'DRAIN VALVE FULL OPEN COMMAND'],
    [358, 290, '52G OPEN (TW60s)'],
    [357, 386, 'ICV TO CV TRANSFER COMPLETED'],
    [356, 471, 'CV(B) BEL SEAT SEC'],
    [356, 492, 'DRAIN VALVE CLOSE COMMAND'],
    [351, 1171, 'CV (B) BELOW SEAT SECONDARY WARMING DRAIN VALVE POSITION'],
    [1818, 655, 'CV(B) BEL SEC'],
    [1818, 676, 'DRAIN VALVE AUTO'],
    [229, 1521, 'CONTROLLER:'],
    [389, 1521, 'COMM+MD'],
    [614, 1495, 'TRIGGER  :'],
    [614, 1521, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA618',
    title: 'CV(B) BEL SEAT SEC DRAIN VALVE(TC-5)',
    page: 152,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [170, 82, 2218, 1546],
    live: { iC1t: 'xfer' },
    c,
    m: [
      [
        'vlv',
        'TORQUE (INCHING)',
        'nMV-STn-008',
        MX,
        253,
        MR - MX,
        384,
        ['AOP', 'ACL', '', 'EF', 'LTOP', 'TROP', '', 'LTCL', 'TRCL', 'POS'],
        ['OPS', '', 'CLS', '', 'LTOP', '', 'LTCL', 'POS.S', 'ABN', 'AUTO'],
        'A021',
        [
          [1367, 656, '(LMA589)'],
          ...['R :2.5', 'M :1', 'HL:100.0', 'LL:0.0', 'K:99.0%', 'K:1.0%', 'K:0.0%'].map((s, i) => [
            1264,
            Math.round(678 + 21.2 * i),
            s
          ])
        ]
      ]
    ],
    b,
    w,
    j: [[1162, 1181]],
    t
  });
})();
