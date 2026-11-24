// Headless driver for logic-sim: opens the HTML, switches to the Analog (ABC) category, waits until the 54 sheets are loaded.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/node22/lib/node_modules/playwright');
async function open(html){
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM||'/opt/pw-browsers/chromium',args:(process.env.CHROME_ARGS||'').split(' ').filter(Boolean)});
  const page=await browser.newPage();const errs=[];
  await page.addInitScript({path:require('path').join(__dirname,'top.js')});
  page.on('pageerror',e=>errs.push(String(e.message)));
  /* beta.320 (JENNIE): the page engine (?worker=0, as the CI gate tests/gate/behaviour.cjs). Since beta.275 the Worker is the default: the page
     is then a MIRROR and a scan run here (AN.stepSet + WORLD.tick) is given back but not kept (03b-sim.js simulate), so no latch
     (flip-flop) of a DITL drawing held and the standby CEP B stopped when its 2 s start pulse ended. A test of the Worker goes to ?worker=1 */
  await page.goto(require('url').pathToFileURL(require('path').resolve(html)).href+'?worker=0');
  await page.waitForTimeout(1500);
  await page.evaluate(()=>AN.setCat('an'));
  await page.waitForFunction(()=>window.AN&&AN.sheets&&AN.sheets.length>=54,null,{timeout:60000});
  /* beta.376 (EIMI): wait until the shell has finished its start. Right after the sheets load the shell is still being put on: the
     sheet values are Roboto until body gets the class 'sc' (then IBM Plex Mono, shellc-content.css) and the drawing pane is 27 px
     shorter until its message bar closes. A test that starts in that window measures another page than the operator sees, and the
     result changes with the speed of the machine (the 'ABC VALUES LAYOUT' check on CI: PR 512, 518 failed, the rerun passed) */
  await page.waitForFunction(()=>document.body.classList.contains('sc')&&document.fonts.status==='loaded',null,{timeout:60000});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>{const r=document.getElementById('svg').getBoundingClientRect(),k=[r.x,r.y,r.width,r.height].join(),s=(window.__lsSettle=window.__lsSettle||{k:'',n:0});s.n=s.k===k?s.n+1:0;s.k=k;return s.n>=4},null,{polling:250,timeout:60000});
  return {browser,page,errs};
}
/* 2.4.0-beta.2: on a screen up to 1280 px the global search is behind the magnifier icon: open it before typing */
async function showSearch(page){await page.evaluate(()=>{const s=document.getElementById('ansb'),b=document.getElementById('srchbtn');if(s&&!s.offsetParent&&b&&b.offsetParent)b.click()});await page.waitForTimeout(100)}
/* beta.359 (ROSÉ): the operator's way in, used by the click tests: the start screen of the app (START STATE chip, then the Operator card),
   wait until that state is loaded and the overview shows; openHx then opens an HX page by the page picker of the Plant view (lsShellC.openPage) */
async function startAs(page,state){
  await page.waitForSelector('#scstart',{state:'visible',timeout:60000});
  await page.locator('#scstart .scchips button',{hasText:new RegExp('^\\s*'+state)}).first().click();
  await page.locator('#scstart .sccard',{hasText:/^\s*Operator/}).first().click();
  await page.waitForFunction(()=>window.AN&&AN.startState&&!AN._loading&&document.body.classList.contains('scov'),null,{timeout:180000});
  await page.waitForTimeout(1000);
}
/* the RUN button of the top bar (#scctx), as the operator presses it; the faceplates take commands only while the plant runs */
async function pressRun(page){
  await page.locator('#scctx button',{hasText:/^\s*RUN\s*$/}).first().click();
  await page.waitForFunction(()=>AN.run&&!AN.view,null,{timeout:10000});
}
async function openHx(page,pg){
  await page.evaluate(pg=>lsShellC.openPage(pg),pg);
  await page.waitForFunction(pg=>(document.querySelector('#plantws .plpick')||{}).value===pg,pg,{timeout:20000});
  await page.waitForTimeout(2000);
}
module.exports={open,showSearch,startAs,pressRun,openHx};
