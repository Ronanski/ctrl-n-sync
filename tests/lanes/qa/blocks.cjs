/* Phase 5 BLOCK LIBRARY (2026-11-25): every calculation / logic block of every ABC sheet, black box, through the real wiring of its sheet,
   against the block's function from the legend (ABC-000 / textbook), not from the engine. The check itself is the one of
   tests/regress/blocks_io.js (its page.evaluate function, read from that file: one source for both); here it runs headless in the
   tools/trace world (same engine bundle), PLANT MODEL OFF, in every Checks run. The browser run of blocks_io.js (also PLANT MODEL ON at
   150 MW) stays in sim-tests.yml.
   Fails when: a block gives a wrong output, a sheet does not build, or fewer blocks / block kinds are checked than the floor below
   (a lane that adds blocks moves the floor up in the same PR). PID / PIDV, MAN, A/M, AI and totalizers have their own tests ("own test"). */
'use strict';
const fs = require('fs'),
  path = require('path');
const root = path.resolve(__dirname, '..', '..', '..');
const { load } = require(path.join(root, 'tools/trace/world.cjs'));
const FLOOR = { sheets: 51, blocks: 1671, checks: 12021, kinds: 34 };
const src = fs.readFileSync(path.join(root, 'tests/regress/blocks_io.js'), 'utf8');
const a = src.indexOf('page.evaluate(([name,plant])=>'),
  b = src.indexOf('},[name,plant]);');
if (a < 0 || b < 0) {
  console.log('FAIL blocks: the check function of tests/regress/blocks_io.js was not found');
  process.exit(1);
}
const E = load();
const check = E.js('(' + src.slice(a + 'page.evaluate('.length, b + 1) + ')');
const names = E.AN.sheets.filter(s => !/ABC-000/.test(s.name)).map(s => s.name);
const sum = { sheets: 0, blocks: 0, checks: 0, kinds: new Set(), skip: {} };
let bad = 0;
for (const n of names) {
  const r = check([n, 'off']);
  if (r.err) {
    bad++;
    console.log('FAIL', n, r.err);
    continue;
  }
  sum.sheets++;
  sum.blocks += r.tested;
  sum.checks += r.checks;
  for (const k in r.byKind) sum.kinds.add(k);
  for (const k in r.skip) sum.skip[k] = (sum.skip[k] || 0) + r.skip[k];
  for (const x of r.bad) {
    bad++;
    console.log('FAIL', n, x.blk, x.tag, '|', x.what, '| expected', x.exp, 'got', x.got);
  }
}
for (const k of ['sheets', 'blocks', 'checks'])
  if (sum[k] < FLOOR[k]) bad++, console.log('FAIL', k, sum[k], 'below the floor', FLOOR[k]);
if (sum.kinds.size < FLOOR.kinds) bad++, console.log('FAIL block kinds', sum.kinds.size, 'below the floor', FLOOR.kinds);
console.log((bad ? 'FAIL' : 'PASS') + ' blocks: ' + sum.sheets + ' sheets, ' + sum.blocks + ' blocks, ' + sum.checks + ' checks, ' + sum.kinds.size +
  ' kinds (' + [...sum.kinds].sort().join(' ') + '); skipped ' + JSON.stringify(sum.skip) + '; wrong ' + bad);
process.exit(bad ? 1 : 0);
