# LMYP OTS 1.0.0-beta.244

22 Nov 2026. Fix from the real-click test of beta.242 (Rosé) and the hotwell make-up labels on the Condensate page (Jennie's finding).

## Changed

| Area | What changed for the operator |
|---|---|
| Page list | Esc did not close the breadcrumb page list (a key handler of the app stopped the key before it reached the list). The list now catches Esc first; Esc closes it and the focus goes back to the page button |
| Condensate page | MV-MU1001 on the 8-inch make-up line is now labelled the operator bypass ("Make-up bypass valve"). LCV-MU1110 is labelled the hotwell level valve driven by the ABC-031 hotwell level controller LICCD1110A. Source: K1AU3-PD-016 Rev D zone A-7 |

## Tested

Build `--check` SAME, version check, operator text check. Real-click test of the Esc fix done on the PC before the handback (Esc closes the list, focus returns to the page button). The labels are text only; the real-click look follows when the PC is free.

## Findings (not changed here)

| Finding | Recommendation |
|---|---|
| One Esc closes both the Event log and an open faceplate | Rosé: close only the top window per Esc, in the next batch |
| The compact faceplate cuts the long "not permitted" line | Rosé: wrap the why line to two rows in compact mode, next batch |
| The Condensate page shows "-----" for a moment after opening while running | Jennie: read the values once on open |
