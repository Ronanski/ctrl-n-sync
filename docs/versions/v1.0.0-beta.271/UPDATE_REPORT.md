# v1.0.0-beta.271 Update report

## Fixed
- **The Web Worker engine stopped at start.** With the Worker on (the default on the Beta and Stable web sites, or `?worker=1`), the Operator start at 150 MW stopped the Worker at once: `TypeError: Cannot convert undefined or null to object` in `anCdTagStep` (src/analog/engine/unit.js). The Worker runs that tag step first, before any other tag step has made the unit's table of transmitters (`U.tt`). The page then showed the red "Engine stopped" bar and ran the engine on its own thread. The step now makes the table when it is missing, the same guard as every other tag step. The engine itself is unchanged: on the page thread `U.tt` already existed, so nothing changes there.
- **F6 (60 fps rule Q6), the plant page clock.** The one clock that moves the parts of an HX page (hx-core.js, beta.267) also ran while the overview or a logic / library tab covered the plant page. It now waits until the plant page is shown again; the parts then go on from the present time.

## Tested
- Build, build --check (SAME), version-check, operator-text-check, TCE checks.
- The Worker, headless Chrome, `?worker=1`, Operator start: beta.269 ends in `ENG.mode` "local" with the error above in `ENG.err`; this beta runs "mirror" with no error.
- Timing, headless Chrome, 1280 x 800, 150 MW, 6 x CPU slow-down, plant in RUN, two 5 s windows:

  | Screen | beta.269 (page engine) | this beta (Worker) |
  |---|---|---|
  | Operator overview | 12.4, 12.7 | 68.3, 84.0 |
  | Engineer, ABC logic sheet | 12.3, 13.5 | 73.3, 76.1 |
  | Engineer, DITL logic sheet | 13.4, 16.7 | not run |
  | Drum and superheaters (HX) | not run | 17.1, 18.6 |
  | Furnace and flue gas (HX) | not run | 30.3, 37.8 |

  With the plant paused every screen above runs 95 fps or more at 6 x.
- The moving parts of the Furnace page still move after this beta (a flow line read -10, -16, -2 px at 0, 0.33 and 0.66 s; the dash pattern repeats).

## Findings
- F6 (open): with the plant in RUN at 6 x, the HX pages are still under 60 fps (Drum 17 to 19, Furnace 30 to 38). A profile of the Drum page in RUN shows the main thread busy all the time: the mirror of the Worker's changes (`anSyncApply`, `anSyncState`, `anSyncPatch`, about 0.95 s of each 5 s), the HX clock (about 0.47 s, most of it the styles the browser works out again after the values changed), whole-page `querySelectorAll` calls (about 0.24 s) and the paint of the large drawing (about 0.7 s of each 4 s). Tried and dropped: moving the clock to the next frame (no gain, one run worse). Recommendation: profile the HX value tick in RUN (which writes change each scan), send the Worker's changes for the page that is shown only, and find the whole-page searches.
- F6 (open): with the Worker off (the apk, the exe and file://), every screen in RUN is about 12 to 18 fps at 6 x, because the engine runs on the page thread. Recommendation: test the Worker on the apk and the exe, then make it their default too (user's "GO STABLE" rule for those copies).
- Worker (fixed here): the Beta and Stable sites started the Worker by default, so on those sites the Worker most likely stopped at the Operator start and the red bar showed. Recommendation: check the Beta site once after this beta (no red bar, the mode label says WORKER).
