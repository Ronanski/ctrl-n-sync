# LMYP OTS 1.0.0-beta.276

22 Nov 2026. The merge gate runs the engine the app ships (the Worker, the default since beta.275). By Jennie.

## Changed

| Area | What changed |
|---|---|
| Engine (Worker) | `src/world/eng-host.js`: the fixed clock of `sched.js` in the Worker too. `AN.clockFixed(on)` stops the clock of the PC (both Worker timers wait), and `AN.runFixed(seconds, dt)` steps the current set in steps of exactly dt, with the DITL world scanned between them every 1 s (busy) or 3 s (quiet) and after the last step. These are the same rules as the page engine. |
| Engine (page) | `src/analog/engine/sched.js`: `AN.clockFixed(on)`, the same switch for the page engine. `src/world/eng.js`: `clockFixed` and `runFixed` are engine actions. `runFixed` is a long action: the page sends it to the Worker and gets the answer once the whole state is back. |
| DITL state | `src/digital/parts/03d-state.js`: a netlist with no nets (TCS sheets with n 0) is captured with `_v` null on both sides. Before, it was `[]` where it was scanned and null where it was not, so the same state compared as different. |
| Gate | `tests/gate/behaviour.cjs` opens the page with `?worker=1`, waits for the Worker, and steps the plant with `await AN.runFixed(30, 0.5)`. `GATE_WORKER=0` still runs the page engine (the fallback) for a comparison. |
| Test | `tests/regress/eng_worker.js` prints every path that differs between the Worker and the page (at most 40 each, `$id` numbers left out), not only the first. It also waits until the last patch is in before it compares. |

Nothing in the plant model or the logic changed.

## Result

- Gate on the Worker: ALL PASS. 20 plant min at 150 MW, MW moved 0.02, MSP 0.14, drum level 2.20 mm, MST 0.37 °C. SAVE / LOAD, sheet order and the same run twice all pass.
- Gate on the page engine (`GATE_WORKER=0`): ALL PASS.
- `eng_worker`: the TCS nets difference is gone. 2 checks still fail (below).

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | `eng_worker` DITL: `W.live` is false in the Worker and true on the page after the plant is paused, also after a 2 s wait. The pause turns the world off in the Worker, but that change does not reach the page mirror. | Trace the patch of `dgW live` after the pause (eng-host world timer, `E.send` wait / owed). Jennie, src/world. |
| F2 | `eng_worker` ABC: the values are equal (no path differs once `$id` is left out), but the `$id` numbering of the shared objects differs from `AN_UNIT.asF` on. One side shares an object that the other side copies. | Find the object that is shared on one side only. Rosé with Jennie, engine / mirror. |
| F3 | `reset_worker`: 5 checks fail, as on beta.273. Reset is not equal to a fresh page on BOTH engines (ABC transmitter `sens`, DITL nets of DITL-03E / DITL-33), so this is not a Worker-only fault. | Fix Reset to clear what a fresh page does not have. Separate item. |
| F4 | Part load (headless, this session): with the operator trim action of `unit_load.js` (O2 trim neutral 50 % while the drawing forces it MANUAL), main holds 75 MW (coal 48–53 t/h vs plant 47–51, bed 861–871 °C vs plant 855–909) and 90 MW (coal 54–60). The swing and loss of the unit seen at 75 MW came from a probe with no operator. | No model change. Probes at part load must include the operator trim action. |
| F5 | A bed law with solids heat in proportion to √(density) gives the FHI Fig 8 exit gas at 105 MW (788 vs 778 °C), but a wider coal swing and a colder bed at 75 / 90 MW (bed 811–838 °C), even with the operator. | Not used. The part-load exit gas (about +55 °C at 105–127.5 MW) stays open. |

## Tested

- `node tests/gate/behaviour.cjs` on the Worker and with `GATE_WORKER=0`.
- `node tests/regress/eng_worker.js` (twice) and `node tests/regress/reset_worker.js`.
- `npm run check` SAME.
