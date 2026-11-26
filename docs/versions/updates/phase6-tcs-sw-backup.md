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
