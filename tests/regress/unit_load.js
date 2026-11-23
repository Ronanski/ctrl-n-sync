// M2 (2.2.0-beta.9): NORMAL OPERATION + LOAD DOWN / UP with the unit model (src/analog/engine/unit.js).
// Start at 150 MW, TARGET MW 60 on HIC-ULD (rate HIC-MWRL 3.0 MW/min, 33.PNG), then back to 150. Steps like the app: ONE stepSet
// of the boiler master sheet (ABC-001C) per 0.5 s (its 36 linked sheets step once each).
// The operator (PR-OPE-5003: "Maintain MS pressure 123-126 ksc"): below 220 T/H of main steam the drawing puts the boiler master in
// MANUAL (ABC-001C M.2013 = NOT M.0101, M.0101 = MSF > 220 T/H); the operator moves HIC-BM to hold the pressure and presses A again
// above 220 T/H. Pass (1.0.0-beta.346, user 2026-11-24 'GO DESIGN': the design documents are the targets, no plant snapshot): at 60 MW
// and 150 MW within 5 % of the Hitachi heat balance PPE-14-0725 (40 % case MS 190.769 T/H, 100 % 458.327 T/H) and of the FHI curves at
// the steam flow (Fig 6 SH / RH temperature, Fig 13 coal, Tab 3 RH outlet 35.1 kg/cm2 at MCR, the HRH pressure going with the HP exhaust
// of the HB, 16.35 / 38.64 ata), MSP within 5 % of its set point, drum level inside +-100 mm, no low-low pressure, no page error.
// Usage: node tests/regress/unit_load.js [html]
const {open}=require('./lib.js');const fs=require('fs');
const html=process.argv.find(a=>/\.html$/.test(a))||'dist/'+fs.readdirSync('dist').find(x=>/^logic-sim-v[\d.]+(?:-beta\.\d+)?\.html$/.test(x));
(async()=>{const {browser,page,errs}=await open(html);if(process.env.UDBG)await page.evaluate(()=>{window.__dbg=1});let fail=0;const ck=(ok,w)=>{console.log((ok?'PASS ':'FAIL ')+w);if(!ok)fail++};
/* 1.0.0-beta.336 (JENNIE): the start the operator uses, "At 150 MW" (AN.loadStart + the DITL + the steady state st150); the bare
   AN.plantLoad150 has no steady state and drifts (cd_page_values / extraction_warming moved the same way in beta.328) */
await page.waitForFunction(()=>AN.sheets&&AN.sheets.length>=54&&window.WORLD&&WORLD.idx&&window.DITL150,null,{timeout:120000});await page.waitForTimeout(2000);
await page.evaluate(async()=>{await AN.ades();WORLD.set(true);document.getElementById("load150").click();await AN._startP;});
await page.evaluate(()=>{
 const L=AN.sheets.filter(s=>s.S&&!/ABC-000/.test(s.name)),C1=AN.sheets.find(s=>s.name==='ABC-001C'),S=C1.S,v=S.rt.v;
 const lab=(S,l)=>S.lab.findIndex(x=>x&&String(x.t).trim()===l);
 let SU,bu;for(const sh of L){const z=sh.S.blk.find(z=>z.k==='MAN'&&(z.tag==='HIC-ULD'||(z.txt||[]).includes('HIC-ULD')));if(z){SU=sh.S;bu=z;break}}
 const tgt=(SU.drv[bu.i[bu.svI]]||[]).find(z=>z.k==='AMT').a;
 const bm=S.blk.find(b=>b.k==='AMT'&&b.sel===lab(S,'M.2013'));
 const S10=AN.sheets.find(s=>s.name==='ABC-010').S,lv=AN.hmiCtrls(S10).find(c=>c.tag==='LICBR1001');
 const S52=AN.sheets.find(s=>s.name==='ABC-052').S,rhp=AN.hmiCtrls(S52).find(c=>c.tag==='PICHR1003'),S12=AN.sheets.find(s=>s.name==='ABC-012').S,mst=AN.hmiCtrls(S12).find(c=>c.tag==='TICMS1004'),S19=AN.sheets.find(s=>s.name==='ABC-019').S,rht=AN.hmiCtrls(S19).find(c=>c.tag==='TICHR1002'),S2=AN.sheets.find(s=>s.name==='ABC-002').S,o2=AN.hmiCtrls(S2).find(c=>c.tag==='AICFG112');
 const cobm=AN.hmiCtrls(S).find(c=>c.tag==='PIC-COBM'),hbm=S.blk.find(b=>b.k==='MAN'&&b.tag==='HIC-BM'),htm=S.blk.find(b=>b.k==='MAN'&&b.tag==='EIC-TM'),tmA=S.blk.find(b=>b.k==='AMT'&&b.sel===lab(S,'M.2016'));
 window.__u={log:[],dbg:!!window.__dbg,C1,S,v,SU,tgt,bm,hbm,htm,tmA,goal:60,S10,lv,cobm,lab,S52,rhp,S12,mst,S19,rht,S2,o2,man:0,minP:1e9,maxL:0,ll:0};
});
const run=(sec,rec)=>page.evaluate(async([sec,rec])=>{const u=window.__u,U=AN.unit,S=u.S,v=u.v;
 for(let t=0;t<sec;t+=10){for(let k=0;k<20;k++){WORLD.live=true;AN.stepSet(u.C1,.5);WORLD.tick(.5);}
  const st=S.rt.st[u.bm.id],P=+v[u.lab(S,'AI0131')],sv=+v[u.cobm.q.sv],lvl=+u.S10.rt.v[u.lv.q.pv];
  const dP=u.pP==null?0:P-u.pP;u.pP=P;
  if(rec){u.minP=Math.min(u.minP,P);u.maxL=Math.max(u.maxL,Math.abs(lvl));if(+v[u.lab(S,'M.310D')]>0.5)u.ll=1}
  /* the operator: boiler master in MANUAL -> move HIC-BM (its COS) to hold the pressure; above 220 T/H press A */
  /* boiler master in AUTO again (above 230 T/H, PR-OPE-5002 "Put Boiler Master to Auto"): TARGET MW 150 */
  /* the operator. CCS (33.PNG): HIC-ULD TARGET MW drives the unit. Below 220 T/H of main steam the drawing puts the boiler master in
     MANUAL (ABC-001C M.2013 = NOT M.0101) and with it the turbine master (M.2016: boiler master not in AUTO); the unit load demand
     then tracks the generator MW. PR-OPE-5003 / 5002: the operator holds the main steam pressure with HIC-BM and moves the load with
     EIC-TM (MAN station, its MV is the MW to the TCS), 1.2 MW/min down; up: the firing first (HIC-BM), the turbine follows the
     pressure. Both stations go back to AUTO by themselves above 220 T/H (no latch on the drawing); then TARGET MW 150 */
  const tmS=S.rt.st[u.tmA.id],tm=S.rt.st[u.htm.id];
  /* 1.0.0-beta.338 (JENNIE): in TURBINE MASTER MANUAL by the BU-CMD the drawing also drops DCS CONTROL MODE (I.0082 = 0, TCE180 p.127:
     the TCS holds its own target) and ABC-001C AMT M.2017 = NOT I.0082 makes EIC-TM track the TCS target AI0420 (interlock tracking):
     the EIC-TM value of the operator does nothing then (before, the load stayed at 71.7 MW and the firing on the way up had no turbine
     to take it: bypass open, trip). The operator moves the load on the TCS panel target (AN.turbine('loadup', { mw, rate }), the
     TCS CRT TARGET LOAD): down 1.2 MW/min (0.8 %/min) to the goal; up: the firing first (HIC-BM), the TCS target follows the pressure */
  const dcsOn=+v[u.lab(S,'I.0082')]>0.5;
  if(!dcsOn&&st.pk==='B'&&AN.unit.tb){const mw=AN.unit.MW;
   if(!u.up){if(!u.tcsDn){AN.turbine('loadup',{mw:u.goal,rate:0.8});u.tcsDn=1}}
   else{const tg=P-sv>1?Math.min(150,mw+2):P-sv<-1?Math.max(u.goal,mw-1):mw;AN.turbine('loadup',{mw:tg,rate:0.8});u.tcsUp=(u.tcsUp||0)+1}}
  if(st.pk==='B'){u.man=1;const m=S.rt.st[u.hbm.id];
   if(u.up){m.val=Math.min(100,m.val+0.05);if(tmS.pk==='B')tm.val=Math.max(0,Math.min(200,tm.val+Math.max(-0.2,Math.min(0.2,0.1*(P-sv)))));}
   else{m.val=Math.max(0,Math.min(100,m.val+Math.max(-1,Math.min(1,0.0011*(sv-P)-0.2*dP))));if(tmS.pk==='B')tm.val=Math.max(u.goal,tm.val-0.2);}}
  /* PR-OPE-5002 "At 230 T/H MSF ... Put Boiler Master to Auto" (CLAUDE.md 10): the stations stay MANUAL after the BU-CMD; the
     operator turns MAN off on HIC-BM, then on EIC-TM (CCS), above 230 T/H and with the BU-CMD gone */
  if(u.up&&st.pk==='B'&&U.ms>230&&+v[u.lab(S,'M.2013')]<0.5){u.bmA=(u.bmA||0)+1;for(const [S2,n] of AN.modeNets('HIC-BM'))S2.rt.ext[n]=0}
  if(u.up&&st.pk==='A'&&tmS.pk==='B'&&+v[u.lab(S,'M.2016')]<0.5){u.tmA2=(u.tmA2||0)+1;for(const [S2,n] of AN.modeNets('EIC-TM'))S2.rt.ext[n]=0}
  /* 2.2.0-beta.11: the O2 trim (ABC-002 AICFG112) is forced MANUAL by the drawing while the fuel is limited by the air (cross limit:
     ABC-002 LC |SI0014 - SI0019| = 0 -> M.0103) and stays MANUAL (user rule 2026-10-15). The operator puts the correction to
     neutral (50 % = x 1.0, LN15) while it is manual, and selects AUTO again when the limit is gone, the load is above 220 T/H and
     the O2 is near its set point; with the correction left at its last value (0.857) the air falls under the minimum (LN40 knee
     at 446 T/H) and the fuel is cut (beta.11 probe: coal 28 -> 63 T/H swing, MSP 150) */
  {const oq=u.S2.rt.st[u.o2.amt.id];if(oq.pk==='B'){u.o2man=(u.o2man||0)+1;if(u.o2.manNet!=null){const m=+u.S2.rt.ext[u.o2.manNet];if(isFinite(m))u.S2.rt.ext[u.o2.manNet]=m+Math.max(-1,Math.min(1,50-m))}
   if(!oq.fman&&+v[u.lab(S,'M.0101')]>0.5&&Math.abs(+u.S2.rt.v[u.o2.q.pv]-+u.S2.rt.v[u.o2.q.sv])<1.5){oq.al=u.o2.autoLeg;oq.fm=u.o2.autoLeg;for(const [S3,n] of AN.modeNets('AICFG112'))S3.rt.ext[n]=0;u.o2auto=(u.o2auto||0)+1} /* faceplate A (hmi.js setMode + .LOC) */}}
  if(u.up&&u.man&&st.pk==='A'&&tmS.pk==='A'){u.auto=1}
  /* while the BU-CMD is still there, the station stays MANUAL; it must NOT go to AUTO by itself when the BU-CMD goes */
  if(u.up&&u.man&&!u.bmA&&st.pk==='A')u.selfAuto=1;
  if(u.auto&&st.pk==='A'&&tmS.pk==='A')u.SU.rt.ext[u.tgt]=150;
  if(u.dbg&&t%60===50)u.log.push('t+'+(t+10)+' dem='+(+u.SU.rt.v[u.lab(u.SU,'SI0226')]).toFixed(1)+' tgt='+(+u.SU.rt.ext[u.tgt]).toFixed(1)+' D='+(+v[u.lab(S,'SI0236')]).toFixed(1)+' MW='+U.MW.toFixed(1)+' P='+P.toFixed(1)+' Pd='+U.Pd.toFixed(1)+' ms='+U.ms.toFixed(0)+' Qs='+U.Qs.toFixed(0)+' BM='+(+v[u.lab(S,'HIC-BM.MV')]).toFixed(1)+' pk='+st.pk+' COBM='+(+v[u.lab(S,'PIC-COBM.MV')]).toFixed(1)+' FF='+(+v[u.lab(S,'SI0201')]).toFixed(1)+' M2013='+v[u.lab(S,'M.2013')]+' mb='+(U.mb||0).toFixed(0)+' bpv='+(U.vlv||[]).map(x=>(+x.S.rt.v[x.n]).toFixed(1)).join('/')+' CM='+(()=>{const S4=AN.sheets.find(x=>x.name==='ABC-004A').S;const c=AN.hmiCtrls(S4).find(c=>c.tag==='FIC-CM');const q=S4.rt.st[c.amt.id];const f=AN.hmiCtrls(S4).find(c=>c.tag==='HS-COAL');return 'pv'+(+S4.rt.v[c.q.pv]).toFixed(0)+'/sv'+(+S4.rt.v[c.q.sv]).toFixed(0)+'/mv'+(+S4.rt.v[c.out]).toFixed(0)+'/'+q.pk+(q.fman?'F':'')+' HS'+S4.rt.st[f.amt.id].pk+(S4.rt.st[f.amt.id].fman?'F':'')+' SI0010='+(+S4.rt.v[u.lab(S4,'SI0010')]).toFixed(0)})()+' TM='+tmS.pk+(+tm.val).toFixed(1)+' DCS='+v[u.lab(S,'I.0082')]+' aim='+(AN.unit.tb?(+AN.unit.tb.aim).toFixed(1):'')+' coal='+U.fuel.reduce((a,l)=>a+(+l[0][0].rt.st[l[0][1].id].val),0).toFixed(1)+' MST='+(+u.S12.rt.v[u.mst.q.pv]).toFixed(0)+' RHT='+(+u.S19.rt.v[u.rht.q.pv]).toFixed(0)+' RHP='+(+u.S52.rt.v[u.rhp.q.pv]).toFixed(1)+' O2='+(+u.S2.rt.v[u.o2.q.pv]).toFixed(1)+' MSFc='+(+v[U.cn]).toFixed(0)+' O2trim='+u.S2.rt.st[u.o2.amt.id].pk+(u.S2.rt.st[u.o2.amt.id].fman?'F':'')+(+u.S2.rt.v[u.o2.out]).toFixed(1));
  if(t%300===290)await new Promise(r=>setTimeout(r,0))}},[sec,rec]);
const st=()=>page.evaluate(()=>{const u=window.__u,U=AN.unit,v=u.v,S=u.S;return{dem:+u.SU.rt.v[u.lab(u.SU,'SI0226')],D:+v[u.lab(S,'SI0236')],MW:U.MW,MSP:+v[u.lab(S,'AI0131')],SV:+v[u.cobm.q.sv],MSF:+v[U.cn],coal:U.fuel.reduce((a,l)=>a+(+l[0][0].rt.st[l[0][1].id].val),0),FW:+u.S10.rt.v[u.lab(u.S10,'AI0256')],lvl:+u.S10.rt.v[u.lv.q.pv],bm:u.S.rt.st[u.bm.id].pk,RHP:+u.S52.rt.v[u.rhp.q.pv],MST:+u.S12.rt.v[u.mst.q.pv],RHT:+u.S19.rt.v[u.rht.q.pv],O2:+u.S2.rt.v[u.o2.q.pv],Pd:U.Pd,mb:U.mb||0,dcs:+v[u.lab(S,'I.0082')]>0.5,aim:U.tb?+U.tb.aim:NaN}});
const say=(w,x)=>console.log('     '+w+': MW '+x.MW.toFixed(1)+' (demand '+x.dem.toFixed(1)+'), MSP '+x.MSP.toFixed(1)+' (SV '+x.SV.toFixed(1)+'), MSF '+x.MSF.toFixed(1)+' T/H, coal '+x.coal.toFixed(1)+' T/H, FW '+x.FW.toFixed(1)+' T/H, drum level '+x.lvl.toFixed(0)+' mm, boiler master '+(x.bm==='A'?'AUTO':'MANUAL')+'\n       MST '+x.MST.toFixed(0)+' C, RHT '+x.RHT.toFixed(0)+' C, RHP '+x.RHP.toFixed(1)+' kg/cm2, O2 '+x.O2.toFixed(1)+' %, drum '+x.Pd.toFixed(1)+' kg/cm2, bypass / blow-off '+x.mb.toFixed(0)+' T/H');
const near=(x,ref,p)=>Math.abs(x-ref)<=Math.abs(ref)*p/100;
/* FHI P2S7 design curves at the boiler load % MCR = MSF / 460 T/H (02-fhi-curves.md): Fig 6 SH and RH temperature, Fig 13 coal */
const lin=(X,Y,x)=>{if(x<=X[0])return Y[0];for(let i=1;i<X.length;i++)if(x<=X[i])return Y[i-1]+(Y[i]-Y[i-1])*(x-X[i-1])/(X[i]-X[i-1]);return Y[Y.length-1]};
const fig6=m=>lin([40,50,60,100],[524,534,541,541],m/4.6),fig13=m=>lin([40,50],[38.5,47.0],m/4.6),rhpHB=35.1,rhp40=35.1*16.35/38.64;
await run(300,1);const a=await st();say('150 MW, 5 min',a);
ck(near(a.MW,150,3)&&near(a.MSF,458.3,5)&&near(a.MSP,a.SV,5),'Start at 150 MW stays: MW '+a.MW.toFixed(1)+', MSF '+a.MSF.toFixed(1)+', MSP '+a.MSP.toFixed(1));
ck(near(a.MST,541,5)&&near(a.RHT,541,5)&&near(a.RHP,rhpHB,5),'150 MW: MST '+a.MST.toFixed(0)+', RHT '+a.RHT.toFixed(0)+', RHP '+a.RHP.toFixed(1)+' (FHI Tab 3 541 / 541 / 35.1)');
await page.evaluate(()=>{const u=window.__u;u.SU.rt.ext[u.tgt]=60});
await run(600,1);const b=await st();say('TARGET 60, after 10 min',b);
ck(b.dem<125&&b.dem>115&&near(b.MW,b.D,3),'load down at 3 MW/min: demand '+b.dem.toFixed(1)+' after 10 min; MW '+b.MW.toFixed(1)+' follows the turbine demand SI0236 '+b.D.toFixed(1)+' (LAG 150 s of ABC-001C)');
await run(1200+1200,1);const c=await st();say('60 MW, settled',c);
/* 1.0.0-beta.340 (JENNIE): the MW follows the demand the turbine obeys: SI0236 in DCS CONTROL MODE (I.0082 = 1); in TCS local
   (I.0082 = 0, turbine master MANUAL by the BU-CMD) the TCS target. SI0236 then carries the ABC-001C LN55 'MSP vs T/B Override MW'
   (+-2 MW outside +-3 kg/cm2 of the pressure error) that the TCS does not read: at 60 MW MSP 125.7 vs SV 122.3 gives 60 - 2 = 58 */
const ref60=c.dcs?c.D:c.aim;
ck(near(c.MW,60,5)&&near(c.MW,ref60,3),'60 MW: MW '+c.MW.toFixed(1)+' (HB 40 % case 60 MW), follows the '+(c.dcs?'DCS demand SI0236 ':'TCS target ')+ref60.toFixed(1));
ck(near(c.MSF,190.8,5),'60 MW: main steam flow '+c.MSF.toFixed(1)+' T/H (HB 40 % case 190.8)');
ck(near(c.coal,fig13(c.MSF),5),'60 MW: coal '+c.coal.toFixed(1)+' T/H (FHI Fig 13 at '+(c.MSF/4.6).toFixed(1)+' % MCR: '+fig13(c.MSF).toFixed(1)+')');
ck(near(c.MSP,c.SV,5),'60 MW: MSP '+c.MSP.toFixed(1)+' at its set point '+c.SV.toFixed(1)+' (PR-OPE-5003: maintain MS pressure)');
ck(c.bm==='B','60 MW: boiler master MANUAL (MSF < 220 T/H, M.2013 = NOT M.0101)');
ck(near(c.MST,fig6(c.MSF),5),'60 MW: main steam temperature '+c.MST.toFixed(0)+' C (FHI Fig 6 at '+(c.MSF/4.6).toFixed(1)+' % MCR: '+fig6(c.MSF).toFixed(0)+'; SH spray 0 below 60 % MCR, Fig 10)');
ck(near(c.RHT,fig6(c.MSF),5),'60 MW: reheat steam temperature '+c.RHT.toFixed(0)+' C (FHI Fig 6: '+fig6(c.MSF).toFixed(0)+')');
ck(near(c.RHP,rhp40,5),'60 MW: hot reheat pressure '+c.RHP.toFixed(1)+' kg/cm2 (HB 40 % case: 35.1 x 16.35 / 38.64 = '+rhp40.toFixed(1)+')');
ck(c.O2>=5&&c.O2<=12,'60 MW: O2 '+c.O2.toFixed(1)+' % (boiler manual Fig 7: 4.6 % at 50 % MCR, 8.8 % at 40 %; the O2 trim is forced MANUAL below 220 T/H, ABC-002 M.0102)');
await page.evaluate(()=>{const u=window.__u;u.up=1});
await run(5400,1);const d=await st();say('back to 150, settled',d);
ck(near(d.MW,150,3)&&near(d.MSF,458.3,5)&&near(d.MSP,d.SV,5),'back to 150 MW: MW '+d.MW.toFixed(1)+', MSF '+d.MSF.toFixed(1)+' (HB 458.3), MSP '+d.MSP.toFixed(1));
ck(d.bm==='A','150 MW: boiler master back in AUTO (operator turned MAN off above 230 T/H, PR-OPE-5002)');
{const z3=await page.evaluate(()=>{const u=window.__u;const q=u.S2.rt.st[u.o2.amt.id];return{man:u.o2man||0,auto:u.o2auto||0,pk:q.pk+(q.fman?'F':''),mv:+u.S2.rt.v[u.o2.out]}});
 ck(z3.man>0&&z3.auto>0&&z3.pk==='A','O2 trim AICFG112: forced MANUAL by the cross limit on the way down (ABC-002 M.0103), operator neutral 50 % then AUTO again at 150 MW (now '+z3.pk+', MV '+z3.mv.toFixed(1)+')')}
ck(near(d.MST,541,5)&&near(d.RHT,541,5)&&near(d.RHP,rhpHB,5)&&d.O2>2&&d.O2<7,'back to 150 MW: MST '+d.MST.toFixed(0)+', RHT '+d.RHT.toFixed(0)+', RHP '+d.RHP.toFixed(1)+', O2 '+d.O2.toFixed(1)+' (FHI Tab 3 541 / 541 / 35.1; the spray and the O2 trim back)');
{const z2=await page.evaluate(()=>{const u=window.__u;return{self:!!u.selfAuto,bm:u.bmA||0,tm:u.tmA2||0}});
 ck(!z2.self&&z2.bm>0,'BU-CMD latch: the boiler master stayed MANUAL after the BU-CMD went, until the operator selected AUTO ('+(z2.self?'went to AUTO BY ITSELF':'operator AUTO pressed')+')')}
const z=await page.evaluate(()=>{const u=window.__u;return{minP:u.minP,maxL:u.maxL,ll:u.ll}});
ck(z.maxL<=100&&!z.ll,'no trip: drum level within '+z.maxL.toFixed(0)+' mm (limit 100), lowest MSP '+z.minP.toFixed(1)+' (LL 72.9: '+(z.ll?'REACHED':'not reached')+')');
if(process.env.UDBG)console.log((await page.evaluate(()=>window.__u.log)).join('\n'));
ck(!errs.length,'no page error'+(errs.length?': '+errs[0]:''));
console.log(fail?'FAILED '+fail:'ALL PASS');await browser.close();process.exit(fail?1:0)})();
