// Fault groups (src/analog/engine/fault-groups.js, user "go all" 2026-11-19 item 6): the faults sorted by plant system, every fault in
// one group. Usage: node tests/regress/fault_groups.js [html]
const {open}=require('./lib.js');const fs=require('fs');
const html=process.argv.find(a=>/\.html$/.test(a))||'dist/'+fs.readdirSync('dist').find(x=>/^logic-sim-v[\d.]+(?:-beta\.\d+)?\.html$/.test(x));
(async()=>{const {browser,page,errs}=await open(html);await page.waitForFunction(()=>AN.sheets&&AN.sheets.length>=54&&window.WORLD&&WORLD.idx&&window.DITL150,null,{timeout:120000});await page.waitForTimeout(2000);let fail=0;const ck=(ok,w)=>{console.log((ok?'PASS ':'FAIL ')+w);if(!ok)fail++};
const r=await page.evaluate(()=>{AN.run=false;AN.reset();ditlStates();AN.plantLoad150();DITL150.apply();
 const C1=AN.sheets.find(s=>s.name==='ABC-001C');const run=sec=>{for(let i=0;i<sec*2;i++){WORLD.live=true;AN.stepSet(C1,.5);WORLD.tick(.5)}};
 run(5);if(!AN.startState)AN.startState='150 MW';/* the harness loads 150 MW by script: Run must not ask for a starting state */
 const G=AN.faultGroups(),n=AN.fault().length+WORLD.ftrip().length,ids=G.flatMap(g=>g.items.map(x=>x.id));
 return {groups:G.map(g=>g.g+' '+g.items.length),n,ids:ids.length,uniq:new Set(ids).size,other:G.some(g=>g.g==='Other'),gen:(G.find(g=>/Electrical/.test(g.g))||{items:[]}).items.map(x=>x.id)}});
console.log(JSON.stringify(r));
ck(r.ids===r.n&&r.uniq===r.n,'every fault of the two lists in exactly one group ('+r.n+')');
ck(!r.other,'no fault left in Other');
ck(r.gen.includes('gen.86t')&&r.gen.includes('grid.lo')&&r.gen.includes('el.1am'),'Electrical and generator holds 86T, grid dip, bus 1AM');
ck(!errs.length,'no page error'+(errs.length?': '+errs[0]:''));
await browser.close();process.exit(fail?1:0)})();
