// 1.0.0-beta.362 D18 (JENNIE, user 2026-11-24 "Go ayos"): the TCS machines with no screen macro. Each is run by the push buttons of its
// IBD sheet (tcs-trip.js TCS_IBD_PBN, TCS_IBD_DEV), from the Cold and the 150 MW starting points of the app in the one world:
//  - TB-9 turning gear motor: START refused by the sheet with no bearing oil (net 3 permissive), runs after MOP-A START, the shaft turns, STOP
//  - TB-12 vapour extractor: START / STOP
//  - TC-31 steam seal feed inlet valve: OPEN puts PV-GS1031 in service (c.gsOn), CLOSE takes it out
//  - TC-28 gland steam exhauster: START
//  - TC-35 LP exhaust hood spray FV-CD1904: AUTO opens it 3 s after the GSE start below 15 % load; at 150 MW AUTO and closed
//  - a push button the sheet does not have is refused
// Usage: node tests/regress/tcs_ibd_devices.js [html]
const fs = require('fs');
const { open } = require('./lib.js');
const html = process.argv.find(a => /\.html$/.test(a)) || 'dist/' + fs.readdirSync('dist').find(x => /^logic-sim-v[\d.]+(?:-beta\.\d+)?\.html$/.test(x));
(async () => {
  const { browser, page, errs } = await open(html);
  let fail = 0;
  const ck = (ok, w) => {
    console.log((ok ? 'PASS ' : 'FAIL ') + w);
    if (!ok) fail++;
  };
  const a = await page.evaluate(async () => {
    const o = {};
    await AN.ades();
    WORLD.set(true);
    document.getElementById('loadcold').click();
    await AN._startP;
    const C1 = AN.sheets.find(z => z.name === 'ABC-001C');
    const wrun = async sec => {
      for (let k = 0; k < sec * 2; k++) {
        WORLD.live = true;
        AN.stepSet(C1, 0.5);
        WORLD.tick(0.5);
        if (k % 200 === 199) await new Promise(r => setTimeout(r, 0));
      }
    };
    const c = () => AN.unit.tc;
    const pb = (id, b) => AN.turbine('ibd', { id, pb: b });
    await wrun(5);
    o.tg0 = [pb('TB-9', 'START'), 0];
    await wrun(5);
    o.tg0[1] = !!c().tg;
    o.oil = AN.turbine('oil', { p: 'mopA', op: 'start' });
    await wrun(15);
    o.brg = !!c().brgOk;
    o.tg1 = pb('TB-9', 'START');
    await wrun(30);
    o.tg1 = [o.tg1, !!c().tg, +AN.unit.tb.rpm.toFixed(1)];
    o.vx = [pb('TB-12', 'START')];
    await wrun(5);
    o.vx.push(!!c().vex);
    pb('TB-12', 'STOP');
    await wrun(5);
    o.vx.push(!!c().vex);
    o.ss = [pb('TC-31', 'OPEN')];
    await wrun(5);
    o.ss.push(!!c().ssfv, !!c().gsOn);
    o.ge = [pb('TC-28', 'START')];
    await wrun(5);
    o.ge.push(!!c().gse);
    o.hs = [pb('TC-35', 'AUTO')];
    await wrun(10);
    o.hs.push(!!c().hspAu, !!c().hso, +(+AN.unit.MW || 0).toFixed(1));
    pb('TC-31', 'CLOSE');
    await wrun(5);
    o.ss.push(!!c().ssfv, !!c().gsOn);
    pb('TB-9', 'STOP');
    await wrun(5);
    o.tg2 = !!c().tg;
    o.bad = [pb('TC-35', 'CLOSE'), pb('XX-1', 'START')];
    /* 150 MW */
    document.getElementById('load150').click();
    await AN._startP;
    await wrun(30);
    const t = AN.tcs().aux;
    o.l = { hsp: t.hsp, hso: t.hso, gse: t.gse, ssfv: t.ssfv, vex: t.vex, gsP: +(+AN.unit.gsP).toFixed(2), MW: +(+AN.unit.MW).toFixed(1), ibd: t.ibd };
    return o;
  });
  ck(!a.tg0[1], 'TB-9 START with no bearing oil: not running (sheet net 3 permissive) ' + JSON.stringify(a.tg0));
  ck(!a.oil && a.brg && a.tg1[0] === '' && a.tg1[1] && a.tg1[2] >= 2.5, 'MOP-A START, bearing oil ' + a.brg + ', TB-9 START: running, shaft ' + JSON.stringify(a.tg1) + ' rpm');
  ck(a.vx[0] === '' && a.vx[1] && !a.vx[2], 'TB-12 vapour extractor START / STOP ' + JSON.stringify(a.vx));
  ck(a.ss[0] === '' && a.ss[1] && a.ss[2] && !a.ss[3] && !a.ss[4], 'TC-31 steam seal feed inlet valve OPEN / CLOSE, PV-GS1031 in / out of service ' + JSON.stringify(a.ss));
  ck(a.ge[0] === '' && a.ge[1], 'TC-28 gland steam exhauster START ' + JSON.stringify(a.ge));
  ck(a.hs[0] === '' && a.hs[1] && a.hs[2], 'TC-35 hood spray AUTO: FV-CD1904 open (GSE started 3 s, load < 15 %) ' + JSON.stringify(a.hs));
  ck(!a.tg2, 'TB-9 STOP: turning gear motor stopped');
  ck(/no CLOSE/.test(a.bad[0]) && /No TCS push button sheet/.test(a.bad[1]), 'push buttons the sheets do not have are refused ' + JSON.stringify(a.bad));
  ck(a.l.hsp && !a.l.hso && a.l.ssfv && a.l.gsP >= 0.1 && a.l.MW > 140, '150 MW: hood spray AUTO and closed (load > 15 %), gland seal in service ' + JSON.stringify(a.l));
  /* beta.364: the sheet permissives for the faceplates (AN.tcs().aux.ibd); at 150 MW the turning gear is refused (the MSVs are open) */
  const ib = a.l.ibd || {}, v01 = x => x === 0 || x === 1;
  ck(ib['TB-9'] && ['perm', 'msvIcv', 'oil', 'hand', 'et', 'man'].every(k => v01(ib['TB-9'][k])) && ib['TB-9'].msvIcv === 0 && ib['TB-9'].perm === 0 && ib['TB-9'].oil === 1 && v01(ib['TB-12'].et) && v01(ib['TC-28'].et) && v01(ib['TC-28'].man) && v01(ib['TC-31'].man) && v01(ib['TC-35'].man) && ib['TC-35'].load15 === 0, 'aux.ibd permissives from the sheets at 150 MW ' + JSON.stringify(ib));
  ck(!errs.length, 'no page error ' + errs.slice(0, 2).join(' | '));
  console.log(fail ? 'FAIL ' + fail : 'ALL PASS');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
