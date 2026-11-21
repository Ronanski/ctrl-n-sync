# LMYP OTS 1.0.0-beta.239

21 Nov 2026. Sources for the turbine metal and the design data (Full Audit 3; Jennie).

## Changed

| Area | What changed for the operator |
|---|---|
| Turbine metal | The HP first stage and reheat bowl metal now heat toward the steam with the time constants of the vendor's own thermal stress logic (TCS TCA752 ~ 757 rotor model): HP 1528 s, IP 2332 s. Before, both used 2400 s with no source. Cooling after a shutdown is unchanged (FHI start-up modes by the hours since shutdown) |
| Plant data | The design values (FHI P2S7 Tab 3, heat balance PPE-14-0725) are written beside the plant-anchored values as their upper bound: superheater pressure drop, main steam line temperature drop, hot reheat line pressure drop. The anchors stay on the plant data |

## Tested

Build, `npm run check`, and the 150 MW behaviour gate (20 plant minutes, SAVE / LOAD, same run twice) headless.

## Not tested / open

A Cold start-up was not run on this version: the faster HP metal changes the heat soak at 1800 rpm and the start-up mode judgement only while the turbine is rolled. The CV chest and the LP exhaust hood time constants are still without a source.
