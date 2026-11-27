# Phase 11 (MEI): condenser and condensate off the plant screens (rule 0, user 2026-11-28)

Rule 0 (user 2026-11-28 5:18 AM PHT): plant snapshots, trends and SOP are not used in the plant model, not even as a check.

## Changed (src/analog/engine/unit.js)
- PT-CD1122 (deaerator inlet) = the LCV-CD1104 outlet of the hydraulic model: PT-CD1104 + z2 + kN w^2 (anCdHydK, valve data sheet
  K1AU3-E2-0-123 item 14 COND 1 / 2). Was PT-CD1104 + 1.6 off 02.png. 150 MW: 10.3 kg/cm2 (design COND 1 10.1).
- TT-CD1110-4 (flash chamber) = the condenser saturation U.cdTs (the chamber vents to the shell). Was hotwell + 2 C x load.
- anCondStep: no seawater = no cooling. With no circulating water and no steam the shell held its heat instead of relaxing to the
  seawater inlet temperature; with steam it heats to 100 C as before.
- SNAPSHOT-TO-REPLACE, PC read asked: CEP strainer DP 0.019 kg/cm2 at 383 T/H; the 1/2 split of the GSC / ejector rise (TT-CD1119).
- Snapshot notes removed from the condenser, CEP, LP heater and polisher comments.

## Tests (regress, not in Checks)
- condensate.js, cd_page_values.js: design judges (O&M L15-1, KSB curve Q43495D, load schedule K1AU3-E1-0-302, L15-2, alarm list
  LOW-LOW, TCS LOW VACUUM trip 0.26 ata IBD TA-10) in place of 28.png / 4.PNG / 02.png. Both ALL PASS; no seawater: 0.391 ata, trip.

## Tested
- no-fit, one-path, u-const, ports, cep-motor, vacuum-mw PASS; tests/gate/behaviour.cjs 150 MW 20 min ALL PASS. st150 not committed.
