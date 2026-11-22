# LMYP OTS 1.0.0-beta.286

22 Nov 2026. Start-up: the SH panels take heat from the furnace gas again. By Jennie.

## Changed

| Area | What changed |
|---|---|
| Plant model | `src/analog/engine/unit.js` (`AN_BB fgP`, `anBbPanF`) and `src/analog/engine/hx.js`: the in-furnace SH panels take the gas radiation (WSGG, as the walls) plus the solids part, with the same split per m2 as the upper walls: gas 40.4 % at the 150 MW anchor. The CALC is in the code. Since beta.282 the panels had only the solids part, so at start-up air (solids share about 1e-4) they took no heat. |

## Result

Start-up save points, 30 plant min with no operator action:

| Save point | Panel heat MW: 286 / 284 / 280 | Bed after 30 min °C: 286 / 284 / 280 | Note |
|---|---|---|---|
| S12 bed 500 C, oil | 6.3-7.2 / 0-0.4 / 1.3-2.0 | 577 / 584 / 542 | panel outlet steam 246 / 156 / 176 C |
| S29 10 MW coal | 5.3-6.8 / 0.1-0.6 / 1.3-2.0 | 703 / - / 632 | |
| S32 45 MW | 10.8-14.3 / 2.5 / 6.4 | 841 / 838 / 749 | plant bed 855-909 C at 40-150 MW (cold start day, plant-study 14) |

Operator probe from the 150 MW save, 40 plant min at each load:

| Load MW | Exit gas °C: 286 / 284 / FHI Fig 8 | SH spray T/H: 286 / 284 / FHI Fig 10 | MST °C | Bed °C |
|---|---|---|---|---|
| 150 | 862 / 862 / 840 | 13.0 / 13.4 / 12.4 | 541.4 | 948 |
| 105 | 792 / 804 / 778 | 14.8 / 5.4 / 3.9 | 544 | 952 |
| 90 | 754 / 773 / 755 | 12.1 / 0.2-0.7 / 0 | 543.5 | 946 |
| 75 | 715 / 739 / 722 | 8.5 / 0 / 0 | 542 | 956 |

- 150 MW stays on the anchor.
- The exit gas is on FHI Fig 8 from 75 to 90 MW and within 14 °C at 105 MW.

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | Part-load SH spray is above FHI Fig 10: 12 T/H at 90 MW where FHI has 0 (beta.280 had 8-9). The exit gas is right there, so the extra SH heat is downstream of the furnace, in the backpass. The air is not the FHI case: at 90 MW the model burns with PA 312 + SA 162 + FA 26 = 500 T/H and O2 8.4 % (the drawing forces the O2 trim MANUAL there; the plant has 505 T/H, scenario 1), while FHI Fig 12 / Fig 7 design 60 % load at 371 T/H and O2 3.6 %. A third more flue gas through the backpass SH banks gives them more heat. A sweep of the panel gas share and kKL at 90 MW found no pair that gives both FHI exit gas and zero spray; a larger kKL only heats the bed (975-990 C against plant 955). | Compare the backpass SH heat at the FHI air (371 T/H, O2 3.6 %) before any change: if the spray then goes to about 0, the model is right and the gap is the drawing air at part load. Jennie. |
| F2 | The start-up bed is 35-90 °C hotter than on beta.280 at the same save points (the solids carry little heat up at low air). At 45 MW it is now closer to the plant band. | Check against the cold start milestones (plant-study 14) in the user's Cold run. |
| F3 | One Cold run is still needed after 282, 284 and 286. | One Cold run by the user, when the user chooses. |

## Tested

- Start-up save points S12, S29, S32 on 280, 284 and 286, and the part-load sweep 150 / 105 / 90 / 75 MW (probes in the scratch folder).
- Panel gas share and kKL sweep at 90 MW (5 builds).
- Behaviour gate `tests/gate/behaviour.cjs` on the built page: ALL PASS.
- `npm run build`, `npm run check` (SAME).
