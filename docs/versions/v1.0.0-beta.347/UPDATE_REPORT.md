# v1.0.0-beta.347 (ROSÉ, 2026-11-24)

Audit #6: the bottom-left Instructor button of the station becomes the Plant menu, and the instructor freeze is removed because Pause already holds the plant.

## Changed

| Part | Change |
|---|---|
| Station rail (`station.js`, `station-frame.css`) | The button reads "Plant menu" (the rail already has a Plant / Turbine switch at the top, so a bare "Plant" would read twice). The popup is titled "Plant menu": starting point, save points, trips, faults, the same controls as before. The Freeze part is gone. Event log words from this menu read "Plant menu: ...". |
| Run (`trace.js`) | Run no longer checks the freeze; Pause and Run work as before. |
| Engine | `engine/instructor.js` renamed to `engine/fault-groups.js` (`order.list` updated). It keeps only the fault groups; `AN.freeze` / `AN.frz` removed. One path, no copy. |
| Test | `tests/regress/instructor.js` renamed to `tests/regress/fault_groups.js`; the freeze checks removed. |

## Tested

- build `--check` SAME, `operator-text-check` ok.
- `tests/regress/fault_groups.js`: 4 / 4 PASS (34 faults, each in one group).
- Real clicks on the station built from this branch, 150 MW: Plant menu opens with Starting point, Save points, Trips, Faults and no Freeze; Save now keeps a save point; Run and Pause on the top bar work. No page error (the only console errors are version.json and the service worker, not served by the local test server).

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | The old shell's Instructor console (`shellc-ins.js`) still says "Instructor". | Leave: it is the old shell, not the station; rename only if that shell comes back. |
