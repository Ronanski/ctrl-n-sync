/* Phase 5 BLOCK LIBRARY, PID A/M (2026-11-26): the check of tests/regress/pid_am.js (its page.evaluate function, read from that file: one
   source for both) run headless in the tools/trace world in every Checks run, as tests/lanes/qa/blocks.cjs does for the other blocks.
   Each PID: with PV 20 % above SV, its selector on the manual leg (MAN station or operator input) gives the manual value, the PID follows
   it (bumpless) and the output does not jump when AUTO returns. Fails on any FAIL or when fewer PID pass than the floor (a PID that cannot
   be reached this way is listed as NOT TESTED with its reason, as in the browser test). Usage: node tests/lanes/qa/pid-am.cjs */
'use strict';
const fs = require('fs'),
  path = require('path');
const root = path.resolve(__dirname, '..', '..', '..');
const { load } = require(path.join(root, 'tools/trace/world.cjs'));
const FLOOR = 56; /* first headless run 2026-11-26: 66 PID, 56 PASS, 7 to another sheet, 3 after a summing block */
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
const E = load();
const r = E.js('(' + evalFn('pid_am.js') + ')')();
const c = {};
r.res.forEach(x => {
  const k = x.status.startsWith('NOT') ? x.status.split(' (')[0] : x.status;
  c[k] = (c[k] || 0) + 1;
});
const fail = r.res.filter(x => x.status === 'FAIL');
fail.forEach(x => console.log('FAIL', JSON.stringify(x)));
const ok = !fail.length && (c.PASS || 0) >= FLOOR;
console.log((ok ? 'PASS' : 'FAIL') + ' PID A/M headless through the real selector chain: ' + r.total + ' PID, ' + JSON.stringify(c) + ' (floor ' + FLOOR + ' PASS)');
process.exit(ok ? 0 : 1);
