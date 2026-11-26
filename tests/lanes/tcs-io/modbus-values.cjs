/* Phase 8 (2026-11-26): the turbine Modbus list in the running app. From the "Normal operation at full load" start (tools/trace/world.cjs,
   the app's own engine headless), every named row of src/data/tcs-dcs.json modbus is read through its TCS end (TCE_IO mbRead, the read the
   Library and the turbine pages show). Held: the rows with a value may not go down (213 of 237 on 2026-11-26: the generator current,
   Mvar and field from tcs-gen.js tcsGenPh); a row with no value must be a "needs" end (it says what is missing) or a DCS command that
   stands at no command, never an end that should read but does not. Also: the generator values are physical at 150 MW. */
'use strict';
const fs = require('fs'),
  path = require('path');
const { load, root } = require(path.join(__dirname, '..', '..', '..', 'tools', 'trace', 'world.cjs'));
const MIN = 214; /* 213 -> 214 (2026-11-27): the power factor (GEE-2015-0141 p13) */
let bad = 0;
const ok = (c, m) => {
  if (!c) bad++;
  console.log((c ? 'PASS ' : 'FAIL ') + m);
};
(async () => {
  const E = load();
  E.ctx.__io = JSON.parse(fs.readFileSync(path.join(root, 'src/data/tcs-io.json'), 'utf8'));
  E.ctx.__mb = JSON.parse(fs.readFileSync(path.join(root, 'src/data/tcs-dcs.json'), 'utf8')).modbus;
  E.js('window.TCE_IO_LIVE = TCE_IO.make(__io)');
  await E.start('150');
  E.step(20);
  const r = JSON.parse(
    E.js(`(()=>{const U=AN.unit,o={n:0,ok:0,odd:[]};
      for(const m of __mb){if(!m.tag&&!m.d)continue;o.n++;const v=TCE_IO_LIVE.mbRead(U,m.to),e=TCE_IO_LIVE.mbEnd(m.to),k=e?e.kind:'none';
        if(isFinite(v))o.ok++;else if(!(k==='needs'||(k==='out'&&m.sh==='DCS to PLC')))o.odd.push(m.ma+' '+m.to+' '+k);}
      const g=U.gen;o.g={I:g.I*7.384,Q:g.Q*176.5,pf:g.pf,V:g.V,ifd:g.efd*4.5,P:U.MW};return JSON.stringify(o)})()`)
  );
  ok(r.n === 237, 'named turbine Modbus rows: ' + r.n + ' of 237');
  ok(r.ok >= MIN, 'rows with a value at 150 MW: ' + r.ok + ' (may not go below ' + MIN + ')');
  ok(!r.odd.length, 'rows with no value whose end should read: ' + (r.odd.join(', ') || 'none'));
  const g = r.g,
    Ip = (g.P / (Math.sqrt(3) * 13.8 * g.V * g.pf)); /* kA from P = sqrt(3) V I pf */
  ok(Math.abs(g.V - 1) < 0.01, 'generator terminal voltage held by the AVR: ' + g.V.toFixed(4) + ' pu');
  ok(Math.abs(g.I - Ip) < 0.01 * Ip, 'stator current ' + g.I.toFixed(3) + ' kA = P / (sqrt3 V pf) ' + Ip.toFixed(3) + ' kA');
  ok(g.pf > 0.9 && g.pf <= 1 && g.I < 7.384, 'inside the rating: pf ' + g.pf.toFixed(4) + ', ' + g.I.toFixed(3) + ' kA < 7.384 kA');
  ok(g.ifd > 4.5 && g.ifd < 17.6, 'exciter field ' + g.ifd.toFixed(2) + ' A between no load 4.5 A and ceiling 17.6 A (GEE-2015-0152 p6)');
  process.exit(bad ? 1 : 0);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
