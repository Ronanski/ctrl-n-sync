# Phase 11 (MEI): condenser and condensate off the plant screens (rule 0, user 2026-11-28)

Rule 0 (user 2026-11-28 5:18 AM PHT): plant snapshots, trends and SOP are not used in the plant model, not even as a check.

## Changed (src/analog/engine/unit.js)
- PT-CD1122 (deaerator inlet) = the LCV-CD1104 outlet of the hydraulic model: PT-CD1104 + z2 + kN w^2 (anCdHydK, valve data sheet
  K1AU3-E2-0-123 item 14 COND 1 / 2). Was PT-CD1104 + 1.6 off 02.png. 150 MW: 10.3 kg/cm2 (design COND 1 10.1).
- TT-CD1110-4 (flash chamber) = the condenser saturation U.cdTs (the chamber vents to the shell). Was hotwell + 2 C x load.
- anCondStep: no seawater = no cooling. With no circulating water and no steam the shell held its heat instead of relaxing to the
  seawater inlet temperature; with steam it heats to 100 C as before.
- CEP suction strainer DP (DPT-CD1001 / 1002): was 0.019 kg/cm2 at 383 T/H (a plant reading). Now clean-screen K rho v^2 / 2 on the
  suction DN350 (KSB P&ID PR 73721 B), 40 mesh (D1-0-052), Idelchik woven screen, screen / pipe area 3 (NO-SOURCE, usual minimum):
  0.003 kg/cm2 at 400 m3/h. The strainer's own sheet is not in the docs (YUA read 2026-11-28).
- TT-CD1119 (SJAE condenser outlet): share 0.460 of the SJAE + GSC rise from the HB case 1 steam-side duties (310SD07-485 R4: SJAE
  400 kg/h 752 -> 152 kcal/kg, GSC 421 kg/h 767.6 -> 99.1); was 1/2 (a plant screen). 150 MW: 38.3 C over a 37.7 C hotwell.
- Snapshot notes removed from the condenser, CEP, LP heater and polisher comments.

## Tests (regress, not in Checks)
- condensate.js, cd_page_values.js: design judges (O&M L15-1, KSB curve Q43495D, load schedule K1AU3-E1-0-302, L15-2, alarm list
  LOW-LOW, TCS LOW VACUUM trip 0.26 ata IBD TA-10) in place of 28.png / 4.PNG / 02.png. Both ALL PASS; no seawater: 0.391 ata, trip.

## Tested
- no-fit, one-path, u-const, ports, cep-motor, vacuum-mw PASS; tests/gate/behaviour.cjs 150 MW 20 min ALL PASS. st150 not committed.
