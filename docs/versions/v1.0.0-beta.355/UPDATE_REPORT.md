# v1.0.0-beta.355 (ROSÉ, 2026-11-22, brought onto main 2026-11-24; first made as beta.277)

## What was wrong
`tests/regress/eng_worker.js` compares the whole state of the Worker engine with the page mirror after a pause. Two differences were found:

| # | Where | Worker | Page mirror | Cause |
|---|---|---|---|---|
| 1 | ABC unit state, key `el` | no `el` | `el: { l52: true }` | `anElec()` (`src/analog/engine/elec.js`) is a read for the panels (shell, home, station, instructor), but it created `U.el` on the page. This shifted the `$id` numbering of everything after it (`asF` and on). |
| 2 | DITL net values `nl._v` (e.g. TCS-TCE-23) | `[]` | `null` | The sync slot `dn` sent an empty array as `''`, and the mirror decoded `''` as `null` (`src/analog/engine/sync.js`). |

## Fix
1. `anElec()` reads `U.el || { l52: true }` and no longer writes `U.el`. The unit step (`anElecStep`) still creates it in the engine.
2. The slot `dn` sends `null` for no array, and the mirror decodes `null` → `null` and `''` → `[]`.

## Test (PC, file://, Worker)
- eng_worker: "ABC state: worker = page mirror (469 kB)" PASS (it failed before). The one DITL difference left is `W.live`, which Jennie is fixing.
- reset_worker: 5 failures, the same 5 as on beta.275 main. That is a separate Reset finding (still open, recommendation: compare a fresh-page Reset per key, as done here).
- `build.js --check` SAME, version check, operator text check.
