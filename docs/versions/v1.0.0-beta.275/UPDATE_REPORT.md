# v1.0.0-beta.275 Update report

## Fixed
- F6 (60 fps rule Q6): the Web Worker engine is now the default everywhere, also in the apk, the exe and an html opened from a folder (file://). Before, only the Beta and Stable web sites started it. With the page engine and the plant in RUN at 6 x CPU, the Operator overview ran 12 to 41 fps; with the Worker it runs 68 to 84 fps (beta.271 and beta.273 reports). It is the same engine on one path (src/world/eng-page.js). The page engine stays only as the fallback when the Worker fails (the red "Engine stopped" bar says so), and `?worker=0` or browser storage `ls-worker` = 0 still turn the Worker off. A release of the apk or the exe still waits for "GO STABLE".
- The gate check of the CI (tests/gate/behaviour.cjs) runs the plant fast with `AN.runFixed`, which only the page engine does. It now opens the page with `?worker=0`, so it tests the same page engine as before. The Worker has its own checks (tests/regress/eng_worker.js and the others).

## Tested
- Build, build --check (SAME), version-check, operator-text-check, TCE checks.
- Gate check, station build, 20 plant minutes at 150 MW: first run without `?worker=0` failed ("AN.runFixed refused (no set, loading or mirror)"); with it, ALL PASS (no trip, no page error, MW 151.00 to 151.02, SAVE then LOAD the same plant, the same run twice the same numbers).
- Worker checks, headless (they ask for the Worker with `?worker=1`, so this beta does not change what they test):
  - tests/regress/worker_cat.js: ALL PASS on this beta.
  - tests/regress/eng_worker.js: this beta 1 FAIL, beta.273 2 FAIL ("ABC state: worker = page mirror", "DITL state: worker = page mirror").
  - tests/regress/reset_worker.js: this beta 5 FAIL; beta.273 the same kind of FAIL (the ABC and DITL state after a dirty run + Reset is not the state of a fresh page, both with the page engine and with the Worker).
- Not tested: the exe and the apk themselves (no device run in this beta).

## Findings
- Worker check (open, found before this beta): the full state of the Worker and the page mirror differ in the eng_worker check, and the reset_worker check finds the state after Reset unlike a fresh page with either engine. Both fail on beta.273 as well, so this beta does not cause them. Recommendation: find which keys differ (the check prints the size, not the keys) and fix the mirror or the check; this matters more now that the Worker is the default everywhere.
- apk / exe (open): the Worker is not yet run on the apk (phone) or the exe. Recommendation: one run of each before the next "GO STABLE"; if the Worker fails there, the red bar shows and the page engine goes on, so the app still works.
