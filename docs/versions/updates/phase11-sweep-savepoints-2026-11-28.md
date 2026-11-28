# Phase 11: sweep save points and parallel legs (2026-11-28, phase thread)

User 8:47 PM PHT: the sweep must use the app's own save points and run its legs in parallel.

## Changes
- `tools/accept/part1.cjs`:
  - `SAVE_DIR=<dir>` writes `sp90.json` (the settled 90 MW hold) and `sp45.json`. They use the app's own save (`AN.engState.capture` + `ditlCapture`), the same object that `DITL150.savePut` loads.
  - `FROM=<sp90.json>` runs only the 90 -> 45 leg.
  - `STOP_AT=90` runs only the 150 -> 90 leg.
- `tools/accept/sweep-join.cjs`: joins the sample files of the two legs into one file for `tools/model/sweep-judge.cjs`.

## Tested (headless, main 1b21225 model + PR 749 load rate)
| Run | Wall time | Curves PASS |
|---|---|---|
| One full run 150 -> 45 | 65 min | 5 / 22 |
| Leg 150 -> 90 and leg 90 -> 45 from sp90, joined | 39 min each, in parallel | 5 / 22, same curves, each curve's count within 1 ~ 3 % of the samples |

## Rule
- Remake the save points after any model change, with one full run with `SAVE_DIR`. A stale sp90 tests the old plant.
- Between model changes (an operator or judge change, or a low-load-only change), run the legs in parallel from the save points.

## Not tested
- Mid-ramp save points at 120 and 60 MW (four legs) are not made yet.
