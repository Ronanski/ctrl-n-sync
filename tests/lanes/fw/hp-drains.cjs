/* Phase 11 NANA (2026-11-27): the HP heater drain valves of fw.js (AN_HDV, anHdW: IEC 60534 liquid flow with the choked limit
   FL^2 (P1 - FF Pv)) against the twelve sizing cases of their valve sheets, K1AU3-E2-0-123 R1 (LCV-HD1106-1 / -2, LCV-HD1105-1 / -2):
   at the printed travel, P1, P2 and T each case gives its printed flow within 5 % (the flashing and cavitating cases included).
   Also: a shut valve and no pressure difference pass nothing; the flow grows with the opening. */
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
const WR = fs.readFileSync(path.join(root, 'src/analog/engine/plant.js'), 'utf8').match(/function anWaterRho\(T\) \{[\s\S]*?\n\}/)[0];
vm.runInContext(WR, ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'src/analog/engine/fw.js'), 'utf8'), ctx);
let bad = 0;
const ck = (n, v, t, tol) => {
  const e = t ? (v / t - 1) * 100 : v,
    ok = isFinite(v) && Math.abs(e) <= tol;
  if (!ok) bad++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${n} ${(+v).toFixed(3)} / ${t}`);
};
/* [heater, valve, t/h, P1 g, P2 g, T, travel %] as printed */
const C = [
  ['H6', 'p', 45.147, 37.48, 14.48, 201.3, 57], ['H6', 'p', 9.482, 12.17, 4.67, 155.3, 32], ['H6', 'p', 4.5, 12.17, 4.67, 155.3, 20],
  ['H6', 'a', 45.147, 38.08, 0.28, 201.3, 43], ['H6', 'a', 9.482, 12.77, 0.17, 155.3, 24], ['H6', 'a', 4.5, 12.77, 0.17, 155.3, 14],
  ['H5', 'p', 69.347, 12.62, 7.62, 166.3, 75], ['H5', 'p', 15.144, 3.17, 2.97, 127.7, 80], ['H5', 'p', 6.9, 3.17, 2.97, 127.7, 46],
  ['H5', 'a', 69.347, 14.72, 0.72, 166.3, 65], ['H5', 'a', 15.144, 5.27, 0.27, 127.7, 41], ['H5', 'a', 6.9, 5.27, 0.27, 127.7, 24]
];
const name = { H6p: 'LCV-HD1106-1', H6a: 'LCV-HD1106-2', H5p: 'LCV-HD1105-1', H5a: 'LCV-HD1105-2' };
for (const [h, v, w, P1, P2, T, x] of C) {
  /* the sheet P1 / P2 include the head and line dz of the valve: take them off to give the shell and the place it drains to */
  const f = vm.runInContext(`(()=>{const V=AN_HDV.${h}.${v};return anHdW(V, ${x}, ${P1} - V.dz1, ${P2} - V.dz2, ${T});})()`, ctx);
  ck(`${name[h + v]} ${w} t/h at ${x} %`, f, w, 5);
}
const R = s => vm.runInContext(s, ctx);
ck('shut valve', R('anHdW(AN_HDV.H6.p, 0, 36, 13, 200)'), 0, 1e-9);
ck('no pressure difference', R('anHdW(AN_HDV.H5.p, 50, 5, 5 + AN_HDV.H5.p.dz1 - AN_HDV.H5.p.dz2, 150)'), 0, 1e-9);
ck('more opening, more flow', R('anHdW(AN_HDV.H6.p, 60, 36, 13, 200) > anHdW(AN_HDV.H6.p, 40, 36, 13, 200) ? 1 : 0'), 1, 0);
console.log(bad ? `hp-drains: FAIL ${bad}` : 'hp-drains: PASS (12 sizing cases of LCV-HD1105 / 1106, choked flow)');
process.exit(bad ? 1 : 0);
