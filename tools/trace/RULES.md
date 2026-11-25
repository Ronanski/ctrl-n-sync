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

## Field rows (2026-11-25 06:50 PHT, asked by KIRARA via the coordinator)
FIELD.rows of the lanes (src/world/field/<lane>.js) count as a value source by I/O address (stn|AIxxxx) or tag. Frozen statuses unchanged:
a point with a field row and no logic sheet is MODEL / HMI ONLY (rule 4); on a sheet, the field row writes the AI block / DITL row in the
run and the existing source rule applies. New column "value" (CSV) and summary line: the point carries a live value in the running app
(LINKED, or a field row). Same tool, 150 MW 5 plant min:
- main fa7eb69 (no field rows yet): value 1,524 (field only 0); statuses as the 06:40 baseline.
- lane 3 branch beta.493 (boiler.js, 50 rows): value 1,524 -> 1,574 (field only 50); MODEL / HMI ONLY 224 -> 268, UNLINKED 527 -> 483, B2 443 -> 399.
- lane 4 branch (bop.js, 77 rows): value 1,524 -> 1,601 (field only 77); MODEL / HMI ONLY 224 -> 284, UNLINKED 527 -> 467, B2 443 -> 383.

## Row-unit copies (2026-11-25 07:00 PHT, lane 0 PR 549)
A copy with `s._inst.only` (Set of row indexes) holds only those rows of its base drawing: its other rows and the drawing's free text are not
counted on it. Old tool -> new tool on PR 549 a086e24: no change (LINKED 1,601, value 1,713; the 3 copies DITL-21D #B/#C/#D have no other
row with an address).

## Field contacts, field states, multi-station headers (2026-11-25 08:00 PHT, KIRARA / RARA via the coordinator)
- A field contact on the wire of an output row (WORLD.plantUsw) is drawn on that sheet and driven by the field: the point (station of the
  sheet, tag) is LINKED. A field state tag (FIELD.states) is a value source like a field row (rule 4 when on no sheet).
- "STATION 101 & 102" (DITL-38): each copy's station is the one its device's I/O tags vote for, among the header's stations.
- Old -> new tool, 150 MW 5 plant min: main 736a935 LINKED 1,604 -> 1,616, on drawing not on a row 195 -> 186, model / page 306 -> 303,
  value 1,726 -> 1,734. PR 555 195c397: LINKED 1,604 -> 1,640, drawing 195 -> 178, model / page 376 -> 357, value 1,809 -> 1,817.
  Unchanged: no source 103, copy 14, station unsure 16, nowhere 375 (main) / 305 (555), B1 DITL 255, B2 293 / 223.
- Typical drawing with no device (DITL-38, 2026-11-25 08:15 PHT): a copy's valve model answers the contacts of its own device (feedback
  "MIL", "ZSO", "TSC" + #MV-FW1001 -> MIL-FW1001 ... TS-FW1001), the same rule as the other valve / motor model feedback.
- Old -> new tool on main 6683666 (beta.550, YUA's DITL-38 points): LINKED 1,607 -> 1,687; no source 115 -> 103; model / page 376 -> 357;
  on drawing not on a row 189 -> 138; nowhere 296 -> 298 (S1 MIT / MIL-FA1054-1 were matched to a DITL-38 copy of the wrong station);
  value 1,812 -> 1,864.

## F(X) count skips the symbol legend (2026-11-25 08:50 PHT, AKIHO via the coordinator)
ABC-000 is the symbol legend of the analog set (its FX block is a drawn example, not a controller). The I/O / memory catalog already skipped
it; the F(X) loop now skips it the same way. Old -> new tool, main 79c27fe (beta.553), 150 MW 5 plant min: FX blocks 112 -> 111,
unresolved 1 -> 0 (the one was "ABC-000 FX (no LN)"). Every other line of the summary unchanged.

## Cross-sheet references (2026-11-25 11:30 AM PHT, user "Interconnected din dapat ang mga logic: DITL ABC TCS", via the coordinator)
New tool `tools/trace/xref.cjs` (no change to trace.cjs or its counts). An input row of a DITL drawing whose FROM names a logic sheet
(DITL "25A-55", a code with no letter "12-70" = the set 12A / 12B / 12C; ABC-0xx; TCS) is WIRED when the running world feeds it from that
sheet (or a machine copy of it, or the sootblower counter of DITL-80), OTHER when only from another sheet, MODEL when the plant / valve /
switch model gives it, MISSING when nothing does. The ABC side comes from the world's own link table (WORLD.stat). DITL rows with LOCATION
TCS are counted from the trace rows (their source). Main e7827ce, 150 MW: DITL reads DITL 1,717 / 1,888 (other 54, model 4, missing 113);
DITL reads ABC 159 / 162 (missing 3); ABC reads DITL 131 / 131; DITL LOCATION TCS 37, none from a TCS sheet (the TCS sheets do not run in
the world; the turbine model gives them).

## ABC inputs named "(CRT)" are operator (2026-11-25 11:45 AM PHT, SORA via the coordinator)
An ABC input whose memory-list name says "(CRT)" (OIL MASTER USE P.B.(CRT), DRUM LEVEL SELECT THREE ELEMENT (CRT) ...) is an operator push
button / select of the CRT: its source is "operator", not B1 "nothing writes". Old -> new tool, main 0fa7dbc, 150 MW 5 plant min: B1 ABC
inputs nothing writes 102 -> 85, ABC inputs by operator 144 -> 161, memory on a sheet with no source 33 -> 16 (the same 17: ABC-003A ~ 003E
oil control select / oil master P.B., ABC-008 M.0200 / 0201, ABC-010 M.054E / 054F, ABC-020 M.017F, ABC-057 M.144A / 144B). Every other
line unchanged.

## Block parameters, LCD push buttons (2026-11-25 11:55 AM PHT, AKIHO and RARA via the coordinator)
- An ABC input named PTNnnnnnn (a pattern slot of the block, "WAFER MOUNTING NO.61 ~ 64" in the memory list) or PSnnnn (the block's own
  ramp / time parameter, ABC-003E PS0004 = 5 %/min) is "block parameter", not B1. Old -> new (main 0fa7dbc + the (CRT) rule): B1 ABC
  85 -> 77 (ABC-003E PS0004 x 4, PTN004029 ~ 004032), memory on a sheet with no source 16 -> 12.
- A DITL input row with LOCATION "LCD", or whose address the memory list names "(CRT)", is an operator push button (as LOCATION CRT).
  Old -> new: B1 DITL input rows with no source 239 -> 203 (LCD 3: DITL-121 M.0650 ~ 0652; memory "(CRT)" 33: DITL-BA61 14, DITL-BA02
  M.1300 ~ 1303, DITL-80K M.4212, DITL-LS10 M.1800 ...). DITL operator rows 463 -> 499. Every other line unchanged.

## One address, one signal; the TO side of the source (2026-11-25 12:05 PM PHT, YUA via the coordinator)
- An ABC input that nothing writes on its own sheet is written when a net of another ABC sheet with the same station and address is
  written (logic output, link, DITL, engine write, operator): the engine spreads one address to every sheet (links.js anXs). Old -> new
  (same main as above): B1 ABC 77 -> 70 (7: the AND inputs of ABC-007 / 004A and others whose twin is fed by the DITL). Not closed by this
  rule: 30 inputs whose every twin also reads 0 writes in the run (I.0400 / I.0418 / I.0931 / I.0932 / I.0413 / I.0414 on ABC-019 / 050 ~
  053, M.3200 / M.3220 on ABC-001C / 010 / 013, M.0001 on ABC-001B / 029): their writer is the unit model (unit.js labOf, a direct value
  write the trace hook does not see). Waiting for YUA's list of 59 addresses with their writer to read it from the engine.
- xref.cjs: a DITL input fed from another sheet than its FROM names is WIRED when the source row's own TO side names the reader
  ("TO DITL80G" on DITL-80B ~ 80F). Old -> new: other sheet 54 -> 46, wired 1,717 -> 1,725 (8). The 46 left: DITL-80G copies read 80B ~ 80F
  rows whose TO side says DITL80H (80G #N-1016 <- 80B row 18 "N-1016 SOOTBLOWER OPERATING" -> DITL80H).

## Field I/O sheets, AO of a controller, instance block, DITL-80H/I/J (2026-11-25 12:15 PM PHT, KIRARA / YUA via the coordinator)
- DITL-16 / 17 / 18 (field I/O sheets) compute their limit switch and flame detector rows themselves (03b-sim): an input point on an output
  row of these sheets is sourced; their input rows are "own sheet (field I/O)". Old -> new: on a sheet no source 108 -> 84 (24 points:
  ZSO-FA1043-A ~ D, ZSO-DO1043-A2 ~ D2, BI7 / BI8 / BI9 / BI10-DO1043-A ~ D; BI7 is on the same rows as BI8 ~ 10).
- An AO whose device is the device of an ABC controller (MAN / PID block) of the same station is that controller's output
  (SC-L1060A <- SICL1060A, MOF-CL1061-A <- FICCL1061A). Old -> new: on the drawing not on a row 138 -> 131 (SC-L1060A ~ D, MOF-CL1061-A ~ C),
  UNLINKED 164 -> 163 (TCS-AS1004), model / HMI only 489 -> 488 (TT-AS1017-1); LINKED 1,693 -> 1,726 with the field I/O rule; value 1,942 -> 1,975.
- DITL-50 (FB2-OT device overtime) is an instance block: its input rows are "caller pins". B1 DITL rows with no source 203 -> 194 (DITL-50 5,
  DITL-16 / 17 / 18 input rows 4).
- xref: DITL-80H / 80I / 80J hold only "(AS SHEET DITL80G BLOCK)" boxes: a TO DITL80H / 80I / 80J goes to that sootblower's DITL-80G copy.
  Old -> new: other sheet 46 -> 0, wired by the TO side 8 -> 54.
- audit-fix alias (KIRARA): an ABC input whose wire carries a second name in src/analog/engine/audit-fix.js (op alias, S.alias) that is
  a mode status (.LOC / .MAN, written by the M / A / R of that tag) is "operator". Old -> new: B1 ABC 70 -> 68 (ABC-011 M.0230 =
  TICBR1130.LOC, ABC-012 M.0240 = TICBR1150.LOC), memory on a sheet with no source 12 -> 10.
- MCC / VCB status contact beside a driven output (RARA): an input point MIL- / MIS- / MIV- / MIR- / MIT- whose address the drawing prints
  beside a driven OUTPUT row (DITL-76 row 7 "A-AUX. CW PUMP STOPPED I.0089", DITL-61A row 7 "CONDENSATE PUMP A STOPPED I.0083/403") is
  that output net: LINKED. Other inputs printed beside an output (XA-FA1052 fire detect, IRP stop commands of DITL-03D) are NOT counted:
  the general form moved 79 points, the motor-contact form 59. Old -> new: LINKED 1,726 -> 1,773, on a sheet no source 84 -> 41,
  copy clash 5 -> 1 (DITL-45 12, 61A 6, 22 4, 21A 4, 120 4, 30 / 76 / 29A / 77 / 112 3 each, others under 3).

## Field contact (usr) writes a DITL input row (2026-11-25 1:00 PM PHT, YUA PR 590 / RARA via the coordinator)
- A DITL input row whose address sits on the same net as a user contact (nl.usr, state in s.usw, e.g. the ELECTRICAL TROUBLE contact
  that simIn sets) is "field contact (usr)": that contact writes the input. Old -> new on main 111ca23: B1 DITL rows with no source
  131 -> 127 (DITL-22 #A ~ #D: I.0051 / I.0371 / I.0054 / I.0374).
- Not moved: 12 TRIP rows whose net holds no usr contact in the netlist (DITL-24 x2, DITL-30 x3, DITL-31 x2, DITL-111 x2, DITL-112 x3).
  These stay "no source" until the writer contact is named.

## Usr contact without a usw entry; unit model writers on a change (2026-11-25 1:10 PM PHT, YUA / RARA via the coordinator)
- Field contact (usr): the usw entry of a user contact exists only once the contact is set, so the rule now needs only the contact on the
  same net as the address row (nl.usr[].n === nl.ind[].n, ind.adr set; YUA PR 590). Old -> new on main 04a0db0: B1 DITL rows with no
  source 125 -> 109 (the 12 motor TRIP rows DITL-24 / 30 / 31 / 111 / 112 and copies, ET272_ / ET274_ ELECTRICAL TROUBLE, plus 4 rows
  of the same nets), LINKED 1,779 -> 1,782.
- Unit model writers (AN.unit.di, unit.js): the unit model writes these ABC inputs only when the value changes, so one that stays at its
  start value in the run shows no write. An ABC input named in AN.unit.di is "engine". Old -> new: B1 ABC inputs nothing writes 68 -> 48
  (ZSO-CD1115 I.0892 ABC-052, I.0413 / I.0414 ABC-050 / 051, I.0418 / I.0931 / I.0932 ABC-050, I.0081 / I.0082 ABC-001C, I.0417 ABC-053,
  I.029C / 029D / 029E ABC-035 / 038 / 039, M.0001 ABC-001B / 029; and by the same address I.0418 ABC-019 / 051, I.0931 ABC-053,
  I.0932 ABC-052), LINKED 1,782 -> 1,787, on a sheet no source 35 -> 30.

## NaN in the source chain (2026-11-25 5:45 PM PHT, YUA via the coordinator)
- A NaN that enters a compare / switch block comes out as 0, so a "0" can be silently wrong. Each ABC net now counts the samples where it
  read NaN / Infinity. A net has a NaN in its source chain when it, or any net upstream of it on the same sheet (the in pins of the blocks
  that drive it, and so on), read NaN in the run; a link carries the NaN of another sheet into this sheet's input net.
- An ABC source counts for an I/O point only when its chain has no NaN; a point whose only sources have NaN is "SOURCE CHAIN HAS NaN".
  trace-abc-inputs.csv has a nan column. Old -> new on main 22f6da9 (150 MW, 5 min): 0 of 5,129 ABC nets read NaN, so LINKED 1,787 -> 1,787,
  source chain has NaN 0. Not covered yet: DITL rows (0 / 1 only) and the TCS sheets.
