# LMYP OTS 1.0.0-beta.238

21 Nov 2026. NO SOP, engine and tools part (user "Go no sop"; Jennie).

## Changed

| Area | What changed for the operator |
|---|---|
| Plant | The SOP score no longer runs inside the plant scan (engine/sop-score.js and its anSopStep call removed). Nothing in the engine reads or judges the plant against an SOP |
| Tools and tests | The training tools (SOP extractors, guided runs, checkpoints) and the SOP / training dock tests are removed. The operator text check moved to tools/ui-audit and now walks all operator pages |

## Tested

Build, `npm run check`, operator text check, and the 150 MW behaviour gate (20 plant minutes, SAVE / LOAD, same run twice) headless.

## Not tested / open

The regress tests that called the removed guided Training (LS_GUIDE.A) now call a test-only helper (tests/regress/top.js) that writes what the faceplates write; the two tests of guided steps are removed. Some of those tests still open plant pages of before the HX look and fail there (a UI test matter).

The UI side of NO SOP (Instructor SOP scoring, training dock) is a separate change. No live clicks on this version.
