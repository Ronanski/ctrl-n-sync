/* Phase 6 TCS link audit (2026-11-26, lane 1): every cross-sheet JOINT link of the TCE / TCA / G sheets and every TCS-DCS Modbus row
   has one source, no dangling input and no duplicate driver. Report: docs/versions/updates/phase6-tcs-link-audit.md.
   Held: (1) join(): 0 links that cannot be made, 0 sheets with two output connectors of one letter, 0 outputs to a TCS sheet that no
   input reads; (2) Modbus (src/data/tcs-dcs.json): every named row has an end (TCE_IO mbEnd), no address twice, no end twice in one
   direction; (3) the TPC inputs (CON:TCP ports) fed from one source (src/analog/engine/tcs-tpc.js, read only here) may not go below the
   floor, and every TPC port that stays unfed is a SPARE, an input error (E1 ~ E7: the model has no card fault) or one of the named
   inputs listed in the report (OPEN, no source in the documents read). */
'use strict';
const fs = require('fs'),
  path = require('path'),
  vm = require('vm');
const root = path.join(__dirname, '..', '..');
const dir = path.join(root, 'src/digital/tce');
const win = {};
vm.runInNewContext(fs.readFileSync(path.join(root, 'src/digital/tce-run.js'), 'utf8'), { window: win });
const R = win.TCE_RUN;
const lib = fs.readFileSync(path.join(dir, '_lib.js'), 'utf8');
const sheets = [];
for (const f of fs.readdirSync(dir).filter(f => /^(TC[AE]|G-).*\.js$/.test(f)).sort()) {
  const w = {};
  vm.runInNewContext(lib + ';' + fs.readFileSync(path.join(dir, f), 'utf8'), { window: w });
  sheets.push(...(w.TCE_SHEETS || []));
}
let bad = 0;
const ok = (c, m) => {
  if (!c) bad++;
  console.log((c ? 'PASS ' : 'FAIL ') + m);
};
/* (1) the JOINT links */
const ss = sheets.filter(s => !s.legend),
  nets = ss.map(s => (s.dwg ? R.gnet(s) : R.net(s))),
  J = R.join(nets);
ok(!J.bad.length, `TCS sheet links: ${J.ok} joined, ${J.ext} from outside the set, ${J.bad.length} that cannot be made ${J.bad.join('; ')}`);
const dup = [];
for (const n of nets) {
  const c = {};
  /* one letter may go out twice to different sheets (G-1A "1" to G-6A and to G-9: each reader takes the one that names it); a duplicate
     driver is one letter twice toward the same sheet. An out connector with no letter and no sheet (G-4, drawn so) drives nothing. */
  for (const o of n.outc) if (o.letter) (c[o.letter] = c[o.letter] || []).push(o);
  for (const k in c)
    for (let i = 0; i < c[k].length; i++)
      for (let j = i + 1; j < c[k].length; j++)
        if (!c[k][i].sheets.length || !c[k][j].sheets.length || c[k][i].sheets.some(s => c[k][j].sheets.includes(s))) dup.push(n.id + ' ' + k);
}
ok(!dup.length, 'no sheet drives one output letter twice: ' + (dup.join(', ') || 'none'));
const read = new Set(nets.flatMap(n => n.inputs.filter(c => c.src).map(c => c.src))),
  ids = new Set(nets.map(n => n.id)),
  unread = [];
for (const n of nets) for (const o of n.outc) if (!read.has(n.id + ':' + o.key) && o.sheets.some(s => ids.has(s))) unread.push(n.id + ' ' + o.letter);
ok(!unread.length, 'every output to a TCS sheet is read there: ' + (unread.join(', ') || 'all'));
/* (2) the Modbus rows */
{
  const w = {};
  vm.runInNewContext(fs.readFileSync(path.join(root, 'src/digital/tce-io.js'), 'utf8'), { window: w });
  const api = w.TCE_IO.make(JSON.parse(fs.readFileSync(path.join(root, 'src/data/tcs-io.json'), 'utf8')));
  const mb = JSON.parse(fs.readFileSync(path.join(root, 'src/data/tcs-dcs.json'), 'utf8')).modbus.filter(m => m.tag || m.d);
  const noEnd = mb.filter(m => !m.to || !api.mbEnd(m.to)).map(m => m.ma);
  const twice = (k, a) => Object.entries(a.reduce((o, m) => ((o[k(m)] = (o[k(m)] || 0) + 1), o), {})).filter(([, n]) => n > 1).map(([x]) => x);
  ok(mb.length === 237 && !noEnd.length, `Modbus: ${mb.length} named rows, ${noEnd.length} with no end ${noEnd.join(' ')}`);
  const da = twice(m => m.sh + ' ' + m.ma, mb),
    de = twice(m => m.sh + ' ' + m.to, mb);
  ok(!da.length && !de.length, `Modbus: no address twice (${da.join(', ') || 'none'}), no end twice in one direction (${de.join(', ') || 'none'})`);
}
/* (3) the TPC inputs */
{
  const P = R.compile(sheets),
    ctx = { window: {}, console };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(root, 'src/analog/engine/tcs-tpc.js'), 'utf8') + ';this.tp = tcsTpcPorts;', ctx);
  const fed = new Set(ctx.tp(P).flatMap(x => x[0])),
    tcp = P.ports.filter(n => /^CON:TCP/.test(n)),
    un = tcp.filter(n => !fed.has(P.idx.get(n)));
  const name = {};
  for (const n of nets) for (const c of n.inputs) for (const f of c.from) if (/^TCP/.test(f)) name['CON:' + f + '.' + c.letter] = c.name || '';
  const kind = n => (/^E\d/.test(n.split('.').pop()) ? 'input error' : /SPARE/i.test(name[n] || '') ? 'spare' : 'named');
  const cnt = un.reduce((o, n) => ((o[kind(n)] = (o[kind(n)] || 0) + 1), o), {});
  ok(tcp.length - un.length >= 282, `TPC inputs: ${tcp.length} ports, ${tcp.length - un.length} fed from one source (floor 282), unfed ${JSON.stringify(cnt)}`);
}
process.exit(bad ? 1 : 0);
