# LMYP OTS 1.0.0-beta.247

22 Nov 2026. The plant page froze for about 3.7 s after a switch from Engineer to Operator (profile by Jennie). Fix by Rosé.

## Changed

| Area | What changed for the operator |
|---|---|
| Page open | The page was drawn twice per open: once when the Plant view opened and again by the Fit of the bar 250 ms and 900 ms later (3.8 s in all). A page already drawn at the same size is now only fitted; it is drawn again only when the page or the size of its area changed |
| Word size (11 px floor) | Every word was read right after the size of the word before it was written, so the browser laid the page out again for each word (2.1 s). The words are now read in one pass and written after it, and the first tick of the page does not repeat the pass done when the page opened |
| Word plates and click boxes | The plates behind the words (1.4 s) and the click boxes of each item were measured and written one by one. They are now all measured first, then written |

Nothing in the logic, the plant model or the drawing changed.

## Tested

Build `--check` SAME, version check, operator text check. Real click on the PC at 150 MW (the long tasks of the browser read after each click):

| Step | Before (profile) | Now |
|---|---|---|
| Engineer to Operator (lands on the overview) | about 3.7 s frozen | 322 ms, then 238 ms on a second switch |
| Overview tile to the Condenser and condensate page | | 238 ms, values shown at once |
| Click on a valve name (Flash spray 1) | | its faceplate opens (the grown click boxes still work) |
