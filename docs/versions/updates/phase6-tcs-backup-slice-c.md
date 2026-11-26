# Phase 6 TCS slice C: VALVE CONTROL MT1 and TURNING GEAR from the HIACS backup (2026-11-26 PHT)

Source: the macro insides of the HIACS backup (`tcs-macros.json`) and lane 0's answers on how to read them
(`/mnt/project-files/tcs-macros-layout-2026-11-26.md`, read on the PC 7:46 to 7:58 AM PHT from the backup and the macro list TCA013 ~
TCA021): the value order of each block type (matched against the drawing blocks of the same number), the PA blocks, the screen buttons
(DENSO 2) per instance, the page joints, and the ASTA / TSTF pins.

## What was coded (src/digital/tce-run.js)
- Value order of the record for I (TI HL LL), RL (RI RD), LIN (K B), LMS / MR / LIM / CMP / CPL / WCM (HL LL), AM (R M HL LL).
- PAnm inside a macro: its n inputs give values 1 .. n of the block of the same number, every scan (PA24 023 -> RL 023 RI, RD).
- VALVE CONTROL MT1 (LME244): TCE210 003 (MSV(A)), TCE211 003 (MSV(B)), TCE212 004 / 012 (CV(A) / CV(B)), TCE214 003 / 013
  (ICV(A) / ICV(B)). The typed sheets draw it as a box with named pins; the runner reads it as a macro (pins at the middle of equal slots,
  matched within 0.1 slot on all six). TCE212: the drawing prints LME244; the backup has LME244A at 074 / 077 (two pins more), one of the
  14 wiring differences where the drawing wins, so the LME244 inside is used.
- TURNING GEAR (LME030) TCE350 010: the five screen buttons named by lane 0 (START, AUTO, MANUAL, STOP, each AND CRT AVAILABLE) are
  screen ports CRT:TCE350.m010.<button>.
- App bug fixed (macro output wires): a branch that meets the output line of a macro in the middle of a riser now takes that output
  (TCE212 mt012 D.TEST at 1472, 912). It had been read as DEMAND by TCE172 OR 014, TCE211 OR 054, TCE212 A 068 / OR 051, TCE222 OR 010
  and HLD 030; they now read D.TEST ("during CV(B) test"), as the drawing's line goes.

## INFERRED (from the name, no number in any document)
- MAX (sys.ref, CL.SPD of VALVE CONTROL MT1 on TCE210 / 211 / 214) = the largest number of the controller: closing with no rate limit
  when not testing. Lane 0: its number is not printed in the backup.
- REF FORCED CLOSE inside the macro: no definition of that name is typed on any sheet; the signal of that name is TCE053 output E
  (TD 054), received as "FORCED CLOSE" by TCE180 / 183 / 184 / 206. Same name, same signal.

## Result
- Macros running from the backup: 20 -> 27.
- TCS sheets not running: 45 -> 40.
- TCS sheets COMPLETE: 261 -> 266 of 419 (TCE210, TCE211, TCE212, TCE214, TCE350). Floor 266.
- Guard `tests/lanes/qa/tcs-macro-backup.cjs`: valve opening at OP.SPD, closing at MAX, TEST towards CL.POS. at TC.SPD, CLOSE at once;
  turning gear AUTO / MANUAL / START / STOP only with CRT AVAILABLE.

## Still not coded
- VALVE TEST (TCE220, TCE222, TCE226): pins ASTA / TSTF are wired in the backup (newer program) but blank on the 2017 drawing; the
  drawing wins, so the macro stays open (a decision for the user if the newer program should be taken).
- CHANGE OVER, HEAT SOAK CONTROL, DUAL INPUT DIAGNOSTICS (two-file macros with page joints), CV WARMING SET, CRT OPE INC/DEC (SC block),
  L-RATE, PRESS COMPENSATE MT1, LME271 / 280 / 281 / 285 (AW, SYSREF names, MJL): next slice.

## Tested
`tests/lanes/qa/tcs-macro-backup.cjs`, `tce-complete.cjs`, `tcs-curves.cjs`, `tests/tce/run.cjs`, tce_check, all lanes, build.
Not tested live in the browser (valve tests and the turning gear act at start-up and in the valve test, not at steady 150 MW).
