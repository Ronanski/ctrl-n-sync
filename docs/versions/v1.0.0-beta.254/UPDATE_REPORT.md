# LMYP OTS 1.0.0-beta.254

22 Nov 2026. Full Audit 3 item #4 (TCS sheets as the running logic), step 1 follow-up: the 89 links left open in beta.252. By Jennie.

## Changed

| Area | What changed |
|---|---|
| Tool | `tools/data/tce_net.mjs`: an input connector now joins the output connector of the letter it names on the sheet it names. The in-connector names both, so that is the link. The sheet list printed at the output connector is the drawing's cross reference: a gap there no longer leaves the link open, it is listed as a `list` row (`--list`). A link is still "bad" when the named sheet has no output of that letter, or two of them. |
| Plan | `docs/tcs/SHEETS_AS_LOGIC_PLAN.md`: the result and the join rule of step 1 updated. |

Nothing in the app, the logic, the plant model or the drawings changed.

## Result (main at beta.252)

- Input connectors: 1,999 joined, 716 from the IBD, DCS or generator sheets, **0 left without a source** (was 89).
- In all 89 old cases the source sheet has an output of that letter. Its sheet list:
  - 62 lists are not typed (empty): TCE196 13, TCE070 13, TCE212 8, TCE143 6, TCE201 5, TCE053 4, TCA767 4, TCA371 4, TCA370 4, TCE207 1.
  - 27 typed lists leave the sheet out: TCA500 17 (A to E, to TCA539 / 582 / 583A / 584 / 767 / 768A / 831), TCA611 4, TCA631 2, TCA610 2, TCE180 1, TCA547 1.

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | For 62 links the output connector has no sheet list typed. The drawing was not read again at those places in this PR (not checked). | Type the lists from the drawing when step 2 reads those sheets. It is a cross reference only: no link or logic depends on it. |
| F2 | For 27 links the typed output list leaves out the sheet that reads it (TCA500 17, TCA611 4, TCA631 2, TCA610 2, TCE180 1, TCA547 1). | Read each on the drawing in step 2. Where the drawing's list is itself short (common on long lists), keep it as printed and keep the row. |

## Tested

- `node tools/data/tce_net.mjs --list` (above).
- `node tools/data/tce_check.mjs`.
- Build `--check` SAME.
- The behaviour gate runs in the Checks. It was not run on the PC this time, because the PC test lock is held for the real-click test.
