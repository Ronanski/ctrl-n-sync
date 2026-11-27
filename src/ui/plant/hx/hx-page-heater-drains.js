/* HX page in the REALISTIC look: heater drains (lane 7, HMI TURBINE : MINAMI, 2026-11-25; lane plan: every equipment of the
   documents on a page, bound by its address).
   THE PICTURE: the five closed feedwater heaters as a cascade, each one cut open. Top row the high pressure side: No. 2 high
   pressure heater H-1106, No. 1 high pressure heater H-1105, the deaerator. Bottom row the low pressure side: No. 3 low
   pressure heater H-1103, No. 2 H-1102, No. 1 H-1101, the condenser. Under every heater its drain line with the two level
   control valves of the drawing: the PRIMARY valve passes the drain on to the next heater, the ALTERNATE valve dumps it.
   THE CONNECTIONS, read from K1AU3-PD-018 Rev D (heater vent and drain system, 2014-08-07):
   - H-1106: LCV-HD1106-1 (fail open) to H-1105 (line HD-1-002); LCV-HD1106-2 to the condenser (HD-1-004, PD-027 F-1);
     LT-HD1106-1 / -2, LS-HD1106 (LAHH), FT-HD1106 and TT-HD1106 on the drain outlet HD-1-001.
   - H-1105: LCV-HD1105-1 to the deaerator storage tank (HD-1-011 / 012); LCV-HD1105-2 to the condenser (HD-1-014, PD-027 F-1);
     LT-HD1105-1 / -2, LS-HD1105, FT-HD1105, TT-HD1105.
   - H-1103: LCV-HD1103-1 to H-1102 (HD-1-022); LCV-HD1103-2 to the flash chamber (HD-1-024, PD-027 F-3); LT-HD1103-1 / -2,
     LS-HD1103, FT-HD1103, TT-HD1103 on the drain outlet HD-1-021.
   - H-1102: LCV-HD1102-1 to H-1101 (HD-1-032); LCV-HD1102-2 to the flash chamber (HD-1-034, PD-027 F-3); LT-HD1102-1 / -2,
     LS-HD1102, FT-HD1102, TT-HD1102.
   - H-1101: LCV-HD1101-1 to the condenser (HD-1-042, PD-027 G-1); LCV-HD1101-2 to the flash chamber (HD-1-044, PD-027 F-3);
     LT-HD1101-1 / -2, LS-HD1101, PT-HD1101 on the shell (the steam seal leak-off of PD-014 enters this heater).
   THE LOGIC: the ten level controllers of the analog drawing: ABC-035 LICHD11051 / 11052, ABC-036 LICHD11061 / 11062,
   ABC-037 LICHD11011 / 11012, ABC-038 LICHD11021 / 11022, ABC-039 LICHD11031 / 11032 (controller = valve, -1 primary,
   -2 alternate). The level high high switches LS-HD1101 ~ 1106 are read by DITL-41 (annunciator input / output 2,
   "NO.1 LPH LEVEL H.H." ...). FT / TT / PT-HD1101 ~ 1106 are I/O list points (station 2) that no sheet reads: they show
   '-----' until their link lands (lane 4, DCS LINKS BOP),
   except the four the plant model already computes (unit.js: FT / TT-HD1105 / 1106 = hpF1 / hpF2 / hpD1 / hpD2).
   Drawn simpler than the sheet: hand isolation valves, tell-tales, vents to the condenser, local gauges and the heater
   drains to the floor are not drawn. The primary drain of H-1105 and H-1106 is also drawn on the Feedwater page (same
   controllers, same addresses). */
(function () {
  const { E, C, L, page } = HX;
  const K = 'kg/cm²';
  const at = (it, x, y, o) => Object.assign(it, { x, y }, o || {});
  const W_DR = 4;
  /* places (the drawing is 1760 x 1000) */
  const HS = 1.7 /* heater scale */,
    DRO = -34.7 * HS /* drain port of a heater, from its centre (hx-real.js R.heater: a + w * 0.22) */,
    LEO = -62 * HS /* left end of a heater shell */,
    HPY = 210 /* high pressure row: heater centre */,
    LPY = 610 /* low pressure row */,
    HDR = 112 /* drain header this far under a heater centre */,
    ALT = 200 /* alternate valve this far under */,
    END = 262 /* end of the alternate line */,
    XS = [330, 850, 1370] /* heater columns */,
    PV = 250 /* primary valve this far right of a heater centre */,
    TEE = 60 /* the alternate branch leaves the header here (right of the heater centre) */,
    DAX = 1440,
    DAY = 170,
    DAS = 1.2 /* deaerator */;
  const HP = 'm:BFWP-A|m:BFWP-B',
    LP = 'm:CEP-A|m:CEP-B';
  /* one heater with its two drain valves. n = id, x / y = centre, name / tag, loop1 / loop2 = primary / alternate controller,
     tag1 / tag2 = their valves, alt = where the alternate goes, water = the rule of the water in the tubes */
  const heater = h => {
    const { n, x, y } = h;
    return {
      items: [
        at(E('heater', h.name, h.tag, [], { id: n, flow: h.water, wrap: 14 }), x, y, { id: n, sc: HS, lab: 't' }),
        at(C(h.loop1, 'Primary drain valve', { tag: h.tag1, wrap: 12, cname: h.name + ' primary drain valve' }), x + PV, y + HDR, {
          id: n + 'p',
          lab: 'b'
        }),
        at(C(h.loop2, 'Alternate drain valve', { tag: h.tag2, wrap: 12, cname: h.name + ' alternate drain valve' }), x + TEE, y + ALT, {
          id: n + 'a',
          rot: 90,
          lab: 'r'
        }),
        at(HX.B('Level high high', 'data-di="' + h.ls + '|HIGH HIGH|NORMAL"', { w: 132 }), x + 190, y - 52, { id: n + 'hh' })
      ],
      pipes: [
        /* drain out of the heater, down to the header */
        { med: 'drain', w: W_DR, pts: [n + '.dr', [x + DRO, y + HDR], [x + TEE, y + HDR]], flow: 'l:' + h.loop1 + '|l:' + h.loop2, arrow: false },
        { med: 'drain', w: W_DR, pts: [[x + TEE, y + HDR], n + 'p.l'], flow: 'l:' + h.loop1, arrow: false },
        /* the alternate branch */
        { med: 'drain', w: W_DR, pts: [[x + TEE, y + HDR], n + 'a.l'], flow: 'l:' + h.loop2, arrow: false },
        { med: 'drain', w: W_DR, pts: [n + 'a.r', [x + TEE, y + END]], to: h.alt, flow: 'l:' + h.loop2 }
      ],
      texts: [
        { x: x + 128, y: y - 6, s: 'Level 1', key: h.lt + '-1', unit: 'mm', dp: 0 },
        { x: x + 128, y: y + 10, s: 'Level 2', key: h.lt + '-2', unit: 'mm', dp: 0 }
      ]
    };
  };
  /* the primary drain on to the next heater: from the valve right, up to the row of the next heater, into its left end */
  const onTo = (from, x, y, nx, loop) => ({
    med: 'drain',
    w: W_DR,
    pts: [from + 'p.r', [x + PV + 90, y + HDR], [x + PV + 90, y], [nx + LEO, y]],
    flow: 'l:' + loop
  });
  const H6 = heater({ n: 'h6', x: XS[0], y: HPY, name: 'High pressure heater 2', tag: 'H-1106', loop1: 'LICHD11061', tag1: 'LCV-HD1106-1', loop2: 'LICHD11062', tag2: 'LCV-HD1106-2', ls: 'LS-HD1106', lt: 'LT-HD1106', alt: 'to condenser', water: HP }),
    H5 = heater({ n: 'h5', x: XS[1], y: HPY, name: 'High pressure heater 1', tag: 'H-1105', loop1: 'LICHD11051', tag1: 'LCV-HD1105-1', loop2: 'LICHD11052', tag2: 'LCV-HD1105-2', ls: 'LS-HD1105', lt: 'LT-HD1105', alt: 'to condenser', water: HP }),
    H3 = heater({ n: 'h3', x: XS[0], y: LPY, name: 'Low pressure heater 3', tag: 'H-1103', loop1: 'LICHD11031', tag1: 'LCV-HD1103-1', loop2: 'LICHD11032', tag2: 'LCV-HD1103-2', ls: 'LS-HD1103', lt: 'LT-HD1103', alt: 'to flash chamber', water: LP }),
    H2 = heater({ n: 'h2', x: XS[1], y: LPY, name: 'Low pressure heater 2', tag: 'H-1102', loop1: 'LICHD11021', tag1: 'LCV-HD1102-1', loop2: 'LICHD11022', tag2: 'LCV-HD1102-2', ls: 'LS-HD1102', lt: 'LT-HD1102', alt: 'to flash chamber', water: LP }),
    H1 = heater({ n: 'h1', x: XS[2], y: LPY, name: 'Low pressure heater 1', tag: 'H-1101', loop1: 'LICHD11011', tag1: 'LCV-HD1101-1', loop2: 'LICHD11012', tag2: 'LCV-HD1101-2', ls: 'LS-HD1101', lt: 'LT-HD1101', alt: 'to flash chamber', water: LP });
  /* drain outlet flow and temperature (PD-018: FT / TT on the drain outlet line of H-1102, 1103, 1105, 1106) */
  /* key = the plant model value that stands for the I/O point when the model has one (unit.js anHphStep: hpF2 = FT-HD1106,
     hpF1 = FT-HD1105, hpD2 = TT-HD1106, hpD1 = TT-HD1105); else the I/O tag itself, '-----' until a link gives it a value */
  const out = (x, y, ft, tt, fk, tk) => [
    { x: x + DRO, y: y + 64, side: 'l', label: 'Drain flow', key: fk || ft, unit: 't/h', tag: ft },
    { x: x + DRO + 50, y: y + HDR, side: 'b', label: 'Temperature', key: tk || tt, unit: '°C', dp: 0, tag: tt }
  ];

  page({
    id: 'heater-drains',
    group: 'Water and steam',
    title: 'Heater drains',
    about:
      'The drain cascade of the five feedwater heaters: primary and alternate level control valves, levels and level high high. Connections: flow diagram K1AU3-PD-018 Rev D; controllers ABC-035 ~ 039.',
    plan: {
      look: 'real',
      w: 1760,
      h: 1000,
      items: [
        ...H6.items,
        ...H5.items,
        at(E('deaerator', '', '', [], { id: 'dea' }), DAX, DAY, { id: 'da', under: true, sc: DAS }),
        ...H3.items,
        ...H2.items,
        ...H1.items,
        at(L('feedwater', 'Feedwater'), 1640, 60, { id: 'fwl' }),
        at(L('condensate', 'Condensate'), 1640, 470, { id: 'cdl' }),
        at(L('extraction', 'Extraction steam'), 1440, 470, { id: 'exl' })
      ],
      pipes: [
        ...H6.pipes,
        onTo('h6', XS[0], HPY, XS[1], 'LICHD11061'),
        ...H5.pipes,
        /* No. 1 high pressure heater primary drain to the deaerator storage tank */
        {
          med: 'drain',
          w: W_DR,
          pts: ['h5p.r', [XS[1] + PV + 90, HPY + HDR], [XS[1] + PV + 90, DAY + 23 * DAS], [DAX - 88 * DAS, DAY + 23 * DAS]],
          flow: 'l:LICHD11051'
        },
        ...H3.pipes,
        onTo('h3', XS[0], LPY, XS[1], 'LICHD11031'),
        ...H2.pipes,
        onTo('h2', XS[1], LPY, XS[2], 'LICHD11021'),
        ...H1.pipes,
        /* No. 1 low pressure heater primary drain to the condenser */
        { med: 'drain', w: W_DR, pts: ['h1p.r', [1700, LPY + HDR], [1700, LPY + END]], to: 'to condenser', flow: 'l:LICHD11011' }
      ],
      taps: [
        ...out(XS[0], HPY, 'FT-HD1106', 'TT-HD1106', 'an:hpF2', 'an:hpD2'),
        ...out(XS[1], HPY, 'FT-HD1105', 'TT-HD1105', 'an:hpF1', 'an:hpD1'),
        ...out(XS[0], LPY, 'FT-HD1103', 'TT-HD1103'),
        ...out(XS[1], LPY, 'FT-HD1102', 'TT-HD1102')
      ],
      texts: [
        ...H6.texts,
        ...H5.texts,
        ...H3.texts,
        ...H2.texts,
        ...H1.texts,
        { x: XS[2] + 128, y: LPY + 26, s: 'Shell pressure', key: 'PT-HD1101', unit: K + ' abs', dp: 3 },
        { x: DAX, y: DAY + 74 * DAS - 18, s: 'Deaerator', cls: 'hx-name', anchor: 'middle' },
        { x: 880, y: 975, s: 'Primary valve: on to the next heater. Alternate valve: dump on high level.', cls: 'hx-note', anchor: 'middle' }
      ]
    },
    /* trend groups (Phase 9, 2026-11-27): every pen is a value or a controller already on this page (its source is in the
       comments above); at most 8 pens a group (Phase 10 trend recorder) */
    trends: [
      {
        title: 'High pressure heater levels',
        pens: [
          ['Heater 2 level', 'pv:LICHD11061', 'mm'],
          ['Heater 2 drain valve', 'mv:LICHD11061', '%'],
          ['Heater 1 level', 'pv:LICHD11051', 'mm'],
          ['Heater 1 drain valve', 'mv:LICHD11051', '%'],
          ['Heater 2 drain flow', 'an:hpF2', 't/h'],
          ['Heater 1 drain flow', 'an:hpF1', 't/h']
        ]
      },
      {
        title: 'Low pressure heater levels',
        pens: [
          ['Heater 3 level', 'pv:LICHD11031', 'mm'],
          ['Heater 3 drain valve', 'mv:LICHD11031', '%'],
          ['Heater 2 level', 'pv:LICHD11021', 'mm'],
          ['Heater 2 drain valve', 'mv:LICHD11021', '%'],
          ['Heater 1 level', 'pv:LICHD11011', 'mm'],
          ['Heater 1 drain valve', 'mv:LICHD11011', '%']
        ]
      }
    ]
  });
})();
