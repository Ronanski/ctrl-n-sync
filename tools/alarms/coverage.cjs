/* Phase 10: docs/phase10/coverage.json = every tag of the newest plant alarm list ("Alarm List _20160912-DCS temporary value
   updating.xls", 15 sheets, 717 tags) and where it is in the app. Input: the lane 5 work list made from that xls on the user's PC
   (project files lanes/lane5/alarm-worklist-2026-11-25.json; the xls itself stays on the PC, RULES 5.9). Run again when the list or
   the alarm rows change:  node tools/alarms/coverage.cjs <worklist.json>
   Kinds (one per tag):
     row    an alarm row of src/data/alarms (its own line, set points of the list)
     abc    an ALM block of an ABC drawing (the drawing's own alarm; drawing set point wins where it differs, lane 5 worklist 1a)
     ditl   a switch the DITL logic reads, with no alarm line of its own yet (Phase 10 work: a switch row each)
     blank  the list gives no DCS set point (HH / H / L / LL all "-", "--" or "FHI"; only the normal value): no alarm to add
     out    a system outside the simulator (SCOPE.md 3 / 4: WTP, fire pump, compressors and dryers, wastewater)
     noio   not in the DCS I/O list (a package panel or TCS Modbus point): no DCS address to alarm */
const fs = require('fs'),
  path = require('path');
const root = path.resolve(__dirname, '..', '..');
const W = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const rows = {};
for (const f of fs.readdirSync(path.join(root, 'src/data/alarms')).filter(x => x.endsWith('.json')))
  for (const r of JSON.parse(fs.readFileSync(path.join(root, 'src/data/alarms', f), 'utf8'))) (rows[r.tag] = rows[r.tag] || new Set()).add(f.replace('.json', ''));
const scope = fs.readFileSync(path.join(root, 'docs/SCOPE.md'), 'utf8');
const lab = t => {
  /* the equipment of the tag's loop number in SCOPE section 4, when it is LABAS (T-0705A for PT-PA0705-A) */
  const m = /-[A-Z]{0,2}(\d{4})(?:-([A-Z]))?/.exec(t);
  if (!m) return null;
  const re = new RegExp('^\\| \\d+ \\| ([A-Z]{1,3}-' + m[1] + (m[2] || '') + '?) \\|[^|]+\\|[^|]+\\| (LABAS[^|]*)\\|', 'm');
  const x = re.exec(scope);
  return x ? x[1] + ': ' + x[2].trim() : null;
};
const sp = x => ['HH', 'H', 'L', 'LL'].map(k => String(x.sp[k] || '').trim()).join(' / ');
const out = W.map(x => {
  const o = { tag: x.tag, sheet: x.sheet, pd: String(x.pid || '').replace(/\s+/g, '') };
  if (rows[x.tag]) return { ...o, kind: 'row', in: [...rows[x.tag]].sort().join(', ') };
  if (x.st === 'A_ALARM_BLOCK') return { ...o, kind: 'abc', in: x.alm.join(', ') };
  if (x.st === 'B_ON_LOGIC') return { ...o, kind: 'ditl', in: x.io.filter(a => x.ditl.includes(a[1])).map(a => 'STN10' + a[0] + ' ' + a[1] + ' ' + a[2]).join(', ') };
  if (x.st === 'D_IO_NO_SETPOINT') return { ...o, kind: 'blank', why: 'list HH / H / L / LL: ' + sp(x) + ' (' + String(x.scope).replace(/\s+/g, ' ').trim() + ')' };
  if (x.st === 'E_NOT_IN_IO') return { ...o, kind: 'noio', why: String(x.scope).replace(/\s+/g, ' ').trim() + '; list HH / H / L / LL: ' + sp(x) };
  /* SCOPE.md section 3: compressed air "LABAS ang compressors at dryers", WTP (demin, potable) LABAS, "Fire fighting, cranes,
     elevator, pits, silencers" LABAS; the equipment row of section 4 when it has one */
  const fn = String(x.fn).replace(/\s+/g, ' ').trim(),
    sys = /DRYER|COMPRESSOR|AIR TANK/.test(fn) ? 'compressors and dryers' : /POTABLE|RAW WATER|HYPO|WATER PLANT/.test(fn + x.scope) ? 'WTP' : /FIRE PUMP/.test(fn) ? 'fire fighting' : /PIT/.test(fn) ? 'pits' : null;
  const l = lab(x.tag);
  return { ...o, kind: 'out', why: 'SCOPE.md 3 LABAS: ' + (sys || '?') + (l ? '; SCOPE.md 4 ' + l : '') + ' (' + fn + ')' };
});
const n = {};
for (const o of out) n[o.kind] = (n[o.kind] || 0) + 1;
fs.writeFileSync(path.join(root, 'docs/phase10/coverage.json'),
  JSON.stringify({ src: 'Alarm List _20160912-DCS temporary value updating.xls (PC), via the lane 5 work list 2026-11-25; tool tools/alarms/coverage.cjs', count: n, tags: out }, null, 0)
    .replace(/\},\{"tag"/g, '},\n{"tag"') + '\n');
console.log(out.length, JSON.stringify(n));
