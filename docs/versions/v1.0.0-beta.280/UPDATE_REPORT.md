# LMYP OTS 1.0.0-beta.280

22 Nov 2026. Reset after a run gives the same state as Reset on a fresh page, in the Worker. By Jennie.

## Changed

| Area | What changed |
|---|---|
| Plant model | `src/analog/engine/plant.js`: `hx` and `nsat` are in `AN_PROC_RUN`, the run fields that Reset takes back. The unit model writes them during a run (`unit.js`: `hx` = the heat or main valve flow of a spray, a superheater stage, the feedwater; `nsat` = the part of the spray range below saturation, `natRH`). A Reset after a run kept them (`hx` as undefined, `nsat` 0) on 6 plant models where a fresh page has neither. |
| DITL | `src/world/ditl150.js` `D.clear`: the cause of a MOV moved by its logic (`_mvWhy`, for the Event log) goes too. A Reset after a run kept it on DITL-32, -33, -35, -80R and their #B copies. |

Nothing in the logic or the plant physics changed: these are leftovers of the run before, not values a fresh start reads.

## Result

- `reset_worker`, Worker: every check passes (ABC, DITL, saved values, Worker = page mirror after Reset). Before: 2 fails.
- `reset_worker`, page engine (the fallback when the Worker stops): ABC passes; DITL still fails (F1). Total 2 fails, was 5.

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | Page engine only: after Reset, the fresh page has nets (`_v`) on 7 DITL sheets (DITL-03E and others with plant switches) and no plant switch list; after a run + Reset it is the other way round. Something scans or builds after Reset on the page engine only, and it differs with DITL in service (the run before) or not. The Worker does not show it. | Trace what runs after Reset on the page engine (`coldIfNone`, `AN.settle`, the world build with `WORLD.on`). Jennie, low priority (fallback only). |

## Tested

- `npm run build`, `npm run check` (SAME).
- `tests/regress/reset_worker.js` on the built page, with every differing path listed (probe in the scratch folder).
