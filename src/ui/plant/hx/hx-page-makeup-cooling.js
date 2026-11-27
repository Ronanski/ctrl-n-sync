/* HX page in the REALISTIC look: make-up water and closed cooling water (user 2026-11-17: "Ganyan ang HMI na gsto ko. Dapat
   iyan lang makita ko n mga itsura").
   THE PICTURE: on top the two demineralized water tanks with the three make-up pumps and the make-up header to its users;
   below the closed cooling water loop: expansion tank, the two closed cooling pumps, the three heat exchangers, the supply
   to the users and the return to the pumps.
   THE CONNECTIONS:
   - closed cooling water, read from K1AU3-PD-021 Rev D (auxiliary cooling water system): expansion tank T-1109 (LT-CW1109,
     filled from the make-up water through XV-MU1109), closed cooling pumps P-1108A / B with their strainers STR-CW1001 / 1002
     (DPT-CW1108-A / -B), pump discharge PT / TT-CW1152, heat exchangers H-1107A / B / C, supply PT / TT-CW1153 to the users
     (sampling rack, boiler feed pump coolers, generator air coolers A to D, turbine oil coolers A / B with TCV-CW1201, bottom
     ash screw conveyors A to D, fan oil coolers and bearings, gas air heater, air compressors and dryers), return 20 inch to
     the pumps;
   - make-up water, as temporary page 02 binds it (its source: K1AU3-PD-024, NOT re-read for this page): demineralized water
     tanks T-0708A / B (LT-MU0708-A / -B), make-up pumps P-0709A / B / C with their strainers (DPT-MU0709-A / -B / -C), make-up
     header PT-MU0709, make-up flow FT-MU1001, to the condenser make-up, the deaerator initial fill, the boiler initial fill
     and the expansion tank fill.
   Machines and values are the ones temporary page 02 binds (DITL-112, DITL-76 / 77).
   Drawn simpler: the users of the closed cooling water are one supply line with their names; the oil temperature valve
   TCV-CW1201 is on the Turbine oil page.
   The expansion tank fill valve XV-MU1109 and the hand valves V-MU / V-CW of temporary page 02 are HX.H pieces: their state
   and their faceplate are the ones of fp-pop.js. */
(function () {
  const { V, E, M, L, page } = HX;
  /* beta.557: monitor rows and VCB point of each closed cooling pump (DCS I/O list station 3: MIV-P1108x1, TT-CW1108-x*) */
  const acwMon = n => [
    V('VCB off', 'MIV-P1108' + n + '2', '', 0, { words: ['YES', 'NO'] }),
    V('Motor winding U', 'TT-CW1108-' + n + 'U', '°C', 0),
    V('Motor winding V', 'TT-CW1108-' + n + 'V', '°C', 0),
    V('Motor winding W', 'TT-CW1108-' + n + 'W', '°C', 0),
    V('Motor drive end bearing', 'TT-CW1108-' + n + '3', '°C', 0),
    V('Motor non drive end bearing', 'TT-CW1108-' + n + '4', '°C', 0)
  ];
  const K = 'kg/cm²';
  const at = (it, x, y, o) => Object.assign(it, { x, y }, o || {});
  const W_M = 6,
    W_S = 4;
  /* places (the drawing is 1760 x 1000) */
  const MX = 620,
    MY = [110, 230, 350] /* make-up pumps */,
    MSX = 500 /* their suction */,
    MHX = 860 /* make-up header */,
    UX = 1200 /* to the users of the make-up water */,
    ETX = 1300,
    ETY = 620 /* expansion tank */,
    CPX = 1000,
    CPY = [640, 830] /* closed cooling pumps */,
    CSX = 1130 /* their suction */,
    CDX = 840 /* their discharge header */,
    EIX = 720,
    EXX = 600,
    EOX = 480,
    EY = [600, 720, 840]; /* heat exchangers */
  const N = ['A', 'B', 'C'];
  const MU = N.map(n => 'm:MWP-' + n).join('|'),
    CW = 'm:ACWP-A|m:ACWP-B';

  page({
    id: 'makeup-cooling',
    group: 'Cooling and utilities',
    title: 'Make-up and closed cooling water',
    about:
      'Demineralized make-up water to the unit, and the closed cooling water loop of the auxiliaries (flow diagrams K1AU3-PD-024 and K1AU3-PD-021 Rev D).',
    plan: {
      look: 'real',
      w: 1760,
      h: 1000,
      items: [
        /* make-up water */
        at(
          E('tank', 'Demineralized water tank A', 'T-0708A', [V('Level', 'LIMU0708A', 'm', 1)], {
            id: 'dwa',
            level: ['LIMU0708A', 0, 15],
            wrap: 14
          }),
          120,
          210,
          { id: 'ta', sc: 2, lab: 't' }
        ),
        at(
          E('tank', 'Demineralized water tank B', 'T-0708B', [V('Level', 'LIMU0708B', 'm', 1)], {
            id: 'dwb',
            level: ['LIMU0708B', 0, 15],
            wrap: 14
          }),
          330,
          210,
          { id: 'tb', sc: 2, lab: 't' }
        ),
        ...N.map((n, i) =>
          at(
            M(
              'pump',
              'MWP-' + n,
              'Make-up pump ' + n,
              [V('Current', 'IIP0709' + n, 'A', 1), V('Strainer', 'DPIMU0709' + n, K, 3)],
              /* apk test 2026-11-22: the name in two lines, so its end clears the outlet valve box at 11 px on a 1280 tablet */
              { tag: 'P-0709' + n, wrap: 8 }
            ),
            MX,
            MY[i],
            { id: 'm' + i, lab: 'r' }
          )
        ),
        at(L('condensate', 'Condenser make-up'), 1500, MY[0], { id: 'u0' }),
        at(L('feedwater', 'Deaerator initial fill'), 1500, MY[1], { id: 'u1' }),
        at(L('drum-steam', 'Boiler initial fill'), 1500, MY[2], { id: 'u2' }),
        /* closed cooling water */
        at(HX.H('XV-MU1109', 'Fill valve XV-MU1109', { w: 170 }), ETX, 470, { id: 'fv' }),
        at(
          E('tank', 'Expansion tank', 'T-1109', [V('Level', 'LICW1109', 'm', 2)], {
            id: 'et',
            w: 70,
            h: 56,
            level: ['LICW1109', 0, 2]
          }),
          ETX,
          ETY,
          { id: 'et', sc: 1.7, lab: 'r' }
        ),
        ...['A', 'B'].map((n, i) =>
          at(
            M(
              'pump',
              'ACWP-' + n,
              'Closed cooling pump ' + n,
              [V('Current', 'IIP1108' + n, 'A', 1), V('Strainer', 'DPICW1108' + n, K, 3)],
              { tag: 'P-1108' + n, mon: acwMon(n), vcb: 'MIV-P1108' + n + '1' }
            ),
            CPX,
            CPY[i],
            { id: 'c' + i, mir: true, lab: 'b' }
          )
        ),
        ...N.map((n, i) =>
          at(E('cooler', n, 'H-1107' + n, [], { flow: CW }), EXX, EY[i], { id: 'e' + i, sc: 1.3, lab: 't' })
        ),
        at(L('sea-water', 'Sea water side'), EXX, 510, { id: 'swl' }),
        /* hand valves of the plant model (temporary page 02; K1AU3-PD-021 for the V-CW valves) */
        at(HX.H('V-MU0001'), 195, 380, { id: 'hm1' }),
        at(HX.H('V-MU0002'), 405, 380, { id: 'hm2' }),
        /* suction of each make-up pump (PD-024 D-7 / E-7 / F-7, YUA P&ID read 2026-11-27): V-MU0003 / 4 / 5 -> STR-MU0001 /
           2 / 3 -> EJ-MU000x -> P-0709x; the hand valves as valve symbols so the strainer has its place on the line */
        ...['V-MU0003', 'V-MU0004', 'V-MU0005'].map((t, i) => at(HX.HV(t), 524, MY[i], { id: 'hs' + i, lab: 'b' })),
        /* minimum flow lines MU-0-011 / 012 / 013 with their orifices RO-MU0709A ~ C (tag not printed), checks V-MU0012 / 14 / 16
           and V-MU0013 / 15 / 17, back to T-0708A / B (PD-024 B-8, YUA P&ID read 2026-11-27). Which orifice is on which pump's line
           is NOT IN DOCS (the lines cross on the sheet); drawn in order A, B, C, as a short branch with no label (map) */
        ...N.map((n, i) => at(E('orifice', '', '', []), 655, MY[i] - 75, { id: 'rm' + i, rot: 90 })),
        ...N.map((n, i) =>
          at(E('strainer', '', '', [], { flow: 'm:MWP-' + n }), 558, MY[i], { id: 'sm' + i, sc: 0.8 }) /* no label: the pump's Y button sits above; named in docs/phase9/equipment.json map */
        ),
        ...['V-MU0007', 'V-MU0009', 'V-MU0011'].map((t, i) =>
          at(HX.H(t, t, { w: 78 }), 818, MY[i] - 58 /* beta.373: outlet line up 13, off the pump names */, { id: 'hd' + i })
        ),
        at(HX.H('V-MU1031'), UX, 380, { id: 'hf1' }),
        at(HX.H('V-MU1032'), ETX, 524, { id: 'hf2' }),
        at(HX.H('V-MU1033', 'Bypass V-MU1033', { w: 140 }), ETX + 170, 470, { id: 'hf3' }),
        at(HX.H('V-CW1001'), 1215, 770, { id: 'hc1' }),
        ...['V-CW1002', 'V-CW1004'].map((t, i) => at(HX.H(t, t, { w: 80 }), 1083, CPY[i], { id: 'hcs' + i })),
        ...['V-CW1007', 'V-CW1009'].map((t, i) => at(HX.H(t, t, { w: 92 }), 920, CPY[i] - 50, { id: 'hcd' + i })),
        ...['V-CW1010', 'V-CW1011', 'V-CW1012'].map((t, i) => at(HX.H(t, t, { w: 78 }), 677, EY[i], { id: 'hei' + i })),
        ...['V-CW1013', 'V-CW1014', 'V-CW1015'].map((t, i) => at(HX.H(t, t, { w: 78 }), 523, EY[i], { id: 'heo' + i })),
        at(L('turbine-oil', 'Turbine oil coolers'), 300, 620, { id: 'tol' })
      ],
      pipes: [
        /* tanks to the make-up pumps, the pumps into the header */
        { med: 'water', w: W_M, pts: ['ta.r', [195, 266], [195, 420] /* UI check 2026-11-24 C1: outlet low at the side, the level under the tank stays clear */, [MSX, 420], [MSX, MY[0]]], flow: MU, arrow: false },
        { med: 'water', w: W_M, pts: ['tb.r', [405, 266], [405, 420]], flow: MU, arrow: false },
        ...N.flatMap((n, i) => [
          { med: 'water', w: W_M, pts: [[MSX, MY[i]], 'hs' + i + '.l'], flow: 'm:MWP-' + n, arrow: false },
          { med: 'water', w: W_M, pts: ['hs' + i + '.r', 'sm' + i + '.l'], flow: 'm:MWP-' + n + '&h:fv-V-MU000' + (i + 3), arrow: false },
          { med: 'water', w: W_M, pts: ['sm' + i + '.r', 'm' + i + '.s'], flow: 'm:MWP-' + n + '&h:fv-V-MU000' + (i + 3), arrow: false },
          {
            med: 'water',
            w: W_M,
            pts: ['m' + i + '.d', [MX - 2, MY[i] - 58], [MHX, MY[i] - 58]],
            flow: 'm:MWP-' + n,
            arrow: false
          },
          { med: 'water', w: 3, pts: [[655, MY[i] - 58], 'rm' + i + '.r'], flow: 'm:MWP-' + n, arrow: false },
          { med: 'water', w: 3, pts: ['rm' + i + '.l', [655, MY[i] - 92]], flow: 'm:MWP-' + n } /* back to the tanks (not drawn further) */
        ]),
        {
          med: 'water',
          w: W_M,
          pts: [
            [MHX, MY[0] - 45],
            [MHX, MY[2] - 45]
          ],
          flow: MU,
          arrow: false
        },
        {
          med: 'water',
          w: W_M,
          pts: [
            [MHX, MY[1]],
            [UX, MY[1]]
          ],
          flow: MU
        },
        {
          med: 'water',
          w: W_S,
          pts: [
            [UX, MY[0]],
            [UX, MY[2]]
          ],
          flow: MU,
          arrow: false
        },
        { med: 'water', w: W_S, pts: [[UX, MY[0]], 'u0.l'], flow: MU },
        { med: 'water', w: W_S, pts: [[UX, MY[1]], 'u1.l'], flow: MU },
        { med: 'water', w: W_S, pts: [[UX, MY[2]], 'u2.l'], flow: MU },
        /* expansion tank fill */
        { med: 'water', w: W_S, pts: [[UX, MY[2]], [UX, 410], [ETX, 410], 'fv.t'], flow: MU, arrow: false },
        { med: 'water', w: W_S, pts: ['fv.b', 'et.t'], flow: MU },
        /* closed cooling water loop */
        { med: 'cooling', w: W_M, pts: ['et.b', [ETX, 770], [CSX, 770]], flow: CW, arrow: false },
        {
          med: 'cooling',
          w: W_M,
          pts: [
            [CSX, 975],
            [CSX, CPY[0]]
          ],
          flow: CW,
          arrow: false
        },
        ...['A', 'B'].flatMap((n, i) => [
          { med: 'cooling', w: W_M, pts: [[CSX, CPY[i]], 'c' + i + '.s'], flow: 'm:ACWP-' + n, arrow: false },
          {
            med: 'cooling',
            w: W_M,
            pts: ['c' + i + '.d', [CPX + 2, CPY[i] - 50], [CDX, CPY[i] - 50]],
            flow: 'm:ACWP-' + n,
            arrow: false
          }
        ]),
        {
          med: 'cooling',
          w: W_M,
          pts: [
            [CDX, CPY[0] - 50],
            [CDX, CPY[1] - 50]
          ],
          flow: CW,
          arrow: false
        },
        {
          med: 'cooling',
          w: W_M,
          pts: [
            [CDX, EY[1]],
            [EIX, EY[1]]
          ],
          flow: CW
        },
        {
          med: 'cooling',
          w: W_M,
          pts: [
            [EIX, EY[0]],
            [EIX, EY[2]]
          ],
          flow: CW,
          arrow: false
        },
        ...N.flatMap((n, i) => [
          { med: 'cooling', w: W_M, pts: [[EIX, EY[i]], 'e' + i + '.r'], flow: CW, arrow: false },
          { med: 'cooling', w: W_M, pts: ['e' + i + '.l', [EOX, EY[i]]], flow: CW, arrow: false }
        ]),
        {
          med: 'cooling',
          w: W_M,
          pts: [
            [EOX, EY[0]],
            [EOX, EY[2]]
          ],
          flow: CW,
          arrow: false
        },
        {
          med: 'cooling',
          w: W_M,
          pts: [
            [EOX, EY[1]],
            [140, EY[1]],
            [140, 975],
            [CSX, 975]
          ],
          flow: CW
        }
      ],
      taps: [
        { x: 960, y: MY[1], side: 't', label: 'Make-up header', key: 'PIMU0709', unit: K, dp: 1, tag: 'PT-MU0709' },
        { x: 1090, y: MY[1], side: 't', label: 'Make-up flow', key: 'FIMU1001', unit: 'm³/h', dp: 1, tag: 'FT-MU1001' },
        { x: 784, y: EY[1], side: 't', label: 'Pump discharge', key: 'PICW1152', unit: K, dp: 1, tag: 'PT-CW1152' },
        { x: 784, y: EY[1], side: 'b', label: 'Temperature', key: 'TICW1152', unit: '°C', dp: 0, tag: 'TT-CW1152' },
        {
          x: 380,
          y: EY[1],
          side: 't',
          label: 'Supply to the users',
          key: 'PICW1153',
          unit: K,
          dp: 1,
          tag: 'PT-CW1153'
        },
        { x: 380, y: EY[1], side: 'b', label: 'Temperature', key: 'TICW1153', unit: '°C', dp: 0, tag: 'TT-CW1153' }
      ],
      texts: [
        { x: 20, y: 40, s: 'MAKE-UP WATER', cls: 'hx-name' },
        { x: 20, y: 500, s: 'CLOSED COOLING WATER', cls: 'hx-name' },
        /* apk test 2026-11-22: shorter lines, clear of the cooler outlet valves at 11 px on a 1280 tablet */
        { x: 160, y: 800, s: 'Users: turbine oil coolers,', cls: 'hx-note' },
        { x: 160, y: 818, s: 'generator air coolers, boiler feed', cls: 'hx-note' },
        { x: 160, y: 836, s: 'pump coolers, fans and gas air', cls: 'hx-note' },
        { x: 160, y: 854, s: 'heater, bottom ash screw conveyors,', cls: 'hx-note' },
        { x: 160, y: 872, s: 'air compressors and dryers,', cls: 'hx-note' },
        { x: 160, y: 890, s: 'sampling rack.', cls: 'hx-note' },
        { x: 620, y: 965, s: 'return to the pumps', cls: 'hx-note' }
      ]
    },
    /* trend groups (Phase 9, 2026-11-27): every pen is a value or a controller already on this page (its source is in the
       comments above); at most 8 pens a group (Phase 10 trend recorder) */
    trends: [
      {
        title: 'Make-up water',
        pens: [
          ['Tank A level', 'LIMU0708A', 'm'],
          ['Tank B level', 'LIMU0708B', 'm'],
          ['Make-up header pressure', 'PIMU0709', 'kg/cm²'],
          ['Make-up flow', 'FIMU1001', 'm³/h'],
          ['Pump A current', 'IIP0709A', 'A'],
          ['Pump C current', 'IIP0709C', 'A']
        ]
      },
      {
        title: 'Closed cooling water',
        pens: [
          ['Head tank level', 'LICW1109', 'm', 2],
          ['Pump discharge pressure', 'PICW1152', 'kg/cm²'],
          ['Supply pressure', 'PICW1153', 'kg/cm²'],
          ['Pump discharge temperature', 'TICW1152', '°C'],
          ['Supply temperature', 'TICW1153', '°C'],
          ['Pump A current', 'IIP1108A', 'A']
        ]
      }
    ]
  });
})();
