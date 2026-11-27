/* Phase 10 item 2 (docs/PHASES.md row 10): every alarm row of src/data/alarms, forced past its list set point from the 150 MW start
   (tools/alarms/force.cjs, headless, about 35 s), gives its line with its priority and is gone after the forces are off; a row that
   gives no line is in docs/phase10/open.json with its reason (b / link / m) and no row is there that does give a line.
   Row 10 TAPOS also needs 0 "link" (that work is Phase 10's own). */
'use strict';
const fs = require('fs'),
  path = require('path');
const root = path.resolve(__dirname, '..', '..', '..');
const O = JSON.parse(fs.readFileSync(path.join(root, 'docs/phase10/open.json'), 'utf8'));
require('../../../tools/alarms/force.cjs')
  .run()
  .then(o => {
    let bad = 0;
    const fail = m => (bad++, console.log('FAIL', m));
    const open = new Map(O.rows.map(r => [r.row, r]));
    for (const r of O.rows) if (!/^(b|link|m)$/.test(r.why) || !(r.note && r.note.length > 10)) fail(r.row + ': open.json reason "' + r.why + '"');
    for (const k of o.noLine) if (!open.has(k)) fail(k + ': no alarm line when forced, not in docs/phase10/open.json');
    for (const k of open.keys()) if (!o.noLine.includes(k)) fail(k + ': gives its line now; take it out of docs/phase10/open.json');
    if (o.pri !== o.line) fail('priority: ' + (o.line - o.pri) + ' lines with a priority other than their row');
    if (o.clear !== o.rows) fail((o.rows - o.clear) + ' lines still there after the forces are off');
    const P = fs.readFileSync(path.join(root, 'docs/PHASES.md'), 'utf8'),
      tapos = /^\| 10 \| [^|]+\|[^|]+\| TAPOS \|/m.test(P),
      nl = O.rows.filter(r => r.why === 'link').length;
    if (tapos && nl) fail('row 10 TAPOS with ' + nl + ' rows still to bind (open.json link)');
    const by = k => O.rows.filter(r => r.why === k).length;
    console.log((bad ? 'FAIL' : 'PASS') + ' phase10-force: rows ' + o.rows + ', line when forced ' + o.line + ', priority ok ' + o.pri + ', clear ' + o.clear + '; no line ' + o.noLine.length + ' (b ' + by('b') + ', link ' + by('link') + ', m ' + by('m') + ')');
    process.exit(bad ? 1 : 0);
  })
  .catch(e => {
    console.log('FAIL phase10-force: ' + e.message);
    process.exit(1);
  });
