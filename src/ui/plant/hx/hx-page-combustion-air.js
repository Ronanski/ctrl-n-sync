/* HX page in the REALISTIC look: combustion air, from the fans to the furnace (user 2026-11-17: "Ganyan ang HMI na gsto ko.
   Dapat iyan lang makita ko n mga itsura").
   THE PICTURE: the rotary air heater cut open in the middle, the primary air fan on its left and the secondary air fan on its
   right, both cut open, each blowing its cold air up through the air heater; the hot air leaves on top, the flue gas goes
   down through the gas side. Above them the two fluidizing air blowers with their common line.
   THE CONNECTIONS:
     K1AU3-PD-052 Rev A  primary air: silencer Z-1053, flow element FE-FA1071 (FT-FA1071, TT-FA1072), inlet damper
                         MCV-FA1053-1, primary air fan F-1053, PT-FA1075 and TT-FA1073 / 1074, the cold branch to the coal
                         feeders, air preheater H-1052, TT-FA1076 / 1077 and PT-FA1078, flow element FE-FA1079 (FT-FA1079), the
                         hot primary air to the furnace (4 inlets in the rear wall) and to the coal pipes
     K1AU3-PD-053 Rev A  secondary air: the same train with the secondary air fan F-1054 (FT-FA1081, TT-FA1082, inlet damper
                         MCV-FA1054-1, PT-FA1085, TT-FA1083 / 1084, after the air heater TT-FA1086 / 1087 and PT-FA1088), hot
                         secondary air to the wall dampers of the furnace
     K1AU3-PD-054 Rev A  fluidizing air: blowers F-1055A / B, each with its inlet damper FCV-FA1055-A1 / -B1, its surge valve
                         to the silencer XV-FA1055-A2 / -B2 and its outlet valve XV-FA1055-A3 / -B3; PT-FA1055-A / -B,
                         FT-FA1055
   PD-053 and PD-054 were read through the temporary page 09 (the tags, names and order it binds); PD-052 on the sheet.
   Drawn simpler than the sheets: the silencers at the fan inlets and the flow elements are not drawn (the flows are the
   measured values of the two flow controllers); the 4 furnace inlets and the 22 wall dampers end as a link to the Furnace page.
   beta.556 (HMI gap list 2026-11-25): the monitor rows of the air heater (DITL-43), of the primary air fan oil unit (DITL-26B) and of
   its two pumps (DITL-24), the air heater speed and air motor push buttons, the link to the wall dampers page.
   Left out on purpose, all without a signal in hx-registry.js: the bearing, winding and vibration measurements of the fans,
   hand dampers, expansion joints, test points. */
(function () {
  const { V, D, E, M, C, X, L, B, page } = HX;
  const MM = 'mmH₂O';
  const at = (it, x, y, o) => Object.assign(it, { x, y }, o || {});
  const W_A = 12,
    W_S = 6,
    W_G = 14;
  /* places (the drawing is 1760 x 1000) */
  const AX = 880,
    AY = 560,
    AS = 2.2 /* air heater */,
    PAX = AX - 36 * AS,
    SAX = AX - 4 * AS,
    GAX = AX + 34 * AS /* the three sides of the air heater */,
    PFX = 330,
    SFX = 1430,
    FY = 800,
    FS = 1.9 /* the two fans */,
    BAX = 330,
    BBX = 760,
    BY = 200,
    BS = 1.5 /* the two blowers */,
    HY = 70; /* fluidizing air line */
  /* the monitor faceplate of the air heater, the same on the Furnace and flue gas page */
  HX.MON_AH = [
    D('Running', 'YS-FA1052M1', 'dl:DITL-43|i|9', 'RUNNING', 'STOPPED'),
    D('Drive trip', 'XA-FA1052M1', 'dl:DITL-43|i|4', 'NORMAL', 'TRIP'),
    D('Selector', 'YSR-FA1052M1', 'dl:DITL-43|i|3', 'LOCAL', 'REMOTE'),
    D('Low speed', 'SAL-FA1052-6', 'dl:DITL-43|i|11', 'NORMAL', 'LOW'),
    D('Low low speed', 'SALL-FA1052-5', 'dl:DITL-43|i|12', 'NORMAL', 'LOW LOW'),
    D('Fire detection system', 'XA-FA1052-1', 'dl:DITL-43|o|7', 'NORMAL', 'FAULT'),
    D('Fire detection sensor', 'XA-FA1052-2', 'dl:DITL-43|o|8', 'NORMAL', 'OPEN CIRCUIT'),
    D('Fire alarm', 'XA-FA1052-3', 'dl:DITL-43|o|9', 'NORMAL', 'FIRE'),
    D('Speed sensor', 'XA-FA1052-4', 'dl:DITL-43|o|10', 'NORMAL', 'FAULT'),
    D('Secure power supply', 'XA-FA1052-5', 'dl:DITL-43|o|11', 'NORMAL', 'NOT NORMAL'),
    D('Normal power supply', 'XA-FA1052-6', 'dl:DITL-43|o|12', 'NORMAL', 'NOT NORMAL'),
    D('Emergency push button', 'ES-FA1052', 'dl:DITL-43|o|13', 'OPERATED', 'NORMAL'),
    V('Motor current', 'fld:IT-FA1052M1', 'A', 1, { tag: 'IT-FA1052M1' }),
    D('Motor current high high', 'DITL-43 row 23', 'dl:DITL-43|o|22', 'HIGH HIGH', 'NORMAL'),
    D('Hot end bearing oil temperature', 'TA-FA1052-6', '', 'HIGH', 'NORMAL'),
    D('Cold end bearing oil temperature', 'TA-FA1052-7', '', 'HIGH', 'NORMAL'),
    D('Low speed selected', 'CSC-FA1052M1-2', 'dl:DITL-43|p|O.0208'),
    D('Start command', 'CSC-FA1052M1-1', 'dl:DITL-43|p|O.0206'),
    D('Stop command', 'CSO-FA1052M1-1', 'dl:DITL-43|p|O.0207')
  ];
  /* a lube oil pump of the primary air fan: DITL-24 / DITL-24 #B */
  const lop = (s, p) => [
    D('Running', 'MIR-LO1753-' + p, 'dl:' + s + '|i|1', 'RUNNING', 'STOPPED'),
    D('Motor trip', 'MIT-LO1753-' + p, 'dl:' + s + '|i|10', 'TRIP', 'NORMAL'),
    D('Selector', 'MIL-LO1753-' + p, 'dl:' + s + '|i|18', 'REMOTE', 'LOCAL')
  ];
  const LOU = [
    D('Oil pressure low', 'PSL-LO1753', 'dl:DITL-26B|i|19', 'LOW', 'NORMAL'),
    D('Oil pressure low low', 'PSLL-LO1753', 'dl:DITL-26B|i|21', 'LOW LOW', 'NORMAL'),
    D('Filter differential pressure', 'DPS-LO1753', 'dl:DITL-26B|i|16', 'HIGH', 'NORMAL'),
    D('Tank level low', 'LSL-LO1753', 'dl:DITL-26B|i|17', 'LOW', 'NORMAL'),
    D('Tank level low low', 'LSLL-LO1753', '', 'LOW LOW', 'NORMAL'),
    D('Oil temperature', 'TS-LO1753', 'dl:DITL-26B|i|18', 'HIGH', 'NORMAL'),
    D('All oil pumps stopped', 'S-APAFLOPS', 'dl:DITL-24|o|24'),
    D('Control power', 'MIA-LO1753-1', '', 'ON', 'OFF'),
    D('Breaker NFB2', 'MIA-LO1753-2', '', 'ON', 'OFF'),
    D('Breaker NFB1', 'MIA-LO1753-3', '', 'ON', 'OFF')
  ];
  const PA = 'm:PAF',
    SA = 'm:SAF',
    FA = 'm:FA BLOWER-A',
    FB = 'm:FA BLOWER-B';

  page({
    id: 'combustion-air',
    group: 'Boiler',
    title: 'Combustion air',
    about:
      'Primary air fan, secondary air fan, air heater and the fluidizing air blowers. Connections: flow diagrams K1AU3-PD-052, PD-053 and PD-054 Rev A.',
    plan: {
      look: 'real',
      w: 1760,
      h: 1000,
      items: [
        /* ---- air heater ---- */
        /* UI check 2026-11-24 C1: name at the left side; below it the air ducts and the rotor shaft leave */
        /* beta.556: its square at the top left corner of the casing (it stood far right, on the gas duct) */
        at(M('airheater', 'AIR PREHEATER', 'Air heater', [], { mon: HX.MON_AH }), AX, AY, { id: 'ah', sc: AS, lab: 'l', yn: [-122, -88] }),
        /* the back-up drive of the air heater: an air motor, its air valve SV-PA1052 is the output O.029F of DITL-44 (old page 038) */
        at(
          HX.HV('SVPA1052', 'Back-up air motor valve', {
            kind: 'shutoff',
            wrap: 14,
            tag: 'SV-PA1052',
            on: HX.hk('aph-airmotor', 'data-dpo="DITL-44|O.029F|OPEN|CLOSED"'),
            hp: ''
          }),
          AX + 350,
          AY + 30,
          { id: 'amv', lab: 'b' }
        ),
        at(B('Air motor valve', 'data-dpo="DITL-44|O.029F|OPEN|CLOSED"', { mach: 'AIR PREHEATER AIR MOTOR', w: 210 }), 1480, 570, { id: 'amb' }),
        at(B('Air heater speed', 'data-dpo="DITL-43|O.0208|LOW|NORMAL"', { mach: 'AIR PREHEATER SPEED', w: 210 }), 1480, 610, { id: 'asb' }),
        at(L('furnace-gas', 'Flue gas from the back pass', { back: true }), 1230, 440, { id: 'gin' }),
        at(L('furnace-gas', 'Flue gas to the precipitator'), 1230, 690, { id: 'gout' }),

        /* ---- primary air ---- */
        at(M('fan', 'PAF', 'Primary air fan', [V('Current', 'IT-F1053', 'A')]), PFX, FY, {
          id: 'paf',
          sc: FS,
          lab: 'b'
        }),
        at(C('FICFA1071', 'Primary air fan inlet vane', { tag: 'MCV-FA1053-1', wrap: 16 }), 95, FY, {
          id: 'pad',
          lab: 't'
        }),
        at(L('coal', 'Cold primary air to the coal feeders'), 560, 780, { id: 'cfl' }),
        at(L('furnace-gas', 'Hot primary air to the furnace'), 330, 430, { id: 'pal' }),
        at(L('coal', 'To the coal pipes'), 330, 360, { id: 'cpl' }),
        at(M('pump', 'PAF LUBE OIL PUMP A', 'Lube oil pump A', [], { mon: lop('DITL-24', 'A') }), 90, 952, { id: 'loa', sc: 0.8, lab: 'r' }),
        at(M('pump', 'PAF LUBE OIL PUMP B', 'Lube oil pump B', [], { mon: lop('DITL-24 #B', 'B') }), 380, 952, { id: 'lob', sc: 0.8, lab: 'r' }),
        at(E('tank', 'Lube oil unit', 'LO1753', [], { w: 70, h: 50, mon: LOU }), 670, 950, { id: 'lou', lab: 'r' }),

        /* ---- secondary air ---- */
        at(M('fan', 'SAF', 'Secondary air fan', [V('Current', 'IT-F1054', 'A')]), SFX, FY, {
          id: 'saf',
          sc: FS,
          lab: 'b',
          mir: true
        }),
        at(C('FICFA1081', 'Secondary air fan inlet vane', { tag: 'MCV-FA1054-1', wrap: 16 }), 1640, FY, {
          id: 'sad',
          lab: 't'
        }),
        at(L('wall-dampers', 'Hot secondary air to the wall dampers'), 1430, 350, { id: 'sal' }),

        /* ---- fluidizing air ---- */
        at(
          M('fan', 'FA BLOWER-A', 'Fluidizing air blower A', [
            V('Current', 'IT-F1055A', 'A'),
            V('Pressure', 'PT-FA1055-A', MM, 0)
          ]),
          BAX,
          BY,
          { id: 'fa', sc: BS, lab: 'b', yn: [77.5, -46] }
        ),
        at(
          M('fan', 'FA BLOWER-B', 'Fluidizing air blower B', [
            V('Current', 'IT-F1055B', 'A'),
            V('Pressure', 'PT-FA1055-B', MM, 0)
          ]),
          BBX,
          BY,
          { id: 'fb', sc: BS, lab: 'b', yn: [77.5, -46] }
        ),
        at(C('FICFA1055A', 'Inlet damper A', { tag: 'FCV-FA1055-A1' }), 170, BY, { id: 'fad', lab: 'b' }),
        at(C('FICFA1055B', 'Inlet damper B', { tag: 'FCV-FA1055-B1' }), 600, BY, { id: 'fbd', lab: 'b' }),
        at(X('XV-FA1055-A2', 'Surge valve A', { cname: 'Fluidizing air blower A surge valve' }), 230, 110, {
          id: 'sva',
          lab: 't'
        }),
        at(X('XV-FA1055-B2', 'Surge valve B', { cname: 'Fluidizing air blower B surge valve' }), 660, 110, {
          id: 'svb',
          lab: 't'
        }),
        at(X('XV-FA1055-A3', 'Outlet valve A', { cname: 'Fluidizing air blower A outlet valve' }), 440, HY, {
          id: 'ova',
          lab: 'b'
        }),
        at(X('XV-FA1055-B3', 'Outlet valve B', { cname: 'Fluidizing air blower B outlet valve' }), 870, 110, {
          id: 'ovb',
          lab: 't'
        }),
        at(L('furnace-gas', 'Fluidizing air to the seal pots'), 1300, HY, { id: 'fal' })
      ],
      pipes: [
        /* primary air: inlet damper, fan, up through the air heater, hot air out on top */
        { med: 'air', w: W_A, pts: [[40, FY], 'pad.l'], flow: PA, arrow: false },
        { med: 'air', w: W_A, pts: ['pad.r', 'paf.in'], flow: PA },
        { med: 'air', w: W_A, pts: ['paf.out', [PFX - 2 * FS, 700], [PAX, 700], 'ah.paB'], flow: PA },
        { med: 'air', w: W_S, pts: [[560, 700], 'cfl.t'], flow: PA, arrow: false },
        { med: 'hotair', w: W_A, pts: ['ah.paT', [PAX, 430], 'pal.r'], flow: PA },
        { med: 'hotair', w: W_S, pts: [[560, 430], [560, 360], 'cpl.r'], flow: PA, arrow: false },
        /* secondary air */
        { med: 'air', w: W_A, pts: [[1730, FY], 'sad.r'], flow: SA, arrow: false },
        { med: 'air', w: W_A, pts: ['sad.l', 'saf.in'], flow: SA },
        { med: 'air', w: W_A, pts: ['saf.out', [SFX + 2 * FS, 740], [SAX, 740], 'ah.saB'], flow: SA },
        { med: 'hotair', w: W_A, pts: ['ah.saT', [SAX, 350], 'sal.l'], flow: SA },
        /* flue gas through the gas side */
        { med: 'gas', w: W_G, pts: ['gin.l', [GAX, 440], 'ah.gasT'], flow: 'v:TT-FG1124>80' },
        { med: 'gas', w: W_G, pts: ['ah.gasB', [GAX, 690], 'gout.l'], flow: 'v:TT-FG1124>80' },
        /* fluidizing air: inlet damper, blower, surge valve to the silencer, outlet valve, common line */
        { med: 'air', w: W_S, pts: [[90, BY], 'fad.l'], flow: FA, arrow: false },
        { med: 'air', w: W_S, pts: ['fad.r', 'fa.in'], flow: FA },
        { med: 'air', w: W_S, pts: ['fa.out', [BAX - 2 * BS, HY], 'ova.l'], flow: FA, arrow: false },
        { med: 'air', w: 4, pts: [[BAX - 2 * BS, 110], 'sva.r'], flow: 'x:XV-FA1055-A2', arrow: false },
        { med: 'air', w: 4, pts: ['sva.l', [170, 110]], to: 'silencer', flow: 'x:XV-FA1055-A2' },
        { med: 'air', w: W_S, pts: ['ova.r', [1000, HY]], flow: 'x:XV-FA1055-A3' },
        { med: 'air', w: W_S, pts: [[520, BY], 'fbd.l'], flow: FB, arrow: false },
        { med: 'air', w: W_S, pts: ['fbd.r', 'fb.in'], flow: FB },
        { med: 'air', w: W_S, pts: ['fb.out', [BBX - 2 * BS, 110], 'ovb.l'], flow: FB, arrow: false },
        { med: 'air', w: 4, pts: [[BBX - 2 * BS, 110], 'svb.r'], flow: 'x:XV-FA1055-B2', arrow: false },
        { med: 'air', w: 4, pts: ['svb.l', [600, 110]], to: 'silencer', flow: 'x:XV-FA1055-B2' },
        { med: 'air', w: W_S, pts: ['ovb.r', [1000, 110], [1000, HY]], flow: 'x:XV-FA1055-B3', arrow: false },
        { med: 'air', w: W_S, pts: [[1000, HY], 'fal.l'], flow: FA + '|' + FB }
      ],
      taps: [
        { x: 440, y: 700, side: 't', label: 'Fan outlet', key: 'PT-FA1075', unit: MM, dp: 0, tag: 'PT-FA1075' },
        {
          x: 680,
          y: 700,
          side: 'b',
          label: 'Temperature',
          key: 'TT-FA1073',
          key2: 'TT-FA1074',
          unit: '°C',
          dp: 0,
          tag: 'TT-FA1073 / 1074'
        },
        { x: 222, y: FY, side: 't', label: 'Inlet', key: 'TT-FA1072', unit: '°C', dp: 0, tag: 'TT-FA1072' },
        { x: 222, y: FY, side: 'b', label: 'Flow', key: 'pv:FICFA1071', unit: 't/h', tag: 'FT-FA1071' },
        {
          x: 690,
          y: 430,
          side: 't',
          label: 'Hot primary air',
          key: 'TT-FA1076',
          key2: 'TT-FA1077',
          unit: '°C',
          dp: 0,
          tag: 'TT-FA1076 / 1077'
        },
        { x: 600, y: 430, side: 'b', label: 'Pressure', key: 'PT-FA1078', unit: MM, dp: 0, tag: 'PT-FA1078' },
        { x: 470, y: 430, side: 'b', label: 'Flow', key: 'FT-FA1079', unit: 't/h', tag: 'FT-FA1079' },
        { x: 1260, y: 740, side: 'b', label: 'Fan outlet', key: 'PT-FA1085', unit: MM, dp: 0, tag: 'PT-FA1085' },
        {
          x: 1090,
          y: 740,
          side: 'b',
          label: 'Temperature',
          key: 'TT-FA1083',
          key2: 'TT-FA1084',
          unit: '°C',
          dp: 0,
          tag: 'TT-FA1083 / 1084'
        },
        { x: 1540, y: FY, side: 't', label: 'Inlet', key: 'TT-FA1082', unit: '°C', dp: 0, tag: 'TT-FA1082' },
        { x: 1540, y: FY, side: 'b', label: 'Flow', key: 'pv:FICFA1081', unit: 't/h', tag: 'FT-FA1081' },
        {
          x: 1020,
          y: 350,
          side: 't',
          label: 'Hot secondary air',
          key: 'TT-FA1087',
          key2: 'TT-FA1086',
          unit: '°C',
          dp: 0,
          tag: 'TT-FA1087 / 1086'
        },
        { x: 1180, y: 350, side: 't', label: 'Pressure', key: 'PT-FA1088', unit: MM, dp: 0, tag: 'PT-FA1088' },
        { x: 1120, y: HY, side: 'b', label: 'Flow', key: 'FT-FA1055', unit: 't/h', tag: 'FT-FA1055' }
      ],
      texts: [
        { x: AX + 350, y: AY - 20, s: 'Back-up drive of the air heater', cls: 'hx-note', anchor: 'middle' },
        { x: 1500, y: 150, s: 'Total air flow', key: 'ABC-002|SI0060', unit: 't/h', cls: 'hx-name' }
      ]
    }
  });
})();
