# v1.0.0-beta.345 (ROSÉ, 2026-11-24)

User 2026-11-24: "20 open p pla?" The Open Bugs UI items were checked in the real app with visible clicks; the ones still wrong are fixed here.

## Checked, already right (screenshot each)

A2, B3, B5, C4, C5, C7, C8.

## Fixed here

| Item | Page | Change |
|---|---|---|
| C6 | Auxiliary steam and vacuum | Steam seal feed valve and exhaust hood spray valve show "In service" / "Out of service" instead of a pump word. The hood spray valve shows its real opening: it opens when hood spray is on and load is under 22.5 MW (`tcs.js` `aux.hso`, read on the page as `tcs:aux.hso`). |
| C1 | Sea water, drum and superheaters, reheat, overview | Lines no longer run through words: debris filter name above the header, spray 2 risers and joins moved, warming line drain MV-AS1394 drawn with its own drain line, main steam line on the overview moved clear of the control column. |
| C2 | Extraction, feedwater, make-up, combustion air, oil, ash, furnace | Taps, hand valves and notes moved off the pump and valve state rows; long notes in two lines; page links spaced. |
| B2 | Condensate | Polisher bypass valve moved off the polisher label. |

## Result (overlap probe on the station built from this branch, full-load save, all HX pages)

| Screen | Words crossing words | Words cut by the edge |
|---|---|---|
| Desktop 1920 x 1080 | 0 | 0 |
| Tablet 1280 x 800, touch | 0 | 0 |

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | Ash: bottom ash coolers stopped and DPICFG108 in Manual 0 % at the full-load save (item B4). | Plant model owner checks the cooler start in the save; not a page fault. |
| F2 | Alarm PIST10013 stands at full load. | Plant model owner checks the first stage pressure alarm limit against the alarm list. |
| F3 | Words over their own pipe stay at 75 (1920) / 151 (1280): labels inside the boiler art and short values beside their own tap. | Leave; they read on the halo. |

## Tested

- build `--check` SAME, `operator-text-check` ok.
- Overlap probe, all HX pages, 1920 and 1280 touch: 0 word overlaps.
- Screenshots of every changed page checked by eye at 1920.
