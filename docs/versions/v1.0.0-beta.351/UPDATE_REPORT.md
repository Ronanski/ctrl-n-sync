# v1.0.0-beta.351 (ROSÉ, 2026-11-24)

Audit #6, part 2. The old shell's Instructor console (`src/ui/shellc/shellc-ins.js`) was still in the build through `src/ui/shell/inject.js`. The station Plant menu (beta.349) holds the same controls, so the old console is removed. One path only, no fallback.

## Changed

| Part | Change |
|---|---|
| `src/ui/shellc/shellc-ins.js` | Deleted. |
| `src/ui/shell/inject.js` | No longer reads it. |
| `shellc.css`, `shellc-bars.css` | The console rules (`#scins`, `.pill.ins`) removed. The alarm list keeps its height rule (it ends above the footer). |
| `shellc-bars.js`, `shellc-details.js` | No lookup of the console pill or panel. The More button's title no longer names it. |
| `engine/unit.js` | The refusal text for a load change with 52L1 open now points to "Plant menu, Trips" (was "Instructor console, Grid"). |
| `tests/regress/shellc.js` | The console steps removed. The turbine-trip check now calls the engine command `AN.turbine('trip')`, the same call the Plant menu makes. |

## Tested

- build `--check` SAME, `operator-text-check` ok, all 17 scripts of the html parse.
- The built html holds no `#scins` and no Instructor pill.
- `tests/regress/shellc.js` was not run here because the PC was in use; the sim-tests workflow runs it.

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | A few code comments in the old shell (app.js, shellc-compact.css, shellc.css) still name the Instructor console in their history notes. | Leave: they are history notes, not app text. |
