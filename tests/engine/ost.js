// Overspeed test TCE176 / 177 / 145 against the drawing, engine in Node with a rolling-turbine fixture. Usage: node tests/engine/ost.js
const {loadEngine}=require('../../tools/engine/node-engine.js');
(async()=>{const {AN,win}=await loadEngine({patch:c=>c.replace('function tcsOstStep(U, dt) {','globalThis.__o={tcsOstCmd,tcsOstStep};function tcsOstStep(U, dt) {')});const W=win.__o;
let bad=0;const ok=(c,m)=>{if(!c)bad++;console.log((c?'PASS ':'FAIL ')+m)};
// fixture: a rolling turbine, reset, off the line, ATS done, target 3600 (governing mode)
const U={tb:{st:'roll',rpm:3600},tc:{rst:1,trip:0,cur:-1,spd:{sel:3600,acc:120}}};
const run=(s)=>{for(let i=0;i<s*2;i++)W.tcsOstStep(U,0.5)};
ok(W.tcsOstCmd(U,'main',1)==='', 'MAIN ON accepted in governing mode');
run(48);ok(Math.abs(U.tc.ost.pmain-288)<1,'48 s at 360 rpm/min -> pattern '+U.tc.ost.pmain.toFixed(1)+' (288 = rate change)');
run(63);ok(Math.abs(U.tc.ost.pmain-414)<1&&Math.abs(U.tb.rpm-4014)<1,'then 120 rpm/min to 414 -> rpm '+U.tb.rpm.toFixed(0));
W.tcsOstCmd(U,'main',0);run(30);ok(U.tc.ost.pmain<=414-179&&U.tc.ost.pmain>=414-181,'OFF: down at 360 rpm/min, 30 s -> '+U.tc.ost.pmain.toFixed(0));
run(60);ok(U.tc.ost.pmain===0&&Math.abs(U.tb.rpm-3600)<8,'back to 3600: '+U.tb.rpm.toFixed(0));
W.tcsOstCmd(U,'main',1);W.tcsOstCmd(U,'bk',1);run(29);ok(U.tc.ost.main===1,'both ON: MAIN still on at 29 s');run(2);ok(U.tc.ost.main===0&&U.tc.ost.bk===0,'TD 30 s: each resets the other (main '+U.tc.ost.main+' bk '+U.tc.ost.bk+')');
const st=U.tb.st;U.tb.st='sync';ok(/52G/.test(W.tcsOstCmd(U,'main',1)),'52G CLOSE refuses: '+W.tcsOstCmd(U,'main',1));U.tb.st=st;
U.tc.trip=1;ok(/TRIP/.test(W.tcsOstCmd(U,'bk',1)),'TRIP refuses');U.tc.trip=0;U.tc.cur=3;ok(/GOVERNING/.test(W.tcsOstCmd(U,'bk',1)),'ATS step running refuses');U.tc.cur=-1;
run(120);W.tcsOstCmd(U,'bk',1);run(150);ok(Math.abs(U.tc.ost.pbk-432)<1&&Math.abs(U.tb.rpm-4032)<1,'BK-UP pattern 432 -> rpm '+U.tb.rpm.toFixed(0));
U.tc.trip=1;run(1);ok(U.tc.ost.bk===0,'trip resets BK-UP mode');

process.exit(bad?1:0)})();
