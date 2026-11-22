# v1.0.0-beta.265 Update report

## Fixed
- A hidden layer was being drawn under every HX page. Each HX page keeps a hidden holder of its click targets and value reads (hx-app.js). That holder was laid out as a 10 x 10 page scaled 91 x, with a 1920 x 914 backdrop, so a single Y letter was about 1500 px tall under the HX view. Nothing showed, but the browser did that work on every page. The holder now has no backdrop and scale 1, and is not painted or hit by the pointer (src/ui/plant/hmi-mock.js def.bare, src/ui/plant/hx/hx-app.js). Every HX page uses the same holder, so this one change covers all of them.
- The locator map at the lower right stood over the drawing on every HX page at 1280 x 800, and covered the Fan inlet damper on the Furnace page (a click on the damper went to the map). The page outline the locator reads (shellc-zoom.js extent, the getBBox of the page) took in the hidden holder, so the page never counted as fully in view. The holder now sits inside the frame (8, 24), the outline is exactly the frame, and the map stays hidden when the whole page is in view.

## Tested
- Build, build --check, version-check, operator-text-check.
- Retest of beta.263 (real clicks, 1280 x 800, 150 MW, Operator), all pass:
  - #9: the Furnace Y squares are 11.1 px.
  - Page menu: a click on the visible title opens the menu.
  - F3: on the scrolled Furnace page, the Fan inlet damper faceplate sits at y 128 to 752 inside the 800 px window, beside the damper. A click on the visible name also opens it.
  - #14 Generator: Power factor and Bearing 3 each open their own faceplate beside the value, not over it.
- Timing, headless Chrome, Furnace page, 1280 x 800, plant paused, old (beta.263) against new: 60.2 / 60.1 fps at normal CPU; 5.2 to 5.6 / 5.6 to 5.8 fps at 6 x CPU slow-down. Same speed: the holder was not the cost. The 6 x figure is far under the 60 fps rule (F6 below).
- Sweep of all 22 HX pages, headless, 1280 x 800: the locator map stood over the page on 22 of 22 (old) and on 0 of 22 (new); the holder was 5795 to 21078 px wide (old) and is 64 to 231 px (new); the page outline equals the frame on every page; no page errors.
- Real clicks, 1280 x 800, new build: on the unscrolled Furnace page the Fan inlet damper opens its own faceplate (y 128 to 752, beside the damper); Generator Power factor opens its own faceplate below the value; the page menu opens from the title.

## Findings
- F4 (fixed here): the hidden holder of the HX pages was drawn scaled 91 x (found in the beta.263 retest, Furnace page).
- F5 (fixed here): the locator map covered the drawing at the lower right of every HX page at 1280 x 800 (Fan inlet damper not clickable on the unscrolled Furnace page).
- F6 (open): at 6 x CPU slow-down the Furnace page runs 5 to 6 fps in headless Chrome, both builds (60 fps at normal CPU). Headless has no GPU, so the real figure is likely higher, but it is far from the 60 fps at 6 x rule. Recommendation: profile one HX page at 6 x (the 500 ms hx tick and the 2 s minText pass first) and fix the biggest cost.
