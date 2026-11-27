/* Phase 11 rank 10 (MEI, 2026-11-27): the condensate pump motor current (unit.js anCepI, AN_CD_M) against its design point, FHI load
   schedule K1AU3-E1-0-302 Rev A p4 (M-1116A / B: 6600 V, 298.4 kW, eff 0.94, pf 0.88, F.L.A. 31.56 A, 317.45 kW, 171.34 kvar).
   Fails when: the design shaft power does not give 31.56 A (0.05 A), the current does not rise with the shaft power, the leakage
   reactance that the no-load split leaves is outside 0.15 ~ 0.20 pu (the split would not be a real motor), or the efficiency / pf at
   the design point are not 0.94 / 0.88. The function and its constants are read from unit.js itself (no copy of the law here). */
const fs = require('fs'),
  path = require('path'),
  vm = require('vm');
const src = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'src/analog/engine/unit.js'), 'utf8'),
  k = src.match(/^const AN_CD_M = [^\n]+\n/m),
  f = src.match(/^function anCepI\(Ps(?:, o)?\) \{[\s\S]*?\n\}\n/m);
let bad = 0;
const ck = (ok, w) => {
  console.log((ok ? 'PASS ' : 'FAIL ') + w);
  if (!ok) bad++;
};
if (!k || !f) {
  console.log('FAIL anCepI / AN_CD_M not found in unit.js');
  process.exit(1);
}
const ctx = {};
vm.createContext(ctx);
vm.runInContext(k[0].replace(/^const /, 'var ') + f[0], ctx);
const I = p => vm.runInContext('anCepI(' + p + ')', ctx),
  M = vm.runInContext('AN_CD_M', ctx),
  r3 = Math.sqrt(3);
ck(Math.abs(I(298.4) - 31.56) <= 0.05, 'design 298.4 kW: ' + I(298.4).toFixed(3) + ' A (load schedule 31.56)');
const Pin = M.P / M.eff,
  Ifl = Pin / M.pf / (r3 * M.V);
ck(Math.abs(Pin - 317.45) < 0.1 && Math.abs(Pin / (r3 * M.V * Ifl) - 0.88) < 1e-6, `input ${Pin.toFixed(2)} kW, pf ${(Pin / (r3 * M.V * Ifl)).toFixed(3)}`);
const xl = (Pin * Math.tan(Math.acos(M.pf)) - r3 * M.V * M.i0 * Ifl) / (Pin / M.pf);
ck(xl >= 0.15 && xl <= 0.2, 'leakage reactance left by the no-load split ' + xl.toFixed(3) + ' pu (0.15 ~ 0.20)');
let up = true;
for (let p = 0; p < 320; p += 20) if (I(p + 20) <= I(p)) up = false;
ck(up, 'current rises with the shaft power: ' + [0, 105, 252, 283].map(p => p + ' kW ' + I(p).toFixed(1) + ' A').join(', '));
ck(I(0) / Ifl > 0.25 && I(0) / Ifl < 0.4, 'no load ' + I(0).toFixed(1) + ' A = ' + (I(0) / Ifl).toFixed(2) + ' pu (magnetising 0.30 + the fixed losses)');
console.log(bad ? 'cep-motor: ' + bad + ' FAIL' : 'cep-motor: the CEP current follows the motor balance from the load schedule point');
process.exit(bad ? 1 : 0);
