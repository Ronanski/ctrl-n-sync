# LMYP OTS 1.0.0-beta.360 (LEADER : JENNIE, 2026-11-24)

Sumunod sa beta.359. Trabaho: tanggalin ang mga macro na hindi galing sa logic, ayusin ang stale engine tests, at ilapat ang desisyon ng user na logic sa setpoint at design sa physics.

## Ano ang inayos

1. **Tinanggal ang VACUUM UP at AUX STEAM macros sa turbine (D17).**
   - Wala nang `AN.turbine('vacuum')` at `AN.turbine('aux')`. Hindi galing ang mga ito sa TCS sheet o sa DITL logic.
   - Ang operator na ang pumipindot sa DITL drawings: DITL-51 (MV-AS1391 aux steam), DITL-56 (vacuum breaker CLOSE), DITL-55 (SJAE OPEN) at DITL-54 (start-up ejector OPEN). Kailangan muna ng field REMOTE.
   - Ang DITL-54 OPEN ay kailangang FULLY CLOSED ang vacuum breaker (row 6, I.0216). Kung nauna ang pindot, uulitin ito ng operator.
   - Ang tcs.js ay sumusunod na lang sa posisyon ng DITL-51/54/55/56 (c.asv, c.vb, c.ej).
   - Ang UAT check (src/ui/uat/check.js) ay pumipindot na rin sa DITL. Sinabihan si Rosé.
2. **Lisa Part 2 item 3 (low vacuum trip): stale test, hindi sira ang planta (D20).**
   - Ang lumang test ay huminto ng pumps gamit ang direktang sulat, na pinapalitan ng DITL sa WORLD mode.
   - Sa totoong STOP press ng tatlong SWP sa 150 MW: CONDENSER VACUUM VERY LOW TRIP, I.0400 = 1, MW 151 → 0.
3. **Stale engine tests inayos:** plant_utilities (totoong presses), tcs_ibd_desk at tcs_ibd_b3_desk (isinama ang tcsVt functions), sop_bawal (WORLD Cold start; wala na ang Training tab mula beta.237).
4. **ACCEPTANCE Batas 5 (user 2026-11-24 "Ok").** Logic ang masusunod sa setpoint, limit at FX. Design ang masusunod sa physics. Walang binago sa logic (air min 446, RHT SV ABC-020 LN6, limestone MH 35 %).

## Bilang

| | beta.356 | beta.360 |
|---|---|---|
| Part 1 PASS / FAIL | 50 / 36 | **56 / 30** |
| Pasado sa lahat ng load | 6 | **7** (dagdag ang RH outlet) |
| Kabuuan | 7 pasado, 39 natitira | **8 pasado, 38 natitira** |

Bagong pasado sa Batas 5: RH outlet 45 MW (489 vs logic 488), total air 45 MW (446), O2 45 MW (12.81 vs kinuwenta 12.7), bed 45 MW (769 vs kinuwenta 745 ±25), limestone 90 / 150 MW (4.9 = logic cap).

## Findings (may rekomendasyon)

| # | Finding | Rekomendasyon |
|---|---|---|
| D18 | Screen buttons na walang TCS sheet: gland, hood, vex, tg, lop / eh | Hindi tinanggal; ang user ang nagpapasya. Kapag aprubado, palitan ng DITL press ng bawat valve o pump. |
| D3 | Furnace average, PA / SA, bed DP mali sa physics | Basahin ang FHI P2S4 at i-code ang design physics. Walang fit. |
| - | Air 469.8 at O2 7.47 sa 90 MW | Basahin ang LN5 output at O2 trim sa 90 MW. |
| - | Limestone 2.61 sa 45 MW | Sukatin ang SO2 laban sa SV ng SOx loop. |

## Tests

- plant_utilities: ALL PASS (vacuum 94 %, roll accepted; 150 MW SWP stop → trip).
- tcs_ibd_desk, tcs_ibd_b3_desk: ALL PASS.
- sop_bawal: 11 FAIL, stale pa rin (hindi kasama sa Checks). Wala na ang Training guide mula beta.237; sa Cold start ng test, hindi tumatakbo ang one world (cat dig, WORLD.live false), kaya walang START button na nahahanap. Rekomendasyon: gawin itong scan loop gaya ng plant_utilities (WORLD.tick) sa susunod na beta. Tinanggal na rito ang r3 / r5 (macro checks).
