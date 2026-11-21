# Update report v1.0.0-beta.241

Engine fixes after the real-click test of beta.240 (Rosé) and the HOT / WARM save points (Jennie).

## Changes

| # | What changed | Why | Where |
|---|---|---|---|
| 1 | A load (starting state or save point) writes the model-only display values once (TT-MS1007, PICR19011 ~ 13 and the other U.tt keys) | The Reheat page showed `-----` on first open while paused: those values were written only by a plant step, and a state captured before a key existed had none | unit.js anTagsNow, state.js anStateApply |
| 2 | The auxiliary steam display lags hold at dt 0 | So the load-time pass reads the plant without moving any lag | unit.js anAsTagStep |
| 3 | MFT first out = the first-out memory whose record is the oldest (same scan: drawing order) | After a turbine trip the first out read SAF STOPPED, which came minutes after TURBINE TRIP; the drawing memories latch each on its own, so the first lit row of the drawing is not the first out | soe.js AN.soeTrip |

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | PIST10012 / PIST10013 HIGH stand at 150 MW | Kept. The set points H 93.8 / 62.5 are the plant alarm list 2016-09-12 "DCS temporary values"; the first stage 96.8 kg/cm² at 150 MW fits the heat balance (throttle 126 ata, HP exhaust 38.6 ata) and the IBD TA-21 table (to 111 kg/cm²). The real DCS shows the same standing alarm with those values. Ask the plant if the temporary values are still set. |
| F2 | Hotwell make-up: MV-MU1001 closed while the level controller asked 91 ~ 100 % | Not a fault. The controller drives LCV-MU1110 (3 inch); MV-MU1001 is the 8 inch bypass, operator only (PD-016 A-7, DITL-60). After a trip, the condensate pumps refill the deaerator faster than LCV-MU1110 makes up, so the operator opens MV-MU1001, as done in the WARM run. |
| F3 | Drum level fell to -422 mm (low-low) in about 6 h bottled up | Open. Find where the water goes (continuous blowdown, sampling, drains) in a bottled-up boiler, then compare with a plant record. |
| F4 | Turning gear, aux and ATS steps do not run while a trip is held | Open (from beta.240). Move them out of the trip skip. |

## Checks

Gate (behaviour.cjs) result in the PR.
