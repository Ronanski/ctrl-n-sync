/* HX page: the operator push buttons and lamps of the turbine control system (TCS) for its oil pumps and motors (lane 7, user 2026-11-25
   "Gawan ng controls ... ilink ang permissives, logic, interlock, may addresses din ang HMI kung saan mag iisang galaw ang logic at HMI").
   THE SOURCE: the macro MOTOR STANDARD of the TCE / TCA sheets (lane 1 MARIA, beta.561: MHPS TYPICAL LOGIC FOR MOTOR, Interlock Block
   Diagram 310SC90-794 Rev 2 sheet 14, "Turbine Control System (book)" p 30). Its push buttons START / STOP / AUTO / MANUAL / RESET are
   inside the macro: the CRT port of each block is "CRT:<sheet>.<block>.<button>" (src/digital/tce-run.js). Its lamps are the outputs of
   the block on the sheet (src/digital/tce/<sheet>.js, the R pins): RUN (R lamp, the MCC answer), STP (G lamp), ABN (any fault: electrical
   trouble, start fault, stop fault, tripped), AUTO (W lamp) where the sheet draws that pin.
     TCE300 MAIN OIL PUMP (331DM09784 p 154): B007 nP-n922A (A), B021 nP-n922B (B)
     TCE305 CONTROL OIL PUMP (p 155): B031 nP-n931A (A), B021 nP-n931B (B)
     TCE310 EMERGENCY OIL PUMP (p 156): B006 nP-n923
     TCA655 MAIN OIL TANK VAPOUR EXTRACTOR (331DM09788 p 165): nF-n937
     TCA680 GLAND STEAM EXHAUSTER (TC-28, p 166)
     TCA700 OIL PURIFIER PUMP (p 170): nP-n941
   A button presses its port in the running TCS program (window.TCE); a lamp reads the block output. While the program is not running
   both show '-----' (hx-app.js 'crt:' / 'crtl:' hooks). */
(function () {
  const { L, page } = HX;
  const B = HX.B;
  const at = (it, x, y, o) => Object.assign(it, { x, y }, o || {});
  /* t = title, s = sheet, k = block key, auto = the sheet draws the AUTO pin (W lamp) */
  const MOTORS = [
    { t: 'Main oil pump A (P-1922A)', s: 'TCE300', k: 'b007' },
    { t: 'Main oil pump B (P-1922B)', s: 'TCE300', k: 'b021' },
    { t: 'Control oil pump A (P-1931A)', s: 'TCE305', k: 'b031' },
    { t: 'Control oil pump B (P-1931B)', s: 'TCE305', k: 'b021' },
    { t: 'Emergency oil pump (P-1923)', s: 'TCE310', k: 'b006' },
    { t: 'Main oil tank vapour extractor (F-1937)', s: 'TCA655', k: 'mtr' },
    { t: 'Gland steam exhauster (TC-28)', s: 'TCA680', k: 'mtr', auto: true },
    { t: 'Oil purifier pump (P-1941)', s: 'TCA700', k: 'mtr' }
  ];
  const PB = [
    ['Start', 'START'],
    ['Stop', 'STOP'],
    ['Reset', 'RESET'],
    ['Auto', 'AUTO'],
    ['Manual', 'MANUAL']
  ];
  /* layout: four columns, two rows of cards; three boxes a row */
  const CW = 415,
    X0 = 22,
    Y0 = 90,
    BW = 132,
    RH = 40,
    CH = 230;
  const items = [],
    texts = [];
  MOTORS.forEach((m, n) => {
    const left = X0 + (n % 4) * (CW + 20);
    let y = Y0 + Math.floor(n / 4) * CH;
    texts.push({ x: left + 2, y, s: m.t, anchor: 'start' });
    y += 26;
    const put = (list, f, tag) => {
      list.forEach((e, i) =>
        items.push(at(f(e), left + BW / 2 + (i % 3) * (BW + 9), y + Math.floor(i / 3) * RH, { id: 'm' + n + tag + i }))
      );
      y += Math.ceil(list.length / 3) * RH;
    };
    put(PB, e => B(e[0], 'crt:CRT:' + m.s + '.' + m.k + '.' + e[1], { press: true, w: BW }), 'b');
    const lamps = [
      ['Running', 'RUN'],
      ['Stopped', 'STP'],
      ['Fault', 'ABN']
    ].concat(m.auto ? [['Auto', 'AUTO']] : []);
    put(lamps, e => B(e[0], 'crtl:' + m.s + '|' + m.k + '.' + e[1], { w: BW }), 'l');
  });
  items.push(at(L('turbine-oil', 'Turbine oil'), 1600, 40, { id: 'tol' }));
  items.push(at(L('aux-steam', 'Auxiliary steam'), 1380, 40, { id: 'asl' }));
  page({
    id: 'turbine-motors',
    group: 'Turbine and generator',
    title: 'Turbine oil pumps and motors',
    about:
      'The operator push buttons and lamps of the turbine control system for its motors: main, control and emergency oil pumps, vapour extractor, gland steam exhauster, oil purifier. Start / Stop in manual, Auto / Manual, Reset of a fault; lamps running, stopped, fault. Source: TCS sheets TCE300, TCE305, TCE310, TCA655, TCA680, TCA700 (MOTOR STANDARD, IBD 310SC90-794 sheet 14).',
    plan: { look: 'real', w: 1760, h: 1000, items, pipes: [], texts }
  });
})();
