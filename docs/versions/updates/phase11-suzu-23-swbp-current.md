# Phase 11 part 7+8 (SUZU), fix 23: SWBP motor current from the motor data (2026-11-28)

Binago (`src/analog/engine/model/cooling.js`): ang kuryente ng sea water booster pump ay DERIVED na mula sa naka-print na 100 % point ng TECO motor (D1-0-034 R0 p10: 120 A, eff 94.0 %, pf 0.835, 460 V). Active current = shaft kW / eff / (sqrt3 x 0.46); ang magnetizing current ay hawak sa 120 x sin(acos 0.835) = 66.0 A (`AN_SWB_M`). Sa 74.6 kW: 119.5 A. Dati: linya mula sa 90 A (SNAPSHOT-TO-REPLACE, walang design source).
Sinubok (headless, 150 MW): 2 SWBP sa 1,028 m3/h, 95.9 A bawat isa. Guards PASS.
Hindi sinubok: live app. Ang 50 / 75 % points ng motor ay NOT IN DOCS (hiningi kay YUA kung may TECO test report).
