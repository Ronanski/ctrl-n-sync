# LMYP OTS 1.0.0-beta.245

22 Nov 2026. Two fixes from the real-click test of beta.242 (Rosé) and the Condensate faceplate titles.

## Changed

| Area | What changed for the operator |
|---|---|
| Esc with the Event log open | One Esc closed both the Event log and the faceplate under it. The Event log is the top window now: the first Esc closes only the log, the next Esc closes the faceplate (motor / valve faceplates and the controller faceplate) |
| Faceplate reason line | In the compact look the reason line was cut at one line ("START not permitted: no blowing permis..."). It shows up to three lines now; a longer text still opens in full with a click |
| Condensate faceplate titles | The MV-MU1001 faceplate still said "Make-up to the hotwell". It now says "Make-up bypass, 8-inch (operator)", and LICCD1110A says "Hotwell level valve LCV-MU1110 (ABC-031)", the same as the page labels of beta.244 (K1AU3-PD-016 Rev D zone A-7) |

## Tested

Build `--check` SAME, version check, operator text check. Real click on the PC at 150 MW, Engineer mode:

| Check | Result |
|---|---|
| Condensate page labels "Make-up bypass valve" and "Hotwell level valve, ABC-031" | Shown |
| MV-MU1001 faceplate title | "Make-up bypass, 8-inch (operator)", MV-MU1001 · DITL-60 |
| Faceplate open, Events link, Esc | Log closed, faceplate stayed; second Esc closed the faceplate |
| N-1011 faceplate while running, no blowing permissive | Full reason in three lines: "START not permitted: no blowing permissive (steam supply valve open 600 s, both drain temperatures above 220 C)" |

## Findings (not changed here)

| Finding | Recommendation |
|---|---|
| Opening a plant page or leaving the logic view shows "-----" values for about 4 s at 150 MW | Jennie: read the values once on open, not only on the run tick |
