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
/* slice E part 2 (lane 0 tcs-tcp-pio.json: the TCP card points, 3 channels): every TCP trip point against the IBD trip of the same
   name (the IBD stays the trip source). Each pair is read by hand from both texts; the test checks that both texts are still there. */
const PIO = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'tcs', 'backup', 'tcs-tcp-pio.json'), 'utf8'));
const PAIR = [
  ['TCP1900/1', 'IBD-TA-17', 'NO.1 TURBINE SHAFT VIBRATION VERY HIGH'],
  ['TCP1900/2', 'IBD-TA-17', 'NO.2 TURBINE SHAFT VIBRATION VERY HIGH'],
  ['TCP1900/3', 'IBD-TA-17', 'NO.3 GENERATOR SHAFT VIBRATION VERY HIGH'],
  ['TCP1900/4', 'IBD-TA-17', 'NO.4 GENERATOR SHAFT VIBRATION VERY HIGH'],
  ['TCP1900/5', 'IBD-TA-9', 'GEN./UNIT TRANS. PROTECTION A'],
  ['TCP1900/6', 'IBD-TA-9', 'GEN./UNIT TRANS. PROTECTION B'],
  ['TCP1900/7', 'IBD-TA-9', 'BOILER MFT 1'],
  ['TCP1900/8', null, '86G-A GEN LOCK OUT RELAY: no IBD trip sheet names it (TCE076 / TCE084 carry it from TCP)'],
  ['TCP1900/9', 'IBD-TA-1', 'TURBINE MANUAL TRIP (CCR)'],
  ['TCP1900/30', 'IBD-TA-2', 'MASTER TRIP SOLENOID (A1) DE-ENERGIZE'],
  ['TCP1900/31', 'IBD-TA-3', 'MASTER TRIP SOLENOID (B1) DE-ENERGIZE'],
  ['TCP1930/1', 'IBD-TA-21', 'HP TURBINE INLET/EXHAUST STEAM DIFF. PRESS. VERY HIGH'],
  ['TCP1930/2', 'IBD-TA-13', 'CONTROL OIL PRESS. VERY LOW'],
  ['TCP1930/3', 'IBD-TA-10', 'CONDENSER VACUUM VERY LOW TRIP'],
  ['TCP1930/5', 'IBD-TA-20', 'HP TURBINE EXHAUST STEAM TEMP. VERY HIGH'],
  ['TCP1930/9', 'IBD-TA-14', 'TURBINE TRIP OIL PRESS. VERY LOW'],
  ['TCP1930/10', 'IBD-TA-22', 'HP TURBINE EXHAUST STEAM PRESS. VERY HIGH'],
  ['TCP1930/11', 'IBD-TA-14', 'LP TURBINE EXHAUST HOOD STEAM TEMP. VERY HIGH'],
  ['TCP1930/13', 'IBD-TA-15', 'TURBINE SPEED (TURBINE BACK-UP OVERSPEED)'],
  ['TCP1930/17', 'IBD-TA-15', 'TURBINE SPEED (TURBINE OVERSPEED)'],
  ['TCP1930/18', 'IBD-TA-1', 'TURBINE MANUAL TRIP (CCR)'],
  ['TCP1930/20', 'IBD-TA-12', 'THRUST BEARING FAILURE (FRONT) ABNORMAL TRIP'],
  ['TCP1930/21', 'IBD-TA-12', 'THRUST BEARING FAILURE (REAR) ABNORMAL TRIP'],
  ['TCP1930/22', 'IBD-TA-17', 'NO.1 TURBINE SHAFT VIBRATION VERY HIGH'],
  ['TCP1930/23', 'IBD-TA-17', 'NO.2 TURBINE SHAFT VIBRATION VERY HIGH'],
  ['TCP1930/24', 'IBD-TA-17', 'NO.3 GENERATOR SHAFT VIBRATION VERY HIGH'],
  ['TCP1930/25', 'IBD-TA-17', 'NO.4 GENERATOR SHAFT VIBRATION VERY HIGH'],
  ['TCP1930/27', 'IBD-TA-1', 'TURBINE TRIP'],
  ['TCP1930/7', 'IBD-TA-2', 'MASTER TRIP SOLENOID (A1) DE-ENERGIZE'],
  ['TCP1930/32', 'IBD-TA-2', 'MASTER TRIP SOLENOID (A2) DE-ENERGIZE'],
  ['TCP1930/8', 'IBD-TA-3', 'MASTER TRIP SOLENOID (B1) DE-ENERGIZE'],
  ['TCP1930/31', 'IBD-TA-3', 'MASTER TRIP SOLENOID (B2) DE-ENERGIZE'],
  ['TCP1930/29', null, 'ST TRIP (FOR GEN GROUP A): no IBD trip sheet names it'],
  ['TCP1930/30', null, 'ST TRIP (FOR GEN GROUP B): no IBD trip sheet names it']
];
const ibdTxt = {};
for (const f of fs.readdirSync(dir).filter(f => /^IBD-.*\.js$/.test(f))) {
  const w = {};
  vm.runInNewContext(lib + ';' + fs.readFileSync(path.join(dir, f), 'utf8'), { window: w });
  for (const s of w.TCE_SHEETS || []) ibdTxt[s.id] = JSON.stringify(s).toUpperCase();
}
const pt = Object.fromEntries(['1', '2', '3'].flatMap(c => PIO[c].di.concat(PIO[c].dout).map(x => [c + ':' + x.card + '/' + x.pt, x])));
let same = 0;
const none = [];
for (const [p, sh, txt] of PAIR) {
  const x = pt['1:' + p];
  if (!x) {
    ck(false, p + ' is in the TCP PI/O table');
    continue;
  }
  if (!sh) {
    none.push(p + ' ' + x.desc + ' (' + txt.split(': ')[1] + ')');
    continue;
  }
  const ok = (ibdTxt[sh] || '').includes(JSON.stringify(txt).slice(1, -1).toUpperCase());
  if (ok) same++;
  else ck(false, p + ' ' + x.desc + ': ' + sh + ' "' + txt + '" not found');
}
/* every live trip input of TCP drives TURBINE TRIP and the four master trip solenoid commands in all three channels (the IBD TA-9 OR
   to TA-1 / TA-2 / TA-3) */
const tt = c => new RegExp('^TCP' + c + '930/27 '),
  trips = ['1', '2', '3'].flatMap(c => PIO[c].di.filter(x => x.drives.some(d => tt(c).test(d))).map(x => c + ':' + x.pt));
const all4 = ['1', '2', '3'].every(c => PIO[c].di.filter(x => x.drives.some(d => tt(c).test(d))).every(x => ['7', '8', '31', '32'].every(n => x.drives.some(d => d.startsWith('TCP' + c + '930/' + n + ' ')))));
console.log('TCP trip points with the same trip on the IBD: ' + same + ' of ' + PAIR.length + '; no IBD counterpart: ' + none.join('; '));
console.log('TCP live trip inputs (3 channels): ' + trips.length + ', each to TURBINE TRIP and the 4 master trip solenoids: ' + all4);
ck(same >= 31, 'TCP trip points matched to the IBD ' + same + ' (floor 31)');
ck(all4 && trips.length >= 27, 'every live TCP trip input drives TURBINE TRIP and the 4 master trip solenoids, 3 channels');
/* noted, not judged: the backup trace also gives TCP1930/4 MAIN STEAM TEMP. VERY LOW from every live trip input */

ck(plain >= FLOOR.plain, 'plain blocks ' + plain + ' (floor ' + FLOOR.plain + ')');
ck(found >= FLOOR.con, 'app inputs with their TCP / TCT source in the backup ' + found + ' (floor ' + FLOOR.con + ')');
process.exit(fail ? 1 : 0);
