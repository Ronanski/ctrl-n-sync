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
/* Phase 11 (2026-11-27, port / balance thread): the 7 model parts move code out of unit.js into their own files. A flagged line that
   moves keeps its baseline entry (the match is by the line, in any file), so a move never needs --update. Two more patterns, read on
   the CODE only (comments taken out first): a value divided by the MCR (/ 460, / U.mcr), which keys a physics value on the load
   (the one line of 2026-11-27, hx.js anHxSettle gas mass pro rata on the steam, is in the baseline). CEILING = the most flagged lines there may ever be: it only goes down. */
const STRICT = /\/\s*(U\.)?mcr\b|\/\s*460\b/;
const CEILING = 45;
const code = s =>
  s
    .replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '))
    .split(/\r?\n/)
    .map(l => l.replace(/(^|[^:'"\\])\/\/.*$/, '$1'));
const found = {};
for (const f of files.sort()) {
  const rel = path.relative(root, f).split(path.sep).join('/'),
    src = fs.readFileSync(f, 'utf8'),
    C = code(src);
  src.split(/\r?\n/).forEach((l, i) => {
    if ((WORDS.test(l) || LOAD.test(l) || STRICT.test(C[i] || '')) && !TAG.test(l)) (found[rel] = found[rel] || []).push([i + 1, norm(l)]);
  });
}
const bp = path.join(__dirname, 'no-fit-baseline.json');
if (process.argv.includes('--update')) {
  const o = {};
  for (const k in found) o[k] = found[k].map(x => x[1]);
  const nNew = Object.values(o).reduce((a, b) => a + b.length, 0);
  const nNow = fs.existsSync(bp) ? Object.values(JSON.parse(fs.readFileSync(bp, 'utf8'))).flat().length : CEILING;
  if (nNew > Math.min(CEILING, nNow)) {
    console.log('REFUSED: ' + nNew + ' flagged lines, more than the baseline has now (' + nNow + ', ceiling ' + CEILING + '). A new fit is not added to the baseline: fix it.');
    process.exit(1);
  }
  fs.writeFileSync(bp, JSON.stringify(o, null, 1) + '\n');
  console.log('baseline written: ' + Object.values(o).reduce((a, b) => a + b.length, 0) + ' lines');
  process.exit(0);
}
const base = fs.existsSync(bp) ? JSON.parse(fs.readFileSync(bp, 'utf8')) : {};
/* one pool of baseline lines for all files: a line moved to another file still matches */
const pool = Object.values(base).flat(),
  nBase = pool.length;
let bad = 0,
  gone = 0,
  old = 0,
  moved = 0;
if (nBase > CEILING) {
  bad++;
  console.log('baseline has ' + nBase + ' lines, more than the ceiling ' + CEILING + ': a new fit was added to the baseline');
}
for (const k in found)
  for (const [n, l] of found[k]) {
    const j = pool.indexOf(l);
    if (j >= 0) {
      pool.splice(j, 1);
      old++;
      if (!(base[k] || []).includes(l)) moved++;
    } else {
      bad++;
      console.log(`NEW ${k}:${n}: ${l.slice(0, 200)}`);
    }
  }
gone = pool.length;
console.log(`no-fit: ${old} old fits left (baseline, findings D27 ~ D36; ${moved} moved to another file), ${gone} removed${gone ? ' (run --update)' : ''}, ${bad} new; ceiling ${CEILING}`);
if (bad) {
  console.log('FAIL: a physics value keyed on the load or fitted to a plant trend / snapshot (RULES.md 3.12). Use first principles and the design geometry, or a logic curve for a set point, and tag the line DESIGN-SRC: / LOGIC-SRC: <source>.');
  process.exit(1);
}
