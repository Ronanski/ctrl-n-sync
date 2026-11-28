# TCS items listed as "no doc": each one traced to the TCS sheets or the HIACS backup (lane 1, MARIA, 2026-11-28)

Search: the TCE / TCA sheets in src/digital/tce and the HIACS backup records (team-files/tcs-decoded, read by YUA into
phase6-tcs-records-2026-11-26.md and tcs-macros-*.json). No new PC read was needed.

- CMP with an unwired SW (TCA530A x9, TCA534 A046 / A050, TCE145 C040 ~ C042, TCE227 013, TCE228 013): the backup record of each
  block holds the constant ON(1) on its side input, so SW = 1. Already in the sheets (field swc, phase 6). Closed.
- TB 065 / 066 on TCA767: the backup record has no side input; the primary / secondary flag is the duplex controller's own status.
  DERIVED: the simulator runs one controller, the primary, so Y = X (sheet field swc). Closed.
- TCE212 CV demand: UNT-FG 003 (CV A) and 036 (CV B), LME010, curve points from the HIACS backup; turbine.js AN_CV fgA / fgB runs them
  (tbCvLift). Closed. Two stale comments still said "PARA-LIST, NO-SOURCE, linear" and are corrected:
  - unit.js valve constants: cvBias 20 % = TCE207 SG C008; fdRate 1 %/s = TCE207 A007 RI / RD 0.03 % (DERIVED: per 30 ms cycle of the
    EHG+MD controller); vRate 10 %/s = TCE214 SG C007 (ICV) and TCE211 SG A035 (CV opening rate; closing SG A037 999999.9 = no limit).
  - unit.js rollRate 120 rpm/min = the ATS acceleration rate of the cold modes, 310SC90-775 page 19 (was cited to the procedure).
  - turbine.js anTbFlow header: the CV lift is the TCE212 FG of the flow demand.
- Comments only: no value, logic or test changes. no-snapshot baseline 588 -> 587.

icvRoll and rollRate: the unit.js roll branch was dead code (the TCS ATS always sets the roll speed and the ICV); RIN deletes it with
both constants in PR 732, so one path is left. Nothing open in this area.

Tests: tce-complete 419 of 419, no-snapshot PASS.
