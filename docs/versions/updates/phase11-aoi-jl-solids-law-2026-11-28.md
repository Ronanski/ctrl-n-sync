# Phase 11 AOI: upper furnace solids from design physics (WIP, NOT TO MERGE)

Status: held. The 150 MW pressure loop swings and trips on this branch once the J&L law is fully in, so 9.2 and its RULE 0 tag stay on
main. The whole picture is in /mnt/project-files/phase11/aoi-loop-lag-picture-2026-11-28.md. The PIC-COBM integral time is in seconds
(FCS2000 FE 2.4.1, /mnt/project-files/dcs-pid-block-def-2026-11-28.md), and the engine's Kp = 100 / P on % of span matches it.

What changed (cfb.js, unit.js):
- The fitted kKL 9.2 is replaced by the Johnsson & Leckner transport-zone law (AN_BB jl: K 0.23, H 34.9 m, U0 4.92, ut 1.09; KANA).
  - Density share: anBbPhiV. Flux share: anBbFluxV.
  - Settle knob: AN.jlShare, ramped by the init tools/steady150/init/jl-law.js.
  - The old law stays only as AN_BB.kSettle, marked SETTLE-ONLY.
- The solids heat to the walls and panels has a radiation part (Basu & Nag: fR 0.43 at MCR, anBbRadF).
- Bed solids cp(T) is quartz Shomate (NIST): 1.17 kJ/kg K at 860 C, was 0.84. AN.storedE uses its integral anBedH.
- 20 % of the coal heat burns above the secondary air (AN_UF, from the lower-furnace oxygen in the FHI mass balance). That heat goes to the suspension.
- The solids heat flow is one law: the J&L flux 22 kg/m2 s x grate x cp(T). It was the 860 / 840 isothermal closure of 10,211 kW/K.
  - Anchors re-solved: uaS 202.0, kPan 1.057, tuA 827.6.
  - The MCR furnace exit is 796.7 C, against FHI Fig 8 840 C.
- RULE 0 count goes from 4 to 3 (no-snapshot baseline).

Tested (headless settle + 150 MW hold): see the picture file. Not tested: the sweep and the browser.
