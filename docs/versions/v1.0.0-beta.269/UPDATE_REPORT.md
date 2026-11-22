# v1.0.0-beta.269 Update report

## Fixed
- F6, part 3 (60 fps rule Q6): the faceplates and the right pane do less work each tick.
  - **Faceplate texts.** The pop-out faceplates (src/ui/plant/fp-pop.js) tick twice a second. They wrote 32 texts on every tick (state, value, mode, current, the "why closed" line) even when the text had not changed. Each such write made the page lay out again. They now write only on a change (`setTx`).
  - **Right pane button search.** The right pane tick (src/ui/hmi/hmi.js) searched every button of the page 4 times a second to find the Panel / Inspector button. It now keeps the button it found while that button is still in the page and still says Panel / Inspector. The pane's display is written only when it changes.

## Tested
- Build, build --check (SAME), version-check, operator-text-check, TCE checks.
- Timing, headless Chrome, 1280 x 800, 150 MW, Operator, plant paused, 6 x CPU slow-down, Feedwater page with the faceplate of a piece of plant open (the extraction steam block valve), two 5 s windows in each of two runs:

  | Build | fps (four windows) | average |
  |---|---|---|
  | beta.267 (main) | 68.6, 74.3, 73.0, 72.5 | 72 |
  | beta.269 | 85.5, 80.9, 79.5, 73.2 | 80 |

  The faceplate stays above 60 fps at 6 x in both; this beta takes about a tenth less time per frame.

## Findings
- F6 (part 3, open): the logic sheets (DITL / ABC) are not profiled at 6 x yet; this beta changes no logic sheet code. Recommendation: profile one large DITL sheet in RUN at 6 x next, the same way, and fix its biggest cost if it is under 60 fps.
- F6 (open): the 60 fps rule is measured headless only. Recommendation: check it once on the real tablet and phone in the next live test.
