# LMYP OTS 1.0.0-beta.235

21 Nov 2026. Generator panel frequency fix from Full Audit 3 (Jennie).

## Changed

| Area | What changed for the operator |
|---|---|
| Generator panel | Frequency (Hz) and field values are filled from the unit state when the generator state is made. Before, a loaded save could show the frequency as empty until the next scan |

## Tested

Build, `npm run check`, and the 150 MW behaviour gate (20 plant minutes, SAVE / LOAD, same run twice) headless.

## Not tested / open

No live clicks on this version. Cold start-up and load changes were not run.
