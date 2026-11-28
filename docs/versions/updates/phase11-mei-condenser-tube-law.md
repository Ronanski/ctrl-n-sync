# Phase 11 (MEI): condenser tube law in place of UA x (flow / design)^0.5

Asked by the coordinator (2026-11-28): judge the vacuum against the condenser design at the actual seawater flow and temperature. The
vendor back-pressure curves are NOT IN DOCS (YUA read mei-condenser-vendor-reads-2026-11-28.md), so the design data are used directly.

## Changed (src/analog/engine/unit.js AN_CDU, anCdHw2, anCdUA, anCondStep)
- The condenser UA (the whole condenser and each water box path) is now A / (1 / h_w + R_wall + R_rest). It replaces UA_d x (flow / design)^0.5, which had no source. The terms:
  - h_w: the seawater film, Dittus-Boelter at the tube velocity (2.4 m/s at 31,500 t/h) and the mean water temperature.
  - R_wall: the titanium wall, OD 20 x 0.5 mm.
  - R_rest: the steam film and the fouling at CF 0.85, taken from the O&M design point.
- Sources: O&M L15-1 and D1-039 (titanium SB338-2, 9,898 m2, 1 pass, 30 -> 35.6 C, 38.65 C / 68.6 mbar). At the design point the law gives 36,430 kW/K and 38.65 C.
- Effect at 150 MW with the seawater at 35,580 m3/h: UA +3.7 % over the design, where the old square root gave +5.9 %. The condenser now reads 0.067 kg/cm2A.

## Test (tests/regress/condensate.js)
- The 150 MW vacuum is judged against the tube law at the model's own heat, seawater flow and inlet temperature, within 0.002 kg/cm2. The law is written in the test from the design data on its own. Before this, the check was a 0.06 to 0.08 band.
- The law must also give the O&M design point: 38.65 C (68.6 mbar).
- Result:
  - PASS: 0.067 vs the law 0.0674 kg/cm2A, at 196.8 MW heat and 35,580 m3/h of seawater at 30.0 C.
  - The other condenser and CEP checks pass.
  - One check fails, the same on main c57d7638 without this change: "MWP discharges closed" (hotwell 2.406 vs 2.149 mm in 2 min). It is a make-up water item for a later PR.
- Behaviour gate 150 MW 20 min: ALL PASS (150.9 -> 151.2 MW, no trip). no-fit, one-path, u-const, no-snapshot: PASS.
- st150 is not committed.
