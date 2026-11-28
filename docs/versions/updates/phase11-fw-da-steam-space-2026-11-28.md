# Phase 11 FEEDWATER: deaerator steam space and the 90 MW extraction swing (NANA with MEI, 2026-11-28 PHT)

## Problem (RIN ramp check, MEI per-scan probe)
- At the 90 MW hold, the DA extraction draw flip-flopped every 2 scans, between -11 and +23 T/H. The LP draws followed it, giving about ±2.5 MW and ±3 % heat rate at a constant steam flow.
- **Cause 1:** the steam space pressure was the saturation of the 104 t storage water, and the flow came from the line dP. Every move of the stage went into the flow, and when the stage fell below the deaerator the flow reversed.
- **Cause 2:** the draw was computed from the stage pressure of the scan before. The turbine moved the stage by the draw change, and at a small margin dw/dP was large.

## Changes (fw.js anDeaStep)
- **Direct contact heater.** The steam space settles in seconds. The extraction is the steam that condensing the inflows needs, and the line law sets the steam space pressure below the stage (one root). When the stage cannot supply it, the storage water flashes and holds the pressure at its own saturation (pinned). Below 100 C the tank is vented.
- **No reverse flow.** XV-TS1710 / 1740 are azbil / KARATU VCL-5101-H swing checks with a spring-loaded air cylinder: NRV data sheets PVD-13-0074, TEQ / MT p1869-1874, YUA read /mnt/project-files/rin-extraction-2026-11-28.md. A reverse dP seats the disc.
- **The stage answers the draw in the same solve** (MEI, as unit.js anLphStep). It uses the Stodola ellipse chain behind the tap from the ports lp.exh, ext.lp1 ~ 3 and ext.w_lp: Pg(w) = Pxa - Sda (w - w0). Both the pinned and the unpinned cases are solved by bisection.

## Tests
- **tests/lanes/fw/deaerator.cjs:**
  - Case 4 (was: reverse flow on a stage collapse) now checks no reverse flow plus the flash cooling of the storage water under the condensate.
  - New case 5: a stage +10 % lifts the steam space above the storage saturation at once, and the steam equals the condensing need (within 2 %).
  - The design point (27.1 t/h, 158.4 C) and the 30-100 % sweep are unchanged and pass.

## Tested (headless)
- Guards: no-snapshot, no-fit, one-path and u-const pass.
- **MEI per-scan probe at 90 MW, 60 s:**
  - main: MW 85.9-93.2, DA draw -10.6 to +23.2.
  - This branch: MW 89.26-89.38, DA draw 9.3-10.3, LP draws 23.0-23.4, No.3 stage 1.21 ata, DA 4.00 G steady.
- fw lanes (bypass-spray, deaerator, hp-drains, hp-heaters) and tests/regress/feedwater.js: ALL PASS.
- 150 MW start at the app step (E.step 150 x 0.5 s): held 30 plant min, MW 151.0, no trip, deaerator water steady (106.3-106.6 t).

## Not tested
- The live app.
- The full sweep (the phase thread runs it).
- st150 is not committed; the phase thread re-settles it.

## 45 MW (not in this PR)
- No DA extraction at 45 MW comes from the PICCD1104 start SV of 1.5 kg/cm2 G, which is an old screen value. HB case 7 has the DA at 1.03 G with no pegging.
- SUZU and the phase thread set the start SV to 0.2 G (PCV-AS1030 COND 2, E2-0-123 R1 p42) in the next re-settle.
