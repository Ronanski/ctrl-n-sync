/* Phase 8 TAPOS gate (communications; user OPLAN TRANSLATED, phases in order). From the 150 MW start (tools/trace/world.cjs, the app's
   own engine headless) every named Modbus row is read through its end: the turbine list (src/data/tcs-dcs.json modbus, TCE_IO mbRead) and
   the package PLC lists (src/ui/plant/modbus.js fly ash / ESP / CTCS, AN.pkgRead). docs/PHASES.md row 8 may say TAPOS only when:
   - every row with no value is in docs/phase8/open.json, and every row there still has no value (the list is exact);
   - every group has its reason, and none is of type open (b = correct with no value, c = NO-SOURCE after every doc was read,
     m = the link works and the value needs the plant model, owner Phase 11).
   While row 8 is not TAPOS the gate passes and prints what is left. */
'use strict';
const fs = require('fs'),
  path = require('path');
const { load, root } = require(path.join(__dirname, '..', '..', '..', 'tools', 'trace', 'world.cjs'));
let bad = 0;
const fail = m => (bad++, console.log('FAIL', m));
(async () => {
  const O = JSON.parse(fs.readFileSync(path.join(root, 'docs/phase8/open.json'), 'utf8')),
    tapos = /^\|\s*8\s*\|[^|]*\|[^|]*\|\s*TAPOS\s*\|/m.test(fs.readFileSync(path.join(root, 'docs/PHASES.md'), 'utf8'));
  const E = load();
  E.ctx.__io = JSON.parse(fs.readFileSync(path.join(root, 'src/data/tcs-io.json'), 'utf8'));
  E.ctx.__mb = JSON.parse(fs.readFileSync(path.join(root, 'src/data/tcs-dcs.json'), 'utf8')).modbus;
  const w = {};
  new Function('window', fs.readFileSync(path.join(root, 'src/ui/plant/modbus.js'), 'utf8'))(w);
  E.ctx.__pk = w.DCS_MODBUS.filter(r => ['fa', 'esp', 'ctcs'].includes(r[0])).map(r => [r[0], r[1]]);
  E.js('window.TCE_IO_LIVE = TCE_IO.make(__io)');
  await E.start('150');
  E.step(20);
  const L = JSON.parse(
    E.js(`(()=>{const U=AN.unit,o={turbine:[],fa:[],esp:[],ctcs:[]},n={turbine:0,fa:0,esp:0,ctcs:0};
      for(const m of __mb){if(!m.tag&&!m.d)continue;n.turbine++;if(!isFinite(TCE_IO_LIVE.mbRead(U,m.to)))o.turbine.push(String(m.ma))}
      for(const [s,a] of __pk){n[s]++;if(!isFinite(AN.pkgRead(s,a)))o[s].push(String(a))}
      return JSON.stringify({o,n})})()`)
  );
  const types = {};
  for (const g of O.groups) {
    if (!/^(b|c|m|open)$/.test(g.type)) fail(g.sys + ' group type ' + g.type + ' (b, c, m or open)');
    if (!g.why || g.why.length < 30) fail(g.sys + ' group with no reason: ' + (g.names || [])[0]);
    if (g.type === 'open' && !g.owner) fail(g.sys + ' open group with no owner');
    types[g.type] = (types[g.type] || 0) + g.rows.length;
  }
  let unlisted = 0,
    gone = 0;
  for (const s of Object.keys(L.o)) {
    const listed = new Set(O.groups.filter(g => g.sys === s).flatMap(g => g.rows)),
      live = new Set(L.o[s]);
    const u = L.o[s].filter(a => !listed.has(a)),
      x = [...listed].filter(a => !live.has(a));
    unlisted += u.length;
    gone += x.length;
    console.log(
      '  ' + s + ': ' + (L.n[s] - L.o[s].length) + ' of ' + L.n[s] + ' rows with a value; no value ' + L.o[s].length +
        (u.length ? ', NOT LISTED ' + u.slice(0, 8).join(' ') : '') + (x.length ? ', listed but has a value now ' + x.slice(0, 8).join(' ') : '')
    );
  }
  console.log('  no-value rows by type: ' + JSON.stringify(types));
  const left = [];
  if (unlisted) left.push(unlisted + ' rows with no value not in docs/phase8/open.json');
  if (gone) left.push(gone + ' rows in docs/phase8/open.json have a value now (remove them)');
  if (types.open) left.push(types.open + ' rows still open');
  if (tapos) for (const m of left) fail('row 8 is TAPOS but ' + m);
  else console.log(left.length ? 'row 8 BAHAGI, left: ' + left.join('; ') : 'row 8 BAHAGI: every condition met, it may be marked TAPOS');
  console.log(bad ? 'FAIL phase8-gate: ' + bad : 'PASS phase8-gate' + (tapos ? ': row 8 TAPOS, every condition met' : ''));
  process.exit(bad ? 1 : 0);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
