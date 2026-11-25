/* LEADER : YUA (lane 0): the sootblowers N-1012 ~ N-1038. Their REMOTE START / REVERSE push buttons are the copies of DITL-80M
   (src/world/inst/sootblowers.json): each DITL-80G copy reads rows 6 / 11 from its own sootblower, the press goes through the 2 s pulse and
   REMOTE SELECTED (I.073F), and the steps 2 / 8 come from its own OPERATING / SKIPPED row of DITL-80B ~ 80F. */
const { load } = require('../../../tools/trace/world.cjs');
(async () => {
  const E = load();
  await E.start('150');
  const { WORLD: W, DITL } = E,
    all = DITL.S.sheets.concat(W.inst),
    sh = n => all.find(x => x.name.endsWith(')' + n)),
    bad = [],
    ok = (c, t) => c || bad.push(t);
  const src = (s, row) => ((W.idx.din.get(s) || new Map()).get(row) || []).map(q => [q.d, q.row]);
  const B8 = '4010,4018,4020,4028,4030,4038,4040,4048,4050,4058,4060,4068,4070,4078,4080,4088,4090,4098,4100,4108,4110,4118,4120,4128,4130,4138,4140,4148'.split(',');
  let n = 0;
  for (let k = 2; k <= 28; k++) {
    const tag = 'N-' + (1010 + k),
      g = sh('DITL-80G #' + tag),
      m = k === 2 ? sh('DITL-80M') : sh('DITL-80M #' + tag),
      c = sh('DITL-80M #' + tag);
    const one = (row, d, r, t) => {
      const L = src(g, row);
      ok(L.length === 1 && L[0][0] === d && L[0][1] === r, tag + ' row ' + (row + 1) + ' ' + t + ': ' + L.map(x => x[0].name + '/' + x[1]));
      n++;
    };
    one(5, m, k === 2 ? 4 : 2, 'REMOTE START');
    one(10, c, 7, 'REMOTE REVERSE');
    for (const [row, w] of [[1, 'OPERATING'], [7, 'SKIPPED']]) {
      const L = src(g, row);
      ok(L.length === 1 && /\)DITL-80[B-F]$/.test(L[0][0].name) && (L[0][0].cells[L[0][1] + ':RS'] || []).map(x => x.t).join(' ').includes(tag + ' SOOTBLOWER ' + w), tag + ' row ' + (row + 1) + ' ' + w);
      n++;
    }
    const a = 'M.' + (parseInt(B8[k - 1], 16) + 5).toString(16).toUpperCase();
    if (k > 2) ok(W.addrK(c, 2) === a, tag + ' START P.B. ' + W.addrK(c, 2) + ', not ' + a);
  }
  /* the press: the 2 s pulse of the copy, with REMOTE SELECTED */
  E.step(10);
  const c13 = sh('DITL-80M #N-1013'),
    out = () => !!(W._o[c13.name] && W._o[c13.name].has(2));
  ok(!out(), 'N-1013: no press, no command');
  W.dpress(c13.name, 2);
  let on = 0;
  for (let i = 0; i < 12; i++) {
    E.step(1);
    on += out() ? 1 : 0;
  }
  ok(on >= 3 && on <= 6 && !out(), 'N-1013 REMOTE START: ' + on + ' steps on');
  console.log('sootblower push buttons: ' + (bad.length ? 'FAIL ' + bad.length + '\n  ' + bad.slice(0, 20).join('\n  ') : 'pass, ' + n + ' links'));
  process.exit(bad.length ? 1 : 0);
})();
