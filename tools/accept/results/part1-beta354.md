# ACCEPTANCE Part 1, beta.354 (operator below 220 T/H, limestone in st150), 2026-11-24 PHT

node tools/accept/part1.cjs dist/logic-sim-v3.2.5-beta.10.html 60 30 (headless). Talagang 45 MW na ang 45 MW column.

| Item | 45 MW app / design | 90 MW app / design | 150 MW app / design |
|---|---|---|---|
| Main steam flow T/H | 151.5 / 149.95 PASS | 271.2 / 273.36 PASS | 463.0 / 458.33 PASS |
| Main steam pressure kg/cm2 (HB ata) | 121.9 / 98.9 FAIL | 122.3 / 126 FAIL | 122.3 / 126 FAIL |
| Main steam temperature C (HB) | 500.0 / 505 PASS | 541.0 / 538 PASS | 539.5 / 538 PASS |
| SH outlet pressure kg/cm2g (Fig 11) | 121.9 / 100 FAIL | 122.3 / 126.5 FAIL | 122.3 / 129 FAIL |
| SH outlet temperature C (Fig 6) | 500.0 / 507 FAIL | 541.0 / 541 PASS | 539.5 / 541 PASS |
| Cold reheat flow T/H | 147.4 / 145 PASS | 263.9 / 265.4 PASS | 450.5 / 446.1 PASS |
| Cold reheat pressure ata | 12.45 / 12.79 PASS | 21.11 / 23.48 FAIL | 34.97 / 38.64 FAIL |
| Cold reheat temperature C | 329.0 / 328.8 PASS | 370.1 / 358.1 FAIL | 368.5 / 370.2 PASS |
| Hot reheat flow T/H | 134.7 / 134.8 PASS | 239.0 / 243.1 PASS | 403.2 / 400.9 PASS |
| Hot reheat pressure ata | 10.95 / 11.51 PASS | 19.61 / 21.13 FAIL | 33.47 / 34.77 FAIL |
| RH outlet temperature C | 492.1 / 507 FAIL | 536.0 / 541 PASS | 538.0 / 541 PASS |
| Economizer outlet water C | 298.0 / - n/a | 292.8 / - n/a | 297.1 / 303 FAIL |
| Final feedwater C | 189.1 / 188.6 PASS | 217.7 / 218 PASS | 246.0 / 245.4 PASS |
| Final feedwater T/H | 151.9 / 150.3 PASS | 271.0 / 273.7 PASS | 462.8 / 458.7 PASS |
| SH spray T/H | 0.00 / 0 PASS | 2.92 / 0 PASS | 15.81 / 12.4 FAIL |
| RH spray T/H | 0.00 / 0 PASS | 0.00 / 0 PASS | 0.00 / 0 PASS |
| Generator MW | 45.00 / 45 PASS | 89.49 / 90 PASS | 151.0 / 150 FAIL |
| Turbine heat rate kcal/kWh | 2299.0 / 2331 FAIL | 2062.3 / 2079 PASS | 1996.6 / 1989 PASS |
| Bed temperature C | 765.2 (724.4-799.4) / 850-870 FAIL | 861.9 (860.8-862.8) / 850-870 PASS | 869.7 (868.9-870.6) / 850-870 FAIL |
| Furnace average temperature C | 670.6 / 610 FAIL | 809.8 / 755 FAIL | 860.3 / 840 FAIL |
| Furnace DP mmH2O | 1633.4 / 1380 FAIL | 1618.1 / 1380 FAIL | 1599.9 / 1630 FAIL |
| Air heater gas in C | 271.4 / 265 PASS | 286.0 / 285 PASS | 308.4 / 322 FAIL |
| Air heater gas out C | 116.2 / - n/a | 121.7 / - n/a | 128.0 / 135 PASS |
| Coal T/H | 32.25 / 32.3 PASS | 55.42 / 56 PASS | 89.91 / 89.5 PASS |
| Limestone T/H | 2.84 / 4.3 FAIL | 4.90 / 7.1 FAIL | 4.90 / 12 FAIL |
| Total air T/H | 448.0 / 365 FAIL | 469.8 / 371 FAIL | 590.0 / 596 PASS |
| PA T/H | 286.3 / 245 FAIL | 313.0 / 236 FAIL | 366.6 / 354 FAIL |
| SA T/H | 135.4 / 96 FAIL | 130.5 / 111 FAIL | 197.1 / 218 FAIL |
| O2 % | 12.77 / 10.9 FAIL | 7.47 / 3.6 FAIL | 3.49 / 3.6 PASS |
| Boiler efficiency LHV % | 92.95 / 88.5 FAIL | 91.11 / 91 PASS | 90.33 / 90.9 PASS |

Window 30 min each, settle 60 min after each load step. MW range 45 / 90 / 150: 44.56-45.55 / 89.48-89.51 / 150.9-151.1. Trip: false / false / false. Target MW set by the presses: 89.50 / 45.50. Operator by hand below 220 T/H: O2 trim AICFG112 MAN 0.0 % to 50 % at MSF 240, 1 ELEMENT at MSF 224, TCS LOAD UP 45 MW at 0.4 %/min at MSF 218, HIC-TADBS -26.7 to 0 T/H at MSF 218. Limestone and FW from the model fields U.lm.q and U.fwMain less the blowdown. PASS 46, FAIL 40. Page errors: 0
