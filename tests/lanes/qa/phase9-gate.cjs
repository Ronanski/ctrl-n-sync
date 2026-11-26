/* Phase 9 TAPOS gate (HMI; user OPLAN TRANSLATED, phases in order). Static, no browser (the HX pages are read the way
   tests/lanes/hmi-turbine/pages-bound.cjs reads them). docs/PHASES.md row 9 may say TAPOS only when:
   - every equipment of docs/SCOPE.md section 4.5 (equipment list K1AU3-L1-0-002 R0, PASOK) has a symbol on an HMI page: its tag is on an
     element of a page (tag, machine, loop or valve name; "A / B", "A-D", "1001 to 1003" lists count), or docs/phase9/equipment.json map
     names the element that draws it (and that element is there);
   - the user approved every page (docs/phase9/equipment.json approved; COMMANDMENT 4: only the user approves).
   The boxes with no value are held by tests/regress/hx_values.js. While row 9 is not TAPOS the gate passes and prints what is left. */
'use strict';
const fs = require('fs'),
  path = require('path'),
  vm = require('vm');
const root = path.resolve(__dirname, '..', '..', '..');
const rd = f => fs.readFileSync(path.join(root, f), 'utf8');
let bad = 0;
const fail = m => (bad++, console.log('FAIL', m));
const ctx = { window: {}, document: { addEventListener() {}, body: null, documentElement: { style: {} } }, console };
ctx.window.window = ctx.window;
vm.createContext(ctx);
vm.runInContext('var window=this.window;var document=this.document;' + rd('src/ui/plant/hx/hx-core.js'), ctx);
const HX = ctx.window.HX;
for (const f of fs.readdirSync(path.join(root, 'src/ui/plant/hx')).sort()) if (/^hx-page-.*\.js$/.test(f)) vm.runInContext('var HX=window.HX;' + rd('src/ui/plant/hx/' + f), ctx);
const P = {};
for (const p of HX.pages) {
  const it = [];
  const walk = x => {
    if (!x || typeof x !== 'object') return;
    it.push(x);
    for (const k in x) if (Array.isArray(x[k])) x[k].forEach(walk);
  };
  ((p.plan && p.plan.items) || []).forEach(walk);
  /* a drawn element: a symbol, or a machine drawn by its page (the sootblower lances: a tag button on the lance, mach = the blower) */
  P[p.id] = it.filter(x => x.k && (x.sym || x.mach));
}
const N = s => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
/* the tags an element names: 'Z-1119A / B / C / D', 'ZV-BR1001 / 1002', 'TCV-FG1116A-D', 'ZV-HR1001 to 1003', 'PCV-HR1010 · XV-HR1010-1' */
const expand = s => {
  const out = [];
  for (const part of String(s || '').split(/\s*[;,·]\s*/)) {
    const m = part.split(/\s*\/\s*|\s+to\s+/);
    const base = m[0].trim();
    out.push(base);
    for (const x of m.slice(1)) {
      const y = x.trim();
      if (/^[A-Z]$/.test(y)) out.push(base.replace(/[A-Z]$/, y));
      else if (/^\d+$/.test(y)) {
        const b = /^(.*?)(\d+)$/.exec(base);
        if (b) for (let n = +b[2]; n <= +y && n - +b[2] < 20; n++) out.push(b[1] + String(n).padStart(b[2].length, '0'));
      } else if (/^-\d+$/.test(y)) out.push(base.replace(/-\d+$/, y));
      else out.push(y);
    }
    const r = /^(.*?)([A-Z])-([A-Z])$/.exec(base);
    if (r) for (let c = r[2].charCodeAt(0); c <= r[3].charCodeAt(0); c++) out.push(r[1] + String.fromCharCode(c));
  }
  return out.filter(Boolean);
};
const own = new Set();
for (const id in P) for (const e of P[id]) for (const v of [e.tag, e.mach, e.loop, e.valve]) for (const x of expand(v)) own.add(N(x));
const EQ = JSON.parse(rd('docs/phase9/equipment.json'));
const find = sel => {
  const [pg, kv] = sel.split('|'),
    i = kv.indexOf('='),
    k = kv.slice(0, i),
    v = kv.slice(i + 1);
  return (P[pg] || []).find(e => String(e[k] || '') === v);
};
/* SCOPE.md 4.5: | # | Tag (Unit 1 / Unit 2) | Equipment | System | Scope | Page | R0 item | */
const t = rd('docs/SCOPE.md').split('\n'),
  i0 = t.findIndex(l => l.startsWith('### 4.5')),
  rows = [];
for (let i = i0 + 3; i < t.length && t[i].startsWith('|'); i++) {
  const c = t[i].split('|').map(x => x.trim());
  rows.push({ tag: c[2].split('/')[0].replace(/\(.*\)/, '').trim(), eq: c[3], scope: c[5], page: c[6] });
}
const pas = rows.filter(r => /^PASOK/.test(r.scope));
if (pas.length < 349) fail('SCOPE 4.5: ' + pas.length + ' PASOK equipment (2026-11-25: 349)');
let byTag = 0,
  byMap = 0;
const left = [];
for (const r of pas) {
  if (own.has(N(r.tag))) {
    byTag++;
    if (EQ.map[r.tag]) fail(r.tag + ' has its tag on a page: take it out of equipment.json map');
    continue;
  }
  const s = EQ.map[r.tag];
  if (s) {
    if (find(Array.isArray(s) ? s[0] : s)) byMap++;
    else fail(r.tag + ': equipment.json map names ' + s + ', which is not on the page');
    continue;
  }
  left.push(r);
}
for (const k in EQ.map) if (!pas.some(r => r.tag === k)) fail('equipment.json map ' + k + ' is not a PASOK equipment of SCOPE 4.5');
const pages = HX.pages.map(p => p.id),
  notOk = pages.filter(id => !(EQ.approved || {})[id]);
console.log('  equipment with a symbol: ' + (byTag + byMap) + ' of ' + pas.length + ' (tag on the page ' + byTag + ', map ' + byMap + '); no own symbol yet ' + left.length);
const by = {};
for (const r of left) (by[r.page] = by[r.page] || []).push(r.tag);
for (const k of Object.keys(by).sort()) console.log('    ' + k + ' (' + by[k].length + '): ' + by[k].slice(0, 14).join(' ') + (by[k].length > 14 ? ' ...' : ''));
console.log('  pages approved by the user: ' + (pages.length - notOk.length) + ' of ' + pages.length);
const tapos = /^\|\s*9\s*\|[^|]*\|[^|]*\|\s*TAPOS\s*\|/m.test(rd('docs/PHASES.md')),
  rest = [];
if (left.length) rest.push(left.length + ' equipment with no own symbol');
if (notOk.length) rest.push(notOk.length + ' pages not approved by the user');
if (tapos) for (const m of rest) fail('row 9 is TAPOS but ' + m);
else console.log(rest.length ? 'row 9 BAHAGI, left: ' + rest.join('; ') : 'row 9 BAHAGI: every condition met, it may be marked TAPOS');
console.log(bad ? 'FAIL phase9-gate: ' + bad : 'PASS phase9-gate' + (tapos ? ': row 9 TAPOS, every condition met' : ''));
process.exit(bad ? 1 : 0);
