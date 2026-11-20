/* TCA750 THSC INTERLOCK(1) (331DM09788 page 180, controller COMM+MD, cycle 100 ms). Typed from the drawing; units = the pixels of the
   page rendered 2296 wide. Gate by gate as drawn:
   - OR 002 of NOT 001 (INITIAL) and four input errors: HP-T inner casing 1st stage inner wall metal temp (lower) abnormal (D1 of
     TCA360), outer wall metal temp (lower) abnormal (D1 of TCA364), reheat bowl inner wall metal temp input error (A of TCA370) and RH
     bowl outer wall metal temp (lower) abnormal (D3 of TCA356).
   - The OR output is THSC INPUT ABNORMAL: B out (to TCA751), the lamp TCA750_1, and B1 out (double outline, sheet printed as (-)).
   The words are the ones of the drawing (IST STG, MET as printed).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const w = [],
    t = [];
  const W = (key, ...pts) => w.push([key, pts]);
  const ORL = 1143.3,
    ORR = 1201.3,
    DOT = 1586.7;
  W('kInit', [570, 214], [813.2, 214]);
  W('not001', [870.8, 214], [ORL, 214]);
  W('iD1a', [441, 320], [1002, 320], [1002, 235.3], [ORL, 235.3]);
  W('iD1b', [441, 384.7], [1023.3, 384.7], [1023.3, 256.7], [ORL, 256.7]);
  W('iA', [441, 448.7], [1044.7, 448.7], [1044.7, 278], [ORL, 278]);
  W('iD3', [441, 513.3], [1064.7, 513.3], [1064.7, 299.3], [ORL, 299.3]);
  W('or002', [ORR, 214], [2061, 214]);
  W('or002', [DOT, 214], [DOT, 364], [1996.7, 364]);
  W('or002', [DOT, 300], [1996.7, 300]);
  t.push(
    [501, 253, '(TCA100)', 1],
    [467, 296, 'HP-T INNER CASING IST STG'],
    [467, 318, 'INNER WALL MET TEMP(LOWER)ABN.'],
    [467, 360, 'HP-T INNER CASING IST STG'],
    [467, 381, 'OUTER WALL MET TEMP(LOWER)ABN.'],
    [467, 424, 'REHEAT BOWL INNER WALL METAL'],
    [467, 445, 'TEMP. INPUT ERROR'],
    [467, 489, 'RH BOWL OUTER WALL'],
    [467, 509, 'METAL TEMP.(LOWER)ABN.'],
    [1751, 214, 'THSC INPUT ABNORMAL'],
    [1751, 299, 'THSC INPUT ABNORMAL'],
    [1751, 363, 'THSC INPUT ABNORMAL'],
    [236, 1527, 'CONTROLLER:'],
    [395, 1527, 'COMM+MD'],
    [620, 1500, 'TRIGGER  :'],
    [620, 1527, 'CYCLE(ms):100']
  );
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA750',
    title: 'THSC INTERLOCK(1)',
    page: 180,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [172, 85, 2226, 1545],
    k: [['kInit', 337, 214, 'INITIAL', 'ref']],
    c: [
      ['iD1a', 'in', 'D1', 414, 320, '', ['TCA360']],
      ['iD1b', 'in', 'D1', 414, 384.7, '', ['TCA364']],
      ['iA', 'in', 'A', 414, 448.7, '', ['TCA370']],
      ['iD3', 'in', 'D3', 414, 513.3, '', ['TCA356']],
      ['oB', 'out', 'B', 2088, 214, '', ['TCA751']],
      ['oB1', 'out', 'B1', 2023.7, 364, '', ['-'], 1]
    ],
    d: [['crt1', 2031.7, 300, 'out', 'TCA750_1', 'S', '#1C']],
    b: [
      ['not001', 'NOT', '001', 842, 224.5],
      ['or002', 'OR', '002', 1172.3, 257, [], {}, [58, 107.4]],
      ['btr007', 'o:BTR', '007', 1641, 300],
      ['btr008', 'o:BTR', '008', 1640, 364]
    ],
    w,
    j: [
      [DOT, 214],
      [DOT, 300]
    ],
    t
  });
})();
