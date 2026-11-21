# LMYP OTS 1.0.0-beta.258

22 Nov 2026. Full Audit 3 item #4 (TCS sheets as the running logic), step 2 first part: what each small block does. By Jennie.

## Changed

| Area | What changed |
|---|---|
| Logic (not loaded yet) | `src/digital/tce-run.js`: one function for each of 56 block kinds, each from its item in the HIACS macro list (TCA013 ~ TCA020, items 1 ~ 73) with the item number in a comment. The parameters are the ones printed under each block (`K:3600.0rpm`, `TP:10.0S`, `HL:..`). Each block keeps its own memory (timers, flip flops, integrals) and steps at plant time. The sheet names for the same kinds are mapped (`G:OR`, `G:A`, `PA1` ~ `PA4`, the circles `o:BTR` / `o:FTR`); `X` and `NC` are marks, not blocks. The file is not in `order.list`: it runs nothing in the app until step 4 (shadow run). |
| Test | `tests/tce/run.cjs`, added to the Checks: 57 cases, each the macro list rule at a fixed step, and a count of every block kind on the typed sheets. It fails on a wrong case, or on a kind that is not a block, an alias, a mark or on the list to read. |
| Plan | `docs/tcs/SHEETS_AS_LOGIC_PLAN.md` step 2 marked as started. |

Nothing in the plant model, the running logic or the HMI changed.

## Result

- 57 / 57 block cases pass.
- 499 sheets loaded (TCE, TCA, G, IBD), 9,829 small blocks: 8,803 (89.6 %) have a meaning or are a mark.
- The rest are on the list to read, below.

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | 54 FG blocks (function generator, ML 19) on 17 sheets have no break points typed (TCE101, TCE202, TCE206, TCE214, TCE500, TCE503, TCA530, TCA531, TCA548, TCA585, TCA586, TCA634, TCA760, TCA769, TCA770, TCA777, TCA825). The block gives NaN without points; no curve is made up. | Read each curve on its sheet or its FG table and type it as `X1:` / `Y1:` notes before the shadow run of that controller. |
| F2 | 1,004 `G:` symbols on the generator relay sheets (G-1A ~ G-9) are typed with no kind. They are not TCE / TCA logic. | Leave them out of the sheet logic. Type their kind when the generator protection is taken from the G sheets. |
| F3 | SR 2, SC 2, MODE 5, UNT-FG 4, L-RATE 1, FILTER 1 are not items of the macro list. | Read each on its sheet in step 2, second part, with the 9 most used macros. |
| F4 | VALVE CONTROL MT1 (6) and PRESS COMPENSATE MT1 (1) are SIM.MT plant models. | They stay in the plant model and are bound as inputs (plan step 2). |
| F5 | PA* (ML 62) is written as: the new value is taken while its condition is met, else the previous value is kept. The pin order on the sheets (which pin is the condition) is not checked. | Check it on TCA533 (PA2) in the shadow run. |

## Tested

- `node tests/tce/run.cjs` (above).
- `node tools/data/tce_check.mjs`.
- Build `--check` SAME.
- The behaviour gate runs in the Checks. Nothing in the app changed, so no PC run.
