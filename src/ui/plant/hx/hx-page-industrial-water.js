/* HX page in the REALISTIC look: industrial water, fire water tank and waste water pumps (lane 7, user 2026-11-25 "Kumpletuhin ang
   HMI, nsa docs lahat ng system ... maliban sa wtp at coal handling at air compressors").
   THE PICTURE: the two industrial and fire water tanks on the left, joined by the connecting motor valve; the two industrial water
   pumps from tank A to the common header and its users; the fire fighting pumps on tank B; on the right the waste water sump with
   its two pumps and the transformer area pit.
   THE CONNECTIONS:
   - K1AU3-PD-025 Rev D (industrial water system): tanks T-0714A / B, level LT-IW0714-A / -B and LS-IW0714-A / -B on the drawing;
     the I/O list names them LT-IW0714 "industrial water tank level" (tank A), LT-IW0724 "fire water tank level" (tank B, the tank
     of the fire fighting system, K1AU3-M0-159) and LS-IW0714 "industrial water tank level switch low"; connecting motor valve
     MV-IW0391 (line IW-0-072, DITL-87: ZSO / ZSC / ZT-IW0391); pumps P-0715A / B with strainers STR-IW0001 / 0002 (DPT-IW0715-A /
     -B), common header PT-IW0715 (DITL-111); users of the header (turbine building, boiler, ash, limestone, coal yard, sea water
     pump station) as one line.
   - Fire pumps P-0718 (diesel engine), P-0719 (motor), P-0720 (jockey): running states of the I/O list (DITL-87 reads P-0718 /
     0719); the fire fighting system itself is not in the DCS.
   - K1AU3-PD-040 Rev C (waste water collection): waste water sump T-0050 with pumps P-0058A / B (DITL-120) and level high high
     LSHH-P0058, to the waste water buffer basin; transformer area pit with its submerge pump P-1127 and level high high
     LSHH-P1127 (the I/O list has one pit, the drawing two pits per unit).
   Left out: the filter, backwash and utility water pumps and the potable / plumbing water (water treatment, user exclusion);
   hand valves, level gauges. Every state is a digital input of the I/O list (data-di): '-----' until a link gives it a value. */
(function () {
  const { V, E, L, M, X, page } = HX;
  const B = HX.B;
  const K = 'kg/cm²';
  const at = (it, x, y, o) => Object.assign(it, { x, y }, o || {});
  const di = (tag, on, off) => 'data-di="' + tag + '|' + on + '|' + off + '"';
  const run = tag => HX.hk('iw-' + tag, di(tag, 'RUNNING', 'STOPPED'));
  const W_M = 6,
    W_S = 4;
  /* places (the drawing is 1760 x 1000) */
  const TX = 210,
    TAY = 250,
    TBY = 690 /* the two tanks */,
    SX = 520 /* pump suction header */,
    PX = 660,
    PY = [250, 450] /* industrial water pumps */,
    HX_ = 870 /* their common header */,
    FX = [520, 720, 920],
    FY = 860 /* fire pumps */,
    WX = 1450,
    WY = 570 /* waste water sump */,
    WPY = 412 /* its pumps */,
    PTX = 1330,
    PTY = 880; /* transformer area pit */
  const IW = 'm:P-0715A|m:P-0715B',
    FR = ['iw-MIR-P0718', 'iw-MIR-P0719', 'iw-MIR-P0720'],
    FIRE = FR.map(k => 'h:' + k).join('|');
  const pump = (n, i) =>
    at(
      /* beta.557: the machine of the registry (EIMI hx-sys-mu IWA / IWB, DITL-111 and #B): a click opens its two faceplates */
      M('pump', 'P-0715' + n, 'Industrial water pump ' + n, [V('Strainer', 'DPT-IW0715-' + n, K, 2)], {
        wrap: 14,
        /* the remote / local point of the I/O list (MIL-P0715x) on its monitor faceplate */
        mon: [V('Remote', 'MIL-P0715' + n, '', 0, { words: ['REMOTE', 'LOCAL'] })]
      }),
      PX,
      PY[i],
      { id: 'p' + i, lab: 'b' }
    );
  const fire = (tag, name, i) =>
    at(E('pump', name, tag, [], { on: run('MIR-' + tag.replace('-', '')), wrap: 12 }), FX[i], FY, {
      id: 'f' + i,
      lab: 'b'
    });

  page({
    id: 'industrial-water',
    group: 'Cooling and utilities',
    title: 'Industrial and waste water',
    about:
      'The industrial and fire water tanks, the industrial water pumps and their header, the fire pumps, the waste water sump pumps and the transformer area pit. Connections: flow diagrams K1AU3-PD-025 Rev D and K1AU3-PD-040 Rev C; logic DITL-87, 111, 120.',
    plan: {
      look: 'real',
      w: 1760,
      h: 1000,
      items: [
        /* strainers on the pump suctions (PD-025 C-4/5, D-4/5, YUA P&ID read 2026-11-27): V-IW0007 / 8 -> STR-IW0001 / 2 ->
           EJ-IW000x -> P-0715A / B; their dp is the Strainer row of each pump */
        ...['A', 'B'].map((n, i) => at(E('orifice', '', 'RO-IW0715' + n, []), 800, PY[i] - 82, { id: 'ri' + i, rot: 90, lab: 'r' })),
        ...['A', 'B'].map((n, i) => at(E('strainer', '', 'STR-IW000' + (i + 1), [], { flow: 'm:P-0715' + n }), 578, PY[i], { id: 'si' + i, sc: 0.8, lab: 't' })),
        /* T-0114 potable water tank of the turbine building, 5 m3 (PD-026 C/D-6): RO water tank (PD-045 G-2) PW-0-001 ->
           SV-PW0114 -> T-0114 -> V-PW0001 -> PW-0-004 to the rooms and eye washers. No signal in the I/O list: no value. */
        at(E('tank', 'Potable water tank', 'T-0114', [], { id: 'pw', liquid: 'none', w: 50, h: 60 }), 1250, 190, { id: 'pw', lab: 't' }),
        /* tanks */
        at(
          E('tank', 'Industrial and fire water tank A', 'T-0714A', [V('Level', 'LT-IW0714', 'm', 2)], {
            id: 'ta',
            wrap: 16
          }),
          TX,
          TAY,
          { id: 'ta', sc: 2, lab: 't' }
        ),
        at(B('Level low', di('LS-IW0714', 'LOW', 'NORMAL'), { w: 120 }), TX, TAY + 128, { id: 'tal' }),
        at(
          E('tank', 'Industrial and fire water tank B', 'T-0714B', [V('Level', 'LT-IW0724', 'm', 2)], {
            id: 'tb',
            wrap: 16
          }),
          TX,
          TBY,
          { id: 'tb', sc: 2, lab: 't' }
        ),
        at(B('Fire water level low', di('LS-IW0724', 'LOW', 'NORMAL'), { w: 160 }), TX, TBY + 128, { id: 'tbl' }),
        /* the connecting motor valve between the tanks */
        at(
          /* beta.557: the motor valve of the registry (hx-sys-mu IWV, DITL-87): its faceplate opens / closes it */
          X('MV-IW0391', 'Tank connecting valve', { vals: [V('Position', 'ZT-IW0391', '%', 0)], wrap: 12 }),
          360,
          470,
          { id: 'mv', rot: 90, lab: 'r' }
        ),
        /* industrial water pumps */
        pump('A', 0),
        pump('B', 1),
        ...['A', 'B'].map((n, i) =>
          at(B('Electric trouble', di('MIT-P0715' + n, 'TROUBLE', 'NORMAL'), { w: 130 }), PX + 135, PY[i] + 6, { id: 'pt' + i })
        ),
        /* fire pumps on tank B */
        fire('P-0718', 'Fire pump, diesel engine', 0),
        fire('P-0719', 'Fire pump, motor', 1),
        fire('P-0720', 'Jockey pump', 2),
        /* waste water sump and pumps */
        at(E('tank', 'Waste water sump', 'T-0050', [], { id: 'ws', w: 150, h: 70 }), WX, WY, {
          id: 'ws',
          sc: 1.5,
          lab: 'b'
        }),
        at(B('Sump level high high', di('LSHH-P0058', 'HIGH HIGH', 'NORMAL'), { w: 180 }), WX + 210, WY, { id: 'wsh' }),
        ...['A', 'B'].map((n, i) =>
          at(
            /* beta.557: hx-sys-mu WWA / WWB (DITL-120 and #B); no START / STOP on the sheet, the faceplate shows the state only */
            M('vpump', 'P-0058' + n, 'Waste water pump ' + n, [], { wrap: 12 }),
            WX - 70 + 140 * i,
            WPY,
            {
              id: 'w' + i,
              lab: 'b'
            }
          )
        ),
        ...['A', 'B'].map((n, i) =>
          at(
            B('Electric trouble', di('MIT-P0058' + n, 'TROUBLE', 'NORMAL'), { w: 130 }),
            i ? WX + 210 : WX - 210,
            WPY,
            { id: 'wt' + i }
          )
        ),
        /* transformer area pit */
        at(E('tank', 'Transformer area pit', 'T-1127', [], { id: 'tp', w: 100, h: 70 }), PTX, PTY, {
          id: 'tp',
          sc: 1.3,
          lab: 'l'
        }),
        at(E('vpump', 'Pit submerge pump', 'P-1127', [], { on: run('MIR-P1127'), wrap: 12 }), PTX + 200, PTY - 50, {
          id: 'tpp',
          lab: 'b'
        }),
        at(B('Pit level high high', di('LSHH-P1127', 'HIGH HIGH', 'NORMAL'), { w: 170 }), PTX, PTY + 80, { id: 'tph' }),
        at(B('Electric trouble', di('MIT-P1127', 'TROUBLE', 'NORMAL'), { w: 140 }), PTX + 340, PTY - 50, { id: 'tpt' }),
        at(L('makeup-cooling', 'Make-up and cooling water'), 1600, 60, { id: 'mul' }),
        at(L('sea-water', 'Sea water'), 1600, 100, { id: 'swl' })
      ],
      pipes: [
        { med: 'water', w: 3, pts: [[1118, 210], 'pw.l'], arrow: false },
        { med: 'water', w: 3, pts: ['pw.r', [1400, 210]], to: 'rooms and eye washers' },
        /* tank A to the pump suction header, the pumps into the common header, the header to its users */
        { med: 'water', w: W_M, pts: ['ta.r', [SX, TAY + 66]], flow: IW, arrow: false },
        {
          med: 'water',
          w: W_M,
          pts: [
            [SX, PY[0]],
            [SX, PY[1]]
          ],
          flow: IW,
          arrow: false
        },
        ...['A', 'B'].flatMap((n, i) => [
          { med: 'water', w: W_M, pts: [[SX, PY[i]], 'si' + i + '.l'], flow: 'm:P-0715' + n, arrow: false },
          { med: 'water', w: W_M, pts: ['si' + i + '.r', 'p' + i + '.s'], flow: 'm:P-0715' + n, arrow: false },
          {
            med: 'water',
            w: W_M,
            pts: ['p' + i + '.d', [PX - 2, PY[i] - 60], [HX_, PY[i] - 60]],
            flow: 'm:P-0715' + n,
            arrow: false
          },
          /* minimum flow line IW-0-014 / 013 with its orifice RO-IW0715A / B (tag not printed), check V-IW0013 / 15 and
             V-IW0014 / 16, back to T-0714A over IW-0-015 (PD-025 A/B-5/6, YUA P&ID read 2026-11-27); drawn as a short branch */
          { med: 'water', w: 3, pts: [[800, PY[i] - 60], 'ri' + i + '.r'], flow: 'm:P-0715' + n, arrow: false },
          { med: 'water', w: 3, pts: ['ri' + i + '.l', [800, PY[i] - 104]], to: 'to tank A', flow: 'm:P-0715' + n }
        ]),
        {
          med: 'water',
          w: W_M,
          pts: [
            [HX_, PY[0] - 60],
            [HX_, PY[1] - 60]
          ],
          flow: IW,
          arrow: false
        },
        {
          med: 'water',
          w: W_M,
          pts: [
            [HX_, 300],
            [1080, 300]
          ],
          flow: IW,
          to: 'plant users'
        },
        /* tank A to tank B through the connecting valve */
        { med: 'water', w: W_S, pts: [[360, TAY + 66], 'mv.l'], flow: 'x:MV-IW0391', arrow: false },
        { med: 'water', w: W_S, pts: ['mv.r', [360, TBY + 66], 'tb.r'], flow: 'x:MV-IW0391' },
        /* tank B to the fire pumps (suction header under them), their discharge header to the fire fighting system */
        {
          med: 'water',
          w: W_M,
          pts: ['tb.l', [100, TBY + 66], [100, 970], [FX[2] - 60, 970]],
          flow: FIRE,
          arrow: false
        },
        ...[0, 1, 2].map(i => ({
          med: 'water',
          w: W_S,
          pts: [[FX[i] - 60, 970], [FX[i] - 60, FY], 'f' + i + '.s'],
          flow: 'h:' + FR[i],
          arrow: false
        })),
        ...[0, 1, 2].map(i => ({
          med: 'water',
          w: W_S,
          pts: ['f' + i + '.d', [FX[i] - 2, 790]],
          flow: 'h:' + FR[i],
          arrow: false
        })),
        {
          med: 'water',
          w: W_M,
          pts: [
            [FX[0] - 2, 790],
            [1100, 790]
          ],
          to: 'fire fighting system',
          flow: FIRE
        },
        /* waste water: sump pumps (suction legs in the sump) to the buffer basin, pit pump to the ditch */
        ...[0, 1].map(i => ({
          med: 'drain',
          w: W_S,
          pts: [[WX - 92 + 140 * i, WY + 10], 'w' + i + '.s'],
          flow: 'm:P-0058' + 'AB'[i],
          arrow: false
        })),
        ...[0, 1].map(i => ({
          med: 'drain',
          w: W_S,
          pts: ['w' + i + '.d', [WX - 30 + 140 * i, WPY - 11], [WX - 30 + 140 * i, 360]],
          flow: 'm:P-0058' + 'AB'[i],
          arrow: false
        })),
        {
          med: 'drain',
          w: W_S,
          pts: [
            [WX - 30, 360],
            [1680, 360]
          ],
          to: 'buffer basin',
          flow: 'm:P-0058A|m:P-0058B'
        },
        {
          med: 'drain',
          w: W_S,
          pts: [[PTX + 30, PTY + 10], [PTX + 30, PTY - 38], 'tpp.s'],
          flow: 'h:iw-MIR-P1127',
          arrow: false
        },
        {
          med: 'drain',
          w: W_S,
          pts: ['tpp.d', [PTX + 222, PTY - 110], [1680, PTY - 110]],
          to: 'ditch',
          flow: 'h:iw-MIR-P1127'
        }
      ],
      taps: [
        { x: HX_, y: 240, side: 'r', label: 'Header pressure', key: 'PT-IW0715', unit: K, dp: 2, tag: 'PT-IW0715' }
      ],
      texts: [
        { x: 1110, y: 214, s: 'from the RO water tank', anchor: 'end' },
        { x: WX, y: WY + 120, s: 'In: turbine and boiler house drains' },
        { x: 760, y: 760, s: 'Fire pumps: running states only (fire fighting system K1AU3-M0-159)' },
        { x: 1180, y: 330, s: 'Turbine building, boiler, ash, limestone, coal yard, sea water pumps' }
      ]
    }
  });
})();
