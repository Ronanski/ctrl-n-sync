// TA-15 speed inputs: the BK-UP overspeed test bias (TCE145, +108 rpm) reaches SE-STn001-1/2/3 only. Usage: node tests/engine/ost-bind.js
const { loadEngine } = require('../../tools/engine/node-engine.js');
(async () => {
  const { win } = await loadEngine({
    patch: c => c.replace('function tcsIbdBind() {', 'globalThis.__p={bind:()=>tcsIbdBind()};function tcsIbdBind() {')
  });
  let bad = 0;
  const ok = (c, m) => {
    if (!c) bad++;
    console.log((c ? 'PASS ' : 'FAIL ') + m);
  };
  const r = win.__p.bind().find(x => x.s.id === 'TA-15');
  const name = n => r.s.i.find(i => i[0] === n)[1];
  const U = { tb: { rpm: 3900, st: 'roll' }, tc: { ost: { bk: 1 } } };
  for (const [n, f] of r.pv) {
    const v = f(U, U.tc),
      bk = /SE-STn001-[123]\b/.test(name(n));
    ok(v === (bk ? 4008 : 3900), name(n) + ' = ' + v + (bk ? ' (3900 + 108 bias)' : ' (no bias)'));
  }
  U.tc.ost.bk = 0;
  ok(r.pv.every(([, f]) => f(U, U.tc) === 3900), 'BK-UP test off: every speed input = 3900');
  process.exit(bad ? 1 : 0);
})();
