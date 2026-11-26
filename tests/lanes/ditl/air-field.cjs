/* Phase 6 DITL (lane 1, 2026-11-26): the field rows of src/world/field/ditl.js. DITL-42 COMPRESSOR RUNNING = the run state of the air model
   (unit.js anAirStep U.paR / U.iaR); DITL-45 (A / #B / #C) DRYER REMOTE = 1 and PLANT AIR DRYER ALARM = 0 in service, the sootblower trips and the APH sootblower LOCAL = 0 (field states, normal).
   Usage: node tests/lanes/ditl/air-field.cjs */
const path = require('path');
const { load } = require(path.join(__dirname, '../../../tools/trace/world.cjs'));
(async () => {
  let bad = 0;
  const ok = (c, m) => (c || bad++, console.log((c ? 'PASS ' : 'FAIL ') + m));
  const E = load();
  await E.start('150');
  E.step(10);
  const U = E.AN.unit,
    P = JSON.parse(E.js('JSON.stringify(WORLD.plantSw())')),
    row = (sheet, r) => {
      const q = P.find(p => p.sheet.endsWith(')' + sheet) && p.row === r);
      return q ? (q.on ? 1 : 0) : -1;
    };
  for (let i = 0; i < 3; i++) {
    ok(row('DITL-42', i + 1) === (U['paR' + i] ? 1 : 0), 'DITL-42 row ' + (i + 1) + ' PLANT AIR COMPRESSOR ' + 'ABC'[i] + ' RUNNING = ' + row('DITL-42', i + 1) + ' (model ' + U['paR' + i] + ')');
    ok(row('DITL-42', i + 4) === (U['iaR' + i] ? 1 : 0), 'DITL-42 row ' + (i + 4) + ' INSTRUMENT AIR COMPRESSOR ' + 'ABC'[i] + ' RUNNING = ' + row('DITL-42', i + 4) + ' (model ' + U['iaR' + i] + ')');
  }
  ok([0, 1, 2].some(i => U['iaR' + i]) && [0, 1, 2].some(i => U['paR' + i]), 'at 150 MW a plant air and an instrument air compressor run');
  for (const c of ['', ' #B', ' #C']) {
    const sh = 'DITL-45' + c;
    ok([5, 9, 16, 20].every(r => row(sh, r) === 1), sh + ' PLANT / INSTRUMENT AIR DRYER REMOTE = 1');
    ok(row(sh, 6) === 0, sh + ' PLANT AIR DRYER ALARM = 0');
  }
  /* the sootblower panel contacts (field states, normal service state) */
  for (const r of [11, 12, 15]) ok(row('DITL-80Q', r) === 0, 'DITL-80Q row ' + r + ' SOOTBLOWER TRIP = 0 (drawing rows 11 / 12 / 38: N-1011 / 1012 / 1038)');
  ok(row('DITL-80K', 10) === 0, 'DITL-80K row 10 AIR PREHEATER SOOTBLOWER TRIP (I.073D) = 0');
  ok(row('DITL-80M', 2) === 0, 'DITL-80M row 2 AIR PREHEATER SOOTBLOWER SYSTEM LOCAL SELECTED (I.073E) = 0');
  /* the instructor sets a field state: the row follows */
  E.AN.fault('fs.SB-N1011.trip', true);
  E.step(2);
  const P2 = JSON.parse(E.js('JSON.stringify(WORLD.plantSw())')),
    q = P2.find(p => p.sheet.endsWith(')DITL-80Q') && p.row === 11);
  ok(q && q.on, 'instructor: sootblower N-1011 trip -> DITL-80Q row 11 = 1');
  process.exit(bad ? 1 : 0);
})();
