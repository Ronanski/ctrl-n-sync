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

## LP heater shell flash (load rejection, RIN request 2026-11-28)
- unit.js AN_LPF + anLphStep: each LP shell holds saturated water at its normal level (D1-037, YUA read: No.1 0.68, No.2 0.32,
  No.3 0.37 m3; metal not counted). When the stage falls under the shell, the water flashes: the shell feeds its tubes and sends
  the rest back to the turbine (a negative ext.w_lp draw), limited by the reverse line law (the same dP law as forward), the
  choked flow at the smallest bore (No.4 14 in nozzle, No.5 2 x 12 in, No.6 2 x 20 in; rin-extraction-2026-11-28.md) x the NRV
  opening, and the stored heat (first law). The shell temperature is a state with C dT = (steam in - tube duty) dt.
- Solver relaxation (not plant data): the signed draw follows its target with a 2.5 s lag, because the draw and the stage
  pressure of tbPath are solved one after the other each scan.
- Tested headless, 150 MW, 52G opened (house load), 0.5 s scans, on RIN's PR 721 branch (the PLU closes the CVs / ICVs): back
  steam peaks 18.0 / 13.2 / 17.1 T/H (No.3 / No.2 / No.1 LPH) at 2 ~ 3 s, the shells cool 116 -> 79 C and 71.8 -> 53 C in 4 s,
  then the draws turn forward again as the stage settles. Steady 150 MW: no change (behaviour gate ALL PASS).
