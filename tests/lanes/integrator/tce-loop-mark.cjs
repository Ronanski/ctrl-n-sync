/* TCS sheets: the crossed circle is the loop mark (not an inversion), a wire keyed by a macro takes the pin it starts at, and "(*)" is this
   same sheet. MAIN OIL PUMP TCE300 (IBD TB-1 / TB-2): the standby in AUTO starts on the low discharge of the RUNNING pump after 10 s. */
'use strict';
const fs = require('fs'),
  path = require('path'),
  assert = require('assert');
const root = path.join(__dirname, '..', '..', '..');
global.window = global;
require(path.join(root, 'src/digital/tce-run.js'));
const R = global.TCE_RUN;
for (const f of fs.readdirSync(path.join(root, 'src/digital/tce')).sort((a, b) => (a[0] === '_' ? -1 : b[0] === '_' ? 1 : a < b ? -1 : 1))) require(path.join(root, 'src/digital/tce', f));
const S = global.TCE_SHEETS,
  by = id => S.find(s => s.id === id);
assert(S.length > 400, 'sheets loaded');
const all = R.compile(S);
/* no block input of a sheet is inverted by a mark */
for (const p of all.plan) for (const x of p.nodes) if (x.t === 'b') assert(!x.inv.some(Boolean), p.id + ' ' + x.key + ' inverted input');
/* "(*)" connectors have their source on the sheet */
for (const k of ['CON:TCE300.B3', 'CON:TCE305.B2', 'CON:TCE210.B', 'CON:TCA634.A']) assert(!all.ports.includes(k), k + ' has no source');
const at = (id, key) => all.names[all.plan.find(p => p.id === id).nodes.find(n => n.key === key).ins[0]];
assert.strictEqual(at('TCE300', 'not013'), 'TCE300:b007.RUN');
assert.strictEqual(at('TCE300', 'tp001'), 'TCE300:b021.RUN');
assert.strictEqual(at('TCE300', 'or028'), 'TCE300:b007.ABN');
const out = (id, L) => all.nets.find(n => n.id === id).outputs.find(o => o.kind === 'c' && o.letter === L).net;
assert.strictEqual(out('TCE220', 'C'), 'vtA.FTEST');
assert.strictEqual(out('TCE310', 'B'), 'b006.SPS');
/* TCE300 running: MOP(A) in service, MOP(B) in AUTO; MOP(A) discharge falls: MOP(B) starts; not before MOP(A) RUNNING for 10 s */
const p = R.compile(['TCE300', 'TCE040', 'TCE042', 'TCE102', 'TCE104'].map(by));
const port = re => p.ports.find(k => re.test(k)),
  set = (re, v) => assert(R.set(p, port(re), v), String(re));
const runA = /^PIO:TCE040\.di3/,
  runB = /^PIO:TCE042\.di3/;
set(/^REF:INITIAL/, 1);
set(/^PIO:TCE930-2$/, 6.6);
set(/^PIO:TCE930-10$/, 0);
set(/^CRT:TCE300\.b021\.AUTO/, 1);
R.step(p, 0.3);
set(/^CRT:TCE300\.b021\.AUTO/, 0);
set(/^CRT:TCE300\.b007\.START/, 1);
R.step(p, 0.3);
set(/^CRT:TCE300\.b007\.START/, 0);
const sts = k => R.get(p, 'TCE300', k + '.STS');
assert.strictEqual(sts('b007'), 1);
set(runA, 1);
for (let i = 0; i < 80; i++) R.step(p, 0.25);
assert.strictEqual(sts('b021'), 0);
set(/^PIO:TCE930-2$/, 5.0);
for (let i = 0; i < 30; i++) R.step(p, 0.03);
assert.strictEqual(sts('b021'), 1, 'standby start on low discharge');
console.log('TCS loop mark, macro pins, (*) connectors, TCE300 standby start: OK');
