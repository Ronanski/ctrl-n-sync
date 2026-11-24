# v1.0.0-beta.303 (ROSÉ, 2026-11-23)

apk test of the user (2026-11-22): "kala ko naayos na mga text nito?" On a 1280 x 800 tablet the words of the HX pages still ran into each other. Coordinator: no smaller text; keep 11 px and place the labels so nothing overlaps.

## Cause

On a 1280 tablet the whole page is drawn at about 0.685 scale, and the 11 px minimum makes every word about 1.3 to 2.4 times the size the page was planned for. Labels planned 14 units apart, side by side in narrow columns or close to a neighbour then crossed. beta.301 fixed the line pitch inside a label and two pages; this release places the labels on every other page.

## Changed (layout only, text stays at 11 px)

| Page | Change |
|---|---|
| Drum and superheaters | spray valves and block valves moved apart; feedwater link and spray water tap moved; split-range notes in two short lines each |
| Reheat | taps moved; three valve names wrapped; block valves and LP spray tap moved |
| Unit overview | small back pass names three kinds of bank only (`few`); boiler page links moved to a second column beside the gas page links (were cut at the left edge); feedwater flow tap lower; "Turbine master, MW" in two lines (was cut at the right edge) |
| Purge and trip | small back pass (`few`); purge permissive state without the repeated name; two shorter step names; notes moved above the primary air line; primary air tap moved |
| Feedwater | pump B 20 left; suction taps lower; cold reheat link and extraction 2 pressure tap moved |
| Turbine start | unit load demand, load change rate and turbine master in one column between the values and the trip list (were under the trip list, over step 7); MW in the name; two shorter step lines; turbine oil link moved |
| Sampling | long analyzer names on their own line (`vstack`); dosing 70 lower (drawing 1000 high); notes spaced |
| Ash | four bottom-ash values two by two; right notes in three lines (were cut); shorter gas link |
| Make-up and cooling | make-up pump names in two lines; users note in six shorter lines |
| Turbine oil | bearing 3 / 4 tap names shorter; two notes moved |
| Extraction | exhaust pressure name shorter, taps 20 left; flash pipe note above its line |
| Auxiliary steam | header taps apart; exhaust hood line end shorter (was cut) |
| Diesel oil and burners | pumps 235 apart (were 190); supply valve moved; OIL MASTER buttons wider; hot secondary air link moved |
| Coal | trains 340 apart (were 310); boiler pressure unit in the name |
| Combustion air | primary air inlet vane left; lube oil pump B right |
| Furnace and flue gas | furnace pressure unit in the name |

Core: `hx-real.js` back pass option `few`; `hx-core.js` item option `vstack` (a value name longer than 12 letters on its own line); `hmi-mock.js` an empty label of a permissive state shows the state alone.

## Result (headless, touch 1280 x 800, station built from this branch, full-load save, words measured at their ink)

| | beta.299 | beta.301 | beta.303 |
|---|---|---|---|
| Words crossing words, all 22 HX pages | about 240 | 65 | 0 |
| Smallest word | 11 px | 11 px | 11 px |
| Words cut by the page edge (seen on screenshots) | several | several | 0 found |

Every page was also looked at on its screenshot.

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | The mode pill ("Remote", "Manual") keeps its size while its word grows to 11 px, so the word is wider than its pill on the tablet (open since beta.301). | Next pass: size the pill from its word on the station touch screen. |
| F2 | A few words still sit over a line or a casing (Diesel oil: "100.0 %" of the supply valve on the burner oil line; Unit overview: "superheater" across the back pass middle wall). They do not cross other words. | Leave; move them if the user finds one hard to read on the tablet. |
| F3 | The probe measures words against words only; a word over a symbol is found by eye on the screenshots. | Keep the screenshot check of every page with each label change. |

## Tested

- build `--check` SAME, `operator-text-check` ok.
- Overlap probe on all 22 HX pages at 1280 x 800 touch: 0.
- Proof script pf2 at 1920 and 1280: 11 / 11 PASS each.
