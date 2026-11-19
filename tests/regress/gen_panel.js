// Generator control panel (src/analog/engine/gen-panel.js, user "go all" 2026-11-19 item 5). From Start at 150 MW: the panel reads the
// generator on the grid; SPEED RAISE and 52G CLOSE are refused on the grid; AVR MANUAL is bumpless and VOLTAGE RAISE moves the field;
// then the instructor operates 86T (GEE-2015-0173 rows 33 / 66): 86G-A and 86G-B operate, TA-9 inputs 17 / 19 trip the turbine, the
// RESET is refused while 86T stands and accepted after it is cleared. Usage: node tests/regress/gen_panel.js [html]
const {open}=require('./lib.js');const fs=require('fs');
const html=process.argv.find(a=>/\.html$/.test(a))||'dist/'+fs.readdirSync('dist').find(x=>/^logic-sim-v[\d.]+(?:-beta\.\d+)?\.html$/.test(x));
(async()=>{const {browser,page,errs}=await open(html);await page.waitForFunction(()=>AN.sheets&&AN.sheets.length>=54&&window.WORLD&&WORLD.idx&&window.DITL150,null,{timeout:120000});await page.waitForTimeout(2000);let fail=0;const ck=(ok,w)=>{console.log((ok?'PASS ':'FAIL ')+w);if(!ok)fail++};
const r=await page.evaluate(()=>{AN.run=false;AN.reset();ditlStates();AN.plantLoad150();DITL150.apply();
 const C1=AN.sheets.find(s=>s.name==='ABC-001C');const run=sec=>{for(let i=0;i<sec*2;i++){WORLD.live=true;AN.stepSet(C1,.5);WORLD.tick(.5)}};
 const G=a=>AN.turbine('gen',a)||'';
 run(20);const g0=AN.genPanel();
 const nUp=G({op:'n+'}),cl=G({op:'close52g'}),bad=G({op:'avr',v:'X'});
 const e0=AN.genPanel().efd;G({op:'avr',v:'MAN'});run(1);const e1=AN.genPanel().efd,fr1=AN.genPanel().fr;
 run(20);const e2=AN.genPanel().efd;
 for(let k=0;k<4;k++){G({op:'v+'});run(1)}const e3=AN.genPanel().efd,fr3=AN.genPanel().fr;
 G({op:'avr',v:'AUTO'});run(30);const g1=AN.genPanel();
 const f1=WORLD.ftrip('gen.86t',true);run(10);const g2=AN.genPanel(),tr=AN.unit.tc&&AN.unit.tc.trip,st=AN.unit.tb.st,ta9=(AN.unit.tc.ib.v['TA-9']||[]);
 const s9=AN.soe().filter(x=>x.sheet==='TA-9'&&/PROTECTION [AB]/.test(x.name)&&x.on===1).map(x=>x.name);
 const rs1=G({op:'reset86'});const g3=AN.genPanel();
 WORLD.ftrip('gen.86t',false);run(1);const rs2=G({op:'reset86'});run(1);const g4=AN.genPanel();
 const ev=(AN.soe?AN.soe():[]).filter(x=>x.sheet==='TA-9'||x.kind==='tt').map(x=>x.t+' '+x.name+' '+x.on);
 return {g0,nUp,cl,bad,e0,e1,fr1,e2,e3,fr3,g1,f1,g2,tr,st,s9,rs1,g3,rs2,g4,ev}});
console.log(JSON.stringify(r,null,1));
ck(r.g0&&r.g0.c52g&&r.g0.f41&&r.g0.syn==='AUTO'&&r.g0.avr==='AUTO'&&Math.abs(r.g0.kV-13.8)<0.7&&Math.abs(r.g0.hz-60)<0.2,'150 MW: panel reads 52G closed, 41 closed, AUTO / AUTO, '+r.g0.kV+' kV '+r.g0.hz+' Hz');
ck(/52G is closed/.test(r.nUp),'SPEED RAISE refused on the grid');
ck(/already closed/.test(r.cl),'52G CLOSE refused: already closed');
ck(/AUTO or MAN/.test(r.bad),'AVR: a wrong position is refused');
ck(Math.abs(r.e1-r.e0)<0.02&&Math.abs(r.fr1-r.e0)<0.02,'AVR MANUAL bumpless: field '+r.e0+' -> '+r.e1);
ck(Math.abs(r.e2-r.e1)<0.02,'AVR MANUAL holds the field for 20 s ('+r.e2+')');
ck(r.e3>r.e2+0.02&&r.fr3>r.fr1,'VOLTAGE RAISE in MANUAL raises the field '+r.e2+' -> '+r.e3);
ck(r.g1.avr==='AUTO'&&r.g1.c52g,'AVR back to AUTO, still on the grid');
ck(r.g2.lo86.a&&r.g2.lo86.b&&r.g2.lo86.t&&r.g2.lo86.why==='86T','86T operates 86G-A and 86G-B');
ck(r.s9.length===2,'TA-9 inputs GEN. LOCKOUT RELAY A and B are on: '+JSON.stringify(r.s9));
ck(!!r.tr&&r.st!=='load'&&!r.g2.c52g,'the turbine trips (first out '+r.tr+'), 52G open');
ck(/still operated/.test(r.rs1)&&r.g3.lo86.a,'RESET refused while 86T stands');
ck(r.rs2===''&&!r.g4.lo86.a&&!r.g4.lo86.b&&!r.g4.lo86.t,'RESET accepted after 86T is cleared');
ck(!errs.length,'no page error'+(errs.length?': '+errs[0]:''));
await browser.close();process.exit(fail?1:0)})();
