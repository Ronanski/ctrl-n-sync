/* RULES.md 3.12 (user 2026-11-24, permanent): no per-load tables, interpolations or constants fitted to plant trends / snapshots in the
   physics. Physics from first principles and the design geometry; set points only from the plant logic curves (FX of the sheets).
   This check reads the engine physics (src/analog/engine, src/world) and flags each line that
     - says a value comes from a plant trend / snapshot fit (plant trend, trend outranks, fitted, curve fit, calibrated to / on, tuned on,
       snapshot ratio, from the snapshot), or
     - keys a value on the load: U.MW / 150, MW / 150, (+U.MW || 0) / 150.
   A flagged line passes when it carries a design source tag on the same line: DESIGN-SRC: <doc> (a design document), LOGIC-SRC: <sheet>
   (a logic curve / FX), or NO-FIT-OK: <why> (a history note or a measurement that sets no value). The lines that were there on
   2026-11-24 are in no-fit-baseline.json: each is an old fit with a finding (D27 ~ D36) and goes away one by one; a NEW flagged line
   fails the Checks. A baseline line that is gone is reported (update the baseline with --update after the fix).
   Usage: node tools/check/no-fit.cjs [--update] */
const fs = require('fs'),
  path = require('path');
const root = path.resolve(__dirname, '..', '..');
const DIRS = ['src/analog/engine', 'src/world'];
const WORDS = /plant (dcs )?trends?\b|trend outranks|\bfit(ted)? (on|to)\b|curve fit|calibrated (to|on|with)\b|tuned (on|to|from)\b|snapshot ratio|from the snapshot/i;
const LOAD = /\bU\.MW\b[^;\n]*\/\s*150\b|\bMW\s*\/\s*150\b|\(\+?U\.MW\s*\|\|\s*0\)\s*\/\s*150/;
const TAG = /DESIGN-SRC:|LOGIC-SRC:|NO-FIT-OK:/;
const norm = s => s.trim().replace(/\s+/g, ' ');
const files = [];
const walk = d => {
  if (!fs.existsSync(d)) return;
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(js|mjs|cjs)$/.test(f) && !/-data\.js$/.test(f)) files.push(p);
  }
};
DIRS.forEach(d => walk(path.join(root, d)));
const found = {};
for (const f of files.sort()) {
  const rel = path.relative(root, f).split(path.sep).join('/');
  fs.readFileSync(f, 'utf8')
    .split(/\r?\n/)
    .forEach((l, i) => {
      if ((WORDS.test(l) || LOAD.test(l)) && !TAG.test(l)) (found[rel] = found[rel] || []).push([i + 1, norm(l)]);
    });
}
const bp = path.join(__dirname, 'no-fit-baseline.json');
if (process.argv.includes('--update')) {
  const o = {};
  for (const k in found) o[k] = found[k].map(x => x[1]);
  fs.writeFileSync(bp, JSON.stringify(o, null, 1) + '\n');
  console.log('baseline written: ' + Object.values(o).reduce((a, b) => a + b.length, 0) + ' lines');
  process.exit(0);
}
const base = fs.existsSync(bp) ? JSON.parse(fs.readFileSync(bp, 'utf8')) : {};
let bad = 0,
  gone = 0,
  old = 0;
for (const k in found) {
  const left = (base[k] || []).slice();
  for (const [n, l] of found[k]) {
    const j = left.indexOf(l);
    if (j >= 0) {
      left.splice(j, 1);
      old++;
    } else {
      bad++;
      console.log(`NEW ${k}:${n}: ${l.slice(0, 200)}`);
    }
  }
}
for (const k in base) {
  const now = (found[k] || []).map(x => x[1]);
  for (const l of base[k]) if (!now.includes(l)) gone++;
}
console.log(`no-fit: ${old} old fits left (baseline, findings D27 ~ D36), ${gone} removed${gone ? ' (run --update)' : ''}, ${bad} new`);
if (bad) {
  console.log('FAIL: a physics value keyed on the load or fitted to a plant trend / snapshot (RULES.md 3.12). Use first principles and the design geometry, or a logic curve for a set point, and tag the line DESIGN-SRC: / LOGIC-SRC: <source>.');
  process.exit(1);
}
