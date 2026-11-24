# v1.0.0-beta.299 (ROSÉ, 2026-11-22)

apk test of the user (2026-11-22): "bakit walang mga animations?"

## Cause

The movement of the hx pages (flow in a pipe, a running fan, pump or mill) is CSS only, and `hx.css` turned all of it off under `prefers-reduced-motion: reduce`. An Android tablet reports reduced motion when "Remove animations" or the battery saver is on, so on the tablet nothing moved. Probe at 1280 x 800 touch, plant at full load: 35 running animations with no preference, 0 with reduced motion.

## Changed

- `src/ui/plant/hx/hx.css`: the reduced-motion rule of the plant movement applies only where the body has no `st-move` class.
- `src/station/station.js`: the Operator Station sets `st-move` on start. There the movement is plant information (what runs, what flows), so it stays on a tablet with reduced motion. The browser app keeps the reduced-motion rule; alarm blinking keeps it everywhere.

## Result (headless, 1280 x 800 touch, full-load save)

| Reduced motion | Before | After |
|---|---|---|
| no preference | 35 running | 35 running |
| reduce | 0 running | 35 running |

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | At the fitted tablet scale (about 0.6) the 11 px words still cross on most pages (probe: 22 pages, about 240 crossings of the ink; worst Sampling, Ash, Condensate, Aux steam, Sea water). | Re-place the labels of each page so they stand clear at 11 px on a 1280 x 800 tablet (next Betas, worst pages first). No shrinking of words. |

## Tested

- `npm run build`, `operator-text-check`.
- Probe an.js (Playwright, hasTouch, reducedMotion reduce / no-preference) on the station built from this branch.
