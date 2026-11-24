# QA trace: what counts (frozen 2026-11-25 01:45 PHT, baseline main 5d9c34d)

Any change to these rules is made in one commit that also prints the old and the new count side by side, so a lane's before / after stays comparable.

Run: `node tools/trace/trace.cjs --start 150 --mins 10` (the app's own engine, headless, from "Normal operation at full load").

## Station
- ABC sheet: its station from its F(X) pattern names (engine `shStn`). An address written "S2 M.xxxx" is station 2.
- DITL sheet: "STATION 10x" in its title block, else the station of most I/O tags written on it.
- An address counts only on a sheet of ITS OWN station. A tag (unique in the plant) counts on any sheet.

## Where a DITL address sits
- Input side = the columns F, L, T, S (left of the logic). Output side = everything right of column S (the logic area, RS, RL, RT).
- A free-text address goes to the row at the same height (within 5 units), on its side. No row near = "on the drawing, not on a row".
- A short machine list ("O.0093/413") gives machine A on the drawing itself and each machine on its own copy (`WORLD.showText`).

## Status of one I/O point (DCS I/O list row with a tag)
1. EXCLUDED: description or tag names a compressor, air dryer, water treatment / WTP or coal handling (user 2026-11-25 00:52 PHT).
2. LINKED, any one of:
   - input point (DI / AI / PI): on its own input row with a source (link from a sheet, plant switch, plant value, operator CRT, local panel, the sheet's valve / motor model, or it moves during the run), or on an ABC net that is driven or written during the run;
   - output point (DO / AO / PO): on any row of the logic side, or on an ABC net;
   - a feedback tag that a DITL valve / motor model answers by name (ZSO / ZSC / MIT / MIL / MIR, 03b-sim.js).
3. ON A DRAWING, NOT WIRED (counted together): on a sheet but no source; written on the drawing but not on a row (incl. typical tables like DITL-38 by device tag); only on another machine's copy (B5); station unsure.
4. MODEL / PAGE ONLY: on no sheet, but the tag is named in the plant model / world code or a page.
5. NOWHERE: none of the above.

## Breaks listed (not part of the status count)
- B1: an ABC input that nothing writes during the run; a DITL input row with no source.
- B2: an I/O input point on no sheet and not given by the model.
- B3: a faceplate tag with no controller on any sheet.
- B4: an ALM block with no set point.
- B5: a machine copy row that shows another machine's address (rows that name the other machine on purpose, and signals common to every machine, are not B5).

## TCE / TCA / G (tests/lanes/qa/tce-complete.cjs)
- COMPLETE = every block has its macro-list meaning AND every parameter that meaning needs is printed on the sheet (FG points, SG K, timer times, PIV limits, printed parameters read). Reported as real logic + tables with no block.
- Rule change 2026-11-25 (review against the Aug 2017 PDFs): (a) LOGIC / PI/O EXPLANATION sheets (TCE022, TCE023) are legends and never count; (b) a sheet-to-sheet link that the drawing names (source sheet + letter, joined) but that the compiled program turns into a CON: port (= 0) is a broken wire of the reading sheet. Same code (main 502e57f): old rule 196 (real logic 140 + tables 56), new rule 141 (real logic 90 + tables 51). Floor 194 -> 141. After lane 1 PR 526 (both fixed): 196, floor 196.
- Two columns (2026-11-25, lane 1 PR 539): a sheet that runs only through a macro coded from the manual text (TCE_RUN.stats().runText, "inside not drawn") is NOT drawing-complete; it is printed on its own line and never in COMPLETE.

## Baseline (main 5d9c34d): I/O with a tag 2,702 = linked 1,482, on a drawing not wired 380, model / page only 214, nowhere 537, excluded 89.

## Fix 2026-11-25 06:40 PHT (row index, found by YUA): same main fa7eb69, 150 MW 5 plant min, old tool -> new tool
DITL cells, nl.src / outs rows and the sampled inputs are keyed by the 0-based row index; the tool read the text, FROM and tags of
the row below (cells by the drawn number r.n). Counting rules unchanged; only the read is fixed.
- LINKED 1,482 -> 1,524; on a sheet no source 142 -> 112; on the drawing not on a row 199 -> 195; only on another machine's copy 23 -> 15;
  station unsure 16 -> 16; model / page only 224 -> 224; nowhere 527 -> 527; excluded 89.
- B1 DITL input rows with no source 1,060 -> 255; B5 165 points on 294 rows -> 141 points on 226 rows; B1 ABC 102, B2 443, B3 16, B4 9 unchanged.
