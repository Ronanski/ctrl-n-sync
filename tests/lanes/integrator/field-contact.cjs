/* Lane 0 (YUA): the MCC relay (ELECTRICAL TROUBLE) on the output wire of an input address is the input row of that address too, without a
   latch; the DITL-43 inverter reads NOT TRIP as the logic has it; a save keeps the operator's field bit of a row the model already had and
   clears the old one of a row it did not have. */
const path = require('path');
const { load } = require(path.join(__dirname, '../../../tools/trace/world.cjs'));
(async () => {
  const E = load();
  await E.start('150');
  E.step(4);
  const W = E.WORLD,
    D = E.ctx.DUI || E.ctx.window.DUI,
    bad = [];
  const ok = (c, t) => c || bad.push(t);
  const all = [];
  for (const [, v] of W.instOf) all.push(...v);
  const get = n => all.find(s => s.name.endsWith(')' + n));
  let n = 0;
  for (const [base, row] of [['DITL-22', 15], ['DITL-24', 11], ['DITL-30', 3], ['DITL-31', 11], ['DITL-61A', 3], ['DITL-76', 3], ['DITL-77', 3], ['DITL-111', 11], ['DITL-112', 16]])
    for (const s of all.filter(x => new RegExp('[)]' + base + '( #.)?$').test(x.name))) {
      n++;
      const u = s.nl.usr.find(x => /TROUBLE/.test(x.label)),
        z = s.nl.src.find(q => q.row === row - 1);
      ok(u && z, s.name + ': no relay or row');
      if (!u || !z) continue;
      s.usw = s.usw || {};
      s.usw[u.key] = true;
      E.step(2);
      ok(s.nl._v[z.n] && s.nl._v[u.n], s.name + ' row ' + row + ': relay ON not read ' + s.nl._v[z.n] + s.nl._v[u.n]);
      s.usw[u.key] = false;
      E.step(2);
      ok(!s.nl._v[z.n] && !s.nl._v[u.n], s.name + ' row ' + row + ': relay RESET, still 1');
    }
  /* DITL-43: the automatic row alone keeps the air preheater */
  const s43 = get('DITL-43');
  ok(s43._fd && s43._fd.inv && s43._fd.inv.run === 1, 'DITL-43: not running at 150 MW');
  /* the save list */
  const m = W.plantSw().filter(q => q.on != null && /DITL-/.test(q.sheet));
  ok(m.length > 100, 'switch rows with a value: ' + m.length);
  const q = m.find(x => x.on === true && !/-NC/.test(x.tag) && /DITL-23A$/.test(x.sheet)) || m[0],
    s = all.find(x => x.name === q.sheet),
    k = q.row - 1 + ':S',
    sw = W.plantSw();
  s.sig[k] = true;
  W.plantSwSet(sw);
  E.step(2);
  ok(s.sig[k] === true, 'a row of the save lost its field bit: ' + q.sheet + ' r' + q.row);
  W.plantSwSet(sw.filter(x => !(x.sheet === q.sheet && x.row === q.row)));
  E.step(2);
  ok(!s.sig[k], 'a row new to the model keeps the old field bit: ' + q.sheet + ' r' + q.row);
  if (bad.length) {
    console.log(bad.join('\n'));
    process.exit(1);
  }
  console.log('field contacts: ' + n + ' drawings, save list ok');
  process.exit(0);
})();
