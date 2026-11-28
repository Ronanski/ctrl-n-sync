# Phase 11 (AOI): coal heat released in the cyclones (post-combustion), 2026-11-28

## What changed
- `src/analog/engine/cfb.js`: new `AN_PC = { f: 0.0343 }`. The share of the coal heat that is released after the furnace exit, in the
  refractory-lined cyclones (char fines and CO burning there; Basu, Circulating Fluidized Bed Boilers, the cyclone temperature rise).
- `src/analog/engine/unit.js`:
  - the bed balance takes `(1 - f)` of the coal heat and sets `U.qPc` (kW) = `f` x the coal heat;
  - `anHxRun` adds `U.qPc / gcp` to the gas into the backpass (`tG`). It is the same coal, so no heat is created and none is counted twice.

## Source (DERIVED, no plant data)
- FHI P2S7 Tab 3 heat balance at MCR. The steam side is SH 110.8, RH 43.0, eco 36.2 and evaporator 157.3, about 347 MW. The furnace sinks are the upper walls, the refractory and the panels. So the backpass takes 127.5 MW from 184.2 kg/s of gas down to the 322 C APH inlet (Tab 3), which needs about 894 C at the backpass inlet (KANA, `/mnt/project-files/phase11/kana-sh-rh-outlet-2026-11-28.md`).
- FHI Fig 8 gives the furnace exit at 840 C at 100 % MCR (YUA read, `/mnt/project-files/aoi-o2-trim-gas-temp-reads-2026-11-28.md`).
- 184.2 x (hFg(894) - hFg(840)) = 12.58 MW, against 89 T/H x 4,259 kW per T/H x (1 - fUC 0.032) = 366.9 MW, gives f = 3.43 %. One share at all loads, so it is not a per-load value. The part-load curves of the sweep judge it.
- Not in the docs (YUA): a cyclone outlet or backpass gas temperature against load, and the heat release, unburnt carbon or CO at the furnace exit.

## Tested (headless, `tools/trace/world.cjs`, Start at 150 MW, not settled; st150 is not part of this PR)
- On main 6aefec0 plus this change, 30 plant min: SH outlet 541.9-543.7 (Tab 3 541), RH outlet 538.8-546.1 (541), APH gas in 322.9-324.2 (322), coal 87.1-89.5 T/H (89), MW 150.7-151.8, PT-MS1002 126.2-127.0, O2 2.9-3.0. At 30 min: bed 883.9, Tu 871.3, furnace exit 859.0, backpass inlet 914.5.
- Before (main): SH 529.9, RH 528.7, backpass gas 866.9 (KANA).
- The bed falls from 889 to about 882-884 C. It is still above the 860 anchor, so the SH spray is about 24 T/H against Fig 10's 12.4 (KANA's hx check). That is the next item (bed temperature), not this PR.
- Guards: `tools/check/no-fit.cjs`, `no-snapshot.cjs`, `one-path.cjs` and `u-const.cjs` all PASS (with the 4 known RULE 0 lines).

## Not tested
- A settled st150. The phase thread re-settles after the merge.
- The full sweep on this branch: the quick sweep is running.
