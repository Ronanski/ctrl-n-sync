// fpHist for machines and valves (src/analog/engine/hist.js AN.histReg, user "go all" 2026-11-19 item 3): every machine of the HMI pages and
// the valves of the faceplates are sampled each simulated second; a machine trip shows in its record. Usage: node tests/regress/fphist_mach.js [html]
const {open}=require('./lib.js');const fs=require('fs');
const html=process.argv.find(a=>/\.html$/.test(a))||'dist/'+fs.readdirSync('dist').find(x=>/^logic-sim-v[\d.]+(?:-beta\.\d+)?\.html$/.test(x));
(async()=>{const {browser,page,errs}=await open(html);await page.waitForFunction(()=>AN.sheets&&AN.sheets.length>=54&&window.WORLD&&WORLD.idx&&window.DITL150,null,{timeout:120000});await page.waitForTimeout(2000);let fail=0;const ck=(ok,w)=>{console.log((ok?'PASS ':'FAIL ')+w);if(!ok)fail++};
const r=await page.evaluate(()=>{AN.run=false;AN.reset();ditlStates();AN.plantLoad150();DITL150.apply();
 const C1=AN.sheets.find(s=>s.name==='ABC-001C');const run=sec=>{for(let i=0;i<sec*2;i++){WORLD.live=true;AN.stepSet(C1,.5);WORLD.tick(.5)}};
 run(30);
 const R=AN._hist.reg||{},keys=Object.keys(R),mach=keys.filter(k=>R[k].kind==='mach'),uniq=new Set(mach.map(k=>R[k])).size;
 /* a machine with a current (sea water pump A of the cw page) */
 const wc=mach.find(k=>{const h=AN.fpHist(k,30);return h.cur.some(v=>v!=null&&v>0)});
 const h=wc?AN.fpHist(wc,30):null,v=AN.fpHist('XV-MU1109',30);
 /* trip a running sea water pump and watch its record */
 const sw=mach.filter(k=>/1501|SWP|SEA/i.test(k)&&AN.fpHist(k,5).run.slice(-1)[0]===1);
 const tr=WORLD.ftrip().find(f=>/^mt\.swp/.test(f.id));
 let after=null;if(tr){WORLD.ftrip(tr.id,true);run(10);after=sw.map(k=>k+':'+AN.fpHist(k,5).run.join(','));WORLD.ftrip(tr.id,false)}
 return {n:keys.length,mach:mach.length,uniq,wc,hn:h&&h.t.length,hrun:h&&h.run.slice(-3),hcur:h&&h.cur.slice(-3),unit:h&&h.unit,
   vk:v.kind,vn:v.pos?v.pos.length:0,vpos:v.pos&&v.pos.slice(-2),sw,tr:tr&&tr.id,after,ixk:Object.keys(AN._hist.ix||{}).slice(0,6),ixn:Object.keys(AN._hist.ix||{}).length,sS:AN.sheets.filter(x=>x.S&&/^ABC-/.test(x.name)).length,ctl:AN.fpHist(Object.keys(AN._hist.ix||{}).find(k=>k[0]!=='@'&&AN._hist.reg[k])||'',10)}});
console.log(JSON.stringify(r).slice(0,1500));
ck(r.uniq>=20,'machines of the HMI pages registered ('+r.uniq+')');
ck(r.wc&&r.hn>=29&&r.hn<=31,'a machine record of 30 s, one sample per second ('+r.wc+' '+r.hn+')');
ck(r.hrun&&r.hrun.every(x=>x===1)&&r.hcur.every(x=>x>0)&&r.unit==='A','running state and motor current recorded');
ck(r.vk==='valve'&&r.vn>=29&&r.vpos.every(x=>x===0||x===100),'XV-MU1109 position recorded');
ck(r.after&&r.after.some(s=>/(-1|0)$/.test(s)),'a sea water pump trip shows in its record ('+(r.after||[]).join(' | ')+')');
ck(r.ctl&&Array.isArray(r.ctl.t)&&Array.isArray(r.ctl.mv)&&!r.ctl.kind,'controller history unchanged, a controller tag shared with a machine stays the controller trend');
ck(!errs.length,'no page errors '+errs.slice(0,2).join(' | '));
await browser.close();console.log(fail?'FAIL '+fail:'ALL PASS');process.exit(fail?1:0)})();
