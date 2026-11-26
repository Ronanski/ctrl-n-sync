/* QA (lane 8): the TCE / TCA / G sheets that run COMPLETE as their logic: every block has its meaning (TCE_RUN.stats) AND the parameters
   that meaning needs are printed on the sheet (FG break points, SG K, timer times, PIV limits ...). A missing parameter is not made up:
   the sheet does not count. Fails when the complete count falls below FLOOR (raise FLOOR in the PR that completes more sheets).
   Usage: node tests/lanes/qa/tce-complete.cjs */
const fs = require('fs'),
  path = require('path'),
  vm = require('vm');
const root = path.resolve(__dirname, '..', '..', '..');
/* floor 194 -> 141 (2026-11-25, rules (a) explanation sheets and (b) links lost at compile: old rule 196, new rule 141 on main 502e57f);
   141 -> 196 after lane 1 PR 526 fixed both (nearest connector, INITIAL from TCE050) */
/* 256 -> 257 (Phase 6 TCS 2026-11-26: the FG curves and values of the HIACS backup, _lib.js TCE_BACKUP) */
/* 196 -> 256 (Phase 7, user "Go 7" 2026-11-25 ~7:40 PM PHT): the floor follows main again (COMPLETE 256 of 419 on main ebdeea5) */
/* 257 -> 261 (Phase 6 TCS slice B 2026-11-26: the macro insides of the HIACS backup, tce-run.js BKM: TCE163 TCE166 TCE450 TCE451) */
/* 261 -> 265 (slice C 2026-11-26: VALVE CONTROL MT1 inside from the backup: TCE210 TCE211 TCE212 TCE214; TURNING GEAR TCE350 -> 266; slice D CV WARMING SET TCE155, CRT OPE INC/DEC TCE194 TCE205, L-RATE TCE185 -> 270) */
const FLOOR = +(process.env.TCE_FLOOR || 270);
const dir = root + '/src/digital/tce';
const src = fs.readFileSync(root + '/src/digital/tce-run.js', 'utf8');
const win = {};
vm.runInNewContext(src, { window: win });
const R = win.TCE_RUN;
const lib = fs.readFileSync(dir + '/_lib.js', 'utf8');
const sheets = [];
for (const f of fs
  .readdirSync(dir)
  .filter(f => /^(TC[AE]|G-).*\.js$/.test(f))
  .sort()) {
  const w = {};
  vm.runInNewContext(lib + ';' + fs.readFileSync(path.join(dir, f), 'utf8'), { window: w });
  sheets.push(...(w.TCE_SHEETS || []));
}
// keys each kind reads, from the source text of K
const kstart = src.indexOf('const K = {'),
  kend = src.indexOf('\n  };', kstart);
const ktxt = src.slice(kstart, kend);
const req = {};
let cur = null;
for (const line of ktxt.split('\n')) {
  const m = /^    ([A-Z0-9_]+):/.exec(line);
  if (m) {
    cur = m[1];
    req[cur] = new Set();
  }
  if (cur) for (const p of line.matchAll(/par\(n, '([A-Z0-9]+)'/g)) req[cur].add(p[1]);
}
const P = R.compile(sheets);
const S = R.stats(P);
const run = new Set(P.plan.filter(p => !S.notRun.includes(p.id)).map(p => p.id));
console.log('sheets', S.sheets, 'run', S.run, 'ports', S.ports, JSON.stringify(S.portKinds));
let nb = 0,
  miss = 0,
  unused = 0,
  noNotes = 0;
const ex = { miss: [], unused: [] };
const byType = {};
const portIdx = new Set(P.ports.map(n => P.idx.get(n)));
let inPort = 0,
  inTot = 0;
const sheetPortOnly = [];
for (const p of P.plan) {
  if (!run.has(p.id)) continue;
  let pin = 0,
    pt = 0;
  for (const x of p.nodes) {
    if (x.t !== 'b') continue;
    nb++;
    const ty = x.type;
    const keys = new Set((x.notes || []).map(n => (/^\s*([A-Z][A-Z0-9]*)\s*:/.exec(n) || [])[1]).filter(Boolean));
    const need = req[ty] || req[(R.ALIAS || {})[ty]] || new Set();
    for (const k of need)
      if (!keys.has(k) && !(k === 'LL' || k === 'HL' || k === 'RI' || k === 'RD')) {
        miss++;
        byType[ty + ':' + k] = (byType[ty + ':' + k] || 0) + 1;
        if (ex.miss.length < 25) ex.miss.push(p.id + ' ' + ty + ' needs ' + k + ' notes=' + JSON.stringify(x.notes));
      }
    for (const k of keys)
      if (!need.has(k)) {
        unused++;
        if (ex.unused.length < 25)
          ex.unused.push(p.id + ' ' + ty + ' has ' + k + ' not read (' + JSON.stringify(x.notes) + ')');
      }
    for (const s of x.ins) {
      pt++;
      if (portIdx.has(s)) pin++;
    }
  }
  inPort += pin;
  inTot += pt;
}
console.log('blocks in running sheets', nb, 'params defaulted', miss, 'printed params ignored', unused);
console.log(byType);
console.log(ex.miss.join('\n'));
console.log('---');
console.log(ex.unused.join('\n'));
console.log('block inputs straight from a PORT (unbound, = 0 today):', inPort, 'of', inTot);
// per sheet verdict
const bad = new Map();
const why = (id, w) => {
  (bad.get(id) || bad.set(id, new Set()).get(id)).add(w);
};
for (const p of P.plan) {
  if (!run.has(p.id)) continue;
  for (const x of p.nodes) {
    if (x.t !== 'b') continue;
    const ty = x.type,
      n = x.notes || [];
    const keys = new Set(n.map(q => (/^\s*([A-Z][A-Z0-9]*)\s*:/.exec(q) || [])[1]).filter(Boolean));
    if (ty === 'FG') {
      let c = 0;
      for (let i = 1; i <= 8; i++) if (keys.has('X' + i) && keys.has('Y' + i)) c++;
      if (c < 2) why(p.id, 'FG with no curve (gives NaN)');
    }
    if ((ty === 'SG' || ty === 'SGW') && !keys.has('K')) why(p.id, ty + ' with no K (gives 0)');
    if (ty === 'TP' && !keys.has('TP')) why(p.id, 'TP with no time');
    if (ty === 'TD' && !keys.has('TD')) why(p.id, 'TD with no time');
    if (ty === 'FLK' && !keys.has('T1')) why(p.id, 'FLK with no times');
    if (ty === 'G' && !keys.has('K'))
      why(p.id, 'G with no K (gain 1 used)' + (keys.size ? ' printed ' + [...keys] : ''));
    if (ty === 'LIN' && !keys.has('K')) why(p.id, 'LIN with no K/B');
    if (ty === 'PIV' && (keys.has('HL') || keys.has('LL') || keys.has('ML')))
      why(p.id, 'PIV output limits HL/LL/ML on the sheet not applied');
    if (ty === 'AM' && keys.has('M')) why(p.id, 'AM M parameter not applied');
  }
}
/* rule added 2026-11-25 (QA review against the Aug 2017 TCE / TCA PDFs):
   (a) a LOGIC / PI/O EXPLANATION sheet (TCE022 / TCE023 ...) is a legend of the drawing set, not controller logic: it never counts;
   (b) a sheet-to-sheet link that join() makes (the drawing names the source sheet and its letter) but that compile() turns into a
       CON: port (= 0) is a broken wire of the reading sheet. TCE169 (PDF p 121, drawing p 119): HEAT SOAK MODE from TCE168 C reads 0. */
for (const s of sheets)
  if (run.has(s.id) && /EXPLANATION/i.test(s.title || '')) why(s.id, 'explanation sheet (legend, not logic)');
{
  const nets = sheets.map(s => (s.dwg ? R.gnet(s) : R.net(s)));
  R.join(nets);
  const nbI = Object.fromEntries(nets.map(n => [n.id, n]));
  for (const n of nets)
    for (const c of n.inputs) {
      if (!c.src || !run.has(n.id)) continue;
      const T = c.src.slice(0, c.src.indexOf(':')),
        k = c.src.slice(T.length + 1);
      if (!nbI[T].outputs.find(o => o.key === k)) why(n.id, 'link from another sheet lost at compile (reads 0)');
    }
}
console.log('\nrunning sheets with a defect:', bad.size, 'of', run.size);
const agg = {};
for (const [id, s] of bad) for (const w of s) agg[w] = (agg[w] || []).concat(id);
for (const [w, ids] of Object.entries(agg)) console.log(w, ids.length, ids.slice(0, 20).join(' '));
// by controller
const ctl = {};
for (const p of P.plan) {
  const c = p.ctl || '?';
  ctl[c] = ctl[c] || [0, 0, 0];
  ctl[c][0]++;
  if (run.has(p.id)) ctl[c][1]++;
  if (run.has(p.id) && !bad.has(p.id)) ctl[c][2]++;
}
console.log('controller: sheets / run / run without a found defect', JSON.stringify(ctl));

/* two columns (2026-11-25, lane 1 PR 539): a sheet that runs only because a macro is coded from the manual text ("inside not drawn",
   TCE_RUN.stats().runText) is not drawing-complete; it is counted on its own line and never in COMPLETE */
const runText = new Set(S.runText || []);
const ok = P.plan.filter(p => run.has(p.id) && !bad.has(p.id));
const drawn = ok.filter(p => !runText.has(p.id)),
  textOk = ok.filter(p => runText.has(p.id)).length;
const complete = drawn.length;
const empty = drawn.filter(p => !p.blocks && !p.macros).length;
console.log('of the complete: real logic ' + (complete - empty) + ', tables with no block ' + empty);
console.log(
  'runs with a manual-text macro (not drawing-complete): ' +
    runText.size +
    ' (of these with no other defect ' +
    textOk +
    ')'
);
console.log('\nCOMPLETE ' + complete + ' of ' + P.plan.length + ' (floor ' + FLOOR + ')');
process.exit(complete >= FLOOR ? 0 : 1);
