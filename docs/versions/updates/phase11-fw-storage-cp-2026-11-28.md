# Phase 11 FEEDWATER: heater and deaerator heat storage from design (NANA, 2026-11-28 PHT)

The lag of the final feedwater temperature on a load change (about 1 to 6 C on the 90 -> 45 MW ramp) comes from the heat the heater and deaerator steel and water hold. Every term behind it now has a design or material source.

## Sources
- **Masses:**
  - K1AU3-D1-0-036 R0: H-1105 fabricated 22,200 kg / operating 29,300 kg, which is the heater alone (the 16,900 / 22,320 of the support table is one saddle of two); H-1106 25,700 / 29,000 kg.
  - K2MC2G-001 r3 + K2MC2F-001: deaerator 49,830 kg metal, 103.94 t water. These masses are unchanged.
- **Materials (YUA PC read 2026-11-28, /mnt/project-files/nana-heater-material-reads-2026-11-28.md):** HP heater shells SA516-70 + SA387-11 CL2, heads SA516-70; deaerator and storage tank SA516-70.

## Changes (fw.js)
- New `anSteelCp(T)`: plain carbon steel specific heat, Incropera & DeWitt Table A.1 (434 / 487 / 559 / 685 J/kg K at 300 / 400 / 600 / 800 K), a straight line between the points. It replaces the fixed 0.49 in the deaerator energy balance and the HP heater outlet lag (AN_DA.cm and AN_HP.cm are deleted).
- HP heater water cp: IF97 region 1 dh/dT at the tube pressure and the outlet temperature, in place of the fixed 4.4.

## Tested (headless)
- fw lanes: hp-heaters and deaerator pass.
- Guards: no-fit (0 new), one-path, u-const and no-snapshot pass.
- 150 MW start at the app step (E.step 150 x 0.5 s): held 30 plant min, MW 149.9, No.1 HPH out 195.9 C, no trip.

## Not tested
- The live app.
- The full sweep (the phase thread runs it).

## NOT IN DOCS
- The channel, tubes, tube sheet, tube count and tube size of H-1105 / H-1106. Their mass is inside the fabricated weight, at the same steel line.
