# Phase 11 FEEDWATER: the last NO-SOURCE values closed from design and physics (NANA, 2026-11-28 PHT)

## Changes (fw.js, plant.js)
- **HP heater drain outlet line (LCV-HD1106 / -1105 normal and alternate):** the line loss beyond the valve was one fixed density (NO-SOURCE). It is now dP = k W^2 v_m. Here v_m is the homogeneous specific volume after an isenthalpic flash of the drain at the line pressure (IF97 region 1 + saturation). It is scaled from the valve sheet design point (T0, outlet pressure pp0 in AN_HDV). A drain that flashes more takes more line drop, from physics.
- **TCV-FW1150 characteristic:** it was linear (NO-SOURCE). It is now modified linear through the printed points of the L21 valve sheet: COND 1 Cv 5.37 at 87 %, COND 2 Cv 0.14 at 5 %, rated Cv 6.2.
- **BFWP motor current at part load:** it was a fixed efficiency of 0.962 at every load. The TECO AEZW-S2 rated losses, 3550 kW x (1/0.962 - 1), are now split into fixed and load (I^2R) losses, with the highest efficiency at 75 % load (fixed = load loss x 0.5625, DERIVED, the usual induction motor design point). The current is (shaft + fixed + load x L^2) / (sqrt3 x 6.6 kV) together with the magnetizing current.
- **HP heater tube leak:** the 3 mm hole and the 10 min doubling are labelled TRAINER-SET. They are the size of the fault the instructor starts, not plant values.
- **Suction line comment:** 12" SCH40 (line list K1AU3-L1-0-011 R0 sheet 21). The length is NOT IN DOCS; about 1.8 m/s, small against the strainer.
- **Hotwell return (plant.js anCycFlows, MEI finding):** the turbine steam the deaerator keeps is now U.daIn less the pegging steam (extraction no. 3 + the HP gland leak lk.b + the No.1 HPH normal drain). The old daTb + hpF1 - alternate drains left lk.b out, so the hotwell got 4.65 T/H too much at 150 MW.

## Tests
- tests/regress/feedwater.js: the BFWP current is judged by the same TECO loss law (the expected value follows the design law, not the model output). All plant snapshot references are removed from the test; the no-snapshot baseline goes 6 -> 0 for the file.

## Tested (headless)
- Guards: no-fit (0 new), one-path, u-const, no-snapshot pass.
- fw lanes, tests/regress/feedwater.js, and the 150 MW start at the app step (E.step 150 x 0.5 s) held 30 plant min: see the PR.

## Not tested
- The live app.
- The full 45-150 MW sweep (the phase thread runs it on main).

## Left
- fw.js ms0 472.7 (SNAPSHOT-TO-REPLACE): read only by unit.js anUnitTagStep, on the phase thread's list.
- The pump-to-valve line loss at start-up flows (NOT IN DOCS: the line length).
