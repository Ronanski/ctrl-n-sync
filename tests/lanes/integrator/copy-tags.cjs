/* beta.510 (lane 0, RARA's linker items): the copy of a drawing for machine B / C / D shows and reads its own tag and address, with
   no row of a lane. The world of the app in Node (tools/trace/world.cjs), not run. */
const { load } = require('../../../tools/trace/world.cjs');
const E = load(),
  W = E.WORLD,
  bad = [];
const is = (what, got, want) => got === want || bad.push(what + ': ' + got + ', expected ' + want);
const sheet = n => W.inst.find(s => s.name.replace(/^\([^)]*\)/, '') === n);
(async () => {
  await new Promise(r => setTimeout(r, 300)); /* the DCS descriptions (AI tags) come in a promise */
  const row = (n, drawn) => {
    const s = sheet(n),
      i = s._inst.base.rows.findIndex(r => +r.n === drawn),
      c = k => (s._inst.base.cells[i + ':' + k] || []).map(x => x.t).join(' ');
    return { s, i, t: W.showText(s, c('T')).trim(), a: W.addrK(s, i) };
  };
  /* [sheet, drawn row, tag, address]: DCS I/O list */
  for (const [n, r, tag, adr] of [
    ['DITL-23B #B', 5, 'PS-LO1115-B3', 'I.0412'],
    ['DITL-23B #B', 10, 'TT-FW1115-B2', 'AI0661'],
    ['DITL-29B #C', 9, 'TT-SW1501-CU', 'AI0752'],
    ['DITL-21A #D', 11, 'TT-BH1060-D1', 'AI0896']
  ]) {
    const q = row(n, r);
    is(n + ' row ' + r + ' tag', q.t, tag);
    is(n + ' row ' + r + ' address', q.a, adr);
  }
  /* the drawing names the siblings: the two demi tanks of DITL-112 stay for every pump */
  const d = sheet('DITL-112 #B');
  is('DITL-112 #B LS-MU0708-A', W.showText(d, 'LS-MU0708-A'), 'LS-MU0708-A');
  is('DITL-112 #B O.0044/0.037E/', W.showText(d, 'O.0044/0.037E/').replace(/\W+$/, ''), 'O.037E');
  /* a unit of one output row (src/world/inst "rows"): DITL-21D row 22 reads the cooler of its own letter */
  for (const [l, adr, ann] of [['B', 'O.0297', 'O.137D'], ['C', 'O.0615', 'O.137E'], ['D', 'O.0617', 'O.137F']]) {
    const q = row('DITL-21D #' + l, 22),
      src = (W.idx.din.get(q.s).get(q.i) || [])[0];
    is('DITL-21D #' + l + ' address', q.a, adr);
    is('DITL-21D #' + l + ' ANN', W.showText(q.s, 'S4 O.137C/137D/137E/137F').replace(/^S4\s+/, '').trim(), ann);
    is('DITL-21D #' + l + ' source', src && src.d.name.replace(/^\([^)]*\)/, ''), 'DITL-21A #' + l);
    is('DITL-21D #' + l + ' outputs', q.s.nl.outs.length, 1);
  }
  console.log('copy tags: problems ' + bad.length);
  for (const x of bad) console.log('  ' + x);
  process.exit(bad.length ? 1 : 0);
})();
