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
  hb7 = k => hbPts(HB[k]); /* all 7 HB load cases (30 ~ 100 %), RIN 2026-11-28; was 3 cases with straight lines between 30 and 60 % */
/* LOGGED DIFFERENCE (team decision 2026-11-27, Phase 11; the plant sheet wins, DCS limits are never changed to meet a design curve):
   the DCS keeps a minimum total air of 446 T/H (ABC-006 LN5 air demand floor, ABC-002 LN40 cross limit 446 -> 35 % fuel; OPERATOR_GUIDE
   5.4 and the limits table), which keeps the bed fluidized. Where FHI Fig 12 total air is below 446 T/H, total air is judged against that
   floor; PA and SA against the logic demands (AOI 2026-11-27: PA = S1-LN12 coal -> PA demand + LN14 HIC-TADBS bias, SA = the rest of
   the LN5 air demand; recorded as s.PAsv / s.SAsv, the FICFA1071 / FICFA1081 set points), and O2 against the flue gas balance at the
   air actually given (s.O2bal, AOI's mole balance from FHI Tab 2, recorded by tools/accept/part1.cjs), not against FHI Fig 7. Above
   that point FHI Fig 12 / Fig 7 hold as printed. */
const MINAIR = { total: 446 };
/* LOGGED DIFFERENCE (phase thread 2026-11-28, same team rule): the bed DP set point of DPICFG108 (ABC-009A) has the DCS limits 1450 ~ 2100
   mmH2O (AOI); FHI Fig 9 below about 45 % MCR (1380 at 40 %) is under the 1450 low limit, so there the furnace DP is judged against 1450 */
const DPMIN = 1450;
/* LOGGED DIFFERENCE (AOI 2026-11-28, same rule): the ABC-002 total air demand is the high select of S1-LN5 (boiler master) and S1-LN22
   (total fuel -> air), trimmed by the O2 ratio LN16; at part load both logic curves give more air than FHI Fig 12 (60 %: Fig 12 371,
   LN22 about 519 T/H at 57.8 T/H coal). Where the logic demand (FICFA1071 SV + FICFA1081 SV + the fluidizing air FIFA1055 = air - PA - SA, part of the ABC-006 total air and of its 446 floor) is above Fig 12, total air is judged against
   it: the model must give the air the logic asks for; above it Fig 12 holds as printed */
const minAir = s => {
  const y = at(C.fhi.fig12_air_TH.total, (s.MSF / MCR) * 100);
  return y != null && y < MINAIR.total;
};
/* LOGGED DIFFERENCE (AOI 2026-11-28): FHI Fig 12 PA / SA are the air INTO the furnace (FHI mass balance MB-052: PAF outlet 388 T/H =
   furnace PA 354 + air heater seal leak 34); the DCS flows FICFA1071 / FICFA1081 (s.PA / s.SA) are measured at the fan side, before the
   leak. Design leak at MCR: PA 34.0, SA 19.0 T/H (Howden L20 OMM sheet 16), taken in proportion to the flow (the same law as the model's
   leak). So the fan-side target is Fig 12 x (354 + 34) / 354 for PA, x (218 + 19) / 218 for SA, and the total adds both leaks */
const LEAK = { pa: 34.0 / 354, sa: 19.0 / 218 };
const leakAt = s => {
  const x = (s.MSF / MCR) * 100, p = at(C.fhi.fig12_air_TH.pa, x), q = at(C.fhi.fig12_air_TH.sa, x);
  return (p == null ? 0 : p * LEAK.pa) + (q == null ? 0 : q * LEAK.sa);
};
/* [label, sample key, curve points, x basis, document]. x: 'mcr' or 'load'. f = a function of the sample when the key is derived */
const CURVES = [
  ['SH outlet temperature, C', 'MST', C.fhi.fig6_sh_rh_temp_C.pts, 'mcr', 'FHI Fig 6'],
  ['RH outlet temperature, C', 'RHT', C.fhi.fig6_sh_rh_temp_C.pts, 'mcr', 'FHI Fig 6'],
  ['O2, %', 'O2', C.fhi.fig7_o2_pct.pts, 'mcr', 'FHI Fig 7; below the DCS minimum air: the flue gas balance at the air given (s.O2bal)', (s, y) => (minAir(s) ? s.O2bal : y)],
  ['Furnace average temperature, C', 'Tu', C.fhi.fig8_furnace_avg_C.pts, 'mcr', 'FHI Fig 8'],
  ['Furnace DP (bed inventory), mmH2O', 'dp', C.fhi.fig9_furnace_dp_mmH2O.pts, 'mcr', 'FHI Fig 9; DPICFG108 SV low limit 1450 floor', (s, y) => Math.max(y, DPMIN)],
  ['SH spray, T/H', 'sp', C.fhi.fig10_sh_spray_pct_of_MSF.pts, 'mcr', 'FHI Fig 10 (% of MSF x MSF)', (s, y) => (y * s.MSF) / 100],
  ['Total air, T/H', 'air', C.fhi.fig12_air_TH.total, 'mcr', 'FHI Fig 12 + the air heater seal leak (L20); where the DCS air demand is higher, the demand (PA + SA SV + the FA blower flow FIFA1055, AOI)', (s, y) => Math.max(y + leakAt(s), MINAIR.total, s.PAsv + s.SAsv + (s.air - s.PA - s.SA))],
  ['Primary air, T/H', 'PA', C.fhi.fig12_air_TH.pa, 'mcr', 'FHI Fig 12 + the PA seal leak (L20, fan side); at the DCS minimum air the logic PA demand (FICFA1071 SV)', (s, y) => (minAir(s) ? s.PAsv : y * (1 + LEAK.pa))],
  ['Secondary air, T/H', 'SA', C.fhi.fig12_air_TH.sa, 'mcr', 'FHI Fig 12 + the SA seal leak (L20, fan side); at the DCS minimum air the logic SA demand (FICFA1081 SV)', (s, y) => (minAir(s) ? s.SAsv : y * (1 + LEAK.sa))],
  ['Coal, T/H', 'coal', C.fhi.fig13_coal_TH.pts, 'mcr', 'FHI Fig 13'],
  ['Air heater gas in, C', 'ahGi', C.fhi.l20_aph_gas_in_C.pts, 'mcr', 'L20 Howden APH'],
  ['Main steam flow, T/H', 'MSF', hbPts(HB.ms_TH), 'load', 'HB PPE-14-0725'],
  ['Main steam temperature at the turbine, C', 'MSTt', hbPts(HB.mst_rht_C), 'load', 'HB PPE-14-0725'],
  ['Main steam pressure at the turbine, ata', 'Pms', HB.ms_press_ata.pts, 'load', 'HB PPE-14-0725'],
  ['Cold reheat pressure, ata', 'Pcr', hbPts(HB.crh_ata_x6), 'load', 'HB PPE-14-0725'],
  ['Cold reheat flow, T/H', 'CRHf', hb7('crh_TH'), 'load', 'HB PPE-14-0725'],
  ['Cold reheat temperature, C', 'Tcr', hb7('crh_C'), 'load', 'HB PPE-14-0725'],
  ['Hot reheat flow, T/H', 'HRHf', hb7('hrh_TH'), 'load', 'HB PPE-14-0725'],
  ['Hot reheat pressure, ata', 'Prh', hb7('hrh_ata'), 'load', 'HB PPE-14-0725'],
  ['Final feedwater temperature, C', 'Tfw', hb7('fw_C'), 'load', 'HB PPE-14-0725'],
  ['Final feedwater flow, T/H', 'FWf', hb7('fw_TH'), 'load', 'HB PPE-14-0725 + the drum water storage rate of the minute (s.dMdt)', (s, y) => y + (isFinite(s.dMdt) ? s.dMdt : 0)],
  ['Turbine heat rate, kcal/kWh', 'HR', hb7('heat_rate_kcal_kWh'), 'load', 'HB PPE-14-0725']
];
const at = (pts, x) => {
  if (!pts || !pts.length) return null;
  /* a point within 2 % of the curve's end is judged at the end value (phase thread 2026-11-28: the 150 MW hold runs at 101.3 % MCR,
     466 T/H, and fell out of every % MCR row); further out it is not judged (no extrapolation) */
  const a = pts[0][0],
    e = pts[pts.length - 1][0];
  if (x > e && x <= e * 1.02) x = e;
  if (x < a && x >= a * 0.98) x = a;
  if (x < a || x > e) return null;
  for (let i = 1; i < pts.length; i++)
    if (x <= pts[i][0]) {
      const [x0, y0] = pts[i - 1],
        [x1, y1] = pts[i];
      return x1 === x0 ? y1 : y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
    }
  return pts[pts.length - 1][1];
};
function judge(S) {
  /* the drum water storage rate, T/H, of each sample from the minute before (KANA 2026-11-28: q.y is the boiler water mass integrator as
     drum level, mm; x kg per mm AN_CYC.kgmm.dr): the feedwater above the steam on a ramp is the water the drum stores. At a hold it is 0,
     so the row is the HB value as printed (team decision 2026-11-28, the gate stays continuous) */
  for (let i = 1; i < S.length; i++) {
    const a = S[i - 1].drum, b = S[i].drum;
    if (a && b && isFinite(a.y) && isFinite(b.y)) S[i].dMdt = (((b.y - a.y) * (a.kgmm + b.kgmm)) / 2 / 1000) * 60;
  }
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
      /* a derived target the sample cannot give (e.g. no s.O2bal recorded yet) counts as a miss, never as a skip */
      const y = f ? f(s, y0) : y0,
        d = !isFinite(y) ? Infinity : t.kind === 'p' ? Math.abs(s[key] / y - 1) * 100 : Math.abs(s[key] - y);
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
