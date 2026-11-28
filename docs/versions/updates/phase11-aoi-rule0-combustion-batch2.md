# Phase 11 AOI: Rule 0 cleanup of the combustion values in unit.js (batch 2, items 1 ~ 4)

The list came from SUZU (docs: phase11-suzu-27-rule0-unit-batch2). Only design, logic and physics are used: no screen, trend or SOP.

What changed (unit.js):
1. Coal feeder lot spreads AN_CLOT clSd / clSm: 0, NO-SOURCE (they were 0.021 / 0.006, set against a plant trend).
   - No design document gives a lot spread.
   - The Yamato accuracy +/- 0.5 % (CFC-201) is a long-term total, not a spread, and its page is not in the repo.
   - The lot law stays.
2. Seal pot fluidizing pressure PT-FG1009-A2 / B2: the column 533 / 308 mmH2O (screen) is deleted. It now comes from the loop pressure balance: the lower tap = tap (1) + the suspension weight above the return port (U.dpUp, item 3).
   - The return port is taken at the top of the dense bed, and the loop seal head is left out. Both are NO-SOURCE, because the documents give no seal pot elevations.
3. Bed DP split (DPT-FG1084 / 1184 and 1083 / 1183): the anchors were 1016 / 1014 and 70 / 41 (screen). They are now the FHI P2S7 Fig 9 split of the MCR furnace DP (AOI CALC, rms 4 mmH2O): dense bed 1,029, suspension 604, sum 1,633 against AN_BI.dp0 1,630.
   - The tap heights are NO-SOURCE.
   - Check at 150 MW (headless): 1,260 + 536 = 1,796 mmH2O, which is the bed DP at the bed inventory 213.6 t.
4. SA pressure: the old screen anchors and the split from the start procedure are deleted from the comments. The value was already the D2-003 system curve.

Baselines: no-snapshot 577 -> 573, no-fit 22 -> 21.

Not in this PR (blocked, reported to the phase thread):
- 5 Tburn0 / Tburn1 (the coal burnt share in a cold bed, from the PR-OPE band):
  - The Field char rate (859 exp(-17967 / T) g/cm2 s atm) on the design coal char (d50 1.1 mm, rhoC 800) gives a kinetic burnout of 12,700 s at 850 C, against 127 s by diffusion.
  - That contradicts the design unburnt carbon (fUC 3.2 %). The Field rate was fitted on pulverized bituminous char and does not hold for this low-rank char.
  - Needs a design char reactivity, or a sub-bituminous char rate from a textbook table.
- 6 Cold furnace pressure law (SOP 13 % / 16 %):
  - The physics without the SOP is the ID fan curve against the purge air, with no inleakage (NO-SOURCE). It gives -248 mmH2O at 13 %.
  - No test drives a cold ID fan start, so it needs a headless cold-start check before it changes.

Tested:
- Guards: no-snapshot, no-fit, one-path, u-const.
- Headless check at 150 MW.
- 150 MW 20 min behaviour gate: see the PR.

st150 is not changed.
