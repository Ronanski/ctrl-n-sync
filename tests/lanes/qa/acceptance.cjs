/* Phase 2 ACCEPTANCE (user 2026-11-25 "sunod sunod"): the pass / fail list is written first and cannot drift.
   Fails when:
   - a Part 1 row of docs/ACCEPTANCE.md has no target row in docs/accept/part1-targets.json, or a target number of the JSON is not the
     number written in that row for that load (the table and the data must say the same);
   - a target row has no source or no tolerance;
   - tools/accept/part1.cjs keeps its own target table instead of reading the JSON;
   - a Part 2 row has no source, no "Pasado kapag" or no known state (TAMA / MAY / KULANG / HINDI NASURI);
   - the "Bilang" section does not match the tables (items of Part 1, 2 and 3, and the passed count). */
const fs = require('fs'),
  path = require('path');
const root = path.resolve(__dirname, '..', '..', '..');
const rd = f => fs.readFileSync(path.join(root, f), 'utf8');
let bad = 0;
const fail = m => (console.log('FAIL ' + m), bad++);
const A = rd('docs/ACCEPTANCE.md');
const sec = (a, b) => {
  const i = A.indexOf(a), j = b ? A.indexOf(b, i + 1) : A.length;
  return i < 0 ? '' : A.slice(i, j < 0 ? A.length : j);
};
const rowsOf = s =>
  s.split('\n').filter(l => l.startsWith('| ') && !/^\| \*\*|^\|---/.test(l)).slice(1).map(l => l.split('|').slice(1, -1).map(c => c.trim()));
const nums = c => (String(c).replace(/(\d),(\d{3})/g, '$1$2').match(/-?\d+(\.\d+)?/g) || []).map(Number);
// Part 1
const P1 = rowsOf(sec('## Part 1', '## Part 2'));
const J = JSON.parse(rd('docs/accept/part1-targets.json'));
const loadRows = P1.filter(r => !/^Galaw/.test(r[0]));
for (const r of loadRows) if (!J.rows.some(j => r[0].startsWith(j.row))) fail('Part 1 row "' + r[0] + '" has no target row in part1-targets.json');
for (const j of J.rows) {
  const r = loadRows.find(x => x[0].startsWith(j.row));
  if (!r) {
    fail('target ' + j.key + ': no Part 1 row starts with "' + j.row + '"');
    continue;
  }
  if (!j.src) fail('target ' + j.key + ' has no source');
  if (typeof j.tol !== 'number' || (j.kind !== 'band' && !(j.tol > 0))) fail('target ' + j.key + ' has no tolerance');
  if (j.tolText ? r[4] !== j.tolText : j.kind !== 'band' && !nums(r[4]).includes(j.tol)) fail('target ' + j.key + ': tolerance ' + j.tol + ' is not in the table cell "' + r[4] + '"');
  j.t.forEach((t, i) => {
    const cell = nums(r[1 + i]);
    if (t == null) return;
    const want = j.kind === 'band' ? (cell.includes(t[0]) && cell.includes(t[1])) || (cell.includes((t[0] + t[1]) / 2) && cell.includes((t[1] - t[0]) / 2)) : cell.includes(t);
    if (!want) fail('target ' + j.key + ' at ' + J.loads[i] + ' MW is ' + JSON.stringify(t) + ', the table says "' + r[1 + i] + '"');
  });
}
const tool = rd('tools/accept/part1.cjs');
if (!/part1-targets\.json/.test(tool) || /\['MSF',\s*'Main steam flow/.test(tool)) fail('tools/accept/part1.cjs does not read docs/accept/part1-targets.json');
// Part 2
const P2 = rowsOf(sec('## Part 2', '## Part 3'));
const STATE = /^(TAMA|MAY|KULANG|HINDI NASURI)/;
for (const r of P2) {
  if (r.length < 4) continue;
  if (!r[1]) fail('Part 2 "' + r[0] + '" has no source');
  if (!STATE.test(r[2])) fail('Part 2 "' + r[0] + '" has no known state ("' + r[2].slice(0, 30) + '")');
  if (!r[3]) fail('Part 2 "' + r[0] + '" has no "Pasado kapag"');
}
const P3 = (sec('## Part 3', null).match(/^\d+\. /gm) || []).length ? 1 : 0;
// Bilang
const B = sec('## Bilang', '## Part 1');
const n = re => +((re.exec(B) || [])[1] || NaN);
const p1n = n(/Part 1[^:]*: (\d+) na item/), p2n = n(/Part 2[^:]*: (\d+) na item/), p3n = n(/Part 3[^:]*: (\d+) item/);
const p2pass = P2.filter(r => /^TAMA/.test(r[2] || '')).length;
const sumPass = n(/Kabuuan: (\d+) pasado/), sumLeft = n(/pasado, (\d+) natitira/);
if (p1n !== P1.length) fail('Bilang says Part 1 has ' + p1n + ' items, the table has ' + P1.length);
if (p2n !== P2.length) fail('Bilang says Part 2 has ' + p2n + ' items, the table has ' + P2.length);
if (p3n !== P3) fail('Bilang says Part 3 has ' + p3n + ' item, the section has ' + P3);
const p1pass = P1.filter(r => /^pasado/i.test(r[r.length - 1] || '')).length;
if (sumPass !== p1pass + p2pass) fail('Bilang says ' + sumPass + ' passed, the tables have ' + (p1pass + p2pass));
if (sumPass + sumLeft !== P1.length + P2.length + P3) fail('Bilang passed + left = ' + (sumPass + sumLeft) + ', items = ' + (P1.length + P2.length + P3));
console.log((bad ? 'FAIL' : 'PASS') + ' acceptance: Part 1 ' + P1.length + ' rows / ' + J.rows.length + ' targets, Part 2 ' + P2.length + ' rows, Part 3 ' + P3 + '; passed ' + (p1pass + p2pass));
process.exit(bad ? 1 : 0);
