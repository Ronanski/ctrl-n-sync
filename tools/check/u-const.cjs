/* CONSTANTS ARE NOT STATE (Phase 11 rank 8, 2026-11-27; AOI finding: "At 150 MW" and every save point restore the whole unit object
   U = AN_UNIT, constants included (state.js anStateApply), so a constant changed in code never reached the plant: the old saved
   number won, e.g. AOI's bed DP anchor 1630 in code vs 1426 in st150).
   The constants of AN_UNIT (src/analog/engine/unit.js) are listed in AN_UNIT_K; a load puts their CODE values back (state.js).
   This check fails when
     1. a top-level key of the AN_UNIT literal is written by no function at all (so it is a constant) but is not in AN_UNIT_K;
     2. a key of AN_UNIT_K is written by any function, start and stop included (then it is state, not a constant);
     3. a key of AN_UNIT_K is not in the AN_UNIT literal.
   Usage: node tools/check/u-const.cjs */
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
const INIT = /Start|Cold|Stop|Anchor|Reset|InPlace|Init|Load|Save/i;
let inC = false;
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
/* the step writers of U.<key>, and every writer (start / stop included: a key a start or a stop sets is state, not a constant) */
const writers = {},
  any = {};
for (const f of ['src/analog/engine', 'src/world'].flatMap(d => walk(path.join(root, d)))) {
  let fn = '';
  inC = false;
  for (const l0 of fs.readFileSync(f, 'utf8').split(/\r?\n/)) {
    const l = code(l0),
      mf = /^(?:async\s+)?function\s+([A-Za-z0-9_$]+)/.exec(l);
    if (mf) fn = mf[1];
    const re = /\b(?:U|AN\.unit|AN_UNIT)\.([A-Za-z_$][\w$]*)\s*(?:=(?![=>])|\+=|-=|\*=|\/=|\+\+|--)/g;
    let w;
    while ((w = re.exec(l))) {
      (any[w[1]] = any[w[1]] || new Set()).add(fn || '(top level)');
      if (fn && !INIT.test(fn)) (writers[w[1]] = writers[w[1]] || new Set()).add(fn);
    }
  }
}
/* the top-level keys of the AN_UNIT literal, and AN_UNIT_K */
const src = fs.readFileSync(path.join(root, 'src/analog/engine/unit.js'), 'utf8').split(/\r?\n/);
const a = src.findIndex(l => /^const AN_UNIT = \{/.test(l)),
  b = src.findIndex((l, i) => i > a && /^\};/.test(l));
const keys = [];
inC = false;
for (const l0 of src.slice(a + 1, b)) {
  const m = /^  ([A-Za-z_$][\w$]*)\s*:/.exec(code(l0));
  if (m) keys.push(m[1]);
}
const kl = src.join('\n').match(/^const AN_UNIT_K = \[([^\]]*)\]/m);
const K = kl ? [...kl[1].matchAll(/'([^']+)'/g)].map(m => m[1]) : [];
let bad = 0;
const fail = m => (bad++, console.log('  FAIL ' + m));
if (a < 0 || b < 0) fail('the AN_UNIT literal was not found in src/analog/engine/unit.js');
if (!kl) fail('AN_UNIT_K (the list of the AN_UNIT constants) was not found in src/analog/engine/unit.js');
for (const k of keys) if (!any[k] && !K.includes(k)) fail('AN_UNIT.' + k + ' is written by no step function (a constant) but is not in AN_UNIT_K: a load would keep the old saved number');
for (const k of K) if (any[k]) fail('AN_UNIT.' + k + ' is in AN_UNIT_K but is written by ' + [...any[k]].join(', ') + ': state is not a constant');
for (const k of K) if (!keys.includes(k)) fail('AN_UNIT_K lists ' + k + ', which is not a key of the AN_UNIT literal');
console.log((bad ? 'FAIL' : 'PASS') + ' u-const: ' + keys.length + ' AN_UNIT keys, ' + K.length + ' constants put back from the code on every load');
process.exit(bad ? 1 : 0);
