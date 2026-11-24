# src/world/bind: lane-owned links (PR 0, lane plan 2026-11-25)

One JSON per lane: `boiler.json` (lane 3), `bop.json` (lane 4), `tcs.json` (lane 2), ... A lane edits only its own file. The build
(`tools/build/engine-bundle.js` laneData) puts every file into the page and the engine worker as `window.LANE_BIND`, in file-name
order. `world.js` reads the rows with the same linker as the drawings: no new link code.

The file is an array of rows, or `{ "rows": [...] }`. Two kinds of row:

1. An extra I/O row (no `to`): `{ "stn": 2, "addr": "I.0123", "tag": "ZSO-FW1110", "src": "IO list K1AU3-... row 123" }`.
   It joins the I/O list (window.WIRING) for the tag links, as a row of the I/O list does.
2. An extra FROM reference (with `to`): `{ "stn": 2, "to": "DITL-21A", "row": 14, "from": "28A-77", "src": "DITL-21A row 14 / ABC-028A line 77" }`.
   `to` is the sheet code as drawn (`DITL-21A`, without the `(35)` prefix of the sheet list), `row` the drawn row number, `from` a reference the linker reads:
   `28A-77`, `BA01-11`, `SHEET 214 - LINE21`, or an address. It is added to the FROM text of that input row.

Every row has `src`: the drawing or list and the row it comes from (Rule 0, no invented link). `tests/lanes/integrator/lane-data.cjs`
checks the format in CI.
