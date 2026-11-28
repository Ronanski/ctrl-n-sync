# Phase 11 (MEI): LP heater shell as one state (back steam on a load rejection) and the gland spill-over into the No.1 LPH

Asked by RIN (load rejection back steam) and the coordinator (LP heater steam vs HB). Follows PR 726, which carried the NRV throttle only.

## Changed (src/analog/engine/unit.js anLphStep, AN_LPF, AN_LP header)
- **The No.1 LPH shell takes the gland steam seal regulator spill-over.** The port is gs.spill, written by RIN from the SSR header balance (HB PPE-14-0725 "SSR to LP1": 1,027 kg/h at 767.6 kcal/kg in case 1, 0 in case 7). It condenses in the shell and leaves with the No.1 drain, so the No.6 extraction gives that much less heat. Before this fix the No.1 LPH drew 8 % more steam than the HB.
- **Each LP heater shell is ONE state: the shell water temperature Ts**, saturated, with the shell pressure at Psat(Ts). It is solved implicitly each scan (bisection) from the first law of the shell water:
  - C dTs/dt = w (h_ext - h_drain) + D_in (h_drain,in - h_drain) + spill (h_spill - h_drain) - Q_tube.
  - When w < 0, the steam term is w (hg - hf).
  - The draw w is the line law in both directions, the same law as before (HB case 1 drops), throttled by the MOV / NRV. The back flow is also choked at the smallest bore.
  - The stage pressure answers the draw inside the same solve. The turbine's stage law (tbP1, Stodola) gives dPe/dw = -S, with S = (P^2 - P_next^2) / (G P) + (P_next / P) S_next.
- What this replaces:
  - the old forward-only draw (the duty divided by the enthalpy drop, with a line drop computed from the draw of the step before);
  - the first flash try (taken out of PR 726).
- There is no draw lag and no relaxation. At steady load the same first law as before holds.
- Water volumes and bores: AN_LPF (D1-037, YUA read; rin-extraction-2026-11-28.md). Shell metal is not counted (its weight is not in the read).
- U.lpW.lp1 ~ 3 now mean the steam each shell condenses (never below 0, the spill included): fw.js (NANA) reads them unchanged as the drain inflow. The signed draws are U.lpW.x and the port ext.w_lp. fw.js is not edited.
- U.lpSh restarts at its steady root on every reset / load, the same as U.lpT.

## Tested
- Headless 150 MW, 30 plant min, with RIN's PR 732 (gs.spill) merged locally:
  - No.1 / No.2 / No.3 LPH steam 16.61 / 11.97 / 14.96 T/H vs the HB 16.83 / 12.27 / 15.25;
  - stage pressures 0.375 / 0.831 / 1.924 ata vs the HB 0.373 / 0.826 / 1.914;
  - no swing.
- Without the stage answer S in the solve, the draw swung with the turbine stage, with a 13 s period up to 156 MW. With S it is flat.
- Load rejection (52G opened at 150 MW, RIN PR 721 on main):
  - back steam peaks at 42.6 / 32.9 / 44.3 T/H (No.3 / No.2 / No.1) at 1 s, choked at the bores;
  - the shells cool from 116 to 58 C (No.3) and from 72 to 39 C (No.1) in 10 s;
  - the draws turn forward by 40 s.
- Sweep 150 -> 45 MW (tools/accept/part1.cjs SWEEP, 5 min settles):
  - the shells follow the load with no swing (No.3 shell 116.5 -> 88.6 C);
  - the draws stay forward, except for short dips to -1.4 T/H on the No.1 LPH at 54 and 67 MW, where the hand load steps drop the stage faster than the shell cools; it recovers the next minute;
  - at 45 MW: 3.41 / 3.41 / 4.35 T/H vs the HB 2.24 / 3.43 / 4.25. The No.1 excess at low load is the colder hotwell (better vacuum), not this PR.
- Behaviour gate 150 MW 20 min on main + this PR (without PR 732 the spill port is empty, so the spill is 0): ALL PASS, 149.1 MW, no trip.
- no-fit, one-path, u-const, no-snapshot: PASS.
- st150 is not committed.
