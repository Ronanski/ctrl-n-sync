/* Phase 8 (2026-11-26): the package PLCs on the Modbus link (src/analog/engine/pkg.js), headless (tools/trace/world.cjs).
   1. the address reader: '40001.1' = bit 10, '40001.01' = bit 1 (the lists keep the address as a number)
   2. from the "Normal operation at full load" start, the rows of the fly ash / ESP / CTCS lists with a value may not go down
   3. CTCS at 150 MW: STOP as the plant snapshot (OPERATING_POINTS: CTCS-A / B STOP), ready to start (seawater pumps running), remote auto
   4. the CTCS cycle of CT-CP: N01 opens with F01, watering 5 min after AUTO START, N02 opens = balls in circulation, 8 h, collection
      30 min, N01 closes, F01 off, idle 16 h, then N01 again without watering; a stop in the run closes in the cycle-end order
   5. the watchdog bits change every exchange
   6. ESP (ESP-OM): in service at 150 MW (TR sets on, DE rapping, purge fan on, heaters off); CE rapping 2 min on, 7 / 13 / 19 / 25 / 31
      min off for fields 1 ~ 5; after the TRs go off the CE rapping runs continuous for 2 h, then the aux devices stop */
'use strict';
const fs = require('fs'),
  path = require('path');
const { load, root } = require(path.join(__dirname, '..', '..', '..', 'tools', 'trace', 'world.cjs'));
const MIN = 214;
let bad = 0;
const ok = (c, m) => {
  if (!c) bad++;
  console.log((c ? 'PASS ' : 'FAIL ') + m);
};
(async () => {
  const E = load();
  const w = {};
  new Function('window', fs.readFileSync(path.join(root, 'src/ui/plant/modbus.js'), 'utf8'))(w);
  E.ctx.__mb = w.DCS_MODBUS.filter(r => ['fa', 'esp', 'ctcs'].includes(r[0])).map(r => [r[0], r[1]]);
  const b = JSON.parse(E.js(`JSON.stringify(['40001','40001.01','40001.1','40001.15','40026.1'].map(a=>AN.pkgBit(a).b))`));
  ok(JSON.stringify(b) === '[0,1,10,15,10]', 'Modbus address bits: ' + b.join(' '));
  await E.start('150');
  E.step(10);
  const r = JSON.parse(
    E.js(`(()=>{const o={n:__mb.length,ok:0,by:{}};for(const [s,a] of __mb){const v=AN.pkgRead(s,a);if(isFinite(v)){o.ok++;o.by[s]=(o.by[s]||0)+1}}
      const c=AN.unit.pkg.ct;o.A={ph:c.A.ph,ready:c.A.ready,rem:c.A.rem};o.B={ph:c.B.ph,ready:c.B.ready};return JSON.stringify(o)})()`)
  );
  ok(r.n === 562, 'fly ash / ESP / CTCS rows: ' + r.n + ' of 562');
  ok(r.ok >= MIN, 'rows with a value at 150 MW: ' + r.ok + ' ' + JSON.stringify(r.by) + ' (may not go below ' + MIN + ')');
  ok(r.A.ph === 'init' && r.B.ph === 'init', 'CTCS-A / B stopped at 150 MW (snapshot STOP)');
  ok(r.A.ready === 1 && r.B.ready === 1 && r.A.rem === 1, 'CTCS ready to start: remote auto, no fail, seawater pump running');
  const wd = JSON.parse(E.js(`JSON.stringify(AN.pkgRead('esp','30018.15'))`));
  E.step(1);
  const wd2 = JSON.parse(E.js(`JSON.stringify(AN.pkgRead('esp','30018.15'))`));
  ok((wd === 0 || wd === 1) && wd2 === 1 - wd, 'ESP watchdog changes every exchange: ' + wd + ' -> ' + wd2);
  /* the cycle, the program alone */
  const s = JSON.parse(
    E.js(`(()=>{const P=AN._pkg,c=P.ctNew(),L=[];let t=0,last='';const step=(dt,st,sp)=>{P.ctStep(c,dt,true,!!st,!!sp);t+=dt;if(c.ph!==last){L.push([Math.round(t),c.ph,c.f01,c.circ]);last=c.ph}};
      step(1,1,0);for(let i=0;i<26*3600+2000;i+=10)step(10,0,0);
      const L1=L.slice();L.length=0;last='';const d=P.ctNew();t=0;
      const st2=(dt,a,b)=>{P.ctStep(d,dt,true,a,b);t+=dt;if(d.ph!==last){L.push([Math.round(t),d.ph]);last=d.ph}};
      st2(1,1,0);for(let i=0;i<400;i+=5)st2(5,0,0);st2(1,0,1);for(let i=0;i<3600;i+=10)st2(10,0,0);
      return JSON.stringify({L1,L2:L})})()`)
  );
  const ph = s.L1.map(x => x[1]).join(' > ');
  console.log('  cycle: ' + s.L1.map(x => x[0] + 's ' + x[1]).join(', '));
  ok(ph.startsWith('open1 > water > open2 > run > close2 > coll > close1 > idle > open1 > open2'), 'cycle order, second cycle without watering: ' + ph);
  const at = p => (s.L1.find(x => x[1] === p) || [])[0];
  ok(Math.abs(at('open2') - at('water') - 300) <= 10, 'watering 5 min');
  ok(Math.abs(at('close2') - at('run') - 8 * 3600) <= 10, 'balls in circulation 8 h');
  ok(Math.abs(at('close1') - at('coll') - 1800) <= 10, 'ball collection 30 min');
  ok(s.L1.find(x => x[1] === 'run')[3] === 1 && s.L1.find(x => x[1] === 'idle')[2] === 0, 'balls in circulation bit in run, F01 off in idle');
  ok(s.L2.map(x => x[1]).join(' > ').endsWith('close2 > coll > close1 > init'), 'stop in the run: N02, collection, N01, initial: ' + s.L2.map(x => x[1]).join(' > '));
  const e = JSON.parse(
    E.js(`(()=>{const R=n=>AN.pkgRead('esp',n);const P=AN._pkg;
      const tr=[0,1,2,3,4].map(i=>R('30018.'+String(3*i+1).padStart(2,'0')));
      const duty=[0,1,2,3,4].map(f=>{let on=0,n=0;for(let t=0;t<40*60*9;t+=10){on+=P.espCe({on:1,t},f);n++}return +(on/n).toFixed(3)});
      const post=[P.espCe({on:0,toff:3600,t:0},0),P.espCe({on:0,toff:7300,t:0},0),P.espAux({on:0,toff:3600}),P.espAux({on:0,toff:7300})];
      return JSON.stringify({tr,de:R('30002.01'),fan:R('30006.01'),heat:R('30006.04'),tm:[R('30081'),R('30082'),R('30090'),R('40162')],il:R('30112'),duty,post})})()`)
  );
  ok(e.tr.every(x => x === 1) && e.de === 1 && e.fan === 1 && e.heat === 0, 'ESP at 150 MW: TR01 ~ 05 run, DE rapping, purge fan on, heater off');
  ok(JSON.stringify(e.tm) === '[2,7,31,7]' && e.il === 100, 'CE timers 2 / 7 ... 31 min, current limit 100 %: ' + e.tm.join(' '));
  const dx = [7, 13, 19, 25, 31].map(o => 2 / (2 + o));
  ok(e.duty.every((d, i) => Math.abs(d - dx[i]) < 0.01), 'CE rapping duty 2 / (2 + off): ' + e.duty.join(' '));
  ok(JSON.stringify(e.post) === '[1,0,1,0]', 'after the TRs go off: CE continuous and aux on for 2 h, then off');
  process.exit(bad ? 1 : 0);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
