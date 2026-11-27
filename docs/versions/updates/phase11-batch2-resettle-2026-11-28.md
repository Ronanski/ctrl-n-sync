# Phase 11 batch 2: start line-up from the plant, st150 on RIN's CV + HP blading flow, judge on the design documents (2026-11-28, phase thread)

## Start line-up (src/world/ditl150.js, st150 settle inits in tools/steady150/init/)
- Continuous blowdown MV-BD1002 is set to the plant position, 2.1 %. Source: ZT-BD1002 STN101 AI0178 at 150 MW, docs/hmi/OPERATING_POINTS.md.
  - It was 100 % open, giving 14.8 T/H. KANA: the 15 T/H of MB-019 item 22 is the sizing flow of the CBD line, and HB case 1 has no make-up.
  - CBD is now 0.31 T/H at 150 MW. Condensate went from 381.6 to 371.8 T/H.
  - The ditl150 OPEN map now holds positions (%), not 1 / 0.
- The PA flow bias HIC-TADBS is set to -50 (7.PNG, AOI PR 674) in st150, which had carried the old trend value -26.7. Init: tadbs-50.js.
- RIN PR 703 is merged here at 3068350. Main steam flow now passes through the two CVs in series with the HP blading, and Kt is deleted.
  - With the CVs wide open at the DCS MSP SV (122.3), the unit gives 148.9 to 149.1 MW. This matches the 4.PNG check point, 148.8 MW at 122.9.
- st150 settles: 60 min tadbs-50, then 60 min cbd-21, then 90 min on 703.
  - Last settle: MW 148.8 to 149.1, MSP 122.2 to 122.4.
  - CCS AUTO: PIC-COBM, HIC-BM and EIC-TM, with the HP bypass closed.

## Judge (tools/model/sweep-judge.cjs, docs/accept/curves/curves.json)
- The HB rows (CRH flow / T, HRH flow / P, final FW T / flow, heat rate) use all 7 load cases, 7 / 6 / 5 / 4 / 3 / 2 / 1, from RIN's read. Before, they used 30 / 60 / 100 % with straight lines in between.
- Logged differences (the team rule: DCS limits are never changed for a design curve):
  - Total air is judged against max(Fig 12, 446, the logic demand PA SV + SA SV + the FA blower flow).
  - The furnace DP target has a floor of 1450, the DPICFG108 SV low limit.
- Final FW flow target is HB + the drum water storage rate of each minute (KANA's q.y mass integrator x AN_CYC.kgmm.dr). At a hold this is the HB value as printed, so the gate stays continuous.
- On the batch 1 samples: 11 of 22.

## Sweep tool (tools/accept/part1.cjs)
- The bed DP is held on FHI Fig 9 through DPICFG108, inside its SV limits 1450 to 2100. The station's MV goes to 14 % first if it is in MAN. Plant source: 16.PNG MANUAL, PR-OPE-5002 (operator action).
- New samples: dpSv, dpMd and drum { y, kgmm }.

## Tests
- u-const, one-path and no-fit: PASS (0 new fits).
- 20 min behaviour gate (main + this branch) ALL PASS: MW 149.07 -> 149.00 (max move 0.32), MSP max move 0.23, level 4 mm, MST 0.5 C, no trip, save / load and determinism PASS.
- The full sweep runs on main after the merge.
