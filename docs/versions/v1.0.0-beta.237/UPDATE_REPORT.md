# LMYP OTS 1.0.0-beta.237

21 Nov 2026. NO SOP: guided training and SOP scoring removed (user "GO NO SOP"), and the 3 open findings of beta.234 (Rosé).

## Changed

| Area | What changed for the operator |
|---|---|
| Home | No TRAINING page. The start buttons stay: At 150 MW and Cold |
| Shell | No Training tab, no Training panel (dock), no step card, no Loop check tool, no split view |
| Instructor | Start state, Save point, Speed, Faults, Trips. No practice sections and no Trainee score (station Instructor popup and its score page too) |
| Save points | A save point no longer keeps SOP ticks. An old save point still loads |
| Faceplates | Y / N = every permissive of the logic is made. The SOP line-up rows are gone |
| Operator API | The calls the HMI pages and faceplates use moved from the Training dock to `LS_OP` (src/ui/plant/op-api.js), same behaviour. The live reader `LS_LIVE` moved to src/ui/plant/live.js and keeps only the plant readers and the trend recorder |
| Plant pages | The first temporary pages (made from the Training steps) are removed; their systems open the new pages as before |
| Sootblowers page | A blower tag is red while its lance is out of the retract limit (DITL-80G row 12), also when started by hand in MANUAL. Before, it read only the OPERATING output of the AUTO program (DITL-80A ~ 80E) |
| Controller faceplate | SV / MV boxes are values changed with ▲ ▼ only (user rule 2026-10-15): no text cursor, no focus ring, a tooltip says so. Before, the box looked typable and Enter did nothing |
| Drawing | The mouse wheel scrolls the page. Ctrl + wheel (or a touchpad pinch) zooms. The zoom buttons and Fit work as before |

## Tested

Light build only: `node tools/build/build.js`, `--check` SAME, `node tools/version-check.js`, every script of the html parses, `node tools/training/operator-text-check.js`. No `LS_DOCK` or `LS_GUIDE` left in the built app.

## Not tested / open

- No live clicks yet. When the PC is free: operator controls, faceplates, Save / Load, the Sootblowers page in MANUAL, the MV box, the wheel over a drawing.
- The engine still has the SOP score (src/analog/engine/sop-score.js, `anSopStep` in unit.js); with no SOP data it scores nothing. Removal is on the engine side.
- Old regress tests and tools that drive `LS_GUIDE` (removed 2026-11-19) were already not working; the ones only for the Training dock are deleted. The plant tests that call `LS_GUIDE.A` stay open.
