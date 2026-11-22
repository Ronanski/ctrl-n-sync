# LMYP OTS 1.0.0-beta.308 (LEADER : JENNIE, 2026-11-23)

## What changed for the operator

The ammeters of the PA fan, SA fan and ID fan now drop to the right value when the air is low (start-up, low load,
damper nearly closed). Before, all three used one made-up share (45 % of the full-load current at no air). Now each one comes from
its own vendor fan curve and motor sheet. At 150 MW nothing changes: each ammeter still reads the plant snapshot.

| Fan | Current at no air, before | Now | Snapshot (151 MW) |
| --- | --- | --- | --- |
| PA fan IT-F1053 | 114 A | 118 A (0.47) | 253.6 A |
| SA fan IT-F1054 | 60 A | 69 A (0.51) | 134.0 A |
| ID fan IT-F1056 | 90 A | 113 A (0.57) | 199.6 A |
| FA blower IT-F1055A / B | 16.8 A | 16.8 A, kept (vendor data say 14.2 A, see F3) | 37.3 A |

## How it was derived (no fitting)

Motor current = square root of (magnetizing current squared + working current squared).

- Magnetizing current: the reactive current read from each motor's own "Efficiency & Power Factor vs Load" curve at 10 to 20 % load
  (TECO motor data sheets in K1AU3-D1-0-003 R0 Engineering Data of Boiler Fan, archive copy, and the FA blower O&M V10-5).
- Working current: the fan's own power at no flow from its vendor performance curve, divided by the motor efficiency at that load.
- ID fan: it has a Voith hydraulic coupling (350 to 1145 rpm). At no air it runs at the bottom speed, and the coupling passes the
  same torque at full motor speed, so the motor sees 116 kW (fan 34 kW x 1193 / 350).
- Check: the ID fan snapshot current 199.6 A means 1.89 MW into the motor; the fan curves at the 151 MW gas flow give 1.97 MW at
  the motor. They agree within 4 %.

Full numbers are in the comment above `AN_FN` in `src/analog/engine/boiler.js`.

## Findings

| # | Finding | Recommendation |
| --- | --- | --- |
| F1 | PA and SA fan: the vendor chart is the fully open inlet-vane line. With the vanes shut the no-flow power is lower, so 0.47 and 0.51 are the upper bound. | Use the inlet-vane curve or a plant start-up trend of the fan current (damper shut) if one is found. |
| F2 | ID fan: through the hydraulic coupling the motor power follows speed squared, while the model scales the current with fan power (speed cubed). At part load the ID fan ammeter may read a little low. | Check against a plant trend of IT-F1056 at 75 to 100 MW before changing the law. |
| F3 | FA blower: the vendor data give 0.38, but the blower curve and the plant snapshot disagree on the flow (26.3 T/H on the curve is about 520 kW, the snapshot 37.3 A means about 400 kW). With 0.38, when standby B starts and both blowers share the flow, A fell under the 24.6 A low-low current and tripped, which the plant does not show. So 0.45 stays for now. | Find what FIFA1055 measures against the blower curve flow (per blower, at which temperature), then apply 0.38 with the right flow scale. |
| F4 | The fan test "Cold: no fan" fails the same way on main beta.306: FA blower B is still running in that step. Not from this change. | Check whether the test or the Cold state is wrong. |
| F5 | The FA blower standby tests need the save b142-150MW-cold-run.json, which is not on the PC. They were run with the 150 MW bed save instead; with it, the drawing-trip test fails on main too. | Put the b142 save back in team-files/saves. |

## Tests

See the PR for the build check and the fan tests run on this build.
