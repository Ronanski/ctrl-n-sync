# Phase 6 TCS slice D: CV WARMING SET, CRT OPE INC/DEC, L-RATE from the HIACS backup (2026-11-26 PHT)

Source: lane 0's re-export of the macro insides (`tcs-macros-20261126T021103-0cc9.json`) and answers
(`tcs-macros-slice-d-2026-11-26.md`, read 10:02 to 10:11 AM PHT): the screen inputs by name, the system constants by name, the SC block
and the M of AM.

## Coded (src/digital/tce-run.js BKM)
- CV WARMING SET (LME131) TCE155 002 / 011: PA46 sets AM 006 on line (R = RATE, M = 1, HL = OP.POS, LL = CL.POS), PA24 sets RL 007.
- CRT OPE INC/DEC (LME025 TCE194 001, LME026 TCE205 006): screen inputs SYNCHRO (button) and SV-C (set value typed on the screen)
  are screen ports CRT:<sheet>.<macro>.<word>.
- L-RATE (LME043) TCE185 003: screen SYNCH and SV-C; AM 007 R 1, M 10, HL 100, LL 0.
- SC block added to the block library: Y = 0 - X (written so, not -X: -0 does not survive a save / load, the keyframe test found it). DERIVED: SC is not in the macro list TCA013 ~ TCA021 (73 kinds); lane 0 proved it from
  the backup wiring (TCE060 LME111: HL = DEV, LL = SC(DEV); CRT OPE INC/DEC: +step on INC, SC(step) on DEC).

## DERIVED / not taken
- AM M (a whole number, 1 or 10 in the backup) is not in the macro list; it is not applied (as before). It does not act here: M = 1 in
  CV WARMING SET, and in L-RATE the I / D inputs are OFF (the AM only tracks or holds).
- TCE196 004 (CRT OPE INC/DEC): the backup marks it "other wiring" with no detail; not taken.

## Result
- Macros running from the backup: 27 -> 32.
- TCS sheets not running: 40 -> 35; COMPLETE 266 -> 270 of 419 (floor 270).
- Guard `tests/lanes/qa/tcs-macro-backup.cjs`: INC/DEC MANU and OUT, SC, L-RATE track / hold, CV warming SET to CL.POS.

## Also in this PR (Phase 5)
- `tests/lanes/qa/pid-am.cjs`: the PID auto / manual check of tests/regress/pid_am.js now runs headless in every Checks run: 66 PID,
  56 PASS, 10 NOT TESTED with reason (7 output to another sheet, 3 selector after a summing block), floor 56.

## Next
CHANGE OVER, HEAT SOAK CONTROL, DUAL INPUT DIAGNOSTICS (two-page macros, now named joints); then the slice E comparison of the TCP
program with the IBD trips (tcs-tcp-pio.json).
