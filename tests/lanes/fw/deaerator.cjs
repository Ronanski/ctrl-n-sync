/* Phase 11 part 5 (NANA, 2026-11-27): the deaerator energy balance of engine/fw.js, headless, no plant run.
   1. IAPWS-IF97 region 1 liquid enthalpy against the IF97 verification values (Table 5).
   2. The design point of K2MC2F-001 rev 1 (K1AU3-D1-0-038 R0 p3) closes: condensate 362.59 t/h at 114.9 C (No.3 LPH outlet, FHI
      heater O&M L15-7), the HP heater drains 69.35 t/h at 166.3 C (K1AU3-D1-0-036 No.1 HPH drain out), the extraction steam at
      the stage 6.369 ata / 310.3 C through the extraction line of AN_DA: the deaerator holds 158.4 C +-1.0 C (5.05 kg/cm2 G) with
      26.79 +-1.5 t/h of steam, from a start 10 C away on either side (the line law is the physics, not a fit at one point).
   3. Sweep: the extraction stage from 30 % to 100 % of the heat balance line (anHb 'xd'), condensate + drains scaled with the
      steam, the drain at its own load's deaerator water + the design DCA: the deaerator pressure is below the stage pressure at every point and rises with it (monotonic, no step).
   4. Reverse flow on a stage pressure collapse, and none with an NRV shut. */
const fs = require('fs'),
  path = require('path'),
  vm = require('vm');
const root = path.resolve(__dirname, '..', '..', '..');
const ctx = { Math, console, isFinite, Number, Object, Array };
vm.createContext(ctx);
for (const f of ['engine/steam.js', 'engine/ports.js']) vm.runInContext(fs.readFileSync(path.join(root, 'src/analog', f), 'utf8'), ctx, { filename: f });
/* the IF97 water density of plant.js (anDeaStep writes U.da.rho / rhoL for the BFWP suction, 2026-11-28) */
vm.runInContext(fs.readFileSync(path.join(root, 'src/analog/engine/plant.js'), 'utf8').match(/function anWaterRho\(T\) \{[\s\S]*?\n\}/)[0], ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'src/analog/engine/fw.js'), 'utf8'), ctx, { filename: 'engine/fw.js' });
let bad = 0,
  nrvS = 100; /* the secondary NRV position of the runs (tcs-dev.js U.dev.nrv) */
const fail = m => (bad++, console.log('FAIL', m));
const h1 = (p, T) => vm.runInContext(`steamR1(${p}, ${T}).h`, ctx);
for (const [p, T, h] of [[3, 300, 115.331273], [80, 300, 184.142828], [3, 500, 975.542239]]) {
  const v = h1(p, T);
  if (Math.abs(v - h) > 1e-5) fail(`IF97 r1 h(${p} MPa, ${T} K) = ${v}, table ${h}`);
}
/* a steady run of anDeaStep with the inflows fixed (U fields as the plant model gives them) */
function run(T0, Pxa, wc, tc, wd, td, mins) {
  vm.runInContext('var AN_CYC = { y: { da: 0 }, kgmm: { da: () => 3.3 * 13.14 * 0.909 } }; function anCycFlows(){ return { fda: 0 }; }', ctx);
  ctx.U = { Tamb: 30, ms: 0, da: { T: T0 }, hd: [{ k: 'H5', w1: wd }], hpD1: td, lpHt: { H3: { out: tc } }, tt: { 'TT-TS1018': 310.3 }, dev: { nrv: { ex3p: { p: 100 }, ex3s: { p: nrvS } } } };
  ctx.Pxa = Pxa;
  ctx.wc = wc;
  ctx.tc = tc;
  vm.runInContext(
    `var anPortGet = (U, id) => id === 'ext.da' ? { P: Pxa, T: 310.3 } : id === 'cd.out' ? { m: wc, T: tc } : null; var anDitlPos = () => 100;`,
    ctx
  );
  for (let i = 0; i < mins * 300; i++) vm.runInContext('anDeaStep(U, 0.2)', ctx);
  return ctx.U.da;
}
for (const T0 of [148.4, 168.4]) {
  const d = run(T0, 6.369, 362.59, 114.9, 69.35, 166.3, 60);
  console.log(`design start ${T0} C: T ${d.T.toFixed(2)} C, P ${d.P.toFixed(3)} kg/cm2 G, steam ${d.wx.toFixed(2)} t/h`);
  if (Math.abs(d.T - 158.4) > 1.0) fail(`design T ${d.T.toFixed(2)} C, K2MC2F-001 158.4 C`);
  if (Math.abs(d.wx - 26.79) > 1.5) fail(`design steam ${d.wx.toFixed(2)} t/h, K2MC2F-001 26.79 t/h`);
}
let last = -1,
  Tprev = vm.runInContext('steamTsat(0.955 * 6.369 * 0.3 - 1.0332)', ctx);
for (let f = 0.3; f <= 1.0001; f += 0.05) {
  /* the drain comes in at the deaerator water of its own load + the design DCA 7.9 C (166.3 - 158.4, No.1 HPH sheet): the water
     at the saturation of the stage less the design line drop (6.083 / 6.369) */
  const td = vm.runInContext(`steamTsat(${0.955 * 6.369 * f} - 1.0332)`, ctx) + 7.9;
  /* each point starts from the one below (a slow load rise) and runs 4 h: the storage water + metal (about 470 MJ/K) against the
     condensate takes about an hour to settle at 30 % */
  const d = run(Tprev, 6.369 * f, 362.59 * f, 114.9, 69.35 * f, td, 240);
  Tprev = d.T;
  if (!(d.P + 1.0332 < 6.369 * f)) fail(`load ${f.toFixed(2)}: deaerator ${d.P.toFixed(3)} G not below the stage ${(6.369 * f).toFixed(3)} ata`);
  if (!(d.P > last)) fail(`load ${f.toFixed(2)}: pressure ${d.P.toFixed(3)} not above the lower load ${last.toFixed(3)}`);
  last = d.P;
}
/* 4. Reverse (RIN 2026-11-28, load rejection): the stage falls to 2.0 ata under the deaerator at 158.4 C: the steam goes back to the
   turbine (wx < 0) at the saturated steam of the deaerator and the water cools by its flash; the NRVs shut (tcs-dev.js) = no flow */
{
  const d = run(158.4, 2.0, 0, 114.9, 0, 158.4, 1 / 300);
  console.log(`reverse: stage 2.0 ata, deaerator ${d.P.toFixed(3)} G: steam ${d.wx.toFixed(2)} t/h`);
  if (!(d.wx < -26.79)) fail(`reverse steam ${d.wx.toFixed(2)} t/h: not back to the turbine above the design forward flow`);
  nrvS = 0;
  const z = run(158.4, 2.0, 0, 114.9, 0, 158.4, 1 / 300);
  if (z.wx !== 0) fail(`NRV shut: steam ${z.wx} t/h, not 0`);
  nrvS = 100;
}
console.log(bad ? `deaerator: ${bad} FAIL` : 'deaerator: PASS (IF97 r1, design point, 30 ~ 100 % sweep, reverse flow + NRV)');
process.exit(bad ? 1 : 0);
