/* Phase 10 TAPOS gate (alarms and events; user OPLAN TRANSLATED, "GO 10 13 15" 2026-11-27 7:00 AM PHT). docs/PHASES.md row 10 may
   say TAPOS only when every "tapos kapag" item of that row holds. Always checked (any row status):
   1. docs/phase10/coverage.json holds every tag of the newest plant alarm list (Alarm List _20160912, 717 tags) once, each with one kind:
      row   = it has rows in src/data/alarms (checked here: the tag is there);
      abc   = an ALM block of the named ABC drawing carries the tag (checked on the compiled sheets: block txt[1]);
      blank / out / noio = a written reason (no set point in the list; SCOPE.md 3 LABAS; not in the DCS I/O list);
      ditl  = a switch read only by the DITL logic, no alarm line of its own yet (open work of Phase 10);
      the count line of the file matches; no tag of src/data/alarms is missing from it.
   2. The open counts may only go down: docs/phase10/baseline.json (ditl).
   Row 10 TAPOS: also 0 ditl. */
'use strict';
const fs = require('fs'),
  path = require('path');
const root = path.resolve(__dirname, '..', '..', '..');
const rd = f => fs.readFileSync(path.join(root, f), 'utf8');
let bad = 0;
const fail = m => (bad++, console.log('FAIL', m));
const C = JSON.parse(rd('docs/phase10/coverage.json')),
  B = JSON.parse(rd('docs/phase10/baseline.json'));
const KINDS = ['row', 'abc', 'ditl', 'blank', 'out', 'noio'];
const rows = new Map();
for (const f of fs.readdirSync(path.join(root, 'src/data/alarms')).filter(x => x.endsWith('.json')))
  for (const r of JSON.parse(rd('src/data/alarms/' + f))) rows.set(r.tag, (rows.get(r.tag) || new Set()).add(f.replace('.json', '')));
const seen = new Set(),
  n = {};
for (const t of C.tags) {
  if (seen.has(t.tag)) fail(t.tag + ' twice in coverage.json');
  seen.add(t.tag);
  if (!KINDS.includes(t.kind)) fail(t.tag + ': kind "' + t.kind + '"');
  n[t.kind] = (n[t.kind] || 0) + 1;
  if (t.kind === 'row' && !rows.has(t.tag)) fail(t.tag + ': kind row, no row in src/data/alarms');
  if (t.kind !== 'row' && rows.has(t.tag)) fail(t.tag + ': has rows in src/data/alarms but kind ' + t.kind);
  if (/^(blank|out|noio)$/.test(t.kind) && !(t.why && t.why.length > 8)) fail(t.tag + ': ' + t.kind + ' with no reason');
  if (t.kind === 'out' && !/^SCOPE\.md 3 LABAS: (compressors and dryers|WTP|fire fighting|pits)/.test(t.why)) fail(t.tag + ': out without the SCOPE.md 3 system');
  if (t.kind === 'blank' && (!/^list HH \/ H \/ L \/ LL: /.test(t.why) || /\d/.test(t.why.replace(/^list HH \/ H \/ L \/ LL: /, '').split(' (')[0])))
    fail(t.tag + ': blank but the list gives a set point (' + t.why + ')');
}
if (seen.size !== 717) fail('coverage.json has ' + seen.size + ' tags, the list has 717');
for (const t of rows.keys()) if (!seen.has(t)) fail(t + ' (src/data/alarms) is not in coverage.json');
for (const k of KINDS) if ((C.count[k] || 0) !== (n[k] || 0)) fail('coverage.json count ' + k + ' ' + (C.count[k] || 0) + ', tags ' + (n[k] || 0));
if ((n.ditl || 0) > B.ditl) fail('switches with no alarm line of their own went up: ' + n.ditl + ' > ' + B.ditl + ' (docs/phase10/baseline.json)');
const P = rd('docs/PHASES.md'),
  row10 = (/^\| 10 \| [^|]+\|[^|]+\| (TAPOS|BAHAGI|HINDI PA) \|/m.exec(P) || [])[1];
const tapos = row10 === 'TAPOS';
if (tapos && n.ditl) fail('row 10 TAPOS with ' + n.ditl + ' switches that have no alarm line of their own');
/* the ABC alarm blocks: compiled sheets, the ALM block whose tag (txt[1]) is the named one */
(async () => {
  const { loadEngine } = require('../../../tools/engine/node-engine.js');
  const { AN } = await loadEngine();
  const alm = new Set();
  for (const sh of AN.sheets) {
    if (!/^ABC-/.test(sh.name)) continue;
    AN.ensure(sh);
    for (const b of (sh.S && sh.S.blk) || []) if (b.k === 'ALM' && b.txt && b.txt[1]) alm.add(sh.name + ' ' + String(b.txt[1]).trim());
  }
  let ok = 0;
  for (const t of C.tags.filter(t => t.kind === 'abc')) {
    const L = String(t.in || '').split(/\s*,\s*/).filter(Boolean);
    if (!L.length || L.some(x => !alm.has(x))) fail(t.tag + ': ALM block "' + t.in + '" not found on the compiled ABC sheets');
    else ok++;
  }
  console.log((bad ? 'FAIL' : 'PASS') + ' phase10-gate: list 717, ' + KINDS.map(k => k + ' ' + (n[k] || 0)).join(', ') + '; ABC alarm blocks found ' + ok + ' / ' + (n.abc || 0) + '; row 10 ' + row10 + (tapos ? '' : ' (left for TAPOS: ' + (n.ditl || 0) + ' switches with no alarm line of their own)'));
  process.exit(bad ? 1 : 0);
})().catch(e => {
  console.log('FAIL phase10-gate: ' + e.message);
  process.exit(1);
});
