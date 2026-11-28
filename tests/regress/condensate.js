// 3.2.1 (IRENE: PLANT MODEL, CONDENSATE; unit.js AN_CD / anCondStep; docs/versions/v3.2.1/CONDENSATE_PLANT_MODEL.md).
// The one world ON (ABC + DITL), plant model ON, Start at 150 MW:
//  base: condenser pressure from the seawater and the steam (O&M L15-1), hotwell temperature, CEP flow / outlet pressure / current
//    (KSB curve Q43495D), the DITL-61B row PT-CD1117 reads the same number;
//  CEP A trips (DITL-61A row 2 MIT-P1116A): PT-CD1117 < 14 kg/cm2 -> M.3217 -> the standby CEP B (AUTO) is started by the logic;
//  condenser inlet V-SW1007 closed (one water box): the condenser pressure rises;
//  both condenser inlets closed: no seawater, the condenser pressure rises past the LOW VACUUM trip, the turbine trips;
//  make-up pumps' discharges closed: no make-up to the hotwell (the hotwell falls faster than with the make-up).
// Usage: node tests/regress/condensate.js [html]
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
  await page.waitForFunction(() => AN.sheets && AN.sheets.length >= 54 && window.WORLD && WORLD.idx && S.sheets.length >= PRE_N, null, { timeout: 120000 });
  await page.waitForTimeout(2000);
  const r = await page.evaluate(async () => {
    const C1 = AN.sheets.find(s => s.name === 'ABC-001C');
    const run = async sec => {
      for (let i = 0; i < sec * 2; i++) {
        WORLD.live = true;
        AN.stepSet(C1, 0.5);
        WORLD.tick(0.5);
        if (i % 100 === 99) await new Promise(r => setTimeout(r, 0));
      }
    };
    const sh = n => S.sheets.concat(WORLD.inst || []).find(x => x.name.endsWith(n));
    const set = (n, row, v) => {
      WORLD.live = true;
      const ok = WORLD.dset(n, row, v);
      WORLD.live = false;
      return ok;
    };
    const f = x => Math.round(x * 1000) / 1000;
    const U = () => AN.unit;
    const g = () => ({ P: f(U().cdP), T: f(U().cdT), Q: U().cdQ, W: U().swQc, Ti: (U().swTiA + U().swTiB) / 2, q: U().cdQp, Pd: f(U().cdPd), I: [U().cdI0, U().cdI1], dp: [U().cdDp0, U().cdDp1], d61: (sh('DITL-61B').avw || {}).r20, d55: f(window.WORLD && WORLD.condP ? WORLD.condP() : NaN), hw: f(U().cdHw), run: U().cdRun, tb: U().tb && U().tb.st, trip: !!(U().vtrip && U().vtrip.S.rt.ext[U().vtrip.n] === 1) });
    const V = (t, p) => AN.swValve(t, p);
    const o = {};
    /* beta.320 (JENNIE): the app's own "At 150 MW" (index #load150: the reset, the save point st150 and the unit start, AN._startP);
       the old AN.reset + AN.plantLoad150 + DITL150.apply left no unit model (AN.unit is made by the unit start only) */
    await AN.ades();
    const start = async () => {
      WORLD.set(true);
      document.getElementById('load150').click();
      await AN._startP;
      await run(60);
    };
    await start();
    o.base = g();
    set('DITL-61A', 2, true);
    o.trMin = 99;
    o.trB = null;
    for (let i = 0; i < 20; i++) {
      await run(0.5);
      const x = g();
      o.trMin = Math.min(o.trMin, x.Pd);
      if (o.trB == null && x.run[1] === 1) o.trB = (i + 1) / 2;
      if (i === 0) o.tr05 = x;
    }
    await run(20);
    o.tr30 = g();
    set('DITL-61A', 2, false);
    await start();
    V('V-SW1007', 0);
    await run(120);
    o.box1 = g();
    V('V-SW1008', 0);
    await run(90);
    o.box0 = g();
    await start();
    const hw0 = U().cdHw;
    await run(120);
    o.hwN = f(U().cdHw - hw0);
    V('V-MU0007', 0);
    V('V-MU0011', 0);
    await run(30);
    const hw1 = U().cdHw;
    await run(120);
    o.hwMu = f(U().cdHw - hw1);
    o.muFeed = U().muFeed;
    return o;
  });
  console.log(JSON.stringify(r));
  const b = r.base;
  /* Phase 11 (MEI, rule 0 2026-11-28): design references only, no plant screen. Condenser: O&M L15-1 design 0.070 kg/cm2A / 38.65 C
     (+-0.01 for the seawater and the steam of the model point). CEP: PT-CD1117 above its LOW 14.0 (DITL-61B row 19) and below the
     shut-off head 210 m of the KSB curve Q43495D (~21.6 kg/cm2 g with the suction); current inside the motor balance of the load
     schedule K1AU3-E1-0-302 (14.6 A at the shut-off power 105 kW, F.L.A. 31.56 A at 298.4 kW) */
  /* the vacuum judged by the tube law at the ACTUAL seawater flow and inlet temperature (coordinator 2026-11-28; no vendor BP curve in
     the docs, YUA read mei-condenser-vendor-reads-2026-11-28.md). Written here on its own from the design data, not taken from the model:
     O&M L15-1 195.7 MW, 31,500 t/h, 30 -> 35.6 C, 38.65 C / 68.6 mbar, CF 0.85; D1-039 titanium OD 20 x 0.5 mm, 9,898 m2, 2.4 m/s.
     UA = A / (1 / h_w + R_wall + R_rest): h_w Dittus-Boelter (Vogel viscosity, Ramires conductivity), R_rest from the design point.
     First the law must give the design point itself (38.65 C within 0.05 C), then the model within 0.002 kg/cm2 of the law at its own
     heat, seawater flow and inlet temperature (the model's seawater cp 3.994 and the 1.02 t/h per m3/h of AN_SW) */
  const law = (() => {
    const D = 0.019, Do = 0.02, A = 9898, kTi = 21.9,
      hw = (V, T) => { const Tk = T + 273.15, mu = 2.414e-5 * 10 ** (247.8 / (Tk - 140)), t = Tk / 298.15, k = 0.6065 * (-1.48445 + 4.12292 * t - 1.63866 * t * t);
        return (0.023 * ((996 * V * D) / mu) ** 0.8 * ((mu * 4180) / k) ** 0.4 * k) / D * (D / Do); },
      Rw = (Do * Math.log(Do / D)) / (2 * kTi),
      lmtd = 5.6 / Math.log(8.65 / 3.05), Ud = (195.7e6 / lmtd) / A, Rr = 1 / Ud - 1 / hw(2.4, 32.8) - Rw,
      Ts = (Qkw, Wt, Ti, cp) => { const C = (Wt / 3.6) * cp, UA = A / (1 / hw((2.4 * Wt) / 31500, Ti + Qkw / (2 * C)) + Rw + Rr) / 1000;
        return Ti + Qkw / (C * (1 - Math.exp(-UA / C))); };
    return { Ts, design: Ts(195700, 31500, 30, (195.7e3 / 5.6) / (31500 / 3.6)) };
  })();
  const psat = T => (10 ** (8.07131 - 1730.63 / (233.426 + T)) * 1.33322) / 980.665,
    Tl = law.Ts(b.Q * 1000, b.W * 1.02, b.Ti, 3.994),
    Pl = psat(Tl);
  ck(Math.abs(law.design - 38.65) < 0.05, `the tube law gives the O&M design point: ${law.design.toFixed(2)} C (38.65 C, 68.6 mbar)`);
  ck(Math.abs(b.P - Pl) <= 0.002 && b.T > 30 && b.T < 41.5, `150 MW condenser ${b.P} kg/cm2A at ${b.T} C vs the tube law ${Pl.toFixed(4)} at ${Tl.toFixed(2)} C (heat ${b.Q} MW, seawater ${b.W} m3/h at ${b.Ti.toFixed(1)} C)`);
  ck(b.run[0] === 1 && b.run[1] === 0 && b.Pd > 14.0 && b.Pd < 21.6 && b.I[0] > 14.6 && b.I[0] < 31.56 && b.d61 === b.Pd, `CEP A ${b.q} m3/h, PT-CD1117 ${b.Pd} kg/cm2 (LOW 14.0 < Pd < shut-off), ${b.I[0]} A (14.6 ~ 31.56, load schedule), DITL-61B row 19 reads ${b.d61}`);
  ck(r.trMin < 14 && r.trB != null, `CEP A tripped: PT-CD1117 down to ${r.trMin} kg/cm2 (< 14.0, DITL-61B M.3217), CEP B running after ${r.trB} s`);
  ck(r.tr30.run[1] === 1 && r.tr30.Pd > 14, `the logic started CEP B: ${r.tr30.q} m3/h, PT-CD1117 ${r.tr30.Pd}, ${r.tr30.I[1]} A`);
  ck(r.box1.W < b.W && r.box1.P > b.P && !r.box1.trip, `condenser inlet V-SW1007 closed: seawater ${r.box1.W} m3/h, condenser ${r.box1.P} kg/cm2A at ${r.box1.T} C, no trip`);
  /* no seawater: the pressure passes the TCS LOW VACUUM trip 0.26 kg/cm2 abs (IBD 310SC90-794 TA-10) and, with no water to cool it,
     stays above it after the trip */
  ck(r.box0.W === 0 && r.box0.P >= 0.26 && r.box0.trip, `both inlets closed: no seawater, condenser ${r.box0.P} kg/cm2A, turbine LOW VACUUM trip`);
  ck(r.muFeed === 0 && r.hwMu < r.hwN - 0.5, `MWP discharges closed: no make-up, hotwell ${r.hwMu} mm in 2 min (with make-up ${r.hwN} mm)`);
  ck(!errs.length, 'no page error' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
  await browser.close();
  console.log(fail ? 'FAILED ' + fail : 'ALL PASS');
  process.exit(fail ? 1 : 0);
})();
