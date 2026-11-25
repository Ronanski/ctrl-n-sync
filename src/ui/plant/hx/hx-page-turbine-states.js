/* HX page: the turbine states the turbine control system (TCS) sends the DCS over Modbus (lane 7 MINAMI, OPLAN KABIT, 2026-11-25; list of
   lane 2 TSUBASA /mnt/project-files/lanes/tcs-io/modbus-where-used.md "For MINAMI", sections B and D, digital bits).
   THE SOURCE: "LMYP-1 #1 MODBUS Communication list between DCS and turbine system.xls", sheet PLC to DCS (src/data/tcs-dcs.json modbus[]),
   STN102 words SI1000 ~ SI1004, one bit each (Modbus 10001 ~ 10080). SI1000 ~ 1004 bit 0 carry an MMI address (MMI0001 ~ 0005) in the
   plant lists; the others are display only. A bit with an instrument tag is named by it, the others by the word and bit ('SI1002.7').
   THE PICTURE: the automatic turbine start-up program as a table, one row a step (steps 0 ~ 8 of the Modbus list: HP warming ... shut down),
   its four bits selected / executed / completed / mode; then the field contacts of the oil system, the master trip solenoids, the
   non-return valves and the gland seal. The buttons of the DCS to the TCS (WM0210) are on the Turbine page, not here.
   THE VALUE: the TCS I/O end of that Modbus row (src/ui/plant/plant.js resolve k 'mb' -> TCE_IO_LIVE.mbRead); '-----' while it has none. */
(function () {
  const { L, page } = HX;
  const B = HX.B;
  const at = (it, x, y, o) => Object.assign(it, { x, y }, o || {});
  const di = (tag, on, off) => 'data-di="' + tag + '|' + on + '|' + off + '"';
  const ATS = [
    ['High pressure turbine warming', 'SI1002.7', 'SI1003.0', 'SI1003.9', 'SI1004.5'],
    ['Turbine preparation', 'SI1002.8', 'SI1003.1', 'SI1003.10', 'SI1004.6'],
    ['Turbine rub check', 'SI1002.9', 'SI1003.2', 'SI1003.11', 'SI1004.7'],
    ['Acceleration', 'SI1002.10', 'SI1003.3', 'SI1003.12', 'SI1004.8'],
    ['Excitation', 'SI1002.11', 'SI1003.4', 'SI1003.13', 'SI1004.9'],
    ['Synchronizing and initial load', 'SI1002.12', 'SI1003.5', 'SI1003.14', 'SI1004.10'],
    ['Load up', 'SI1002.13', 'SI1003.6', 'SI1003.15', 'SI1004.11'],
    ['Normal operation', 'SI1002.14', 'SI1003.7', 'SI1004.0', 'SI1004.12'],
    ['Turbine shut down', 'SI1002.15', 'SI1003.8', 'SI1004.1', 'SI1004.13']
  ];
  const GROUPS = [
    ['Oil system and turning gear', [
      ['Bearing oil pressure (starts emergency pump)', 'PS-LO1004', 'LOW', 'NORMAL'],
      ['Lube oil coalescer filter differential pressure high', 'DPIS-LO1942', 'ALARM', 'NORMAL'],
      ['Control oil line filter A differential pressure high', 'DPIS-LO1933-A', 'ALARM', 'NORMAL'],
      ['Control oil line filter B differential pressure high', 'DPIS-LO1933-B', 'ALARM', 'NORMAL'],
      ['Duplex oil filter differential pressure', 'DPIS-LO1932', 'ALARM', 'NORMAL'],
      ['Main oil tank level low', 'LSL-LO1920-1', 'ALARM', 'NORMAL'],
      ['Main oil tank level high', 'LSH-LO1920-2', 'ALARM', 'NORMAL'],
      ['Generator water and oil leakage level high', 'LSH-GE1001', 'ALARM', 'NORMAL'],
      ['Hand turning interlock', 'ZS-LO1003', 'ON', 'OFF'],
      ['Turning gear engage', 'ZS-LO1906-1', 'YES', 'NO'],
      ['Turning gear disengage', 'ZS-LO1906-2', 'YES', 'NO']
    ]],
    ['Master trip solenoids', [
      ['Master trip solenoid A1 trip', 'ZS-ST1001-1', 'TRIP', 'NORMAL'],
      ['Master trip solenoid A2 trip', 'ZS-ST1001-2', 'TRIP', 'NORMAL'],
      ['Master trip solenoid B1 trip', 'ZS-ST1001-3', 'TRIP', 'NORMAL'],
      ['Master trip solenoid B2 trip', 'ZS-ST1001-4', 'TRIP', 'NORMAL']
    ]],
    ['Non-return valves (extraction, cold reheat)', [
      ['No. 5 extraction non-return valve, full open', 'ZSO-TS1730', 'OPEN', 'NOT OPEN'],
      ['Cold reheat non-return valve, full closed', 'ZSC-CR1901', 'CLOSED', 'NOT CLOSED'],
      ['Cold reheat non-return valve, full open', 'ZSO-CR1901', 'OPEN', 'NOT OPEN'],
      ['Ventilator valve, full closed', 'ZSC-CR1902', 'CLOSED', 'NOT CLOSED'],
      ['Ventilator valve, full open', 'ZSO-CR1902', 'OPEN', 'NOT OPEN'],
      ['No. 2 extraction non-return valve, full closed', 'ZSC-TS1700', 'CLOSED', 'NOT CLOSED'],
      ['No. 2 extraction non-return valve, full open', 'ZSO-TS1700', 'OPEN', 'NOT OPEN'],
      ['No. 3 extraction primary non-return valve, full closed', 'ZSC-TS1710', 'CLOSED', 'NOT CLOSED'],
      ['No. 3 extraction primary non-return valve, full open', 'ZSO-TS1710', 'OPEN', 'NOT OPEN'],
      ['No. 4 extraction non-return valve, full closed', 'ZSC-TS1720', 'CLOSED', 'NOT CLOSED'],
      ['No. 4 extraction non-return valve, full open', 'ZSO-TS1720', 'OPEN', 'NOT OPEN'],
      ['No. 5 extraction non-return valve, full closed', 'ZSC-TS1730', 'CLOSED', 'NOT CLOSED'],
      ['No. 3 extraction secondary non-return valve, full closed', 'ZSC-TS1740', 'CLOSED', 'NOT CLOSED'],
      ['No. 3 extraction secondary non-return valve, full open', 'ZSO-TS1740', 'OPEN', 'NOT OPEN']
    ]],
    ['Gland seal and exhaust hood spray', [
      ['Steam seal diverting valve, to condenser side', 'ZSC-GS1017', 'YES', 'NO'],
      ['Steam seal feed valve bypass valve, full closed', 'ZSC-GS1032', 'CLOSED', 'NOT CLOSED'],
      ['Steam seal diverting valve, to heater side, full open', 'ZSO-GS1018', 'YES', 'NO'],
      ['Exhaust hood spray valve, full closed', 'ZSC-CD1904', 'CLOSED', 'NOT CLOSED'],
      ['Exhaust hood spray valve, full open', 'ZSO-CD1904', 'OPEN', 'NOT OPEN'],
      ['Steam seal feed valve, full closed', 'ZSC-GS1031', 'CLOSED', 'NOT CLOSED'],
      ['Blowdown valve, full open', 'ZSO-GS1039', 'OPEN', 'NOT OPEN'],
      ['Blowdown valve, full closed', 'ZSC-GS1039', 'CLOSED', 'NOT CLOSED']
    ]],
    ['Start-up program: other states', [
      ['Turbine gland seal start group control complete', 'SI1002.5', 'COMPLETE', 'NO'],
      ['Turbine gland seal stop group control complete', 'SI1002.6', 'COMPLETE', 'NO'],
      ['Criteria unsatisfied', 'SI1004.2', 'UNSATISFIED', 'SATISFIED'],
      ['Alive signal', 'SI1004.3', 'ON', 'OFF'],
      ['Automatic turbine start-up AUTO ON', 'SI1004.4', 'ON', 'OFF'],
      ['Governor operation', 'SI1004.14', 'ON', 'OFF'],
      ['Load limiter operation', 'SI1004.15', 'ON', 'OFF']
    ]]
  ];
  const items = [],
    texts = [];
  /* the start-up program: step name, then four boxes */
  const AX = 250,
    AW = 100,
    AY = 120,
    AR = 42;
  texts.push({ x: 20, y: AY - 36, s: 'AUTOMATIC TURBINE START-UP PROGRAM, BY STEP', cls: 'hx-lab' });
  ATS.forEach(([name, ...bits], i) => {
    const y = AY + i * AR;
    texts.push({ x: 20, y: y + 4, s: 'Step ' + i + ': ' + name, cls: 'hx-lab' });
    bits.forEach((k, j) =>
      items.push(at(B(['Selected', 'Executed', 'Completed', 'Mode'][j], di(k, j === 3 ? 'ON' : 'YES', j === 3 ? 'OFF' : 'NO'), { w: AW }), AX + AW / 2 + j * (AW + 8), y, { id: 'a' + i + 'b' + j }))
    );
  });
  /* the other groups: boxes of 300 in columns */
  const W = 320,
    ROW = 44;
  const place = (g, x, y0, tag) => {
    const [head, rows] = GROUPS.find(q => q[0] === g);
    texts.push({ x: x - W / 2, y: y0 - 30, s: head.toUpperCase(), cls: 'hx-lab' });
    rows.forEach(([name, key, on, off], k) => items.push(at(B(name, di(key, on, off), { w: W }), x, y0 + k * ROW, { id: tag + k })));
    return y0 + rows.length * ROW + 50;
  };
  place('Start-up program: other states', 200, AY + 9 * AR + 54, 'p');
  let y = place('Oil system and turning gear', 900, 120, 'o');
  place('Master trip solenoids', 900, y, 't');
  place('Non-return valves (extraction, cold reheat)', 1240, 120, 'n');
  place('Gland seal and exhaust hood spray', 1580, 120, 'g');
  items.push(at(L('turbine', 'Turbine'), 1400, 40, { id: 'tl' }), at(L('turbine-readings', 'Turbine readings'), 1600, 40, { id: 'rl' }));
  page({
    id: 'turbine-states',
    group: 'Turbine and generator',
    title: 'Turbine states from the turbine control',
    about:
      'The 80 digital bits the turbine control system sends the DCS over Modbus: the automatic start-up program step by step (selected, executed, completed, mode), governor and load limiter, the oil system contacts and turning gear, the master trip solenoids, the non-return valves and the gland seal valves. Source: Modbus list DCS / turbine (PLC to DCS) SI1000 ~ SI1004.',
    plan: { look: 'real', w: 1760, h: 1000, items, pipes: [], texts }
  });
})();
