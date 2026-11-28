# Phase 11 FEEDWATER: rule 0 clean-up of the feedwater lines in unit.js (NANA, 2026-11-28 PHT; SUZU list)

## Changes
- **unit.js:** the old "page 06 FEEDWATER" comment block is deleted. It described the extraction / spray / BFWP transmitters by screen values (4.PNG / 03.png / 5.png: PT-TS1013 / 1017 x MSF / 472.7, PT-TS1026, TT-TS ratios, BFWP suction 0.4 / 0.29, PT-FW1160 3.5, spray points 6.4 / 9.3). That code moved to fw.js anFwTagStep earlier (ports ext.*, KSB strainer law, AN_MFW, valve sheets E2-0-123 R1 / L21). A short pointer replaces it.
- **unit.js TT-FW1160 / TT-FW1106 (economizer inlet):**
  - It is the No.2 HPH outlet of the heater model (U.hpT2).
  - Before the heater has a value, it is the deaerator water.
  - Before, it lagged to the anchor value of the state scaled with MW, which was a screen value. X.fw0 / X.dea0 are deleted.
- **fw.js:** AN_FWT.ms0 472.7 (SNAPSHOT-TO-REPLACE) is deleted, since nothing reads it.
- **no-snapshot baseline:** `--update` takes it from 577 to 561 lines.

## Tested (headless)
- Guards: no-snapshot, no-fit, one-path and u-const pass.
- fw lanes x4: PASS. 150 MW start (E.step 150 x 0.5 s) held 30 plant min: MW 151.0, no trip.

## Not tested
- The live app.
- The full sweep.
- st150 is not committed.

## Left
- AN_SHDP s1 / s2 (6.4 / 11.6, 9.3 / 11.6) in unit.js is KANA's SH drop share and is not touched here.
