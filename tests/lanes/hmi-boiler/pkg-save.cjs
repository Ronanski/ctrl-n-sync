/* Lane 6 (EIMI): a save made before pkg.js has no U.pkg. Loaded after a session that has one, the old panel is gone and the rectifiers
   follow the field.esp of the save; the same in the other direction, and a new save brings its own panel back. Headless, at 150 MW. */
const { load } = require('../../../tools/trace/world.cjs');
const bad = [];
const ok = (c, m) => c || bad.push(m);
(async () => {
  const E = load();
  await new Promise(r => setTimeout(r, 300));
  const AN = E.AN,
    copy = x => JSON.parse(JSON.stringify(x)),
    runs = () => AN.unit.pkg.esp.tr.map(r => (r.run ? 1 : 0)).join(''),
    esp = () => (AN.fieldState().esp ? 1 : 0),
    cap = old => {
      const p = AN.unit.pkg;
      if (old) delete AN.unit.pkg;
      const k = copy(AN.engState.capture());
      if (old) AN.unit.pkg = p;
      return k;
    };
  ok(typeof AN.pkgOp === 'function', 'AN.pkgOp');
  await E.start('150');
  E.step(10);
  ok(runs() === '11111' && esp() === 1, '150 MW: rectifiers ' + runs() + ', field.esp ' + esp());
  const oldOn = cap(true);
  ok(!/"pkg"/.test(JSON.stringify(oldOn)), 'the old save has no pkg');
  /* the operator stops the system: field.esp follows */
  ok(AN.pkgOp('esp', 'SYS', 'stop') === '', 'SYS stop');
  E.step(10);
  ok(runs() === '00000' && esp() === 0, 'after SYS stop: ' + runs() + ', field.esp ' + esp());
  const oldOff = cap(true),
    newOff = cap(false);
  /* old save with the precipitator in service, after a session with a stopped panel */
  AN.engState.apply(oldOn);
  ok(!AN.unit.pkg, 'the panel of the session is gone after the load');
  E.step(10);
  ok(runs() === '11111' && esp() === 1, 'old save, in service: ' + runs() + ', field.esp ' + esp());
  /* and out of service, after a session with a running panel with one rectifier tripped and a setting changed */
  AN.unit.pkg.esp.tr[2].alm = 1;
  ok(AN.pkgOp('esp', 'TR1', 'lim', 40) === '', 'limit 40 %');
  E.step(4);
  AN.engState.apply(oldOff);
  E.step(10);
  ok(runs() === '00000' && esp() === 0, 'old save, out of service: ' + runs() + ', field.esp ' + esp());
  ok(AN.unit.pkg.esp.tr[2].alm === 0 && AN.unit.pkg.esp.tr[0].lim === 100, 'no alarm and no setting of the old panel');
  ok(AN.unit.espK === 0, 'espK ' + AN.unit.espK);
  /* a new save brings its own panel */
  AN.engState.apply(oldOn);
  E.step(4);
  AN.engState.apply(newOff);
  E.step(4);
  ok(runs() === '00000' && esp() === 0, 'new save: ' + runs());
  /* Reset: the panel goes with the plant */
  await E.start('cold');
  ok(!AN.unit || !AN.unit.pkg, 'Reset keeps no panel');
  console.log('package panels and saves: problems ' + bad.length);
  for (const x of bad) console.log('  ' + x);
  process.exit(bad.length ? 1 : 0);
})().catch(e => {
  console.log('FAIL ' + e.stack);
  process.exit(1);
});
