# LMYP OTS 1.0.0-beta.278

22 Nov 2026. A pause in the Worker reaches the page again (`W.live`). By Jennie.

## Changed

| Area | What changed |
|---|---|
| Engine (Worker) | `src/world/eng-host.js`: the plant tick keeps `lastLive` = `WORLD.live` after each patch it sends. While the plant runs, the plant tick scans the DITL world and the world timer returns early (`WORLD._drvT`), so the timer never saw `live` true. Its `lastLive` stayed false from before RUN, and at the pause (true → false) it saw no change and sent no patch. The page kept showing the world live. |

Nothing in the plant model or the logic changed.

## Result

- `eng_worker` (2 runs): DITL state Worker = page mirror now passes (beta.276 F1 closed). Only the ABC `$id` / key order check fails (beta.276 F2, Rosé beta.277).
- How it was found: a probe hooked every write of `WORLD.live` on the page and read the Worker radio state at the compare. No patch came after the pause (0 writes on the page), and the Worker had `live` false with nothing owed.

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | A short probe (Start at 150 MW, pause) did not show the fault: a plant tick that sent a patch after the world went off carried it by chance. The fault needs the longer run of `eng_worker`. | Keep `eng_worker` as the check for this. |
| F2 | beta.276 F3 still open: Reset is not equal to a fresh page on both engines. | Jennie, next item. |

## Tested

- `npm run build`, `npm run check` (SAME).
- `tests/regress/eng_worker.js` twice on the built page: DITL pass, ABC fail only on F2 of beta.276.
