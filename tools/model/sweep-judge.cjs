/* Phase 11 SWEEP GATE (2026-11-27, port / balance thread): the plant model against the DESIGN CURVES at EVERY load it passes through,
   not only at 45 / 90 / 150 MW (RULES.md 3.12, ACCEPTANCE Part 1 "susukatin ulit sa buong kurba").
   Input: samples taken each plant minute while the plant goes 150 -> 90 -> 45 MW (tools/accept/part1.cjs with SWEEP=1 writes them),
   each with the same keys as a Part 1 snap (MSF, MW, MST, RHT, O2, coal, ...).
   Curves: docs/accept/curves/curves.json only (design documents). x of an FHI curve = % MCR = main steam flow / 460 T/H x 100 (FHI Tab 3
   MCR); x of an HB row = % load = MW / 150 x 100 (HB case 1 = 150 MW). Between two printed points a straight line; outside the printed
   range NO target (the sample is not judged). Tolerance and kind: docs/accept/part1-targets.json, the same row key (one source).
   A sample taken while the plant is tripped is not judged.
   Usage: node tools/model/sweep-judge.cjs <samples.json> [out.md]   (or require it: judge(samples) -> { rows, pass, fail }) */
const fs = require('fs'),
  path = require('path');
const root = path.resolve(__dirname, '..', '..');
const C = JSON.parse(fs.readFileSync(path.join(root, 'docs/accept/curves/curves.json'), 'utf8')),
  PT = JSON.parse(fs.readFileSync(path.join(root, 'docs/accept/part1-targets.json'), 'utf8')),
  TOL = {};
for (const r of PT.rows) TOL[r.key] = { tol: r.tol, kind: r.kind };
const MCR = 460; /* FHI P2S7 Tab 3: 460 T/H at 100 % MCR (the x basis of the FHI figures, not a model constant) */
const HB = C.hb,
  hbPts = arr => HB.mw.map((mw, i) => [(mw / 150) * 100, arr[i]]),
  hb3 = arr => [30, 60, 100].map((x, i) => [x, arr[i]]);
/* [label, sample key, curve points, x basis, document]. x: 'mcr' or 'load'. f = a function of the sample when the key is derived */
const CURVES = [
  ['SH outlet temperature, C', 'MST', C.fhi.fig6_sh_rh_temp_C.pts, 'mcr', 'FHI Fig 6'],
  ['RH outlet temperature, C', 'RHT', C.fhi.fig6_sh_rh_temp_C.pts, 'mcr', 'FHI Fig 6'],
  ['O2, %', 'O2', C.fhi.fig7_o2_pct.pts, 'mcr', 'FHI Fig 7'],
  ['Furnace average temperature, C', 'Tu', C.fhi.fig8_furnace_avg_C.pts, 'mcr', 'FHI Fig 8'],
  ['Furnace DP (bed inventory), mmH2O', 'dp', C.fhi.fig9_furnace_dp_mmH2O.pts, 'mcr', 'FHI Fig 9'],
  ['SH spray, T/H', 'sp', C.fhi.fig10_sh_spray_pct_of_MSF.pts, 'mcr', 'FHI Fig 10 (% of MSF x MSF)', (s, y) => (y * s.MSF) / 100],
  ['Total air, T/H', 'air', C.fhi.fig12_air_TH.total, 'mcr', 'FHI Fig 12'],
  ['Primary air, T/H', 'PA', C.fhi.fig12_air_TH.pa, 'mcr', 'FHI Fig 12'],
  ['Secondary air, T/H', 'SA', C.fhi.fig12_air_TH.sa, 'mcr', 'FHI Fig 12'],
  ['Coal, T/H', 'coal', C.fhi.fig13_coal_TH.pts, 'mcr', 'FHI Fig 13'],
  ['Air heater gas in, C', 'ahGi', C.fhi.l20_aph_gas_in_C.pts, 'mcr', 'L20 Howden APH'],
  ['Main steam flow, T/H', 'MSF', hbPts(HB.ms_TH), 'load', 'HB PPE-14-0725'],
  ['Main steam temperature at the turbine, C', 'MSTt', hbPts(HB.mst_rht_C), 'load', 'HB PPE-14-0725'],
  ['Main steam pressure at the turbine, ata', 'Pms', HB.ms_press_ata.pts, 'load', 'HB PPE-14-0725'],
  ['Cold reheat pressure, ata', 'Pcr', hbPts(HB.crh_ata_x6), 'load', 'HB PPE-14-0725'],
  ['Cold reheat flow, T/H', 'CRHf', hb3(HB.three_cases_only.crh_TH), 'load', 'HB PPE-14-0725'],
  ['Cold reheat temperature, C', 'Tcr', hb3(HB.three_cases_only.crh_C), 'load', 'HB PPE-14-0725'],
  ['Hot reheat flow, T/H', 'HRHf', hb3(HB.three_cases_only.hrh_TH), 'load', 'HB PPE-14-0725'],
  ['Hot reheat pressure, ata', 'Prh', hb3(HB.three_cases_only.hrh_ata), 'load', 'HB PPE-14-0725'],
  ['Final feedwater temperature, C', 'Tfw', hb3(HB.three_cases_only.fw_C), 'load', 'HB PPE-14-0725'],
  ['Final feedwater flow, T/H', 'FWf', hb3(HB.three_cases_only.fw_TH), 'load', 'HB PPE-14-0725'],
  ['Turbine heat rate, kcal/kWh', 'HR', hb3(HB.three_cases_only.heat_rate_kcal_kWh), 'load', 'HB PPE-14-0725']
];
const at = (pts, x) => {
  if (!pts || !pts.length || x < pts[0][0] || x > pts[pts.length - 1][0]) return null;
  for (let i = 1; i < pts.length; i++)
    if (x <= pts[i][0]) {
      const [x0, y0] = pts[i - 1],
        [x1, y1] = pts[i];
      return x1 === x0 ? y1 : y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
    }
  return pts[pts.length - 1][1];
};
function judge(S) {
  const rows = [];
  let pass = 0,
    fail = 0;
  for (const [label, key, pts, xb, doc, f] of CURVES) {
    const t = TOL[key] || { tol: null, kind: 'a' };
    let n = 0,
      ok = 0,
      worst = null;
    for (const s of S) {
      if (s.trip) continue;
      const x = xb === 'mcr' ? (s.MSF / MCR) * 100 : (s.MW / 150) * 100,
        y0 = at(pts, x);
      if (y0 == null || !isFinite(s[key]) || t.tol == null) continue;
      const y = f ? f(s, y0) : y0,
        d = t.kind === 'p' ? Math.abs(s[key] / y - 1) * 100 : Math.abs(s[key] - y);
      n++;
      if (d <= t.tol) ok++;
      if (!worst || d > worst.d) worst = { d, x, v: s[key], y };
    }
    const res = n === 0 ? 'NOT JUDGED' : ok === n ? 'PASS' : 'FAIL';
    if (res === 'PASS') pass++;
    else if (res === 'FAIL') fail++;
    rows.push({ label, key, doc, basis: xb === 'mcr' ? '% MCR' : '% load', tol: t.tol + (t.kind === 'p' ? ' %' : ''), n, ok, res, worst });
  }
  return { rows, pass, fail, samples: S.length };
}
function md(J) {
  const f = x => (x == null || !isFinite(x) ? '-' : Math.abs(x) >= 100 ? x.toFixed(1) : x.toFixed(2));
  const o = ['| Curve | Document | x | Tolerance | Samples in range | Within | Result | Worst (x: app / design) |', '|---|---|---|---|---|---|---|---|'];
  for (const r of J.rows)
    o.push(`| ${r.label} | ${r.doc} | ${r.basis} | ${r.tol} | ${r.n} | ${r.ok} | ${r.res} | ${r.worst ? f(r.worst.x) + ': ' + f(r.worst.v) + ' / ' + f(r.worst.y) : '-'} |`);
  o.push('', `${J.samples} samples (one a plant minute). Curves PASS ${J.pass}, FAIL ${J.fail}, not judged ${J.rows.length - J.pass - J.fail}.`);
  return o.join('\n');
}
module.exports = { judge, md, CURVES, at };
if (require.main === module) {
  const S = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')),
    J = judge(Array.isArray(S) ? S : S.SW || []),
    out = md(J);
  console.log(out);
  if (process.argv[3]) fs.writeFileSync(process.argv[3], out + '\n');
  process.exit(J.fail ? 1 : 0);
}
