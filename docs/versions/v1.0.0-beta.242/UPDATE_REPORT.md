# LMYP OTS 1.0.0-beta.242

22 Nov 2026. Operator fixes from the live test of beta.240 (Rosé, findings 1 to 3) and the alarm priority on screen.

## Changed

| Area | What changed for the operator |
|---|---|
| Page route | In the Operator mode only the first page of each overview block could be reached (no way to the Sootblowers page). The page name in the breadcrumb is now a button: it opens the list of every plant page, grouped by the overview block that holds it. "Plant" goes back to the overview. Esc or a click outside closes the list |
| Event log | The Event log had no close button and Esc did not close it (a key handler of the app stopped the key first). It has a Close button now, and Esc is caught before the app's handlers |
| Sootblower START | A blower START without the blowing permissive did nothing and said nothing. The faceplate now says "START not permitted: no blowing permissive" (DITL-80A out row 21: steam supply valve open 600 s, both drain temperatures above 220 C) while it is missing. The press still goes to the logic. Any push-button faceplate whose START the logic does not take within 3 s now says so instead of staying silent |
| Alarm priority | Each row of the alarm list and of the overview alarm tile shows its priority: EMERGENCY, HIGH, MEDIUM or LOW (AN.almPri, ISA-18.2, from the set points of the plant alarm list). The alarm list sorts by Newest or by Priority (emergency first, newest first inside each) |

## Tested

Build, `npm run check`, regress. The real-click test of the four changes follows when the PC is free.

## Findings (not changed here)

| Finding | Recommendation |
|---|---|
| PIST10012 / 10013 HIGH alarms stand at the 150 MW start | Jennie: check the start values against the alarm set points |
| The Reheat page showed "-----" when first opened while paused | Jennie: read the values once on open, not only on the run tick |
