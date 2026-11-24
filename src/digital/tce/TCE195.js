/* TCE195 GOVERNOR CONTROL(1) (331DM09784 page 135, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of
   the page rendered 2296 wide. The MW demand (ASW024: the target MW demand in DCS control mode, else the target load (TCS)) minus
   GEN. MW, through LMS 027 (limits PA2 027: the load up / down rate (or +/-0.06 in runback) x 2.5) and G 021 (K 1, site adjustment for
   the DCS interface), is the PI controller PIV C022 (G1 0.05, G2 1.0, TI 5.0, -5.0 .. 110.0) that tracks GOV.SET in INITIAL.
   GOV.CONTROL SIGNAL = ASW004 (governing mode): the speed control signal, or ASW003 (TCE184 C): the PIV output or ASW015 (load up or
   initial load control mode): the load control signal, or the heat soak reset speed steps (-0.01 / +0.01 %, else 0.0). CCS SET POINT =
   the MW demand, CCS ACTUAL SET = GOV.SET. */
(typeof window !== 'undefined' ? (window.TCE_SHEETS = window.TCE_SHEETS || []) : []).push({
  id: 'TCE195',
  /* pr: printed on page 135 beside each block; the drawing above keeps them as text */
  pr: {
    sgC005: ['K:0.06'],
    sgC008: ['K:-0.06'],
    sgB017: ['K:-0.01%'],
    sgB019: ['K:0.01%']
  },
  title: 'GOVERNOR CONTROL(1)',
  page: 135,
  ctl: 'EHG+MD',
  cycle: 30,
  f: [172, 82, 2227, 1550],
  /* live: the engine's state of the signals named on this sheet (tcs.js tcsLiveRead) */
  live: { iGmw: ['mw', 'MW'], iGov: ['govSet', '%'] },
  k: [
    ['kGov', 290, 141, 'GOVERNING MODE', 'ref'],
    ['kInit', 857, 183, 'INITIAL', 'ref'],
    ['kZero', 963, 502, '0.0', 'sys.ref'],
    ['kZero2', 288, 1270, '0.0', 'sys.ref']
  ],
  c: [
    ['iDcs', 'in', 'A', 308, 218, 'DCS CONTROL MODE ON', ['TCE180']],
    ['iTmw', 'in', 'A1', 308, 282, 'TARGET MW DEMAND', ['TCE103']],
    ['iRb', 'in', 'C', 308, 335, 'RUNBACK COMMAND', ['-'], 1],
    ['iLur', 'in', 'A', 308, 453, 'LOAD UP RATE', ['TCE185']],
    ['iLdr', 'in', 'B', 308, 570, 'LOAD DOWN RATE', ['TCE185']],
    ['iGmw', 'in', 'A', 308, 633, 'GEN. MW', ['TCE070']],
    ['iGov', 'in', 'A', 308, 717, 'GOV.SET', ['TCE196']],
    ['iTl', 'in', 'A', 308, 771, 'TARGET LOAD(TCS)', ['TCE194']],
    ['iLum', 'in', 'B', 308, 825, 'LOAD UP or INIT LOAD CONTROL MODE', ['TCE191']],
    ['iLcs', 'in', 'A', 308, 921, 'LOAD CONTROL SIGNAL', ['TCE191']],
    ['iDec', 'in', 'B', 308, 994, 'DEC.SPEED(HEAT SOAK RESET)', ['TCE179']],
    ['iInc', 'in', 'A', 308, 1134, 'INC.SPEED(HEAT SOAK RESET)', ['TCE179']],
    ['iSpd', 'in', 'A', 308, 1343, 'SPEED CONTROL SIGNAL', ['TCE169']],
    ['iC', 'in', 'C', 1343, 186, '', []], /* the ref stands under the circle (text) */
    ['oGov', 'out', 'A', 2089, 282, 'GOV.CONTROL SIGNAL', ['TCE196', 'TCE205']],
    ['oB1', 'out', 'B1', 2077, 631, 'CCS SET POINT', ['TCE610']],
    ['oD1', 'out', 'D1', 2087, 771, '', ['-']],
    ['oC1', 'out', 'C1', 2085, 939, 'CCS ACTUAL SET', ['-'], 1]
  ],
  d: [
    ['dA1', 2031, 556, 'out', 'TCE195_A1', 'S', '#1C'],
    ['dA2', 2031, 864, 'out', 'TCE195_A2', 'S', '#1C']
  ],
  b: [
    /* the MW demand and the PI control */
    ['asw024', 'ASW', '024', 617, 290],
    ['sub001', 'SUB', '001', 885, 290],
    ['lms027', 'LMS', '027', 1012, 290],
    ['g021', 'G', '021', 1119, 290, ['K:1']],
    ['pivC022', 'PIV', '022', 1280, 302, ['G1:0.05', 'G2:1.0', 'TI:5.0', 'HL:110.0', 'LL:-5.0', 'ML:110.0'], { l: ['X', 'F', 'Z'] }, [79, 64]],
    ['asw003', 'ASW', '003', 1438, 290],
    ['asw004', 'ASW', '004', 1576, 290],
    /* the rate limits */
    ['sgC005', 'SG', 'C005', 436, 375],
    ['asw006', 'ASW', '006', 650, 375],
    ['g028', 'G', '028', 926, 375, ['K:2.5']],
    ['pa2027', 'PA2', '027', 1045, 375, [], {}, [59, 85]],
    ['sgC008', 'SG', 'C008', 436, 504],
    ['asw009', 'ASW', '009', 671, 504],
    ['g029', 'G', '029', 926, 448, ['K:2.5']],
    /* the load control signal and the heat soak reset */
    ['asw015', 'ASW', '015', 1106, 928],
    ['sgB017', 'SG', 'B017', 434, 1056],
    ['asw018', 'ASW', '018', 946, 1056],
    ['sgB019', 'SG', 'B019', 434, 1195],
    ['asw020', 'ASW', '020', 786, 1195],
    /* the CCS outputs */
    ['ftr011', 'o:FTR', '011', 1268, 554],
    ['ftr012', 'o:FTR', '012', 1574, 554],
    ['ftr013', 'o:FTR', '013', 1574, 628],
    ['ftr023', 'o:FTR', '023', 1573, 768],
    ['ftr014', 'o:FTR', '014', 1574, 862],
    ['ftr016', 'o:FTR', '016', 1574, 936]
  ],
  w: [
    /* the MW demand and the PI control */
    ['iDcs', [[335, 215], [617, 215], [617, 269]]],
    ['iTmw', [[335, 279], [588, 279]], 1],
    ['iTl', [[335, 768], [576, 768], [576, 301], [588, 301]], 1],
    ['asw024', [[646, 279], [856, 279]], 1],
    ['asw024', [[820, 279], [820, 554], [2007, 554]], 1],
    ['asw024', [[1520, 554], [1520, 628], [2050, 628]], 1],
    ['iGmw', [[335, 630], [842, 630], [842, 301], [856, 301]], 1],
    ['sub001', [[914, 279], [983, 279]], 1],
    ['lms027', [[1041, 279], [1090, 279]], 1],
    ['g021', [[1148, 279], [1240, 279]], 1],
    ['kInit', [[1092, 182], [1280, 182], [1280, 270]]],
    ['kZero', [[1198, 501], [1217, 501], [1217, 302], [1240, 302]], 1],
    ['iGov', [[335, 714], [1227, 714], [1227, 324], [1240, 324]], 1],
    ['iGov', [[776, 714], [776, 862], [2007, 862]], 1],
    ['iGov', [[1518, 862], [1518, 936], [2058, 936]], 1],
    ['pivC022', [[1320, 279], [1409, 279]], 1],
    ['iC', [[1370, 183], [1438, 183], [1438, 269]]],
    ['asw003', [[1467, 279], [1547, 279]], 1],
    ['kGov', [[525, 140], [1576, 140], [1576, 269]]],
    ['iSpd', [[335, 1340], [1500, 1340], [1500, 301], [1547, 301]], 1],
    ['asw004', [[1605, 279], [2062, 279]], 1],
    /* the rate limits */
    ['iRb', [[335, 332], [650, 332], [650, 354]]],
    ['iRb', [[596, 332], [596, 462], [671, 462], [671, 483]]],
    ['sgC005', [[465, 364], [621, 364]], 1],
    ['iLur', [[335, 450], [610, 450], [610, 386], [621, 386]], 1],
    ['asw006', [[679, 364], [897, 364]], 1],
    ['asw006', [[862, 364], [862, 768], [2060, 768]], 1],
    ['g028', [[955, 364], [1015, 364]], 1],
    ['sgC008', [[465, 493], [642, 493]], 1],
    ['iLdr', [[335, 567], [616, 567], [616, 515], [642, 515]], 1],
    ['asw009', [[700, 493], [884, 493], [884, 437], [897, 437]], 1],
    ['g029', [[955, 437], [1005, 437], [1005, 385], [1015, 385]], 1],
    /* the load control signal and the heat soak reset */
    ['iLum', [[335, 822], [1106, 822], [1106, 907]]],
    ['iLcs', [[335, 918], [1077, 918]], 1],
    ['asw015', [[1135, 918], [1398, 918], [1398, 301], [1409, 301]], 1],
    ['iDec', [[335, 991], [946, 991], [946, 1035]]],
    ['sgB017', [[463, 1045], [917, 1045]], 1],
    ['asw018', [[975, 1045], [1053, 1045], [1053, 939], [1077, 939]], 1],
    ['iInc', [[335, 1131], [786, 1131], [786, 1174]]],
    ['sgB019', [[463, 1184], [757, 1184]], 1],
    ['asw020', [[815, 1184], [891, 1184], [891, 1067], [917, 1067]], 1],
    ['kZero2', [[522, 1269], [734, 1269], [734, 1206], [757, 1206]], 1]
  ],
  t: [
    [437, 168, '(TCE167)'],
    [1003, 209, '(TCE050)'],
    [1305, 217, '(TCE184)'],
    [310, 383, 'K:0.06'],
    [310, 512, 'K:-0.06'],
    [308, 1065, 'K:-0.01%'],
    [318, 1203, 'K:0.01%'],
    [848, 269, '+'],
    [848, 290, '-'],
    [1150, 266, '(*)'],
    [940, 353, '(HL)'],
    [962, 418, '(LL)'],
    [1803, 544, 'CCS SET POINT'],
    [1801, 852, 'CCS ACTUAL SET'],
    [527, 1460, '(*) site adjustment for DCS interface'],
    [240, 1525, 'CONTROLLER:'],
    [402, 1525, 'EHG+MD'],
    [625, 1497, 'TRIGGER  :'],
    [625, 1523, 'CYCLE(ms):30']
  ]
});
