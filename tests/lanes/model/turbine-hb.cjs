/* Phase 11 turbine (RIN, 2026-11-27, rule 0): the steam path of turbine.js (tbPath: Stodola + IF97 expansion, geometry from HB
   PPE-14-0725 R1 case 1 and VWO ONLY) against ALL 8 cases of that heat balance (YUA PC read 2026-11-27,
   /mnt/project-files/turbine-hb-read-2026-11-27.md; the printed values are copied below as the test data). For each case the inputs
   are what the other parts give the turbine (main steam flow, pressure and temperature, the hot reheat flow and temperature, the
   condenser pressure, the heater draws); the turbine must give the stage pressures, the cold reheat temperature, the LP exhaust
   enthalpy and the generator MW of the heat balance. Fails beyond: stage pressures 2 % (No.2 / No.1 LP at 40 % and 30 %: 4 % / 8 %, the
   last stages at low volume flow, see turbine.js), CRH temperature 2 C, exhaust 4 kcal/kg, generator MW 1 MW (ACCEPTANCE Part 1). */
const fs = require('fs'),
  path = require('path'),
  vm = require('vm');
const root = path.resolve(__dirname, '..', '..', '..');
const ctx = {};
vm.createContext(ctx);
for (const f of ['steam.js', 'turbine.js']) vm.runInContext(fs.readFileSync(path.join(root, 'src/analog/engine', f), 'utf8'), ctx);
/* case: MS G P T, HRH G P T, CRH P T, ext G (hp6, hp5, dea line, lp3, lp2, lp1), stage P (x5, da, l3, l2, l1), cond, exhaust H, kW */
const HB = {
  1: [458327, 126, 538, 400944, 34.77, 538, 38.64, 370.2, [45147, 24200, 22225, 15246, 12270, 16834], [14.87, 6.369, 1.914, 0.826, 0.373], 0.07, 570.1, 150000],
  2: [387587, 126, 538, 341146, 29.6, 538, 32.89, 365.3, [35834, 19520, 18192, 12531, 10192, 13357], [12.7, 5.457, 1.643, 0.71, 0.321], 0.065, 572.1, 127500],
  3: [318817, 126, 538, 282390, 24.53, 538, 27.25, 361.5, [27410, 15237, 14322, 10009, 8190, 10093], [10.56, 4.553, 1.373, 0.594, 0.269], 0.06, 574.6, 105000],
  4: [273360, 126, 538, 243115, 21.13, 538, 23.48, 358.1, [22278, 12538, 11861, 8422, 6871, 7935], [9.13, 3.943, 1.19, 0.516, 0.234], 0.057, 577, 90000],
  5: [231940, 126, 529, 206945, 17.91, 529, 19.9, 346.6, [17966, 10290, 9744, 6963, 5685, 6060], [7.75, 3.355, 1.014, 0.44, 0.201], 0.055, 578.4, 75000],
  6: [190769, 126, 520, 170729, 14.71, 520, 16.35, 335.5, [13948, 8107, 7704, 5603, 4525, 4184], [6.38, 2.769, 0.837, 0.364, 0.167], 0.054, 582.1, 60000],
  7: [149954, 98.9, 505, 134834, 11.51, 505, 12.79, 328.8, [10176, 6177, 5793, 4251, 3426, 2243], [5.0, 2.173, 0.658, 0.286, 0.133], 0.053, 589.1, 45000],
  VWO: [472460, 126, 538, 412809, 35.8, 538, 39.78, 371.2, [47091, 25088, 23092, 15768, 12691, 17527], [15.3, 6.55, 1.968, 0.849, 0.383], 0.071, 569.7, 154500]
};
/* the HB generator kW from the shaft work: the lumped mechanical + generator loss of the 8 HB cases (shaft = sum of m dh from the HB
   enthalpies less the printed kW: 3.37 MW at 100 % to 2.65 MW at 30 %, lo + kq shaft^2 within 0.03 MW). Test side only: the model
   splits it into the turbine mechanical loss (turbine.js AN_TB.mech) and the generator losses of the machine data (YUI anGenW) */
vm.runInContext('var HBGEN = sh => sh - 2.565 - 3.295e-5 * sh * sh;', ctx);
let bad = 0;
const lim = { 6: [2, 2, 2, 4, 4], 7: [2, 2, 2, 4, 8] };
for (const k of Object.keys(HB)) {
  const [ms, Pms, Tms, hrh, Phr, Thr, Pcr, Tcr, x, Ps, Pc, Hx, kW] = HB[k];
  const I = { ms: ms / 1000, Pin: Pms, Tms, qip: hrh / 1000, Thr, Pc, w: { hp6: x[0] / 1000, hp5: x[1] / 1000, da: x[2] / 1000, lp3: x[3] / 1000, lp2: x[4] / 1000, lp1: x[5] / 1000 } };
  ctx.I = I;
  const r = vm.runInContext('(()=>{let o=null;for(let i=0;i<12;i++)o=tbPath(I,o);o.Tcr=steamPhM(o.P.crh*TB_A,o.H.crh).T-273.15;o.MW=HBGEN(o.Whp+o.Wip);return o})()', ctx);
  const row = [],
    ck = (n, v, t, tol, pct) => {
      const e = pct ? (v / t - 1) * 100 : v - t,
        ok = Math.abs(e) <= tol;
      if (!ok) bad++;
      row.push(`${n} ${v.toFixed(pct ? 3 : 1)}/${t} ${e >= 0 ? '+' : ''}${e.toFixed(1)}${pct ? '%' : ''}${ok ? '' : ' FAIL'}`);
    };
  const L = lim[k] || [2, 2, 2, 2, 2];
  ck('HRH', r.P.hrh, Phr, 2, 1);
  ck('CRH', r.P.crh, Pcr, 2, 1);
  ['x5', 'da', 'l3', 'l2', 'l1'].forEach((s, i) => ck(s, r.P[s], Ps[i], L[i], 1));
  ck('Tcr', r.Tcr, Tcr, 2, 0);
  ck('Hx', r.H.x / 4.1868, Hx, 4, 0);
  ck('MW', r.MW, kW / 1000, 1, 0) /* 1 MW, ACCEPTANCE Part 1 generator MW tolerance */;
  console.log(k.padEnd(4) + row.join(' | '));
}
console.log(bad ? 'turbine-hb: ' + bad + ' values off the heat balance' : 'turbine-hb: the steam path gives all 8 heat balance cases');
process.exit(bad ? 1 : 0);
