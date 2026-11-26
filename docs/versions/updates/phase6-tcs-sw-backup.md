# Phase 6 TCS: the unwired SW pins from the HIACS backup records, 404 -> 412 of 419

Source: phase6-tcs-records-2026-11-26.md (YUA, read-only from team-files/tcs-decoded: COMM+MD 2017-02-23, EHG+MD 2018-07-14).

- CMP blocks whose SW the drawing leaves unwired: each backup record has 102_DD00001 = the constant ON(1) on its side input. So
  the comparison has hysteresis (ML 51 SW = 1). This covers 19 blocks:
  - TCA530A x9
  - TCA534 A046 / A050
  - TCE145 C040-C042
  - TCE206 A040
  - TCE226 006 / 018
  - TCE227 013
  - TCE228 013
- TB 065 / 066 on TCA767: the record has no side input at all. The ML 59 primary / secondary flags are the duplex controller's own
  status. DERIVED: the simulator runs one controller, which is the primary, so Y = X.
- How it is coded: a sheet field `swc` (block key -> value) gives the SW that the drawing leaves unwired. The engine uses it only
  when the drawing has no SW wire. The drawing wins wherever it draws the wire.
- Still open:
  - TCA740 / TCA741 PIF SW: the record holds a signal (102_YY02748 / 102_YY0277A), not a constant. Its source has been asked from
    the PC.
  - The AM parameter M on TCA777 / TCE503: NOT IN DOCS.
  - TCA782: done in PR 638.
- Tests: new check in tests/tce/sheets.cjs. sheets.cjs, run.cjs, tce-complete.cjs, tce-loop-mark.cjs, tcs-curves.cjs and
  tcs-macro-backup.cjs pass.

## TCA740 / TCA741 PIF SW, 412 -> 414

- The drawing does draw the SW of both PIFs: the AUT output of the valve station goes to the top of the PIF. The typed line started
  at the PIF, so the app did not read it as an input. The same line is now also typed toward the PIF, so it ends on the pin.
- The backup records hold a signal there (102_YY02748 / 102_YY0277A), not a constant, which agrees with a wired SW.
- PIF in AUT integrates; in MAN (SW = 0) it tracks.

## COMPLETE check follows the engine, 305 -> 311 of 419 (2026-11-26)

The QA check `tests/lanes/qa/tce-complete.cjs` flagged six running sheets as defects that the engine already handles:

- **TCE168, TCE169, TCE191, TCE195 (PIV HL / LL):** `K.PIV` clamps Z + Y to LL .. HL (DERIVED, see the comment in tce-run.js). The check now flags only a PIV with just one of the two limits printed. ML stays an open meaning; it does not block the sheet.
- **TCE190 (G C014 KA:1.0):** `K.G` takes KA where no K is printed (PC read 2026-11-25).
- **TCE202 (LIN 004):** K and B come from PA2 004 at run time (the sheet field `pa`). The check now counts the PA names as given parameters.

No engine change; the expected count went up only because the check now reads the same parameters the engine runs. FLOOR 295 -> 311.
Noted difference (drawing wins): TCE202 FG C001 point 5 is 97.9 : 0 on the drawing and 100 : 0 in the backup table.

## TRIPPLE INPUT DIAGNOSTICS runs the LME105 inside of the backup, COMPLETE 311 -> 348 (2026-11-26)

- **Source:** the drawing prints "(LME105)" and "TP:3.0" under each of the 146 TRIPPLE INPUT DIAGNOSTICS boxes (TCE075 ~ TCE119A, TCE100, TCE113A, TCE145). The backup (tcs-macros-2026-11-26.md, LME105) gives the inside, with TP 007 = 3. The backup lists only one instance, TCE145 005. The other 145 boxes carry the same macro number and the same value, so they are the same library macro.
- **Rule (tce-run.js `lmeOf`):** a box takes the backup inside from the macro number printed under it only when (1) the backup has that macro, (2) the name is the same, and (3) every value printed beside the box equals the backup value for that parameter. A printed value that differs keeps the manual-text reading, because the drawing wins.
- **What changes for the operator:** OUT is still 2 out of 3. DEV E was "the three not all equal for 3 s" (manual text). It is now the program: a 3 s pick-up of "some but not all on" (timer active once INITIAL is up) sets a flip-flop that holds DEV E until ANN RESET.
- Manual-text macros 346 -> 201. Sheets that run with a manual-text macro 106 -> 69 (FLOOR_TEXT follows). Sheets running 417 of 419, unchanged.
- **Still manual text (the backup does not have their inside):** AI DIAG.MD (LMA510 / LME510), TMR AI DIAGNOSTICS (LMA111 / LME111), VALVE DIAGNOSIS (LME122), TRIPLE DETECTOR2 (LME113), 2OO3 (LME120), TMR LVDT DIAGNOSIS (LME124), DUAL INPUT DIAGNOSTICS LMA110, DUP AI DIAGNOSTICS (LME114, LME100), PTI ERROR DETECT (LME102), and the TCA MT1 macros (LMA566, 569, 575, 578A).

## TCA777 / TCE503 AM: runs at R, M NOT IN DOCS, 417 -> 419 of 419 (2026-11-26)

- **Search:** lane 0 searched 14 document groups on the PC (/mnt/project-files/phase6-am-m-2026-11-26.md). Every macro list copy gives AM (No. 21) with SW, I, D, Z and HL / LL only. No Hitachi R600 macro function manual is on the PC. **M: NOT IN DOCS.**
- **Backup fact:** M is a whole number and PA46 can feed it on line. M = 10 appears only on operator raise / lower setters (LMA040 / 043 / 584B, LME043, TCA777 / TCE503). M = 1 appears only on AMs that logic drives.
- **INFERRED, not applied:** M is a speed-up factor, up to R x M while the button is held.
- **Team decision (coordinator, after the full search):** the AM moves at R and is clamped to LL .. HL. This is exact for M = 1 and the slow, safe case for M = 10. M is not read. The derivation is in the tce-run.js `EXTRA` comment.
- **Open item:** the meaning of M, until the Hitachi R600 macro function manual is found.
- Test: TCE503 AM B003 raised for 10 s at R 0.4 goes from 100 to 104 degC, and lowering stops at LL 50 (tests/tce/sheets.cjs).
- All 419 of 419 TCS sheets now run as their logic. COMPLETE is 350 of 419; the other 69 run with a manual-text macro whose inside the backup does not give yet (PC read asked: phase6-tcs-macro-insides-request-2026-11-26.md).

## Diagnosis and MT1 macro insides from the backup, COMPLETE 350 -> 381 (2026-11-26)

**Source:** lane 0 read all 16 macros asked (/mnt/project-files/phase6-tcs-macro-insides-2026-11-26.md / .json: 201 instances, 69 sheets, 392 blocks). They are entered in `BKM` as the backup holds them. `SYS 0.0` and `SYS OFF(0)` = const 0; `SYS ON(1)` = const 1. Per-instance values (for example the LMA510 WCM 006 / MR 013 limits) go under `at`. An instance the backup wires differently goes under `at[...]._b`, built exactly as the backup has it.

**Now on the backup inside:**
- AI DIAG.MD (LMA510 x89, LME510 x7)
- TRIPLE DETECTOR2 (LME113 x10)
- 2OO3 (LME120 x10)
- TMR LVDT DIAGNOSIS (LME124 x8)
- PTI ERROR DETECT (LME102)
- EXCI./SYNC./LOADUP MT1 (LMA566)
- LOAD SET MT1 (LMA569 x2)
- ACC.RATE SELECT MT1 (LMA575)

**Kept on the manual-text reading (open), with the reason:**
- **The backup macro gives only part of the drawn outputs. The rest come from a companion macro through JOINT, which has not been read yet.** A drawn output is never left unfed.
  - TMR AI DIAGNOSTICS LME111 / LMA111: OUT, ABN and ERR come from LME111A.
  - VALVE DIAGNOSIS LME122: every output comes from LME123.
  - DUAL INPUT DIAGNOSTICS LMA110 and DUP AI DIAGNOSTICS LME114: OUT, ABN, ERR and QT come from a companion. The record leaves its name blank.
  - The different wiring of LME111 on TCE067 / 068 / 069 and of LME122 on TCE132 ~ 135 is entered under `_b` and is used once the companions are read.
- **DUP AI DIAGNOSTICSV LME100:** OR 041 / 051 / 061 read "JOINT A1 ~ A3 from LME101", which has not been read.
- **HEAT SOAK TIMER MT1 LMA578A:** SUM 035 / 037 / 039 / 041 have a side input (SW: FFR). The macro list gives ADD / SUM no SW, so its meaning is open.

**Found while doing this (bug, now open):** LMA710 PI CNT (TCA775, merged in slice F) has SUM 005 with SW: DSW 002. The engine was ignoring that SW, which is a default with no source. TCA775 is now open until the SUM SW meaning is read: 419 -> 418 running.

**What the operator sees change:**
- PTI ERROR DETECT H-CNT MODE is now the OR of the speed card's high counter flags (HFLAG A / B / C = PIO TCE980-1 / -10 / -19). Before, it was "speed >= 3000 rpm for 2 s" from the manual text.
- AI DIAG.MD now holds OUT at the last good value while ABN is latched, until ANN RESET. That latch is the program.

**Tests:**
- New test: TCA310 AI DIAG.MD steady / slow / step / latch / reset.
- TCE143 test: it now sets the three card flags, because the backup reads them. The expected H-CNT MODE = 1 is unchanged.
- Two test lookups now accept the pin name without spaces (INC, H-CNTMODE): a backup macro names its pins that way.

**Counts:**
- Manual-text macros 201 -> 74.
- Sheets with a manual-text macro 69 -> 37.
- COMPLETE 350 -> 381 of 419.

## Companion macros and SUM SW, COMPLETE 381 -> 411, 419 of 419 run (2026-11-26)

**Companions:** lane 0 read them (/mnt/project-files/phase6-tcs-companions-2026-11-26.md / .json). Each is a second program file of the same box, with the same sheet and number:
- LME111A, the companion of LME111
- LMA111A, of LMA111
- LME123, of LME122
- LMA110A, of LMA110
- LME114A, of LME114
- LME101, of LME100

**How they are entered:** in `BKM`, inside the parent entry (field `comp`). The companion's block numbers carry "~" (for example OR ~017), so they never collide with the parent's numbers. Each "JOINT x" line is read as the block the other file sends on that joint. The instances that the backup wires differently are now in use: LME111 on TCE067 / 068 / 069 (all channels read SIG3 / ERR3), and LME122 on TCE132 ~ 135.

**Difference against the drawing (the backup is the program, logged):** on TCE067 / 068 / 069 the drawing shows SIG1 / SIG2 / SIG3 as three separate wires into the box, but the program reads SIG3 for all three channels. The operator sees OUT = channel 3, not the middle of the three.

**SUM SW:** NOT IN DOCS. DERIVED from the 13 records: SW = 1 gives Y = X1 + X2 within LL .. HL; SW = 0 gives Y = X2. This makes the SUM an accumulator in LMA578A (heat soak time, reset by TURBINETRIP) and in LMA710 (PI pulse counter). On TCA765 / 766 (X2 = 0.0, SW = INITIAL): INITIAL is 0 for the first 10 s after start (TCE050 TP 10 s pick-up) and then 1, so Y = 0 during the start and X1 after. TCA775 runs again: 418 -> 419.

**New guard (no drawn output or input left unfed):** a backup macro runs only if it feeds every drawn output, and only if every pin it reads is drawn. Otherwise the box keeps its manual-text reading.

**Still on manual text (8 sheets):**
- VALVE DIAGNOSIS on TCE120 / 122 / 124 / 126 / 128 / 130: the drawing does not draw the pins S.POS. and DEMAND.
- HEAT SOAK TIMER MT1 on TCA586: the drawing does not draw MODE2 ~ 4.
- RUB CHECK CONTROL MT1 and ACC.CONTROL MT1 on TCA582: not in the backup read yet.

**Tests:**
- New: TMR AI on TCE060 = the middle of three; on TCE067 = channel 3 (backup wiring); SUM SW rule.
- TCE143: the test now includes TCE050 / TCE053 (INITIAL, ANN ENABLE, ANN RESET) and sets the low counters to the speed, because the backup compares each pickup with its low counter.
- TCE143 QT2: it is now expected to be 1 when B is lost. In the backup QT2 is A 052, the error of B before the delay; the manual text had read it as a quality bit.

**Counts:**
- Manual-text macros 74 -> 9.
- COMPLETE 381 -> 411 of 419.

## The last 8 sheets, COMPLETE 411 -> 419 of 419 (2026-11-26)

**Source:** lane 0 read them (/mnt/project-files/phase6-tcs-last8-2026-11-26.md / .json).

**VALVE DIAGNOSIS on TCE120 / 122 / 124 / 126 / 128 / 130 (_lib.js vd2), a bug that is now fixed:**
- The drawing joins the DEMAND pins of both blocks on one vertical line, and the S.POS. pins on another. The line was typed starting at block 1's pin, and a line is read as an input only where it ends. So block 1 read no DEMAND and no S.POS.
- The lines are now typed toward each pin. Both blocks read the same nets, as the backup has them: DEMAND = the LME244 DEMAND of TCE210 / 211 / 212 / 214, S.POS. = TCE501 / 502 LMS (103 / -3) of LME271 Y1. The mapping was checked sheet by sheet against the table in the read.

**HEAT SOAK TIMER on TCA586, the same typing bug, now fixed:** the MODE2 / 3 / 4 lines were typed starting at the macro pin. Now MODE2 = TCA582 ACC.CONTROL HEAT2, MODE3 = HEAT3 and MODE4 = TCA583 LMA566 START3, exactly as in the backup.
- Fact from the backup: HEAT2 is BTR of SYS OFF(0) inside LMA563A, so the 2700 rpm (medium speed) hold never runs.

**TCA582:**
- RUB CHECK CONTROL MT1 = LMA560 002, and ACC.CONTROL MT1 = LMA563A 017. Which name goes with which macro is INFERRED from the pin names, because the record has no title.
- TEMP.2 = ON(1): the drawing (CONST 1) and the backup agree.
- The drawing prints "COMP" where the backup has "COMP.". A drawn pin now matches the backup pin when the only difference is the last dot.

**Logged difference:** on TCE120 the backup feeds POS.OT of both blocks SYS 0.0 (FTR 014 / 019). The drawing also gives 0.0, so they agree.

**Result:** every one of the 419 TCS sheets runs as its logic, and none runs on a manual-text macro (0 of 537 macros). COMPLETE 419 of 419.
