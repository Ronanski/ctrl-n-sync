/* HX page: the hard-wired signals between the turbine control system (TCS) and the DCS (lane 7, user 2026-11-25 "Ikonek lahat ng
   address nito sa lahat ng signal ... Kumpletuhin ang HMI").
   THE PICTURE: five columns of states and values, grouped by what the operator asks of them: is the turbine tripped and are its
   valves closed; where is the start-up; what the TCS asks of the drain valves; who has the load (DCS control mode, Modbus
   links, target MW); the generator protection and metering.
   THE SOURCE: the DCS I/O list (ades / wiring): TCS-DI1003 ~ 1058 (station 1 / 2 digital inputs from the TCS), TCS-AI1001 ~ 1012
   and GCP-AI1001 ~ 1006 (analog inputs from the TCS and the generator control panel), TCS-AO1001 / 1006 / 1007 / 1011 and
   GCP-AO1002 ~ 1008 (analog outputs of the DCS to the TCS and the generator panel); ranges and units from the DCS loop list.
   Every state is a digital input of the I/O list (data-di), every value its I/O tag: they read '-----' until the TCS I/O
   binding (lane 2) gives them a value. Nothing on this page presses a TCS button: the operator buttons of the TCS (CRT) are
   on the Turbine page. */
(function () {
  const { L, page } = HX;
  const B = HX.B;
  const at = (it, x, y, o) => Object.assign(it, { x, y }, o || {});
  const di = (tag, on, off) => 'data-di="' + tag + '|' + on + '|' + off + '"';
  /* places (the drawing is 1760 x 1000): five columns, a heading on top, then the boxes */
  const CX = [190, 530, 870, 1210, 1550],
    TOP = 120,
    ROW = 46,
    W = 300;
  const COLS = [
    {
      head: 'Trip and valves',
      di: [
        ['Turbine trip', 'TCS-DI1003', 'TRIP', 'NORMAL'],
        ['Turbine trip 2', 'TCS-DI1055', 'TRIP', 'NORMAL'],
        ['Reheat stop / intercept valves closed 1', 'TCS-DI1024', 'CLOSED', 'NOT CLOSED'],
        ['Reheat stop / intercept valves closed 2', 'TCS-DI1025', 'CLOSED', 'NOT CLOSED'],
        ['Main stop / control valves closed, major trouble 1', 'TCS-DI1026', 'YES', 'NO'],
        ['Main stop / control valves closed, major trouble 2', 'TCS-DI1027', 'YES', 'NO'],
        ['Control and intercept valves closed by load unbalance', 'TCS-DI1028', 'YES', 'NO'],
        ['High pressure control valves fully closed', 'TCS-DI1050', 'CLOSED', 'NOT CLOSED'],
        ['Main stop valve A test', 'TCS-DI1051-1', 'TEST', 'NORMAL'],
        ['Main stop valve B test', 'TCS-DI1051-2', 'TEST', 'NORMAL']
      ]
    },
    {
      head: 'Speed and start-up',
      di: [
        ['Turbine speed under 2400 rpm', 'TCS-DI1029', 'YES', 'NO'],
        ['Turning gear engaged', 'TCS-DI1030', 'ENGAGED', 'NOT ENGAGED'],
        ['Intercept to control valve transfer complete', 'TCS-DI1031', 'COMPLETE', 'NOT COMPLETE'],
        ['Steam seal feed inlet valve closed', 'TCS-DI1032', 'CLOSED', 'NOT CLOSED'],
        ['Start-up mode ambient cold', 'TCS-DI1039', 'SELECTED', 'NO'],
        ['Start-up mode cold 1', 'TCS-DI1040', 'SELECTED', 'NO'],
        ['Start-up mode cold 2', 'TCS-DI1041', 'SELECTED', 'NO'],
        ['Start-up mode warm', 'TCS-DI1042', 'SELECTED', 'NO'],
        ['Start-up mode hot', 'TCS-DI1043', 'SELECTED', 'NO'],
        ['Ambient cold mode temperature', 'TCS-DI1057', 'YES', 'NO'],
        ['Mode judgement instrument normal', 'TCS-DI1058', 'NORMAL', 'ABNORMAL'],
        ['Turbine load hold', 'TCS-DI1044', 'HOLD', 'NO']
      ],
      val: [['Turbine rated speed', 'TCS-AI1004', 'rpm', 0]]
    },
    {
      head: 'Drain commands from turbine',
      di: [
        ['Warming line drain MV-AS1394 open', 'TCS-DI1033', 'OPEN', 'NO'],
        ['Warming line drain MV-AS1394 close', 'TCS-DI1034', 'CLOSE', 'NO'],
        ['Gland steam line drain MV-AS1397 open', 'TCS-DI1037', 'OPEN', 'NO'],
        ['Gland steam line drain MV-AS1397 close', 'TCS-DI1038', 'CLOSE', 'NO']
      ],
      links: [
        ['aux-steam', 'Auxiliary steam'],
        ['reheat-steam', 'Reheat steam']
      ]
    },
    {
      head: 'Load control',
      di: [
        ['DCS control mode permissive', 'TCS-DI1046', 'YES', 'NO'],
        ['DCS control mode on', 'TCS-DI1047', 'ON', 'OFF'],
        ['Modbus line A duty', 'TCS-DI1048', 'DUTY', 'STANDBY'],
        ['Modbus line B duty', 'TCS-DI1049', 'DUTY', 'STANDBY']
      ],
      val: [
        ['Target MW to the turbine', 'TCS-AO1001', 'MW', 1],
        ['Target MW feedback', 'TCS-AI1001', 'MW', 1],
        ['Maximum load up rate', 'TCS-AI1005', '%/min', 2]
      ]
    },
    {
      head: 'Generator',
      di: [
        ['Field breaker 41 closed', 'TCS-DI1052', 'CLOSED', 'OPEN'],
        ['Generator lockout 86GA operated', 'TCS-DI1053', 'OPERATED', 'NORMAL'],
        ['Generator lockout 86GB operated', 'TCS-DI1054', 'OPERATED', 'NORMAL']
      ],
      val: [
        ['Current A', 'TCS-AI1006', 'kA', 2],
        ['Current B', 'TCS-AI1007', 'kA', 2],
        ['Current C', 'TCS-AI1011', 'kA', 2],
        ['Voltage A-B', 'GCP-AI1005', 'kV', 2],
        ['Voltage B-C', 'TCS-AI1008', 'kV', 2],
        ['Voltage C-A', 'TCS-AI1012', 'kV', 2],
        ['Power factor', 'TCS-AI1009', '', 3],
        ['Frequency', 'TCS-AI1010', 'Hz', 2],
        ['Reactive power', 'GCP-AI1004', 'MVar', 1],
        ['Energy', 'GCP-AI1003', 'MWh', 0],
        ['Reactive energy', 'GCP-AI1006', 'MVarh', 0],
        ['Sent out: MW (D)', 'GCP-AO1002', 'MW', 1],
        ['Sent out: MVar', 'GCP-AO1003', 'MVar', 1],
        ['Sent out: voltage A-B', 'GCP-AO1004', 'kV', 2],
        ['Sent out: voltage B-C', 'GCP-AO1005', 'kV', 2],
        ['Sent out: voltage C-A', 'GCP-AO1006', 'kV', 2],
        ['Sent out: power factor', 'GCP-AO1007', '', 3],
        ['Sent out: frequency', 'GCP-AO1008', 'Hz', 2],
        ['Sent out: current A', 'TCS-AO1006', 'kA', 2],
        ['Sent out: current B', 'TCS-AO1007', 'kA', 2],
        ['Sent out: current C', 'TCS-AO1011', 'kA', 2]
      ],
      links: [['generator', 'Generator']]
    }
  ];
  const items = [],
    texts = [];
  COLS.forEach((c, i) => {
    const x = CX[i];
    texts.push({ x, y: TOP - 40, s: c.head.toUpperCase() });
    let y = TOP;
    c.di.forEach(([name, tag, on, off], k) => {
      items.push(at(B(name, di(tag, on, off), { w: W }), x, y, { id: 'c' + i + 'd' + k }));
      y += ROW;
    });
    y += 6;
    (c.val || []).forEach(([name, tag, unit, dp]) => {
      texts.push({ x: x - W / 2 + 4, y, s: name, key: tag, unit, dp, anchor: 'start' });
      y += 20;
    });
    (c.links || []).forEach(([to, text], k) =>
      items.push(at(L(to, text), x, y + 30 + 40 * k, { id: 'c' + i + 'l' + k }))
    );
  });

  page({
    id: 'turbine-interface',
    group: 'Turbine and generator',
    title: 'Turbine control interface',
    about:
      'The hard-wired states and values between the turbine control system, the generator panel and the DCS: trip and valves, start-up mode, drain valve commands, load control, generator protection and metering. Source: DCS I/O list (TCS-DI / AI / AO, GCP-AI / AO).',
    plan: { look: 'real', w: 1760, h: 1000, items, pipes: [], texts }
  });
})();
