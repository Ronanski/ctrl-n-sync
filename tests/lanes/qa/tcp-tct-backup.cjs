/* QA (Phase 6 TCS slice E, 2026-11-26): the TCP (trip protection, 41 sheets x 3 channels) and TCT (network, 34 sheets) programs of the
   HIACS backup (docs/tcs/backup/tcs-tcp-tct.json, read on the PC by lane 0; no TCE / TCA drawing exists for them). HEADLESS CHECK ONLY
   (coordinator 2026-11-26 10:01 AM): nothing here runs in the app; the IBD stays the trip source and the app keeps one logic.
   What it measures, each count may not fall:
   - blocks whose kind is in the block library (TCE_RUN.K) and whose every input reads plainly (a pin of a card, a REF, a block of the
     sheet, a joint from another TCP / TCT sheet, a link from a TCE / TCA sheet); the rest are listed by reason;
   - the inputs of the app's TCE / TCA sheets that read a TCP / TCT sheet (ports CON:TCP... / CON:TCT..., 0 in the app today) and have
     their source block in the backup.
   The comparison with the IBD trips needs the PI/O table of the TCP cards (TCP1900 inputs, TCP1930 / TCP1931 outputs: which trip each
   point is), not in the documents read in the cloud (report docs/versions/updates/phase6-tcs-backup-slice-e.md).
   Usage: node tests/lanes/qa/tcp-tct-backup.cjs */
const fs = require('fs'),
  path = require('path'),
  vm = require('vm');
const root = path.resolve(__dirname, '..', '..', '..');
const FLOOR = { plain: 2099, con: 637 }; /* first run 2026-11-26 */
const D = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'tcs', 'backup', 'tcs-tcp-tct.json'), 'utf8'));
const win = {};
vm.runInNewContext(fs.readFileSync(path.join(root, 'src', 'digital', 'tce-run.js'), 'utf8'), { window: win });
const R = win.TCE_RUN;
const sheets = [];
for (const [id, v] of Object.entries(D.TCP)) for (const ch of Object.keys(v)) sheets.push({ id: id.replace('x', ch), ...v[ch] });
for (const [id, v] of Object.entries(D.TCT)) sheets.push({ id, ...v });
const why = {},
  add = (w, id) => ((why[w] = why[w] || new Set()).add(id));
let n = 0,
  plain = 0;
for (const s of sheets) {
  const els = new Set(s.blocks.filter(b => b.el).map(b => b.op + ' ' + b.el));
  for (const b of s.blocks) {
    if (/^(DEF|SYSDEF)$/.test(b.op)) continue; /* a definition: the name of a signal, not a block */
    n++;
    let bad = null;
    if (!R.K[b.op] && !/^PA\d\d$/.test(b.op)) bad = 'kind ' + b.op + ' not in the block library' + (b.op === 'SYSREF' ? ' (system signal, name not exported)' : '');
    else if (!b.el) bad = 'block with no number in the export';
    else
      for (const i of b.ins.map(x => x.replace(/^SW:/, ''))) {
        if (/^(PIO \d \(|REF \d \S|DENSO \d \S|JOINT \d \S|CONECT \d \S)/.test(i)) continue;
        if (els.has(i)) continue;
        bad = /^\?/.test(i) ? 'net with no name (?YY, from another sheet)' : /^[A-Z0-9]+ ?$/.test(i) ? 'input block with no number in the export' : 'input ' + i.split(' ')[0] + ' not found';
        break;
      }
    if (bad) add(bad, s.id);
    else plain++;
  }
}
/* the app side: inputs of the TCE / TCA sheets fed by a TCP / TCT sheet */
const dir = path.join(root, 'src', 'digital', 'tce'),
  lib = fs.readFileSync(path.join(dir, '_lib.js'), 'utf8'),
  app = [];
for (const f of fs.readdirSync(dir).filter(f => /^(TC[AE]|G-).*\.js$/.test(f))) {
  const w = {};
  vm.runInNewContext(lib + ';' + fs.readFileSync(path.join(dir, f), 'utf8'), { window: w });
  app.push(...(w.TCE_SHEETS || []));
}
const P = R.compile(app),
  con = P.ports.filter(p => /^CON:TC[PT]\d/.test(p));
const by = Object.fromEntries(sheets.map(s => [s.id, s]));
let found = 0;
const miss = [];
for (const p of con) {
  const [, sh, letter] = /^CON:([A-Z0-9]+)\.(.+)$/.exec(p) || [];
  const s = by[sh];
  if (s && s.outs.some(o => o.startsWith('DENSO 1 ' + letter + ' ('))) found++;
  else miss.push(p);
}
console.log('TCP / TCT sheets ' + sheets.length + ' (TCP ' + Object.keys(D.TCP).length + ' x 3 channels, TCT ' + Object.keys(D.TCT).length + ')');
console.log('blocks ' + n + ', plain (kind known, every input readable) ' + plain);
for (const [w, s] of Object.entries(why).sort((a, b) => b[1].size - a[1].size)) console.log('  not plain: ' + w + ' on ' + s.size + ' sheets: ' + [...s].slice(0, 12).join(' '));
console.log('app inputs read from TCP / TCT (0 in the app): ' + con.length + ', source found in the backup ' + found + (miss.length ? '; not found e.g. ' + miss.slice(0, 8).join(' ') : ''));
let fail = 0;
const ck = (ok, w) => (console.log((ok ? 'PASS ' : 'FAIL ') + w), ok || fail++);
ck(plain >= FLOOR.plain, 'plain blocks ' + plain + ' (floor ' + FLOOR.plain + ')');
ck(found >= FLOOR.con, 'app inputs with their TCP / TCT source in the backup ' + found + ' (floor ' + FLOOR.con + ')');
process.exit(fail ? 1 : 0);
