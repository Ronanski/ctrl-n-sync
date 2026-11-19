// SOP scoring (src/analog/engine/sop-score.js, user "go all" 2026-11-19). From Start at 150 MW: every PR-OPE-5002 milestone is found on its
// drawing and is "given" (done before the score started), score 100. The order check: the auxiliary cooling water made "not done" and
// the IDF seen again, the IDF is out of order (before the ACW), one share (100 / 18). Then the TA-1 TURBINE TRIP: each milestone it undoes (measured) costs one share.
// Usage: node tests/regress/sop_score.js [html]
const {open}=require('./lib.js');const fs=require('fs');
const html=process.argv.find(a=>/\.html$/.test(a))||'dist/'+fs.readdirSync('dist').find(x=>/^logic-sim-v[\d.]+(?:-beta\.\d+)?\.html$/.test(x));
(async()=>{const {browser,page,errs}=await open(html);await page.waitForFunction(()=>AN.sheets&&AN.sheets.length>=54&&window.WORLD&&WORLD.idx&&window.DITL150,null,{timeout:120000});await page.waitForTimeout(2000);let fail=0;const ck=(ok,w)=>{console.log((ok?'PASS ':'FAIL ')+w);if(!ok)fail++};
const r=await page.evaluate(()=>{AN.run=false;AN.reset();ditlStates();AN.plantLoad150();DITL150.apply();
 const C1=AN.sheets.find(s=>s.name==='ABC-001C');const run=sec=>{for(let i=0;i<sec*2;i++){WORLD.live=true;AN.stepSet(C1,.5);WORLD.tick(.5)}};
 run(10);const a=AN.sopScore();const pts=Object.fromEntries(Object.entries(AN._sop.pts).map(([k,v])=>[k,v.length]));
 AN._sop.pts.acw=[];delete AN._sop.st.acw;delete AN._sop.st.idf;AN._sop.steps=AN._sop.steps.filter(s=>s.id!=='acw'&&s.id!=='idf');run(3);const b=AN.sopScore();
 AN.turbine('trip');run(30);const c=AN.sopScore();
 const d=AN.sopScore({restart:true});
 return {a,pts,b,c,d}});
console.log(JSON.stringify(r.pts));console.log(JSON.stringify(r.b.deduct));console.log(JSON.stringify(r.c.deduct));console.log(JSON.stringify(r.c.lost));
ck(Object.values(r.pts).every(n=>n>0),'every drawing milestone found on its drawing ('+Object.keys(r.pts).length+')');
ck(r.a.score===100&&r.a.steps.length===18&&r.a.steps.every(s=>s.given)&&!r.a.todo.length,'150 MW: all 18 milestones given, score 100');
ck(r.a.steps[0].name==='START SEA WATER PUMP','milestone names from PR-OPE-5002 ('+r.a.steps[0].name+')');
const idf=r.b.steps.find(s=>s.id==='idf');
ck(idf&&!idf.given&&idf.late.join()==='acw'&&r.b.score===94.4,'IDF before the auxiliary cooling water: out of order, score '+r.b.score);
const ids=r.c.lost.map(x=>x.id);
ck(r.c.trips.tt===1&&r.c.trips.mft===1,'turbine trip and MFT recorded');
ck(['roll','sync','burner','coal','purge'].every(k=>ids.includes(k))&&!ids.includes('swp')&&!ids.includes('idf'),'lost: '+ids.join(', ')+' (the auxiliaries stay)');
ck(Math.abs(r.c.score-Math.round((100-(1+ids.length)*100/18)*10)/10)<0.05,'score '+r.c.score+' = 100 - '+(1+ids.length)+' x 5.6');
ck(r.c.todo.some(x=>x.id==='purge'),'purge to do again after the MFT');
ck(r.d.score===100&&r.d.trips.mft===0,'restart: score 100 again');
ck(!errs.length,'no page error'+(errs.length?': '+errs[0]:''));
await browser.close();process.exit(fail?1:0)})();
