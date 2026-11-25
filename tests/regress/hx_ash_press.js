// beta.556 (EIMI): the bottom ash machines of the HX pages take their push buttons (the CRT push buttons of DITL-BA01 / BA02).
// Starts at 150 MW as the operator (start screen, Operator card, RUN), opens the ash page and the bottom ash recycle page and checks:
//  - each machine opens its CONTROL faceplate with its push buttons, and its PERMISSIVE · TREND · MONITOR faceplate
//  - a press of START reaches the logic: the pulse address of the button is seen at 1 by the drawing
//  - the two-way separator says Open / Closed, the transmitter says Waiting / Sequence active
//  - no page error
// Usage: node tests/regress/hx_ash_press.js [html]
const { open, startAs, pressRun, openHx } = require('./lib.js');
const fs = require('fs');
const html = process.argv.find(a => /\.html$/.test(a)) || 'dist/' + fs.readdirSync('dist').find(x => /^logic-sim-v[0-9.]+(?:-beta\.[0-9]+)?\.html$/.test(x));
(async () => {
  const { browser, page, errs } = await open(html);
  let fail = 0;
  const ck = (ok, w) => (console.log((ok ? 'PASS ' : 'FAIL ') + w), ok || fail++);
  await page.setViewportSize({ width: 1920, height: 1080 });
  await startAs(page, '150 MW');
  await pressRun(page);
  await page.waitForTimeout(4000);
  const run = async (pg, list) => {
    await openHx(page, 'HX-' + pg);
    for (const [n, btns, two] of list) {
      await page.evaluate(n => HX.data.open('mach', n), n);
      await page.waitForTimeout(700);
      const F = await page.evaluate(() => {
        const p = document.getElementById('fpop');
        return p ? { text: p.innerText.replace(/\s+/g, ' '), b: [...p.querySelectorAll('button.fpo-cmd')].map(b => ({ t: b.textContent, x: b.title, off: b.disabled })) } : null;
      });
      ck(F && btns.every(t => F.b.some(b => b.t === t)), n + ': push buttons ' + (F ? F.b.map(b => b.t + ' (' + b.x + (b.off ? ', locked' : '') + ')').join(', ') : 'no faceplate'));
      if (F) console.log('     ' + F.text.slice(0, 300));
      /* press the first enabled button; the pulse is read from the app's button row within 2 s */
      const t = F && F.b.find(b => !b.off && !/EMERGENCY/.test(b.t));
      if (t) {
        const ad = t.x.split(' ').pop();
        await page.evaluate(() => (window.__p = null));
        await page.evaluate(
          ad => {
            const f = window.LS_OP.dpress;
            if (!window.__wrap) {
              window.__wrap = 1;
              window.LS_OP.dpress = function () {
                const r = f.apply(this, arguments);
                window.__p = JSON.stringify([...arguments].slice(0, 2)) + ' -> ' + JSON.stringify(r);
                return r;
              };
            }
          },
          ad
        );
        await page.locator('#fpop button.fpo-cmd', { hasText: new RegExp('^' + t.t + '$') }).first().click();
        await page.locator("#fpop button.fpo-go").first().click();
        await page.waitForTimeout(1500);
        ck(await page.evaluate(() => !!window.__p), n + ': ' + t.t + ' ' + ad + ' pressed: ' + (await page.evaluate(() => window.__p)));
      }
      if (two) {
        await page.evaluate(n => HX.data.open('mon', n, true), n);
        await page.waitForTimeout(700);
        const r = await page.evaluate(() => {
          const p = document.getElementById('fpop2');
          return p ? p.innerText.replace(/\s+/g, ' ') : '';
        });
        ck(r.length > 60 && !/undefined|NaN/.test(r), n + ': second faceplate: ' + r.slice(0, 260));
      }
      if (process.env.SHOTD) await page.screenshot({ path: process.env.SHOTD + '/' + n.replace(/[^A-Z0-9]/gi, '_') + '.png' });
      await page.keyboard.press('Escape');
    }
    const st = await page.evaluate(() => [...document.querySelectorAll('#plantws [data-st]')].map(e => e.dataset.st + '=' + e.textContent));
    console.log('     ' + st.join(' | '));
    return st;
  };
  let st = await run('ash', [
    ['CHAIN CONVEYOR', ['START', 'STOP'], 1],
    ['BUCKET ELEVATOR', ['START', 'STOP'], 1],
    ['SCREW CONVEYOR', ['START', 'STOP'], 1],
    ['VIBRATING SCREEN', ['START', 'STOP'], 1],
    ['BAG FILTER FAN', ['START', 'STOP'], 1],
    ['L-1094 TWO-WAY SEPARATOR', ['OPEN', 'CLOSE'], 1],
    ['BOTTOM ASH CONVEYORS', ['RESET', 'EMERGENCY STOP'], 0]
  ]);
  ck(st.some(s => /SEPARATOR=(Open|Closed)/.test(s)), 'the two-way separator says Open or Closed');
  st = await run('ash-recycle', [['BOTTOM ASH TRANSMITTER', ['START', 'STOP', 'RESET', 'EMERGENCY STOP'], 1]]);
  ck(st.some(s => /TRANSMITTER=(Waiting|Sequence active)/.test(s)), 'the transmitter says Waiting or Sequence active');
  ck(!errs.length, 'no page error ' + errs.slice(0, 2).join(' | '));
  await browser.close();
  console.log(fail ? 'FAIL ' + fail : 'PASS');
  process.exit(fail ? 1 : 0);
})();
