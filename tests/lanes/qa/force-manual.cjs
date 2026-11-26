/* Phase 5 BLOCK LIBRARY, FORCE MANUAL of the A/M stations (2026-11-26): the check of tests/regress/force_manual.js (its page.evaluate
   function, read from that file: one source for both) run headless in the tools/trace world in every Checks run. For every controller
   with an A/M station: the logic signal that selects the manual leg is forced to 1, the operator's AUTO is refused; after the signal is
   gone the station STAYS manual until AUTO is pressed (user rule 2026-10-14, CLAUDE.md HINDI NAGBABAGO 2 and 10). Fails on any FAIL or
   when fewer pass than the floor. Usage: node tests/lanes/qa/force-manual.cjs [ABC-007,...] */
'use strict';
const fs = require('fs'),
  path = require('path');
const root = path.resolve(__dirname, '..', '..', '..');
const { load } = require(path.join(root, 'tools/trace/world.cjs'));
const FLOOR = +(process.env.FM_FLOOR || 68); /* first headless run 2026-11-26: 68 PASS, 0 FAIL, 35 s */
/* the argument of page.evaluate(...): from its first character to the comma or ')' that closes it at depth 0 */
function evalFn(file) {
  const src = fs.readFileSync(path.join(root, 'tests/regress', file), 'utf8'),
    a = src.indexOf('page.evaluate(') + 'page.evaluate('.length;
  let i = a,
    d = 0,
    q = null;
  for (; i < src.length; i++) {
    const c = src[i];
    if (q) {
      if (c === '\\') i++;
      else if (c === q) q = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') q = c;
    else if ('({['.includes(c)) d++;
    else if (')}]'.includes(c)) {
      if (!d) break;
      d--;
    } else if (c === ',' && !d) break;
  }
  return src.slice(a, i);
}
const t0 = Date.now(),
  E = load();
if (typeof E.AN.go !== 'function') E.AN.go = () => {}; /* the page's sheet tab: no screen here */
const r = E.js('(' + evalFn('force_manual.js') + ')')((process.argv[2] || '').split(',').filter(Boolean));
r.fail.forEach(x => console.log('FAIL', x));
for (const k in r.nt) console.log('NOT TESTED (' + r.nt[k].length + '):', k, r.nt[k].slice(0, 6).join(', '));
const ok = !r.fail.length && r.pass >= FLOOR;
console.log((ok ? 'PASS' : 'FAIL') + ' force manual headless: ' + r.pass + ' PASS, ' + r.fail.length + ' FAIL (floor ' + FLOOR + '), ' + ((Date.now() - t0) / 1000).toFixed(0) + ' s');
process.exit(ok ? 0 : 1);
