# Phase 6 DCS: ABC-009A ash cooler select follows the coolers' AUTO (2026-11-26, 8:50 PM PHT)

## What was wrong
ABC-009A 4-leg switch B32 (output SI0199) selects its leg by the conditions written beside it:
- "(1) IF A-ASH COOLER AUTO ( M.021A ) SELECT to a"
- ...
- "(4) IF D-ASH COOLER AUTO ( M.021D ) SELECT TO d"

No sheet in the app makes M.021A ~ D. So the engine read the conditions as user settings, which were 0, and the switch stayed on leg a.

## Source
Memory list 101 names them:
- M.021A "A-ASH SCREW COOLER CTRL AUTO ONLY (FIRST AUTO)";
- M.021B ~ D "B ~ D-ASH SCREW COOLER CTRL AUTO ONLY".

DERIVED from these names: each condition is "speed control SICL1060A ~ D in AUTO", meaning its .MAN status is 0. The first one in the order A ~ D wins, as the 4-leg switch already takes the first condition that is on.

## Fix
- `src/analog/engine/audit-fix.js` ABC-009A-4: a q4sig with `auto: SICL1060x`.
- `src/analog/engine/plant.js`: the 4-leg switch reads that condition from the .MAN mode wires of the tag (engine/ctrls.js), once every sheet is loaded.

## Correction of an earlier note
Earlier I wrote that the switch was evaluated only when its own wires change. That was wrong. The engine scans the whole sheet. The real reason is that ABC-009A scans at 1.0 s (the slow DCS cycle), and my first test read the leg after only 0.6 s. No block type has an event-only evaluation, so nothing else needs this fix.

## Tested
New test `tests/lanes/boiler/ash-cooler-select.cjs`, from the 150 MW start, reading the leg after 2 s:

| Coolers in AUTO | Leg |
|---|---|
| none (as at 150 MW, snapshot 16.PNG all MANUAL) | a |
| C | c |
| B and C | b |
| A, B and C | a |
| D only | d |
| none again | stays d |

At 150 MW nothing changes, because all four coolers are MANUAL.

Not tested: the live app.
