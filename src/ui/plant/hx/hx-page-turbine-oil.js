/* HX page in the REALISTIC look: turbine oil (user 2026-11-17: "Ganyan ang HMI na gsto ko. Dapat iyan lang makita ko n mga
   itsura").
   THE PICTURE: the turbine and the generator on top with the bearing oil header above their bearings; below on the left the
   main oil tank with its pumps, the two lube oil coolers and the oil filter; on the right the two control oil pumps, the
   control oil filter, the control oil header to the turbine valves and the trip oil behind the master trip solenoid.
   THE CONNECTIONS, as the temporary page 04 "036 TURBINE OIL" binds them (its sources: control room snapshot 36.PNG, the
   turbine control system model tcs.js, ABC-053 for the cooler outlet temperature): main oil tank T-1920 with its vapour
   extractor F-1937 and the oil purifier P-1941 (local panel); main oil pumps P-1922A / B (PTLO1922A / B), DC emergency oil
   pump P-1923 (PTLO1923) straight to the bearing header; lube oil coolers A / B (inlet TELO1001, outlet TE-LO1002-1 / -2,
   cooling water valve TCV-CW1201 of TICLO1002), oil filter, bearing oil header (PTLO10031 / 32 / 33) to the turbine and
   generator bearings (generator bearings No. 3 / No. 4: TEGE1007 / TEGE1008); control oil pumps P-1931A / B (PTLO1931A / B),
   control oil filter, control oil header (PTLO10061 / 62 / 63) to the main stop valves, the control valves and the combined
   reheat valves; master trip solenoid and trip oil (PTLO10071 / 72 / 73).
   Oil unit items from Hitachi 310PB64-455 (YUA read 2026-11-27): duplex oil filter S-1932A / B, control oil filters
   S-1933A / B, mist eliminator S-1936, purifier strainer S-1943 and coalescer S-1942, lube oil accumulators T-1934A ~ C,
   control oil accumulator T-1395, trip oil accumulator T-1938.
   NO flow diagram of the oil system was read for this page (it is a drawing of the turbine maker, not in K1AU3-A1-0-001):
   the tags, names and order are those of temporary page 04. Check the page against the maker's oil diagram before the
   temporary page is removed.
   The pumps belong to the turbine control system: a click opens their turbine control system faceplate. */
(function () {
  const { V, E, M, C, L, page } = HX;
  const K = 'kg/cm²';
  const at = (it, x, y, o) => Object.assign(it, { x, y }, o || {});
  const W_L = 6,
    W_S = 4;
  /* places (the drawing is 1760 x 1000) */
  const TX = 560,
    TY = 200 /* turbine: shaft centre */,
    BH = 100 /* bearing oil header */,
    RX = 880 /* riser to the bearing oil header */,
    KX = 200,
    KY = 760,
    KS = 2.8 /* main oil tank */,
    PX = 430,
    PS = 1.3,
    AY = 660,
    BY = 800,
    EY = 940 /* main oil pumps A, B, emergency oil pump */,
    SX = 330 /* suction line of the lube oil pumps */,
    DX = 640 /* discharge header of the main oil pumps */,
    CX = 780,
    CS = 1.6 /* coolers */,
    QX = 1180 /* control oil pumps */,
    HX2 = 1400 /* control oil riser */,
    CH = 330; /* control oil header */
  const MOP = 'm:MOP-A|m:MOP-B',
    LUBE = MOP + '|m:EOP',
    COP = 'm:COP-A|m:COP-B',
    ON = 'v:SI-TB>50';
  const drop = x => ({
    med: 'lube',
    w: W_S,
    pts: [
      [x, BH],
      [x, TY - 15]
    ],
    flow: LUBE
  });
  const act = (id, name, tag, x) => ({
    item: at(E('valve', name, tag, [], { kind: 'control', wrap: 12 }), x, 200, { id, rot: -90, lab: 't' }),
    pipe: { med: 'lube', w: W_S, pts: [[x, CH], id + '.l'], flow: COP }
  });
  const A = [
    act('msv', 'Main stop valves', 'A, B', 1250),
    act('cv', 'Control valves', 'A, B', 1400),
    act('crv', 'Combined reheat valves', 'A1, A2, B1, B2', 1550)
  ];

  page({
    id: 'turbine-oil',
    group: 'Turbine and generator',
    title: 'Turbine oil',
    about:
      'Lubricating oil to the turbine and generator bearings, control oil to the turbine valves. Tags and order as temporary page 04 binds them (control room snapshot 36).',
    plan: {
      look: 'real',
      w: 1760,
      h: 1000,
      items: [
        at(E('tgset', '', '', [], { on: ON }), TX, TY, { id: 'tg', under: true }),
        at(E('generator', '', '', [], { on: ON }), TX - 332, TY, { id: 'gen', under: true }),
        /* live Cold run 2026-11-18 F-W: the turning gear (TCS 1.19), so the operator can turn the shaft before gland sealing */
        at(M('motor', 'TURNING GEAR', 'Turning gear', [
            V('Speed', 'SI-TB', 'rpm', 0),
            /* beta.557: PT-IA1128 #1 air buffer tank of turning gear pressure (I/O list S4 AI0437) */
            V('Air buffer tank', 'PT-IA1128', 'kg/cm²', 2)
          ], { tag: 'ZS-LO1906' }), TX - 332, TY + 110, {
          id: 'tgm',
          sc: 1.4,
          lab: 'b'
        }),
        at(E('tank', 'Main oil tank', 'T-1920', [], { id: 'mot', liquid: 'oil' }), KX, KY, {
          id: 'tk',
          sc: KS,
          lab: 'l'
        }),
        at(M('fan', 'VAPOUR EXTRACTOR', 'Vapour extractor', [], { tag: 'F-1937' }), KX + 34, 560, {
          id: 'vx',
          sc: 0.8,
          lab: 'r'
        }),
        at(M('pump', 'OIL PURIFIER', 'Oil purifier', [], { tag: 'P-1941' }), 90, 940, {
          id: 'pu',
          mir: true,
          lab: 'b'
        }),
        at(M('pump', 'MOP-A', 'Main oil pump A', [V('Discharge', 'PTLO1922A', K, 1)], { tag: 'P-1922A' }), PX, AY, {
          id: 'pa',
          sc: PS,
          lab: 'r'
        }),
        at(M('pump', 'MOP-B', 'Main oil pump B', [V('Discharge', 'PTLO1922B', K, 1)], { tag: 'P-1922B' }), PX, BY, {
          id: 'pb',
          sc: PS,
          lab: 'r'
        }),
        at(M('pump', 'EOP', 'Emergency oil pump', [V('Discharge', 'PTLO1923', K, 1)], { tag: 'P-1923' }), PX, EY, {
          id: 'pe',
          sc: PS,
          lab: 'r'
        }),
        at(E('cooler', 'Lube oil cooler A', '', [], { flow: MOP }), CX, AY, { id: 'ca', sc: CS, lab: 'b' }),
        at(E('cooler', 'Lube oil cooler B', '', [], { flow: MOP }), CX, BY, { id: 'cb', sc: CS, lab: 'b' }),
        at(C('TICLO1002', 'Oil temperature valve', { tag: 'TCV-CW1201', wrap: 14 }), 710, 575, { id: 'tv', lab: 't' }),
        at(L('makeup-cooling', 'Cooling water', { back: true }), 575, 575, { id: 'cwl' }),
        at(E('strainer', 'Duplex oil filter', 'S-1932A / B', [], { flow: MOP }), RX, 520, { id: 'of', rot: -90, lab: 'r' }),
        at(M('pump', 'COP-A', 'Control oil pump A', [V('Discharge', 'PTLO1931A', K, 1)], { tag: 'P-1931A' }), QX, AY, {
          id: 'qa',
          sc: PS,
          lab: 'r'
        }),
        at(M('pump', 'COP-B', 'Control oil pump B', [V('Discharge', 'PTLO1931B', K, 1)], { tag: 'P-1931B' }), QX, BY, {
          id: 'qb',
          sc: PS,
          lab: 'r'
        }),
        at(E('strainer', 'Control oil filters', 'S-1933A / B', [], { flow: COP }), HX2, 500, { id: 'cf', rot: -90, lab: 'r' }),
        ...A.map(a => a.item),
        /* Hitachi oil unit items, read by YUA 2026-11-27 from Hitachi 310PB64-455 (key plan of the oil unit; part 2 of the
           P&ID read). Where each one sits on its line is that drawing's; the line order around them is NOT IN DOCS. */
        at(E('strainer', 'Mist eliminator', 'S-1936', [], { flow: 'm:VAPOUR EXTRACTOR' }), KX, 600, {
          id: 'me', rot: -90, sc: 0.8, lab: 'l' }) /* tank top, on the vapour extractor line */,
        at(E('strainer', '', '', [], { flow: 'm:OIL PURIFIER' }), 163, 940, { id: 'ps', sc: 0.8 }) /* S-1943 suction strainer of P-1941 */,
        at(E('strainer', '', '', [], { flow: 'm:OIL PURIFIER' }), 92, 873, { id: 'pc', rot: -90, sc: 0.8 }) /* S-1942 coalescer filter after P-1941 */,
        at(E('tank', 'Lube oil accumulators', 'T-1934A-C', [], { id: 'lac', liquid: 'oil', w: 18, h: 34 }), 840, 445, {
          id: 'lac', lab: 'l', wrap: 12 }) /* on the lube oil header */,
        /* T-1395 in the equipment list; printed T-n935 control oil accumulator on 310PB64-455 (T-1935 most likely) */
        at(E('tank', 'Control oil accumulator', 'T-1395', [], { id: 'cac', liquid: 'oil', w: 18, h: 34 }), 1500, 445, {
          id: 'cac', lab: 'r', wrap: 12 }),
        ...[0, 1].map(i => at(E('orifice', '', '', []), 850, (i ? BY : AY) - 42, { id: 'oc' + i, rot: 90, sc: 0.8 })) /* OR-CW1001A / B, no label (map) */,
        /* T-1128 turning gear air buffer tank, 0.5 m3 (PD-023 sh4/6 C-3/4, YUA P&ID read 2026-11-27): instrument air
           IA-1-109 to the turning gear of the Hitachi lube oil system; its pressure PT-IA1128 is the row under the turning gear */
        at(E('tank', 'Air buffer tank', 'T-1128', [], { id: 'iab', liquid: 'none', w: 22, h: 38 }), 110, 300, { id: 'iab', lab: 't' }),
        at(E('tank', '', '', [], { id: 'tac', liquid: 'oil', w: 16, h: 28 }), 1712, 290, { id: 'tac' }) /* T-1938 trip oil accumulator */,
        at(E('valve', 'Master trip solenoid', '', [], { kind: 'control', wrap: 12 }), 1660, CH, {
          id: 'mts',
          lab: 't'
        }),
        at(L('turbine', 'Turbine'), 1000, 40, { id: 'tbl' })
      ],
      pipes: [
        /* main oil tank: vapour extractor, purifier, suction of the pumps */
        { med: 'air', w: W_S, pts: ['tk.t', 'me.l'], flow: 'm:VAPOUR EXTRACTOR', arrow: false },
        { med: 'air', w: W_S, pts: ['me.r', [KX, 560], 'vx.in'], flow: 'm:VAPOUR EXTRACTOR', arrow: false },
        { med: 'air', w: W_S, pts: ['vx.out', [KX + 32, 500]], to: 'outdoor', flow: 'm:VAPOUR EXTRACTOR' },
        { med: 'lube', w: W_S, pts: ['tk.b', [KX, 940], 'ps.r'], flow: 'm:OIL PURIFIER', arrow: false },
        { med: 'lube', w: W_S, pts: ['ps.l', 'pu.s'], flow: 'm:OIL PURIFIER', arrow: false },
        { med: 'lube', w: W_S, pts: ['pu.d', 'pc.l'], flow: 'm:OIL PURIFIER', arrow: false },
        { med: 'lube', w: W_S, pts: ['pc.r', [92, 838], 'tk.l'], flow: 'm:OIL PURIFIER' },
        /* accumulators */
        { med: 'lube', w: W_S, pts: [[RX, 470], [840, 470], 'lac.b'], flow: MOP, arrow: false },
        { med: 'lube', w: W_S, pts: [[HX2, 470], [1500, 470], 'cac.b'], flow: COP, arrow: false },
        { med: 'lube', w: W_S, pts: [[1712, CH], 'tac.b'], flow: COP, arrow: false },
        { med: 'lube', w: W_L, pts: ['tk.r', [SX, 838]], flow: LUBE, arrow: false },
        {
          med: 'lube',
          w: W_L,
          pts: [
            [SX, AY],
            [SX, EY]
          ],
          flow: LUBE,
          arrow: false
        },
        { med: 'lube', w: W_L, pts: [[SX, AY], 'pa.s'], flow: 'm:MOP-A', arrow: false },
        { med: 'lube', w: W_L, pts: [[SX, BY], 'pb.s'], flow: 'm:MOP-B', arrow: false },
        { med: 'lube', w: W_L, pts: [[SX, EY], 'pe.s'], flow: 'm:EOP', arrow: false },
        /* main oil pumps, coolers, filter, bearing oil header */
        {
          med: 'lube',
          w: W_L,
          pts: ['pa.d', [PX - 3, AY - 60], [DX, AY - 60], [DX, AY]],
          flow: 'm:MOP-A',
          arrow: false
        },
        {
          med: 'lube',
          w: W_L,
          pts: ['pb.d', [PX - 3, BY - 60], [DX, BY - 60], [DX, BY]],
          flow: 'm:MOP-B',
          arrow: false
        },
        {
          med: 'lube',
          w: W_L,
          pts: [
            [DX, AY],
            [DX, BY]
          ],
          flow: MOP,
          arrow: false
        },
        { med: 'lube', w: W_L, pts: [[DX, AY], 'ca.l'], flow: MOP },
        { med: 'lube', w: W_L, pts: [[DX, BY], 'cb.l'], flow: MOP },
        { med: 'lube', w: W_L, pts: ['cb.r', [RX, BY], [RX, AY]], flow: MOP, arrow: false },
        { med: 'lube', w: W_L, pts: ['ca.r', [RX, AY], 'of.l'], flow: MOP },
        { med: 'lube', w: W_L, pts: ['of.r', [RX, BH], [185, BH]], flow: LUBE },
        /* emergency oil pump straight to the bearing oil header */
        {
          med: 'lube',
          w: W_S,
          pts: ['pe.d', [PX - 3, EY - 60], [1010, EY - 60], [1010, 420], [RX, 420]],
          flow: 'm:EOP'
        },
        drop(TX + 149),
        drop(TX),
        drop(TX - 211),
        drop(TX - 281),
        drop(TX - 375),
        /* cooling water to the coolers */
        { med: 'cooling', w: W_S, pts: ['cwl.r', 'tv.l'], flow: 'l:TICLO1002', arrow: false },
        { med: 'cooling', w: W_S, pts: ['tv.r', [CX, 575], 'ca.t'], flow: 'l:TICLO1002' },
        /* cooling water out of each lube oil cooler through its orifice OR-CW1001A / B (PD-021 D-3: cooler -> SG-CW1002 / 1001 -> RO,
           tag not printed -> V-CW1022 / 1021 -> return CW-1-022 / 021; YUA P&ID read 2026-11-27), drawn as a short stub */
        ...['ca', 'cb'].flatMap((c, i) => [
          { med: 'cooling', w: W_S, pts: [c + '.b1', [850, (i ? BY : AY) - 22], 'oc' + i + '.r'], flow: i ? '' : 'l:TICLO1002', arrow: false },
          { med: 'cooling', w: W_S, pts: ['oc' + i + '.l', [850, (i ? BY : AY) - 64]], flow: i ? '' : 'l:TICLO1002' }
        ]),
        /* control oil */
        { med: 'lube', w: W_S, pts: ['tk.b', [KX, 985], [1090, 985], [1090, AY]], flow: COP, arrow: false },
        { med: 'lube', w: W_S, pts: [[1090, AY], 'qa.s'], flow: 'm:COP-A', arrow: false },
        { med: 'lube', w: W_S, pts: [[1090, BY], 'qb.s'], flow: 'm:COP-B', arrow: false },
        { med: 'lube', w: W_S, pts: ['qa.d', [QX - 3, AY - 60], [HX2, AY - 60]], flow: 'm:COP-A', arrow: false },
        {
          med: 'lube',
          w: W_S,
          pts: ['qb.d', [QX - 3, BY - 60], [QX - 62, BY - 60], [QX - 62, AY - 60], [QX - 3, AY - 60]] /* beta.305: up on the left of pump A, clear of its words */,
          flow: 'm:COP-B',
          arrow: false
        },
        { med: 'lube', w: W_S, pts: [[HX2, AY - 60], 'cf.l'], flow: COP },
        { med: 'lube', w: W_S, pts: ['cf.r', [HX2, CH]], flow: COP, arrow: false },
        { med: 'lube', w: W_S, pts: [[1250, CH], 'mts.l'], flow: COP, arrow: false },
        { med: 'lube', w: W_S, pts: ['mts.r', [1730, CH], [1730, 490]], to: 'trip oil', flow: COP },
        ...A.map(a => a.pipe)
      ],
      taps: [
        {
          x: TX - 375,
          y: BH,
          side: 't',
          label: 'Bearing 3' /* apk test 2026-11-22: 'Generator bearing 3' and '4' ran into each other at 11 px; they sit on the generator */,
          key: 'TEGE1007',
          unit: '°C',
          dp: 0,
          tag: 'TEGE1007'
        },
        {
          x: TX - 245,
          y: BH,
          side: 't',
          label: 'Bearing 4',
          key: 'TEGE1008',
          unit: '°C',
          dp: 0,
          tag: 'TEGE1008'
        },
        {
          x: RX,
          y: 300,
          side: 'r',
          label: 'Bearing oil header',
          key: 'PTLO10031',
          key2: 'PTLO10032',
          unit: K,
          dp: 1,
          tag: 'PTLO10031 / 32'
        },
        { x: RX, y: 360, side: 'r', label: 'Third transmitter', key: 'PTLO10033', unit: K, dp: 1, tag: 'PTLO10033' },
        { x: DX, y: 765, side: 'r', label: 'Cooler inlet', key: 'TELO1001', unit: '°C', dp: 0, tag: 'TELO1001' },
        {
          x: RX,
          y: 765,
          side: 'r',
          label: 'Cooler outlet',
          key: 'TE-LO1002-1',
          key2: 'TE-LO1002-2',
          unit: '°C',
          dp: 0,
          tag: 'TE-LO1002-1 / -2'
        },
        {
          x: 1325,
          y: CH,
          side: 'b',
          label: 'Control oil header',
          key: 'PTLO10061',
          key2: 'PTLO10062',
          unit: K,
          dp: 1,
          tag: 'PTLO10061 / 62'
        },
        { x: 1475, y: CH, side: 'b', label: 'Third transmitter', key: 'PTLO10063', unit: K, dp: 1, tag: 'PTLO10063' },
        {
          x: 1730,
          y: 390,
          side: 'l',
          label: 'Trip oil',
          key: 'PTLO10071',
          key2: 'PTLO10072',
          unit: K,
          dp: 1,
          tag: 'PTLO10071 / 72'
        },
        { x: 1730, y: 440, side: 'l', label: 'Third transmitter', key: 'PTLO10073', unit: K, dp: 1, tag: 'PTLO10073' }
      ],
      texts: [
        { x: 700, y: 978, s: 'control oil from the main oil tank', cls: 'hx-note' },
        { x: 1022, y: 440, s: 'straight to the bearing oil header', cls: 'hx-note' }
      ]
    },
    /* trend groups (Phase 9, 2026-11-27): every pen is a value or a controller already on this page (its source is in the
       comments above); at most 8 pens a group (Phase 10 trend recorder) */
    trends: [
      {
        title: 'Lube oil',
        pens: [
          ['Bearing oil header', 'PTLO10031', 'kg/cm²', 2],
          ['Lube oil pump A discharge', 'PTLO1922A', 'kg/cm²', 2],
          ['Cooler inlet', 'TELO1001', '°C'],
          ['Cooler outlet', 'TE-LO1002-1', '°C'],
          ['Oil temperature set point', 'sv:TICLO1002', '°C'],
          ['Oil temperature valve', 'mv:TICLO1002', '%']
        ]
      },
      {
        title: 'Control and trip oil',
        pens: [
          ['Control oil header', 'PTLO10061', 'kg/cm²'],
          ['Trip oil', 'PTLO10071', 'kg/cm²'],
          ['Control oil pump A discharge', 'PTLO1931A', 'kg/cm²'],
          ['Control oil pump B discharge', 'PTLO1931B', 'kg/cm²'],
          ['Speed', 'SI-TB', 'rpm', 0]
        ]
      }
    ]
  });
})();
