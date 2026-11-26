/* SH-G-6A GENERATOR PROTECTION LOGIC "B" (1/2) (Generator Protection / Breaker Logic Diagram 310SD03-743 rev 1, sheet 15). Typed from the
   drawing; units = the pixels of the page rendered 2296 wide (the scan of sheet 15 is turned a little; its layout is the one of SH-G-5A, measured on sheet 13). The relays of the generator protection panel B (GPP): each relay (with its
   delay, with 52G closed and 60FLB not on where the drawing has it) out to SH-G-8A and into one OR gate to the lockout relay 86G-B; 86G-B
   out to the ST trip, the 41 trip demand, the breaker sheets, the annunciator, the SOE and the fault recorder (each mark: the signal also
   goes to that panel). */
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
    r.push([k, x, y - 12, 33, 24, '']);
    t.push([x + 16, y - 5, 'DI', 4], [x + 16, y + 6, tm, 4]);
  };
  /* a relay of the panel: tag, name, top / bottom, the contacts [key, word] */
  const relay = (tg, nm, y1, y2, P) => {
    l.push([[244, y1], [575, y1]], [[575, y1], [575, y2]], [[575, y2], [244, y2]], [[244, y2], [244, y1]], [[512, y1], [512, y2]]);
    t.push([246, y1 - 9, '(' + tg + ')'], [335, y1 - 9, '(GPP)'], [258, (y1 + y2) / 2, nm]);
    const hh = (y2 - y1) / P.length;
    P.forEach(([k, z], i) => {
      const ya = y1 + hh * i;
      if (i) l.push([[512, ya], [575, ya]]);
      t.push([543, ya + hh / 2, z, 4]);
      s.push([k, 512, Math.round(ya), 575, Math.round(ya + hh)]);
    });
  };
  /* a mark that the signal also goes to a panel: x, top / bottom, words, the lines it crosses; rev: the top arrow points right */
  const mark = (x, y1, y2, z1, z2, X, rev) => {
    const P = [y1, ...X.flatMap(y => [y - 6, y + 6]), y2];
    for (let i = 0; i < P.length; i += 2) l.push([[x, P[i]], [x, P[i + 1]]]);
    if (rev) {
      a.push([[x, y1], [x + 18, y1]], [[x, y2], [x - 18, y2]]);
      t.push([x + 21, y1 + 4, z1], [x - 20, y2 + 4, z2, 2]);
    } else {
      a.push([[x, y1], [x - 18, y1]], [[x, y2], [x + 18, y2]]);
      t.push([x - 20, y1 + 4, z1, 2], [x + 21, y2 + 4, z2]);
    }
  };
  /* the relays of the panel */
  relay('87GB', 'PHASE DIFFERENTIAL OF GENERATOR', 175, 208, [['r87', 'ON']]);
  relay('59GNB', 'GEN. EARTH FAULT', 293, 326, [['r59g', 'ON']]);
  relay('40B', 'LOSS OF EXCITATION (ZONE 1)', 367, 399, [['r40a', 'ON']]);
  relay('40B', 'LOSS OF EXCITATION (ZONE 2)', 445, 477, [['r40b', 'ON']]);
  relay('24B', 'VOLTS/HERTZ', 618, 700, [['r24a', '1ST STEP'], ['r24b', '2ND STEP'], ['r24c', '3RD STEP']]);
  relay('46B', 'NEGATIVE-PHASE SEQ.', 847, 901, [['r46a', '1ST STEP'], ['r46b', '2ND STEP']]);
  relay('59B', 'OVER VOLTAGE', 948, 1001, [['r59a', '1ST STEP'], ['r59b', '2ND STEP']]);
  relay('51VB', 'VOLTAGE RESTRAINED PHASE OVER CURRENT', 1050, 1082, [['r51', 'ON']]);
  relay('32B', 'REVERSE POWER', 1129, 1182, [['r32a', '1ST STEP'], ['r32b', '2ND STEP']]);
  relay('50B', 'HIGH SET PHASE OVER CURRENT', 1262, 1294, [['r50', 'ON']]);
  relay('27B', 'UNDER VOLTAGE', 1321, 1353, [['r27', 'ON']]);
  /* the inputs from the other sheets: [key, number, sheet, line, words] */
  [
    ['i60', '1', 'SH-G-6B', 520, '60FLB NOT "ON"'],
    ['i52', '1', 'SH-G-1A', 570, '52G CLOSED'],
    ['iavr', '4', 'SH-G-4', 1225, 'AVR MAJOR TROUBLE'],
    ['ibt', '2', 'SH-G-8B', 1377, 'BOTH GEN. PROTECTION RELAY IN TROUBLE'],
    ['ist', '6', 'SH-G-9', 1422, 'ST TRIP (FOR GENERATOR TRIP)']
  ].forEach(([k, n, sh, y, z]) => {
    circ(253, y, n);
    s.push([k, 240, y - 13, 266, y + 13]);
    t.push([270, y - 10, z], [270, y + 13, sh]);
  });
  /* the gates */
  gate('g1', 'A', 838, 399, 373, 425);
  gate('g2', 'A', 838, 477, 452, 503);
  gate('g3', 'A', 838, 630, 560, 682);
  gate('gvh', 'OR', 685, 673, 649, 696);
  gate('g4', 'A', 838, 819, 796, 843);
  gate('g5', 'A', 838, 1056, 1036, 1076);
  gate('g6', 'A', 838, 1126, 1100, 1152);
  gate('g7', 'A', 838, 1186, 1159, 1212);
  gate('g8', 'A', 838, 1337, 1309, 1366);
  gate('gor', 'OR', 1080, 818, 179, 1387);
  b.push(['nca', 'NC', '', 808, 570, [], {}, [9]]);
  di('d59g', 600, 310, 't');
  di('d24b', 599, 659, 't');
  di('d24c', 599, 686, 't');
  di('d59a', 838, 930, 't');
  di('d59b', 838, 988, 't');
  di('d32', 642, 1169, '10s');
  di('d27', 866, 1337, 't');
  /* 52G closed (bus) and 60FLB not on (bus) */
  w.push(
    ['i52', [[266, 570], [799, 570]], 0, 0],
    ['nca', [[817, 570], [838, 570]]],
    ['i52', [[761, 570], [761, 399], [838, 399]]],
    ['i52', [[761, 477], [838, 477]]],
    ['i52', [[761, 542], [997, 542]]],
    ['i52', [[761, 570], [761, 1319], [838, 1319]]],
    ['i52', [[761, 836], [838, 836]]],
    ['i52', [[761, 1110], [838, 1110]]],
    ['i52', [[761, 1186], [838, 1186]]],
    ['i60', [[266, 520], [788, 520]], 0, 0],
    ['i60', [[788, 520], [788, 415], [838, 415]]],
    ['i60', [[788, 493], [838, 493]]],
    ['i60', [[788, 520], [788, 1356], [838, 1356]]],
    ['i60', [[788, 1046], [838, 1046]]],
    ['i60', [[788, 1126], [838, 1126]]],
    ['i60', [[788, 1204], [838, 1204]]]
  );
  j.push([761, 477], [761, 542], [761, 570], [761, 836], [761, 1110], [761, 1186], [788, 493], [788, 520], [788, 1046], [788, 1126], [788, 1204]);
  /* the relays into the gates, the timers and the OR gate to 86G-B */
  w.push(
    ['r87', [[575, 191], [1080, 191]]],
    ['r87', [[891, 191], [891, 168], [997, 168]]],
    ['r59g', [[575, 310], [600, 310]]],
    ['d59g', [[633, 310], [1080, 310]]],
    ['d59g', [[788, 310], [788, 237], [997, 237]]],
    ['r40a', [[575, 383], [838, 383]]],
    ['g1', [[858, 399], [1080, 399]]],
    ['g1', [[889, 399], [889, 377], [997, 377]]],
    ['r40b', [[575, 460], [838, 460]]],
    ['g2', [[858, 477], [1080, 477]]],
    ['g2', [[889, 477], [889, 453], [997, 453]]],
    ['r24a', [[575, 632], [675, 632]]],
    ['r24b', [[575, 659], [599, 659]]],
    ['r24c', [[575, 686], [599, 686]]],
    ['d24b', [[632, 659], [685, 659]]],
    ['d24b', [[657, 659], [657, 720], [997, 720]]],
    ['d24c', [[632, 686], [685, 686]]],
    ['d24c', [[643, 686], [643, 774], [997, 774]]],
    ['gvh', [[704, 673], [838, 673]]],
    ['gvh', [[723, 673], [723, 805], [838, 805]]],
    ['g3', [[858, 630], [997, 630]]],
    ['g4', [[858, 819], [1080, 819]]],
    ['r46a', [[575, 861], [675, 861]]],
    ['r46b', [[575, 888], [1080, 888]]],
    ['r46b', [[889, 888], [889, 865], [997, 865]]],
    ['r59a', [[575, 961], [811, 961], [811, 930], [838, 930]]],
    ['d59a', [[871, 930], [997, 930]]],
    ['r59b', [[575, 988], [838, 988]]],
    ['d59b', [[871, 988], [1080, 988]]],
    ['d59b', [[888, 988], [888, 963], [997, 963]]],
    ['r51', [[575, 1066], [838, 1066]]],
    ['g5', [[858, 1056], [1080, 1056]]],
    ['g5', [[888, 1056], [888, 1030], [997, 1030]]],
    ['r32a', [[575, 1142], [838, 1142]]],
    ['g6', [[858, 1126], [997, 1126]]],
    ['r32b', [[575, 1169], [642, 1169]]],
    ['d32', [[675, 1169], [838, 1169]]],
    ['g7', [[858, 1186], [1080, 1186]]],
    ['g7', [[888, 1186], [888, 1160], [997, 1160]]],
    ['iavr', [[266, 1225], [1080, 1225]]],
    ['r50', [[575, 1278], [1080, 1278]]],
    ['r50', [[887, 1278], [887, 1255], [997, 1255]]],
    ['r27', [[575, 1337], [838, 1337]]],
    ['g8', [[858, 1337], [866, 1337]]],
    ['d27', [[899, 1337], [1080, 1337]]],
    ['d27', [[913, 1337], [913, 1311], [997, 1311]]],
    ['ibt', [[266, 1377], [1080, 1377]]]
  );
  j.push([891, 191], [788, 310], [889, 399], [889, 477], [657, 659], [643, 686], [723, 673], [889, 888], [888, 988], [888, 1056], [888, 1186], [887, 1278], [913, 1337]);
  /* the outputs to SH-G-8A and the other sheets: [line, words, number, sheet, x of the circle] */
  [
    [168, '87GB "ON"', '12', 'SH-G-8A', 1010],
    [237, '59GNB "ON"', '36', 'SH-G-8A', 1010],
    [377, '40B ZONE 1 "ON"', '26', 'SH-G-8A', 1010],
    [453, '40B ZONE 2 "ON"', '27', 'SH-G-8A', 1010],
    [542, '52G CLOSED', '2', 'SH-G-6B', 1010],
    [630, '', '6', 'SH-G-*', 1010],
    [632, '24B "1ST STEP"', '9', 'SH-G-8A', 688],
    [720, '24B "2ND STEP"', '7', 'SH-G-8A', 1010],
    [774, '24B "3RD STEP"', '15', 'SH-G-8A', 1010],
    [861, '46B "1ST STEP"', '8', 'SH-G-8A', 688],
    [865, '46B "2ND STEP"', '14', 'SH-G-8A', 1010],
    [930, '59B "1ST STEP"', '23', 'SH-G-8A', 1010],
    [963, '59B "2ND STEP"', '24', 'SH-G-8A', 1010],
    [1030, '51VB "ON"', '25', 'SH-G-8A', 1010],
    [1126, '32B "1ST STEP"', '11', 'SH-G-8A', 1010],
    [1160, '32B "2ND STEP"', '28', 'SH-G-8A', 1010],
    [1255, '50B "ON"', '43', 'SH-G-8A', 1010],
    [1311, '27B "ON"', '44', 'SH-G-8A', 1010]
  ].forEach(([y, z, n, sh, x]) => {
    if (z) t.push(x < 900 ? [581, y - 9, z] : [x - 25, y - 9, z, 2]);
    circ(x, y, n, sh, x + 17);
  });
  t.push([985, 607, '24B "2ND or 3RD STEP"', 2], [985, 620, '(BEFORE STARTUP)', 2]);
  /* the lockout relay 86G-B */
  l.push([[1145, 803], [1477, 803]], [[1477, 803], [1477, 858]], [[1477, 858], [1145, 858]], [[1145, 858], [1145, 803]], [[1416, 803], [1416, 858]], [[1145, 830], [1477, 830]]);
  t.push([1146, 795, '(86G-B)'], [1240, 795, '(GPP)'], [1160, 817, 'GEN. LOCKOUT RELAY "B"'], [1160, 844, 'RELAY COIL OPEN "B"'], [1446, 817, 'ON', 4], [1446, 844, 'ON', 4]);
  s.push(['k86', 1416, 803, 1477, 830], ['krc', 1416, 830, 1477, 858]);
  w.push(['gor', [[1099, 818], [1145, 818]]]);
  /* the inputs from the other sheets in the middle */
  [
    ['m7', '5', 'SH-G-7', 537, ['GEN. TRANSF. AND UNIT TRANSF.', 'PROTECTION OPERATED (BY OTHERS)']],
    ['m6', '6', 'SH-G-*', 589, ['24B "2ND or 3RD STEP"', '(BEFORE STARTUP)']],
    ['m8', '6', 'SH-G-7', 732, ['GEN. TRANSF. AND UNIT TRANSF.', 'PROTECTION OPERATED (BY OTHERS)']]
  ].forEach(([k, n, sh, y, Z]) => {
    circ(1156, y, n);
    s.push([k, 1143, y - 13, 1169, y + 13]);
    t.push([1176, y - 22, Z[0]], [1176, y - 9, Z[1]], [1176, y + 13, sh]);
    w.push([k, [[1169, y], [1678, y]]]);
  });
  /* the OR gates of the trips */
  gate('gt1', 'OR', 1678, 385, 350, 418);
  gate('gt2', 'OR', 1678, 560, 526, 594);
  gate('gt3', 'OR', 1678, 715, 689, 739);
  b.push(['ncb', 'NC', '', 1687, 463, [], {}, [9]]);
  w.push(
    ['ist', [[266, 1422], [1148, 1422], [1148, 1209], [1487, 1209], [1487, 361], [1678, 361]]],
    ['k86', [[1477, 817], [1953, 817]]],
    ['k86', [[1514, 817], [1514, 409], [1678, 409]]],
    ['k86', [[1514, 463], [1678, 463]], 0, 0],
    ['ncb', [[1696, 463], [1952, 463]]],
    ['k86', [[1514, 560], [1678, 560]]],
    ['k86', [[1514, 697], [1678, 697]]],
    ['k86', [[1640, 697], [1640, 647], [1952, 647]]],
    ['k86', [[1540, 817], [1540, 779], [1953, 779]]],
    ['krc', [[1477, 844], [1953, 844]]],
    ['gt1', [[1697, 385], [1952, 385]]],
    ['gt2', [[1697, 560], [1952, 560]]],
    ['gt3', [[1697, 715], [1952, 715]]]
  );
  j.push([1514, 817], [1514, 463], [1514, 560], [1514, 697], [1640, 697], [1540, 817]);
  circ(1965, 385, '1', 'SH-G-5B', 1982);
  circ(1965, 463, '3', 'SH-G-1B', 1982);
  circ(1965, 560, '4', 'SH-G-4', 1982);
  circ(1965, 715, '5', 'SH-G-9', 1982);
  [
    [647, 'ANN'],
    [779, 'FTRP'],
    [817, 'SOE'],
    [844, 'ANN']
  ].forEach(([y, z]) => r.push(['', 1953, y - 9, 34, 18, z]));
  t.push(
    [1938, 349, 'ST TRIP/', 2],
    [1938, 361, 'GEN. PROTECTION "B"', 2],
    [1938, 374, 'OPERATED (86G-B)', 2],
    [1938, 441, 'GEN. PROTECTION "B"', 2],
    [1938, 454, 'NOT OPERATED (86G-B)', 2],
    [1938, 521, '41 TRIP DEMAND FROM GEN.', 2],
    [1938, 534, 'PROTECTION B, GEN. TRANSF. &', 2],
    [1938, 547, 'UNIT PROTECTION', 2],
    [1938, 638, 'GEN. LOCKOUT RELAY "B" OPERATED', 2],
    [1938, 678, 'ST TRIP DEMAND FROM GEN.', 2],
    [1938, 691, 'PROTECTION B, GEN. TRANSF. &', 2],
    [1938, 704, 'UNIT PROTECTION', 2],
    [1938, 835, 'RELAY COIL OPEN "B" OPERATED', 2]
  );
  /* the marks: the signal also goes to that panel */
  mark(682, 1410, 1438, '(TCS)', '(GPP)', [1422]);
  mark(1579, 682, 709, '(TCS)', '(GPP)', [697], 1);
  mark(1579, 762, 831, 'OTHERS', '(GPP)', [779, 817], 1);
  mark(1579, 831, 862, '(TCS)', '(GPP)', [844], 1);
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'G-6A',
    /* the relay times the drawing prints only as "t": the as-set Time Delay of each element of the Beckwith M-3425A of protection B,
       from LM-GEE-2015-0059 R1 Inspection Report GPP Limay Unit 1 (page of the report). The time of the 24 2nd step (d24b) is the relay's inverse time curve (#1, time dial 2, pickup
       107 %): TINV (tce-run.js), the curve form from the vendor test points (lane 0 read 2026-11-26). */
    set: {
      d24b: ['TINV', 'TD:2', 'PU:107', 'RST:30', 'p.49 24B inverse #1: time dial 2, pickup 107 %, reset 30 s; curve form from the vendor test points (LM-GEE-2015-0059 p.22)'],
      d59g: ['TP:10', 'p.63 59GNB operating time 10.00 s'],
      d24c: ['TP:2', 'p.49 24B Def. time #1 (Trip) 24-3rd 120 cycles (2.0 s)'],
      d59a: ['TP:2', 'p.61 59B #1 (Alarm) operating time 2.000 s'],
      d59b: ['TP:20', 'p.61 59B #2 (Trip) operating time 20.00 s'],
      d27: ['TP:2', 'p.57 27B operating time 2.000 s']
    },
    title: 'GENERATOR PROTECTION LOGIC "B" (1/2)',
    page: 15,
    dwg: '310SD03-743',
    of: 20,
    f: [204, 128, 2168, 1518],
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
