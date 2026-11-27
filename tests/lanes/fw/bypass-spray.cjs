/* Phase 11 NANA (2026-11-27): the RH and HP bypass spray water from the BFWP 3rd stage (fw.js AN_BYS, anSprW) against the design
   sheets, not a table of the model:
     KSB curve Q43446D: 3rd-stage tap-off 722 m at 540 m3/h = 71.6 kg/cm2 g at suction 6.0 (the YUA read derives the same);
     TCV-FW1060 (E2-0-123 R1 A PDF p15), the four sizing cases: Cv at the printed travel from the modified equal % points, flow from
       the printed P1 / P2 / T within 5 % (COND 3 prints 13 % Cv at 34 % travel: its flow is checked at its printed Cv);
     the line: at the turbine trip tap 69.4 kg/cm2 g (KSB item 8) the COND 1 opening passes 30.0 t/h with P1 68.34 kg/cm2 a;
     TCV-FW1150 (L21): Cv 6.2 at dp 34 kg/cm2 gives the sheet 29.5 t/h within 5 %;
     no flow on a shut valve or with no pressure difference. */
const fs = require('fs'),
  path = require('path'),
  vm = require('vm');
const root = path.resolve(__dirname, '..', '..', '..');
const ctx = { console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'src/analog/engine/steam.js'), 'utf8'), ctx);
vm.runInContext(
  'var swInterp=(X,Y,x)=>{if(x<=X[0])return Y[0];for(let i=1;i<X.length;i++)if(x<=X[i])return Y[i-1]+(Y[i]-Y[i-1])*(x-X[i-1])/(X[i]-X[i-1]);return Y[Y.length-1];};',
  ctx
);
vm.runInContext(fs.readFileSync(path.join(root, 'src/analog/engine/fw.js'), 'utf8'), ctx);
let bad = 0;
const ck = (n, v, t, tol, pct) => {
  const e = pct ? (v / t - 1) * 100 : v - t,
    ok = isFinite(v) && Math.abs(e) <= tol;
  if (!ok) bad++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${n} ${(+v).toFixed(3)} / ${t}`);
};
const R = s => vm.runInContext(s, ctx);
/* water density: IF97 saturated water, plant.js anWaterRho (as the model) */
const WR = fs.readFileSync(path.join(root, 'src/analog/engine/plant.js'), 'utf8').match(/function anWaterRho\(T\) \{[\s\S]*?\n\}/)[0];
vm.runInContext(WR, ctx);
const rho = T => vm.runInContext(`anWaterRho(${T})`, ctx);
ck('3rd-stage tap at 540 m3/h, kg/cm2 g', 6.0 + (0.9093 / 10) * R('swInterp(AN_BYS.tQ, AN_BYS.tH, 540)'), 71.6, 0.2);
const cv = x => R(`AN_BYS.hp.cv * swInterp(AN_BYS.hp.x, AN_BYS.hp.y, ${x}) / 100`);
/* [kg/h, P1 a, P2 a, T, printed Cv, printed travel] */
const C = [
  [30019, 68.34, 39.8, 159.5, 6.88, 73],
  [12393, 84.57, 7.8, 128.1, 1.7, 34],
  [9664, 85.92, 7.7, 104.2, 1.3, null],
  [5023, 85.98, 7.7, 104.2, 0.68, 24]
];
C.forEach(([w, p1, p2, T, c, x], i) => {
  const Cv = x == null ? c : cv(x);
  if (x != null) ck(`TCV-FW1060 COND ${i + 1} Cv at ${x} % travel`, Cv, c, 1, true);
  /* the valve alone: k of the line off (P1 is the valve inlet) */
  const a = 0.0273 * Cv * Math.sqrt(0.980665 * rho(T));
  ck(`TCV-FW1060 COND ${i + 1} flow t/h`, a * Math.sqrt(p1 - p2), w / 1000, 5, true);
});
ck('line: trip tap 69.4 g, COND 1 opening, t/h', R(`anSprW(${cv(73)}, 69.4, ${39.8 - 1.0332}, ${rho(159.5)})`), 30.019, 3, true);
ck('TCV-FW1150 Cv 6.2 at dp 34, t/h (k of the line off)', 0.0273 * 6.2 * Math.sqrt(0.980665 * rho(159.5) * 34), 29.5, 5, true);
ck('shut valve', R('anSprW(0, 70, 30, 900)'), 0, 1e-9);
ck('no pressure difference', R('anSprW(10.3, 30, 30, 900)'), 0, 1e-9);
console.log(bad ? `bypass-spray: FAIL ${bad}` : 'bypass-spray: PASS (KSB tap-off, TCV-FW1060 4 sizing cases, line, TCV-FW1150)');
process.exit(bad ? 1 : 0);
