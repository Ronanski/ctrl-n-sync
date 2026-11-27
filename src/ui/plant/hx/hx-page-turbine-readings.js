/* HX page: the turbine readings the turbine control system (TCS) sends the DCS over Modbus (lane 7 MINAMI, OPLAN KABIT, 2026-11-25; list of
   lane 2 TSUBASA /mnt/project-files/lanes/tcs-io/modbus-where-used.md "For MINAMI", sections A and D, analog words).
   THE SOURCE: "LMYP-1 #1 MODBUS Communication list between DCS and turbine system.xls", sheet PLC to DCS (src/data/tcs-dcs.json modbus[]),
   STN102 words SI1100 ~ SI1245. A word with a DCS indicator loop of the STN102 loop list (type 21, PV SI17xx; src/ui/plant/dcslists.js)
   shows that loop tag, its unit is the loop's. A word with no loop (valve positions ZT, first stage pressure PT-ST1001, metal TE-ST1001-1
   / 1004, power factor) has the unit of its instrument letter (ZT = %, TE = °C, PT = kg/cm²): the list gives no range for them.
   THE VALUE: the TCS I/O end of that Modbus row (src/ui/plant/plant.js resolve k 'mb' -> TCE_IO_LIVE.mbRead), the same value the TCS
   program is fed with. A row whose end has no value yet reads '-----'. No sheet of the DCS reads these words: display only.
   Rows: [label, instrument tag (or the word), loop tag, unit, decimals]. */
(function () {
  const { L, page } = HX;
  const at = (it, x, y, o) => Object.assign(it, { x, y }, o || {});
  const GROUPS = [
      ['Steam pressure and temperature', [
        ['High pressure exhaust steam pressure A', 'PT-CR1901-1', 'PICR19011', 'kg/cm²', 2],
        ['High pressure exhaust steam pressure B', 'PT-CR1901-2', 'PICR19012', 'kg/cm²', 2],
        ['High pressure exhaust steam pressure C', 'PT-CR1901-3', 'PICR19013', 'kg/cm²', 2],
        ['Gland steam seal header pressure A', 'PT-GS1001-1', 'PIGS10011', 'kg/cm²', 2],
        ['Gland steam seal header pressure B', 'PT-GS1001-2', 'PIGS10012', 'kg/cm²', 2],
        ['Hot reheat steam pressure', 'PT-HR1901', 'PIHR1901', 'kg/cm²', 1],
        ['Main stop valve inlet steam pressure A', 'PT-MS1901-1', 'PIMS19011', 'kg/cm²', 1],
        ['Main stop valve inlet steam pressure B', 'PT-MS1901-2', 'PIMS19012', 'kg/cm²', 1],
        ['Reheat bowl steam pressure A', 'PT-ST1002-1', 'PIST10021', 'kg/cm²', 1],
        ['Reheat bowl steam pressure B', 'PT-ST1002-2', 'PIST10022', 'kg/cm²', 1],
        ['Reheat bowl steam pressure C', 'PT-ST1002-3', 'PIST10023', 'kg/cm²', 1],
        ['Low pressure exhaust hood pressure (vacuum) A', 'PT-ST1110-1', 'PIST11101', 'kg/cm²A', 2],
        ['Low pressure exhaust hood pressure (vacuum) B', 'PT-ST1110-2', 'PIST11102', 'kg/cm²A', 2],
        ['Low pressure exhaust hood pressure (vacuum) C', 'PT-ST1110-3', 'PIST11103', 'kg/cm²A', 2],
        ['Gland steam seal header temperature', 'TE-GS1002', 'TIGS1002', '°C', 0],
        ['Gland steam seal low pressure inlet temperature', 'TE-GS1003', 'TIGS1003', '°C', 0],
        ['Hot reheat steam temperature', 'TE-HR1902', 'TIHR1902', '°C', 0],
        ['Main stop valve inlet steam temperature A', 'TE-MS1902-1', 'TIMS19021', '°C', 0],
        ['Main stop valve inlet steam temperature B', 'TE-MS1902-2', 'TIMS19022', '°C', 0],
        ['Main stop valve inlet steam temperature C', 'TE-MS1902-3', 'TIMS19023', '°C', 0],
        ['Main stop valve inlet steam temperature D', 'TE-MS1902-4', 'TIMS19024', '°C', 0],
        ['High pressure exhaust steam temperature A', 'TE-ST1003-1', 'TIST10031', '°C', 0],
        ['High pressure exhaust steam temperature B', 'TE-ST1003-2', 'TIST10032', '°C', 0],
        ['High pressure exhaust steam temperature C', 'TE-ST1003-3', 'TIST10033', '°C', 0],
        ['Low pressure extraction steam temperature', 'TE-ST1008', 'TIST1008', '°C', 0],
        ['Low pressure exhaust hood steam temperature A', 'TE-ST1110-1', 'TIST11101', '°C', 0],
        ['Low pressure exhaust hood steam temperature B', 'TE-ST1110-2', 'TIST11102', '°C', 0],
        ['Low pressure exhaust hood steam temperature C', 'TE-ST1110-3', 'TIST11103', '°C', 0],
        ['High pressure first stage steam pressure A', 'PT-ST1001-1', '', 'kg/cm²', 1],
        ['High pressure first stage steam pressure B', 'PT-ST1001-2', '', 'kg/cm²', 1],
        ['High pressure first stage steam pressure C', 'PT-ST1001-3', '', 'kg/cm²', 1]
      ]],
      ['Turbine metal temperature', [
        ['High pressure first stage outer wall', 'TE-ST1001-2', 'TIST10012', '°C', 0],
        ['High pressure exhaust inner wall upper', 'TE-ST1002-1', 'TIST10021', '°C', 0],
        ['High pressure exhaust inner wall lower', 'TE-ST1002-2', 'TIST10022', '°C', 0],
        ['Reheat bowl outer', 'TE-ST1005', 'TIST1005', '°C', 0],
        ['Intermediate pressure after stage 15 inner wall upper', 'TE-ST1006-1', 'TIST10061', '°C', 0],
        ['Intermediate pressure after stage 15 inner wall lower', 'TE-ST1006-2', 'TIST10062', '°C', 0],
        ['Intermediate pressure after stage 18 inner wall upper', 'TE-ST1007-1', 'TIST10071', '°C', 0],
        ['Intermediate pressure after stage 18 inner wall lower', 'TE-ST1007-2', 'TIST10072', '°C', 0],
        ['Main stop valve B inner wall', 'TE-ST1903-B1', 'TIST1903B1', '°C', 0],
        ['Main stop valve B outer wall', 'TE-ST1903-B2', 'TIST1903B2', '°C', 0],
        ['Control valve B inner wall', 'TE-ST1904-B1', 'TIST1904B1', '°C', 0],
        ['Control valve B outer wall', 'TE-ST1904-B2', 'TIST1904B2', '°C', 0],
        ['High pressure first stage inner wall', 'TE-ST1001-1', '', '°C', 0],
        ['Reheat bowl inner wall A', 'TE-ST1004-1', '', '°C', 0],
        ['Reheat bowl inner wall B', 'TE-ST1004-2', '', '°C', 0]
      ]],
      ['Shaft: speed, vibration, expansion', [
        ['Turbine shell expansion (High pressure Side)', 'ZE-ST1001', 'ZIST1001', 'mm', 2],
        ['High pressure differential expansion A', 'ZE-ST1002-1', 'ZIST10021', 'mm', 2],
        ['High pressure differential expansion B', 'ZE-ST1002-2', 'ZIST10022', 'mm', 2],
        ['Turbine rotor position A', 'ZE-ST1003-1', 'ZIST10031', 'mm', 2],
        ['Turbine rotor position B', 'ZE-ST1003-2', 'ZIST10032', 'mm', 2],
        ['Turbine rotor position C', 'ZE-ST1003-3', 'ZIST10033', 'mm', 2],
        ['Low speed eccentricity detector', 'ZE-ST1004', 'ZIST1004', 'mm', 2],
        ['No. 1 turbine shaft vibration X', 'VE-ST1001-1', 'VIST10011', 'mm', 2],
        ['No. 1 turbine shaft vibration Y', 'VE-ST1001-2', 'VIST10012', 'mm', 2],
        ['No. 2 turbine shaft vibration X', 'VE-ST1002-1', 'VIST10021', 'mm', 2],
        ['No. 2 turbine shaft vibration Y', 'VE-ST1002-2', 'VIST10022', 'mm', 2],
        ['No. 3 generator shaft vibration X', 'VE-GE1001-1', 'VIGE10011', 'mm', 2],
        ['No. 3 generator shaft vibration Y', 'VE-GE1001-2', 'VIGE10012', 'mm', 2],
        ['No. 4 generator shaft vibration X', 'VE-GE1002-1', 'VIGE10021', 'mm', 2],
        ['No. 4 generator shaft vibration Y', 'VE-GE1002-2', 'VIGE10022', 'mm', 2],
        ['Turbine speed 1A', 'SE-ST1001-1', 'SIST10011', 'rpm', 0],
        ['Turbine speed 1B', 'SE-ST1001-2', 'SIST10012', 'rpm', 0],
        ['Turbine speed 1C', 'SE-ST1001-3', 'SIST10013', 'rpm', 0]
      ]],
      ['Oil and bearings', [
        ['Bearing oil pressure A', 'PT-LO1003-1', 'PILO10031', 'kg/cm²', 2],
        ['Bearing oil pressure B', 'PT-LO1003-2', 'PILO10032', 'kg/cm²', 2],
        ['Bearing oil pressure C', 'PT-LO1003-3', 'PILO10033', 'kg/cm²', 2],
        ['Control oil pressure A', 'PT-LO1006-1', 'PILO10061', 'kg/cm²', 2],
        ['Control oil pressure B', 'PT-LO1006-2', 'PILO10062', 'kg/cm²', 2],
        ['Control oil pressure C', 'PT-LO1006-3', 'PILO10063', 'kg/cm²', 2],
        ['Turbine trip oil pressure A', 'PT-LO1007-1', 'PILO10071', 'kg/cm²', 2],
        ['Turbine trip oil pressure B', 'PT-LO1007-2', 'PILO10072', 'kg/cm²', 2],
        ['Turbine trip oil pressure C', 'PT-LO1007-3', 'PILO10073', 'kg/cm²', 2],
        ['Main oil pump A discharge pressure (starts pump B)', 'PT-LO1922-A', 'PILO1922A', 'kg/cm²', 2],
        ['Main oil pump B discharge pressure (starts pump A)', 'PT-LO1922-B', 'PILO1922B', 'kg/cm²', 2],
        ['Emergency oil pump discharge pressure', 'PT-LO1923', 'PILO1923', 'kg/cm²', 2],
        ['Control oil pump A discharge pressure (starts pump B)', 'PT-LO1931-A', 'PILO1931A', 'kg/cm²', 2],
        ['Control oil pump B discharge pressure (starts pump A)', 'PT-LO1931-B', 'PILO1931B', 'kg/cm²', 2],
        ['Lube oil cooler inlet oil temperature', 'TE-LO1001', 'TILO1001', '°C', 0],
        ['Thrust bearing Front-End A', 'TE-ST1011-1', 'TIST10111', '°C', 0],
        ['Thrust bearing Front-End B', 'TE-ST1011-2', 'TIST10112', '°C', 0],
        ['Thrust bearing Rear-End A', 'TE-ST1012-1', 'TIST10121', '°C', 0],
        ['Thrust bearing Rear-End B', 'TE-ST1012-2', 'TIST10122', '°C', 0],
        ['No. 1 turbine journal bearing', 'TE-ST1009', 'TIST1009', '°C', 0],
        ['No. 2 turbine journal bearing', 'TE-ST1010', 'TIST1010', '°C', 0],
        ['No. 3 bearing', 'TE-GE1001', 'TIGE1001', '°C', 0],
        ['No. 4 bearing', 'TE-GE1002', 'TIGE1002', '°C', 0],
        ['No. 3 bearing outlet oil temperature', 'TE-GE1007', 'TIGE1007', '°C', 0],
        ['No. 4 bearing outlet oil temperature', 'TE-GE1008', 'TIGE1008', '°C', 0],
        ['Lube oil cooler outlet oil temperature A', 'TE-LO1002-1', 'TILO10021A', '°C', 0],
        ['Lube oil cooler outlet oil temperature B', 'TE-LO1002-2', 'TILO10022B', '°C', 0]
      ]],
      ['Generator', [
        ['Cooling gas, air cooler outlet A', 'TE-GE1004-1', 'TIGE10041', '°C', 0],
        ['Cooling gas, air cooler outlet B', 'TE-GE1004-2', 'TIGE10042', '°C', 0],
        ['Cooling gas, air cooler outlet C', 'TE-GE1004-3', 'TIGE10043', '°C', 0],
        ['Cooling gas, air cooler outlet D', 'TE-GE1004-4', 'TIGE10044', '°C', 0],
        ['AC exciter outlet air temperature', 'TE-GE1005', 'TIGE1005', '°C', 0],
        ['Stator coil temperature A', 'TE-GE1006-1', 'TIGE10061', '°C', 0],
        ['Stator coil temperature B', 'TE-GE1006-2', 'TIGE10062', '°C', 0],
        ['Stator coil temperature C', 'TE-GE1006-3', 'TIGE10063', '°C', 0],
        ['Stator coil temperature D', 'TE-GE1006-4', 'TIGE10064', '°C', 0],
        ['Stator coil temperature E', 'TE-GE1006-5', 'TIGE10065', '°C', 0],
        ['Stator coil temperature F', 'TE-GE1006-6', 'TIGE10066', '°C', 0],
        ['MW A', 'SI1230', 'GEN-MW-A', 'MW', 1],
        ['MW B', 'SI1231', 'GEN-MW-B', 'MW', 1],
        ['Reactive power', 'SI1232', 'GEN-VAR', 'MVar', 1],
        ['Voltage A', 'SI1233', 'GEN-VOLT-A', 'kV', 2],
        ['Voltage B', 'SI1234', 'GEN-VOLT-B', 'kV', 2],
        ['Voltage C', 'SI1235', 'GEN-VOLT-C', 'kV', 2],
        ['Current A', 'SI1236', 'GEN-CURR-A', 'kA', 2],
        ['Current B', 'SI1237', 'GEN-CURR-B', 'kA', 2],
        ['Current C', 'SI1238', 'GEN-CURR-C', 'kA', 2],
        ['Frequency', 'SI1239', 'GEN-FREQU', 'Hz', 2],
        ['Field voltage', 'SI1243', 'GEN-FV', 'V DC', 0],
        ['Field current', 'SI1245', 'GEN-FC', 'A', 0],
        ['Power factor', 'SI1240', '', '', 3]
      ]],
      ['Valve position', [
        ['Steam seal feed valve position', 'ZT-GS1031', '', '%', 0],
        ['Steam packing unloading valve position', 'ZT-GS1034', '', '%', 0],
        ['Control valve B below seat warming drain valve position', 'ZT-ST1008', '', '%', 0],
        ['Main stop valve A position A', 'ZT-ST1903-A1', '', '%', 0],
        ['Main stop valve A position B', 'ZT-ST1903-A2', '', '%', 0],
        ['Main stop valve A position C', 'ZT-ST1903-A3', '', '%', 0],
        ['Main stop valve B position A', 'ZT-ST1903-B1', '', '%', 0],
        ['Main stop valve B position B', 'ZT-ST1903-B2', '', '%', 0],
        ['Main stop valve B position C', 'ZT-ST1903-B3', '', '%', 0],
        ['Control valve A position A', 'ZT-ST1904-A1', '', '%', 0],
        ['Control valve A position B', 'ZT-ST1904-A2', '', '%', 0],
        ['Control valve A position C', 'ZT-ST1904-A3', '', '%', 0],
        ['Control valve B position A', 'ZT-ST1904-B1', '', '%', 0],
        ['Control valve B position B', 'ZT-ST1904-B2', '', '%', 0],
        ['Control valve B position C', 'ZT-ST1904-B3', '', '%', 0],
        ['Reheat stop valve A position A', 'ZT-ST1905-A1', '', '%', 0],
        ['Reheat stop valve A position B', 'ZT-ST1905-A2', '', '%', 0],
        ['Reheat stop valve A position C', 'ZT-ST1905-A3', '', '%', 0],
        ['Intercept valve A position A', 'ZT-ST1905-A4', '', '%', 0],
        ['Intercept valve A position B', 'ZT-ST1905-A5', '', '%', 0],
        ['Intercept valve A position C', 'ZT-ST1905-A6', '', '%', 0],
        ['Reheat stop valve B position A', 'ZT-ST1905-B1', '', '%', 0],
        ['Reheat stop valve B position B', 'ZT-ST1905-B2', '', '%', 0],
        ['Reheat stop valve B position C', 'ZT-ST1905-B3', '', '%', 0],
        ['Intercept valve B position A', 'ZT-ST1905-B4', '', '%', 0],
        ['Intercept valve B position B', 'ZT-ST1905-B5', '', '%', 0],
        ['Intercept valve B position C', 'ZT-ST1905-B6', '', '%', 0],
        ['High pressure warming valve position', 'ZT-AS1011', '', '%', 0]
      ]]
  ];
  /* three columns of 580: label, loop tag, value at the right end. Groups by column */
  const COL = [['Steam pressure and temperature', 'Turbine metal temperature'], ['Shaft: speed, vibration, expansion', 'Oil and bearings'], ['Generator', 'Valve position']];
  const CW = 580,
    X0 = 14,
    TOP = 92,
    RH = 17.6;
  const texts = [];
  COL.forEach((names, c) => {
    const x = X0 + c * CW;
    let y = TOP;
    for (const n of names) {
      const g = GROUPS.find(q => q[0] === n);
      texts.push({ x, y, s: n.toUpperCase(), cls: 'hx-lab' });
      y += RH + 2;
      for (const [label, key, loop, unit, dp] of g[1]) {
        texts.push({ x: x + 4, y, s: label, cls: 'hx-note' });
        if (loop) texts.push({ x: x + 400, y, s: loop, cls: 'hx-tag' });
        texts.push({ x: x + CW - 14, y, s: '', key, unit, dp, anchor: 'end' });
        y += RH;
      }
      y += 12;
    }
  });
  const items = [
    at(L('turbine', 'Turbine'), 1380, 40, { id: 'tl' }),
    at(L('turbine-states', 'Turbine states'), 1560, 40, { id: 'sl' }),
    at(L('generator', 'Generator'), 1200, 40, { id: 'gl' })
  ];
  page({
    id: 'turbine-readings',
    group: 'Turbine and generator',
    title: 'Turbine readings from the turbine control',
    about:
      'The 143 analog words the turbine control system sends the DCS over Modbus: steam pressures and temperatures, metal temperatures, shaft speed, vibration and expansion, oil and bearings, generator, valve positions. Each shows its DCS indicator loop where the loop list has one. Source: Modbus list DCS / turbine (PLC to DCS), STN102 loop list.',
    plan: { look: 'real', w: 1760, h: 1080, items, pipes: [], texts },
    /* trend groups (Phase 9, 2026-11-27): every pen is a value or a controller already on this page (its source is in the
       comments above); at most 8 pens a group (Phase 10 trend recorder) */
    trends: [
      {
        title: 'Turbine pressures',
        pens: [
          ['Main steam', 'PT-MS1901-1', 'kg/cm²'],
          ['First stage', 'PT-ST1001-1', 'kg/cm²'],
          ['Cold reheat', 'PT-CR1901-1', 'kg/cm²'],
          ['Hot reheat', 'PT-HR1901', 'kg/cm²'],
          ['Exhaust hood', 'PT-ST1110-1', 'kg/cm² abs', 3]
        ]
      },
      {
        title: 'Turbine temperatures',
        pens: [
          ['Main steam', 'TE-MS1902-1', '°C', 0],
          ['Hot reheat', 'TE-HR1902', '°C', 0],
          ['Cold reheat', 'TE-ST1003-1', '°C', 0],
          ['Exhaust hood', 'TE-ST1110-1', '°C'],
          ['Gland steam', 'TE-GS1002', '°C', 0]
        ]
      },
      {
        title: 'Speed, vibration and expansion',
        pens: [
          ['Speed 1', 'SE-ST1001-1', 'rpm', 0],
          ['Bearing 1 vibration', 'VE-ST1001-1', 'mm', 3],
          ['Bearing 2 vibration', 'VE-ST1002-1', 'mm', 3],
          ['Bearing 3 vibration', 'VE-GE1001-1', 'mm', 3],
          ['Bearing 4 vibration', 'VE-GE1002-1', 'mm', 3],
          ['Shell expansion', 'ZE-ST1001', 'mm', 2]
        ]
      }
    ]
  });
})();
