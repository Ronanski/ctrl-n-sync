# v1.0.0-beta.295 (ROSÉ, 2026-11-22)

apk test of the user (2026-11-22): "Draggable p rin ang hmi at hndi fit ang scale ng display nya sa screen. Hnd ko rin msabe kung 60 fps pataas ito."

## Cause

- Drag: the Plant view (`plant.js`) panned its whole drawing on a drag. A realistic page (hx) sits in that drawing as one frame, so a finger slid the whole page away from its place and left an empty band (probe at 915 x 412 touch: the view moved 200 / 80 px per drag on every page).
- Fit: on a screen under 1500 px wide the frame of an hx page was the size of the area (audit C10, 2026-11-21) and the drawing kept a 1400 px minimum width (0.8 scale), so on a tablet the page was wider and taller than the screen and had to be dragged or scrolled.

## Changed

- `src/ui/plant/plant.js`: in the Operator Station a drag on an hx page does nothing (no pan).
- `src/ui/plant/hx/hx-app.js` frame(): on a touch screen of the Operator Station the frame is the whole 1920 x 1140 page, fitted into the area.
- `src/ui/plant/hx/hx-core.js` minText(): no minimum width for the drawing there. The 11 px minimum of the words stays.
- `src/station/station.css` (touch only): the Process view fills its frame; the drawing takes the room the lists and legend leave and keeps its shape; nothing scrolls. The Controls and Trends views keep their scroll.
- `src/station/station.js`, `station-frame.css`: a frame-rate readout in the top bar ("60 fps"), counted from the frames the browser draws in the last second; amber under 60.

## Result (headless, touch emulation, station built from this branch)

| Screen | Before | After |
|---|---|---|
| 1280 x 800 touch | page cut right and bottom; drag moved it | whole page in view on 4 pages; drag: no move |
| 915 x 412 touch | same | whole page in view; drag: no move |
| 1280 x 800 mouse | D1-D10, A4 11/11 PASS | 11/11 PASS (no change for a mouse screen) |

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | At the fitted scale on a 1280 tablet (about 0.6) the 11 px minimum makes some words cross their neighbours (Unit overview: Economizer 2R / 2S; Condensate: Temperature / Pump outlet, Polisher inlet valve). | Use Hide (left list) for more room now; next pass: move the crowded labels of those pages apart at the tablet scale. |
| F2 | The frame rate is shown at all times on the station. | Keep it while the apk is being tested; hide it behind Engineer later if the user wants a clean bar. |

## Tested

- `npm run build`, build `--check` SAME, `operator-text-check` ok.
- Touch probe (Playwright, hasTouch) at 1280 x 800 and 915 x 412; proof script pf2 at 1280 (mouse).
