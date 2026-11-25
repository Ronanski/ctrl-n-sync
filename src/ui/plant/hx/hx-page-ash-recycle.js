/* HX page in the REALISTIC look: the bottom ash recycle (beta.556, HMI gap list 2026-11-25: the buffer tank, the ash transmitter
   and their valves were on no page; their logic DITL-BA01 ~ BA54 had no picture and no push button).
   THE PICTURE: the coarse ash of the vibrating screens falls into the buffer tank, through the hand valve and the inlet gate
   valve into the ash transmitter under it. Plant air from the air tank on the left presses the transmitter and blows the ash
   through the outlet valve to the sand silo; the vent line empties the transmitter into the same line.
   THE CONNECTIONS: K1AU3-PD-071 Rev A sheet 2, bottom ash transfer and recycle system (Formosa Heavy Industries):
     from the vibrating screen; recycle buffer tank T-1091 (LS-BH1751 high, LS-BH1752 low); hand valve V-BH1768; inlet gate
     valve XV-BH1751; ash transmitter S-1090 (LS-BH1750 high, safety valve ZV-BH1750); outlet valve XV-BH1752; line BH-1-750
     to the sand silo; vent line with V-BH1761 and the vent valve XV-BH1753 into that line
     plant air, V-BH1758, air tank T-1092 (PS-BH1750, safety valve ZV-BH1750); V-BH1753 to the bottom ash silo; V-BH1757,
     filter, pressing valve XV-BH1750, 3-way valve SV-BH1751; one way up with V-BH1759 to the top and V-BH1758 to the cone of
     the transmitter, the other way down with V-BH1760 into the line to the sand silo
   THE SIGNALS: the I/O list calls the inlet gate valve SV / ZSO / ZSC-BH1759 (the P&ID XV-BH1751); V-BH1758 and ZV-BH1750 stand
   twice on the P&ID. Limits and valve commands DITL-BA38 / BA39 / BA53, step sequence DITL-BA04 ~ BA18, charging precondition
   DITL-BA03, automatic start DITL-BA19, alarms DITL-BA24 ~ BA28 / BA48, local panel DITL-BA04 / BA05 / BA11 / BA21 / BA22 (its
   push buttons) and BA54 (its lamps). The CRT push buttons START / STOP / RESET / EMERGENCY STOP are DITL-BA02 rows 8 ~ 11.
   Drawn simpler than the sheet: the pressure regulator, the gauges and the drain of the air tank are not drawn. */
(function () {
  const { V, D, E, M, L, HV, page } = HX;
  const B = HX.B;
  const at = (it, x, y, o) => Object.assign(it, { x, y }, o || {});
  const dl = (s, k) => 'dl:DITL-' + s + '|' + k;
  const pm = (label, key) => V(label, key, '', 0);
  const dy = (k, on, off) => 'data-dy="DITL-' + k + '" data-on="' + (on || 'OPEN') + '" data-off="' + (off || 'CLOSED') + '"';
  HX.mach('MK14', 'BAT');
  /* places (the drawing is 1760 x 1000) */
  const TX = 1080 /* buffer tank and transmitter */,
    LY = 740 /* the line */,
    RX = 840 /* air riser */,
    BX = 1310 /* bypass joins */,
    VX = 1430 /* vent joins */;
  const W = 6,
    WA = 4;
  const GATE = HX.hk('bar-gate', dy('BA38|i|1')),
    PRESS = HX.hk('bar-press', dy('BA38|i|5')),
    OUT = HX.hk('bar-out', dy('BA39|i|1')),
    VENT = HX.hk('bar-vent', dy('BA39|i|5')),
    WAY3 = HX.hk('bar-3way', dy('BA53|o|10', 'ENERGIZED', 'NOT ENERGIZED'));
  const lim = (tag, so, ro, sc, rc) => [D('Open limit', 'ZSO-' + tag, dl(so, 'i|' + ro), 'OPEN', 'NOT OPEN'), D('Closed limit', 'ZSC-' + tag, dl(sc, 'i|' + rc), 'CLOSED', 'NOT CLOSED')];
  const abn = (s, r) => D('Valve abnormal', '', dl(s, 'o|' + r), 'FAULT', 'NORMAL');
  /* DITL-BA03: the sand vent fan running OR its selector remote */
  HX.CALC.baSandFan = v => {
    const a = [v(dl('BA03', 'i|4')), v(dl('BA03', 'i|5'))];
    return a.includes(null) ? null : Math.max(a[0], a[1]);
  };
  const PERM = [
    pm('Inlet gate valve closed', dl('BA03', 'i|0')),
    pm('Pressing valve closed', dl('BA03', 'i|1')),
    pm('Outlet valve closed', dl('BA03', 'i|2')),
    pm('Vent valve closed', dl('BA03', 'i|3')),
    pm('Sand silo vent fan running or remote', 'cal:baSandFan'),
    pm('Sand silo vent fan not tripped', dl('BA03', 'i|10|neg')),
    pm('Air tank pressure not low', dl('BA03', 'i|6|neg')),
    pm('No charging emergency stop', dl('BA03', 'i|7|neg')),
    pm('No conveying emergency stop', dl('BA03', 'i|8|neg')),
    pm('Not in step 2', dl('BA03', 'i|9|neg')),
    pm('Automatic mode (local panel)', dl('BA19', 'i|3'))
  ];
  const al = (label, s, r) => D(label, '', dl(s, 'o|' + r), 'ALARM', 'NORMAL');
  const STEPS = [
    ['0  Waiting', 'BA04', 8],
    ['2  Charge beginning', 'BA05', 14],
    ['3  Material begins to enter', 'BA06', 7],
    ['4  Inlet gate valve opening', 'BA07', 7],
    ['5  Charging', 'BA08', 6],
    ['6  Charging end', 'BA09', 13],
    ['7  Charging finished', 'BA10', 7],
    ['8  Conveying beginning', 'BA11', 22],
    ['9  Pressing beginning', 'BA12', 3],
    ['10  Vessel pressure high', 'BA13', 4],
    ['11  Outlet valve open', 'BA14', 5],
    ['12  Conveying', 'BA15', 5],
    ['13  Cleaning start', 'BA16', 5],
    ['14  Cleaning end', 'BA17', 5],
    ['15  Batch finished', 'BA18', 5]
  ];
  const NS = 8;

  page({
    id: 'ash-recycle',
    group: 'Boiler',
    title: 'Bottom ash recycle',
    about:
      'Coarse bottom ash from the vibrating screens through the buffer tank and the ash transmitter to the sand silo. Connections: flow diagram K1AU3-PD-071 Rev A sheet 2; the states are read from the logic drawings.',
    plan: {
      look: 'real',
      w: 1760,
      h: 1000,
      items: [
        /* ---- ash way ---- */
        at(L('ash', 'From the vibrating screens', { back: true }), 860, 60, { id: 'scr' }),
        at(
          E('silo', 'Recycle buffer tank', 'T-1091', [], {
            id: 'bt',
            h: 100,
            mon: [
              D('Level high', 'LS-BH1751', dl('BA60', 'i|15'), 'HIGH', 'NORMAL'),
              D('Level low', 'LS-BH1752', dl('BA19', 'i|0'), 'LOW', 'NORMAL')
            ]
          }),
          TX,
          190,
          { id: 'bt', sc: 1.9, lab: 'r' }
        ),
        at(HV('V-BH1768'), TX, 325, { id: 'h68', rot: 90, lab: 'r' }),
        at(
          E('valve', 'Inlet gate valve', 'XV-BH1751', [], {
            kind: 'shutoff',
            on: GATE,
            wrap: 14,
            mon: [D('Solenoid', 'SV-BH1759', dl('BA38', 'i|0'), 'ON', 'OFF')].concat(lim('BH1759', 'BA38', 1, 'BA38', 3), [abn('BA38', 2)])
          }),
          TX,
          410,
          { id: 'gate', rot: 90, lab: 'r' }
        ),
        at(
          M('silo', 'BOTTOM ASH TRANSMITTER', 'Ash transmitter', [], {
            id: 'tr',
            h: 84,
            tag: 'S-1090',
            on: HX.hk('bar-auto', dy('BA19|o|5', 'RUNNING', 'STOPPED')),
            perm: PERM,
            mon: [
              D('Vessel level high', 'LS-BH1750', dl('BA09', 'i|3'), 'HIGH', 'NORMAL'),
              D('Vessel pressure high', 'PSH-BH1750', dl('BA24', 'i|0'), 'HIGH', 'NORMAL'),
              D('Vessel pressure low', 'PSL-BH1750', dl('BA25', 'i|0'), 'LOW', 'NORMAL'),
              D('Charging precondition', '', dl('BA03', 'o|4'), 'OK', 'NOT OK'),
              D('Conveying precondition', '', dl('BA11', 'o|6'), 'OK', 'NOT OK'),
              D('Automatic start', '', dl('BA19', 'o|5'), 'ON', 'OFF'),
              al('Vessel pressure high high', 'BA24', 1),
              al('Conveying pressure high high', 'BA24', 3),
              al('Air source pressure low', 'BA25', 2),
              al('Pressing over time', 'BA26', 6),
              al('Conveying over time', 'BA27', 2),
              al('Vessel pressure high as conveying starts', 'BA28', 3),
              al('System fault', 'BA48', 4)
            ]
          }),
          TX,
          560,
          { id: 'tr', sc: 1.8, lab: 'r' }
        ),
        at(
          E('valve', 'Outlet valve', 'XV-BH1752', [], {
            kind: 'shutoff',
            on: OUT,
            wrap: 12,
            mon: [D('Solenoid', 'SV-BH1752', dl('BA39', 'i|0'), 'ON', 'OFF')].concat(lim('BH1752', 'BA39', 1, 'BA39', 3), [abn('BA39', 2)])
          }),
          1205,
          LY,
          { id: 'out', lab: 'b' }
        ),
        at(L('limestone-sand', 'To the sand silo'), 1640, LY, { id: 'sil' }),
        /* ---- vent line ---- */
        at(HV('V-BH1761'), 1520, 470, { id: 'h61', lab: 'b' }),
        at(
          E('valve', 'Vent valve', 'XV-BH1753', [], {
            kind: 'shutoff',
            on: VENT,
            wrap: 12,
            mon: [D('Solenoid', 'SV-BH1753', dl('BA39', 'i|4'), 'ON', 'OFF')].concat(lim('BH1753', 'BA39', 5, 'BA39', 7), [abn('BA39', 6)])
          }),
          VX,
          610,
          { id: 'ven', rot: 90, lab: 'r' }
        ),
        /* ---- plant air ---- */
        at(L('compressed-air', 'Plant air', { back: true }), 90, LY, { id: 'pa' }),
        at(HV('V-BH1758'), 215, LY, { id: 'h58', lab: 't' }),
        at(E('valve', '', '', [], { kind: 'check' }), 290, LY, { id: 'ck1' }),
        at(
          E('vvessel', 'Air tank', 'T-1092', [], { w: 80, h: 190, mon: [D('Air pressure low', 'PS-BH1750', dl('BA25', 'i|1'), 'LOW', 'NORMAL')] }),
          400,
          760,
          { id: 'tk', lab: 't' }
        ),
        at(HV('V-BH1753'), 510, 830, { id: 'h53', lab: 'b' }),
        at(L('ash', 'To the bottom ash silo'), 660, 830, { id: 'bas' }),
        at(HV('V-BH1757'), 510, LY, { id: 'h57', lab: 't' }),
        at(E('strainer', 'Filter', '', []), 580, LY, { id: 'fil', lab: 'b' }),
        at(
          E('valve', 'Pressing valve', 'XV-BH1750', [], {
            kind: 'shutoff',
            on: PRESS,
            wrap: 12,
            mon: [D('Open solenoid', 'SVO-BH1750', dl('BA38', 'i|4'), 'ON', 'OFF'), D('Close solenoid', 'SVC-BH1750', dl('BA38', 'i|7'), 'ON', 'OFF')].concat(
              lim('BH1750', 'BA38', 5, 'BA38', 8),
              [abn('BA38', 6)]
            )
          }),
          660,
          LY,
          { id: 'prs', lab: 't' }
        ),
        at(
          E('valve', '3-way valve', 'SV-BH1751', [], {
            kind: 'shutoff',
            on: WAY3,
            wrap: 10,
            mon: [D('Solenoid', 'SV-BH1751', dl('BA53', 'o|10'), 'ON', 'OFF')]
          }),
          760,
          LY,
          { id: 'w3', lab: 't' }
        ),
        at(HV('V-BH1759'), RX, 570, { id: 'h59', rot: 90, lab: 'l' }),
        at(E('valve', '', '', [], { kind: 'check' }), 930, 505, { id: 'ck2' }),
        at(HV('V-BH1758'), 905, 625, { id: 'h58b', lab: 'b' }),
        at(E('valve', '', '', [], { kind: 'check' }), 975, 625, { id: 'ck3' }),
        at(HV('V-BH1760'), 1000, 890, { id: 'h60', lab: 't' }),
        at(E('valve', '', '', [], { kind: 'check' }), BX, 820, { id: 'ck4', rot: -90 }),
        /* ---- step sequence ---- */
        ...STEPS.map((s, i) =>
          at(B(s[0], dy(s[1] + '|o|' + s[2], 'ACTIVE', 'OFF'), { w: 250 }), 160 + (i < NS ? 0 : 275), 120 + (i % NS) * 46, { id: 'st' + i })
        ),
        /* ---- local panel and push buttons ---- */
        at(
          E('cubicle', 'Local panel', 'S-1090', [], {
            mon: [
              D('Automatic selector', 'LI8-S-1090', dl('BA09', 'i|1'), 'AUTO', 'MANUAL'),
              D('Charging push button', 'LI1-S-1090', dl('BA05', 'i|4'), 'PRESSED', '-'),
              D('Conveying push button', 'LI2-S-1090', dl('BA11', 'i|13'), 'PRESSED', '-'),
              D('Cleaning push button', 'LI3-S-1090', dl('BA21', 'i|5'), 'PRESSED', '-'),
              D('Stop push button', 'LI4-S-1090', dl('BA04', 'i|2'), 'PRESSED', '-'),
              D('Reset push button', 'LI5-S-1090', dl('BA24', 'i|2'), 'PRESSED', '-'),
              D('Buzzer stop push button', 'LI6-S-1090', dl('BA04', 'i|4'), 'PRESSED', '-'),
              D('Emergency stop', 'LI7-S-1090', dl('BA22', 'i|1'), 'PRESSED', '-'),
              D('Charging lamp', 'LO1-S-1090', dl('BA54', 'o|0'), 'ON', 'OFF'),
              D('Conveying lamp', 'LO2-S-1090', dl('BA54', 'o|1'), 'ON', 'OFF'),
              D('Cleaning lamp', 'LO3-S-1090', dl('BA54', 'o|2'), 'ON', 'OFF'),
              D('Buzzer', 'LO4-S-1090', dl('BA54', 'o|4'), 'ON', 'OFF'),
              D('System fault lamp', 'LO5-S-1090', dl('BA54', 'o|3'), 'ON', 'OFF')
            ]
          }),
          1560,
          180,
          { id: 'lop', lab: 'l' }
        ),
        at(B('Mode', dy('BA09|i|1', 'AUTOMATIC', 'MANUAL'), { w: 250 }), 1570, 290, { id: 'mode' }),
        at(B('Transmitter push buttons', dy('BA48|o|4', 'FAULT', 'NORMAL'), { w: 250, mach: 'BOTTOM ASH TRANSMITTER' }), 1570, 340, { id: 'tpb' })
      ],
      pipes: [
        { med: 'solid', w: W, pts: ['scr.r', [TX, 60], 'bt.t'], flow: 'h:ba-scra|h:ba-scrb' },
        { med: 'solid', w: W, pts: ['bt.b', 'h68.l'], flow: GATE, arrow: false },
        { med: 'solid', w: W, pts: ['h68.r', 'gate.l'], flow: GATE, arrow: false },
        { med: 'solid', w: W, pts: ['gate.r', 'tr.t'], flow: GATE },
        { med: 'solid', w: W, pts: ['tr.b', [TX, LY], 'out.l'], flow: OUT, arrow: false },
        { med: 'solid', w: W, pts: ['out.r', [BX, LY], [VX, LY], 'sil.l'], flow: OUT },
        /* vent */
        { med: 'air', w: WA, pts: [[TX + 34, 505], [VX, 505], 'ven.l'], flow: VENT, arrow: false },
        { med: 'air', w: WA, pts: [[VX, 505], [VX, 470], 'h61.l'], arrow: false },
        { med: 'air', w: WA, pts: ['ven.r', [VX, LY]], flow: VENT },
        /* air */
        { med: 'air', w: WA, pts: ['pa.r', 'h58.l'], arrow: false },
        { med: 'air', w: WA, pts: ['h58.r', 'ck1.l'], arrow: false },
        { med: 'air', w: WA, pts: ['ck1.r', [360, LY]] },
        { med: 'air', w: WA, pts: [[440, LY], 'h57.l'], flow: PRESS, arrow: false },
        { med: 'air', w: WA, pts: ['h57.r', 'fil.l'], flow: PRESS, arrow: false },
        { med: 'air', w: WA, pts: ['fil.r', 'prs.l'], flow: PRESS, arrow: false },
        { med: 'air', w: WA, pts: ['prs.r', 'w3.l'], flow: PRESS },
        { med: 'air', w: WA, pts: ['w3.r', [RX, LY], [RX, 625], 'h59.r'], flow: PRESS, arrow: false },
        { med: 'air', w: WA, pts: ['h59.l', [RX, 505], 'ck2.l'], flow: PRESS, arrow: false },
        { med: 'air', w: WA, pts: ['ck2.r', [TX - 34, 505]], flow: PRESS },
        { med: 'air', w: WA, pts: [[RX, 625], 'h58b.l'], flow: PRESS, arrow: false },
        { med: 'air', w: WA, pts: ['h58b.r', 'ck3.l'], flow: PRESS, arrow: false },
        { med: 'air', w: WA, pts: ['ck3.r', [TX - 14, 625]], flow: PRESS },
        { med: 'air', w: WA, pts: ['w3.b', [760, 890], 'h60.l'], flow: PRESS + '&' + WAY3, arrow: false },
        { med: 'air', w: WA, pts: ['h60.r', [BX, 890], 'ck4.l'], flow: PRESS + '&' + WAY3, arrow: false },
        { med: 'air', w: WA, pts: ['ck4.r', [BX, LY]], flow: PRESS + '&' + WAY3 },
        { med: 'air', w: WA, pts: [[440, 830], 'h53.l'], arrow: false },
        { med: 'air', w: WA, pts: ['h53.r', 'bas.l'] }
      ],
      taps: [],
      texts: [
        { x: 36, y: 70, s: 'STEP SEQUENCE OF THE ASH TRANSMITTER', cls: 'hx-zone' },
        { x: 36, y: 640, s: 'CONVEYING AIR', cls: 'hx-zone' },
        { x: 1445, y: 100, s: 'CONTROLS', cls: 'hx-zone' }
      ]
    }
  });
})();
