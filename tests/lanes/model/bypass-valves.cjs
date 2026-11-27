/* Phase 11 rank 9 (RIN, 2026-11-27, rule 0): the bypass and blow-off valves of turbine.js (anVlvW: IEC 60534-2-1 compressible flow,
   the vendor Cv and lift curve, xT DERIVED from the vendor sizing cases) against the vendor's own sizing cases (SPX Copes-Vulcan,
   K1AU3-D1-0-043 R0 p9 / p11, K1AU3-E2-0-123 R1 p5; YUA PC read 2026-11-27, /mnt/project-files/rin-valve-reads.md; the printed values are
   copied below as the test data). For each case: the steam flow at the printed % lift, inlet pressure / temperature and outlet pressure
   must be the printed flow within 6 % (the lift curves are read off the graph to about 1 %, and one xT per valve serves all its cases).
   HR1010 cond 3 (27 T/H, 8.5 -> 0.58 ata) alone needs xT 1.13 on the vendor's printed Cv 313, above 1 (not physical for a one stage
   trim: the vendor numbers of that case do not close with the other two), so it is held to 12 %;
   and the HP bypass full open at the 150 MW main steam (126 ata, 538 C) to the cold reheat 39.8 ata must pass at least the turbine
   bypass design of PPE-14-0728 R1 case 2 (161825 kg/h, "condenser energy damper design"). */
const fs = require('fs'),
  path = require('path'),
  vm = require('vm');
const root = path.resolve(__dirname, '..', '..', '..');
const ctx = {};
vm.createContext(ctx);
for (const f of ['steam.js', 'turbine.js']) vm.runInContext(fs.readFileSync(path.join(root, 'src/analog/engine', f), 'utf8'), ctx);
/* valve, case, flow kg/h, P1 ata, T1 C, P2 ata, % lift (as printed; MS1001 pressures printed in kg/cm2 g) */
const C = [
  ['hpb', 'MS1020 cond 1', 141738, 124.2, 538, 39.8, 62],
  ['hpb', 'MS1020 cond 2', 141738, 108.0, 527, 7.8, 68],
  ['hpb', 'MS1020 cond 3', 62000, 81.2, 428, 7.7, 43],
  ['lpb', 'HR1010 cond 1', 171756, 35.7, 538, 4.0, 46],
  ['lpb', 'HR1010 cond 2', 87353, 8.3, 527, 2.02, 81],
  ['lpb', 'HR1010 cond 3', 27056, 8.5, 428, 0.58, 35, 12],
  ['blo', 'MS1001 cond 1', 184000, 125 + 1.0332, 541, 42.333 + 1.0332, 76],
  ['blo', 'MS1001 cond 2', 9200, 129 + 1.0332, 541, 1.66 + 1.0332, 14]
];
const V = vm.runInContext('AN_VLV', ctx);
let bad = 0;
for (const [v, n, W, p1, T1, p2, o, tol] of C) {
  const w = ctx.anVlvW(V[v], o, p1, T1, p2) * 1000,
    e = (w / W - 1) * 100,
    ok = Math.abs(e) <= (tol || 6);
  if (!ok) bad++;
  console.log((ok ? 'PASS ' : 'FAIL ') + n + ': ' + Math.round(w) + ' kg/h at ' + o + ' % lift, vendor ' + W + ' (' + e.toFixed(1) + ' %)');
}
const full = ctx.anVlvW(V.hpb, 100, 126, 538, 39.8) * 1000;
if (!(full >= 161825)) bad++;
console.log((full >= 161825 ? 'PASS' : 'FAIL') + ' HP bypass full open 126 ata -> 39.8 ata: ' + Math.round(full) + ' kg/h (PPE-14-0728 case 2 needs 161825)');
console.log((bad ? 'FAIL' : 'PASS') + ' bypass valves: ' + (C.length + 1 - bad) + ' of ' + (C.length + 1));
process.exit(bad ? 1 : 0);
