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
