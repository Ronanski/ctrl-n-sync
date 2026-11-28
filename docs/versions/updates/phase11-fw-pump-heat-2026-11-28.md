# Phase 11 FEEDWATER: BFWP pump heat from IF97, and the ARC recirculation heat back to the deaerator (NANA, 2026-11-28 PHT)

## Finding (sweep 745, 45 MW hold, quick sweep with the DA fields on main d79ebcb)
- The DA runs on extraction alone, matching HB case 7:
  - water 121.95 C vs 120.6;
  - pressure 1.15 G vs 1.03;
  - extraction 5.84 vs 5.79 T/H;
  - pegging 0.
- No.1 HPH out is 152.8 vs HB 150.3, and the final FW is 191.0 vs 188.6.
- **The +2.5 C is the BFWP pump heat.** One pump runs (DITL-23A), at constant speed (KSB curve Q43446D, 3580 rpm). At 167 m3/h it draws 1821 kW shaft power, which heats the water about 6 C. HB case 7 prints its own BFP dH of 3.4 kcal/kg (+1.5 C). The vendor curve is the physical pump, so it stays.

## Changes (fw.js)
- **Pump heat:**
  - Before: dT = (P - (1 - T beta) rho g Q H) / (m cp) used T beta 0.45 and cp 4.33 (158.4 C values) at every load.
  - Now: T beta and cp come from IF97 at the pumped water temperature (anWaterRho, fwHw). At 122 C, T beta is 0.34 and cp 4.25, so the 45 MW FW temperature drops about 0.4 C.
- **ARC recirculation (minimum flow 151 m3/h a pump, KSB data sheet):**
  - Before: below the minimum, the pump ran at the minimum flow, but the shaft heat of the recirculated water was lost.
  - Now: anFwStep writes U.fwRc (t/h back to the DA) and U.fwDh = P / m. anDeaStep adds wr x dh to the storage energy and to the steam-space condensing need (isenthalpic through the ARC valve). The mass leaves and returns, so it is not in U.daIn.
  - This acts only below about 142 T/H feedwater (start-up, low load).

## Tested (headless)
- Guards: no-snapshot, no-fit, one-path and u-const pass.
- fw lanes x4: PASS. 150 MW start (E.step 150 x 0.5 s) held 30 plant min: MW 151.0, no trip, deaerator water 106.3-106.6 t.
- tests/regress/feedwater.js: 1 FAIL, the same on main d79ebcb without this change (150 MW feedwater 458.5 vs the MB-019 CBD 15 target 473.3; the start line-up of the re-settle), not this PR.

## Not tested
- The live app.
- The full sweep (the phase thread runs it).
- st150 is not committed.
