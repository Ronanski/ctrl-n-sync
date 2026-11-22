# v1.0.0-beta.305 (ROSÉ, 2026-11-23)

User 2026-11-22: "dpat kasi scalable lahat pra kht anong screen size". The HX pages must read well on a phone, a tablet and a desktop, with no word over another word and no word cut by the drawing edge.

## Cause

1. The whole-page fit (beta.295) ran only on touch screens. A 1280 desktop window got the wide 1400 px drawing and a side scroll; a big touch screen was fitted like a tablet.
2. The mode pill ("Auto", "Remote", "Manual") stayed 50 x 15 units while its word grew to 11 px, so on a small screen the word was wider than its pill (finding F1 of beta.303).
3. On a phone (915 x 412) the label spacing (`spread`) was off, so 1562 word pairs crossed.
4. Some words sat on top of pipe lines, and a few labels ran past the drawing edge at 1920.

## Changed

| Part | Change |
|---|---|
| Fit rule (`hx-core.js` `HX.fitWhole`, `hx-app.js`, `station.css`) | The page is fitted whole when the drawing area is at least 0.55 of 1920 x 1140, by size, mouse or touch. Smaller (phone): the drawing is 0.68 of its width and the page scrolls and pans. The fit CSS uses `body.st-fit` instead of `pointer: coarse`. |
| Mode pill (`hx-core.js`) | The pill grows with its word, from its centre; the output value beside it moves on by the same amount. |
| Label spacing (`hx-core.js`) | `spread` runs on every station screen, the phone too. |
| Loop option `mvb` | The output on its own line under the pill, for two loops side by side (furnace gas dampers, condensate LIC-CD1104 tried, then not needed). |
| Side label option `lx` | Moves a left / right label sideways (deaerator level valve). |
| Halo (`hx.css`) | The dark halo behind words 3.2 → 4.4 px, so a word over a line stays readable. |
| Furnace and flue gas | Dampers HICHR1002A/B output under the pill; economizer 1 lower; hydraulic / damper buttons 50 up. |
| Reheat | Temperature tap moved; TICHR1002A name in shorter lines. |
| Feedwater | Cold reheat link and "to the economizers and the drum" link moved; pump B suction and its pressure tap moved. |
| Condensate | Sprays apart; pumps take suction at the side of the can; flow / pressure / temperature taps apart; deaerator level valve on the riser to the deaerator, its name and mode to the left (was cut at the bottom edge). |
| Compressed air | Long note in two lines; line end shorter; dryer labels up. |
| Sampling | Pump B suction lower. |
| Unit overview | The five coordinated control loops 30 left. |
| Limestone and sand | Analyzer value moved; equalising air valve name to the right. |
| Turbine oil | Pump B riser clear of pump A; bearing oil note moved. |

## Result (headless probe on the station built from this branch, full-load save, all 22 HX pages)

| Screen | Words crossing words | Words cut by the drawing edge |
|---|---|---|
| Phone 915 x 412, touch | 1562 → 0 | page scrolls by design |
| Tablet 1280 x 800, touch | 0 | 0 |
| Desktop 1280 x 800, mouse (now fitted whole) | 0 | 0 |
| Desktop 1920 x 1080, mouse | 1 → 0 | 3 → 0 |
| Big tablet 2400 x 1500, touch | 1 → 0 | 0 |

Smallest word 11 px on every screen. Words over a pipe line: 23 → 8 at 1280 touch; the rest are short values beside their own tap and read on the halo.

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | On the phone the page does not fit whole; the drawing is 0.68 of its width and the user pans. | Keep: whole fit on a phone makes the words too big for the drawing. Use landscape. |
| F2 | 5 to 8 short values still sit over their own line (for example a tap value next to its tap). | Leave; they read on the 4.4 px halo. Move one if the user finds it hard to read. |
| F3 | Turbine oil: the two pump risers run close and parallel. | Next pass: space them 20 apart if the page is reworked. |
| F4 | The probe checks words against words, pipes and the drawing edge; a word over a symbol is still found by eye. | Keep the screenshot check of every page with each label change. |

## Tested

- build `--check` SAME, `operator-text-check` ok.
- Overlap probe, all 22 HX pages, 5 screen sizes: 0 overlaps.
- Screenshots of the changed pages checked by eye at 1280.
- Proof script pf2 at 1920 and 1280: 11 / 11 PASS each.
