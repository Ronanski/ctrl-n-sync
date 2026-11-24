# v1.0.0-beta.304 (JENNIE, 2026-11-23)

User (2026-11-22): "s totoong planta, hnd static mga values kht na attain mo ang target mw mo". At a steady load the values of the app stood still; the plant's values keep moving. This release models two physical causes found in the plant trend and the TCS drawing. No random noise is added to any reading.

## Plant trend (what the plant does at a steady 150 MW, scenario 1, 0 to 6 h, 60 s values)

| Value | Mean | Spread (sd) | Swing period |
|---|---|---|---|
| MW | 149.85 | 0.43 | about 9 min |
| Main steam flow | 482 T/H | 1.9 | |
| Main steam pressure | 120.8 kg/cm2 | 0.75 | about 19 min |
| Coal flow | 89.8 T/H | 0.45 | 4 to 6 min |
| Bed temperature | | 1.4 to 3 | |

## Changed

| Item | Change | Source |
|---|---|---|
| Coal lots (`unit.js` anCoalLots, `plant.js` feeder) | Each feeder carries a sequence of coal lots. A lot with another bulk density loads the belt more or less, so the coal that really falls (load cells) moves until the feeder speed loop trims it back. One stockpile layer with its own moisture fills all three bunkers and mixes over the bunker draw-down. The sequence is fixed (saved with the plant), so a run is the same on every PC and after SAVE / LOAD. | Gravimetric feeder: feed = belt load x speed (Yamato GM-BSC22-36). Spreads set from the measured plant coal flow. Lot sizes and speed loop time NO-SOURCE. |
| Turbine MW loop (`unit.js` anTbFlow, AN_TCE195) | The MW error integral takes the TCS gains: 0.05 % flow demand per MW at once and 0.01 %/s per MW. Was 0.033 %/s per MW (NO-SOURCE), 3.3 times faster, which held the MW to plus or minus 0.02 MW. | TCE195 GOVERNOR CONTROL(1), PIV022 G1 0.05, G2 1.0, TI 5.0 s (331DM09784 PDF p.137); GEN. MW in MW (TCE070, PDF p.38). |

## Result (headless, station page, "Normal operation at full load", 120 min, nothing touched)

| Value | App sd | Plant sd |
|---|---|---|
| Coal flow | 0.52 | 0.45 |
| Bed temperature | 1.5 | 1.4 to 3 |
| O2 | 0.07 | |
| Main steam pressure | 0.06 | 0.75 |
| MW | 0.03 | 0.43 |

Coal and bed now move like the plant. MW and steam pressure still move far less than the plant.

## Findings

| # | Finding | Recommendation |
|---|---|---|
| 1 | Plant MW moves with the steam flow minute by minute (correlation 0.86, gone after 5 min) and only 0.40 with the pressure, and not with the coal. So the turbine valves move on the plant. The likely cause is the grid frequency through the 6 % droop, but the TCS dead band is plus or minus 7.2 rpm (0.12 Hz) and no grid frequency record was found on the PC. | Get a plant trend of the grid frequency (or the turbine speed) and the GOV SET at a steady load, then model the grid swing from it. Until then, MW stays near the target. |
| 2 | Plant pressure swings with a 19 min period at sd 0.75 while the coal moves only 0.45 T/H. That is a slow swing of the boiler master pressure loop, not the coal. | Compare the boiler master (ABC) PI values in the app with the ABC sheet and with the plant trend of the boiler master output (trend B). |
| 3 | TCE195 has no feedforward of the target: the target enters only through the MW error. The app adds the target as a share of the rating. | Keep for now (load ramps rely on it); test a load ramp without it against the plant load-up trend before changing. |

## Tested

- `npm run build`, `npm run check` (SAME).
- Headless steady 150 MW probe above.
- Behaviour gate and diesel oil regression: see the PR checks.
