/* ONE PATH PER PLANT VALUE (user 2026-11-27 11:13 AM PHT "Baka naman may existing na plant model na. Baka gumawa p ng bago at
   patungan ito?"; Phase 11 rule: the existing model is repaired IN PLACE, a part replaces its old code in the same PR; no second model,
   no fallback or shadow path, no old and new side by side).
   This check reads the model code (src/analog/engine and src/world, the -data.js tables left out) and fails when
     1. a name (function, or top-level const / let / var) is defined twice in src/analog: its files are joined into ONE script
        (src/analog/order.list), so a second definition silently replaces the first;
     2. a plant value U.<field> (AN.unit.<field>) gets a NEW writer: a function that assigns it while another function already does.
        Start, cold, stop, anchor, reset, load and save functions are left out (they set the starting state, they do not compute
        the plant). The writers of 2026-11-27 are the baseline (one-path-baseline.json, field -> functions); a field may lose writers,
        never gain one. A function is known by its name, so moving it to another file changes nothing.
   Usage: node tools/check/one-path.cjs [--update]   (--update only removes writers that are gone; it refuses to add one) */
const fs = require('fs'),
  path = require('path');
const root = path.resolve(__dirname, '..', '..');
const walk = d =>
  !fs.existsSync(d)
    ? []
    : fs.readdirSync(d).flatMap(f => {
        const q = path.join(d, f);
        return fs.statSync(q).isDirectory() ? walk(q) : /\.js$/.test(f) && !/-data\.js$/.test(f) ? [q] : [];
      });
const files = ['src/analog/engine', 'src/world'].flatMap(d => walk(path.join(root, d))).sort();
const INIT = /Start|Cold|Stop|Anchor|Reset|InPlace|Init|Load|Save/i;
const defs = {},
  writes = {};
for (const f of files) {
  const rel = path.relative(root, f).split(path.sep).join('/'),
    one = rel.startsWith('src/analog/');
  let fn = '',
    inC = false;
  /* comments are not code: a "U.x = 1" written in a comment is not a writer (AOI 2026-11-27, the AN_SV note in unit.js) */
  const code = l => {
    let o = '';
    for (let j = 0; j < l.length; j++) {
      if (inC) {
        if (l[j] === '*' && l[j + 1] === '/') (inC = false), j++;
      } else if (l[j] === '/' && l[j + 1] === '*') (inC = true), j++;
      else if (l[j] === '/' && l[j + 1] === '/') break;
      else o += l[j];
    }
    return o;
  };
  fs.readFileSync(f, 'utf8')
    .split(/\r?\n/)
    .forEach((l0, i) => {
      const l = code(l0);
      const mf = /^(?:async\s+)?function\s+([A-Za-z0-9_$]+)/.exec(l),
        mv = /^(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*=/.exec(l),
        m = mf || mv;
      if (m && one) (defs[m[1]] = defs[m[1]] || []).push(rel + ':' + (i + 1));
      if (mf) fn = mf[1];
      if (INIT.test(fn)) return;
      const re = /\b(?:U|AN\.unit)\.([A-Za-z_$][\w$]*)\s*(?:=(?![=>])|\+=|-=|\*=|\/=)/g;
      let w;
      while ((w = re.exec(l))) (writes[w[1]] = writes[w[1]] || new Set()).add(fn || '(top level of ' + rel + ')');
    });
}
let bad = 0;
const fail = m => (bad++, console.log('  FAIL ' + m));
for (const [k, v] of Object.entries(defs)) if (v.length > 1) fail(k + ' is defined ' + v.length + ' times in the one analog script: ' + v.join(', '));
const bp = path.join(__dirname, 'one-path-baseline.json'),
  base = fs.existsSync(bp) ? JSON.parse(fs.readFileSync(bp, 'utf8')) : {};
const now = {};
for (const [k, s] of Object.entries(writes)) now[k] = [...s].sort();
let gone = 0;
for (const [k, fns] of Object.entries(now)) {
  const b = base[k] || [];
  const extra = fns.filter(x => !b.includes(x));
  /* a field with one writer that was not in the baseline is a new value: fine. A new writer of a field that has one: a second path */
  if (fns.length > 1 && extra.length)
    fail('U.' + k + ' is computed in ' + fns.length + ' functions (' + fns.join(', ') + '); new: ' + extra.join(', ') + '. Replace the old code, do not add a second path.');
}
for (const [k, b] of Object.entries(base)) gone += b.filter(x => !(now[k] || []).includes(x)).length;
if (process.argv.includes('--update')) {
  if (bad && fs.existsSync(bp)) {
    console.log('REFUSED: --update does not add a writer.');
    process.exit(1);
  }
  const o = {};
  for (const [k, fns] of Object.entries(now)) if (fns.length > 1) o[k] = fns;
  fs.writeFileSync(bp, JSON.stringify(o, null, 1) + '\n');
  console.log('baseline written: ' + Object.keys(o).length + ' fields with more than one writer');
  process.exit(0);
}
const multi = Object.values(now).filter(v => v.length > 1).length;
console.log(
  (bad ? 'FAIL' : 'PASS') +
    ' one-path: ' + Object.keys(now).length + ' plant values written, ' + multi + ' with more than one writer (baseline ' + Object.keys(base).length +
    ' fields, ' + gone + ' old writers gone' + (gone ? ', run --update' : '') + '), ' + Object.keys(defs).length + ' names in the analog script'
);
process.exit(bad ? 1 : 0);
