# Update report v1.0.0-beta.243

Engine fix for finding F4 (from beta.240 and beta.241): the turbine auxiliaries stood still while a trip was held.

## Changes

| # | What changed | Why | Where |
|---|---|---|---|
| 1 | The turbine auxiliaries (aux steam, gland steam, metal, shell expansion, bearing oil criterion, LP exhaust hood, generator, turning gear) moved into a new function `tcsAux`. `tcsStep` and the trip hold both call it. | While a turbine trip was held (MFT M.3200 or I.0400), the unit called only `tcsTripHold` and skipped `tcsStep`. So after a trip with the boiler bottled up, the gland, hood temperature, bearing oil criterion and turning gear stood still for hours. These are physics and do not wait for a trip reset. Only the ATS program (steps, ramps, holds) waits for the reset. | tcs.js tcsAux / tcsStep, unit.js trip hold |
| 2 | The turning gear block moved from the end of `tcsStep` into `tcsAux` | So the shaft is held at about 3 rpm by the turning gear also while the trip is held | tcs.js tcsAux |

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F2 | Hotwell make-up: MV-MU1001 closed while the level controller asked 91 ~ 100 % (beta.241) | Not a fault. MV-MU1001 is the 8 inch bypass of LCV-MU1110 (PD-016 A-7, DITL-60), operator only; ABC-031 drives LCV-MU1110 (unit.js, plant.js). Rosé: add a "BYPASS (operator)" label to the MV-MU1001 faceplate so a trainee does not read it as the controller output. |
| F3 | Drum level fell to -422 mm (low-low) in about 6 h bottled up (beta.241) | Resolved. Cause: the CBD MV-BD1002 was left open (about 12 T/H) and the drum was not filled. That is an operator step, not a model fault. The new WARM save was made with the CBD and MBD closed and the drum filled by BFP A start / stop. |
| F4 | Turning gear, aux and ATS steps did not run while a trip was held | Fixed in this Beta (change 1 and 2). The ATS program still waits for the trip reset, as in the plant. |
| F6 | In the WARM hold the drum falls about 32 mm per plant hour (+141 to +109 in 60 min) with CBD and MBD closed | Kept, the same in beta.241 and beta.243. The bed (323 C) still boils the bottled water and the steam leaves through the drains and vents, so the operator tops up with BFP A as in the WARM run. Next: trace the outflow per path headless and compare with a plant bottle-up record. |
| F5 | The hidden browser pane at x300 runs only about 36x real time | Kept. Long holds are run headless (`AN.runFixed`) or in a visible pane. |

## Save points

- WARM (use this one): `1795285488682-WARM_bottled_up_CBD_closed_HP_metal_404_C.json`. HP 403.5 / RH 401.5 C, 108.5 kg/cm2, drum +141 mm, hotwell +2, DA +348, bed 323 C, turning gear 3 rpm, CBD and MBD closed.
- HOT: `1795276899631-HOT_bottled_up_after_turbine_trip.json`.
- The old WARM `1795279992789-...` is superseded (drum low-low, cause F3).

## Checks

Headless hold probe, WARM save, 60 plant min while the trip is held, page errors 0 on both builds:

| Value | beta.241 | beta.243 |
|---|---|---|
| LP exhaust hood Tx | 43.6 C, frozen | 43.6 to 30.1 C (cools to ambient) |
| Aux steam Pa | 10.2, frozen | 9.5 |
| Turning gear | 2.99 rpm, frozen | 3.00 rpm |
| HP metal | 403.5 to 398.3 C | the same (beta.240 fix) |

Gate (behaviour.cjs) result in the PR.
