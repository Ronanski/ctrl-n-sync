# LMYP OTS 1.0.0-beta.256

22 Nov 2026. Full Audit 3 item #3 (bed temperature over a long run), follow-up: the bed is anchored to the plant thermocouples. By Jennie.

## Changed

| Area | What changed |
|---|---|
| Plant model | `src/analog/engine/unit.js`: the bed no longer gives its heat to the walls and panels at its own temperature. Above it is the upper furnace suspension: gas plus circulating solids rise and give heat to the water walls and the SH panels in parallel (`anBbSus`). The furnace exit gas and the upper furnace mean temperature now come from that balance. The constants are derived in a CALC comment from the 18 bed thermocouples TT-FG1090/1091 (mean 937 °C), the furnace exit 850 °C (FHI Fig 8), the evaporator duty 157.2 MW and the panel duty 62.5 MW at full load. The solids flux this gives, 21.7 kg/m²s, is inside the CFB range 10 to 100 (Basu). |
| Plant model | `src/analog/engine/hx.js`: SH panel UA 75 → 69 kW/K, because the panels now see the upper furnace mean (892 °C) instead of the bed. |
| Save / load | `src/analog/engine/state.js` + `anBedMigrate` in `unit.js`: a save from before this version is moved to the new balance on load. The bed temperature is solved so that the heat leaving the bed is the same as in the saved state (old model). No value is set by hand. Gate: the save has no upper furnace temperature. |
| Start | `src/data/st150.txt` made again by `tools/steady150/make.cjs`. |

## Result

| Run | Coal T/H | Bed °C | MST °C | Drum bar |
|---|---|---|---|---|
| Plant 150 MW (trend) | 89.7 | 952 to 962 | 540 | — |
| beta.254 st150 | 89.8 | 863 | 540 | 133 |
| beta.256 st150 | 90.3 | 948 | 540.4 | 133.4 |

Every save loads and runs 30 plant min with no trip (beta.256 vs beta.253, same saves):

| Save | 256 coal / bed after 30 min | 253 coal / bed |
|---|---|---|
| S48 75 MW CCS | 48.7 / 861 | 45.7 / 813 |
| S68 3600 rpm soak | 44 / 839 | 44 / 803 |
| S81 150 MW CCS AUTO | 90.1 / 926 | 89.4 / 839 |
| S99 45 MW shutdown | 36.8 / 876 | 36.8 / 830 |
| HOT bottled up | 0 / 674 | 0 / 674 |
| WARM bottled up | 0 / 322 | 0 / 322 |
| 150 MW bed AUTO 2 coolers | 90.3 / 943 | 90.3 / 856 |

PIC-BASC (ABC-009A) checked against the drawing: the PV is the four ash cooler speeds × 1/4, each through a switch that gives 0 when that cooler is not running. The app already does this. No change.

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | An old save at 150 MW moves from bed 856 to about 925 to 943 °C in the first 10 min after load. Spray water moves with it (S81 SH spray 22 → 18 t/h, RH 10.6 → 2.6 t/h). No trip. | Make the save points at load again from the new model when they are next used for a test (S81, bed AUTO). |
| F2 | S48 (75 MW) RH spray stays at 4.5 t/h on 256, 0 on 253. | Check RH spray at 75 MW against the plant trend in the next part-load study. |
| F3 | At 90 MW the plant bed stays 952 to 962 °C. Not checked in this PR. | Run the 150 → 90 MW ramp on 256 and compare the bed. |

## Tested

- Steady 150 MW made from cold start of the model (make.cjs): steady after 30 min.
- 7 saves × 30 plant min on 256 and on 253 (above), headless, PC test lock.
- 8 h at 150 MW from the bed AUTO save (beta.254 model): MST flat 541, bed inventory 179 to 180 t.
- Build `--check` SAME. The behaviour gate runs in the Checks.
