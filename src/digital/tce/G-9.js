/* SH-G-9 TURBINE OPERATION (Generator Protection / Breaker Logic Diagram 310SD03-743 rev 1, sheet 20). Typed from the drawing; units =
   the pixels of the page rendered 2296 wide. The signals between the turbine control (310SC90-774 / -775) and the generator sheets:
   each comes in on the left and goes on to the sheet on the right ("-" in a circle: no number on the drawing). The scan is a little
   turned; each line is at the height of its left end. */
(function () {
  if (typeof window === 'undefined') return;
  const o = [],
    s = [],
    w = [],
    t = [];
  /* [line, number in, words, from, number out, to (one or two lines)] */
  [
    [184, '1', '52G OPENED', 'SH-G-1A', '12', ['SH-TC-2', '(310SC90-774)']],
    [250, '-', '41 OPEN COMMAND FOR TURBINE SHUT-DOWN (ATS)', '(310SC90-775, SH-30)', '14', ['SH-G-4']],
    [334, '2', 'ST TRIP (41 OPEN)', '(310SC90-774, SH-TA-1)', '1', ['SH-G-4']],
    [382, '1', 'TURBINE RATED SPEED (TCS)', '(310SC90-774, SH-TD-1)', '2', ['SH-G-4']],
    [430, '-', 'EXCITATION AUTO START SIGNAL (TCS/ATS)', '(310SC90-775, SH-24)', '3', ['SH-G-4']],
    [522, '1', 'ST TRIP (FOR GENERATOR TRIP)', '(310SC90-774, SH-TA-6)', '4', ['SH-G-5A']],
    [618, '2', 'ST TRIP (FOR GENERATOR TRIP)', '(310SC90-774, SH-TA-6)', '6', ['SH-G-6A']],
    [727, '-', '52G CLOSE ORDER (TCS/ATS)', '(310SC90-775, SH-25)', '8', ['SH-G-1B']],
    [824, '32', '52L OPENED (FOR HOUSE LOAD OPERATION)', 'SH-G-2A', '15', ['SH-TD-10', '(310SC90-774)']],
    [932, '5', 'ST TRIP DEMAND FROM GEN. PROTECTION A, GEN. TRANSF. & UNIT PROTECTION', 'SH-G-5A', '9', ['SH-TA-9', '(310SC90-774)']],
    [1041, '5', 'ST TRIP DEMAND FROM GEN. PROTECTION B, GEN. TRANSF. & UNIT PROTECTION', 'SH-G-6A', '10', ['SH-TA-9', '(310SC90-774)']],
    [1150, '5', '52G CLOSED (FOR HOUSE LOAD OPERATION)', 'SH-G-1A', '11', ['SH-TA-6', '(310SC90-774)']],
    [1246, '-', '52L CLOSED ORDER (TCS/ATS)', '(310SC90-775, SH-25)', '13', ['SH-G-2B']]
  ].forEach(([y, n, z, sh, m, to], i) => {
    const k = 'i' + i;
    o.push([266, y, 13], [1976, y, 13]);
    t.push([266, y, n, 4], [284, y - 9, z], [284, y + 12, sh], [1976, y, m, 4]);
    if (to.length > 1) t.push([1994, y - 7, to[0]], [1994, y + 7, to[1]]);
    else t.push([1994, y, to[0]]);
    s.push([k, 253, y - 13, 279, y + 13]);
    w.push([k, [[279, y], [1962, y]]]);
  });
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push({
    id: 'G-9',
    title: 'TURBINE OPERATION',
    page: 20,
    dwg: '310SD03-743',
    of: 20,
    f: [203, 116, 2176, 1518],
    fs: 1.2,
    ar: 1,
    o,
    s,
    w,
    t
  });
})();
