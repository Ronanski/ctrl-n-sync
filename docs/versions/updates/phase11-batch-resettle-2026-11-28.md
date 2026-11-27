# Phase 11: batch re-settle of the 150 MW start, main steam line drop, sweep operator (2026-11-28, phase thread)

## 1. Main steam line drop by physics (KANA calc), unit.js
- New `AN_MSLN` / `anMsKln(U)`: the SH outlet to turbine inlet drop, dP = k m^2 / rho (the same law as the SH, anShKdp), written every scan.
- k from the line geometry. DESIGN-SRC: line list K1AU3-L1-0-011 R0 p36 and MS BOM K1AU3-P3-1-001 R7 (YUA PC read, /mnt/project-files/kana-pipe-tube-2026-11-27.md).
- The result is 1.74 kg/cm2 at 474 T/H, 122.4 kg/cm2 G, 536 C. This is an upper bound: the BOM lengths cover all the MS pipe of each size, because the isometrics are not in the documents.
- Deleted: the snapshot anchor `kln = (MSP - PT-MS1006) / m0^2` (0.50 kg/cm2) and its `Ptin`.
- At 150 MW the turbine inlet now reads 120.6 kg/cm2 against an MSP of 122.3. The plant snapshots read 121.1 and 122.0 (OPERATING_POINTS).

## 2. st150 re-settled on main (after PRs 674, 686, 691, 692, 695, 697-702)
- tools/steady150/settle.cjs in two stages.
  - Stage 1: 20 min, with the new line drop brought in over 15 min.
    - Reason: loaded at once on the old start, the drop stepped PT-MS1006 by -1.1 kg/cm2 in one scan. PIC-COBM, HIC-BM and EIC-TM then fell to MANUAL within 5 s, and the plant tripped at minute 38.
    - The ramp was a local settle aid only. It is not in this commit.
  - Stage 2: 130 min on the code of this commit.
- Stage 2 result: MW 150.8 to 151.2, MSP 122.2 to 122.5 over the last 120 min.
- After loading: PIC-COBM, HIC-BM and EIC-TM are in AUTO, and the HP bypass is closed.

## 3. Sweep tool (tools/accept/part1.cjs, test tool only)
- New sample fields:
  - Psv: the PIC-COBM SV, in ata.
  - cdP: U.cdP.
  - hr: { shaft W, U.Pm, ext.w_hp / w_lp x, q.ccw.YUI Q, U.tb.pH / pI }, for RIN's heat rate split.
- Bed inventory by hand along FHI P2S7 Fig 9 (AOI). Once a plant minute, while DPICFG108 is in AUTO, its SV is set to Fig 9 at that minute's MSF / 460 % MCR.
- The operator pressure law stays 0.3 x error - 3.0 x 3-min MSP trend. I tried the error-trend variant and it undershot to 93 ata at 45 MW (comment in the code).

## Tests
- Guards: u-const, one-path and no-fit all PASS, with 0 new fits.
- 20 min behaviour gate ALL PASS: MW 151.18 -> 151.00 (max move 0.29), MSP max move 0.17, level 7 mm, MST 1.1 C, no trip, save / load and determinism PASS. The full sweep runs on main after merge (per-batch rule).
