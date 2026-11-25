/* Phase 5 curve gate (2026-11-26): every FG / UNT-FG block of the TCE / TCA / G sheets has its curve (at least two break points), printed on
   the drawing (block notes or the sheet's pr table) or, where the drawing prints none, from the HIACS program backup (_lib.js TCE_BACKUP,
   marked "(HIACS)"). Where the drawing prints a curve, no backup point is mixed into it. Fails when the count with a curve falls below FLOOR
   or a block without a curve is not one of the known open ones (raise FLOOR / shrink OPEN in the PR that closes more).
   Usage: node tests/lanes/qa/tcs-curves.cjs */
'use strict';
const fs = require('fs'),
  path = require('path'),
  vm = require('vm');
const dir = path.resolve(__dirname, '..', '..', '..', 'src', 'digital', 'tce');
const FLOOR = 56;
/* TCE212 003 / 036 UNT-FG (LMA010, CV flow demand to position): no table on page 144; the macro insides of the backup are the next slice */
const OPEN = ['TCE212 003', 'TCE212 036'];
const lib = fs.readFileSync(path.join(dir, '_lib.js'), 'utf8');
let n = 0,
  ok = 0,
  bk = 0,
  mixed = 0;
const miss = [];
for (const f of fs.readdirSync(dir).filter(f => /^(TC[AE]|G-).*\.js$/.test(f))) {
  const w = {};
  vm.runInNewContext(lib + ';' + fs.readFileSync(path.join(dir, f), 'utf8'), { window: w });
  for (const s of w.TCE_SHEETS || [])
    for (const b of s.b || []) {
      if (!/^(FG|UNT-FG)$/.test(b[1])) continue;
      n++;
      const own = (b[5] || []).filter(x => !/\(HIACS\)/.test(x)).concat((s.pr && s.pr[b[0]]) || []),
        all = (b[5] || []).concat((s.pr && s.pr[b[0]]) || []),
        pts = x => x.filter(q => /^\s*X\d+\s*:/.test(q)).length;
      if (pts(own) && all.some(q => /\(HIACS\)/.test(q))) mixed++;
      if (pts(all) >= 2) {
        ok++;
        if (all.some(q => /\(HIACS\)/.test(q))) bk++;
      } else miss.push(s.id + ' ' + b[2]);
    }
}
let bad = 0;
const ck = (c, m) => (console.log((c ? 'PASS ' : 'FAIL ') + m), c || bad++);
ck(ok >= FLOOR, 'FG / UNT-FG blocks with a curve: ' + ok + ' of ' + n + ' (' + bk + ' from the HIACS backup; may not go below ' + FLOOR + ')');
ck(!mixed, 'no drawing curve has a backup point mixed in (' + mixed + ')');
const extra = miss.filter(m => !OPEN.includes(m));
ck(!extra.length, 'blocks with no curve are only the known open ones: ' + (miss.join(', ') || 'none') + (extra.length ? '; NEW: ' + extra.join(', ') : ''));
process.exit(bad ? 1 : 0);
