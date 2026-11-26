/* Phase 6 DITL (lane 1, 2026-11-26): the rows of src/world/field/ditl.js sections 4 ~ 6, from the PC read of the drawings (YUA groups A ~ D).
   Field contacts read their normal service value, the instructor can change one, the rows bound by drawn row number (`row`) and the analog
   rows (`an`) get their value. Usage: node tests/ditl/yua-field.cjs */
const path = require('path');
const { load } = require(path.join(__dirname, '../../tools/trace/world.cjs'));
(async () => {
  let bad = 0;
  const ok = (c, m) => (c || bad++, console.log((c ? 'PASS ' : 'FAIL ') + m));
  const E = load();
  await E.start('150');
  E.step(10);
  const U = E.AN.unit,
    sw = () => JSON.parse(E.js('JSON.stringify(WORLD.plantSw())')),
    row = (P, sheet, r) => {
      const q = P.find(p => p.sheet.endsWith(')' + sheet) && p.row === r);
      return q ? (q.on ? 1 : 0) : -1;
    };
  let P = sw();
  for (const c of ['', ' #B', ' #C', ' #D']) ok(row(P, 'DITL-21A' + c, 17) === 0, 'DITL-21A' + c + ' row 17 SCREW COOLER TRIP = 0');
  ok(row(P, 'DITL-BA01', 12) === 1, 'DITL-BA01 row 12 LS-BH1752 BUFFER TANK LOW = 1 (coolers stopped)');
  for (const r of [2, 4, 5, 16, 17, 18, 19, 20]) ok(row(P, 'DITL-BA60', r) === 0, 'DITL-BA60 row ' + r + ' = 0 in service');
  ok(row(P, 'DITL-BA02', 12) === (U.sd.sw.siloH ? 1 : 0), 'DITL-BA02 row 12 SAND SILO HI = sand model (' + U.sd.sw.siloH + ')');
  for (const [s, r] of [['DITL-BA03', 11], ['DITL-BA11', 2], ['DITL-774', 12], ['DITL-777', 11], ['DITL-774', 5]]) ok(row(P, s, r) === 0, s + ' row ' + r + ' = 0 in service');
  for (const [s, r] of [['DITL-LS10', 7], ['DITL-LS110', 10], ['DITL-LS230', 10], ['DITL-LS214', 17], ['DITL-LS240', 10], ['DITL-LS240', 12], ['DITL-LS240', 14]])
    ok(row(P, s, r) === 0, s + ' row ' + r + ' = 0 in service');
  ok(row(P, 'DITL-LS214', 19) === 1, 'DITL-LS214 row 19 VENT FILTER IN REMOTE = 1');
  ok(row(P, 'DITL-LS240', 16) === U.lm.sw.tank && U.lm.sw.tank === 0, 'DITL-LS240 row 16 AIR TANK PRESSURE LOW = model low switch, 0 in service (' + U.lm.sw.tank + ')');
  {
    const q = P.find(p => p.sheet.endsWith(')DITL-80Q') && p.tag === 'I.073D');
    ok(q && !q.on, 'DITL-80Q drawn row 39 APH SOOTBLOWER TRIP (I.073D) = 0');
  }
  /* the flasher: both states within a few seconds */
  const seen = new Set();
  for (let k = 0; k < 8; k++) (E.step(0.5), seen.add(row(sw(), 'DITL-BA52', 1)));
  ok(seen.has(0) && seen.has(1), 'DITL-BA52 row 1 FLASHER M.133F turns ON and OFF');
  /* analog rows */
  const av = (sheet, r) =>
    E.js(`(()=>{const ALL=S.sheets.concat(WORLD.inst||[]);const s=ALL.find(x=>x.name.endsWith(')${sheet}'));const b=s._inst?s._inst.base:s;
      const i=b.rows.findIndex(q=>q.n===${r});const a=(s.nl.an||[]).find(a=>{const z=(s.nl.src||[]).find(q=>q.n===a.net);return z&&z.row===i});
      return a&&s.avw?s.avw[a.key]:null})()`);
  for (const [x, c] of [['A', ''], ['B', ' #B'], ['C', ' #C'], ['D', ' #D']]) {
    const t1 = av('DITL-21A' + c, 11), t2 = av('DITL-21A' + c, 12);
    ok(Math.abs(t1 - U['bh' + x + '1']) < 0.5 && Math.abs(t2 - U['bh' + x + '2']) < 0.5, 'DITL-21A' + c + ' rows 11 / 12 ash in / out = model ' + t1 + ' / ' + t2 + ' C');
    ok(t1 < 940 && t2 < 270, 'DITL-21A' + c + ' ash temperatures below the sheet alarms (940 / 270 C)');
  }
  ok(av('DITL-LS230', 6) === 2.5 && av('DITL-LS230', 9) === 0.5, 'DITL-LS230 rows 6 / 9 set points 2.5 / 0.5 kg/cm2');
  ok(isFinite(av('DITL-80K', 16)) && isFinite(av('DITL-80K', 17)), 'DITL-80K rows 16 / 17 PT-SB1040 / 1042 have the model value');
  /* the instructor trips screw cooler B: only machine B's row follows */
  E.AN.fault('fs.L1060-B.trip', true);
  E.step(2);
  P = sw();
  ok(row(P, 'DITL-21A #B', 17) === 1 && row(P, 'DITL-21A', 17) === 0, 'instructor: cooler B inverter trip -> DITL-21A #B row 17 = 1, A stays 0');
  process.exit(bad ? 1 : 0);
})();
