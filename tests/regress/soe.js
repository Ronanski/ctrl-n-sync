// Sequence of events and first out (src/analog/engine/soe.js, user "go all" 2026-11-19 item 2). From Start at 150 MW the TA-1 TURBINE TRIP
// push button is pressed (the operator's press, tcsTripManual): the TCS trips the turbine (first out MANUAL TRIP), TA-9 BOILER MFT does not
// start it; the DCS sees TURBINE TRIP on DITL-03A, the MFT goes 1 and the first-out memory of DITL-06 is TURBINE TRIP. The SOE must hold the
// records in that order, and AN.soeTrip() must name both first outs. Usage: node tests/regress/soe.js [html]
const {open}=require('./lib.js');const fs=require('fs');
const html=process.argv.find(a=>/\.html$/.test(a))||'dist/'+fs.readdirSync('dist').find(x=>/^logic-sim-v[\d.]+(?:-beta\.\d+)?\.html$/.test(x));
(async()=>{const {browser,page,errs}=await open(html);await page.waitForFunction(()=>AN.sheets&&AN.sheets.length>=54&&window.WORLD&&WORLD.idx&&window.DITL150,null,{timeout:120000});await page.waitForTimeout(2000);let fail=0;const ck=(ok,w)=>{console.log((ok?'PASS ':'FAIL ')+w);if(!ok)fail++};
const r=await page.evaluate(()=>{AN.run=false;AN.reset();ditlStates();AN.plantLoad150();DITL150.apply();
 const C1=AN.sheets.find(s=>s.name==='ABC-001C');const run=sec=>{for(let i=0;i<sec*2;i++){WORLD.live=true;AN.stepSet(C1,.5);WORLD.tick(.5)}};
 run(30);const before=AN.soe().length,trip0=AN.soeTrip();
 const msg=AN.turbine('trip')||'';run(30);
 return {msg,before,trip0,soe:AN.soe(),trip:AN.soeTrip()}});
for(const x of r.soe)console.log('  '+x.t.toFixed(1)+'  '+x.sys+' '+x.sheet+'  '+(x.on?'ON ':'off')+'  '+x.kind+'  '+x.name);
console.log(JSON.stringify(r.trip));
ck(r.msg==='','TA-1 TURBINE TRIP P.B. pressed');
ck(r.before===0&&!r.trip0.mft.on&&!r.trip0.turbine.on,'150 MW, 30 s: no record, no trip');
const i=(p)=>r.soe.findIndex(p);
const iTT=i(x=>x.kind==='tt'&&x.on===1),iD3=i(x=>x.sheet==='DITL-03A'&&x.kind==='trip'&&x.name==='TURBINE TRIP'&&x.on===1),iM=i(x=>x.kind==='mft'&&x.on===1),iFO=i(x=>x.kind==='fo'&&x.on===1);
ck(iTT>=0&&/MANUAL TRIP/.test(r.soe[iTT].name),'TCS: turbine trip recorded, first out MANUAL TRIP');
ck(iD3>iTT,'DCS: DITL-03A TURBINE TRIP input after the TCS trip');
ck(iM>=iD3&&iM>=0,'DCS: MFT output after its trip input');
ck(iFO>=0&&r.soe[iFO].name==='TURBINE TRIP','DCS first-out memory: TURBINE TRIP (DITL-06)');
ck(r.soe.every((x,k)=>!k||x.t>=r.soe[k-1].t),'records in time order');
ck(r.trip.mft.on&&r.trip.mft.first==='TURBINE TRIP'&&r.trip.mft.at!=null,'AN.soeTrip().mft: on, first out TURBINE TRIP at '+r.trip.mft.at+' s');
ck(r.trip.turbine.on&&r.trip.turbine.first==='MANUAL TRIP','AN.soeTrip().turbine: on, first out MANUAL TRIP');
ck(r.soe.filter(x=>x.kind==='fo'&&x.on===1).length===1,'one first-out memory lit (the others are blocked by the first)');
ck(!errs.length,'no page error'+(errs.length?': '+errs[0]:''));
await browser.close();process.exit(fail?1:0)})();
