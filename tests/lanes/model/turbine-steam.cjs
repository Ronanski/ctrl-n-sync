/* Phase 11 turbine (RIN, 2026-11-27): the steam properties of src/analog/engine/steam.js against the IAPWS-IF97 verification values
   (release tables 5 and 15). Fails when any value is off by more than 1e-6 relative. */
const fs = require('fs'),
  path = require('path'),
  vm = require('vm');
const root = path.resolve(__dirname, '..', '..', '..');
const ctx = {};
vm.createContext(ctx);
for (const f of ['steam.js']) vm.runInContext(fs.readFileSync(path.join(root, 'src/analog/engine', f), 'utf8'), ctx);
let bad = 0;
const ck = (name, v, t) => {
  const ok = Math.abs(v / t - 1) < 1e-6;
  if (!ok) bad++;
  console.log((ok ? 'ok   ' : 'FAIL ') + name + ' ' + v.toFixed(6) + ' (IF97 ' + t + ')');
};
const r1 = (p, T) => vm.runInContext(`steamR1(${p},${T})`, ctx),
  r2 = (p, T) => vm.runInContext(`steamR2(${p},${T})`, ctx);
/* table 5, region 1 */
ck('R1 h 3 MPa 300 K', r1(3, 300).h, 115.331273);
ck('R1 s 3 MPa 300 K', r1(3, 300).s, 0.392294792);
ck('R1 h 80 MPa 300 K', r1(80, 300).h, 184.142828);
ck('R1 s 80 MPa 300 K', r1(80, 300).s, 0.368563852);
ck('R1 h 3 MPa 500 K', r1(3, 500).h, 975.542239);
ck('R1 s 3 MPa 500 K', r1(3, 500).s, 2.58041912);
/* table 15, region 2 */
ck('R2 h 0.0035 MPa 300 K', r2(0.0035, 300).h, 2549.91145);
ck('R2 s 0.0035 MPa 300 K', r2(0.0035, 300).s, 8.52238967);
ck('R2 h 0.0035 MPa 700 K', r2(0.0035, 700).h, 3335.68375);
ck('R2 s 0.0035 MPa 700 K', r2(0.0035, 700).s, 10.1749996);
ck('R2 h 30 MPa 700 K', r2(30, 700).h, 2631.49474);
ck('R2 s 30 MPa 700 K', r2(30, 700).s, 5.17540298);
console.log(bad ? bad + ' steam property values off' : 'turbine steam properties = IF97');
process.exit(bad ? 1 : 0);
