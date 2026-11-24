// 3.2.0-beta.1 (audit C1 / C2): a REAL mouse click and a REAL touch tap on each item of a plant page opens its faceplate or its card;
// a drag that starts on an item opens nothing.
// beta.359 (ROSÉ): the old "Plant view" (#plsvg, #pllive) is gone. The test now goes the operator's way: the start screen (150 MW,
// Operator), then the HX pages Condensate and Sea water by the page picker (lib.js startAs / openHx). Each item = every visible
// [data-open] (control faceplate, loop, value) and [data-yn] (permissive faceplate) of the page that is on top at its centre; the
// links to other pages (data-go, data-open="") are left out. Opened = a new faceplate (.fpo-box, #plfp) or HX card (.hxc).
// Usage: node tests/regress/plant_click.js [html]
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/node22/lib/node_modules/playwright');const fs=require('fs'),path=require('path');
const {startAs,openHx}=require('./lib.js');
const html=path.resolve(process.argv.find(a=>/\.html$/.test(a))||'dist/'+fs.readdirSync('dist').find(x=>/^logic-sim-v[\d.]+(?:-beta\.\d+)?\.html$/.test(x)));
const PAGES=['HX-condensate','HX-sea-water'];
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM||'/opt/pw-browsers/chromium'});let f=0;const ck=(c,t)=>{console.log((c?'PASS ':'FAIL ')+t);if(!c)f++};
for(const mode of ['mouse','touch']){
 const ctx=await b.newContext({viewport:{width:1280,height:800},hasTouch:mode==='touch'});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(()=>{window.open=()=>null});
 await p.goto(require('url').pathToFileURL(html).href+'?worker=0');
 await startAs(p,'150 MW');
 /* close every card, then mark the ones still in the page so that only a card the next click opens counts */
 const clear=async()=>{await p.keyboard.press('Escape');await p.evaluate(()=>{if(window.HX&&HX.closeCards)HX.closeCards();if(window.LS_FPOP&&LS_FPOP.close)LS_FPOP.close();for(const c of document.querySelectorAll('.fpo-box,#plfp,.hxc'))c._old=1});await p.waitForTimeout(80)};
 const opened=()=>p.evaluate(()=>[...document.querySelectorAll('.fpo-box,#plfp,.hxc')].some(c=>!c._old&&c.getBoundingClientRect().width>0));
 let first=null;
 for(const pg of PAGES){
  await openHx(p,pg);
  const pts=await p.evaluate(()=>[...document.querySelectorAll('#plantws [data-open]:not([data-open=""]),#plantws [data-yn]')].map(e=>{const r=e.getBoundingClientRect();if(!(r.width>2&&r.height>2)||e.closest('[hidden]'))return null;const x=r.x+r.width/2,y=r.y+r.height/2,t=document.elementFromPoint(x,y);if(!t||!(t===e||e.contains(t)||t.closest('[data-open],[data-yn]')===e))return null;return {x,y,k:e.dataset.yn?'yn:'+e.dataset.yn:e.dataset.open}}).filter(Boolean));
  let ok=0;const bad=[];
  for(const q of pts){await clear();if(mode==='touch')await p.touchscreen.tap(q.x,q.y);else await p.mouse.click(q.x,q.y);await p.waitForTimeout(250);if(await opened())ok++;else bad.push(q.k)}
  ck(pts.length>=15&&ok===pts.length,mode+' '+pg+': '+ok+' / '+pts.length+' items open the faceplate or the card'+(bad.length?' (not: '+bad.slice(0,6).join(', ')+')':''));
  if(!first&&pts.length)first=pts.find(q=>/^mach:/.test(q.k))||pts[0];
 }
 await openHx(p,PAGES[0]);await clear();const q=first;await p.mouse.move(q.x,q.y);await p.mouse.down();await p.mouse.move(q.x+80,q.y+40,{steps:6});await p.mouse.up();await p.waitForTimeout(250);
 ck(!(await opened()),mode+': a drag that starts on an item ('+q.k+') opens nothing');
 ck(errs.length===0,mode+': no page error'+(errs.length?' ('+errs[0]+')':''));await ctx.close()}
await b.close();console.log(f?f+' FAIL':'ALL PASS');process.exit(f?1:0)})();
