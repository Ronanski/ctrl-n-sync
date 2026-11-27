# Phase 11: sweep operator gain back to 0.3 x error (2026-11-27, phase thread)

Below 220 T/H the boiler master HIC-BM is MANUAL (M.2013), so the sweep tool's scripted operator presses HIC-BM to hold the pressure.
The law 0.5 x error - 3.0 x 3-min trend (PR 689) swung again at 45 MW in the main sweep: MSP 91 <-> 130 ata.
KANA's tested law 0.3 x error - 3.0 x 3-min trend is restored.

Sweep on main 2e11145 with 0.3 / 3.0 (204 samples, no trip):
- 45 MW hold: MSP 98.2 to 99.9 ata after it reaches the sliding set point (HB 30 % load = 99.1 ata). No swing; coal 29.5 to 35.0 T/H.
- Curves PASS 4 of 22 (cold reheat pressure, hot reheat flow, hot reheat pressure, primary air), same count as before.
  The main steam pressure misses are now only during the descent 90 -> 45 MW (the pressure lags the sliding line), not at the hold.

Only tools/accept/part1.cjs changes (test tool, not the plant model). Full table: /mnt/project-files/phase11/sweep-main-op03-2026-11-27.md
