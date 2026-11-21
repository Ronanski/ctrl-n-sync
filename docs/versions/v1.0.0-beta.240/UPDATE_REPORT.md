# LMYP OTS 1.0.0-beta.240

22 Nov 2026. Turbine metal cools after a trip (Jennie, HOT / WARM save points by real clicks).

## Changed

| Area | What changed for the operator |
|---|---|
| Turbine metal | After a turbine trip with the boiler bottled up, the HP first stage and reheat bowl metal stood still while the trip was held (MFT or turbine trip latch), for hours: 487 C after 1.7 plant hours, where the cooling law (FHI start-up modes, 71.9 h) gives 476 C. The metal now cools by the same law during the trip hold, so a unit left tripped goes from HOT to WARM to COLD with the hours as on the plant |

## Tested

Build, `npm run check`, and the 150 MW behaviour gate (20 plant minutes, SAVE / LOAD, same run twice) headless. The trip-and-cool path is checked live by real clicks for the WARM save point.

## Findings seen in the same live run (not changed here)

| Finding | Recommendation |
|---|---|
| MFT first out turned from TURBINE TRIP to SAF STOPPED when the operator stopped the fans after the trip | The first out must latch the first cause until reset; check the first-out latch of DITL-03A |
| Both condensate pumps stood stopped during the hold and the deaerator level fell to -657 mm | Find what stopped them (hotwell low-low or the trip); the operator restarts one, as done here |
| Turning gear, the turbine auxiliaries and the ATS step logic do not run while a trip is held (same skip in unit.js) | Run the turbine auxiliaries outside the trip skip as done for the metal |
