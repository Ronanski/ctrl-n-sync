/* HX page (lane 6, EIMI): the fly ash transfer system with its own panel MCP-1250 (user 2026-11-24: "lahat ng system at equipment sa docs").
   THE PICTURE: the fourteen blow tanks under the hoppers of the air heater and of the precipitator, from left to right along the gas; the
   air header from the buffer tank below them; the seven conveying lines with their purge valves; on the right the fly ash silo with its
   vent filter and its dry unloader.
   SOURCES: Hwa Jann O&M (L5-1: 1.1 "7 ash conveying lines and 14 ash blow tanks", 2 tags, 4.2.1 cycle), Modbus list, node fly ash PLC
   (40001 ~ 40009 to the DCS, 40051 / 40052 from the DCS), I/O list (XA-FH1701 ~ 1704). The values are those of the panel model
   src/analog/engine/pkg.js. The two tanks of fields 3, 4 and 5 have one discharge valve, one air valve and one START each.
   Not drawn: the manual gate valve over each tank, the pneumatic boxes, the wet unloader (the O&M has one dry unloading system only). */
(function () {
  const { V, D, E, L, page } = HX;
  const at = (it, x, y, o) => Object.assign(it, { x, y }, o || {});
  const pad = b => String(b).padStart(2, '0');
  const PANEL = 'Fly ash panel MCP-1250';
  const fk = k => 'an:pkg.fa.' + k,
    tk = (id, k) => 'an:pkg.fa.t.' + id + '.' + k;
  const pm = (label, key) => V(label, key, '', 0);
  const no = (name, key) => {
    HX.CALC[name] = v => {
      const x = v(key);
      return x == null ? null : x ? 0 : 1;
    };
    return 'cal:' + name;
  };
  /* Modbus word.bit n bits after word.bit of the first point of a tank */
  const adr = (w, b, n) => w + ((b + n) >> 4) + '.' + pad((b + n) & 15);

  /* [id, vessels, name, vessel tags, word, bit, level switches, inlet valves, discharge valve, air valve, pressure, purge valves (tag, name, adr), START / STOP] */
  const T = [
    ['AHA', 'Air heater A', ['S-1255A'], 40001, 0, ['1710'], ['1717'], '1718', '1720', '1707', [['1721', '101', '40007.06']], '40051.00'],
    ['AHB', 'Air heater B', ['S-1255B'], 40001, 7, ['1711'], ['1719'], '1720', '1722', '1708', [['1723', '102', '40007.07']], '40051.02'],
    ['AHC', 'Air heater C', ['S-1255C'], 40001, 14, ['1712'], ['1721'], '1722', '1724', '1709', [['1725', '103', '40007.08']], '40051.04'],
    ['AHD', 'Air heater D', ['S-1255D'], 40002, 5, ['1713'], ['1723'], '1724', '1726', '1710', [['1727', '104', '40007.09']], '40051.06'],
    ['EP1A', 'Field 1A', ['S-1250A'], 40002, 12, ['1700'], ['1700'], '1701', '1700', '1700', [['1701', '201', '40007.11']], '40051.08'],
    ['EP1B', 'Field 1B', ['S-1250B'], 40003, 3, ['1701'], ['1702'], '1703', '1703', '1701', [['1704', '301', '40007.13']], '40051.10'],
    ['EP2A', 'Field 2A', ['S-1251A'], 40003, 10, ['1702'], ['1704'], '1705', '1706', '1702', [['1707', '401', '40007.15']], '40051.12'],
    ['EP2B', 'Field 2B', ['S-1251B'], 40004, 1, ['1703'], ['1706'], '1707', '1709', '1703', [['1710', '501', '40008.01']], '40051.14'],
    ['EP3', 'Field 3', ['S-1252A', 'S-1252B'], 40004, 8, ['1704', '1705'], ['1708', '1709'], '1710', '1712', '1704', [['1713', '601', '40008.03']], '40052.00'],
    ['EP4', 'Field 4', ['S-1253A', 'S-1253B'], 40005, 1, ['1706', '1707'], ['1711', '1712'], '1713', '1715', '1705', [['1716', '701', '40008.05']], '40052.02'],
    ['EP5', 'Field 5', ['S-1254A', 'S-1254B'], 40005, 10, ['1708', '1709'], ['1714', '1715'], '1716', '1717', '1706', [['1718', '702', '40008.06']], '40052.04']
  ];
  /* the line of each tank and the purge valve at its far end */
  const LINE = { AHA: 1, AHB: 1, AHC: 1, AHD: 1, EP1A: 2, EP1B: 3, EP2A: 4, EP2B: 5, EP3: 6, EP4: 7, EP5: 7 };
  const END = {
    1: ['1728', '105', '40007.10'],
    2: ['1702', '202', '40007.12'],
    3: ['1705', '302', '40007.14'],
    4: ['1708', '402', '40008.00'],
    5: ['1711', '502', '40008.02'],
    6: ['1714', '602', '40008.04'],
    7: ['1719', '703', '40008.07']
  };
  const X0 = 158,
    DX = 92,
    TY = 196,
    HY = 318 /* air header */,
    VY = 404 /* discharge valves */;
  /* conveying line n: line 1, from the far left, lies lowest, so no line crosses another */
  const LY = n => 470 + 38 * (7 - n);
  const items = [],
    pipes = [],
    texts = [];
  const lineFlow = n =>
    Object.keys(LINE)
      .filter(k => LINE[k] === n)
      .map(k => 'v:' + tk(k, 'sv.1') + '>0')
      .join('|');
  /* a valve of the panel: its point stands in the second faceplate of its tank (or silo) */
  const valve = (name, key, cname) => E('valve', name, '', [], { on: 'v:' + key + '>0', cname: cname || name });
  let k = 0;
  const first = {};
  for (const [id, name, vs, w, b, ls, inl, dis, air, pt, purge, cmd] of T) {
    const two = vs.length > 1,
      n = LINE[id],
      xs = vs.map(() => X0 + DX * k++),
      xm = xs.reduce((a, x) => a + x, 0) / xs.length,
      xd = two ? xm : xs[0];
    /* points of the tank in the order of the list: level switches, filling time-out, inlet valves, discharge, air, two fails */
    let p = 0;
    const lsA = ls.map(() => adr(w, b, p++)),
      fto = adr(w, b, p++),
      inA = inl.map(() => adr(w, b, p++)),
      diA = adr(w, b, p++),
      aiA = adr(w, b, p++),
      pfA = adr(w, b, p++),
      tfA = adr(w, b, p++);
    HX.PKG['fa.' + id] = {
      n: name + ' blow tank' + (two ? 's' : ''),
      t: vs.join(' / '),
      d: PANEL,
      st: tk(id, 'on'),
      lamps: ['START', 'STOP'],
      flt: 'cal:faF' + id,
      fltWord: 'FAIL',
      free: true,
      cmds: [
        ['START', 'start'],
        ['STOP', 'stop']
      ],
      why: 'STOP lets the running cycle end and sends the batch that is in the tank.'
    };
    HX.CALC['faF' + id] = v => {
      const a = [v(tk(id, 'pf')), v(tk(id, 'tf'))];
      return a.includes(null) ? null : a[0] || a[1] ? 1 : 0;
    };
    /* step of the cycle, for the operator */
    HX.CALC['faP' + id] = v => v(tk(id, 'p'));
    const perm = [
      pm('Selector of the panel remote', fk('rem')),
      pm('System ready', fk('ready')),
      pm('No pressurized fail', no('faNP' + id, tk(id, 'pf'))),
      pm('No transported fail', no('faNT' + id, tk(id, 'tf')))
    ];
    const mon = [
      D('Started', cmd, tk(id, 'on'), 'START', 'STOP'),
      V('Pressure', tk(id, 'p'), 'bar', 2, { tag: 'PT-FH' + pt }),
      V('Ash in the tank' + (two ? 's' : ''), tk(id, 'm'), 'kg', 0, { tag: 'plant model' }),
      ...ls.map((x, i) => D('Level switch high' + (two ? ' ' + 'AB'[i] : ''), lsA[i] + ' LSH-FH' + x, tk(id, 'lsh'), 'HIGH', 'NORMAL')),
      ...inl.map((x, i) => D('Inlet valve' + (two ? ' ' + 'AB'[i] : ''), inA[i] + ' SV-FH' + x, tk(id, 'sv.0'), 'OPEN', 'CLOSED')),
      D('Discharge valve', diA + ' SV-FH' + dis, tk(id, 'sv.1'), 'OPEN', 'CLOSED'),
      D('Air valve', aiA + ' SV-PA' + air, tk(id, 'sv.2'), 'OPEN', 'CLOSED'),
      D('Pressurized fail', pfA, tk(id, 'pf'), 'FAIL', 'NORMAL'),
      D('Transported fail', tfA, tk(id, 'tf'), 'FAIL', 'NORMAL'),
      D('Filling time-out (LEVEL + TIMER mode only)', fto, '', 'TIME OUT', 'NORMAL'),
      V('Batches sent', tk(id, 'n'), '', 0, { tag: 'plant model' })
    ];
    xs.forEach((x, i) => {
      const iid = 'bt' + id + i,
        ab = two ? 'AB'[i] : '';
      items.push(
        at(
          E('blowtank', i ? '' : name, '', i ? [] : [V('', tk(id, 'p'), 'bar', 2)], {
            id: 'bt' + id + i,
            hp: 'pkg:fa.' + id,
            on: 'v:' + tk(id, 'on') + '>0',
            level: [tk(id, 'lv'), 0, 100],
            tag: i ? '' : two ? vs[0] + ' / B' : vs[0],
            cname: name + ' blow tank ' + ab,
            perm: i ? undefined : perm,
            mon: i ? undefined : mon,
            wrap: 16
          }),
          x,
          TY,
          { id: iid, sc: 1.15, lab: i ? 'b' : 'r', lx: two ? 12 : -34, ly: i ? 0 : 160, yn: i ? undefined : [-44, -52] }
        ),
        at(valve('', tk(id, 'sv.0'), name + ab + ' inlet valve'), x, 106, { id: 'vi' + id + i, sc: 0.5, rot: 90 })
      );
      texts.push({ x, y: 62, s: (id[0] === 'A' ? 'Air heater ' + id[2] : 'Hopper ' + id[2] + (two ? ab : id[3])), cls: 'hx-note', anchor: 'middle' });
      pipes.push({ med: 'solid', w: 5, pts: [[x, 72], 'vi' + id + i + '.l'], arrow: false, flow: 'v:' + tk(id, 'sv.0') + '>0' });
      pipes.push({ med: 'solid', w: 5, pts: ['vi' + id + i + '.r', iid + '.t'], arrow: false, flow: 'v:' + tk(id, 'sv.0') + '>0' });
      if (two) pipes.push({ med: 'solid', w: 4, pts: [iid + '.b', [x, 270], [xd, 270]], arrow: false, flow: 'v:' + tk(id, 'sv.1') + '>0' });
      pipes.push({ med: 'air', w: 3, pts: [[x - 39, HY], [x - 39, TY + 8.4], iid + '.l'], arrow: false, flow: 'v:' + tk(id, 'sv.2') + '>0' });
    });
    first[n] = Math.min(first[n] || 1e9, xd);
    items.push(
      at(valve('', tk(id, 'sv.2'), name + ' air valve'), xs[0] - 39, 284, { id: 'va' + id, sc: 0.45, rot: 90 }),
      at(valve('', tk(id, 'sv.1'), name + ' discharge valve'), xd, VY, { id: 'vd' + id, sc: 0.5, rot: 90 })
    );
    pipes.push({ med: 'solid', w: 5, pts: [two ? [xd, 270] : 'bt' + id + '0.b', 'vd' + id + '.l'], arrow: false, flow: 'v:' + tk(id, 'sv.1') + '>0' });
    pipes.push({ med: 'solid', w: 5, pts: ['vd' + id + '.r', [xd, LY(n)]], arrow: false, flow: 'v:' + tk(id, 'sv.1') + '>0' });
    /* the purge valve of the tank on its line */
    const [pv, pn, pa] = purge[0];
    items.push(
      at(valve('', tk(id, 'pur'), 'Purge valve PV-' + pn), xd - 28, LY(n) - 13, { id: 'pv' + pn, sc: 0.42, rot: 90 })
    );
    texts.push({ x: xd - 38, y: LY(n) - 11, s: 'PV-' + pn, cls: 'hx-note', anchor: 'end' });
    mon.push(D('Purge valve PV-' + pn, pa + ' SV-PA' + pv, tk(id, 'pur'), 'OPEN', 'CLOSED'));
    if (id !== 'AHA' && id !== 'AHB' && id !== 'AHC' && id !== 'EP4') mon.push(D('Purge valve PV-' + END[n][1], END[n][2] + ' SV-PA' + END[n][0], 'cal:faE' + n, 'OPEN', 'CLOSED'));
  }
  /* the seven lines: to the right, up and over to the roof of the silo, none crosses another */
  for (let n = 1; n <= 7; n++) {
    const i = 7 - n; /* 0 = line 7, the highest and the innermost riser */
    const rise = 1400 + 10 * i,
      top = 40 + 10 * i,
      drop = 1600 - 10 * i;
    pipes.push({ med: 'solid', w: 5, pts: [[first[n] - 60, LY(n)], [rise, LY(n)], [rise, top], [drop, top], [drop, 230]], flow: lineFlow(n), arrow: n === 1 });
    const pn = END[n][1];
    const src = Object.keys(LINE).filter(q => LINE[q] === n);
    HX.CALC['faE' + n] = v => {
      const a = src.map(q => v(tk(q, 'pur')));
      return a.includes(null) ? null : a.some(x => x) ? 1 : 0;
    };
    items.push(at(valve('', 'cal:faE' + n, 'Purge valve PV-' + pn), 1376, LY(n) - 13, { id: 'pv' + pn, sc: 0.42, rot: 90 }));
    texts.push({ x: 1366, y: LY(n) - 11, s: 'PV-' + pn, cls: 'hx-note', anchor: 'end' });
    texts.push({ x: first[n] - 60, y: LY(n) + 18, s: 'Line ' + n, cls: 'hx-name' });
  }

  HX.PKG['fa.MCP'] = { n: 'Fly ash panel', t: 'MCP-1250', d: 'Precipitator switchgear room', sel: fk('rem'), free: true, cmds: [] };
  HX.PKG['fa.RESET'] = { n: 'Fly ash alarms', t: '40052.06', d: PANEL, free: true, again: true, cmds: [['ALARM RESET', 'reset', '', fk('ca')]] };
  HX.PKG['fa.UNL'] = {
    n: 'Dry unloader',
    t: 'L-1250',
    d: 'Unloader box DCB-1250',
    chip: 'FIELD',
    lamps: ['RUN', 'STOP'],
    st: fk('unl'),
    flt: fk('utr'),
    free: true,
    cmds: [
      ['ON', 'start', '', fk('unl')],
      ['OFF', 'stop', 'stop', no('faUnlOff', fk('unl'))]
    ],
    why: 'For safety the unloading runs from the box at the silo only (O&M 4.1.43): fan and lower gate first, then upper gate and fluidizing air.'
  };
  const SX = 1560,
    SY = 360;
  items.push(
    at(E('vvessel', 'Air buffer tank', 'T-1250', [V('', 'cal:faAir', 'bar', 1)], {
      mon: [
        V('Plant air pressure', 'cal:faAir', 'bar', 1, { tag: 'plant air header' }),
        D('Pressure low', '40006.08 PS-PA1700', fk('pal'), 'LOW', 'NORMAL')
      ]
    }), 62, 250, { id: 'abt', sc: 0.62, lab: 't', yn: [-34, -8], wrap: 12 }),
    at(
      E('silo', 'Fly ash silo', 'T-1251', [V('', fk('lv'), '%', 1)], {
        h: 110,
        level: [fk('lv'), 0, 100],
        perm: [pm('Level below HH', no('faNHH', fk('hh'))), pm('Pressure not high', no('faNPH', fk('ph')))],
        mon: [
          V('Level', fk('lv'), '%', 1, { tag: '40021 LT-FH1700' }),
          D('Level high high', '40006.04 LSHH-FH1714', fk('hh'), 'HIGH', 'NORMAL'),
          D('Level high', '40006.05 LSH-FH1714', fk('hi'), 'HIGH', 'NORMAL'),
          D('Level low', '40006.06 LSL-FH1700', fk('lo'), 'LOW', 'NORMAL'),
          D('Pressure high', '40006.03 PT-FH1711', fk('ph'), 'HIGH', 'NORMAL'),
          V('Ash arriving', fk('q'), 't/h', 1, { tag: 'plant model' })
        ]
      }),
      SX,
      SY,
      { id: 'fsilo', sc: 2.6, lab: 'r', under: true, yn: [84, 30] }
    ),
    at(
      E('fan', 'Silo vent filter', 'S-1256', [], {
        on: 'v:' + fk('vf') + '>0',
        perm: [pm('Selector remote', fk('vfr')), pm('No trip', no('faNV', fk('vft')))],
        mon: [
          D('Running', '40007.05 MIR-M1250', fk('vf')),
          D('Selector', '40007.03 MIS-M1250', fk('vfr'), 'REMOTE', 'LOCAL'),
          D('Trip', '40007.04 MIT-M1250', fk('vft'), 'TRIP', 'NORMAL'),
          D('Purge fault', '40006.07 DSP-FH1700', '', 'FAULT', 'NORMAL')
        ]
      }),
      1700,
      128,
      { id: 'vfan', sc: 0.75, lab: 't', yn: [-40, 4] }
    ),
    at(valve('Upper gate', fk('g1')), SX, 592, { id: 'fgu', sc: 0.6, rot: 90, lab: 'r' }),
    at(valve('Lower gate', fk('g2')), SX, 644, { id: 'fgd', sc: 0.6, rot: 90, lab: 'r' }),
    at(valve('Fluidizing air', fk('flu')), SX + 120, 546, { id: 'flu', sc: 0.5, lab: 'b' }),
    at(
      E('screw', 'Dry unloader', 'L-1250', [], {
        w: 70,
        hp: 'pkg:fa.UNL',
        on: 'v:' + fk('unl') + '>0',
        perm: [pm('No fault', no('faNU', fk('utr')))],
        mon: [
          D('Running', '40007.00', fk('unl')),
          D('Fault', '40007.01', fk('utr'), 'FAULT', 'NORMAL'),
          D('Unloading mode', '40006.11', fk('unlA'), 'AUTO', 'MANUAL'),
          D('Upper gate', '40006.12 SV-FH1725', fk('g1'), 'OPEN', 'CLOSED'),
          D('Lower gate', '40006.13 SV-FH1726', fk('g2'), 'OPEN', 'CLOSED'),
          D('Fluidizing valve', '40006.14 SV-PA1729', fk('flu'), 'OPEN', 'CLOSED'),
          D('Emergency stop', '40007.02', '', 'PRESSED', 'NORMAL')
        ]
      }),
      SX + 44,
      706,
      { id: 'unl', sc: 1, lab: 'r', yn: [-70, 0] }
    ),
    /* panel */
    at(
      E('cubicle', 'Fly ash panel', 'MCP-1250', [D('', '', fk('rem'), 'REMOTE', 'LOCAL')], {
        hp: 'pkg:fa.MCP',
        cname: 'Fly ash panel',
        perm: [pm('Air tank pressure not low', no('faNPA', fk('pal'))), pm('Silo level below HH', 'cal:faNHH'), pm('Power on the panel', no('faNpw', fk('npw')))],
        mon: [
          D('Control mode', '40006.09', fk('rem'), 'REMOTE', 'LOCAL'),
          D('Control by', '40006.10', '', 'LEVEL + TIMER', 'LEVEL'),
          D('System', '40008.08', fk('ready'), 'READY', 'NOT READY'),
          D('Common alarm', 'XA-FH1701', fk('ca'), 'ALARM', 'NORMAL'),
          D('Panel controller fault', 'XA-FH1702', '', 'FAULT', 'NORMAL'),
          D('Panel communication fault', 'XA-FH1703', '', 'FAULT', 'NORMAL'),
          D('Panel no power', 'XA-FH1704', fk('npw'), 'NO POWER', 'NORMAL')
        ]
      }),
      200,
      880,
      { id: 'mcp', lab: 'r', sc: 1.1, yn: [-34, -30] }
    ),
    at(E('cubicle', 'System', '', [D('', '', fk('ready'), 'READY', 'NOT READY')], { on: 'v:' + fk('ready') + '>0', cname: 'System ready' }), 460, 880, { id: 'rdy', lab: 'r', sc: 1.1 }),
    at(E('cubicle', 'Alarm reset', '', [D('', '', fk('ca'), 'ALARM', 'NORMAL')], { hp: 'pkg:fa.RESET', cname: 'Alarm reset' }), 700, 880, { id: 'rst', lab: 'r', sc: 1.1 }),
    at(L('precipitator', 'Precipitator and its hoppers', { back: true }), 1010, 880, { id: 'lpr' })
  );
  HX.CALC.faAir = v => {
    const x = v('an:paPU');
    return x == null ? null : x * 0.980665;
  };
  pipes.push(
    { med: 'air', w: 5, pts: ['abt.b', [62, HY], [X0 + 13 * DX - 39, HY]], flow: 'v:' + fk('rem') + '>0', arrow: false },
    { med: 'solid', w: 6, pts: ['fsilo.b', 'fgu.l'], arrow: false, flow: 'v:' + fk('g1') + '>0' },
    { med: 'solid', w: 6, pts: ['fgu.r', 'fgd.l'], arrow: false, flow: 'v:' + fk('g1') + '>0' },
    { med: 'solid', w: 6, pts: ['fgd.r', 'unl.in'], arrow: false, flow: 'v:' + fk('g1') + '>0' },
    { med: 'solid', w: 6, pts: ['unl.out', [SX + 88, 780]], to: 'to truck', flow: 'v:' + fk('g1') + '>0' },
    { med: 'air', w: 3, pts: [[SX + 180, 546], 'flu.r'], arrow: false, flow: 'v:' + fk('flu') + '>0' },
    { med: 'air', w: 3, pts: ['flu.l', [SX + 34, 546], [SX + 34, 482]], flow: 'v:' + fk('flu') + '>0' },
    { med: 'air', w: 5, pts: [[1612, 242], [1612, 190], [1645, 190], [1645, 128], 'vfan.in'], flow: 'v:' + fk('vf') + '>0', arrow: false }
  );

  page({
    id: 'fly-ash',
    group: 'Boiler',
    title: 'Fly ash transfer',
    about:
      'The blow tanks, the conveying lines and the fly ash silo, from the fly ash panel. Points: Modbus list, node fly ash PLC; cycle: Hwa Jann manual. An address such as 40001.00 is the Modbus word and bit of the point.',
    plan: {
      look: 'real',
      w: 1760,
      h: 1000,
      items,
      pipes,
      taps: [],
      texts: texts.concat([
        { x: 24, y: 30, s: 'BLOW TANKS', cls: 'hx-zone' },
        { x: 24, y: 450, s: 'CONVEYING LINES', cls: 'hx-zone' },
        { x: 24, y: 810, s: 'PANEL', cls: 'hx-zone' }
      ])
    }
  });
})();
