# v1.0.0-beta.290 (JENNIE, 2026-11-22)

## Changed

- `src/analog/engine/unit.js` AN_BB / anBbPanF: the gas share of the in-furnace SH panels comes from the lane between two panels, no longer from the furnace wall split. Drawing FHI K1AU3C-201: 622.3 mm pitch, 50.8 mm tubes, lane beam 1.8 x 571 mm = 1.03 m (Hottel). WSGG emissivity there is 0.305, against 0.504 at the furnace beam 7.7 m (hx.js anHxEps, 892 C). Panel faces: 28 x 2 x 0.6096 m x (14.75 + 3.126 m) = 610 m2. Gas to the panels at the 150 MW anchor: 610 x (54.5 + 10 W/m2 K) = 39.4 kW/K, of the 130 kW/K panel conductance, so fgP is 0.303 (was 0.404). The panel gas part follows the lane radiation of the suspension temperature. At the anchor nothing changes; at part load the panels lose heat faster, because the solids part falls with phi^0.5.
- Correction of the 17:35 note in report 286 (kept there as written): it said the lane changes only the size of fgP, not its part-load slope. That was wrong. The size of the gas share sets the slope, because only the solids part falls with phi.

## Result

Operator probe from save "150 MW bed AUTO 2 coolers", HIC-ULD 90 MW, O2 trim held at its 150 MW output 32.7 (as the plant, 14-plant-trends line 70), 45 plant min:

| | 288 | 290 | Plant trend scenario 1 |
|---|---|---|---|
| Bed °C | 958 | 960 | 955 |
| Exit gas °C | 756 | 761 | FHI Fig 8: 755 |
| 1st / 2nd spray T/H | 6.8 / 5.3 | 3.6 / 5.7 | 2nd spray MV 0 |
| MST / RHT °C | 543 / 539 | 543 / 539 | 522 / 521 |

Start-up save points, 30 plant min with no operator action:

| Save point | Panel heat MW: 290 / 286 / 280 | Bed after 30 min °C: 290 / 286 / 280 |
|---|---|---|
| S12 bed 500 C, oil | 5.4-6.2 / 6.3-7.2 / 1.3-2.0 | 578 / 577 / 542 |
| S29 10 MW coal | 4.3-5.8 / 5.3-6.8 / 1.3-2.0 | 702 / 703 / 632 |
| S32 45 MW | 9.2-12.8 / 10.8-14.3 / 6.4 | 842 / 841 / 749 |

None of the runs tripped.

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | At 90 MW the sprays are still on: 3.6 + 5.7 T/H, while the plant's 2nd spray is at 0. MST is 543 against plant 522, and RHT is 539 against 521. Two causes are ruled out. Backpass deposits clean or full both give MST 544 (only the 2nd spray moves, 6.5 vs 2.9 T/H). With the O2 trim in AUTO, SA drops to 131 T/H and the bed goes to 994 C. That is the test set-up, not the model: the plant runs with the trim held. | Next Jennie beta: split the remaining SH / RH heat at 90 MW by stage (panels, backpass SH, RH, gas bias dampers HICHR1002A/B) against the plant trend scenario 1. Each change needs a documented mechanism. |
| F2 | Start-up bed is still 35-70 °C hotter than on 280 (S12 578, S29 702, S32 842). The plant bed is 855-909 C at 40-150 MW. | Still open, Jennie. |
| F3 | Cold run. | The user's call. |

## Tested

- `tests/gate/behaviour.cjs` on the station page: ALL PASS (150 MW, 20 plant min, SAVE / LOAD, same run twice).
- The 90 MW probe and the start-up saves S12 / S29 / S32 (tables above). The probes are in the scratch folder.
- `npm run check`: SAME.
