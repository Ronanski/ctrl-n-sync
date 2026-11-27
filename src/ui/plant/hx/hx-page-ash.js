/* HX page in the REALISTIC look: bottom ash and the electrostatic precipitator (user 2026-11-17: "Lahat ng luma na HMI, alisin
   dyan s app"; "Maintain ang quality at design na nasimulan").
   THE PICTURE: above, the precipitator cut open in the flue gas duct with its hoppers and the fly ash silo. Below, the way of
   the bottom ash as it stands: the four screw ash coolers under the furnace grate floor drop their ash on the chain conveyor,
   the bucket elevator lifts it to the screw conveyor, the two way separator sends it to the bottom ash silo or over the
   vibrating screens back to the sand silo.
   THE CONNECTIONS:
     K1AU3-PD-071 Rev A sheet 1  bottom ash transfer and recycle system: bottom ash coolers A / B / C / D (PD-072) on the
                                 bottom ash chain conveyor L-1090, bucket elevator L-1091, screw conveyor L-1092, two way
                                 separator L-1094, vibrating screen S-1092, bottom ash silo T-1090 (LT-BH1750) with bag
                                 filter S-1091 and fan F-1091, loading spout L-1093 to the truck
   The coolers themselves (L-1060A ~ D, ash and cooling water temperatures, PT / TT-CW1156), the furnace differential pressure
   control DPIC-FG108 (ABC-009A) with the screw speed SIC-L1060A, and every RUNNING are as temporary page 14 binds them
   (DITL-21A instances, DITL-BA59 inputs 8 / 9 / 10 / 11 / 13 / 14). PD-072 and the fly ash sheets were NOT re-read.
   The precipitator has no signal in the app (no snapshot; it runs from its own panel, PR-OPE-5002 1.1): it is drawn with its
   field faceplate (machine "ESP" of page 14), without field voltages and currents. The fly ash silo T-1251 has no signal.
   Drawn simpler: the five fields of the precipitator are one casing with three hoppers; the ash transmitters under the
   hoppers and the cooler inlet valves XV-BH1060A ~ D (no signal) are not drawn. The buffer tank T-1091 and the ash transmitter
   S-1090 of the recycle line have their own page (Bottom ash recycle).
   beta.556 (EIMI): the conveyors, the screens, the two-way separator and the bag filter fan have their START / STOP (DITL-BA61),
   their permissives (the AND gate of the ON COMMAND, DITL-BA63 / BA66 ~ BA69) and their monitor rows (DITL-BA59, BA60). The fly
   ash panel gives XA-FH1701 ~ XA-FH1704 to the DCS (I/O list): no drawing of the app reads them, they show -----. */
(function () {
  const { V, D, E, M, C, L, page } = HX;
  const B = HX.B;
  const MM = 'mmH₂O';
  const at = (it, x, y, o) => Object.assign(it, { x, y }, o || {});
  const run = (name, k) => HX.hk(name, 'data-dy="' + k + '" data-on="RUNNING" data-off="STOPPED"');
  const W_S = 6,
    W_G = 14;
  /* places (the drawing is 1760 x 1000) */
  const EX = 520,
    EY = 190,
    ES = 2.3 /* precipitator */,
    CXS = [165, 400, 635, 870],
    CY = 600 /* the four coolers */,
    KY = 800 /* chain conveyor */,
    LX = 1090 /* bucket elevator */,
    TOPY = 470 /* screw conveyor on top */,
    SLX = 1560,
    SLY = 720; /* bottom ash silo */
  const N = ['A', 'B', 'C', 'D'];
  const INST = ['', ' #B', ' #C', ' #D'];
  const cooler = i => 'm:ASH COOLER ' + N[i];
  const ANY = [0, 1, 2, 3].map(cooler).join('|');
  const CHAIN = run('ba-chain', 'DITL-BA59|i|7'),
    ELEV = run('ba-elev', 'DITL-BA59|i|8'),
    SCREW = run('ba-screw', 'DITL-BA59|i|9'),
    SCRA = run('ba-scra', 'DITL-BA59|i|10'),
    SCRB = run('ba-scrb', 'DITL-BA59|i|12'),
    BFAN = run('ba-fan', 'DITL-BA59|i|13');

  for (const id of ['BCH', 'BEL', 'BSC', 'BVS', 'BFF', 'BTW', 'BRS']) HX.mach('MK14', id);
  const dl = (s, k) => 'dl:DITL-' + s + '|' + k;
  const trip = (tag, k) => D('Motor trip', tag, k, 'TRIP', 'NORMAL'),
    rem = (tag, k) => D('Selector', tag, k, 'REMOTE', 'LOCAL'),
    est = (tag, k) => D('Local emergency stop', tag, k, 'NORMAL', 'PRESSED'),
    spd = (tag, k) => D('Speed switch', tag, k, 'TURNING', 'STOPPED');
  /* the rows of the AND gate in front of each ON COMMAND: 1 = made */
  const pm = (label, key) => V(label, key, '', 0);
  const P0 = [pm('Conveyors starting precondition', dl('BA62', 'o|9')), pm('No conveyors emergency stop', dl('BA62', 'o|2|neg'))];
  /* one ON COMMAND starts both screens (DITL-BA63) */
  const SCP = P0.concat([pm('Selector remote', dl('BA59', 'o|4')), pm('No power fault', dl('BA63', 'o|13|neg'))]),
    SCM = [
      D('Screen A motor trip', 'MIT-S-1092-A', dl('BA59', 'i|17'), 'TRIP', 'NORMAL'),
      D('Screen B motor trip', 'MIT-S-1092-B', dl('BA59', 'i|19'), 'TRIP', 'NORMAL'),
      D('Screen A selector', 'MIL-S-1092-A', dl('BA59', 'i|3'), 'REMOTE', 'LOCAL'),
      D('Screen B selector', 'MIL-S-1092-B', dl('BA59', 'i|5'), 'REMOTE', 'LOCAL'),
      D('Screen A running', 'MIR-S-1092-A', dl('BA59', 'i|10')),
      D('Screen B running', 'MIR-S-1092-B', dl('BA59', 'i|12')),
      D('Screen A on command', 'MOR-S-1092-A', dl('BA71', 'o|0'), 'ON', 'OFF'),
      D('Screen B on command', 'MOR-S-1092-B', dl('BA71', 'o|1'), 'ON', 'OFF')
    ];
  /* DITL-BA66: (two-way open and a screen running) or (two-way closed and the ash silo not high) */
  HX.CALC.baScrewPath = v => {
    const a = [v(dl('BA60', 'o|6')), v(dl('BA59', 'o|11')), v(dl('BA60', 'o|7')), v(dl('BA60', 'o|18'))];
    return a.includes(null) ? null : Math.max(Math.min(a[0], a[1]), Math.min(a[2], 1 - a[3]));
  };

  page({
    id: 'ash',
    group: 'Boiler',
    title: 'Ash and precipitator',
    about:
      'Bottom ash from the four screw ash coolers to the bottom ash silo, and the electrostatic precipitator with the fly ash silo. Connections: flow diagram K1AU3-PD-071 Rev A; the states are read from the logic drawings.',
    plan: {
      look: 'real',
      w: 1760,
      h: 1000,
      items: [
        /* ---- precipitator and fly ash ---- */
        at(L('furnace-gas', 'From the air heater', { back: true }), 140, EY, { id: 'gin' }),
        at(E('esp', '', '', [], { on: 'm:ESP' }), EX, EY, { id: 'esp', under: true, sc: ES }),
        at(M('cubicle', 'ESP', 'Precipitator panel', []), 150, 320, { id: 'espp', lab: 'r' }),
        at(L('furnace-gas', 'To the induced draft fan'), 930, EY, { id: 'gout' }),
        at(
          E('silo', 'Fly ash silo', 'T-1251', [], {
            id: 'fa',
            h: 100,
            mon: [
              D('Fly ash system common alarm', 'XA-FH1701', '', 'ALARM', 'NORMAL'),
              D('Fly ash panel controller fault', 'XA-FH1702', '', 'FAULT', 'NORMAL'),
              D('Fly ash panel communication fault', 'XA-FH1703', '', 'FAULT', 'NORMAL'),
              D('Fly ash panel no power', 'XA-FH1704', '', 'NO POWER', 'NORMAL')
            ]
          }),
          1160,
          250,
          { id: 'fa', sc: 1.7, lab: 'r' }
        ),

        /* ---- furnace differential pressure and screw speed ---- */
        at(
          C('DPICFG108', 'Furnace differential pressure, mmH₂O', { sym: 'ctl', unit: '', pvdp: 0, wrap: 22 }),
          1480,
          130,
          {
            id: 'dpc',
            lab: 't'
          }
        ),
        at(C('SICL1060A', 'Screw speed A to D', { sym: 'ctl', unit: 'rpm', pvdp: 1, wrap: 30 }), 1660, 130, {
          id: 'sic',
          lab: 't'
        }),

        /* ---- the four screw ash coolers ---- */
        ...CXS.map((x, i) =>
          at(
            M(
              'screw',
              'ASH COOLER ' + N[i],
              'Ash cooler ' + N[i],
              [
                V('Ash in', 'TT-BH1060-' + N[i] + '1', '°C', 0),
                V('Ash out', 'TT-BH1060-' + N[i] + '2', '°C', 0),
                V('Water in', 'TT-CW1060-' + N[i] + '1', '°C', 0),
                V('Water out', 'TT-CW1060-' + N[i] + '2', '°C', 0)
              ],
              { w: 120, tag: 'L-1060' + N[i] }
            ),
            x,
            CY,
            { id: 'c' + i, sc: 1.3, lab: 'b' }
          )
        ),
        ...CXS.map((x, i) =>
          at(
            B('Forward', 'data-dy="DITL-21A' + INST[i] + '|i|0" data-on="RUNNING" data-off="STOPPED"', { w: 110 }),
            x + 20,
            CY - 58,
            {
              id: 'cf' + i
            }
          )
        ),

        /* ---- chain conveyor, bucket elevator, screw conveyor, screens, silo ---- */
        at(
          M('conveyor', 'CHAIN CONVEYOR', 'Chain conveyor', [], {
            w: 620,
            tag: 'L-1090',
            perm: P0.concat([
              pm('Selector remote', dl('BA59', 'o|0')),
              pm('Bucket elevator running', dl('BA59', 'o|8')),
              pm('No power fault', dl('BA68', 'o|10|neg')),
              pm('Not blocked', dl('BA68', 'o|12|neg')),
              pm('No speed fault', dl('BA68', 'o|14|neg'))
            ]),
            mon: [
              spd('SS-BH1750', dl('BA60', 'i|0')),
              D('Block switch', 'ZS-BH1750', dl('BA60', 'i|1'), 'BLOCKED', 'NORMAL'),
              trip('MIT-L-1090', dl('BA59', 'i|14')),
              rem('MIL-L-1090', dl('BA59', 'i|0')),
              est('ES-L-1090', dl('BA59', 'i|21')),
              D('On command', 'MOR-L-1090', dl('BA71', 'o|9'), 'ON', 'OFF')
            ]
          }),
          540,
          KY,
          { id: 'kc', sc: 1.4, lab: 'b' }
        ),
        at(
          M('elevator', 'BUCKET ELEVATOR', 'Bucket elevator', [], {
            h: 250,
            tag: 'L-1091',
            wrap: 10,
            perm: P0.concat([
              pm('Selector remote', dl('BA59', 'o|1')),
              pm('Screw conveyor running', dl('BA59', 'o|9')),
              pm('No power fault', dl('BA67', 'o|10|neg')),
              pm('Not blocked', dl('BA67', 'o|12|neg')),
              pm('No speed fault', dl('BA67', 'o|14|neg')),
              pm('Chain not slack', dl('BA67', 'o|16|neg'))
            ]),
            mon: [
              spd('SS-BH1751', dl('BA60', 'i|2')),
              D('Chain slack switch', 'ZS-BH1751', dl('BA60', 'i|3'), 'SLACK', 'NORMAL'),
              D('Block switch', 'ZS-BH1752', dl('BA60', 'i|4'), 'BLOCKED', 'NORMAL'),
              trip('MIT-L-1091', dl('BA59', 'i|15')),
              rem('MIL-L-1091', dl('BA59', 'i|1')),
              est('ES-L-1091', dl('BA59', 'i|22')),
              D('On command', 'MOR-L-1091', dl('BA71', 'o|8'), 'ON', 'OFF')
            ]
          }),
          LX,
          650,
          { id: 'el', sc: 1.4, lab: 'l' }
        ),
        at(
          M('screw', 'SCREW CONVEYOR', 'Screw conveyor', [], {
            w: 130,
            tag: 'L-1092',
            perm: P0.concat([
              pm('Selector remote', dl('BA59', 'o|2')),
              pm('Way open: to a running screen, or to the silo below its high level', 'cal:baScrewPath'),
              pm('No power fault', dl('BA66', 'o|13|neg')),
              pm('No speed fault', dl('BA66', 'o|16|neg'))
            ]),
            mon: [
              spd('SS-BH1752', dl('BA60', 'i|5')),
              trip('MIT-L-1092', dl('BA59', 'i|16')),
              rem('MIL-L-1092', dl('BA59', 'i|2')),
              est('ES-L-1092', dl('BA59', 'i|23')),
              D('On command', 'MOR-L-1092', dl('BA71', 'o|7'), 'ON', 'OFF')
            ]
          }),
          1260,
          TOPY,
          { id: 'sc', sc: 1.3, lab: 't' }
        ),
        at(
          M('valve', 'L-1094 TWO-WAY SEPARATOR', 'Two-way separator', [], {
            kind: 'motor',
            tag: 'L-1094',
            wrap: 20,
            perm: [pm('No close command', dl('BA65', 'i|6|neg'))],
            mon: [
              D('Open limit', 'ZSO-BH1754', dl('BA60', 'i|6'), 'OPEN', 'NOT OPEN'),
              D('Closed limit', 'ZSC-BH1754', dl('BA60', 'i|7'), 'CLOSED', 'NOT CLOSED'),
              D('Open command', 'SVO-BH1754', dl('BA71', 'o|5'), 'ON', 'OFF'),
              D('Close command', 'SVC-BH1754', dl('BA71', 'o|6'), 'ON', 'OFF'),
              D('Abnormal', 'XV-BH1754', dl('BA65', 'o|16'), 'FAULT', 'NORMAL')
            ]
          }),
          1329,
          552,
          { id: 'tws', sc: 0.8, rot: 90, lab: 'r' }
        ),
        at(
          B('Conveyors: reset, emergency stop', 'data-dy="DITL-BA62|o|2" data-on="EMERGENCY STOP" data-off="NORMAL"', {
            mach: 'BOTTOM ASH CONVEYORS',
            w: 260
          }),
          1590,
          440,
          { id: 'brs' }
        ),
        at(M('screen', 'VIBRATING SCREEN', 'Vibrating screen A', [], { on: SCRA, tag: 'S-1092A', wrap: 18, perm: SCP, mon: SCM }), 1290, 640, {
          id: 'vsa',
          sc: 1.4,
          lab: 'b' /* UI check 2026-11-24 C1: under the screen; at its left the feed line to screen B goes down */
        }),
        at(M('screen', 'VIBRATING SCREEN', 'Vibrating screen B', [], { on: SCRB, tag: 'S-1092B', wrap: 18 }), 1290, 760, {
          id: 'vsb',
          sc: 1.4,
          lab: 'b'
        }),
        at(L('ash-recycle', 'Coarse ash to the recycle buffer tank'), 1270, 890, { id: 'rcl' }),
        at(
          E('silo', 'Bottom ash silo', 'T-1090', [V('Level', 'LT-BH1750', '%', 1)], {
            id: 'ba',
            h: 110,
            level: ['LT-BH1750', 0, 100] /* beta.556: in % (alarm list HIGH 90, LOW 40; 16.PNG 15.8 %), was drawn as m of 12 */,
            mon: [
              V('Level', 'LT-BH1750', '%', 1),
              D('Level high', 'LS-BH1754', dl('BA60', 'i|18'), 'HIGH', 'NORMAL'),
              D('Level low', 'LS-BH1753', dl('BA60', 'i|19'), 'LOW', 'NORMAL'),
              D('Discharging to the truck', 'LI1-L-1093', dl('BA60', 'i|14')),
              D('Bag filter differential pressure high', 'PDS_H-BH1750', dl('BA60', 'i|16'), 'HIGH', 'NORMAL'),
              D('Bag filter differential pressure low', 'PDS_L-BH1750', dl('BA60', 'i|17'), 'LOW', 'NORMAL')
            ]
          }),
          SLX,
          SLY,
          { id: 'ba', sc: 1.9, lab: 'r' }
        ),
        at(
          M('fan', 'BAG FILTER FAN', 'Bag filter fan', [], {
            tag: 'F-1091',
            perm: P0.concat([pm('Selector remote', dl('BA59', 'o|6')), pm('No power fault', dl('BA69', 'o|9|neg'))]),
            mon: [
              trip('MIT-F-1091', dl('BA59', 'i|20')),
              rem('MIL-F-1091', dl('BA59', 'i|6')),
              D('On command', 'MOR-F-1091', dl('BA71', 'o|10'), 'ON', 'OFF'),
              D('Filter cleaning solenoid', 'SV-BH1758', dl('BA71', 'o|11'), 'ON', 'OFF')
            ]
          }),
          1680,
          560,
          { id: 'bf', sc: 0.8, lab: 't' }
        ),
        /* ---- fly ash transmitters and the other P&ID items (YUA P&ID read 2026-11-27) ---- */
        /* PD-073 sh1/9: each hopper -> V-FH -> XV-FH inlet dome -> transmitter -> XV-FH outlet -> FH-1-70x conveying line -> fly ash
           silo T-1251; EP-1A / B 1000 L (S-1250A / B), EP-2 1000 L (S-1251), EP-3 600 L (S-1252), EP-4 200 L (S-1253), EP-5 100 L
           (S-1254), air heater hoppers AH-A ~ D 100 L (S-1255A ~ D). Drawn as one group per pair on the one collecting line; the
           five conveying lines FH-1-700 ~ 706 are drawn as that one line. */
        ...[
          ['S-1255A-D', 4, 450],
          ['S-1250A / B', 2, 570],
          ['S-1251A / B', 2, 680],
          ['S-1252A / B', 2, 770],
          ['S-1253A / B', 2, 860],
          ['S-1254A / B', 2, 945]
        ].map(([t, n, x], i) => at(E('pots', '', t, [], { n }), x, 382, { id: 'ft' + i, lab: 'b' })),
        /* T-1250 conveying air tank (PD-073 sh1/9 F/G-2): plant air PA-1-042 -> T-1250 -> PV-PA1700 -> PA-1-707 to all transmitters */
        at(E('tank', 'Air tank', 'T-1250', [], { id: 'fat', liquid: 'none', w: 18, h: 28 }), 350, 392, { id: 'fat', lab: 'l' }),
        /* S-1256 dedust venting filter and F-1250 vent fan on the fly ash silo roof (PD-073 sh2/9 B-5) */
        at(E('strainer', '', 'S-1256', []), 1228, 150, { id: 'fvf', sc: 0.7, lab: 't' }),
        at(E('fan', 'Vent fan', 'F-1250', []), 1300, 150, { id: 'fvn', sc: 0.7, lab: 't' }),
        /* L-1250 dry unloader under the fly ash silo (PD-073 sh2/9 G-4) */
        at(E('spout', 'Dry unloader', 'L-1250', []), 1160, 345, { id: 'fdu', lab: 'l' }),
        /* L-1903 loading spout under the bottom ash silo (PD-071 sh1/2 G-7, printed L-1093) */
        at(E('spout', 'Loading spout', 'L-1903', []), SLX, 850, { id: 'bls', lab: 'r' }),
        /* S-1091 bag filter on the bottom ash silo roof, before the bag filter fan F-1091 (PD-071 sh1/2 C-8) */
        at(E('strainer', '', '', [], { flow: BFAN }), 1643, 600, { id: 'bgf', sc: 0.7, rot: -90 }) /* no label: no room between the silo and the fan; named in docs/phase9/equipment.json map */
      ],
      pipes: [
        /* flue gas through the precipitator */
        { med: 'gas', w: W_G, pts: ['gin.r', 'esp.l'], flow: 'm:IDF' },
        { med: 'gas', w: W_G, pts: ['esp.r', 'gout.l'], flow: 'm:IDF' },
        /* fly ash from the hoppers to the silo */
        { med: 'solid', w: 4, pts: ['esp.h1', [EX - 48 * ES, 382], [1000, 382]], flow: 'm:ESP', arrow: false },
        { med: 'solid', w: 4, pts: ['esp.h2', [EX, 382]], flow: 'm:ESP', arrow: false },
        { med: 'solid', w: 4, pts: ['esp.h3', [EX + 48 * ES, 382]], flow: 'm:ESP', arrow: false },
        { med: 'solid', w: 4, pts: [[1000, 382], [1000, 130], [1160, 130], 'fa.t'], flow: 'm:ESP' },
        { med: 'solid', w: 4, pts: ['fa.b', 'fdu.t'], arrow: false },
        { med: 'solid', w: 4, pts: ['fdu.b', [1160, 385]], to: 'to truck' },
        { med: 'air', w: 3, pts: ['fat.r', [395, 396], [395, 382], [410, 382]], arrow: false },
        { med: 'air', w: 3, pts: [[1180, 172], [1180, 150], 'fvf.l'], arrow: false },
        { med: 'air', w: 3, pts: ['fvf.r', 'fvn.in'], arrow: false },
        /* bottom ash: furnace, coolers, chain conveyor */
        ...CXS.flatMap((x, i) => [
          { med: 'solid', w: W_S, pts: [[x - 48 * 1.3, 470], 'c' + i + '.in'], flow: cooler(i) },
          { med: 'solid', w: W_S, pts: ['c' + i + '.out', [x + 48 * 1.3, KY - 12]], flow: cooler(i) }
        ]),
        /* conveyor to the elevator, up, across, down to the silo or over the screens */
        {
          med: 'solid',
          w: W_S,
          pts: ['kc.r', [1030, KY + 4], [1030, 650 + 115 * 1.4], 'el.in'],
          flow: CHAIN,
          arrow: false
        },
        {
          med: 'solid',
          w: W_S,
          pts: ['el.out', [1150, 650 - 113 * 1.4], [1150, TOPY - 18.2], 'sc.in'],
          flow: ELEV,
          arrow: false
        },
        { med: 'solid', w: W_S, pts: ['sc.out', 'tws.l'], flow: SCREW, arrow: false },
        { med: 'solid', w: W_S, pts: ['tws.r', [1329, 590], [SLX, 590], 'ba.t'], flow: SCREW },
        { med: 'solid', w: W_S, pts: [[1329, 590], [1259, 590], 'vsa.in'], flow: SCRA },
        {
          med: 'solid',
          w: W_S,
          pts: [[1259, 590], [1200, 590], [1200, 720], [1259, 720], 'vsb.in'],
          flow: SCRB,
          arrow: false
        },
        { med: 'solid', w: 4, pts: ['vsa.over', [1400, 651], [1400, 890], 'rcl.r'], flow: SCRA + '|' + SCRB },
        { med: 'solid', w: 4, pts: ['vsb.over', [1400, 771]], flow: SCRB, arrow: false },
        { med: 'air', w: 4, pts: [[SLX + 30, 630], [1643, 630], 'bgf.l'], flow: BFAN, arrow: false },
        { med: 'air', w: 4, pts: ['bgf.r', [1643, 560], 'bf.in'], flow: BFAN, arrow: false },
        { med: 'solid', w: W_S, pts: ['ba.b', 'bls.t'], arrow: false },
        { med: 'solid', w: W_S, pts: ['bls.b', [SLX, 895]], to: 'to truck' }
      ],
      taps: [],
      texts: [
        { x: 24, y: 60, s: 'PRECIPITATOR AND FLY ASH', cls: 'hx-zone' },
        { x: EX, y: 86, s: 'Precipitator', cls: 'hx-name', anchor: 'middle' },
        { x: 24, y: 78, s: 'The precipitator runs from its own panel.', cls: 'hx-note' },
        { x: 24, y: 95, s: 'Field voltages and currents have no signal in the app.', cls: 'hx-note' },
        { x: 24, y: 440, s: 'BOTTOM ASH', cls: 'hx-zone' },
        { x: 24, y: 462, s: 'from the furnace grate floor', cls: 'hx-note' },
        /* apk test 2026-11-22: the four values stood in one row and ran into each other at 11 px on a 1280 tablet: two by two */
        { x: 300, y: 428, s: 'Bed pressure drop 1', key: 'DPT-FG1081', unit: MM, dp: 0 },
        { x: 300, y: 446, s: 'Bed pressure drop 2', key: 'DPT-FG1082', unit: MM, dp: 0 },
        { x: 620, y: 428, s: 'Cooling water', key: 'PT-CW1156', unit: 'kg/cm²' },
        { x: 620, y: 446, s: 'Cooling water temperature', key: 'TT-CW1156', unit: '°C', dp: 0 },
        { x: 1390, y: 250, s: 'Furnace differential pressure low', cls: 'hx-note' },
        { x: 1390, y: 267, s: 'stops the coolers. Cycle mode', cls: 'hx-note' },
        { x: 1390, y: 284, s: 'timer 15 minutes (DITL-21E).', cls: 'hx-note' }
      ]
    }
  });
})();
