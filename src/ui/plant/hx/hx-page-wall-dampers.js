/* HX page in the REALISTIC look: the furnace wall air dampers (beta.556, HMI gap list 2026-11-25: FA1005 ~ FA1026 were on no page).
   THE PICTURE: the front and the rear water wall of the furnace seen from outside, each under its hot secondary air duct; from the duct
   the vertical ducts come down, each with an upper and a lower air port, a motor damper in front of every port.
   THE CONNECTIONS: K1AU3-PD-053 Rev A, secondary air system (Formosa Heavy Industries; RA flow diagrams, page 44):
     detail A  hot secondary air duct 2150 mm, branch 1750 mm to the front duct and 1600 mm to the rear duct; at the ends of the front duct
               burners A (left) and B (right), at the ends of the rear duct burners C (left) and D (right), 1100 mm each
     detail 1  front wall, 7 ducts of 24 inch from left to right: upper ports MCV-FA1005, 1007, 1009, 1011, 1013, 1015, 1017, after a
               reducer the lower ports MCV-FA1006, 1008, 1010, 1012, 1014, 1016, 1018 (12 inch)
     detail 2  rear wall, 4 ducts: upper MCV-FA1019, 1021, 1023, 1025, lower MCV-FA1020, 1022, 1024, 1026
     "typical wiring diagram for MCV": motor with its position transmitter ZT, closed limit ZSC and open limit ZSO
   THE CONTROL: HICFA1005 ~ HICFA1016 on ABC-015, HICFA1017 ~ HICFA1026 on ABC-016.
   THE MONITOR FACEPLATE of each damper (the square): the signals of the DCS I/O list of station 3: ZSO, ZSC, MIT (motor trip), MIL
   (remote), TS (torque switch). The limit switches come from the field rows of the plant model; a signal with no source in the app
   shows -----.
   Drawn simpler than the sheet: the two burner branches of a duct are one link at its end; the wall is stretched to the page width. */
(function () {
  const { V, E, C, L, page } = HX;
  const at = (it, x, y, o) => Object.assign(it, { x, y }, o || {});
  const X0 = 90,
    W = 1610,
    W_D = 10,
    W_B = 7;
  /* a wall: duct line y, wall top y, upper and lower port y, the ducts from left to right */
  const WALLS = [
    { id: 'f', name: 'Front wall', hy: 66, wy: 112, wh: 330, yu: 190, yl: 340, tags: 'FA1005 FA1006 FA1007 FA1008 FA1009 FA1010 FA1011 FA1012 FA1013 FA1014 FA1015 FA1016 FA1017 FA1018'.split(' '), xs: Array.from({ length: 7 }, (_, i) => 250 + i * 226) },
    { id: 'r', name: 'Rear wall', hy: 590, wy: 636, wh: 330, yu: 714, yl: 864, tags: 'FA1019 FA1020 FA1021 FA1022 FA1023 FA1024 FA1025 FA1026'.split(' '), xs: Array.from({ length: 4 }, (_, i) => 368 + i * 395) }
  ];
  const DX = 58,
    PX = 112; /* damper and port, left of the vertical duct */
  const items = [],
    pipes = [];
  for (const w of WALLS) {
    const holes = w.xs.flatMap(x => [
      [x - PX - X0, w.yu - w.wy],
      [x - PX - X0, w.yl - w.wy]
    ]);
    items.push(at(E('furnwall', '', '', [], { w: W, h: w.wh, holes }), X0, w.wy, { id: 'w' + w.id, under: true }));
    w.xs.forEach((x, i) => {
      const up = w.tags[2 * i],
        lo = w.tags[2 * i + 1];
      pipes.push({ med: 'hotair', w: W_D, pts: [[x, w.hy], [x, w.yu], 'd' + up + '.t'], flow: 'l:HIC' + up, arrow: false });
      pipes.push({ med: 'hotair', w: W_B, pts: [[x, w.yu], [x, w.yl], 'd' + lo + '.t'], flow: 'l:HIC' + lo, arrow: false });
      [up, lo].forEach((n, k) => {
        const y = k ? w.yl : w.yu,
          pl = k ? 'Lower' : 'Upper',
          t = 'HIC' + n;
        items.push(
          at(
            C(t, pl + ' port ' + (i + 1), {
              sym: 'louver',
              w: 40,
              blades: 2,
              tag: 'MCV-' + n,
              mvb: true,
              cname: w.name + ', ' + pl.toLowerCase() + ' air port ' + (i + 1),
              mon: [
                V('Position', 'ZT-' + n, '%', 1),
                V('Open limit', 'fld:ZSO-' + n, '', 0, { words: ['OPEN', 'NOT OPEN'] }),
                V('Closed limit', 'fld:ZSC-' + n, '', 0, { words: ['CLOSED', 'NOT CLOSED'] }),
                V('Motor trip', 'fld:MIT-' + n, '', 0, { words: ['TRIP', 'NORMAL'] }),
                V('Selector', 'fld:MIL-' + n, '', 0, { words: ['REMOTE', 'LOCAL'] }),
                V('Torque switch', 'fld:TS-' + n, '', 0, { words: ['HIGH', 'NORMAL'] })
              ]
            }),
            x - DX,
            y,
            { id: 'd' + n, rot: 90, lab: 'b' }
          )
        );
        pipes.push({ med: 'hotair', w: W_B, pts: ['d' + n + '.b', [x - PX, y]], flow: 'l:' + t });
      });
    });
  }

  page({
    id: 'wall-dampers',
    group: 'Boiler',
    title: 'Furnace wall air dampers',
    about:
      'Hot secondary air to the 22 air ports of the furnace: 14 in the front wall, 8 in the rear wall, a motor damper at each. Connections: flow diagram K1AU3-PD-053 Rev A.',
    plan: {
      look: 'real',
      w: 1760,
      h: 1000,
      items: items.concat([
        at(L('combustion-air', 'Hot secondary air from the air heater', { back: true }), 1300, 516, { id: 'sup' }),
        at(L('oil-burners', 'To burners A and B'), 1690, 66, { id: 'bab' }),
        at(L('oil-burners', 'To burners C and D'), 1690, 590, { id: 'bcd' })
      ]),
      pipes: pipes.concat([
        { med: 'hotair', w: 14, pts: ['sup.l', [50, 516]], flow: 'm:SAF', arrow: false },
        { med: 'hotair', w: 12, pts: [[50, 516], [50, 66], 'bab.l'], flow: 'm:SAF' },
        { med: 'hotair', w: 12, pts: [[50, 516], [50, 590], 'bcd.l'], flow: 'm:SAF' }
      ]),
      taps: [
        { x: 320, y: 516, side: 't', label: 'Pressure', key: 'PT-FA1088', unit: 'mmH₂O', dp: 0, tag: 'PT-FA1088' },
        { x: 620, y: 516, side: 't', label: 'Temperature', key: 'TT-FA1087', key2: 'TT-FA1086', unit: '°C', dp: 0, tag: 'TT-FA1087 / 1086' },
        { x: 920, y: 516, side: 't', label: 'Secondary air flow', key: 'pv:FICFA1081', unit: 't/h', tag: 'FT-FA1081' }
      ],
      texts: [
        { x: 100, y: 46, s: 'FRONT WALL, 14 AIR PORTS', cls: 'hx-zone' },
        { x: 100, y: 570, s: 'REAR WALL, 8 AIR PORTS', cls: 'hx-zone' }
      ]
    },
    /* trend groups (Phase 9, 2026-11-27): every pen is a value or a controller already on this page (its source is in the
       comments above); at most 8 pens a group (Phase 10 trend recorder) */
    trends: [
      {
        title: 'Secondary air to the wall ports',
        pens: [
          ['Secondary air flow', 'pv:FICFA1081', 't/h', 0],
          ['Header pressure', 'PT-FA1088', 'mmH₂O', 0],
          ['Header temperature', 'TT-FA1087', '°C', 0]
        ]
      },
      {
        title: 'Front wall ports 1 to 4',
        pens: [
          ['Upper port 1', 'mv:HICFA1005', '%'],
          ['Lower port 1', 'mv:HICFA1006', '%'],
          ['Upper port 2', 'mv:HICFA1007', '%'],
          ['Lower port 2', 'mv:HICFA1008', '%'],
          ['Upper port 3', 'mv:HICFA1009', '%'],
          ['Lower port 3', 'mv:HICFA1010', '%'],
          ['Upper port 4', 'mv:HICFA1011', '%'],
          ['Lower port 4', 'mv:HICFA1012', '%']
        ]
      },
      {
        title: 'Front wall ports 5 to 7',
        pens: [
          ['Upper port 5', 'mv:HICFA1013', '%'],
          ['Lower port 5', 'mv:HICFA1014', '%'],
          ['Upper port 6', 'mv:HICFA1015', '%'],
          ['Lower port 6', 'mv:HICFA1016', '%'],
          ['Upper port 7', 'mv:HICFA1017', '%'],
          ['Lower port 7', 'mv:HICFA1018', '%']
        ]
      },
      {
        title: 'Rear wall ports 1 to 4',
        pens: [
          ['Upper port 1', 'mv:HICFA1019', '%'],
          ['Lower port 1', 'mv:HICFA1020', '%'],
          ['Upper port 2', 'mv:HICFA1021', '%'],
          ['Lower port 2', 'mv:HICFA1022', '%'],
          ['Upper port 3', 'mv:HICFA1023', '%'],
          ['Lower port 3', 'mv:HICFA1024', '%'],
          ['Upper port 4', 'mv:HICFA1025', '%'],
          ['Lower port 4', 'mv:HICFA1026', '%']
        ]
      }
    ]
  });
})();
