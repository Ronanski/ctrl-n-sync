/* HX page (lane 6, EIMI 2026-11-25): the condenser tube cleaning system (user 2026-11-24: "lahat ng system at equipment sa docs").
   THE PICTURE: two trains, A above and B below, one per path of the condenser. Sea water goes from left to right through the tubes and the
   ball separator; the sponge balls come back from right to left: extraction valves, V-piece, recirculating pump, ball vessel, injection.
   SOURCES: vendor P&ID GI 3862 100 01 004 (tags), control philosophy GI 3862 106 09 014 (O&M V18-3), Modbus list node CTCS points 1 ~ 18,
   DITL-119 (DCS AUTO START / STOP, start permissive). The values are those of the panel model src/analog/engine/pkg.js.
   Not drawn: the local gauges PG-SW1113 / 1114 and the root valves of the gauges and of the DP transmitters. */
(function () {
  const { V, D, E, M, L, page } = HX;
  const at = (it, x, y, o) => Object.assign(it, { x, y }, o || {});
  const pm = (label, key) => V(label, key, '', 0);
  const calc = (name, keys, f) => {
    HX.CALC[name] = v => {
      const a = keys.map(k => v(k));
      return a.includes(null) || a.includes(undefined) ? null : f(...a);
    };
    return 'cal:' + name;
  };
  const no = (name, key) => calc(name, [key], x => (x ? 0 : 1));
  const STEP = [
    'STOPPED',
    'TO INITIAL POSITION',
    'WATERING',
    'CLEANING CYCLE',
    'BALL COLLECTION',
    'INLET VALVE CLOSING',
    'IDLE',
    'BACKWASH',
    'DP STABILIZING',
    'HELD BY NORMAL BACKWASH',
    'HELD BY EMERGENCY BACKWASH',
    'FAILED'
  ];
  const MODE = ['REMOTE AUTO', 'LOCAL AUTO', 'MANUAL'];
  const T = {
    A: {
      sep: 'L-1111',
      t11: 'M-11112',
      t12: 'M-11111',
      ex: ['V-SW1039', 'V-SW1038'],
      pump: 'P-1113',
      n1: 'MV-SW1005',
      ves: 'T-1115',
      vent: 'V-SW1041',
      drain: 'V-SW1040',
      n2: 'MV-SW1106',
      byp: 'V-SW1042',
      inj: ['V-SW1044', 'V-SW1043'],
      dp: 'DPIT-SW1111',
      ti: ['TISW1110A1', 'TISW1110A2'],
      pt: [1, 2, 3, 4, 5, 6],
      sf: 16,
      ms: 17
    },
    B: {
      sep: 'L-1112',
      t11: 'M-11122',
      t12: 'M-11121',
      ex: ['V-SW1032', 'V-SW1031'],
      pump: 'P-1114',
      n1: 'MV-SW1003',
      ves: 'T-1116',
      vent: 'V-SW1034',
      drain: 'V-SW1033',
      n2: 'MV-SW1104',
      byp: 'V-SW1035',
      inj: ['V-SW1037', 'V-SW1036'],
      dp: 'DPIT-SW1112',
      ti: ['TISW1110B1', 'TISW1110B2'],
      pt: [7, 8, 9, 10, 11, 12],
      sf: 13,
      ms: 14
    }
  };
  const items = [],
    pipes = [],
    texts = [];
  for (const k of ['A', 'B']) {
    const t = T[k],
      oy = k === 'A' ? 118 : 612,
      yL = oy + 246,
      id = s => s + k,
      f = s => 'an:pkg.ctcs.' + k + '.' + s,
      dr = (d, s) => f('d.' + d + '.' + s),
      on = (key, n) => 'v:' + key + '>' + (n || 0),
      mb = n => 'Modbus CTCS ' + t.pt[n];
    const man = calc('ctcMan' + k, [f('mode')], x => (x === 2 ? 1 : 0)),
      auto = calc('ctcAut' + k, [f('mode')], x => (x === 2 ? 0 : 1)),
      rem = calc('ctcRem' + k, [f('mode')], x => (x === 0 ? 1 : 0)),
      loc = calc('ctcLoc' + k, [f('mode')], x => (x === 1 ? 1 : 0)),
      run = calc('ctcRun' + k, [f('st')], x => (x > 0 && x < 9 ? 1 : 0)),
      cage = calc('ctcCage' + k, [f('st'), f('f1')], (s, p) => (s === 4 && p ? 1 : 0)),
      fail = calc('ctcFail' + k, [f('sf'), f('ms')], (a, b) => (a || b ? 1 : 0)),
      tMin = calc('ctcT' + k, [f('t')], x => x / 60),
      trH = calc('ctcTr' + k, [f('tr')], x => x / 3600),
      tiH = calc('ctcTi' + k, [f('ti')], x => x / 3600);
    const SW = 'v:an:swQc' + k + '>0',
      RC = on(f('f1')) + '&' + on(dr('N01', 'p'), 0.5),
      OP = on(f('op')),
      BW = on(dr('T11', 'p'), 0.5);
    const ready = [
      pm('REMOTE AUTO or LOCAL AUTO selected', auto),
      pm('Start permissive, a sea water pump runs · O.0286', 'an:pkg.ctcs.per'),
      pm('No normal backwash (40 mbar)', no('ctcNn' + k, f('nb'))),
      pm('No emergency backwash (50 mbar)', no('ctcNe' + k, f('eb'))),
      pm('No sequence failure', no('ctcNs' + k, f('sf'))),
      pm('No summary failure', no('ctcNm' + k, f('ms')))
    ];
    const stMon = [
      D('In operation, balls circulate', mb(0), f('op')),
      D('Remote auto mode', mb(1), rem),
      D('Ready to start', mb(2), f('rdy'), 'READY', 'NOT READY'),
      D('Normal backwash', mb(3), f('nb'), 'REQUEST', 'NO'),
      D('Emergency backwash', mb(4), f('eb'), 'REQUEST', 'NO'),
      D('Common failure', mb(5), fail, 'FAIL', 'NORMAL'),
      D('Sequence failure', 'Modbus CTCS ' + t.sf, f('sf'), 'FAIL', 'NORMAL'),
      D('Summary failure', 'Modbus CTCS ' + t.ms, f('ms'), 'FAIL', 'NORMAL'),
      V('Step', f('st'), '', 0, { tag: 'local panel', words: STEP }),
      V('Time in this step', tMin, 'min', 1, { tag: 'local panel' }),
      V('Cleaning time, stops at 8 h', trH, 'h', 2, { tag: 'local panel' }),
      V('Idle time, new cycle at 16 h', tiH, 'h', 2, { tag: 'local panel' }),
      V('Pressure difference of the separator', f('dp'), 'mbar', 1, { tag: t.dp })
    ];
    /* ---- the local panel ---- */
    HX.PKG['ctcs.' + k] = {
      n: 'Tube cleaning panel, train ' + k,
      t: 'S01',
      d: 'Local control panel',
      chip: 'FIELD',
      lamps: ['SEQUENCE RUNS', 'SEQUENCE STOPPED'],
      st: run,
      flt: fail,
      fltWord: 'FAILURE',
      free: true,
      again: true,
      cmds: [
        ['REMOTE AUTO', 'rem', '', rem],
        ['LOCAL AUTO', 'loc', '', loc],
        ['MANUAL', 'man', '', man],
        ['SEQUENCE STOP AND RESET', 'seq'],
        ['AUTO START', 'start', '', run],
        ['AUTO STOP', 'stop', 'stop'],
        ['FAULT ACCEPT', 'ack', '', f('hoot')],
        ['FAULT RESET', 'reset']
      ],
      why: 'AUTO START and AUTO STOP work in LOCAL AUTO. In REMOTE AUTO they are in the DCS (DITL-119). Each drive is run by hand in MANUAL.'
    };
    /* ---- the drives: by hand in MANUAL only ---- */
    const drive = (d, n, tag, w1, w0, o1, o0) => {
      const pump = d === 'F01',
        p = pump ? f('f1') : dr(d, 'p'),
        c = pump ? f('f1c') : dr(d, 'c'),
        fl = pump ? f('f1t') : dr(d, 'f'),
        st = calc('ctcS' + k + d, [p], x => (x >= 1 ? 1 : 0)),
        st0 = calc('ctcZ' + k + d, [p], x => (x <= 0 ? 1 : 0));
      HX.PKG['ctcs.' + k + '-' + d] = {
        n,
        t: tag,
        d: 'Tube cleaning panel, train ' + k,
        chip: 'FIELD',
        lamps: [w1, w0],
        st,
        flt: fl,
        fltWord: pump ? 'TRIP' : 'RUN TIME FAIL',
        free: true,
        cmds: [
          [o1, 'start', '', st],
          [o0, 'stop', 'stop', st0]
        ],
        why: 'By hand in MANUAL only: select MANUAL at the panel of train ' + k + '.'
      };
      return {
        hp: 'pkg:ctcs.' + k + '-' + d,
        cname: n,
        on: on(p, pump ? 0 : 0.5),
        perm: [pm('MANUAL selected', man), pm('No fault', no('ctcN' + k + d, fl))],
        mon: pump
          ? [D('Running', 'local panel', f('f1')), D('Command', 'local panel', c, 'START', 'STOP'), D('Trip', 'local panel', fl, 'TRIP', 'NORMAL')]
          : [
              V('Position', calc('ctcP' + k + d, [p], x => x * 100), '%', 0, { tag: 'limit switches' }),
              D('Command', 'local panel', c, o1, o0),
              V('Running time of the actuator, fail at ' + (d[0] === 'T' ? '25' : '16') + ' s', dr(d, 't'), 's', 0, { tag: 'local panel' }),
              D('Run time fail', 'local panel', fl, 'FAIL', 'NORMAL')
            ]
      };
    };
    const hand = (tag, n, x, y, o) => at(E('valve', tag, '', [], { cname: n + ' ' + tag }), x, y, Object.assign({ sc: 0.55 }, o));
    const SX = 1050,
      SS = 1.15,
      e1 = SX + 10 * SS,
      e2 = SX + 54 * SS,
      ey = oy + 58 * SS,
      em = (e1 + e2) / 2;
    /* ---- sea water line ---- */
    items.push(
      at(L('sea-water', 'Sea water in', { back: true }), 96, oy, { id: id('in') }),
      at(
        E('tubepath', 'Condenser path ' + k, '', [V('Sea water', 'an:swQc' + k, 'm³/h', 0), V('In', t.ti[0], '°C', 1), V('Out', t.ti[1], '°C', 1)], {
          w: 300,
          flow: SW,
          balls: OP
        }),
        620,
        oy,
        { id: id('cd'), lab: 'b', sc: 1.15 }
      ),
      at(
        E('ballsep', 'Ball separator', t.sep, [V('DP', f('dp'), 'mbar', 1)], {
          flow: SW,
          balls: OP,
          bw: BW,
          cname: 'Ball separator ' + k,
          perm: [pm('DP below 40 mbar', calc('ctcD4' + k, [f('dp')], x => (x < 40 ? 1 : 0)))],
          mon: [
            V('Pressure difference', f('dp'), 'mbar', 1, { tag: t.dp }),
            D('Normal backwash at 40 mbar', mb(3), f('nb'), 'REQUEST', 'NO'),
            D('Emergency backwash at 50 mbar', mb(4), f('eb'), 'REQUEST', 'NO'),
            D('Screen T11', t.t11, dr('T11', 'p'), 'BACKWASH', 'OPERATION'),
            D('Screen T12', t.t12, dr('T12', 'p'), 'BACKWASH', 'OPERATION')
          ]
        }),
        SX,
        oy,
        { id: id('sep'), lab: 'r', ly: 52, lx: 2, sc: SS, yn: [78, -62] }
      ),
      at(E('motor', 'Screen T11', t.t11, [], drive('T11', 'Screen actuator T11, train ' + k, t.t11, 'BACKWASH', 'OPERATION', 'BACKWASH', 'OPERATION')), 890, oy - 56, {
        id: id('t11'),
        lab: 'l',
        sc: 0.8
      }),
      at(E('motor', 'Screen T12', t.t12, [], drive('T12', 'Screen actuator T12, train ' + k, t.t12, 'BACKWASH', 'OPERATION', 'BACKWASH', 'OPERATION')), 890, oy + 70, {
        id: id('t12'),
        lab: 'l',
        sc: 0.8
      })
    );
    items.push(
      hand(t.ex[1], 'Extraction valve', e1, oy + 108, { id: id('x1'), rot: 90, lab: 'l' }),
      hand(t.ex[0], 'Extraction valve', e2, oy + 108, { id: id('x2'), rot: 90, lab: 'r' }),
      at(E('pump', 'Ball recirculating pump', t.pump, [], drive('F01', 'Ball recirculating pump ' + k, t.pump, 'RUNNING', 'STOPPED', 'START', 'STOP')), 960, yL + 14, {
        id: id('pu'),
        lab: 'b',
        sc: 1.1,
        mir: true
      }),
      at(
        E('valve', 'Vessel inlet valve', t.n1, [], Object.assign(drive('N01', 'Ball vessel inlet valve, train ' + k, t.n1, 'OPEN', 'CLOSED', 'OPEN', 'CLOSE'), { kind: 'motor' })),
        800,
        yL - 62,
        { id: id('n1'), lab: 'b' }
      ),
      at(
        E('ballvessel', 'Ball vessel', t.ves, [], {
          flow: RC,
          balls: OP,
          cage: on(cage),
          cname: 'Ball vessel ' + k,
          mon: [
            D('Balls', 'local panel', f('op'), 'CIRCULATE', 'NOT CIRCULATING'),
            D('Inlet valve', t.n1, dr('N01', 'p'), 'OPEN', 'CLOSED'),
            D('Outlet valve', t.n2, dr('N02', 'p'), 'OPEN', 'CLOSED'),
            V('Cleaning time, stops at 8 h', trH, 'h', 2, { tag: 'local panel' })
          ]
        }),
        640,
        yL - 33,
        { id: id('ve'), lab: 'r', ly: 30, sc: 1.3, yn: [-52, -56] }
      ),
      at(
        E('valve', 'Vessel outlet valve', t.n2, [], Object.assign(drive('N02', 'Ball vessel outlet valve, train ' + k, t.n2, 'OPEN', 'CLOSED', 'OPEN', 'CLOSE'), { kind: 'motor' })),
        520,
        yL + 76,
        { id: id('n2'), lab: 'b' }
      ),
      hand(t.byp, 'Bypass valve', 520, yL - 25, { id: id('n5'), lab: 't' }),
      hand(t.vent, 'Vessel vent', 596, yL - 122, { id: id('vv'), lab: 'l', sc: 0.45 }),
      hand(t.drain, 'Vessel drain', 720, yL + 62, { id: id('vd'), lab: 'r', sc: 0.45 }),
      hand(t.inj[0], 'Injection valve', 290, oy + 92, { id: id('j1'), rot: 90, lab: 'l' }),
      hand(t.inj[1], 'Injection valve', 356, oy + 92, { id: id('j2'), rot: 90, lab: 'r' })
    );
    const cd = id('cd'),
      sep = id('sep');
    pipes.push(
      { med: 'sea', w: 12, pts: [[176, oy], cd + '.l'], flow: SW, arrow: false },
      { med: 'sea', w: 12, pts: [cd + '.r', sep + '.l'], flow: SW, arrow: false },
      { med: 'sea', w: 12, pts: [sep + '.r', [1270, oy]], flow: SW, to: 'to discharge' },
      { med: 'sea', w: 5, pts: [[e1, ey], id('x1') + '.l'], flow: RC, arrow: false },
      { med: 'sea', w: 5, pts: [[e2, ey], id('x2') + '.l'], flow: RC, arrow: false },
      { med: 'sea', w: 5, pts: [id('x1') + '.r', [e1, oy + 146], [em, oy + 168], [em, yL + 14], id('pu') + '.s'], flow: RC },
      { med: 'sea', w: 5, pts: [id('x2') + '.r', [e2, oy + 146], [em, oy + 168]], flow: RC, arrow: false },
      { med: 'sea', w: 5, pts: [id('pu') + '.d', [962, yL - 62], id('n1') + '.r'], flow: RC, arrow: false },
      { med: 'sea', w: 5, pts: [id('n1') + '.l', id('ve') + '.r'], flow: RC },
      { med: 'sea', w: 5, pts: [id('ve') + '.b', [640, yL + 76], id('n2') + '.r'], flow: RC + '&' + on(dr('N02', 'p'), 0.5), arrow: false },
      { med: 'sea', w: 5, pts: [id('ve') + '.tip', id('n5') + '.r'], flow: RC, arrow: false },
      { med: 'sea', w: 5, pts: [id('n2') + '.l', [440, yL + 76], [440, yL - 25]], flow: RC + '&' + on(dr('N02', 'p'), 0.5), arrow: false },
      { med: 'sea', w: 5, pts: [id('n5') + '.l', [323, yL - 25], [323, oy + 160], [290, oy + 138], id('j1') + '.r'], flow: RC, arrow: false },
      { med: 'sea', w: 5, pts: [[323, oy + 160], [356, oy + 138], id('j2') + '.r'], flow: RC, arrow: false },
      { med: 'sea', w: 5, pts: [id('j1') + '.l', [290, oy + 8]], flow: RC },
      { med: 'sea', w: 5, pts: [id('j2') + '.l', [356, oy + 8]], flow: RC },
      { med: 'sea', w: 3, pts: [id('ve') + '.vent', [640, yL - 122], id('vv') + '.r'], arrow: false },
      { med: 'sea', w: 3, pts: [id('ve') + '.drain', [674, yL + 62], id('vd') + '.l'], arrow: false }
    );
    /* ---- control: the DCS and the local panel ---- */
    items.push(
      at(M('cubicle', 'CTCS-' + k, 'DCS control, train ' + k, [V('', f('st'), '', 0, { words: STEP })], { tag: 'DITL-119', perm: ready, mon: stMon }), 1400, oy + 92, {
        id: id('dcs'),
        lab: 'r',
        sc: 1.1,
        yn: [-42, -32]
      }),
      at(
        E('cubicle', 'Local panel, train ' + k, 'S01', [V('', f('mode'), '', 0, { words: MODE }), D('', '', f('rdy'), 'READY TO START', 'NOT READY'), D('', '', fail, 'FAILURE', 'NO FAILURE')], {
          hp: 'pkg:ctcs.' + k,
          cname: 'Tube cleaning panel, train ' + k,
          perm: ready,
          mon: stMon
        }),
        1400,
        oy + 216,
        { id: id('lcp'), lab: 'r', sc: 1.1, yn: [-42, -32] }
      )
    );
    texts.push({ x: 24, y: oy - 88, s: 'TRAIN ' + k, cls: 'hx-zone' }, { x: 1340, y: oy + 34, s: 'CONTROL', cls: 'hx-zone' });
  }
  page({
    id: 'tube-cleaning',
    group: 'Cooling and utilities',
    title: 'Condenser tube cleaning',
    about:
      'The sponge ball cleaning of the condenser tubes, one train per sea water path (vendor P&ID GI 3862 100 01 004). DCS start and stop: DITL-119; the cycle runs in the local panel (GI 3862 106 09 014).',
    plan: { look: 'real', w: 1760, h: 1000, items, pipes, taps: [], texts }
  });
})();
