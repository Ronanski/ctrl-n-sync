# LMYP OTS 1.0.0-beta.374 (JENNIE, 2026-11-24)

Sumunod sa beta.373 (Rosé).

## Ano ang inayos

| # | Finding | Ano ang nangyari | Ayos |
|---|---|---|---|
| 1 | D30 (bahagi): saan galing ang SH spray | Flow diagram K1AU3-PD-017 (Feedwater): ang SH panel #1 / #2 desuperheater (TCV-FW1110 / 1120, FW-1-011 / 012) ay kinukuha sa final feedwater PAGKATAPOS ng No.2 HP heater at ng FE-FW1007, BAGO ang FCV-FW1130. Sa main, binabayaran ng drum ang spray (sobra ang tubig sa economizer ng kasing-laki ng spray) at deaerator temp ang spray | Drum: main steam bawas SH spray. Economizer: valve flow lang. FE-FW1007 PV: valves + SH spray. BFWP at HP heater: kasama ang spray. SH spray temp = No.2 HPH outlet (U.hpT2) |
| 2 | RH / HP bypass spray temp | PD-017: FW-1-016 galing sa BFWP discharge bago ang HP heaters | Deaerator water temp (U.tSr), hiwalay sa SH spray |
| 3 | part1 "Final feedwater T/H" | Binabasa lang ang main valve | FE-FW1007 basis: valve + SH spray - blowdown |

Hindi isinama: ang walls-along-the-pass ng backpass (44 PASS laban sa 52 ng main) at ang solids / bed change (90 MW MFT, bukas pa ang bed form).

## Tests

- part1 45 / 90 / 150 MW: 49 PASS (main beta.372: 51). Nabawas: SH out 45 MW 501.9 / 507 (gilid ng tolerance), RH 90 MW 535.4 / 541 (gilid), efficiency 90 MW 92.35 (coal 53.9-55.6 sa window, coal lot). Nadagdag: PA 150 MW, eco out 150 MW 298.1 (dati 297.1, target 303)
- SH spray 150 MW 17.6 T/H (target 12.4): mas mainit ang tubig ng spray kaya mas marami; ang sobra ay galing sa panel heat (bed form, bukas)
- feedwater, hp_heaters, unit_trip, ditl150, sootblower_steam, gas_path, events ALL PASS; chem_model 1 FAIL (carbohydrazide restart O2), pareho sa main beta.372 (luma)
- no-fit: 44 lumang fit, 0 bago

## Susunod

D33 lube oil UA, tapos bed part-load form (Rule 0, tanggalin ang kKL).
