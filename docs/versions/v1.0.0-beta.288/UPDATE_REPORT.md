# v1.0.0-beta.288 (JENNIE, 2026-11-22)

## Changed

- `src/digital/parts/03e-user.js` simRead: with the one world on, the page reads the last scan of a DITL sheet and no longer solves it. A read is not a scan: simSheet wrote the sheet's net values (`nl._v`, read by other sheets through FROM connectors) and its motor memory (MST). The operator panel read the sheets it showed, so after Reset the DITL state depended on what the panel had open (on a fresh page it solved DITL-35 / 38 / 66 / 73 / 75 / 79 / 80 / 81 / 88 / 94, after a run it did not). The Worker mirror already read this way (Mina F62). Without the world (DITL page alone) a read still solves the sheet.
- `tests/regress/reset_worker.js`: the "local" mode opens the page with `?worker=0`. Since beta.275 the Worker is on by default, so "local" had compared a Reset on the page with a Reset in the Worker.

## Result

- Reset on the page = Reset in the Worker = Reset on the fresh page (ABC, DITL, saved values). Closes ulat 280 F1.

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | 150 to 90 MW with HIC-ULD (60 plant min, from save `150MW-bed-AUTO-2-coolers`), against plant trend scenario 1 (team-files/plant-study/14-plant-trends.md): coal 55.6 t/h (plant 55.4), bed 994 °C (plant 955), MST 541 °C (plant 522) with the 2nd SH spray still 3.9 t/h (plant TICBR1150 MV 0), RHT 530 °C falling (plant 521). The model puts too much heat on the SH side at 90 MW and the bed runs 39 °C hot. | Next Jennie beta: find why the bed is hot at 90 MW first (PA / SA split and bed-to-wall heat against plant PA 318, SA 187), then the SH / RH backpass split (gas bias dampers), each from a documented mechanism, no curve fit. |
| F2 | Start-up bed 35-90 °C hotter than 280 (from ulat 286). | Still open, Jennie. |
| F3 | Cold run. | The user's call. |

## Tested

- `tests/regress/reset_worker.js`: ALL PASS (local, worker, local = worker).
- `tests/gate/behaviour.cjs` on the station page: ALL PASS (150 MW 20 plant min, SAVE / LOAD, same run twice).
- `npm run check`: SAME.
