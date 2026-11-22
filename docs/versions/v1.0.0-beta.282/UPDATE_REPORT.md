# LMYP OTS 1.0.0-beta.282

22 Nov 2026. Part load: the furnace exit gas, the SH spray and the main steam temperature move toward the FHI design curves, and the bed stays as hot as the plant. By Jennie.

## Changed

| Area | What changed |
|---|---|
| Plant model | `src/analog/engine/unit.js` (`AN_BB`, `anBbPhiV`): the solids that the gas carries above the bed fall with the gas speed by the Kunii & Levenspiel freeboard decay, phi = e^(-kKL (1/uRel - 1)), in place of the power law (u/u150)^3.5. `kKL` 9.2 comes from plant scenario 1 at 90 MW (coal 55.4 t/h, bed 955 °C, FHI Fig 8 exit 755 °C); the derivation is written in the code. The power law is kept only to read old saves (`anBedMigrate`). |
| Plant model | `unit.js` and `src/analog/engine/hx.js`: the heat transfer of the furnace walls and the panels to the suspension goes with the square root of the solids density (Basu & Nag: h ~ rho^0.5), not with the density itself. |

## Result

Operator probe from the 150 MW save (bed AUTO, 2 coolers), 20 plant min at each load. Before = beta.280.

| Load MW | Bed °C now (before) | Exit gas now (before) / FHI | SH spray t/h now (before) | MST °C now (before) / FHI |
|---|---|---|---|---|
| 150 | 945 (944) | 858 (856) / 840 | 15 + 2.4 (15 + 1.7) | 541 (541) / 541 |
| 127.5 | 991 (961) | 855 (863) / 808 | 10.7 (13.7) | 542 (543) / 541 |
| 105 | 951 (896-916) | 801 (805-823) / 778 | 7.9 (10-13) | 543-545 (542-550) / 541 |
| 90 | 945 (881-900) | 769 (789-805) / 755 | 3.1 (8-9.4) | 543 (544-547) / 541 |
| 75 | 951 (861-871) | 737 (767-778) / 722 | 0 (4-6) | 537 (543-549) / 534 |

- Plant scenario 1 holds the bed at 954-955 °C from 150 to 90 MW; the model now does the same (was 881-916 at 90-105 MW).
- The loops are steady at part load: coal 63.4-64.2 t/h at 105 MW (plant 64.3), 55.9 at 90 (plant 55.4), 48.3 at 75. Before, coal swung 54-70 t/h at 105 MW.
- 150 MW stays on the anchor (bed 945, MST 541, coal 90.1).

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | Bed 991 °C at 127.5 MW, above the plant (about 955) and above the model at 150 and 105 MW. The exit gas at 127.5 is still +47 over FHI. | Check the bed cooler and PA/SA split at 127.5 MW against a plant trend near that load. Jennie. |
| F2 | MST 543 °C at 90 MW, plant 522 °C with the 2nd spray at 0. The SH spray is at 3.1 t/h where the plant has none. | Look at the platen / SH heat split at low load (radiant vs convective share). Jennie. |
| F3 | Cold start not retested with the new decay: at low air speed phi is close to 0, so the walls see little suspension heat. | Run the Cold save points through light-off and bed heat-up. Jennie, next. |

## Tested

- Operator probe sweep 150 / 127.5 / 105 / 90 / 75 MW, new and old build side by side (probe in the scratch folder).
- Behaviour gate `tests/gate/behaviour.cjs` on the built page.
- `npm run build`, `npm run check` (SAME).
