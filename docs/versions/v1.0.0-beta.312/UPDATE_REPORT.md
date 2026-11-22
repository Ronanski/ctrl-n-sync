# LMYP OTS 1.0.0-beta.312 (LEADER : JENNIE, 2026-11-23)

## What changed for the operator

Three sea water values that were guesses now come from the pipe and valve sizes in the plant papers.

| Value | Before | Now | Source |
| --- | --- | --- | --- |
| Pressure loss of the open SWP check valve + discharge valve at 18,900 m3/h | 0.3 m (guess) | 0.51 m | SWP data sheet K1AU3-D1-0-064 p4: discharge 1350 mm |
| Pressure loss of the open condenser inlet valve at the design flow | 0.02 kg/cm2 (guess) | 0.0069 kg/cm2 | Condenser outline K1AU3-D1-0-039 p7 nozzle chart: cooling water inlet 66" |
| Pressure loss of the open SW booster pump discharge valve at 1,000 m3/h | 0.3 m (guess) | 0.34 m | SW booster pump drawing K1AU3-D1-0-034 p5: discharge 12" |

How: loss = K x (speed of the water)^2 / 2g. The speed is the flow divided by the pipe area. K of a fully open valve is from the
standard Crane valve table (butterfly 25 x fT for large sizes, 35 x fT for 10 ~ 14"; swing check 50 x fT; fT is the friction factor
of a fully rough pipe of that size). The full working is in the comment above AN_SW in `src/analog/engine/unit.js`.

What it means: at normal 150 MW nothing moves (SWP discharge 2.31 kg/cm2, condenser inlet 1.15, same as before, because the
design point of the model still holds). The change shows when a valve is throttled: with one SWP and its discharge valve at 10 %,
the flow is now 1,644 m3/h instead of 2,122 and the pump pressure 3.94 instead of 3.87 kg/cm2.

## Findings

| # | Finding | Recommendation |
| --- | --- | --- |
| F1 | Each SWP has a check valve (model network from flow diagram K1AU3-PD-020), but its type is not in the docs found. Swing check (Crane 50 fT) was used. A dual plate check would give about 0.4 m instead of 0.51. | Confirm the check valve type from the valve list or the field; change hv100 only if it is not a swing check. |
| F2 | The SW booster pump line is modeled with its discharge valve only (no check valve loss). | Add the check valve loss if the P&ID shows one on each booster pump. |
| F3 | The intake civil hydraulic calculation (LIMAY-D1-10, in K1AU3-D1-0-105) gives 2.39 m intake pipe loss and 0.24 m trash rack loss at 20.56 m3/s; the model uses the forebay level directly, so these are not needed now. | Use them if a forebay level model (tide, screen fouling) is added. |

## Tests

`tests/regress/cw_model.js`: ALL PASS on main 310 and on 312 (same design point; the 10 % valve case moves as above).
