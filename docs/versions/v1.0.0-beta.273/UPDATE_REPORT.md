# v1.0.0-beta.273 Update report

## Fixed
- F6 (60 fps rule Q6), the clock of the HX moving parts. The one clock that moves the parts of an HX page (src/ui/plant/hx/hx-core.js, beta.267) read `playState` and `currentTime` of every part on every step. A read of a CSS animation makes the browser work out the page's styles first, and after the first write of a step each next read did it again. With the plant in RUN, 42 parts move on the Drum page, and the clock took about 15 ms a step at 6 x. The clock now only writes on a step. It keeps each part's element from when the part joined; a part whose element left the page leaves at once; a part that stopped (idle) leaves at a check every 2 s. A part that joins later starts at the clock's time. The steps (0.1 s), the speed and the keyframes of hx.css stay the same.

## Tested
- Build, build --check (SAME), version-check, operator-text-check, TCE checks.
- Time in the clock, headless Chrome, 1280 x 800, 150 MW, Worker on, plant in RUN, 6 x CPU slow-down, Drum page, 5 s: beta.271 353 and 484 ms (two runs); this beta 12 and 14 ms. This figure is steady from run to run.
- Frame rate in the same set-up (two 5 s windows each):

  | Page | beta.271 (fps) | this beta (fps) |
  |---|---|---|
  | Drum and superheaters | 57.8, 74.5 / 52.0, 43.2 | 75.5, 84.3 / 73.5, 82.7 |
  | Feedwater | 86.8, 88.5 / 91.6, 97.1 | 81.6, 86.1 / 57.2, 66.3 |
  | Furnace and flue gas | 83.4, 94.5 / 74.0, 84.4 | 79.2, 96.0 / 92.4, 86.7 |

  The frame rate of one page changes a lot from run to run on this PC (Feedwater on this beta gave 23 to 26 fps in one earlier run and 90 to 95 in a later one), so only the Drum page, the one with the most moving parts, shows a clear gain. The clock time above is the steady measure.
- The parts still move: on the Furnace page a flow line read -12, 0, -6 px at 0, 0.33 and 0.66 s (the dash pattern repeats), and a fan turned.
- Sweep of all 22 HX pages, headless, 1280 x 800: no page errors; the locator map is hidden on 22 of 22.

## Findings
- F6 (open): without the Worker (the apk, the exe and file://) the engine runs on the page thread. With the plant in RUN at 6 x, the Operator overview runs 26 to 41 fps (this beta) and 12 fps in an earlier run; the profile is the engine's own steps (the plant model and the logic scan). Recommendation: test the Worker once on the apk and the exe and then make it their default as on the web sites (the user's "GO STABLE" rule for those copies); this needs no change to the engine.
- F6 (open): the frame rate of one page changes a lot from run to run on this PC. Recommendation: for the 60 fps rule, measure each page three times and take the lowest, and check it once on the real tablet and phone.
