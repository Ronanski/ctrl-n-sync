# Phase 6 TCS: every macro on the backup inside, COMPLETE 350 -> 419 of 419 (MARIA, 2026-11-26)

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
