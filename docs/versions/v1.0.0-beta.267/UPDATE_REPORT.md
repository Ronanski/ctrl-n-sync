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
- F6, part 2. Every profiled HX page now runs above 60 fps at 6 x. A style trace of the Drum page showed style work at about 38 % of the time. Two causes:
  - **Page-wide `body:has(...)` rules.** Six shell rules asked "is there an HX page / a start card / a boot card anywhere in the page". With them, any element added or removed anywhere (each page tick adds and removes some) made the browser check many elements again. The shell now sets three classes on the body when that answer changes (shellc-home.js: `schx`, `scstarton`, `scbooton`), and the six rules use the classes (shellc-compact.css, shellc-ui.css, shellc.css). Each rule keeps the weight it had, so nothing else changes. On the Drum page with the moving parts paused, style work went from 1512 ms to 25 ms per 4 s.
  - **Running animations.** Even in steps of 0.1 s, a running CSS animation makes the browser check its element on every frame. The moving parts are now paused and one 10 Hz clock moves them all (hx-core.js clock, the one shared clock of the user rule of 2026-11-01). A part that starts later (a pump started) joins the clock when its animation starts. The speed is the same: a flow line moves 6 px every 0.33 s as before.
  - The version label of the sheet bar keeps the literal form that the CI check reads (category-search.js).

## Tested
- Build, build --check (SAME), version-check, operator-text-check.
- Timing, headless Chrome, 1280 x 800, 150 MW, Operator, plant paused, 6 x CPU slow-down. In each row the first figure is beta.265 and the second is this beta:

  | Page | beta.265 (fps) | part 1 (fps) | part 2, this beta (fps) |
  |---|---|---|---|
  | Furnace | 7 to 9 | 48, 57, 58 (three runs) | 98 |
  | Unit overview | 6.4 | 49.1 | 92.9 |
  | Feedwater | 7.4 | 26.8 | 89.5 |
  | Drum and superheaters | 6.4 | 19.4 | 80.2 |
  | Turbine start | not run | not run | 103.3 |

  On the Furnace page with every timer paused, the page runs 120 fps (the moving parts alone), and with the moving parts paused it runs 117 fps (the timers alone).
- Time spent in timers over 6 s at 6 x, Furnace page: about 3000 ms before, about 300 ms now.
- The moving parts still move after part 2: on the Furnace page a flow line read 0, -6, -12 px at 0, 0.33 and 0.66 s, and a fan turned; 23 of 23 animations are on the clock.
- Sweep of all 22 HX pages, headless, 1280 x 800, after part 2: no page errors. The locator map is hidden on 22 of 22 pages (the whole page is in view), and the holder is small, as in beta.265.

## Findings
- F6 (fixed in part 2 of this beta, see Fixed): part 1 alone was still under 60 fps at 6 x on four pages:
  - Furnace: about 55 fps;
  - Unit overview: 49 fps;
  - Feedwater: 27 fps;
  - Drum and superheaters: 19 fps.

  What is left on Furnace is mostly drawing work (the moving parts and the timers each cost little alone, about half the frame rate together). Feedwater and Drum have their own costs, which are not profiled yet. Recommendation: profile Drum and Feedwater at 6 x next and fix their biggest cost. Then look at the timers that still read the layout each second (the strip measure in shellc.js, the page visibility check of the 15 Hz clock in the light pages, the locator).

  Part 2 is in this beta and the five profiled pages now run 80 to 103 fps at 6 x. Recommendation: check the 60 fps rule once on the real tablet and phone in the next live test, and profile the HMI (non-HX) pages and the logic sheets at 6 x the same way.
