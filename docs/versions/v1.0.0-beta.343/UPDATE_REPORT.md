# v1.0.0-beta.343 (ROSÉ, 2026-11-23)

The old-save test (`tests/regress/fa_old_save.js`) now checks the combustion air page of the new HX pages. It looks for the fan B current and both fan flow loops (FICFA1055A, FICFA1055B) on that page. Before this, it checked the old page, which has been removed.

## Changed

| Part | Change |
|---|---|
| `tests/regress/fa_old_save.js` | Checks the HX combustion air page in place of the removed old page. |

No change to the plant, the logic or the screens.

## Tested

- `tests/regress/fa_old_save.js`: ALL PASS.
