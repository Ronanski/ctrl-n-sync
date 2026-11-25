/* Lane 0 (YUA): a row fed by an output of its own sheet (the seal-in, FROM 30-58) has that output as its only source. The field bit of the
   150 MW state goes once the output is 1, so a pump does not start again at the relay RESET after a field trip with no start command. The
   contact of a MOV (REMOTE, TORQUE) is kept in that bit and stays. */
const path = require('path');
const { load } = require(path.join(__dirname, '../../../tools/trace/world.cjs'));
(async () => {
  const E = load();
  await E.start('150');
  E.step(4);
  const W = E.WORLD,
    bad = [];
  const ok = (c, t) => c || bad.push(t);
  const all = [];
  for (const [, v] of W.instOf) all.push(...v);
  let n = 0;
  for (const s of all) {
    const L = W.idx.din.get(s);
    if (!L) continue;
    for (const [r, src] of L) {
      if (!src.some(q => q.k === 'd' && q.d === s) || !(s._win && s._win.has(r))) continue;
      const mov = (s.nl.mv || []).some(b => b.fb.some(f => f.mir === r));
      n++;
      ok(mov || !s.sig[r + ':S'], s.name + ' row ' + (r + 1) + ': link 1 and the field bit still ON');
    }
  }
  ok(n > 60, 'rows with their own link ON: ' + n);
  let p = 0;
  for (const s of all.filter(x => /\)DITL-(22|24|30|31|111|112)( #.)?$/.test(x.name))) {
    const u = s.nl.usr.find(x => /TROUBLE/.test(x.label)),
      run = () => !!(W.out[s.name] && W.out[s.name].has(7));
    if (!u || !run()) continue;
    p++;
    s.usw = s.usw || {};
    s.usw[u.key] = true;
    E.step(6);
    ok(!run(), s.name + ': relay ON, still running');
    s.usw[u.key] = false;
    E.step(6);
    ok(!run(), s.name + ': started again at the relay RESET');
  }
  ok(p >= 5, 'machines running at 150 MW: ' + p);
  if (bad.length) {
    console.log('FAIL seal-row\n  ' + bad.join('\n  '));
    process.exit(1);
  }
  console.log('PASS seal-row: ' + n + ' rows with their own link, ' + p + ' machines stay stopped after the relay RESET');
  process.exit(0);
})();
