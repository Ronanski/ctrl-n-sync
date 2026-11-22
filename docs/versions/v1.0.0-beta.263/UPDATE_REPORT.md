# v1.0.0-beta.263 Update report

## Fixed
- F3: a faceplate opened on a scrolled page stays inside the window (src/ui/plant/fp-pop.js, src/ui/shellc/shellc-pages.js).
- Controller faceplate title (beta.261): a name with "ss" lost those letters ("Superheater pass damper" read "Superheater pa damper"). The space clean-up of the name used a wrong pattern (src/ui/plant/plant.js).
- Audit 3 #9, 11 px floor: the Y / N letters in the squares on the pages read 7.6 px at 1280. A square that was still hidden when the size rule ran (no Y / N yet) was skipped, and a paused plant runs no later check. The rule now reads the scale from the drawing around the square, so every square gets its size when the page opens (src/ui/plant/hx/hx-core.js minText). The Y / N marks in the lists are 11 px (were 10.5 px, hx.css .hx-ynb).

## Tested
- Build, build --check, version-check, operator-text-check.
- Real-click test 2026-11-22 at 1280 x 800, 150 MW, Operator:
  - #9: the Furnace page keeps its 0.8 scale and scrolls to the precipitator and the fan; every word on it is 11 px or more, except the two Y squares (7.6 px, fixed here).
  - #14: Fan inlet damper and Superheater pass damper each open their own faceplate beside the item, not over it.
- This change waits for its real-click retest when the PC is free.

## Findings
- F1 (fixed here): "pa damper" in the controller faceplate title.
- F2 (fixed here): the Y / N letters at 7.6 px at 1280.
- F3 (fixed here): at 1280 x 800 with the page scrolled down, the controller faceplate of the Fan inlet damper reached 69 px below the window (bottom 869 px). Both placers (fp-pop.js area / placeNew / keepIn and shellc-pages.js area) now count only the part of the page the window shows, and a faceplate taller than that scrolls inside itself.
- Page menu at 1280: one click by screen position did not open it. The menu button (shellc-home.js .scpgb) has no rule that depends on the window width, and the same test run had other screen-position clicks land on the next item, so the click most likely missed the button. To check in the retest with a click on the button itself.
