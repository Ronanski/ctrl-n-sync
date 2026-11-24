# v1.0.0-beta.357 (ROSÉ, 2026-11-24)

## What was wrong
Click check of every faceplate on every Operator Station page (ACCEPTANCE Part 2, the 18 systems), done with real mouse clicks in a visible Chrome at 150 MW:

| Pages | Faceplate targets clicked | Opened a full faceplate | Opened nothing |
|---|---|---|---|
| Plant, 22 pages | 418 | 416 | 2 |
| Turbine, 7 pages | 34 | 34 | 0 |

The two that opened nothing were the condenser tube cleaning panels CTCS-A and CTCS-B on the Circulating sea water page. Their click went to the I/O wiring card, which does not exist in the Operator Station, so the hand cursor opened nothing.

Not counted as faceplate targets: First out and events, Generator panel, Start-up criteria, Speed and load, Turbine trip, Valve tests and Overspeed test. These are panel pages with their own push buttons, not plant drawings.

## Fix
1. CTCS-A and CTCS-B now open the push-button faceplate of their drawing DITL-119 (`src/ui/plant/hx/sys/hx-sys-cw.js`):
   - A: AUTO START row 7 (M.0794), AUTO STOP row 9 (M.0795).
   - B: AUTO START row 18 (M.0796), AUTO STOP row 20 (M.0797).
   - Permissive: row 1 ANY SEAWATER PUMP RUNNING (M.079C), the one input of the drawing.
   The presses go to the logic, the same as the debris filters.
2. DITL-119 has no running status back to the DCS, so the push-button faceplate (`src/ui/plant/fp-pop.js`) can now run without a status row. It then shows no STATUS lamps; the header says STATUS AT LOCAL PANEL. AUTO START needs its permissive. AUTO STOP is its own press.

## Test (PC, real clicks, visible Chrome)
- Click check again on the Plant pages: 418 of 418 faceplate targets opened a faceplate with name and tag, no page errors.
- `build.js --check` SAME, operator text check ok, version check.

## Open for Lisa (docs check)
- Whether row 1 of DITL-119 gates both A and B, or only A. The faceplate shows it for both.
