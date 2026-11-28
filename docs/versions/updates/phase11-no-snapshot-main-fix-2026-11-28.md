# Phase 11: no-snapshot guard green on main again (2026-11-28 PHT)

- Why: PR 713 (AOI) merged before PR 711 set the no-snapshot baseline. Main then counted 2 history comments in cfb.js and boiler.js over the baseline ("Was ... from an HMI snapshot", "no longer scaled to the 9.png ..."), so every PR was red.
- Fix: the two comments now state the design source only (the history is in git). No code change.
- Baseline: 715 lines in 73 files (was 762; MARIA 719, MEI 716 and AOI 713 removed the rest). It only goes down.
- Tested: no-snapshot, build --check. Comment-only change, nothing else to test.
