// Faceplate trend history (AN.fpHist) and the TCS state at Start 150 MW. Usage: node tests/engine/hist.js
const {loadEngine}=require('../../tools/engine/node-engine.js');
(async()=>{const {AN}=await loadEngine();AN.plantLoad150();let bad=0;const ok=(c,m)=>{if(!c)bad++;console.log((c?'PASS ':'FAIL ')+m)};
const g=n=>AN.sheets.find(s=>s.name===n);for(const s of AN.sheets)if(/^ABC-/.test(s.name))AN.ensure(s);
for(let i=0;i<40;i++)AN.stepSet(g('ABC-001C'),0.5);
const h=AN.fpHist('FICFA1071',60);ok(h&&h.t.length>=18&&h.t.length<=21&&h.pv.every(x=>x>0)&&h.unit==='T/H','FICFA1071 20 s: '+(h&&h.t.length)+' samples, PV '+(h&&h.pv.slice(-1))+' '+(h&&h.unit));
const m=AN.fpHist('HIC-MWRL',60);ok(m&&m.pv[0]===null&&m.mv.slice(-1)[0]!=null,'manual station: MV only');
ok(AN.fpHist('NO-SUCH-TAG',60)===null,'unknown key -> null');
const t=AN.tcs();ok(t&&t.ost&&t.ost.inhibit===1,'AN.tcs() at 150 MW: TCS in service, overspeed test inhibited on load');
process.exit(bad?1:0)})();
