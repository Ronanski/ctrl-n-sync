// The TCS soft logic sheets (src/digital/tce/*.js, format: src/digital/parts/02d-tce.js) as a netlist, from the drawing itself.
// Full Audit 3 item #4, step 1 (docs/tcs/SHEETS_AS_LOGIC_PLAN.md). Read only: it changes nothing in the app.
// usage: node tools/data/tce_net.mjs [--json out.json] [--sheet TCA520] [--list]
//
// How a net is found (TCE_RUN.net in src/digital/tce-run.js). The key of a wire piece is the part that gives its signal (a connector, constant, PI/O box, block, CRT push button or
// macro pin of the same sheet), so the key IS the net. What the net feeds is read from the last point of each piece, as on the drawing:
//   - on the left edge of a small block: an input of that block (ordered by height, top first); on its top or bottom edge: the side input
//     the drawing gives there (the time of a timer, the select of a switch);
//   - on a mark on the wire (BTR / FTR transfer, X crossed circle = loop mark (value of the last scan), NC circle of a NOT): the input of that mark; the pieces after the
//     mark carry the key of the mark;
//   - on the left edge of a macro block: the input pin at that height (the pin heights the sheet gives, or the drawing's even spacing);
//   - on an output connector, a CRT lamp, a definition (constant of kind 'def') or a PI/O box: an output of the sheet;
//   - at the start of, or on, another piece of the same key: the same net goes on (a gap for a mark of the drawing, or a junction).
// Anything else is "not named": it is printed with its sheet, key and point, so the drawing can be read again at that place.
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const dir = path.join(root, 'src/digital/tce');
const arg = k => {
  const i = process.argv.indexOf(k);
  return i > 0 ? process.argv[i + 1] : null;
};
const lib = fs.readFileSync(path.join(dir, '_lib.js'), 'utf8');
const sheets = [];
for (const f of fs
  .readdirSync(dir)
  .filter(f => /^TC[AE].*\.js$/.test(f))
  .sort()) {
  const win = {};
  vm.runInNewContext(lib + ';' + fs.readFileSync(path.join(dir, f), 'utf8'), { window: win });
  sheets.push(...(win.TCE_SHEETS || []));
}
/* the reader itself is src/digital/tce-run.js (TCE_RUN.net / TCE_RUN.join): one reader for this tool and the app */
const rw = {};
vm.runInNewContext(fs.readFileSync(path.join(root, 'src/digital/tce-run.js'), 'utf8'), { window: rw });
const netOf = rw.TCE_RUN.net;
const only = arg('--sheet');
const join = rw.TCE_RUN.join;
const nets = sheets.filter(s => !only || s.id === only).map(netOf);
const J = join(nets);
let ends = 0,
  open = 0,
  noIn = 0;
for (const n of nets) {
  open += n.open.length;
  noIn += n.blocks.filter(b => !b.ins.length && !/^SGW?$/.test(b.type)).length + n.macros.filter(m => !m.ins.length && m.L.length).length;
}
for (const s of sheets) ends += (s.w || []).length;
console.log(
  `TCS sheets ${nets.length}, wire pieces ${ends}: not named ${open}; blocks / macros with no input found ${noIn}` +
    ' (BTR / FTR / X marks sit on a wire and pass its signal; an SG signal generator has no input)'
);
console.log(`input connectors: ${J.ok} joined to the output of their sheet (${J.list.length} of them not in that output's sheet list), ${J.ext} from a part that is not a TCE / TCA sheet (IBD, DCS, G), ${J.bad.length} with no output to join`);
if (process.argv.includes('--list')) for (const b of J.bad) console.log('  join ' + b);
if (process.argv.includes('--list')) for (const b of J.list) console.log('  list ' + b);
if (process.argv.includes('--list'))
  for (const n of nets) for (const o of n.open) console.log('  ' + n.id + ' ' + o.net + ' at ' + o.at.join(','));
const out = arg('--json');
if (out) fs.writeFileSync(out, JSON.stringify(nets));
if (only) console.log(JSON.stringify(nets[0], null, 1).slice(0, 4000));
