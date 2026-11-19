// 3.2.1 plan c4, desk test of src/analog/engine/tcs-gen.js against 310SD03-743 G-4 and G-1B. No browser. Usage: node tests/regress/tcs_gen_desk.js
const fs = require('fs'), vm = require('vm');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('src/analog/engine/tcs-gen.js', 'utf8') + ';this.G={tcsGen,tcsGenStep,tcsGenTrip}', ctx);
const { tcsGen, tcsGenStep, tcsGenTrip } = ctx.G;
let f = 0;
const ck = (ok, t) => {
  console.log((ok ? 'PASS ' : 'FAIL ') + t);
  if (!ok) f++;
};
const run = (U, s) => {
  for (let i = 0; i < s * 2; i++) tcsGenStep(U, 0.5);
};
const roll = rpm => ({ tb: { st: 'roll', rpm } });
{
  const U = roll(3000);
  tcsGen(U).ex = true;
  run(U, 2);
  ck(!U.gen.f41, '41 stays open below rated speed');
  U.tb.rpm = 3545;
  U.gen.ex = true;
  run(U, 2);
  ck(!U.gen.f41, '41 stays open at 3545 rpm, rated speed ON is 3550');
  U.tb.rpm = 3600;
  U.gen.ex = true;
  run(U, 1);
  ck(U.gen.f41, '41 closes at rated speed with the start pulse');
  /* beta.236: the voltage builds by the physics (T'do 7.69 s, field forcing): 84GI (95 %) in about 2 s, not the old 30 s ramp */
  U.gen.start = true;
  tcsGenStep(U, 0.5);
  ck(!U.gen.x25 && U.gen.V < 0.95, 'no synchronizing before the generator voltage');
  run(U, 5);
  ck(U.gen.x25 && !U.gen.close, '25X1 seals in with voltage, 25 not yet on');
  run(U, 60);
  ck(U.gen.close, 'close order after ASD matches');
  tcsGenTrip(U);
  ck(!U.gen.f41 && !U.gen.close && U.gen.V === 0, 'a trip opens 41 and drops the close order');
}
{
  const U = { tb: { st: 'load', rpm: 3600 } };
  tcsGenStep(U, 0.5);
  ck(U.gen.f41 && U.gen.V === 1, 'on the grid at start: 41 closed, voltage on');
  U.gen.ex = true;
  tcsGenStep(U, 0.5);
  ck(!U.gen.close, 'no close order while 52G is closed');
}
{
  const U = roll(3600);
  tcsGen(U).ex = true;
  run(U, 31);
  const on = U.gen.V >= 0.99;
  U.gen.start = true;
  /* the 5 min window: ASD never reaches 25 ON */
  ctx.TCS_GEN_OVERRIDE = 1;
  const asd = vm.runInContext('TCS_GEN.asd', ctx);
  vm.runInContext('TCS_GEN.asd=9999', ctx);
  run(U, 310);
  ck(on && !U.gen.start && !U.gen.x25 && /timed out/.test(U.gen.last), 'auto synchronizing times out at 5 min');
  vm.runInContext('TCS_GEN.asd=' + asd, ctx);
}
{
  /* the generator control panel (gen-panel.js): manual synchronizing, GEE-2015-0141 p.7, 52G only with SYN. CHECK 25 */
  vm.runInContext('var AN={};' + fs.readFileSync('src/analog/engine/gen-panel.js', 'utf8') + ';this.P={tcsGenCmd}', ctx);
  const { tcsGenCmd } = ctx.P;
  const U = roll(3600);
  U.tc = { cur: 5, ph: 'in', step: 5 };
  tcsGen(U).ex = true;
  U.gen.start = true;
  run(U, 5);
  ck(tcsGenCmd(U, { op: 'syn', v: 'MAN' }) === '' && !U.gen.x25, 'SYN MANUAL takes the ASD away');
  ck(/SYN on MANUAL/.test(tcsGenCmd({ tb: U.tb, tc: U.tc, gen: Object.assign({}, U.gen, { syn: 'AUTO' }) }, { op: 'close52g' })), '52G CLOSE refused in SYN AUTO');
  /* wait for a phase angle far from 0, press: refused; then for the angle near 0 with a small slip, press: accepted */
  let far = '', ok = null;
  for (let i = 0; i < 4000 && (ok === null || !far); i++) {
    tcsGenStep(U, 0.05);
    const g = U.gen;
    if (!far && Math.abs(g.th) > 90) far = tcsGenCmd(U, { op: 'close52g' });
    if (far && ok === null && Math.abs(g.th) < 3 && Math.abs(g.slip) < 0.1 && Math.abs(g.dv) < 0.05) ok = tcsGenCmd(U, { op: 'close52g' });
  }
  ck(/SYN. CHECK 25 not operated.*phase angle/.test(far), '52G CLOSE refused out of phase: ' + far);
  run(U, 0.5);
  ck(ok === '' && U.gen.close, '52G CLOSE accepted inside 25, close order given');
}
console.log(f ? 'FAIL ' + f : 'ALL PASS');
process.exit(f ? 1 : 0);
