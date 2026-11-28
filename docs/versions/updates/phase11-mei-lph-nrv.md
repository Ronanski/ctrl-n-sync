# Phase 11 (MEI): No.3 / No.2 LP heater steam through the extraction non-return valves

Asked by YUI (PR 724: the extraction NRVs as swing checks, tcs-dev.js U.dev.nrv).

## Changed (src/analog/engine/unit.js anLphStep, AN_LP)
- The No.3 LPH shell (No.4 extraction, NRV TC-44 `ex4`) and the No.2 LPH shell (No.5 extraction, NRV TC-45 `ex5`) are throttled by
  the lower of the extraction MOV and the NRV opening, in series on one line: a shut NRV isolates the shell (no steam, no draw).
  The No.6 line to the No.1 LPH has no NRV (YUA read, mei-lph-flash-reads-2026-11-28.md). One path: the same throttle as the MOV.
- Old screen values removed from the condensate tag comments (rule 0); the comments give the design source only.

## Tested
- Headless 150 MW, NRV ex4 held near shut (tcs-dev reopens it to 10 %): No.3 LPH draw 15.2 -> 5.0 T/H in 10 min, its outlet
  114.4 -> 98.8 C, the No.2 / No.1 draws pick up (12.3 -> 12.7, 18.1 -> 18.8 T/H). NRVs open: no change.
- no-fit, one-path, u-const, ports PASS; tests/gate/behaviour.cjs 150 MW 20 min ALL PASS. no-snapshot fails on main (cfb.js, AOI),
  not in this diff. st150 not committed.

## LP heater shell flash: taken out of this PR (next PR)
- A first version of the shell flash on a load rejection (shell water at saturation, back steam to the turbine) was tried in this
  PR and taken out before the merge. The sweep 150 -> 45 MW showed it fighting the forward draw law at part load: the shell state
  floor is the line-drop saturation, which moves with the draw, so the draw swung between scans (5 to -1 T/H at 54 ~ 71 MW) and,
  with 30 min settles, stuck at a back flow (-3.3 T/H on the No.3 LPH at 48 MW, shell 8.8 K over its stage).
- Next PR: the shell temperature as one implicit state each scan (the line law both ways + the shell first law, solved together),
  so there is one law for the draw and no swing. Back steam on a load rejection waits for that PR.

## LP heater steam vs the HB at 150 MW (sweep on this branch, steady 150 MW)
- No.3 LPH 15.08 / 15.25 T/H, No.2 12.24 / 12.27 T/H: within 1 % (condensate flow, rise and shell pressure on the HB).
- No.1 LPH 18.07 / 16.83 T/H (+8 %): the HB also feeds the No.1 LPH shell with the gland steam seal regulator spill-over
  (SSR to LP1, 1,027 kg/h at 767.6 kcal/kg, case 1; 328 at case 4, 0 at case 7). The model has no such inflow, so the extraction
  makes up that heat: 1,027 x (767.6 - 45.6) = 0.74 Gcal/h = 1.3 T/H of No.6 steam. The spill-over is the turbine gland (RIN).
