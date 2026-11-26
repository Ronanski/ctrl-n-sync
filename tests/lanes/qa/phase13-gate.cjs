/* PHASE 13 (instructor station) gate, static part; the browser part is tests/gate/instructor.cjs (its own step in Checks).
   Fails when docs/PHASES.md row 13 is TAPOS and: the browser gate is not a step of .github/workflows/checks.yml, it no longer tests one of
   the instructor functions of docs/ACCEPTANCE.md "Gamit ng instructor" (freeze, save / load, backtrack, slow / fast speed, malfunction,
   field action, the Warm / Hot restarts), the app has no backtrack (app.js lsSaves.back), the speed has no slow choice, or the Plant menu
   loses a starting point. Always fails when an instructor console, a scoring or a guided start-up comes back (RULES.md 3.2). */
const fs = require('fs'),
  path = require('path');
const root = path.resolve(__dirname, '..', '..', '..');
const rd = f => fs.readFileSync(path.join(root, f), 'utf8');
let bad = 0;
const fail = m => (console.log('FAIL ' + m), bad++);
const P = rd('docs/PHASES.md'),
  row = (/^\| 13 \| [^|]+\|[^|]+\| (TAPOS|BAHAGI|HINDI PA) \|/m.exec(P) || [])[1];
if (!row) fail('PHASES.md has no row 13');
const G = rd('tests/gate/instructor.cjs'),
  CK = rd('.github/workflows/checks.yml'),
  APP = rd('src/ui/shell/app.js'),
  MAIN = rd('src/analog/ui/main.js'),
  ST = rd('src/station/station.js');
const need = [
  ['freeze', /Paused: the plant time stands/],
  ['slow speed', /'x0\.5: '/],
  ['fast speed', /'x5: '/],
  ['save on the menu', /'Save now'/],
  ['backtrack', /Back: the plant time is that of the first point/],
  ['malfunction', /the fault is put on by two presses/],
  ['field action', /field action: ring header drains/],
  ['Warm / Hot restarts', /for \(const k of \['Warm', 'Hot'\]\)/]
];
if (row === 'TAPOS') {
  if (!/node tests\/gate\/instructor\.cjs /.test(CK)) fail('checks.yml does not run tests/gate/instructor.cjs');
  for (const [k, re] of need) if (!re.test(G)) fail('instructor.cjs no longer tests ' + k);
  if (!/window\.lsSaves\.back = \{/.test(APP)) fail('app.js has no backtrack (lsSaves.back)');
  if (!/\[0\.5, 1, 5, 10, 60, 300\]/.test(MAIN)) fail('the Simulation speed has no slow choice x0.5');
  for (const id of ['load150', 'loadcold', 'loadwarm', 'loadhot']) if (!ST.includes("'" + id + "'")) fail('Plant menu has no starting point ' + id);
  if (!/node tests\/gate\/behaviour\.cjs /.test(CK)) fail('checks.yml does not run the SAVE / LOAD behaviour gate');
}
/* RULES.md 3.2: no training, no guided start-up, no instructor console, no scoring in the station */
if (/['"]Instructor['"]|st-instr|score\s*\(/i.test(ST)) fail('station.js has an instructor console or a scoring again (RULES.md 3.2)');
console.log((bad ? 'FAIL' : 'PASS') + ' phase13-gate: row 13 ' + row + ', ' + need.length + ' instructor functions in the browser gate');
process.exit(bad ? 1 : 0);
