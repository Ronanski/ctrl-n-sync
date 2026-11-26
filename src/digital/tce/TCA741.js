/* TCA741 GLAND SEAL STEAM HEADER PRESS.(UNLOADING) CONTROL (331DM09788 page 179, controller COMM+MD, cycle 100 ms). Typed from the
   drawing; units = the pixels of the page rendered 2296 wide. The pressure loop of the gland seal steam unloading valve nZT-GSn034, block
   by block as drawn:
   - GLAND SEAL STEAM PRESS (A1 of TCA371, -1 to 2 barg) is PV of the set station TCA741_1 (SET A030, LMA043, TR = SG A033 0.31 kg/cm2g);
     SUB 008 = PV minus its OUT, G A050 (K 33.334) of it is X of PIF C009 (G 1.0, TI 20.0, HL 105.0 %, LL -5.0 %).
   - PIF C009 tracks (top) on the AUT output of the valve station nZT-GSn034 (SET A031, LMA040); ASW 005 takes the PIF output in AUT, else
     the station OUT. AUT also goes out as C1 to TCA636. The ASW output = MV (lamp USLPV035), A1 to TCA850, A to TCA322, Z of PIF C009
     and, through the crossed circle, TR of the station; also C of LG C046 (T 1.0 s, INITIAL on its top).
   - The station POS = SPUV POS. (A2 of TCA322, 0-100 %): UCK A034 (99.0 %) = OPEN, LCK A035 (1.0 %) = CLOSE lamps.
   - SPUV abnormal: MR C041 (POS against LG C046, 20 %) or PI/O error (TCA932-2), A 043 with ANN ENABLE, TP C044 (1.0 s, INITIAL on its
     top) sets FFS 045, ANN RESET resets it: B out, lamp nZT-GSn034_ABN. ABN of the station = OR 040 of GLAND SEAL STEAM PRESS ABN (D1 of
     TCA371) and the FFS output taken inverted.
   The words are the ones of the drawing. The tags keep the small n of the drawing (the unit number).
   live: none; the engine holds no state of these signals, so the sheet is shown without states. */
(function () {
  if (typeof window === 'undefined') return;
  const h = 28.76,
    I = cx => cx - h,
    O = cx => cx + h;
  window.TCE_SHEETS = window.TCE_SHEETS || [];
  window.TCE_SHEETS.push({
    id: 'TCA741',
    title: 'GLAND SEAL STEAM HEADER PRESS.(UNLOADING) CONTROL',
    page: 179,
    ctl: 'COMM+MD',
    cycle: 100,
    f: [174, 80, 2224, 1540],
    k: [
      ['kInit', 345, 952.7, 'INITIAL', 'ref'],
      ['kAnnE', 1279, 1177.3, 'ANN ENABLE', 'ref'],
      ['kAnnR', 1279, 1251, 'ANN RESET', 'ref']
    ],
    c: [
      ['iA1', 'in', 'A1', 286.5, 400.5, '', ['TCA371']],
      ['iD1', 'in', 'D1', 283.5, 847, '', ['TCA371']],
      ['iA2', 'in', 'A2', 280, 1154.7, '', ['TCA322']],
      ['oA1', 'out', 'A1', 1982, 400.5, '', ['TCA850']],
      ['oC1', 'out', 'C1', 1968.5, 583, '', ['TCA636']],
      ['oA', 'out', 'A', 1968.5, 698.7, '', ['TCA322']],
      ['oB', 'out', 'B', 2112.7, 986.7, '', []] /* the drawing prints no sheet */
    ],
    d: [
      ['crtPpv', 1918, 168, 'out', 'USLPV035', 'S', '#1C'],
      ['crtAbn', 2120.3, 1071.3, 'out', '', 'S', '#1C'],
      ['crtPzso', 1078.3, 1154.7, 'out', 'nZT-GSn034_PZSO', 'S', '#1C'],
      ['crtPzsc', 1078.3, 1283, 'out', 'nZT-GSn034_PZSC', 'S', '#1C']
    ],
    r: [['pio', 1286.7, 1098.7, 123.3, 24.6, 'PI/O error']],
    m: [
      [
        'set1',
        'SET',
        'TCA741_1',
        498.7,
        506.7,
        86.6,
        148.6,
        ['PV', 'TR'],
        ['OUT'],
        'A030',
        [
          [506, 678, '(LMA043)'],
          [483, 704, 'R :2.5%/s'],
          [483, 725, 'M :10'],
          [483, 746, 'HL:100.0%'],
          [483, 767, 'LL:0.0%']
        ],
        [
          [543.3, 581.3],
          [543.3]
        ]
      ],
      [
        'set2',
        'SET',
        'nZT-GSn034',
        1234.7,
        506.7,
        85.3,
        150,
        ['ABN', 'POS', 'TR'],
        ['OUT', 'MAN', 'AUT', 'OPN', 'CLS'],
        'A031',
        [
          [1240, 678, '(LMA040)'],
          ...['R :2.5%/s', 'M :10', 'HL:100.0%', 'LL:0.0%', 'K:99.0%', 'K:1.0%', 'HL:2.0%', 'LL:-2.0%'].map((s, i) => [
            1240,
            Math.round(717 + 21.3 * i),
            s
          ])
        ],
        [
          [541, 563, 585],
          [541, 563, 585, 607, 629]
        ]
      ]
    ],
    b: [
      /* the pressure loop */
      ['sub008', 'SUB', '008', 671.5, 411.5],
      ['sgA033', 'SG', 'A033', 327.7, 592.3, ['K:0.31kg/cm2g']],
      ['gA050', 'G', 'A050', 820.5, 411.5, ['K:33.334']],
      ['pifC009', 'PIF', 'C009', 949, 421.5, ['G :1.0', 'TI:20.0', 'HL:105.0%', 'LL:-5.0%'], { l: ['X', 'F', 'Z'] }, [80, 63]],
      ['asw005', 'ASW', '005', 1535, 411.5],
      ['ftr036', 'o:FTR', '036', 1663, 168],
      ['ftr032', 'o:FTR', '032', 1640, 400.5],
      ['ftr049', 'o:FTR', '049', 1075.3, 561.3],
      ['x1', 'X', '', 986.7, 900],
      ['x2', 'X', '', 1191, 772],
      /* SPUV abnormal */
      ['lgC046', 'LG', 'C046', 1178.3, 1038.3, ['T:1.0S']],
      ['mrC041', 'MR', 'C041', 1316.7, 996.3, ['HL:20.0%', 'LL:-20.0%']],
      ['or042', 'OR', '042', 1517.7, 996.3],
      ['a043', 'A', '043', 1602.7, 996.3],
      ['tpC044', 'TP', 'C044', 1687.3, 996.3, ['TP:1.0S']],
      ['ffs045', 'FFS', '045', 1784, 996.3, [], { l: ['S', 'R'] }, [81, 43]],
      ['btr047', 'o:BTR', '047', 1868, 1071.3],
      ['btr027', 'o:BTR', '027', 763.3, 847],
      ['or040', 'OR', '040', 1115.3, 858.3],
      ['x3', 'X', '', 1093.3, 932],
      /* open / close */
      ['uckA034', 'UCK', 'A034', 792.5, 1165, ['K:99.0%']],
      ['lckA035', 'LCK', 'A035', 792.5, 1293, ['K:1.0%']]
    ],
    w: [
      /* the pressure loop */
      ['iA1', [[313.5, 400.5], [I(671.5), 400.5]], 1],
      ['iA1', [[478.7, 400.5], [478.7, 543.3], [498.7, 543.3]], 1],
      ['sgA033', [[O(327.7), 581.3], [498.7, 581.3]], 1],
      ['set1.OUT', [[585.3, 543.3], [632, 543.3], [632, 423], [I(671.5), 423]], 1],
      ['sub008', [[O(671.5), 400.5], [I(820.5), 400.5]], 1],
      ['gA050', [[O(820.5), 400.5], [909, 400.5]], 1],
      ['pifC009', [[989, 400.5], [I(1535), 400.5]], 1],
      ['set2.OUT', [[1320, 541], [1450, 541], [1450, 423], [I(1535), 423]], 1],
      ['set2.AUT', [[1320, 583], [1941.5, 583]]],
      ['set2.AUT', [[1353, 583], [1353, 337]]],
      ['set2.AUT', [[950, 390], [950, 337], [1534.7, 337], [1534.7, 390]]],
      /* the same line to the top (SW) of PIF C009, typed toward the PIF so its last point lands on the pin (phase 6; the HIACS record
         has a signal, 102_YY0277A, on this side input) */
      ['set2.AUT', [[1534.7, 337], [950, 337], [950, 390]]],
      /* MV and its users */
      ['asw005', [[O(1535), 400.5], [1955, 400.5]], 1],
      ['asw005', [[1608, 400.5], [1608, 168], [1883, 168]], 1],
      ['asw005', [[1608, 400.5], [1608, 900], [872, 900], [872, 443], [909, 443]], 1],
      ['asw005', [[1608, 698.7], [1941.5, 698.7]], 1],
      ['asw005', [[1190, 900], [1190, 583], [1234.7, 583]], 1],
      ['asw005', [[1018.7, 900], [1018.7, 1027.3], [I(1178.3), 1027.3]], 1],
      /* the valve position */
      ['iA2', [[307, 1154.7], [I(792.5), 1154.7]], 1],
      ['iA2', [[728.7, 1154.7], [728.7, 984.7], [1288, 984.7]], 1],
      ['iA2', [[933.3, 984.7], [933.3, 561.3], [1234.7, 561.3]], 1],
      ['iA2', [[728.7, 1154.7], [728.7, 1282], [I(792.5), 1282]], 1],
      ['uckA034', [[O(792.5), 1154.7], [1043.3, 1154.7]]],
      ['lckA035', [[O(792.5), 1282], [1043.3, 1282]]],
      /* SPUV abnormal */
      ['kInit', [[578, 952.7], [1688, 952.7], [1688, 974.7]]],
      ['kInit', [[1178.7, 952.7], [1178.7, 1016.7]]],
      ['lgC046', [[O(1178.3), 1027.3], [1263.3, 1027.3], [1263.3, 1006.8], [1288, 1006.8]], 1],
      ['mrC041', [[O(1316.7), 985.3], [I(1517.7), 985.3]]],
      ['pio', [[1410, 1111], [1465.3, 1111], [1465.3, 1006.8], [I(1517.7), 1006.8]]],
      ['or042', [[O(1517.7), 985.3], [I(1602.7), 985.3]]],
      ['kAnnE', [[1512, 1177.3], [1560, 1177.3], [1560, 1006.8], [I(1602.7), 1006.8]]],
      ['a043', [[O(1602.7), 985.3], [I(1687.3), 985.3]]],
      ['tpC044', [[O(1687.3), 985.3], [1743.5, 985.3]]],
      ['kAnnR', [[1512, 1251], [1728.7, 1251], [1728.7, 1006.8], [1743.5, 1006.8]]],
      ['ffs045', [[1824.5, 985.3], [2085.7, 985.3]]],
      ['ffs045', [[1848, 985.3], [1848, 1071.3], [2085.3, 1071.3]]],
      ['ffs045', [[1848, 985.3], [1848, 932], [1063.3, 932], [1063.3, 869], [I(1115.3), 869]]],
      ['iD1', [[310.5, 847.3], [I(1115.3), 847.3]]],
      ['or040', [[O(1115.3), 847.3], [1170, 847.3], [1170, 541], [1234.7, 541]]]
    ],
    j: [
      [478.7, 400.5],
      [1353, 583],
      [1353, 337],
      [1608, 400.5],
      [1608, 698.7],
      [1190, 900],
      [1018.7, 900],
      [728.7, 1154.7],
      [933.3, 984.7],
      [1178.7, 952.7],
      [1848, 985.3]
    ],
    t: [
      [319, 393, 'GLAND SEAL STEAM PRESS'],
      [319, 418, '-1- 2barg'],
      [633, 395, '+'],
      [633, 414, '-'],
      [895, 391, 'T', 1],
      [1713, 160, 'MV'],
      [316, 838, 'GLAND SEAL STEAM PRESS ABN'],
      [513, 985, '(TCA100)', 1],
      [313, 1145, 'SPUV POS.'],
      [323, 1172, '0- 100%'],
      [1133, 1019, 'C', 1],
      [1645, 980, 'C', 1],
      [1731, 980, 'T', 1],
      [1336, 1094, '(TCA932-2)', 1],
      [1447, 1210, '(TCA103)', 1],
      [1447, 1284, '(TCA100)', 1],
      [1895, 980, 'SPUV ABNORMAL'],
      [1897, 1065, 'SPUV ABNORMAL'],
      [2091, 1024, '(-)', 1],
      [2057, 1043, 'nZT-GSn034_ABN'],
      [913, 1149, 'OPEN'],
      [913, 1277, 'CLOSE'],
      [236, 1517, 'CONTROLLER:'],
      [395, 1517, 'COMM+MD'],
      [657, 1490, 'TRIGGER  :'],
      [657, 1517, 'CYCLE(ms):100']
    ]
  });
})();
