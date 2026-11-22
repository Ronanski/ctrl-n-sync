# LMYP OTS 1.0.0-beta.284

22 Nov 2026. The in-furnace SH panels take their FHI design heat again, so the SH spray follows FHI Fig 10. Also the cause of the hot bed at 127.5 MW (report 282 F1). By Jennie.

## Changed

| Area | What changed |
|---|---|
| Plant model | `src/analog/engine/hx.js` `uaP` 69 -> 65 kW/K per SH panel. Same rule as beta.256: hold the design heat of the two panels, 62.5 MW at 150 MW. After beta.282 they took 65.4 MW and the sprays 17.4 T/H (FHI 12.4). The CALC is in the code. |

## Result

Operator probe from the 150 MW save (bed AUTO, 2 coolers), 40 plant min at each load. Before = beta.282.

| Load MW | SH spray T/H now (before) / FHI Fig 10 | MST °C now / FHI Fig 6 | Bed °C | Panel heat MW now (before) |
|---|---|---|---|---|
| 150 | 13.4 (17.4) / 12.4 | 541.4 / 541 | 947 | 62.5 (65.4) |
| 105 | 5.4 (7.9) / 3.9 | 546 / 541 | 957 | 33.6 |
| 90 | 0.2-0.7 (2.4-3.1) / 0 | 546 / 541 | 952 | 26.2 |
| 75 | 0 (0) / 0 | 533.8 / 534 | 961 | 19.4 |

- 150 MW stays on the anchor: MST 541.4, bed 947, coal 90.0, exit gas 862.
- 127.5 MW (report 282 F1): with the O2 trim AICFG112 held at 50 %, as the plant runs it and as the drawing forces it at 105 and 90 MW, the bed is 936 °C (was 991), SA 194 T/H (was 155-164) and the exit gas 830 °C (was 855). The bed model is right. The hot bed comes from the trim in AUTO: O2 4.1 % stays above the LN16 SV 3.5 % even with the trim at 0 (ratio 0.8 of S1-LN15), so SA is cut by 20 %.

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | 127.5 MW with the O2 trim in AUTO: the trim winds to 0 and the bed goes to 991 °C. Decided from the sources in hand, no change: the O2 SV stays the as-built curve LN16 (ABC-002, 3.5 % above 81 T/H coal). FHI P2S7 Tab 3 designs 20 % excess air leaving the economizer, about 3.5 % O2, the same as LN16 at full load. The plant SV 7.7 to 8.5 % (plant-study 14, scenario 1) is above what LN16 plus its bias can give (7.5 %) and is marked doubtful there; the plant runs with the trim held near 1.09 because its O2 sensors fail often. So the plant comparison is with the trim held: bed 936 °C at 127.5 MW, inside the plant band 900 to 960. The 991 °C with the trim in AUTO is what the drawing does with healthy analyzers. | Keep LN16. Train it as a scenario: trim AUTO on healthy analyzers cuts SA at 120-135 MW and the bed rises; the operator watches bed and O2. Jennie, nothing more to do in the model. |
| F2 | MST 546 °C at 90 and 105 MW with the spray almost at 0; FHI 541. Plant scenario 1 has 522 at 90 MW with no spray: the plant SH takes less heat than the FHI design (fouling). | Fouling of the SH is a scenario of the model (3.2.4 ash deposit): a trend-matched fouled save point for 90 MW. Jennie. |
| F3 | Cold start not run with beta.282 and 284 (the suspension heat is near 0 at low air speed). | One Cold run by the user, when the user chooses. Early start-up save points checked by Jennie first. |

## Tested

- Operator probe sweep 150 / 105 / 90 / 75 MW and 127.5 MW with the trim held (probes in the scratch folder).
- Behaviour gate `tests/gate/behaviour.cjs` on the built page: ALL PASS.
- `npm run build`, `npm run check` (SAME).
