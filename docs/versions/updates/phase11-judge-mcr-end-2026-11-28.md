# Phase 11: sweep judge, points just past a curve's end (phase thread, 2026-11-28)

## What changed
- tools/model/sweep-judge.cjs `at()`: a sample within 2 % of the end of a curve's x range is judged at the end value; further out it is still not judged (no extrapolation).
- Why: on main c57d763 the 150 MW hold runs at 466 T/H = 101.3 % MCR (460 T/H), just past the FHI Fig 6 ~ 13 end (100 %). All 35 hold minutes fell out of every % MCR row (120 of 274 judged instead of 158), hiding the full-load rows.

## Sweep on main c57d763 (after PR 729), one sample a plant minute, 274 samples
- 3 / 22 curves PASS (SH spray, cold reheat pressure, hot reheat pressure); with this change the same 3, now judged on 158 samples.
- Full-load gaps now visible (150 MW hold, mean model - design): SH outlet -11.1 C (530 vs 541) with the No.1 SH spray at 14.5 T/H; RH outlet -12.6 C (528 vs 540) with no RH spray; furnace average +41 C (882); O2 -0.7 %; coal -1.9 T/H.
- 90 MW: the pressure limit cycle is gone (AOI, after KANA 714 drum storage and 729).

## Tested
- The judge re-run on the c57d763 samples (file /mnt/project-files/phase11/sweep-main-c57d763-2026-11-28.md).
