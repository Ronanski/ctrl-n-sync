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
  await page.waitForTimeout(500);
  return {browser,page,errs};
}
/* 2.4.0-beta.2: on a screen up to 1280 px the global search is behind the magnifier icon: open it before typing */
async function showSearch(page){await page.evaluate(()=>{const s=document.getElementById('ansb'),b=document.getElementById('srchbtn');if(s&&!s.offsetParent&&b&&b.offsetParent)b.click()});await page.waitForTimeout(100)}
module.exports={open,showSearch};
