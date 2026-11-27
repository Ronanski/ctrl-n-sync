# Phase 11 part 1 (AOI), rank 10: PAF / SAF / IDF sa design documents

AOI, 2026-11-27 PHT, user "Go fix 11", "Double time sana".

## Ano ang binago (lumang code tinanggal sa parehong PR)
- Bago sa `src/analog/engine/boiler.js`: `AN_FD` at `anFdSys` / `anFdCrv` / `anFdCap` / `anFdAmp` / `anFdKw`.
- **System curve** (presyon ng fan outlet laban sa daloy): K1AU3-D2-0-003 Rev A Ch. 1-3, MCR. PA: furnace sa PA entry 1092 + nozzles 550 + duct 90 + air heater 100 + duct 30 = 1862 mmH2O sa 387.62 T/H. SA: 1016 + 250 + 140 + 100 + 31 = 1537 sa 236.95 T/H. ID: furnace top -15, losses hanggang ID inlet 595 (air heater gas inlet -420, outlet -530), discharge 25. Bawat loss = square ng daloy. Ang furnace pressure sa PA / SA entry = bigat ng fluidized bed (`U.bedK` ng bed model).
- **Pinakamaraming hangin ng fan** (`R.FICFA1071 / 1081` cap): kung saan nagtatagpo ang vendor curve (vanes full open, D1-003 p151 PA / p145 SA, per fan = axis ACMM / 2) at ang system curve: 481.5 T/H PA, 294.3 T/H SA sa design bed. Dati: snapshot system curve sa spec pressure (433.7 / 247.2).
- **Kuryente ng motor** (IT-F1053 / 1054 / 1056): shaft power mula sa vendor points (no flow at spec point ng fan), sa TECO efficiency at power factor laban sa load (10 / 25 / 50 / 75 / 100 %). ID: air power / TE 0.87, dumadaan sa hydraulic coupling (fan power x 1193 / bilis ng fan, ST-LO1756). Dati: 7.PNG amps x share (anchor sa snapshot).
- SA pressures PIFA1085 / 1088 (unit.js): sa parehong system curve (dati 1427 / 1273 snapshot anchors na nasa U at bumabalik sa bawat save). PT-FA1078 = PAF outlet bawas duct 30 at air heater 100. Gas path PT-FG1121 / 1134 / DPT-FG1052-5 sa D2-003 losses. Air heater gas DP (plug fault) 113 -> 110 (D2-003).
- Tinanggal: `AN_SRC.fanMax`, `AN_FN.pa / sa / ga` (snapshot points). Ang `AN_FN.I0 / fI` ay natira lang para sa HMI estimate kapag OFF ang plant model.

- **Furnace pressure (draft)**, commit 2, matapos ang basa ni YUA ng ID fan curve D1-003 p157 (1141 rpm, fan laws sa ibang bilis): ang target ng PICFG108 loop = ang presyon na hawak ng ID fan sa steady state = stack discharge + draft losses ng D2-003 - rise ng fan curve sa bilis ng hydraulic coupling at sa density ng gas sa ID inlet - loss ng inlet damper (PICFG108A, butterfly ng Idelchik; velocity pressure 17.5 mmH2O NO-SOURCE). Ang lag lang ng loop model ang natira. Tinanggal: `U.taf0` (hangin ng "Start at 150 MW"), `U.kfpA`, `kfp` at ang anchor ng snapshot MV / PV ng loop na ito. Ang ID fan current ay galing na sa BKW/3 curve ng p157 (pinalitan ang TE 0.87).
- Cold start (walang apoy, mahina ang hangin): nananatili ang SOP law (PR-OPE-5002: -19.5 sa 13 %, -15 sa 16 %), dahil ang fan curve na walang hangin ay -248 sa 13 %: may pasok na hangin sa bukas na daan ng planta na NOT IN DOCS.

## Sinubok
- 150 MW (HMI snapshot = pang-check lang): PIFA1075 1734 (snapshot 1551), PIFA1085 1437 (1427), PIFG1141 -602 (-442 / -450), PAF 221 A (253.6), SAF 117 A (134.0), IDF 259 A (199.6). Lahat ay nasa loob ng alarm list (PT-FA1075 LL 1200 / HH 2300, PT-FG1141 H -390, PT-FG1151 H 35).
- Behaviour gate 150 MW 20 plant min sa st150 ng main: ALL PASS (MW galaw 0.78, pressure 0.88, level 32 mm, MST 3.0 C), kasama ang furnace pressure.
- Furnace pressure mula sa st150 ng main: ang design draft ay mas malalim kaysa sa planta, kaya ang hydraulic coupling ay umaakyat mula 46.9 % hanggang mga 58 % (fan curve) at ang furnace pressure ay +54 -> -5 mmH2O sa 6 min (PID ng plant sheet). Mawawala ito sa re-settle ng st150. ID fan sa 58 %: 243 A.
- no-fit 0 bago; one-path PASS; u-const PASS; ports PASS; build OK.

## Hindi sinubok / natitira
- Part load ng D2-003 ay NOT IN DOCS: square ng daloy (CALC). Ang U.taf0 ng draft loop model (furnace pressure) ay natira pa; susunod.
- Ang ID fan current ay mas mataas sa snapshot dahil ang design draft (-610) ay mas malalim kaysa sa nabasa ng planta (-442).
- Hindi kasama ang st150 (phase thread ang magre-settle).
