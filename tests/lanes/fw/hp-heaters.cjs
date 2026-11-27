/* Phase 11 rank 5 (NANA, 2026-11-27): the HP heaters of fw.js (anHpSolve: energy balance + three-zone heat transfer, UA from the
   K1AU3-D1-0-036 design point only) against the Hitachi heat balance PPE-14-0725 R1, all 8 cases. The extraction ports come from the
   turbine steam path of turbine.js (tbPath, RIN) at the heat balance inputs of each case (the same data as
   tests/lanes/model/turbine-hb.cjs), so the chain turbine -> heater is tested, not a table. Checks:
     design point (case 1): No.2 out 245.4 C, No.1 out 195.7 C, drains 201.3 / 166.3 C, extraction 45.147 / 24.2 t/h;
     every case: No.6 / No.5 extraction against the heat balance within 4 %; final feedwater 188.6 / 218.0 / 245.4 C at cases 7 / 4 / 1
     (docs/accept/part1-targets.json Tfw, tolerance 3 C);
     MOV shut: no extraction; MOV half open: shell pressure lower, less extraction, never more. */
const fs = require('fs'),
  path = require('path'),
  vm = require('vm');
const root = path.resolve(__dirname, '..', '..', '..');
const ctx = { console };
vm.createContext(ctx);
for (const f of ['steam.js', 'turbine.js', 'fw.js']) vm.runInContext(fs.readFileSync(path.join(root, 'src/analog/engine', f), 'utf8'), ctx);
const HB = {
  1: [458327, 126, 538, 400944, 34.77, 538, 38.64, 370.2, [45147, 24200, 22225, 15246, 12270, 16834], 0.07, 245.4],
  2: [387587, 126, 538, 341146, 29.6, 538, 32.89, 365.3, [35834, 19520, 18192, 12531, 10192, 13357], 0.065, null],
  3: [318817, 126, 538, 282390, 24.53, 538, 27.25, 361.5, [27410, 15237, 14322, 10009, 8190, 10093], 0.06, null],
  4: [273360, 126, 538, 243115, 21.13, 538, 23.48, 358.1, [22278, 12538, 11861, 8422, 6871, 7935], 0.057, 218.0],
  5: [231940, 126, 529, 206945, 17.91, 529, 19.9, 346.6, [17966, 10290, 9744, 6963, 5685, 6060], 0.055, null],
  6: [190769, 126, 520, 170729, 14.71, 520, 16.35, 335.5, [13948, 8107, 7704, 5603, 4525, 4184], 0.054, null],
  7: [149954, 98.9, 505, 134834, 11.51, 505, 12.79, 328.8, [10176, 6177, 5793, 4251, 3426, 2243], 0.053, 188.6]
};
let bad = 0;
const ck = (n, v, t, tol, pct) => {
  const e = pct ? (v / t - 1) * 100 : v - t,
    ok = isFinite(v) && Math.abs(e) <= tol;
  if (!ok) bad++;
  return `${n} ${v.toFixed(2)}/${t} ${ok ? '' : 'FAIL'}`;
};
/* the heaters at one case: ports from tbPath, deaerator water at the saturation of the deaerator stage less its design line drop
   (6.369 -> 6.083 ata at 26.79 t/h, K2MC2F-001), the pump heat of the design (160.7 - 158.4) */
function at(k, a1, a2) {
  const [ms, Pms, Tms, hrh, , Thr, , , x, Pc] = HB[k];
  ctx.I = { ms: ms / 1000, Pin: Pms, Tms, qip: hrh / 1000, Thr, Pc, w: { hp6: x[0] / 1000, hp5: x[1] / 1000, da: x[2] / 1000, lp3: x[3] / 1000, lp2: x[4] / 1000, lp1: x[5] / 1000 } };
  ctx.A = [a1, a2];
  return vm.runInContext(`(()=>{let o=null;for(let i=0;i<12;i++)o=tbPath(I,o);
    const m=I.ms, r=(I.w.da/26.79*1000/1000), Pda=o.P.da-(6.369-6.083)*Math.pow(I.w.da/26.79,2)*(6.369/o.P.da),
      Ti=steamTsatK(Pda*0.0980665)-273.15+2.3;
    let cas=0, hc=0, r1, r2;
    for (let it=0; it<8; it++) {
      r1=anHpSolve(0,m,Ti,155,o.P.x5,o.H.x5,A[0],cas,hc,r1&&r1.e);
      r2=anHpSolve(1,m,r1.To,155,o.P.crh,o.H.crh,A[1],0,0,r2&&r2.e);
      cas=r2.e; hc=hpHw(r2.Ps,r2.Td);
    }
    return {r1,r2,Ti};})()`, ctx);
}
for (const k of Object.keys(HB)) {
  const { r1, r2, Ti } = at(k, 1, 1),
    x = HB[k][8],
    row = [ck('e6', r2.e, x[0] / 1000, 4, 1), ck('e5', r1.e, x[1] / 1000, 4, 1)];
  if (HB[k][10] != null) row.push(ck('Tfw', r2.To, HB[k][10], 3, 0));
  if (k === '1') row.push(ck('T1', r1.To, 195.7, 0.5, 0), ck('Td6', r2.Td, 201.3, 1, 0), ck('Td5', r1.Td, 166.3, 1, 0));
  console.log(`case ${k}: in ${Ti.toFixed(1)} C, No.1 out ${r1.To.toFixed(1)}, No.2 out ${r2.To.toFixed(1)} | ` + row.join(' | '));
}
/* MOV: shut = no steam, half = less */
const s0 = at('1', 1, 0),
  sh = at('1', 1, 0.5),
  so = at('1', 1, 1);
if (s0.r2.e !== 0) (bad++, console.log('FAIL No.2 MOV shut still draws', s0.r2.e));
if (!(sh.r2.e <= so.r2.e && sh.r2.Ps < so.r2.Ps)) (bad++, console.log('FAIL No.2 MOV half open', sh.r2, so.r2));
console.log(`MOV No.2 shut: e 0, FW out ${s0.r2.To.toFixed(1)} C; half open: e ${sh.r2.e.toFixed(2)} t/h at ${sh.r2.Ps.toFixed(2)} ata`);
console.log(bad ? 'hp-heaters: ' + bad + ' FAIL' : 'hp-heaters: PASS (design point, 7 heat balance cases, MOV)');
process.exit(bad ? 1 : 0);
