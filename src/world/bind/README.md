# src/world/bind: lane-owned links (PR 0, lane plan 2026-11-25)

One JSON per lane: `boiler.json` (lane 3), `bop.json` (lane 4), `tcs.json` (lane 2), ... A lane edits only its own file. The build
(`tools/build/engine-bundle.js` laneData) puts every file into the page and the engine worker as `window.LANE_BIND`, in file-name
order. `world.js` reads the rows with the same linker as the drawings: no new link code.

The file is an array of rows, or `{ "rows": [...] }`. Three kinds of row:

1. An extra I/O row (no `to`): `{ "stn": 2, "addr": "I.0123", "tag": "ZSO-FW1110", "src": "IO list K1AU3-... row 123" }`.
   It joins the I/O list (window.WIRING) for the tag links, as a row of the I/O list does.
2. An extra FROM reference (with `to`): `{ "stn": 2, "to": "DITL-21A", "row": 14, "from": "28A-77", "src": "DITL-21A row 14 / ABC-028A line 77" }`.
   `to` is the sheet code as drawn (`DITL-21A`, without the `(35)` prefix of the sheet list), `row` the drawn row number, `from` a reference the linker reads:
   `28A-77`, `BA01-11`, `SHEET 214 - LINE21`, or an address. It is added to the FROM text of that input row.

   `to` may name one copy: `"DITL-38 #MV-FW1002"`, `"DITL-21A #C"` (the base sheet is its first machine, `"DITL-38 #MV-BD1001"`,
   `"DITL-21A #A"`). The row is then for that copy only.
3. An I/O point on a text of a copy (`to` with `#`, and `text`): `{ "stn": 5, "to": "DITL-38 #MV-FW1002", "text": "MCV OPEN COMMAND",
   "addr": "O.0123", "tag": "MOR-FW1002", "src": "IO list ..." }`. `text` is a text of the drawing exactly as drawn (for an output drawn
   without an address, or a field tag such as ZSO / MIL). In that copy the text reads as "text tag addr". It is for a drawing of several
   valves or machines that gives no address. An address list that stops short can be filled the same way (DITL-112
   `"O.0044/0.037E/"`, `to` `"DITL-112 #C"`, O.037F).

No row is needed for the tag of machine B / C / D on a copy. When the I/O list has the tag for every machine of the drawing and the
drawing names none of the others, the copy shows and reads its own tag and address (PS-LO1115-A3 on DITL-23B #B is PS-LO1115-B3,
I.0412).

Every row has `src`: the drawing or list and the row it comes from (Rule 0, no invented link). `tests/lanes/integrator/lane-data.cjs`
checks the format in CI.
