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
