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
