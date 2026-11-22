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
| F1 | Part-load SH spray is above FHI Fig 10: 12 T/H at 90 MW where FHI has 0 (beta.280 had 8-9). The air is not the cause: FHI designs 60 % load at 371 T/H and O2 3.6 % (Fig 12, Fig 7), the model (as the plant, 505 T/H) at 500 T/H and O2 8.4 %, but with the O2 trim held at 0 (SA 162 -> 130 T/H, O2 7.5 %) the spray stayed 12.1 T/H and the bed rose to 993 C. The spray follows the panel gas share (sweep at 90 MW: share 0 -> 0.5 T/H, 0.1 -> 3.4, 0.2 -> 5.9, 0.404 -> 12.1, with the exit gas 773 -> 754 C): the panels take about 8 MW more than the FHI split allows, and the walls should take it. A likely cause is that platens in a row shade each other and see the gas only in the narrow lanes between them (short beam length, lower emissivity than the 7.7 m of the open furnace); the platen spacing is in the C series drawings, which are not in the documents. | Find the platen spacing (P4S1 C series, or measure from the GA drawings in the PC folders) and compute the lane beam length; then the gas share of the panels comes from WSGG at that length, not from the walls. Jennie. |
| F2 | The start-up bed is 35-90 °C hotter than on beta.280 at the same save points (the solids carry little heat up at low air). At 45 MW it is now closer to the plant band. | Check against the cold start milestones (plant-study 14) in the user's Cold run. |
| F3 | One Cold run is still needed after 282, 284 and 286. | One Cold run by the user, when the user chooses. |

## Tested

- Start-up save points S12, S29, S32 on 280, 284 and 286, and the part-load sweep 150 / 105 / 90 / 75 MW (probes in the scratch folder).
- Panel gas share and kKL sweep at 90 MW (5 builds).
- Behaviour gate `tests/gate/behaviour.cjs` on the built page: ALL PASS.
- `npm run build`, `npm run check` (SAME).
