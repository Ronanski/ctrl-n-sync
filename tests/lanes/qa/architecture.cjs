/* Phase 3 ARCHITECTURE (user 2026-11-25 "sunod sunod"): docs/ARCHITECTURE.md says the scan, the order and the timing as they are in the
   code. This test reads the numbers of its section 6 and finds each one in the code; it fails when the code and the document differ, so
   neither can change without the other. (Repeatability itself is the behaviour gate, tests/gate/behaviour.cjs, in Checks.) */
const fs = require('fs'),
  path = require('path');
const root = path.resolve(__dirname, '..', '..', '..');
const rd = f => fs.readFileSync(path.join(root, f), 'utf8');
let bad = 0;
const fail = m => (console.log('FAIL ' + m), bad++);
const D = rd('docs/ARCHITECTURE.md');
const m = /## 6\.[\s\S]*?```json\n([\s\S]*?)```/.exec(D);
if (!m) {
  console.log('FAIL architecture: docs/ARCHITECTURE.md has no section 6 json');
  process.exit(1);
}
const W = JSON.parse(m[1]);
const sched = rd('src/analog/engine/sched.js'),
  tsh = rd('src/analog/engine/tcs-sheets.js'),
  tdc = rd('src/analog/engine/tcs-dcs.js');
const num = (src, re, name) => {
  const x = re.exec(src);
  if (!x) return fail(name + ': not found in the code'), NaN;
  return +x[1];
};
const same = (name, doc, code) => doc === code || fail(name + ': document ' + doc + ', code ' + code);
same('abcTickMs', W.abcTickMs, num(sched, /dt = Math\.min\(anTick\(\)[\s\S]*?\}, (\d+)\);/, 'ABC tick interval'));
same('worldIdleMs', W.worldIdleMs, num(sched, /for \(const _ of g\);\s*\}, (\d+)\);/, 'world interval'));
same('plantStepS', W.plantStepS, num(sched, /want = Math\.ceil\(dt \/ ([\d.]+)\)/, 'plant step'));
same('plantStepMaxS', W.plantStepMaxS, num(sched, /const AN_STEP_MAX = ([\d.]+);/, 'AN_STEP_MAX'));
const ch = /worldChunk = \(\) => \(window\.WORLD && WORLD\.busy \? ([\d.]+) : ([\d.]+)\)/.exec(sched) || [];
same('worldChunkBusyS', W.worldChunkBusyS, +ch[1]);
same('worldChunkQuietS', W.worldChunkQuietS, +ch[2]);
same('fixedStepS', W.fixedStepS, num(sched, /AN\.runFixed = \(sec, dt\) => \{[\s\S]*?dt > 0 \? dt : ([\d.]+)/, 'fixed clock step'));
same('tcsSliceS', W.tcsSliceS, num(tsh, /slice: ([\d.]+)/, 'TCS slice'));
same('tcsSlowS', W.tcsSlowS, num(tsh, /slow: ([\d.]+)/, 'TCS slow'));
/* every TCS sheet scans at its own drawing cycle (10 / 30 / 100 ms): the drive loop and the loop of the other sheets both step
   q.cyc, never a longer step (2026-11-25 8:45 PM, Phase 3 item 2) */
if ((tsh.match(/q\.acc >= q\.cyc - 1e-9; q\.acc -= q\.cyc\) R\.scan\(p, q, q\.cyc\)/g) || []).length !== 2 || /R\.scan\(p, q, Math\.max/.test(tsh))
  fail('tcs-sheets.js: a TCS sheet does not scan at its own cycle (both loops must step q.cyc)');
same('tcsDriveSheets', W.tcsDriveSheets, (/ids: '([^']+)'/.exec(tsh) || ['', ''])[1].split(' ').filter(Boolean).length);
same('tcsHwOutputs', W.tcsHwOutputs, (/TCS_HW = new Set\(\s*\(([\s\S]*?)\)\.split/.exec(tdc) || ['', ''])[1].replace(/['+\s]+/g, ' ').trim().split(' ').length);
const cyc = {};
for (const f of fs.readdirSync(path.join(root, 'src/digital/tce'))) {
  const x = /controller ([A-Z+?]+), cycle (\d+) ms/.exec(rd('src/digital/tce/' + f).slice(0, 600));
  if (x) cyc[x[1] + ' ' + x[2]] = (cyc[x[1] + ' ' + x[2]] || 0) + 1;
}
for (const k of new Set([...Object.keys(cyc), ...Object.keys(W.tcsCycles)])) same('tcsCycles ' + k, W.tcsCycles[k], cyc[k]);
const J = JSON.parse(rd('src/data/tcs-dcs.json'));
same('tcsDcsRows', W.tcsDcsRows, J.rows.length);
same('modbusRows', W.modbusRows, (Array.isArray(J.modbus) ? J.modbus : Object.keys(J.modbus)).length);
for (const h of ['## 1.', '## 2.', '## 3.', '## 4.', '## 5.']) if (!D.includes(h)) fail('docs/ARCHITECTURE.md has no section ' + h);
if (!fs.existsSync(path.join(root, 'tests/gate/behaviour.cjs'))) fail('the repeatability gate tests/gate/behaviour.cjs is gone');
console.log((bad ? 'FAIL' : 'PASS') + ' architecture: ' + Object.keys(W).length + ' numbers of docs/ARCHITECTURE.md held against the code');
process.exit(bad ? 1 : 0);
