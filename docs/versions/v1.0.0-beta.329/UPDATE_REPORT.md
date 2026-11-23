# v1.0.0-beta.329 (ROSÉ, 2026-11-23)

Jennie, finding F1 of beta.328: the practice scenarios and the Training check started the plant at 150 MW with a short-cut start that has no steady state. The plant drifted, the coordinated control fell to manual and the drum level tripped the unit at about 20 minutes.

## Changed

| Where the operator sees it | Change |
|---|---|
| Training check: every scenario that starts at 150 MW | Starts the plant the same way as **At 150 MW** in the menu: the plant's own steady state, every loop in AUTO, with the equipment line-up. |
| Practice scenarios of a control loop: "Plant in service: Start at 150 MW" | Same start (three places: the scenario step, the clean in-service state, the interlock search). |

If the **At 150 MW** start is not in the build, the old start is used as before.

## Tested

- The plant started this way held 151 MW for 25 minutes with nothing touched.
- The page loads with no error; the screen-text check is ok; the committed file is what the sources build.

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | No automatic test runs a practice scenario or the Training check from start to end. | Add one short scenario run to the test set when these screens are next changed. |
