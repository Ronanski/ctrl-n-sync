# Phase 6 TCS slice F: CHANGE OVER and HEAT SOAK CONTROL from the HIACS backup (2026-11-26 PHT)

Source: lane 0's re-export of the macro insides (`tcs-macros-20261126T021103-0cc9.json`) and the page-connector table
(`tcs-macros-layout-2026-11-26.md` "LME300 + LME301", "LME242 + LME243"). Each macro is drawn as ONE block on the sheet but is two files
in the backup (two pages): "JOINT X from LMEy" is the page connector, same label, same signal.

## Coded (src/digital/tce-run.js BKM)
- CHANGE OVER (LME300 + LME301) TCE172 A8: the governor (GOV) / load limit (LLM) change-over. Screen buttons GOV, LLM and CRT AVAILABLE
  are screen ports CRT:TCE172.co.<word>.
- HEAT SOAK CONTROL (LME242 + LME243) TCE207 A007: the CV opening bias during heat soak; "SYS 0.0" = constant 0.
- The second file's block numbers are written B<no> (e.g. FFR B014) so the two pages do not mix; a JOINT reads the block that the other
  file's jointsOut names.

## Checked against the drawing (every value on the block)
- TCE172 A8: HL 5.0 / LL 5.0 = CPL 039; K 0.1 / -0.1 / -0.1 / 0.1 = UCK 013, LCK 014, LCK 015, UCK 016; TD 1.0 S x2 = TD B001, B009.
- TCE207 A007: TD 0.05, TP 1.0, TP 180, TW 0.03, TD 1.0, TD 2.0, RI / RD 0.03 = the backup values. Pins: the drawing's union of the two
  files' pins (CV HLD = CVHLD).
- All six names the macros read (CRT OPE PERM, 52G CLOSE, TURBINE TRIP, ALL VALVE CLOSED, HEAT SOAK CONTROL, INITIAL) resolve to a sheet
  signal; none is left open.

## Result
- Macros running from the backup: 32 -> 34 (14 kinds). TCS sheets running 384 -> 386 of 419; COMPLETE 270 -> 272 (floor 272).
- Guard `tests/lanes/qa/tcs-macro-backup.cjs` (all derived from the backup wiring, not from the engine): governor at start; LS with the
  load limit above the governor + 0.1 starts the change; when the load limit comes under the governor - 0.1 the change ends and the load
  limit is in control; FIN with USE and the two within 5; turbine trip goes back to the governor; heat soak off: ICV = DEMAND, bias
  cleared; heat soak on: CV = DEMAND + CV opening bias; all valves closed: ICV 0.

## Found (not changed in this slice)
- At 150 MW, "ALL VALVE CLOSED" reads 1: TCE162 output E is NOT 023 = no target speed selected, and the target speed selects reset after
  52G closes (as typed from page 113). TCE053 already reads the same signal. To check on the PC drawing: TCE162 page 113, the wire into
  output E (finding type (c) until read).
- At 150 MW the HEAT SOAK DEMAND input (TCE206 ADD 010) has no value: TCE206 FILTER 006 and TCE196 CRT OPE INC/DEC 004 give no number
  (TCE196 is "other wiring" in the backup, slice D).

## Next
DUAL INPUT DIAGNOSTICS (LME110 + 110A) needs ASWW and MJL, which are not in the block library: blocked until lane 0 reads their
definition. Then Phase 5: pid_auto / force_manual headless.
