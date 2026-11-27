/* HX page in the REALISTIC look: furnace and flue gas, from the bed to the stack (user 2026-11-17: "Ganyan ang HMI na gsto ko.
   Dapat iyan lang makita ko n mga itsura").
   THE PICTURE: the way of the gas through the plant as it stands, every large piece cut open: furnace, recycle cyclone with
   its seal pot, back pass with its two gas dampers, rotary air heater, electrostatic precipitator, induced draft fan, stack.
   THE CONNECTIONS: K1AU3-PD-051 Rev A, combustion air / flue gas system: furnace H-1001 with the furnace pressures
   PT-FG1085 / 1086 / 1087, the bed and furnace temperatures TT-FG1090 / 1091 and the differential pressures DPT-FG1081 ~ 1084;
   cyclone S-1009A / B (TT-FG1095-A / -B) and seal pot T-1009A / B (TT-FG1009, PT-FG1009); back pass with reheater, finishing
   superheater and economizers, the gas dampers TCV-FG1116 / 1117 under the two passes, economizer No. 1 (TT-FG1110, TT-FG1113);
   the duct to the air preheater H-1052 (PT-FG1121, O2 AE-FG1122 / 1123, TT-FG1124 / 1125), its differential pressure
   PDT-FG1052-5, after it O2 AE-FG1131, TT-FG1132 / 1133, PT-FG1134 and the fly ash hopper; the precipitator Z-1010; the
   induced draft fan F-1056 with its hydraulic coupling Z-1056 and inlet damper PCD-FG1056-1 (PT-FG1141, TT-FG1152,
   PT-FG1151); the stack Z-1057 with the gas analyzers AT-FG1057-1 ~ -6, the velocity FT-FG1057-7 and TT-FG1057-8.
   Names of the values as the temporary page 09 gives them (bed DP, plenum to lower bed DP, lower to upper DP, solids down).
   Drawn simpler than the sheet:
   - 2 cyclones and 2 seal pots: one of each is drawn (a section through the boiler), both temperatures are shown;
   - the air side of the air heater, the fans and blowers of the combustion air: the Combustion air page;
   - beta.556: the single bank temperatures of the back pass TT-FG1101 ~ 1109 and 1111 (DCS I/O list) stand beside it; a temperature
     the plant model does not give shows -----.
   Left out on purpose, all without a signal in hx-registry.js: hand valves, test points, the single bed thermocouples, the
   bearing, winding and vibration measurements of the fan, the fly ash transmitters under the hoppers. */
(function () {
  const { V, D, E, M, C, L, page } = HX;
  const MM = 'mmH₂O';
  const at = (it, x, y, o) => Object.assign(it, { x, y }, o || {});
  const W_G = 14;
  /* places (the drawing is 1760 x 1000) */
  const FX = 340,
    FY = 200,
    FS = 1.6 /* furnace: roof centre */,
    CX = 545,
    CY = 216,
    CS = 1.5 /* cyclone */,
    BPX = 660,
    BPY = 150,
    BS = 1.1 /* back pass: top left corner */,
    GX = BPX + 108 * BS /* gas out of the back pass, down to the air heater */,
    AHX = GX - 34 * 1.4,
    AHY = 880,
    AS = 1.4 /* air heater */,
    EX = 1190,
    EY = 700,
    ES = 1.6 /* precipitator */,
    DX = 1378 /* duct down to the fan with the inlet damper */,
    IX = 1485,
    IY = 870,
    IS = 1.8 /* induced draft fan */,
    SX = 1670,
    SY = 870,
    SS = 3.4; /* stack */
  const GAS = 'm:IDF';
  /* the oil of the hydraulic coupling of the induced draft fan: DITL-25B */
  const HCO = [
    V('Coupling speed', 'fld:ST-LO1756', 'rpm', 0, { tag: 'ST-LO1756' }),
    V('Scoop tube position', 'ABC-008|AI0482', '%', 1, { tag: 'ZT-LO1756' }),
    D('Scoop tube open limit', 'ZSO-LO1756', '', 'OPEN', 'NOT OPEN'),
    D('Scoop tube closed limit', 'ZSC-LO1756', '', 'CLOSED', 'NOT CLOSED'),
    D('Oil pressure low', 'PSL-LO1756', 'dl:DITL-25B|i|19', 'LOW', 'NORMAL'),
    D('Oil pressure low low', 'PSLL-LO1756', 'dl:DITL-25B|i|21', 'LOW LOW', 'NORMAL'),
    D('Filter differential pressure', 'DPS-LO1756', 'dl:DITL-25B|i|17', 'HIGH', 'NORMAL'),
    D('Working oil temperature', 'TS-LO1756-1', 'dl:DITL-25B|i|14', 'HIGH', 'NORMAL'),
    D('Working oil temperature high high', 'TS-LO1756-2', 'dl:DITL-25B|i|15', 'HIGH HIGH', 'NORMAL')
  ];
  const air = tag => [V('Air buffer tank pressure', 'fld:' + tag, 'kg/cm²', 1, { tag })];
  /* a list of temperatures: [tag, words] */
  const tlist = (x, y, l) => l.map(([t, s], i) => ({ x, y: y + i * 16, s, key: 'fld:' + t, unit: '°C', dp: 0 }));

  page({
    id: 'furnace-gas',
    group: 'Boiler',
    title: 'Furnace and flue gas',
    about:
      'The way of the gas, cut open: furnace, cyclone, back pass, air heater, precipitator, induced draft fan, stack. Connections: flow diagram K1AU3-PD-051 Rev A.',
    plan: {
      look: 'real',
      w: 1760,
      h: 1000,
      items: [
        /* ---- the large pieces ---- */
        at(E('furnace', '', '', [], { fire: 'v:TT-FG1090>300' }), FX, FY, { id: 'fu', under: true, sc: FS }),
        at(E('cyclone', '', '', [], { flow: GAS }), CX, CY, { id: 'cy', under: true, sc: CS }),
        at(E('sealpot', '', '', [], { flow: GAS }), CX, CY + 196 * CS, { id: 'sp', under: true, sc: CS, mir: true }),
        at(E('backpass', '', '', [], { gasA: 'l:HICHR1002A', gasB: 'l:HICHR1002B', e1y: 478 }), BPX, BPY, {
          id: 'bp',
          under: true,
          sc: BS
        }),
        at(M('airheater', 'AIR PREHEATER', 'Air heater', [], { mon: HX.MON_AH }), AHX, AHY, { id: 'ah', sc: AS, lab: 'l', yn: [-79, -66] }),
        at(E('esp', 'Precipitator', 'Z-1010', []), EX, EY, { id: 'esp', sc: ES, lab: 't' }),
        at(M('fan', 'IDF', 'Induced draft fan', [V('Current', 'IT-F1056', 'A')]), IX, IY, {
          id: 'idf',
          sc: IS,
          lab: 'b',
          yn: [90, -20]
        }),
        at(E('stack', '', '', [], { flow: GAS }), SX, SY, { id: 'st', under: true, sc: SS }),
        /* Z-1056 hydraulic coupling between the motor and the induced draft fan (PD-051 F-8, YUA P&ID read 2026-11-27); no
           label: the fan's words are under it; named in docs/phase9/equipment.json map */
        at(E('coupling', '', '', []), 1497, IY - 3, { id: 'hcp', sc: 1.3 }),
        /* T-1064A / B air buffer tanks of the biasing dampers (K1AU3-D1-0-070 R0, 0.3 m3; YUA read 2026-11-27, vendor data,
           no flow line): A with the reheater pass damper (its air pressure PT-IA1064-A), B with the superheater pass damper
           (PT-IA1064-B). No label: named in docs/phase9/equipment.json map */
        at(E('tank', '', '', [], { id: 'bta', liquid: 'none', w: 14, h: 24 }), 648, 548, { id: 'bta' }),
        at(E('tank', '', '', [], { id: 'btb', liquid: 'none', w: 14, h: 24 }), 908, 548, { id: 'btb' }),

        /* ---- dampers and controllers ---- */
        at(
          C('HICHR1002A', 'Reheater pass damper', { sym: 'louver', w: 100, tag: 'TCV-FG1116A-D', wrap: 14, mvb: true, mon: air('PT-IA1064-A') }),
          BPX + 56 * BS,
          BPY + 350 * BS,
          {
            id: 'dma',
            lab: 'b'
          }
        ),
        at(
          C('HICHR1002B', 'Superheater pass damper', { sym: 'louver', w: 100, tag: 'TCV-FG1117A-D', wrap: 14, mvb: true, mon: air('PT-IA1064-B') }),
          BPX + 160 * BS,
          BPY + 350 * BS,
          { id: 'dmb', lab: 'b' }
        ),
        at(C('PICFG108A', 'Fan inlet damper', { sym: 'louver', w: 56, tag: 'PCD-FG1056-1', wrap: 12 }), DX, 822, {
          id: 'idd',
          lab: 'l'
        }),
        at(C('PICFG108', 'Furnace pressure, fan coupling, ' + MM, { sym: 'ctl', unit: '', pvdp: 0, wrap: 32, mon: HCO }), 1500, 600, {
          id: 'pic',
          lab: 't'
        }),
        /* 3.2.5-beta.1 (JENNIE live Cold 2026-11-18): the two CRT push buttons of ABC-008 (memory list 101: M.0200 HYDRAULIC CONTROL
           SELECT, M.0201 DAMPER CONTROL SELECT, TPS 2 s -> FF M.0202); lit = the selection of M.0202. No operator page had them: with
           the hydraulic coupling selected the damper station tracks F(X) of the coupling (100 %), so the operator could not close the
           inlet damper for the ID fan START permissive (DITL-25A M.3117 IDF INLET VANE CLOSED) nor follow PR-OPE-5004 "change the
           furnace pressure control to DAMPER CONTROL" */
        at(HX.B('HYDRAULIC CONTROL', 'data-apb="ABC-008|M.0200|M.0202=1"', { press: true }), 1385, 470, { id: 'pbh' }) /* Audit 3: above the controller, clear of Fan outlet */,
        at(HX.B('DAMPER CONTROL', 'data-apb="ABC-008|M.0201|M.0202=0"', { press: true }), 1545, 470, { id: 'pbd' }),
        at(C('AICFG112', 'Oxygen control', { sym: 'ctl', unit: '%', pvdp: 1, wrap: 30 }), 1050, 400, {
          id: 'o2c',
          lab: 't'
        }),
        at(L('combustion-air', 'Combustion air'), 480, 785, { id: 'cal' }),
        /* 3.2.5-beta.1 (JENNIE live Cold 2026-11-18, F-G): no page linked to Purge and trip, the operator could not reach the purge */
        /* UI check 2026-11-24 C1: the three page links left of the gas duct down to the air heater */
        at(L('purge-trip', 'Purge and trip'), 650, 785, { id: 'ptl' }),
        /* 3.2.5-beta.1 (F-M): the diesel oil and burners page was reached only through Purge and trip */
        at(L('oil-burners', 'Burners'), 300, 785, { id: 'obl' })
      ],
      pipes: [
        { med: 'gas', w: W_G, pts: ['fu.out', 'cy.in'], flow: GAS, arrow: false },
        { med: 'gas', w: W_G, pts: ['cy.gas', [CX, 60], [BPX + 46 * BS, 60], 'bp.gin'], flow: GAS },
        { med: 'solid', w: 6, pts: ['sp.out', [466, CY + 212 * CS], [466, FY + 290 * FS], 'fu.ret'], flow: GAS },
        { med: 'gas', w: W_G, pts: ['bp.gout', 'ah.gasT'], flow: GAS },
        { med: 'gas', w: W_G, pts: ['ah.gasB', [GX, 972], [1012, 972], [1012, EY], 'esp.l'], flow: GAS },
        { med: 'gas', w: W_G, pts: ['esp.r', [DX, EY], [DX, IY], 'idf.in'], flow: GAS },
        {
          med: 'gas',
          w: W_G,
          pts: ['idf.out', [IX - 2 * IS, 740], [1575, 740], [1575, SY - 14 * SS], 'st.in'],
          flow: GAS
        }
      ],
      taps: [
        {
          x: 630,
          y: 60,
          side: 'b',
          label: 'Cyclone outlet',
          key: 'TT-FG1095-A',
          key2: 'TT-FG1095-B',
          unit: '°C',
          dp: 0,
          tag: 'TT-FG1095-A / -B'
        },
        {
          x: GX,
          y: 742,
          side: 'r',
          label: 'Economizer 1 outlet',
          key: 'TT-FG1110',
          key2: 'TT-FG1113',
          unit: '°C',
          dp: 0,
          tag: 'TT-FG1110 / 1113'
        },
        { x: 1520, y: 740, side: 't', label: 'Fan outlet', key: 'TT-FG1152', unit: '°C', dp: 0, tag: 'TT-FG1152' },
        { x: 1575, y: 790, side: 'l', label: 'Pressure', key: 'PT-FG1151', unit: MM, dp: 0, tag: 'PT-FG1151' }
      ],
      texts: [
        { x: 24, y: 150, s: 'FURNACE', cls: 'hx-zone' },
        { x: 24, y: 172, s: 'Pressure 1', key: 'PT-FG1085', unit: MM, dp: 0 },
        { x: 24, y: 188, s: 'Pressure 2', key: 'PT-FG1086', unit: MM, dp: 0 },
        { x: 24, y: 204, s: 'Pressure 3', key: 'PT-FG1087-1', unit: MM, dp: 0 },
        { x: 24, y: 228, s: 'Upper average', key: 'TT-FG1091', unit: '°C', dp: 0 },
        { x: 24, y: 244, s: 'Lower average', key: 'TT-FG1090', unit: '°C', dp: 0 },
        { x: 24, y: 268, s: 'Bed pressure drop', key: 'DPT-FG1081', unit: MM, dp: 0 },
        { x: 24, y: 284, s: 'Plenum to lower bed 1', key: 'DPT-FG1084', unit: MM, dp: 0 },
        { x: 24, y: 300, s: 'Plenum to lower bed 2', key: 'DPT-FG1184', unit: MM, dp: 0 },
        { x: 24, y: 316, s: 'Lower to upper 1', key: 'DPT-FG1083', unit: MM, dp: 0 },
        { x: 24, y: 332, s: 'Lower to upper 2', key: 'DPT-FG1183', unit: MM, dp: 0 },
        { x: FX, y: FY + 200 * FS, s: 'Furnace', cls: 'hx-name', anchor: 'middle' },
        { x: CX, y: CY + 58, s: 'Cyclone', cls: 'hx-name', anchor: 'middle' },
        { x: 24, y: 372, s: 'CYCLONES', cls: 'hx-zone' },
        ...tlist(24, 394, [['TT-FG1092-A', 'Inlet A'], ['TT-FG1092-B', 'Inlet B'], ['TT-FG1096-A', 'Outlet A (2)'], ['TT-FG1096-B', 'Outlet B (2)']]),
        { x: 1010, y: 96, s: 'BACK PASS, REHEATER SIDE', cls: 'hx-zone' },
        ...tlist(1010, 118, [['TT-FG1102', 'Reheater 2 inlet'], ['TT-FG1104', 'Reheater 3 inlet'], ['TT-FG1106', 'Reheater 4 inlet'], ['TT-FG1108', 'Economizer 2R inlet']]),
        { x: 1010, y: 206, s: 'BACK PASS, SUPERHEATER SIDE', cls: 'hx-zone' },
        ...tlist(1010, 228, [['TT-FG1101', 'Finishing superheater 1 inlet'], ['TT-FG1103', 'Finishing superheater 2 inlet'], ['TT-FG1105', 'Finishing superheater 3 inlet'], ['TT-FG1107', 'Economizer 3 upper inlet'], ['TT-FG1109', 'Economizer 3 lower inlet'], ['TT-FG1111', 'Economizer 2S inlet']]),
        { x: 486, y: 650, s: 'SEAL POT', cls: 'hx-zone' },
        { x: 486, y: 670, s: 'Solids down A', key: 'TT-FG1009-A', unit: '°C', dp: 0 },
        { x: 486, y: 686, s: 'Solids down B', key: 'TT-FG1009-B', unit: '°C', dp: 0 },
        { x: 486, y: 702, s: 'Pressure A', key: 'PT-FG1009-A2', unit: MM, dp: 0 },
        { x: 486, y: 718, s: 'Pressure B', key: 'PT-FG1009-B2', unit: MM, dp: 0 },
        { x: 834, y: 812, s: 'AIR HEATER INLET', cls: 'hx-zone' },
        { x: 834, y: 830, s: 'Oxygen 1', key: 'AT-FG1122', unit: '%', dp: 1 },
        { x: 834, y: 846, s: 'Oxygen 2', key: 'AT-FG1123', unit: '%', dp: 1 },
        { x: 834, y: 862, s: 'Temperature 1', key: 'TT-FG1124', unit: '°C', dp: 0 },
        { x: 834, y: 878, s: 'Temperature 2', key: 'TT-FG1125', unit: '°C', dp: 0 },
        { x: 834, y: 894, s: 'Pressure', key: 'PT-FG1121', unit: MM, dp: 0 },
        /* UI check 2026-11-24 C1: in two lines, clear of the gas duct from the air heater */
        { x: 834, y: 912, s: 'Across the air heater', cls: 'hx-note' },
        { x: 834, y: 928, s: 'Pressure drop', key: 'DPT-FG1052-5', unit: MM, dp: 0 },
        { x: 600, y: 944, s: 'AIR HEATER OUTLET', cls: 'hx-zone', anchor: 'end' },
        { x: 600, y: 962, s: 'Oxygen', key: 'AT-FG1131', unit: '%', dp: 1, anchor: 'end' },
        { x: 600, y: 978, s: 'Temperature 1', key: 'TT-FG1132', unit: '°C', dp: 0, anchor: 'end' },
        { x: 420, y: 962, s: 'Temperature 2', key: 'TT-FG1133', unit: '°C', dp: 0, anchor: 'end' },
        { x: 420, y: 978, s: 'Pressure', key: 'PT-FG1134', unit: MM, dp: 0, anchor: 'end' },
        { x: 1336, y: 872, s: 'Fan inlet A', key: 'PT-FG1141-A', unit: MM, dp: 0, anchor: 'end' },
        { x: 1336, y: 888, s: 'Fan inlet B', key: 'PT-FG1141-B', unit: MM, dp: 0, anchor: 'end' },
        { x: 1610, y: 150, s: 'STACK', cls: 'hx-zone', anchor: 'end' },
        { x: 1610, y: 172, s: 'Oxygen', key: 'AT-FG1057-4', unit: '%', dp: 1, anchor: 'end' },
        { x: 1610, y: 188, s: 'Nitrogen oxides', key: 'AT-FG1057-2', unit: 'ppm', dp: 0, anchor: 'end' },
        { x: 1610, y: 204, s: 'Sulphur oxides', key: 'AT-FG1057-1', unit: 'ppm', dp: 0, anchor: 'end' },
        { x: 1610, y: 220, s: 'Carbon monoxide', key: 'AT-FG1057-3', unit: 'ppm', dp: 0, anchor: 'end' },
        { x: 1610, y: 236, s: 'Opacity', key: 'AT-FG1057-6', unit: '%', dp: 1, anchor: 'end' },
        { x: 1610, y: 252, s: 'Dust', key: 'AT-FG1057-5', unit: 'mg/m³', dp: 1, anchor: 'end' },
        { x: 1610, y: 268, s: 'Temperature', key: 'TT-FG1057-8', unit: '°C', dp: 0, anchor: 'end' },
        { x: 1610, y: 284, s: 'Velocity', key: 'FT-FG1057-7', unit: 'm/s', dp: 1, anchor: 'end' }
      ]
    }
  });
})();
