# v1.0.0-beta.297 (ROSÉ, 2026-11-22)

apk test of the user (2026-11-22): "my onting delay s response ng mga pindot".

## Cause

When a faceplate opened, the page placed it beside its equipment by reading every line near the equipment at one point per 6 screen px (`getPointAtLength`, up to 400 points per line). It did this again each time the faceplate grew in its first 2 s. On a tablet (CPU 4x slower, 1280 x 800 touch), that was the 0.3-0.4 s freeze after each press: placeC took 1.6 s of a 3-press profile.

## Changed

- `src/ui/shellc/shellc-pages.js` pipePts: one point per 12 screen px, at most 150 per line. Each point counts twice as much, so the score keeps its scale.
- placeC: the lines around the same equipment are read once per opening and reused while the faceplate grows.

## Result (headless, 1280 x 800 touch, CPU 4x slower)

| | Before | After |
|---|---|---|
| Faceplate shown after the press | 67-155 ms | 59-128 ms |
| Page busy after the press (long tasks) | Air heater 61 + 281 + 286 ms; PIC-COBM 107 + 442 + 391 ms | Air heater 67 + 164 ms; PIC-COBM 130 + 142 ms |
| placeC in a 3-press profile | 1598 ms | 372 ms |
| A4 (faceplate never covers its equipment) at 1280 | PASS | PASS, 0 % covered on 5 items |

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | About 100-150 ms of each press is still the regular 0.5 s scan of the page (tick, interlock, Y / N), at 4x slower CPU. | Measure on the user's tablet with the fps readout (beta.295) before more work. |

## Tested

- `npm run build`, build `--check` SAME, `operator-text-check` ok, version check.
- Touch latency probe and CPU profile (Playwright, CDP); proof script pf2 at 1280, 11/11 PASS.
