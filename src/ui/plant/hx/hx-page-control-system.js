/* HX page in the REALISTIC look: the station control system itself (HMI gap list 2026-11-25: the system alarm contacts of the control
   cabinets were on no page).
   THE PICTURE: the operator stations in the control room, the two control networks, the cabinets of unit 1 with their doors open (power
   unit and alarm unit on top, the two controllers in a controller cabinet, the input / output nodes below), and under them the panels
   and gateways. The lamp of the alarm unit of a cabinet lights while its system alarm stands.
   THE CONNECTIONS: K1AU3-E2-0-106 sheet 1 (system configuration: stations, networks, cabinets, what each group controls), sheet 2 (network
   pairs), K1AU3-E2-0-109 (cabinet layouts), 111 (power distribution panel), 112 (sequence of events recorder), 114 (relay panels), 115
   (gateways). THE THIN DASHED LINES are the alarm wiring of the I/O list: no cabinet reports its own alarm, each one is wired to a digital
   input of another group: FCS101x -> station 4 (FCS1041), FCS102x and the relay panels -> station 1 (FCS1011), FCS103x and the events
   recorder -> station 2 (FCS1022), FCS104x and the power panel -> station 3 (FCS1032), FCS1051 and the gateways -> station 4.
   THE VALUES: the 18 digital inputs, field rows of src/world/field/dcs.js (the contact types are explained there). The power panel input
   is 1 while healthy. The hardware of the cabinets is not modeled: an alarm set by the instructor shows here and stops nothing. The
   alarm and interlock relay panel inputs are also input rows 6 and 7 of DITL-42 (annunciator).
   Drawn simpler than the sheets: one engineering station; the network hubs are not drawn. */
(function () {
  const { V, D, E, L, page } = HX;
  const at = (it, x, y, o) => Object.assign(it, { x, y }, o || {});
  const NA = 168,
    NB = 184 /* the two networks */,
    Y1 = 400 /* control cabinets */,
    Y2 = 826 /* panels */,
    DXC = 130;
  const items = [],
    pipes = [],
    signals = [];
  /* one cabinet with its alarm: di = the digital input, stn / adr = where it is wired */
  const cab = (type, name, tag, di, stn, adr, x, y, o) => {
    const inv = di === 'PDP-PLOSS',
      w1 = inv ? 'NORMAL' : 'ALARM',
      w0 = inv ? 'ALARM' : 'NORMAL';
    items.push(
      at(
        E('rack', name, tag, [V('', 'fld:' + di, '', 0, { tag: di, words: [w1, w0], warn: inv ? 0 : 1 })], {
          type,
          inv,
          on: 'v:fld:' + di + '>0',
          wrap: 13,
          cname: name,
          mon: [D('System alarm, station ' + stn + ' ' + adr, di, 'fld:' + di, w1, w0)]
        }),
        x,
        y,
        Object.assign({ id: 'c' + di.split('-')[0], lab: 't' }, o || {})
      )
    );
  };
  const GROUPS = [
    {
      x: 110,
      s: 'FCS101 · Boiler control',
      stn: 4,
      y: 560,
      to: 1340,
      c: [
        ['1011', 'Boiler controller', 'I.057D'],
        ['1012', 'Signal cabinet', 'I.057E'],
        ['1013', 'Signal cabinet', 'I.057F']
      ]
    },
    {
      x: 520,
      s: 'FCS102 · Water, steam and turbine',
      stn: 1,
      y: 584,
      to: 110,
      c: [
        ['1021', 'Water and steam controller', 'I.005D'],
        ['1022', 'Signal cabinet', 'I.005E'],
        ['1023', 'Signal cabinet', 'I.005F']
      ]
    },
    {
      x: 930,
      s: 'FCS103 · Sand and ash',
      stn: 2,
      y: 608,
      to: 650,
      c: [
        ['1031', 'Sand and ash controller', 'I.093D'],
        ['1032', 'Signal cabinet', 'I.093E'],
        ['1033', 'Signal cabinet', 'I.093F']
      ]
    },
    {
      x: 1340,
      s: 'FCS104 · Burners and trip',
      stn: 3,
      y: 632,
      to: 1060,
      c: [
        ['1041', 'Burner and trip controller', 'I.069D'],
        ['1042', 'Signal cabinet', 'I.069E']
      ]
    },
    { x: 1620, s: 'FCS105 · Common', stn: 4, y: 560, c: [['1051', 'Common controller', 'I.057C']] }
  ];
  const texts = [
    { x: 60, y: 34, s: 'CONTROL ROOM', cls: 'hx-zone' },
    { x: 190, y: 160, s: 'Control network A', cls: 'hx-note' },
    { x: 190, y: 202, s: 'Control network B', cls: 'hx-note' },
    { x: 180, y: 700, s: 'PANELS AND GATEWAYS', cls: 'hx-zone' },
    { x: 335, y: 552, s: 'Alarms read by station 4', cls: 'hx-note' },
    { x: 190, y: 577, s: 'Alarms read by station 1', cls: 'hx-note' },
    { x: 742, y: 601, s: 'Alarms read by station 2', cls: 'hx-note' },
    { x: 1152, y: 625, s: 'Alarms read by station 3', cls: 'hx-note' }
  ];
  /* the panels below: [drawing, name, tag, digital input, station, address, x, y of the net that reads it, label side] */
  const PAN = [
    ['relay', 'Alarm relay panel', 'ARP1', 'ARP1-SYSERR', 1, 'I.005B', 150, 584, 'r'],
    ['relay', 'Interlock relay panel', 'IRP1', 'IRP1-POWALM', 1, 'I.005C', 420, 584, 'r'],
    ['server', 'Sequence of events recorder', 'SER1', 'SER1-SYSERR', 2, 'I.093C', 690, 608, 'r'],
    ['power', 'Power distribution panel', 'PDP1', 'PDP-PLOSS', 3, 'I.069F', 1000, 632, 'r'],
    ['gateway', 'Gateways, common', 'GCS10D / 10E', 'GCS10DE-SYSERR', 4, 'I.057A', 1360, 560, 'l'],
    ['gateway', 'Gateway of unit 1', 'GCS10F', 'GCS10F-SYSERR', 4, 'I.057B', 1620, 560, 'l']
  ];
  for (const g of GROUPS) {
    texts.push({ x: g.x - 46, y: 250, s: g.s, cls: 'hx-zone' });
    g.c.forEach(([n, name, adr], i) => {
      const x = g.x + i * DXC;
      cab(i ? 'io' : 'mpu', name, 'FCS' + n, n + '-SYSERR', g.stn, adr, x, Y1);
      if (i) pipes.push({ med: 'signal', w: 3, pts: ['c' + g.c[i - 1][0] + '.r', 'c' + n + '.l'], arrow: false });
      else {
        pipes.push({ med: 'signal', w: 2, pts: [[x - 64, NA], [x - 64, Y1 - 42], [x - 30, Y1 - 42]], arrow: false });
        pipes.push({ med: 'signal', w: 2, pts: [[x - 54, NB], [x - 54, Y1 - 32], [x - 30, Y1 - 32]], arrow: false });
      }
      signals.push({ pts: [[x - 30, Y1 + 50], [x - 46, Y1 + 50], [x - 46, g.y]], dot: [[x - 46, g.y]] });
    });
    /* the net of the station that reads the group: from its first to its last cabinet, panel and reader */
    if (g.to) {
      const rx = g.to + 64,
        all = [g.x - 46, g.x + (g.c.length - 1) * DXC - 46, rx].concat(
          PAN.filter(p => p[7] === g.y).map(p => p[6]),
          g.y === 560 ? [1574] : []
        );
      signals.push({ pts: [[Math.min(...all), g.y], [Math.max(...all), g.y]] });
      signals.push({ pts: [[rx, g.y], [rx, Y1 + 50], [g.to + 30, Y1 + 50]], dot: [[rx, g.y]] });
    }
  }
  /* operator stations and servers: on both networks */
  for (const [t, x] of [['COS1', 120], ['COS2', 345], ['COS3', 570], ['COS4', 795], ['COS5', 1020], ['CES', 1245], ['CDS', 1480]]) {
    const nm = t === 'CES' ? 'Engineering station' : t === 'CDS' ? 'Data servers' : 'Operator station ' + t.slice(3);
    items.push(at(E(t === 'CDS' ? 'server' : 'console', nm, t === 'CDS' ? 'CDS-A / B' : t, [], { wrap: 12 }), x, 84, { id: t, lab: 'r' }));
    pipes.push({ med: 'signal', w: 2, pts: [[x - 8, 108], [x - 8, NA]], arrow: false });
    pipes.push({ med: 'signal', w: 2, pts: [[x + 8, 108], [x + 8, NB]], arrow: false });
  }
  pipes.unshift(
    { med: 'signal', w: 3, pts: [[40, NA], [1724, NA], [1724, Y2 - 110], [1418, Y2 - 110]], arrow: false },
    { med: 'signal', w: 3, pts: [[40, NB], [1712, NB], [1712, Y2 - 98], [1410, Y2 - 98]], arrow: false }
  );
  for (const [ty, name, tag, di, stn, adr, x, net, lab] of PAN) {
    cab(ty, name, tag, di, stn, adr, x, Y2, { lab, yn: lab === 'l' ? [-52, -69] : null });
    signals.push({ pts: [[x, Y2 - 68], [x, net]], dot: [[x, net]] });
    if (ty === 'gateway') {
      /* both networks come down at the right of the cabinet */
      pipes.push({ med: 'signal', w: 2, pts: [[x + 58, Y2 - 110], [x + 58, Y2 - 40], [x + 30, Y2 - 40]], arrow: false });
      pipes.push({ med: 'signal', w: 2, pts: [[x + 50, Y2 - 98], [x + 50, Y2 - 28], [x + 30, Y2 - 28]], arrow: false });
    }
  }
  page({
    id: 'control-system',
    group: 'Unit',
    title: 'Control system',
    about:
      'The control cabinets, panels and gateways of unit 1 and their system alarms (K1AU3-E2-0-106). The dashed lines show the station that reads each alarm.',
    plan: {
      look: 'real',
      w: 1760,
      h: 1000,
      items: items.concat([at(L('purge-trip', 'Relay panel signals'), 480, 940, { id: 'lpt' })]),
      pipes: pipes.concat([
        { med: 'power', w: 4, pts: [[980, 958], [980, Y2 + 68]] },
        { med: 'power', w: 4, pts: [[1020, 958], [1020, Y2 + 68]] }
      ]),
      signals,
      texts: texts.concat([
        { x: 830, y: 960, s: 'AC 110 V from UPS 1-1', cls: 'hx-note' },
        { x: 1034, y: 960, s: 'AC 110 V from UPS 1-2', cls: 'hx-note' }
      ])
    }
  });
})();
