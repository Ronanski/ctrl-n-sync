# LMYP OTS 1.0.0-beta.252

22 Nov 2026. Full Audit 3 item #4 (TCS sheets as the running logic), step 1 of the plan. By Jennie.

## Changed

| Area | What changed |
|---|---|
| Plan | `docs/tcs/SHEETS_AS_LOGIC_PLAN.md`: the six steps that make the typed TCE / TCA sheets the running TCS logic in place of the hand-written logic of `tcs.js` (compiler, block meanings with their sources, PI/O binding to the TCS I/O list, shadow run against the 281 live reads, swap per controller, IBD inputs) |
| Tool | `tools/data/tce_net.mjs` (read only): every TCE / TCA sheet to a netlist, read from the drawing itself: each wire's key is its net, its last point names the block pin, macro pin, output connector, CRT lamp, definition or PI/O box it feeds; an X crossed circle on the last piece marks the input inverted; input connectors join the output connector of the sheet they name |

Nothing in the app, the logic, the plant model or the drawings changed.

## Result of the tool (main at beta.250)

- 407 sheets, 13,586 wire pieces. 6 pieces end at a place not named yet (TCA549 kInit, TCA762 hsg010, TCA782 kInit, TCE140 pkA / pkB / pkC).
- Every block and macro that has inputs has them found; 61 inputs are inverted (X).
- Input connectors: 1,910 joined, 716 from the IBD, DCS or generator sheets, 89 whose source sheet has no output connector of that letter naming them back (for example TCA539 A / B / C from TCA500). These are links to read again on the drawing (finding for step 1, next PR).

## Tested

`node tools/data/tce_net.mjs` (above), `node tools/data/tce_check.mjs`, build `--check` SAME. The behaviour gate runs in the Checks.
