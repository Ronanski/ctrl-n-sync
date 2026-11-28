# Phase 11 KANA: backpass wall gas film from the duct law (2026-11-28)

## Changed
- hx.js: the steam-cooled backpass walls took the gas convection as a fixed 5.5 W/m2 K (no source, audit item "wall h 5.5 NO-SRC").
  Now `anHxWallH(m, T)`: Dittus-Boelter (Nu = 0.023 Re^0.8 Pr^0.3, gas cooled; Incropera ch. 8) in the hydraulic diameter of the two
  backpass passes together (GA: width 12.2428 m, passes 3.3719 + 3.0289 m: area 78.37 m2, Dh 5.075 m, CALC), the same gas mu / k /
  cp as the tube banks. 150 MW: 7.0 W/m2 K; 45 MW: 4.7. The gas radiation term is unchanged.
- hx.js: `qS` export on U.hxO (the steam / water heat of each bank, kW). Read only, no change to the run.

## Tested
- Guards: no-fit, one-path, u-const, no-snapshot: PASS (no-snapshot 578 = baseline).
- hx chain headless at the app 150 MW inputs: walls 15.3 -> 16.0 MW, SH 529.8 -> 530.2, RH 527.8 -> 526.6, AH gas in 320.4 -> 320.3.
- tests/regress/gas_path.js: AH gas in 320.1 (main 320.4); PA 283.7 / SA 299.4. One FAIL (O2 2.90 vs 3.2 ~ 4.3) is the same on main
  6aefec0 (O2 2.90): air / combustion side, not this change.
- 150 MW 20 min hold (dt 0.5 s): 150.9 ~ 151.1 MW, no trip, no page error; MST 534 -> 528.8, RHT 535.7 -> 526.0 (the start state settling onto the gas-short steady state, finding below), spray 1 14 -> 15.8 T/H.

## Finding (no code): SH 530 / RH 528 at 150 MW
The tube banks, the design deposit and uaP are right; the heat that is short is the gas into the backpass (867 C in the app; the
FHI Tab 3 heat balance needs ~894 C at 184.2 kg/s). Combustion (AOI, PR 742) adds the cyclone post-combustion (3.43 %, DERIVED from
the Tab 3 closure). Details: /mnt/project-files/phase11/kana-sh-rh-outlet-2026-11-28.md. The kKL replacement law (Johnsson & Leckner,
for AOI's code): /mnt/project-files/phase11/kana-furnace-solids-law-2026-11-28.md.
