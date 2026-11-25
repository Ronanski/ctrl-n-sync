# Phase 3: every TCS sheet scans at its own drawing cycle (2026-11-25 ~8:45 PM PHT)

- src/analog/engine/tcs-sheets.js tcsShSlow: the sheets that do not drive a motor yet scanned once every 0.25 s with a 0.25 s step.
  Now each scans at its own cycle from its drawing header (EHG+MD 10 / 30 ms, COMM+MD 30 / 100 ms), the same loop as the 14 drive
  sheets. Their inputs from the TCS I/O list are still read every 0.25 s (TCS_SH.slow).
- Cost (headless, tools/trace world, 120 steps of 0.5 s): 18.6 -> 21.1 ms per step.
- tests/lanes/qa/architecture.cjs fails when either loop scans with a step other than q.cyc (checked with a deliberate break).
- QA trace gate: 22 counts held, 0 worse. tests/tce run / sheets, tce-complete 256: unchanged.
- Still open: the old tcs.js (1,847 lines) runs beside the sheets; it goes group by group when a sheet drives the group.
