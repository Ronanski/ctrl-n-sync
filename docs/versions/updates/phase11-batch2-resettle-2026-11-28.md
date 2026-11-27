# Phase 11 batch 2: start line-up from design and DCS logic, st150 on RIN's CV + HP blading flow, judge on the design documents (2026-11-28, phase thread)

User rule of 5:18 AM PHT 2026-11-28: plant snapshots, plant trends and SOP are not used for the plant model, not even as a check.
The source of truth is first principles plus design data. Set points come from the DCS / TCS logic, and acceptance is the design-curve sweep.

## Start line-up (src/world/ditl150.js, hmi-op.js AN_HMI_MAN, settle init tools/steady150/init/lineup-logic.js)
- The continuous blowdown MV-BD1002 is shut.
  - Design source: HB PPE-14-0725 case 1 has no make-up, so no blowdown leaves the cycle at 150 MW.
  - The 15 T/H of MB-019 item 22 is the sizing flow of the line.
  - It was 100 % open, which took 14.8 T/H out of the cycle.
  - The ditl150 OPEN map now holds positions in %.
- The PA flow bias HIC-TADBS is now 0. This is the neutral point of the logic curve S1-LN14 (0 T/H bias), so the PA demand is S1-LN12 of the coal alone. It was a value taken from an operating screen.
- RIN PR 703 is merged here at 3068350: the main steam flow passes the two CVs in series with the HP blading, and Kt is deleted.
  - With the CVs wide open at the DCS MSP SV (122.3), the HB turbine gives about 149 MW.
- st150 settles: the 703 code, then 90 min with lineup-logic (results in the PR).

## Judge (tools/model/sweep-judge.cjs, docs/accept/curves/curves.json)
- The HB rows (CRH flow / T, HRH flow / P, final FW T / flow, heat rate) use all 7 load cases: 7 / 6 / 5 / 4 / 3 / 2 / 1, from RIN's read. Before, they used 30 / 60 / 100 % with straight lines between.
- Logged differences (team rule: DCS limits are never changed for a design curve):
  - Total air is judged against max(Fig 12, 446, the logic demand PA SV + SA SV + the FA blower flow).
  - The furnace DP has a floor of 1450, the DPICFG108 SV low limit.
- The final FW flow target is HB + the drum water storage rate of the minute (KANA's q.y mass integrator x AN_CYC.kgmm.dr). At a hold the target is the HB value as printed, so the gate stays continuous.

## Sweep tool (tools/accept/part1.cjs)
- The bed DP is held on FHI Fig 9 through DPICFG108, within its SV limits of 1450 to 2100. If the station is in MAN, its MV first goes to 14 %.
- New sample fields: dpSv, dpMd, drum { y, kgmm }.
- The snapshot and SOP comparisons are taken out of the comments of the parts this PR touches.

## Tests
- u-const, one-path and no-fit: PASS (0 new fits).
- 20 min behaviour gate on the station build (after the main merge of 709 / 710 / 712): ALL PASS. MW 149.11 to 149.02, Pms 122.37 to 122.31, level max move 2.8 mm, MST max move 0.4 C, SAVE / LOAD equal, repeat run equal. CCS (PIC-COBM, HIC-BM, EIC-TM) AUTO the whole run; MV-BD1002 0 %, HIC-TADBS 0, AN_CYC.cbd 0 after the load.
- Not tested here: the full 45 ~ 150 MW sweep (runs on main after this merge).
- Still to replace (list with owners): /mnt/project-files/phase11/no-snapshot-flags-2026-11-28.md. Next phase-thread PR: PIC-COBM local set point 122.3 (a screen value) to the HB throttle pressure, with a re-settle.
- Full sweep: on main after merge.
