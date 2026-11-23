# ACCEPTANCE Part 1, beta.352 (D9 design bed anchor), 2026-11-24 07:36 PHT

node tools/accept/part1.cjs dist/logic-sim-v3.2.5-beta.10.html 60 30 (headless). Ang 45 MW column ay 72 MW talaga (finding D10).

| Item | 45 MW app / design | 90 MW app / design | 150 MW app / design |
|---|---|---|---|
| Main steam flow T/H | 221.5 / 149.95 FAIL | 271.2 / 273.36 PASS | 463.0 / 458.33 PASS |
| Main steam pressure kg/cm2 (HB ata) | 127.9 / 98.9 FAIL | 122.3 / 126 FAIL | 122.4 / 126 FAIL |
| Main steam temperature C (HB) | 532.4 / 505 FAIL | 541.0 / 538 PASS | 540.1 / 538 PASS |
| SH outlet pressure kg/cm2g (Fig 11) | 127.9 / 100 FAIL | 122.3 / 126.5 FAIL | 122.4 / 129 FAIL |
| SH outlet temperature C (Fig 6) | 532.4 / 507 FAIL | 541.0 / 541 PASS | 540.1 / 541 PASS |
| Cold reheat flow T/H | 215.5 / 145 FAIL | 263.9 / 265.4 PASS | 450.5 / 446.1 PASS |
| Cold reheat pressure ata | 17.51 / 12.79 FAIL | 21.11 / 23.48 FAIL | 34.97 / 38.64 FAIL |
| Cold reheat temperature C | 361.7 / 328.8 FAIL | 370.1 / 358.1 FAIL | 369.3 / 370.2 PASS |
| Hot reheat flow T/H | 195.7 / 134.8 FAIL | 239.0 / 243.1 PASS | 403.2 / 400.9 PASS |
| Hot reheat pressure ata | 16.01 / 11.51 FAIL | 19.61 / 21.13 FAIL | 33.47 / 34.77 FAIL |
| RH outlet temperature C | 532.2 / 507 FAIL | 536.1 / 541 PASS | 537.8 / 541 PASS |
| Economizer outlet water C | 295.7 / - n/a | 292.8 / - n/a | 297.4 / 303 FAIL |
| Final feedwater C | 207.4 / 188.6 FAIL | 217.7 / 218 PASS | 246.0 / 245.4 PASS |
| Final feedwater T/H | 223.2 / 150.3 FAIL | 271.0 / 273.7 PASS | 462.9 / 458.7 PASS |
| SH spray T/H | 0.00 / 0 PASS | 2.95 / 0 PASS | 15.63 / 12.4 FAIL |
| RH spray T/H | 0.00 / 0 PASS | 0.00 / 0 PASS | 0.00 / 0 PASS |
| Generator MW | 71.91 / 45 FAIL | 89.50 / 90 PASS | 151.0 / 150 FAIL |
| Turbine heat rate kcal/kWh | 2114.8 / 2331 FAIL | 2062.3 / 2079 PASS | 1996.4 / 1989 PASS |
| Bed temperature C | 821.4 (820.6-822.3) / 850-870 FAIL | 862.7 (862.4-862.9) / 850-870 PASS | 869.8 (865.3-872.7) / 850-870 FAIL |
| Furnace average temperature C | 758.4 / 610 FAIL | 810.1 / 755 FAIL | 860.4 / 840 FAIL |
| Furnace DP mmH2O | 1595.8 / 1380 FAIL | 1587.7 / 1380 FAIL | 1576.7 / 1630 FAIL |
| Air heater gas in C | 282.6 / 265 FAIL | 285.6 / 285 PASS | 308.1 / 322 FAIL |
| Air heater gas out C | 119.5 / - n/a | 121.5 / - n/a | 127.8 / 135 PASS |
| Coal T/H | 45.80 / 32.3 FAIL | 55.31 / 56 PASS | 89.76 / 89.5 PASS |
| Limestone T/H | 0.00 / 4.3 FAIL | 0.00 / 7.1 FAIL | 0.00 / 12 FAIL |
| Total air T/H | 468.3 / 365 FAIL | 469.9 / 371 FAIL | 590.6 / 596 PASS |
| PA T/H | 290.7 / 245 FAIL | 313.0 / 236 FAIL | 365.9 / 354 FAIL |
| SA T/H | 151.2 / 96 FAIL | 130.6 / 111 FAIL | 198.3 / 218 FAIL |
| O2 % | 9.76 / 10.9 FAIL | 7.51 / 3.6 FAIL | 3.46 / 3.6 PASS |
| Boiler efficiency LHV % | 92.29 / 88.5 FAIL | 91.29 / 91 PASS | 90.51 / 90.9 PASS |

Window 30 min each, settle 60 min after each load step. MW range 45 / 90 / 150: 71.84-71.98 / 89.49-89.50 / 150.9-151.1. Trip: false / false / false. Target MW set by the presses: 89.50 / 45.50. Limestone and FW from the model fields U.lm.q and U.fwMain less the blowdown. PASS 34, FAIL 52. Page errors: 0
