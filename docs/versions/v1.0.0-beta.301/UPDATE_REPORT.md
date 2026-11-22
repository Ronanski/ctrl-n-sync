# v1.0.0-beta.301 (ROSÉ, 2026-11-22)

apk test of the user (2026-11-22): "kala ko naayos na mga text nito?" The words of the hx pages crossed each other on a 1280 x 800 tablet.

## Cause

On a touch screen the Operator Station fits the whole page (beta.295), so the drawing is drawn at about 0.6 there. Each word grows to the 11 px minimum, about 18 drawing units, but the lines of one label stayed 14 units apart (the room of a 12.6-unit word), and some pages had labels placed too close for words of that size.

## Changed

- `src/ui/plant/hx/hx-core.js`: each line of an item's label is placed in its own row (`g.hx-row`). On a touch screen of the station, `spread()` moves the rows apart by the real size of their words, away from the symbol. The words stay 11 px; nothing gets smaller. A mouse screen keeps the drawing as planned.
- `hx-page-sea-water.js`: the booster pumps are 230 units apart (their status lines crossed). The tube cleaning pumps moved left. The note on the cleaning balls sits above them. The discharge line ends earlier so its name stays in view.
- `hx-page-condensate.js`: the condensate pumps carry their words below. The pump outlet and temperature readings moved apart. The polisher valves moved up, with their words on the left, and the polisher flow reading sits above the branch. The flow and pressure readings to the deaerator moved apart.

## Result (headless, 1280 x 800 touch, full-load save; crossings of the ink of two words)

| | Before | After |
|---|---|---|
| All 22 pages | about 240 | 65 (76 with the row spacing only, then the two pages re-placed) |
| Sea water | 16 | 0 |
| Condensate | 19 | 0 |
| Smallest word | 11 px | 11 px |

Mouse screen proof (pf2: D1-D10, A4): 11/11 PASS at 1920 and at 1280.

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | The other pages still have crossings at the tablet size (Drum and superheaters 10, Reheat 7, Purge and trip 7, Unit overview 6, Sampling 6, Turbine 6, Feedwater 5, others fewer). | Re-place them the same way in the next Betas, worst first. |
| F2 | The mode badge ("Manual") keeps its 50-unit pill while its word grows to 11 px, so on the tablet the word runs past the pill. | Size the pill from its word in the same pass. |

## Tested

- `npm run build`, build `--check`, `operator-text-check`.
- ov.js (22 pages, touch 1280 x 800), screenshots of Sea water and Condensate checked by eye; pf2 at 1920 and 1280 (mouse).
