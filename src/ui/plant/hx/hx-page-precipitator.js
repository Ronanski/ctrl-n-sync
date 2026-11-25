/* HX page (lane 6, EIMI): the electrostatic precipitator with its own panel (user 2026-11-24: "lahat ng system at equipment sa docs").
   THE PICTURE: the casing cut open along the gas. The gas enters on the left through the perforated plate and runs through five fields;
   over each field its transformer-rectifier on the roof, in the roof box the two rappers of the discharge frames, at the foot the rapper of
   the collecting plates, below it the two hoppers with their vibrators. The purge air fan and its heater blow on the insulators.
   SOURCES: K C Cottrell O&M (V19-1: five fields, 14,850 m2, ten hoppers; T/R U-1201 ~ U-1205, rappers M-12n1 ~ M-12n3, vibrators M-12n4 / 5,
   heater H-1201, fan F-1201), Modbus list, node ESP PLC (30001 ~ 30126 to the DCS, 40020 ~ 40206 from the DCS), instrument list (hopper
   level switches LS-FH1730 ~ 1739 at 4800 mm). The values are those of the panel model src/analog/engine/pkg.js.
   Drawn simpler: the hoppers A / B of a field stand one behind the other across the gas, here side by side; the six discharge frames of a
   field are one; the seal boxes, manholes and the hopper heaters have no point on the DCS. */
(function () {
  const { V, D, E, L, page } = HX;
  const at = (it, x, y, o) => Object.assign(it, { x, y }, o || {});
  const pad = b => String(b).padStart(2, '0');
  const PANEL = 'Precipitator panel';
  const dk = (id, k) => 'an:pkg.esp.d.' + id + '.' + k,
    tk = (f, k) => 'an:pkg.esp.tr.' + f + '.' + k;
  const pm = (label, key) => V(label, key, '', 0);
  /* a fault as a permissive row: 1 = no fault */
  const no = (name, key) => {
    HX.CALC[name] = v => {
      const x = v(key);
      return x == null ? null : x ? 0 : 1;
    };
    return 'cal:' + name;
  };
  const ORD = ['1st', '2nd', '3rd', '4th', '5th'];

  /* one device of the panel: its faceplate, and the rows of the second one with the Modbus address of each point */
  function dev(id, tag, name, adr, o) {
    const sets = [];
    if (adr.ton) sets.push({ l: 'Running time in auto', unit: 'min', max: 999, dp: 1, op: 'ton', key: dk(id, 'ton') });
    if (adr.toff) sets.push({ l: 'Stopped time in auto', unit: 'min', max: 999, dp: 1, op: 'toff', key: dk(id, 'toff') });
    HX.PKG['esp.' + id] = {
      n: name,
      t: tag,
      d: PANEL,
      st: dk(id, 'run'),
      flt: dk(id, 'flt'),
      sel: dk(id, 'rem'),
      au: dk(id, 'auto'),
      reset: true,
      cmds: [
        ['START', 'start'],
        ['STOP', 'stop']
      ],
      sets,
      why: (o && o.why) || ''
    };
    const [w, b] = adr.di;
    const row = (l, n, key, w1, w0, q) => D(l, n, key, w1, w0, q);
    const mon = [
      row('Selector', w + '.' + pad(b), dk(id, 'rem'), 'REMOTE', 'LOCAL'),
      row('Running', w + '.' + pad(b + 1), dk(id, 'run')),
      row('Fault', w + '.' + pad(b + 2), dk(id, 'flt'), 'FAULT', 'NORMAL'),
      row('Mode', adr.au, dk(id, 'auto'), 'AUTO', 'MANUAL')
    ];
    if (adr.ton) mon.push(V('Running time in auto', dk(id, 'ton'), 'min', 1, { tag: adr.ton }));
    if (adr.toff) mon.push(V('Stopped time in auto', dk(id, 'toff'), 'min', 1, { tag: adr.toff }));
    if (o && o.mon) mon.push(...o.mon);
    return {
      hp: 'pkg:esp.' + id,
      on: 'v:' + dk(id, 'run') + '>0',
      tag,
      perm: [pm('Selector remote', dk(id, 'rem')), pm('No fault', no('espNF' + id, dk(id, 'flt')))],
      mon
    };
  }

  const X0 = 343,
    DX = 256,
    cx = f => X0 + f * DX,
    FY = 385 /* centre of the fields */,
    FH = 330,
    HY = FY + FH / 2 /* top of the hoppers */,
    HH = 116;
  const items = [],
    pipes = [],
    texts = [];
  const lit = f => 'v:' + tk(f, 'kv') + '>0';

  for (let f = 0; f < 5; f++) {
    const x = cx(f),
      id = k => 'M12' + f + k,
      tg = k => 'M-12' + f + k;
    /* the field and its rectifier */
    items.push(at(E('espfield', '', '', [], { on: lit(f), flow: lit(f), w: DX, h: FH }), x, FY, { id: 'ef' + f, under: true }));
    HX.PKG['esp.TR' + (f + 1)] = {
      n: 'Rectifier ' + (f + 1),
      t: 'U-120' + (f + 1),
      d: PANEL,
      st: tk(f, 'run'),
      flt: tk(f, 'alm'),
      fltWord: 'ALARM',
      sel: tk(f, 'rem'),
      reset: true,
      cmds: [
        ['START', 'start'],
        ['STOP', 'stop']
      ],
      sets: [{ l: 'Current limit', unit: '%', max: 100, dp: 0, op: 'lim', key: tk(f, 'lim') }],
      why: 'The rectifier trips on under-voltage below 5 kV for 30 s (a hopper full of ash shorts its field).'
    };
    const a = 30051 + 4 * f;
    items.push(
      at(
        E('transformer', 'Rectifier ' + (f + 1), 'U-120' + (f + 1), [V('', tk(f, 'kv'), 'kV', 1), V('', tk(f, 'ma'), 'mA', 0)], {
          hp: 'pkg:esp.TR' + (f + 1),
          on: 'v:' + tk(f, 'run') + '>0',
          perm: [pm('Selector remote', tk(f, 'rem')), pm('No alarm', no('espNA' + f, tk(f, 'alm')))],
          mon: [
            V('Secondary voltage', tk(f, 'kv'), 'kV', 1, { tag: '' + (a + 2) }),
            V('Secondary current', tk(f, 'ma'), 'mA', 0, { tag: '' + (a + 3) }),
            V('Primary voltage', tk(f, 'pv'), 'V', 0, { tag: '' + a }),
            V('Primary current', tk(f, 'pa'), 'A', 0, { tag: '' + (a + 1) }),
            V('Current limit', tk(f, 'lim'), '%', 0, { tag: '' + (30112 + f) }),
            D('Selector', '30018.' + pad(3 * f), tk(f, 'rem'), 'REMOTE', 'LOCAL'),
            D('Running', '30018.' + pad(3 * f + 1), tk(f, 'run')),
            D('Alarm', '30018.' + pad(3 * f + 2), tk(f, 'alm'), 'ALARM', 'NORMAL')
          ]
        }),
        x,
        118,
        { id: 'pkTR' + (f + 1), sc: 0.95, lab: 'r', yn: [-62, -42] }
      )
    );
    pipes.push({ med: 'power', w: 4, pts: ['pkTR' + (f + 1) + '.b', 'ef' + f + '.t'], flow: lit(f), arrow: false });

    /* the rappers: two on the discharge frames (roof box), one on the collecting plates */
    for (const [k, dx, n] of [
      [2, -48, 'A'],
      [3, 44, 'B']
    ])
      items.push(
        at(
          E(
            'rapper',
            'Rapper ' + n,
            '',
            [],
            dev(id(k), tg(k), ORD[f] + ' field discharge rapper ' + n, {
              di: [k === 2 ? 30002 : 30003, 3 * f],
              au: '30016.' + pad((k === 2 ? 5 : 10) + f),
              ton: '' + (30117 + 2 * f + (k - 2)),
              toff: '' + (30071 + 2 * f + (k - 2))
            })
          ),
          x + dx,
          FY - FH / 2 + 40,
          { id: 'pk' + id(k), lab: 'b', sc: 0.9, yn: [34, 0], cname: ORD[f] + ' field discharge rapper ' + n, wrap: 40 }
        )
      );
    items.push(
      at(
        E(
          'rapper',
          'Plate rapper',
          '',
          [],
          dev(id(1), tg(1), ORD[f] + ' field plate rapper', {
            di: [30001, 3 * f],
            au: '30016.' + pad(f),
            ton: '' + (30081 + 2 * f),
            toff: '' + (30082 + 2 * f)
          })
        ),
        x - 10,
        HY - 22,
        { id: 'pk' + id(1), lab: 'r', sc: 0.9, yn: [-38, -8], cname: ORD[f] + ' field plate rapper' }
      )
    );

    /* the hoppers with their level switch, the vibrators */
    for (let s = 0; s < 2; s++) {
      const N = 'AB'[s],
        i = 2 * f + s,
        hx = x + (s ? DX / 4 : -DX / 4),
        ls = 'LS-FH' + (1730 + i);
      items.push(
        at(
          E('esphopper', 'Hopper ' + (f + 1) + N, '', [V('', 'an:pkg.esp.lv.' + i, 'm', 2)], {
            level: ['an:pkg.esp.lv.' + i, 0, 5.18],
            id: 'eh' + i,
            w: 122,
            h: HH,
            perm: [pm('Level below the switch', no('espLS' + i, 'an:pkg.esp.lsh.' + i))],
            mon: [
              V('Ash level', 'an:pkg.esp.lv.' + i, 'm', 2, { tag: 'plant model' }),
              V('Ash in the hopper', 'an:pkg.esp.h.' + i, 'kg', 0, { tag: 'plant model' }),
              D('Level switch high', '30008.' + pad(3 + i) + ' ' + ls, 'an:pkg.esp.lsh.' + i, 'HIGH', 'NORMAL'),
              D('Emptying into its blow tank', 'fly ash panel', 'cal:espEmp' + i, 'YES', 'NO')
            ]
          }),
          hx,
          HY,
          { id: 'eh' + i, under: true, lab: 'r', lx: -50, ly: HH + 24, yn: [18, HH - 12], cname: 'Hopper ' + (f + 1) + N }
        )
      );
      const tank = f < 2 ? 'EP' + (f + 1) + N : 'EP' + (f + 1);
      HX.CALC['espEmp' + i] = v => v('an:pkg.fa.t.' + tank + '.sv.0');
      pipes.push({ med: 'solid', w: 5, pts: ['eh' + i + '.b', [hx, 770]], flow: 'v:an:pkg.fa.t.' + tank + '.sv.0>0' });
      texts.push({ x: hx, y: 786, s: 'to tank ' + (f + 1) + (f < 2 ? N : ''), cls: 'hx-note', anchor: 'middle' });
      const k = 4 + s;
      items.push(
        at(
          E(
            'vibrator',
            'Vibrator ' + N,
            '',
            [],
            dev(
              id(k),
              tg(k),
              ORD[f] + ' field hopper vibrator ' + N,
              {
                di: [30004 + s, 3 * f],
                au: s ? '30017.' + pad(4 + f) : f ? '30017.' + pad(f - 1) : '30016.15',
                ton: '' + (30091 + 4 * f + 2 * s),
                toff: '' + (30092 + 4 * f + 2 * s)
              },
              {
                why: 'In AUTO the vibrator also runs 3 s with the ash inlet valve of its blow tank.',
                mon: [D('Interlock: fly ash inlet valve', '30006.' + pad(6 + i), 'cal:espVib' + i, 'VIBRATE', 'NONE')]
              }
            )
          ),
          hx - 44,
          HY + 78,
          { id: 'pk' + id(k), lab: 'b', yn: [-31, -8], cname: ORD[f] + ' field hopper vibrator ' + N }
        )
      );
      HX.CALC['espVib' + i] = v => {
        const x = v('an:pkg.fa.vib.' + i);
        return x == null ? null : x > 0 ? 1 : 0;
      };
    }
    texts.push({ x: x - 118, y: HY - 18, s: ORD[f] + ' field', cls: 'hx-name' });
  }

  /* the group buttons of the panel (40027) */
  HX.PKG['esp.SYS'] = {
    n: 'Precipitator system',
    t: 'Z-1010',
    d: PANEL,
    lamps: ['AUTO START', 'STOPPED'],
    st: 'an:pkg.esp.sys',
    free: true,
    cmds: [
      ['AUTO START', 'start', '', 'an:pkg.esp.sys'],
      ['AUTO STOP', 'stop', 'stop', no('espSysOff', 'an:pkg.esp.sys')]
    ],
    why: 'AUTO START puts the rappers on their intervals, starts the purge air fan and the rectifiers that are at REMOTE with no alarm.'
  };
  HX.PKG['esp.HAMMER'] = { n: 'All rappers', t: '40027.02', d: PANEL, free: true, again: true, cmds: [['ALL TO AUTO', 'auto', '', 'cal:espHamAuto']] };
  HX.PKG['esp.VIBRATOR'] = { n: 'All vibrators', t: '40027.03', d: PANEL, free: true, again: true, cmds: [['ALL TO AUTO', 'auto', '', 'cal:espVibAuto']] };
  HX.PKG['esp.FANHTR'] = {
    n: 'Purge air fan and heater',
    t: '40027.04 / .05',
    d: PANEL,
    free: true,
    again: true,
    cmds: [
      ['START', 'start', '', 'an:pkg.esp.fan'],
      ['STOP', 'stop', 'stop', no('espFanOff', 'an:pkg.esp.fan')]
    ],
    why: 'For the fan and the heater that are in AUTO.'
  };
  const all = list => v => {
    const a = list.map(id => v(dk(id, 'auto')));
    return a.includes(null) ? null : a.every(x => x) ? 1 : 0;
  };
  const five = ks => [0, 1, 2, 3, 4].flatMap(f => ks.map(k => 'M12' + f + k));
  HX.CALC.espHamAuto = all(five([1, 2, 3]));
  HX.CALC.espVibAuto = all(five([4, 5]));
  const btn = (id, name, key, vals) => E('cubicle', name, '', vals || [], { hp: 'pkg:esp.' + id, on: key ? 'v:' + key + '>0' : undefined, cname: name });

  items.push(
    at(L('furnace-gas', 'From the air heater', { back: true }), 74, FY - 90, { id: 'gin' }),
    at(E('espnozzle', '', '', [], { h: FH, w: 110 }), X0 - DX / 2 - 55, FY, { id: 'nzi', under: true }),
    at(E('espnozzle', '', '', [], { h: FH, w: 100, out: true }), cx(4) + DX / 2 + 50, FY, { id: 'nzo', under: true }),
    at(L('furnace-gas', 'To the induced draft fan'), 1672, FY - 90, { id: 'gout' }),
    /* purge air */
    at(
      E(
        'fan',
        'Purge air fan',
        'F-1201',
        [],
        dev('F1201', 'F-1201', 'Purge air fan', { di: [30006, 0], au: '30017.09' }, { why: 'In AUTO the fan follows FAN & HEATER START / STOP of the panel.' })
      ),
      96,
      112,
      { id: 'pkF1201', sc: 0.8, lab: 'r', yn: [-50, 6] }
    ),
    at(
      E(
        'eheater',
        'Purge air heater',
        'H-1201',
        [],
        Object.assign(dev('H1201', 'H-1201', 'Purge air heater', { di: [30006, 3], au: '30017.10' }, { why: 'In AUTO the heater follows FAN & HEATER START / STOP of the panel; it is taken out one hour after the fields are on.' }), {
          flow: 'v:' + dk('H1201', 'run') + '>0'
        })
      ),
      120,
      204,
      { id: 'pkH1201', sc: 0.8, lab: 'b', yn: [46, -20] }
    ),
    /* the panel */
    at(btn('SYS', 'Precipitator system', 'an:pkg.esp.sys', [D('', '', 'an:pkg.esp.sys', 'AUTO START', 'STOPPED')]), 190, 890, { id: 'pkSYS', lab: 'r', sc: 1.1 }),
    at(btn('HAMMER', 'All rappers to auto', '', [D('', '', 'cal:espHamAuto', 'ALL AUTO', 'NOT ALL AUTO')]), 470, 890, { id: 'pkHAM', lab: 'r', sc: 1.1 }),
    at(btn('VIBRATOR', 'All vibrators to auto', '', [D('', '', 'cal:espVibAuto', 'ALL AUTO', 'NOT ALL AUTO')]), 740, 890, { id: 'pkVIB', lab: 'r', sc: 1.1 }),
    at(btn('FANHTR', 'Purge air fan and heater', 'an:pkg.esp.fan', [D('', '', 'an:pkg.esp.fan', 'START', 'STOP')]), 1020, 890, { id: 'pkFHT', lab: 'r', sc: 1.1 }),
    at(L('fly-ash', 'Blow tanks and fly ash silo'), 1480, 890, { id: 'lfa' })
  );
  pipes.push(
    { med: 'gas', w: 14, pts: ['gin.b', [74, FY], 'nzi.l'], flow: 'm:IDF' },
    { med: 'gas', w: 14, pts: ['nzo.r', [1672, FY], 'gout.b'], flow: 'm:IDF' },
    { med: 'air', w: 4, pts: ['pkF1201.out', [94, 66], [30, 66], [30, 204], 'pkH1201.l'], flow: 'v:' + dk('F1201', 'run') + '>0' },
    { med: 'air', w: 4, pts: ['pkH1201.r', [cx(4) + DX / 2 - 21, 204]], flow: 'v:' + dk('F1201', 'run') + '>0', arrow: false }
  );
  for (let f = 0; f < 5; f++)
    for (const dx of [21 - DX / 2, DX / 2 - 21]) pipes.push({ med: 'air', w: 3, pts: [[cx(f) + dx, 204], [cx(f) + dx, FY - FH / 2 + 12]], flow: 'v:' + dk('F1201', 'run') + '>0' });

  page({
    id: 'precipitator',
    group: 'Boiler',
    title: 'Electrostatic precipitator',
    about:
      'The precipitator with its rectifiers, rappers, vibrators, hoppers and purge air, from its own panel. Points: Modbus list, node ESP PLC; equipment: K C Cottrell manual. An address such as 30001.00 is the Modbus word and bit of the point.',
    plan: {
      look: 'real',
      w: 1760,
      h: 1000,
      items,
      pipes,
      taps: [],
      texts: texts.concat([
        { x: 24, y: 40, s: 'PURGE AIR TO THE INSULATORS', cls: 'hx-zone' },
        { x: 24, y: 830, s: 'PANEL', cls: 'hx-zone' },
        { x: 1600, y: 600, s: 'Dust at the stack', key: 'AT-FG1057-5', unit: 'mg/m³', dp: 1 },
        { x: 1600, y: 622, s: 'Opacity', key: 'AT-FG1057-6', unit: '%', dp: 1 }
      ])
    }
  });
})();
