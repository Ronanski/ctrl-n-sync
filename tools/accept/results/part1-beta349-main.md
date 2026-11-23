# ACCEPTANCE Part 1, main beta.349 (bed anchor 937), 2026-11-24 06:39 PHT

node tools/accept/part1.cjs dist/logic-sim-v3.2.5-beta.10.html 60 30 (headless). Ang 45 MW column ay 70 MW talaga (finding D10).

| Item | 45 MW app / design | 90 MW app / design | 150 MW app / design |
|---|---|---|---|
| Main steam flow T/H | 219.6 / 149.95 FAIL | 275.5 / 273.36 PASS | 463.0 / 458.33 PASS |
| Main steam pressure kg/cm2 (HB ata) | 127.8 / 98.9 FAIL | 122.3 / 126 FAIL | 122.3 / 126 FAIL |
| Main steam temperature C (HB) | 517.7 / 505 FAIL | 521.3 / 538 FAIL | 540.8 / 538 PASS |
| SH outlet pressure kg/cm2g (Fig 11) | 127.8 / 100 FAIL | 122.3 / 126.5 FAIL | 122.3 / 129 FAIL |
| SH outlet temperature C (Fig 6) | 517.7 / 507 FAIL | 521.3 / 541 FAIL | 540.8 / 541 PASS |
| Cold reheat flow T/H | 213.6 / 145 FAIL | 268.0 / 265.4 PASS | 450.5 / 446.1 PASS |
| Cold reheat pressure ata | 17.37 / 12.79 FAIL | 21.42 / 23.48 FAIL | 34.98 / 38.64 FAIL |
| Cold reheat temperature C | 346.9 / 328.8 FAIL | 352.0 / 358.1 FAIL | 369.9 / 370.2 PASS |
| Hot reheat flow T/H | 192.8 / 134.8 FAIL | 242.7 / 243.1 PASS | 403.3 / 400.9 PASS |
| Hot reheat pressure ata | 15.87 / 11.51 FAIL | 19.92 / 21.13 FAIL | 33.48 / 34.77 FAIL |
| RH outlet temperature C | 515.0 / 507 FAIL | 525.9 / 541 FAIL | 537.4 / 541 PASS |
| Economizer outlet water C | 289.7 / - n/a | 286.3 / - n/a | 297.5 / 303 FAIL |
| Final feedwater C | 206.9 / 188.6 FAIL | 218.5 / 218 PASS | 246.0 / 245.4 PASS |
| Final feedwater T/H | 236.0 / 150.3 FAIL | 275.3 / 273.7 PASS | 463.0 / 458.7 PASS |
| SH spray T/H | 0.00 / 0 PASS | 0.00 / 0 PASS | 13.43 / 12.4 PASS |
| RH spray T/H | 0.00 / 0 PASS | 0.00 / 0 PASS | 0.00 / 0 PASS |
| Generator MW | 69.72 / 45 FAIL | 89.51 / 90 PASS | 151.0 / 150 PASS |
| Turbine heat rate kcal/kWh | 2129.3 / 2331 FAIL | 2065.4 / 2079 PASS | 1996.6 / 1989 PASS |
| Bed temperature C | 928.2 (927.6-928.7) / 850-870 FAIL | 981.1 (975.3-984.1) / 850-870 FAIL | 948.9 (947.1-950.0) / 850-870 FAIL |
| Furnace average temperature C | 786.8 / 610 FAIL | 838.4 / 755 FAIL | 906.1 / 840 FAIL |
| Furnace DP mmH2O | 1570.7 / 1380 FAIL | 1562.5 / 1380 FAIL | 1551.5 / 1630 FAIL |
| Air heater gas in C | 277.9 / 265 FAIL | 283.4 / 285 PASS | 306.7 / 322 FAIL |
| Air heater gas out C | 117.8 / - n/a | 120.8 / - n/a | 127.4 / 135 PASS |
| Coal T/H | 47.37 / 32.3 FAIL | 54.60 / 56 PASS | 89.20 / 89.5 PASS |
| Limestone T/H | 0.00 / 4.3 FAIL | 0.00 / 7.1 FAIL | 0.00 / 12 FAIL |
| Total air T/H | 476.5 / 365 FAIL | 468.3 / 371 FAIL | 588.2 / 596 PASS |
| PA T/H | 295.6 / 245 FAIL | 311.9 / 236 FAIL | 364.2 / 354 PASS |
| SA T/H | 154.5 / 96 FAIL | 130.1 / 111 FAIL | 197.7 / 218 FAIL |
| O2 % | 9.64 / 10.9 FAIL | 7.54 / 3.6 FAIL | 3.45 / 3.6 PASS |
| Boiler efficiency LHV % | 92.19 / 88.5 FAIL | 93.06 / 91 FAIL | 91.28 / 90.9 PASS |

Window 30 min each, settle 60 min after each load step. MW range 45 / 90 / 150: 69.33-70.03 / 89.47-89.58 / 150.9-151.1. Trip: false / false / false. Target MW set by the presses: 89.50 / 45.50. Limestone and FW from the model fields U.lm.q and U.fwMain less the blowdown. PASS 32, FAIL 54. Page errors: 0
