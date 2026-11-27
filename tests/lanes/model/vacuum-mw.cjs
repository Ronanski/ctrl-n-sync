/* Phase 11 rank 6 (MEI, 2026-11-27): the turbine loses power when the condenser loses vacuum. Replaces tests/regress/vacuum_mw.js (it
   read AN_CYC.vacLoss and anVacMW, both deleted: the back pressure now acts only through the steam path, turbine.js tbPath, which
   reads the condenser pressure of the cd port). Case 1 of HB PPE-14-0725 R1 (458327 kg/h, 126 ata / 538 C, the HB draws) is run at
   the condenser pressures from the design 0.07 ata (condenser O&M L15-1 / K2MC3A-100: 0.07 kg/cm2 A at 38.65 C) up to the turbine
   trip 0.26 ata (AN_CD.Ptrip). The test fails when:
     - at 0.07 ata the MW is off the HB 150.0 MW by more than 1 MW (ACCEPTANCE Part 1);
     - the MW does not fall at every step of the back pressure, or the exhaust enthalpy does not rise;
     - the lost MW is not the lost work of the exhaust steam (first law: the LP exhaust flow x the rise of its enthalpy, within 10 %:
       the upstream stage pressures and the mechanical / generator losses move it a little).
   NO-SOURCE: a back pressure correction curve of the turbine maker is not in the documents; the size of the loss is the steam path's. */
const fs = require('fs'),
  path = require('path'),
  vm = require('vm');
const root = path.resolve(__dirname, '..', '..', '..');
const ctx = {};
vm.createContext(ctx);
for (const f of ['steam.js', 'turbine.js']) vm.runInContext(fs.readFileSync(path.join(root, 'src/analog/engine', f), 'utf8'), ctx);
const run = Pc => {
  ctx.I = { ms: 458.327, Pin: 126, Tms: 538, qip: 400.944, Thr: 538, Pc, w: { hp6: 45.147, hp5: 24.2, da: 22.225, lp3: 15.246, lp2: 12.27, lp1: 16.834 } };
  return vm.runInContext('(()=>{let o=null;for(let i=0;i<12;i++)o=tbPath(I,o);o.MW=anTbGen(o.Whp+o.Wip);return o})()', ctx);
};
let bad = 0;
const ck = (ok, w) => {
  console.log((ok ? 'PASS ' : 'FAIL ') + w);
  if (!ok) bad++;
};
const P = [0.07, 0.09, 0.12, 0.16, 0.2, 0.26],
  R = P.map(run);
ck(Math.abs(R[0].MW - 150) <= 1, 'design vacuum 0.07 ata: ' + R[0].MW.toFixed(2) + ' MW (HB case 1 150.0)');
for (let i = 1; i < P.length; i++) {
  const a = R[i - 1],
    b = R[i],
    dMW = a.MW - b.MW,
    dW = ((b.exh.m * 1000) / 3600) * (b.exh.h - a.exh.h) / 1000;
  ck(dMW > 0 && b.exh.h > a.exh.h, `${P[i - 1]} -> ${P[i]} ata: ${b.MW.toFixed(2)} MW (-${dMW.toFixed(2)}), exhaust ${(a.exh.h / 4.1868).toFixed(1)} -> ${(b.exh.h / 4.1868).toFixed(1)} kcal/kg`);
  ck(Math.abs(dMW / dW - 1) <= 0.1, `  lost MW ${dMW.toFixed(2)} = exhaust ${b.exh.m.toFixed(1)} T/H x enthalpy rise ${dW.toFixed(2)} MW (${((dMW / dW - 1) * 100).toFixed(1)} %)`);
}
console.log(bad ? 'vacuum-mw: ' + bad + ' FAIL' : 'vacuum-mw: the turbine loses the exhaust work as the vacuum falls');
process.exit(bad ? 1 : 0);
