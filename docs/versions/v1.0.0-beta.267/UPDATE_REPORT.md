# v1.0.0-beta.267 Update report

## Fixed
- F6, part 1. An HX page is much lighter at 6 x CPU slow-down. On the Furnace page it went from 7 to 9 fps up to 48 to 58 fps (headless Chrome, 1280 x 800, plant paused). The causes, from a profile of the page at 6 x:
  - **Moving parts.** The moving parts of the HX drawings (flows, plumes, jets, mist, fans, belts, flames; src/ui/plant/hx/hx.css) were smooth CSS animations, so the large drawing was redrawn on every frame. They now move in steps of 0.1 s at the same speed, on one shared clock: hx-core.js lines each animation up when it starts. The page is redrawn 10 times a second instead of on every frame.
  - **Unchanged values written again.** Many timers wrote a text, colour or class again even when it had not changed. Each such write made the next measure lay the whole page out again. These now write only on a change:
    - the values, states and colours of the HMI pages and of the hidden holder of each HX page (hmi-mock.js setTx / setAt);
    - the HX tick (hx-core.js);
    - the version label of the sheet bar (category-search.js), which was written twice every 0.4 s;
    - the alarm tile of the overview (shellc-home.js), which was rebuilt 4 times a second;
    - the trip, alarm and Run pills (shellc.js);
    - the locator map (shellc-zoom.js).
  - **The bar layout measure.** The layout measure of the two bars (shellc-bars.js) ran 4 times a second, the biggest timer cost. It now runs only when something outside the drawings really changed, on a resize, and once every 2 s.
  - **The 2 s check of the 11 px word floor.** It (hx-core.js minText) re-reads only new or newly shown words. A resize or a new scale still reads all of them.
  - **The VIEW lock.** It (viewlock.js) reads the controls again at once when VIEW / RUN changes, and otherwise once every 1.6 s.

## Tested
- Build, build --check (SAME), version-check, operator-text-check.
- Timing, headless Chrome, 1280 x 800, 150 MW, Operator, plant paused, 6 x CPU slow-down. In each row the first figure is beta.265 and the second is this beta:

  | Page | beta.265 (fps) | beta.267 (fps) |
  |---|---|---|
  | Furnace | 7 to 9 | 48, 57, 58 (three runs) |
  | Unit overview | 6.4 | 49.1 |
  | Feedwater | 7.4 | 26.8 |
  | Drum and superheaters | 6.4 | 19.4 |

  On the Furnace page with every timer paused, the page runs 120 fps (the moving parts alone), and with the moving parts paused it runs 117 fps (the timers alone).
- Time spent in timers over 6 s at 6 x, Furnace page: about 3000 ms before, about 300 ms now.
- Sweep of all 22 HX pages, headless, 1280 x 800: no page errors. The locator map is hidden on 22 of 22 pages (the whole page is in view), and the holder is small, as in beta.265.

## Findings
- F6 (open, part 2): this beta is still under 60 fps at 6 x on four pages:
  - Furnace: about 55 fps;
  - Unit overview: 49 fps;
  - Feedwater: 27 fps;
  - Drum and superheaters: 19 fps.

  What is left on Furnace is mostly drawing work (the moving parts and the timers each cost little alone, about half the frame rate together). Feedwater and Drum have their own costs, which are not profiled yet. Recommendation: profile Drum and Feedwater at 6 x next and fix their biggest cost. Then look at the timers that still read the layout each second (the strip measure in shellc.js, the page visibility check of the 15 Hz clock in the light pages, the locator).
